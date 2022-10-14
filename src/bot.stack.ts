import type { StackProps } from "aws-cdk-lib";
import { CfnOutput, Duration, Fn, RemovalPolicy, Stack } from "aws-cdk-lib";
import {
  AccessLogFormat,
  Cors,
  JsonSchemaType,
  LambdaIntegration,
  LogGroupLogDestination,
  RequestValidator,
  RestApi,
  StepFunctionsIntegration,
} from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import {
  Architecture,
  LambdaInsightsVersion,
  Runtime,
  Tracing,
} from "aws-cdk-lib/aws-lambda";
import type { NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { LogLevel, NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import type { Construct } from "constructs";
import { readFileSync } from "fs";
import { DiscordBotInitialResponseStateMachine } from "./endpoints/interactions";
import { WorldIdVerifier } from "./world-id/resources";

const COMMON_LAMBDAS_PROPS: Partial<NodejsFunctionProps> = {
  runtime: Runtime.NODEJS_16_X,
  tracing: Tracing.ACTIVE,
  insightsVersion: LambdaInsightsVersion.VERSION_1_0_119_0,
  architecture: Architecture.ARM_64,
  environment: {
    NODE_OPTIONS: "--enable-source-maps --disable-proto=throw",
  },
  bundling: {
    externalModules: ["aws-sdk"],
    target: "node16.14", // version from lambda 16.x runtime
    sourceMap: true,
    minify: true,
    logLevel: process.env.NODE_ENV === "test" ? LogLevel.ERROR : LogLevel.INFO,
    esbuildArgs: { "--legal-comments": "none", "--tree-shaking": true },
  },
};

export class WorldIdDiscordBotStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const botToken = Secret.fromSecretNameV2(
      this,
      "DiscordBotToken",
      (this.node.tryGetContext("bot_token") as string | undefined) ??
        "WorldIdDiscordBotToken",
    );
    const botClientSecret = Secret.fromSecretNameV2(
      this,
      "DiscordBotClientSecret",
      (this.node.tryGetContext("bot_secret") as string | undefined) ??
        "WorldIdDiscordBotClientSecret",
    );

    const table = new dynamodb.Table(this, "discord-bot-configs", {
      partitionKey: {
        name: "guild_id",
        type: dynamodb.AttributeType.STRING,
      },
    });

    table
      .autoScaleReadCapacity({
        minCapacity: 10,
        maxCapacity: 600,
      })
      .scaleOnUtilization({ targetUtilizationPercent: 40 });

    table
      .autoScaleWriteCapacity({
        minCapacity: 10,
        maxCapacity: 1200,
      })
      .scaleOnUtilization({ targetUtilizationPercent: 40 });

    const worldIdVerification = new WorldIdVerifier(this, {
      defaultLambdaProps: COMMON_LAMBDAS_PROPS,
      botToken,
      table: table,
    });

    // Create our API Gateway
    const discordBotAPI = new RestApi(this, "discord-bot-api", {
      description: "Discord Bot Api Endpoint",
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
      },
      deployOptions: {
        accessLogDestination: new LogGroupLogDestination(
          new LogGroup(this, "AccessLogs", {
            retention: RetentionDays.ONE_MONTH,
            removalPolicy: RemovalPolicy.DESTROY,
          }),
        ),
        accessLogFormat: AccessLogFormat.jsonWithStandardFields(),
        tracingEnabled: true,
      },
    });

    const sfnResponseTemplate = readFileSync(
      require.resolve("./vtl/step-function-response-with-status.vt"),
      "utf-8",
    );
    discordBotAPI.root.addMethod(
      "POST",
      StepFunctionsIntegration.startExecution(
        new DiscordBotInitialResponseStateMachine(this, {
          queue: worldIdVerification.queue,
          publicKey: scope.node.tryGetContext("bot_public_key") as string,
          defaultLambdaProps: COMMON_LAMBDAS_PROPS,
        }),
        {
          path: false,
          querystring: false,
          headers: true,
          integrationResponses: [
            {
              statusCode: "200",
              responseTemplates: {
                "application/json": sfnResponseTemplate,
              },
            },
          ],
        },
      ),
      {
        operationName: "DiscordInteractions",
        requestParameters: {
          "method.request.header.x-signature-ed25519": true,
          "method.request.header.x-signature-timestamp": true,
        },
        requestModels: {
          "application/json": discordBotAPI.addModel(
            "DiscordInteractionModel",
            {
              schema: {
                type: JsonSchemaType.OBJECT,
                properties: { type: { type: JsonSchemaType.INTEGER } },
                required: ["type"],
              },
            },
          ),
        },
        requestValidator: new RequestValidator(
          this,
          "Interactions Request Validator",
          {
            restApi: discordBotAPI,
            validateRequestParameters: true,
            validateRequestBody: true,
          },
        ),
      },
    );
    const getRoles = discordBotAPI.root.addResource("get-roles");

    const getRolesLambda = new NodejsFunction(this, "Get Server Roles", {
      ...COMMON_LAMBDAS_PROPS,
      entry: require.resolve("./endpoints/get-roles.lambda.ts"),
      timeout: Duration.minutes(1),
    });

    getRolesLambda.addEnvironment("TOKEN_SECRET_ARN", botToken.secretArn);

    botToken.grantRead(getRolesLambda);

    const oauth2callback = discordBotAPI.root.addResource("oauth2callback");
    const discordServerConfigurationLambda = new NodejsFunction(
      this,
      "Configure Discord Server lambda",
      {
        ...COMMON_LAMBDAS_PROPS,
        entry: require.resolve("./endpoints/oauth2-callback.lambda.ts"),
        timeout: Duration.minutes(1),
      },
    );
    discordServerConfigurationLambda.addEnvironment(
      "BOT_APP_ID",
      this.node.tryGetContext("bot_app_id") as string,
    );

    discordServerConfigurationLambda.addEnvironment(
      "DYNAMODB_TABLE_NAME",
      table.tableName,
    );

    table.grantReadData(discordServerConfigurationLambda);

    discordServerConfigurationLambda.addEnvironment(
      "TOKEN_SECRET_ARN",
      botToken.secretArn,
    );
    botToken.grantRead(discordServerConfigurationLambda);
    discordServerConfigurationLambda.addEnvironment(
      "CLIENT_SECRET_ARN",
      botClientSecret.secretArn,
    );
    botClientSecret.grantRead(discordServerConfigurationLambda);

    oauth2callback.addMethod(
      "GET",
      new LambdaIntegration(discordServerConfigurationLambda),
      {
        operationName: "DiscordOAuth2Callback",
        requestParameters: {
          "method.request.querystring.code": true,
          "method.request.querystring.guild_id": true,
          "method.request.querystring.permissions": true,
        },
        requestValidator: new RequestValidator(
          this,
          "OAuth Request Validator",
          { restApi: discordBotAPI, validateRequestParameters: true },
        ),
      },
    );

    getRoles.addMethod("GET", new LambdaIntegration(getRolesLambda), {
      operationName: "DiscordBotGetGuildRoles",
      requestParameters: {
        "method.request.querystring.guild_id": true,
      },
      requestValidator: new RequestValidator(
        this,
        "Get Roles Request Validator",
        { restApi: discordBotAPI, validateRequestParameters: true },
      ),
    });

    new CfnOutput(this, "OAuth2 Callback Url", {
      value: Fn.join("", [discordBotAPI.url, oauth2callback.path]),
    });
  }
}
