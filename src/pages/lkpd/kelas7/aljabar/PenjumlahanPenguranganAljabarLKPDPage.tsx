import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "3x + 5x = ...",
    kind: "fill",
    answers: ["8x"],
    discussion: ["Suku sejenis (sama-sama x) → jumlahkan koefisien: 3 + 5 = 8. Hasil: 8x."],
  },
  {
    id: "g2",
    label: "Pilih hasil yang benar untuk: 7y − 2y + 4y.",
    kind: "choice",
    options: ["13y", "9y", "5y", "7y"],
    correctIndex: 1,
    discussion: ["7 − 2 + 4 = 9. Variabel y tetap. Hasil: 9y."],
  },
  {
    id: "g3",
    label: "Benar atau salah: 4a + 3b dapat disederhanakan menjadi 7ab.",
    kind: "truefalse",
    correct: false,
    discussion: [
      "4a dan 3b BUKAN suku sejenis (variabelnya berbeda).",
      "Hasilnya tetap 4a + 3b, tidak bisa digabung. Pernyataan SALAH.",
    ],
  },
  {
    id: "g4",
    label: "(2x + 3) + (5x + 4) = ...",
    kind: "fill",
    answers: ["7x+7", "7x + 7"],
    discussion: [
      "Kelompokkan suku sejenis: (2x + 5x) + (3 + 4) = 7x + 7.",
    ],
  },
  {
    id: "g5",
    label: "Urutkan langkah menyederhanakan 6m + 4 − 2m + 7:",
    kind: "sort",
    items: [
      "Hasil akhir: 4m + 11.",
      "Jumlahkan koefisien m: 6 − 2 = 4.",
      "Jumlahkan konstanta: 4 + 7 = 11.",
      "Kelompokkan suku sejenis: (6m − 2m) + (4 + 7).",
    ],
    correctOrder: [
      "Kelompokkan suku sejenis: (6m − 2m) + (4 + 7).",
      "Jumlahkan koefisien m: 6 − 2 = 4.",
      "Jumlahkan konstanta: 4 + 7 = 11.",
      "Hasil akhir: 4m + 11.",
    ],
    discussion: [
      "Langkah baku: 1) kelompokkan, 2) hitung koefisien, 3) hitung konstanta, 4) tulis hasil.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Sederhanakan: 9x − 4x + 2x.",
    kind: "fill",
    answers: ["7x"],
    hint: "Variabel sama → jumlahkan koefisiennya saja.",
    discussion: ["9 − 4 + 2 = 7. Hasil: 7x."],
  },
  {
    id: "p2",
    question: "(4a + 2b) + (5a − 3b) = ...",
    kind: "choice",
    options: ["9a − b", "9a + 5b", "−a − b", "9a + b"],
    correctIndex: 0,
    hint: "Gabungkan a dengan a dan b dengan b.",
    discussion: ["a: 4 + 5 = 9 → 9a. b: 2 − 3 = −1 → −b. Hasil: 9a − b."],
  },
  {
    id: "p3",
    question: "Sederhanakan: 6p + 3 − (2p + 5).",
    kind: "fill",
    answers: ["4p-2", "4p − 2"],
    hint: "Tanda − di depan kurung mengubah tanda di dalam.",
    discussion: ["6p + 3 − 2p − 5 = (6 − 2)p + (3 − 5) = 4p − 2."],
  },
  {
    id: "p4",
    question: "Benar atau salah: hasil dari 5x² + 3x − 2x² adalah 6x.",
    kind: "truefalse",
    correct: false,
    hint: "x² hanya boleh digabung dengan x², bukan dengan x.",
    discussion: ["x²: 5 − 2 = 3 → 3x². 3x tetap. Hasil benar: 3x² + 3x. Pernyataan SALAH."],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-kelompok-suku",
    title: "🎯 Game 1: Kelompokkan Suku Sejenis",
    description: "Pindahkan setiap suku ke kelompoknya. Suku sejenis akan disatukan agar mudah dijumlahkan!",
    buckets: [
      { id: "x", label: "Suku x", emoji: "🟦", color: "cyan" },
      { id: "y", label: "Suku y", emoji: "🟨", color: "amber" },
      { id: "kons", label: "Konstanta", emoji: "💎", color: "emerald" },
    ],
    items: [
      { id: "i1", label: "3x", bucketId: "x" },
      { id: "i2", label: "−2y", bucketId: "y" },
      { id: "i3", label: "5", bucketId: "kons" },
      { id: "i4", label: "7x", bucketId: "x" },
      { id: "i5", label: "8y", bucketId: "y" },
      { id: "i6", label: "−4", bucketId: "kons" },
      { id: "i7", label: "−x", bucketId: "x" },
      { id: "i8", label: "10", bucketId: "kons" },
      { id: "i9", label: "6y", bucketId: "y" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-hasil-akhir",
    title: "🎮 Game 2: Tekan Panah, Temukan Hasil!",
    description: "Tekan ◀ ▶ untuk memilih hasil yang benar dari setiap operasi aljabar.",
    rightOptions: ["5x", "10x", "2x + 5", "3a + 2b", "−3y"],
    pairs: [
      { id: "r1", left: "2x + 3x", correctRight: "5x", emoji: "🧮" },
      { id: "r2", left: "(x + 2) + (x + 3)", correctRight: "2x + 5", emoji: "📦" },
      { id: "r3", left: "(2a + b) + (a + b)", correctRight: "3a + 2b", emoji: "🎲" },
      { id: "r4", left: "4x + 6x", correctRight: "10x", emoji: "🔟" },
      { id: "r5", left: "y − 4y", correctRight: "−3y", emoji: "📉" },
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Permen di Saku",
    visual: (
      <div className="text-center">
        <div className="text-3xl mb-2">🍬🍬🍬 + 🍬🍬 = 🍬🍬🍬🍬🍬</div>
        <p className="font-display text-2xl font-bold text-cyan-300 mt-2">3p + 2p = 5p</p>
      </div>
    ),
    text: "Permen di kantong (p) dijumlahkan: 3 + 2 = 5, hasil 5p. Suku sejenis bisa langsung dijumlahkan koefisiennya.",
  },
  {
    title: "Situasi: Buah Campur",
    visual: (
      <div className="text-center">
        <div className="text-3xl mb-2">🍎🍎 + 🍌🍌🍌</div>
        <p className="font-display text-2xl font-bold text-yellow-300 mt-2">2a + 3b</p>
      </div>
    ),
    text: "Apel (a) dan pisang (b) berbeda jenis → tidak bisa dijumlahkan menjadi 5ab. Tetap 2a + 3b.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Suku Sejenis", text: "Variabel & pangkat sama → koefisien dijumlahkan/dikurangkan.", tone: "cyan" },
  { title: "Tanda Kurung", text: "Tanda + sebelum kurung dilepas apa adanya; tanda − membalik tanda di dalam.", tone: "violet" },
  { title: "Hasil Akhir", text: "Tuliskan dari pangkat tertinggi ke terendah agar rapi.", tone: "emerald" },
];

const PenjumlahanPenguranganAljabarLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Aljabar • Kelas 7"
    title="➕➖ Penjumlahan & Pengurangan Aljabar"
    intro="Latih operasi tambah-kurang aljabar dengan langkah baku dan dua mini-game seru!"
    situations={situations}
    guidedIntro="Selesaikan aktivitas terbimbing untuk menemukan aturan operasi suku sejenis."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Kerjakan soal latihan untuk memantapkan pemahaman."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/aljabar"
    backLabel="Kembali ke menu LKPD Aljabar"
  />
);

export default PenjumlahanPenguranganAljabarLKPDPage;
