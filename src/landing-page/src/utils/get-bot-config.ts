import { BotConfig } from "~/types";

export const getBotConfig = async (guild_id: string) => {
  const result = (await fetch(
    `${process.env.REACT_APP_BOT_API_URL}/get-bot-config?guild_id=${guild_id}`,
  ).then((data) => data.json())) as unknown;

  return result as { data: BotConfig | null; error?: Error };
};
