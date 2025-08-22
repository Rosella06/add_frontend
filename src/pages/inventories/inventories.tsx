import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiPlus, BiSearch, BiX } from 'react-icons/bi'
import ConfirmModal, {
  ConfirmModalRef
} from '../../components/modal/ConfirmModal'
import DataTable, { TableColumn } from 'react-data-table-component'
import { Inventories } from '../../types/inventory.type'
import { Machines } from '../../types/machine.type'
import { Drug } from '../../types/drug.type'

const Inventory = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [isloading, setIsLoading] = useState(false)
  const addModal = useRef<HTMLDialogElement>(null)
  const editModal = useRef<HTMLDialogElement>(null)
  const confirmModalRef = useRef<ConfirmModalRef>(null)
  const [inventoriesData, setInventoriesData] = useState<Inventories[]>([])
  const [machinesData, setMachinesData] = useState<Machines[]>([])
  const [drugData, setDrugData] = useState<Drug[]>([])

  const [inventoriesForm, setInventoriesForm] = useState({
    id: '',
    floor: 0,
    position: 0,
    quantity: 0,
    min: 0,
    max: 0,
    expiryDate: '',
    drugId: '',
    machineId: ''
  })

  const handleSubmit = async () => {}
  const handleUpdate = async () => {}

  const openEdit = (inventory: Inventories) => {
    editModal.current?.showModal()
    setInventoriesForm({
      id: inventory.id,
      floor: inventory.floor,
      position: inventory.position,
      quantity: inventory.quantity,
      min: inventory.min,
      max: inventory.max,
      expiryDate: inventory.expiryDate,
      drugId: inventory.drugId,
      machineId: inventory.machineId
    })
  }

  const resetForm = () => {
    setInventoriesForm({
      id: '',
      floor: 0,
      position: 0,
      quantity: 0,
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
        name: t('machineName'),
        selector: item => 'item.machineName',
        sortable: false,
        center: true
      }
    ],
    [t, search]
  )

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
          data={[]}
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
        <div className='modal-box p-[24px] rounded-[48px]'>
          <h3 className='font-bold text-lg'>{t('addMachine')}</h3>
          <div className='w-full'>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('floor')}
              </legend>
              <input
                type='number'
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
          <h3 className='font-bold text-lg'>{t('editMachine')}</h3>
          <div className='w-full'>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('floor')}
              </legend>
              <input
                type='number'
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
                className='input w-full h-12 rounded-3xl'
                value={inventoriesForm.position}
                onChange={e =>
                  setInventoriesForm({
                    ...inventoriesForm,
                    position: Number(e.target.value)
                  })
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
                className='btn text-base font-medium h-12 flex-1'
                onClick={() => resetForm()}
                disabled={isloading}
              >
                {t('closeButton')}
              </button>
              <button
                type='button'
                className='btn btn-primary text-base font-bold h-12 flex-1'
                onClick={handleUpdate}
                disabled={isloading}
              >
                {isloading ? (
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
