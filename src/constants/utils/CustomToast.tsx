import { toast } from 'react-hot-toast'
import { HiXMark } from 'react-icons/hi2'
import { ToastComponentType } from '../../types/toast.type'

const CustomToast = ({
  t,
  icon: Icon,
  message,
  type = 'info',
  showClose
}: ToastComponentType) => {
  const typeStyles = {
    success: {
      iconBg: 'bg-success/20',
      iconColor: 'text-success',
      bg: 'bg-success/5'
    },
    error: {
      iconBg: 'bg-error/20',
      iconColor: 'text-error',
      bg: 'bg-error/5'
    },
    warning: {
      iconBg: 'bg-warning/20',
      iconColor: 'text-warning',
      bg: 'bg-warning/5'
    },
    info: {
      iconBg: 'bg-info/20',
      iconColor: 'text-info',
      bg: 'bg-info/5'
    }
  }

  const styles = typeStyles[type]

  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } bg-base-100 min-w-[354px] w-full max-w-2xl shadow-lg rounded-full pointer-events-auto animate-jelly-bounce`}
    >
      <div className={`flex items-center p-2 rounded-full ${styles.bg}`}>
        <div
          className={`flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-full animate-bounce-in`}
        >
          <div
            className={`w-full h-full flex items-center justify-center rounded-full ${styles.iconBg}`}
          >
            <Icon
              className={`${styles.iconColor}`}
              size={36}
              aria-hidden='true'
            />
          </div>
        </div>
        <div className='flex-1 mx-4'>
          <p className='text-lg font-medium text-base-content max-w-[500px] truncate'>
            {message}
          </p>
        </div>
        {showClose && (
          <div className='flex-shrink-0 mr-2'>
            <button
              onClick={() => toast.dismiss(t.id)}
              className='btn btn-ghost btn-circle btn-sm'
            >
              <HiXMark className='w-6 h-6 text-base-content/50 hover:text-base-content' />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomToast
