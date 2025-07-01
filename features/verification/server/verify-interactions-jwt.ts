import { InteractionsJwtInput } from '@/types/interactions-jwt-input'
import crypto from 'crypto'

const SECRET = process.env.DISCORD_INTERACTION_TOKEN_SIGN_SECRET!

export const verifyInteractionsToken = async ({
  interactionsToken: token,
  userId,
  guildId,
  discordToken,
}: InteractionsJwtInput & { interactionsToken: string }) => {
  const [timestampStr, signature] = token.split('.')

  if (!timestampStr || !signature) {
    throw new Error('Invalid token format')
  }

  // ANCHOR: Check if token is expired
  const timestamp = parseInt(timestampStr)
  const now = Math.floor(Date.now() / 1000)
  const age = now - timestamp
  const TTL_SECONDS = 15 * 60 // 15 minutes

  if (age > TTL_SECONDS) {
    throw new Error(`Token expired ${age - TTL_SECONDS} seconds ago`)
  }

  const data = `${userId}:${guildId}:${discordToken}:${timestamp}`
  const expectedSignature = crypto.createHmac('sha256', SECRET).update(data).digest('base64url')

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature, 'base64url'),
      Buffer.from(expectedSignature, 'base64url')
    )
  ) {
    throw new Error('Invalid token signature')
  }
}
