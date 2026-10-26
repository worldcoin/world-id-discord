import { IDKitResult } from '@worldcoin/idkit-core'
import { z } from 'zod'

const responseItemSchema = z
  .object({
    identifier: z.string(),
    signal_hash: z.string().optional(),
    nullifier: z.string(),
  })
  .passthrough()

/**
 * Runtime shape of an IDKit 4 uniqueness result (protocol 3.0 legacy proofs
 * and 4.0 proofs). Only the fields the server consumes are validated here; the
 * payload is forwarded to the Developer Portal verify endpoint as received.
 */
export const idKitResultSchema = z
  .object({
    protocol_version: z.enum(['3.0', '4.0']),
    nonce: z.string(),
    action: z.string().optional(),
    action_description: z.string().optional(),
    environment: z.string().optional(),
    responses: z.array(responseItemSchema).min(1),
  })
  .passthrough()

export const verificationCompleteInputSchema = z.object({
  guildId: z.string(),
  userId: z.string(),
  token: z.string(),
  interactionsToken: z.string(),

  result: idKitResultSchema,
})

export type VerificationCompleteInput = Omit<
  z.infer<typeof verificationCompleteInputSchema>,
  'result'
> & {
  result: IDKitResult
}

export type VerificationResultPayload = z.infer<typeof idKitResultSchema>
