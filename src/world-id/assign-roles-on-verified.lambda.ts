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

  const ROLES_TO_ASSIGN = guildBotConfig.data.roles;

  const botToken = (
    await secretManager.send(
      new GetSecretValueCommand({ SecretId: getEnv("TOKEN_SECRET_ARN") }),
    )
  ).SecretString;

  if (typeof botToken !== "string")
    throw new TypeError(`botToken secret is empty`);

  const rest = new REST({ version: "10" }).setToken(botToken);

  // trying to assign a role
  if (ROLES_TO_ASSIGN.length) {
    const existingRoles = (await rest.get(
      Routes.guildRoles(event.guild_id),
    )) as RESTGetAPIGuildRolesResult;
    console.log("Server existing roles:", existingRoles);

    const userRolesName = event.user.roles.flatMap(
      (roleId) => existingRoles.find((r) => r.id === roleId)?.name ?? [],
    );

    const rolesToAssign = ROLES_TO_ASSIGN.filter(
      (roleName) => !userRolesName.includes(roleName),
    );
    const rolesIds = rolesToAssign.flatMap(
      (name) => existingRoles.find((r) => r.name === name)?.id ?? [],
    );

    await Promise.all(
      rolesIds.map((roleId) =>
        rest.put(
          Routes.guildMemberRole(event.guild_id, event.user.id, roleId),
          { reason: "User successfully passed World ID verification" },
        ),
      ),
    );
  }
};
