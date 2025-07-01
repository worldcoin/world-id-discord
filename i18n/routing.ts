import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

export const locales = [
  'en', // English: source
  // "ar", // Arabic (World) custom ar-001 -> ar
  // "zh-CN", // Chinese Simplified
  // "zh-TW", // Chinese Traditional
  // "fr", // French
  // "de", // German (Germany) custom de-DE -> de
  // "id", // Indonesian
  // "ja", // Japanese
  // "ko", // Korean
  // "ms", // Malay (Malaysia) custom ms-MY -> ms
  // "pl", // Polish
  // "pt", // Portuguese
  // "pt-BR", // Portuguese (Brazil)
  // "pt-PT", // Portuguese (Portugal)
  // "es", // Spanish (Latin America) custom es-419 -> es
  // "es-ES", // Spanish (Spain)
  // "sw", // Swahili
  // "th", // Thai
] as const

export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: defaultLocale,

  localePrefix: 'never',

  localeCookie: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
