declare namespace NodeJS {
  export interface ProcessEnv {
    DISCORD_APP_ID: string
    DISCORD_APP_PUBLIC_KEY: string
    DISCORD_BOT_TOKEN: string
    DISCORD_APP_SECRET: string

    // App URL
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string

    // AWS
    AWS_GUILDS_TABLE_NAME: string
    AWS_NULLIFIERS_TABLE_NAME: string
    AWS_DISCORD_BOUNCER_REGION: string
    AWS_DISCORD_BOUNCER_ACCESS_KEY_ID: string
    AWS_DISCORD_BOUNCER_SECRET_ACCESS_KEY: string

    // App ID
    APP_ID: string
    DEVELOPER_PORTAL_URL: string

    // PostHog
    POSTHOG_API_KEY: string
    POSTHOG_HOST: string

    // Maintenance flag
    NEXT_PUBLIC_MAINTENANCE_MODE_ENABLED: 'true' | 'false'
  }
}
