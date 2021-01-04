import { Config } from 'generated-plugin-taro-router-service'
import { upperFirst } from 'lodash'

const basePath = process.cwd()

export const taroRouter: Config = {
  pageDir: basePath + '/src',

  appConfigPath: basePath + '/src/app.config.ts',
  projectConfigPath: basePath + '/project.config.json',

  outputFileName: 'routerService',
  navigateFnName: 'navigateTo',  
  navigateSpecifier: '@common/utils',

  formatter: (name: string) => {
    const [f = '', s = ''] = name.split('-') || []
    return upperFirst(f) + upperFirst(s)
  }
}
