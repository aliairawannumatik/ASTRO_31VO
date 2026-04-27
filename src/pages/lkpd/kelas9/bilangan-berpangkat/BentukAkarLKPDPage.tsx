import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Sisi Persegi dari Luas",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 240 160" className="w-full">
          <rect width="240" height="160" fill="#0b1220" rx="8" />
          <rect x="40" y="40" width="80" height="80" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="2" />
          <text x="80" y="85" fontSize="13" fontWeight="bold" fill="#fff" textAnchor="middle">L = 25</text>
          <text x="80" y="135" fontSize="11" fontWeight="bold" fill="#fbbf24" textAnchor="middle">sisi = √25 = 5</text>
          <rect x="150" y="55" width="60" height="60" fill="#22d3ee" fillOpacity="0.5" stroke="#67e8f9" strokeWidth="2" />
          <text x="180" y="92" fontSize="13" fontWeight="bold" fill="#fff" textAnchor="middle">L = 12</text>
          <text x="180" y="135" fontSize="11" fontWeight="bold" fill="#fbbf24" textAnchor="middle">sisi = √12 = 2√3</text>
        </svg>
      </div>
    ),
    text:
      "Jika luas persegi 25, maka sisinya √25 = 5 (rapi!). Tapi jika luasnya 12, sisinya √12 — bukan bilangan bulat. Bentuk seperti √12 inilah BENTUK AKAR. Ayo kita pelajari cara menyederhanakannya!",
  },
  {
    title: "Situasi 2 — Hubungan Akar dan Pangkat",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-700/20 border border-violet-300/40 p-3">
        <svg viewBox="0 0 280 140" className="w-full">
          <rect width="280" height="140" fill="#0b1220" rx="8" />
          <text x="140" y="35" fontSize="14" fontWeight="bold" fill="#a78bfa" textAnchor="middle">Akar adalah KEBALIKAN pangkat!</text>
          <text x="140" y="70" fontSize="13" fill="#fff" textAnchor="middle">5² = 25 ⟷ √25 = 5</text>
          <text x="140" y="92" fontSize="13" fill="#fff" textAnchor="middle">3² = 9 ⟷ √9 = 3</text>
          <text x="140" y="118" fontSize="12" fill="#fbbf24" textAnchor="middle">√a = a^(1/2)</text>
        </svg>
      </div>
    ),
    text:
      "Akar PANGKAT DUA dari a (ditulis √a) adalah bilangan yang BILA DIKUADRATKAN menghasilkan a. Akar adalah KEBALIKAN dari pangkat. Bahkan, √a = a^(1/2)!",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Nilai dari √49 = …",
    kind: "fill",
    answers: ["7"],
    discussion: ["√49 = 7 karena 7² = 49."],
  },
  {
    id: "g2",
    label: "Nilai dari √100 = …",
    kind: "fill",
    answers: ["10"],
    discussion: ["√100 = 10 karena 10² = 100."],
  },
  {
    id: "g3",
    label:
      "√12 dapat disederhanakan dengan memisahkan KUADRAT SEMPURNA. √12 = √(4 × 3) = …",
    kind: "fill",
    answers: ["2√3", "2 √3", "2 akar 3", "2akar3"],
    discussion: [
      "√12 = √(4 × 3) = √4 × √3 = 2√3.",
      "Cari kuadrat sempurna terbesar yang membagi 12.",
    ],
  },
  {
    id: "g4",
    label: "Aturan umum: √(a × b) = …",
    kind: "choice",
    options: ["√a + √b", "√a × √b", "(√a)²", "√(a + b)"],
    correctIndex: 1,
    discussion: ["√(a×b) = √a × √b (sifat distributif akar terhadap perkalian)."],
  },
  {
    id: "g5",
    label: "Sederhanakan √50 = …",
    kind: "fill",
    answers: ["5√2", "5 √2", "5 akar 2", "5akar2"],
    discussion: [
      "√50 = √(25 × 2) = √25 × √2 = 5√2.",
    ],
  },
  {
    id: "g6",
    label: "Hasil 3√2 + 5√2 = …",
    kind: "fill",
    answers: ["8√2", "8 √2", "8 akar 2", "8akar2"],
    discussion: [
      "Akar dengan basis SAMA dapat dijumlahkan koefisiennya, mirip variabel.",
      "3√2 + 5√2 = (3 + 5)√2 = 8√2.",
    ],
  },
  {
    id: "g7",
    label:
      "Pernyataan: √2 + √3 = √5.",
    kind: "truefalse",
    correct: false,
    discussion: [
      "SALAH! Akar dengan basis BERBEDA TIDAK BISA dijumlahkan langsung.",
      "√2 + √3 ≈ 1,414 + 1,732 = 3,146, sedangkan √5 ≈ 2,236.",
    ],
  },
  {
    id: "g8",
    label: "Hasil √3 × √12 = …",
    kind: "fill",
    answers: ["6"],
    discussion: [
      "√3 × √12 = √(3 × 12) = √36 = 6.",
    ],
  },
  {
    id: "g9",
    label:
      "Untuk merasionalkan 1/√3, kita kalikan dengan …",
    kind: "choice",
    options: ["3/3", "1/√3", "√3/√3", "√3/1"],
    correctIndex: 2,
    discussion: [
      "Kalikan dengan √3/√3 (= 1, jadi nilai tidak berubah).",
      "1/√3 × √3/√3 = √3/3.",
      "Penyebut tidak boleh mengandung bentuk akar.",
    ],
  },
  {
    id: "g10",
    label: "Hasil rasionalisasi 1/√5 = …",
    kind: "choice",
    options: ["√5/5", "5/√5", "5/5", "1/5"],
    correctIndex: 0,
    discussion: ["1/√5 × √5/√5 = √5/5."],
  },
  {
    id: "g11",
    label:
      "Sederhanakan √8 + √18 = … (jadikan satu bentuk akar).",
    kind: "fill",
    answers: ["5√2", "5 √2", "5 akar 2", "5akar2"],
    discussion: [
      "√8 = 2√2, √18 = 3√2.",
      "2√2 + 3√2 = 5√2.",
      "Sederhanakan dulu, baru jumlahkan.",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan bentuk akar dengan bentuk sederhananya:",
    kind: "match",
    pairs: [
      { left: "√8", right: "2√2" },
      { left: "√27", right: "3√3" },
      { left: "√50", right: "5√2" },
      { left: "√75", right: "5√3" },
    ],
    discussion: [
      "√8 = √(4×2) = 2√2.",
      "√27 = √(9×3) = 3√3.",
      "√50 = √(25×2) = 5√2.",
      "√75 = √(25×3) = 5√3.",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Definisi Akar",
    text: "√a = bilangan b yang memenuhi b² = a (a ≥ 0). Setara dengan a^(1/2). Akar adalah KEBALIKAN pangkat dua.",
    tone: "emerald",
  },
  {
    title: "Sifat Operasi Akar",
    text: "√(a×b) = √a × √b. √(a/b) = √a/√b. m√c + n√c = (m+n)√c. m√c − n√c = (m−n)√c.",
    tone: "violet",
  },
  {
    title: "Rasionalisasi & Tips",
    text: "1/√a = √a/a (kali penyebut & pembilang dengan √a). Kuadrat sempurna penting: 4, 9, 16, 25, 36, 49, 64, 81, 100. PENJUMLAHAN akar berbeda basis TIDAK bisa langsung!",
    tone: "yellow",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "akar-game-sifat",
    title: "🎯 Game 1 — Pilih SIFAT Akar! (Seret)",
    description: "Seret setiap operasi ke kategori SIFAT yang TEPAT.",
    buckets: [
      { id: "kali", label: "DAPAT DIKALI/DIBAGI", emoji: "✖️", color: "emerald" },
      { id: "tambah", label: "DAPAT DIJUMLAH (basis sama)", emoji: "➕", color: "amber" },
      { id: "tidak", label: "TIDAK BISA langsung disederhanakan", emoji: "🚫", color: "rose" },
      { id: "rasion", label: "Perlu RASIONALISASI", emoji: "🧭", color: "violet" },
    ],
    items: [
      { id: "a1", label: "√3 × √7", bucketId: "kali", emoji: "✖️" },
      { id: "a2", label: "2√5 + 3√5", bucketId: "tambah", emoji: "➕" },
      { id: "a3", label: "√2 + √3", bucketId: "tidak", emoji: "🚫" },
      { id: "a4", label: "1/√2", bucketId: "rasion", emoji: "🧭" },
      { id: "a5", label: "√8 ÷ √2", bucketId: "kali", emoji: "✖️" },
      { id: "a6", label: "√5 + √7", bucketId: "tidak", emoji: "🚫" },
      { id: "a7", label: "5√3 − 2√3", bucketId: "tambah", emoji: "➕" },
      { id: "a8", label: "3/√7", bucketId: "rasion", emoji: "🧭" },
    ],
  },
  {
    kind: "arrow-match",
    id: "akar-game-sederhana",
    title: "🎯 Game 2 — Sederhanakan Bentuk Akar",
    description: "Pasangkan bentuk akar dengan BENTUK SEDERHANA-nya.",
    rightOptions: ["2√2", "2√3", "3√2", "3√3", "4√2", "5√2", "5√3"],
    pairs: [
      { id: "s1", left: "√8", correctRight: "2√2", emoji: "🌱" },
      { id: "s2", left: "√12", correctRight: "2√3", emoji: "🌱" },
      { id: "s3", left: "√18", correctRight: "3√2", emoji: "🌱" },
      { id: "s4", left: "√27", correctRight: "3√3", emoji: "🌱" },
      { id: "s5", left: "√32", correctRight: "4√2", emoji: "🌱" },
      { id: "s6", left: "√50", correctRight: "5√2", emoji: "🌱" },
      { id: "s7", left: "√75", correctRight: "5√3", emoji: "🌱" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question: "Nilai √144 = …",
    kind: "fill",
    answers: ["12"],
    hint: "12 × 12 = ?",
    discussion: ["√144 = 12 (karena 12² = 144)."],
  },
  {
    id: "pp2",
    question: "Sederhanakan √72 = …",
    kind: "fill",
    answers: ["6√2", "6 √2", "6 akar 2", "6akar2"],
    hint: "Cari kuadrat sempurna terbesar pembagi 72.",
    discussion: ["√72 = √(36 × 2) = 6√2."],
  },
  {
    id: "pp3",
    question: "Hasil 4√3 + 7√3 = …",
    kind: "fill",
    answers: ["11√3", "11 √3", "11 akar 3", "11akar3"],
    hint: "Basis sama → koefisien dijumlah.",
    discussion: ["(4 + 7)√3 = 11√3."],
  },
  {
    id: "pp4",
    question: "Hasil √6 × √24 = …",
    kind: "fill",
    answers: ["12"],
    hint: "√a × √b = √(ab).",
    discussion: ["√6 × √24 = √144 = 12."],
  },
  {
    id: "pp5",
    question: "Sederhanakan √20 + √45 = …",
    kind: "fill",
    answers: ["5√5", "5 √5", "5 akar 5", "5akar5"],
    hint: "Sederhanakan dulu masing-masing akar.",
    discussion: [
      "√20 = 2√5. √45 = 3√5.",
      "2√5 + 3√5 = 5√5.",
    ],
  },
  {
    id: "pp6",
    question: "Hasil rasionalisasi dari 6/√3 = …",
    kind: "fill",
    answers: ["2√3", "2 √3", "2 akar 3", "2akar3"],
    hint: "Kalikan pembilang & penyebut dengan √3.",
    discussion: [
      "6/√3 × √3/√3 = 6√3/3 = 2√3.",
    ],
  },
  {
    id: "pp7",
    question:
      "Sebuah persegi memiliki luas 50 cm². Panjang sisinya = … (dalam bentuk akar disederhanakan).",
    kind: "fill",
    answers: ["5√2", "5 √2", "5 akar 2", "5akar2"],
    hint: "Sisi = √Luas.",
    discussion: ["sisi = √50 = 5√2 cm."],
  },
  {
    id: "pp8",
    question: "Pernyataan: √a + √b SELALU SAMA dengan √(a + b).",
    kind: "truefalse",
    correct: false,
    hint: "Coba dengan a=4 dan b=9.",
    discussion: [
      "SALAH. √4 + √9 = 2 + 3 = 5, sedangkan √(4+9) = √13 ≈ 3,6.",
      "Akar TIDAK distributif terhadap penjumlahan.",
    ],
  },
];

const BentukAkarLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Bilangan Berpangkat"
    title="Bentuk Akar — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo selami BENTUK AKAR 🌱! Kamu akan menemukan cara menyederhanakan akar, menjumlahkan, mengalikan, hingga merasionalkan penyebut — sambil bermain seret kartu klasifikasi sifat akar!"
    situations={situations}
    guidedIntro="Jawab pertanyaan berurutan. Setiap jawabanmu menuntun ke aturan operasi akar."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu tentang bentuk akar dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/bilangan-berpangkat"
    backLabel="Kembali ke Menu Bilangan Berpangkat"
    scoreMessages={{
      perfect: "🌟 Mantap! Bentuk akar sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Pelajari ulang sifat √(ab) dan rasionalisasi.",
      low: "💪 Tetap semangat! Hafal kuadrat sempurna 1²–10² dulu.",
    }}
  />
);

export default BentukAkarLKPDPage;
