import NextAuthProvider from '@/providers/NextAuthProvider'
import { Locale, NextIntlClientProvider } from 'next-intl'
import { ReactNode } from 'react'
import { Sora, Rubik } from 'next/font/google'
import { cn } from '@/lib/utils'

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sora',
})
const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rubik',
})

type RootLayoutProps = Readonly<{
  children: ReactNode
  params: Promise<{ locale: string }>
}>

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = (await params) as { locale: Locale }

  return (
    <html lang={locale} className="min-h-dvh h-full">
      <body
        className={cn(
          sora.variable,
          rubik.variable,
          'size-full antialiased text-white font-sora'
        )}
      >
        <NextAuthProvider>
          <NextIntlClientProvider>
            <main className="size-full bg-black flex justify-center items-center">
              {children}
            </main>
          </NextIntlClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
