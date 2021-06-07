import { useProjectIdInUrl } from 'screens/kanban/util'

export const useEpicSearchParams = () => ({ projectId: useProjectIdInUrl() })
export const useEpicQueryKey = () => ['epics', useEpicSearchParams()]
