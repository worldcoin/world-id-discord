import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import {NextApiRequest, NextApiResponse} from 'next'
import {createGuildCommands} from 'services/discord'

const clientId = process.env.DISCORD_APP_ID!
const clientSecret = process.env.DISCORD_APP_SECRET!
const scope = ['identify', 'bot', 'applications.commands'].join(' ')
const permissions = '268435456'

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res,{
    providers: [
      DiscordProvider({
        clientId,
        clientSecret,
        authorization: {params: {scope, permissions}},
      }),
    ],
    callbacks: {
      async signIn() {
        const guildId = req.query.guild_id as string
        await createGuildCommands(guildId)
        return true
      },
      jwt({ token, account }) {
        const guildId = req.query.guild_id as string
        if (guildId && account && account.access_token && account.refresh_token) {
          token.guildId = guildId
          token.id = account.providerAccountId
          token.accessToken = account.access_token
          token.refreshToken = account.refresh_token
        }
        return token
      },
      session({ session, token }) {
        session.user.guildId = token.guildId
        session.user.id = token.id
        session.user.accessToken = token.accessToken
        session.user.refreshToken = token.refreshToken
        return session
      }
    }
  })
}
