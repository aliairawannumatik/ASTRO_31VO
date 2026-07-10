# NUMATIK

**Numerasi Aktif dengan Teknologi Informasi dan Komunikasi**

An interactive multimedia educational app for junior high school (SMP) mathematics in Indonesia, created by Irawan Sutiawan, M.Pd.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite (port 5000)
- **Backend:** Express (Node.js) on port 3001
- **Styling:** Tailwind CSS + shadcn/ui + Framer Motion
- **Math rendering:** KaTeX / react-katex
- **AI:** Google Gemini via Replit AI Integrations (`@google/genai`)
- **State:** TanStack Query, React Hook Form, Zod

## Architecture

- `src/` — React frontend source
  - `components/` — UI and feature components (animations, games, LKPD)
  - `pages/` — Routes for LKPD, Bank Soal, Olimpiade, Ruang Untuk Guru, Menghitung Cepat, AI Chat
  - `contexts/` — Theme, Music, Sounds, Font global state
  - `data/` — Static quiz, explanation, and curriculum data
  - `hooks/` — Audio management and mobile responsiveness hooks
- `server.ts` — Express server: serves static files in production, proxies AI requests via `/api/chat`
- `api/` — Backend API handlers
- `public/` — Static assets including background music

## Running

- **Development:** `npm run dev` — starts both Express (port 3001) and Vite (port 5000) concurrently
- **Production build:** `npm run build` then `npm start`
- Vite proxies `/api/*` requests to the Express server at port 3001

## AI Integration

Uses Replit's Gemini AI integration. The server uses:
- `AI_INTEGRATIONS_GEMINI_API_KEY`
- `AI_INTEGRATIONS_GEMINI_BASE_URL`

These are automatically provided by Replit — no manual API key setup needed.

## Key Features

- Interactive LKPD (worksheets) for grades 7, 8, and 9
- Bank Soal (question banks) with multiple difficulty levels
- Olimpiade math competition preparation
- Ruang Untuk Guru (teacher resources): RPP, assessments
- Menghitung Cepat (speed calculation techniques)
- NUMATIK AI — Gemini-powered math assistant chatbot
- Gamification: 7-game arena variants per submenu (Meteor, Flappy Rocket, Shoot Tank, Space Impact, Turtle Run, Tetris, Snake)
  - **Pause-quiz pop-up (`useGuruQuiz`) — single quiz mechanic for all games:** Each game (`umum/{FlappyRocketPage,BattleTankPage,SpaceImpactPage,DinoRunGamePage,TetrisGamePage,SnakeMathPage}`) accepts a `quizQuestions?: GuruQuestion[]` prop forwarded to `useGuruQuiz`. The hook fires a pop-up every 25 detik (max 5 soal/sesi, +20 poin per benar) and exposes `isCountdownActive` so `GuruQuizOverlay` shows a floating "👩‍🏫 SOAL GURU: {N}s" chip top-center while the game is playing (turns red/pulsing at ≤5s). All in-game "bonus question" mechanics (special pipes/gates, periodic in-game quiz pop-ups, ❓ HUD timers) have been removed from BattleTank and FlappyRocket — `useGuruQuiz` is the only quiz path. K7/K8/K9 dispatchers pass `q.snake` as `quizQuestions` so the pop-up matches the active sub-materi. Bilangan-bulat static wrappers import per-subtopic question banks from `src/data/mga-k7-bilbul-quiz.ts` (`PENJUMLAHAN_QUIZ`, `PENGURANGAN_QUIZ`, `PERKALIAN_QUIZ`, `PEMBAGIAN_QUIZ`, `OPERASI_CAMPURAN_QUIZ`, `KPK_FPB_QUIZ`). Meteor game does not use `useGuruQuiz`. The `MQ` type and `questions?` prop are kept on FlappyRocket/BattleTank for backward compat with wrapper imports but are no longer used at runtime.
    - **Countdown timing:** the hook tracks `nextTriggerAt` (timestamp). When playing starts, it's set to `now + 25000`. The countdown pauses while the game is paused and while a question is on screen; only after the player answers does `nextTriggerAt` reset to `now + 25000` so the next 25s countdown begins fresh. The hook exposes `secondsUntilNext` which the on-screen chip in SnakeMathPage and SpaceImpactPage reads directly (single source of truth).
  - **Kelas 7 — Bilangan Bulat:** dedicated wrapper page per (subtopic × variant) under `src/pages/math-game-arena/kelas7/bilangan-bulat/` (kept as static routes; React Router v6 ranks them above the catch-all)
  - **Kelas 7 — All other 8 topics (44 sub-materi):** centralized data + chooser/dispatcher pattern (same as K8/K9)
    - `src/data/mga-k7/` — one file per topic (aritmetika-sosial, garis-dan-sudut, segitiga-segiempat, himpunan, bilangan-rasional, aljabar, plsv-ptlsv, perbandingan) + `registry.ts` + `types.ts`. Each sub-materi defines all 6 game-specific question shapes inline (meteor, flappyRocket, tembakTank, spaceImpact, turtleRun, snake)
    - `src/components/mga-k7/SubmaterialGameVariantsChooser.tsx` — lists the 7 variants
    - `src/components/mga-k7/SubmaterialGameDispatcher.tsx` — dispatches `:variant` to the appropriate game with the correct question set
    - Catch-all routes in `App.tsx`: `/math-game-arena/kelas-7/:parentSlug/:slug` → chooser, `/math-game-arena/kelas-7/:parentSlug/:slug/:variant` → dispatcher
    - Old per-sub-materi single-game wrapper files under `src/pages/math-game-arena/kelas7/{aritmetika-sosial,garis-dan-sudut,segitiga-segiempat,himpunan,bilangan-rasional,aljabar,plsv-ptlsv,perbandingan}/` are orphaned (no longer imported by routes); their parent landing pages still link via `/{parentSlug}/{slug}` which now hits the chooser
  - **Kelas 8 — All 9 topics (47 sub-materi):** centralized data + chooser/dispatcher pattern
    - `src/data/mga-k8/` — one file per topic (pola-bilangan, koordinat-cartesius, relasi-fungsi, spldv, persamaan-garis-lurus, teorema-pythagoras, lingkaran, garis-singgung-lingkaran, bangun-ruang-sisi-datar) + `registry.ts` + `_helpers.ts` (`expandPool` fans out a 12-question base pool into 6 game-specific question shapes with offsets 0/2/4/6/8/10 to ensure variety)
    - `src/components/mga-k8/SubmaterialGameVariantsChooser.tsx` — lists the 7 variants
    - `src/components/mga-k8/SubmaterialGameDispatcher.tsx` — dispatches `:variant` to the appropriate game with the correct question set
    - Catch-all routes in `App.tsx`: `/math-game-arena/kelas-8/:parentSlug/:slug` → chooser, `/math-game-arena/kelas-8/:parentSlug/:slug/:variant` → dispatcher
  - **Kelas 9 — All 8 topics (43 sub-materi):** same centralized data + chooser/dispatcher pattern as Kelas 8
    - `src/data/mga-k9/` — one file per topic (bilangan-berpangkat, kesebangunan-kekongruenan, transformasi-geometri, bangun-ruang-sisi-lengkung, statistika, peluang, persamaan-kuadrat, fungsi-kuadrat) + `registry.ts` + `_helpers.ts` (`expandPool` fans out a 12-question base pool into 6 game-specific question shapes with offsets 0/2/4/6/8/10 to ensure variety)
    - `src/components/mga-k9/SubmaterialGameVariantsChooser.tsx` — lists the 7 variants
    - `src/components/mga-k9/SubmaterialGameDispatcher.tsx` — dispatches `:variant` to the appropriate game with the correct question set
    - Catch-all routes in `App.tsx`: `/math-game-arena/kelas-9/:parentSlug/:slug` → chooser, `/math-game-arena/kelas-9/:parentSlug/:slug/:variant` → dispatcher
    - Old per-subtopic game wrapper files in `src/pages/math-game-arena/kelas9/**/` are orphaned (no longer imported); the 8 topic landing pages in `src/pages/math-game-arena/kelas9/` (e.g. `StatistikaPage.tsx`) are still used and link into the chooser flow
- Flashcards
- Background music and sound effects
- Indonesian SMP curriculum alignment
