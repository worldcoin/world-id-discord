// NOTE: These are types from the Developer Portal API
type CreateDynamicActionMutation = {
  __typename?: 'mutation_root'
  insert_action_one?: {
    __typename?: 'action'
    id: string
    action: string
    name: string
    description: string
    max_verifications: number
    external_nullifier: string
    status: string
  } | null
}

type DevPortalCreateActionSuccessResponse = {
  action: CreateDynamicActionMutation['insert_action_one']
}

export enum CreateActionErrorCode {
  Unauthorized = 'unauthorized',
  NotFound = 'not_found',
  ApiKeyInactive = 'api_key_inactive',
  InvalidApp = 'invalid_app',
  InvalidApiKey = 'invalid_api_key',
  ConstraintViolation = 'constraint-violation',
  InternalServerError = 'internal_server_error',
}

type DevPortalCreateActionErrorResponse = {
  code: CreateActionErrorCode
  detail?: string
  attribute?: string | null
  app_id?: string
  team_id?: string
}

export type DevPortalCreateActionResponse =
  | DevPortalCreateActionSuccessResponse
  | DevPortalCreateActionErrorResponse

export type CreateActionResponse = {
  success: boolean
}
