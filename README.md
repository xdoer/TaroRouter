# TaroRouter

更便捷的 Taro 路由跳转

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

## 作用

> - 自动配置 `app.config.ts` 文件进行页面注册
> - 自动配置 `project.config.json` 文件，添加开发者工具页面编译快捷入口 (可选)
> - 生成 `routerService` 文件，使得路由调用跳转更便捷。
> - 配合[chokidar](https://github.com/xdoer/chokidar)，新建页面文件后，将自动运行脚本，生成各项配置。

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

**_注: 会将 [package-(module)/]pages/(page-name).[tsx|vue]_** 自动识别为页面

### 配置脚本

在你的项目中编写脚本 `taro-router.mjs`, 进行如下配置, 最后运行 `node taro-router.mjs` 即可

```js
import taroRouter from '@xdoer/taro-router'
import { resolve } from 'path'

taroRouter({
    // 源码目录
  pageDir: basePath + '/src',

  // app.config 路径
  appConfigPath: basePath + '/src/app.config.ts',

  // project.config.json 或者 project.private.config.json 路径
  projectConfigPath: basePath + '/project.private.config.json',

  // 输出文件名
  outPutPath: resolve(process.cwd() ,'routerService.ts'),

  /**
   * 导入组件
   *
   * 输出的文件将导入方法
   * import { customNavigateTo } from '@/business/app'
   */
  navigateFnName: 'customNavigateTo', // 导入方法名
  navigateSpecifier: '@/business/app', // 方法导入标识符

  // 格式化路径
  formatter: (name) => name.replace(/-([a-zA-Z])/g, (_, g) => g.toUpperCase())

  ext: ['tsx', 'vue'], // 文件扩展(默认tsx)
})
```

### 自动执行脚本

你可以使用 [chokidar](https://github.com/xdoer/chokidar) 监听文件夹的创建与删除，来自动执行脚本。

在项目中编写脚本 `chokidar.mjs`, 进行如下配置, 最后运行 `node chokidar.mjs` 即可

```ts
import chokidar from '@xdoer/chokidar'
import shelljs from 'shelljs'
import { resolve } from 'path'
import { debounce } from 'lodash'

const debounceExec = () => debounce(() => shelljs.exec('node taro-router.mjs'), 1000)

chokidar({
  options: { persistent: true, ignoreInitial: true },
  list: [
    {
      target: resolve(process.cwd()), 'src/**/pages/**/index.tsx',
      options: { ignoreInitial: false },
      watch: {
        add(watcher, path) {
          // do something
          debounceExec()
        },
      },
    },
  ],
})
```

### 脚本管理

你可以使用 [ScriptRunner](https://github.com/xdoer/ScriptRunner) 脚本管理器来管理脚本。

这样，你不需要再在项目中写上面提到的两个脚本。直接编写 `scr.config.ts` 配置文件, 进行如下配置

```ts
import { Config } from '@xdoer/script-runner'
import shelljs from 'shelljs'
import { resolve } from 'path'
import { debounce } from 'lodash'

const debounceExec = () => debounce(() => shelljs.exec('scr -r @xdoer/taro-router'), 1000)

export default <Config>{
  scripts: [
    {
      module: '@xdoer/taro-router',
      args: [
        {
          // 源码目录
          pageDir: basePath + '/src',

          // app.config 路径
          appConfigPath: basePath + '/src/app.config.ts',

          // project.config.json 或者 project.private.config.json 路径
          projectConfigPath: basePath + '/project.private.config.json',

          // 输出文件名
          outPutPath: resolve(process.cwd() ,'routerService.ts'),

          /**
           * 导入组件
           *
           * 输出的文件将导入方法
           * import { customNavigateTo } from '@/business/app'
           */
          navigateFnName: 'customNavigateTo', // 导入方法名
          navigateSpecifier: '@/business/app', // 方法导入标识符

          // 格式化路径
          formatter: (name) => name.replace(/-([a-zA-Z])/g, (_, g) => g.toUpperCase())

          ext: ['tsx', 'vue'], // 文件扩展(默认tsx)
        }
      ]
    },
    {
      module: '@xdoer/chokidar',
      args: [
        {
          options: { persistent: true, ignoreInitial: true },
          list: [
            {
              target: resolve(process.cwd()), 'src/**/pages/**/index.tsx',
              options: { ignoreInitial: false },
              watch: {
                add(watcher, path) {
                  // do something
                  debounceExec()
                },
              },
            },
          ],
        }
      ]
    }
  ]
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

## 监听文件变更自动运行命令

新建文件后，手动运行 `generated` 命令还是不够方便，因而，我设计了一个集成 [chokidar](https://github.com/paulmillr/chokidar) 的 webpack 插件[webpack-plugin-chokidar](https://github.com/xdoer/webpack-plugin-chokidar)，通过该插件，可以很容易的对文件更改进行监听，然后利用 shelljs 执行脚本即可。

## 案例

> - [React + Typescript](./example/ts-react/config/index.js)
> - [Vue3 + Typescript](./example/ts-vue/config/index.js)
