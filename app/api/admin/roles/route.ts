import { fetchAvailableGuildRoles } from '@/lib/discord/fetch-available-guild-roles'
import { authOptions } from '@/server/auth-options'
import { internalErrorResponse } from '@/utils/error-response'
import { genericError } from '@/utils/generic-errors'

import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export const GET = async () => {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.guild.id) {
    return internalErrorResponse(genericError.unauthorized)
  }

  try {
    const roles = await fetchAvailableGuildRoles(session.guild.id)
    return NextResponse.json(roles)
  } catch (error) {
    console.error('Error fetching roles', error)

    return internalErrorResponse({
      message: 'Something went wrong while fetching the roles.',
      code: 500,
    })
  }
}
