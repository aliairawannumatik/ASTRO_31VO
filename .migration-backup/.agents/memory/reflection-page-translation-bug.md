---
name: RefleksiPage two-object translation pattern pitfall
description: Why RefleksiPage.tsx (and similar files) crash if new translated keys are added to the wrong object
---

Some materi-matematika pages (e.g. Kelas 9 Transformasi Geometri RefleksiPage) use **two** translation containers in the same component:
- `translations = {id:{},en:{},ja:{}}[language]` aliased to `t` — for page-level titles/intro text defined per full language block.
- `g = { key: {id,en,ja}[language], ... }` — a flat object where each property does its own `{...}[language]` lookup inline.

Both exist because the file was extended incrementally by different sessions. When adding new translated section content, check which object the surrounding code already reads from (`t.` vs `g.`) before adding keys — adding keys to `g` but referencing them via `t.` (or vice versa) type-checks fine (both are untyped object literals) but crashes at runtime with `Cannot read properties of undefined (reading 'map')`, and the browser console error only shows a generic component stack, not the real cause.

**How to apply:** grep the file for `t\.` vs `g\.` usage near the section you're editing, and add new keys to the same object already in use there.
