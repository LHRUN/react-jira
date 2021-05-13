import { useState } from 'react'

interface State<D> {
  error: Error | null
  data: D | null
  status: 'idle' | 'loading' | 'error' | 'success'
}

const defaultInitialState: State<null> = {
  error: null,
  data: null,
  status: 'idle',
}

const defaultConfig = {
  thorwOnError: false,
}

export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  const config = { ...defaultConfig, ...initialConfig }
  const [state, setState] = useState({
    ...defaultInitialState,
    ...initialState,
  })

  const setData = (data: D) =>
    setState({
      data,
      status: 'success',
      error: null,
    })

  const setError = (error: Error) =>
    setState({
      error,
      status: 'error',
      data: null,
    })

  const run = (promise: Promise<D>) => {
    if (!promise || !promise.then) {
      throw new Error('请传入Promise类型数据')
    }
    setState({ ...state, status: 'loading' })
    return promise
      .then((data) => {
        setData(data)
        return data
      })
      .catch((error) => {
        setError(error)
        if (config.thorwOnError) return Promise.reject(error)
        return error
      })
  }

  return {
    isIdle: state.status === 'idle',
    isLoading: state.status === 'loading',
    isError: state.status === 'error',
    isSuccess: state.status === 'success',
    run,
    setData,
    setError,
    ...state,
  }
}
