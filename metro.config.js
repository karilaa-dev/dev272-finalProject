const { getDefaultConfig } = require('@expo/metro-config');

/**
 * Metro configuration
 * https://docs.expo.dev/guides/using-svg/#with-expo
 */
const config = getDefaultConfig(__dirname);

// Exclude .svg from the asset extensions
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
// Add .svg to source extensions
config.resolver.sourceExts.push('svg');

// Use the SVG transformer
config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

module.exports = config; 