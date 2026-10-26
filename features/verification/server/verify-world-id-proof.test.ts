import { VerificationResultPayload } from '@/schemas/verification-complete'
import { CredentialType } from '@/types/credential-type'
import { hashSignal } from '@worldcoin/idkit-core/hashing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  assertProofBinding,
  credentialTypeFromIdentifier,
  getResultNullifier,
  normalizeNullifier,
  ProofBindingError,
  verifyWorldIdProof,
} from './verify-world-id-proof'

const GUILD_ID = 'guild-123'
const USER_ID = 'user-456'
const NULLIFIER = `0x${'12'.repeat(32)}`

const makeResult = (overrides: Record<string, unknown> = {}) =>
  ({
    protocol_version: '3.0',
    nonce: 'nonce-1',
    action: GUILD_ID,
    responses: [
      {
        identifier: 'orb',
        signal_hash: hashSignal(USER_ID),
        nullifier: NULLIFIER,
        proof: '0x1234',
        merkle_root: '0x5678',
      },
    ],
    ...overrides,
  }) as unknown as VerificationResultPayload

describe('verifyWorldIdProof', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    process.env.NEXT_PUBLIC_RP_ID = 'rp_test123'
    delete process.env.NEXT_PUBLIC_APP_ID
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  it('returns the normalized success payload for a valid proof', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          action: GUILD_ID,
          nullifier: NULLIFIER,
          protocol_version: '3.0',
          results: [{ identifier: 'orb', success: true, nullifier: NULLIFIER }],
        }),
        { status: 200 }
      )
    )

    const verification = await verifyWorldIdProof(makeResult())

    expect(verification.success).toBe(true)

    if (verification.success) {
      expect(verification.action).toBe(GUILD_ID)
      expect(verification.nullifier).toBe(NULLIFIER)
    }

    const [url] = fetchMock.mock.calls[0] as [URL]
    expect(url.pathname).toBe('/api/v4/verify/rp_test123')
  })

  it('returns a failure payload (not a throw) for an invalid proof', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({ success: false, code: 'invalid_proof', detail: 'Proof is invalid' }),
        { status: 400 }
      )
    )

    const verification = await verifyWorldIdProof(makeResult())

    expect(verification.success).toBe(false)

    if (!verification.success) {
      expect(verification.code).toBe('invalid_proof')
    }
  })

  it('throws when no RP id is configured', async () => {
    delete process.env.NEXT_PUBLIC_RP_ID

    await expect(verifyWorldIdProof(makeResult())).rejects.toThrow('not configured')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('assertProofBinding', () => {
  it('accepts a proof bound to the guild and user', () => {
    expect(() =>
      assertProofBinding(makeResult(), { guildId: GUILD_ID, userId: USER_ID })
    ).not.toThrow()
  })

  it('rejects a proof minted for a different action', () => {
    const result = makeResult({ action: 'another-guild' })

    expect(() => assertProofBinding(result, { guildId: GUILD_ID, userId: USER_ID })).toThrow(
      ProofBindingError
    )
  })

  it('rejects a proof bound to a different user signal', () => {
    const result = makeResult({
      responses: [
        {
          identifier: 'orb',
          signal_hash: hashSignal('mallory'),
          nullifier: NULLIFIER,
        },
      ],
    })

    expect(() => assertProofBinding(result, { guildId: GUILD_ID, userId: USER_ID })).toThrow(
      ProofBindingError
    )
  })

  it('rejects a malformed signal hash', () => {
    const result = makeResult({
      responses: [{ identifier: 'orb', signal_hash: 'not-a-hash', nullifier: NULLIFIER }],
    })

    expect(() => assertProofBinding(result, { guildId: GUILD_ID, userId: USER_ID })).toThrow(
      ProofBindingError
    )
  })

  it('rejects a missing signal hash', () => {
    const result = makeResult({
      responses: [{ identifier: 'orb', nullifier: NULLIFIER }],
    })

    expect(() => assertProofBinding(result, { guildId: GUILD_ID, userId: USER_ID })).toThrow(
      ProofBindingError
    )
  })
})

describe('nullifier helpers', () => {
  it('extracts and canonicalizes the claimed nullifier', () => {
    const result = makeResult({
      responses: [
        {
          identifier: 'orb',
          signal_hash: hashSignal(USER_ID),
          nullifier: '1A'.repeat(32),
        },
      ],
    })

    expect(getResultNullifier(result)).toBe(`0x${'1a'.repeat(32)}`)
  })

  it('returns null when the result carries no nullifier', () => {
    const result = makeResult({ responses: [{ identifier: 'orb' }] })

    expect(getResultNullifier(result)).toBeNull()
    expect(normalizeNullifier('not-a-nullifier')).toBeNull()
  })
})

describe('credentialTypeFromIdentifier', () => {
  it('maps verified credential identifiers to bot tiers', () => {
    expect(credentialTypeFromIdentifier('orb')).toBe(CredentialType.Orb)
    expect(credentialTypeFromIdentifier('proof_of_human')).toBe(CredentialType.Orb)
    expect(credentialTypeFromIdentifier('device')).toBe(CredentialType.Device)
    expect(credentialTypeFromIdentifier('face')).toBeNull()
    expect(credentialTypeFromIdentifier('')).toBeNull()
  })
})
