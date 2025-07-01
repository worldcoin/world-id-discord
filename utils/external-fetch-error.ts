type ExternalFetchErrorCause<T = unknown> = {
  status?: number
  data?: T
}

export class ExternalFetchError<T = unknown> extends Error {
  cause: ExternalFetchErrorCause<T>

  constructor(
    message: string,
    options?: {
      cause?: ExternalFetchErrorCause<T>
    }
  ) {
    super(message)
    this.name = 'ExternalFetchError'

    this.cause = {
      status: options?.cause?.status,
      data: options?.cause?.data,
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ExternalFetchError)
    }
  }
}
