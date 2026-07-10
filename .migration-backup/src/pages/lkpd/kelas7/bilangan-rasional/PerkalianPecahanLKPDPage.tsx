import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Aturan dasar perkalian pecahan: kalikan ... dengan ... dan ... dengan ...",
    kind: "choice",
    options: [
      "pembilang × pembilang, penyebut × penyebut",
      "pembilang × penyebut, penyebut × pembilang",
      "samakan penyebut dulu, lalu kalikan",
      "balik salah satu pecahan, lalu kurangkan",
    ],
    correctIndex: 0,
    discussion: [
      "Aturan: a/b × c/d = (a×c) / (b×d).",
      "Tidak perlu samakan penyebut.",
    ],
  },
  {
    id: "g2",
    label: "Hasil dari 2/3 × 4/5 = ...",
    kind: "fill",
    answers: ["8/15"],
    discussion: [
      "Pembilang: 2 × 4 = 8.",
      "Penyebut: 3 × 5 = 15.",
      "Jadi 2/3 × 4/5 = 8/15.",
    ],
  },
  {
    id: "g3",
    label: "Hasil dari 3 × 2/7 = ...",
    kind: "fill",
    answers: ["6/7"],
    discussion: [
      "Bilangan bulat 3 = 3/1.",
      "3/1 × 2/7 = 6/7.",
    ],
  },
  {
    id: "g4",
    label: "Benar atau salah: 1/2 dari 6 = 3.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "\"… dari …\" pada pecahan = perkalian.",
      "1/2 × 6 = 6/2 = 3. BENAR.",
    ],
  },
  {
    id: "g5",
    label: "Untuk menghitung 2 1/3 × 1 1/2, langkah pertama adalah ...",
    kind: "choice",
    options: [
      "Kalikan bagian bulat dengan bulat saja",
      "Ubah keduanya menjadi pecahan biasa",
      "Samakan penyebut",
      "Balik salah satu pecahan",
    ],
    correctIndex: 1,
    discussion: [
      "Pecahan campuran wajib diubah ke pecahan biasa dulu.",
      "2 1/3 = 7/3, 1 1/2 = 3/2. Lalu 7/3 × 3/2 = 21/6 = 7/2 = 3 1/2.",
    ],
  },
  {
    id: "g6",
    label: "Jodohkan perkalian dengan hasilnya:",
    kind: "match",
    pairs: [
      { left: "1/2 × 1/3", right: "1/6" },
      { left: "2/5 × 3/4", right: "3/10" },
      { left: "4 × 1/8", right: "1/2" },
      { left: "5/6 × 6/5", right: "1" },
    ],
    discussion: [
      "1/2 × 1/3 = 1/6.",
      "2/5 × 3/4 = 6/20 = 3/10.",
      "4 × 1/8 = 4/8 = 1/2.",
      "5/6 × 6/5 = 30/30 = 1 (kebalikan!).",
    ],
  },
  {
    id: "g7",
    label: "Urutkan langkah menghitung 4/9 × 3/8 (dengan menyederhanakan dulu):",
    kind: "sort",
    items: [
      "Hasil akhir: 1/6",
      "Coret 4 dan 8: 4/8 = 1/2",
      "Coret 9 dan 3: 3/9 = 1/3",
      "Kalikan 1/3 × 1/2 = 1/6",
    ],
    correctOrder: [
      "Coret 4 dan 8: 4/8 = 1/2",
      "Coret 9 dan 3: 3/9 = 1/3",
      "Kalikan 1/3 × 1/2 = 1/6",
      "Hasil akhir: 1/6",
    ],
    discussion: [
      "Boleh menyederhanakan silang sebelum mengalikan.",
      "4/9 × 3/8 = (1/3) × (1/2) = 1/6.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Hitung: 3/4 × 2/5",
    kind: "fill",
    answers: ["6/20", "3/10"],
    hint: "Pembilang × pembilang dan penyebut × penyebut.",
    discussion: ["3 × 2 = 6, 4 × 5 = 20. Hasil: 6/20 = 3/10."],
  },
  {
    id: "p2",
    question: "Hitung: 2/3 dari 18",
    kind: "choice",
    options: ["6", "9", "12", "15"],
    correctIndex: 2,
    hint: "\"Dari\" = perkalian: 2/3 × 18.",
    discussion: ["2/3 × 18 = 36/3 = 12."],
  },
  {
    id: "p3",
    question: "Hitung: 1 1/2 × 2 2/3",
    kind: "fill",
    answers: ["4", "12/3"],
    hint: "Ubah ke pecahan biasa: 3/2 × 8/3.",
    discussion: ["3/2 × 8/3 = 24/6 = 4."],
  },
  {
    id: "p4",
    question: "Benar atau salah: \"5/8 × 0 = 5/8\".",
    kind: "truefalse",
    correct: false,
    hint: "Apa pun dikali 0 = 0.",
    discussion: ["5/8 × 0 = 0, bukan 5/8. SALAH."],
  },
  {
    id: "p5",
    question: "Sebuah pita panjangnya 3/4 m. Diko membutuhkan 6 pita. Total panjang yang dibutuhkan ... m.",
    kind: "choice",
    options: ["3 1/2", "4 1/2", "5", "6"],
    correctIndex: 1,
    hint: "Total = 6 × 3/4.",
    discussion: ["6 × 3/4 = 18/4 = 9/2 = 4 1/2 m."],
  },
  {
    id: "p6",
    question: "Jodohkan setiap perkalian dengan hasil sederhananya:",
    kind: "match",
    pairs: [
      { left: "3/5 × 10", right: "6" },
      { left: "2/9 × 3/4", right: "1/6" },
      { left: "1/2 × 2/3", right: "1/3" },
      { left: "7/8 × 8/7", right: "1" },
    ],
    hint: "Sederhanakan dulu sebelum mengalikan.",
    discussion: [
      "3/5 × 10 = 30/5 = 6.",
      "2/9 × 3/4 = 6/36 = 1/6.",
      "1/2 × 2/3 = 2/6 = 1/3.",
      "7/8 × 8/7 = 56/56 = 1.",
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Setengah dari Pizza",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-4xl">🍕 × 1/2</p>
        <p className="text-base font-bold text-white">1/2 dari pizza utuh = 1/2</p>
        <p className="text-xs text-white/65">\"Dari\" = tanda kali (×)</p>
      </div>
    ),
    text: "Kata \"dari\" pada pecahan berarti perkalian. Contoh: 1/3 dari 9 = 1/3 × 9 = 3.",
  },
  {
    title: "Situasi: Coret Silang",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">✂️ 2/9 × 3/4</p>
        <p className="text-base font-bold text-white">= 1/6</p>
        <p className="text-xs text-white/65">Sederhanakan dulu, baru kalikan</p>
      </div>
    ),
    text: "Boleh menyederhanakan silang antar pembilang & penyebut SEBELUM mengalikan agar lebih cepat.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Aturan Inti", text: "a/b × c/d = (a×c) / (b×d). Pembilang kali pembilang, penyebut kali penyebut.", tone: "cyan" },
  { title: "Bilangan Bulat", text: "Bilangan bulat n = n/1. Misal: 3 × 2/5 = 3/1 × 2/5 = 6/5.", tone: "yellow" },
  { title: "Pecahan Campuran", text: "Ubah dulu ke pecahan biasa baru kalikan.", tone: "emerald" },
  { title: "Coret Silang", text: "Sederhanakan silang antar pembilang & penyebut sebelum mengalikan.", tone: "violet" },
];

const PerkalianPecahanLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Pecahan • Kelas 7"
    title="✖️ Perkalian Pecahan"
    intro="LKPD ceria ini melatih Sobat Numatik mengalikan pecahan, pecahan campuran, hingga teknik coret silang yang super cepat!"
    situations={situations}
    guidedIntro="Selesaikan aktivitas terbimbing untuk menemukan aturan perkalian pecahan."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Sekarang asah keterampilanmu dengan latihan ini!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-7/bilangan-rasional"
    backLabel="Kembali ke LKPD Pecahan"
  />
);

export default PerkalianPecahanLKPDPage;
