import { EmbedBuilder } from '@discordjs/builders'
import { CredentialType, VerificationLevel } from '@worldcoin/idkit-core'
import { VerificationCompletePayload } from 'common/types/verification-complete'
import { APIRole } from 'discord-api-types/v10'
import { NextApiRequest, NextApiResponse } from 'next'
import { assignGuildMemberRole, editInteractionMessage, getGuildData, removeGuildMemberRole } from 'services/discord'
import { getBotConfig, getNullifierHash, saveNullifier } from 'services/dynamodb'

interface NextApiRequestWithBody extends NextApiRequest {
  body: VerificationCompletePayload
}

//eslint-disable-next-line complexity -- FIXME: refactor this function
export default async function handler(req: NextApiRequestWithBody, res: NextApiResponse) {
  if (!process.env.DEVELOPER_PORTAL_URL) {
    console.log('DEVELOPER_PORTAL_URL env is missing')
    return await sendErrorResponse(res, '', 500, false, 'Something went wrong.')
  }

  const { guildId, userId, token, result, appId } = req.body

  if (!guildId || !userId || !token || !result || !appId) {
    return await sendErrorResponse(res, '', 400, false, 'Missing required parameters.')
  }

  try {
    const verificationResponse = await fetch(`${process.env.DEVELOPER_PORTAL_URL}/api/v1/verify/${appId}`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        action: guildId,
        proof: result.proof,
        signal: userId,
        nullifier_hash: result.nullifier_hash,
        merkle_root: result.merkle_root,
        verification_level: result.verification_level,
      }),
    })

    if (!verificationResponse.ok) {
      throw new Error('Error while verifying proof')
    }

    const verificationResult = await verificationResponse.json()

    if (!verificationResult.success) {
      throw new Error('Error while verifying proof')
    }
  } catch (error) {
    console.error(error)
    return await sendErrorResponse(res, token, 500, true, 'Proof is not valid. Please try again.')
  }

  const guild = await getGuildData(guildId)
  if (!guild) {
    return await sendErrorResponse(res, token, 500, false, 'The Discord server was not found.')
  }

  const { data: botConfig } = await getBotConfig(guildId)

  if (!botConfig) {
    return await sendErrorResponse(
      res,
      token,
      500,
      false,
      'Looks like this server is not properly configured for Discord Bouncer. Please contact your server admin.',
    )
  }

  if (!botConfig.enabled) {
    return await sendErrorResponse(res, token, 400, false, 'The bot is currently disabled for this server.')
  }

  let credential_type: CredentialType | undefined

  if (result.verification_level === VerificationLevel.Orb) {
    credential_type = CredentialType.Orb
  } else {
    credential_type = CredentialType.Device
  }

  let roleIds: string[]

  if (!botConfig[credential_type].enabled) {
    return await sendErrorResponse(
      res,
      token,
      400,
      true,
      'We had a problem verifying this credential. Please try again.',
    )
  }

  roleIds = botConfig[credential_type].roles

  const nullifierHashResult = await getNullifierHash({
    guild_id: guildId,
    nullifier_hash: result.nullifier_hash,
    credential_type: credential_type,
  })

  const knownNullifierHash = nullifierHashResult.data?.nullifier_hash === result.nullifier_hash
  const knownUser = nullifierHashResult.data?.user_id === userId

  if (nullifierHashResult.data && knownNullifierHash && !knownUser) {
    for (const roleId of roleIds) {
      await removeGuildMemberRole(guildId, nullifierHashResult.data?.user_id, roleId)
    }
  }

  if (nullifierHashResult.data && knownNullifierHash && knownUser) {
    return await sendErrorResponse(res, token, 400, false, 'This user has already been verified.', 'already_verified')
  }

  const NullifierSaveResult = await saveNullifier({
    guild_id: guildId,
    nullifier_hash: result.nullifier_hash,
    credential_type: credential_type,
    user_id: userId,
  })

  if (NullifierSaveResult.error) {
    console.error(NullifierSaveResult.error)
    return await sendErrorResponse(res, token, 500, true)
  }

  // FIXME: check that these roles really exist on the server

  try {
    for (const roleId of roleIds) {
      await assignGuildMemberRole(guildId, userId, roleId)
    }

    const assignedRoles = guild.roles.filter((role) => roleIds.includes(role.id))
    return await sendSuccessResponse(res, token, assignedRoles)
  } catch (error) {
    console.error('Error while assigning roles: ', error)
    return await sendErrorResponse(res, token, 500, true, error?.message)
  }
}

async function sendErrorResponse(
  res: NextApiResponse,
  token: string,
  statusCode: number,
  canRetry: boolean = false,
  message?: string,
  code?: string,
) {
  const description = []
  if (canRetry) {
    description.push('Feel free to restart the validation with /verify command')
  }
  if (message) {
    description.push(message)
  }
  const embed = new EmbedBuilder()
    .setColor([237, 66, 69])
    .setTitle('Sorry we could not complete your verification')
    .setDescription(description.join('\n'))
    .setThumbnail(`${process.env.NEXTAUTH_URL}/images/api/interactions/verify-error.png`)
    .setTimestamp(new Date())
  await editInteractionMessage(token, [embed.toJSON()])
  return res.status(statusCode).json({ code, message })
}

async function sendSuccessResponse(res: NextApiResponse, token: string, assignedRoles: APIRole[]) {
  const description = [
    'Your verification with World ID is complete.',
    `You can now enjoy your new role(s): **${assignedRoles.map((role) => role.name).join('**, **')}**`,
  ].join('\n')
  const embed = new EmbedBuilder()
    .setColor([87, 242, 135])
    .setTitle('Kudos! Your verification was successful')
    .setDescription(description)
    .setThumbnail(`${process.env.NEXTAUTH_URL}/images/api/interactions/verify-success.png`)
    .setTimestamp(new Date())
  await editInteractionMessage(token, [embed.toJSON()])
  return res.status(200).json({ assignedRoles })
}
