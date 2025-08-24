import { useDispatch, useSelector } from 'react-redux'
import { Machines } from '../../types/machine.type'
import { RootState } from '../../redux/reducers/rootReducer'
import { setMachine } from '../../redux/actions/utilsActions'
import { useEffect, useState, useMemo, ReactNode } from 'react'
import { AxiosError } from 'axios'
import axiosInstance from '../../constants/axios/axiosInstance'
import { ApiResponse } from '../../types/api.response.type'
import { IoCheckmarkOutline, IoCloseCircleOutline } from 'react-icons/io5'
import MachinePagination from '../../components/pagination/machine.pagination'
import { useTranslation } from 'react-i18next'
import { BiArrowBack, BiSearch, BiX } from 'react-icons/bi'

const MachinePage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { machine: activeMachine } = useSelector(
    (state: RootState) => state.utils
  )
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [machineData, setMachineData] = useState<Machines[]>([])
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'online' | 'offline'
  >('all')

  const fetchMachineData = async () => {
    setIsLoading(true)
    try {
      const result = await axiosInstance.get<ApiResponse<Machines[]>>(
        '/machines'
      )
      setMachineData(result.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Axios error', error.response?.data.message)
      } else {
        console.error('Unexpected error', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMachineData()
  }, [])

  const sortedAndFilteredMachines = useMemo(() => {
    const filtered =
      statusFilter === 'all'
        ? machineData
        : machineData.filter(m => m.status === statusFilter)

    if (activeMachine) {
      const active = filtered.find(m => m.id === activeMachine.id)
      if (active) {
        const remaining = filtered.filter(m => m.id !== activeMachine.id)
        return [active, ...remaining]
      }
    }

    const searchMachine = filtered.filter(
      m =>
        m.machineName.toLowerCase().includes(search.toLowerCase()) ||
        m.ipAddress.toLowerCase().includes(search.toLowerCase())
    )

    return searchMachine
  }, [machineData, statusFilter, activeMachine, search])

  const saveMachine = (machine: Machines) => {
    dispatch(setMachine(machine))
  }

  const cancelSelection = () => {
    dispatch(setMachine(undefined))
  }

  const renderMachineCard = (machine: Machines): ReactNode => {
    const isActive = activeMachine?.id === machine.id

    return (
      <div
        key={machine.id}
        className={`card w-full border-2 border-base-100 bg-base-100 rounded-[40px] shadow-md transition-all duration-300 ${
          isActive ? 'border-primary' : ''
        }`}
      >
        <div className='card-body'>
          <div className='flex justify-between items-start'>
            <h2 className='card-title text-xl truncate block max-w-[150px]'>
              {machine.machineName}
            </h2>
            <div
              className={`badge p-3 ${
                machine.status === 'online' ? 'badge-success' : 'badge-ghost'
              }`}
            >
              {machine.status === 'online' ? t('online') : t('offline')}
            </div>
          </div>
          <p className='text-sm text-base-content/60 truncate mt-1'>
            {t('machineIpaddress')}: {machine.ipAddress?.split('f:')[1]}
          </p>
          <p className='text-sm text-base-content/60 truncate mt-1'>
            {t('communicationNo')}: {machine.running}
          </p>

          <div className='card-actions mt-4'>
            {isActive ? (
              <div className='flex items-center gap-3 w-full'>
                <button
                  disabled
                  className='btn flex-1 badge-sm h-12 rounded-3xl text-sm font-bold'
                >
                  <IoCheckmarkOutline size={24} />
                  {t('selected')}
                </button>
                <button
                  className='btn btn-ghost btn-sm flex-1 text-error h-12 rounded-3xl text-sm font-bold'
                  onClick={cancelSelection}
                >
                  <IoCloseCircleOutline size={24} />
                  {t('closeButton')}
                </button>
              </div>
            ) : (
              <button
                className='btn btn-primary flex-1 h-12 rounded-3xl text-base font-bold'
                onClick={() => saveMachine(machine)}
              >
                {t('select')}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <button
        className='btn btn-primary h-12 rounded-3xl'
        onClick={() => window.history.back()}
      >
        <BiArrowBack size={24} />
        <span>{t('back')}</span>
      </button>
      <div className='max-w-7xl mx-auto mt-12'>
        <h1 className='text-4xl font-bold text-base-content mb-2'>
          {t('selectMachine')}
        </h1>
        <p className='text-base-content/60 mb-8'>
          {t('selectMachineDescription')}
        </p>

        {isLoading ? (
          <div className='flex items-center justify-center h-screen'>
            <span className='loading loading-spinner text-base-content loading-md'></span>
          </div>
        ) : (
          <>
            <div className='flex justify-between mb-6'>
              <div role='tablist' className='tabs tabs-box bg-base-300'>
                <a
                  role='tab'
                  className={`tab h-13 px-5 ${
                    statusFilter === 'all' ? 'tab-active' : ''
                  }`}
                  onClick={() => setStatusFilter('all')}
                >
                  {t('filterAll')}
                </a>
                <a
                  role='tab'
                  className={`tab h-13 px-5 ${
                    statusFilter === 'online' ? 'tab-active' : ''
                  }`}
                  onClick={() => setStatusFilter('online')}
                >
                  {t('online')}
                </a>
                <a
                  role='tab'
                  className={`tab h-13 px-5 ${
                    statusFilter === 'offline' ? 'tab-active' : ''
                  }`}
                  onClick={() => setStatusFilter('offline')}
                >
                  {t('offline')}
                </a>
              </div>
              <label className='input h-13 rounded-3xl'>
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

            <MachinePagination
              data={sortedAndFilteredMachines}
              initialPerPage={30}
              itemPerPage={[30, 50, 100]}
              renderItem={renderMachineCard}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default MachinePage
