import { useEffect, useMemo, useRef, useState } from 'react'
import { Inventories } from '../../types/inventory.type'
import axiosInstance from '../../constants/axios/axiosInstance'
import { AxiosError } from 'axios'
import { ApiResponse } from '../../types/api.response.type'
import DataTable, { TableColumn } from 'react-data-table-component'
import { useTranslation } from 'react-i18next'
import {
  BiCheck,
  BiChevronLeft,
  BiChevronRight,
  BiError,
  BiErrorCircle,
  BiInfoCircle,
  BiSearch,
  BiX
} from 'react-icons/bi'
import { GiMedicines } from 'react-icons/gi'
import { showToast } from '../../constants/utils/toast'
import { IoBackspaceOutline } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import Empty from '../../components/empty/empty'

const Stock = () => {
  const { t } = useTranslation()
  const { machineId } = useSelector((state: RootState) => state.utils)
  const [inventoriesData, setInventoriesData] = useState<Inventories[]>([])
  const [inventoriesFilterData, setInventoriesFilterData] = useState<
    Inventories[]
  >([])
  const [isloading, setIsLoading] = useState(false)
  const [isloadingFetch, setIsLoadingFetch] = useState(false)
  const [search, setSearch] = useState('')
  const refillModal = useRef<HTMLDialogElement>(null)
  const [selectedItem, setSelectedItem] = useState<Inventories | null>(null)
  const [refill, setRefill] = useState({
    id: '',
    quantity: '0'
  })
  const [buttonStatus, setButtonStatus] = useState(false)

  const fetchInventories = async (loadState: boolean = true) => {
    if (loadState) setIsLoadingFetch(true)
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
      if (loadState) setIsLoadingFetch(false)
    }
  }

  const handleUpdateStock = async () => {
    if (refill.quantity !== '0') {
      setIsLoading(true)
      try {
        await axiosInstance.patch<ApiResponse<Inventories>>(
          `/inventories/${refill.id}`,
          {
            quantity: Number(refill.quantity)
          }
        )
      } catch (error) {
        if (error instanceof AxiosError) {
          refillModal.current?.close()
          await showToast({
            type: 'error',
            icon: BiError,
            message: error.response?.data.message ?? t('somethingWentWrong'),
            duration: 3000,
            showClose: false
          }).finally(() => refillModal.current?.showModal())
        } else {
          console.error(error)
        }
      } finally {
        await fetchInventories(false)
        setIsLoading(false)
        setButtonStatus(true)
        toggle()
      }
    } else {
      refillModal.current?.close()
      await showToast({
        type: 'warning',
        icon: BiErrorCircle,
        message: t('pleaseCompleteField'),
        duration: 3000,
        showClose: true
      }).finally(() => refillModal.current?.showModal())
    }
  }

  const handleConfirm = async () => {
    setIsLoadingFetch(true)
    try {
      const result = await axiosInstance.post<ApiResponse<any>>(`/plc/sendM`, {
        floor: selectedItem?.floor,
        position: selectedItem?.position,
        qty: Number(refill.quantity),
        machineId: machineId,
        command: 'M32'
      })
      setButtonStatus(false)
      refillModal.current?.close()
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
        refillModal.current?.close()
        await showToast({
          type: 'error',
          icon: BiError,
          message: error.response?.data.message ?? t('somethingWentWrong'),
          duration: 3000,
          showClose: false
        }).finally(() => refillModal.current?.showModal())
      } else {
        console.error(error)
      }
    } finally {
      await fetchInventories(true)
      setIsLoadingFetch(false)
    }
  }

  const openRefillStock = (stock: Inventories) => {
    refillModal.current?.showModal()
    setRefill({
      id: stock.id,
      quantity: String(stock.quantity)
    })
    setSelectedItem(stock)
  }

  const resetForm = async () => {
    setButtonStatus(false)
    setRefill({
      id: '',
      quantity: '0'
    })
  }

  const handleNumpadClick = (num: number) => {
    if (!selectedItem) return
    const newValueString =
      refill.quantity === '0' ? String(num) : refill.quantity + num
    if (Number(newValueString) > selectedItem.max) {
      setRefill({ ...refill, quantity: String(selectedItem.max) })
      return
    }
    setRefill({ ...refill, quantity: newValueString })
  }

  const handleBackspace = () => {
    if (refill.quantity.length > 1) {
      setRefill({ ...refill, quantity: String(refill.quantity.slice(0, -1)) })
    } else {
      setRefill({ ...refill, quantity: '0' })
    }
  }

  const handleMaxClick = () => {
    if (selectedItem) {
      setRefill({ ...refill, quantity: String(selectedItem.max) })
    }
  }

  useEffect(() => {
    fetchInventories()
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
        name: t('quantity'),
        selector: item => item.quantity,
        sortable: false,
        center: true
      },
      {
        name: `${t('min')} / ${t('max')}`,
        selector: item => `${item.min} / ${item.max}`,
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
              className='btn btn-primary p-2.5 rounded-3xl'
              onClick={() => openRefillStock(item)}
            >
              <GiMedicines size={24} />
              <span>{t('itemRefill')}</span>
            </button>
          </div>
        ),
        sortable: false,
        center: true
      }
    ],
    [t, search]
  )

  const [direction, setDirection] = useState<'row' | 'row-reverse'>('row')
  const [animating, setAnimating] = useState(false)

  const toggle = () => {
    setAnimating(true)
    setTimeout(() => {
      setDirection(buttonStatus ? 'row' : 'row-reverse')
      setButtonStatus(!buttonStatus)
      setAnimating(false)
    }, 300)
  }

  return (
    <div>
      <div className='flex items-center justify-between'>
        <span className='text-2xl font-medium'>{t('itemRefill')}</span>
        <div className='flex items-center gap-3'>
          <label className='input h-15 rounded-3xl'>
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
          progressPending={isloadingFetch}
          progressComponent={
            <span className='loading loading-spinner text-base-content loading-md'></span>
          }
          noDataComponent={<Empty />}
          paginationRowsPerPageOptions={[30, 75, 100]}
        />
      </div>

      <dialog ref={refillModal} className='modal'>
        <div className='modal-box p-[24px] rounded-[48px]'>
          <div
            className={`flex items-center gap-3 transition-[flex-direction] duration-300 ease-out ${
              direction === 'row-reverse'
                ? 'flex-row-reverse justify-end'
                : 'flex-row justify-start'
            }`}
          >
            <h3
              className={`font-bold text-lg transition-all duration-300 ease-out ${
                !animating && direction === 'row'
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-90'
              }`}
            >
              {t('refillStock')}
            </h3>

            <span
              className={`badge bg-warning/50 p-3 font-medium transition-all duration-300 ease-out ${
                !animating && direction === 'row-reverse'
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-90'
              }`}
            >
              <BiInfoCircle size={18} /> {t('confirmDescription')}
            </span>
          </div>

          <div
            className={`flex items-center justify-between w-full px-4 mt-5 duration-300 ease-out transition-[opacity] ${
              buttonStatus ? 'cursor-not-allowed opacity-70' : 'opacity-100'
            }`}
          >
            <button
              disabled={buttonStatus}
              className='btn btn-ghost btn-circle disabled:opacity-100'
              onClick={() => {
                if (Number(refill.quantity) > Number(selectedItem?.min)) {
                  setRefill({
                    ...refill,
                    quantity: String(Number(refill.quantity) - 1)
                  })
                }
              }}
            >
              <BiChevronLeft size={32} className='text-base-content/30' />
            </button>
            <span className='text-6xl font-bold text-primary'>
              {refill.quantity}
            </span>
            <button
              disabled={buttonStatus}
              className='btn btn-ghost btn-circle disabled:opacity-100'
              onClick={() => {
                if (Number(refill.quantity) < Number(selectedItem?.max)) {
                  setRefill({
                    ...refill,
                    quantity: String(Number(refill.quantity) + 1)
                  })
                }
              }}
            >
              <BiChevronRight size={32} className='text-base-content/30' />
            </button>
          </div>

          <div
            className={`grid grid-cols-3 gap-4 w-full mt-4 duration-300 ease-out transition-[opacity] ${
              buttonStatus ? 'cursor-not-allowed opacity-70' : 'opacity-100'
            }`}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                disabled={buttonStatus}
                onClick={() => handleNumpadClick(num)}
                className='btn btn-ghost text-3xl h-20 rounded-3xl disabled:opacity-100'
              >
                {num}
              </button>
            ))}
            <button
              disabled={buttonStatus}
              onClick={handleBackspace}
              className='btn btn-ghost h-20 rounded-3xl disabled:opacity-100'
            >
              <IoBackspaceOutline size={32} className='text-error' />
            </button>
            <button
              disabled={buttonStatus}
              onClick={() => handleNumpadClick(0)}
              className='btn btn-ghost text-3xl h-20 rounded-3xl disabled:opacity-100'
            >
              0
            </button>
            <button
              disabled={buttonStatus}
              onClick={handleMaxClick}
              className='btn btn-ghost text-xl font-bold text-primary h-20 rounded-3xl disabled:opacity-100'
            >
              MAX
            </button>
          </div>

          <div className='modal-action'>
            <button
              type={`${!buttonStatus ? 'submit' : 'button'}`}
              className='btn text-base font-medium h-15 flex-1 rounded-3xl'
              onClick={async () => {
                if (!buttonStatus) {
                  refillModal.current?.close()
                  await resetForm()
                } else {
                  setButtonStatus(false)
                  toggle()
                }
              }}
              disabled={isloading}
            >
              {`${!buttonStatus ? t('closeButton') : t('back')}`}
            </button>
            <button
              type='button'
              className={`btn ${
                !buttonStatus ? 'btn-primary flex-1' : 'btn-info flex-2'
              } duration-300 ease-out transition-[flex] text-base font-bold h-15 rounded-3xl`}
              onClick={!buttonStatus ? handleUpdateStock : handleConfirm}
              disabled={isloading}
            >
              {isloading ? (
                <span className='loading loading-spinner text-base-content loading-md'></span>
              ) : !buttonStatus ? (
                t('update')
              ) : (
                t('confirmButton')
              )}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default Stock
