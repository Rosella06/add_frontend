import { CookieDecode } from '../../types/cookie.type'
import { SocketResponse } from '../../types/socket.type'
import { TokenDecode } from '../../types/token.type'

const COOKIE_ENCODE = 'COOKIE_ENCODE'
const COOKIE_DECODE = 'COOKIE_DECODE'
const TOKEN_DECODE = 'TOKEN_DECODE'
const RESET_UTILS = 'RESET_UTILS'
const SOCKET_ID = 'SOCKET_ID'
const SOCKET_DATA = 'SOCKET_DATA'
const CURRENT_LANG = 'CURRENT_LANG'
const MACHINE_ID = 'MACHINE_ID'

interface UtilsState {
  cookieEncode?: string
  cookieDecode?: CookieDecode
  tokenDecode?: TokenDecode
  socketId: string | undefined
  socketData: SocketResponse | undefined
  currentLang: string
  machineID: string | undefined
}

type UtilsAction =
  | { type: typeof COOKIE_ENCODE; payload: string }
  | { type: typeof COOKIE_DECODE; payload: CookieDecode }
  | { type: typeof TOKEN_DECODE; payload: TokenDecode }
  | { type: typeof RESET_UTILS }
  | { type: typeof SOCKET_ID; payload: string | undefined }
  | { type: typeof SOCKET_DATA; payload: SocketResponse | undefined }
  | { type: typeof CURRENT_LANG; payload: string }
  | { type: typeof MACHINE_ID; payload: string }

export {
  COOKIE_ENCODE,
  COOKIE_DECODE,
  TOKEN_DECODE,
  RESET_UTILS,
  SOCKET_ID,
  SOCKET_DATA,
  CURRENT_LANG,
  MACHINE_ID
}
export type { UtilsState, UtilsAction }
