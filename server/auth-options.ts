import { createGuildCommands } from '@/lib/discord/create-guild-commands'
import { AuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'

const CLIENT_ID = process.env.DISCORD_APP_ID
const CLIENT_SECRET = process.env.DISCORD_APP_SECRET
const scope = ['identify', 'bot', 'applications.commands'].join(' ')
const permissions = '268435456'

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('DISCORD_APP_ID and DISCORD_APP_SECRET must be set')
}

export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      authorization: { params: { scope, permissions } },
    }),
  ],

  callbacks: {
    async signIn({ account }) {
      const guildId = account?.guild?.id

      if (!guildId) {
        return false
      }

      try {
        await createGuildCommands(guildId)
      } catch (error) {
        console.error('Error creating guild commands', error)
      }

      return true
    },

    async jwt({ token, account }) {
      const guildId = account?.guild?.id

      if (guildId) {
        token.guildId = guildId
        token.guildName = account?.guild?.name
        token.guildIcon = account?.guild?.icon
      }

      return token
    },

    async session({ session, token }) {
      const guildId = token.guildId

      if (guildId) {
        session.guild = {
          id: token.guildId,
          name: token.guildName,
          icon: token.guildIcon,
        }
      }

      return session
    },
  },
}
