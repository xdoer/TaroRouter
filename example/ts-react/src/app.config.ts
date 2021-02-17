export default {
  pages: ["pages/index/index"],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  subPackages: [{
    "root": "package-test",
    "name": "test",
    "pages": [
      "pages/test/index"
    ]
  }]
}
