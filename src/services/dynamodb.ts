import {
  AttributeDefinition,
  CreateTableCommand,
  DynamoDBClient,
  GetItemCommand,
  KeySchemaElement,
  ListTablesCommand,
  ProvisionedThroughput,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb'

import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { BotConfig } from 'common/types'

export type TableConfig = {
  AttributeDefinitions: Array<AttributeDefinition>
  KeySchema: Array<KeySchemaElement>
  ProvisionedThroughput: ProvisionedThroughput
  TableName?: string
}

export type NullifierHashData = { guild_id: string; nullifier_hash: string }

type PutDataResult = {
  success: boolean
  error?: Error
}

type GetItemResult<T> =
  | {
      data: T
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

const GUILD_TABLE_NAME = process.env.AWS_GUILDS_TABLE_NAME
const NULLIFIER_TABLE_NAME = process.env.AWS_NULLIFIERS_TABLE_NAME

export const createTable = async (params: TableConfig) => {
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
    console.log(`Table ${params.TableName} created successfully`)
  } catch (error) {
    console.log('Table not created, error occurred')
    console.log(error.message)
    result = { success: false, error }
  }

  return result
}

export const isTableExists = async (name: string | undefined): Promise<boolean | null> => {
  const response = await client.send(new ListTablesCommand({}))

  if (!response.TableNames || !name) {
    return null
  }

  const result = response.TableNames.some((tableName) => tableName === name)

  if (!result) {
    console.log('Table not found, trying to create a table')
    return result
  }

  console.log(`Table '${name}' already exists, skipping creation`)
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

export const saveNullifier = async ({ guild_id, nullifier_hash }: NullifierHashData) => {
  let result: PutDataResult

  try {
    const response = await client.send(
      new PutItemCommand({
        TableName: NULLIFIER_TABLE_NAME,
        Item: marshall({ guild_id, nullifier_hash }),
      }),
    )

    if (response['$metadata'].httpStatusCode !== 200) {
      throw new Error('Error while adding nullifier into database')
    }

    result = { success: true }
  } catch (error) {
    console.error(error)
    result = { success: false, error }
  }

  return result
}

export const saveBotConfig = async (botConfig: BotConfig): Promise<PutDataResult> => {
  let result: PutDataResult

  try {
    const response = await client.send(
      new PutItemCommand({
        TableName: GUILD_TABLE_NAME,
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

export const getNullifierHash = async ({ guild_id, nullifier_hash }: NullifierHashData) => {
  let result: GetItemResult<NullifierHashData>

  try {
    const response = await client.send(
      new GetItemCommand({
        TableName: NULLIFIER_TABLE_NAME,
        Key: marshall({ guild_id, nullifier_hash }),
      }),
    )

    if (response['$metadata'].httpStatusCode !== 200) {
      throw new Error('Error while getting nullifier hash from from database')
    }

    if (!response.Item) {
      throw new Error('Nullifier not found')
    }

    result = { data: unmarshall(response.Item) as NullifierHashData }
  } catch (error) {
    console.error(error)
    result = { data: null, error }
  }

  return result
}

export const getBotConfig = async (guildId: string): Promise<GetItemResult<BotConfig>> => {
  let result: GetItemResult<BotConfig>

  try {
    const response = await client.send(
      new GetItemCommand({
        TableName: GUILD_TABLE_NAME,
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
