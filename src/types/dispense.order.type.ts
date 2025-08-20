type DispensePrescription = {
  id: string
  userId: string
  prescriptionNo: string
  prescriptionDate: string
  hn: string
  an: string
  patientName: string
  wardCode: string
  wardDesc: string
  priorityCode: string
  priorityDesc: string
  status: string
  createdAt: string
  updatedAt: string
  orders: DispenseOrder[]
}

type DispenseOrder = {
  id: string
  orderItemName: string
  quantity: number
  unitCode: string
  command?: string
  status: OrderStatus
  floor: number
  position: number
  slot?: string
  prescriptionNo: string
  drugCode: string
  machineId: string
  createdAt: string
  updatedAt: string
  drug: DispenseDrug
}

type DispenseDrug = {
  id: string
  drugCode: string
  drugName: string
  drugStatus: boolean
  drugImage: string
  createdAt: string
  updatedAt: string
}

enum OrderStatus {
  READY = 'ready',
  PENDING = 'pending',
  DISPENSED = 'dispensed',
  PICKUP = 'pickup',
  COMPLETE = 'complete',
  ERROR = 'error'
}

export type { DispensePrescription, DispenseOrder, DispenseDrug }
export { OrderStatus }
