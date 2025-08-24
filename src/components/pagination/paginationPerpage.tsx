import Select, { SingleValue } from 'react-select'
import { useTranslation } from 'react-i18next'

type Option = {
  value: string
  label: string
}

interface PaginationPerpageProps {
  perPage: number[]
  value: number
  handlePerPageChange: (event: SingleValue<Option>) => void
}

interface PiginationParpageType {
  number: number
}

const PaginationPerpage = (props: PaginationPerpageProps) => {
  const { t } = useTranslation()
  const { perPage, handlePerPageChange, value } = props

  const mapOptions = <T, K extends keyof T>(
    data: T[],
    valueKey: K,
    labelKey: K
  ): Option[] =>
    data.map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))

  const mapDefaultValue = <T, K extends keyof T>(
    data: T[],
    value: T[K],
    valueKey: K
  ): Option | undefined =>
    data
      .filter(item => item[valueKey] === value)
      .map(item => ({
        value: item[valueKey] as unknown as string,
        label: item[valueKey] as unknown as string
      }))[0]

  const perPageOptions: PiginationParpageType[] = perPage.map(item => ({
    number: item
  }))

  return (
    <Select
      menuPlacement='top'
      options={mapOptions<PiginationParpageType, keyof PiginationParpageType>(
        perPageOptions,
        'number',
        'number'
      )}
      value={mapDefaultValue<
        PiginationParpageType,
        keyof PiginationParpageType
      >(perPageOptions, value, 'number')}
      onChange={handlePerPageChange}
      autoFocus={false}
      placeholder={t('selectValue')}
      className='react-select-container z-[75] w-auto'
      classNamePrefix='react-select'
    />
  )
}

export default PaginationPerpage
