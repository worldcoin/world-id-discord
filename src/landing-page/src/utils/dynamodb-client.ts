import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// @REVIEW not sure where to store credentials
export const client = new DynamoDBClient({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY as string,
    sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN,
  },
});
