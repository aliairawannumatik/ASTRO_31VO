import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, FlaskConical } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

const PiAnimationSVG = () => {
  const [prog, setProg]       = useState(0);
  const [hasSeen, setHasSeen] = useState(false);
  useEffect(() => {
    let id: number;
    const start = performance.now();
    const PERIOD = 15000;
    const loop = (now: number) => { setProg(((now - start) % PERIOD) / PERIOD); id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  /* Sekali π terungkap, tetap tampil walau animasi loop ulang */
  useEffect(() => {
    if (prog > 0.91 && !hasSeen) setHasSeen(true);
  }, [prog, hasSeen]);

  const ease = (x: number) => x < 0.5 ? 2*x*x : 1 - (-2*x+2)**2/2;
  const band = (s: number, e: number) => prog < s ? 0 : prog > e ? 1 : ease((prog-s)/(e-s));
  const cl   = (x: number) => Math.max(0, Math.min(1, x));

  /* ── Geometri ── */
  const R     = 28;
  const CX    = 155, CY = 66;
  const CIRC  = 2 * Math.PI * R;   // ≈ 175.9
  const D     = 2 * R;             // 56
  const PART  = CIRC - 3 * D;      // ≈ 7.9
  const BOT_Y = CY + R;            // 94 — titik potong bawah
  const LINE_Y = 140;
  const SEG_Y  = 165;

  /* ── Timing ── */
  const drawCircle = band(0.02, 0.18);
  const drawDiam   = band(0.19, 0.33);
  const peel       = band(0.35, 0.60);   // busur meluruskan diri → garis horizontal
  const shift      = band(0.61, 0.71);   // garis bergeser ke bawah
  const s1         = band(0.73, 0.78);
  const s2         = band(0.77, 0.82);
  const s3         = band(0.81, 0.86);
  const s4         = band(0.85, 0.90);
  const piLbl      = band(0.91, 0.96);
  const fadeOut    = prog > 0.97 ? 1 - cl((prog-0.97)/0.03) : 1;

  /* ── Warna busur: cyan → amber seiring peel ── */
  const cr = Math.round(6   + (217-6)   * peel);
  const cg = Math.round(182 + (119-182) * peel);
  const cb = Math.round(212 + (6-212)   * peel);
  const morphStroke = `rgb(${cr},${cg},${cb})`;
  const morphGlow   = `rgba(${cr},${cg},${cb},0.22)`;

  /* ── SVG circle arc (fase menggambar, sebelum morph) ──
     Menggambar dari atas searah jarum jam dengan growing dasharray.
     Memudar saat peel mulai.
  */
  const svgDash    = CIRC * drawCircle;
  const svgOpacity = cl(1 - peel * 5);

  /* ── Polyline morph (satu objek yang sama, berubah bentuk) ──
     N+1 titik dimulai dari BAWAH (titik potong), arah searah jarum jam.
       t=0   → bawah (CX, BOT_Y)  →  ujung kanan garis (CX + CIRC/2, targetY)
       t=0.5 → atas  (CX, CY-R)   →  tengah garis (CX, targetY)
       t=1   → bawah (CX, BOT_Y)  →  ujung kiri garis (CX - CIRC/2, targetY)
     targetY = BOT_Y saat peel berlangsung → LINE_Y setelah shift.
     Interpolasi per-titik: lingkaran → garis datar (satu transformasi mulus).
  */
  const N = 80;
  const targetY = BOT_Y + (LINE_Y - BOT_Y) * shift;

  let morphPts = '';
  if (drawCircle > 0.94 || peel > 0) {
    const pts: string[] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const angle = Math.PI / 2 - t * 2 * Math.PI;   // bawah → CW → bawah
      const cx_pt = CX + R * Math.cos(angle);
      const cy_pt = CY + R * Math.sin(angle);
      const lx_pt = CX + CIRC / 2 - t * CIRC;        // kanan → kiri
      const px = cx_pt + (lx_pt - cx_pt) * peel;
      const py = cy_pt + (targetY - cy_pt) * peel;
      pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
    }
    morphPts = pts.join(' ');
  }
  const morphOpacity = cl((drawCircle - 0.94) / 0.06);

  /* Label keliling (mengambang di atas garis) */
  const lineLen  = CIRC * peel;
  const labelY   = targetY - 11;

  /* ── Diameter: bergeser ke bawah seiring peel, sejajar segmen pertama ──
     Saat drawDiam berlangsung: tumbuh dari pusat di y=CY.
     Saat peel berlangsung: bergeser dari (CX±R, CY) → (SEG_X0 … SEG_X0+D, SEG_Y).
     Kedua band tidak tumpang tindih sehingga persamaan selalu benar.
  */
  const SEG_X0  = CX - CIRC / 2;
  const diamX1  = (CX - R * drawDiam) + (SEG_X0          - (CX - R)) * peel;
  const diamX2  = (CX + R * drawDiam) + (SEG_X0 + D      - (CX + R)) * peel;
  const diamY   = CY + (SEG_Y - CY) * peel;
  /* Label "d": di atas saat pada lingkaran, di bawah saat sudah bergeser */
  const diamLabelY = peel < 0.05 ? CY - R - 8 : diamY + 14;

  /* ── Duplikat diameter ──
     d2 (biru)  : salinan panjang D yang bergeser dari posisi d1 → posisi d2 (geser kanan).
     d3 (ungu)  : salinan panjang D yang bergeser dari posisi d2 → posisi d3 (geser kanan).
     sisa (kuning): panjang PART tumbuh dari ujung d3 (bukan duplikat, melainkan sisa).
  */
  // d2 slide: x1 bergerak dari SEG_X0 → SEG_X0+D, lebar tetap D
  const d2x1 = SEG_X0 + D * s2;
  const d2x2 = d2x1 + D;
  // d3 slide: x1 bergerak dari SEG_X0+D → SEG_X0+2D, lebar tetap D
  const d3x1 = SEG_X0 + D * (1 + s3);
  const d3x2 = d3x1 + D;
  // sisa tumbuh dari ujung d3
  const sisaX1 = SEG_X0 + 3 * D;
  const sisaX2 = sisaX1 + PART * s4;

  const phaseLabel =
    drawCircle < 0.5  ? '① Lingkaran terbentuk...' :
    drawDiam   < 0.7  ? '② Diameter terungkap!' :
    peel       < 0.04 ? '③ Keliling terputus di bawah...' :
    peel       < 0.99 ? `③ Busur meluruskan menjadi garis → ${lineLen.toFixed(1)}` :
    shift      < 0.5  ? '④ Keliling bergeser ke bawah...' :
    s4         < 0.9  ? '⑤ Bandingkan keliling ÷ diameter!' :
                        '⑥ π = K ÷ d ≈ 3,14';

  return (
    <div className="select-none">
      <svg viewBox="0 0 310 220" className="w-full max-w-sm mx-auto my-2"
        aria-label="Busur lingkaran meluruskan diri menjadi garis keliling"
        style={{ opacity: fadeOut }}>

        {/* ── Fill lingkaran (memudar saat morph) ── */}
        {drawCircle > 0.01 && (
          <circle cx={CX} cy={CY} r={R}
            fill={`rgba(6,182,212,${0.12 * svgOpacity})`} />
        )}

        {/* ── SVG circle arc (fase menggambar) ── */}
        {drawCircle > 0.01 && svgOpacity > 0.01 && (
          <>
            <circle cx={CX} cy={CY} r={R} fill="none"
              stroke="rgba(6,182,212,0.22)" strokeWidth="9"
              strokeDasharray={`${svgDash} ${CIRC + 200}`}
              transform={`rotate(-90 ${CX} ${CY})`}
              opacity={svgOpacity} />
            <circle cx={CX} cy={CY} r={R} fill="none"
              stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round"
              strokeDasharray={`${svgDash} ${CIRC + 200}`}
              transform={`rotate(-90 ${CX} ${CY})`}
              opacity={svgOpacity} />
          </>
        )}

        {/* ── Titik pusat ── */}
        {drawCircle > 0.1 && peel < 0.8 && (
          <circle cx={CX} cy={CY} r="2.5" fill="#94a3b8"
            opacity={cl((1 - peel * 1.2) * (1 - shift))} />
        )}

        {/* ── Tanda potong di bawah (✕ kecil) ── */}
        {peel > 0.01 && peel < 0.18 && (
          <g opacity={cl(peel * 8)} stroke="#fbbf24" strokeWidth="1.8">
            <line x1={CX - 4} y1={BOT_Y - 4} x2={CX + 4} y2={BOT_Y + 4} />
            <line x1={CX + 4} y1={BOT_Y - 4} x2={CX - 4} y2={BOT_Y + 4} />
          </g>
        )}

        {/* ── POLYLINE MORPH — objek tunggal: busur → garis ── */}
        {morphPts && (
          <>
            <polyline points={morphPts} fill="none"
              stroke={morphGlow} strokeWidth="10" strokeLinejoin="round"
              strokeLinecap="round" opacity={morphOpacity} />
            <polyline points={morphPts} fill="none"
              stroke={morphStroke} strokeWidth="3.5" strokeLinejoin="round"
              strokeLinecap="round" opacity={morphOpacity} />
          </>
        )}

        {/* ── Label keliling (muncul saat morph sudah setengah jalan) ── */}
        {peel > 0.3 && (
          <text x={CX} y={labelY} fill="#fbbf24" fontSize="8.5"
            textAnchor="middle" fontFamily="monospace" fontWeight="bold"
            opacity={cl((peel - 0.3) / 0.3)}>
            Keliling = {lineLen.toFixed(1)}
          </text>
        )}

        {/* ── Diameter (tidak menghilang — bergeser ke bawah seiring peel) ── */}
        {drawDiam > 0 && (
          <g opacity={drawDiam}>
            {/* glow */}
            <line x1={diamX1} y1={diamY} x2={diamX2} y2={diamY}
              stroke="rgba(34,197,94,0.20)" strokeWidth="8" strokeLinecap="round" />
            {/* body */}
            <line x1={diamX1} y1={diamY} x2={diamX2} y2={diamY}
              stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
            {drawDiam > 0.6 && (
              <>
                <circle cx={diamX1} cy={diamY} r="2.5" fill="#22c55e" />
                <circle cx={diamX2} cy={diamY} r="2.5" fill="#22c55e" />
                {peel > 0.97 && (
                  <>
                    <line x1={diamX1} y1={diamY - 5} x2={diamX1} y2={diamY + 5}
                      stroke="#22c55e" strokeWidth="1.5" />
                    <line x1={diamX2} y1={diamY - 5} x2={diamX2} y2={diamY + 5}
                      stroke="#22c55e" strokeWidth="1.5" />
                  </>
                )}
                <text x={(diamX1 + diamX2) / 2} y={diamLabelY}
                  fill="#4ade80" fontSize="9"
                  textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                  d = {D}
                </text>
              </>
            )}
          </g>
        )}


        {/* ── d1: tick mark kiri-kanan muncul setelah diameter tiba (s1) ── */}
        {s1 > 0 && (
          <g opacity={s1}>
            <line x1={SEG_X0}   y1={SEG_Y-6} x2={SEG_X0}   y2={SEG_Y+6} stroke="#22c55e" strokeWidth="1.5"/>
            <line x1={SEG_X0+D} y1={SEG_Y-6} x2={SEG_X0+D} y2={SEG_Y+6} stroke="#22c55e" strokeWidth="1.5"/>
          </g>
        )}

        {/* ── d2 (biru): salinan diameter yg bergeser dari d1 → posisi d2 ── */}
        {s2 > 0 && (
          <g>
            <line x1={d2x1} y1={SEG_Y} x2={d2x2} y2={SEG_Y}
              stroke="rgba(59,130,246,0.25)" strokeWidth="9" strokeLinecap="round"/>
            <line x1={d2x1} y1={SEG_Y} x2={d2x2} y2={SEG_Y}
              stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
            <line x1={d2x1} y1={SEG_Y-5} x2={d2x1} y2={SEG_Y+5} stroke="#3b82f6" strokeWidth="1.5"/>
            <line x1={d2x2} y1={SEG_Y-5} x2={d2x2} y2={SEG_Y+5} stroke="#3b82f6" strokeWidth="1.5"/>
            {s2 > 0.9 && (
              <text x={(d2x1+d2x2)/2} y={SEG_Y+14} fill="#60a5fa" fontSize="8"
                textAnchor="middle" fontFamily="monospace" fontWeight="bold"
                opacity={cl((s2-0.9)/0.1)}>d</text>
            )}
          </g>
        )}

        {/* ── d3 (ungu): salinan diameter yg bergeser dari d2 → posisi d3 ── */}
        {s3 > 0 && (
          <g>
            <line x1={d3x1} y1={SEG_Y} x2={d3x2} y2={SEG_Y}
              stroke="rgba(168,85,247,0.25)" strokeWidth="9" strokeLinecap="round"/>
            <line x1={d3x1} y1={SEG_Y} x2={d3x2} y2={SEG_Y}
              stroke="#a855f7" strokeWidth="3" strokeLinecap="round"/>
            <line x1={d3x1} y1={SEG_Y-5} x2={d3x1} y2={SEG_Y+5} stroke="#a855f7" strokeWidth="1.5"/>
            <line x1={d3x2} y1={SEG_Y-5} x2={d3x2} y2={SEG_Y+5} stroke="#a855f7" strokeWidth="1.5"/>
            {s3 > 0.9 && (
              <text x={(d3x1+d3x2)/2} y={SEG_Y+14} fill="#c084fc" fontSize="8"
                textAnchor="middle" fontFamily="monospace" fontWeight="bold"
                opacity={cl((s3-0.9)/0.1)}>d</text>
            )}
          </g>
        )}

        {/* ── sisa ≈0,14d (kuning): tumbuh dari ujung d3 ── */}
        {s4 > 0 && sisaX2 > sisaX1 + 0.5 && (
          <g>
            <line x1={sisaX1} y1={SEG_Y} x2={sisaX2} y2={SEG_Y}
              stroke="rgba(234,179,8,0.25)" strokeWidth="9" strokeLinecap="round"
              strokeDasharray="5 3"/>
            <line x1={sisaX1} y1={SEG_Y} x2={sisaX2} y2={SEG_Y}
              stroke="#eab308" strokeWidth="3" strokeLinecap="round"
              strokeDasharray="5 3"/>
            <line x1={sisaX1} y1={SEG_Y-5} x2={sisaX1} y2={SEG_Y+5} stroke="#eab308" strokeWidth="1.5"/>
            {s4 > 0.85 && (
              <>
                <line x1={sisaX2} y1={SEG_Y-5} x2={sisaX2} y2={SEG_Y+5} stroke="#eab308" strokeWidth="1.5"/>
                <text x={(sisaX1+sisaX2)/2} y={SEG_Y+14} fill="#facc15" fontSize="8"
                  textAnchor="middle" fontFamily="monospace" fontWeight="bold"
                  opacity={cl((s4-0.85)/0.15)}>≈0,14d</text>
              </>
            )}
          </g>
        )}

        {/* Konektor dotted */}
        {s4 > 0.9 && (
          <>
            <line x1={SEG_X0}        y1={LINE_Y + 8} x2={SEG_X0}        y2={SEG_Y - 6}
              stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
            <line x1={SEG_X0 + CIRC} y1={LINE_Y + 8} x2={SEG_X0 + CIRC} y2={SEG_Y - 6}
              stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
          </>
        )}

        {/* ── Kotak π ── */}
        {piLbl > 0 && (
          <g opacity={piLbl}>
            <rect x={111} y={5} width={88} height={32} rx="8"
              fill="rgba(168,85,247,0.20)" stroke="#a855f7" strokeWidth="1.5" />
            <text x={155} y={17} fill="#c084fc" fontSize="8.5" textAnchor="middle"
              fontFamily="monospace" fontWeight="bold">π = K ÷ d</text>
            <text x={155} y={31} fill="#fbbf24" fontSize="13" textAnchor="middle"
              fontFamily="monospace" fontWeight="black">≈ 3,14  (22/7)</text>
          </g>
        )}

        <text x="155" y="215" fill="#475569" fontSize="7.5" textAnchor="middle"
          fontFamily="sans-serif">{phaseLabel}</text>
      </svg>

      {/* ── Hasil π dalam LaTeX, muncul permanen setelah terungkap ── */}
      <style>{`
        @keyframes piGlow {
          0%,100% { opacity:.72; filter: drop-shadow(0 0 5px #c084fc) drop-shadow(0 0 12px rgba(192,132,252,.35)); }
          50%      { opacity:1;   filter: drop-shadow(0 0 14px #e879f9) drop-shadow(0 0 28px rgba(232,121,249,.65)) drop-shadow(0 0 42px rgba(251,191,36,.25)); }
        }
        .pi-latex-glow { animation: piGlow 2.4s ease-in-out infinite; color: #e879f9; }
        .pi-latex-glow .katex { font-size: 1.35em; }
        .pi-latex-result { color: #fbbf24; letter-spacing:.04em; }
      `}</style>

      {hasSeen && (
        <div className="flex flex-col items-center gap-1 pb-1"
          style={{ animation: 'fadeInUp .6s ease both' }}>
          <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>
          <div className="pi-latex-glow">
            <BlockMath math={String.raw`\begin{aligned} \pi &= \dfrac{K}{d} \\[4pt] &\approx {\color{#fbbf24} 3{,}14159{\small\color{#fbbf2499}{...}}} \end{aligned}`} />
          </div>
        </div>
      )}
    </div>
  );
};

const KelilingLuasCirclesSVG = () => (
  <div className="w-full">
    <style>{`
      @keyframes kelilingPulse {
        0%,100% { stroke-opacity:.55; filter: drop-shadow(0 0 4px #22d3ee) drop-shadow(0 0 10px rgba(34,211,238,.4)); }
        50%      { stroke-opacity:1;   filter: drop-shadow(0 0 10px #22d3ee) drop-shadow(0 0 28px rgba(34,211,238,.75)) drop-shadow(0 0 48px rgba(34,211,238,.35)); }
      }
      @keyframes kelilingDash {
        from { stroke-dashoffset: 502; }
        to   { stroke-dashoffset: 0;   }
      }
      @keyframes kelilingOrbit {
        from { transform: rotate(0deg);   }
        to   { transform: rotate(360deg); }
      }
      @keyframes luasPulse {
        0%,100% { opacity:.82; filter: drop-shadow(0 0 8px #fb923c)  drop-shadow(0 0 22px rgba(251,146,60,.55)); }
        50%      { opacity:1;   filter: drop-shadow(0 0 12px #fb923c) drop-shadow(0 0 32px rgba(251,146,60,.75)); }
      }
      @keyframes luasSweep {
        0%   { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0% 0 0);   }
      }
      @keyframes fadeScaleIn {
        from { opacity:0; transform:scale(.82); }
        to   { opacity:1; transform:scale(1);   }
      }
      .keliling-ring { animation: kelilingPulse 2.2s ease-in-out infinite, kelilingDash 1.8s ease-out forwards; }
      .keliling-orbit { transform-origin: 80px 80px; animation: kelilingOrbit 6s linear infinite; }
      .luas-fill { animation: luasPulse 2.4s ease-in-out infinite; }
      .circle-card { animation: fadeScaleIn .7s cubic-bezier(.22,1,.36,1) both; }
      .circle-card-right { animation: fadeScaleIn .7s .18s cubic-bezier(.22,1,.36,1) both; }
    `}</style>

    <div className="grid grid-cols-2 gap-3 sm:gap-5 mb-2">

      {/* ── Keliling: hanya outline yang menyala ── */}
      <div className="circle-card flex flex-col items-center gap-2 bg-cyan-500/8 border border-cyan-500/30 rounded-2xl px-3 py-4 text-center">
        <p className="font-body text-xs font-bold text-cyan-300 tracking-wide uppercase">⭕ Keliling</p>
        <svg viewBox="0 0 160 160" className="w-full max-w-[140px]" aria-label="Lingkaran keliling">
          <defs>
            <radialGradient id="kGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#22d3ee" stopOpacity=".06" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0"   />
            </radialGradient>
          </defs>

          {/* Interior: transparan penuh */}
          <circle cx="80" cy="80" r="58" fill="url(#kGlow)" />

          {/* Outer glow ring */}
          <circle cx="80" cy="80" r="58" fill="none"
            stroke="#22d3ee" strokeWidth="12" strokeOpacity=".12"
            className="keliling-ring"
            strokeDasharray="502" strokeDashoffset="502" />

          {/* Main glowing stroke */}
          <circle cx="80" cy="80" r="58" fill="none"
            stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round"
            className="keliling-ring"
            strokeDasharray="502" strokeDashoffset="502" />

          {/* Orbiting dot */}
          <g className="keliling-orbit">
            <circle cx="138" cy="80" r="5" fill="#22d3ee" opacity=".9"
              style={{ filter: 'drop-shadow(0 0 6px #22d3ee) drop-shadow(0 0 14px rgba(34,211,238,.8))' }} />
          </g>

          {/* Centre dot */}
          <circle cx="80" cy="80" r="3" fill="#94a3b8" opacity=".5" />

          {/* Radius dashed line */}
          <line x1="80" y1="80" x2="138" y2="80"
            stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" opacity=".6" />
          <text x="110" y="74" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle" opacity=".8">r</text>

          {/* Label inside */}
          <text x="80" y="84" fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" opacity=".55">K = 2πr</text>
        </svg>
        <p className="font-body text-[10px] text-white/45 leading-snug">Hanya <span className="text-cyan-300 font-semibold">tepi/garis</span> yang menyala — itulah keliling!</p>
      </div>

      {/* ── Luas: interior yang menyala ── */}
      <div className="circle-card-right flex flex-col items-center gap-2 bg-orange-500/8 border border-orange-500/30 rounded-2xl px-3 py-4 text-center">
        <p className="font-body text-xs font-bold text-orange-300 tracking-wide uppercase">🟠 Luas</p>
        <svg viewBox="0 0 160 160" className="w-full max-w-[140px]" aria-label="Lingkaran luas">
          <defs>
            <radialGradient id="lGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#fb923c" stopOpacity="1"   />
              <stop offset="70%"  stopColor="#fb923c" stopOpacity=".55" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0"   />
            </radialGradient>
            <radialGradient id="lGlowOuter" cx="50%" cy="50%" r="50%">
              <stop offset="60%"  stopColor="#fb923c" stopOpacity="0"   />
              <stop offset="100%" stopColor="#fb923c" stopOpacity=".18" />
            </radialGradient>
          </defs>

          {/* Outer boundary: dim redup */}
          <circle cx="80" cy="80" r="58" fill="none"
            stroke="#fb923c" strokeWidth="2" strokeOpacity=".22" />

          {/* Inner glow fill — steady, full */}
          <circle cx="80" cy="80" r="57" fill="url(#lGlow)"
            fillOpacity="1" className="luas-fill" />

          {/* Extra outer halo */}
          <circle cx="80" cy="80" r="57" fill="url(#lGlowOuter)"
            fillOpacity="1" className="luas-fill" />

          {/* Radius arrow */}
          <line x1="80" y1="80" x2="130" y2="80"
            stroke="#fdba74" strokeWidth="2" strokeLinecap="round" opacity=".85" />
          <polygon points="130,76 138,80 130,84" fill="#fdba74" opacity=".85" />
          <text x="106" y="74" fill="#fdba74" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">r</text>

          {/* Centre dot */}
          <circle cx="80" cy="80" r="3.5" fill="#fdba74" opacity=".9"
            style={{ filter: 'drop-shadow(0 0 5px #fb923c)' }} />

          {/* Label inside */}
          <text x="80" y="100" fill="#fb923c" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" opacity=".7">L = πr²</text>
        </svg>
        <p className="font-body text-[10px] text-white/45 leading-snug">Yang menyala adalah <span className="text-orange-300 font-semibold">daerah dalam</span> — itulah luas!</p>
      </div>

    </div>
  </div>
);

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
                <KelilingLuasCirclesSVG />
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
