import { EmbedBuilder } from "@discordjs/builders";
import type { REST } from "@discordjs/rest";
import {
  Routes,
  type RESTPostAPIWebhookWithTokenJSONBody,
} from "discord-api-types/v10";

export async function sendProofValidatedMessage({
  rest,
  applicationId,
  interactionToken,
}: {
  rest: REST;
  applicationId: string;
  interactionToken: string;
}) {
  /** @see {@link https://discordjs.guide/popular-topics/embeds.html#embed-preview} */
  const embed = new EmbedBuilder()
    .setColor([100, 179, 133])
    .setTitle("Hooray! You’re human")
    .setDescription(
      "We’ve finished verifying you are human. A special role has been assigned to you on this server.",
    )
    .setTimestamp();

  const body: RESTPostAPIWebhookWithTokenJSONBody = {
    embeds: [embed.toJSON()],
  };

  return rest.patch(Routes.webhookMessage(applicationId, interactionToken), {
    body,
  });
}
