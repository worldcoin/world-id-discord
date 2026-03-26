import { fetchBotConfig } from '@/lib/discord-integration-api/fetch-bot-config'
import { saveBotConfig } from '@/lib/discord-integration-api/save-bot-config'
import { BotConfig } from '@/schemas/bot-config'
import { ConfigFormValues } from '@/schemas/config-form'
import { requireGuildAdmin } from '@/server/require-guild-admin'
import { internalErrorResponse } from '@/utils/error-response'
import { genericError } from '@/utils/generic-errors'
import { safeCall } from '@/utils/safe-call'
import { NextResponse } from 'next/server'

export const GET = async () => {
  const guard = await requireGuildAdmin()

  if (!guard.authorized) {
    return guard.response
  }

  if (!process.env.DISCORD_INTEGRATION_API_URL) {
    return internalErrorResponse(genericError.environmentIsMisconfigured)
  }

  const {
    success: fetchBotConfigSuccess,
    data: botConfig,
    error: fetchBotConfigError,
  } = await safeCall(fetchBotConfig)(guard.guildId)

  if (!fetchBotConfigSuccess) {
    return internalErrorResponse({ message: fetchBotConfigError.message, code: 500 })
  }

  return NextResponse.json(botConfig)
}

export const POST = async (request: Request) => {
  const guard = await requireGuildAdmin()

  if (!guard.authorized) {
    return guard.response
  }

  const body = (await request.json()) as ConfigFormValues

  const botConfig: BotConfig = {
    guild_id: guard.guildId,
    enabled: body.botEnabled,

    device: {
      enabled: body.deviceEnabled,
      roles: body.deviceRoles.map(role => role.value),
    },

    orb: {
      enabled: body.orbEnabled,
      roles: body.orbRoles.map(role => role.value),
    },
  }

  const { success, error } = await safeCall(saveBotConfig)({
    guildId: guard.guildId,
    botConfig,
  })

  if (!success) {
    return internalErrorResponse({ message: error.message, code: 500 })
  }

  return NextResponse.json({ success })
}
