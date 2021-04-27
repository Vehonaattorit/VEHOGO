const createExpoWebpackConfigAsync = require('@expo/webpack-config')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          '@codler/react-native-keyboard-aware-scroll-view',
          '@ptomasroos/react-native-multi-slider',
        ],
      },
    },
    argv
  )

  config.resolve.alias['react-native'] = 'react-native-web'
  config.resolve.alias['react-native-maps'] = 'react-native-web-maps'

  return config
}
