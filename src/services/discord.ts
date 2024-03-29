import { REST } from '@discordjs/rest'
import {
  APIApplicationCommand,
  APIApplicationCommandInteraction,
  APIEmbed,
  APIGuild,
  APIPingInteraction,
  APIRole,
  ApplicationCommandType,
  InteractionType,
  RESTPostAPIChannelMessageJSONBody,
  Routes,
} from 'discord-api-types/v10'
import { verifyKey } from 'discord-interactions'

const DISCORD_APP_ID = process.env.DISCORD_APP_ID!
const DISCORD_APP_PUBLIC_KEY = process.env.DISCORD_APP_PUBLIC_KEY!
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!

const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN)

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
    description: 'Verify your account with World ID',
  }

  return await rest.post(Routes.applicationGuildCommands(DISCORD_APP_ID, guildId), {
    body: command,
  })
}

export const getGuildRoles = async (guildId: string) => {
  return (await rest.get(Routes.guildRoles(guildId))) as APIRole[]
}

export const getGuildData = async (guildId: string) => {
  return (await rest.get(Routes.guild(guildId))) as APIGuild
}

export const getAvailableGuildRoles = async (guildId: string) => {
  const guildRoles = await getGuildRoles(guildId)
  const botRole = guildRoles.find((guildRole) => guildRole.tags?.bot_id === DISCORD_APP_ID)
  return guildRoles
    .filter((role) => role.name !== '@everyone')
    .filter((guildRole) => guildRole.position < botRole!.position)
}

export const assignGuildMemberRole = async (guildId: string, memberId: string, roleId: string) => {
  return await rest.put(Routes.guildMemberRole(guildId, memberId, roleId))
}

export const removeGuildMemberRole = async (guildId: string, memberId: string, roleId: string) => {
  return await rest.delete(Routes.guildMemberRole(guildId, memberId, roleId))
}

export const editInteractionMessage = async (interactionToken: string, embeds: APIEmbed[]) => {
  const body: RESTPostAPIChannelMessageJSONBody = {
    embeds,
    components: [],
  }
  return await rest.patch(Routes.webhookMessage(DISCORD_APP_ID, interactionToken), {
    body,
  })
}
