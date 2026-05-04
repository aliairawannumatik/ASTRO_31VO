import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Globe } from "lucide-react";
import PythagorasDiagram from "./PythagorasDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string };

const accent = "#facc15";

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
  { n: 1, type: "mixed", title: "Tangga dan Dinding",
    diagram: (
      <PythagorasDiagram
        A={{ x: 60, y: 185, label: "A", labelDy: 14, color: "#facc15" }}
        B={{ x: 195, y: 185, label: "B", labelDy: 14, color: "#60a5fa" }}
        C={{ x: 60, y: 50, label: "C", labelDy: -12, color: "#f472b6" }}
        rightAngleAt="A"
        AB={{ text: "8 m", color: "#60a5fa", dy: 14 }}
        BC={{ text: "17 m", color: "#34d399", dx: 14 }}
        CA={{ text: "h = ?", color: "#f472b6", dx: -18 }}
        extras={[
          { type: 'line', x1: 60, y1: 185, x2: 60, y2: 50, color: 'rgba(255,255,255,0.15)' },
          { type: 'text', x: 130, y: 100, text: '🪜 Tangga', color: '#34d399', size: 10 },
        ]}
        vw={255} vh={218} size={228}
      />
    ),
    content: "Sebuah tangga sepanjang 17 m bersandar di dinding. Kaki tangga berjarak 8 m dari dinding.",
    parts: [
      { label: "a.", math: "h^2 = 17^2 - 8^2 = 289 - 64 = ..." },
      { label: "b.", math: "h = \\sqrt{225} = ...\\ \\text{m}" },
      { label: "c.", text: "Berapa meter tinggi dinding yang dicapai tangga?" },
    ],
  },
];

const MasalahKontekstualPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Globe className="w-7 h-7" style={{ color: accent }} />
          <h1 className="font-display text-lg md:text-xl font-bold text-center" style={{ color: accent, textShadow: '0 0 20px #facc1588' }}>
            PENERAPAN TEOREMA PYTHAGORAS
          </h1>
        </div>
        <p className="text-white/40 text-xs text-center mb-1 font-body">Kelas 8 · Latihan Mandiri · 1 Soal</p>
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

export default MasalahKontekstualPage;
