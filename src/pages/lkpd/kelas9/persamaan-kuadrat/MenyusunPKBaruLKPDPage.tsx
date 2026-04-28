import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Hubungan Akar & Koefisien (Vieta)",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-cyan-700/20 border border-fuchsia-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="13" fontWeight="bold" fill="#f0abfc" textAnchor="middle">PK: ax² + bx + c = 0</text>
          <text x="140" y="42" fontSize="10" fill="#fde68a" textAnchor="middle">Akar-akar: x₁ dan x₂</text>
          <rect x="20" y="55" width="240" height="32" rx="6" fill="#22d3ee" fillOpacity="0.4" stroke="#67e8f9" strokeWidth="1.5" />
          <text x="140" y="77" fontSize="13" fontWeight="bold" fill="#fff" textAnchor="middle">x₁ + x₂ = −b/a</text>
          <rect x="20" y="92" width="240" height="32" rx="6" fill="#a78bfa" fillOpacity="0.4" stroke="#c4b5fd" strokeWidth="1.5" />
          <text x="140" y="114" fontSize="13" fontWeight="bold" fill="#fff" textAnchor="middle">x₁ · x₂ = c/a</text>
          <rect x="20" y="135" width="240" height="50" rx="8" fill="#fbbf24" fillOpacity="0.4" stroke="#fde68a" strokeWidth="1.5" />
          <text x="140" y="155" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">PK BARU dengan akar α, β:</text>
          <text x="140" y="175" fontSize="13" fontWeight="bold" fill="#fde68a" textAnchor="middle">x² − (α+β)x + αβ = 0</text>
        </svg>
      </div>
    ),
    text:
      "RUMUS VIETA: untuk PK ax² + bx + c = 0 dengan akar x₁, x₂ → x₁+x₂ = −b/a dan x₁·x₂ = c/a. Sebaliknya, PK BARU dengan akar α, β adalah x² − (α+β)x + αβ = 0.",
  },
  {
    title: "Situasi 2 — Menyusun PK Baru",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-amber-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 280 220" className="w-full">
          <rect width="280" height="220" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="12" fontWeight="bold" fill="#a7f3d0" textAnchor="middle">PK lama: x² − 5x + 6 = 0 → x₁=2, x₂=3</text>
          <text x="140" y="42" fontSize="11" fill="#fde68a" textAnchor="middle">Susun PK BARU dengan akar (x₁+1) dan (x₂+1):</text>
          <rect x="20" y="55" width="240" height="22" rx="6" fill="#a7f3d0" fillOpacity="0.3" />
          <text x="140" y="71" fontSize="10" fill="#fff" textAnchor="middle">α = x₁+1 = 3, β = x₂+1 = 4</text>
          <rect x="20" y="82" width="240" height="22" rx="6" fill="#fde68a" fillOpacity="0.3" />
          <text x="140" y="98" fontSize="10" fill="#fff" textAnchor="middle">α + β = 7</text>
          <rect x="20" y="109" width="240" height="22" rx="6" fill="#fde68a" fillOpacity="0.3" />
          <text x="140" y="125" fontSize="10" fill="#fff" textAnchor="middle">α · β = 12</text>
          <rect x="20" y="136" width="240" height="35" rx="8" fill="#22d3ee" fillOpacity="0.45" stroke="#67e8f9" strokeWidth="1.5" />
          <text x="140" y="160" fontSize="13" fontWeight="bold" fill="#fff" textAnchor="middle">x² − 7x + 12 = 0</text>
          <rect x="20" y="180" width="240" height="32" rx="6" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="200" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">Tanpa cari akar baru → pakai Vieta!</text>
        </svg>
      </div>
    ),
    text:
      "Untuk menyusun PK BARU dengan akar yang merupakan FUNGSI dari akar lama (mis. x₁+k, 1/x₁, 2x₁), gunakan rumus Vieta: hitung dulu x₁+x₂ dan x₁·x₂, lalu cari α+β dan α·β.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Untuk PK ax² + bx + c = 0, x₁ + x₂ = …",
    kind: "choice",
    options: ["b/a", "−b/a", "c/a", "−c/a"],
    correctIndex: 1,
    discussion: ["Rumus Vieta: x₁ + x₂ = −b/a."],
  },
  {
    id: "g2",
    label: "Untuk PK ax² + bx + c = 0, x₁ · x₂ = …",
    kind: "choice",
    options: ["b/a", "−b/a", "c/a", "−c/a"],
    correctIndex: 2,
    discussion: ["Rumus Vieta: x₁ · x₂ = c/a."],
  },
  {
    id: "g3",
    label: "PK x² − 7x + 12 = 0 memiliki x₁ + x₂ = …",
    kind: "fill",
    answers: ["7"],
    discussion: ["−b/a = −(−7)/1 = 7."],
  },
  {
    id: "g4",
    label: "Pada PK yang sama, x₁ · x₂ = …",
    kind: "fill",
    answers: ["12"],
    discussion: ["c/a = 12/1 = 12."],
  },
  {
    id: "g5",
    label: "PK BARU dengan akar 3 dan 5 adalah …",
    kind: "choice",
    options: [
      "x² − 8x + 15 = 0",
      "x² + 8x + 15 = 0",
      "x² − 8x − 15 = 0",
      "x² + 8x − 15 = 0",
    ],
    correctIndex: 0,
    discussion: ["α+β=8, αβ=15 → x² − 8x + 15 = 0."],
  },
  {
    id: "g6",
    label: "PK BARU dengan akar −2 dan 4 adalah …",
    kind: "choice",
    options: [
      "x² − 2x − 8 = 0",
      "x² + 2x − 8 = 0",
      "x² − 2x + 8 = 0",
      "x² + 2x + 8 = 0",
    ],
    correctIndex: 0,
    discussion: ["α+β = 2, αβ = −8 → x² − 2x − 8 = 0."],
  },
  {
    id: "g7",
    label:
      "Diketahui PK x² − 5x + 6 = 0 dengan akar x₁, x₂. PK BARU dengan akar (x₁+1) dan (x₂+1):  α+β = (x₁+x₂)+2 = …",
    kind: "fill",
    answers: ["7"],
    discussion: ["x₁+x₂ = 5 → (x₁+1)+(x₂+1) = 5+2 = 7."],
  },
  {
    id: "g8",
    label: "Pada situasi yang sama, α·β = (x₁+1)(x₂+1) = x₁x₂+(x₁+x₂)+1 = …",
    kind: "fill",
    answers: ["12"],
    discussion: ["6 + 5 + 1 = 12."],
  },
  {
    id: "g9",
    label: "Maka PK BARU-nya …",
    kind: "choice",
    options: [
      "x² − 7x + 12 = 0",
      "x² + 7x + 12 = 0",
      "x² − 7x − 12 = 0",
      "x² + 7x − 12 = 0",
    ],
    correctIndex: 0,
    discussion: ["x² − (α+β)x + αβ = x² − 7x + 12 = 0."],
  },
  {
    id: "g10",
    label:
      "Pernyataan: Untuk membentuk PK BARU dengan akar 1/x₁ dan 1/x₂, kita TIDAK perlu mencari nilai akar PK lama.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. 1/x₁ + 1/x₂ = (x₁+x₂)/(x₁x₂) dan (1/x₁)(1/x₂) = 1/(x₁x₂). Cukup pakai Vieta!",
    ],
  },
  {
    id: "g11",
    label: "Pasangkan akar dengan PK BARU-nya:",
    kind: "match",
    pairs: [
      { left: "Akar 2 dan 3", right: "x² − 5x + 6 = 0" },
      { left: "Akar −1 dan 4", right: "x² − 3x − 4 = 0" },
      { left: "Akar 0 dan 5", right: "x² − 5x = 0" },
      { left: "Akar −2 dan −3", right: "x² + 5x + 6 = 0" },
    ],
    discussion: ["x² − (α+β)x + αβ = 0."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Rumus Vieta",
    text: "x₁ + x₂ = −b/a dan x₁ · x₂ = c/a. Cara CEPAT mengetahui jumlah & hasil kali akar TANPA mencarinya.",
    tone: "fuchsia",
  },
  {
    title: "Menyusun PK Baru",
    text: "PK BARU dengan akar α, β: x² − (α+β)x + αβ = 0. Hitung α+β dan αβ dulu, lalu masukkan ke rumus.",
    tone: "cyan",
  },
  {
    title: "Akar yang Berhubungan",
    text: "(x₁+k)+(x₂+k) = (x₁+x₂)+2k. (x₁+k)(x₂+k) = x₁x₂+k(x₁+x₂)+k². Selalu pakai Vieta dulu!",
    tone: "emerald",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "menyusun-game-vieta",
    title: "🎯 Game 1 — Cocokkan Vieta",
    description: "Seret tiap PK ke nilai (x₁+x₂, x₁·x₂)-nya yang TEPAT!",
    buckets: [
      { id: "v1", label: "Σ=5, ⨯=6", emoji: "✨", color: "cyan" },
      { id: "v2", label: "Σ=−5, ⨯=6", emoji: "✨", color: "violet" },
      { id: "v3", label: "Σ=7, ⨯=12", emoji: "✨", color: "amber" },
      { id: "v4", label: "Σ=2, ⨯=−8", emoji: "✨", color: "rose" },
    ],
    items: [
      { id: "pk1", label: "x² − 5x + 6 = 0", bucketId: "v1", emoji: "📐" },
      { id: "pk2", label: "x² + 5x + 6 = 0", bucketId: "v2", emoji: "📐" },
      { id: "pk3", label: "x² − 7x + 12 = 0", bucketId: "v3", emoji: "📐" },
      { id: "pk4", label: "x² − 2x − 8 = 0", bucketId: "v4", emoji: "📐" },
      { id: "pk5", label: "x² − 5x + 6 = 0 (varian)", bucketId: "v1", emoji: "📐" },
      { id: "pk6", label: "x² − 7x + 12 = 0 (varian)", bucketId: "v3", emoji: "📐" },
    ],
  },
  {
    kind: "arrow-match",
    id: "menyusun-game-pkbaru",
    title: "🎯 Game 2 — Bentuk PK Baru",
    description: "Pasangkan tiap pasangan akar dengan PK BARU-nya. Tekan ◀ ▶.",
    rightOptions: [
      "x² − 5x + 6 = 0",
      "x² + 5x + 6 = 0",
      "x² − 8x + 15 = 0",
      "x² − 2x − 8 = 0",
      "x² − 7x + 10 = 0",
      "x² − 3x − 4 = 0",
    ],
    pairs: [
      { id: "ak1", left: "Akar 2 dan 3", correctRight: "x² − 5x + 6 = 0", emoji: "🌱" },
      { id: "ak2", left: "Akar −2 dan −3", correctRight: "x² + 5x + 6 = 0", emoji: "🌱" },
      { id: "ak3", left: "Akar 3 dan 5", correctRight: "x² − 8x + 15 = 0", emoji: "🌱" },
      { id: "ak4", left: "Akar −2 dan 4", correctRight: "x² − 2x − 8 = 0", emoji: "🌱" },
      { id: "ak5", left: "Akar 2 dan 5", correctRight: "x² − 7x + 10 = 0", emoji: "🌱" },
      { id: "ak6", left: "Akar −1 dan 4", correctRight: "x² − 3x − 4 = 0", emoji: "🌱" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Akar PK 2x² − 8x + 6 = 0 memiliki x₁ + x₂ = …",
    kind: "fill",
    answers: ["4"],
    hint: "−b/a = 8/2.",
    discussion: ["x₁+x₂ = −(−8)/2 = 4."],
  },
  {
    id: "pp2",
    question: "Pada PK yang sama, x₁ · x₂ = …",
    kind: "fill",
    answers: ["3"],
    hint: "c/a = 6/2.",
    discussion: ["x₁·x₂ = 6/2 = 3."],
  },
  {
    id: "pp3",
    question:
      "PK BARU dengan akar 1/2 dan 1/3 adalah …",
    kind: "choice",
    options: [
      "x² − (5/6)x + 1/6 = 0",
      "6x² − 5x + 1 = 0",
      "Keduanya benar",
      "Tidak ada yang benar",
    ],
    correctIndex: 2,
    hint: "α+β=5/6, αβ=1/6 → kalikan 6.",
    discussion: ["x² − (5/6)x + 1/6 = 0 ⇔ 6x² − 5x + 1 = 0."],
  },
  {
    id: "pp4",
    question:
      "Diketahui x² − 5x + 6 = 0 dengan akar x₁, x₂. PK BARU dengan akar 2x₁ dan 2x₂ adalah …",
    kind: "choice",
    options: [
      "x² − 10x + 24 = 0",
      "x² − 10x + 12 = 0",
      "x² − 5x + 24 = 0",
      "x² − 10x + 6 = 0",
    ],
    correctIndex: 0,
    hint: "α+β=2(x₁+x₂)=10, αβ=4·x₁x₂=24.",
    discussion: ["x² − 10x + 24 = 0."],
  },
  {
    id: "pp5",
    question:
      "Diketahui x² − 4x + 3 = 0 dengan akar p, q. Nilai 1/p + 1/q = …",
    kind: "fill",
    answers: ["4/3"],
    hint: "(p+q)/(pq).",
    discussion: ["(p+q)/(pq) = 4/3."],
  },
  {
    id: "pp6",
    question:
      "PK BARU dengan akar (x₁+2) dan (x₂+2) dari PK x² − 5x + 6 = 0 adalah …",
    kind: "choice",
    options: [
      "x² − 9x + 20 = 0",
      "x² − 9x + 12 = 0",
      "x² − 7x + 20 = 0",
      "x² − 7x + 12 = 0",
    ],
    correctIndex: 0,
    hint: "α+β = (x₁+x₂)+4=9, αβ = x₁x₂+2(x₁+x₂)+4=20.",
    discussion: ["x² − 9x + 20 = 0."],
  },
  {
    id: "pp7",
    question:
      "Pernyataan: Jika α+β = 7 dan αβ = 12, maka PK-nya x² + 7x + 12 = 0.",
    kind: "truefalse",
    correct: false,
    hint: "Cek tanda: x² − (α+β)x + αβ.",
    discussion: ["SALAH. Yang benar: x² − 7x + 12 = 0."],
  },
  {
    id: "pp8",
    question:
      "Diketahui x² + 5x − 14 = 0 dengan akar a, b. Nilai a² + b² = …",
    kind: "fill",
    answers: ["53"],
    hint: "a²+b² = (a+b)² − 2ab.",
    discussion: ["a+b = −5, ab = −14 → (−5)² − 2(−14) = 25 + 28 = 53."],
  },
];

const MenyusunPKBaruLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Pengayaan PK"
    title="Menyusun Persamaan Kuadrat Baru — Penemuan Terbimbing"
    intro="Sobat Numatik ✏️! Kenalan dengan rumus VIETA — jembatan AJAIB antara akar dan koefisien PK! Kamu akan menemukan x₁+x₂ = −b/a, x₁·x₂ = c/a, lalu menggunakannya untuk MENYUSUN PK BARU dari pasangan akar atau dari fungsi akar lama."
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan rumus Vieta dan cara menyusun PK baru."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/persamaan-kuadrat"
    backLabel="Kembali ke Menu Persamaan Kuadrat"
    scoreMessages={{
      perfect: "🌟 Mantap! Vieta & PK baru sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Hafalkan dulu rumus Vieta x₁+x₂ dan x₁x₂.",
      low: "💪 Tetap semangat! Mulai dari pasangan akar bilangan bulat.",
    }}
  />
);

export default MenyusunPKBaruLKPDPage;
