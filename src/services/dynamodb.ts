import {DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb'
import {marshall} from '@aws-sdk/util-dynamodb'
import {BotConfig} from 'common/types'

type SaveBotConfigResult = {
  success: boolean
  error?: Error
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
