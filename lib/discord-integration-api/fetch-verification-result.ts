import { VerificationResultItem } from '@/schemas/verification-result-item'
import { ApiResponse } from '@/types/discord-integration-api/api-response'
import { ExternalFetchError } from '@/utils/external-fetch-error'
import { generateAuthorizationHeader } from './generate-authorization-header'

export type FetchVerificationResultInput = {
  guildId: string
  nullifierHash: string
}

export const fetchVerificationResult = async ({
  guildId,
  nullifierHash,
}: FetchVerificationResultInput) => {
  const url = new URL('/discord/verification-result', process.env.DISCORD_INTEGRATION_API_URL)
  url.searchParams.set('guild_id', guildId)
  url.searchParams.set('nullifier_hash', nullifierHash)

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

    throw new ExternalFetchError('Failed to fetch verification result', {
      cause: {
        status: response.status,
        data: error,
      },
    })
  }

  const result = (await response.json()) as ApiResponse<VerificationResultItem | null>

  if (!result.success) {
    throw new Error(result.error)
  }

  return result.data
}
