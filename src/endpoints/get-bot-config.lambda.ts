import { fetchBotConfig } from "@/utils/fetch-bot-config";
import type { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { guild_id } = event.queryStringParameters ?? {};

  const headers = {
    "Access-Control-Allow-Origin": "*",
  };

  if (!guild_id) {
    return {
      statusCode: 422,
      body: `guild_id is required but wasn't provided in querystring`,
      headers,
    };
  }

  const botConfig = await fetchBotConfig(guild_id);

  return {
    statusCode: 200,
    body: JSON.stringify(botConfig),
    headers,
  };
};
