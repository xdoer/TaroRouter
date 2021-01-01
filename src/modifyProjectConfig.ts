import { RouterMeta, modifyProjectConfigOpt } from "./types";
import { promises as fs } from 'fs'

export async function modifyProjectConfig(routerList: RouterMeta[], modifyProjectConfig: modifyProjectConfigOpt) {
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

  let modify = false
  for (let i = 0; i < routerList.length; i++) {
    const { name, path } = routerList[i]
    const pos = originList.findIndex((item: any) => item.name === name)

    if (pos === -1) {
      originList.push(
        {
          id: i,
          name,
          pathName: path.slice(1)
        }
      )
      modify = true
    }
  }

  if(modify) {
    await fs.writeFile(projectConfigPath, JSON.stringify(projectConfig, null, 2))
  }
}
