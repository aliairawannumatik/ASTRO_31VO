import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Sebuah baju seharga Rp 100.000 diberi DISKON 20%. Besar diskon (potongan harga) = 20% × Rp 100.000 = Rp …",
    kind: "fill",
    answers: ["20000", "20.000", "Rp 20.000"],
    discussion: [
      "Diskon = persen diskon × harga awal.",
      "20% × 100.000 = 0,2 × 100.000 = Rp 20.000.",
    ],
  },
  {
    id: "g2",
    label: "Maka harga yang harus dibayar adalah Rp 100.000 − Rp 20.000 = Rp …",
    kind: "fill",
    answers: ["80000", "80.000", "Rp 80.000"],
    discussion: [
      "Harga setelah diskon = harga awal − diskon = 100.000 − 20.000 = Rp 80.000.",
    ],
  },
  {
    id: "g3",
    label: "Cara cepat: harga setelah diskon = (100% − 20%) × harga awal = 80% × …",
    kind: "choice",
    options: ["Rp 100.000 = Rp 80.000", "Rp 80.000 = Rp 64.000", "Rp 20.000 = Rp 16.000", "Rp 50.000 = Rp 40.000"],
    correctIndex: 0,
    discussion: [
      "Cara cepat: bayar = (100% − %diskon) × harga awal.",
      "= 80% × 100.000 = Rp 80.000. Hasilnya sama dengan cara panjang.",
    ],
  },
  {
    id: "g4",
    label: "Benar atau salah: Diskon 50% berarti kita membayar SETENGAH dari harga awal.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "Diskon 50% → bayar (100% − 50%) = 50% × harga awal = setengah harga awal.",
      "Pernyataan BENAR.",
    ],
  },
  {
    id: "g5",
    label: "Pasangkan persen diskon dengan persen yang harus dibayar.",
    kind: "match",
    pairs: [
      { left: "Diskon 10%", right: "Bayar 90%" },
      { left: "Diskon 25%", right: "Bayar 75%" },
      { left: "Diskon 30%", right: "Bayar 70%" },
      { left: "Diskon 40%", right: "Bayar 60%" },
    ],
    discussion: [
      "Persen bayar = 100% − persen diskon.",
      "Trik ini sangat membantu mempercepat hitungan.",
    ],
  },
  {
    id: "g6",
    label: "Sebuah TV seharga Rp 4.000.000 diskon 15%. Besar diskon = 15% × 4.000.000 = Rp …",
    kind: "fill",
    answers: ["600000", "600.000", "Rp 600.000"],
    discussion: ["15% × 4.000.000 = 0,15 × 4.000.000 = Rp 600.000."],
  },
  {
    id: "g7",
    label: "Maka harga yang dibayar = Rp 4.000.000 − Rp 600.000 = Rp …",
    kind: "fill",
    answers: ["3400000", "3.400.000", "Rp 3.400.000"],
    discussion: ["Bayar = 4.000.000 − 600.000 = Rp 3.400.000 atau 85% × 4.000.000."],
  },
  {
    id: "g8",
    label: "Urutkan langkah menyelesaikan soal diskon:",
    kind: "sort",
    items: [
      "Tulis harga akhir yang harus dibayar.",
      "Tentukan harga awal dan persen diskon.",
      "Hitung besar diskon = persen diskon × harga awal.",
      "Hitung harga bayar = harga awal − diskon.",
    ],
    correctOrder: [
      "Tentukan harga awal dan persen diskon.",
      "Hitung besar diskon = persen diskon × harga awal.",
      "Hitung harga bayar = harga awal − diskon.",
      "Tulis harga akhir yang harus dibayar.",
    ],
    discussion: [
      "Langkah baku: 1) catat harga & %diskon, 2) hitung diskon, 3) kurangkan, 4) tulis kesimpulan.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Sepatu seharga Rp 250.000 diskon 20%. Berapa rupiah harus dibayar?",
    kind: "fill",
    answers: ["200000", "200.000", "Rp 200.000"],
    hint: "Bayar = 80% × 250.000.",
    discussion: ["Diskon = 0,2 × 250.000 = 50.000. Bayar = 250.000 − 50.000 = Rp 200.000."],
  },
  {
    id: "p2",
    question: "Sebuah tas seharga Rp 600.000 diskon 30%. Harga setelah diskon adalah …",
    kind: "choice",
    options: ["Rp 180.000", "Rp 420.000", "Rp 480.000", "Rp 540.000"],
    correctIndex: 1,
    hint: "Bayar = 70% × 600.000.",
    discussion: ["Diskon 30% × 600.000 = 180.000. Bayar = 600.000 − 180.000 = Rp 420.000."],
  },
  {
    id: "p3",
    question: "Toko memberikan diskon 25%. Jika harga akhir Rp 150.000, berapa harga awalnya?",
    kind: "fill",
    answers: ["200000", "200.000", "Rp 200.000"],
    hint: "Harga akhir = 75% × harga awal. Jadi harga awal = harga akhir / 0,75.",
    discussion: ["75% × HA = 150.000 → HA = 150.000 / 0,75 = Rp 200.000."],
  },
  {
    id: "p4",
    question: "Benar atau salah: Diskon 25% + 25% sama dengan diskon 50%.",
    kind: "truefalse",
    correct: false,
    hint: "Diskon kedua dihitung dari harga setelah diskon pertama.",
    discussion: [
      "Diskon ganda 25% + 25% = (75% × 75%) × HA = 56,25% × HA.",
      "Berarti diskon efektif = 100% − 56,25% = 43,75%, bukan 50%.",
      "Pernyataan SALAH.",
    ],
  },
  {
    id: "p5",
    question: "Harga jaket Rp 800.000 diskon 15% lalu ditambah ongkir Rp 20.000. Berapa total dibayar?",
    kind: "fill",
    answers: ["700000", "700.000", "Rp 700.000"],
    hint: "Hitung dulu harga setelah diskon, baru tambahkan ongkir.",
    discussion: [
      "Diskon = 15% × 800.000 = 120.000.",
      "Setelah diskon = 800.000 − 120.000 = 680.000.",
      "Total bayar = 680.000 + 20.000 = Rp 700.000.",
    ],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-cocok-diskon",
    title: "🏷️ Game 1: Cocokkan Persen Diskon ↔ Persen Bayar",
    description: "Pindahkan setiap persen diskon ke persen bayar yang sesuai. Ingat: bayar = 100% − diskon!",
    buckets: [
      { id: "b90", label: "Bayar 90%", emoji: "💸", color: "cyan" },
      { id: "b75", label: "Bayar 75%", emoji: "💵", color: "emerald" },
      { id: "b60", label: "Bayar 60%", emoji: "💰", color: "amber" },
      { id: "b50", label: "Bayar 50%", emoji: "🪙", color: "rose" },
    ],
    items: [
      { id: "d1", label: "Diskon 10%", bucketId: "b90" },
      { id: "d2", label: "Diskon 25%", bucketId: "b75" },
      { id: "d3", label: "Diskon 40%", bucketId: "b60" },
      { id: "d4", label: "Diskon 50%", bucketId: "b50" },
      { id: "d5", label: "Diskon 25%", bucketId: "b75" },
      { id: "d6", label: "Diskon 10%", bucketId: "b90" },
      { id: "d7", label: "Diskon 50%", bucketId: "b50" },
      { id: "d8", label: "Diskon 40%", bucketId: "b60" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-harga-bayar",
    title: "🎮 Game 2: Berapa yang Harus Dibayar?",
    description: "Tekan ◀ ▶ pilih harga yang HARUS DIBAYAR setelah diskon.",
    rightOptions: ["Rp 40.000", "Rp 60.000", "Rp 80.000", "Rp 90.000", "Rp 120.000", "Rp 240.000"],
    pairs: [
      { id: "r1", left: "Rp 100.000 diskon 20%", correctRight: "Rp 80.000", emoji: "🧥" },
      { id: "r2", left: "Rp 100.000 diskon 60%", correctRight: "Rp 40.000", emoji: "👕" },
      { id: "r3", left: "Rp 200.000 diskon 40%", correctRight: "Rp 120.000", emoji: "👟" },
      { id: "r4", left: "Rp 300.000 diskon 20%", correctRight: "Rp 240.000", emoji: "🎒" },
      { id: "r5", left: "Rp 100.000 diskon 10%", correctRight: "Rp 90.000", emoji: "🧢" },
    ],
  },
  {
    kind: "page-link",
    id: "game-arena-diskon",
    title: "🚀 Game 3: Math Game Arena – Diskon",
    description: "Buka mode permainan layar penuh untuk berburu diskon di Math Game Arena!",
    path: "/math-game-arena/kelas-7/aritmetika-sosial/diskon",
    buttonLabel: "MAINKAN DI MATH GAME ARENA",
    emoji: "🏷️",
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi 1: Diskon Kaos di Mall 👕",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">👕</p>
        <p className="text-lg font-bold text-white">Harga Awal: <span className="text-cyan-300">Rp 100.000</span></p>
        <p className="text-lg font-bold text-yellow-300">Diskon 20% = Rp 20.000</p>
        <p className="text-lg font-bold text-emerald-300">Bayar: Rp 80.000</p>
      </div>
    ),
    text: "Diskon = persen × harga awal. Bayar = harga awal − diskon.",
  },
  {
    title: "Situasi 2: Diskon Sepatu 👟",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">👟</p>
        <p className="text-lg font-bold text-white">Harga Awal: <span className="text-cyan-300">Rp 500.000</span></p>
        <p className="text-lg font-bold text-yellow-300">Diskon 30% = Rp 150.000</p>
        <p className="text-lg font-bold text-emerald-300">Bayar: Rp 350.000</p>
      </div>
    ),
    text: "Cara cepat: bayar = (100% − %diskon) × harga awal = 70% × 500.000 = Rp 350.000.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Besar Diskon", text: "Diskon = % diskon × Harga Awal.", tone: "yellow" },
  { title: "Harga Bayar", text: "Bayar = Harga Awal − Diskon = (100% − %diskon) × Harga Awal.", tone: "emerald" },
  { title: "Cara Cepat", text: "Diskon 25% → bayar 75%. Selalu (100% − %diskon).", tone: "cyan" },
];

const DiskonLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Aritmetika Sosial • Kelas 7"
    title="🏷️ Diskon (Potongan Harga)"
    intro="Bersama Sobat Numatik, kita akan menemukan rumus diskon dan cara cepat menghitung harga bayar di toko, lalu mempraktikkannya melalui mini-game seru!"
    situations={situations}
    guidedIntro="Lengkapi soal-soal terbimbing untuk menemukan rumus diskon dan harga bayar."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Sekarang giliranmu mencoba berbagai jenis soal diskon di kehidupan nyata."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/aritmetika-sosial"
    backLabel="Kembali ke menu LKPD Aritmetika Sosial"
  />
);

export default DiskonLKPDPage;
