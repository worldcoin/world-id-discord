declare namespace NodeJS {
  export interface ProcessEnv {
    // App Environment
    NEXT_PUBLIC_APP_ENV: 'production' | 'staging' | 'development'
    NEXT_PUBLIC_APP_URL: string | undefined

    // Discord
    DISCORD_APP_ID: string | undefined
    DISCORD_APP_PUBLIC_KEY: string | undefined
    DISCORD_BOT_TOKEN: string | undefined
    DISCORD_APP_SECRET: string | undefined

    // App URL
    NEXTAUTH_URL: string | undefined
    NEXTAUTH_SECRET: string | undefined

    // Developer Portal
    NEXT_PUBLIC_APP_ID: `app_${string}` | undefined
    DEVELOPER_PORTAL_URL: string | undefined
    DEVELOPER_PORTAL_API_KEY: string | undefined

    // PostHog
    POSTHOG_API_KEY: string | undefined
    POSTHOG_HOST: string | undefined

    // Discord integration API
    DISCORD_INTEGRATION_API_URL: string | undefined
    DISCORD_INTEGRATION_API_SIGN_SECRET: string | undefined
    DISCORD_INTERACTION_TOKEN_SIGN_SECRET: string | undefined
  }
}
