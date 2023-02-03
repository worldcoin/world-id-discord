/* eslint-disable complexity -- FIXME */
import { VerificationCompletePayload } from 'common/types/verification-complete'
import { NextApiRequest, NextApiResponse } from 'next'
import { assignGuildMemberRole, getGuildData } from 'services/discord'
import { getBotConfig, getNullifierHash, saveNullifier } from 'services/dynamodb'

interface NextApiRequestWithBody extends NextApiRequest {
  body: VerificationCompletePayload
}

export default async function handler(req: NextApiRequestWithBody, res: NextApiResponse) {
  const { guildId, userId, result } = req.body

  // FIXME: check result signature

  const guild = await getGuildData(guildId)
  if (!guild) {
    return res.status(500).json({})
  }

  const { data: botConfig } = await getBotConfig(guildId)

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
    const nullifierHashResult = await getNullifierHash({ guild_id: guildId, nullifier_hash: result.nullifier_hash })

    if (!nullifierHashResult.data) {
      const NullifierSaveResult = await saveNullifier({ guild_id: guildId, nullifier_hash: result.nullifier_hash })

      if (NullifierSaveResult.error) {
        return res.status(500).json({ message: NullifierSaveResult.error.message })
      }
    }

    if (
      nullifierHashResult.data &&
      nullifierHashResult.data.nullifier_hash === result.nullifier_hash &&
      nullifierHashResult.data.guild_id === guildId
    ) {
      return res.status(400).json({ code: 'already_verified' })
    }

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
    const assignedRoles = guild.roles.filter((role) => roleIds.includes(role.id))
    return res.status(200).json({ assignedRoles })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error?.message })
  }
}
