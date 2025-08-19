import { io, Socket } from 'socket.io-client'

class SocketService {
  private static instance: SocketService
  private socket: Socket

  private constructor () {
    this.socket = io(String(import.meta.env.VITE_APP_SOCKET), {
      transports: ['websocket'],
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })

    this.socket.on('connect', () => {
      console.info('✅ Socket Connected:', this.socket.id)
    })

    this.socket.on('disconnect', () => {
      console.warn('⚠️ Socket Disconnected')
    })

    this.socket.on('connect_error', err => {
      console.error('❌ Socket Connection Error:', err)
    })
  }

  public static getInstance (): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService()
    }
    return SocketService.instance
  }

  public getSocket (): Socket {
    return this.socket
  }
}

export const socketService = SocketService.getInstance()
export const socket = socketService.getSocket()
