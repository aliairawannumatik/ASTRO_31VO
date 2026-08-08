import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// PORT and BASE_PATH are injected by the artifact system during dev/serve.
// For production builds (pnpm build) they may not be set — fall back to
// the values declared in artifact.toml so the build does not abort.
const port = Number(process.env.PORT || "3000");
const basePath = process.env.BASE_PATH || "/";

const IS_DEV = process.env.NODE_ENV !== "production";

export default defineConfig({
  base: basePath,

  envPrefix: ["VITE_"],

  plugins: [
    react(),
    runtimeErrorOverlay(),

    // Bundle visualizer — only in dev builds, writes stats.html
    IS_DEV &&
      (visualizer({
        filename: "bundle-stats.html",
        open: false,
        gzipSize: true,
        brotliSize: true,
        template: "treemap",
      }) as Plugin),

    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ].filter(Boolean) as Plugin[],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(
        import.meta.dirname,
        "..",
        "..",
        "attached_assets",
      ),
    },
    dedupe: ["react", "react-dom"],
  },

  root: path.resolve(import.meta.dirname),

  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    target: "es2020",
    minify: "terser",

    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug", "console.warn"],
        passes: 3,
        keep_infinity: true,
        unsafe_arrows: true,
        unsafe_methods: true,
        pure_getters: "strict",
        negate_iife: false,
        toplevel: false,
      },
      mangle: {
        safari10: true,
        toplevel: false,
      },
      format: {
        safari10: true,
        comments: false,
      },
    },

    rollupOptions: {
      treeshake: {
        preset: "recommended",
      },
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("framer-motion")) return "vendor-motion";
          if (id.includes("katex") || id.includes("react-katex") || id.includes("mathjs"))
            return "vendor-math";
          return undefined;
        },
        compact: true,
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },

    reportCompressedSize: false,
    chunkSizeWarningLimit: 800,
    sourcemap: false,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
  },

  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    hmr: {
      overlay: false,
      clientPort: port,
    },
    fs: {
      strict: true,
    },
  },

  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
