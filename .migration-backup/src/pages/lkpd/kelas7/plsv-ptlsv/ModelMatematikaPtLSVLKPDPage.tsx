import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: '"Umur Lia tidak lebih dari 12 tahun." Model PtLSV-nya adalah ...',
    kind: "choice",
    options: ["x < 12", "x > 12", "x ≤ 12", "x ≥ 12"],
    correctIndex: 2,
    discussion: ['"Tidak lebih dari" = paling banyak = ≤. Jadi x ≤ 12.'],
  },
  {
    id: "g2",
    label: '"Sebuah lift mampu menahan paling banyak 600 kg" — beban x kg dimodelkan ...',
    kind: "choice",
    options: ["x ≥ 600", "x ≤ 600", "x > 600", "x < 600"],
    correctIndex: 1,
    discussion: ['"Paling banyak 600" → ≤ 600.'],
  },
  {
    id: "g3",
    label: '"Untuk lulus, nilai harus minimal 70" — nilai x dimodelkan ...',
    kind: "choice",
    options: ["x > 70", "x ≥ 70", "x < 70", "x ≤ 70"],
    correctIndex: 1,
    discussion: ['"Minimal" = paling sedikit = ≥. Jadi x ≥ 70.'],
  },
  {
    id: "g4",
    label: '"Selisih bilangan dengan 5 kurang dari 12". Model PtLSV-nya:',
    kind: "choice",
    options: ["x − 5 ≥ 12", "x − 5 ≤ 12", "x − 5 < 12", "x − 5 > 12"],
    correctIndex: 2,
    discussion: ['"Kurang dari" → tanda <.'],
  },
  {
    id: "g5",
    label: 'Pasangkan kalimat dengan modelnya:',
    kind: "match",
    pairs: [
      { left: "Tidak kurang dari 8", right: "x ≥ 8" },
      { left: "Kurang dari 5", right: "x < 5" },
      { left: "Lebih dari 10", right: "x > 10" },
      { left: "Paling banyak 20", right: "x ≤ 20" },
    ],
    discussion: ["Hafalkan: tidak kurang ↔ ≥ ; tidak lebih ↔ ≤ ; kurang dari ↔ < ; lebih dari ↔ >."],
  },
  {
    id: "g6",
    label: 'Pak Doni membeli x buah apel @ Rp3.000. Ia memiliki uang Rp30.000 dan paling banyak boleh terpakai semuanya. Model PtLSV-nya: ...',
    kind: "choice",
    options: ["3000x < 30000", "3000x > 30000", "3000x ≤ 30000", "3000x ≥ 30000"],
    correctIndex: 2,
    discussion: ['"Paling banyak terpakai semua" → biaya ≤ uang yang dimiliki → 3000x ≤ 30000.'],
  },
  {
    id: "g7",
    label: 'Banyak apel maksimum yang dapat dibeli pada soal di atas adalah ...',
    kind: "fill",
    answers: ["10"],
    discussion: ["3000x ≤ 30000 → x ≤ 10. Jadi maksimum 10 buah apel."],
  },
  {
    id: "g8",
    label: "Urutkan langkah memecahkan soal cerita PtLSV:",
    kind: "sort",
    items: [
      "Selesaikan PtLSV.",
      "Tetapkan variabel (misal jumlah barang = x).",
      "Tentukan tanda pertidaksamaan dari kata kunci.",
      "Tafsirkan jawaban dalam konteks soal (jumlah harus bulat positif).",
      "Susun model PtLSV.",
    ],
    correctOrder: [
      "Tetapkan variabel (misal jumlah barang = x).",
      "Tentukan tanda pertidaksamaan dari kata kunci.",
      "Susun model PtLSV.",
      "Selesaikan PtLSV.",
      "Tafsirkan jawaban dalam konteks soal (jumlah harus bulat positif).",
    ],
    discussion: ["Misal → tanda → model → selesai → tafsir."],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: 'Pernyataan "Berat barang tidak melebihi 25 kg" dimodelkan sebagai ...',
    kind: "choice",
    options: ["x < 25", "x ≤ 25", "x > 25", "x ≥ 25"],
    correctIndex: 1,
    hint: "Tidak melebihi = paling banyak.",
    discussion: ["Tidak melebihi 25 → x ≤ 25."],
  },
  {
    id: "p2",
    question: "Jumlah dua bilangan berurutan kurang dari 15. Bilangan pertama adalah x. Berapa nilai x maksimum (bilangan bulat)?",
    kind: "fill",
    answers: ["6"],
    hint: "x + (x + 1) < 15 → 2x + 1 < 15.",
    discussion: ["2x + 1 < 15 → 2x < 14 → x < 7. Bilangan bulat terbesar: x = 6."],
  },
  {
    id: "p3",
    question: "Sebuah taksi pasang argometer Rp7.000 + Rp3.000 per km. Uang Rina paling banyak Rp40.000. Berapa jarak maksimum yang dapat ditempuh (km)?",
    kind: "choice",
    options: ["9 km", "10 km", "11 km", "12 km"],
    correctIndex: 2,
    hint: "7000 + 3000x ≤ 40000.",
    discussion: ["7000 + 3000x ≤ 40000 → 3000x ≤ 33000 → x ≤ 11. Maksimum 11 km."],
  },
  {
    id: "p4",
    question: "Untuk lulus ulangan, Anya harus mendapat nilai minimal 75. Sekarang nilainya 60 dan akan ditambah nilai tugas x. Pertidaksamaan yang sesuai:",
    kind: "choice",
    options: ["60 + x < 75", "60 + x ≤ 75", "60 + x > 75", "60 + x ≥ 75"],
    correctIndex: 3,
    hint: "Minimal = paling sedikit = ≥.",
    discussion: ["60 + x ≥ 75 → x ≥ 15. Jadi nilai tugas minimal 15."],
  },
  {
    id: "p5",
    question: 'Benar atau salah: kalimat "kurang dari 100" dimodelkan x ≤ 100.',
    kind: "truefalse",
    correct: false,
    hint: "Kurang dari = <, bukan ≤.",
    discussion: ['"Kurang dari 100" tidak termasuk 100, jadi x < 100 (bukan ≤).'],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-cerita",
    title: "🎯 Game 1: Drop Kalimat ke Tandanya",
    description: "Tarik setiap kalimat ke tanda PtLSV yang tepat.",
    buckets: [
      { id: "b1", label: "x < a", emoji: "◀", color: "cyan" },
      { id: "b2", label: "x > a", emoji: "▶", color: "violet" },
      { id: "b3", label: "x ≤ a", emoji: "🔻", color: "emerald" },
      { id: "b4", label: "x ≥ a", emoji: "🔺", color: "yellow" },
    ],
    items: [
      { id: "i1", label: "Berat tidak lebih dari 5 kg", bucketId: "b3" },
      { id: "i2", label: "Tinggi minimal 150 cm", bucketId: "b4" },
      { id: "i3", label: "Suhu kurang dari 20°", bucketId: "b1" },
      { id: "i4", label: "Saldo lebih dari Rp50.000", bucketId: "b2" },
      { id: "i5", label: "Paling banyak 10 orang", bucketId: "b3" },
      { id: "i6", label: "Tidak kurang dari 7", bucketId: "b4" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-belanja",
    title: "🎮 Game 2: Soal Belanja → Banyak Maksimum/Minimum",
    description: "Tekan ◀ ▶ untuk memilih banyak barang yang benar.",
    rightOptions: ["3", "5", "8", "10", "12"],
    pairs: [
      { id: "r1", left: "Apel Rp4.000/bh, uang Rp20.000. Maks?", correctRight: "5", emoji: "🍎" },
      { id: "r2", left: "Buku Rp5.000/bh, uang Rp40.000. Maks?", correctRight: "8", emoji: "📕" },
      { id: "r3", left: "Permen Rp1.000/bh, uang Rp10.000. Maks?", correctRight: "10", emoji: "🍬" },
      { id: "r4", left: "Pulpen Rp2.000/bh, uang Rp24.000. Maks?", correctRight: "12", emoji: "🖊️" },
      { id: "r5", left: "Kue Rp7.000/bh, uang Rp22.000. Maks?", correctRight: "3", emoji: "🍰" },
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Kata Kunci → Tanda",
    visual: (
      <div className="text-left text-sm space-y-2 text-white/85">
        <div className="rounded-lg bg-cyan-500/15 px-3 py-2"><span className="font-bold text-cyan-200">"kurang dari"</span> → &lt;</div>
        <div className="rounded-lg bg-violet-500/15 px-3 py-2"><span className="font-bold text-violet-200">"lebih dari"</span> → &gt;</div>
        <div className="rounded-lg bg-emerald-500/15 px-3 py-2"><span className="font-bold text-emerald-200">"paling banyak / tidak lebih dari / maksimum"</span> → ≤</div>
        <div className="rounded-lg bg-yellow-500/15 px-3 py-2"><span className="font-bold text-yellow-200">"paling sedikit / minimal / tidak kurang dari"</span> → ≥</div>
      </div>
    ),
    text: "Kunci utama membuat model PtLSV: kenali kata kunci pada kalimat.",
  },
  {
    title: "Situasi: Lift Pengantar Barang",
    visual: (
      <div className="text-center">
        <div className="text-5xl mb-2">🛗</div>
        <p className="text-sm text-white/75">Lift menahan paling banyak 600 kg.<br />Misal beban = b kg.</p>
        <div className="font-display text-2xl font-bold text-yellow-300 mt-2">b ≤ 600</div>
      </div>
    ),
    text: '"Paling banyak" → tanda ≤. Selalu cek ulang dengan substitusi nilai.',
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Pemodelan PtLSV", text: "Mengubah kalimat verbal menjadi pertidaksamaan ax + b ◇ c.", tone: "cyan" },
  { title: "Kata Kunci", text: "Hafalkan: kurang dari (<), lebih dari (>), paling banyak (≤), paling sedikit (≥).", tone: "violet" },
  { title: "Tafsir Konteks", text: "Pastikan jawaban masuk akal: jumlah orang/barang harus bulat positif.", tone: "emerald" },
];

const ModelMatematikaPtLSVLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif PtLSV • Kelas 7"
    title="🛒 Model Matematika PtLSV"
    intro="Latih kemampuan menerjemahkan masalah sehari-hari (uang, berat, nilai, dll.) menjadi PtLSV — disertai dua mini-game interaktif!"
    situations={situations}
    guidedIntro="Selesaikan aktivitas berikut untuk menemukan cara mengubah kalimat verbal menjadi PtLSV."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Asah pemahamanmu dengan soal cerita."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/plsv-ptlsv"
    backLabel="Kembali ke menu LKPD PLSV & PtLSV"
  />
);

export default ModelMatematikaPtLSVLKPDPage;
