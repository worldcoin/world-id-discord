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
  if (!botConfig || !botConfig.orb) {
    return {
      enabled: false,
      guild_id,
      device: {
        enabled: true,
        roles: [],
      },
      orb: {
        enabled: true,
        roles: [],
      },
    }
  }

  return {
    ...botConfig,
    device: {
      ...botConfig.device,
      roles: findRoles(botConfig.device.roles, roles),
    },
    orb: {
      ...botConfig.orb,
      roles: findRoles(botConfig.orb.roles, roles),
    },
  }
}
