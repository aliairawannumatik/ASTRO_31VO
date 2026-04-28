import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Lempar Sebuah Koin",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-700/20 border border-amber-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="25" fontSize="12" fontWeight="bold" fill="#fde68a" textAnchor="middle">Eksperimen: Lempar 1 Koin</text>
          <circle cx="90" cy="95" r="40" fill="#fbbf24" stroke="#fde68a" strokeWidth="2.5" />
          <text x="90" y="102" fontSize="22" fontWeight="bold" fill="#1f2937" textAnchor="middle">A</text>
          <text x="90" y="150" fontSize="11" fill="#fff" textAnchor="middle">Angka (A)</text>
          <circle cx="190" cy="95" r="40" fill="#9ca3af" stroke="#e5e7eb" strokeWidth="2.5" />
          <text x="190" y="102" fontSize="22" fontWeight="bold" fill="#1f2937" textAnchor="middle">G</text>
          <text x="190" y="150" fontSize="11" fill="#fff" textAnchor="middle">Gambar (G)</text>
          <text x="140" y="180" fontSize="12" fontWeight="bold" fill="#34d399" textAnchor="middle">S = {"{ A , G }"} → n(S) = 2</text>
        </svg>
      </div>
    ),
    text:
      "Saat melempar 1 koin, hasil yang MUNGKIN muncul hanyalah Angka (A) atau Gambar (G). Himpunan SEMUA hasil yang mungkin disebut RUANG SAMPEL (S). Setiap anggotanya disebut TITIK SAMPEL.",
  },
  {
    title: "Situasi 2 — Lempar Sebuah Dadu",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="25" fontSize="12" fontWeight="bold" fill="#67e8f9" textAnchor="middle">Eksperimen: Lempar 1 Dadu</text>
          {[1, 2, 3, 4, 5, 6].map((n, i) => (
            <g key={n}>
              <rect x={20 + i * 42} y={55} width={36} height={36} rx={6} fill="#22d3ee" fillOpacity="0.4" stroke="#67e8f9" strokeWidth="1.5" />
              <text x={38 + i * 42} y={80} fontSize="16" fontWeight="bold" fill="#fff" textAnchor="middle">{n}</text>
            </g>
          ))}
          <text x="140" y="125" fontSize="11" fill="#fde68a" textAnchor="middle">Mata dadu = 1, 2, 3, 4, 5, 6</text>
          <rect x="50" y="145" width="180" height="40" rx="8" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="170" fontSize="12" fontWeight="bold" fill="#fff" textAnchor="middle">S = {"{1,2,3,4,5,6}"} → n(S) = 6</text>
        </svg>
      </div>
    ),
    text:
      "Sebuah dadu memiliki 6 sisi bermata 1 sampai 6. Ruang sampelnya S = {1, 2, 3, 4, 5, 6} dengan banyak titik sampel n(S) = 6. KEJADIAN adalah bagian dari ruang sampel — misal kejadian 'mata genap' = {2, 4, 6}.",
  },
  {
    title: "Situasi 3 — Lempar 2 Koin (Diagram Pohon)",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 280 220" className="w-full">
          <rect width="280" height="220" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="11" fontWeight="bold" fill="#a7f3d0" textAnchor="middle">Diagram Pohon — 2 Koin</text>
          <circle cx="140" cy="45" r="14" fill="#fbbf24" />
          <text x="140" y="50" fontSize="10" fontWeight="bold" fill="#1f2937" textAnchor="middle">koin1</text>
          <line x1="140" y1="60" x2="80" y2="100" stroke="#a7f3d0" strokeWidth="1.5" />
          <line x1="140" y1="60" x2="200" y2="100" stroke="#a7f3d0" strokeWidth="1.5" />
          <text x="100" y="85" fontSize="10" fill="#fde68a">A</text>
          <text x="180" y="85" fontSize="10" fill="#fde68a">G</text>
          <circle cx="80" cy="115" r="12" fill="#22d3ee" />
          <text x="80" y="120" fontSize="10" fontWeight="bold" fill="#1f2937" textAnchor="middle">k2</text>
          <circle cx="200" cy="115" r="12" fill="#22d3ee" />
          <text x="200" y="120" fontSize="10" fontWeight="bold" fill="#1f2937" textAnchor="middle">k2</text>
          <line x1="80" y1="127" x2="50" y2="160" stroke="#a7f3d0" strokeWidth="1.5" />
          <line x1="80" y1="127" x2="110" y2="160" stroke="#a7f3d0" strokeWidth="1.5" />
          <line x1="200" y1="127" x2="170" y2="160" stroke="#a7f3d0" strokeWidth="1.5" />
          <line x1="200" y1="127" x2="230" y2="160" stroke="#a7f3d0" strokeWidth="1.5" />
          <text x="50" y="178" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">AA</text>
          <text x="110" y="178" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">AG</text>
          <text x="170" y="178" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">GA</text>
          <text x="230" y="178" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">GG</text>
          <text x="140" y="208" fontSize="11" fontWeight="bold" fill="#34d399" textAnchor="middle">S = {"{AA, AG, GA, GG}"} → n(S) = 4</text>
        </svg>
      </div>
    ),
    text:
      "Untuk eksperimen LEBIH dari satu, kita pakai DIAGRAM POHON atau TABEL untuk melihat semua hasil. 2 koin → tiap koin punya 2 hasil → total = 2 × 2 = 4 titik sampel.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Himpunan SEMUA hasil yang mungkin dari sebuah eksperimen disebut …",
    kind: "choice",
    options: ["Titik sampel", "Ruang sampel", "Kejadian", "Frekuensi"],
    correctIndex: 1,
    discussion: ["Ruang sampel (S) berisi SEMUA hasil yang mungkin terjadi."],
  },
  {
    id: "g2",
    label: "Setiap anggota dari ruang sampel disebut …",
    kind: "fill",
    answers: ["titik sampel", "titik-sampel"],
    discussion: ["Setiap hasil yang mungkin = TITIK SAMPEL."],
  },
  {
    id: "g3",
    label: "Lempar 1 koin: ruang sampelnya S = {…}, n(S) = …",
    kind: "fill",
    answers: ["2"],
    discussion: ["S = {A, G}, hanya 2 hasil → n(S) = 2."],
  },
  {
    id: "g4",
    label: "Lempar 1 dadu: n(S) = …",
    kind: "fill",
    answers: ["6"],
    discussion: ["S = {1,2,3,4,5,6} → n(S) = 6."],
  },
  {
    id: "g5",
    label: "Lempar 2 koin sekaligus: n(S) = …",
    kind: "fill",
    answers: ["4"],
    discussion: [
      "Setiap koin 2 hasil. Total = 2 × 2 = 4.",
      "S = {AA, AG, GA, GG}.",
    ],
  },
  {
    id: "g6",
    label: "Lempar 2 dadu sekaligus: n(S) = …",
    kind: "fill",
    answers: ["36"],
    discussion: [
      "Setiap dadu punya 6 hasil. Total = 6 × 6 = 36.",
      "Bisa disusun dalam tabel 6×6.",
    ],
  },
  {
    id: "g7",
    label: "Aturan banyak titik sampel untuk eksperimen gabungan: n(S) = …",
    kind: "choice",
    options: [
      "n₁ + n₂",
      "n₁ × n₂",
      "n₁ − n₂",
      "n₁ / n₂",
    ],
    correctIndex: 1,
    discussion: ["Dengan aturan PERKALIAN: kalikan banyak hasil tiap eksperimen."],
  },
  {
    id: "g8",
    label: "KEJADIAN adalah …",
    kind: "choice",
    options: [
      "himpunan kosong",
      "himpunan bagian dari ruang sampel",
      "ruang sampel itu sendiri",
      "satu titik sampel saja",
    ],
    correctIndex: 1,
    discussion: ["Kejadian = subset dari S."],
  },
  {
    id: "g9",
    label: "Lempar dadu, kejadian A = 'mata genap' → A = {…}, n(A) = …",
    kind: "fill",
    answers: ["3"],
    discussion: ["A = {2, 4, 6} → n(A) = 3."],
  },
  {
    id: "g10",
    label: "Lempar dadu, kejadian B = 'mata > 4' → n(B) = …",
    kind: "fill",
    answers: ["2"],
    discussion: ["B = {5, 6} → n(B) = 2."],
  },
  {
    id: "g11",
    label: "Pernyataan: Pada lemparan 2 koin, hasil 'AG' dan 'GA' dianggap sama.",
    kind: "truefalse",
    correct: false,
    discussion: [
      "SALAH. AG dan GA berbeda karena urutannya beda → keduanya titik sampel terpisah.",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan EKSPERIMEN dengan n(S) yang tepat:",
    kind: "match",
    pairs: [
      { left: "1 koin", right: "2" },
      { left: "1 dadu", right: "6" },
      { left: "2 koin", right: "4" },
      { left: "2 dadu", right: "36" },
      { left: "1 koin & 1 dadu", right: "12" },
    ],
    discussion: ["Gunakan ATURAN PERKALIAN untuk eksperimen gabungan."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Ruang Sampel (S)",
    text: "RUANG SAMPEL adalah himpunan SEMUA hasil yang mungkin dari suatu eksperimen. Banyak anggotanya ditulis n(S).",
    tone: "cyan",
  },
  {
    title: "Titik Sampel & Kejadian",
    text: "Setiap anggota S disebut TITIK SAMPEL. KEJADIAN adalah himpunan bagian dari S — kumpulan titik sampel yang memenuhi syarat tertentu.",
    tone: "violet",
  },
  {
    title: "Aturan Perkalian n(S)",
    text: "Untuk eksperimen GABUNGAN, n(S) = n₁ × n₂ × … Contoh: 2 dadu → 6 × 6 = 36; 1 koin & 1 dadu → 2 × 6 = 12.",
    tone: "emerald",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "ruangsampel-game-jenis",
    title: "🎯 Game 1 — Cocokkan Eksperimen ke n(S)",
    description: "Seret setiap eksperimen ke kotak n(S) yang tepat!",
    buckets: [
      { id: "n2", label: "n(S) = 2", emoji: "🪙", color: "amber" },
      { id: "n4", label: "n(S) = 4", emoji: "🎴", color: "cyan" },
      { id: "n6", label: "n(S) = 6", emoji: "🎲", color: "violet" },
      { id: "n12", label: "n(S) = 12", emoji: "🎯", color: "emerald" },
      { id: "n36", label: "n(S) = 36", emoji: "🎲🎲", color: "rose" },
    ],
    items: [
      { id: "e1", label: "Lempar 1 koin", bucketId: "n2", emoji: "🪙" },
      { id: "e2", label: "Lempar 1 dadu", bucketId: "n6", emoji: "🎲" },
      { id: "e3", label: "Lempar 2 koin", bucketId: "n4", emoji: "🪙🪙" },
      { id: "e4", label: "Lempar 2 dadu", bucketId: "n36", emoji: "🎲🎲" },
      { id: "e5", label: "1 koin & 1 dadu", bucketId: "n12", emoji: "🪙🎲" },
      { id: "e6", label: "Pilih jam tangan (digital/analog)", bucketId: "n2", emoji: "⌚" },
      { id: "e7", label: "Spinner 6 warna", bucketId: "n6", emoji: "🎡" },
      { id: "e8", label: "Pilih kartu 4 jenis suit", bucketId: "n4", emoji: "🎴" },
    ],
  },
  {
    kind: "arrow-match",
    id: "ruangsampel-game-kejadian",
    title: "🎯 Game 2 — Hitung n(A) Cepat!",
    description: "Pasangkan tiap kejadian pada lemparan 1 dadu dengan n(A)-nya. Tekan ◀ ▶.",
    rightOptions: ["1", "2", "3", "4", "5", "6"],
    pairs: [
      { id: "k1", left: "Mata genap {2,4,6}", correctRight: "3", emoji: "🎲" },
      { id: "k2", left: "Mata ganjil {1,3,5}", correctRight: "3", emoji: "🎲" },
      { id: "k3", left: "Mata > 4", correctRight: "2", emoji: "🎲" },
      { id: "k4", left: "Mata prima {2,3,5}", correctRight: "3", emoji: "🎲" },
      { id: "k5", left: "Mata = 6", correctRight: "1", emoji: "🎲" },
      { id: "k6", left: "Mata ≤ 4", correctRight: "4", emoji: "🎲" },
      { id: "k7", left: "Mata kelipatan 3", correctRight: "2", emoji: "🎲" },
      { id: "k8", left: "Mata < 6", correctRight: "5", emoji: "🎲" },
      { id: "k9", left: "Semua mata dadu", correctRight: "6", emoji: "🎲" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Sebuah dadu dilempar. Banyak titik sampelnya = …",
    kind: "fill",
    answers: ["6"],
    hint: "Mata 1 sampai 6.",
    discussion: ["S = {1,2,3,4,5,6} → n(S) = 6."],
  },
  {
    id: "pp2",
    question: "3 koin dilempar bersamaan. n(S) = …",
    kind: "fill",
    answers: ["8"],
    hint: "2 × 2 × 2.",
    discussion: ["Tiap koin 2 hasil → 2³ = 8 titik sampel."],
  },
  {
    id: "pp3",
    question: "Kejadian 'jumlah mata 2 dadu = 7' memuat berapa titik sampel?",
    kind: "fill",
    answers: ["6"],
    hint: "Pasangan (1,6),(2,5),(3,4),(4,3),(5,2),(6,1).",
    discussion: ["Ada 6 pasangan dengan jumlah 7."],
  },
  {
    id: "pp4",
    question:
      "Suatu spinner berisi 4 warna sama besar (Merah, Kuning, Hijau, Biru). Banyak titik sampel = …",
    kind: "fill",
    answers: ["4"],
    hint: "Hitung warna.",
    discussion: ["S = {M, K, H, B} → n(S) = 4."],
  },
  {
    id: "pp5",
    question:
      "Pernyataan: Ruang sampel SELALU memiliki banyak anggota lebih dari satu.",
    kind: "truefalse",
    correct: false,
    hint: "Bayangkan eksperimen dengan satu hasil pasti.",
    discussion: [
      "SALAH. Eksperimen yang hanya memiliki satu hasil pasti akan punya n(S) = 1.",
    ],
  },
  {
    id: "pp6",
    question:
      "Lempar 1 koin & 1 dadu. Berapa titik sampel kejadian 'koin Angka dan dadu genap'?",
    kind: "fill",
    answers: ["3"],
    hint: "{(A,2),(A,4),(A,6)}.",
    discussion: ["Ada 3 pasangan: (A,2), (A,4), (A,6)."],
  },
  {
    id: "pp7",
    question:
      "Dari kotak berisi kelereng diberi nomor 1 sampai 10, banyak titik sampel kejadian 'nomor kelipatan 3' = …",
    kind: "fill",
    answers: ["3"],
    hint: "Kelipatan 3 antara 1–10.",
    discussion: ["{3, 6, 9} → 3 titik sampel."],
  },
  {
    id: "pp8",
    question:
      "Pernyataan: Pada lemparan 2 dadu, kejadian 'jumlah mata = 1' adalah HIMPUNAN KOSONG.",
    kind: "truefalse",
    correct: true,
    hint: "Mata terkecil = 1, jadi minimal jumlah = 2.",
    discussion: ["BENAR. Tidak ada pasangan dadu yang berjumlah 1 → n(A) = 0."],
  },
];

const RuangSampelLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Peluang"
    title="Ruang Sampel & Titik Sampel — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo mulai petualangan PELUANG 🎲! Lempar koin, lempar dadu, gambar diagram pohon — kamu akan MENEMUKAN sendiri apa itu ruang sampel S, titik sampel, kejadian, dan ATURAN PERKALIAN n(S) = n₁ × n₂!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan konsep ruang sampel."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/peluang"
    backLabel="Kembali ke Menu Peluang"
    scoreMessages={{
      perfect: "🌟 Mantap! Konsep ruang sampel sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Pelajari ulang aturan perkalian n(S).",
      low: "💪 Tetap semangat! Mulai dari koin & dadu sederhana.",
    }}
  />
);

export default RuangSampelLKPDPage;
