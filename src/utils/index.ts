import { useEffect, useRef, useState } from 'react'

export const isFalsy = (value: unknown): boolean =>
  value === 0 ? false : !value

/**
 * @description: 判断是否为空
 */
export const isVoid = (value: unknown) =>
  value === undefined || value === null || value === ''

/**
 * @description: 对象清除值为空的key
 */
export const cleanObject = (obj: { [key: string]: unknown }) => {
  const result = { ...obj }
  Object.keys(result).forEach((key) => {
    const value = result[key]
    if (isVoid(value)) {
      delete result[key]
    }
  })

  return result
}

/**
 * @description: 仿mount生命周期
 */
export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/**
 * @description: Debounce hook
 * @param value
 * @param delay 间隔时间
 */
export const useDebounce = <V>(value: V, delay?: number): V => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debouncedValue
}

/**
 * @description: 替换页面标题
 * @param title 页面标题
 * @param keepOnUnmount 是否回退历史标题
 */
export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true
) => {
  const oldTitle = useRef(document.title).current

  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = oldTitle
      }
    }
  }, [keepOnUnmount, oldTitle])
}

/**
 * @description: 回退首页
 */
export const resetRoute = () => (window.location.href = window.location.origin)
