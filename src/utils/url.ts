import { cleanObject } from 'utils'
import { useMemo, useState } from 'react'
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom'

/**
 * @description: 实时编辑url参数
 * @returns [参数对象, 修改参数函数]
 */
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams] = useSearchParams()
  const setSearchParam = useSetUrlSearchParam()
  const [stateKeys] = useState(keys)

  return [
    useMemo(
      () =>
        stateKeys.reduce((prev, key: K) => {
          return { ...prev, [key]: searchParams.get(key) || '' }
        }, {} as { [key in K]: string }),
      [searchParams, stateKeys]
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      return setSearchParam(params)
    },
  ] as const
}

/**
 * @description: 返回修改url参数函数
 */
export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParam] = useSearchParams()
  return (params: { [key in string]: unknown }) => {
    const o = cleanObject({
      ...Object.fromEntries(searchParams),
      ...params,
    }) as URLSearchParamsInit
    return setSearchParam(o)
  }
}
