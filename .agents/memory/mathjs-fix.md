---
name: mathjs package fix
description: mathjs ESM/CJS entry files go missing after npm install; clean reinstall of mathjs fixes it
---

After `npm install`, the mathjs `lib/cjs/entry/` and `lib/esm/entry/` subdirectories were absent, causing Vite to fail with "Could not resolve ./entry/mainAny.js".

**Why:** The npm install appears to have partially extracted the mathjs tarball, leaving the `entry/` subfolder missing from both ESM and CJS builds.

**How to apply:** If Vite fails on mathjs with that error, run: `rm -rf node_modules/mathjs && npm install mathjs@<version>` to force a clean extraction.
