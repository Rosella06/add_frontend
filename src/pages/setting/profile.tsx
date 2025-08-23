import { ChangeEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { resizeImage } from '../../constants/utils/image'
import { showToast } from '../../constants/utils/toast'
import { BiArrowBack, BiCheck, BiEdit, BiError } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { Role, Users } from '../../types/user.type'
import { AxiosError } from 'axios'
import axiosInstance from '../../constants/axios/axiosInstance'
import { ApiResponse } from '../../types/api.response.type'
import {
  accessToken,
  cookieOptions,
  cookies
} from '../../constants/utils/utilsConstants'
import {
  setCookieDecode,
  setCookieEncode
} from '../../redux/actions/utilsActions'

const Profile = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { cookieDecode } = useSelector((state: RootState) => state.utils)
  const [isEditing, setIsEditing] = useState(false)
  const [userForm, setUserForm] = useState({
    id: cookieDecode?.id,
    userRole: cookieDecode?.userRole,
    userStatus: cookieDecode?.userStatus,
    displayName: cookieDecode?.displayName,
    imageFile: null as File | null,
    imagePreview: cookieDecode?.userImage
  })

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('displayName', String(userForm.displayName))
    try {
      const result = await axiosInstance.patch<ApiResponse<Users>>(
        `/users/${userForm.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      const { displayName, id, userImage, userRole, userStatus } =
        result.data.data
      const { token } = cookieDecode || ({} as { token: string })

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
      dispatch(setCookieDecode(tokenObject))
      setIsEditing(false)
      await showToast({
        type: 'success',
        icon: BiCheck,
        message: result.data.message,
        duration: 3000,
        showClose: false
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        await showToast({
          type: 'error',
          icon: BiError,
          message: error.response?.data.message ?? t('somethingWentWrong'),
          duration: 3000,
          showClose: false
        })
      } else {
        console.error(error)
      }
    }
  }

  const handleEditImage = async (imageFile: File) => {
    const formData = new FormData()
    formData.append('upload', imageFile)
    try {
      const result = await axiosInstance.patch<ApiResponse<Users>>(
        `/users/${userForm.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      const { displayName, id, userImage, userRole, userStatus } =
        result.data.data
      const { token } = cookieDecode || ({} as { token: string })

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
      dispatch(setCookieDecode(tokenObject))

      await showToast({
        type: 'success',
        icon: BiCheck,
        message: result.data.message,
        duration: 3000,
        showClose: false
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        await showToast({
          type: 'error',
          icon: BiError,
          message: error.response?.data.message ?? t('somethingWentWrong'),
          duration: 3000,
          showClose: false
        })
      } else {
        console.error(error)
      }
    }
  }

  const resetForm = () => {
    setIsEditing(false)
    setUserForm({
      id: cookieDecode?.id,
      userRole: cookieDecode?.userRole,
      userStatus: cookieDecode?.userStatus,
      displayName: cookieDecode?.displayName,
      imageFile: null as File | null,
      imagePreview: cookieDecode?.userImage
    })
  }

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        await showToast({
          type: 'error',
          icon: BiError,
          message: t('imageSizeLimit'),
          duration: 1800,
          showClose: false
        }).finally(async () => {
          setUserForm({
            ...userForm,
            imageFile: null,
            imagePreview: cookieDecode?.userImage
          })
        })
        return
      }

      await new Promise(resolve => setTimeout(resolve, 500))
      const reSized = await resizeImage(file)
      setUserForm(prev => ({
        ...prev,
        imageFile: reSized,
        imagePreview: URL.createObjectURL(file)
      }))
      await handleEditImage(reSized)
    }
  }

  const getRoleName = (role: Role | undefined) => {
    switch (role) {
      case 'ADMIN':
        return t('roleADMIN')
      case 'USER':
        return t('roleUSER')
      case 'HEAD_PHARMACIST':
        return t('roleHEAD_PHARMACIST')
      case 'PHARMACIST':
        return t('rolePHARMACIST')
      case 'ASSISTANT':
        return t('roleASSISTANT')
      default:
        return t('roleSUPER')
    }
  }

  //   const truncateMiddle = (text: string, maxLength = 15) => {
  //     if (text.length <= maxLength) return text
  //     const half = Math.floor((maxLength - 3) / 2)
  //     return text.slice(0, half) + '...' + text.slice(-half)
  //   }

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
        <h1 className='text-4xl font-bold text-base-content mb-8'>
          {t('personalInformation')}
        </h1>

        <div className='flex items-start justify-between gap-6 mb-8'>
          <div className='flex items-center gap-6'>
            <div className='avatar'>
              <div className='w-32 rounded-3xl'>
                <img
                  src={
                    userForm.imageFile === null
                      ? import.meta.env.VITE_APP_IMG + userForm.imagePreview
                      : userForm.imagePreview
                  }
                  alt='User Profile'
                />
              </div>
            </div>
            <div className='flex flex-col item-start gap-3'>
              <h2 className='text-4xl font-bold'>
                {cookieDecode?.displayName}
              </h2>
              <span className='text-base-content/60 text-xl'>
                {getRoleName(cookieDecode?.userRole)}
              </span>
              <label className='btn btn-link justify-start p-0 h-auto min-h-0 mt-2 text-lg text-primary'>
                {t('changeImageProfile')}
                <input
                  id='image-upload'
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
          {!isEditing && (
            <button
              type='button'
              onClick={() => setIsEditing(true)}
              className='btn btn-primary text-base font-bold p-0 h-13 w-13 rounded-2xl'
            >
              <BiEdit size={24} />
            </button>
          )}
        </div>

        <div className='divider before:h-[1px] after:h-[1px]'></div>
        {isEditing && (
          <form onSubmit={handleFormSubmit} className='space-y-6'>
            <fieldset className='fieldset '>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('displayName')}
              </legend>
              <input
                readOnly={!isEditing}
                autoFocus={isEditing}
                type='text'
                className='input w-full h-15 rounded-3xl read-only:outline-none read-only:caret-transparent'
                value={userForm.displayName}
                onChange={e =>
                  setUserForm({
                    ...userForm,
                    displayName: e.target.value
                  })
                }
              />
            </fieldset>

            <div className='divider before:h-[1px] after:h-[1px]'></div>

            <div className='flex justify-end gap-4'>
              <button
                type='button'
                onClick={resetForm}
                className='btn text-base font-medium h-15 flex-1 rounded-3xl'
              >
                {t('closeButton')}
              </button>
              <button
                type='submit'
                className='btn btn-primary text-base font-bold h-15 flex-1 rounded-3xl'
              >
                {t('saveButton')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Profile
