import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Bentuk desimal dari 1/2 adalah ...",
    kind: "fill",
    answers: ["0.5", "0,5"],
    discussion: [
      "1 ÷ 2 = 0,5.",
      "Atau ubah penyebut jadi 10: 1/2 = 5/10 = 0,5.",
    ],
  },
  {
    id: "g2",
    label: "Bentuk desimal dari 3/4 adalah ...",
    kind: "choice",
    options: ["0,25", "0,5", "0,75", "0,8"],
    correctIndex: 2,
    discussion: [
      "3 ÷ 4 = 0,75.",
      "Atau 3/4 = 75/100 = 0,75.",
    ],
  },
  {
    id: "g3",
    label: "Bentuk desimal dari 7/100 adalah ...",
    kind: "fill",
    answers: ["0.07", "0,07"],
    discussion: [
      "Penyebut 100 → dua angka desimal.",
      "7/100 = 0,07.",
    ],
  },
  {
    id: "g4",
    label: "Ubah 0,6 menjadi pecahan PALING SEDERHANA.",
    kind: "fill",
    answers: ["3/5"],
    discussion: [
      "0,6 = 6/10 = 3/5 (bagi 2).",
    ],
  },
  {
    id: "g5",
    label: "Benar atau salah: \"1/3 = 0,3\" (tepat).",
    kind: "truefalse",
    correct: false,
    discussion: [
      "1 ÷ 3 = 0,333... (desimal berulang), bukan 0,3 tepat.",
      "Pernyataan SALAH.",
    ],
  },
  {
    id: "g6",
    label: "Jodohkan pecahan dengan bentuk desimalnya:",
    kind: "match",
    pairs: [
      { left: "1/4", right: "0,25" },
      { left: "1/5", right: "0,2" },
      { left: "3/8", right: "0,375" },
      { left: "9/10", right: "0,9" },
    ],
    discussion: [
      "1/4 = 25/100 = 0,25.",
      "1/5 = 2/10 = 0,2.",
      "3/8 = 0,375.",
      "9/10 = 0,9.",
    ],
  },
  {
    id: "g7",
    label: "Urutkan dari TERKECIL ke TERBESAR: 0,5; 1/3; 0,4; 3/5.",
    kind: "sort",
    items: ["0,5", "1/3", "0,4", "3/5"],
    correctOrder: ["1/3", "0,4", "0,5", "3/5"],
    discussion: [
      "Ubah ke desimal: 1/3 ≈ 0,333; 0,4; 0,5; 3/5 = 0,6.",
      "Urut: 0,333 < 0,4 < 0,5 < 0,6.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Bentuk desimal dari 4/5 adalah ...",
    kind: "fill",
    answers: ["0.8", "0,8"],
    hint: "Ubah penyebut menjadi 10.",
    discussion: ["4/5 = 8/10 = 0,8."],
  },
  {
    id: "p2",
    question: "Bentuk desimal dari 7/8 adalah ...",
    kind: "choice",
    options: ["0,7", "0,75", "0,875", "0,78"],
    correctIndex: 2,
    hint: "Bagi 7 dengan 8.",
    discussion: ["7 ÷ 8 = 0,875."],
  },
  {
    id: "p3",
    question: "Pecahan paling sederhana dari 0,75 adalah ...",
    kind: "fill",
    answers: ["3/4"],
    hint: "0,75 = 75/100, lalu sederhanakan.",
    discussion: ["75/100 = 3/4 (bagi 25)."],
  },
  {
    id: "p4",
    question: "Bentuk pecahan dari 0,125 adalah ...",
    kind: "choice",
    options: ["1/4", "1/5", "1/8", "1/16"],
    correctIndex: 2,
    hint: "0,125 = 125/1000.",
    discussion: ["125/1000 = 1/8 (bagi 125)."],
  },
  {
    id: "p5",
    question: "Benar atau salah: \"0,2 = 1/5 = 20%\".",
    kind: "truefalse",
    correct: true,
    hint: "Cek: 1 ÷ 5 = ? dan 0,2 × 100% = ?",
    discussion: ["1/5 = 0,2 = 20%. Pernyataan BENAR."],
  },
  {
    id: "p6",
    question: "Jodohkan desimal dengan pecahan paling sederhananya:",
    kind: "match",
    pairs: [
      { left: "0,4", right: "2/5" },
      { left: "0,15", right: "3/20" },
      { left: "0,625", right: "5/8" },
      { left: "0,8", right: "4/5" },
    ],
    hint: "Tulis sebagai pecahan per 10/100/1000, lalu sederhanakan.",
    discussion: [
      "0,4 = 4/10 = 2/5.",
      "0,15 = 15/100 = 3/20.",
      "0,625 = 625/1000 = 5/8.",
      "0,8 = 8/10 = 4/5.",
    ],
  },
  {
    id: "p7",
    question: "Urutkan dari TERBESAR ke TERKECIL: 0,7; 2/3; 0,75; 5/8.",
    kind: "sort",
    items: ["0,7", "2/3", "0,75", "5/8"],
    correctOrder: ["0,75", "0,7", "2/3", "5/8"],
    hint: "Ubah semua ke desimal.",
    discussion: [
      "0,75 > 0,7 > 0,667 (2/3) > 0,625 (5/8).",
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Uang Belanja",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-4xl">💰</p>
        <p className="text-base font-bold text-white">Rp 1.500,5 = 1500 5/10</p>
        <p className="text-xs text-white/65">Tanda koma = batas bilangan bulat & pecahan</p>
      </div>
    ),
    text: "Bentuk desimal sering muncul pada uang, ukuran, dan persentase. Tanda koma memisahkan bagian bulat dengan pecahan persepuluhan.",
  },
  {
    title: "Situasi: Pembagian Coklat",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">🍫</p>
        <p className="text-base font-bold text-white">3/4 = 0,75</p>
        <p className="text-xs text-white/65">3 ÷ 4 = 0,75</p>
      </div>
    ),
    text: "Cara mengubah pecahan ke desimal: bagi pembilang dengan penyebut, atau samakan penyebut menjadi 10/100/1000.",
  },
  {
    title: "Situasi: Skor Pertandingan",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">⚽</p>
        <p className="text-base font-bold text-white">0,8 = 8/10 = 4/5</p>
        <p className="text-xs text-white/65">Desimal → pecahan: tulis per 10/100/1000</p>
      </div>
    ),
    text: "Cara mengubah desimal ke pecahan: tulis sebagai per 10/100/1000 lalu sederhanakan.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Pecahan → Desimal", text: "Bagi pembilang dengan penyebut, atau ubah penyebut menjadi 10, 100, 1000.", tone: "cyan" },
  { title: "Desimal → Pecahan", text: "1 angka di belakang koma → /10. 2 angka → /100. 3 angka → /1000. Lalu sederhanakan.", tone: "yellow" },
  { title: "Desimal Berulang", text: "Beberapa pecahan menghasilkan desimal berulang, contoh 1/3 = 0,333... .", tone: "violet" },
  { title: "Hubungan dengan Persen", text: "Desimal × 100% = persen. 0,2 = 20%. 0,75 = 75%.", tone: "emerald" },
];

const BentukDesimalLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Pecahan • Kelas 7"
    title="🔢 Bentuk Desimal"
    intro="LKPD ini mengajak Sobat Numatik berpindah-pindah antara pecahan dan bentuk desimal lewat aktivitas seru, jodoh, urutan, dan tantangan!"
    situations={situations}
    guidedIntro="Aktivitas terbimbing: temukan cara mengubah pecahan ke desimal & sebaliknya."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Latih kemampuanmu dengan soal-soal berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-7/bilangan-rasional"
    backLabel="Kembali ke LKPD Pecahan"
  />
);

export default BentukDesimalLKPDPage;
