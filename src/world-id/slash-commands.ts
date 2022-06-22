import { SlashCommandBuilder } from "@discordjs/builders";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";

export const START_VERIFICATION_COMMAND = "verify";

const startVerificationCommand = new SlashCommandBuilder()
  .setName(START_VERIFICATION_COMMAND)
  .setDescription("Verify that you are a real human using World ID")
  .setDMPermission(false);

export const commands: Omit<
  RESTPostAPIApplicationCommandsJSONBody,
  "application_id" | "id" | "version"
>[] = [startVerificationCommand.toJSON()];
