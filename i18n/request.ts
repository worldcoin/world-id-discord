import deepmerge from 'deepmerge'
import { getRequestConfig } from 'next-intl/server'
import { Locale, routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = (await requestLocale) as Locale | undefined

  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale
  }

  const normalizedLocale = locale.replace('-', '_')

  // fallback https://next-intl-docs.vercel.app/docs/usage/configuration#messages-fallback
  let userMessages = {}
  try {
    userMessages = (await import(`../messages/${normalizedLocale}.json`)).default
  } catch (error) {
    console.error(error)
  }

  const defaultMessages = (await import(`../messages/en.json`)).default

  return { messages: deepmerge(defaultMessages, userMessages), locale }
})
