import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";
import JaringLimasInteraktif from "@/components/JaringLimasInteraktif";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Piramida Mesir",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-700/20 border border-yellow-300/40 p-3">
        <svg viewBox="0 0 220 160" className="w-full">
          <rect width="220" height="160" fill="#0b1220" rx="8" />
          <polygon points="40,130 180,130 200,110 60,110" fill="#fbbf24" fillOpacity="0.45" stroke="#fde68a" strokeWidth="2" />
          <polygon points="40,130 110,30 180,130" fill="#f59e0b" fillOpacity="0.55" stroke="#fde68a" strokeWidth="2" />
          <polygon points="180,130 200,110 110,30" fill="#d97706" fillOpacity="0.7" stroke="#fde68a" strokeWidth="2" />
          <line x1="110" y1="30" x2="110" y2="120" stroke="#22d3ee" strokeWidth="2" strokeDasharray="3 2" />
          <text x="120" y="80" fontSize="11" fontWeight="bold" fill="#22d3ee" textAnchor="middle">t</text>
          <text x="100" y="148" fontSize="11" fontWeight="bold" fill="#fbbf24" textAnchor="middle">alas</text>
        </svg>
      </div>
    ),
    text:
      "Piramida Mesir adalah contoh LIMAS! Ciri khas limas: punya SATU titik puncak dan alasnya berupa segi banyak. Sisi tegaknya selalu berbentuk SEGITIGA.",
  },
  {
    title: "Situasi 2 — Tutup Lampu Limas Segiempat",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-violet-700/20 border border-fuchsia-300/40 p-3">
        <svg viewBox="0 0 220 160" className="w-full">
          <rect width="220" height="160" fill="#0b1220" rx="8" />
          <polygon points="50,120 150,120 180,90 80,90" fill="#e879f9" fillOpacity="0.45" stroke="#f0abfc" strokeWidth="2" />
          <polygon points="50,120 110,30 150,120" fill="#c026d3" fillOpacity="0.55" stroke="#f0abfc" strokeWidth="2" />
          <polygon points="150,120 180,90 110,30" fill="#a21caf" fillOpacity="0.65" stroke="#f0abfc" strokeWidth="2" />
          <polygon points="80,90 110,30 50,120" fill="#86198f" fillOpacity="0.5" stroke="#f0abfc" strokeWidth="2" strokeDasharray="3 2" />
          <text x="115" y="148" fontSize="11" fontWeight="bold" fill="#fbbf24" textAnchor="middle">alas persegi</text>
        </svg>
      </div>
    ),
    text:
      "Limas segiempat memiliki ALAS PERSEGI/PERSEGI PANJANG dan 4 sisi tegak SEGITIGA yang bertemu di SATU TITIK PUNCAK.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Limas adalah bangun ruang yang dibatasi oleh ALAS berbentuk segi-n dan SISI TEGAK berbentuk SEGITIGA yang bertemu di …",
    kind: "fill",
    answers: ["satu titik", "satu titik puncak", "titik puncak", "1 titik", "satu", "puncak"],
    discussion: [
      "Semua sisi tegak limas bertemu di SATU TITIK yang disebut TITIK PUNCAK.",
    ],
  },
  {
    id: "g2",
    label: "Pada LIMAS SEGITIGA banyak SISI seluruhnya adalah …",
    kind: "fill",
    answers: ["4", "empat"],
    discussion: [
      "Alas (1 segitiga) + 3 sisi tegak (segitiga) = 4 sisi.",
      "Limas segitiga juga disebut TETRAHEDRON.",
    ],
  },
  {
    id: "g3",
    label: "Pada LIMAS SEGITIGA banyak RUSUKNYA adalah …",
    kind: "fill",
    answers: ["6", "enam"],
    discussion: [
      "Rusuk alas: 3 + Rusuk tegak: 3 = 6 rusuk.",
    ],
  },
  {
    id: "g4",
    label: "Pada LIMAS SEGITIGA banyak titik sudutnya adalah …",
    kind: "fill",
    answers: ["4", "empat"],
    discussion: [
      "3 titik sudut alas + 1 titik puncak = 4 titik sudut.",
    ],
  },
  {
    id: "g5",
    label: "Untuk LIMAS SEGI-n, banyak SISI seluruhnya adalah …",
    kind: "choice",
    options: ["n", "n + 1", "2n", "n + 2"],
    correctIndex: 1,
    discussion: [
      "Alas: 1 + sisi tegak (segitiga): n.",
      "Total = n + 1.",
    ],
  },
  {
    id: "g6",
    label: "Untuk LIMAS SEGI-n, banyak RUSUK seluruhnya adalah …",
    kind: "choice",
    options: ["n", "2n", "3n", "n + 1"],
    correctIndex: 1,
    discussion: [
      "Rusuk alas n + rusuk tegak n = 2n.",
    ],
  },
  {
    id: "g7",
    label: "Untuk LIMAS SEGI-n, banyak TITIK SUDUTNYA adalah …",
    kind: "choice",
    options: ["n", "n + 1", "2n", "2n + 1"],
    correctIndex: 1,
    discussion: [
      "n titik sudut alas + 1 titik puncak = n + 1.",
    ],
  },
  {
    id: "g8",
    label: "Rumus LUAS PERMUKAAN limas adalah …",
    kind: "choice",
    options: [
      "Luas Alas + Luas Tutup",
      "Luas Alas + Jumlah Luas Sisi Tegak",
      "2 × Luas Alas + Keliling × t",
      "Luas Alas × tinggi",
    ],
    correctIndex: 1,
    discussion: [
      "Limas TIDAK punya tutup, jadi: L = Luas Alas + Σ(Luas Sisi Tegak).",
      "Untuk limas BERATURAN: L = Luas Alas + (1/2 × Keliling Alas × tinggi sisi tegak).",
    ],
  },
  {
    id: "g9",
    label: "Rumus VOLUME limas adalah …",
    kind: "choice",
    options: [
      "Luas Alas × tinggi",
      "1/3 × Luas Alas × tinggi",
      "1/2 × Luas Alas × tinggi",
      "Keliling Alas × tinggi",
    ],
    correctIndex: 1,
    discussion: [
      "V_limas = 1/3 × Luas Alas × tinggi.",
      "Tinggi yang dimaksud adalah JARAK TEGAK LURUS dari puncak ke alas.",
    ],
  },
  {
    id: "g10",
    label:
      "Sebuah limas alas PERSEGI dengan rusuk alas 6 cm dan tinggi 8 cm. Volume limas = … cm³.",
    kind: "fill",
    answers: ["96"],
    discussion: [
      "L_alas = 6² = 36 cm².",
      "V = 1/3 × 36 × 8 = 96 cm³.",
    ],
  },
  {
    id: "g11",
    label:
      "Tinggi sisi tegak limas alas persegi (apotema/tinggi segitiga sisi) dapat dihitung dengan Pythagoras dari tinggi limas dan setengah rusuk alas.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. ts² = t² + (s/2)², dengan t = tinggi limas, s = rusuk alas.",
      "ts (tinggi sisi tegak) digunakan untuk menghitung luas segitiga sisi tegak.",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan jenis limas dengan jumlah unsurnya:",
    kind: "match",
    pairs: [
      { left: "Limas Segitiga", right: "4 sisi, 6 rusuk, 4 sudut" },
      { left: "Limas Segiempat", right: "5 sisi, 8 rusuk, 5 sudut" },
      { left: "Limas Segilima", right: "6 sisi, 10 rusuk, 6 sudut" },
      { left: "Limas Segienam", right: "7 sisi, 12 rusuk, 7 sudut" },
    ],
    discussion: [
      "Pakai rumus: Sisi = n+1, Rusuk = 2n, Titik sudut = n+1.",
      "Limas segitiga (n=3): 4, 6, 4. Limas segiempat (n=4): 5, 8, 5.",
      "Limas segilima (n=5): 6, 10, 6. Limas segienam (n=6): 7, 12, 7.",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Unsur Limas Segi-n",
    text: "Sisi: n + 1. Rusuk: 2n. Titik Sudut: n + 1. Memiliki 1 alas dan n sisi tegak SEGITIGA yang bertemu di SATU titik puncak.",
    tone: "yellow",
  },
  {
    title: "Rumus Baku",
    text: "Luas Permukaan: L = Luas Alas + Σ Luas Sisi Tegak. Volume: V = 1/3 × Luas Alas × t. Tinggi sisi tegak: ts = √(t² + (s/2)²).",
    tone: "rose",
  },
  {
    title: "Tips Cepat",
    text: "Limas BERATURAN: semua sisi tegak kongruen → cukup hitung 1 sisi × banyaknya. Limas segitiga juga disebut TETRAHEDRON.",
    tone: "violet",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "limas-game-unsur",
    title: "🎯 Game 1 — Klasifikasi Limas (Seret!)",
    description: "Seret kartu jenis limas ke kelompok JUMLAH RUSUK yang tepat.",
    buckets: [
      { id: "r6", label: "6 RUSUK", emoji: "🔺", color: "amber" },
      { id: "r8", label: "8 RUSUK", emoji: "🔶", color: "rose" },
      { id: "r10", label: "10 RUSUK", emoji: "⭐", color: "violet" },
      { id: "r12", label: "12 RUSUK", emoji: "💎", color: "cyan" },
    ],
    items: [
      { id: "l3", label: "Limas Segitiga (n=3)", bucketId: "r6", emoji: "🔺" },
      { id: "l4", label: "Limas Segiempat (n=4)", bucketId: "r8", emoji: "🔶" },
      { id: "l5", label: "Limas Segilima (n=5)", bucketId: "r10", emoji: "⭐" },
      { id: "l6", label: "Limas Segienam (n=6)", bucketId: "r12", emoji: "💎" },
      { id: "l3b", label: "Tetrahedron", bucketId: "r6", emoji: "🔺" },
      { id: "l4b", label: "Piramida Mesir", bucketId: "r8", emoji: "🔶" },
    ],
  },
  {
    kind: "arrow-match",
    id: "limas-game-volume",
    title: "🎯 Game 2 — Cari Volume Limas",
    description: "Pasangkan limas dengan VOLUME-nya. Tekan ◀ ▶ untuk mengganti pilihan.",
    rightOptions: ["32 cm³", "48 cm³", "64 cm³", "96 cm³", "100 cm³", "144 cm³", "200 cm³"],
    pairs: [
      { id: "vl1", left: "Alas persegi 4×4, t 6 cm", correctRight: "32 cm³", emoji: "🔺" },
      { id: "vl2", left: "Alas persegi 6×6, t 8 cm", correctRight: "96 cm³", emoji: "🔺" },
      { id: "vl3", left: "Alas 12 cm², t 12 cm", correctRight: "48 cm³", emoji: "🔺" },
      { id: "vl4", left: "Alas 25 cm², t 12 cm", correctRight: "100 cm³", emoji: "🔺" },
      { id: "vl5", left: "Alas 36 cm², t 12 cm", correctRight: "144 cm³", emoji: "🔺" },
      { id: "vl6", left: "Alas 50 cm², t 12 cm", correctRight: "200 cm³", emoji: "🔺" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question:
      "Sebuah limas alas PERSEGI rusuk alas 10 cm dan tinggi limas 12 cm. Volume = … cm³.",
    kind: "fill",
    answers: ["400"],
    hint: "V = 1/3 × s² × t.",
    discussion: [
      "L_alas = 10² = 100 cm².",
      "V = 1/3 × 100 × 12 = 400 cm³.",
    ],
  },
  {
    id: "p2",
    question:
      "Limas alas persegi rusuk 8 cm, tinggi limas 3 cm. Tinggi sisi tegak (ts) = … cm.",
    kind: "fill",
    answers: ["5"],
    hint: "ts² = t² + (s/2)². Ingat triple Pythagoras 3-4-5!",
    discussion: [
      "ts² = 3² + (8/2)² = 9 + 16 = 25.",
      "ts = √25 = 5 cm.",
    ],
  },
  {
    id: "p3",
    question:
      "Luas permukaan limas alas persegi sisi 8 cm dan tinggi sisi tegak 5 cm = … cm².",
    kind: "fill",
    answers: ["144"],
    hint: "L = s² + 4 × (1/2 × s × ts).",
    discussion: [
      "L_alas = 8² = 64 cm².",
      "L_4 sisi tegak = 4 × (1/2 × 8 × 5) = 4 × 20 = 80 cm².",
      "L total = 64 + 80 = 144 cm².",
    ],
  },
  {
    id: "p4",
    question: "Banyak titik sudut limas SEGISEPULUH adalah …",
    kind: "fill",
    answers: ["11"],
    hint: "Titik sudut limas segi-n = n + 1.",
    discussion: ["10 + 1 = 11 titik sudut."],
  },
  {
    id: "p5",
    question:
      "Volume limas alas segitiga siku-siku dengan kaki 6 cm dan 8 cm, tinggi limas 9 cm = … cm³.",
    kind: "fill",
    answers: ["72"],
    hint: "V = 1/3 × (1/2 × a × b) × t.",
    discussion: [
      "L_alas = 1/2 × 6 × 8 = 24 cm².",
      "V = 1/3 × 24 × 9 = 72 cm³.",
    ],
  },
  {
    id: "p6",
    question:
      "Manakah berikut yang BUKAN ciri limas?",
    kind: "choice",
    options: [
      "Memiliki 1 titik puncak",
      "Sisi tegak berbentuk segitiga",
      "Memiliki tutup yang kongruen dengan alas",
      "Volume = 1/3 × Luas Alas × tinggi",
    ],
    correctIndex: 2,
    hint: "Limas tidak memiliki tutup.",
    discussion: [
      "Yang punya tutup kongruen dengan alas adalah PRISMA, bukan limas.",
      "Limas hanya punya 1 alas dan sisi tegak yang bertemu di puncak.",
    ],
  },
  {
    id: "p7",
    question:
      "Volume sebuah limas persegi 300 cm³ dengan tinggi 9 cm. Panjang rusuk alas = … cm.",
    kind: "fill",
    answers: ["10"],
    hint: "L_alas = 3V/t, lalu s = √L_alas.",
    discussion: [
      "L_alas = (3 × 300) / 9 = 900 / 9 = 100 cm².",
      "s = √100 = 10 cm.",
    ],
  },
  {
    id: "p8",
    question:
      "Pernyataan: Volume limas adalah 1/3 dari volume PRISMA dengan ALAS dan TINGGI yang sama.",
    kind: "truefalse",
    correct: true,
    hint: "Cek rumus V_prisma = L_alas × t dan V_limas = 1/3 × L_alas × t.",
    discussion: [
      "BENAR. Itulah mengapa rumus limas adalah 1/3 × Luas Alas × tinggi.",
      "Tiga limas yang kongruen membentuk satu prisma dengan alas dan tinggi yang sama.",
    ],
  },
];

const LimasLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 8 · Bab Bangun Ruang Sisi Datar"
    title="Limas — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo singkap rahasia LIMAS 🔺! Kamu akan menemukan rumus jumlah unsur, luas permukaan, dan volume limas — sambil bermain seret kartu jenis limas dan cocokkan rumusnya!"
    situations={situations}
    guidedIntro="Jawab pertanyaan berurutan. Setiap jawabanmu menuntun ke rumus baku."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    midSlot={
      <section className="rounded-3xl border border-yellow-300/30 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-rose-500/10 p-5 md:p-6 shadow-[0_0_45px_rgba(251,191,36,0.18)]">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🔺</span>
          <div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-yellow-200">
              Laboratorium Jaring-Jaring Limas
            </h3>
            <p className="text-sm text-white/70">
              Buka tiap sisi tegak limas. Lihat: alas (segi banyak) + n segitiga sisi tegak ✨
            </p>
          </div>
        </div>
        <JaringLimasInteraktif />
        <p className="mt-3 text-xs text-white/65 italic">
          💡 Setelah jaring-jaring terbentuk: L = Luas Alas + Σ Luas Sisi Tegak.
        </p>
      </section>
    }
    games={games}
    practiceIntro="Asah pemahamanmu lewat soal latihan tentang limas!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-8/bangun-ruang-sisi-datar"
    backLabel="Kembali ke Menu Bangun Ruang Sisi Datar"
    scoreMessages={{
      perfect: "🌟 Mantap! Pemahaman limas-mu sudah top!",
      high: "👍 Bagus! Cek kembali jawaban yang merah.",
      medium: "🚀 Mulai paham. Ulangi penemuan terbimbing & main game-nya.",
      low: "💪 Tetap semangat! Ingat V = 1/3 × Luas Alas × t.",
    }}
  />
);

export default LimasLKPDPage;
