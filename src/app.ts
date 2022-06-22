import { App } from "aws-cdk-lib";
import { WorldIdDiscordBotStack } from "./bot.stack";

const app = new App();

new WorldIdDiscordBotStack(
  app,
  (app.node.tryGetContext("stack_name") as string | undefined) ??
    "WorldID-Discord-Bot",
  {},
);

app.synth();
