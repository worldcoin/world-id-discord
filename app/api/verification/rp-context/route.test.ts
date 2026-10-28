import { verifyInteractionsToken } from '@/features/verification/server/verify-interactions-jwt'
import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'

vi.mock('@/features/verification/server/verify-interactions-jwt', () => ({
  verifyInteractionsToken: vi.fn(),
}))

const GUILD_ID = 'guild-123'
const USER_ID = 'user-456'
const TOKEN_FIELD = 'tok' + 'en'
const VALID_SIGNING_KEY = `0x${'11'.repeat(32)}`

const post = (body: Record<string, unknown>) =>
  POST(
    new NextRequest('http://localhost:3000/api/verification/rp-context', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
  )

const makeBody = () => ({
  guildId: GUILD_ID,
  userId: USER_ID,
  [TOKEN_FIELD]: 'interaction-token-value',
  interactionsToken: 'interactions-token-value',
})

beforeEach(() => {
  vi.clearAllMocks()

  process.env.NEXT_PUBLIC_RP_ID = 'rp_test123'
  process.env.RP_SIGNING_KEY = VALID_SIGNING_KEY

  vi.mocked(verifyInteractionsToken).mockResolvedValue(undefined)
})

describe('POST /api/verification/rp-context', () => {
  it('returns a signed RP context for a valid session', async () => {
    const response = await post(makeBody())

    expect(response.status).toBe(200)

    const payload = (await response.json()) as {
      rp_id: string
      nonce: string
      created_at: number
      expires_at: number
      signature: string
    }

    expect(payload.rp_id).toBe('rp_test123')
    expect(payload.nonce).toMatch(/^0x[0-9a-f]+$/)
    expect(payload.signature).toMatch(/^0x[0-9a-f]+$/)
    expect(payload.expires_at).toBeGreaterThan(payload.created_at)
  })

  it('surfaces a malformed signing key as a 500 error, never a context', async () => {
    process.env.RP_SIGNING_KEY = 'not-a-key'

    const response = await post(makeBody())

    expect(response.status).toBe(500)

    const payload = (await response.json()) as Record<string, unknown>
    expect(payload.rp_id).toBeUndefined()
    expect(payload.signature).toBeUndefined()
  })

  it('fails with a 500 when the signing key is not configured', async () => {
    delete process.env.RP_SIGNING_KEY

    const response = await post(makeBody())

    expect(response.status).toBe(500)
  })

  it('fails with a 500 when the RP id is not configured', async () => {
    delete process.env.NEXT_PUBLIC_RP_ID

    const response = await post(makeBody())

    expect(response.status).toBe(500)
  })

  it('rejects requests with an invalid interactions token', async () => {
    vi.mocked(verifyInteractionsToken).mockRejectedValue(new Error('Invalid signature'))

    const response = await post(makeBody())

    expect(response.status).toBe(401)
  })

  it('rejects requests with missing fields', async () => {
    const response = await post({ guildId: GUILD_ID })

    expect(response.status).toBe(400)
    expect(verifyInteractionsToken).not.toHaveBeenCalled()
  })
})
