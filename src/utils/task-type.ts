import { useQuery } from 'react-query'
import { useHttp } from 'require'
import { TaskType } from 'types/task-type'

export const useTaskTypes = () => {
  const client = useHttp()

  return useQuery<TaskType[]>(['taskTypes'], () => client('taskTypes'))
}
