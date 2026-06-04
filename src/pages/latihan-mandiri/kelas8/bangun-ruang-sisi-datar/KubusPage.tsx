import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Box } from "lucide-react";

const color = "sky";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; mathContent?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  type: "essay" | "mixed";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

// labels order matches vertex order: [front-left-bottom, front-right-bottom, back-right-bottom, back-left-bottom,
//   back-left-top, back-right-top, front-right-top, front-left-top]
// Default ABCD.EFGH: A=front-left-bottom(0), B=front-right-bottom(1), C=back-right-bottom(2), D=back-left-bottom(3),
//   E=back-left-top(4), F=back-right-top(5), G=front-right-top(6), H=front-left-top(7)
// For PQRS.TUVW: P(0),Q(1),R(2),S(3) bottom; T above P→index7, U above Q→index6, V above R→index5, W above S→index4
//   so labels=['P','Q','R','S','W','V','U','T']
// Correct ABCD.EFGH convention: A below E, B below F, C below G, D below H
// Index order: [front-left-bot, front-right-bot, back-right-bot, back-left-bot,
//               back-left-top(=H), back-right-top(=G), front-right-top(=F), front-left-top(=E)]
const DEFAULT_CUBE_LABELS = ['A','B','C','D','H','G','F','E'];
const CubeSVG = ({ s = "s", label = true, color: c = "#38bdf8", labels = DEFAULT_CUBE_LABELS }: { s?: string; label?: boolean; color?: string; labels?: string[] }) => (
  <svg width="160" height="130" viewBox="0 0 160 130" className="mx-auto">
    <defs>
      <linearGradient id="cubeFront" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={c} stopOpacity="0.35" />
        <stop offset="100%" stopColor={c} stopOpacity="0.15" />
      </linearGradient>
      <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={c} stopOpacity="0.55" />
        <stop offset="100%" stopColor={c} stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="cubeRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={c} stopOpacity="0.2" />
        <stop offset="100%" stopColor={c} stopOpacity="0.08" />
      </linearGradient>
    </defs>
    {/* Front face */}
    <polygon points="30,95 110,95 110,35 30,35" fill="url(#cubeFront)" stroke={c} strokeWidth="1.8" />
    {/* Top face */}
    <polygon points="30,35 110,35 145,10 65,10" fill="url(#cubeTop)" stroke={c} strokeWidth="1.8" />
    {/* Right face */}
    <polygon points="110,35 145,10 145,70 110,95" fill="url(#cubeRight)" stroke={c} strokeWidth="1.8" />
    {/* Hidden edges (dashed) */}
    <line x1="30" y1="95" x2="65" y2="70" stroke={c} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="65" y1="70" x2="145" y2="70" stroke={c} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="65" y1="70" x2="65" y2="10" stroke={c} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    {/* Vertices */}
    {[[30,95],[110,95],[110,35],[30,35],[65,10],[145,10],[145,70],[65,70]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill={c} fillOpacity="0.9" />
    ))}
    {/* Labels: positions match vertex order above */}
    {label && <>
      <text x="20"  y="100" fill="var(--icon-color)" fontSize="11" fontFamily="monospace">{labels[0]}</text>
      <text x="112" y="100" fill="var(--icon-color)" fontSize="11" fontFamily="monospace">{labels[1]}</text>
      <text x="112" y="33"  fill="var(--icon-color)" fontSize="11" fontFamily="monospace">{labels[2]}</text>
      <text x="20"  y="33"  fill="var(--icon-color)" fontSize="11" fontFamily="monospace">{labels[3]}</text>
      <text x="58"  y="8"   fill="var(--icon-color)" fontSize="11" fontFamily="monospace">{labels[4]}</text>
      <text x="148" y="8"   fill="var(--icon-color)" fontSize="11" fontFamily="monospace">{labels[5]}</text>
      <text x="148" y="72"  fill="var(--icon-color)" fontSize="11" fontFamily="monospace">{labels[6]}</text>
      <text x="58"  y="72"  fill="var(--icon-color)" fontSize="11" fontFamily="monospace">{labels[7]}</text>
      <text x="66"  y="70"  fill={c} fontSize="10" fontFamily="monospace">{s}</text>
    </>}
  </svg>
);

const CubeNetSVG = () => (
  <svg width="250" height="160" viewBox="0 0 250 160" className="mx-auto">
    {[
      [60,0,60,55,"sky"],
      [0,55,60,55,"cyan"],
      [60,55,60,55,"sky"],
      [120,55,60,55,"blue"],
      [180,55,60,55,"indigo"],
      [60,110,60,55,"teal"],
    ].map(([x,y,w,h,c],i) => (
      <rect key={i} x={x as number} y={y as number} width={w as number} height={h as number}
        fill={`#0ea5e9`} fillOpacity={0.15 + i*0.05} stroke="#38bdf8" strokeWidth="1.5"
        rx="2" />
    ))}
    <text x="85" y="28" fill="#7dd3fc" fontSize="10" textAnchor="middle">Atas</text>
    <text x="30" y="85" fill="#7dd3fc" fontSize="10" textAnchor="middle">Kiri</text>
    <text x="90" y="85" fill="#7dd3fc" fontSize="10" textAnchor="middle">Depan</text>
    <text x="150" y="85" fill="#7dd3fc" fontSize="10" textAnchor="middle">Kanan</text>
    <text x="210" y="85" fill="#7dd3fc" fontSize="9" textAnchor="middle">Belakang</text>
    <text x="90" y="140" fill="#7dd3fc" fontSize="10" textAnchor="middle">Bawah</text>
  </svg>
);

// Q3: cube with swapped labels (F↔C, E↔D) + one bidang diagonal highlighted
const DiagonalBidangQ3SVG = () => {
  const c = "#38bdf8";
  const q3labels = ['A','B','F','E','H','G','C','D'];
  // Vertex pixel positions (same as CubeSVG):
  // [0](30,95) [1](110,95) [2](110,35) [3](30,35) [4](65,10) [5](145,10) [6](145,70) [7](65,70)
  // Bidang diagonal sample: ABGH → A(30,95), B(110,95), G(145,10), H(65,10)
  return (
    <svg width="160" height="145" viewBox="0 0 160 145" className="mx-auto">
      <defs>
        <linearGradient id="cbF2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c} stopOpacity="0.35" />
          <stop offset="100%" stopColor={c} stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="cbT2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c} stopOpacity="0.55" />
          <stop offset="100%" stopColor={c} stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="cbR2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c} stopOpacity="0.2" />
          <stop offset="100%" stopColor={c} stopOpacity="0.08" />
        </linearGradient>
      </defs>
      {/* Bidang diagonal ABGH filled bright */}
      <polygon points="30,95 110,95 145,10 65,10" fill="#f59e0b" fillOpacity="0.35" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" />
      {/* Cube faces */}
      <polygon points="30,95 110,95 110,35 30,35" fill="url(#cbF2)" stroke={c} strokeWidth="1.8" />
      <polygon points="30,35 110,35 145,10 65,10" fill="url(#cbT2)" stroke={c} strokeWidth="1.8" />
      <polygon points="110,35 145,10 145,70 110,95" fill="url(#cbR2)" stroke={c} strokeWidth="1.8" />
      {/* Hidden edges */}
      <line x1="30" y1="95" x2="65" y2="70" stroke={c} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
      <line x1="65" y1="70" x2="145" y2="70" stroke={c} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
      <line x1="65" y1="70" x2="65" y2="10" stroke={c} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
      {/* Vertices */}
      {[[30,95],[110,95],[110,35],[30,35],[65,10],[145,10],[145,70],[65,70]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill={c} fillOpacity="0.9" />
      ))}
      {/* Labels */}
      <text x="20"  y="100" fill="var(--icon-color)" fontSize="11" fontFamily="monospace">{q3labels[0]}</text>
      <text x="112" y="100" fill="var(--icon-color)" fontSize="11" fontFamily="monospace">{q3labels[1]}</text>
      <text x="112" y="33"  fill="var(--icon-color)" fontSize="11" fontFamily="monospace">{q3labels[2]}</text>
      <text x="20"  y="33"  fill="var(--icon-color)" fontSize="11" fontFamily="monospace">{q3labels[3]}</text>
      <text x="58"  y="8"   fill="var(--icon-color)" fontSize="11" fontFamily="monospace">{q3labels[4]}</text>
      <text x="148" y="8"   fill="var(--icon-color)" fontSize="11" fontFamily="monospace">{q3labels[5]}</text>
      <text x="148" y="72"  fill="var(--icon-color)" fontSize="11" fontFamily="monospace">{q3labels[6]}</text>
      <text x="58"  y="72"  fill="var(--icon-color)" fontSize="11" fontFamily="monospace">{q3labels[7]}</text>
      {/* Label bidang diagonal */}
      <text x="80" y="135" fill="#f59e0b" fontSize="9" textAnchor="middle" fontFamily="sans-serif">bidang diagonal ABGH</text>
    </svg>
  );
};

const DiagonalCubeSVG = () => (
  <svg width="160" height="130" viewBox="0 0 160 130" className="mx-auto">
    <polygon points="30,95 110,95 110,35 30,35" fill="#0ea5e9" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1.5" />
    <polygon points="30,35 110,35 145,10 65,10" fill="#0ea5e9" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1.5" />
    <polygon points="110,35 145,10 145,70 110,95" fill="#0ea5e9" fillOpacity="0.15" stroke="#38bdf8" strokeWidth="1.5" />
    <line x1="30" y1="95" x2="65" y2="70" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="65" y1="70" x2="145" y2="70" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="65" y1="70" x2="65" y2="10" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    {/* Diagonal ruang */}
    <line x1="30" y1="95" x2="145" y2="10" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,3" />
    <line x1="110" y1="95" x2="65" y2="10" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="5,3" />
    {/* Diagonal sisi depan */}
    <line x1="30" y1="95" x2="110" y2="35" stroke="#34d399" strokeWidth="1.5" />
    <text x="75" y="125" fill="#f59e0b" fontSize="9" textAnchor="middle">diagonal ruang</text>
    <text x="70" y="60" fill="#34d399" fontSize="9" textAnchor="middle">diagonal sisi</text>
    {[[30,95],[110,95],[110,35],[30,35],[65,10],[145,10],[145,70],[65,70]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#38bdf8" />
    ))}
  </svg>
);

const JaringJaringSVG = () => {
  const s = 26;
  const pat = (cells: [number,number][], ox: number, oy: number) =>
    cells.map(([c,r], i) => (
      <rect key={`${ox}-${oy}-${i}`} x={ox+c*s} y={oy+r*s} width={s-1} height={s-1}
        fill="rgba(56,189,248,0.2)" stroke="#38bdf8" strokeWidth="1.5" rx="2" />
    ));
  return (
    <svg viewBox="0 0 240 400" className="w-full max-w-xs mx-auto" style={{background:'transparent'}} xmlns="http://www.w3.org/2000/svg">
      <text x="62"  y="15"  fill="#94a3b8" fontSize="12" textAnchor="middle" fontFamily="sans-serif">(1)</text>
      <text x="192" y="15"  fill="#94a3b8" fontSize="12" textAnchor="middle" fontFamily="sans-serif">(2)</text>
      <text x="62"  y="147" fill="#94a3b8" fontSize="12" textAnchor="middle" fontFamily="sans-serif">(3)</text>
      <text x="192" y="147" fill="#94a3b8" fontSize="12" textAnchor="middle" fontFamily="sans-serif">(4)</text>
      <text x="62"  y="278" fill="#94a3b8" fontSize="12" textAnchor="middle" fontFamily="sans-serif">(5)</text>
      <text x="192" y="278" fill="#94a3b8" fontSize="12" textAnchor="middle" fontFamily="sans-serif">(6)</text>
      {pat([[1,0],[0,1],[1,1],[2,1],[1,2],[1,3]], 23, 20)}
      {pat([[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]], 153, 43)}
      {pat([[0,0],[1,0],[2,0],[1,1],[1,2],[1,3]], 23, 152)}
      {pat([[0,0],[1,0],[0,1],[1,1],[1,2],[1,3]], 166, 152)}
      {pat([[0,0],[1,0],[0,1],[0,2],[0,3],[1,3]], 36, 283)}
      {pat([[0,0],[1,0],[2,0],[2,1],[1,1],[1,2]], 153, 283)}
    </svg>
  );
};

const questions: Q[] = [
  Qn(1, "Unsur-Unsur Kubus", {
    type: "mixed",
    content: "Perhatikan kubus PQRS.TUVW berikut (PQRS = titik sudut alas, TUVW = titik sudut atap):",
    diagram: <CubeSVG labels={['P','Q','U','T','W','V','R','S']} />,
    parts: [
      { label: "a.", text: "Sebutkan semua rusuk kubus PQRS.TUVW!" },
      { label: "b.", text: "Ada berapa banyak titik sudut pada kubus? Sebutkan semuanya." },
      { label: "c.", text: "Ada berapa banyak sisi (bidang) pada kubus? Sebutkan semuanya." },
      { label: "d.", text: "Ada berapa banyak diagonal bidang (diagonal sisi) pada kubus PQRS.TUVW? Sebutkan semuanya!" },
      { label: "e.", text: "Ada berapa banyak diagonal ruang pada kubus PQRS.TUVW? Sebutkan semuanya!" },
      { label: "f.", text: "Ada berapa banyak bidang diagonal pada kubus PQRS.TUVW? Sebutkan semuanya!" },
    ],
  }),
  Qn(2, "Diagonal Sisi dan Diagonal Ruang Kubus", {
    type: "mixed",
    content: "Perhatikan kubus ABCD.EFGH dengan panjang rusuk 6 cm.",
    diagram: <DiagonalCubeSVG />,
    parts: [
      { label: "a.", text: "Tentukan panjang diagonal sisi (diagonal bidang) kubus tersebut!" },
      { label: "b.", text: "Tentukan panjang diagonal ruang kubus tersebut!" },
    ],
  }),
  Qn(3, "Rusuk Kubus dari Diagonal Ruang – UN", {
    type: "mixed",
    content: "Panjang diagonal ruang sebuah kubus adalah 6√3 cm.",
    parts: [
      { label: "a.", math: "\\text{Gunakan rumus diagonal ruang } d = s\\sqrt{3} \\text{ untuk mencari } s" },
      { label: "b.", text: "Tentukan luas permukaan kubus tersebut." },
      { label: "c.", text: "Tentukan volume kubus tersebut." },
    ],
  }),
  Qn(4, "Bidang Diagonal Kubus", {
    type: "mixed",
    content: "Perhatikan kubus ABCD.EFGH berikut (ABCD = sisi alas, EFGH = sisi atap):",
    diagram: <DiagonalBidangQ3SVG />,
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan bidang diagonal kubus?" },
      { label: "b.", text: "Ada berapa banyak bidang diagonal pada sebuah kubus ABCD.EFGH? Sebutkan semuanya!" },
      { label: "c.", math: "\\text{Jika rusuk kubus } s = 8 \\text{ cm, hitung luas bidang diagonal ABGH.}" },
    ],
  }),
  Qn(5, "Luas Permukaan Kubus – Dasar", {
    type: "mixed",
    content: "Rumus luas permukaan kubus dengan panjang rusuk s adalah:",
    diagram: <CubeSVG label={false} />,
    parts: [
      { label: "a.", math: "\\text{Hitung luas permukaan kubus dengan } s = 5 \\text{ cm}" },
      { label: "b.", math: "\\text{Hitung luas permukaan kubus dengan } s = 10 \\text{ cm}" },
      { label: "c.", math: "\\text{Hitung luas permukaan kubus dengan } s = \\frac{1}{2} \\text{ m}" },
    ],
  }),
  Qn(6, "Mencari Rusuk dari Luas Permukaan", {
    type: "mixed",
    content: "Luas permukaan sebuah kubus diketahui. Tentukan panjang rusuknya!",
    parts: [
      { label: "a.", math: "L = 216 \\text{ cm}^2 \\Rightarrow s = \\ldots" },
      { label: "b.", math: "L = 384 \\text{ cm}^2 \\Rightarrow s = \\ldots" },
      { label: "c.", math: "L = 600 \\text{ cm}^2 \\Rightarrow s = \\ldots" },
    ],
  }),
  Qn(7, "Volume Kubus – Dasar", {
    type: "mixed",
    content: "Rumus volume kubus dengan panjang rusuk s adalah:",
    parts: [
      { label: "a.", math: "V = \\ldots \\text{ jika } s = 4 \\text{ cm}" },
      { label: "b.", math: "V = \\ldots \\text{ jika } s = 7 \\text{ cm}" },
      { label: "c.", math: "V = \\ldots \\text{ jika } s = 1{,}5 \\text{ m}" },
    ],
  }),
  Qn(8, "Jaring-Jaring Kubus", {
    type: "mixed",
    content: "Perhatikan jaring-jaring kubus berikut:",
    diagram: <CubeNetSVG />,
    parts: [
      { label: "a.", text: "Ada berapa persegi yang membentuk jaring-jaring kubus?" },
      { label: "b.", text: "Apakah semua susunan 6 persegi merupakan jaring-jaring kubus? Jelaskan!" },
      { label: "c.", text: "Ada berapa kemungkinan bentuk jaring-jaring kubus yang berbeda?" },
    ],
  }),
  Qn(9, "Identifikasi Jaring-Jaring Kubus", {
    type: "mixed",
    content: "Perhatikan gambar berbagai susunan enam persegi di bawah ini! Tentukan mana saja yang merupakan jaring-jaring kubus. Berikan alasanmu!",
    diagram: <JaringJaringSVG />,
    parts: [],
  }),
  Qn(10, "Kubus dari Kawat – Kontekstual", {
    type: "mixed",
    content: "Sebuah kerangka kubus dibuat dari kawat dengan panjang rusuk 15 cm.",
    parts: [
      { label: "a.", text: "Ada berapa rusuk pada sebuah kubus?" },
      { label: "b.", text: "Berapa panjang kawat yang dibutuhkan untuk membuat kerangka tersebut?" },
      { label: "c.", text: "Jika kawat dijual per meter seharga Rp3.000, berapa biaya yang diperlukan?" },
    ],
  }),
  Qn(11, "Soal Kontekstual – Kubus dan Cat", {
    type: "mixed",
    content: "Pak Budi memiliki kubus kayu dengan rusuk 20 cm. Ia ingin mengecat semua permukaannya kecuali atap. Setiap 400 cm² membutuhkan satu kaleng cat kecil seharga Rp5.000.",
    parts: [
      { label: "a.", text: "Hitung luas permukaan yang akan dicat (5 sisi)." },
      { label: "b.", text: "Berapa kaleng cat yang dibutuhkan?" },
      { label: "c.", text: "Berapa total biaya pengecatan?" },
    ],
  }),
  Qn(12, "Volume Kubus – Soal Cerita ANBK", {
    type: "mixed",
    content: "Sebuah bak mandi berbentuk kubus dengan panjang rusuk 80 cm diisi air hingga penuh.",
    parts: [
      { label: "a.", math: "\\text{Hitung volume bak dalam cm}^3" },
      { label: "b.", math: "\\text{Nyatakan volume dalam liter } (1 \\text{ liter} = 1000 \\text{ cm}^3)" },
      { label: "c.", text: "Jika air mengalir dengan kecepatan 8 liter/menit, berapa menit waktu yang dibutuhkan?" },
    ],
  }),
  Qn(13, "Memotong Kubus – Soal ANBK", {
    type: "mixed",
    content: "Sebuah kubus besar dengan rusuk 12 cm dipotong-potong menjadi kubus-kubus kecil dengan rusuk 3 cm.",
    parts: [
      { label: "a.", text: "Berapa banyak kubus kecil yang dihasilkan?" },
      { label: "b.", text: "Hitung total luas permukaan seluruh kubus kecil." },
      { label: "c.", text: "Berapa kali total luas permukaan kubus kecil dibanding luas permukaan kubus besar?" },
    ],
  }),
  Qn(14, "Luas Permukaan – Soal Cerita UN", {
    type: "mixed",
    content: "Sebuah dus berbentuk kubus terbuat dari karton. Panjang rusuknya 30 cm. Sebuah pabrik membuat 500 dus seperti itu.",
    parts: [
      { label: "a.", text: "Hitung luas permukaan satu dus." },
      { label: "b.", text: "Hitung total luas karton yang dibutuhkan untuk 500 dus." },
      { label: "c.", math: "\\text{Nyatakan total luas dalam m}^2 \\text{ } (1 \\text{ m}^2 = 10.000 \\text{ cm}^2)" },
    ],
  }),
  Qn(15, "Soal UN – Mengubah Dimensi Kubus", {
    type: "mixed",
    content: "Panjang rusuk sebuah kubus diperbesar 3 kali lipat.",
    parts: [
      { label: "a.", math: "\\text{Berapa kali lipat luas permukaannya bertambah?}" },
      { label: "b.", math: "\\text{Berapa kali lipat volumenya bertambah?}" },
      { label: "c.", math: "\\text{Jika rusuk awal 4 cm, tentukan luas permukaan dan volume kubus baru.}" },
    ],
  }),
];

const KubusPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-sky-500/20 border-2 border-sky-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🧊</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-sky-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(56,189,248,0.7)' }}>
            KUBUS
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Bangun Ruang Sisi Datar · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 rounded-lg px-4 py-2">
            <span className="text-sky-400 text-xs font-bold">📋 15 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-sky-900/20 border border-sky-500/20 rounded-xl p-4">
          <p className="text-sky-300 text-xs font-bold mb-3">📐 Rumus-Rumus Penting Kubus</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {[
              { name: "Luas Permukaan", math: "L = 6s^2" },
              { name: "Volume", math: "V = s^3" },
              { name: "Diagonal Sisi", math: "d_s = s\\sqrt{2}" },
              { name: "Diagonal Ruang", math: "d_r = s\\sqrt{3}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-sky-300"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
          <div className="mt-2 bg-white/5 rounded-lg px-3 py-2">
            <div className="text-white/40 text-[9px] uppercase mb-1">Jumlah Unsur</div>
            <p className="text-white/70 text-xs">8 titik sudut · 12 rusuk · 6 sisi · 12 diagonal sisi · 4 diagonal ruang · 6 bidang diagonal</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 via-slate-900/80 to-cyan-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-sky-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-400 to-cyan-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/50 flex items-center justify-center shrink-0">
                    <span className="text-sky-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sky-400 text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && (
                      <div className="mb-3 bg-sky-900/20 border border-sky-500/20 rounded-lg px-4 py-3 flex justify-center">
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-sky-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80">{p.text}</p>
                            }
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar"); }}
            className="text-sm text-muted-foreground hover:text-sky-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Bangun Ruang Sisi Datar
          </button>
        </div>
      </div>
    </div>
  );
};

export default KubusPage;
