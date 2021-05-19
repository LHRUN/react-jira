import { useCallback, useState } from 'react'
import { useMounteRef } from 'utils'

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
  thorwOnError: false, // 是否抛出错误
}

/**
 * @description: 异步请求
 * @param initialState 初始化数据
 * @param initialConfig 初始化配置
 */
export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  const config = { ...defaultConfig, ...initialConfig }
  const [state, setState] = useState({
    ...defaultInitialState,
    ...initialState,
  })

  const mounteRef = useMounteRef()

  // useState直接传入函数的定义是：惰性初始化；所以要用useState保存函数，不能直接传入函数
  const [retry, setRetry] = useState(() => () => {})

  const setData = useCallback(
    (data: D) =>
      setState({
        data,
        status: 'success',
        error: null,
      }),
    []
  )

  const setError = useCallback(
    (error: Error) =>
      setState({
        error,
        status: 'error',
        data: null,
      }),
    []
  )

  // 触发异步请求
  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      if (!promise || !promise.then) {
        throw new Error('请传入Promise类型数据')
      }
      setRetry(() => () => {
        if (runConfig?.retry) {
          run(runConfig?.retry(), runConfig)
        }
      })
      setState((prevState) => ({ ...prevState, status: 'loading' }))
      return promise
        .then((data) => {
          if (mounteRef.current) {
            setData(data)
          }
          return data
        })
        .catch((error) => {
          // catch会消化异常，如果不主动抛出，外面是接收不到异常的
          setError(error)
          if (config.thorwOnError) return Promise.reject(error)
          return error
        })
    },
    [config.thorwOnError, mounteRef, setData, setError]
  )

  return {
    isIdle: state.status === 'idle',
    isLoading: state.status === 'loading',
    isError: state.status === 'error',
    isSuccess: state.status === 'success',
    run,
    setData,
    setError,
    retry,
    ...state,
  }
}
