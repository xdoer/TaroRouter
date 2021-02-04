import {
  Project,
  VariableDeclarationKind,
  MethodDeclarationStructure,
  PropertyDeclarationStructure,
  OptionalKind,
} from 'ts-morph'
import { join } from 'path'
import { saveSourceFile } from './saveSourceFile'
import { RouterMeta, GenerateRouterServiceOpt } from './types'
import { upFirst } from './utils'

export function generateRouterService(
  routerList: RouterMeta[],
  generateRouterServiceOpt: GenerateRouterServiceOpt
) {
  const project = new Project()
  const {
    generatedDir,
    navigateSpecifier,
    navigateFnName,
    outputFileName,
  } = generateRouterServiceOpt
  const outPath = join(generatedDir, `${outputFileName}.ts`)
  const sourceFile = project.createSourceFile(outPath, undefined, {
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

    properties.push({ name: upFirst(name), initializer: `"${initializer}"` })
    methods.push({
      name: `to${upFirst(name)}<T>`,
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
