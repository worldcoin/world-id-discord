import { APIEmbed, RESTPostAPIChannelMessageJSONBody, Routes } from 'discord-api-types/v10'
import { discordRestApi } from './discord-rest-api'

export const editInteractionMessage = async (interactionToken: string, embeds: APIEmbed[]) => {
  if (!process.env.DISCORD_APP_ID) {
    throw new Error('Environment is not properly configured for editInteractionMessage')
  }

  const body: RESTPostAPIChannelMessageJSONBody = {
    embeds,
    components: [],
  }
  return await discordRestApi.patch(
    Routes.webhookMessage(process.env.DISCORD_APP_ID, interactionToken),
    {
      body,
    }
  )
}
