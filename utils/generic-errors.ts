export const genericError = {
  unauthorized: { message: 'Unauthorized', code: 401 },
  forbidden: { message: 'Forbidden', code: 403 },

  environmentIsMisconfigured: {
    message: 'Environment is misconfigured',
    code: 500,
  },

  internalServerError: {
    message: 'Internal server error',
    code: 500,
  },
}
