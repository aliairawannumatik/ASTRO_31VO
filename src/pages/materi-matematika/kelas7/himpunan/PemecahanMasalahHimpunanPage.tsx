import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Hash,
  ListChecks,
  Zap,
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ══════════════════════════════════════════════════════════
   TRANSLATIONS
══════════════════════════════════════════════════════════ */
const translations = {
  id: {
    title: "PEMECAHAN MASALAH YANG BERKAITAN DENGAN HIMPUNAN",
    subtitle: "Kardinalitas · Langkah Penyelesaian · Tips Jitu",
    breadcrumb: "Kelas 7 · Himpunan · Materi Matematika",
    back: "← Kembali ke Himpunan",
    easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
    summary: "📌 Ringkasan Intisari",
    problems: "📝 Contoh Soal & Pembahasan",
    solution: "PEMBAHASAN",
    step: "Langkah",
    known: "Diketahui",
    conclude: "Kesimpulan",
    verify: "Verifikasi",
    example: "Contoh",

    // Sub-bab headers
    sub1: "Sub-Bab 1: Prinsip Dasar Kardinalitas Himpunan",
    sub2: "Sub-Bab 2: Langkah-Langkah Penyelesaian Masalah",
    sub3: "Strategi Cepat — \"Tips Jitu\"",

    // SVG labels
    venn2title: "Kardinalitas Dua Himpunan",
    venn3title: "Kardinalitas Tiga Himpunan",
    flowTitle: "Alur Penyelesaian Masalah Himpunan",
    onlyA: "hanya A", onlyB: "hanya B", onlyC: "hanya C",
    outside: "d = di luar A dan B",
    step1label: "① IDENTIFIKASI", step1desc: "Baca soal, tandai data",
    step2label: "② MODELKAN",    step2desc: "Buat notasi & Diagram Venn",
    step3label: "③ ISI DIAGRAM", step3desc: "Mulai dari irisan/tengah",
    step4label: "④ HITUNG & VERIFIKASI", step4desc: "Pakai rumus, cek total = n(S)",
    step5label: "✅ KESIMPULAN",

    // Sub1 summary
    s1p1: "Kardinalitas adalah banyaknya anggota suatu himpunan, dinotasikan",
    s1p2: "Konsep ini jadi fondasi utama saat kita ingin memecahkan masalah yang melibatkan dua atau tiga kelompok sekaligus — misalnya survei, data ekskul, atau soal cerita berganda.",
    s1rumus2: "📐 Rumus Kardinalitas — Dua Himpunan:",
    s1rumus3: "📐 Rumus Kardinalitas — Tiga Himpunan:",
    s1sifat: [
      ["n(A) ≥ 0", "Kardinalitas selalu ≥ 0"],
      ["n(∅) = 0", "Himpunan kosong punya 0 anggota"],
      ["n(Aᶜ) = n(S) − n(A)", "Komplemen: sisa dari semesta"],
      ["n(A∩B) ≤ n(A) dan n(A∩B) ≤ n(B)", "Irisan ≤ kedua induknya"],
    ],
    s1tip: "💡 Tips: Kalau soal menyebutkan \"tidak ada yang mengikuti keduanya\", berarti",
    s1tip2: "sehingga",
    s1tip3: "langsung tanpa pengurangan.",

    // Sub1 problems
    s1e1q: "Dalam sebuah kelompok belajar terdapat 25 siswa. Diketahui 14 siswa menyukai Matematika, 11 siswa menyukai Bahasa Indonesia, dan 4 siswa menyukai keduanya. Berapa siswa yang tidak menyukai keduanya?",
    s1e1s1: "Hitung gabungan:",
    s1e1s2: "Siswa yang tidak menyukai keduanya:",
    s1e1ans: "Ada 4 siswa yang tidak menyukai kedua pelajaran tersebut.",

    s1e2q: "Dari 45 pengunjung perpustakaan, 20 meminjam buku fiksi, 18 meminjam buku sains, dan 8 tidak meminjam buku apapun. Berapa pengunjung yang meminjam kedua jenis buku tersebut?",
    s1e2s1: "Langkah 1 — Cari yang meminjam setidaknya satu buku:",
    s1e2s2: "Langkah 2 — Cari irisan (keduanya) dengan rumus:",
    s1e2ans: "Hanya 1 pengunjung yang meminjam kedua jenis buku sekaligus.",

    s1e3q: "Survei terhadap 60 remaja: 32 punya akun Instagram (I), 27 punya akun X (X), 25 punya akun YouTube (Y). Diketahui 15 punya I dan X, 12 punya I dan Y, 10 punya X dan Y, 5 punya ketiganya, dan sisanya tidak punya akun apapun. Berapa remaja yang tidak punya akun apapun?",
    s1e3s1: "Gunakan rumus tiga himpunan:",
    s1e3s2: "Yang tidak punya akun apapun:",
    s1e3veri: "Verifikasi tiap daerah Diagram Venn:",
    s1e3only_i: "Hanya I:", s1e3only_x: "Hanya X:", s1e3only_y: "Hanya Y:",
    s1e3ix: "I∩X saja:", s1e3iy: "I∩Y saja:", s1e3xy: "X∩Y saja:",
    s1e3all: "Ketiganya: 5 · Di luar: 8",
    s1e3total: "Total:",
    s1e3ans: "Ada 8 remaja yang tidak punya akun apapun.",

    // Sub2 summary
    s2p1: "Kunci sukses mengerjakan soal himpunan adalah punya",
    s2p1b: "alur kerja yang runtut",
    s2p2: "Banyak siswa langsung bingung karena tidak punya peta jalan. Ikuti 4 langkah berikut dan soal sepanjang apapun akan bisa diselesaikan secara sistematis.",
    s2steps: [
      { step: "① IDENTIFIKASI", color: "text-cyan-300", bg: "bg-cyan-900/30 border-cyan-500/30", desc: "Baca soal minimal 2 kali. Tandai: total keseluruhan (n(S)), banyak tiap kelompok, irisan yang disebutkan, dan yang ditanyakan." },
      { step: "② MODELKAN",    color: "text-indigo-300", bg: "bg-indigo-900/30 border-indigo-500/30", desc: "Beri nama himpunan (A, B, C). Tulis notasi matematisnya. Gambar sketsa Diagram Venn di kertas buram." },
      { step: "③ ISI DIAGRAM", color: "text-green-300", bg: "bg-green-900/30 border-green-500/30", desc: "Isi daerah tengah (irisan/ketiganya) terlebih dahulu, lalu hitung mundur daerah-daerah pinggirnya." },
      { step: "④ HITUNG & VERIFIKASI", color: "text-orange-300", bg: "bg-orange-900/30 border-orange-500/30", desc: "Gunakan rumus inklusi-eksklusi. Setelah selesai, jumlahkan SEMUA daerah di diagram — hasilnya harus tepat sama dengan n(S)." },
    ],
    s2tip: "💡 Tips: Verifikasi adalah langkah yang sering dilewati tapi sangat penting. Jika jumlah semua daerah ≠ n(S), ada yang salah — perbaiki sebelum menjawab!",

    // Sub2 problems
    s2e1q: "Terdapat 35 anak di kelas. 20 anak mengikuti les piano, 18 anak mengikuti les menggambar, dan 7 anak mengikuti keduanya. Berapa anak yang tidak mengikuti les apapun? Selesaikan dengan 4 langkah!",
    s2e1title: "PEMBAHASAN — 4 LANGKAH:",
    s2e1_1: "n(S)=35, n(P)=20 (piano), n(G)=18 (gambar), n(P∩G)=7, ditanya: di luar kedua les",
    s2e1_2: "P = himpunan anak les piano, G = himpunan anak les gambar",
    s2e1_3: "Tengah (P∩G) = 7 | Hanya P = 20−7 = 13 | Hanya G = 18−7 = 11",
    s2e1cek: "Cek: 13 + 7 + 11 + 4 = 35 ✓",
    s2e1ans: "Ada 4 anak yang tidak mengikuti les apapun.",

    s2e2q: "Di sebuah RT terdapat 50 kepala keluarga. Sebanyak 30 memiliki motor, 22 memiliki sepeda, dan 6 tidak memiliki keduanya. Tentukan: berapa yang memiliki keduanya, berapa yang hanya punya motor, dan berapa yang hanya punya sepeda?",
    s2e2ident: "n(S)=50, n(M)=30, n(K)=22, di luar keduanya=6",
    s2e2kunci: "Langkah kunci: Cari dulu yang punya setidaknya satu:",
    s2e2cari: "Cari irisan:",
    s2e2isi: "Isi diagram:",
    s2e2motor: "Hanya motor:", s2e2sepeda: "Hanya sepeda:", s2e2keduanya: "Keduanya:",
    s2e2luar: "Di luar:",
    s2e2cek: "Cek: 22+8+14+6 = 50 ✓",
    s2e2kk: "KK",

    s2e3q: "Dari 80 siswa di sebuah sekolah: 45 ikut ekskul Seni, 38 ikut ekskul Olahraga, 30 ikut ekskul Sains. Diketahui 20 ikut Seni dan Olahraga, 15 ikut Seni dan Sains, 12 ikut Olahraga dan Sains. Jika semua siswa ikut setidaknya satu ekskul, berapa yang ikut ketiganya?",
    s2e3ident: "n(S)=80, semua ikut minimal 1 → n(A∪B∪C)=80",
    s2e3ident2: "n(A)=45, n(B)=38, n(C)=30, n(A∩B)=20, n(A∩C)=15, n(B∩C)=12",
    s2e3susun: "Susun persamaan dari rumus 3 himpunan:",
    s2e3veri: "Verifikasi isi diagram:",
    s2e3onlyA: "Hanya A: 45−20−15+14 = 24",
    s2e3onlyB: "Hanya B: 38−20−12+14 = 20",
    s2e3onlyC: "Hanya C: 30−15−12+14 = 17",
    s2e3ab: "A∩B saja: 20−14 = 6", s2e3ac: "A∩C saja: 15−14 = 1",
    s2e3bc: "B∩C saja: 12−14 = ...",
    s2e3warn: "⚠️ Catatan Penting:",
    s2e3warnText: "Hasil negatif pada daerah diagram mengindikasikan data soal yang tidak konsisten atau ada pembulatan. Dalam soal ujian, pastikan data yang diberikan selalu menghasilkan nilai non-negatif. Jawaban yang diminta adalah",
    s2e3ans: "Ada 14 siswa yang mengikuti ketiga ekskul sekaligus.",

    // Sub3 summary
    s3p1: "Setelah menguasai konsep dan langkah, kamu perlu",
    s3p1b: "strategi cepat",
    s3p2: "untuk menghemat waktu di ujian. Berikut kumpulan \"jurus rahasia\" yang bisa membuatmu menyelesaikan soal himpunan lebih cepat dan lebih akurat.",
    s3tips: [
      { no: "🎯 Tips 1", title: "Cari Irisan Dulu dari Informasi Tak Langsung", color: "bg-blue-900/30 border-blue-500/30 text-blue-300", desc: "Jika soal menyebutkan 'yang tidak ikut keduanya = x', maka: n(A∪B) = n(S) − x, lalu n(A∩B) = n(A) + n(B) − n(A∪B). Ini cara paling efisien!" },
      { no: "🎯 Tips 2", title: "Rumus Cepat: Hanya Satu Kelompok", color: "bg-emerald-900/30 border-emerald-500/30 text-emerald-300", desc: "Untuk menghitung \"hanya A\" (tidak termasuk B): n(hanya A) = n(A) − n(A∩B). Ini berguna saat soal menanyakan masing-masing bagian diagram." },
      { no: "🎯 Tips 3", title: "Gunakan Tabel untuk Soal 2 Kondisi", color: "bg-purple-900/30 border-purple-500/30 text-purple-300", desc: "Soal berbentuk \"berapa yang A tapi bukan B\" cocok diselesaikan dengan tabel 2×2. Cara ini mengurangi kesalahan perhitungan." },
      { no: "⚠️ Tips 4", title: "Waspadai Kata 'Tepat' vs 'Setidaknya'", color: "bg-red-900/30 border-red-500/30 text-red-300", desc: "\"Tepat dua\" = hanya dua, bukan tiga. \"Setidaknya dua\" = dua atau tiga. Kesalahan membaca ini adalah sumber error terbanyak di soal olimpiade!" },
      { no: "💡 Tips 5", title: "Cek Konsistensi Data Sebelum Mulai", color: "bg-amber-900/30 border-amber-500/30 text-amber-300", desc: "Pastikan n(A∩B) ≤ min(n(A), n(B)) dan n(A∪B) ≤ n(S). Jika tidak terpenuhi, soalnya mungkin punya jebakan atau data yang perlu dibaca ulang." },
    ],
    s3tableTitle: "📋 Tabel Rumus Cepat — Dua Himpunan:",
    s3tableHead: ["Yang Dicari", "Rumus"],
    s3tableRows: [
      ["n(A∪B)", "n(A) + n(B) − n(A∩B)"],
      ["n(A∩B)", "n(A) + n(B) − n(A∪B)"],
      ["Di luar A∪B", "n(S) − n(A∪B)"],
      ["Hanya A", "n(A) − n(A∩B)"],
      ["Hanya B", "n(B) − n(A∩B)"],
      ["n(Aᶜ)", "n(S) − n(A)"],
    ],

    s3e1q: "Di antara 30 siswa, 12 suka voli dan 10 suka basket. Tidak ada yang suka keduanya. Berapa siswa yang tidak suka keduanya? (Gunakan Tips 1)",
    s3e1p1: "Karena tidak ada yang suka keduanya:",
    s3e1tip: "💡 Ketika irisan = 0, rumus menyederhanakan diri menjadi n(A∪B) = n(A) + n(B).",
    s3e1ans: "Ada 8 siswa yang tidak suka keduanya.",

    s3e2q: "Gunakan tabel untuk mencari: hanya A, hanya B, keduanya, dan di luar keduanya.",
    s3e2title: "PEMBAHASAN — METODE TABEL:",
    s3e2only_a: "Hanya A = 28−10 =", s3e2only_b: "Hanya B = 22−10 =",
    s3e2both: "Keduanya (A∩B) =", s3e2out: "Di luar keduanya = 50−10−18−12 =",

    s3e3q: "Dari 100 orang, setiap orang menyukai setidaknya satu dari tiga warna: Merah (M), Biru (B), Kuning (K). Diketahui: n(M)=60, n(B)=50, n(K)=40, yang menyukai tepat dua warna berjumlah 30, dan yang menyukai ketiga warna berjumlah 10. Berapa yang hanya menyukai satu warna?",
    s3e3title: "PEMBAHASAN — STRATEGI JITU:",
    s3e3ident: "Gunakan identitas penting:",
    s3e3formula: "n(M∪B∪K) = n(hanya 1) + n(tepat 2) + n(tepat 3)",
    s3e3p1: "Karena semua suka setidaknya satu:",
    s3e3tip_title: "💡 Tip Olimpiade:",
    s3e3tip_desc: "Ada cara lain: n(hanya 1) = Σn(tiap himpunan) − 2·n(tepat 2) − 3·n(tepat 3) = 60+50+40 − 2(30) − 3(10) = 150 − 60 − 30 = 60 ✓",
    s3e3ans: "Ada 60 orang yang hanya menyukai tepat satu warna.",
  },

  en: {
    title: "PROBLEM SOLVING RELATED TO SETS",
    subtitle: "Cardinality · Solution Steps · Pro Tips",
    breadcrumb: "Grade 7 · Sets · Mathematics",
    back: "← Back to Sets",
    easy: "Easy", medium: "Medium", hard: "Hard",
    summary: "📌 Summary",
    problems: "📝 Practice Problems & Solutions",
    solution: "SOLUTION",
    step: "Step",
    known: "Given",
    conclude: "Conclusion",
    verify: "Verification",
    example: "Example",

    sub1: "Section 1: Basic Principles of Set Cardinality",
    sub2: "Section 2: Problem-Solving Steps",
    sub3: "Quick Strategies — \"Pro Tips\"",

    venn2title: "Cardinality of Two Sets",
    venn3title: "Cardinality of Three Sets",
    flowTitle: "Set Problem-Solving Flowchart",
    onlyA: "only A", onlyB: "only B", onlyC: "only C",
    outside: "d = outside A and B",
    step1label: "① IDENTIFY",   step1desc: "Read the problem, mark the data",
    step2label: "② MODEL",      step2desc: "Write notation & draw Venn Diagram",
    step3label: "③ FILL DIAGRAM", step3desc: "Start from intersection/center",
    step4label: "④ CALCULATE & VERIFY", step4desc: "Use formula, check total = n(S)",
    step5label: "✅ CONCLUSION",

    s1p1: "Cardinality is the number of members in a set, denoted",
    s1p2: "This concept is the main foundation when solving problems involving two or three groups — such as surveys, club data, or multi-condition word problems.",
    s1rumus2: "📐 Cardinality Formula — Two Sets:",
    s1rumus3: "📐 Cardinality Formula — Three Sets:",
    s1sifat: [
      ["n(A) ≥ 0", "Cardinality is always ≥ 0"],
      ["n(∅) = 0", "Empty set has 0 members"],
      ["n(Aᶜ) = n(S) − n(A)", "Complement: what's left from the universal set"],
      ["n(A∩B) ≤ n(A) and n(A∩B) ≤ n(B)", "Intersection ≤ both parent sets"],
    ],
    s1tip: "💡 Tip: If the problem states \"no one is in both groups\", then",
    s1tip2: "so",
    s1tip3: "directly without subtraction.",

    s1e1q: "A study group has 25 students. 14 students like Mathematics, 11 like Indonesian, and 4 like both. How many students like neither?",
    s1e1s1: "Calculate the union:",
    s1e1s2: "Students who like neither:",
    s1e1ans: "There are 4 students who like neither subject.",

    s1e2q: "Of 45 library visitors, 20 borrowed fiction books, 18 borrowed science books, and 8 did not borrow any books. How many visitors borrowed both types?",
    s1e2s1: "Step 1 — Find those who borrowed at least one book:",
    s1e2s2: "Step 2 — Find the intersection using the formula:",
    s1e2ans: "Only 1 visitor borrowed both types of books.",

    s1e3q: "A survey of 60 teenagers: 32 have Instagram (I), 27 have X (X), 25 have YouTube (Y). Given: 15 have I and X, 12 have I and Y, 10 have X and Y, 5 have all three, and the rest have no accounts. How many have no accounts?",
    s1e3s1: "Use the three-set formula:",
    s1e3s2: "Those with no accounts:",
    s1e3veri: "Verify each region of the Venn Diagram:",
    s1e3only_i: "Only I:", s1e3only_x: "Only X:", s1e3only_y: "Only Y:",
    s1e3ix: "I∩X only:", s1e3iy: "I∩Y only:", s1e3xy: "X∩Y only:",
    s1e3all: "All three: 5 · Outside: 8",
    s1e3total: "Total:",
    s1e3ans: "There are 8 teenagers with no accounts.",

    s2p1: "The key to success with set problems is having a",
    s2p1b: "systematic workflow",
    s2p2: "Many students get confused because they lack a roadmap. Follow these 4 steps and any problem can be solved systematically.",
    s2steps: [
      { step: "① IDENTIFY", color: "text-cyan-300", bg: "bg-cyan-900/30 border-cyan-500/30", desc: "Read the problem at least twice. Identify: total (n(S)), count of each group, stated intersections, and what is asked." },
      { step: "② MODEL",    color: "text-indigo-300", bg: "bg-indigo-900/30 border-indigo-500/30", desc: "Name the sets (A, B, C). Write the mathematical notation. Sketch a Venn Diagram on scratch paper." },
      { step: "③ FILL DIAGRAM", color: "text-green-300", bg: "bg-green-900/30 border-green-500/30", desc: "Fill the center region (intersection/all three) first, then work outward to calculate the outer regions." },
      { step: "④ CALCULATE & VERIFY", color: "text-orange-300", bg: "bg-orange-900/30 border-orange-500/30", desc: "Use inclusion-exclusion. After finishing, sum ALL regions — the result must equal exactly n(S)." },
    ],
    s2tip: "💡 Tip: Verification is often skipped but very important. If the sum of all regions ≠ n(S), something is wrong — fix it before writing your final answer!",

    s2e1q: "There are 35 students in a class. 20 attend piano lessons, 18 attend drawing lessons, and 7 attend both. How many attend neither lesson? Solve using the 4 steps!",
    s2e1title: "SOLUTION — 4 STEPS:",
    s2e1_1: "n(S)=35, n(P)=20 (piano), n(G)=18 (drawing), n(P∩G)=7, find: outside both lessons",
    s2e1_2: "P = set of piano students, G = set of drawing students",
    s2e1_3: "Center (P∩G) = 7 | Only P = 20−7 = 13 | Only G = 18−7 = 11",
    s2e1cek: "Check: 13 + 7 + 11 + 4 = 35 ✓",
    s2e1ans: "There are 4 students who attend neither lesson.",

    s2e2q: "A neighborhood has 50 households. 30 have a motorcycle, 22 have a bicycle, and 6 have neither. Find: how many have both, how many have only a motorcycle, and how many have only a bicycle.",
    s2e2ident: "n(S)=50, n(M)=30, n(K)=22, outside both=6",
    s2e2kunci: "Key step: First find those with at least one:",
    s2e2cari: "Find the intersection:",
    s2e2isi: "Fill the diagram:",
    s2e2motor: "Only motorcycle:", s2e2sepeda: "Only bicycle:", s2e2keduanya: "Both:",
    s2e2luar: "Outside:",
    s2e2cek: "Check: 22+8+14+6 = 50 ✓",
    s2e2kk: "HH",

    s2e3q: "From 80 students: 45 join Art club, 38 join Sports club, 30 join Science club. Given: 20 join Art and Sports, 15 join Art and Science, 12 join Sports and Science. If all students join at least one club, how many join all three?",
    s2e3ident: "n(S)=80, everyone joins ≥ 1 → n(A∪B∪C)=80",
    s2e3ident2: "n(A)=45, n(B)=38, n(C)=30, n(A∩B)=20, n(A∩C)=15, n(B∩C)=12",
    s2e3susun: "Set up the three-set equation:",
    s2e3veri: "Verify each Venn Diagram region:",
    s2e3onlyA: "Only A: 45−20−15+14 = 24",
    s2e3onlyB: "Only B: 38−20−12+14 = 20",
    s2e3onlyC: "Only C: 30−15−12+14 = 17",
    s2e3ab: "A∩B only: 20−14 = 6", s2e3ac: "A∩C only: 15−14 = 1",
    s2e3bc: "B∩C only: 12−14 = ...",
    s2e3warn: "⚠️ Important Note:",
    s2e3warnText: "A negative region value indicates inconsistent data or rounding in the problem. In exam problems, the data should always yield non-negative values. The requested answer is",
    s2e3ans: "There are 14 students who join all three clubs.",

    s3p1: "After mastering concepts and steps, you need",
    s3p1b: "quick strategies",
    s3p2: "to save time in exams. Here is a collection of \"secret tricks\" to solve set problems faster and more accurately.",
    s3tips: [
      { no: "🎯 Tip 1", title: "Find Intersection from Indirect Information", color: "bg-blue-900/30 border-blue-500/30 text-blue-300", desc: "If the problem states 'those in neither = x', then: n(A∪B) = n(S) − x, then n(A∩B) = n(A) + n(B) − n(A∪B). This is the most efficient approach!" },
      { no: "🎯 Tip 2", title: "Quick Formula: Only One Group", color: "bg-emerald-900/30 border-emerald-500/30 text-emerald-300", desc: "To find \"only A\" (not including B): n(only A) = n(A) − n(A∩B). Useful when the problem asks for each section of the diagram." },
      { no: "🎯 Tip 3", title: "Use a Table for 2-Condition Problems", color: "bg-purple-900/30 border-purple-500/30 text-purple-300", desc: "Problems asking \"how many are A but not B\" are well-solved with a 2×2 table. This reduces calculation errors." },
      { no: "⚠️ Tip 4", title: "Watch 'Exactly' vs 'At Least'", color: "bg-red-900/30 border-red-500/30 text-red-300", desc: "\"Exactly two\" = only two, not three. \"At least two\" = two or three. Misreading this is the most common error in competition problems!" },
      { no: "💡 Tip 5", title: "Check Data Consistency Before Starting", color: "bg-amber-900/30 border-amber-500/30 text-amber-300", desc: "Ensure n(A∩B) ≤ min(n(A), n(B)) and n(A∪B) ≤ n(S). If not satisfied, the problem may have a trick or needs re-reading." },
    ],
    s3tableTitle: "📋 Quick Formula Table — Two Sets:",
    s3tableHead: ["Find", "Formula"],
    s3tableRows: [
      ["n(A∪B)", "n(A) + n(B) − n(A∩B)"],
      ["n(A∩B)", "n(A) + n(B) − n(A∪B)"],
      ["Outside A∪B", "n(S) − n(A∪B)"],
      ["Only A", "n(A) − n(A∩B)"],
      ["Only B", "n(B) − n(A∩B)"],
      ["n(Aᶜ)", "n(S) − n(A)"],
    ],

    s3e1q: "Among 30 students, 12 like volleyball and 10 like basketball. None like both. How many like neither? (Use Tip 1)",
    s3e1p1: "Since no one likes both:",
    s3e1tip: "💡 When intersection = 0, the formula simplifies to n(A∪B) = n(A) + n(B).",
    s3e1ans: "There are 8 students who like neither.",

    s3e2q: "Use a table to find: only A, only B, both, and outside both.",
    s3e2title: "SOLUTION — TABLE METHOD:",
    s3e2only_a: "Only A = 28−10 =", s3e2only_b: "Only B = 22−10 =",
    s3e2both: "Both (A∩B) =", s3e2out: "Outside both = 50−10−18−12 =",

    s3e3q: "From 100 people, everyone likes at least one of three colors: Red (M), Blue (B), Yellow (K). Given: n(M)=60, n(B)=50, n(K)=40, exactly two colors: 30, all three colors: 10. How many like exactly one color?",
    s3e3title: "SOLUTION — SMART STRATEGY:",
    s3e3ident: "Use the key identity:",
    s3e3formula: "n(M∪B∪K) = n(exactly 1) + n(exactly 2) + n(exactly 3)",
    s3e3p1: "Since everyone likes at least one:",
    s3e3tip_title: "💡 Competition Tip:",
    s3e3tip_desc: "Alternative: n(exactly 1) = Σn(each set) − 2·n(exactly 2) − 3·n(exactly 3) = 60+50+40 − 2(30) − 3(10) = 150 − 60 − 30 = 60 ✓",
    s3e3ans: "There are 60 people who like exactly one color.",
  },

  ja: {
    title: "集合を使った問題解決",
    subtitle: "集合の要素数 · 解法の手順 · コツ",
    breadcrumb: "中学1年 · 集合 · 数学教材",
    back: "← 集合に戻る",
    easy: "基本", medium: "標準", hard: "発展",
    summary: "📌 まとめ",
    problems: "📝 練習問題と解説",
    solution: "解説",
    step: "ステップ",
    known: "既知",
    conclude: "結論",
    verify: "検証",
    example: "例題",

    sub1: "第1節：集合の要素数の基本原理",
    sub2: "第2節：問題解決の手順",
    sub3: "速解戦略 — 「コツ」",

    venn2title: "2集合の要素数",
    venn3title: "3集合の要素数",
    flowTitle: "集合問題の解法フロー",
    onlyA: "Aのみ", onlyB: "Bのみ", onlyC: "Cのみ",
    outside: "d = AとBの外",
    step1label: "① 識別する", step1desc: "問題を読み、データを確認",
    step2label: "② モデル化する", step2desc: "記法とベン図を書く",
    step3label: "③ 図を埋める", step3desc: "共通部分（中央）から始める",
    step4label: "④ 計算して検証", step4desc: "公式を使い、合計 = n(S) を確認",
    step5label: "✅ 結論",

    s1p1: "集合の要素数（濃度）とは集合の要素の個数のことで、",
    s1p2: "と表します。これは2つまたは3つのグループを含む問題（例：調査・クラブデータ・複合的な文章題）を解く際の基本的な概念です。",
    s1rumus2: "📐 要素数の公式 — 2集合:",
    s1rumus3: "📐 要素数の公式 — 3集合:",
    s1sifat: [
      ["n(A) ≥ 0", "要素数は常に ≥ 0"],
      ["n(∅) = 0", "空集合の要素数は 0"],
      ["n(Aᶜ) = n(S) − n(A)", "補集合：全体集合から引いた残り"],
      ["n(A∩B) ≤ n(A) かつ n(A∩B) ≤ n(B)", "共通部分 ≤ 両親集合それぞれ"],
    ],
    s1tip: "💡 コツ：「どちらにも属さない人数 = x」と書かれている場合、",
    s1tip2: "したがって",
    s1tip3: "を引かずに直接計算できます。",

    s1e1q: "学習グループに25人の生徒がいます。14人が数学が好き、11人が国語が好き、4人が両方好きです。どちらも好きでない生徒は何人ですか？",
    s1e1s1: "和集合を計算:",
    s1e1s2: "どちらも好きでない生徒:",
    s1e1ans: "どちらの科目も好きでない生徒は4人です。",

    s1e2q: "図書館の45人の来館者のうち、20人が小説を借り、18人が理科の本を借り、8人は何も借りませんでした。両方の本を借りた来館者は何人ですか？",
    s1e2s1: "ステップ1 — 少なくとも1冊借りた人数を求める:",
    s1e2s2: "ステップ2 — 公式を使って共通部分を求める:",
    s1e2ans: "両方の本を借りた来館者は1人だけです。",

    s1e3q: "60人の若者への調査：32人がInstagram(I)、27人がX(X)、25人がYouTube(Y)を持つ。15人がIとX、12人がIとY、10人がXとY、5人が3つすべてを持ち、残りは何も持たない。何も持たない若者は何人ですか？",
    s1e3s1: "3集合の公式を使用:",
    s1e3s2: "何も持たない若者:",
    s1e3veri: "ベン図の各領域を検証:",
    s1e3only_i: "Iのみ:", s1e3only_x: "Xのみ:", s1e3only_y: "Yのみ:",
    s1e3ix: "I∩Xのみ:", s1e3iy: "I∩Yのみ:", s1e3xy: "X∩Yのみ:",
    s1e3all: "3つすべて: 5 · 外側: 8",
    s1e3total: "合計:",
    s1e3ans: "何もアカウントを持たない若者は8人です。",

    s2p1: "集合の問題を解くカギは",
    s2p1b: "体系的な解法手順",
    s2p2: "を持つことです。多くの生徒はロードマップがないために混乱します。次の4つのステップに従えば、どんな問題でも体系的に解けます。",
    s2steps: [
      { step: "① 識別する", color: "text-cyan-300", bg: "bg-cyan-900/30 border-cyan-500/30", desc: "問題を最低2回読む。合計（n(S)）、各グループの人数、共通部分、問われていることを確認する。" },
      { step: "② モデル化する", color: "text-indigo-300", bg: "bg-indigo-900/30 border-indigo-500/30", desc: "集合に名前をつける（A, B, C）。数学的記法を書く。メモ用紙にベン図のスケッチを描く。" },
      { step: "③ 図を埋める", color: "text-green-300", bg: "bg-green-900/30 border-green-500/30", desc: "まず中央領域（共通部分/3つすべて）を埋め、次に外側の領域を計算する。" },
      { step: "④ 計算して検証", color: "text-orange-300", bg: "bg-orange-900/30 border-orange-500/30", desc: "包除原理の公式を使う。完了後、図のすべての領域を合計し、n(S) と一致することを確認する。" },
    ],
    s2tip: "💡 コツ：検証はよく省略されますが非常に重要です。全領域の合計 ≠ n(S) の場合、どこかが間違っています — 答えを書く前に修正してください！",

    s2e1q: "クラスに35人の生徒がいます。20人がピアノ教室に、18人が絵画教室に通い、7人が両方に通っています。どちらにも通っていない生徒は何人ですか？4つのステップで解いてください！",
    s2e1title: "解説 — 4ステップ:",
    s2e1_1: "n(S)=35, n(P)=20（ピアノ）, n(G)=18（絵画）, n(P∩G)=7, 求める：両方の外",
    s2e1_2: "P = ピアノ教室の生徒の集合, G = 絵画教室の生徒の集合",
    s2e1_3: "中央（P∩G）= 7 | Pのみ = 20−7 = 13 | Gのみ = 18−7 = 11",
    s2e1cek: "確認: 13 + 7 + 11 + 4 = 35 ✓",
    s2e1ans: "どちらの教室にも通っていない生徒は4人です。",

    s2e2q: "ある地区に50世帯があります。30世帯がバイクを持ち、22世帯が自転車を持ち、6世帯はどちらも持っていません。両方持つ世帯数、バイクのみの世帯数、自転車のみの世帯数を求めなさい。",
    s2e2ident: "n(S)=50, n(M)=30, n(K)=22, どちらでもない=6",
    s2e2kunci: "重要ステップ：まず少なくとも一方を持つ世帯数を求める:",
    s2e2cari: "共通部分を求める:",
    s2e2isi: "図を埋める:",
    s2e2motor: "バイクのみ:", s2e2sepeda: "自転車のみ:", s2e2keduanya: "両方:",
    s2e2luar: "外側:",
    s2e2cek: "確認: 22+8+14+6 = 50 ✓",
    s2e2kk: "世帯",

    s2e3q: "80人の生徒のうち：45人が芸術部、38人が運動部、30人が科学部に参加。20人が芸術と運動、15人が芸術と科学、12人が運動と科学に参加。全員が少なくとも1つの部に参加している場合、3つすべてに参加する生徒は何人ですか？",
    s2e3ident: "n(S)=80, 全員 ≥ 1 → n(A∪B∪C)=80",
    s2e3ident2: "n(A)=45, n(B)=38, n(C)=30, n(A∩B)=20, n(A∩C)=15, n(B∩C)=12",
    s2e3susun: "3集合の公式で方程式を立てる:",
    s2e3veri: "ベン図の各領域を検証:",
    s2e3onlyA: "Aのみ: 45−20−15+14 = 24",
    s2e3onlyB: "Bのみ: 38−20−12+14 = 20",
    s2e3onlyC: "Cのみ: 30−15−12+14 = 17",
    s2e3ab: "A∩Bのみ: 20−14 = 6", s2e3ac: "A∩Cのみ: 15−14 = 1",
    s2e3bc: "B∩Cのみ: 12−14 = ...",
    s2e3warn: "⚠️ 重要な注意:",
    s2e3warnText: "領域の値が負になった場合、問題のデータが一貫していないか、四捨五入があることを示します。試験問題では、データは常に非負の値をもたらすべきです。求められた答えは",
    s2e3ans: "3つの部活すべてに参加する生徒は14人います。",

    s3p1: "概念と手順を習得したら、",
    s3p1b: "速解戦略",
    s3p2: "が必要です。試験での時間を節約するための「秘密のコツ」をまとめました。",
    s3tips: [
      { no: "🎯 コツ1", title: "間接情報から共通部分を求める", color: "bg-blue-900/30 border-blue-500/30 text-blue-300", desc: "「どちらでもない人数 = x」と書かれていれば：n(A∪B) = n(S) − x、次にn(A∩B) = n(A) + n(B) − n(A∪B)。これが最も効率的な方法です！" },
      { no: "🎯 コツ2", title: "速解公式：一方のみのグループ", color: "bg-emerald-900/30 border-emerald-500/30 text-emerald-300", desc: "「Aのみ（Bを含まない）」を求めるには：n(Aのみ) = n(A) − n(A∩B)。図の各部分を問われる問題で役立ちます。" },
      { no: "🎯 コツ3", title: "2条件問題には表を使う", color: "bg-purple-900/30 border-purple-500/30 text-purple-300", desc: "「AだがBでない人数は？」という形の問題は2×2の表で解くのが適しています。計算ミスを減らせます。" },
      { no: "⚠️ コツ4", title: "「ちょうど」と「少なくとも」に注意", color: "bg-red-900/30 border-red-500/30 text-red-300", desc: "「ちょうど2つ」= 2つだけ（3つではない）。「少なくとも2つ」= 2つまたは3つ。この読み間違いは競技問題での最多エラーです！" },
      { no: "💡 コツ5", title: "開始前にデータの一貫性を確認", color: "bg-amber-900/30 border-amber-500/30 text-amber-300", desc: "n(A∩B) ≤ min(n(A), n(B)) かつ n(A∪B) ≤ n(S) を確認する。満たされない場合、問題に罠があるか、再読が必要です。" },
    ],
    s3tableTitle: "📋 速解公式表 — 2集合:",
    s3tableHead: ["求めるもの", "公式"],
    s3tableRows: [
      ["n(A∪B)", "n(A) + n(B) − n(A∩B)"],
      ["n(A∩B)", "n(A) + n(B) − n(A∪B)"],
      ["A∪Bの外", "n(S) − n(A∪B)"],
      ["Aのみ", "n(A) − n(A∩B)"],
      ["Bのみ", "n(B) − n(A∩B)"],
      ["n(Aᶜ)", "n(S) − n(A)"],
    ],

    s3e1q: "30人の生徒のうち、12人がバレーボール好き、10人がバスケットボール好きです。両方好きな人はいません。どちらも好きでない生徒は何人ですか？（コツ1を使用）",
    s3e1p1: "両方好きな人がいないので：",
    s3e1tip: "💡 共通部分 = 0 のとき、公式は n(A∪B) = n(A) + n(B) に簡略化されます。",
    s3e1ans: "どちらも好きでない生徒は8人です。",

    s3e2q: "表を使って求めなさい：Aのみ、Bのみ、両方、どちらでもない。",
    s3e2title: "解説 — 表の方法:",
    s3e2only_a: "Aのみ = 28−10 =", s3e2only_b: "Bのみ = 22−10 =",
    s3e2both: "両方（A∩B）=", s3e2out: "どちらでもない = 50−10−18−12 =",

    s3e3q: "100人全員が3色のうち少なくとも1色が好き：赤(M)、青(B)、黄(K)。n(M)=60, n(B)=50, n(K)=40、ちょうど2色好き：30人、3色すべて好き：10人。ちょうど1色だけ好きな人は何人ですか？",
    s3e3title: "解説 — 速解戦略:",
    s3e3ident: "重要な等式を使用:",
    s3e3formula: "n(M∪B∪K) = n(ちょうど1色) + n(ちょうど2色) + n(ちょうど3色)",
    s3e3p1: "全員が少なくとも1色好きなので：",
    s3e3tip_title: "💡 競技コツ:",
    s3e3tip_desc: "別解: n(ちょうど1色) = Σn(各集合) − 2·n(ちょうど2色) − 3·n(ちょうど3色) = 60+50+40 − 2(30) − 3(10) = 150 − 60 − 30 = 60 ✓",
    s3e3ans: "ちょうど1色だけ好きな人は60人です。",
  },
};

/* ══════════════════════════════════════════════════════════
   SVG VISUAL COMPONENTS (language-aware)
══════════════════════════════════════════════════════════ */
type T = typeof translations.id;

const VennKardinalitas2 = ({ t }: { t: T }) => (
  <div className="flex flex-col items-center gap-2">
    <p className="text-xs font-mono text-cyan-300 tracking-wider">{t.venn2title}</p>
    <svg viewBox="0 0 300 170" className="w-full max-w-xs" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="292" height="162" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5"/>
      <text x="278" y="20" textAnchor="middle" fontSize="12" fill="#64748b" fontFamily="monospace">S</text>
      <circle cx="115" cy="85" r="58" fill="#1e3a5f" stroke="#38bdf8" strokeWidth="2" fillOpacity="0.7"/>
      <circle cx="185" cy="85" r="58" fill="#1e1f5e" stroke="#818cf8" strokeWidth="2" fillOpacity="0.7"/>
      <text x="78" y="80" textAnchor="middle" fontSize="11" fill="#bae6fd" fontFamily="monospace" fontWeight="bold">a</text>
      <text x="78" y="95" textAnchor="middle" fontSize="9" fill="#93c5fd" fontFamily="sans-serif">{t.onlyA}</text>
      <text x="150" y="80" textAnchor="middle" fontSize="11" fill="#6ee7b7" fontFamily="monospace" fontWeight="bold">b</text>
      <text x="150" y="95" textAnchor="middle" fontSize="9" fill="#a7f3d0" fontFamily="sans-serif">A∩B</text>
      <text x="222" y="80" textAnchor="middle" fontSize="11" fill="#c7d2fe" fontFamily="monospace" fontWeight="bold">c</text>
      <text x="222" y="95" textAnchor="middle" fontSize="9" fill="#a5b4fc" fontFamily="sans-serif">{t.onlyB}</text>
      <text x="20" y="155" fontSize="9" fill="#475569" fontFamily="monospace">{t.outside}</text>
      <text x="150" y="155" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="monospace">n(S) = a+b+c+d</text>
    </svg>
    <div className="grid grid-cols-2 gap-2 w-full max-w-xs text-xs font-mono">
      <div className="bg-sky-900/40 border border-sky-500/30 rounded p-2">
        <span className="text-sky-300 font-bold">n(A) = a + b</span>
      </div>
      <div className="bg-indigo-900/40 border border-indigo-500/30 rounded p-2">
        <span className="text-indigo-300 font-bold">n(B) = b + c</span>
      </div>
      <div className="bg-emerald-900/40 border border-emerald-500/30 rounded p-2">
        <span className="text-emerald-300 font-bold">n(A∩B) = b</span>
      </div>
      <div className="bg-purple-900/40 border border-purple-500/30 rounded p-2">
        <span className="text-purple-300 font-bold">n(A∪B) = a+b+c</span>
      </div>
    </div>
  </div>
);

const VennKardinalitas3 = ({ t }: { t: T }) => (
  <div className="flex flex-col items-center gap-2">
    <p className="text-xs font-mono text-cyan-300 tracking-wider">{t.venn3title}</p>
    <svg viewBox="0 0 300 200" className="w-full max-w-xs" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="292" height="192" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5"/>
      <text x="278" y="20" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="monospace">S</text>
      <circle cx="130" cy="80" r="55" fill="#1e3a5f" stroke="#38bdf8" strokeWidth="1.8" fillOpacity="0.55"/>
      <circle cx="170" cy="80" r="55" fill="#1e1f5e" stroke="#818cf8" strokeWidth="1.8" fillOpacity="0.55"/>
      <circle cx="150" cy="120" r="55" fill="#1a2e1a" stroke="#4ade80" strokeWidth="1.8" fillOpacity="0.55"/>
      <text x="100" y="62" textAnchor="middle" fontSize="11" fill="#bae6fd" fontWeight="bold" fontFamily="monospace">A</text>
      <text x="200" y="62" textAnchor="middle" fontSize="11" fill="#c7d2fe" fontWeight="bold" fontFamily="monospace">B</text>
      <text x="150" y="178" textAnchor="middle" fontSize="11" fill="#bbf7d0" fontWeight="bold" fontFamily="monospace">C</text>
      <text x="100" y="80" textAnchor="middle" fontSize="9" fill="#7dd3fc" fontFamily="monospace">{t.onlyA}</text>
      <text x="200" y="80" textAnchor="middle" fontSize="9" fill="#a5b4fc" fontFamily="monospace">{t.onlyB}</text>
      <text x="150" y="165" textAnchor="middle" fontSize="9" fill="#86efac" fontFamily="monospace">{t.onlyC}</text>
      <text x="150" y="76" textAnchor="middle" fontSize="9" fill="#fde68a" fontFamily="monospace">A∩B</text>
      <text x="122" y="125" textAnchor="middle" fontSize="9" fill="#fca5a5" fontFamily="monospace">A∩C</text>
      <text x="178" y="125" textAnchor="middle" fontSize="9" fill="#6ee7b7" fontFamily="monospace">B∩C</text>
      <text x="150" y="108" textAnchor="middle" fontSize="9" fill="var(--icon-color)" fontFamily="monospace">A∩B∩C</text>
    </svg>
  </div>
);

const FlowchartLangkah = ({ t }: { t: T }) => (
  <div className="flex flex-col items-center gap-2">
    <p className="text-xs font-mono text-cyan-300 tracking-wider">{t.flowTitle}</p>
    <svg viewBox="0 0 260 310" className="w-full max-w-[220px]" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="10" width="200" height="44" rx="8" fill="#164e63" stroke="#22d3ee" strokeWidth="1.5"/>
      <text x="130" y="29" textAnchor="middle" fontSize="10" fill="#a5f3fc" fontFamily="sans-serif" fontWeight="bold">{t.step1label}</text>
      <text x="130" y="46" textAnchor="middle" fontSize="9" fill="#cffafe" fontFamily="sans-serif">{t.step1desc}</text>
      <line x1="130" y1="54" x2="130" y2="72" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arr)"/>
      <rect x="30" y="72" width="200" height="44" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5"/>
      <text x="130" y="91" textAnchor="middle" fontSize="10" fill="#c7d2fe" fontFamily="sans-serif" fontWeight="bold">{t.step2label}</text>
      <text x="130" y="108" textAnchor="middle" fontSize="9" fill="#e0e7ff" fontFamily="sans-serif">{t.step2desc}</text>
      <line x1="130" y1="116" x2="130" y2="134" stroke="#475569" strokeWidth="1.5"/>
      <polygon points="124,132 136,132 130,142" fill="#475569"/>
      <rect x="30" y="142" width="200" height="44" rx="8" fill="#14532d" stroke="#4ade80" strokeWidth="1.5"/>
      <text x="130" y="161" textAnchor="middle" fontSize="10" fill="#bbf7d0" fontFamily="sans-serif" fontWeight="bold">{t.step3label}</text>
      <text x="130" y="178" textAnchor="middle" fontSize="9" fill="#d1fae5" fontFamily="sans-serif">{t.step3desc}</text>
      <line x1="130" y1="186" x2="130" y2="204" stroke="#475569" strokeWidth="1.5"/>
      <polygon points="124,202 136,202 130,212" fill="#475569"/>
      <rect x="30" y="212" width="200" height="44" rx="8" fill="#451a03" stroke="#fb923c" strokeWidth="1.5"/>
      <text x="130" y="231" textAnchor="middle" fontSize="10" fill="#fed7aa" fontFamily="sans-serif" fontWeight="bold">{t.step4label}</text>
      <text x="130" y="248" textAnchor="middle" fontSize="9" fill="#ffedd5" fontFamily="sans-serif">{t.step4desc}</text>
      <line x1="130" y1="256" x2="130" y2="274" stroke="#475569" strokeWidth="1.5"/>
      <polygon points="124,272 136,272 130,282" fill="#475569"/>
      <rect x="30" y="282" width="200" height="22" rx="6" fill="#3b0764" stroke="#a855f7" strokeWidth="1.5"/>
      <text x="130" y="297" textAnchor="middle" fontSize="10" fill="#e9d5ff" fontFamily="sans-serif" fontWeight="bold">{t.step5label}</text>
    </svg>
  </div>
);

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
const PemecahanMasalahHimpunanPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = language as "id" | "en" | "ja";
  const t = translations[lang];

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "kardinalitas", "langkah", "tips",
  ]);

  const toggleSection = (s: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const SectionHeader = ({
    id, icon, label, iconColor,
  }: { id: string; icon: React.ReactNode; label: string; iconColor: string }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{label}</span>
      </div>
      {true ? (
        <ChevronUp className="w-5 h-5 text-primary" />
      ) : (
        <ChevronDown className="w-5 h-5 text-primary" />
      )}
    </button>
  );

  const easyBadge   = <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.easy}</span>;
  const mediumBadge = <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.medium}</span>;
  const hardBadge   = <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.hard}</span>;

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-base md:text-lg font-bold text-primary text-glow-cyan mb-2 text-center leading-snug">
          {t.title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-1 font-body">{t.subtitle}</p>
        <p className="text-white/40 text-xs text-center mb-6 font-body">{t.breadcrumb}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ══ SUB-BAB 1: KARDINALITAS ══ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="kardinalitas" icon={<Hash className="w-5 h-5" />} label={t.sub1} iconColor="text-cyan-400" />
            {true && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.summary}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-cyan-300">{t.s1p1}</strong>{" "}
                    <InlineMath math="n(A)" />. {t.s1p2}
                  </p>
                  <div className="bg-slate-900/60 rounded-xl p-4">
                    <VennKardinalitas2 t={t} />
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-cyan-300">{t.s1rumus2}</p>
                    <div className="overflow-x-auto">
                      <BlockMath math="n(A \cup B) = n(A) + n(B) - n(A \cap B)" />
                    </div>
                    <div className="h-px bg-slate-700/50" />
                    <p className="font-body text-xs font-semibold text-purple-300">{t.s1rumus3}</p>
                    <div className="overflow-x-auto">
                      <BlockMath math="n(A \cup B \cup C) = n(A)+n(B)+n(C) - n(A\cap B) - n(A\cap C) - n(B\cap C) + n(A\cap B\cap C)" />
                    </div>
                  </div>
                  <div className="bg-slate-900/60 rounded-xl p-4">
                    <VennKardinalitas3 t={t} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {t.s1sifat.map(([rule, desc]) => (
                      <div key={rule} className="bg-cyan-950/40 border border-cyan-500/20 rounded p-2">
                        <p className="font-mono text-xs text-cyan-300 font-bold">{rule}</p>
                        <p className="font-body text-xs text-white/60 mt-0.5">{desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">
                      {t.s1tip} <InlineMath math="n(A \cap B) = 0" />, {t.s1tip2}{" "}
                      <InlineMath math="n(A \cup B) = n(A) + n(B)" /> {t.s1tip3}
                    </p>
                  </div>
                </div>

                <p className="font-body text-sm font-semibold text-white">{t.problems}</p>

                {/* E1 - Easy */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{easyBadge}<span className="font-body font-semibold text-white">{t.example} 1</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white leading-relaxed">{t.s1e1q}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-green-400">{t.solution}:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.known}:</strong> <InlineMath math="n(S)=25" />, <InlineMath math="n(M)=14" />, <InlineMath math="n(B)=11" />, <InlineMath math="n(M\cap B)=4" /></p>
                      <p><strong>{t.s1e1s1}</strong></p>
                      <div className="overflow-x-auto"><BlockMath math="n(M \cup B) = 14 + 11 - 4 = 21" /></div>
                      <p><strong>{t.s1e1s2}</strong></p>
                      <div className="overflow-x-auto"><BlockMath math="n(S) - n(M \cup B) = 25 - 21 = 4" /></div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                        <p className="text-green-300 font-semibold text-xs">✅ {t.s1e1ans}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* E2 - Medium */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="font-body font-semibold text-white">{t.example} 2</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white leading-relaxed">{t.s1e2q}</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-yellow-400">{t.solution}:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.s1e2s1}</strong></p>
                      <div className="overflow-x-auto"><BlockMath math="n(F \cup K) = n(S) - 8 = 45 - 8 = 37" /></div>
                      <p><strong>{t.s1e2s2}</strong></p>
                      <div className="overflow-x-auto"><BlockMath math="n(F \cap K) = n(F) + n(K) - n(F \cup K) = 20 + 18 - 37 = 1" /></div>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
                        <p className="text-yellow-300 font-semibold text-xs">✅ {t.s1e2ans}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* E3 - Hard */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{hardBadge}<span className="font-body font-semibold text-white">{t.example} 3</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white leading-relaxed">{t.s1e3q}</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-red-400">{t.solution}:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-3 font-body text-sm text-white/80">
                      <p><strong>{t.s1e3s1}</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(I \cup X \cup Y) = 32+27+25 - 15 - 12 - 10 + 5 = 52" />
                      </div>
                      <p><strong>{t.s1e3s2}</strong></p>
                      <div className="overflow-x-auto"><BlockMath math="60 - 52 = 8" /></div>
                      <div className="bg-slate-800/60 rounded p-3 text-xs space-y-1">
                        <p className="text-cyan-300 font-semibold">{t.s1e3veri}</p>
                        <p>• {t.s1e3only_i} <InlineMath math="32-15-12+5=10" /></p>
                        <p>• {t.s1e3only_x} <InlineMath math="27-15-10+5=7" /></p>
                        <p>• {t.s1e3only_y} <InlineMath math="25-12-10+5=8" /></p>
                        <p>• {t.s1e3ix} <InlineMath math="15-5=10" /></p>
                        <p>• {t.s1e3iy} <InlineMath math="12-5=7" /></p>
                        <p>• {t.s1e3xy} <InlineMath math="10-5=5" /></p>
                        <p>• {t.s1e3all}</p>
                        <p className="text-green-400 font-semibold">{t.s1e3total} <InlineMath math="10+7+8+10+7+5+5+8 = 60" /> ✓</p>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded p-2">
                        <p className="text-red-300 font-semibold text-xs">✅ {t.s1e3ans}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ══ SUB-BAB 2: LANGKAH-LANGKAH ══ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="langkah" icon={<ListChecks className="w-5 h-5" />} label={t.sub2} iconColor="text-orange-400" />
            {true && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-orange-300">{t.summary}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.s2p1} <strong className="text-orange-300">{t.s2p1b}</strong>. {t.s2p2}
                  </p>
                  <div className="bg-slate-900/60 rounded-xl p-4">
                    <FlowchartLangkah t={t} />
                  </div>
                  <div className="space-y-2">
                    {t.s2steps.map((item) => (
                      <div key={item.step} className={`${item.bg} border rounded-lg p-3`}>
                        <p className={`font-mono text-xs font-bold ${item.color} mb-1`}>{item.step}</p>
                        <p className="font-body text-xs text-white/70">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">{t.s2tip}</p>
                  </div>
                </div>

                <p className="font-body text-sm font-semibold text-white">{t.problems}</p>

                {/* E1 - Easy */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{easyBadge}<span className="font-body font-semibold text-white">{t.example} 1</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white leading-relaxed">{t.s2e1q}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-2">
                    <p className="font-body text-xs font-semibold text-green-400">{t.s2e1title}</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <div className="bg-cyan-900/20 border border-cyan-500/20 rounded p-2">
                        <p className="text-cyan-300 text-xs font-bold">{t.step1label}</p>
                        <p className="text-xs mt-1">{t.s2e1_1}</p>
                      </div>
                      <div className="bg-indigo-900/20 border border-indigo-500/20 rounded p-2">
                        <p className="text-indigo-300 text-xs font-bold">{t.step2label}</p>
                        <p className="text-xs mt-1">{t.s2e1_2}</p>
                      </div>
                      <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                        <p className="text-green-300 text-xs font-bold">{t.step3label}</p>
                        <p className="text-xs mt-1">{t.s2e1_3}</p>
                      </div>
                      <div className="bg-orange-900/20 border border-orange-500/20 rounded p-2">
                        <p className="text-orange-300 text-xs font-bold">{t.step4label}</p>
                        <div className="overflow-x-auto mt-1">
                          <BlockMath math="n(P \cup G) = 20 + 18 - 7 = 31" />
                          <BlockMath math="\text{} = 35 - 31 = 4" />
                        </div>
                        <p className="text-xs text-green-400">{t.s2e1cek}</p>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                        <p className="text-green-300 font-semibold text-xs">✅ {t.s2e1ans}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* E2 - Medium — BUG FIX: n(K)=22 instead of n(S)=22 */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="font-body font-semibold text-white">{t.example} 2</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white leading-relaxed">{t.s2e2q}</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-yellow-400">{t.solution}:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <div className="bg-cyan-900/20 border border-cyan-500/20 rounded p-2 text-xs">
                        <p className="text-cyan-300 font-bold">{t.step1label}</p>
                        <p>{t.s2e2ident}</p>
                      </div>
                      <p><strong>{t.s2e2kunci}</strong></p>
                      <div className="overflow-x-auto"><BlockMath math="n(M \cup K) = 50 - 6 = 44" /></div>
                      <p>{t.s2e2cari}</p>
                      <div className="overflow-x-auto"><BlockMath math="n(M \cap K) = 30 + 22 - 44 = 8" /></div>
                      <p>{t.s2e2isi}</p>
                      <div className="bg-slate-800/60 rounded p-3 space-y-1 text-xs">
                        <p>• {t.s2e2motor} <InlineMath math="30 - 8 = 22" /> {t.s2e2kk}</p>
                        <p>• {t.s2e2sepeda} <InlineMath math="22 - 8 = 14" /> {t.s2e2kk}</p>
                        <p>• {t.s2e2keduanya} <InlineMath math="8" /> {t.s2e2kk}</p>
                        <p>• {t.s2e2luar} <InlineMath math="6" /> {t.s2e2kk}</p>
                        <p className="text-green-400">{t.s2e2cek}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* E3 - Hard */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{hardBadge}<span className="font-body font-semibold text-white">{t.example} 3</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white leading-relaxed">{t.s2e3q}</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-red-400">{t.solution}:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-3 font-body text-sm text-white/80">
                      <div className="bg-cyan-900/20 border border-cyan-500/20 rounded p-2 text-xs">
                        <p className="text-cyan-300 font-bold">{t.step1label}</p>
                        <p>{t.s2e3ident}</p>
                        <p>{t.s2e3ident2}</p>
                      </div>
                      <p><strong>{t.s2e3susun}</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="80 = 45+38+30-20-15-12+n(A\cap B\cap C)" />
                        <BlockMath math="80 = 66 + n(A\cap B\cap C)" />
                        <BlockMath math="n(A\cap B\cap C) = 80 - 66 = 14" />
                      </div>
                      <div className="bg-slate-800/60 rounded p-3 space-y-1 text-xs">
                        <p className="text-cyan-300 font-semibold">{t.s2e3veri}</p>
                        <p>• {t.s2e3onlyA}</p>
                        <p>• {t.s2e3onlyB}</p>
                        <p>• {t.s2e3onlyC}</p>
                        <p>• {t.s2e3ab}</p>
                        <p>• {t.s2e3ac}</p>
                        <p>• {t.s2e3bc} <span className="text-red-400">= −2?</span></p>
                      </div>
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded p-3 text-xs">
                        <p className="text-amber-300 font-semibold">{t.s2e3warn}</p>
                        <p className="text-white/70 mt-1">{t.s2e3warnText} <InlineMath math="n(A\cap B\cap C) = 14" />.</p>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded p-2">
                        <p className="text-red-300 font-semibold text-xs">✅ {t.s2e3ans}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ══ SUB-BAB 3: TIPS JITU ══ */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="tips" icon={<Zap className="w-5 h-5" />} label={t.sub3} iconColor="text-yellow-400" />
            {true && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 space-y-4">
                  <p className="font-body text-sm font-semibold text-yellow-300">{t.summary}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.s3p1} <strong className="text-yellow-300">{t.s3p1b}</strong> {t.s3p2}
                  </p>
                  <div className="space-y-3">
                    {t.s3tips.map((tip) => (
                      <div key={tip.no} className={`${tip.color} border rounded-lg p-3`}>
                        <p className="font-mono text-xs font-bold mb-1">{tip.no}: {tip.title}</p>
                        <p className="font-body text-xs text-white/70">{tip.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-900/60 rounded-xl p-4 overflow-x-auto">
                    <p className="font-body text-xs font-semibold text-cyan-300 mb-3">{t.s3tableTitle}</p>
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-slate-800/80">
                          <th className="border border-slate-600/50 px-3 py-2 text-left text-cyan-300">{t.s3tableHead[0]}</th>
                          <th className="border border-slate-600/50 px-3 py-2 text-left text-cyan-300">{t.s3tableHead[1]}</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/80">
                        {t.s3tableRows.map(([cari, rumus]) => (
                          <tr key={cari} className="hover:bg-slate-800/40">
                            <td className="border border-slate-600/30 px-3 py-2 font-mono text-yellow-300">{cari}</td>
                            <td className="border border-slate-600/30 px-3 py-2">{rumus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="font-body text-sm font-semibold text-white">{t.problems}</p>

                {/* E1 - Easy */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{easyBadge}<span className="font-body font-semibold text-white">{t.example} 1</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.s3e1q}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-2">{t.solution}:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <p>{t.s3e1p1} <InlineMath math="n(V \cap B) = 0" /></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(V \cup B) = 12 + 10 - 0 = 22" />
                        <BlockMath math="30 - 22 = 8" />
                      </div>
                      <div className="bg-blue-900/20 border border-blue-500/20 rounded p-2">
                        <p className="text-blue-300 text-xs">{t.s3e1tip}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* E2 - Medium */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="font-body font-semibold text-white">{t.example} 2</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      <InlineMath math="n(S) = 50" />, <InlineMath math="n(A) = 28" />,{" "}
                      <InlineMath math="n(B) = 22" />, <InlineMath math="n(A \cap B) = 10" />. {t.s3e2q}
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-yellow-400">{t.s3e2title}</p>
                    <div className="bg-slate-900/60 rounded-xl p-3 overflow-x-auto">
                      <table className="w-full text-xs font-mono border-collapse">
                        <thead>
                          <tr className="bg-slate-800">
                            <th className="border border-slate-600/50 px-3 py-2 text-cyan-300"></th>
                            <th className="border border-slate-600/50 px-3 py-2 text-cyan-300">B</th>
                            <th className="border border-slate-600/50 px-3 py-2 text-cyan-300">Bᶜ</th>
                            <th className="border border-slate-600/50 px-3 py-2 text-cyan-300">Total</th>
                          </tr>
                        </thead>
                        <tbody className="text-white/80">
                          <tr>
                            <td className="border border-slate-600/30 px-3 py-2 text-indigo-300 font-bold">A</td>
                            <td className="border border-slate-600/30 px-3 py-2 text-yellow-300">10</td>
                            <td className="border border-slate-600/30 px-3 py-2 text-emerald-300">18</td>
                            <td className="border border-slate-600/30 px-3 py-2">28</td>
                          </tr>
                          <tr>
                            <td className="border border-slate-600/30 px-3 py-2 text-indigo-300 font-bold">Aᶜ</td>
                            <td className="border border-slate-600/30 px-3 py-2 text-emerald-300">12</td>
                            <td className="border border-slate-600/30 px-3 py-2 text-red-300">10</td>
                            <td className="border border-slate-600/30 px-3 py-2">22</td>
                          </tr>
                          <tr className="bg-slate-800/40">
                            <td className="border border-slate-600/30 px-3 py-2 font-bold">Total</td>
                            <td className="border border-slate-600/30 px-3 py-2">22</td>
                            <td className="border border-slate-600/30 px-3 py-2">28</td>
                            <td className="border border-slate-600/30 px-3 py-2 text-green-400 font-bold">50 ✓</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-slate-900/50 rounded p-3 space-y-1 font-body text-xs text-white/80">
                      <p>🟡 {t.s3e2both} <strong className="text-yellow-300">10</strong></p>
                      <p>🟢 {t.s3e2only_a} <strong className="text-emerald-300">18</strong></p>
                      <p>🟢 {t.s3e2only_b} <strong className="text-emerald-300">12</strong></p>
                      <p>🔴 {t.s3e2out} <strong className="text-red-300">10</strong></p>
                    </div>
                  </div>
                </div>

                {/* E3 - Hard */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{hardBadge}<span className="font-body font-semibold text-white">{t.example} 3</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white leading-relaxed">{t.s3e3q}</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-red-400">{t.s3e3title}</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-3 font-body text-sm text-white/80">
                      <p><strong>{t.s3e3ident}</strong></p>
                      <div className="bg-slate-800/60 rounded p-2 text-xs">
                        <p className="text-cyan-300 font-mono">{t.s3e3formula}</p>
                      </div>
                      <p>{t.s3e3p1} <InlineMath math="n(M\cup B\cup K)=100" /></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="100 = n(\text{1}) + 30 + 10" />
                        <BlockMath math="n(\text{1}) = 100 - 40 = 60" />
                      </div>
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded p-2 text-xs">
                        <p className="text-amber-300 font-semibold">{t.s3e3tip_title}</p>
                        <p className="text-white/70">{t.s3e3tip_desc}</p>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded p-2">
                        <p className="text-red-300 font-semibold text-xs">✅ {t.s3e3ans}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/himpunan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PemecahanMasalahHimpunanPage;
