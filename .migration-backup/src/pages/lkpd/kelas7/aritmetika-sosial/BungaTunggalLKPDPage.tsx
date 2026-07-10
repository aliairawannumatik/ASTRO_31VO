import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Andi menabung Rp 1.000.000 di bank dengan bunga TUNGGAL 6% per TAHUN. Besarnya bunga 1 tahun = 6% × 1.000.000 = Rp …",
    kind: "fill",
    answers: ["60000", "60.000", "Rp 60.000"],
    discussion: [
      "Bunga 1 tahun = persen bunga × modal.",
      "= 6% × 1.000.000 = 0,06 × 1.000.000 = Rp 60.000.",
    ],
  },
  {
    id: "g2",
    label: "Maka tabungan setelah 1 tahun = Rp 1.000.000 + Rp 60.000 = Rp …",
    kind: "fill",
    answers: ["1060000", "1.060.000", "Rp 1.060.000"],
    discussion: ["Tabungan akhir 1 tahun = Modal + Bunga = 1.000.000 + 60.000 = Rp 1.060.000."],
  },
  {
    id: "g3",
    label: "Pada bunga TUNGGAL, bunga tiap tahun nilainya …",
    kind: "choice",
    options: ["Berubah-ubah", "Selalu sama (tetap)", "Selalu naik 2x lipat", "Tergantung cuaca"],
    correctIndex: 1,
    discussion: [
      "Bunga tunggal: bunga selalu dihitung dari MODAL AWAL, jadi nilainya tetap setiap tahun.",
      "Berbeda dengan bunga majemuk yang bunganya ikut berbunga.",
    ],
  },
  {
    id: "g4",
    label: "Setelah n TAHUN, total bunga = n × persen bunga × modal. Setelah 3 tahun, bunga Andi = 3 × 6% × 1.000.000 = Rp …",
    kind: "fill",
    answers: ["180000", "180.000", "Rp 180.000"],
    discussion: [
      "Bunga 3 tahun = 3 × 60.000 = 180.000.",
      "Atau langsung: 3 × 0,06 × 1.000.000 = 180.000.",
    ],
  },
  {
    id: "g5",
    label: "Untuk waktu dalam BULAN, kita pakai b/12. Bunga 6 bulan dengan bunga 6%/tahun = (6/12) × 6% × 1.000.000 = Rp …",
    kind: "fill",
    answers: ["30000", "30.000", "Rp 30.000"],
    discussion: [
      "Waktu dalam bulan diubah ke tahun: 6 bulan = 6/12 tahun = 0,5 tahun.",
      "Bunga = 0,5 × 0,06 × 1.000.000 = 30.000.",
    ],
  },
  {
    id: "g6",
    label: "Pasangkan rumus dengan kegunaannya.",
    kind: "match",
    pairs: [
      { left: "B = M × p% × t", right: "Mencari Bunga (t = tahun)" },
      { left: "B = M × p% × b/12", right: "Mencari Bunga (b = bulan)" },
      { left: "Tabungan akhir = M + B", right: "Mencari saldo akhir" },
      { left: "M = B / (p% × t)", right: "Mencari modal" },
    ],
    discussion: [
      "Rumus dasar: Bunga = Modal × persen × waktu.",
      "Pastikan satuan waktu konsisten (tahun atau bulan/12).",
    ],
  },
  {
    id: "g7",
    label: "Benar atau salah: Bunga 12% per tahun sama dengan 1% per bulan.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "Bunga TUNGGAL: 12% / 12 bulan = 1% per bulan.",
      "Pernyataan BENAR.",
    ],
  },
  {
    id: "g8",
    label: "Urutkan langkah menyelesaikan soal bunga tunggal:",
    kind: "sort",
    items: [
      "Tulis hasil dengan satuan rupiah.",
      "Tentukan modal (M), persen bunga (p%), dan waktu (t).",
      "Samakan satuan waktu (tahun atau bulan/12).",
      "Hitung bunga = M × p% × t.",
    ],
    correctOrder: [
      "Tentukan modal (M), persen bunga (p%), dan waktu (t).",
      "Samakan satuan waktu (tahun atau bulan/12).",
      "Hitung bunga = M × p% × t.",
      "Tulis hasil dengan satuan rupiah.",
    ],
    discussion: [
      "Langkah baku: 1) catat data, 2) samakan waktu, 3) hitung bunga, 4) tulis kesimpulan.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Modal Rp 2.000.000 ditabung dengan bunga tunggal 5% per tahun. Berapa bunga setelah 1 tahun?",
    kind: "fill",
    answers: ["100000", "100.000", "Rp 100.000"],
    hint: "B = 5% × 2.000.000.",
    discussion: ["B = 0,05 × 2.000.000 = Rp 100.000."],
  },
  {
    id: "p2",
    question: "Modal Rp 4.000.000, bunga tunggal 6%/tahun. Total tabungan setelah 2 tahun adalah …",
    kind: "choice",
    options: ["Rp 4.240.000", "Rp 4.480.000", "Rp 4.500.000", "Rp 4.800.000"],
    correctIndex: 1,
    hint: "Bunga 2 tahun = 2 × 6% × 4.000.000.",
    discussion: [
      "Bunga = 2 × 0,06 × 4.000.000 = 480.000.",
      "Total = 4.000.000 + 480.000 = Rp 4.480.000.",
    ],
  },
  {
    id: "p3",
    question: "Modal Rp 1.500.000, bunga 8%/tahun. Berapa bunga setelah 9 bulan?",
    kind: "fill",
    answers: ["90000", "90.000", "Rp 90.000"],
    hint: "B = M × p% × b/12 = 1.500.000 × 0,08 × 9/12.",
    discussion: ["B = 1.500.000 × 0,08 × (9/12) = 1.500.000 × 0,08 × 0,75 = Rp 90.000."],
  },
  {
    id: "p4",
    question: "Setelah 1 tahun, tabungan menjadi Rp 1.080.000 dengan bunga 8%/tahun. Berapa modal awalnya?",
    kind: "fill",
    answers: ["1000000", "1.000.000", "Rp 1.000.000"],
    hint: "Tabungan akhir = 108% × M.",
    discussion: ["108% × M = 1.080.000 → M = 1.080.000 / 1,08 = Rp 1.000.000."],
  },
  {
    id: "p5",
    question: "Benar atau salah: Bunga tunggal 10%/tahun selama 6 bulan = 10% × Modal.",
    kind: "truefalse",
    correct: false,
    hint: "Waktu setengah tahun → bunga juga setengah.",
    discussion: [
      "6 bulan = 0,5 tahun, jadi bunganya = 0,5 × 10% × M = 5% × M.",
      "Pernyataan SALAH.",
    ],
  },
  {
    id: "p6",
    question: "Modal Rp 2.000.000, bunga 9%/tahun. Berapa lama (dalam bulan) agar bunganya menjadi Rp 90.000?",
    kind: "fill",
    answers: ["6", "6 bulan"],
    hint: "B = M × p% × b/12 → cari b.",
    discussion: [
      "90.000 = 2.000.000 × 0,09 × b/12.",
      "90.000 = 15.000 × b → b = 6 bulan.",
    ],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-modal-bunga",
    title: "🏦 Game 1: Kelompokkan Berdasarkan Persen Bunga",
    description: "Tarik setiap kartu skenario ke kotak persen bunga/tahun yang sesuai.",
    buckets: [
      { id: "p5", label: "5%/tahun", emoji: "🪙", color: "cyan" },
      { id: "p10", label: "10%/tahun", emoji: "💵", color: "emerald" },
      { id: "p12", label: "12%/tahun", emoji: "💰", color: "amber" },
    ],
    items: [
      { id: "i1", label: "M = 1jt, B 1th = Rp 50rb", bucketId: "p5" },
      { id: "i2", label: "M = 2jt, B 1th = Rp 200rb", bucketId: "p10" },
      { id: "i3", label: "M = 1jt, B 1th = Rp 120rb", bucketId: "p12" },
      { id: "i4", label: "M = 4jt, B 1th = Rp 200rb", bucketId: "p5" },
      { id: "i5", label: "M = 5jt, B 1th = Rp 500rb", bucketId: "p10" },
      { id: "i6", label: "M = 500rb, B 1th = Rp 60rb", bucketId: "p12" },
      { id: "i7", label: "M = 10jt, B 1th = Rp 1jt", bucketId: "p10" },
      { id: "i8", label: "M = 2jt, B 1th = Rp 100rb", bucketId: "p5" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-hitung-bunga",
    title: "🎮 Game 2: Hitung Bunga Tunggal!",
    description: "Tekan ◀ ▶ pilih BUNGA yang benar setelah waktu tertentu.",
    rightOptions: ["Rp 30.000", "Rp 50.000", "Rp 60.000", "Rp 100.000", "Rp 120.000", "Rp 200.000"],
    pairs: [
      { id: "r1", left: "M=1jt, p=6%/th, t=1 th", correctRight: "Rp 60.000", emoji: "🏦" },
      { id: "r2", left: "M=1jt, p=10%/th, t=1 th", correctRight: "Rp 100.000", emoji: "💰" },
      { id: "r3", left: "M=1jt, p=6%/th, t=6 bln", correctRight: "Rp 30.000", emoji: "📅" },
      { id: "r4", left: "M=2jt, p=6%/th, t=1 th", correctRight: "Rp 120.000", emoji: "💵" },
      { id: "r5", left: "M=1jt, p=5%/th, t=1 th", correctRight: "Rp 50.000", emoji: "🪙" },
    ],
  },
  {
    kind: "page-link",
    id: "game-arena-bunga",
    title: "🚀 Game 3: Math Game Arena – Bunga Tunggal",
    description: "Mainkan tantangan bunga tunggal layar penuh di Math Game Arena!",
    path: "/math-game-arena/kelas-7/aritmetika-sosial/bunga-tunggal",
    buttonLabel: "MAINKAN DI MATH GAME ARENA",
    emoji: "🏦",
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi 1: Andi Menabung 🐷",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">🏦💰</p>
        <p className="text-lg font-bold text-white">Modal: Rp 1.000.000</p>
        <p className="text-lg font-bold text-yellow-300">Bunga 6%/tahun</p>
        <p className="text-lg font-bold text-emerald-300">Bunga 1 tahun = Rp 60.000</p>
      </div>
    ),
    text: "Bunga TUNGGAL = persen × modal × waktu. Setiap tahun bunganya tetap (60.000).",
  },
  {
    title: "Situasi 2: Bunga Selama Beberapa Bulan 📅",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">📅</p>
        <p className="text-lg font-bold text-white">Modal: Rp 1.000.000</p>
        <p className="text-lg font-bold text-yellow-300">Bunga 6%/tahun, 6 bulan</p>
        <p className="text-lg font-bold text-emerald-300">B = 1jt × 6% × 6/12 = Rp 30.000</p>
      </div>
    ),
    text: "Untuk waktu kurang dari 1 tahun, gunakan b/12 (waktu dalam bulan dibagi 12).",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Rumus Bunga (tahun)", text: "B = M × p% × t, dengan t dalam tahun.", tone: "cyan" },
  { title: "Rumus Bunga (bulan)", text: "B = M × p% × b/12, dengan b dalam bulan.", tone: "violet" },
  { title: "Tabungan Akhir", text: "Saldo akhir = M + B (Modal + Bunga total).", tone: "emerald" },
];

const BungaTunggalLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Aritmetika Sosial • Kelas 7"
    title="🏦 Bunga Tunggal"
    intro="Mari kita temukan rumus bunga tunggal langkah demi langkah, lalu mantapkan dengan tiga mini-game perbankan!"
    situations={situations}
    guidedIntro="Selesaikan pertanyaan berikut agar Sobat Numatik bisa menemukan sendiri rumus bunga tunggal."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Gunakan rumus yang sudah kamu temukan untuk soal kontekstual perbankan."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/aritmetika-sosial"
    backLabel="Kembali ke menu LKPD Aritmetika Sosial"
  />
);

export default BungaTunggalLKPDPage;
