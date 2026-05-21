import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Percent } from "lucide-react";
import { TriangleAltitude, RightTriangleRatio, SimilarTriangles } from "./GeoFigure";

type Part = { label: string; math?: string; text?: string; diagram?: React.ReactNode };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string; options?: { label: string; text: string }[] };
const Qn = (n: number, title: string, rest: Omit<Q,"n"|"title">): Q => ({ n, title, ...rest });

const SvgQ1 = () => (
  <svg width={220} height={148} viewBox="0 0 220 148" style={{display:'block'}}>
    <rect width="220" height="148" fill="rgba(2,8,23,0.85)" rx="12"/>
    <line x1="28" y1="125" x2="192" y2="125" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="28" y1="125" x2="28" y2="18" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="28" y1="18" x2="192" y2="125" stroke="#34d399" strokeWidth="1.8"/>
    <rect x="28" y="117" width="8" height="8" fill="none" stroke="#34d399" strokeWidth="1.2"/>
    <line x1="28" y1="125" x2="77" y2="50" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="4,3"/>
    <polyline points="74,55 79,58 82,53" fill="none" stroke="#6ee7b7" strokeWidth="1.2"/>
    <text x="28" y="13" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">C</text>
    <text x="18" y="142" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>
    <text x="200" y="140" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">B</text>
    <text x="88" y="48" fill="#6ee7b7" fontSize="11" fontWeight="bold" textAnchor="start">D</text>
  </svg>
);

const SvgQ2 = () => (
  <svg width={220} height={148} viewBox="0 0 220 148" style={{display:'block'}}>
    <rect width="220" height="148" fill="rgba(2,8,23,0.85)" rx="12"/>
    <line x1="28" y1="22" x2="165" y2="22" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="28" y1="22" x2="28" y2="118" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="165" y1="22" x2="28" y2="118" stroke="#34d399" strokeWidth="1.8"/>
    <rect x="28" y="22" width="8" height="8" fill="none" stroke="#34d399" strokeWidth="1.2"/>
    <line x1="28" y1="22" x2="71" y2="83" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="4,3"/>
    <polyline points="68,78 63,82 67,87" fill="none" stroke="#6ee7b7" strokeWidth="1.2"/>
    <text x="18" y="16" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>
    <text x="175" y="16" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">B</text>
    <text x="18" y="133" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">C</text>
    <text x="78" y="80" fill="#6ee7b7" fontSize="11" fontWeight="bold" textAnchor="start">D</text>
    <text x="97" y="17" fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">AB = 12 cm</text>
    <text x="106" y="72" fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">BC = 15 cm</text>
  </svg>
);

const SvgQ3 = () => (
  <svg width={220} height={148} viewBox="0 0 220 148" style={{display:'block'}}>
    <rect width="220" height="148" fill="rgba(2,8,23,0.85)" rx="12"/>
    <line x1="28" y1="125" x2="192" y2="125" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="28" y1="125" x2="28" y2="18" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="28" y1="18" x2="192" y2="125" stroke="#34d399" strokeWidth="1.8"/>
    <rect x="28" y="117" width="8" height="8" fill="none" stroke="#34d399" strokeWidth="1.2"/>
    <line x1="28" y1="125" x2="77" y2="50" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="4,3"/>
    <polyline points="74,55 79,58 82,53" fill="none" stroke="#6ee7b7" strokeWidth="1.2"/>
    <text x="28" y="13" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">C</text>
    <text x="18" y="142" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>
    <text x="200" y="140" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">B</text>
    <text x="88" y="48" fill="#6ee7b7" fontSize="11" fontWeight="bold" textAnchor="start">D</text>
    <text x="42" y="38" fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="start">CD = 12 cm</text>
    <text x="142" y="98" fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="start">DB = 3 cm</text>
  </svg>
);

const SvgQ4 = () => (
  <svg width={220} height={148} viewBox="0 0 220 148" style={{display:'block'}}>
    <rect width="220" height="148" fill="rgba(2,8,23,0.85)" rx="12"/>
    <line x1="28" y1="125" x2="192" y2="125" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="28" y1="125" x2="28" y2="18" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="28" y1="18" x2="192" y2="125" stroke="#34d399" strokeWidth="1.8"/>
    <rect x="28" y="117" width="8" height="8" fill="none" stroke="#34d399" strokeWidth="1.2"/>
    <line x1="28" y1="125" x2="77" y2="50" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="4,3"/>
    <polyline points="74,55 79,58 82,53" fill="none" stroke="#6ee7b7" strokeWidth="1.2"/>
    <text x="28" y="13" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">C</text>
    <text x="18" y="142" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>
    <text x="200" y="140" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">B</text>
    <text x="88" y="48" fill="#6ee7b7" fontSize="11" fontWeight="bold" textAnchor="start">D</text>
    <text x="43" y="37" fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="start">5 cm</text>
    <text x="140" y="99" fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="start">4 cm</text>
  </svg>
);

const SvgQ5a = () => (
  <svg width={200} height={130} viewBox="0 0 200 130" style={{display:'block'}}>
    <rect width="200" height="130" fill="rgba(2,8,23,0.85)" rx="8"/>
    <line x1="15" y1="112" x2="175" y2="112" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="15" y1="112" x2="80" y2="15" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="80" y1="15" x2="175" y2="112" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="80" y1="15" x2="80" y2="112" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="4,3"/>
    <rect x="72" y="104" width="8" height="8" fill="none" stroke="#6ee7b7" strokeWidth="1.2"/>
    <text x="80" y="10" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">C</text>
    <text x="8" y="125" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">A</text>
    <text x="183" y="125" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">B</text>
    <text x="80" y="125" fill="#6ee7b7" fontSize="10" fontWeight="bold" textAnchor="middle">D</text>
    <text x="54" y="63" fill="rgba(255,255,255,0.75)" fontSize="10" textAnchor="middle">18 cm</text>
    <text x="140" y="115" fill="rgba(255,255,255,0.75)" fontSize="10" textAnchor="middle">6 cm</text>
    <text x="40" y="115" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">p</text>
  </svg>
);

const SvgQ5b = () => (
  <svg width={200} height={130} viewBox="0 0 200 130" style={{display:'block'}}>
    <rect width="200" height="130" fill="rgba(2,8,23,0.85)" rx="8"/>
    <line x1="20" y1="112" x2="175" y2="112" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="20" y1="112" x2="85" y2="18" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="85" y1="18" x2="175" y2="112" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="85" y1="18" x2="85" y2="112" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3"/>
    <rect x="77" y="104" width="8" height="8" fill="none" stroke="#fbbf24" strokeWidth="1.2"/>
    <text x="85" y="13" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">G</text>
    <text x="12" y="125" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">E</text>
    <text x="183" y="125" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">F</text>
    <text x="85" y="125" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">H</text>
    <text x="52" y="115" fill="rgba(255,255,255,0.75)" fontSize="10" textAnchor="middle">4 cm</text>
    <text x="130" y="115" fill="rgba(255,255,255,0.75)" fontSize="10" textAnchor="middle">5 cm</text>
    <text x="62" y="68" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">p</text>
  </svg>
);

const SvgQ5c = () => (
  <svg width={200} height={110} viewBox="0 0 200 110" style={{display:'block'}}>
    <rect width="200" height="110" fill="rgba(2,8,23,0.85)" rx="8"/>
    <line x1="15" y1="95" x2="185" y2="95" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="15" y1="95" x2="48" y2="18" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="48" y1="18" x2="185" y2="95" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="48" y1="18" x2="48" y2="95" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3"/>
    <rect x="40" y="87" width="8" height="8" fill="none" stroke="#fbbf24" strokeWidth="1.2"/>
    <text x="48" y="13" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">L</text>
    <text x="8" y="106" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">K</text>
    <text x="192" y="106" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">M</text>
    <text x="48" y="107" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">N</text>
    <text x="30" y="98" fill="rgba(255,255,255,0.75)" fontSize="9" textAnchor="middle">4 cm</text>
    <text x="118" y="104" fill="rgba(255,255,255,0.75)" fontSize="9" textAnchor="middle">25 cm</text>
    <text x="60" y="60" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="start">p</text>
  </svg>
);

const SvgQ5d = () => (
  <svg width={200} height={130} viewBox="0 0 200 130" style={{display:'block'}}>
    <rect width="200" height="130" fill="rgba(2,8,23,0.85)" rx="8"/>
    <line x1="28" y1="112" x2="175" y2="112" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="28" y1="112" x2="28" y2="18" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="28" y1="18" x2="175" y2="112" stroke="#34d399" strokeWidth="1.8"/>
    <rect x="28" y="104" width="8" height="8" fill="none" stroke="#34d399" strokeWidth="1.2"/>
    {/* U on hypotenuse TS, RU ⊥ TS */}
    {/* T=(28,18), S=(175,112): dir=(147,94), |TS|²=147²+94²=21609+8836=30445 */}
    {/* TU: t = TR²/TS² * TS = 81/225 of TS, US = RS²/TS² * TS */}
    {/* Let TR=9, RS=12, TS=15. TU/TS = TR²/TS² ... */}
    {/* TU = TR²/TS = 81/15 = 5.4, so t_U = 5.4/15 = 0.36 */}
    {/* U = T + 0.36*(S-T) = (28+0.36*147, 18+0.36*94) = (81,52) */}
    {/* RU ⊥ TS: from R=(28,112) to U=(81,52) */}
    <line x1="28" y1="112" x2="81" y2="52" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="4,3"/>
    <polyline points="78,57 83,60 86,55" fill="none" stroke="#6ee7b7" strokeWidth="1.2"/>
    <text x="28" y="13" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">T</text>
    <text x="18" y="125" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">R</text>
    <text x="183" y="125" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">S</text>
    <text x="90" y="50" fill="#6ee7b7" fontSize="11" fontWeight="bold" textAnchor="start">U</text>
    <text x="18" y="68" fill="rgba(255,255,255,0.75)" fontSize="10" textAnchor="middle">9 cm</text>
    <text x="102" y="124" fill="rgba(255,255,255,0.75)" fontSize="10" textAnchor="middle">12 cm</text>
    <text x="142" y="82" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">p</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Garis Tinggi dari Sudut Siku-Siku", {
    type: "mixed",
    diagram: <TriangleAltitude labelTop="C" labelBotL="A" labelBotR="B" labelMid="H" sideA="AC" sideB="AH=9" sideC="HB=16" altLabel="CH" color1="#34d399" color2="#6ee7b7" color3="#059669"/>,
    content: "Segitiga siku-siku ACB dengan ∠C = 90°. CH ⊥ AB.",
    parts: [
      { label: "a.", math: "CH^2 = AH \\cdot HB = 9 \\times 16 = \\ldots \\Rightarrow CH = \\ldots" },
      { label: "b.", math: "AC^2 = AH \\cdot AB = 9 \\times 25 = \\ldots \\Rightarrow AC = \\ldots" },
      { label: "c.", math: "BC^2 = HB \\cdot AB = 16 \\times 25 = \\ldots \\Rightarrow BC = \\ldots" },
    ],
  }),
  Qn(2, "Pernyataan yang Benar tentang Perbandingan Rusuk", {
    type: "pilgan",
    diagram: <SvgQ1 />,
    content: "Berdasarkan gambar berikut, segitiga ABC siku-siku di A dan AD ⊥ BC. Terdapat pernyataan sebagai berikut.",
    parts: [
      { label: "(i)", math: "AD^2 = BD \\times CD" },
      { label: "(ii)", math: "AB^2 = BD \\times BC" },
      { label: "(iii)", math: "AC^2 = CD \\times BD" },
      { label: "(iv)", math: "BC^2 = AB^2 + AC^2" },
    ],
    options: [
      { label: "A.", text: "(i), (ii), dan (iii)" },
      { label: "B.", text: "(i), (ii), dan (iv)" },
      { label: "C.", text: "(i), (iii), dan (iv)" },
      { label: "D.", text: "(ii), (iii), dan (iv)" },
    ],
  }),
  Qn(3, "Mencari Panjang AD", {
    type: "pilgan",
    diagram: <SvgQ2 />,
    content: "Pada gambar berikut, panjang AB = 12 cm dan BC = 15 cm. Panjang AD adalah …",
    options: [
      { label: "A.", text: "5,4 cm" },
      { label: "B.", text: "6 cm" },
      { label: "C.", text: "7,2 cm" },
      { label: "D.", text: "9,6 cm" },
    ],
  }),
  Qn(4, "Mencari AD, AB, dan AC", {
    type: "pilgan",
    diagram: <SvgQ3 />,
    content: "Pada gambar berikut, diketahui panjang BD = 3 cm dan CD = 12 cm. Panjang AD, AB, dan AC berturut-turut adalah …",
    options: [
      { label: "A.", text: "6 cm, 3√5 cm, dan 6√5 cm" },
      { label: "B.", text: "6 cm, 3√5 cm, dan 2√5 cm" },
      { label: "C.", text: "6 cm, 2√5 cm, dan 6√5 cm" },
      { label: "D.", text: "6 cm, 2√5 cm, dan 3√5 cm" },
    ],
  }),
  Qn(5, "Mencari Panjang AB", {
    type: "pilgan",
    diagram: <SvgQ4 />,
    content: "Pada gambar berikut, segitiga ABC siku-siku di A dan AD tegak lurus BC. Jika panjang BD = 4 cm dan CD = 5 cm, maka panjang AB adalah …",
    options: [
      { label: "A.", text: "√20 cm" },
      { label: "B.", text: "√28 cm" },
      { label: "C.", text: "√32 cm" },
      { label: "D.", text: "√36 cm" },
    ],
  }),
  Qn(6, "Hitunglah Nilai p", {
    type: "hitungP",
    content: "Hitunglah nilai p berdasarkan gambar di bawah ini.",
    parts: [
      {
        label: "a.",
        diagram: <SvgQ5a />,
        text: "Segitiga siku-siku di C. CD ⊥ AB, CD = 18 cm, DB = 6 cm. Cari p = AD.",
      },
      {
        label: "b.",
        diagram: <SvgQ5b />,
        text: "Segitiga siku-siku di G. GH ⊥ EF, EH = 4 cm, HF = 5 cm. Cari p = GH.",
      },
      {
        label: "c.",
        diagram: <SvgQ5c />,
        text: "Segitiga siku-siku di L. LN ⊥ KM, KN = 4 cm, NM = 25 cm. Cari p = LN.",
      },
      {
        label: "d.",
        diagram: <SvgQ5d />,
        text: "Segitiga TRS siku-siku di R. RU ⊥ TS, TR = 9 cm, RS = 12 cm. Cari p = US.",
      },
    ],
  }),
];

const RasioRusukPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <Percent className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(52,211,153,0.7)' }}>
            RASIO RUSUK SEGITIGA SIKU-SIKU DENGAN KESEBANGUNAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Kesebangunan & Kekongruenan · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 6 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>
        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-2">📌 Rumus Kunci – Garis Tinggi Siku-Siku</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Altitude", math: "h^2 = p \\cdot q" },
              { label: "Kaki-1", math: "a^2 = p \\cdot c" },
              { label: "Kaki-2", math: "b^2 = q \\cdot c" },
            ].map(r => (
              <div key={r.label} className="bg-white/5 rounded-lg px-2 py-2 text-center">
                <p className="text-emerald-300 text-[10px] font-bold mb-1">{r.label}</p>
                <div className="text-white/80 text-xs"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
                    <span className="text-emerald-300 text-xs font-bold">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center rounded-xl overflow-hidden">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex flex-col gap-1 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            <div className="flex items-start gap-2">
                              {p.label && <span className="text-emerald-400 text-xs font-bold shrink-0 mt-0.5">{p.label}</span>}
                              <div className="flex-1">
                                {p.text && <p className="font-body text-sm text-white/80 leading-relaxed">{p.text}</p>}
                                {p.math && <div className="text-white/80 text-sm mt-0.5"><InlineMath math={p.math} /></div>}
                              </div>
                            </div>
                            {p.diagram && <div className="mt-2 flex justify-center rounded-xl overflow-hidden">{p.diagram}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                    {q.options && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-amber-400 text-xs font-bold shrink-0">{opt.label}</span>
                            <span className="font-body text-sm text-white/80">{opt.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {q.math && !q.parts && <div className="mt-2 bg-white/5 rounded-lg px-3 py-2"><BlockMath math={q.math} /></div>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/kesebangunan-kekongruenan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Kesebangunan & Kekongruenan
          </button>
        </div>
      </div>
    </div>
  );
};

export default RasioRusukPage;
