export const routes = {
  home: () => '/' as const,
  admin: () => '/admin' as const,

  signIn: (params?: { callbackUrl?: string }) => {
    if (!params?.callbackUrl) {
      return '/auth/signin' as const
    }

    return `/auth/signin?callbackUrl=${params.callbackUrl}` as const
  },

  verification: () => '/verification' as const,

  api: {
    admin: {
      botConfig: () => '/api/admin/bot-config' as const,
      roles: () => '/api/admin/roles' as const,
      createAction: () => '/api/admin/create-action' as const,
    },

    verification: {
      complete: () => '/api/verification/complete' as const,
    },
  },
}
