import { APIRole } from 'discord-api-types/v10'

export const findRoles = (configRoles: Array<string>, allRoles: Array<APIRole>) => {
  const roles = []

  for (const configRole of configRoles) {
    const role = allRoles.find((r) => r.id === configRole)

    if (role) {
      roles.push({
        label: role.name,
        value: role.id,
      })
    }
  }

  return roles
}
