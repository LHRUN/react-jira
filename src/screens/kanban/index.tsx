// packages
import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

// components
import { Spin } from 'antd'
import { ScreenContainer } from 'components/lib'
import { CreateKanban } from './create-kanban'
import { KanbanColumn } from './kanban-column'
import { SearchPanel } from './search-panel'
import { Drag, Drop, DropChild } from 'components/drag-and-drop'
import { TaskModal } from './task-modal'

// utils
import { useDocumentTitle } from 'utils'
import { useKanbans, useReorderKanban } from 'utils/kanban'
import { useReorderTask, useTasks } from 'utils/task'
import {
  useKanbanQueryKey,
  useKanbanSearchParams,
  useProjectInUrl,
  useTasksQueryKey,
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
  const onDragEnd = useDragEnd()

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
              <DropChild style={{ display: 'flex' }}>
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
            </Drop>
            <CreateKanban />
          </ColumnsContainer>
        )}
        <TaskModal />
      </ScreenContainer>
    </DragDropContext>
  )
}

/**
 * 拖拽结束触发函数
 */
export const useDragEnd = () => {
  const { data: kanbans } = useKanbans(useKanbanSearchParams())
  const { mutate: reorderKanban } = useReorderKanban(useKanbanQueryKey())
  const { data: allTask = [] } = useTasks(useTasksSearchParams())
  const { mutate: reorderTask } = useReorderTask(useTasksQueryKey())

  return useCallback(
    ({ source, destination, type }: DropResult) => {
      if (!destination) {
        return
      }

      if (type === 'COLUMN') {
        const fromId = kanbans?.[source.index].id
        const toId = kanbans?.[destination.index].id
        if (!fromId || !toId || fromId === toId) {
          return
        }
        const type = destination.index > source.index ? 'after' : 'before'
        reorderKanban({ fromId, referenceId: toId, type })
      }
      if (type === 'ROW') {
        const fromKanbanId = +source.droppableId
        const toKanbanId = +destination.droppableId
        const fromTask = allTask.filter(
          (task) => task.kanbanId === fromKanbanId
        )[source.index]
        const toTask = allTask.filter((task) => task.kanbanId === toKanbanId)[
          destination.index
        ]
        if (fromTask?.id === toTask?.id) {
          return
        }
        reorderTask({
          fromId: fromTask?.id,
          referenceId: toTask?.id,
          fromKanbanId,
          toKanbanId,
          type:
            fromKanbanId === toKanbanId && destination.index > source.index
              ? 'after'
              : 'before',
        })
      }
    },
    [allTask, kanbans, reorderKanban, reorderTask]
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
