import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { client } from ".";

import { marshall } from "@aws-sdk/util-dynamodb";

type BotConfig = {
  guild_id: string;
  action_id: string;
  roles: Array<string>;
};

// @REVIEW not sure where to store credentials
const TABLE_NAME = process.env.REACT_APP_AWS_DYNAMODB_TABLE_NAME;

export const saveBotConfig = async (bogConfig: BotConfig) => {
  let success: boolean;
  console.log(bogConfig);
  try {
    const response = await client.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall(bogConfig),
      }),
    );

    if (response["$metadata"].httpStatusCode !== 200) {
      throw new Error("Error while saving bot config to DB.");
    }

    success = true;
  } catch (error) {
    console.error(error);
    success = false;
  }

  return success;
};
