const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, {
  // Asegúrate de que la recarga rápida esté habilitada
  isCSSEnabled: true,
  // Habilita la recarga rápida
  resetCache: false,
  // Configuración adicional para la recarga en caliente
  watchFolders: [__dirname],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json'],
  },
});

// Aplica la configuración de NativeWind
module.exports = withNativeWind(config, { input: './app/global.css' });