import { useAsync } from 'utils/use-async'
import { act, renderHook } from '@testing-library/react-hooks'

const defaultState: ReturnType<typeof useAsync> = {
  status: 'idle',
  data: null,
  error: null,

  isIdle: true,
  isLoading: false,
  isError: false,
  isSuccess: false,

  run: expect.any(Function),
  setData: expect.any(Function),
  setError: expect.any(Function),
  retry: expect.any(Function),
}

const loadingState: ReturnType<typeof useAsync> = {
  ...defaultState,
  status: 'loading',
  isIdle: false,
  isLoading: true,
}

const successState: ReturnType<typeof useAsync> = {
  ...defaultState,
  status: 'success',
  isIdle: false,
  isSuccess: true,
}

test('useAsync异步处理', async () => {
  let resolve: any
  const promise = new Promise((res, rej) => {
    resolve = res
  })

  const { result } = renderHook(() => useAsync())
  expect(result.current).toEqual(defaultState)

  let p: Promise<any>
  act(() => {
    p = result.current.run(promise)
  })

  expect(result.current).toEqual(loadingState)
  const resolvedValue = { mockedValue: 'resolved' }
  await act(async () => {
    resolve(resolvedValue)
    await p
  })

  expect(result.current).toEqual({
    ...successState,
    data: resolvedValue,
  })
})