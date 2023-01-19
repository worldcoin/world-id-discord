import {Admin} from 'Admin'
import {createInitialConfig} from 'helpers'
import {GetServerSideProps} from 'next'
import {getSession} from 'next-auth/react'
import {getGuildData, getGuildRoles} from 'services/discord'
import {getBotConfig} from 'services/dynamodb'

const DISCORD_APP_ID = process.env.DISCORD_APP_ID

export default Admin

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (!session || !session.user) {
    return {
      props: {
        roles: null,
        session: null,
        guild: null,
        initialBotConfig: null,
      },
    }
  }

  const guild = await getGuildData(session.user.guildId)
  const guildRoles = (await getGuildRoles(session.user.guildId)).filter((role) => role.name !== '@everyone')
  const botRole = guildRoles.find((guildRole) => guildRole.tags?.bot_id === DISCORD_APP_ID)
  const roles = guildRoles.filter(guildRole => guildRole.position < botRole!.position)

  const botConfig = (await getBotConfig(session.user.guildId)).data

  return {
    props: {
      roles,
      session,
      guild,
      initialBotConfig: createInitialConfig(botConfig, roles),
    },
  }
}
