import { Metadata, Viewport } from 'next'
import { PropsWithChildren } from 'react'
import './globals.css'

export const viewport: Viewport = {
  viewportFit: 'cover',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  width: 'device-width',
}

export const metadata: Metadata = {
  title: 'Discord x Worldcoin',
  description: 'Improve your Discord server by verifying unique people with World ID',
}

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: PropsWithChildren) {
  return children
}
