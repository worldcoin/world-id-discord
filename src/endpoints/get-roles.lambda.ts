import { getEnv } from "@/utils/get-env";
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { REST } from "@discordjs/rest";
import type { APIGatewayProxyHandler } from "aws-lambda";
import type { RESTGetAPIGuildRolesResult } from "discord-api-types/v10";
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

  let existingRoles: RESTGetAPIGuildRolesResult | null = null;

  try {
    existingRoles = (await rest.get(
      Routes.guildRoles(guild_id),
    )) as RESTGetAPIGuildRolesResult;
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message:
          "Error while getting roles from guild. Probably bot is not installed on this guild",
        error,
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(existingRoles),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
