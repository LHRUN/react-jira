// packages
import React from 'react'
import styled from '@emotion/styled'

// components
import { Button } from 'antd'
import { ErrorBox, Row } from 'components/lib'
import { SearchPanel } from './search-panel'
import { List } from './list'

// utils
import { useDebounce, useDocumentTitle } from 'utils/index'
import { useProjects } from 'utils/project'
import { useUsers } from 'utils/user'
import { useProjectModal, useProjectsSearchParams } from './util'

export const ProjectListScreen = () => {
  const { startCreate } = useProjectModal()
  useDocumentTitle('项目列表', false)

  const [param, setParam] = useProjectsSearchParams()
  const { isLoading, error, data: list } = useProjects(useDebounce(param, 200))
  const { data: users } = useUsers()

  return (
    <Container>
      <Row between={true}>
        <h1>项目列表</h1>
        <Button onClick={startCreate}>创建项目</Button>
      </Row>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      <ErrorBox error={error} />
      <List loading={isLoading} users={users || []} dataSource={list || []} />
    </Container>
  )
}

ProjectListScreen.whyDidYouRender = false

const Container = styled.div`
  padding: 3.2rem;
`
