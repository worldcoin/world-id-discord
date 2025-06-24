import { APIGuild, Routes } from 'discord-api-types/v10'
import { discordRestApi } from './discord-rest-api'

export const getGuildData = async (guildId: string) => {
  return (await discordRestApi.get(Routes.guild(guildId))) as APIGuild
}
