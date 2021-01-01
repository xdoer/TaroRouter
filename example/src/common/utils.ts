import Taro from '@tarojs/taro'

/**
 * 路由跳转
 * @param url 要跳转的地址
 * @param params 对象参数
 */
export function navigateTo(url: string, params?: object, opt?: Partial<Taro.navigateTo.Option>) {
  if (!params) return Taro.navigateTo({ url })
  const _url = `${url}?navParams=${JSON.stringify(params)}`
  Taro.navigateTo({ url: _url, ...opt })
}
