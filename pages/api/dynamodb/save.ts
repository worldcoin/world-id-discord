import { NextApiRequest, NextApiResponse } from 'next'
import { saveBotConfig, verifyBotConfig } from 'services/dynamodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const botConfig = req.body

  if (!verifyBotConfig(botConfig).status) {
    return res.status(400).json({ message: 'Bad request' })
  }

  const result = await saveBotConfig(botConfig)

  if (!result.success) {
    return res.status(500).json({ message: result.error?.message })
  }

  return res.status(200).json({ message: 'OK' })
}
