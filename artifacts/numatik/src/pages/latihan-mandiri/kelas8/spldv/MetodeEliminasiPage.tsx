import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Minus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const pageUi = {
  id: { title: "PENYELESAIAN SPLDV — METODE ELIMINASI" },
  en: { title: "SOLVING SLETV — ELIMINATION METHOD" },
  ja: { title: "連立方程式 — 加減法" },
};

const accentColor = "#fb923c";
const accentDim = "rgba(251,146,60,0.12)";
const borderColor = "rgba(251,146,60,0.25)";

type Part = { label: string; math?: string; text?: string };
type Badge = "UN" | "ANBK" | "TKA" | "AKM";
type Q = { n: number; title: string; content?: string; math?: string; blockMath?: string; parts?: Part[]; badge?: Badge; type: "essay" | "mixed"; };
const badgeStyle: Record<Badge, string> = {
  UN: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40",
  ANBK: "bg-blue-500/20 text-blue-300 border-blue-400/40",
  TKA: "bg-orange-500/20 text-orange-300 border-orange-400/40",
  AKM: "bg-green-500/20 text-green-300 border-green-400/40",
};
const Qf = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qf(1, "Eliminasi Langsung — Koefisien Sama", {
    badge: "ANBK", type: "mixed",
    blockMath: "\\begin{cases} x + y = 9 \\\\ x - y = 3 \\end{cases}",
    parts: [
      { label: "a.", text: "Jumlahkan kedua persamaan untuk menghilangkan y." },
      { label: "b.", text: "Kurangkan persamaan kedua dari pertama untuk menghilangkan x." },
      { label: "c.", text: "Tentukan HP = {(x, y)}." },
    ],
  }),
  Qf(2, "Eliminasi — Menghilangkan x", {
    badge: "UN", type: "mixed",
    blockMath: "\\begin{cases} 3x + 2y = 16 \\\\ 3x - y = 10 \\end{cases}",
    parts: [
      { label: "a.", text: "Kurangkan persamaan kedua dari pertama untuk menghilangkan x." },
      { label: "b.", text: "Tentukan nilai y." },
      { label: "c.", text: "Substitusikan kembali untuk mencari x." },
    ],
  }),
  Qf(3, "Perkalian Dulu", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 2x + 3y = 13 \\\\ x + 2y = 8 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan persamaan kedua dengan 2 agar koefisien x sama." },
      { label: "b.", text: "Kurangkan untuk menghilangkan x dan cari y." },
      { label: "c.", text: "Substitusikan kembali untuk mencari x." },
    ],
  }),
  Qf(4, "Eliminasi — Koefisien Negatif", {
    badge: "UN", type: "mixed",
    blockMath: "\\begin{cases} 4x - y = 10 \\\\ 2x + 3y = 12 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan persamaan pertama dengan 3 agar koefisien y berlawanan." },
      { label: "b.", text: "Jumlahkan kedua persamaan untuk menghilangkan y, lalu cari x." },
      { label: "c.", text: "Substitusikan nilai x untuk mencari y, kemudian verifikasi." },
    ],
  }),
  Qf(5, "Eliminasi — Dua Kali Perkalian", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 3x + 4y = 25 \\\\ 2x + 3y = 18 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan persamaan pertama dengan 2 dan persamaan kedua dengan 3." },
      { label: "b.", text: "Eliminasi x, tentukan y." },
      { label: "c.", text: "Tentukan x." },
    ],
  }),
  Qf(6, "Perkalian Berbeda — Eliminasi y", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 2x + 3y = 20 \\\\ 5x + 4y = 35 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan pers. pertama × 4 dan pers. kedua × 3." },
      { label: "b.", text: "Kurangkan untuk menghilangkan y." },
      { label: "c.", text: "Tentukan x, lalu y." },
    ],
  }),
  Qf(7, "Eliminasi — Pecahan", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} \\frac{x}{2} + \\frac{y}{3} = 2 \\\\ \\frac{x}{3} - \\frac{y}{4} = 1 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan persamaan pertama dengan 6 dan persamaan kedua dengan 12." },
      { label: "b.", text: "Selesaikan dengan eliminasi." },
    ],
  }),
  Qf(8, "Soal UN — Harga Barang", {
    badge: "UN", type: "mixed",
    content: "Harga 2 kemeja dan 3 celana = Rp 340.000. Harga 3 kemeja dan 2 celana = Rp 360.000.",
    parts: [
      { label: "a.", text: "Misal harga kemeja = x dan celana = y. Tuliskan SPLDV." },
      { label: "b.", text: "Selesaikan dengan metode eliminasi." },
      { label: "c.", text: "Tentukan harga 1 kemeja dan 1 celana." },
    ],
  }),
];

const MetodeEliminasiPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const pu = pageUi[language as keyof typeof pageUi] ?? pageUi.id;
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: accentDim, border: `1.5px solid ${borderColor}` }}>
            <Minus className="w-8 h-8" style={{ color: accentColor }} />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-center mb-1"
            style={{ color: accentColor, textShadow: `0 0 24px ${accentColor}88` }}>
            {pu.title}
          </h1>
          <p className="text-white/40 text-xs font-body text-center">Kelas 8 · {t('practice.breadcrumb')} · 8 Soal</p>
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            {(["UN","ANBK","TKA","AKM"] as Badge[]).map(b => (
              <span key={b} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle[b]}`}>{b}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q) => (
            <div key={q.n} className="rounded-2xl overflow-hidden border" style={{ background: accentDim, borderColor }}>
              <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor, background: "rgba(251,146,60,0.08)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: accentColor + "30", color: accentColor }}>{q.n}</div>
                <span className="font-display text-sm font-bold" style={{ color: accentColor }}>{q.title}</span>
                {q.badge && <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${badgeStyle[q.badge]}`}>{q.badge}</span>}
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                {q.content && <p className="font-body text-sm text-white/85 leading-relaxed">{q.content}</p>}
                {q.math && <div className="text-white/90 text-sm"><InlineMath math={q.math} /></div>}
                {q.blockMath && (
                  <div className="rounded-xl px-4 py-3 text-white/90 overflow-x-auto"
                    style={{ background: "rgba(251,146,60,0.08)", border: `1px solid ${borderColor}` }}>
                    <BlockMath math={q.blockMath} />
                  </div>
                )}
                {q.parts && (
                  <div className="flex flex-col gap-2 mt-1">
                    {q.parts.map((p, pi) => (
                      <div key={pi} className="flex items-start gap-2">
                        <span className="font-bold text-xs shrink-0 mt-0.5" style={{ color: accentColor }}>{p.label}</span>
                        <span className="font-body text-sm text-white/80 leading-relaxed">
                          {p.text && p.text}{p.math && <InlineMath math={p.math} />}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/spldv"); }}
            className="text-sm text-white/40 hover:text-white/80 transition-colors cursor-pointer font-body">
            ← {t('practice.backToMenu')} SPLDV
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetodeEliminasiPage;
