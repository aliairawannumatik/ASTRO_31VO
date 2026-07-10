import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";
import CubeUnfold from "@/components/CubeUnfold";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Dadu Permainan",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 200 160" className="w-full">
          <rect width="200" height="160" fill="#0b1220" rx="8" />
          <polygon points="60,110 130,110 130,40 60,40" fill="#22d3ee" fillOpacity="0.55" stroke="#22d3ee" strokeWidth="2" />
          <polygon points="60,40 90,20 160,20 130,40" fill="#67e8f9" fillOpacity="0.7" stroke="#22d3ee" strokeWidth="2" />
          <polygon points="130,40 160,20 160,90 130,110" fill="#0e7490" fillOpacity="0.7" stroke="#22d3ee" strokeWidth="2" />
          <text x="95" y="80" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">s</text>
          <text x="145" y="75" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">s</text>
          <text x="110" y="32" fontSize="11" fontWeight="bold" fill="var(--icon-color)" textAnchor="middle">s</text>
        </svg>
      </div>
    ),
    text:
      "Dadu adalah contoh KUBUS. Semua sisinya berbentuk PERSEGI dan SEMUA RUSUKNYA SAMA PANJANG (misal 's' cm). Berapa banyak sisi, rusuk, dan titik sudut sebuah dadu? 🤔",
  },
  {
    title: "Situasi 2 — Bak Mandi Berbentuk Kubus",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-700/20 border border-blue-300/40 p-3">
        <svg viewBox="0 0 200 160" className="w-full">
          <rect width="200" height="160" fill="#0b1220" rx="8" />
          <polygon points="40,120 130,120 160,90 70,90" fill="#3b82f6" fillOpacity="0.5" stroke="#60a5fa" strokeWidth="2" />
          <polygon points="40,40 130,40 130,120 40,120" fill="#1d4ed8" fillOpacity="0.55" stroke="#60a5fa" strokeWidth="2" />
          <polygon points="130,40 160,15 160,90 130,120" fill="#2563eb" fillOpacity="0.7" stroke="#60a5fa" strokeWidth="2" />
          <polygon points="40,40 70,15 160,15 130,40" fill="#7dd3fc" fillOpacity="0.7" stroke="#60a5fa" strokeWidth="2" />
          <line x1="40" y1="120" x2="40" y2="40" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 2" />
          <text x="32" y="85" fontSize="11" fontWeight="bold" fill="#fbbf24" textAnchor="middle">s</text>
          <text x="85" y="135" fontSize="11" fontWeight="bold" fill="#fbbf24" textAnchor="middle">s</text>
        </svg>
      </div>
    ),
    text:
      "Sebuah bak mandi berbentuk kubus dengan rusuk 100 cm. Berapa liter air maksimal yang dapat ditampung? Untuk menjawab, kita harus tahu rumus VOLUME kubus: V = s × s × s = s³.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Banyak SISI (bidang) pada sebuah kubus adalah …",
    kind: "fill",
    answers: ["6", "enam"],
    discussion: [
      "Kubus dibatasi oleh 6 daerah PERSEGI yang KONGRUEN.",
      "Sisi-sisi itu: depan, belakang, atas, bawah, kiri, kanan.",
    ],
  },
  {
    id: "g2",
    label: "Banyak RUSUK pada sebuah kubus adalah …",
    kind: "fill",
    answers: ["12", "dua belas"],
    discussion: [
      "Kubus memiliki 12 rusuk yang SAMA PANJANG.",
      "Rusuk-rusuk dapat dikelompokkan menjadi 3 arah (panjang, lebar, tinggi), masing-masing 4 rusuk.",
    ],
  },
  {
    id: "g3",
    label: "Banyak TITIK SUDUT pada sebuah kubus adalah …",
    kind: "fill",
    answers: ["8", "delapan"],
    discussion: [
      "Setiap pertemuan tiga rusuk membentuk satu titik sudut.",
      "Total ada 8 titik sudut: 4 di alas dan 4 di tutup.",
    ],
  },
  {
    id: "g4",
    label: "Pernyataan: Semua sisi kubus berbentuk persegi yang kongruen.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Karena semua rusuk sama panjang, maka tiap sisi adalah persegi dengan ukuran sama.",
    ],
  },
  {
    id: "g5",
    label: "Luas SATU sisi kubus dengan rusuk s adalah …",
    kind: "fill",
    answers: ["s²", "s^2", "s2", "sxs", "s.s"],
    discussion: [
      "Sisi kubus berbentuk persegi dengan panjang sisi s.",
      "Luas persegi = sisi × sisi = s × s = s².",
    ],
  },
  {
    id: "g6",
    label: "Karena ada 6 sisi yang sama, LUAS PERMUKAAN kubus rusuk s adalah …",
    kind: "fill",
    answers: ["6s²", "6s^2", "6 s²", "6×s²", "6xs²", "6s2"],
    discussion: [
      "L = banyak sisi × luas satu sisi.",
      "L = 6 × s² = 6s².",
    ],
  },
  {
    id: "g7",
    label: "Sebuah kubus memiliki rusuk 5 cm. Luas permukaannya adalah … cm².",
    kind: "fill",
    answers: ["150"],
    discussion: [
      "L = 6s² = 6 × 5² = 6 × 25 = 150 cm².",
    ],
  },
  {
    id: "g8",
    label: "VOLUME kubus dengan rusuk s adalah …",
    kind: "choice",
    options: ["s + s + s", "3s", "6s²", "s³"],
    correctIndex: 3,
    discussion: [
      "Volume = panjang × lebar × tinggi = s × s × s = s³.",
      "Karena ketiga ukuran kubus sama, hasilnya adalah pangkat tiga rusuk.",
    ],
  },
  {
    id: "g9",
    label: "Sebuah kubus memiliki rusuk 4 cm. Volume kubus = … cm³.",
    kind: "fill",
    answers: ["64"],
    discussion: [
      "V = s³ = 4³ = 4 × 4 × 4 = 64 cm³.",
    ],
  },
  {
    id: "g10",
    label:
      "Diagonal SISI sebuah kubus rusuk s membentuk segitiga siku-siku sama kaki dengan sisi s. Maka panjang diagonal sisinya …",
    kind: "choice",
    options: ["s", "s√2", "s√3", "2s"],
    correctIndex: 1,
    discussion: [
      "Diagonal sisi = √(s² + s²) = √(2s²) = s√2.",
      "Triple sederhana 1 : 1 : √2 (siku-siku sama kaki).",
    ],
  },
  {
    id: "g11",
    label: "Diagonal RUANG kubus rusuk s adalah …",
    kind: "choice",
    options: ["s", "s√2", "s√3", "3s"],
    correctIndex: 2,
    discussion: [
      "Diagonal ruang membentuk siku-siku dengan rusuk dan diagonal sisi.",
      "d² = s² + (s√2)² = s² + 2s² = 3s² → d = s√3.",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan ciri kubus dengan jumlahnya:",
    kind: "match",
    pairs: [
      { left: "Sisi", right: "6" },
      { left: "Rusuk", right: "12" },
      { left: "Titik Sudut", right: "8" },
      { left: "Diagonal Ruang", right: "4" },
    ],
    discussion: [
      "Sisi = 6, Rusuk = 12, Titik Sudut = 8.",
      "Diagonal ruang ada 4 (menghubungkan dua titik sudut yang berseberangan).",
      "Diagonal sisi total = 12 (2 di tiap sisi × 6 sisi).",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Unsur Kubus",
    text: "Sisi: 6 (persegi kongruen). Rusuk: 12 (sama panjang). Titik sudut: 8. Diagonal sisi: 12. Diagonal ruang: 4. Bidang diagonal: 6.",
    tone: "cyan",
  },
  {
    title: "Rumus Baku",
    text: "Luas Permukaan: L = 6s². Volume: V = s³. Diagonal sisi: ds = s√2. Diagonal ruang: dr = s√3.",
    tone: "yellow",
  },
  {
    title: "Tips Cepat",
    text: "1 dm³ = 1 liter, jadi 1000 cm³ = 1 liter. Hafalkan kuadrat & kubik 1–10 untuk perhitungan cepat.",
    tone: "emerald",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "kubus-game-unsur",
    title: "🎯 Game 1 — Klasifikasi Unsur Kubus (Seret!)",
    description: "Seret setiap kartu ke kategori yang TEPAT. Kartu bisa kamu ketuk lalu ketuk wadah, atau seret langsung.",
    buckets: [
      { id: "sisi", label: "BERJUMLAH 6", emoji: "🟦", color: "cyan" },
      { id: "rusuk", label: "BERJUMLAH 12", emoji: "📏", color: "amber" },
      { id: "sudut", label: "BERJUMLAH 8", emoji: "🔵", color: "violet" },
      { id: "ruang", label: "BERJUMLAH 4", emoji: "✨", color: "emerald" },
    ],
    items: [
      { id: "u1", label: "Sisi (Bidang)", bucketId: "sisi", emoji: "🟦" },
      { id: "u2", label: "Bidang Diagonal", bucketId: "sisi", emoji: "🟦" },
      { id: "u3", label: "Rusuk", bucketId: "rusuk", emoji: "📏" },
      { id: "u4", label: "Diagonal Sisi", bucketId: "rusuk", emoji: "📏" },
      { id: "u5", label: "Titik Sudut", bucketId: "sudut", emoji: "🔵" },
      { id: "u6", label: "Diagonal Ruang", bucketId: "ruang", emoji: "✨" },
    ],
  },
  {
    kind: "arrow-match",
    id: "kubus-game-volume",
    title: "🎯 Game 2 — Cari Volume Kubus",
    description: "Pasangkan rusuk kubus dengan VOLUME-nya. Tekan ◀ ▶ untuk memilih.",
    rightOptions: ["8 cm³", "27 cm³", "64 cm³", "125 cm³", "216 cm³", "343 cm³", "512 cm³", "1000 cm³"],
    pairs: [
      { id: "v1", left: "Rusuk 2 cm", correctRight: "8 cm³", emoji: "🎲" },
      { id: "v2", left: "Rusuk 3 cm", correctRight: "27 cm³", emoji: "🎲" },
      { id: "v3", left: "Rusuk 5 cm", correctRight: "125 cm³", emoji: "🎲" },
      { id: "v4", left: "Rusuk 6 cm", correctRight: "216 cm³", emoji: "🎲" },
      { id: "v5", left: "Rusuk 8 cm", correctRight: "512 cm³", emoji: "🎲" },
      { id: "v6", left: "Rusuk 10 cm", correctRight: "1000 cm³", emoji: "🎲" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Sebuah kubus memiliki rusuk 7 cm. Luas permukaannya adalah … cm².",
    kind: "fill",
    answers: ["294"],
    hint: "L = 6 × s².",
    discussion: ["L = 6 × 7² = 6 × 49 = 294 cm²."],
  },
  {
    id: "p2",
    question: "Volume kubus dengan rusuk 9 cm adalah … cm³.",
    kind: "fill",
    answers: ["729"],
    hint: "V = s³.",
    discussion: ["V = 9³ = 9 × 9 × 9 = 729 cm³."],
  },
  {
    id: "p3",
    question: "Jika luas permukaan sebuah kubus 96 cm², panjang rusuknya adalah … cm.",
    kind: "fill",
    answers: ["4"],
    hint: "Dari 6s² = 96, cari s.",
    discussion: [
      "6s² = 96 → s² = 16 → s = √16 = 4 cm.",
    ],
  },
  {
    id: "p4",
    question: "Volume sebuah kubus 1.331 cm³. Panjang rusuknya = … cm.",
    kind: "fill",
    answers: ["11"],
    hint: "Cari akar pangkat tiga dari 1.331.",
    discussion: [
      "s = ∛1331 = 11 cm (karena 11³ = 1331).",
    ],
  },
  {
    id: "p5",
    question: "Diagonal RUANG kubus rusuk 6 cm adalah …",
    kind: "choice",
    options: ["6 cm", "6√2 cm", "6√3 cm", "12 cm"],
    correctIndex: 2,
    hint: "Gunakan rumus dr = s√3.",
    discussion: ["dr = s√3 = 6√3 cm."],
  },
  {
    id: "p6",
    question: "Sebuah bak mandi berbentuk kubus rusuk 80 cm. Volume air maksimal yang dapat ditampung = … liter.",
    kind: "fill",
    answers: ["512"],
    hint: "Hitung V dalam cm³, lalu konversi (1.000 cm³ = 1 liter).",
    discussion: [
      "V = 80³ = 512.000 cm³.",
      "512.000 cm³ = 512 liter.",
    ],
  },
  {
    id: "p7",
    question:
      "Total panjang seluruh rusuk sebuah kubus adalah 60 cm. Volume kubus tersebut = … cm³.",
    kind: "fill",
    answers: ["125"],
    hint: "Total rusuk = 12s, jadi cari s dulu.",
    discussion: [
      "12s = 60 → s = 5 cm.",
      "V = 5³ = 125 cm³.",
    ],
  },
  {
    id: "p8",
    question: "Pernyataan: Diagonal sisi kubus rusuk 4 cm panjangnya 4√2 cm.",
    kind: "truefalse",
    correct: true,
    hint: "Gunakan rumus ds = s√2.",
    discussion: ["ds = 4√2 cm. ✓ BENAR."],
  },
];

const KubusLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 8 · Bab Bangun Ruang Sisi Datar"
    title="Kubus — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo temukan rahasia KUBUS! 🎲 Kamu akan mengupas jaring-jaring kubus, menghitung luas permukaan, volume, hingga diagonal ruangnya — sambil bermain seret kartu ke kategori yang tepat!"
    situations={situations}
    guidedIntro="Jawab pertanyaan berurutan. Setiap jawabanmu menuntun ke rumus baku. Tekan 'Lihat Skor Akhir' untuk membuka pembahasan lengkap."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    midSlot={
      <section className="rounded-3xl border border-cyan-300/30 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-violet-500/10 p-5 md:p-6 shadow-[0_0_45px_rgba(34,211,238,0.18)]">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🧩</span>
          <div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-cyan-200">
              Laboratorium Kubus — Buka Jaring-Jaring!
            </h3>
            <p className="text-sm text-white/70">
              Klik tombol di bawah untuk membuka tiap sisi kubus satu per satu. Saksikan bagaimana 6 persegi membentuk JARING-JARING kubus!
            </p>
          </div>
        </div>
        <CubeUnfold />
        <p className="mt-3 text-xs text-white/65 italic">
          💡 Setelah jaring-jaring terbentuk, hitung: Luas seluruh persegi = 6 × s² ✨
        </p>
      </section>
    }
    games={games}
    practiceIntro="Asah pemahamanmu tentang kubus dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-8/bangun-ruang-sisi-datar"
    backLabel="Kembali ke Menu Bangun Ruang Sisi Datar"
    scoreMessages={{
      perfect: "🌟 Sempurna! Pemahaman kubus-mu sudah top!",
      high: "👍 Bagus sekali! Cek kembali jawaban yang merah.",
      medium: "🚀 Mulai paham. Ulangi penemuan terbimbing dan main game-nya lagi.",
      low: "💪 Tetap semangat! Mulai dari rumus L = 6s² dan V = s³.",
    }}
  />
);

export default KubusLKPDPage;
