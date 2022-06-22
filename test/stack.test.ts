import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { WorldIdDiscordBotStack } from "../src/bot.stack";

test("Snapshot", () => {
  const app = new App();
  const stack = new WorldIdDiscordBotStack(app, "test");

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});
