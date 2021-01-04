import { Project, SyntaxKind } from 'ts-morph'
import { RouterMeta, ModifyAppConfigOpt } from './types'
import { saveSourceFile } from './saveSourceFile'

export async function modifyAppConfig(
  routerList: RouterMeta[],
  modifyAppConfigOpt: ModifyAppConfigOpt
) {
  const { appConfigPath } = modifyAppConfigOpt

  /**
   * 构造 app.config.ts 中的路由项
   */
  const routes = routerList.reduce(
    (routerConfig, meta) => {
      const pagePath = meta.path.slice(1)

      if (!meta.package) {
        routerConfig.pages.push(pagePath)
        return routerConfig
      }

      const { subPackages = [] } = routerConfig
      const subPackage = subPackages.find(
        (subPackage = {} as any) => subPackage?.root === meta.package
      )
      const subPagePath = pagePath.replace(/^package-\b\w+\b\//, '')
      if (subPackage) {
        subPackage.pages.push(subPagePath)
        return { ...routerConfig, subPackages }
      }

      const [, packageName] = meta.package.match(/^package-(\w+)$/) || []
      subPackages.push({
        root: meta.package,
        name: packageName,
        pages: [subPagePath],
      })

      return { ...routerConfig, subPackages }
    },
    { pages: [], subPackages: [] } as any
  )

  const project = new Project()
  project.addSourceFileAtPath(appConfigPath)
  const sourceFile = project.getSourceFileOrThrow(appConfigPath)
  const expAssign = sourceFile.getExportAssignmentOrThrow(() => true)

  const objectLiteralExpression = expAssign.getChildrenOfKind(SyntaxKind.ObjectLiteralExpression)[0]

  const pageInitializer = `[${routes.pages.map((v: any) => '"' + v + '"')}]`
  const subPageInitializer = `[${routes.subPackages.map((v: any) => JSON.stringify(v, null, 2))}]`
  checkAndAddProperty('pages', objectLiteralExpression, pageInitializer)
  checkAndAddProperty('subPackages', objectLiteralExpression, subPageInitializer)

  saveSourceFile(sourceFile)
}

function checkAndAddProperty(name: 'pages' | 'subPackages', node: any, initializer: any) {
  node.getProperty(name)?.set({ initializer }) || node.addPropertyAssignment({ name, initializer })
}
