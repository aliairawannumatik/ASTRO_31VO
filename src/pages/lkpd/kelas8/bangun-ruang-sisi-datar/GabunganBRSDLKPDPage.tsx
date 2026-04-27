import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Rumah Adat (Balok + Limas)",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-orange-500/20 to-rose-700/20 border border-orange-300/40 p-3">
        <svg viewBox="0 0 220 160" className="w-full">
          <rect width="220" height="160" fill="#0b1220" rx="8" />
          <polygon points="40,140 160,140 190,115 70,115" fill="#fb923c" fillOpacity="0.45" stroke="#fed7aa" strokeWidth="2" />
          <polygon points="40,80 160,80 160,140 40,140" fill="#ea580c" fillOpacity="0.55" stroke="#fed7aa" strokeWidth="2" />
          <polygon points="160,80 190,55 190,115 160,140" fill="#c2410c" fillOpacity="0.7" stroke="#fed7aa" strokeWidth="2" />
          <polygon points="40,80 70,55 190,55 160,80" fill="#fdba74" fillOpacity="0.7" stroke="#fed7aa" strokeWidth="2" />
          <polygon points="40,80 100,15 70,55" fill="#dc2626" fillOpacity="0.7" stroke="#fda4af" strokeWidth="2" />
          <polygon points="100,15 160,80 70,55" fill="#ef4444" fillOpacity="0.55" stroke="#fda4af" strokeWidth="2" />
          <polygon points="100,15 190,55 160,80" fill="#b91c1c" fillOpacity="0.75" stroke="#fda4af" strokeWidth="2" />
          <text x="100" y="155" fontSize="10" fontWeight="bold" fill="#fbbf24" textAnchor="middle">Balok + Limas (atap)</text>
        </svg>
      </div>
    ),
    text:
      "Banyak rumah adat berbentuk GABUNGAN BALOK (badan rumah) dan LIMAS (atap). Untuk menghitung volume totalnya, jumlahkan kedua volume.",
  },
  {
    title: "Situasi 2 — Tugu Berbentuk Kubus + Limas",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 220 160" className="w-full">
          <rect width="220" height="160" fill="#0b1220" rx="8" />
          <polygon points="60,140 140,140 170,115 90,115" fill="#34d399" fillOpacity="0.45" stroke="#6ee7b7" strokeWidth="2" />
          <polygon points="60,80 140,80 140,140 60,140" fill="#10b981" fillOpacity="0.55" stroke="#6ee7b7" strokeWidth="2" />
          <polygon points="140,80 170,55 170,115 140,140" fill="#047857" fillOpacity="0.7" stroke="#6ee7b7" strokeWidth="2" />
          <polygon points="60,80 90,55 170,55 140,80" fill="#a7f3d0" fillOpacity="0.7" stroke="#6ee7b7" strokeWidth="2" />
          <polygon points="60,80 100,15 90,55" fill="#22d3ee" fillOpacity="0.7" stroke="#67e8f9" strokeWidth="2" />
          <polygon points="100,15 140,80 90,55" fill="#06b6d4" fillOpacity="0.55" stroke="#67e8f9" strokeWidth="2" />
          <polygon points="100,15 170,55 140,80" fill="#0891b2" fillOpacity="0.75" stroke="#67e8f9" strokeWidth="2" />
          <text x="100" y="155" fontSize="10" fontWeight="bold" fill="#fbbf24" textAnchor="middle">Kubus + Limas (puncak)</text>
        </svg>
      </div>
    ),
    text:
      "Kadang luas permukaan gabungan TIDAK SAMA dengan jumlah luas permukaan dua bangun, karena ada sisi yang BERHIMPIT (saling tertutup) dan tidak terlihat.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Untuk menghitung VOLUME bangun ruang gabungan, kita …",
    kind: "choice",
    options: [
      "Selalu mengurangkan kedua volume",
      "Menjumlahkan volume tiap bangun penyusun (jika menempel/menyatu)",
      "Membagi dua volume",
      "Mengkalikan kedua volume",
    ],
    correctIndex: 1,
    discussion: [
      "V_gabungan = V₁ + V₂ + … (jika bangun-bangun MENYATU/TIDAK BERPOTONGAN volumenya).",
      "Jika ada bagian yang DIPOTONG/BOLONG, kita KURANGI volume bagian itu.",
    ],
  },
  {
    id: "g2",
    label:
      "Untuk menghitung LUAS PERMUKAAN gabungan, kita harus berhati-hati pada bagian sisi yang …",
    kind: "fill",
    answers: ["berhimpit", "menempel", "tertutup", "berimpit"],
    discussion: [
      "Sisi yang BERHIMPIT (kedua bangun saling menempel) TIDAK terlihat → tidak dihitung.",
      "L_gabungan = (L₁ + L₂) − 2 × Luas Sisi Berhimpit.",
    ],
  },
  {
    id: "g3",
    label:
      "Sebuah bangun terdiri dari KUBUS rusuk 6 cm dengan tutup berupa LIMAS persegi (alas 6 cm, tinggi 4 cm). Volume gabungan = … cm³.",
    kind: "fill",
    answers: ["264"],
    discussion: [
      "V_kubus = 6³ = 216 cm³.",
      "V_limas = 1/3 × 6² × 4 = 1/3 × 144 = 48 cm³.",
      "V_total = 216 + 48 = 264 cm³.",
    ],
  },
  {
    id: "g4",
    label:
      "Sebuah bangun terdiri dari BALOK 8×6×4 cm DAN di atasnya LIMAS dengan alas 8×6 cm dan tinggi 5 cm. Volume gabungan = … cm³.",
    kind: "fill",
    answers: ["272"],
    discussion: [
      "V_balok = 8 × 6 × 4 = 192 cm³.",
      "V_limas = 1/3 × (8 × 6) × 5 = 1/3 × 240 = 80 cm³.",
      "V_total = 192 + 80 = 272 cm³.",
    ],
  },
  {
    id: "g5",
    label:
      "Pernyataan: Pada bangun gabungan KUBUS + LIMAS PERSEGI di atas tutupnya, sisi alas limas dan sisi atas kubus BERHIMPIT.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Maka saat menghitung luas permukaan, sisi tutup kubus dan sisi alas limas (keduanya kongruen) TIDAK ikut dihitung.",
    ],
  },
  {
    id: "g6",
    label:
      "Sebuah bangun gabungan KUBUS rusuk 4 cm + LIMAS persegi di atasnya (alas 4, tinggi sisi tegak 5 cm). Luas permukaan gabungan = … cm².",
    kind: "fill",
    answers: ["120"],
    discussion: [
      "L_kubus tanpa tutup = 5 × 4² = 80 cm².",
      "L_4 sisi tegak limas = 4 × (1/2 × 4 × 5) = 40 cm².",
      "L_total = 80 + 40 = 120 cm².",
    ],
  },
  {
    id: "g7",
    label:
      "Sebuah balok 12×8×5 cm dilubangi prisma segitiga (alas siku 3×4, tinggi prisma 5 cm). Volume yang TERSISA = … cm³.",
    kind: "fill",
    answers: ["450"],
    discussion: [
      "V_balok = 12 × 8 × 5 = 480 cm³.",
      "V_prisma = (1/2 × 3 × 4) × 5 = 6 × 5 = 30 cm³.",
      "V_sisa = 480 − 30 = 450 cm³.",
    ],
  },
  {
    id: "g8",
    label:
      "Manakah strategi yang TEPAT untuk gabungan PRISMA + LIMAS?",
    kind: "choice",
    options: [
      "V = V_prisma × V_limas",
      "V = V_prisma + V_limas (jika menyatu)",
      "V = V_prisma − V_limas (selalu)",
      "V = (V_prisma + V_limas) / 2",
    ],
    correctIndex: 1,
    discussion: [
      "Jika prisma dan limas DIGABUNG (menyatu), volumenya DIJUMLAHKAN.",
    ],
  },
  {
    id: "g9",
    label: "Pasangkan bangun gabungan dengan strategi rumus volume:",
    kind: "match",
    pairs: [
      { left: "Kubus + Limas (atap)", right: "V_kubus + V_limas" },
      { left: "Balok dilubangi tabung (kosong)", right: "V_balok − V_tabung" },
      { left: "Dua balok bersusun", right: "V₁ + V₂" },
      { left: "Prisma + Limas", right: "V_prisma + V_limas" },
    ],
    discussion: [
      "Bangun MENYATU → DIJUMLAHKAN.",
      "Bangun DILUBANGI → DIKURANGKAN.",
    ],
  },
  {
    id: "g10",
    label:
      "Sebuah bak air bagian bawah berupa BALOK 50×40×30 cm dan bagian atas berupa PRISMA segitiga sama kaki (alas 50, tinggi alas 20, tinggi prisma 40 cm). Volume total bak = … cm³.",
    kind: "fill",
    answers: ["80000"],
    discussion: [
      "V_balok = 50 × 40 × 30 = 60.000 cm³.",
      "V_prisma = (1/2 × 50 × 20) × 40 = 500 × 40 = 20.000 cm³.",
      "V_total = 60.000 + 20.000 = 80.000 cm³.",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Strategi Volume Gabungan",
    text: "MENYATU → V_total = V₁ + V₂. DILUBANGI / DIPOTONG → V_total = V_besar − V_potongan. Selalu identifikasi bangun penyusunnya dulu!",
    tone: "cyan",
  },
  {
    title: "Strategi Luas Permukaan Gabungan",
    text: "L_total = (L₁ + L₂) − 2 × Luas Sisi BERHIMPIT. Sisi yang menempel TIDAK terlihat → kurangi DUA KALI dari total awal.",
    tone: "rose",
  },
  {
    title: "Tips Pemecahan Masalah",
    text: "1) Sketsa bangun. 2) Kelompokkan jadi bangun standar. 3) Hitung tiap bagian. 4) Periksa sisi berhimpit untuk LP. 5) Konversi satuan jika perlu.",
    tone: "yellow",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "gabungan-game-strategi",
    title: "🎯 Game 1 — Pilih Strategi (Seret!)",
    description: "Seret bentuk bangun gabungan ke kategori STRATEGI yang TEPAT.",
    buckets: [
      { id: "tambah", label: "JUMLAHKAN VOLUME", emoji: "➕", color: "emerald" },
      { id: "kurang", label: "KURANGKAN VOLUME", emoji: "➖", color: "rose" },
    ],
    items: [
      { id: "s1", label: "Kubus + Limas (atap)", bucketId: "tambah", emoji: "🏠" },
      { id: "s2", label: "Balok bertingkat 2", bucketId: "tambah", emoji: "🏢" },
      { id: "s3", label: "Balok dilubangi prisma", bucketId: "kurang", emoji: "🕳️" },
      { id: "s4", label: "Prisma + Limas (menyatu)", bucketId: "tambah", emoji: "⛺" },
      { id: "s5", label: "Kubus dengan lubang berbentuk balok", bucketId: "kurang", emoji: "🕳️" },
      { id: "s6", label: "Tugu: kubus + limas", bucketId: "tambah", emoji: "🗽" },
    ],
  },
  {
    kind: "arrow-match",
    id: "gabungan-game-volume",
    title: "🎯 Game 2 — Cari Volume Gabungan",
    description: "Pasangkan kasus gabungan dengan VOLUME-nya.",
    rightOptions: ["72 cm³", "120 cm³", "264 cm³", "272 cm³", "450 cm³", "80.000 cm³"],
    pairs: [
      { id: "g1", left: "Kubus 6 + Limas alas 6 t 4", correctRight: "264 cm³", emoji: "🏠" },
      { id: "g2", left: "Balok 8×6×4 + Limas alas 8×6 t 5", correctRight: "272 cm³", emoji: "🏠" },
      { id: "g3", left: "Balok 12×8×5 dilubangi prisma 6 cm³ × 5", correctRight: "450 cm³", emoji: "🕳️" },
      { id: "g4", left: "Bak: balok 50×40×30 + prisma di atas", correctRight: "80.000 cm³", emoji: "🛁" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question:
      "Sebuah TUGU berbentuk KUBUS rusuk 8 cm di bawah dan LIMAS persegi (alas 8 cm, tinggi 9 cm) di atasnya. Volume tugu = … cm³.",
    kind: "fill",
    answers: ["704"],
    hint: "V_total = V_kubus + V_limas.",
    discussion: [
      "V_kubus = 8³ = 512 cm³.",
      "V_limas = 1/3 × 8² × 9 = 1/3 × 576 = 192 cm³.",
      "V_total = 512 + 192 = 704 cm³.",
    ],
  },
  {
    id: "p2",
    question:
      "Rumah berbentuk balok 10 × 6 × 4 m dengan atap PRISMA segitiga (alas 6, tinggi alas 2, tinggi prisma 10 m). Volume rumah = … m³.",
    kind: "fill",
    answers: ["300"],
    hint: "V = V_balok + V_prisma.",
    discussion: [
      "V_balok = 10 × 6 × 4 = 240 m³.",
      "V_prisma = (1/2 × 6 × 2) × 10 = 6 × 10 = 60 m³.",
      "V_total = 240 + 60 = 300 m³.",
    ],
  },
  {
    id: "p3",
    question:
      "Sebuah balok 10 × 8 × 6 cm dilubangi sebuah balok kecil 4 × 4 × 6 cm yang menembus dari sisi atas ke alas. Volume sisa = … cm³.",
    kind: "fill",
    answers: ["384"],
    hint: "V_sisa = V_besar − V_lubang.",
    discussion: [
      "V_besar = 10 × 8 × 6 = 480 cm³.",
      "V_lubang = 4 × 4 × 6 = 96 cm³.",
      "V_sisa = 480 − 96 = 384 cm³.",
    ],
  },
  {
    id: "p4",
    question:
      "Sebuah kubus rusuk 5 cm digabung dengan kubus lain rusuk 5 cm menempel pada satu sisi. Luas permukaan gabungan = … cm².",
    kind: "fill",
    answers: ["250"],
    hint: "L = 2 × L_kubus − 2 × Luas sisi berhimpit.",
    discussion: [
      "L_kubus = 6 × 5² = 150 cm² (per kubus).",
      "L total awal = 2 × 150 = 300 cm².",
      "Sisi berhimpit (1 sisi pada masing-masing kubus): kurangi 2 × 25 = 50.",
      "L_gabungan = 300 − 50 = 250 cm².",
    ],
  },
  {
    id: "p5",
    question:
      "Manakah strategi yang TEPAT jika sebuah balok BESAR DILUBANGI bangun lain?",
    kind: "choice",
    options: [
      "V_total = V_balok + V_lubang",
      "V_total = V_balok − V_lubang",
      "V_total = V_balok × V_lubang",
      "V_total = V_lubang ÷ V_balok",
    ],
    correctIndex: 1,
    hint: "Volume yang DILUBANGI dikurangi dari volume utama.",
    discussion: [
      "V_sisa = V_balok − V_lubang.",
    ],
  },
  {
    id: "p6",
    question:
      "Sebuah aquarium berbentuk balok 60 × 40 × 50 cm. Di dalamnya terdapat dekorasi berupa kubus pejal rusuk 10 cm. Jika diisi air penuh, volume AIR yang dapat ditampung = … cm³.",
    kind: "fill",
    answers: ["119000"],
    hint: "V_air = V_balok − V_kubus dekorasi.",
    discussion: [
      "V_balok = 60 × 40 × 50 = 120.000 cm³.",
      "V_kubus = 10³ = 1.000 cm³.",
      "V_air = 120.000 − 1.000 = 119.000 cm³.",
    ],
  },
  {
    id: "p7",
    question:
      "Sebuah benda berbentuk PRISMA segiempat 6 × 6 × 8 cm di bagian bawah dan LIMAS persegi (alas 6×6, tinggi 4 cm) menempel di atas. Volume total = … cm³.",
    kind: "fill",
    answers: ["336"],
    hint: "V = V_prisma + V_limas.",
    discussion: [
      "V_prisma = 6 × 6 × 8 = 288 cm³.",
      "V_limas = 1/3 × 6² × 4 = 48 cm³.",
      "V_total = 288 + 48 = 336 cm³.",
    ],
  },
  {
    id: "p8",
    question:
      "Pernyataan: Saat menghitung LUAS PERMUKAAN gabungan KUBUS + LIMAS di tutup, kita harus MENGURANGI sisi tutup kubus dan sisi alas limas dari total.",
    kind: "truefalse",
    correct: true,
    hint: "Sisi yang berhimpit tidak terlihat.",
    discussion: [
      "BENAR. Sisi tutup kubus & sisi alas limas SALING BERHIMPIT (tertutup) → tidak dihitung.",
    ],
  },
];

const GabunganBRSDLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 8 · Bab Bangun Ruang Sisi Datar"
    title="Gabungan Bangun Ruang Sisi Datar — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo taklukkan BANGUN RUANG GABUNGAN 🏠! Kamu akan menemukan strategi menghitung volume & luas permukaan bangun yang terdiri dari kubus, balok, prisma, dan limas — sambil bermain seret untuk memilih strategi yang tepat!"
    situations={situations}
    guidedIntro="Jawab pertanyaan berurutan. Setiap jawabanmu menuntun pada strategi pemecahan."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu lewat soal latihan tentang bangun gabungan!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-8/bangun-ruang-sisi-datar"
    backLabel="Kembali ke Menu Bangun Ruang Sisi Datar"
    scoreMessages={{
      perfect: "🌟 Mantap sekali! Strategi gabunganmu sudah top!",
      high: "👍 Bagus! Cek kembali bagian yang masih merah.",
      medium: "🚀 Mulai paham. Pelajari ulang strategi gabungan & main game-nya.",
      low: "💪 Tetap semangat! Mulai dari ide DASAR: jumlahkan jika menyatu, kurangkan jika dilubangi.",
    }}
  />
);

export default GabunganBRSDLKPDPage;
