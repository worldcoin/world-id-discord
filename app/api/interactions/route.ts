import { createInteractionsToken } from '@/features/interactions/create-interactions-token'
import { internalErrorResponse } from '@/utils/error-response'
import { getAppUrl } from '@/utils/get-app-url'
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders'
import {
  APIApplicationCommandInteraction,
  APIInteractionResponseChannelMessageWithSource,
  APIInteractionResponsePong,
  APIPingInteraction,
  ButtonStyle,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from 'discord-api-types/v10'
import { verifyKey } from 'discord-interactions'
import { getTranslations } from 'next-intl/server'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  if (!process.env.DISCORD_APP_PUBLIC_KEY) {
    console.error('Environment is not configured')

    return internalErrorResponse({
      message: 'Environment is not configured',
      code: 500,
    })
  }

  const signature = req.headers.get('x-signature-ed25519')
  const timestamp = req.headers.get('x-signature-timestamp')

  if (!signature || !timestamp) {
    console.error('Missing signature or timestamp')
    return new Response('Invalid request', { status: 401 })
  }

  const rawBody = await req.text()

  // ANCHOR: Verify interaction signature
  const isVerified = await verifyKey(
    rawBody,
    signature,
    timestamp,
    process.env.DISCORD_APP_PUBLIC_KEY
  )

  if (!isVerified) {
    console.error('Invalid request signature')

    return internalErrorResponse({
      message: 'Invalid request',
      code: 401,
    })
  }

  const data = JSON.parse(rawBody) as APIApplicationCommandInteraction | APIPingInteraction

  // ANCHOR: Checking if interaction is a ping
  if (data.type === InteractionType.Ping) {
    const payload: APIInteractionResponsePong = {
      type: InteractionResponseType.Pong,
    }

    return NextResponse.json(payload)
  }

  if (!data.member?.user.id || !data.guild_id) {
    console.error('Missing user id or guild id')

    return internalErrorResponse({
      message: 'Invalid request',
      code: 401,
    })
  }

  const interactionsToken = await createInteractionsToken({
    userId: data.member.user.id,
    guildId: data.guild_id,
    discordToken: data.token,
  })

  const verifyUrl = new URL('/verification', getAppUrl())
  verifyUrl.searchParams.set('user_id', data.member.user.id)
  verifyUrl.searchParams.set('guild_id', data.guild_id)
  verifyUrl.searchParams.set('token', data.token)
  verifyUrl.searchParams.set('interactions_token', interactionsToken)

  const imageUrl = new URL('/images/api/interactions/verify-initial.png', getAppUrl())

  const t = await getTranslations()

  // ANCHOR: Creating message
  const embed = new EmbedBuilder()
    .setColor([133, 126, 245])
    .setTitle(t('Discord_Integration_Verify_Command_Title'))
    .setURL(verifyUrl.toString())
    .setDescription(t('Discord_Integration_Verify_Command_Description'))
    .setThumbnail(imageUrl.toString())

  // ANCHOR: Creating button
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel(t('Discord_Integration_Verify_Command_Button'))
      .setStyle(ButtonStyle.Link)
      .setURL(verifyUrl.toString())
  )

  // ANCHOR: Creating response payload
  const payload: APIInteractionResponseChannelMessageWithSource = {
    type: InteractionResponseType.ChannelMessageWithSource,

    data: {
      embeds: [embed.toJSON()],
      components: [row.toJSON()],
      flags: MessageFlags.Ephemeral,
    },
  }

  return NextResponse.json(payload)
}
