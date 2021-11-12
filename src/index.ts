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
    homePage
  } = options

  const routerList = getRouterList(pageDir, exts, homePage)

  return Promise.all([
    generateRouterService(routerList, {
      navigateSpecifier,
      navigateFnName,
      outPutPath,
      formatter,
    }),
    modifyAppConfig(routerList, { appConfigPath }),
    projectConfigPath ? modifyProjectConfig(routerList, { projectConfigPath }) : undefined
  ])
}

export * from './types'
