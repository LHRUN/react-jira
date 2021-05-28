import { QueryKey, useMutation, useQuery } from 'react-query'
import { useHttp } from 'require'
import { Kanban } from 'types/kanban'
import { useAddConfig, useDeleteConfig } from './use-optimistic-options'

/**
 * @description: 获取看板数据
 */
export const useKanbans = (param?: Partial<Kanban>) => {
  const client = useHttp()

  return useQuery<Kanban[]>(['kanbans', param], () =>
    client('kanbans', { data: param })
  )
}

/**
 * @description: 增加看板
 * @param queryKey react-query key值
 */
export const useAddKanban = (queryKey: QueryKey) => {
  const client = useHttp()

  return useMutation(
    (params: Partial<Kanban>) =>
      client(`kanbans`, {
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
export const useDeleteKanban = (queryKey: QueryKey) => {
  const client = useHttp()

  return useMutation(
    ({ id }: { id: number }) =>
      client(`kanbans/${id}`, {
        method: 'DELETE',
      }),
    useDeleteConfig(queryKey)
  )
}
