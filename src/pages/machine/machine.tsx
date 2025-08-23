import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BiCheck,
  BiEdit,
  BiError,
  BiErrorCircle,
  BiPlus,
  BiSearch,
  BiTrashAlt,
  BiX
} from 'react-icons/bi'
import { showToast } from '../../constants/utils/toast'
import { AxiosError } from 'axios'
import { ApiResponse } from '../../types/api.response.type'
import { Machines } from '../../types/machine.type'
import DataTable, { TableColumn } from 'react-data-table-component'
import axiosInstance from '../../constants/axios/axiosInstance'
import ConfirmModal, {
  ConfirmModalRef
} from '../../components/modal/ConfirmModal'
import Empty from '../../components/empty/empty'

const Machine = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [machineData, setMachineData] = useState<Machines[]>([])
  const [machineDataFilter, setMachineDataFilter] = useState<Machines[]>([])
  const [machineForm, setMachineForm] = useState({
    id: '',
    machineName: '',
    ipAddress: ''
  })
  const [isloading, setIsLoading] = useState(false)
  const addModal = useRef<HTMLDialogElement>(null)
  const editModal = useRef<HTMLDialogElement>(null)
  const confirmModalRef = useRef<ConfirmModalRef>(null)

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
          {
            machineName: machineForm.machineName,
            ipAddress: machineForm.ipAddress
          }
        )
        addModal.current?.close()
        resetForm()
        showToast({
          type: 'success',
          icon: BiCheck,
          message: result.data.message,
          duration: 3000,
          showClose: false
        })
      } catch (error) {
        if (error instanceof AxiosError) {
          addModal.current?.close()
          await showToast({
            type: 'error',
            icon: BiError,
            message: error.response?.data.message ?? t('somethingWentWrong'),
            duration: 3000,
            showClose: false
          }).finally(() => addModal.current?.showModal())
        } else {
          console.error(error)
        }
      } finally {
        await fetchMachine()
        setIsLoading(false)
      }
    } else {
      addModal.current?.close()
      await showToast({
        type: 'warning',
        icon: BiErrorCircle,
        message: t('pleaseCompleteField'),
        duration: 3000,
        showClose: true
      }).finally(() => addModal.current?.showModal())
    }
  }

  const handleUpdate = async () => {
    if (machineForm.machineName !== '' && machineForm.ipAddress !== '') {
      setIsLoading(true)
      try {
        const result = await axiosInstance.patch<ApiResponse<string>>(
          `/machines/${machineForm.id}`,
          {
            machineName: machineForm.machineName,
            ipAddress: machineForm.ipAddress
          }
        )
        editModal.current?.close()
        resetForm()
        showToast({
          type: 'success',
          icon: BiCheck,
          message: result.data.message,
          duration: 3000,
          showClose: false
        })
      } catch (error) {
        if (error instanceof AxiosError) {
          editModal.current?.close()
          await showToast({
            type: 'error',
            icon: BiError,
            message: error.response?.data.message ?? t('somethingWentWrong'),
            duration: 3000,
            showClose: false
          }).finally(() => editModal.current?.showModal())
        } else {
          console.error(error)
        }
      } finally {
        await fetchMachine()
        setIsLoading(false)
      }
    } else {
      editModal.current?.close()
      await showToast({
        type: 'warning',
        icon: BiErrorCircle,
        message: t('pleaseCompleteField'),
        duration: 3000,
        showClose: true
      }).finally(() => editModal.current?.showModal())
    }
  }

  const deleteMachine = async (machineId: string) => {
    setIsLoading(true)
    try {
      const result = await axiosInstance.delete<ApiResponse<string>>(
        `/machines/${machineId}`
      )
      showToast({
        type: 'success',
        icon: BiCheck,
        message: result.data.message,
        duration: 3000,
        showClose: false
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        await showToast({
          type: 'error',
          icon: BiError,
          message: error.response?.data.message ?? t('somethingWentWrong'),
          duration: 3000,
          showClose: false
        })
      } else {
        console.error(error)
      }
    } finally {
      await fetchMachine()
      setIsLoading(false)
    }
  }

  const openEdit = (machine: Machines) => {
    setMachineForm({
      id: machine.id,
      machineName: machine.machineName,
      ipAddress: machine.ipAddress
    })
    editModal.current?.showModal()
  }

  const resetForm = () => {
    setMachineForm({ id: '', machineName: '', ipAddress: '' })
  }

  const columns: TableColumn<Machines>[] = useMemo(
    () => [
      {
        name: t('machineName'),
        cell: item => (
          <div className='tooltip' data-tip={item.machineName}>
            <span className='truncate w-[128px] block text-center'>{item.machineName}</span>
          </div>
        ),
        sortable: false,
        center: true
      },
      {
        name: t('machineIpaddress'),
        selector: item => item.ipAddress,
        sortable: false,
        center: true
      },
      {
        name: t('machineStatus'),
        cell: item => (
          <div
            className={`badge ${
              item.status === 'online' ? 'badge-success' : 'badge-error'
            } text-base-100 py-3 px-2`}
          >
            {item.status === 'online' ? t('online') : t('offline')}
          </div>
        ),
        sortable: false,
        center: true
      },
      {
        name: t('action'),
        cell: item => (
          <div className='flex items-center gap-3'>
            <button
              className='btn btn-primary p-2.5 rounded-3xl'
              onClick={() => openEdit(item)}
            >
              <BiEdit size={24} />
            </button>
            <button
              className='btn btn-error p-2.5 rounded-3xl'
              onClick={async () => {
                const confirmed = await confirmModalRef.current?.show({
                  title: t('deleteTitle'),
                  description: t('deleteDescription'),
                  type: 'warning'
                })

                if (confirmed) {
                  await deleteMachine(item.id)
                }
              }}
            >
              <BiTrashAlt size={24} />
            </button>
          </div>
        ),
        sortable: false,
        center: true
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
          <label className='input h-12 rounded-3xl'>
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
              className='btn btn-primary text-base h-12 w-12 p-0 rounded-3xl'
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
            <span className='loading loading-spinner text-base-content loading-md'></span>
          }
          noDataComponent={<Empty />}
          paginationRowsPerPageOptions={[30, 75, 100]}
        />
      </div>

      <dialog ref={addModal} className='modal'>
        <div className='modal-box p-[24px] rounded-[48px]'>
          <h3 className='font-bold text-lg'>{t('addMachine')}</h3>
          <div className='w-full'>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('machineName')}
              </legend>
              <input
                type='text'
                className='input w-full h-12 rounded-3xl'
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
                className='input w-full h-12 flex-1 rounded-3xl'
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
            <form method='dialog' className='flex items-center gap-3 w-full'>
              <button
                className='btn text-base font-medium h-12 rounded-3xl flex-1'
                onClick={() => resetForm()}
                disabled={isloading}
              >
                {t('closeButton')}
              </button>
              <button
                type='button'
                className='btn btn-primary text-base font-bold h-12 rounded-3xl flex-1'
                onClick={handleSubmit}
                disabled={isloading}
              >
                {isloading ? (
                  <span className='loading loading-spinner text-base-content loading-md'></span>
                ) : (
                  t('saveButton')
                )}
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog ref={editModal} className='modal'>
        <div className='modal-box p-[24px] rounded-[48px]'>
          <h3 className='font-bold text-lg'>{t('editMachine')}</h3>
          <div className='w-full'>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('machineName')}
              </legend>
              <input
                type='text'
                className='input w-full h-12 rounded-3xl'
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
                className='input w-full h-12 rounded-3xl'
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
            <form method='dialog' className='flex items-center gap-3 w-full'>
              <button
                className='btn text-base font-medium h-12 flex-1 rounded-3xl'
                onClick={() => resetForm()}
                disabled={isloading}
              >
                {t('closeButton')}
              </button>
              <button
                type='button'
                className='btn btn-primary text-base font-bold h-12 flex-1 rounded-3xl'
                onClick={handleUpdate}
                disabled={isloading}
              >
                {isloading ? (
                  <span className='loading loading-spinner text-base-content loading-md'></span>
                ) : (
                  t('editButton')
                )}
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <ConfirmModal ref={confirmModalRef} />
    </div>
  )
}

export default Machine
