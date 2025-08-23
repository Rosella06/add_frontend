enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  HEAD_PHARMACIST = 'HEAD_PHARMACIST',
  PHARMACIST = 'PHARMACIST',
  ASSISTANT = 'ASSISTANT',
  SUPER = 'SUPER'
}

type Users = {
  id: string
  userName: string
  displayName: string
  userImage: string
  userRole: Role
  userStatus: boolean
  createBy?: string
  createdAt: string
  updatedAt: string
}

export { Role }
export type { Users }
