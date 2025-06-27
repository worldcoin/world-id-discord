import { EventMessage, PostHog } from 'posthog-node'

export const PostHogClient = () => {
  if (!process.env.POSTHOG_API_KEY || !process.env.POSTHOG_HOST) {
    throw new Error('PostHog environment is not configured properly')
  }

  const client = new PostHog(process.env.POSTHOG_API_KEY, {
    host: process.env.POSTHOG_HOST,
    flushAt: 1,
  })

  const flush = async <T>(data?: T) => {
    await client?.flush()
    return data
  }

  const capture = async (params: EventMessage) => {
    try {
      client?.capture(params)
      await flush()
      return { success: true, params }
    } catch (error) {
      return { success: false, error }
    }
  }

  const shutdown = async () => {
    await client?.shutdown()
  }

  return {
    capture,
    flush,
    shutdown,
  }
}
