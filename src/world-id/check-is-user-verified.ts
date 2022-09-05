import type { REST } from "@discordjs/rest";

import type {
  APIApplicationCommandInteraction,
  RESTGetAPIGuildRolesResult,
} from "discord-api-types/v10";

import { Routes } from "discord-api-types/v10";

export const checkIsUserAlreadyVerified = async ({
  message,
  rest,
  ROLES_TO_ASSIGN,
}: {
  message: APIApplicationCommandInteraction;
  rest: REST;
  ROLES_TO_ASSIGN: Array<string>;
}) => {
  if (!message.guild_id) {
    return false;
  }

  const existingRoles = (await rest.get(
    Routes.guildRoles(message.guild_id),
  )) as RESTGetAPIGuildRolesResult;

  const userRoles = message.member?.roles.flatMap(
    (roleId) => existingRoles.find((r) => r.id === roleId)?.name ?? [],
  );

  const isUserAlreadyValidated =
    userRoles !== undefined &&
    userRoles.length > 0 &&
    ROLES_TO_ASSIGN.length <= userRoles.length &&
    ROLES_TO_ASSIGN.every((verifiedRole) =>
      userRoles.some((role) => role === verifiedRole),
    );

  return isUserAlreadyValidated;
};
