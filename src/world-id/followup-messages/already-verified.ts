import { EmbedBuilder } from "@discordjs/builders";
import type { REST } from "@discordjs/rest";
import {
  Routes,
  type RESTPostAPIWebhookWithTokenJSONBody,
} from "discord-api-types/v10";

export async function sendAlreadyVerifiedErrorMessage({
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
    .setColor([222, 84, 78])
    .setTitle("Hmm... looks like you already verified with this server before")
    .setDescription(
      "A single person can only verify once with each server to ensure everyone who is verified is human. A server admin may have manually verified you.",
    )
    .setTimestamp();

  const body: RESTPostAPIWebhookWithTokenJSONBody = {
    embeds: [embed.toJSON()],
  };

  return rest.patch(Routes.webhookMessage(applicationId, interactionToken), {
    body,
  });
}
