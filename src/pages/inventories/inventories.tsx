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
import ConfirmModal, {
  ConfirmModalRef
} from '../../components/modal/ConfirmModal'
import DataTable, { TableColumn } from 'react-data-table-component'
import { Inventories } from '../../types/inventory.type'
import { Machines } from '../../types/machine.type'
import { Drug } from '../../types/drug.type'
import { AxiosError } from 'axios'
import axiosInstance from '../../constants/axios/axiosInstance'
import { ApiResponse } from '../../types/api.response.type'
import { mapDefaultValue, mapOptions } from '../../constants/utils/reacr.select'
import Select from 'react-select'
import { showToast } from '../../constants/utils/toast'
import { format } from 'date-fns'

interface DrugSelect {
  id: string
  drugName: string
}

interface MachineSelect {
  id: string
  machineName: string
}

const Inventory = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const addModal = useRef<HTMLDialogElement>(null)
  const editModal = useRef<HTMLDialogElement>(null)
  const confirmModalRef = useRef<ConfirmModalRef>(null)
  const [inventoriesData, setInventoriesData] = useState<Inventories[]>([])
  const [inventoriesFilterData, setInventoriesFilterData] = useState<
    Inventories[]
  >([])
  const [machinesData, setMachinesData] = useState<Machines[]>([])
  const [drugData, setDrugData] = useState<Drug[]>([])
  const [isloading, setIsLoading] = useState({
    inventory: false,
    machine: false,
    drug: false
  })

  const [inventoriesForm, setInventoriesForm] = useState({
    id: '',
    floor: 0,
    position: 0,
    min: 0,
    max: 0,
    expiryDate: '',
    drugId: '',
    machineId: ''
  })

  const fetchInventories = async () => {
    setIsLoading({ ...isloading, inventory: true })
    try {
      const result = await axiosInstance.get<ApiResponse<Inventories[]>>(
        '/inventories'
      )
      setInventoriesData(result.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    } finally {
      setIsLoading({ ...isloading, inventory: false })
    }
  }

  const fetchMachines = async () => {
    setIsLoading({ ...isloading, machine: true })
    try {
      const result = await axiosInstance.get<ApiResponse<Machines[]>>(
        '/machines'
      )
      setMachinesData(result.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    } finally {
      setIsLoading({ ...isloading, machine: false })
    }
  }

  const fetchDrug = async () => {
    setIsLoading({ ...isloading, drug: true })
    try {
      const result = await axiosInstance.get<ApiResponse<Drug[]>>('/drugs')
      setDrugData(result.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    } finally {
      setIsLoading({ ...isloading, drug: true })
    }
  }

  const handleSubmit = async () => {
    if (
      inventoriesForm.floor !== 0 &&
      inventoriesForm.position !== 0 &&
      inventoriesForm.min !== 0 &&
      inventoriesForm.max !== 0 &&
      inventoriesForm.expiryDate !== '' &&
      inventoriesForm.drugId !== '' &&
      inventoriesForm.machineId !== ''
    ) {
      setIsLoading({ ...isloading, inventory: true })
      try {
        const result = await axiosInstance.post<ApiResponse<Inventories>>(
          `/inventories`,
          {
            floor: inventoriesForm.floor,
            position: inventoriesForm.position,
            min: inventoriesForm.min,
            max: inventoriesForm.max,
            expiryDate: inventoriesForm.expiryDate,
            drugId: inventoriesForm.drugId,
            machineId: inventoriesForm.machineId
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
        await fetchInventories()
        setIsLoading({ ...isloading, inventory: false })
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
    if (
      inventoriesForm.floor !== 0 &&
      inventoriesForm.position !== 0 &&
      inventoriesForm.min !== 0 &&
      inventoriesForm.max !== 0 &&
      inventoriesForm.expiryDate !== '' &&
      inventoriesForm.drugId !== '' &&
      inventoriesForm.machineId !== ''
    ) {
      setIsLoading({ ...isloading, inventory: true })
      try {
        const result = await axiosInstance.patch<ApiResponse<Inventories>>(
          `/inventories/${inventoriesForm.id}`,
          {
            floor: inventoriesForm.floor,
            position: inventoriesForm.position,
            min: inventoriesForm.min,
            max: inventoriesForm.max,
            expiryDate: inventoriesForm.expiryDate,
            drugId: inventoriesForm.drugId,
            machineId: inventoriesForm.machineId
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
        await fetchInventories()
        setIsLoading({ ...isloading, inventory: false })
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

  const deleteInventory = async (inventoryId: string) => {
    setIsLoading({ ...isloading, inventory: true })
    try {
      const result = await axiosInstance.delete<ApiResponse<string>>(
        `/inventories/${inventoryId}`
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
      await fetchInventories()
      setIsLoading({ ...isloading, inventory: false })
    }
  }

  const openEdit = (inventory: Inventories) => {
    setInventoriesForm({
      id: inventory.id,
      floor: inventory.floor,
      position: inventory.position,
      min: inventory.min,
      max: inventory.max,
      expiryDate: format(new Date(inventory.expiryDate), 'yyyy-MM-dd'),
      drugId: inventory.drugId,
      machineId: inventory.machineId
    })
    editModal.current?.showModal()
  }

  const resetForm = () => {
    setInventoriesForm({
      id: '',
      floor: 0,
      position: 0,
      min: 0,
      max: 0,
      expiryDate: '',
      drugId: '',
      machineId: ''
    })
  }

  const columns: TableColumn<Inventories>[] = useMemo(
    () => [
      {
        name: t('image'),
        cell: item => (
          <div className='avatar'>
            <div className='w-10 rounded'>
              <img src={import.meta.env.VITE_APP_IMG + item.drug.drugImage} />
            </div>
          </div>
        ),
        sortable: false,
        center: true
      },
      {
        name: t('drugName'),
        cell: item => (
          <div className='tooltip' data-tip={item.drug.drugName}>
            <span className='truncate w-[128px] block text-center'>
              {item.drug.drugName}
            </span>
          </div>
        ),
        sortable: false,
        center: true
      },
      {
        name: t('floor'),
        selector: item => item.floor,
        sortable: false,
        center: true
      },
      {
        name: t('position'),
        selector: item => item.position,
        sortable: false,
        center: true
      },
      {
        name: t('min'),
        selector: item => item.min,
        sortable: false,
        center: true
      },
      {
        name: t('max'),
        selector: item => item.max,
        sortable: false,
        center: true
      },
      {
        name: t('machineName'),
        cell: item => (
          <div className='tooltip' data-tip={item.machine.machineName}>
            <span className='truncate w-[128px] block text-center'>
              {item.machine.machineName}
            </span>
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
              className='btn btn-primary p-2.5'
              onClick={() => openEdit(item)}
            >
              <BiEdit size={24} />
            </button>
            <button
              className='btn btn-error p-2.5'
              onClick={async () => {
                const confirmed = await confirmModalRef.current?.show({
                  title: t('deleteTitle'),
                  description: t('deleteDescription'),
                  type: 'warning'
                })

                if (confirmed) {
                  await deleteInventory(item.id)
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
    [t, search]
  )

  useEffect(() => {
    fetchInventories()
    fetchMachines()
    fetchDrug()
  }, [])

  useEffect(() => {
    const filter = inventoriesData.filter(
      f =>
        f.floor.toString().toLowerCase().includes(search.toLowerCase()) ||
        f.position.toString().toLowerCase().includes(search.toLowerCase()) ||
        f.drug.drugName.toLowerCase().includes(search.toLowerCase()) ||
        f.machine.machineName.toLowerCase().includes(search.toLowerCase())
    )
    setInventoriesFilterData(filter)
  }, [inventoriesData, search])

  return (
    <div>
      <div className='flex items-center justify-between'>
        <span className='text-2xl font-medium'>{t('itemInventory')}</span>
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
          data={inventoriesFilterData}
          paginationPerPage={30}
          progressPending={isloading.inventory}
          progressComponent={
            <span className='loading loading-spinner loading-md'></span>
          }
          noDataComponent={<span>Empty</span>}
          paginationRowsPerPageOptions={[30, 75, 100]}
          className='md:!max-h-[calc(100dvh-530px)]'
        />
      </div>

      <dialog ref={addModal} className='modal overflow-y-scroll py-10'>
        <div className='modal-box p-[24px] rounded-[48px] h-max max-h-max'>
          <h3 className='font-bold text-lg'>{t('addInventory')}</h3>
          <div className='w-full'>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('floor')}
              </legend>
              <input
                type='number'
                min={0}
                max={12}
                className='input w-full h-12 rounded-3xl'
                value={inventoriesForm.floor}
                onChange={e =>
                  setInventoriesForm({
                    ...inventoriesForm,
                    floor: Number(e.target.value)
                  })
                }
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('position')}
              </legend>
              <input
                type='number'
                min={0}
                max={128}
                className='input w-full h-12 flex-1 rounded-3xl'
                value={inventoriesForm.position}
                onChange={e =>
                  setInventoriesForm({
                    ...inventoriesForm,
                    position: Number(e.target.value)
                  })
                }
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('min')}
              </legend>
              <input
                type='number'
                min={0}
                max={20}
                className='input w-full h-12 flex-1 rounded-3xl'
                value={inventoriesForm.min}
                onChange={e =>
                  setInventoriesForm({
                    ...inventoriesForm,
                    min: Number(e.target.value)
                  })
                }
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('max')}
              </legend>
              <input
                type='number'
                min={0}
                max={20}
                className='input w-full h-12 flex-1 rounded-3xl'
                value={inventoriesForm.max}
                onChange={e =>
                  setInventoriesForm({
                    ...inventoriesForm,
                    max: Number(e.target.value)
                  })
                }
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('expiryDate')}
              </legend>
              <input
                type='date'
                min={0}
                max={20}
                className='input w-full h-12 flex-1 rounded-3xl'
                value={inventoriesForm.expiryDate}
                onChange={e =>
                  setInventoriesForm({
                    ...inventoriesForm,
                    expiryDate: e.target.value
                  })
                }
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('drugSelect')}
              </legend>
              <Select
                key={inventoriesForm.drugId}
                options={mapOptions<DrugSelect, keyof DrugSelect>(
                  drugData,
                  'id',
                  'drugName'
                )}
                value={mapDefaultValue<DrugSelect, keyof DrugSelect>(
                  drugData,
                  inventoriesForm.drugId ?? '',
                  'id',
                  'drugName'
                )}
                onChange={e =>
                  setInventoriesForm({
                    ...inventoriesForm,
                    drugId: String(e?.value)
                  })
                }
                menuPlacement='top'
                autoFocus={false}
                className='custom-react-select z-20'
                classNamePrefix='react-select'
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('machineSelect')}
              </legend>
              <Select
                key={inventoriesForm.machineId}
                options={mapOptions<MachineSelect, keyof MachineSelect>(
                  machinesData,
                  'id',
                  'machineName'
                )}
                value={mapDefaultValue<MachineSelect, keyof MachineSelect>(
                  machinesData,
                  inventoriesForm.machineId ?? '',
                  'id',
                  'machineName'
                )}
                onChange={e =>
                  setInventoriesForm({
                    ...inventoriesForm,
                    machineId: String(e?.value)
                  })
                }
                menuPlacement='top'
                autoFocus={false}
                className='custom-react-select z-20'
                classNamePrefix='react-select'
              />
            </fieldset>
          </div>
          <div className='modal-action'>
            <form method='dialog' className='flex items-center gap-3 w-full'>
              <button
                className='btn text-base font-medium h-12 rounded-3xl flex-1'
                onClick={() => resetForm()}
                disabled={isloading.inventory}
              >
                {t('closeButton')}
              </button>
              <button
                type='button'
                className='btn btn-primary text-base font-bold h-12 rounded-3xl flex-1'
                onClick={handleSubmit}
                disabled={isloading.inventory}
              >
                {isloading.inventory ? (
                  <span className='loading loading-spinner loading-md'></span>
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
          <h3 className='font-bold text-lg'>{t('editInventory')}</h3>
          <div className='w-full'>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('floor')}
              </legend>
              <input
                type='number'
                min={0}
                max={12}
                className='input w-full h-12 rounded-3xl'
                value={inventoriesForm.floor}
                onChange={e =>
                  setInventoriesForm({
                    ...inventoriesForm,
                    floor: Number(e.target.value)
                  })
                }
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('position')}
              </legend>
              <input
                type='number'
                min={0}
                max={128}
                className='input w-full h-12 flex-1 rounded-3xl'
                value={inventoriesForm.position}
                onChange={e =>
                  setInventoriesForm({
                    ...inventoriesForm,
                    position: Number(e.target.value)
                  })
                }
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('min')}
              </legend>
              <input
                type='number'
                min={0}
                max={20}
                className='input w-full h-12 flex-1 rounded-3xl'
                value={inventoriesForm.min}
                onChange={e =>
                  setInventoriesForm({
                    ...inventoriesForm,
                    min: Number(e.target.value)
                  })
                }
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('max')}
              </legend>
              <input
                type='number'
                min={0}
                max={20}
                className='input w-full h-12 flex-1 rounded-3xl'
                value={inventoriesForm.max}
                onChange={e =>
                  setInventoriesForm({
                    ...inventoriesForm,
                    max: Number(e.target.value)
                  })
                }
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('expiryDate')}
              </legend>
              <input
                type='date'
                min={0}
                max={20}
                className='input w-full h-12 flex-1 rounded-3xl'
                value={inventoriesForm.expiryDate}
                onChange={e =>
                  setInventoriesForm({
                    ...inventoriesForm,
                    expiryDate: e.target.value
                  })
                }
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('drugSelect')}
              </legend>
              <Select
                key={inventoriesForm.drugId}
                options={mapOptions<DrugSelect, keyof DrugSelect>(
                  drugData,
                  'id',
                  'drugName'
                )}
                value={mapDefaultValue<DrugSelect, keyof DrugSelect>(
                  drugData,
                  inventoriesForm.drugId ?? '',
                  'id',
                  'drugName'
                )}
                onChange={e =>
                  setInventoriesForm({
                    ...inventoriesForm,
                    drugId: String(e?.value)
                  })
                }
                menuPlacement='top'
                autoFocus={false}
                className='custom-react-select z-20'
                classNamePrefix='react-select'
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('machineSelect')}
              </legend>
              <Select
                key={inventoriesForm.machineId}
                options={mapOptions<MachineSelect, keyof MachineSelect>(
                  machinesData,
                  'id',
                  'machineName'
                )}
                value={mapDefaultValue<MachineSelect, keyof MachineSelect>(
                  machinesData,
                  inventoriesForm.machineId ?? '',
                  'id',
                  'machineName'
                )}
                onChange={e =>
                  setInventoriesForm({
                    ...inventoriesForm,
                    machineId: String(e?.value)
                  })
                }
                menuPlacement='top'
                autoFocus={false}
                className='custom-react-select z-20'
                classNamePrefix='react-select'
              />
            </fieldset>
          </div>
          <div className='modal-action'>
            <form method='dialog' className='flex items-center gap-3 w-full'>
              <button
                className='btn text-base font-medium h-12 flex-1'
                onClick={() => resetForm()}
                disabled={isloading.inventory}
              >
                {t('closeButton')}
              </button>
              <button
                type='button'
                className='btn btn-primary text-base font-bold h-12 flex-1'
                onClick={handleUpdate}
                disabled={isloading.inventory}
              >
                {isloading.inventory ? (
                  <span className='loading loading-spinner loading-md'></span>
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

export default Inventory
