import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Ruler } from "lucide-react";
import PythagorasDiagram from "./PythagorasDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string };

const accent = "#60a5fa";

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
  {
    n: 1, type: "mixed", title: "Mencari Hipotenusa — Dasar",
    diagram: (
      <PythagorasDiagram
        A={{ x: 60, y: 175, label: "A", labelDy: 14, color: "#facc15" }}
        B={{ x: 200, y: 175, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 60, y: 55, label: "C", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "8 cm", color: "#60a5fa", dy: 14 }}
        BC={{ text: "c = ?", color: "#34d399", dx: 12 }}
        CA={{ text: "6 cm", color: "#f472b6", dx: -18 }}
        vw={260} vh={220} size={230}
      />
    ),
    parts: [
      { label: "a.", math: "c^2 = 6^2 + 8^2 = 36 + 64 = ..." },
      { label: "b.", math: "c = \\sqrt{100} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 2, type: "mixed", title: "Mencari Kaki — Hipotenusa Diketahui",
    diagram: (
      <PythagorasDiagram
        A={{ x: 70, y: 175, label: "A", labelDy: 14, color: "#facc15" }}
        B={{ x: 200, y: 175, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 70, y: 55, label: "C", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "b = ?", color: "#60a5fa", dy: 14 }}
        BC={{ text: "13 cm", color: "#34d399", dx: 12 }}
        CA={{ text: "5 cm", color: "#f472b6", dx: -18 }}
        vw={260} vh={220} size={230}
      />
    ),
    parts: [
      { label: "a.", math: "b^2 = 13^2 - 5^2 = 169 - 25 = ..." },
      { label: "b.", math: "b = \\sqrt{144} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 3, type: "mixed", title: "Kaki dengan Nilai Pecahan",
    content: "Segitiga siku-siku dengan kaki 1,5 cm dan 2 cm.",
    parts: [
      { label: "a.", math: "c^2 = (1{,}5)^2 + 2^2 = 2{,}25 + 4 = ..." },
      { label: "b.", math: "c = \\sqrt{6{,}25} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 4, type: "mixed", title: "Sisi Segitiga Sama Kaki Siku-Siku",
    content: "Segitiga sama kaki siku-siku dengan kaki 10 cm.",
    parts: [
      { label: "a.", math: "c = \\sqrt{10^2 + 10^2} = \\sqrt{200} = 10\\sqrt{2}" },
      { label: "b.", math: "c \\approx ...\\ \\text{cm (2 desimal)}" },
    ],
  },
  {
    n: 5, type: "mixed", title: "Diagonal Persegi Panjang",
    content: "Persegi panjang dengan panjang 12 cm dan lebar 5 cm. Hitung panjang diagonalnya.",
    diagram: (
      <PythagorasDiagram
        A={{ x: 45, y: 180, label: "", labelDy: 14, color: "#facc15" }}
        B={{ x: 215, y: 180, label: "", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 45, y: 70, label: "", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "12 cm", color: "#60a5fa", dy: 14 }}
        BC={{ text: "d = ?", color: "#34d399", dx: 10 }}
        CA={{ text: "5 cm", color: "#f472b6", dx: -16 }}
        extras={[
          { type: 'line', x1: 215, y1: 70, x2: 215, y2: 180, color: 'rgba(255,255,255,0.3)' },
          { type: 'line', x1: 45, y1: 70, x2: 215, y2: 70, color: 'rgba(255,255,255,0.3)' },
        ]}
        vw={265} vh={225} size={235}
      />
    ),
    parts: [
      { label: "a.", math: "d^2 = 12^2 + 5^2 = 144 + 25 = ..." },
      { label: "b.", math: "d = \\sqrt{169} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 6, type: "mixed", title: "Kaki dengan Ekspresi Aljabar",
    content: "Segitiga siku-siku dengan kaki-kaki (2x) cm dan (x) cm. Hipotenusa 15 cm.",
    parts: [
      { label: "a.", math: "15^2 = (2x)^2 + x^2" },
      { label: "b.", math: "225 = 5x^2" },
      { label: "c.", math: "x = \\sqrt{45} = 3\\sqrt{5} \\approx ...\\ \\text{cm}" },
    ],
  },
  {
    n: 7, type: "mixed", title: "Kaki 28 dan 45",
    content: "Tentukan hipotenusa segitiga siku-siku dengan kaki 28 cm dan 45 cm.",
    parts: [
      { label: "a.", math: "c^2 = 28^2 + 45^2 = 784 + 2025 = ..." },
      { label: "b.", math: "c = \\sqrt{2809} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 8, type: "mixed", title: "Tinggi Segitiga Sama Kaki",
    content: "Segitiga sama kaki dengan sisi 13 cm dan alas 10 cm. Hitung tingginya dengan Pythagoras.",
    diagram: (
      <PythagorasDiagram
        A={{ x: 130, y: 55, label: "A", labelDy: -12, color: "#facc15" }}
        B={{ x: 50, y: 180, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 210, y: 180, label: "C", labelDy: 14, color: "#f472b6" }}
        rightAngleAt="B"
        AB={{ text: "13 cm", color: "#34d399", dx: -14 }}
        BC={{ text: "5 cm", color: "#60a5fa", dy: 14 }}
        CA={{ text: "13 cm", color: "#a78bfa", dx: 14 }}
        extras={[
          { type: 'line', x1: 130, y1: 55, x2: 130, y2: 180, color: '#facc15', dashed: true, label: 'h', lx: 10, ly: -5 },
          { type: 'text', x: 90, y: 180, text: '← 5 cm →', color: '#60a5fa', size: 9 },
        ]}
        vw={265} vh={225} size={235}
      />
    ),
    parts: [
      { label: "a.", text: "Garis tinggi membagi alas menjadi dua bagian sama. Berapa panjang tiap bagian?" },
      { label: "b.", math: "h^2 = 13^2 - 5^2 = 169 - 25 = ..." },
      { label: "c.", math: "h = \\sqrt{144} = ...\\ \\text{cm}" },
    ],
  },
];

const MenghitungPanjangPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Ruler className="w-7 h-7" style={{ color: accent }} />
          <h1 className="font-display text-lg md:text-xl font-bold text-center" style={{ color: accent, textShadow: '0 0 20px #60a5fa88' }}>
            MENGHITUNG PANJANG SISI SEGITIGA SIKU-SIKU
          </h1>
        </div>
        <p className="text-white/40 text-xs text-center mb-1 font-body">Kelas 8 · {t('practice.breadcrumb')} · 8 Soal</p>
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

export default MenghitungPanjangPage;
