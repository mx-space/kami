export const shuffle = <T>(arr: T[]): T[] => {
  const newArr = [...arr]
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}

export const isNumber = (value: unknown): value is number =>
  typeof value === 'number'
export const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i)

export const uniqueId = (prefix = ''): string =>
  `${prefix}${Math.random().toString(36).substr(2, 9)}`

export const omit = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[] | K,
): Omit<T, K> => {
  const newObj = { ...obj }
  keys = Array.isArray(keys) ? keys : [keys]
  keys.forEach((key) => {
    delete newObj[key]
  })
  return newObj
}

export const sample = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]

export const uniqWith = <T>(arr: T[], comparator: (a: T, b: T) => boolean) =>
  arr.reduce<T[]>((acc, cur) => {
    const hasSame = acc.some((item) => comparator(item, cur))
    return hasSame ? acc : [...acc, cur]
  }, [])

export const isEqualObject = (a: unknown, b: unknown): boolean => {
  if (typeof a !== 'object' || typeof b !== 'object') {
    return false
  }
  if (a === null || b === null) {
    return false
  }
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every((key) => {
    return isEqualObject(a[key], b[key])
  })
}

export const uniqBy = <T>(arr: T[], key: keyof T): T[] =>
  arr.reduce<T[]>((acc, cur) => {
    const hasSame = acc.some((item) => item[key] === cur[key])
    return hasSame ? acc : [...acc, cur]
  }, [])

export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> => {
  const newObj = {} as Pick<T, K>
  keys.forEach((key) => {
    newObj[key] = obj[key]
  })
  return newObj
}

export const isUndefined = (value: unknown): value is undefined =>
  typeof value === 'undefined'

export const cloneDeep = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))
