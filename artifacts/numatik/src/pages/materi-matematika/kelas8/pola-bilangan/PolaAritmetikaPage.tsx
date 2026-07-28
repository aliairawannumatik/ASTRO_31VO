import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Target, TrendingUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const translations = {
  id: {
    pageTitle: "BARISAN DAN DERET ARITMETIKA",
    pageSubtitle: "Barisan dengan Selisih Tetap — Paling Sering Muncul di Ujian!",
    breadcrumb: "Kelas 8 · Pola Bilangan · Materi Matematika",
    sec1Banner: "📐 BAGIAN 1 — SUKU KE-N BARISAN ARITMETIKA",
    introTitle: "🌟 Apa Itu Barisan Aritmetika?",
    introBody: "Pernahkah kamu memperhatikan susunan kursi di bioskop atau teater? Baris pertama mungkin berisi 10 kursi, baris kedua 13 kursi, baris ketiga 16 kursi, dan seterusnya. Setiap baris bertambah 3 kursi secara konsisten! Inilah contoh nyata dari barisan aritmetika — barisan bilangan dengan beda (selisih) yang sama antar suku berurutan. Dengan rumus barisan aritmetika, pengelola gedung bisa langsung menghitung jumlah kursi di baris manapun tanpa menghitung satu per satu.",
    figcaption: "🎬 Susunan kursi bioskop — setiap baris bertambah sejumlah kursi yang sama, membentuk barisan aritmetika!",
    componentsTitle: "🔑 Komponen Utama Barisan Aritmetika",
    components: [
      { simbol: "a atau U₁", nama: "Suku pertama", desc: "Bilangan awal dalam barisan", color: "bg-cyan-900/50 border-cyan-500/40 text-cyan-200" },
      { simbol: "b atau d", nama: "Beda (selisih)", desc: "Selisih tetap antar suku: b = Uₙ − Uₙ₋₁", color: "bg-green-900/50 border-green-500/40 text-green-200" },
      { simbol: "n", nama: "Nomor suku", desc: "Urutan suku (suku ke-1, ke-2, ke-n ...)", color: "bg-violet-900/50 border-violet-500/40 text-violet-200" },
      { simbol: "Uₙ", nama: "Suku ke-n", desc: "Nilai suku pada posisi ke-n", color: "bg-orange-900/50 border-orange-500/40 text-orange-200" },
    ],
    formulaTitle: "📘 Rumus Suku Ke-n",
    formulaSummaryTitle: "🎯 Ringkasan Intisari",
    formulaSummaryBody: "Barisan aritmetika memiliki beda (b) yang tetap antara suku-suku berurutan. Rumus suku ke-n memungkinkan kita langsung menemukan nilai suku manapun tanpa harus menghitung satu per satu.",
    arcPanelHeader: "✨ Contoh Barisan Aritmetika",
    arcLabel1: "Barisan Naik: 1, 3, 5, 7, 9, ...",
    arcLabel2: "Barisan Turun: 8, 6, 4, 2, 0, ...",
    arcDiff1: "Beda tetap = +2 (setiap suku bertambah 2)",
    arcDiff2: "Beda tetap = −2 (setiap suku berkurang 2)",
    formulaBoxLabel: "Rumus Suku ke-n Barisan Aritmetika:",
    aLabel: "a = suku pertama", bLabel: "b = beda", nLabel: "n = nomor suku",
    derivationTitle: "💡 Perhatikan uraian pada tabel berikut",
    derivationSuffix: "",
    tableCol1: "Suku ke-", tableCol2: "Nilai Suku", tableCol3: "Berapa kali tambah",
    timesWord: "kali",
    patternTitle: "🔍 Perhatikan polanya:",
    bullets: [
      <>• Suku ke-<strong className="text-violet-300">1</strong> &nbsp;= <InlineMath math="a" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ tambah <InlineMath math="b" /> sebanyak <strong className="text-green-300">0</strong> kali</>,
      <>• Suku ke-<strong className="text-violet-300">2</strong> &nbsp;= <InlineMath math="a + b" /> &nbsp;&nbsp;→ tambah <InlineMath math="b" /> sebanyak <strong className="text-green-300">1</strong> kali</>,
      <>• Suku ke-<strong className="text-violet-300">3</strong> &nbsp;= <InlineMath math="a + 2b" /> → tambah <InlineMath math="b" /> sebanyak <strong className="text-green-300">2</strong> kali</>,
      <>• Suku ke-<strong className="text-violet-300">4</strong> &nbsp;= <InlineMath math="a + 3b" /> → tambah <InlineMath math="b" /> sebanyak <strong className="text-green-300">3</strong> kali</>,
      <p className="text-cyan-300 font-semibold pt-1">• Suku ke-<strong className="text-violet-300">n</strong> = <InlineMath math="a + (n-1)b" /> → tambah <InlineMath math="b" /> sebanyak <strong className="text-green-300">(n−1)</strong> kali</p>,
    ],
    conclusionLabel: "Kesimpulan — Rumus Umum Suku ke-n:",
    conclusionNote: <>karena setiap suku ke-<InlineMath math="n" /> menambahkan <InlineMath math="b" /> sebanyak <InlineMath math="(n-1)" /> kali dari suku pertama <InlineMath math="a" /></>,
    howToUseTitle: "📌 Cara Menggunakan Rumus Ini",
    howToUseBody: <>Rumus <InlineMath math="U_n = a + (n-1) \cdot b" /> dapat digunakan untuk <strong className="text-yellow-200">menentukan nilai suku manapun</strong> dalam suatu barisan aritmetika — suku ke-5, ke-20, bahkan ke-100 — tanpa perlu menghitung satu per satu, <strong className="text-cyan-300">asalkan</strong> dua hal berikut diketahui:</>,
    firstTermLabel: "Suku pertama barisan",
    diffTermLabel: "Beda (selisih tetap) antar suku",
    howToUseNote: <>Jika <InlineMath math="a" /> dan <InlineMath math="b" /> sudah diketahui, cukup substitusikan nilai <InlineMath math="n" /> (nomor suku yang dicari) ke dalam rumus, dan kamu langsung mendapatkan jawabannya! ✨</>,
    badgeEasy: "MUDAH", badgeMedium: "SEDANG", badgeHard: "SULIT",
    problemLabel: "📝 Soal", solutionLabel: "🔍 Pembahasan",
    ex1Title: "✏️ Contoh 1 — Mudah (Suku ke-n)",
    ex1Problem: "Barisan aritmetika: 4, 7, 10, 13, ...\nTentukan suku ke-20!",
    ex1Ans: <>✅ Suku ke-20 = <strong>61</strong></>,
    ex2Title: "✏️ Contoh 2 — Sedang (Suku ke-n)",
    ex2Problem: "Suku ke-5 suatu barisan aritmetika adalah 23 dan suku ke-9 adalah 39. Tentukan suku pertama dan bedanya, lalu hitung suku ke-15!",
    step1: "Langkah 1 — Buat sistem persamaan:",
    step2: "Langkah 2 — Eliminasi (II) - (I):",
    step2b: <>Substitusi ke (I): <InlineMath math="a + 4(4) = 23 \Rightarrow a = 7" /></>,
    step3: <>Langkah 3 — Hitung <InlineMath math="U_{15}" />:</>,
    ex2Ans: <><InlineMath math="a = 7" />, <InlineMath math="b = 4" />, <InlineMath math="U_{15} = 63" /></>,
    ex3Title: "✏️ Contoh 3 — Sulit (Suku ke-n)",
    ex3Problem: <>Sebuah bioskop memiliki susunan kursi seperti barisan aritmetika. Diketahui baris ke-10 berisi <strong className="text-yellow-300">36 kursi</strong>, dan setiap baris bertambah <strong className="text-cyan-300">2 kursi</strong> dari baris sebelumnya.<br /><br />a) Berapa banyak kursi di baris pertama?<br />b) Berapa banyak kursi di baris ke-25?</>,
    ex3Identify: "Identifikasi — apa yang diketahui:",
    ex3Given1: <>Beda setiap baris: <InlineMath math="b = 2" /></>,
    ex3Given2: <>Baris ke-10 berisi 36 kursi: <InlineMath math="U_{10} = 36" /></>,
    ex3Step1: <>a) Cari suku pertama <InlineMath math="a" />:</>,
    ex3Step2: <>b) Hitung baris ke-25 <InlineMath math="U_{25}" />:</>,
    ex3Note: <>Cek: <InlineMath math="U_{10} = 18 + 9 \times 2 = 36" /> ✓</>,
    ex3Ans: <>✅ Baris pertama: <strong>18 kursi</strong>. Baris ke-25: <strong>66 kursi</strong></>,
    sec2Banner: "∑ BAGIAN 2 — DERET ARITMETIKA",
    seriesTitle: "📘 Rumus Jumlah Suku",
    seriesSummaryTitle: "🎯 Ringkasan Intisari",
    seriesSummaryBody: <>Jumlah <InlineMath math="n" /> suku pertama barisan aritmetika (dilambangkan <InlineMath math="S_n" />) dapat dihitung menggunakan dua rumus yang ekuivalen — pilih yang paling efisien sesuai informasi yang diketahui.</>,
    derivSeriesTitle: "💡 Dari mana rumus",
    derivStep1Title: "Langkah 1 — Tulis barisan maju dan mundur",
    derivStep1Desc: <>Misalkan <InlineMath math="S_n" /> adalah jumlah <InlineMath math="n" /> suku pertama. Kita tulis dua kali — maju dan mundur:</>,
    snForward: <><InlineMath math="S_n" /> (maju)</>,
    snBackward: <><InlineMath math="S_n" /> (mundur)</>,
    derivStep2Title: "Langkah 2 — Jumlahkan baris maju + mundur",
    derivStep2Desc: <>Setiap kolom berpasangan menghasilkan nilai yang sama: <InlineMath math="a + U_n" /></>,
    derivStep3Title: "Langkah 3 — Bagi kedua ruas dengan 2",
    derivStep3Note: <>Karena <InlineMath math="U_n = a + (n-1)b" />, kita substitusikan:</>,
    gaussTitle: "🧠 Ide Gauss — Lihat pasangannya!",
    gaussDesc: "Contoh: jumlah 1 + 2 + 3 + 4 + 5 (a=1, b=1, n=5, Uₙ=5)",
    gaussNote: <>1+5 = <strong className="text-cyan-300">6</strong>, &nbsp; 2+4 = <strong className="text-violet-300">6</strong>, &nbsp; 3 di tengah → <InlineMath math="2S_5 = 5 \times 6 = 30 \Rightarrow S_5 = 15" /></>,
    formula1Label: "Rumus 1 (jika diketahui a, b, n):",
    formula2Label: "Rumus 2 (jika diketahui suku pertama dan suku terakhir):",
    gaussStory: <>Carl Friedrich Gauss (umur 9 tahun) diminta guru menjumlahkan 1 sampai 100. Ia cepat menjawab 5.050! Rahasianya: pasangkan suku pertama (1) dengan terakhir (100) = 101, ada 50 pasang, jadi 50 × 101 = 5.050. Inilah ide di balik rumus <InlineMath math="S_n" />!</>,
    ex1bTitle: "✏️ Contoh 1 — Mudah (Jumlah Suku)",
    ex1bProblem: "Barisan aritmetika: 3, 7, 11, 15, ...\nHitung jumlah 15 suku pertama!",
    ex1bAns: <><InlineMath math="S_{15} = 465" /></>,
    ex2bTitle: "✏️ Contoh 2 — Sedang (Jumlah Suku)",
    ex2bProblem: <>Jumlah 10 suku pertama suatu barisan aritmetika adalah 155 dan suku pertamanya adalah 5. Tentukan beda dan suku ke-10!</>,
    ex2bStep1: <>Diketahui: <InlineMath math="S_{10} = 155" />, <InlineMath math="a = 5" />, <InlineMath math="n = 10" /></>,
    ex2bStep2: "Suku ke-10:",
    ex2bAlt: <>Alternatif lebih cepat: <InlineMath math="S_{10} = \frac{10}{2}(a + U_{10}) \Rightarrow 155 = 5(5 + U_{10}) \Rightarrow U_{10} = 26" /></>,
    ex2bAns: <><InlineMath math="b = \frac{7}{3}" />, <InlineMath math="U_{10} = 26" /></>,
    ex3bTitle: "✏️ Contoh 3 — Sulit (Jumlah Suku)",
    ex3bProblem: "Pada tumpukan batu bata, banyak batu bata paling atas ada 8 buah, tepat di bawahnya ada 10 buah, dan seterusnya setiap tumpukan di bawahnya selalu lebih banyak 2 buah dari tumpukan di atasnya. Jika ada 15 tumpukan batu bata (dari atas sampai bawah), berapa banyak batu bata seluruhnya?",
    ex3bIdent: <>Identifikasi barisan: <InlineMath math="8, 10, 12, \ldots" /></>,
    ex3bGiven: <><InlineMath math="a = 8" /> (batu bata tumpukan pertama/paling atas), <InlineMath math="b = 2" /> (beda), <InlineMath math="n = 15" /></>,
    ex3bUseFormula: <>Gunakan rumus jumlah <InlineMath math="n" /> suku pertama:</>,
    ex3bCheck: <>Cek: suku ke-15 = <InlineMath math="U_{15} = 8 + 14 \times 2 = 36" />. Cara cepat: <InlineMath math="S_{15} = \frac{15}{2}(8 + 36) = \frac{15}{2}(44) = 330" /> ✓</>,
    ex3bAns: <>✅ Total batu bata seluruhnya = <strong>330 buah</strong></>,
    ex4Title: "✏️ Contoh 4 — Sulit (Jumlah Suku)",
    ex4Problem: "Jumlah bilangan kelipatan 4 yang terletak di antara 200 dan 400 adalah…",
    ex4Desc: "Kelipatan 4 di antara 200 dan 400 (tidak termasuk 200 dan 400):",
    ex4Given: <><InlineMath math="a = 204" />, <InlineMath math="b = 4" />, <InlineMath math="U_n = 396" /></>,
    ex4Step1: <>Langkah 1 — Cari banyaknya suku (<InlineMath math="n" />):</>,
    ex4Step2: "Langkah 2 — Hitung jumlah 49 suku:",
    ex4Note: "Catatan: ada 49 bilangan kelipatan 4 di antara 200 dan 400, dari 204 hingga 396.",
    ex4Ans: <>✅ Jumlah kelipatan 4 antara 200 dan 400 = <strong>14.700</strong></>,
    summaryHeader: "📐 RANGKUMAN LENGKAP",
    summarySubheader: "Barisan dan Deret Aritmetika — Kelas 8",
    summarySection1: "Rumus-Rumus Utama",
    summaryUnLabel: "🔢 Suku ke-n Barisan Aritmetika",
    summarySnLabel: "∑ Jumlah n Suku Pertama (Deret Aritmetika)",
    summarySnNote: "Gunakan rumus kiri jika Uₙ belum diketahui, gunakan rumus kanan jika Uₙ sudah diketahui",
    summaryRelLabel: "🔗 Hubungan Uₙ dan Sₙ",
    summaryRelNote: "Berguna saat hanya Sₙ yang diketahui, bukan Uₙ-nya",
    summaryBLabel: "📏 Cara Mencari Beda (b)",
    tipsSection: "Tips & Trik Jitu Aritmetika",
    tips: [
      { icon: "⚡", tip: "Langsung identifikasi a dan b dari soal", detail: "Tuliskan suku pertama (a) dan hitung selisih dua suku berurutan (b = U₂ − U₁) sebelum menggunakan rumus apapun.", color: "bg-yellow-900/30 border-yellow-500/30" },
      { icon: "🔄", tip: "Sistem persamaan untuk dua kondisi", detail: "Jika diketahui Uₘ dan Uₙ, buat dua persamaan: Uₘ = a + (m−1)b dan Uₙ = a + (n−1)b, lalu eliminasi.", color: "bg-cyan-900/30 border-cyan-500/30" },
      { icon: "📊", tip: "Pilih rumus Sₙ yang tepat", detail: "Jika Uₙ diketahui → pakai Sₙ = n/2 (a + Uₙ). Jika hanya a dan b → pakai Sₙ = n/2 [2a + (n−1)b].", color: "bg-green-900/30 border-green-500/30" },
      { icon: "🧮", tip: "Cari banyak suku (n) dari soal cerita", detail: "Konversi satuan dulu (jam → menit, km → m, dll), lalu tentukan n dari barisan yang terbentuk.", color: "bg-violet-900/30 border-violet-500/30" },
      { icon: "🎯", tip: "Trik suku tengah barisan aritmetika", detail: "Suku tengah barisan aritmetika = (a + Uₙ) / 2. Jika n gasal, suku tengah tepat di posisi (n+1)/2.", color: "bg-pink-900/30 border-pink-500/30" },
    ],
    conclusionTitle: "KESIMPULAN",
    conclusionBody: <>Barisan aritmetika adalah barisan dengan <strong className="text-cyan-300">beda tetap (b)</strong>. Dengan rumus <strong className="text-yellow-300">Uₙ = a + (n−1)b</strong> kamu bisa menemukan suku manapun secara instan, dan dengan <strong className="text-green-300">Sₙ = n/2(a + Uₙ)</strong> kamu bisa menjumlahkan ribuan suku hanya dalam hitungan detik — seperti trik jenius Gauss!</>,
    tags: ["Beda Tetap (b)", "Uₙ = a+(n−1)b", "Sₙ = n/2[2a+(n−1)b]", "Sistem Persamaan", "Ide Gauss"],
    nextPrompt: "🚀 Lanjutkan ke Barisan Geometri untuk mempelajari pertumbuhan eksponensial!",
    backBtn: "← Kembali ke Pola Bilangan",
  },
  en: {
    pageTitle: "ARITHMETIC SEQUENCES & SERIES",
    pageSubtitle: "Sequences with Constant Difference — Most Common in Exams!",
    breadcrumb: "Grade 8 · Number Patterns · Math Content",
    sec1Banner: "📐 PART 1 — NTH TERM OF ARITHMETIC SEQUENCES",
    introTitle: "🌟 What Is an Arithmetic Sequence?",
    introBody: "Have you ever noticed the arrangement of seats in a cinema or theater? The first row might have 10 seats, the second row 13, the third 16, and so on. Each row consistently adds 3 seats! This is a real example of an arithmetic sequence — a sequence of numbers with the same difference (common difference) between consecutive terms. With the arithmetic sequence formula, venue managers can directly calculate the number of seats in any row without counting one by one.",
    figcaption: "🎬 Cinema seat arrangement — each row adds the same number of seats, forming an arithmetic sequence!",
    componentsTitle: "🔑 Key Components of an Arithmetic Sequence",
    components: [
      { simbol: "a or U₁", nama: "First term", desc: "The starting number in the sequence", color: "bg-cyan-900/50 border-cyan-500/40 text-cyan-200" },
      { simbol: "b or d", nama: "Common difference", desc: "Constant difference: b = Uₙ − Uₙ₋₁", color: "bg-green-900/50 border-green-500/40 text-green-200" },
      { simbol: "n", nama: "Term number", desc: "Position of the term (term 1, 2, n...)", color: "bg-violet-900/50 border-violet-500/40 text-violet-200" },
      { simbol: "Uₙ", nama: "nth term", desc: "Value of the term at position n", color: "bg-orange-900/50 border-orange-500/40 text-orange-200" },
    ],
    formulaTitle: "📘 nth Term Formula",
    formulaSummaryTitle: "🎯 Key Summary",
    formulaSummaryBody: "An arithmetic sequence has a constant difference (b) between consecutive terms. The nth term formula lets us find the value of any term directly without counting one by one.",
    arcPanelHeader: "✨ Arithmetic Sequence Examples",
    arcLabel1: "Increasing: 1, 3, 5, 7, 9, ...",
    arcLabel2: "Decreasing: 8, 6, 4, 2, 0, ...",
    arcDiff1: "Constant difference = +2 (each term increases by 2)",
    arcDiff2: "Constant difference = −2 (each term decreases by 2)",
    formulaBoxLabel: "Formula for the nth term of an Arithmetic Sequence:",
    aLabel: "a = first term", bLabel: "b = common difference", nLabel: "n = term number",
    derivationTitle: "💡 Observe the breakdown in the table below",
    derivationSuffix: "",
    tableCol1: "Term No.", tableCol2: "Term Value", tableCol3: "How many times add",
    timesWord: "times",
    patternTitle: "🔍 Observe the pattern:",
    bullets: [
      <>• Term <strong className="text-violet-300">1</strong> &nbsp;= <InlineMath math="a" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ add <InlineMath math="b" /> <strong className="text-green-300">0</strong> times</>,
      <>• Term <strong className="text-violet-300">2</strong> &nbsp;= <InlineMath math="a + b" /> &nbsp;&nbsp;&nbsp;→ add <InlineMath math="b" /> <strong className="text-green-300">1</strong> time</>,
      <>• Term <strong className="text-violet-300">3</strong> &nbsp;= <InlineMath math="a + 2b" /> &nbsp;→ add <InlineMath math="b" /> <strong className="text-green-300">2</strong> times</>,
      <>• Term <strong className="text-violet-300">4</strong> &nbsp;= <InlineMath math="a + 3b" /> &nbsp;→ add <InlineMath math="b" /> <strong className="text-green-300">3</strong> times</>,
      <p className="text-cyan-300 font-semibold pt-1">• Term <strong className="text-violet-300">n</strong> = <InlineMath math="a + (n-1)b" /> → add <InlineMath math="b" /> <strong className="text-green-300">(n−1)</strong> times</p>,
    ],
    conclusionLabel: "Conclusion — General Formula for nth Term:",
    conclusionNote: <>because each nth term adds <InlineMath math="b" /> exactly <InlineMath math="(n-1)" /> times starting from the first term <InlineMath math="a" /></>,
    howToUseTitle: "📌 How to Use This Formula",
    howToUseBody: <>The formula <InlineMath math="U_n = a + (n-1) \cdot b" /> can be used to <strong className="text-yellow-200">find the value of any term</strong> in an arithmetic sequence — the 5th, 20th, or even the 100th term — without counting step by step, <strong className="text-cyan-300">as long as</strong> two things are known:</>,
    firstTermLabel: "First term of the sequence",
    diffTermLabel: "Common difference between consecutive terms",
    howToUseNote: <>If <InlineMath math="a" /> and <InlineMath math="b" /> are known, simply substitute the value of <InlineMath math="n" /> (the term number you want) into the formula, and you get the answer immediately! ✨</>,
    badgeEasy: "EASY", badgeMedium: "MEDIUM", badgeHard: "HARD",
    problemLabel: "📝 Problem", solutionLabel: "🔍 Solution",
    ex1Title: "✏️ Example 1 — Easy (nth Term)",
    ex1Problem: "Arithmetic sequence: 4, 7, 10, 13, ...\nFind the 20th term!",
    ex1Ans: <>✅ 20th term = <strong>61</strong></>,
    ex2Title: "✏️ Example 2 — Medium (nth Term)",
    ex2Problem: "The 5th term of an arithmetic sequence is 23 and the 9th term is 39. Find the first term and common difference, then calculate the 15th term!",
    step1: "Step 1 — Set up the system of equations:",
    step2: "Step 2 — Eliminate (II) − (I):",
    step2b: <>Substitute into (I): <InlineMath math="a + 4(4) = 23 \Rightarrow a = 7" /></>,
    step3: <>Step 3 — Calculate <InlineMath math="U_{15}" />:</>,
    ex2Ans: <><InlineMath math="a = 7" />, <InlineMath math="b = 4" />, <InlineMath math="U_{15} = 63" /></>,
    ex3Title: "✏️ Example 3 — Hard (nth Term)",
    ex3Problem: <>A cinema has seats arranged like an arithmetic sequence. It is known that row 10 has <strong className="text-yellow-300">36 seats</strong>, and each row adds <strong className="text-cyan-300">2 seats</strong> from the previous row.<br /><br />a) How many seats are in the first row?<br />b) How many seats are in row 25?</>,
    ex3Identify: "Identify — what is given:",
    ex3Given1: <>Common difference: <InlineMath math="b = 2" /></>,
    ex3Given2: <>Row 10 has 36 seats: <InlineMath math="U_{10} = 36" /></>,
    ex3Step1: <>a) Find the first term <InlineMath math="a" />:</>,
    ex3Step2: <>b) Calculate row 25 (<InlineMath math="U_{25}" />):</>,
    ex3Note: <>Check: <InlineMath math="U_{10} = 18 + 9 \times 2 = 36" /> ✓</>,
    ex3Ans: <>✅ First row: <strong>18 seats</strong>. Row 25: <strong>66 seats</strong></>,
    sec2Banner: "∑ PART 2 — ARITHMETIC SERIES",
    seriesTitle: "📘 Sum Formula",
    seriesSummaryTitle: "🎯 Key Summary",
    seriesSummaryBody: <>The sum of the first <InlineMath math="n" /> terms of an arithmetic sequence (denoted <InlineMath math="S_n" />) can be calculated using two equivalent formulas — choose the most efficient one based on available information.</>,
    derivSeriesTitle: "💡 Where does the formula",
    derivStep1Title: "Step 1 — Write the sequence forwards and backwards",
    derivStep1Desc: <>Let <InlineMath math="S_n" /> be the sum of the first <InlineMath math="n" /> terms. We write it twice — forwards and backwards:</>,
    snForward: <><InlineMath math="S_n" /> (forwards)</>,
    snBackward: <><InlineMath math="S_n" /> (backwards)</>,
    derivStep2Title: "Step 2 — Add the two rows together",
    derivStep2Desc: <>Each column pair yields the same value: <InlineMath math="a + U_n" /></>,
    derivStep3Title: "Step 3 — Divide both sides by 2",
    derivStep3Note: <>Since <InlineMath math="U_n = a + (n-1)b" />, substitute:</>,
    gaussTitle: "🧠 Gauss's Trick — Look for the pairs!",
    gaussDesc: "Example: sum of 1 + 2 + 3 + 4 + 5 (a=1, b=1, n=5, Uₙ=5)",
    gaussNote: <>1+5 = <strong className="text-cyan-300">6</strong>, &nbsp; 2+4 = <strong className="text-violet-300">6</strong>, &nbsp; middle 3 → <InlineMath math="2S_5 = 5 \times 6 = 30 \Rightarrow S_5 = 15" /></>,
    formula1Label: "Formula 1 (if a, b, n are known):",
    formula2Label: "Formula 2 (if first and last terms are known):",
    gaussStory: <>Carl Friedrich Gauss (age 9) was asked to sum 1 to 100. He quickly answered 5,050! His secret: pair the first term (1) with the last (100) = 101, there are 50 pairs, so 50 × 101 = 5,050. This is the idea behind the <InlineMath math="S_n" /> formula!</>,
    ex1bTitle: "✏️ Example 1 — Easy (Sum of Terms)",
    ex1bProblem: "Arithmetic sequence: 3, 7, 11, 15, ...\nFind the sum of the first 15 terms!",
    ex1bAns: <><InlineMath math="S_{15} = 465" /></>,
    ex2bTitle: "✏️ Example 2 — Medium (Sum of Terms)",
    ex2bProblem: <>The sum of the first 10 terms of an arithmetic sequence is 155 and the first term is 5. Find the common difference and the 10th term!</>,
    ex2bStep1: <>Given: <InlineMath math="S_{10} = 155" />, <InlineMath math="a = 5" />, <InlineMath math="n = 10" /></>,
    ex2bStep2: "10th term:",
    ex2bAlt: <>Faster alternative: <InlineMath math="S_{10} = \frac{10}{2}(a + U_{10}) \Rightarrow 155 = 5(5 + U_{10}) \Rightarrow U_{10} = 26" /></>,
    ex2bAns: <><InlineMath math="b = \frac{7}{3}" />, <InlineMath math="U_{10} = 26" /></>,
    ex3bTitle: "✏️ Example 3 — Hard (Sum of Terms)",
    ex3bProblem: "In a stack of bricks, the top layer has 8 bricks, the layer below has 10, and each lower layer has 2 more bricks than the one above it. If there are 15 layers (top to bottom), how many bricks are there in total?",
    ex3bIdent: <>Identify the sequence: <InlineMath math="8, 10, 12, \ldots" /></>,
    ex3bGiven: <><InlineMath math="a = 8" /> (top layer), <InlineMath math="b = 2" /> (common difference), <InlineMath math="n = 15" /></>,
    ex3bUseFormula: <>Use the sum of <InlineMath math="n" /> terms formula:</>,
    ex3bCheck: <>Check: term 15 = <InlineMath math="U_{15} = 8 + 14 \times 2 = 36" />. Quick way: <InlineMath math="S_{15} = \frac{15}{2}(8 + 36) = \frac{15}{2}(44) = 330" /> ✓</>,
    ex3bAns: <>✅ Total bricks = <strong>330</strong></>,
    ex4Title: "✏️ Example 4 — Hard (Sum of Terms)",
    ex4Problem: "Find the sum of all multiples of 4 between 200 and 400.",
    ex4Desc: "Multiples of 4 between 200 and 400 (excluding 200 and 400):",
    ex4Given: <><InlineMath math="a = 204" />, <InlineMath math="b = 4" />, <InlineMath math="U_n = 396" /></>,
    ex4Step1: <>Step 1 — Find the number of terms (<InlineMath math="n" />):</>,
    ex4Step2: "Step 2 — Calculate the sum of 49 terms:",
    ex4Note: "Note: there are 49 multiples of 4 between 200 and 400, from 204 to 396.",
    ex4Ans: <>✅ Sum of multiples of 4 between 200 and 400 = <strong>14,700</strong></>,
    summaryHeader: "📐 COMPLETE SUMMARY",
    summarySubheader: "Arithmetic Sequences & Series — Grade 8",
    summarySection1: "Key Formulas",
    summaryUnLabel: "🔢 nth Term of Arithmetic Sequence",
    summarySnLabel: "∑ Sum of First n Terms (Arithmetic Series)",
    summarySnNote: "Use left formula if Uₙ is unknown; use right formula if Uₙ is known",
    summaryRelLabel: "🔗 Relationship Between Uₙ and Sₙ",
    summaryRelNote: "Useful when only Sₙ is known, not Uₙ",
    summaryBLabel: "📏 How to Find Common Difference (b)",
    tipsSection: "Key Tips & Tricks for Arithmetic",
    tips: [
      { icon: "⚡", tip: "Identify a and b from the problem immediately", detail: "Write down the first term (a) and calculate the difference between two consecutive terms (b = U₂ − U₁) before using any formula.", color: "bg-yellow-900/30 border-yellow-500/30" },
      { icon: "🔄", tip: "System of equations for two conditions", detail: "If Uₘ and Uₙ are given, set up two equations: Uₘ = a + (m−1)b and Uₙ = a + (n−1)b, then eliminate.", color: "bg-cyan-900/30 border-cyan-500/30" },
      { icon: "📊", tip: "Choose the right Sₙ formula", detail: "If Uₙ is known → use Sₙ = n/2 (a + Uₙ). If only a and b → use Sₙ = n/2 [2a + (n−1)b].", color: "bg-green-900/30 border-green-500/30" },
      { icon: "🧮", tip: "Find the number of terms (n) in word problems", detail: "Convert units first (hours → minutes, km → m, etc.), then determine n from the sequence formed.", color: "bg-violet-900/30 border-violet-500/30" },
      { icon: "🎯", tip: "Middle term trick for arithmetic sequences", detail: "Middle term = (a + Uₙ) / 2. If n is odd, the middle term is exactly at position (n+1)/2.", color: "bg-pink-900/30 border-pink-500/30" },
    ],
    conclusionTitle: "CONCLUSION",
    conclusionBody: <>An arithmetic sequence has a <strong className="text-cyan-300">constant difference (b)</strong>. With the formula <strong className="text-yellow-300">Uₙ = a + (n−1)b</strong> you can find any term instantly, and with <strong className="text-green-300">Sₙ = n/2(a + Uₙ)</strong> you can sum thousands of terms in seconds — just like Gauss's genius trick!</>,
    tags: ["Constant Difference (b)", "Uₙ = a+(n−1)b", "Sₙ = n/2[2a+(n−1)b]", "System of Equations", "Gauss's Trick"],
    nextPrompt: "🚀 Continue to Geometric Sequences to learn about exponential growth!",
    backBtn: "← Back to Number Patterns",
  },
  ja: {
    pageTitle: "等差数列と等差級数",
    pageSubtitle: "公差一定の数列 — 試験に最頻出！",
    breadcrumb: "中学2年 · 数の規則性 · 数学教材",
    sec1Banner: "📐 第1節 — 等差数列の第n項",
    introTitle: "🌟 等差数列とは？",
    introBody: "映画館や劇場の座席配置を見たことがありますか？1列目に10席、2列目に13席、3列目に16席と続いていくことがあります。各列が一定の3席ずつ増えています！これが等差数列の実例です — 連続する項の間に同じ差（公差）がある数の列。等差数列の公式を使えば、場内担当者はすべての座席を1つずつ数えることなく、どの列の座席数もすぐに計算できます。",
    figcaption: "🎬 映画館の座席配置 — 各列が同じ数だけ座席が増え、等差数列を形成する！",
    componentsTitle: "🔑 等差数列の主要な構成要素",
    components: [
      { simbol: "a または U₁", nama: "第1項", desc: "数列の最初の数", color: "bg-cyan-900/50 border-cyan-500/40 text-cyan-200" },
      { simbol: "b または d", nama: "公差", desc: "一定の差：b = Uₙ − Uₙ₋₁", color: "bg-green-900/50 border-green-500/40 text-green-200" },
      { simbol: "n", nama: "項番号", desc: "項の位置（第1項、第2項、第n項...）", color: "bg-violet-900/50 border-violet-500/40 text-violet-200" },
      { simbol: "Uₙ", nama: "第n項", desc: "位置nの項の値", color: "bg-orange-900/50 border-orange-500/40 text-orange-200" },
    ],
    formulaTitle: "📘 第n項の公式",
    formulaSummaryTitle: "🎯 要点まとめ",
    formulaSummaryBody: "等差数列は連続する項の間に一定の公差(b)があります。第n項の公式を使えば、1つずつ数えることなく、どの項の値も直接求めることができます。",
    arcPanelHeader: "✨ 等差数列の例",
    arcLabel1: "増加列：1, 3, 5, 7, 9, ...",
    arcLabel2: "減少列：8, 6, 4, 2, 0, ...",
    arcDiff1: "公差 = +2（各項が2増加）",
    arcDiff2: "公差 = −2（各項が2減少）",
    formulaBoxLabel: "等差数列の第n項の公式：",
    aLabel: "a = 第1項", bLabel: "b = 公差", nLabel: "n = 項番号",
    derivationTitle: "💡 公式",
    derivationSuffix: "はどこから来るか？",
    tableCol1: "第n項", tableCol2: "項の値", tableCol3: "bを何回足す？",
    timesWord: "回",
    patternTitle: "🔍 パターンを観察：",
    bullets: [
      <>• 第<strong className="text-violet-300">1</strong>項 = <InlineMath math="a" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ <InlineMath math="b" />を<strong className="text-green-300">0</strong>回足す</>,
      <>• 第<strong className="text-violet-300">2</strong>項 = <InlineMath math="a + b" /> &nbsp;&nbsp;&nbsp;&nbsp;→ <InlineMath math="b" />を<strong className="text-green-300">1</strong>回足す</>,
      <>• 第<strong className="text-violet-300">3</strong>項 = <InlineMath math="a + 2b" /> &nbsp;&nbsp;→ <InlineMath math="b" />を<strong className="text-green-300">2</strong>回足す</>,
      <>• 第<strong className="text-violet-300">4</strong>項 = <InlineMath math="a + 3b" /> &nbsp;&nbsp;→ <InlineMath math="b" />を<strong className="text-green-300">3</strong>回足す</>,
      <p className="text-cyan-300 font-semibold pt-1">• 第<strong className="text-violet-300">n</strong>項 = <InlineMath math="a + (n-1)b" /> → <InlineMath math="b" />を<strong className="text-green-300">(n−1)</strong>回足す</p>,
    ],
    conclusionLabel: "まとめ — 第n項の一般式：",
    conclusionNote: <>第n項はaから始まりbを<InlineMath math="(n-1)" />回足したものだから</>,
    howToUseTitle: "📌 この公式の使い方",
    howToUseBody: <>公式 <InlineMath math="U_n = a + (n-1) \cdot b" /> を使えば、等差数列の<strong className="text-yellow-200">どの項の値も</strong>求められます — 第5項、第20項、第100項でも、1つずつ足さずに、<strong className="text-cyan-300">次の2つが分かれば：</strong></>,
    firstTermLabel: "数列の第1項",
    diffTermLabel: "隣り合う項の公差（一定）",
    howToUseNote: <><InlineMath math="a" />と<InlineMath math="b" />が分かったら、<InlineMath math="n" />（求めたい項番号）を公式に代入するだけで、すぐに答えが出ます！✨</>,
    badgeEasy: "基本", badgeMedium: "標準", badgeHard: "発展",
    problemLabel: "📝 問題", solutionLabel: "🔍 解説",
    ex1Title: "✏️ 例1 — 基本（第n項）",
    ex1Problem: "等差数列：4, 7, 10, 13, ...\n第20項を求めなさい！",
    ex1Ans: <>✅ 第20項 = <strong>61</strong></>,
    ex2Title: "✏️ 例2 — 標準（第n項）",
    ex2Problem: "ある等差数列の第5項は23、第9項は39である。第1項と公差を求め、第15項を計算しなさい！",
    step1: "ステップ1 — 連立方程式を立てる：",
    step2: "ステップ2 — (II) − (I) を計算する：",
    step2b: <>(I) に代入：<InlineMath math="a + 4(4) = 23 \Rightarrow a = 7" /></>,
    step3: <>ステップ3 — <InlineMath math="U_{15}" />を計算する：</>,
    ex2Ans: <><InlineMath math="a = 7" />, <InlineMath math="b = 4" />, <InlineMath math="U_{15} = 63" /></>,
    ex3Title: "✏️ 例3 — 発展（第n項）",
    ex3Problem: <>映画館の座席が等差数列のように配置されている。10列目に<strong className="text-yellow-300">36席</strong>あり、各列は前の列より<strong className="text-cyan-300">2席</strong>増えることが分かっている。<br /><br />a) 1列目の座席数は？<br />b) 25列目の座席数は？</>,
    ex3Identify: "識別 — 与えられた情報：",
    ex3Given1: <>各列の差：<InlineMath math="b = 2" /></>,
    ex3Given2: <>10列目は36席：<InlineMath math="U_{10} = 36" /></>,
    ex3Step1: <>a) 第1項 <InlineMath math="a" />を求める：</>,
    ex3Step2: <>b) 25列目 <InlineMath math="U_{25}" />を計算する：</>,
    ex3Note: <>確認：<InlineMath math="U_{10} = 18 + 9 \times 2 = 36" /> ✓</>,
    ex3Ans: <>✅ 1列目：<strong>18席</strong>。25列目：<strong>66席</strong></>,
    sec2Banner: "∑ 第2節 — 等差級数",
    seriesTitle: "📘 和の公式",
    seriesSummaryTitle: "🎯 要点まとめ",
    seriesSummaryBody: <>等差数列の最初の<InlineMath math="n" />項の和（<InlineMath math="S_n" />）は、2つの同等な公式で計算できます — 与えられた情報に応じて最も効率的なものを選んでください。</>,
    derivSeriesTitle: "💡 公式",
    derivStep1Title: "ステップ1 — 数列を正順と逆順で書く",
    derivStep1Desc: <><InlineMath math="S_n" />を最初の<InlineMath math="n" />項の和とする。正順と逆順の2通りで書く：</>,
    snForward: <><InlineMath math="S_n" />（正順）</>,
    snBackward: <><InlineMath math="S_n" />（逆順）</>,
    derivStep2Title: "ステップ2 — 正順と逆順を足す",
    derivStep2Desc: <>各列のペアは同じ値になる：<InlineMath math="a + U_n" /></>,
    derivStep3Title: "ステップ3 — 両辺を2で割る",
    derivStep3Note: <><InlineMath math="U_n = a + (n-1)b" />を代入すると：</>,
    gaussTitle: "🧠 ガウスのアイデア — ペアを見つける！",
    gaussDesc: "例：1 + 2 + 3 + 4 + 5 の和（a=1, b=1, n=5, Uₙ=5）",
    gaussNote: <>1+5 = <strong className="text-cyan-300">6</strong>、&nbsp;2+4 = <strong className="text-violet-300">6</strong>、&nbsp;中間の3 → <InlineMath math="2S_5 = 5 \times 6 = 30 \Rightarrow S_5 = 15" /></>,
    formula1Label: "公式1（a, b, nが分かる場合）：",
    formula2Label: "公式2（第1項と最終項が分かる場合）：",
    gaussStory: <>カール・フリードリヒ・ガウス（9歳）は1から100までの和を求めるよう言われ、すぐに5,050と答えた！秘訣：第1項(1)と最終項(100)をペアにすると101、50ペアあるので50×101=5,050。これが<InlineMath math="S_n" />公式のアイデアだ！</>,
    ex1bTitle: "✏️ 例1 — 基本（和）",
    ex1bProblem: "等差数列：3, 7, 11, 15, ...\n最初の15項の和を求めなさい！",
    ex1bAns: <><InlineMath math="S_{15} = 465" /></>,
    ex2bTitle: "✏️ 例2 — 標準（和）",
    ex2bProblem: <>ある等差数列の最初の10項の和は155で、第1項は5である。公差と第10項を求めなさい！</>,
    ex2bStep1: <>既知：<InlineMath math="S_{10} = 155" />, <InlineMath math="a = 5" />, <InlineMath math="n = 10" /></>,
    ex2bStep2: "第10項：",
    ex2bAlt: <>より速い別解：<InlineMath math="S_{10} = \frac{10}{2}(a + U_{10}) \Rightarrow 155 = 5(5 + U_{10}) \Rightarrow U_{10} = 26" /></>,
    ex2bAns: <><InlineMath math="b = \frac{7}{3}" />, <InlineMath math="U_{10} = 26" /></>,
    ex3bTitle: "✏️ 例3 — 発展（和）",
    ex3bProblem: "レンガの積み重ねで、一番上の段に8個、その下の段に10個あり、下の段は常に上の段より2個多い。15段（上から下へ）ある場合、レンガは全部で何個か？",
    ex3bIdent: <>数列を識別：<InlineMath math="8, 10, 12, \ldots" /></>,
    ex3bGiven: <><InlineMath math="a = 8" />（一番上の段）、<InlineMath math="b = 2" />（公差）、<InlineMath math="n = 15" /></>,
    ex3bUseFormula: <>最初の<InlineMath math="n" />項の和の公式を使う：</>,
    ex3bCheck: <>確認：第15項 = <InlineMath math="U_{15} = 8 + 14 \times 2 = 36" />。簡単な方法：<InlineMath math="S_{15} = \frac{15}{2}(8 + 36) = \frac{15}{2}(44) = 330" /> ✓</>,
    ex3bAns: <>✅ レンガの総数 = <strong>330個</strong></>,
    ex4Title: "✏️ 例4 — 発展（和）",
    ex4Problem: "200と400の間にある4の倍数の和を求めなさい。",
    ex4Desc: "200と400の間の4の倍数（200と400を含まない）：",
    ex4Given: <><InlineMath math="a = 204" />, <InlineMath math="b = 4" />, <InlineMath math="U_n = 396" /></>,
    ex4Step1: <>ステップ1 — 項数 (<InlineMath math="n" />) を求める：</>,
    ex4Step2: "ステップ2 — 49項の和を計算する：",
    ex4Note: "注：200と400の間には204から396まで49個の4の倍数がある。",
    ex4Ans: <>✅ 200と400の間の4の倍数の和 = <strong>14,700</strong></>,
    summaryHeader: "📐 完全まとめ",
    summarySubheader: "等差数列と等差級数 — 中学2年",
    summarySection1: "主要な公式",
    summaryUnLabel: "🔢 等差数列の第n項",
    summarySnLabel: "∑ 最初のn項の和（等差級数）",
    summarySnNote: "Uₙが不明の場合は左の公式、Uₙが既知の場合は右の公式を使う",
    summaryRelLabel: "🔗 UₙとSₙの関係",
    summaryRelNote: "Sₙのみが分かっていてUₙが不明の場合に有用",
    summaryBLabel: "📏 公差 (b) の求め方",
    tipsSection: "等差数列の重要なヒントとコツ",
    tips: [
      { icon: "⚡", tip: "問題からaとbをすぐに識別する", detail: "第1項(a)を書き留め、連続する2項の差(b = U₂ − U₁)を計算してから公式を使う。", color: "bg-yellow-900/30 border-yellow-500/30" },
      { icon: "🔄", tip: "2条件の連立方程式", detail: "UₘとUₙが与えられたら、Uₘ = a + (m−1)b と Uₙ = a + (n−1)b の2式を立てて消去法を使う。", color: "bg-cyan-900/30 border-cyan-500/30" },
      { icon: "📊", tip: "適切なSₙ公式を選ぶ", detail: "Uₙが既知 → Sₙ = n/2(a + Uₙ)を使う。aとbのみ → Sₙ = n/2[2a + (n−1)b]を使う。", color: "bg-green-900/30 border-green-500/30" },
      { icon: "🧮", tip: "文章問題で項数(n)を求める", detail: "まず単位換算（時間→分、km→mなど）をし、形成された数列からnを決める。", color: "bg-violet-900/30 border-violet-500/30" },
      { icon: "🎯", tip: "等差数列の中間項のコツ", detail: "中間項 = (a + Uₙ) / 2。nが奇数の場合、中間項は(n+1)/2番目の位置にある。", color: "bg-pink-900/30 border-pink-500/30" },
    ],
    conclusionTitle: "まとめ",
    conclusionBody: <>等差数列は<strong className="text-cyan-300">公差一定(b)</strong>の数列です。公式<strong className="text-yellow-300">Uₙ = a + (n−1)b</strong>でどの項もすぐに求められ、<strong className="text-green-300">Sₙ = n/2(a + Uₙ)</strong>で何千項の和も数秒で計算できます — まるでガウスの天才的なトリックのように！</>,
    tags: ["公差 (b)", "Uₙ = a+(n−1)b", "Sₙ = n/2[2a+(n−1)b]", "連立方程式", "ガウスのアイデア"],
    nextPrompt: "🚀 等比数列へ進んで指数関数的成長を学ぼう！",
    backBtn: "← 数の規則性に戻る",
  },
};

function ArithmeticArcPanel({
  label, terms, a, b, arcColor, labelColor, bgClass, textClass, constantDiffLabel,
}: {
  label: string; terms: number[]; a: number; b: number;
  arcColor: string; labelColor: string; bgClass: string; textClass: string;
  constantDiffLabel: string;
}) {
  const [visibleArcs, setVisibleArcs] = useState(0);
  const count = terms.length;
  const boxW = 44; const gap = 26;
  const totalW = count * boxW + (count - 1) * gap;
  const svgW = totalW + 20; const svgH = 90;
  const boxY = svgH - 36;
  const centers = terms.map((_, i) => 10 + i * (boxW + gap) + boxW / 2);
  const diffs = terms.slice(1).map((v, i) => v - terms[i]);
  const arcs = diffs.map((d, i) => {
    const x1 = centers[i]; const x2 = centers[i + 1];
    const cx = (x1 + x2) / 2; const arcH = 26;
    return { x1, x2, cx, cy: boxY - arcH, label: d >= 0 ? `+${d}` : `${d}` };
  });

  useEffect(() => {
    setVisibleArcs(0);
    let i = 0;
    const timer = setInterval(() => { i++; setVisibleArcs(i); if (i >= arcs.length) clearInterval(timer); }, 350);
    return () => clearInterval(timer);
  }, [arcs.length]);

  return (
    <div className={`rounded-xl border p-4 ${bgClass}`}>
      <p className={`font-body text-xs font-bold uppercase tracking-wider mb-1 ${textClass}`}>{label}</p>
      <p className="font-body text-xs text-white/60 mb-3">
        <span className={`font-mono font-bold ${textClass}`}>a = {a}</span>
        <span className="mx-2 text-white/30">|</span>
        <span className={`font-mono font-bold ${textClass}`}>b = {b}</span>
      </p>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" style={{ maxWidth: svgW, display: "block", margin: "0 auto" }}>
          <style>{`@keyframes arcGlow{from{stroke-dashoffset:300;stroke-dasharray:300;opacity:0}to{stroke-dashoffset:0;stroke-dasharray:300;opacity:1}}`}</style>
          {arcs.slice(0, visibleArcs).map((arc, i) => (
            <g key={i}>
              <path
                d={`M ${arc.x1} ${boxY} Q ${arc.cx} ${arc.cy} ${arc.x2} ${boxY}`}
                fill="none" stroke={arcColor} strokeWidth="2.2"
                style={{ filter: `drop-shadow(0 0 5px ${arcColor}aa)`, animation: "arcGlow 0.4s ease-out" }}
              />
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
      <p className="text-center text-xs font-bold font-body mt-2" style={{ color: labelColor }}>
        {constantDiffLabel}
      </p>
    </div>
  );
}

const PolaAritmetikaPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isDark } = useTheme();
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
    { n: "2", latex: "a + b",          kali: `1 ${t.timesWord}`, hi: false },
    { n: "3", latex: "a + 2b",         kali: `2 ${t.timesWord}`, hi: false },
    { n: "4", latex: "a + 3b",         kali: `3 ${t.timesWord}`, hi: false },
    { n: "⋮",  latex: null,             kali: "⋮",     hi: false },
    { n: "n", latex: "a + (n-1)b",     kali: `(n−1) ${t.timesWord}`, hi: true },
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

          <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-xl px-4 py-2">
            <p className="font-display text-sm font-bold text-cyan-300 text-center">{t.sec1Banner}</p>
          </div>

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.introTitle} />
            <div className="px-5 pb-5 space-y-4">
              <p className="font-body text-sm text-white/80 leading-relaxed">{t.introBody}</p>

              <figure className="flex flex-col items-center gap-2">
                <img
                  src="/bioskop-aritmetika.png"
                  alt="Cinema seats forming an arithmetic sequence"
                  className="w-full max-w-sm rounded-xl border border-cyan-500/30 shadow-lg object-cover"
                />
                <figcaption className="font-body text-xs text-white/50 italic text-center">
                  {t.figcaption}
                </figcaption>
              </figure>

              <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">{t.componentsTitle}</p>
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
            <SectionHeader icon={<TrendingUp className="w-5 h-5" />} iconColor="text-cyan-400" title={t.formulaTitle} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <p className="font-body text-sm font-semibold text-cyan-300 mb-2">{t.formulaSummaryTitle}</p>
                <p className="font-body text-sm text-white/80">{t.formulaSummaryBody}</p>
              </div>

              <div className="space-y-3">
                <p className="font-body text-xs font-bold text-white/70 uppercase tracking-widest">{t.arcPanelHeader}</p>
                <ArithmeticArcPanel
                  label={t.arcLabel1}
                  terms={[1, 3, 5, 7, 9]}
                  a={1} b={2}
                  arcColor={isDark ? "#22d3ee" : "#0891b2"}
                  labelColor={isDark ? "#a5f3fc" : "#155e75"}
                  bgClass="bg-cyan-900/40 border-cyan-500/50"
                  textClass="text-cyan-300"
                  constantDiffLabel={t.arcDiff1}
                />
                <ArithmeticArcPanel
                  label={t.arcLabel2}
                  terms={[8, 6, 4, 2, 0]}
                  a={8} b={-2}
                  arcColor={isDark ? "#f97316" : "#c2410c"}
                  labelColor={isDark ? "#fed7aa" : "#7c2d12"}
                  bgClass="bg-orange-900/40 border-orange-500/50"
                  textClass="text-orange-300"
                  constantDiffLabel={t.arcDiff2}
                />
              </div>

              {/* Derivation */}
              <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 space-y-4 text-sm font-body">
                <p className="text-white/80 font-semibold">{t.derivationTitle}</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-violet-500/30 bg-violet-900/50 px-3 py-2 text-violet-200 text-center font-bold">{t.tableCol1}</th>
                        <th className="border border-cyan-500/30 bg-cyan-900/50 px-3 py-2 text-cyan-200 text-center font-bold">{t.tableCol2}</th>
                        <th className="border border-green-500/30 bg-green-900/50 px-3 py-2 text-green-200 text-center font-bold">{t.tableCol3} <InlineMath math="b" />?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map(({ n, latex, kali, hi }, i) => (
                        <tr key={i} className={hi ? "bg-cyan-900/40" : i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                          <td className={`border border-white/10 px-3 py-2 text-center font-bold font-mono ${hi ? "text-cyan-300" : "text-violet-300"}`}>{n}</td>
                          <td className={`border border-white/10 px-3 py-2 text-center font-mono ${hi ? "text-yellow-300 font-bold" : "text-white/80"}`}>
                            {latex ? <InlineMath math={latex} /> : "⋮"}
                          </td>
                          <td className={`border border-white/10 px-3 py-2 text-center ${hi ? "text-green-300 font-bold" : "text-white/50"}`}>{kali}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-lg p-3 space-y-2">
                  <p className="text-white/70 text-xs font-semibold">{t.patternTitle}</p>
                  <div className="space-y-1 text-xs text-white/60 leading-relaxed">
                    {t.bullets.map((b, i) => <div key={i}>{b}</div>)}
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3 text-center">
                  <p className="text-xs text-white/60 mb-1">{t.conclusionLabel}</p>
                  <BlockMath math="\boxed{U_n = a + (n - 1) \cdot b}" />
                  <p className="text-xs text-cyan-300 mt-1">{t.conclusionNote}</p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 space-y-2">
                  <p className="font-body text-xs font-bold text-yellow-300">{t.howToUseTitle}</p>
                  <p className="font-body text-xs text-white/75 leading-relaxed">{t.howToUseBody}</p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="bg-cyan-900/40 border border-cyan-500/30 rounded-lg px-3 py-2 text-center">
                      <p className="font-mono font-bold text-cyan-300 text-sm">a</p>
                      <p className="text-white/60 text-xs mt-0.5">{t.firstTermLabel}</p>
                    </div>
                    <div className="bg-green-900/40 border border-green-500/30 rounded-lg px-3 py-2 text-center">
                      <p className="font-mono font-bold text-green-300 text-sm">b</p>
                      <p className="text-white/60 text-xs mt-0.5">{t.diffTermLabel}</p>
                    </div>
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
                  <div className="bg-slate-800/50 rounded-lg p-3 space-y-1">
                    <p className="text-white/70"><InlineMath math="a = 4" />, <InlineMath math="b = 7 - 4 = 3" />, <InlineMath math="n = 20" /></p>
                    <BlockMath math="U_{20} = 4 + (20 - 1) \times 3 = 4 + 19 \times 3 = 4 + 57 = 61" />
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="font-body text-sm font-bold text-cyan-300">✅ {t.ex1Ans}</p>
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
                    <BlockMath math="U_5 = a + 4b = 23 \quad \cdots (I)" />
                    <BlockMath math="U_9 = a + 8b = 39 \quad \cdots (II)" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-1">{t.step2}</p>
                    <BlockMath math="4b = 16 \Rightarrow b = 4" />
                    <p className="text-white/70">{t.step2b}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-green-300 font-semibold mb-1">{t.step3}</p>
                    <BlockMath math="U_{15} = 7 + (15-1) \times 4 = 7 + 56 = 63" />
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
                    <p className="text-cyan-300 font-semibold mb-2">{t.ex3Identify}</p>
                    <p className="text-white/70">{t.ex3Given1}</p>
                    <p className="text-white/70">{t.ex3Given2}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-1">{t.ex3Step1}</p>
                    <BlockMath math="U_{10} = a + (10-1) \times b" />
                    <BlockMath math="36 = a + 9 \times 2" />
                    <BlockMath math="36 = a + 18 \Rightarrow a = 18" />
                    <p className="text-white/70 text-xs mt-1">{language === "id" ? "Jadi baris pertama berisi" : language === "en" ? "So the first row has" : "したがって1列目は"} <strong className="text-yellow-300">18 {language === "id" ? "kursi" : language === "en" ? "seats" : "席"}</strong>.</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-green-300 font-semibold mb-1">{t.ex3Step2}</p>
                    <BlockMath math="U_{25} = 18 + (25-1) \times 2" />
                    <BlockMath math="U_{25} = 18 + 24 \times 2 = 18 + 48 = 66" />
                  </div>
                  <div className="bg-slate-800/40 border border-white/10 rounded-lg p-2">
                    <p className="text-white/60 text-xs">{t.ex3Note}</p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="font-body text-sm font-bold text-cyan-300">✅ {t.ex3Ans}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BAGIAN 2 */}
          <div className="bg-green-500/10 border border-green-500/40 rounded-xl px-4 py-2">
            <p className="font-display text-sm font-bold text-green-300 text-center">{t.sec2Banner}</p>
          </div>

          {/* RUMUS JUMLAH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<TrendingUp className="w-5 h-5" />} iconColor="text-green-400" title={t.seriesTitle} />
            <div className="px-5 pb-5 space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.seriesSummaryTitle}</p>
                <p className="font-body text-sm text-white/80">{t.seriesSummaryBody}</p>
              </div>

              <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 space-y-4 text-sm font-body">
                <p className="text-white/80 font-semibold">{t.derivSeriesTitle} <InlineMath math="S_n" /> {language === "id" ? "berasal?" : language === "en" ? "come from?" : "はどこから来るか？"}</p>

                <div className="bg-slate-800/60 border border-green-500/20 rounded-lg p-3 space-y-2">
                  <p className="text-green-300 font-semibold text-xs uppercase tracking-wide">{t.derivStep1Title}</p>
                  <p className="text-white/70 text-xs leading-relaxed">{t.derivStep1Desc}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse mt-1">
                      <tbody>
                        <tr className="bg-cyan-900/30">
                          <td className="border border-white/10 px-2 py-1.5 text-cyan-300 font-bold text-center whitespace-nowrap">{t.snForward}</td>
                          <td className="border border-white/10 px-2 py-1.5 text-center text-white/80"><InlineMath math="= a" /></td>
                          <td className="border border-white/10 px-2 py-1.5 text-center text-white/80"><InlineMath math="+ (a+b)" /></td>
                          <td className="border border-white/10 px-2 py-1.5 text-center text-white/80"><InlineMath math="+ \cdots" /></td>
                          <td className="border border-white/10 px-2 py-1.5 text-center text-white/80"><InlineMath math="+ U_n" /></td>
                        </tr>
                        <tr className="bg-orange-900/30">
                          <td className="border border-white/10 px-2 py-1.5 text-orange-300 font-bold text-center whitespace-nowrap">{t.snBackward}</td>
                          <td className="border border-white/10 px-2 py-1.5 text-center text-white/80"><InlineMath math="= U_n" /></td>
                          <td className="border border-white/10 px-2 py-1.5 text-center text-white/80"><InlineMath math="+ (U_n - b)" /></td>
                          <td className="border border-white/10 px-2 py-1.5 text-center text-white/80"><InlineMath math="+ \cdots" /></td>
                          <td className="border border-white/10 px-2 py-1.5 text-center text-white/80"><InlineMath math="+ a" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-violet-500/20 rounded-lg p-3 space-y-2">
                  <p className="text-violet-300 font-semibold text-xs uppercase tracking-wide">{t.derivStep2Title}</p>
                  <p className="text-white/70 text-xs">{t.derivStep2Desc}</p>
                  <div className="bg-violet-900/30 border border-violet-500/30 rounded-lg p-2 text-center">
                    <BlockMath math="2S_n = \underbrace{(a + U_n) + (a + U_n) + \cdots + (a + U_n)}_{n \text{ pasang}}" />
                    <BlockMath math="2S_n = n \times (a + U_n)" />
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-yellow-500/20 rounded-lg p-3 space-y-2">
                  <p className="text-yellow-300 font-semibold text-xs uppercase tracking-wide">{t.derivStep3Title}</p>
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-2 text-center">
                    <BlockMath math="\boxed{S_n = \frac{n}{2}(a + U_n)}" />
                  </div>
                  <p className="text-white/60 text-xs">{t.derivStep3Note}</p>
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-2 text-center">
                    <BlockMath math="\boxed{S_n = \frac{n}{2}\left[2a + (n-1)b\right]}" />
                  </div>
                </div>

                <div className="bg-slate-800/40 border border-white/10 rounded-lg p-3 space-y-2">
                  <p className="text-yellow-300 font-semibold text-xs">{t.gaussTitle}</p>
                  <p className="text-white/60 text-xs">{t.gaussDesc}</p>
                  <div className="flex items-center justify-center gap-1 flex-wrap mt-1">
                    {[1,2,3,4,5].map((v, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <span className={`font-mono font-bold text-sm px-2 py-1 rounded ${i === 0 || i === 4 ? "bg-cyan-700/60 text-cyan-200" : i === 1 || i === 3 ? "bg-violet-700/60 text-violet-200" : "bg-slate-700/60 text-white/70"}`}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/50 text-xs text-center mt-1">{t.gaussNote}</p>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-green-500/30 rounded-xl p-4 space-y-3 text-center">
                <p className="font-body text-xs text-white/60">{t.formula1Label}</p>
                <BlockMath math="\boxed{S_n = \frac{n}{2}\left[2a + (n-1)b\right]}" />
                <p className="font-body text-xs text-white/60 mt-2">{t.formula2Label}</p>
                <BlockMath math="\boxed{S_n = \frac{n}{2}(a + U_n)}" />
              </div>
              <div className="bg-slate-800/40 border border-white/10 rounded-lg p-3 text-sm font-body">
                <p className="text-yellow-300 font-semibold mb-1">🧠 {language === "id" ? "Kisah di balik rumus:" : language === "en" ? "The story behind the formula:" : "公式の背景："}</p>
                <p className="text-white/70 text-xs">{t.gaussStory}</p>
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
                    <p className="text-white/70"><InlineMath math="a = 3" />, <InlineMath math="b = 4" />, <InlineMath math="n = 15" /></p>
                    <BlockMath math="S_{15} = \frac{15}{2}\left[2(3) + (15-1)(4)\right]" />
                    <BlockMath math="= \frac{15}{2}\left[6 + 56\right] = \frac{15}{2} \times 62 = 15 \times 31 = 465" />
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
                    <p className="text-white/70">{t.ex2bStep1}</p>
                    <BlockMath math="155 = \frac{10}{2}\left[2(5) + 9b\right]" />
                    <BlockMath math="155 = 5(10 + 9b)" />
                    <BlockMath math="31 = 10 + 9b \Rightarrow 9b = 21 \Rightarrow b = \frac{7}{3}" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-1">{t.ex2bStep2}</p>
                    <BlockMath math="U_{10} = 5 + 9 \times \frac{7}{3} = 5 + 21 = 26" />
                  </div>
                  <div className="bg-slate-800/40 border border-yellow-500/20 rounded-lg p-2">
                    <p className="text-yellow-200 text-xs">{t.ex2bAlt}</p>
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
                    <p className="text-white/70 mb-2">{t.ex3bIdent}</p>
                    <p className="text-white/70">{t.ex3bGiven}</p>
                    <p className="text-cyan-300 font-semibold mt-2">{t.ex3bUseFormula}</p>
                    <BlockMath math="S_n = \frac{n}{2}[2a + (n-1)b]" />
                    <BlockMath math="S_{15} = \frac{15}{2}[2(8) + (15-1)(2)]" />
                    <BlockMath math="S_{15} = \frac{15}{2}[16 + 28] = \frac{15}{2} \times 44 = 15 \times 22 = 330" />
                  </div>
                  <div className="bg-slate-800/40 border border-white/10 rounded-lg p-2 text-xs font-body">
                    <p className="text-white/60">{t.ex3bCheck}</p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="font-body text-sm font-bold text-cyan-300">{t.ex3bAns}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH 4 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title={t.ex4Title} />
            <div className="px-5 pb-5 space-y-4">
              <Badge label={t.badgeHard} color="bg-purple-700/60 text-purple-200" />
              <div className="bg-slate-800/60 border border-purple-500/30 rounded-xl p-4">
                <p className="font-body text-sm font-semibold text-purple-300 mb-2">{t.problemLabel}</p>
                <p className="font-body text-sm text-white/85">{t.ex4Problem}</p>
              </div>
              <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-semibold text-cyan-300">{t.solutionLabel}</p>
                <div className="space-y-2 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-white/70 mb-2">{t.ex4Desc}</p>
                    <p className="text-white/70 mb-2"><InlineMath math="204, 208, 212, \ldots, 396" /></p>
                    <p className="text-white/70">{t.ex4Given}</p>
                    <p className="text-cyan-300 font-semibold mt-2">{t.ex4Step1}</p>
                    <BlockMath math="U_n = a + (n-1)b" />
                    <BlockMath math="396 = 204 + (n-1) \times 4" />
                    <BlockMath math="192 = (n-1) \times 4 \implies n - 1 = 48 \implies n = 49" />
                    <p className="text-cyan-300 font-semibold mt-2">{t.ex4Step2}</p>
                    <BlockMath math="S_{49} = \frac{n}{2}(a + U_n) = \frac{49}{2}(204 + 396)" />
                    <BlockMath math="S_{49} = \frac{49}{2} \times 600 = 49 \times 300 = 14.700" />
                  </div>
                  <div className="bg-slate-800/40 border border-white/10 rounded-lg p-2 text-xs font-body">
                    <p className="text-white/60">{t.ex4Note}</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/40 rounded-lg p-3">
                    <p className="font-body text-sm font-bold text-purple-300">{t.ex4Ans}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RANGKUMAN */}
          <div className="mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-gradient-to-r from-cyan-600 via-green-500 to-teal-500 px-5 py-4 text-center">
              <p className="font-display text-lg font-bold text-white tracking-wide">{t.summaryHeader}</p>
              <p className="font-body text-xs text-white/80 mt-0.5">{t.summarySubheader}</p>
            </div>

            <div className={`${isDark ? "bg-slate-900/90" : "bg-white/97"} backdrop-blur px-5 py-5 space-y-5`}>
              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full ${isDark ? "bg-cyan-500/30 border-cyan-500" : "bg-cyan-100 border-cyan-400"} border flex items-center justify-center text-[10px]`}>1</span>
                  {t.summarySection1}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <div className={`${isDark ? "bg-gradient-to-r from-cyan-900/70 to-cyan-800/30 border-cyan-500/50" : "bg-cyan-50 border-cyan-300"} border rounded-xl p-3 text-center`}>
                    <p className="font-body text-xs text-cyan-300 font-bold mb-1">{t.summaryUnLabel}</p>
                    <BlockMath math="U_n = a + (n-1) \cdot b" />
                    <div className="flex justify-center gap-3 text-xs font-body flex-wrap mt-1">
                      <span className="text-cyan-300">{t.aLabel}</span>
                      <span className="text-green-300">{t.bLabel}</span>
                      <span className="text-violet-300">{t.nLabel}</span>
                    </div>
                  </div>
                  <div className={`${isDark ? "bg-gradient-to-r from-green-900/70 to-green-800/30 border-green-500/50" : "bg-green-50 border-green-300"} border rounded-xl p-3 text-center`}>
                    <p className="font-body text-xs text-green-300 font-bold mb-1">{t.summarySnLabel}</p>
                    <BlockMath math="S_n = \frac{n}{2}[2a + (n-1)b] = \frac{n}{2}(a + U_n)" />
                    <p className={`font-body text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>{t.summarySnNote}</p>
                  </div>
                  <div className={`${isDark ? "bg-gradient-to-r from-violet-900/70 to-violet-800/30 border-violet-500/50" : "bg-violet-50 border-violet-300"} border rounded-xl p-3 text-center`}>
                    <p className="font-body text-xs text-violet-300 font-bold mb-1">{t.summaryRelLabel}</p>
                    <BlockMath math="U_n = S_n - S_{n-1} \quad (n \geq 2)" />
                    <p className={`font-body text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>{t.summaryRelNote}</p>
                  </div>
                  <div className={`${isDark ? "bg-gradient-to-r from-orange-900/70 to-orange-800/30 border-orange-500/50" : "bg-orange-50 border-orange-300"} border rounded-xl p-3 text-center`}>
                    <p className="font-body text-xs text-orange-300 font-bold mb-1">{t.summaryBLabel}</p>
                    <BlockMath math="b = U_2 - U_1 = U_3 - U_2 = U_n - U_{n-1}" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full ${isDark ? "bg-yellow-500/30 border-yellow-500" : "bg-yellow-100 border-yellow-400"} border flex items-center justify-center text-[10px]`}>2</span>
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

              <div className={`${isDark ? "bg-gradient-to-br from-cyan-500/20 via-green-500/15 to-teal-500/20 border-white/20" : "bg-gradient-to-br from-cyan-50 via-green-50 to-teal-50 border-teal-200"} border rounded-2xl p-5 text-center space-y-3`}>
                <div className="text-3xl">🏆</div>
                <p className="font-display text-base font-bold text-white">{t.conclusionTitle}</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.conclusionBody}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {t.tags.map(tag => (
                    <span key={tag} className={`${isDark ? "bg-white/10 border-white/20 text-white/80" : "bg-white/80 border-slate-200 text-slate-600"} border text-xs font-body px-3 py-1 rounded-full`}>{tag}</span>
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

export default PolaAritmetikaPage;
