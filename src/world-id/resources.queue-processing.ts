import { randomInt } from "node:crypto";

import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { REST } from "@discordjs/rest";
import WalletConnect from "@walletconnect/client";
import type { Context, SQSHandler } from "aws-lambda";

import { getEnv } from "@/utils/get-env";
import { arrayify, concat, hexlify } from "@ethersproject/bytes";

import type { APIApplicationCommandInteraction } from "discord-api-types/v10";

import { getBotConfig } from "@/utils/get-bot-config";
import sha3 from "js-sha3";
import { checkIsUserAlreadyVerified } from "./check-is-user-verified";
import type { UserCompletedVerification } from "./events";
import { ON_VERIFIED_EVENT, WORLD_ID_EVENTS_SOURCE } from "./events";
import { sendAlreadyVerifiedErrorMessage } from "./followup-messages/already-verified";
import { sendErrorOccurredMessage } from "./followup-messages/error";
import { sendProofReceivedMessage } from "./followup-messages/proof-received";
import { sendStartingValidationMessage } from "./followup-messages/session-created";
import { sendProofValidatedMessage } from "./followup-messages/success";
import { sendTimeoutMessage } from "./followup-messages/timeout";
import { sendRequestConnectedMessage } from "./followup-messages/user-connected";
import { verifyVerificationValidness } from "./validate-proof";
import { verifyVerificationResponseStructure } from "./verify-response";

const signal = getEnv("SIGNAL");
const appName = getEnv("APP_NAME");

const EventBusName = getEnv("EVENT_BUS_NAME");

const secretManager = new SecretsManagerClient({});
const eventBridge = new EventBridgeClient({});

// FIXME: This function should be removed and used from the SDK
export function hashBytes(input: string): string {
  const bytesInput = Buffer.from(input);
  const tight: Array<Uint8Array> = [arrayify(bytesInput)];
  const data = hexlify(concat(tight));
  const hashed = "0x" + sha3.keccak_256(arrayify(data));
  const hash = BigInt(hashed) >> BigInt(8);
  return `0x${hash.toString(16).padStart(64, "0")}`;
}

async function walletConnectFlow(
  message: APIApplicationCommandInteraction,
  rest: REST,
  lambdaContext: Context,
  action_id: string,
) {
  const connector = new WalletConnect({
    bridge: "https://bridge.walletconnect.org",
    clientMeta: {
      description: "World ID Discord Bot",
      url: "https://id.worldcoin.org/docs/",
      icons: ["https://id.worldcoin.org/img/logomark.svg"],
      name: appName,
    },
  });

  const timeoutTimer = setTimeout(() => {
    console.log("2 seconds left, sending timeout message...");
    if (connector.connected) {
      connector.rejectRequest({
        error: {
          code: -32602,
          message: "generic_error",
        },
      });
      connector.killSession().catch(console.error.bind(console));
    }
    void sendTimeoutMessage({
      rest,
      applicationId: message.application_id,
      interactionToken: message.token,
    });
  }, lambdaContext.getRemainingTimeInMillis() - 2000);

  try {
    connector.on("session_update", (error, _payload) => {
      if (error) throw error;
    });

    connector.on("disconnect", (error, _payload) => {
      if (error) throw error;
    });

    await connector.createSession();

    console.log("Session created", connector.uri);
    // TODO: share this code with the World ID JS widget
    const bridgeUrl = new URL(connector.bridge);
    const url = new URL("https://worldcoin.org/verify");
    url.searchParams.append("t", connector.handshakeTopic);
    url.searchParams.append("k", connector.key);
    url.searchParams.append("b", bridgeUrl.hostname);
    url.searchParams.append("v", "1");

    await sendStartingValidationMessage({
      rest,
      applicationId: message.application_id,
      interactionToken: message.token,
      sessionUri: url.toString(),
    });

    await new Promise<void>((resolve, reject) => {
      connector.on("connect", (err) => (err ? reject(err) : resolve()));
    });

    console.log("Connection established");
    await sendRequestConnectedMessage({
      rest,
      applicationId: message.application_id,
      interactionToken: message.token,
      remainingTimeInMs: lambdaContext.getRemainingTimeInMillis(),
    });

    // FIXME: Export payload generation function from World ID JS SDK and reuse here

    console.log(`Starting verification with action_id: ${action_id}`);
    const verificationResponse = await connector.sendCustomRequest({
      id: randomInt(100000, 9999999),
      jsonrpc: "2.0",
      method: "wld_worldIDVerification",
      params: [
        {
          signal: hashBytes(signal),
          action_id: hashBytes(action_id),
        },
      ],
    });

    if (!verifyVerificationResponseStructure(verificationResponse))
      throw new TypeError(
        `Received invalid verification response: ${JSON.stringify(
          verificationResponse,
        )}`,
      );
    console.log("Response received", verificationResponse);
    await sendProofReceivedMessage({
      rest,
      applicationId: message.application_id,
      interactionToken: message.token,
      remainingTimeInMs: lambdaContext.getRemainingTimeInMillis(),
    });

    if (
      !(await verifyVerificationValidness(
        verificationResponse,
        signal,
        action_id,
      ))
    )
      throw new Error(`Proof verification failed`);

    await Promise.all([
      sendProofValidatedMessage({
        rest,
        applicationId: message.application_id,
        interactionToken: message.token,
      }),
      eventBridge.send(
        new PutEventsCommand({
          Entries: [
            {
              EventBusName,
              Source: WORLD_ID_EVENTS_SOURCE,
              DetailType: ON_VERIFIED_EVENT,
              Detail: JSON.stringify(<UserCompletedVerification>{
                application_id: message.application_id,
                guild_id: message.guild_id,
                guild_locale: message.guild_locale,
                interaction_token: message.token,
                user: {
                  id: message.member?.user.id,
                  username: message.member?.user.username,
                  roles: message.member?.roles ?? [],
                },
              }),
            },
          ],
        }),
      ),
    ]);
  } catch (err) {
    console.error(err);
    sendErrorOccurredMessage({
      rest,
      applicationId: message.application_id,
      interactionToken: message.token,
    }).catch(console.error.bind(console));
  } finally {
    clearTimeout(timeoutTimer);
    connector.killSession().catch(console.error.bind(console));
  }
}

export const handler: SQSHandler = async (event, context) => {
  // This SQS event handler has batchSize:1 so we handle only first record
  const message = JSON.parse(
    event.Records[0].body,
  ) as APIApplicationCommandInteraction;

  const botToken = (
    await secretManager.send(
      new GetSecretValueCommand({ SecretId: getEnv("TOKEN_SECRET_ARN") }),
    )
  ).SecretString;

  if (typeof botToken !== "string")
    throw new TypeError(`botToken secret is empty`);

  const rest = new REST({ version: "10" }).setToken(botToken);

  if (!message.guild_id) {
    console.error("guild_id should be provided");

    await sendErrorOccurredMessage({
      rest,
      applicationId: message.application_id,
      interactionToken: message.token,
    }).catch(console.error.bind(console));

    return;
  }

  const guildBotConfig = await getBotConfig(message.guild_id);

  if (guildBotConfig.error) {
    console.error(guildBotConfig.error);

    await sendErrorOccurredMessage({
      rest,
      applicationId: message.application_id,
      interactionToken: message.token,
    }).catch(console.error.bind(console));

    return;
  }

  const { action_id, roles } = guildBotConfig.data;

  const isUserAlreadyValidated = await checkIsUserAlreadyVerified({
    message,
    rest,
    ROLES_TO_ASSIGN: roles,
  });

  if (isUserAlreadyValidated) {
    await sendAlreadyVerifiedErrorMessage({
      rest,
      applicationId: message.application_id,
      interactionToken: message.token,
    });
  } else {
    await walletConnectFlow(message, rest, context, action_id);
  }
};
