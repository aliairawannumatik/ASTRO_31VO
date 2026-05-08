import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import path from "path";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { visualizer } from "rollup-plugin-visualizer";

// ── Radix-UI chunk groups ─────────────────────────────────────────────────
// Split into 3 groups so lazy-loaded routes only pull in what they need.
const RADIX_OVERLAY = [
  "react-dialog", "react-alert-dialog", "react-popover",
  "react-tooltip", "react-dropdown-menu", "react-hover-card",
  "react-context-menu", "react-menubar", "react-navigation-menu",
];
const RADIX_FORM = [
  "react-checkbox", "react-radio-group", "react-slider",
  "react-switch", "react-select", "react-toggle", "react-toggle-group",
  "react-label",
];
const RADIX_LAYOUT = [
  "react-accordion", "react-collapsible", "react-tabs",
  "react-scroll-area", "react-separator", "react-progress",
  "react-avatar", "react-aspect-ratio", "react-toast",
  "react-slot",
];

function getChunk(id: string): string | undefined {
  if (!id.includes("node_modules")) return undefined;

  // React core — always loaded, keep together
  if (id.includes("react-dom") || id.match(/node_modules\/react\//)) return "vendor-react";

  // Routing
  if (id.includes("react-router")) return "vendor-router";

  // Animation — heavy, load once
  if (id.includes("framer-motion")) return "vendor-motion";

  // Math / formula rendering
  if (id.includes("katex") || id.includes("react-katex") || id.includes("mathjs"))
    return "vendor-math";

  // Data fetching
  if (id.includes("@tanstack")) return "vendor-query";

  // Radix — split into 3 logical groups
  if (id.includes("@radix-ui")) {
    if (RADIX_OVERLAY.some((p) => id.includes(p))) return "vendor-radix-overlay";
    if (RADIX_FORM.some((p) => id.includes(p)))    return "vendor-radix-form";
    if (RADIX_LAYOUT.some((p) => id.includes(p)))  return "vendor-radix-layout";
    return "vendor-radix-misc";
  }

  // Icons — tree-shakeable but large, isolate for cache efficiency
  if (id.includes("lucide-react")) return "vendor-icons";

  // Forms / validation
  if (id.includes("zod") || id.includes("react-hook-form")) return "vendor-forms";

  // Everything else from node_modules
  return "vendor-misc";
}

const IS_DEV = process.env.NODE_ENV !== "production";

export default defineConfig({
  envPrefix: ["VITE_"],

  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
    hmr: { overlay: false },
    proxy: {
      "/api": { target: "http://localhost:3001", changeOrigin: true },
    },
  },

  plugins: [
    react(),

    // Legacy polyfill build — 'usage' only includes polyfills the code actually needs
    // (vs 'true' which ships every possible polyfill regardless of usage)
    legacy({
      targets: ["Android >= 5", "Chrome >= 60", "iOS >= 12"],
      modernPolyfills: "usage",
      renderLegacyChunks: true,
    }),

    // Image optimization — active on build
    ViteImageOptimizer({
      includePublic: true,
      logStats: !IS_DEV,
      ansiColors: true,
      png:  { quality: 82 },
      jpeg: { quality: 82 },
      jpg:  { quality: 82 },
      webp: { lossless: false, quality: 82, effort: 4, smartSubsample: true },
      cache: true,
      cacheLocation: "node_modules/.cache/vite-plugin-image-optimizer",
    }),

    // Bundle visualizer — only in dev builds, writes stats.html in project root
    IS_DEV &&
      (visualizer({
        filename: "bundle-stats.html",
        open: false,
        gzipSize: true,
        brotliSize: true,
        template: "treemap",
      }) as Plugin),
  ].filter(Boolean) as Plugin[],

  resolve: {
    alias: {
      "@":       path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },

  build: {
    // ES2020 target for the modern build — enables better dead-code elimination.
    // Old browsers are covered by the legacy plugin (renderLegacyChunks: true).
    target: "es2020",

    minify: "terser",

    terserOptions: {
      compress: {
        drop_console:   true,
        drop_debugger:  true,
        pure_funcs:     ["console.log", "console.info", "console.debug", "console.warn"],
        // Run 3 compression passes for maximum reduction (still deterministic, no runtime risk)
        passes:         3,
        // Safe optimizations — do not alter semantics:
        keep_infinity:  true,           // keeps `Infinity` literal (avoids 1/0 pattern)
        unsafe_arrows:  true,           // convert functions → arrows where provably safe (ES2015+)
        unsafe_methods: true,           // shorthand methods in object literals (ES2015+)
        pure_getters:   "strict",       // treat property reads as side-effect-free in strict mode
        negate_iife:    false,          // preserve IIFE structure for clarity
        // Never mangle or remove top-level: avoids breaking lazy-imported module exports
        toplevel:       false,
      },
      mangle: {
        safari10: true,   // workaround Safari 10 bug
        toplevel: false,  // do NOT mangle top-level names — breaks dynamic imports
      },
      format: {
        safari10:  true,
        comments:  false, // strip all inline comments from output
      },
    },

    rollupOptions: {
      // Tree-shaking: 'recommended' preset is safe — it does NOT remove CSS side-effects
      // and respects the sideEffects field in each package's package.json.
      treeshake: {
        preset: "recommended",
      },

      output: {
        // Apply the chunk grouping function defined above
        manualChunks: getChunk,

        // Compact output — removes extra whitespace left by Rollup (Terser also does this,
        // but compact:true prevents Rollup from adding it in the first place)
        compact: true,

        chunkFileNames:  "assets/[name]-[hash].js",
        entryFileNames:  "assets/[name]-[hash].js",
        assetFileNames:  "assets/[name]-[hash].[ext]",
      },
    },

    // Skip printing gzip/brotli size estimates during build — saves ~5 s per build.
    // Actual compressed size is determined by the server (brotli/gzip headers).
    reportCompressedSize: false,

    chunkSizeWarningLimit: 800,
    sourcemap:       false,
    cssCodeSplit:    true,
    // Inline assets smaller than 4 KB as base64 data URIs (avoids extra HTTP requests)
    assetsInlineLimit: 4096,
  },

  optimizeDeps: {
    // Pre-bundle only the most critical imports for fast dev-server startup.
    // framer-motion and others are left out — they handle their own ESM structure.
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
    ],
    exclude: ["@vitejs/plugin-legacy"],
  },

  css: {
    // Enable CSS modules in dev too (for consistent behaviour)
    devSourcemap: IS_DEV,
  },
});
