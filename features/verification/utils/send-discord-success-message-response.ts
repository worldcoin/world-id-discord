import { editInteractionMessage } from '@/lib/discord/edit-interaction-messate'
import { EmbedBuilder } from '@discordjs/builders'
import { APIRole } from 'discord-api-types/v10'
import { NextResponse } from 'next/server'

export const sendDiscordSuccessMessageResponse = async (
  token: string,
  assignedRoles: APIRole[]
) => {
  const description = [
    'Your verification with World ID is complete.',
    `You can now enjoy your new role(s): **${assignedRoles.map(role => role.name).join('**, **')}**`,
  ].join('\n')

  const embed = new EmbedBuilder()
    .setColor([87, 242, 135])
    .setTitle('Kudos! Your verification was successful')
    .setDescription(description)
    .setThumbnail(`${process.env.NEXTAUTH_URL}/images/api/interactions/verify-success.png`)
    .setTimestamp(new Date())

  await editInteractionMessage(token, [embed.toJSON()])
  return NextResponse.json({ assignedRoles })
}
