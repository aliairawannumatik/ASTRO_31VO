import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Jika x = 4, maka nilai 3x = ...",
    kind: "fill",
    answers: ["12"],
    discussion: ["3x berarti 3 × x. Substitusi x = 4 → 3 × 4 = 12."],
  },
  {
    id: "g2",
    label: "Untuk x = 2, nilai dari 2x + 5 adalah ...",
    kind: "choice",
    options: ["7", "9", "12", "10"],
    correctIndex: 1,
    discussion: ["2(2) + 5 = 4 + 5 = 9."],
  },
  {
    id: "g3",
    label: "Jika a = 3 dan b = 5, nilai a + 2b = ...",
    kind: "fill",
    answers: ["13"],
    discussion: ["3 + 2(5) = 3 + 10 = 13."],
  },
  {
    id: "g4",
    label: "Benar atau salah: nilai x² untuk x = −3 adalah −9.",
    kind: "truefalse",
    correct: false,
    discussion: ["(−3)² = (−3) × (−3) = 9 (positif). Pernyataan SALAH."],
  },
  {
    id: "g5",
    label: "Urutkan langkah menghitung 4x − 1 untuk x = 5:",
    kind: "sort",
    items: [
      "Hasil = 19.",
      "Hitung 20 − 1.",
      "Substitusi x = 5: 4(5) − 1.",
      "Kalikan: 4 × 5 = 20.",
    ],
    correctOrder: [
      "Substitusi x = 5: 4(5) − 1.",
      "Kalikan: 4 × 5 = 20.",
      "Hitung 20 − 1.",
      "Hasil = 19.",
    ],
    discussion: ["Selalu kerjakan kali/bagi dulu sebelum tambah/kurang."],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Tentukan nilai 5y − 3 jika y = 4.",
    kind: "fill",
    answers: ["17"],
    hint: "Substitusi y = 4 lalu hitung kali dulu.",
    discussion: ["5(4) − 3 = 20 − 3 = 17."],
  },
  {
    id: "p2",
    question: "Untuk a = 2 dan b = −1, nilai 3a + 2b adalah ...",
    kind: "choice",
    options: ["8", "4", "5", "−4"],
    correctIndex: 1,
    hint: "Hati-hati dengan tanda negatif.",
    discussion: ["3(2) + 2(−1) = 6 + (−2) = 4."],
  },
  {
    id: "p3",
    question: "Nilai dari x² + 2x untuk x = 3 adalah ...",
    kind: "fill",
    answers: ["15"],
    hint: "x² = x × x.",
    discussion: ["3² + 2(3) = 9 + 6 = 15."],
  },
  {
    id: "p4",
    question: "Benar atau salah: untuk p = −2, nilai 4p + 7 sama dengan −1.",
    kind: "truefalse",
    correct: true,
    hint: "4 × (−2) = −8.",
    discussion: ["4(−2) + 7 = −8 + 7 = −1. BENAR."],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-substitusi",
    title: "🎯 Game 1: Drop Nilai → Bentuk Aljabar",
    description: "Setiap bentuk aljabar punya satu nilai yang benar saat x = 3. Tarik kartu nilai ke bentuk yang cocok.",
    buckets: [
      { id: "b1", label: "x + 5 (saat x=3)", emoji: "🧮", color: "cyan" },
      { id: "b2", label: "2x − 1 (saat x=3)", emoji: "🎲", color: "violet" },
      { id: "b3", label: "x² (saat x=3)", emoji: "🟪", color: "rose" },
      { id: "b4", label: "10 − x (saat x=3)", emoji: "📉", color: "emerald" },
    ],
    items: [
      { id: "i1", label: "8", bucketId: "b1" },
      { id: "i2", label: "5", bucketId: "b2" },
      { id: "i3", label: "9", bucketId: "b3" },
      { id: "i4", label: "7", bucketId: "b4" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-substitusi-2",
    title: "🎮 Game 2: Tekan Panah, Pilih Nilai!",
    description: "Untuk a = 2 dan b = 4, tekan ◀ ▶ untuk memilih nilai dari setiap ekspresi.",
    rightOptions: ["6", "8", "10", "12", "−2"],
    pairs: [
      { id: "r1", left: "a + b", correctRight: "6", emoji: "➕" },
      { id: "r2", left: "2b", correctRight: "8", emoji: "✖️" },
      { id: "r3", left: "a + 2b", correctRight: "10", emoji: "🎯" },
      { id: "r4", left: "3a + b − 2 + 4", correctRight: "12", emoji: "🧮" },
      { id: "r5", left: "a − b", correctRight: "−2", emoji: "📉" },
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Mesin Aljabar",
    visual: (
      <div className="text-center">
        <div className="text-3xl mb-2">🎰 → 2x + 1 → ?</div>
        <p className="text-sm text-white/70">Masukkan nilai x = 3 ke dalam mesin.</p>
        <p className="font-display text-2xl font-bold text-cyan-300 mt-2">2(3) + 1 = 7</p>
      </div>
    ),
    text: "Substitusi = mengganti variabel dengan nilai bilangan, lalu menghitungnya.",
  },
  {
    title: "Situasi: Harga Tiket",
    visual: (
      <div className="text-center">
        <div className="text-3xl mb-2">🎫 = 5x + 10</div>
        <p className="text-sm text-white/70">Untuk x = 4 orang dewasa.</p>
        <p className="font-display text-2xl font-bold text-yellow-300 mt-2">5(4) + 10 = 30</p>
      </div>
    ),
    text: "Rumus harga tiket: 5x + 10. Untuk 4 dewasa hasilnya 30 ribu.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Substitusi", text: "Ganti variabel dengan nilainya, tulis di dalam kurung.", tone: "cyan" },
  { title: "Tanda Kurung", text: "Pakai kurung untuk bilangan negatif: (−2)² = 4, BUKAN −4.", tone: "violet" },
  { title: "Urutan Operasi", text: "Pangkat → kali/bagi → tambah/kurang (dari kiri).", tone: "emerald" },
];

const SubstitusiAljabarLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Aljabar • Kelas 7"
    title="🔁 Substitusi Bilangan"
    intro="Belajar mengganti variabel dengan nilai bilangan dan menghitung hasilnya — lengkap dengan dua mini-game!"
    situations={situations}
    guidedIntro="Selesaikan setiap aktivitas untuk menguasai langkah substitusi."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Asah pemahamanmu dengan soal latihan."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/aljabar"
    backLabel="Kembali ke menu LKPD Aljabar"
  />
);

export default SubstitusiAljabarLKPDPage;
