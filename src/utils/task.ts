import { QueryKey, useMutation, useQuery } from 'react-query'
import { useHttp } from 'require'
import { Task } from 'types/task'
import { useAddConfig } from './use-optimistic-options'

/**
 * @description: 获取任务列表
 */
export const useTasks = (param?: Partial<Task>) => {
  const client = useHttp()

  return useQuery<Task[]>(['tasks', param], () =>
    client('tasks', { data: param })
  )
}

/**
 * @description: 新增任务
 */
export const useAddTask = (queryKey: QueryKey) => {
  const client = useHttp()

  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks`, {
        data: params,
        method: 'POST',
      }),
    useAddConfig(queryKey)
  )
}

/**
 * @description: 获取单个任务
 */
export const useTask = (id?: number) => {
  const client = useHttp()
  return useQuery<Task>(['task', { id }], () => client(`tasks/${id}`), {
    enabled: Boolean(id),
  })
}
