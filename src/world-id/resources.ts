import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { EventBus, Rule, RuleTargetInput } from "aws-cdk-lib/aws-events";
import * as eventsTargets from "aws-cdk-lib/aws-events-targets";
import * as iam from "aws-cdk-lib/aws-iam";
import {
  Architecture,
  FunctionUrlAuthType,
  LayerVersion,
  type Function as Lambda,
} from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import {
  NodejsFunction,
  type NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { CfnApplication } from "aws-cdk-lib/aws-sam";
import type { ISecret } from "aws-cdk-lib/aws-secretsmanager";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

import { ON_VERIFIED_EVENT, WORLD_ID_EVENTS_SOURCE } from "./events";

export class WorldIdVerifier extends Construct {
  readonly queue: Queue;
  readonly processor: Lambda;
  readonly #dlq: Queue;

  constructor(
    scope: Construct,
    props: {
      defaultLambdaProps?: Partial<NodejsFunctionProps>;
      botToken: ISecret;
      tableName: string;
    },
  ) {
    super(scope, "World ID Verification Resources");

    this.#dlq = new Queue(this, "DLQ for World ID queue", {
      retentionPeriod: Duration.days(14),
      visibilityTimeout: Duration.minutes(15),
    });

    this.queue = new Queue(this, "World ID verification queue", {
      deadLetterQueue: {
        maxReceiveCount: 1,
        queue: this.#dlq,
      },
      visibilityTimeout: Duration.minutes(15),
    });

    const eventBus = new EventBus(this, "World ID EventBus");

    /** @see {@link https://github.com/charoitel/lambda-layer-canvas-nodejs} */
    const nodeCanvasLayer = new CfnApplication(this, "NodeCanvasLayer", {
      location: {
        applicationId:
          "arn:aws:serverlessrepo:us-east-1:990551184979:applications/lambda-layer-canvas-nodejs",
        semanticVersion: "2.9.3",
      },
    });
    nodeCanvasLayer.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const qrGenerator = new NodejsFunction(this, "qr-generator", {
      description: "Generates PNG image for QR code",
      ...(props.defaultLambdaProps ?? {}),
      architecture: Architecture.X86_64,
      timeout: Duration.seconds(10),
      memorySize: 1024,
      reservedConcurrentExecutions: 100,
      bundling: {
        ...(props.defaultLambdaProps?.bundling ?? {}),
        externalModules: [
          ...(props.defaultLambdaProps?.bundling?.externalModules ?? []),
          "canvas",
        ],
        loader: {
          ...(props.defaultLambdaProps?.bundling?.loader ?? {}),
          ".svg": "dataurl",
        },
        define: {
          self: "globalThis",
        },
      },
      layers: [
        LayerVersion.fromLayerVersionArn(
          this,
          "NodeCanvasLayerVersion",
          nodeCanvasLayer.getAtt("Outputs.LayerVersion").toString(),
        ),
      ],
    });

    const qrGeneratorUrl = qrGenerator.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ["*"],
        allowCredentials: true,
        maxAge: Duration.days(1),
      },
    });

    const rolesAssigningLambda = new NodejsFunction(
      this,
      "Role Assignment  Verification Success Handler",
      {
        ...(props.defaultLambdaProps ?? {}),
        description:
          "Assigns role(s) to an user on successful verification with World ID",
        timeout: Duration.seconds(20),
        entry: require.resolve("./assign-roles-on-verified.lambda.ts"),
      },
    );

    rolesAssigningLambda.addEnvironment("DYNAMODB_TABLE_NAME", props.tableName);

    rolesAssigningLambda.addEnvironment(
      "TOKEN_SECRET_ARN",
      props.botToken.secretArn,
    );
    props.botToken.grantRead(rolesAssigningLambda);

    const dynamodbManagedReadonlyPolicy =
      iam.ManagedPolicy.fromManagedPolicyArn(
        this,
        this.node.id,
        "arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess",
      );

    rolesAssigningLambda.role?.addManagedPolicy(dynamodbManagedReadonlyPolicy);

    new Rule(this, "On Verification Success", {
      description:
        "Emitted when an user successfully completed verification with World ID",
      eventBus,
      eventPattern: {
        source: [WORLD_ID_EVENTS_SOURCE],
        detailType: [ON_VERIFIED_EVENT],
      },
      targets: [
        new eventsTargets.LambdaFunction(rolesAssigningLambda, {
          event: RuleTargetInput.fromEventPath("$.detail"),
        }),
      ],
    });

    this.processor = new NodejsFunction(this, "queue-processing", {
      description:
        "Function that processes SQS messages and doing World ID verification flow",
      ...(props.defaultLambdaProps ?? {}),
      timeout: Duration.minutes(15),
      reservedConcurrentExecutions: 100,
      memorySize: 256,
      environment: {
        ...(props.defaultLambdaProps?.environment ?? {}),

        TOKEN_SECRET_ARN: props.botToken.secretArn,
        QR_GENERATOR_URL: qrGeneratorUrl.url,
        EVENT_BUS_NAME: eventBus.eventBusName,

        // Worldcoin ID related settings
        APP_NAME: this.node.tryGetContext("app_name"),
        SIGNAL: this.node.tryGetContext("signal"),
        SIGNAL_DESCRIPTION: this.node.tryGetContext("signal_description"),
        DYNAMODB_TABLE_NAME: props.tableName,
      },
    });
    this.processor.addEventSource(
      new SqsEventSource(this.queue, { batchSize: 1 }),
    );
    this.processor.role?.addManagedPolicy(dynamodbManagedReadonlyPolicy);
    props.botToken.grantRead(this.processor);
    eventBus.grantPutEventsTo(this.processor);
  }
}
