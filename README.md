# generated-plugin-taro-router-service

## 缘由

Taro 中内置了路由功能，这极大的方便了开发者。我们开发一个小程序页面时，流程是这样的。

>* 新建页面文件
>* app.config.ts 配置页面路径

使用时，需要在方法里书写完整页面路径。

```tsx
navigateTo({ url: '/package-test/pages/test/index?id=1' })
```

比较好的开发方式应当是将所有页面路径维护到一个单独的路径映射表中。

```tsx
navigateTo({ url: `${URLs.Test}?id=1` })
```

但这样的话，虽然方便了调用，但又需要多维护一份路由映射表文件。

因而这个小工具诞生了。

## 环境

`taro typescript`

## 作用

>* 自动配置 `app.config.ts` 文件进行页面注册
>* 自动配置 `project.config.json` 文件，添加开发者工具页面编译快捷入口
>* 自动生成 `routerService` 文件，使得路由调用跳转更便捷。

## 使用

1、新建页面文件。2、运行 generted 命令即可

调用

```tsx
<View onClick={() => routerService.toTest({ id: 1 })}>跳转</View>
```

## 安装

```bash
npm i generated generated-plugin-taro-router-service -D
```

[generted](https://github.com/forsigner/generated)

## 配置

### 注册插件

1、在根目录新建 generated 配置文件 .generatedrc.ts

2、注册插件

```ts
import { GeneratedrcConfig } from 'generated'

const generatedrc: GeneratedrcConfig = {
  configDir: './gconfig', // generated 插件配置目录
  plugins: [
    'generated-plugin-taro-router-service'  // 注册插件
  ],
}

export default generatedrc
```

### 配置插件

1、在根目录新建 `gconfig` 文件夹，文件夹下新建 `router.ts` 配置文件.

2、写入配置

```ts
import { Config } from 'generated-plugin-taro-router-service'

const basePath = process.cwd()

export const taroRouter: Config = {

  // 源码目录
  pageDir: basePath + '/src',
  
  // app.config 路径
  appConfigPath: basePath + '/src/app.config.ts',

  // project.config.json 路径
  projectConfigPath: basePath + '/project.config.json',

  // 输出文件名
  outputFileName: 'routerService',

  /**
   * 导入组件
   * 
   * 输出的文件将导入方法
   * import { customNavigateTo } from '@/business/app'
  */
  navigateFnName: 'customNavigateTo', // 导入方法名
  navigateSpecifier: '@/business/app', // 方法导入标识符
}
```

注意:

>* 这里 `taroRouter` 名称不能变
>* 配置的函数（navigateFnName）需要满足传参为 customNavigateTo(pagePath: string, data: Object, opt: Object)

### 配置命令

1、在 `package.json` 中写入生成命令

```json
  "scripts": {
    "gen": "generated",
  }
```

2、运行命令即可生成 `routerService.ts` 文件

```bash
npm run gen
```

## 路由方法

工具内部没有直接使用taro 原生的 `navigateTo` 方法，而是需要手动配置方法。这是因为一来 taro 导出的路由 API 并不好用，二来自定义程度不够高。您可以在保证函数传参条件的情况下，随意进行函数实现

```tsx
import { navigateTo } from '@tarojs/taro'

export function customNavigateTo(pagePath: string, data?: any, opt?: any) {
  const url = createFinalURL(pagePath, data)
  navigateTo({ url, ...opt })
}
```

## TODO

- [ ] 监听页面文件夹创建，自动运行 generated 命令，生成相关配置文件
