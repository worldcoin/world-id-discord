import { EmbedBuilder } from '@discordjs/builders'
import { VerificationCompletePayload } from 'common/types/verification-complete'
import { APIRole } from 'discord-api-types/v10'
import { NextApiRequest, NextApiResponse } from 'next'
import { assignGuildMemberRole, editInteractionMessage, getGuildData } from 'services/discord'
import { getBotConfig } from 'services/dynamodb'

interface NextApiRequestWithBody extends NextApiRequest {
  body: VerificationCompletePayload
}

export default async function handler(req: NextApiRequestWithBody, res: NextApiResponse) {
  const { guildId, userId, token, result } = req.body

  // FIXME: check result signature

  const guild = await getGuildData(guildId)
  if (!guild) {
    return await sendErrorResponse(res, token, 500, 'Guild not found')
  }

  const { data: botConfig } = await getBotConfig(guildId)

  if (!botConfig) {
    return await sendErrorResponse(res, token, 500, 'Bot config not found')
  }

  if (!botConfig.enabled) {
    return await sendErrorResponse(res, token, 400, 'Bot is disabled')
  }

  let roleIds: string[]
  if (result.signal_type === 'orb') {
    if (!botConfig.orb.enabled) {
      return await sendErrorResponse(res, token, 400, 'Orb verification is disabled for this server.')
    }
    roleIds = botConfig.orb.roles
  } else if (result.signal_type === 'phone') {
    if (!botConfig.phone.enabled) {
      return await sendErrorResponse(res, token, 400, 'Phone verification is disabled')
    }
    roleIds = botConfig.phone.roles
  } else {
    return await sendErrorResponse(res, token, 400, 'We had a problem verifying this credential. Please try again.')
  }

  // FIXME: check that these roles really exist on the server

  try {
    for (const roleId of roleIds) {
      await assignGuildMemberRole(guildId, userId, roleId)
    }
    const assignedRoles = guild.roles.filter((role) => roleIds.includes(role.id))
    return await sendSuccessResponse(res, token, assignedRoles)
  } catch (error) {
    console.error(error)
    return await sendErrorResponse(res, token, 500, error?.message)
  }
}

async function sendErrorResponse(res: NextApiResponse, token: string, statusCode: number, message?: string) {
  const description = [`Feel free to restart the validation with /verify command`].concat(message ?? []).join('\n')
  const embed = new EmbedBuilder()
    .setColor([237, 66, 69])
    .setTitle('Sorry we could not complete your verification')
    .setDescription(description)
    .setThumbnail(`${process.env.NEXTAUTH_URL}/images/api/interactions/verify-error.png`)
    .setTimestamp(new Date())
  await editInteractionMessage(token, [embed.toJSON()])
  return res.status(statusCode).json({ message })
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
