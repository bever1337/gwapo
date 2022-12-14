module.exports = (config) => ({
  ...config,
  babel: {
    ...(config?.babel ?? {}),
    plugins: (config?.babel?.plugins ?? []).concat([
      [
        "formatjs",
        {
          idInterpolationPattern: "[sha512:contenthash:base64:6]",
          ast: true,
        },
      ],
    ]),
  },
});
