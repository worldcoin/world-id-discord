import { BotConfig } from 'common/types'
import { NextApiRequest, NextApiResponse } from 'next'
import { saveBotConfig, verifyBotConfig } from 'services/dynamodb'
import { PostHogClient } from 'services/posthog'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body as { botConfig: BotConfig; isFirstConnection: boolean; userId: string }
  const botConfig = body.botConfig
  const verifiedConfig = verifyBotConfig(botConfig)

  if (!verifiedConfig.status) {
    return res.status(400).json({ message: verifiedConfig.error?.message })
  }

  const result = await saveBotConfig(botConfig)

  if (!result.success) {
    return res.status(500).json({ message: result.error?.message })
  }

  const posthog = PostHogClient()
  const userId = body.userId

  if (body.isFirstConnection) {
    const captureResult = await posthog.capture({
      event: 'Discord integration guild connected',
      distinctId: userId,

      properties: {
        guild_id: botConfig.guild_id,
        $current_url: `${process.env.NEXTAUTH_URL}/api/dynamodb/save`,
      },
    })

    if (!captureResult.success) {
      console.error(captureResult.error)
    }
  }

  const captureResult = await posthog.capture({
    event: 'Discord integration guild config updated',
    distinctId: userId,

    properties: {
      guild_id: botConfig.guild_id,
      device: JSON.stringify(botConfig.device),
      orb: JSON.stringify(botConfig.orb),
      $current_url: `${process.env.NEXTAUTH_URL}/api/dynamodb/save`,
    },
  })

  if (!captureResult.success) {
    console.error(captureResult.error)
  }

  await posthog.shutdown()

  return res.status(200).json({ message: 'OK' })
}
