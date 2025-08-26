import {
  BiCartDownload,
  BiCheckCircle,
  BiError,
  BiSolidDownArrow
} from 'react-icons/bi'
import {
  DispensePrescription,
  OrderStatus
} from '../../../types/dispense.order.type'
import MarqueeText from '../../textAnimation/MarqueeText'
import { BiTimeFive } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { RefObject } from 'react'

interface OrderItem {
  prescriptionData: DispensePrescription | null,
  didAnimate: RefObject<boolean>
}

const OrderItem = (props: OrderItem) => {
  const { prescriptionData, didAnimate } = props
  const { t } = useTranslation()

  return (
    <div className='flex flex-col gap-3 flex-1'>
      <div className='flex flex-col gap-1.5'>
        <span className='text-base'>
          PrescriptionNo: {prescriptionData?.prescriptionNo}
        </span>
        <span className='text-base'>Name: {prescriptionData?.patientName}</span>
        <span className='text-base'>an: {prescriptionData?.an}</span>
      </div>
      <div className='divider'></div>
      <div className='grid grid-cols-2 gap-3'>
        {prescriptionData?.orders.map((item, index) => (
          <div
            key={item.id}
            className={`card rounded-t-3xl rounded-b-none min-h-36 border-b-[6px] bg-base-100 shadow-md ${
              !didAnimate.current ? 'animate-bounce-in-two' : ''
            } ${
              item.status === OrderStatus.READY
                ? 'border-[#D4D4D4]'
                : item.status === OrderStatus.PENDING
                ? 'border-[#FFC736]'
                : item.status === OrderStatus.DISPENSED
                ? 'border-[#74D461]'
                : item.status === OrderStatus.PICKUP
                ? 'border-[#617ED4]'
                : 'border-[#D46161]'
            }`}
            style={{
              opacity: 0,
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className='flex flex-row items-center gap-7 card-body'>
              {item.drug.drugImage ? (
                <div className='avatar'>
                  <div className='w-16 rounded'>
                    <img
                      src={import.meta.env.VITE_APP_IMG + item.drug.drugImage}
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
                    {t('quantity')}: {item.quantity}
                  </span>
                  <span className='badge text-base badge-info px-2 py-4'>
                    {t('floor')}: {item.floor}
                  </span>
                  <span className='badge text-base badge-info px-2 py-4'>
                    {t('position')}: {item.position}
                  </span>
                </div>
              </div>

              <div>
                <span>
                  {item.status === OrderStatus.READY ? (
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <BiTimeFive size={28} className='text-[#D4D4D4]' />
                      <span className='font-medium text-[#D4D4D4]'>
                        {' '}
                        {t('readyStatus')}
                      </span>
                    </div>
                  ) : item.status === OrderStatus.PENDING ? (
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <span className='loading loading-spinner text-[#FFC736] loading-lg'></span>
                      <span className='font-medium text-[#FFC736]'>
                        {t('pendingStatus')}
                      </span>
                    </div>
                  ) : item.status === OrderStatus.DISPENSED ? (
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <BiCheckCircle size={28} className='text-[#74D461]' />
                      <span className='font-medium text-[#74D461]'>
                        {t('dispensedStatus')}
                      </span>
                    </div>
                  ) : item.status === OrderStatus.PICKUP ? (
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <BiCartDownload size={28} className='text-[#617ED4]' />
                      <span className='font-medium text-[#617ED4]'>
                        {t('pickupStatus')}
                      </span>
                    </div>
                  ) : (
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <BiError size={28} className='text-[#D46161]' />
                      <span className='font-medium text-[#D46161]'>
                        {t('errorStatus')}
                      </span>
                    </div>
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderItem
