export interface Config {
  pageDir: string
  navigateFnName: string
  navigateSpecifier: string
  appConfigPath: string
  projectConfigPath: string
  outputFileName: string
}

export interface RouterMetaOpt {
  prefix: string
  type: 'main' | 'sub'
  package: string  
}
export interface RouterMeta extends RouterMetaOpt{
  name: string
  path: string
}

export interface GenerateRouterServiceOpt {
  generatedDir: string
  navigateSpecifier: string
  navigateFnName: string
  outputFileName: string
}

export interface ModifyAppConfigOpt {
  appConfigPath: string
}

export interface modifyProjectConfigOpt {
  projectConfigPath: string
}
