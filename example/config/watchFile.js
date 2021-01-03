const path = require('path')
const shell = require('shelljs')

const basePath = path.resolve(__dirname, '../src')

function execGenerated(log) {
  console.log(log)
  shell.exec('npm run gen')
}

const fileAction = {
  on: {
    add: (_, path) => {
      execGenerated(`File ${path} has been added`)
    },
    unlink: (_, path) => {
      execGenerated(`File ${path} has been remove`)
    },    
  }
}

const dirAction = {
  on: {
    unlink: (_, path) => {
      execGenerated(`File ${path} has been remove`)
    },    
  }
}

const opt = { persistent: true, ignoreInitial: true }

module.exports = {
  chokidarConfigList: [
    {
      // 监听主包页面创建和删除
      file: basePath + '/pages/**/index.tsx',
      opt,
      actions: fileAction,
    },
    {
      // 监听主包页面文件夹删除
      file: basePath + '/pages/**',
      opt,
      actions: dirAction,
    },
    {
      // 监听分包页面文件创建和删除
      file: basePath + '/**/pages/**/index.tsx',
      opt,
      actions: fileAction,
    },
    {
      // 监听分包页面文件夹删除
      file: basePath + '/**/pages/**',
      opt,
      actions: dirAction,
    },
  ],
}
