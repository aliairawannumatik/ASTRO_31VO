# Math Space - NUMATIK AI

A React + Vite math tutoring app for Indonesian middle school students (SMP), powered by a NUMATIK AI chatbot backed by Google Gemini.

## Architecture

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, react-router-dom
- **Backend**: Express.js API server (`server.ts`) running on port 3001 (dev) / 5000 (prod)
- **AI**: Google Gemini via server-side Express `/api/chat`
- **Dev workflow**: Vite dev server on port 5000 proxies `/api/*` to Express on port 3001
- **Math Game Arena Umum**: Includes full-color standalone canvas games under `/math-game-arena/umum/*`, including Kereta Koin Math, Ninja Buah Math, Pulau Harta Math, and Kapal Selam Math Battle.

## Running the App

```bash
npm run dev      # Start both Vite (port 5000) and Express (port 3001)
npm run build    # Build frontend for production
npm start        # Run production server (Express serves built frontend on port 5000)
```

## Required Environment Variables

- `GOOGLE_GENERATIVE_AI_API_KEY` — Google AI Studio API key for Gemini access, read only by the server. `GEMINI_API_KEY` and `GOOGLE_API_KEY` are also accepted for compatibility.

## Math Game Arena - Kelas 7 Status

All 9 topics in Kelas 7 now have the **Meteor Shooting Game** fully implemented:

| Topic | Sub-games |
|-------|-----------|
| Bilangan Bulat | 6 games (Penjumlahan, Pengurangan, Perkalian, Pembagian, Operasi Campuran, KPK/FPB) |
| Pecahan (Bilangan Rasional) | 12 games (Arti Pecahan, Campuran/Persen, Penjumlahan, Pengurangan, Perkalian, Pembagian, Desimal ×5, Pembulatan) |
| Aljabar | 8 games (Pengertian/Unsur, Penjumlahan/Pengurangan, Perkalian, Pembagian, Pemangkatan, Substitusi, Faktorisasi, Operasi Pecahan) |
| PLSV & PtLSV | 7 games (Kalimat Terbuka, Pengertian PLSV, Penyelesaian PLSV, Model Matematika PLSV, Pengertian PtLSV, Penyelesaian PtLSV, Model Matematika PtLSV) |
| Perbandingan | 4 games (Umum/Rasio, Senilai/Berbalik, Campuran, Skala) |
| Aritmetika Sosial | 6 games (Jual Beli, Diskon, Bruto/Netto/Tara, Bunga Tunggal, PPN, PPh) |
| Garis dan Sudut | 4 games (Hubungan 2 Garis, Sudut Pelurus/Penyiku, Sifat Sudut Sejajar, Jumlah Sudut Segibanyak) |
| Segitiga dan Segiempat | 5 games (Garis Berat/Bagi/Tinggi, Keliling, Luas Segitiga, Luas Segiempat, Bangun Tak Beraturan) |
| Himpunan | 4 games (Pengertian/Keanggotaan, Berhingga/Kosong/Tak Hingga, Diagram Venn, Pemecahan Masalah) |

## Content Status

- **Kelas 9 — Materi Matematika — Fungsi Kuadrat (Pengayaan)**: 6 sub-topics fully implemented
  - BENTUK UMUM DAN KARAKTERISTIK GRAFIK: Intro, teori lengkap (SVG visual parabola), 6 contoh soal bertahap
  - TITIK POTONG TERHADAP SUMBU-SUMBU: Teori diskriminan, SVG diagram 3 kasus, 6 contoh soal
  - SUMBU SIMETRI DAN TITIK PUNCAK (OPTIMUM): Rumus xp & yp, SVG vertex diagram, metode melengkapi kuadrat, 6 contoh soal
  - MENGGAMBAR GRAFIK FUNGSI KUADRAT: 5-langkah sistematis, tabel nilai SVG, 6 contoh soal
  - MENYUSUN FUNGSI KUADRAT: 3 cara (akar, vertex, 3 titik), tabel panduan, 6 contoh soal + pembuktian
  - PENERAPAN FUNGSI KUADRAT (NILAI MAKSIMUM/MINIMUM): Konteks nyata (fisika, ekonomi, geometri), 6 soal kontekstual bertahap

- **Kelas 8 — Latihan Mandiri — Bangun Ruang Sisi Datar**: 4 sub-topics fully implemented (160 soal total)
  - KUBUS: 40 soal (unsur-unsur, luas permukaan, volume, jaring-jaring, kontekstual) — sky/cyan theme with 3D isometric cube SVG
  - BALOK: 40 soal (unsur-unsur, luas permukaan, volume, jaring-jaring, kontekstual) — emerald/teal theme with 3D cuboid SVG
  - PRISMA: 40 soal (segitiga, siku-siku, segiempat, luas permukaan, volume, kontekstual) — amber/orange theme with prism SVGs
  - LIMAS: 40 soal (segitiga, segiempat, segilima, apotema, luas permukaan, volume, kontekstual) — violet/purple theme with pyramid SVGs
  - All pages include: LaTeX formulas, inline formula reference cards, 3D SVG diagrams, UN/ANBK/TKA-style questions

- **Kelas 8 — Latihan Mandiri — Bangun Ruang Sisi Datar Gabungan**: 40 soal, route `/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar-gabungan`
  - Covers: Balok+Limas, Kubus+Prisma, dua balok (L-shape), limas terpancung, benda berlubang, 3 balok bertingkat
  - SVG diagrams: BalokLimas, KubusPrisma, DuaBalok, PrismaBalok (5 different combined solid types)
  - indigo/blue theme — direct single page (no sub-topics hub)

- **Kelas 8 — Garis Singgung Lingkaran**: All 5 sub-topics fully implemented with animated SVGs, LaTeX formulas, color-coded sections, 3-level examples, interactive tools.
  - Pengertian dan Sifat (3-case comparison SVG, tangent properties, inscribed circle problem)
  - Menghitung Panjang Garis Singgung (Pythagoras triangle SVG, 3 formula variations, two-tangent SVG)
  - GSPL (dual-circle external tangent SVG, animated glowing lines, proof construction)
  - GSPD (crossing X-pattern SVG, GSPL vs GSPD comparison table, combined problem)
  - Sabuk Lilitan Minimal (belt-around-circles SVG, interactive belt calculator, 3 applied problems)
- **Kelas 8 — Teorema Pythagoras**: All 6 sub-topics fully implemented with animated SVGs, interactive tools, LaTeX formulas, color-coded blocks, 3-level examples (Mudah/Sedang/Sulit), and summaries.
  - Pembuktian Teorema Pythagoras (visual square-arrangement proof with animated SVG)
  - Menghitung Panjang Sisi Segitiga Siku-siku (three formula variations, bar chart visual)
  - Triple Pythagoras (full table of triples, interactive triple checker, kelipatan pattern)
  - Pythagoras dan Jenis-jenis Segitiga (three triangle types, interactive type classifier)
  - Perbandingan Sisi Segitiga Siku-siku Sudut Khusus (45-45-90 and 30-60-90 with animated SVGs)
  - Penerapan Teorema Pythagoras pada Masalah Kontekstual (real-world problems with sketches)
- **Kelas 8 — Persamaan Garis Lurus**: All 5 sub-topics fully implemented with rich content, extensive SVG coordinate-system diagrams (6-panel galleries, slope triangles, BEP charts, growth graphs), LaTeX formulas, collapsible sections, color-coded blocks, 3-level examples, and summary sections.
  - Grafik Persamaan Garis Lurus
  - Gradien (Kemiringan Garis)
  - Menentukan Persamaan Garis Lurus
  - Hubungan 2 Garis
  - Aplikasi Persamaan Garis pada Soal Kontekstual
- **Kelas 8 — Relasi dan Fungsi**: All 5 sub-topics fully implemented with rich content, LaTeX formulas, interactive collapsible sections, color-coded visual blocks, SVG charts, 3-level example problems (Easy/Medium/Hard) with full solutions, and summary sections.
  - Pengertian Relasi dan Penyajiannya
  - Pengertian Fungsi dan Penyajiannya
  - Menentukan Banyak Fungsi dan Korespondensi Satu-Satu
  - Notasi dan Rumus Fungsi
  - Grafik Fungsi

## Project Structure

```
server.ts          # Express API server (AI chat endpoint)
src/               # React frontend
  App.tsx
  main.tsx
  pages/           # Route pages
  components/      # UI components
  contexts/        # React context providers
  hooks/           # Custom hooks
  lib/             # Utilities
vite.config.ts     # Vite config (proxy /api → localhost:3001)
```

## Completed Content Pages

### Kelas 9 - Kesebangunan dan Kekongruenan — Materi Matematika (all 5 sub-bab)
- `/materi-matematika/kelas-9/kesebangunan-kekongruenan/definisi` — Definisi Kesebangunan dan Kekongruenan
- `/materi-matematika/kelas-9/kesebangunan-kekongruenan/menghitung-panjang-rusuk` — Menghitung Panjang Rusuk Bangun Datar yang Sebangun
- `/materi-matematika/kelas-9/kesebangunan-kekongruenan/segitiga-sebangun` — Segitiga – Segitiga yang Sebangun
- `/materi-matematika/kelas-9/kesebangunan-kekongruenan/perbandingan-rusuk-siku-siku` — Perbandingan Rusuk Segitiga Siku-siku
- `/materi-matematika/kelas-9/kesebangunan-kekongruenan/kekongruenan-bangun-datar` — Kekongruenan pada Bangun Datar

### Kelas 9 - Kesebangunan dan Kekongruenan — Latihan Mandiri (all 5 sub-bab, 200 soal total)
- Shared SVG geometry component: `src/pages/latihan-mandiri/kelas9/kesebangunan-kekongruenan/GeoFigure.tsx`
  - Exports: SimilarTriangles, SimilarRects, TriangleAltitude, CongruentTriangles, ParallelLinesTriangle, RightTriangleRatio, TwoShapesCongruent, ScaleFigure
- `/latihan-mandiri/kelas-9/kesebangunan-kekongruenan/definisi` — Definisi (40 soal, cyan theme, SimilarRects/CongruentTriangles/TwoShapesCongruent diagrams)
- `/latihan-mandiri/kelas-9/kesebangunan-kekongruenan/menghitung-rusuk` — Menghitung Rusuk (40 soal, orange theme, SimilarRects/ParallelLinesTriangle/ScaleFigure diagrams)
- `/latihan-mandiri/kelas-9/kesebangunan-kekongruenan/segitiga-sebangun` — Segitiga Sebangun (40 soal, violet theme, SimilarTriangles/ParallelLinesTriangle/TriangleAltitude diagrams)
- `/latihan-mandiri/kelas-9/kesebangunan-kekongruenan/rasio-rusuk` — Rasio Rusuk Siku-Siku (40 soal, emerald theme, TriangleAltitude/RightTriangleRatio/SimilarTriangles diagrams)
- `/latihan-mandiri/kelas-9/kesebangunan-kekongruenan/kekongruenan` — Kekongruenan (40 soal, rose theme, CongruentTriangles/TwoShapesCongruent/SimilarTriangles diagrams)

### Kelas 9 - Peluang (1 of 5 sub-bab completed)
- `/materi-matematika/kelas-9/peluang/ruang-sampel` — Ruang Sampel & Titik Sampel (definisi, notasi n(S)/n(K), kejadian tunggal: koin/dadu/kartu bridge, kejadian majemuk: 2koin/3koin/2dadu/koin+dadu, tabel silang, diagram pohon, 6 contoh soal bertahap)

### Kelas 9 - Statistika (6 of 6 sub-bab completed)
- `/materi-matematika/kelas-9/statistika/pengantar` — Pengantar Statistika & Pengumpulan Data (definisi, jenis data, metode pengumpulan, jenis penyajian, 9 contoh soal)
- `/materi-matematika/kelas-9/statistika/penyajian-data` — Penyajian Data (batang daun, diagram batang, garis, lingkaran, tabel distribusi frekuensi, 15 contoh soal)
- `/materi-matematika/kelas-9/statistika/rata-rata` — Ukuran Pemusatan: Rata-rata & Rata-rata Gabungan (data tunggal, tabel distribusi, diagram batang, gabungan masuk, gabungan keluar, 15 contoh soal)
- `/materi-matematika/kelas-9/statistika/median-modus` — Ukuran Pemusatan: Median & Modus (data ganjil, data genap, tabel distribusi frekuensi, modus tunggal, modus berkelompok, 15 contoh soal)
- `/materi-matematika/kelas-9/statistika/kuartil` — Ukuran Letak Data: Kuartil (Q1/Q2/Q3, data tunggal dengan interpolasi, tabel distribusi frekuensi tunggal via FK, 6 contoh soal bertahap)
- `/materi-matematika/kelas-9/statistika/penyebaran-data` — Ukuran Penyebaran Data: Jangkauan, JIK, Simpangan Kuartil (data tunggal & tabel distribusi frekuensi tunggal, 6 contoh soal bertahap)

### Kelas 9 - Transformasi Geometri
- `/materi-matematika/kelas-9/transformasi-geometri/dilatasi` — Dilatasi (full content with SVG diagrams, 9 examples)

### Math Game Arena - Kelas 7 - Aritmetika Sosial (5 games, meteor shooting)
- `/math-game-arena/kelas-7/aritmetika-sosial/jual-beli-untung-rugi` — Jual Beli, Untung dan Rugi
- `/math-game-arena/kelas-7/aritmetika-sosial/diskon` — Diskon
- `/math-game-arena/kelas-7/aritmetika-sosial/bruto-netto-tara` — Bruto, Netto dan Tara
- `/math-game-arena/kelas-7/aritmetika-sosial/ppn` — Pajak Pertambahan Nilai (PPN)
- `/math-game-arena/kelas-7/aritmetika-sosial/pph` — Pajak Penghasilan (PPh)
- Shared reusable game component: `src/components/MeteorShootingGame.tsx`

### Bank Soal - Bangun Ruang Sisi Datar (100 soal, completed)
- `/bank-soal/bangun-ruang-sisi-datar` — Kubus, Balok, Prisma, Limas
- `/bank-soal/bangun-ruang-sisi-lengkung` — Tabung, Kerucut, Bola, Belahan Bola, Gabungan (100 soal)
  - 35 Mudah (Q1–Q35): luas permukaan & volume kubus/balok/prisma/limas, jaring-jaring, diagonal, kontekstual
  - 35 Sedang (Q36–Q70): diagonal balok/kubus, prisma trapesium, bangun gabungan, ANBK, TKA, HOTS, perbandingan
  - 30 Sulit (Q71–Q100): HOTS, TKA, ANBK, Literasi Matematika, dimensi berubah, bangun gabungan kompleks
  - Tipe soal: 88 PG, 7 MCMA (PG Kompleks), 5 Benar/Salah
  - SVG visual: KubusSVG, BalokSVG, PrismaSegitigaSVG, LimasPersegiSVG, JaringKubusSVG, JaringBalokSVG, DiagonalKubusSVG, GabunganKubusLimasSVG, PrismaTrapesiumSVG, FormulaBoxSVG
  - File: `src/pages/bank-soal/BangunRuangSisiDatarPage.tsx`

### Bank Soal - SPLDV (100 soal, completed)
- `/bank-soal/spldv` — Sistem Persamaan Linear Dua Variabel
  - 35 Mudah (Q1–Q35): konsep dasar, verifikasi solusi, metode substitusi/eliminasi/campuran/grafik, kontekstual
  - 40 Sedang (Q36–Q75): UN, ANBK, TKA, HOTS, literasi matematika, kontekstual lanjutan
  - 25 Sulit (Q76–Q100): HOTS, olimpiade, TKA, ANBK, literasi matematika tinggi, sifat-sifat SPLDV
  - Tipe soal: 94 PG, 4 MCMA (PG Kompleks), 2 Benar/Salah
  - SVG visual: SPLDVSystemSVG, GrafikSPLDVSVG, SubstitusiSVG, EliminasiSVG, KontekstualSPLDVSVG
  - File: `src/pages/bank-soal/SPLDVPage.tsx`

## Notes

- LKPD menu added on 2026-04-19: new main menu entry `/lkpd` opens an interactive guided worksheet for "Perbandingan Umum, Satuan Pembanding, dan Rasio" with discovery prompts, fill-in answers, instant correctness checking, hints, reset, and final score.
- Limas material updated on 2026-04-18: slide 7 renamed and refocused as "Hubungan Antar-Unsur pada Limas dan Kaitannya dengan Teorema Pythagoras"; slide 8 now covers Luas Permukaan Limas with tabbed jaring-jaring for limas segitiga, segiempat, and segilima plus `Lp = La + sisi tegak` formulas.
- Replit migration verified on 2026-04-19: npm dependencies installed, workflow starts cleanly on the Replit web port, frontend loads successfully, `/api/chat` stays server-side and safely reports missing AI credentials without exposing keys, and duplicate-key Vite warnings in imported content data were resolved.
- Math Game Arena Umum updated on 2026-04-19: added `Kereta Koin Math` at `/math-game-arena/umum/kereta-koin-math`, a full-color lane-switching canvas game with arithmetic questions, answer coins, bombs, combo scoring, levels, timer, and touch/keyboard controls.
- Math Game Arena Umum updated on 2026-04-19: added `Ninja Buah Math` at `/math-game-arena/umum/ninja-buah-math`, a full-color fruit-slicing canvas game where players click/touch correct-answer fruits, avoid wrong fruits and bombs, and build combos under a timer.
- Math Game Arena Umum updated on 2026-04-19: added `Pulau Harta Math` at `/math-game-arena/umum/pulau-harta-math`, a full-color treasure-island canvas game where players steer a ship to catch correct-answer treasure, avoid bombs/wrong answers, build combos, gain levels, and collect time bonuses with keyboard/touch controls.
- Math Game Arena Umum updated on 2026-04-19: added `Kapal Selam Math Battle` at `/math-game-arena/umum/kapal-selam-math-battle`, a full-color submarine combat canvas game where players shoot bombing planes above, fire side torpedoes at enemy submarines from left/right, target matching numbers, build combos, and level up with keyboard/touch controls.
- Math Game Arena Umum updated on 2026-04-19: added `Pacman Math` at `/math-game-arena/umum/pacman-math`, a full-color classic Pac-Man-style canvas game with a 21×21 hand-crafted maze, smooth grid-based movement, 2–4 chasing ghosts with frightened mode, 4 colored power pellets each showing one math answer option (correct = +500 pts + scare ghosts), tunnel warp at row 10, particle burst effects, 3 lives, and 6 escalating levels.
- Math Game Arena Umum updated on 2026-04-19: added `Zuma Math` at `/math-game-arena/umum/zuma-math`, a full-color Zuma-style canvas game where players rotate a cannon to shoot colored balls (4 neon colors) into a winding chain, pop 3+ same-color clusters, with each color mapped to a math answer choice — popping the correct-answer color earns bonus points with cascades and combos.
- Math Game Arena Umum updated on 2026-04-19: added `Space Impact Math` at `/math-game-arena/umum/space-impact`, a full-color space shooter canvas game inspired by Nokia Space Impact where players fly a neon spaceship, shoot enemies carrying math answers (yellow = correct), collect power-ups (shield, rapid fire, spread shot), and survive 10 escalating waves with keyboard/touch controls.
- Limas material updated on 2026-04-18: slide 7 now includes tilted Limas Segitiga and Limas Segiempat diagrams with Pythagorean relationships for apothem, lateral edge, and side-face triangles.
- Limas material updated on 2026-04-18: slides 3–5 now mirror Prisma's comparison format, showing interactive Limas Segitiga, Segiempat, and Segilima views for rusuk, sisi, and titik sudut.
- Balok material updated on 2026-04-18: slide 10 now shows 10 larger net variations for cuboid nets.
- Balok material updated on 2026-04-18: slide 1 uses uploaded real-object images with source attribution, and slide 8 now shows 6 separate ABCD.EFGH cuboids for the six diagonal planes with distinct colors and pulsing highlights.
- Replit migration completed on 2026-04-18: dependencies installed and `.npmrc` set to `legacy-peer-deps=true` so npm preserves the app's existing React 18 dependency tree despite optional peer dependencies from transitive packages.
- Merge conflicts from Vercel migration were resolved on 2026-03-12
- Server binds to `0.0.0.0` for Replit compatibility
- Chat AI requests now go through Express `/api/chat` so browser code does not expose external AI API keys
- In production, Express serves the built frontend (`dist/`) and handles all routes
- Content pages use accordion sections, react-katex for LaTeX, SVG diagrams, color-coded difficulty badges
