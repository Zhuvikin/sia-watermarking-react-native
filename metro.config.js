module.exports = {
  transformer: {
    babelTransformerPath: require.resolve(
      'react-native-react-bridge/lib/plugin',
    ),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
