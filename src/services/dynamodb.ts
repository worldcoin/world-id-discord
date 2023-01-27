import {
  CreateTableCommand,
  DynamoDBClient,
  GetItemCommand,
  ListTablesCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb'

import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { BotConfig } from 'common/types'

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
  region: process.env.AWS_DISCORD_BOUNCER_REGION,
  credentials: {
    accessKeyId: process.env.AWS_DISCORD_BOUNCER_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_DISCORD_BOUNCER_SECRET_ACCESS_KEY as string,
  },
})

const TABLE_NAME = process.env.AWS_GUILDS_TABLE_NAME

export const params = {
  AttributeDefinitions: [
    {
      AttributeName: 'guild_id',
      AttributeType: 'S',
    },
  ],

  KeySchema: [
    {
      AttributeName: 'guild_id',
      KeyType: 'HASH',
    },
  ],

  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },

  TableName: TABLE_NAME,
}

export const createTable = async () => {
  let result: { success: boolean; error?: Error } = { success: false }

  console.log('Creating table...')

  try {
    await client.send(
      new CreateTableCommand({
        KeySchema: params.KeySchema,
        AttributeDefinitions: params.AttributeDefinitions,
        ProvisionedThroughput: params.ProvisionedThroughput,
        TableName: params.TableName,
      }),
    )

    result = { success: true }
    console.log('Table created successfully')
  } catch (error) {
    console.log('Table not created, error occurred')
    console.log(error.message)
    result = { success: false, error }
  }

  return result
}

export const isTableExists = async (): Promise<boolean | null> => {
  const response = await client.send(new ListTablesCommand({}))

  if (!response.TableNames) {
    return null
  }

  const result = response.TableNames.some((tableName) => tableName === TABLE_NAME)

  if (!result) {
    console.log('Table not found, trying to create a table')
    return result
  }

  console.log(`Table '${TABLE_NAME}' already exists, skipping creation`)
  return result
}

export const verifyBotConfig = (botConfig: BotConfig): { status: boolean; error?: Error } => {
  if (!botConfig.guild_id) {
    return { status: false, error: new Error('Guild id is required') }
  }

  if (!botConfig.hasOwnProperty('enabled')) {
    return { status: false, error: new Error('enabled is required') }
  }

  if (!botConfig.phone && !botConfig.orb) {
    return { status: false, error: new Error('Phone or orb verification is required') }
  }

  if (!botConfig.phone.hasOwnProperty('enabled')) {
    return { status: false, error: new Error('Phone verification enabled is required') }
  }

  if (!botConfig.orb.hasOwnProperty('enabled')) {
    return { status: false, error: new Error('Orb verification enabled is required') }
  }

  if (botConfig.orb.roles.length === 0 && botConfig.orb.enabled) {
    return { status: false, error: new Error('Set at least one role to Orb verification method') }
  }

  if (botConfig.phone.roles.length === 0 && botConfig.phone.enabled) {
    return { status: false, error: new Error('Set at least one role to Orb verification method') }
  }

  return { status: true }
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

    result = { success: true }
  } catch (error) {
    console.error(error)
    result = { success: false, error }
  }

  return result
}

export const getBotConfig = async (guildId: string): Promise<GetBotConfigResult> => {
  let result: GetBotConfigResult

  try {
    const response = await client.send(
      new GetItemCommand({
        TableName: TABLE_NAME,
        Key: marshall({ guild_id: guildId }),
      }),
    )

    if (response['$metadata'].httpStatusCode !== 200) {
      throw new Error('Error while getting bot config from database')
    }

    if (!response.Item) {
      throw new Error('Bot config not found')
    }

    result = { data: unmarshall(response.Item) as BotConfig }
  } catch (error) {
    console.error(error)
    result = { data: null, error }
  }

  return result
}
