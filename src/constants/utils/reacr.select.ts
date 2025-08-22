type Option = {
  value: string
  label: string
}

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
  id: string,
  valueKey: K,
  labelKey: K
): Option | undefined =>
  data
    .filter(item => item[valueKey] === id)
    .map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))[0]

export { mapDefaultValue, mapOptions }
