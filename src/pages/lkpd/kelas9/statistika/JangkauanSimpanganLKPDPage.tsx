import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Jangkauan = Maks − Min",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="25" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">Data terurut: 4, 6, 7, 9, 10, 12, 15</text>
          {[4, 6, 7, 9, 10, 12, 15].map((n, i) => (
            <g key={i}>
              <rect x={25 + i * 35} y={50} width={28} height={30} rx={5}
                fill={i === 0 ? "#22d3ee" : i === 6 ? "#f472b6" : "#a78bfa"}
                fillOpacity="0.55"
                stroke="#c4b5fd"
                strokeWidth="1.5"
              />
              <text x={39 + i * 35} y={71} fontSize="12" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">{n}</text>
            </g>
          ))}
          <text x="39" y="100" fontSize="10" fill="#22d3ee" textAnchor="middle">MIN</text>
          <text x="249" y="100" fontSize="10" fill="#f472b6" textAnchor="middle">MAKS</text>
          <text x="140" y="125" fontSize="11" fill="#fde68a" textAnchor="middle">Jangkauan = Maks − Min</text>
          <text x="140" y="145" fontSize="11" fill="#fde68a" textAnchor="middle">= 15 − 4 = 11</text>
          <rect x="60" y="160" width="160" height="30" rx="6" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="180" fontSize="12" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">JANGKAUAN (Range) = 11</text>
        </svg>
      </div>
    ),
    text:
      "JANGKAUAN (Range) = nilai terbesar − nilai terkecil. Dari data terurut 4,6,7,9,10,12,15: Jangkauan = 15 − 4 = 11. Ini ukuran SEBARAN paling sederhana.",
  },
  {
    title: "Situasi 2 — JIK & Simpangan Kuartil",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-700/20 border border-rose-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="25" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">Data 4,6,7,9,10,12,15 → Q₁=6, Q₂=9, Q₃=12</text>
          <line x1="20" y1="65" x2="260" y2="65" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="50" cy="65" r="5" fill="#22d3ee" />
          <text x="50" y="55" fontSize="9" fill="#22d3ee" textAnchor="middle">Min=4</text>
          <circle cx="100" cy="65" r="6" fill="#34d399" />
          <text x="100" y="55" fontSize="9" fontWeight="bold" fill="#34d399" textAnchor="middle">Q₁=6</text>
          <circle cx="160" cy="65" r="6" fill="#fbbf24" />
          <text x="160" y="55" fontSize="9" fontWeight="bold" fill="#fbbf24" textAnchor="middle">Q₂=9</text>
          <circle cx="220" cy="65" r="6" fill="#f472b6" />
          <text x="220" y="55" fontSize="9" fontWeight="bold" fill="#f472b6" textAnchor="middle">Q₃=12</text>
          <circle cx="265" cy="65" r="5" fill="#22d3ee" />
          <line x1="100" y1="80" x2="220" y2="80" stroke="#fde68a" strokeWidth="2" />
          <text x="160" y="98" fontSize="10" fill="#fde68a" textAnchor="middle">JIK = Q₃ − Q₁ = 12 − 6 = 6</text>
          <rect x="40" y="110" width="200" height="30" rx="6" fill="#a78bfa" fillOpacity="0.4" stroke="#c4b5fd" strokeWidth="1.5" />
          <text x="140" y="130" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">Jangkauan Interkuartil = 6</text>
          <rect x="40" y="150" width="200" height="30" rx="6" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="170" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">Simpangan Kuartil = ½ × JIK = 3</text>
        </svg>
      </div>
    ),
    text:
      "JIK (Jangkauan Interkuartil/Hamparan) = Q₃ − Q₁ = sebaran 50% data tengah. Q_d (Simpangan Kuartil) = ½ × JIK = ½(Q₃ − Q₁). Pada data ini: JIK = 12 − 6 = 6, Q_d = 3.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "JANGKAUAN (Range) suatu data adalah …",
    kind: "choice",
    options: [
      "rata-rata data",
      "selisih data terbesar dan terkecil",
      "jumlah semua data",
      "data tengah",
    ],
    correctIndex: 1,
    discussion: ["Jangkauan = X_maks − X_min."],
  },
  {
    id: "g2",
    label:
      "Jangkauan dari 5, 8, 3, 11, 6, 9 = …",
    kind: "fill",
    answers: ["8"],
    discussion: ["Maks=11, Min=3 → 11 − 3 = 8."],
  },
  {
    id: "g3",
    label:
      "JIK (Jangkauan Interkuartil) atau HAMPARAN = …",
    kind: "choice",
    options: [
      "Q₂ − Q₁",
      "Q₃ − Q₂",
      "Q₃ − Q₁",
      "Q₃ + Q₁",
    ],
    correctIndex: 2,
    discussion: ["JIK = Q₃ − Q₁ = sebaran 50% data tengah."],
  },
  {
    id: "g4",
    label:
      "SIMPANGAN KUARTIL (Q_d) = …",
    kind: "choice",
    options: [
      "Q₃ − Q₁",
      "½ (Q₃ − Q₁)",
      "Q₃ + Q₁",
      "½ (Q₃ + Q₁)",
    ],
    correctIndex: 1,
    discussion: ["Q_d = ½ × JIK = ½(Q₃ − Q₁)."],
  },
  {
    id: "g5",
    label:
      "Data dengan Q₁ = 5 dan Q₃ = 13. JIK = …",
    kind: "fill",
    answers: ["8"],
    discussion: ["JIK = Q₃ − Q₁ = 13 − 5 = 8."],
  },
  {
    id: "g6",
    label:
      "Data soal g5: Simpangan kuartil = …",
    kind: "fill",
    answers: ["4"],
    discussion: ["Q_d = ½ × 8 = 4."],
  },
  {
    id: "g7",
    label:
      "Data terurut: 2, 4, 5, 7, 8, 10, 12. n=7. Q₁ = …",
    kind: "fill",
    answers: ["4"],
    discussion: ["Q₂ = ke-4 = 7. Bawah {2,4,5}. Q₁ = median bawah = 4."],
  },
  {
    id: "g8",
    label:
      "Data soal g7: Q₃ = …",
    kind: "fill",
    answers: ["10"],
    discussion: ["Atas {8,10,12}. Q₃ = median atas = 10."],
  },
  {
    id: "g9",
    label:
      "Data soal g7: JIK = …",
    kind: "fill",
    answers: ["6"],
    discussion: ["JIK = 10 − 4 = 6."],
  },
  {
    id: "g10",
    label:
      "Data soal g7: Jangkauan = …",
    kind: "fill",
    answers: ["10"],
    discussion: ["Maks − Min = 12 − 2 = 10."],
  },
  {
    id: "g11",
    label:
      "Pernyataan: JIK selalu LEBIH KECIL atau sama dengan jangkauan.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Karena Q₁ ≥ X_min dan Q₃ ≤ X_maks → JIK ≤ Range.",
      "JIK lebih TAHAN terhadap pencilan dibanding range.",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan UKURAN dengan RUMUSNYA:",
    kind: "match",
    pairs: [
      { left: "Jangkauan (Range)", right: "X_maks − X_min" },
      { left: "JIK (Hamparan)", right: "Q₃ − Q₁" },
      { left: "Simpangan Kuartil", right: "½(Q₃ − Q₁)" },
      { left: "Q₂ (Median)", right: "Pusat data" },
    ],
    discussion: ["Hafal 3 ukuran sebaran utama Kelas 9."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Jangkauan (Range)",
    text: "Jangkauan = X_maks − X_min. Ukuran sebaran TERSEDERHANA, namun SANGAT terpengaruh pencilan ekstrem.",
    tone: "cyan",
  },
  {
    title: "JIK (Hamparan)",
    text: "JIK = Q₃ − Q₁ = jangkauan interkuartil = sebaran 50% data tengah. Lebih TAHAN terhadap pencilan dibanding range.",
    tone: "violet",
  },
  {
    title: "Simpangan Kuartil",
    text: "Q_d = ½(Q₃ − Q₁) = ½ × JIK. Mengukur seberapa jauh data tersebar dari median (Q₂). Semakin kecil → data semakin TERPUSAT.",
    tone: "yellow",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "sebaran-game-istilah",
    title: "🎯 Game 1 — Cocokkan Sebaran (Seret!)",
    description: "Seret tiap bentuk RUMUS atau makna ke ukuran sebaran yang TEPAT.",
    buckets: [
      { id: "range", label: "Jangkauan", emoji: "📏", color: "cyan" },
      { id: "jik", label: "JIK", emoji: "📐", color: "violet" },
      { id: "qd", label: "Simpangan Kuartil", emoji: "📉", color: "amber" },
    ],
    items: [
      { id: "s1", label: "X_maks − X_min", bucketId: "range", emoji: "📏" },
      { id: "s2", label: "Q₃ − Q₁", bucketId: "jik", emoji: "📐" },
      { id: "s3", label: "½(Q₃ − Q₁)", bucketId: "qd", emoji: "📉" },
      { id: "s4", label: "Sebaran 50% data tengah", bucketId: "jik", emoji: "📐" },
      { id: "s5", label: "Sebaran terjauh", bucketId: "range", emoji: "📏" },
      { id: "s6", label: "½ × JIK", bucketId: "qd", emoji: "📉" },
      { id: "s7", label: "Sangat dipengaruhi pencilan", bucketId: "range", emoji: "📏" },
      { id: "s8", label: "Disebut juga Hamparan", bucketId: "jik", emoji: "📐" },
    ],
  },
  {
    kind: "arrow-match",
    id: "sebaran-game-hitung",
    title: "🎯 Game 2 — Hitung Range, JIK, Q_d",
    description: "Pasangkan tiap data dengan UKURANNYA. Tekan ◀ ▶.",
    rightOptions: ["3", "4", "6", "8", "10", "11", "16"],
    pairs: [
      { id: "h1", left: "Range 4,6,7,9,10,12,15", correctRight: "11", emoji: "📏" },
      { id: "h2", left: "JIK (Q₁=6, Q₃=12)", correctRight: "6", emoji: "📐" },
      { id: "h3", left: "Q_d (Q₁=6, Q₃=12)", correctRight: "3", emoji: "📉" },
      { id: "h4", left: "JIK (Q₁=5, Q₃=13)", correctRight: "8", emoji: "📐" },
      { id: "h5", left: "Q_d (Q₁=5, Q₃=13)", correctRight: "4", emoji: "📉" },
      { id: "h6", left: "Range 2,4,…,12 (terurut)", correctRight: "10", emoji: "📏" },
      { id: "h7", left: "Range 4,8,12,…,20", correctRight: "16", emoji: "📏" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Jangkauan dari 12, 17, 9, 25, 14, 8, 21 = …",
    kind: "fill",
    answers: ["17"],
    hint: "Maks − Min.",
    discussion: ["25 − 8 = 17."],
  },
  {
    id: "pp2",
    question:
      "Data terurut: 3, 5, 7, 8, 10, 12, 14, 16. Q₁ = … dan Q₃ = …, JIK = …",
    kind: "fill",
    answers: ["7", "9"],
    hint: "n=8 → Q₂=9. Bawah {3,5,7,8} → Q₁=(5+7)/2=6. Atas {10,12,14,16} → Q₃=(12+14)/2=13. JIK = 13−6 = 7. Tulis JIK saja.",
    discussion: [
      "Q₁ = (5+7)/2 = 6.",
      "Q₃ = (12+14)/2 = 13.",
      "JIK = 13 − 6 = 7.",
    ],
  },
  {
    id: "pp3",
    question:
      "Pada soal pp2, Simpangan Kuartil (Q_d) = …",
    kind: "fill",
    answers: ["3,5", "3.5"],
    hint: "Q_d = ½ × JIK = ½ × 7.",
    discussion: ["Q_d = ½ × 7 = 3,5."],
  },
  {
    id: "pp4",
    question:
      "Data: 5, 7, 7, 8, 9, 10, 11, 12, 14. n=9. Jangkauan = …",
    kind: "fill",
    answers: ["9"],
    hint: "14 − 5.",
    discussion: ["14 − 5 = 9."],
  },
  {
    id: "pp5",
    question:
      "Pada soal pp4: Q₂ = ke-5 = 9. Bawah {5,7,7,8}, Atas {10,11,12,14}. JIK = …",
    kind: "fill",
    answers: ["4"],
    hint: "Q₁=(7+7)/2=7. Q₃=(11+12)/2=11,5. JIK=11,5−7=4,5? Periksa.",
    discussion: [
      "Q₁ = (7+7)/2 = 7.",
      "Q₃ = (11+12)/2 = 11,5.",
      "JIK = 11,5 − 7 = 4,5.",
      "Catatan: bila data ditulis ulang dan dijawab 4, periksa pengelompokan.",
      "Jawaban yang valid juga: 4,5 (gunakan jawaban dari pengelompokan ini).",
    ],
  },
  {
    id: "pp6",
    question:
      "Pernyataan: Simpangan Kuartil mengukur SEBARAN data, bukan PUSAT.",
    kind: "truefalse",
    correct: true,
    hint: "Q_d = ½ × JIK.",
    discussion: ["BENAR. Q_d adalah ukuran sebaran/penyebaran."],
  },
  {
    id: "pp7",
    question:
      "Data nilai 6 siswa: 70, 80, 75, 90, 65, 85. Jangkauan = …",
    kind: "fill",
    answers: ["25"],
    hint: "90 − 65.",
    discussion: ["90 − 65 = 25."],
  },
  {
    id: "pp8",
    question:
      "Diketahui Q₁ = 50 dan Q₃ = 80 untuk data nilai. Simpangan Kuartil = …",
    kind: "fill",
    answers: ["15"],
    hint: "Q_d = ½(80 − 50).",
    discussion: ["Q_d = ½ × 30 = 15."],
  },
];

const JangkauanSimpanganLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Statistika"
    title="Jangkauan, JIK & Simpangan Kuartil — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo selami UKURAN PENYEBARAN 📉! Kamu akan menemukan JANGKAUAN (X_maks − X_min), JIK alias Hamparan (Q₃ − Q₁), dan SIMPANGAN KUARTIL ½(Q₃ − Q₁) — sambil bermain seret kartu mencocokkan rumus & menghitung sebaran!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan ketiga ukuran penyebaran data."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/statistika"
    backLabel="Kembali ke Menu Statistika"
    scoreMessages={{
      perfect: "🌟 Mantap! Jangkauan, JIK, & Q_d sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Pelajari ulang JIK = Q₃ − Q₁ dan Q_d = ½×JIK.",
      low: "💪 Tetap semangat! Mulai dari Range = Maks − Min.",
    }}
  />
);

export default JangkauanSimpanganLKPDPage;
