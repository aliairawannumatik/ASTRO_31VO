export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // cssnano runs only during production builds
    ...(process.env.NODE_ENV === "production"
      ? {
          cssnano: {
            preset: [
              "default",
              {
                discardComments:     { removeAll: true },
                normalizeWhitespace: true,
                minifyFontValues:    true,
                minifyGradients:     true,
                mergeRules:          true,
                mergeLonghand:       true,
                reduceIdents:        false,
                zindex:              false,
              },
            ],
          },
        }
      : {}),
  },
};
