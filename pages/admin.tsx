import {Admin} from 'Admin'
import {GetServerSideProps} from 'next'
import {getSession} from 'next-auth/react'
import {getGuildData, getGuildRoles} from 'services/discord'
export default Admin

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (!session || !session.user) {
    return {
      props: {
        roles: null,
        session: null,
        guild: null,
      },
    }
  }

  const guild = await getGuildData(session.user.guildId)
  const roles = (await getGuildRoles(session.user.guildId)).filter((role) => role.name !== '@everyone')

  return {
    props: {
      roles,
      session,
      guild,
    },
  }
}
