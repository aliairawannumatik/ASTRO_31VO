import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ── DIAGRAMS ──
   △ABC siku-siku di A, AB VERTIKAL, AC HORIZONTAL.
   B = kiri atas, A = kiri bawah (AB vertikal), C = kanan bawah (AC horizontal).
   BC = sisi miring (hipotenusa, diagonal). AD ⊥ BC, D pada BC.
   Koordinat: B=(55,22), A=(55,182), C=(175,182)
   AB=160 (vertikal), AC=120 (horizontal), BC=200, AD=96, BD=128, DC=72  (3-4-5 × 40)
   BC_unit = (C-B)/|BC| = (120,160)/200 = (0.6,0.8)
   t = (A-B)·BC_unit = (0,160)·(0.6,0.8) = 128
   D = B + 128*(0.6,0.8) = (55+76.8, 22+102.4) = (131.8,124.4) ≈ (132,124)
──────────────────────────────────────────── */

/* Sudut siku-siku di A=(55,182): AB ke atas (0,-1), AC ke kanan (1,0) → kotak axis-aligned */
const RightAngleA = () => (
  <path d="M 55,173 L 64,173 L 64,182" fill="none" stroke="#f97316" strokeWidth="1.5"/>
);

/* Sudut siku-siku di D=(132,124): AD⊥BC
   DA_unit (D→A) = (55-132,182-124)/96 = (-76.8,57.6)/96 = (-0.8,0.6)
   BC_unit = (0.6,0.8), s=8 */
const RightAngleD = () => {
  const s = 8;
  const p1 = { x: 132 + s*(-0.8), y: 124 + s*(0.6)  };  // toward A
  const p2 = { x: 132 + s*(0.6),  y: 124 + s*(0.8)  };  // along BC
  const corner = { x: p1.x + s*(0.6), y: p1.y + s*(0.8) };
  return <path d={`M ${p1.x.toFixed(1)},${p1.y.toFixed(1)} L ${corner.x.toFixed(1)},${corner.y.toFixed(1)} L ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`} fill="none" stroke="#facc15" strokeWidth="1.5"/>;
};

const DiagramSikuSiku = () => (
  <svg viewBox="0 0 260 218" className="w-full max-w-sm mx-auto">
    {/* Sub-triangles shaded */}
    <polygon points="55,182 55,22 132,124"  fill="#4ade80"  fillOpacity="0.18" stroke="none"/>
    <polygon points="55,182 175,182 132,124" fill="#a855f7" fillOpacity="0.18" stroke="none"/>
    {/* Main triangle ABC */}
    <polygon points="55,22 55,182 175,182" fill="none" stroke="#60a5fa" strokeWidth="2.2"/>
    {/* Altitude AD */}
    <line x1="55" y1="182" x2="132" y2="124" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3"/>
    <RightAngleA />
    <RightAngleD />
    {/* Vertex labels */}
    <text x="36"  y="20"  fontSize="12" fill="#93c5fd" fontWeight="bold">B</text>
    <text x="36"  y="197" fontSize="12" fill="#93c5fd" fontWeight="bold">A</text>
    <text x="178" y="197" fontSize="12" fill="#93c5fd" fontWeight="bold">C</text>
    <text x="136" y="120" fontSize="11" fill="#fde68a" fontWeight="bold">D</text>
    {/* Legend */}
    <rect x="3" y="202" width="254" height="14" rx="4" fill="#0f172a" stroke="#334155"/>
    <text x="130" y="212" textAnchor="middle" fontSize="8" fill="#fde68a" fontWeight="bold">△ABD ~ △CAD ~ △CAB (tiga segitiga saling sebangun)</text>
  </svg>
);

const DiagramProyeksiAlas = () => (
  <svg viewBox="0 0 260 242" className="w-full max-w-sm mx-auto">
    <polygon points="55,182 55,22 132,124" fill="#4ade80" fillOpacity="0.18" stroke="none"/>
    <polygon points="55,22 55,182 175,182" fill="none" stroke="#60a5fa" strokeWidth="2"/>
    <line x1="55" y1="182" x2="132" y2="124" stroke="#facc15" strokeWidth="1.8" strokeDasharray="5,3"/>
    <RightAngleA />
    <RightAngleD />
    <text x="36"  y="20"  fontSize="12" fill="#93c5fd" fontWeight="bold">B</text>
    <text x="36"  y="197" fontSize="12" fill="#93c5fd" fontWeight="bold">A</text>
    <text x="178" y="197" fontSize="12" fill="#93c5fd" fontWeight="bold">C</text>
    <text x="136" y="120" fontSize="11" fill="#fde68a" fontWeight="bold">D</text>
    <rect x="3" y="208" width="254" height="30" rx="4" fill="#0f172a" stroke="#4ade80" strokeWidth="1"/>
    <text x="130" y="220" textAnchor="middle" fontSize="12" fill="#fde68a" fontWeight="bold">Proyeksi Rusuk Tegak AB:</text>
    <text x="130" y="235" textAnchor="middle" fontSize="12" fill="#4ade80" fontWeight="bold">AB² = BD × BC</text>
  </svg>
);

const DiagramProyeksiTegak = () => (
  <svg viewBox="0 0 260 242" className="w-full max-w-sm mx-auto">
    <polygon points="55,182 175,182 132,124" fill="#c084fc" fillOpacity="0.18" stroke="none"/>
    <polygon points="55,22 55,182 175,182" fill="none" stroke="#c084fc" strokeWidth="2"/>
    <line x1="55" y1="182" x2="132" y2="124" stroke="#facc15" strokeWidth="1.8" strokeDasharray="5,3"/>
    <RightAngleA />
    <RightAngleD />
    <text x="36"  y="20"  fontSize="12" fill="#e9d5ff" fontWeight="bold">B</text>
    <text x="36"  y="197" fontSize="12" fill="#e9d5ff" fontWeight="bold">A</text>
    <text x="178" y="197" fontSize="12" fill="#e9d5ff" fontWeight="bold">C</text>
    <text x="136" y="120" fontSize="11" fill="#fde68a" fontWeight="bold">D</text>
    <rect x="3" y="208" width="254" height="30" rx="4" fill="#0f172a" stroke="#c084fc" strokeWidth="1"/>
    <text x="130" y="220" textAnchor="middle" fontSize="12" fill="#fde68a" fontWeight="bold">Proyeksi Rusuk Mendatar AC:</text>
    <text x="130" y="235" textAnchor="middle" fontSize="12" fill="#c084fc" fontWeight="bold">AC² = DC × BC</text>
  </svg>
);

const DiagramGarisTinggi = () => (
  <svg viewBox="0 0 260 242" className="w-full max-w-sm mx-auto">
    <polygon points="55,182 55,22 132,124"  fill="#facc15" fillOpacity="0.10" stroke="none"/>
    <polygon points="55,182 175,182 132,124" fill="#facc15" fillOpacity="0.10" stroke="none"/>
    <polygon points="55,22 55,182 175,182" fill="none" stroke="#22c55e" strokeWidth="2"/>
    <line x1="55" y1="182" x2="132" y2="124" stroke="#facc15" strokeWidth="2" strokeDasharray="5,3"/>
    <RightAngleA />
    <RightAngleD />
    <text x="36"  y="20"  fontSize="12" fill="#86efac" fontWeight="bold">B</text>
    <text x="36"  y="197" fontSize="12" fill="#86efac" fontWeight="bold">A</text>
    <text x="178" y="197" fontSize="12" fill="#86efac" fontWeight="bold">C</text>
    <text x="136" y="120" fontSize="11" fill="#fde68a" fontWeight="bold">D</text>
    <rect x="3" y="208" width="254" height="30" rx="4" fill="#0f172a" stroke="#22c55e" strokeWidth="1"/>
    <text x="130" y="220" textAnchor="middle" fontSize="12" fill="#fde68a" fontWeight="bold">Garis Tinggi ke Sisi Miring:</text>
    <text x="130" y="235" textAnchor="middle" fontSize="12" fill="#22c55e" fontWeight="bold">AD² = BD × DC</text>
  </svg>
);

const DiagramHubunganRusuk = () => (
  <svg viewBox="0 0 260 242" className="w-full max-w-sm mx-auto">
    {/* Shading seluruh segitiga */}
    <polygon points="55,22 55,182 175,182" fill="#f97316" fillOpacity="0.12" stroke="none"/>
    {/* Sisi AB (tegak) — kuning */}
    <line x1="55" y1="22" x2="55" y2="182" stroke="#facc15" strokeWidth="3"/>
    {/* Sisi AC (alas) — hijau */}
    <line x1="55" y1="182" x2="175" y2="182" stroke="#4ade80" strokeWidth="3"/>
    {/* Sisi BC (miring) — biru */}
    <line x1="55" y1="22" x2="175" y2="182" stroke="#60a5fa" strokeWidth="3"/>
    {/* Garis tinggi AD — oranye putus-putus */}
    <line x1="55" y1="182" x2="132" y2="124" stroke="#f97316" strokeWidth="2.5" strokeDasharray="5,3"/>
    <RightAngleA />
    <RightAngleD />
    {/* Label sisi */}
    <text x="38"  y="108" fontSize="11" fill="#facc15" fontWeight="bold" textAnchor="middle">AB</text>
    <text x="115" y="197" fontSize="11" fill="#4ade80" fontWeight="bold" textAnchor="middle">AC</text>
    <text x="122" y="95"  fontSize="11" fill="#60a5fa" fontWeight="bold" textAnchor="middle">BC</text>
    <text x="82"  y="160" fontSize="11" fill="#fb923c" fontWeight="bold" textAnchor="middle">AD</text>
    {/* Vertex labels */}
    <text x="36"  y="20"  fontSize="12" fill="#fed7aa" fontWeight="bold">B</text>
    <text x="36"  y="197" fontSize="12" fill="#fed7aa" fontWeight="bold">A</text>
    <text x="178" y="197" fontSize="12" fill="#fed7aa" fontWeight="bold">C</text>
    <text x="136" y="120" fontSize="11" fill="#fde68a" fontWeight="bold">D</text>
    {/* Legend */}
    <rect x="3" y="208" width="254" height="30" rx="4" fill="#0f172a" stroke="#f97316" strokeWidth="1"/>
    <text x="130" y="220" textAnchor="middle" fontSize="12" fill="#fde68a" fontWeight="bold">Hubungan Rusuk &amp; Tinggi:</text>
    <text x="130" y="235" textAnchor="middle" fontSize="12" fill="#f97316" fontWeight="bold">AB × AC = BC × AD</text>
  </svg>
);

/* ── WATERFALL ANIMATION ──────────────────────────────────────────────────
   Segitiga: B=(55,22) kiri atas, A=(55,182) kiri bawah, C=(175,182) kanan bawah
   D=(132,124) pada BC (kaki tinggi dari A).
   Air menyemprot A→B (vertikal ke atas), lalu muncrat dari B ke D dan B ke C.
   AB² = BD × BC
──────────────────────────────────────────────────────────────────────────── */
const WaterfallAnimasiAlas = () => {
  /*
    Koordinat segitiga:
      B = (55, 22)   — kiri atas (sudut lancip)
      A = (55, 182)  — kiri bawah (sudut siku-siku)
      C = (175, 182) — kanan bawah
      D = (132, 124) — pada BC, kaki garis tinggi dari A

    viewBox hanya 10px ekstra ke atas: "0 -10 260 278"
    busur sangat kecil, puncak hanya 5-6px di atas titik B.

    Stream 1 — B→D — busur SANGAT KECIL (Q 130,-5):
      puncak ≈ y≈17, hanya 5px di atas B

    Stream 2 — B→C — busur KECIL (Q 190,-15):
      puncak ≈ y≈16, hanya 6px di atas B, busur lebih lebar
  */
  const pathAB  = "M 55,182 L 55,22";
  const pathBD  = "M 55,22 Q 130,-5 132,124";   // busur kecil B→D
  const pathBC  = "M 55,22 Q 190,-15 175,182";  // busur kecil B→C (lebih lebar)

  /* Aliran air realistis: tiga lapisan stroke-dashoffset yang mengalir */
  const flowStream = (path: string, color: string, highlight: string, dur: number, width: number) => (
    <>
      {/* lapisan cahaya luar (glow) */}
      <path d={path} fill="none" stroke={color} strokeWidth={width + 5}
        strokeOpacity="0.10" strokeLinecap="round" filter="url(#wfGlow)"/>
      {/* aliran utama — ruas besar */}
      <path d={path} fill="none" stroke={color} strokeWidth={width}
        strokeDasharray="13 8" strokeLinecap="round" strokeOpacity="0.70">
        <animate attributeName="stroke-dashoffset" from="21" to="0"
          dur={`${dur}s`} repeatCount="indefinite"/>
      </path>
      {/* lapisan kedua — ruas kecil, lebih cepat */}
      <path d={path} fill="none" stroke={color} strokeWidth={width - 0.8}
        strokeDasharray="6 15" strokeLinecap="round" strokeOpacity="0.45">
        <animate attributeName="stroke-dashoffset" from="21" to="0"
          dur={`${(dur * 0.62).toFixed(2)}s`} repeatCount="indefinite"/>
      </path>
      {/* utas kilap tipis di atas */}
      <path d={path} fill="none" stroke={highlight} strokeWidth={0.9}
        strokeDasharray="4 17" strokeLinecap="round" strokeOpacity="0.90">
        <animate attributeName="stroke-dashoffset" from="21" to="0"
          dur={`${(dur * 0.42).toFixed(2)}s`} repeatCount="indefinite"/>
      </path>
    </>
  );

  return (
    <div className="space-y-4">
      {/* Keterangan teknik */}
      <div className="bg-blue-950/60 border border-blue-400/30 rounded-lg p-4">
        <p className="font-body text-xs text-blue-200 leading-relaxed">
          🌊 Bayangkan air menyemprot dari{" "}
          <strong className="text-white">A ke B</strong> melewati sisi tegak, lalu di titik{" "}
          <strong className="text-white">B</strong> air langsung{" "}
          <strong className="text-cyan-300">muncrat dua arah terpisah</strong>:{" "}
          <span className="text-cyan-300 font-bold">① ke D</span> dan{" "}
          <span className="text-sky-200 font-bold">② langsung ke C</span>. Itulah cara hafal rumus{" "}
          <strong className="text-cyan-300">AB² = BD × BC!</strong>
        </p>
      </div>

      {/* Legenda warna */}
      <div className="flex gap-3 justify-center font-body text-xs">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-8 h-2 rounded-full" style={{background:"#06b6d4"}}/>
          <span className="text-cyan-300 font-semibold">① B → D</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-8 h-2 rounded-full" style={{background:"#bae6fd"}}/>
          <span className="text-sky-200 font-semibold">② B → C</span>
        </div>
      </div>

      {/* SVG animasi */}
      <div className="bg-slate-950/90 border border-blue-500/25 rounded-xl p-3">
        {/*
          viewBox diperluas 52px ke atas (y mulai -52) supaya busur
          parabola yang naik melewati titik B masih terlihat dalam frame.
          Total tinggi koordinat: -52 → 268 = 320 unit.
        */}
        <svg viewBox="0 -10 260 278" className="w-full max-w-sm mx-auto">
          <defs>
            <filter id="wfGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.8" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Segitiga utama — tiap rusuk digambar terpisah */}
          {/* Rusuk AB (tegak) — biru air */}
          <line x1="55" y1="22" x2="55" y2="182" stroke="#38bdf8" strokeWidth="2.2"/>
          {/* Rusuk AC (alas) — kuning */}
          <line x1="55" y1="182" x2="175" y2="182" stroke="#facc15" strokeWidth="2.2"/>
          {/* Rusuk BC (miring) — kuning */}
          <line x1="55" y1="22" x2="175" y2="182" stroke="#facc15" strokeWidth="2.2"/>
          {/* Garis tinggi AD (kuning putus) */}
          <line x1="55" y1="182" x2="132" y2="124" stroke="#facc15" strokeWidth="1.8" strokeDasharray="5,3"/>
          {/* Sudut siku-siku di A */}
          <path d="M 55,173 L 64,173 L 64,182" fill="none" stroke="#f97316" strokeWidth="1.5"/>
          {/* Sudut siku-siku di D */}
          <path d="M 125.6,129.6 L 121.6,122.8 L 128.4,118.8" fill="none" stroke="#f97316" strokeWidth="1.5"/>

          {/* ── Aliran A→B (vertikal, biru air) ── */}
          {flowStream(pathAB, "#38bdf8", "#e0f2fe", 2.2, 3.0)}

          {/* ── Aliran B→D (busur kecil, cyan terang) ── */}
          {flowStream(pathBD, "#06b6d4", "#a5f3fc", 1.8, 2.8)}

          {/* ── Aliran B→C (busur lebar, biru muda) ── */}
          {flowStream(pathBC, "#bae6fd", "#f0f9ff", 2.6, 2.8)}

          {/* ── Ripple di B (titik percabangan) ── */}
          <circle cx="55" cy="22" r="5" fill="#38bdf8" opacity="0.9">
            <animate attributeName="r" values="4;18;4" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.9;0;0.9" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="55" cy="22" r="3" fill="#e0f2fe" opacity="0.7">
            <animate attributeName="r" values="3;11;3" dur="2s" begin="0.3s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" begin="0.3s" repeatCount="indefinite"/>
          </circle>

          {/* ── Splash di D (endpoint stream 1) ── */}
          <circle cx="132" cy="124" r="4" fill="#06b6d4" opacity="0">
            <animate attributeName="r" values="3;10;3" dur="1.9s" begin="0.05s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;0.75;0" dur="1.9s" begin="0.05s" repeatCount="indefinite"/>
          </circle>

          {/* ── Splash di C (endpoint stream 2) ── */}
          <circle cx="175" cy="182" r="4" fill="#bae6fd" opacity="0">
            <animate attributeName="r" values="3;11;3" dur="2.8s" begin="0.1s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;0.75;0" dur="2.8s" begin="0.1s" repeatCount="indefinite"/>
          </circle>


          {/* Label vertex */}
          <text x="36" y="20"  fontSize="13" fill="#93c5fd" fontWeight="bold">B</text>
          <text x="36" y="197" fontSize="13" fill="#93c5fd" fontWeight="bold">A</text>
          <text x="178" y="197" fontSize="13" fill="#93c5fd" fontWeight="bold">C</text>
          <text x="136" y="120" fontSize="11" fill="#fde68a" fontWeight="bold">D</text>

          {/* Label AB */}
          <text x="43" y="108" fontSize="11" fill="#38bdf8" fontWeight="bold" textAnchor="middle">AB</text>
          {/* Label BD① — dekat puncak busur B→D (puncak ≈ x=113, y=17) */}
          <text x="113" y="14" fontSize="10" fill="#06b6d4" fontWeight="bold" textAnchor="middle">BD ①</text>
          {/* Label BC② — dekat puncak busur B→C (puncak ≈ x=141, y=16) */}
          <text x="155" y="5" fontSize="10" fill="#bae6fd" fontWeight="bold" textAnchor="middle">BC ②</text>

          {/* Kotak rumus */}
          <rect x="8" y="200" width="244" height="60" rx="7" fill="#020d1a" stroke="#38bdf8" strokeWidth="1.8"/>
          <text x="130" y="218" textAnchor="middle" fontSize="8.5" fill="#7dd3fc" fontWeight="bold">
            💧 A→B menyemprot ⟹ muncrat busur ① ke D  dan  busur ② ke C
          </text>
          <line x1="20" y1="224" x2="240" y2="224" stroke="#38bdf8" strokeOpacity="0.25" strokeWidth="0.8"/>
          <text x="130" y="247" textAnchor="middle" fontSize="16" fill="#38bdf8" fontWeight="bold">AB² = BD × BC</text>
          <text x="130" y="257" textAnchor="middle" fontSize="7.5" fill="#bae6fd" opacity="0.7">
            (kuadrat sumber  =  busur ① × busur ②)
          </text>
        </svg>
      </div>

      {/* Rangkuman cara hafal */}
      <div className="grid grid-cols-3 gap-2 text-center font-body text-xs">
        <div className="bg-blue-900/40 border border-blue-500/30 rounded-lg p-3 space-y-1">
          <p className="text-white/50">Sumber air</p>
          <p className="text-base">💧</p>
          <p className="text-cyan-300 font-bold">A → B</p>
          <p className="text-white/60">dikuadratkan<br/><strong className="text-white">AB²</strong></p>
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-white/40 text-lg">=</p>
          <p className="text-white/30 text-[10px]">sama dengan</p>
        </div>
        <div className="bg-blue-900/40 border border-blue-500/30 rounded-lg p-3 space-y-1">
          <p className="text-white/50">Hasil muncrat</p>
          <p className="text-base">💦</p>
          <p className="text-cyan-300 font-bold">BD × BC</p>
          <p className="text-white/60">dua arah<br/><strong className="text-white">BD × BC</strong></p>
        </div>
      </div>

      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-center">
        <p className="font-body text-sm font-bold text-white">💡 Kunci Hafal:</p>
        <p className="font-body text-xs text-white/70 mt-1 leading-relaxed">
          Ingat arah air — <span className="text-cyan-300">menyemprot naik (A→B)</span>, lalu{" "}
          <span className="text-cyan-300">muncrat dua arah (B→D) dan (B→C)</span>.
          Rusuk yang menyemprot <strong className="text-white">dikuadratkan</strong>,
          dua arah muncratnya <strong className="text-white">dikalikan</strong>!
        </p>
      </div>
    </div>
  );
};

const PerbandinganRusukSikuSikuPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "konsep1", "konsep2", "konsep3", "konsep4", "contoh1", "waterfall"]);
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
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">PERBANDINGAN/RASIO RUSUK-RUSUK SEGITIGA SIKU-SIKU</h1>
        <p className="text-white/50 text-xs text-center mb-2 font-body">Dengan Konsep Kesebangunan</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Kesebangunan dan Kekongruenan · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="intro" icon={<Lightbulb className="w-5 h-5" />} color="#facc15" label="📐 Setup: Segitiga Siku-siku dengan Garis Tinggi" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Pada segitiga siku-siku, jika dari titik sudut siku-siku kita tarik <strong className="text-cyan-300">garis tinggi ke sisi miring</strong>, maka segitiga besar terbagi menjadi dua segitiga kecil yang <strong>sebangun satu sama lain</strong> dan sebangun dengan segitiga besarnya!
                </p>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">🔍 SEGITIGA ABC SIKU-SIKU DI A, AD GARIS TINGGI:</p>
                  <DiagramSikuSiku />
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    <strong>Dari garis tinggi AD, terbentuk:</strong><br />
                    △ABD ~ △CAD ~ △CAB (semuanya saling sebangun!)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* a: PROYEKSI RUSUK ALAS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep1" icon={<Target className="w-5 h-5" />} color="#4ade80" label="📘 (a) Proyeksi Rusuk Alas pada Rusuk Miring" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">Perhatikan △ABD dan △CAB. Karena keduanya sebangun:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white/70"><InlineMath math="\frac{BD}{AB} = \frac{AB}{BC}" /> (rusuk bersesuaian sebanding)</p>
                    <BlockMath math="\boxed{AB^2 = BD \times BC}" />
                    <p className="font-body text-xs text-white/60 text-center">Kuadrat rusuk alas = proyeksi alas × sisi miring</p>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <DiagramProyeksiAlas />
                </div>
              </div>
            )}
          </div>

          {/* b: PROYEKSI RUSUK TEGAK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep2" icon={<Target className="w-5 h-5" />} color="#c084fc" label="📘 (b) Proyeksi Rusuk Tegak pada Rusuk Miring" />
            {expandedSections.includes("konsep2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">Perhatikan △CDA dan △CAB. Karena keduanya sebangun:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white/70"><InlineMath math="\frac{CD}{AC} = \frac{AC}{BC}" /></p>
                    <BlockMath math="\boxed{AC^2 = CD \times CB}" />
                    <p className="font-body text-xs text-white/60 text-center">Kuadrat rusuk tegak = proyeksi tegak × sisi miring</p>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <DiagramProyeksiTegak />
                </div>
              </div>
            )}
          </div>

          {/* c: GARIS TINGGI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep3" icon={<Target className="w-5 h-5" />} color="#22c55e" label="📘 (c) Rumus Garis Tinggi △ABC Siku-siku di A" />
            {expandedSections.includes("konsep3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">Perhatikan △ADB dan △ADC. Keduanya sebangun menghasilkan:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white/70"><InlineMath math="\frac{BD}{AD} = \frac{AD}{DC}" /></p>
                    <BlockMath math="\boxed{AD^2 = BD \times DC}" />
                    <p className="font-body text-xs text-white/60 text-center">Garis tinggi kuadrat = hasil kali dua proyeksi pada sisi miring</p>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <DiagramGarisTinggi />
                </div>
              </div>
            )}
          </div>

          {/* d: HUBUNGAN RUSUK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep4" icon={<Target className="w-5 h-5" />} color="#f97316" label="📘 (d) Hubungan Rusuk-rusuk dan Garis Tinggi" />
            {expandedSections.includes("konsep4") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-orange-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">Dari dua cara menghitung luas △ABC siku-siku di A:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-2">
                    <p className="font-body text-sm text-white/70">Cara 1 (alas-tinggi dengan AB dan AC):</p>
                    <BlockMath math="L = \frac{AB \times AC}{2}" />
                    <p className="font-body text-sm text-white/70">Cara 2 (alas-tinggi dengan BC dan AD):</p>
                    <BlockMath math="L = \frac{BC \times AD}{2}" />
                    <p className="font-body text-sm text-white/70">Karena luasnya sama, maka:</p>
                    <BlockMath math="\boxed{AB \times AC = BC \times AD}" />
                    <p className="font-body text-xs text-white/60 text-center">alas × tegak = miring × garis tinggi</p>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <DiagramHubunganRusuk />
                </div>

                {/* Rangkuman semua rumus */}
                <div className="bg-slate-800/60 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-orange-300 mb-3">📊 RANGKUMAN SEMUA RUMUS (△ABC siku-siku di A, AD tinggi ke BC):</p>
                  <div className="overflow-x-auto">
                    <table className="w-full font-body text-xs text-white/80">
                      <thead><tr className="border-b border-orange-500/30">
                        <th className="text-left py-2 text-orange-300">Rumus</th>
                        <th className="text-left py-2 text-orange-300">Keterangan</th>
                      </tr></thead>
                      <tbody className="divide-y divide-slate-700">
                        <tr><td className="py-2"><InlineMath math="AB^2 = BD \times BC" /></td><td className="py-2 text-green-300">Proyeksi alas</td></tr>
                        <tr><td className="py-2"><InlineMath math="AC^2 = CD \times CB" /></td><td className="py-2 text-purple-300">Proyeksi tegak</td></tr>
                        <tr><td className="py-2"><InlineMath math="AD^2 = BD \times DC" /></td><td className="py-2 text-cyan-300">Garis tinggi</td></tr>
                        <tr><td className="py-2"><InlineMath math="AB \times AC = BC \times AD" /></td><td className="py-2 text-yellow-300">Hubungan rusuk & tinggi</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="contoh1" icon={<Calculator className="w-5 h-5" />} color="#60a5fa" label="📝 Contoh Soal — Perbandingan Rusuk Siku-siku" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">
                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm text-white">Pada gambar berikut, diketahui panjang <InlineMath math="BD = 3" /> cm dan <InlineMath math="CD = 12" /> cm.</p>
                    {/* Diagram — △CAB siku-siku di A, D pada CB dengan AD⊥CB */}
                    <svg viewBox="0 0 270 215" className="w-full max-w-xs mx-auto">
                      {/* Segitiga CAB */}
                      <polygon points="80,20 80,180 210,180" fill="none" stroke="#facc15" strokeWidth="2"/>
                      {/* Garis tinggi AD */}
                      <line x1="80" y1="180" x2="158" y2="116" stroke="#facc15" strokeWidth="1.8"/>
                      {/* Sudut siku-siku di A */}
                      <path d="M 80,170 L 90,170 L 90,180" fill="none" stroke="#60a5fa" strokeWidth="1.8"/>
                      {/* Sudut siku-siku di D: p1 ke B, corner, p2 ke A */}
                      <path d="M 163.7,123.0 L 156.7,128.7 L 151.0,121.7" fill="none" stroke="#60a5fa" strokeWidth="1.8"/>
                      {/* Label vertex */}
                      <text x="72" y="16"  fontSize="14" fill="#ffffff" fontWeight="bold">C</text>
                      <text x="62" y="198" fontSize="14" fill="#ffffff" fontWeight="bold">A</text>
                      <text x="213" y="198" fontSize="14" fill="#ffffff" fontWeight="bold">B</text>
                      <text x="162" y="113" fontSize="14" fill="#ffffff" fontWeight="bold">D</text>
                      {/* Label sisi: BD=3, CD=12 */}
                      <text x="192" y="141" fontSize="12" fill="#ffffff" fontWeight="bold" textAnchor="middle">3</text>
                      <text x="136" y="63"  fontSize="12" fill="#ffffff" fontWeight="bold" textAnchor="middle">12</text>
                    </svg>
                    <p className="font-body text-sm text-white text-center">Panjang <InlineMath math="AD" />, <InlineMath math="AB" />, dan <InlineMath math="AC" /> berturut-turut adalah . . . .</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>△CAB siku-siku di A, AD ⊥ CB, dengan BD = 3 cm dan CD = 12 cm.</p>
                      <p><strong>Langkah 1 — Cari BC:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="BC = BD + CD = 3 + 12 = 15 \text{ cm}" />
                      </div>
                      <p><strong>Langkah 2 — Cari AD (garis tinggi):</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="AD^2 = BD \times CD = 3 \times 12 = 36" />
                        <BlockMath math="AD = \sqrt{36} = 6 \text{ cm}" />
                      </div>
                      <p><strong>Langkah 3 — Cari AB:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="AB^2 = BD \times BC = 3 \times 15 = 45" />
                        <BlockMath math="AB = \sqrt{45} = 3\sqrt{5} \text{ cm}" />
                      </div>
                      <p><strong>Langkah 4 — Cari AC:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="AC^2 = CD \times BC = 12 \times 15 = 180" />
                        <BlockMath math="AC = \sqrt{180} = 6\sqrt{5} \text{ cm}" />
                      </div>
                      <p><strong className="text-green-300">AD = 6 cm, AB = 3√5 cm, AC = 6√5 cm.</strong></p>
                    </div>
                  </div>
                </div>
                {/* SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm text-white">Pada gambar berikut, panjang <InlineMath math="AB = 12" /> cm dan <InlineMath math="BC = 15" /> cm. Panjang <InlineMath math="AD" /> adalah . . . .</p>
                    {/* Diagram — △ABC siku-siku di A, A=kiri atas, B=kanan atas, C=bawah kiri, D pada BC dengan AD⊥BC */}
                    <svg viewBox="0 0 260 185" className="w-full max-w-xs mx-auto">
                      {/* Segitiga ABC */}
                      <polygon points="60,30 180,30 60,120" fill="none" stroke="#facc15" strokeWidth="2"/>
                      {/* Garis tinggi AD */}
                      <line x1="60" y1="30" x2="103" y2="88" stroke="#facc15" strokeWidth="1.8"/>
                      {/* Sudut siku-siku di A */}
                      <path d="M 70,30 L 70,40 L 60,40" fill="none" stroke="#60a5fa" strokeWidth="1.8"/>
                      {/* Sudut siku-siku di D (AD⊥BC): p1 ke C, corner, p2 ke A */}
                      <path d="M 96.6,92.8 L 91.8,86.4 L 98.2,81.6" fill="none" stroke="#60a5fa" strokeWidth="1.8"/>
                      {/* Label vertex */}
                      <text x="44"  y="28"  fontSize="14" fill="#ffffff" fontWeight="bold">A</text>
                      <text x="183" y="28"  fontSize="14" fill="#ffffff" fontWeight="bold">B</text>
                      <text x="44"  y="133" fontSize="14" fill="#ffffff" fontWeight="bold">C</text>
                      <text x="107" y="92"  fontSize="14" fill="#ffffff" fontWeight="bold">D</text>
                      {/* Label sisi */}
                      <text x="120" y="22"  fontSize="12" fill="#ffffff" fontWeight="bold" textAnchor="middle">12</text>
                      <text x="140" y="72"  fontSize="12" fill="#ffffff" fontWeight="bold" textAnchor="middle">15</text>
                    </svg>
                    {/* Pilihan jawaban */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[["A", "5,4 cm"], ["B", "6 cm"], ["C", "7,2 cm"], ["D", "9,6 cm"]].map(([opt, val]) => (
                        <div key={opt} className={`flex items-center gap-2 rounded-lg px-3 py-2 font-body text-sm ${opt === "C" ? "bg-green-500/20 border border-green-500/50 text-green-300 font-bold" : "bg-slate-700/40 text-white/70"}`}>
                          <span className="font-bold">{opt}.</span> {val}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>△ABC siku-siku di A, AD ⊥ BC, dengan AB = 12 cm, BC = 15 cm.</p>
                      <p><strong>Langkah 1 — Cari AC:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="AC = \sqrt{BC^2 - AB^2} = \sqrt{225 - 144} = \sqrt{81} = 9 \text{ cm}" />
                      </div>
                      <p><strong>Langkah 2 — Cari AD (garis tinggi ke sisi miring):</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="AD = \frac{AB \times AC}{BC} = \frac{12 \times 9}{15} = \frac{108}{15} = 7{,}2 \text{ cm}" />
                      </div>
                      <p><strong className="text-yellow-300">Jawaban: C. AD = 7,2 cm.</strong></p>
                    </div>
                  </div>
                </div>
                {/* SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm text-white">△ABC siku-siku di A, AD ⊥ BC. Diketahui luas △ABD = 54 cm² dan BD = 9 cm. Hitunglah panjang AD, BC, AC, dan luas △ABC!</p>
                    {/* Diagram — △ABC siku-siku di A, D pada BC dekat B, △ABD di-shading */}
                    <svg viewBox="0 0 260 218" className="w-full max-w-xs mx-auto">
                      {/* Shading △ABD (merah) */}
                      <polygon points="55,22 55,182 98,80" fill="#ef4444" fillOpacity="0.18" stroke="none"/>
                      {/* Shading △ADC (gelap) */}
                      <polygon points="55,182 175,182 98,80" fill="#94a3b8" fillOpacity="0.08" stroke="none"/>
                      {/* Segitiga utama ABC */}
                      <polygon points="55,22 55,182 175,182" fill="none" stroke="#facc15" strokeWidth="2"/>
                      {/* Garis tinggi AD */}
                      <line x1="55" y1="182" x2="98" y2="80" stroke="#facc15" strokeWidth="1.8"/>
                      {/* Sudut siku-siku di A */}
                      <path d="M 55,173 L 64,173 L 64,182" fill="none" stroke="#60a5fa" strokeWidth="1.8"/>
                      {/* Sudut siku-siku di D */}
                      <path d="M 102.8,86.4 L 99.7,93.8 L 94.9,87.4" fill="none" stroke="#60a5fa" strokeWidth="1.8"/>
                      {/* Label vertex */}
                      <text x="36"  y="20"  fontSize="13" fill="#ffffff" fontWeight="bold">B</text>
                      <text x="36"  y="197" fontSize="13" fill="#ffffff" fontWeight="bold">A</text>
                      <text x="178" y="197" fontSize="13" fill="#ffffff" fontWeight="bold">C</text>
                      <text x="101" y="76"  fontSize="13" fill="#ffffff" fontWeight="bold">D</text>
                      {/* Label BD = 9 */}
                      <text x="62"  y="52"  fontSize="11" fill="#fde68a" fontWeight="bold" textAnchor="middle">9</text>
                      {/* Label luas △ABD = 54 cm² di dalam shading merah */}
                      <text x="63"  y="108" fontSize="10" fill="#fca5a5" fontWeight="bold" textAnchor="middle">54 cm²</text>
                    </svg>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p><strong>(a) Cari AD:</strong></p>
                        <BlockMath math="L_{ABD} = \frac{AD \times BD}{2} \Rightarrow 54 = \frac{AD \times 9}{2} \Rightarrow AD = 12 \text{ cm}" />
                        <p><strong>(b) Cari DC:</strong></p>
                        <BlockMath math="AD^2 = BD \times DC \Rightarrow 144 = 9 \times DC \Rightarrow DC = 16 \text{ cm}" />
                        <p><strong>(c) Cari BC dan AC:</strong></p>
                        <BlockMath math="BC = BD + DC = 9 + 16 = 25 \text{ cm}" />
                        <BlockMath math="AC^2 = DC \times BC = 16 \times 25 = 400" />
                        <BlockMath math="AC = \sqrt{400} = 20 \text{ cm}" />
                        <p><strong>(d) Luas △ABC:</strong></p>
                        <BlockMath math="L = \frac{BC \times AD}{2} = \frac{25 \times 12}{2} = 150 \text{ cm}^2" />
                      </div>
                      <p><strong className="text-primary">AD = 12 cm, DC = 16 cm, BC = 25 cm, AC = 20 cm, L = 150 cm².</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* WATERFALL ANIMATION — cara hafal AB² = BD × BC */}
          <div className="bg-card/80 backdrop-blur border border-blue-500/40 rounded-xl overflow-hidden">
            <Header id="waterfall" icon={<span className="text-base">💧</span>} color="#38bdf8" label="💧 Teknik Air Terjun — Hafal Rumus AB² = BD × BC" />
            {expandedSections.includes("waterfall") && (
              <div className="px-5 pb-5 pt-2">
                <WaterfallAnimasiAlas />
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
export default PerbandinganRusukSikuSikuPage;
