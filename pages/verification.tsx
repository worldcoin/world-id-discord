import { findRoles } from 'helpers'
import { GetServerSideProps } from 'next'
import { getGuildData } from 'services/discord'
import { getBotConfig } from 'services/dynamodb'
import { Verification } from 'Verification'
export default Verification

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { user_id, guild_id, token } = ctx.query
  const appId = process.env.APP_ID

  if (!user_id || !guild_id || !token) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  }

  const guild = await getGuildData(guild_id as string)
  const botConfig = (await getBotConfig(guild_id as string)).data

  if (!botConfig) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  }

  const rolesToAssign = {
    device: findRoles(botConfig.device.roles, guild.roles),
    orb: findRoles(botConfig.orb.roles, guild.roles),
  }

  const credentials = [] as Array<'device' | 'orb'>

  if (botConfig.device.enabled) {
    credentials.push('device')
  }

  if (botConfig.orb.enabled) {
    credentials.push('orb')
  }

  return {
    props: {
      guild,
      rolesToAssign,
      guildId: guild_id,
      userId: user_id,
      token,
      appId,
      credentials,
    },
  }
}
