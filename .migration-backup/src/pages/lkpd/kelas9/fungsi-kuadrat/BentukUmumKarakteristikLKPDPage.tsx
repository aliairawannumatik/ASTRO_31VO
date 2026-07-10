import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Bentuk Umum Fungsi Kuadrat",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-700/20 border border-violet-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="28" fontSize="14" fontWeight="bold" fill="#a78bfa" textAnchor="middle">f(x) = ax² + bx + c</text>
          <text x="140" y="50" fontSize="10" fill="#fde68a" textAnchor="middle">a, b, c ∈ ℝ, a ≠ 0</text>
          <rect x="20" y="65" width="70" height="55" rx="8" fill="#22d3ee" fillOpacity="0.4" stroke="#67e8f9" strokeWidth="1.5" />
          <text x="55" y="87" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">a</text>
          <text x="55" y="105" fontSize="9" fill="#fde68a" textAnchor="middle">arah & lebar</text>
          <rect x="105" y="65" width="70" height="55" rx="8" fill="#a78bfa" fillOpacity="0.4" stroke="#c4b5fd" strokeWidth="1.5" />
          <text x="140" y="87" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">b</text>
          <text x="140" y="105" fontSize="9" fill="#fde68a" textAnchor="middle">posisi sumbu</text>
          <rect x="190" y="65" width="70" height="55" rx="8" fill="#fbbf24" fillOpacity="0.4" stroke="#fde68a" strokeWidth="1.5" />
          <text x="225" y="87" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">c</text>
          <text x="225" y="105" fontSize="9" fill="#fde68a" textAnchor="middle">titik potong y</text>
          <rect x="40" y="135" width="200" height="48" rx="8" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="155" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">Contoh: f(x) = 2x² − 4x + 3</text>
          <text x="140" y="175" fontSize="10" fill="#fde68a" textAnchor="middle">a=2, b=−4, c=3 — grafik PARABOLA</text>
        </svg>
      </div>
    ),
    text:
      "FUNGSI KUADRAT (FK) bentuk umum: f(x) = ax² + bx + c dengan a ≠ 0. Grafiknya selalu PARABOLA. a menentukan ARAH parabola (atas/bawah), b mempengaruhi POSISI sumbu simetri, c = titik potong dengan sumbu-y.",
  },
  {
    title: "Situasi 2 — Karakteristik dari Tanda a",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-rose-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <line x1="20" y1="100" x2="260" y2="100" stroke="#94a3b8" strokeWidth="1" />
          <line x1="140" y1="20" x2="140" y2="180" stroke="#94a3b8" strokeWidth="1" />
          <path d="M 30 40 Q 80 180 130 40" fill="none" stroke="#34d399" strokeWidth="2.5" />
          <text x="80" y="32" fontSize="12" fontWeight="bold" fill="#34d399" textAnchor="middle">{"a > 0"}</text>
          <text x="80" y="195" fontSize="10" fill="#a7f3d0" textAnchor="middle">terbuka KE ATAS</text>
          <text x="80" y="60" fontSize="9" fill="#fde68a" textAnchor="middle">titik MIN</text>
          <path d="M 150 160 Q 200 20 250 160" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
          <text x="200" y="195" fontSize="12" fontWeight="bold" fill="#fbbf24" textAnchor="middle">{"a < 0"}</text>
          <text x="200" y="180" fontSize="10" fill="#fde68a" textAnchor="middle">terbuka KE BAWAH</text>
          <text x="200" y="40" fontSize="9" fill="#fde68a" textAnchor="middle">titik MAKS</text>
        </svg>
      </div>
    ),
    text:
      "Tanda a menentukan ARAH parabola: a > 0 → terbuka ke ATAS (punya nilai MINIMUM), a < 0 → terbuka ke BAWAH (punya nilai MAKSIMUM). Semakin BESAR |a|, parabola semakin SEMPIT/RAMPING.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Bentuk umum fungsi kuadrat adalah f(x) = …",
    kind: "choice",
    options: [
      "ax + b",
      "ax² + bx + c, a ≠ 0",
      "ax³ + bx + c",
      "ax² + bx, a ≠ 0",
    ],
    correctIndex: 1,
    discussion: ["FK: f(x) = ax² + bx + c dengan a ≠ 0."],
  },
  {
    id: "g2",
    label: "Pada f(x) = 2x² − 4x + 3, nilai a, b, c berturut-turut …",
    kind: "choice",
    options: ["2, 4, 3", "2, −4, 3", "−2, 4, 3", "2, −4, −3"],
    correctIndex: 1,
    discussion: ["a=2, b=−4, c=3 — perhatikan TANDA b."],
  },
  {
    id: "g3",
    label: "Karena a = 2 > 0, parabola terbuka ke …",
    kind: "choice",
    options: ["ATAS", "BAWAH", "KIRI", "KANAN"],
    correctIndex: 0,
    discussion: ["a > 0 → parabola terbuka ke ATAS (titik MIN)."],
  },
  {
    id: "g4",
    label: "Pada f(x) = −x² + 6x − 5, parabola terbuka ke … dan memiliki titik …",
    kind: "choice",
    options: ["ATAS, MIN", "ATAS, MAKS", "BAWAH, MIN", "BAWAH, MAKS"],
    correctIndex: 3,
    discussion: ["a = −1 < 0 → BAWAH, punya titik MAKS."],
  },
  {
    id: "g5",
    label: "Titik potong f(x) = 2x² − 4x + 3 dengan sumbu-y adalah (0, …)",
    kind: "fill",
    answers: ["3"],
    discussion: ["Sumbu-y → x = 0 → f(0) = c = 3. Jadi (0, 3)."],
  },
  {
    id: "g6",
    label: "Dari f(x) = x² + 2x − 8, titik potong dgn sumbu-y = (0, …)",
    kind: "fill",
    answers: ["-8", "−8"],
    discussion: ["f(0) = c = −8."],
  },
  {
    id: "g7",
    label: "Pernyataan: Grafik FK selalu berbentuk PARABOLA.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Selama a ≠ 0, grafiknya parabola.",
    ],
  },
  {
    id: "g8",
    label:
      "Antara f(x) = x² dan g(x) = 3x², yang LEBIH RAMPING (sempit) adalah …",
    kind: "choice",
    options: ["f(x)", "g(x)", "Sama saja", "Tidak bisa ditentukan"],
    correctIndex: 1,
    discussion: ["|a| lebih besar → lebih ramping. |3| > |1|, jadi g(x) lebih ramping."],
  },
  {
    id: "g9",
    label: "Pasangkan FK dengan karakteristiknya:",
    kind: "match",
    pairs: [
      { left: "f(x) = x² − 2x + 1", right: "Buka ATAS, titik MIN" },
      { left: "f(x) = −2x² + 4x", right: "Buka BAWAH, titik MAKS" },
      { left: "f(x) = 3x² − 12", right: "Buka ATAS, titik MIN" },
      { left: "f(x) = −x² − 5", right: "Buka BAWAH, titik MAKS" },
    ],
    discussion: ["Cek tanda a saja."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Bentuk Umum FK",
    text: "f(x) = ax² + bx + c, a ≠ 0. Grafik = PARABOLA. Identifikasi a, b, c sebelum analisis.",
    tone: "violet",
  },
  {
    title: "Karakteristik dari a",
    text: "a > 0 → buka ATAS (punya MIN). a < 0 → buka BAWAH (punya MAKS). |a| besar → ramping; |a| kecil → lebar.",
    tone: "emerald",
  },
  {
    title: "Peran b dan c",
    text: "c = titik potong dengan sumbu-y (yaitu f(0)). b mempengaruhi posisi sumbu simetri (xₚ = −b/2a).",
    tone: "cyan",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "fk-bentuk-game-arah",
    title: "🎯 Game 1 — Arah Parabola",
    description: "Seret tiap fungsi ke arah parabolanya yang TEPAT!",
    buckets: [
      { id: "atas", label: "Buka ATAS (a > 0)", emoji: "⬆️", color: "emerald" },
      { id: "bawah", label: "Buka BAWAH (a < 0)", emoji: "⬇️", color: "rose" },
    ],
    items: [
      { id: "f1", label: "f(x) = x² − 4x + 3", bucketId: "atas", emoji: "📈" },
      { id: "f2", label: "f(x) = −x² + 6x − 8", bucketId: "bawah", emoji: "📉" },
      { id: "f3", label: "f(x) = 2x² − 5", bucketId: "atas", emoji: "📈" },
      { id: "f4", label: "f(x) = −3x² + 6", bucketId: "bawah", emoji: "📉" },
      { id: "f5", label: "f(x) = 5x² + 2x", bucketId: "atas", emoji: "📈" },
      { id: "f6", label: "f(x) = −x² − x − 1", bucketId: "bawah", emoji: "📉" },
      { id: "f7", label: "f(x) = 0.5x²", bucketId: "atas", emoji: "📈" },
      { id: "f8", label: "f(x) = −2x² + 4x − 1", bucketId: "bawah", emoji: "📉" },
    ],
  },
  {
    kind: "arrow-match",
    id: "fk-bentuk-game-c",
    title: "🎯 Game 2 — Titik Potong Sumbu-y",
    description: "Pasangkan tiap FK dengan titik potongnya pada sumbu-y. Tekan ◀ ▶.",
    rightOptions: ["(0, −8)", "(0, −5)", "(0, 0)", "(0, 3)", "(0, 5)", "(0, 8)"],
    pairs: [
      { id: "c1", left: "f(x) = x² − 4x + 3", correctRight: "(0, 3)", emoji: "🎯" },
      { id: "c2", left: "f(x) = 2x² + 5x − 8", correctRight: "(0, −8)", emoji: "🎯" },
      { id: "c3", left: "f(x) = x² + 6x", correctRight: "(0, 0)", emoji: "🎯" },
      { id: "c4", left: "f(x) = 3x² + x − 5", correctRight: "(0, −5)", emoji: "🎯" },
      { id: "c5", left: "f(x) = −x² + 2x + 8", correctRight: "(0, 8)", emoji: "🎯" },
      { id: "c6", left: "f(x) = x² + 5", correctRight: "(0, 5)", emoji: "🎯" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Pada f(x) = 3x² − 6x + 1, nilai a = …",
    kind: "fill",
    answers: ["3"],
    hint: "Koefisien x².",
    discussion: ["a = 3."],
  },
  {
    id: "pp2",
    question: "Grafik f(x) = −2x² + 4x − 1 terbuka ke … dan punya titik …",
    kind: "choice",
    options: ["ATAS, MIN", "ATAS, MAKS", "BAWAH, MIN", "BAWAH, MAKS"],
    correctIndex: 3,
    hint: "Cek tanda a.",
    discussion: ["a = −2 < 0 → buka BAWAH → titik MAKS."],
  },
  {
    id: "pp3",
    question: "Titik potong f(x) = 4x² + 5x − 6 dgn sumbu-y adalah …",
    kind: "choice",
    options: ["(0, 6)", "(0, −6)", "(0, 5)", "(0, 4)"],
    correctIndex: 1,
    hint: "f(0) = c.",
    discussion: ["f(0) = −6 → (0, −6)."],
  },
  {
    id: "pp4",
    question:
      "Pernyataan: Jika a < 0, maka f(x) memiliki nilai MINIMUM.",
    kind: "truefalse",
    correct: false,
    hint: "Cek arah parabola.",
    discussion: ["SALAH. a < 0 → buka BAWAH → punya MAKSIMUM."],
  },
  {
    id: "pp5",
    question:
      "Antara f(x) = 0.5x² dan g(x) = 4x², yang lebih LEBAR adalah …",
    kind: "choice",
    options: ["f(x)", "g(x)", "Sama saja", "Tidak bisa ditentukan"],
    correctIndex: 0,
    hint: "|a| kecil → lebar.",
    discussion: ["|0.5| < |4| → f(x) lebih lebar."],
  },
  {
    id: "pp6",
    question:
      "Diberikan f(x) = (x + 2)(x − 3). Bentuk umumnya …",
    kind: "choice",
    options: ["x² − x − 6", "x² + x − 6", "x² − x + 6", "x² + 5x + 6"],
    correctIndex: 0,
    hint: "Jabarkan.",
    discussion: ["x² − 3x + 2x − 6 = x² − x − 6."],
  },
  {
    id: "pp7",
    question:
      "Dari f(x) = (x + 2)(x − 3), titik potong dgn sumbu-y = …",
    kind: "choice",
    options: ["(0, −6)", "(0, 6)", "(0, −1)", "(0, 1)"],
    correctIndex: 0,
    hint: "f(0) = (2)(−3) = −6.",
    discussion: ["c = −6 → (0, −6)."],
  },
  {
    id: "pp8",
    question:
      "Grafik f(x) = x² + 4 SELALU berada di … sumbu-x.",
    kind: "choice",
    options: ["Di atas", "Di bawah", "Memotong", "Tidak ada"],
    correctIndex: 0,
    hint: "x² ≥ 0, +4 jadi minimal 4.",
    discussion: ["f(x) ≥ 4 > 0 → SELALU di ATAS sumbu-x."],
  },
];

const BentukUmumKarakteristikLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Pengayaan FK"
    title="Bentuk Umum & Karakteristik Grafik FK — Penemuan Terbimbing"
    intro="Sobat Numatik 📖! Kenalan dengan FUNGSI KUADRAT f(x) = ax² + bx + c yang grafiknya selalu PARABOLA! Kamu akan menemukan peran a (arah & lebar), b (posisi), c (titik potong sumbu-y) — fondasi semua materi FK!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan karakteristik grafik FK."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/fungsi-kuadrat"
    backLabel="Kembali ke Menu Fungsi Kuadrat"
    scoreMessages={{
      perfect: "🌟 Mantap! Karakteristik FK sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Ulang peran a, b, c.",
      low: "💪 Tetap semangat! Mulai dari membaca tanda a.",
    }}
  />
);

export default BentukUmumKarakteristikLKPDPage;
