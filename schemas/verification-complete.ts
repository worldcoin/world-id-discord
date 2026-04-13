import { VerificationLevel } from '@worldcoin/idkit-core'
import { z } from 'zod'

export const verificationCompleteInputSchema = z.object({
  guildId: z.string(),
  userId: z.string(),
  token: z.string(),
  interactionsToken: z.string(),

  result: z.object({
    proof: z.string(),
    merkle_root: z.string(),
    nullifier_hash: z.string(),
    verification_level: z.nativeEnum(VerificationLevel),
  }),
})

export type VerificationCompleteInput = z.infer<typeof verificationCompleteInputSchema>
