export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // cssnano runs only during production builds — strips whitespace, merges rules,
    // deduplicates selectors, and removes comments without changing CSS semantics.
    ...(process.env.NODE_ENV === "production"
      ? {
          cssnano: {
            preset: [
              "default",
              {
                discardComments:  { removeAll: true },
                normalizeWhitespace: true,
                minifyFontValues: true,
                minifyGradients:  true,
                mergeRules:       true,
                mergeLonghand:    true,
                // Keep these off — they rewrite identifiers which can break runtime lookups
                reduceIdents: false,
                zindex:       false,
              },
            ],
          },
        }
      : {}),
  },
};
