import { QueryKey, useMutation, useQuery } from 'react-query'
import { useHttp } from 'require'
import { Kanban } from 'types/kanban'
import { useAddConfig } from './use-optimistic-options'

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
