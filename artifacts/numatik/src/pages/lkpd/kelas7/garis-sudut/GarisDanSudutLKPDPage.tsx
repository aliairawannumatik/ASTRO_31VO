import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const SudutVisual = ({
  derajat,
  warna,
  label,
}: {
  derajat: number;
  warna: string;
  label: string;
}) => {
  const cx = 50;
  const cy = 60;
  const r = 38;
  const rad = (derajat * Math.PI) / 180;
  const x2 = cx + r * Math.cos(-rad);
  const y2 = cy + r * Math.sin(-rad);
  const arcR = 14;
  const ax = cx + arcR;
  const ay = cy;
  const bx = cx + arcR * Math.cos(-rad);
  const by = cy + arcR * Math.sin(-rad);
  const largeArc = derajat > 180 ? 1 : 0;
  return (
    <svg viewBox="0 0 100 80" className="w-full h-auto">
      <path
        d={`M ${ax} ${ay} A ${arcR} ${arcR} 0 ${largeArc} 0 ${bx} ${by}`}
        fill={warna}
        fillOpacity={0.35}
        stroke={warna}
        strokeWidth={1}
      />
      <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="#0f172a" strokeWidth={2.4} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="#0f172a" strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={2.2} fill="#0f172a" />
      <text x={cx + 18} y={cy - 4} fontSize={9} fontWeight={700} fill={warna}>
        {label}
      </text>
    </svg>
  );
};

const UnsurGarisVisual = () => (
  <svg viewBox="0 0 280 150" className="w-full h-auto">
    <text x={10} y={18} fontSize={11} fontWeight={700} fill="#22d3ee">
      Titik
    </text>
    <circle cx={50} cy={32} r={4} fill="#22d3ee" />
    <text x={56} y={36} fontSize={10} fill="var(--icon-color)">
      A
    </text>

    <text x={100} y={18} fontSize={11} fontWeight={700} fill="#facc15">
      Ruas Garis
    </text>
    <line x1={100} y1={32} x2={180} y2={32} stroke="#facc15" strokeWidth={3} strokeLinecap="round" />
    <circle cx={100} cy={32} r={3} fill="#facc15" />
    <circle cx={180} cy={32} r={3} fill="#facc15" />

    <text x={210} y={18} fontSize={11} fontWeight={700} fill="#a78bfa">
      Sinar
    </text>
    <line x1={210} y1={32} x2={270} y2={32} stroke="#a78bfa" strokeWidth={3} strokeLinecap="round" />
    <circle cx={210} cy={32} r={3} fill="#a78bfa" />
    <polygon points="272,32 266,29 266,35" fill="#a78bfa" />

    <text x={10} y={75} fontSize={11} fontWeight={700} fill="#34d399">
      Garis
    </text>
    <line x1={10} y1={92} x2={270} y2={92} stroke="#34d399" strokeWidth={3} strokeLinecap="round" />
    <polygon points="8,92 14,89 14,95" fill="#34d399" />
    <polygon points="272,92 266,89 266,95" fill="#34d399" />

    <text x={10} y={120} fontSize={11} fontWeight={700} fill="#f472b6">
      Sudut
    </text>
    <line x1={50} y1={140} x2={130} y2={140} stroke="#f472b6" strokeWidth={2.4} />
    <line x1={50} y1={140} x2={110} y2={108} stroke="#f472b6" strokeWidth={2.4} />
    <path d="M 70 140 A 20 20 0 0 0 80 122" fill="#f472b6" fillOpacity={0.3} stroke="#f472b6" />
    <circle cx={50} cy={140} r={2.5} fill="var(--icon-color)" />
  </svg>
);

const JenisSudutVisual = () => (
  <div className="grid grid-cols-2 gap-2">
    <div className="rounded-lg bg-cyan-500/15 border border-cyan-300/30 p-2">
      <SudutVisual derajat={45} warna="#22d3ee" label="45°" />
      <p className="text-center text-xs font-bold text-cyan-200 mt-1">Lancip</p>
    </div>
    <div className="rounded-lg bg-yellow-500/15 border border-yellow-300/30 p-2">
      <SudutVisual derajat={90} warna="#facc15" label="90°" />
      <p className="text-center text-xs font-bold text-yellow-200 mt-1">Siku-siku</p>
    </div>
    <div className="rounded-lg bg-rose-500/15 border border-rose-300/30 p-2">
      <SudutVisual derajat={130} warna="#fb7185" label="130°" />
      <p className="text-center text-xs font-bold text-rose-200 mt-1">Tumpul</p>
    </div>
    <div className="rounded-lg bg-emerald-500/15 border border-emerald-300/30 p-2">
      <SudutVisual derajat={180} warna="#34d399" label="180°" />
      <p className="text-center text-xs font-bold text-emerald-200 mt-1">Lurus</p>
    </div>
  </div>
);

const TransversalVisual = () => (
  <svg viewBox="0 0 260 180" className="w-full h-auto">
    <line x1={10} y1={55} x2={250} y2={55} stroke="#22d3ee" strokeWidth={2.6} />
    <line x1={10} y1={130} x2={250} y2={130} stroke="#22d3ee" strokeWidth={2.6} />
    <line x1={60} y1={15} x2={210} y2={170} stroke="#facc15" strokeWidth={2.6} />

    <text x={4} y={51} fontSize={9} fill="#22d3ee" fontWeight={700}>m</text>
    <text x={4} y={126} fontSize={9} fill="#22d3ee" fontWeight={700}>n</text>
    <text x={216} y={172} fontSize={9} fill="#facc15" fontWeight={700}>k</text>

    <text x={70} y={48} fontSize={10} fill="#fb7185" fontWeight={700}>1</text>
    <text x={100} y={48} fontSize={10} fill="#fb7185" fontWeight={700}>2</text>
    <text x={70} y={70} fontSize={10} fill="#fb7185" fontWeight={700}>3</text>
    <text x={100} y={70} fontSize={10} fill="#fb7185" fontWeight={700}>4</text>

    <text x={140} y={123} fontSize={10} fill="#a78bfa" fontWeight={700}>5</text>
    <text x={170} y={123} fontSize={10} fill="#a78bfa" fontWeight={700}>6</text>
    <text x={140} y={148} fontSize={10} fill="#a78bfa" fontWeight={700}>7</text>
    <text x={170} y={148} fontSize={10} fill="#a78bfa" fontWeight={700}>8</text>
  </svg>
);

const situations: SituationCard[] = [
  {
    title: "Situasi 1: Unsur-unsur Garis & Sudut",
    visual: <UnsurGarisVisual />,
    text: "Amati gambar di atas. Setiap warna mewakili unsur dasar geometri yang berbeda — titik, ruas garis, sinar, garis, dan sudut.",
  },
  {
    title: "Situasi 2: Jenis-jenis Sudut",
    visual: <JenisSudutVisual />,
    text: "Bandingkan empat sudut berikut. Perhatikan bagaimana ukuran (derajat) menentukan namanya.",
  },
  {
    title: "Situasi 3: Dua Garis Sejajar Dipotong Transversal",
    visual: <TransversalVisual />,
    text: "Garis m // n dipotong oleh garis k. Terbentuklah 8 sudut (1–8). Pasangan-pasangan sudut ini punya hubungan istimewa yang akan kita temukan!",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Garis berwarna hijau di atas memiliki tanda panah pada kedua ujungnya, artinya garis ini ...",
    kind: "choice",
    options: ["punya panjang terbatas", "memanjang tanpa batas ke kedua arah", "hanya punya satu ujung"],
    correctIndex: 1,
    discussion: [
      "Garis (line) digambar dengan dua tanda panah karena memanjang tak terhingga ke kedua arah.",
      "Ruas garis berbeda — punya dua titik ujung yang jelas.",
      "Sinar hanya panjang ke satu arah saja.",
    ],
  },
  {
    id: "g2",
    label: "Sudut terbentuk dari pertemuan dua ___ yang berasal dari satu titik (titik sudut).",
    answers: ["sinar", "ruas garis", "sinar garis"],
    discussion: [
      "Sudut dibentuk oleh dua sinar (kaki sudut) yang bertemu di satu titik.",
      "Titik tempat bertemunya kedua sinar disebut titik sudut atau vertex.",
    ],
  },
  {
    id: "g3",
    label: "Sudut yang besarnya antara 0° sampai kurang dari 90° dinamakan sudut ...",
    kind: "choice",
    options: ["lancip", "siku-siku", "tumpul", "lurus"],
    correctIndex: 0,
    discussion: [
      "Sudut LANCIP: 0° < a < 90°. Bentuknya runcing seperti ujung pensil.",
      "Contoh: 30°, 45°, 60°, 75°, 89°.",
    ],
  },
  {
    id: "g4",
    label: "Pasangkan jenis sudut dengan ukurannya.",
    kind: "match",
    pairs: [
      { left: "Lancip", right: "0° < a < 90°" },
      { left: "Siku-siku", right: "a = 90°" },
      { left: "Tumpul", right: "90° < a < 180°" },
      { left: "Lurus", right: "a = 180°" },
      { left: "Refleks", right: "180° < a < 360°" },
    ],
    discussion: [
      "Lancip: kurang dari 90°. Siku-siku: tepat 90° (membentuk sudut huruf L).",
      "Tumpul: di antara 90° dan 180°. Lurus: tepat 180° (kedua kaki segaris).",
      "Refleks: lebih besar dari 180° tapi kurang dari 360°.",
    ],
  },
  {
    id: "g5",
    label: "Dua sudut disebut BERPELURUS jika jumlahnya sama dengan ___°.",
    answers: ["180"],
    discussion: [
      "Berpelurus = supplementary. Dua sudut yang membentuk garis lurus.",
      "Jadi a + b = 180°. Jika a = 70°, maka pelurusnya 110°.",
    ],
  },
  {
    id: "g6",
    label: "Dua sudut disebut BERPENYIKU jika jumlahnya sama dengan ___°.",
    answers: ["90"],
    discussion: [
      "Berpenyiku = complementary. Dua sudut yang membentuk sudut siku-siku.",
      "Jadi a + b = 90°. Jika a = 30°, maka penyikunya 60°.",
    ],
  },
  {
    id: "g7",
    label: "Pernyataan: \"Sudut yang BERTOLAK BELAKANG selalu sama besar.\"",
    kind: "truefalse",
    correct: true,
    discussion: [
      "Benar. Ketika dua garis berpotongan, sudut yang berhadapan (bertolak belakang) selalu sama besar.",
      "Contoh: jika sudut atas = 60°, maka sudut bawahnya juga 60°.",
    ],
  },
  {
    id: "g8",
    label: "Pada gambar dua garis sejajar yang dipotong transversal, sudut 1 dan sudut 5 disebut sudut SEHADAP, dan kedua sudut tersebut ___.",
    kind: "choice",
    options: ["sama besar", "berjumlah 90°", "berjumlah 180°", "berjumlah 360°"],
    correctIndex: 0,
    discussion: [
      "Sudut sehadap (corresponding angles) berada pada posisi yang sama relatif terhadap titik potong.",
      "Pada dua garis sejajar, pasangan sudut sehadap selalu sama besar.",
    ],
  },
  {
    id: "g9",
    label: "Sudut 3 dan sudut 6 berada di antara garis sejajar dan di sisi berlawanan transversal, dinamakan sudut ___.",
    kind: "choice",
    options: ["sehadap", "berseberangan dalam", "berseberangan luar", "sepihak dalam"],
    correctIndex: 1,
    discussion: [
      "Berseberangan dalam (alternate interior) berada di antara dua garis sejajar dan saling berseberangan terhadap transversal.",
      "Pada garis sejajar, kedua sudut ini SAMA BESAR.",
    ],
  },
  {
    id: "g10",
    label: "Sudut SEPIHAK DALAM (misal sudut 3 dan sudut 5) pada dua garis sejajar berjumlah ___°.",
    answers: ["180"],
    discussion: [
      "Sepihak dalam (co-interior / consecutive interior) berada di antara garis sejajar dan di sisi yang sama dari transversal.",
      "Jumlahnya selalu 180° (saling berpelurus).",
    ],
  },
  {
    id: "g11",
    label: "Urutkan jenis sudut berikut dari yang TERKECIL ke TERBESAR ukurannya.",
    kind: "sort",
    items: ["Lurus", "Tumpul", "Siku-siku", "Lancip"],
    correctOrder: ["Lancip", "Siku-siku", "Tumpul", "Lurus"],
    discussion: [
      "Lancip < Siku-siku < Tumpul < Lurus.",
      "Yaitu: <90° < 90° < antara 90°–180° < 180°.",
    ],
  },
  {
    id: "g12",
    label: "Jika besar sudut x = 65°, maka pelurus dari sudut x adalah ___°.",
    answers: ["115"],
    discussion: [
      "Pelurus = 180° − sudut.",
      "180° − 65° = 115°.",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Jenis Sudut",
    text: "Lancip (<90°), Siku-siku (=90°), Tumpul (90°–180°), Lurus (=180°), Refleks (180°–360°).",
    tone: "cyan",
  },
  {
    title: "Hubungan 2 Sudut",
    text: "Berpelurus = 180°. Berpenyiku = 90°. Bertolak belakang = sama besar.",
    tone: "yellow",
  },
  {
    title: "Garis Sejajar + Transversal",
    text: "Sehadap, Berseberangan dalam, Berseberangan luar → SAMA BESAR. Sepihak dalam/luar → BERJUMLAH 180°.",
    tone: "emerald",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "klasifikasi-sudut",
    title: "Mainkan: Klasifikasi Sudut",
    description:
      "Geser setiap kartu derajat ke wadah yang sesuai dengan jenis sudutnya. Ingat: Lancip <90°, Siku-siku =90°, Tumpul 90°–180°, Lurus =180°.",
    buckets: [
      { id: "lancip", label: "Lancip", emoji: "🔻", color: "cyan" },
      { id: "siku", label: "Siku-siku", emoji: "📐", color: "amber" },
      { id: "tumpul", label: "Tumpul", emoji: "🔶", color: "rose" },
      { id: "lurus", label: "Lurus", emoji: "➖", color: "emerald" },
    ],
    items: [
      { id: "a1", label: "30°", bucketId: "lancip", emoji: "🔺" },
      { id: "a2", label: "60°", bucketId: "lancip", emoji: "🔺" },
      { id: "a3", label: "85°", bucketId: "lancip", emoji: "🔺" },
      { id: "a4", label: "90°", bucketId: "siku", emoji: "📐" },
      { id: "a5", label: "120°", bucketId: "tumpul", emoji: "🔶" },
      { id: "a6", label: "135°", bucketId: "tumpul", emoji: "🔶" },
      { id: "a7", label: "150°", bucketId: "tumpul", emoji: "🔶" },
      { id: "a8", label: "180°", bucketId: "lurus", emoji: "➖" },
    ],
  },
  {
    kind: "arrow-match",
    id: "pasangan-sudut",
    title: "Mainkan: Pasangan Sudut & Sifatnya",
    description:
      "Tarik garis dari setiap nama pasangan sudut ke sifatnya. Pasangan ini muncul saat dua garis sejajar dipotong garis lain.",
    rightOptions: ["Sama besar", "Berjumlah 180°", "Berjumlah 90°"],
    pairs: [
      { id: "p1", left: "Sehadap", correctRight: "Sama besar", emoji: "↗️" },
      { id: "p2", left: "Berseberangan dalam", correctRight: "Sama besar", emoji: "🔁" },
      { id: "p3", left: "Berseberangan luar", correctRight: "Sama besar", emoji: "🔄" },
      { id: "p4", left: "Sepihak dalam", correctRight: "Berjumlah 180°", emoji: "🤝" },
      { id: "p5", left: "Bertolak belakang", correctRight: "Sama besar", emoji: "✖️" },
      { id: "p6", left: "Berpelurus", correctRight: "Berjumlah 180°", emoji: "📏" },
      { id: "p7", left: "Berpenyiku", correctRight: "Berjumlah 90°", emoji: "📐" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Jenis sudut apakah yang besarnya 72°?",
    kind: "choice",
    options: ["Lancip", "Siku-siku", "Tumpul", "Lurus"],
    correctIndex: 0,
    hint: "Bandingkan dengan 90°. Jika kurang dari 90°, namanya?",
    discussion: [
      "72° < 90°, jadi termasuk sudut LANCIP.",
    ],
  },
  {
    id: "p2",
    question: "Penyiku dari sudut 27° adalah ___°.",
    answers: ["63"],
    hint: "Penyiku berarti dijumlah dengan sudut tersebut hasilnya 90°.",
    discussion: [
      "Penyiku = 90° − 27° = 63°.",
    ],
  },
  {
    id: "p3",
    question: "Pelurus dari sudut 118° adalah ___°.",
    answers: ["62"],
    hint: "Pelurus berarti dijumlah dengan sudut tersebut hasilnya 180°.",
    discussion: [
      "Pelurus = 180° − 118° = 62°.",
    ],
  },
  {
    id: "p4",
    question: "Dua garis sejajar dipotong oleh garis transversal. Jika salah satu sudut sehadap besarnya 105°, berapa besar pasangan sehadapnya?",
    answers: ["105"],
    hint: "Sudut sehadap pada dua garis sejajar selalu sama besar.",
    discussion: [
      "Sehadap → sama besar. Jadi pasangannya juga 105°.",
    ],
  },
  {
    id: "p5",
    question: "Jika sudut sepihak dalam pertama besarnya 75°, maka sudut sepihak dalam kedua adalah ___°.",
    answers: ["105"],
    hint: "Sepihak dalam berjumlah 180°.",
    discussion: [
      "Sepihak dalam: 75° + x = 180°.",
      "x = 180° − 75° = 105°.",
    ],
  },
  {
    id: "p6",
    question: "Dua garis berpotongan. Sudut bertolak belakang dari sudut 47° besarnya ___°.",
    answers: ["47"],
    hint: "Sudut bertolak belakang selalu sama besar.",
    discussion: [
      "Sudut bertolak belakang sama besar, jadi 47°.",
    ],
  },
  {
    id: "p7",
    question: "Pernyataan: 'Sudut refleks adalah sudut yang besarnya lebih dari 180°.'",
    kind: "truefalse",
    correct: true,
    hint: "Refleks bukan sudut biasa — ia melebihi setengah lingkaran.",
    discussion: [
      "Benar. Sudut refleks: 180° < a < 360°.",
    ],
  },
  {
    id: "p8",
    question: "Sebuah sudut besarnya 3x dan pelurusnya 2x + 30°. Tentukan nilai x.",
    answers: ["30"],
    hint: "3x + (2x + 30) = 180°.",
    discussion: [
      "3x + 2x + 30 = 180.",
      "5x = 150.",
      "x = 30°.",
    ],
  },
];

const GarisDanSudutLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Matematika Kelas 7"
    title="Garis dan Sudut"
    intro="Lewat LKPD penemuan terbimbing ini, Sobat Numatik akan mengenal unsur garis & sudut, menemukan sendiri jenis-jenis sudut, hubungan antar sudut, hingga pasangan sudut pada dua garis sejajar yang dipotong transversal. Ada juga game seru yang bisa kamu mainkan!"
    steps={[
      { icon: "Compass", title: "Amati", text: "Perhatikan tiga situasi visual penuh warna untuk membangun intuisi." },
      { icon: "Lightbulb", title: "Temukan", text: "Jawab pertanyaan terbimbing langkah demi langkah dan rumuskan kesimpulanmu sendiri." },
      { icon: "Target", title: "Terapkan", text: "Mainkan game interaktif lalu uji pemahamanmu dengan soal latihan." },
    ]}
    situations={situations}
    guidedIntro="Isilah pertanyaan berikut secara berurutan untuk menemukan konsep penting tentang garis dan sudut."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Gunakan kesimpulan dari penemuan terbimbing untuk menjawab soal berikut."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-7"
    backLabel="Kembali ke LKPD Kelas 7"
  />
);

export default GarisDanSudutLKPDPage;
