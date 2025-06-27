import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    name: string | undefined | null
    email: string | undefined | null
    image: string | undefined | null
    id: string
  }

  interface Session {
    user: User
    guild: {
      id: string | undefined | null
      name: string | undefined | null
      icon: string | undefined | null
    }
  }

  interface Account {
    provider: string
    type: string
    providerAccountId: string
    token_type?: string
    access_token?: string
    expires_at?: number
    refresh_token?: string
    scope?: string
    guild?: {
      id: string
      name: string
      icon: string | null
      description: string | null
      owner_id: string
      features: string[]
      roles: Array<{
        id: string
        name: string
        permissions: number
        position: number
        color: number
        hoist: boolean
        managed: boolean
        mentionable: boolean
      }>
      verification_level: number
      preferred_locale: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    name: string | undefined | null
    email: string | undefined | null
    picture: string | undefined | null
    sub: string
    guildId: string | undefined | null
    guildName: string | undefined | null
    guildIcon: string | undefined | null
  }
}
