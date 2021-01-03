const chokidarPluginConfig = require('./watchFile');

module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {},
  mini: {
    webpackChain(chain) {
      chain.merge({
        plugin: {
          install: {
            plugin: require('webpack-plugin-chokidar'),
            args: [chokidarPluginConfig],
          },
        },
      });
    },
  },
  h5: {},
};
