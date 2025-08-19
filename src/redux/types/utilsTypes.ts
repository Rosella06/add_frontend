import { CookieDecode } from '../../types/cookie.type'
import { TokenDecode } from '../../types/token.type'

const COOKIE_ENCODE = 'COOKIE_ENCODE'
const COOKIE_DECODE = 'COOKIE_DECODE'
const TOKEN_DECODE = 'TOKEN_DECODE'
const RESET_UTILS = 'RESET_UTILS'
const SOCKET_ID = 'SOCKET_ID'

interface UtilsState {
  cookieEncode?: string
  cookieDecode?: CookieDecode
  tokenDecode?: TokenDecode
  socketId: string | undefined
}

type UtilsAction =
  | { type: typeof COOKIE_ENCODE; payload: string }
  | { type: typeof COOKIE_DECODE; payload: CookieDecode }
  | { type: typeof TOKEN_DECODE; payload: TokenDecode }
  | { type: typeof RESET_UTILS }
  | { type: typeof SOCKET_ID; payload: string | undefined }

export { COOKIE_ENCODE, COOKIE_DECODE, TOKEN_DECODE, RESET_UTILS, SOCKET_ID }
export type { UtilsState, UtilsAction }
