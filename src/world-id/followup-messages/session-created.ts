import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from "@discordjs/builders";
import type { REST } from "@discordjs/rest";
import {
  ButtonStyle,
  Routes,
  type RESTPostAPIWebhookWithTokenJSONBody,
} from "discord-api-types/v10";

import { getEnv } from "@/utils/get-env";

const qrGeneratorUrl = getEnv("QR_GENERATOR_URL");

export async function sendStartingValidationMessage({
  rest,
  sessionUri,
  applicationId,
  interactionToken,
}: {
  rest: REST;
  sessionUri: string;
  applicationId: string;
  interactionToken: string;
}) {
  const qrCodeUrl = new URL(qrGeneratorUrl);
  qrCodeUrl.searchParams.append("uri", sessionUri);

  /** @see {@link https://discordjs.guide/popular-topics/embeds.html#embed-preview} */
  const embed = new EmbedBuilder()
    .setColor([133, 126, 245])
    .setTitle("Verification required")
    .setURL(sessionUri)
    .setDescription(
      "This server requires you to verify you are a human. Please scan this QR code with your **Worldcoin app** to continue.",
    )
    .setImage(qrCodeUrl.toString())
    .setFooter({
      text: "This code is only valid for 15 minutes.",
    });

  const actionsRow = new ActionRowBuilder({
    components: [
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(sessionUri)
        .setLabel("Open Worldcoin app")
        .toJSON(),
    ],
  });

  const body: RESTPostAPIWebhookWithTokenJSONBody = {
    embeds: [embed.toJSON()],
    // @ts-expect-error -- broken types
    components: [actionsRow.toJSON()],
  };

  return rest.patch(Routes.webhookMessage(applicationId, interactionToken), {
    body,
  });
}
