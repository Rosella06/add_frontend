import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiPlus, BiSearch, BiX } from 'react-icons/bi'

const Inventories = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [isloading, setIsLoading] = useState(false)
  const addModal = useRef<HTMLDialogElement>(null)
  const editModal = useRef<HTMLDialogElement>(null)

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
    </div>
  )
}

export default Inventories
