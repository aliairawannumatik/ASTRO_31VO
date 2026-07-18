import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n"|"title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Ekspansi Bentuk Pangkat – UN", {
    type: "mixed",
    content: "Nyatakan dalam bentuk perkalian berulang lalu hitung nilainya:",
    parts: [
      { label: "a.", math: "4^3" },
      { label: "b.", math: "(-5)^2" },
      { label: "c.", math: "\\left(\\frac{1}{2}\\right)^5" },
      { label: "d.", text: "Sebuah kubus memiliki panjang sisi 4 cm. Volume kubus = sisi³. Nyatakan volumenya dalam bentuk pangkat lalu hitung!" },
    ],
  }),
  Qn(2, "Penulisan Bentuk Pangkat – UN Style", {
    type: "mixed",
    content: "Tuliskan dalam bentuk pangkat:",
    parts: [
      { label: "a.", math: "7 \\times 7 \\times 7 \\times 7 = \\ldots" },
      { label: "b.", math: "(-3) \\times (-3) \\times (-3) = \\ldots" },
      { label: "c.", math: "a \\times a \\times a \\times a \\times a = \\ldots" },
    ],
  }),
  Qn(3, "Nilai Pangkat dengan Basis Negatif – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "(-2)^4 = \\ldots" },
      { label: "b.", math: "(-3)^3 = \\ldots" },
      { label: "c.", math: "(-1)^{100} = \\ldots" },
    ],
  }),
  Qn(4, "Perbedaan (−a)ⁿ dan −aⁿ – Konsep Penting", {
    type: "mixed",
    content: "Perhatikan perbedaan antara (−a)ⁿ dan −aⁿ. Pada (−a)ⁿ, tanda negatif ikut dipangkatkan; pada −aⁿ, hanya a yang dipangkatkan kemudian hasilnya dinegatifkan.",
    parts: [
      { label: "a.", math: "(-2)^4 = \\ldots" },
      { label: "b.", math: "-2^4 = \\ldots" },
      { label: "c.", math: "(-3)^2 = \\ldots" },
      { label: "d.", math: "-3^2 = \\ldots" },
      { label: "e.", text: "Tuliskan kesimpulan: kapan (−a)ⁿ ≠ −aⁿ dan kapan (−a)ⁿ = −aⁿ?" },
      { label: "f.", text: "Seorang siswa menghitung nilai −4² dan mendapat 16. Apakah ia benar? Jelaskan perbedaan antara (−4)² dan −4²!" },
    ],
  }),
  Qn(5, "Eksponen Basis Pecahan – UN/ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\left(\\frac{2}{3}\\right)^3 = \\ldots" },
      { label: "b.", math: "\\left(\\frac{1}{4}\\right)^2 = \\ldots" },
      { label: "c.", math: "\\left(\\frac{3}{5}\\right)^2 = \\ldots" },
    ],
  }),
  Qn(6, "Menentukan Bilangan Pokok – TKA", {
    type: "mixed",
    content: "Tentukan nilai n yang memenuhi persamaan berikut:",
    parts: [
      { label: "a.", math: "n^3 = 27 \\Rightarrow n = \\ldots" },
      { label: "b.", math: "n^2 = 144 \\Rightarrow n = \\ldots" },
      { label: "c.", math: "n^4 = 16 \\Rightarrow n = \\ldots" },
      { label: "d.", text: "Luas ubin berbentuk persegi adalah 81 cm². Jika luas = n², berapa panjang sisi ubin?" },
      { label: "e.", text: "Volume sebuah kotak berbentuk kubus adalah 125 cm³. Jika volume = n³, berapa panjang sisi kotak?" },
    ],
  }),
  Qn(7, "Menentukan Pangkat – UN", {
    type: "mixed",
    content: "Tentukan nilai n yang memenuhi:",
    parts: [
      { label: "a.", math: "2^n = 64 \\Rightarrow n = \\ldots" },
      { label: "b.", math: "3^n = 243 \\Rightarrow n = \\ldots" },
      { label: "c.", math: "5^n = 3125 \\Rightarrow n = \\ldots" },
      { label: "d.", text: "Sebuah bakteri berkembang biak dengan faktor 5 setiap jam. Setelah n jam ada 5ⁿ bakteri. Jika ada 3.125 bakteri, sudah berapa jamkah berlalu?" },
    ],
  }),
  Qn(8, "Nilai Pangkat Basis 10 – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "10^4 = \\ldots" },
      { label: "b.", math: "10^6 = \\ldots" },
      { label: "c.", math: "\\text{Berapa digit angka 0 pada } 10^8?" },
    ],
  }),
  Qn(9, "Identifikasi Pangkat Ganjil/Genap – TKA", {
    type: "mixed",
    content: "Tentukan apakah hasil bilangan berpangkat positif atau negatif:",
    parts: [
      { label: "a.", math: "(-7)^{15}: \\text{ positif atau negatif?}" },
      { label: "b.", math: "(-4)^{22}: \\text{ positif atau negatif?}" },
    ],
  }),
];

const PengertianNotasiPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const cardBg = isDark ? "bg-gradient-to-br from-sky-900/30 via-slate-900/80 to-cyan-900/30" : "bg-sky-50/95";
  const rowBg  = isDark ? "bg-white/5" : "bg-sky-100/70";
  const refBg  = isDark ? "bg-white/5" : "bg-white/70";
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      {isDark && <Starfield />}
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-sky-500/20 border-2 border-sky-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🔢</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-sky-300 text-center mb-1"
            style={{ textShadow: isDark ? '0 0 20px rgba(56,189,248,0.7)' : 'none' }}>
            PENGERTIAN DAN NOTASI PANGKAT
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bilangan Berpangkat · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 rounded-lg px-4 py-2">
            <span className="text-sky-400 text-xs font-bold">📋 9 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>
        <div className="mb-5 bg-sky-900/20 border border-sky-500/20 rounded-xl p-4">
          <p className="text-sky-300 text-xs font-bold mb-3">📐 Konsep Penting</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Definisi", math: "a^n = \\underbrace{a \\times a \\times \\cdots \\times a}_{n}" },
              { name: "Kuadrat Sempurna", math: "1,4,9,16,25,36,49,64,81,100" },
              { name: "Kubik Sempurna", math: "1,8,27,64,125,216,343" },
              { name: "Pangkat Basis 10", math: "10^n = 1\\underbrace{00\\ldots0}_{n}" },
            ].map(r => (
              <div key={r.name} className={`${refBg} rounded-lg px-3 py-2`}>
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-sky-300 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className={`absolute inset-0 backdrop-blur ${cardBg}`} />
              <div className="absolute inset-0 border border-sky-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-400 to-cyan-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/50 flex items-center justify-center shrink-0">
                    <span className="text-sky-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sky-400 text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-sky-900/20 border border-sky-500/20 rounded-lg px-4 py-3 flex justify-center"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className={`mb-3 flex justify-center ${rowBg} rounded-xl p-3`}>{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${rowBg}`}>
                            <span className="text-sky-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
            className="text-sm text-muted-foreground hover:text-sky-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Bilangan Berpangkat
          </button>
        </div>
      </div>
    </div>
  );
};
export default PengertianNotasiPage;
