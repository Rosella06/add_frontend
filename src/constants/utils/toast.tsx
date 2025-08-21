import toast from 'react-hot-toast'
import CustomToast from './CustomToast'
import { ToastType } from '../../types/toast.type'

const showToast = ({
  type,
  icon,
  message,
  duration = 5000,
  showClose = false,
  id
}: ToastType): Promise<void> => {
  return new Promise(resolve => {
    const toastId = toast(
      t => <CustomToast t={t} type={type} icon={icon} message={message} showClose={showClose} />,
      {
        duration,
        id
      }
    )

    const timer = setTimeout(() => {
      resolve()
    }, duration)

    const originalDismiss = toast.dismiss
    toast.dismiss = (targetId?: string) => {
      const result = originalDismiss(targetId)
      if (!targetId || targetId === toastId) {
        clearTimeout(timer)
        resolve()
      }
      return result
    }
  })
}

export { showToast }
