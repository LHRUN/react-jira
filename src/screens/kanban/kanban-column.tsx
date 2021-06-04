// pakcages
import React from 'react'
import styled from '@emotion/styled'

// components
import { Button, Card, Dropdown, Menu, Modal } from 'antd'
import { CreateTask } from './create-task'
import taskIcon from 'assets/task.svg'
import bugIcon from 'assets/bug.svg'

// utils
import { useTasks } from 'utils/task'
import { useKanbanQueryKey, useTasksModal, useTasksSearchParams } from './util'
import { useTaskTypes } from 'utils/task-type'

// interface
import { Kanban } from 'types/kanban'
import { Task } from 'types/task'
import { Mark } from 'components/mark'
import { useDeleteKanban } from 'utils/kanban'
import { Row } from 'components/lib'

/**
 * @description: 任务状态icon
 */
const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes()
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name

  if (!name) {
    return null
  }

  return <img src={name === 'task' ? taskIcon : bugIcon} alt="icon" />
}

/**
 * @description: 任务卡片
 */
const TaskCard = ({ task }: { task: Task }) => {
  const { startEdit } = useTasksModal()
  const { name: keyword } = useTasksSearchParams()

  return (
    <Card
      onClick={() => startEdit(task.id)}
      style={{ marginBottom: '0.5rem' }}
      key={task.id}
    >
      <p>
        <Mark name={task.name} keyword={keyword} />
      </p>
      <TaskTypeIcon id={task.typeId} />
    </Card>
  )
}

/**
 * @description: 右上角更多选项
 */
const More = ({ kanban }: { kanban: Kanban }) => {
  const { mutateAsync } = useDeleteKanban(useKanbanQueryKey())
  const startDelete = () => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确定删除看板吗',
      onOk() {
        mutateAsync({ id: kanban.id })
      },
    })
  }

  const overlay = (
    <Menu>
      <Menu.Item>
        <Button type={'link'} onClick={startDelete}>
          删除
        </Button>
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={overlay}>
      <Button type={'link'}>...</Button>
    </Dropdown>
  )
}

export const KanbanColumn = React.forwardRef<
  HTMLDivElement,
  { kanban: Kanban }
>(({ kanban, ...props }, ref) => {
  const { data: allTasks } = useTasks(useTasksSearchParams())
  const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id)

  return (
    <Container {...props} ref={ref}>
      <Row between={true}>
        <h3>{kanban.name}</h3>
        <More kanban={kanban} key={kanban.id}></More>
      </Row>
      <TasksContainer>
        {tasks?.map((task, index) => (
          <TaskCard key={task.id} task={task} />
        ))}
        <CreateTask kanbanId={kanban.id} />
      </TasksContainer>
    </Container>
  )
})

export const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 2rem;
`
const TasksContainer = styled.div`
  overflow: scroll;
  flex: 1;
  ::-webkit-scrollbar {
    display: none;
  }
`
