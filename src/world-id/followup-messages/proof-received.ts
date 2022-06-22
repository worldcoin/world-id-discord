import { EmbedBuilder } from "@discordjs/builders";
import type { REST } from "@discordjs/rest";
import {
  Routes,
  type RESTPostAPIWebhookWithTokenJSONBody,
} from "discord-api-types/v10";

export async function sendProofReceivedMessage({
  rest,
  applicationId,
  interactionToken,
  remainingTimeInMs,
}: {
  rest: REST;
  applicationId: string;
  interactionToken: string;
  remainingTimeInMs: number;
}) {
  /** @see {@link https://discordjs.guide/popular-topics/embeds.html#embed-preview} */
  const embed = new EmbedBuilder()
    .setColor([81, 245, 66])
    .setTitle("Just the final checks now")
    .setDescription(
      "We’ve received your **anonymous** proof of humanity from the Worldcoin app, we are now just doing the final checks.",
    )
    .setFooter({
      text: `${new Intl.NumberFormat("en", {
        style: "unit",
        unit: "minute",
        unitDisplay: "long",
        maximumFractionDigits: 0,
        // @ts-expect-error - it does exists
        roundingMode: "floor",
      }).format(remainingTimeInMs / 1000 / 60)} remaining.`,
      iconURL:
        "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/325/hourglass-not-done_23f3.png",
    });

  const body: RESTPostAPIWebhookWithTokenJSONBody = {
    embeds: [embed.toJSON()],
  };

  return rest.patch(Routes.webhookMessage(applicationId, interactionToken), {
    body,
  });
}
