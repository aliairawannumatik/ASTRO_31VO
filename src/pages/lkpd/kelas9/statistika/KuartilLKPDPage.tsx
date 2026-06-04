import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Data Membagi 4",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="25" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">11 data terurut: 2,3,4,5,6,7,8,9,10,11,12</text>
          {[2,3,4,5,6,7,8,9,10,11,12].map((n,i) => (
            <g key={i}>
              <rect x={10 + i * 24} y={50} width={20} height={28} rx={4}
                fill={i === 2 ? "#22d3ee" : i === 5 ? "#fbbf24" : i === 8 ? "#f472b6" : "#a78bfa"}
                fillOpacity="0.55"
                stroke="#c4b5fd"
                strokeWidth="1.5"
              />
              <text x={20 + i * 24} y={70} fontSize="10" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">{n}</text>
            </g>
          ))}
          <text x="58" y="98" fontSize="10" fill="#22d3ee" textAnchor="middle">Q₁=4</text>
          <text x="130" y="98" fontSize="10" fill="#fbbf24" textAnchor="middle">Q₂=7</text>
          <text x="202" y="98" fontSize="10" fill="#f472b6" textAnchor="middle">Q₃=10</text>
          <text x="140" y="125" fontSize="10" fill="#a7f3d0" textAnchor="middle">Q₁ membagi 25% data terbawah</text>
          <text x="140" y="142" fontSize="10" fill="#a7f3d0" textAnchor="middle">Q₂ = MEDIAN (50%)</text>
          <text x="140" y="159" fontSize="10" fill="#a7f3d0" textAnchor="middle">Q₃ membagi 75%</text>
          <text x="140" y="180" fontSize="11" fontWeight="bold" fill="#34d399" textAnchor="middle">Tiga kuartil membagi data → 4 bagian sama</text>
        </svg>
      </div>
    ),
    text:
      "KUARTIL membagi data terurut menjadi EMPAT bagian SAMA banyak. Q₁ = kuartil bawah (25%), Q₂ = median (50%), Q₃ = kuartil atas (75%). Pada 11 data terurut: Q₁=4, Q₂=7, Q₃=10.",
  },
  {
    title: "Situasi 2 — Cara Belah Median",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-700/20 border border-rose-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="25" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">8 data: 4, 5, 6, 7, 8, 9, 10, 11</text>
          <text x="140" y="50" fontSize="10" fill="#fde68a" textAnchor="middle">Cari Q₂ dulu (median)</text>
          <text x="140" y="68" fontSize="10" fill="#fbbf24" textAnchor="middle">n=8 genap → Q₂ = (7+8)/2 = 7,5</text>
          <line x1="140" y1="80" x2="140" y2="100" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 2" />
          <rect x="20" y="105" width="105" height="35" rx="6" fill="#22d3ee" fillOpacity="0.3" stroke="#67e8f9" strokeWidth="1.5" />
          <text x="73" y="125" fontSize="9" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">Bawah: 4,5,6,7</text>
          <text x="73" y="138" fontSize="10" fontWeight="bold" fill="#22d3ee" textAnchor="middle">Q₁ = (5+6)/2 = 5,5</text>
          <rect x="155" y="105" width="105" height="35" rx="6" fill="#f472b6" fillOpacity="0.3" stroke="#f9a8d4" strokeWidth="1.5" />
          <text x="208" y="125" fontSize="9" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">Atas: 8,9,10,11</text>
          <text x="208" y="138" fontSize="10" fontWeight="bold" fill="#f472b6" textAnchor="middle">Q₃ = (9+10)/2 = 9,5</text>
          <text x="140" y="170" fontSize="10" fontWeight="bold" fill="#34d399" textAnchor="middle">Strategi: belah dua → cari median tiap belahan</text>
        </svg>
      </div>
    ),
    text:
      "Strategi praktis: Pertama, cari Q₂ (median seluruh data). Kedua, BELAH data jadi dua bagian. Ketiga, Q₁ = median belahan bawah, Q₃ = median belahan atas.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Kuartil membagi data terurut menjadi … bagian sama banyak.",
    kind: "choice",
    options: ["2", "3", "4", "5"],
    correctIndex: 2,
    discussion: ["KUARTIL = empat bagian (kuartal)."],
  },
  {
    id: "g2",
    label:
      "Q₁ disebut kuartil … dan Q₃ disebut kuartil …",
    kind: "choice",
    options: [
      "atas; bawah",
      "bawah; atas",
      "tengah; sisi",
      "kanan; kiri",
    ],
    correctIndex: 1,
    discussion: [
      "Q₁ = kuartil BAWAH (25% terbawah).",
      "Q₃ = kuartil ATAS (75%).",
    ],
  },
  {
    id: "g3",
    label:
      "Q₂ sama dengan …",
    kind: "choice",
    options: ["modus", "rata-rata", "median", "jangkauan"],
    correctIndex: 2,
    discussion: ["Q₂ = MEDIAN (membagi data jadi 2 bagian sama)."],
  },
  {
    id: "g4",
    label:
      "Sebelum mencari Q₁, Q₂, Q₃, langkah PERTAMA adalah …",
    kind: "choice",
    options: [
      "menjumlahkan data",
      "MENGURUTKAN data dari kecil ke besar",
      "menghitung rata-rata",
      "membagi total dengan 4",
    ],
    correctIndex: 1,
    discussion: ["URUTKAN dulu! Sama seperti median."],
  },
  {
    id: "g5",
    label:
      "Data terurut: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12. Q₂ (median) = …",
    kind: "fill",
    answers: ["7"],
    discussion: ["n=11 ganjil → Q₂ = data ke-(11+1)/2 = ke-6 = 7."],
  },
  {
    id: "g6",
    label:
      "Pada data soal g5 (Q₂=7 di tengah), bagian BAWAH = {2,3,4,5,6}. Q₁ = median bagian bawah = …",
    kind: "fill",
    answers: ["4"],
    discussion: ["Median {2,3,4,5,6} = 4 (data ke-3)."],
  },
  {
    id: "g7",
    label:
      "Bagian ATAS = {8,9,10,11,12}. Q₃ = …",
    kind: "fill",
    answers: ["10"],
    discussion: ["Median {8,9,10,11,12} = 10."],
  },
  {
    id: "g8",
    label:
      "Data: 4, 5, 6, 7, 8, 9, 10, 11. n=8. Q₂ = …",
    kind: "fill",
    answers: ["7,5", "7.5"],
    discussion: ["n=8 → median = (data ke-4 + ke-5)/2 = (7+8)/2 = 7,5."],
  },
  {
    id: "g9",
    label:
      "Data soal g8: bagian BAWAH = {4,5,6,7}. Q₁ = …",
    kind: "fill",
    answers: ["5,5", "5.5"],
    discussion: ["Median {4,5,6,7} = (5+6)/2 = 5,5."],
  },
  {
    id: "g10",
    label:
      "Data soal g8: bagian ATAS = {8,9,10,11}. Q₃ = …",
    kind: "fill",
    answers: ["9,5", "9.5"],
    discussion: ["Median {8,9,10,11} = (9+10)/2 = 9,5."],
  },
  {
    id: "g11",
    label:
      "Pernyataan: Untuk data 9 yang sudah terurut, Q₁ adalah data ke-2.",
    kind: "truefalse",
    correct: false,
    discussion: [
      "SALAH. Pada n=9, Q₂ = ke-5. Bawah = {data ke-1..4}. Q₁ = median {a₁,a₂,a₃,a₄} = (a₂+a₃)/2.",
      "Q₁ ada DI ANTARA data ke-2 dan ke-3, BUKAN tepat data ke-2.",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan KUARTIL dengan PERSENTILNYA:",
    kind: "match",
    pairs: [
      { left: "Q₁", right: "25%" },
      { left: "Q₂ (Median)", right: "50%" },
      { left: "Q₃", right: "75%" },
      { left: "Q₃ − Q₁", right: "Jangkauan Interkuartil" },
    ],
    discussion: ["Hafal posisi kuartil 25-50-75% dan rumus JIK."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Pengertian Kuartil",
    text: "Kuartil membagi data terurut menjadi 4 bagian sama. Q₁ (25%) = kuartil bawah, Q₂ (50%) = median, Q₃ (75%) = kuartil atas.",
    tone: "cyan",
  },
  {
    title: "Cara Mencari Kuartil",
    text: "Strategi belah median: 1) Urutkan data. 2) Cari Q₂ (median). 3) Belah data jadi BAWAH dan ATAS. 4) Q₁ = median bawah, Q₃ = median atas.",
    tone: "violet",
  },
  {
    title: "Tips n Ganjil/Genap",
    text: "n ganjil & Q₂ = data tengah → bagian bawah/atas TIDAK termasuk Q₂. n genap → Q₂ = rata-rata 2 tengah, lalu langsung belah jadi dua bagian.",
    tone: "yellow",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "kuartil-game-istilah",
    title: "🎯 Game 1 — Cocokkan Kuartil (Seret!)",
    description: "Seret tiap istilah ke definisinya yang tepat.",
    buckets: [
      { id: "q1", label: "Q₁ (Bawah)", emoji: "📉", color: "cyan" },
      { id: "q2", label: "Q₂ (Median)", emoji: "🎯", color: "amber" },
      { id: "q3", label: "Q₃ (Atas)", emoji: "📈", color: "rose" },
      { id: "jik", label: "Q₃−Q₁ (JIK)", emoji: "📏", color: "emerald" },
    ],
    items: [
      { id: "k1", label: "25% data terbawah", bucketId: "q1", emoji: "📉" },
      { id: "k2", label: "Median (50%)", bucketId: "q2", emoji: "🎯" },
      { id: "k3", label: "75% data terbawah", bucketId: "q3", emoji: "📈" },
      { id: "k4", label: "Jarak Q₃ ke Q₁", bucketId: "jik", emoji: "📏" },
      { id: "k5", label: "Median bagian bawah", bucketId: "q1", emoji: "📉" },
      { id: "k6", label: "Median seluruh data", bucketId: "q2", emoji: "🎯" },
      { id: "k7", label: "Median bagian atas", bucketId: "q3", emoji: "📈" },
      { id: "k8", label: "Sebaran tengah 50%", bucketId: "jik", emoji: "📏" },
    ],
  },
  {
    kind: "arrow-match",
    id: "kuartil-game-hitung",
    title: "🎯 Game 2 — Hitung Kuartil",
    description: "Pasangkan tiap data dengan kuartil yang DIMINTA. Tekan ◀ ▶.",
    rightOptions: ["4", "5,5", "7", "7,5", "9,5", "10", "11"],
    pairs: [
      { id: "h1", left: "Q₁ dari 2,3,…,12 (n=11)", correctRight: "4", emoji: "📉" },
      { id: "h2", left: "Q₂ dari 2,3,…,12 (n=11)", correctRight: "7", emoji: "🎯" },
      { id: "h3", left: "Q₃ dari 2,3,…,12 (n=11)", correctRight: "10", emoji: "📈" },
      { id: "h4", left: "Q₁ dari 4,5,…,11 (n=8)", correctRight: "5,5", emoji: "📉" },
      { id: "h5", left: "Q₂ dari 4,5,…,11 (n=8)", correctRight: "7,5", emoji: "🎯" },
      { id: "h6", left: "Q₃ dari 4,5,…,11 (n=8)", correctRight: "9,5", emoji: "📈" },
      { id: "h7", left: "Q₃ dari 1,3,5,…,21 (n=11)", correctRight: "11", emoji: "📈" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question:
      "Data terurut: 3,5,7,9,11,13,15. Q₁ = …",
    kind: "fill",
    answers: ["5"],
    hint: "n=7. Q₂=9 (ke-4). Bawah {3,5,7}. Q₁ = median bawah.",
    discussion: ["Median {3,5,7} = 5."],
  },
  {
    id: "pp2",
    question:
      "Data terurut: 3,5,7,9,11,13,15. Q₃ = …",
    kind: "fill",
    answers: ["13"],
    hint: "Atas {11,13,15}. Q₃ = median atas.",
    discussion: ["Median {11,13,15} = 13."],
  },
  {
    id: "pp3",
    question:
      "Data terurut: 4,6,8,10,12,14. n=6. Q₁ = …",
    kind: "fill",
    answers: ["6"],
    hint: "Q₂ = (8+10)/2 = 9. Bawah {4,6,8}. Q₁ = 6.",
    discussion: ["Median {4,6,8} = 6."],
  },
  {
    id: "pp4",
    question:
      "Data soal pp3, Q₃ = …",
    kind: "fill",
    answers: ["12"],
    hint: "Atas {10,12,14}. Q₃ = 12.",
    discussion: ["Median {10,12,14} = 12."],
  },
  {
    id: "pp5",
    question:
      "Data terurut: 5,5,6,7,8,8,9. Q₂ = …",
    kind: "fill",
    answers: ["7"],
    hint: "n=7 ganjil. Posisi (7+1)/2 = ke-4.",
    discussion: ["Data ke-4 = 7."],
  },
  {
    id: "pp6",
    question:
      "Pernyataan: Q₂ adalah ukuran pemusatan, sedangkan JIK = Q₃ − Q₁ adalah ukuran penyebaran.",
    kind: "truefalse",
    correct: true,
    hint: "Q₂ = median = pusat.",
    discussion: ["BENAR. Q₂ = median (pusat). JIK = Q₃ − Q₁ (sebaran 50% tengah)."],
  },
  {
    id: "pp7",
    question:
      "Data: 60, 65, 70, 70, 75, 80, 85, 90, 95. n=9. Q₁ = …",
    kind: "fill",
    answers: ["67,5", "67.5"],
    hint: "Q₂ = ke-5 = 75. Bawah {60,65,70,70}. Q₁ = (65+70)/2.",
    discussion: ["Q₁ = (65+70)/2 = 67,5."],
  },
  {
    id: "pp8",
    question:
      "Data soal pp7: Q₃ = …",
    kind: "fill",
    answers: ["87,5", "87.5"],
    hint: "Atas {80,85,90,95}. Q₃ = (85+90)/2.",
    discussion: ["Q₃ = (85+90)/2 = 87,5."],
  },
];

const KuartilLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Statistika"
    title="Kuartil — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo selami KUARTIL 📐! Kamu akan menemukan Q₁ (25%), Q₂ (50% = median), dan Q₃ (75%) yang membagi data jadi 4 bagian sama — sambil bermain seret kartu mencocokkan istilah & menghitung kuartil!"
    situations={situations}
    guidedIntro="Jawab berurutan. Pelajari strategi belah median untuk menemukan Q₁ dan Q₃."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/statistika"
    backLabel="Kembali ke Menu Statistika"
    scoreMessages={{
      perfect: "🌟 Mantap! Kuartil sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Pelajari ulang strategi belah median.",
      low: "💪 Tetap semangat! Mulai dari MENGURUTKAN data.",
    }}
  />
);

export default KuartilLKPDPage;
