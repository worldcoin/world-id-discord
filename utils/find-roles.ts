import { APIRole } from 'discord-api-types/v10'

export const findRoles = (params: {
  configRoles?: Array<string>
  allRoles: Array<APIRole>
}) => {
  if (!params.configRoles) {
    return []
  }

  const roles = []

  for (const configRole of params.configRoles) {
    const role = params.allRoles.find(r => r.id === configRole)

    if (role) {
      roles.push({
        label: role.name,
        value: role.id,
      })
    }
  }

  return roles
}
