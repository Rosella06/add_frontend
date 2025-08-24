import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { setLanguage } from '../../redux/actions/utilsActions'
import { BiArrowBack } from 'react-icons/bi'

const availableLanguages = [
  {
    code: 'th',
    name: 'ไทย',
    nativeName: 'Thai'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'อังกฤษ'
  }
]

const Language = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { currentLang } = useSelector((state: RootState) => state.utils)

  const changeLanguage = (languageCode: string) => {
    dispatch(setLanguage(languageCode))
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
      <div className='max-w-2xl mx-auto mt-12'>
        <h1 className='text-4xl font-bold text-base-content mb-2'>
          {t('langguage')}
        </h1>
        <p className='text-base-content/60 mb-8'>{t('languageDescription')}</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {availableLanguages.map(lang => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`card rounded-3xl bg-base-100 shadow-sm text-left p-6 transition-all duration-200 ease-in-out hover:bg-base-200 cursor-pointer
                ${
                  currentLang === lang.code
                    ? 'ring-2 ring-primary ring-offset-base-100 ring-offset-2'
                    : ''
                }`}
            >
              <div className='flex items-center gap-7'>
                <h1 className='text-2xl font-bold'>
                  {lang.code.toUpperCase()}
                </h1>
                <div>
                  <h2 className='font-bold text-lg'>{lang.name}</h2>
                  <p className='text-base-content/60'>{lang.nativeName}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Language
