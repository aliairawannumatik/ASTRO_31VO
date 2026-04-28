import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Lintasan Bola (Tinggi Maksimum)",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-700/20 border border-amber-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="20" fontSize="11" fontWeight="bold" fill="#fde68a" textAnchor="middle">h(t) = −5t² + 20t (meter)</text>
          <line x1="20" y1="170" x2="260" y2="170" stroke="#94a3b8" strokeWidth="1" />
          <path d="M 30 170 Q 140 30 250 170" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
          <circle cx="140" cy="58" r="6" fill="#ef4444" stroke="#fca5a5" strokeWidth="2" />
          <line x1="140" y1="170" x2="140" y2="58" stroke="#fde68a" strokeWidth="1" strokeDasharray="3 3" />
          <text x="140" y="48" fontSize="11" fontWeight="bold" fill="#fde68a" textAnchor="middle">PUNCAK</text>
          <text x="155" y="120" fontSize="10" fill="#a7f3d0">h_maks = 20 m</text>
          <text x="155" y="135" fontSize="10" fill="#a7f3d0">pada t = 2 detik</text>
          <text x="30" y="185" fontSize="9" fill="#94a3b8">t = 0</text>
          <text x="250" y="185" fontSize="9" fill="#94a3b8" textAnchor="end">t = 4</text>
        </svg>
      </div>
    ),
    text:
      "Lintasan bola membentuk PARABOLA. Tinggi MAKSIMUM = yₚ titik puncak. Karena a < 0, parabola buka BAWAH → punya MAKSIMUM. Waktu untuk mencapai puncak = xₚ = −b/(2a).",
  },
  {
    title: "Situasi 2 — Luas Maksimum dengan Keliling Tetap",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="11" fontWeight="bold" fill="#a7f3d0" textAnchor="middle">Kawat 40 m → persegi panjang</text>
          <text x="140" y="38" fontSize="10" fill="#fde68a" textAnchor="middle">2(p + l) = 40 → p + l = 20</text>
          <rect x="60" y="55" width="160" height="60" rx="4" fill="#34d399" fillOpacity="0.35" stroke="#6ee7b7" strokeWidth="2" />
          <text x="140" y="92" fontSize="13" fontWeight="bold" fill="#fff" textAnchor="middle">L = p × l = (20 − l) × l</text>
          <text x="140" y="125" fontSize="10" fill="#fde68a" textAnchor="middle">L(l) = 20l − l² (FK!)</text>
          <rect x="20" y="138" width="240" height="22" rx="6" fill="#22d3ee" fillOpacity="0.4" />
          <text x="140" y="154" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">{"a = −1 < 0 → ada MAKSIMUM"}</text>
          <rect x="20" y="165" width="240" height="22" rx="6" fill="#fbbf24" fillOpacity="0.4" />
          <text x="140" y="181" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">l_opt = −20/(2·−1) = 10 → L = 100 m²</text>
        </svg>
      </div>
    ),
    text:
      "Banyak masalah OPTIMASI menjadi FK! Misalkan variabel → susun fungsi → cari nilai EKSTREM (xₚ atau yₚ). Untuk LUAS MAKS dgn keliling tetap, persegi panjang yang OPTIMAL adalah PERSEGI.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Fungsi tinggi h(t) = −5t² + 20t. Karena a = −5 < 0, h(t) memiliki nilai …",
    kind: "choice",
    options: ["Maksimum", "Minimum", "Tidak ada", "Tak hingga"],
    correctIndex: 0,
    discussion: ["a < 0 → ada nilai MAKSIMUM."],
  },
  {
    id: "g2",
    label: "Waktu mencapai tinggi maksimum: tₚ = −b/(2a) = …",
    kind: "fill",
    answers: ["2"],
    discussion: ["tₚ = −20/(2·−5) = 2 detik."],
  },
  {
    id: "g3",
    label: "Tinggi maksimum bola: h(2) = …",
    kind: "fill",
    answers: ["20"],
    discussion: ["h(2) = −5(4) + 20(2) = −20 + 40 = 20 m."],
  },
  {
    id: "g4",
    label:
      "Persegi panjang dengan keliling 40 m. Misalkan lebar = l, panjang = …",
    kind: "fill",
    answers: ["20-l", "20 − l", "20-l", "(20 − l)"],
    discussion: ["2(p + l) = 40 → p + l = 20 → p = 20 − l."],
  },
  {
    id: "g5",
    label: "Luas L(l) = panjang × lebar = (20 − l) × l = …",
    kind: "choice",
    options: ["20l − l²", "20l + l²", "l² − 20l", "l² + 20l"],
    correctIndex: 0,
    discussion: ["L(l) = 20l − l²."],
  },
  {
    id: "g6",
    label:
      "Karena a = −1 < 0, L(l) memiliki nilai MAKSIMUM. lebar OPTIMAL: l = −b/(2a) = …",
    kind: "fill",
    answers: ["10"],
    discussion: ["l = −20/(−2) = 10 m."],
  },
  {
    id: "g7",
    label: "Maka panjang OPTIMAL = 20 − 10 = … m. Bentuknya menjadi …",
    kind: "choice",
    options: [
      "10, persegi panjang biasa",
      "10, PERSEGI",
      "5, persegi panjang",
      "30, persegi panjang",
    ],
    correctIndex: 1,
    discussion: ["panjang = 10 m = lebar → bentuknya PERSEGI 10×10."],
  },
  {
    id: "g8",
    label: "Luas maksimum: L(10) = … m²",
    kind: "fill",
    answers: ["100"],
    discussion: ["L = 10 × 10 = 100 m²."],
  },
  {
    id: "g9",
    label:
      "Pernyataan: Untuk masalah laba/biaya, jika fungsi laba berbentuk FK dengan a < 0, ada laba MAKSIMUM.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. a < 0 → buka bawah → punya MAKSIMUM.",
    ],
  },
  {
    id: "g10",
    label:
      "Sebuah FK biaya: B(x) = 2x² − 40x + 250. Karena a > 0, B(x) memiliki nilai …",
    kind: "choice",
    options: ["MAKSIMUM", "MINIMUM", "Tidak ada", "Tak hingga"],
    correctIndex: 1,
    discussion: ["a > 0 → MIN. Biaya MINIMUM tercapai di puncak."],
  },
  {
    id: "g11",
    label: "Pasangkan masalah dgn jenis nilai ekstrem:",
    kind: "match",
    pairs: [
      { left: "Tinggi bola h = −5t² + 20t", right: "MAKSIMUM" },
      { left: "Luas L = 20l − l²", right: "MAKSIMUM" },
      { left: "Biaya B = 2x² − 40x + 250", right: "MINIMUM" },
      { left: "Laba P = −x² + 30x − 100", right: "MAKSIMUM" },
    ],
    discussion: ["Cek tanda a: a > 0 → MIN; a < 0 → MAKS."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Langkah Optimasi dengan FK",
    text: "1) Misalkan variabel x. 2) Susun fungsi f(x) berbentuk kuadrat. 3) Cek a → MIN/MAKS. 4) xₚ = −b/(2a). 5) Hitung yₚ = nilai ekstrem.",
    tone: "amber",
  },
  {
    title: "Aplikasi Umum",
    text: "Tinggi proyektil (h_maks), luas optimum (kawat tetap → PERSEGI), biaya minimum, laba maksimum, jarak/kecepatan optimum.",
    tone: "emerald",
  },
  {
    title: "Cek Kewajaran",
    text: "Pastikan x dalam DOMAIN MASALAH (positif, integer jika perlu). Tafsirkan jawaban dalam KONTEKS soal.",
    tone: "cyan",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "fk-penerapan-game-jenis",
    title: "🎯 Game 1 — MAKS atau MIN?",
    description: "Seret tiap fungsi ke jenis nilai ekstremnya!",
    buckets: [
      { id: "maks", label: "Nilai MAKSIMUM (a < 0)", emoji: "🔺", color: "amber" },
      { id: "min", label: "Nilai MINIMUM (a > 0)", emoji: "🔻", color: "emerald" },
    ],
    items: [
      { id: "p1", label: "h(t) = −5t² + 20t", bucketId: "maks", emoji: "🏐" },
      { id: "p2", label: "L(l) = 20l − l²", bucketId: "maks", emoji: "📐" },
      { id: "p3", label: "B(x) = 2x² − 40x + 250", bucketId: "min", emoji: "💰" },
      { id: "p4", label: "P(x) = −x² + 30x − 100", bucketId: "maks", emoji: "📈" },
      { id: "p5", label: "C(x) = x² − 10x + 30", bucketId: "min", emoji: "💵" },
      { id: "p6", label: "h(t) = −10t² + 60t", bucketId: "maks", emoji: "🏐" },
      { id: "p7", label: "f(x) = 0.5x² − 6x", bucketId: "min", emoji: "📊" },
      { id: "p8", label: "g(x) = −2x² + 40x", bucketId: "maks", emoji: "📈" },
    ],
  },
  {
    kind: "arrow-match",
    id: "fk-penerapan-game-nilai",
    title: "🎯 Game 2 — Nilai Ekstrem",
    description: "Pasangkan tiap fungsi dgn nilai ekstremnya. Tekan ◀ ▶.",
    rightOptions: ["20", "45", "50", "100", "125", "200"],
    pairs: [
      { id: "n1", left: "h(t) = −5t² + 20t (h_maks)", correctRight: "20", emoji: "🏐" },
      { id: "n2", left: "h(t) = −5t² + 30t (h_maks)", correctRight: "45", emoji: "🏐" },
      { id: "n3", left: "L(l) = 20l − l² (L_maks)", correctRight: "100", emoji: "📐" },
      { id: "n4", left: "P(x) = −x² + 30x − 100 (P_maks)", correctRight: "125", emoji: "📈" },
      { id: "n5", left: "B(x) = 2x² − 40x + 250 (B_min)", correctRight: "50", emoji: "💰" },
      { id: "n6", left: "g(x) = −2x² + 40x (g_maks)", correctRight: "200", emoji: "📈" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question:
      "Bola dilempar h(t) = −5t² + 30t. Tinggi maksimum = … m.",
    kind: "fill",
    answers: ["45"],
    hint: "tₚ = 3 → h(3) = −45 + 90.",
    discussion: ["h(3) = 45 m."],
  },
  {
    id: "pp2",
    question:
      "Persegi panjang berkeliling 60 m. Luas MAKSIMUMnya = … m².",
    kind: "fill",
    answers: ["225"],
    hint: "p+l=30 → L=l(30−l), l=15.",
    discussion: ["l=15 → L=15·15=225 (PERSEGI 15×15)."],
  },
  {
    id: "pp3",
    question:
      "Laba penjualan: P(x) = −2x² + 40x − 50. Banyak unit untuk LABA MAKS adalah …",
    kind: "fill",
    answers: ["10"],
    hint: "xₚ = −40/(2·−2) = 10.",
    discussion: ["xₚ = 10 unit."],
  },
  {
    id: "pp4",
    question: "Laba maksimum dari P(x) = −2x² + 40x − 50 = …",
    kind: "fill",
    answers: ["150"],
    hint: "P(10) = −200 + 400 − 50.",
    discussion: ["P(10) = 150."],
  },
  {
    id: "pp5",
    question:
      "Pernyataan: Untuk LUAS MAKSIMUM dengan keliling tetap, bentuknya selalu PERSEGI.",
    kind: "truefalse",
    correct: true,
    hint: "Buktikan dengan FK.",
    discussion: ["BENAR. l = p = K/4 → bentuknya persegi."],
  },
  {
    id: "pp6",
    question:
      "Biaya produksi: B(x) = x² − 20x + 150. Banyak unit untuk biaya MIN = …",
    kind: "fill",
    answers: ["10"],
    hint: "xₚ = 20/2.",
    discussion: ["xₚ = 10."],
  },
  {
    id: "pp7",
    question: "Biaya minimum B(x) = x² − 20x + 150 = …",
    kind: "fill",
    answers: ["50"],
    hint: "B(10) = 100 − 200 + 150.",
    discussion: ["B(10) = 50."],
  },
  {
    id: "pp8",
    question:
      "Kawat 24 m untuk membuat 3 sisi persegi panjang yang menempel tembok (tembok jadi sisi ke-4). Luas MAKSIMUM = … m².",
    kind: "fill",
    answers: ["72"],
    hint: "Misal p (sejajar tembok), l (lebar). p + 2l = 24 → p = 24 − 2l → L = (24 − 2l)l. Maks di l = 6.",
    discussion: ["L(l) = 24l − 2l² → l = 6 → L = 24(6) − 2(36) = 144 − 72 = 72 m²."],
  },
];

const PenerapanMaksMinLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Pengayaan FK"
    title="Penerapan FK (Nilai Maksimum/Minimum) — Penemuan Terbimbing"
    intro="Sobat Numatik 🏆! Ayo TERAPKAN FK pada masalah dunia nyata: tinggi bola, luas optimum, biaya minimum, laba maksimum! Trik: misalkan x → bentuk FK → cek tanda a → cari xₚ & yₚ. Inilah POWER FK untuk OPTIMASI!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan strategi optimasi."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/fungsi-kuadrat"
    backLabel="Kembali ke Menu Fungsi Kuadrat"
    scoreMessages={{
      perfect: "🌟 Mantap! Optimasi FK sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Hati-hati dengan TANDA a dan kewajaran.",
      low: "💪 Tetap semangat! Mulai dari membaca konteks soal.",
    }}
  />
);

export default PenerapanMaksMinLKPDPage;
