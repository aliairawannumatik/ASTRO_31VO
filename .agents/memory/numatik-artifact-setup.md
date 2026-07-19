---
name: Numatik artifact setup
description: Key wiring details, port quirks, and coding patterns for the Numatik math-education pnpm artifact.
---

## Runtime wiring
- Source of truth: **`artifacts/numatik/src/`** — only edit here.
- Workflow `artifacts/numatik: web` runs `pnpm --filter @workspace/numatik run dev` from `artifacts/numatik/`; Vite binds on `PORT=5000` directly (no Express proxy).
- First-time setup: `pnpm install` at workspace root (not `npm install` in `.migration-backup/`).
- `.migration-backup/` is gitignored but its files are **already tracked** in git (committed before gitignore rule). Do not treat it as the active source; it is dead code.
- `listArtifacts()` returns empty after GitHub import — artifact registration is not preserved. Workflow is manually configured via `configureWorkflow` to match `artifact.toml` intent.

## Theme system
- Hook: `import { useTheme } from "@/contexts/ThemeContext"` → `const { isDark } = useTheme()`
- Sub-components defined **outside** the main page component can call `useTheme()` directly (they're React components) as long as they are written as proper function bodies (`() => { ... }`, not arrow `() => (...)` shorthand — the shorthand cannot contain hook calls).
- Reference files: `RangkumanSection.tsx`, `DiskriminanPage.tsx`, `PolaKhususPage.tsx`.

## Light-mode color mapping (dark → light)
| Dark class/value | Light equivalent |
|---|---|
| `bg-slate-800/60` | `bg-gray-100` |
| `bg-slate-800/50` | `bg-white/80` |
| `bg-slate-900/60` | `bg-white/90` |
| `bg-slate-900/50` | `bg-gray-100` |
| `bg-slate-700/40` | `bg-gray-50` |
| `bg-slate-700/60` | `bg-gray-200` |
| SVG bg `rgba(15,23,42,0.7)` | `rgba(241,245,249,0.9)` |
| SVG bg `rgba(6,12,30,0.97)` | `rgba(248,250,252,0.97)` |
| SVG bg `rgba(6,12,30,0.95)` | `rgba(248,250,252,0.95)` |
| SVG grid `#1e293b` | `#cbd5e1` |
| SVG grid `#0f1f3d` | `#cbd5e1` |
| SVG axis `#475569` | `#64748b` |
| SVG text `#64748b` | `#475569` |
| SVG text `#4b5563` | `#6b7280` |
| SVG text `#3d5275` | `#64748b` |
| Table alt row 1 `bg-slate-800/30` | `bg-blue-50/50` |
| Table alt row 2 `bg-slate-700/20` | `bg-gray-50` |

## Known scope gotcha
When using replaceAll on SVG stroke patterns, the same pattern string can appear in both a sub-component scope AND the main page component. Verify with grep after replacement that ISG-local variables (e.g. `isgGridMain`, `isgAxisS`) are NOT referenced outside InteractiveStepGraph. Fix: replace those occurrences with direct `isDark ? "..." : "..."` expressions.

## Trilingual page pattern
Each page exports a `T_PAGENAME` translation object keyed by `"id" | "en" | "ms"`. Pages access it with `const t = T_PAGENAME[language]` where `language` comes from `useLanguage()`.

## Translation progress
- Kelas 8 PGL pages (GrafikPGLPage, MenentukanPGLPage): dark-mode color fixes applied July 2026.
- Kelas 9 Kesebangunan: trilingual support incomplete (task proposed).
