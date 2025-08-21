import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiPlus, BiSearch, BiSolidDownArrow, BiX } from 'react-icons/bi'
import { showToast } from '../../constants/utils/toast'
import { AxiosError } from 'axios'
import axiosInstance from '../../constants/axios/axiosInstance'
import { ApiResponse } from '../../types/api.response.type'
import { Machines } from '../../types/machine.type'

const Machine = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [machineData, setMachineData] = useState<Machines[]>([])
  const [machineForm, setMachineForm] = useState({
    machineName: '',
    ipAddress: ''
  })
  const [isloading, setIsLoading] = useState(false)
  const addModal = useRef<HTMLDialogElement>(null)
  const editModal = useRef<HTMLDialogElement>(null)

  const fetchMachine = async () => {
    try {
      const result = await axiosInstance.get<ApiResponse<Machines[]>>(
        '/machines'
      )
      setMachineData(result.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    }
  }

  const handleSubmit = async () => {
    if (machineForm.machineName !== '' && machineForm.ipAddress !== '') {
      setIsLoading(true)
      try {
        const result = await axiosInstance.post<ApiResponse<string>>(
          `/machines`,
          machineForm
        )
        addModal.current?.close()
        resetForm()
        setIsLoading(false)
        await fetchMachine()
        await showToast({
          type: 'success',
          icon: BiSolidDownArrow,
          message: result.data.message,
          duration: 3000,
          showClose: false
        })
      } catch (error) {
        if (error instanceof AxiosError) {
          addModal.current?.close()
          await showToast({
            type: 'error',
            icon: BiSolidDownArrow,
            message: error.response?.data.message ?? t('somethingWentWrong'),
            duration: 3000,
            showClose: false
          }).finally(() => addModal.current?.showModal())
        } else {
          console.error(error)
        }
      }
    } else {
      addModal.current?.close()
      await showToast({
        type: 'warning',
        icon: BiSolidDownArrow,
        message: t('pleaseCompleteField'),
        duration: 3000,
        showClose: true
      }).finally(() => addModal.current?.showModal())
    }
  }

  const resetForm = () => {
    setMachineForm({ machineName: '', ipAddress: '' })
  }

  useEffect(() => {
    fetchMachine()
  }, [])

  return (
    <div>
      <div className='flex items-center justify-between'>
        <span className='text-2xl font-medium'>{t('itemMachine')}</span>
        <div className='flex items-center gap-3'>
          <label className='input h-12'>
            <BiSearch size={22} />
            <input
              type='text'
              placeholder={t('search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search.length > 1 && (
              <span
                className='kbd kbd-md cursor-pointer'
                onClick={() => setSearch('')}
              >
                <BiX size={24} />
              </span>
            )}
          </label>
          <div className='tooltip tooltip-bottom' data-tip={t('addMachine')}>
            <button
              className='btn btn-primary text-base h-12 w-12 p-0'
              onClick={() => {
                if (addModal.current) {
                  addModal.current.showModal()
                }
              }}
            >
              <BiPlus size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className='mt-3'>
        
      </div>

      <dialog ref={addModal} className='modal'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>{t('addMachine')}</h3>
          <div className='w-full'>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('machineName')}
              </legend>
              <input
                type='text'
                className='input w-full'
                value={machineForm.machineName}
                onChange={e =>
                  setMachineForm({
                    ...machineForm,
                    machineName: e.target.value
                  })
                }
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('machineIpaddress')}
              </legend>
              <input
                type='text'
                className='input w-full'
                value={machineForm.ipAddress}
                onChange={e =>
                  setMachineForm({ ...machineForm, ipAddress: e.target.value })
                }
              />
            </fieldset>
            {/* <fieldset className='fieldset'>
              <legend className='fieldset-legend'>What is your name?</legend>
              <select defaultValue='Pick a color' className='select w-full'>
                <option disabled={true}>Pick a color</option>
                <option>Crimson</option>
                <option>Amber</option>
              </select>
            </fieldset> */}
          </div>
          <div className='modal-action'>
            <form method='dialog' className='flex items-center gap-3'>
              <button
                className='btn text-base font-medium'
                onClick={() => resetForm()}
                disabled={isloading}
              >
                {t('closeButton')}
              </button>
              <button
                type='button'
                className='btn btn-primary text-base font-bold'
                onClick={handleSubmit}
                disabled={isloading}
              >
                {isloading ? (
                  <span className='loading loading-spinner loading-md'></span>
                ) : (
                  t('saveButton')
                )}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default Machine
