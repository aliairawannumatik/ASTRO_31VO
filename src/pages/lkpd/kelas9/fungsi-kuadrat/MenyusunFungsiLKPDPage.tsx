import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — 3 Bentuk FK",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-violet-500/20 to-amber-700/20 border border-violet-300/40 p-3">
        <svg viewBox="0 0 280 240" className="w-full">
          <rect width="280" height="240" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="12" fontWeight="bold" fill="#a78bfa" textAnchor="middle">3 Bentuk Fungsi Kuadrat</text>
          <rect x="20" y="36" width="240" height="55" rx="8" fill="#22d3ee" fillOpacity="0.4" stroke="#67e8f9" strokeWidth="1.5" />
          <text x="140" y="56" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">A. Bentuk UMUM</text>
          <text x="140" y="74" fontSize="12" fontWeight="bold" fill="#fde68a" textAnchor="middle">f(x) = ax² + bx + c</text>
          <text x="140" y="86" fontSize="9" fill="#a7f3d0" textAnchor="middle">→ butuh 3 titik sembarang</text>
          <rect x="20" y="96" width="240" height="55" rx="8" fill="#a78bfa" fillOpacity="0.4" stroke="#c4b5fd" strokeWidth="1.5" />
          <text x="140" y="116" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">B. Bentuk PUNCAK / VERTEX</text>
          <text x="140" y="134" fontSize="12" fontWeight="bold" fill="#fde68a" textAnchor="middle">{"f(x) = a(x − xₚ)² + yₚ"}</text>
          <text x="140" y="146" fontSize="9" fill="#a7f3d0" textAnchor="middle">→ jika tahu PUNCAK & 1 titik lain</text>
          <rect x="20" y="156" width="240" height="55" rx="8" fill="#fbbf24" fillOpacity="0.4" stroke="#fde68a" strokeWidth="1.5" />
          <text x="140" y="176" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">C. Bentuk AKAR / FAKTOR</text>
          <text x="140" y="194" fontSize="12" fontWeight="bold" fill="#fde68a" textAnchor="middle">{"f(x) = a(x − x₁)(x − x₂)"}</text>
          <text x="140" y="206" fontSize="9" fill="#a7f3d0" textAnchor="middle">→ jika tahu 2 AKAR & 1 titik lain</text>
        </svg>
      </div>
    ),
    text:
      "Ada 3 BENTUK fungsi kuadrat: (A) UMUM, (B) PUNCAK / VERTEX, (C) AKAR / FAKTOR. Pilih bentuk SESUAI INFORMASI yang diketahui — agar penyelesaian lebih CEPAT!",
  },
  {
    title: "Situasi 2 — Strategi Memilih Bentuk",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="11" fontWeight="bold" fill="#a7f3d0" textAnchor="middle">Tahu apa? → Gunakan bentuk:</text>
          <rect x="20" y="38" width="240" height="32" rx="6" fill="#22d3ee" fillOpacity="0.4" />
          <text x="140" y="58" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">3 titik sembarang → BENTUK UMUM</text>
          <rect x="20" y="75" width="240" height="32" rx="6" fill="#a78bfa" fillOpacity="0.4" />
          <text x="140" y="95" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">Puncak + 1 titik → BENTUK PUNCAK</text>
          <rect x="20" y="112" width="240" height="32" rx="6" fill="#fbbf24" fillOpacity="0.4" />
          <text x="140" y="132" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">2 akar + 1 titik → BENTUK AKAR</text>
          <rect x="20" y="150" width="240" height="40" rx="8" fill="#34d399" fillOpacity="0.5" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="170" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">Setelah dapat bentuknya:</text>
          <text x="140" y="184" fontSize="10" fill="#fff" textAnchor="middle">Substitusi titik untuk cari konstanta a.</text>
        </svg>
      </div>
    ),
    text:
      "PILIH BENTUK yang COCOK dengan informasi! Tahu PUNCAK → bentuk vertex (efisien). Tahu 2 AKAR → bentuk faktor (efisien). Hanya tahu 3 titik → bentuk umum. Setelah pilih bentuk, substitusi titik LAIN untuk cari konstanta a.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Bentuk UMUM FK ditulis sebagai f(x) = …",
    kind: "choice",
    options: [
      "ax² + bx + c",
      "a(x − xₚ)² + yₚ",
      "a(x − x₁)(x − x₂)",
      "(x + p)²",
    ],
    correctIndex: 0,
    discussion: ["Bentuk umum: ax² + bx + c."],
  },
  {
    id: "g2",
    label: "Bentuk PUNCAK FK adalah f(x) = …",
    kind: "choice",
    options: [
      "ax² + bx + c",
      "a(x − xₚ)² + yₚ",
      "a(x − x₁)(x − x₂)",
      "x² + bx",
    ],
    correctIndex: 1,
    discussion: ["Bentuk vertex: a(x − xₚ)² + yₚ."],
  },
  {
    id: "g3",
    label: "Bentuk AKAR FK adalah f(x) = …",
    kind: "choice",
    options: [
      "ax² + bx + c",
      "a(x − xₚ)² + yₚ",
      "a(x − x₁)(x − x₂)",
      "(x + p)(x − q)",
    ],
    correctIndex: 2,
    discussion: ["Bentuk akar: a(x − x₁)(x − x₂) — di mana x₁, x₂ adalah akar/titik potong sumbu-x."],
  },
  {
    id: "g4",
    label:
      "Diketahui PUNCAK parabola P(2, −1) dan melalui titik (0, 3). Pakai bentuk PUNCAK: f(x) = a(x − 2)² + (−1). Substitusi (0, 3): 3 = a(−2)² − 1 → 4a = 4 → a = …",
    kind: "fill",
    answers: ["1"],
    discussion: ["a = 4/4 = 1."],
  },
  {
    id: "g5",
    label: "Maka FK lengkapnya: f(x) = (x − 2)² − 1 = x² − 4x + … (bentuk umum)",
    kind: "fill",
    answers: ["3"],
    discussion: ["(x−2)² − 1 = x² − 4x + 4 − 1 = x² − 4x + 3."],
  },
  {
    id: "g6",
    label:
      "Diketahui AKAR-akar parabola: x = 1 dan x = 3, melalui titik (0, 3). Pakai bentuk AKAR: f(x) = a(x − 1)(x − 3). Substitusi (0, 3): 3 = a(−1)(−3) = 3a → a = …",
    kind: "fill",
    answers: ["1"],
    discussion: ["a = 1."],
  },
  {
    id: "g7",
    label:
      "Maka FK lengkapnya: f(x) = (x − 1)(x − 3) = x² − 4x + … (bentuk umum)",
    kind: "fill",
    answers: ["3"],
    discussion: ["x² − 4x + 3."],
  },
  {
    id: "g8",
    label:
      "Diketahui parabola melalui (0, 1), (1, 0), (2, 1). Bentuk umum: f(x) = ax² + bx + c. Dari (0,1) → c = 1. Dari (1,0) dan (2,1) → sistem 2 persamaan. a + b = … dan 4a + 2b = …",
    kind: "choice",
    options: [
      "a + b = −1, 4a + 2b = 0",
      "a + b = 1, 4a + 2b = 1",
      "a + b = 0, 4a + 2b = 0",
      "a + b = −1, 4a + 2b = 1",
    ],
    correctIndex: 0,
    discussion: ["f(1) = 0 → 1 + a + b = 0 → a + b = −1. f(2) = 1 → 1 + 4a + 2b = 1 → 4a + 2b = 0."],
  },
  {
    id: "g9",
    label: "Selesaikan SPL: a + b = −1 dan 4a + 2b = 0. Maka a = …",
    kind: "fill",
    answers: ["1"],
    discussion: ["Dari pers 2: 2a + b = 0 → b = −2a. Substitusi: a − 2a = −1 → a = 1, b = −2."],
  },
  {
    id: "g10",
    label:
      "Pernyataan: Untuk parabola yang DITAHU 2 AKAR-nya, paling efisien menggunakan BENTUK FAKTOR / AKAR.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Bentuk akar a(x − x₁)(x − x₂) langsung memanfaatkan akar tersebut.",
    ],
  },
  {
    id: "g11",
    label: "Pasangkan informasi dengan bentuk yang COCOK:",
    kind: "match",
    pairs: [
      { left: "3 titik sembarang", right: "ax² + bx + c" },
      { left: "Puncak + 1 titik", right: "a(x − xₚ)² + yₚ" },
      { left: "2 akar + 1 titik", right: "a(x − x₁)(x − x₂)" },
      { left: "Sumbu simetri + 2 titik", right: "a(x − xₚ)² + yₚ" },
    ],
    discussion: ["Pilih bentuk yang LANGSUNG memanfaatkan informasi yang ada."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "3 Bentuk FK",
    text: "Umum: ax² + bx + c. Puncak: a(x − xₚ)² + yₚ. Akar: a(x − x₁)(x − x₂). Pilih sesuai info!",
    tone: "violet",
  },
  {
    title: "Strategi Pemilihan",
    text: "Tahu puncak → vertex. Tahu akar → faktor. Tahu 3 titik → umum (sistem 3 persamaan).",
    tone: "amber",
  },
  {
    title: "Cari Konstanta a",
    text: "Setelah pilih bentuk dan substitusi titik kunci, gunakan TITIK LAIN untuk cari a. Akhirnya jabarkan ke bentuk umum.",
    tone: "emerald",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "fk-menyusun-game-bentuk",
    title: "🎯 Game 1 — Pilih Bentuk yang TEPAT",
    description: "Seret tiap INFORMASI ke BENTUK FK yang paling efisien!",
    buckets: [
      { id: "umum", label: "BENTUK UMUM", emoji: "📐", color: "cyan" },
      { id: "puncak", label: "BENTUK PUNCAK", emoji: "🪞", color: "violet" },
      { id: "akar", label: "BENTUK AKAR", emoji: "🌱", color: "amber" },
    ],
    items: [
      { id: "i1", label: "Puncak (2, −1) + titik (0, 3)", bucketId: "puncak", emoji: "🪞" },
      { id: "i2", label: "Akar 1 dan 3 + titik (0, 3)", bucketId: "akar", emoji: "🌱" },
      { id: "i3", label: "3 titik (1,0), (2,1), (3,4)", bucketId: "umum", emoji: "📐" },
      { id: "i4", label: "Sumbu simetri x=2 + 2 titik", bucketId: "puncak", emoji: "🪞" },
      { id: "i5", label: "TP sumbu-x: (1,0), (5,0) + 1 titik", bucketId: "akar", emoji: "🌱" },
      { id: "i6", label: "(0, 1), (1, 0), (2, 1)", bucketId: "umum", emoji: "📐" },
    ],
  },
  {
    kind: "arrow-match",
    id: "fk-menyusun-game-cocok",
    title: "🎯 Game 2 — Cocokkan Info ↔ FK",
    description: "Pasangkan tiap kondisi dengan FK yang sesuai. Tekan ◀ ▶.",
    rightOptions: [
      "f(x) = x² − 4x + 3",
      "f(x) = (x − 1)(x − 5)",
      "f(x) = x² + 2",
      "f(x) = −x² + 4x",
      "f(x) = 2(x − 1)² − 8",
      "f(x) = x² − 9",
    ],
    pairs: [
      { id: "co1", left: "Puncak (2, −1), titik (0, 3)", correctRight: "f(x) = x² − 4x + 3", emoji: "🪞" },
      { id: "co2", left: "Akar 1 dan 5, titik (0, 5)", correctRight: "f(x) = (x − 1)(x − 5)", emoji: "🌱" },
      { id: "co3", left: "Puncak (0, 2), titik (1, 3)", correctRight: "f(x) = x² + 2", emoji: "🪞" },
      { id: "co4", left: "Akar 0 dan 4, melalui (1, 3)", correctRight: "f(x) = −x² + 4x", emoji: "🌱" },
      { id: "co5", left: "Puncak (1, −8), melalui (3, 0)", correctRight: "f(x) = 2(x − 1)² − 8", emoji: "🪞" },
      { id: "co6", left: "Akar −3 dan 3, melalui (0, −9)", correctRight: "f(x) = x² − 9", emoji: "🌱" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question:
      "FK dengan puncak (1, 4) dan melalui (0, 3) adalah …",
    kind: "choice",
    options: [
      "f(x) = −(x − 1)² + 4",
      "f(x) = (x − 1)² + 4",
      "f(x) = −x² + 2x + 3",
      "Keduanya benar",
    ],
    correctIndex: 3,
    hint: "Vertex: a(x−1)² + 4 → substitusi (0,3) → a = −1.",
    discussion: ["a(0−1)² + 4 = 3 → a = −1. f(x) = −(x−1)² + 4 = −x² + 2x + 3 ✓."],
  },
  {
    id: "pp2",
    question:
      "FK dengan akar 2 dan −3, melalui (0, 6) adalah …",
    kind: "choice",
    options: [
      "f(x) = (x − 2)(x + 3) jadi −x² − x + 6 (pakai a=−1)",
      "f(x) = −(x − 2)(x + 3) = −x² + x + 6",
      "Keduanya sama",
      "Tidak cukup info",
    ],
    correctIndex: 1,
    hint: "f(0) = a(−2)(3) = −6a = 6 → a = −1.",
    discussion: ["a = −1 → f(x) = −(x−2)(x+3) = −x² − x + 6."],
  },
  {
    id: "pp3",
    question:
      "FK melalui (0, 0), (1, 1), (2, 4) adalah …",
    kind: "choice",
    options: ["f(x) = x²", "f(x) = 2x²", "f(x) = x² + x", "f(x) = x² − x"],
    correctIndex: 0,
    hint: "Dari (0,0) → c=0. (1,1) → a+b=1. (2,4) → 4a+2b=4.",
    discussion: ["a + b = 1, 2a + b = 2 → a=1, b=0 → f(x) = x²."],
  },
  {
    id: "pp4",
    question:
      "Pernyataan: Tahu puncak parabola SAJA cukup untuk menentukan FK secara unik.",
    kind: "truefalse",
    correct: false,
    hint: "Cek apakah a sudah ditentukan.",
    discussion: ["SALAH. Masih perlu 1 titik lain untuk menentukan a (lebar/sempit)."],
  },
  {
    id: "pp5",
    question:
      "FK dengan TP sumbu-x: (−2, 0) dan (2, 0), melalui (0, −4) adalah …",
    kind: "choice",
    options: [
      "f(x) = x² − 4",
      "f(x) = −x² + 4",
      "f(x) = (x + 2)(x − 2)",
      "(A) dan (C) benar",
    ],
    correctIndex: 3,
    hint: "Bentuk akar a(x+2)(x−2) → f(0) = −4a = −4 → a=1.",
    discussion: ["a=1 → f(x) = (x+2)(x−2) = x² − 4."],
  },
  {
    id: "pp6",
    question:
      "FK dengan sumbu simetri x = 3 dan melalui (1, 0) dan (5, 0) adalah …",
    kind: "choice",
    options: [
      "f(x) = a(x − 1)(x − 5)",
      "f(x) = a(x − 3)² + k",
      "Keduanya bisa",
      "Tidak bisa",
    ],
    correctIndex: 2,
    hint: "Punya 2 akar (1, 5) → bisa pakai akar; juga bisa puncak.",
    discussion: ["Keduanya bisa, tapi bentuk akar lebih efisien karena tahu kedua akar."],
  },
  {
    id: "pp7",
    question:
      "FK dengan puncak (0, 0) dan melalui (2, 8) adalah …",
    kind: "choice",
    options: ["f(x) = 2x²", "f(x) = x²", "f(x) = 4x²", "f(x) = 8x²"],
    correctIndex: 0,
    hint: "f(x) = ax² → f(2) = 4a = 8.",
    discussion: ["a = 2 → f(x) = 2x²."],
  },
  {
    id: "pp8",
    question:
      "FK dengan akar tunggal x = 3 (akar kembar) dan melalui (1, 4) adalah …",
    kind: "choice",
    options: [
      "f(x) = (x − 3)²",
      "f(x) = (x + 3)²",
      "f(x) = (x − 3)² + 4",
      "f(x) = 4(x − 3)²/(−2)²",
    ],
    correctIndex: 0,
    hint: "f(x) = a(x−3)² → 4 = a(−2)² = 4a → a=1.",
    discussion: ["a = 1 → f(x) = (x−3)²."],
  },
];

const MenyusunFungsiLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Pengayaan FK"
    title="Menyusun Fungsi Kuadrat — Penemuan Terbimbing"
    intro="Sobat Numatik 🔧! Kebalikan dari menggambar grafik: SUSUN FK dari potongan informasi! Pilih BENTUK yang COCOK — UMUM, PUNCAK, atau AKAR — agar penyelesaian cepat. Substitusi titik kunci → temukan a → JADILAH parabola idamanmu!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan strategi memilih bentuk."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/fungsi-kuadrat"
    backLabel="Kembali ke Menu Fungsi Kuadrat"
    scoreMessages={{
      perfect: "🌟 Mantap! Menyusun FK sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Latih pemilihan bentuk yang efisien.",
      low: "💪 Tetap semangat! Mulai dari mengenali 3 bentuk FK.",
    }}
  />
);

export default MenyusunFungsiLKPDPage;
