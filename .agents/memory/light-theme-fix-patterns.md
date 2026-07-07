---
name: Light-theme fix patterns
description: Rules and gaps discovered while fixing dark-hardcoded colors across all light themes (light/white/forest/sunset). Dark "luar angkasa" theme must never be touched.
---

## Theme system recap
- `isDark = true` for `dark` and `ocean` themes.
- All non-dark themes add `.light-mode` class to `<html>`. White/forest/sunset also add `.theme-white`/`.theme-forest`/`.theme-sunset`.
- `.light-mode` CSS overrides apply to ALL light themes — the central override file.

## SVG inline fill/stroke cannot be overridden by CSS
Any React component that passes hex colors directly to SVG `fill` or `stroke` (e.g. `fill={labelColor}`) **must** be fixed in React, not CSS.
- Pattern: pass `isDark ? "#light-hex" : "#dark-readable-hex"` from the parent component.
- Example fix: `ArithmeticArcPanel` in PolaAritmetikaPage — `arcColor` and `labelColor` were hardcoded pale hex values invisible on white backgrounds.

## Tailwind gradient classes (`from-*`, `to-*`, `via-*`) cannot be CSS-overridden
These set CSS custom properties (`--tw-gradient-from`, etc.) that don't match `.light-mode .from-cyan-900\/70` selectors reliably.
- Pattern: use `isDark ? "from-cyan-900/70 to-cyan-800/30" : "bg-cyan-50"` in JSX className.

## CSS override gaps found and fixed in index.css

### bg-*-900/* (standalone, not inside bg-slate-900/90 parent)
All standalone `bg-cyan-900/X`, `bg-green-900/X`, `bg-yellow-900/X`, `bg-red-900/X`, `bg-orange-900/X`, `bg-violet-900/X`, `bg-pink-900/X`, `bg-teal-900/X`, `bg-blue-900/X`, `bg-indigo-900/X` — added full coverage to `.light-mode`.

### bg-slate-700/* opacity variants
`bg-slate-700/40` and other `/10`–`/60` variants were missing from `.light-mode` (only bare `bg-slate-700` was present). Added full set.

### bg-slate-900/90
Not overridden (only `/80`, `/50`, `/30`, `/20` were). Added `.light-mode .bg-slate-900\/90 → rgba(248,250,252,0.96)`.

### text-*-200 (very pale, invisible on white)
`text-cyan-200`, `text-green-200`, `text-violet-200`, `text-orange-200`, `text-yellow-200`, `text-red-200`, `text-purple-200`, `text-pink-200`, `text-teal-200`, `text-blue-200`, `text-indigo-200`, `text-amber-200`, `text-rose-200`, `text-fuchsia-200`, `text-lime-200`, `text-emerald-200`, `text-sky-200` — all added.

### bg-*-700/60, /50, /40 (badge backgrounds, Gauss boxes, etc.)
`bg-cyan-700/60`, `bg-violet-700/60`, `bg-purple-700/60`, `bg-green-700/60`, `bg-yellow-700/60`, `bg-red-700/60`, `bg-orange-700/60`, `bg-pink-700/60`, `bg-teal-700/60`, `bg-blue-700/60`, `bg-indigo-700/60`, plus /40 and /50 variants for all — added.

## Already covered by existing CSS (no action needed)
- `text-white/X` (all X from /10 to /95) ✓
- `text-cyan-300`, `text-green-300`, etc. (300+ level) ✓
- `bg-slate-800/10` through `/70` ✓
- `bg-card/80`, `bg-card/90`, `bg-card/100` ✓
- `bg-black/*` variants ✓
- `bg-cyan-950/*`, `bg-violet-950/*` ✓

## **Why:** Durable rule
When a class is constructed at runtime in JSX (ternary or template literal), CSS cannot predict its presence on the DOM. Only classes that are static strings in the source are safe to override via CSS alone. SVG inline styles and Tailwind gradient custom properties are **always** React-only fixes.
