import { Toast } from 'react-hot-toast'
import { IconType } from 'react-icons/lib'

type ToastType = {
  type: 'success' | 'error' | 'warning' | 'info'
  icon: IconType
  message: string
  duration: number
  showClose?: boolean
  id?: string
}

type ToastComponentType = {
  t: Toast
  icon: IconType
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  showClose?: boolean
}

export type { ToastType, ToastComponentType }
