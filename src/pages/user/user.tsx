import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { useTranslation } from 'react-i18next'
import {
  BiCheck,
  BiDownload,
  BiEdit,
  BiError,
  BiErrorCircle,
  BiImage,
  BiPencil,
  BiPlus,
  BiSearch,
  BiTrashAlt,
  BiX
} from 'react-icons/bi'
import { Users } from '../../types/user.type'
import { AxiosError } from 'axios'
import axiosInstance from '../../constants/axios/axiosInstance'
import { ApiResponse } from '../../types/api.response.type'
import ConfirmModal, {
  ConfirmModalRef
} from '../../components/modal/ConfirmModal'
import { showToast } from '../../constants/utils/toast'
import Select from 'react-select'
import { mapDefaultValue, mapOptions } from '../../constants/utils/reacr.select'
import { resizeImage } from '../../constants/utils/image'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import Empty from '../../components/empty/empty'
import QRCode from 'react-qr-code'
import Numpad from '../../components/pages/user/numpad'

interface RoleSelect {
  key: string
  value: string
}

interface UserActive {
  key: string
  value: string
}

const User = () => {
  const { t } = useTranslation()
  const { cookieDecode } = useSelector((state: RootState) => state.utils)
  const { id } = cookieDecode ?? {}
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pinIsLoading, setPinIsLoading] = useState(false)
  const addModal = useRef<HTMLDialogElement>(null)
  const editModal = useRef<HTMLDialogElement>(null)
  const securityModal = useRef<HTMLDialogElement>(null)
  const confirmModalRef = useRef<ConfirmModalRef>(null)
  const qrCode = useRef<any | null>(null)
  const [securityModalData, setSecurityModalData] = useState<Users | null>(null)
  const [userData, setUserData] = useState<Users[]>([])
  const [userFilterData, setUserFilterData] = useState<Users[]>([])
  const [securityPage, setSecurityPage] = useState('menu')
  const [userForm, setUserForm] = useState({
    id: '',
    userName: '',
    userPassword: '',
    userStatus: true,
    displayName: '',
    pinCode: '' as string | null,
    userRole: '',
    imageFile: null as File | null,
    imagePreview: null as string | null
  })
  const [filterRole, setFilterRole] = useState('')

  const RoleArray = [
    {
      key: 'ADMIN',
      value: t('roleADMIN')
    },
    {
      key: 'USER',
      value: t('roleUSER')
    },
    {
      key: 'HEAD_PHARMACIST',
      value: t('roleHEAD_PHARMACIST')
    },
    {
      key: 'PHARMACIST',
      value: t('rolePHARMACIST')
    },
    {
      key: 'ASSISTANT',
      value: t('roleASSISTANT')
    },
    {
      key: 'SUPER',
      value: t('roleSUPER')
    }
  ]

  const UserStatus = [
    {
      key: 'true',
      value: t('active')
    },
    {
      key: 'false',
      value: t('inActive')
    }
  ]

  const fetchUser = async () => {
    setIsLoading(true)
    try {
      const result = await axiosInstance.get<ApiResponse<Users[]>>('/users')
      const userData = result.data.data.filter(f => f.id !== id)
      setUserData(userData)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (
      userForm.userName !== '' &&
      userForm.userPassword !== '' &&
      userForm.displayName !== '' &&
      userForm.imageFile !== null &&
      userForm.userRole !== ''
    ) {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('userName', userForm.userName)
      formData.append('userPassword', userForm.userPassword)
      formData.append('displayName', userForm.displayName)
      formData.append('userRole', userForm.userRole)
      formData.append('upload', userForm.imageFile)
      try {
        const result = await axiosInstance.post<ApiResponse<Users>>(
          `/auth/register`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        addModal.current?.close()
        resetForm()
        showToast({
          type: 'success',
          icon: BiCheck,
          message: result.data.message,
          duration: 3000,
          showClose: false
        })
      } catch (error) {
        if (error instanceof AxiosError) {
          addModal.current?.close()
          await showToast({
            type: 'error',
            icon: BiError,
            message: error.response?.data.message ?? t('somethingWentWrong'),
            duration: 3000,
            showClose: false
          }).finally(() => addModal.current?.showModal())
        } else {
          console.error(error)
        }
      } finally {
        await fetchUser()
        setIsLoading(false)
      }
    } else {
      addModal.current?.close()
      await showToast({
        type: 'warning',
        icon: BiErrorCircle,
        message: t('pleaseCompleteField'),
        duration: 3000,
        showClose: true
      }).finally(() => addModal.current?.showModal())
    }
  }

  const handleUpdate = async () => {
    if (
      userForm.userName !== '' &&
      userForm.displayName !== '' &&
      userForm.userRole !== ''
    ) {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('userName', userForm.userName)
      formData.append('displayName', userForm.displayName)
      formData.append('userStatus', userForm.userStatus.toString())
      formData.append('userRole', userForm.userRole)

      if (userForm.imageFile !== null) {
        formData.append('upload', userForm.imageFile)
      }

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
        editModal.current?.close()
        resetForm()
        showToast({
          type: 'success',
          icon: BiCheck,
          message: result.data.message,
          duration: 3000,
          showClose: false
        })
      } catch (error) {
        if (error instanceof AxiosError) {
          editModal.current?.close()
          await showToast({
            type: 'error',
            icon: BiError,
            message: error.response?.data.message ?? t('somethingWentWrong'),
            duration: 3000,
            showClose: false
          }).finally(() => editModal.current?.showModal())
        } else {
          console.error(error)
        }
      } finally {
        await fetchUser()
        setIsLoading(false)
      }
    } else {
      editModal.current?.close()
      await showToast({
        type: 'warning',
        icon: BiErrorCircle,
        message: t('pleaseCompleteField'),
        duration: 3000,
        showClose: true
      }).finally(() => editModal.current?.showModal())
    }
  }

  const handleSavePin = async () => {
    setPinIsLoading(true)
    try {
      const result = await axiosInstance.post<ApiResponse<Users>>(
        `/auth/pincode`,
        {
          id: securityModalData?.id,
          pinCode: userForm.pinCode
        }
      )
      securityModal.current?.close()
      showToast({
        type: 'success',
        icon: BiCheck,
        message: result.data.message,
        duration: 3000,
        showClose: false
      })
      resetFormPin()
    } catch (error) {
      if (error instanceof AxiosError) {
        securityModal.current?.close()
        await showToast({
          type: 'error',
          icon: BiError,
          message: error.response?.data.message ?? t('somethingWentWrong'),
          duration: 3000,
          showClose: false
        }).finally(() => securityModal.current?.showModal())
      } else {
        console.error(error)
      }
    } finally {
      await fetchUser()
      setPinIsLoading(false)
    }
  }

  const deleteUser = async (userId: string) => {
    setIsLoading(true)
    try {
      const result = await axiosInstance.delete<ApiResponse<string>>(
        `/users/${userId}`
      )
      showToast({
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
    } finally {
      await fetchUser()
      setIsLoading(false)
    }
  }

  const openEdit = (user: Users) => {
    setUserForm({
      id: user.id,
      userName: user.userName,
      userPassword: '',
      displayName: user.displayName,
      pinCode: user.pinCode,
      userStatus: user.userStatus,
      userRole: user.userRole,
      imageFile: null,
      imagePreview: user.userImage
    })
    editModal.current?.showModal()
  }

  const resetForm = () => {
    setUserForm({
      id: '',
      userName: '',
      userPassword: '',
      displayName: '',
      pinCode: '',
      userStatus: true,
      userRole: '',
      imageFile: null,
      imagePreview: null
    })
  }

  const resetFormPin = () => {
    qrCode.current = null
    setSecurityModalData(null)
    setUserForm({ ...userForm, pinCode: '' })
    setSecurityPage('menu')
  }

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addModal.current?.close()
        editModal.current?.close()
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
            imagePreview: null
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
    }
  }

  const handleDownload = () => {
    const svg = qrCode.current as SVGElement | null

    if (svg) {
      const bbox = svg.getBoundingClientRect()

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = bbox.width
      canvas.height = bbox.height

      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(svg)
      const img = new Image()
      const svgBlob = new Blob([svgString], {
        type: 'image/svg+xml;charset=utf-8'
      })
      const url = URL.createObjectURL(svgBlob)

      img.onload = () => {
        ctx.drawImage(img, 0, 0, bbox.width, bbox.height)

        const pngUrl = canvas
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream')

        const downloadLink = document.createElement('a')
        downloadLink.href = pngUrl
        downloadLink.download = 'qrcode.png'
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)

        URL.revokeObjectURL(url)
      }

      img.src = url
    } else {
      console.error('Could not find the QR code SVG element.')
    }
  }

  const handlePinChange = (newPin: string) => {
    setUserForm({
      ...userForm,
      pinCode: newPin
    })
  }

  const columns: TableColumn<Users>[] = useMemo(
    () => [
      {
        name: t('image'),
        cell: item => (
          <div className='avatar'>
            <div className='w-10 rounded'>
              <img src={import.meta.env.VITE_APP_IMG + item.userImage} />
            </div>
          </div>
        ),
        sortable: false,
        center: true
      },
      {
        name: t('userName'),
        cell: item => (
          <div className='tooltip' data-tip={item.userName}>
            <span className='truncate w-[128px] block text-center'>
              {item.userName}
            </span>
          </div>
        ),
        sortable: false,
        center: true
      },
      {
        name: t('displayName'),
        cell: item => (
          <div className='tooltip' data-tip={item.displayName}>
            <span className='truncate w-[128px] block text-center'>
              {item.displayName}
            </span>
          </div>
        ),
        sortable: false,
        center: true
      },
      {
        name: t('role'),
        selector: item => {
          switch (item.userRole) {
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
        },
        sortable: false,
        center: true
      },
      {
        name: t('machineStatus'),
        selector: item => (item.userStatus ? t('active') : t('inActive')),
        sortable: false,
        center: true
      },
      {
        name: t('security'),
        cell: item => (
          <span
            className='btn btn-link'
            onClick={() => {
              setSecurityModalData(item)
              securityModal.current?.showModal()
            }}
          >
            {t('detail')}
          </span>
        ),
        sortable: false,
        center: true
      },
      {
        name: t('action'),
        cell: item => (
          <div className='flex items-center gap-3'>
            <button
              className='btn btn-primary p-2.5 rounded-3xl'
              onClick={() => openEdit(item)}
            >
              <BiEdit size={24} />
            </button>
            <button
              className='btn btn-error p-2.5 rounded-3xl'
              onClick={async () => {
                const confirmed = await confirmModalRef.current?.show({
                  title: t('deleteTitle'),
                  description: t('deleteDescription'),
                  type: 'warning'
                })

                if (confirmed) {
                  await deleteUser(item.id)
                }
              }}
            >
              <BiTrashAlt size={24} />
            </button>
          </div>
        ),
        sortable: false,
        center: true
      }
    ],
    [t, search]
  )

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    const filter = userData.filter(
      f =>
        (f.displayName.toLowerCase().includes(search.toLowerCase()) ||
          f.userName.toLowerCase().includes(search.toLowerCase())) &&
        f.userRole.includes(filterRole)
    )

    setUserFilterData(filter)
  }, [userData, search, filterRole])

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-4xl font-bold text-base-content mb-8'>
          {t('itemUser')}
        </h1>
        <div className='flex items-center gap-3'>
          <label className='input h-15 rounded-3xl'>
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
          <Select
            key={filterRole}
            options={mapOptions<RoleSelect, keyof RoleSelect>(
              [{ key: '', value: t('filterAll') }, ...RoleArray],
              'key',
              'value'
            )}
            value={mapDefaultValue<RoleSelect, keyof RoleSelect>(
              [{ key: '', value: t('filterAll') }, ...RoleArray],
              filterRole ?? '',
              'key',
              'value'
            )}
            onChange={e => setFilterRole(String(e?.value))}
            menuPlacement='bottom'
            autoFocus={false}
            className='custom-react-select w-48 z-20'
            classNamePrefix='react-select'
          />
          <div className='tooltip tooltip-bottom' data-tip={t('addUser')}>
            <button
              className='btn btn-primary text-base h-15 w-15 p-0 rounded-3xl'
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
          data={userFilterData}
          paginationPerPage={30}
          progressPending={isLoading}
          progressComponent={
            <span className='loading loading-spinner text-base-content loading-md'></span>
          }
          noDataComponent={<Empty />}
          paginationRowsPerPageOptions={[30, 75, 100]}
        />
      </div>

      <dialog ref={addModal} className='modal'>
        <div className='modal-box p-[24px] rounded-[48px]'>
          <h3 className='font-bold text-lg'>{t('addUser')}</h3>
          <div className='w-full'>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('image')}
              </legend>
              <div className='flex items-center justify-center'>
                <div className='relative w-45 h-45'>
                  <div className='w-full h-full rounded-full bg-base-200 flex items-center justify-center overflow-hidden'>
                    {userForm.imagePreview ? (
                      <img
                        src={userForm.imagePreview}
                        alt='Image Preview'
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <BiImage size={64} className='text-base-content/30' />
                    )}
                  </div>

                  <label
                    htmlFor='image-upload'
                    className='absolute bottom-1 right-1 btn btn-primary btn-circle shadow-md cursor-pointer'
                  >
                    <BiPencil size={24} />
                  </label>

                  <input
                    id='image-upload'
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('userName')}
              </legend>
              <input
                type='text'
                className='input w-full h-15 rounded-3xl'
                value={userForm.userName}
                onChange={e =>
                  setUserForm({
                    ...userForm,
                    userName: e.target.value
                  })
                }
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('userPassword')}
              </legend>
              <input
                type='password'
                className='input w-full h-15 rounded-3xl'
                value={userForm.userPassword}
                onChange={e =>
                  setUserForm({
                    ...userForm,
                    userPassword: e.target.value
                  })
                }
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('displayName')}
              </legend>
              <input
                type='text'
                className='input w-full h-15 rounded-3xl'
                value={userForm.displayName}
                onChange={e =>
                  setUserForm({
                    ...userForm,
                    displayName: e.target.value
                  })
                }
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('role')}
              </legend>
              <Select
                key={userForm.userRole}
                options={mapOptions<RoleSelect, keyof RoleSelect>(
                  RoleArray,
                  'key',
                  'value'
                )}
                value={mapDefaultValue<RoleSelect, keyof RoleSelect>(
                  RoleArray,
                  userForm.userRole ?? '',
                  'key',
                  'value'
                )}
                onChange={e =>
                  setUserForm({
                    ...userForm,
                    userRole: String(e?.value)
                  })
                }
                menuPlacement='top'
                autoFocus={false}
                className='custom-react-select z-20'
                classNamePrefix='react-select'
              />
            </fieldset>
          </div>
          <div className='modal-action'>
            <form method='dialog' className='flex items-center gap-3 w-full'>
              <button
                className='btn text-base font-medium h-15 flex-1 rounded-3xl'
                onClick={() => resetForm()}
                disabled={isLoading}
              >
                {t('closeButton')}
              </button>
              <button
                type='button'
                className='btn btn-primary text-base font-bold h-15 flex-1 rounded-3xl'
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className='loading loading-spinner text-base-content loading-md'></span>
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
          <h3 className='font-bold text-lg'>{t('editUser')}</h3>
          <div className='w-full'>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('image')}
              </legend>
              <div className='flex items-center justify-center'>
                <div className='relative w-45 h-45'>
                  <div className='w-full h-full rounded-full bg-base-200 flex items-center justify-center overflow-hidden'>
                    {userForm.imagePreview ? (
                      <img
                        src={
                          userForm.imageFile === null
                            ? import.meta.env.VITE_APP_IMG +
                              userForm.imagePreview
                            : userForm.imagePreview
                        }
                        alt='Image Preview'
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <BiImage size={64} className='text-base-content/30' />
                    )}
                  </div>

                  <label
                    htmlFor='image-upload'
                    className='absolute bottom-1 right-1 btn btn-primary btn-circle shadow-md cursor-pointer'
                  >
                    <BiPencil size={24} />
                  </label>

                  <input
                    id='image-upload'
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('userName')}
              </legend>
              <input
                type='text'
                className='input w-full h-15 rounded-3xl'
                value={userForm.userName}
                onChange={e =>
                  setUserForm({
                    ...userForm,
                    userName: e.target.value
                  })
                }
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('displayName')}
              </legend>
              <input
                type='text'
                className='input w-full h-15 rounded-3xl'
                value={userForm.displayName}
                onChange={e =>
                  setUserForm({
                    ...userForm,
                    displayName: e.target.value
                  })
                }
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('role')}
              </legend>
              <Select
                key={userForm.userRole}
                options={mapOptions<RoleSelect, keyof RoleSelect>(
                  RoleArray,
                  'key',
                  'value'
                )}
                value={mapDefaultValue<RoleSelect, keyof RoleSelect>(
                  RoleArray,
                  userForm.userRole ?? '',
                  'key',
                  'value'
                )}
                onChange={e =>
                  setUserForm({
                    ...userForm,
                    userRole: String(e?.value)
                  })
                }
                menuPlacement='top'
                autoFocus={false}
                className='custom-react-select z-20'
                classNamePrefix='react-select'
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('status')}
              </legend>
              <Select
                key={userForm.userStatus ? 'true' : 'false'}
                options={mapOptions<UserActive, keyof UserActive>(
                  UserStatus,
                  'key',
                  'value'
                )}
                value={mapDefaultValue<UserActive, keyof UserActive>(
                  UserStatus,
                  userForm.userStatus ? 'true' : 'false',
                  'key',
                  'value'
                )}
                onChange={e =>
                  setUserForm({
                    ...userForm,
                    userStatus: e?.value === 'true' ? true : false
                  })
                }
                menuPlacement='top'
                autoFocus={false}
                className='custom-react-select z-20'
                classNamePrefix='react-select'
              />
            </fieldset>
          </div>
          <div className='modal-action'>
            <form method='dialog' className='flex items-center gap-3 w-full'>
              <button
                className='btn text-base font-medium h-15 flex-1 rounded-3xl'
                onClick={() => resetForm()}
                disabled={isLoading}
              >
                {t('closeButton')}
              </button>
              <button
                type='button'
                className='btn btn-primary text-base font-bold h-15 flex-1 rounded-3xl'
                onClick={handleUpdate}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className='loading loading-spinner text-base-content loading-md'></span>
                ) : (
                  t('editButton')
                )}
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog ref={securityModal} className='modal'>
        <div className='modal-box p-[24px] rounded-[48px]'>
          <h3 className='font-bold text-lg mb-5'>{t('security')}</h3>
          {securityPage === 'menu' ? (
            <div className='flex flex-col gap-3'>
              <button
                className='btn btn-primary text-base font-bold h-15 rounded-3xl'
                onClick={() => setSecurityPage('pin')}
              >
                PIN
              </button>
              <button
                className='btn btn-primary text-base font-bold h-15 rounded-3xl'
                onClick={() => setSecurityPage('genQr')}
                disabled={securityModalData?.pinCode === null}
              >
                {t('genQrCode')}
              </button>
            </div>
          ) : securityPage === 'genQr' ? (
            <div className='flex flex-col items-center gap-5'>
              <div className='h-auto my-0 mx-auto max-w-64 w-full'>
                <QRCode
                  ref={qrCode}
                  size={256}
                  viewBox={`0 0 256 256`}
                  value={String(securityModalData?.pinCode)}
                  className='h-auto max-w-full w-full'
                />
              </div>
              <button
                onClick={handleDownload}
                className='btn btn-primary text-base font-bold h-15 w-full rounded-3xl'
              >
                <BiDownload size={24} /> {t('saveButton')}
              </button>
            </div>
          ) : securityPage === 'pin' ? (
            <div className='flex flex-col gap-3'>
              <button
                disabled={securityModalData?.pinCode !== null}
                onClick={() => setSecurityPage('newPin')}
                className='btn btn-primary text-base font-bold h-15 w-full rounded-3xl'
              >
                {t('genPin')}
              </button>
              <button
                disabled={securityModalData?.pinCode === null}
                onClick={() => setSecurityPage('updatePin')}
                className='btn btn-primary text-base font-bold h-15 w-full rounded-3xl'
              >
                {t('changPin')}
              </button>
            </div>
          ) : securityPage === 'newPin' ? (
            <div className='flex flex-col gap-3'>
              <span className='badge badge-info px-3 py-3.5'>
                {t('pinShouldBeSixDigit')}
              </span>
              <Numpad
                value={String(userForm.pinCode)}
                onChange={handlePinChange}
                maxLength={64}
              />
              <button
                disabled={Number(userForm.pinCode?.length) < 6 || pinIsLoading}
                onClick={handleSavePin}
                className='btn btn-primary text-base font-bold h-15 w-full rounded-3xl'
              >
                {pinIsLoading ? (
                  <span className='loading loading-spinner text-base-content loading-md'></span>
                ) : (
                  t('saveButton')
                )}
              </button>
            </div>
          ) : (
            <div className='flex flex-col gap-3'>
              <span className='badge badge-info px-3 py-3.5'>
                {t('pinShouldBeSixDigit')}
              </span>
              <Numpad
                value={String(userForm.pinCode)}
                onChange={handlePinChange}
                maxLength={64}
              />
              <button
                disabled={Number(userForm.pinCode?.length) < 6 || pinIsLoading}
                onClick={handleSavePin}
                className='btn btn-primary text-base font-bold h-15 w-full rounded-3xl'
              >
                {pinIsLoading ? (
                  <span className='loading loading-spinner text-base-content loading-md'></span>
                ) : (
                  t('editButton')
                )}
              </button>
            </div>
          )}
          <div className='modal-action'>
            <button
              className='btn text-base font-bold h-15 flex-1 rounded-3xl'
              onClick={() => {
                if (securityPage === 'menu') {
                  securityModal.current?.close()
                } else if (securityPage === 'genQr' || securityPage === 'pin') {
                  setSecurityPage('menu')
                } else if (
                  securityPage === 'newPin' ||
                  securityPage === 'updatePin'
                ) {
                  setSecurityPage('pin')
                }
              }}
              disabled={isLoading}
            >
              {securityPage === 'menu' ? t('closeButton') : t('back')}
            </button>
          </div>
        </div>
      </dialog>

      <ConfirmModal ref={confirmModalRef} />
    </div>
  )
}

export default User
