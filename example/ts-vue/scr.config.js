import * as shelljs from 'shelljs'
import { resolve } from 'path'
import * as debounce from 'lodash.debounce'

const debounceExec = debounce(() => {
  console.log('监听到文件变动，将执行脚本')
  shelljs.exec('scr -r 1')
}, 1000)

const basePath = process.cwd()

module.exports = {
  scripts: [
    {
      module: resolve('../../dist/index.js'),
      args: [
        {
          pageDir: basePath + '/src',
          appConfigPath: basePath + '/src/app.config.ts',

          // 输出文件名
          outPutPath: basePath + '/src/routerService.ts',

          /**
           * 导入组件
           *
           * 输出的文件将导入方法
           * import { customNavigateTo } from '@/business/app'
           */
          navigateFnName: 'navigateTo',
          navigateSpecifier: '@common/utils',

          // 格式化路径
          formatter: (name) => name.replace(/-([a-zA-Z])/g, (_, g) => g.toUpperCase()),

          exts: ['vue'], // 文件扩展(默认tsx)
        },
      ],
    },
    {
      module: '@xdoer/chokidar',
      args: [
        {
          options: { persistent: true, ignoreInitial: true },
          list: [
            {
              target: resolve(basePath, 'src/**/pages/**/index.vue'),
              options: { ignoreInitial: false },
              watch: {
                add(watcher, path) {
                  debounceExec()
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
