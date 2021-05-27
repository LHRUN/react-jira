import { User } from 'types/user'
import { useHttp } from 'require'
import { useMount } from 'utils'
import { useAsync } from './use-async'

/**
 * @description: 获取负责人数组
 */
export const useUsers = () => {
  const { run, ...result } = useAsync<User[]>()
  const client = useHttp()

  useMount(() => {
    run(client('users'))
  })

  return result
}
