import { RouterMeta, modifyProjectConfigOpt } from './types'
import { promises as fs } from 'fs'

let id = 1

export async function modifyProjectConfig(
  routerList: RouterMeta[],
  modifyProjectConfig: modifyProjectConfigOpt
) {
  const { projectConfigPath } = modifyProjectConfig
  const projectConfig = require(projectConfigPath)

  if (!projectConfig.condition) {
    projectConfig.condition = {}
  }

  if (!projectConfig.condition?.miniprogram) {
    projectConfig.condition.miniprogram = {}
  }

  if (!projectConfig.condition?.miniprogram?.list) {
    projectConfig.condition.miniprogram.list = []
  }

  const originList = projectConfig.condition.miniprogram.list

  for (let i = 0; i < routerList.length; i++) {
    const { name, path } = routerList[i]
    const idx = originList.findIndex((item: any) => item.name === name)

    const pos = idx === -1 ? originList.length : idx
    originList[pos] = {
      ...originList[pos],
      id: id++,
      name,
      pathName: path.slice(1),
    }
  }

  await fs.writeFile(projectConfigPath, JSON.stringify(projectConfig, null, 2))
}
