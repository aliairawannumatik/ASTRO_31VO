import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Memprediksi Berapa Kali Mata 6 Muncul",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-700/20 border border-amber-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="11" fontWeight="bold" fill="#fde68a" textAnchor="middle">Dadu dilempar 60 kali — berapa kali mata 6 muncul?</text>
          <rect x="20" y="50" width="115" height="60" rx="8" fill="#22d3ee" fillOpacity="0.4" stroke="#67e8f9" strokeWidth="1.5" />
          <text x="78" y="70" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">P(mata 6)</text>
          <text x="78" y="92" fontSize="16" fontWeight="bold" fill="#fff" textAnchor="middle">1/6</text>
          <text x="142" y="85" fontSize="22" fill="#fbbf24" textAnchor="middle">×</text>
          <rect x="155" y="50" width="105" height="60" rx="8" fill="#a78bfa" fillOpacity="0.4" stroke="#c4b5fd" strokeWidth="1.5" />
          <text x="207" y="70" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">n (banyak)</text>
          <text x="207" y="92" fontSize="16" fontWeight="bold" fill="#fff" textAnchor="middle">60</text>
          <rect x="50" y="135" width="180" height="50" rx="8" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="158" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">Fh = P(A) × n</text>
          <text x="140" y="178" fontSize="14" fontWeight="bold" fill="#fde68a" textAnchor="middle">= (1/6) × 60 = 10 kali</text>
        </svg>
      </div>
    ),
    text:
      "Bayangkan kamu LEMPAR dadu sebanyak 60 kali. Kira-kira berapa kali mata 6 akan muncul? Karena P(mata 6) = 1/6, kita HARAPKAN 1/6 × 60 = 10 kali. Inilah FREKUENSI HARAPAN: Fh(A) = P(A) × n.",
  },
  {
    title: "Situasi 2 — Frekuensi Harapan vs Frekuensi Sebenarnya",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 280 180" className="w-full">
          <rect width="280" height="180" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="11" fontWeight="bold" fill="#a7f3d0" textAnchor="middle">120 lemparan koin — berapa Angka diharapkan?</text>
          <rect x="40" y="50" width="200" height="35" rx="6" fill="#fbbf24" fillOpacity="0.45" stroke="#fde68a" strokeWidth="1.5" />
          <text x="140" y="73" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">Fh(Angka) = (1/2) × 120 = 60</text>
          <text x="140" y="105" fontSize="10" fill="#67e8f9" textAnchor="middle">Hasil eksperimen: bisa jadi 58, 62, 65 …</text>
          <text x="140" y="120" fontSize="10" fill="#67e8f9" textAnchor="middle">Tidak harus PERSIS 60, tapi MENDEKATI.</text>
          <rect x="40" y="135" width="200" height="35" rx="6" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="140" y="158" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">Frekuensi HARAPAN ≠ Frekuensi SEBENARNYA</text>
        </svg>
      </div>
    ),
    text:
      "Frekuensi HARAPAN adalah PREDIKSI berdasarkan peluang teoretik. Hasil sebenarnya bisa SEDIKIT BERBEDA. Tapi semakin banyak n, hasilnya semakin DEKAT ke nilai harapan.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Rumus FREKUENSI HARAPAN suatu kejadian A: Fh(A) = …",
    kind: "choice",
    options: [
      "P(A) + n",
      "P(A) − n",
      "P(A) × n",
      "n / P(A)",
    ],
    correctIndex: 2,
    discussion: ["Fh(A) = peluang × banyak percobaan = P(A) × n."],
  },
  {
    id: "g2",
    label: "Dadu dilempar 60 kali. Frekuensi harapan mata 3 = …",
    kind: "fill",
    answers: ["10"],
    discussion: ["P(mata 3) = 1/6, Fh = (1/6) × 60 = 10."],
  },
  {
    id: "g3",
    label: "Koin dilempar 200 kali. Frekuensi harapan munculnya GAMBAR = …",
    kind: "fill",
    answers: ["100"],
    discussion: ["P(G) = 1/2, Fh = (1/2) × 200 = 100."],
  },
  {
    id: "g4",
    label: "Dadu dilempar 90 kali. Frekuensi harapan mata GENAP = …",
    kind: "fill",
    answers: ["45"],
    discussion: ["P(genap) = 3/6 = 1/2, Fh = (1/2) × 90 = 45."],
  },
  {
    id: "g5",
    label:
      "Dari kotak (3 merah, 2 putih, 5 hijau), diambil 1 bola lalu dikembalikan, dilakukan 80 kali. Fh(merah) = …",
    kind: "fill",
    answers: ["24"],
    discussion: ["P(merah) = 3/10, Fh = (3/10) × 80 = 24."],
  },
  {
    id: "g6",
    label:
      "Dadu dilempar 36 kali. Fh(mata kelipatan 3) = …",
    kind: "fill",
    answers: ["12"],
    discussion: ["Kelipatan 3 = {3,6}, P = 2/6 = 1/3, Fh = (1/3) × 36 = 12."],
  },
  {
    id: "g7",
    label:
      "Pernyataan: Frekuensi harapan SELALU sama dengan frekuensi nyata yang muncul di eksperimen.",
    kind: "truefalse",
    correct: false,
    discussion: [
      "SALAH. Itu prediksi — hasil nyata bisa beda, terutama saat n kecil.",
    ],
  },
  {
    id: "g8",
    label:
      "Sebuah toko mengamati: peluang pelanggan membeli kopi = 0,3. Jika ada 200 pelanggan, Fh(membeli kopi) = …",
    kind: "fill",
    answers: ["60"],
    discussion: ["Fh = 0,3 × 200 = 60 pelanggan."],
  },
  {
    id: "g9",
    label:
      "Probabilitas suatu lampu rusak = 0,02. Dari 500 lampu, frekuensi harapan rusak = …",
    kind: "fill",
    answers: ["10"],
    discussion: ["Fh = 0,02 × 500 = 10 lampu."],
  },
  {
    id: "g10",
    label: "Pasangkan EKSPERIMEN dengan FREKUENSI HARAPAN-nya:",
    kind: "match",
    pairs: [
      { left: "Dadu 60×, mata 5", right: "10" },
      { left: "Koin 80×, Angka", right: "40" },
      { left: "Dadu 30×, genap", right: "15" },
      { left: "2 koin 80×, AA", right: "20" },
    ],
    discussion: ["Fh = P(A) × n untuk masing-masing."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Rumus Frekuensi Harapan",
    text: "Fh(A) = P(A) × n. Frekuensi harapan = peluang teoretik × banyak percobaan.",
    tone: "cyan",
  },
  {
    title: "Sifat Frekuensi Harapan",
    text: "Fh adalah PREDIKSI, bukan kepastian. Hasil eksperimen sebenarnya bisa berbeda — tapi mendekati Fh saat n besar.",
    tone: "violet",
  },
  {
    title: "Aplikasi Nyata",
    text: "Digunakan dalam KENDALI MUTU pabrik, ASURANSI (klaim), prediksi PEMASARAN, ramalan CUACA, dan banyak lagi!",
    tone: "amber",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "fh-game-jenis",
    title: "🎯 Game 1 — Tentukan Frekuensi Harapan",
    description: "Seret tiap eksperimen ke nilai frekuensi harapan yang TEPAT!",
    buckets: [
      { id: "f10", label: "Fh = 10", emoji: "🔟", color: "cyan" },
      { id: "f15", label: "Fh = 15", emoji: "📊", color: "violet" },
      { id: "f20", label: "Fh = 20", emoji: "📈", color: "emerald" },
      { id: "f30", label: "Fh = 30", emoji: "🎯", color: "amber" },
    ],
    items: [
      { id: "x1", label: "Dadu 60×, mata 5", bucketId: "f10", emoji: "🎲" },
      { id: "x2", label: "Dadu 60×, mata 1", bucketId: "f10", emoji: "🎲" },
      { id: "x3", label: "Dadu 30×, genap", bucketId: "f15", emoji: "🎲" },
      { id: "x4", label: "Koin 30×, Angka", bucketId: "f15", emoji: "🪙" },
      { id: "x5", label: "Koin 40×, Angka", bucketId: "f20", emoji: "🪙" },
      { id: "x6", label: "Dadu 60×, kelipatan 3", bucketId: "f20", emoji: "🎲" },
      { id: "x7", label: "Koin 60×, Gambar", bucketId: "f30", emoji: "🪙" },
      { id: "x8", label: "Dadu 90×, mata > 4", bucketId: "f30", emoji: "🎲" },
    ],
  },
  {
    kind: "arrow-match",
    id: "fh-game-hitung",
    title: "🎯 Game 2 — Prediksi Frekuensi",
    description: "Pasangkan eksperimen dengan Fh-nya. Tekan ◀ ▶.",
    rightOptions: ["5", "12", "24", "40", "50", "60", "100"],
    pairs: [
      { id: "y1", left: "Dadu 30×, mata 6", correctRight: "5", emoji: "🎲" },
      { id: "y2", left: "Dadu 36×, kelipatan 3", correctRight: "12", emoji: "🎲" },
      { id: "y3", left: "Kelereng (3M/10), 80×, merah", correctRight: "24", emoji: "🔴" },
      { id: "y4", left: "Koin 80×, Angka", correctRight: "40", emoji: "🪙" },
      { id: "y5", left: "Dadu 100×, ganjil", correctRight: "50", emoji: "🎲" },
      { id: "y6", left: "Koin 120×, Gambar", correctRight: "60", emoji: "🪙" },
      { id: "y7", left: "Lampu rusak (P=0.02), 5000", correctRight: "100", emoji: "💡" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Dadu dilempar 120 kali. Fh(mata 4) = …",
    kind: "fill",
    answers: ["20"],
    hint: "(1/6) × 120.",
    discussion: ["Fh = (1/6) × 120 = 20."],
  },
  {
    id: "pp2",
    question: "Koin dilempar 250 kali. Fh(Angka) = …",
    kind: "fill",
    answers: ["125"],
    hint: "(1/2) × 250.",
    discussion: ["Fh = (1/2) × 250 = 125."],
  },
  {
    id: "pp3",
    question: "Dadu dilempar 144 kali. Fh(mata prima) = …",
    kind: "fill",
    answers: ["72"],
    hint: "Prima dadu = {2,3,5}, P=3/6=1/2.",
    discussion: ["Fh = (1/2) × 144 = 72."],
  },
  {
    id: "pp4",
    question:
      "Dari kotak (5 merah, 3 biru, 2 hijau), diambil acak dengan pengembalian 100 kali. Fh(BIRU) = …",
    kind: "fill",
    answers: ["30"],
    hint: "P(biru) = 3/10.",
    discussion: ["Fh = 0,3 × 100 = 30."],
  },
  {
    id: "pp5",
    question:
      "Pabrik memproduksi 4000 sepatu. Peluang cacat 0,015. Fh(cacat) = …",
    kind: "fill",
    answers: ["60"],
    hint: "0,015 × 4000.",
    discussion: ["Fh = 0,015 × 4000 = 60 sepatu cacat."],
  },
  {
    id: "pp6",
    question:
      "Lempar 2 dadu sebanyak 360 kali. Fh(jumlah mata = 7) = …",
    kind: "fill",
    answers: ["60"],
    hint: "P(jumlah=7) = 6/36 = 1/6.",
    discussion: ["Fh = (1/6) × 360 = 60."],
  },
  {
    id: "pp7",
    question:
      "Pernyataan: Jika Fh(A) = 20 dari 60 percobaan, maka P(A) = 1/3.",
    kind: "truefalse",
    correct: true,
    hint: "P(A) = Fh / n.",
    discussion: ["BENAR. P(A) = 20/60 = 1/3."],
  },
  {
    id: "pp8",
    question:
      "Sebuah perusahaan asuransi memprediksi peluang klaim 0,04. Dari 2500 nasabah, Fh(klaim) = …",
    kind: "fill",
    answers: ["100"],
    hint: "0,04 × 2500.",
    discussion: ["Fh = 0,04 × 2500 = 100 klaim."],
  },
];

const FrekuensiHarapanLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Peluang"
    title="Frekuensi Harapan — Penemuan Terbimbing"
    intro="Sobat Numatik 📈! Yuk MEMPREDIKSI hasil eksperimen — berapa kali mata 6 muncul jika dadu dilempar 60 kali? Kamu akan menemukan rumus Fh(A) = P(A) × n dan menerapkannya pada masalah pabrik, asuransi, dan toko!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan rumus frekuensi harapan."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/peluang"
    backLabel="Kembali ke Menu Peluang"
    scoreMessages={{
      perfect: "🌟 Mantap! Frekuensi harapan sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Ulang lagi Fh = P(A) × n.",
      low: "💪 Tetap semangat! Mulai dari koin & dadu sederhana.",
    }}
  />
);

export default FrekuensiHarapanLKPDPage;
