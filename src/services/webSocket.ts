import { io, Socket } from 'socket.io-client'

class SocketService {
  private static instance: SocketService
  private socket: Socket

  private longReconnectTimer: NodeJS.Timeout | null = null
  private readonly LONG_RECONNECT_DELAY = 30 * 60 * 1000

  private constructor () {
    this.socket = io(String(import.meta.env.VITE_APP_SOCKET), {
      transports: ['websocket'],
      upgrade: true,

      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 5500,
      reconnectionDelayMax: 5500,
      randomizationFactor: 0
    })

    this.initializeSocketEvents()
  }

  private initializeSocketEvents () {
    this.socket.on('connect', () => {
      console.info('✅ Socket Connected:', this.socket.id)

      if (this.longReconnectTimer) {
        clearTimeout(this.longReconnectTimer)
        this.longReconnectTimer = null
        console.info('👍 Cleared long reconnect timer.')
      }
    })

    this.socket.on('disconnect', reason => {
      console.warn('⚠️ Socket Disconnected, reason:', reason)
    })

    this.socket.on('reconnect_attempt', attempt => {
      console.log(`↪️ Reconnect attempt #${attempt} after 5 seconds...`)
    })

    this.socket.on('reconnect_failed', () => {
      console.error('❌ All 5 reconnection attempts failed.')
      this.scheduleLongReconnect()
    })

    this.socket.on('connect_error', err => {
      console.error('❌ Initial Connection Error:', err.message)
    })
  }

  private scheduleLongReconnect () {
    if (this.longReconnectTimer) {
      return
    }

    console.info(
      `⏰ Waiting ${this.LONG_RECONNECT_DELAY / 60000} minutes to try again...`
    )

    this.longReconnectTimer = setTimeout(() => {
      console.info(
        '⌛ 30 minutes have passed. Attempting to reconnect socket...'
      )
      this.socket.connect()
      this.longReconnectTimer = null
    }, this.LONG_RECONNECT_DELAY)
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

  public disconnect () {
    console.log('Manually disconnecting socket...')
    if (this.longReconnectTimer) {
      clearTimeout(this.longReconnectTimer)
      this.longReconnectTimer = null
    }
    this.socket.disconnect()
  }
}

export const socketService = SocketService.getInstance()
export const socket = socketService.getSocket()
