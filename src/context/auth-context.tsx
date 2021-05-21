import React, { ReactNode, useCallback } from 'react'
import * as auth from 'auth-provider'
import { User } from 'screens/project-list/search-panel'
import { http } from 'require'
import { useMount } from 'utils'
import { useAsync } from 'utils/use-async'
import { FullPageErrorFallback, FullPageLoading } from 'components/lib'
import * as authStore from 'store/auth.slice'
import { useDispatch, useSelector } from 'react-redux'

interface AuthForm {
  username: string
  password: string
}

export const bootstrapUser = async () => {
  let user = null
  const token = auth.getToken()
  if (token) {
    const data = await http('me', { token })
    user = data.user
  }
  return user
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { error, isLoading, isIdle, isError, run } = useAsync<User | null>()
  const dispatch: (...args: unknown[]) => Promise<User> = useDispatch()
  useMount(() => {
    run(dispatch(authStore.bootstrap()))
  })

  if (isIdle || isLoading) {
    return <FullPageLoading></FullPageLoading>
  }

  if (isError) {
    return <FullPageErrorFallback error={error}></FullPageErrorFallback>
  }

  return <div>{children}</div>
}

export const useAuth = () => {
  const dispatch: (...args: unknown[]) => Promise<User> = useDispatch()
  const user = useSelector(authStore.selectUser)
  const login = useCallback(
    (form: AuthForm) => dispatch(authStore.login(form)),
    [dispatch]
  )
  const register = useCallback(
    (form: AuthForm) => dispatch(authStore.register(form)),
    [dispatch]
  )
  const logout = useCallback(() => dispatch(authStore.logout()), [dispatch])

  return {
    user,
    login,
    register,
    logout,
  }
}
