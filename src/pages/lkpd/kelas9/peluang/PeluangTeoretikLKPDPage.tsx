import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Peluang Mata Genap pada Dadu",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="11" fontWeight="bold" fill="#67e8f9" textAnchor="middle">Dadu: kejadian A = mata genap</text>
          {[1, 2, 3, 4, 5, 6].map((n, i) => (
            <g key={n}>
              <rect x={20 + i * 42} y={45} width={36} height={36} rx={6}
                fill={n % 2 === 0 ? "#34d399" : "#22d3ee"}
                fillOpacity="0.45" stroke={n % 2 === 0 ? "#6ee7b7" : "#67e8f9"} strokeWidth="1.5" />
              <text x={38 + i * 42} y={70} fontSize="16" fontWeight="bold" fill="#fff" textAnchor="middle">{n}</text>
            </g>
          ))}
          <text x="140" y="105" fontSize="11" fill="#fde68a" textAnchor="middle">A = {"{2, 4, 6}"} → n(A) = 3</text>
          <text x="140" y="125" fontSize="11" fill="#fde68a" textAnchor="middle">S = {"{1,2,3,4,5,6}"} → n(S) = 6</text>
          <rect x="50" y="145" width="180" height="40" rx="8" fill="#fbbf24" fillOpacity="0.4" stroke="#fde68a" strokeWidth="1.5" />
          <text x="140" y="170" fontSize="14" fontWeight="bold" fill="#fff" textAnchor="middle">P(A) = 3/6 = 1/2</text>
        </svg>
      </div>
    ),
    text:
      "Pada lemparan dadu, kejadian A = 'mata GENAP' = {2, 4, 6}. n(A) = 3 dari n(S) = 6. PELUANG TEORETIK P(A) = n(A) / n(S) = 3/6 = 1/2. Inilah peluang yang dihitung dari RUMUS, bukan eksperimen!",
  },
  {
    title: "Situasi 2 — Rentang Nilai Peluang",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-700/20 border border-rose-300/40 p-3">
        <svg viewBox="0 0 280 180" className="w-full">
          <rect width="280" height="180" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="11" fontWeight="bold" fill="#fda4af" textAnchor="middle">Skala Nilai Peluang</text>
          <line x1="30" y1="80" x2="250" y2="80" stroke="#fde68a" strokeWidth="3" />
          <circle cx="30" cy="80" r="8" fill="#ef4444" />
          <text x="30" y="105" fontSize="10" fontWeight="bold" fill="#ef4444" textAnchor="middle">0</text>
          <text x="30" y="120" fontSize="9" fill="#fda4af" textAnchor="middle">mustahil</text>
          <circle cx="140" cy="80" r="8" fill="#fbbf24" />
          <text x="140" y="105" fontSize="10" fontWeight="bold" fill="#fbbf24" textAnchor="middle">0,5</text>
          <text x="140" y="120" fontSize="9" fill="#fde68a" textAnchor="middle">sama mungkin</text>
          <circle cx="250" cy="80" r="8" fill="#34d399" />
          <text x="250" y="105" fontSize="10" fontWeight="bold" fill="#34d399" textAnchor="middle">1</text>
          <text x="250" y="120" fontSize="9" fill="#a7f3d0" textAnchor="middle">pasti</text>
          <text x="140" y="155" fontSize="11" fill="#fff" textAnchor="middle">0 ≤ P(A) ≤ 1</text>
          <text x="140" y="172" fontSize="10" fill="#67e8f9" textAnchor="middle">Semakin DEKAT 1 → semakin MUNGKIN terjadi!</text>
        </svg>
      </div>
    ),
    text:
      "Nilai PELUANG selalu antara 0 dan 1. P(A) = 0 → kejadian MUSTAHIL. P(A) = 1 → kejadian PASTI terjadi. P(A) = 0,5 → SAMA MUNGKIN terjadi atau tidak.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Rumus PELUANG TEORETIK kejadian A: P(A) = …",
    kind: "choice",
    options: [
      "n(A) × n(S)",
      "n(A) + n(S)",
      "n(A) / n(S)",
      "n(S) / n(A)",
    ],
    correctIndex: 2,
    discussion: ["P(A) = n(A) / n(S) = banyak titik sampel A ÷ banyak titik sampel S."],
  },
  {
    id: "g2",
    label: "Lempar 1 dadu. P(mata 5) = …",
    kind: "fill",
    answers: ["1/6"],
    discussion: ["n(A) = 1 (hanya {5}), n(S) = 6 → P = 1/6."],
  },
  {
    id: "g3",
    label: "Lempar 1 dadu. P(mata genap) = …",
    kind: "fill",
    answers: ["1/2", "3/6", "0,5", "0.5"],
    discussion: ["Genap = {2,4,6}, n(A)=3 → P = 3/6 = 1/2."],
  },
  {
    id: "g4",
    label: "Lempar 1 dadu. P(mata prima) = …",
    kind: "fill",
    answers: ["1/2", "3/6", "0,5"],
    discussion: ["Prima = {2,3,5}, n(A)=3 → P = 3/6 = 1/2."],
  },
  {
    id: "g5",
    label: "Lempar 2 koin sekaligus. P(2 Angka) = …",
    kind: "fill",
    answers: ["1/4"],
    discussion: ["S = {AA,AG,GA,GG}, n(S)=4. A = {AA}, n(A)=1 → P = 1/4."],
  },
  {
    id: "g6",
    label: "Lempar 2 dadu. P(jumlah mata = 7) = …",
    kind: "fill",
    answers: ["1/6", "6/36"],
    discussion: ["n(S)=36, jumlah 7 ada 6 pasang → P = 6/36 = 1/6."],
  },
  {
    id: "g7",
    label: "Nilai peluang TERKECIL adalah …",
    kind: "choice",
    options: ["−1", "0", "0,5", "1"],
    correctIndex: 1,
    discussion: ["Peluang minimum = 0 (kejadian mustahil)."],
  },
  {
    id: "g8",
    label: "Nilai peluang TERBESAR adalah …",
    kind: "fill",
    answers: ["1"],
    discussion: ["Peluang maksimum = 1 (kejadian pasti)."],
  },
  {
    id: "g9",
    label: "Pernyataan: Peluang muncul mata 8 pada satu dadu = 0.",
    kind: "truefalse",
    correct: true,
    discussion: ["BENAR. Mata 8 tidak ada di dadu, jadi MUSTAHIL → P = 0."],
  },
  {
    id: "g10",
    label:
      "Dari 1 set kartu remi (52 kartu), P(kartu As) = …",
    kind: "fill",
    answers: ["1/13", "4/52"],
    discussion: ["Ada 4 kartu As dari 52 → P = 4/52 = 1/13."],
  },
  {
    id: "g11",
    label:
      "Pasangkan KEJADIAN dengan PELUANG-nya (1 dadu):",
    kind: "match",
    pairs: [
      { left: "Mata 6", right: "1/6" },
      { left: "Mata genap", right: "1/2" },
      { left: "Mata > 4", right: "1/3" },
      { left: "Mata = 7", right: "0" },
      { left: "Mata ≤ 6", right: "1" },
    ],
    discussion: ["Hitung n(A)/n(S) untuk masing-masing."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Rumus Peluang Teoretik",
    text: "P(A) = n(A) / n(S). Banyak titik sampel kejadian A dibagi banyak titik sampel ruang sampel.",
    tone: "cyan",
  },
  {
    title: "Rentang Nilai Peluang",
    text: "0 ≤ P(A) ≤ 1. P=0 berarti MUSTAHIL, P=1 berarti PASTI, P=0,5 berarti SAMA MUNGKIN.",
    tone: "violet",
  },
  {
    title: "Empirik vs Teoretik",
    text: "Peluang TEORETIK dihitung dari rumus. Peluang EMPIRIK dihitung dari eksperimen. Saat n besar, keduanya MENDEKAT.",
    tone: "emerald",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "teoretik-game-jenis",
    title: "🎯 Game 1 — Klasifikasi Peluang",
    description: "Seret tiap kejadian ke kategori peluang yang TEPAT!",
    buckets: [
      { id: "mustahil", label: "MUSTAHIL (P=0)", emoji: "❌", color: "rose" },
      { id: "kecil", label: "KECIL (0 < P < 0,5)", emoji: "🌱", color: "amber" },
      { id: "besar", label: "BESAR (0,5 < P < 1)", emoji: "📈", color: "emerald" },
      { id: "pasti", label: "PASTI (P=1)", emoji: "✅", color: "cyan" },
    ],
    items: [
      { id: "j1", label: "Mata dadu = 7", bucketId: "mustahil", emoji: "🎲" },
      { id: "j2", label: "Matahari terbit di timur", bucketId: "pasti", emoji: "☀️" },
      { id: "j3", label: "Mata dadu = 1 dari 1 dadu", bucketId: "kecil", emoji: "🎲" },
      { id: "j4", label: "Hujan bulan Desember (RI)", bucketId: "besar", emoji: "🌧️" },
      { id: "j5", label: "Sapi bisa terbang", bucketId: "mustahil", emoji: "🐄" },
      { id: "j6", label: "Kartu hati dari 52 kartu", bucketId: "kecil", emoji: "♥️" },
      { id: "j7", label: "Mata dadu ≤ 6", bucketId: "pasti", emoji: "🎲" },
      { id: "j8", label: "Lulus jika belajar tekun", bucketId: "besar", emoji: "📚" },
    ],
  },
  {
    kind: "arrow-match",
    id: "teoretik-game-hitung",
    title: "🎯 Game 2 — Hitung Peluang Cepat",
    description: "Pasangkan tiap kejadian dengan peluang teoretiknya. Tekan ◀ ▶.",
    rightOptions: ["1/6", "1/4", "1/3", "1/2", "2/3", "5/6"],
    pairs: [
      { id: "p1", left: "Dadu: mata 3", correctRight: "1/6", emoji: "🎲" },
      { id: "p2", left: "Dadu: mata > 2", correctRight: "2/3", emoji: "🎲" },
      { id: "p3", left: "Dadu: mata genap", correctRight: "1/2", emoji: "🎲" },
      { id: "p4", left: "Dadu: mata > 4", correctRight: "1/3", emoji: "🎲" },
      { id: "p5", left: "Dadu: mata < 6", correctRight: "5/6", emoji: "🎲" },
      { id: "p6", left: "2 koin: 2 Angka", correctRight: "1/4", emoji: "🪙" },
      { id: "p7", left: "2 koin: tepat 1 Angka", correctRight: "1/2", emoji: "🪙" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Lempar 1 dadu. P(mata bilangan ganjil) = …",
    kind: "fill",
    answers: ["1/2", "3/6", "0,5", "0.5"],
    hint: "Ganjil = {1,3,5}.",
    discussion: ["n(A)=3, n(S)=6 → P = 3/6 = 1/2."],
  },
  {
    id: "pp2",
    question:
      "Dari sebuah kotak berisi kelereng: 4 merah, 3 biru, 2 hijau, 1 kuning. P(kelereng MERAH) = …",
    kind: "fill",
    answers: ["2/5", "4/10", "0,4", "0.4"],
    hint: "Total 10 kelereng.",
    discussion: ["n(merah)=4, n(S)=10 → P = 4/10 = 2/5."],
  },
  {
    id: "pp3",
    question: "Lempar 2 dadu. P(jumlah mata = 8) = …",
    kind: "fill",
    answers: ["5/36"],
    hint: "Pasangan: (2,6),(3,5),(4,4),(5,3),(6,2).",
    discussion: ["Ada 5 pasang berjumlah 8 → P = 5/36."],
  },
  {
    id: "pp4",
    question:
      "Dari kartu bridge (52), P(kartu BUKAN As) = …",
    kind: "fill",
    answers: ["12/13", "48/52"],
    hint: "52 − 4 = 48.",
    discussion: ["P = 48/52 = 12/13."],
  },
  {
    id: "pp5",
    question:
      "Pernyataan: Jika P(A) = 0,3 maka peluang ini termasuk peluang BESAR.",
    kind: "truefalse",
    correct: false,
    hint: "0,3 < 0,5.",
    discussion: ["SALAH. P = 0,3 < 0,5 → tergolong peluang KECIL."],
  },
  {
    id: "pp6",
    question:
      "Dari 20 bola bernomor 1–20, P(nomor kelipatan 3) = …",
    kind: "fill",
    answers: ["3/10", "6/20", "0,3", "0.3"],
    hint: "Kelipatan 3 antara 1–20: {3,6,9,12,15,18}.",
    discussion: ["n(A)=6, n(S)=20 → P = 6/20 = 3/10."],
  },
  {
    id: "pp7",
    question: "Lempar 3 koin. P(ketiganya GAMBAR) = …",
    kind: "fill",
    answers: ["1/8"],
    hint: "n(S) = 2³.",
    discussion: ["Hanya 1 hasil GGG dari 8 → P = 1/8."],
  },
  {
    id: "pp8",
    question: "Lempar 2 dadu. P(kedua mata SAMA) = …",
    kind: "fill",
    answers: ["1/6", "6/36"],
    hint: "(1,1),(2,2),(3,3),(4,4),(5,5),(6,6).",
    discussion: ["6 pasang sama dari 36 → P = 6/36 = 1/6."],
  },
];

const PeluangTeoretikLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Peluang"
    title="Peluang Teoretik — Penemuan Terbimbing"
    intro="Sobat Numatik 🎲! Saatnya MENEMUKAN rumus PELUANG TEORETIK P(A) = n(A) / n(S). Kamu akan menghitung peluang dadu, koin, kartu, dan kelereng — lalu memahami mengapa nilai peluang selalu antara 0 dan 1!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan rumus peluang teoretik."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/peluang"
    backLabel="Kembali ke Menu Peluang"
    scoreMessages={{
      perfect: "🌟 Mantap! Rumus peluang sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Ulang lagi P(A) = n(A)/n(S).",
      low: "💪 Tetap semangat! Mulai dari kasus dadu sederhana.",
    }}
  />
);

export default PeluangTeoretikLKPDPage;
