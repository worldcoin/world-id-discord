import { Routes, APIRole } from 'discord-api-types/v10'
import { discordRestApi } from './discord-rest-api'

export const fetchGuildRoles = async (guildId: string) => {
  return (await discordRestApi.get(Routes.guildRoles(guildId))) as APIRole[]
}
