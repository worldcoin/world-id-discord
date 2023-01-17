import {Admin} from 'Admin'
import {GetServerSideProps} from 'next'
import {getSession} from 'next-auth/react'
import {getGuildRoles} from 'services/discord'
export default Admin

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  const roles = (session && session.user) ? await getGuildRoles(session.user.guildId) : null
  return {
    props: {
      roles,
      session,
    }
  }
}
