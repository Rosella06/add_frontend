import { useTranslation } from 'react-i18next'
import EmptyImg from '../../assets/images/empty.png'

const Empty = () => {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col items-center gap-3 py-5'>
      <div className='avatar'>
        <div className='w-85 rounded'>
          <img src={EmptyImg} />
        </div>
      </div>
      <span className='text-lg font-medium'>{t('emptyData')}</span>
    </div>
  )
}

export default Empty
