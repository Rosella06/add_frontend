import { useEffect, useMemo, useRef, useState } from 'react'
import { Inventories } from '../../types/inventory.type'
import axiosInstance from '../../constants/axios/axiosInstance'
import { AxiosError } from 'axios'
import { ApiResponse } from '../../types/api.response.type'
import DataTable, { TableColumn } from 'react-data-table-component'
import { useTranslation } from 'react-i18next'
import { BiCheck, BiError, BiErrorCircle, BiSearch, BiX } from 'react-icons/bi'
import { GiMedicines } from 'react-icons/gi'
import { showToast } from '../../constants/utils/toast'

const Stock = () => {
  const { t } = useTranslation()
  const [inventoriesData, setInventoriesData] = useState<Inventories[]>([])
  const [inventoriesFilterData, setInventoriesFilterData] = useState<
    Inventories[]
  >([])
  const [isloading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const refillModal = useRef<HTMLDialogElement>(null)
  const [refill, setRefill] = useState({
    id: '',
    quantity: 0
  })

  const fetchInventories = async () => {
    setIsLoading(true)
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
      setIsLoading(false)
    }
  }

  const handleUpdateStock = async () => {
    if (refill.quantity !== 0) {
      setIsLoading(true)
      try {
        const result = await axiosInstance.patch<ApiResponse<Inventories>>(
          `/inventories/${refill.id}`,
          {
            quantity: refill.quantity
          }
        )
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
        await fetchInventories()
        setIsLoading(false)
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

  const openRefillStock = (stock: Inventories) => {
    refillModal.current?.showModal()
    setRefill({
      id: stock.id,
      quantity: stock.quantity
    })
  }

  const resetForm = () => {
    setRefill({
      id: '',
      quantity: 0
    })
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
        name: `${t('max')} / ${t('max')}`,
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
      // {
      //   name: t('machineStatus'),
      //   cell: item => (
      //     <div
      //       className={`badge ${
      //         item.machine.status === 'online' ? 'badge-success' : 'badge-error'
      //       } text-base-100 py-3 px-2`}
      //     >
      //       {item.machine.status === 'online' ? t('online') : t('offline')}
      //     </div>
      //   ),
      //   sortable: false,
      //   center: true
      // },
      {
        name: t('action'),
        cell: item => (
          <div className='flex items-center gap-3'>
            <button
              className='btn btn-primary p-2.5'
              onClick={() => openRefillStock(item)}
            >
              <GiMedicines size={24} />
            </button>
          </div>
        ),
        sortable: false,
        center: true
      }
    ],
    [t, search]
  )

  return (
    <div>
      <div className='flex items-center justify-between'>
        <span className='text-2xl font-medium'>{t('itemRefill')}</span>
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
          progressPending={isloading}
          progressComponent={
            <span className='loading loading-spinner loading-md'></span>
          }
          noDataComponent={<span>Empty</span>}
          paginationRowsPerPageOptions={[30, 75, 100]}
          className='md:!max-h-[calc(100dvh-530px)]'
        />
      </div>

      <dialog ref={refillModal} className='modal'>
        <div className='modal-box p-[24px] rounded-[48px]'>
          <h3 className='font-bold text-lg'>{t('refillStock')}</h3>
          <div className='w-full'>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('quantity')}
              </legend>
              <input
                type='number'
                min={0}
                max={128}
                className='input w-full h-12 rounded-3xl'
                value={refill.quantity}
                onChange={e =>
                  setRefill({
                    ...refill,
                    quantity: Number(e.target.value)
                  })
                }
              />
            </fieldset>
          </div>
          <div className='modal-action'>
            <form method='dialog' className='flex items-center gap-3 w-full'>
              <button
                className='btn text-base font-medium h-12 flex-1'
                onClick={() => resetForm()}
                disabled={isloading}
              >
                {t('closeButton')}
              </button>
              <button
                type='button'
                className='btn btn-primary text-base font-bold h-12 flex-1'
                onClick={handleUpdateStock}
                disabled={isloading}
              >
                {isloading ? (
                  <span className='loading loading-spinner loading-md'></span>
                ) : (
                  t('update')
                )}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default Stock
