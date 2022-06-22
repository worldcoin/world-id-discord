import { EmbedBuilder } from "@discordjs/builders";
import type { REST } from "@discordjs/rest";
import {
  Routes,
  type RESTPostAPIWebhookWithTokenJSONBody,
} from "discord-api-types/v10";

import { START_VERIFICATION_COMMAND } from "../slash-commands";

export async function sendTimeoutMessage({
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
    .setTitle("Uh oh! Time has run out")
    .setDescription(
      `Looks like the available time for this request has elapsed. Feel free to start over by calling the \`/${START_VERIFICATION_COMMAND}\` command again.`,
    )
    .setTimestamp();

  const body: RESTPostAPIWebhookWithTokenJSONBody = {
    embeds: [embed.toJSON()],
  };

  return rest.patch(Routes.webhookMessage(applicationId, interactionToken), {
    body,
  });
}
