import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; mathContent?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  type: "essay" | "mixed";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

// ABCD.EFGH convention: ABCD = alas (bawah), EFGH = atap (atas)
const BalokSVG = ({ wide = false }: { wide?: boolean }) => {
  const W = wide ? 130 : 90;
  const H = 60;
  const D = 30;
  return (
    <svg width={W + D + 40} height={H + D + 20} viewBox={`0 0 ${W + D + 40} ${H + D + 20}`} className="mx-auto">
      <defs>
        <linearGradient id="bFront" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="bTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="bRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <polygon points={`15,${H+D} ${W+15},${H+D} ${W+15},${D} 15,${D}`} fill="url(#bFront)" stroke="#34d399" strokeWidth="1.8" />
      <polygon points={`15,${D} ${W+15},${D} ${W+D+15},10 ${D+15},10`} fill="url(#bTop)" stroke="#34d399" strokeWidth="1.8" />
      <polygon points={`${W+15},${D} ${W+D+15},10 ${W+D+15},${H+10} ${W+15},${H+D}`} fill="url(#bRight)" stroke="#34d399" strokeWidth="1.8" />
      <line x1="15" y1={H+D} x2={D+15} y2={H+10} stroke="#34d399" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
      <line x1={D+15} y1={H+10} x2={W+D+15} y2={H+10} stroke="#34d399" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
      <line x1={D+15} y1={H+10} x2={D+15} y2="10" stroke="#34d399" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
      <text x="2"        y={H+D+4}  fill="var(--icon-color)" fontSize="10" fontFamily="monospace">A</text>
      <text x={W+17}     y={H+D+4}  fill="var(--icon-color)" fontSize="10" fontFamily="monospace">B</text>
      <text x={W+D+17}   y={H+12}   fill="var(--icon-color)" fontSize="10" fontFamily="monospace">C</text>
      <text x={D+16}     y={H+12}   fill="var(--icon-color)" fontSize="10" fontFamily="monospace">D</text>
      <text x="2"        y={D-2}    fill="var(--icon-color)" fontSize="10" fontFamily="monospace">E</text>
      <text x={W+17}     y={D-2}    fill="var(--icon-color)" fontSize="10" fontFamily="monospace">F</text>
      <text x={W+D+17}   y="8"      fill="var(--icon-color)" fontSize="10" fontFamily="monospace">G</text>
      <text x={D+16}     y="8"      fill="var(--icon-color)" fontSize="10" fontFamily="monospace">H</text>
    </svg>
  );
};

const BalokNetSVG = ({ p = 8, l = 5, t = 3 }: { p?: number; l?: number; t?: number }) => {
  const scale = 8;
  const pp = p * scale, ll = l * scale, tt = t * scale;
  const W = 2*ll + 2*pp + ll;
  const H = 2*tt + ll;
  return (
    <svg width={Math.min(W, 240)} height={Math.min(H, 160)} viewBox={`0 0 ${W} ${H}`} className="mx-auto" style={{maxWidth: 240}}>
      {[
        { x: 0, y: tt, w: ll, h: ll, label: "kiri" },
        { x: ll, y: 0, w: pp, h: tt, label: "bawah" },
        { x: ll, y: tt, w: pp, h: ll, label: "depan" },
        { x: ll, y: tt+ll, w: pp, h: tt, label: "atas" },
        { x: ll+pp, y: tt, w: ll, h: ll, label: "kanan" },
        { x: ll+pp+ll, y: tt, w: pp, h: ll, label: "belakang" },
      ].map((r, i) => (
        <g key={i}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h}
            fill="#10b981" fillOpacity={0.15 + i*0.04} stroke="#34d399" strokeWidth="1.5" rx="1" />
          <text x={r.x + r.w/2} y={r.y + r.h/2 + 4} fill="#6ee7b7" fontSize="9" textAnchor="middle">{r.label}</text>
        </g>
      ))}
    </svg>
  );
};

const DiagonalBalokSVG = () => (
  <svg width="180" height="130" viewBox="0 0 180 130" className="mx-auto">
    <polygon points="15,105 115,105 115,45 15,45" fill="#10b981" fillOpacity="0.25" stroke="#34d399" strokeWidth="1.5" />
    <polygon points="15,45 115,45 150,15 50,15" fill="#10b981" fillOpacity="0.4" stroke="#34d399" strokeWidth="1.5" />
    <polygon points="115,45 150,15 150,75 115,105" fill="#10b981" fillOpacity="0.15" stroke="#34d399" strokeWidth="1.5" />
    <line x1="15" y1="105" x2="50" y2="75" stroke="#34d399" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="50" y1="75" x2="150" y2="75" stroke="#34d399" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="50" y1="75" x2="50" y2="15" stroke="#34d399" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="15" y1="105" x2="150" y2="15" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,3" />
    <line x1="15" y1="105" x2="115" y2="45" stroke="#f472b6" strokeWidth="1.5" />
    <text x="70" y="125" fill="#f59e0b" fontSize="9" textAnchor="middle">diagonal ruang</text>
    <text x="50" y="80" fill="#f472b6" fontSize="9" textAnchor="middle">d sisi</text>
    <text x="2"   y="110" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">A</text>
    <text x="117" y="110" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">B</text>
    <text x="152" y="77"  fill="var(--icon-color)" fontSize="10" fontFamily="monospace">C</text>
    <text x="42"  y="77"  fill="var(--icon-color)" fontSize="10" fontFamily="monospace">D</text>
    <text x="2"   y="43"  fill="var(--icon-color)" fontSize="10" fontFamily="monospace">E</text>
    <text x="117" y="43"  fill="var(--icon-color)" fontSize="10" fontFamily="monospace">F</text>
    <text x="152" y="13"  fill="var(--icon-color)" fontSize="10" fontFamily="monospace">G</text>
    <text x="42"  y="13"  fill="var(--icon-color)" fontSize="10" fontFamily="monospace">H</text>
  </svg>
);

// Jaring-jaring balok — 4 pola (2 valid, 2 invalid)
// Dimensi: p=30, l=20, t=12 (piksel)
const IdentifikasiJaringBalokSVG = () => {
  const p = 30, l = 20, t = 12;
  const R = (x: number, y: number, w: number, h: number, op: number, key: string) => (
    <rect key={key} x={x} y={y} width={w} height={h}
      fill="#10b981" fillOpacity={op} stroke="#34d399" strokeWidth="1.2" rx="1" />
  );
  // Panel offsets
  const p1x = 5,   p1y = 20;
  const p2x = 130, p2y = 20;
  const p3x = 5,   p3y = 155;
  const p4x = 130, p4y = 155;

  return (
    <svg viewBox="0 0 250 280" className="w-full max-w-xs mx-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Panel labels */}
      <text x="45"  y="14" fill="#94a3b8" fontSize="12" textAnchor="middle" fontFamily="sans-serif">(1)</text>
      <text x="175" y="14" fill="#94a3b8" fontSize="12" textAnchor="middle" fontFamily="sans-serif">(2)</text>
      <text x="45"  y="149" fill="#94a3b8" fontSize="12" textAnchor="middle" fontFamily="sans-serif">(3)</text>
      <text x="175" y="149" fill="#94a3b8" fontSize="12" textAnchor="middle" fontFamily="sans-serif">(4)</text>

      {/* Divider lines */}
      <line x1="5" y1="132" x2="245" y2="132" stroke="#334155" strokeWidth="1" strokeDasharray="4,3" />
      <line x1="120" y1="10" x2="120" y2="270" stroke="#334155" strokeWidth="1" strokeDasharray="4,3" />

      {/* ── PANEL 1 (VALID) – Salib / cross ── */}
      {/* depan p×t */}
      {R(p1x+l, p1y,     p, t, 0.20, 'p1-depan')}
      {/* kiri l×t */}
      {R(p1x,   p1y+t,   l, t, 0.30, 'p1-kiri')}
      {/* alas p×l */}
      {R(p1x+l, p1y+t,   p, l, 0.45, 'p1-alas')}
      {/* kanan l×t */}
      {R(p1x+l+p, p1y+t, l, t, 0.30, 'p1-kanan')}
      {/* tutup p×l */}
      {R(p1x+l, p1y+t+l, p, l, 0.35, 'p1-tutup')}
      {/* belakang p×t */}
      {R(p1x+l, p1y+t+l+l, p, t, 0.20, 'p1-belakang')}

      {/* ── PANEL 2 (VALID) – 4 sejajar + 2 di bawah ── */}
      {/* kiri l×t */}
      {R(p2x,       p2y,   l, t, 0.30, 'p2-kiri')}
      {/* depan p×t */}
      {R(p2x+l,     p2y,   p, t, 0.20, 'p2-depan')}
      {/* kanan l×t */}
      {R(p2x+l+p,   p2y,   l, t, 0.30, 'p2-kanan')}
      {/* belakang p×t */}
      {R(p2x+l+p+l, p2y,   p, t, 0.20, 'p2-belakang')}
      {/* alas p×l */}
      {R(p2x+l,     p2y+t, p, l, 0.45, 'p2-alas')}
      {/* tutup p×l */}
      {R(p2x+l,     p2y+t+l, p, l, 0.35, 'p2-tutup')}

      {/* ── PANEL 3 (INVALID) – hanya 5 sisi, tutup tidak ada ── */}
      {/* depan p×t */}
      {R(p3x+l, p3y,     p, t, 0.20, 'p3-depan')}
      {/* kiri l×t */}
      {R(p3x,   p3y+t,   l, t, 0.30, 'p3-kiri')}
      {/* alas p×l */}
      {R(p3x+l, p3y+t,   p, l, 0.45, 'p3-alas')}
      {/* kanan l×t */}
      {R(p3x+l+p, p3y+t, l, t, 0.30, 'p3-kanan')}
      {/* belakang p×t */}
      {R(p3x+l, p3y+t+l, p, t, 0.20, 'p3-belakang')}
      {/* tutup HILANG → hanya 5 sisi */}
      <text x={p3x+l+p/2} y={p3y+t+l+t+12} fill="#f87171" fontSize="8" textAnchor="middle" fontFamily="sans-serif">?</text>

      {/* ── PANEL 4 (INVALID) – satu sisi terpisah ── */}
      {/* depan p×t */}
      {R(p4x+l, p4y,     p, t, 0.20, 'p4-depan')}
      {/* kiri l×t */}
      {R(p4x,   p4y+t,   l, t, 0.30, 'p4-kiri')}
      {/* alas p×l */}
      {R(p4x+l, p4y+t,   p, l, 0.45, 'p4-alas')}
      {/* kanan l×t */}
      {R(p4x+l+p, p4y+t, l, t, 0.30, 'p4-kanan')}
      {/* tutup p×l */}
      {R(p4x+l, p4y+t+l, p, l, 0.35, 'p4-tutup')}
      {/* belakang TERPISAH (tidak terhubung) */}
      {R(p4x+l+p+l+6, p4y+t+l+l, p, t, 0.20, 'p4-belakang-separated')}
      <line x1={p4x+l+p+l+2} y1={p4y+t+l+l+t/2} x2={p4x+l+p+l+5} y2={p4y+t+l+l+t/2}
        stroke="#f87171" strokeWidth="1" strokeDasharray="2,2" />
    </svg>
  );
};

const questions: Q[] = [
  Qn(1, "Unsur-Unsur Balok", {
    type: "mixed",
    content: "Perhatikan balok ABCD.EFGH berikut (ABCD = sisi alas/bawah, EFGH = sisi atap/atas):",
    diagram: <BalokSVG />,
    parts: [
      { label: "a.", text: "Sebutkan semua rusuk balok ABCD.EFGH beserta jumlahnya!" },
      { label: "b.", text: "Ada berapa titik sudut dan sisi pada balok? Sebutkan semuanya." },
      { label: "c.", text: "Sebutkan pasangan-pasangan sisi yang sejajar pada balok." },
      { label: "d.", text: "Sebutkan semua diagonal bidang (diagonal sisi) balok ABCD.EFGH beserta jumlahnya!" },
      { label: "e.", text: "Sebutkan semua diagonal ruang balok ABCD.EFGH beserta jumlahnya!" },
      { label: "f.", text: "Sebutkan semua bidang diagonal balok ABCD.EFGH beserta jumlahnya!" },
    ],
  }),
  Qn(2, "Perbedaan Balok dan Kubus", {
    type: "mixed",
    content: "Balok ABCD.EFGH memiliki panjang p, lebar l, dan tinggi t (ABCD = sisi alas/bawah, EFGH = sisi atap/atas).",
    diagram: <BalokSVG />,
    parts: [
      { label: "a.", text: "Apa perbedaan utama antara balok dan kubus?" },
      { label: "b.", text: "Apakah kubus termasuk balok? Jelaskan alasanmu!" },
      { label: "c.", text: "Pada balok, kelompok rusuk mana saja yang memiliki panjang sama?" },
    ],
  }),
  Qn(3, "Luas Permukaan Balok – Dasar", {
    type: "mixed",
    content: "Rumus luas permukaan balok ABCD.EFGH dengan panjang p, lebar l, dan tinggi t (ABCD = sisi alas/bawah, EFGH = sisi atap/atas):",
    mathContent: "L = 2(pl + pt + lt)",
    diagram: <BalokSVG />,
    parts: [
      { label: "a.", math: "\\text{Hitung L jika } p=8, l=5, t=3 \\text{ (cm)}" },
      { label: "b.", math: "\\text{Hitung L jika } p=12, l=8, t=6 \\text{ (cm)}" },
      { label: "c.", math: "\\text{Hitung L jika } p=10, l=10, t=5 \\text{ (cm)}" },
    ],
  }),
  Qn(4, "Diagonal Sisi dan Diagonal Ruang Balok", {
    type: "mixed",
    content: "Perhatikan balok ABCD.EFGH dengan panjang 12 cm, lebar 5 cm, dan tinggi 4 cm.",
    diagram: <DiagonalBalokSVG />,
    parts: [
      { label: "a.", math: "\\text{Hitung diagonal sisi pada bidang ABCD (diagonal } AC\\text{)}" },
      { label: "b.", math: "\\text{Hitung diagonal ruang } AG = \\sqrt{p^2 + l^2 + t^2}" },
    ],
  }),
  Qn(5, "Identifikasi Jaring-Jaring Balok", {
    type: "mixed",
    content: "Perhatikan empat susunan persegi panjang berikut. Tentukan mana saja yang merupakan jaring-jaring balok dan berikan alasanmu!",
    diagram: <IdentifikasiJaringBalokSVG />,
    parts: [
      { label: "a.", text: "Manakah di antara pola (1), (2), (3), (4) yang merupakan jaring-jaring balok?" },
      { label: "b.", text: "Jelaskan mengapa pola yang tidak valid bukan merupakan jaring-jaring balok!" },
      { label: "c.", text: "Berapa banyak sisi yang harus dimiliki jaring-jaring balok? Sebutkan ukuran setiap sisinya!" },
    ],
  }),
  Qn(6, "Mencari Dimensi Balok dari Luas Permukaan – UN Style", {
    type: "mixed",
    content: "Sebuah balok memiliki panjang 10 cm dan lebar 6 cm. Luas permukaannya adalah 376 cm².",
    parts: [
      { label: "a.", math: "\\text{Gunakan } L = 2(pl + pt + lt) \\text{ untuk mencari tinggi } t" },
      { label: "b.", text: "Hitung volume balok tersebut." },
      { label: "c.", math: "\\text{Hitung panjang diagonal ruang balok}" },
    ],
  }),
  Qn(7, "Soal Cerita – Kolam Renang ANBK", {
    type: "mixed",
    content: "Sebuah kolam renang berbentuk balok memiliki panjang 25 m, lebar 12 m, dan kedalaman 2 m.",
    parts: [
      { label: "a.", math: "\\text{Hitung volume kolam dalam m}^3" },
      { label: "b.", math: "\\text{Konversikan volume ke liter } (1 \\text{ m}^3 = 1000 \\text{ liter})" },
      { label: "c.", text: "Jika kolam hanya diisi setinggi 1,5 m, berapa volume air yang dibutuhkan?" },
    ],
  }),
  Qn(8, "Perbandingan Volume dan Luas Permukaan Dua Balok", {
    type: "mixed",
    content: "Balok A berukuran 6×4×3 cm dan Balok B berukuran 12×8×6 cm.",
    parts: [
      { label: "a.", text: "Hitung volume Balok A dan Balok B." },
      { label: "b.", math: "\\text{Tentukan perbandingan volume A : B}" },
      { label: "c.", math: "\\text{Tentukan perbandingan luas permukaan A : B}" },
    ],
  }),
  Qn(9, "Soal Cerita – Dus Kardus", {
    type: "mixed",
    content: "Sebuah pabrik membuat kardus berbentuk balok berukuran 30 cm × 20 cm × 15 cm.",
    parts: [
      { label: "a.", text: "Hitung luas karton yang dibutuhkan untuk satu kardus (luas permukaan)." },
      { label: "b.", text: "Jika karton dijual per lembar ukuran 1 m × 1 m, berapa lembar yang dibutuhkan untuk 100 kardus?" },
      { label: "c.", text: "Hitung volume setiap kardus." },
    ],
  }),
  Qn(10, "Mengisi Balok dengan Kubus Kecil – TKA", {
    type: "mixed",
    content: "Sebuah kotak berbentuk balok berukuran 30 cm × 20 cm × 15 cm akan diisi dengan kubus-kubus kecil berrusuk 5 cm.",
    parts: [
      { label: "a.", math: "\\text{Berapa kubus kecil yang muat di sepanjang panjang, lebar, dan tinggi?}" },
      { label: "b.", text: "Berapa total kubus kecil yang muat di dalam kotak tersebut?" },
    ],
  }),
  Qn(11, "Mencari Dimensi dari Total Rusuk – UN", {
    type: "mixed",
    content: "Total panjang semua rusuk sebuah balok adalah 72 cm. Perbandingan p : l : t = 3 : 2 : 1.",
    parts: [
      { label: "a.", math: "\\text{Dari } 4(p + l + t) = 72 \\text{ dan perbandingan, tentukan } p, l, t" },
      { label: "b.", text: "Hitung luas permukaan balok." },
      { label: "c.", text: "Hitung volume balok." },
    ],
  }),
  Qn(12, "Luas Permukaan – Soal Cerita Tembok", {
    type: "mixed",
    content: "Sebuah ruangan berbentuk balok berukuran 8 m × 6 m × 3 m. Dindingnya akan dicat.",
    parts: [
      { label: "a.", text: "Hitung luas seluruh dinding (4 dinding, tanpa lantai dan langit-langit)." },
      { label: "b.", text: "Jika 1 kaleng cat cukup untuk 20 m², berapa kaleng yang dibutuhkan?" },
      { label: "c.", text: "Hitung volume ruangan tersebut." },
    ],
  }),
  Qn(13, "Soal Kerangka Balok dari Kawat", {
    type: "mixed",
    content: "Seutas kawat sepanjang 10 m akan dibuat kerangka balok dengan ukuran panjang 12 cm, lebar 8 cm, dan tinggi 6 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung panjang kawat yang dibutuhkan untuk satu kerangka balok: } 4(p + l + t)" },
      { label: "b.", text: "Tentukan berapa banyak kerangka balok yang dapat dibuat dari kawat tersebut." },
      { label: "c.", text: "Tentukan panjang sisa kawat yang tidak terpakai (dalam cm)." },
    ],
  }),
  Qn(14, "Soal UN – Luas Permukaan Tanpa Alas dan Tutup", {
    type: "mixed",
    content: "Sebuah aquarium berbentuk balok berukuran 50 cm × 30 cm × 40 cm tanpa tutup.",
    parts: [
      { label: "a.", text: "Hitung luas 4 dinding aquarium (tanpa alas dan tutup)." },
      { label: "b.", text: "Hitung luas alas aquarium." },
      { label: "c.", text: "Hitung luas total 5 sisi (tanpa tutup saja)." },
    ],
  }),
  Qn(15, "Soal Gabungan – Balok dan Perbandingan", {
    type: "mixed",
    content: "Sebuah balok memiliki perbandingan panjang : lebar : tinggi = 5 : 3 : 2. Luas permukaannya adalah 620 cm².",
    parts: [
      { label: "a.", math: "\\text{Misalkan } p = 5k, l = 3k, t = 2k. \\text{ Substitusikan ke rumus luas permukaan.}" },
      { label: "b.", math: "\\text{Selesaikan untuk } k, \\text{ lalu tentukan } p, l, t." },
      { label: "c.", text: "Hitung volume balok tersebut." },
    ],
  }),
];

const BalokPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">📦</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(52,211,153,0.7)' }}>
            BALOK
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Bangun Ruang Sisi Datar · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 15 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-3">📐 Rumus-Rumus Penting Balok</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {[
              { name: "Luas Permukaan", math: "L = 2(pl + pt + lt)" },
              { name: "Volume", math: "V = p \\times l \\times t" },
              { name: "Diagonal Ruang", math: "d = \\sqrt{p^2 + l^2 + t^2}" },
              { name: "Total Rusuk", math: "4(p + l + t)" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-emerald-300 overflow-x-auto"><InlineMath math={r.math} /></div>
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
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
                    <span className="text-emerald-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && (
                      <div className="mb-3 bg-emerald-900/20 border border-emerald-500/20 rounded-lg px-4 py-3 flex justify-center">
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-emerald-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
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
            className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Bangun Ruang Sisi Datar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalokPage;
