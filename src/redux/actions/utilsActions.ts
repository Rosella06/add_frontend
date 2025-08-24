import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'
import { CookieDecode } from '../../types/cookie.type'
import { Machines } from '../../types/machine.type'
import { SocketResponse } from '../../types/socket.type'
import { TokenDecode } from '../../types/token.type'
import {
  COOKIE_ENCODE,
  COOKIE_DECODE,
  TOKEN_DECODE,
  RESET_UTILS,
  SOCKET_ID,
  SOCKET_DATA,
  CURRENT_LANG,
  MACHINE_DATA,
  THEME_MODE
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

const setSocketData = (data: SocketResponse | undefined) => ({
  type: SOCKET_DATA,
  payload: data
})

const setLanguage = (lang: string) => {
  cookies.set('lang', lang, cookieOptions)

  return {
    type: CURRENT_LANG,
    payload: lang
  }
}

const setMachine = (machineData: Machines | undefined) => {
  cookies.set('machine', machineData, cookieOptions)

  return {
    type: MACHINE_DATA,
    payload: machineData
  }
}

const setTheme = (theme: string) => {
  cookies.set('theme', theme, cookieOptions)

  return {
    type: THEME_MODE,
    payload: theme
  }
}

const resetUtils = () => ({
  type: RESET_UTILS
})

export {
  setCookieEncode,
  setCookieDecode,
  setTokenDecode,
  setSocketId,
  resetUtils,
  setSocketData,
  setLanguage,
  setMachine,
  setTheme
}
