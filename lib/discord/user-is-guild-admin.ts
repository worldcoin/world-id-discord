import { APIGuildMember, PermissionFlagsBits, Routes } from 'discord-api-types/v10'
import { discordRestApi } from './discord-rest-api'
import { getGuildData } from './get-guild-data'

export const userIsGuildAdmin = async (
  userId: string,
  guildId: string
): Promise<boolean> => {
  const [guild, member] = await Promise.all([
    getGuildData(guildId),
    discordRestApi.get(Routes.guildMember(guildId, userId)) as Promise<APIGuildMember>,
  ])

  if (guild.owner_id === userId) {
    return true
  }

  const everyoneRole = guild.roles.find(role => role.id === guildId)
  let permissions = BigInt(everyoneRole?.permissions ?? '0')

  for (const roleId of member.roles) {
    const role = guild.roles.find(r => r.id === roleId)

    if (role) {
      permissions |= BigInt(role.permissions)
    }
  }

  const allowedGuildManagementPermissions =
    PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageGuild

  return (permissions & allowedGuildManagementPermissions) !== BigInt(0)
}
