import { Option } from 'Admin/types/option'

export type CredentialsData<T extends 'initial' | void = void> = {
  enabled: boolean
  roles: T extends 'initial' ? Array<Option> : Array<string>
}

export type BotConfig<T extends 'initial' | void = void> = {
  enabled: boolean
  guild_id: string
  phone: CredentialsData<T>
  orb: CredentialsData<T>
}
