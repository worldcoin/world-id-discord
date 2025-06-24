import { BotConfig } from '@/schemas/bot-config'
import { ApiResponse } from '@/types/discord-integration-api/api-response'
import { ExternalFetchError } from '@/utils/external-fetch-error'
import { generateAuthorizationHeader } from './generate-authorization-header'

/**
 * Fetches the bot config for a given guild ID from the DB.
 * @param guildId - The ID of the guild to fetch the bot config for.
 * @returns The bot config for the given guild ID.
 */
export const fetchBotConfig = async (guildId: string) => {
  const url = new URL('/discord/bot-config', process.env.DISCORD_INTEGRATION_API_URL)

  url.searchParams.set('guild_id', guildId)

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: await generateAuthorizationHeader(),
    },
  })

  if (!response.ok && response.status === 404) {
    return null
  }

  if (!response.ok) {
    const error = await response.json()

    throw new ExternalFetchError('Failed to fetch bot config', {
      cause: {
        status: response.status,
        data: error,
      },
    })
  }

  const result = (await response.json()) as ApiResponse<BotConfig>

  if (!result.success) {
    throw new Error(result.error)
  }

  return result.data
}
