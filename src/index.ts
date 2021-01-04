import { join, resolve, isAbsolute } from 'path'
import { PluginOptions } from 'generated'
import { Config } from './types'
import { getRouterList } from './getRouterList'
import { generateRouterService } from './generateRouterService'
import { modifyAppConfig } from './modifyAppConfig'
import { modifyProjectConfig } from './modifyProjectConfig'

const cwd = process.cwd()

export default (options = {} as PluginOptions) => {
  const routerConfig: Config = options.config.taroRouter || {}

  const { generatedDir = join(cwd, 'src', 'generated') } = options
  const {
    pageDir,
    navigateSpecifier = '',
    appConfigPath,
    projectConfigPath,
    navigateFnName,
    outputFileName,
    formatter,
    exts,
  } = resolveConfig(routerConfig)

  const routerList = getRouterList(pageDir, exts)
  generateRouterService(routerList, {
    generatedDir,
    navigateSpecifier,
    navigateFnName,
    outputFileName,
    formatter,
  })
  modifyAppConfig(routerList, { appConfigPath })
  modifyProjectConfig(routerList, { projectConfigPath })
}

function resolveConfig(routerConfig: Config) {
  const { pageDir, appConfigPath, projectConfigPath } = routerConfig
  return [pageDir, appConfigPath, projectConfigPath].reduce((res, cur) => {
    res[cur] = isAbsolute(cur) ? cur : resolve(cwd, cur)
    return res
  }, routerConfig as any)
}

export * from './types'
