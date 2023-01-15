import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import {NextApiRequest, NextApiResponse} from 'next'
import {createGuildCommands} from 'services/discord'

const clientId = process.env.DISCORD_APP_ID!
const clientSecret = process.env.DISCORD_APP_SECRET!
const scopes = ['identify', 'bot', 'applications.commands'].join(' ')

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res,{
    providers: [
      DiscordProvider({
        clientId,
        clientSecret,
        authorization: {params: {scope: scopes}},
      }),
    ],
    callbacks: {
      async signIn() {
        const guildId = req.query.guild_id as string
        await createGuildCommands(guildId)
        return true
      },
    }
  })
}
