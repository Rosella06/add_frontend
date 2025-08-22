import { Drug } from "./drug.type"
import { Machines } from "./machine.type"

type Inventories = {
  id: string
  floor: number
  position: number
  quantity: number
  min: number
  max: number
  status: boolean
  expiryDate: string
  createdAt: string
  updatedAt: string
  drugId: string
  machineId: string
  drug: Drug
  machine: Machines
}

export type { Inventories }
