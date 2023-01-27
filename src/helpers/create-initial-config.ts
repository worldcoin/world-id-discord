import { BotConfig } from 'common/types'
import { APIRole } from 'discord-api-types/v10'
import { findRoles } from './find-roles'

export const createInitialConfig = ({
  botConfig,
  roles,
  guild_id,
}: {
  botConfig: BotConfig | null
  roles: Array<APIRole>
  guild_id: string
}): BotConfig<'initial'> | null => {
  if (!botConfig || !botConfig.phone || !botConfig.orb) {
    return {
      enabled: false,
      guild_id,
      phone: {
        enabled: false,
        roles: [],
      },
      orb: {
        enabled: false,
        roles: [],
      },
    }
  }

  return {
    ...botConfig,
    phone: {
      ...botConfig.phone,
      roles: findRoles(botConfig.phone.roles, roles),
    },
    orb: {
      ...botConfig.orb,
      roles: findRoles(botConfig.orb.roles, roles),
    },
  }
}
