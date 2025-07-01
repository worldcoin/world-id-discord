import { fetchGuildRoles } from './fetch-guild-roles'

export const fetchAvailableGuildRoles = async (guildId: string) => {
  const guildRoles = await fetchGuildRoles(guildId)

  const botRole = guildRoles.find(
    guildRole => guildRole.tags?.bot_id === process.env.DISCORD_APP_ID
  )

  return guildRoles
    .filter(role => role.name !== '@everyone')
    .filter(guildRole => guildRole.position < botRole!.position)
}
