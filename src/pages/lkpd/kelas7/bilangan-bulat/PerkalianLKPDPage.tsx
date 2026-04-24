import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Perkalian dua bilangan bertanda SAMA (positif × positif atau negatif × negatif) menghasilkan bilangan ...",
    kind: "choice",
    options: ["positif", "negatif", "selalu nol", "tergantung besar"],
    correctIndex: 0,
    discussion: [
      "+ × + = + dan − × − = +.",
      "Tanda sama menghasilkan positif.",
    ],
  },
  {
    id: "g2",
    label: "(-6) × 7 = ...",
    kind: "fill",
    answers: ["-42"],
    discussion: ["Tanda berbeda: hasil negatif.", "6 × 7 = 42, jadi -42."],
  },
  {
    id: "g3",
    label: "Benar atau salah: \"Hasil perkalian bilangan bulat dengan 0 selalu 0.\"",
    kind: "truefalse",
    correct: true,
    discussion: ["Sifat absorpsi nol: a × 0 = 0 untuk semua a."],
  },
  {
    id: "g4",
    label: "Jodohkan perkalian dengan hasilnya:",
    kind: "match",
    pairs: [
      { left: "(-4) × (-5)", right: "20" },
      { left: "8 × (-3)", right: "-24" },
      { left: "(-7) × 9", right: "-63" },
      { left: "(-6) × 0", right: "0" },
    ],
    discussion: [
      "(-4) × (-5) = 20 (sama-sama negatif).",
      "8 × (-3) = -24 (beda tanda).",
      "(-7) × 9 = -63 (beda tanda).",
      "(-6) × 0 = 0.",
    ],
  },
  {
    id: "g5",
    label: "Urutkan dari yang terkecil ke terbesar:",
    kind: "sort",
    items: ["(-3) × 4", "(-2) × (-5)", "5 × (-1)", "(-4) × (-3)"],
    correctOrder: ["(-3) × 4", "5 × (-1)", "(-2) × (-5)", "(-4) × (-3)"],
    discussion: [
      "(-3) × 4 = -12 (terkecil).",
      "5 × (-1) = -5.",
      "(-2) × (-5) = 10.",
      "(-4) × (-3) = 12 (terbesar).",
    ],
  },
  {
    id: "g6",
    label: "Sifat komutatif perkalian: a × b = ...",
    kind: "fill",
    answers: ["b×a", "ba", "b*a"],
    discussion: ["a × b = b × a (komutatif).", "Misal: 4 × 7 = 7 × 4 = 28."],
  },
  {
    id: "g7",
    label: "Pilih bentuk yang BENAR untuk sifat distributif:",
    kind: "choice",
    options: [
      "a × (b + c) = a × b + a × c",
      "a × (b + c) = a + b × c",
      "(a + b) × c = a × b + c",
      "a × b × c = (a + b) × c",
    ],
    correctIndex: 0,
    discussion: [
      "Sifat distributif: a × (b + c) = a × b + a × c.",
      "Membuka tanda kurung dengan mengalikan ke setiap suku.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Hitung: (-12) × (-8)",
    kind: "fill",
    answers: ["96"],
    hint: "Sama-sama negatif → positif. 12 × 8 = ?",
    discussion: ["(-12) × (-8) = +96."],
  },
  {
    id: "p2",
    question: "Pilih hasil yang benar untuk 15 × (-4):",
    kind: "choice",
    options: ["-60", "60", "-19", "19"],
    correctIndex: 0,
    hint: "Beda tanda: hasilnya negatif.",
    discussion: ["15 × 4 = 60, tanda berbeda → -60."],
  },
  {
    id: "p3",
    question: "Benar atau salah: \"(-1) × (-1) × (-1) = -1.\"",
    kind: "truefalse",
    correct: true,
    hint: "Banyak tanda negatif ganjil = negatif.",
    discussion: ["3 tanda negatif (ganjil) → hasil negatif.", "(-1) × (-1) × (-1) = -1."],
  },
  {
    id: "p4",
    question: "Jodohkan perkalian dengan hasilnya:",
    kind: "match",
    pairs: [
      { left: "(-9) × 11", right: "-99" },
      { left: "(-13) × (-4)", right: "52" },
      { left: "25 × (-6)", right: "-150" },
      { left: "(-100) × 0", right: "0" },
    ],
    hint: "Tentukan tanda dahulu, lalu hitung.",
    discussion: [
      "(-9) × 11 = -99.",
      "(-13) × (-4) = 52.",
      "25 × (-6) = -150.",
      "(-100) × 0 = 0.",
    ],
  },
  {
    id: "p5",
    question: "Sebuah lift turun 4 lantai per detik. Setelah 7 detik, lift bergerak ... lantai (gunakan tanda).",
    kind: "fill",
    answers: ["-28"],
    hint: "Turun = negatif. (-4) × 7.",
    discussion: ["(-4) × 7 = -28.", "Lift bergerak -28 lantai (turun 28 lantai)."],
  },
  {
    id: "p6",
    question: "Hitung: 4 × (15 − 8) menggunakan sifat distributif.",
    kind: "fill",
    answers: ["28"],
    hint: "4 × 15 − 4 × 8 = 60 − 32.",
    discussion: ["4 × (15 − 8) = 4 × 15 − 4 × 8 = 60 − 32 = 28."],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Aturan Tanda",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-lg font-bold text-white">+ × + = +    − × − = +</p>
        <p className="text-lg font-bold text-white">+ × − = −    − × + = −</p>
      </div>
    ),
    text: "Tanda sama → positif, tanda beda → negatif.",
  },
  {
    title: "Situasi: Pengulangan",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">⬇️ ⬇️ ⬇️</p>
        <p className="text-lg font-bold text-white">Lift turun 4 lantai × 3 kali</p>
        <p className="text-sm text-white/65">(-4) × 3 = -12 lantai</p>
      </div>
    ),
    text: "Perkalian sebagai pengulangan: berapa kali pergerakan terjadi.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Aturan Tanda", text: "Tanda sama → positif, tanda berbeda → negatif. a × 0 = 0.", tone: "cyan" },
  { title: "Sifat", text: "Komutatif (a×b=b×a), asosiatif, distributif terhadap penjumlahan/pengurangan.", tone: "yellow" },
  { title: "Banyak Tanda Negatif", text: "Genap → positif, ganjil → negatif.", tone: "emerald" },
];

const PerkalianLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Matematika Kelas 7"
    title="Perkalian Bilangan Bulat"
    intro="LKPD ini melatih Sobat Numatik menentukan aturan tanda dan sifat perkalian bilangan bulat."
    situations={situations}
    guidedIntro="Kerjakan setiap soal untuk menemukan aturan tanda perkalian."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Tentukan tanda hasilnya dahulu, baru hitung perkaliannya."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-7/bilangan-bulat"
    backLabel="Kembali ke LKPD Bilangan Bulat"
  />
);

export default PerkalianLKPDPage;
