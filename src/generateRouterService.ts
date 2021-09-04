import {
  Project,
  VariableDeclarationKind,
  MethodDeclarationStructure,
  PropertyDeclarationStructure,
  OptionalKind,
} from 'ts-morph'
import { saveSourceFile } from './saveSourceFile'
import { RouterMeta, GenerateRouterServiceOpt } from './types'
import { formatter, upFirst } from './utils'

export function generateRouterService(
  routerList: RouterMeta[],
  generateRouterServiceOpt: GenerateRouterServiceOpt
) {
  const project = new Project()
  const {
    navigateSpecifier,
    navigateFnName,
    outPutPath,
    formatter: customFormatter = formatter,
  } = generateRouterServiceOpt
  const sourceFile = project.createSourceFile(outPutPath, undefined, {
    overwrite: true,
  })
  const properties: OptionalKind<PropertyDeclarationStructure>[] = []
  const methods: OptionalKind<MethodDeclarationStructure>[] = []

  sourceFile.addImportDeclaration({
    moduleSpecifier: navigateSpecifier,
    namedImports: [navigateFnName],
  })

  for (const routerMeta of routerList) {
    const { name, path: initializer } = routerMeta

    properties.push({ name: upFirst(customFormatter(name)), initializer: `"${initializer}"` })
    methods.push({
      name: `to${upFirst(customFormatter(name))}<T>`,
      parameters: [
        { name: 'data?', type: 'T' },
        { name: 'opt?', type: 'any' },
      ],
      statements: `${navigateFnName}("${initializer}", data as any, opt as any)`,
    })
  }

  sourceFile.addClass({
    name: 'RouterService',
    properties,
    methods,
  })

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: 'routerService',
        initializer: `new RouterService()`,
      },
    ],
    isExported: true,
  })

  saveSourceFile(sourceFile)
}
