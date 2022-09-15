import type { BotConfig } from "@/types";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { getEnv } from "./get-env";

type GetBotConfigResult =
  | {
      data: BotConfig;
      error?: never;
    }
  | {
      data?: null;
      error: Error;
    };

export const getBotConfig = async (
  guild_id: string,
): Promise<GetBotConfigResult> => {
  const client = new DynamoDBClient({ region: getEnv("AWS_DEFAULT_REGION") });

  const key = { guild_id };

  let result: GetBotConfigResult = {
    data: undefined,
    error: new Error("Data was never fetched"),
  };

  let data;

  try {
    data = await client.send(
      new GetItemCommand({
        TableName: getEnv("DYNAMODB_TABLE_NAME"),
        Key: marshall(key),
      }),
    );
  } catch (error) {
    result = {
      error: new Error("There is no data for this guild in DB", {
        cause: error,
      }),
    };
  }

  if (!data?.Item) {
    result = {
      data: null,
      error: new Error("There is no data for this guild in DB"),
    };
  }

  if (data?.Item) {
    const item = unmarshall(data.Item);
    console.log("DynamoDB response: ", item);
    result = { data: item as BotConfig, error: undefined };
  }

  return result;
};
