import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Median Data Ganjil",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="25" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">7 data: 5, 7, 8, 6, 9, 4, 10</text>
          <text x="140" y="45" fontSize="9" fill="#fde68a" textAnchor="middle">Urutkan dahulu!</text>
          {[4, 5, 6, 7, 8, 9, 10].map((n, i) => (
            <g key={i}>
              <rect x={20 + i * 35} y={60} width={30} height={30} rx={5}
                fill={i === 3 ? "#fbbf24" : "#34d399"}
                fillOpacity="0.55"
                stroke={i === 3 ? "#fde68a" : "#6ee7b7"}
                strokeWidth="1.5"
              />
              <text x={35 + i * 35} y={80} fontSize="13" fontWeight="bold" fill="#fff" textAnchor="middle">{n}</text>
            </g>
          ))}
          <text x="140" y="115" fontSize="10" fill="#fbbf24" textAnchor="middle">Data tengah (urutan ke-4) = 7</text>
          <text x="140" y="140" fontSize="11" fontWeight="bold" fill="#34d399" textAnchor="middle">MEDIAN = 7</text>
          <text x="140" y="165" fontSize="9" fill="#a7f3d0" textAnchor="middle">Posisi median: data ke-(n+1)/2</text>
          <text x="140" y="180" fontSize="9" fill="#a7f3d0" textAnchor="middle">= (7+1)/2 = ke-4</text>
        </svg>
      </div>
    ),
    text:
      "Untuk MEDIAN: URUTKAN data dulu, lalu pilih nilai TENGAH. Pada 7 data ganjil, median = data urutan ke-(n+1)/2 = ke-4 = 7.",
  },
  {
    title: "Situasi 2 — Modus & Median Genap",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-rose-500/20 to-fuchsia-700/20 border border-rose-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="25" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">8 data terurut: 4, 5, 6, 7, 8, 9, 10, 10</text>
          {[4, 5, 6, 7, 8, 9, 10, 10].map((n, i) => (
            <g key={i}>
              <rect x={10 + i * 32} y={50} width={28} height={28} rx={5}
                fill={i === 3 || i === 4 ? "#fbbf24" : (n === 10 ? "#f472b6" : "#a78bfa")}
                fillOpacity="0.55"
                stroke="#c4b5fd"
                strokeWidth="1.5"
              />
              <text x={24 + i * 32} y={70} fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">{n}</text>
            </g>
          ))}
          <text x="140" y="100" fontSize="10" fill="#fbbf24" textAnchor="middle">Data ke-4 = 7, ke-5 = 8</text>
          <text x="140" y="115" fontSize="11" fontWeight="bold" fill="#fbbf24" textAnchor="middle">MEDIAN = (7+8)/2 = 7,5</text>
          <text x="140" y="145" fontSize="10" fill="#f9a8d4" textAnchor="middle">Nilai 10 muncul 2x (terbanyak)</text>
          <text x="140" y="165" fontSize="11" fontWeight="bold" fill="#f472b6" textAnchor="middle">MODUS = 10</text>
        </svg>
      </div>
    ),
    text:
      "Pada 8 data genap, MEDIAN = rata-rata dua data tengah (ke-4 dan ke-5). MODUS = nilai yang muncul PALING SERING. Bisa tidak ada modus, satu, atau lebih.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "MEDIAN adalah nilai … setelah data DIURUTKAN.",
    kind: "choice",
    options: [
      "yang paling sering muncul",
      "yang berada di TENGAH",
      "yang paling kecil",
      "yang paling besar",
    ],
    correctIndex: 1,
    discussion: ["Median = data tengah (setelah diurutkan)."],
  },
  {
    id: "g2",
    label:
      "Sebelum mencari median, langkah PERTAMA adalah …",
    kind: "choice",
    options: [
      "menjumlahkan data",
      "mengurutkan dari kecil ke besar",
      "membagi data dua",
      "mencari modus",
    ],
    correctIndex: 1,
    discussion: ["URUTKAN dulu! Tanpa diurutkan, median tidak benar."],
  },
  {
    id: "g3",
    label:
      "Untuk n data GANJIL, posisi median = data ke- …",
    kind: "choice",
    options: ["n/2", "(n+1)/2", "n/2 + 1", "n − 1"],
    correctIndex: 1,
    discussion: [
      "n ganjil → posisi (n+1)/2.",
      "Misal n=7 → ke-4. n=9 → ke-5.",
    ],
  },
  {
    id: "g4",
    label:
      "Untuk n data GENAP, median = rata-rata data ke-(n/2) dan ke-(n/2 + 1).",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Misal n=8 → median = (data ke-4 + data ke-5) / 2.",
    ],
  },
  {
    id: "g5",
    label:
      "Median data 3, 5, 7, 9, 11 = …",
    kind: "fill",
    answers: ["7"],
    discussion: ["Sudah terurut, n=5 ganjil. Posisi (5+1)/2 = ke-3 = 7."],
  },
  {
    id: "g6",
    label:
      "Median data 4, 6, 8, 10 (sudah terurut) = …",
    kind: "fill",
    answers: ["7"],
    discussion: ["n=4 genap. Median = (data ke-2 + ke-3)/2 = (6+8)/2 = 7."],
  },
  {
    id: "g7",
    label:
      "MODUS adalah nilai yang … paling … dalam suatu data.",
    kind: "choice",
    options: [
      "muncul; sering",
      "tengah; tepat",
      "rata-rata; akurat",
      "kecil; sering",
    ],
    correctIndex: 0,
    discussion: ["Modus = nilai dengan FREKUENSI TERTINGGI."],
  },
  {
    id: "g8",
    label:
      "Modus data 4, 5, 5, 6, 7, 8, 8, 8, 9 = …",
    kind: "fill",
    answers: ["8"],
    discussion: ["8 muncul 3 kali (paling sering)."],
  },
  {
    id: "g9",
    label:
      "Pernyataan: Setiap kumpulan data PASTI memiliki tepat SATU modus.",
    kind: "truefalse",
    correct: false,
    discussion: [
      "SALAH. Bisa: tidak ada modus (semua frekuensinya sama), 1 modus (unimodal), atau lebih (bimodal/multimodal).",
    ],
  },
  {
    id: "g10",
    label:
      "Data 2, 3, 4, 5, 6 → Modus = …",
    kind: "fill",
    answers: ["tidak ada", "-", "tidak ada modus", "—", "kosong"],
    discussion: [
      "Setiap nilai muncul SATU kali → tidak ada modus.",
    ],
  },
  {
    id: "g11",
    label:
      "Data 5, 5, 6, 7, 7, 8 memiliki modus = …",
    kind: "fill",
    answers: ["5 dan 7", "5,7", "5 & 7", "5 dan 7 (bimodal)"],
    discussion: ["Dua nilai (5 dan 7) sama-sama muncul 2 kali → BIMODAL."],
  },
  {
    id: "g12",
    label: "Pasangkan situasi dengan ukuran TERBAIK menggambarkan pusat:",
    kind: "match",
    pairs: [
      { left: "Data ada PENCILAN ekstrem", right: "Median (lebih tahan)" },
      { left: "Data kategori (warna/hobi)", right: "Modus" },
      { left: "Data simetris tanpa pencilan", right: "Rata-rata" },
      { left: "Mode angkutan terbanyak", right: "Modus" },
    ],
    discussion: [
      "Median lebih tahan terhadap pencilan.",
      "Modus untuk data kategori.",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Median",
    text: "URUTKAN dulu! n ganjil: median = data ke-(n+1)/2. n genap: median = rata-rata data ke-(n/2) dan ke-(n/2+1).",
    tone: "emerald",
  },
  {
    title: "Modus",
    text: "MODUS = nilai dengan frekuensi TERBESAR. Bisa tidak ada modus (semua sama), 1 modus (unimodal), 2 modus (bimodal), atau lebih.",
    tone: "rose",
  },
  {
    title: "Kapan Pakai Apa?",
    text: "Mean: untuk data numerik tanpa pencilan. Median: tahan pencilan ekstrem. Modus: untuk data kategori atau yang sering muncul.",
    tone: "yellow",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "median-modus-game",
    title: "🎯 Game 1 — Cari Ukuran Pusat (Seret!)",
    description: "Seret tiap kumpulan data ke MEDIAN atau MODUS-nya yang BENAR.",
    buckets: [
      { id: "m5", label: "= 5", emoji: "5️⃣", color: "cyan" },
      { id: "m6", label: "= 6", emoji: "6️⃣", color: "amber" },
      { id: "m7", label: "= 7", emoji: "7️⃣", color: "emerald" },
      { id: "m8", label: "= 8", emoji: "8️⃣", color: "rose" },
    ],
    items: [
      { id: "x1", label: "Median 3,5,7,9,11", bucketId: "m7", emoji: "🎯" },
      { id: "x2", label: "Modus 4,5,5,6,7", bucketId: "m5", emoji: "📍" },
      { id: "x3", label: "Modus 6,6,6,7,8", bucketId: "m6", emoji: "📍" },
      { id: "x4", label: "Median 4,6,8,10 (genap)", bucketId: "m7", emoji: "🎯" },
      { id: "x5", label: "Modus 7,7,8,9,9,9", bucketId: "m8", emoji: "📍" },
      { id: "x6", label: "Median 5,5,6,6,7", bucketId: "m6", emoji: "🎯" },
      { id: "x7", label: "Modus 5,5,6,7,8", bucketId: "m5", emoji: "📍" },
      { id: "x8", label: "Median 3,5,7,9,11,13,15 → ke-4", bucketId: "m7", emoji: "🎯" },
    ],
  },
  {
    kind: "arrow-match",
    id: "median-modus-game-mix",
    title: "🎯 Game 2 — Median atau Modus?",
    description: "Pasangkan tiap data dengan UKURANNYA. Tekan ◀ ▶.",
    rightOptions: ["Median = 6", "Median = 7", "Median = 7,5", "Modus = 5", "Modus = 7", "Modus = 8", "Tidak ada modus"],
    pairs: [
      { id: "z1", left: "Modus 5,5,5,6,7,8", correctRight: "Modus = 5", emoji: "📍" },
      { id: "z2", left: "Median 4,6,8 (terurut)", correctRight: "Median = 6", emoji: "🎯" },
      { id: "z3", left: "Median 5,7,9 (terurut)", correctRight: "Median = 7", emoji: "🎯" },
      { id: "z4", left: "Median 6,7,8,9 (genap)", correctRight: "Median = 7,5", emoji: "🎯" },
      { id: "z5", left: "Modus 1,2,3,4,5", correctRight: "Tidak ada modus", emoji: "📍" },
      { id: "z6", left: "Modus 6,7,7,7,8,9", correctRight: "Modus = 7", emoji: "📍" },
      { id: "z7", left: "Modus 7,8,8,8,9,10", correctRight: "Modus = 8", emoji: "📍" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Median data 12, 15, 13, 17, 11 = …",
    kind: "fill",
    answers: ["13"],
    hint: "Urutkan dulu: 11,12,13,15,17. Ke-3.",
    discussion: ["Posisi (5+1)/2 = ke-3 = 13."],
  },
  {
    id: "pp2",
    question: "Median data 6, 8, 10, 12, 14, 16 = …",
    kind: "fill",
    answers: ["11"],
    hint: "n=6 genap. (data ke-3 + ke-4)/2.",
    discussion: ["(10 + 12)/2 = 11."],
  },
  {
    id: "pp3",
    question: "Modus data 7, 8, 8, 9, 9, 9, 10 = …",
    kind: "fill",
    answers: ["9"],
    hint: "Frekuensi terbanyak.",
    discussion: ["9 muncul 3 kali."],
  },
  {
    id: "pp4",
    question: "Modus data 3, 4, 4, 5, 5, 6 = …",
    kind: "fill",
    answers: ["4 dan 5", "4,5", "4 & 5", "bimodal", "4 dan 5 (bimodal)"],
    hint: "BIMODAL.",
    discussion: ["4 dan 5 sama-sama muncul 2 kali."],
  },
  {
    id: "pp5",
    question: "Tabel: nilai 6(f=2), 7(f=4), 8(f=8), 9(f=4), 10(f=2). Modus = …",
    kind: "fill",
    answers: ["8"],
    hint: "Frekuensi tertinggi pada nilai berapa?",
    discussion: ["Nilai 8 dengan f=8 (tertinggi)."],
  },
  {
    id: "pp6",
    question:
      "Pernyataan: Median 8 angka 1, 2, 3, 4, 5, 6, 7, 8 adalah 4.",
    kind: "truefalse",
    correct: false,
    hint: "n=8 genap → (data ke-4 + ke-5)/2.",
    discussion: ["Median = (4 + 5)/2 = 4,5. JAWABAN SOAL TIDAK 4."],
  },
  {
    id: "pp7",
    question:
      "Median data nilai 5,6,6,7,7,7,8,8,9,10 (sudah terurut) = …",
    kind: "fill",
    answers: ["7"],
    hint: "n=10 genap. (ke-5 + ke-6)/2.",
    discussion: ["(7 + 7)/2 = 7."],
  },
  {
    id: "pp8",
    question:
      "Tabel: 6(f=3), 7(f=5), 8(f=7), 9(f=3), 10(f=2). Total siswa 20. Median = data ke-10 dan ke-11. Median = …",
    kind: "fill",
    answers: ["8"],
    hint: "Hitung kumulatif: 3, 8, 15, 18, 20. Data ke-10 dan ke-11 ada di nilai 8.",
    discussion: ["Kumulatif: ≤6→3, ≤7→8, ≤8→15. Data ke-9–15 = 8. Ke-10 & ke-11 = 8. Median = (8+8)/2 = 8."],
  },
];

const MedianModusLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Statistika"
    title="Median & Modus — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo selami MEDIAN 🎯 dan MODUS 📍! Kamu akan menemukan cara mencari nilai TENGAH (median) untuk data ganjil & genap, dan nilai TERSERING (modus) — sambil bermain seret kartu mencocokkan!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan rumus median dan cara menentukan modus."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/statistika"
    backLabel="Kembali ke Menu Statistika"
    scoreMessages={{
      perfect: "🌟 Mantap! Median & modus sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Pelajari ulang posisi median data ganjil/genap.",
      low: "💪 Tetap semangat! Mulai dari MENGURUTKAN data.",
    }}
  />
);

export default MedianModusLKPDPage;
