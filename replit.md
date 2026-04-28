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
- Gamification: 7-game arena variants per Bilangan Bulat submenu (Meteor, Flappy Rocket, Shoot Tank, Space Impact, Turtle Run, Tetris, Snake) for Penjumlahan, Pengurangan, Perkalian, Pembagian, Operasi Campuran, dan KPK & FPB
- Flashcards
- Background music and sound effects
- Indonesian SMP curriculum alignment
