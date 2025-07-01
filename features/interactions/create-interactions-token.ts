import { InteractionsJwtInput } from '@/types/interactions-jwt-input'
import crypto from 'crypto'

export const createInteractionsToken = async ({
  userId,
  guildId,
  discordToken,
}: InteractionsJwtInput) => {
  const timestamp = Math.floor(Date.now() / 1000)
  const data = `${userId}:${guildId}:${discordToken}:${timestamp}`

  const signature = crypto
    .createHmac('sha256', process.env.DISCORD_INTERACTION_TOKEN_SIGN_SECRET!)
    .update(data)
    .digest('base64url')

  return `${timestamp}.${signature}`
}
