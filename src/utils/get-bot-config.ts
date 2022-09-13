import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { getEnv } from "./get-env";

type BotConfig = {
  guild_id: string;
  action_id: string;
  roles: Array<string>;
};

type GetBotConfigResult =
  | {
      data: BotConfig;
      error?: never;
    }
  | {
      data?: null;
      error: Error;
    };

export const getBotConfig = async (guild_id: string) => {
  const client = new DynamoDBClient({ region: getEnv("AWS_DEFAULT_REGION") });

  const key = { guild_id };

  let result: GetBotConfigResult = {
    data: undefined,
    error: new Error("Data was never fetched"),
  };

  try {
    const data = await client.send(
      new GetItemCommand({
        TableName: getEnv("DYNAMODB_TABLE_NAME"),
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
      console.log("DynamoDB response: ", item);
      result = { data: item as BotConfig, error: undefined };
    }
  } catch (error) {
    result = {
      error: new Error("There is no data for this guild in DB", {
        cause: error,
      }),
    };
  }

  return result;
};
