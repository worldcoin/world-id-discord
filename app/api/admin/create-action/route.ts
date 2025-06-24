import {
  CreateActionErrorCode,
  DevPortalCreateActionResponse,
} from '@/features/admin/types/create-action'
import { authOptions } from '@/server/auth-options'
import { internalErrorResponse } from '@/utils/error-response'
import { genericError } from '@/utils/generic-errors'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

const DEVELOPER_PORTAL_URL = process.env.DEVELOPER_PORTAL_URL
const APP_ID = process.env.NEXT_PUBLIC_APP_ID
const DEVELOPER_PORTAL_API_KEY = process.env.DEVELOPER_PORTAL_API_KEY

export const POST = async () => {
  if (!DEVELOPER_PORTAL_URL || !APP_ID || !DEVELOPER_PORTAL_API_KEY) {
    return internalErrorResponse(genericError.environmentIsMisconfigured)
  }

  const session = await getServerSession(authOptions)

  if (!session?.guild.id) {
    return internalErrorResponse(genericError.unauthorized)
  }

  const guildId = session.guild.id

  let createActionResponse: DevPortalCreateActionResponse | null = null

  try {
    const url = new URL(`/api/v2/create-action/${APP_ID}`, DEVELOPER_PORTAL_URL)

    const res = await fetch(url, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `ApiKey ${DEVELOPER_PORTAL_API_KEY}`,
      },

      body: JSON.stringify({
        action: guildId,
        name: `discord-integration-${guildId}`,
        description: `Discord integration for the guildId: ${guildId}`,
      }),
    })

    createActionResponse = await res.json()
  } catch (error) {
    console.error('Error while creating action:', error)
    return internalErrorResponse(genericError.internalServerError)
  }

  if (!createActionResponse) {
    return internalErrorResponse({
      message: 'Something went wrong while creating the action.',
      code: 500,
    })
  }

  if (!('action' in createActionResponse)) {
    if (createActionResponse.code === CreateActionErrorCode.ConstraintViolation) {
      // NOTE: Action is already exists, so we can return success
      return NextResponse.json({ success: true })
    }

    return internalErrorResponse({
      message:
        createActionResponse?.detail ?? 'Something went wrong while creating the action.',
      code: 500,
    })
  }

  return NextResponse.json({ success: true })
}
