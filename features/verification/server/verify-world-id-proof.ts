import { resolveWorldIdEnvironment } from '@/lib/world-id/resolve-environment'
import { resolveRpId } from '@/lib/world-id/resolve-rp-id'
import { VerificationResultPayload } from '@/schemas/verification-complete'
import { CredentialType } from '@/types/credential-type'
import { hashSignal } from '@worldcoin/idkit-core/hashing'
import { Nullifier } from '@worldcoin/idkit-server/nullifier'

export type WorldIdProofResultItem = {
  identifier: string
  success: boolean
  nullifier?: string
  code?: string
  detail?: string
}

export type WorldIdProofVerification =
  | {
      success: true
      action: string
      nullifier: string
      protocolVersion: '3.0' | '4.0'
      results: WorldIdProofResultItem[]
    }
  | {
      success: false
      code: string
      detail: string
      results: WorldIdProofResultItem[]
    }

type DeveloperPortalVerifyResponse = {
  success?: boolean
  action?: string
  nullifier?: string
  protocol_version?: '3.0' | '4.0'
  environment?: string
  code?: string
  detail?: string
  results?: WorldIdProofResultItem[]
}

const DEVELOPER_PORTAL_BASE_URL = 'https://developer.world.org'

export class ProofEnvironmentError extends Error {}

/**
 * Asserts that a forwarded IDKit result was produced in the environment this
 * deployment accepts.
 *
 * The Developer Portal verifies a proof in whichever environment the result
 * names, and an RP registered in both production and staging would otherwise
 * accept a World ID Simulator proof (environment `staging`) on a production
 * deployment. IDKit 4 stamps every result with its environment; a result that
 * names a different one is rejected before any verification call is made.
 */
export const assertProofEnvironment = (result: VerificationResultPayload) => {
  const expected = resolveWorldIdEnvironment()

  if (result.environment !== undefined && result.environment !== expected) {
    throw new ProofEnvironmentError(
      `Proof environment "${result.environment}" does not match the expected environment "${expected}"`
    )
  }
}

/**
 * Verifies an IDKit 4 result against the Developer Portal v4 verify endpoint.
 *
 * Replaces the IDKit 2.x `verifyCloudProof` call, which targeted the legacy
 * `/api/v2/verify/{app_id}` endpoint. The v4 endpoint is keyed by RP id and
 * returns per-credential results; a top level `nullifier` (0x-prefixed hex) is
 * present on success.
 *
 * The result's `environment` is asserted against the deployment's expected
 * environment before the call, pinned to that value in the forwarded body, and
 * checked again on the response, as the IDKit integration guide requires.
 */
export const verifyWorldIdProof = async (
  result: VerificationResultPayload
): Promise<WorldIdProofVerification> => {
  const rpId = resolveRpId()

  if (!rpId) {
    throw new Error('World ID RP id is not configured')
  }

  assertProofEnvironment(result)

  const environment = resolveWorldIdEnvironment()
  const baseUrl = process.env.DEVELOPER_PORTAL_URL ?? DEVELOPER_PORTAL_BASE_URL

  const response = await fetch(new URL(`/api/v4/verify/${rpId}`, baseUrl), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...result, environment }),
  })

  const data = (await response.json()) as DeveloperPortalVerifyResponse

  if (data.success && data.environment !== environment) {
    return {
      success: false,
      code: 'environment_mismatch',
      detail: `The proof was verified in environment "${data.environment ?? 'unknown'}", expected "${environment}".`,
      results: data.results ?? [],
    }
  }

  if (data.success && data.action && data.nullifier && data.protocol_version) {
    return {
      success: true,
      action: data.action,
      nullifier: data.nullifier,
      protocolVersion: data.protocol_version,
      results: data.results ?? [],
    }
  }

  return {
    success: false,
    code: data.code ?? 'generic_error',
    detail: data.detail ?? 'There was an error verifying this proof.',
    results: data.results ?? [],
  }
}

export class ProofBindingError extends Error {}

/**
 * Asserts that a forwarded IDKit result is bound to this guild and user.
 *
 * The v2 verify endpoint received the action and signal as call arguments and
 * checked them server side. The v4 endpoint instead verifies the proof against
 * whatever `action` and `signal_hash` the client forwarded, so the relying
 * party must perform these checks itself; without them a proof minted for a
 * different action or user could be replayed against this endpoint.
 */
export const assertProofBinding = (
  result: VerificationResultPayload,
  { guildId, userId }: { guildId: string; userId: string }
) => {
  if (result.action !== guildId) {
    throw new ProofBindingError('Proof action does not match the guild id')
  }

  const expectedSignalHash = BigInt(hashSignal(userId))

  for (const item of result.responses) {
    let signalHash: bigint

    try {
      signalHash = BigInt(item.signal_hash ?? '')
    } catch {
      throw new ProofBindingError('Proof signal hash is malformed')
    }

    if (signalHash !== expectedSignalHash) {
      throw new ProofBindingError('Proof signal does not match the user id')
    }
  }
}

/**
 * Returns the canonical (0x-prefixed, 64 digit hex) nullifier claimed by an
 * IDKit result, or null when the result carries no usable nullifier.
 */
export const getResultNullifier = (result: VerificationResultPayload) => {
  const nullifier = result.responses[0]?.nullifier

  if (!nullifier) {
    return null
  }

  return normalizeNullifier(nullifier)
}

export const normalizeNullifier = (nullifier: string) => {
  try {
    return Nullifier.fromHex(nullifier).toHex()
  } catch {
    return null
  }
}

/**
 * Maps a verified credential identifier to the bot's credential tiers. The
 * World ID 4.0 `proof_of_human` credential is the successor of the 3.0 Orb
 * credential and maps to the Orb tier.
 */
export const credentialTypeFromIdentifier = (identifier: string): CredentialType | null => {
  switch (identifier) {
    case 'orb':
    case 'proof_of_human':
      return CredentialType.Orb
    case 'device':
      return CredentialType.Device
    default:
      return null
  }
}
