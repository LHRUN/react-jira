## 学习记录

> 该项目是仿 jira 管理网站，采用的技术栈为 react17、typescript4、react-router6、

### 初始化项目

1. `npx create-react-app react-jira --template typescript`初始化项目
2. 配置 eslint、[prettier](https://prettier.io/docs/en/install.html)、commitlint 规范

- prettier：自动格式化
  > 首先安装 prettier`yarn add --dev --exact prettier`  
  > 然后创建.prettierrc.json 配置文件`echo {}> .prettierrc.json`  
  > 然后创建.prettierignore 忽略文件添加以下内容

```js
# Ignore artifacts:
build
coverage
```

> 安装 husky 和 lint-staged`npx mrm lint-staged`  
> 然后在 package.json 中配置以下内容

```json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged" // 在commit之前运行"lint-staged"命令
  }
},
"lint-staged": {
  "*.{js,css,md,ts,tsx}": "prettier --write"
}
```

- eslint: 语法规则和代码风格的检查工具
  > create-react-app 自带 eslint，但是 eslint 与 Prettier 有一些冲突的规则，所以需要安装 eslint-config-prettier`yarn add eslint-config- prettier -D`  
  > 然后修改 package.json 以下配置

```json
"eslintConfig": {
  "extends": [
    "react-app",
    "react-app/jest",
    "prettier" // 新增，用prettier的规则覆盖一部分原来的规则
  ]
},
```

- commitlint：每次提交前格式化代码
  > 首先安装`@commitlint/config-conventional`、`@commitlint/cli`  
  > 然后修改 package.json 以下配置

```json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged",
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS" // 新增
  }
},
```

> 修改这个配置以后 commit 的提交就需要加下状态(`feat: some message`)，不能随意提交了

```js
;[
  'build', // 修改项目构建系统的提交(例如glup，webpack，rollup的配置)
  'ci', // 主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
  'docs', // 文档更新
  'feat', // 新增功能
  'fix', // bug 修复
  'perf', // 性能, 体验优化
  'refactor', // 重构代码(既没有新增功能，也没有修复 bug)
  'revert', // 回滚某个更早之前的提交
  'style', // 不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)
  'test', // 新增测试用例或是更新现有测试
  'chore', // 不属于以上类型的其他类，比如构建流程, 依赖管理
]
```

### MOCK 方案对比

1. 代码侵入(直接在代码中写死 mock 数据，或者请求本地的 JSON 文件)

```
优点：
  无
缺点：
  1. 和其他方案对比Mock效果不好
  2. 与真实Server环境的切换非常麻烦，一切需要侵入代码切换环境的行为都是不好的
```

2. 请求拦截([Mock.js](http://mockjs.com/))

```
优点：
  1. 与前端代码分离
  2. 可生成随机数据
缺点：
  1. 数据都是动态生成的假数据，无法真实模拟增删改查的情况
  2. 只支持ajax，不支持fetch
```

```js
Mock.mock(/\\/api\\/visiter\\/list/, 'get', {
  code: 200,
  msg: 'ok',
  'data|10': {
    "110000": "北京市",
    "120000": "天津市",
  }
})
```

3. 接口管理工具([rap](https://github.com/thx/RAP), [swagger](https://swagger.io/), [moco](https://github.com/dreamhead/moco))

```
优点：
  1.配置功能强大，接口管理与Mock一体，后端修改接口Mock也跟着更改，可靠
缺点：
  1. 配置复杂，依赖后端，可能会出现后端不愿意出手，或者等配置完了，接口也开发出来了的情况。
  2. 一般会作为大团队的基础建设而存在，没有这个条件的话慎重考虑
```

4. 本地 node 服务器(json-server)

```
优点：
  1. 配置简单，json-server甚至可以0代码30秒启动一个`REST API Server`
  2. 自定义程度高，一切尽在掌握中
  3. 增删改查真实模拟
缺点：
  1. 与接口管理工具相比，无法随着后端API的修改而自动修改
```

### TS 使用

> ts 常用的就不记录了，只记录一些个别技术点

#### ts 类型

1. void

- 绝大部分情况下，只会用在这一个地方：表示函数不返回任何值或者返回 undefined(因为函数不返回任何值的时候===返回 undefined)

```js
export const useMount = (fn: () => void) => {
  useEffect(() => {
    fn()
  }, [])
}
```

2. tuple

- tuple 是"数量固定，类型可以各异"版的数组
- 在 React 中有可能使用 tuple 的地方就是 custom hook 的返回值, 注意 isHappy -> tomlsHappy 以及其他名字的变化，这里使用 tuple 的好处就显现出来了：便于使用者重命名

```js
const useHappy = () => {
  // ...
  return [isHappy, makeHappy, makeUnHappy]
}

const SomeComponent = () => {
  const [tomIsHappy, makeTomHappy, makeTomUnHappy] = useHappy(false)
}
```

3. unknown

- unknown 表示这个值可以是任何值
- unknown 的用法：在你想用 any 的时候，用 unknown 来代替，简单来说，unknown 是一个"严格"版的 any

#### .d.ts

1. JS 文件 + .d.ts 文件 === ts 文件
2. .d.ts 文件可以让 JS 文件继续维持自己 JS 文件的身份，而拥有 TS 的类型保护
3. 一般我们写业务代码不会用到，但是点击类型跳转一般会跳转到.d.ts 文件

#### Utillity Type

> [Utillity Type](https://www.typescriptlang.org/docs/handbook/utility-types.html)是一些工具类型，以便进行常见的类型转换，常用的有以下几种

1. `Partial<Type>`: 构造一个类型，将 Type 的所有属性设置为可选

```ts
interface Todo {
  title: string
  description: string
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate }
}

const todo1 = {
  title: 'organize desk',
  description: 'clear clutter',
}

const todo1 = updateTodo(todo1, {
  description: 'throw out trash',
})
```

2. `Omit<Type, Keys>`: 通过冲 Type 中选择所有属性，然后删除 keys 来构造类型

```ts
interface Todo {
  title: string
  description: string
}

type TodoInfo = Omit<Todo, 'description'>
const todoInfo: TodoInfo = {
  title: 'debug',
}
```

3. `Pick<Type, keys>`: 通过从 Type 中选择一组属性(keys)来构造类型

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = Pick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
  title: 'Clean room',
  completed: false,
}
```

4. `Exclude<Type, ExcludeUnion>`: 通过从 Type 中排除可分配给 ExcludeUnion 的所有联合成员来构造类型

```ts
type T0 = Exclude<'a' | 'b' | 'c', 'a'>
// type T0 = "b" | "c"
type T1 = Exclude<'a' | 'b' | 'c', 'a' | 'b'>
// type T1 = "c"
type T2 = Exclude<string | number | (() => void), Function>
// type T2 = string | number
```

5. `Parameters<Type>`：从函数类型 Type 的参数中使用的类型构造一个元祖类型

```ts
declare function f1(arg: { a: number; b: string }): void
type T1 = Parameters<(s: string) => void>
// type T1 = [s: string]
type T2 = Parameters<<T>(arg: T) => T>
// type T2 = [arg: unknown]
type T3 = Parameters<typeof f1>
// type T3 = [arg: {
//     a: number;
//     b: string;
// }]
```

### React CSS 方案对比

> react 实现 css 时并没有 vue 中的 scope 这个功能，所以为了避免样式混乱，就有了以下两种方案

#### SASS module

1. 首先下载 sass 样式所需 loader`yarn sass-loader node-loader -D`
2. 然后在 webpack.config.js 中修改以下配置

```js
rules: [
  // 在 css-loader 之后，通过?追加参数(只有css-loader可以加参数)
  {
    test: /\.scss$/,
    use: [
      'style-loader',
      'css-loader?modules&localIdentName=[path][name]-[local]-[hash:5]',
      'sass-loader',
    ],
  },
]
```

#### css in js

> css in js 不是指某一个具体的库，是指组织 css 代码的一种方式，代表库有`styled-component`和`emotion`
