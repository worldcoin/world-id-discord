const DEFAULT_URL = process.env.NEXT_PUBLIC_APP_URL

const IS_PRODUCTION =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_APP_ENV === 'production'

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

const constructVercelURL = () => {
  const vercelFallbackUrl = process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL

  if (IS_PRODUCTION && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  }

  if (vercelFallbackUrl) {
    return new URL(`https://${vercelFallbackUrl}`)
  }

  return null
}

export const getAppUrl = (): URL => {
  if (IS_DEVELOPMENT && DEFAULT_URL) {
    return new URL(DEFAULT_URL)
  }

  if (IS_DEVELOPMENT && !DEFAULT_URL) {
    throw new Error('NEXT_PUBLIC_APP_URL is not set')
  }

  const vercelUrl = constructVercelURL()

  if (!vercelUrl) {
    return new URL('http://localhost:3000')
  }

  return vercelUrl
}
