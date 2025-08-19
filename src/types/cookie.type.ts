import { Role } from './user.type'

type CookieDecode = {
  id: string
  displayName: string
  userImage: string
  userRole: Role
  userStatus: boolean
  token: string
}

export type { CookieDecode }
