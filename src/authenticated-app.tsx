// packages
import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import styled from '@emotion/styled'

// pages
import { ProjectListScreen } from 'screens/project-list'
import { ProjectScreen } from 'screens/project'

// components
import { Dropdown, Menu, Button } from 'antd'
import { Row, ButtonNoPadding } from 'components/lib'
import { ReactComponent as SoftwareLogo } from 'assets/software-logo.svg'

// context
import { useAuth } from 'context/auth-context'

// utils
import { resetRoute } from 'utils'
import { ProjectModal } from 'screens/project-list/project-modal'
import { ProjectPopover } from 'components/project-popover'

export const AuthenticatedApp = () => {
  const [projectModalOpen, setProjectModalOpen] = useState(false)

  return (
    <Container>
      <PageHeader setProjectModalOpen={setProjectModalOpen} />
      <button onClick={() => setProjectModalOpen(true)}>dakai</button>
      <Main>
        <Router>
          <Routes>
            <Route
              path={'/projects'}
              element={
                <ProjectListScreen setProjectModalOpen={setProjectModalOpen} />
              }
            />
            <Route
              path={'/projects/:projectId/*'}
              element={<ProjectScreen />}
            />
            <Navigate to={'/projects'} />
          </Routes>
        </Router>
      </Main>
      <ProjectModal
        projectModalOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
      />
    </Container>
  )
}

const PageHeader = (props: {
  setProjectModalOpen: (isOpen: boolean) => void
}) => {
  return (
    <Header>
      <HeaderLeft>
        <ButtonNoPadding type={'link'} onClick={resetRoute}>
          <SoftwareLogo width={'18rem'} color={'rgb(38, 132, 255)'} />
        </ButtonNoPadding>
        <ProjectPopover setProjectModalOpen={props.setProjectModalOpen} />
      </HeaderLeft>
      <HeaderRight>
        <User />
      </HeaderRight>
    </Header>
  )
}

const User = () => {
  const { logout, user } = useAuth()

  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key={'logout'}>
            <Button type={'link'} onClick={logout}>
              登出
            </Button>
          </Menu.Item>
        </Menu>
      }
    >
      <Button type={'link'} onClick={(e) => e.preventDefault()}>
        Hi, {user?.name}
      </Button>
    </Dropdown>
  )
}

// temporal dead zone(暂时性死区)
const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100vh;
`

const Header = styled(Row)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`

const HeaderLeft = styled(Row)``
const HeaderRight = styled.div``

const Main = styled.main`
  height: calc(100vh - 6rem);
`
