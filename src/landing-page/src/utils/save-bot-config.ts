type BotConfig = {
  guild_id: string;
  action_id: string;
  roles: Array<string>;
};

export const saveBotConfig = async (
  botConfig: BotConfig,
): Promise<{ success: boolean; error?: Error }> => {
  const result = (await fetch(
    `${process.env.REACT_APP_BOT_API_URL}/save-bot-config`,
    {
      method: "POST",
      body: JSON.stringify({ item: botConfig }),
    },
  ).then((data) => data.json())) as unknown;

  return result as { success: boolean; error?: Error };
};
