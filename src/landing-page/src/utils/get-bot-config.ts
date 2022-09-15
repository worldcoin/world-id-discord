import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import type { BotConfig, GetBotConfigResult } from "~/types";
import { client } from ".";

// @REVIEW not sure where to store credentials
const TABLE_NAME = process.env.REACT_APP_AWS_DYNAMODB_TABLE_NAME;

export const getBotConfig = async (guild_id: string) => {
  const key = { guild_id };

  let result: GetBotConfigResult = {
    data: undefined,
    error: new Error("Data was never fetched"),
  };

  let data;

  try {
    data = await client.send(
      new GetItemCommand({
        TableName: TABLE_NAME,
        Key: marshall(key),
      }),
    );
  } catch (error) {
    result = {
      error: new Error("There is no data for this guild in DB", {
        cause: error as Error,
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
    const item = unmarshall(data?.Item);
    result = { data: item as BotConfig, error: undefined };
  }

  return result;
};
