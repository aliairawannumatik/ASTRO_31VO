import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n"|"title">): Q => ({ n, title, ...rest });

const SurdTreeSVG = () => (
  <svg width="230" height="120" viewBox="0 0 230 120" className="mx-auto">
    <rect x="5" y="5" width="220" height="110" rx="10" fill="#f59e0b" fillOpacity="0.08" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="115" y="22" fill="#fbbf24" fontSize="10" textAnchor="middle" fontWeight="bold">Sederhanakan √72</text>
    <text x="115" y="40" fill="#fcd34d" fontSize="12" textAnchor="middle" fontFamily="monospace">√72 = √(36 × 2)</text>
    <line x1="115" y1="45" x2="80" y2="60" stroke="#fbbf24" strokeWidth="1.5"/>
    <line x1="115" y1="45" x2="150" y2="60" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="80" y="72" fill="#fcd34d" fontSize="12" textAnchor="middle" fontFamily="monospace">√36</text>
    <text x="150" y="72" fill="#fcd34d" fontSize="12" textAnchor="middle" fontFamily="monospace">√2</text>
    <text x="80" y="90" fill="#a3e635" fontSize="12" textAnchor="middle" fontFamily="monospace">6</text>
    <text x="115" y="90" fill="#fbbf24" fontSize="12" textAnchor="middle">×</text>
    <text x="150" y="90" fill="#fcd34d" fontSize="12" textAnchor="middle" fontFamily="monospace">√2</text>
    <text x="115" y="110" fill="#a3e635" fontSize="11" textAnchor="middle" fontFamily="monospace">= 6√2</text>
  </svg>
);

const RationalizeSVG = () => (
  <svg width="230" height="120" viewBox="0 0 230 120" className="mx-auto">
    <rect x="5" y="5" width="220" height="110" rx="10" fill="#f59e0b" fillOpacity="0.08" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="115" y="22" fill="#fbbf24" fontSize="10" textAnchor="middle" fontWeight="bold">Merasionalkan Penyebut</text>
    <text x="115" y="44" fill="#fcd34d" fontSize="13" textAnchor="middle" fontFamily="monospace">  6    ×   √3</text>
    <line x1="38" y1="48" x2="95" y2="48" stroke="#fbbf24" strokeWidth="1.5"/>
    <line x1="115" y1="38" x2="115" y2="58" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2"/>
    <line x1="130" y1="48" x2="195" y2="48" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="65" y="65" fill="#fcd34d" fontSize="13" textAnchor="middle" fontFamily="monospace">√3</text>
    <text x="160" y="65" fill="#fcd34d" fontSize="13" textAnchor="middle" fontFamily="monospace">√3</text>
    <text x="115" y="85" fill="#a3e635" fontSize="12" textAnchor="middle" fontFamily="monospace">= 6√3 / 3 = 2√3</text>
    <text x="115" y="108" fill="#64748b" fontSize="9" textAnchor="middle">Kalikan pembilang & penyebut dengan √3</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Pengertian, Akar Pangkat Tiga & Bentuk Paling Sederhana – Dasar/ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\sqrt{49} = \\ldots" },
      { label: "b.", math: "\\sqrt{121} = \\ldots" },
      { label: "c.", math: "\\sqrt[3]{64} = \\ldots" },
      { label: "d.", math: "\\sqrt{\\frac{49}{4}} = \\ldots" },
      { label: "e.", math: "\\sqrt{\\frac{25}{9}} = \\ldots" },
    ],
  }),
  Qn(2, "Menyederhanakan Bentuk Akar – UN/ANBK/TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\sqrt{50} = \\sqrt{25 \\times 2} = 5\\sqrt{2}" },
      { label: "b.", math: "\\sqrt{72} = \\ldots" },
      { label: "c.", math: "\\sqrt{98} = \\ldots" },
      { label: "d.", math: "\\sqrt{48} = \\ldots" },
      { label: "e.", math: "\\sqrt{75} = \\ldots" },
      { label: "f.", math: "\\sqrt{200} = \\ldots" },
      { label: "g.", math: "\\sqrt{0{,}25} = \\ldots" },
      { label: "h.", math: "\\sqrt{0{,}04} = \\ldots" },
      { label: "i.", math: "\\sqrt{1{,}44} = \\ldots" },
      { label: "j.", math: "\\sqrt{18} = \\ldots" },
      { label: "k.", math: "\\sqrt{108} = \\ldots" },
      { label: "l.", math: "\\sqrt{147} = \\ldots" },
    ],
  }),
  Qn(3, "Operasi Penjumlahan & Pengurangan Bentuk Akar – UN/ANBK/TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "3\\sqrt{2} + 5\\sqrt{2} = \\ldots" },
      { label: "b.", math: "7\\sqrt{3} - 4\\sqrt{3} = \\ldots" },
      { label: "c.", math: "2\\sqrt{5} + 3\\sqrt{5} - \\sqrt{5} = \\ldots" },
      { label: "d.", math: "\\sqrt{3} + \\sqrt{12} + \\sqrt{27} = \\ldots" },
      { label: "e.", math: "\\sqrt{8} - \\sqrt{32} + \\sqrt{50} = \\ldots" },
      { label: "f.", math: "2\\sqrt{45} - 3\\sqrt{20} + \\sqrt{5} = \\ldots" },
      { label: "g.", math: "\\sqrt{8} + \\sqrt{2} = 2\\sqrt{2} + \\sqrt{2} = \\ldots" },
      { label: "h.", math: "\\sqrt{12} + \\sqrt{27} = \\ldots" },
      { label: "i.", math: "\\sqrt{50} - \\sqrt{18} + \\sqrt{8} = \\ldots" },
    ],
  }),
  Qn(4, "Perkalian & Pembagian Bentuk Akar – UN/ANBK/TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\sqrt{3} \\times \\sqrt{12} = \\ldots" },
      { label: "b.", math: "\\sqrt{5} \\times \\sqrt{20} = \\ldots" },
      { label: "c.", math: "\\sqrt{6} \\times \\sqrt{24} = \\ldots" },
      { label: "d.", math: "2\\sqrt{3} \\times 3\\sqrt{3} = \\ldots" },
      { label: "e.", math: "4\\sqrt{5} \\times 2\\sqrt{5} = \\ldots" },
      { label: "f.", math: "3\\sqrt{2} \\times 5\\sqrt{8} = \\ldots" },
      { label: "g.", math: "\\frac{\\sqrt{50}}{\\sqrt{2}} = \\ldots" },
      { label: "h.", math: "\\frac{\\sqrt{75}}{\\sqrt{3}} = \\ldots" },
      { label: "i.", math: "\\frac{6\\sqrt{8}}{3\\sqrt{2}} = \\ldots" },
    ],
  }),
  Qn(5, "Merasionalkan Penyebut & Operasi Campuran – UN/ANBK/TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\frac{6}{\\sqrt{3}} = \\frac{6\\sqrt{3}}{3} = \\ldots" },
      { label: "b.", math: "\\frac{10}{\\sqrt{5}} = \\ldots" },
      { label: "c.", math: "\\frac{4}{\\sqrt{2}} = \\ldots" },
      { label: "d.", math: "\\frac{\\sqrt{3}}{\\sqrt{5}} = \\frac{\\sqrt{15}}{5}" },
      { label: "e.", math: "\\frac{2\\sqrt{2}}{\\sqrt{6}} = \\ldots" },
      { label: "f.", math: "\\frac{3\\sqrt{5}}{\\sqrt{15}} = \\ldots" },
      { label: "g.", math: "\\frac{5}{2\\sqrt{3}} = \\ldots" },
      { label: "h.", math: "\\frac{\\sqrt{18}+\\sqrt{8}}{\\sqrt{2}} = \\ldots" },
      { label: "i.", math: "\\frac{\\sqrt{27}-\\sqrt{12}}{\\sqrt{3}} = \\ldots" },
      { label: "j.", math: "\\frac{\\sqrt{75}+\\sqrt{48}}{\\sqrt{3}} = \\ldots" },
    ],
  }),
  Qn(6, "Merasionalkan Penyebut Binomial & Tingkat Lanjut – UN/TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\frac{1}{2+\\sqrt{3}} = \\frac{2-\\sqrt{3}}{(2)^2-(\\sqrt{3})^2} = \\ldots" },
      { label: "b.", math: "\\frac{4}{3-\\sqrt{5}} = \\ldots" },
      { label: "c.", math: "\\frac{6}{\\sqrt{7}+1} = \\ldots" },
      { label: "d.", math: "\\frac{\\sqrt{5}+\\sqrt{3}}{\\sqrt{5}-\\sqrt{3}} = \\ldots" },
      { label: "e.", math: "\\frac{3+\\sqrt{2}}{3-\\sqrt{2}} = \\ldots" },
      { label: "f.", math: "\\frac{\\sqrt{6}-\\sqrt{2}}{\\sqrt{6}+\\sqrt{2}} = \\ldots" },
      { label: "g.", math: "\\frac{\\sqrt{2}+1}{\\sqrt{2}-1} = \\ldots" },
      { label: "h.", math: "\\frac{4}{\\sqrt{5}+\\sqrt{3}} = \\ldots" },
    ],
  }),
  Qn(7, "Perkalian & Distribusi Bentuk Akar – UN/ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\sqrt{2}(\\sqrt{8}+\\sqrt{2}) = \\ldots" },
      { label: "b.", math: "(\\sqrt{3}+1)(\\sqrt{3}-1) = \\ldots" },
      { label: "c.", math: "(\\sqrt{5}+2)^2 = \\ldots" },
      { label: "d.", math: "(\\sqrt{7}+\\sqrt{3})(\\sqrt{7}-\\sqrt{3}) = \\ldots" },
      { label: "e.", math: "(\\sqrt{10}+\\sqrt{6})(\\sqrt{10}-\\sqrt{6}) = \\ldots" },
      { label: "f.", math: "(2+\\sqrt{3})(2-\\sqrt{3}) = \\ldots" },
      { label: "g.", math: "(2+\\sqrt{3})(3+\\sqrt{3}) = \\ldots" },
      { label: "h.", math: "(\\sqrt{5}-2)(\\sqrt{5}+4) = \\ldots" },
      { label: "i.", math: "(3\\sqrt{2}-1)^2 = \\ldots" },
    ],
  }),
];

const BentukAkarPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">√</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-amber-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,191,36,0.7)' }}>
            BENTUK AKAR
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bilangan Berpangkat · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2">
            <span className="text-amber-400 text-xs font-bold">📋 7 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>
        <div className="mb-5 bg-amber-900/20 border border-amber-500/20 rounded-xl p-4">
          <p className="text-amber-300 text-xs font-bold mb-3">📐 Sifat-Sifat Bentuk Akar</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Perkalian Akar", math: "\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{ab}" },
              { name: "Pembagian Akar", math: "\\frac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\frac{a}{b}}" },
              { name: "Penjumlahan", math: "a\\sqrt{c}+b\\sqrt{c}=(a+b)\\sqrt{c}" },
              { name: "Penyederhanaan", math: "\\sqrt{a^2 b} = a\\sqrt{b}" },
              { name: "Merasionalkan", math: "\\frac{k}{\\sqrt{a}} = \\frac{k\\sqrt{a}}{a}" },
              { name: "Konjugat", math: "(\\sqrt{a}+\\sqrt{b})(\\sqrt{a}-\\sqrt{b})=a-b" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-amber-300 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-slate-900/80 to-yellow-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-amber-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-yellow-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
                    <span className="text-amber-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-amber-900/20 border border-amber-500/20 rounded-lg px-4 py-3 flex justify-center"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-amber-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
            className="text-sm text-muted-foreground hover:text-amber-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Bilangan Berpangkat
          </button>
        </div>
      </div>
    </div>
  );
};
export default BentukAkarPage;
