import { findRoles } from 'helpers'
import { GetServerSideProps } from 'next'
import { getGuildData } from 'services/discord'
import { getBotConfig } from 'services/dynamodb'
import { Verification } from 'Verification'
export default Verification

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { user_id, guild_id } = ctx.query
  const actionId = process.env.ACTION_ID

  if (!user_id || !guild_id) {
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
    phone: findRoles(botConfig.phone.roles, guild.roles),
    orb: findRoles(botConfig.orb.roles, guild.roles),
  }

  const credentials = [] as Array<'phone' | 'orb'>

  if (botConfig.orb.enabled) {
    credentials.push('orb')
  }

  if (botConfig.phone.enabled) {
    credentials.push('phone')
  }

  return {
    props: {
      guild,
      rolesToAssign,
      guildId: guild_id,
      userId: user_id,
      actionId,
      credentials,
    },
  }
}
