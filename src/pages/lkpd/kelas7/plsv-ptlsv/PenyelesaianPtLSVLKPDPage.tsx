import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Penyelesaian PtLSV x + 5 < 9 adalah x < ...",
    kind: "fill",
    answers: ["4"],
    discussion: ["Kurangi 5 di kedua ruas: x < 9 − 5 = 4."],
  },
  {
    id: "g2",
    label: "Penyelesaian PtLSV 2x ≤ 14 adalah x ≤ ...",
    kind: "fill",
    answers: ["7"],
    discussion: ["Bagi 2 (positif, tanda tetap): x ≤ 7."],
  },
  {
    id: "g3",
    label: "Pada PtLSV −2x < 8, jika kedua ruas dibagi −2, tanda < akan ...",
    kind: "choice",
    options: ["tetap <", "berubah jadi ≤", "berubah jadi >", "berubah jadi ≥"],
    correctIndex: 2,
    discussion: ["ATURAN PENTING: dibagi/dikalikan dengan bilangan NEGATIF, tanda pertidaksamaan harus DIBALIK!"],
  },
  {
    id: "g4",
    label: "Penyelesaian dari −2x < 8 adalah ...",
    kind: "choice",
    options: ["x < −4", "x > −4", "x < 4", "x > 4"],
    correctIndex: 1,
    discussion: ["−2x < 8 → bagi −2 (tanda dibalik) → x > −4."],
  },
  {
    id: "g5",
    label: "Benar atau salah: tanda pertidaksamaan dibalik HANYA ketika dikali/dibagi negatif (bukan ditambah/dikurang).",
    kind: "truefalse",
    correct: true,
    discussion: ["Benar. Penambahan/pengurangan dengan negatif TIDAK membalik tanda."],
  },
  {
    id: "g6",
    label: "Pasangkan PtLSV dengan penyelesaiannya:",
    kind: "match",
    pairs: [
      { left: "x + 3 > 7", right: "x > 4" },
      { left: "2x ≤ 10", right: "x ≤ 5" },
      { left: "−x ≥ 2", right: "x ≤ −2" },
      { left: "3x − 1 < 11", right: "x < 4" },
    ],
    discussion: ["Periksa dengan substitusi salah satu nilai dari himpunan penyelesaian — pasti memenuhi PtLSV asli."],
  },
  {
    id: "g7",
    label: "Urutkan langkah menyelesaikan 3 − 2x ≥ 11:",
    kind: "sort",
    items: [
      "Kurangi 3 dari kedua ruas: −2x ≥ 8.",
      "Tulis PtLSV awal: 3 − 2x ≥ 11.",
      "Bagi −2 (TANDA DIBALIK): x ≤ −4.",
      "Periksa: x = −5 → 3 − 2(−5) = 13 ≥ 11 ✓.",
    ],
    correctOrder: [
      "Tulis PtLSV awal: 3 − 2x ≥ 11.",
      "Kurangi 3 dari kedua ruas: −2x ≥ 8.",
      "Bagi −2 (TANDA DIBALIK): x ≤ −4.",
      "Periksa: x = −5 → 3 − 2(−5) = 13 ≥ 11 ✓.",
    ],
    discussion: ["Selalu pisahkan konstanta dulu, baru bagi koefisien. Hati-hati membalik tanda jika koefisien negatif."],
  },
  {
    id: "g8",
    label: "Penyelesaian PtLSV 4x − 3 ≥ 2x + 5 adalah ...",
    kind: "choice",
    options: ["x ≥ 4", "x ≤ 4", "x > 4", "x < 4"],
    correctIndex: 0,
    discussion: ["4x − 2x ≥ 5 + 3 → 2x ≥ 8 → x ≥ 4."],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Penyelesaian dari x − 4 ≤ 6 adalah x ≤ ...",
    kind: "fill",
    answers: ["10"],
    hint: "Tambah 4 ke kedua ruas.",
    discussion: ["x ≤ 10."],
  },
  {
    id: "p2",
    question: "Penyelesaian dari −3x > 12 adalah ...",
    kind: "choice",
    options: ["x > −4", "x < −4", "x > 4", "x < 4"],
    correctIndex: 1,
    hint: "Bagi −3, jangan lupa BALIK tanda!",
    discussion: ["−3x > 12 → bagi −3 (tanda dibalik) → x < −4."],
  },
  {
    id: "p3",
    question: "Penyelesaian 5x + 2 < 17 adalah ...",
    kind: "choice",
    options: ["x < 3", "x > 3", "x ≤ 3", "x ≥ 3"],
    correctIndex: 0,
    hint: "Kurangi 2, lalu bagi 5.",
    discussion: ["5x < 15 → x < 3."],
  },
  {
    id: "p4",
    question: "Penyelesaian dari 2(x − 3) ≥ 8 adalah ...",
    kind: "choice",
    options: ["x ≥ 5", "x ≤ 5", "x ≥ 7", "x ≤ 7"],
    correctIndex: 2,
    hint: "Bagi 2 dulu atau jabarkan.",
    discussion: ["Bagi 2: x − 3 ≥ 4 → tambah 3: x ≥ 7."],
  },
  {
    id: "p5",
    question: "Benar atau salah: jika x ≤ 2, maka 3x ≤ 6.",
    kind: "truefalse",
    correct: true,
    hint: "Dikali bilangan positif, tanda tetap.",
    discussion: ["Dikali 3 (positif), tanda ≤ tetap → 3x ≤ 6. BENAR."],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-balik",
    title: "🎯 Game 1: Balik atau Tidak?",
    description: "Tarik setiap operasi ke kategori: tanda DIBALIK atau TIDAK.",
    buckets: [
      { id: "b1", label: "Tanda TIDAK dibalik", emoji: "✅", color: "emerald" },
      { id: "b2", label: "Tanda DIBALIK", emoji: "🔄", color: "rose" },
    ],
    items: [
      { id: "i1", label: "Tambah 5 di kedua ruas", bucketId: "b1" },
      { id: "i2", label: "Kurangi 3 di kedua ruas", bucketId: "b1" },
      { id: "i3", label: "Kalikan kedua ruas dengan 2", bucketId: "b1" },
      { id: "i4", label: "Bagi kedua ruas dengan 4", bucketId: "b1" },
      { id: "i5", label: "Kalikan kedua ruas dengan −1", bucketId: "b2" },
      { id: "i6", label: "Bagi kedua ruas dengan −3", bucketId: "b2" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-akar-pt",
    title: "🎮 Game 2: Cocokkan PtLSV ke Penyelesaiannya",
    description: "Tekan ◀ ▶ untuk memilih himpunan penyelesaian yang benar.",
    rightOptions: ["x < 2", "x > 2", "x ≤ 5", "x ≥ 5", "x < 3"],
    pairs: [
      { id: "r1", left: "2x < 4", correctRight: "x < 2", emoji: "◀" },
      { id: "r2", left: "x + 1 > 3", correctRight: "x > 2", emoji: "▶" },
      { id: "r3", left: "3x ≤ 15", correctRight: "x ≤ 5", emoji: "🔻" },
      { id: "r4", left: "x − 2 ≥ 3", correctRight: "x ≥ 5", emoji: "🔺" },
      { id: "r5", left: "−2x > −6", correctRight: "x < 3", emoji: "🔄" },
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Aturan Emas",
    visual: (
      <div className="text-center">
        <div className="text-4xl mb-2">🔄</div>
        <p className="text-sm text-white/80">
          <span className="font-bold text-rose-300">Hanya saat KALI/BAGI dengan bilangan NEGATIF</span> tanda pertidaksamaan harus dibalik!
        </p>
        <div className="font-display text-yellow-200 mt-2">
          {"<"} ↔ {">"} &nbsp;&nbsp; ≤ ↔ ≥
        </div>
      </div>
    ),
    text: "Jika hanya menambah/mengurangi, atau kali/bagi positif → tanda TETAP.",
  },
  {
    title: "Situasi: Garis Bilangan",
    visual: (
      <div className="text-center">
        <div className="font-display text-xl text-cyan-200 mb-2">x &gt; 3</div>
        <div className="font-mono text-sm text-white/80 tracking-widest">───●═══════════➔</div>
        <p className="text-xs text-white/65 mt-1">○ untuk &lt;/&gt; (tidak termasuk) &nbsp;|&nbsp; ● untuk ≤/≥ (termasuk)</p>
      </div>
    ),
    text: "Penyelesaian PtLSV biasanya berupa interval bilangan, dapat digambar pada garis bilangan.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Sifat Sama dengan PLSV", text: "Tambah/kurang/kali/bagi yang sama pada kedua ruas tetap menjaga setara.", tone: "cyan" },
  { title: "Aturan Emas", text: "Kali/bagi NEGATIF → BALIK tanda pertidaksamaan.", tone: "rose" },
  { title: "Bentuk Penyelesaian", text: "Berupa pertidaksamaan: x > a, x < a, x ≥ a, atau x ≤ a.", tone: "emerald" },
];

const PenyelesaianPtLSVLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif PtLSV • Kelas 7"
    title="🪜 Penyelesaian PtLSV"
    intro="Temukan aturan emas penyelesaian PtLSV — termasuk kapan tanda pertidaksamaan harus dibalik. Lengkap dengan dua mini-game!"
    situations={situations}
    guidedIntro="Kerjakan aktivitas berikut untuk menemukan langkah baku menyelesaikan PtLSV."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Asah pemahamanmu dengan soal latihan."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/plsv-ptlsv"
    backLabel="Kembali ke menu LKPD PLSV & PtLSV"
  />
);

export default PenyelesaianPtLSVLKPDPage;
