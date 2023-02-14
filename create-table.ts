import { createTable, isTableExists, TableConfig } from './src/services/dynamodb'

const GUILD_TABLE_NAME = process.env.AWS_GUILDS_TABLE_NAME
const NULLIFIER_TABLE_NAME = process.env.AWS_NULLIFIERS_TABLE_NAME
const ORB_NULLIFIER_TABLE_NAME = process.env.AWS_ORB_NULLIFIERS_TABLE_NAME

export const guildsTableConfig: TableConfig = {
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

  TableName: GUILD_TABLE_NAME,
}

export const nullifiersTableConfig: TableConfig = {
  AttributeDefinitions: [
    {
      AttributeName: 'guild_id',
      AttributeType: 'S',
    },
    {
      AttributeName: 'nullifier_hash',
      AttributeType: 'S',
    },
  ],

  KeySchema: [
    {
      AttributeName: 'guild_id',
      KeyType: 'HASH',
    },
    {
      AttributeName: 'nullifier_hash',
      KeyType: 'RANGE',
    },
  ],

  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },

  TableName: NULLIFIER_TABLE_NAME,
}

export const orbNullifiersTableConfig: TableConfig = {
  AttributeDefinitions: [
    {
      AttributeName: 'guild_id',
      AttributeType: 'S',
    },
    {
      AttributeName: 'nullifier_hash',
      AttributeType: 'S',
    },
  ],

  KeySchema: [
    {
      AttributeName: 'guild_id',
      KeyType: 'HASH',
    },
    {
      AttributeName: 'nullifier_hash',
      KeyType: 'RANGE',
    },
  ],

  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },

  TableName: ORB_NULLIFIER_TABLE_NAME,
}

async function createGuildsTable() {
  const isExists = await isTableExists(GUILD_TABLE_NAME)
  if (isExists) {
    return
  }

  await createTable(guildsTableConfig)
}

async function createNullifiersTable() {
  const isExists = await isTableExists(NULLIFIER_TABLE_NAME)
  if (isExists) {
    return
  }

  await createTable(nullifiersTableConfig)
}

async function createOrbNullifiersTable() {
  const isExists = await isTableExists(ORB_NULLIFIER_TABLE_NAME)
  if (isExists) {
    return
  }

  await createTable(orbNullifiersTableConfig)
}

async function createTables() {
  const guildsTable = createGuildsTable()
  const nullifiersTable = createNullifiersTable()
  const orbNullifiersTable = createOrbNullifiersTable()

  try {
    await Promise.all([guildsTable, nullifiersTable, orbNullifiersTable])
  } catch (error) {
    console.log(error)
  }
}

createTables()

export default createTables
