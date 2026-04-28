import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Bentuk Kuadrat Sempurna",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-700/20 border border-amber-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="25" fontSize="13" fontWeight="bold" fill="#fde68a" textAnchor="middle">Bentuk Kuadrat Sempurna</text>
          <rect x="20" y="40" width="240" height="32" rx="6" fill="#fbbf24" fillOpacity="0.3" />
          <text x="140" y="62" fontSize="13" fontWeight="bold" fill="#fff" textAnchor="middle">{"(x + p)² = x² + 2px + p²"}</text>
          <text x="140" y="92" fontSize="11" fill="#a7f3d0" textAnchor="middle">Contoh: Lengkapi x² + 6x menjadi …</text>
          <rect x="20" y="100" width="240" height="22" rx="6" fill="#a7f3d0" fillOpacity="0.3" />
          <text x="140" y="116" fontSize="11" fill="#fff" textAnchor="middle">2p = 6 → p = 3 → p² = 9</text>
          <rect x="20" y="125" width="240" height="22" rx="6" fill="#22d3ee" fillOpacity="0.4" />
          <text x="140" y="141" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">{"x² + 6x + 9 = (x + 3)²"}</text>
          <rect x="40" y="155" width="200" height="35" rx="8" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="178" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">Tambah (b/2)² → kuadrat sempurna!</text>
        </svg>
      </div>
    ),
    text:
      "PELENGKAP KUADRAT = mengubah PK menjadi (x + p)² = q. Caranya: tambah (b/2)² ke kedua ruas. Bentuk kuadrat sempurna: (x+p)² = x² + 2px + p². TRIK: setengah dari b, kuadratkan, tambahkan!",
  },
  {
    title: "Situasi 2 — Langkah Penyelesaian",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 280 240" className="w-full">
          <rect width="280" height="240" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="12" fontWeight="bold" fill="#67e8f9" textAnchor="middle">Selesaikan x² + 6x + 5 = 0</text>
          <rect x="20" y="34" width="240" height="22" rx="6" fill="#22d3ee" fillOpacity="0.3" />
          <text x="140" y="50" fontSize="10" fill="#fff" textAnchor="middle">1. Pindah konstanta: x² + 6x = −5</text>
          <rect x="20" y="60" width="240" height="22" rx="6" fill="#a78bfa" fillOpacity="0.3" />
          <text x="140" y="76" fontSize="10" fill="#fff" textAnchor="middle">2. Setengah b: 6/2 = 3, kuadratkan: 9</text>
          <rect x="20" y="86" width="240" height="22" rx="6" fill="#fbbf24" fillOpacity="0.3" />
          <text x="140" y="102" fontSize="10" fill="#fff" textAnchor="middle">3. Tambah 9 di kedua ruas: x² + 6x + 9 = 4</text>
          <rect x="20" y="112" width="240" height="22" rx="6" fill="#34d399" fillOpacity="0.4" />
          <text x="140" y="128" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">{"4. (x + 3)² = 4"}</text>
          <rect x="20" y="138" width="240" height="22" rx="6" fill="#22d3ee" fillOpacity="0.4" />
          <text x="140" y="154" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">{"5. x + 3 = ±2"}</text>
          <rect x="20" y="164" width="240" height="22" rx="6" fill="#fbbf24" fillOpacity="0.4" />
          <text x="140" y="180" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">6. x = −3 ± 2</text>
          <rect x="20" y="190" width="240" height="40" rx="8" fill="#34d399" fillOpacity="0.5" stroke="#6ee7b7" strokeWidth="2" />
          <text x="140" y="216" fontSize="13" fontWeight="bold" fill="#fff" textAnchor="middle">x = −1 atau x = −5</text>
        </svg>
      </div>
    ),
    text:
      "Langkah pelengkap kuadrat: (1) pindah konstanta ke kanan, (2) hitung (b/2)², (3) tambahkan ke kedua ruas, (4) tulis ruas kiri sebagai (x + b/2)², (5) akarkan kedua ruas dengan ±, (6) selesaikan x.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Bentuk kuadrat sempurna (x + p)² = …",
    kind: "choice",
    options: [
      "x² + p²",
      "x² + 2px + p²",
      "x² + px + p²",
      "x² − 2px + p²",
    ],
    correctIndex: 1,
    discussion: ["(x+p)² = x² + 2px + p² (jabaran identitas)."],
  },
  {
    id: "g2",
    label: "Untuk melengkapkan x² + 8x menjadi kuadrat sempurna, tambahkan …",
    kind: "fill",
    answers: ["16"],
    discussion: ["(b/2)² = (8/2)² = 16."],
  },
  {
    id: "g3",
    label: "Setelah ditambah 16, x² + 8x + 16 = (x + …)²",
    kind: "fill",
    answers: ["4"],
    discussion: ["x² + 8x + 16 = (x + 4)². Setengah dari 8 = 4."],
  },
  {
    id: "g4",
    label: "Untuk x² + 6x + 5 = 0, pindahkan konstanta. Hasilnya: x² + 6x = …",
    kind: "fill",
    answers: ["-5", "−5"],
    discussion: ["Geser 5 ke kanan: −5."],
  },
  {
    id: "g5",
    label: "Tambahkan (6/2)² = 9 ke kedua ruas: x² + 6x + 9 = …",
    kind: "fill",
    answers: ["4"],
    discussion: ["−5 + 9 = 4."],
  },
  {
    id: "g6",
    label: "Tulis ruas kiri sebagai kuadrat: (x + 3)² = 4. Selanjutnya x + 3 = …",
    kind: "choice",
    options: ["±2", "±4", "2", "−2"],
    correctIndex: 0,
    discussion: ["Akarkan kedua ruas: ±√4 = ±2. JANGAN lupa ±!"],
  },
  {
    id: "g7",
    label: "Akar PK x² + 6x + 5 = 0 adalah …",
    kind: "choice",
    options: ["x = −1 dan x = −5", "x = 1 dan x = 5", "x = −1 dan x = 5", "x = 1 dan x = −5"],
    correctIndex: 0,
    discussion: ["x + 3 = ±2 → x = −3 + 2 = −1 atau x = −3 − 2 = −5."],
  },
  {
    id: "g8",
    label:
      "Untuk x² − 4x − 5 = 0, langkah-langkah benar: x² − 4x = 5; tambah (−4/2)² = 4 → x² − 4x + 4 = 9. Bentuk kuadrat …",
    kind: "fill",
    answers: ["(x-2)^2", "(x − 2)²", "(x-2)²"],
    discussion: ["x² − 4x + 4 = (x − 2)²."],
  },
  {
    id: "g9",
    label: "Akar PK x² − 4x − 5 = 0 adalah …",
    kind: "choice",
    options: ["x = 5 dan x = −1", "x = −5 dan x = 1", "x = 5 dan x = 1", "x = −5 dan x = −1"],
    correctIndex: 0,
    discussion: ["x − 2 = ±3 → x = 5 atau x = −1."],
  },
  {
    id: "g10",
    label: "Pernyataan: Saat mengakarkan, kita harus menulis tanda ± di salah satu ruas.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Akar dari k² adalah ±k, agar dapat 2 akar.",
    ],
  },
  {
    id: "g11",
    label: "Pasangkan ekspresi dengan bentuk lengkap kuadratnya:",
    kind: "match",
    pairs: [
      { left: "x² + 4x + 4", right: "(x + 2)²" },
      { left: "x² − 6x + 9", right: "(x − 3)²" },
      { left: "x² + 10x + 25", right: "(x + 5)²" },
      { left: "x² − 8x + 16", right: "(x − 4)²" },
    ],
    discussion: ["Tiap p² = (b/2)², bentuknya (x ± p)²."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Identitas Kunci",
    text: "(x + p)² = x² + 2px + p². Tambahkan p² = (b/2)² agar kuadrat sempurna.",
    tone: "amber",
  },
  {
    title: "Langkah Pelengkap Kuadrat",
    text: "1) Pindah konstanta. 2) Hitung (b/2)². 3) Tambahkan ke kedua ruas. 4) Tulis (x + b/2)² = q. 5) Akarkan ±. 6) Selesaikan x.",
    tone: "cyan",
  },
  {
    title: "Kapan Digunakan?",
    text: "Berguna untuk MENURUNKAN rumus ABC, mengubah PK ke bentuk (x − h)² = k untuk menemukan titik puncak parabola.",
    tone: "violet",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "pelengkap-game-konstanta",
    title: "🎯 Game 1 — Konstanta Pelengkap (b/2)²",
    description: "Seret tiap ekspresi ke nilai konstanta yang HARUS DITAMBAHKAN!",
    buckets: [
      { id: "k4", label: "Tambah 4", emoji: "4️⃣", color: "cyan" },
      { id: "k9", label: "Tambah 9", emoji: "9️⃣", color: "violet" },
      { id: "k16", label: "Tambah 16", emoji: "🔢", color: "amber" },
      { id: "k25", label: "Tambah 25", emoji: "🔢", color: "rose" },
    ],
    items: [
      { id: "p1", label: "x² + 4x", bucketId: "k4", emoji: "📐" },
      { id: "p2", label: "x² + 6x", bucketId: "k9", emoji: "📐" },
      { id: "p3", label: "x² − 8x", bucketId: "k16", emoji: "📐" },
      { id: "p4", label: "x² + 10x", bucketId: "k25", emoji: "📐" },
      { id: "p5", label: "x² − 4x", bucketId: "k4", emoji: "📐" },
      { id: "p6", label: "x² − 6x", bucketId: "k9", emoji: "📐" },
      { id: "p7", label: "x² + 8x", bucketId: "k16", emoji: "📐" },
      { id: "p8", label: "x² − 10x", bucketId: "k25", emoji: "📐" },
    ],
  },
  {
    kind: "arrow-match",
    id: "pelengkap-game-bentuk",
    title: "🎯 Game 2 — Hasil Bentuk Sempurna",
    description: "Pasangkan tiap ekspresi dengan bentuk kuadrat sempurnanya. Tekan ◀ ▶.",
    rightOptions: [
      "(x + 2)²",
      "(x − 2)²",
      "(x + 3)²",
      "(x − 3)²",
      "(x + 4)²",
      "(x − 4)²",
      "(x + 5)²",
    ],
    pairs: [
      { id: "b1", left: "x² + 4x + 4", correctRight: "(x + 2)²", emoji: "📐" },
      { id: "b2", left: "x² − 4x + 4", correctRight: "(x − 2)²", emoji: "📐" },
      { id: "b3", left: "x² + 6x + 9", correctRight: "(x + 3)²", emoji: "📐" },
      { id: "b4", left: "x² − 6x + 9", correctRight: "(x − 3)²", emoji: "📐" },
      { id: "b5", left: "x² + 8x + 16", correctRight: "(x + 4)²", emoji: "📐" },
      { id: "b6", left: "x² − 8x + 16", correctRight: "(x − 4)²", emoji: "📐" },
      { id: "b7", left: "x² + 10x + 25", correctRight: "(x + 5)²", emoji: "📐" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question:
      "Selesaikan x² + 4x − 5 = 0 dengan pelengkap kuadrat. Akar-akarnya …",
    kind: "choice",
    options: ["x = 1 dan x = −5", "x = −1 dan x = 5", "x = 1 dan x = 5", "x = −1 dan x = −5"],
    correctIndex: 0,
    hint: "Tambah (4/2)²=4 di kedua ruas.",
    discussion: ["(x+2)² = 9 → x+2 = ±3 → x = 1 atau x = −5."],
  },
  {
    id: "pp2",
    question: "Selesaikan x² − 6x + 5 = 0. Akar-akarnya …",
    kind: "choice",
    options: ["x = 1 dan x = 5", "x = −1 dan x = −5", "x = −1 dan x = 5", "x = 1 dan x = −5"],
    correctIndex: 0,
    hint: "(x − 3)² = 4.",
    discussion: ["x − 3 = ±2 → x = 5 atau x = 1."],
  },
  {
    id: "pp3",
    question: "Bentuk x² + 10x + 21 = 0 jika dilengkapkan menjadi (x + …)² = …",
    kind: "choice",
    options: ["(x + 5)² = 4", "(x + 5)² = 21", "(x + 10)² = 79", "(x + 5)² = 25"],
    correctIndex: 0,
    hint: "Tambah (10/2)²=25.",
    discussion: ["x² + 10x + 25 = 4 → (x+5)² = 4."],
  },
  {
    id: "pp4",
    question: "Akar PK x² + 10x + 21 = 0 adalah …",
    kind: "choice",
    options: ["x = −3 dan x = −7", "x = 3 dan x = 7", "x = −3 dan x = 7", "x = 3 dan x = −7"],
    correctIndex: 0,
    hint: "x + 5 = ±2.",
    discussion: ["x = −5 + 2 = −3 atau x = −5 − 2 = −7."],
  },
  {
    id: "pp5",
    question: "Akar PK x² − 2x − 4 = 0 dalam bentuk akar = …",
    kind: "choice",
    options: ["1 ± √5", "1 ± √4", "2 ± √5", "−1 ± √5"],
    correctIndex: 0,
    hint: "x² − 2x + 1 = 5 → (x − 1)² = 5.",
    discussion: ["x − 1 = ±√5 → x = 1 ± √5."],
  },
  {
    id: "pp6",
    question:
      "Untuk PK 2x² + 8x − 10 = 0, langkah PERTAMA paling tepat adalah …",
    kind: "choice",
    options: [
      "Bagi dengan 2 dulu: x² + 4x − 5 = 0",
      "Tambah 16 langsung",
      "Akarkan ruas kiri",
      "Pindahkan x²",
    ],
    correctIndex: 0,
    hint: "Untuk a ≠ 1, bagi dulu agar koef. x² jadi 1.",
    discussion: ["Bagi 2: x² + 4x − 5 = 0 dulu sebelum dilengkapkan."],
  },
  {
    id: "pp7",
    question:
      "Pernyataan: Setelah (x − h)² = k, jika k < 0, PK tidak punya akar real.",
    kind: "truefalse",
    correct: true,
    hint: "Akar bilangan negatif → bukan real.",
    discussion: ["BENAR. √(negatif) bukan bilangan real."],
  },
  {
    id: "pp8",
    question:
      "Akar PK x² − 4x + 1 = 0 dalam bentuk akar = …",
    kind: "choice",
    options: ["2 ± √3", "2 ± √2", "1 ± √3", "−2 ± √3"],
    correctIndex: 0,
    hint: "(x − 2)² = 3.",
    discussion: ["x − 2 = ±√3 → x = 2 ± √3."],
  },
];

const PelengkapKuadratLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Pengayaan PK"
    title="Pelengkap Kuadrat (Completing the Square) — Penemuan Terbimbing"
    intro="Sobat Numatik 🔩! Saatnya BERMAIN PUZZLE — lengkapi PK menjadi BENTUK KUADRAT SEMPURNA (x + p)² = q! Trik: tambahkan (b/2)² ke kedua ruas. Inilah CIKAL BAKAL rumus ABC dan kunci menemukan titik puncak parabola."
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan langkah pelengkap kuadrat."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/persamaan-kuadrat"
    backLabel="Kembali ke Menu Persamaan Kuadrat"
    scoreMessages={{
      perfect: "🌟 Mantap! Pelengkap kuadrat sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Ulang langkah-langkah pelengkapan.",
      low: "💪 Tetap semangat! Mulai dari mengenali bentuk (x+p)².",
    }}
  />
);

export default PelengkapKuadratLKPDPage;
