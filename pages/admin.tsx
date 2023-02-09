import { Admin } from 'Admin'
import { createInitialConfig } from 'helpers'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { getAvailableGuildRoles, getGuildData } from 'services/discord'
import { getBotConfig } from 'services/dynamodb'

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
  const roles = await getAvailableGuildRoles(session.user.guildId)

  const botConfig = (await getBotConfig(session.user.guildId)).data

  return {
    props: {
      session,
      roles,
      guild,
      initialConfig: createInitialConfig({ botConfig, roles, guild_id: guild.id }),
    },
  }
}
