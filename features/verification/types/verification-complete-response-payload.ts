import { ErrorInternalApiResponse } from '@/utils/error-response'
import { APIRole } from 'discord-api-types/v10'
import { VerificationError } from './verification-error'

export type VerificationCompleteSuccessResponsePayload = {
  assignedRoles: APIRole[]
}

export type VerificationCompleteErrorResponsePayload =
  ErrorInternalApiResponse<VerificationError>

export type VerificationCompleteResponsePayload =
  | VerificationCompleteSuccessResponsePayload
  | VerificationCompleteErrorResponsePayload
