import { useQuery } from 'react-query'
import { useHttp } from 'require'
import { Kanban } from 'types/kanban'

export const useKanbans = (param?: Partial<Kanban>) => {
  const client = useHttp()

  return useQuery<Kanban[]>(['kanbans', param], () =>
    client('kanbans', { data: param })
  )
}
