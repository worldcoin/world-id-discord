import { getEnv } from "@/utils/get-env";
import type { PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import type { APIGatewayProxyHandler } from "aws-lambda";

type SaveBotConfigResult =
  | {
      success: true;
      error?: never;
    }
  | {
      success?: false;
      error: Error;
    };

type Body = {
  item?: { guild_id: string; action_id: string; roles: Array<string> };
};

type SaveBotConfigError = {
  name: string;
  $fault: string;
  $metadata: PutItemCommandOutput["$metadata"];
  __type: string;
  message: string;
};

export const handler: APIGatewayProxyHandler = async (event) => {
  const { item } = JSON.parse(event.body ?? "{}") as Body;

  if (!item) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: new Error("Data Item wasn't provided") }),
    };
  }

  const client = new DynamoDBClient({ region: getEnv("AWS_DEFAULT_REGION") });

  let result: SaveBotConfigResult = {
    success: false,
    error: new Error("Data wasn't saved"),
  };

  console.log(result);

  let data;

  try {
    data = await client.send(
      new PutItemCommand({
        TableName: getEnv("DYNAMODB_TABLE_NAME"),
        Item: marshall(item),
      }),
    );
    console.log(data);
  } catch (e) {
    const error = e as SaveBotConfigError;
    console.error(error);

    result = {
      success: false,
      error: new Error(error.message),
    };

    return {
      statusCode: error.$metadata.httpStatusCode ?? 400,
      body: JSON.stringify(result),
    };
  }

  result = {
    success: true,
  };

  return {
    statusCode: data.$metadata.httpStatusCode ?? 200,
    body: JSON.stringify(result),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
