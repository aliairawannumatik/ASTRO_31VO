import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const DiagramSegitigaSebangun = () => (
  <svg viewBox="0 0 340 175" className="w-full max-w-sm mx-auto">
    {/* Triangle 1 */}
    <polygon points="20,150 120,150 70,60" fill="#3b82f6" fillOpacity="0.3" stroke="#60a5fa" strokeWidth="2" />
    <text x="70" y="167" textAnchor="middle" fontSize="9" fill="#93c5fd" fontWeight="bold">△ABC</text>
    <text x="9"  y="151" fontSize="8" fill="#93c5fd">A</text>
    <text x="122" y="151" fontSize="8" fill="#93c5fd">B</text>
    <text x="66"  y="56"  fontSize="8" fill="#93c5fd">C</text>
    {/* Arcs triangle 1 — proper SVG arcs */}
    <path d="M 30 150 A 10 10 0 0 1 24.9 141.3" fill="none" stroke="#f97316" strokeWidth="1.5"/>
    <path d="M 110 150 A 10 10 0 0 0 115.2 141.3" fill="none" stroke="#22c55e" strokeWidth="1.5"/>
    <path d="M 65.2 68.7 A 10 10 0 0 1 74.9 68.7" fill="none" stroke="#a855f7" strokeWidth="1.5"/>
    {/* Triangle 2 */}
    <polygon points="165,155 305,155 235,35" fill="#22c55e" fillOpacity="0.2" stroke="#4ade80" strokeWidth="2" />
    <text x="235" y="170" textAnchor="middle" fontSize="9" fill="#86efac" fontWeight="bold">△PQR</text>
    <text x="155" y="156" fontSize="8" fill="#86efac">P</text>
    <text x="307" y="156" fontSize="8" fill="#86efac">Q</text>
    <text x="231" y="30"  fontSize="8" fill="#86efac">R</text>
    {/* Arcs triangle 2 — proper SVG arcs */}
    <path d="M 179 155 A 14 14 0 0 1 172.0 142.9" fill="none" stroke="#f97316" strokeWidth="1.5"/>
    <path d="M 291 155 A 14 14 0 0 0 298.0 142.9" fill="none" stroke="#22c55e" strokeWidth="1.5"/>
    <path d="M 228.0 47.1 A 14 14 0 0 1 242.0 47.1" fill="none" stroke="#a855f7" strokeWidth="1.5"/>
    {/* Tilde */}
    <text x="135" y="105" fontSize="16" fill="#facc15">~</text>
    {/* Labels */}
    <text x="170" y="15" fontSize="9" fill="#fde68a" fontWeight="bold">Sudut bersesuaian sama besar</text>
    <text x="30"  y="141" fontSize="7" fill="#f97316">Sd A</text>
    <text x="98"  y="141" fontSize="7" fill="#22c55e">Sd B</text>
    <text x="58"  y="81"  fontSize="7" fill="#a855f7">Sd C</text>
    <text x="176" y="145" fontSize="7" fill="#f97316">Sd P</text>
    <text x="280" y="145" fontSize="7" fill="#22c55e">Sd Q</text>
    <text x="228" y="64"  fontSize="7" fill="#a855f7">Sd R</text>
  </svg>
);

const DiagramGarisSejajar = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto">
    <defs>
      <marker id="arr-s" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L0,6 L6,3 z" fill="#94a3b8" />
      </marker>
    </defs>
    {/* Main triangle */}
    <polygon points="140,20 30,175 250,175" fill="none" stroke="#60a5fa" strokeWidth="2" />
    <text x="140" y="14" textAnchor="middle" fontSize="10" fill="#93c5fd" fontWeight="bold">A</text>
    <text x="22" y="185" fontSize="10" fill="#93c5fd" fontWeight="bold">B</text>
    <text x="252" y="185" fontSize="10" fill="#93c5fd" fontWeight="bold">C</text>
    {/* Parallel line XY */}
    <line x1="75" y1="110" x2="200" y2="110" stroke="#facc15" strokeWidth="2" />
    <text x="68" y="114" fontSize="10" fill="#fde68a" fontWeight="bold">X</text>
    <text x="203" y="114" fontSize="10" fill="#fde68a" fontWeight="bold">Y</text>
    {/* Parallel markers */}
    <line x1="128" y1="105" x2="128" y2="115" stroke="#facc15" strokeWidth="1.5" />
    <line x1="125" y1="168" x2="125" y2="178" stroke="#facc15" strokeWidth="1.5" />
    <line x1="135" y1="168" x2="135" y2="178" stroke="#facc15" strokeWidth="1.5" />
    <line x1="131" y1="105" x2="131" y2="115" stroke="#facc15" strokeWidth="1.5" />
    {/* Labels on sides */}
    <text x="92" y="70" fontSize="9" fill="#c084fc">AX</text>
    <text x="175" y="70" fontSize="9" fill="#4ade80">AY</text>
    <text x="44" y="145" fontSize="9" fill="#c084fc">XB</text>
    <text x="220" y="145" fontSize="9" fill="#4ade80">YC</text>
    {/* Proportional sign */}
    <rect x="55" y="5" width="170" height="15" rx="3" fill="#1e293b" />
    <text x="140" y="16" textAnchor="middle" fontSize="8" fill="#fde68a">XY // BC → AX/XB = AY/YC</text>
    {/* Dotted triangle △AXY */}
    <polygon points="140,20 75,110 200,110" fill="#facc15" fillOpacity="0.08" stroke="#facc15" strokeWidth="1" strokeDasharray="4,3" />
  </svg>
);

const DiagramContoh1 = () => (
  <svg viewBox="0 0 340 165" className="w-full max-w-sm mx-auto">
    {/* △ABC: A=(15,138), B=(90,138), C=(67,76) — Sd A=50°, Sd B=70°, Sd C=60° */}
    <polygon points="15,138 90,138 67,76" fill="#3b82f6" fillOpacity="0.25" stroke="#60a5fa" strokeWidth="2"/>
    <text x="4"  y="139" fontSize="8" fill="#93c5fd" fontWeight="bold">A</text>
    <text x="92" y="139" fontSize="8" fill="#93c5fd" fontWeight="bold">B</text>
    <text x="63" y="71"  fontSize="8" fill="#93c5fd" fontWeight="bold">C</text>
    {/* Arcs △ABC */}
    <path d="M 27 138 A 12 12 0 0 1 22.7 128.8" fill="none" stroke="#f97316" strokeWidth="1.5"/>
    <path d="M 78 138 A 12 12 0 0 0 85.8 126.7" fill="none" stroke="#22c55e" strokeWidth="1.5"/>
    <path d="M 59.3 85.2 A 12 12 0 0 1 71.2 87.3" fill="none" stroke="#a855f7" strokeWidth="1.5"/>
    {/* Angle labels */}
    <text x="29" y="128" fontSize="8" fill="#f97316" fontWeight="bold">50°</text>
    <text x="71" y="128" fontSize="8" fill="#22c55e" fontWeight="bold">70°</text>
    <text x="56" y="97"  fontSize="8" fill="#a855f7" fontWeight="bold">60°</text>
    <text x="52" y="152" textAnchor="middle" fontSize="9" fill="#93c5fd">△ABC</text>

    {/* △PQR: P=(168,142), Q=(280,142), R=(246,49) — Sd P=50°, Sd Q=70°, Sd R=60° */}
    <polygon points="168,142 280,142 246,49" fill="#22c55e" fillOpacity="0.2" stroke="#4ade80" strokeWidth="2"/>
    <text x="157" y="143" fontSize="8" fill="#86efac" fontWeight="bold">P</text>
    <text x="282" y="143" fontSize="8" fill="#86efac" fontWeight="bold">Q</text>
    <text x="242" y="44"  fontSize="8" fill="#86efac" fontWeight="bold">R</text>
    {/* Arcs △PQR */}
    <path d="M 182 142 A 14 14 0 0 1 177.0 131.3" fill="none" stroke="#f97316" strokeWidth="1.5"/>
    <path d="M 266 142 A 14 14 0 0 0 275.2 128.8" fill="none" stroke="#22c55e" strokeWidth="1.5"/>
    <path d="M 237.0 59.7 A 14 14 0 0 1 250.8 62.2" fill="none" stroke="#a855f7" strokeWidth="1.5"/>
    {/* Angle labels */}
    <text x="185" y="132" fontSize="8" fill="#f97316" fontWeight="bold">50°</text>
    <text x="259" y="130" fontSize="8" fill="#22c55e" fontWeight="bold">70°</text>
    <text x="237" y="73"  fontSize="8" fill="#a855f7" fontWeight="bold">60°</text>
    <text x="224" y="155" textAnchor="middle" fontSize="9" fill="#86efac">△PQR</text>

    {/* Tilde */}
    <text x="135" y="105" fontSize="18" fill="#facc15" fontWeight="bold">~</text>
  </svg>
);

const DiagramContoh2 = () => {
  const A = { x: 130, y: 18 }, B = { x: 30, y: 148 }, C = { x: 240, y: 148 };
  const P = { x: 90, y: 70 };   // AP:AB = 4:10
  const Q = { x: 174, y: 70 };  // AQ:AC = 4:10
  return (
    <svg viewBox="0 0 280 170" className="w-full max-w-xs mx-auto">
      {/* △APQ shaded */}
      <polygon points={`${A.x},${A.y} ${P.x},${P.y} ${Q.x},${Q.y}`} fill="#facc15" fillOpacity="0.12" stroke="#facc15" strokeWidth="1" strokeDasharray="4,3"/>
      {/* △ABC */}
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="#3b82f6" fillOpacity="0.15" stroke="#60a5fa" strokeWidth="2"/>
      {/* PQ parallel line */}
      <line x1={P.x} y1={P.y} x2={Q.x} y2={Q.y} stroke="#facc15" strokeWidth="2"/>
      {/* Parallel tick marks */}
      <line x1="128" y1="65" x2="132" y2="75" stroke="#facc15" strokeWidth="1.5"/>
      <line x1="82"  y1="115" x2="86"  y2="125" stroke="#facc15" strokeWidth="1.5"/>
      <line x1="176" y1="115" x2="180" y2="125" stroke="#facc15" strokeWidth="1.5"/>
      {/* Vertex labels */}
      <text x="126" y="11"  fontSize="10" fill="#93c5fd" fontWeight="bold" textAnchor="middle">A</text>
      <text x="20"  y="158" fontSize="10" fill="#93c5fd" fontWeight="bold">B</text>
      <text x="242" y="158" fontSize="10" fill="#93c5fd" fontWeight="bold">C</text>
      <text x="77"  y="70"  fontSize="9"  fill="#fde68a" fontWeight="bold">P</text>
      <text x="178" y="70"  fontSize="9"  fill="#fde68a" fontWeight="bold">Q</text>
      {/* Side labels */}
      <text x="97"  y="42"  fontSize="8" fill="#f97316" fontWeight="bold">AP=4</text>
      <text x="51"  y="113" fontSize="8" fill="#fb923c">PB=6</text>
      <text x="161" y="42"  fontSize="8" fill="#4ade80">AQ</text>
      <text x="215" y="113" fontSize="8" fill="#86efac">QC</text>
      <text x="130" y="64"  fontSize="8" fill="#fde68a" fontWeight="bold" textAnchor="middle">PQ = 6</text>
      <text x="135" y="162" fontSize="8" fill="#93c5fd" textAnchor="middle">BC = 15</text>
      {/* Similar label */}
      <text x="255" y="50"  fontSize="8" fill="#fde68a">△APQ</text>
      <text x="258" y="61"  fontSize="8" fill="#fde68a">~△ABC</text>
    </svg>
  );
};

const DiagramContoh3 = () => {
  const A = { x: 130, y: 18 }, B = { x: 25, y: 158 }, C = { x: 255, y: 158 };
  const D = { x: 104, y: 53 }; // AD:AB = 3:12 = 1/4
  const E = { x: 161, y: 53 }; // AE:AC = 4:16 = 1/4
  return (
    <svg viewBox="0 0 290 175" className="w-full max-w-xs mx-auto">
      {/* △ADE shaded */}
      <polygon points={`${A.x},${A.y} ${D.x},${D.y} ${E.x},${E.y}`} fill="#facc15" fillOpacity="0.12" stroke="#facc15" strokeWidth="1" strokeDasharray="4,3"/>
      {/* △ABC */}
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="#3b82f6" fillOpacity="0.15" stroke="#60a5fa" strokeWidth="2"/>
      {/* DE parallel line */}
      <line x1={D.x} y1={D.y} x2={E.x} y2={E.y} stroke="#facc15" strokeWidth="2"/>
      {/* Parallel ticks */}
      <line x1="128" y1="48" x2="132" y2="58" stroke="#facc15" strokeWidth="1.5"/>
      <line x1="75"  y1="115" x2="79"  y2="125" stroke="#facc15" strokeWidth="1.5"/>
      <line x1="183" y1="115" x2="187" y2="125" stroke="#facc15" strokeWidth="1.5"/>
      {/* Vertex labels */}
      <text x="126" y="11"  fontSize="10" fill="#93c5fd" fontWeight="bold" textAnchor="middle">A</text>
      <text x="13"  y="168" fontSize="10" fill="#93c5fd" fontWeight="bold">B</text>
      <text x="257" y="168" fontSize="10" fill="#93c5fd" fontWeight="bold">C</text>
      <text x="91"  y="55"  fontSize="9"  fill="#fde68a" fontWeight="bold">D</text>
      <text x="165" y="55"  fontSize="9"  fill="#fde68a" fontWeight="bold">E</text>
      {/* Side labels */}
      <text x="98"  y="33"  fontSize="8" fill="#f97316" fontWeight="bold">AD=3</text>
      <text x="49"  y="112" fontSize="8" fill="#fb923c">DB=9</text>
      <text x="158" y="33"  fontSize="8" fill="#4ade80" fontWeight="bold">AE=4</text>
      <text x="198" y="112" fontSize="8" fill="#86efac">EC=12</text>
      <text x="132" y="48"  fontSize="8" fill="#fde68a" fontWeight="bold" textAnchor="middle">DE = 3</text>
      <text x="140" y="170" fontSize="8" fill="#93c5fd" textAnchor="middle">BC = 12</text>
      {/* Similar label */}
      <text x="255" y="50"  fontSize="8" fill="#fde68a">△ADE</text>
      <text x="255" y="61"  fontSize="8" fill="#fde68a">~△ABC</text>
    </svg>
  );
};

const SegitigaSebangunPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep1", "konsep2", "contoh1"]);
  const toggleSection = (s: string) => {
    playPopSound();
    setExpandedSections(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };
  const Header = ({ id, icon, color, label }: { id: string; icon: React.ReactNode; color: string; label: string }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3"><span style={{ color }}>{icon}</span><span className="font-body font-semibold text-white">{label}</span></div>
      {expandedSections.includes(id) ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">SEGITIGA – SEGITIGA YANG SEBANGUN</h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Kesebangunan dan Kekongruenan · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="intro" icon={<Lightbulb className="w-5 h-5" />} color="#facc15" label="🔺 Mengapa Segitiga Istimewa?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pada bangun datar umum, kita butuh DUA syarat untuk membuktikan kesebangunan (sudut sama + rusuk sebanding). Tapi pada <strong className="text-cyan-300">segitiga</strong>, cukup salah satunya saja — karena keduanya saling memengaruhi secara otomatis!
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm text-cyan-200 font-semibold">Dua segitiga sebangun jika memenuhi SALAH SATU dari berikut:</p>
                  <div className="font-body text-sm text-cyan-100 space-y-1">
                    <p>🔹 <strong>Syarat 1 (SdSdSd/SdSd):</strong> Sudut-sudut yang bersesuaian sama besar</p>
                    <p>🔹 <strong>Syarat 2 (SSS):</strong> Rusuk-rusuk yang bersesuaian sebanding</p>
                    <p>🔹 <strong>Syarat 3 (SSdS):</strong> Dua pasang rusuk sebanding dan sudut apit sama besar</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SYARAT AA */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep1" icon={<Target className="w-5 h-5" />} color="#4ade80" label="📘 Sub-Bab 1: Syarat Kesebangunan Segitiga" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <div className="space-y-3 font-body text-sm text-white/80">
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">Syarat SdSd (Sudut-Sudut):</p>
                      <p>Jika dua pasang sudut yang bersesuaian dari dua segitiga sama besar, maka sudut ketiga otomatis sama (total sudut = 180°), sehingga kedua segitiga <strong>sebangun</strong>.</p>
                      <BlockMath math="\text{Sd }A = \text{Sd }P \text{ dan } \text{Sd }B = \text{Sd }Q \Rightarrow \triangle ABC \sim \triangle PQR" />
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <p className="text-blue-300 font-semibold mb-1">Syarat SSS (Sisi-Sisi-Sisi):</p>
                      <BlockMath math="\frac{AB}{PQ} = \frac{BC}{QR} = \frac{CA}{RP} \Rightarrow \triangle ABC \sim \triangle PQR" />
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <p className="text-purple-300 font-semibold mb-1">Syarat SSdS (Sisi-Sudut-Sisi):</p>
                      <BlockMath math="\frac{AB}{PQ} = \frac{BC}{QR} \text{ dan } \text{Sd }B = \text{Sd }Q \Rightarrow \triangle ABC \sim \triangle PQR" />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">🔍 ILUSTRASI DUA SEGITIGA SEBANGUN:</p>
                  <DiagramSegitigaSebangun />
                </div>
              </div>
            )}
          </div>

          {/* DALIL GARIS SEJAJAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep2" icon={<Target className="w-5 h-5" />} color="#facc15" label="📘 Sub-Bab 2: Dalil Garis Sejajar dalam Segitiga" />
            {expandedSections.includes("konsep2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-yellow-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">Jika sebuah garis ditarik sejajar salah satu sisi segitiga sehingga memotong dua sisi lainnya, maka:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-2">
                    <BlockMath math="\text{Jika } XY \parallel BC, \text{ maka } \frac{AX}{XB} = \frac{AY}{YC}" />
                    <p className="font-body text-xs text-white/60">Juga berlaku kebalikannya: Jika AX/XB = AY/YC, maka XY // BC</p>
                  </div>
                  <p className="font-body text-sm text-white/80">Selain itu: △AXY ~ △ABC dengan perbandingan rusuk <InlineMath math="\frac{AX}{AB} = \frac{AY}{AC} = \frac{XY}{BC}" /></p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">🔍 ILUSTRASI GARIS SEJAJAR DALAM SEGITIGA:</p>
                  <DiagramGarisSejajar />
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Dalil ini super berguna untuk menghitung panjang garis yang sejajar dalam segitiga! Ingat: garis sejajar membagi dua sisi lain secara <em>proporsional</em>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="contoh1" icon={<Calculator className="w-5 h-5" />} color="#60a5fa" label="📝 Contoh Soal — Segitiga Sebangun" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">
                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Diketahui △ABC dengan <InlineMath math="\text{Sd }A = 50°" /> dan <InlineMath math="\text{Sd }B = 70°" />. Diketahui juga △PQR dengan <InlineMath math="\text{Sd }P = 50°" /> dan <InlineMath math="\text{Sd }Q = 70°" />. Apakah kedua segitiga sebangun? Tentukan pasangan sudut yang bersesuaian!
                    </p>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-slate-300 mb-2">📐 ILUSTRASI:</p>
                    <DiagramContoh1 />
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Cari sudut ketiga masing-masing:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\text{Sd }C = 180° - 50° - 70° = 60°" />
                        <BlockMath math="\text{Sd }R = 180° - 50° - 70° = 60°" />
                      </div>
                      <p>Ketiga pasang sudut sama besar (<strong>syarat SdSd</strong> terpenuhi):</p>
                      <div className="bg-slate-900/50 rounded p-3 text-sm space-y-1">
                        <p><InlineMath math="\text{Sd }A = \text{Sd }P = 50°" /></p>
                        <p><InlineMath math="\text{Sd }B = \text{Sd }Q = 70°" /></p>
                        <p><InlineMath math="\text{Sd }C = \text{Sd }R = 60°" /></p>
                      </div>
                      <p><strong className="text-green-300">△ABC ~ △PQR ✓</strong></p>
                    </div>
                  </div>
                </div>
                {/* SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Dalam △ABC, garis PQ sejajar BC dengan P pada AB dan Q pada AC. Jika <InlineMath math="AP = 4" /> cm, <InlineMath math="PB = 6" /> cm, dan <InlineMath math="BC = 15" /> cm, tentukan panjang PQ!
                    </p>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-slate-300 mb-2">📐 ILUSTRASI:</p>
                    <DiagramContoh2 />
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Karena PQ // BC, maka △APQ ~ △ABC. Perbandingan sisi:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{AP}{AB} = \frac{PQ}{BC}" />
                        <BlockMath math="AB = AP + PB = 4 + 6 = 10 \text{ cm}" />
                        <BlockMath math="\frac{4}{10} = \frac{PQ}{15} \Rightarrow PQ = \frac{4 \times 15}{10} = 6 \text{ cm}" />
                      </div>
                      <p><strong className="text-yellow-300">PQ = 6 cm.</strong></p>
                    </div>
                  </div>
                </div>
                {/* SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Pada △ABC, titik D pada AB dengan <InlineMath math="AD = 3" /> cm dan <InlineMath math="DB = 9" /> cm. Titik E pada AC. Diketahui DE // BC, <InlineMath math="BC = 12" /> cm. Tentukan panjang DE dan AE jika <InlineMath math="AC = 16" /> cm!
                    </p>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-slate-300 mb-2">📐 ILUSTRASI:</p>
                    <DiagramContoh3 />
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Cari AB:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="AB = AD + DB = 3 + 9 = 12 \text{ cm}" />
                      </div>
                      <p><strong>Langkah 2:</strong> Gunakan △ADE ~ △ABC:</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <BlockMath math="\frac{AD}{AB} = \frac{DE}{BC} \Rightarrow \frac{3}{12} = \frac{DE}{12} \Rightarrow DE = 3 \text{ cm}" />
                        <BlockMath math="\frac{AD}{AB} = \frac{AE}{AC} \Rightarrow \frac{3}{12} = \frac{AE}{16} \Rightarrow AE = 4 \text{ cm}" />
                      </div>
                      <p><strong className="text-primary">DE = 3 cm dan AE = 4 cm.</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/kesebangunan-kekongruenan"); }} className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Kesebangunan dan Kekongruenan
          </button>
        </div>
      </div>
    </div>
  );
};
export default SegitigaSebangunPage;
