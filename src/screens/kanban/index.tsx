// packages
import React from 'react'
import styled from '@emotion/styled'
import { DragDropContext } from 'react-beautiful-dnd'

// components
import { Spin } from 'antd'
import { ScreenContainer } from 'components/lib'
import { CreateKanban } from './create-kanban'
import { KanbanColumn } from './kanban-column'
import { SearchPanel } from './search-panel'
import { Drag, Drop, DropChild } from 'components/drag-and-drop'

// utils
import { useDocumentTitle } from 'utils'
import { useKanbans } from 'utils/kanban'
import { useTasks } from 'utils/task'
import {
  useKanbanSearchParams,
  useProjectInUrl,
  useTasksSearchParams,
} from './util'
import { TaskModal } from './task-modal'

export const KanBanScreen = () => {
  useDocumentTitle('看板列表')
  const { data: currentProject } = useProjectInUrl()
  const { data: kanbans, isLoading: kanbanIsLoading } = useKanbans(
    useKanbanSearchParams()
  )
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams())
  const isLoading = taskIsLoading || kanbanIsLoading

  return (
    <DragDropContext onDragEnd={() => {}}>
      <ScreenContainer>
        <h1>{currentProject?.name}看板</h1>
        <SearchPanel />
        {isLoading ? (
          <Spin size={'large'} />
        ) : (
          <ColumnsContainer>
            <Drop
              type={'COLUMN'}
              direction={'horizontal'}
              droppableId={'kanban'}
            >
              <DropChild>
                {kanbans?.map((kanban, index) => (
                  <Drag
                    key={kanban.id}
                    draggableId={'kanban' + kanban.id}
                    index={index}
                  >
                    <KanbanColumn kanban={kanban} key={index} />
                  </Drag>
                ))}
              </DropChild>
              <CreateKanban />
            </Drop>
          </ColumnsContainer>
        )}
        <TaskModal />
      </ScreenContainer>
    </DragDropContext>
  )
}

export const ColumnsContainer = styled('div')`
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
