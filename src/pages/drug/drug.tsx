import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { useTranslation } from 'react-i18next'
import {
  BiCheck,
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
import { Drug } from '../../types/drug.type'
import ConfirmModal, {
  ConfirmModalRef
} from '../../components/modal/ConfirmModal'
import axiosInstance from '../../constants/axios/axiosInstance'
import { ApiResponse } from '../../types/api.response.type'
import { AxiosError } from 'axios'
import { showToast } from '../../constants/utils/toast'
import { resizeImage } from '../../constants/utils/image'
import Select from 'react-select'
import { mapDefaultValue, mapOptions } from '../../constants/utils/reacr.select'
import Empty from '../../components/empty/empty'

interface DrugActive {
  key: string
  value: string
}

const Drugs = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const addModal = useRef<HTMLDialogElement>(null)
  const editModal = useRef<HTMLDialogElement>(null)
  const confirmModalRef = useRef<ConfirmModalRef>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [drugData, setDrugData] = useState<Drug[]>([])
  const [drugFilterData, setDrugFilterData] = useState<Drug[]>([])
  const [drugForm, setDrugForm] = useState({
    id: '',
    drugCode: '',
    drugName: '',
    drugStatus: true,
    imageFile: null as File | null,
    imagePreview: null as string | null
  })

  const DrugStatus = [
    {
      key: 'true',
      value: t('active')
    },
    {
      key: 'false',
      value: t('inActive')
    }
  ]

  const fetchDrugs = async () => {
    setIsLoading(true)
    try {
      const result = await axiosInstance.get<ApiResponse<Drug[]>>('/drugs')
      setDrugData(result.data.data)
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
      drugForm.drugCode !== '' &&
      drugForm.drugName !== '' &&
      drugForm.imageFile !== null
    ) {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('drugCode', drugForm.drugCode)
      formData.append('drugName', drugForm.drugName)
      formData.append('upload', drugForm.imageFile)
      try {
        const result = await axiosInstance.post<ApiResponse<Drug>>(
          `/drugs`,
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
        await fetchDrugs()
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
    if (drugForm.drugCode !== '' && drugForm.drugName !== '') {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('drugCode', drugForm.drugCode)
      formData.append('drugName', drugForm.drugName)
      formData.append('drugStatus', drugForm.drugStatus.toString())

      if (drugForm.imageFile !== null) {
        formData.append('upload', drugForm.imageFile)
      }

      try {
        const result = await axiosInstance.patch<ApiResponse<Drug>>(
          `/drugs/${drugForm.id}`,
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
        await fetchDrugs()
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

  const deleteDrug = async (drugId: string) => {
    setIsLoading(true)
    try {
      const result = await axiosInstance.delete<ApiResponse<string>>(
        `/drugs/${drugId}`
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
      await fetchDrugs()
      setIsLoading(false)
    }
  }

  const openEdit = (drug: Drug) => {
    setDrugForm({
      id: drug.id,
      drugCode: drug.drugCode,
      drugName: drug.drugName,
      drugStatus: drug.drugStatus,
      imageFile: null,
      imagePreview: drug.drugImage
    })
    editModal.current?.showModal()
  }

  const resetForm = () => {
    setDrugForm({
      id: '',
      drugCode: '',
      drugName: '',
      drugStatus: true,
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
          setDrugForm({
            ...drugForm,
            imageFile: null,
            imagePreview: null
          })
        })
        return
      }

      await new Promise(resolve => setTimeout(resolve, 500))
      const reSized = await resizeImage(file)
      setDrugForm(prev => ({
        ...prev,
        imageFile: reSized,
        imagePreview: URL.createObjectURL(file)
      }))
    }
  }

  const columns: TableColumn<Drug>[] = useMemo(
    () => [
      {
        name: t('image'),
        cell: item => (
          <div className='avatar'>
            <div className='w-10 rounded'>
              <img src={import.meta.env.VITE_APP_IMG + item.drugImage} />
            </div>
          </div>
        ),
        sortable: false,
        center: true
      },
      {
        name: t('drugCode'),
        cell: item => (
          <div className='tooltip' data-tip={item.drugCode}>
            <span className='truncate w-[128px] block text-center'>
              {item.drugCode}
            </span>
          </div>
        ),
        sortable: false,
        center: true
      },
      {
        name: t('drugName'),
        cell: item => (
          <div className='tooltip' data-tip={item.drugName}>
            <span className='truncate w-[128px] block text-center'>
              {item.drugName}
            </span>
          </div>
        ),
        sortable: false,
        center: true
      },
      {
        name: t('drugStatus'),
        selector: item => (item.drugStatus ? t('active') : t('inActive')),
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
                  await deleteDrug(item.id)
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
    fetchDrugs()
  }, [])

  useEffect(() => {
    const filter = drugData.filter(
      f =>
        f.drugName.toLowerCase().includes(search.toLowerCase()) ||
        f.drugCode.toLowerCase().includes(search.toLowerCase())
    )

    setDrugFilterData(filter)
  }, [search, drugData])

  return (
    <div>
      <div className='flex items-center justify-between'>
        <span className='text-2xl font-medium'>{t('itemDrugs')}</span>
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
          <div className='tooltip tooltip-bottom' data-tip={t('addDrug')}>
            <button
              className='btn btn-primary text-base h-15 w-12 p-0 rounded-3xl'
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
          data={drugFilterData}
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
          <h3 className='font-bold text-lg'>{t('addDrug')}</h3>
          <div className='w-full'>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('image')}
              </legend>
              <div className='flex items-center justify-center'>
                <div className='relative w-45 h-45'>
                  <div className='w-full h-full rounded-full bg-base-200 flex items-center justify-center overflow-hidden'>
                    {drugForm.imagePreview ? (
                      <img
                        src={drugForm.imagePreview}
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
                {t('drugCode')}
              </legend>
              <input
                type='text'
                className='input w-full h-15 rounded-3xl'
                value={drugForm.drugCode}
                onChange={e =>
                  setDrugForm({
                    ...drugForm,
                    drugCode: e.target.value
                  })
                }
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('drugName')}
              </legend>
              <input
                type='text'
                className='input w-full h-15 rounded-3xl'
                value={drugForm.drugName}
                onChange={e =>
                  setDrugForm({
                    ...drugForm,
                    drugName: e.target.value
                  })
                }
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
          <h3 className='font-bold text-lg'>{t('addDrug')}</h3>
          <div className='w-full'>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('image')}
              </legend>
              <div className='flex items-center justify-center'>
                <div className='relative w-45 h-45'>
                  <div className='w-full h-full rounded-full bg-base-200 flex items-center justify-center overflow-hidden'>
                    {drugForm.imagePreview ? (
                      <img
                        src={
                          drugForm.imageFile === null
                            ? import.meta.env.VITE_APP_IMG +
                              drugForm.imagePreview
                            : drugForm.imagePreview
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
                {t('drugCode')}
              </legend>
              <input
                type='text'
                className='input w-full h-15 rounded-3xl'
                value={drugForm.drugCode}
                onChange={e =>
                  setDrugForm({
                    ...drugForm,
                    drugCode: e.target.value
                  })
                }
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('drugName')}
              </legend>
              <input
                type='text'
                className='input w-full h-15 rounded-3xl'
                value={drugForm.drugName}
                onChange={e =>
                  setDrugForm({
                    ...drugForm,
                    drugName: e.target.value
                  })
                }
              />
            </fieldset>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend text-sm font-medium'>
                {t('status')}
              </legend>
              <Select
                key={drugForm.drugStatus ? 'true' : 'false'}
                options={mapOptions<DrugActive, keyof DrugActive>(
                  DrugStatus,
                  'key',
                  'value'
                )}
                value={mapDefaultValue<DrugActive, keyof DrugActive>(
                  DrugStatus,
                  drugForm.drugStatus ? 'true' : 'false',
                  'key',
                  'value'
                )}
                onChange={e =>
                  setDrugForm({
                    ...drugForm,
                    drugStatus: e?.value === 'true' ? true : false
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

      <ConfirmModal ref={confirmModalRef} />
    </div>
  )
}

export default Drugs
