import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "PLSV adalah persamaan linear ... variabel.",
    kind: "choice",
    options: ["dua", "tiga", "satu", "tanpa"],
    correctIndex: 2,
    discussion: ["PLSV = Persamaan Linear SATU Variabel. Hanya boleh ada satu jenis variabel."],
  },
  {
    id: "g2",
    label: 'Pangkat tertinggi variabel pada PLSV adalah ...',
    kind: "fill",
    answers: ["1", "satu"],
    discussion: ["Linear berarti pangkat variabelnya 1. Misalnya x⁰ tidak ada variabel, x² bukan linear."],
  },
  {
    id: "g3",
    label: "Manakah yang merupakan PLSV?",
    kind: "choice",
    options: ["x² + 1 = 5", "2x + 3 = 7", "xy = 12", "3 + 4 = 7"],
    correctIndex: 1,
    discussion: ["x² bukan linear; xy ada dua variabel; 3 + 4 = 7 tidak ada variabel. Hanya 2x + 3 = 7 yang PLSV."],
  },
  {
    id: "g4",
    label: "Benar atau salah: kalimat 5y − 4 = 11 adalah PLSV.",
    kind: "truefalse",
    correct: true,
    discussion: ["Hanya satu variabel y berpangkat 1, dihubungkan oleh tanda '=' → PLSV."],
  },
  {
    id: "g5",
    label: 'Pada PLSV "3x + 5 = 14", nilai 3 disebut ... dari variabel x.',
    kind: "fill",
    answers: ["koefisien"],
    discussion: ["Bilangan yang melekat pada variabel disebut KOEFISIEN. 5 dan 14 disebut KONSTANTA."],
  },
  {
    id: "g6",
    label: "Pasangkan istilah dengan contohnya pada 4x − 7 = 9:",
    kind: "match",
    pairs: [
      { left: "Variabel", right: "x" },
      { left: "Koefisien", right: "4" },
      { left: "Konstanta", right: "−7 dan 9" },
      { left: "Tanda hubung", right: "=" },
    ],
    discussion: ["Variabel = huruf, Koefisien = angka pengali variabel, Konstanta = angka berdiri sendiri, Tanda = menghubungkan ruas."],
  },
  {
    id: "g7",
    label: "Urutkan langkah memeriksa apakah suatu kalimat merupakan PLSV:",
    kind: "sort",
    items: [
      "Periksa pangkat variabel = 1?",
      "Hitung jumlah jenis variabel.",
      "Pastikan ada tanda '='.",
      "Simpulkan PLSV atau bukan.",
    ],
    correctOrder: [
      "Pastikan ada tanda '='.",
      "Hitung jumlah jenis variabel.",
      "Periksa pangkat variabel = 1?",
      "Simpulkan PLSV atau bukan.",
    ],
    discussion: ["Cek tanda = → cek 1 variabel saja → cek pangkat 1 → simpulkan."],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Manakah yang BUKAN PLSV?",
    kind: "choice",
    options: ["x + 5 = 9", "2y − 1 = 7", "p² + 3 = 12", "−3z = 15"],
    correctIndex: 2,
    hint: "Cek pangkat variabel.",
    discussion: ["p² berpangkat 2, jadi BUKAN linear."],
  },
  {
    id: "p2",
    question: "Pada 7m + 2 = 30, koefisien dari m adalah ...",
    kind: "fill",
    answers: ["7"],
    hint: "Bilangan yang melekat pada variabel.",
    discussion: ["Koefisien m adalah 7."],
  },
  {
    id: "p3",
    question: "Tentukan banyak variabel pada PLSV 4a − 9 = 11.",
    kind: "fill",
    answers: ["1", "satu"],
    hint: "Hitung jenis hurufnya.",
    discussion: ["Hanya ada satu variabel: a."],
  },
  {
    id: "p4",
    question: "Benar atau salah: 2x + 3y = 10 adalah PLSV.",
    kind: "truefalse",
    correct: false,
    hint: "Berapa jenis variabelnya?",
    discussion: ["Ada DUA variabel (x dan y), maka bukan PLSV (itu PLDV)."],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-plsv-bukan",
    title: "🎯 Game 1: PLSV atau Bukan?",
    description: "Tarik setiap kalimat ke kategori yang benar.",
    buckets: [
      { id: "b1", label: "Termasuk PLSV ✅", emoji: "✅", color: "emerald" },
      { id: "b2", label: "Bukan PLSV ❌", emoji: "❌", color: "rose" },
    ],
    items: [
      { id: "i1", label: "x + 4 = 9", bucketId: "b1" },
      { id: "i2", label: "2x² = 8", bucketId: "b2" },
      { id: "i3", label: "3y − 1 = 8", bucketId: "b1" },
      { id: "i4", label: "a + b = 5", bucketId: "b2" },
      { id: "i5", label: "5p = 25", bucketId: "b1" },
      { id: "i6", label: "2 + 3 = 5", bucketId: "b2" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-koefisien",
    title: "🎮 Game 2: Cocokkan Koefisien & Konstanta",
    description: "Untuk PLSV di kiri, cocokkan koefisien variabelnya.",
    rightOptions: ["1", "2", "3", "5", "7"],
    pairs: [
      { id: "r1", left: "2x + 1 = 7", correctRight: "2", emoji: "✖️" },
      { id: "r2", left: "5y − 3 = 12", correctRight: "5", emoji: "🎯" },
      { id: "r3", left: "x + 4 = 10", correctRight: "1", emoji: "1️⃣" },
      { id: "r4", left: "7p − 5 = 16", correctRight: "7", emoji: "🧮" },
      { id: "r5", left: "3a + 2 = 11", correctRight: "3", emoji: "➗" },
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Anatomi PLSV",
    visual: (
      <div className="text-center">
        <div className="font-display text-3xl mb-3">
          <span className="text-cyan-300">3</span>
          <span className="text-yellow-300">x</span>
          <span className="text-white"> + </span>
          <span className="text-violet-300">5</span>
          <span className="text-white"> = </span>
          <span className="text-emerald-300">14</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
          <div className="rounded-lg bg-cyan-500/15 px-2 py-1">3 = koefisien</div>
          <div className="rounded-lg bg-yellow-500/15 px-2 py-1">x = variabel</div>
          <div className="rounded-lg bg-violet-500/15 px-2 py-1">5 = konstanta</div>
          <div className="rounded-lg bg-emerald-500/15 px-2 py-1">14 = konstanta</div>
        </div>
      </div>
    ),
    text: "Setiap PLSV terdiri dari variabel, koefisien, konstanta, dan tanda '='.",
  },
  {
    title: "Situasi: Tiga Syarat PLSV",
    visual: (
      <div className="text-left text-sm space-y-2 text-white/85">
        <div>1️⃣ Hanya <span className="font-bold text-cyan-300">SATU</span> jenis variabel.</div>
        <div>2️⃣ Pangkat variabel = <span className="font-bold text-yellow-300">1</span> (linear).</div>
        <div>3️⃣ Dihubungkan oleh tanda <span className="font-bold text-emerald-300">"="</span>.</div>
      </div>
    ),
    text: "Tiga syarat tersebut harus terpenuhi semua agar disebut PLSV.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Definisi PLSV", text: "Persamaan linear yang memuat satu variabel berpangkat 1.", tone: "cyan" },
  { title: "Bentuk Umum", text: "ax + b = c, dengan a ≠ 0; a, b, c bilangan real.", tone: "violet" },
  { title: "Identifikasi Cepat", text: "Cek: tanda '=' ada, satu variabel saja, pangkatnya 1.", tone: "emerald" },
];

const PengertianPLSVLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif PLSV • Kelas 7"
    title="🎯 Pengertian PLSV"
    intro="Temukan sendiri ciri-ciri Persamaan Linear Satu Variabel (PLSV), kenali variabel, koefisien, dan konstanta lewat dua mini-game!"
    situations={situations}
    guidedIntro="Ikuti langkah-langkah berikut untuk membangun pemahaman PLSV."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Uji pemahamanmu dengan soal latihan."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/plsv-ptlsv"
    backLabel="Kembali ke menu LKPD PLSV & PtLSV"
  />
);

export default PengertianPLSVLKPDPage;
