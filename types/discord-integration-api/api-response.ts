/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
export type SuccessApiResponse<T extends any = any> = {
  success: true
  data?: T
}

export type ErrorApiResponse = { success: false; error: string }
export type ApiResponse<T extends any = any> = SuccessApiResponse<T> | ErrorApiResponse
