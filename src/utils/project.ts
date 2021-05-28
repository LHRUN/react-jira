import {
  useEditConfig,
  useAddConfig,
  useDeleteConfig,
} from './use-optimistic-options'
import { QueryKey, useMutation, useQuery } from 'react-query'
import { useHttp } from 'require'
import { Project } from 'types/project'

/**
 * @description: 获取项目列表
 */
export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp()

  return useQuery<Project[], Error>(['projects', param], () =>
    client('projects', { data: param })
  )
}

/**
 * @description: 编辑项目
 * @param queryKey react-query key值
 */
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

/**
 * @description: 新增项目
 * @param queryKey react-query key值
 */
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

/**
 * @description: 删除项目
 * @param queryKey react-query key值
 */
export const useDeleteProject = (queryKey: QueryKey) => {
  const client = useHttp()

  return useMutation(
    ({ id }: { id: number }) =>
      client(`projects/${id}`, {
        method: 'DELETE',
      }),
    useDeleteConfig(queryKey)
  )
}

/**
 * @description: 获取单个项目
 * @param id 项目id
 */
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
