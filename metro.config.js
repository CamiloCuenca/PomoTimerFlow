const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Asegurar que los archivos .ttf se copien al build web
config.resolver.assetExts.push('ttf');

module.exports = withNativeWind(config, {
  input: "./global.css",
});
