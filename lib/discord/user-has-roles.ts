import { APIGuildMember, Routes } from 'discord-api-types/v10'
import { discordRestApi } from './discord-rest-api'

export const userHasRoles = async (
  userId: string,
  guildId: string,
  roles: string[]
): Promise<boolean> => {
  const guildMember = (await discordRestApi.get(
    Routes.guildMember(guildId, userId)
  )) as APIGuildMember

  return roles.every(role => guildMember.roles.includes(role))
}
