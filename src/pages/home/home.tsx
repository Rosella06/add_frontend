import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import axiosInstance from '../../constants/axios/axiosInstance'
import { ApiResponse } from '../../types/api.response.type'
import {
  DispensePrescription,
  OrderStatus
} from '../../types/dispense.order.type'
import { BiSolidDownArrow } from 'react-icons/bi'
import MarqueeText from '../../components/text/MarqueeText'

const Home = () => {
  const { socketId, socketData } = useSelector(
    (state: RootState) => state.utils
  )
  const [dispenseOrder, setDispenseOrder] =
    useState<DispensePrescription | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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

      const orderData = result.data.data.orders
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
    } catch (error) {
      if (error instanceof AxiosError) {
      }
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [socketData])

  return (
    <div className='flex flex-col gap-3'>
      {isLoading ? (
        <span className='loading loading-spinner loading-md'></span>
      ) : (
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-1.5'>
            <span>PrescriptionNo: {dispenseOrder?.prescriptionNo}</span>
            <span>Name: {dispenseOrder?.patientName}</span>
            <span>an: {dispenseOrder?.an}</span>
          </div>
          <div className='divider'></div>
          <div className='grid grid-cols-2 gap-3'>
            {dispenseOrder?.orders.map(item => (
              <div
                key={item.id}
                className='card rounded-3xl bg-base-100 shadow-md'
              >
                <div className='flex flex-row items-center gap-2 card-body'>
                  {item.drug.drugImage ? (
                    <div className='avatar'>
                      <div className='w-16 rounded'>
                        <img
                          src={
                            import.meta.env.VITE_APP_IMG + item.drug.drugImage
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <BiSolidDownArrow
                      size={48}
                      className='text-center text-primary'
                    />
                  )}

                  <div className='flex-1 flex flex-col gap-2 min-w-0'>
                    <MarqueeText speed={100} className='text-lg font-medium'>
                      {item.drug.drugName}
                    </MarqueeText>
                    <div className='flex items-center gap-2'>
                      <span className='badge text-base badge-info px-2 py-4'>
                        จำนวน: {item.quantity}
                      </span>
                      <span className='badge text-base badge-info px-2 py-4'>
                        ชั้น: {item.floor}
                      </span>
                      <span className='badge text-base badge-info px-2 py-4'>
                        ช่อง: {item.position}
                      </span>
                    </div>
                    <span
                      className={`px-2 badge text-base py-4 font-medium ${
                        item.status === OrderStatus.READY
                          ? 'bg-[#D4D4D4]'
                          : OrderStatus.PENDING
                          ? 'bg-[#FFC736]'
                          : OrderStatus.DISPENSED
                          ? 'bg-[#74D461]'
                          : OrderStatus.PICKUP
                          ? 'bg-[#617ED4]'
                          : 'bg-[#D46161]'
                      }`}
                    >
                      {item.status === OrderStatus.READY
                        ? 'รอจัด'
                        : OrderStatus.PENDING
                        ? 'กำลังจัด'
                        : OrderStatus.DISPENSED
                        ? 'จัดเสร็จแล้ว'
                        : OrderStatus.PICKUP
                        ? 'รอหยิบออก'
                        : 'ผิดพลาด'}
                        {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
