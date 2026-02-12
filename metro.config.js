const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const projectRoot = __dirname;
const srcPath = path.resolve(projectRoot, 'src');
const assetsPath = path.resolve(projectRoot, 'assets');

const config = {
  resolver: {
    extraNodeModules: {
      src: srcPath,
      assets: assetsPath,
    },
  },
  watchFolders: [srcPath, assetsPath],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
