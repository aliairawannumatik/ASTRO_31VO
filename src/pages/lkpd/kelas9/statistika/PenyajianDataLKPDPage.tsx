import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Diagram Batang Nilai",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <line x1="40" y1="170" x2="260" y2="170" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="40" y1="30" x2="40" y2="170" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="20" y="170" fontSize="9" fill="#94a3b8">0</text>
          <text x="20" y="135" fontSize="9" fill="#94a3b8">5</text>
          <text x="15" y="100" fontSize="9" fill="#94a3b8">10</text>
          <text x="15" y="65" fontSize="9" fill="#94a3b8">15</text>
          <rect x="55" y="135" width="30" height="35" fill="#22d3ee" />
          <text x="70" y="185" fontSize="9" fill="#fff" textAnchor="middle">6</text>
          <rect x="95" y="100" width="30" height="70" fill="#a78bfa" />
          <text x="110" y="185" fontSize="9" fill="#fff" textAnchor="middle">7</text>
          <rect x="135" y="65" width="30" height="105" fill="#fbbf24" />
          <text x="150" y="185" fontSize="9" fill="#fff" textAnchor="middle">8</text>
          <rect x="175" y="100" width="30" height="70" fill="#34d399" />
          <text x="190" y="185" fontSize="9" fill="#fff" textAnchor="middle">9</text>
          <rect x="215" y="135" width="30" height="35" fill="#f472b6" />
          <text x="230" y="185" fontSize="9" fill="#fff" textAnchor="middle">10</text>
          <text x="140" y="20" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">Diagram Batang Nilai</text>
          <text x="70" y="148" fontSize="9" fontWeight="bold" fill="#0b1220" textAnchor="middle">5</text>
          <text x="110" y="113" fontSize="9" fontWeight="bold" fill="#fff" textAnchor="middle">10</text>
          <text x="150" y="78" fontSize="9" fontWeight="bold" fill="#0b1220" textAnchor="middle">15</text>
          <text x="190" y="113" fontSize="9" fontWeight="bold" fill="#fff" textAnchor="middle">10</text>
          <text x="230" y="148" fontSize="9" fontWeight="bold" fill="#fff" textAnchor="middle">5</text>
        </svg>
      </div>
    ),
    text:
      "Diagram batang menampilkan nilai 6, 7, 8, 9, 10 dengan frekuensi 5, 10, 15, 10, 5. Tinggi batang menunjukkan FREKUENSI. Diagram batang cocok untuk membandingkan kategori atau kelompok.",
  },
  {
    title: "Situasi 2 — Diagram Lingkaran Hobi",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-700/20 border border-rose-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="#94a3b8" strokeWidth="1" />
          <path d="M 100 100 L 100 40 A 60 60 0 0 1 152 130 Z" fill="#22d3ee" />
          <path d="M 100 100 L 152 130 A 60 60 0 0 1 70 152 Z" fill="#a78bfa" />
          <path d="M 100 100 L 70 152 A 60 60 0 0 1 48 130 Z" fill="#fbbf24" />
          <path d="M 100 100 L 48 130 A 60 60 0 0 1 100 40 Z" fill="#f472b6" />
          <text x="200" y="50" fontSize="11" fontWeight="bold" fill="#fff">Hobi 60 siswa:</text>
          <rect x="195" y="65" width="10" height="10" fill="#22d3ee" />
          <text x="210" y="74" fontSize="10" fill="#22d3ee">Olahraga 25%</text>
          <rect x="195" y="80" width="10" height="10" fill="#a78bfa" />
          <text x="210" y="89" fontSize="10" fill="#a78bfa">Musik 25%</text>
          <rect x="195" y="95" width="10" height="10" fill="#fbbf24" />
          <text x="210" y="104" fontSize="10" fill="#fbbf24">Membaca 10%</text>
          <rect x="195" y="110" width="10" height="10" fill="#f472b6" />
          <text x="210" y="119" fontSize="10" fill="#f472b6">Game 40%</text>
          <text x="200" y="160" fontSize="9" fill="#fde68a">1 lingkaran = 360°</text>
          <text x="200" y="175" fontSize="9" fill="#fde68a">= 100% = total data</text>
        </svg>
      </div>
    ),
    text:
      "Diagram lingkaran membagi data sesuai PROPORSI. Total = 360° = 100%. Untuk hitung sudut tiap kategori: (frekuensi/total) × 360°. Cocok untuk menampilkan komposisi dari satu kelompok.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Diagram BATANG menampilkan data dengan menggunakan TINGGI/PANJANG batang yang menunjukkan …",
    kind: "choice",
    options: ["jenis data", "frekuensi/banyak data", "warna kategori", "sudut"],
    correctIndex: 1,
    discussion: ["Tinggi batang = frekuensi (banyak data)."],
  },
  {
    id: "g2",
    label:
      "Diagram GARIS cocok digunakan untuk menampilkan data yang menunjukkan …",
    kind: "choice",
    options: [
      "perbandingan kategori",
      "proporsi total",
      "perubahan/perkembangan dari waktu ke waktu",
      "frekuensi tunggal",
    ],
    correctIndex: 2,
    discussion: [
      "Diagram garis = TREN waktu.",
      "Misal suhu harian, jumlah pengunjung tiap bulan.",
    ],
  },
  {
    id: "g3",
    label:
      "Diagram LINGKARAN cocok untuk menampilkan …",
    kind: "choice",
    options: [
      "perubahan terhadap waktu",
      "PROPORSI tiap bagian dari total",
      "frekuensi terbanyak",
      "data ekstrem",
    ],
    correctIndex: 1,
    discussion: ["Diagram lingkaran = PROPORSI/persentase tiap bagian."],
  },
  {
    id: "g4",
    label:
      "Total sudut SATU diagram lingkaran = … °.",
    kind: "fill",
    answers: ["360"],
    discussion: ["Satu lingkaran penuh = 360°."],
  },
  {
    id: "g5",
    label:
      "Untuk menghitung SUDUT tiap kategori dalam diagram lingkaran, rumusnya: (frekuensi / total) × …",
    kind: "fill",
    answers: ["360", "360°", "360 derajat"],
    discussion: ["Sudut = (f / total) × 360°."],
  },
  {
    id: "g6",
    label:
      "Untuk PERSENTASE tiap kategori, rumusnya: (frekuensi / total) × …",
    kind: "fill",
    answers: ["100", "100%"],
    discussion: ["Persentase = (f / total) × 100%."],
  },
  {
    id: "g7",
    label:
      "Dari 60 siswa, 24 menyukai sepak bola. Berapa SUDUT-nya pada diagram lingkaran? …°",
    kind: "fill",
    answers: ["144"],
    discussion: ["(24/60) × 360° = 0,4 × 360° = 144°."],
  },
  {
    id: "g8",
    label:
      "Persentase 24 dari 60 = …%",
    kind: "fill",
    answers: ["40", "40%"],
    discussion: ["(24/60) × 100% = 40%."],
  },
  {
    id: "g9",
    label:
      "Tabel distribusi frekuensi nilai: nilai 6 (f=5), 7 (f=10), 8 (f=15), 9 (f=10), 10 (f=5). Total siswa = …",
    kind: "fill",
    answers: ["45"],
    discussion: ["5+10+15+10+5 = 45."],
  },
  {
    id: "g10",
    label:
      "Pernyataan: Diagram lingkaran PALING TEPAT untuk menampilkan tren suhu kota Jakarta selama 30 hari.",
    kind: "truefalse",
    correct: false,
    discussion: [
      "SALAH. Untuk TREN waktu, gunakan diagram GARIS.",
      "Diagram lingkaran = proporsi.",
    ],
  },
  {
    id: "g11",
    label:
      "Sudut kategori X pada diagram lingkaran 90°. Persentasenya = …%",
    kind: "fill",
    answers: ["25", "25%"],
    discussion: ["(90/360) × 100% = 25%."],
  },
  {
    id: "g12",
    label: "Pasangkan JENIS DIAGRAM dengan KEGUNAANNYA:",
    kind: "match",
    pairs: [
      { left: "Diagram batang", right: "Membandingkan kategori" },
      { left: "Diagram garis", right: "Tren/perubahan terhadap waktu" },
      { left: "Diagram lingkaran", right: "Proporsi dari total" },
      { left: "Tabel frekuensi", right: "Daftar nilai & banyaknya" },
    ],
    discussion: ["Tiap diagram punya KEGUNAAN sendiri-sendiri."],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Tabel & Diagram Batang",
    text: "TABEL FREKUENSI berisi nilai dan banyak data (f). DIAGRAM BATANG menggunakan tinggi batang = frekuensi, cocok untuk membandingkan kategori.",
    tone: "cyan",
  },
  {
    title: "Diagram Garis",
    text: "DIAGRAM GARIS menghubungkan titik-titik data dengan garis. Cocok menampilkan TREN/perkembangan terhadap waktu (suhu, harga, populasi per tahun).",
    tone: "violet",
  },
  {
    title: "Diagram Lingkaran",
    text: "DIAGRAM LINGKARAN membagi 360° / 100% menjadi sektor sesuai proporsi. Sudut = (f/total) × 360°. Persentase = (f/total) × 100%.",
    tone: "yellow",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "penyajian-game-pilih",
    title: "🎯 Game 1 — Pilih Diagram (Seret!)",
    description: "Seret setiap data ke jenis DIAGRAM yang paling COCOK menyajikannya.",
    buckets: [
      { id: "batang", label: "Batang", emoji: "📊", color: "cyan" },
      { id: "garis", label: "Garis", emoji: "📈", color: "violet" },
      { id: "lingkaran", label: "Lingkaran", emoji: "🥧", color: "rose" },
    ],
    items: [
      { id: "p1", label: "Suhu Jakarta 30 hari", bucketId: "garis", emoji: "🌡️" },
      { id: "p2", label: "Hobi 50 siswa (proporsi)", bucketId: "lingkaran", emoji: "🎨" },
      { id: "p3", label: "Nilai UTS 5 kelas", bucketId: "batang", emoji: "💯" },
      { id: "p4", label: "Pertumbuhan penduduk 10 tahun", bucketId: "garis", emoji: "👥" },
      { id: "p5", label: "Persentase agama (%)", bucketId: "lingkaran", emoji: "🕊️" },
      { id: "p6", label: "Bandingkan tinggi siswa per kelas", bucketId: "batang", emoji: "📏" },
      { id: "p7", label: "Harga emas tiap bulan", bucketId: "garis", emoji: "🥇" },
      { id: "p8", label: "Komposisi nutrisi (lemak/protein)", bucketId: "lingkaran", emoji: "🍎" },
    ],
  },
  {
    kind: "arrow-match",
    id: "penyajian-game-sudut",
    title: "🎯 Game 2 — Hitung Sudut Diagram Lingkaran",
    description: "Total = 60 siswa. Pasangkan FREKUENSI dengan SUDUT (atau %). Tekan ◀ ▶.",
    rightOptions: ["30°", "60°", "90°", "120°", "144°", "180°", "240°"],
    pairs: [
      { id: "s1", left: "5 siswa (dari 60)", correctRight: "30°", emoji: "🥧" },
      { id: "s2", left: "10 siswa (dari 60)", correctRight: "60°", emoji: "🥧" },
      { id: "s3", left: "15 siswa (dari 60)", correctRight: "90°", emoji: "🥧" },
      { id: "s4", left: "20 siswa (dari 60)", correctRight: "120°", emoji: "🥧" },
      { id: "s5", left: "24 siswa (dari 60)", correctRight: "144°", emoji: "🥧" },
      { id: "s6", left: "30 siswa (dari 60)", correctRight: "180°", emoji: "🥧" },
      { id: "s7", left: "40 siswa (dari 60)", correctRight: "240°", emoji: "🥧" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question:
      "Dari 80 siswa, 16 suka basket. Sudut basket pada diagram lingkaran = …°",
    kind: "fill",
    answers: ["72"],
    hint: "(f/total) × 360°.",
    discussion: ["(16/80) × 360° = 72°."],
  },
  {
    id: "pp2",
    question:
      "Dari 120 siswa, 30 anak bermata coklat. Persentase = …%",
    kind: "fill",
    answers: ["25", "25%"],
    hint: "(30/120) × 100%.",
    discussion: ["(30/120) × 100% = 25%."],
  },
  {
    id: "pp3",
    question:
      "Pada diagram lingkaran 100 siswa, kategori X bersudut 108°. Banyak siswa kategori X = …",
    kind: "fill",
    answers: ["30"],
    hint: "(sudut/360°) × total.",
    discussion: ["(108/360) × 100 = 30 siswa."],
  },
  {
    id: "pp4",
    question:
      "Diagram batang nilai: 6→4, 7→8, 8→10, 9→6, 10→2. Total siswa = …",
    kind: "fill",
    answers: ["30"],
    hint: "Jumlahkan semua frekuensi.",
    discussion: ["4+8+10+6+2 = 30."],
  },
  {
    id: "pp5",
    question: "Pada soal pp4, banyak siswa yang nilainya ≥ 8 = …",
    kind: "fill",
    answers: ["18"],
    hint: "Jumlahkan f untuk nilai 8, 9, 10.",
    discussion: ["10 + 6 + 2 = 18."],
  },
  {
    id: "pp6",
    question:
      "Pernyataan: Diagram garis paling tepat untuk membandingkan PROPORSI 4 kategori warna favorit.",
    kind: "truefalse",
    correct: false,
    hint: "Untuk proporsi gunakan diagram lingkaran.",
    discussion: [
      "SALAH. Proporsi = diagram LINGKARAN, bukan garis.",
    ],
  },
  {
    id: "pp7",
    question:
      "Diagram lingkaran 240 siswa: olahraga 30%, musik 25%, baca 20%, lainnya?. Banyak siswa 'lainnya' = …",
    kind: "fill",
    answers: ["60"],
    hint: "100 − (30+25+20) = 25%. 25% × 240.",
    discussion: ["Sisa 25% × 240 = 60 siswa."],
  },
  {
    id: "pp8",
    question:
      "Diagram batang menyajikan tinggi badan rata-rata 5 kelas (A=150, B=152, C=148, D=155, E=151). Kelas dengan rata-rata tinggi badan TERTINGGI adalah …",
    kind: "fill",
    answers: ["D", "Kelas D", "kelas D"],
    hint: "Cari nilai terbesar.",
    discussion: ["D = 155 cm (tertinggi)."],
  },
];

const PenyajianDataLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Bab Statistika"
    title="Penyajian Data — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo selami PENYAJIAN DATA 📊! Kamu akan menemukan kapan menggunakan diagram BATANG, GARIS, atau LINGKARAN, lalu menghitung SUDUT dan PERSENTASE — sambil bermain seret kartu memilih diagram yang tepat!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan jenis diagram dan rumus sudutnya."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/statistika"
    backLabel="Kembali ke Menu Statistika"
    scoreMessages={{
      perfect: "🌟 Mantap! Penyajian data sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Ingat rumus sudut: (f/total) × 360°.",
      low: "💪 Tetap semangat! Mulai dari pengertian tabel frekuensi.",
    }}
  />
);

export default PenyajianDataLKPDPage;
