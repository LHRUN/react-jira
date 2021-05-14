import React from 'react'

import { SearchPanel } from './search-panel'
import { List } from './list'

import { useDebounce, useDocumentTitle } from 'utils/index'
import styled from '@emotion/styled'
import { Typography } from 'antd'
import { useProjects } from 'utils/project'
import { useUsers } from 'utils/user'
import { useUrlQueryParam } from 'utils/url'

export const ProjectListScreen = () => {
  const [param, setParam] = useUrlQueryParam(['name', 'personId'])
  const debounceParam = useDebounce(param, 200)
  const { isLoading, error, data: list } = useProjects(debounceParam)
  const { data: users } = useUsers()

  useDocumentTitle('项目列表', false)

  return (
    <Container>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      {error ? (
        <Typography.Text type={'danger'}>{error.message}</Typography.Text>
      ) : null}
      <List loading={isLoading} users={users || []} dataSource={list || []} />
    </Container>
  )
}

ProjectListScreen.whyDidYouRender = true

const Container = styled.div`
  padding: 3.2rem;
`
