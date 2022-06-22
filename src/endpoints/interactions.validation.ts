import type { Handler } from "aws-lambda";
import type {
  APIApplicationCommandInteraction,
  APIPingInteraction,
} from "discord-api-types/v10";
import { sign } from "tweetnacl";

const BOT_PUBLIC_KEY = process.env.BOT_PUBLIC_KEY ?? "";
if (!BOT_PUBLIC_KEY)
  throw new ReferenceError(
    `Environment variable BOT_PUBLIC_KEY is required but not found`,
  );

/** @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#security-and-authorization} */

export const handler: Handler<
  {
    body?: APIApplicationCommandInteraction | APIPingInteraction;
    header?: Record<string, string>;
  },
  boolean
> = async (event) => {
  try {
    const timestamp = event.header?.["x-signature-timestamp"];
    if (!timestamp) throw new TypeError("Missing timestamp attribute");
    const signature = event.header?.["x-signature-ed25519"];
    if (!signature) throw new TypeError("Missing signature attribute");

    return sign.detached.verify(
      Buffer.from(timestamp + JSON.stringify(event.body)),
      Buffer.from(signature, "hex"),
      Buffer.from(BOT_PUBLIC_KEY, "hex"),
    );
  } catch (exception) {
    console.error(exception);
    console.error(event);
    return false;
  }
};
