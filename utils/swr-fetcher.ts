import { ExternalFetchError } from '@/utils/external-fetch-error'

/**
export async function fetcher<T>(
 * SWR fetcher
 * @param input - RequestInfo
 * @param init - RequestInit
 * @returns Promise<T>
 */
export const fetcher = async <SuccessResponse = unknown, ErrorResponse = unknown>(
  input: RequestInfo,
  init?: RequestInit
): Promise<SuccessResponse> => {
  const response = await fetch(input, init)

  if (!response.ok) {
    const errorData = await response.json()

    const error = new ExternalFetchError(errorData.message, {
      cause: {
        status: response.status,
        data: errorData,
      },
    })

    throw error as ExternalFetchError<ErrorResponse>
  }

  if (response.status === 204) {
    return null as unknown as SuccessResponse
  }

  return (await response.json()) as SuccessResponse
}
