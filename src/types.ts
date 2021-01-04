export interface Config {
  pageDir: string
  navigateFnName: string
  navigateSpecifier: string
  appConfigPath: string
  projectConfigPath: string
  outputFileName?: string
  exts?: string[]
  formatter?(name: string): any
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
  outputFileName?: string
  formatter?(name: string): any
}

export interface ModifyAppConfigOpt {
  appConfigPath: string
}

export interface modifyProjectConfigOpt {
  projectConfigPath: string
}
