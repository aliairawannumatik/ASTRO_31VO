import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Aturan utama pembagian pecahan adalah ...",
    kind: "choice",
    options: [
      "Kalikan kedua pecahan langsung",
      "Samakan penyebut dulu, baru kurangkan",
      "Balik (invers) pecahan kedua, lalu KALI",
      "Bagi pembilang dengan pembilang saja",
    ],
    correctIndex: 2,
    discussion: [
      "Pembagian = perkalian dengan kebalikan (invers) bilangan kedua.",
      "a/b ÷ c/d = a/b × d/c.",
    ],
  },
  {
    id: "g2",
    label: "Kebalikan (invers) dari 3/5 adalah ...",
    kind: "fill",
    answers: ["5/3"],
    discussion: [
      "Tukar posisi pembilang dan penyebut.",
      "Kebalikan 3/5 = 5/3.",
    ],
  },
  {
    id: "g3",
    label: "Hasil dari 2/3 ÷ 4/5 = ...",
    kind: "fill",
    answers: ["10/12", "5/6"],
    discussion: [
      "2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6.",
    ],
  },
  {
    id: "g4",
    label: "Benar atau salah: \"3/4 ÷ 1/2 sama dengan 3/4 × 2/1\".",
    kind: "truefalse",
    correct: true,
    discussion: [
      "Aturan bagi = kali kebalikan: 3/4 ÷ 1/2 = 3/4 × 2/1 = 6/4 = 3/2 = 1 1/2. BENAR.",
    ],
  },
  {
    id: "g5",
    label: "Hasil dari 6 ÷ 2/3 = ...",
    kind: "choice",
    options: ["4", "9", "12", "3"],
    correctIndex: 1,
    discussion: [
      "6 ÷ 2/3 = 6 × 3/2 = 18/2 = 9.",
    ],
  },
  {
    id: "g6",
    label: "Jodohkan operasi pembagian dengan hasilnya:",
    kind: "match",
    pairs: [
      { left: "1/2 ÷ 1/4", right: "2" },
      { left: "3/4 ÷ 3/8", right: "2 (sama, 2 × penyebut)" },
      { left: "5/6 ÷ 1/2", right: "5/3" },
      { left: "1/3 ÷ 1/2", right: "2/3" },
    ],
    discussion: [
      "1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2.",
      "3/4 ÷ 3/8 = 3/4 × 8/3 = 24/12 = 2.",
      "5/6 ÷ 1/2 = 5/6 × 2/1 = 10/6 = 5/3.",
      "1/3 ÷ 1/2 = 1/3 × 2/1 = 2/3.",
    ],
  },
  {
    id: "g7",
    label: "Urutkan langkah menghitung 2 1/4 ÷ 1 1/2:",
    kind: "sort",
    items: [
      "Hasil akhir: 1 1/2",
      "Ubah ke pecahan biasa: 9/4 ÷ 3/2",
      "Balik pecahan kedua: 9/4 × 2/3",
      "Kalikan & sederhanakan: 18/12 = 3/2",
    ],
    correctOrder: [
      "Ubah ke pecahan biasa: 9/4 ÷ 3/2",
      "Balik pecahan kedua: 9/4 × 2/3",
      "Kalikan & sederhanakan: 18/12 = 3/2",
      "Hasil akhir: 1 1/2",
    ],
    discussion: ["Selalu ubah pecahan campuran ke biasa SEBELUM dibagi."],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Hitung: 4/5 ÷ 2/3",
    kind: "fill",
    answers: ["12/10", "6/5", "1 1/5"],
    hint: "Kali kebalikan: 4/5 × 3/2.",
    discussion: ["4/5 × 3/2 = 12/10 = 6/5 = 1 1/5."],
  },
  {
    id: "p2",
    question: "Hitung: 5 ÷ 2/3",
    kind: "choice",
    options: ["10/3", "15/2", "5/6", "3/10"],
    correctIndex: 1,
    hint: "5 = 5/1, balik 2/3 jadi 3/2.",
    discussion: ["5/1 × 3/2 = 15/2 = 7 1/2."],
  },
  {
    id: "p3",
    question: "Hitung: 3/8 ÷ 1/4",
    kind: "fill",
    answers: ["3/2", "1 1/2", "12/8"],
    hint: "3/8 × 4/1.",
    discussion: ["3/8 × 4/1 = 12/8 = 3/2 = 1 1/2."],
  },
  {
    id: "p4",
    question: "Benar atau salah: \"2/5 ÷ 0 = 0\".",
    kind: "truefalse",
    correct: false,
    hint: "Pembagian dengan 0 tidak terdefinisi.",
    discussion: ["Tidak ada bilangan yang dibagi 0. Pernyataan SALAH."],
  },
  {
    id: "p5",
    question: "Sebuah tali panjang 6 m dipotong-potong sepanjang 2/3 m. Berapa banyak potongan tali?",
    kind: "fill",
    answers: ["9"],
    hint: "Banyak potongan = 6 ÷ 2/3.",
    discussion: ["6 ÷ 2/3 = 6 × 3/2 = 18/2 = 9 potongan."],
  },
  {
    id: "p6",
    question: "Jodohkan operasi dengan hasilnya:",
    kind: "match",
    pairs: [
      { left: "4 ÷ 1/2", right: "8" },
      { left: "1/2 ÷ 4", right: "1/8" },
      { left: "3/4 ÷ 3/4", right: "1" },
      { left: "2/3 ÷ 4", right: "1/6" },
    ],
    hint: "Selalu balik pecahan kedua, lalu kali.",
    discussion: [
      "4 ÷ 1/2 = 4 × 2 = 8.",
      "1/2 ÷ 4 = 1/2 × 1/4 = 1/8.",
      "3/4 ÷ 3/4 = 1.",
      "2/3 ÷ 4 = 2/3 × 1/4 = 2/12 = 1/6.",
    ],
  },
  {
    id: "p7",
    question: "Hitung: 2 1/2 ÷ 1 1/4",
    kind: "fill",
    answers: ["2"],
    hint: "Ubah ke biasa: 5/2 ÷ 5/4.",
    discussion: ["5/2 × 4/5 = 20/10 = 2."],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Membagi Tali",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-4xl">🪢 ÷ 2/3</p>
        <p className="text-base font-bold text-white">6 m ÷ 2/3 m = 9 potong</p>
        <p className="text-xs text-white/65">Bagi = berapa kali muat?</p>
      </div>
    ),
    text: "Pembagian pecahan menjawab \"berapa kali bilangan kedua muat di bilangan pertama?\".",
  },
  {
    title: "Situasi: Balik & Kali",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">🔄</p>
        <p className="text-base font-bold text-white">a/b ÷ c/d = a/b × d/c</p>
        <p className="text-xs text-white/65">Balik pecahan kedua, ubah jadi kali</p>
      </div>
    ),
    text: "Trik utama pembagian pecahan: BALIK pecahan kedua, lalu KALI.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Aturan Bagi Pecahan", text: "a/b ÷ c/d = a/b × d/c. Balik pecahan kedua, lalu kalikan.", tone: "cyan" },
  { title: "Bilangan Bulat", text: "n ÷ a/b = n × b/a. Contoh: 6 ÷ 2/3 = 6 × 3/2 = 9.", tone: "yellow" },
  { title: "Pecahan Campuran", text: "Ubah dulu ke pecahan biasa, baru lakukan pembagian.", tone: "emerald" },
  { title: "Awas!", text: "Tidak ada pembagian dengan 0. a/b ÷ 0 tidak terdefinisi.", tone: "rose" },
];

const PembagianPecahanLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Pecahan • Kelas 7"
    title="➗ Pembagian Pecahan"
    intro="LKPD seru ini mengajak Sobat Numatik membagi pecahan dengan trik balik & kali, lewat tantangan, jodoh, dan urutan langkah!"
    situations={situations}
    guidedIntro="Aktivitas terbimbing: temukan aturan pembagian pecahan."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Sekarang giliranmu! Selesaikan latihan-latihan berikut."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-7/bilangan-rasional"
    backLabel="Kembali ke LKPD Pecahan"
  />
);

export default PembagianPecahanLKPDPage;
