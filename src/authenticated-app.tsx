// packages
import { useAuth } from 'context/auth-context'
import { Routes, Route, Navigate } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'

// pages
import { ProjectListScreen } from 'screens/project-list'
import { ProjectScreen } from 'screens/project'

// components
import { Dropdown, Menu, Button } from 'antd'
import { Row } from 'components/lib'
import styled from '@emotion/styled'
import { ReactComponent as SoftwareLogo } from 'assets/software-logo.svg'

// utils
import { resetRoute } from 'utils'

export const AuthenticatedApp = () => {
  return (
    <Container>
      <PageHeader />
      <Main>
        <Router>
          <Routes>
            <Route path={'/projects'} element={<ProjectListScreen />} />
            <Route
              path={'/projects/:projectId/*'}
              element={<ProjectScreen />}
            />
            <Navigate to={'/projects'} />
          </Routes>
        </Router>
      </Main>
    </Container>
  )
}

const PageHeader = () => {
  const { logout, user } = useAuth()

  return (
    <Header>
      <HeaderLeft>
        <Button type={'link'} onClick={resetRoute}>
          <SoftwareLogo width={'18rem'} color={'rgb(38, 132, 255)'} />
        </Button>
      </HeaderLeft>
      <HeaderRight>
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
      </HeaderRight>
    </Header>
  )
}

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
