export const WORLD_ID_ENVIRONMENTS = ['production', 'staging', 'sandbox'] as const

export type WorldIdEnvironment = (typeof WORLD_ID_ENVIRONMENTS)[number]

export const isWorldIdEnvironment = (value: unknown): value is WorldIdEnvironment =>
  typeof value === 'string' && (WORLD_ID_ENVIRONMENTS as readonly string[]).includes(value)

/**
 * Resolves the World ID environment this deployment accepts proofs from.
 *
 * IDKit 4 stamps every result with the environment it was produced in
 * (`production`, `staging`, or `sandbox`), and the Developer Portal verifies a
 * proof in the environment the result names. A relying party must therefore
 * pin the environment it expects, reject results from any other environment
 * before verifying them, and confirm the verify response's environment, or a
 * simulator proof minted against a staging registration could pass for a
 * production one. See the "Verify the proof in your backend" step of the
 * IDKit integration guide.
 *
 * Configured via `NEXT_PUBLIC_WORLD_ID_ENVIRONMENT` so the widget and the
 * server agree; defaults to `production`. Set it to `staging` only for
 * testing with the World ID Simulator.
 */
export const resolveWorldIdEnvironment = (): WorldIdEnvironment => {
  const value = process.env.NEXT_PUBLIC_WORLD_ID_ENVIRONMENT ?? 'production'

  if (!isWorldIdEnvironment(value)) {
    throw new Error(
      `NEXT_PUBLIC_WORLD_ID_ENVIRONMENT must be one of ${WORLD_ID_ENVIRONMENTS.join(', ')}; got "${value}"`
    )
  }

  return value
}
