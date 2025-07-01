import { fetchGuildRoles } from './fetch-guild-roles'

export const ensureGuildRolesExist = async (guildId: string, rolesToAssign: string[]) => {
  const guildRoles = await fetchGuildRoles(guildId)
  return rolesToAssign.every(roleId => guildRoles.some(role => role.id === roleId))
}
