import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Pak Budi membeli sepeda seharga Rp 800.000 lalu menjualnya Rp 950.000. Karena harga jual LEBIH BESAR dari harga beli, Pak Budi mengalami …",
    kind: "choice",
    options: ["Untung", "Rugi", "Impas", "Bonus"],
    correctIndex: 0,
    discussion: [
      "Bandingkan: Harga Jual (Rp 950.000) vs Harga Beli (Rp 800.000).",
      "Karena Harga Jual > Harga Beli, maka pedagang mengalami UNTUNG.",
    ],
  },
  {
    id: "g2",
    label: "Besarnya untung Pak Budi adalah Rp …",
    kind: "fill",
    answers: ["150000", "150.000", "Rp 150.000", "150 000"],
    discussion: [
      "Untung = Harga Jual − Harga Beli.",
      "Untung = 950.000 − 800.000 = Rp 150.000.",
    ],
  },
  {
    id: "g3",
    label: "Bu Sinta membeli barang seharga Rp 200.000 dan menjualnya Rp 170.000. Karena Harga Jual < Harga Beli, Bu Sinta mengalami …",
    kind: "choice",
    options: ["Untung", "Rugi", "Impas", "Diskon"],
    correctIndex: 1,
    discussion: [
      "Harga Jual (170.000) < Harga Beli (200.000) → RUGI.",
      "Besar rugi = 200.000 − 170.000 = Rp 30.000.",
    ],
  },
  {
    id: "g4",
    label: "Benar atau salah: jika Harga Jual = Harga Beli, pedagang dikatakan IMPAS (tidak untung dan tidak rugi).",
    kind: "truefalse",
    correct: true,
    discussion: [
      "Jika HJ = HB → Untung = 0 dan Rugi = 0.",
      "Keadaan ini disebut IMPAS / titik balik modal. Pernyataan BENAR.",
    ],
  },
  {
    id: "g5",
    label: "Pasangkan rumus dengan keterangannya.",
    kind: "match",
    pairs: [
      { left: "Untung (U)", right: "HJ − HB (jika HJ > HB)" },
      { left: "Rugi (R)", right: "HB − HJ (jika HJ < HB)" },
      { left: "Persentase Untung", right: "(U / HB) × 100%" },
      { left: "Persentase Rugi", right: "(R / HB) × 100%" },
    ],
    discussion: [
      "Untung dan rugi dihitung dari selisih harga jual dan harga beli.",
      "Persentase selalu dihitung TERHADAP HARGA BELI (modal).",
    ],
  },
  {
    id: "g6",
    label: "Modal Rp 500.000, untung Rp 50.000. Persentase untung = (50.000 ÷ 500.000) × 100% = … %",
    kind: "fill",
    answers: ["10", "10%"],
    discussion: [
      "(50.000 / 500.000) × 100% = 0,1 × 100% = 10%.",
      "Jadi, persentase untung = 10%.",
    ],
  },
  {
    id: "g7",
    label: "Urutkan langkah baku menyelesaikan soal jual beli:",
    kind: "sort",
    items: [
      "Tulis kesimpulan beserta satuannya (Rp atau %).",
      "Tentukan Harga Beli (HB) dan Harga Jual (HJ).",
      "Bandingkan HB dan HJ untuk menentukan untung / rugi / impas.",
      "Hitung besar untung atau rugi (selisih HB dan HJ).",
    ],
    correctOrder: [
      "Tentukan Harga Beli (HB) dan Harga Jual (HJ).",
      "Bandingkan HB dan HJ untuk menentukan untung / rugi / impas.",
      "Hitung besar untung atau rugi (selisih HB dan HJ).",
      "Tulis kesimpulan beserta satuannya (Rp atau %).",
    ],
    discussion: [
      "Langkah baku: 1) tentukan HB & HJ, 2) bandingkan, 3) hitung selisih, 4) tulis kesimpulan.",
    ],
  },
  {
    id: "g8",
    label: "Pedagang membeli 10 kg buah seharga Rp 80.000. Harga beli per kg = Rp …",
    kind: "fill",
    answers: ["8000", "8.000", "Rp 8.000"],
    discussion: [
      "HB per kg = Total HB ÷ banyak kg = 80.000 ÷ 10 = 8.000.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Bu Ani membeli kue seharga Rp 12.000 dan menjualnya Rp 15.000. Berapakah keuntungan Bu Ani?",
    kind: "fill",
    answers: ["3000", "3.000", "Rp 3.000"],
    hint: "Untung = HJ − HB.",
    discussion: ["U = 15.000 − 12.000 = 3.000. Keuntungan Bu Ani = Rp 3.000."],
  },
  {
    id: "p2",
    question: "Pak Joni membeli 1 lusin (12 buah) gelas seharga Rp 60.000. Ia menjual setiap gelas Rp 6.000. Berapa keuntungan total?",
    kind: "choice",
    options: ["Rp 6.000", "Rp 12.000", "Rp 24.000", "Rp 30.000"],
    correctIndex: 1,
    hint: "Total HJ = 12 × 6.000.",
    discussion: [
      "Total HJ = 12 × 6.000 = 72.000.",
      "Untung = 72.000 − 60.000 = Rp 12.000.",
    ],
  },
  {
    id: "p3",
    question: "Modal Rp 250.000, mengalami rugi Rp 25.000. Berapa persentase ruginya?",
    kind: "fill",
    answers: ["10", "10%"],
    hint: "%R = (R / HB) × 100%.",
    discussion: ["(25.000 / 250.000) × 100% = 10%."],
  },
  {
    id: "p4",
    question: "Benar atau salah: Persentase untung dihitung dari Harga Jual.",
    kind: "truefalse",
    correct: false,
    hint: "Persentase selalu dari modal (HB).",
    discussion: ["Persentase untung dihitung dari MODAL (HB), bukan dari HJ. Pernyataan SALAH."],
  },
  {
    id: "p5",
    question: "Sebuah barang dibeli Rp 400.000 dan dijual dengan untung 25%. Berapa harga jualnya?",
    kind: "fill",
    answers: ["500000", "500.000", "Rp 500.000"],
    hint: "HJ = HB + (Untung% × HB).",
    discussion: [
      "Untung = 25% × 400.000 = 100.000.",
      "HJ = 400.000 + 100.000 = Rp 500.000.",
    ],
  },
  {
    id: "p6",
    question: "Sebuah baju dijual Rp 90.000 dan pedagang mengalami rugi 10%. Berapa harga belinya?",
    kind: "choice",
    options: ["Rp 81.000", "Rp 99.000", "Rp 100.000", "Rp 110.000"],
    correctIndex: 2,
    hint: "Jika rugi 10%, maka HJ = 90% × HB. Jadi HB = HJ / 0,9.",
    discussion: [
      "HJ = (100% − 10%) × HB = 0,9 × HB.",
      "HB = 90.000 / 0,9 = 100.000.",
    ],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-untung-rugi",
    title: "🎯 Game 1: Untung, Rugi atau Impas?",
    description: "Tarik kartu transaksi ke kotak yang tepat: UNTUNG, RUGI, atau IMPAS!",
    buckets: [
      { id: "untung", label: "UNTUNG", emoji: "🤑", color: "emerald" },
      { id: "rugi", label: "RUGI", emoji: "😢", color: "rose" },
      { id: "impas", label: "IMPAS", emoji: "😐", color: "amber" },
    ],
    items: [
      { id: "i1", label: "HB 100rb · HJ 120rb", bucketId: "untung" },
      { id: "i2", label: "HB 200rb · HJ 180rb", bucketId: "rugi" },
      { id: "i3", label: "HB 50rb · HJ 50rb", bucketId: "impas" },
      { id: "i4", label: "HB 75rb · HJ 90rb", bucketId: "untung" },
      { id: "i5", label: "HB 300rb · HJ 250rb", bucketId: "rugi" },
      { id: "i6", label: "HB 150rb · HJ 150rb", bucketId: "impas" },
      { id: "i7", label: "HB 80rb · HJ 100rb", bucketId: "untung" },
      { id: "i8", label: "HB 500rb · HJ 450rb", bucketId: "rugi" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-hitung-untung",
    title: "🎮 Game 2: Cepat Hitung Untung / Rugi!",
    description: "Tekan ◀ ▶ pilih hasil yang benar untuk setiap transaksi.",
    rightOptions: ["Untung Rp 5.000", "Rugi Rp 5.000", "Untung Rp 20.000", "Rugi Rp 20.000", "Untung Rp 50.000", "Rugi Rp 50.000"],
    pairs: [
      { id: "r1", left: "HB Rp 100rb → HJ Rp 120rb", correctRight: "Untung Rp 20.000", emoji: "🛒" },
      { id: "r2", left: "HB Rp 250rb → HJ Rp 200rb", correctRight: "Rugi Rp 50.000", emoji: "📉" },
      { id: "r3", left: "HB Rp 75rb → HJ Rp 80rb", correctRight: "Untung Rp 5.000", emoji: "💵" },
      { id: "r4", left: "HB Rp 150rb → HJ Rp 145rb", correctRight: "Rugi Rp 5.000", emoji: "🔻" },
      { id: "r5", left: "HB Rp 400rb → HJ Rp 450rb", correctRight: "Untung Rp 50.000", emoji: "📈" },
    ],
  },
  {
    kind: "page-link",
    id: "game-arena-jualbeli",
    title: "🚀 Game 3: Math Game Arena – Jual Beli, Untung & Rugi",
    description: "Tantang dirimu di arena permainan layar penuh dengan soal jual beli yang seru!",
    path: "/math-game-arena/kelas-7/aritmetika-sosial/jual-beli-untung-rugi",
    buttonLabel: "MAINKAN DI MATH GAME ARENA",
    emoji: "🛍️",
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi 1: Pak Budi Jual Sepeda 🚲",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-lg font-bold text-white">Beli: <span className="text-cyan-300">Rp 800.000</span></p>
        <p className="text-lg font-bold text-white">Jual: <span className="text-emerald-300">Rp 950.000</span></p>
        <p className="text-2xl mt-2">😀 Untung Rp 150.000</p>
      </div>
    ),
    text: "Karena Harga Jual lebih besar dari Harga Beli, Pak Budi UNTUNG. Untung = HJ − HB.",
  },
  {
    title: "Situasi 2: Bu Sinta Jual Tas 👜",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-lg font-bold text-white">Beli: <span className="text-cyan-300">Rp 200.000</span></p>
        <p className="text-lg font-bold text-white">Jual: <span className="text-rose-300">Rp 170.000</span></p>
        <p className="text-2xl mt-2">😢 Rugi Rp 30.000</p>
      </div>
    ),
    text: "Karena Harga Jual lebih kecil dari Harga Beli, Bu Sinta RUGI. Rugi = HB − HJ.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Untung", text: "U = HJ − HB (jika HJ > HB). %U = (U/HB) × 100%.", tone: "emerald" },
  { title: "Rugi", text: "R = HB − HJ (jika HJ < HB). %R = (R/HB) × 100%.", tone: "rose" },
  { title: "Impas", text: "Jika HJ = HB → tidak untung dan tidak rugi.", tone: "amber" },
];

const JualBeliUntungRugiLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Aritmetika Sosial • Kelas 7"
    title="🛍️ Jual Beli, Untung & Rugi"
    intro="Sobat Numatik akan menemukan sendiri rumus untung dan rugi melalui aktivitas terbimbing, lalu memantapkannya dengan tiga mini-game seru!"
    situations={situations}
    guidedIntro="Lengkapi pertanyaan berikut untuk menemukan kapan terjadi UNTUNG, RUGI, atau IMPAS dan rumus bakunya."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Saatnya mencoba sendiri! Gunakan rumus yang sudah kamu temukan."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/aritmetika-sosial"
    backLabel="Kembali ke menu LKPD Aritmetika Sosial"
  />
);

export default JualBeliUntungRugiLKPDPage;
