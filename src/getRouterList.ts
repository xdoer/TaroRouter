import { readdirSync, existsSync } from 'fs'
import last from 'lodash.last'
import { sep, resolve } from 'path'
import { RouterMeta, RouterMetaOpt } from './types'
import { formatter, upFirst } from './utils'

// const routerList = [
//   {
//     name: 'Index',
//     prefix: '',
//     path: '/pages/index/index',
//     type: 'main',
//     package: ''
//   },
//   {
//     name: 'Demo',
//     prefix: '/package-demo',
//     path: '/pages/demo/index',
//     type: 'sub',
//     package: 'package-demo'
//   }
// ]

const initOpt: RouterMetaOpt = { prefix: 'pages', type: 'main', package: '' }

export function getRouterList(
  path = '',
  exts = ['tsx'],
  routerList: RouterMeta[] = [],
  opt = initOpt
) {
  const paths = readdirSync(path)
  const { prefix } = opt

  for (const item of paths) {
    const name = last(item.split(sep)) || ''

    if (/^pages$/.test(name)) {
      const pageDir = readdirSync(resolve(path, item))

      for (const page of pageDir) {
        const pagePath = `/${prefix ? prefix + '/' : ''}${page}/index`
        const realFilePath = `${path}/pages/${page}/index`

        getPathList(realFilePath, exts).forEach((p) => {
          if (existsSync(p)) {
            routerList.push({
              name: upFirst(formatter(page)),
              path: pagePath,
              ...opt,
            })
          }
        })
      }
    }

    if (/^package-/.test(name)) {
      const opt: RouterMetaOpt = {
        prefix: `${name}/pages`,
        type: 'sub',
        package: name,
      }
      routerList = getRouterList(resolve(path, item), exts, routerList, opt)
    }
  }

  // index page is first
  return routerList.sort((a) => (a.name === 'Index' ? -1 : 1))
}

const getPathList = (path: string, exts: string[]) => exts.map((v) => path + `.${v}`)
