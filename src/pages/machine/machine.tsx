import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiPlus, BiSearch, BiSolidDownArrow, BiX } from 'react-icons/bi'
import { showToast } from '../../constants/utils/toast'
import { AxiosError } from 'axios'
import { ApiResponse } from '../../types/api.response.type'
import { Machines } from '../../types/machine.type'
import DataTable, { TableColumn } from 'react-data-table-component'
import axiosInstance from '../../constants/axios/axiosInstance'

const Machine = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [machineData, setMachineData] = useState<Machines[]>([])
  const [machineDataFilter, setMachineDataFilter] = useState<Machines[]>([])
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

  const columns: TableColumn<Machines>[] = useMemo(
    () => [
      {
        name: 'name',
        selector: item => item.machineName,
        sortable: false,
        center: true,
        width: '200px'
      }
    ],
    [t, machineDataFilter, search]
  )

  useEffect(() => {
    fetchMachine()
  }, [])

  useEffect(() => {
    const filter = machineData.filter(f =>
      f.machineName.toLowerCase().includes(search.toLowerCase())
    )
    setMachineDataFilter(filter)
  }, [machineData, search])

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
            {search.length > 0 && (
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

      <div className='dataTableWrapper mt-3 bg-base-100 p-3 rounded-selector'>
        <DataTable
          responsive
          fixedHeader
          pagination
          columns={columns}
          data={machineDataFilter}
          paginationPerPage={30}
          progressPending={isloading}
          progressComponent={
            <span className='loading loading-spinner loading-md'></span>
          }
          noDataComponent={<span>Empty</span>}
          paginationRowsPerPageOptions={[30, 75, 100]}
          className='md:!max-h-[calc(100dvh-530px)]'
        />
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
