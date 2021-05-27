import { useQuery } from 'react-query'
import { useHttp } from 'require'
import { TaskType } from 'types/task-type'

/**
 * @description: 获取任务状态值
 */
export const useTaskTypes = () => {
  const client = useHttp()

  return useQuery<TaskType[]>(['taskTypes'], () => client('taskTypes'))
}
