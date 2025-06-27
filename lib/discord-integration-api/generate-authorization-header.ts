import { getAppUrl } from '@/utils/get-app-url'
import { SignJWT } from 'jose'

const APP_URL = getAppUrl().toString()
const issuer = APP_URL.endsWith('/') ? APP_URL.slice(0, -1) : APP_URL
const audience = process.env.DISCORD_INTEGRATION_API_URL!
const secret = new TextEncoder().encode(process.env.DISCORD_INTEGRATION_API_SIGN_SECRET!)

const generateToken = async () => {
  const now = Math.floor(Date.now() / 1000)

  return await new SignJWT({ sub: 'discord-integration' })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(now)
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime(now + 60)
    .sign(secret)
}

export const generateAuthorizationHeader = async () => {
  const token = await generateToken()
  return `Bearer ${token}`
}
