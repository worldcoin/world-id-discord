import { CredentialType } from '@/types/credential-type'
import { ApiResponse } from '@/types/discord-integration-api/api-response'
import { ExternalFetchError } from '@/utils/external-fetch-error'
import { generateAuthorizationHeader } from './generate-authorization-header'

export type SaveVerificationResultInput = {
  guildId: string
  nullifierHash: string
  credentialType: CredentialType
  userId: string
}

export const saveVerificationResult = async (input: SaveVerificationResultInput) => {
  const url = new URL('/discord/verification-result', process.env.DISCORD_INTEGRATION_API_URL)

  const response = await fetch(url.toString(), {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      Authorization: await generateAuthorizationHeader(),
    },

    body: JSON.stringify({
      guild_id: input.guildId,
      nullifier_hash: input.nullifierHash,
      signal_type: input.credentialType,
      user_id: input.userId,
    }),
  })

  if (!response.ok) {
    const error = await response.json()

    throw new ExternalFetchError('Failed to save verification result', {
      cause: {
        status: response.status,
        data: error,
      },
    })
  }

  const result = (await response.json()) as ApiResponse

  if (!result.success) {
    throw new Error(result.error)
  }

  return result.data
}
