/** @see {@link https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-redirect-url-example} */

import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { REST } from "@discordjs/rest";
import type { APIGatewayProxyHandler } from "aws-lambda";
import {
  Routes,
  type RESTGetAPIApplicationCommandsResult,
  type RESTGetAPIGuildRolesResult,
  type RESTPatchAPIGuildRoleJSONBody,
  type RESTPostOAuth2ClientCredentialsResult,
} from "discord-api-types/v10";

import { getBotConfig } from "@/utils/get-bot-config";
import { getEnv } from "@/utils/get-env";
import { commands } from "@/world-id/slash-commands";

const applicationId = getEnv("BOT_APP_ID");
const secretManager = new SecretsManagerClient({});

export const handler: APIGatewayProxyHandler = async (event) => {
  const { code, guild_id } = event.queryStringParameters ?? {};
  if (!code)
    return {
      statusCode: 422,
      body: `code is required but wasn't provided in querystring`,
    };
  if (!guild_id)
    return {
      statusCode: 422,
      body: `guild_id is required but wasn't provided in querystring`,
    };

  const guildBotConfig = await getBotConfig(guild_id);

  if (guildBotConfig.error) {
    console.error(guildBotConfig.error);

    return {
      statusCode: 422,
      // @FIXME add correct url for configuration page.
      body: `Please configure your bot settings first. You can update your configuration here: <Configuration Landing page>`,
    };
  }

  const CLIENT_SECRET = (
    await secretManager.send(
      new GetSecretValueCommand({ SecretId: getEnv("CLIENT_SECRET_ARN") }),
    )
  ).SecretString;
  if (typeof CLIENT_SECRET !== "string")
    throw new TypeError(`clientSecret secret is empty`);

  const botToken = (
    await secretManager.send(
      new GetSecretValueCommand({ SecretId: getEnv("TOKEN_SECRET_ARN") }),
    )
  ).SecretString;

  if (typeof botToken !== "string")
    throw new TypeError(`botToken secret is empty`);

  const rest = new REST({ version: "10" }).setToken(
    "Basic " +
      Buffer.from(applicationId + ":" + CLIENT_SECRET).toString("base64"),
  );

  // exchange OAuth2 token
  const token = (await rest.post(Routes.oauth2TokenExchange(), {
    passThroughBody: true,
    body: new URLSearchParams({
      client_id: applicationId,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: `https://${event.requestContext.domainName}${event.requestContext.path}`,
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })) as RESTPostOAuth2ClientCredentialsResult;

  console.log("Got token", JSON.stringify(token));

  rest.setToken(botToken);

  // Create slash commands
  const applicationCommands = (await rest.get(
    Routes.applicationGuildCommands(applicationId, guild_id),
  )) as RESTGetAPIApplicationCommandsResult | null;

  let updated = 0;
  if (applicationCommands?.length) {
    for (let i = commands.length - 1; i--; i >= 0) {
      const command = commands[i];
      const existingIndex = applicationCommands.findIndex(
        (ac) => ac.name === command.name,
      );
      if (existingIndex >= 0) {
        await rest.patch(
          Routes.applicationGuildCommand(
            applicationId,
            guild_id,
            applicationCommands[existingIndex].id,
          ),
          { body: command },
        );
        applicationCommands.splice(existingIndex);
        commands.splice(i);
        updated++;
      }
    }
    // remove outstanding application commands
    await Promise.all(
      applicationCommands.map((command) =>
        rest.delete(
          Routes.applicationGuildCommand(applicationId, guild_id, command.id),
          {
            body: command,
          },
        ),
      ),
    );
  }
  console.info("Updated commands: %d", updated);
  console.info("Deleted commands: %d", applicationCommands?.length ?? 0);
  // add new commands
  await Promise.all(
    commands.map((command) =>
      rest.post(Routes.applicationGuildCommands(applicationId, guild_id), {
        body: command,
      }),
    ),
  );
  console.log("Added commands: %d", commands.length);

  // Create roles
  const ROLES_TO_ASSIGN = guildBotConfig.data.roles;
  if (ROLES_TO_ASSIGN.length) {
    const existingRoles = (await rest.get(
      Routes.guildRoles(guild_id),
    )) as RESTGetAPIGuildRolesResult;
    console.log("Server existing roles:", existingRoles);

    const rolesToCreate = ROLES_TO_ASSIGN.filter(
      (r) => !existingRoles.some((role) => role.name === r),
    );
    if (rolesToCreate.length)
      await Promise.all(
        rolesToCreate
          .map(
            (name): RESTPatchAPIGuildRoleJSONBody => ({
              name,
              color: 0x5a42f5,
            }),
          )
          .map((body) =>
            rest.post(Routes.guildRoles(guild_id), {
              body,
            }),
          ),
      );
  }

  return {
    statusCode: 302,
    headers: {
      location: `https://discord.com/channels/${guild_id}`,
    },
    body: "",
    isBase64Encoded: false,
  };
};
