import { CookieDecode } from '../../types/cookie.type'
import { TokenDecode } from '../../types/token.type'
import {
  COOKIE_ENCODE,
  COOKIE_DECODE,
  TOKEN_DECODE,
  RESET_UTILS,
  SOCKET_ID
} from '../types/utilsTypes'

const setCookieEncode = (dataEncode?: string) => ({
  type: COOKIE_ENCODE,
  payload: dataEncode
})

const setCookieDecode = (dataDecode?: CookieDecode) => ({
  type: COOKIE_DECODE,
  payload: dataDecode
})

const setTokenDecode = (tokenDecode: TokenDecode) => ({
  type: TOKEN_DECODE,
  payload: tokenDecode
})

const setSocketId = (socketId: string | undefined) => ({
  type: SOCKET_ID,
  payload: socketId
})

const resetUtils = () => ({
  type: RESET_UTILS
})

export {
  setCookieEncode,
  setCookieDecode,
  setTokenDecode,
  setSocketId,
  resetUtils
}
