import type { BotConfig } from '.'

export type GetBotConfigResult =
  | {
      data: BotConfig
      error?: never
    }
  | {
      data?: null
      error: Error
    }
