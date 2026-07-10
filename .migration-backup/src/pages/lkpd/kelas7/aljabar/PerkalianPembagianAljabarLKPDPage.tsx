import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "3x × 4 = ...",
    kind: "fill",
    answers: ["12x"],
    discussion: ["Kalikan koefisien dengan koefisien: 3 × 4 = 12. Variabel x tetap. Hasil: 12x."],
  },
  {
    id: "g2",
    label: "2x × 5y = ...",
    kind: "choice",
    options: ["7xy", "10xy", "10x + 5y", "10x²"],
    correctIndex: 1,
    discussion: [
      "Koefisien: 2 × 5 = 10.",
      "Variabel: x × y = xy.",
      "Hasil: 10xy.",
    ],
  },
  {
    id: "g3",
    label: "Pilih hasil dari 4(x + 3).",
    kind: "choice",
    options: ["x + 12", "4x + 3", "4x + 12", "7x"],
    correctIndex: 2,
    discussion: ["Sifat distributif: 4·x + 4·3 = 4x + 12."],
  },
  {
    id: "g4",
    label: "Benar atau salah: x² × x³ = x⁵.",
    kind: "truefalse",
    correct: true,
    discussion: ["Aturan pangkat: aᵐ × aⁿ = aᵐ⁺ⁿ. 2 + 3 = 5. BENAR."],
  },
  {
    id: "g5",
    label: "12x ÷ 4 = ...",
    kind: "fill",
    answers: ["3x"],
    discussion: ["Bagi koefisien: 12 ÷ 4 = 3. Variabel tetap. Hasil: 3x."],
  },
  {
    id: "g6",
    label: "10x³ ÷ 2x = ...",
    kind: "fill",
    answers: ["5x²"],
    discussion: ["Koefisien: 10 ÷ 2 = 5. Variabel: x³ ÷ x = x². Hasil: 5x²."],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Hitunglah 6a × 3b.",
    kind: "fill",
    answers: ["18ab"],
    hint: "Kalikan koefisien lalu satukan variabel.",
    discussion: ["6 × 3 = 18; a × b = ab. Hasil: 18ab."],
  },
  {
    id: "p2",
    question: "Sederhanakan: 5(2x − 3).",
    kind: "fill",
    answers: ["10x-15", "10x − 15"],
    hint: "Kalikan setiap suku di dalam kurung.",
    discussion: ["5·2x − 5·3 = 10x − 15."],
  },
  {
    id: "p3",
    question: "Hasil dari 15x²y ÷ 3xy adalah ...",
    kind: "choice",
    options: ["5x", "5xy", "5x²", "5"],
    correctIndex: 0,
    hint: "Bagi koefisien dan kurangi pangkat variabel yang sama.",
    discussion: ["15 ÷ 3 = 5; x²/x = x; y/y = 1. Hasil: 5x."],
  },
  {
    id: "p4",
    question: "Benar atau salah: (2x)² = 2x².",
    kind: "truefalse",
    correct: false,
    hint: "Pangkat berlaku untuk SELURUH isi kurung, termasuk koefisien.",
    discussion: ["(2x)² = 2² · x² = 4x², BUKAN 2x². Pernyataan SALAH."],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-pasang-hasil",
    title: "🎯 Game 1: Pasangkan dengan Hasil Operasi",
    description: "Tarik kartu operasi ke wadah hasil yang sesuai.",
    buckets: [
      { id: "h6x", label: "Hasil = 6x", emoji: "6️⃣", color: "cyan" },
      { id: "h12x", label: "Hasil = 12x", emoji: "1️⃣2️⃣", color: "violet" },
      { id: "hx2", label: "Hasil = x²", emoji: "🟪", color: "rose" },
      { id: "h2x", label: "Hasil = 2x", emoji: "2️⃣", color: "emerald" },
    ],
    items: [
      { id: "i1", label: "2 × 3x", bucketId: "h6x" },
      { id: "i2", label: "3x × 4", bucketId: "h12x" },
      { id: "i3", label: "x · x", bucketId: "hx2" },
      { id: "i4", label: "4x ÷ 2", bucketId: "h2x" },
      { id: "i5", label: "12x ÷ 2", bucketId: "h6x" },
      { id: "i6", label: "6x × 2", bucketId: "h12x" },
      { id: "i7", label: "x³ ÷ x", bucketId: "hx2" },
      { id: "i8", label: "10x ÷ 5", bucketId: "h2x" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-distributif",
    title: "🎮 Game 2: Distributif dengan Panah",
    description: "Tekan ◀ ▶ untuk memilih hasil distribusi yang tepat.",
    rightOptions: ["3x + 12", "2x + 8", "5x − 20", "6x + 9", "x² − 4x"],
    pairs: [
      { id: "r1", left: "3(x + 4)", correctRight: "3x + 12", emoji: "📦" },
      { id: "r2", left: "2(x + 4)", correctRight: "2x + 8", emoji: "🎁" },
      { id: "r3", left: "5(x − 4)", correctRight: "5x − 20", emoji: "🎯" },
      { id: "r4", left: "3(2x + 3)", correctRight: "6x + 9", emoji: "🧮" },
      { id: "r5", left: "x(x − 4)", correctRight: "x² − 4x", emoji: "🟪" },
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Kotak Permen",
    visual: (
      <div className="text-center">
        <div className="text-3xl mb-2">📦📦📦📦</div>
        <p className="text-sm text-white/70">4 kotak, masing-masing berisi x permen.</p>
        <p className="font-display text-2xl font-bold text-cyan-300 mt-2">4 × x = 4x</p>
      </div>
    ),
    text: "Perkalian aljabar: 4 kotak × x permen tiap kotak = 4x permen.",
  },
  {
    title: "Situasi: Bagi Kue Sama Rata",
    visual: (
      <div className="text-center">
        <div className="text-3xl mb-2">🍰🍰🍰🍰🍰🍰 ÷ 3</div>
        <p className="text-sm text-white/70">6 potong kue dibagi 3 anak.</p>
        <p className="font-display text-2xl font-bold text-violet-300 mt-2">6x ÷ 3 = 2x</p>
      </div>
    ),
    text: "Pembagian aljabar: 6x ÷ 3 = 2x. Bagi koefisien, variabel tetap.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Perkalian", text: "Kalikan koefisien × koefisien, lalu gabung variabel (jumlahkan pangkat).", tone: "cyan" },
  { title: "Distributif", text: "a(b + c) = ab + ac. Setiap suku di dalam kurung dikalikan.", tone: "violet" },
  { title: "Pembagian", text: "Bagi koefisien, kurangi pangkat variabel yang sama.", tone: "emerald" },
];

const PerkalianPembagianAljabarLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Aljabar • Kelas 7"
    title="✖️➗ Perkalian & Pembagian Aljabar"
    intro="Pelajari aturan kali, distributif, dan bagi pada aljabar lewat aktivitas tarik-pindah dan jodoh-panah!"
    situations={situations}
    guidedIntro="Lakukan setiap aktivitas terbimbing untuk menemukan aturan baku."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Latih kemampuanmu dengan soal-soal berikut."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/aljabar"
    backLabel="Kembali ke menu LKPD Aljabar"
  />
);

export default PerkalianPembagianAljabarLKPDPage;
