// packages
import React, { useState } from 'react'

// components
import { Container } from './kanban-column'
import { Input } from 'antd'

// utils
import { useAddKanban } from 'utils/kanban'
import { useKanbanQueryKey, useProjectIdInUrl } from './util'

export const CreateKanban = () => {
  const [name, setName] = useState('')
  const projectId = useProjectIdInUrl()
  const { mutateAsync: addKanban } = useAddKanban(useKanbanQueryKey())

  const submit = async () => {
    await addKanban({ name, projectId })
    setName('')
  }

  return (
    <Container>
      <Input
        size={'large'}
        placeholder={'新建看板名称'}
        onPressEnter={submit}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
    </Container>
  )
}
