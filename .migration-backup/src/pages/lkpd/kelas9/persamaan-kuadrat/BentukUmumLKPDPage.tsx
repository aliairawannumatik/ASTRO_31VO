import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Mengenal Bentuk Umum",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-700/20 border border-violet-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="28" fontSize="14" fontWeight="bold" fill="#a78bfa" textAnchor="middle">ax² + bx + c = 0</text>
          <text x="140" y="50" fontSize="10" fill="#fde68a" textAnchor="middle">a, b, c bilangan real, a ≠ 0</text>
          <rect x="20" y="70" width="70" height="60" rx="8" fill="#22d3ee" fillOpacity="0.4" stroke="#67e8f9" strokeWidth="1.5" />
          <text x="55" y="92" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">a = 2</text>
          <text x="55" y="112" fontSize="9" fill="#fde68a" textAnchor="middle">koef. x²</text>
          <rect x="105" y="70" width="70" height="60" rx="8" fill="#a78bfa" fillOpacity="0.4" stroke="#c4b5fd" strokeWidth="1.5" />
          <text x="140" y="92" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">b = -5</text>
          <text x="140" y="112" fontSize="9" fill="#fde68a" textAnchor="middle">koef. x</text>
          <rect x="190" y="70" width="70" height="60" rx="8" fill="#fbbf24" fillOpacity="0.4" stroke="#fde68a" strokeWidth="1.5" />
          <text x="225" y="92" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">c = 3</text>
          <text x="225" y="112" fontSize="9" fill="#fde68a" textAnchor="middle">konstanta</text>
          <rect x="40" y="150" width="200" height="32" rx="6" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="172" fontSize="13" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">Contoh: 2x² − 5x + 3 = 0</text>
        </svg>
      </div>
    ),
    text:
      "PERSAMAAN KUADRAT (PK) memiliki bentuk umum ax² + bx + c = 0, dengan a, b, c bilangan real dan a ≠ 0. Pangkat tertinggi variabelnya = 2. Pelajari koefisien a (pangkat 2), b (pangkat 1), dan konstanta c.",
  },
  {
    title: "Situasi 2 — Bukan Persamaan Kuadrat",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-700/20 border border-rose-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="25" fontSize="11" fontWeight="bold" fill="#fda4af" textAnchor="middle">Mana yang BUKAN persamaan kuadrat?</text>
          <rect x="20" y="45" width="240" height="32" rx="6" fill="#34d399" fillOpacity="0.4" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="67" fontSize="12" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">{"✓ x² − 4x + 4 = 0  (PK)"}</text>
          <rect x="20" y="82" width="240" height="32" rx="6" fill="#ef4444" fillOpacity="0.4" stroke="#fca5a5" strokeWidth="1.5" />
          <text x="140" y="104" fontSize="12" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">{"✗ 3x − 7 = 0  (linear, pangkat 1)"}</text>
          <rect x="20" y="119" width="240" height="32" rx="6" fill="#ef4444" fillOpacity="0.4" stroke="#fca5a5" strokeWidth="1.5" />
          <text x="140" y="141" fontSize="12" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">{"✗ x³ + 2x² = 0  (kubik, pangkat 3)"}</text>
          <rect x="20" y="156" width="240" height="32" rx="6" fill="#ef4444" fillOpacity="0.4" stroke="#fca5a5" strokeWidth="1.5" />
          <text x="140" y="178" fontSize="12" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">{"✗ 0x² + 3x − 1 = 0  (a = 0)"}</text>
        </svg>
      </div>
    ),
    text:
      "PK harus memiliki pangkat TERTINGGI = 2 dan a ≠ 0. Persamaan linear (pangkat 1), kubik (pangkat 3), atau yang koefisien x²-nya 0 BUKAN PK. Selalu cek dulu sebelum mulai menyelesaikan!",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Bentuk umum persamaan kuadrat adalah …",
    kind: "choice",
    options: [
      "ax + b = 0",
      "ax² + bx + c = 0, a ≠ 0",
      "ax³ + bx² + c = 0",
      "x + y = 0",
    ],
    correctIndex: 1,
    discussion: ["PK: ax² + bx + c = 0 dengan a ≠ 0."],
  },
  {
    id: "g2",
    label: "Syarat WAJIB pada bentuk umum PK adalah …",
    kind: "choice",
    options: ["a = 0", "b = 0", "c = 0", "a ≠ 0"],
    correctIndex: 3,
    discussion: ["Jika a = 0, persamaan menjadi LINEAR, bukan kuadrat."],
  },
  {
    id: "g3",
    label: "Pada PK 2x² − 5x + 3 = 0, nilai a = …",
    kind: "fill",
    answers: ["2"],
    discussion: ["a adalah koefisien x², jadi a = 2."],
  },
  {
    id: "g4",
    label: "Pada PK 2x² − 5x + 3 = 0, nilai b = …",
    kind: "fill",
    answers: ["-5", "−5"],
    discussion: ["b adalah koefisien x, dan tandanya ikut: b = −5."],
  },
  {
    id: "g5",
    label: "Pada PK x² − 9 = 0, nilai b = …",
    kind: "fill",
    answers: ["0"],
    discussion: ["Tidak ada suku x → b = 0."],
  },
  {
    id: "g6",
    label: "Pada PK 3x² + 4x = 0, nilai c = …",
    kind: "fill",
    answers: ["0"],
    discussion: ["Tidak ada konstanta → c = 0."],
  },
  {
    id: "g7",
    label: "Pernyataan: 5x² − 7 = 0 adalah PERSAMAAN KUADRAT.",
    kind: "truefalse",
    correct: true,
    discussion: ["BENAR. a=5, b=0, c=−7 → tetap PK (a ≠ 0)."],
  },
  {
    id: "g8",
    label: "Ubah ke bentuk umum: 2x² + 5 = 7x → ax² + bx + c = 0. Maka b = …",
    kind: "fill",
    answers: ["-7", "−7"],
    discussion: ["Pindahkan ruas: 2x² − 7x + 5 = 0 → b = −7."],
  },
  {
    id: "g9",
    label: "Ubah: x(x − 3) = 10 ke bentuk umum. Nilai c = …",
    kind: "fill",
    answers: ["-10", "−10"],
    discussion: ["x² − 3x = 10 → x² − 3x − 10 = 0 → c = −10."],
  },
  {
    id: "g10",
    label: "Pasangkan PK dengan nilai (a, b, c)-nya:",
    kind: "match",
    pairs: [
      { left: "x² − 4x + 4 = 0", right: "(1, −4, 4)" },
      { left: "3x² + 5x − 2 = 0", right: "(3, 5, −2)" },
      { left: "2x² − 8 = 0", right: "(2, 0, −8)" },
      { left: "x² + 6x = 0", right: "(1, 6, 0)" },
    ],
    discussion: ["Identifikasi koefisien x², x, dan konstanta sesuai TANDA-nya."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Bentuk Umum PK",
    text: "ax² + bx + c = 0 dengan a, b, c bilangan REAL dan a ≠ 0. Pangkat tertinggi variabel = 2.",
    tone: "violet",
  },
  {
    title: "Identifikasi Koefisien",
    text: "a = koefisien x², b = koefisien x, c = konstanta. Perhatikan TANDA (+/−) saat mengidentifikasi.",
    tone: "cyan",
  },
  {
    title: "Mengubah ke Bentuk Umum",
    text: "Pindahkan SEMUA suku ke RUAS KIRI lalu samakan dengan 0. Jabarkan bentuk perkalian terlebih dahulu jika perlu.",
    tone: "emerald",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "bentukumum-game-jenis",
    title: "🎯 Game 1 — PK atau BUKAN PK?",
    description: "Seret persamaan ke kategori yang TEPAT!",
    buckets: [
      { id: "ya", label: "✓ Persamaan KUADRAT", emoji: "📐", color: "emerald" },
      { id: "tidak", label: "✗ BUKAN PK", emoji: "❌", color: "rose" },
    ],
    items: [
      { id: "p1", label: "x² − 5x + 6 = 0", bucketId: "ya", emoji: "📐" },
      { id: "p2", label: "3x − 8 = 0", bucketId: "tidak", emoji: "📏" },
      { id: "p3", label: "2x² − 9 = 0", bucketId: "ya", emoji: "📐" },
      { id: "p4", label: "x³ + x² = 0", bucketId: "tidak", emoji: "📦" },
      { id: "p5", label: "x² + 4x = 0", bucketId: "ya", emoji: "📐" },
      { id: "p6", label: "2x + 5 = 7", bucketId: "tidak", emoji: "📏" },
      { id: "p7", label: "5x² + 2x − 1 = 0", bucketId: "ya", emoji: "📐" },
      { id: "p8", label: "0·x² + 3x = 4", bucketId: "tidak", emoji: "❌" },
    ],
  },
  {
    kind: "arrow-match",
    id: "bentukumum-game-koef",
    title: "🎯 Game 2 — Tebak Koefisien b",
    description: "Pasangkan tiap PK dengan nilai b-nya. Tekan ◀ ▶.",
    rightOptions: ["-7", "-5", "-3", "0", "3", "5", "7"],
    pairs: [
      { id: "k1", left: "x² − 5x + 6 = 0", correctRight: "-5", emoji: "📐" },
      { id: "k2", left: "2x² + 3x − 1 = 0", correctRight: "3", emoji: "📐" },
      { id: "k3", left: "x² − 9 = 0", correctRight: "0", emoji: "📐" },
      { id: "k4", left: "3x² − 7x + 2 = 0", correctRight: "-7", emoji: "📐" },
      { id: "k5", left: "x² + 5x = 0", correctRight: "5", emoji: "📐" },
      { id: "k6", left: "4x² + 7x − 3 = 0", correctRight: "7", emoji: "📐" },
      { id: "k7", left: "2x² − 3x = 0", correctRight: "-3", emoji: "📐" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Pada PK 4x² − 12x + 9 = 0, nilai a + b + c = …",
    kind: "fill",
    answers: ["1"],
    hint: "4 + (−12) + 9.",
    discussion: ["a=4, b=−12, c=9 → a+b+c = 1."],
  },
  {
    id: "pp2",
    question:
      "Ubah (x − 2)(x + 5) = 0 ke bentuk umum. Nilai (a, b, c) = …",
    kind: "choice",
    options: ["(1, 3, 10)", "(1, 3, −10)", "(1, −3, 10)", "(1, −3, −10)"],
    correctIndex: 1,
    hint: "Jabarkan dulu.",
    discussion: ["(x−2)(x+5) = x²+3x−10 = 0 → (1, 3, −10)."],
  },
  {
    id: "pp3",
    question:
      "Bentuk umum dari x² = 5x − 6 adalah …",
    kind: "choice",
    options: [
      "x² − 5x + 6 = 0",
      "x² + 5x − 6 = 0",
      "x² − 5x − 6 = 0",
      "x² + 5x + 6 = 0",
    ],
    correctIndex: 0,
    hint: "Pindahkan semua ke ruas kiri.",
    discussion: ["x² − 5x + 6 = 0."],
  },
  {
    id: "pp4",
    question:
      "Pernyataan: x² + 1/x = 5 adalah persamaan kuadrat.",
    kind: "truefalse",
    correct: false,
    hint: "Ada 1/x → bukan polinomial murni.",
    discussion: [
      "SALAH. Ada 1/x = x⁻¹, bukan polinomial → bukan PK.",
    ],
  },
  {
    id: "pp5",
    question:
      "Diberikan (2x − 1)² = 9. Nilai c pada bentuk umumnya = …",
    kind: "fill",
    answers: ["-8", "−8"],
    hint: "Jabarkan: 4x² − 4x + 1 = 9.",
    discussion: ["4x² − 4x + 1 − 9 = 0 → 4x² − 4x − 8 = 0 → c = −8."],
  },
  {
    id: "pp6",
    question:
      "Bentuk umum dari x(x + 4) = 12 adalah …",
    kind: "choice",
    options: [
      "x² + 4x − 12 = 0",
      "x² + 4x + 12 = 0",
      "x² − 4x + 12 = 0",
      "x² − 4x − 12 = 0",
    ],
    correctIndex: 0,
    hint: "Distribusikan dan pindahkan.",
    discussion: ["x² + 4x = 12 → x² + 4x − 12 = 0."],
  },
  {
    id: "pp7",
    question:
      "PK 3x² − 12 = 0 memiliki c = …",
    kind: "fill",
    answers: ["-12", "−12"],
    hint: "Konstanta dengan tanda.",
    discussion: ["c = −12."],
  },
  {
    id: "pp8",
    question:
      "Pernyataan: PK ax² + bx + c = 0 dapat memiliki b = 0 atau c = 0, tapi a TIDAK BOLEH 0.",
    kind: "truefalse",
    correct: true,
    hint: "Cek syarat dasar.",
    discussion: ["BENAR. Hanya a yang tidak boleh nol."],
  },
];

const BentukUmumLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Pengayaan PK"
    title="Bentuk Umum Persamaan Kuadrat — Penemuan Terbimbing"
    intro="Sobat Numatik 📖! Ayo MENEMUKAN bentuk umum PK: ax² + bx + c = 0 dengan a ≠ 0. Kamu akan belajar mengenali a, b, c, mengubah persamaan ke bentuk umum, dan membedakan mana PK dan bukan PK!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan struktur bentuk umum PK."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/persamaan-kuadrat"
    backLabel="Kembali ke Menu Persamaan Kuadrat"
    scoreMessages={{
      perfect: "🌟 Mantap! Bentuk umum PK sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Pelajari ulang identifikasi a, b, c.",
      low: "💪 Tetap semangat! Mulai dari PK sederhana dulu.",
    }}
  />
);

export default BentukUmumLKPDPage;
