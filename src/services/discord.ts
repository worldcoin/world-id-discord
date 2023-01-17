import {REST} from '@discordjs/rest'
import {Guild} from 'common/types'
import {
  APIApplicationCommand,
  APIApplicationCommandInteraction,
  APIPingInteraction,
  APIRole,
  ApplicationCommandType,
  InteractionType,
  Routes,
} from 'discord-api-types/v10'
import {verifyKey} from 'discord-interactions'

const DISCORD_APP_ID = process.env.DISCORD_APP_ID!
const DISCORD_APP_PUBLIC_KEY = process.env.DISCORD_APP_PUBLIC_KEY!
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!

const rest = new REST({version: '10'}).setToken(DISCORD_BOT_TOKEN)

export function verifyInteractionSignature(rawBody: string, signature: string, timestamp: string) {
  return verifyKey(rawBody, signature, timestamp, DISCORD_APP_PUBLIC_KEY)
}

export function isPingInteraction(
  data: APIPingInteraction | APIApplicationCommandInteraction,
): data is APIPingInteraction {
  return data.type === InteractionType.Ping
}

type Command = {
  type: APIApplicationCommand['type']
  name: APIApplicationCommand['name']
  description: APIApplicationCommand['description']
}

export const createGuildCommands = async (guildId: string) => {
  const command: Command = {
    type: ApplicationCommandType.ChatInput,
    name: 'verify',
    description: 'verifying with WorldID',
  }

  return await rest.post(Routes.applicationGuildCommands(DISCORD_APP_ID, guildId), {
    body: command,
  })
}

export const getGuildRoles = async (guildId: string) => {
  return (await rest.get(Routes.guildRoles(guildId))) as APIRole[]
}

export const getGuildData = async (guildId: string) => {
  return (await rest.get(Routes.guild(guildId))) as Guild
}
