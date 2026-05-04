import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Triangle } from "lucide-react";
import PythagorasDiagram from "./PythagorasDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string };

const accent = "#fb923c";

const badge = (label: string, color: string) => (
  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mr-2 uppercase tracking-wider"
    style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}>{label}</span>
);

const rp = (p: Part, i: number) => (
  <div key={i} className="flex gap-2 items-start">
    <span className="text-xs font-bold mt-0.5 shrink-0" style={{ color: accent }}>{p.label}</span>
    <div className="text-sm text-white/85 font-body leading-relaxed">
      {p.math ? <InlineMath math={p.math} /> : p.text}
    </div>
  </div>
);

const questions: Q[] = [
  { n: 1, type: "mixed", title: "Aturan Jenis Segitiga",
    content: "Untuk segitiga dengan sisi a ≤ b ≤ c, berlaku:",
    parts: [
      { label: "Siku-siku:", math: "a^2 + b^2 = c^2" },
      { label: "Lancip:", math: "a^2 + b^2 > c^2" },
      { label: "Tumpul:", math: "a^2 + b^2 < c^2" },
      { label: "Tanyakan:", text: "Sebutkan sisi mana yang selalu dijadikan c (sisi terbesar)." },
    ],
  },
  { n: 2, type: "mixed", title: "TKA — Menentukan Jenis dari Angka",
    content: "Tanpa menggambar, tentukan jenis segitiga berikut:",
    parts: [
      { label: "a.", math: "\\{11,\\ 12,\\ 15\\}" },
      { label: "b.", math: "\\{9,\\ 40,\\ 41\\}" },
      { label: "c.", math: "\\{10,\\ 11,\\ 16\\}" },
      { label: "d.", math: "\\{6,\\ 6,\\ 6\\}" },
    ],
  },
  { n: 3, type: "mixed", title: "Segitiga dengan Irasional",
    content: "Tentukan jenis segitiga dengan sisi 3, 5, dan √35.",
    parts: [
      { label: "a.", math: "3^2 + 5^2 = 9 + 25 = 34" },
      { label: "b.", math: "(\\sqrt{35})^2 = 35" },
      { label: "c.", math: "34 < 35 \\Rightarrow \\text{segitiga } ..." },
    ],
  },
  { n: 4, type: "mixed", title: "ANBK — Benar/Salah",
    content: "Tentukan BENAR (B) atau SALAH (S):",
    parts: [
      { label: "(1)", text: "Segitiga dengan sisi 6, 8, 10 adalah segitiga siku-siku." },
      { label: "(2)", text: "Semua segitiga sama sisi adalah segitiga lancip." },
      { label: "(3)", text: "Segitiga dengan sisi 3, 4, 6 adalah segitiga tumpul." },
      { label: "(4)", text: "Jika a² + b² = c², maka segitiga tersebut adalah segitiga lancip." },
    ],
  },
  { n: 5, type: "mixed", title: "Menentukan Jenis 5 Segitiga",
    content: "Tentukan jenis masing-masing segitiga:",
    parts: [
      { label: "a.", math: "\\{2,\\ 4,\\ 5\\}" },
      { label: "b.", math: "\\{6,\\ 6,\\ 6\\}" },
      { label: "c.", math: "\\{5,\\ 12,\\ 13\\}" },
      { label: "d.", math: "\\{4,\\ 4,\\ 6\\}" },
      { label: "e.", math: "\\{10,\\ 10,\\ 10\\sqrt{2}\\}" },
    ],
  },
  { n: 6, type: "mixed", title: "Mengklasifikasi 5 Segitiga Sekaligus",
    content: "Tentukan jenis kelima segitiga berikut:",
    parts: [
      { label: "1.", math: "\\{6,\\ 8,\\ 9\\}" },
      { label: "2.", math: "\\{9,\\ 12,\\ 15\\}" },
      { label: "3.", math: "\\{7,\\ 8,\\ 12\\}" },
      { label: "4.", math: "\\{1,\\ \\sqrt{3},\\ 2\\}" },
      { label: "5.", math: "\\{3,\\ 3,\\ 3\\sqrt{2}\\}" },
    ],
  },
];

const JenisSegitigaPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Triangle className="w-7 h-7" style={{ color: accent }} />
          <h1 className="font-display text-lg md:text-xl font-bold text-center" style={{ color: accent, textShadow: '0 0 20px #fb923c88' }}>
            PYTHAGORAS DAN JENIS-JENIS SEGITIGA
          </h1>
        </div>
        <p className="text-white/40 text-xs text-center mb-1 font-body">Kelas 8 · Latihan Mandiri · 6 Soal</p>
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {badge("UN/USBN", "#34d399")}
          {badge("ANBK", "#60a5fa")}
          {badge("TKA", "#f472b6")}
        </div>
        <div className="flex flex-col gap-5">
          {questions.map((q) => (
            <div key={q.n} className="rounded-2xl border overflow-hidden"
              style={{ background: 'rgba(10,15,40,0.85)', borderColor: `${accent}33`, boxShadow: `0 0 12px ${accent}11` }}>
              <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: `${accent}22`, background: `${accent}11` }}>
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-display shrink-0"
                  style={{ background: `${accent}22`, color: accent, border: `1.5px solid ${accent}55` }}>{q.n}</span>
                <span className="text-sm font-bold text-white/90 font-display">{q.title}</span>
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                {q.diagram && <div className="flex justify-center my-1">{q.diagram}</div>}
                {q.content && <p className="text-sm text-white/80 font-body leading-relaxed">{q.content}</p>}
                {q.math && <div className="text-sm text-white/90"><BlockMath math={q.math} /></div>}
                {q.parts && (
                  <div className="flex flex-col gap-2 mt-1 pl-2 border-l-2" style={{ borderColor: `${accent}44` }}>
                    {q.parts.map(rp)}
                  </div>
                )}
                <div className="mt-2 rounded-xl p-3 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)' }}>
                  <span className="text-white/30 text-xs font-body">Jawaban:</span>
                  <div className="flex-1 border-b border-dashed border-white/10 min-h-[18px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/teorema-pythagoras"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Teorema Pythagoras
          </button>
        </div>
      </div>
    </div>
  );
};

export default JenisSegitigaPage;
