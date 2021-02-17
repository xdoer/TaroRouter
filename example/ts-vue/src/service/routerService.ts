import { navigateTo } from "@common/utils"

class RouterService {
  Index = "/pages/index/index";
  Test = "/package-test/pages/test/index";

  toIndex<T>(data?: T, opt?: any) {
    navigateTo("/pages/index/index", data as any, opt as any)
  }

  toTest<T>(data?: T, opt?: any) {
    navigateTo("/package-test/pages/test/index", data as any, opt as any)
  }
}

export const routerService = new RouterService()
