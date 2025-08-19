import { Role } from './user.type'

type LoginResponse = {
  token: string
  id: string
  userRole: Role
  userStatus: boolean
  displayName: string
  userImage: string
}

export type { LoginResponse }
