import { PostHog } from 'posthog-node'

// NOTE: duplicated from posthog-node, because it's not exported
type EventMessageV1 = {
  event: string
  groups?: Record<string, string | number>
  sendFeatureFlags?: boolean
  timestamp?: Date
  distinctId: string
  properties?: Record<string | number, any>
  disableGeoip?: boolean
}

export const PostHogClient = () => {
  if (!process.env.POSTHOG_API_KEY || !process.env.POSTHOG_HOST) {
    throw new Error('PostHog environment is not configured properly')
  }

  let client = new PostHog(process.env.POSTHOG_API_KEY, { host: process.env.POSTHOG_HOST, flushAt: 1 })

  const flush = async (data?: any) => {
    return new Promise((resolve, reject) => {
      client?.flush((error) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  const capture = async (params: EventMessageV1) => {
    try {
      client?.capture(params)
      await flush()
      return { success: true, params }
    } catch (error) {
      return { success: false, error }
    }
  }

  const shutdown = async () => {
    await client?.shutdownAsync()
  }

  return {
    capture,
    flush,
    shutdown,
  }
}
