import { discordRestApi } from '@/lib/discord/discord-rest-api'

import { APIApplicationCommand, ApplicationCommandType, Routes } from 'discord-api-types/v10'

type Command = {
  type: APIApplicationCommand['type']
  name: APIApplicationCommand['name']
  description: APIApplicationCommand['description']
}

export const createGuildCommands = async (guildId: string) => {
  if (!process.env.DISCORD_APP_ID) {
    throw new Error('DISCORD_APP_ID is not set')
  }

  const command: Command = {
    type: ApplicationCommandType.ChatInput,
    name: 'verify',
    description: 'Verify your account with World ID',
  }

  return await discordRestApi.post(
    Routes.applicationGuildCommands(process.env.DISCORD_APP_ID, guildId),
    { body: command }
  )
}
