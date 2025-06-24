import { NextResponse } from 'next/server'

export type ErrorInternalApiResponse<T extends string = string> = {
  error: string
  errorCode?: T
}

export const internalErrorResponse = (params: {
  message: string
  code: number
  errorCode?: string
}): NextResponse<ErrorInternalApiResponse> => {
  return NextResponse.json(
    { error: params.message, ...(params.errorCode && { errorCode: params.errorCode }) },
    { status: params.code }
  )
}
