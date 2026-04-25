import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: 'Untuk menyelesaikan x + 5 = 12, kedua ruas dikurangi dengan ...',
    kind: "fill",
    answers: ["5"],
    discussion: ["Agar 5 hilang dari ruas kiri, kedua ruas dikurangi 5: x + 5 − 5 = 12 − 5 → x = 7."],
  },
  {
    id: "g2",
    label: 'Untuk menyelesaikan x − 4 = 9, kedua ruas ditambah dengan ...',
    kind: "fill",
    answers: ["4"],
    discussion: ["x − 4 + 4 = 9 + 4 → x = 13."],
  },
  {
    id: "g3",
    label: 'Untuk menyelesaikan 3x = 18, kedua ruas dibagi dengan ...',
    kind: "fill",
    answers: ["3"],
    discussion: ["Bagi kedua ruas dengan koefisien 3 → x = 6."],
  },
  {
    id: "g4",
    label: 'Penyelesaian dari 2x + 7 = 19 adalah x = ...',
    kind: "choice",
    options: ["5", "6", "7", "12"],
    correctIndex: 1,
    discussion: ["Kurangi 7: 2x = 12 → bagi 2: x = 6."],
  },
  {
    id: "g5",
    label: 'Untuk persamaan x/4 = 5, kedua ruas dikalikan dengan ...',
    kind: "fill",
    answers: ["4"],
    discussion: ["x/4 × 4 = 5 × 4 → x = 20."],
  },
  {
    id: "g6",
    label: "Benar atau salah: jika kedua ruas suatu persamaan diperlakukan sama (tambah/kurang/kali/bagi), nilai x tetap.",
    kind: "truefalse",
    correct: true,
    discussion: ["Inilah prinsip kesetaraan persamaan — selama kedua ruas diperlakukan sama, persamaan tetap setara."],
  },
  {
    id: "g7",
    label: "Urutkan langkah menyelesaikan 4x − 3 = 13:",
    kind: "sort",
    items: [
      "Bagi kedua ruas dengan 4: x = 4.",
      "Tulis persamaan awal: 4x − 3 = 13.",
      "Tambah kedua ruas dengan 3: 4x = 16.",
      "Periksa: 4(4) − 3 = 13 ✓.",
    ],
    correctOrder: [
      "Tulis persamaan awal: 4x − 3 = 13.",
      "Tambah kedua ruas dengan 3: 4x = 16.",
      "Bagi kedua ruas dengan 4: x = 4.",
      "Periksa: 4(4) − 3 = 13 ✓.",
    ],
    discussion: ["Pisahkan dulu konstanta (tambah/kurang), baru ratakan koefisien (kali/bagi), terakhir periksa."],
  },
  {
    id: "g8",
    label: 'Penyelesaian 2x + 5 = 5x − 4 adalah x = ...',
    kind: "choice",
    options: ["1", "2", "3", "4"],
    correctIndex: 2,
    discussion: ["Pindahkan 2x ke kanan dan −4 ke kiri: 5 + 4 = 5x − 2x → 9 = 3x → x = 3."],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Tentukan penyelesaian dari x + 9 = 17.",
    kind: "fill",
    answers: ["8"],
    hint: "Kurangi kedua ruas dengan 9.",
    discussion: ["x = 17 − 9 = 8."],
  },
  {
    id: "p2",
    question: "Tentukan penyelesaian dari 5x = 35.",
    kind: "fill",
    answers: ["7"],
    hint: "Bagi kedua ruas dengan koefisien.",
    discussion: ["x = 35 / 5 = 7."],
  },
  {
    id: "p3",
    question: "Tentukan penyelesaian dari 3x − 7 = 11.",
    kind: "choice",
    options: ["3", "5", "6", "9"],
    correctIndex: 2,
    hint: "Tambahkan 7 dulu, lalu bagi 3.",
    discussion: ["3x = 18 → x = 6."],
  },
  {
    id: "p4",
    question: "Tentukan penyelesaian dari 4(x − 2) = 12.",
    kind: "choice",
    options: ["3", "4", "5", "6"],
    correctIndex: 2,
    hint: "Bagi 4 dulu atau jabarkan.",
    discussion: ["x − 2 = 3 → x = 5. Cek: 4(5 − 2) = 12 ✓."],
  },
  {
    id: "p5",
    question: "Penyelesaian dari 2x + 3 = x + 8 adalah x = ...",
    kind: "fill",
    answers: ["5"],
    hint: "Kumpulkan x di satu ruas.",
    discussion: ["2x − x = 8 − 3 → x = 5."],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-operasi",
    title: "🎯 Game 1: Pilih Operasi yang Tepat!",
    description: "Tarik setiap PLSV ke jenis operasi yang HARUS dilakukan pertama kali pada kedua ruas.",
    buckets: [
      { id: "b1", label: "Tambah / Kurang dulu", emoji: "➕➖", color: "cyan" },
      { id: "b2", label: "Kali / Bagi dulu", emoji: "✖️➗", color: "violet" },
    ],
    items: [
      { id: "i1", label: "x + 7 = 12", bucketId: "b1" },
      { id: "i2", label: "5x = 25", bucketId: "b2" },
      { id: "i3", label: "x − 9 = 4", bucketId: "b1" },
      { id: "i4", label: "x/3 = 6", bucketId: "b2" },
      { id: "i5", label: "x + 2 = 9", bucketId: "b1" },
      { id: "i6", label: "−4x = 20", bucketId: "b2" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-akar",
    title: "🎮 Game 2: Cocokkan Persamaan dengan Akarnya",
    description: "Tekan ◀ ▶ untuk memilih nilai x yang merupakan penyelesaian persamaan.",
    rightOptions: ["2", "3", "4", "5", "6"],
    pairs: [
      { id: "r1", left: "2x + 1 = 5", correctRight: "2", emoji: "➕" },
      { id: "r2", left: "3x − 2 = 7", correctRight: "3", emoji: "➖" },
      { id: "r3", left: "x + 4 = 8", correctRight: "4", emoji: "🎯" },
      { id: "r4", left: "5x = 25", correctRight: "5", emoji: "✖️" },
      { id: "r5", left: "x − 1 = 5", correctRight: "6", emoji: "🧮" },
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Timbangan yang Setara",
    visual: (
      <div className="text-center">
        <div className="text-5xl mb-2">⚖️</div>
        <div className="font-display text-xl text-yellow-200 mb-2">x + 5 = 12</div>
        <div className="text-sm text-white/75">Hilangkan 5 di kiri → kurangi 5 di kanan juga.</div>
        <div className="font-display text-2xl font-bold text-emerald-300 mt-2">x = 7</div>
      </div>
    ),
    text: "Persamaan = timbangan yang setimbang. Apa pun yang dilakukan di kiri, harus dilakukan juga di kanan.",
  },
  {
    title: "Situasi: Tiga Langkah Standar",
    visual: (
      <div className="text-left space-y-2 text-sm text-white/85">
        <div className="rounded-lg bg-cyan-500/15 px-3 py-2">1. Sederhanakan tiap ruas (jabarkan kurung).</div>
        <div className="rounded-lg bg-violet-500/15 px-3 py-2">2. Pisahkan suku variabel ↔ konstanta.</div>
        <div className="rounded-lg bg-emerald-500/15 px-3 py-2">3. Bagi dengan koefisien variabel.</div>
      </div>
    ),
    text: "Tiga langkah ini selalu berlaku untuk semua PLSV.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Sifat Kesetaraan", text: "Tambah / kurang / kali / bagi yang sama pada kedua ruas tidak mengubah penyelesaian.", tone: "cyan" },
  { title: "Strategi Umum", text: "Pindahkan konstanta dulu, lalu pindahkan koefisien.", tone: "violet" },
  { title: "Periksa Jawaban", text: "Substitusi nilai x ke persamaan asal — kedua ruas harus sama.", tone: "emerald" },
];

const PenyelesaianPLSVLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif PLSV • Kelas 7"
    title="⚖️ Penyelesaian PLSV"
    intro="Belajar menemukan akar persamaan dengan prinsip timbangan yang setimbang. Cobalah dua mini-game untuk mengasah strategi."
    situations={situations}
    guidedIntro="Ikuti aktivitas berikut untuk menemukan langkah baku menyelesaikan PLSV."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Asah pemahamanmu dengan soal latihan."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/plsv-ptlsv"
    backLabel="Kembali ke menu LKPD PLSV & PtLSV"
  />
);

export default PenyelesaianPLSVLKPDPage;
