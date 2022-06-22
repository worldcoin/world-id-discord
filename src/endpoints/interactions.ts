import { START_VERIFICATION_COMMAND } from "@/world-id/slash-commands";
import { Duration, RemovalPolicy, Stack } from "aws-cdk-lib";
import type { NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import type { IQueue } from "aws-cdk-lib/aws-sqs";
import {
  Choice,
  Condition,
  JsonPath,
  LogLevel,
  Pass,
  Result,
  StateMachine,
  StateMachineType,
  Succeed,
  TaskInput,
} from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import type { Construct } from "constructs";

export class DiscordBotInitialResponseStateMachine extends StateMachine {
  constructor(
    scope: Construct,
    props: {
      queue: IQueue;
      publicKey: string;
      defaultLambdaProps?: Partial<NodejsFunctionProps>;
    },
  ) {
    const discordPayloadValidationLambda = new NodejsFunction(
      scope,
      "validation",
      props.defaultLambdaProps,
    );
    discordPayloadValidationLambda.addEnvironment(
      "BOT_PUBLIC_KEY",
      props.publicKey,
    );

    super(scope, "Discord Interaction Response State Machine", {
      stateMachineType: StateMachineType.EXPRESS,
      timeout: Duration.seconds(5), // must send an initial response within 3 seconds of receiving the event
      definition: new tasks.LambdaInvoke(
        scope,
        "Verify Discord interaction payload",
        {
          lambdaFunction: discordPayloadValidationLambda,
          payloadResponseOnly: true,
          resultPath: "$.validness",
        },
      ).next(
        new Choice(scope, "Is payload valid?")
          .when(
            Condition.booleanEquals("$.validness", true),
            new Choice(scope, "Is this PING from Discord?")
              .when(
                Condition.numberEquals("$.body.type", 1),
                new Pass(scope, "Respond with PONG", {
                  result: Result.fromObject({
                    statusCode: 200,
                    body: JSON.stringify({ type: 1 }),
                  }),
                }).next(new Succeed(scope, "Finish with PING response")),
              )
              .otherwise(
                new Choice(
                  scope,
                  `Is that "${START_VERIFICATION_COMMAND}" command?`,
                )
                  .when(
                    Condition.stringEquals(
                      "$.body.data.name",
                      START_VERIFICATION_COMMAND,
                    ),
                    new tasks.SqsSendMessage(
                      scope,
                      "Send interaction to processing",
                      {
                        queue: props.queue,
                        messageBody: TaskInput.fromJsonPathAt("$.body"),
                        resultPath: "$.sqs",
                      },
                    ).next(
                      new Pass(
                        scope,
                        "Respond with 200 and pending message...",
                        {
                          result: Result.fromObject({
                            statusCode: 200,
                            body: JSON.stringify({
                              type: 5 /*DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE*/,
                              data: {
                                flags: 64 /* ephemeral - https://discord.com/developers/docs/interactions/receiving-and-responding#create-followup-message */,
                              },
                            }),
                          }),
                        },
                      ),
                    ),
                  )
                  .otherwise(
                    new Pass(scope, "Resulting with code 404", {
                      result: Result.fromObject({
                        statusCode: 404,
                        body: JsonPath.format(
                          "Unknown command {}",
                          JsonPath.stringAt("$.body.data.name"),
                        ),
                      }),
                    }).next(
                      new Succeed(scope, "Finished due to unknown command"),
                    ),
                  ),
              ),
          )
          .otherwise(
            new Pass(scope, "Unauthorized", {
              result: Result.fromObject({ statusCode: 401 }),
            }),
          ),
      ),
      tracingEnabled: true,
      logs: {
        destination: new LogGroup(scope, "InteractionResponsesLogGroup", {
          logGroupName: `/aws/vendedlogs/states/${
            Stack.of(scope).stackName
          }-interaction-response-state-machine`,
          removalPolicy: RemovalPolicy.DESTROY,
          retention: RetentionDays.ONE_MONTH,
        }),
        includeExecutionData: true,
        level: LogLevel.ALL,
      },
    });
  }
}
