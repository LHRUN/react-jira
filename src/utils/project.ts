import { useCallback, useEffect } from 'react'
import { useHttp } from 'require'
import { Project } from 'screens/project-list/list'
import { cleanObject } from 'utils'
import { useAsync } from './use-async'

export const useProjects = (param?: Partial<Project>) => {
  const { run, ...result } = useAsync<Project[]>()
  const client = useHttp()

  const fetchProjects = useCallback(
    () => client('projects', { data: cleanObject(param || {}) }),
    [client, param]
  )

  useEffect(() => {
    run(fetchProjects(), {
      retry: fetchProjects,
    })
  }, [fetchProjects, param, run])

  return result
}

export const useEditProject = () => {
  const { run, ...asyncResult } = useAsync()
  const client = useHttp()
  const mutate = (params: Partial<Project>) => {
    return run(
      client(`projects/${params.id}`, {
        data: params,
        method: 'PATCH',
      })
    )
  }

  return {
    mutate,
    ...asyncResult,
  }
}

export const useAddProject = () => {
  const { run, ...asyncResult } = useAsync()
  const client = useHttp()
  const mutate = (params: Partial<Project>) => {
    run(
      client(`projects/${params.id}`, {
        data: params,
        method: 'POST',
      })
    )
  }

  return {
    mutate,
    ...asyncResult,
  }
}
