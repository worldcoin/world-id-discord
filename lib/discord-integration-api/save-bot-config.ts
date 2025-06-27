import { BotConfig } from '@/schemas/bot-config'
import { BotConfigPostResponse } from '@/types/discord-integration-api/bot-config-post-response'
import { ExternalFetchError } from '@/utils/external-fetch-error'
import { generateAuthorizationHeader } from './generate-authorization-header'

export type SaveBotConfigInput = { botConfig: BotConfig; guildId: string }

/**
 * Saves the bot config for a given guild ID to the DB.
 * @param botConfig - The bot config to save.
 * @param guildId - The ID of the guild to save the bot config for.
 */
export const saveBotConfig = async ({ botConfig, guildId }: SaveBotConfigInput) => {
  const url = new URL('/discord/bot-config', process.env.DISCORD_INTEGRATION_API_URL)

  url.searchParams.set('guildId', guildId)

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: await generateAuthorizationHeader(),
    },
    body: JSON.stringify({ guild_id: guildId, bot_config: botConfig }),
  })

  if (!response.ok) {
    const error = await response.json()

    throw new ExternalFetchError('Failed to save bot config', {
      cause: {
        status: response.status,
        data: error,
      },
    })
  }

  const data = (await response.json()) as BotConfigPostResponse

  if (!data.success) {
    throw new Error(data.error)
  }
}
