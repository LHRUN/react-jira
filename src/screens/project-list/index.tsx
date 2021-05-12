import React from 'react'
import { useEffect, useState } from 'react'

import { SearchPanel } from './search-panel'
import { List } from './list'

import { cleanObject, useMount, useDebounce } from 'utils/index'
import { useHttp } from 'require'

export const ProjectListScreen = () => {
  const [param, setParam] = useState({
    name: '',
    personId: '',
  })
  const debounceParam = useDebounce(param, 200)
  const [users, setUsers] = useState([])
  const [list, setList] = useState([])
  const client = useHttp()

  useEffect(() => {
    client('projects', { data: cleanObject(debounceParam) }).then(setList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceParam])

  useMount(() => {
    client('users').then(setUsers)
  })

  return (
    <div>
      <SearchPanel users={users} param={param} setParam={setParam} />
      <List users={users} list={list} />
    </div>
  )
}
