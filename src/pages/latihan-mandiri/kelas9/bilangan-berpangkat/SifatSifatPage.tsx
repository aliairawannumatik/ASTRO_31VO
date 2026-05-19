import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n"|"title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Sifat Perkalian – Angka & Variabel", {
    type: "mixed", mathContent: "a^m \\times a^n = a^{m+n}",
    parts: [
      { label: "a.", math: "3^4 \\times 3^5 = 3^{\\square} = \\ldots" },
      { label: "b.", math: "5^2 \\times 5^6 = \\ldots" },
      { label: "c.", math: "a^3 \\times a^7 = \\ldots" },
      { label: "d.", math: "x^4 \\times x^2 \\times x = \\ldots" },
    ],
  }),
  Qn(2, "Sifat Pembagian Pangkat Basis Sama – UN", {
    type: "mixed", mathContent: "a^m \\div a^n = a^{m-n}",
    parts: [
      { label: "a.", math: "7^9 \\div 7^4 = 7^{\\square} = \\ldots" },
      { label: "b.", math: "2^{10} \\div 2^6 = \\ldots" },
      { label: "c.", math: "5^8 \\div 5^5 = \\ldots" },
    ],
  }),
  Qn(3, "Sifat Pemangkatan – TKA", {
    type: "mixed", mathContent: "(a^m)^n = a^{m \\times n}",
    parts: [
      { label: "a.", math: "(2^3)^4 = 2^{\\square} = \\ldots" },
      { label: "b.", math: "(3^2)^5 = \\ldots" },
      { label: "c.", math: "(5^4)^2 = \\ldots" },
    ],
  }),
  Qn(4, "Sifat Distribusi Perkalian – UN", {
    type: "mixed", mathContent: "(ab)^n = a^n \\cdot b^n",
    parts: [
      { label: "a.", math: "(2 \\times 3)^4 = 2^4 \\times 3^4 = \\ldots" },
      { label: "b.", math: "(3 \\times 5)^2 = \\ldots" },
      { label: "c.", math: "(4 \\times 2)^3 = \\ldots" },
    ],
  }),
  Qn(5, "Sifat Distribusi Pembagian – ANBK", {
    type: "mixed", mathContent: "\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}",
    parts: [
      { label: "a.", math: "\\left(\\frac{3}{4}\\right)^2 = \\frac{3^2}{4^2} = \\ldots" },
      { label: "b.", math: "\\left(\\frac{2}{5}\\right)^3 = \\ldots" },
      { label: "c.", math: "\\left(\\frac{6}{7}\\right)^2 = \\ldots" },
    ],
  }),
  Qn(6, "Menyederhanakan & Penyederhanaan Ekspresi", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\frac{3^6}{3^2 \\times 3} = \\ldots" },
      { label: "b.", math: "\\frac{m^8 \\times m^3}{m^6} = \\ldots" },
      { label: "c.", math: "\\frac{a^5 b^3}{a^2 b} = \\ldots" },
      { label: "d.", math: "\\frac{p^8 q^4}{p^3 q^4} = \\ldots" },
    ],
  }),
  Qn(7, "Soal UN – Sifat Distribusi Campuran", {
    type: "mixed",
    parts: [
      { label: "a.", math: "(2a)^3 = \\ldots" },
      { label: "b.", math: "(3x)^4 = \\ldots" },
      { label: "c.", math: "\\left(\\frac{2x}{3y}\\right)^2 = \\ldots" },
    ],
  }),
  Qn(8, "Soal TKA – Menyederhanakan Eksponen Besar", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\frac{6^5}{6^2} = \\ldots" },
      { label: "b.", math: "\\frac{10^8}{10^3 \\times 10^2} = \\ldots" },
      { label: "c.", math: "\\frac{2^{15}}{4^5} = \\ldots" },
    ],
  }),
  Qn(9, "Soal UN – Ekspresi Variabel Gabungan", {
    type: "mixed",
    parts: [
      { label: "a.", math: "(a^2 b^3)^4 = a^\\square b^\\square" },
      { label: "b.", math: "(x^3 y^2)^3 \\div (x^2 y)^3 = \\ldots" },
      { label: "c.", math: "\\left(\\frac{a^3}{b^2}\\right)^3 = \\ldots" },
    ],
  }),
  Qn(10, "Penyederhanaan & Gabungan Sifat Tingkat Lanjut", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\frac{(3^4)^2}{3^5 \\times 3^2} = \\ldots" },
      { label: "b.", math: "\\frac{(x^3 y)^4}{x^8 y^3} = \\ldots" },
      { label: "c.", math: "\\frac{(2m^2)^3 \\times m^4}{4m^5} = \\ldots" },
      { label: "d.", math: "\\frac{(p^2 q^3)^4}{p^5 q^8} = \\ldots" },
      { label: "e.", math: "\\frac{(2^3 \\cdot 3^2)^2}{6^4} = \\ldots" },
      { label: "f.", math: "\\frac{(ab)^5}{a^3 b^4} \\cdot \\frac{a^2}{b} = \\ldots" },
      { label: "g.", math: "\\left(\\frac{x^3}{y^2}\\right)^4 \\cdot \\frac{y^{10}}{x^8} = \\ldots" },
      { label: "h.", math: "\\frac{(2^3)^4 \\times 2^2}{2^{10} \\times 2^2} = \\ldots" },
      { label: "i.", math: "\\frac{(3a^2)^3 \\times a^4}{9a^8} = \\ldots" },
      { label: "j.", math: "\\left(\\frac{2x^3 y}{4xy^2}\\right)^2 = \\ldots" },
    ],
  }),
  Qn(11, "Soal TKA – Variabel dan Angka", {
    type: "mixed",
    parts: [
      { label: "a.", math: "(2x^3)^4 = 2^4 \\times x^{12} = \\ldots" },
      { label: "b.", math: "(3a^2 b)^3 = \\ldots" },
      { label: "c.", math: "\\left(\\frac{2x^2}{y^3}\\right)^3 = \\ldots" },
    ],
  }),
  Qn(12, "Soal UN – Sifat Eksponen pada Aljabar", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\frac{(2a)^4}{4a^2} = \\ldots" },
      { label: "b.", math: "\\frac{(3x)^3}{9x} = \\ldots" },
      { label: "c.", math: "\\frac{(ab)^5}{a^3 b^2} = \\ldots" },
    ],
  }),
];

const SifatSifatPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(52,211,153,0.7)' }}>
            SIFAT-SIFAT OPERASI BILANGAN BERPANGKAT
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bilangan Berpangkat · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 12 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>
        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-3">📐 Sifat-Sifat Utama</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Perkalian", math: "a^m \\times a^n = a^{m+n}" },
              { name: "Pembagian", math: "a^m \\div a^n = a^{m-n}" },
              { name: "Pemangkatan", math: "(a^m)^n = a^{mn}" },
              { name: "Distribusi ×", math: "(ab)^n = a^n b^n" },
              { name: "Distribusi ÷", math: "\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}" },
              { name: "Pangkat Nol", math: "a^0 = 1 \\;(a \\ne 0)" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-emerald-300 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
                    <span className="text-emerald-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-emerald-900/20 border border-emerald-500/20 rounded-lg px-4 py-3 flex justify-center"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-emerald-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
            className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Bilangan Berpangkat
          </button>
        </div>
      </div>
    </div>
  );
};
export default SifatSifatPage;
