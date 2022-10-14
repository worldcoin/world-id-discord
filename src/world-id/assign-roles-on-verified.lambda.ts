import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import type { Handler } from "aws-lambda";

import { getEnv } from "@/utils/get-env";

import { getBotConfig } from "@/utils/get-bot-config";
import { REST } from "@discordjs/rest";
import type { RESTGetAPIGuildRolesResult } from "discord-api-types/v10";
import { Routes } from "discord-api-types/v10";
import type { UserCompletedVerification } from "./events";

const secretManager = new SecretsManagerClient({});

export const handler: Handler<UserCompletedVerification> = async (event) => {
  console.log("User completed verification", event);

  const guildBotConfig = await getBotConfig(event.guild_id);

  if (guildBotConfig.error) {
    throw Error(`No bot config for guild ${event.guild_id}`);
  }

  const botToken = (
    await secretManager.send(
      new GetSecretValueCommand({ SecretId: getEnv("TOKEN_SECRET_ARN") }),
    )
  ).SecretString;

  if (typeof botToken !== "string")
    throw new TypeError(`botToken secret is empty`);

  const rest = new REST({ version: "10" }).setToken(botToken);

  // trying to assign a role
  if (guildBotConfig.data.roles.length) {
    const existingRoles = (await rest.get(
      Routes.guildRoles(event.guild_id),
    )) as RESTGetAPIGuildRolesResult;

    const userRolesIds = event.user.roles.flatMap(
      (roleId) => existingRoles.find((r) => r.id === roleId)?.id ?? [],
    );

    const rolesToAssign = guildBotConfig.data.roles.filter(
      (roleId) => !userRolesIds.includes(roleId),
    );

    await Promise.all(
      rolesToAssign.map((roleId) =>
        rest.put(
          Routes.guildMemberRole(event.guild_id, event.user.id, roleId),
          { reason: "User successfully passed World ID verification" },
        ),
      ),
    );
  }
};
