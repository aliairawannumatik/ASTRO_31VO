import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

const PiAnimationSVG = () => {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    let id: number;
    const start = performance.now();
    const PERIOD = 14000;
    const loop = (now: number) => { setProg(((now - start) % PERIOD) / PERIOD); id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  const ease = (x: number) => x < 0.5 ? 2*x*x : 1 - (-2*x+2)**2/2;
  const band = (s: number, e: number) => prog < s ? 0 : prog > e ? 1 : ease((prog-s)/(e-s));
  const cl   = (x: number) => Math.max(0, Math.min(1, x));
  const lerp = (a: number, b: number, t: number) => a + (b-a)*t;

  /* ── Geometry ── */
  const R    = 28;
  const CX   = 100, CY = 76;
  const CIRC = 2 * Math.PI * R;   // ≈ 175.9
  const D    = 2 * R;              // 56
  const PART = CIRC - 3 * D;      // ≈ 7.9

  /* The flat line is centred at CX so it shares the same x-centre as the circle */
  const LINE_RX = CIRC / 2;       // half-width of the flat line ≈ 88
  const LINE_Y  = 150;            // resting y-position after sliding down
  const SEG_Y   = 176;
  const SEG_X0  = CX - LINE_RX;  // left edge of segments ≈ 12

  /* ── Timing ── */
  const drawCircle = band(0.02, 0.20);  // circle draws itself in
  const drawDiam   = band(0.18, 0.35);  // diameter grows from centre outward
  const unroll     = band(0.35, 0.65);  // ellipse morphs: circle → flat line (at CY)
  const slideDown  = band(0.67, 0.80);  // flat line slides from CY → LINE_Y
  const s1         = band(0.80, 0.86);
  const s2         = band(0.84, 0.90);
  const s3         = band(0.88, 0.94);
  const s4         = band(0.92, 0.96);
  const piLbl      = band(0.95, 0.99);
  const fadeOut    = prog > 0.99 ? 1 - cl((prog-0.99)/0.01) : 1;

  /* ── Single ellipse: rx R→LINE_RX, ry R→0, then cy slides down ── */
  const morphRX  = lerp(R,  LINE_RX, ease(unroll));
  const morphRY  = lerp(R,  0,       ease(unroll));
  const morphCY  = lerp(CY, LINE_Y,  ease(slideDown));
  const fillAlpha = 0.13 * (1 - unroll);  // fill fades as it flattens

  /* Diameter fades as unrolling progresses */
  const diamOpacity = cl(1 - (unroll - 0.3) / 0.5);

  /* End-caps appear once the ellipse is sufficiently flat */
  const capOpacity = cl((unroll - 0.7) / 0.3);

  /* Label above the line */
  const showLabel = unroll > 0.25;
  const labelY    = morphCY - Math.max(morphRY, 0) - 13;

  /* ── Diameter segments ── */
  const SEGS = [
    { x0: SEG_X0,         len: D    * s1, color: '#22c55e', label: 'd',       dashed: false },
    { x0: SEG_X0 + D,     len: D    * s2, color: '#3b82f6', label: 'd',       dashed: false },
    { x0: SEG_X0 + 2*D,   len: D    * s3, color: '#a855f7', label: 'd',       dashed: false },
    { x0: SEG_X0 + 3*D,   len: PART * s4, color: '#eab308', label: '≈0,14d',  dashed: true  },
  ];

  const phaseLabel =
    drawCircle < 0.4  ? '① Lingkaran terbentuk...' :
    drawDiam   < 0.7  ? '② Diameter terungkap dari pusat!' :
    unroll     < 0.05 ? '③ Keliling siap dibentangkan...' :
    unroll     < 0.99 ? '③ Keliling membentang menjadi garis horizontal...' :
    slideDown  < 0.6  ? '④ Garis keliling bergeser ke bawah...' :
    s4         < 0.9  ? '⑤ Bandingkan keliling dengan diameter!' :
                        '⑥ π = Keliling ÷ Diameter ≈ 3,14';

  return (
    <div className="select-none">
      <svg viewBox="0 0 310 220" className="w-full max-w-sm mx-auto my-2"
        aria-label="Animasi keliling lingkaran membentang menjadi garis horizontal"
        style={{ opacity: fadeOut }}>

        {/* ══ SATU OBJEK KELILING: ellipse morph lingkaran → garis → geser turun ══ */}
        {drawCircle > 0 && (
          <>
            {/* fill (fades as circle flattens) */}
            <ellipse cx={CX} cy={morphCY} rx={morphRX} ry={morphRY}
              fill={`rgba(6,182,212,${fillAlpha})`} />

            {/* glow ring */}
            <ellipse cx={CX} cy={morphCY} rx={morphRX} ry={morphRY}
              fill="none" stroke="rgba(6,182,212,0.22)" strokeWidth="8"
              strokeDasharray={drawCircle < 1 ? `${CIRC * drawCircle} ${CIRC + 200}` : undefined}
              transform={drawCircle < 1 ? `rotate(-90 ${CX} ${CY})` : undefined} />

            {/* main stroke — the one circumference object */}
            <ellipse cx={CX} cy={morphCY} rx={morphRX} ry={morphRY}
              fill="none" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={drawCircle < 1 ? `${CIRC * drawCircle} ${CIRC + 200}` : undefined}
              transform={drawCircle < 1 ? `rotate(-90 ${CX} ${CY})` : undefined} />

            {/* centre dot (disappears as circle flattens) */}
            {unroll < 0.6 && (
              <circle cx={CX} cy={CY} r="3" fill="#94a3b8" opacity={1 - unroll / 0.6} />
            )}
          </>
        )}

        {/* end-caps on the flat line */}
        {capOpacity > 0.01 && (
          <>
            <line x1={CX - LINE_RX} y1={morphCY - 7} x2={CX - LINE_RX} y2={morphCY + 7}
              stroke="#06b6d4" strokeWidth="2" opacity={capOpacity} />
            <line x1={CX + LINE_RX} y1={morphCY - 7} x2={CX + LINE_RX} y2={morphCY + 7}
              stroke="#06b6d4" strokeWidth="2" opacity={capOpacity} />
          </>
        )}

        {/* ══ DIAMETER: grows outward from centre, fades when circle unrolls ══ */}
        {drawDiam > 0 && diamOpacity > 0.02 && (
          <g opacity={drawDiam * diamOpacity}>
            <line x1={CX - R * drawDiam} y1={CY} x2={CX + R * drawDiam} y2={CY}
              stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
            {drawDiam > 0.6 && (
              <>
                <circle cx={CX - R} cy={CY} r="2.5" fill="#22c55e" />
                <circle cx={CX + R} cy={CY} r="2.5" fill="#22c55e" />
                <text x={CX} y={CY - R - 10} fill="#4ade80" fontSize="9"
                  textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                  d = 2r = {D}
                </text>
                <text x={CX - R/2} y={CY - 5} fill="#94a3b8" fontSize="7.5"
                  textAnchor="middle" fontFamily="sans-serif">r</text>
                <text x={CX + R/2} y={CY - 5} fill="#94a3b8" fontSize="7.5"
                  textAnchor="middle" fontFamily="sans-serif">r</text>
              </>
            )}
          </g>
        )}

        {/* ══ LABEL keliling di atas garis ══ */}
        {showLabel && (
          <text x={CX} y={labelY} fill="#fbbf24" fontSize="9"
            textAnchor="middle" fontFamily="monospace" fontWeight="bold"
            opacity={cl((unroll - 0.25) / 0.3)}>
            Keliling = {CIRC.toFixed(1)}
          </text>
        )}

        {/* ══ DIAMETER SEGMENTS (muncul di bawah garis) ══ */}
        {SEGS.map((seg, i) => seg.len > 0.5 && (
          <g key={i}>
            <line x1={seg.x0} y1={SEG_Y} x2={seg.x0 + seg.len} y2={SEG_Y}
              stroke={seg.color} strokeWidth="3.5" strokeLinecap="round"
              strokeDasharray={seg.dashed ? '5 3' : undefined} />
            <line x1={seg.x0} y1={SEG_Y - 5} x2={seg.x0} y2={SEG_Y + 5}
              stroke={seg.color} strokeWidth="1.5" />
            {seg.len > (i < 3 ? D*0.8 : PART*0.75) && (
              <>
                <line x1={seg.x0 + seg.len} y1={SEG_Y - 5} x2={seg.x0 + seg.len} y2={SEG_Y + 5}
                  stroke={seg.color} strokeWidth="1.5" />
                <text x={seg.x0 + seg.len / 2} y={SEG_Y + 14} fill={seg.color} fontSize="8"
                  textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                  {seg.label}
                </text>
              </>
            )}
          </g>
        ))}

        {/* dotted connectors antara garis dan segmen */}
        {s4 > 0.9 && (
          <>
            <line x1={SEG_X0}        y1={LINE_Y + 8} x2={SEG_X0}        y2={SEG_Y - 6}
              stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
            <line x1={SEG_X0 + CIRC} y1={LINE_Y + 8} x2={SEG_X0 + CIRC} y2={SEG_Y - 6}
              stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
          </>
        )}

        {/* ══ π CONCLUSION BOX ══ */}
        {piLbl > 0 && (
          <g opacity={piLbl}>
            <rect x={213} y={16} width={90} height={78} rx="9"
              fill="rgba(168,85,247,0.20)" stroke="#a855f7" strokeWidth="1.5" />
            <text x={258} y={38}  fill="#c084fc" fontSize="9.5" textAnchor="middle"
              fontFamily="monospace" fontWeight="bold">π = K ÷ d</text>
            <text x={258} y={62}  fill="#fbbf24" fontSize="17" textAnchor="middle"
              fontFamily="monospace" fontWeight="black">≈ 3,14</text>
            <text x={258} y={80}  fill="#94a3b8" fontSize="8" textAnchor="middle"
              fontFamily="sans-serif">= 22/7 · selalu sama!</text>
          </g>
        )}

        {/* phase label */}
        <text x="155" y="214" fill="#475569" fontSize="7.5" textAnchor="middle"
          fontFamily="sans-serif">{phaseLabel}</text>
      </svg>
    </div>
  );
};

const AreaCompareSVG = () => (
  <svg viewBox="0 0 300 180" className="w-full max-w-sm mx-auto my-2" aria-label="Luas lingkaran">
    <defs>
      <style>{`@keyframes sectorFill{0%{opacity:0;}100%{opacity:1;}}.sf{animation:sectorFill 0.8s ease-in forwards;}`}</style>
    </defs>
    <circle cx="150" cy="90" r="75" fill="rgba(239,68,68,0.12)" stroke="#ef4444" strokeWidth="2"/>
    {[0,1,2,3,4,5,6,7].map(i => (
      <path key={i} d={`M150,90 L${150+75*Math.cos(i*Math.PI/4)},${90+75*Math.sin(i*Math.PI/4)} A75,75 0 0,1 ${150+75*Math.cos((i+1)*Math.PI/4)},${90+75*Math.sin((i+1)*Math.PI/4)} Z`}
        fill={i%2===0?"rgba(239,68,68,0.3)":"rgba(251,191,36,0.3)"}
        stroke={i%2===0?"#ef4444":"#fbbf24"} strokeWidth="1" className="sf"
        style={{animationDelay:`${i*0.1}s`}}/>
    ))}
    <circle cx="150" cy="90" r="4" fill="var(--icon-color)"/>
    <line x1="150" y1="90" x2="225" y2="90" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 2"/>
    <text x="187" y="84" fill="#4ade80" fontSize="10" fontFamily="monospace" fontWeight="bold">r</text>
    <text x="150" y="172" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">L = π × r²  (luas semua juring = luas lingkaran)</text>
  </svg>
);

const KelilingLuasPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string[]>(["intro", "rumus", "contoh1", "contoh2", "contoh3", "rangkuman"]);
  const toggle = (id: string) => { playPopSound(); setOpen(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]); };

  const SectionHeader = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {open.includes(id) ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">KELILING DAN LUAS LINGKARAN</h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Lingkaran · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🪐 Misteri Angka Pi (π)" />
            {open.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Orang Yunani kuno punya teka-teki menarik: berapakah perbandingan keliling lingkaran dengan diameternya? Mereka menemukan jawabannya selalu sama — sebuah angka ajaib yang kita kenal sebagai <strong className="text-cyan-300">Pi (π)</strong>. Nilainya sekitar <strong className="text-yellow-300">3,14159...</strong> dan tak pernah berhenti atau berulang!
                </p>
                <PiAnimationSVG />
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-cyan-200">
                    🔵 <strong>Nilai π yang sering digunakan:</strong><br/>
                    • π ≈ <strong>3,14</strong> (untuk perhitungan desimal)<br/>
                    • π ≈ <strong>22/7</strong> (jika jari-jari kelipatan 7)
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rumus" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title="📐 Rumus Keliling dan Luas Lingkaran" />
            {open.includes("rumus") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-3">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 mb-2">Keliling adalah panjang garis lengkung yang membentuk lingkaran. Luas adalah daerah di dalam lingkaran.</p>
                </div>
                <AreaCompareSVG />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4 text-center">
                    <p className="font-body text-sm font-bold text-green-300 mb-2">📏 KELILING (K)</p>
                    <BlockMath math="K = \pi \times d" />
                    <p className="font-body text-xs text-white/60 mt-1">atau</p>
                    <BlockMath math="K = 2\pi r" />
                    <p className="font-body text-xs text-white/50 mt-1">d = diameter, r = jari-jari</p>
                  </div>
                  <div className="bg-orange-900/30 border border-orange-500/40 rounded-xl p-4 text-center">
                    <p className="font-body text-sm font-bold text-orange-300 mb-2">🔲 LUAS (L)</p>
                    <BlockMath math="L = \pi \times r^2" />
                    <p className="font-body text-xs text-white/60 mt-1">atau</p>
                    <BlockMath math="L = \frac{1}{4}\pi d^2" />
                    <p className="font-body text-xs text-white/50 mt-1">r = jari-jari, d = diameter</p>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    ⚠️ <strong>Perhatikan satuan!</strong> Keliling = satuan panjang (cm, m). Luas = satuan kuadrat (cm², m²).
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Menghitung Keliling (Mudah)" />
            {open.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-4">
                  <p className="text-green-300 font-bold text-xs uppercase tracking-wide mb-2">🟢 Tingkat: Mudah</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah roda sepeda memiliki diameter 70 cm. Berapa keliling roda tersebut? Gunakan <InlineMath math="\pi = \frac{22}{7}"/>.
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80">Diketahui: <InlineMath math="d = 70"/> cm, <InlineMath math="\pi = \frac{22}{7}"/></p>
                  <p className="font-body text-sm text-white/80">Gunakan rumus:</p>
                  <BlockMath math="K = \pi \times d" />
                  <BlockMath math="K = \frac{22}{7} \times 70" />
                  <BlockMath math="K = 22 \times 10 = 220 \text{ cm}" />
                  <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-green-300 text-center">✅ Keliling roda = <strong>220 cm = 2,2 m</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Menghitung Luas (Sedang)" />
            {open.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-xl p-4">
                  <p className="text-yellow-300 font-bold text-xs uppercase tracking-wide mb-2">🟡 Tingkat: Sedang</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah taman berbentuk lingkaran memiliki keliling 88 m. Hitunglah luas taman tersebut! (Gunakan <InlineMath math="\pi = \frac{22}{7}"/>)
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 1:</strong> Cari jari-jari dari keliling</p>
                  <BlockMath math="K = 2\pi r \Rightarrow 88 = 2 \times \frac{22}{7} \times r" />
                  <BlockMath math="88 = \frac{44}{7} \times r \Rightarrow r = 88 \times \frac{7}{44} = 14 \text{ m}" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 2:</strong> Hitung luas</p>
                  <BlockMath math="L = \pi r^2 = \frac{22}{7} \times 14^2 = \frac{22}{7} \times 196 = 22 \times 28 = 616 \text{ m}^2" />
                  <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-yellow-200 text-center">✅ Luas taman = <strong>616 m²</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<FlaskConical className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Cincin Lingkaran (Sulit)" />
            {open.includes("contoh3") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4">
                  <p className="text-red-300 font-bold text-xs uppercase tracking-wide mb-2">🔴 Tingkat: Sulit</p>
                  <p className="font-body text-sm text-white/90">
                    Sebuah kolam renang berbentuk lingkaran berjari-jari 10 m. Di sekeliling kolam terdapat jalur pejalan kaki selebar 3,5 m. Hitunglah luas jalur pejalan kaki tersebut! (Gunakan <InlineMath math="\pi = \frac{22}{7}"/>)
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">📋 Pembahasan</p>
                  <p className="font-body text-sm text-white/80"><strong>Langkah 1:</strong> Tentukan jari-jari lingkaran besar (kolam + jalur)</p>
                  <BlockMath math="R = 10 + 3{,}5 = 13{,}5 \text{ m}" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 2:</strong> Luas lingkaran besar</p>
                  <BlockMath math="L_{\text{besar}} = \pi R^2 = \frac{22}{7} \times (13{,}5)^2 = \frac{22}{7} \times 182{,}25 \approx 572{,}79 \text{ m}^2" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 3:</strong> Luas lingkaran kecil (kolam)</p>
                  <BlockMath math="L_{\text{kecil}} = \pi r^2 = \frac{22}{7} \times 10^2 = \frac{22}{7} \times 100 \approx 314{,}29 \text{ m}^2" />
                  <p className="font-body text-sm text-white/80"><strong>Langkah 4:</strong> Luas jalur = Luas besar − Luas kecil</p>
                  <BlockMath math="L_{\text{jalur}} = 572{,}79 - 314{,}29 = 258{,}5 \text{ m}^2" />
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                    <p className="font-body text-sm text-red-200 text-center">✅ Luas jalur pejalan kaki ≈ <strong>258,5 m²</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title="📌 Rangkuman Sub-Bab" />
            {open.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm text-white/80">• <strong className="text-cyan-300">π (Pi)</strong> ≈ 3,14 atau 22/7 — konstanta ajaib perbandingan keliling dengan diameter.</p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-green-300">Keliling:</strong> <InlineMath math="K = \pi d = 2\pi r"/></p>
                  <p className="font-body text-sm text-white/80">• <strong className="text-orange-300">Luas:</strong> <InlineMath math="L = \pi r^2"/></p>
                  <p className="font-body text-sm text-white/80">• Soal "cincin" atau "daerah antara dua lingkaran": <InlineMath math="L = \pi(R^2 - r^2)"/></p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    🚀 <strong>Tips Astronot:</strong> Orbit planet adalah elips, tapi banyak orbit buatan dibuat mendekati lingkaran. Rumus keliling digunakan untuk menghitung waktu tempuh satelit mengelilingi bumi!
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default KelilingLuasPage;
