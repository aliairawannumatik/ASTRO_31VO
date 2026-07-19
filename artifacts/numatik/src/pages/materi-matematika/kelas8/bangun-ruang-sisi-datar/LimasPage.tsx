import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Triangle, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";
import JaringLimasInteraktif from "@/components/JaringLimasInteraktif";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

/* ─────────────────────────────────────────────────────────────
   SVG 3D MATH UTILITIES
───────────────────────────────────────────────────────────── */
type LV3 = [number, number, number];
type LV2 = [number, number];
const lRotX = (v: LV3, a: number): LV3 => [v[0], v[1]*Math.cos(a)-v[2]*Math.sin(a), v[1]*Math.sin(a)+v[2]*Math.cos(a)];
const lRotY = (v: LV3, a: number): LV3 => [v[0]*Math.cos(a)+v[2]*Math.sin(a), v[1], -v[0]*Math.sin(a)+v[2]*Math.cos(a)];
const lProj = (v: LV3, fov=380, s=1.3): LV2 => { const tz=v[2]+fov; return [(v[0]*fov*s)/tz,(v[1]*fov*s)/tz]; };
const lCross = (ax:number,ay:number,bx:number,by:number) => ax*by-ay*bx;

const makeLimasVerts = (n: number, r: number, h: number): LV3[] => {
  const verts: LV3[] = [];
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    verts.push([r * Math.cos(a), h * 0.55, r * Math.sin(a)]);
  }
  verts.push([0, -h * 0.45, 0]);
  return verts;
};
const makeLimasFaces = (n: number, baseLabel: string) => {
  const palette = ["#3b82f6","#ef4444","#eab308","#22c55e","#f97316","#ec4899","#06b6d4","#a78bfa"];
  const apexIdx = n;
  const faces: { idx: number[]; color: string; label: string }[] = [];
  faces.push({ idx: Array.from({length:n},(_,i)=>i), color:palette[0], label: baseLabel });
  for (let i = 0; i < n; i++) {
    const j = (i+1)%n;
    faces.push({ idx:[i,j,apexIdx], color:palette[(i+1)%palette.length], label:`Δ${i+1}` });
  }
  return faces;
};

const RotatingLimas3D = ({ n, label, r = 40, h = 65, baseLabel }: { n: number; label: string; r?: number; h?: number; baseLabel: string }) => {
  const { isDark } = useTheme();
  const [rotX, setRotX] = useState(-22);
  const [rotY, setRotY] = useState(n * 40);
  const [isDragging, setIsDragging] = useState(false);
  const isDragRef = useRef(false);
  const dragRef   = useRef({ sx:0, sy:0, bx:-22, by: n*40 });
  const tickRef   = useRef(n * 30);
  const rotYRef   = useRef(n * 40);
  const rafRef    = useRef<number|null>(null);

  useEffect(() => {
    const animate = () => {
      if (!isDragRef.current) {
        tickRef.current += 1;
        rotYRef.current += 0.20;
        const rx = -18 + Math.sin(tickRef.current * 0.013) * 18;
        setRotY(rotYRef.current);
        setRotX(rx);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragRef.current = true; setIsDragging(true);
    dragRef.current = { sx: e.clientX, sy: e.clientY, bx: rotX, by: rotY };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragRef.current) return;
    const ny = dragRef.current.by - (e.clientX - dragRef.current.sx) * 0.55;
    const nx = dragRef.current.bx + (e.clientY - dragRef.current.sy) * 0.55;
    rotYRef.current = ny; setRotY(ny); setRotX(nx);
  }, []);
  const onMouseUp = useCallback(() => { isDragRef.current = false; setIsDragging(false); }, []);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]; isDragRef.current = true; setIsDragging(true);
    dragRef.current = { sx: t.clientX, sy: t.clientY, bx: rotX, by: rotY };
  };
  const onTouchMove = useCallback((ev: TouchEvent) => {
    if (!isDragRef.current) return;
    const t = ev.touches[0];
    const ny = dragRef.current.by - (t.clientX - dragRef.current.sx) * 0.55;
    const nx = dragRef.current.bx + (t.clientY - dragRef.current.sy) * 0.55;
    rotYRef.current = ny; setRotY(ny); setRotX(nx);
  }, []);
  const onTouchEnd = useCallback(() => { isDragRef.current = false; setIsDragging(false); }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  const rx = (rotX * Math.PI) / 180;
  const ry = (rotY * Math.PI) / 180;
  const rawVerts = makeLimasVerts(n, r, h);
  const faceDefs = makeLimasFaces(n, baseLabel);
  const tfVerts = rawVerts.map(v => lRotX(lRotY(v, ry), rx));
  const pverts: LV2[] = tfVerts.map(v => lProj(v));
  const facesWithDepth = faceDefs.map(f => {
    const avgZ = f.idx.reduce((s,i)=>s+tfVerts[i][2],0)/f.idx.length;
    const pts2d = f.idx.map(i => pverts[i]);
    const area = lCross(pts2d[1][0]-pts2d[0][0],pts2d[1][1]-pts2d[0][1],pts2d[pts2d.length-1][0]-pts2d[0][0],pts2d[pts2d.length-1][1]-pts2d[0][1]);
    return { ...f, avgZ, pts2d, visible: area < 0 };
  }).sort((a,b) => b.avgZ - a.avgZ);
  const cx = 85, cy = 88;

  return (
    <div
      className={`flex flex-col items-center ${isDark ? "bg-slate-900/60 border border-slate-700/50" : "bg-gray-100 border border-gray-200"} rounded-xl py-2 px-1 select-none`}
      style={{ cursor: isDragging ? "grabbing" : "grab", flex:1, minWidth:0 }}
      onMouseDown={onMouseDown} onTouchStart={onTouchStart}
    >
      <span className={isDark ? "text-white/70 font-body font-semibold mb-1" : "text-slate-600 font-body font-semibold mb-1"} style={{ fontSize:10 }}>{label}</span>
      <svg viewBox="0 0 170 176" style={{ width:"100%", maxWidth:160, overflow:"visible" }}>
        {facesWithDepth.map((f, i) => {
          const pts = f.pts2d.map(([x,y]) => `${cx+x},${cy+y}`).join(" ");
          const mx  = f.pts2d.reduce((s,p)=>s+p[0],0)/f.pts2d.length;
          const my  = f.pts2d.reduce((s,p)=>s+p[1],0)/f.pts2d.length;
          return (
            <g key={i}>
              <polygon points={pts} fill={f.color} fillOpacity={1}
                stroke={isDark ? "rgba(255,255,255,0.5)" : "rgba(30,41,59,0.35)"} strokeWidth={1.2} strokeLinejoin="round"/>
              <text x={cx+mx} y={cy+my+3} fill="var(--icon-color)" fontSize={7} fontFamily="monospace"
                fontWeight="bold" textAnchor="middle" dominantBaseline="middle"
                style={{ pointerEvents:"none" }}>{f.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const ThreeLimas = () => {
  const { isDark } = useTheme();
  const { language: lang } = useLanguage();
  const autoHint = lang === "en" ? "Auto-rotating · Drag to rotate"
    : lang === "ja" ? "自動回転 · ドラッグで回転"
    : "Berputar otomatis · Drag untuk memutar sendiri";
  const names = lang === "en"
    ? ["Triangular Pyramid", "Square Pyramid", "Pentagonal Pyramid"]
    : lang === "ja"
    ? ["三角錐", "四角錐", "五角錐"]
    : ["Limas Segitiga", "Limas Segiempat", "Limas Segilima"];
  const baseLabel = lang === "en" ? "BASE" : lang === "ja" ? "底面" : "ALAS";
  const lateralLabel = lang === "en" ? "FACE Δ" : lang === "ja" ? "側面 Δ" : "SISI Δ";
  return (
    <div className={isDark ? "bg-slate-900/70 border border-slate-700/50 rounded-xl p-3 space-y-2" : "bg-gray-100 border border-gray-200 rounded-xl p-3 space-y-2"}>
      <p className={isDark ? "text-center text-white/40 font-body" : "text-center text-slate-500 font-body"} style={{ fontSize:9 }}>{autoHint}</p>
      <div className="flex gap-2">
        <RotatingLimas3D n={3} label={names[0]} r={38} h={65} baseLabel={baseLabel}/>
        <RotatingLimas3D n={4} label={names[1]} r={36} h={65} baseLabel={baseLabel}/>
        <RotatingLimas3D n={5} label={names[2]} r={34} h={65} baseLabel={baseLabel}/>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 justify-center">
        {[["#3b82f6", baseLabel],["#ef4444", lateralLabel]].map(([c,l])=>(
          <div key={l} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background:c }}/>
            <span className={isDark ? "text-white/45 font-body" : "text-slate-500 font-body"} style={{ fontSize:9 }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LIMAS_COMPARISON_COLORS = {
  alas: "#22d3ee",
  tegak: "#f97316",
  sisiAlas: "#3b82f6",
  sisiTegak: "#8b5cf6",
  puncak: "#facc15",
};

type Limas2DPoint = [number, number];

const limasNgon = (cx: number, cy: number, rx: number, ry: number, n: number): Limas2DPoint[] =>
  Array.from({ length: n }, (_, i) => {
    const start = n === 4 ? -Math.PI / 4 : -Math.PI / 2;
    const a = start + (2 * Math.PI * i) / n;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });

const limasPoly = (pts: Limas2DPoint[]) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

const StandingLimasRusuk = ({ n, cx, name, rusukLabel, phase }: { n: number; cx: number; name: string; rusukLabel: string; phase: number }) => {
  const { isDark } = useTheme();
  const base = limasNgon(cx, 148, 31, 13, n);
  const apex: Limas2DPoint = [cx, 42];
  const showAlas = phase === 0 || phase === 2;
  const showTegak = phase === 1 || phase === 2;
  const opAlas = showAlas ? 1 : 0.18;
  const opTegak = showTegak ? 1 : 0.18;
  const swAlas = showAlas ? 3.2 : 1.4;
  const swTegak = showTegak ? 3.2 : 1.4;
  return (
    <g>
      {base.map((p, i) => {
        const p2 = base[(i + 1) % n];
        const fill = i % 2 === 0 ? "rgba(139,92,246,0.20)" : "rgba(59,130,246,0.16)";
        return <polygon key={`face-${i}`} points={limasPoly([p, p2, apex])} fill={fill} stroke="rgba(100,116,139,0.35)" strokeWidth="0.6" />;
      })}
      <polygon points={limasPoly(base)} fill={isDark ? "rgba(15,23,42,0.65)" : "rgba(241,245,249,0.90)"} stroke="rgba(100,116,139,0.3)" strokeWidth="0.7" />
      {base.map((p, i) => {
        const p2 = base[(i + 1) % n];
        return (
          <line key={`alas-${i}`}
            x1={p[0].toFixed(1)} y1={p[1].toFixed(1)}
            x2={p2[0].toFixed(1)} y2={p2[1].toFixed(1)}
            stroke={LIMAS_COMPARISON_COLORS.alas} strokeWidth={swAlas} strokeOpacity={opAlas}
            strokeLinecap="round" className={showAlas ? "limas-rusuk-glow-alas" : ""}/>
        );
      })}
      {base.map((p, i) => (
        <line key={`tegak-${i}`}
          x1={p[0].toFixed(1)} y1={p[1].toFixed(1)}
          x2={apex[0].toFixed(1)} y2={apex[1].toFixed(1)}
          stroke={LIMAS_COMPARISON_COLORS.tegak} strokeWidth={swTegak} strokeOpacity={opTegak}
          strokeLinecap="round" className={showTegak ? "limas-rusuk-glow-tegak" : ""}/>
      ))}
      {[...base, apex].map(([x, y], i) => <circle key={`v-${i}`} cx={x.toFixed(1)} cy={y.toFixed(1)} r="2.2" fill="#cbd5e1" opacity="0.7" />)}
      <text x={cx} y={174} textAnchor="middle" fontSize="8.5" fill={isDark ? "#e2e8f0" : "#1e293b"} fontFamily="sans-serif" fontWeight="bold">{name}</text>
      <text x={cx} y={186} textAnchor="middle" fontSize="7.5" fill={isDark ? "#94a3b8" : "#475569"} fontFamily="monospace">{rusukLabel}</text>
    </g>
  );
};

const StandingLimasSisi = ({ n, cx, name, sisiLabel, phase }: { n: number; cx: number; name: string; sisiLabel: string; phase: number }) => {
  const { isDark } = useTheme();
  const base = limasNgon(cx, 148, 31, 13, n);
  const apex: Limas2DPoint = [cx, 42];
  const showAlas = phase === 0 || phase === 2;
  const showTegak = phase === 1 || phase === 2;
  const opAlas = showAlas ? 0.85 : 0.10;
  const opTegak = showTegak ? 0.72 : 0.10;
  const strokeAlas = showAlas ? LIMAS_COMPARISON_COLORS.sisiAlas : "#334155";
  const strokeTegak = showTegak ? LIMAS_COMPARISON_COLORS.sisiTegak : "#334155";
  return (
    <g>
      {base.map((p, i) => {
        const p2 = base[(i + 1) % n];
        return (
          <polygon key={`tegak-${i}`}
            points={limasPoly([p, p2, apex])}
            fill={LIMAS_COMPARISON_COLORS.sisiTegak} fillOpacity={opTegak}
            stroke={strokeTegak} strokeWidth={showTegak ? 1.3 : 0.6}
            className={showTegak ? "limas-sisi-glow-tegak" : ""}/>
        );
      })}
      <polygon points={limasPoly(base)}
        fill={LIMAS_COMPARISON_COLORS.sisiAlas} fillOpacity={opAlas}
        stroke={strokeAlas} strokeWidth={showAlas ? 1.5 : 0.6}
        className={showAlas ? "limas-sisi-glow-alas" : ""}/>
      {[...base, apex].map(([x, y], i) => <circle key={`v-${i}`} cx={x.toFixed(1)} cy={y.toFixed(1)} r="2" fill="#cbd5e1" opacity="0.6" />)}
      <text x={cx} y={174} textAnchor="middle" fontSize="8.5" fill={isDark ? "#e2e8f0" : "#1e293b"} fontFamily="sans-serif" fontWeight="bold">{name}</text>
      <text x={cx} y={186} textAnchor="middle" fontSize="7.5" fill={isDark ? "#94a3b8" : "#475569"} fontFamily="monospace">{sisiLabel}</text>
    </g>
  );
};

const StandingLimasTitik = ({ n, cx, name, titikLabel, phase }: { n: number; cx: number; name: string; titikLabel: string; phase: number }) => {
  const { isDark } = useTheme();
  const base = limasNgon(cx, 148, 31, 13, n);
  const apex: Limas2DPoint = [cx, 42];
  const showAlas = phase === 0 || phase === 2;
  const showPuncak = phase === 1 || phase === 2;
  return (
    <g>
      {base.map((p, i) => <polygon key={`face-${i}`} points={limasPoly([p, base[(i + 1) % n], apex])} fill={isDark ? "rgba(51,65,85,0.30)" : "rgba(148,163,184,0.20)"} stroke="rgba(100,116,139,0.28)" strokeWidth="0.5" />)}
      <polygon points={limasPoly(base)} fill={isDark ? "rgba(15,23,42,0.55)" : "rgba(241,245,249,0.85)"} stroke={isDark ? "#334155" : "#94a3b8"} strokeWidth="0.8" />
      {base.map((p, i) => (
        <line key={`e-${i}`} x1={p[0].toFixed(1)} y1={p[1].toFixed(1)} x2={apex[0].toFixed(1)} y2={apex[1].toFixed(1)} stroke={isDark ? "#334155" : "#94a3b8"} strokeWidth="0.8" />
      ))}
      {base.map(([x, y], i) => (
        <circle key={`alas-${i}`} cx={x.toFixed(1)} cy={y.toFixed(1)}
          r={showAlas ? 5.5 : 2.5} fill={LIMAS_COMPARISON_COLORS.alas}
          opacity={showAlas ? 1 : 0.18} className={showAlas ? "limas-titik-glow-alas" : ""}
          style={{ animationDelay: `${i * 0.12}s` }}/>
      ))}
      <circle cx={apex[0].toFixed(1)} cy={apex[1].toFixed(1)}
        r={showPuncak ? 6 : 2.8} fill={LIMAS_COMPARISON_COLORS.puncak}
        opacity={showPuncak ? 1 : 0.18} className={showPuncak ? "limas-titik-glow-puncak" : ""}/>
      <text x={cx} y={174} textAnchor="middle" fontSize="8.5" fill={isDark ? "#e2e8f0" : "#1e293b"} fontFamily="sans-serif" fontWeight="bold">{name}</text>
      <text x={cx} y={186} textAnchor="middle" fontSize="7.5" fill={isDark ? "#94a3b8" : "#475569"} fontFamily="monospace">{titikLabel}</text>
    </g>
  );
};

const LimasComparisonFrame = ({
  phases, phase, setPhase, auto, setAuto, children, caption,
}: {
  phases: { key: string; label: string; color: string; desc: string }[];
  phase: number; setPhase: (phase: number) => void;
  auto: boolean; setAuto: (auto: boolean) => void;
  children: React.ReactNode; caption: string;
}) => {
  const { isDark } = useTheme();
  const { language: lang } = useLanguage();
  const stopAuto = lang === "en" ? "⏸ Stop auto" : lang === "ja" ? "⏸ 自動停止" : "⏸ Berhenti otomatis";
  const startAuto = lang === "en" ? "▶ Auto play" : lang === "ja" ? "▶ 自動再生" : "▶ Putar otomatis";
  const current = phases[phase];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5 justify-center">
        {phases.map((p, i) => (
          <button key={p.key}
            onClick={() => { setPhase(i); setAuto(false); }}
            className="text-xs font-bold py-1.5 px-2.5 rounded-lg border transition-all duration-200 font-body"
            style={{
              borderColor: p.color, color: phase === i ? "#0f172a" : p.color,
              backgroundColor: phase === i ? p.color : "transparent", opacity: phase === i ? 1 : 0.55,
            }}>
            {p.label}
          </button>
        ))}
      </div>
      <div className={isDark ? "bg-slate-900/80 border border-slate-700/50 rounded-xl overflow-hidden" : "bg-white/90 border border-gray-200 rounded-xl overflow-hidden"}>
        <svg viewBox="0 0 340 218" className="w-full" style={{ maxHeight: 245 }}>
          <defs>
            <style>{`
              @keyframes limasRusukAlas{0%,100%{filter:drop-shadow(0 0 5px ${LIMAS_COMPARISON_COLORS.alas}) drop-shadow(0 0 10px ${LIMAS_COMPARISON_COLORS.alas});}50%{filter:drop-shadow(0 0 1px ${LIMAS_COMPARISON_COLORS.alas});}}
              @keyframes limasRusukTegak{0%,100%{filter:drop-shadow(0 0 5px ${LIMAS_COMPARISON_COLORS.tegak}) drop-shadow(0 0 10px ${LIMAS_COMPARISON_COLORS.tegak});}50%{filter:drop-shadow(0 0 1px ${LIMAS_COMPARISON_COLORS.tegak});}}
              @keyframes limasSisiAlas{0%,100%{filter:drop-shadow(0 0 6px ${LIMAS_COMPARISON_COLORS.sisiAlas}) drop-shadow(0 0 12px ${LIMAS_COMPARISON_COLORS.sisiAlas});}50%{filter:drop-shadow(0 0 1px ${LIMAS_COMPARISON_COLORS.sisiAlas});}}
              @keyframes limasSisiTegak{0%,100%{filter:drop-shadow(0 0 6px ${LIMAS_COMPARISON_COLORS.sisiTegak}) drop-shadow(0 0 12px ${LIMAS_COMPARISON_COLORS.sisiTegak});}50%{filter:drop-shadow(0 0 1px ${LIMAS_COMPARISON_COLORS.sisiTegak});}}
              @keyframes limasTitikAlas{0%,100%{filter:drop-shadow(0 0 5px ${LIMAS_COMPARISON_COLORS.alas}) drop-shadow(0 0 10px ${LIMAS_COMPARISON_COLORS.alas});}50%{filter:drop-shadow(0 0 1px ${LIMAS_COMPARISON_COLORS.alas});}}
              @keyframes limasTitikPuncak{0%,100%{filter:drop-shadow(0 0 5px ${LIMAS_COMPARISON_COLORS.puncak}) drop-shadow(0 0 10px ${LIMAS_COMPARISON_COLORS.puncak});}50%{filter:drop-shadow(0 0 1px ${LIMAS_COMPARISON_COLORS.puncak});}}
              .limas-rusuk-glow-alas{animation:limasRusukAlas 1.6s ease-in-out infinite;}
              .limas-rusuk-glow-tegak{animation:limasRusukTegak 1.6s ease-in-out infinite 0.3s;}
              .limas-sisi-glow-alas{animation:limasSisiAlas 1.8s ease-in-out infinite;}
              .limas-sisi-glow-tegak{animation:limasSisiTegak 1.8s ease-in-out infinite 0.4s;}
              .limas-titik-glow-alas{animation:limasTitikAlas 1.6s ease-in-out infinite;}
              .limas-titik-glow-puncak{animation:limasTitikPuncak 1.6s ease-in-out infinite 0.5s;}
            `}</style>
          </defs>
          <line x1="113.5" y1="5" x2="113.5" y2="160" stroke={isDark ? "#1e293b" : "#cbd5e1"} strokeWidth="1" />
          <line x1="226.5" y1="5" x2="226.5" y2="160" stroke={isDark ? "#1e293b" : "#cbd5e1"} strokeWidth="1" />
          {children}
          <text x="170" y="213" textAnchor="middle" fontSize="8" fill="#facc15" fontFamily="monospace">{caption}</text>
        </svg>
      </div>
      <div className="rounded-lg px-4 py-2.5 text-xs font-body border flex items-start gap-2"
        style={{ borderColor: `${current.color}50`, backgroundColor: `${current.color}12` }}>
        <span className="font-bold whitespace-nowrap mt-0.5" style={{ color: current.color }}>{current.label}</span>
        <span className={isDark ? "text-white/60" : "text-slate-600"}>— {current.desc}</span>
      </div>
      <button onClick={() => setAuto(!auto)}
        className={isDark ? "w-full text-xs font-body py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all" : "w-full text-xs font-body py-1.5 rounded-lg border border-gray-300 text-slate-500 hover:text-slate-700 hover:border-gray-400 transition-all"}>
        {auto ? stopAuto : startAuto}
      </button>
    </div>
  );
};

const RusukTigaLimasAnimation = () => {
  const { language: lang } = useLanguage();
  const phases = lang === "en" ? [
    { key: "alas",  label: "Base Edges",    color: LIMAS_COMPARISON_COLORS.alas,  desc: "edges forming the base of the pyramid" },
    { key: "tegak", label: "Lateral Edges", color: LIMAS_COMPARISON_COLORS.tegak, desc: "edges from each base vertex to the apex" },
    { key: "all",   label: "All Edges",     color: "#a78bfa", desc: "total edges = 2 × n  (n = number of base sides)" },
  ] : lang === "ja" ? [
    { key: "alas",  label: "底面の辺",   color: LIMAS_COMPARISON_COLORS.alas,  desc: "底面を構成する辺" },
    { key: "tegak", label: "側面の辺",   color: LIMAS_COMPARISON_COLORS.tegak, desc: "底面の各頂点から頂点へつながる辺" },
    { key: "all",   label: "すべての辺", color: "#a78bfa", desc: "辺の総数 = 2 × n  (n = 底面の辺数)" },
  ] : [
    { key: "alas",  label: "Rusuk Alas",   color: LIMAS_COMPARISON_COLORS.alas,  desc: "rusuk-rusuk yang membentuk alas limas" },
    { key: "tegak", label: "Rusuk Tegak",  color: LIMAS_COMPARISON_COLORS.tegak, desc: "rusuk dari setiap titik alas menuju satu titik puncak" },
    { key: "all",   label: "Semua Rusuk",  color: "#a78bfa", desc: "total rusuk limas = 2 × n  (n = banyak sisi alas)" },
  ];
  const caption = lang === "en" ? "No top/lid edges  ·  Pyramid edges = 2n"
    : lang === "ja" ? "上面の辺なし  ·  角錐の辺 = 2n"
    : "Tidak ada rusuk atas/tutup  ·  Rusuk Limas = 2n";
  const names = lang === "en"
    ? [{ name:"Triangular Pyramid", rusukLabel:"2×3 = 6 edges", sisiLabel:"3+1 = 4 faces", titikLabel:"3+1 = 4 vertices" },
       { name:"Square Pyramid",     rusukLabel:"2×4 = 8 edges", sisiLabel:"4+1 = 5 faces", titikLabel:"4+1 = 5 vertices" },
       { name:"Pentagonal Pyramid", rusukLabel:"2×5 = 10 edges",sisiLabel:"5+1 = 6 faces", titikLabel:"5+1 = 6 vertices" }]
    : lang === "ja"
    ? [{ name:"三角錐",   rusukLabel:"2×3 = 6 辺",  sisiLabel:"3+1 = 4 面",  titikLabel:"3+1 = 4 頂点" },
       { name:"四角錐",   rusukLabel:"2×4 = 8 辺",  sisiLabel:"4+1 = 5 面",  titikLabel:"4+1 = 5 頂点" },
       { name:"五角錐",   rusukLabel:"2×5 = 10 辺", sisiLabel:"5+1 = 6 面",  titikLabel:"5+1 = 6 頂点" }]
    : [{ name:"Limas Segitiga",  rusukLabel:"2×3 = 6 rusuk",  sisiLabel:"3+1 = 4 sisi",  titikLabel:"3+1 = 4 titik" },
       { name:"Limas Segiempat", rusukLabel:"2×4 = 8 rusuk",  sisiLabel:"4+1 = 5 sisi",  titikLabel:"4+1 = 5 titik" },
       { name:"Limas Segilima",  rusukLabel:"2×5 = 10 rusuk", sisiLabel:"5+1 = 6 sisi",  titikLabel:"5+1 = 6 titik" }];
  const ITEMS = [
    { n:3, cx:57,  ...names[0] },
    { n:4, cx:170, ...names[1] },
    { n:5, cx:283, ...names[2] },
  ];
  const [phase, setPhase] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setPhase(p => (p + 1) % phases.length), 2000);
    return () => clearInterval(id);
  }, [auto, phases.length]);
  return (
    <LimasComparisonFrame phases={phases} phase={phase} setPhase={setPhase} auto={auto} setAuto={setAuto} caption={caption}>
      {ITEMS.map(item => <StandingLimasRusuk key={item.n} {...item} phase={phase} />)}
    </LimasComparisonFrame>
  );
};

const SisiTigaLimasAnimation = () => {
  const { language: lang } = useLanguage();
  const phases = lang === "en" ? [
    { key: "alas",  label: "Base Face",      color: LIMAS_COMPARISON_COLORS.sisiAlas,  desc: "one n-sided base face" },
    { key: "tegak", label: "Triangular Faces",color: LIMAS_COMPARISON_COLORS.sisiTegak, desc: "n triangular lateral faces meeting at the apex" },
    { key: "all",   label: "All Faces",       color: "#a78bfa", desc: "total faces = n + 1  (1 base + n triangles)" },
  ] : lang === "ja" ? [
    { key: "alas",  label: "底面",     color: LIMAS_COMPARISON_COLORS.sisiAlas,  desc: "n角形の底面 1枚" },
    { key: "tegak", label: "側面（三角形）", color: LIMAS_COMPARISON_COLORS.sisiTegak, desc: "頂点で交わるn枚の三角形の側面" },
    { key: "all",   label: "全ての面", color: "#a78bfa", desc: "面の総数 = n + 1  (底面1 + 三角形n)" },
  ] : [
    { key: "alas",  label: "Sisi Alas",           color: LIMAS_COMPARISON_COLORS.sisiAlas,  desc: "satu bidang alas berbentuk segi-n" },
    { key: "tegak", label: "Sisi Tegak Segitiga",  color: LIMAS_COMPARISON_COLORS.sisiTegak, desc: "n sisi tegak berbentuk segitiga yang bertemu di puncak" },
    { key: "all",   label: "Semua Sisi",           color: "#a78bfa", desc: "total sisi limas = n + 1  (1 alas + n segitiga)" },
  ];
  const caption = lang === "en" ? "1 base + n triangular faces  ·  Faces = n + 1"
    : lang === "ja" ? "底面1 + 三角形n  ·  面数 = n + 1"
    : "1 alas + n sisi segitiga  ·  Sisi Limas = n + 1";
  const names = lang === "en"
    ? [{ name:"Triangular Pyramid", rusukLabel:"2×3 = 6 edges", sisiLabel:"3+1 = 4 faces", titikLabel:"3+1 = 4 vertices" },
       { name:"Square Pyramid",     rusukLabel:"2×4 = 8 edges", sisiLabel:"4+1 = 5 faces", titikLabel:"4+1 = 5 vertices" },
       { name:"Pentagonal Pyramid", rusukLabel:"2×5 = 10 edges",sisiLabel:"5+1 = 6 faces", titikLabel:"5+1 = 6 vertices" }]
    : lang === "ja"
    ? [{ name:"三角錐", rusukLabel:"2×3 = 6 辺",  sisiLabel:"3+1 = 4 面",  titikLabel:"3+1 = 4 頂点" },
       { name:"四角錐", rusukLabel:"2×4 = 8 辺",  sisiLabel:"4+1 = 5 面",  titikLabel:"4+1 = 5 頂点" },
       { name:"五角錐", rusukLabel:"2×5 = 10 辺", sisiLabel:"5+1 = 6 面",  titikLabel:"5+1 = 6 頂点" }]
    : [{ name:"Limas Segitiga",  rusukLabel:"2×3 = 6 rusuk",  sisiLabel:"3+1 = 4 sisi",  titikLabel:"3+1 = 4 titik" },
       { name:"Limas Segiempat", rusukLabel:"2×4 = 8 rusuk",  sisiLabel:"4+1 = 5 sisi",  titikLabel:"4+1 = 5 titik" },
       { name:"Limas Segilima",  rusukLabel:"2×5 = 10 rusuk", sisiLabel:"5+1 = 6 sisi",  titikLabel:"5+1 = 6 titik" }];
  const ITEMS = [{ n:3, cx:57, ...names[0] }, { n:4, cx:170, ...names[1] }, { n:5, cx:283, ...names[2] }];
  const [phase, setPhase] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setPhase(p => (p + 1) % phases.length), 2200);
    return () => clearInterval(id);
  }, [auto, phases.length]);
  return (
    <LimasComparisonFrame phases={phases} phase={phase} setPhase={setPhase} auto={auto} setAuto={setAuto} caption={caption}>
      {ITEMS.map(item => <StandingLimasSisi key={item.n} {...item} phase={phase} />)}
    </LimasComparisonFrame>
  );
};

const TitikSudutTigaLimasAnimation = () => {
  const { language: lang } = useLanguage();
  const phases = lang === "en" ? [
    { key: "alas",   label: "Base Vertices",  color: LIMAS_COMPARISON_COLORS.alas,  desc: "vertices forming the base" },
    { key: "puncak", label: "Apex",            color: LIMAS_COMPARISON_COLORS.puncak, desc: "one point where all lateral faces meet" },
    { key: "all",    label: "All Vertices",   color: "#a78bfa", desc: "total vertices = n + 1" },
  ] : lang === "ja" ? [
    { key: "alas",   label: "底面の頂点", color: LIMAS_COMPARISON_COLORS.alas,  desc: "底面を構成する頂点" },
    { key: "puncak", label: "頂点（頂上）", color: LIMAS_COMPARISON_COLORS.puncak, desc: "すべての側面が交わる1点" },
    { key: "all",    label: "全頂点",   color: "#a78bfa", desc: "頂点の総数 = n + 1" },
  ] : [
    { key: "alas",   label: "Titik Sudut Alas", color: LIMAS_COMPARISON_COLORS.alas,  desc: "titik-titik sudut yang membentuk alas" },
    { key: "puncak", label: "Titik Puncak",     color: LIMAS_COMPARISON_COLORS.puncak, desc: "satu titik tempat semua sisi tegak bertemu" },
    { key: "all",    label: "Semua Titik Sudut",color: "#a78bfa", desc: "total titik sudut limas = n + 1" },
  ];
  const caption = lang === "en" ? "n base vertices + 1 apex  ·  Vertices = n + 1"
    : lang === "ja" ? "底面n頂点 + 頂上1  ·  頂点数 = n + 1"
    : "n titik alas + 1 titik puncak  ·  T. Sudut Limas = n + 1";
  const names = lang === "en"
    ? [{ name:"Triangular Pyramid", rusukLabel:"2×3 = 6 edges", sisiLabel:"3+1 = 4 faces", titikLabel:"3+1 = 4 vertices" },
       { name:"Square Pyramid",     rusukLabel:"2×4 = 8 edges", sisiLabel:"4+1 = 5 faces", titikLabel:"4+1 = 5 vertices" },
       { name:"Pentagonal Pyramid", rusukLabel:"2×5 = 10 edges",sisiLabel:"5+1 = 6 faces", titikLabel:"5+1 = 6 vertices" }]
    : lang === "ja"
    ? [{ name:"三角錐", rusukLabel:"2×3 = 6 辺",  sisiLabel:"3+1 = 4 面",  titikLabel:"3+1 = 4 頂点" },
       { name:"四角錐", rusukLabel:"2×4 = 8 辺",  sisiLabel:"4+1 = 5 面",  titikLabel:"4+1 = 5 頂点" },
       { name:"五角錐", rusukLabel:"2×5 = 10 辺", sisiLabel:"5+1 = 6 面",  titikLabel:"5+1 = 6 頂点" }]
    : [{ name:"Limas Segitiga",  rusukLabel:"2×3 = 6 rusuk",  sisiLabel:"3+1 = 4 sisi",  titikLabel:"3+1 = 4 titik" },
       { name:"Limas Segiempat", rusukLabel:"2×4 = 8 rusuk",  sisiLabel:"4+1 = 5 sisi",  titikLabel:"4+1 = 5 titik" },
       { name:"Limas Segilima",  rusukLabel:"2×5 = 10 rusuk", sisiLabel:"5+1 = 6 sisi",  titikLabel:"5+1 = 6 titik" }];
  const ITEMS = [{ n:3, cx:57, ...names[0] }, { n:4, cx:170, ...names[1] }, { n:5, cx:283, ...names[2] }];
  const [phase, setPhase] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setPhase(p => (p + 1) % phases.length), 2200);
    return () => clearInterval(id);
  }, [auto, phases.length]);
  return (
    <LimasComparisonFrame phases={phases} phase={phase} setPhase={setPhase} auto={auto} setAuto={setAuto} caption={caption}>
      {ITEMS.map(item => <StandingLimasTitik key={item.n} {...item} phase={phase} />)}
    </LimasComparisonFrame>
  );
};

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE LIMAS 3D
───────────────────────────────────────────────────────────── */
const InteractiveLimas = () => {
  const { isDark } = useTheme();
  const { language: lang } = useLanguage();
  const [rotX, setRotX] = useState(-28);
  const [rotY, setRotY] = useState(38);
  const [isDragging, setIsDragging] = useState(false);
  const [showNet, setShowNet] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, baseRotX: -28, baseRotY: 38 });

  const dragHint = lang === "en" ? "Drag to rotate · Click button below to see net"
    : lang === "ja" ? "ドラッグで回転 · 下のボタンで展開図を表示"
    : "Drag untuk memutar · Tombol di bawah untuk melihat jaring-jaring limas";
  const btn3D  = lang === "en" ? "▶ 3D Pyramid" : lang === "ja" ? "▶ 3D 角錐" : "▶ Limas 3D";
  const btnNet = lang === "en" ? "⊞ Net" : lang === "ja" ? "⊞ 展開図" : "⊞ Jaring-Jaring";
  const baseLabel = lang === "en" ? "BASE" : lang === "ja" ? "底面" : "ALAS";
  const deltaTop   = lang === "en" ? "Δ top"   : lang === "ja" ? "Δ 上" : "Δ atas";
  const deltaBot   = lang === "en" ? "Δ bottom": lang === "ja" ? "Δ 下" : "Δ bawah";
  const deltaLeft  = lang === "en" ? "Δ left"  : lang === "ja" ? "Δ 左" : "Δ kiri";
  const deltaRight = lang === "en" ? "Δ right" : lang === "ja" ? "Δ 右" : "Δ kanan";

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseRotX: rotX, baseRotY: rotY };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setRotY(dragRef.current.baseRotY + (e.clientX - dragRef.current.startX) * 0.6);
    setRotX(dragRef.current.baseRotX - (e.clientY - dragRef.current.startY) * 0.6);
  }, [isDragging]);
  const onMouseUp = useCallback(() => setIsDragging(false), []);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    setIsDragging(true);
    dragRef.current = { startX: t.clientX, startY: t.clientY, baseRotX: rotX, baseRotY: rotY };
  };
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    const t = e.touches[0];
    setRotY(dragRef.current.baseRotY + (t.clientX - dragRef.current.startX) * 0.6);
    setRotX(dragRef.current.baseRotX - (t.clientY - dragRef.current.startY) * 0.6);
  }, [isDragging]);
  const onTouchEnd = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  return (
    <div className={isDark ? "bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-4" : "bg-white/90 border border-gray-200 rounded-xl p-4 space-y-4"}>
      <p className={isDark ? "text-white/60 text-xs text-center font-body" : "text-slate-600 text-xs text-center font-body"}>{dragHint}</p>
      <div className="relative mx-auto flex items-center justify-center select-none overflow-visible"
        style={{ width: "100%", height: 300, cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
        {showNet ? (
          <svg viewBox="0 0 260 260" width="220" height="220" style={{ display: "block", margin: "auto" }}>
            <rect x="80" y="130" width="80" height="80" fill="#3b82f6" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="2" rx="2"/>
            <text x="120" y="175" fill="var(--icon-color)" fontSize="9" fontFamily="monospace" textAnchor="middle">{baseLabel}</text>
            <polygon points="80,130 160,130 120,60" fill="#8b5cf6" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="2"/>
            <text x="120" y="108" fill="var(--icon-color)" fontSize="8" fontFamily="monospace" textAnchor="middle">{deltaTop}</text>
            <polygon points="80,210 160,210 120,275" fill="#22c55e" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="2"/>
            <text x="120" y="246" fill="var(--icon-color)" fontSize="8" fontFamily="monospace" textAnchor="middle">{deltaBot}</text>
            <polygon points="80,130 80,210 15,170" fill="#f97316" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="2"/>
            <text x="44" y="173" fill="var(--icon-color)" fontSize="8" fontFamily="monospace" textAnchor="middle">{deltaLeft}</text>
            <polygon points="160,130 160,210 225,170" fill="#eab308" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="2"/>
            <text x="196" y="173" fill="var(--icon-color)" fontSize="8" fontFamily="monospace" textAnchor="middle">{deltaRight}</text>
          </svg>
        ) : (
          <div style={{
            width: 90, height: 90, position: "relative",
            transformStyle: "preserve-3d",
            transform: `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transition: isDragging ? "none" : "transform 0.5s ease",
          }}>
            <div style={{ position:"absolute", width:90, height:90, background:"#3b82f6", opacity:0.7, border:"2px solid #3b82f6cc", borderRadius:4, transformStyle:"preserve-3d", transform:"rotateX(90deg) translateZ(-45px)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:"var(--icon-color)", fontSize:8, fontWeight:700, fontFamily:"monospace" }}>{baseLabel}</span>
            </div>
            <div style={{ position:"absolute", width:0, height:0, borderLeft:"45px solid transparent", borderRight:"45px solid transparent", borderBottom:"90px solid rgba(139,92,246,0.75)", top:-90, left:0, transform:"rotateX(-90deg) translateZ(45px)", transformOrigin:"bottom center", transformStyle:"preserve-3d" }}/>
            <div style={{ position:"absolute", width:0, height:0, borderLeft:"45px solid transparent", borderRight:"45px solid transparent", borderBottom:"90px solid rgba(34,197,94,0.65)", top:-90, left:0, transform:"rotateX(-90deg) rotateY(180deg) translateZ(45px)", transformOrigin:"bottom center", transformStyle:"preserve-3d" }}/>
            <div style={{ position:"absolute", width:0, height:0, borderLeft:"45px solid transparent", borderRight:"45px solid transparent", borderBottom:"90px solid rgba(249,115,22,0.7)", top:-90, left:0, transform:"rotateX(-90deg) rotateY(-90deg) translateZ(45px)", transformOrigin:"bottom center", transformStyle:"preserve-3d" }}/>
            <div style={{ position:"absolute", width:0, height:0, borderLeft:"45px solid transparent", borderRight:"45px solid transparent", borderBottom:"90px solid rgba(234,179,8,0.7)", top:-90, left:0, transform:"rotateX(-90deg) rotateY(90deg) translateZ(45px)", transformOrigin:"bottom center", transformStyle:"preserve-3d" }}/>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <button onClick={() => { playPopSound(); setShowNet(false); setRotX(-28); setRotY(38); }}
          className={`px-3 py-1.5 text-xs font-bold border rounded-lg transition-colors cursor-pointer font-body ${!showNet ? "bg-violet-700/80 border-violet-500 text-violet-100" : "bg-violet-900/40 border-violet-700 text-violet-300 hover:bg-violet-800/50"}`}>
          {btn3D}
        </button>
        <button onClick={() => { playPopSound(); setShowNet(true); }}
          className={`px-3 py-1.5 text-xs font-bold border rounded-lg transition-colors cursor-pointer font-body ${showNet ? "bg-orange-700/80 border-orange-500 text-orange-100" : "bg-orange-900/40 border-orange-700 text-orange-300 hover:bg-orange-800/50"}`}>
          {btnNet}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { label: baseLabel,  color: "#3b82f6" },
          { label: deltaTop,   color: "#8b5cf6" },
          { label: deltaBot,   color: "#22c55e" },
          { label: deltaLeft,  color: "#f97316" },
          { label: deltaRight, color: "#eab308" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
            <span className={isDark ? "text-white/50 text-[10px] font-body" : "text-slate-500 text-[10px] font-body"}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   ANIMATED SVGs — UNSUR LIMAS
───────────────────────────────────────────────────────────── */
const TitikSudutLimasSVG = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const count  = lang === "en" ? "5 vertices"  : lang === "ja" ? "5 頂点" : "5 titik sudut";
  const apex   = lang === "en" ? "T = apex"    : lang === "ja" ? "T = 頂上" : "T = puncak";
  return (
    <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2" aria-label="Pyramid vertices">
      <defs>
        <style>{`
          @keyframes tsGlow{0%,100%{r:6;opacity:1;}50%{r:10;opacity:0.4;}}
          .ts-a{animation:tsGlow 1.2s ease-in-out infinite;}
          .ts-b{animation:tsGlow 1.2s ease-in-out infinite 0.3s;}
          .ts-c{animation:tsGlow 1.2s ease-in-out infinite 0.6s;}
          .ts-d{animation:tsGlow 1.2s ease-in-out infinite 0.9s;}
          .ts-e{animation:tsGlow 1.2s ease-in-out infinite 1.1s;}
        `}</style>
      </defs>
      <polygon points="60,150 180,150 220,120 100,120" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="1.5"/>
      <line x1="60" y1="150" x2="140" y2="50" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="5,3"/>
      <line x1="180" y1="150" x2="140" y2="50" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="5,3"/>
      <line x1="100" y1="120" x2="140" y2="50" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="5,3"/>
      <line x1="220" y1="120" x2="140" y2="50" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="5,3"/>
      <circle cx="60" cy="150" r="6" fill="#f97316" className="ts-a"/>
      <circle cx="180" cy="150" r="6" fill="#f97316" className="ts-b"/>
      <circle cx="100" cy="120" r="6" fill="#f97316" className="ts-c"/>
      <circle cx="220" cy="120" r="6" fill="#f97316" className="ts-d"/>
      <circle cx="140" cy="50" r="7" fill="#eab308" className="ts-e"/>
      <text x="45" y="168" fill="#f97316" fontSize="9" fontFamily="monospace">A</text>
      <text x="183" y="168" fill="#f97316" fontSize="9" fontFamily="monospace">B</text>
      <text x="86" y="116" fill="#f97316" fontSize="9" fontFamily="monospace">D</text>
      <text x="224" y="116" fill="#f97316" fontSize="9" fontFamily="monospace">C</text>
      <text x="145" y="46" fill="#eab308" fontSize="9" fontFamily="monospace" fontWeight="bold">T</text>
      <text x="200" y="185" fill={isDark ? "#ffffff" : "#1e293b"} fontSize="9" fontFamily="monospace">{count}</text>
      <text x="200" y="197" fill="#eab308" fontSize="9" fontFamily="monospace">{apex}</text>
    </svg>
  );
};

const RusukLimasSVG = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const baseEdge  = lang === "en" ? "— Base edges (4)"   : lang === "ja" ? "— 底面の辺 (4)" : "— Rusuk alas (4)";
  const latEdge   = lang === "en" ? "— Lateral edges (4)": lang === "ja" ? "— 側面の辺 (4)" : "— Rusuk tegak (4)";
  const total     = lang === "en" ? "Total:"              : lang === "ja" ? "合計："         : "Total:";
  const totalVal  = lang === "en" ? "8 edges"             : lang === "ja" ? "8 辺"           : "8 rusuk";
  return (
    <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2" aria-label="Pyramid edges">
      <defs>
        <style>{`
          @keyframes raGlow{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 4px #22d3ee);}50%{stroke-opacity:0.2;filter:none;}}
          @keyframes rtGlow{0%,100%{stroke-opacity:1;filter:drop-shadow(0 0 4px #f97316);}50%{stroke-opacity:0.2;filter:none;}}
          .ra{animation:raGlow 1.4s ease-in-out infinite;}
          .rt{animation:rtGlow 1.4s ease-in-out infinite 0.5s;}
        `}</style>
      </defs>
      <line x1="60" y1="150" x2="180" y2="150" stroke="#22d3ee" strokeWidth="3.5" className="ra"/>
      <line x1="180" y1="150" x2="220" y2="120" stroke="#22d3ee" strokeWidth="3.5" className="ra"/>
      <line x1="220" y1="120" x2="100" y2="120" stroke="#22d3ee" strokeWidth="3.5" className="ra"/>
      <line x1="100" y1="120" x2="60" y2="150" stroke="#22d3ee" strokeWidth="3.5" className="ra"/>
      <line x1="60" y1="150" x2="140" y2="50" stroke="#f97316" strokeWidth="3" className="rt"/>
      <line x1="180" y1="150" x2="140" y2="50" stroke="#f97316" strokeWidth="3" className="rt"/>
      <line x1="100" y1="120" x2="140" y2="50" stroke="#f97316" strokeWidth="3" className="rt"/>
      <line x1="220" y1="120" x2="140" y2="50" stroke="#f97316" strokeWidth="3" className="rt"/>
      <polygon points="60,150 180,150 220,120 100,120" fill={isDark ? "rgba(30,41,59,0.6)" : "rgba(241,245,249,0.90)"} stroke="none"/>
      <circle cx="140" cy="50" r="5" fill="#eab308"/>
      <text x="5" y="185" fill="#22d3ee" fontSize="9" fontFamily="monospace">{baseEdge}</text>
      <text x="5" y="197" fill="#f97316" fontSize="9" fontFamily="monospace">{latEdge}</text>
      <text x="200" y="185" fill={isDark ? "#ffffff" : "#1e293b"} fontSize="9" fontFamily="monospace">{total}</text>
      <text x="200" y="197" fill="#22d3ee" fontSize="9" fontFamily="monospace">{totalVal}</text>
    </svg>
  );
};

const SisiLimasSVG = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const baseFace = lang === "en" ? "■ Base (quad)"    : lang === "ja" ? "■ 底面（四角形）" : "■ Alas segi-4";
  const latFaces = lang === "en" ? "▲ 4 lateral faces": lang === "ja" ? "▲ 4枚の側面"     : "▲ 4 bidang tegak";
  const total    = lang === "en" ? "Total:"            : lang === "ja" ? "合計："          : "Total:";
  const totalVal = lang === "en" ? "5 faces"           : lang === "ja" ? "5 面"            : "5 sisi";
  return (
    <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2" aria-label="Pyramid faces">
      <defs>
        <style>{`
          @keyframes sAnim{0%,100%{fill-opacity:0.75;}50%{fill-opacity:0.15;}}
          .sa{animation:sAnim 1.6s ease-in-out infinite;}
          .sb{animation:sAnim 1.6s ease-in-out infinite 0.4s;}
          .sc{animation:sAnim 1.6s ease-in-out infinite 0.8s;}
          .sd{animation:sAnim 1.6s ease-in-out infinite 1.2s;}
          .se{animation:sAnim 1.6s ease-in-out infinite 0.2s;}
        `}</style>
      </defs>
      <polygon points="60,150 180,150 220,120 100,120" fill="#3b82f6" className="sa"/>
      <polygon points="60,150 180,150 140,50" fill="#8b5cf6" className="sb"/>
      <polygon points="180,150 220,120 140,50" fill="#f97316" className="sc" fillOpacity="0.6"/>
      <polygon points="220,120 100,120 140,50" fill="#22c55e" className="sd" fillOpacity="0.5"/>
      <polygon points="100,120 60,150 140,50" fill="#eab308" className="se" fillOpacity="0.55"/>
      <text x="5" y="185" fill="#3b82f6" fontSize="9" fontFamily="monospace">{baseFace}</text>
      <text x="5" y="197" fill="#8b5cf6" fontSize="9" fontFamily="monospace">{latFaces}</text>
      <text x="190" y="185" fill={isDark ? "#ffffff" : "#1e293b"} fontSize="9" fontFamily="monospace">{total}</text>
      <text x="190" y="197" fill="#22d3ee" fontSize="9" fontFamily="monospace">{totalVal}</text>
    </svg>
  );
};

const ApotemaLimasSVG = ({ lang }: { lang: string }) => {
  const heightLbl  = lang === "en" ? "h (height)"   : lang === "ja" ? "h (高さ)"    : "t (tinggi)";
  const apotemaLbl = lang === "en" ? "l (apothem)"  : lang === "ja" ? "l (斜辺)"    : "l (apotema)";
  const centerLbl  = lang === "en" ? "O (center)"   : lang === "ja" ? "O (中心)"    : "O (pusat)";
  const heightDesc = lang === "en" ? "h = height of pyramid (⊥ base)" : lang === "ja" ? "h = 角錐の高さ（⊥底面）" : "t = tinggi limas (⊥ alas)";
  const apoDesc    = lang === "en" ? "l = apothem = √(h²+(s/2)²)"    : lang === "ja" ? "l = 斜高 = √(h²+(s/2)²)"  : "l = apotema = √(t²+(s/2)²)";
  return (
    <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2" aria-label="Pyramid apothem">
      <defs>
        <style>{`
          @keyframes apGlow{0%,100%{stroke-dashoffset:0;opacity:1;}100%{stroke-dashoffset:-20;opacity:0.5;}}
          .ap{animation:apGlow 1.5s linear infinite;}
        `}</style>
      </defs>
      <polygon points="60,155 200,155 200,115 60,115" fill="rgba(59,130,246,0.2)" stroke="#3b82f699" strokeWidth="1.5"/>
      <line x1="60" y1="155" x2="130" y2="55" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3"/>
      <line x1="200" y1="155" x2="130" y2="55" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3"/>
      <line x1="200" y1="115" x2="130" y2="55" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3"/>
      <line x1="60" y1="115" x2="130" y2="55" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3"/>
      <line x1="130" y1="135" x2="130" y2="55" stroke="#22d3ee" strokeWidth="2.5" strokeDasharray="6,3" className="ap"/>
      <text x="135" y="100" fill="#22d3ee" fontSize="9" fontFamily="monospace">{heightLbl}</text>
      <line x1="130" y1="155" x2="130" y2="55" stroke="#f97316" strokeWidth="2.5"/>
      <circle cx="130" cy="135" r="4" fill="#f97316"/>
      <text x="80" y="148" fill="#f97316" fontSize="9" fontFamily="monospace">{apotemaLbl}</text>
      <circle cx="130" cy="135" r="3" fill="#eab308"/>
      <text x="133" y="135" fill="#eab308" fontSize="8" fontFamily="monospace">{centerLbl}</text>
      <polyline points="130,155 139,155 139,145" fill="none" stroke="#22d3ee" strokeWidth="1.5"/>
      <text x="5" y="185" fill="#22d3ee" fontSize="9" fontFamily="monospace">{heightDesc}</text>
      <text x="5" y="197" fill="#f97316" fontSize="9" fontFamily="monospace">{apoDesc}</text>
    </svg>
  );
};

const PythagorasLimasSegitigaDetailSVG = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const T = { x: 130, y: 32 }, A = { x: 100, y: 175 }, B = { x: 62, y: 112 }, C = { x: 196, y: 112 }, O = { x: 119, y: 133 }, M = { x: 148, y: 143 };
  const raMark = (Vx: number, Vy: number, d1x: number, d1y: number, d2x: number, d2y: number, sz = 8) => {
    const p1x = Vx + sz * d1x, p1y = Vy + sz * d1y, cx = p1x + sz * d2x, cy = p1y + sz * d2y, p2x = Vx + sz * d2x, p2y = Vy + sz * d2y;
    return `M ${p1x.toFixed(1)} ${p1y.toFixed(1)} L ${cx.toFixed(1)} ${cy.toFixed(1)} L ${p2x.toFixed(1)} ${p2y.toFixed(1)}`;
  };
  const tLen = Math.hypot(T.x-O.x, T.y-O.y), tu = { x:(T.x-O.x)/tLen, y:(T.y-O.y)/tLen };
  const RLen = Math.hypot(C.x-O.x, C.y-O.y), Ru = { x:(C.x-O.x)/RLen, y:(C.y-O.y)/RLen };
  const rLen = Math.hypot(M.x-O.x, M.y-O.y), ru = { x:(M.x-O.x)/rLen, y:(M.y-O.y)/rLen };
  const basePts = `${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`;

  const fig1Title = lang === "en" ? "Fig 1 — Pyramid Height & Lateral Edge"  : lang === "ja" ? "図1 — 高さと側面の辺"  : "Gambar 1 — Tinggi limas & Rusuk Tegak";
  const fig2Title = lang === "en" ? "Fig 2 — Pyramid Height & Lateral Face Height" : lang === "ja" ? "図2 — 高さと側面の高さ" : "Gambar 2 — Tinggi limas & Tinggi Sisi Tegak";
  const tri1 = lang === "en" ? "Right triangle T–O–C" : lang === "ja" ? "直角三角形 T–O–C" : "Segitiga siku-siku T–O–C";
  const tri2 = lang === "en" ? "Right triangle T–O–E" : lang === "ja" ? "直角三角形 T–O–E" : "Segitiga siku-siku T–O–E";
  const to1  = lang === "en" ? "• TO = h — height of pyramid, perpendicular to base at O" : lang === "ja" ? "• TO = h — 高さ、底面に⊥" : "• TO = t — tinggi limas, tegak lurus bidang alas di titik O";
  const oc1  = lang === "en" ? "• OC — circumradius of base, from center O to vertex C"  : lang === "ja" ? "• OC — 外接円半径"   : "• OC — jari-jari luar alas, dari pusat O ke titik sudut C";
  const tc1  = lang === "en" ? "• TC — lateral edge from apex T to vertex C"             : lang === "ja" ? "• TC — 側面の辺 T→C" : "• TC — rusuk tegak dari puncak T ke titik sudut C";
  const to2  = lang === "en" ? "• TO = h — height of pyramid, perpendicular to base at O" : lang === "ja" ? "• TO = h — 高さ、底面に⊥" : "• TO = t — tinggi limas, tegak lurus bidang alas di titik O";
  const oe2  = lang === "en" ? "• OE — inradius of base, from center O to midpoint of edge" : lang === "ja" ? "• OE — 内接円半径" : "• OE — jari-jari dalam alas, dari pusat O ke titik tengah rusuk";
  const te2  = lang === "en" ? "• TE — apothem (lateral face height) from apex T to edge midpoint" : lang === "ja" ? "• TE — 斜高、T→辺中点" : "• TE — tinggi sisi tegak (apotema), dari puncak T ke titik tengah rusuk";
  const twoTriTitle = lang === "en" ? "Two Pythagorean relationships in a Triangular Pyramid"
    : lang === "ja" ? "三角錐における2つのピタゴラスの関係"
    : "Dua Pythagoras Limas Segitiga Beraturan";
  const centDesc = lang === "en" ? "Both right triangles are formed at the base center O where the height is perpendicular to the base plane."
    : lang === "ja" ? "2つの直角三角形は、高さが底面に垂直な中心Oで形成されます。"
    : "Kedua segitiga siku-siku terbentuk di pusat alas O tempat tinggi tegak lurus bidang alas.";

  return (
    <div className="space-y-3">
      <div>
        <p className="text-cyan-300 font-semibold text-xs">{twoTriTitle}</p>
        <p className={isDark ? "text-white/50 text-[11px]" : "text-slate-500 text-[11px]"}>{centDesc} <span className="text-sky-300 font-semibold">O</span></p>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className={isDark ? "bg-slate-900/70 border border-pink-700/40 rounded-xl p-3 space-y-2" : "bg-pink-50 border border-pink-300/60 rounded-xl p-3 space-y-2"}>
          <p className="text-pink-300 font-semibold text-[11px]">{fig1Title}</p>
          <svg viewBox="0 0 260 210" className="w-full max-w-sm mx-auto" aria-label="Pythagoras e in pyramid">
            <defs><filter id="triGlow1" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
            <polygon points={basePts} fill="#10b981" fillOpacity="0.14" stroke="#34d399" strokeWidth="1.5"/>
            <polygon points={`${T.x},${T.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="#22d3ee" fillOpacity="0.10" stroke="#67e8f9" strokeWidth="1"/>
            <polygon points={`${T.x},${T.y} ${A.x},${A.y} ${B.x},${B.y}`} fill="#8b5cf6" fillOpacity="0.10" stroke="#c4b5fd" strokeWidth="1"/>
            <polygon points={`${T.x},${T.y} ${A.x},${A.y} ${C.x},${C.y}`} fill="#f97316" fillOpacity="0.10" stroke="#fdba74" strokeWidth="1"/>
            <line x1={O.x} y1={O.y} x2={C.x} y2={C.y} stroke="#f472b6" strokeWidth="2.6" filter="url(#triGlow1)"/>
            <line x1={T.x} y1={T.y} x2={C.x} y2={C.y} stroke="#fb923c" strokeWidth="3" filter="url(#triGlow1)"/>
            <line x1={T.x} y1={T.y} x2={O.x} y2={O.y} stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="7,4"/>
            <line x1={T.x} y1={T.y} x2={A.x} y2={A.y} stroke={isDark ? "#e5e7eb" : "#94a3b8"} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.35"/>
            <line x1={T.x} y1={T.y} x2={B.x} y2={B.y} stroke={isDark ? "#e5e7eb" : "#94a3b8"} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.35"/>
            <path d={raMark(O.x,O.y,tu.x,tu.y,Ru.x,Ru.y,9)} stroke="var(--icon-stroke)" fill="none" strokeWidth="1.5"/>
            <circle cx={T.x} cy={T.y} r="4" fill="#facc15"/><circle cx={A.x} cy={A.y} r="3" fill={isDark ? "#e5e7eb" : "#64748b"}/><circle cx={B.x} cy={B.y} r="3" fill={isDark ? "#e5e7eb" : "#64748b"}/>
            <circle cx={C.x} cy={C.y} r="3.5" fill="#f472b6"/><circle cx={O.x} cy={O.y} r="3.5" fill="#38bdf8"/>
            <text x={T.x+4} y={T.y-2} fill="#facc15" fontSize="13" fontFamily="monospace" fontWeight="bold">T</text>
            <text x={A.x-18} y={A.y+6} fill={isDark ? "#e5e7eb" : "#1e293b"} fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
            <text x={B.x-16} y={B.y+4} fill={isDark ? "#e5e7eb" : "#1e293b"} fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
            <text x={C.x+4} y={C.y+4} fill="#f472b6" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
            <text x={O.x-17} y={O.y+4} fill="#38bdf8" fontSize="13" fontFamily="monospace" fontWeight="bold">O</text>
            <text x={T.x+5} y={(T.y+O.y)/2} fill="#38bdf8" fontSize="12" fontFamily="monospace">t</text>
          </svg>
          <div className={isDark ? "bg-pink-950/35 border border-pink-700/30 rounded-lg p-2 text-[11px] text-white/75 space-y-1" : "bg-pink-50 border border-pink-300/40 rounded-lg p-2 text-[11px] text-slate-700 space-y-1"}>
            <p className="font-semibold text-pink-300">{tri1}</p>
            <p>{to1}</p><p>{oc1}</p><p>{tc1}</p>
            <BlockMath math="TC^2 = TO^2 + OC^2"/>
            <BlockMath math="\boxed{TC^2 = t^2 + \left(\frac{a\sqrt{3}}{3}\right)^2}"/>
          </div>
        </div>
        <div className={isDark ? "bg-slate-900/70 border border-emerald-700/40 rounded-xl p-3 space-y-2" : "bg-emerald-50 border border-emerald-300/60 rounded-xl p-3 space-y-2"}>
          <p className="text-emerald-300 font-semibold text-[11px]">{fig2Title}</p>
          <svg viewBox="0 0 260 210" className="w-full max-w-sm mx-auto" aria-label="Pythagoras l in pyramid">
            <defs><filter id="triGlow2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
            <polygon points={basePts} fill="#10b981" fillOpacity="0.14" stroke="#34d399" strokeWidth="1.5"/>
            <polygon points={`${T.x},${T.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="#22d3ee" fillOpacity="0.10" stroke="#67e8f9" strokeWidth="1"/>
            <polygon points={`${T.x},${T.y} ${A.x},${A.y} ${B.x},${B.y}`} fill="#8b5cf6" fillOpacity="0.10" stroke="#c4b5fd" strokeWidth="1"/>
            <polygon points={`${T.x},${T.y} ${A.x},${A.y} ${C.x},${C.y}`} fill="#f97316" fillOpacity="0.22" stroke="#fdba74" strokeWidth="1.5"/>
            <line x1={O.x} y1={O.y} x2={M.x} y2={M.y} stroke="#facc15" strokeWidth="2.6" filter="url(#triGlow2)"/>
            <line x1={T.x} y1={T.y} x2={M.x} y2={M.y} stroke="#fb923c" strokeWidth="3" filter="url(#triGlow2)"/>
            <line x1={T.x} y1={T.y} x2={O.x} y2={O.y} stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="7,4"/>
            <line x1={T.x} y1={T.y} x2={A.x} y2={A.y} stroke={isDark ? "#e5e7eb" : "#94a3b8"} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.35"/>
            <line x1={T.x} y1={T.y} x2={B.x} y2={B.y} stroke={isDark ? "#e5e7eb" : "#94a3b8"} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.35"/>
            <line x1={T.x} y1={T.y} x2={C.x} y2={C.y} stroke={isDark ? "#e5e7eb" : "#94a3b8"} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.35"/>
            <path d={raMark(O.x,O.y,tu.x,tu.y,ru.x,ru.y,9)} stroke="var(--icon-stroke)" fill="none" strokeWidth="1.5"/>
            <circle cx={T.x} cy={T.y} r="4" fill="#facc15"/><circle cx={A.x} cy={A.y} r="3" fill={isDark ? "#e5e7eb" : "#64748b"}/><circle cx={B.x} cy={B.y} r="3" fill={isDark ? "#e5e7eb" : "#64748b"}/>
            <circle cx={C.x} cy={C.y} r="3" fill={isDark ? "#e5e7eb" : "#64748b"}/><circle cx={O.x} cy={O.y} r="3.5" fill="#38bdf8"/><circle cx={M.x} cy={M.y} r="3.5" fill="#facc15"/>
            <text x={T.x+4} y={T.y-2} fill="#facc15" fontSize="13" fontFamily="monospace" fontWeight="bold">T</text>
            <text x={A.x-18} y={A.y+6} fill={isDark ? "#e5e7eb" : "#1e293b"} fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
            <text x={B.x-16} y={B.y+4} fill={isDark ? "#e5e7eb" : "#1e293b"} fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
            <text x={C.x+4} y={C.y+4} fill={isDark ? "#e5e7eb" : "#1e293b"} fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
            <text x={O.x-17} y={O.y+4} fill="#38bdf8" fontSize="13" fontFamily="monospace" fontWeight="bold">O</text>
            <text x={M.x+4} y={M.y+4} fill="#facc15" fontSize="13" fontFamily="monospace" fontWeight="bold">E</text>
            <text x={T.x+5} y={(T.y+O.y)/2} fill="#38bdf8" fontSize="12" fontFamily="monospace">t</text>
          </svg>
          <div className={isDark ? "bg-emerald-950/35 border border-emerald-700/30 rounded-lg p-2 text-[11px] text-white/75 space-y-1" : "bg-emerald-50 border border-emerald-300/40 rounded-lg p-2 text-[11px] text-slate-700 space-y-1"}>
            <p className="font-semibold text-emerald-300">{tri2}</p>
            <p>{to2}</p><p>{oe2}</p><p>{te2}</p>
            <BlockMath math="TE^2 = TO^2 + OE^2"/>
            <BlockMath math="\boxed{TE^2 = t^2 + \left(\frac{a\sqrt{3}}{6}\right)^2}"/>
          </div>
        </div>
      </div>
    </div>
  );
};

const PythagorasLimasSegitigaOverview = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const title = lang === "en" ? "Regular Triangular Pyramid" : lang === "ja" ? "正三角錐" : "Limas Segitiga Beraturan";
  const desc  = lang === "en"
    ? "Equilateral triangle base with side a. Apothem l drops to midpoint M of edge AC."
    : lang === "ja"
    ? "一辺 a の正三角形の底面。斜高 l は辺 AC の中点 M に下ります。"
    : "Alas segitiga sama sisi dengan sisi a. Apotema l turun ke titik tengah M rusuk kanan AC.";
  const legendDesc = lang === "en"
    ? "t height, l apothem, r inradius of base, e lateral edge."
    : lang === "ja"
    ? "t 高さ、l 斜高、r 内接円半径、e 側面辺。"
    : "t tinggi limas, l apotema sisi tegak, r jari-jari dalam alas, e rusuk tegak.";
  return (
    <div className={isDark ? "bg-slate-900/70 border border-emerald-700/40 rounded-xl p-3 space-y-3" : "bg-emerald-50 border border-emerald-300/60 rounded-xl p-3 space-y-3"}>
      <div>
        <p className="text-emerald-300 font-semibold text-xs">{title}</p>
        <p className={isDark ? "text-white/45 text-[11px]" : "text-slate-500 text-[11px]"}>{desc}</p>
      </div>
      <svg viewBox="0 0 260 210" className="w-full max-w-sm mx-auto" aria-label="Pythagoras in triangular pyramid">
        <defs><filter id="triGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <polygon points="100,175 62,112 196,112" fill="#10b981" fillOpacity="0.22" stroke="#34d399" strokeWidth="2"/>
        <polygon points="130,32 62,112 196,112" fill="#22d3ee" fillOpacity="0.16" stroke="#67e8f9" strokeWidth="1.2"/>
        <polygon points="130,32 100,175 62,112" fill="#8b5cf6" fillOpacity="0.16" stroke="#c4b5fd" strokeWidth="1.3"/>
        <polygon points="130,32 100,175 196,112" fill="#f97316" fillOpacity="0.26" stroke="#fdba74" strokeWidth="1.6"/>
        <line x1="130" y1="32" x2="119" y2="133" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="7,4"/>
        <line x1="130" y1="32" x2="148" y2="143" stroke="#fb923c" strokeWidth="3" filter="url(#triGlow)"/>
        <line x1="119" y1="133" x2="148" y2="143" stroke="#facc15" strokeWidth="2.5"/>
        <line x1="119" y1="133" x2="196" y2="112" stroke="#f472b6" strokeWidth="1.8" strokeDasharray="5,3"/>
        <line x1="130" y1="32" x2="196" y2="112" stroke={isDark ? "#e5e7eb" : "#94a3b8"} strokeWidth="1.6" strokeDasharray="4,3"/>
        <line x1="130" y1="32" x2="62" y2="112" stroke={isDark ? "#e5e7eb" : "#94a3b8"} strokeWidth="1.1" strokeDasharray="4,3" strokeOpacity="0.45"/>
        <line x1="130" y1="32" x2="100" y2="175" stroke={isDark ? "#e5e7eb" : "#94a3b8"} strokeWidth="1.1" strokeDasharray="4,3" strokeOpacity="0.45"/>
        <circle cx="130" cy="32" r="4" fill="#facc15"/><circle cx="100" cy="175" r="3" fill={isDark ? "#e5e7eb" : "#64748b"}/>
        <circle cx="62" cy="112" r="3" fill={isDark ? "#e5e7eb" : "#64748b"}/><circle cx="196" cy="112" r="3" fill={isDark ? "#e5e7eb" : "#64748b"}/>
        <circle cx="119" cy="133" r="3.5" fill="#38bdf8"/><circle cx="148" cy="143" r="3.5" fill="#fb923c"/>
        <text x="134" y="30" fill="#facc15" fontSize="10" fontFamily="monospace">T</text>
        <text x="84" y="183" fill={isDark ? "#e5e7eb" : "#1e293b"} fontSize="9" fontFamily="monospace">A</text>
        <text x="45" y="112" fill={isDark ? "#e5e7eb" : "#1e293b"} fontSize="9" fontFamily="monospace">B</text>
        <text x="199" y="112" fill={isDark ? "#e5e7eb" : "#1e293b"} fontSize="9" fontFamily="monospace">C</text>
        <text x="104" y="136" fill="#38bdf8" fontSize="9" fontFamily="monospace">E</text>
        <text x="151" y="155" fill="#fb923c" fontSize="9" fontFamily="monospace">F</text>
        <text x="131" y="86" fill="#38bdf8" fontSize="10" fontFamily="monospace">t</text>
        <text x="144" y="82" fill="#fb923c" fontSize="10" fontFamily="monospace">l</text>
        <text x="128" y="145" fill="#facc15" fontSize="10" fontFamily="monospace">r</text>
        <text x="168" y="68" fill={isDark ? "#e5e7eb" : "#1e293b"} fontSize="10" fontFamily="monospace">e</text>
      </svg>
      <div className={isDark ? "bg-emerald-950/35 border border-emerald-700/30 rounded-lg p-2 space-y-1 text-[11px] text-white/75" : "bg-emerald-50 border border-emerald-300/40 rounded-lg p-2 space-y-1 text-[11px] text-slate-700"}>
        <p><span className="text-sky-300 font-semibold">t</span> {legendDesc.split("t")[1]?.split(",")[0] || ""}, <span className="text-orange-300 font-semibold">l</span>, <span className="text-yellow-300 font-semibold">r</span>, <span className={isDark ? "text-white/60 font-semibold" : "text-slate-500 font-semibold"}>e</span></p>
        <p className={isDark ? "text-white/60" : "text-slate-500"}>{legendDesc}</p>
        <BlockMath math="r_a=\frac{a\sqrt{3}}{6},\quad R_a=\frac{a\sqrt{3}}{3}"/>
        <BlockMath math="l^2=t^2+r_a^2=t^2+\left(\frac{a\sqrt{3}}{6}\right)^2"/>
        <BlockMath math="e^2=t^2+R_a^2=t^2+\left(\frac{a\sqrt{3}}{3}\right)^2"/>
        <BlockMath math="e^2=l^2+\left(\frac{a}{2}\right)^2"/>
      </div>
    </div>
  );
};

const PythagorasLimasSegiempatOverview = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const title = lang === "en" ? "Fig 3 — Pyramid Height & Lateral Face Height (square pyramid)"
    : lang === "ja" ? "図3 — 高さと側面の高さ（四角錐）"
    : "Gambar 3 — Tinggi limas & Tinggi Sisi Tegak pada limas segiempat";
  const desc  = lang === "en"
    ? "Square base with side s. Right face T–B–C highlighted: apothem l drops to midpoint M of the right edge."
    : lang === "ja"
    ? "一辺 s の正方形の底面。右の側面 T–B–C: 斜高 l が辺の中点 M に下ります。"
    : "Alas persegi dengan sisi s. Sisi tegak kanan T–B–C disorot: apotema l turun ke titik tengah M rusuk kanan.";
  return (
    <div className={isDark ? "bg-slate-900/70 border border-orange-700/40 rounded-xl p-3 space-y-3" : "bg-orange-50 border border-orange-300/60 rounded-xl p-3 space-y-3"}>
      <div>
        <p className="text-orange-300 font-semibold text-xs">{title}</p>
        <p className={isDark ? "text-white/45 text-[11px]" : "text-slate-500 text-[11px]"}>{desc} <InlineMath math="s"/> <InlineMath math="M"/></p>
      </div>
      <svg viewBox="0 0 260 210" className="w-full max-w-sm mx-auto" aria-label="Pythagoras in square pyramid">
        <defs><filter id="quadGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <polygon points="48,166 162,166 214,126 100,126" fill="#3b82f6" fillOpacity="0.22" stroke="#60a5fa" strokeWidth="2"/>
        <polygon points="48,166 162,166 132,42" fill="#8b5cf6" fillOpacity="0.10" stroke="#c4b5fd" strokeWidth="0.9" strokeOpacity="0.5"/>
        <polygon points="214,126 100,126 132,42" fill="#22c55e" fillOpacity="0.10" stroke="#86efac" strokeWidth="0.9" strokeOpacity="0.5"/>
        <polygon points="100,126 48,166 132,42" fill="#eab308" fillOpacity="0.10" stroke="#fde047" strokeWidth="0.9" strokeOpacity="0.5"/>
        <polygon points="162,166 214,126 132,42" fill="#f97316" fillOpacity="0.30" stroke="#fdba74" strokeWidth="1.8"/>
        <line x1="132" y1="42" x2="132" y2="146" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="7,4"/>
        <line x1="132" y1="42" x2="188" y2="146" stroke="#fb923c" strokeWidth="3" filter="url(#quadGlow)"/>
        <line x1="132" y1="146" x2="188" y2="146" stroke="#facc15" strokeWidth="2.5"/>
        <line x1="132" y1="42" x2="214" y2="126" stroke={isDark ? "#e5e7eb" : "#94a3b8"} strokeWidth="1.8" strokeDasharray="4,3"/>
        <line x1="48" y1="166" x2="214" y2="126" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="5,3"/>
        <path d="M 132 138 L 140 138 L 140 146" stroke="var(--icon-stroke)" fill="none" strokeWidth="1.5"/>
        <circle cx="132" cy="42" r="4" fill="#facc15"/><circle cx="48" cy="166" r="3" fill={isDark ? "#e5e7eb" : "#64748b"}/>
        <circle cx="162" cy="166" r="3" fill={isDark ? "#e5e7eb" : "#64748b"}/><circle cx="214" cy="126" r="3" fill={isDark ? "#e5e7eb" : "#64748b"}/>
        <circle cx="100" cy="126" r="3" fill={isDark ? "#e5e7eb" : "#64748b"}/><circle cx="132" cy="146" r="3.5" fill="#38bdf8"/>
        <circle cx="188" cy="146" r="3.5" fill="#fb923c"/>
        <text x="137" y="39" fill="#facc15" fontSize="13" fontFamily="monospace" fontWeight="bold">T</text>
        <text x="20" y="172" fill={isDark ? "#e5e7eb" : "#1e293b"} fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
        <text x="164" y="172" fill={isDark ? "#e5e7eb" : "#1e293b"} fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
        <text x="216" y="122" fill={isDark ? "#e5e7eb" : "#1e293b"} fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
        <text x="82" y="122" fill={isDark ? "#e5e7eb" : "#1e293b"} fontSize="13" fontFamily="monospace" fontWeight="bold">D</text>
        <text x="116" y="149" fill="#38bdf8" fontSize="13" fontFamily="monospace" fontWeight="bold">O</text>
        <text x="190" y="149" fill="#fb923c" fontSize="13" fontFamily="monospace" fontWeight="bold">M</text>
        <text x="126" y="90" fill="#38bdf8" fontSize="12" fontFamily="monospace">t</text>
        <text x="162" y="88" fill="#fb923c" fontSize="12" fontFamily="monospace">l</text>
        <text x="157" y="150" fill="#facc15" fontSize="10" fontFamily="monospace">s/2</text>
      </svg>
      <div className={isDark ? "bg-orange-950/35 border border-orange-700/30 rounded-lg p-2 space-y-1 text-[11px] text-white/75" : "bg-orange-50 border border-orange-300/40 rounded-lg p-2 space-y-1 text-[11px] text-slate-700"}>
        <BlockMath math="l^2 = t^2 + \left(\frac{s}{2}\right)^2"/>
        <BlockMath math="\boxed{l = \sqrt{t^2 + \frac{s^2}{4}}}"/>
      </div>
    </div>
  );
};

/* Diagonal SVG placeholder – geometry only, no localized text */
const PythagorasLimasSegiempatDiagonalSVG = () => {
  const { isDark } = useTheme();
  return (
  <div className={isDark ? "bg-slate-900/70 border border-violet-700/40 rounded-xl p-3 space-y-3" : "bg-violet-50 border border-violet-300/60 rounded-xl p-3 space-y-3"}>
    <svg viewBox="0 0 260 210" className="w-full max-w-sm mx-auto" aria-label="Square pyramid diagonal">
      <polygon points="48,166 162,166 214,126 100,126" fill="#3b82f6" fillOpacity="0.22" stroke="#60a5fa" strokeWidth="2"/>
      <polygon points="48,166 162,166 132,42" fill="#8b5cf6" fillOpacity="0.15" stroke="#c4b5fd" strokeWidth="1.2"/>
      <polygon points="162,166 214,126 132,42" fill="#f97316" fillOpacity="0.15" stroke="#fdba74" strokeWidth="1.2"/>
      <line x1="48" y1="166" x2="214" y2="126" stroke="#a78bfa" strokeWidth="2.5"/>
      <line x1="162" y1="166" x2="100" y2="126" stroke="#a78bfa" strokeWidth="2.5"/>
      <line x1="132" y1="42" x2="132" y2="146" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="7,4"/>
      <line x1="132" y1="42" x2="214" y2="126" stroke="#fb923c" strokeWidth="3"/>
      <circle cx="132" cy="42" r="4" fill="#facc15"/>
      <circle cx="132" cy="146" r="3.5" fill="#38bdf8"/>
      <text x="137" y="39" fill="#facc15" fontSize="13" fontFamily="monospace" fontWeight="bold">T</text>
      <text x="126" y="90" fill="#38bdf8" fontSize="12" fontFamily="monospace">t</text>
      <text x="174" y="88" fill="#fb923c" fontSize="12" fontFamily="monospace">e</text>
      <text x="120" y="160" fill="#a78bfa" fontSize="9" fontFamily="monospace">d/2</text>
    </svg>
    <div className={isDark ? "bg-violet-950/35 border border-violet-700/30 rounded-lg p-2 space-y-1 text-[11px] text-white/75" : "bg-violet-50 border border-violet-300/40 rounded-lg p-2 space-y-1 text-[11px] text-slate-700"}>
      <BlockMath math="e^2 = t^2 + \left(\frac{d}{2}\right)^2 = t^2 + \left(\frac{s\sqrt{2}}{2}\right)^2 = t^2 + \frac{s^2}{2}"/>
      <BlockMath math="\boxed{e = \sqrt{t^2 + \frac{s^2}{2}}}"/>
    </div>
  </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   LIMAS NET SVGs
───────────────────────────────────────────────────────────── */
const LimasNetSegitigaSVG = ({ baseLabel }: { baseLabel: string }) => {
  const { isDark } = useTheme();
  const colors = ["#ef4444","#22c55e","#f97316"];
  const n = 3;
  const R = 60, cx0 = 130, cy0 = 110;
  const baseVerts = Array.from({length:n},(_,i)=>{
    const a=(2*Math.PI*i/n)-Math.PI/2;
    return [cx0+R*Math.cos(a), cy0+R*Math.sin(a)] as [number,number];
  });
  const pointString = baseVerts.map(([x,y])=>`${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 260 220" className="w-full max-w-xs mx-auto my-2" aria-label="Triangular pyramid net">
      <defs>
        <style>{`
          @keyframes lnetFade{0%,100%{fill-opacity:0.75;}50%{fill-opacity:0.20;}}
          .lnet-f{animation:lnetFade 2s ease-in-out infinite;}
          .lnet-e{animation:lnetFade 2s ease-in-out infinite 0.7s;}
        `}</style>
      </defs>
      {baseVerts.map(([x1,y1],i)=>{
        const [x2,y2]=baseVerts[(i+1)%n];
        const mx=(x1+x2)/2, my=(y1+y2)/2;
        const dx=mx-cx0, dy=my-cy0;
        const len=Math.hypot(dx,dy);
        const tx=mx+(dx/len)*48, ty=my+(dy/len)*48;
        return (
          <g key={i}>
            <polygon points={`${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)}`} fill={colors[i]} stroke="var(--icon-stroke)" strokeWidth="1.5" className="lnet-f"/>
            <text x={tx} y={ty+3} fill="var(--icon-color)" fontSize="6.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">S{i+1}</text>
          </g>
        );
      })}
      <polygon points={pointString} fill="#3b82f6" stroke="var(--icon-stroke)" strokeWidth="1.6" className="lnet-e"/>
      <text x="130" y="124" fill="var(--icon-color)" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{baseLabel}</text>
      <text x="130" y="20" fill={isDark ? "#e0e7ff" : "#3730a3"} fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Lₚ = Lₐ + 3 × L△</text>
    </svg>
  );
};

const LimasNetSegiempatSVG = ({ baseLabel }: { baseLabel: string }) => {
  const { isDark } = useTheme();
  const colors = ["#8b5cf6","#22c55e","#f97316","#eab308"];
  return (
    <svg viewBox="0 0 260 260" className="w-full max-w-xs mx-auto my-2" aria-label="Square pyramid net">
      <defs>
        <style>{`
          @keyframes lnet4f{0%,100%{fill-opacity:0.75;}50%{fill-opacity:0.20;}}
          .lnet4-f{animation:lnet4f 2s ease-in-out infinite;}
          .lnet4-e{animation:lnet4f 2s ease-in-out infinite 0.7s;}
        `}</style>
      </defs>
      {[
        [[80,130],[160,130],[120,70]],
        [[80,210],[160,210],[120,265]],
        [[80,130],[80,210],[30,170]],
        [[160,130],[160,210],[210,170]],
      ].map(([[x1,y1],[x2,y2],[x3,y3]],i)=>(
        <g key={i}>
          <polygon points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`} fill={colors[i]} fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="1.5" className="lnet4-f"/>
          <text x={(x1+x2+x3)/3} y={(y1+y2+y3)/3+3} fill="var(--icon-color)" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Δ{i+1}</text>
        </g>
      ))}
      <rect x="80" y="130" width="80" height="80" fill="#3b82f6" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="1.5" rx="1" className="lnet4-e"/>
      <text x="120" y="175" fill="var(--icon-color)" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{baseLabel}</text>
      <text x="130" y="20" fill={isDark ? "#e0e7ff" : "#3730a3"} fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Lₚ = Lₐ + 4 × L△</text>
    </svg>
  );
};

const LimasNetSegilimaSVG = ({ baseLabel }: { baseLabel: string }) => {
  const { isDark } = useTheme();
  const colors = ["#ef4444","#22c55e","#f97316","#eab308","#ec4899"];
  const n=5, R=52, cx0=130, cy0=130;
  const baseVerts = Array.from({length:n},(_,i)=>{
    const a=(2*Math.PI*i/n)-Math.PI/2;
    return [cx0+R*Math.cos(a), cy0+R*Math.sin(a)] as [number,number];
  });
  const pointString = baseVerts.map(([x,y])=>`${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 260 240" className="w-full max-w-xs mx-auto my-2" aria-label="Pentagonal pyramid net">
      <defs>
        <style>{`
          @keyframes lnet5f{0%,100%{fill-opacity:0.75;}50%{fill-opacity:0.20;}}
          .lnet5-f{animation:lnet5f 2s ease-in-out infinite;}
          .lnet5-e{animation:lnet5f 2s ease-in-out infinite 0.7s;}
        `}</style>
      </defs>
      {baseVerts.map(([x1,y1],i)=>{
        const [x2,y2]=baseVerts[(i+1)%n];
        const mx=(x1+x2)/2, my=(y1+y2)/2;
        const dx=mx-cx0, dy=my-cy0;
        const len=Math.hypot(dx,dy);
        const tx=mx+(dx/len)*48, ty=my+(dy/len)*48;
        return (
          <g key={i}>
            <polygon points={`${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)}`} fill={colors[i]} stroke="var(--icon-stroke)" strokeWidth="1.5" className="lnet5-f"/>
            <text x={tx} y={ty+3} fill="var(--icon-color)" fontSize="6.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">S{i+1}</text>
          </g>
        );
      })}
      <polygon points={pointString} fill="#3b82f6" stroke="var(--icon-stroke)" strokeWidth="1.6" className="lnet5-e"/>
      <text x="130" y="124" fill="var(--icon-color)" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{baseLabel}</text>
      <text x="130" y="20" fill={isDark ? "#e0e7ff" : "#3730a3"} fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Lₚ = Lₐ + 5 × L△</text>
    </svg>
  );
};

const LimasSurfaceNetSelector = () => {
  const { isDark } = useTheme();
  const { language: lang } = useLanguage();
  const [tab, setTab] = useState<"segitiga"|"segiempat"|"segilima">("segitiga");
  const baseLabel = lang === "en" ? "BASE" : lang === "ja" ? "底面" : "ALAS";
  const tabs = lang === "en"
    ? [{ id:"segitiga" as const, label:"Triangle" }, { id:"segiempat" as const, label:"Square" }, { id:"segilima" as const, label:"Pentagon" }]
    : lang === "ja"
    ? [{ id:"segitiga" as const, label:"三角形" }, { id:"segiempat" as const, label:"四角形" }, { id:"segilima" as const, label:"五角形" }]
    : [{ id:"segitiga" as const, label:"Segitiga" }, { id:"segiempat" as const, label:"Segiempat" }, { id:"segilima" as const, label:"Segilima" }];

  const fmtTri = lang === "en"
    ? { title:"Formula — Triangular Pyramid:", base:"• Base area:", baseVal:"Lₐ = triangle area", side:"• Lateral faces:", sideVal:"3 triangular faces", formula:"Lp = La + 3 × (½ × a × l)" }
    : lang === "ja"
    ? { title:"公式 — 三角錐:", base:"• 底面積:", baseVal:"Lₐ = 三角形の面積", side:"• 側面:", sideVal:"三角形3枚", formula:"Lp = La + 3 × (½ × a × l)" }
    : { title:"Rumus — Limas Segitiga:", base:"• Luas alas:", baseVal:"Lₐ = luas segitiga alas", side:"• Sisi tegak:", sideVal:"3 segitiga tegak", formula:"Lp = La + 3 × (½ × a × l)" };
  const fmtQuad = lang === "en"
    ? { title:"Formula — Square Pyramid:", base:"• Base area:", baseVal:"Lₐ = s²", side:"• Lateral faces:", sideVal:"4 triangular faces", formula:"Lp = La + 4 × (½ × s × l)" }
    : lang === "ja"
    ? { title:"公式 — 四角錐:", base:"• 底面積:", baseVal:"Lₐ = s²", side:"• 側面:", sideVal:"三角形4枚", formula:"Lp = La + 4 × (½ × s × l)" }
    : { title:"Rumus — Limas Segiempat:", base:"• Luas alas:", baseVal:"Lₐ = s²", side:"• Sisi tegak:", sideVal:"4 segitiga tegak", formula:"Lp = La + 4 × (½ × s × l)" };
  const fmtPent = lang === "en"
    ? { title:"Formula — Pentagonal Pyramid:", base:"• Base area:", baseVal:"Lₐ = pentagon area", side:"• Lateral faces:", sideVal:"5 triangular faces", formula:"Lp = La + 5 × (½ × a × l)" }
    : lang === "ja"
    ? { title:"公式 — 五角錐:", base:"• 底面積:", baseVal:"Lₐ = 五角形の面積", side:"• 側面:", sideVal:"三角形5枚", formula:"Lp = La + 5 × (½ × a × l)" }
    : { title:"Rumus — Limas Segilima:", base:"• Luas alas:", baseVal:"Lₐ = luas segilima alas", side:"• Sisi tegak:", sideVal:"5 segitiga tegak", formula:"Lp = La + 5 × (½ × a × l)" };

  return (
    <div className="space-y-3">
      <div className={isDark ? "flex rounded-lg overflow-hidden border border-slate-600 w-full" : "flex rounded-lg overflow-hidden border border-gray-300 w-full"}>
        {tabs.map(t => (
          <button key={t.id}
            onClick={() => { playPopSound(); setTab(t.id); }}
            className={`flex-1 py-1.5 text-xs font-bold font-body transition-colors cursor-pointer
              ${tab === t.id ? "bg-cyan-800/80 text-cyan-200 border-b-2 border-cyan-400" : isDark ? "bg-slate-800/60 text-white/50 hover:text-white/80 hover:bg-slate-700/60" : "bg-gray-100 text-slate-500 hover:text-slate-700 hover:bg-gray-200"}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "segitiga" && (
        <div>
          <LimasNetSegitigaSVG baseLabel={baseLabel}/>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-2 text-xs text-white/70" : "bg-gray-100 border border-gray-200 rounded-lg p-3 space-y-2 text-xs text-slate-700"}>
            <p className="text-cyan-300 font-semibold">{fmtTri.title}</p>
            <p>{fmtTri.base} <span className="text-yellow-300">{fmtTri.baseVal}</span></p>
            <p>{fmtTri.side} <span className="text-yellow-300">{fmtTri.sideVal}</span></p>
            <p className={isDark ? "text-white/90 font-semibold font-mono" : "text-slate-800 font-semibold font-mono"}>{fmtTri.formula}</p>
          </div>
        </div>
      )}
      {tab === "segiempat" && (
        <div>
          <LimasNetSegiempatSVG baseLabel={baseLabel}/>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-2 text-xs text-white/70" : "bg-gray-100 border border-gray-200 rounded-lg p-3 space-y-2 text-xs text-slate-700"}>
            <p className="text-cyan-300 font-semibold">{fmtQuad.title}</p>
            <p>{fmtQuad.base} <span className="text-yellow-300">{fmtQuad.baseVal}</span></p>
            <p>{fmtQuad.side} <span className="text-yellow-300">{fmtQuad.sideVal}</span></p>
            <p className={isDark ? "text-white/90 font-semibold font-mono" : "text-slate-800 font-semibold font-mono"}>{fmtQuad.formula}</p>
          </div>
        </div>
      )}
      {tab === "segilima" && (
        <div>
          <LimasNetSegilimaSVG baseLabel={baseLabel}/>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 space-y-2 text-xs text-white/70" : "bg-gray-100 border border-gray-200 rounded-lg p-3 space-y-2 text-xs text-slate-700"}>
            <p className="text-cyan-300 font-semibold">{fmtPent.title}</p>
            <p>{fmtPent.base} <span className="text-yellow-300">{fmtPent.baseVal}</span></p>
            <p>{fmtPent.side} <span className="text-yellow-300">{fmtPent.sideVal}</span></p>
            <p className={isDark ? "text-white/90 font-semibold font-mono" : "text-slate-800 font-semibold font-mono"}>{fmtPent.formula}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const LimasSurfaceAreaSection = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const intro = lang === "en"
    ? <><strong className="text-blue-300">Surface area of a pyramid</strong> is the sum of all face areas: one base plus all triangular lateral faces.</>
    : lang === "ja"
    ? <><strong className="text-blue-300">角錐の表面積</strong>は底面と側面（三角形）の面積の合計です。</>
    : <><strong className="text-blue-300">Luas permukaan limas</strong> adalah jumlah luas bidang yang membungkus limas: satu sisi alas ditambah semua sisi tegak berbentuk segitiga.</>;
  const laNote = lang === "en"
    ? <><InlineMath math="L_a"/> is base area and <InlineMath math="l"/> is the apothem found via Pythagorean theorem.</>
    : lang === "ja"
    ? <><InlineMath math="L_a"/>は底面積、<InlineMath math="l"/>はピタゴラスの定理で求める斜高。</>
    : <><InlineMath math="L_a"/> adalah luas alas, sedangkan <InlineMath math="l"/> adalah apotema sisi tegak yang dapat dicari dengan Teorema Pythagoras.</>;
  const tabHint = lang === "en" ? "Select pyramid type to see its net and surface area formula:"
    : lang === "ja" ? "種類を選んで展開図と公式を確認："
    : "Pilih jenis limas untuk melihat jaring-jaring dan rumus luas permukaannya:";
  const keyTitle = lang === "en" ? "Key:" : lang === "ja" ? "ポイント:" : "Kunci:";
  const k1 = lang === "en" ? "• Triangular pyramid: Lp = La + 3 × L△" : lang === "ja" ? "• 三角錐: Lp = La + 3 × L△" : "• Limas segitiga: Lp = La + 3 × L△tegak";
  const k2 = lang === "en" ? "• Square pyramid: Lp = La + 4 × L△"    : lang === "ja" ? "• 四角錐: Lp = La + 4 × L△" : "• Limas segiempat: Lp = La + 4 × L△tegak";
  const k3 = lang === "en" ? "• Pentagonal pyramid: Lp = La + 5 × L△" : lang === "ja" ? "• 五角錐: Lp = La + 5 × L△" : "• Limas segilima: Lp = La + 5 × L△tegak";
  return (
    <div className={isDark ? "space-y-3 text-sm text-white/85 font-body" : "space-y-3 text-sm text-slate-800 font-body"}>
      <p>{intro}</p>
      <div className={isDark ? "bg-slate-800/60 border border-slate-600/40 rounded-lg p-4 space-y-2" : "bg-gray-100 border border-gray-200 rounded-lg p-4 space-y-2"}>
        <div className={isDark ? "bg-slate-900/60 rounded p-3 space-y-2" : "bg-white/90 rounded p-3 space-y-2"}>
          <BlockMath math="L_p = L_a + \sum L_s"/>
          <BlockMath math="L_s = \frac{1}{2} \times a \times l"/>
        </div>
        <p className={isDark ? "text-xs text-white/55" : "text-xs text-slate-500"}>{laNote}</p>
      </div>
      <p className={isDark ? "text-xs text-white/60 text-center" : "text-xs text-slate-500 text-center"}>{tabHint}</p>
      <LimasSurfaceNetSelector/>
      <div className={isDark ? "bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1" : "bg-cyan-50 border border-cyan-300/60 rounded-lg p-3 text-xs text-cyan-800 space-y-1"}>
        <p><strong>{keyTitle}</strong> <span className="text-yellow-300">Lp = La + {lang === "en" ? "lateral faces" : lang === "ja" ? "側面" : "sisi tegak"}</span></p>
        <p>{k1}</p><p>{k2}</p><p>{k3}</p>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   NET GALLERY
───────────────────────────────────────────────────────────── */
const NetLimasGallery = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const baseLabel = lang === "en" ? "BASE" : lang === "ja" ? "底面" : "ALAS";
  const nets = lang === "en"
    ? [
        { label:"Square Pyramid (standard)", desc:"Base + 4 triangles, apex up" },
        { label:"Triangular Pyramid",         desc:"Triangle base + 3 triangles" },
        { label:"Square Pyramid (fan)",        desc:"Triangles surrounding base" },
      ]
    : lang === "ja"
    ? [
        { label:"四角錐（標準）",   desc:"底面 + 4枚の三角形、頂点上" },
        { label:"三角錐",           desc:"三角形の底面 + 3枚の三角形" },
        { label:"四角錐（扇型）",   desc:"底面を囲む三角形" },
      ]
    : [
        { label:"Limas Segiempat (standar)", desc:"Alas + 4 segitiga, puncak ke atas" },
        { label:"Limas Segitiga",             desc:"Alas segitiga + 3 segitiga" },
        { label:"Limas Segiempat (kipas)",    desc:"Segitiga mengelilingi alas" },
      ];
  const svgs = [
    (<svg viewBox="0 0 120 120" width="90" height="90" key="s1">
      <rect x="35" y="55" width="50" height="50" fill="#3b82f6" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="1.5" rx="1"/>
      <text x="60" y="85" fill="var(--icon-color)" fontSize="7" textAnchor="middle" fontFamily="monospace">{baseLabel}</text>
      <polygon points="35,55 85,55 60,15" fill="#8b5cf6" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="1.5"/>
      <polygon points="35,105 85,105 60,118" fill="#22c55e" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="1.5"/>
      <polygon points="35,55 35,105 5,80" fill="#f97316" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="1.5"/>
      <polygon points="85,55 85,105 115,80" fill="#eab308" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="1.5"/>
    </svg>),
    (<svg viewBox="0 0 120 120" width="90" height="90" key="s2">
      <polygon points="60,45 95,95 25,95" fill="#3b82f6" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="1.5"/>
      <text x="60" y="78" fill="var(--icon-color)" fontSize="7" textAnchor="middle" fontFamily="monospace">{baseLabel}</text>
      <polygon points="60,45 25,95 5,50" fill="#8b5cf6" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="1.5"/>
      <polygon points="60,45 95,95 115,50" fill="#f97316" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="1.5"/>
      <polygon points="60,45 5,50 60,15" fill="#22c55e" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="1.5"/>
    </svg>),
    (<svg viewBox="0 0 130 130" width="90" height="90" key="s3">
      <rect x="40" y="40" width="50" height="50" fill="#3b82f6" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="1.5" rx="1"/>
      <text x="65" y="70" fill="var(--icon-color)" fontSize="7" textAnchor="middle" fontFamily="monospace">{baseLabel}</text>
      <polygon points="40,40 90,40 65,10" fill="#8b5cf6" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="1.5"/>
      <polygon points="40,90 90,90 65,118" fill="#22c55e" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="1.5"/>
      <polygon points="40,40 40,90 10,65" fill="#f97316" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="1.5"/>
      <polygon points="90,40 90,90 120,65" fill="#eab308" fillOpacity="0.85" stroke="var(--icon-stroke)" strokeWidth="1.5"/>
    </svg>),
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {nets.map((n, i) => (
        <div key={i} className={isDark ? "bg-slate-800/60 border border-slate-700 rounded-lg p-3 flex flex-col items-center gap-2" : "bg-gray-100 border border-gray-200 rounded-lg p-3 flex flex-col items-center gap-2"}>
          <span className={isDark ? "text-white/50 text-[9px] font-body font-bold text-center" : "text-slate-500 text-[9px] font-body font-bold text-center"}>{n.label}</span>
          <div className="flex items-center justify-center" style={{ minHeight: 80 }}>{svgs[i]}</div>
          <span className={isDark ? "text-white/30 text-[8px] font-body text-center" : "text-slate-400 text-[8px] font-body text-center"}>{n.desc}</span>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   WATER LIMAS ANIMATION
───────────────────────────────────────────────────────────── */
type V2L = [number, number];
type LimasWaterType = "segitiga" | "segiempat" | "segilima";

const WaterLimasAnimation = ({ lang }: { lang: string }) => {
  const { isDark } = useTheme();
  const [fill, setFill] = useState(0);
  const [limasType, setLimasType] = useState<LimasWaterType>("segiempat");

  useEffect(() => {
    const FILL_MS = 3200, HOLD_FULL = 900, EMPTY_MS = 2000, HOLD_EMPTY = 500;
    const TOTAL = FILL_MS + HOLD_FULL + EMPTY_MS + HOLD_EMPTY;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = (now - start) % TOTAL;
      let f: number;
      if (t < FILL_MS)                              f = t / FILL_MS;
      else if (t < FILL_MS + HOLD_FULL)             f = 1;
      else if (t < FILL_MS + HOLD_FULL + EMPTY_MS)  f = 1 - (t - FILL_MS - HOLD_FULL) / EMPTY_MS;
      else                                           f = 0;
      setFill(f);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const lerp2 = (a: V2L, b: V2L, t: number): V2L => [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t];
  const pt  = (v: V2L) => `${v[0].toFixed(1)},${v[1].toFixed(1)}`;
  const pts = (...vs: V2L[]) => vs.map(pt).join(" ");

  const pct = Math.round(fill * 100);
  const isEmpty = fill < 0.005, isFull = fill > 0.995;
  const statusColor = isFull ? "#4ade80" : isEmpty ? "#64748b" : "#7dd3fc";
  const fullTxt  = lang === "en" ? "🌊 Full!"   : lang === "ja" ? "🌊 満杯！"  : "🌊 Penuh!";
  const emptyTxt = lang === "en" ? "⬛ Empty"   : lang === "ja" ? "⬛ 空"      : "⬛ Kosong";
  const fillTxt  = lang === "en" ? `🔵 Filling... ${pct}%` : lang === "ja" ? `🔵 充填中... ${pct}%` : `🔵 Mengisi... ${pct}%`;
  const statusText = isFull ? fullTxt : isEmpty ? emptyTxt : fillTxt;

  const baseLblS2   = lang === "en" ? "BASE (s²)"       : lang === "ja" ? "底面 (s²)"    : "ALAS (s²)";
  const baseLblHalf = lang === "en" ? "BASE (½at₀)"     : lang === "ja" ? "底面 (½at₀)"  : "ALAS (½at₀)";
  const baseLbl5    = lang === "en" ? "BASE (pent.)"     : lang === "ja" ? "底面 (五角形)" : "ALAS (segi-5)";

  const tabLabels = lang === "en"
    ? [{ key:"segitiga" as const, label:"△ Triangle" }, { key:"segiempat" as const, label:"□ Square" }, { key:"segilima" as const, label:"⬠ Pentagon" }]
    : lang === "ja"
    ? [{ key:"segitiga" as const, label:"△ 三角形" }, { key:"segiempat" as const, label:"□ 四角形" }, { key:"segilima" as const, label:"⬠ 五角形" }]
    : [{ key:"segitiga" as const, label:"△ Segitiga" }, { key:"segiempat" as const, label:"□ Segiempat" }, { key:"segilima" as const, label:"⬠ Segilima" }];

  const BarWidget = ({ barX, barY, barH }: { barX: number; barY: number; barH: number }) => {
    const barW = 12, filledH = barH * fill;
    return (
      <>
        <rect x={barX} y={barY} width={barW} height={barH} fill={isDark ? "#0f172a" : "#f1f5f9"} stroke={isDark ? "#334155" : "#94a3b8"} strokeWidth="1.2" rx="3"/>
        {!isEmpty && <rect x={barX} y={barY+barH-filledH} width={barW} height={filledH} fill="#2563eb" fillOpacity={0.88} rx="3"/>}
        <text x={barX+barW/2} y={barY-5} fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">V%</text>
        <text x={barX+barW/2} y={barY+barH+12} fill={statusColor} fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{pct}%</text>
      </>
    );
  };

  const renderSegiempat = () => {
    const FL: V2L=[50,184],FR: V2L=[164,184],dx=28,dy=-18,BkL: V2L=[FL[0]+dx,FL[1]+dy],BkR: V2L=[FR[0]+dx,FR[1]+dy],apex: V2L=[121,70];
    const WFL=lerp2(FL,apex,fill),WFR=lerp2(FR,apex,fill),WBkR=lerp2(BkR,apex,fill),WBkL=lerp2(BkL,apex,fill);
    return (
      <>
        <line x1={BkL[0]} y1={BkL[1]} x2={apex[0]} y2={apex[1]} stroke={isDark ? "#334155" : "#94a3b8"} strokeWidth="1.1" strokeDasharray="4,3"/>
        <line x1={FL[0]} y1={FL[1]} x2={BkL[0]} y2={BkL[1]} stroke={isDark ? "#334155" : "#94a3b8"} strokeWidth="1.1" strokeDasharray="4,3"/>
        <polygon points={pts(FR,BkR,apex)} fill={isDark ? "#0f172a" : "#e2e8f0"} fillOpacity={0.15} stroke={isDark ? "#334155" : "#94a3b8"} strokeWidth="0.8"/>
        <polygon points={pts(FL,FR,apex)} fill={isDark ? "#0f172a" : "#e2e8f0"} fillOpacity={0.10} stroke={isDark ? "#334155" : "#94a3b8"} strokeWidth="0.8"/>
        {!isEmpty && <>
          <polygon points={pts(FL,FR,BkR,BkL)} fill="#1e3a8a" fillOpacity={0.90}/>
          <polygon points={pts(FR,BkR,WBkR,WFR)} fill="#1d4ed8" fillOpacity={0.80}/>
          <polygon points={pts(FL,FR,WFR,WFL)} fill="#2563eb" fillOpacity={0.90}/>
          {!isFull && <polygon points={pts(WFL,WFR,WBkR,WBkL)} fill="#7dd3fc" fillOpacity={0.50} style={{ filter:"drop-shadow(0 0 5px #38bdf8)" }}/>}
          {!isFull && <line x1={WFL[0]} y1={WFL[1]} x2={WFR[0]} y2={WFR[1]} stroke="#bae6fd" strokeWidth={2} strokeDasharray="6,3" strokeOpacity={0.85}/>}
        </>}
        <line x1={FL[0]} y1={FL[1]} x2={FR[0]} y2={FR[1]} stroke="#93c5fd" strokeWidth="2"/>
        <line x1={FR[0]} y1={FR[1]} x2={BkR[0]} y2={BkR[1]} stroke="#a5b4fc" strokeWidth="1.8"/>
        <line x1={FL[0]} y1={FL[1]} x2={apex[0]} y2={apex[1]} stroke="#93c5fd" strokeWidth="1.8"/>
        <line x1={FR[0]} y1={FR[1]} x2={apex[0]} y2={apex[1]} stroke="#93c5fd" strokeWidth="1.8"/>
        <line x1={BkR[0]} y1={BkR[1]} x2={apex[0]} y2={apex[1]} stroke="#a5b4fc" strokeWidth="1.6"/>
        <text x={(FL[0]+FR[0])/2} y={FL[1]+13} fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">s</text>
        <text x={(FL[0]+FR[0])/2} y={FL[1]+24} fill="#4ade80" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{baseLblS2}</text>
        <text x={apex[0]} y={apex[1]-8} fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">T</text>
        <BarWidget barX={205} barY={70} barH={114}/>
        <text x="120" y="200" fill={statusColor} fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" filter="url(#wBloomLimas)">{statusText}</text>
        <text x="120" y="214" fill={isDark ? "#e0e7ff" : "#3730a3"} fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle" filter="url(#wBloomLimas)">V = ⅓ × s² × t</text>
      </>
    );
  };

  const renderSegitiga = () => {
    const FV: V2L=[112,184],BkL: V2L=[58,156],BkR: V2L=[170,156],apex: V2L=[112,70];
    const WFV=lerp2(FV,apex,fill),WBkL=lerp2(BkL,apex,fill),WBkR=lerp2(BkR,apex,fill);
    return (
      <>
        <line x1={BkL[0]} y1={BkL[1]} x2={FV[0]} y2={FV[1]} stroke={isDark ? "#334155" : "#94a3b8"} strokeWidth="1.1" strokeDasharray="4,3"/>
        <line x1={BkL[0]} y1={BkL[1]} x2={apex[0]} y2={apex[1]} stroke={isDark ? "#334155" : "#94a3b8"} strokeWidth="1.1" strokeDasharray="4,3"/>
        <polygon points={pts(FV,BkR,apex)} fill={isDark ? "#0f172a" : "#e2e8f0"} fillOpacity={0.15} stroke={isDark ? "#334155" : "#94a3b8"} strokeWidth="0.8"/>
        {!isEmpty && <>
          <polygon points={pts(FV,BkL,BkR)} fill="#1e3a8a" fillOpacity={0.90}/>
          <polygon points={pts(FV,BkR,WBkR,WFV)} fill="#1d4ed8" fillOpacity={0.80}/>
          <polygon points={pts(FV,BkL,WBkL,WFV)} fill="#2563eb" fillOpacity={0.70}/>
          {!isFull && <polygon points={pts(WFV,WBkL,WBkR)} fill="#7dd3fc" fillOpacity={0.50} style={{ filter:"drop-shadow(0 0 5px #38bdf8)" }}/>}
          {!isFull && <>
            <line x1={WFV[0]} y1={WFV[1]} x2={WBkR[0]} y2={WBkR[1]} stroke="#bae6fd" strokeWidth={2} strokeDasharray="6,3" strokeOpacity={0.85}/>
            <line x1={WFV[0]} y1={WFV[1]} x2={WBkL[0]} y2={WBkL[1]} stroke="#bae6fd" strokeWidth={2} strokeDasharray="6,3" strokeOpacity={0.85}/>
          </>}
        </>}
        <line x1={FV[0]} y1={FV[1]} x2={BkR[0]} y2={BkR[1]} stroke="#93c5fd" strokeWidth="2"/>
        <line x1={BkR[0]} y1={BkR[1]} x2={BkL[0]} y2={BkL[1]} stroke="#93c5fd" strokeWidth="1.8"/>
        <line x1={FV[0]} y1={FV[1]} x2={apex[0]} y2={apex[1]} stroke="#93c5fd" strokeWidth="1.8"/>
        <line x1={BkR[0]} y1={BkR[1]} x2={apex[0]} y2={apex[1]} stroke="#93c5fd" strokeWidth="1.8"/>
        <line x1={BkL[0]} y1={BkL[1]} x2={apex[0]} y2={apex[1]} stroke="#a5b4fc" strokeWidth="1.4" strokeDasharray="4,3"/>
        <text x={(BkL[0]+BkR[0])/2} y={BkL[1]+18} fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">a</text>
        <text x={(BkL[0]+BkR[0])/2} y={BkL[1]+29} fill="#4ade80" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{baseLblHalf}</text>
        <text x={apex[0]} y={apex[1]-8} fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">T</text>
        <BarWidget barX={205} barY={70} barH={114}/>
        <text x="112" y="200" fill={statusColor} fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" filter="url(#wBloomLimas)">{statusText}</text>
        <text x="112" y="214" fill={isDark ? "#e0e7ff" : "#3730a3"} fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" filter="url(#wBloomLimas)">V = ⅙ × a × t₀ × t</text>
      </>
    );
  };

  const renderSegilima = () => {
    const P1: V2L=[112,186],P2: V2L=[163,171],P3: V2L=[148,150],P4: V2L=[76,150],P5: V2L=[61,171],apex: V2L=[112,68];
    const WP1=lerp2(P1,apex,fill),WP2=lerp2(P2,apex,fill),WP3=lerp2(P3,apex,fill),WP4=lerp2(P4,apex,fill),WP5=lerp2(P5,apex,fill);
    return (
      <>
        <line x1={P4[0]} y1={P4[1]} x2={P3[0]} y2={P3[1]} stroke={isDark ? "#334155" : "#94a3b8"} strokeWidth="1.1" strokeDasharray="4,3"/>
        <line x1={P4[0]} y1={P4[1]} x2={P5[0]} y2={P5[1]} stroke={isDark ? "#334155" : "#94a3b8"} strokeWidth="1.1" strokeDasharray="4,3"/>
        <line x1={P4[0]} y1={P4[1]} x2={apex[0]} y2={apex[1]} stroke={isDark ? "#334155" : "#94a3b8"} strokeWidth="1.1" strokeDasharray="4,3"/>
        <polygon points={pts(P1,P2,apex)} fill={isDark ? "#0f172a" : "#e2e8f0"} fillOpacity={0.15} stroke={isDark ? "#334155" : "#94a3b8"} strokeWidth="0.8"/>
        <polygon points={pts(P2,P3,apex)} fill={isDark ? "#0f172a" : "#e2e8f0"} fillOpacity={0.12} stroke={isDark ? "#334155" : "#94a3b8"} strokeWidth="0.8"/>
        {!isEmpty && <>
          <polygon points={pts(P1,P2,P3,P4,P5)} fill="#1e3a8a" fillOpacity={0.90}/>
          <polygon points={pts(P2,P3,WP3,WP2)} fill="#1d4ed8" fillOpacity={0.75}/>
          <polygon points={pts(P1,P2,WP2,WP1)} fill="#2563eb" fillOpacity={0.82}/>
          <polygon points={pts(P5,P1,WP1,WP5)} fill="#2563eb" fillOpacity={0.75}/>
          {!isFull && <polygon points={pts(WP1,WP2,WP3,WP4,WP5)} fill="#7dd3fc" fillOpacity={0.50} style={{ filter:"drop-shadow(0 0 5px #38bdf8)" }}/>}
          {!isFull && <>
            <line x1={WP5[0]} y1={WP5[1]} x2={WP1[0]} y2={WP1[1]} stroke="#bae6fd" strokeWidth={2} strokeDasharray="6,3" strokeOpacity={0.85}/>
            <line x1={WP1[0]} y1={WP1[1]} x2={WP2[0]} y2={WP2[1]} stroke="#bae6fd" strokeWidth={2} strokeDasharray="6,3" strokeOpacity={0.85}/>
          </>}
        </>}
        <line x1={P1[0]} y1={P1[1]} x2={P2[0]} y2={P2[1]} stroke="#93c5fd" strokeWidth="2"/>
        <line x1={P2[0]} y1={P2[1]} x2={P3[0]} y2={P3[1]} stroke="#a5b4fc" strokeWidth="1.8"/>
        <line x1={P5[0]} y1={P5[1]} x2={P1[0]} y2={P1[1]} stroke="#93c5fd" strokeWidth="2"/>
        <line x1={P1[0]} y1={P1[1]} x2={apex[0]} y2={apex[1]} stroke="#93c5fd" strokeWidth="1.8"/>
        <line x1={P2[0]} y1={P2[1]} x2={apex[0]} y2={apex[1]} stroke="#a5b4fc" strokeWidth="1.6"/>
        <line x1={P3[0]} y1={P3[1]} x2={apex[0]} y2={apex[1]} stroke="#a5b4fc" strokeWidth="1.4"/>
        <line x1={P5[0]} y1={P5[1]} x2={apex[0]} y2={apex[1]} stroke="#93c5fd" strokeWidth="1.8"/>
        <text x={(P1[0]+P2[0])/2+5} y={(P1[1]+P2[1])/2+6} fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">a</text>
        <text x="112" y={186+20} fill="#4ade80" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{baseLbl5}</text>
        <text x={apex[0]} y={apex[1]-8} fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">T</text>
        <BarWidget barX={205} barY={68} barH={118}/>
        <text x="112" y="202" fill={statusColor} fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" filter="url(#wBloomLimas)">{statusText}</text>
        <text x="112" y="216" fill={isDark ? "#e0e7ff" : "#3730a3"} fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle" filter="url(#wBloomLimas)">V = ⅓ × L_alas × t</text>
      </>
    );
  };

  return (
    <div className="space-y-2">
      <div className={isDark ? "flex gap-1 bg-slate-800/60 rounded-lg p-1" : "flex gap-1 bg-gray-100 rounded-lg p-1"}>
        {tabLabels.map(({ key, label }) => (
          <button key={key} onClick={() => setLimasType(key)}
            className={`flex-1 text-xs py-1.5 px-1 rounded-md font-semibold transition-all font-body ${limasType === key ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>
            {label}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 280 225" className="w-full max-w-sm mx-auto my-1" aria-label="Pyramid water animation">
        <defs>
          <filter id="wBloomLimas">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {limasType === "segitiga"  && renderSegitiga()}
        {limasType === "segiempat" && renderSegiempat()}
        {limasType === "segilima"  && renderSegilima()}
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   EXAMPLE CARD
───────────────────────────────────────────────────────────── */
type Ex = { level: string; color: string; bg: string; border: string; badgeBg: string; question: React.ReactNode; answer: React.ReactNode };

const ExampleCard = ({ ex, idx, prefix, showLbl, hideLbl }: { ex: Ex; idx: number; prefix: string; showLbl: string; hideLbl: string }) => {
  const { isDark } = useTheme();
  const [show, setShow] = useState(false);
  return (
    <div className={`border ${ex.border} rounded-xl overflow-hidden`}>
      <div className={`${ex.bg} px-5 py-4`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold font-display px-2 py-0.5 rounded ${ex.badgeBg} ${ex.color} border ${ex.border}`}>
            {prefix} {idx + 1} — {ex.level}
          </span>
        </div>
        {ex.question}
      </div>
      <button onClick={() => { playPopSound(); setShow(v => !v); }}
        className={isDark ? "w-full flex items-center justify-between px-5 py-3 bg-slate-800/60 hover:bg-slate-800/90 transition-colors cursor-pointer border-t border-slate-700/50" : "w-full flex items-center justify-between px-5 py-3 bg-gray-100 hover:bg-gray-200/80 transition-colors cursor-pointer border-t border-gray-200"}>
        <span className={`text-xs font-semibold font-body ${ex.color}`}>{show ? hideLbl : showLbl}</span>
        {show ? <ChevronUp className="w-4 h-4 text-muted-foreground"/> : <ChevronDown className="w-4 h-4 text-muted-foreground"/>}
      </button>
      {show && <div className={isDark ? "px-5 py-4 bg-slate-900/60 border-t border-slate-700/30" : "px-5 py-4 bg-white/90 border-t border-gray-200"}>{ex.answer}</div>}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
const LimasPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { language: lang } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const translations = {
    id: {
      subtitle: "Kelas 8 · Bangun Ruang Sisi Datar",
      slideLabel: "Slide",
      prev: "← Sebelumnya", next: "Selanjutnya →",
      back: "← Kembali ke Bangun Ruang Sisi Datar",
      easy: "MUDAH", medium: "SEDANG", hard: "SULIT",
      prefixLP: "Soal LP", prefixVol: "Soal Vol",
      show: "Lihat Pembahasan", hide: "Sembunyikan",
      baseLabel: "ALAS",
    },
    en: {
      subtitle: "Grade 8 · Solid Figures with Flat Faces",
      slideLabel: "Slide",
      prev: "← Previous", next: "Next →",
      back: "← Back to Solid Figures",
      easy: "EASY", medium: "MEDIUM", hard: "HARD",
      prefixLP: "Ex SA", prefixVol: "Ex Vol",
      show: "Show Solution", hide: "Hide",
      baseLabel: "BASE",
    },
    ja: {
      subtitle: "中学2年 · 平面で囲まれた立体",
      slideLabel: "スライド",
      prev: "← 前へ", next: "次へ →",
      back: "← 立体図形に戻る",
      easy: "基本", medium: "標準", hard: "発展",
      prefixLP: "例題 表面積", prefixVol: "例題 体積",
      show: "解説を見る", hide: "隠す",
      baseLabel: "底面",
    },
  };
  const t = translations[lang as keyof typeof translations] ?? translations.id;

  // ── Sections (accordion)
  const sections = [
    {
      title: lang === "en" ? "Definition & Types of Pyramids" : lang === "ja" ? "角錐の定義と種類" : "Pengertian & Jenis Limas",
      icon: "🏔️",
      content: (
        <div className="space-y-4 font-body">
          <div className={isDark ? "bg-violet-950/50 border border-violet-700/40 rounded-lg p-3 text-sm text-white/85 leading-relaxed" : "bg-violet-50 border border-violet-300/60 rounded-lg p-3 text-sm text-slate-800 leading-relaxed"}>
            <p>
              {lang === "en"
                ? <><strong className="text-violet-300">A pyramid</strong> is a polyhedron with one polygonal base and triangular lateral faces that all meet at a single point called the <strong className="text-yellow-300">apex (T)</strong>.</>
                : lang === "ja"
                ? <><strong className="text-violet-300">角錐</strong>は多角形の底面と、すべて一点（<strong className="text-yellow-300">頂点 T</strong>）に集まる三角形の側面を持つ多面体です。</>
                : <><strong className="text-violet-300">Limas</strong> adalah bangun ruang sisi datar yang memiliki sebuah sisi alas berbentuk segi-n dan sisi-sisi tegak berbentuk segitiga yang bertemu di satu titik yang disebut <strong className="text-yellow-300">titik puncak (T)</strong>.</>}
            </p>
          </div>
          <p className={isDark ? "text-white/60 text-xs" : "text-slate-500 text-xs"}>
            {lang === "en" ? "Pyramids are named by their base shape:"
            : lang === "ja" ? "角錐は底面の形で名前が決まります："
            : "Limas diberi nama berdasarkan bentuk alasnya:"}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(lang === "en"
              ? [{ nama:"Triangular Pyramid", alas:"Triangle",  titik:4, rusuk:6,  sisi:4, icon:"△" },
                 { nama:"Square Pyramid",     alas:"Square",    titik:5, rusuk:8,  sisi:5, icon:"□" },
                 { nama:"Pentagonal Pyramid", alas:"Pentagon",  titik:6, rusuk:10, sisi:6, icon:"⬠" },
                 { nama:"Hexagonal Pyramid",  alas:"Hexagon",   titik:7, rusuk:12, sisi:7, icon:"⬡" }]
              : lang === "ja"
              ? [{ nama:"三角錐",  alas:"三角形",  titik:4, rusuk:6,  sisi:4, icon:"△" },
                 { nama:"四角錐",  alas:"四角形",  titik:5, rusuk:8,  sisi:5, icon:"□" },
                 { nama:"五角錐",  alas:"五角形",  titik:6, rusuk:10, sisi:6, icon:"⬠" },
                 { nama:"六角錐",  alas:"六角形",  titik:7, rusuk:12, sisi:7, icon:"⬡" }]
              : [{ nama:"Limas Segitiga",  alas:"Segitiga", titik:4, rusuk:6,  sisi:4, icon:"△" },
                 { nama:"Limas Segiempat", alas:"Segiempat",titik:5, rusuk:8,  sisi:5, icon:"□" },
                 { nama:"Limas Segilima",  alas:"Segilima", titik:6, rusuk:10, sisi:6, icon:"⬠" },
                 { nama:"Limas Segienam",  alas:"Segienam", titik:7, rusuk:12, sisi:7, icon:"⬡" }]
            ).map((j,i)=>(
              <div key={i} className={isDark ? "bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs space-y-1" : "bg-gray-100 border border-gray-200 rounded-lg p-3 text-xs space-y-1"}>
                <p className={isDark ? "text-white font-semibold" : "text-slate-800 font-semibold"}>{j.icon} {j.nama}</p>
                <p className="text-slate-400">{lang === "en" ? "Base:" : lang === "ja" ? "底面:" : "Alas:"} {j.alas}</p>
                <p className="text-cyan-300">{lang === "en" ? "Vertices:" : lang === "ja" ? "頂点:" : "Titik sudut:"} {j.titik}</p>
                <p className="text-orange-300">{lang === "en" ? "Edges:" : lang === "ja" ? "辺:" : "Rusuk:"} {j.rusuk}</p>
                <p className="text-green-300">{lang === "en" ? "Faces:" : lang === "ja" ? "面:" : "Sisi:"} {j.sisi}</p>
              </div>
            ))}
          </div>
          <div className={isDark ? "bg-slate-800/60 border border-cyan-700/30 rounded-lg p-3 text-xs text-white/80 space-y-1" : "bg-cyan-50 border border-cyan-300/40 rounded-lg p-3 text-xs text-slate-700 space-y-1"}>
            <p className="text-cyan-300 font-semibold">
              {lang === "en" ? "📐 General pattern for an n-gon pyramid:"
              : lang === "ja" ? "📐 n角錐の一般的なパターン:"
              : "📐 Pola umum untuk limas segi-n:"}
            </p>
            <p>• {lang === "en" ? "Vertices" : lang === "ja" ? "頂点" : "Titik sudut"} = <InlineMath math="n + 1"/></p>
            <p>• {lang === "en" ? "Edges" : lang === "ja" ? "辺" : "Rusuk"} = <InlineMath math="2n"/></p>
            <p>• {lang === "en" ? "Faces" : lang === "ja" ? "面" : "Sisi"} = <InlineMath math="n + 1"/></p>
          </div>
        </div>
      ),
    },
    {
      title: lang === "en" ? "Elements of a Square Pyramid" : lang === "ja" ? "四角錐の要素" : "Unsur-Unsur Limas Segiempat",
      icon: "🔍",
      content: (
        <div className="space-y-4 font-body">
          <p className={isDark ? "text-white/65 text-xs" : "text-slate-500 text-xs"}>
            {lang === "en" ? "We focus on Square Pyramid T.ABCD as the main model."
            : lang === "ja" ? "四角錐 T.ABCD を主なモデルとして扱います。"
            : "Kita akan fokus pada Limas Segiempat T.ABCD sebagai model utama."}
          </p>
          <div className="space-y-3">
            <div className={isDark ? "bg-slate-800/60 border border-orange-700/30 rounded-lg p-3" : "bg-orange-50 border border-orange-300/40 rounded-lg p-3"}>
              <p className="text-orange-300 font-semibold text-xs mb-2">
                {lang === "en" ? "1. Vertices (5)" : lang === "ja" ? "1. 頂点（5つ）" : "1. Titik Sudut (5 buah)"}
              </p>
              <TitikSudutLimasSVG lang={lang}/>
              <p className={isDark ? "text-white/65 text-xs" : "text-slate-500 text-xs"}>
                {lang === "en" ? "Four base vertices (A, B, C, D) and one apex T."
                : lang === "ja" ? "4つの底面頂点（A, B, C, D）と頂上T。"
                : "Empat titik sudut alas (A, B, C, D) dan satu titik puncak T."}
              </p>
            </div>
            <div className={isDark ? "bg-slate-800/60 border border-cyan-700/30 rounded-lg p-3" : "bg-cyan-50 border border-cyan-300/40 rounded-lg p-3"}>
              <p className="text-cyan-300 font-semibold text-xs mb-2">
                {lang === "en" ? "2. Edges (8)" : lang === "ja" ? "2. 辺（8本）" : "2. Rusuk (8 buah)"}
              </p>
              <RusukLimasSVG lang={lang}/>
              <div className={isDark ? "mt-2 space-y-1 text-xs text-white/70" : "mt-2 space-y-1 text-xs text-slate-600"}>
                <p>• <strong className="text-cyan-300">{lang === "en" ? "Base edges (4):" : lang === "ja" ? "底面の辺（4）:" : "Rusuk alas (4):"}</strong> AB, BC, CD, DA</p>
                <p>• <strong className="text-orange-300">{lang === "en" ? "Lateral edges (4):" : lang === "ja" ? "側面の辺（4）:" : "Rusuk tegak (4):"}</strong> TA, TB, TC, TD</p>
              </div>
            </div>
            <div className={isDark ? "bg-slate-800/60 border border-green-700/30 rounded-lg p-3" : "bg-green-50 border border-green-300/40 rounded-lg p-3"}>
              <p className="text-green-300 font-semibold text-xs mb-2">
                {lang === "en" ? "3. Faces (5)" : lang === "ja" ? "3. 面（5枚）" : "3. Sisi / Bidang (5 buah)"}
              </p>
              <SisiLimasSVG lang={lang}/>
              <div className={isDark ? "mt-2 space-y-1 text-xs text-white/70" : "mt-2 space-y-1 text-xs text-slate-600"}>
                <p>• <strong className="text-blue-300">{lang === "en" ? "Base face (1):" : lang === "ja" ? "底面（1）:" : "Sisi alas (1):"}</strong> ABCD</p>
                <p>• <strong className="text-purple-300">{lang === "en" ? "Lateral faces (4):" : lang === "ja" ? "側面（4）:" : "Sisi tegak (4):"}</strong> TAB, TBC, TCD, TDA</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: lang === "en" ? "Pyramid Height & Apothem" : lang === "ja" ? "角錐の高さと斜高" : "Tinggi Limas & Apotema",
      icon: "📏",
      content: (
        <div className="space-y-4 font-body">
          <ApotemaLimasSVG lang={lang}/>
          <div className="space-y-3">
            <div className={isDark ? "bg-slate-800/60 border border-cyan-700/30 rounded-lg p-3 text-xs space-y-2" : "bg-cyan-50 border border-cyan-300/40 rounded-lg p-3 text-xs space-y-2"}>
              <p className="text-cyan-300 font-semibold">
                {lang === "en" ? "Pyramid Height (t)" : lang === "ja" ? "角錐の高さ（t）" : "Tinggi Limas (t)"}
              </p>
              <p className={isDark ? "text-white/75" : "text-slate-700"}>
                {lang === "en" ? "Perpendicular distance from apex T to the base plane. Always perpendicular (⊥) to the base; foot is center O."
                : lang === "ja" ? "頂点Tから底面への垂直距離。底面に⊥で、足はO（中心）。"
                : "Jarak tegak lurus dari titik puncak T ke bidang alas. Garis ini selalu tegak lurus (⊥) dengan alas dan titik kakinya disebut titik O (pusat alas)."}
              </p>
            </div>
            <div className={isDark ? "bg-slate-800/60 border border-orange-700/30 rounded-lg p-3 text-xs space-y-2" : "bg-orange-50 border border-orange-300/40 rounded-lg p-3 text-xs space-y-2"}>
              <p className="text-orange-300 font-semibold">
                {lang === "en" ? "Lateral Face Apothem (l)" : lang === "ja" ? "斜高（l）" : "Apotema Sisi Tegak (l)"}
              </p>
              <p className={isDark ? "text-white/75" : "text-slate-700"}>
                {lang === "en" ? "Height of a triangular face, measured from apex T to midpoint of a base edge. Relation to pyramid height:"
                : lang === "ja" ? "三角形の側面の高さ（T→底辺中点）。高さとの関係式："
                : "Tinggi segitiga pada bidang tegak, diukur dari puncak T ke titik tengah rusuk alas. Hubungannya dengan tinggi limas:"}
              </p>
              <div className={isDark ? "bg-slate-900/60 rounded p-2" : "bg-white/90 rounded p-2"}>
                <BlockMath math="l = \sqrt{t^2 + \left(\frac{s}{2}\right)^2}"/>
              </div>
              <p className={isDark ? "text-white/50" : "text-slate-500"}>
                {lang === "en" ? "where s = base side length" : lang === "ja" ? "s = 底面の辺の長さ" : "di mana s = panjang sisi alas"}
              </p>
            </div>
            <div className={isDark ? "bg-yellow-950/40 border border-yellow-700/30 rounded-lg p-3 text-xs space-y-1" : "bg-yellow-50 border border-yellow-300/40 rounded-lg p-3 text-xs space-y-1"}>
              <p className="text-yellow-300 font-semibold">
                {lang === "en" ? "💡 Remember the difference!" : lang === "ja" ? "💡 違いを覚えよう！" : "💡 Ingat perbedaannya!"}
              </p>
              <p className={isDark ? "text-white/70" : "text-slate-700"}>• <strong className="text-cyan-300">t</strong> = {lang === "en" ? "height → used for Volume" : lang === "ja" ? "高さ → 体積に使う" : "tinggi limas → dipakai untuk menghitung Volume"}</p>
              <p className={isDark ? "text-white/70" : "text-slate-700"}>• <strong className="text-orange-300">l</strong> = {lang === "en" ? "apothem → used for Surface Area" : lang === "ja" ? "斜高 → 表面積に使う" : "apotema → dipakai untuk menghitung Luas Permukaan"}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: lang === "en" ? "Pyramid Nets" : lang === "ja" ? "角錐の展開図" : "Jaring-Jaring Limas",
      icon: "📐",
      content: (
        <div className="space-y-4 font-body">
          <p className={isDark ? "text-white/65 text-xs" : "text-slate-500 text-xs"}>
            {lang === "en"
              ? "A net is a flat arrangement that folds into a pyramid. Select a type and press Unfold!"
              : lang === "ja"
              ? "展開図は折り畳むと角錐になる平面図形です。種類を選んで「展開」を押してください！"
              : "Jaring-jaring adalah rangkaian bidang datar yang jika dilipat membentuk sebuah limas. Pilih jenis limas lalu tekan Bongkar!"}
          </p>
          <JaringLimasInteraktif/>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-white/70 space-y-1.5" : "bg-gray-100 border border-gray-200 rounded-lg p-3 text-xs text-slate-700 space-y-1.5"}>
            <p className={isDark ? "text-white/85 font-semibold" : "text-slate-800 font-semibold"}>
              {lang === "en" ? "Net faces of a pyramid:"
              : lang === "ja" ? "角錐の展開図の面:"
              : "Susunan bidang pada jaring-jaring limas:"}
            </p>
            <p>✓ <strong className="text-blue-300">{lang === "en" ? "Triangular Pyramid" : lang === "ja" ? "三角錐" : "Limas Segitiga"}</strong> — {lang === "en" ? "1 triangle base + 3 triangular faces = 4 faces" : lang === "ja" ? "三角形の底面1 + 三角形3 = 4面" : "1 alas segitiga + 3 sisi segitiga = 4 bidang"}</p>
            <p>✓ <strong className="text-purple-300">{lang === "en" ? "Square Pyramid" : lang === "ja" ? "四角錐" : "Limas Segiempat"}</strong> — {lang === "en" ? "1 square base + 4 triangular faces = 5 faces" : lang === "ja" ? "正方形の底面1 + 三角形4 = 5面" : "1 alas persegi + 4 sisi segitiga = 5 bidang"}</p>
            <p>✓ <strong className="text-green-300">{lang === "en" ? "Pentagonal Pyramid" : lang === "ja" ? "五角錐" : "Limas Segilima"}</strong> — {lang === "en" ? "1 pentagon base + 5 triangular faces = 6 faces" : lang === "ja" ? "五角形の底面1 + 三角形5 = 6面" : "1 alas segilima + 5 sisi segitiga = 6 bidang"}</p>
            <p className={isDark ? "text-white/50 pt-0.5" : "text-slate-500 pt-0.5"}>
              {lang === "en" ? "All triangular faces share one base edge and meet at the apex when folded."
              : lang === "ja" ? "すべての三角形の面は底辺を共有し、折ると頂点で交わります。"
              : "Semua segitiga sisi terhubung ke satu rusuk alas dan bertemu di titik puncak saat dilipat."}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: lang === "en" ? "Pyramid Height, Apothem & Pythagorean Theorem" : lang === "ja" ? "高さ・斜高とピタゴラスの定理" : "Hubungan Antar-Unsur pada Limas dan Kaitannya dengan Teorema Pythagoras",
      icon: "📏",
      content: (
        <div className="space-y-4 font-body">
          <div className={isDark ? "bg-violet-950/50 border border-violet-700/40 rounded-lg p-3 text-sm text-white/85" : "bg-violet-50 border border-violet-300/60 rounded-lg p-3 text-sm text-slate-800"}>
            <p>
              {lang === "en"
                ? <>In a pyramid, the <strong className="text-cyan-300">height</strong>, <strong className="text-orange-300">apothem</strong>, <strong className="text-pink-300">lateral edge</strong>, and base dimensions are linked via right triangles — making the Pythagorean theorem essential for surface area calculations.</>
                : lang === "ja"
                ? <>角錐では<strong className="text-cyan-300">高さ</strong>、<strong className="text-orange-300">斜高</strong>、<strong className="text-pink-300">側面の辺</strong>と底面の寸法が直角三角形で結びつきます。</>
                : <>Pada limas, <strong className="text-cyan-300">tinggi limas</strong>, <strong className="text-orange-300">apotema sisi tegak</strong>, <strong className="text-pink-300">rusuk tegak</strong>, dan ukuran alas saling terhubung melalui segitiga siku-siku.</>}
            </p>
          </div>
          <div className={isDark ? "bg-slate-800/60 border border-cyan-700/30 rounded-lg p-3 space-y-3" : "bg-cyan-50 border border-cyan-300/40 rounded-lg p-3 space-y-3"}>
            <PythagorasLimasSegitigaDetailSVG lang={lang}/>
          </div>
          <PythagorasLimasSegitigaOverview lang={lang}/>
          <PythagorasLimasSegiempatOverview lang={lang}/>
          <PythagorasLimasSegiempatDiagonalSVG/>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1.5" : "bg-gray-100 border border-gray-200 rounded-lg p-3 text-xs text-slate-600 space-y-1.5"}>
            <p className={isDark ? "text-white font-semibold" : "text-slate-800 font-semibold"}>
              {lang === "en" ? "Summary of element relationships:"
              : lang === "ja" ? "要素の関係のまとめ:"
              : "Ringkasan hubungan unsur:"}
            </p>
            <p>• <strong className="text-cyan-300">t</strong> {lang === "en" ? "is always perpendicular to the base plane." : lang === "ja" ? "は常に底面に⊥。" : "selalu tegak lurus bidang alas."}</p>
            <p>• <strong className="text-orange-300">l</strong> {lang === "en" ? "connects apex to midpoint of a base edge." : lang === "ja" ? "は頂点から底辺中点へ。" : "menghubungkan puncak ke titik tengah rusuk alas pada sisi tegak."}</p>
            <p>• <strong className="text-pink-300">e</strong> {lang === "en" ? "is the lateral edge from apex to a base vertex." : lang === "ja" ? "は頂点から底面の頂点への辺。" : "adalah rusuk tegak dari puncak ke titik sudut alas."}</p>
            <p>• <strong className="text-pink-300">e</strong> = <InlineMath math="e=\sqrt{t^2+\frac{s^2}{2}}"/></p>
          </div>
        </div>
      ),
    },
    {
      title: lang === "en" ? "Volume of a Pyramid" : lang === "ja" ? "角錐の体積" : "Volume Limas",
      icon: "📦",
      content: (
        <div className="space-y-4 font-body">
          <WaterLimasAnimation lang={lang}/>
          <div className={isDark ? "bg-blue-950/50 border border-blue-700/40 rounded-lg p-3 text-sm text-white/85 leading-relaxed" : "bg-blue-50 border border-blue-300/60 rounded-lg p-3 text-sm text-slate-800 leading-relaxed"}>
            <p>
              {lang === "en"
                ? <>Volume of a pyramid = <strong className="text-cyan-300">one-third</strong> of the volume of a prism with the same base and height.</>
                : lang === "ja"
                ? <>角錐の体積 = 底面と高さが同じ角柱の体積の<strong className="text-cyan-300">1/3</strong>。</>
                : <>Volume limas = <strong className="text-cyan-300">sepertiga</strong> dari volume prisma dengan alas dan tinggi yang sama.</>}
            </p>
            <p className={isDark ? "text-xs text-white/50 mt-1" : "text-xs text-slate-500 mt-1"}>
              {lang === "en" ? "Provable by filling: 3 pyramids fill 1 prism."
              : lang === "ja" ? "3つの角錐で角柱1つが満たされます。"
              : "Dapat dibuktikan dengan mengisi limas ke dalam prisma: dibutuhkan 3 limas untuk mengisi 1 prisma."}
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <div className={isDark ? "bg-slate-800/60 border border-slate-700 rounded-lg p-3 space-y-2" : "bg-gray-100 border border-gray-200 rounded-lg p-3 space-y-2"}>
              <p className="text-cyan-300 font-semibold text-xs">
                {lang === "en" ? "General Formula:" : lang === "ja" ? "一般公式:" : "Rumus Umum:"}
              </p>
              <BlockMath math="\boxed{V = \frac{1}{3} \times L_a \times t}"/>
              <p className={isDark ? "text-white/50 text-xs" : "text-slate-500 text-xs"}>
                {lang === "en" ? "where t = pyramid height (apex-to-base distance)"
                : lang === "ja" ? "t = 高さ（頂点から底面）"
                : "dengan t = tinggi limas (jarak puncak ke alas)"}
              </p>
            </div>
            <div className={isDark ? "bg-slate-800/60 border border-slate-700 rounded-lg p-3 space-y-2" : "bg-gray-100 border border-gray-200 rounded-lg p-3 space-y-2"}>
              <p className="text-yellow-300 font-semibold text-xs">
                {lang === "en" ? "For various base types:" : lang === "ja" ? "底面の種類別:" : "Untuk berbagai jenis alas:"}
              </p>
              <div className={isDark ? "space-y-2 text-xs text-white/80" : "space-y-2 text-xs text-slate-700"}>
                <div className={isDark ? "flex justify-between border-b border-slate-700 pb-1" : "flex justify-between border-b border-gray-200 pb-1"}>
                  <span>{lang === "en" ? "Square base (s×s):" : lang === "ja" ? "正方形の底面 (s×s):" : "Alas persegi (s × s):"}</span>
                  <InlineMath math="V = \frac{1}{3}s^2 t"/>
                </div>
                <div className={isDark ? "flex justify-between border-b border-slate-700 pb-1" : "flex justify-between border-b border-gray-200 pb-1"}>
                  <span>{lang === "en" ? "Rectangle base (p×l):" : lang === "ja" ? "長方形の底面 (p×l):" : "Alas persegi panjang (p × l):"}</span>
                  <InlineMath math="V = \frac{1}{3}plt"/>
                </div>
                <div className={isDark ? "flex justify-between border-b border-slate-700 pb-1" : "flex justify-between border-b border-gray-200 pb-1"}>
                  <span>{lang === "en" ? "Triangle base (½×a×t₀):" : lang === "ja" ? "三角形の底面 (½×a×t₀):" : "Alas segitiga (½ × a × t₀):"}</span>
                  <InlineMath math="V = \frac{1}{6}a \cdot t_0 \cdot t"/>
                </div>
                <div className="flex justify-between">
                  <span>{lang === "en" ? "Equilateral triangle (a):" : lang === "ja" ? "正三角形 (a):" : "Alas segitiga sama sisi (a):"}</span>
                  <InlineMath math="V = \frac{a^2\sqrt{3}}{12}t"/>
                </div>
              </div>
            </div>
            <div className={isDark ? "bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1" : "bg-gray-100 border border-gray-200 rounded-lg p-3 text-xs text-slate-600 space-y-1"}>
              <p>🎯 <strong className="text-white">{lang === "en" ? "Volume units:" : lang === "ja" ? "体積の単位:" : "Satuan volume:"}</strong></p>
              <p>• {lang === "en" ? "If s and t in cm → Volume in" : lang === "ja" ? "s と t が cm → 体積は" : "Jika s dan t dalam cm → Volume dalam"} <InlineMath math="\text{cm}^3"/></p>
              <p>• <InlineMath math="1 \text{ m}^3 = 1.000.000 \text{ cm}^3 = 10^6 \text{ cm}^3"/></p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: lang === "en" ? "Summary — Complete Pyramid Formulas" : lang === "ja" ? "まとめ — 角錐の公式" : "Kesimpulan — Rumus Lengkap Limas",
      icon: "📊",
      content: (
        <div className="space-y-3 font-body">
          <div className={isDark ? "overflow-x-auto rounded-lg border border-slate-700" : "overflow-x-auto rounded-lg border border-gray-200"}>
            <table className="w-full text-xs text-center">
              <thead><tr className={isDark ? "bg-slate-800" : "bg-gray-100"}>
                <th className={isDark ? "px-3 py-2 text-violet-300 border-r border-slate-700 text-left" : "px-3 py-2 text-violet-700 border-r border-gray-200 text-left"}>
                  {lang === "en" ? "Quantity" : lang === "ja" ? "量" : "Besaran"}
                </th>
                <th className={isDark ? "px-3 py-2 text-violet-300 border-r border-slate-700" : "px-3 py-2 text-violet-700 border-r border-gray-200"}>
                  {lang === "en" ? "Formula (Regular Square Pyramid)" : lang === "ja" ? "公式（正四角錐）" : "Rumus (Limas Segiempat Beraturan)"}
                </th>
                <th className="px-3 py-2 text-violet-300">
                  {lang === "en" ? "Notes" : lang === "ja" ? "備考" : "Keterangan"}
                </th>
              </tr></thead>
              <tbody>
                {(lang === "en"
                  ? [["Vertices","n + 1","n = base sides"],["Edges","2n","n base + n lateral"],["Faces","n + 1","1 base + n triangles"],
                     ["Lateral apothem","l = √(t² + (s/2)²)","3D Pythagoras"],["Base area","Lₐ = s²","square"],
                     ["One lateral face","L△ = ½ × s × l","triangle"],["Surface area","L = s² + 2sl","base + 4 triangles"],
                     ["Volume","V = ⅓ × s² × t","one-third of prism"]]
                  : lang === "ja"
                  ? [["頂点","n + 1","n = 底面の辺数"],["辺","2n","n底面 + n側面"],["面","n + 1","底面1 + n三角形"],
                     ["斜高","l = √(t² + (s/2)²)","ピタゴラス"],["底面積","Lₐ = s²","正方形"],
                     ["側面1枚","L△ = ½ × s × l","三角形"],["表面積","L = s² + 2sl","底面 + 4三角形"],
                     ["体積","V = ⅓ × s² × t","角柱の1/3"]]
                  : [["Titik sudut","n + 1","n = banyak sisi alas"],["Rusuk","2n","n alas + n tegak"],
                     ["Sisi","n + 1","1 alas + n segitiga"],["Apotema tegak","l = √(t² + (s/2)²)","Pythagoras 3D"],
                     ["Luas alas","L_a = s²","persegi"],["Luas satu Δ tegak","L_Δ = ½ × s × l","segitiga"],
                     ["Luas permukaan","L = s² + 2sl","alas + 4 segitiga"],["Volume","V = ⅓ × s² × t","sepertiga prisma"]]
                ).map(([b,r,c],i)=>(
                  <tr key={i} className={`border-t border-slate-700 ${i%2===0 ? (isDark ? "bg-slate-900/40" : "bg-blue-50/50") : (isDark ? "bg-slate-800/30" : "")}`}>
                    <td className={isDark ? "px-3 py-2 text-white/90 font-semibold border-r border-slate-700 text-left" : "px-3 py-2 text-slate-800 font-semibold border-r border-gray-200 text-left"}>{b}</td>
                    <td className={isDark ? "px-3 py-2 text-yellow-300 font-mono border-r border-slate-700" : "px-3 py-2 text-yellow-600 font-mono border-r border-gray-200"}>{r}</td>
                    <td className={isDark ? "px-3 py-2 text-white/55 text-left" : "px-3 py-2 text-slate-500 text-left"}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={isDark ? "bg-violet-950/50 border border-violet-700/40 rounded-lg p-3 text-xs text-violet-200 space-y-1" : "bg-violet-50 border border-violet-300/60 rounded-lg p-3 text-xs text-violet-800 space-y-1"}>
            <p>🚀 <strong>
              {lang === "en" ? "Key: two important variables — s (base side) and t (height)."
              : lang === "ja" ? "重要な変数: s（底辺の辺）と t（高さ）の2つ。"
              : "Kunci utama limas: Ada dua variabel penting: s (sisi alas) dan t (tinggi)."}
            </strong></p>
            <p>
              {lang === "en" ? "For surface area, find l (apothem) first using Pythagorean Theorem."
              : lang === "ja" ? "表面積にはまずピタゴラスでlを求める。"
              : "Untuk luas permukaan, cari dulu l (apotema) menggunakan Teorema Pythagoras."}
            </p>
            <p>
              {lang === "en" ? "For volume, only t and base area are needed."
              : lang === "ja" ? "体積にはtと底面積だけ使う。"
              : "Untuk volume, cukup gunakan t dan L_alas."}
            </p>
          </div>
        </div>
      ),
    },
  ];

  // ── Examples
  const luasExamples: Ex[] = [
    {
      level: t.easy,
      color:"text-green-400", bg: isDark ? "bg-green-950/30" : "bg-green-50", border: isDark ? "border-green-700/50" : "border-green-300", badgeBg: isDark ? "bg-green-900/60" : "bg-green-100",
      question: (
        <div className={isDark ? "text-sm text-white/85 font-body space-y-1" : "text-sm text-slate-800 font-body space-y-1"}>
          <p>
            {lang === "en"
              ? <>A regular square pyramid has a square base with side <InlineMath math="10\text{ cm}"/> and lateral face apothem <InlineMath math="13\text{ cm}"/>. Find the surface area.</>
              : lang === "ja"
              ? <>底面が一辺<InlineMath math="10\text{ cm}"/>の正四角錐で斜高<InlineMath math="13\text{ cm}"/>。表面積を求めよ。</>
              : <>Sebuah limas segiempat beraturan memiliki alas berbentuk persegi dengan sisi <InlineMath math="10\text{ cm}"/> dan apotema sisi tegak <InlineMath math="13\text{ cm}"/>. Hitunglah luas permukaan limas tersebut!</>}
          </p>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2" : "bg-gray-100 border border-gray-300 rounded p-3 space-y-2"}>
            <BlockMath math="L_a = s^2 = 10^2 = 100\text{ cm}^2"/>
            <BlockMath math="L_s = 4 \times \frac{1}{2} \times s \times l = 4 \times \frac{1}{2} \times 10 \times 13 = 260\text{ cm}^2"/>
            <BlockMath math="L = 100 + 260 = 360\text{ cm}^2"/>
          </div>
          <div className={isDark ? "bg-green-950/60 border border-green-700/40 rounded p-3" : "bg-green-50 border border-green-300/60 rounded p-3"}>
            <p className={isDark ? "text-green-300 font-semibold" : "text-green-700 font-semibold"}>✅ {lang === "en" ? "Surface area" : lang === "ja" ? "表面積" : "Luas permukaan"} = <InlineMath math="360\text{ cm}^2"/></p>
          </div>
        </div>
      ),
    },
    {
      level: t.medium,
      color:"text-yellow-400", bg: isDark ? "bg-yellow-950/30" : "bg-yellow-50", border: isDark ? "border-yellow-700/50" : "border-yellow-300", badgeBg: isDark ? "bg-yellow-900/60" : "bg-yellow-100",
      question: (
        <div className={isDark ? "text-sm text-white/85 font-body space-y-1" : "text-sm text-slate-800 font-body space-y-1"}>
          <p>
            {lang === "en"
              ? <>Regular square pyramid T.ABCD has base side <InlineMath math="12\text{ cm}"/> and height <InlineMath math="8\text{ cm}"/>. Find: (a) the apothem, (b) the surface area.</>
              : lang === "ja"
              ? <>正四角錐 T.ABCD の底辺<InlineMath math="12\text{ cm}"/>、高さ<InlineMath math="8\text{ cm}"/>。(a)斜高、(b)表面積を求めよ。</>
              : <>Limas segiempat beraturan T.ABCD memiliki alas persegi dengan sisi <InlineMath math="12\text{ cm}"/> dan tinggi limas <InlineMath math="8\text{ cm}"/>. Tentukan: (a) apotema sisi tegak, (b) luas permukaan limas.</>}
          </p>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-yellow-400 font-semibold">(a) {lang === "en" ? "Apothem:" : lang === "ja" ? "斜高:" : "Apotema sisi tegak:"}</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-300 rounded p-3"}>
            <BlockMath math="l = \sqrt{t^2 + \left(\frac{s}{2}\right)^2} = \sqrt{8^2 + 6^2} = \sqrt{64 + 36} = \sqrt{100} = 10\text{ cm}"/>
          </div>
          <p className="text-yellow-400 font-semibold">(b) {lang === "en" ? "Surface area:" : lang === "ja" ? "表面積:" : "Luas permukaan:"}</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2" : "bg-gray-100 border border-gray-300 rounded p-3 space-y-2"}>
            <BlockMath math="L_a = 12^2 = 144\text{ cm}^2"/>
            <BlockMath math="L_s = 4 \times \frac{1}{2} \times 12 \times 10 = 240\text{ cm}^2"/>
            <BlockMath math="L = 144 + 240 = 384\text{ cm}^2"/>
          </div>
          <div className={isDark ? "bg-yellow-950/60 border border-yellow-700/40 rounded p-3" : "bg-yellow-50 border border-yellow-300/60 rounded p-3"}>
            <p className={isDark ? "text-yellow-300 font-semibold text-sm" : "text-yellow-700 font-semibold text-sm"}>✅ <InlineMath math="l = 10\text{ cm}"/>, <InlineMath math="L = 384\text{ cm}^2"/></p>
          </div>
        </div>
      ),
    },
    {
      level: t.hard,
      color:"text-red-400", bg: isDark ? "bg-red-950/30" : "bg-red-50", border: isDark ? "border-red-700/50" : "border-red-300", badgeBg: isDark ? "bg-red-900/60" : "bg-red-100",
      question: (
        <div className={isDark ? "text-sm text-white/85 font-body space-y-1" : "text-sm text-slate-800 font-body space-y-1"}>
          <p>
            {lang === "en"
              ? <>A scout tent shaped as a regular square pyramid has a square base with side <InlineMath math="3\text{ m}"/> and height <InlineMath math="2\text{ m}"/>. The lateral faces use fabric costing {lang === "en" ? "$" : "Rp"}85,000/m². The base has no fabric. What is the total fabric cost?</>
              : lang === "ja"
              ? <>底辺<InlineMath math="3\text{ m}"/>、高さ<InlineMath math="2\text{ m}"/>の正四角錐のテント。側面は1m²あたり$85,000の布。底面なし。布代の合計は？</>
              : <>Sebuah tenda pramuka berbentuk limas segiempat beraturan. Alas tenda berupa persegi dengan sisi <InlineMath math="3\text{ m}"/> dan tinggi tenda <InlineMath math="2\text{ m}"/>. Sisi tegak tenda terbuat dari kain seharga <InlineMath math="Rp\,85.000/\text{m}^2"/>. Alas tidak menggunakan kain. Berapa total biaya kain untuk membuat tenda tersebut?</>}
          </p>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-red-400 font-semibold">{lang === "en" ? "Step 1 — Apothem:" : lang === "ja" ? "ステップ1 — 斜高:" : "Langkah 1 — Cari apotema sisi tegak:"}</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-300 rounded p-3"}>
            <BlockMath math="l = \sqrt{2^2 + \left(\frac{3}{2}\right)^2} = \sqrt{4 + 2{,}25} = \sqrt{6{,}25} = 2{,}5\text{ m}"/>
          </div>
          <p className="text-red-400 font-semibold">{lang === "en" ? "Step 2 — Fabric area (4 lateral faces only):" : lang === "ja" ? "ステップ2 — 布の面積（側面のみ）:" : "Langkah 2 — Hitung luas kain (hanya 4 sisi tegak):"}</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-300 rounded p-3"}>
            <BlockMath math="L_k = 4 \times \frac{1}{2} \times 3 \times 2{,}5 = 4 \times 3{,}75 = 15\text{ m}^2"/>
          </div>
          <p className="text-red-400 font-semibold">{lang === "en" ? "Step 3 — Cost:" : lang === "ja" ? "ステップ3 — 費用:" : "Langkah 3 — Hitung biaya:"}</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-300 rounded p-3"}>
            {lang === "en" || lang === "ja"
              ? <BlockMath math="\text{Cost} = 15 \times 85{,}000 = \$1{,}275{,}000"/>
              : <BlockMath math="\text{Biaya} = 15 \times 85.000 = Rp\,1.275.000"/>}
          </div>
          <div className={isDark ? "bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5" : "bg-red-50 border border-red-300/60 rounded p-3 text-xs space-y-0.5"}>
            <p className={isDark ? "text-red-300 font-semibold" : "text-red-700 font-semibold"}>✅ {lang === "en" ? "Answer:" : lang === "ja" ? "答え:" : "Jawaban:"}</p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang === "en" ? "Apothem" : lang === "ja" ? "斜高" : "Apotema"} = 2,5 m</p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang === "en" ? "Fabric area" : lang === "ja" ? "布の面積" : "Luas kain"} = 15 m²</p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang === "en" ? "Total cost" : lang === "ja" ? "合計費用" : "Total biaya"} = <strong className="text-yellow-300">{lang === "en" || lang === "ja" ? "$1,275,000" : "Rp 1.275.000"}</strong></p>
          </div>
        </div>
      ),
    },
  ];

  const volExamples: Ex[] = [
    {
      level: t.easy,
      color:"text-green-400", bg: isDark ? "bg-green-950/30" : "bg-green-50", border: isDark ? "border-green-700/50" : "border-green-300", badgeBg: isDark ? "bg-green-900/60" : "bg-green-100",
      question: (
        <div className={isDark ? "text-sm text-white/85 font-body space-y-1" : "text-sm text-slate-800 font-body space-y-1"}>
          <p>
            {lang === "en"
              ? <>A regular square pyramid has base side <InlineMath math="6\text{ cm}"/> and height <InlineMath math="8\text{ cm}"/>. Find the volume.</>
              : lang === "ja"
              ? <>底辺<InlineMath math="6\text{ cm}"/>、高さ<InlineMath math="8\text{ cm}"/>の正四角錐の体積を求めよ。</>
              : <>Sebuah limas segiempat beraturan memiliki alas persegi dengan sisi <InlineMath math="6\text{ cm}"/> dan tinggi <InlineMath math="8\text{ cm}"/>. Hitunglah volume limas tersebut!</>}
          </p>
        </div>
      ),
      answer: (
        <div className="space-y-2 text-sm font-body">
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-300 rounded p-3"}>
            <BlockMath math="V = \frac{1}{3} \times s^2 \times t = \frac{1}{3} \times 6^2 \times 8 = \frac{1}{3} \times 36 \times 8 = 96\text{ cm}^3"/>
          </div>
          <div className={isDark ? "bg-green-950/60 border border-green-700/40 rounded p-2" : "bg-green-50 border border-green-300/60 rounded p-2"}>
            <p className={isDark ? "text-green-300 font-semibold text-xs" : "text-green-700 font-semibold text-xs"}>✅ {lang === "en" ? "Volume" : lang === "ja" ? "体積" : "Volume"} = <InlineMath math="96\text{ cm}^3"/></p>
          </div>
        </div>
      ),
    },
    {
      level: t.medium,
      color:"text-yellow-400", bg: isDark ? "bg-yellow-950/30" : "bg-yellow-50", border: isDark ? "border-yellow-700/50" : "border-yellow-300", badgeBg: isDark ? "bg-yellow-900/60" : "bg-yellow-100",
      question: (
        <div className={isDark ? "text-sm text-white/85 font-body space-y-1" : "text-sm text-slate-800 font-body space-y-1"}>
          <p>
            {lang === "en"
              ? <>The volume of a regular square pyramid is <InlineMath math="192\text{ cm}^3"/> and height is <InlineMath math="12\text{ cm}"/>. Find: (a) base side length, (b) surface area if apothem is <InlineMath math="10\text{ cm}"/>.</>
              : lang === "ja"
              ? <>正四角錐の体積<InlineMath math="192\text{ cm}^3"/>、高さ<InlineMath math="12\text{ cm}"/>。(a)底辺の長さ、(b)斜高<InlineMath math="10\text{ cm}"/>のとき表面積を求めよ。</>
              : <>Volume sebuah limas segiempat beraturan adalah <InlineMath math="192\text{ cm}^3"/> dan tingginya <InlineMath math="12\text{ cm}"/>. Tentukan: (a) panjang sisi alasnya, (b) luas permukaannya jika apotema <InlineMath math="10\text{ cm}"/>.</>}
          </p>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-yellow-400 font-semibold">(a)</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3 space-y-1" : "bg-gray-100 border border-gray-300 rounded p-3 space-y-1"}>
            <BlockMath math="V = \frac{1}{3} s^2 t \Rightarrow 192 = \frac{1}{3} \times s^2 \times 12"/>
            <BlockMath math="192 = 4s^2 \Rightarrow s^2 = 48 \Rightarrow s = 4\sqrt{3} \approx 6{,}93\text{ cm}"/>
          </div>
          <p className="text-yellow-400 font-semibold">(b)</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3 space-y-2" : "bg-gray-100 border border-gray-300 rounded p-3 space-y-2"}>
            <BlockMath math="L_a = s^2 = 48\text{ cm}^2"/>
            <BlockMath math="L_s = 4 \times \frac{1}{2} \times 4\sqrt{3} \times 10 = 80\sqrt{3} \approx 138{,}6\text{ cm}^2"/>
            <BlockMath math="L = 48 + 80\sqrt{3} \approx 186{,}6\text{ cm}^2"/>
          </div>
          <div className={isDark ? "bg-yellow-950/60 border border-yellow-700/40 rounded p-2" : "bg-yellow-50 border border-yellow-300/60 rounded p-2"}>
            <p className={isDark ? "text-yellow-300 font-semibold text-xs" : "text-yellow-700 font-semibold text-xs"}>✅ <InlineMath math="s = 4\sqrt{3}\text{ cm}"/>, <InlineMath math="L \approx 186{,}6\text{ cm}^2"/></p>
          </div>
        </div>
      ),
    },
    {
      level: t.hard,
      color:"text-red-400", bg: isDark ? "bg-red-950/30" : "bg-red-50", border: isDark ? "border-red-700/50" : "border-red-300", badgeBg: isDark ? "bg-red-900/60" : "bg-red-100",
      question: (
        <div className={isDark ? "text-sm text-white/85 font-body space-y-1" : "text-sm text-slate-800 font-body space-y-1"}>
          <p>
            {lang === "en"
              ? <>A clay pyramid toy (regular square pyramid) has base side <InlineMath math="9\text{ cm}"/> and lateral edge <InlineMath math="12\text{ cm}"/>. Find (a) height, (b) volume, (c) weight if clay density is <InlineMath math="2{,}5\text{ g/cm}^3"/>.</>
              : lang === "ja"
              ? <>底辺<InlineMath math="9\text{ cm}"/>、側面の辺<InlineMath math="12\text{ cm}"/>の正四角錐の粘土模型。(a)高さ、(b)体積、(c)密度<InlineMath math="2{,}5\text{ g/cm}^3"/>のとき重さを求めよ。</>
              : <>Sebuah piramida mainan terbuat dari tanah liat berbentuk limas segiempat beraturan dengan sisi alas <InlineMath math="9\text{ cm}"/> dan rusuk tegak <InlineMath math="12\text{ cm}"/>. (a) Tentukan tinggi limas. (b) Tentukan volume. (c) Jika berat tanah liat <InlineMath math="2{,}5\text{ gram/cm}^3"/>, berapa berat piramida tersebut?</>}
          </p>
        </div>
      ),
      answer: (
        <div className="space-y-3 text-sm font-body">
          <p className="text-red-400 font-semibold">(a) {lang === "en" ? "Height:" : lang === "ja" ? "高さ:" : "Tinggi limas:"}</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1" : "bg-gray-100 border border-gray-300 rounded p-3 text-xs space-y-1"}>
            <BlockMath math="t = \sqrt{TA^2 - OA^2} = \sqrt{12^2 - \left(\frac{9\sqrt{2}}{2}\right)^2}"/>
            <BlockMath math="= \sqrt{144 - 40{,}5} = \sqrt{103{,}5} \approx 10{,}17\text{ cm}"/>
          </div>
          <p className="text-red-400 font-semibold">(b) {lang === "en" ? "Volume:" : lang === "ja" ? "体積:" : "Volume:"}</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-300 rounded p-3"}>
            <BlockMath math="V = \frac{1}{3} \times 9^2 \times \sqrt{103{,}5} \approx \frac{1}{3} \times 81 \times 10{,}17 \approx 274{,}6\text{ cm}^3"/>
          </div>
          <p className="text-red-400 font-semibold">(c) {lang === "en" ? "Weight:" : lang === "ja" ? "重さ:" : "Berat:"}</p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-600 rounded p-3" : "bg-gray-100 border border-gray-300 rounded p-3"}>
            <BlockMath math="m = 274{,}6 \times 2{,}5 \approx 686{,}5\text{ gram}"/>
          </div>
          <div className={isDark ? "bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-0.5" : "bg-red-50 border border-red-300/60 rounded p-3 text-xs space-y-0.5"}>
            <p className={isDark ? "text-red-300 font-semibold" : "text-red-700 font-semibold"}>✅ {lang === "en" ? "Answer:" : lang === "ja" ? "答え:" : "Jawaban:"}</p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang === "en" ? "Height" : lang === "ja" ? "高さ" : "Tinggi"} ≈ 10,17 cm</p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang === "en" ? "Volume" : lang === "ja" ? "体積" : "Volume"} ≈ 274,6 cm³</p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>• {lang === "en" ? "Weight" : lang === "ja" ? "重さ" : "Berat"} ≈ <strong className="text-yellow-300">686,5 gram</strong></p>
          </div>
        </div>
      ),
    },
  ];

  // ── Slides
  type Slide = { icon: string; title: string; content: React.ReactNode };
  const slides: Slide[] = [
    {
      icon: "🏔️",
      title: lang === "en" ? "Introduction" : lang === "ja" ? "はじめに" : "Pengantar",
      content: (
        <div className={isDark ? "space-y-4 text-sm font-body text-white/75 leading-relaxed" : "space-y-4 text-sm font-body text-slate-700 leading-relaxed"}>
          <ThreeLimas/>
          <p>
            {lang === "en"
              ? <>From the ancient Egyptian pyramids to pointed rooftops, <strong className="text-violet-300">pyramids</strong> are everywhere! Learn about their elements, interactive nets, and how to calculate <strong className="text-yellow-300">surface area</strong> and <strong className="text-green-300">volume</strong>.</>
              : lang === "ja"
              ? <>古代エジプトのピラミッドから尖った屋根まで、<strong className="text-violet-300">角錐</strong>はいたるところにあります！要素、展開図、<strong className="text-yellow-300">表面積</strong>と<strong className="text-green-300">体積</strong>の計算を学びましょう。</>
              : <>Dari piramida Mesir kuno hingga atap rumah yang runcing, bentuk <strong className="text-violet-300">limas</strong> ada di mana-mana! Pelajari semua tentang limas — mulai dari unsur-unsurnya, jaring-jaring interaktif, hingga cara menghitung <strong className="text-yellow-300">luas permukaan</strong> dan <strong className="text-green-300">volume</strong>-nya.</>}
          </p>
          <div className={isDark ? "bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs text-white/60 space-y-1" : "bg-gray-100 border border-gray-200 rounded-lg p-3 text-xs text-slate-600 space-y-1"}>
            <p className="text-violet-300 font-semibold mb-1">📋 {lang === "en" ? "Topics in this chapter:" : lang === "ja" ? "この章のトピック:" : "Materi dalam bab ini:"}</p>
            <p>• {lang === "en" ? "Definition & types of pyramids" : lang === "ja" ? "角錐の定義と種類" : "Pengertian & jenis-jenis limas"}</p>
            <p>• {lang === "en" ? "Elements: edges, faces, vertices" : lang === "ja" ? "要素: 辺、面、頂点" : "Unsur-unsur: rusuk, sisi, titik sudut"}</p>
            <p>• {lang === "en" ? "Interactive nets" : lang === "ja" ? "インタラクティブ展開図" : "Jaring-jaring interaktif"}</p>
            <p>• {lang === "en" ? "Surface area and volume" : lang === "ja" ? "表面積と体積" : "Luas permukaan dan volume"}</p>
            <p>• {lang === "en" ? "Graded examples" : lang === "ja" ? "段階的な例題" : "Contoh soal bertingkat"}</p>
          </div>
          <div className={isDark ? "bg-slate-800/60 border border-violet-700/40 rounded-xl p-3" : "bg-violet-50 border border-violet-300/40 rounded-xl p-3"}>
            <p className="text-violet-300 font-semibold text-xs mb-3 text-center">
              📷 {lang === "en" ? "Pyramids Around Us" : lang === "ja" ? "身の回りの角錐" : "Contoh Benda Berbentuk Limas di Sekitar Kita"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { src:"/images/image_1776844211789.png", caption: lang === "en" ? "Rubik Pyramid (Triangular)" : lang === "ja" ? "ルービックピラミッド（三角錐）" : "Rubik Pyramid (Limas Segitiga)" },
                { src:"/images/image_1776844253335.png", caption: lang === "en" ? "Coconut Milk Packaging"     : lang === "ja" ? "ココナッツミルクパッケージ"      : "Kemasan Santan (Limas Segitiga)" },
                { src:"/images/image_1776844303292.png", caption: lang === "en" ? "Sticky Rice Dumpling"       : lang === "ja" ? "おこわちまき"                    : "Bakcang Ketan (Limas Segitiga)" },
                { src:"/images/image_1776844334711.png", caption: lang === "en" ? "Louvre Pyramid (Square)"    : lang === "ja" ? "ルーブルのピラミッド（四角錐）"  : "Piramida Louvre (Limas Segiempat)" },
                { src:"/images/image_1776844359975.png", caption: lang === "en" ? "Egyptian Pyramid (Square)"  : lang === "ja" ? "エジプトのピラミッド（四角錐）"  : "Piramida Mesir (Limas Segiempat)" },
                { src:"/images/image_1776844428389.png", caption: lang === "en" ? "Scout Tent (Square)"        : lang === "ja" ? "スカウトテント（四角錐）"        : "Tenda Pramuka (Limas Segiempat)" },
              ].map((item,i)=>(
                <div key={i} className="bg-white rounded-lg p-2 flex flex-col items-center">
                  <div className="w-full h-24 flex items-center justify-center overflow-hidden">
                    <img src={item.src} alt={item.caption} className="max-h-full max-w-full object-contain"/>
                  </div>
                  <p className="text-[10px] text-slate-700 text-center mt-1 font-semibold leading-tight">{item.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    { icon:"🏔️", title: sections[0].title, content: sections[0].content },
    {
      icon:"⬛",
      title: lang === "en" ? "Element — Pyramid Edges" : lang === "ja" ? "要素 — 辺" : "Unsur — Rusuk Limas",
      content: (
        <div className={isDark ? "space-y-4 text-sm text-white/85 font-body" : "space-y-4 text-sm text-slate-800 font-body"}>
          <div className={isDark ? "bg-slate-800/60 border border-cyan-700/40 rounded-xl p-4" : "bg-cyan-50 border border-cyan-300/40 rounded-xl p-4"}>
            <p className="text-cyan-300 font-semibold mb-1">
              🎬 {lang === "en" ? "Comparing Edges — 3 Pyramid Types" : lang === "ja" ? "辺の比較 — 3種類の角錐" : "Perbandingan Rusuk — 3 Jenis Limas"}
            </p>
            <p className={isDark ? "text-xs text-white/55 mb-3 font-body" : "text-xs text-slate-500 mb-3 font-body"}>
              {lang === "en" ? "Pyramids have only base edges and lateral edges — no top/lid edges because all lateral edges meet at one apex."
              : lang === "ja" ? "角錐には底面の辺と側面の辺だけあります。すべての側面の辺が一点に集まるため、上面の辺はありません。"
              : "Perhatikan: limas hanya memiliki rusuk alas dan rusuk tegak. Tidak ada rusuk atas/tutup seperti pada prisma karena semua rusuk tegak bertemu di satu puncak."}
            </p>
            <RusukTigaLimasAnimation/>
          </div>
        </div>
      ),
    },
    {
      icon:"⬜",
      title: lang === "en" ? "Element — Pyramid Faces" : lang === "ja" ? "要素 — 面" : "Unsur — Sisi Limas",
      content: (
        <div className={isDark ? "space-y-4 text-sm text-white/85 font-body" : "space-y-4 text-sm text-slate-800 font-body"}>
          <div className={isDark ? "bg-slate-800/60 border border-green-700/40 rounded-xl p-4" : "bg-green-50 border border-green-300/40 rounded-xl p-4"}>
            <p className="text-green-300 font-semibold mb-1">
              🎬 {lang === "en" ? "Comparing Faces — 3 Pyramid Types" : lang === "ja" ? "面の比較 — 3種類の角錐" : "Perbandingan Sisi — 3 Jenis Limas"}
            </p>
            <p className={isDark ? "text-xs text-white/55 mb-3 font-body" : "text-xs text-slate-500 mb-3 font-body"}>
              {lang === "en" ? "Click to see Base Face or Triangular Lateral Faces!"
              : lang === "ja" ? "「底面」または「側面」ボタンで確認！"
              : "Tekan tombol untuk melihat Sisi Alas atau Sisi Tegak Segitiga!"}
            </p>
            <SisiTigaLimasAnimation/>
          </div>
          <div className={isDark ? "bg-slate-800/60 border border-slate-700 rounded-lg p-4 text-xs text-white/70 space-y-1" : "bg-gray-100 border border-gray-200 rounded-lg p-4 text-xs text-slate-600 space-y-1"}>
            <p>• <strong className="text-blue-300">{lang === "en" ? "1 base face" : lang === "ja" ? "底面1枚" : "1 sisi alas"}</strong>: {lang === "en" ? "shape matches pyramid name" : lang === "ja" ? "形は底面の名前と一致" : "bentuknya mengikuti nama limas"}</p>
            <p>• <strong className="text-violet-300">{lang === "en" ? "n lateral faces" : lang === "ja" ? "側面n枚" : "n sisi tegak"}</strong>: {lang === "en" ? "all triangles meeting at apex" : lang === "ja" ? "すべて頂点で交わる三角形" : "semuanya berbentuk segitiga dan bertemu di puncak"}</p>
            <div className={isDark ? "bg-slate-700/60 rounded p-2 mt-2" : "bg-gray-200 rounded p-2 mt-2"}>
              <BlockMath math="\text{{Faces}} = n + 1"/>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon:"●",
      title: lang === "en" ? "Element — Vertices & Table" : lang === "ja" ? "要素 — 頂点と一覧表" : "Unsur — Titik Sudut & Tabel",
      content: (
        <div className={isDark ? "space-y-3 text-sm text-white/85 font-body" : "space-y-3 text-sm text-slate-800 font-body"}>
          <div className={isDark ? "bg-slate-800/60 border border-yellow-700/40 rounded-xl p-4" : "bg-yellow-50 border border-yellow-300/40 rounded-xl p-4"}>
            <p className="text-yellow-300 font-semibold mb-1">
              🎬 {lang === "en" ? "Comparing Vertices — 3 Pyramid Types" : lang === "ja" ? "頂点の比較 — 3種類の角錐" : "Perbandingan Titik Sudut — 3 Jenis Limas"}
            </p>
            <p className={isDark ? "text-xs text-white/55 mb-3 font-body" : "text-xs text-slate-500 mb-3 font-body"}>
              {lang === "en" ? "Click to see Base Vertices or Apex!"
              : lang === "ja" ? "「底面の頂点」または「頂上」ボタンで確認！"
              : "Tekan tombol untuk melihat Titik Sudut Alas atau Titik Puncak!"}
            </p>
            <TitikSudutTigaLimasAnimation/>
          </div>
          <div className={isDark ? "bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-xs text-white/70 space-y-1" : "bg-gray-100 border border-gray-200 rounded-lg p-3 text-xs text-slate-600 space-y-1"}>
            <p>• <strong className="text-cyan-300">{lang === "en" ? "n base vertices" : lang === "ja" ? "底面のn頂点" : "n titik sudut alas"}</strong></p>
            <p>• <strong className="text-yellow-300">{lang === "en" ? "1 apex" : lang === "ja" ? "頂上1点" : "1 titik puncak"}</strong></p>
            <div className={isDark ? "bg-slate-700/60 rounded p-2 mt-2" : "bg-gray-200 rounded p-2 mt-2"}>
              <BlockMath math="\text{{Vertices}} = n + 1"/>
            </div>
          </div>
          <div className={isDark ? "bg-violet-950/50 border border-violet-700/40 rounded-lg p-3 text-xs text-violet-200 space-y-1" : "bg-violet-50 border border-violet-300/60 rounded-lg p-3 text-xs text-violet-800 space-y-1"}>
            <p className="text-violet-300 font-semibold">📋 {lang === "en" ? "Pyramid element table:" : lang === "ja" ? "角錐の要素一覧表:" : "Tabel Unsur Limas Segi-n:"}</p>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-xs text-center">
                <thead><tr className="border-b border-violet-800">
                  <th className="px-2 py-1 text-left">{lang === "en" ? "Type" : lang === "ja" ? "種類" : "Jenis"}</th>
                  <th className="px-2 py-1">{lang === "en" ? "Faces" : lang === "ja" ? "面" : "Sisi"}</th>
                  <th className="px-2 py-1">{lang === "en" ? "Edges" : lang === "ja" ? "辺" : "Rusuk"}</th>
                  <th className="px-2 py-1">{lang === "en" ? "Vertices" : lang === "ja" ? "頂点" : "T. Sudut"}</th>
                </tr></thead>
                <tbody>
                  {(lang === "en"
                    ? [["Triangle (n=3)",4,6,4],["Square (n=4)",5,8,5],["Pentagon (n=5)",6,10,6],["Hexagon (n=6)",7,12,7]]
                    : lang === "ja"
                    ? [["三角形 (n=3)",4,6,4],["四角形 (n=4)",5,8,5],["五角形 (n=5)",6,10,6],["六角形 (n=6)",7,12,7]]
                    : [["Segitiga (n=3)",4,6,4],["Segiempat (n=4)",5,8,5],["Segilima (n=5)",6,10,6],["Segienam (n=6)",7,12,7]]
                  ).map(([n,s,r,ts],i)=>(
                    <tr key={i} className={`border-t border-violet-900 ${i%2===0 ? (isDark ? "bg-violet-950/30" : "bg-violet-50/50") : ""}`}>
                      <td className="px-2 py-1 text-left">{n}</td>
                      <td className="px-2 py-1 text-yellow-300">{s}</td>
                      <td className="px-2 py-1 text-yellow-300">{r}</td>
                      <td className="px-2 py-1 text-yellow-300">{ts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon:"📐",
      title: lang === "en" ? "Pyramid Nets" : lang === "ja" ? "角錐の展開図" : "Jaring-Jaring Limas",
      content: sections[3].content,
    },
    {
      icon:"📏",
      title: sections[4].title,
      content: sections[4].content,
    },
    {
      icon:"🎨",
      title: lang === "en" ? "Surface Area of a Pyramid" : lang === "ja" ? "角錐の表面積" : "Luas Permukaan Limas",
      content: <LimasSurfaceAreaSection lang={lang}/>,
    },
    {
      icon:"📦",
      title: lang === "en" ? "Volume of a Pyramid" : lang === "ja" ? "角錐の体積" : "Volume Limas",
      content: sections[5].content,
    },
    {
      icon:"📊",
      title: lang === "en" ? "Summary — Complete Formulas" : lang === "ja" ? "まとめ — 公式一覧" : "Kesimpulan — Rumus Lengkap",
      content: sections[6].content,
    },
    {
      icon:"📝",
      title: lang === "en" ? "Examples — Surface Area" : lang === "ja" ? "例題 — 表面積" : "Contoh Soal — Luas Permukaan",
      content: (
        <div className="flex flex-col gap-3">
          {luasExamples.map((ex,i)=>(
            <ExampleCard key={i} ex={ex} idx={i} prefix={t.prefixLP} showLbl={t.show} hideLbl={t.hide}/>
          ))}
        </div>
      ),
    },
    {
      icon:"📝",
      title: lang === "en" ? "Examples — Volume" : lang === "ja" ? "例題 — 体積" : "Contoh Soal — Volume",
      content: (
        <div className="flex flex-col gap-3">
          {volExamples.map((ex,i)=>(
            <ExampleCard key={i} ex={ex} idx={i} prefix={t.prefixVol} showLbl={t.show} hideLbl={t.hide}/>
          ))}
        </div>
      ),
    },
    {
      icon:"🔍",
      title: lang === "en" ? "Interactive Pyramid" : lang === "ja" ? "インタラクティブ角錐" : "Limas Interaktif 3D",
      content: <InteractiveLimas/>,
    },
    {
      icon:"🗃️",
      title: lang === "en" ? "Net Gallery" : lang === "ja" ? "展開図ギャラリー" : "Galeri Jaring-Jaring",
      content: <NetLimasGallery lang={lang}/>,
    },
  ];

  const total = slides.length;
  const goNext = () => { playPopSound(); setCurrentSlide(s => Math.min(s+1, total-1)); };
  const goPrev = () => { playPopSound(); setCurrentSlide(s => Math.max(s-1, 0)); };
  const slide = slides[currentSlide];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield/>
      <PageNavigation/>
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Triangle className="w-10 h-10 text-primary mx-auto mb-3"/>
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          {lang === "en" ? "PYRAMID" : lang === "ja" ? "角錐" : "LIMAS"}
        </h1>
        <p className={isDark ? "text-white/50 text-xs text-center mb-6 font-body" : "text-slate-500 text-xs text-center mb-6 font-body"}>{t.subtitle}</p>

        <div className="flex justify-center gap-1.5 mb-6 flex-wrap">
          {slides.map((_,i)=>(
            <button key={i}
              onClick={()=>{ playPopSound(); setCurrentSlide(i); }}
              className={`transition-all duration-300 rounded-full cursor-pointer ${i===currentSlide?"w-6 h-2.5 bg-primary":"w-2.5 h-2.5 bg-white/20 hover:bg-white/40"}`}/>
          ))}
        </div>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden mb-4">
          <div className={isDark ? "flex items-center gap-3 px-5 py-4 border-b border-border/50 bg-slate-800/40" : "flex items-center gap-3 px-5 py-4 border-b border-border/50 bg-gray-100"}>
            <span className="text-2xl">{slide.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={isDark ? "text-white/40 text-[10px] font-body uppercase tracking-widest" : "text-slate-400 text-[10px] font-body uppercase tracking-widest"}>
                {t.slideLabel} {currentSlide+1} / {total}
              </p>
              <h2 className={isDark ? "font-display text-sm font-bold text-white" : "font-display text-sm font-bold text-slate-800"}>{slide.title}</h2>
            </div>
          </div>
          <div className="px-5 py-5">{slide.content}</div>
        </div>

        <div className="flex items-center justify-between gap-3 mb-6">
          <button onClick={goPrev} disabled={currentSlide===0}
            className={isDark ? "flex-1 py-2.5 rounded-lg border border-border text-sm font-semibold font-display text-white/70 hover:text-white hover:border-primary/60 hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer" : "flex-1 py-2.5 rounded-lg border border-border text-sm font-semibold font-display text-slate-600 hover:text-slate-800 hover:border-primary/60 hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"}>
            {t.prev}
          </button>
          <button onClick={goNext} disabled={currentSlide===total-1}
            className="flex-1 py-2.5 rounded-lg border border-primary/60 bg-primary/15 text-sm font-semibold font-display text-primary hover:bg-primary/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer">
            {t.next}
          </button>
        </div>

        <div className="mt-2 text-center">
          <button onClick={()=>{ playPopSound(); navigate("/materi-matematika/kelas-8/bangun-ruang-sisi-datar"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LimasPage;
