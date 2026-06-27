import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Target, TrendingUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    pageTitle: "BARISAN DAN DERET GEOMETRI",
    pageSubtitle: "Barisan dengan Rasio Tetap — Pertumbuhan Eksponensial!",
    breadcrumb: "Kelas 8 · Pola Bilangan · Materi Matematika",
    sec1Banner: "📐 BAGIAN 1 — SUKU KE-N BARISAN GEOMETRI",
    introTitle: "🌟 Apa Itu Barisan Geometri?",
    introBody: "Bayangkan sebuah bakteri yang membelah diri menjadi dua setiap 15 menit. Jika pada menit ke-0 ada 1 bakteri, maka setelah 15 menit ada 2, setelah 30 menit ada 4, setelah 45 menit ada 8, dan seterusnya. Setiap suku diperoleh dengan mengalikan suku sebelumnya dengan bilangan tetap (2). Inilah barisan geometri! Perbedaan utama dengan barisan aritmetika: aritmetika menambah bilangan tetap (beda), geometri mengalikan bilangan tetap (rasio).",
    figcaption: "🦠 Pembelahan bakteri — contoh nyata pertumbuhan geometri dengan rasio 2",
    componentsTitle: "🔑 Komponen Utama Barisan Geometri",
    components: [
      { simbol: "a atau U₁", nama: "Suku pertama", desc: "Bilangan awal dalam barisan", color: "bg-cyan-900/50 border-cyan-500/40 text-cyan-200" },
      { simbol: "r", nama: "Rasio (perbandingan)", desc: "Faktor pengali tetap: r = Uₙ / Uₙ₋₁", color: "bg-violet-900/50 border-violet-500/40 text-violet-200" },
      { simbol: "n", nama: "Nomor suku", desc: "Urutan suku (suku ke-1, ke-2, ke-n ...)", color: "bg-orange-900/50 border-orange-500/40 text-orange-200" },
      { simbol: "Uₙ", nama: "Suku ke-n", desc: "Nilai suku pada posisi ke-n", color: "bg-green-900/50 border-green-500/40 text-green-200" },
    ],
    formulaTitle: "📘 Rumus Suku Ke-n Barisan Geometri",
    formulaSummaryTitle: "🎯 Ringkasan Intisari",
    formulaSummaryBody: "Barisan geometri memiliki rasio (r) tetap antara suku-suku berurutan. Berbeda dengan aritmetika yang menjumlah, geometri mengalikan — sehingga pertumbuhannya bersifat eksponensial.",
    arcPanelHeader: "✨ Contoh Barisan Geometri",
    formulaBoxLabel: "Rumus Suku ke-n Barisan Geometri:",
    aLabel: "a = suku pertama", rLabel: "r = rasio tetap", nLabel: "n = nomor suku",
    derivationTitle: "💡 Dari mana rumus",
    derivationSuffix: "berasal?",
    tableCol1: "Suku ke-", tableCol2: "Nilai Suku", tableCol3: "Berapa kali kali r?",
    timesWord: "kali",
    patternTitle: "🔍 Perhatikan polanya:",
    bullets: [
      <>• Suku ke-<strong className="text-orange-300">1</strong> = <InlineMath math="a" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ kalikan <InlineMath math="r" /> sebanyak <strong className="text-violet-300">0</strong> kali</>,
      <>• Suku ke-<strong className="text-orange-300">2</strong> = <InlineMath math="a \cdot r" /> &nbsp;&nbsp;&nbsp;&nbsp;→ kalikan <InlineMath math="r" /> sebanyak <strong className="text-violet-300">1</strong> kali</>,
      <>• Suku ke-<strong className="text-orange-300">3</strong> = <InlineMath math="a \cdot r^2" /> &nbsp;&nbsp;→ kalikan <InlineMath math="r" /> sebanyak <strong className="text-violet-300">2</strong> kali</>,
      <>• Suku ke-<strong className="text-orange-300">4</strong> = <InlineMath math="a \cdot r^3" /> &nbsp;&nbsp;→ kalikan <InlineMath math="r" /> sebanyak <strong className="text-violet-300">3</strong> kali</>,
      <p className="text-cyan-300 font-semibold pt-1">• Suku ke-<strong className="text-orange-300">n</strong> = <InlineMath math="a \cdot r^{n-1}" /> → kalikan <InlineMath math="r" /> sebanyak <strong className="text-violet-300">(n−1)</strong> kali</p>,
    ],
    conclusionLabel: "Kesimpulan — Rumus Umum Suku ke-n:",
    conclusionNote: <>karena setiap suku ke-<InlineMath math="n" /> diperoleh dengan mengalikan <InlineMath math="r" /> sebanyak <InlineMath math="(n-1)" /> kali dari suku pertama <InlineMath math="a" /></>,
    howToUseTitle: "📌 Cara Menghitung Rasio (r)",
    howToUseBody: <>Rasio diperoleh dengan <strong className="text-yellow-200">membagi suku manapun dengan suku sebelumnya</strong>. Ciri khas barisan geometri: nilai rasio selalu sama untuk setiap pasangan suku berurutan.</>,
    howToUseNote: <>Jika <InlineMath math="a" /> dan <InlineMath math="r" /> sudah diketahui, substitusikan nilai <InlineMath math="n" /> ke dalam rumus <InlineMath math="U_n = a \cdot r^{n-1}" /> untuk mendapatkan suku manapun! ✨</>,
    badgeEasy: "MUDAH", badgeMedium: "SEDANG", badgeHard: "SULIT",
    problemLabel: "📝 Soal", solutionLabel: "🔍 Pembahasan",
    ex1Title: "✏️ Contoh 1 — Mudah (Suku ke-n)",
    ex1Problem: "Barisan geometri: 3, 6, 12, 24, ...\nTentukan suku ke-8!",
    ex1Ans: <>✅ Suku ke-8 = <strong>384</strong></>,
    ex2Title: "✏️ Contoh 2 — Sedang (Suku ke-n)",
    ex2Problem: "Suku ke-3 suatu barisan geometri adalah 18 dan suku ke-6 adalah 486. Tentukan suku pertama (a) dan rasio (r), lalu hitung suku ke-10!",
    step1: "Langkah 1 — Buat dua persamaan:",
    step2: "Langkah 2 — Bagi persamaan (II) oleh (I):",
    step3: <>Langkah 3 — Cari <InlineMath math="a" /> dan hitung <InlineMath math="U_{10}" />:</>,
    ex2Ans: <><InlineMath math="a = 2" />, <InlineMath math="r = 3" />, <InlineMath math="U_{10} = 39{.}366" /></>,
    ex3Title: "✏️ Contoh 3 — Sulit (Suku ke-n, Aplikasi)",
    ex3Problem: <>Sebuah pabrik memproduksi <strong className="text-yellow-300">500 unit</strong> pada bulan pertama. Karena peningkatan kapasitas, produksi meningkat sebesar <strong className="text-cyan-300">20% setiap bulan</strong>.<br /><br />a) Berapa produksi pada bulan ke-6?<br />b) Pada bulan ke berapa produksi pertama kali melampaui 2.000 unit?</>,
    ex3Given: <>Diketahui: <InlineMath math="a = 500" />, <InlineMath math="r = 1{,}2" /> (naik 20%)</>,
    ex3Step1: <>a) Hitung produksi bulan ke-6 (<InlineMath math="U_6" />):</>,
    ex3Step2: "b) Cari n saat produksi > 2.000:",
    ex3Step2Note: "Coba substitusi nilai n secara berurutan:",
    ex3Step2Table: [
      { n: 4, val: "500 × 1.2³ = 864" }, { n: 5, val: "500 × 1.2⁴ = 1.036,8" },
      { n: 6, val: "500 × 1.2⁵ = 1.244,2" }, { n: 7, val: "500 × 1.2⁶ = 1.493" },
      { n: 8, val: "500 × 1.2⁷ ≈ 1.791,6" }, { n: 9, val: "500 × 1.2⁸ ≈ 2.149,9", highlight: true },
    ],
    ex3Ans: <>✅ Produksi bulan ke-6 ≈ <strong>1.244 unit</strong>. Pertama kali melampaui 2.000 unit pada bulan ke-<strong>9</strong>.</>,
    sec2Banner: "∑ BAGIAN 2 — DERET GEOMETRI",
    seriesTitle: "📘 Rumus Jumlah Deret Geometri",
    seriesSummaryTitle: "🎯 Ringkasan Intisari",
    seriesSummaryBody: <>Deret geometri adalah jumlah <InlineMath math="n" /> suku pertama barisan geometri. Rumusnya berbeda untuk <InlineMath math="r \neq 1" /> (ada dua varian bergantung nilai <InlineMath math="r" />) dan untuk <InlineMath math="r = 1" />.</>,
    derivSeriesTitle: "💡 Derivasi Rumus",
    derivStep1Title: "Langkah 1 — Tulis Sₙ dan kalikan dengan r",
    derivStep1Desc: <><InlineMath math="S_n = a + ar + ar^2 + \cdots + ar^{n-1}" />. Kalikan kedua ruas dengan <InlineMath math="r" />:</>,
    derivStep2Title: "Langkah 2 — Kurangkan kedua persamaan",
    derivStep2Desc: <><InlineMath math="S_n - rS_n = a - ar^n" />, sehingga <InlineMath math="S_n(1-r) = a(1-r^n)" /></>,
    derivStep3Title: "Langkah 3 — Bagi kedua ruas dengan (1-r)",
    formula1Label: "Rumus untuk |r| < 1 (pembilang 1 − rⁿ, penyebut 1 − r):",
    formula2Label: "Rumus untuk r > 1 (pembilang rⁿ − 1, penyebut r − 1):",
    specialLabel: "Kasus khusus r = 1:",
    ex1bTitle: "✏️ Contoh 1 — Mudah (Jumlah Deret)",
    ex1bProblem: "Barisan geometri: 2, 6, 18, 54, ...\nHitung jumlah 7 suku pertama!",
    ex1bAns: <><InlineMath math="S_7 = 2.186" /></>,
    ex2bTitle: "✏️ Contoh 2 — Sedang (Jumlah Deret)",
    ex2bProblem: <>Jumlah 5 suku pertama suatu deret geometri adalah 62 dan suku pertamanya adalah 2. Tentukan rasio dan suku ke-5!</>,
    ex2bStep1: <>Diketahui: <InlineMath math="S_5 = 62" />, <InlineMath math="a = 2" /></>,
    ex2bStep2: "Substitusi ke rumus Sₙ:",
    ex2bStep3: "Nilai r = 2 memenuhi persamaan:",
    ex2bStep4: <>Hitung <InlineMath math="U_5" />:</>,
    ex2bAns: <><InlineMath math="r = 2" />, <InlineMath math="U_5 = 32" /></>,
    ex3bTitle: "✏️ Contoh 3 — Sulit (Jumlah Deret)",
    ex3bProblem: "Sebuah bola dijatuhkan dari ketinggian 16 meter. Setiap kali memantul, bola hanya naik 3/4 dari ketinggian sebelumnya. Berapa total jarak tempuh bola sampai bola berhenti (panjang lintasan total)?",
    ex3bIdent: "Identifikasi:",
    ex3bGiven: <><InlineMath math="a = 16" /> m (jatuh pertama), tiap pantulan = <InlineMath math="3/4" /> dari sebelumnya</>,
    ex3bStep1: "Barisan ketinggian pantulan: 12, 9, 6.75, ...",
    ex3bStep2: "Total lintasan (awal turun + semua pantulan):",
    ex3bFormula: "Deret geometri tak hingga (r < 1):",
    ex3bNote: "Deret geometri tak hingga konvergen untuk |r| < 1:",
    ex3bAns: <>✅ Total lintasan = <strong>16 + 2 × 48 = 112 meter</strong></>,
    summaryHeader: "📐 RANGKUMAN LENGKAP",
    summarySubheader: "Barisan dan Deret Geometri — Kelas 8",
    summarySection1: "Rumus-Rumus Utama",
    summaryUnLabel: "🔢 Suku ke-n Barisan Geometri",
    summarySnLabel1: "∑ Jumlah n Suku Pertama (r ≠ 1)",
    summarySnLabel2: "∑ Jumlah Tak Hingga (|r| < 1)",
    summaryRatioLabel: "🔗 Sifat-Sifat Rasio (r)",
    ratioProps: [
      { cond: "r > 1", efek: "Barisan naik (bertumbuh)", color: "bg-green-900/40 border-green-500/40 text-green-200" },
      { cond: "0 < r < 1", efek: "Barisan turun mendekati 0", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-200" },
      { cond: "r < 0", efek: "Berganti tanda (+−+−...)", color: "bg-orange-900/40 border-orange-500/40 text-orange-200" },
      { cond: "r = 1", efek: "Semua suku sama (konstan)", color: "bg-slate-700/60 border-slate-500/40 text-slate-200" },
    ],
    tipsSection: "Tips & Trik Jitu Geometri",
    tips: [
      { icon: "⚡", tip: "Bagi suku berurutan untuk dapat r", detail: "r = U₂/U₁ = U₃/U₂. Jika hasilnya sama, barisan pasti geometri!", color: "bg-yellow-900/30 border-yellow-500/30" },
      { icon: "🔑", tip: "Trik dua persamaan untuk cari a dan r", detail: "Jika diketahui Uₘ dan Uₙ, bagi: Uₙ/Uₘ = rⁿ⁻ᵐ. Dari sini temukan r, lalu substitusi untuk cari a.", color: "bg-violet-900/30 border-violet-500/30" },
      { icon: "📐", tip: "Konversi waktu ke nomor suku", detail: "Pada soal pertumbuhan/peluruhan, ubah waktu menjadi nomor suku n. Misalnya setiap 15 menit → 2 jam = 8 kali pembelahan → n = 9.", color: "bg-green-900/30 border-green-500/30" },
      { icon: "🧮", tip: "Logaritma untuk mencari n", detail: "Jika Uₙ diketahui dan kamu butuh n: ambil log kedua ruas dari Uₙ = a·rⁿ⁻¹ untuk mengisolasi n.", color: "bg-cyan-900/30 border-cyan-500/30" },
      { icon: "🌀", tip: "Suku tengah barisan geometri", detail: "Jika U₁, U₂, U₃ geometri, maka U₂² = U₁ × U₃. Sifat ini berguna untuk soal tiga suku berurutan.", color: "bg-pink-900/30 border-pink-500/30" },
    ],
    conclusionTitle: "KESIMPULAN",
    conclusionBody: <>Barisan geometri adalah barisan dengan <strong className="text-violet-300">rasio tetap (r)</strong>. Pertumbuhannya bersifat <strong className="text-yellow-300">eksponensial</strong> — jauh lebih dahsyat daripada pertumbuhan linear aritmetika. Inilah yang menjelaskan ledakan bakteri, kekuatan bunga majemuk, dan bahkan penyebaran informasi viral di media sosial. Rumus <strong className="text-pink-300">Uₙ = a · rⁿ⁻¹</strong> memberi kamu kekuatan untuk menghitung pertumbuhan apapun dalam sekejap!</>,
    tags: ["Rasio Tetap (r)", "Uₙ = a·rⁿ⁻¹", "Sₙ = a(rⁿ−1)/(r−1)", "Eksponensial", "Bunga Majemuk"],
    nextPrompt: "🌟 Matematika adalah kunci memahami pertumbuhan alam semesta!",
    backBtn: "← Kembali ke Pola Bilangan",
    monthLabel: "Bulan ke-", unitLabel: "unit", firstExceedsLabel: "Pertama melebihi 2.000",
  },
  en: {
    pageTitle: "GEOMETRIC SEQUENCES & SERIES",
    pageSubtitle: "Sequences with Constant Ratio — Exponential Growth!",
    breadcrumb: "Grade 8 · Number Patterns · Math Content",
    sec1Banner: "📐 PART 1 — NTH TERM OF GEOMETRIC SEQUENCES",
    introTitle: "🌟 What Is a Geometric Sequence?",
    introBody: "Imagine a bacterium that splits in two every 15 minutes. If there is 1 bacterium at minute 0, after 15 minutes there are 2, after 30 minutes 4, after 45 minutes 8, and so on. Each term is obtained by multiplying the previous term by a fixed number (2). This is a geometric sequence! The key difference from arithmetic sequences: arithmetic adds a fixed number (common difference), geometric multiplies by a fixed number (common ratio).",
    figcaption: "🦠 Bacterial division — a real example of geometric growth with ratio 2",
    componentsTitle: "🔑 Key Components of a Geometric Sequence",
    components: [
      { simbol: "a or U₁", nama: "First term", desc: "The starting number in the sequence", color: "bg-cyan-900/50 border-cyan-500/40 text-cyan-200" },
      { simbol: "r", nama: "Common ratio", desc: "Constant multiplier: r = Uₙ / Uₙ₋₁", color: "bg-violet-900/50 border-violet-500/40 text-violet-200" },
      { simbol: "n", nama: "Term number", desc: "Position of the term (term 1, 2, n...)", color: "bg-orange-900/50 border-orange-500/40 text-orange-200" },
      { simbol: "Uₙ", nama: "nth term", desc: "Value of the term at position n", color: "bg-green-900/50 border-green-500/40 text-green-200" },
    ],
    formulaTitle: "📘 nth Term Formula for Geometric Sequences",
    formulaSummaryTitle: "🎯 Key Summary",
    formulaSummaryBody: "A geometric sequence has a constant ratio (r) between consecutive terms. Unlike arithmetic which adds, geometric multiplies — resulting in exponential growth.",
    arcPanelHeader: "✨ Geometric Sequence Examples",
    formulaBoxLabel: "Formula for the nth term of a Geometric Sequence:",
    aLabel: "a = first term", rLabel: "r = common ratio", nLabel: "n = term number",
    derivationTitle: "💡 Where does the formula",
    derivationSuffix: "come from?",
    tableCol1: "Term No.", tableCol2: "Term Value", tableCol3: "How many times multiply r?",
    timesWord: "times",
    patternTitle: "🔍 Observe the pattern:",
    bullets: [
      <>• Term <strong className="text-orange-300">1</strong> = <InlineMath math="a" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ multiply <InlineMath math="r" /> <strong className="text-violet-300">0</strong> times</>,
      <>• Term <strong className="text-orange-300">2</strong> = <InlineMath math="a \cdot r" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ multiply <InlineMath math="r" /> <strong className="text-violet-300">1</strong> time</>,
      <>• Term <strong className="text-orange-300">3</strong> = <InlineMath math="a \cdot r^2" /> &nbsp;&nbsp;&nbsp;→ multiply <InlineMath math="r" /> <strong className="text-violet-300">2</strong> times</>,
      <>• Term <strong className="text-orange-300">4</strong> = <InlineMath math="a \cdot r^3" /> &nbsp;&nbsp;&nbsp;→ multiply <InlineMath math="r" /> <strong className="text-violet-300">3</strong> times</>,
      <p className="text-cyan-300 font-semibold pt-1">• Term <strong className="text-orange-300">n</strong> = <InlineMath math="a \cdot r^{n-1}" /> → multiply <InlineMath math="r" /> <strong className="text-violet-300">(n−1)</strong> times</p>,
    ],
    conclusionLabel: "Conclusion — General Formula for nth Term:",
    conclusionNote: <>because each nth term is obtained by multiplying <InlineMath math="r" /> exactly <InlineMath math="(n-1)" /> times from the first term <InlineMath math="a" /></>,
    howToUseTitle: "📌 How to Calculate the Common Ratio (r)",
    howToUseBody: <>The ratio is obtained by <strong className="text-yellow-200">dividing any term by the previous term</strong>. The hallmark of a geometric sequence: the ratio is always the same for every pair of consecutive terms.</>,
    howToUseNote: <>If <InlineMath math="a" /> and <InlineMath math="r" /> are known, substitute the value of <InlineMath math="n" /> into <InlineMath math="U_n = a \cdot r^{n-1}" /> to find any term! ✨</>,
    badgeEasy: "EASY", badgeMedium: "MEDIUM", badgeHard: "HARD",
    problemLabel: "📝 Problem", solutionLabel: "🔍 Solution",
    ex1Title: "✏️ Example 1 — Easy (nth Term)",
    ex1Problem: "Geometric sequence: 3, 6, 12, 24, ...\nFind the 8th term!",
    ex1Ans: <>✅ 8th term = <strong>384</strong></>,
    ex2Title: "✏️ Example 2 — Medium (nth Term)",
    ex2Problem: "The 3rd term of a geometric sequence is 18 and the 6th term is 486. Find the first term (a) and common ratio (r), then calculate the 10th term!",
    step1: "Step 1 — Set up two equations:",
    step2: "Step 2 — Divide equation (II) by (I):",
    step3: <>Step 3 — Find <InlineMath math="a" /> and calculate <InlineMath math="U_{10}" />:</>,
    ex2Ans: <><InlineMath math="a = 2" />, <InlineMath math="r = 3" />, <InlineMath math="U_{10} = 39{,}366" /></>,
    ex3Title: "✏️ Example 3 — Hard (nth Term, Application)",
    ex3Problem: <>A factory produces <strong className="text-yellow-300">500 units</strong> in the first month. Due to capacity improvements, production increases by <strong className="text-cyan-300">20% each month</strong>.<br /><br />a) How many units are produced in month 6?<br />b) In which month does production first exceed 2,000 units?</>,
    ex3Given: <>Given: <InlineMath math="a = 500" />, <InlineMath math="r = 1.2" /> (20% increase)</>,
    ex3Step1: <>a) Calculate production in month 6 (<InlineMath math="U_6" />):</>,
    ex3Step2: "b) Find n when production > 2,000:",
    ex3Step2Note: "Try substituting values of n in sequence:",
    ex3Step2Table: [
      { n: 4, val: "500 × 1.2³ = 864" }, { n: 5, val: "500 × 1.2⁴ = 1,036.8" },
      { n: 6, val: "500 × 1.2⁵ = 1,244.2" }, { n: 7, val: "500 × 1.2⁶ = 1,493" },
      { n: 8, val: "500 × 1.2⁷ ≈ 1,791.6" }, { n: 9, val: "500 × 1.2⁸ ≈ 2,149.9", highlight: true },
    ],
    ex3Ans: <>✅ Month 6 production ≈ <strong>1,244 units</strong>. Production first exceeds 2,000 in month <strong>9</strong>.</>,
    sec2Banner: "∑ PART 2 — GEOMETRIC SERIES",
    seriesTitle: "📘 Geometric Series Sum Formula",
    seriesSummaryTitle: "🎯 Key Summary",
    seriesSummaryBody: <>A geometric series is the sum of the first <InlineMath math="n" /> terms of a geometric sequence. The formula differs for <InlineMath math="r \neq 1" /> (two variants depending on <InlineMath math="r" />) and for <InlineMath math="r = 1" />.</>,
    derivSeriesTitle: "💡 Derivation of the Formula",
    derivStep1Title: "Step 1 — Write Sₙ and multiply by r",
    derivStep1Desc: <><InlineMath math="S_n = a + ar + ar^2 + \cdots + ar^{n-1}" />. Multiply both sides by <InlineMath math="r" />:</>,
    derivStep2Title: "Step 2 — Subtract the two equations",
    derivStep2Desc: <><InlineMath math="S_n - rS_n = a - ar^n" />, so <InlineMath math="S_n(1-r) = a(1-r^n)" /></>,
    derivStep3Title: "Step 3 — Divide both sides by (1-r)",
    formula1Label: "Formula for |r| < 1 (numerator 1 − rⁿ, denominator 1 − r):",
    formula2Label: "Formula for r > 1 (numerator rⁿ − 1, denominator r − 1):",
    specialLabel: "Special case r = 1:",
    ex1bTitle: "✏️ Example 1 — Easy (Sum of Series)",
    ex1bProblem: "Geometric sequence: 2, 6, 18, 54, ...\nFind the sum of the first 7 terms!",
    ex1bAns: <><InlineMath math="S_7 = 2{,}186" /></>,
    ex2bTitle: "✏️ Example 2 — Medium (Sum of Series)",
    ex2bProblem: <>The sum of the first 5 terms of a geometric series is 62 and the first term is 2. Find the common ratio and the 5th term!</>,
    ex2bStep1: <>Given: <InlineMath math="S_5 = 62" />, <InlineMath math="a = 2" /></>,
    ex2bStep2: "Substitute into the Sₙ formula:",
    ex2bStep3: "r = 2 satisfies the equation:",
    ex2bStep4: <>Calculate <InlineMath math="U_5" />:</>,
    ex2bAns: <><InlineMath math="r = 2" />, <InlineMath math="U_5 = 32" /></>,
    ex3bTitle: "✏️ Example 3 — Hard (Sum of Series)",
    ex3bProblem: "A ball is dropped from a height of 16 meters. Each time it bounces, it only rises to 3/4 of the previous height. What is the total distance the ball travels before stopping?",
    ex3bIdent: "Identify:",
    ex3bGiven: <><InlineMath math="a = 16" /> m (first drop), each bounce = <InlineMath math="3/4" /> of the previous</>,
    ex3bStep1: "Bounce height sequence: 12, 9, 6.75, ...",
    ex3bStep2: "Total path (initial drop + all bounces):",
    ex3bFormula: "Infinite geometric series (r < 1):",
    ex3bNote: "Infinite geometric series converges for |r| < 1:",
    ex3bAns: <>✅ Total path = <strong>16 + 2 × 48 = 112 meters</strong></>,
    summaryHeader: "📐 COMPLETE SUMMARY",
    summarySubheader: "Geometric Sequences & Series — Grade 8",
    summarySection1: "Key Formulas",
    summaryUnLabel: "🔢 nth Term of Geometric Sequence",
    summarySnLabel1: "∑ Sum of First n Terms (r ≠ 1)",
    summarySnLabel2: "∑ Infinite Sum (|r| < 1)",
    summaryRatioLabel: "🔗 Properties of the Ratio (r)",
    ratioProps: [
      { cond: "r > 1", efek: "Increasing sequence (growth)", color: "bg-green-900/40 border-green-500/40 text-green-200" },
      { cond: "0 < r < 1", efek: "Decreasing sequence approaching 0", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-200" },
      { cond: "r < 0", efek: "Alternating signs (+−+−...)", color: "bg-orange-900/40 border-orange-500/40 text-orange-200" },
      { cond: "r = 1", efek: "All terms equal (constant)", color: "bg-slate-700/60 border-slate-500/40 text-slate-200" },
    ],
    tipsSection: "Key Tips & Tricks for Geometric",
    tips: [
      { icon: "⚡", tip: "Divide consecutive terms to get r", detail: "r = U₂/U₁ = U₃/U₂. If the result is always the same, it's definitely geometric!", color: "bg-yellow-900/30 border-yellow-500/30" },
      { icon: "🔑", tip: "Two-equation trick to find a and r", detail: "If Uₘ and Uₙ are given, divide: Uₙ/Uₘ = rⁿ⁻ᵐ. Find r, then substitute to find a.", color: "bg-violet-900/30 border-violet-500/30" },
      { icon: "📐", tip: "Convert time to term number", detail: "For growth/decay problems, convert time to term number n. For example, every 15 minutes → 2 hours = 8 divisions → n = 9.", color: "bg-green-900/30 border-green-500/30" },
      { icon: "🧮", tip: "Logarithms to find n", detail: "If Uₙ is known and you need n: take the log of both sides of Uₙ = a·rⁿ⁻¹ to isolate n.", color: "bg-cyan-900/30 border-cyan-500/30" },
      { icon: "🌀", tip: "Middle term of geometric sequence", detail: "If U₁, U₂, U₃ are geometric, then U₂² = U₁ × U₃. Useful for problems with three consecutive terms.", color: "bg-pink-900/30 border-pink-500/30" },
    ],
    conclusionTitle: "CONCLUSION",
    conclusionBody: <>A geometric sequence has a <strong className="text-violet-300">constant ratio (r)</strong>. Its growth is <strong className="text-yellow-300">exponential</strong> — far more powerful than linear arithmetic growth. This explains bacterial explosions, the power of compound interest, and even the viral spread of information on social media. The formula <strong className="text-pink-300">Uₙ = a · rⁿ⁻¹</strong> gives you the power to calculate any growth instantly!</>,
    tags: ["Constant Ratio (r)", "Uₙ = a·rⁿ⁻¹", "Sₙ = a(rⁿ−1)/(r−1)", "Exponential", "Compound Interest"],
    nextPrompt: "🌟 Mathematics is the key to understanding the growth of the universe!",
    backBtn: "← Back to Number Patterns",
    monthLabel: "Month ", unitLabel: "units", firstExceedsLabel: "First exceeds 2,000",
  },
  ja: {
    pageTitle: "等比数列と等比級数",
    pageSubtitle: "公比一定の数列 — 指数関数的成長！",
    breadcrumb: "中学2年 · 数の規則性 · 数学教材",
    sec1Banner: "📐 第1節 — 等比数列の第n項",
    introTitle: "🌟 等比数列とは？",
    introBody: "15分ごとに2分裂するバクテリアを想像してください。0分目に1個のバクテリアがいたとすると、15分後は2個、30分後は4個、45分後は8個…と続きます。各項は前の項に一定の数(2)を掛けることで得られます。これが等比数列です！等差数列との主な違い：等差は一定の数を足す（公差）、等比は一定の数を掛ける（公比）。",
    figcaption: "🦠 バクテリアの分裂 — 公比2の等比成長の実例",
    componentsTitle: "🔑 等比数列の主要な構成要素",
    components: [
      { simbol: "a または U₁", nama: "第1項", desc: "数列の最初の数", color: "bg-cyan-900/50 border-cyan-500/40 text-cyan-200" },
      { simbol: "r", nama: "公比", desc: "一定の掛け算因数：r = Uₙ / Uₙ₋₁", color: "bg-violet-900/50 border-violet-500/40 text-violet-200" },
      { simbol: "n", nama: "項番号", desc: "項の位置（第1項、第2項、第n項...）", color: "bg-orange-900/50 border-orange-500/40 text-orange-200" },
      { simbol: "Uₙ", nama: "第n項", desc: "位置nの項の値", color: "bg-green-900/50 border-green-500/40 text-green-200" },
    ],
    formulaTitle: "📘 等比数列の第n項の公式",
    formulaSummaryTitle: "🎯 要点まとめ",
    formulaSummaryBody: "等比数列は連続する項の間に一定の公比(r)があります。等差は足し算、等比は掛け算 — 結果として指数関数的に成長します。",
    arcPanelHeader: "✨ 等比数列の例",
    formulaBoxLabel: "等比数列の第n項の公式：",
    aLabel: "a = 第1項", rLabel: "r = 公比", nLabel: "n = 項番号",
    derivationTitle: "💡 公式",
    derivationSuffix: "はどこから来るか？",
    tableCol1: "第n項", tableCol2: "項の値", tableCol3: "rを何回掛ける？",
    timesWord: "回",
    patternTitle: "🔍 パターンを観察：",
    bullets: [
      <>• 第<strong className="text-orange-300">1</strong>項 = <InlineMath math="a" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ <InlineMath math="r" />を<strong className="text-violet-300">0</strong>回掛ける</>,
      <>• 第<strong className="text-orange-300">2</strong>項 = <InlineMath math="a \cdot r" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ <InlineMath math="r" />を<strong className="text-violet-300">1</strong>回掛ける</>,
      <>• 第<strong className="text-orange-300">3</strong>項 = <InlineMath math="a \cdot r^2" /> &nbsp;&nbsp;&nbsp;&nbsp;→ <InlineMath math="r" />を<strong className="text-violet-300">2</strong>回掛ける</>,
      <>• 第<strong className="text-orange-300">4</strong>項 = <InlineMath math="a \cdot r^3" /> &nbsp;&nbsp;&nbsp;&nbsp;→ <InlineMath math="r" />を<strong className="text-violet-300">3</strong>回掛ける</>,
      <p className="text-cyan-300 font-semibold pt-1">• 第<strong className="text-orange-300">n</strong>項 = <InlineMath math="a \cdot r^{n-1}" /> → <InlineMath math="r" />を<strong className="text-violet-300">(n−1)</strong>回掛ける</p>,
    ],
    conclusionLabel: "まとめ — 第n項の一般式：",
    conclusionNote: <>第n項はaから始まりrを<InlineMath math="(n-1)" />回掛けたものだから</>,
    howToUseTitle: "📌 公比 (r) の求め方",
    howToUseBody: <>公比は<strong className="text-yellow-200">任意の項を前の項で割る</strong>ことで得られます。等比数列の特徴：連続する項のどのペアでも比が常に同じです。</>,
    howToUseNote: <><InlineMath math="a" />と<InlineMath math="r" />が分かったら、<InlineMath math="U_n = a \cdot r^{n-1}" />に<InlineMath math="n" />を代入すれば、どの項でもすぐに求められます！✨</>,
    badgeEasy: "基本", badgeMedium: "標準", badgeHard: "発展",
    problemLabel: "📝 問題", solutionLabel: "🔍 解説",
    ex1Title: "✏️ 例1 — 基本（第n項）",
    ex1Problem: "等比数列：3, 6, 12, 24, ...\n第8項を求めなさい！",
    ex1Ans: <>✅ 第8項 = <strong>384</strong></>,
    ex2Title: "✏️ 例2 — 標準（第n項）",
    ex2Problem: "ある等比数列の第3項は18、第6項は486である。第1項(a)と公比(r)を求め、第10項を計算しなさい！",
    step1: "ステップ1 — 2つの方程式を立てる：",
    step2: "ステップ2 — 方程式(II)を(I)で割る：",
    step3: <>ステップ3 — <InlineMath math="a" />を求め<InlineMath math="U_{10}" />を計算する：</>,
    ex2Ans: <><InlineMath math="a = 2" />、<InlineMath math="r = 3" />、<InlineMath math="U_{10} = 39{,}366" /></>,
    ex3Title: "✏️ 例3 — 発展（第n項・応用）",
    ex3Problem: <>工場が1ヶ月目に<strong className="text-yellow-300">500個</strong>を生産する。設備増強により<strong className="text-cyan-300">毎月20%増加</strong>する。<br /><br />a) 6ヶ月目の生産量は？<br />b) 何ヶ月目に初めて2,000個を超えるか？</>,
    ex3Given: <>既知：<InlineMath math="a = 500" />、<InlineMath math="r = 1.2" />（20%増）</>,
    ex3Step1: <>a) 6ヶ月目の生産量（<InlineMath math="U_6" />）を計算：</>,
    ex3Step2: "b) 生産量 > 2,000 となるnを求める：",
    ex3Step2Note: "nの値を順番に代入して試す：",
    ex3Step2Table: [
      { n: 4, val: "500 × 1.2³ = 864" }, { n: 5, val: "500 × 1.2⁴ = 1,036.8" },
      { n: 6, val: "500 × 1.2⁵ = 1,244.2" }, { n: 7, val: "500 × 1.2⁶ = 1,493" },
      { n: 8, val: "500 × 1.2⁷ ≈ 1,791.6" }, { n: 9, val: "500 × 1.2⁸ ≈ 2,149.9", highlight: true },
    ],
    ex3Ans: <>✅ 6ヶ月目の生産量 ≈ <strong>1,244個</strong>。初めて2,000個を超えるのは<strong>第9ヶ月目</strong>。</>,
    sec2Banner: "∑ 第2節 — 等比級数",
    seriesTitle: "📘 等比級数の和の公式",
    seriesSummaryTitle: "🎯 要点まとめ",
    seriesSummaryBody: <>等比級数は等比数列の最初の<InlineMath math="n" />項の和。<InlineMath math="r \neq 1" />の場合（<InlineMath math="r" />の値によって2種類）と<InlineMath math="r = 1" />の場合で公式が異なります。</>,
    derivSeriesTitle: "💡 公式の導き方",
    derivStep1Title: "ステップ1 — Sₙを書いてrを掛ける",
    derivStep1Desc: <><InlineMath math="S_n = a + ar + ar^2 + \cdots + ar^{n-1}" />。両辺に<InlineMath math="r" />を掛ける：</>,
    derivStep2Title: "ステップ2 — 2つの式を引く",
    derivStep2Desc: <><InlineMath math="S_n - rS_n = a - ar^n" />、よって<InlineMath math="S_n(1-r) = a(1-r^n)" /></>,
    derivStep3Title: "ステップ3 — 両辺を(1-r)で割る",
    formula1Label: "|r| < 1 の場合（分子 1 − rⁿ、分母 1 − r）：",
    formula2Label: "r > 1 の場合（分子 rⁿ − 1、分母 r − 1）：",
    specialLabel: "特殊ケース r = 1：",
    ex1bTitle: "✏️ 例1 — 基本（和）",
    ex1bProblem: "等比数列：2, 6, 18, 54, ...\n最初の7項の和を求めなさい！",
    ex1bAns: <><InlineMath math="S_7 = 2{,}186" /></>,
    ex2bTitle: "✏️ 例2 — 標準（和）",
    ex2bProblem: <>ある等比級数の最初の5項の和は62で、第1項は2である。公比と第5項を求めなさい！</>,
    ex2bStep1: <>既知：<InlineMath math="S_5 = 62" />、<InlineMath math="a = 2" /></>,
    ex2bStep2: "Sₙの公式に代入する：",
    ex2bStep3: "r = 2 が方程式を満たす：",
    ex2bStep4: <><InlineMath math="U_5" />を計算する：</>,
    ex2bAns: <><InlineMath math="r = 2" />、<InlineMath math="U_5 = 32" /></>,
    ex3bTitle: "✏️ 例3 — 発展（和）",
    ex3bProblem: "ボールを16メートルの高さから落とす。毎回バウンドするたびに、前の高さの3/4まで上がる。ボールが止まるまでの総移動距離は？",
    ex3bIdent: "識別：",
    ex3bGiven: <><InlineMath math="a = 16" /> m（最初の落下）、毎回のバウンド = 前の<InlineMath math="3/4" /></>,
    ex3bStep1: "バウンドの高さの数列：12, 9, 6.75, ...",
    ex3bStep2: "総距離（最初の落下 + すべてのバウンド）：",
    ex3bFormula: "無限等比級数（r < 1）：",
    ex3bNote: "|r| < 1 の無限等比級数は収束する：",
    ex3bAns: <>✅ 総移動距離 = <strong>16 + 2 × 48 = 112メートル</strong></>,
    summaryHeader: "📐 完全まとめ",
    summarySubheader: "等比数列と等比級数 — 中学2年",
    summarySection1: "主要な公式",
    summaryUnLabel: "🔢 等比数列の第n項",
    summarySnLabel1: "∑ 最初のn項の和（r ≠ 1）",
    summarySnLabel2: "∑ 無限和（|r| < 1）",
    summaryRatioLabel: "🔗 公比 (r) の性質",
    ratioProps: [
      { cond: "r > 1", efek: "増加列（成長）", color: "bg-green-900/40 border-green-500/40 text-green-200" },
      { cond: "0 < r < 1", efek: "減少列（0に近づく）", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-200" },
      { cond: "r < 0", efek: "符号が交互に変わる（+−+−...）", color: "bg-orange-900/40 border-orange-500/40 text-orange-200" },
      { cond: "r = 1", efek: "すべての項が等しい（一定）", color: "bg-slate-700/60 border-slate-500/40 text-slate-200" },
    ],
    tipsSection: "等比数列の重要なヒントとコツ",
    tips: [
      { icon: "⚡", tip: "連続する項を割ってrを求める", detail: "r = U₂/U₁ = U₃/U₂。結果が常に同じなら、必ず等比数列！", color: "bg-yellow-900/30 border-yellow-500/30" },
      { icon: "🔑", tip: "aとrを求める2方程式のコツ", detail: "UₘとUₙが与えられたら割り算：Uₙ/Uₘ = rⁿ⁻ᵐ。rを求めてからaを代入で求める。", color: "bg-violet-900/30 border-violet-500/30" },
      { icon: "📐", tip: "時間を項番号に変換する", detail: "成長/減衰問題では、時間を項番号nに変換。例：15分ごと → 2時間 = 8回分裂 → n = 9。", color: "bg-green-900/30 border-green-500/30" },
      { icon: "🧮", tip: "nを求めるための対数", detail: "Uₙが既知でnが必要な場合：Uₙ = a·rⁿ⁻¹の両辺のlogをとってnを孤立させる。", color: "bg-cyan-900/30 border-cyan-500/30" },
      { icon: "🌀", tip: "等比数列の中間項", detail: "U₁, U₂, U₃が等比のとき、U₂² = U₁ × U₃。3連続項の問題に有用。", color: "bg-pink-900/30 border-pink-500/30" },
    ],
    conclusionTitle: "まとめ",
    conclusionBody: <>等比数列は<strong className="text-violet-300">公比一定(r)</strong>の数列です。その成長は<strong className="text-yellow-300">指数関数的</strong> — 等差数列の線形成長より遥かに強力です。これがバクテリアの爆発的増殖、複利の力、さらにはSNSでの情報拡散を説明します。公式<strong className="text-pink-300">Uₙ = a · rⁿ⁻¹</strong>を使えば、あらゆる成長を瞬時に計算できます！</>,
    tags: ["公比 (r)", "Uₙ = a·rⁿ⁻¹", "Sₙ = a(rⁿ−1)/(r−1)", "指数関数的", "複利"],
    nextPrompt: "🌟 数学は宇宙の成長を理解する鍵です！",
    backBtn: "← 数の規則性に戻る",
    monthLabel: "第", unitLabel: "個", firstExceedsLabel: "初めて2,000個を超える",
  },
};

function GeometricArcPanel({
  label, terms, arcColor, labelColor, bgClass, textClass, rLabel,
}: {
  label: string; terms: number[]; arcColor: string; labelColor: string;
  bgClass: string; textClass: string; rLabel: string;
}) {
  const [visibleArcs, setVisibleArcs] = useState(0);
  const count = terms.length;
  const boxW = 44; const gap = 30;
  const totalW = count * boxW + (count - 1) * gap;
  const svgW = totalW + 20; const svgH = 90;
  const boxY = svgH - 36;
  const centers = terms.map((_, i) => 10 + i * (boxW + gap) + boxW / 2);
  const ratios = terms.slice(1).map((v, i) => (terms[i] !== 0 ? `×${v / terms[i]}` : "×?"));
  const arcs = ratios.map((label, i) => {
    const x1 = centers[i]; const x2 = centers[i + 1];
    const cx = (x1 + x2) / 2; const arcH = 30;
    return { x1, x2, cx, cy: boxY - arcH, label };
  });

  useEffect(() => {
    setVisibleArcs(0);
    let i = 0;
    const timer = setInterval(() => { i++; setVisibleArcs(i); if (i >= arcs.length) clearInterval(timer); }, 400);
    return () => clearInterval(timer);
  }, [arcs.length]);

  return (
    <div className={`rounded-xl border p-4 ${bgClass}`}>
      <p className={`font-body text-xs font-bold uppercase tracking-wider mb-3 ${textClass}`}>{label}</p>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" style={{ maxWidth: svgW, display: "block", margin: "0 auto" }}>
          <style>{`@keyframes arcGlow{from{stroke-dashoffset:300;stroke-dasharray:300;opacity:0}to{stroke-dashoffset:0;stroke-dasharray:300;opacity:1}}`}</style>
          {arcs.slice(0, visibleArcs).map((arc, i) => (
            <g key={i}>
              <path d={`M ${arc.x1} ${boxY} Q ${arc.cx} ${arc.cy} ${arc.x2} ${boxY}`}
                fill="none" stroke={arcColor} strokeWidth="2.2"
                style={{ filter: `drop-shadow(0 0 5px ${arcColor}aa)`, animation: "arcGlow 0.4s ease-out" }} />
              <text x={arc.cx} y={arc.cy - 5} textAnchor="middle" fontSize="11" fontWeight="bold"
                fill={labelColor} style={{ filter: `drop-shadow(0 0 4px ${arcColor})` }}>
                {arc.label}
              </text>
            </g>
          ))}
          {terms.map((val, i) => (
            <g key={i}>
              <rect x={centers[i] - boxW / 2} y={boxY} width={boxW} height={30} rx={6}
                fill={arcColor + "22"} stroke={arcColor + "99"} strokeWidth="1.5" />
              <text x={centers[i]} y={boxY + 20} textAnchor="middle" fontSize="13" fontWeight="bold" fill={labelColor}>
                {val}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <p className="text-center text-xs font-bold font-body mt-2" style={{ color: labelColor }}>{rLabel}</p>
    </div>
  );
}

const PolaGeometriPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const SectionHeader = ({ icon, iconColor, title }: {
    icon: React.ReactNode; iconColor?: string; title: string;
  }) => (
    <div className="w-full flex items-center px-5 py-4">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
    </div>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  const tableRows = [
    { n: "1", latex: "a",              kali: `0 ${t.timesWord}`, hi: false },
    { n: "2", latex: "a \\cdot r",     kali: `1 ${t.timesWord}`, hi: false },
    { n: "3", latex: "a \\cdot r^2",   kali: `2 ${t.timesWord}`, hi: false },
    { n: "4", latex: "a \\cdot r^3",   kali: `3 ${t.timesWord}`, hi: false },
    { n: "⋮",  latex: null,             kali: "⋮",     hi: false },
    { n: "n", latex: "a \\cdot r^{n-1}", kali: `(n−1) ${t.timesWord}`, hi: true },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.pageTitle}
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          {t.pageSubtitle}
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.breadcrumb}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          <div className="bg-violet-500/10 border border-violet-500/40 rounded-xl px-4 py-2">
            <p className="font-display text-sm font-bold text-violet-300 text-center">{t.sec1Banner}</p>
          </div>

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.introTitle} />
            <div className="px-5 pb-5 space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">{t.introBody}</p>
              <figure className="flex flex-col items-center gap-2">
                <div className="flex items-end gap-2 p-3 bg-slate-800/50 rounded-xl border border-violet-500/20">
                  {[1,2,4,8,16].map((n, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="flex flex-col gap-1">
                        {Array.from({ length: Math.min(n, 8) }).map((_, j) => (
                          <div key={j} className="w-5 h-5 rounded-full bg-violet-400/70 border border-violet-300/50" />
                        ))}
                        {n > 8 && <span className="text-violet-300 text-xs font-bold text-center">+{n - 8}</span>}
                      </div>
                      <span className="text-violet-200 text-xs font-bold">{n}</span>
                    </div>
                  ))}
                  <span className="text-white/40 self-end text-lg pb-5">...</span>
                </div>
                <figcaption className="font-body text-xs text-white/50 italic text-center">{t.figcaption}</figcaption>
              </figure>

              <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-4">
                <p className="font-body text-xs font-bold text-violet-300 uppercase mb-3">{t.componentsTitle}</p>
                <div className="grid grid-cols-1 gap-2 text-xs font-body">
                  {t.components.map(({ simbol, nama, desc, color }) => (
                    <div key={simbol} className={`border ${color} rounded-lg px-3 py-2 flex justify-between items-center`}>
                      <div>
                        <p className="font-bold font-mono">{simbol}</p>
                        <p className="text-white/60">{nama}</p>
                      </div>
                      <p className="text-white/50 text-right max-w-[50%]">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<TrendingUp className="w-5 h-5" />} iconColor="text-violet-400" title={t.formulaTitle} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                <p className="font-body text-sm font-semibold text-violet-300 mb-2">{t.formulaSummaryTitle}</p>
                <p className="font-body text-sm text-white/80">{t.formulaSummaryBody}</p>
              </div>

              <div className="space-y-3">
                <p className="font-body text-xs font-bold text-white/70 uppercase tracking-widest">{t.arcPanelHeader}</p>
                <GeometricArcPanel
                  label={language === "id" ? "Barisan Naik: 2, 6, 18, 54, ..." : language === "en" ? "Increasing: 2, 6, 18, 54, ..." : "増加列：2, 6, 18, 54, ..."}
                  terms={[2, 6, 18, 54, 162]}
                  arcColor="#a78bfa"
                  labelColor="#ddd6fe"
                  bgClass="bg-violet-900/40 border-violet-500/50"
                  textClass="text-violet-300"
                  rLabel={language === "id" ? "Rasio tetap = ×3 (setiap suku dikalikan 3)" : language === "en" ? "Constant ratio = ×3 (each term multiplied by 3)" : "公比 = ×3（各項が3倍になる）"}
                />
                <GeometricArcPanel
                  label={language === "id" ? "Barisan Turun: 64, 32, 16, 8, 4, ..." : language === "en" ? "Decreasing: 64, 32, 16, 8, 4, ..." : "減少列：64, 32, 16, 8, 4, ..."}
                  terms={[64, 32, 16, 8, 4]}
                  arcColor="#fb923c"
                  labelColor="#fed7aa"
                  bgClass="bg-orange-900/40 border-orange-500/50"
                  textClass="text-orange-300"
                  rLabel={language === "id" ? "Rasio tetap = ×½ (setiap suku dibagi 2)" : language === "en" ? "Constant ratio = ×½ (each term halved)" : "公比 = ×½（各項が半分になる）"}
                />
              </div>

              <div className="bg-slate-800/50 border border-violet-500/30 rounded-xl p-4 text-center">
                <p className="font-body text-xs text-white/60 mb-2">{t.formulaBoxLabel}</p>
                <BlockMath math="\boxed{U_n = a \cdot r^{n-1}}" />
                <div className="flex justify-center gap-4 mt-2 text-xs font-body flex-wrap">
                  <span className="text-cyan-300">{t.aLabel}</span>
                  <span className="text-violet-300">{t.rLabel}</span>
                  <span className="text-orange-300">{t.nLabel}</span>
                </div>
              </div>

              {/* Derivation */}
              <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 space-y-4 text-sm font-body">
                <p className="text-white/80 font-semibold">{t.derivationTitle} <InlineMath math="U_n = a \cdot r^{n-1}" /> {t.derivationSuffix}</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-orange-500/30 bg-orange-900/50 px-3 py-2 text-orange-200 text-center font-bold">{t.tableCol1}</th>
                        <th className="border border-violet-500/30 bg-violet-900/50 px-3 py-2 text-violet-200 text-center font-bold">{t.tableCol2}</th>
                        <th className="border border-green-500/30 bg-green-900/50 px-3 py-2 text-green-200 text-center font-bold">{t.tableCol3}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map(({ n, latex, kali, hi }, i) => (
                        <tr key={i} className={hi ? "bg-violet-900/40" : i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                          <td className={`border border-white/10 px-3 py-2 text-center font-bold font-mono ${hi ? "text-violet-300" : "text-orange-300"}`}>{n}</td>
                          <td className={`border border-white/10 px-3 py-2 text-center font-mono ${hi ? "text-yellow-300 font-bold" : "text-white/80"}`}>
                            {latex ? <InlineMath math={latex} /> : "⋮"}
                          </td>
                          <td className={`border border-white/10 px-3 py-2 text-center ${hi ? "text-green-300 font-bold" : "text-white/50"}`}>{kali}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-800/60 border border-violet-500/20 rounded-lg p-3 space-y-2">
                  <p className="text-white/70 text-xs font-semibold">{t.patternTitle}</p>
                  <div className="space-y-1 text-xs text-white/60 leading-relaxed">
                    {t.bullets.map((b, i) => <div key={i}>{b}</div>)}
                  </div>
                </div>

                <div className="bg-violet-500/10 border border-violet-500/40 rounded-lg p-3 text-center">
                  <p className="text-xs text-white/60 mb-1">{t.conclusionLabel}</p>
                  <BlockMath math="\boxed{U_n = a \cdot r^{n-1}}" />
                  <p className="text-xs text-violet-300 mt-1">{t.conclusionNote}</p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 space-y-2">
                  <p className="font-body text-xs font-bold text-yellow-300">{t.howToUseTitle}</p>
                  <p className="font-body text-xs text-white/75 leading-relaxed">{t.howToUseBody}</p>
                  <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                    <BlockMath math="r = \frac{U_2}{U_1} = \frac{U_3}{U_2} = \frac{U_n}{U_{n-1}}" />
                  </div>
                  <p className="font-body text-xs text-white/55 leading-relaxed pt-1">{t.howToUseNote}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH 1A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.ex1Title} />
            <div className="px-5 pb-5 space-y-4">
              <Badge label={t.badgeEasy} color="bg-green-700/60 text-green-200" />
              <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.problemLabel}</p>
                <p className="font-body text-sm text-white/85 whitespace-pre-line">{t.ex1Problem}</p>
              </div>
              <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-cyan-300">{t.solutionLabel}</p>
                <div className="space-y-2 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-white/70"><InlineMath math="a = 3" />, <InlineMath math="r = \frac{6}{3} = 2" />, <InlineMath math="n = 8" /></p>
                    <BlockMath math="U_8 = 3 \times 2^{8-1} = 3 \times 2^7 = 3 \times 128 = 384" />
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="font-body text-sm font-bold text-cyan-300">{t.ex1Ans}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH 2A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.ex2Title} />
            <div className="px-5 pb-5 space-y-4">
              <Badge label={t.badgeMedium} color="bg-yellow-700/60 text-yellow-200" />
              <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                <p className="font-body text-sm font-semibold text-yellow-300 mb-2">{t.problemLabel}</p>
                <p className="font-body text-sm text-white/85">{t.ex2Problem}</p>
              </div>
              <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-cyan-300">{t.solutionLabel}</p>
                <div className="space-y-2 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-2">{t.step1}</p>
                    <BlockMath math="U_3 = a \cdot r^2 = 18 \quad \cdots (I)" />
                    <BlockMath math="U_6 = a \cdot r^5 = 486 \quad \cdots (II)" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-1">{t.step2}</p>
                    <BlockMath math="\frac{ar^5}{ar^2} = \frac{486}{18} \Rightarrow r^3 = 27 \Rightarrow r = 3" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-green-300 font-semibold mb-1">{t.step3}</p>
                    <BlockMath math="a \cdot 3^2 = 18 \Rightarrow 9a = 18 \Rightarrow a = 2" />
                    <BlockMath math="U_{10} = 2 \times 3^9 = 2 \times 19{.}683 = 39{.}366" />
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="font-body text-sm font-bold text-cyan-300">✅ {t.ex2Ans}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH 3A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title={t.ex3Title} />
            <div className="px-5 pb-5 space-y-4">
              <Badge label={t.badgeHard} color="bg-red-700/60 text-red-200" />
              <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                <p className="font-body text-sm font-semibold text-red-300 mb-2">{t.problemLabel}</p>
                <p className="font-body text-sm text-white/85">{t.ex3Problem}</p>
              </div>
              <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-cyan-300">{t.solutionLabel}</p>
                <div className="space-y-2 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-white/70 mb-1">{t.ex3Given}</p>
                    <p className="text-cyan-300 font-semibold mb-1">{t.ex3Step1}</p>
                    <BlockMath math="U_6 = 500 \times 1{,}2^5 = 500 \times 2{,}4883 \approx 1.244" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-1">{t.ex3Step2}</p>
                    <p className="text-white/70 text-xs mb-2">{t.ex3Step2Note}</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead><tr className="bg-violet-900/40">
                          <th className="border border-white/10 px-2 py-1 text-violet-200">{language === "id" ? "Bulan ke-" : language === "en" ? "Month" : "月"}</th>
                          <th className="border border-white/10 px-2 py-1 text-violet-200">{language === "id" ? "Produksi" : language === "en" ? "Production" : "生産量"}</th>
                          <th className="border border-white/10 px-2 py-1 text-violet-200">&gt; 2.000?</th>
                        </tr></thead>
                        <tbody>
                          {t.ex3Step2Table.map(({ n, val, highlight }) => (
                            <tr key={n} className={highlight ? "bg-green-900/30" : "bg-slate-800/20"}>
                              <td className="border border-white/10 px-2 py-1 text-center text-white/60">{n}</td>
                              <td className="border border-white/10 px-2 py-1 text-center text-white/70">{val}</td>
                              <td className="border border-white/10 px-2 py-1 text-center font-bold">{highlight ? <span className="text-green-400">✅ Ya</span> : <span className="text-red-400">✗</span>}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="font-body text-sm font-bold text-cyan-300">{t.ex3Ans}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BAGIAN 2 */}
          <div className="bg-pink-500/10 border border-pink-500/40 rounded-xl px-4 py-2">
            <p className="font-display text-sm font-bold text-pink-300 text-center">{t.sec2Banner}</p>
          </div>

          {/* RUMUS DERET */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<TrendingUp className="w-5 h-5" />} iconColor="text-pink-400" title={t.seriesTitle} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
                <p className="font-body text-sm font-semibold text-pink-300 mb-2">{t.seriesSummaryTitle}</p>
                <p className="font-body text-sm text-white/80">{t.seriesSummaryBody}</p>
              </div>

              <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 space-y-4 text-sm font-body">
                <p className="text-white/80 font-semibold">{t.derivSeriesTitle}</p>

                <div className="bg-slate-800/60 border border-pink-500/20 rounded-lg p-3 space-y-2">
                  <p className="text-pink-300 font-semibold text-xs uppercase tracking-wide">{t.derivStep1Title}</p>
                  <p className="text-white/70 text-xs leading-relaxed">{t.derivStep1Desc}</p>
                  <div className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-2">
                    <BlockMath math="S_n = a + ar + ar^2 + \cdots + ar^{n-1}" />
                    <BlockMath math="rS_n = ar + ar^2 + ar^3 + \cdots + ar^n" />
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-violet-500/20 rounded-lg p-3 space-y-2">
                  <p className="text-violet-300 font-semibold text-xs uppercase tracking-wide">{t.derivStep2Title}</p>
                  <p className="text-white/70 text-xs">{t.derivStep2Desc}</p>
                  <div className="bg-violet-900/20 border border-violet-500/30 rounded-lg p-2 text-center">
                    <BlockMath math="S_n - rS_n = a - ar^n" />
                    <BlockMath math="S_n(1-r) = a(1 - r^n)" />
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-yellow-500/20 rounded-lg p-3 space-y-2">
                  <p className="text-yellow-300 font-semibold text-xs uppercase tracking-wide">{t.derivStep3Title}</p>
                  <p className="text-white/70 text-xs mb-1">{t.formula1Label}</p>
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-2 text-center">
                    <BlockMath math="\boxed{S_n = \frac{a(1 - r^n)}{1 - r}}" />
                  </div>
                  <p className="text-white/70 text-xs mb-1">{t.formula2Label}</p>
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-2 text-center">
                    <BlockMath math="\boxed{S_n = \frac{a(r^n - 1)}{r - 1}}" />
                  </div>
                  <p className="text-white/70 text-xs mb-1">{t.specialLabel}</p>
                  <div className="bg-slate-700/30 border border-white/10 rounded-lg p-2 text-center">
                    <BlockMath math="S_n = n \cdot a \quad (r = 1)" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH 1B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.ex1bTitle} />
            <div className="px-5 pb-5 space-y-4">
              <Badge label={t.badgeEasy} color="bg-green-700/60 text-green-200" />
              <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.problemLabel}</p>
                <p className="font-body text-sm text-white/85 whitespace-pre-line">{t.ex1bProblem}</p>
              </div>
              <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-cyan-300">{t.solutionLabel}</p>
                <div className="space-y-2 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-white/70"><InlineMath math="a = 2" />, <InlineMath math="r = 3" />, <InlineMath math="n = 7" /></p>
                    <BlockMath math="S_7 = \frac{2(3^7 - 1)}{3 - 1} = \frac{2(2187 - 1)}{2} = 2186" />
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="font-body text-sm font-bold text-cyan-300">✅ {t.ex1bAns}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH 2B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.ex2bTitle} />
            <div className="px-5 pb-5 space-y-4">
              <Badge label={t.badgeMedium} color="bg-yellow-700/60 text-yellow-200" />
              <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                <p className="font-body text-sm font-semibold text-yellow-300 mb-2">{t.problemLabel}</p>
                <p className="font-body text-sm text-white/85">{t.ex2bProblem}</p>
              </div>
              <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-cyan-300">{t.solutionLabel}</p>
                <div className="space-y-2 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-white/70 mb-1">{t.ex2bStep1}</p>
                    <p className="text-cyan-300 font-semibold mb-1">{t.ex2bStep2}</p>
                    <BlockMath math="62 = \frac{2(r^5 - 1)}{r - 1} \Rightarrow 31(r-1) = r^5 - 1" />
                    <p className="text-violet-300 font-semibold mt-2 mb-1">{t.ex2bStep3}</p>
                    <BlockMath math="S_5 = \frac{2(2^5-1)}{2-1} = 2 \times 31 = 62 \checkmark" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-green-300 font-semibold mb-1">{t.ex2bStep4}</p>
                    <BlockMath math="U_5 = 2 \times 2^4 = 2 \times 16 = 32" />
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="font-body text-sm font-bold text-cyan-300">✅ {t.ex2bAns}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH 3B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title={t.ex3bTitle} />
            <div className="px-5 pb-5 space-y-4">
              <Badge label={t.badgeHard} color="bg-red-700/60 text-red-200" />
              <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                <p className="font-body text-sm font-semibold text-red-300 mb-2">{t.problemLabel}</p>
                <p className="font-body text-sm text-white/85">{t.ex3bProblem}</p>
              </div>
              <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-cyan-300">{t.solutionLabel}</p>
                <div className="space-y-2 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-1">{t.ex3bIdent}</p>
                    <p className="text-white/70 mb-1">{t.ex3bGiven}</p>
                    <p className="text-white/70 mb-2">{t.ex3bStep1}</p>
                    <p className="text-violet-300 font-semibold mb-1">{t.ex3bStep2}</p>
                    <BlockMath math="\text{Total} = 16 + 2(12 + 9 + 6{,}75 + \cdots)" />
                    <p className="text-white/70 mb-1">{t.ex3bNote}</p>
                    <BlockMath math="S_\infty = \frac{a}{1 - r} = \frac{12}{1 - 3/4} = \frac{12}{1/4} = 48" />
                    <BlockMath math="\text{Total} = 16 + 2 \times 48 = 16 + 96 = 112" />
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="font-body text-sm font-bold text-cyan-300">{t.ex3bAns}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RANGKUMAN */}
          <div className="mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 px-5 py-4 text-center">
              <p className="font-display text-lg font-bold text-white tracking-wide">{t.summaryHeader}</p>
              <p className="font-body text-xs text-white/80 mt-0.5">{t.summarySubheader}</p>
            </div>

            <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-violet-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-500/30 border border-violet-500 flex items-center justify-center text-[10px]">1</span>
                  {t.summarySection1}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="bg-gradient-to-r from-violet-900/70 to-violet-800/30 border border-violet-500/50 rounded-xl p-3 text-center">
                    <p className="font-body text-xs text-violet-300 font-bold mb-1">{t.summaryUnLabel}</p>
                    <BlockMath math="U_n = a \cdot r^{n-1}" />
                    <div className="flex justify-center gap-3 text-xs font-body flex-wrap mt-1">
                      <span className="text-cyan-300">{t.aLabel}</span>
                      <span className="text-violet-300">{t.rLabel}</span>
                      <span className="text-orange-300">{t.nLabel}</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-pink-900/70 to-pink-800/30 border border-pink-500/50 rounded-xl p-3 text-center">
                    <p className="font-body text-xs text-pink-300 font-bold mb-1">{t.summarySnLabel1}</p>
                    <BlockMath math="S_n = \frac{a(r^n - 1)}{r - 1} \quad (r > 1)" />
                    <BlockMath math="S_n = \frac{a(1 - r^n)}{1 - r} \quad (|r| < 1)" />
                  </div>
                  <div className="bg-gradient-to-r from-teal-900/70 to-teal-800/30 border border-teal-500/50 rounded-xl p-3 text-center">
                    <p className="font-body text-xs text-teal-300 font-bold mb-1">{t.summarySnLabel2}</p>
                    <BlockMath math="S_\infty = \frac{a}{1 - r} \quad (|r| < 1)" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-pink-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-pink-500/30 border border-pink-500 flex items-center justify-center text-[10px]">2</span>
                  {t.summaryRatioLabel}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {t.ratioProps.map(({ cond, efek, color }) => (
                    <div key={cond} className={`${color} border rounded-xl px-3 py-2`}>
                      <p className="font-mono text-xs font-bold">{cond}</p>
                      <p className="font-body text-xs text-white/60 mt-0.5">{efek}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-yellow-500/30 border border-yellow-500 flex items-center justify-center text-[10px]">3</span>
                  {t.tipsSection}
                </p>
                <div className="space-y-2">
                  {t.tips.map(({ icon, tip, detail, color }) => (
                    <div key={tip} className={`${color} border rounded-xl p-3 flex gap-3`}>
                      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                      <div>
                        <p className="font-body text-xs font-bold text-white">{tip}</p>
                        <p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-500/20 via-pink-500/15 to-orange-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
                <div className="text-3xl">🚀</div>
                <p className="font-display text-base font-bold text-white">{t.conclusionTitle}</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.conclusionBody}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {t.tags.map(tag => (
                    <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <p className="font-display text-sm font-semibold text-yellow-300 mt-2">{t.nextPrompt}</p>
              </div>

            </div>
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/pola-bilangan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.backBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolaGeometriPage;
