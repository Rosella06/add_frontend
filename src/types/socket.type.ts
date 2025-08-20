type SocketResponse<T = unknown> = {
  orderId: string
  data: T
  message: string
}

export type { SocketResponse }
