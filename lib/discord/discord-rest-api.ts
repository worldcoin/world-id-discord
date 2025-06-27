import { REST } from '@discordjs/rest'

if (!process.env.DISCORD_BOT_TOKEN) {
  throw new Error('DISCORD_BOT_TOKEN is not set')
}

export const discordRestApi = new REST({ version: '10' }).setToken(
  process.env.DISCORD_BOT_TOKEN
)
