import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";
import TankShotBangunGame from "./TankShotBangunGame";

const TriCard = ({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) => (
  <div
    className="rounded-xl border p-2 bg-white/5"
    style={{ borderColor: `${color}55`, background: `${color}10` }}
  >
    <svg viewBox="0 0 100 80" className="w-full h-auto">{children}</svg>
    <p className="text-center text-[11px] font-bold mt-1" style={{ color }}>{title}</p>
  </div>
);

const SegitigaSamaSisi = () => (
  <TriCard title="Sama Sisi" color="#22d3ee">
    <polygon points="50,10 88,68 12,68" fill="#22d3ee55" stroke="#22d3ee" strokeWidth={2.5} />
    <text x={50} y={76} textAnchor="middle" fontSize={8} fill="#22d3ee" fontWeight={700}>3 sisi sama, 3 sudut 60°</text>
  </TriCard>
);
const SegitigaSamaKaki = () => (
  <TriCard title="Sama Kaki" color="#facc15">
    <polygon points="50,12 80,70 20,70" fill="#facc1555" stroke="#facc15" strokeWidth={2.5} />
    <line x1={50} y1={12} x2={20} y2={70} stroke="#facc15" strokeDasharray="3 2" />
    <line x1={50} y1={12} x2={80} y2={70} stroke="#facc15" strokeDasharray="3 2" />
    <text x={50} y={78} textAnchor="middle" fontSize={8} fill="#facc15" fontWeight={700}>2 sisi sama panjang</text>
  </TriCard>
);
const SegitigaSembarang = () => (
  <TriCard title="Sembarang" color="#a78bfa">
    <polygon points="20,68 90,60 60,16" fill="#a78bfa55" stroke="#a78bfa" strokeWidth={2.5} />
    <text x={50} y={78} textAnchor="middle" fontSize={8} fill="#a78bfa" fontWeight={700}>Semua sisi beda</text>
  </TriCard>
);
const SegitigaSikuSiku = () => (
  <TriCard title="Siku-siku" color="#34d399">
    <polygon points="20,70 80,70 20,15" fill="#34d39955" stroke="#34d399" strokeWidth={2.5} />
    <rect x={20} y={62} width={8} height={8} fill="none" stroke="#34d399" strokeWidth={1.5} />
    <text x={50} y={78} textAnchor="middle" fontSize={8} fill="#34d399" fontWeight={700}>Salah satu sudut 90°</text>
  </TriCard>
);
const SegitigaTumpul = () => (
  <TriCard title="Tumpul" color="#fb7185">
    <polygon points="10,65 90,65 75,30" fill="#fb718555" stroke="#fb7185" strokeWidth={2.5} />
    <text x={50} y={78} textAnchor="middle" fontSize={8} fill="#fb7185" fontWeight={700}>Ada sudut &gt; 90°</text>
  </TriCard>
);
const SegitigaLancip = () => (
  <TriCard title="Lancip" color="#fb923c">
    <polygon points="50,12 80,68 20,68" fill="#fb923c55" stroke="#fb923c" strokeWidth={2.5} />
    <text x={50} y={78} textAnchor="middle" fontSize={8} fill="#fb923c" fontWeight={700}>Semua sudut &lt; 90°</text>
  </TriCard>
);

const PersegiSVG = () => (
  <TriCard title="Persegi" color="#facc15">
    <rect x={22} y={16} width={56} height={56} fill="#facc1555" stroke="#facc15" strokeWidth={2.5} />
    <rect x={22} y={64} width={8} height={8} fill="none" stroke="#facc15" strokeWidth={1.5} />
    <text x={50} y={78} textAnchor="middle" fontSize={8} fill="#facc15" fontWeight={700}>4 sisi sama, 4 sudut 90°</text>
  </TriCard>
);
const PersegiPanjangSVG = () => (
  <TriCard title="Persegi Panjang" color="#22d3ee">
    <rect x={12} y={20} width={76} height={48} fill="#22d3ee55" stroke="#22d3ee" strokeWidth={2.5} />
    <rect x={12} y={60} width={8} height={8} fill="none" stroke="#22d3ee" strokeWidth={1.5} />
    <text x={50} y={78} textAnchor="middle" fontSize={8} fill="#22d3ee" fontWeight={700}>Sisi berhadapan sama</text>
  </TriCard>
);
const JajarGenjangSVG = () => (
  <TriCard title="Jajar Genjang" color="#a78bfa">
    <polygon points="22,68 78,68 88,22 32,22" fill="#a78bfa55" stroke="#a78bfa" strokeWidth={2.5} />
    <text x={50} y={78} textAnchor="middle" fontSize={8} fill="#a78bfa" fontWeight={700}>2 pasang sisi sejajar</text>
  </TriCard>
);
const BelahKetupatSVG = () => (
  <TriCard title="Belah Ketupat" color="#34d399">
    <polygon points="50,10 86,42 50,72 14,42" fill="#34d39955" stroke="#34d399" strokeWidth={2.5} />
    <line x1={50} y1={10} x2={50} y2={72} stroke="#34d399" strokeDasharray="3 2" />
    <line x1={14} y1={42} x2={86} y2={42} stroke="#34d399" strokeDasharray="3 2" />
    <text x={50} y={79} textAnchor="middle" fontSize={8} fill="#34d399" fontWeight={700}>4 sisi sama, diagonal ⊥</text>
  </TriCard>
);
const LayangSVG = () => (
  <TriCard title="Layang-Layang" color="#fb923c">
    <polygon points="50,8 84,38 50,76 16,38" fill="#fb923c55" stroke="#fb923c" strokeWidth={2.5} />
    <line x1={50} y1={8} x2={50} y2={76} stroke="#fb923c" strokeDasharray="3 2" />
    <line x1={16} y1={38} x2={84} y2={38} stroke="#fb923c" strokeDasharray="3 2" />
    <text x={50} y={79} textAnchor="middle" fontSize={8} fill="#fb923c" fontWeight={700}>2 pasang sisi berdekatan sama</text>
  </TriCard>
);
const TrapesiumSVG = () => (
  <TriCard title="Trapesium" color="#f472b6">
    <polygon points="10,68 90,68 70,22 30,22" fill="#f472b655" stroke="#f472b6" strokeWidth={2.5} />
    <text x={50} y={78} textAnchor="middle" fontSize={8} fill="#f472b6" fontWeight={700}>1 pasang sisi sejajar</text>
  </TriCard>
);

const SudutDalamSegitigaVisual = () => (
  <svg viewBox="0 0 220 130" className="w-full h-auto">
    <polygon points="40,110 180,110 110,20" fill="#22d3ee33" stroke="#22d3ee" strokeWidth={2.5} />
    <path d="M 50 110 A 14 14 0 0 0 56 96" fill="#facc15aa" />
    <text x={64} y={104} fontSize={11} fontWeight={700} fill="#facc15">a</text>
    <path d="M 168 110 A 14 14 0 0 0 162 96" fill="#fb7185aa" />
    <text x={150} y={104} fontSize={11} fontWeight={700} fill="#fb7185">b</text>
    <path d="M 102 32 A 12 12 0 0 0 118 32" fill="#34d399aa" />
    <text x={104} y={48} fontSize={11} fontWeight={700} fill="#34d399">c</text>
    <text x={110} y={126} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--icon-color)">a + b + c = 180°</text>
  </svg>
);

const RumusLuasKelilingVisual = () => (
  <svg viewBox="0 0 280 130" className="w-full h-auto">
    <rect x={20} y={20} width={100} height={70} fill="#facc1533" stroke="#facc15" strokeWidth={2.5} />
    <text x={70} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fill="#facc15">Persegi Pjg</text>
    <text x={70} y={120} textAnchor="middle" fontSize={9} fill="var(--icon-color)">L = p × l</text>
    <text x={70} y={15} textAnchor="middle" fontSize={9} fill="#facc15">p</text>
    <text x={14} y={58} textAnchor="middle" fontSize={9} fill="#facc15">l</text>

    <polygon points="170,90 260,90 215,25" fill="#22d3ee33" stroke="#22d3ee" strokeWidth={2.5} />
    <line x1={215} y1={25} x2={215} y2={90} stroke="#22d3ee" strokeDasharray="3 2" />
    <text x={215} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fill="#22d3ee">Segitiga</text>
    <text x={215} y={120} textAnchor="middle" fontSize={9} fill="var(--icon-color)">L = ½ × a × t</text>
    <text x={215} y={102} textAnchor="middle" fontSize={9} fill="#22d3ee">a</text>
    <text x={224} y={60} fontSize={9} fill="#22d3ee">t</text>
  </svg>
);

const situations: SituationCard[] = [
  {
    title: "Situasi 1: Macam-macam Segitiga",
    visual: (
      <div className="grid grid-cols-3 gap-2">
        <SegitigaSamaSisi />
        <SegitigaSamaKaki />
        <SegitigaSembarang />
        <SegitigaSikuSiku />
        <SegitigaTumpul />
        <SegitigaLancip />
      </div>
    ),
    text: "Segitiga dapat dikelompokkan berdasarkan PANJANG SISI (sama sisi/sama kaki/sembarang) maupun BESAR SUDUT (siku-siku/tumpul/lancip).",
  },
  {
    title: "Situasi 2: Macam-macam Segiempat",
    visual: (
      <div className="grid grid-cols-3 gap-2">
        <PersegiSVG />
        <PersegiPanjangSVG />
        <JajarGenjangSVG />
        <BelahKetupatSVG />
        <LayangSVG />
        <TrapesiumSVG />
      </div>
    ),
    text: "Segiempat punya 4 sisi & 4 sudut. Tiap jenis berbeda berdasarkan sisi sejajar, panjang sisi, dan sudutnya.",
  },
  {
    title: "Situasi 3: Sudut Dalam Segitiga",
    visual: <SudutDalamSegitigaVisual />,
    text: "Robek ketiga sudut segitiga, lalu gabungkan ujungnya. Mereka selalu membentuk garis lurus = 180°.",
  },
  {
    title: "Situasi 4: Luas & Keliling",
    visual: <RumusLuasKelilingVisual />,
    text: "Luas = ukuran daerah dalam bangun. Keliling = jumlah seluruh panjang sisi. Setiap bangun punya rumusnya sendiri.",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label: "Segitiga yang ketiga sisinya sama panjang dan ketiga sudutnya 60° dinamakan segitiga ___.",
    answers: ["sama sisi"],
    discussion: [
      "Segitiga sama sisi: 3 sisi sama panjang, 3 sudut sama (masing-masing 60°).",
      "Karena 60° + 60° + 60° = 180° (sesuai sifat sudut dalam segitiga).",
    ],
  },
  {
    id: "g2",
    label: "Segitiga yang salah satu sudutnya tepat 90° disebut segitiga ___.",
    answers: ["siku-siku", "siku siku"],
    discussion: [
      "Segitiga siku-siku punya satu sudut 90°.",
      "Sisi terpanjang yang berhadapan dengan sudut siku-siku disebut hipotenusa.",
    ],
  },
  {
    id: "g3",
    label: "Jumlah ketiga sudut dalam sebuah segitiga selalu sama dengan ___°.",
    answers: ["180"],
    discussion: [
      "Sifat universal segitiga: a + b + c = 180°.",
      "Dapat dibuktikan dengan menggambar garis sejajar pada salah satu sisi (sudut sehadap & berseberangan).",
    ],
  },
  {
    id: "g4",
    label: "Pasangkan jenis segitiga (berdasarkan sisi) dengan ciri-cirinya.",
    kind: "match",
    pairs: [
      { left: "Sama sisi", right: "3 sisi sama" },
      { left: "Sama kaki", right: "2 sisi sama" },
      { left: "Sembarang", right: "Semua sisi beda" },
    ],
    discussion: [
      "Pengelompokan berdasarkan SISI: sama sisi (3 sama), sama kaki (2 sama), sembarang (semua beda).",
    ],
  },
  {
    id: "g5",
    label: "Pasangkan jenis segitiga (berdasarkan sudut) dengan ukurannya.",
    kind: "match",
    pairs: [
      { left: "Lancip", right: "Semua sudut < 90°" },
      { left: "Siku-siku", right: "Salah satu sudut = 90°" },
      { left: "Tumpul", right: "Salah satu sudut > 90°" },
    ],
    discussion: [
      "Pengelompokan berdasarkan SUDUT: lancip (semua <90°), siku-siku (ada =90°), tumpul (ada >90°).",
    ],
  },
  {
    id: "g6",
    label: "Bangun segiempat yang keempat sisinya sama panjang dan keempat sudutnya 90° adalah ___.",
    answers: ["persegi"],
    discussion: [
      "Persegi: 4 sisi sama panjang + 4 sudut siku-siku.",
      "Diagonalnya sama panjang, saling tegak lurus, dan membagi dua sama besar.",
    ],
  },
  {
    id: "g7",
    label: "Bangun yang sisi-sisi berhadapan sama panjang dan keempat sudutnya 90° adalah ___.",
    answers: ["persegi panjang"],
    discussion: [
      "Persegi panjang: sisi berhadapan sama panjang (p dan l) + 4 sudut 90°.",
      "Diagonalnya sama panjang dan saling membagi dua sama besar.",
    ],
  },
  {
    id: "g8",
    label: "Pernyataan: \"Belah ketupat memiliki dua diagonal yang saling tegak lurus.\"",
    kind: "truefalse",
    correct: true,
    discussion: [
      "Benar. Diagonal belah ketupat saling tegak lurus dan saling membagi dua sama panjang.",
    ],
  },
  {
    id: "g9",
    label: "Bangun yang hanya memiliki SATU pasang sisi sejajar dinamakan ___.",
    answers: ["trapesium"],
    discussion: [
      "Trapesium: 1 pasang sisi sejajar (bukan 2 seperti jajar genjang).",
      "Jenisnya: trapesium siku-siku, sama kaki, dan sembarang.",
    ],
  },
  {
    id: "g10",
    label: "Pasangkan setiap bangun datar dengan rumus LUASnya.",
    kind: "match",
    pairs: [
      { left: "Persegi", right: "s × s" },
      { left: "Persegi Panjang", right: "p × l" },
      { left: "Segitiga", right: "½ × a × t" },
      { left: "Jajar Genjang", right: "a × t" },
      { left: "Belah Ketupat / Layang-Layang", right: "½ × d₁ × d₂" },
      { left: "Trapesium", right: "½ × (a + b) × t" },
    ],
    discussion: [
      "Persegi s². Persegi panjang p × l. Segitiga ½ × alas × tinggi.",
      "Jajar genjang alas × tinggi. Belah ketupat & layang-layang ½ × d₁ × d₂.",
      "Trapesium ½ × (jumlah sisi sejajar) × tinggi.",
    ],
  },
  {
    id: "g11",
    label: "Sebuah segitiga punya sudut 65° dan 50°. Sudut ketiganya adalah ___°.",
    answers: ["65"],
    discussion: [
      "Total sudut segitiga = 180°.",
      "180° − 65° − 50° = 65°.",
    ],
  },
  {
    id: "g12",
    label: "Urutkan bangun segiempat dari yang ciri-cirinya PALING BANYAK SAMA dengan PERSEGI ke yang paling sedikit.",
    kind: "sort",
    items: ["Trapesium", "Jajar Genjang", "Persegi Panjang", "Belah Ketupat"],
    correctOrder: ["Persegi Panjang", "Belah Ketupat", "Jajar Genjang", "Trapesium"],
    discussion: [
      "Persegi panjang: punya 4 sudut 90° (paling mirip).",
      "Belah ketupat: punya 4 sisi sama (sifat persegi yang lain).",
      "Jajar genjang: 2 pasang sisi sejajar tapi tanpa siku-siku & tanpa semua sisi sama.",
      "Trapesium: hanya 1 pasang sisi sejajar (paling berbeda).",
    ],
  },
  {
    id: "g13",
    label: "Keliling persegi yang panjang sisinya 12 cm adalah ___ cm.",
    answers: ["48"],
    discussion: [
      "K persegi = 4 × s.",
      "K = 4 × 12 = 48 cm.",
    ],
  },
  {
    id: "g14",
    label: "Luas trapesium dengan sisi sejajar 8 cm dan 12 cm serta tinggi 6 cm adalah ___ cm².",
    answers: ["60"],
    discussion: [
      "L trapesium = ½ × (a + b) × t.",
      "L = ½ × (8 + 12) × 6 = ½ × 20 × 6 = 60 cm².",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Segitiga (berdasarkan sisi)",
    text: "Sama sisi (3 sama), Sama kaki (2 sama), Sembarang (semua beda).",
    tone: "cyan",
  },
  {
    title: "Segitiga (berdasarkan sudut)",
    text: "Lancip (<90°), Siku-siku (=90°), Tumpul (>90°). Jumlah sudut = 180°.",
    tone: "yellow",
  },
  {
    title: "Segiempat utama",
    text: "Persegi, Persegi Panjang, Jajar Genjang, Belah Ketupat, Layang-Layang, Trapesium.",
    tone: "violet",
  },
  {
    title: "Rumus Luas",
    text: "Persegi s², PersegiPjg p×l, Segitiga ½at, Jajar at, Belah/Layang ½d₁d₂, Trapesium ½(a+b)t.",
    tone: "emerald",
  },
  {
    title: "Rumus Keliling",
    text: "Jumlahkan SEMUA panjang sisi. Persegi 4s, PersegiPjg 2(p+l), Belah/Layang/Jajar = jumlah 4 sisi.",
    tone: "rose",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "klasifikasi-segiempat",
    title: "Mainkan: Geser Sifat ke Bangun yang Tepat",
    description: "Tarik setiap kartu sifat ke bangun datar yang sesuai.",
    buckets: [
      { id: "persegi", label: "Persegi", emoji: "⬜", color: "amber" },
      { id: "pp", label: "Persegi Panjang", emoji: "▭", color: "cyan" },
      { id: "bk", label: "Belah Ketupat", emoji: "🔷", color: "emerald" },
      { id: "trap", label: "Trapesium", emoji: "🔺", color: "rose" },
    ],
    items: [
      { id: "i1", label: "4 sisi sama + 4 sudut 90°", bucketId: "persegi" },
      { id: "i2", label: "Diagonal sama panjang", bucketId: "pp" },
      { id: "i3", label: "Sisi berhadapan sama, sudut 90°", bucketId: "pp" },
      { id: "i4", label: "4 sisi sama, diagonal ⊥", bucketId: "bk" },
      { id: "i5", label: "Hanya 1 pasang sisi sejajar", bucketId: "trap" },
      { id: "i6", label: "Diagonal saling membagi 2 sama panjang", bucketId: "persegi" },
      { id: "i7", label: "L = ½ × d₁ × d₂", bucketId: "bk" },
      { id: "i8", label: "L = ½ × (a + b) × t", bucketId: "trap" },
    ],
  },
  {
    kind: "arrow-match",
    id: "rumus-luas",
    title: "Mainkan: Cocokkan Rumus Luas",
    description: "Tarik garis dari nama bangun ke rumus LUAS yang benar.",
    rightOptions: ["s × s", "p × l", "½ × a × t", "a × t", "½ × d₁ × d₂", "½ × (a + b) × t"],
    pairs: [
      { id: "r1", left: "Persegi", correctRight: "s × s", emoji: "⬜" },
      { id: "r2", left: "Persegi Panjang", correctRight: "p × l", emoji: "▭" },
      { id: "r3", left: "Segitiga", correctRight: "½ × a × t", emoji: "🔺" },
      { id: "r4", left: "Jajar Genjang", correctRight: "a × t", emoji: "🟪" },
      { id: "r5", left: "Belah Ketupat", correctRight: "½ × d₁ × d₂", emoji: "🔷" },
      { id: "r6", left: "Trapesium", correctRight: "½ × (a + b) × t", emoji: "🔻" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question: "Sebuah segitiga punya sudut 40° dan 75°. Sudut ketiganya?",
    answers: ["65"],
    hint: "Jumlah sudut segitiga = 180°.",
    discussion: ["180° − 40° − 75° = 65°."],
  },
  {
    id: "p2",
    question: "Bangun datar dengan sifat: 4 sisi sama panjang dan 4 sudut siku-siku adalah ...",
    kind: "choice",
    options: ["Belah ketupat", "Persegi", "Jajar genjang", "Trapesium"],
    correctIndex: 1,
    hint: "4 sisi sama + sudut 90° → bangun istimewa.",
    discussion: [
      "Belah ketupat sisi sama tapi sudut bukan 90°.",
      "Persegi memenuhi keduanya.",
    ],
  },
  {
    id: "p3",
    question: "Luas persegi dengan sisi 9 cm adalah ___ cm².",
    answers: ["81"],
    hint: "L = s × s.",
    discussion: ["L = 9 × 9 = 81 cm²."],
  },
  {
    id: "p4",
    question: "Keliling persegi panjang dengan p = 15 cm dan l = 8 cm adalah ___ cm.",
    answers: ["46"],
    hint: "K = 2 × (p + l).",
    discussion: ["K = 2 × (15 + 8) = 2 × 23 = 46 cm."],
  },
  {
    id: "p5",
    question: "Luas segitiga dengan alas 14 cm dan tinggi 9 cm adalah ___ cm².",
    answers: ["63"],
    hint: "L = ½ × a × t.",
    discussion: ["L = ½ × 14 × 9 = 7 × 9 = 63 cm²."],
  },
  {
    id: "p6",
    question: "Diagonal belah ketupat 12 cm dan 16 cm. Luasnya ___ cm².",
    answers: ["96"],
    hint: "L = ½ × d₁ × d₂.",
    discussion: ["L = ½ × 12 × 16 = 6 × 16 = 96 cm²."],
  },
  {
    id: "p7",
    question: "Pernyataan: 'Setiap persegi adalah persegi panjang.'",
    kind: "truefalse",
    correct: true,
    hint: "Cek apakah persegi memenuhi semua syarat persegi panjang.",
    discussion: [
      "Persegi memenuhi syarat persegi panjang (sisi berhadapan sama + 4 sudut 90°).",
      "Jadi pernyataannya BENAR.",
    ],
  },
  {
    id: "p8",
    question: "Trapesium dengan sisi sejajar 10 cm & 14 cm dan tinggi 8 cm. Luas = ___ cm².",
    answers: ["96"],
    hint: "L = ½ × (a + b) × t.",
    discussion: ["L = ½ × (10 + 14) × 8 = ½ × 24 × 8 = 96 cm²."],
  },
  {
    id: "p9",
    question: "Sebuah segitiga sama kaki punya sudut puncak 80°. Besar masing-masing sudut alas?",
    answers: ["50"],
    hint: "Sudut alasnya sama besar. Total = 180°.",
    discussion: [
      "Sudut alas = (180° − 80°) ÷ 2 = 100° ÷ 2 = 50°.",
    ],
  },
];

const SegitigaDanSegiempatLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Matematika Kelas 7"
    title="Segitiga dan Segiempat"
    intro="Mari menjelajah dunia bangun datar! Lewat penemuan terbimbing, banyak gambar berwarna, game tank shot di tengah, hingga drag-match seru, kamu akan menemukan sendiri jenis-jenis segitiga & segiempat, sifat, serta rumus keliling dan luasnya."
    steps={[
      { icon: "Compass", title: "Amati", text: "Lihat 4 situasi visual berwarna: jenis segitiga, jenis segiempat, sudut dalam, dan rumus." },
      { icon: "Lightbulb", title: "Temukan", text: "Jawab 14 pertanyaan terbimbing untuk menemukan sifat & rumus secara mandiri." },
      { icon: "Target", title: "Terapkan", text: "Mainkan Tank Shot Bangun Datar, drag-match, lalu kerjakan 9 soal latihan." },
    ]}
    situations={situations}
    guidedIntro="Isilah pertanyaan-pertanyaan berikut secara berurutan untuk menemukan ciri & rumus bangun datar."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    midSlot={<TankShotBangunGame />}
    games={games}
    practiceIntro="Gunakan kesimpulan dari penemuan terbimbing untuk menjawab soal berikut."
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-7"
    backLabel="Kembali ke LKPD Kelas 7"
  />
);

export default SegitigaDanSegiempatLKPDPage;
