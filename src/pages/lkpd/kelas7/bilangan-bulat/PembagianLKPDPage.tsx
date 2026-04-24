import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Aturan tanda pembagian SAMA dengan aturan tanda ...",
    kind: "choice",
    options: ["perkalian", "penjumlahan", "pengurangan", "akar"],
    correctIndex: 0,
    discussion: [
      "Tanda pembagian mengikuti tanda perkalian.",
      "Sama → positif, beda → negatif.",
    ],
  },
  {
    id: "g2",
    label: "Hasil dari (-36) ÷ 4 = ...",
    kind: "fill",
    answers: ["-9"],
    discussion: ["Beda tanda → negatif.", "36 ÷ 4 = 9, jadi -9."],
  },
  {
    id: "g3",
    label: "Benar atau salah: \"Bilangan dibagi nol hasilnya nol.\"",
    kind: "truefalse",
    correct: false,
    discussion: [
      "Pembagian dengan 0 TIDAK terdefinisi (undefined).",
      "Pernyataan SALAH.",
    ],
  },
  {
    id: "g4",
    label: "Jodohkan pembagian dengan hasilnya:",
    kind: "match",
    pairs: [
      { left: "(-48) ÷ (-6)", right: "8" },
      { left: "72 ÷ (-9)", right: "-8" },
      { left: "(-100) ÷ 4", right: "-25" },
      { left: "0 ÷ 5", right: "0" },
    ],
    discussion: [
      "(-48) ÷ (-6) = 8 (sama negatif).",
      "72 ÷ (-9) = -8 (beda).",
      "(-100) ÷ 4 = -25 (beda).",
      "0 ÷ 5 = 0.",
    ],
  },
  {
    id: "g5",
    label: "Urutkan langkah menghitung (-84) ÷ 7:",
    kind: "sort",
    items: [
      "Hasil = -12",
      "Tentukan tanda hasil: beda → negatif",
      "Hitung 84 ÷ 7 = 12",
      "Pisahkan tanda dan nilai mutlak",
    ],
    correctOrder: [
      "Pisahkan tanda dan nilai mutlak",
      "Hitung 84 ÷ 7 = 12",
      "Tentukan tanda hasil: beda → negatif",
      "Hasil = -12",
    ],
    discussion: ["Pisahkan tanda dulu agar fokus pada perhitungan nilai mutlak.", "Lalu beri tanda sesuai aturan."],
  },
  {
    id: "g6",
    label: "Pilih bentuk yang BENAR sebagai kebalikan perkalian:",
    kind: "choice",
    options: [
      "Jika a × b = c maka a = c ÷ b (b ≠ 0)",
      "Jika a × b = c maka a = c × b",
      "Jika a × b = c maka a + b = c",
      "Jika a × b = c maka a − b = c",
    ],
    correctIndex: 0,
    discussion: [
      "Pembagian adalah kebalikan perkalian.",
      "a × b = c ⇒ a = c ÷ b (asalkan b ≠ 0).",
    ],
  },
  {
    id: "g7",
    label: "144 dibagi (-12) sama dengan ...",
    kind: "fill",
    answers: ["-12"],
    discussion: ["144 ÷ (-12) = -12 (beda tanda)."],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Hitung: (-225) ÷ (-15)",
    kind: "fill",
    answers: ["15"],
    hint: "Sama-sama negatif → positif. 225 ÷ 15.",
    discussion: ["(-225) ÷ (-15) = 15."],
  },
  {
    id: "p2",
    question: "Pilih hasil yang benar untuk 96 ÷ (-8):",
    kind: "choice",
    options: ["-12", "12", "-88", "104"],
    correctIndex: 0,
    hint: "Beda tanda: hasilnya negatif.",
    discussion: ["96 ÷ 8 = 12, tanda berbeda → -12."],
  },
  {
    id: "p3",
    question: "Benar atau salah: \"Hasil dari (-50) ÷ 1 adalah -50.\"",
    kind: "truefalse",
    correct: true,
    hint: "Membagi dengan 1 menghasilkan bilangan itu sendiri.",
    discussion: ["(-50) ÷ 1 = -50. Benar."],
  },
  {
    id: "p4",
    question: "Jodohkan pembagian dengan hasilnya:",
    kind: "match",
    pairs: [
      { left: "(-180) ÷ 12", right: "-15" },
      { left: "144 ÷ (-9)", right: "-16" },
      { left: "(-450) ÷ (-15)", right: "30" },
      { left: "0 ÷ (-7)", right: "0" },
    ],
    hint: "Tentukan tanda dahulu, lalu bagi.",
    discussion: [
      "(-180) ÷ 12 = -15.",
      "144 ÷ (-9) = -16.",
      "(-450) ÷ (-15) = 30.",
      "0 ÷ (-7) = 0.",
    ],
  },
  {
    id: "p5",
    question: "Suatu lift turun total -56 lantai dalam 8 detik. Berapa lantai per detik (gunakan tanda)?",
    kind: "fill",
    answers: ["-7"],
    hint: "(-56) ÷ 8.",
    discussion: ["(-56) ÷ 8 = -7 lantai per detik (turun)."],
  },
  {
    id: "p6",
    question: "Sebuah utang Rp 360.000 dibayar dalam 12 angsuran sama besar. Berapa rupiah perubahan saldo per bulan (gunakan tanda)?",
    kind: "fill",
    answers: ["-30000"],
    hint: "(-360.000) ÷ 12.",
    discussion: ["(-360.000) ÷ 12 = -30.000.", "Saldo berkurang Rp 30.000 per bulan."],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Aturan Tanda",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-lg font-bold text-white">+ ÷ + = +    − ÷ − = +</p>
        <p className="text-lg font-bold text-white">+ ÷ − = −    − ÷ + = −</p>
      </div>
    ),
    text: "Aturan tanda pembagian sama persis dengan perkalian.",
  },
  {
    title: "Situasi: Membagi Sama Besar",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-lg font-bold text-white">-56 lantai ÷ 8 detik</p>
        <p className="text-sm text-white/65">= -7 lantai/detik</p>
      </div>
    ),
    text: "Pembagian dipakai untuk menemukan nilai per satuan saat hasil totalnya sudah diketahui.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Aturan Tanda", text: "Sama → positif, beda → negatif. Pembagian dengan 0 tidak terdefinisi.", tone: "cyan" },
  { title: "Kebalikan Perkalian", text: "a ÷ b = c artinya c × b = a. Periksa hasil dengan mengalikan kembali.", tone: "yellow" },
  { title: "Bukan Komutatif", text: "a ÷ b ≠ b ÷ a (kecuali a = b ≠ 0).", tone: "emerald" },
];

const PembagianLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Matematika Kelas 7"
    title="Pembagian Bilangan Bulat"
    intro="LKPD ini melatih Sobat Numatik membagi bilangan bulat dengan aturan tanda yang tepat."
    situations={situations}
    guidedIntro="Kerjakan setiap soal untuk menemukan aturan tanda pembagian dan kaitannya dengan perkalian."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Selalu tentukan tanda hasilnya dahulu sebelum membagi nilai mutlaknya."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-7/bilangan-bulat"
    backLabel="Kembali ke LKPD Bilangan Bulat"
  />
);

export default PembagianLKPDPage;
