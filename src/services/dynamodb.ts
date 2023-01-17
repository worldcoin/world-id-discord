import {DynamoDBClient, GetItemCommand, PutItemCommand} from '@aws-sdk/client-dynamodb'
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb'
import {BotConfig} from 'common/types'

type SaveBotConfigResult = {
  success: boolean
  error?: Error
}

type GetBotConfigResult =
  | {
      data: BotConfig
      error?: never
    }
  | {
      data: null
      error: Error
    }

export const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  },
})

const TABLE_NAME = process.env.AWS_TABLE_NAME

export const verifyBotConfig = (botConfig: BotConfig): {status: boolean; error?: Error} => {
  if (!botConfig.guild_id) {
    return {status: false, error: new Error('Guild id is required')}
  }

  if (!botConfig.action_id) {
    return {status: false, error: new Error('Action id is required')}
  }

  if (!botConfig.hasOwnProperty('enabled')) {
    return {status: false, error: new Error('enabled is required')}
  }

  if (!botConfig.phone && !botConfig.orb) {
    return {status: false, error: new Error('Phone or orb verification is required')}
  }

  if (!botConfig.phone.hasOwnProperty('enabled')) {
    return {status: false, error: new Error('Phone verification enabled is required')}
  }

  if (!botConfig.orb.hasOwnProperty('enabled')) {
    return {status: false, error: new Error('Orb verification enabled is required')}
  }

  if (!botConfig.phone.roles || botConfig.phone.roles.length === 0) {
    return {status: false, error: new Error('Roles for phone verification is required')}
  }

  if (!botConfig.orb.roles || botConfig.orb.roles.length === 0) {
    return {status: false, error: new Error('Roles for orb verification is required')}
  }

  return {status: true}
}

export const saveBotConfig = async (botConfig: BotConfig): Promise<SaveBotConfigResult> => {
  let result: SaveBotConfigResult

  try {
    const response = await client.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall(botConfig),
      }),
    )

    if (response['$metadata'].httpStatusCode !== 200) {
      throw new Error('Error while adding bot config into database')
    }

    result = {success: true}
  } catch (error) {
    console.error(error)
    result = {success: false, error}
  }

  return result
}

export const getBotConfig = async (guildId: string): Promise<GetBotConfigResult> => {
  let result: GetBotConfigResult

  try {
    const response = await client.send(
      new GetItemCommand({
        TableName: TABLE_NAME,
        Key: marshall({guild_id: guildId}),
      }),
    )

    if (response['$metadata'].httpStatusCode !== 200) {
      throw new Error('Error while getting bot config from database')
    }

    if (!response.Item) {
      throw new Error('Bot config not found')
    }

    result = {data: unmarshall(response.Item) as BotConfig}
  } catch (error) {
    console.error(error)
    result = {data: null, error}
  }

  return result
}
