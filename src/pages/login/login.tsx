import axios, { AxiosError } from 'axios'
import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { ApiResponse } from '../../types/api.response.type'
import { LoginResponse } from '../../types/login.type'
import {
  accessToken,
  cookieOptions,
  cookies
} from '../../constants/utils/utilsConstants'
import { useDispatch } from 'react-redux'
import { setCookieEncode } from '../../redux/actions/utilsActions'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BiError, BiLockAlt, BiSolidDownArrow, BiUser } from 'react-icons/bi'
import { showToast } from '../../constants/utils/toast'
import Logo from '../../assets/images/add-512.png'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [userLogin, setUserLogin] = useState({
    userName: '',
    userPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const signInQrModal = useRef<HTMLDialogElement>(null)
  let textScanner = ''

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (userLogin.userName === '' && userLogin.userPassword === '') {
      alert('Please complete all field!')
      return
    }

    try {
      const result = await axios.post<ApiResponse<LoginResponse>>(
        `${import.meta.env.VITE_APP_API}/auth/login`,
        userLogin
      )

      const { displayName, id, token, userImage, userRole, userStatus } =
        result.data.data

      const tokenObject = {
        id,
        displayName,
        userImage,
        userRole,
        userStatus,
        token
      }

      cookies.set(
        'tokenObject',
        String(accessToken(tokenObject)),
        cookieOptions
      )
      cookies.update()
      dispatch(setCookieEncode(String(accessToken(tokenObject))))
      navigate(`/`)
    } catch (error) {
      if (error instanceof AxiosError) {
        await showToast({
          type: 'error',
          icon: BiError,
          message: error.response?.data.message ?? t('somethingWentWrong'),
          duration: 1800,
          showClose: false
        })
      } else {
        console.error(error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLoginWithQrCode = async (qrCodeText: string) => {
    if (qrCodeText === '') return

    try {
      const result = await axios.post<ApiResponse<LoginResponse>>(
        `${import.meta.env.VITE_APP_API}/auth/login`,
        {
          pinCode: qrCodeText
        }
      )

      const { displayName, id, token, userImage, userRole, userStatus } =
        result.data.data

      const tokenObject = {
        id,
        displayName,
        userImage,
        userRole,
        userStatus,
        token
      }

      cookies.set(
        'tokenObject',
        String(accessToken(tokenObject)),
        cookieOptions
      )
      cookies.update()
      dispatch(setCookieEncode(String(accessToken(tokenObject))))
      navigate(`/`)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (signInQrModal.current) {
          signInQrModal.current.close()
        }
        await showToast({
          type: 'error',
          icon: BiError,
          message: error.response?.data.message ?? t('somethingWentWrong'),
          duration: 1800,
          showClose: false
        }).finally(() => {
          if (signInQrModal.current) {
            signInQrModal.current.showModal()
          }
        })
      } else {
        console.error(error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setUserLogin(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const signInWithQrCode = () => {
    if (signInQrModal.current) {
      signInQrModal.current.showModal()
      document.addEventListener('keypress', onBarcodeScan)
    }
  }

  const stopKeyboardEvent = () => {
    document.removeEventListener('keypress', onBarcodeScan)
  }

  const onBarcodeScan = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLoginWithQrCode(textScanner)
      textScanner = ''
    } else {
      textScanner += e.key
    }
  }

  return (
    <div className='min-h-screen flex justify-center items-center bg-base-200 p-4'>
      <div className='card w-full rounded-[48px] max-w-lg bg-base-100 shadow-xl'>
        <div className='card-body p-[24px]'>
          <div className='text-center mb-6'>
            <h1 className='text-5xl font-bold text-primary'>
              <div className='avatar'>
                <div className='w-24 rounded'>
                  <img src={Logo} />
                </div>
              </div>
            </h1>
            {/* <p className='text-lg text-base-content/60 mt-2'>
              {t('loginDescription')}
            </p> */}
          </div>

          <form onSubmit={handleLogin} className='flex flex-col gap-4'>
            <div className='form-control w-full'>
              <label className='input input-bordered flex items-center gap-4 rounded-3xl h-[58px] w-full'>
                <BiUser size={22} />
                <input
                  type='text'
                  className='grow border-none focus:ring-0 focus:outline-none text-lg'
                  required
                  autoFocus
                  placeholder={t('userName')}
                  pattern='[A-Za-z][A-Za-z0-9\-]*'
                  minLength={3}
                  maxLength={30}
                  title={t('userNameTitle')}
                  name='userName'
                  value={userLogin.userName}
                  onChange={handleChange}
                />
              </label>
              <div className='label mt-2 ml-2'>
                <span className='label-text-alt text-sm text-base-content/70'>
                  {t('userNameTitle')}
                </span>
              </div>
            </div>

            <div className='form-control w-full'>
              <label className='input input-bordered flex items-center gap-4 rounded-3xl h-[58px] w-full'>
                <BiLockAlt size={22} />
                <input
                  type='password'
                  className='grow border-none focus:ring-0 focus:outline-none text-lg'
                  required
                  placeholder={t('userPassword')}
                  minLength={6}
                  pattern='[a-zA-Z0-9]{6,}'
                  title={t('userPasswordTitle')}
                  name='userPassword'
                  value={userLogin.userPassword}
                  onChange={handleChange}
                />
              </label>
              <div className='label mt-2 ml-2'>
                <span className='label-text-alt text-sm text-base-content/70'>
                  {t('userPasswordTitle')}
                </span>
              </div>
            </div>

            <div className='form-control mt-6'>
              <button
                type='submit'
                disabled={loading}
                className='btn btn-primary w-full text-xl rounded-3xl h-[58px]'
              >
                {loading ? (
                  <span className='loading loading-spinner text-base-content'></span>
                ) : (
                  t('loginButton')
                )}
              </button>
            </div>

            <div className='divider'>{t('dividerOr')}</div>

            <button
              type='button'
              disabled={loading}
              className='btn btn-ghost w-full text-xl rounded-3xl h-[54px]'
              onClick={signInWithQrCode}
            >
              {t('loginWithQrCode')}
            </button>
          </form>
        </div>
      </div>

      <dialog ref={signInQrModal} className='modal'>
        <div className='modal-box p-[24px] rounded-[48px]'>
          <h3 className='font-bold text-lg'>{t('scanQrCode')}</h3>
          <div className='flex items-center justify-center h-64'>
            <BiSolidDownArrow size={64} className='text-primary' />
          </div>
          <div className='modal-action'>
            <form method='dialog'>
              <button
                className='btn text-base rounded-3xl h-12'
                onClick={stopKeyboardEvent}
              >
                {t('closeButton')}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default Login
