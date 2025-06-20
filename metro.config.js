const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable SVG support
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

// Add support for additional file types
config.resolver.assetExts.push(
  'bin',
  'txt',
  'jpg',
  'png',
  'json',
  'gif',
  'webp',
  'svg'
);

module.exports = config;