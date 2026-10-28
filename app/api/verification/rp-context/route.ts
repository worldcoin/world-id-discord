import { verifyInteractionsToken } from '@/features/verification/server/verify-interactions-jwt'
import { internalErrorResponse } from '@/utils/error-response'
import { genericError } from '@/utils/generic-errors'
import { signRequest } from '@worldcoin/idkit-server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Issues the RP context IDKit 4 needs before a proof can be requested.
 *
 * The context carries a short lived signature (made with the RP signing key,
 * which never leaves the server) over the guild id as the action. The same
 * interactions token check as the verification complete endpoint guards this
 * route, so contexts are only signed for users with a valid /verify session.
 */
export const POST = async (request: NextRequest) => {
  const body = await request.json().catch(() => null)
  const { guildId, userId, token, interactionsToken } = body ?? {}

  if (!guildId || !userId || !token || !interactionsToken) {
    return internalErrorResponse({
      message: 'guildId, userId, token and interactionsToken are required',
      code: 400,
    })
  }

  try {
    await verifyInteractionsToken({ interactionsToken, userId, guildId, discordToken: token })
  } catch (error) {
    console.error('Error verifying interactions token', error)

    return internalErrorResponse(genericError.unauthorized)
  }

  // The RP context must carry the real RP id; the deprecated app id fallback
  // used by the verify endpoint cannot produce one, so NEXT_PUBLIC_RP_ID and
  // the RP signing key are both required here.
  const rpId = process.env.NEXT_PUBLIC_RP_ID
  const signingKey = process.env.RP_SIGNING_KEY

  if (!rpId || !signingKey) {
    console.error('RP id or RP signing key is not configured')

    return internalErrorResponse(genericError.environmentIsMisconfigured)
  }

  try {
    const { sig, nonce, createdAt, expiresAt } = signRequest({
      signingKeyHex: signingKey,
      action: guildId,
    })

    return NextResponse.json({
      rp_id: rpId,
      nonce,
      created_at: createdAt,
      expires_at: expiresAt,
      signature: sig,
    })
  } catch (error) {
    console.error('Error signing RP request', error)

    return internalErrorResponse(genericError.internalServerError)
  }
}
