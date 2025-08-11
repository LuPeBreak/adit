export interface ActionResponse<T = void> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    field?: string
  }
}

export function createSuccessResponse<T = void>(data?: T): ActionResponse<T> {
  return {
    success: true,
    data,
  }
}

export function createErrorResponse<T = void>(
  message: string,
  code?: string,
  field?: string,
): ActionResponse<T> {
  return {
    success: false,
    error: {
      message,
      code,
      field,
    },
  }
}
