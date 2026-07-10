import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import {
  BookOpen, ChevronDown, ChevronUp,
  Archive, Infinity, Layers, Globe, Braces,
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ══════════════════════════════════════════════════════════
   TRANSLATIONS
══════════════════════════════════════════════════════════ */
const translations = {
  id: {
    title: "HIMPUNAN BERHINGGA, KOSONG, TAK HINGGA, BAGIAN, SEMESTA DAN KUASA",
    subtitle: "Jenis-Jenis Himpunan Lengkap",
    breadcrumb: "Kelas 7 · Himpunan · Materi Matematika",
    back: "Kembali ke Himpunan",
    easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
    summary: "📌 Ringkasan Intisari",
    problems: "📝 Contoh Soal & Pembahasan",
    solution: "PEMBAHASAN",
    example: "Contoh",
    step: "Langkah",
    known: "Diketahui",
    type: "Jenis",
    reason: "Alasan",
    verify: "Verifikasi",

    sub1: "Sub-Bab 1: Himpunan Berhingga & Himpunan Kosong",
    sub2: "Sub-Bab 2: Himpunan Tak Hingga",
    sub3: "Sub-Bab 3: Himpunan Bagian (Subset)",
    sub4: "Sub-Bab 4: Himpunan Semesta",
    sub5: "Sub-Bab 5: Himpunan Kuasa (Power Set)",

    // Sub1 - Berhingga & Kosong
    s1finDef: "Himpunan Berhingga",
    s1finDefText: "adalah himpunan yang memiliki anggota dengan jumlah yang tertentu dan bisa dihitung habis. Kardinalitasnya adalah bilangan cacah:",
    s1emptyDef: "Himpunan Kosong",
    s1emptyDefText: "adalah himpunan yang tidak memiliki anggota sama sekali. Ditulis",
    s1emptyOr: "atau",
    s1emptyCard: "dengan kardinalitas",
    s1emptyWarn: "⚠️ Perhatian:",
    s1emptyWarnText: "adalah himpunan yang berisi angka nol — ini bukan himpunan kosong! Himpunan kosong benar-benar tidak memiliki anggota apapun.",
    s1tip: "💡 Tips: Cara mudah membedakan — jika kamu bisa mendaftarkan semua anggotanya dan berhenti → berhingga. Jika daftarnya kosong (tidak ada yang bisa ditulis) → kosong!",
    s1table: ["Jenis", "Notasi", "n(A)", "Contoh"],
    s1rows: [
      ["Berhingga", "A = {1,2,3}", "3", "{hari kerja} = {Senin,...,Jumat}"],
      ["Kosong", "∅ atau {}", "0", "{bilangan prima genap > 2}"],
    ],

    s1e1q: "Tentukan jenis himpunan (berhingga atau kosong) dari himpunan-himpunan berikut dan berikan alasanmu!",
    s1e1aTitle: "a. A = {x | x bilangan bulat, 5 < x < 6}",
    s1e1bTitle: "b. B = {x | x bilangan asli, x < 100}",
    s1e1cTitle: "c. C = {x | x² = -9, x ∈ ℝ}",
    s1e1aType: "Himpunan Kosong", s1e1aReason: "Tidak ada bilangan bulat antara 5 dan 6 (eksklusif). Maka A = ∅.",
    s1e1bType: "Himpunan Berhingga", s1e1bReason: "Bilangan asli kurang dari 100: 1, 2, 3, ..., 99. Ada 99 anggota, jadi berhingga.",
    s1e1cType: "Himpunan Kosong", s1e1cReason: "Kuadrat bilangan real selalu ≥ 0, jadi tidak ada solusi untuk x² = −9. Maka C = ∅.",

    s1e2q: "Tentukan nilai n(A) untuk setiap himpunan berikut:",
    s1e2aMath: "A = \\{\\text{merah, kuning, hijau}\\}",
    s1e2bMath: "B = \\{\\text{Senin, Rabu, Jumat}\\}",
    s1e2cMath: "C = \\{x \\mid x \\in \\mathbb{N},\\ 10 < x < 20\\}",
    s1e2dMath: "D = \\{x \\mid x^2 = 4,\\ x \\in \\mathbb{Z}\\}",
    s1e2a: "a. Merah, kuning, hijau → 3 anggota",
    s1e2b: "b. Senin, Rabu, Jumat → 3 anggota",
    s1e2c: "c. Bilangan asli antara 10 dan 20 (eksklusif): 11,12,...,19 → 9 anggota",
    s1e2d: "d. Bilangan bulat dengan kuadrat = 4: x = 2 atau x = −2 → 2 anggota",
    s1e2ans: ["n(A) = 3", "n(B) = 3", "n(C) = 9", "n(D) = 2"],

    s1e3q: "Tentukan apakah pernyataan berikut BENAR atau SALAH, dan jelaskan!",
    s1e3opts: [
      "{0} = ∅",
      "Himpunan bilangan prima di antara 14 dan 16 adalah himpunan kosong",
      "n(∅) = 0",
      "Himpunan {∅} adalah himpunan kosong",
    ],
    s1e3a: "SALAH. {0} berisi angka nol sebagai anggota, sedangkan ∅ tidak memiliki anggota. {0} ≠ ∅",
    s1e3b: "BENAR. Bilangan prima antara 14 dan 16 → tidak ada (15 = 3×5, bukan prima).",
    s1e3c: "BENAR. Himpunan kosong memang tidak punya anggota, sehingga kardinalitasnya = 0.",
    s1e3d: "SALAH. {∅} adalah himpunan yang berisi satu anggota (yaitu himpunan kosong itu sendiri). n({∅}) = 1.",

    // Sub2 - Tak Hingga
    s2def: "adalah himpunan yang memiliki anggota yang tidak terbatas jumlahnya. Saat didaftar, selalu menggunakan tanda",
    s2defEnd: "untuk menunjukkan pola yang berlanjut tanpa akhir.",
    s2examples: ["Himpunan bilangan asli: ℕ = {1, 2, 3, 4, ...}", "Himpunan bilangan bulat: ℤ = {..., −2, −1, 0, 1, 2, ...}", "Himpunan bilangan genap positif: {2, 4, 6, 8, ...}", "Himpunan bilangan prima: {2, 3, 5, 7, 11, 13, ...}"],
    s2tip: "💡 Tips: Bagaimana membedakan himpunan tak hingga dari yang berhingga? Tanyakan: 'Apakah ada anggota terbesar?' Jika tidak ada → tak hingga!",
    s2infOrFin: [
      ["Himpunan bilangan asli ganjil", "TAK HINGGA", "Tidak ada bilangan ganjil terbesar"],
      ["Himpunan bilangan prima ≤ 100", "BERHINGGA", "Ada batas atas (100), anggota bisa dihitung"],
      ["Himpunan kelipatan 3 negatif", "TAK HINGGA", "Tidak ada kelipatan 3 negatif terkecil"],
    ],

    s2e1q: "Tentukan apakah himpunan berikut berhingga atau tak hingga:",
    s2e1opts: [
      "K = {x | x bilangan asli, x habis dibagi 4}",
      "L = {x | x bilangan bulat, -1000 ≤ x ≤ 1000}",
      "M = {x | x² < 100, x ∈ ℕ}",
    ],
    s2e1a: "K = kelipatan 4 positif = {4, 8, 12, ...} → tidak ada batas atas.",
    s2e1aType: "Tak Hingga",
    s2e1b: "L = bilangan bulat dari -1000 sampai 1000 → ada batas, bisa dihitung (2001 anggota).",
    s2e1bType: "Berhingga, n(L) = 2001",
    s2e1c: "M: Cari bilangan asli dengan x² < 100 → x < 10 → x ∈ {1,2,3,...,9}.",
    s2e1cType: "Berhingga, n(M) = 9",

    s2e2q: "Himpunan P = {x | x bilangan prima}. Himpunan Q = {x | x bilangan prima, x < 20}. Bandingkan P dan Q!",
    s2e2pType: "P: Tak Hingga",
    s2e2pReason: "Ada tak hingga banyaknya bilangan prima (dibuktikan Euclid ~300 SM).",
    s2e2qType: "Q: Berhingga",
    s2e2qReason: "Ada batas x < 20.",
    s2e2qMembers: "Anggota Q: {2, 3, 5, 7, 11, 13, 17, 19} → n(Q) = 8.",
    s2e2note: "Meski keduanya berisi bilangan prima, P tak hingga dan Q berhingga karena Q punya batas atas!",

    s2e3q: "Diketahui himpunan G = {x | x bilangan bulat, x habis dibagi 3 atau habis dibagi 5}. Tentukan apakah G berhingga atau tak hingga, dan sebutkan 5 anggota G!",
    s2e3katex: "G = \\{x \\in \\mathbb{Z} \\mid x \\text{ habis dibagi 3 atau habis dibagi 5}\\}",
    s2e3type: "Tak Hingga",
    s2e3reason: "Bilangan bulat yang habis dibagi 3 atau 5 tidak memiliki batas atas maupun batas bawah.",
    s2e3positive: "Contoh anggota positif:",
    s2e3negative: "Contoh anggota negatif:",
    s2e3members5: "Lima contoh anggota G:",

    // Sub3 - Subset
    s3def: "Himpunan A disebut",
    s3defBold: "himpunan bagian (subset)",
    s3def2: "dari himpunan B, ditulis",
    s3def3: "jika dan hanya jika setiap anggota A juga merupakan anggota B.",
    s3defFormal: "📌 Definisi Formal:",
    s3defFormalText: "jika untuk setiap",
    s3defFormalText2: "berlaku",
    s3notSubset: "A BUKAN himpunan bagian dari B ditulis",
    s3notSubsetText: "jika ada setidaknya satu anggota A yang tidak ada di B.",
    s3prop: "Sifat-Sifat Penting:",
    s3props: [
      "Setiap himpunan adalah himpunan bagian dari dirinya sendiri: A ⊆ A",
      "Himpunan kosong adalah himpunan bagian dari semua himpunan: ∅ ⊆ A",
      "Jika A ⊆ B dan B ⊆ A, maka A = B",
      "Jika A ⊆ B dan B ⊆ C, maka A ⊆ C (transitif)",
    ],
    s3tip: "💡 Tips: Kata kunci — A ⊆ B berarti 'semua anggota A pasti ada di B'. Untuk membuktikan A ⊆ B, periksa SEMUA anggota A satu per satu. Jika ada satu saja yang tidak ada di B → A ⊄ B!",
    s3proper: "Himpunan Bagian Sejati (Proper Subset):",
    s3properText: "A ⊂ B berarti A ⊆ B DAN A ≠ B. Dengan kata lain, A adalah himpunan bagian dari B, tetapi B memiliki anggota yang tidak ada di A.",

    s3e1q: "Tentukan mana yang merupakan himpunan bagian dari mana:",
    s3e1opts: ["A = {1, 2, 3} dan B = {1, 2, 3, 4, 5}", "C = {a, b, c} dan D = {a, c, e}", "E = {2, 4, 6} dan F = {1, 2, 3, 4, 5, 6}"],
    s3e1aRes: "A ⊆ B (semua anggota A ada di B). A ⊂ B (sejati, karena B punya anggota 4 dan 5 yang tidak di A).",
    s3e1bRes: "C ⊄ D. \"b\" ada di C tapi tidak di D. D ⊄ C. \"e\" ada di D tapi tidak di C.",
    s3e1cRes: "E ⊆ F (2, 4, 6 semuanya ada di F). E ⊂ F (sejati).",

    s3e2q: "Tentukan SEMUA himpunan bagian dari himpunan A = {p, q, r}!",
    s3e2hint: "Petunjuk: Himpunan dengan 3 anggota memiliki 2³ = 8 himpunan bagian.",
    s3e2org: "Organisasi berdasarkan banyak anggota:",
    s3e2noMem: "0 anggota:", s3e2oneMem: "1 anggota:", s3e2twoMem: "2 anggota:", s3e2threeMem: "3 anggota:",
    s3e2total: "Total: 8 himpunan bagian ✓",

    s3e3q: "Diberikan himpunan S = {1, 2, 3, 4}. Tentukan:",
    s3e3opts: ["Berapa banyak himpunan bagian S?", "Berapa banyak himpunan bagian sejati S?", "Berapa himpunan bagian S yang memiliki tepat 2 anggota?"],
    s3e3aAns: "n(𝒫(S)) = 2⁴ = 16 himpunan bagian.",
    s3e3bAns: "Himpunan bagian sejati = semua kecuali S sendiri = 16 − 1 = 15.",
    s3e3cAns: "Pilih 2 dari 4: C(4,2) = 4!/(2!·2!) = 6 himpunan bagian.",
    s3e3cList: "{1,2}, {1,3}, {1,4}, {2,3}, {2,4}, {3,4}",

    // Sub4 - Semesta
    s4def: "adalah himpunan yang memuat semua objek yang sedang dibicarakan dalam suatu konteks tertentu. Dilambangkan dengan",
    s4def2: "dan digambarkan sebagai persegi panjang dalam Diagram Venn.",
    s4note: "⚠️ Penting: Himpunan semesta tergantung konteks! Jika kita berbicara tentang bilangan bulat, S = ℤ. Jika kita berbicara tentang huruf alfabet, S = {a, b, c, ..., z}.",
    s4examples: ["Konteks bilangan bulat: S = ℤ = {..., −2, −1, 0, 1, 2, ...}", "Konteks bilangan asli ≤ 10: S = {1,2,3,...,10}", "Konteks huruf alfabet: S = {a,b,c,...,z}"],
    s4tip: "💡 Tips: Himpunan semesta menentukan \"dunia\" dari masalah yang kamu kerjakan. Selalu baca soal dengan cermat untuk menentukan himpunan semesta yang tepat!",

    s4e1q: "Tentukan himpunan semesta yang tepat untuk setiap situasi berikut:",
    s4e1opts: [
      "P = {2, 4, 6, 8, 10} adalah himpunan bilangan genap positif ≤ 10",
      "Q = {merah, biru, kuning} dalam diskusi tentang warna primer",
      "R = {1, 4, 9, 16, 25} adalah himpunan bilangan kuadrat sempurna",
    ],
    s4e1aAns: "S = {1,2,3,...,10} atau S = {bilangan asli ≤ 10}. P adalah himpunan bilangan genap dalam S.",
    s4e1bAns: "S = {merah, jingga, kuning, hijau, biru, nila, ungu} (semua warna), atau bisa lebih terbatas S = {warna primer} = {merah, biru, kuning}.",
    s4e1cAns: "S = {bilangan asli ≤ 25} atau S = {1,4,9,...,625} (semua kuadrat sempurna). Tergantung konteks.",

    s4e2q: "Diketahui S = {bilangan asli 1 sampai 10}, A = {bilangan prima}, dan B = {bilangan genap}. Tentukan: Aᶜ, Bᶜ, A∩B, dan (A∩B)ᶜ.",
    s4e2s1: "Langkah 1 — Daftar anggota:",
    s4e2prime: "A (bilangan prima):", s4e2even: "B (bilangan genap):",
    s4e2s2: "Langkah 2 — Komplemen:",
    s4e2acText: "Aᶜ = anggota S yang bukan bilangan prima:",
    s4e2bcText: "Bᶜ = anggota S yang bukan bilangan genap:",
    s4e2s3: "Langkah 3 — Irisan dan komplemennya:",
    s4e2abText: "A∩B = yang prima DAN genap:",
    s4e2abcText: "(A∩B)ᶜ = S minus {2}:",

    s4e3q: "Dalam diskusi tentang siswa kelas 7A, himpunan semesta S adalah semua siswa kelas 7A (30 siswa). P = siswa yang ikut ekskul piano, Q = siswa yang ikut ekskul quilting. Jika n(P) = 12, n(Q) = 8, n(P∩Q) = 3, tentukan n(Pᶜ), n(Qᶜ), dan n((P∪Q)ᶜ).",
    s4e3pc: "Pᶜ = siswa yang tidak ikut piano:",
    s4e3qc: "Qᶜ = siswa yang tidak ikut quilting:",
    s4e3puq: "Langkah awal: hitung n(P∪Q):",
    s4e3pqc: "(P∪Q)ᶜ = siswa yang tidak ikut keduanya:",

    // Sub5 - Kuasa
    s5def: "Himpunan Kuasa dari himpunan A, ditulis",
    s5def2: "atau",
    s5def3: "adalah himpunan yang berisi",
    s5defBold: "semua himpunan bagian",
    s5def4: "dari A, termasuk himpunan kosong dan A itu sendiri.",
    s5formula: "📐 Rumus Banyak Anggota Himpunan Kuasa:",
    s5tip: "💡 Tips: Perbedaan himpunan bagian vs himpunan kuasa: Himpunan bagian adalah salah satu \"isi\" dari himpunan kuasa. Himpunan kuasa adalah wadah yang menampung semua himpunan bagian tersebut.",
    s5tableHead: ["n(A)", "n(𝒫(A)) = 2ⁿ", "Nilai"],
    s5pascalTitle: "Segitiga Pascal untuk menghitung himpunan bagian:",
    s5pascalNote: "Baris ke-n segitiga Pascal = jumlah himpunan bagian dengan k anggota (k = 0,1,...,n).",

    s5e1q: "Tentukan himpunan kuasa dari A = {x, y} dan n(𝒫(A))!",
    s5e1s1: "Langkah 1 — Daftar semua himpunan bagian dari A:",
    s5e1s2: "Langkah 2 — Susun menjadi himpunan kuasa:",
    s5e1count: "0 anggota:", s5e1one: "1 anggota:", s5e1two: "2 anggota:",

    s5e2q: "Diketahui n(𝒫(M)) = 32. Tentukan n(M) dan berapa himpunan bagian M dengan tepat 2 anggota!",
    s5e2s1: "Langkah 1 — Cari n(M):",
    s5e2s2: "Langkah 2 — Himpunan bagian dengan tepat 2 anggota (dari 5 anggota):",
    s5e2pascal: "Gunakan baris ke-5 Segitiga Pascal:",
    s5e2pascalRow: "1 — 5 — 10 — 10 — 5 — 1",
    s5e2ans: "Ada 10 himpunan bagian yang memiliki tepat 2 anggota.",

    s5e3q: "Himpunan A = {1,2,3,4}. Tentukan: (a) n(𝒫(A)), (b) banyak anggota 𝒫(A) yang memuat anggota '2', (c) banyak anggota 𝒫(A) yang tidak memuat '2'.",
    s5e3a: "(a) n(𝒫(A)):",
    s5e3b: "(b) Yang memuat '2':",
    s5e3bText: "Jika '2' pasti ada, sisa 3 anggota ({1,3,4}) bebas masuk atau tidak.",
    s5e3bCalc: "Banyak cara =",
    s5e3bEx: "Contoh:",
    s5e3c: "(c) Yang tidak memuat '2':",
    s5e3cCalc: "Total − yang memuat '2' =",
    s5e3cOr: "Atau: himpunan bagian dari {1,3,4} =",
  },

  en: {
    title: "FINITE, EMPTY, INFINITE, SUBSET, UNIVERSAL & POWER SETS",
    subtitle: "Complete Guide to Types of Sets",
    breadcrumb: "Grade 7 · Sets · Mathematics",
    back: "Back to Sets",
    easy: "Easy", medium: "Medium", hard: "Hard",
    summary: "📌 Summary",
    problems: "📝 Practice Problems & Solutions",
    solution: "SOLUTION",
    example: "Example",
    step: "Step",
    known: "Given",
    type: "Type",
    reason: "Reason",
    verify: "Verify",

    sub1: "Section 1: Finite & Empty Sets",
    sub2: "Section 2: Infinite Sets",
    sub3: "Section 3: Subsets",
    sub4: "Section 4: Universal Set",
    sub5: "Section 5: Power Set",

    s1finDef: "Finite Set",
    s1finDefText: "is a set with a definite, countable number of members. Its cardinality is a non-negative integer:",
    s1emptyDef: "Empty Set",
    s1emptyDefText: "is a set with absolutely no members. Written",
    s1emptyOr: "or",
    s1emptyCard: "with cardinality",
    s1emptyWarn: "⚠️ Warning:",
    s1emptyWarnText: "is a set containing the number zero — it is NOT an empty set! An empty set truly has no members at all.",
    s1tip: "💡 Tip: Easy way to distinguish — if you can list all members and stop → finite. If the list is blank (nothing to write) → empty!",
    s1table: ["Type", "Notation", "n(A)", "Example"],
    s1rows: [
      ["Finite", "A = {1,2,3}", "3", "{weekdays} = {Mon,...,Fri}"],
      ["Empty", "∅ or {}", "0", "{even primes > 2}"],
    ],

    s1e1q: "Classify each set (finite or empty) and give your reason!",
    s1e1aTitle: "a. A = {x | x is an integer, 5 < x < 6}",
    s1e1bTitle: "b. B = {x | x is a natural number, x < 100}",
    s1e1cTitle: "c. C = {x | x² = -9, x ∈ ℝ}",
    s1e1aType: "Empty Set", s1e1aReason: "No integer lies strictly between 5 and 6. So A = ∅.",
    s1e1bType: "Finite Set", s1e1bReason: "Natural numbers less than 100: 1, 2, 3, ..., 99. There are 99 members — finite.",
    s1e1cType: "Empty Set", s1e1cReason: "The square of any real number is ≥ 0, so x² = −9 has no real solution. C = ∅.",

    s1e2q: "Find n(A) for each set:",
    s1e2aMath: "A = \\{\\text{red, yellow, green}\\}",
    s1e2bMath: "B = \\{\\text{Mon, Wed, Fri}\\}",
    s1e2cMath: "C = \\{x \\mid x \\in \\mathbb{N},\\ 10 < x < 20\\}",
    s1e2dMath: "D = \\{x \\mid x^2 = 4,\\ x \\in \\mathbb{Z}\\}",
    s1e2a: "a. Red, yellow, green → 3 members",
    s1e2b: "b. Mon, Wed, Fri → 3 members",
    s1e2c: "c. Natural numbers between 10 and 20 (exclusive): 11,12,...,19 → 9 members",
    s1e2d: "d. Integers with square = 4: x = 2 or x = −2 → 2 members",
    s1e2ans: ["n(A) = 3", "n(B) = 3", "n(C) = 9", "n(D) = 2"],

    s1e3q: "Determine whether each statement is TRUE or FALSE, and explain!",
    s1e3opts: [
      "{0} = ∅",
      "The set of primes between 14 and 16 is the empty set",
      "n(∅) = 0",
      "The set {∅} is the empty set",
    ],
    s1e3a: "FALSE. {0} contains zero as a member, while ∅ has no members. {0} ≠ ∅",
    s1e3b: "TRUE. Primes between 14 and 16: none (15 = 3×5, not prime).",
    s1e3c: "TRUE. The empty set has no members, so its cardinality = 0.",
    s1e3d: "FALSE. {∅} is a set containing one member (the empty set itself). n({∅}) = 1.",

    s2def: "is a set with an unlimited number of members. When listed, it always uses",
    s2defEnd: "to indicate a pattern that continues without end.",
    s2examples: ["Natural numbers: ℕ = {1, 2, 3, 4, ...}", "Integers: ℤ = {..., −2, −1, 0, 1, 2, ...}", "Positive even numbers: {2, 4, 6, 8, ...}", "Prime numbers: {2, 3, 5, 7, 11, 13, ...}"],
    s2tip: "💡 Tip: How to distinguish an infinite set from a finite one? Ask: 'Is there a largest member?' If no → infinite!",
    s2infOrFin: [
      ["Set of odd natural numbers", "INFINITE", "No largest odd number"],
      ["Set of primes ≤ 100", "FINITE", "Upper bound exists (100), members countable"],
      ["Set of negative multiples of 3", "INFINITE", "No smallest negative multiple of 3"],
    ],

    s2e1q: "Classify each set (finite or infinite):",
    s2e1opts: [
      "K = {x | x is a natural number, x divisible by 4}",
      "L = {x | x is an integer, -1000 ≤ x ≤ 1000}",
      "M = {x | x² < 100, x ∈ ℕ}",
    ],
    s2e1a: "K = positive multiples of 4 = {4, 8, 12, ...} → no upper bound.",
    s2e1aType: "Infinite",
    s2e1b: "L = integers from -1000 to 1000 → bounded, countable (2001 members).",
    s2e1bType: "Finite, n(L) = 2001",
    s2e1c: "M: Natural numbers with x² < 100 → x < 10 → x ∈ {1,2,3,...,9}.",
    s2e1cType: "Finite, n(M) = 9",

    s2e2q: "Set P = {x | x is prime}. Set Q = {x | x is prime, x < 20}. Compare P and Q!",
    s2e2pType: "P: Infinite",
    s2e2pReason: "There are infinitely many primes (proved by Euclid ~300 BCE).",
    s2e2qType: "Q: Finite",
    s2e2qReason: "Upper bound x < 20 exists.",
    s2e2qMembers: "Members of Q: {2,3,5,7,11,13,17,19} → n(Q) = 8.",
    s2e2note: "Although both contain primes, P is infinite and Q is finite because Q has an upper bound!",

    s2e3q: "Set G = {x | x is an integer, x is divisible by 3 or 5}. Is G finite or infinite? List 5 members!",
    s2e3katex: "G = \\{x \\in \\mathbb{Z} \\mid x \\text{ is divisible by 3 or 5}\\}",
    s2e3type: "Infinite",
    s2e3reason: "Integers divisible by 3 or 5 have no upper or lower bound.",
    s2e3positive: "Positive examples:",
    s2e3negative: "Negative examples:",
    s2e3members5: "Five sample members of G:",

    s3def: "Set A is called a",
    s3defBold: "subset",
    s3def2: "of set B, written",
    s3def3: "if and only if every member of A is also a member of B.",
    s3defFormal: "📌 Formal Definition:",
    s3defFormalText: "if for every",
    s3defFormalText2: "we have",
    s3notSubset: "A is NOT a subset of B, written",
    s3notSubsetText: "if there exists at least one member of A that is not in B.",
    s3prop: "Important Properties:",
    s3props: [
      "Every set is a subset of itself: A ⊆ A",
      "The empty set is a subset of every set: ∅ ⊆ A",
      "If A ⊆ B and B ⊆ A, then A = B",
      "If A ⊆ B and B ⊆ C, then A ⊆ C (transitive)",
    ],
    s3tip: "💡 Tip: Key concept — A ⊆ B means 'every member of A must be in B'. To prove A ⊆ B, check EVERY member of A. If even one is missing from B → A ⊄ B!",
    s3proper: "Proper Subset:",
    s3properText: "A ⊂ B means A ⊆ B AND A ≠ B. In other words, A is a subset of B, but B has members not in A.",

    s3e1q: "Determine which is a subset of which:",
    s3e1opts: ["A = {1,2,3} and B = {1,2,3,4,5}", "C = {a,b,c} and D = {a,c,e}", "E = {2,4,6} and F = {1,2,3,4,5,6}"],
    s3e1aRes: "A ⊆ B (all members of A are in B). A ⊂ B (proper, since B has 4 and 5 not in A).",
    s3e1bRes: "C ⊄ D. 'b' is in C but not D. D ⊄ C. 'e' is in D but not C.",
    s3e1cRes: "E ⊆ F (2,4,6 are all in F). E ⊂ F (proper subset).",

    s3e2q: "List ALL subsets of A = {p, q, r}!",
    s3e2hint: "Hint: A set with 3 members has 2³ = 8 subsets.",
    s3e2org: "Organized by number of members:",
    s3e2noMem: "0 members:", s3e2oneMem: "1 member:", s3e2twoMem: "2 members:", s3e2threeMem: "3 members:",
    s3e2total: "Total: 8 subsets ✓",

    s3e3q: "Given S = {1,2,3,4}. Find:",
    s3e3opts: ["How many subsets does S have?", "How many proper subsets does S have?", "How many subsets of S have exactly 2 members?"],
    s3e3aAns: "n(𝒫(S)) = 2⁴ = 16 subsets.",
    s3e3bAns: "Proper subsets = all except S itself = 16 − 1 = 15.",
    s3e3cAns: "Choose 2 from 4: C(4,2) = 4!/(2!·2!) = 6 subsets.",
    s3e3cList: "{1,2}, {1,3}, {1,4}, {2,3}, {2,4}, {3,4}",

    s4def: "is the set that contains all objects under discussion in a given context. Denoted by",
    s4def2: "and shown as a rectangle in the Venn Diagram.",
    s4note: "⚠️ Important: The universal set depends on context! If we're discussing integers, S = ℤ. If discussing alphabet letters, S = {a,b,c,...,z}.",
    s4examples: ["Integer context: S = ℤ = {..., −2, −1, 0, 1, 2, ...}", "Natural numbers ≤ 10 context: S = {1,2,...,10}", "Alphabet context: S = {a,b,c,...,z}"],
    s4tip: "💡 Tip: The universal set defines the 'world' of the problem you're working on. Always read the problem carefully to determine the correct universal set!",

    s4e1q: "Determine an appropriate universal set for each situation:",
    s4e1opts: [
      "P = {2,4,6,8,10} is the set of positive even numbers ≤ 10",
      "Q = {red, blue, yellow} in a discussion about primary colors",
      "R = {1,4,9,16,25} is the set of perfect squares",
    ],
    s4e1aAns: "S = {1,2,...,10} or S = {natural numbers ≤ 10}. P is the set of even numbers in S.",
    s4e1bAns: "S = {all colors}, or more narrowly S = {primary colors} = {red, blue, yellow}.",
    s4e1cAns: "S = {natural numbers ≤ 25} or S = {all perfect squares}. Depends on context.",

    s4e2q: "Given S = {natural numbers 1 to 10}, A = {primes}, B = {even numbers}. Find: Aᶜ, Bᶜ, A∩B, and (A∩B)ᶜ.",
    s4e2s1: "Step 1 — List members:",
    s4e2prime: "A (primes):", s4e2even: "B (even numbers):",
    s4e2s2: "Step 2 — Complements:",
    s4e2acText: "Aᶜ = members of S not prime:",
    s4e2bcText: "Bᶜ = members of S not even:",
    s4e2s3: "Step 3 — Intersection and complement:",
    s4e2abText: "A∩B = prime AND even:",
    s4e2abcText: "(A∩B)ᶜ = S minus {2}:",

    s4e3q: "In a class of 30 students (Grade 7A), S = all students. P = students in piano club, Q = students in quilting club. If n(P)=12, n(Q)=8, n(P∩Q)=3, find n(Pᶜ), n(Qᶜ), and n((P∪Q)ᶜ).",
    s4e3pc: "Pᶜ = students not in piano:",
    s4e3qc: "Qᶜ = students not in quilting:",
    s4e3puq: "First: find n(P∪Q):",
    s4e3pqc: "(P∪Q)ᶜ = students not in either club:",

    s5def: "The Power Set of A, written",
    s5def2: "or",
    s5def3: "is the set containing",
    s5defBold: "all subsets",
    s5def4: "of A, including the empty set and A itself.",
    s5formula: "📐 Cardinality Formula for Power Sets:",
    s5tip: "💡 Tip: Difference between subset and power set: A subset is one 'element' of the power set. The power set is the 'container' holding all subsets.",
    s5tableHead: ["n(A)", "n(𝒫(A)) = 2ⁿ", "Value"],
    s5pascalTitle: "Pascal's Triangle for counting subsets:",
    s5pascalNote: "Row n of Pascal's Triangle = number of subsets with k members (k = 0,1,...,n).",

    s5e1q: "Find the power set of A = {x, y} and n(𝒫(A))!",
    s5e1s1: "Step 1 — List all subsets of A:",
    s5e1s2: "Step 2 — Form the power set:",
    s5e1count: "0 members:", s5e1one: "1 member:", s5e1two: "2 members:",

    s5e2q: "Given n(𝒫(M)) = 32. Find n(M) and how many subsets of M have exactly 2 members!",
    s5e2s1: "Step 1 — Find n(M):",
    s5e2s2: "Step 2 — Subsets with exactly 2 members (from 5 members):",
    s5e2pascal: "Use row 5 of Pascal's Triangle:",
    s5e2pascalRow: "1 — 5 — 10 — 10 — 5 — 1",
    s5e2ans: "There are 10 subsets with exactly 2 members.",

    s5e3q: "Set A = {1,2,3,4}. Find: (a) n(𝒫(A)), (b) members of 𝒫(A) containing '2', (c) members of 𝒫(A) NOT containing '2'.",
    s5e3a: "(a) n(𝒫(A)):",
    s5e3b: "(b) Subsets containing '2':",
    s5e3bText: "If '2' is fixed in, the remaining 3 members ({1,3,4}) can each be in or out.",
    s5e3bCalc: "Number of ways =",
    s5e3bEx: "Examples:",
    s5e3c: "(c) Subsets NOT containing '2':",
    s5e3cCalc: "Total − those containing '2' =",
    s5e3cOr: "Or: subsets of {1,3,4} =",
  },

  ja: {
    title: "有限集合・空集合・無限集合・部分集合・全体集合・冪集合",
    subtitle: "集合の種類の完全ガイド",
    breadcrumb: "中学1年 · 集合 · 数学教材",
    back: "集合に戻る",
    easy: "基本", medium: "標準", hard: "発展",
    summary: "📌 まとめ",
    problems: "📝 練習問題と解説",
    solution: "解説",
    example: "例題",
    step: "ステップ",
    known: "既知",
    type: "種類",
    reason: "理由",
    verify: "検証",

    sub1: "第1節：有限集合と空集合",
    sub2: "第2節：無限集合",
    sub3: "第3節：部分集合",
    sub4: "第4節：全体集合",
    sub5: "第5節：冪集合",

    s1finDef: "有限集合",
    s1finDefText: "は要素の個数が有限で数え終わることができる集合です。その濃度は非負整数です：",
    s1emptyDef: "空集合",
    s1emptyDefText: "はまったく要素を持たない集合です。",
    s1emptyOr: "または",
    s1emptyCard: "と書き、濃度は",
    s1emptyWarn: "⚠️ 注意：",
    s1emptyWarnText: "は数字の0を含む集合で、空集合ではありません！空集合は本当に要素が一つもありません。",
    s1tip: "💡 コツ：簡単な見分け方 — すべての要素を列挙して終われる → 有限集合。リストが空（書けるものがない）→ 空集合！",
    s1table: ["種類", "記法", "n(A)", "例"],
    s1rows: [
      ["有限集合", "A = {1,2,3}", "3", "{平日} = {月,...,金}"],
      ["空集合", "∅ または {}", "0", "{2より大きい偶数の素数}"],
    ],

    s1e1q: "次の集合が有限集合か空集合か判断し、理由を述べなさい！",
    s1e1aTitle: "a. A = {x | xは整数, 5 < x < 6}",
    s1e1bTitle: "b. B = {x | xは自然数, x < 100}",
    s1e1cTitle: "c. C = {x | x² = -9, x ∈ ℝ}",
    s1e1aType: "空集合", s1e1aReason: "5と6の間（排他的）に整数は存在しない。よってA = ∅。",
    s1e1bType: "有限集合", s1e1bReason: "100未満の自然数：1, 2, 3, ..., 99。99個の要素があり有限。",
    s1e1cType: "空集合", s1e1cReason: "実数の二乗は常に ≥ 0 なので x² = −9 は実数解を持たない。C = ∅。",

    s1e2q: "次の各集合の n(A) を求めなさい：",
    s1e2aMath: "A = \\{\\text{赤、黄、緑}\\}",
    s1e2bMath: "B = \\{\\text{月、水、金}\\}",
    s1e2cMath: "C = \\{x \\mid x \\in \\mathbb{N},\\ 10 < x < 20\\}",
    s1e2dMath: "D = \\{x \\mid x^2 = 4,\\ x \\in \\mathbb{Z}\\}",
    s1e2a: "a. 赤、黄、緑 → 3つの要素",
    s1e2b: "b. 月、水、金 → 3つの要素",
    s1e2c: "c. 10から20の間（排他的）の自然数：11,12,...,19 → 9つの要素",
    s1e2d: "d. 二乗が4になる整数：x = 2 または x = −2 → 2つの要素",
    s1e2ans: ["n(A) = 3", "n(B) = 3", "n(C) = 9", "n(D) = 2"],

    s1e3q: "次の命題が真か偽か答え、説明しなさい！",
    s1e3opts: [
      "{0} = ∅",
      "14と16の間の素数の集合は空集合である",
      "n(∅) = 0",
      "集合 {∅} は空集合である",
    ],
    s1e3a: "偽。{0}は要素として0を含むが、∅は要素がない。{0} ≠ ∅",
    s1e3b: "真。14と16の間の素数：なし（15 = 3×5、素数でない）。",
    s1e3c: "真。空集合は要素がないので、その濃度 = 0。",
    s1e3d: "偽。{∅}は1つの要素（空集合自体）を含む集合。n({∅}) = 1。",

    s2def: "は要素の個数が無限の集合です。列挙するときは常に",
    s2defEnd: "を使って、終わりなく続くパターンを示します。",
    s2examples: ["自然数：ℕ = {1, 2, 3, 4, ...}", "整数：ℤ = {..., −2, −1, 0, 1, 2, ...}", "正の偶数：{2, 4, 6, 8, ...}", "素数：{2, 3, 5, 7, 11, 13, ...}"],
    s2tip: "💡 コツ：無限集合と有限集合の見分け方？「最大の要素はあるか？」と問いなさい。なければ → 無限集合！",
    s2infOrFin: [
      ["奇数の自然数の集合", "無限集合", "最大の奇数は存在しない"],
      ["100以下の素数の集合", "有限集合", "上限（100）があり、数えられる"],
      ["3の負の倍数の集合", "無限集合", "最小の3の負の倍数は存在しない"],
    ],

    s2e1q: "次の集合が有限か無限かを判別しなさい：",
    s2e1opts: [
      "K = {x | xは自然数、4で割り切れる}",
      "L = {x | xは整数、-1000 ≤ x ≤ 1000}",
      "M = {x | x² < 100, x ∈ ℕ}",
    ],
    s2e1a: "K = 4の正の倍数 = {4, 8, 12, ...} → 上限なし。",
    s2e1aType: "無限集合",
    s2e1b: "L = -1000から1000の整数 → 有界で数えられる（2001個）。",
    s2e1bType: "有限集合、n(L) = 2001",
    s2e1c: "M：x² < 100 を満たす自然数 → x < 10 → x ∈ {1,2,3,...,9}。",
    s2e1cType: "有限集合、n(M) = 9",

    s2e2q: "集合 P = {x | xは素数}。集合 Q = {x | xは素数, x < 20}。PとQを比較しなさい！",
    s2e2pType: "P：無限集合",
    s2e2pReason: "素数は無限に存在する（紀元前300年頃ユークリッドが証明）。",
    s2e2qType: "Q：有限集合",
    s2e2qReason: "上限 x < 20 が存在する。",
    s2e2qMembers: "Qの要素：{2,3,5,7,11,13,17,19} → n(Q) = 8。",
    s2e2note: "両方とも素数を含むが、PはQと異なり上限がないため無限集合！",

    s2e3q: "集合 G = {x | xは整数、3または5で割り切れる}。Gは有限か無限か？Gの要素を5つ挙げなさい！",
    s2e3katex: "G = \\{x \\in \\mathbb{Z} \\mid x \\text{ は3または5で割り切れる}\\}",
    s2e3type: "無限集合",
    s2e3reason: "3または5で割り切れる整数には上限も下限もない。",
    s2e3positive: "正の例：",
    s2e3negative: "負の例：",
    s2e3members5: "Gの5つの要素の例：",

    s3def: "集合AがBの",
    s3defBold: "部分集合",
    s3def2: "であるとは、Aのすべての要素がBの要素でもある場合で、",
    s3def3: "と書きます。",
    s3defFormal: "📌 形式的な定義：",
    s3defFormalText: "すべての",
    s3defFormalText2: "について",
    s3notSubset: "AはBの部分集合でない場合は",
    s3notSubsetText: "と書き、AにあってBにない要素が少なくとも1つある場合です。",
    s3prop: "重要な性質：",
    s3props: [
      "すべての集合はそれ自身の部分集合：A ⊆ A",
      "空集合はすべての集合の部分集合：∅ ⊆ A",
      "A ⊆ B かつ B ⊆ A ならば A = B",
      "A ⊆ B かつ B ⊆ C ならば A ⊆ C（推移性）",
    ],
    s3tip: "💡 コツ：キーポイント — A ⊆ B は「Aのすべての要素が必ずBにある」こと。A ⊆ B を証明するには、Aの要素を1つずつすべて確認する。Bにない要素が1つでもあれば → A ⊄ B！",
    s3proper: "真部分集合：",
    s3properText: "A ⊂ B は A ⊆ B かつ A ≠ B を意味する。つまりAはBの部分集合だが、BにはAにない要素がある。",

    s3e1q: "どちらがどちらの部分集合か答えなさい：",
    s3e1opts: ["A = {1,2,3} と B = {1,2,3,4,5}", "C = {a,b,c} と D = {a,c,e}", "E = {2,4,6} と F = {1,2,3,4,5,6}"],
    s3e1aRes: "A ⊆ B（Aのすべての要素がBにある）。A ⊂ B（真部分集合、BにはAにない4と5がある）。",
    s3e1bRes: "C ⊄ D。「b」はCにあるがDにない。D ⊄ C。「e」はDにあるがCにない。",
    s3e1cRes: "E ⊆ F（2,4,6はすべてFにある）。E ⊂ F（真部分集合）。",

    s3e2q: "A = {p, q, r} のすべての部分集合を求めなさい！",
    s3e2hint: "ヒント：3つの要素を持つ集合の部分集合は 2³ = 8 個。",
    s3e2org: "要素数ごとに整理：",
    s3e2noMem: "0つの要素：", s3e2oneMem: "1つの要素：", s3e2twoMem: "2つの要素：", s3e2threeMem: "3つの要素：",
    s3e2total: "合計：8つの部分集合 ✓",

    s3e3q: "S = {1,2,3,4} について求めなさい：",
    s3e3opts: ["Sの部分集合はいくつ？", "Sの真部分集合はいくつ？", "要素が2つの部分集合はいくつ？"],
    s3e3aAns: "n(𝒫(S)) = 2⁴ = 16 個の部分集合。",
    s3e3bAns: "真部分集合 = S自身を除くすべて = 16 − 1 = 15。",
    s3e3cAns: "4つから2つ選ぶ：C(4,2) = 4!/(2!·2!) = 6 個。",
    s3e3cList: "{1,2}, {1,3}, {1,4}, {2,3}, {2,4}, {3,4}",

    s4def: "は特定の文脈で議論されているすべての対象を含む集合です。",
    s4def2: "で表し、ベン図では長方形で描きます。",
    s4note: "⚠️ 重要：全体集合は文脈に依存します！整数を議論していれば S = ℤ。アルファベットの文字を議論していれば S = {a,b,c,...,z}。",
    s4examples: ["整数の文脈：S = ℤ = {..., −2, −1, 0, 1, 2, ...}", "10以下の自然数：S = {1,2,...,10}", "アルファベット：S = {a,b,c,...,z}"],
    s4tip: "💡 コツ：全体集合は問題の「世界」を定義します。適切な全体集合を決めるために、問題を注意深く読んでください！",

    s4e1q: "次の各状況に適切な全体集合を決めなさい：",
    s4e1opts: [
      "P = {2,4,6,8,10} は10以下の正の偶数の集合",
      "Q = {赤, 青, 黄} の三原色についての議論",
      "R = {1,4,9,16,25} は完全平方数の集合",
    ],
    s4e1aAns: "S = {1,2,...,10} または S = {10以下の自然数}。PはSの偶数の集合。",
    s4e1bAns: "S = {すべての色}、または S = {三原色} = {赤, 青, 黄}。",
    s4e1cAns: "S = {25以下の自然数} または S = {すべての完全平方数}。文脈による。",

    s4e2q: "S = {1から10の自然数}、A = {素数}、B = {偶数}。Aᶜ、Bᶜ、A∩B、(A∩B)ᶜ を求めなさい。",
    s4e2s1: "ステップ1 — 要素を列挙：",
    s4e2prime: "A（素数）：", s4e2even: "B（偶数）：",
    s4e2s2: "ステップ2 — 補集合：",
    s4e2acText: "Aᶜ = Sのうち素数でないもの：",
    s4e2bcText: "Bᶜ = Sのうち偶数でないもの：",
    s4e2s3: "ステップ3 — 共通部分とその補集合：",
    s4e2abText: "A∩B = 素数かつ偶数：",
    s4e2abcText: "(A∩B)ᶜ = Sから{2}を引いたもの：",

    s4e3q: "中学1年A組30人全員を全体集合Sとする。P = ピアノ部の生徒、Q = 工芸部の生徒。n(P)=12、n(Q)=8、n(P∩Q)=3のとき、n(Pᶜ)、n(Qᶜ)、n((P∪Q)ᶜ)を求めなさい。",
    s4e3pc: "Pᶜ = ピアノ部に入っていない生徒：",
    s4e3qc: "Qᶜ = 工芸部に入っていない生徒：",
    s4e3puq: "まず n(P∪Q) を求める：",
    s4e3pqc: "(P∪Q)ᶜ = どちらにも入っていない生徒：",

    s5def: "集合Aの冪集合を",
    s5def2: "または",
    s5def3: "と書き、Aの",
    s5defBold: "すべての部分集合",
    s5def4: "を要素とする集合（空集合とA自身を含む）です。",
    s5formula: "📐 冪集合の要素数の公式：",
    s5tip: "💡 コツ：部分集合と冪集合の違い：部分集合は冪集合の「要素」の一つ。冪集合はすべての部分集合を含む「容器」です。",
    s5tableHead: ["n(A)", "n(𝒫(A)) = 2ⁿ", "値"],
    s5pascalTitle: "部分集合を数えるパスカルの三角形：",
    s5pascalNote: "パスカルの三角形のn行目 = k個の要素を持つ部分集合の数（k = 0,1,...,n）。",

    s5e1q: "A = {x, y} の冪集合と n(𝒫(A)) を求めなさい！",
    s5e1s1: "ステップ1 — Aのすべての部分集合を列挙：",
    s5e1s2: "ステップ2 — 冪集合を作る：",
    s5e1count: "0つの要素：", s5e1one: "1つの要素：", s5e1two: "2つの要素：",

    s5e2q: "n(𝒫(M)) = 32 のとき、n(M) と、ちょうど2つの要素を持つMの部分集合の数を求めなさい！",
    s5e2s1: "ステップ1 — n(M) を求める：",
    s5e2s2: "ステップ2 — ちょうど2つの要素を持つ部分集合（5つの要素から）：",
    s5e2pascal: "パスカルの三角形の5行目を使う：",
    s5e2pascalRow: "1 — 5 — 10 — 10 — 5 — 1",
    s5e2ans: "ちょうど2つの要素を持つ部分集合は10個あります。",

    s5e3q: "集合 A = {1,2,3,4}。(a) n(𝒫(A))、(b) 「2」を含む𝒫(A)の要素数、(c)「2」を含まない𝒫(A)の要素数を求めなさい。",
    s5e3a: "(a) n(𝒫(A))：",
    s5e3b: "(b) 「2」を含む部分集合：",
    s5e3bText: "「2」が必ず含まれる場合、残り3つの要素（{1,3,4}）は各自入るか入らないか自由。",
    s5e3bCalc: "場合の数 =",
    s5e3bEx: "例：",
    s5e3c: "(c) 「2」を含まない部分集合：",
    s5e3cCalc: "合計 − 「2」を含むもの =",
    s5e3cOr: "または：{1,3,4}の部分集合 =",
  },
};

const JenisHimpunanPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = language as "id" | "en" | "ja";
  const t = translations[lang];

  const [expandedSections, setExpandedSections] = useState<string[]>(["finKosong", "takHingga", "subset", "semesta", "kuasa"]);
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

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Layers className="w-10 h-10 text-primary mx-auto mb-3"/>
        <h1 className="font-display text-base md:text-lg font-bold text-primary text-glow-cyan mb-2 text-center leading-snug">{t.title}</h1>
        <p className="text-white/50 text-xs text-center mb-1 font-body">{t.subtitle}</p>
        <p className="text-white/40 text-xs text-center mb-6 font-body">{t.breadcrumb}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── SUB-BAB 1: BERHINGGA & KOSONG ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="finKosong" label={t.sub1} icon={<Archive className="w-5 h-5"/>} color="text-green-400"/>
            {true && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">{t.summary}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-green-900/30 rounded-lg p-3 space-y-2">
                      <p className="font-body text-sm font-semibold text-green-400">{t.s1finDef}</p>
                      <p className="font-body text-xs text-white/80">{t.s1finDefText} <InlineMath math="n(A) = k \in \mathbb{N}_0"/>.</p>
                      <div className="bg-slate-900/50 rounded p-2 text-xs">
                        <p className="text-white/70"><InlineMath math="A = \{2,4,6\}"/> → <InlineMath math="n(A) = 3"/></p>
                        <p className="text-white/70"><InlineMath math="B = \{a,b,...,z\}"/> → <InlineMath math="n(B) = 26"/></p>
                      </div>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3 space-y-2">
                      <p className="font-body text-sm font-semibold text-slate-300">{t.s1emptyDef}</p>
                      <p className="font-body text-xs text-white/80">
                        {t.s1emptyDefText} <InlineMath math="\emptyset"/> {t.s1emptyOr} <InlineMath math="\{\}"/> {t.s1emptyCard} <InlineMath math="n(\emptyset) = 0"/>.
                      </p>
                      <div className="bg-red-900/20 border border-red-500/20 rounded p-2 text-xs">
                        <p className="text-red-300">{t.s1emptyWarn} <InlineMath math="\{0\}"/> {t.s1emptyWarnText}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-900/60 rounded-xl overflow-hidden">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-slate-800">
                          {t.s1table.map((h) => <th key={h} className="border border-slate-600/50 px-3 py-2 text-cyan-300 text-left">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody className="text-white/80">
                        {t.s1rows.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-800/40">
                            {row.map((cell, j) => <td key={j} className="border border-slate-600/30 px-3 py-2">{cell}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">{t.s1tip}</p>
                  </div>
                </div>
                <p className="font-body text-sm font-semibold text-white">{t.problems}</p>

                {/* E1 - Easy */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{easyBadge}<span className="font-body font-semibold text-white">{t.example} 1</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.s1e1q}</p>
                    <ul className="font-body text-sm text-white/80 mt-2 space-y-1 list-[lower-alpha] list-inside">
                      <li>{t.s1e1aTitle}</li>
                      <li>{t.s1e1bTitle}</li>
                      <li>{t.s1e1cTitle}</li>
                    </ul>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-green-400">{t.solution}:</p>
                    {[
                      { label: "a.", type: t.s1e1aType, reason: t.s1e1aReason, color: "slate" },
                      { label: "b.", type: t.s1e1bType, reason: t.s1e1bReason, color: "green" },
                      { label: "c.", type: t.s1e1cType, reason: t.s1e1cReason, color: "slate" },
                    ].map(({ label, type, reason }) => (
                      <div key={label} className="bg-slate-900/50 rounded p-3">
                        <p className="font-body text-sm font-semibold text-white">{label} <span className="text-primary">{type}</span></p>
                        <p className="font-body text-xs text-white/70 mt-1">{reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* E2 - Medium */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="font-body font-semibold text-white">{t.example} 2</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.s1e2q}</p>
                    <div className="mt-2 space-y-1 font-body text-sm text-white/80">
                      <p>a. <InlineMath math={t.s1e2aMath}/></p>
                      <p>b. <InlineMath math={t.s1e2bMath}/></p>
                      <p>c. <InlineMath math={t.s1e2cMath}/></p>
                      <p>d. <InlineMath math={t.s1e2dMath}/></p>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-2">
                    <p className="font-body text-xs font-semibold text-yellow-400">{t.solution}:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      {["a", "b", "c", "d"].map((l, i) => (
                        <div key={l} className="flex justify-between items-start gap-2">
                          <p className="text-white/70 text-xs flex-1">{[t.s1e2a, t.s1e2b, t.s1e2c, t.s1e2d][i]}</p>
                          <span className="text-primary font-bold text-xs whitespace-nowrap">{t.s1e2ans[i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* E3 - Hard */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{hardBadge}<span className="font-body font-semibold text-white">{t.example} 3</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.s1e3q}</p>
                    <ul className="font-body text-sm text-white/80 mt-2 space-y-1 list-[lower-alpha] list-inside">
                      {t.s1e3opts.map((o, i) => <li key={i}>{o}</li>)}
                    </ul>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-2">
                    <p className="font-body text-xs font-semibold text-red-400">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      {[
                        { l: "a.", text: t.s1e3a, good: false },
                        { l: "b.", text: t.s1e3b, good: true },
                        { l: "c.", text: t.s1e3c, good: true },
                        { l: "d.", text: t.s1e3d, good: false },
                      ].map(({ l, text, good }) => (
                        <div key={l} className={`bg-slate-900/50 rounded p-3 border-l-2 ${good ? "border-green-500" : "border-red-500"}`}>
                          <p><strong className={good ? "text-green-400" : "text-red-400"}>{l}</strong> {text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 2: TAK HINGGA ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="takHingga" label={t.sub2} icon={<Infinity className="w-5 h-5"/>} color="text-blue-400"/>
            {true && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-blue-300">{t.summary}</p>
                  <p className="font-body text-sm text-white/80">
                    <strong className="text-blue-300">{lang === "id" ? "Himpunan Tak Hingga" : lang === "en" ? "An Infinite Set" : "無限集合"}</strong>{" "}
                    {t.s2def} <InlineMath math="..."/> {t.s2defEnd}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {t.s2examples.map((ex) => (
                      <div key={ex} className="bg-blue-900/30 border border-blue-700/30 rounded p-2">
                        <p className="font-body text-xs text-blue-200">{ex}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-900/60 rounded-xl overflow-hidden">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-slate-800">
                          <th className="border border-slate-600/50 px-3 py-2 text-cyan-300 text-left">{lang === "id" ? "Himpunan" : lang === "en" ? "Set" : "集合"}</th>
                          <th className="border border-slate-600/50 px-3 py-2 text-cyan-300 text-left">{lang === "id" ? "Jenis" : lang === "en" ? "Type" : "種類"}</th>
                          <th className="border border-slate-600/50 px-3 py-2 text-cyan-300 text-left">{lang === "id" ? "Alasan" : lang === "en" ? "Reason" : "理由"}</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/80">
                        {t.s2infOrFin.map(([set, type, reason]) => (
                          <tr key={set} className="hover:bg-slate-800/40">
                            <td className="border border-slate-600/30 px-3 py-2">{set}</td>
                            <td className={`border border-slate-600/30 px-3 py-2 font-bold ${type.includes("TAK") || type.includes("INFINITE") || type.includes("無限") ? "text-blue-400" : "text-green-400"}`}>{type}</td>
                            <td className="border border-slate-600/30 px-3 py-2 text-white/60">{reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">{t.s2tip}</p>
                  </div>
                </div>
                <p className="font-body text-sm font-semibold text-white">{t.problems}</p>

                {/* E1 Easy */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{easyBadge}<span className="font-body font-semibold text-white">{t.example} 1</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.s2e1q}</p>
                    <ul className="font-body text-sm text-white/80 mt-2 space-y-1 list-[lower-alpha] list-inside">
                      {t.s2e1opts.map((o, i) => <li key={i}>{o}</li>)}
                    </ul>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-green-400">{t.solution}:</p>
                    {[
                      { l: "a.", text: t.s2e1a, type: t.s2e1aType, blue: true },
                      { l: "b.", text: t.s2e1b, type: t.s2e1bType, blue: false },
                      { l: "c.", text: t.s2e1c, type: t.s2e1cType, blue: false },
                    ].map(({ l, text, type, blue }) => (
                      <div key={l} className="bg-slate-900/50 rounded p-3">
                        <p className="font-body text-xs text-white/70">{l} {text}</p>
                        <p className={`font-body text-xs font-bold mt-1 ${blue ? "text-blue-400" : "text-green-400"}`}>{lang === "id" ? "→ Jenis: " : lang === "en" ? "→ Type: " : "→ 種類："}{type}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* E2 Medium */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="font-body font-semibold text-white">{t.example} 2</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.s2e2q}</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-yellow-400">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-blue-900/20 border border-blue-500/20 rounded p-3">
                        <p className="text-blue-300 font-bold">{t.s2e2pType}</p>
                        <p className="text-xs mt-1 text-white/70">{t.s2e2pReason}</p>
                        <p className="text-xs mt-1">P = &#123;2, 3, 5, 7, 11, 13, ...&#125;</p>
                      </div>
                      <div className="bg-green-900/20 border border-green-500/20 rounded p-3">
                        <p className="text-green-300 font-bold">{t.s2e2qType}</p>
                        <p className="text-xs mt-1 text-white/70">{t.s2e2qReason}</p>
                        <p className="text-xs mt-1">{t.s2e2qMembers}</p>
                      </div>
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded p-2 text-xs">
                        <p className="text-amber-300">💡 {t.s2e2note}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* E3 Hard */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{hardBadge}<span className="font-body font-semibold text-white">{t.example} 3</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.s2e3q}</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-red-400">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="overflow-x-auto"><BlockMath math={t.s2e3katex}/></div>
                      <p><strong className="text-blue-400">{lang === "id" ? "Jenis: " : lang === "en" ? "Type: " : "種類："}{t.s2e3type}</strong></p>
                      <p className="text-xs text-white/70">{t.s2e3reason}</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1 text-xs">
                        <p className="text-cyan-300 font-semibold">{t.s2e3members5}</p>
                        <p>{t.s2e3positive} 3, 5, 6, 10, 12</p>
                        <p>{t.s2e3negative} −3, −5, −6, −10, −12</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 3: SUBSET ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="subset" label={t.sub3} icon={<Braces className="w-5 h-5"/>} color="text-purple-400"/>
            {true && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">{t.summary}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.s3def} <strong className="text-purple-300">{t.s3defBold}</strong> {t.s3def2} <InlineMath math="A \subseteq B"/>, {t.s3def3}
                  </p>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-purple-300">{t.s3defFormal}</p>
                    <div className="overflow-x-auto">
                      <BlockMath math="A \subseteq B \iff \forall x,\ (x \in A \implies x \in B)"/>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-cyan-300 mb-2">{t.s3prop}</p>
                    <ul className="font-body text-xs text-white/70 space-y-1 list-disc list-inside">
                      {t.s3props.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </div>
                  <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-indigo-300">{t.s3proper}</p>
                    <p className="font-body text-xs text-white/70 mt-1">{t.s3properText}</p>
                    <div className="overflow-x-auto mt-2"><BlockMath math="A \subset B \iff (A \subseteq B \text{ and } A \neq B)"/></div>
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
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-green-400">{t.solution}:</p>
                    {[t.s3e1aRes, t.s3e1bRes, t.s3e1cRes].map((res, i) => (
                      <div key={i} className="bg-slate-900/50 rounded p-3">
                        <p className="font-body text-xs font-semibold text-white mb-1">{["a.", "b.", "c."][i]}</p>
                        <p className="font-body text-xs text-white/70">{res}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* E2 Medium */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="font-body font-semibold text-white">{t.example} 2</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.s3e2q}</p>
                    <p className="font-body text-xs text-white/60 mt-1">{t.s3e2hint}</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <p className="font-semibold text-xs text-cyan-300">{t.s3e2org}</p>
                      <p><strong>{t.s3e2noMem}</strong> <InlineMath math="\emptyset"/></p>
                      <p><strong>{t.s3e2oneMem}</strong> <InlineMath math="\{p\}"/>, <InlineMath math="\{q\}"/>, <InlineMath math="\{r\}"/></p>
                      <p><strong>{t.s3e2twoMem}</strong> <InlineMath math="\{p,q\}"/>, <InlineMath math="\{p,r\}"/>, <InlineMath math="\{q,r\}"/></p>
                      <p><strong>{t.s3e2threeMem}</strong> <InlineMath math="\{p,q,r\}"/></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="\mathcal{P}(A) = \{\emptyset, \{p\}, \{q\}, \{r\}, \{p,q\}, \{p,r\}, \{q,r\}, \{p,q,r\}\}"/>
                      </div>
                      <p className="text-green-400 font-semibold">{t.s3e2total}</p>
                    </div>
                  </div>
                </div>

                {/* E3 Hard */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{hardBadge}<span className="font-body font-semibold text-white">{t.example} 3</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.s3e3q}</p>
                    <ul className="font-body text-sm text-white/80 mt-2 space-y-1 list-[lower-alpha] list-inside">
                      {t.s3e3opts.map((o, i) => <li key={i}>{o}</li>)}
                    </ul>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-semibold text-red-400">{t.solution}:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3">
                        <p><strong>a.</strong> {t.s3e3aAns}</p>
                        <div className="overflow-x-auto"><BlockMath math="n(\mathcal{P}(S)) = 2^4 = 16"/></div>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p><strong>b.</strong> {t.s3e3bAns}</p>
                        <div className="overflow-x-auto"><BlockMath math="16 - 1 = 15"/></div>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p><strong>c.</strong> {t.s3e3cAns}</p>
                        <div className="overflow-x-auto"><BlockMath math="C(4,2) = 6"/></div>
                        <p className="text-xs text-white/60 mt-1">{t.s3e3cList}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 4: SEMESTA ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="semesta" label={t.sub4} icon={<Globe className="w-5 h-5"/>} color="text-cyan-400"/>
            {true && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">{t.summary}</p>
                  <p className="font-body text-sm text-white/80">
                    <strong className="text-cyan-300">{lang === "id" ? "Himpunan Semesta" : lang === "en" ? "The Universal Set" : "全体集合"}</strong>{" "}
                    <InlineMath math="S"/> {t.s4def} <InlineMath math="S"/> {t.s4def2}
                  </p>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-amber-200">{t.s4note}</p>
                  </div>
                  <div className="space-y-2">
                    {t.s4examples.map((ex) => (
                      <div key={ex} className="bg-cyan-900/20 border border-cyan-700/30 rounded p-2">
                        <p className="font-body text-xs text-cyan-200">{ex}</p>
                      </div>
                    ))}
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
                    <p className="font-body text-sm text-white">{t.s4e1q}</p>
                    <ul className="font-body text-sm text-white/80 mt-2 space-y-1 list-[lower-alpha] list-inside">
                      {t.s4e1opts.map((o, i) => <li key={i}>{o}</li>)}
                    </ul>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 space-y-2">
                    <p className="font-body text-xs font-semibold text-green-400">{t.solution}:</p>
                    {[t.s4e1aAns, t.s4e1bAns, t.s4e1cAns].map((ans, i) => (
                      <div key={i} className="bg-slate-900/50 rounded p-3">
                        <p className="font-body text-xs font-bold text-white mb-1">{["a.", "b.", "c."][i]}</p>
                        <p className="font-body text-xs text-white/70">{ans}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* E2 Medium */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="font-body font-semibold text-white">{t.example} 2</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.s4e2q}</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.s4e2s1}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1 text-xs">
                        <p>{t.s4e2prime} <InlineMath math="A = \{2,3,5,7\}"/></p>
                        <p>{t.s4e2even} <InlineMath math="B = \{2,4,6,8,10\}"/></p>
                      </div>
                      <p><strong>{t.s4e2s2}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1 text-xs">
                        <p>{t.s4e2acText} <InlineMath math="A^c = \{1,4,6,8,9,10\}"/></p>
                        <p>{t.s4e2bcText} <InlineMath math="B^c = \{1,3,5,7,9\}"/></p>
                      </div>
                      <p><strong>{t.s4e2s3}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1 text-xs">
                        <p>{t.s4e2abText} <InlineMath math="A \cap B = \{2\}"/></p>
                        <p>{t.s4e2abcText} <InlineMath math="(A \cap B)^c = \{1,3,4,5,6,7,8,9,10\}"/></p>
                      </div>
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
                      <p>{t.s4e3pc}</p>
                      <div className="overflow-x-auto"><BlockMath math="n(P^c) = n(S) - n(P) = 30 - 12 = 18"/></div>
                      <p>{t.s4e3qc}</p>
                      <div className="overflow-x-auto"><BlockMath math="n(Q^c) = n(S) - n(Q) = 30 - 8 = 22"/></div>
                      <p>{t.s4e3puq}</p>
                      <div className="overflow-x-auto"><BlockMath math="n(P \cup Q) = 12 + 8 - 3 = 17"/></div>
                      <p>{t.s4e3pqc}</p>
                      <div className="overflow-x-auto"><BlockMath math="n((P \cup Q)^c) = 30 - 17 = 13"/></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 5: KUASA ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="kuasa" label={t.sub5} icon={<Braces className="w-5 h-5"/>} color="text-orange-400"/>
            {true && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-orange-300">{t.summary}</p>
                  <p className="font-body text-sm text-white/80">
                    {t.s5def} <InlineMath math="\mathcal{P}(A)"/> {t.s5def2} <InlineMath math="2^A"/>, {t.s5def3} <strong>{t.s5defBold}</strong> {t.s5def4}
                  </p>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-orange-300">{t.s5formula}</p>
                    <div className="overflow-x-auto"><BlockMath math="n(\mathcal{P}(A)) = 2^{n(A)}"/></div>
                  </div>
                  <div className="bg-slate-900/60 rounded-xl overflow-hidden">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-orange-900/40">
                          {t.s5tableHead.map((h) => <th key={h} className="border border-orange-700/40 px-2 py-1 text-orange-300">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {[["0","2⁰","1"],["1","2¹","2"],["2","2²","4"],["3","2³","8"],["4","2⁴","16"],["5","2⁵","32"]].map(([n,f,v],i) => (
                          <tr key={i} className={i%2===0?"bg-slate-900/30":"bg-slate-800/20"}>
                            <td className="border border-orange-700/30 px-2 py-1 text-center text-white/80">{n}</td>
                            <td className="border border-orange-700/30 px-2 py-1 text-center text-orange-300">{f}</td>
                            <td className="border border-orange-700/30 px-2 py-1 text-center text-primary font-bold">{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                    <p className="font-body text-sm text-white">{t.s5e1q}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.s5e1s1}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>{t.s5e1count} <InlineMath math="\emptyset"/></p>
                        <p>{t.s5e1one} <InlineMath math="\{x\}"/>, <InlineMath math="\{y\}"/></p>
                        <p>{t.s5e1two} <InlineMath math="\{x,y\}"/></p>
                      </div>
                      <p><strong>{t.s5e1s2}</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="\mathcal{P}(A) = \{\emptyset,\ \{x\},\ \{y\},\ \{x,y\}\}"/>
                      </div>
                      <p className="text-primary font-semibold"><InlineMath math="n(\mathcal{P}(A)) = 4 = 2^2"/> ✓</p>
                    </div>
                  </div>
                </div>

                {/* E2 Medium */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="font-body font-semibold text-white">{t.example} 2</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.s5e2q}</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.s5e2s1}</strong></p>
                      <div className="overflow-x-auto">
                        <BlockMath math="2^n = 32 \implies 2^n = 2^5 \implies n(M) = 5"/>
                      </div>
                      <p><strong>{t.s5e2s2}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>{t.s5e2pascal}</p>
                        <p className="text-primary font-mono">{t.s5e2pascalRow}</p>
                        <p className="mt-1">{lang === "id" ? "Nilai ke-3 (untuk 2 anggota dari 5) = " : lang === "en" ? "3rd value (for 2 members from 5) = " : "3番目の値（5つから2つ選ぶ）= "}<strong className="text-primary">10</strong></p>
                        <p className="text-xs text-white/60">{lang === "id" ? "Verifikasi: C(5,2) = 5!/(2!·3!) = 10 ✓" : lang === "en" ? "Verify: C(5,2) = 5!/(2!·3!) = 10 ✓" : "検証：C(5,2) = 5!/(2!·3!) = 10 ✓"}</p>
                      </div>
                      <p className="text-primary font-semibold">{t.s5e2ans}</p>
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
                        <p><strong>(a) n(𝒫(A)):</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <div className="overflow-x-auto"><BlockMath math="n(\mathcal{P}(A)) = 2^4 = 16"/></div>
                        </div>
                      </div>
                      <div>
                        <p><strong>{t.s5e3b}</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <p>{t.s5e3bText}</p>
                          <p>{t.s5e3bCalc} <InlineMath math="2^3 = 8"/></p>
                          <p className="text-xs text-white/60 mt-1">{t.s5e3bEx} <InlineMath math="\{2\}"/>, <InlineMath math="\{1,2\}"/>, <InlineMath math="\{2,3\}"/>, <InlineMath math="\{2,4\}"/>, <InlineMath math="\{1,2,3\}"/>, <InlineMath math="\{1,2,4\}"/>, <InlineMath math="\{2,3,4\}"/>, <InlineMath math="\{1,2,3,4\}"/></p>
                        </div>
                      </div>
                      <div>
                        <p><strong>{t.s5e3c}</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <p>{t.s5e3cCalc} <InlineMath math="16 - 8 = 8"/></p>
                          <p>{t.s5e3cOr} <InlineMath math="2^3 = 8"/></p>
                          <p className="text-primary font-semibold mt-1">{lang === "id" ? "Ada 8 himpunan bagian yang tidak memuat '2'." : lang === "en" ? "There are 8 subsets not containing '2'." : "「2」を含まない部分集合は8個あります。"}</p>
                        </div>
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

export default JenisHimpunanPage;
