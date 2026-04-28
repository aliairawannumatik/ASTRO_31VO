import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Luas Persegi Panjang",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-emerald-700/20 border border-amber-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="11" fontWeight="bold" fill="#fde68a" textAnchor="middle">Persegi panjang: panjang 5 m lebih dari lebar</text>
          <text x="140" y="38" fontSize="10" fill="#a7f3d0" textAnchor="middle">Luas = 84 m². Cari panjang & lebar.</text>
          <rect x="50" y="55" width="180" height="80" rx="6" fill="#fbbf24" fillOpacity="0.3" stroke="#fde68a" strokeWidth="2" />
          <text x="140" y="100" fontSize="13" fontWeight="bold" fill="#fff" textAnchor="middle">L = (x + 5) × x = 84</text>
          <text x="140" y="125" fontSize="10" fill="#fde68a" textAnchor="middle">x + 5</text>
          <text x="40" y="100" fontSize="10" fill="#fde68a" textAnchor="middle">x</text>
          <rect x="20" y="148" width="240" height="22" rx="6" fill="#22d3ee" fillOpacity="0.4" />
          <text x="140" y="164" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">x² + 5x − 84 = 0 → (x − 7)(x + 12) = 0</text>
          <rect x="20" y="174" width="240" height="22" rx="6" fill="#34d399" fillOpacity="0.45" />
          <text x="140" y="190" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">x = 7 (lebar), panjang = 12 m</text>
        </svg>
      </div>
    ),
    text:
      "Banyak masalah nyata yang menghasilkan PERSAMAAN KUADRAT: luas, tinggi proyektil, biaya, kecepatan. Langkah: (1) Misalkan dengan x; (2) Buat model PK; (3) Selesaikan; (4) Cek kewajaran (nilai harus POSITIF jika berupa panjang/waktu).",
  },
  {
    title: "Situasi 2 — Lintasan Bola (Gerak Parabola)",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-rose-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="20" fontSize="10" fontWeight="bold" fill="#67e8f9" textAnchor="middle">Bola: h(t) = −5t² + 20t (meter)</text>
          <line x1="20" y1="170" x2="260" y2="170" stroke="#94a3b8" strokeWidth="1" />
          <text x="20" y="185" fontSize="9" fill="#94a3b8">t = 0</text>
          <text x="250" y="185" fontSize="9" fill="#94a3b8" textAnchor="end">tanah</text>
          <path d="M 30 170 Q 140 30 250 170" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
          <circle cx="30" cy="170" r="4" fill="#fde68a" />
          <circle cx="140" cy="65" r="6" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" />
          <text x="140" y="55" fontSize="9" fill="#fde68a" textAnchor="middle">puncak (t=2, h=20)</text>
          <circle cx="250" cy="170" r="4" fill="#fde68a" />
          <text x="250" y="160" fontSize="9" fill="#fde68a" textAnchor="end">jatuh (t=4)</text>
          <text x="140" y="195" fontSize="9" fill="#a7f3d0" textAnchor="middle">Kapan bola di tanah? h(t) = 0</text>
        </svg>
      </div>
    ),
    text:
      "Lintasan bola/proyektil membentuk PARABOLA. Kapan bola di tanah? h(t)=0 → PK. Tinggi maksimum? Pakai puncak parabola: t = −b/(2a). Kapan tinggi tertentu? h(t)=k → PK lagi!",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Persegi panjang panjangnya 5 m lebih dari lebar (x). Maka panjang = …",
    kind: "fill",
    answers: ["x+5", "x + 5"],
    discussion: ["panjang = x + 5."],
  },
  {
    id: "g2",
    label: "Jika luas = 84 m², modelnya menjadi …",
    kind: "choice",
    options: [
      "x² + 5x − 84 = 0",
      "x² − 5x + 84 = 0",
      "x² + 5x + 84 = 0",
      "x² − 5x − 84 = 0",
    ],
    correctIndex: 0,
    discussion: ["L = x(x+5) = 84 → x² + 5x − 84 = 0."],
  },
  {
    id: "g3",
    label: "Faktorisasi x² + 5x − 84 = 0 → (x − 7)(x + 12) = 0. Akarnya …",
    kind: "choice",
    options: ["x = 7 atau x = −12", "x = −7 atau x = 12", "x = 7 atau x = 12", "x = −7 atau x = −12"],
    correctIndex: 0,
    discussion: ["x = 7 atau x = −12."],
  },
  {
    id: "g4",
    label:
      "Karena x = lebar (panjang ⇒ HARUS POSITIF), pilih x = … (m)",
    kind: "fill",
    answers: ["7"],
    discussion: ["x = −12 ditolak (tidak ada panjang negatif)."],
  },
  {
    id: "g5",
    label: "Maka panjangnya = x + 5 = … (m)",
    kind: "fill",
    answers: ["12"],
    discussion: ["7 + 5 = 12."],
  },
  {
    id: "g6",
    label:
      "Lintasan bola: h(t) = −5t² + 20t. Bola DI TANAH ketika h(t) = 0. PK-nya …",
    kind: "choice",
    options: [
      "−5t² + 20t = 0",
      "5t² − 20t = 0",
      "Keduanya sama (cuma kali −1)",
      "Tidak bisa diselesaikan",
    ],
    correctIndex: 2,
    discussion: ["−5t² + 20t = 0 ⇔ 5t² − 20t = 0. Sama saja."],
  },
  {
    id: "g7",
    label: "Faktorkan 5t(t − 4) = 0 → t = 0 atau t = …",
    kind: "fill",
    answers: ["4"],
    discussion: ["t = 0 (saat dilempar) atau t = 4 (saat jatuh)."],
  },
  {
    id: "g8",
    label:
      "Tinggi maksimum bola tercapai pada t = −b/(2a) = …",
    kind: "fill",
    answers: ["2"],
    discussion: ["t = −20/(2·−5) = 2 detik."],
  },
  {
    id: "g9",
    label: "Tinggi maksimum bola = h(2) = … (m)",
    kind: "fill",
    answers: ["20"],
    discussion: ["h(2) = −5(4) + 20(2) = −20 + 40 = 20 m."],
  },
  {
    id: "g10",
    label:
      "Pernyataan: Pada soal kontekstual, akar negatif sering DITOLAK karena tidak masuk akal (panjang, waktu, jumlah orang).",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Selalu CEK KEWAJARAN solusi, terutama untuk besaran POSITIF.",
    ],
  },
  {
    id: "g11",
    label: "Pasangkan masalah dengan PK-nya:",
    kind: "match",
    pairs: [
      { left: "Luas PP = 84 m², panjang 5 lebih dari lebar", right: "x² + 5x − 84 = 0" },
      { left: "Selisih kuadrat 2 bilangan = 24, beda 2", right: "Sederhana → 4(x+1) = 24" },
      { left: "Bola: h = −5t² + 30t. Kapan h = 25?", right: "5t² − 30t + 25 = 0" },
      { left: "Hasil kali 2 bilangan beda 3 = 40", right: "x² + 3x − 40 = 0" },
    ],
    discussion: ["Setiap soal punya pemodelan PK yang khas."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Langkah Pemodelan",
    text: "1) Misalkan dengan variabel x. 2) Susun model matematika ke bentuk PK. 3) Selesaikan PK. 4) CEK KEWAJARAN.",
    tone: "amber",
  },
  {
    title: "Pilih Solusi yang Masuk Akal",
    text: "Untuk panjang, lebar, waktu, jumlah → akar harus POSITIF. Tolak akar negatif jika tidak relevan dengan konteks.",
    tone: "emerald",
  },
  {
    title: "Aplikasi Umum",
    text: "Luas geometri, lintasan proyektil (gerak parabola), masalah angka, biaya & laba, kecepatan & waktu — semua menghasilkan PK.",
    tone: "cyan",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "kontekstual-game-model",
    title: "🎯 Game 1 — Pasang Soal ↔ PK",
    description: "Seret tiap MASALAH ke MODEL PK yang TEPAT!",
    buckets: [
      { id: "m1", label: "x² + 5x − 84 = 0", emoji: "📐", color: "cyan" },
      { id: "m2", label: "5t² − 30t = 0", emoji: "🏐", color: "violet" },
      { id: "m3", label: "x² − 7x + 12 = 0", emoji: "🔢", color: "amber" },
      { id: "m4", label: "x² + 3x − 40 = 0", emoji: "✖️", color: "rose" },
    ],
    items: [
      { id: "s1", label: "Luas PP=84, panjang 5 lebih dr lebar", bucketId: "m1", emoji: "📏" },
      { id: "s2", label: "Bola h=−5t²+30t, kapan h=0", bucketId: "m2", emoji: "🏐" },
      { id: "s3", label: "2 bilangan beda 1, hasil kali 12", bucketId: "m3", emoji: "🔢" },
      { id: "s4", label: "2 bilangan beda 3, hasil kali 40", bucketId: "m4", emoji: "✖️" },
      { id: "s5", label: "Luas PP=84 (varian)", bucketId: "m1", emoji: "📏" },
      { id: "s6", label: "2 bilangan, x dan x−7, hasil kali 12", bucketId: "m3", emoji: "🔢" },
    ],
  },
  {
    kind: "arrow-match",
    id: "kontekstual-game-jawab",
    title: "🎯 Game 2 — Jawaban Akhir",
    description: "Pasangkan tiap soal kontekstual dengan jawaban akhir. Tekan ◀ ▶.",
    rightOptions: [
      "panjang 12, lebar 7",
      "t = 4 detik",
      "h_max = 20 m",
      "x = 5 dan 8",
      "x = 7 dan 8",
      "panjang 10, lebar 6",
    ],
    pairs: [
      { id: "j1", left: "Luas PP=84, panjang−lebar=5", correctRight: "panjang 12, lebar 7", emoji: "📏" },
      { id: "j2", left: "Bola h=−5t²+20t, kapan jatuh?", correctRight: "t = 4 detik", emoji: "🏐" },
      { id: "j3", left: "Bola h=−5t²+20t, h_maks?", correctRight: "h_max = 20 m", emoji: "🏐" },
      { id: "j4", left: "2 bilangan beda 3, hasil kali 40", correctRight: "x = 5 dan 8", emoji: "🔢" },
      { id: "j5", left: "2 bilangan beda 1, hasil kali 56", correctRight: "x = 7 dan 8", emoji: "🔢" },
      { id: "j6", left: "Luas PP=60, panjang−lebar=4", correctRight: "panjang 10, lebar 6", emoji: "📏" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question:
      "Selisih dua bilangan asli adalah 5, dan hasil kalinya 84. Bilangan terbesar = …",
    kind: "fill",
    answers: ["12"],
    hint: "Misalkan x dan x+5. PK: x² + 5x − 84 = 0.",
    discussion: ["x = 7 (kecil) → besar = 12."],
  },
  {
    id: "pp2",
    question:
      "Bola dilempar: h(t) = −5t² + 30t. Kapan bola TIBA DI TANAH?",
    kind: "fill",
    answers: ["6"],
    hint: "h(t) = 0 → 5t(6 − t) = 0.",
    discussion: ["5t² − 30t = 0 → 5t(t−6)=0 → t=0 atau t=6 → tiba di tanah pada t=6 detik."],
  },
  {
    id: "pp3",
    question:
      "Pada lintasan h(t) = −5t² + 30t, tinggi MAKSIMUM bola = … (m)",
    kind: "fill",
    answers: ["45"],
    hint: "t puncak = −b/2a = 3.",
    discussion: ["h(3) = −45 + 90 = 45 m."],
  },
  {
    id: "pp4",
    question:
      "Persegi panjang luasnya 96 m² dan kelilingnya 40 m. Panjangnya = … (m)",
    kind: "choice",
    options: ["12", "10", "16", "8"],
    correctIndex: 0,
    hint: "p+l = 20, p·l = 96 → PK Vieta: x² − 20x + 96 = 0.",
    discussion: ["(x−12)(x−8)=0 → panjang = 12 m."],
  },
  {
    id: "pp5",
    question:
      "Jumlah dua bilangan asli berurutan ≤ 19, dan hasil kalinya 90. Bilangan tersebut adalah …",
    kind: "choice",
    options: ["9 dan 10", "8 dan 11", "7 dan 12", "6 dan 15"],
    correctIndex: 0,
    hint: "x(x+1) = 90.",
    discussion: ["x² + x − 90 = 0 → (x−9)(x+10)=0 → x = 9, jadi 9 dan 10."],
  },
  {
    id: "pp6",
    question:
      "Pernyataan: Pada masalah lintasan bola h(t) = −5t² + 20t, t = 0 dan t = 4 sama-sama saat bola DI TANAH.",
    kind: "truefalse",
    correct: true,
    hint: "h(0) = h(4) = 0.",
    discussion: ["BENAR. Bola dilempar saat t=0, dan jatuh kembali saat t=4."],
  },
  {
    id: "pp7",
    question:
      "Sebuah taman berbentuk persegi panjang dengan luas 200 m². Panjang 10 m lebih dari lebar. Lebar = … m.",
    kind: "fill",
    answers: ["10"],
    hint: "x(x+10) = 200.",
    discussion: ["x² + 10x − 200 = 0 → (x − 10)(x + 20) = 0 → x = 10 (lebar)."],
  },
  {
    id: "pp8",
    question:
      "Sebuah segitiga siku-siku memiliki dua sisi siku-siku x dan x+7, hipotenusa 13. Nilai x = …",
    kind: "fill",
    answers: ["5"],
    hint: "x² + (x+7)² = 169.",
    discussion: ["2x² + 14x + 49 = 169 → x² + 7x − 60 = 0 → (x − 5)(x + 12) = 0 → x = 5."],
  },
];

const PenerapanKontekstualLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Pengayaan PK"
    title="Penerapan Persamaan Kuadrat — Penemuan Terbimbing"
    intro="Sobat Numatik 🏗️! Saatnya MENERAPKAN PK pada masalah dunia nyata: luas tanah, lintasan bola, dua bilangan tersembunyi! Kamu akan menemukan langkah pemodelan: misalkan x → susun PK → selesaikan → CEK KEWAJARAN solusi."
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan strategi pemodelan."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/persamaan-kuadrat"
    backLabel="Kembali ke Menu Persamaan Kuadrat"
    scoreMessages={{
      perfect: "🌟 Mantap! Penerapan PK sudah kamu kuasai!",
      high: "👍 Bagus! Cek pemodelannya yang masih merah.",
      medium: "🚀 Lumayan. Hati-hati dengan TANDA & cek kewajaran.",
      low: "💪 Tetap semangat! Mulai dari membaca soal pelan-pelan.",
    }}
  />
);

export default PenerapanKontekstualLKPDPage;
