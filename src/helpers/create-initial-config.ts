import {BotConfig} from 'common/types'
import {APIRole} from 'discord-api-types/v10'
import {findRoles} from './find-roles'

export const createInitialConfig = (
  config: BotConfig | null,
  allRoles: Array<APIRole>,
): BotConfig<'initial'> | null => {
  if (!config || !config.phone || !config.orb) {
    return null
  }

  return {
    ...config,
    phone: {
      ...config.phone,
      roles: findRoles(config.phone.roles, allRoles),
    },
    orb: {
      ...config.orb,
      roles: findRoles(config.orb.roles, allRoles),
    },
  }
}
