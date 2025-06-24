export const isDeployedEnvironment = (
  ['production', 'staging'] as (typeof process.env.NEXT_PUBLIC_APP_ENV)[]
).includes(process.env.NEXT_PUBLIC_APP_ENV)
