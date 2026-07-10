import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Pada karung beras tertulis: berat seluruhnya 50 kg, berat karung 1 kg, berat beras 49 kg. Mana yang merupakan BRUTO (berat keseluruhan)?",
    kind: "choice",
    options: ["50 kg", "1 kg", "49 kg", "0 kg"],
    correctIndex: 0,
    discussion: [
      "BRUTO = berat keseluruhan (isi + kemasan). Pada contoh ini = 50 kg.",
    ],
  },
  {
    id: "g2",
    label: "Berat KEMASAN saja (karung) disebut TARA. Pada contoh di atas, tara = … kg",
    kind: "fill",
    answers: ["1", "1 kg"],
    discussion: ["TARA = berat kemasan (karung) = 1 kg."],
  },
  {
    id: "g3",
    label: "Berat ISI saja (beras tanpa karung) disebut NETTO. Pada contoh di atas, netto = … kg",
    kind: "fill",
    answers: ["49", "49 kg"],
    discussion: ["NETTO = berat isi = 49 kg. Hubungan: Bruto = Netto + Tara."],
  },
  {
    id: "g4",
    label: "Pasangkan istilah dengan artinya.",
    kind: "match",
    pairs: [
      { left: "BRUTO", right: "Berat seluruhnya (isi + kemasan)" },
      { left: "NETTO", right: "Berat isi saja" },
      { left: "TARA", right: "Berat kemasan saja" },
    ],
    discussion: [
      "Bruto = Netto + Tara.",
      "Netto = Bruto − Tara, dan Tara = Bruto − Netto.",
    ],
  },
  {
    id: "g5",
    label: "Bruto = 25 kg, tara = 5%. Maka berat tara = 5% × 25 = … kg",
    kind: "fill",
    answers: ["1.25", "1,25", "1.25 kg", "1,25 kg"],
    discussion: ["Tara dalam % dihitung dari bruto: 5% × 25 = 1,25 kg."],
  },
  {
    id: "g6",
    label: "Maka netto = bruto − tara = 25 − 1,25 = … kg",
    kind: "fill",
    answers: ["23.75", "23,75"],
    discussion: ["Netto = 25 − 1,25 = 23,75 kg."],
  },
  {
    id: "g7",
    label: "Benar atau salah: Bruto SELALU lebih besar dari netto.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "Bruto = Netto + Tara. Karena Tara ≥ 0, maka Bruto ≥ Netto.",
      "Pernyataan BENAR.",
    ],
  },
  {
    id: "g8",
    label: "Urutkan langkah menyelesaikan soal bruto-netto-tara berpersen:",
    kind: "sort",
    items: [
      "Hitung netto = bruto − tara (atau Netto = (100% − %tara) × bruto).",
      "Tentukan bruto dan persentase tara.",
      "Hitung berat tara = %tara × bruto.",
      "Tulis kesimpulan dengan satuan.",
    ],
    correctOrder: [
      "Tentukan bruto dan persentase tara.",
      "Hitung berat tara = %tara × bruto.",
      "Hitung netto = bruto − tara (atau Netto = (100% − %tara) × bruto).",
      "Tulis kesimpulan dengan satuan.",
    ],
    discussion: [
      "Langkah: catat data → hitung tara → hitung netto → tulis kesimpulan.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Sebuah karung gula bruto 60 kg dan tara 2%. Berapa kg netto-nya?",
    kind: "fill",
    answers: ["58.8", "58,8", "58,8 kg"],
    hint: "Tara = 2% × 60. Lalu Netto = Bruto − Tara.",
    discussion: ["Tara = 0,02 × 60 = 1,2 kg. Netto = 60 − 1,2 = 58,8 kg."],
  },
  {
    id: "p2",
    question: "Pedagang membeli 5 karung beras, masing-masing bruto 50 kg, tara 1 kg. Total netto seluruh karung adalah …",
    kind: "choice",
    options: ["240 kg", "245 kg", "249 kg", "250 kg"],
    correctIndex: 1,
    hint: "Netto per karung = 50 − 1 = 49 kg.",
    discussion: ["Netto/karung = 50 − 1 = 49 kg. Total = 5 × 49 = 245 kg."],
  },
  {
    id: "p3",
    question: "Sebuah peti berisi mangga, bruto 40 kg, netto 36 kg. Berapa persen tara?",
    kind: "fill",
    answers: ["10", "10%"],
    hint: "Tara = bruto − netto = 4. % tara = (4/40) × 100%.",
    discussion: ["Tara = 40 − 36 = 4 kg. %Tara = (4/40) × 100% = 10%."],
  },
  {
    id: "p4",
    question: "Benar atau salah: Tara 0% berarti netto sama dengan bruto.",
    kind: "truefalse",
    correct: true,
    hint: "Netto = Bruto − Tara.",
    discussion: ["Jika tara = 0, maka netto = bruto. Pernyataan BENAR."],
  },
  {
    id: "p5",
    question: "Pedagang membeli 1 karung tepung netto 49 kg seharga Rp 490.000. Ia menjual lagi Rp 12.000 per kg. Berapa untung yang diperoleh?",
    kind: "fill",
    answers: ["98000", "98.000", "Rp 98.000"],
    hint: "Hasil penjualan = 49 × 12.000.",
    discussion: [
      "Hasil penjualan = 49 × 12.000 = 588.000.",
      "Untung = 588.000 − 490.000 = Rp 98.000.",
    ],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-bruto-netto-tara",
    title: "📦 Game 1: Bruto, Netto atau Tara?",
    description: "Tarik setiap kartu berat ke kelompoknya: BRUTO, NETTO, atau TARA!",
    buckets: [
      { id: "bruto", label: "BRUTO", emoji: "📦", color: "cyan" },
      { id: "netto", label: "NETTO", emoji: "🌾", color: "emerald" },
      { id: "tara", label: "TARA", emoji: "🛍️", color: "amber" },
    ],
    items: [
      { id: "i1", label: "Berat karung 1 kg", bucketId: "tara" },
      { id: "i2", label: "Berat seluruhnya 50 kg", bucketId: "bruto" },
      { id: "i3", label: "Berat beras 49 kg", bucketId: "netto" },
      { id: "i4", label: "Berat kotak kosong 0,5 kg", bucketId: "tara" },
      { id: "i5", label: "Berat isi mangga 9,5 kg", bucketId: "netto" },
      { id: "i6", label: "Berat 1 peti penuh 10 kg", bucketId: "bruto" },
      { id: "i7", label: "Berat plastik bungkus 0,2 kg", bucketId: "tara" },
      { id: "i8", label: "Berat tepung saja 24,8 kg", bucketId: "netto" },
      { id: "i9", label: "Berat total 25 kg (isi + plastik)", bucketId: "bruto" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-hitung-bnt",
    title: "🎮 Game 2: Hitung Cepat Netto / Tara",
    description: "Tekan ◀ ▶ pilih hasil yang benar dari setiap operasi bruto-netto-tara.",
    rightOptions: ["1 kg", "2 kg", "4 kg", "8 kg", "48 kg", "96 kg"],
    pairs: [
      { id: "r1", left: "Bruto 50 kg, Netto 49 kg → Tara = ?", correctRight: "1 kg", emoji: "📦" },
      { id: "r2", left: "Bruto 50 kg, Tara 2 kg → Netto = ?", correctRight: "48 kg", emoji: "🌾" },
      { id: "r3", left: "Bruto 100 kg, Netto 96 kg → Tara = ?", correctRight: "4 kg", emoji: "🧂" },
      { id: "r4", left: "Bruto 100 kg, Tara 4 kg → Netto = ?", correctRight: "96 kg", emoji: "🍚" },
      { id: "r5", left: "Bruto 10 kg, Tara 20% → Tara = ?", correctRight: "2 kg", emoji: "🥔" },
    ],
  },
  {
    kind: "page-link",
    id: "game-arena-bnt",
    title: "🚀 Game 3: Math Game Arena – Bruto, Netto & Tara",
    description: "Lanjut bermain di arena layar penuh dengan tantangan timbangan!",
    path: "/math-game-arena/kelas-7/aritmetika-sosial/bruto-netto-tara",
    buttonLabel: "MAINKAN DI MATH GAME ARENA",
    emoji: "📦",
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi 1: Karung Beras 🌾",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">🌾📦</p>
        <p className="text-lg font-bold text-white">Bruto = 50 kg</p>
        <p className="text-lg font-bold text-yellow-200">Tara = 1 kg</p>
        <p className="text-lg font-bold text-emerald-300">Netto = 49 kg</p>
      </div>
    ),
    text: "Bruto = berat seluruhnya. Netto = berat beras saja. Tara = berat karung. Bruto = Netto + Tara.",
  },
  {
    title: "Situasi 2: Peti Mangga dengan Tara 5% 🥭",
    visual: (
      <div className="text-center space-y-1">
        <p className="text-3xl">🥭📦</p>
        <p className="text-lg font-bold text-white">Bruto = 20 kg</p>
        <p className="text-lg font-bold text-yellow-200">Tara = 5% × 20 = 1 kg</p>
        <p className="text-lg font-bold text-emerald-300">Netto = 19 kg</p>
      </div>
    ),
    text: "Tara dalam persen selalu dihitung dari BRUTO. Netto = Bruto − Tara.",
  },
];

const summaryCards: SummaryCard[] = [
  { title: "Bruto", text: "Bruto = berat keseluruhan (isi + kemasan).", tone: "cyan" },
  { title: "Netto", text: "Netto = berat isi saja = Bruto − Tara.", tone: "emerald" },
  { title: "Tara", text: "Tara = berat kemasan = Bruto − Netto. Bisa juga Tara = %Tara × Bruto.", tone: "yellow" },
];

const BrutoNettoTaraLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Aritmetika Sosial • Kelas 7"
    title="📦 Bruto, Netto & Tara"
    intro="Sobat Numatik akan belajar membedakan berat keseluruhan, berat isi, dan berat kemasan, lalu menemukan hubungan ketiganya melalui aktivitas dan permainan."
    situations={situations}
    guidedIntro="Lengkapi pertanyaan berikut untuk menemukan hubungan Bruto = Netto + Tara."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Selesaikan soal-soal kontekstual berikut menggunakan rumus yang sudah kamu temukan."
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-7/aritmetika-sosial"
    backLabel="Kembali ke menu LKPD Aritmetika Sosial"
  />
);

export default BrutoNettoTaraLKPDPage;
