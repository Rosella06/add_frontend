import { cookies } from '../../constants/utils/utilsConstants'
import {
  COOKIE_ENCODE,
  COOKIE_DECODE,
  TOKEN_DECODE,
  UtilsState,
  UtilsAction,
  RESET_UTILS,
  SOCKET_ID,
  SOCKET_DATA,
  CURRENT_LANG,
  MACHINE_DATA,
  THEME_MODE
} from '../types/utilsTypes'

const initialState: UtilsState = {
  cookieEncode: cookies.get('tokenObject'),
  cookieDecode: undefined,
  tokenDecode: undefined,
  socketId: undefined,
  socketData: undefined,
  currentLang: cookies.get('lang') ?? 'th',
  machine: cookies.get('machine') ?? undefined,
  themeMode: cookies.get('theme') ?? 'sunset'
}

const utilsReducer = (
  state = initialState,
  action: UtilsAction
): UtilsState => {
  switch (action.type) {
    case COOKIE_ENCODE:
      return { ...state, cookieEncode: action.payload }
    case COOKIE_DECODE:
      return { ...state, cookieDecode: action.payload }
    case TOKEN_DECODE:
      return { ...state, tokenDecode: action.payload }
    case RESET_UTILS:
      return initialState
    case SOCKET_ID:
      return { ...state, socketId: action.payload }
    case SOCKET_DATA:
      return { ...state, socketData: action.payload }
    case CURRENT_LANG:
      return { ...state, currentLang: action.payload }
    case MACHINE_DATA:
      return { ...state, machine: action.payload }
    case THEME_MODE:
      return { ...state, themeMode: action.payload }
    default:
      return state
  }
}

export default utilsReducer
