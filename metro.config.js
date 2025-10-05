/* eslint-env node */
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// 1. Obtén la configuración predeterminada
const config = getDefaultConfig(__dirname);

// 2. Aplica NativeWind 
module.exports = withNativeWind(config, {
  input: "./app/global.css",
  
});