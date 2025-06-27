'use client'

import { routes } from '@/utils/routes'
import { signIn } from 'next-auth/react'
import { useEffect } from 'react'

export const SignInWithDiscord = () => {
  useEffect(() => {
    signIn('discord', { callbackUrl: routes.admin() })
  }, [])

  return null
}
