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

  const roles = await fetchAvailableGuildRoles(session.guild.id)
  return NextResponse.json(roles)
}
