import {APIRole} from 'discord-api-types/v10'

export const findRoles = (configRoles: Array<string>, allRoles: Array<APIRole>) => {
  return configRoles.map((roleId) => {
    const role = allRoles.find((r) => r.id === roleId) as APIRole

    return {
      label: role.name,
      value: role.id,
    }
  })
}
