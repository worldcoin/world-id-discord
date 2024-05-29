import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { baseAuthOptions } from './auth/[...nextauth]'

export enum CreateActionErrorCodes {
  Unauthorized = 'unauthorized',
  InternalServerError = 'internal_server_error',
  AlreadyExists = 'already_exists',
}

export const createActionErrorMessages = {
  [CreateActionErrorCodes.Unauthorized]: 'Unauthorized',
  [CreateActionErrorCodes.InternalServerError]: 'Something went wrong.',
  [CreateActionErrorCodes.AlreadyExists]: 'This action already exists.',
}

export type CreateActionReturnType =
  | {
      success: true
    }
  | {
      success: false
      code: CreateActionErrorCodes
      message: string
    }

const createAction = async (req: NextApiRequest, res: NextApiResponse<CreateActionReturnType>) => {
  if (!process.env.DEVELOPER_PORTAL_URL || !process.env.APP_ID || !process.env.DEVELOPER_PORTAL_API_KEY) {
    console.log('Environment variables for /create-action endpoint are missing.')

    return res.status(500).json({
      success: false,
      code: CreateActionErrorCodes.InternalServerError,
      message: createActionErrorMessages[CreateActionErrorCodes.InternalServerError],
    })
  }

  const session = await getServerSession(req, res, baseAuthOptions)

  if (!session) {
    return res.status(401).json({
      success: false,
      code: CreateActionErrorCodes.Unauthorized,
      message: createActionErrorMessages[CreateActionErrorCodes.Unauthorized],
    })
  }

  const token = await getToken({ req })
  const guildId = token?.guildId

  const createActionResponse = await fetch(
    `${process.env.DEVELOPER_PORTAL_URL}/api/v2/create-action/${process.env.APP_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `ApiKey ${process.env.DEVELOPER_PORTAL_API_KEY}`,
      },

      body: JSON.stringify({
        action: guildId,
        name: `discord-integration-${guildId}`,
        description: `Discord integration for the guildId: ${guildId}`,
      }),
    },
  )

  let body: any | null = null

  try {
    body = await createActionResponse.json()
  } catch (error) {
    console.log('Error while parsing the response from the Developer Portal API:', error)
  }

  if (createActionResponse.status === 400 && body && body.code === 'constraint-violation') {
    return res.status(200).json({
      success: false,
      code: CreateActionErrorCodes.AlreadyExists,
      message: createActionErrorMessages[CreateActionErrorCodes.AlreadyExists],
    })
  }

  if (createActionResponse.status !== 200) {
    return res.status(500).json({
      success: false,
      code: CreateActionErrorCodes.InternalServerError,
      message: createActionErrorMessages[CreateActionErrorCodes.InternalServerError],
    })
  }

  return res.status(200).json({ success: true })
}

export default createAction
