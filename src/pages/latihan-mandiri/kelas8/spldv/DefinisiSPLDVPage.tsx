import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Layers } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const pageUi = {
  id: { title: "DEFINISI DAN BENTUK UMUM SPLDV" },
  en: { title: "DEFINITION & STANDARD FORM OF SLETV" },
  ja: { title: "連立方程式の定義と標準形" },
};

const accentColor = "#a78bfa";
const accentDim = "rgba(167,139,250,0.13)";
const borderColor = "rgba(167,139,250,0.25)";

type Part = { label: string; math?: string; text?: string };
type Badge = "UN" | "ANBK" | "TKA" | "AKM";
type Q = {
  n: number; title: string;
  content?: string; math?: string; blockMath?: string;
  parts?: Part[];
  badge?: Badge;
  type: "essay" | "mixed";
};

const badgeStyle: Record<Badge, string> = {
  UN: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40",
  ANBK: "bg-blue-500/20 text-blue-300 border-blue-400/40",
  TKA: "bg-orange-500/20 text-orange-300 border-orange-400/40",
  AKM: "bg-green-500/20 text-green-300 border-green-400/40",
};

const Q = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Q(1, "Mengenal PLDV", {
    badge: "ANBK",
    type: "mixed",
    content: "Perhatikan persamaan-persamaan berikut. Tentukan mana yang merupakan Persamaan Linear Dua Variabel (PLDV).",
    parts: [
      { label: "a.", math: "2x + 3y = 7" },
      { label: "b.", math: "x^2 + y = 5" },
      { label: "c.", math: "4x - 2y = 10" },
      { label: "d.", math: "x + y^2 = 9" },
      { label: "e.", math: "3x - 5y = 0" },
    ],
  }),
  Q(2, "Identifikasi SPLDV", {
    badge: "TKA",
    type: "mixed",
    content: "Dari sistem persamaan berikut, manakah yang merupakan SPLDV? Berikan alasanmu!",
    parts: [
      { label: "a.", math: "\\begin{cases} x + y = 10 \\\\ x - y = 4 \\end{cases}" },
      { label: "b.", math: "\\begin{cases} x^2 + y = 6 \\\\ x + y = 3 \\end{cases}" },
      { label: "c.", math: "\\begin{cases} 2x + 3y = 12 \\\\ x = 4 \\end{cases}" },
      { label: "d.", math: "\\begin{cases} xy = 6 \\\\ x + y = 5 \\end{cases}" },
    ],
  }),
  Q(3, "Penyelesaian SPLDV", {
    badge: "ANBK",
    type: "mixed",
    content: "Diketahui SPLDV:",
    blockMath: "\\begin{cases} x + y = 10 \\\\ x - y = 4 \\end{cases}",
    parts: [
      { label: "a.", text: "Periksa apakah pasangan (7, 3) merupakan penyelesaian sistem tersebut!" },
      { label: "b.", text: "Periksa apakah pasangan (6, 4) merupakan penyelesaian sistem tersebut!" },
      { label: "c.", text: "Ada berapa penyelesaian SPLDV pada umumnya?" },
    ],
  }),
  Q(4, "Verifikasi Solusi", {
    badge: "UN",
    type: "mixed",
    content: "Periksa apakah setiap pasangan berurutan berikut merupakan penyelesaian SPLDV:",
    blockMath: "\\begin{cases} 2x + y = 8 \\\\ x - y = 1 \\end{cases}",
    parts: [
      { label: "a.", math: "(3, 2)" },
      { label: "b.", math: "(4, 0)" },
      { label: "c.", math: "(2, 4)" },
      { label: "d.", math: "(5, -2)" },
    ],
  }),
  Q(5, "Himpunan Penyelesaian — Identifikasi", {
    badge: "UN",
    type: "mixed",
    content: "Tanpa mencari solusinya, tentukan jenis penyelesaian (ada solusi, tidak ada solusi, atau tak hingga solusi) dari setiap SPLDV berikut. Untuk soal (d)–(g), gunakan cara melihat perbandingan koefisiennya:",
    parts: [
      { label: "a.", math: "\\begin{cases} 2x + 4y = 8 \\\\ x + 2y = 4 \\end{cases}" },
      { label: "b.", math: "\\begin{cases} x + y = 5 \\\\ x + y = 7 \\end{cases}" },
      { label: "c.", math: "\\begin{cases} 3x - y = 4 \\\\ 6x - 2y = 8 \\end{cases}" },
      { label: "d.", math: "\\begin{cases} x + 2y = 6 \\\\ 2x + 4y = 12 \\end{cases}" },
      { label: "e.", math: "\\begin{cases} 3x - y = 4 \\\\ x + 2y = 5 \\end{cases}" },
      { label: "f.", math: "\\begin{cases} 2x + 6y = 10 \\\\ x + 3y = 8 \\end{cases}" },
      { label: "g.", math: "\\begin{cases} 4x - 2y = 8 \\\\ -2x + y = -4 \\end{cases}" },
    ],
  }),
  Q(6, "Mengubah ke Bentuk Standar", {
    badge: "ANBK",
    type: "mixed",
    content: "Ubah setiap persamaan berikut ke bentuk standar ax + by = c, dengan a, b, dan c berupa bilangan bulat:",
    parts: [
      { label: "a.", math: "y = 3x - 5" },
      { label: "b.", math: "\\frac{x}{2} + \\frac{y}{3} = 1" },
      { label: "c.", math: "2(x+1) = 3(y-2) + 4" },
      { label: "d.", math: "0.5x - 1.5y = 6" },
    ],
  }),
  Q(7, "Penyelesaian Tunggal", {
    badge: "ANBK",
    type: "mixed",
    content: "Diketahui SPLDV:",
    blockMath: "\\begin{cases} 2x + y = 7 \\\\ x - y = 2 \\end{cases}",
    parts: [
      { label: "a.", text: "Berapa banyak penyelesaian SPLDV ini? Jelaskan tanpa menghitung!" },
      { label: "b.", text: "Periksa apakah (3, 1) memenuhi kedua persamaan tersebut." },
      { label: "c.", text: "Adakah pasangan lain yang memenuhi kedua persamaan?" },
    ],
  }),
  Q(8, "Substitusi Cepat — Verifikasi", {
    badge: "TKA",
    type: "mixed",
    content: "Tanpa menyelesaikan SPLDV, periksa apakah solusi berikut benar:",
    parts: [
      { label: "a.", math: "\\begin{cases} x + y = 5 \\\\ 2x - y = 4 \\end{cases} \\Rightarrow (3, 2)?" },
      { label: "b.", math: "\\begin{cases} 3x + 2y = 13 \\\\ x - y = 1 \\end{cases} \\Rightarrow (3, 2)?" },
      { label: "c.", math: "\\begin{cases} 4x - y = 10 \\\\ x + 3y = 9 \\end{cases} \\Rightarrow (3, 2)?" },
    ],
  }),
  Q(9, "Soal UN {t('practice.multipleChoice')} Style", {
    badge: "UN",
    type: "mixed",
    content: "Pasangan bilangan yang merupakan penyelesaian dari SPLDV:",
    blockMath: "\\begin{cases} 2x + 3y = 16 \\\\ x - y = 1 \\end{cases}",
    parts: [
      { label: "A.", math: "(1, 4)" },
      { label: "B.", math: "(5, 2)" },
      { label: "C.", math: "(4, 3)" },
      { label: "D.", math: "(3, 4)" },
    ],
  }),
  Q(10, "SPLDV dari Konteks", {
    badge: "UN",
    type: "mixed",
    content: "Theo membeli 3 kg mangga dan 2 kg jeruk seharga Rp 54.000. Remy membeli 1 kg mangga dan 4 kg jeruk seharga Rp 42.000.",
    parts: [
      { label: "a.", text: "Misal harga mangga = x dan harga jeruk = y. Tuliskan SPLDV-nya." },
      { label: "b.", text: "Periksa apakah harga 1 kg mangga adalah Rp10.000 dan harga 1 kg jeruk Rp12.000 merupakan penyelesaian dari permasalahan pada soal." },
      { label: "c.", text: "Periksa apakah harga 1 kg mangga adalah Rp12.000 dan harga 1 kg jeruk Rp9.000 merupakan penyelesaian dari permasalahan pada soal." },
    ],
  }),
  Q(11, "ANBK — Benar atau Salah", {
    badge: "ANBK",
    type: "mixed",
    content: "Tentukan pernyataan BENAR (B) atau SALAH (S):",
    parts: [
      { label: "(1)", text: "SPLDV selalu memiliki tepat satu penyelesaian." },
      { label: "(2)", text: "Jika koefisien x dan y pada dua persamaan sebanding tapi konstantanya tidak, maka tidak ada penyelesaian." },
      { label: "(3)", text: "Setiap PLDV dapat dijadikan bagian dari suatu SPLDV." },
      { label: "(4)", text: "Penyelesaian SPLDV berupa pasangan bilangan (x, y) yang memenuhi kedua persamaan." },
    ],
  }),
];

const DefinisiSPLDVPage = () => {
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
            <Layers className="w-8 h-8" style={{ color: accentColor }} />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-center mb-1"
            style={{ color: accentColor, textShadow: `0 0 24px ${accentColor}88` }}>
            {pu.title}
          </h1>
          <p className="text-white/40 text-xs font-body text-center">Kelas 8 · {t('practice.breadcrumb')} · 11 Soal</p>
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            {(["UN","ANBK","TKA","AKM"] as Badge[]).map(b => (
              <span key={b} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle[b]}`}>{b}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q) => (
            <div key={q.n} className="rounded-2xl overflow-hidden border"
              style={{ background: accentDim, borderColor }}>
              <div className="flex items-center gap-3 px-5 py-3 border-b"
                style={{ borderColor, background: "rgba(167,139,250,0.08)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: accentColor + "30", color: accentColor }}>
                  {q.n}
                </div>
                <span className="font-display text-sm font-bold" style={{ color: accentColor }}>{q.title}</span>
                {q.badge && (
                  <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${badgeStyle[q.badge]}`}>
                    {q.badge}
                  </span>
                )}
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                {q.content && <p className="font-body text-sm text-white/85 leading-relaxed">{q.content}</p>}
                {q.math && <div className="text-white/90 text-sm"><InlineMath math={q.math} /></div>}
                {q.blockMath && (
                  <div className="rounded-xl px-4 py-3 text-white/90 overflow-x-auto"
                    style={{ background: "rgba(167,139,250,0.08)", border: `1px solid ${borderColor}` }}>
                    <BlockMath math={q.blockMath} />
                  </div>
                )}
                {q.parts && (
                  <div className="flex flex-col gap-2 mt-1">
                    {q.parts.map((p, pi) => (
                      <div key={pi} className="flex items-start gap-2">
                        <span className="font-bold text-xs shrink-0 mt-0.5" style={{ color: accentColor }}>{p.label}</span>
                        <span className="font-body text-sm text-white/80 leading-relaxed">
                          {p.text && p.text}
                          {p.math && <InlineMath math={p.math} />}
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

export default DefinisiSPLDVPage;
