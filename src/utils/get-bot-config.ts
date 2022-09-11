import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { getEnv } from "./get-env";

type BotConfig = {
  guild_id: string;
  action_id: string;
  roles: Array<string>;
};

export const getBotConfig = async (guild_id: string) => {
  const client = new DynamoDBClient({ region: getEnv("AWS_DEFAULT_REGION") });

  const key = { guild_id };

  let result: BotConfig | null | undefined = undefined;

  try {
    const data = await client.send(
      new GetItemCommand({
        TableName: getEnv("DYNAMODB_TABLE_NAME"),
        Key: marshall(key),
      }),
    );

    if (!data.Item) {
      result = null;
    }

    if (data.Item) {
      result = unmarshall(data.Item) as BotConfig;
    }
  } catch (error) {
    console.log(error);
  }

  return result;
};
