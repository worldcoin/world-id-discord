import {NextApiRequest, NextApiResponse} from 'next'
import {assignGuildMemberRole} from 'services/discord'
import {VerificationCompletePayload} from 'common/types/verification-complete'
import {getBotConfig} from 'services/dynamodb'

interface NextApiRequestWithBody extends NextApiRequest {
  body: VerificationCompletePayload
}

export default async function handler(req: NextApiRequestWithBody, res: NextApiResponse) {
  const { guildId, userId, result } = req.body

  // FIXME: check result signature

  const { data:botConfig } = await getBotConfig(guildId)

  if (!botConfig) {
    return res.status(500).json({})
  }

  if (!botConfig.enabled) {
    return res.status(400).json({})
  }

  let roleIds: string[]
  if (result.signal_type === 'orb') {
    if (!botConfig.orb.enabled) {
      return res.status(400).json({})
    }
    roleIds = botConfig.orb.roles
  } else if (result.signal_type === 'phone') {
    if (!botConfig.phone.enabled) {
      return res.status(400).json({})
    }
    roleIds = botConfig.phone.roles
  } else {
    return res.status(400).json({})
  }

  // FIXME: check that these roles really exist on the server

  try {
    for (const roleId of roleIds) {
      await assignGuildMemberRole(guildId, userId, roleId)
    }
    return res.status(200).json({message: 'OK'})
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: error?.message})
  }
}
