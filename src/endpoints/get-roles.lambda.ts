import { getEnv } from "@/utils/get-env";
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { REST } from "@discordjs/rest";
import type { APIGatewayProxyHandler } from "aws-lambda";
import { Routes } from "discord-api-types/v10";

const secretManager = new SecretsManagerClient({});

export const handler: APIGatewayProxyHandler = async (event) => {
  const { guild_id } = event.queryStringParameters ?? {};

  const botToken = (
    await secretManager.send(
      new GetSecretValueCommand({ SecretId: getEnv("TOKEN_SECRET_ARN") }),
    )
  ).SecretString;

  if (!botToken) {
    return {
      statusCode: 400,
      body: "Internal error. Can't receive bot token",
    };
  }

  if (!guild_id) {
    return {
      statusCode: 422,
      body: `guild_id is required but wasn't provided in querystring`,
    };
  }

  const rest = new REST({ version: "10" }).setToken(botToken);
  const roles = await rest.get(Routes.guildRoles(guild_id));

  return {
    statusCode: 200,
    body: JSON.stringify(roles),
  };
};
