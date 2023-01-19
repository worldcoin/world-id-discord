import {DefaultSession} from 'next-auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      guildId: string
      id: string
      accessToken: string
      refreshToken: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    guildId: string
    id: string
    accessToken: string
    refreshToken: string
  }
}
