import { signIn } from 'next-auth/react'
import { memo, useEffect } from 'react'

export const Home = memo(function Home() {

  // Redirects user to Discord OAuth page
  useEffect(() => {
    signIn('discord', { callbackUrl: '/admin' })
  }, [])

  return null
})
