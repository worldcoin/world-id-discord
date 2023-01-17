import {Option} from 'Admin/types/option'

type CredentialsData<T extends 'initial' | void = void> = {
  enabled: boolean
  roles: T extends 'initial' ? Array<Option> : Array<string>
}

export type BotConfig<T extends 'initial' | void = void> = {
  action_id: string
  enabled: boolean
  guild_id: string
  phone: CredentialsData<T>
  orb: CredentialsData<T>
}
