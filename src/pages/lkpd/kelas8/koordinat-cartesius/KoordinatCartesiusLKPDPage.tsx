import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";
import CartesianDragAnimation from "@/components/CartesianDragAnimation";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — Mencari Tempat Duduk",
    visual: (
      <div className="grid grid-cols-6 gap-1.5 max-w-xs mx-auto">
        {Array.from({ length: 30 }).map((_, i) => {
          const row = Math.floor(i / 6);
          const col = i % 6;
          const isAna = row === 2 && col === 3;
          return (
            <div
              key={i}
              className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-bold border ${
                isAna
                  ? "bg-rose-500 border-rose-200 text-white"
                  : "bg-slate-700/60 border-white/10 text-white/40"
              }`}
            >
              {isAna ? "ANA" : ""}
            </div>
          );
        })}
      </div>
    ),
    text:
      "Di bioskop, tiket Ana tertulis Baris C, Kursi 4. Untuk menemukan tempat duduk, Ana butuh DUA informasi: nomor baris dan nomor kursi. Ide ini adalah dasar dari sistem koordinat — sebuah titik selalu butuh DUA bilangan untuk menentukan posisinya.",
  },
  {
    title: "Situasi 2 — Pak René Descartes",
    visual: (
      <svg viewBox="0 0 200 160" className="w-full max-w-xs mx-auto">
        <rect width="200" height="160" fill="#0b1220" rx="8" />
        <line x1="20" y1="80" x2="180" y2="80" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#a)" />
        <line x1="100" y1="150" x2="100" y2="20" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#a)" />
        <defs>
          <marker id="a" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="#94a3b8" />
          </marker>
        </defs>
        <text x="178" y="76" fill="#cbd5e1" fontSize="10" fontWeight="bold">x</text>
        <text x="106" y="22" fill="#cbd5e1" fontSize="10" fontWeight="bold">y</text>
        <text x="92" y="92" fill="#94a3b8" fontSize="9">O</text>
        <circle cx="140" cy="50" r="5" fill="#22d3ee" stroke="white" strokeWidth="1.5" />
        <text x="146" y="46" fill="#22d3ee" fontSize="10" fontWeight="bold">P(4, 3)</text>
        <line x1="140" y1="50" x2="140" y2="80" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="140" y1="50" x2="100" y2="50" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 2" />
        <text x="140" y="92" fill="#22d3ee" fontSize="9" textAnchor="middle">4</text>
        <text x="92" y="54" fill="#22d3ee" fontSize="9" textAnchor="middle">3</text>
      </svg>
    ),
    text:
      "Sekitar tahun 1637, René Descartes menemukan cara menyatakan posisi titik dengan dua sumbu yang saling tegak lurus. Sumbu mendatar disebut SUMBU X (absis) dan sumbu tegak disebut SUMBU Y (ordinat). Titik perpotongannya adalah titik asal O(0, 0).",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Pada bidang Kartesius, sumbu mendatar disebut sumbu …",
    kind: "choice",
    options: ["Sumbu X (absis)", "Sumbu Y (ordinat)", "Sumbu Z", "Sumbu O"],
    correctIndex: 0,
    discussion: [
      "Sumbu mendatar (horizontal) disebut SUMBU X.",
      "Bilangan pada sumbu X disebut absis dari sebuah titik.",
    ],
  },
  {
    id: "g2",
    label:
      "Sumbu tegak (vertikal) pada bidang Kartesius disebut sumbu …",
    kind: "choice",
    options: ["Sumbu X (absis)", "Sumbu Y (ordinat)", "Sumbu Z", "Sumbu O"],
    correctIndex: 1,
    discussion: [
      "Sumbu tegak (vertikal) disebut SUMBU Y.",
      "Bilangan pada sumbu Y disebut ordinat dari sebuah titik.",
    ],
  },
  {
    id: "g3",
    label:
      "Titik perpotongan sumbu X dan sumbu Y disebut titik asal dengan koordinat …",
    kind: "fill",
    answers: ["(0,0)", "(0, 0)", "0,0"],
    discussion: [
      "Titik asal (origin) selalu berada di perpotongan sumbu X dan sumbu Y.",
      "Koordinatnya O(0, 0) — absis dan ordinatnya bernilai nol.",
    ],
  },
  {
    id: "g4",
    label:
      "Bidang Kartesius dibagi menjadi 4 daerah oleh sumbu X dan sumbu Y. Setiap daerah disebut …",
    kind: "fill",
    answers: ["kuadran"],
    discussion: [
      "Sumbu X dan sumbu Y membagi bidang menjadi 4 bagian.",
      "Setiap bagian disebut KUADRAN, dinomori I, II, III, IV berlawanan arah jarum jam mulai dari kanan atas.",
    ],
  },
  {
    id: "g5",
    label:
      "Pasangkan setiap kuadran dengan tanda absis (x) dan ordinat (y)-nya.",
    kind: "match",
    pairs: [
      { left: "Kuadran I (kanan atas)", right: "x positif, y positif" },
      { left: "Kuadran II (kiri atas)", right: "x negatif, y positif" },
      { left: "Kuadran III (kiri bawah)", right: "x negatif, y negatif" },
      { left: "Kuadran IV (kanan bawah)", right: "x positif, y negatif" },
    ],
    discussion: [
      "Kuadran I: kanan atas → (+, +).",
      "Kuadran II: kiri atas → (−, +).",
      "Kuadran III: kiri bawah → (−, −).",
      "Kuadran IV: kanan bawah → (+, −).",
      "Urutannya berlawanan arah jarum jam.",
    ],
  },
  {
    id: "g6",
    label:
      "Titik A(5, 3) berada di kuadran …",
    kind: "choice",
    options: ["Kuadran I", "Kuadran II", "Kuadran III", "Kuadran IV"],
    correctIndex: 0,
    discussion: [
      "Absis 5 (positif) dan ordinat 3 (positif).",
      "Tanda (+, +) → KUADRAN I.",
    ],
  },
  {
    id: "g7",
    label:
      "Titik B(−4, 2) berada di kuadran …",
    kind: "choice",
    options: ["Kuadran I", "Kuadran II", "Kuadran III", "Kuadran IV"],
    correctIndex: 1,
    discussion: [
      "Absis −4 (negatif) dan ordinat 2 (positif).",
      "Tanda (−, +) → KUADRAN II.",
    ],
  },
  {
    id: "g8",
    label:
      "Titik C(−3, −5) berada di kuadran …",
    kind: "choice",
    options: ["Kuadran I", "Kuadran II", "Kuadran III", "Kuadran IV"],
    correctIndex: 2,
    discussion: [
      "Absis −3 (negatif) dan ordinat −5 (negatif).",
      "Tanda (−, −) → KUADRAN III.",
    ],
  },
  {
    id: "g9",
    label:
      "Titik D(6, −2) berada di kuadran …",
    kind: "choice",
    options: ["Kuadran I", "Kuadran II", "Kuadran III", "Kuadran IV"],
    correctIndex: 3,
    discussion: [
      "Absis 6 (positif) dan ordinat −2 (negatif).",
      "Tanda (+, −) → KUADRAN IV.",
    ],
  },
  {
    id: "g10",
    label:
      "Titik P(0, 4) tidak berada di kuadran mana pun. Titik P berada pada …",
    kind: "choice",
    options: ["Sumbu X", "Sumbu Y", "Titik asal O", "Kuadran I"],
    correctIndex: 1,
    discussion: [
      "Karena absisnya 0, titik P tepat berada pada SUMBU Y.",
      "Aturan: jika x = 0, titik berada pada sumbu Y. Jika y = 0, titik berada pada sumbu X.",
    ],
  },
  {
    id: "g11",
    label:
      "Apakah titik (3, 5) dan (5, 3) menunjukkan titik yang SAMA?",
    kind: "truefalse",
    correct: false,
    discussion: [
      "Pada koordinat (x, y), urutan SANGAT penting.",
      "(3, 5) → x = 3, y = 5. Sedangkan (5, 3) → x = 5, y = 3.",
      "Keduanya menunjukkan titik yang BERBEDA.",
    ],
  },
  {
    id: "g12",
    label:
      "Jarak titik A(3, 4) ke sumbu X adalah … satuan.",
    kind: "fill",
    answers: ["4"],
    suffix: "satuan",
    discussion: [
      "Jarak ke sumbu X = nilai mutlak dari ordinat (y).",
      "|y| = |4| = 4. Jadi jaraknya 4 satuan.",
    ],
  },
  {
    id: "g13",
    label:
      "Jarak titik A(3, 4) ke sumbu Y adalah … satuan.",
    kind: "fill",
    answers: ["3"],
    suffix: "satuan",
    discussion: [
      "Jarak ke sumbu Y = nilai mutlak dari absis (x).",
      "|x| = |3| = 3. Jadi jaraknya 3 satuan.",
    ],
  },
  {
    id: "g14",
    label:
      "Jarak titik P(−5, 7) ke sumbu X adalah … satuan.",
    kind: "fill",
    answers: ["7"],
    suffix: "satuan",
    discussion: [
      "Jarak ke sumbu X = |y| = |7| = 7.",
      "Tanda negatif pada absis tidak mempengaruhi jarak ke sumbu X.",
    ],
  },
  {
    id: "g15",
    label:
      "Urutkan langkah menggambar titik (−3, 4) pada bidang Kartesius dari yang pertama hingga terakhir.",
    kind: "sort",
    items: [
      "Mulai dari titik asal O(0, 0).",
      "Bergerak 3 satuan ke kiri pada sumbu X.",
      "Dari posisi itu, bergerak 4 satuan ke atas (sumbu Y).",
      "Beri tanda titik dan tulis namanya.",
    ],
    correctOrder: [
      "Mulai dari titik asal O(0, 0).",
      "Bergerak 3 satuan ke kiri pada sumbu X.",
      "Dari posisi itu, bergerak 4 satuan ke atas (sumbu Y).",
      "Beri tanda titik dan tulis namanya.",
    ],
    discussion: [
      "Selalu mulai dari titik asal O(0, 0).",
      "Lihat absis (x): jika positif → ke kanan, jika negatif → ke kiri.",
      "Lihat ordinat (y): jika positif → ke atas, jika negatif → ke bawah.",
      "Terakhir, tandai titiknya.",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "📐 Unsur Bidang Kartesius",
    text: "Sumbu X (mendatar) = absis. Sumbu Y (tegak) = ordinat. Perpotongannya = titik asal O(0, 0). Sebuah titik ditulis (x, y) — urutan tidak boleh terbalik.",
    tone: "cyan",
  },
  {
    title: "🧭 Empat Kuadran",
    text: "Kuadran I (+, +), Kuadran II (−, +), Kuadran III (−, −), Kuadran IV (+, −). Diurutkan berlawanan arah jarum jam mulai dari kanan atas.",
    tone: "violet",
  },
  {
    title: "📏 Jarak ke Sumbu",
    text: "Jarak titik A(x, y) ke sumbu X = |y|. Jarak titik A(x, y) ke sumbu Y = |x|. Selalu positif karena namanya jarak.",
    tone: "emerald",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-quadran",
    title: "🎯 Game 1 — Kelompokkan Titik ke Kuadran",
    description:
      "Seret setiap titik ke kotak kuadran yang benar. Ingat tanda tiap kuadran: I(+,+), II(−,+), III(−,−), IV(+,−).",
    buckets: [
      { id: "k1", label: "Kuadran I (+, +)", emoji: "🟦", color: "cyan" },
      { id: "k2", label: "Kuadran II (−, +)", emoji: "🟪", color: "violet" },
      { id: "k3", label: "Kuadran III (−, −)", emoji: "🟨", color: "amber" },
      { id: "k4", label: "Kuadran IV (+, −)", emoji: "🟩", color: "emerald" },
    ],
    items: [
      { id: "p1", label: "(2, 5)", bucketId: "k1", emoji: "📍" },
      { id: "p2", label: "(7, 1)", bucketId: "k1", emoji: "📍" },
      { id: "p3", label: "(−3, 4)", bucketId: "k2", emoji: "📍" },
      { id: "p4", label: "(−6, 2)", bucketId: "k2", emoji: "📍" },
      { id: "p5", label: "(−5, −3)", bucketId: "k3", emoji: "📍" },
      { id: "p6", label: "(−1, −8)", bucketId: "k3", emoji: "📍" },
      { id: "p7", label: "(4, −6)", bucketId: "k4", emoji: "📍" },
      { id: "p8", label: "(9, −2)", bucketId: "k4", emoji: "📍" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-jarak",
    title: "🎯 Game 2 — Jodohkan Jarak ke Sumbu",
    description:
      "Setiap titik di kiri punya jarak ke sumbu X tertentu. Jodohkan dengan nilai jarak yang benar di kanan. Ingat: jarak ke sumbu X = |y|.",
    rightOptions: ["1 satuan", "3 satuan", "5 satuan", "7 satuan", "9 satuan"],
    pairs: [
      { id: "j1", left: "Titik A(2, 3)", correctRight: "3 satuan", emoji: "📍" },
      { id: "j2", left: "Titik B(−4, 5)", correctRight: "5 satuan", emoji: "📍" },
      { id: "j3", left: "Titik C(6, −7)", correctRight: "7 satuan", emoji: "📍" },
      { id: "j4", left: "Titik D(−8, −9)", correctRight: "9 satuan", emoji: "📍" },
      { id: "j5", left: "Titik E(10, 1)", correctRight: "1 satuan", emoji: "📍" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question:
      "Titik H berada di kuadran II dengan absis −7 dan ordinat 4. Koordinat titik H adalah …",
    kind: "fill",
    answers: ["(-7,4)", "(-7, 4)", "-7,4"],
    hint: "Tulis dalam bentuk (x, y) dengan absis dulu lalu ordinat.",
    discussion: [
      "Absis = −7, ordinat = 4 → H(−7, 4).",
      "Cek: tanda (−, +) memang Kuadran II. ✔",
    ],
  },
  {
    id: "p2",
    question:
      "Sebuah titik mempunyai absis 0 dan ordinat −6. Titik itu berada pada …",
    kind: "choice",
    options: ["Sumbu X", "Sumbu Y", "Kuadran III", "Titik asal O"],
    correctIndex: 1,
    hint: "Jika absis = 0, titik berada di sumbu apa?",
    discussion: [
      "Karena x = 0, titik tepat ada di SUMBU Y.",
      "Posisinya 6 satuan di bawah titik asal.",
    ],
  },
  {
    id: "p3",
    question:
      "Pernyataan: 'Titik (4, −2) dan (−2, 4) adalah titik yang sama.' Apakah benar?",
    kind: "truefalse",
    correct: false,
    hint: "Periksa koordinat x dan y masing-masing titik.",
    discussion: [
      "(4, −2) berada di Kuadran IV (kanan bawah).",
      "(−2, 4) berada di Kuadran II (kiri atas).",
      "Keduanya BERBEDA. Pernyataan SALAH.",
    ],
  },
  {
    id: "p4",
    question:
      "Jarak titik K(−5, −12) ke sumbu Y adalah … satuan.",
    kind: "fill",
    answers: ["5"],
    hint: "Jarak ke sumbu Y = |absis|.",
    discussion: [
      "Jarak ke sumbu Y = |x| = |−5| = 5.",
      "Jadi jaraknya 5 satuan.",
    ],
  },
  {
    id: "p5",
    question:
      "Titik R(8, 3), S(8, −5), dan T(8, 0) memiliki kesamaan, yaitu …",
    kind: "choice",
    options: [
      "Semua berada di kuadran yang sama",
      "Semua memiliki absis sama yaitu 8",
      "Semua memiliki ordinat sama yaitu 3",
      "Semua berada pada sumbu Y",
    ],
    correctIndex: 1,
    hint: "Lihat nilai x dari ketiga titik.",
    discussion: [
      "Ketiga titik memiliki x = 8 (absis sama).",
      "Titik-titik dengan absis sama membentuk garis vertikal sejajar sumbu Y.",
    ],
  },
  {
    id: "p6",
    question:
      "Pasangkan setiap titik dengan letak yang benar.",
    kind: "match",
    pairs: [
      { left: "(0, 0)", right: "Titik asal O" },
      { left: "(5, 0)", right: "Sumbu X positif" },
      { left: "(0, −3)", right: "Sumbu Y negatif" },
      { left: "(−2, −7)", right: "Kuadran III" },
    ],
    hint: "Periksa apakah x atau y bernilai 0, lalu tentukan tanda x dan y.",
    discussion: [
      "(0, 0) = titik asal O.",
      "(5, 0): y = 0 → di sumbu X, x positif → sumbu X positif.",
      "(0, −3): x = 0 → di sumbu Y, y negatif → sumbu Y negatif.",
      "(−2, −7): tanda (−, −) → Kuadran III.",
    ],
  },
  {
    id: "p7",
    question:
      "Titik A(3, 5) bergeser 4 satuan ke kanan dan 2 satuan ke bawah. Koordinat titik A yang baru adalah …",
    kind: "fill",
    answers: ["(7,3)", "(7, 3)", "7,3"],
    hint: "Tambahkan ke absis untuk geser ke kanan, kurangi dari ordinat untuk geser ke bawah.",
    discussion: [
      "Geser 4 ke kanan: x baru = 3 + 4 = 7.",
      "Geser 2 ke bawah: y baru = 5 − 2 = 3.",
      "Koordinat baru: A'(7, 3).",
    ],
  },
  {
    id: "p8",
    question:
      "Empat titik A(2, 1), B(6, 1), C(6, 4), dan D(2, 4) jika dihubungkan akan membentuk bangun …",
    kind: "choice",
    options: ["Segitiga", "Persegi", "Persegi panjang", "Trapesium"],
    correctIndex: 2,
    hint: "Hitung panjang AB dan BC, lalu bandingkan.",
    discussion: [
      "Panjang AB = |6 − 2| = 4 satuan (mendatar).",
      "Panjang BC = |4 − 1| = 3 satuan (tegak).",
      "Panjang ≠ lebar dan keempat sudutnya siku-siku → PERSEGI PANJANG.",
    ],
  },
];

const KoordinatCartesiusLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 8 · Bab 1"
    title="Koordinat Kartesius — Penemuan Terbimbing"
    intro="Sobat Numatik, ayo menjelajahi bidang Kartesius! Kamu akan menemukan sendiri sumbu X, sumbu Y, empat kuadran, dan cara menentukan koordinat titik — sambil bermain dengan diagram interaktif yang bisa kamu seret-seret."
    situations={situations}
    guidedIntro="Kerjakan soal-soal ini secara berurutan. Setiap jawaban akan membantumu menemukan konsep koordinat Kartesius. Tekan tombol 'Periksa Jawaban' di bawah untuk melihat pembahasan."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    midSlot={
      <section className="mb-6 rounded-3xl border border-cyan-300/30 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-violet-500/10 p-5 md:p-7 backdrop-blur">
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/15 px-4 py-2 text-xs font-bold text-cyan-100">
            🎮 LABORATORIUM KARTESIUS INTERAKTIF
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-3">
            B. Eksplorasi Bidang Kartesius
          </h2>
          <p className="text-sm text-white/70 font-body mt-2 max-w-2xl mx-auto">
            Ini bukan gambar biasa! Seret titik A, B, C, atau D ke posisi mana pun di bidang Kartesius.
            Perhatikan bagaimana koordinatnya berubah dan kuadran tempatnya berpindah secara otomatis.
            Coba pindahkan setiap titik ke setiap kuadran untuk membuktikan aturan tanda yang sudah kamu pelajari!
          </p>
        </div>
        <CartesianDragAnimation />
        <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs font-body">
          <div className="rounded-xl border border-cyan-200/20 bg-cyan-500/10 p-3 text-white/80">
            <p className="font-bold text-cyan-200 mb-1">🔍 Coba ini #1</p>
            <p>Seret titik A ke posisi (5, 5). Apakah benar A masuk Kuadran I?</p>
          </div>
          <div className="rounded-xl border border-violet-200/20 bg-violet-500/10 p-3 text-white/80">
            <p className="font-bold text-violet-200 mb-1">🔍 Coba ini #2</p>
            <p>Seret titik B ke (0, 4). Lihat — B tidak ada di kuadran mana pun, tapi ada di sumbu Y!</p>
          </div>
          <div className="rounded-xl border border-emerald-200/20 bg-emerald-500/10 p-3 text-white/80">
            <p className="font-bold text-emerald-200 mb-1">🔍 Coba ini #3</p>
            <p>Pindahkan titik C ke titik asal (0, 0). Apa yang terjadi pada label kuadrannya?</p>
          </div>
        </div>
      </section>
    }
    games={games}
    practiceIntro="Sekarang giliranmu menerapkan apa yang sudah kamu temukan. Kerjakan dengan teliti — gunakan diagram interaktif di atas untuk mengeceknya jika ragu."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-8/koordinat-cartesius"
    backLabel="Kembali ke menu Koordinat Kartesius"
    scoreMessages={{
      perfect: "Mantap, Sobat Numatik! Kamu sudah jago membaca koordinat dan kuadran.",
      high: "Bagus sekali! Periksa kembali bagian yang masih merah agar lebih mantap.",
      medium: "Sudah mulai paham. Ulangi penemuan terbimbing dan main lagi diagram interaktifnya.",
      low: "Tetap semangat! Mulai dari atas, perhatikan tanda absis dan ordinat tiap kuadran.",
    }}
  />
);

export default KoordinatCartesiusLKPDPage;
