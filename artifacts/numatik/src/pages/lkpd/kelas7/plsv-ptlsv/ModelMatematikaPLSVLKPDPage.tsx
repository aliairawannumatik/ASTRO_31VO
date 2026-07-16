import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: 'Misalkan umur Andi = x. Lima tahun lagi, umur Andi adalah ...',
    kind: "fill",
    answers: ["x + 5", "x+5"],
    discussion: ['"Lima tahun lagi" → ditambah 5. Jadi x + 5.'],
  },
  {
    id: "g2",
    label: 'Misalkan harga sebuah pulpen = p. Harga 4 pulpen adalah ...',
    kind: "fill",
    answers: ["4p"],
    discussion: ['"4 buah" yang dikalikan dengan harga satuan p → 4 × p = 4p.'],
  },
  {
    id: "g3",
    label: 'Pernyataan: "Tiga kali umur Budi sama dengan 21". Model matematikanya adalah ...',
    kind: "choice",
    options: ["3 + x = 21", "3x = 21", "x − 3 = 21", "x/3 = 21"],
    correctIndex: 1,
    discussion: ['"Tiga kali umur Budi" = 3x. "Sama dengan 21" → = 21. Jadi 3x = 21.'],
  },
  {
    id: "g4",
    label: 'Pernyataan: "Jumlah suatu bilangan dengan 7 sama dengan 15". Model matematikanya:',
    kind: "choice",
    options: ["x − 7 = 15", "x + 7 = 15", "7x = 15", "15 + x = 7"],
    correctIndex: 1,
    discussion: ['Misal bilangan = x. "Jumlah dengan 7" → x + 7. "Sama dengan 15" → = 15.'],
  },
  {
    id: "g5",
    label: "Pasangkan kalimat verbal dengan model PLSV-nya:",
    kind: "match",
    pairs: [
      { left: "Selisih bilangan dan 4 adalah 9", right: "x − 4 = 9" },
      { left: "Lima kali bilangan sama dengan 25", right: "5x = 25" },
      { left: "Dua kurangnya dari 3 kali bilangan = 13", right: "3x − 2 = 13" },
      { left: "Setengah dari bilangan adalah 8", right: "x/2 = 8" },
    ],
    discussion: ["Selalu identifikasi: misalkan bilangan = x, lalu terjemahkan operasi sesuai kata kerja."],
  },
  {
    id: "g6",
    label: 'Bu Sari membeli 5 kg jeruk dengan harga total Rp45.000. Jika harga 1 kg jeruk = x rupiah, maka model PLSV-nya adalah ...',
    kind: "choice",
    options: ["x + 5 = 45000", "5 + x = 45000", "5x = 45000", "x/5 = 45000"],
    correctIndex: 2,
    discussion: ["5 kg × harga 1 kg (x) = 45000 → 5x = 45000."],
  },
  {
    id: "g7",
    label: "Urutkan langkah membuat model matematika dari soal cerita:",
    kind: "sort",
    items: [
      "Selesaikan PLSV.",
      "Tetapkan variabel (misal: bilangan = x).",
      "Tulis kembali kalimat sebagai PLSV.",
      "Baca soal dan tentukan apa yang dicari.",
    ],
    correctOrder: [
      "Baca soal dan tentukan apa yang dicari.",
      "Tetapkan variabel (misal: bilangan = x).",
      "Tulis kembali kalimat sebagai PLSV.",
      "Selesaikan PLSV.",
    ],
    discussion: ["Baca → misalkan → terjemahkan → selesaikan. Empat langkah baku!"],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: 'Buat model matematika dari pernyataan "Bilangan x dikurang 3 sama dengan 12". Lalu tentukan x.',
    kind: "fill",
    answers: ["15"],
    hint: "x − 3 = 12 → tambah 3.",
    discussion: ["x − 3 = 12 → x = 15."],
  },
  {
    id: "p2",
    question: 'Pak Joni membeli 6 buku dengan total Rp48.000. Berapa harga 1 buku?',
    kind: "choice",
    options: ["Rp6.000", "Rp7.000", "Rp8.000", "Rp9.000"],
    correctIndex: 2,
    hint: "Misal harga 1 buku = x → 6x = 48000.",
    discussion: ["6x = 48.000 → x = 8.000. Jadi harga 1 buku Rp8.000."],
  },
  {
    id: "p3",
    question: 'Umur Ayah 4 kali umur anaknya. Jika umur ayah 36 tahun, berapa umur anaknya?',
    kind: "fill",
    answers: ["9"],
    hint: "Misal umur anak = x → 4x = 36.",
    discussion: ["4x = 36 → x = 9. Umur anak 9 tahun."],
  },
  {
    id: "p4",
    question: 'Sebuah persegi panjang memiliki keliling 30 cm. Jika lebarnya 6 cm, berapa panjangnya?',
    kind: "choice",
    options: ["6 cm", "9 cm", "10 cm", "12 cm"],
    correctIndex: 1,
    hint: "K = 2(p + l) → 30 = 2(p + 6).",
    discussion: ["30 = 2(p + 6) → 15 = p + 6 → p = 9 cm."],
  },
  {
    id: "p5",
    question: '"Tiga kurangnya dari dua kali bilangan adalah 9". Bilangan tersebut adalah ...',
    kind: "fill",
    answers: ["6"],
    hint: "2x − 3 = 9.",
    discussion: ["2x − 3 = 9 → 2x = 12 → x = 6."],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-translate",
    title: "🎯 Game 1: Drop Kalimat ke Model PLSV",
    description: "Tarik setiap kalimat verbal ke model PLSV yang sesuai.",
    buckets: [
      { id: "b1", label: "x + 7 = 15", emoji: "➕", color: "cyan" },
      { id: "b2", label: "x − 4 = 9", emoji: "➖", color: "violet" },
      { id: "b3", label: "3x = 21", emoji: "✖️", color: "emerald" },
      { id: "b4", label: "x/2 = 5", emoji: "➗", color: "yellow" },
    ],
    items: [
      { id: "i1", label: "Bilangan ditambah 7 = 15", bucketId: "b1" },
      { id: "i2", label: "Bilangan dikurang 4 = 9", bucketId: "b2" },
      { id: "i3", label: "Tiga kali bilangan = 21", bucketId: "b3" },
      { id: "i4", label: "Setengah bilangan = 5", bucketId: "b4" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-cerita",
    title: "🎮 Game 2: Cerita → Jawaban",
    description: "Tekan ◀ ▶ untuk memilih jawaban yang benar dari setiap soal cerita.",
    rightOptions: ["3", "5", "7", "9", "12"],
    pairs: [
      { id: "r1", left: "5x = 25, x = ?", correctRight: "5", emoji: "✖️" },
      { id: "r2", left: "x + 4 = 11, x = ?", correctRight: "7", emoji: "➕" },
      { id: "r3", left: "x − 3 = 0, x = ?", correctRight: "3", emoji: "➖" },
      { id: "r4", left: "2x + 3 = 21, x = ?", correctRight: "9", emoji: "🎯" },
      { id: "r5", left: "x/2 = 6, x = ?", correctRight: "12", emoji: "➗" },
    ],
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi: Kunci Kata → Operasi",
    visual: (
      <div className="text-left text-sm space-y-2 text-white/85">
        <div className="rounded-lg bg-cyan-500/15 px-3 py-2"><span className="font-bold text-cyan-200">"jumlah / lebih"</span> → ➕</div>
        <div className="rounded-lg bg-violet-500/15 px-3 py-2"><span className="font-bold text-violet-200">"selisih / kurang"</span> → ➖</div>
        <div className="rounded-lg bg-emerald-500/15 px-3 py-2"><span className="font-bold text-emerald-200">"kali / produk"</span> → ✖️</div>
        <div className="rounded-lg bg-yellow-500/15 px-3 py-2"><span className="font-bold text-yellow-200">"bagi / setengah"</span> → ➗</div>
      </div>
    ),
    text: "Kenali kata kunci agar mudah menerjemahkan kalimat menjadi PLSV.",
  },
  {
    title: "Situasi: 4 Langkah Pemodelan",
    visual: (
      <div className="text-center space-y-1 text-sm text-white/85 font-body">
        <div>1️⃣ Baca dan pahami soal.</div>
        <div>2️⃣ Misalkan yang dicari = x.</div>
        <div>3️⃣ Tulis menjadi PLSV.</div>
        <div>4️⃣ Selesaikan & periksa.</div>
      </div>
    ),
    text: "Ikuti 4 langkah ini agar tidak salah memodelkan.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Pemodelan", text: "Mengubah kalimat verbal menjadi PLSV ax + b = c.", tone: "cyan" },
  { title: "Strategi Misal", text: "Selalu mulai dengan: 'Misalkan ... = x'.", tone: "violet" },
  { title: "Periksa Konteks", text: "Pastikan jawaban masuk akal (tidak negatif untuk umur, dll.).", tone: "emerald" },
];

const ModelMatematikaPLSVLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif PLSV • Kelas 7"
    title="🧠 Model Matematika PLSV"
    intro="Latih kemampuan menerjemahkan masalah cerita sehari-hari menjadi Persamaan Linear Satu Variabel — disertai dua mini-game!"
    situations={situations}
    guidedIntro="Selesaikan aktivitas berikut untuk menemukan cara mengubah kalimat verbal menjadi PLSV."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Asah pemahamanmu dengan soal cerita."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/plsv-ptlsv"
    backLabel="Kembali ke menu LKPD PLSV & PtLSV"
  />
);

export default ModelMatematikaPLSVLKPDPage;
