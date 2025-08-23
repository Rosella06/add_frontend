import { useDispatch, useSelector } from 'react-redux'
import { setTheme } from '../../redux/actions/utilsActions'
import { RootState } from '../../redux/reducers/rootReducer'
import { useTranslation } from 'react-i18next'
import { RiCheckLine } from 'react-icons/ri'
import { BiArrowBack } from 'react-icons/bi'

const Theme = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { themeMode } = useSelector((state: RootState) => state.utils)

  const themeList = [
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter',
    'dim',
    'nord',
    'sunset',
    'caramellatte',
    'abyss',
    'silk'
  ]

  const changeTheme = (themeName: string) => {
    dispatch(setTheme(themeName))
  }

  const changeToSystem = () => {
    dispatch(setTheme(''))
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
      <div className='max-w-4xl mx-auto mt-12'>
        <h1 className='text-4xl font-bold text-base-content mb-8'>
          {t('theme')}
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 py-3 pl-3 pr-2'>
          <button
            data-set-theme='system'
            className={`flex items-center justify-between p-2 rounded-selector hover:bg-base-200 active:bg-neutral cursor-pointer ${
              themeMode === '' ? 'bg-base-300/50' : ''
            }`}
            onClick={changeToSystem}
          >
            <div className='flex items-center gap-2.5'>
              <div
                data-theme='system'
                className='grid grid-cols-2 gap-0.5 p-1.5 bg-radial-[at_25%_25%] from-gray-200 to-gray-800 to-75% shadow-sm rounded-md'
              >
                <div className='bg-black rounded-box rounded-full w-2 h-2'></div>
                <div className='bg-white rounded-box rounded-full w-2 h-2'></div>
                <div className='bg-white rounded-box rounded-full w-2 h-2'></div>
                <div className='bg-black rounded-box rounded-full w-2 h-2'></div>
              </div>
              <span className='text-sm'>{t('systemMode')}</span>
            </div>
            <div
              className={
                themeMode === ''
                  ? 'bg-neutral text-neutral-content p-0.5 rounded-selector'
                  : ''
              }
            >
              {themeMode === '' && <RiCheckLine size={18} />}
            </div>
          </button>
          {themeList.map((theme, index) => (
            <button
              key={index}
              data-set-theme={theme}
              className={`flex items-center justify-between p-2 rounded-selector hover:bg-base-200 active:bg-neutral cursor-pointer ${
                theme === themeMode ? 'bg-base-300/50' : ''
              }`}
              onClick={() => changeTheme(theme)}
            >
              <div className='flex items-center gap-2.5'>
                <div
                  data-theme={theme}
                  className='grid grid-cols-2 gap-0.5 p-1.5 bg-base-200 shadow-sm rounded-md'
                >
                  <div className='bg-primary rounded-box rounded-full w-2 h-2'></div>
                  <div className='bg-secondary rounded-box rounded-full w-2 h-2'></div>
                  <div className='bg-accent rounded-box rounded-full w-2 h-2'></div>
                  <div className='bg-neutral rounded-box rounded-full w-2 h-2'></div>
                </div>
                <span className='text-sm'>{theme}</span>
              </div>
              <div
                className={
                  themeMode === theme
                    ? 'bg-neutral text-neutral-content p-0.5 rounded-selector'
                    : ''
                }
              >
                {themeMode === theme && <RiCheckLine size={18} />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Theme
