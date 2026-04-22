import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n"|"title">): Q => ({ n, title, ...rest });

const ScaleChartSVG = () => (
  <svg width="230" height="125" viewBox="0 0 230 125" className="mx-auto">
    <rect x="5" y="5" width="220" height="115" rx="10" fill="#e11d48" fillOpacity="0.07" stroke="#fb7185" strokeWidth="1.5"/>
    <text x="115" y="22" fill="#fb7185" fontSize="10" textAnchor="middle" fontWeight="bold">Skala Notasi Ilmiah</text>
    {[
      ["10⁻⁹ nm", "#f43f5e", 25],
      ["10⁻⁶ μm", "#fb7185", 43],
      ["10⁻³ mm", "#fda4af", 61],
      ["10⁰ = 1 m", "#fecdd3", 79],
      ["10³ km", "#fda4af", 97],
      ["10⁶ Mm", "#fb7185", 115],
    ].map(([lbl, clr, y]: any[]) => y <= 115 && (
      <g key={lbl}>
        <text x="18" y={y} fill={clr} fontSize="10" fontFamily="monospace">{lbl}</text>
        <line x1="90" y1={y-4} x2={90 + Math.random()*60 + 30} y2={y-4} stroke={clr} strokeWidth="6" strokeOpacity="0.4"/>
      </g>
    ))}
  </svg>
);

const NotationSVG = () => (
  <svg width="230" height="105" viewBox="0 0 230 105" className="mx-auto">
    <rect x="5" y="5" width="220" height="95" rx="10" fill="#e11d48" fillOpacity="0.07" stroke="#fb7185" strokeWidth="1.5"/>
    <text x="115" y="25" fill="#fb7185" fontSize="11" textAnchor="middle" fontWeight="bold" fontFamily="monospace">a × 10ⁿ</text>
    <rect x="20" y="35" width="80" height="35" rx="6" fill="#e11d48" fillOpacity="0.2" stroke="#fb7185" strokeWidth="1"/>
    <text x="60" y="57" fill="#fda4af" fontSize="11" textAnchor="middle" fontFamily="monospace">a</text>
    <rect x="120" y="35" width="95" height="35" rx="6" fill="#e11d48" fillOpacity="0.2" stroke="#fb7185" strokeWidth="1"/>
    <text x="167" y="57" fill="#fda4af" fontSize="11" textAnchor="middle" fontFamily="monospace">10ⁿ</text>
    <text x="60" y="82" fill="#64748b" fontSize="8" textAnchor="middle">1 ≤ a &lt; 10</text>
    <text x="167" y="82" fill="#64748b" fontSize="8" textAnchor="middle">n bilangan bulat</text>
    <text x="107" y="55" fill="#fb7185" fontSize="14" textAnchor="middle">×</text>
    <text x="115" y="100" fill="#64748b" fontSize="8" textAnchor="middle">Notasi ilmiah/baku</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Pengertian Notasi Ilmiah – Dasar", {
    type: "mixed", diagram: <NotationSVG />,
    content: "Notasi ilmiah: a × 10ⁿ, di mana 1 ≤ a < 10.",
    parts: [
      { label: "a.", text: "Manakah yang merupakan notasi ilmiah yang benar?" },
      { label: "b.", math: "3{,}5 \\times 10^4 \\text{ — apakah ini notasi ilmiah yang valid?}" },
      { label: "c.", math: "15 \\times 10^3 \\text{ — apakah ini notasi ilmiah yang valid? Perbaiki jika salah.}" },
    ],
  }),
  Qn(2, "Mengubah ke Notasi Ilmiah – Bilangan Besar – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "7.500.000 = 7{,}5 \\times 10^{\\square}" },
      { label: "b.", math: "43.000.000.000 = \\ldots \\times 10^{\\square}" },
      { label: "c.", math: "986.000 = \\ldots" },
    ],
  }),
  Qn(3, "Mengubah ke Notasi Ilmiah – Bilangan Kecil – ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "0{,}0035 = 3{,}5 \\times 10^{-3}" },
      { label: "b.", math: "0{,}000072 = \\ldots" },
      { label: "c.", math: "0{,}00000045 = \\ldots" },
    ],
  }),
  Qn(4, "Mengubah dari Notasi Ilmiah – Bilangan Besar – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "6{,}02 \\times 10^{23} = \\ldots" },
      { label: "b.", math: "3{,}0 \\times 10^8 = \\ldots \\text{ (kecepatan cahaya, m/s)}" },
      { label: "c.", math: "9{,}46 \\times 10^{12} = \\ldots \\text{ km (satu tahun cahaya)}" },
    ],
  }),
  Qn(5, "Mengubah dari Notasi Ilmiah – Bilangan Kecil – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "4{,}5 \\times 10^{-4} = 0{,}00045" },
      { label: "b.", math: "1{,}67 \\times 10^{-27} = \\ldots \\text{ (massa proton, kg)}" },
      { label: "c.", math: "2{,}5 \\times 10^{-6} = \\ldots \\text{ m}" },
    ],
  }),
  Qn(6, "Perkalian Notasi Ilmiah – UN", {
    type: "mixed", mathContent: "(a \\times 10^m)(b \\times 10^n) = (a \\times b) \\times 10^{m+n}",
    parts: [
      { label: "a.", math: "(3 \\times 10^4)(2 \\times 10^5) = 6 \\times 10^9" },
      { label: "b.", math: "(4 \\times 10^3)(5 \\times 10^6) = \\ldots" },
      { label: "c.", math: "(2{,}5 \\times 10^7)(4 \\times 10^3) = \\ldots" },
    ],
  }),
  Qn(7, "Pembagian Notasi Ilmiah – ANBK", {
    type: "mixed", mathContent: "\\frac{a \\times 10^m}{b \\times 10^n} = \\frac{a}{b} \\times 10^{m-n}",
    parts: [
      { label: "a.", math: "\\frac{8 \\times 10^9}{4 \\times 10^3} = 2 \\times 10^6" },
      { label: "b.", math: "\\frac{6 \\times 10^{12}}{3 \\times 10^5} = \\ldots" },
      { label: "c.", math: "\\frac{9 \\times 10^8}{3 \\times 10^{-2}} = \\ldots" },
    ],
  }),
  Qn(8, "Penjumlahan Notasi Ilmiah – TKA", {
    type: "mixed",
    content: "Untuk menjumlahkan, samakan pangkat 10 terlebih dahulu:",
    parts: [
      { label: "a.", math: "3 \\times 10^5 + 2 \\times 10^5 = 5 \\times 10^5" },
      { label: "b.", math: "4{,}2 \\times 10^6 + 3{,}8 \\times 10^6 = \\ldots" },
      { label: "c.", math: "5 \\times 10^4 + 3 \\times 10^3 = 5 \\times 10^4 + 0{,}3 \\times 10^4 = \\ldots" },
    ],
  }),
  Qn(9, "Pengurangan Notasi Ilmiah – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "7 \\times 10^8 - 3 \\times 10^8 = \\ldots" },
      { label: "b.", math: "9{,}5 \\times 10^5 - 4{,}5 \\times 10^5 = \\ldots" },
      { label: "c.", math: "6 \\times 10^7 - 4 \\times 10^6 = \\ldots" },
    ],
  }),
  Qn(10, "Memperbaiki Notasi yang Salah – TKA", {
    type: "mixed",
    content: "Perbaiki notasi ilmiah berikut ke bentuk baku:",
    parts: [
      { label: "a.", math: "25 \\times 10^4 = 2{,}5 \\times 10^5" },
      { label: "b.", math: "0{,}35 \\times 10^7 = \\ldots" },
      { label: "c.", math: "120 \\times 10^{-3} = \\ldots" },
    ],
  }),
  Qn(11, "Soal ANBK – Akar dalam Notasi Ilmiah", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\sqrt{4 \\times 10^6} = 2 \\times 10^3" },
      { label: "b.", math: "\\sqrt{25 \\times 10^8} = \\ldots" },
      { label: "c.", math: "\\sqrt{36 \\times 10^{-4}} = \\ldots" },
    ],
  }),
];

const NotasiIlmiahPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🔭</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,113,133,0.7)' }}>
            NOTASI ILMIAH
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bilangan Berpangkat · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 11 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>
        <div className="mb-5 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-3">📐 Konsep Notasi Ilmiah</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Bentuk Baku", math: "a \\times 10^n,\\; 1 \\le a < 10" },
              { name: "Besar → Kecil Desimal", math: "3{,}0 \\times 10^8 = 300.000.000" },
              { name: "Kecil → Negatif", math: "0{,}0045 = 4{,}5 \\times 10^{-3}" },
              { name: "Perkalian", math: "(a \\cdot 10^m)(b \\cdot 10^n) = ab \\cdot 10^{m+n}" },
              { name: "Pembagian", math: "\\frac{a \\cdot 10^m}{b \\cdot 10^n} = \\frac{a}{b} \\cdot 10^{m-n}" },
              { name: "Pemangkatan", math: "(a \\cdot 10^n)^k = a^k \\cdot 10^{nk}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-rose-300 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-slate-900/80 to-pink-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-rose-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center shrink-0">
                    <span className="text-rose-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-rose-900/20 border border-rose-500/20 rounded-lg px-4 py-3 flex justify-center"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-rose-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80">{p.text}</p>}
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/bilangan-berpangkat"); }}
            className="text-sm text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Bilangan Berpangkat
          </button>
        </div>
      </div>
    </div>
  );
};
export default NotasiIlmiahPage;
