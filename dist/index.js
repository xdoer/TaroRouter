
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./generated-plugin-taroRouterService.cjs.production.min.js')
} else {
  module.exports = require('./generated-plugin-taroRouterService.cjs.development.js')
}
