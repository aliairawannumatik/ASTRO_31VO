import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Combine } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ══════════════════════════════════════════════════════════
   TRANSLATIONS
══════════════════════════════════════════════════════════ */
const translations = {
  id: {
    title: "OPERASI HIMPUNAN DI ATAS DIAGRAM VENN",
    subtitle: "Gabungan · Irisan · Selisih · Komplemen",
    breadcrumb: "Kelas 7 · Himpunan · Materi Matematika",
    back: "Kembali ke Himpunan",
    easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
    summary: "📌 Ringkasan Intisari",
    problems: "📝 Contoh Soal & Pembahasan",
    solution: "PEMBAHASAN",
    step: "Langkah",
    example: "Contoh",

    sub1: "Sub-Bab 1: Gabungan (Union) — A ∪ B",
    sub2: "Sub-Bab 2: Irisan (Intersection) — A ∩ B",
    sub3: "Sub-Bab 3: Selisih (Set Difference) — A − B",
    sub4: "Sub-Bab 4: Komplemen (Complement) — Aᶜ",

    // Sub1 - Union
    s1defPre: "Gabungan dua himpunan A dan B, ditulis",
    s1defPost: "adalah himpunan semua anggota yang ada di A, di B, atau di keduanya.",
    s1formula: "📐 Rumus Kardinalitas:",
    s1tip: "💡 Tips: Kata kunci \"gabungan\" = \"atau\". Gabungkan semua isi dua wadah menjadi satu — tanpa duplikasi!",
    s1vennTitle: "A ∪ B (seluruh kedua lingkaran diarsir)",
    s1table: ["Himpunan", "Anggota", "Keterangan"],
    s1rows: [
      ["A = {1,2,3,4}", "1,2,3,4", "himpunan pertama"],
      ["B = {3,4,5,6}", "3,4,5,6", "himpunan kedua"],
      ["A ∪ B", "1,2,3,4,5,6", "semua anggota, tanpa duplikasi"],
    ],

    s1e1q: "Diketahui A = {bilangan prima ≤ 10} dan B = {bilangan ganjil ≤ 10}. Tentukan A ∪ B!",
    s1e1s1: "Langkah 1 — Daftar anggota:",
    s1e1aMath: "A = \\{2, 3, 5, 7\\}",
    s1e1bMath: "B = \\{1, 3, 5, 7, 9\\}",
    s1e1s2: "Langkah 2 — Gabungan (semua, tanpa duplikasi):",
    s1e1ans: "A ∪ B = {1, 2, 3, 5, 7, 9}",
    s1e1note: "Anggota 3, 5, 7 muncul di keduanya — ditulis sekali saja.",

    s1e2q: "Dari 40 siswa, 25 suka olahraga (O), 20 suka musik (M), dan 12 suka keduanya. Berapa n(O ∪ M) dan berapa yang tidak suka keduanya?",
    s1e2s1: "Langkah 1 — Gabungan:",
    s1e2s2: "Langkah 2 — Tidak suka keduanya:",
    s1e2ans1: "n(O ∪ M) = 25 + 20 − 12 = 33 siswa",
    s1e2ans2: "Tidak suka keduanya = 40 − 33 = 7 siswa",

    s1e3q: "Diketahui n(A) = 15, n(B) = 12, n(A ∩ B) = 5. Tentukan n(A ∪ B)!",
    s1e3ans: "n(A ∪ B) = 15 + 12 − 5 = 22",

    // Sub2 - Intersection
    s2defPre: "Irisan dua himpunan A dan B, ditulis",
    s2defPost: "adalah himpunan anggota yang ada di A dan juga ada di B secara bersamaan.",
    s2formula: "📐 Definisi:",
    s2tip: "💡 Tips: Kata kunci \"irisan\" = \"dan\". Hanya anggota yang ada di kedua himpunan sekaligus yang masuk!",
    s2vennTitle: "A ∩ B (bagian tengah diarsir)",
    s2table: ["Himpunan", "Anggota", "Keterangan"],
    s2rows: [
      ["A = {1,2,3,4}", "1,2,3,4", "himpunan pertama"],
      ["B = {3,4,5,6}", "3,4,5,6", "himpunan kedua"],
      ["A ∩ B", "3,4", "hanya yang ada di keduanya"],
    ],

    s2e1q: "Diketahui P = {kelipatan 3 dari 1–20} dan Q = {kelipatan 4 dari 1–20}. Tentukan P ∩ Q!",
    s2e1s1: "Langkah 1 — Daftar anggota:",
    s2e1pMath: "P = \\{3, 6, 9, 12, 15, 18\\}",
    s2e1qMath: "Q = \\{4, 8, 12, 16, 20\\}",
    s2e1s2: "Langkah 2 — Irisan (ada di keduanya):",
    s2e1ans: "P ∩ Q = {12}",
    s2e1note: "Hanya 12 yang merupakan kelipatan 3 sekaligus kelipatan 4.",

    s2e2q: "Survei 40 siswa: 20 minum teh setiap hari, 18 minum kopi setiap hari, dan 5 tidak minum keduanya. Berapa yang minum keduanya?",
    s2e2s1: "Langkah 1 — Yang minum setidaknya satu:",
    s2e2s2: "Langkah 2 — Gunakan rumus gabungan:",
    s2e2ans1: "n(T ∪ K) = 40 − 5 = 35",
    s2e2ans2: "n(T ∩ K) = n(T) + n(K) − n(T ∪ K) = 20 + 18 − 35 = 3 siswa",

    s2e3q: "Diketahui n(A ∪ B) = 30, n(A) = 20, n(B) = 18. Tentukan n(A ∩ B)!",
    s2e3ans: "n(A ∩ B) = n(A) + n(B) − n(A ∪ B) = 20 + 18 − 30 = 8",

    // Sub3 - Set Difference
    s3defPre: "Selisih himpunan A dan B, ditulis",
    s3defPost: "adalah himpunan anggota yang ada di A tetapi TIDAK ada di B.",
    s3formula: "📐 Definisi:",
    s3tip: "💡 Tips: A − B ≠ B − A! Selisih tidak bersifat komutatif. Himpunan pertama adalah \"induk\", yang dikurangi adalah himpunan kedua.",
    s3vennABTitle: "A − B (hanya kiri diarsir)",
    s3vennBATitle: "B − A (hanya kanan diarsir)",
    s3table: ["Ekspresi", "Anggota", "Penjelasan"],
    s3rows: [
      ["A = {1,2,3,4,5}", "1,2,3,4,5", "himpunan pertama"],
      ["B = {3,4,5,6,7}", "3,4,5,6,7", "himpunan kedua"],
      ["A − B", "1,2", "ada di A, tidak di B"],
      ["B − A", "6,7", "ada di B, tidak di A"],
    ],

    s3e1q: "Diketahui A = {huruf vokal} dan B = {a, b, c, d, e}. Tentukan A − B dan B − A!",
    s3e1s1: "A = {a, e, i, o, u},  B = {a, b, c, d, e}",
    s3e1ans1: "A − B = {i, o, u}  (vokal yang tidak ada di B)",
    s3e1ans2: "B − A = {b, c, d}  (anggota B yang bukan vokal)",

    s3e2q: "S = {1–15}, P = {kelipatan 3}, Q = {kelipatan 5}. Tentukan P − Q, Q − P, dan (P − Q) ∪ (Q − P)!",
    s3e2s1: "Langkah 1 — Daftar anggota:",
    s3e2pMath: "P = \\{3, 6, 9, 12, 15\\}",
    s3e2qMath: "Q = \\{5, 10, 15\\}",
    s3e2ans1: "P − Q = {3, 6, 9, 12}",
    s3e2ans2: "Q − P = {5, 10}",
    s3e2ans3: "(P − Q) ∪ (Q − P) = {3, 5, 6, 9, 10, 12}  ← Selisih Simetris",

    s3e3q: "Jika n(A) = 20, n(B) = 15, dan n(A ∩ B) = 8, berapa n(A − B) dan n(B − A)?",
    s3e3ans1: "n(A − B) = n(A) − n(A ∩ B) = 20 − 8 = 12",
    s3e3ans2: "n(B − A) = n(B) − n(A ∩ B) = 15 − 8 = 7",

    // Sub4 - Complement
    s4defPre: "Komplemen himpunan A, ditulis",
    s4defMid: "atau",
    s4defPost: "adalah himpunan semua anggota semesta S yang tidak ada di A.",
    s4formula: "📐 Rumus:",
    s4tip: "💡 Tips: n(A) + n(Aᶜ) = n(S). Komplemen selalu \"melengkapi\" himpunan semesta!",
    s4vennTitle: "Aᶜ (di luar A diarsir)",
    s4table: ["Notasi", "Artinya", "Contoh (S = {1..10})"],
    s4rows: [
      ["A = {2,4,6,8,10}", "bilangan genap", "n(A) = 5"],
      ["Aᶜ", "anggota S bukan di A", "{1,3,5,7,9}, n(Aᶜ) = 5"],
      ["n(A) + n(Aᶜ)", "= n(S)", "5 + 5 = 10 ✓"],
    ],

    s4e1q: "S = {1,2,...,10}, A = {bilangan prima}. Tentukan Aᶜ!",
    s4e1s1: "A = {2,3,5,7}",
    s4e1ans: "Aᶜ = {1,4,6,8,9,10}  ← anggota S yang bukan bilangan prima",

    s4e2q: "S = {huruf dalam MATEMATIKA}, B = {huruf vokal}. Tentukan Bᶜ!",
    s4e2s1: "S = {M,A,T,E,I,K} (tanpa duplikasi), B = {A,E,I}",
    s4e2ans: "Bᶜ = {M,T,K}  ← huruf konsonan dalam S",

    s4e3q: "n(S) = 50, n(A) = 30, n(B) = 25, n(A ∩ B) = 10. Tentukan n(Aᶜ), n(Bᶜ), dan n((A ∪ B)ᶜ)!",
    s4e3s1: "n(Aᶜ) = n(S) − n(A) = 50 − 30 = 20",
    s4e3s2: "n(Bᶜ) = n(S) − n(B) = 50 − 25 = 25",
    s4e3s3: "n(A ∪ B) = 30 + 25 − 10 = 45",
    s4e3ans: "n((A ∪ B)ᶜ) = n(S) − n(A ∪ B) = 50 − 45 = 5",
  },

  en: {
    title: "SET OPERATIONS ON VENN DIAGRAMS",
    subtitle: "Union · Intersection · Difference · Complement",
    breadcrumb: "Grade 7 · Sets · Mathematics",
    back: "Back to Sets",
    easy: "Easy", medium: "Medium", hard: "Hard",
    summary: "📌 Summary",
    problems: "📝 Practice Problems & Solutions",
    solution: "SOLUTION",
    step: "Step",
    example: "Example",

    sub1: "Section 1: Union — A ∪ B",
    sub2: "Section 2: Intersection — A ∩ B",
    sub3: "Section 3: Set Difference — A − B",
    sub4: "Section 4: Complement — Aᶜ",

    s1defPre: "The union of sets A and B, written",
    s1defPost: "is the set of all members in A, in B, or in both.",
    s1formula: "📐 Cardinality Formula:",
    s1tip: "💡 Tip: Key word for 'union' = 'or'. Combine everything from both containers — no duplicates!",
    s1vennTitle: "A ∪ B (both circles shaded)",
    s1table: ["Set", "Members", "Note"],
    s1rows: [
      ["A = {1,2,3,4}", "1,2,3,4", "first set"],
      ["B = {3,4,5,6}", "3,4,5,6", "second set"],
      ["A ∪ B", "1,2,3,4,5,6", "all members, no duplicates"],
    ],

    s1e1q: "Given A = {primes ≤ 10} and B = {odd numbers ≤ 10}. Find A ∪ B!",
    s1e1s1: "Step 1 — List members:",
    s1e1aMath: "A = \\{2, 3, 5, 7\\}",
    s1e1bMath: "B = \\{1, 3, 5, 7, 9\\}",
    s1e1s2: "Step 2 — Union (all, no duplicates):",
    s1e1ans: "A ∪ B = {1, 2, 3, 5, 7, 9}",
    s1e1note: "Members 3, 5, 7 appear in both — written only once.",

    s1e2q: "Of 40 students, 25 like sports (S), 20 like music (M), and 12 like both. How many are in S ∪ M and how many like neither?",
    s1e2s1: "Step 1 — Union:",
    s1e2s2: "Step 2 — Neither:",
    s1e2ans1: "n(S ∪ M) = 25 + 20 − 12 = 33 students",
    s1e2ans2: "Neither = 40 − 33 = 7 students",

    s1e3q: "Given n(A) = 15, n(B) = 12, n(A ∩ B) = 5. Find n(A ∪ B)!",
    s1e3ans: "n(A ∪ B) = 15 + 12 − 5 = 22",

    s2defPre: "The intersection of sets A and B, written",
    s2defPost: "is the set of members that are in A and also in B simultaneously.",
    s2formula: "📐 Definition:",
    s2tip: "💡 Tip: Key word for 'intersection' = 'and'. Only members found in both sets qualify!",
    s2vennTitle: "A ∩ B (center shaded)",
    s2table: ["Set", "Members", "Note"],
    s2rows: [
      ["A = {1,2,3,4}", "1,2,3,4", "first set"],
      ["B = {3,4,5,6}", "3,4,5,6", "second set"],
      ["A ∩ B", "3,4", "only those in both"],
    ],

    s2e1q: "Given P = {multiples of 3 from 1–20} and Q = {multiples of 4 from 1–20}. Find P ∩ Q!",
    s2e1s1: "Step 1 — List members:",
    s2e1pMath: "P = \\{3, 6, 9, 12, 15, 18\\}",
    s2e1qMath: "Q = \\{4, 8, 12, 16, 20\\}",
    s2e1s2: "Step 2 — Intersection (in both):",
    s2e1ans: "P ∩ Q = {12}",
    s2e1note: "Only 12 is a multiple of both 3 and 4.",

    s2e2q: "A survey of 40 students: 20 drink tea daily, 18 drink coffee daily, 5 drink neither. How many drink both?",
    s2e2s1: "Step 1 — At least one:",
    s2e2s2: "Step 2 — Use union formula:",
    s2e2ans1: "n(T ∪ C) = 40 − 5 = 35",
    s2e2ans2: "n(T ∩ C) = n(T) + n(C) − n(T ∪ C) = 20 + 18 − 35 = 3 students",

    s2e3q: "Given n(A ∪ B) = 30, n(A) = 20, n(B) = 18. Find n(A ∩ B)!",
    s2e3ans: "n(A ∩ B) = n(A) + n(B) − n(A ∪ B) = 20 + 18 − 30 = 8",

    s3defPre: "The set difference A minus B, written",
    s3defPost: "is the set of members in A that are NOT in B.",
    s3formula: "📐 Definition:",
    s3tip: "💡 Tip: A − B ≠ B − A! Set difference is not commutative. The first set is the 'base'; the second is 'subtracted'.",
    s3vennABTitle: "A − B (left only shaded)",
    s3vennBATitle: "B − A (right only shaded)",
    s3table: ["Expression", "Members", "Explanation"],
    s3rows: [
      ["A = {1,2,3,4,5}", "1,2,3,4,5", "first set"],
      ["B = {3,4,5,6,7}", "3,4,5,6,7", "second set"],
      ["A − B", "1,2", "in A, not in B"],
      ["B − A", "6,7", "in B, not in A"],
    ],

    s3e1q: "Given A = {vowels} and B = {a,b,c,d,e}. Find A − B and B − A!",
    s3e1s1: "A = {a,e,i,o,u},  B = {a,b,c,d,e}",
    s3e1ans1: "A − B = {i,o,u}  (vowels not in B)",
    s3e1ans2: "B − A = {b,c,d}  (members of B that are not vowels)",

    s3e2q: "S = {1–15}, P = {multiples of 3}, Q = {multiples of 5}. Find P−Q, Q−P, and (P−Q) ∪ (Q−P)!",
    s3e2s1: "Step 1 — List members:",
    s3e2pMath: "P = \\{3, 6, 9, 12, 15\\}",
    s3e2qMath: "Q = \\{5, 10, 15\\}",
    s3e2ans1: "P − Q = {3, 6, 9, 12}",
    s3e2ans2: "Q − P = {5, 10}",
    s3e2ans3: "(P−Q) ∪ (Q−P) = {3,5,6,9,10,12}  ← Symmetric Difference",

    s3e3q: "If n(A) = 20, n(B) = 15, and n(A ∩ B) = 8, find n(A−B) and n(B−A).",
    s3e3ans1: "n(A − B) = n(A) − n(A ∩ B) = 20 − 8 = 12",
    s3e3ans2: "n(B − A) = n(B) − n(A ∩ B) = 15 − 8 = 7",

    s4defPre: "The complement of set A, written",
    s4defMid: "or",
    s4defPost: "is the set of all members of the universal set S that are NOT in A.",
    s4formula: "📐 Formula:",
    s4tip: "💡 Tip: n(A) + n(Aᶜ) = n(S). A set and its complement always complete the universal set!",
    s4vennTitle: "Aᶜ (outside A shaded)",
    s4table: ["Notation", "Meaning", "Example (S = {1..10})"],
    s4rows: [
      ["A = {2,4,6,8,10}", "even numbers", "n(A) = 5"],
      ["Aᶜ", "members of S not in A", "{1,3,5,7,9}, n(Aᶜ) = 5"],
      ["n(A) + n(Aᶜ)", "= n(S)", "5 + 5 = 10 ✓"],
    ],

    s4e1q: "S = {1,2,...,10}, A = {prime numbers}. Find Aᶜ!",
    s4e1s1: "A = {2,3,5,7}",
    s4e1ans: "Aᶜ = {1,4,6,8,9,10}  ← members of S that are not prime",

    s4e2q: "S = {letters in MATHEMATICS}, B = {vowels}. Find Bᶜ!",
    s4e2s1: "S = {M,A,T,H,E,I,C,S} (unique), B = {A,E,I}",
    s4e2ans: "Bᶜ = {M,T,H,C,S}  ← consonants in S",

    s4e3q: "n(S) = 50, n(A) = 30, n(B) = 25, n(A ∩ B) = 10. Find n(Aᶜ), n(Bᶜ), and n((A ∪ B)ᶜ)!",
    s4e3s1: "n(Aᶜ) = n(S) − n(A) = 50 − 30 = 20",
    s4e3s2: "n(Bᶜ) = n(S) − n(B) = 50 − 25 = 25",
    s4e3s3: "n(A ∪ B) = 30 + 25 − 10 = 45",
    s4e3ans: "n((A ∪ B)ᶜ) = n(S) − n(A ∪ B) = 50 − 45 = 5",
  },

  ja: {
    title: "ベン図上の集合の演算",
    subtitle: "和集合 · 共通部分 · 差集合 · 補集合",
    breadcrumb: "中学1年 · 集合 · 数学教材",
    back: "集合に戻る",
    easy: "基本", medium: "標準", hard: "発展",
    summary: "📌 まとめ",
    problems: "📝 練習問題と解説",
    solution: "解説",
    step: "ステップ",
    example: "例題",

    sub1: "第1節：和集合 — A ∪ B",
    sub2: "第2節：共通部分 — A ∩ B",
    sub3: "第3節：差集合 — A − B",
    sub4: "第4節：補集合 — Aᶜ",

    s1defPre: "AとBの和集合を",
    s1defPost: "と書き、A、B、またはその両方に属するすべての要素の集合です。",
    s1formula: "📐 濃度の公式：",
    s1tip: "💡 コツ：「和集合」のキーワード = 「または」。2つの容器の中身を重複なしに一つにまとめます！",
    s1vennTitle: "A ∪ B（両方の円が塗られている）",
    s1table: ["集合", "要素", "説明"],
    s1rows: [
      ["A = {1,2,3,4}", "1,2,3,4", "第一の集合"],
      ["B = {3,4,5,6}", "3,4,5,6", "第二の集合"],
      ["A ∪ B", "1,2,3,4,5,6", "すべての要素、重複なし"],
    ],

    s1e1q: "A = {10以下の素数}、B = {10以下の奇数}。A ∪ B を求めなさい！",
    s1e1s1: "ステップ1 — 要素を列挙：",
    s1e1aMath: "A = \\{2, 3, 5, 7\\}",
    s1e1bMath: "B = \\{1, 3, 5, 7, 9\\}",
    s1e1s2: "ステップ2 — 和集合（重複なし）：",
    s1e1ans: "A ∪ B = {1, 2, 3, 5, 7, 9}",
    s1e1note: "3、5、7は両方に属するが、一度だけ書く。",

    s1e2q: "40人の生徒のうち、25人がスポーツ好き、20人が音楽好き、12人が両方好き。n(S ∪ M) とどちらも好きでない人数を求めなさい。",
    s1e2s1: "ステップ1 — 和集合：",
    s1e2s2: "ステップ2 — どちらも好きでない人：",
    s1e2ans1: "n(S ∪ M) = 25 + 20 − 12 = 33人",
    s1e2ans2: "どちらも好きでない = 40 − 33 = 7人",

    s1e3q: "n(A) = 15、n(B) = 12、n(A ∩ B) = 5 のとき、n(A ∪ B) を求めなさい！",
    s1e3ans: "n(A ∪ B) = 15 + 12 − 5 = 22",

    s2defPre: "AとBの共通部分を",
    s2defPost: "と書き、AとBの両方に同時に属する要素の集合です。",
    s2formula: "📐 定義：",
    s2tip: "💡 コツ：「共通部分」のキーワード = 「かつ」。両方の集合に同時に属する要素だけが入ります！",
    s2vennTitle: "A ∩ B（中央が塗られている）",
    s2table: ["集合", "要素", "説明"],
    s2rows: [
      ["A = {1,2,3,4}", "1,2,3,4", "第一の集合"],
      ["B = {3,4,5,6}", "3,4,5,6", "第二の集合"],
      ["A ∩ B", "3,4", "両方に属するもののみ"],
    ],

    s2e1q: "P = {1〜20の3の倍数}、Q = {1〜20の4の倍数}。P ∩ Q を求めなさい！",
    s2e1s1: "ステップ1 — 要素を列挙：",
    s2e1pMath: "P = \\{3, 6, 9, 12, 15, 18\\}",
    s2e1qMath: "Q = \\{4, 8, 12, 16, 20\\}",
    s2e1s2: "ステップ2 — 共通部分（両方にある要素）：",
    s2e1ans: "P ∩ Q = {12}",
    s2e1note: "3の倍数かつ4の倍数は12だけ。",

    s2e2q: "40人への調査：20人が毎日お茶、18人が毎日コーヒー、5人がどちらも飲まない。両方飲む人数を求めなさい。",
    s2e2s1: "ステップ1 — 少なくとも一方：",
    s2e2s2: "ステップ2 — 和集合の公式を使う：",
    s2e2ans1: "n(T ∪ C) = 40 − 5 = 35",
    s2e2ans2: "n(T ∩ C) = 20 + 18 − 35 = 3人",

    s2e3q: "n(A ∪ B) = 30、n(A) = 20、n(B) = 18 のとき、n(A ∩ B) を求めなさい！",
    s2e3ans: "n(A ∩ B) = 20 + 18 − 30 = 8",

    s3defPre: "差集合 A マイナス B を",
    s3defPost: "と書き、Aに属するがBには属さない要素の集合です。",
    s3formula: "📐 定義：",
    s3tip: "💡 コツ：A − B ≠ B − A！差集合は可換ではありません。最初の集合が「ベース」です。",
    s3vennABTitle: "A − B（左のみ塗られている）",
    s3vennBATitle: "B − A（右のみ塗られている）",
    s3table: ["式", "要素", "説明"],
    s3rows: [
      ["A = {1,2,3,4,5}", "1,2,3,4,5", "第一の集合"],
      ["B = {3,4,5,6,7}", "3,4,5,6,7", "第二の集合"],
      ["A − B", "1,2", "AにあってBにない"],
      ["B − A", "6,7", "BにあってAにない"],
    ],

    s3e1q: "A = {母音}、B = {a,b,c,d,e}。A − B と B − A を求めなさい！",
    s3e1s1: "A = {a,e,i,o,u}、B = {a,b,c,d,e}",
    s3e1ans1: "A − B = {i,o,u}（Bにない母音）",
    s3e1ans2: "B − A = {b,c,d}（母音でないBの要素）",

    s3e2q: "S = {1〜15}、P = {3の倍数}、Q = {5の倍数}。P−Q、Q−P、(P−Q) ∪ (Q−P) を求めなさい！",
    s3e2s1: "ステップ1 — 要素を列挙：",
    s3e2pMath: "P = \\{3, 6, 9, 12, 15\\}",
    s3e2qMath: "Q = \\{5, 10, 15\\}",
    s3e2ans1: "P − Q = {3, 6, 9, 12}",
    s3e2ans2: "Q − P = {5, 10}",
    s3e2ans3: "(P−Q) ∪ (Q−P) = {3,5,6,9,10,12}  ← 対称差",

    s3e3q: "n(A) = 20、n(B) = 15、n(A ∩ B) = 8 のとき、n(A−B) と n(B−A) を求めなさい。",
    s3e3ans1: "n(A − B) = 20 − 8 = 12",
    s3e3ans2: "n(B − A) = 15 − 8 = 7",

    s4defPre: "集合Aの補集合を",
    s4defMid: "または",
    s4defPost: "と書き、全体集合Sのうち、Aに属さないすべての要素の集合です。",
    s4formula: "📐 公式：",
    s4tip: "💡 コツ：n(A) + n(Aᶜ) = n(S)。集合とその補集合は常に全体集合を完成させます！",
    s4vennTitle: "Aᶜ（Aの外側が塗られている）",
    s4table: ["記法", "意味", "例（S = {1..10}）"],
    s4rows: [
      ["A = {2,4,6,8,10}", "偶数", "n(A) = 5"],
      ["Aᶜ", "SのうちAにない要素", "{1,3,5,7,9}、n(Aᶜ) = 5"],
      ["n(A) + n(Aᶜ)", "= n(S)", "5 + 5 = 10 ✓"],
    ],

    s4e1q: "S = {1,2,...,10}、A = {素数}。Aᶜ を求めなさい！",
    s4e1s1: "A = {2,3,5,7}",
    s4e1ans: "Aᶜ = {1,4,6,8,9,10}  ← 素数でないSの要素",

    s4e2q: "S = {MATEMATIKAという語の文字}、B = {母音}。Bᶜ を求めなさい！",
    s4e2s1: "S = {M,A,T,E,I,K}（重複なし）、B = {A,E,I}",
    s4e2ans: "Bᶜ = {M,T,K}  ← Sの子音",

    s4e3q: "n(S)=50、n(A)=30、n(B)=25、n(A∩B)=10。n(Aᶜ)、n(Bᶜ)、n((A∪B)ᶜ) を求めなさい！",
    s4e3s1: "n(Aᶜ) = 50 − 30 = 20",
    s4e3s2: "n(Bᶜ) = 50 − 25 = 25",
    s4e3s3: "n(A ∪ B) = 30 + 25 − 10 = 45",
    s4e3ans: "n((A∪B)ᶜ) = 50 − 45 = 5",
  },
};

/* ══════════════════════════════════════════════════════════
   SVG VENN COMPONENTS
══════════════════════════════════════════════════════════ */
type T = typeof translations.id;

const shadeColor = "rgba(250,204,21,0.30)";

const VennSvg = ({
  title,
  shadeLeft = false,
  shadeRight = false,
  shadeCenter = false,
  shadeOuter = false,
}: {
  title: string;
  shadeLeft?: boolean;
  shadeRight?: boolean;
  shadeCenter?: boolean;
  shadeOuter?: boolean;
}) => (
  <div className="flex flex-col items-center gap-1">
    <p className="text-xs font-mono text-yellow-300 text-center">{title}</p>
    <svg viewBox="0 0 260 150" className="w-full max-w-[220px] theme-venn-box">
      <rect x="4" y="4" width="252" height="142" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
      <text x="240" y="18" fontSize="11" fill="#64748b" fontFamily="monospace">S</text>
      {shadeOuter && <rect x="4" y="4" width="252" height="142" rx="8" fill="rgba(250,204,21,0.18)" />}
      {shadeLeft && <circle cx="100" cy="75" r="48" fill={shadeColor} />}
      {shadeRight && <circle cx="160" cy="75" r="48" fill={shadeColor} />}
      <circle cx="100" cy="75" r="48" fill="none" stroke="#38bdf8" strokeWidth="2" />
      <circle cx="160" cy="75" r="48" fill="none" stroke="#818cf8" strokeWidth="2" />
      {shadeCenter && !shadeLeft && !shadeRight && (
        <path d="M130,43 a48,48 0 0,1 0,64 a48,48 0 0,1 0,-64 Z" fill={shadeColor} />
      )}
      {(shadeLeft || shadeRight) && !shadeCenter && (
        <path d="M130,43 a48,48 0 0,1 0,64 a48,48 0 0,1 0,-64 Z" fill="#0f172a" stroke="none" />
      )}
      {shadeOuter && (
        <>
          <circle cx="100" cy="75" r="48" fill="#0f172a" opacity="0.7" />
          <circle cx="160" cy="75" r="48" fill="#0f172a" opacity="0.7" />
        </>
      )}
      <text x="84" y="72" textAnchor="middle" fontSize="12" fill="#bae6fd" fontFamily="monospace" fontWeight="bold">A</text>
      <text x="176" y="72" textAnchor="middle" fontSize="12" fill="#c7d2fe" fontFamily="monospace" fontWeight="bold">B</text>
    </svg>
  </div>
);

const VennComplement = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center gap-1">
    <p className="text-xs font-mono text-yellow-300 text-center">{title}</p>
    <svg viewBox="0 0 220 140" className="w-full max-w-[200px] theme-venn-box">
      <rect x="4" y="4" width="212" height="132" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
      <rect x="4" y="4" width="212" height="132" rx="8" fill="rgba(250,204,21,0.22)" />
      <text x="200" y="18" fontSize="11" fill="#64748b" fontFamily="monospace">S</text>
      <circle cx="110" cy="70" r="45" fill="#0f172a" />
      <circle cx="110" cy="70" r="45" fill="none" stroke="#38bdf8" strokeWidth="2" />
      <text x="110" y="74" textAnchor="middle" fontSize="13" fill="#bae6fd" fontFamily="monospace" fontWeight="bold">A</text>
      <text x="30" y="30" fontSize="10" fill="#fde68a" fontFamily="monospace">Aᶜ</text>
    </svg>
  </div>
);

/* ══════════════════════════════════════════════════════════
   TABLE COMPONENT
══════════════════════════════════════════════════════════ */
const InfoTable = ({ head, rows }: { head: string[]; rows: string[][] }) => (
  <div className="overflow-x-auto rounded-lg border border-border">
    <table className="w-full text-sm font-body">
      <thead>
        <tr className="bg-primary/20">
          {head.map((h, i) => (
            <th key={i} className="px-3 py-2 text-left text-primary font-semibold text-xs">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
            {row.map((cell, j) => (
              <td key={j} className="px-3 py-2 text-white/80 text-xs font-mono">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ══════════════════════════════════════════════════════════
   ANSWER BOX
══════════════════════════════════════════════════════════ */
const AnsBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 font-mono text-yellow-300 text-sm">
    {children}
  </div>
);

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
const OperasiHimpunanPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = language as "id" | "en" | "ja";
  const t = translations[lang];

  const [expanded, setExpanded] = useState<string[]>(["union", "intersection", "difference", "complement"]);
  const toggle = (s: string) => {
    playPopSound();
    setExpanded((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  };

  const SH = ({ id, label, color }: { id: string; label: string; color: string }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <Combine className={`w-5 h-5 ${color}`} />
        <span className="font-body font-semibold text-white">{label}</span>
      </div>
      {expanded.includes(id)
        ? <ChevronUp className="w-5 h-5 text-primary" />
        : <ChevronDown className="w-5 h-5 text-primary" />}
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
        <Combine className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-base md:text-lg font-bold text-primary text-glow-cyan mb-2 text-center leading-snug">{t.title}</h1>
        <p className="text-white/50 text-xs text-center mb-1 font-body">{t.subtitle}</p>
        <p className="text-white/40 text-xs text-center mb-6 font-body">{t.breadcrumb}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── SUB-BAB 1: UNION ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="union" label={t.sub1} color="text-sky-400" />
            {expanded.includes("union") && (
              <div className="px-5 pb-5 space-y-5">
                {/* Summary */}
                <div className="bg-sky-500/10 border border-sky-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-sky-300">{t.summary}</p>
                  <p className="text-white/80 text-sm font-body">
                    {t.s1defPre} <InlineMath math="A \cup B" /> {t.s1defPost}
                  </p>
                  <p className="text-white/60 text-xs font-body">{t.s1formula}</p>
                  <div className="bg-sky-900/30 rounded-lg p-3 text-center">
                    <BlockMath math="n(A \cup B) = n(A) + n(B) - n(A \cap B)" />
                  </div>
                  <p className="text-white/60 text-xs italic font-body">{t.s1tip}</p>
                  <div className="flex justify-center">
                    <VennSvg title={t.s1vennTitle} shadeLeft shadeRight shadeCenter />
                  </div>
                  <InfoTable head={t.s1table} rows={t.s1rows} />
                </div>

                {/* Example Problems */}
                <p className="font-body text-sm font-semibold text-sky-300">{t.problems}</p>

                {/* E1 */}
                <div className="bg-slate-800/60 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">{easyBadge}<span className="text-white font-body text-sm">{t.s1e1q}</span></div>
                  <div className="bg-slate-900/60 rounded p-3 space-y-2">
                    <p className="text-white/60 text-xs font-body">{t.s1e1s1}</p>
                    <BlockMath math={t.s1e1aMath} />
                    <BlockMath math={t.s1e1bMath} />
                    <p className="text-white/60 text-xs font-body">{t.s1e1s2}</p>
                    <AnsBox>{t.s1e1ans}</AnsBox>
                    <p className="text-white/50 text-xs font-body italic">{t.s1e1note}</p>
                  </div>
                </div>

                {/* E2 */}
                <div className="bg-slate-800/60 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="text-white font-body text-sm">{t.s1e2q}</span></div>
                  <div className="bg-slate-900/60 rounded p-3 space-y-2">
                    <p className="text-white/60 text-xs font-body">{t.s1e2s1}</p>
                    <AnsBox>{t.s1e2ans1}</AnsBox>
                    <p className="text-white/60 text-xs font-body">{t.s1e2s2}</p>
                    <AnsBox>{t.s1e2ans2}</AnsBox>
                  </div>
                </div>

                {/* E3 */}
                <div className="bg-slate-800/60 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">{hardBadge}<span className="text-white font-body text-sm">{t.s1e3q}</span></div>
                  <AnsBox>{t.s1e3ans}</AnsBox>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 2: INTERSECTION ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="intersection" label={t.sub2} color="text-indigo-400" />
            {expanded.includes("intersection") && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-indigo-300">{t.summary}</p>
                  <p className="text-white/80 text-sm font-body">
                    {t.s2defPre} <InlineMath math="A \cap B" /> {t.s2defPost}
                  </p>
                  <p className="text-white/60 text-xs font-body">{t.s2formula}</p>
                  <div className="bg-indigo-900/30 rounded-lg p-3 text-center">
                    <BlockMath math="A \cap B = \{x \mid x \in A \text{ dan } x \in B\}" />
                  </div>
                  <p className="text-white/60 text-xs italic font-body">{t.s2tip}</p>
                  <div className="flex justify-center">
                    <VennSvg title={t.s2vennTitle} shadeCenter />
                  </div>
                  <InfoTable head={t.s2table} rows={t.s2rows} />
                </div>

                <p className="font-body text-sm font-semibold text-indigo-300">{t.problems}</p>

                <div className="bg-slate-800/60 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">{easyBadge}<span className="text-white font-body text-sm">{t.s2e1q}</span></div>
                  <div className="bg-slate-900/60 rounded p-3 space-y-2">
                    <p className="text-white/60 text-xs font-body">{t.s2e1s1}</p>
                    <BlockMath math={t.s2e1pMath} />
                    <BlockMath math={t.s2e1qMath} />
                    <p className="text-white/60 text-xs font-body">{t.s2e1s2}</p>
                    <AnsBox>{t.s2e1ans}</AnsBox>
                    <p className="text-white/50 text-xs font-body italic">{t.s2e1note}</p>
                  </div>
                </div>

                <div className="bg-slate-800/60 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="text-white font-body text-sm">{t.s2e2q}</span></div>
                  <div className="bg-slate-900/60 rounded p-3 space-y-2">
                    <p className="text-white/60 text-xs font-body">{t.s2e2s1}</p>
                    <AnsBox>{t.s2e2ans1}</AnsBox>
                    <p className="text-white/60 text-xs font-body">{t.s2e2s2}</p>
                    <AnsBox>{t.s2e2ans2}</AnsBox>
                  </div>
                </div>

                <div className="bg-slate-800/60 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">{hardBadge}<span className="text-white font-body text-sm">{t.s2e3q}</span></div>
                  <AnsBox>{t.s2e3ans}</AnsBox>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 3: SET DIFFERENCE ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="difference" label={t.sub3} color="text-amber-400" />
            {expanded.includes("difference") && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-amber-300">{t.summary}</p>
                  <p className="text-white/80 text-sm font-body">
                    {t.s3defPre} <InlineMath math="A - B" /> {t.s3defPost}
                  </p>
                  <p className="text-white/60 text-xs font-body">{t.s3formula}</p>
                  <div className="bg-amber-900/30 rounded-lg p-3 text-center">
                    <BlockMath math="A - B = \{x \mid x \in A \text{ dan } x \notin B\}" />
                  </div>
                  <p className="text-white/60 text-xs italic font-body">{t.s3tip}</p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <VennSvg title={t.s3vennABTitle} shadeLeft />
                    <VennSvg title={t.s3vennBATitle} shadeRight />
                  </div>
                  <InfoTable head={t.s3table} rows={t.s3rows} />
                </div>

                <p className="font-body text-sm font-semibold text-amber-300">{t.problems}</p>

                <div className="bg-slate-800/60 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">{easyBadge}<span className="text-white font-body text-sm">{t.s3e1q}</span></div>
                  <div className="bg-slate-900/60 rounded p-3 space-y-2">
                    <p className="text-white/60 text-xs font-mono">{t.s3e1s1}</p>
                    <AnsBox>{t.s3e1ans1}</AnsBox>
                    <AnsBox>{t.s3e1ans2}</AnsBox>
                  </div>
                </div>

                <div className="bg-slate-800/60 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="text-white font-body text-sm">{t.s3e2q}</span></div>
                  <div className="bg-slate-900/60 rounded p-3 space-y-2">
                    <p className="text-white/60 text-xs font-body">{t.s3e2s1}</p>
                    <BlockMath math={t.s3e2pMath} />
                    <BlockMath math={t.s3e2qMath} />
                    <AnsBox>{t.s3e2ans1}</AnsBox>
                    <AnsBox>{t.s3e2ans2}</AnsBox>
                    <AnsBox>{t.s3e2ans3}</AnsBox>
                  </div>
                </div>

                <div className="bg-slate-800/60 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">{hardBadge}<span className="text-white font-body text-sm">{t.s3e3q}</span></div>
                  <AnsBox>{t.s3e3ans1}</AnsBox>
                  <AnsBox>{t.s3e3ans2}</AnsBox>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 4: COMPLEMENT ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="complement" label={t.sub4} color="text-rose-400" />
            {expanded.includes("complement") && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-rose-300">{t.summary}</p>
                  <p className="text-white/80 text-sm font-body">
                    {t.s4defPre} <InlineMath math="A^c" /> {t.s4defMid} <InlineMath math="\overline{A}" /> {t.s4defPost}
                  </p>
                  <p className="text-white/60 text-xs font-body">{t.s4formula}</p>
                  <div className="bg-rose-900/30 rounded-lg p-3 text-center">
                    <BlockMath math="n(A^c) = n(S) - n(A)" />
                  </div>
                  <p className="text-white/60 text-xs italic font-body">{t.s4tip}</p>
                  <div className="flex justify-center">
                    <VennComplement title={t.s4vennTitle} />
                  </div>
                  <InfoTable head={t.s4table} rows={t.s4rows} />
                </div>

                <p className="font-body text-sm font-semibold text-rose-300">{t.problems}</p>

                <div className="bg-slate-800/60 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">{easyBadge}<span className="text-white font-body text-sm">{t.s4e1q}</span></div>
                  <div className="bg-slate-900/60 rounded p-3 space-y-2">
                    <p className="text-white/60 text-xs font-mono">{t.s4e1s1}</p>
                    <AnsBox>{t.s4e1ans}</AnsBox>
                  </div>
                </div>

                <div className="bg-slate-800/60 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="text-white font-body text-sm">{t.s4e2q}</span></div>
                  <div className="bg-slate-900/60 rounded p-3 space-y-2">
                    <p className="text-white/60 text-xs font-mono">{t.s4e2s1}</p>
                    <AnsBox>{t.s4e2ans}</AnsBox>
                  </div>
                </div>

                <div className="bg-slate-800/60 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">{hardBadge}<span className="text-white font-body text-sm">{t.s4e3q}</span></div>
                  <div className="bg-slate-900/60 rounded p-3 space-y-2">
                    <p className="text-white/60 text-xs font-mono">{t.s4e3s1}</p>
                    <p className="text-white/60 text-xs font-mono">{t.s4e3s2}</p>
                    <p className="text-white/60 text-xs font-mono">{t.s4e3s3}</p>
                    <AnsBox>{t.s4e3ans}</AnsBox>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Back button */}
        <button
          onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-7/himpunan"); }}
          className="mt-8 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-body text-sm"
        >
          <BookOpen className="w-4 h-4" />
          {t.back}
        </button>
      </div>
    </div>
  );
};

export default OperasiHimpunanPage;
