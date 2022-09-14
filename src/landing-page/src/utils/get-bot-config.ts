import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { client } from ".";

type BotConfig = {
  guild_id: string;
  action_id: string;
  roles: Array<string>;
};

export type GetBotConfigResult =
  | {
      data: BotConfig;
      error?: never;
    }
  | {
      data?: null;
      error: Error;
    };

// @REVIEW not sure where to store credentials
const TABLE_NAME = process.env.REACT_APP_AWS_DYNAMODB_TABLE_NAME;

export const getBotConfig = async (guild_id: string) => {
  const key = { guild_id };

  let result: GetBotConfigResult = {
    data: undefined,
    error: new Error("Data was never fetched"),
  };

  try {
    const data = await client.send(
      new GetItemCommand({
        TableName: TABLE_NAME,
        Key: marshall(key),
      }),
    );

    if (!data.Item) {
      result = {
        data: null,
        error: new Error("There is no data for this guild in DB"),
      };
    }

    if (data.Item) {
      const item = unmarshall(data.Item);
      result = { data: item as BotConfig, error: undefined };
    }
  } catch (error) {
    result = {
      error: new Error("There is no data for this guild in DB", {
        cause: error as Error,
      }),
    };
  }

  return result;
};
