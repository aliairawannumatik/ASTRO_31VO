import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

const IS_DEV = process.env.NODE_ENV !== "production";

export default defineConfig({
  base: "/",

  envPrefix: ["VITE_"],

  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 5000,
    strictPort: true,
    allowedHosts: true,
    hmr: { overlay: false },
    proxy: {
      "/api": { target: "http://localhost:3001", changeOrigin: true, secure: false },
    },
  },

  plugins: [
    react(),

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
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    target: "es2020",

    minify: "terser",

    terserOptions: {
      compress: {
        drop_console:   true,
        drop_debugger:  true,
        pure_funcs:     ["console.log", "console.info", "console.debug", "console.warn"],
        passes:         3,
        keep_infinity:  true,
        unsafe_arrows:  true,
        unsafe_methods: true,
        pure_getters:   "strict",
        negate_iife:    false,
        toplevel:       false,
      },
      mangle: {
        safari10: true,
        toplevel: false,
      },
      format: {
        safari10:  true,
        comments:  false,
      },
    },

    rollupOptions: {
      treeshake: {
        preset: "recommended",
      },

      output: {
        // Keep React and all its consumers in a single chunk to avoid
        // createContext race conditions in Android WebView.
        // Heavy non-React libraries are still split for cache efficiency.
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;

          // Animation — heavy, load once
          if (id.includes("framer-motion")) return "vendor-motion";

          // Math / formula rendering
          if (id.includes("katex") || id.includes("react-katex") || id.includes("mathjs"))
            return "vendor-math";

          // Everything else (React, Radix, router, icons, forms, etc.)
          // stays in the default Rollup chunk to guarantee a single
          // React instance with no ordering issues on Android WebView.
          return undefined;
        },

        compact: true,

        chunkFileNames:  "assets/[name]-[hash].js",
        entryFileNames:  "assets/[name]-[hash].js",
        assetFileNames:  "assets/[name]-[hash].[ext]",
      },
    },

    reportCompressedSize: false,

    chunkSizeWarningLimit: 800,
    sourcemap:       false,
    cssCodeSplit:    true,
    assetsInlineLimit: 4096,
  },

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
    ],
  },

  css: {
    devSourcemap: IS_DEV,
  },
});
