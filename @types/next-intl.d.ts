import { Locale } from '@/i18n/routing'
import en from '../messages/en.json'

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof en
    Locale: Locale
  }
}
