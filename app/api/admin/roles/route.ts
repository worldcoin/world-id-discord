import { fetchAvailableGuildRoles } from '@/lib/discord/fetch-available-guild-roles'
import { requireGuildAdmin } from '@/server/require-guild-admin'
import { internalErrorResponse } from '@/utils/error-response'
import { NextResponse } from 'next/server'

export const GET = async () => {
  const guard = await requireGuildAdmin()

  if (!guard.authorized) {
    return guard.response
  }

  try {
    const roles = await fetchAvailableGuildRoles(guard.guildId)
    return NextResponse.json(roles)
  } catch (error) {
    console.error('Error fetching roles', error)

    return internalErrorResponse({
      message: 'Something went wrong while fetching the roles.',
      code: 500,
    })
  }
}
