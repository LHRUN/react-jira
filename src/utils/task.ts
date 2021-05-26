import { useQuery } from 'react-query'
import { useHttp } from 'require'
import { Task } from 'types/task'

export const useTasks = (param?: Partial<Task>) => {
  const client = useHttp()

  return useQuery<Task[]>(['tasks', param], () =>
    client('tasks', { data: param })
  )
}
