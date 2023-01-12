import fetch from 'node-fetch'
import { verifyKey } from 'discord-interactions'
import {
  APIApplicationCommand,
  APIApplicationCommandInteraction,
  APIPingInteraction,
  InteractionType
} from 'discord-api-types/v10'

const DISCORD_APP_ID = process.env.DISCORD_APP_ID!
const DISCORD_APP_PUBLIC_KEY = process.env.DISCORD_APP_PUBLIC_KEY!
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!

export function verifyInteractionSignature(rawBody: string, signature: string, timestamp: string) {
  return verifyKey(rawBody, signature, timestamp, DISCORD_APP_PUBLIC_KEY)
}

export function isPingInteraction(
  data: APIPingInteraction | APIApplicationCommandInteraction
): data is APIPingInteraction {
  return data.type === InteractionType.Ping
}

export type CreateGlobalCommand = {
  type: APIApplicationCommand['type']
  name: APIApplicationCommand['name']
  description: APIApplicationCommand['description']
}

export const createGlobalCommand = (command: CreateGlobalCommand) => {
  return fetch(`https://discord.com/api/v10/applications/${DISCORD_APP_ID}/commands`, {
    method: 'POST',
    headers: {
      'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command)
  })
}
