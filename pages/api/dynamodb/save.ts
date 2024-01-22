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

  return res.status(200).json({ message: 'OK' })
}
