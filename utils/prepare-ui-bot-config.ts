import { BotConfig } from '@/schemas/bot-config'
import { ConfigFormValues } from '@/schemas/config-form'
import { APIRole } from 'discord-api-types/v10'
import { findRoles } from './find-roles'

export const prepareConfigFormInitialValues = ({
  botConfig,
  roles,
}: {
  botConfig: BotConfig | undefined | null
  roles: Array<APIRole>
  guild_id: string
}): ConfigFormValues => {
  if (!botConfig || !botConfig.orb) {
    return {
      botEnabled: false,
      deviceEnabled: false,
      deviceRoles: [],
      orbEnabled: true,
      orbRoles: [],
    }
  }

  return {
    botEnabled: botConfig.enabled ?? false,
    deviceEnabled: botConfig.device?.enabled ?? false,

    deviceRoles: findRoles({
      configRoles: botConfig.device?.roles,
      allRoles: roles,
    }),

    orbEnabled: botConfig.orb?.enabled ?? false,
    orbRoles: findRoles({ configRoles: botConfig.orb?.roles, allRoles: roles }),
  }
}
