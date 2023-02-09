import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { getAvailableGuildRoles } from 'services/discord'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req })
  if (!token || !token.guildId) {
    return res.status(500).json({ message: 'Not authenticated' })
  }
  const roles = await getAvailableGuildRoles(token.guildId)
  res.status(200).json({ roles })
}
