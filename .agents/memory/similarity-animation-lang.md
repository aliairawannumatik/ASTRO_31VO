---
name: SimilarityAnimation lang prop pattern
description: How shared animation components in Numatik receive and use the lang prop for K9 Kesebangunan
---

# SimilarityAnimation lang prop pattern

## Rule
Shared animation components (e.g. `SimilarityAnimation`) accept `lang?: Language` where `Language` is **imported** from `@/contexts/LanguageContext`, not redefined locally. The parent page calls `const { language } = useLanguage()` and passes `lang={language}` — no type cast needed.

**Why:** Redefining `type Lang = "id"|"en"|"ja"` in the component creates a parallel type that silently drifts if LanguageContext ever changes. Importing the canonical type keeps them in sync at compile time.

**How to apply:** Whenever adding a `lang` prop to any animation or sub-component:
1. `import type { Language } from "@/contexts/LanguageContext";`
2. Declare `interface Props { lang?: Language; }`
3. Parent: `import { useLanguage }`, destructure `language`, pass `lang={language}` — no cast.

## Translations object shape used in SimilarityAnimation
- Keys with function values for dynamic strings: `statusScaled: (k: string) => string`, `rotated: (deg: number) => string`, etc.
- Keys with JSX values for rich text: `congrBody: ReactNode`
- All dynamic status strings (4 variants) handled with a local `if/else` block, not inside the translations object.
- SVG text (label inside `<text>` element) is also translated — don't leave `fontFamily="sans-serif"` SVG strings hardcoded.
