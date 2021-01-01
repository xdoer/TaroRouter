
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./generated-plugin-taro-router-service.cjs.production.min.js')
} else {
  module.exports = require('./generated-plugin-taro-router-service.cjs.development.js')
}
