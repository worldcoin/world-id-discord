import { CredentialType } from '@worldcoin/idkit-core'
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
    device: findRoles({ configRoles: botConfig.device?.roles, allRoles: guild.roles }),
    orb: findRoles({ configRoles: botConfig.orb?.roles, allRoles: guild.roles }),
  }

  const credentials = [] as Array<CredentialType>

  if (botConfig.device?.enabled) {
    credentials.push(CredentialType.Device)
  }

  if (botConfig.orb?.enabled) {
    credentials.push(CredentialType.Orb)
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
