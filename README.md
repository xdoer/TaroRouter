# TaroRouter

便捷的 Taro 路由跳转

## 简介

Taro 中内置了路由功能，这极大的方便了开发者。我们开发一个小程序页面时，流程是这样的。

> - 新建页面文件
> - app.config.ts 配置页面路径

使用时，需要在方法里书写完整页面路径。

```tsx
navigateTo({ url: '/package-test/pages/test/index?id=1' })
```

比较好的开发方式应当是将所有页面路径维护到一个单独的路径映射表中。

```tsx
navigateTo({ url: `${URLs.Test}?id=1` })
```

但这样的话，虽然方便了调用，但又需要多维护一份路由映射表文件。

因而这个脚本诞生了。

---

之前的版本请查阅: [generated-plugin-taro-router-service](https://github.com/forsigner/generated/tree/master/packages/generated-taro-router)

## 作用

> - 自动配置 `app.config.ts` 文件进行页面注册
> - 自动配置 `project.config.json` 文件，添加开发者工具页面编译快捷入口 (可选)
> - 生成 `routerService` 文件，使得路由调用跳转更便捷。
> - 配合[chokidar](https://github.com/xdoer/chokidar)，新建页面文件后，将自动运行脚本，生成各项配置。

**默认约束: [package-(module)/]pages/(page-name)/index.[tsx|vue]** 为页面

## 环境

`taro typescript`

支持 react, vue

## 效果

### 自动生成配置

下图演示了监听页面文件的创建，脚本自动生成各项配置的过程

![效果图](./example.gif)

### 调用

脚本跑完后，使用非常简单，只需要引入自动生成的 `routerService` 文件，即可直接进行调用。

```tsx
<View onClick={() => routerService.toTest({ id: 1 })}>跳转</View>
```

## 安装

```bash
npm i @xdoer/taro-router
```

## 配置

### 配置脚本

在你的项目中编写脚本 `taro-router.mjs`, 进行如下配置, 最后运行 `node taro-router.mjs` 即可

```js
import taroRouter from '@xdoer/taro-router'

const basePath = process.cwd()

taroRouter({
  // 源码目录
  pageDir: basePath + '/src',

  // 首页, 即 app.config.ts 中 pages 数组的第一项。值为页面文件夹名称
  homePage: 'index',

  // app.config 路径
  appConfigPath: basePath + '/src/app.config.ts',

  // project.config.json 或者 project.private.config.json 路径
  // 可选参数，不传代表不修改
  projectConfigPath: basePath + '/project.private.config.json',

  // 输出文件名
  outPutPath: basePath + '/src/routerService.ts',

  /**
   * 导入组件
   *
   * 输出的文件将导入方法
   * import { customNavigateTo } from '@/business/app'
   */
  navigateFnName: 'customNavigateTo', // 导入方法名
  navigateSpecifier: '@/business/app', // 方法导入标识符

  // 可选参数，格式化名称
  formatter: (name) => name.replace(/-([a-zA-Z])/g, (_, g) => g.toUpperCase()),

  // 可选参数，文件扩展名(默认tsx)
  exts: ['tsx', 'vue'],
})
```

### 自动执行脚本

每次新建页面后，手动执行脚本不够方便。你可以使用 [chokidar](https://github.com/xdoer/chokidar) 监听文件夹的创建与删除，来自动执行脚本。

在项目中编写脚本 `chokidar.mjs`, 进行如下配置, 最后运行 `node chokidar.mjs` 即可

```ts
import chokidar from '@xdoer/chokidar'
import * as shelljs from 'shelljs'
const debounce = require('lodash.debounce')

const debounceExec = debounce(() => shelljs.exec('node taro-router.mjs'), 1000)

chokidar({
  list: [
    {
      target: process.cwd() + '/src/**/pages/**/index.tsx',
      options: { persistent: true, ignoreInitial: true },
      watch: {
        add(watcher, path) {
          debounceExec()
        },
      },
    },
  ],
})
```

### 脚本管理

项目中脚本多了之后，不好管理。你可以使用 [ScriptRunner](https://github.com/xdoer/ScriptRunner) 脚本管理器来管理，解析和运行脚本。

这样，你不需要再在项目中写上面提到的两个脚本。直接编写 `scr.config.ts` 配置文件, 进行如下配置

```ts
import { Config } from '@xdoer/script-runner/lib/types'
import { RouterArgs } from '@xdoer/taro-router'
import { ChokidarArgs } from '@xdoer/chokidar'
import * as shelljs from 'shelljs'
const debounce = require('lodash.debounce')

const debounceExec = debounce(() => shelljs.exec('scr -r @xdoer/taro-router'), 1000)

const basePath = process.cwd()

export default <Config>{
  scripts: [
    {
      module: '@xdoer/taro-router',
      args: <RouterArgs>[
        {
          // 源码目录
          pageDir: basePath + '/src',

          homePage: 'index',

          // app.config 路径
          appConfigPath: basePath + '/src/app.config.ts',

          // project.config.json 或者 project.private.config.json 路径
          projectConfigPath: basePath + '/project.private.config.json',

          // 输出文件名
          outPutPath: basePath + '/src/routerService.ts',

          /**
           * 导入组件
           *
           * 输出的文件将导入方法
           * import { customNavigateTo } from '@/business/app'
           */
          navigateFnName: 'customNavigateTo', // 导入方法名
          navigateSpecifier: '@/business/app', // 方法导入标识符

          // 格式化路径
          formatter: (name) => name.replace(/-([a-zA-Z])/g, (_, g) => g.toUpperCase()),

          exts: ['tsx', 'vue'], // 文件扩展(默认tsx)
        },
      ],
    },
    {
      module: '@xdoer/chokidar',
      args: <ChokidarArgs>[
        {
          list: [
            {
              target: basePath + '/src/**/pages/**/index.tsx',
              options: { persistent: true, ignoreInitial: true },
              watch: {
                add: debounceExec,
              },
            },
          ],
        },
      ],
    },
  ],
}
```

整合命令

```json
{
  "script": {
    "dev": "scr & taro build --type weapp"
  }
}
```

## 路由方法

工具内部没有直接使用 taro 原生的 `navigateTo` 方法，而是需要手动配置方法。一是因为 taro 导出的路由 API 并不好用，二是 API 封装在内部，自定义程度不够高。您可以在保证函数传参条件的情况下，随意进行函数实现

```tsx
import { navigateTo } from '@tarojs/taro'

export function customNavigateTo(pagePath: string, data?: any, opt?: any) {
  const url = createFinalURL(pagePath, data)
  navigateTo({ url, ...opt })
}
```

## DEMO

> - [React + Typescript](./example/ts-react/config/index.js)
> - [Vue3 + Typescript](./example/ts-vue/config/index.js)
