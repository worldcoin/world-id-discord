import { editInteractionMessage } from '@/lib/discord/edit-interaction-message'
import { internalErrorResponse } from '@/utils/error-response'
import { EmbedBuilder } from '@discordjs/builders'

type SendDiscordErrorMessageResponseInput = {
  token: string
  code: number
  canRetry?: boolean
  message?: string
  errorCode?: string
}

export const sendDiscordErrorMessageResponse = async ({
  token,
  canRetry = false,
  message,
  code,
  errorCode,
}: SendDiscordErrorMessageResponseInput) => {
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

  return internalErrorResponse({
    message: description.join('\n'),
    code,
    errorCode,
  })
}
