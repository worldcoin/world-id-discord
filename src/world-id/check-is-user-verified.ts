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

  const verifiedUserRolesNames = message.member?.roles
    .flatMap((roleId) => existingRoles.find((r) => r.id === roleId)?.name ?? [])
    .sort();

  const isUserAlreadyValidated =
    verifiedUserRolesNames !== undefined &&
    verifiedUserRolesNames.length > 0 &&
    ROLES_TO_ASSIGN.length === verifiedUserRolesNames.length &&
    ROLES_TO_ASSIGN.sort().every(
      (element, index) => element === verifiedUserRolesNames[index],
    );

  return isUserAlreadyValidated;
};
