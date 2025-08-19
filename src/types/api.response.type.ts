type ApiResponse<T> = {
  message: string
  success: boolean
  data: T
}

export type { ApiResponse }
