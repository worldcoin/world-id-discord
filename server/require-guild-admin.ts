import { userIsGuildAdmin } from '@/lib/discord/user-is-guild-admin'
import { internalErrorResponse } from '@/utils/error-response'
import { genericError } from '@/utils/generic-errors'
import { Session } from 'next-auth'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from './auth-options'

type AdminGuardSuccess = { authorized: true; session: Session; guildId: string }
type AdminGuardFailure = { authorized: false; response: NextResponse }
export type AdminGuardResult = AdminGuardSuccess | AdminGuardFailure

export const requireGuildAdmin = async (): Promise<AdminGuardResult> => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || !session?.guild?.id) {
    return { authorized: false, response: internalErrorResponse(genericError.unauthorized) }
  }

  const { id: userId } = session.user
  const { id: guildId } = session.guild

  try {
    const isAdmin = await userIsGuildAdmin(userId, guildId)

    if (!isAdmin) {
      return { authorized: false, response: internalErrorResponse(genericError.forbidden) }
    }
  } catch (error) {
    console.error('Failed to verify guild admin permissions', error)
    return { authorized: false, response: internalErrorResponse(genericError.forbidden) }
  }

  return { authorized: true, session, guildId }
}
