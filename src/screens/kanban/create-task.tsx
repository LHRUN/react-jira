// packages
import React, { useEffect, useState } from 'react'

// components
import { Card, Input } from 'antd'

// utils
import { useAddTask } from 'utils/task'
import { useProjectIdInUrl, useTasksQueryKey } from './util'

export const CreateTask = ({ kanbanId }: { kanbanId: number }) => {
  const [name, setName] = useState('')
  const { mutateAsync: addTask } = useAddTask(useTasksQueryKey())

  const projectId = useProjectIdInUrl()
  const [inputMode, setInputMode] = useState(false)

  const submit = async () => {
    await addTask({ name, projectId, kanbanId })
    setInputMode(false)
    setName('')
  }

  const toggle = () => setInputMode(!inputMode)

  useEffect(() => {
    if (!inputMode) {
      setName('')
    }
  }, [inputMode])

  if (!inputMode) {
    return <div onClick={toggle}>+创建事务</div>
  }

  return (
    <Card>
      <Input
        onBlur={toggle}
        placeholder={'需要做些什么'}
        autoFocus={true}
        onPressEnter={submit}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
    </Card>
  )
}
