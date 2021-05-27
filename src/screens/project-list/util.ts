import { useMemo } from 'react'
import { useProject } from 'utils/project'
import { useSetUrlSearchParam, useUrlQueryParam } from 'utils/url'

/**
 * @description: 生成项目搜索所需url参数{数据 && 修改函数}
 */
export const useProjectsSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(['name', 'personId'])
  return [
    useMemo(
      () => ({ ...param, personId: Number(param.personId) || undefined }),
      [param]
    ),
    setParam,
  ] as const
}

/**
 * @description: 生成项目编辑与新增所需参数
 */
export const useProjectsQueryKey = () => {
  const [params] = useProjectsSearchParams()
  return ['projects', params]
}

/**
 * @description: 创建编辑项目modal
 * @returns {
 *  projectModalOpen: Modal开启状态
 *  startCreate：开启创建项目modal
 *  startEdit：开启编辑项目modal
 *  close：关闭项目modal
 *  editingProject：获取编辑项目对象
 *  isLoading：loading状态
 * }
 */
export const useProjectModal = () => {
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    'projectCreate',
  ])
  const [{ editingProjectId }, setEditingProjectId] = useUrlQueryParam([
    'editingProjectId',
  ])
  const setUrlParams = useSetUrlSearchParam()

  const { data: editingProject, isLoading } = useProject(
    Number(editingProjectId)
  )

  const startCreate = () => setProjectCreate({ projectCreate: true })
  const close = () => setUrlParams({ projectCreate: '', editingProjectId: '' })

  const startEdit = (id: number) =>
    setEditingProjectId({ editingProjectId: id })

  return {
    projectModalOpen: projectCreate === 'true' || Boolean(editingProjectId),
    startCreate,
    startEdit,
    close,
    editingProject,
    isLoading,
  }
}
