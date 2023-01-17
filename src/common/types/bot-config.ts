type CredentialsData = {
  enabled: boolean
  roles: Array<string>
}

export type BotConfig = {
  action_id: string
  enabled: boolean
  guild_id: string
  phone: CredentialsData
  orb: CredentialsData
}
