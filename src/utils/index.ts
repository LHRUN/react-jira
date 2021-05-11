import { useEffect, useState } from 'react'

export const isFalsy = (value: unknown): boolean =>
  value === 0 ? false : !value

export const cleanObject = (obj: any) => {
  const result = { ...obj }
  Object.keys(result).forEach((key) => {
    const value = result[key]
    if (isFalsy(value)) {
      delete result[key]
    }
  })

  return result
}

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export const useDebounce = <V>(value: V, delay?: number): V => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debouncedValue
}
