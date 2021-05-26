import {
  useEditConfig,
  useAddConfig,
  useDeleteConfig,
} from './use-optimistic-options'
import { QueryKey, useMutation, useQuery } from 'react-query'
import { useHttp } from 'require'
import { Project } from 'types/project'

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp()

  return useQuery<Project[], Error>(['projects', param], () =>
    client('projects', { data: param })
  )
}

export const useEditProject = (queryKey: QueryKey) => {
  const client = useHttp()

  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        data: params,
        method: 'PATCH',
      }),
    useEditConfig(queryKey)
  )
}

export const useAddProject = (queryKey: QueryKey) => {
  const client = useHttp()

  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        data: params,
        method: 'POST',
      }),
    useAddConfig(queryKey)
  )
}

export const useDeleteProject = (queryKey: QueryKey) => {
  const client = useHttp()

  return useMutation(
    (id: number) =>
      client(`projects/${id}`, {
        method: 'DELETE',
      }),
    useDeleteConfig(queryKey)
  )
}

export const useProject = (id?: number) => {
  const client = useHttp()
  return useQuery<Project>(
    ['project', { id }],
    () => client(`projects/${id}`),
    {
      enabled: Boolean(id),
    }
  )
}
