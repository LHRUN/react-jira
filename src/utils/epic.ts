import { QueryKey, useMutation, useQuery } from 'react-query'
import { useHttp } from 'require'
import { Epic } from 'types/epic'
import { useAddConfig, useDeleteConfig } from './use-optimistic-options'

/**
 * @description: 获取看板数据
 */
export const useEpics = (param?: Partial<Epic>) => {
  const client = useHttp()

  return useQuery<Epic[]>(['epics', param], () =>
    client('epics', { data: param })
  )
}

/**
 * @description: 增加看板
 * @param queryKey react-query key值
 */
export const useAddEpic = (queryKey: QueryKey) => {
  const client = useHttp()

  return useMutation(
    (params: Partial<Epic>) =>
      client(`epics`, {
        data: params,
        method: 'POST',
      }),
    useAddConfig(queryKey)
  )
}

/**
 * @description: 删除看板
 * @param queryKey react-query key值
 */
export const useDeleteEpic = (queryKey: QueryKey) => {
  const client = useHttp()

  return useMutation(
    ({ id }: { id: number }) =>
      client(`epics/${id}`, {
        method: 'DELETE',
      }),
    useDeleteConfig(queryKey)
  )
}
