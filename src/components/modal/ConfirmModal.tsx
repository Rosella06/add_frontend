import { useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'
import { BiCheck, BiError, BiErrorCircle, BiInfoCircle } from 'react-icons/bi'

type AlertType = 'info' | 'warning' | 'success' | 'error'

type ConfirmOptions = {
  title: string
  description?: string
  buttonConfirmText?: string
  type?: AlertType
}

export type ConfirmModalRef = {
  show: (options: ConfirmOptions) => Promise<boolean>
}

const ConfirmModal = forwardRef<ConfirmModalRef>((_, ref) => {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const resolver = useRef<((value: boolean) => void) | null>(null)
  const [options, setOptions] = useState<ConfirmOptions>({
    title: '',
    description: '',
    buttonConfirmText: '',
    type: 'info'
  })
  const [isLoading, setIsLoading] = useState(false)

  useImperativeHandle(ref, () => ({
    show: (opts: ConfirmOptions) => {
      return new Promise<boolean>(resolve => {
        setOptions(opts)
        resolver.current = resolve
        dialogRef.current?.showModal()
      })
    }
  }))

  const handleClose = () => {
    resolver.current?.(false)
    dialogRef.current?.close()
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 300))
    setIsLoading(false)
    resolver.current?.(true)
    dialogRef.current?.close()
  }

  const renderIcon = () => {
    switch (options.type) {
      case 'warning':
        return <BiErrorCircle size={38} className='text-yellow-500' />
      case 'success':
        return <BiCheck size={38} className='text-green-500' />
      case 'error':
        return <BiError size={38} className='text-red-500' />
      default:
        return <BiInfoCircle size={38} className='text-blue-500' />
    }
  }

  const renderColor = () => {
    switch (options.type) {
      case 'warning':
        return 'bg-yellow-500/15'
      case 'success':
        return 'bg-green-500/15'
      case 'error':
        return 'bg-red-500/15'
      default:
        return 'bg-blue-500/15'
    }
  }

  return (
    <dialog ref={dialogRef} className='modal'>
      <div className='modal-box w-2/5 p-[24px] rounded-[48px]'>
        <div className='flex flex-col gap-1.5'>
          <div
            className={`flex items-center justify-center w-18 h-18 rounded-full p-3 ${renderColor()}`}
          >
            {renderIcon()}
          </div>
          <h3 className='font-bold text-2xl mt-2.5'>{options.title}</h3>
          {options.description && (
            <span className='py-1.5 text-lg'>{options.description}</span>
          )}
        </div>
        <div className='flex gap-3 mt-6'>
          <button
            type='button'
            className='btn text-base font-medium flex-1 h-12 rounded-3xl'
            onClick={handleClose}
            disabled={isLoading}
          >
            {t('closeButton')}
          </button>
          <button
            type='button'
            className='btn btn-primary text-base font-bold flex-1 h-12 rounded-3xl'
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className='loading loading-spinner loading-md'></span>
            ) : (
              options.buttonConfirmText ?? t('confirmButton')
            )}
          </button>
        </div>
      </div>
    </dialog>
  )
})

export default ConfirmModal
