import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'
import createMiddleware from 'next-intl/middleware'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'
import { CustomHeaders } from './types/custom-headers'

const publicPages = ['/auth/sign-in', '/verification']

export const publicPathnameRegex = RegExp(
  `^(/(${routing.locales.join('|')}))?(${publicPages
    .flatMap(p => {
      if (p === '/') return ['', '/']
      return p.replace(/\/:([^/]+)/g, '/[^/]+')
    })
    .join('|')})/?$`,
  'i'
)
const isDev = process.env.NODE_ENV === 'development'

const generateCsp = () => {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  const csp = [
    { name: 'default-src', values: ["'self'"] },
    {
      name: 'script-src',
      values: ["'self'", `'nonce-${nonce}'`, ...(isDev ? ["'unsafe-eval'"] : [])],
    },
    {
      name: 'font-src',
      values: ["'self'", 'https://fonts.googleapis.com'],
    },
    {
      name: 'style-src',
      values: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
    },
    {
      name: 'connect-src',
      values: [
        "'self'",
        'https://bridge.worldcoin.org',
        'https://developer.worldcoin.org',
        ...(isDev ? ['webpack://*'] : []),
      ],
    },
    {
      name: 'img-src',
      values: ["'self'", 'data:', 'cdn.discordapp.com'],
    },
  ]

  const cspString = csp
    .map(directive => {
      return `${directive.name} ${directive.values.join(' ')}`
    })
    .join('; ')

  return { csp: cspString, nonce }
}

const prepareRequestSecurityHeaders = (request: NextRequest) => {
  const { csp, nonce } = generateCsp()
  const headers = new Headers(request.headers)
  headers.set('x-nonce', nonce)
  headers.set('content-security-policy', csp)
  return { csp, request: new NextRequest(request, { headers }) }
}

const prepareResponseSecurityHeaders = (response: NextResponse, csp: string) => {
  response.headers.set('content-security-policy', csp)
}

const intlMiddleware = createMiddleware(routing)

const runMidleware = async (req: NextRequest) => {
  const { csp, request } = prepareRequestSecurityHeaders(req)
  const response = intlMiddleware(request)
  const pathname = request.nextUrl.pathname
  response.headers.set(CustomHeaders.X_CURRENT_PATH, pathname)
  prepareResponseSecurityHeaders(response, csp)
  return response
}

const authMiddleware = withAuth(async req => await runMidleware(req), {
  callbacks: {
    authorized: ({ token }) => {
      return token !== null
    },
  },

  pages: { signIn: '/auth/sign-in' },
})

const middleware = async (req: NextRequest) => {
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)

  if (isPublicPage) {
    return await runMidleware(req)
  } else {
    return authMiddleware(req as NextRequestWithAuth, {} as NextFetchEvent)
  }
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|favicon.ico|.*\\..*).*)'],
}

export default middleware
