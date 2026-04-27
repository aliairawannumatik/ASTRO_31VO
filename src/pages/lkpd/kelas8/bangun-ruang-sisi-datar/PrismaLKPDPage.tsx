import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";
import JaringPrismaInteraktif from "@/components/JaringPrismaInteraktif";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Tenda Camping (Prisma Segitiga)",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 220 160" className="w-full">
          <rect width="220" height="160" fill="#0b1220" rx="8" />
          <polygon points="40,130 160,130 180,100 60,100" fill="#34d399" fillOpacity="0.5" stroke="#6ee7b7" strokeWidth="2" />
          <polygon points="40,130 100,40 160,130" fill="#10b981" fillOpacity="0.55" stroke="#6ee7b7" strokeWidth="2" />
          <polygon points="160,130 180,100 120,40 100,40" fill="#047857" fillOpacity="0.7" stroke="#6ee7b7" strokeWidth="2" />
          <text x="100" y="148" fontSize="11" fontWeight="bold" fill="#fbbf24" textAnchor="middle">tinggi prisma</text>
          <text x="170" y="60" fontSize="10" fontWeight="bold" fill="#fbbf24" textAnchor="middle">alas Δ</text>
        </svg>
      </div>
    ),
    text:
      "Sebuah tenda berbentuk PRISMA SEGITIGA. Bagian alas dan tutupnya berupa SEGITIGA yang KONGRUEN, sedangkan sisi-sisi tegaknya berupa PERSEGI PANJANG.",
  },
  {
    title: "Situasi 2 — Lemari Berbentuk Prisma Segiempat",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-700/20 border border-purple-300/40 p-3">
        <svg viewBox="0 0 220 160" className="w-full">
          <rect width="220" height="160" fill="#0b1220" rx="8" />
          <polygon points="50,130 150,130 180,100 80,100" fill="#a78bfa" fillOpacity="0.45" stroke="#c4b5fd" strokeWidth="2" />
          <polygon points="50,40 150,40 150,130 50,130" fill="#7c3aed" fillOpacity="0.55" stroke="#c4b5fd" strokeWidth="2" />
          <polygon points="150,40 180,15 180,100 150,130" fill="#5b21b6" fillOpacity="0.7" stroke="#c4b5fd" strokeWidth="2" />
          <polygon points="50,40 80,15 180,15 150,40" fill="#ddd6fe" fillOpacity="0.7" stroke="#c4b5fd" strokeWidth="2" />
          <text x="40" y="85" fontSize="11" fontWeight="bold" fill="#fbbf24" textAnchor="middle">t</text>
        </svg>
      </div>
    ),
    text:
      "Pernahkah kamu memperhatikan lemari atau buku tebal? Itu bisa dikatakan PRISMA SEGIEMPAT (sama bentuknya dengan balok). Konsep utama prisma: ALAS dan TUTUP yang KONGRUEN, dihubungkan oleh SISI TEGAK persegi panjang.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Prisma adalah bangun ruang yang dibatasi oleh dua bidang sejajar dan kongruen sebagai ALAS dan TUTUP, dihubungkan oleh sisi tegak berbentuk …",
    kind: "fill",
    answers: ["persegi panjang", "persegipanjang", "persegi-panjang"],
    discussion: [
      "Sisi tegak prisma TEGAK LURUS terhadap alas (untuk prisma tegak) berbentuk PERSEGI PANJANG.",
      "Pada prisma miring sisi tegaknya jajar genjang, namun kurikulum SMP fokus pada PRISMA TEGAK.",
    ],
  },
  {
    id: "g2",
    label:
      "Pada PRISMA SEGITIGA banyak sisi (bidang) seluruhnya adalah …",
    kind: "fill",
    answers: ["5", "lima"],
    discussion: [
      "Alas + Tutup (2 segitiga) + 3 sisi tegak (persegi panjang) = 5 sisi.",
    ],
  },
  {
    id: "g3",
    label: "Pada prisma SEGITIGA banyak rusuknya adalah …",
    kind: "fill",
    answers: ["9", "sembilan"],
    discussion: [
      "Alas: 3 rusuk + Tutup: 3 rusuk + Tegak: 3 rusuk = 9 rusuk.",
    ],
  },
  {
    id: "g4",
    label: "Pada prisma SEGITIGA banyak titik sudutnya adalah …",
    kind: "fill",
    answers: ["6", "enam"],
    discussion: [
      "3 titik sudut alas + 3 titik sudut tutup = 6 titik sudut.",
    ],
  },
  {
    id: "g5",
    label:
      "Untuk prisma segi-n, banyak SISI prisma tersebut adalah …",
    kind: "choice",
    options: ["n", "n + 2", "2n", "3n"],
    correctIndex: 1,
    discussion: [
      "Banyak sisi tegak = n (sebanyak rusuk alas).",
      "Ditambah alas dan tutup → total = n + 2.",
    ],
  },
  {
    id: "g6",
    label:
      "Untuk prisma segi-n, banyak RUSUK seluruhnya adalah …",
    kind: "choice",
    options: ["n", "2n", "3n", "n + 2"],
    correctIndex: 2,
    discussion: [
      "Rusuk alas = n, rusuk tutup = n, rusuk tegak = n.",
      "Total = 3n.",
    ],
  },
  {
    id: "g7",
    label:
      "Untuk prisma segi-n, banyak TITIK SUDUT-nya adalah …",
    kind: "choice",
    options: ["n", "2n", "3n", "n + 2"],
    correctIndex: 1,
    discussion: [
      "Sudut alas = n, sudut tutup = n. Total = 2n.",
    ],
  },
  {
    id: "g8",
    label:
      "Luas selimut (semua sisi tegak) prisma = … × tinggi prisma.",
    kind: "fill",
    answers: ["keliling alas", "kelilingalas", "keliling-alas", "k.alas", "kelas", "keliling"],
    discussion: [
      "Selimut prisma jika dibuka membentuk persegi panjang.",
      "Panjangnya = KELILING ALAS, lebarnya = TINGGI prisma.",
      "Maka L_selimut = K_alas × t.",
    ],
  },
  {
    id: "g9",
    label: "Rumus LUAS PERMUKAAN prisma adalah …",
    kind: "choice",
    options: [
      "Luas alas + tinggi",
      "2 × Luas alas + Keliling alas × tinggi",
      "Luas alas × tinggi",
      "Luas alas + Keliling alas",
    ],
    correctIndex: 1,
    discussion: [
      "L = (Luas Alas + Luas Tutup) + Luas Selimut.",
      "Karena alas ≅ tutup, jadi L = 2 × L_alas + K_alas × t.",
    ],
  },
  {
    id: "g10",
    label: "Rumus VOLUME prisma adalah …",
    kind: "choice",
    options: [
      "Luas Alas × tinggi",
      "1/3 × Luas Alas × tinggi",
      "Keliling Alas × tinggi",
      "Luas Alas + tinggi",
    ],
    correctIndex: 0,
    discussion: [
      "V = Luas Alas × tinggi.",
      "Konsep: volume bangun ruang dengan bentuk yang sama dari alas ke tutup.",
    ],
  },
  {
    id: "g11",
    label:
      "Sebuah prisma alas SEGITIGA SIKU-SIKU dengan sisi siku-siku 6 cm dan 8 cm. Tinggi prisma 10 cm. Volume = … cm³.",
    kind: "fill",
    answers: ["240"],
    discussion: [
      "Luas alas = 1/2 × 6 × 8 = 24 cm².",
      "V = 24 × 10 = 240 cm³.",
    ],
  },
  {
    id: "g12",
    label: "Pasangkan jenis prisma dengan ciri unsurnya:",
    kind: "match",
    pairs: [
      { left: "Prisma Segitiga", right: "5 sisi, 9 rusuk, 6 titik sudut" },
      { left: "Prisma Segiempat", right: "6 sisi, 12 rusuk, 8 titik sudut" },
      { left: "Prisma Segilima", right: "7 sisi, 15 rusuk, 10 titik sudut" },
      { left: "Prisma Segienam", right: "8 sisi, 18 rusuk, 12 titik sudut" },
    ],
    discussion: [
      "Pakai rumus: Sisi = n+2, Rusuk = 3n, Titik sudut = 2n.",
      "Untuk segitiga (n=3): 5, 9, 6.",
      "Untuk segiempat (n=4): 6, 12, 8.",
      "Untuk segilima (n=5): 7, 15, 10.",
      "Untuk segienam (n=6): 8, 18, 12.",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Unsur Prisma Segi-n",
    text: "Sisi: n + 2. Rusuk: 3n. Titik Sudut: 2n. Alas dan tutup KONGRUEN dan SEJAJAR, sisi tegak berupa persegi panjang.",
    tone: "emerald",
  },
  {
    title: "Rumus Baku",
    text: "Luas Permukaan: L = 2 × Luas_Alas + Keliling_Alas × t. Volume: V = Luas_Alas × t. Selimut: L_selimut = Keliling_Alas × t.",
    tone: "yellow",
  },
  {
    title: "Tips Cepat",
    text: "Untuk prisma segitiga siku-siku: Luas alas = 1/2 × a × b. Untuk prisma segi-n beraturan: Keliling = n × s.",
    tone: "violet",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "prisma-game-unsur",
    title: "🎯 Game 1 — Cocokkan Unsur Prisma (Seret!)",
    description: "Seret kartu jenis prisma ke kelompok JUMLAH SISI yang TEPAT.",
    buckets: [
      { id: "s5", label: "5 SISI", emoji: "🔺", color: "emerald" },
      { id: "s6", label: "6 SISI", emoji: "🟦", color: "cyan" },
      { id: "s7", label: "7 SISI", emoji: "⬟", color: "amber" },
      { id: "s8", label: "8 SISI", emoji: "⬡", color: "violet" },
    ],
    items: [
      { id: "ps3", label: "Prisma Segitiga (n=3)", bucketId: "s5", emoji: "🔺" },
      { id: "ps4", label: "Prisma Segiempat (n=4)", bucketId: "s6", emoji: "🟦" },
      { id: "ps5", label: "Prisma Segilima (n=5)", bucketId: "s7", emoji: "⬟" },
      { id: "ps6", label: "Prisma Segienam (n=6)", bucketId: "s8", emoji: "⬡" },
      { id: "ps3b", label: "Tenda Tridimensi", bucketId: "s5", emoji: "⛺" },
      { id: "ps4b", label: "Lemari Buku Tegak", bucketId: "s6", emoji: "📚" },
    ],
  },
  {
    kind: "arrow-match",
    id: "prisma-game-volume",
    title: "🎯 Game 2 — Cari Volume Prisma",
    description: "Pasangkan setiap prisma dengan VOLUME yang benar. Tekan ◀ ▶ untuk mengganti.",
    rightOptions: ["60 cm³", "120 cm³", "150 cm³", "200 cm³", "240 cm³", "300 cm³", "360 cm³"],
    pairs: [
      { id: "v1", left: "L_alas 12 cm², t 10 cm", correctRight: "120 cm³", emoji: "🔷" },
      { id: "v2", left: "L_alas 15 cm², t 10 cm", correctRight: "150 cm³", emoji: "🔷" },
      { id: "v3", left: "L_alas 30 cm², t 8 cm", correctRight: "240 cm³", emoji: "🔷" },
      { id: "v4", left: "Δ siku-siku 6×8, t 10 cm", correctRight: "240 cm³", emoji: "🔷" },
      { id: "v5", left: "L_alas 20 cm², t 15 cm", correctRight: "300 cm³", emoji: "🔷" },
      { id: "v6", left: "L_alas 12 cm², t 5 cm", correctRight: "60 cm³", emoji: "🔷" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question:
      "Sebuah prisma alas SEGITIGA SIKU-SIKU dengan sisi siku-siku 9 cm dan 12 cm. Tinggi prisma 15 cm. Volume prisma = … cm³.",
    kind: "fill",
    answers: ["810"],
    hint: "V = (1/2 × a × b) × t.",
    discussion: [
      "L_alas = 1/2 × 9 × 12 = 54 cm².",
      "V = 54 × 15 = 810 cm³.",
    ],
  },
  {
    id: "p2",
    question:
      "Sebuah prisma alas persegi sisi 6 cm dan tinggi 10 cm. Luas permukaan = … cm².",
    kind: "fill",
    answers: ["312"],
    hint: "L = 2 × L_alas + K_alas × t.",
    discussion: [
      "L_alas = 6² = 36 cm². K_alas = 4 × 6 = 24 cm.",
      "L = 2 × 36 + 24 × 10 = 72 + 240 = 312 cm².",
    ],
  },
  {
    id: "p3",
    question: "Banyak sisi prisma SEGISEPULUH adalah …",
    kind: "fill",
    answers: ["12"],
    hint: "Sisi prisma segi-n = n + 2.",
    discussion: ["Sisi = 10 + 2 = 12."],
  },
  {
    id: "p4",
    question: "Banyak rusuk prisma SEGIDELAPAN adalah …",
    kind: "fill",
    answers: ["24"],
    hint: "Rusuk prisma segi-n = 3n.",
    discussion: ["Rusuk = 3 × 8 = 24."],
  },
  {
    id: "p5",
    question:
      "Sebuah tenda berbentuk prisma segitiga sama kaki memiliki alas 4 m, tinggi alas (tinggi segitiga) 2 m, dan panjang tenda 5 m. Volume tenda = … m³.",
    kind: "fill",
    answers: ["20"],
    hint: "V = (1/2 × a × t_alas) × tinggi_prisma.",
    discussion: [
      "L_alas = 1/2 × 4 × 2 = 4 m².",
      "V = 4 × 5 = 20 m³.",
    ],
  },
  {
    id: "p6",
    question:
      "Pernyataan: Pada prisma TEGAK, semua sisi tegaknya berbentuk persegi panjang.",
    kind: "truefalse",
    correct: true,
    hint: "Pikirkan definisi prisma tegak.",
    discussion: [
      "BENAR. Pada prisma TEGAK, sisi tegak ⊥ alas → berbentuk persegi panjang.",
    ],
  },
  {
    id: "p7",
    question:
      "Volume prisma 720 cm³. Jika tinggi prisma 12 cm, luas alasnya = … cm².",
    kind: "fill",
    answers: ["60"],
    hint: "L_alas = V / t.",
    discussion: ["L_alas = 720 / 12 = 60 cm²."],
  },
  {
    id: "p8",
    question:
      "Manakah berikut yang BUKAN merupakan ciri prisma segi-n?",
    kind: "choice",
    options: [
      "Memiliki n + 2 sisi",
      "Memiliki 3n rusuk",
      "Alas dan tutup KONGRUEN",
      "Memiliki 1 titik puncak",
    ],
    correctIndex: 3,
    hint: "Pikirkan: bangun ruang apa yang punya 1 titik puncak?",
    discussion: [
      "Yang punya 1 titik puncak adalah LIMAS, bukan prisma.",
      "Prisma punya alas DAN tutup yang kongruen.",
    ],
  },
];

const PrismaLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 8 · Bab Bangun Ruang Sisi Datar"
    title="Prisma — Penemuan Terbimbing"
    intro="Sobat Numatik, mari ungkap rahasia PRISMA 🔷! Kamu akan menemukan rumus jumlah unsur, luas permukaan, dan volume prisma — sambil bermain seret kartu menentukan jenis prisma!"
    situations={situations}
    guidedIntro="Jawab pertanyaan berurutan. Setiap jawabanmu menuntun ke rumus baku."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    midSlot={
      <section className="rounded-3xl border border-emerald-300/30 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 p-5 md:p-6 shadow-[0_0_45px_rgba(52,211,153,0.18)]">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🧩</span>
          <div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-emerald-200">
              Laboratorium Jaring-Jaring Prisma
            </h3>
            <p className="text-sm text-white/70">
              Geser & buka tiap sisi tegak agar terbentuk JARING-JARING. Lihat: dua segitiga (alas-tutup) + persegi panjang sisi tegak ✨
            </p>
          </div>
        </div>
        <JaringPrismaInteraktif />
        <p className="mt-3 text-xs text-white/65 italic">
          💡 Setelah jaring-jaring terbuka, hitung: L = 2 × L_alas + K_alas × t.
        </p>
      </section>
    }
    games={games}
    practiceIntro="Asah pemahamanmu lewat soal latihan tentang prisma!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-8/bangun-ruang-sisi-datar"
    backLabel="Kembali ke Menu Bangun Ruang Sisi Datar"
    scoreMessages={{
      perfect: "🌟 Keren! Pemahaman prisma-mu sudah top!",
      high: "👍 Bagus! Cek kembali jawaban yang merah.",
      medium: "🚀 Mulai paham. Ulangi penemuan terbimbing & main game-nya.",
      low: "💪 Tetap semangat! Mulai dari rumus L = 2L_alas + K_alas × t dan V = L_alas × t.",
    }}
  />
);

export default PrismaLKPDPage;
