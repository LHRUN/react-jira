// packages
import React from 'react'
import styled from '@emotion/styled'

// components
import { Spin } from 'antd'
import { ScreenContainer } from 'components/lib'
import { CreateKanban } from './create-kanban'
import { KanbanColumn } from './kanban-column'
import { SearchPanel } from './search-panel'

// utils
import { useDocumentTitle } from 'utils'
import { useKanbans } from 'utils/kanban'
import { useTasks } from 'utils/task'
import {
  useKanbanSearchParams,
  useProjectInUrl,
  useTasksSearchParams,
} from './util'

export const KanBanScreen = () => {
  useDocumentTitle('看板列表')
  const { data: currentProject } = useProjectInUrl()
  const { data: kanbans, isLoading: kanbanIsLoading } = useKanbans(
    useKanbanSearchParams()
  )
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams())
  const isLoading = taskIsLoading || kanbanIsLoading

  return (
    <ScreenContainer>
      <h1>{currentProject?.name}看板</h1>
      <SearchPanel />
      {isLoading ? (
        <Spin size={'large'} />
      ) : (
        <ColumnsContainer>
          {kanbans?.map((kanban) => (
            <KanbanColumn kanban={kanban} key={kanban.id} />
          ))}
          <CreateKanban />
        </ColumnsContainer>
      )}
    </ScreenContainer>
  )
}

export const ColumnsContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: scroll;

  ::-webkit-scrollbar {
    height: 6px;
    background-color: #fff;
  }

  ::-webkit-scrollbar-thumb {
    height: 6px;
    background-color: #e6e6e6;
  }

  scrollbar-width: thin;
`
