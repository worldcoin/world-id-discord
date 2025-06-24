import { z } from 'zod'

const credentialsDataSchema = z.object({
  enabled: z.boolean(),
  roles: z.array(z.string()),
})

export const botConfigSchema = z.object({
  guild_id: z.string(),
  enabled: z.boolean(),
  device: credentialsDataSchema.optional(),
  orb: credentialsDataSchema,
})

export type CredentialsData = z.infer<typeof credentialsDataSchema>
export type BotConfig = z.infer<typeof botConfigSchema>
