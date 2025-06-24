import { Routes } from 'discord-api-types/v10'
import { discordRestApi } from './discord-rest-api'

export const assignGuildMemberRole = async (
  guildId: string,
  memberId: string,
  roleId: string
) => {
  return await discordRestApi.put(Routes.guildMemberRole(guildId, memberId, roleId))
}
