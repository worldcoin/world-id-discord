import { fetchBotConfig } from '@/lib/discord-integration-api/fetch-bot-config'
import { saveBotConfig } from '@/lib/discord-integration-api/save-bot-config'
import { authOptions } from '@/server/auth-options'
import { BotConfig } from '@/schemas/bot-config'
import { internalErrorResponse } from '@/utils/error-response'
import { genericError } from '@/utils/generic-errors'
import { safeCall } from '@/utils/safe-call'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { ConfigFormValues } from '@/schemas/config-form'

export const GET = async () => {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.guild.id) {
    return internalErrorResponse(genericError.unauthorized)
  }

  if (!process.env.DISCORD_INTEGRATION_API_URL) {
    return internalErrorResponse(genericError.environmentIsMisconfigured)
  }

  const {
    success: fetchBotConfigSuccess,
    data: botConfig,
    error: fetchBotConfigError,
  } = await safeCall(fetchBotConfig)(session.guild.id)

  if (!fetchBotConfigSuccess) {
    return internalErrorResponse({ message: fetchBotConfigError.message, code: 500 })
  }

  return NextResponse.json(botConfig)
}

export const POST = async (request: Request) => {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.guild.id) {
    return internalErrorResponse(genericError.unauthorized)
  }

  const body = (await request.json()) as ConfigFormValues

  const botConfig: BotConfig = {
    guild_id: session.guild.id,
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
    guildId: session.guild.id,
    botConfig,
  })

  if (!success) {
    return internalErrorResponse({ message: error.message, code: 500 })
  }

  return NextResponse.json({ success })
}
