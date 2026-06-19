import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n"|"title">): Q => ({ n, title, ...rest });

const NegExpSVG = () => (
  <svg width="230" height="110" viewBox="0 0 230 110" className="mx-auto">
    <rect x="5" y="5" width="220" height="100" rx="10" fill="#8b5cf6" fillOpacity="0.08" stroke="#a78bfa" strokeWidth="1.5"/>
    {[
      ["2³ = 8", "2² = 4", "2¹ = 2"],
      ["2⁰ = 1", "2⁻¹ = ½", "2⁻² = ¼"],
    ].map((row, ri) =>
      row.map((cell, ci) => (
        <g key={`${ri}-${ci}`}>
          <rect x={12 + ci*72} y={15 + ri*45} width="64" height="32" rx="6"
            fill="#7c3aed" fillOpacity={0.15 + ri*0.1} stroke="#a78bfa" strokeWidth="1"/>
          <text x={44 + ci*72} y={35 + ri*45} fill="#c4b5fd" fontSize="11"
            textAnchor="middle" fontFamily="monospace">{cell}</text>
        </g>
      ))
    )}
    <text x="115" y="104" fill="#64748b" fontSize="9" textAnchor="middle">Pola: setiap turun 1 pangkat, dibagi 2</text>
  </svg>
);

const FracExpSVG = () => (
  <svg width="230" height="115" viewBox="0 0 230 115" className="mx-auto">
    <rect x="5" y="5" width="220" height="105" rx="10" fill="#8b5cf6" fillOpacity="0.08" stroke="#a78bfa" strokeWidth="1.5"/>
    <text x="115" y="25" fill="#a78bfa" fontSize="10" textAnchor="middle" fontWeight="bold">PANGKAT PECAHAN</text>
    {[
      ["a^{1/2} = \\sqrt{a}", 50],
      ["a^{1/3} = \\sqrt[3]{a}", 72],
      ["a^{p/q} = \\sqrt[q]{a^p}", 94],
    ].map(([math, y]: any[]) => (
      <foreignObject key={math} x="30" y={y-16} width="170" height="22">
        <div xmlns="http://www.w3.org/1999/xhtml" style={{color:"#c4b5fd",fontSize:"12px",fontFamily:"monospace",textAlign:"center"}}>
        </div>
      </foreignObject>
    ))}
    <text x="115" y="50" fill="#c4b5fd" fontSize="12" textAnchor="middle" fontFamily="monospace">a^(1/2) = √a</text>
    <text x="115" y="72" fill="#c4b5fd" fontSize="12" textAnchor="middle" fontFamily="monospace">a^(1/3) = ³√a</text>
    <text x="115" y="94" fill="#c4b5fd" fontSize="12" textAnchor="middle" fontFamily="monospace">a^(p/q) = ᵍ√(aᵖ)</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Pangkat Nol – Konsep Dasar & Berbagai Ekspresi", {
    type: "mixed",
    parts: [
      { label: "a.", math: "5^0 = \\ldots" },
      { label: "b.", math: "(-7)^0 = \\ldots" },
      { label: "c.", math: "(3a)^0 = \\ldots \\text{ untuk } a \\ne 0" },
      { label: "d.", math: "3a^0 = \\ldots" },
      { label: "e.", math: "(x^2 + y^2)^0 = \\ldots \\text{ untuk } x,y \\ne 0" },
    ],
  }),
  Qn(2, "Pangkat Negatif – Definisi, Konversi & Nilai", {
    type: "mixed",
    parts: [
      { label: "a.", math: "5^{-3} = \\ldots" },
      { label: "b.", math: "\\left(\\frac{2}{3}\\right)^{-2} = \\left(\\frac{3}{2}\\right)^2 = \\ldots" },
      { label: "c.", math: "\\left(\\frac{1}{5}\\right)^{-3} = \\ldots" },
      { label: "d.", math: "(-2)^{-3} = \\ldots" },
      { label: "e.", math: "\\left(-\\frac{1}{2}\\right)^{-2} = \\ldots" },
    ],
  }),
  Qn(3, "Pangkat Pecahan – Akar Kuadrat, Kubik & Umum", {
    type: "mixed",
    parts: [
      { label: "a.", math: "25^{\\frac{1}{2}} = \\ldots" },
      { label: "b.", math: "8^{\\frac{1}{3}} = \\ldots" },
      { label: "c.", math: "27^{\\frac{2}{3}} = \\ldots" },
      { label: "d.", math: "16^{\\frac{3}{4}} = \\ldots" },
      { label: "e.", math: "9^{\\frac{3}{2}} = \\ldots" },
      { label: "f.", math: "100^{\\frac{3}{2}} = \\ldots" },
    ],
  }),
  Qn(4, "Pangkat Pecahan Negatif – Dasar, Lanjutan & Ekspresi Kompleks", {
    type: "mixed",
    parts: [
      { label: "a.", math: "4^{-\\frac{1}{2}} = \\frac{1}{4^{\\frac{1}{2}}} = \\ldots" },
      { label: "b.", math: "27^{-\\frac{2}{3}} = \\ldots" },
      { label: "c.", math: "16^{-\\frac{3}{4}} = \\frac{1}{16^{\\frac{3}{4}}} = \\ldots" },
      { label: "d.", math: "32^{-\\frac{3}{5}} = \\ldots" },
      { label: "e.", math: "\\left(\\frac{1}{4}\\right)^{-\\frac{3}{2}} = \\ldots" },
      { label: "f.", math: "\\left(\\frac{8}{27}\\right)^{-\\frac{2}{3}} = \\ldots" },
    ],
  }),
  Qn(5, "Pangkat Desimal", {
    type: "mixed",
    content: "Pangkat desimal sama dengan pangkat pecahan:",
    parts: [
      { label: "a.", math: "25^{0.5} = 25^{\\frac{1}{2}} = \\ldots" },
      { label: "b.", math: "8^{0.\\overline{3}} = 8^{\\frac{1}{3}} = \\ldots" },
      { label: "c.", math: "16^{0.75} = 16^{\\frac{3}{4}} = \\ldots" },
      { label: "d.", math: "64^{0{,}75} = 64^{\\frac{3}{4}} = \\ldots \\quad \\text{(hitung nilainya!)}" },
      { label: "e.", math: "8^{0{,}\\overline{3}} = 8^{\\frac{1}{3}} = \\ldots \\quad \\text{(hitung nilainya!)}" },
      { label: "f.", math: "27^{0{,}\\overline{6}} = 27^{\\frac{2}{3}} = \\ldots \\quad \\text{(hitung nilainya!)}" },
    ],
  }),
  Qn(6, "Gabungan Semua Jenis Pangkat", {
    type: "mixed",
    parts: [
      { label: "a.", math: "2^{-2} \\times 4^{\\frac{3}{2}} + 3^0 = \\ldots" },
      { label: "b.", math: "27^{\\frac{2}{3}} - 4^{-1} + 2^0 = \\ldots" },
      { label: "c.", math: "\\frac{8^{\\frac{2}{3}} \\times 2^{-1}}{4^0} = \\ldots" },
      { label: "d.", math: "2^{-2} \\times 4^{\\frac{3}{2}} + 3^0 = \\ldots \\quad \\text{(energi ilmuwan, hitung hasilnya!)}" },
      { label: "e.", math: "27^{\\frac{2}{3}} - 4^{-1} + 2^0 = \\ldots \\quad \\text{(luas peta, satuan persegi)}" },
      { label: "f.", math: "\\frac{8^{\\frac{2}{3}} \\times 2^{-1}}{4^0} = \\ldots \\quad \\text{(indeks pertumbuhan ekonomi)}" },
    ],
  }),
];

const PangkatNolNegatifPecahanPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🔮</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(167,139,250,0.7)' }}>
            PANGKAT NOL, NEGATIF & PECAHAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bilangan Berpangkat · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 6 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">TKA</span>
          </div>
        </div>
        <div className="mb-5 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300 text-xs font-bold mb-3">📐 Rumus-Rumus Kunci</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Pangkat Nol", math: "a^0 = 1 \\;(a\\ne 0)" },
              { name: "Pangkat Negatif", math: "a^{-n} = \\dfrac{1}{a^n}" },
              { name: "Pangkat ½", math: "a^{\\frac{1}{2}} = \\sqrt{a}" },
              { name: "Pangkat ⅓", math: "a^{\\frac{1}{3}} = \\sqrt[3]{a}" },
              { name: "Pangkat p/q", math: "a^{\\frac{p}{q}} = \\sqrt[q]{a^p}" },
              { name: "Invers Pangkat", math: "\\left(\\tfrac{a}{b}\\right)^{-n} = \\left(\\tfrac{b}{a}\\right)^n" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-violet-300 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-slate-900/80 to-purple-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-violet-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-400 to-purple-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/50 flex items-center justify-center shrink-0">
                    <span className="text-violet-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-violet-400 text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-violet-900/20 border border-violet-500/20 rounded-lg px-4 py-3 flex justify-center"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-violet-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
            className="text-sm text-muted-foreground hover:text-violet-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Bilangan Berpangkat
          </button>
        </div>
      </div>
    </div>
  );
};
export default PangkatNolNegatifPecahanPage;
