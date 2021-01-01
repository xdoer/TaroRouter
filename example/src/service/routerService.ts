import { navigateTo } from "@common/utils"

class RouterService {
  Test = "/package-test/pages/test/index";
  Index = "/pages/index/index";

  toTest<T>(data?: T, opt?: any) {
    navigateTo("/package-test/pages/test/index", data as any, opt as any)
  }

  toIndex<T>(data?: T, opt?: any) {
    navigateTo("/pages/index/index", data as any, opt as any)
  }
}

export const routerService = new RouterService()
