import { CredentialType } from '@/types/credential-type'
import { z } from 'zod'

export const verificationResultItemSchema = z.object({
  guild_id: z.string(),
  nullifier_hash: z.string(),
  signal_type: z.nativeEnum(CredentialType),
  user_id: z.string(),
})

export type VerificationResultItem = z.infer<typeof verificationResultItemSchema>
