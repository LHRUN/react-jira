import { http } from 'require'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const apiUrl = process.env.REACT_APP_API_URL

const server = setupServer()

// beforeAll 代表执行所有的测试之前，先来执行回调
beforeAll(() => server.listen())

// 每一个测试跑完，重置mock路由
afterEach(() => server.resetHandlers())

// 所有测试跑完，关闭mock路由
afterAll(() => server.close())

test('http方法发送异步请求', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = { mockValue: 'mock' }

  server.use(
    rest.get(`${apiUrl}/${endpoint}`, (req, res, ctx) =>
      res(ctx.json(mockResult))
    )
  )

  const result = await http(endpoint)
  expect(result).toEqual(mockResult)
})

test('http请求时会在header带上token', async () => {
  const token = 'FAKE_TOKEN'
  const endpoint = 'test-endpoint'
  const mockResult = { mockValue: 'mock' }

  let request: any

  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(mockResult))
    })
  )

  await http(endpoint, { token })
  expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`)
})
