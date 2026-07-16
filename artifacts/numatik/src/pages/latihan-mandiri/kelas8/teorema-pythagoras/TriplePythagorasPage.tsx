import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Star } from "lucide-react";
import PythagorasDiagram from "./PythagorasDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string };

const accent = "#34d399";

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
  { n: 1, type: "mixed", title: "Triple Dasar 3-4-5",
    diagram: (
      <PythagorasDiagram
        A={{ x: 65, y: 175, label: "A", labelDy: 14, color: "#facc15" }}
        B={{ x: 195, y: 175, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 65, y: 55, label: "C", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "4", color: "#60a5fa", dy: 14 }}
        BC={{ text: "5", color: "#34d399", dx: 12 }}
        CA={{ text: "3", color: "#f472b6", dx: -12 }}
        vw={260} vh={220} size={230}
      />
    ),
    parts: [
      { label: "a.", math: "3^2 + 4^2 = 9 + 16 = ..." },
      { label: "b.", math: "5^2 = ..." },
      { label: "c.", text: "Apakah 3, 4, 5 merupakan triple Pythagoras? Jelaskan!" },
    ],
  },
  { n: 2, type: "mixed", title: "Triple 5-12-13",
    parts: [
      { label: "a.", math: "5^2 + 12^2 = 25 + 144 = ..." },
      { label: "b.", math: "13^2 = ..." },
      { label: "c.", text: "Apakah 5, 12, 13 membentuk segitiga siku-siku?" },
    ],
  },
  { n: 3, type: "mixed", title: "Triple 8-15-17",
    parts: [
      { label: "a.", math: "8^2 + 15^2 = 64 + 225 = ..." },
      { label: "b.", math: "17^2 = ..." },
      { label: "c.", text: "Apakah 8, 15, 17 merupakan triple Pythagoras?" },
    ],
  },
  { n: 4, type: "mixed", title: "Triple 7-24-25",
    parts: [
      { label: "a.", math: "7^2 + 24^2 = 49 + 576 = ..." },
      { label: "b.", math: "25^2 = ..." },
      { label: "c.", text: "Konfirmasi bahwa 7, 24, 25 adalah triple Pythagoras." },
    ],
  },
  { n: 5, type: "mixed", title: "Mengenali Triple Pythagoras",
    content: "Tentukan mana yang merupakan triple Pythagoras:",
    parts: [
      { label: "a.", math: "\\{6,\\ 8,\\ 10\\}" },
      { label: "b.", math: "\\{5,\\ 7,\\ 9\\}" },
      { label: "c.", math: "\\{9,\\ 12,\\ 15\\}" },
      { label: "d.", math: "\\{4,\\ 6,\\ 8\\}" },
    ],
  },
  { n: 6, type: "mixed", title: "Melengkapi Triple Pythagoras",
    content: "Temukan bilangan ketiga agar menjadi triple Pythagoras:",
    parts: [
      { label: "a.", math: "\\{3,\\ 4,\\ ?\\}" },
      { label: "b.", math: "\\{5,\\ ?,\\ 13\\}" },
      { label: "c.", math: "\\{?,\\ 24,\\ 25\\}" },
      { label: "d.", math: "\\{8,\\ ?,\\ 17\\}" },
    ],
  },
  { n: 7, type: "mixed", title: "Triple 9-40-41",
    parts: [
      { label: "a.", math: "9^2 + 40^2 = 81 + 1600 = ..." },
      { label: "b.", math: "41^2 = ..." },
      { label: "c.", text: "Apakah 9, 40, 41 adalah triple Pythagoras?" },
    ],
  },
  { n: 8, type: "mixed", title: "Triple 20-21-29",
    parts: [
      { label: "a.", math: "20^2 + 21^2 = 400 + 441 = ..." },
      { label: "b.", math: "29^2 = ..." },
      { label: "c.", text: "Konfirmasi apakah 20, 21, 29 adalah triple Pythagoras." },
    ],
  },
  { n: 9, type: "mixed", title: "Identifikasi Triple dari Kelipatan",
    content: "Diketahui triple dasar 8-15-17. Tentukan apakah berikut ini juga triple Pythagoras:",
    parts: [
      { label: "a.", math: "\\{16,\\ 30,\\ 34\\}" },
      { label: "b.", math: "\\{24,\\ 45,\\ 51\\}" },
      { label: "c.", math: "\\{40,\\ 75,\\ 85\\}" },
    ],
  },
  { n: 10, type: "mixed", title: "ANBK — Pilih yang Merupakan Triple",
    content: "Dari pilihan berikut, mana yang merupakan triple Pythagoras? (Pilih semua yang benar)",
    parts: [
      { label: "(A)", math: "3, 4, 5" },
      { label: "(B)", math: "6, 7, 8" },
      { label: "(C)", math: "5, 12, 13" },
      { label: "(D)", math: "10, 24, 26" },
    ],
  },
  { n: 11, type: "mixed", title: "Aplikasi Triple — Taman Kota",
    content: "Taman kota berbentuk segitiga siku-siku dengan sisi 30 m, 40 m, dan 50 m.",
    parts: [
      { label: "a.", text: "Apakah ini kelipatan triple 3-4-5?" },
      { label: "b.", math: "30^2 + 40^2 = 900 + 1600 = ...\\ \\text{dan}\\ 50^2 = ..." },
      { label: "c.", math: "\\text{Luas taman} = \\frac{1}{2} \\times 30 \\times 40 = ...\\ \\text{m}^2" },
    ],
  },
];

const TriplePythagorasPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-7 h-7" style={{ color: accent }} />
          <h1 className="font-display text-lg md:text-xl font-bold text-center" style={{ color: accent, textShadow: '0 0 20px #34d39988' }}>
            TRIPLE PYTHAGORAS
          </h1>
        </div>
        <p className="text-white/40 text-xs text-center mb-1 font-body">Kelas 8 · {t('practice.breadcrumb')} · 11 Soal</p>
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
            {t('practice.backTo')} Teorema Pythagoras
          </button>
        </div>
      </div>
    </div>
  );
};

export default TriplePythagorasPage;
