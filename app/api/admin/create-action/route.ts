import { requireGuildAdmin } from '@/server/require-guild-admin'
import { NextResponse } from 'next/server'

/**
 * World ID 4.0 creates actions automatically on first verification (the v4
 * verify endpoint registers the action using the request's
 * `action_description`), and there is no v4 equivalent of the legacy
 * `/api/v2/create-action` endpoint this route used to call. The handler is
 * kept as a no-op so the admin config flow keeps its existing contract.
 */
export const POST = async () => {
  const guard = await requireGuildAdmin()

  if (!guard.authorized) {
    return guard.response
  }

  return NextResponse.json({ success: true })
}
