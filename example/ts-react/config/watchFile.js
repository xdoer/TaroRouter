const path = require('path')
const shell = require('shelljs')
const debounce = require('lodash.debounce')

const basePath = path.resolve(__dirname, '../src')

function execGenerated(log) {
  console.log(log)
  shell.exec('npm run gen')
}

const debounceExecGenerated = debounce(execGenerated, 1000)

const opt = { persistent: true, ignoreInitial: true }

module.exports = {
  chokidarConfigList: [
    {
      // 监听页面文件创建
      file: basePath + '/**/pages/**/index.tsx',
      opt,
      actions: {
        on: {
          add: (_, path) => {
            debounceExecGenerated(`页面 ${path} 被添加`)
          },
          // unlink: (_, path) => {
          //   execGenerated(`页面 ${path} 被移除`)
          // },
        },
      },
    },
    {
      // 监听页面文件夹删除
      file: basePath + '/**/pages/**',
      opt,
      actions: {
        on: {
          unlink: (_, path) => {
            debounceExecGenerated(`页面 ${path} 被移除`)
          },
        },
      },
    },
  ],
}
