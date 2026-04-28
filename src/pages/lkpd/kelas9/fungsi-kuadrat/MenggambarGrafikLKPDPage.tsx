import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Situasi 1 — 5 Langkah Sketsa Parabola",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-700/20 border border-cyan-300/40 p-3">
        <svg viewBox="0 0 280 240" className="w-full">
          <rect width="280" height="240" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="12" fontWeight="bold" fill="#67e8f9" textAnchor="middle">f(x) = x² − 4x + 3</text>
          <rect x="20" y="34" width="240" height="20" rx="6" fill="#22d3ee" fillOpacity="0.3" />
          <text x="140" y="48" fontSize="9" fill="#fff" textAnchor="middle">{"1️⃣ Arah: a > 0 → buka ATAS"}</text>
          <rect x="20" y="58" width="240" height="20" rx="6" fill="#a78bfa" fillOpacity="0.3" />
          <text x="140" y="72" fontSize="9" fill="#fff" textAnchor="middle">2️⃣ TP sumbu-y: (0, 3)</text>
          <rect x="20" y="82" width="240" height="20" rx="6" fill="#fbbf24" fillOpacity="0.3" />
          <text x="140" y="96" fontSize="9" fill="#fff" textAnchor="middle">3️⃣ TP sumbu-x: x²−4x+3=0 → (1,0), (3,0)</text>
          <rect x="20" y="106" width="240" height="20" rx="6" fill="#f0abfc" fillOpacity="0.3" />
          <text x="140" y="120" fontSize="9" fill="#fff" textAnchor="middle">4️⃣ Sumbu simetri: x = 2</text>
          <rect x="20" y="130" width="240" height="20" rx="6" fill="#34d399" fillOpacity="0.4" />
          <text x="140" y="144" fontSize="9" fill="#fff" textAnchor="middle">5️⃣ Puncak: P(2, −1)</text>
          <line x1="40" y1="195" x2="240" y2="195" stroke="#94a3b8" strokeWidth="1" />
          <line x1="140" y1="160" x2="140" y2="225" stroke="#f0abfc" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M 70 175 Q 140 230 210 175" fill="none" stroke="#22d3ee" strokeWidth="2.5" />
          <circle cx="115" cy="195" r="3" fill="#fbbf24" />
          <circle cx="165" cy="195" r="3" fill="#fbbf24" />
          <circle cx="140" cy="218" r="4" fill="#34d399" />
          <text x="140" y="160" fontSize="8" fill="#67e8f9" textAnchor="middle">(0,3)</text>
        </svg>
      </div>
    ),
    text:
      "Untuk MENGGAMBAR parabola, ikuti 5 LANGKAH: (1) Tentukan ARAH dari tanda a; (2) Tentukan titik potong sumbu-y; (3) Titik potong sumbu-x (jika ada); (4) Sumbu simetri xₚ; (5) Titik puncak P. Hubungkan semua titik dengan kurva mulus!",
  },
  {
    title: "Situasi 2 — Memilih Beberapa Titik Bantu",
    visual: (
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-amber-700/20 border border-emerald-300/40 p-3">
        <svg viewBox="0 0 280 200" className="w-full">
          <rect width="280" height="200" fill="#0b1220" rx="8" />
          <text x="140" y="22" fontSize="11" fontWeight="bold" fill="#a7f3d0" textAnchor="middle">Tabel titik bantu untuk f(x) = x² − 4x + 3</text>
          <rect x="20" y="35" width="240" height="22" rx="4" fill="#fbbf24" fillOpacity="0.4" />
          <text x="60" y="50" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">x</text>
          <text x="100" y="50" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">0</text>
          <text x="135" y="50" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">1</text>
          <text x="170" y="50" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">2</text>
          <text x="205" y="50" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">3</text>
          <text x="240" y="50" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">4</text>
          <rect x="20" y="60" width="240" height="22" rx="4" fill="#a7f3d0" fillOpacity="0.4" />
          <text x="60" y="75" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">f(x)</text>
          <text x="100" y="75" fontSize="10" fill="#fff" textAnchor="middle">3</text>
          <text x="135" y="75" fontSize="10" fill="#fff" textAnchor="middle">0</text>
          <text x="170" y="75" fontSize="10" fontWeight="bold" fill="#fde68a" textAnchor="middle">−1</text>
          <text x="205" y="75" fontSize="10" fill="#fff" textAnchor="middle">0</text>
          <text x="240" y="75" fontSize="10" fill="#fff" textAnchor="middle">3</text>
          <text x="140" y="100" fontSize="9" fill="#fde68a" textAnchor="middle">x = 2 → puncak (yₚ = −1)</text>
          <text x="140" y="115" fontSize="9" fill="#fde68a" textAnchor="middle">SIMETRIS terhadap x = 2</text>
          <rect x="20" y="130" width="240" height="55" rx="6" fill="#34d399" fillOpacity="0.4" />
          <text x="140" y="155" fontSize="11" fontWeight="bold" fill="#fff" textAnchor="middle">Tabel = peta titik. Plot → tarik kurva.</text>
          <text x="140" y="172" fontSize="10" fill="#fff" textAnchor="middle">Periksa: SIMETRI di kedua sisi sumbu.</text>
        </svg>
      </div>
    ),
    text:
      "Buat TABEL nilai untuk x di sekitar sumbu simetri (sebelum dan sesudahnya). Plot titik-titik di koordinat dan TARIK KURVA mulus. Pastikan grafik SIMETRIS! Tabel membantu jika titik potong sumbu-x sulit dihitung.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Untuk f(x) = x² − 6x + 8, langkah PERTAMA menggambar grafik adalah …",
    kind: "choice",
    options: [
      "Tentukan arah parabola (cek tanda a)",
      "Plot 100 titik random",
      "Hitung integral",
      "Cari turunan",
    ],
    correctIndex: 0,
    discussion: ["Selalu mulai dari ARAH parabola (tanda a)."],
  },
  {
    id: "g2",
    label: "f(x) = x² − 6x + 8: a = 1 > 0 → arah parabola …",
    kind: "choice",
    options: ["BUKA ATAS", "BUKA BAWAH", "DATAR", "VERTIKAL"],
    correctIndex: 0,
    discussion: ["a > 0 → buka ATAS."],
  },
  {
    id: "g3",
    label: "Titik potong dgn sumbu-y untuk f(x) = x² − 6x + 8 = …",
    kind: "fill",
    answers: ["(0, 8)", "(0,8)"],
    discussion: ["f(0) = 8 → (0, 8)."],
  },
  {
    id: "g4",
    label: "Titik potong dgn sumbu-x untuk x² − 6x + 8 = 0 → …",
    kind: "choice",
    options: ["(2, 0) dan (4, 0)", "(−2, 0) dan (−4, 0)", "(1, 0) dan (8, 0)", "(0, 2) dan (0, 4)"],
    correctIndex: 0,
    discussion: ["(x−2)(x−4)=0 → x=2 atau x=4."],
  },
  {
    id: "g5",
    label: "Sumbu simetri f(x) = x² − 6x + 8: xₚ = −b/(2a) = …",
    kind: "fill",
    answers: ["3"],
    discussion: ["xₚ = 6/2 = 3."],
  },
  {
    id: "g6",
    label: "Substitusi xₚ = 3: yₚ = f(3) = 9 − 18 + 8 = …",
    kind: "fill",
    answers: ["-1", "−1"],
    discussion: ["f(3) = −1 → puncak (3, −1)."],
  },
  {
    id: "g7",
    label: "Maka titik puncak f(x) = x² − 6x + 8 adalah …",
    kind: "choice",
    options: ["(3, −1)", "(−3, 1)", "(1, −3)", "(−1, 3)"],
    correctIndex: 0,
    discussion: ["P(xₚ, yₚ) = (3, −1)."],
  },
  {
    id: "g8",
    label:
      "Tabel nilai untuk f(x) = x² − 6x + 8: f(1) = ?, f(5) = ?",
    kind: "choice",
    options: ["f(1) = 3, f(5) = 3", "f(1) = 0, f(5) = 0", "f(1) = 8, f(5) = 8", "f(1) = −1, f(5) = −1"],
    correctIndex: 0,
    discussion: ["f(1) = 1 − 6 + 8 = 3; f(5) = 25 − 30 + 8 = 3 (simetris di kedua sisi)."],
  },
  {
    id: "g9",
    label: "Pernyataan: Saat menggambar parabola, sebaiknya plot titik puncak DAN titik potong dahulu.",
    kind: "truefalse",
    correct: true,
    discussion: [
      "BENAR. Titik puncak dan titik potong adalah TITIK KUNCI yang menentukan bentuk parabola.",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "5 Langkah Menggambar Parabola",
    text: "1) Arah (tanda a). 2) TP sumbu-y. 3) TP sumbu-x. 4) Sumbu simetri xₚ. 5) Titik puncak P. Hubungkan dgn kurva mulus.",
    tone: "cyan",
  },
  {
    title: "Buat Tabel Nilai",
    text: "Pilih x sekitar sumbu simetri (xₚ−2, xₚ−1, xₚ, xₚ+1, xₚ+2). Hitung f(x). Plot lalu tarik kurva.",
    tone: "violet",
  },
  {
    title: "Cek Simetri",
    text: "Setiap titik (x, y) memiliki BAYANGAN cermin di seberang sumbu simetri: (2xₚ − x, y). Gunakan untuk memastikan sketsa benar.",
    tone: "emerald",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "fk-grafik-game-langkah",
    title: "🎯 Game 1 — Urutkan Langkah Menggambar",
    description: "Seret tiap aktivitas ke nomor LANGKAH yang TEPAT!",
    buckets: [
      { id: "l1", label: "1️⃣ Cek arah", emoji: "1️⃣", color: "cyan" },
      { id: "l2", label: "2️⃣ TP sumbu-y", emoji: "2️⃣", color: "violet" },
      { id: "l3", label: "3️⃣ TP sumbu-x", emoji: "3️⃣", color: "amber" },
      { id: "l4", label: "4️⃣ Sumbu simetri", emoji: "4️⃣", color: "rose" },
      { id: "l5", label: "5️⃣ Titik puncak", emoji: "5️⃣", color: "emerald" },
    ],
    items: [
      { id: "u1", label: "Lihat tanda a", bucketId: "l1", emoji: "🔍" },
      { id: "u2", label: "Hitung f(0) = c", bucketId: "l2", emoji: "🎯" },
      { id: "u3", label: "Selesaikan ax² + bx + c = 0", bucketId: "l3", emoji: "🎯" },
      { id: "u4", label: "Hitung xₚ = −b/(2a)", bucketId: "l4", emoji: "🪞" },
      { id: "u5", label: "Substitusi xₚ ke f", bucketId: "l5", emoji: "📍" },
      { id: "u6", label: "Cek buka atas/bawah", bucketId: "l1", emoji: "🔍" },
    ],
  },
  {
    kind: "arrow-match",
    id: "fk-grafik-game-puncak",
    title: "🎯 Game 2 — Cocokkan Grafik & Puncak",
    description: "Pasangkan FK dengan koordinat puncak. Tekan ◀ ▶.",
    rightOptions: ["(2, −1)", "(3, −1)", "(2, 1)", "(−1, 4)", "(0, −9)", "(2, −4)"],
    pairs: [
      { id: "gp1", left: "f(x) = x² − 4x + 3", correctRight: "(2, −1)", emoji: "📈" },
      { id: "gp2", left: "f(x) = x² − 6x + 8", correctRight: "(3, −1)", emoji: "📈" },
      { id: "gp3", left: "f(x) = −x² + 4x − 3", correctRight: "(2, 1)", emoji: "📈" },
      { id: "gp4", left: "f(x) = x² + 2x + 5", correctRight: "(−1, 4)", emoji: "📈" },
      { id: "gp5", left: "f(x) = x² − 9", correctRight: "(0, −9)", emoji: "📈" },
      { id: "gp6", left: "f(x) = x² − 4x", correctRight: "(2, −4)", emoji: "📈" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "pp1",
    question:
      "Untuk menggambar f(x) = x² − 2x − 3, titik potong sumbu-x = …",
    kind: "choice",
    options: ["(−1,0) & (3,0)", "(1,0) & (−3,0)", "(1,0) & (3,0)", "(−1,0) & (−3,0)"],
    correctIndex: 0,
    hint: "x² − 2x − 3 = 0.",
    discussion: ["(x−3)(x+1)=0 → x=3 atau x=−1."],
  },
  {
    id: "pp2",
    question: "Titik puncak f(x) = x² − 2x − 3 adalah …",
    kind: "choice",
    options: ["(1, −4)", "(−1, 4)", "(1, 4)", "(−1, −4)"],
    correctIndex: 0,
    hint: "xₚ = 1, yₚ = f(1) = −4.",
    discussion: ["P(1, −4)."],
  },
  {
    id: "pp3",
    question:
      "Pernyataan: Untuk f(x) = x² + 2, parabola buka ATAS dan tidak memotong sumbu-x.",
    kind: "truefalse",
    correct: true,
    hint: "D = 0 − 8 = −8.",
    discussion: ["BENAR. a > 0 buka atas, D < 0 tidak ada akar real."],
  },
  {
    id: "pp4",
    question:
      "Sketsa f(x) = −(x − 2)² + 9 memiliki puncak di …",
    kind: "choice",
    options: ["(2, 9)", "(−2, 9)", "(2, −9)", "(0, 9)"],
    correctIndex: 0,
    hint: "Bentuk vertex: a=−1, h=2, k=9.",
    discussion: ["Puncak (h, k) = (2, 9), buka BAWAH."],
  },
  {
    id: "pp5",
    question:
      "Untuk f(x) = x² − 4x + 4, banyaknya titik potong sumbu-x = …",
    kind: "fill",
    answers: ["1"],
    hint: "D = 16 − 16 = 0.",
    discussion: ["D = 0 → 1 titik (menyentuh)."],
  },
  {
    id: "pp6",
    question:
      "Untuk f(x) = x² − 2x − 3, sumbu simetrinya …",
    kind: "choice",
    options: ["x = 1", "x = −1", "x = 0", "x = 2"],
    correctIndex: 0,
    hint: "xₚ = −b/2a = 2/2.",
    discussion: ["x = 1."],
  },
  {
    id: "pp7",
    question:
      "Bayangan titik (0, −3) terhadap sumbu simetri x = 1 adalah …",
    kind: "choice",
    options: ["(2, −3)", "(−2, −3)", "(0, 3)", "(1, −3)"],
    correctIndex: 0,
    hint: "x' = 2(1) − 0 = 2.",
    discussion: ["Bayangan = (2xₚ − x, y) = (2, −3)."],
  },
  {
    id: "pp8",
    question:
      "Pernyataan: Grafik f(x) = (x + 1)² berada di atas atau menyentuh sumbu-x.",
    kind: "truefalse",
    correct: true,
    hint: "(x+1)² ≥ 0.",
    discussion: ["BENAR. Kuadrat selalu ≥ 0."],
  },
];

const MenggambarGrafikLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 9 · Pengayaan FK"
    title="Menggambar Grafik FK — Penemuan Terbimbing"
    intro="Sobat Numatik ✏️! Saatnya jadi PELUKIS PARABOLA — ikuti 5 LANGKAH BAKU: arah, titik potong sumbu-y, titik potong sumbu-x, sumbu simetri, titik puncak. Plot titik kunci, tarik kurva mulus, dan parabola pun sempurna!"
    situations={situations}
    guidedIntro="Jawab berurutan untuk menemukan langkah menggambar grafik."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Asah pemahamanmu dengan latihan berikut!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-9/fungsi-kuadrat"
    backLabel="Kembali ke Menu Fungsi Kuadrat"
    scoreMessages={{
      perfect: "🌟 Mantap! Grafik parabola sudah kamu kuasai!",
      high: "👍 Bagus! Cek bagian yang masih merah.",
      medium: "🚀 Lumayan. Latih 5 langkah baku menggambar.",
      low: "💪 Tetap semangat! Mulai dari titik potong & puncak.",
    }}
  />
);

export default MenggambarGrafikLKPDPage;
