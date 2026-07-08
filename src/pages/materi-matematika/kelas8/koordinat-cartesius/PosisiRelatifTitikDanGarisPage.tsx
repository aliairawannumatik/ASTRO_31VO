import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Target, MapPin, Navigation, MousePointerClick } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { InteraktifTitikAcuan, InteraktifGaris } from "@/components/PosisiRelatifInteraktif";
import { RangkumanSection } from "@/components/RangkumanSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const T = {
  id: {
    pageTitle: "POSISI RELATIF TITIK TERHADAP TITIK ACUAN DAN SUATU GARIS",
    pageSubtitle: "Dua Perspektif Posisi: Dari Titik & Dari Garis!",
    breadcrumb: "Kelas 8 · Koordinat Kartesius · Materi Matematika",
    part1Header: "📍 Bagian 1 — Posisi Relatif terhadap Titik Acuan",
    part1Intisari: "🎯 Ringkasan Intisari",
    part1FormulaHeader: "📐 Rumus Posisi Relatif",
    part1FormulaLabel: "Selisih koordinat (posisi B terhadap A):",
    part1AnimHeader: "🎮 Animasi Interaktif — Seret Titik Acuan & Dua Titik",
    part1AnimBody: "Geser titik A (acuan), P, dan Q — posisi relatif otomatis dihitung!",
    part1ReadHeader: "🧭 Cara Membaca Hasil (Δx, Δy):",
    dx_pos: "B di KANAN A",
    dx_neg: "B di KIRI A",
    dy_pos: "B di ATAS A",
    dy_neg: "B di BAWAH A",
    intro1Header: "🌟 Bayangkan Ini...",
    intro1Body: "Kamu berdiri di alun-alun kota (titik acuan). Temanmu ada di 3 meter ke kananmu dan 5 meter di depanmu. Ini bukan koordinat mutlak terhadap \"nol\" — ini adalah",
    intro1Emph: "posisi relatif",
    intro1Body2: "terhadap dirimu sebagai titik acuan. Konsep yang sama digunakan dalam matematika: menentukan letak suatu titik bukan terhadap O(0,0), tapi terhadap",
    intro1Emph2: "sembarang titik acuan",
    intro1Body3: "yang kita pilih!",
    intro1Fact: "Aplikasi nyata:",
    intro1FactBody: "Sistem navigasi kapal, peta militer, permainan strategi, hingga robotika menggunakan konsep posisi relatif. Robot tahu \"bergerak 3 langkah ke kanan dari posisi saat ini\" — bukan dari titik nol mutlak!",
    konsep1Header: "📘 Konsep: Koordinat Relatif terhadap Titik Acuan",
    konsep1Body: "Jika",
    konsep1BodyMid: "adalah titik acuan dan",
    konsep1BodyEnd: "adalah titik yang ingin kita tentukan posisinya, maka",
    konsep1Emph: "posisi B relatif terhadap A",
    konsep1BodyFin: "dinyatakan sebagai selisih koordinat B terhadap A.",
    selisihH: "= selisih horizontal",
    selisihV: "= selisih vertikal",
    part2Header: "📐 Bagian 2 — Posisi Relatif terhadap Garis",
    part2Intisari: "🎯 Ringkasan Intisari",
    part2Body: "Untuk menentukan posisi titik",
    part2BodyMid: "terhadap garis",
    part2BodyEnd: ", substitusikan koordinat P ke ekspresi garis.",
    part2MetodeHeader: "🔑 Metode Substitusi",
    part2MetodeCalc: "Hitung nilai",
    part2MetodeLalu: ", lalu:",
    pos_pos: "Titik P berada di sisi POSITIF garis",
    pos_zero: "Titik P berada TEPAT PADA garis",
    pos_neg: "Titik P berada di sisi NEGATIF garis",
    part2AnimHeader: "🎮 Animasi Interaktif — Seret Garis & Titik P",
    part2AnimBody: "Geser L₁, L₂ untuk mengubah garis, dan titik P — posisi P otomatis ditentukan!",
    part2ReadHeader: "🧭 Cara Membaca Nilai f(P):",
    fpos: "f(P) > 0 → Sisi POSITIF",
    fzero: "f(P) = 0 → TEPAT PADA garis",
    fneg: "f(P) < 0 → Sisi NEGATIF",
    fposDesc: "Titik P berada di sisi positif garis (di atas atau di bawah bergantung penulisan persamaan)",
    fzeroDesc: "Koordinat titik P memenuhi persamaan garis — titik P tepat berada di atasnya",
    fnegDesc: "Titik P berada di sisi negatif garis (berlawanan dengan sisi positif)",
    warningHeader: "⚠️ Catatan Penting:",
    warningBody: '"Sisi positif" dan "sisi negatif" bergantung pada cara penulisan persamaan garis. Selalu pastikan garis ditulis dalam bentuk baku',
    warningBody2: "sebelum mensubstitusi.",
    intro2Header: "🌟 Di Mana Posisimu Terhadap Garis Batas?",
    intro2Body: "Bayangkan garis pantai sebagai batas antara laut dan daratan. Rumah di sisi mana? Di sisi laut atau daratan? Pertanyaan yang sama muncul di matematika: ketika ada sebuah garis di bidang Kartesius, kita bisa menentukan apakah suatu titik berada",
    intro2Emph: "di atas, di bawah, atau tepat pada garis",
    intro2Body2: "tersebut — tanpa perlu menggambar, hanya dengan substitusi koordinat!",
    intro2Fact: "Aplikasi nyata:",
    intro2FactBody: "Dalam machine learning, algoritma klasifikasi (seperti Support Vector Machine) menentukan apakah data baru berada di sisi positif atau negatif dari garis pemisah — persis konsep yang akan kamu pelajari ini!",
    konsep2Header: "📘 Cara Menentukan Posisi Titik terhadap Garis",
    konsep2Body: "Untuk menentukan posisi titik",
    konsep2BodyMid: "terhadap garis",
    konsep2BodyEnd: ", kita",
    konsep2Emph: "substitusikan koordinat P",
    konsep2BodyFin: "ke ekspresi garis dan perhatikan tandanya.",
    konsep2MetodeCalc: "Hitung nilai",
    konsep2MetodeLalu: ", lalu:",
    ex1aHeader: "✏️ Contoh 1 — Mudah (Posisi terhadap Titik Acuan)",
    ex2aHeader: "✏️ Contoh 2 — Sedang (Posisi terhadap Titik Acuan)",
    ex3aHeader: "✏️ Contoh 3 — Sulit (Posisi terhadap Titik Acuan)",
    ex1bHeader: "✏️ Contoh 1 — Mudah (Posisi terhadap Garis)",
    ex2bHeader: "✏️ Contoh 2 — Sedang (Posisi terhadap Garis)",
    ex3bHeader: "✏️ Contoh 3 — Sulit (Posisi terhadap Garis)",
    badge_easy: "MUDAH", badge_med: "SEDANG", badge_hard: "SULIT",
    soal: "📝 Soal", pembahasan: "🔍 Pembahasan",
    ex1aSoal: "Diketahui titik acuan",
    ex1aSoalMid: "dan titik",
    ex1aSoalEnd: ". Tentukan posisi titik B relatif terhadap titik A, dan jelaskan arahnya!",
    ex1aPosRelLabel: "Posisi B relatif terhadap A:",
    ex1aRelPos: "Posisi relatif:",
    ex1aDesc1: "B berada 4 satuan di",
    ex1aKanan: "kanan",
    ex1aAtas: "atas",
    ex1aAns: "✅ Posisi B relatif terhadap A = (4, 4) — 4 satuan ke kanan dan 4 satuan ke atas.",
    ex2aSoal: "Titik",
    ex2aSoalMid: "digunakan sebagai titik acuan. Jika titik Q berposisi relatif",
    ex2aSoalEnd: "terhadap P, tentukan koordinat titik Q yang sebenarnya (koordinat mutlaknya)!",
    ex2aGiven: "Diketahui posisi relatif Q terhadap P = (−4, 5), artinya:",
    ex2aTip: "💡 Rumus balik:",
    ex2aTipBody: "Koordinat mutlak = koordinat acuan + posisi relatif",
    ex2aAns: "✅ Koordinat Q =",
    ex2aCheck: "Cek: Q−P = (−3−1, 2−(−3)) = (−4, 5) ✓",
    ex3aSoal: "Diketahui titik-titik",
    ex3aSoalMid: ", dan",
    ex3aSoalEnd: ". Jika posisi C relatif terhadap B sama dengan posisi B relatif terhadap A, tentukan koordinat C!",
    ex3aStep1: "Langkah 1 — Hitung posisi B relatif terhadap A:",
    ex3aStep2: "Langkah 2 — Terapkan selisih yang sama untuk C relatif terhadap B:",
    ex3aStep2Body: "Posisi C relatif terhadap B juga = (5, −3)",
    ex3aNote: "💡 Ini sebenarnya membuat barisan aritmetika 2D: A → B → C dengan selisih (5, −3)!",
    ex3aPosBA: "Posisi B relatif terhadap A =",
    ex3aAns: "✅ Koordinat C =",
    ex1bSoal: "Tentukan posisi masing-masing titik berikut terhadap garis",
    ex1bSubst: "Garis:",
    ex1bSubstEnd: ". Substitusi setiap titik:",
    ex1bAbove: "→ A berada di sisi",
    ex1bOn: "→ B berada",
    ex1bOnEmph: "tepat pada garis",
    ex1bBelow: "→ C berada di sisi",
    ex1bAns: "✅ A → sisi positif, B → tepat pada garis, C → sisi negatif",
    ex2bSoal: "Garis",
    ex2bSoalMid: "memiliki persamaan",
    ex2bSoalMid2: ". Titik",
    ex2bSoalEnd: "berada di sisi negatif garis. Tentukan rentang nilai",
    ex2bGiven: "P di sisi negatif → substitusi P(k, 4) ke",
    ex2bGivenEnd: "harus < 0:",
    ex2bAns: "✅ Nilai k harus memenuhi",
    ex2bNote: "Misalnya k = 1, 0, −5 semuanya valid. Tapi k = 3 tidak.",
    ex3bSoal: "Titik",
    ex3bSoalMid: "dan",
    ex3bSoalEnd: "berada di sisi yang sama atau berbeda terhadap garis",
    ex3bSoalQ: "? Jelaskan!",
    ex3bCalcHeader: "Hitung f(A) dan f(B):",
    ex3bAnalHeader: "Analisis:",
    ex3bPosA: "f(A) = 2 > 0 → A di sisi",
    ex3bPosAEmph: "positif",
    ex3bPosB: "f(B) = −12 < 0 → B di sisi",
    ex3bPosBEmph: "negatif",
    ex3bDiff: "Tanda berbeda → A dan B di sisi yang",
    ex3bDiffEmph: "berlawanan!",
    ex3bRule: "💡 Aturan umum:",
    ex3bSameRule: "f(A) × f(B) > 0 → A dan B di sisi yang",
    ex3bSameSide: "sama",
    ex3bDiffRule: "f(A) × f(B) < 0 → A dan B di sisi yang",
    ex3bDiffSide: "berbeda",
    ex3bCheck: "Cek: f(A) × f(B) = 2 × (−12) = −24 < 0 ✓ (berbeda sisi)",
    ex3bAns: "✅ A dan B berada di sisi yang",
    ex3bAnsEmph: "BERBEDA",
    ex3bAnsSuffix: "terhadap garis 3x + 2y − 6 = 0",
    rang1Header: "📌 Rangkuman — Posisi terhadap Titik Acuan",
    rang1PosRel: "Posisi relatif B terhadap A",
    rang1AbsCoord: "Koordinat mutlak dari posisi relatif",
    rang1DxPos: "Δx > 0",
    rang1DxNeg: "Δx < 0",
    rang1DyPos: "Δy > 0",
    rang1DyNeg: "Δy < 0",
    rang1DxPosVal: "B di KANAN A",
    rang1DxNegVal: "B di KIRI A",
    rang1DyPosVal: "B di ATAS A",
    rang1DyNegVal: "B di BAWAH A",
    rang1Tip: "💡 Perbedaan kunci:",
    rang1TipBody: "Koordinat mutlak selalu dihitung dari O(0,0). Koordinat relatif dihitung dari titik acuan yang dipilih.",
    rang2Header: "📌 Rangkuman — Posisi Titik terhadap Garis",
    rangkumanJudul: "Rangkuman — Posisi Relatif Titik dan Garis",
    rangkumanSubjudul: "Gabungan dua teknik: posisi terhadap titik acuan dan posisi terhadap garis",
    back: "← Kembali ke Koordinat Kartesius",
    sisiPositif: "sisi positif",
    sisiNegatif: "sisi negatif",
    tepat: "tepat pada garis",
    r1judul: "Posisi vs Titik Acuan (Δx, Δy)", r1isi: "Δx = xB − xA (arah mendatar), Δy = yB − yA (arah tegak). Positif = kanan/atas, negatif = kiri/bawah.",
    r2judul: "Posisi vs Garis f(P)", r2isi: "Substitusikan P ke f(x,y)=ax+by+c. Hasilnya: f(P)>0 sisi positif, f(P)=0 di garis, f(P)<0 sisi negatif.",
    r3judul: "Dua Teknik Saling Melengkapi", r3isi: "Titik acuan: analisis vektor arah (Δx,Δy). Garis: analisis fungsi substitusi. Keduanya menjawab pertanyaan berbeda tentang posisi.",
    r4judul: "Aplikasi Gabungan", r4isi: "Di pemetaan & CAD: tentukan posisi gedung (titik) relatif terhadap jalan (garis acuan) dan batas wilayah (garis fungsi).",
    tip1: <>Dua rumus satu langkah: <strong>Titik acuan → TUJUAN − ACUAN</strong>. <strong>Garis → substitusi → cek tanda</strong>. Hafal keduanya!</>,
    tip2: <>Δx &gt; 0 (kanan) | Δx &lt; 0 (kiri) | Δy &gt; 0 (atas) | Δy &lt; 0 (bawah). f(P) &gt; 0 (sisi +) | f(P)=0 (di garis) | f(P) &lt; 0 (sisi −).</>,
    tip3: "Gabungkan keduanya: tentukan arah titik dari titik acuan (Δx,Δy), lalu cek apakah titik itu di atas/bawah garis batas dengan f(P). Teknik double-check!",
    tip4: "Untuk soal ujian: baca soal dua kali. Jika pertanyaan 'posisi dari titik' → gunakan Δx,Δy. Jika 'di sisi mana terhadap garis' → gunakan f(P).",
    kesimpulan: "Dua teknik posisi relatif ini adalah fondasi sistem koordinat di robotika, drone navigation, dan GIS (Geographic Information System). Titik dan garis — dua konsep sederhana yang menggambarkan seluruh tata ruang dua dimensi!",
    rumusLabel1: "Posisi relatif terhadap titik acuan A:", rumusLabel2: "Posisi relatif terhadap garis ax+by+c=0:",
    rang2ProseLabel: "Prosedur Menentukan Posisi Titik P(x₀,y₀) terhadap Garis ax+by+c=0",
    rang2SameHeader: "🔄 Dua titik di sisi yang sama:",
    rang2SameBody: "Jika f(A) × f(B) > 0: sisi sama. Jika f(A) × f(B) < 0: sisi berbeda.",
    acuanLabel: "Titik Acuan",
    posRelLabel: "Posisi B relatif terhadap A:",
    rang2Step1: "Tulis garis dalam bentuk baku ax + by + c = 0",
    rang2Step2: "Substitusikan x₀ dan y₀ ke dalam ax + by + c",
    rang2Step3: "Hitung hasilnya: positif, nol, atau negatif?",
    rang2Step4: "f(P) > 0 → sisi positif | f(P) = 0 → pada garis | f(P) < 0 → sisi negatif",
  },
  en: {
    pageTitle: "RELATIVE POSITION OF A POINT TO A REFERENCE POINT AND A LINE",
    pageSubtitle: "Two Perspectives of Position: From a Point & From a Line!",
    breadcrumb: "Grade 8 · Cartesian Coordinates · Math Material",
    part1Header: "📍 Part 1 — Relative Position to a Reference Point",
    part1Intisari: "🎯 Key Summary",
    part1FormulaHeader: "📐 Relative Position Formula",
    part1FormulaLabel: "Coordinate difference (position of B w.r.t. A):",
    part1AnimHeader: "🎮 Interactive Animation — Drag Reference Point & Two Points",
    part1AnimBody: "Slide point A (reference), P, and Q — relative positions are calculated automatically!",
    part1ReadHeader: "🧭 Reading the Result (Δx, Δy):",
    dx_pos: "B is to the RIGHT of A",
    dx_neg: "B is to the LEFT of A",
    dy_pos: "B is ABOVE A",
    dy_neg: "B is BELOW A",
    intro1Header: "🌟 Imagine This...",
    intro1Body: "You are standing in the town square (the reference point). Your friend is 3 meters to your right and 5 meters in front of you. This is not an absolute coordinate from \"zero\" — it is a",
    intro1Emph: "relative position",
    intro1Body2: "with respect to you as the reference point. The same concept is used in mathematics: determining the location of a point not relative to O(0,0), but relative to",
    intro1Emph2: "any chosen reference point",
    intro1Body3: "!",
    intro1Fact: "Real-world application:",
    intro1FactBody: "Ship navigation, military maps, strategy games, and robotics all use relative position. A robot knows \"move 3 steps to the right from the current position\" — not from absolute zero!",
    konsep1Header: "📘 Concept: Relative Coordinates to a Reference Point",
    konsep1Body: "If",
    konsep1BodyMid: "is the reference point and",
    konsep1BodyEnd: "is the point whose position we seek, then",
    konsep1Emph: "the position of B relative to A",
    konsep1BodyFin: "is expressed as the difference of their coordinates.",
    selisihH: "= horizontal difference",
    selisihV: "= vertical difference",
    part2Header: "📐 Part 2 — Relative Position to a Line",
    part2Intisari: "🎯 Key Summary",
    part2Body: "To determine the position of point",
    part2BodyMid: "relative to line",
    part2BodyEnd: ", substitute the coordinates of P into the line expression.",
    part2MetodeHeader: "🔑 Substitution Method",
    part2MetodeCalc: "Calculate the value",
    part2MetodeLalu: ", then:",
    pos_pos: "Point P is on the POSITIVE side of the line",
    pos_zero: "Point P lies EXACTLY ON the line",
    pos_neg: "Point P is on the NEGATIVE side of the line",
    part2AnimHeader: "🎮 Interactive Animation — Drag Line & Point P",
    part2AnimBody: "Slide L₁, L₂ to change the line, and point P — position of P is determined automatically!",
    part2ReadHeader: "🧭 Reading the Value f(P):",
    fpos: "f(P) > 0 → POSITIVE Side",
    fzero: "f(P) = 0 → EXACTLY ON the line",
    fneg: "f(P) < 0 → NEGATIVE Side",
    fposDesc: "Point P is on the positive side of the line (above or below depends on how the equation is written)",
    fzeroDesc: "The coordinates of point P satisfy the line equation — P lies exactly on the line",
    fnegDesc: "Point P is on the negative side of the line (opposite the positive side)",
    warningHeader: "⚠️ Important Note:",
    warningBody: '"Positive side" and "negative side" depend on how the line equation is written. Always make sure the line is in standard form',
    warningBody2: "before substituting.",
    intro2Header: "🌟 Where Is Your Position Relative to the Boundary Line?",
    intro2Body: "Imagine the coastline as the boundary between sea and land. Which side is the house on? Sea or land? The same question arises in mathematics: when there is a line on the Cartesian plane, we can determine whether a point is",
    intro2Emph: "above, below, or exactly on the line",
    intro2Body2: "— without drawing, just by substituting coordinates!",
    intro2Fact: "Real-world application:",
    intro2FactBody: "In machine learning, classification algorithms (such as Support Vector Machine) determine whether new data is on the positive or negative side of a separator line — exactly the concept you will learn here!",
    konsep2Header: "📘 How to Determine the Position of a Point Relative to a Line",
    konsep2Body: "To determine the position of point",
    konsep2BodyMid: "relative to line",
    konsep2BodyEnd: ", we",
    konsep2Emph: "substitute the coordinates of P",
    konsep2BodyFin: "into the line expression and observe the sign.",
    konsep2MetodeCalc: "Calculate the value",
    konsep2MetodeLalu: ", then:",
    ex1aHeader: "✏️ Example 1 — Easy (Position to Reference Point)",
    ex2aHeader: "✏️ Example 2 — Medium (Position to Reference Point)",
    ex3aHeader: "✏️ Example 3 — Hard (Position to Reference Point)",
    ex1bHeader: "✏️ Example 1 — Easy (Position to Line)",
    ex2bHeader: "✏️ Example 2 — Medium (Position to Line)",
    ex3bHeader: "✏️ Example 3 — Hard (Position to Line)",
    badge_easy: "EASY", badge_med: "MEDIUM", badge_hard: "HARD",
    soal: "📝 Problem", pembahasan: "🔍 Solution",
    ex1aSoal: "Given reference point",
    ex1aSoalMid: "and point",
    ex1aSoalEnd: ". Find the position of point B relative to point A, and explain the direction!",
    ex1aPosRelLabel: "Position of B relative to A:",
    ex1aRelPos: "Relative position:",
    ex1aDesc1: "B is 4 units to the",
    ex1aKanan: "right of",
    ex1aAtas: "above",
    ex1aAns: "✅ Position of B relative to A = (4, 4) — 4 units to the right and 4 units above.",
    ex2aSoal: "Point",
    ex2aSoalMid: "is used as the reference point. If point Q has relative position",
    ex2aSoalEnd: "from P, find the absolute coordinates of point Q!",
    ex2aGiven: "Given relative position of Q from P = (−4, 5), meaning:",
    ex2aTip: "💡 Reverse formula:",
    ex2aTipBody: "Absolute coordinate = reference coordinate + relative position",
    ex2aAns: "✅ Coordinates of Q =",
    ex2aCheck: "Check: Q−P = (−3−1, 2−(−3)) = (−4, 5) ✓",
    ex3aSoal: "Given points",
    ex3aSoalMid: ", and",
    ex3aSoalEnd: ". If the position of C relative to B equals the position of B relative to A, find the coordinates of C!",
    ex3aStep1: "Step 1 — Calculate the position of B relative to A:",
    ex3aStep2: "Step 2 — Apply the same difference for C relative to B:",
    ex3aStep2Body: "Position of C relative to B is also = (5, −3)",
    ex3aNote: "💡 This actually forms a 2D arithmetic sequence: A → B → C with difference (5, −3) at each step!",
    ex3aPosBA: "Position of B relative to A =",
    ex3aAns: "✅ Coordinates of C =",
    ex1bSoal: "Determine the position of each of the following points relative to the line",
    ex1bSubst: "Line:",
    ex1bSubstEnd: ". Substitute each point:",
    ex1bAbove: "→ A is on the",
    ex1bOn: "→ B lies",
    ex1bOnEmph: "exactly on the line",
    ex1bBelow: "→ C is on the",
    ex1bAns: "✅ A → positive side, B → exactly on the line, C → negative side",
    ex2bSoal: "Line",
    ex2bSoalMid: "has equation",
    ex2bSoalMid2: ". Point",
    ex2bSoalEnd: "is on the negative side of the line. Find the range of values of",
    ex2bGiven: "P on the negative side → substitute P(k, 4) into",
    ex2bGivenEnd: "must be < 0:",
    ex2bAns: "✅ The value of k must satisfy",
    ex2bNote: "For example k = 1, 0, −5 are all valid. But k = 3 is not.",
    ex3bSoal: "Points",
    ex3bSoalMid: "and",
    ex3bSoalEnd: "— are they on the same or different sides of the line",
    ex3bSoalQ: "? Explain!",
    ex3bCalcHeader: "Calculate f(A) and f(B):",
    ex3bAnalHeader: "Analysis:",
    ex3bPosA: "f(A) = 2 > 0 → A is on the",
    ex3bPosAEmph: "positive side",
    ex3bPosB: "f(B) = −12 < 0 → B is on the",
    ex3bPosBEmph: "negative side",
    ex3bDiff: "Different signs → A and B are on",
    ex3bDiffEmph: "opposite sides!",
    ex3bRule: "💡 General rule:",
    ex3bSameRule: "f(A) × f(B) > 0 → A and B on the",
    ex3bSameSide: "same side",
    ex3bDiffRule: "f(A) × f(B) < 0 → A and B on",
    ex3bDiffSide: "different sides",
    ex3bCheck: "Check: f(A) × f(B) = 2 × (−12) = −24 < 0 ✓ (different sides)",
    ex3bAns: "✅ A and B are on",
    ex3bAnsEmph: "DIFFERENT",
    ex3bAnsSuffix: "sides of the line 3x + 2y − 6 = 0",
    rang1Header: "📌 Summary — Position to Reference Point",
    rang1PosRel: "Relative position of B w.r.t. A",
    rang1AbsCoord: "Absolute coordinates from relative position",
    rang1DxPos: "Δx > 0",
    rang1DxNeg: "Δx < 0",
    rang1DyPos: "Δy > 0",
    rang1DyNeg: "Δy < 0",
    rang1DxPosVal: "B is to the RIGHT of A",
    rang1DxNegVal: "B is to the LEFT of A",
    rang1DyPosVal: "B is ABOVE A",
    rang1DyNegVal: "B is BELOW A",
    rang1Tip: "💡 Key difference:",
    rang1TipBody: "Absolute coordinates are always measured from O(0,0). Relative coordinates are measured from the chosen reference point.",
    rang2Header: "📌 Summary — Position of Point to Line",
    rangkumanJudul: "Summary — Relative Position of Points and Lines",
    rangkumanSubjudul: "Combining two techniques: position relative to a reference point and position relative to a line",
    back: "← Back to Cartesian Coordinates",
    sisiPositif: "positive side",
    sisiNegatif: "negative side",
    tepat: "exactly on the line",
    r1judul: "Position vs Reference Point (Δx, Δy)", r1isi: "Δx = xB − xA (horizontal direction), Δy = yB − yA (vertical direction). Positive = right/up, negative = left/down.",
    r2judul: "Position vs Line f(P)", r2isi: "Substitute P into f(x,y)=ax+by+c. Result: f(P)>0 positive side, f(P)=0 on line, f(P)<0 negative side.",
    r3judul: "Two Complementary Techniques", r3isi: "Reference point: direction vector analysis (Δx,Δy). Line: substitution function analysis. Both answer different questions about position.",
    r4judul: "Combined Application", r4isi: "In mapping & CAD: determine position of a building (point) relative to a road (reference line) and territory boundary (function line).",
    tip1: <>Two formulas in one step: <strong>Reference point → DESTINATION − REFERENCE</strong>. <strong>Line → substitute → check sign</strong>. Memorize both!</>,
    tip2: <>Δx &gt; 0 (right) | Δx &lt; 0 (left) | Δy &gt; 0 (up) | Δy &lt; 0 (down). f(P) &gt; 0 (+side) | f(P)=0 (on line) | f(P) &lt; 0 (−side).</>,
    tip3: "Combine both: determine direction of point from reference point (Δx,Δy), then check if the point is above/below the boundary line with f(P). Double-check technique!",
    tip4: "For exams: read the question twice. If asking 'position from a point' → use Δx,Δy. If asking 'which side of a line' → use f(P).",
    kesimpulan: "These two relative position techniques are the foundation of coordinate systems in robotics, drone navigation, and GIS (Geographic Information System). Points and lines — two simple concepts that describe the entire two-dimensional space!",
    rumusLabel1: "Relative position to reference point A:", rumusLabel2: "Relative position to line ax+by+c=0:",
    rang2ProseLabel: "Procedure for determining position of P(x₀,y₀) relative to line ax+by+c=0",
    rang2SameHeader: "🔄 Two points on the same side:",
    rang2SameBody: "If f(A) × f(B) > 0: same side. If f(A) × f(B) < 0: different sides.",
    acuanLabel: "Reference Point",
    posRelLabel: "Position of B relative to A:",
    rang2Step1: "Write the line in standard form ax + by + c = 0",
    rang2Step2: "Substitute x₀ and y₀ into ax + by + c",
    rang2Step3: "Calculate the result: positive, zero, or negative?",
    rang2Step4: "f(P) > 0 → positive side | f(P) = 0 → on line | f(P) < 0 → negative side",
  },
  ja: {
    pageTitle: "基準点と直線に対する点の相対位置",
    pageSubtitle: "位置の2つの視点：点から & 直線から！",
    breadcrumb: "中学2年 · 直交座標 · 数学教材",
    part1Header: "📍 パート1 — 基準点に対する相対位置",
    part1Intisari: "🎯 要点まとめ",
    part1FormulaHeader: "📐 相対位置の公式",
    part1FormulaLabel: "座標の差（AからみたBの位置）：",
    part1AnimHeader: "🎮 インタラクティブアニメーション — 基準点と2点をドラッグ",
    part1AnimBody: "点A（基準）、P、Qをスライドさせると、相対位置が自動的に計算されます！",
    part1ReadHeader: "🧭 結果（Δx, Δy）の読み方：",
    dx_pos: "BはAの右にある",
    dx_neg: "BはAの左にある",
    dy_pos: "BはAの上にある",
    dy_neg: "BはAの下にある",
    intro1Header: "🌟 想像してみよう...",
    intro1Body: "あなたは町の広場（基準点）に立っています。友達はあなたの右3メートル、前5メートルにいます。これは「ゼロ」からの絶対座標ではなく、あなたを基準点とした",
    intro1Emph: "相対位置",
    intro1Body2: "です。数学でも同じ概念を使います：O(0,0)からではなく、",
    intro1Emph2: "任意の基準点",
    intro1Body3: "に対して点の位置を決めることができます！",
    intro1Fact: "実際の応用：",
    intro1FactBody: "船舶ナビゲーション、軍事地図、戦略ゲーム、ロボット工学はすべて相対位置の概念を使用します。ロボットは「現在位置から右に3歩移動」と認識します — 絶対ゼロからではなく！",
    konsep1Header: "📘 概念：基準点への相対座標",
    konsep1Body: "",
    konsep1BodyMid: "が基準点で、",
    konsep1BodyEnd: "の位置を求める場合、",
    konsep1Emph: "AからみたBの相対位置",
    konsep1BodyFin: "は座標の差で表されます。",
    selisihH: "= 水平方向の差",
    selisihV: "= 垂直方向の差",
    part2Header: "📐 パート2 — 直線に対する相対位置",
    part2Intisari: "🎯 要点まとめ",
    part2Body: "点",
    part2BodyMid: "の直線",
    part2BodyEnd: "に対する位置を判定するには、Pの座標を直線の式に代入します。",
    part2MetodeHeader: "🔑 代入法",
    part2MetodeCalc: "値を計算",
    part2MetodeLalu: "、次に：",
    pos_pos: "Pは直線の正の側にある",
    pos_zero: "Pは直線上にある",
    pos_neg: "Pは直線の負の側にある",
    part2AnimHeader: "🎮 インタラクティブアニメーション — 直線とPをドラッグ",
    part2AnimBody: "L₁、L₂をスライドして直線を変え、点Pも動かすと、Pの位置が自動的に判定されます！",
    part2ReadHeader: "🧭 f(P)の値の読み方：",
    fpos: "f(P) > 0 → 正の側",
    fzero: "f(P) = 0 → 直線上",
    fneg: "f(P) < 0 → 負の側",
    fposDesc: "点Pは直線の正の側にある（式の書き方により上または下）",
    fzeroDesc: "点Pの座標が直線の方程式を満たす — Pは直線上にある",
    fnegDesc: "点Pは直線の負の側にある（正の側の逆）",
    warningHeader: "⚠️ 重要な注意：",
    warningBody: "「正の側」と「負の側」は方程式の書き方に依存します。代入前に必ず直線を標準形",
    warningBody2: "に変換してください。",
    intro2Header: "🌟 境界線に対する位置はどこ？",
    intro2Body: "海岸線を海と陸地の境界として想像してください。家はどちら側？海側？陸地側？数学でも同じ疑問が生まれます：直交座標上に直線があるとき、ある点が",
    intro2Emph: "直線の上・下、または直線上にある",
    intro2Body2: "かを、グラフを描かずに座標の代入だけで判定できます！",
    intro2Fact: "実際の応用：",
    intro2FactBody: "機械学習では、分類アルゴリズム（サポートベクターマシンなど）が新しいデータを境界線の正の側か負の側かを判定します — まさにここで学ぶ概念と同じです！",
    konsep2Header: "📘 直線に対する点の位置の判定方法",
    konsep2Body: "点",
    konsep2BodyMid: "の直線",
    konsep2BodyEnd: "に対する位置を判定するには、",
    konsep2Emph: "Pの座標を代入",
    konsep2BodyFin: "して符号を確認します。",
    konsep2MetodeCalc: "値を計算",
    konsep2MetodeLalu: "、次に：",
    ex1aHeader: "✏️ 例題1 — 基本（基準点に対する位置）",
    ex2aHeader: "✏️ 例題2 — 標準（基準点に対する位置）",
    ex3aHeader: "✏️ 例題3 — 発展（基準点に対する位置）",
    ex1bHeader: "✏️ 例題1 — 基本（直線に対する位置）",
    ex2bHeader: "✏️ 例題2 — 標準（直線に対する位置）",
    ex3bHeader: "✏️ 例題3 — 発展（直線に対する位置）",
    badge_easy: "基本", badge_med: "標準", badge_hard: "発展",
    soal: "📝 問題", pembahasan: "🔍 解説",
    ex1aSoal: "基準点",
    ex1aSoalMid: "と点",
    ex1aSoalEnd: "が与えられています。点Aに対するBの相対位置を求め、方向を説明してください！",
    ex1aPosRelLabel: "AからみたBの相対位置：",
    ex1aRelPos: "相対位置：",
    ex1aDesc1: "Bは",
    ex1aKanan: "Aの右4単位",
    ex1aAtas: "Aの上4単位",
    ex1aAns: "✅ AからみたBの相対位置 = (4, 4) — 右に4単位、上に4単位",
    ex2aSoal: "点",
    ex2aSoalMid: "を基準点として使います。点Qが P に対して相対位置",
    ex2aSoalEnd: "にある場合、点Qの絶対座標を求めなさい！",
    ex2aGiven: "PからみたQの相対位置 = (−4, 5) とわかっているので：",
    ex2aTip: "💡 逆公式：",
    ex2aTipBody: "絶対座標 = 基準座標 + 相対位置",
    ex2aAns: "✅ Qの座標 =",
    ex2aCheck: "確認：Q−P = (−3−1, 2−(−3)) = (−4, 5) ✓",
    ex3aSoal: "点",
    ex3aSoalMid: "、",
    ex3aSoalEnd: "が与えられています。BからみたCの相対位置がAからみたBの相対位置と等しい場合、Cの座標を求めなさい！",
    ex3aStep1: "ステップ1 — AからみたBの相対位置を計算する：",
    ex3aStep2: "ステップ2 — BからみたCに同じ差を適用する：",
    ex3aStep2Body: "BからみたCの相対位置も (5, −3)",
    ex3aNote: "💡 実はこれは2次元の等差数列です：A → B → C で各ステップの差は (5, −3)！",
    ex3aPosBA: "AからみたBの相対位置 =",
    ex3aAns: "✅ Cの座標 =",
    ex1bSoal: "次の各点の直線に対する位置を判定しなさい",
    ex1bSubst: "直線：",
    ex1bSubstEnd: "。各点を代入：",
    ex1bAbove: "→ Aは",
    ex1bOn: "→ Bは",
    ex1bOnEmph: "直線上",
    ex1bBelow: "→ Cは",
    ex1bAns: "✅ A → 正の側, B → 直線上, C → 負の側",
    ex2bSoal: "直線",
    ex2bSoalMid: "は方程式",
    ex2bSoalMid2: "を持ちます。点",
    ex2bSoalEnd: "が直線の負の側にある場合、",
    ex2bGiven: "Pが負の側 → P(k, 4)を",
    ex2bGivenEnd: "に代入して < 0 でなければならない：",
    ex2bAns: "✅ k の値は次を満たす必要がある",
    ex2bNote: "例えば k = 1, 0, −5 はすべて有効。k = 3 は無効。",
    ex3bSoal: "点",
    ex3bSoalMid: "と",
    ex3bSoalEnd: "は直線",
    ex3bSoalQ: "に対して同じ側にありますか、それとも異なる側にありますか？説明してください！",
    ex3bCalcHeader: "f(A) と f(B) を計算：",
    ex3bAnalHeader: "分析：",
    ex3bPosA: "f(A) = 2 > 0 → Aは",
    ex3bPosAEmph: "正の側",
    ex3bPosB: "f(B) = −12 < 0 → Bは",
    ex3bPosBEmph: "負の側",
    ex3bDiff: "符号が異なる → A と B は",
    ex3bDiffEmph: "反対側！",
    ex3bRule: "💡 一般ルール：",
    ex3bSameRule: "f(A) × f(B) > 0 → AとBは",
    ex3bSameSide: "同じ側",
    ex3bDiffRule: "f(A) × f(B) < 0 → AとBは",
    ex3bDiffSide: "異なる側",
    ex3bCheck: "確認：f(A) × f(B) = 2 × (−12) = −24 < 0 ✓（異なる側）",
    ex3bAns: "✅ A と B は直線 3x + 2y − 6 = 0 に対して",
    ex3bAnsEmph: "異なる側",
    ex3bAnsSuffix: "にあります",
    rang1Header: "📌 まとめ — 基準点に対する位置",
    rang1PosRel: "AからみたBの相対位置",
    rang1AbsCoord: "相対位置から絶対座標",
    rang1DxPos: "Δx > 0",
    rang1DxNeg: "Δx < 0",
    rang1DyPos: "Δy > 0",
    rang1DyNeg: "Δy < 0",
    rang1DxPosVal: "BはAの右にある",
    rang1DxNegVal: "BはAの左にある",
    rang1DyPosVal: "BはAの上にある",
    rang1DyNegVal: "BはAの下にある",
    rang1Tip: "💡 重要な違い：",
    rang1TipBody: "絶対座標は常にO(0,0)から測定されます。相対座標は選んだ基準点から測定されます。",
    rang2Header: "📌 まとめ — 直線に対する点の位置",
    rangkumanJudul: "まとめ — 点と直線の相対位置",
    rangkumanSubjudul: "2つの技法の組み合わせ：基準点に対する位置と直線に対する位置",
    back: "← 直交座標に戻る",
    sisiPositif: "正の側",
    sisiNegatif: "負の側",
    tepat: "直線上",
    r1judul: "基準点に対する位置（Δx, Δy）", r1isi: "Δx = xB − xA（水平方向）、Δy = yB − yA（垂直方向）。正 = 右/上、負 = 左/下。",
    r2judul: "直線に対する位置 f(P)", r2isi: "f(x,y)=ax+by+c にPを代入。f(P)>0 → 正の側、f(P)=0 → 直線上、f(P)<0 → 負の側。",
    r3judul: "2つの補完的な技法", r3isi: "基準点：方向ベクトル分析（Δx,Δy）。直線：代入関数分析。両者は位置に関する異なる質問に答える。",
    r4judul: "組み合わせ応用", r4isi: "地図作成・CAD：建物（点）の道路（基準線）と区域境界（関数直線）に対する位置を決定する。",
    tip1: <>2つの公式を1ステップで：<strong>基準点 → 目標 − 基準</strong>。<strong>直線 → 代入 → 符号確認</strong>。両方覚える！</>,
    tip2: <>Δx &gt; 0（右）| Δx &lt; 0（左）| Δy &gt; 0（上）| Δy &lt; 0（下）。f(P) &gt; 0（+側）| f(P)=0（直線上）| f(P) &lt; 0（−側）。</>,
    tip3: "両方を組み合わせる：基準点からの方向（Δx,Δy）を求め、f(P)で境界線の上下を確認する。ダブルチェック技法！",
    tip4: "試験では：問題を2回読む。「点からの位置」なら → Δx,Δy。「直線のどちら側か」なら → f(P)。",
    kesimpulan: "この2つの相対位置技法は、ロボット工学、ドローンナビゲーション、GIS（地理情報システム）の座標系の基礎です。点と直線 — 2次元空間全体を記述する2つのシンプルな概念！",
    rumusLabel1: "基準点Aに対する相対位置：", rumusLabel2: "直線ax+by+c=0に対する相対位置：",
    rang2ProseLabel: "点P(x₀,y₀)の直線ax+by+c=0に対する位置判定手順",
    rang2SameHeader: "🔄 2点が同じ側かどうか：",
    rang2SameBody: "f(A) × f(B) > 0 なら同じ側。f(A) × f(B) < 0 なら異なる側。",
    acuanLabel: "基準点",
    posRelLabel: "AからみたBの相対位置：",
    rang2Step1: "直線を標準形 ax + by + c = 0 に変換する",
    rang2Step2: "x₀ と y₀ を ax + by + c に代入する",
    rang2Step3: "結果を計算：正、ゼロ、または負？",
    rang2Step4: "f(P) > 0 → 正の側 | f(P) = 0 → 直線上 | f(P) < 0 → 負の側",
  },
};

const PosisiRelatifTitikDanGarisPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const t = T[language];
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (id: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const SectionHeader = ({ id, icon, iconColor, title }: {
    id: string; icon: React.ReactNode; iconColor?: string; title: React.ReactNode;
  }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      <ChevronUp className="w-5 h-5 text-primary" />
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

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
        <p className="text-white/50 text-xs text-center mb-8 font-body">{t.breadcrumb}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ══ BAGIAN 1: POSISI RELATIF TERHADAP TITIK ACUAN ══ */}
          <div className="bg-gradient-to-r from-orange-500/20 to-cyan-500/20 border border-orange-400/40 rounded-xl px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">📍</span>
            <p className="font-display text-base font-bold text-orange-300 leading-tight">{t.part1Header}</p>
          </div>

          {/* INTRO 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro1" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.intro1Header} />
            {expandedSections.includes("intro1") || true ? (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.intro1Body} <strong className="text-cyan-300">{t.intro1Emph}</strong> {t.intro1Body2} <strong className="text-cyan-300">{t.intro1Emph2}</strong> {t.intro1Body3}
                </p>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>{t.intro1Fact}</strong> {t.intro1FactBody}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* KONSEP 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<MapPin className="w-5 h-5" />} iconColor="text-orange-400" title={t.konsep1Header} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-2">{t.part1Intisari}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.konsep1Body} <InlineMath math="A(x_1, y_1)" /> {t.konsep1BodyMid} <InlineMath math="B(x_2, y_2)" /> {t.konsep1BodyEnd} <strong className="text-cyan-300">{t.konsep1Emph}</strong> {t.konsep1BodyFin}
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4 text-center space-y-2">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-2">{t.part1FormulaHeader}</p>
                  <BlockMath math="\Delta x = x_B - x_A \qquad \Delta y = y_B - y_A" />
                  <div className="flex justify-center gap-4 text-xs font-body flex-wrap mt-1">
                    <span className="text-cyan-300"><InlineMath math="\Delta x" /> {t.selisihH}</span>
                    <span className="text-green-300"><InlineMath math="\Delta y" /> {t.selisihV}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ANIMASI INTERAKTIF 1 */}
          <div className="bg-card/80 backdrop-blur border border-orange-500/30 rounded-xl overflow-hidden">
            <div className="px-5 py-4 flex items-center gap-3 border-b border-orange-500/20">
              <MousePointerClick className="w-5 h-5 text-orange-400 shrink-0" />
              <div>
                <p className="font-body font-semibold text-white">{t.part1AnimHeader}</p>
                <p className="text-white/50 text-xs font-body mt-0.5">{t.part1AnimBody}</p>
              </div>
            </div>
            <div className="px-5 py-5 space-y-4">
              <InteraktifTitikAcuan />
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 space-y-2 text-xs font-body">
                <p className="font-bold text-white mb-2">{t.part1ReadHeader}</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { kondisi: "Δx > 0", arti: t.dx_pos, color: "text-cyan-300" },
                    { kondisi: "Δx < 0", arti: t.dx_neg, color: "text-cyan-300" },
                    { kondisi: "Δy > 0", arti: t.dy_pos, color: "text-green-300" },
                    { kondisi: "Δy < 0", arti: t.dy_neg, color: "text-green-300" },
                  ].map(({ kondisi, arti, color }) => (
                    <div key={kondisi} className="bg-slate-700/40 border border-white/10 rounded-lg p-2">
                      <p className={`font-mono font-bold ${color}`}>{kondisi}</p>
                      <p className="text-white/60 mt-0.5">{arti}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CONTOH 1A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1a" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.ex1aHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_easy} color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    {t.ex1aSoal} <InlineMath math="A(3, 2)" /> {t.ex1aSoalMid} <InlineMath math="B(7, 6)" />{t.ex1aSoalEnd}
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                    <p className="text-white/70">{t.ex1aPosRelLabel}</p>
                    <BlockMath math="\Delta x = x_B - x_A = 7 - 3 = 4" />
                    <BlockMath math="\Delta y = y_B - y_A = 6 - 2 = 4" />
                    <p className="text-white/70">{t.ex1aRelPos} <strong className="text-cyan-300">(4, 4)</strong></p>
                    <p className="text-white/60 text-xs">→ <InlineMath math="\Delta x = 4 > 0" />: {t.ex1aDesc1} <strong className="text-cyan-300">{t.ex1aKanan}</strong> A</p>
                    <p className="text-white/60 text-xs">→ <InlineMath math="\Delta y = 4 > 0" />: {t.ex1aDesc1} <strong className="text-green-300">{t.ex1aAtas}</strong> A</p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="text-cyan-300 text-sm font-bold">{t.ex1aAns}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2a" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.ex2aHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_med} color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    {t.ex2aSoal} <InlineMath math="P(1, -3)" /> {t.ex2aSoalMid} <InlineMath math="(-4, 5)" /> {t.ex2aSoalEnd}
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                    <p className="text-white/70">{t.ex2aGiven}</p>
                    <BlockMath math="x_Q - x_P = -4 \Rightarrow x_Q = x_P + (-4) = 1 + (-4) = -3" />
                    <BlockMath math="y_Q - y_P = 5 \Rightarrow y_Q = y_P + 5 = -3 + 5 = 2" />
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 text-xs">
                    <p className="text-yellow-200">{t.ex2aTip} {t.ex2aTipBody}</p>
                    <p className="text-white/60 mt-0.5"><InlineMath math="B = A + (\Delta x, \Delta y)" /></p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="text-cyan-300 text-sm font-bold">{t.ex2aAns} <InlineMath math="(-3, 2)" /></p>
                    <p className="text-white/60 text-xs mt-1">{t.ex2aCheck}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3a" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title={t.ex3aHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_hard} color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    {t.ex3aSoal} <InlineMath math="A(-2, 4)" />, <InlineMath math="B(3, 1)" />{t.ex3aSoalMid} <InlineMath math="C(c_1, c_2)" />{t.ex3aSoalEnd}
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">{t.ex3aStep1}</p>
                      <BlockMath math="\Delta x_{BA} = x_B - x_A = 3 - (-2) = 5" />
                      <BlockMath math="\Delta y_{BA} = y_B - y_A = 1 - 4 = -3" />
                      <p className="text-white/70">{t.ex3aPosBA} <strong className="text-cyan-300">(5, −3)</strong></p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-2">{t.ex3aStep2}</p>
                      <p className="text-white/70">{t.ex3aStep2Body}</p>
                      <BlockMath math="c_1 = x_B + 5 = 3 + 5 = 8" />
                      <BlockMath math="c_2 = y_B + (-3) = 1 - 3 = -2" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-white/60">
                      <p className="text-white/70 mb-1">{t.ex3aNote}</p>
                      <p>A(−2, 4) → B(3, 1) → C(8, −2)</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="text-cyan-300 text-sm font-bold">{t.ex3aAns} <InlineMath math="(8, -2)" /></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman1" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title={t.rang1Header} />
            {true && (
              <div className="px-5 pb-5 space-y-3 text-sm font-body">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                  {[
                    [t.rang1PosRel, "(x₂ − x₁, y₂ − y₁)"],
                    [t.rang1AbsCoord, "B = A + (Δx, Δy)"],
                    [t.rang1DxPos, t.rang1DxPosVal],
                    [t.rang1DxNeg, t.rang1DxNegVal],
                    [t.rang1DyPos, t.rang1DyPosVal],
                    [t.rang1DyNeg, t.rang1DyNegVal],
                  ].map(([term, def]) => (
                    <div key={term} className="flex gap-2">
                      <span className="text-cyan-400 shrink-0">▸</span>
                      <p className="text-white/80"><strong className="text-cyan-300">{term}:</strong> {def}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-200 text-xs"><strong>{t.rang1Tip}</strong> {t.rang1TipBody}</p>
                </div>
              </div>
            )}
          </div>

          {/* ══ BAGIAN 2: POSISI RELATIF TERHADAP GARIS ══ */}
          <div className="bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-400/40 rounded-xl px-5 py-4 flex items-center gap-3 mt-4">
            <span className="text-2xl">🗺️</span>
            <p className="font-display text-base font-bold text-violet-300 leading-tight">{t.part2Header}</p>
          </div>

          {/* INTRO 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro2" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.intro2Header} />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.intro2Body} <strong className="text-cyan-300">{t.intro2Emph}</strong> {t.intro2Body2}
                </p>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>{t.intro2Fact}</strong> {t.intro2FactBody}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* KONSEP 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep2" icon={<Navigation className="w-5 h-5" />} iconColor="text-violet-400" title={t.konsep2Header} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">{t.part2Intisari}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.konsep2Body} <InlineMath math="P(x_0, y_0)" /> {t.konsep2BodyMid} <InlineMath math="ax + by + c = 0" />{t.konsep2BodyEnd} <strong className="text-violet-300">{t.konsep2Emph}</strong> {t.konsep2BodyFin}
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-violet-300 uppercase mb-1">{t.part2MetodeHeader}</p>
                  <p className="font-body text-xs text-white/60">{t.konsep2MetodeCalc} <InlineMath math="f(P) = ax_0 + by_0 + c" />{t.konsep2MetodeLalu}</p>
                  <div className="space-y-2 text-xs font-body">
                    {[
                      { kondisi: "f(P) > 0", arti: t.pos_pos, bg: "bg-cyan-900/40 border-cyan-500/40 text-cyan-200" },
                      { kondisi: "f(P) = 0", arti: t.pos_zero, bg: "bg-green-900/40 border-green-500/40 text-green-200" },
                      { kondisi: "f(P) < 0", arti: t.pos_neg, bg: "bg-pink-900/40 border-pink-500/40 text-pink-200" },
                    ].map(({ kondisi, arti, bg }) => (
                      <div key={kondisi} className={`border ${bg} rounded-lg p-3 flex gap-3 items-center`}>
                        <span className="font-mono font-bold text-sm min-w-[70px]">{kondisi}</span>
                        <span className="text-white/70">{arti}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ANIMASI INTERAKTIF 2 */}
          <div className="bg-card/80 backdrop-blur border border-violet-500/30 rounded-xl overflow-hidden">
            <div className="px-5 py-4 flex items-center gap-3 border-b border-violet-500/20">
              <MousePointerClick className="w-5 h-5 text-violet-400 shrink-0" />
              <div>
                <p className="font-body font-semibold text-white">{t.part2AnimHeader}</p>
                <p className="text-white/50 text-xs font-body mt-0.5">{t.part2AnimBody}</p>
              </div>
            </div>
            <div className="px-5 py-5 space-y-4">
              <InteraktifGaris />
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 space-y-2 text-xs font-body">
                <p className="font-bold text-white mb-2">{t.part2ReadHeader}</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 bg-pink-900/30 border border-pink-500/30 rounded-lg p-3">
                    <span className="w-4 h-4 rounded-full bg-pink-400 shrink-0" />
                    <div>
                      <p className="font-mono font-bold text-pink-300">{t.fpos}</p>
                      <p className="text-white/60 mt-0.5">{t.fposDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                    <span className="w-4 h-4 rounded-full bg-green-400 shrink-0" />
                    <div>
                      <p className="font-mono font-bold text-green-300">{t.fzero}</p>
                      <p className="text-white/60 mt-0.5">{t.fzeroDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-3">
                    <span className="w-4 h-4 rounded-full bg-cyan-400 shrink-0" />
                    <div>
                      <p className="font-mono font-bold text-cyan-300">{t.fneg}</p>
                      <p className="text-white/60 mt-0.5">{t.fnegDesc}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-xs font-body">
                <p className="text-yellow-200 font-bold mb-1">{t.warningHeader}</p>
                <p className="text-yellow-100/80">{t.warningBody} <InlineMath math="ax + by + c = 0" /> {t.warningBody2}</p>
              </div>
            </div>
          </div>

          {/* CONTOH 1B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1b" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title={t.ex1bHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_easy} color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    {t.ex1bSoal} <InlineMath math="2x + y - 4 = 0" />:<br />
                    a) <InlineMath math="A(3, 2)" />&nbsp;&nbsp;b) <InlineMath math="B(1, 2)" />&nbsp;&nbsp;c) <InlineMath math="C(-1, 0)" />
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-white/70 mb-2">{t.ex1bSubst} <InlineMath math="f(x,y) = 2x + y - 4" />{t.ex1bSubstEnd}</p>
                    <div className="space-y-2 text-xs">
                      <div className="bg-pink-900/20 border border-pink-500/20 rounded p-2">
                        <p className="text-pink-300">a) f(A) = 2(3) + 2 − 4 = 6 + 2 − 4 = <strong>4 &gt; 0</strong></p>
                        <p className="text-white/60 mt-0.5">{t.ex1bAbove} <strong className="text-pink-300">{t.sisiPositif}</strong></p>
                      </div>
                      <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                        <p className="text-green-300">b) f(B) = 2(1) + 2 − 4 = 2 + 2 − 4 = <strong>0</strong></p>
                        <p className="text-white/60 mt-0.5">{t.ex1bOn} <strong className="text-green-300">{t.ex1bOnEmph}</strong></p>
                      </div>
                      <div className="bg-cyan-900/20 border border-cyan-500/20 rounded p-2">
                        <p className="text-cyan-300">c) f(C) = 2(−1) + 0 − 4 = −2 + 0 − 4 = <strong>−6 &lt; 0</strong></p>
                        <p className="text-white/60 mt-0.5">{t.ex1bBelow} <strong className="text-cyan-300">{t.sisiNegatif}</strong></p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="text-cyan-300 text-sm font-bold">{t.ex1bAns}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2b" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.ex2bHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_med} color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    {t.ex2bSoal} <InlineMath math="\ell" /> {t.ex2bSoalMid} <InlineMath math="x - 2y + 6 = 0" />{t.ex2bSoalMid2} <InlineMath math="P(k, 4)" /> {t.ex2bSoalEnd} <InlineMath math="k" />!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-white/70">{t.ex2bGiven} <InlineMath math="f(x,y) = x - 2y + 6" /> {t.ex2bGivenEnd}</p>
                      <BlockMath math="f(P) = k - 2(4) + 6 < 0" />
                      <BlockMath math="k - 8 + 6 < 0" />
                      <BlockMath math="k - 2 < 0 \Rightarrow k < 2" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="text-cyan-300 text-sm font-bold">{t.ex2bAns} <InlineMath math="k < 2" /></p>
                      <p className="text-white/60 text-xs mt-1">{t.ex2bNote}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3b" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title={t.ex3bHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label={t.badge_hard} color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">{t.soal}</p>
                  <p className="font-body text-sm text-white/85">
                    {t.ex3bSoal} <InlineMath math="A(2, 1)" /> {t.ex3bSoalMid} <InlineMath math="B(-4, 3)" /> {t.ex3bSoalEnd} <InlineMath math="3x + 2y - 6 = 0" />{t.ex3bSoalQ}
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">{t.pembahasan}</p>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">{t.ex3bCalcHeader}</p>
                      <BlockMath math="f(A) = 3(2) + 2(1) - 6 = 6 + 2 - 6 = 2" />
                      <BlockMath math="f(B) = 3(-4) + 2(3) - 6 = -12 + 6 - 6 = -12" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">{t.ex3bAnalHeader}</p>
                      <p className="text-white/70 text-xs">{t.ex3bPosA} <strong className="text-pink-300">{t.ex3bPosAEmph}</strong></p>
                      <p className="text-white/70 text-xs">{t.ex3bPosB} <strong className="text-cyan-300">{t.ex3bPosBEmph}</strong></p>
                      <p className="text-white/70 text-xs mt-2">{t.ex3bDiff} <strong className="text-yellow-300">{t.ex3bDiffEmph}</strong></p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-xs font-body">
                      <p className="text-white/60 mb-1">{t.ex3bRule}</p>
                      <p className="text-white/60">• {t.ex3bSameRule} <strong className="text-green-300">{t.ex3bSameSide}</strong></p>
                      <p className="text-white/60">• {t.ex3bDiffRule} <strong className="text-red-300">{t.ex3bDiffSide}</strong></p>
                      <p className="text-white/60 mt-1">{t.ex3bCheck}</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="text-cyan-300 text-sm font-bold">{t.ex3bAns} <strong>{t.ex3bAnsEmph}</strong> {t.ex3bAnsSuffix}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman2" icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title={t.rang2Header} />
            {true && (
              <div className="px-5 pb-5 space-y-3 text-sm font-body">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-violet-300 font-semibold text-xs uppercase">{t.rang2ProseLabel}</p>
                  <div className="space-y-2 text-xs">
                    {[
                      { step: "1", desc: t.rang2Step1, color: "text-cyan-300" },
                      { step: "2", desc: t.rang2Step2, color: "text-violet-300" },
                      { step: "3", desc: t.rang2Step3, color: "text-green-300" },
                      { step: "4", desc: t.rang2Step4, color: "text-orange-300" },
                    ].map(({ step, desc, color }) => (
                      <div key={step} className="flex gap-2">
                        <span className={`font-display font-bold ${color} shrink-0`}>{step}.</span>
                        <p className="text-white/70">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-white/10 rounded-lg p-3 text-xs font-body">
                  <p className="text-white/70 font-semibold mb-1">{t.rang2SameHeader}</p>
                  <p className="text-white/60">{t.rang2SameBody}</p>
                </div>
              </div>
            )}
          </div>

          {/* ═══ RANGKUMAN AKHIR ═══ */}
          <RangkumanSection
            isDark={isDark}
            gradientFrom="from-orange-600" gradientVia="via-amber-600" gradientTo="to-yellow-600"
            borderColor="border-amber-500/30" accentColor="text-amber-200"
            headerIcon="📋" judul={t.rangkumanJudul}
            subjudul={t.rangkumanSubjudul}
            ringkasan={[
              { emoji:"🎯", judul:t.r1judul,
                bg:        isDark ? "bg-orange-900/40"  : "bg-orange-100",
                border:    isDark ? "border-orange-500/30" : "border-orange-400",
                textColor: isDark ? "text-orange-300"   : "text-orange-700",
                isi:t.r1isi },
              { emoji:"📐", judul:t.r2judul,
                bg:        isDark ? "bg-amber-900/40"   : "bg-amber-100",
                border:    isDark ? "border-amber-500/30"  : "border-amber-400",
                textColor: isDark ? "text-amber-300"    : "text-amber-700",
                isi:t.r2isi },
              { emoji:"🔗", judul:t.r3judul,
                bg:        isDark ? "bg-yellow-900/40"  : "bg-yellow-100",
                border:    isDark ? "border-yellow-500/30" : "border-yellow-400",
                textColor: isDark ? "text-yellow-300"   : "text-yellow-700",
                isi:t.r3isi },
              { emoji:"🌐", judul:t.r4judul,
                bg:        isDark ? "bg-lime-900/40"    : "bg-lime-100",
                border:    isDark ? "border-lime-500/30"   : "border-lime-400",
                textColor: isDark ? "text-lime-300"     : "text-lime-700",
                isi:t.r4isi },
            ]}
            rumus={[
              { label:t.rumusLabel1, rumus:"\\Delta x = x_B - x_A \\qquad \\Delta y = y_B - y_A",
                bg:         isDark ? "bg-orange-900/30" : "bg-orange-50",
                border:     isDark ? "border-orange-500/25" : "border-orange-300",
                labelColor: isDark ? "text-orange-300"  : "text-orange-700" },
              { label:t.rumusLabel2, rumus:"f(P) = ax_P + by_P + c \\quad (> 0,\\, = 0,\\, < 0)",
                bg:         isDark ? "bg-amber-900/30"  : "bg-amber-50",
                border:     isDark ? "border-amber-500/25"  : "border-amber-300",
                labelColor: isDark ? "text-amber-300"   : "text-amber-700" },
            ]}
            tips={[
              { emoji:"🧠", teks:t.tip1 },
              { emoji:"↔️", teks:t.tip2 },
              { emoji:"🗺️", teks:t.tip3 },
              { emoji:"✅", teks:t.tip4 },
            ]}
            kesimpulan={t.kesimpulan}
            kesimpulanBg={isDark
              ? "bg-gradient-to-r from-orange-600/20 to-yellow-600/20"
              : "bg-gradient-to-r from-orange-100 to-yellow-100"}
            kesimpulanBorder={isDark ? "border-amber-400/40" : "border-amber-400"}
            kesimpulanTextColor={isDark ? "text-amber-100/90" : "text-amber-800"}
          />

        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/koordinat-cartesius"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PosisiRelatifTitikDanGarisPage;
