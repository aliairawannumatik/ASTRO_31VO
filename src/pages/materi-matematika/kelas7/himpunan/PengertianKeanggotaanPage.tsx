import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import {
  BookOpen, ChevronDown, ChevronUp, Lightbulb,
  Calculator, Target, Layers, Star,
} from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const translations = {
  id: {
    title: "PENGERTIAN & KEANGGOTAAN HIMPUNAN",
    breadcrumb: "Kelas 7 · Himpunan · Materi Matematika",
    back: "Kembali ke Himpunan",
    easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
    summary: "📌 Ringkasan Intisari",
    problems: "📝 Contoh Soal & Pembahasan",
    solution: "PEMBAHASAN",
    example: "Contoh",
    step: "Langkah",

    // Intro
    introTitle: "Apa Itu Himpunan? Kenapa Penting?",
    introP: "Bayangkan kamu sedang merapikan kamar dan mengelompokkan benda-benda: semua buku di rak, semua pakaian di lemari, semua mainan di kotak. Tanpa sadar, kamu baru saja membuat",
    introHimpunan: "himpunan",
    introP2: "! Di matematika, konsep ini punya aturan yang lebih jelas dan sangat berguna dalam kehidupan sehari-hari.",
    introFact: "🚀 Fakta Seru: Teori himpunan pertama kali dikembangkan oleh matematikawan Jerman bernama",
    introCantor: "Georg Cantor",
    introFactEnd: "pada tahun 1870-an. Ia dianggap sebagai \"Bapak Teori Himpunan\" modern!",

    // Sub-bab 1
    sub1: "Sub-Bab 1: Pengertian Himpunan",
    s1defTitle: "📌 Ringkasan Intisari",
    s1def: "adalah kumpulan objek atau benda yang memiliki",
    s1def2: "definisi yang jelas dan tegas",
    s1def3: "sehingga dapat dipastikan apakah suatu objek termasuk atau tidak termasuk ke dalam kelompok tersebut.",
    s1yes: "✅ Ini HIMPUNAN:",
    s1no: "❌ Ini BUKAN Himpunan:",
    s1yesList: ["Kumpulan bilangan prima", "Kumpulan huruf vokal", "Kumpulan siswa kelas 7A", "Kumpulan bilangan genap positif"],
    s1noList: ["Kumpulan anak pintar (subjektif!)", "Kumpulan makanan enak (tidak jelas)", "Kumpulan orang tinggi (relatif)", "Kumpulan warna indah (tidak pasti)"],
    s1memberTitle: "Simbol Keanggotaan:",
    s1memberIn: "termasuk",
    s1memberInText: "elemen",
    s1memberOut: "tidak termasuk",
    s1memberOutText: "bukan elemen",
    s1tip: "💡 Tips: Kunci utama himpunan adalah \"kejelasan\". Tanyakan dulu: \"Apakah bisa dipastikan objek ini masuk atau tidak?\" Kalau bisa → himpunan. Kalau tergantung pendapat orang → bukan himpunan!",

    s1e1q: "Manakah dari kelompok berikut yang merupakan himpunan?",
    s1e1opts: ["Kumpulan bilangan asli kurang dari 6", "Kumpulan artis yang cantik", "Kumpulan warna pelangi", "Kumpulan makanan yang lezat"],
    s1e1s1: "Langkah 1 — Cek kejelasan definisi setiap kelompok:",
    s1e1aYes: "A — Himpunan ✓:",
    s1e1aNo: "B — Bukan himpunan ✗:",
    s1e1cYes: "C — Himpunan ✓:",
    s1e1dNo: "D — Bukan himpunan ✗:",
    s1e1aYesText: "Bilangan asli kurang dari 6 → pasti:",
    s1e1aNoText: "\"Cantik\" bersifat subjektif, setiap orang punya pendapat berbeda.",
    s1e1cYesText: "Warna pelangi sudah pasti: merah, jingga, kuning, hijau, biru, nila, ungu.",
    s1e1dNoText: "\"Lezat\" sangat relatif dan subjektif.",
    s1e1ans: "Jawaban: A dan C merupakan himpunan.",

    s1e2q: "Diketahui himpunan",
    s1e2q2: "Tentukan apakah pernyataan berikut bernilai benar atau salah:",
    s1e2s1: "Langkah 1 — Identifikasi anggota himpunan P:",
    s1e2s1text: "Anggota",
    s1e2s1text2: "adalah",
    s1e2s1text3: "(bilangan genap dari 2 sampai 10).",
    s1e2s2: "Langkah 2 — Periksa satu per satu:",
    s1e2a: "→ BENAR (4 adalah anggota P)",
    s1e2b: "→ SALAH (7 bukan anggota P, 7 bilangan ganjil)",
    s1e2c: "→ SALAH (10 memang anggota P, bukan \"bukan anggota\")",
    s1e2d: "→ BENAR (3 memang bukan anggota P)",

    // Soal cerita: names replaced
    s1e3q: "Di kelas 7B terdapat 30 siswa. Himpunan",
    s1e3q2: "adalah siswa yang menyukai olahraga sepak bola, himpunan",
    s1e3q3: "adalah siswa yang menyukai olahraga basket. Diketahui",
    s1e3q4: "dan",
    s1e3q5: "Tentukan: (a) anggota yang menyukai kedua olahraga, (b) apakah \"Lane\"",
    s1e3q6: "atau",
    s1e3q7: "(c) berapa banyak anggota",
    s1e3q8: "dan berapa banyak anggota",
    s1e3s1: "Langkah 1 — Anggota yang ada di A dan B:",
    s1e3memberA: "Anggota",
    s1e3memberB: "Anggota",
    s1e3both: "Yang ada di keduanya:",
    s1e3bothAns: "River dan Ash",
    s1e3s2: "Langkah 2 — Status \"Lane\":",
    s1e3laneNot: "\"Lane\" tidak ada dalam daftar anggota",
    s1e3laneMath: "\\text{Lane} \\notin A",
    s1e3s3: "Langkah 3 — Banyak anggota:",
    s1e3notation: "Notasi banyak anggota:",
    s1e3nA: "(ada 5 anggota di A)",
    s1e3nB: "(ada 4 anggota di B)",

    // Sub-bab 2
    sub2: "Sub-Bab 2: Notasi & Cara Penyajian Himpunan",
    s2p1: "Himpunan biasanya diberi nama dengan",
    s2p1b: "huruf kapital",
    s2p2: "seperti",
    s2p3: "dan anggotanya ditulis menggunakan",
    s2p4: "kurung kurawal",
    s2p5: ". Ada",
    s2p6: "dua cara utama",
    s2p7: "menyajikan himpunan:",
    s2way1title: "① Dengan Kata-Kata (Deskripsi)",
    s2way1desc: "Menjelaskan syarat keanggotaan himpunan menggunakan kalimat.",
    s2way1ex: "Contoh:",
    s2way1exText: "\"Himpunan bilangan asli kurang dari 5\"",
    s2way1means: "Artinya:",
    s2way2title: "② Dengan Cara Mendaftar (Roster)",
    s2way2desc: "Menuliskan semua anggota himpunan satu per satu dalam kurung kurawal.",
    s2way2ex: "Contoh:",
    s2way2note: "(urutan bebas, tidak ada duplikasi)",
    s2rulesTitle: "Aturan Penulisan Penting:",
    s2rules: [
      "Setiap anggota hanya ditulis sekali (tidak ada duplikasi)",
      "Anggota dipisahkan dengan tanda koma",
      "Urutan anggota tidak mempengaruhi himpunan",
    ],
    s2rulesEnd: "sama dengan",
    s2tip: "💡 Tips: Untuk himpunan yang anggotanya sangat banyak atau tak terbatas, gunakan tanda titik-titik (...) untuk mewakili pola yang berlanjut. Contoh: {2, 4, 6, 8, ...} untuk semua bilangan genap positif.",

    s2e1q: "Nyatakan himpunan berikut dengan cara mendaftar:",
    s2e1opts: ["Himpunan huruf vokal dalam alfabet", "Himpunan bilangan asli kurang dari 8"],
    s2e1aTitle: "a. Huruf vokal:",
    s2e1aDesc: "Deskripsi: \"Himpunan huruf vokal dalam alfabet\"",
    s2e1aRoster: "Cara mendaftar:",
    s2e1bTitle: "b. Bilangan asli kurang dari 8:",
    s2e1bDesc: "Deskripsi: \"Himpunan bilangan asli yang kurang dari 8\"",
    s2e1bRoster: "Cara mendaftar:",

    s2e2q1: "Diketahui",
    s2e2q2: "Nyatakan himpunan",
    s2e2q3: "tersebut dengan kata-kata! Kemudian tentukan nilai",
    s2e2s1: "Langkah 1 — Cari pola dari anggotanya:",
    s2e2s2: "Langkah 2 — Rumuskan deskripsinya:",
    s2e2pattern: "Pola: bilangan kelipatan 3 dari 3 sampai 15",
    s2e2words: "Cara kata-kata:",
    s2e2wordsText: "\"Himpunan bilangan kelipatan 3 yang kurang dari atau sama dengan 15\"",
    s2e2s3: "Langkah 3 — Hitung banyak anggota:",
    s2e2count: "Ada 5 anggota, maka",

    s2e3q1: "Himpunan",
    s2e3q2: "didefinisikan dengan kata-kata sebagai:",
    s2e3q3: "\"Himpunan bilangan prima antara 1 dan 20\"",
    s2e3q4: "Himpunan",
    s2e3q5: "adalah himpunan bilangan genap antara 10 dan 20 (tidak termasuk 10 dan 20). Nyatakan",
    s2e3q6: "dan",
    s2e3q7: "dengan cara mendaftar, lalu tentukan anggota yang ada di kedua himpunan tersebut!",
    s2e3s1: "Langkah 1 — Daftar bilangan prima antara 1 dan 20:",
    s2e3primeNote: "Bilangan prima = bilangan yang hanya habis dibagi 1 dan dirinya sendiri.",
    s2e3s2: "Langkah 2 — Daftar bilangan genap antara 10 dan 20 (tidak termasuk keduanya):",
    s2e3between: "Bilangan antara 10 dan 20 (eksklusif): 11, 12, 13, 14, 15, 16, 17, 18, 19",
    s2e3even: "Yang genap: 12, 14, 16, 18",
    s2e3s3: "Langkah 3 — Cari anggota yang ada di K dan L sekaligus:",
    s2e3kMember: "Anggota K: 2, 3, 5, 7, 11, 13, 17, 19",
    s2e3lMember: "Anggota L: 12, 14, 16, 18",
    s2e3ans: "Tidak ada anggota yang sama! (Himpunan K dan L saling lepas)",
    s2e3ansNote: "Karena bilangan prima > 2 selalu ganjil, sedangkan semua anggota L genap.",

    // Sub-bab 3
    sub3: "Sub-Bab 3: Kesamaan Himpunan",
    s3def: "Dua himpunan dikatakan",
    s3defSame: "sama",
    s3def2: "jika dan hanya jika keduanya memiliki",
    s3def3: "anggota yang persis sama",
    s3def4: "tidak peduli urutan penulisannya. Simbol yang digunakan adalah",
    s3defFormal: "📌 Definisi Formal:",
    s3defFormalText: "jika setiap anggota",
    s3defFormalText2: "juga merupakan anggota",
    s3defFormalText3: "dan sebaliknya.",
    s3sameTitle: "✅ Himpunan yang SAMA:",
    s3notSameTitle: "❌ Himpunan yang TIDAK SAMA:",
    s3sameNote: "(anggota sama, urutan berbeda)",
    s3notSameNote: "(anggota ke-3 berbeda)",
    s3tip: "💡 Tips: Dua himpunan sama jika banyak anggotanya sama DAN setiap anggotanya identik. Kalau ada satu saja yang beda, himpunannya sudah tidak sama!",

    s3e1q: "Tentukan apakah pasangan himpunan berikut sama atau tidak:",
    s3e1a: "Anggota identik, urutan berbeda.",
    s3e1aConc: "✓",
    s3e1b: "Anggota ke-3 berbeda.",
    s3e1bConc: "✗",
    s3e1andBoth: "ada di R tapi tidak di S. Anggota",
    s3e1andBoth2: "ada di S tapi tidak di R.",

    s3e2q1: "Himpunan",
    s3e2q2: "adalah himpunan faktor dari 12. Himpunan",
    s3e2q3: "Apakah",
    s3e2q4: "? Jelaskan!",
    s3e2s1: "Langkah 1 — Cari semua faktor dari 12:",
    s3e2s2: "Langkah 2 — Bandingkan M dan N:",
    s3e2ans: "Semua anggota identik, maka",

    s3e3q1: "Himpunan",
    s3e3q2: "adalah himpunan bilangan asli yang jika dikuadratkan hasilnya kurang dari 30. Himpunan",
    s3e3q3: "Apakah",
    s3e3q4: "?",
    s3e3s1: "Langkah 1 — Tentukan anggota X:",
    s3e3cond: "Cari bilangan asli",
    s3e3cond2: "sedemikian sehingga",
    s3e3s2: "Langkah 2 — Bandingkan X dan Y:",
    s3e3ans: "Kedua himpunan sama!",

    // Sub-bab 4
    sub4: "Sub-Bab 4: Himpunan Berhingga, Kosong & Tak Hingga",
    s4p1: "Berdasarkan",
    s4p1b: "banyak anggotanya",
    s4p2: "himpunan dibedakan menjadi tiga jenis:",
    s4fin: "1️⃣ Himpunan Berhingga",
    s4finDef: "Himpunan yang memiliki anggota dalam jumlah tertentu dan bisa dihitung habis. Notasi:",
    s4finEx: "untuk suatu bilangan cacah",
    s4empty: "2️⃣ Himpunan Kosong",
    s4emptyDef: "Himpunan yang",
    s4emptyDefB: "tidak memiliki anggota sama sekali",
    s4emptyDef2: ". Ditulis",
    s4emptyDef3: "dan",
    s4emptyWarn: "⚠️ Perhatian:",
    s4emptyWarnText: "BUKAN himpunan kosong! Ia punya anggota: angka 0.",
    s4inf: "3️⃣ Himpunan Tak Hingga",
    s4infDef: "Himpunan yang memiliki anggota yang",
    s4infDefB: "tidak terbatas jumlahnya",
    s4infDef2: ". Selalu menggunakan tanda",
    s4infDef3: "saat didaftar.",
    s4tip: "💡 Tips: Cara mudah membedakan: kalau bisa dihitung sampai selesai → berhingga. Kalau tidak ada habisnya → tak hingga. Kalau tidak ada isinya sama sekali → kosong!",

    s4e1q: "Tentukan jenis himpunan (berhingga, kosong, atau tak hingga) dari himpunan berikut:",
    s4e1opts: ["Himpunan hari dalam seminggu", "Himpunan bilangan bulat negatif", "Himpunan bilangan asli antara 5 dan 6"],
    s4e1a: "Hari dalam seminggu: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu → ada 7 hari.",
    s4e1aType: "Berhingga",
    s4e1b: "Bilangan bulat negatif: ... tidak ada habisnya.",
    s4e1bType: "Tak Hingga",
    s4e1c: "Bilangan asli antara 5 dan 6 → tidak ada bilangan asli di sana.",
    s4e1cType: "Himpunan Kosong",

    s4e2q1: "Himpunan",
    s4e2q2: "adalah himpunan bilangan ganjil antara 10 dan 22. Tentukan anggota",
    s4e2q3: ", jenis himpunan, dan nilai",
    s4e2s1: "Langkah 1 — Daftar bilangan ganjil antara 10 dan 22:",
    s4e2between: "Bilangan di antara 10 dan 22: 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21",
    s4e2odd: "Yang ganjil: 11, 13, 15, 17, 19, 21",
    s4e2s2: "Langkah 2 — Tentukan jenis dan banyak anggota:",
    s4e2canCount: "Himpunan T memiliki anggota yang bisa dihitung dan habis.",
    s4e2type: "Jenis: Himpunan Berhingga",

    s4e3q: "Di bawah ini terdapat beberapa definisi himpunan. Untuk setiap himpunan, tentukan jenisnya (berhingga/kosong/tak hingga) dan berikan alasanmu!",
    s4e3opts: ["Himpunan bilangan bulat yang kuadratnya sama dengan", "Himpunan kelipatan 7 yang lebih dari 0", "Himpunan bilangan prima antara 1 dan 50"],
    s4e3aTitle: "a. Bilangan bulat yang kuadratnya = -4:",
    s4e3aText: "Kuadrat dari bilangan apapun pasti ≥ 0, tidak pernah negatif. Tidak ada bilangan bulat yang memenuhi",
    s4e3aType: "Jenis: Himpunan Kosong →",
    s4e3bTitle: "b. Kelipatan 7 yang lebih dari 0:",
    s4e3bText: "Kelipatan 7 tidak ada batasnya (7, 14, 21, ... terus bertambah tanpa henti).",
    s4e3bType: "Jenis: Himpunan Tak Hingga",
    s4e3cTitle: "c. Bilangan prima antara 1 dan 50:",
    s4e3cText: "Ada batas atas (50), sehingga anggotanya bisa dihitung habis.",
    s4e3cType: "Jenis: Himpunan Berhingga",
  },

  en: {
    title: "DEFINITION & MEMBERSHIP OF A SET",
    breadcrumb: "Grade 7 · Sets · Mathematics",
    back: "Back to Sets",
    easy: "Easy", medium: "Medium", hard: "Hard",
    summary: "📌 Summary",
    problems: "📝 Practice Problems & Solutions",
    solution: "SOLUTION",
    example: "Example",
    step: "Step",

    introTitle: "What Is a Set? Why Does It Matter?",
    introP: "Imagine tidying your room by grouping things: all books on the shelf, all clothes in the wardrobe, all toys in a box. Without realizing it, you just made",
    introHimpunan: "sets",
    introP2: "! In mathematics, this concept has clearer rules and is very useful in everyday life.",
    introFact: "🚀 Fun Fact: Set theory was first developed by German mathematician",
    introCantor: "Georg Cantor",
    introFactEnd: "in the 1870s. He is considered the \"Father of Modern Set Theory\"!",

    sub1: "Section 1: Definition of a Set",
    s1defTitle: "📌 Summary",
    s1def: "is a collection of objects that has a",
    s1def2: "clear and precise definition",
    s1def3: "so that it can be determined whether any object belongs to the group or not.",
    s1yes: "✅ This IS a Set:",
    s1no: "❌ This is NOT a Set:",
    s1yesList: ["Collection of prime numbers", "Collection of vowels", "Collection of Grade 7A students", "Collection of positive even numbers"],
    s1noList: ["Collection of smart students (subjective!)", "Collection of tasty foods (unclear)", "Collection of tall people (relative)", "Collection of beautiful colors (uncertain)"],
    s1memberTitle: "Membership Symbols:",
    s1memberIn: "belongs to",
    s1memberInText: "is an element of",
    s1memberOut: "does not belong to",
    s1memberOutText: "is not an element of",
    s1tip: "💡 Tip: The key to a set is \"clarity\". Ask first: \"Can we definitively say whether this object belongs?\" If yes → set. If it depends on opinion → not a set!",

    s1e1q: "Which of the following groups is a set?",
    s1e1opts: ["Collection of natural numbers less than 6", "Collection of beautiful celebrities", "Collection of rainbow colors", "Collection of delicious foods"],
    s1e1s1: "Step 1 — Check the clarity of each group's definition:",
    s1e1aYes: "A — Set ✓:",
    s1e1aNo: "B — Not a set ✗:",
    s1e1cYes: "C — Set ✓:",
    s1e1dNo: "D — Not a set ✗:",
    s1e1aYesText: "Natural numbers less than 6 → definite:",
    s1e1aNoText: "\"Beautiful\" is subjective — every person has a different opinion.",
    s1e1cYesText: "Rainbow colors are definite: red, orange, yellow, green, blue, indigo, violet.",
    s1e1dNoText: "\"Delicious\" is very relative and subjective.",
    s1e1ans: "Answer: A and C are sets.",

    s1e2q: "Given the set",
    s1e2q2: "Determine whether each statement is true or false:",
    s1e2s1: "Step 1 — Identify the members of set P:",
    s1e2s1text: "Members of",
    s1e2s1text2: "are",
    s1e2s1text3: "(even numbers from 2 to 10).",
    s1e2s2: "Step 2 — Check each statement:",
    s1e2a: "→ TRUE (4 is a member of P)",
    s1e2b: "→ FALSE (7 is not a member of P; 7 is odd)",
    s1e2c: "→ FALSE (10 is indeed a member of P, not \"not a member\")",
    s1e2d: "→ TRUE (3 is indeed not a member of P)",

    s1e3q: "In a class of 30 students, set",
    s1e3q2: "= students who like soccer, set",
    s1e3q3: "= students who like basketball. Given",
    s1e3q4: "and",
    s1e3q5: "Find: (a) members who like both sports, (b) whether 'Lane'",
    s1e3q6: "or",
    s1e3q7: "(c) how many members are in",
    s1e3q8: "and how many in",
    s1e3s1: "Step 1 — Members in both A and B:",
    s1e3memberA: "Members of",
    s1e3memberB: "Members of",
    s1e3both: "In both:",
    s1e3bothAns: "River and Ash",
    s1e3s2: "Step 2 — Status of 'Lane':",
    s1e3laneNot: "'Lane' is not in the member list of",
    s1e3laneMath: "\\text{Lane} \\notin A",
    s1e3s3: "Step 3 — Count members:",
    s1e3notation: "Cardinality notation:",
    s1e3nA: "(5 members in A)",
    s1e3nB: "(4 members in B)",

    sub2: "Section 2: Set Notation & Representation",
    s2p1: "Sets are usually named with",
    s2p1b: "capital letters",
    s2p2: "such as",
    s2p3: "and their members are written using",
    s2p4: "curly braces",
    s2p5: ". There are",
    s2p6: "two main ways",
    s2p7: "to represent a set:",
    s2way1title: "① In Words (Description)",
    s2way1desc: "Describes membership using a sentence.",
    s2way1ex: "Example:",
    s2way1exText: "\"The set of natural numbers less than 5\"",
    s2way1means: "Meaning:",
    s2way2title: "② By Listing (Roster)",
    s2way2desc: "Lists all members one by one inside curly braces.",
    s2way2ex: "Example:",
    s2way2note: "(order doesn't matter, no duplicates)",
    s2rulesTitle: "Important Writing Rules:",
    s2rules: [
      "Each member is written only once (no duplicates)",
      "Members are separated by commas",
      "Order of members does not affect the set",
    ],
    s2rulesEnd: "is the same as",
    s2tip: "💡 Tip: For sets with very many or infinitely many members, use ellipsis (...) to represent the continuing pattern. Example: {2, 4, 6, 8, ...} for all positive even numbers.",

    s2e1q: "Express the following sets by listing:",
    s2e1opts: ["The set of vowels in the alphabet", "The set of natural numbers less than 8"],
    s2e1aTitle: "a. Vowels:",
    s2e1aDesc: "Description: \"The set of vowels in the alphabet\"",
    s2e1aRoster: "By listing:",
    s2e1bTitle: "b. Natural numbers less than 8:",
    s2e1bDesc: "Description: \"The set of natural numbers less than 8\"",
    s2e1bRoster: "By listing:",

    s2e2q1: "Given",
    s2e2q2: "Express set",
    s2e2q3: "in words! Then find",
    s2e2s1: "Step 1 — Find the pattern:",
    s2e2s2: "Step 2 — Formulate the description:",
    s2e2pattern: "Pattern: multiples of 3 from 3 to 15",
    s2e2words: "In words:",
    s2e2wordsText: "\"The set of multiples of 3 that are less than or equal to 15\"",
    s2e2s3: "Step 3 — Count the members:",
    s2e2count: "There are 5 members, so",

    s2e3q1: "Set",
    s2e3q2: "is defined in words as:",
    s2e3q3: "\"The set of prime numbers between 1 and 20\"",
    s2e3q4: "Set",
    s2e3q5: "is the set of even numbers between 10 and 20 (not including 10 and 20). Express",
    s2e3q6: "and",
    s2e3q7: "by listing, then find members in both sets!",
    s2e3s1: "Step 1 — List primes between 1 and 20:",
    s2e3primeNote: "Prime = divisible only by 1 and itself.",
    s2e3s2: "Step 2 — List even numbers between 10 and 20 (exclusive):",
    s2e3between: "Numbers between 10 and 20 (exclusive): 11, 12, 13, 14, 15, 16, 17, 18, 19",
    s2e3even: "Even ones: 12, 14, 16, 18",
    s2e3s3: "Step 3 — Find members in both K and L:",
    s2e3kMember: "Members of K: 2, 3, 5, 7, 11, 13, 17, 19",
    s2e3lMember: "Members of L: 12, 14, 16, 18",
    s2e3ans: "No members in common! (Sets K and L are disjoint)",
    s2e3ansNote: "Because primes > 2 are always odd, while all members of L are even.",

    sub3: "Section 3: Equal Sets",
    s3def: "Two sets are called",
    s3defSame: "equal",
    s3def2: "if and only if they have",
    s3def3: "exactly the same members",
    s3def4: "regardless of the order. The symbol used is",
    s3defFormal: "📌 Formal Definition:",
    s3defFormalText: "if every member of",
    s3defFormalText2: "is also a member of",
    s3defFormalText3: "and vice versa.",
    s3sameTitle: "✅ EQUAL Sets:",
    s3notSameTitle: "❌ NOT EQUAL Sets:",
    s3sameNote: "(same members, different order)",
    s3notSameNote: "(3rd member differs)",
    s3tip: "💡 Tip: Two sets are equal if they have the same count AND every member is identical. If even one differs, the sets are not equal!",

    s3e1q: "Determine whether each pair of sets is equal or not:",
    s3e1a: "Members are identical, order differs.",
    s3e1aConc: "✓",
    s3e1b: "The 3rd member differs.",
    s3e1bConc: "✗",
    s3e1andBoth: "is in R but not in S. Member",
    s3e1andBoth2: "is in S but not in R.",

    s3e2q1: "Set",
    s3e2q2: "is the set of factors of 12. Set",
    s3e2q3: "Is",
    s3e2q4: "? Explain!",
    s3e2s1: "Step 1 — Find all factors of 12:",
    s3e2s2: "Step 2 — Compare M and N:",
    s3e2ans: "All members are identical, so",

    s3e3q1: "Set",
    s3e3q2: "is the set of natural numbers whose square is less than 30. Set",
    s3e3q3: "Is",
    s3e3q4: "?",
    s3e3s1: "Step 1 — Determine members of X:",
    s3e3cond: "Find natural numbers",
    s3e3cond2: "such that",
    s3e3s2: "Step 2 — Compare X and Y:",
    s3e3ans: "Both sets are equal!",

    sub4: "Section 4: Finite, Empty & Infinite Sets",
    s4p1: "Based on",
    s4p1b: "the number of members",
    s4p2: "sets are divided into three types:",
    s4fin: "1️⃣ Finite Set",
    s4finDef: "A set with a definite, countable number of members. Notation:",
    s4finEx: "for some non-negative integer",
    s4empty: "2️⃣ Empty Set",
    s4emptyDef: "A set with",
    s4emptyDefB: "no members at all",
    s4emptyDef2: ". Written",
    s4emptyDef3: "and",
    s4emptyWarn: "⚠️ Warning:",
    s4emptyWarnText: "is NOT an empty set! It has one member: the number 0.",
    s4inf: "3️⃣ Infinite Set",
    s4infDef: "A set with",
    s4infDefB: "an unlimited number of members",
    s4infDef2: ". Always uses",
    s4infDef3: "when listed.",
    s4tip: "💡 Tip: Easy way to tell: if you can count to the end → finite. If it goes on forever → infinite. If it has no content at all → empty!",

    s4e1q: "Classify each set (finite, empty, or infinite):",
    s4e1opts: ["Set of days in a week", "Set of negative integers", "Set of natural numbers between 5 and 6"],
    s4e1a: "Days in a week: Mon, Tue, Wed, Thu, Fri, Sat, Sun → 7 days.",
    s4e1aType: "Finite",
    s4e1b: "Negative integers: ... goes on forever.",
    s4e1bType: "Infinite",
    s4e1c: "Natural numbers between 5 and 6 → none exist.",
    s4e1cType: "Empty Set",

    s4e2q1: "Set",
    s4e2q2: "is the set of odd numbers between 10 and 22. Find the members of",
    s4e2q3: ", the type, and the value of",
    s4e2s1: "Step 1 — List odd numbers between 10 and 22:",
    s4e2between: "Numbers between 10 and 22: 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21",
    s4e2odd: "Odd ones: 11, 13, 15, 17, 19, 21",
    s4e2s2: "Step 2 — Determine type and count:",
    s4e2canCount: "Set T has a countable, finite number of members.",
    s4e2type: "Type: Finite Set",

    s4e3q: "For each set definition below, determine its type (finite/empty/infinite) and give your reason!",
    s4e3opts: ["Set of integers whose square equals", "Set of multiples of 7 greater than 0", "Set of prime numbers between 1 and 50"],
    s4e3aTitle: "a. Integers whose square = -4:",
    s4e3aText: "The square of any number is always ≥ 0, never negative. No integer satisfies",
    s4e3aType: "Type: Empty Set →",
    s4e3bTitle: "b. Multiples of 7 greater than 0:",
    s4e3bText: "Multiples of 7 are unlimited (7, 14, 21, ... continues without end).",
    s4e3bType: "Type: Infinite Set",
    s4e3cTitle: "c. Primes between 1 and 50:",
    s4e3cText: "There is an upper limit (50), so the members can be fully counted.",
    s4e3cType: "Type: Finite Set",
  },

  ja: {
    title: "集合の定義と要素",
    breadcrumb: "中学1年 · 集合 · 数学教材",
    back: "集合に戻る",
    easy: "基本", medium: "標準", hard: "発展",
    summary: "📌 まとめ",
    problems: "📝 練習問題と解説",
    solution: "解説",
    example: "例題",
    step: "ステップ",

    introTitle: "集合とは？なぜ重要？",
    introP: "部屋を片付けて、物をグループに分けていることを想像してください：本は本棚に、服はタンスに、おもちゃは箱に。気づかないうちに",
    introHimpunan: "集合",
    introP2: "を作っていたのです！数学では、この概念にはより明確なルールがあり、日常生活に非常に役立ちます。",
    introFact: "🚀 楽しい事実：集合論は、ドイツの数学者",
    introCantor: "ゲオルク・カントール",
    introFactEnd: "によって1870年代に初めて開発されました。彼は「現代集合論の父」と考えられています！",

    sub1: "第1節：集合の定義",
    s1defTitle: "📌 まとめ",
    s1def: "とは、",
    s1def2: "明確で厳密な定義",
    s1def3: "を持つ物の集まりで、ある物がそのグループに属するかどうかを確実に決められるものです。",
    s1yes: "✅ これは集合：",
    s1no: "❌ これは集合ではない：",
    s1yesList: ["素数の集まり", "母音の集まり", "中学1年A組の生徒の集まり", "正の偶数の集まり"],
    s1noList: ["頭のいい生徒の集まり（主観的！）", "おいしい食べ物の集まり（不明確）", "背が高い人の集まり（相対的）", "美しい色の集まり（不確か）"],
    s1memberTitle: "要素の記号：",
    s1memberIn: "属する",
    s1memberInText: "の要素",
    s1memberOut: "属さない",
    s1memberOutText: "の要素ではない",
    s1tip: "💡 コツ：集合のカギは「明確さ」です。まず「この物が属するかどうか確実に決められるか？」と問いなさい。できるなら → 集合。人の意見による → 集合ではない！",

    s1e1q: "次のグループのうち、どれが集合ですか？",
    s1e1opts: ["6未満の自然数の集まり", "きれいな芸能人の集まり", "虹の色の集まり", "おいしい食べ物の集まり"],
    s1e1s1: "ステップ1 — 各グループの定義の明確さを確認:",
    s1e1aYes: "A — 集合 ✓：",
    s1e1aNo: "B — 集合ではない ✗：",
    s1e1cYes: "C — 集合 ✓：",
    s1e1dNo: "D — 集合ではない ✗：",
    s1e1aYesText: "6未満の自然数 → 確実：",
    s1e1aNoText: "「きれい」は主観的で、人によって意見が異なります。",
    s1e1cYesText: "虹の色は確実：赤、橙、黄、緑、青、藍、紫。",
    s1e1dNoText: "「おいしい」は非常に相対的で主観的です。",
    s1e1ans: "答え：AとCが集合です。",

    s1e2q: "集合",
    s1e2q2: "が与えられています。次の命題が真か偽か答えなさい：",
    s1e2s1: "ステップ1 — 集合Pの要素を確認:",
    s1e2s1text: "集合",
    s1e2s1text2: "の要素は",
    s1e2s1text3: "（2から10の偶数）です。",
    s1e2s2: "ステップ2 — 一つずつ確認:",
    s1e2a: "→ 真（4はPの要素）",
    s1e2b: "→ 偽（7はPの要素ではない；7は奇数）",
    s1e2c: "→ 偽（10は確かにPの要素であり「要素でない」わけではない）",
    s1e2d: "→ 真（3は確かにPの要素ではない）",

    s1e3q: "30人のクラスで、集合",
    s1e3q2: "＝サッカーが好きな生徒、集合",
    s1e3q3: "＝バスケットボールが好きな生徒。",
    s1e3q4: "および",
    s1e3q5: "求めよ：(a) 両方のスポーツが好きな要素、(b) 「Lane」が",
    s1e3q6: "または",
    s1e3q7: "(c)",
    s1e3q8: "の要素数はそれぞれ何人？",
    s1e3s1: "ステップ1 — AとBの両方にある要素:",
    s1e3memberA: "集合",
    s1e3memberB: "集合",
    s1e3both: "両方にある：",
    s1e3bothAns: "RiverとAsh",
    s1e3s2: "ステップ2 — 「Lane」の状況:",
    s1e3laneNot: "「Lane」は集合",
    s1e3laneMath: "\\text{Lane} \\notin A",
    s1e3s3: "ステップ3 — 要素数:",
    s1e3notation: "要素数の記法：",
    s1e3nA: "（Aに5つの要素）",
    s1e3nB: "（Bに4つの要素）",

    sub2: "第2節：集合の記法と表し方",
    s2p1: "集合は通常",
    s2p1b: "大文字",
    s2p2: "（例：",
    s2p3: "）で名前をつけ、要素は",
    s2p4: "波かっこ",
    s2p5: "で書きます。集合を表す",
    s2p6: "2つの主な方法",
    s2p7: "があります：",
    s2way1title: "① 言葉による表し方（記述法）",
    s2way1desc: "文を使って要素の条件を説明します。",
    s2way1ex: "例：",
    s2way1exText: "「5未満の自然数の集合」",
    s2way1means: "意味：",
    s2way2title: "② 列挙による表し方（外延法）",
    s2way2desc: "波かっこの中に要素を一つずつ書きます。",
    s2way2ex: "例：",
    s2way2note: "（順序は問わず、重複なし）",
    s2rulesTitle: "重要な書き方のルール：",
    s2rules: [
      "各要素は一度だけ書く（重複なし）",
      "要素はカンマで区切る",
      "要素の順序は集合に影響しない",
    ],
    s2rulesEnd: "は",
    s2tip: "💡 コツ：要素が非常に多いか無限の集合には、継続するパターンを表す省略記号（...）を使います。例：{2, 4, 6, 8, ...} はすべての正の偶数。",

    s2e1q: "次の集合を列挙法で表しなさい：",
    s2e1opts: ["アルファベットの母音の集合", "8未満の自然数の集合"],
    s2e1aTitle: "a. 母音：",
    s2e1aDesc: "記述：「アルファベットの母音の集合」",
    s2e1aRoster: "列挙法：",
    s2e1bTitle: "b. 8未満の自然数：",
    s2e1bDesc: "記述：「8未満の自然数の集合」",
    s2e1bRoster: "列挙法：",

    s2e2q1: "",
    s2e2q2: "集合",
    s2e2q3: "を言葉で表しなさい！次に",
    s2e2s1: "ステップ1 — パターンを探す:",
    s2e2s2: "ステップ2 — 記述を作る:",
    s2e2pattern: "パターン：3から15までの3の倍数",
    s2e2words: "言葉で：",
    s2e2wordsText: "「15以下の3の倍数の集合」",
    s2e2s3: "ステップ3 — 要素数を数える:",
    s2e2count: "5つの要素があるので",

    s2e3q1: "集合",
    s2e3q2: "は言葉で次のように定義されています：",
    s2e3q3: "「1から20の間の素数の集合」",
    s2e3q4: "集合",
    s2e3q5: "は10から20の間の偶数の集合（10と20は含まない）。",
    s2e3q6: "と",
    s2e3q7: "を列挙法で表し、両方の集合に共通する要素を求めなさい！",
    s2e3s1: "ステップ1 — 1から20の間の素数を列挙:",
    s2e3primeNote: "素数 = 1と自分自身でしか割り切れない数。",
    s2e3s2: "ステップ2 — 10から20の間の偶数を列挙（排他的）:",
    s2e3between: "10から20の間の数（排他的）：11, 12, 13, 14, 15, 16, 17, 18, 19",
    s2e3even: "偶数のもの：12, 14, 16, 18",
    s2e3s3: "ステップ3 — KとLの共通要素を求める:",
    s2e3kMember: "Kの要素：2, 3, 5, 7, 11, 13, 17, 19",
    s2e3lMember: "Lの要素：12, 14, 16, 18",
    s2e3ans: "共通要素なし！（KとLは互いに素）",
    s2e3ansNote: "2より大きい素数は常に奇数で、Lの要素はすべて偶数だから。",

    sub3: "第3節：等しい集合",
    s3def: "2つの集合が",
    s3defSame: "等しい",
    s3def2: "とは、書く順序に関わらず",
    s3def3: "まったく同じ要素",
    s3def4: "を持つ場合に限ります。使う記号は",
    s3defFormal: "📌 形式的な定義：",
    s3defFormalText: "のすべての要素が",
    s3defFormalText2: "の要素でもあり、",
    s3defFormalText3: "その逆も成り立つとき。",
    s3sameTitle: "✅ 等しい集合：",
    s3notSameTitle: "❌ 等しくない集合：",
    s3sameNote: "（要素は同じ、順序が違う）",
    s3notSameNote: "（3番目の要素が異なる）",
    s3tip: "💡 コツ：2つの集合は要素数が同じで、かつすべての要素が一致する場合に等しい。1つでも違えば等しくない！",

    s3e1q: "次の集合の組が等しいかどうか答えなさい：",
    s3e1a: "要素は同じで、順序が違います。",
    s3e1aConc: "✓",
    s3e1b: "3番目の要素が異なります。",
    s3e1bConc: "✗",
    s3e1andBoth: "はRにあってSにない。要素",
    s3e1andBoth2: "はSにあってRにない。",

    s3e2q1: "集合",
    s3e2q2: "は12の約数の集合。集合",
    s3e2q3: "",
    s3e2q4: "か？説明しなさい！",
    s3e2s1: "ステップ1 — 12のすべての約数を求める:",
    s3e2s2: "ステップ2 — MとNを比較:",
    s3e2ans: "すべての要素が一致するので",

    s3e3q1: "集合",
    s3e3q2: "は二乗が30未満となる自然数の集合。集合",
    s3e3q3: "",
    s3e3q4: "か？",
    s3e3s1: "ステップ1 — Xの要素を求める:",
    s3e3cond: "自然数",
    s3e3cond2: "で",
    s3e3s2: "ステップ2 — XとYを比較:",
    s3e3ans: "2つの集合は等しい！",

    sub4: "第4節：有限集合・空集合・無限集合",
    s4p1: "要素の",
    s4p1b: "個数に基づいて",
    s4p2: "集合は3種類に分けられます：",
    s4fin: "1️⃣ 有限集合",
    s4finDef: "要素の個数が有限で数え終わることができる集合。記法：",
    s4finEx: "（ある非負整数",
    s4empty: "2️⃣ 空集合",
    s4emptyDef: "要素が",
    s4emptyDefB: "まったくない",
    s4emptyDef2: "集合。",
    s4emptyDef3: "と書き、",
    s4emptyWarn: "⚠️ 注意：",
    s4emptyWarnText: "は空集合ではありません！要素が1つあります：数字の0。",
    s4inf: "3️⃣ 無限集合",
    s4infDef: "要素の個数が",
    s4infDefB: "無限である",
    s4infDef2: "集合。列挙するときは必ず",
    s4infDef3: "を使います。",
    s4tip: "💡 コツ：簡単な見分け方：最後まで数えられる → 有限集合。終わりがない → 無限集合。中身がない → 空集合！",

    s4e1q: "次の集合の種類（有限・空・無限）を分類しなさい：",
    s4e1opts: ["1週間の日の集合", "負の整数の集合", "5と6の間の自然数の集合"],
    s4e1a: "1週間の日：月、火、水、木、金、土、日 → 7日。",
    s4e1aType: "有限集合",
    s4e1b: "負の整数：... 終わりがない。",
    s4e1bType: "無限集合",
    s4e1c: "5と6の間の自然数 → 存在しない。",
    s4e1cType: "空集合",

    s4e2q1: "集合",
    s4e2q2: "は10から22の間の奇数の集合。集合",
    s4e2q3: "の要素・種類・",
    s4e2s1: "ステップ1 — 10から22の間の奇数を列挙:",
    s4e2between: "10から22の間の数：11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21",
    s4e2odd: "奇数：11, 13, 15, 17, 19, 21",
    s4e2s2: "ステップ2 — 種類と要素数を決める:",
    s4e2canCount: "集合Tの要素は数え終わることができます。",
    s4e2type: "種類：有限集合",

    s4e3q: "次の集合の定義について、種類（有限/空/無限）とその理由を答えなさい！",
    s4e3opts: ["二乗が", "に等しい整数の集合", "0より大きい7の倍数の集合", "1から50の間の素数の集合"],
    s4e3aTitle: "a. 二乗が -4 に等しい整数：",
    s4e3aText: "どんな数の二乗も常に ≥ 0 で、負にはなりません。",
    s4e3aType: "種類：空集合 →",
    s4e3bTitle: "b. 0より大きい7の倍数：",
    s4e3bText: "7の倍数には限りがありません（7, 14, 21, ... 際限なく続く）。",
    s4e3bType: "種類：無限集合",
    s4e3cTitle: "c. 1から50の間の素数：",
    s4e3cText: "上限（50）があるので、要素を数え終わることができます。",
    s4e3cType: "種類：有限集合",
  },
};

const PengertianKeanggotaanPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = language as "id" | "en" | "ja";
  const t = translations[lang];

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "pengertian", "notasi", "kesamaan", "jenis",
  ]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const SectionToggle = ({ id, icon, label, iconColor }: { id: string; icon: React.ReactNode; label: string; iconColor: string }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{label}</span>
      </div>
      {true ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  const easyBadge   = <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t.easy}</span>;
  const mediumBadge = <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{t.medium}</span>;
  const hardBadge   = <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{t.hard}</span>;

  // Set A and B members (same names all 3 languages)
  const setALatex = "A = \\{\\text{Kai, River, Rowan, Skyler, Ash}\\}";
  const setBLatex = "B = \\{\\text{River, Ash, Finley, Eden}\\}";

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.breadcrumb}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── INTRO ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("intro")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">{t.introTitle}</span>
              </div>
              {true ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.introP} <strong className="text-primary"> {t.introHimpunan}</strong>{t.introP2}
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    {t.introFact} <strong>{t.introCantor}</strong> {t.introFactEnd}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 1: PENGERTIAN ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionToggle id="pengertian" icon={<Target className="w-5 h-5" />} label={t.sub1} iconColor="text-green-400" />
            {true && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">{t.s1defTitle}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-green-300">{lang === "id" ? "Himpunan" : lang === "en" ? "A set" : "集合"}</strong>{" "}
                    {t.s1def} <strong>{t.s1def2}</strong>, {t.s1def3}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="bg-green-900/30 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-green-400 mb-1">{t.s1yes}</p>
                      <ul className="font-body text-xs text-white/70 space-y-1 list-disc list-inside">
                        {t.s1yesList.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                    <div className="bg-red-900/30 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-red-400 mb-1">{t.s1no}</p>
                      <ul className="font-body text-xs text-white/70 space-y-1 list-disc list-inside">
                        {t.s1noList.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-cyan-300">{t.s1memberTitle}</p>
                    <p className="font-body text-sm text-white/80">
                      {lang === "id" ? "Jika objek" : lang === "en" ? "If object" : "物体"}{" "}
                      <InlineMath math="x" />{" "}
                      <strong>{t.s1memberIn}</strong>{" "}
                      {lang === "id" ? "dalam himpunan" : lang === "en" ? "the set" : "が集合"}{" "}
                      <InlineMath math="A" />, {lang === "id" ? "ditulis:" : lang === "en" ? "written:" : "書き方："}{" "}
                      <InlineMath math="x \in A" /> ({lang === "id" ? `"x ${t.s1memberInText} A"` : lang === "en" ? `"x ${t.s1memberInText} A"` : `「x は A ${t.s1memberInText}」`})
                    </p>
                    <p className="font-body text-sm text-white/80">
                      {lang === "id" ? "Jika objek" : lang === "en" ? "If object" : "物体"}{" "}
                      <InlineMath math="x" />{" "}
                      <strong>{t.s1memberOut}</strong>{" "}
                      {lang === "id" ? "dalam himpunan" : lang === "en" ? "the set" : "が集合"}{" "}
                      <InlineMath math="A" />, {lang === "id" ? "ditulis:" : lang === "en" ? "written:" : "書き方："}{" "}
                      <InlineMath math="x \notin A" /> ({lang === "id" ? `"x ${t.s1memberOutText} A"` : lang === "en" ? `"x ${t.s1memberOutText} A"` : `「x は A ${t.s1memberOutText}」`})
                    </p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-body text-xs text-yellow-200">{t.s1tip}</p>
                  </div>
                </div>

                <p className="font-body text-sm font-semibold text-white">{t.problems}</p>

                {/* E1 Easy */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{easyBadge}<span className="font-body font-semibold text-white">{t.example} 1</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.s1e1q}</p>
                    <ul className="font-body text-sm text-white/80 mt-2 space-y-1 list-[upper-alpha] list-inside">
                      {t.s1e1opts.map((o, i) => <li key={i}>{o}</li>)}
                    </ul>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.s1e1s1}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p><strong className="text-green-400">{t.s1e1aYes}</strong> {t.s1e1aYesText} <InlineMath math="\{1,2,3,4,5\}" />.</p>
                        <p><strong className="text-red-400">{t.s1e1aNo}</strong> {t.s1e1aNoText}</p>
                        <p><strong className="text-green-400">{t.s1e1cYes}</strong> {t.s1e1cYesText}</p>
                        <p><strong className="text-red-400">{t.s1e1dNo}</strong> {t.s1e1dNoText}</p>
                      </div>
                      <p className="text-primary font-semibold">{t.s1e1ans}</p>
                    </div>
                  </div>
                </div>

                {/* E2 Medium */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="font-body font-semibold text-white">{t.example} 2</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {t.s1e2q} <InlineMath math="P = \{2, 4, 6, 8, 10\}" />. {t.s1e2q2}
                    </p>
                    <ul className="font-body text-sm text-white/80 mt-2 space-y-1 list-[lower-alpha] list-inside">
                      <li><InlineMath math="4 \in P" /></li>
                      <li><InlineMath math="7 \in P" /></li>
                      <li><InlineMath math="10 \notin P" /></li>
                      <li><InlineMath math="3 \notin P" /></li>
                    </ul>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.s1e2s1}</strong></p>
                      <p>{t.s1e2s1text} <InlineMath math="P" /> {t.s1e2s1text2} <InlineMath math="2, 4, 6, 8, 10" /> {t.s1e2s1text3}</p>
                      <p><strong>{t.s1e2s2}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>a. <InlineMath math="4 \in P" /> → <strong className="text-green-400">{t.s1e2a}</strong></p>
                        <p>b. <InlineMath math="7 \in P" /> → <strong className="text-red-400">{t.s1e2b}</strong></p>
                        <p>c. <InlineMath math="10 \notin P" /> → <strong className="text-red-400">{t.s1e2c}</strong></p>
                        <p>d. <InlineMath math="3 \notin P" /> → <strong className="text-green-400">{t.s1e2d}</strong></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* E3 Hard — Kai, River, Rowan, Skyler, Ash / River, Ash, Finley, Eden / Lane */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{hardBadge}<span className="font-body font-semibold text-white">{t.example} 3</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {t.s1e3q} <InlineMath math="A" /> {t.s1e3q2} <InlineMath math="B" /> {t.s1e3q3}{" "}
                      <InlineMath math={setALatex} /> {t.s1e3q4} <InlineMath math={setBLatex} />.{" "}
                      {t.s1e3q5} <InlineMath math="\in A" /> {t.s1e3q6} <InlineMath math="\notin A" />,{" "}
                      {t.s1e3q7} <InlineMath math="A" /> {t.s1e3q8} <InlineMath math="B" />?
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{t.s1e3s1}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>{t.s1e3memberA} <InlineMath math="A" />: Kai, River, Rowan, Skyler, Ash</p>
                        <p>{t.s1e3memberB} <InlineMath math="B" />: River, Ash, Finley, Eden</p>
                        <p className="mt-1">{t.s1e3both} <strong className="text-primary">{t.s1e3bothAns}</strong></p>
                      </div>
                      <p><strong>{t.s1e3s2}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>{t.s1e3laneNot} <InlineMath math="A" />{lang === "ja" ? "のリストにありません" : lang === "en" ? ", so:" : ", maka:"}</p>
                        <p className="text-primary font-semibold"><InlineMath math={t.s1e3laneMath} /></p>
                      </div>
                      <p><strong>{t.s1e3s3}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>{t.s1e3notation} <InlineMath math="n(A)" /> {lang === "ja" ? "と" : lang === "en" ? "and" : "dan"} <InlineMath math="n(B)" /></p>
                        <p><InlineMath math="n(A) = 5" /> {t.s1e3nA}</p>
                        <p><InlineMath math="n(B) = 4" /> {t.s1e3nB}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 2: NOTASI ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionToggle id="notasi" icon={<Layers className="w-5 h-5" />} label={t.sub2} iconColor="text-blue-400" />
            {true && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-blue-300">{t.summary}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.s2p1} <strong className="text-blue-300">{t.s2p1b}</strong>{" "}
                    {t.s2p2} <InlineMath math="A, B, C, ..." />{" "}
                    {t.s2p3} <strong className="text-blue-300">{t.s2p4}</strong>{" "}
                    <InlineMath math="\{ \, \}" />{t.s2p5}{t.s2p6}{t.s2p7}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-blue-900/30 rounded-lg p-3 space-y-2">
                      <p className="font-body text-xs font-semibold text-blue-400">{t.s2way1title}</p>
                      <p className="font-body text-xs text-white/70">{t.s2way1desc}</p>
                      <div className="bg-slate-900/50 rounded p-2">
                        <p className="font-body text-xs text-white/80">{t.s2way1ex} <em>{t.s2way1exText}</em></p>
                        <p className="font-body text-xs text-white/80 mt-1">{t.s2way1means} <InlineMath math="\{1, 2, 3, 4\}" /></p>
                      </div>
                    </div>
                    <div className="bg-purple-900/30 rounded-lg p-3 space-y-2">
                      <p className="font-body text-xs font-semibold text-purple-400">{t.s2way2title}</p>
                      <p className="font-body text-xs text-white/70">{t.s2way2desc}</p>
                      <div className="bg-slate-900/50 rounded p-2">
                        <p className="font-body text-xs text-white/80">{t.s2way2ex} <InlineMath math="A = \{1, 2, 3, 4\}" /></p>
                        <p className="font-body text-xs text-white/70 mt-1">{t.s2way2note}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-cyan-300">{t.s2rulesTitle}</p>
                    <ul className="font-body text-xs text-white/70 space-y-1 list-disc list-inside">
                      {t.s2rules.map((r, i) => <li key={i}>{r}</li>)}
                      <li><InlineMath math="\{1,2,3\}" /> {t.s2rulesEnd} <InlineMath math="\{3,1,2\}" /></li>
                    </ul>
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
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div>
                        <p><strong>{t.s2e1aTitle}</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <p>{t.s2e1aDesc}</p>
                          <p className="text-primary mt-1">{t.s2e1aRoster} <InlineMath math="V = \{a, i, u, e, o\}" /></p>
                        </div>
                      </div>
                      <div>
                        <p><strong>{t.s2e1bTitle}</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <p>{t.s2e1bDesc}</p>
                          <p className="text-primary mt-1">{t.s2e1bRoster} <InlineMath math="A = \{1, 2, 3, 4, 5, 6, 7\}" /></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* E2 Medium */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="font-body font-semibold text-white">{t.example} 2</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {t.s2e2q1} <InlineMath math="B = \{3, 6, 9, 12, 15\}" />. {t.s2e2q2} <InlineMath math="B" /> {t.s2e2q3} <InlineMath math="n(B)" />.
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.s2e2s1}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p><InlineMath math="3 = 3 \times 1" /></p>
                        <p><InlineMath math="6 = 3 \times 2" /></p>
                        <p><InlineMath math="9 = 3 \times 3" /></p>
                        <p><InlineMath math="12 = 3 \times 4" /></p>
                        <p><InlineMath math="15 = 3 \times 5" /></p>
                      </div>
                      <p><strong>{t.s2e2s2}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-primary">{t.s2e2pattern}</p>
                        <p className="mt-1">{t.s2e2words} <em>{t.s2e2wordsText}</em></p>
                      </div>
                      <p><strong>{t.s2e2s3}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>{t.s2e2count} <InlineMath math="n(B) = 5" /></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* E3 Hard */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{hardBadge}<span className="font-body font-semibold text-white">{t.example} 3</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {t.s2e3q1} <InlineMath math="K" /> {t.s2e3q2} {t.s2e3q3}. {t.s2e3q4} <InlineMath math="L" /> {t.s2e3q5} <InlineMath math="K" /> {t.s2e3q6} <InlineMath math="L" /> {t.s2e3q7}
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{t.s2e3s1}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>{t.s2e3primeNote}</p>
                        <p>2, 3, 5, 7, 11, 13, 17, 19</p>
                        <p className="text-primary mt-1"><InlineMath math="K = \{2, 3, 5, 7, 11, 13, 17, 19\}" /></p>
                      </div>
                      <p><strong>{t.s2e3s2}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>{t.s2e3between}</p>
                        <p>{t.s2e3even}</p>
                        <p className="text-primary mt-1"><InlineMath math="L = \{12, 14, 16, 18\}" /></p>
                      </div>
                      <p><strong>{t.s2e3s3}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>{t.s2e3kMember}</p>
                        <p>{t.s2e3lMember}</p>
                        <p className="text-primary font-semibold mt-1">{t.s2e3ans}</p>
                        <p className="text-white/60 text-xs mt-1">{t.s2e3ansNote}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 3: KESAMAAN ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionToggle id="kesamaan" icon={<Star className="w-5 h-5" />} label={t.sub3} iconColor="text-purple-400" />
            {true && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">{t.summary}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.s3def} <strong className="text-purple-300">{t.s3defSame}</strong> {t.s3def2} <strong>{t.s3def3}</strong>, {t.s3def4} <InlineMath math="=" />.
                  </p>
                  <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs font-semibold text-cyan-300">{t.s3defFormal}</p>
                    <p className="font-body text-sm text-white/80">
                      <InlineMath math="A = B" /> {t.s3defFormalText} <InlineMath math="A" /> {t.s3defFormalText2} <InlineMath math="B" />, {t.s3defFormalText3}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-green-900/30 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-green-400 mb-2">{t.s3sameTitle}</p>
                      <p className="font-body text-xs text-white/70"><InlineMath math="A = \{1, 2, 3\}" /></p>
                      <p className="font-body text-xs text-white/70"><InlineMath math="B = \{3, 1, 2\}" /></p>
                      <p className="font-body text-xs text-green-400 mt-1"><InlineMath math="A = B" /> ✓ {t.s3sameNote}</p>
                    </div>
                    <div className="bg-red-900/30 rounded-lg p-3">
                      <p className="font-body text-xs font-semibold text-red-400 mb-2">{t.s3notSameTitle}</p>
                      <p className="font-body text-xs text-white/70"><InlineMath math="C = \{1, 2, 3\}" /></p>
                      <p className="font-body text-xs text-white/70"><InlineMath math="D = \{1, 2, 4\}" /></p>
                      <p className="font-body text-xs text-red-400 mt-1"><InlineMath math="C \neq D" /> ✗ {t.s3notSameNote}</p>
                    </div>
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
                    <ul className="font-body text-sm text-white/80 mt-2 space-y-2 list-[lower-alpha] list-inside">
                      <li><InlineMath math="P = \{a, b, c, d\}" /> {lang === "id" ? "dan" : lang === "en" ? "and" : "と"} <InlineMath math="Q = \{d, c, a, b\}" /></li>
                      <li><InlineMath math="R = \{1, 2, 3, 4\}" /> {lang === "id" ? "dan" : lang === "en" ? "and" : "と"} <InlineMath math="S = \{1, 2, 3, 5\}" /></li>
                    </ul>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div>
                        <p><strong>a. P {lang === "en" ? "vs" : "vs"} Q:</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <p>{t.s3e1a}</p>
                          <p className="text-green-400 font-semibold"><InlineMath math="P = Q" /> {t.s3e1aConc}</p>
                        </div>
                      </div>
                      <div>
                        <p><strong>b. R {lang === "en" ? "vs" : "vs"} S:</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <p>R: 1, 2, 3, <strong className="text-red-400">4</strong></p>
                          <p>S: 1, 2, 3, <strong className="text-red-400">5</strong></p>
                          <p>{lang === "id" ? "Anggota" : lang === "en" ? "Member" : "要素"} "4" {t.s3e1andBoth} "5" {t.s3e1andBoth2}</p>
                          <p className="text-red-400 font-semibold"><InlineMath math="R \neq S" /> {t.s3e1bConc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* E2 Medium */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="font-body font-semibold text-white">{t.example} 2</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {t.s3e2q1} <InlineMath math="M" /> {t.s3e2q2}. {t.s3e2q2.includes("N") ? "" : ""}<InlineMath math="N = \{1, 2, 3, 4, 6, 12\}" />. {t.s3e2q3} <InlineMath math="M = N" />{t.s3e2q4}
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.s3e2s1}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p><InlineMath math="12 = 1 \times 12" /></p>
                        <p><InlineMath math="12 = 2 \times 6" /></p>
                        <p><InlineMath math="12 = 3 \times 4" /></p>
                        <p className="text-primary mt-1"><InlineMath math="M = \{1, 2, 3, 4, 6, 12\}" /></p>
                      </div>
                      <p><strong>{t.s3e2s2}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p><InlineMath math="M = \{1, 2, 3, 4, 6, 12\}" /></p>
                        <p><InlineMath math="N = \{1, 2, 3, 4, 6, 12\}" /></p>
                        <p className="text-green-400 font-semibold mt-1">{t.s3e2ans} <InlineMath math="M = N" /> ✓</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* E3 Hard */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{hardBadge}<span className="font-body font-semibold text-white">{t.example} 3</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {t.s3e3q1} <InlineMath math="X" /> {t.s3e3q2} <InlineMath math="Y = \{1, 2, 3, 4, 5\}" />. {t.s3e3q3} <InlineMath math="X = Y" />{t.s3e3q4}
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{t.s3e3s1}</strong></p>
                      <p>{t.s3e3cond} <InlineMath math="n" /> {t.s3e3cond2} <InlineMath math="n^2 < 30" />:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p><InlineMath math="1^2 = 1 < 30" /> ✓</p>
                        <p><InlineMath math="2^2 = 4 < 30" /> ✓</p>
                        <p><InlineMath math="3^2 = 9 < 30" /> ✓</p>
                        <p><InlineMath math="4^2 = 16 < 30" /> ✓</p>
                        <p><InlineMath math="5^2 = 25 < 30" /> ✓</p>
                        <p><InlineMath math="6^2 = 36 \geq 30" /> ✗</p>
                        <p className="text-primary mt-1"><InlineMath math="X = \{1, 2, 3, 4, 5\}" /></p>
                      </div>
                      <p><strong>{t.s3e3s2}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p><InlineMath math="X = \{1, 2, 3, 4, 5\}" /></p>
                        <p><InlineMath math="Y = \{1, 2, 3, 4, 5\}" /></p>
                        <p className="text-green-400 font-semibold mt-1"><InlineMath math="X = Y" /> ✓ {t.s3e3ans}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── SUB-BAB 4: JENIS HIMPUNAN ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button onClick={() => toggleSection("jenis")} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">{t.sub4}</span>
              </div>
              {true ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
            </button>
            {true && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-orange-300">{t.summary}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.s4p1} <strong>{t.s4p1b}</strong>, {t.s4p2}
                  </p>
                  <div className="space-y-3">
                    <div className="bg-green-900/30 border border-green-700/30 rounded-lg p-3">
                      <p className="font-body text-sm font-semibold text-green-400 mb-1">{t.s4fin}</p>
                      <p className="font-body text-sm text-white/80">
                        {t.s4finDef} <InlineMath math="n(A) = k" /> {t.s4finEx} <InlineMath math="k" />{lang === "ja" ? "）。" : "."}</p>
                      <div className="bg-slate-900/50 rounded p-2 mt-2 space-y-1">
                        <p className="font-body text-xs text-white/70">{lang === "id" ? "Contoh:" : lang === "en" ? "Example:" : "例："} <InlineMath math="A = \{2, 4, 6, 8\}" />, {lang === "id" ? "maka" : lang === "en" ? "so" : "よって"} <InlineMath math="n(A) = 4" /></p>
                        <p className="font-body text-xs text-white/70">{lang === "id" ? "Contoh:" : lang === "en" ? "Example:" : "例："} <InlineMath math="B = \{a, b, c, d, e\}" />, {lang === "id" ? "maka" : lang === "en" ? "so" : "よって"} <InlineMath math="n(B) = 5" /></p>
                      </div>
                    </div>
                    <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-3">
                      <p className="font-body text-sm font-semibold text-slate-300 mb-1">{t.s4empty}</p>
                      <p className="font-body text-sm text-white/80">
                        {t.s4emptyDef} <strong>{t.s4emptyDefB}</strong>{t.s4emptyDef2} <InlineMath math="\emptyset" /> {lang === "id" ? "atau" : lang === "en" ? "or" : "または"} <InlineMath math="\{\}" />{t.s4emptyDef3} <InlineMath math="n(\emptyset) = 0" />.
                      </p>
                      <div className="bg-slate-900/50 rounded p-2 mt-2 space-y-1">
                        <p className="font-body text-xs text-white/70">{lang === "id" ? "Contoh:" : lang === "en" ? "Example:" : "例："} {lang === "id" ? "Himpunan bilangan prima yang genap selain 2 →" : lang === "en" ? "Set of even primes other than 2 →" : "2以外の偶数の素数の集合 →"} <InlineMath math="\emptyset" /></p>
                        <p className="font-body text-xs text-white/70">{lang === "id" ? "Contoh:" : lang === "en" ? "Example:" : "例："} {lang === "id" ? "Himpunan bilangan asli antara 3 dan 4 →" : lang === "en" ? "Set of natural numbers between 3 and 4 →" : "3と4の間の自然数の集合 →"} <InlineMath math="\emptyset" /></p>
                        <p className="font-body text-xs text-red-400 mt-1">
                          {t.s4emptyWarn} <InlineMath math="\{0\}" /> {t.s4emptyWarnText}
                        </p>
                      </div>
                    </div>
                    <div className="bg-blue-900/30 border border-blue-700/30 rounded-lg p-3">
                      <p className="font-body text-sm font-semibold text-blue-400 mb-1">{t.s4inf}</p>
                      <p className="font-body text-sm text-white/80">
                        {t.s4infDef} <strong>{t.s4infDefB}</strong>{t.s4infDef2} <InlineMath math="..." /> {t.s4infDef3}
                      </p>
                      <div className="bg-slate-900/50 rounded p-2 mt-2 space-y-1">
                        <p className="font-body text-xs text-white/70">{lang === "id" ? "Contoh:" : lang === "en" ? "Example:" : "例："} <InlineMath math="\mathbb{N} = \{1, 2, 3, 4, 5, ...\}" /></p>
                        <p className="font-body text-xs text-white/70">{lang === "id" ? "Contoh:" : lang === "en" ? "Example:" : "例："} <InlineMath math="G = \{2, 4, 6, 8, ...\}" /></p>
                      </div>
                    </div>
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
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{t.solution}:</p>
                    <div className="bg-slate-900/50 rounded p-3 space-y-2 font-body text-sm text-white/80">
                      <p><strong>a.</strong> {t.s4e1a} <strong className="text-green-400">{t.s4e1aType}</strong>, <InlineMath math="n = 7" /></p>
                      <p><strong>b.</strong> {t.s4e1b} <strong className="text-blue-400">{t.s4e1bType}</strong></p>
                      <p><strong>c.</strong> {t.s4e1c} <strong className="text-slate-300">{t.s4e1cType}</strong>, <InlineMath math="n = 0" /></p>
                    </div>
                  </div>
                </div>

                {/* E2 Medium */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{mediumBadge}<span className="font-body font-semibold text-white">{t.example} 2</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      {t.s4e2q1} <InlineMath math="T" /> {t.s4e2q2} <InlineMath math="T" />{t.s4e2q3} <InlineMath math="n(T)" />!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{t.solution}:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>{t.s4e2s1}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>{t.s4e2between}</p>
                        <p>{t.s4e2odd}</p>
                        <p className="text-primary mt-1"><InlineMath math="T = \{11, 13, 15, 17, 19, 21\}" /></p>
                      </div>
                      <p><strong>{t.s4e2s2}</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p>{t.s4e2canCount}</p>
                        <p className="text-green-400">{t.s4e2type}</p>
                        <p className="text-primary"><InlineMath math="n(T) = 6" /></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* E3 Hard */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">{hardBadge}<span className="font-body font-semibold text-white">{t.example} 3</span></div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">{t.s4e3q}</p>
                    <ul className="font-body text-sm text-white/80 mt-2 space-y-1 list-[lower-alpha] list-inside">
                      <li>
                        {lang === "id" ? "Himpunan bilangan bulat yang kuadratnya sama dengan" :
                         lang === "en" ? "Set of integers whose square equals" :
                         "二乗が"} <InlineMath math="-4" />
                        {lang === "ja" ? "に等しい整数の集合" : ""}
                      </li>
                      <li>{lang === "id" ? "Himpunan kelipatan 7 yang lebih dari 0" : lang === "en" ? "Set of multiples of 7 greater than 0" : "0より大きい7の倍数の集合"}</li>
                      <li>{lang === "id" ? "Himpunan bilangan prima antara 1 dan 50" : lang === "en" ? "Set of prime numbers between 1 and 50" : "1から50の間の素数の集合"}</li>
                    </ul>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{t.solution}:</p>
                    <div className="space-y-4 font-body text-sm text-white/80">
                      <div>
                        <p><strong>{t.s4e3aTitle}</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <p>{t.s4e3aText} <InlineMath math="n^2 = -4" />.</p>
                          <p className="text-slate-300 font-semibold mt-1">{t.s4e3aType} <InlineMath math="\emptyset" /></p>
                        </div>
                      </div>
                      <div>
                        <p><strong>{t.s4e3bTitle}</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <BlockMath math="\{7, 14, 21, 28, 35, ...\}" />
                          <p>{t.s4e3bText}</p>
                          <p className="text-blue-400 font-semibold mt-1">{t.s4e3bType}</p>
                        </div>
                      </div>
                      <div>
                        <p><strong>{t.s4e3cTitle}</strong></p>
                        <div className="bg-slate-900/50 rounded p-3 mt-1">
                          <BlockMath math="\{2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47\}" />
                          <p>{t.s4e3cText}</p>
                          <p className="text-green-400 font-semibold mt-1">{t.s4e3cType}, <InlineMath math="n = 15" /></p>
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

export default PengertianKeanggotaanPage;
