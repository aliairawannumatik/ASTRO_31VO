import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Shuffle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const pageUi = {
  id: { title: "PENYELESAIAN SPLDV — METODE CAMPURAN" },
  en: { title: "SOLVING SLETV — MIXED METHOD" },
  ja: { title: "連立方程式 — 混合法" },
};

const accentColor = "#f472b6";
const accentDim = "rgba(244,114,182,0.12)";
const borderColor = "rgba(244,114,182,0.25)";

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
  Qf(1, "Langkah Metode Campuran", {
    badge: "ANBK", type: "mixed",
    content: "Metode campuran menggabungkan eliminasi (untuk menghilangkan satu variabel) dan substitusi (untuk mencari variabel yang lain).",
    blockMath: "\\begin{cases} 3x + 2y = 16 \\\\ 2x - y = 6 \\end{cases}",
    parts: [
      { label: "Langkah 1:", text: "Eliminasi y: kalikan pers. kedua × 2, lalu jumlahkan." },
      { label: "Langkah 2:", text: "Dari nilai x, substitusikan ke salah satu persamaan untuk mencari y." },
      { label: "Langkah 3:", text: "Tulis HP dan verifikasi." },
    ],
  }),
  Qf(2, "Koefisien Besar — Campuran", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 7x + 4y = 41 \\\\ 3x - 2y = 7 \\end{cases}",
    parts: [
      { label: "a.", text: "Eliminasi y (kalikan pers. kedua × 2, jumlahkan)." },
      { label: "b.", text: "Substitusikan nilai x ke pers. kedua untuk cari y." },
    ],
  }),
  Qf(3, "Campuran — Hasil HP", {
    badge: "ANBK", type: "mixed",
    blockMath: "\\begin{cases} 5x - 3y = 7 \\\\ 2x + 5y = 19 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan pers. pertama × 5 dan pers. kedua × 3." },
      { label: "b.", text: "Jumlahkan untuk menghilangkan y." },
      { label: "c.", text: "Tentukan x dan y." },
    ],
  }),
  Qf(4, "Campuran — Soal Panjang", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 11x + 7y = 68 \\\\ 3x - 5y = -6 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan pers. pertama × 5 dan pers. kedua × 7." },
      { label: "b.", text: "Jumlahkan untuk hilangkan y." },
      { label: "c.", text: "Tentukan x, lalu y." },
    ],
  }),
  Qf(5, "Campuran — Ubah Persamaan", {
    badge: "ANBK", type: "mixed",
    blockMath: "\\begin{cases} 2(x+y) = 3x + 4 \\\\ 3x - 2y = 6 \\end{cases}",
    parts: [
      { label: "a.", text: "Sederhanakan persamaan pertama terlebih dahulu." },
      { label: "b.", text: "Selesaikan SPLDV yang sudah disederhanakan dengan campuran." },
    ],
  }),
  Qf(6, "Pecahan — Campuran", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} \\frac{x}{2} + \\frac{y}{3} = 4 \\\\ \\frac{x}{4} + \\frac{y}{2} = 3 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan pers. pertama dengan 6 dan pers. kedua dengan 4 untuk menghilangkan penyebut." },
      { label: "b.", text: "Eliminasi y: kurangkan pers. kedua dari pertama untuk mencari x." },
      { label: "c.", text: "Substitusikan x untuk mencari y, kemudian verifikasi." },
    ],
  }),
  Qf(7, "Campuran — Soal Campuran Kontekstual", {
    badge: "AKM", type: "mixed",
    content: "Sebuah parkiran menampung sepeda motor dan mobil. Jumlah kendaraan = 50. Jumlah roda = 136. (Motor = 2 roda, Mobil = 4 roda)",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV (motor = x, mobil = y)." },
      { label: "b.", text: "Selesaikan dengan campuran." },
      { label: "c.", text: "Berapa jumlah motor dan mobil?" },
    ],
  }),
  Qf(8, "Soal Beli Online", {
    badge: "AKM", type: "mixed",
    content: "Hani membeli 3 buku A dan 2 buku B seharga Rp 78.000. Dani membeli 1 buku A dan 4 buku B seharga Rp 74.000.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV." },
      { label: "b.", text: "Selesaikan dengan campuran." },
      { label: "c.", text: "Berapa harga masing-masing buku?" },
    ],
  }),
];

const MetodeCampuranPage = () => {
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
            <Shuffle className="w-8 h-8" style={{ color: accentColor }} />
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
              <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor, background: "rgba(244,114,182,0.08)" }}>
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
                    style={{ background: "rgba(244,114,182,0.08)", border: `1px solid ${borderColor}` }}>
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

export default MetodeCampuranPage;
