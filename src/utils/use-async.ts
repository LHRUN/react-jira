import { useCallback, useReducer, useState } from 'react'
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
 * @description: 判断dispatch改变数据时是否安全
 */
const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
  const mountedRef = useMounteRef()

  return useCallback(
    (...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0),
    [dispatch, mountedRef]
  )
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
  // useState适合定义单个状态，useReducer适合定义互相影响的多个状态
  const [state, dispatch] = useReducer(
    (state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }),
    {
      ...defaultInitialState,
      ...initialState,
    }
  )

  const safeDispatch = useSafeDispatch(dispatch)

  // useState直接传入函数的定义是：惰性初始化；所以要用useState保存函数，不能直接传入函数
  const [retry, setRetry] = useState(() => () => {})

  const setData = useCallback(
    (data: D) =>
      safeDispatch({
        data,
        status: 'success',
        error: null,
      }),
    [safeDispatch]
  )

  const setError = useCallback(
    (error: Error) =>
      safeDispatch({
        error,
        status: 'error',
        data: null,
      }),
    [safeDispatch]
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
      safeDispatch({ status: 'loading' })
      return promise
        .then((data) => {
          setData(data)
          return data
        })
        .catch((error) => {
          // catch会消化异常，如果不主动抛出，外面是接收不到异常的
          setError(error)
          if (config.thorwOnError) return Promise.reject(error)
          return error
        })
    },
    [config.thorwOnError, safeDispatch, setData, setError]
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
