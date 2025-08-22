import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { useTranslation } from 'react-i18next'
import {
  BiCheck,
  BiEdit,
  BiError,
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

interface RoleSelect {
  key: string
  value: string
}

const User = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const addModal = useRef<HTMLDialogElement>(null)
  const editModal = useRef<HTMLDialogElement>(null)
  const confirmModalRef = useRef<ConfirmModalRef>(null)
  const [userData, setUserData] = useState<Users[]>([])
  const [userFilterData, setUserFilterData] = useState<Users[]>([])
  const [userForm, setUserForm] = useState({
    id: '',
    userName: '',
    userPassword: '',
    displayName: '',
    userRole: '',
    imageFile: null as File | null,
    imagePreview: null as string | null
  })

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

  const fetchUser = async () => {
    setIsLoading(true)
    try {
      const result = await axiosInstance.get<ApiResponse<Users[]>>('/users')
      setUserData(result.data.data)
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
    console.table(userForm)
  }

  const handleUpdate = async () => {}

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
      userRole: '',
      imageFile: null,
      imagePreview: null
    })
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
        selector: item => item.displayName,
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
        name: t('action'),
        cell: item => (
          <div className='flex items-center gap-3'>
            <button
              className='btn btn-primary p-2.5'
              onClick={() => openEdit(item)}
            >
              <BiEdit size={24} />
            </button>
            <button
              className='btn btn-error p-2.5'
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
        f.displayName.toLowerCase().includes(search.toLowerCase()) ||
        f.userName.toLowerCase().includes(search.toLowerCase())
    )

    setUserFilterData(filter)
  }, [userData, search])

  return (
    <div>
      <div className='flex items-center justify-between'>
        <span className='text-2xl font-medium'>{t('itemUser')}</span>
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
          data={userFilterData}
          paginationPerPage={30}
          progressPending={isLoading}
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
                className='input w-full h-12 rounded-3xl'
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
                className='input w-full h-12 rounded-3xl'
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
                className='input w-full h-12 rounded-3xl'
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
                className='btn text-base font-medium h-12 flex-1'
                onClick={() => resetForm()}
                disabled={isLoading}
              >
                {t('closeButton')}
              </button>
              <button
                type='button'
                className='btn btn-primary text-base font-bold h-12 flex-1'
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
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
                className='input w-full h-12 rounded-3xl'
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
                className='input w-full h-12 rounded-3xl'
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
                className='btn text-base font-medium h-12 flex-1'
                onClick={() => resetForm()}
                disabled={isLoading}
              >
                {t('closeButton')}
              </button>
              <button
                type='button'
                className='btn btn-primary text-base font-bold h-12 flex-1'
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
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

export default User
