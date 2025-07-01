import { editInteractionMessage } from '@/lib/discord/edit-interaction-message'
import { composeDiscordErrorMessage } from '@/utils/compose-discord-error-message'
import { internalErrorResponse } from '@/utils/error-response'

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

  const embed = composeDiscordErrorMessage(description.join('\n'))
  await editInteractionMessage(token, [embed.toJSON()])

  return internalErrorResponse({
    message: description.join('\n'),
    code,
    errorCode,
  })
}
