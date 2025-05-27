import { BotConfig } from 'common/types'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { saveBotConfig, verifyBotConfig } from 'services/dynamodb'
import { PostHogClient } from 'services/posthog'
import { baseAuthOptions } from '~/pages/api/auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, baseAuthOptions)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = await getToken({ req })
  const body = req.body as { botConfig: BotConfig; isFirstConnection: boolean; userId: string }
  const botConfig = body.botConfig
  const verifiedConfig = verifyBotConfig(botConfig)

  if (token?.guildId !== botConfig.guild_id) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (!verifiedConfig.status) {
    return res.status(400).json({ message: verifiedConfig.error?.message })
  }

  const result = await saveBotConfig(botConfig)

  if (!result.success) {
    return res.status(500).json({ message: result.error?.message })
  }

  if (process.env.NODE_ENV === 'production') {
    const posthog = PostHogClient()
    const userId = body.userId

    if (body.isFirstConnection) {
      const captureResult = await posthog.capture({
        event: 'discord integration app added',
        distinctId: userId,

        properties: {
          guild_id: botConfig.guild_id,
        },
      })

      if (!captureResult.success) {
        console.error(captureResult.error)
      }
    }

    const captureResult = await posthog.capture({
      event: 'discord integration config updated',
      distinctId: userId,

      properties: {
        guild_id: botConfig.guild_id,
        is_enabled: botConfig.enabled,
        is_device_enabled: botConfig.device?.enabled,
        is_orb_enabled: botConfig.orb?.enabled,
      },
    })

    if (!captureResult.success) {
      console.error(captureResult.error)
    }

    await posthog.shutdown()
  }

  return res.status(200).json({ message: 'OK' })
}
