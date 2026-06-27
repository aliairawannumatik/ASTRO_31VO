import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import {
  BookOpen, ChevronDown, ChevronUp, CircleDot, Layers,
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ══════════════════════════════════════════════════════════
   TRANSLATIONS
══════════════════════════════════════════════════════════ */
const translations = {
  id: {
    title: "DIAGRAM VENN",
    subtitle: "Visualisasi Himpunan · Operasi · Interpretasi",
    breadcrumb: "Kelas 7 · Himpunan · Materi Matematika",
    back: "Kembali ke Himpunan",
    easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
    summary: "📌 Ringkasan Intisari",
    problems: "📝 Contoh Soal & Pembahasan",
    solution: "PEMBAHASAN",
    step: "Langkah",
    known: "Diketahui",
    example: "Contoh",

    sub1: "Sub-Bab 1: Pengenalan Diagram Venn",
    sub2: "Sub-Bab 2: Operasi Gabungan (Union)",
    sub3: "Sub-Bab 3: Operasi Irisan (Intersection)",
    sub4: "Sub-Bab 4: Operasi Selisih (Set Difference)",
    sub5: "Sub-Bab 5: Operasi Komplemen (Complement)",

    s1def: "adalah representasi visual menggunakan lingkaran-lingkaran yang saling tumpang tindih (atau terpisah) untuk menggambarkan hubungan antara dua atau lebih himpunan.",
    s1rules: "Aturan Menggambar Diagram Venn:",
    s1rulesList: [
      "Himpunan semesta (S) dilambangkan dengan persegi panjang",
      "Setiap himpunan digambarkan sebagai lingkaran di dalam persegi panjang",
      "Anggota himpunan ditulis di dalam lingkaran yang bersesuaian",
      "Anggota yang ada di dua himpunan ditulis di daerah tumpang tindih",
      "Anggota yang tidak masuk himpunan manapun ditulis di luar semua lingkaran",
    ],
    s1tip: "💡 Tips: Diagram Venn pertama kali diperkenalkan oleh John Venn (1834–1923), seorang matematikawan dan filsuf Inggris. Diagram ini sangat berguna untuk memvisualkan hubungan himpunan yang kompleks!",
    s1contextTitle: "Contoh Kontekstual: Ekskul Siswa",
    s1contextDesc: "30 siswa kelas 7C. Futsal = 8 siswa, Basket = 7 siswa, Keduanya = 5 siswa",
    s1outsideLabel: "Di luar",
    s1studentsLabel: "siswa",
    s1bothLabel: "Keduanya",

    // Sub2 - Union
    s2def: "Gabungan dua himpunan A dan B, ditulis",
    s2def2: "adalah himpunan yang berisi semua anggota yang ada di A,",
    s2def3: "atau",
    s2def4: "di B, atau di keduanya.",
    s2formula: "📐 Rumus:",
    s2tip: "💡 Tips: Kata kunci \"gabungan\" = \"atau\". Bayangkan kamu menggabungkan semua isi dua wadah menjadi satu — tanpa duplikasi!",
    s2unionTitle: "A ∪ B (semua diarsir)",
    s2pTitle: "Himpunan Semesta S dan soal:",
    s2primeLabel: "bilangan prima ≤ 10",
    s2oddLabel: "bilangan ganjil ≤ 10",

    s2e1q: "Diketahui",
    s2e1q2: "Tentukan",
    s2e1aTitle: "a. A ∪ B:",
    s2e1bTitle: "b. A ∩ B:",
    s2e1note: "Catatan: Setiap anggota hanya ditulis sekali dalam himpunan, walaupun ada di kedua himpunan.",
    s2e1s1: "Langkah 1 — Identifikasi anggota setiap himpunan:",
    s2e1s2: "Langkah 2 — Gabungan (semua anggota, tanpa duplikasi):",
    s2e1s3: "Langkah 3 — Irisan (anggota yang ada di keduanya):",

    s2e2q: "Diketahui himpunan semesta",
    s2e2q2: "bilangan asli ≤ 10,",
    s2e2q3: "dan",
    s2e2q4: "Tentukan",
    s2e2p: "P = bilangan prima ≤ 10",
    s2e2q_set: "Q = bilangan ganjil ≤ 10",
    s2e2s1: "Langkah 1 — Daftar anggota:",
    s2e2s2: "Langkah 2 — Gabungan P ∪ Q:",
    s2e2s2desc: "(gabungkan semua, tanpa duplikasi)",
    s2e2s3: "Langkah 3 — Irisan P ∩ Q:",
    s2e2s3desc: "(hanya yang ada di P dan Q sekaligus)",
    s2e2primeMember: "Bilangan prima ≤ 10:",
    s2e2oddMember: "Bilangan ganjil ≤ 10:",
    s2e2primeMath: "P = \\{2, 3, 5, 7\\}",
    s2e2oddMath: "Q = \\{1, 3, 5, 7, 9\\}",

    s2e3q: "Di sebuah kelas, 25 siswa suka olahraga, 20 siswa suka musik, dan 12 siswa suka keduanya. Jika total ada 40 siswa, berapa yang tidak suka keduanya?",
    s2e3s1: "Langkah 1 — Cari gabungan:",
    s2e3s2: "Langkah 2 — Cari yang tidak suka keduanya:",
    s2e3kw: "tidak keduanya",
    s2e3ans: "Sebanyak 7 siswa tidak menyukai olahraga maupun musik.",

    // Sub3 - Intersection
    s3def: "Irisan dua himpunan A dan B, ditulis",
    s3def2: "adalah himpunan yang berisi anggota yang ada",
    s3def3: "baik di A",
    s3def4: "maupun",
    s3def5: "di B secara bersamaan.",
    s3formula: "📐 Himpunan:",
    s3tip: "💡 Tips: Kata kunci \"irisan\" = \"dan\". Bayangkan kamu mencari siapa yang ada di kedua kelompok sekaligus — tidak cukup hanya ada di satu!",
    s3intersTitle: "A ∩ B (tengah diarsir)",

    s3e1q: "Tentukan irisan dari himpunan-himpunan berikut:",
    s3e1opts: ["A = {1, 2, 3, 4, 5} dan B = {3, 4, 5, 6, 7}", "C = {huruf vokal} dan D = {a, b, c, d, e}"],
    s3e1aTitle: "a. A ∩ B:",
    s3e1bTitle: "b. C ∩ D:",
    s3e1aText: "Anggota yang ada di A dan B sekaligus:",
    s3e1bText: "Huruf vokal: {a, e, i, o, u}. Anggota yang ada di C dan D sekaligus:",
    s3e1note: "Hasil irisan:",

    s3e2q1: "Himpunan semesta",
    s3e2q2: "bilangan bulat 1–20,",
    s3e2q3: "dan",
    s3e2q4: "Gambarkan Diagram Venn dan tentukan",
    s3e2q5: "serta",
    s3e2multOf4: "Kelipatan 4 dari 1–20:",
    s3e2multOf6: "Kelipatan 6 dari 1–20:",
    s3e2unionText: "Gabungan (semua anggota):",
    s3e2intersText: "Irisan (ada di keduanya):",
    s3e2onlyP: "Hanya P:", s3e2onlyQ: "Hanya Q:", s3e2both: "P∩Q:",
    s3e2outside: "Di luar P dan Q:",

    s3e3q: "Survei 40 siswa: 20 minum teh setiap hari, 18 minum kopi setiap hari. Jika 5 siswa tidak minum keduanya, berapa siswa yang minum keduanya?",
    s3e3s1: "Langkah 1 — Cari yang minum setidaknya satu:",
    s3e3s2: "Langkah 2 — Gunakan rumus gabungan:",
    s3e3ans: "Ada 3 siswa yang minum teh dan kopi setiap hari.",

    // Sub4 - Set Difference
    s4def: "Selisih himpunan A dan B, ditulis",
    s4def2: "adalah himpunan yang berisi anggota yang ada di A",
    s4def3: "tetapi TIDAK ada",
    s4def4: "di B.",
    s4formula: "📐 Formula:",
    s4tip: "💡 Tips: A − B ≠ B − A! Selisih tidak komutatif. Perhatikan urutan — himpunan pertama adalah \"induk\", himpunan kedua adalah \"yang dikurangi\".",
    s4diffABTitle: "A − B (kiri diarsir)",
    s4diffBATitle: "B − A (kanan diarsir)",

    s4e1q: "Tentukan selisih dari:",
    s4e1opts: ["A = {1,2,3,4,5} dan B = {3,4,5,6,7}", ""],
    s4e1a: "A − B (anggota A yang tidak ada di B):",
    s4e1b: "B − A (anggota B yang tidak ada di A):",

    s4e2q1: "Diketahui",
    s4e2q2: "dan",
    s4e2q3: "Tentukan",
    s4e2q4: "dan",
    s4e2multOf3: "Kelipatan 3 dari 1–15:", s4e2multOf5: "Kelipatan 5 dari 1–15:",
    s4e2a: "A − B (ada di A tapi tidak di B):",
    s4e2b: "B − A (ada di B tapi tidak di A):",

    s4e3q: "Dari himpunan semesta S = {a, b, c, d, e, f, g, h}, diketahui M = {a, c, e, g} dan N = {b, c, d, e}. Tentukan (a) M − N, (b) N − M, (c) (M − N) ∪ (N − M).",
    s4e3a: "(a) M − N (ada di M, tidak di N):",
    s4e3b: "(b) N − M (ada di N, tidak di M):",
    s4e3c: "(c) (M−N) ∪ (N−M):",
    s4e3note: "Ini disebut Selisih Simetris (Symmetric Difference)!",

    // Sub5 - Complement
    s5def: "Komplemen himpunan A, ditulis",
    s5def2: "atau",
    s5def3: "adalah himpunan yang berisi semua anggota himpunan semesta",
    s5def4: "yang TIDAK ada dalam A.",
    s5formula: "📐 Rumus:",
    s5tip: "💡 Tips: Komplemen dan himpunan aslinya selalu \"melengkapi\" himpunan semesta. Artinya n(A) + n(Aᶜ) = n(S). Ini berguna untuk mencari salah satu dari keduanya!",
    s5complTitle: "Aᶜ (di luar A diarsir)",

    s5e1q: "Diketahui",
    s5e1q2: "dan",
    s5e1q3: "Tentukan",
    s5e1qMath: "S = \\{1,2,3,4,5,6,7,8,9,10\\}",
    s5e1aMath: "A = \\{2,4,6,8,10\\}",
    s5e1s1: "Cari anggota S yang tidak ada di A:",
    s5e1ans: "Komplemen A berisi bilangan ganjil dari 1 sampai 10.",

    s5e2q1: "Himpunan semesta",
    s5e2q2: "huruf dalam kata MATEMATIKA,",
    s5e2q3: "dan",
    s5e2q4: "Tentukan",
    s5e2s1: "Langkah 1 — Tentukan anggota S (tanpa duplikasi):",
    s5e2wordNote: "Huruf dalam MATEMATIKA: M,A,T,E,M,A,T,I,K,A (simpan yang unik)",
    s5e2s2: "Langkah 2 — Tentukan anggota B:",
    s5e2s3: "Langkah 3 — Cari Bᶜ:",
    s5e2BcText: "Anggota S yang tidak di B:",

    s5e3q: "Diketahui n(S) = 50, n(A) = 30, n(B) = 25, dan n(A ∩ B) = 10. Tentukan: (a) n(Aᶜ), (b) n(Bᶜ), (c) n((A∪B)ᶜ).",
    s5e3a: "(a) n(Aᶜ):",
    s5e3b: "(b) n(Bᶜ):",
    s5e3c: "(c) n((A∪B)ᶜ):",
    s5e3unionFirst: "Cari n(A∪B) dulu:",
    s5e3then: "Lalu:",
  },

  en: {
    title: "VENN DIAGRAM",
    subtitle: "Set Visualization · Operations · Interpretation",
    breadcrumb: "Grade 7 · Sets · Mathematics",
    back: "Back to Sets",
    easy: "Easy", medium: "Medium", hard: "Hard",
    summary: "📌 Summary",
    problems: "📝 Practice Problems & Solutions",
    solution: "SOLUTION",
    step: "Step",
    known: "Given",
    example: "Example",

    sub1: "Section 1: Introduction to Venn Diagrams",
    sub2: "Section 2: Union Operation",
    sub3: "Section 3: Intersection Operation",
    sub4: "Section 4: Set Difference Operation",
    sub5: "Section 5: Complement Operation",

    s1def: "is a visual representation using overlapping (or separate) circles to illustrate the relationship between two or more sets.",
    s1rules: "Rules for Drawing Venn Diagrams:",
    s1rulesList: [
      "The universal set (S) is represented by a rectangle",
      "Each set is drawn as a circle inside the rectangle",
      "Members of a set are written inside the corresponding circle",
      "Members in two sets are written in the overlapping region",
      "Members not in any set are written outside all circles",
    ],
    s1tip: "💡 Tip: Venn diagrams were first introduced by John Venn (1834–1923), a British mathematician and philosopher. They are very useful for visualizing complex set relationships!",
    s1contextTitle: "Contextual Example: Club Members",
    s1contextDesc: "30 Grade 7C students. Futsal = 8, Basketball = 7, Both = 5",
    s1outsideLabel: "Outside",
    s1studentsLabel: "students",
    s1bothLabel: "Both",

    s2def: "The union of two sets A and B, written",
    s2def2: "is the set containing all members that are in A,",
    s2def3: "or",
    s2def4: "in B, or in both.",
    s2formula: "📐 Formula:",
    s2tip: "💡 Tip: Keyword for 'union' = 'or'. Imagine combining the contents of two containers into one — without duplicates!",
    s2unionTitle: "A ∪ B (all shaded)",
    s2pTitle: "Universal set S and problem:",
    s2primeLabel: "primes ≤ 10",
    s2oddLabel: "odd numbers ≤ 10",

    s2e1q: "Given",
    s2e1q2: "Find",
    s2e1aTitle: "a. A ∪ B:",
    s2e1bTitle: "b. A ∩ B:",
    s2e1note: "Note: Each member is written only once in the set, even if it appears in both sets.",
    s2e1s1: "Step 1 — Identify members of each set:",
    s2e1s2: "Step 2 — Union (all members, no duplicates):",
    s2e1s3: "Step 3 — Intersection (members in both):",

    s2e2q: "Given universal set",
    s2e2q2: "natural numbers ≤ 10,",
    s2e2q3: "and",
    s2e2q4: "Find",
    s2e2p: "P = primes ≤ 10",
    s2e2q_set: "Q = odd numbers ≤ 10",
    s2e2s1: "Step 1 — List members:",
    s2e2s2: "Step 2 — Union P ∪ Q:",
    s2e2s2desc: "(combine all, no duplicates)",
    s2e2s3: "Step 3 — Intersection P ∩ Q:",
    s2e2s3desc: "(only members in both P and Q)",
    s2e2primeMember: "Primes ≤ 10:",
    s2e2oddMember: "Odd numbers ≤ 10:",
    s2e2primeMath: "P = \\{2, 3, 5, 7\\}",
    s2e2oddMath: "Q = \\{1, 3, 5, 7, 9\\}",

    s2e3q: "In a class, 25 students like sports, 20 like music, and 12 like both. If there are 40 students in total, how many like neither?",
    s2e3s1: "Step 1 — Find the union:",
    s2e3s2: "Step 2 — Find those who like neither:",
    s2e3kw: "neither",
    s2e3ans: "7 students like neither sports nor music.",

    s3def: "The intersection of two sets A and B, written",
    s3def2: "is the set containing members that are",
    s3def3: "in both A",
    s3def4: "and",
    s3def5: "in B simultaneously.",
    s3formula: "📐 Set:",
    s3tip: "💡 Tip: Keyword for 'intersection' = 'and'. Look for who appears in both groups — being in just one is not enough!",
    s3intersTitle: "A ∩ B (center shaded)",

    s3e1q: "Find the intersection of the following sets:",
    s3e1opts: ["A = {1,2,3,4,5} and B = {3,4,5,6,7}", "C = {vowels} and D = {a,b,c,d,e}"],
    s3e1aTitle: "a. A ∩ B:",
    s3e1bTitle: "b. C ∩ D:",
    s3e1aText: "Members in both A and B:",
    s3e1bText: "Vowels: {a,e,i,o,u}. Members in both C and D:",
    s3e1note: "Intersection result:",

    s3e2q1: "Universal set",
    s3e2q2: "integers 1–20,",
    s3e2q3: "and",
    s3e2q4: "Draw a Venn Diagram and find",
    s3e2q5: "and",
    s3e2multOf4: "Multiples of 4 from 1–20:",
    s3e2multOf6: "Multiples of 6 from 1–20:",
    s3e2unionText: "Union (all members):",
    s3e2intersText: "Intersection (in both):",
    s3e2onlyP: "Only P:", s3e2onlyQ: "Only Q:", s3e2both: "P∩Q:",
    s3e2outside: "Outside P and Q:",

    s3e3q: "A survey of 40 students: 20 drink tea daily, 18 drink coffee daily. If 5 students drink neither, how many drink both?",
    s3e3s1: "Step 1 — Find those who drink at least one:",
    s3e3s2: "Step 2 — Use union formula:",
    s3e3ans: "There are 3 students who drink both tea and coffee daily.",

    s4def: "The set difference A minus B, written",
    s4def2: "is the set containing members in A",
    s4def3: "but NOT in",
    s4def4: "B.",
    s4formula: "📐 Formula:",
    s4tip: "💡 Tip: A − B ≠ B − A! Set difference is not commutative. Order matters — the first set is the 'base', the second is 'subtracted'.",
    s4diffABTitle: "A − B (left shaded)",
    s4diffBATitle: "B − A (right shaded)",

    s4e1q: "Find the set difference of:",
    s4e1opts: ["A = {1,2,3,4,5} and B = {3,4,5,6,7}", ""],
    s4e1a: "A − B (members of A not in B):",
    s4e1b: "B − A (members of B not in A):",

    s4e2q1: "Given",
    s4e2q2: "and",
    s4e2q3: "Find",
    s4e2q4: "and",
    s4e2multOf3: "Multiples of 3 from 1–15:", s4e2multOf5: "Multiples of 5 from 1–15:",
    s4e2a: "A − B (in A but not in B):",
    s4e2b: "B − A (in B but not in A):",

    s4e3q: "From universal set S = {a,b,c,d,e,f,g,h}, given M = {a,c,e,g} and N = {b,c,d,e}. Find (a) M−N, (b) N−M, (c) (M−N) ∪ (N−M).",
    s4e3a: "(a) M − N (in M, not in N):",
    s4e3b: "(b) N − M (in N, not in M):",
    s4e3c: "(c) (M−N) ∪ (N−M):",
    s4e3note: "This is called the Symmetric Difference!",

    s5def: "The complement of set A, written",
    s5def2: "or",
    s5def3: "is the set containing all members of the universal set",
    s5def4: "that are NOT in A.",
    s5formula: "📐 Formula:",
    s5tip: "💡 Tip: A set and its complement always 'complete' the universal set. So n(A) + n(Aᶜ) = n(S). This is useful for finding one when you know the other!",
    s5complTitle: "Aᶜ (outside A shaded)",

    s5e1q: "Given",
    s5e1q2: "and",
    s5e1q3: "Find",
    s5e1qMath: "S = \\{1,2,3,4,5,6,7,8,9,10\\}",
    s5e1aMath: "A = \\{2,4,6,8,10\\}",
    s5e1s1: "Find members of S not in A:",
    s5e1ans: "The complement of A contains the odd numbers from 1 to 10.",

    s5e2q1: "Universal set",
    s5e2q2: "letters in the word MATHEMATICS,",
    s5e2q3: "and",
    s5e2q4: "Find",
    s5e2s1: "Step 1 — Find members of S (no duplicates):",
    s5e2wordNote: "Letters in MATHEMATICS: M,A,T,H,E,M,A,T,I,C,S (keep unique)",
    s5e2s2: "Step 2 — Find members of B:",
    s5e2s3: "Step 3 — Find Bᶜ:",
    s5e2BcText: "Members of S not in B:",

    s5e3q: "Given n(S) = 50, n(A) = 30, n(B) = 25, and n(A ∩ B) = 10. Find: (a) n(Aᶜ), (b) n(Bᶜ), (c) n((A∪B)ᶜ).",
    s5e3a: "(a) n(Aᶜ):",
    s5e3b: "(b) n(Bᶜ):",
    s5e3c: "(c) n((A∪B)ᶜ):",
    s5e3unionFirst: "First find n(A∪B):",
    s5e3then: "Then:",
  },

  ja: {
    title: "ベン図",
    subtitle: "集合の視覚化 · 演算 · 解釈",
    breadcrumb: "中学1年 · 集合 · 数学教材",
    back: "集合に戻る",
    easy: "基本", medium: "標準", hard: "発展",
    summary: "📌 まとめ",
    problems: "📝 練習問題と解説",
    solution: "解説",
    step: "ステップ",
    known: "既知",
    example: "例題",

    sub1: "第1節：ベン図の導入",
    sub2: "第2節：和集合の演算",
    sub3: "第3節：共通部分の演算",
    sub4: "第4節：差集合の演算",
    sub5: "第5節：補集合の演算",

    s1def: "は、2つ以上の集合の関係を示すために、重なり合う（または分離した）円を使った視覚的表現です。",
    s1rules: "ベン図を描くルール：",
    s1rulesList: [
      "全体集合（S）は長方形で表す",
      "各集合は長方形の中の円で描く",
      "集合の要素は対応する円の中に書く",
      "2つの集合に属する要素は重なり部分に書く",
      "どの集合にも属さない要素はすべての円の外に書く",
    ],
    s1tip: "💡 コツ：ベン図は、イギリスの数学者・哲学者ジョン・ベン（1834–1923）によって初めて導入されました。複雑な集合関係を視覚化するのに非常に役立ちます！",
    s1contextTitle: "文脈の例：クラブ生徒",
    s1contextDesc: "中学1年C組30人。フットサル = 8人、バスケ = 7人、両方 = 5人",
    s1outsideLabel: "外側",
    s1studentsLabel: "人",
    s1bothLabel: "両方",

    s2def: "2つの集合AとBの和集合を",
    s2def2: "と書き、Aに属する要素、",
    s2def3: "または",
    s2def4: "Bに属する要素、またはその両方を含む集合です。",
    s2formula: "📐 公式：",
    s2tip: "💡 コツ：「和集合」のキーワード = 「または」。2つの容器の中身を一つにまとめるイメージ — 重複なし！",
    s2unionTitle: "A ∪ B（全体が塗られている）",
    s2pTitle: "全体集合 S と問題：",
    s2primeLabel: "素数 ≤ 10",
    s2oddLabel: "奇数 ≤ 10",

    s2e1q: "",
    s2e1q2: "を求めなさい。",
    s2e1aTitle: "a. A ∪ B：",
    s2e1bTitle: "b. A ∩ B：",
    s2e1note: "注意：集合では同じ要素は一度だけ書きます（重複なし）。",
    s2e1s1: "ステップ1 — 各集合の要素を確認：",
    s2e1s2: "ステップ2 — 和集合（全要素、重複なし）：",
    s2e1s3: "ステップ3 — 共通部分（両方にある要素）：",

    s2e2q: "全体集合",
    s2e2q2: "（10以下の自然数）、",
    s2e2q3: "および",
    s2e2q4: "を求めなさい。",
    s2e2p: "P = 10以下の素数",
    s2e2q_set: "Q = 10以下の奇数",
    s2e2s1: "ステップ1 — 要素を列挙：",
    s2e2s2: "ステップ2 — P ∪ Q：",
    s2e2s2desc: "（全要素を合わせる、重複なし）",
    s2e2s3: "ステップ3 — P ∩ Q：",
    s2e2s3desc: "（PとQの両方にある要素）",
    s2e2primeMember: "10以下の素数：",
    s2e2oddMember: "10以下の奇数：",
    s2e2primeMath: "P = \\{2, 3, 5, 7\\}",
    s2e2oddMath: "Q = \\{1, 3, 5, 7, 9\\}",

    s2e3q: "あるクラスで、25人がスポーツ好き、20人が音楽好き、12人が両方好きです。40人いるとしたら、どちらも好きでない人は何人？",
    s2e3s1: "ステップ1 — 和集合を求める：",
    s2e3s2: "ステップ2 — どちらも好きでない人を求める：",
    s2e3kw: "どちらでもない",
    s2e3ans: "スポーツも音楽も好きでない生徒は7人です。",

    s3def: "2つの集合AとBの共通部分を",
    s3def2: "と書き、",
    s3def3: "AとBの両方",
    s3def4: "に同時に",
    s3def5: "属する要素の集合です。",
    s3formula: "📐 集合：",
    s3tip: "💡 コツ：「共通部分」のキーワード = 「かつ」。両グループに同時に属する人を探します — 片方だけでは不十分！",
    s3intersTitle: "A ∩ B（中央が塗られている）",

    s3e1q: "次の集合の共通部分を求めなさい：",
    s3e1opts: ["A = {1,2,3,4,5} と B = {3,4,5,6,7}", "C = {母音} と D = {a,b,c,d,e}"],
    s3e1aTitle: "a. A ∩ B：",
    s3e1bTitle: "b. C ∩ D：",
    s3e1aText: "AとBの両方にある要素：",
    s3e1bText: "母音：{a,e,i,o,u}。CとDの両方にある要素：",
    s3e1note: "共通部分：",

    s3e2q1: "全体集合",
    s3e2q2: "（整数1〜20）、",
    s3e2q3: "および",
    s3e2q4: "ベン図を描き、",
    s3e2q5: "と",
    s3e2multOf4: "1〜20の4の倍数：",
    s3e2multOf6: "1〜20の6の倍数：",
    s3e2unionText: "和集合（全要素）：",
    s3e2intersText: "共通部分（両方にある要素）：",
    s3e2onlyP: "Pのみ：", s3e2onlyQ: "Qのみ：", s3e2both: "P∩Q：",
    s3e2outside: "PとQの外：",

    s3e3q: "40人への調査：20人が毎日お茶を飲み、18人が毎日コーヒーを飲む。5人がどちらも飲まない場合、両方飲む人は何人？",
    s3e3s1: "ステップ1 — 少なくとも一方を飲む人数を求める：",
    s3e3s2: "ステップ2 — 和集合の公式を使う：",
    s3e3ans: "毎日お茶とコーヒーの両方を飲む生徒は3人です。",

    s4def: "集合AからBを引いた差集合を",
    s4def2: "と書き、Aに属するが",
    s4def3: "Bには属さない",
    s4def4: "要素の集合です。",
    s4formula: "📐 公式：",
    s4tip: "💡 コツ：A − B ≠ B − A！差集合は可換ではありません。順序が重要です — 最初の集合が「ベース」、2番目が「引くもの」です。",
    s4diffABTitle: "A − B（左が塗られている）",
    s4diffBATitle: "B − A（右が塗られている）",

    s4e1q: "次の差集合を求めなさい：",
    s4e1opts: ["A = {1,2,3,4,5} と B = {3,4,5,6,7}", ""],
    s4e1a: "A − B（AにあってBにない要素）：",
    s4e1b: "B − A（BにあってAにない要素）：",

    s4e2q1: "",
    s4e2q2: "および",
    s4e2q3: "を求めなさい。",
    s4e2q4: "と",
    s4e2multOf3: "1〜15の3の倍数：", s4e2multOf5: "1〜15の5の倍数：",
    s4e2a: "A − B（AにあってBにない）：",
    s4e2b: "B − A（BにあってAにない）：",

    s4e3q: "全体集合 S = {a,b,c,d,e,f,g,h}、M = {a,c,e,g}、N = {b,c,d,e}。(a) M−N、(b) N−M、(c) (M−N) ∪ (N−M) を求めなさい。",
    s4e3a: "(a) M − N（Mにある、Nにない）：",
    s4e3b: "(b) N − M（Nにある、Mにない）：",
    s4e3c: "(c) (M−N) ∪ (N−M)：",
    s4e3note: "これを対称差（Symmetric Difference）といいます！",

    s5def: "集合Aの補集合を",
    s5def2: "または",
    s5def3: "と書き、全体集合のうち",
    s5def4: "Aに属さないすべての要素の集合です。",
    s5formula: "📐 公式：",
    s5tip: "💡 コツ：集合とその補集合は常に全体集合を「完成」させます。つまり n(A) + n(Aᶜ) = n(S)。これはどちらか一方を求めるときに便利です！",
    s5complTitle: "Aᶜ（Aの外が塗られている）",

    s5e1q: "",
    s5e1q2: "および",
    s5e1q3: "を求めなさい。",
    s5e1qMath: "S = \\{1,2,3,4,5,6,7,8,9,10\\}",
    s5e1aMath: "A = \\{2,4,6,8,10\\}",
    s5e1s1: "SのうちAにない要素を求める：",
    s5e1ans: "Aの補集合は1から10の奇数を含みます。",

    s5e2q1: "全体集合",
    s5e2q2: "（MATHEMATICS という単語の文字）、",
    s5e2q3: "および",
    s5e2q4: "を求めなさい。",
    s5e2s1: "ステップ1 — S の要素を求める（重複なし）：",
    s5e2wordNote: "MATHEMATICSの文字：M,A,T,H,E,M,A,T,I,C,S（重複を取り除く）",
    s5e2s2: "ステップ2 — B の要素を求める：",
    s5e2s3: "ステップ3 — Bᶜ を求める：",
    s5e2BcText: "SのうちBにない要素：",

    s5e3q: "n(S)=50、n(A)=30、n(B)=25、n(A∩B)=10。(a) n(Aᶜ)、(b) n(Bᶜ)、(c) n((A∪B)ᶜ) を求めなさい。",
    s5e3a: "(a) n(Aᶜ)：",
    s5e3b: "(b) n(Bᶜ)：",
    s5e3c: "(c) n((A∪B)ᶜ)：",
    s5e3unionFirst: "まず n(A∪B) を求める：",
    s5e3then: "次に：",
  },
};

/* ══════════════════════════════════════════════════════════
   SVG COMPONENTS
══════════════════════════════════════════════════════════ */
type T = typeof translations.id;

// Generic Venn diagram with shading options
const VennSvg = ({
  title, shadeLeft = false, shadeRight = false, shadeCenter = false, shadeOuter = false,
}: {
  title: string; shadeLeft?: boolean; shadeRight?: boolean; shadeCenter?: boolean; shadeOuter?: boolean;
}) => {
  const shadeColor = "rgba(250,204,21,0.30)";
  const outerShade = "rgba(250,204,21,0.18)";
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-xs font-mono text-yellow-300">{title}</p>
      <svg viewBox="0 0 260 150" className="w-full max-w-[220px]">
        {/* Universal set */}
        <rect x="4" y="4" width="252" height="142" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5"/>
        <text x="240" y="18" fontSize="11" fill="#64748b" fontFamily="monospace">S</text>
        {/* Outer shading */}
        {shadeOuter && <rect x="4" y="4" width="252" height="142" rx="8" fill={outerShade}/>}
        {/* Left circle fill */}
        {shadeLeft && <circle cx="100" cy="75" r="48" fill={shadeColor}/>}
        {/* Right circle fill */}
        {shadeRight && <circle cx="160" cy="75" r="48" fill={shadeColor}/>}
        {/* Left circle stroke */}
        <circle cx="100" cy="75" r="48" fill="none" stroke="#38bdf8" strokeWidth="2"/>
        {/* Right circle stroke */}
        <circle cx="160" cy="75" r="48" fill="none" stroke="#818cf8" strokeWidth="2"/>
        {/* Center shade on top */}
        {shadeCenter && !shadeLeft && !shadeRight && (
          <path d="M 130,75 m -15,-30 a 48,48 0 0,1 30,0 a 48,48 0 0,1 -30,0 Z" fill={shadeColor}/>
        )}
        {/* Remove center when shadeLeft OR shadeRight but not shadeCenter */}
        {(shadeLeft || shadeRight) && !shadeCenter && (
          <path d="M 130,43 a 48,48 0 0,1 0,64 a 48,48 0 0,1 0,-64 Z" fill="#0f172a" stroke="none"/>
        )}
        {/* Remove outer-only circles shading */}
        {shadeOuter && (
          <>
            <circle cx="100" cy="75" r="48" fill="#0f172a" opacity="0.7"/>
            <circle cx="160" cy="75" r="48" fill="#0f172a" opacity="0.7"/>
          </>
        )}
        {/* Labels */}
        <text x="84" y="72" textAnchor="middle" fontSize="12" fill="#bae6fd" fontFamily="monospace" fontWeight="bold">A</text>
        <text x="176" y="72" textAnchor="middle" fontSize="12" fill="#c7d2fe" fontFamily="monospace" fontWeight="bold">B</text>
      </svg>
    </div>
  );
};

const VennContextual = ({ t }: { t: T }) => (
  <div className="flex flex-col items-center gap-1">
    <p className="text-xs font-mono text-cyan-300">{t.s1contextTitle}</p>
    <svg viewBox="0 0 280 170" className="w-full max-w-xs">
      <rect x="4" y="4" width="272" height="162" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5"/>
      <text x="258" y="20" fontSize="11" fill="#64748b" fontFamily="monospace">S</text>
      {/* Futsal circle */}
      <circle cx="110" cy="88" r="60" fill="#164e63" stroke="#22d3ee" strokeWidth="2" fillOpacity="0.7"/>
      {/* Basket circle */}
      <circle cx="170" cy="88" r="60" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" fillOpacity="0.7"/>
      {/* Labels */}
      <text x="75" y="70" textAnchor="middle" fontSize="11" fill="#a5f3fc" fontFamily="sans-serif" fontWeight="bold">Futsal</text>
      <text x="75" y="88" textAnchor="middle" fontSize="11" fill="#a5f3fc" fontFamily="monospace">8 {t.s1studentsLabel}</text>
      <text x="75" y="103" textAnchor="middle" fontSize="10" fill="#7dd3fc" fontFamily="monospace">→ 8−5=3</text>
      <text x="205" y="70" textAnchor="middle" fontSize="11" fill="#c7d2fe" fontFamily="sans-serif" fontWeight="bold">
        {t.lang === "ja" ? "バスケ" : "Basketball"}
      </text>
      <text x="205" y="88" textAnchor="middle" fontSize="11" fill="#c7d2fe" fontFamily="monospace">7 {t.s1studentsLabel}</text>
      <text x="205" y="103" textAnchor="middle" fontSize="10" fill="#a5b4fc" fontFamily="monospace">→ 7−5=2</text>
      <text x="140" y="82" textAnchor="middle" fontSize="10" fill="#fde68a" fontFamily="sans-serif" fontWeight="bold">{t.s1bothLabel}</text>
      <text x="140" y="96" textAnchor="middle" fontSize="11" fill="#fde68a" fontFamily="monospace">5 {t.s1studentsLabel}</text>
      {/* Outside */}
      <text x="20" y="155" fontSize="9" fill="#64748b" fontFamily="monospace">{t.s1outsideLabel}: 30−(3+5+2)=20 {t.s1studentsLabel}</text>
    </svg>
  </div>
);

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
const DiagramVennPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = language as "id" | "en" | "ja";
  const t = translations[lang];

  const [expandedSections, setExpandedSections] = useState<string[]>(["pengenalan", "gabungan", "irisan", "selisih", "komplemen"]);
  const toggleSection = (s: string) => { playPopSound(); setExpandedSections((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]); };

  const SH = ({ id, label, icon, color }: { id: string; label: string; icon: React.ReactNode; color: string }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3"><span className={color}>{icon}</span><span className="font-body font-semibold text-white">{label}</span></div>
      {true ? <ChevronUp className="w-5 h-5 text-primary"/> : <ChevronDown className="w-5 h-5 text-primary"/>}
    </button>
  );

  const easyBadge   = <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.easy}</span>;
  const mediumBadge = <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.medium}</span>;
  const hardBadge   = <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.hard}</span>;

  const tWithLang = { ...t, lang };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <CircleDot className="w-10 h-10 text-primary mx-auto mb-3"/>
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">{t.title}</h1>
        <p className="text-white/50 text-xs text-center mb-1 font-body">{t.subtitle}</p>
        <p className="text-white/40 text-xs text-center mb-6 font-body">{t.breadcrumb}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── SUB-BAB 1: PENGENALAN ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="pengenalan" label={t.sub1} icon={<BookOpen className="w-5 h-5"/>} color="text-cyan-400"/>
            {true && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.summary}</p>
                  <p className="font-body text-sm text-white/80">
                    <strong className="text-cyan-300">{lang === "id" ? "Diagram Venn" : lang === "en" ? "A Venn Diagram" : "ベン図"}</strong>{" "}
                    {t.s1def}
                  </p>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-cyan-300 mb-2">{t.s1rules}</p>
                    <ul className="font-body text-xs text-white/70 space-y-1 list-disc list-inside">
                      {t.s1rulesList.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                  <div className="bg-slate-900/60 rounded-xl p-4">
                    <VennContextual t={tWithLang as T & { lang: string }}/>
                    <p className="text-xs text-white/50 text-center mt-2 font-body">{t.s1contextDesc}</p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">{t.s1tip}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 2: GABUNGAN ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="gabungan" label={t.sub2} icon={<Layers className="w-5 h-5"/>} color="text-blue-400"/>
            {true && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-blue-300">{t.summary}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.s2def} <InlineMath math="A \cup B"/>, {t.s2def2} <strong>{t.s2def3}</strong> {t.s2def4}
                  </p>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-blue-300">{t.s2formula}</p>
                    <div className="overflow-x-auto"><BlockMath math="A \cup B = \{x \mid x \in A \text{ or } x \in B\}"/></div>
                    <div className="overflow-x-auto"><BlockMath math="n(A \cup B) = n(A) + n(B) - n(A \cap B)"/></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <VennSvg title={t.s2unionTitle} shadeLeft shadeRight shadeCenter/>
                    <div className="bg-slate-900/50 rounded-xl p-3 space-y-2">
                      <p className="text-xs text-cyan-300 font-mono">{t.s2pTitle}</p>
                      <p className="text-xs text-white/70 font-body">{t.s2primeLabel}</p>
                      <p className="text-xs text-white/70 font-body">{t.s2oddLabel}</p>
                      <div className="text-xs text-white/60 font-mono space-y-1">
                        <p>P = &#123;2,3,5,7&#125;</p>
                        <p>Q = &#123;1,3,5,7,9&#125;</p>
                        <p className="text-primary">P∪Q = &#123;1,2,3,5,7,9&#125;</p>
                      </div>
                    </div>
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
                    <p className="font-body text-sm text-white">
                      {t.s2e1q} <InlineMath math="A = \{1,2,3,4,5\}"/> {lang === "id" ? "dan" : lang === "en" ? "and" : "と"} <InlineMath math="B = \{3,4,5,6,7\}"/>. {t.s2e1q2} <InlineMath math="A \cup B"/> {lang === "id" ? "dan" : lang === "en" ? "and" : "と"} <InlineMath math="A \cap B"/>!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.s2e1s1}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>A: 1, 2, 3, 4, 5</p>
                        <p>B: 3, 4, 5, 6, 7</p>
                      </div>
                      <p><strong>{t.s2e1aTitle}</strong> {t.s2e1s2}</p>
                      <div className="overflow-x-auto"><BlockMath math="A \cup B = \{1, 2, 3, 4, 5, 6, 7\}"/></div>
                      <p className="text-xs text-white/60">{t.s2e1note}</p>
                      <p><strong>{t.s2e1bTitle}</strong> {t.s2e1s3}</p>
                      <div className="overflow-x-auto"><BlockMath math="A \cap B = \{3, 4, 5\}"/></div>
                    </div>
                  </div>
                </div>

                {/* E2 - Medium */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="font-body font-semibold text-white">{t.example} 2</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {t.s2e2q} <InlineMath math="S"/> = {t.s2e2q2} <InlineMath math="{P}"/> = {t.s2e2p}, <InlineMath math="{Q}"/> = {t.s2e2q_set}. {t.s2e2q4} <InlineMath math="P \cup Q"/> {lang === "ja" ? "と" : lang === "en" ? "and" : "dan"} <InlineMath math="P \cap Q"/>!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.s2e2s1}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>{t.s2e2primeMember} <InlineMath math={t.s2e2primeMath}/></p>
                        <p>{t.s2e2oddMember} <InlineMath math={t.s2e2oddMath}/></p>
                      </div>
                      <p><strong>{t.s2e2s2}</strong> {t.s2e2s2desc}</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="P \cup Q = \{1, 2, 3, 5, 7, 9\}"/>
                      </div>
                      <p><strong>{t.s2e2s3}</strong> {t.s2e2s3desc}</p>
                      <div className="overflow-x-auto">
                        <BlockMath math="P \cap Q = \{3, 5, 7\}"/>
                      </div>
                      <p className="text-xs text-white/60">
                        {lang === "id" ? "Catatan: 2 ada di P tapi bukan di Q (bukan ganjil), 1 dan 9 ada di Q tapi bukan di P (bukan prima)." :
                         lang === "en" ? "Note: 2 is in P but not Q (not odd), 1 and 9 are in Q but not P (not prime)." :
                         "注意：2はPにあるがQにはない（奇数でない）、1と9はQにあるがPにはない（素数でない）。"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* E3 - Hard */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{hardBadge}<span className="font-body font-semibold text-white">{t.example} 3</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.s2e3q}</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.s2e3s1}</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(O \cup M) = n(O) + n(M) - n(O \cap M) = 25 + 20 - 12 = 33"/>
                      </div>
                      <p><strong>{t.s2e3s2}</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(S) - n(O \cup M) = 40 - 33 = 7"/>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded p-2">
                        <p className="text-red-300 text-xs font-semibold">✅ {t.s2e3ans}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 3: IRISAN ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="irisan" label={t.sub3} icon={<CircleDot className="w-5 h-5"/>} color="text-green-400"/>
            {true && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">{t.summary}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.s3def} <InlineMath math="A \cap B"/>, {t.s3def2} <strong>{t.s3def3}</strong> {t.s3def4} <strong>{t.s3def5}</strong>
                  </p>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-green-300">{t.s3formula}</p>
                    <div className="overflow-x-auto"><BlockMath math="A \cap B = \{x \mid x \in A \text{ and } x \in B\}"/></div>
                  </div>
                  <div className="flex justify-center">
                    <VennSvg title={t.s3intersTitle} shadeCenter/>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">{t.s3tip}</p>
                  </div>
                </div>
                <p className="font-body text-sm font-semibold text-white">{t.problems}</p>

                {/* E1 Easy */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{easyBadge}<span className="font-body font-semibold text-white">{t.example} 1</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.s3e1q}</p>
                    <ul className="font-body text-sm text-white/80 mt-2 space-y-1 list-[lower-alpha] list-inside">
                      {t.s3e1opts.map((o, i) => <li key={i}>{o}</li>)}
                    </ul>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div>
                        <p><strong>{t.s3e1aTitle}</strong> {t.s3e1aText}</p>
                        <div className="overflow-x-auto"><BlockMath math="A \cap B = \{3, 4, 5\}"/></div>
                      </div>
                      <div>
                        <p><strong>{t.s3e1bTitle}</strong> {t.s3e1bText}</p>
                        <div className="overflow-x-auto"><BlockMath math="C \cap D = \{a, e\}"/></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* E2 Medium */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="font-body font-semibold text-white">{t.example} 2</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {t.s3e2q1} <InlineMath math="S"/> = {t.s3e2q2} <InlineMath math="P"/> = {lang === "id" ? "kelipatan 4" : lang === "en" ? "multiples of 4" : "4の倍数"}, <InlineMath math="Q"/> = {lang === "id" ? "kelipatan 6" : lang === "en" ? "multiples of 6" : "6の倍数"}. {t.s3e2q4} <InlineMath math="P \cup Q"/> {t.s3e2q5} <InlineMath math="P \cap Q"/>!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>{t.s3e2multOf4} <InlineMath math="P = \{4, 8, 12, 16, 20\}"/></p>
                        <p>{t.s3e2multOf6} <InlineMath math="Q = \{6, 12, 18\}"/></p>
                      </div>
                      <p><strong>{t.s3e2unionText}</strong></p>
                      <div className="overflow-x-auto"><BlockMath math="P \cup Q = \{4, 6, 8, 12, 16, 18, 20\}"/></div>
                      <p><strong>{t.s3e2intersText}</strong></p>
                      <div className="overflow-x-auto"><BlockMath math="P \cap Q = \{12\}"/></div>
                      <div className="bg-slate-800/60 rounded p-2 text-xs space-y-1 font-mono">
                        <p>{t.s3e2onlyP} 4,8,16,20 | {t.s3e2onlyQ} 6,18 | {t.s3e2both} 12</p>
                        <p>{t.s3e2outside} {lang === "id" ? "bilangan 1–20 selain di P dan Q" : lang === "en" ? "numbers 1–20 not in P or Q" : "1〜20のうちPにもQにもない数"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* E3 Hard */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{hardBadge}<span className="font-body font-semibold text-white">{t.example} 3</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.s3e3q}</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.s3e3s1}</strong></p>
                      <div className="overflow-x-auto"><BlockMath math="n(T \cup K) = 40 - 5 = 35"/></div>
                      <p><strong>{t.s3e3s2}</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="n(T \cap K) = n(T) + n(K) - n(T \cup K) = 20 + 18 - 35 = 3"/>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded p-2">
                        <p className="text-red-300 text-xs font-semibold">✅ {t.s3e3ans}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 4: SELISIH ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="selisih" label={t.sub4} icon={<Layers className="w-5 h-5"/>} color="text-orange-400"/>
            {true && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-orange-300">{t.summary}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.s4def} <InlineMath math="A - B"/> {lang === "id" ? "atau" : lang === "en" ? "or" : "または"} <InlineMath math="A \setminus B"/>, {t.s4def2} <strong>{t.s4def3}</strong> {t.s4def4}
                  </p>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-orange-300">{t.s4formula}</p>
                    <div className="overflow-x-auto"><BlockMath math="A - B = \{x \mid x \in A \text{ and } x \notin B\}"/></div>
                    <div className="overflow-x-auto"><BlockMath math="n(A - B) = n(A) - n(A \cap B)"/></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <VennSvg title={t.s4diffABTitle} shadeLeft/>
                    <VennSvg title={t.s4diffBATitle} shadeRight/>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">{t.s4tip}</p>
                  </div>
                </div>
                <p className="font-body text-sm font-semibold text-white">{t.problems}</p>

                {/* E1 Easy */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{easyBadge}<span className="font-body font-semibold text-white">{t.example} 1</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {t.s4e1q} A = &#123;1,2,3,4,5&#125; {lang === "id" ? "dan" : lang === "en" ? "and" : "と"} B = &#123;3,4,5,6,7&#125;.{" "}
                      {lang === "id" ? "Tentukan A−B dan B−A!" : lang === "en" ? "Find A−B and B−A!" : "A−B と B−A を求めなさい！"}
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.s4e1a}</strong></p>
                      <div className="overflow-x-auto"><BlockMath math="A - B = \{1, 2\}"/></div>
                      <p><strong>{t.s4e1b}</strong></p>
                      <div className="overflow-x-auto"><BlockMath math="B - A = \{6, 7\}"/></div>
                    </div>
                  </div>
                </div>

                {/* E2 Medium */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="font-body font-semibold text-white">{t.example} 2</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {t.s4e2q1}{lang !== "ja" && " "}<InlineMath math="A"/> = {lang === "id" ? "kelipatan 3 dari 1–15" : lang === "en" ? "multiples of 3 from 1–15" : "1〜15の3の倍数"} {t.s4e2q2} <InlineMath math="B"/> = {lang === "id" ? "kelipatan 5 dari 1–15" : lang === "en" ? "multiples of 5 from 1–15" : "1〜15の5の倍数"}. {t.s4e2q3} <InlineMath math="A - B"/> {t.s4e2q4} <InlineMath math="B - A"/>!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>{t.s4e2multOf3} <InlineMath math="A = \{3, 6, 9, 12, 15\}"/></p>
                        <p>{t.s4e2multOf5} <InlineMath math="B = \{5, 10, 15\}"/></p>
                        <p>{lang === "id" ? "Irisan A∩B:" : lang === "en" ? "Intersection A∩B:" : "共通部分A∩B:"} <InlineMath math="A \cap B = \{15\}"/></p>
                      </div>
                      <p><strong>{t.s4e2a}</strong></p>
                      <div className="overflow-x-auto"><BlockMath math="A - B = \{3, 6, 9, 12\}"/></div>
                      <p><strong>{t.s4e2b}</strong></p>
                      <div className="overflow-x-auto"><BlockMath math="B - A = \{5, 10\}"/></div>
                    </div>
                  </div>
                </div>

                {/* E3 Hard */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{hardBadge}<span className="font-body font-semibold text-white">{t.example} 3</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.s4e3q}</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.s4e3a}</strong></p>
                      <div className="overflow-x-auto"><BlockMath math="M - N = \{a, g\}"/></div>
                      <p><strong>{t.s4e3b}</strong></p>
                      <div className="overflow-x-auto"><BlockMath math="N - M = \{b, d\}"/></div>
                      <p><strong>{t.s4e3c}</strong></p>
                      <div className="overflow-x-auto"><BlockMath math="(M-N) \cup (N-M) = \{a, b, d, g\}"/></div>
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded p-2 text-xs">
                        <p className="text-amber-300 font-semibold">💡 {t.s4e3note}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 5: KOMPLEMEN ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="komplemen" label={t.sub5} icon={<CircleDot className="w-5 h-5"/>} color="text-purple-400"/>
            {true && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">{t.summary}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.s5def} <InlineMath math="A^c"/> {t.s5def2} <InlineMath math="\overline{A}"/>, {t.s5def3} <InlineMath math="S"/> {t.s5def4}
                  </p>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-purple-300">{t.s5formula}</p>
                    <div className="overflow-x-auto"><BlockMath math="A^c = \{x \mid x \in S \text{ and } x \notin A\}"/></div>
                    <div className="overflow-x-auto"><BlockMath math="n(A^c) = n(S) - n(A)"/></div>
                  </div>
                  <div className="flex justify-center">
                    <VennSvg title={t.s5complTitle} shadeOuter/>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">{t.s5tip}</p>
                  </div>
                </div>
                <p className="font-body text-sm font-semibold text-white">{t.problems}</p>

                {/* E1 Easy */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{easyBadge}<span className="font-body font-semibold text-white">{t.example} 1</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {t.s5e1q}{lang !== "ja" && " "}<InlineMath math={t.s5e1qMath}/> {t.s5e1q2} <InlineMath math={t.s5e1aMath}/>. {t.s5e1q3} <InlineMath math="A^c"/>!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-2">{t.solution}:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <p>{t.s5e1s1}</p>
                      <div className="overflow-x-auto"><BlockMath math="A^c = S - A = \{1, 3, 5, 7, 9\}"/></div>
                      <p className="text-white/60 text-xs">{t.s5e1ans}</p>
                    </div>
                  </div>
                </div>

                {/* E2 Medium */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="font-body font-semibold text-white">{t.example} 2</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {t.s5e2q1} <InlineMath math="S"/> = {t.s5e2q2} <InlineMath math="B"/> = {lang === "id" ? "huruf konsonan dalam kata MATEMATIKA" : lang === "en" ? "consonants in the word MATHEMATICS" : "MATHEMATICSの子音"}. {t.s5e2q4} <InlineMath math="B^c"/>!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.s5e2s1}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-xs">{t.s5e2wordNote}</p>
                        <p className="text-primary mt-1">
                          {lang === "id" ? "S = {M, A, T, E, I, K}" : lang === "en" ? "S = {M, A, T, H, E, I, C, S}" : "S = {M, A, T, H, E, I, C, S}"}
                        </p>
                      </div>
                      <p><strong>{t.s5e2s2}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>
                          {lang === "id" ? "B = konsonan = {M, T, K}" : lang === "en" ? "B = consonants = {M, T, H, C, S}" : "B = 子音 = {M, T, H, C, S}"}
                        </p>
                      </div>
                      <p><strong>{t.s5e2s3}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>{t.s5e2BcText}</p>
                        <p className="text-primary mt-1">
                          {lang === "id" ? "Bᶜ = vokal dalam S = {A, E, I}" : lang === "en" ? "Bᶜ = vowels in S = {A, E, I}" : "Bᶜ = Sの母音 = {A, E, I}"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* E3 Hard */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{hardBadge}<span className="font-body font-semibold text-white">{t.example} 3</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.s5e3q}</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div>
                        <p><strong>{t.s5e3a}</strong></p>
                        <div className="overflow-x-auto"><BlockMath math="n(A^c) = n(S) - n(A) = 50 - 30 = 20"/></div>
                      </div>
                      <div>
                        <p><strong>{t.s5e3b}</strong></p>
                        <div className="overflow-x-auto"><BlockMath math="n(B^c) = n(S) - n(B) = 50 - 25 = 25"/></div>
                      </div>
                      <div>
                        <p><strong>{t.s5e3c}</strong></p>
                        <p>{t.s5e3unionFirst}</p>
                        <div className="overflow-x-auto"><BlockMath math="n(A \cup B) = 30 + 25 - 10 = 45"/></div>
                        <p>{t.s5e3then}</p>
                        <div className="overflow-x-auto"><BlockMath math="n((A \cup B)^c) = 50 - 45 = 5"/></div>
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

export default DiagramVennPage;
