import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Triangle } from "lucide-react";
import { SimilarTriangles, ParallelLinesTriangle, TriangleAltitude } from "./GeoFigure";

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string; };
const Qn = (n: number, title: string, rest: Omit<Q,"n"|"title">): Q => ({ n, title, ...rest });

const Q1TriSTSVG = () => (
  <svg viewBox="0 0 320 140" width="310" height="135" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="160,15 20,115 300,115" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="104" y1="55" x2="216" y2="55" stroke="#c084fc" strokeWidth="1.8"/>
    <text x="155" y="11" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">R</text>
    <text x="6" y="122" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">P</text>
    <text x="302" y="122" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">Q</text>
    <text x="88" y="53" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">S</text>
    <text x="219" y="53" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">T</text>
    <text x="78" y="32" fill="#c084fc" fontSize="10" fontWeight="bold">RS = 4 cm</text>
    <text x="10" y="82" fill="#c084fc" fontSize="10" fontWeight="bold">SP = 6 cm</text>
    <text x="143" y="131" fill="#fbbf24" fontSize="10" fontWeight="bold">PQ = 20 cm</text>
    <text x="136" y="49" fill="#fb923c" fontSize="11" fontWeight="bold">ST = ?</text>
  </svg>
);

const Q2TriDESVG = () => (
  <svg viewBox="0 0 320 140" width="310" height="135" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="160,15 20,120 300,120" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="113" y1="50" x2="207" y2="50" stroke="#c084fc" strokeWidth="1.8"/>
    <text x="155" y="11" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">A</text>
    <text x="6" y="127" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">B</text>
    <text x="302" y="127" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">C</text>
    <text x="96" y="48" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">D</text>
    <text x="210" y="48" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">E</text>
    <text x="102" y="28" fill="#c084fc" fontSize="10" fontWeight="bold">AD = 5 cm</text>
    <text x="10" y="80" fill="#c084fc" fontSize="10" fontWeight="bold">DB = 10 cm</text>
    <text x="136" y="44" fill="#fbbf24" fontSize="10" fontWeight="bold">DE = 7 cm</text>
    <text x="143" y="134" fill="#fb923c" fontSize="11" fontWeight="bold">BC = ?</text>
  </svg>
);

const Q3CrossLinesSVG = () => (
  <svg viewBox="0 0 270 160" width="265" height="155" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="136,21 215,10 170,55" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" strokeWidth="1.2"/>
    <polygon points="221,106 170,55 102,123" fill="rgba(124,58,237,0.12)" stroke="#7c3aed" strokeWidth="1.2"/>
    <line x1="136" y1="21" x2="221" y2="106" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="215" y1="10" x2="102" y2="123" stroke="#7c3aed" strokeWidth="1.5"/>
    <line x1="136" y1="21" x2="215" y2="10" stroke="#c084fc" strokeWidth="1.3"/>
    <line x1="221" y1="106" x2="102" y2="123" stroke="#c084fc" strokeWidth="1.3"/>
    <text x="122" y="18" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">A</text>
    <text x="218" y="8" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">B</text>
    <text x="173" y="68" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">O</text>
    <text x="225" y="112" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">C</text>
    <text x="88" y="128" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">D</text>
    <text x="98" y="38" fill="#c084fc" fontSize="10" fontWeight="bold">OA = 6 cm</text>
    <text x="198" y="28" fill="#fbbf24" fontSize="10" fontWeight="bold">OB = x</text>
    <text x="215" y="86" fill="#c084fc" fontSize="10" fontWeight="bold">OC = 9 cm</text>
    <text x="58" y="98" fill="#c084fc" fontSize="10" fontWeight="bold">OD = 12 cm</text>
  </svg>
);

const Q4TriRTSVG = () => (
  <svg viewBox="0 0 320 140" width="310" height="135" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="160,15 20,120 300,120" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="113" y1="50" x2="207" y2="50" stroke="#c084fc" strokeWidth="1.8"/>
    <text x="155" y="11" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">P</text>
    <text x="6" y="127" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">Q</text>
    <text x="302" y="127" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">S</text>
    <text x="96" y="48" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">R</text>
    <text x="210" y="48" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">T</text>
    <text x="103" y="28" fill="#c084fc" fontSize="10" fontWeight="bold">PR = 5 cm</text>
    <text x="10" y="80" fill="#c084fc" fontSize="10" fontWeight="bold">RQ = 10 cm</text>
    <text x="136" y="44" fill="#fb923c" fontSize="10" fontWeight="bold">RT = ?</text>
    <text x="140" y="134" fill="#fbbf24" fontSize="10" fontWeight="bold">QS = 21 cm</text>
  </svg>
);

const Q6TriDE2SVG = () => (
  <svg viewBox="0 0 320 140" width="310" height="135" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="160,15 20,115 300,115" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="104" y1="57" x2="216" y2="57" stroke="#c084fc" strokeWidth="1.8"/>
    <text x="155" y="11" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">A</text>
    <text x="6" y="122" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">B</text>
    <text x="302" y="122" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">C</text>
    <text x="87" y="55" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">D</text>
    <text x="219" y="55" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">E</text>
    <text x="85" y="33" fill="#c084fc" fontSize="10" fontWeight="bold">AD = 16 cm</text>
    <text x="10" y="85" fill="#c084fc" fontSize="10" fontWeight="bold">DB = 24 cm</text>
    <text x="133" y="51" fill="#fbbf24" fontSize="10" fontWeight="bold">DE = 18 cm</text>
    <text x="143" y="130" fill="#fb923c" fontSize="11" fontWeight="bold">BC = ?</text>
  </svg>
);

const Q7MedianESVG = () => (
  <svg viewBox="0 0 270 185" width="265" height="180" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="50,90 230,90 95,20" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="95" y1="20" x2="140" y2="90" stroke="#c084fc" strokeWidth="1.5"/>
    <line x1="140" y1="90" x2="185" y2="160" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="5,3"/>
    <line x1="230" y1="90" x2="185" y2="160" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="5,3"/>
    <line x1="112" y1="59" x2="118" y2="51" stroke="#fbbf24" strokeWidth="1.5"/>
    <line x1="157" y1="129" x2="163" y2="121" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="36" y="94" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">A</text>
    <text x="232" y="94" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">B</text>
    <text x="86" y="15" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">C</text>
    <text x="132" y="106" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">D</text>
    <text x="182" y="173" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">E</text>
    <text x="22" y="56" fill="#c084fc" fontSize="10" fontWeight="bold">AC = 10 cm</text>
    <text x="88" y="107" fill="#fbbf24" fontSize="9" fontWeight="bold">AD=DB=8cm</text>
    <text x="192" y="128" fill="#fb923c" fontSize="10" fontWeight="bold">BE = ?</text>
    <text x="108" y="43" fill="#fbbf24" fontSize="9">CD=DE</text>
  </svg>
);

const Q10TrapSVG = () => (
  <svg viewBox="0 0 265 140" width="258" height="135" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="60,20 200,20 240,120 20,120" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="36" y1="80" x2="224" y2="80" stroke="#c084fc" strokeWidth="1.8"/>
    <text x="48" y="16" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">P</text>
    <text x="202" y="16" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">Q</text>
    <text x="242" y="125" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">S</text>
    <text x="5" y="125" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">R</text>
    <text x="22" y="78" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">E</text>
    <text x="228" y="78" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">F</text>
    <text x="105" y="14" fill="#fbbf24" fontSize="10" fontWeight="bold">PQ = 8 cm</text>
    <text x="105" y="135" fill="#fbbf24" fontSize="10" fontWeight="bold">RS = 18 cm</text>
    <text x="108" y="74" fill="#fb923c" fontSize="11" fontWeight="bold">EF = ?</text>
    <text x="220" y="48" fill="#c084fc" fontSize="10" fontWeight="bold">QF=3cm</text>
    <text x="230" y="102" fill="#c084fc" fontSize="10" fontWeight="bold">FS=2cm</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Segitiga Sebangun – Cari ST – UN", {
    type: "mixed",
    content: "Dengan memperhatikan gambar di bawah, panjang ST adalah ....",
    diagram: <Q1TriSTSVG />,
    parts: [
      { label: "A.", text: "6 cm" },
      { label: "B.", text: "7 cm" },
      { label: "C.", text: "8 cm" },
      { label: "D.", text: "10 cm" },
    ],
  }),
  Qn(2, "Dua Segitiga Berpotongan – Nilai x – UN", {
    type: "mixed",
    content: "Pada gambar di bawah ini, AB // CD. Nilai OB adalah ....",
    diagram: <Q3CrossLinesSVG />,
    parts: [
      { label: "A.", text: "6 cm" },
      { label: "B.", text: "7 cm" },
      { label: "C.", text: "8 cm" },
      { label: "D.", text: "10 cm" },
    ],
  }),
  Qn(3, "Median Diperpanjang – Cari BE – ANBK", {
    type: "mixed",
    content: "Garis tengah (median) CD dari △ABC, dengan D titik tengah AB, diperpanjang hingga DE = CD. Jika AC = 10 cm dan AD = DB = 8 cm, maka panjang BE adalah ....",
    diagram: <Q7MedianESVG />,
    parts: [
      { label: "A.", text: "8 cm" },
      { label: "B.", text: "9 cm" },
      { label: "C.", text: "10 cm" },
      { label: "D.", text: "12 cm" },
    ],
  }),
  Qn(4, "Segitiga Sama Kaki – Perbandingan Sisi – ANBK", {
    type: "mixed",
    content: "Diketahui △PQR adalah segitiga sama kaki dengan PQ = PR. Titik M pada PQ dan titik N pada PR sedemikian sehingga MN // QR. Jika PQ : PM = 4 : 3, maka PR : PN adalah ....",
    parts: [
      { label: "A.", math: "4 : 3" },
      { label: "B.", math: "3 : 4" },
      { label: "C.", math: "3 : 2" },
      { label: "D.", math: "2 : 3" },
    ],
  }),
  Qn(5, "Garis Sejajar – Perbandingan AQ : QC – TKA", {
    type: "mixed",
    content: "Diketahui △ABC. Titik P pada AB dan titik Q pada AC sedemikian sehingga PQ // BC. Jika panjang AP = 6 cm dan AB = 10 cm, maka AQ : QC adalah ....",
    parts: [
      { label: "A.", math: "2 : 3" },
      { label: "B.", math: "3 : 2" },
      { label: "C.", math: "3 : 5" },
      { label: "D.", math: "5 : 3" },
    ],
  }),
  Qn(6, "Trapesium – Cari EF – TKA", {
    type: "mixed",
    content: "Jika panjang PQ = 8 cm, RS = 18 cm, QF = 3 cm, dan FS = 2 cm, maka panjang EF adalah ....",
    diagram: <Q10TrapSVG />,
    parts: [
      { label: "A.", text: "10 cm" },
      { label: "B.", text: "11 cm" },
      { label: "C.", text: "12 cm" },
      { label: "D.", text: "14 cm" },
    ],
  }),
];

const SegitigaSebangunPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-400/60 flex items-center justify-center mb-3">
            <Triangle className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(167,139,250,0.7)' }}>
            SEGITIGA-SEGITIGA YANG SEBANGUN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Kesebangunan & Kekongruenan · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 6 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>
        <div className="mb-5 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300 text-xs font-bold mb-2">📌 Tiga Syarat Kesebangunan Segitiga</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { name: "AA", desc: "Dua pasang sudut sama besar" },
              { name: "SAS", desc: "Dua sisi sebanding & sudut apitnya sama" },
              { name: "SSS", desc: "Tiga pasang sisi sebanding" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-2 py-2 text-center">
                <p className="text-violet-300 font-bold text-sm mb-1">{r.name}</p>
                <p className="text-white/50 text-[9px]">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
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
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center rounded-xl overflow-hidden">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-violet-400 text-xs font-bold shrink-0 mt-0.5">{p.label}</span>}
                            <div className="flex-1">
                              {p.text && <p className="font-body text-sm text-white/80 leading-relaxed">{p.text}</p>}
                              {p.math && <div className="text-white/80 text-sm mt-0.5"><InlineMath math={p.math} /></div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {q.math && !q.parts && <div className="mt-2 bg-white/5 rounded-lg px-3 py-2"><BlockMath math={q.math} /></div>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/kesebangunan-kekongruenan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Kesebangunan & Kekongruenan
          </button>
        </div>
      </div>
    </div>
  );
};

export default SegitigaSebangunPage;
