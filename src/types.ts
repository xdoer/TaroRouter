export interface RouterConfig {
  pageDir: string
  homePage: string
  navigateFnName: string
  navigateSpecifier: string
  appConfigPath: string
  outPutPath: string
  projectConfigPath?: string
  exts?: string[]
  formatter?(name: string): string
}

export interface RouterMetaOpt {
  prefix: string
  type: 'main' | 'sub'
  package: string
}

export interface RouterMeta extends RouterMetaOpt {
  name: string
  path: string
}

export interface GenerateRouterServiceOpt {
  navigateSpecifier: string
  navigateFnName: string
  outPutPath: string
  formatter?(name: string): string
}

export interface ModifyAppConfigOpt {
  appConfigPath: string
}

export interface modifyProjectConfigOpt {
  projectConfigPath: string
}

export type RouterArgs = Parameters<(opt: RouterConfig) => Promise<void>>
