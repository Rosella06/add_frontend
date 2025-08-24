import { useTranslation } from 'react-i18next'
import { IoIosCog } from 'react-icons/io'
import {
  IoLanguage,
  IoColorPalette,
  IoPersonCircle,
  IoHardwareChip
} from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const Settings = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleMenuClick = (menuName: string) => {
    navigate(`/settings/${menuName}`)
  }

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <h1 className='text-4xl font-bold text-base-content mb-8'>
        {t('itemSettings')}
      </h1>

      <h2 className='text-sm font-bold uppercase text-base-content/60 mb-2'>
        {t('account')}
      </h2>
      <ul className='menu bg-base-100 rounded-3xl mb-8 w-full'>
        <li>
          <a
            className='py-5 text-lg rounded-2xl'
            onClick={() => handleMenuClick('profile')}
          >
            <IoPersonCircle size={32} />
            <span className='flex-grow'>{t('manageAccount')}</span>
            <span className='text-base-content/50'>&rsaquo;</span>
          </a>
        </li>
      </ul>

      <h2 className='text-sm font-bold uppercase text-base-content/60 mb-2'>
        {t('generalSettings')}
      </h2>
      <ul className='menu bg-base-100 rounded-3xl mb-8 w-full'>
        <li>
          <a
            className='py-5 text-lg rounded-2xl'
            onClick={() => handleMenuClick('language')}
          >
            <IoLanguage size={32} />
            <span className='flex-grow'>{t('changeLanguage')}</span>
            <span className='text-base-content/50'>&rsaquo;</span>
          </a>
        </li>
        <li>
          <a
            className='py-5 text-lg rounded-2xl'
            onClick={() => handleMenuClick('theme')}
          >
            <IoColorPalette size={32} />
            <span className='flex-grow'>{t('changeTheme')}</span>
            <span className='text-base-content/50'>&rsaquo;</span>
          </a>
        </li>
      </ul>

      <h2 className='text-sm font-bold uppercase text-base-content/60 mb-2'>
        {t('device')}
      </h2>
      <ul className='menu bg-base-100 rounded-3xl w-full'>
        <li>
          <a
            className='py-5 text-lg rounded-2xl'
            onClick={() => handleMenuClick('machine')}
          >
            <IoHardwareChip size={32} />
            <span className='flex-grow'>{t('manageDevice')}</span>
            <span className='text-base-content/50'>&rsaquo;</span>
          </a>
        </li>
        <li>
          <a
            className='py-5 text-lg rounded-2xl'
            onClick={() => handleMenuClick('testtool')}
          >
            <IoIosCog size={32} />
            <span className='flex-grow'>{t('testTool')}</span>
            <span className='text-base-content/50'>&rsaquo;</span>
          </a>
        </li>
      </ul>
    </div>
  )
}

export default Settings
