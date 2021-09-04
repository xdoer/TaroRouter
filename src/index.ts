import { RouterConfig } from './types'
import { getRouterList } from './getRouterList'
import { generateRouterService } from './generateRouterService'
import { modifyAppConfig } from './modifyAppConfig'
import { modifyProjectConfig } from './modifyProjectConfig'

export default (options: RouterConfig) => {
  const {
    pageDir,
    navigateSpecifier = '',
    appConfigPath,
    projectConfigPath,
    navigateFnName,
    outPutPath,
    formatter,
    exts,
  } = options

  const routerList = getRouterList(pageDir, exts)

  generateRouterService(routerList, {
    navigateSpecifier,
    navigateFnName,
    outPutPath,
    formatter,
  })
  modifyAppConfig(routerList, { appConfigPath })

  if (projectConfigPath) {
    modifyProjectConfig(routerList, { projectConfigPath })
  }
}

export * from './types'
