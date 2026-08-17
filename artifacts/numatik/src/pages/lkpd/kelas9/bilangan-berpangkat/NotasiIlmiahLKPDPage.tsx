import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Jarak Bumi ke Matahari",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-700/20 border border-amber-300/40 p-3">
        <svg viewBox="0 0 280 160" className="w-full">
          <rect width="280" height="160" fill="#0b1220" rx="8" />
          <circle cx="50" cy="80" r="22" fill="#fbbf24" stroke="#fde68a" strokeWidth="2" />
          <text x="50" y="84" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">☀️</text>
          <circle cx="230" cy="80" r="11" fill="#22d3ee" stroke="#67e8f9" strokeWidth="2" />
          <text x="230" y="84" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">🌍</text>
          <line x1="72" y1="80" x2="219" y2="80" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 3" />
          <text x="145" y="55" fontSize="11" fontWeight="bold" fill="#fbbf24" textAnchor="middle">150.000.000 km</text>
          <text x="145" y="120" fontSize="13" fontWeight="bold" fill="#34d399" textAnchor="middle">= 1,5 × 10⁸ km</text>
          <text x="145" y="140" fontSize="9" fill="#a7f3d0" textAnchor="middle">Lebih ringkas, kan?</text>
        </svg>
      </div>
    ),
    text:
      "Jarak Bumi ke Matahari ≈ 150.000.000 km. Ditulis dalam NOTASI ILMIAH menjadi 1,5 × 10⁸ km. Notasi ilmiah membuat bilangan SANGAT BESAR atau SANGAT KECIL menjadi MUDAH ditulis & dihitung!",
  },
  {
    title: "Situasi 2 — Ukuran Bakteri",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 280 140" className="w-full">
          <rect width="280" height="140" fill="#0b1220" rx="8" />
          <ellipse cx="140" cy="70" rx="32" ry="20" fill="#34d399" fillOpacity="0.7" stroke="#6ee7b7" strokeWidth="2" />
          <text x="140" y="74" fontSize="13" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">🦠</text>
          <text x="140" y="30" fontSize="11" fontWeight="bold" fill="#fbbf24" textAnchor="middle">0,000002 m</text>
          <text x="140" y="115" fontSize="13" fontWeight="bold" fill="#67e8f9" textAnchor="middle">= 2 × 10⁻⁶ m</text>
          <text x="140" y="132" fontSize="9" fill="#a7f3d0" textAnchor="middle">Pangkat NEGATIF untuk bilangan kecil!</text>
        </svg>
      </div>
    ),
    text:
      "Sebuah bakteri berukuran 0,000002 m = 2 × 10⁻⁶ m. Pangkat 10 NEGATIF dipakai untuk bilangan KECIL. Pangkat 10 POSITIF dipakai untuk bilangan BESAR.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Bentuk umum NOTASI ILMIAH adalah a × 10ⁿ. Nilai a harus memenuhi …",
    kind: "choice",
    options: ["0 ≤ a ≤ 10", "1 ≤ a < 10", "1 < a ≤ 10", "a > 10"],
    correctIndex: 1,
    discussion: [
      "Pada notasi ilmiah, BAGIAN MANTISA (a) harus memenuhi 1 ≤ a < 10.",
      "n adalah bilangan BULAT (positif/negatif/nol).",
    ],
  },
  {
    id: "g2",
    label: "Tulis 7.500 dalam notasi ilmiah = …",
    kind: "fill",
    answers: ["7,5 × 10³", "7,5×10³", "7.5 × 10³", "7.5x10³", "7,5×10^3", "7.5x10^3"],
    discussion: [
      "Geser koma 3 langkah ke KIRI: 7.500 → 7,5.",
      "Pangkat = 3 (geser kiri = pangkat positif).",
      "Hasil: 7,5 × 10³.",
    ],
  },
  {
    id: "g3",
    label: "Tulis 0,0042 dalam notasi ilmiah = …",
    kind: "fill",
    answers: ["4,2 × 10⁻³", "4,2×10⁻³", "4.2 × 10⁻³", "4,2×10^-3", "4.2x10^-3", "4,2 × 10-3"],
    discussion: [
      "Geser koma 3 langkah ke KANAN: 0,0042 → 4,2.",
      "Pangkat = −3 (geser kanan = pangkat negatif).",
      "Hasil: 4,2 × 10⁻³.",
    ],
  },
  {
    id: "g4",
    label:
      "Aturan: Untuk bilangan BESAR (≥ 10), pangkat 10 bernilai … dan untuk bilangan KECIL (< 1), pangkat 10 bernilai …",
    kind: "choice",
    options: [
      "negatif dan positif",
      "positif dan negatif",
      "nol dan positif",
      "selalu positif",
    ],
    correctIndex: 1,
    discussion: [
      "Bilangan ≥ 10 (besar) → pangkat POSITIF (geser koma ke kiri).",
      "Bilangan < 1 (kecil) → pangkat NEGATIF (geser koma ke kanan).",
    ],
  },
  {
    id: "g5",
    label: "Tulis 6,3 × 10⁴ dalam notasi standar = …",
    kind: "fill",
    answers: ["63000", "63.000", "63,000"],
    discussion: [
      "10⁴ = 10.000.",
      "6,3 × 10.000 = 63.000.",
      "Atau: geser koma 4 langkah ke kanan: 6,3 → 63.000.",
    ],
  },
  {
    id: "g6",
    label: "Tulis 2,5 × 10⁻⁴ dalam notasi standar = …",
    kind: "fill",
    answers: ["0,00025", "0.00025"],
    discussion: [
      "10⁻⁴ = 0,0001.",
      "2,5 × 0,0001 = 0,00025.",
      "Atau: geser koma 4 langkah ke kiri: 2,5 → 0,00025.",
    ],
  },
  {
    id: "g7",
    label:
      "Apakah 25 × 10⁵ adalah notasi ilmiah yang BENAR?",
    kind: "choice",
    options: [
      "Ya, sudah benar",
      "Tidak, mantisa harus 1 ≤ a < 10",
      "Ya, asal pangkatnya bulat",
      "Tidak, harus pangkat negatif",
    ],
    correctIndex: 1,
    discussion: [
      "TIDAK BENAR. Mantisa 25 melanggar 1 ≤ a < 10.",
      "Yang benar: 2,5 × 10⁶.",
    ],
  },
  {
    id: "g8",
    label:
      "Hasil (3 × 10⁴) × (2 × 10³) dalam notasi ilmiah = …",
    kind: "fill",
    answers: ["6 × 10⁷", "6×10⁷", "6 × 10^7", "6x10^7"],
    discussion: [
      "Kalikan mantisa: 3 × 2 = 6.",
      "Tambah pangkat 10: 4 + 3 = 7.",
      "Hasil: 6 × 10⁷.",
    ],
  },
  {
    id: "g9",
    label: "Hasil (8 × 10⁵) ÷ (2 × 10²) = …",
    kind: "fill",
    answers: ["4 × 10³", "4×10³", "4 × 10^3", "4x10^3", "4000", "4.000"],
    discussion: [
      "Bagi mantisa: 8 ÷ 2 = 4.",
      "Kurangi pangkat: 5 − 2 = 3.",
      "Hasil: 4 × 10³ = 4.000.",
    ],
  },
  {
    id: "g10",
    label:
      "Pernyataan: 0,5 × 10⁵ adalah notasi ilmiah yang valid.",
    kind: "truefalse",
    correct: false,
    discussion: [
      "SALAH. Mantisa 0,5 melanggar 1 ≤ a < 10.",
      "Yang benar: 5 × 10⁴.",
    ],
  },
  {
    id: "g11",
    label:
      "Massa 1 elektron ≈ 9 × 10⁻³¹ kg. Manakah penulisan standar yang BENAR?",
    kind: "choice",
    options: [
      "9.000.000.000.000.000.000.000.000.000.000 kg",
      "0,000…0009 kg (30 nol setelah koma, lalu 9)",
      "9 × 31 kg",
      "0,931 kg",
    ],
    correctIndex: 1,
    discussion: [
      "10⁻³¹ artinya geser koma 31 langkah ke kiri.",
      "Hasil: 0,000…0009 dengan total 30 NOL setelah koma sebelum angka 9.",
      "Sangat panjang! Itulah mengapa notasi ilmiah dipakai.",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan bilangan dengan notasi ilmiahnya:",
    kind: "match",
    pairs: [
      { left: "300.000", right: "3 × 10⁵" },
      { left: "0,00045", right: "4,5 × 10⁻⁴" },
      { left: "82.000", right: "8,2 × 10⁴" },
      { left: "0,007", right: "7 × 10⁻³" },
    ],
    discussion: [
      "300.000 → geser koma 5 ke kiri → 3 × 10⁵.",
      "0,00045 → geser koma 4 ke kanan → 4,5 × 10⁻⁴.",
      "82.000 → geser koma 4 ke kiri → 8,2 × 10⁴.",
      "0,007 → geser koma 3 ke kanan → 7 × 10⁻³.",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Bentuk Notasi Ilmiah",
    text: "a × 10ⁿ, dengan 1 ≤ a < 10 dan n bilangan BULAT. Bilangan BESAR → n positif. Bilangan KECIL (< 1) → n negatif.",
    tone: "yellow",
  },
  {
    title: "Konversi Bolak-Balik",
    text: "Standar → Ilmiah: geser koma sampai a memenuhi 1 ≤ a < 10. Hitung berapa langkah. Ke kiri = pangkat positif. Ke kanan = pangkat negatif.",
    tone: "cyan",
  },
  {
    title: "Operasi Notasi Ilmiah",
    text: "(a × 10ᵐ) × (b × 10ⁿ) = (a×b) × 10ᵐ⁺ⁿ. (a × 10ᵐ) ÷ (b × 10ⁿ) = (a÷b) × 10ᵐ⁻ⁿ. Setelah hitung, normalisasi mantisa agar 1 ≤ a < 10.",
    tone: "rose",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "notasi-game-valid",
    title: "🎯 Game 1 — Sah atau Tidak? (Seret!)",
    description: "Seret setiap notasi ke kategori SAH (notasi ilmiah benar) atau TIDAK SAH (mantisa salah).",
    buckets: [
      { id: "sah", label: "✅ SAH (notasi ilmiah benar)", emoji: "✅", color: "emerald" },
      { id: "tidak", label: "❌ TIDAK SAH (perlu dinormalisasi)", emoji: "❌", color: "rose" },
    ],
    items: [
      { id: "n1", label: "3,2 × 10⁵", bucketId: "sah", emoji: "🔬" },
      { id: "n2", label: "12 × 10⁴", bucketId: "tidak", emoji: "🔬" },
      { id: "n3", label: "0,7 × 10⁻³", bucketId: "tidak", emoji: "🔬" },
      { id: "n4", label: "5,9 × 10⁻⁷", bucketId: "sah", emoji: "🔬" },
      { id: "n5", label: "9,99 × 10⁰", bucketId: "sah", emoji: "🔬" },
      { id: "n6", label: "10 × 10²", bucketId: "tidak", emoji: "🔬" },
      { id: "n7", label: "1 × 10⁻¹⁰", bucketId: "sah", emoji: "🔬" },
      { id: "n8", label: "0,05 × 10⁻¹", bucketId: "tidak", emoji: "🔬" },
    ],
  },
  {
    kind: "arrow-match",
    id: "notasi-game-konversi",
    title: "🎯 Game 2 — Konversi ke Notasi Ilmiah",
    description: "Pasangkan bilangan standar dengan notasi ilmiahnya. Tekan ◀ ▶.",
    rightOptions: [
      "3 × 10⁵",
      "4,5 × 10⁻⁴",
      "5 × 10⁻³",
      "6,2 × 10⁴",
      "8,2 × 10⁴",
      "1,5 × 10⁸",
      "9 × 10⁻⁶",
    ],
    pairs: [
      { id: "k1", left: "300.000", correctRight: "3 × 10⁵", emoji: "🔬" },
      { id: "k2", left: "0,00045", correctRight: "4,5 × 10⁻⁴", emoji: "🔬" },
      { id: "k3", left: "82.000", correctRight: "8,2 × 10⁴", emoji: "🔬" },
      { id: "k4", left: "62.000", correctRight: "6,2 × 10⁴", emoji: "🔬" },
      { id: "k5", left: "0,005", correctRight: "5 × 10⁻³", emoji: "🔬" },
      { id: "k6", left: "150.000.000", correctRight: "1,5 × 10⁸", emoji: "🔬" },
      { id: "k7", left: "0,000009", correctRight: "9 × 10⁻⁶", emoji: "🔬" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Tulis 56.000 dalam notasi ilmiah = …",
    kind: "fill",
    answers: ["5,6 × 10⁴", "5,6×10⁴", "5.6 × 10⁴", "5.6x10^4"],
    hint: "Geser koma sampai mantisa antara 1 dan 10.",
    discussion: ["56.000 → 5,6 × 10⁴ (geser 4 langkah ke kiri)."],
  },
  {
    id: "pp2",
    question: "Tulis 0,000089 dalam notasi ilmiah = …",
    kind: "fill",
    answers: ["8,9 × 10⁻⁵", "8,9×10⁻⁵", "8.9 × 10⁻⁵", "8.9x10^-5"],
    hint: "Geser koma ke KANAN, pangkat NEGATIF.",
    discussion: ["0,000089 → 8,9 × 10⁻⁵ (geser 5 langkah ke kanan)."],
  },
  {
    id: "pp3",
    question: "Tulis 4,7 × 10³ dalam notasi standar = …",
    kind: "fill",
    answers: ["4700", "4.700", "4,700"],
    hint: "Geser koma 3 langkah ke kanan.",
    discussion: ["4,7 × 1.000 = 4.700."],
  },
  {
    id: "pp4",
    question: "Tulis 9 × 10⁻⁵ dalam notasi standar = …",
    kind: "fill",
    answers: ["0,00009", "0.00009"],
    hint: "Geser koma 5 langkah ke kiri.",
    discussion: ["9 × 0,00001 = 0,00009."],
  },
  {
    id: "pp5",
    question:
      "Hasil (4 × 10⁵) × (2 × 10³) dalam notasi ilmiah = …",
    kind: "fill",
    answers: ["8 × 10⁸", "8×10⁸", "8 × 10^8", "8x10^8"],
    hint: "Kalikan mantisa, tambah pangkat.",
    discussion: ["4×2 = 8, 5+3 = 8 → 8 × 10⁸."],
  },
  {
    id: "pp6",
    question:
      "Hasil (9 × 10⁷) ÷ (3 × 10²) dalam notasi ilmiah = …",
    kind: "fill",
    answers: ["3 × 10⁵", "3×10⁵", "3 × 10^5", "3x10^5"],
    hint: "Bagi mantisa, kurangi pangkat.",
    discussion: ["9÷3 = 3, 7−2 = 5 → 3 × 10⁵."],
  },
  {
    id: "pp7",
    question:
      "Jarak Bumi ke Bulan ≈ 384.000 km. Notasi ilmiahnya = …",
    kind: "fill",
    answers: ["3,84 × 10⁵", "3,84×10⁵", "3.84 × 10⁵", "3.84x10^5"],
    hint: "Geser koma 5 langkah ke kiri.",
    discussion: ["384.000 → 3,84 × 10⁵."],
  },
  {
    id: "pp8",
    question:
      "Pernyataan: 0,3 × 10⁻² adalah notasi ilmiah yang VALID.",
    kind: "truefalse",
    correct: false,
    hint: "Cek apakah 1 ≤ mantisa < 10.",
    discussion: [
      "SALAH. Mantisa 0,3 < 1 → tidak memenuhi syarat.",
      "Bentuk benar: 3 × 10⁻³.",
    ],
  },
];

const roundingLesson = (
  <section className="mb-6 overflow-hidden rounded-3xl border border-amber-200/30 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-rose-500/15 p-5 md:p-7 backdrop-blur">
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-300/20 font-display text-xl font-bold text-amber-100">≈</div>
      <div>
        <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-amber-200/80">Sub-Bab 3 · Operasi pada Notasi Ilmiah</p>
        <h2 className="font-display text-xl font-bold text-amber-50 md:text-2xl">Membulatkan Bilangan dalam Notasi Ilmiah</h2>
      </div>
    </div>
    <div className="rounded-2xl border border-amber-100/20 bg-slate-950/35 p-4 text-center md:p-6">
      <p className="mb-3 font-body text-sm text-white/70">Rumus cepat pembulatan</p>
      <p className="font-display text-lg font-bold text-amber-100 md:text-2xl">DIGIT ≥ 5 → angka kiri + 1 &nbsp; | &nbsp; DIGIT &lt; 5 → tetap</p>
    </div>
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <h3 className="mb-2 font-display text-base font-bold text-cyan-100">Contoh langkah demi langkah</h3>
        <p className="font-body text-sm leading-6 text-white/80">12.345.689.000 = 1,2345689 × 10¹⁰. Dibulatkan menjadi 2 angka di belakang koma, pertahankan 1,23. Digit berikutnya adalah 4, sehingga tidak menambah angka 3.</p>
        <p className="mt-3 font-display text-lg font-bold text-emerald-200">1,2345689 × 10¹⁰ ≈ 1,23 × 10¹⁰</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <h3 className="mb-2 font-display text-base font-bold text-fuchsia-100">Jika digit berikutnya ≥ 5</h3>
        <p className="font-body text-sm leading-6 text-white/80">Naikkan angka terakhir yang dipertahankan satu tingkat ke kiri. Jika digit berikutnya &lt; 5, hapus digit setelahnya tanpa mengubah angka yang dipertahankan.</p>
        <p className="mt-3 font-body text-sm font-semibold text-yellow-100">Contoh: 3,4567 × 10⁵ ≈ 3,46 × 10⁵ karena 6 ≥ 5.</p>
      </div>
    </div>
    <div className="mt-5 grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl bg-cyan-400/10 p-4"><h3 className="font-display font-bold text-cyan-100">Rangkuman</h3><p className="mt-2 font-body text-sm leading-6 text-white/75">Notasi ilmiah berbentuk a × 10ⁿ dengan 1 ≤ a &lt; 10. Pangkat menunjukkan banyak pergeseran koma.</p></div>
      <div className="rounded-2xl bg-violet-400/10 p-4"><h3 className="font-display font-bold text-violet-100">Tips dan trik</h3><p className="mt-2 font-body text-sm leading-6 text-white/75">Normalisasi koefisien dulu, tentukan banyak angka yang dipertahankan, lalu lihat tepat satu digit sesudahnya.</p></div>
      <div className="rounded-2xl bg-emerald-400/10 p-4"><h3 className="font-display font-bold text-emerald-100">Kesimpulan</h3><p className="mt-2 font-body text-sm leading-6 text-white/75">Pembulatan membuat hasil lebih ringkas tetapi tetap mendekati nilai asli. Aturan digit 5 adalah kuncinya.</p></div>
    </div>
  </section>
);

const NotasiIlmiahLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Bilangan Berpangkat"
    title="Notasi Ilmiah — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo taklukkan NOTASI ILMIAH 🔬! Kamu akan menemukan cara menulis bilangan SUPER BESAR dan SUPER KECIL dengan ringkas — sambil bermain seret kartu menyortir notasi yang sah & tidak sah!"
    situations={situations}
    guidedIntro="Jawab soal-soal berurutan. Setiap jawabanmu menuntun pada aturan notasi ilmiah."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    midSlot={roundingLesson}
    games={games}
    practiceIntro="Asah pemahamanmu tentang notasi ilmiah dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/bilangan-berpangkat"
    backLabel="Kembali ke Menu Bilangan Berpangkat"
    scoreMessages={{
      perfect: "🌟 Mantap! Notasi ilmiah sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Pelajari ulang aturan 1 ≤ a < 10 dan arah pangkat.",
      low: "💪 Tetap semangat! Mulai dari aturan dasar: a × 10ⁿ dengan 1 ≤ a < 10.",
    }}
  />
);

export default NotasiIlmiahLKPDPage;
