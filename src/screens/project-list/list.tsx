// packages
import React from 'react'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

// components
import { Dropdown, Menu, Table, TableProps } from 'antd'
import { ButtonNoPadding } from 'components/lib'
import { Pin } from 'components/pin'

// utils
import { useDeleteProject, useEditProject } from 'utils/project'
import { useProjectModal, useProjectsQueryKey } from './util'

// types
import { User } from 'types/user'
import { Modal } from 'antd'
import { Project } from 'types/project'

interface ListProps extends TableProps<Project> {
  users: User[]
}

export const List = ({ users, ...props }: ListProps) => {
  const { mutate } = useEditProject(useProjectsQueryKey())
  const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin })

  return (
    <Table
      rowKey={'id'}
      pagination={false}
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(_value, project) {
            return (
              <Pin
                checked={project.pin}
                onCheckedChange={pinProject(project.id)}
              />
            )
          },
        },
        {
          title: '名称',
          sorter: (a, b) => a.name.localeCompare(b.name),
          render(_value, project) {
            return <Link to={String(project.id)}>{project.name}</Link>
          },
        },
        {
          title: '部门',
          dataIndex: 'organization',
        },
        {
          title: '负责人',
          render(value, project) {
            return (
              <span>
                {users.find((user) => user.id === project.personId)?.name}
              </span>
            )
          },
        },
        {
          title: '创建时间',
          render(value, project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format('YYYY-MM-DD')
                  : '无'}
              </span>
            )
          },
        },
        {
          render(value, project) {
            return <More project={project} />
          },
        },
      ]}
      {...props}
    ></Table>
  )
}

const More = ({ project }: { project: Project }) => {
  const { startEdit } = useProjectModal()
  const { mutate } = useDeleteProject(useProjectsQueryKey())
  const editProject = (id: number) => () => startEdit(id)
  const confirmDeleteProject = (id: number) => {
    Modal.confirm({
      title: '确定删除这个项目吗?',
      content: '点击确定删除',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        mutate({ id })
      },
    })
  }

  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key={'edit'}>
            <ButtonNoPadding type={'link'} onClick={editProject(project.id)}>
              编辑
            </ButtonNoPadding>
          </Menu.Item>
          <Menu.Item key={'delete'}>
            <ButtonNoPadding
              onClick={() => confirmDeleteProject(project.id)}
              type={'link'}
            >
              删除
            </ButtonNoPadding>
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type={'link'}>...</ButtonNoPadding>
    </Dropdown>
  )
}
