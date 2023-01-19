import {createTable, isTableExists} from './src/services/dynamodb'

async function run() {
  const isExists = await isTableExists()
  if (isExists) {
    return
  }

  await createTable()
}

run()

export default run
