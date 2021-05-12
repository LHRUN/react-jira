import { User } from 'screens/project-list/search-panel'
import { useHttp } from 'require'
import { useMount } from 'utils'
import { useAsync } from './use-async'

export const useUsers = () => {
  const { run, ...result } = useAsync<User[]>()
  const client = useHttp()

  useMount(() => {
    run(client('users'))
  })

  return result
}
