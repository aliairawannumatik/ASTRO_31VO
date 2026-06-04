import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Lipatan Kertas",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 240 160" className="w-full">
          <rect width="240" height="160" fill="#0b1220" rx="8" />
          <rect x="20" y="60" width="40" height="40" fill="#22d3ee" fillOpacity="0.6" stroke="#67e8f9" />
          <text x="40" y="115" fontSize="9" fill="#67e8f9" textAnchor="middle">2¹ = 2</text>
          <rect x="80" y="60" width="20" height="40" fill="#34d399" fillOpacity="0.6" stroke="#6ee7b7" />
          <rect x="100" y="60" width="20" height="40" fill="#34d399" fillOpacity="0.6" stroke="#6ee7b7" />
          <text x="100" y="115" fontSize="9" fill="#6ee7b7" textAnchor="middle">2² = 4</text>
          <g>
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={140 + i * 10} y="60" width="10" height="40" fill="#fbbf24" fillOpacity="0.6" stroke="#fde68a" />
            ))}
          </g>
          <text x="160" y="115" fontSize="9" fill="#fde68a" textAnchor="middle">2³ = 8</text>
          <g>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <rect key={i} x={195 + i * 5} y="60" width="5" height="40" fill="#f472b6" fillOpacity="0.6" stroke="#f9a8d4" />
            ))}
          </g>
          <text x="215" y="115" fontSize="9" fill="#f9a8d4" textAnchor="middle">2⁴ = 16</text>
          <text x="120" y="30" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">Setiap lipatan menggandakan jumlah lapisan!</text>
        </svg>
      </div>
    ),
    text:
      "Saat kita melipat kertas, lapisan menjadi dua kali lipat tiap lipatan. 1 → 2 → 4 → 8 → 16 → … Pola ini ditulis dengan PANGKAT: 2¹, 2², 2³, 2⁴ → 2ⁿ. Inilah contoh BILANGAN BERPANGKAT!",
  },
  {
    title: "Situasi 2 — Sel Membelah",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 240 160" className="w-full">
          <rect width="240" height="160" fill="#0b1220" rx="8" />
          <circle cx="40" cy="80" r="14" fill="#34d399" fillOpacity="0.7" stroke="#6ee7b7" />
          <text x="40" y="84" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">1</text>
          <text x="40" y="120" fontSize="9" fill="#6ee7b7" textAnchor="middle">3⁰=1</text>
          <g>{[0, 1, 2].map((i) => (
            <circle key={i} cx={80 + i * 22} cy="80" r="9" fill="#22d3ee" fillOpacity="0.7" stroke="#67e8f9" />
          ))}</g>
          <text x="102" y="120" fontSize="9" fill="#67e8f9" textAnchor="middle">3¹=3</text>
          <g>{Array.from({ length: 9 }, (_, i) => (
            <circle key={i} cx={140 + (i % 3) * 10} cy={70 + Math.floor(i / 3) * 9} r="4" fill="#fbbf24" fillOpacity="0.7" stroke="#fde68a" />
          ))}</g>
          <text x="155" y="120" fontSize="9" fill="#fde68a" textAnchor="middle">3²=9</text>
          <g>{Array.from({ length: 27 }, (_, i) => (
            <circle key={i} cx={185 + (i % 5) * 8} cy={62 + Math.floor(i / 5) * 7} r="2.5" fill="#f472b6" fillOpacity="0.7" stroke="#f9a8d4" />
          ))}</g>
          <text x="200" y="120" fontSize="9" fill="#f9a8d4" textAnchor="middle">3³=27</text>
        </svg>
      </div>
    ),
    text:
      "Sebuah sel membelah menjadi 3 setiap jam. Setelah n jam jumlah sel = 3ⁿ. Tapi 3⁰ = 1 (waktu awal). Bagaimana kalau pangkatnya NEGATIF atau NOL? Ayo kita selidiki!",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Bentuk 2 × 2 × 2 × 2 × 2 dapat ditulis sebagai … pangkat …",
    kind: "base-exp",
    base: "2",
    exp: "5",
    discussion: [
      "Ada 5 faktor 2 yang dikalikan, jadi 2 pangkat 5 (ditulis 2⁵).",
      "Pada aⁿ: a = BILANGAN POKOK (basis), n = PANGKAT (eksponen).",
    ],
  },
  {
    id: "g2",
    label: "Nilai dari 2⁵ adalah …",
    kind: "fill",
    answers: ["32"],
    discussion: ["2⁵ = 2 × 2 × 2 × 2 × 2 = 32."],
  },
  {
    id: "g3",
    label: "Bentuk 5 × 5 × 5 × 5 dapat ditulis sebagai … pangkat …",
    kind: "base-exp",
    base: "5",
    exp: "4",
    discussion: ["Ada 4 faktor 5, jadi 5 pangkat 4 (ditulis 5⁴) = 625."],
  },
  {
    id: "g4",
    label: "Pada notasi aⁿ, a disebut … dan n disebut …",
    kind: "choice",
    options: [
      "pangkat dan basis",
      "basis dan pangkat",
      "akar dan basis",
      "pangkat dan akar",
    ],
    correctIndex: 1,
    discussion: [
      "a = BASIS / BILANGAN POKOK.",
      "n = PANGKAT / EKSPONEN.",
    ],
  },
  {
    id: "g5",
    label: "Lengkapi pola: 2³ = 8, 2² = 4, 2¹ = 2, 2⁰ = …",
    kind: "fill",
    answers: ["1"],
    discussion: [
      "Pola pembagian dengan 2: 8 → 4 → 2 → 1.",
      "Jadi 2⁰ = 1.",
      "BERLAKU UMUM: a⁰ = 1 (untuk a ≠ 0).",
    ],
  },
  {
    id: "g6",
    label: "Lanjutkan pola: 2⁰ = 1, 2⁻¹ = …, 2⁻² = …",
    kind: "choice",
    options: [
      "−1 dan −2",
      "1/2 dan 1/4",
      "−2 dan −4",
      "1/2 dan 1/2²",
    ],
    correctIndex: 1,
    discussion: [
      "Pola pembagian dengan 2 terus: 1 → 1/2 → 1/4.",
      "Aturan: a⁻ⁿ = 1/aⁿ.",
      "Jadi 2⁻¹ = 1/2 dan 2⁻² = 1/4.",
    ],
  },
  {
    id: "g7",
    label: "Nilai 3⁻² adalah …",
    kind: "choice",
    options: ["−6", "−9", "1/6", "1/9"],
    correctIndex: 3,
    discussion: ["3⁻² = 1/3² = 1/9."],
  },
  {
    id: "g8",
    label: "Pernyataan: Setiap bilangan (selain 0) berpangkat NOL hasilnya selalu 1.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. a⁰ = 1 untuk semua a ≠ 0.",
      "0⁰ tidak terdefinisi.",
    ],
  },
  {
    id: "g9",
    label: "Nilai (−2)⁴ adalah …",
    kind: "fill",
    answers: ["16"],
    discussion: [
      "(−2)⁴ = (−2)(−2)(−2)(−2) = 4 × 4 = 16.",
      "Pangkat GENAP dari bilangan negatif → POSITIF.",
    ],
  },
  {
    id: "g10",
    label: "Nilai (−2)³ adalah …",
    kind: "fill",
    answers: ["-8", "−8"],
    discussion: [
      "(−2)³ = (−2)(−2)(−2) = 4 × (−2) = −8.",
      "Pangkat GANJIL dari bilangan negatif → NEGATIF.",
    ],
  },
  {
    id: "g11",
    label:
      "Hati-hati tanda kurung! −2⁴ = … (tanpa tanda kurung sebelum −).",
    kind: "fill",
    answers: ["-16", "−16"],
    discussion: [
      "−2⁴ ARTINYA −(2⁴) = −16.",
      "(−2)⁴ = 16. Tanda kurung MENGUBAH hasil!",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan setiap bentuk pangkat dengan nilainya:",
    kind: "match",
    pairs: [
      { left: "2⁰", right: "1" },
      { left: "3⁻¹", right: "1/3" },
      { left: "5²", right: "25" },
      { left: "(−3)²", right: "9" },
    ],
    discussion: [
      "2⁰ = 1 (a⁰ = 1).",
      "3⁻¹ = 1/3.",
      "5² = 25.",
      "(−3)² = 9 (negatif × negatif = positif).",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Definisi Pangkat",
    text: "aⁿ = a × a × … × a (n faktor). a = basis, n = pangkat. Berlaku untuk n bilangan bulat positif.",
    tone: "cyan",
  },
  {
    title: "Pangkat 0 & Negatif",
    text: "a⁰ = 1 (a ≠ 0). a⁻ⁿ = 1/aⁿ. Pangkat negatif berarti membalik (resiprok).",
    tone: "yellow",
  },
  {
    title: "Tanda Bilangan Berpangkat",
    text: "(−a) pangkat GENAP → positif. (−a) pangkat GANJIL → negatif. Tanpa kurung: −aⁿ = −(aⁿ), HATI-HATI!",
    tone: "rose",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "pangkat-game-tanda",
    title: "🎯 Game 1 — Klasifikasi Tanda (Seret!)",
    description: "Seret setiap bentuk pangkat ke kategori HASIL: positif, negatif, atau pecahan.",
    buckets: [
      { id: "pos", label: "POSITIF (>0)", emoji: "➕", color: "emerald" },
      { id: "neg", label: "NEGATIF (<0)", emoji: "➖", color: "rose" },
      { id: "pec", label: "PECAHAN (0<x<1)", emoji: "½", color: "amber" },
      { id: "satu", label: "BERNILAI 1", emoji: "1️⃣", color: "violet" },
    ],
    items: [
      { id: "p1", label: "(−3)⁴", bucketId: "pos", emoji: "➕" },
      { id: "p2", label: "(−2)⁵", bucketId: "neg", emoji: "➖" },
      { id: "p3", label: "5⁰", bucketId: "satu", emoji: "1️⃣" },
      { id: "p4", label: "2⁻³", bucketId: "pec", emoji: "½" },
      { id: "p5", label: "−4²", bucketId: "neg", emoji: "➖" },
      { id: "p6", label: "(−5)²", bucketId: "pos", emoji: "➕" },
      { id: "p7", label: "(−1)⁰", bucketId: "satu", emoji: "1️⃣" },
      { id: "p8", label: "3⁻²", bucketId: "pec", emoji: "½" },
    ],
  },
  {
    kind: "arrow-match",
    id: "pangkat-game-nilai",
    title: "🎯 Game 2 — Cari Nilai Pangkat",
    description: "Pasangkan setiap bentuk pangkat dengan NILAI yang TEPAT. Tekan ◀ ▶ untuk mengganti.",
    rightOptions: ["1", "8", "16", "25", "27", "32", "64", "1/8"],
    pairs: [
      { id: "v1", left: "2³", correctRight: "8", emoji: "⚡" },
      { id: "v2", left: "2⁴", correctRight: "16", emoji: "⚡" },
      { id: "v3", left: "2⁵", correctRight: "32", emoji: "⚡" },
      { id: "v4", left: "5²", correctRight: "25", emoji: "⚡" },
      { id: "v5", left: "3³", correctRight: "27", emoji: "⚡" },
      { id: "v6", left: "4³", correctRight: "64", emoji: "⚡" },
      { id: "v7", left: "7⁰", correctRight: "1", emoji: "⚡" },
      { id: "v8", left: "2⁻³", correctRight: "1/8", emoji: "⚡" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Tulis 7 × 7 × 7 × 7 dalam bentuk … pangkat …",
    kind: "base-exp",
    base: "7",
    exp: "4",
    hint: "Hitung berapa kali angka 7 dikalikan.",
    discussion: ["Ada 4 faktor 7, jadi 7 pangkat 4 (ditulis 7⁴ = 2.401)."],
  },
  {
    id: "pp2",
    question: "Nilai dari 4³ adalah …",
    kind: "fill",
    answers: ["64"],
    hint: "4 × 4 × 4.",
    discussion: ["4³ = 4 × 4 × 4 = 16 × 4 = 64."],
  },
  {
    id: "pp3",
    question: "Nilai dari (−4)² adalah …",
    kind: "fill",
    answers: ["16"],
    hint: "Pangkat genap dari negatif = positif.",
    discussion: ["(−4)² = (−4)(−4) = 16."],
  },
  {
    id: "pp4",
    question: "Nilai dari (−2)⁵ adalah …",
    kind: "fill",
    answers: ["-32", "−32"],
    hint: "Pangkat ganjil dari negatif = negatif.",
    discussion: ["(−2)⁵ = −32."],
  },
  {
    id: "pp5",
    question: "Nilai dari 10⁰ adalah …",
    kind: "fill",
    answers: ["1"],
    hint: "Sifat pangkat NOL.",
    discussion: ["a⁰ = 1, jadi 10⁰ = 1."],
  },
  {
    id: "pp6",
    question: "Bentuk 5⁻² ekuivalen dengan …",
    kind: "choice",
    options: ["−25", "−10", "1/25", "1/10"],
    correctIndex: 2,
    hint: "a⁻ⁿ = 1/aⁿ.",
    discussion: ["5⁻² = 1/5² = 1/25."],
  },
  {
    id: "pp7",
    question: "Nilai 2⁻⁴ adalah …",
    kind: "choice",
    options: ["−8", "−16", "1/8", "1/16"],
    correctIndex: 3,
    hint: "2⁻⁴ = 1/2⁴.",
    discussion: ["1/2⁴ = 1/16."],
  },
  {
    id: "pp8",
    question:
      "Sebuah amoeba membelah menjadi 2 setiap 30 menit. Jika awalnya 1 amoeba, setelah 3 jam jumlahnya = …",
    kind: "fill",
    answers: ["64"],
    hint: "3 jam = 6 × 30 menit, jadi 6 kali pembelahan.",
    discussion: [
      "3 jam = 6 kali pembelahan.",
      "Jumlah = 2⁶ = 64 amoeba.",
    ],
  },
];

const PengertianNotasiPangkatLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Bilangan Berpangkat"
    title="Pengertian & Notasi Pangkat — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo selami dunia BILANGAN BERPANGKAT ⚡! Kamu akan menemukan arti pangkat positif, nol, negatif, hingga pengaruh tanda kurung — sambil bermain seret kartu mengelompokkan tanda hasilnya!"
    situations={situations}
    guidedIntro="Jawab soal-soal berurutan. Pola pembagian akan menuntunmu pada arti pangkat 0 dan negatif."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu lewat soal latihan tentang pengertian dan notasi pangkat!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/bilangan-berpangkat"
    backLabel="Kembali ke Menu Bilangan Berpangkat"
    scoreMessages={{
      perfect: "🌟 Mantap! Pengertian pangkat sudah kamu kuasai!",
      high: "👍 Bagus! Cek kembali bagian yang masih merah.",
      medium: "🚀 Lumayan. Ulangi pola pangkat 0 & negatif sekali lagi.",
      low: "💪 Tetap semangat! Mulai dari aⁿ = a × a × … × a (n faktor).",
    }}
  />
);

export default PengertianNotasiPangkatLKPDPage;
