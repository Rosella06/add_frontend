import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AxiosError } from 'axios'
import axiosInstance from '../../constants/axios/axiosInstance'
import { ApiResponse } from '../../types/api.response.type'
import {
  DispensePrescription,
  OrderStatus
} from '../../types/dispense.order.type'
import OrderItem from '../../components/pages/home/orderItem'
import { BiCheck, BiError, BiErrorCircle, BiReset } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { showToast } from '../../constants/utils/toast'
import Scanner from '../../assets/images/barcode_banner.png'

const Home = () => {
  const { t } = useTranslation()
  const { socketId, machine, socketData } = useSelector(
    (state: RootState) => state.utils
  )
  const [dispenseOrder, setDispenseOrder] =
    useState<DispensePrescription | null>(null)
  const didAnimate = useRef(false)
  const canExecuteRef = useRef(true)
  const [isLoading, setIsLoading] = useState(false)
  const [qrCodeText, setQrText] = useState('')
  let textScanner = ''

  const fetchOrder = async () => {
    setIsLoading(true)

    try {
      const result = await axiosInstance.get<ApiResponse<DispensePrescription>>(
        '/orders'
      )
      const prescriptionData = result.data.data

      const statusOrderPriority: Record<OrderStatus, number> = {
        [OrderStatus.PICKUP]: 1,
        [OrderStatus.DISPENSED]: 2,
        [OrderStatus.PENDING]: 3,
        [OrderStatus.READY]: 4,
        [OrderStatus.ERROR]: 5,
        [OrderStatus.COMPLETE]: 999
      }

      const orderResponse = result.data.data.orders

      if (orderResponse.length > 0) {
        const orderData = orderResponse
          .filter(order => order.status !== OrderStatus.COMPLETE)
          .sort((a, b) => {
            const priorityA = statusOrderPriority[a.status] || 999
            const priorityB = statusOrderPriority[b.status] || 999

            return priorityA - priorityB
          })

        const mergePrescription = {
          ...prescriptionData,
          orders: orderData
        }

        setDispenseOrder(mergePrescription)
      } else if (prescriptionData.orders.every((e) => e.status === "complete")) {
        setDispenseOrder(null)
      }
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
      setIsLoading(false)
    }
  }

  const dispense = useCallback(async (qrCodeText: string) => {
    if (machine === undefined) {
      await showToast({
        type: 'warning',
        icon: BiErrorCircle,
        message: t('pleaseSelectMachine'),
        duration: 3000,
        showClose: false
      })

      return
    }

    setIsLoading(true)

    try {
      const result = await axiosInstance.post<
        ApiResponse<DispensePrescription>
      >(`/orders/dispense/${qrCodeText}`, {
        machineId: machine.id,
        socketId
      })
      const prescriptionData = result.data.data

      const statusOrderPriority: Record<OrderStatus, number> = {
        [OrderStatus.PICKUP]: 1,
        [OrderStatus.DISPENSED]: 2,
        [OrderStatus.PENDING]: 3,
        [OrderStatus.READY]: 4,
        [OrderStatus.ERROR]: 5,
        [OrderStatus.COMPLETE]: 999
      }

      const orderData = result.data.data.orders.sort((a, b) => {
        const priorityA = statusOrderPriority[a.status] || 999
        const priorityB = statusOrderPriority[b.status] || 999

        return priorityA - priorityB
      })

      const mergePrescription = {
        ...prescriptionData,
        orders: orderData
      }

      setDispenseOrder(mergePrescription)
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
      setIsLoading(false)
    }
  }, [])

  const pickup = useCallback(async (qrCodeText: string) => {
    const presciptionNo = qrCodeText.split('|')[0]
    const drugCode = qrCodeText.split('|')[1]

    try {
      await axiosInstance.post<ApiResponse<DispensePrescription>>(
        `/orders/pickup/${presciptionNo}/${drugCode}`,
        {
          socketId
        }
      )
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
    }
  }, [])

  const resetPrescription = async () => {
    if (machine === undefined) {
      await showToast({
        type: 'warning',
        icon: BiErrorCircle,
        message: t('pleaseSelectMachine'),
        duration: 3000,
        showClose: false
      })

      return
    }

    try {
      const result = await axiosInstance.post<ApiResponse<string>>(
        `/orders/order`,
        {
          machineId: machine.id,
          socketId
        }
      )
      showToast({
        type: 'success',
        icon: BiCheck,
        message: result.data.data,
        duration: 3000,
        showClose: false
      })
      setDispenseOrder(null)
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
    }
  }

  const onBarcodeScan = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      setQrText(textScanner)
      textScanner = ''
    } else {
      textScanner += e.key
    }
  }

  useEffect(() => {
    if (qrCodeText === '') {
      return
    }

    if (canExecuteRef.current) {
      if (qrCodeText.length === 1 && dispenseOrder === null) {
        dispense(qrCodeText)
      } else {
        pickup(qrCodeText)
      }

      canExecuteRef.current = false

      setTimeout(() => {
        canExecuteRef.current = true
      }, 700)
    }

    setQrText('')
  }, [qrCodeText, dispenseOrder, dispense, pickup, setQrText])

  useEffect(() => {
    fetchOrder()
  }, [socketData])

  useEffect(() => {
    document.addEventListener('keypress', onBarcodeScan)

    return () => {
      document.removeEventListener('keypress', onBarcodeScan)
    }
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    if (dispenseOrder) {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [dispenseOrder])

  useEffect(() => {
    didAnimate.current = true
  }, [])

  const OrderItemAnimate = useMemo(
    () =>
      function WrappedOrderItem () {
        return (
          <OrderItem prescriptionData={dispenseOrder} didAnimate={didAnimate} />
        )
      },
    [dispenseOrder?.orders]
  )

  return (
    <div className='flex flex-col gap-3 flex-1 p-4 sm:p-6 lg:p-8'>
      {isLoading ? (
        <div className='flex flex-1 items-center justify-center'>
          <span className='loading loading-spinner text-base-content loading-md'></span>
        </div>
      ) : dispenseOrder === null ? (
        <div className='flex flex-1 items-center justify-center'>
          <div className='flex flex-col items-center gap-3'>
            {/* <BiSolidDownArrow size={72} className='text-primary' /> */}
            <div className='avatar'>
              <div className='w-128 rounded'>
                <img src={Scanner} />
              </div>
            </div>
            <span className='text-xl font-medium'>{t('pleaseScan')}</span>
          </div>
        </div>
      ) : (
        <OrderItemAnimate />
      )}

      <div className='flex flex-col gap-3 items-center fixed bottom-5 right-5 z-20'>
        <button
          className='btn btn-error rounded-3xl px-3 py-3 h-17 w-17'
          onClick={resetPrescription}
        >
          <BiReset size={36} />
        </button>
        <span className='badge badge-accent py-3 px-3 text-base font-medium text-shadow-lg'>
          {t('reset')}
        </span>
      </div>
    </div>
  )
}

export default Home
