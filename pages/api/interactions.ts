import type { NextApiRequest, NextApiResponse } from 'next'
import { isPingInteraction, verifyInteractionSignature } from 'services/discord'
import {
  APIApplicationCommandInteraction,
  APIPingInteraction,
  APIInteractionResponse,
  APIInteractionResponseChannelMessageWithSource,
  APIInteractionResponsePong,
  InteractionResponseType
} from 'discord-api-types/v10'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<APIInteractionResponse>) {
  const signature = req.headers['x-signature-ed25519']
  const timestamp = req.headers['x-signature-timestamp']
  if (typeof signature !== 'string' || typeof timestamp !== 'string') {
    return res.status(401).end('invalid request signature')
  }
  const rawBody = await new Promise<string>((resolve) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => {
      resolve(Buffer.from(data).toString())
    })
  })
  const isVerified = verifyInteractionSignature(rawBody, signature, timestamp)
  if (!isVerified) {
    return res.status(401).end('invalid request signature')
  }
  const data = JSON.parse(rawBody) as APIApplicationCommandInteraction | APIPingInteraction
  if (isPingInteraction(data)) {
    const payload: APIInteractionResponsePong = {
      type: InteractionResponseType.Pong
    }
    return res.status(200).json(payload)
  }
  const payload: APIInteractionResponseChannelMessageWithSource = {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: 'Pong'
    }
  }
  return res.status(200).json(payload)
}
