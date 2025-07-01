import { EmbedBuilder } from '@discordjs/builders'

export const composeDiscordErrorMessage = (message: string) => {
  return new EmbedBuilder()
    .setColor([237, 66, 69])
    .setTitle('Sorry we could not complete your verification')
    .setDescription(message)
    .setThumbnail(`${process.env.NEXTAUTH_URL}/images/api/interactions/verify-error.png`)
    .setTimestamp(new Date())
}
