import toast from 'react-hot-toast'
import CustomToast from './CustomToast'
import { ToastType } from '../../types/toast.type'

const showToast = ({ type, icon, message, duration = 5000, id }: ToastType) => {
  toast(t => <CustomToast t={t} type={type} icon={icon} message={message} />, {
    duration: duration,
    id: id
  })
}

export { showToast }
