import { Toast } from 'react-hot-toast'
import { IconType } from 'react-icons/lib'

type ToastType = {
  type: 'success' | 'error' | 'warning' | 'info'
  icon: IconType
  message: string
  duration: number
  id?: string
}

type ToastComponentType = {
  t: Toast
  icon: IconType
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

export type { ToastType, ToastComponentType }
