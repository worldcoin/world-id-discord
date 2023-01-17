import {findRoles} from 'helpers'
import {GetServerSideProps} from 'next'
import {getSession} from 'next-auth/react'
import {getGuildData} from 'services/discord'
import {getBotConfig} from 'services/dynamodb'
import {Verification} from 'Verification'
export default Verification

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (!session || !session.user) {
    return {
      props: {
        guild: null,
      },
    }
  }

  const guild = await getGuildData(session.user.guildId)
  const botConfig = (await getBotConfig(session.user.guildId)).data

  if (!botConfig) {
    return {
      props: {
        guild,
      },
    }
  }

  const rolesToAssign = {
    phone: findRoles(botConfig.phone.roles, guild.roles),
    orb: findRoles(botConfig.orb.roles, guild.roles),
  }

  return {
    props: {
      guild,
      rolesToAssign,
    },
  }
}
