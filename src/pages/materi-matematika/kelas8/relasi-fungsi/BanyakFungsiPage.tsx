import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers, Hash, RotateCcw, Trophy, XCircle, CheckCircle2, ArrowLeftRight } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ══════════════════════════════════════════════════════
   DIAGRAM PANAH INTERAKTIF — komponen tertanam
══════════════════════════════════════════════════════ */
type Mode = "AtoB" | "BtoA";
type Mapping = Record<string, string>;

const ALL_DOM_LABELS  = ["1","2","3","4","5"];
const ALL_COD_LABELS  = ["a","b","c","d","e"];
const SVG_W = 300;
const DOM_X = 68;
const COD_X = 232;
const NODE_R = 22;

function svgH(dLen: number, cLen: number) { return Math.max(dLen, cLen) * 65 + 40; }

function nodePos(idx: number, total: number, x: number, h: number) {
  const sp = (h - 40) / (total + 1);
  return { x, y: 20 + sp * (idx + 1) };
}

function bezierPath(
  from: { x: number; y: number },
  to: { x: number; y: number },
  rFrom = NODE_R, rTo = NODE_R
) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const back  = Math.atan2(from.y - to.y, from.x - to.x);
  const sx = from.x + rFrom * Math.cos(angle);
  const sy = from.y + rFrom * Math.sin(angle);
  const ex = to.x + rTo * Math.cos(back);
  const ey = to.y + rTo * Math.sin(back);
  const cpx = (sx + ex) / 2;
  return `M ${sx} ${sy} C ${cpx} ${sy} ${cpx} ${ey} ${ex} ${ey}`;
}

function mappingsEqual(a: Mapping, b: Mapping) {
  const keys = Object.keys(a).sort();
  return keys.length === Object.keys(b).length && keys.every(k => a[k] === b[k]);
}

function getSVGCoords(e: React.MouseEvent | React.TouchEvent, svg: SVGSVGElement, h: number) {
  const rect = svg.getBoundingClientRect();
  const sx = SVG_W / rect.width, sy = h / rect.height;
  if ("touches" in e) {
    const t = (e as React.TouchEvent).touches[0] || (e as React.TouchEvent).changedTouches[0];
    return { x: (t.clientX - rect.left) * sx, y: (t.clientY - rect.top) * sy };
  }
  const m = e as React.MouseEvent;
  return { x: (m.clientX - rect.left) * sx, y: (m.clientY - rect.top) * sy };
}

const SUPERSCRIPTS = ["⁰","¹","²","³","⁴","⁵"];

const MiniDiag: React.FC<{ mapping: Mapping; domain: string[]; codomain: string[]; idx: number }> = ({ mapping, domain, codomain, idx }) => {
  const W = 110, H = 100, dx = 26, cx = 84, r = 10;
  const mPos = (i: number, tot: number, x: number) => ({ x, y: 10 + ((H - 20) / (tot + 1)) * (i + 1) });
  const mPath = (f: {x:number;y:number}, t: {x:number;y:number}) => {
    const cpx = (f.x + t.x) / 2;
    return `M ${f.x + r} ${f.y} C ${cpx} ${f.y} ${cpx} ${t.y} ${t.x - r} ${t.y}`;
  };
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[9px] text-white/30 font-mono">#{idx + 1}</span>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="rounded-lg bg-slate-900/70 border border-white/10">
        <defs>
          <marker id={`m${idx}`} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" fill="#c084fc" />
          </marker>
        </defs>
        {domain.map((el, i) => { const p = mPos(i, domain.length, dx); return (
          <g key={el}>
            <circle cx={p.x} cy={p.y} r={r} fill="#0e4f6e" stroke="#22d3ee" strokeWidth={1} />
            <text x={p.x} y={p.y+1} textAnchor="middle" dominantBaseline="middle" fill="#e0f2fe" fontSize={8} fontWeight="bold" fontFamily="monospace">{el}</text>
          </g>
        ); })}
        {codomain.map((el, i) => { const p = mPos(i, codomain.length, cx); return (
          <g key={el}>
            <circle cx={p.x} cy={p.y} r={r} fill="#3b1f7a" stroke="#a78bfa" strokeWidth={1} />
            <text x={p.x} y={p.y+1} textAnchor="middle" dominantBaseline="middle" fill="#ede9fe" fontSize={8} fontWeight="bold" fontFamily="monospace">{el}</text>
          </g>
        ); })}
        {domain.map((el, i) => {
          const target = mapping[el]; if (!target) return null;
          const ti = codomain.indexOf(target);
          return <path key={el} d={mPath(mPos(i, domain.length, dx), mPos(ti, codomain.length, cx))} fill="none" stroke="#c084fc" strokeWidth={1.5} markerEnd={`url(#m${idx})`} />;
        })}
      </svg>
      <div className="text-[8px] text-white/25 font-mono text-center">{domain.map(el => `${el}→${mapping[el]??'?'}`).join(', ')}</div>
    </div>
  );
};

const SizeButtons: React.FC<{ label: string; value: number; color: string; onChange: (n: number) => void }> = ({ label, value, color, onChange }) => (
  <div className="flex items-center gap-1.5 flex-wrap">
    <span className={`text-[10px] font-bold font-mono w-10 shrink-0 ${color}`}>{label}</span>
    {[1,2,3,4,5].map(n => (
      <button key={n} onClick={() => onChange(n)}
        className={`w-7 h-7 rounded-lg text-[12px] font-bold font-mono transition-all active:scale-95 border ${
          value === n
            ? "bg-fuchsia-600/80 border-fuchsia-400/70 text-white ring-1 ring-fuchsia-400"
            : "bg-slate-700/50 border-white/10 text-white/40 hover:bg-slate-600/60 hover:text-white/80"
        }`}>
        {n}
      </button>
    ))}
    <span className="text-[10px] text-white/30 font-mono">anggota</span>
  </div>
);

const DiagramInteraktifBanyakFungsi: React.FC = () => {
  const [domainSize, setDomainSize]     = useState(2);
  const [codomainSize, setCodomainSize] = useState(3);
  const [mode, setMode]   = useState<Mode>("AtoB");
  const [cur, setCur]     = useState<Mapping>({});
  const [listAB, setListAB] = useState<Mapping[]>([]);
  const [listBA, setListBA] = useState<Mapping[]>([]);
  const [drag, setDrag]   = useState<{ from: string } | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [msg, setMsg]     = useState<{ t: string; ok: boolean } | null>(null);
  const [done, setDone]   = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const baseA = ALL_DOM_LABELS.slice(0, domainSize);
  const baseB = ALL_COD_LABELS.slice(0, codomainSize);

  const domain   = mode === "AtoB" ? baseA : baseB;
  const codomain = mode === "AtoB" ? baseB : baseA;
  const nDom = domain.length;
  const nCod = codomain.length;
  const maxF = Math.pow(nCod, nDom);
  const list    = mode === "AtoB" ? listAB : listBA;
  const setList = mode === "AtoB" ? setListAB : setListBA;
  const H = svgH(nDom, nCod);

  const domPos = Object.fromEntries(domain.map((el, i) => [el, nodePos(i, nDom, DOM_X, H)]));
  const codPos = Object.fromEntries(codomain.map((el, i) => [el, nodePos(i, nCod, COD_X, H)]));

  const isComplete = domain.every(el => cur[el] !== undefined);
  const isDup = isComplete && list.some(d => mappingsEqual(d, cur));

  const resetAll = () => { setCur({}); setListAB([]); setListBA([]); setDone(false); setMsg(null); };

  const changeDomainSize   = (n: number) => { setDomainSize(n);   resetAll(); };
  const changeCodomainSize = (n: number) => { setCodomainSize(n); resetAll(); };

  useEffect(() => { if (!msg) return; const t = setTimeout(() => setMsg(null), 2500); return () => clearTimeout(t); }, [msg]);

  const findCod = useCallback((x: number, y: number) => {
    for (const el of codomain) { if (Math.hypot(x - codPos[el].x, y - codPos[el].y) < NODE_R + 8) return el; }
    return null;
  }, [codomain, codPos]);

  const startDrag = useCallback((el: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDrag({ from: el });
    if (svgRef.current) setMouse(getSVGCoords(e, svgRef.current, H));
  }, [H]);

  const onMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!drag || !svgRef.current) return;
    e.preventDefault();
    setMouse(getSVGCoords(e, svgRef.current, H));
  }, [drag, H]);

  const onUp = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!drag || !svgRef.current) return;
    const pos = getSVGCoords(e, svgRef.current, H);
    const target = findCod(pos.x, pos.y);
    if (target) { playPopSound(); setCur(p => ({ ...p, [drag.from]: target })); }
    setDrag(null);
  }, [drag, findCod, H]);

  const removeArrow = (el: string) => { playPopSound(); setCur(p => { const n = { ...p }; delete n[el]; return n; }); };

  const addFn = () => {
    if (!isComplete) { setMsg({ t: "Belum semua elemen domain dipasangkan!", ok: false }); return; }
    if (isDup)       { setMsg({ t: "Fungsi ini sudah ada! Coba kombinasi lain.", ok: false }); return; }
    playPopSound();
    const next = [...list, { ...cur }];
    (setList as React.Dispatch<React.SetStateAction<Mapping[]>>)(next);
    setCur({});
    if (next.length === maxF) { setDone(true); setMsg({ t: `🎉 Semua ${maxF} fungsi ditemukan!`, ok: true }); }
    else setMsg({ t: `✅ Fungsi ke-${next.length} disimpan!`, ok: true });
  };

  const dragFromPos = drag ? domPos[drag.from] : null;
  const showPlaceholders = maxF <= 30;

  const domLabel = mode === "AtoB" ? "A" : "B";
  const codLabel = mode === "AtoB" ? "B" : "A";
  const nDomSize = mode === "AtoB" ? domainSize : codomainSize;
  const nCodSize = mode === "AtoB" ? codomainSize : domainSize;

  return (
    <div className="bg-fuchsia-900/20 border border-fuchsia-500/30 rounded-xl p-4 space-y-3">

      {/* ── Judul + Ganti Mode ── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="font-body text-sm font-bold text-fuchsia-300">🎮 Buktikan Sendiri — Seret Panah!</p>
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${mode==="AtoB"?"bg-cyan-700/60 text-cyan-200 ring-1 ring-cyan-400":"text-white/30"}`}>A→B</span>
          <button onClick={() => { playPopSound(); setMode(m => m==="AtoB"?"BtoA":"AtoB"); setCur({}); setDone(false); setMsg(null); }}
            className="flex items-center gap-1 bg-slate-700/60 hover:bg-slate-600/70 border border-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-full transition-all active:scale-95">
            <ArrowLeftRight className="w-3 h-3" /> Ganti Mode
          </button>
          <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${mode==="BtoA"?"bg-violet-700/60 text-violet-200 ring-1 ring-violet-400":"text-white/30"}`}>B→A</span>
        </div>
      </div>

      {/* ── Kontrol Ukuran Himpunan ── */}
      <div className="bg-slate-800/60 border border-white/10 rounded-xl p-3 space-y-2">
        <p className="text-[10px] text-fuchsia-300/70 font-bold font-body mb-1">⚙️ Atur ukuran himpunan:</p>
        <SizeButtons label="n(A)" value={domainSize}   color="text-cyan-400"   onChange={changeDomainSize} />
        <SizeButtons label="n(B)" value={codomainSize} color="text-violet-400" onChange={changeCodomainSize} />
        <div className="pt-2 border-t border-white/5 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-white/40 font-body">Banyak fungsi {domLabel}→{codLabel} =</span>
          <span className="text-[11px] font-mono text-white/50">n({codLabel})^n({domLabel}) =</span>
          <span className="text-[13px] font-bold font-mono text-yellow-300">
            {nCodSize}{SUPERSCRIPTS[nDomSize] ?? `^${nDomSize}`} = {maxF}
          </span>
          {maxF > 100 && <span className="text-[9px] text-orange-400/70 font-body">(banyak sekali!)</span>}
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full transition-all duration-500"
            style={{ width: `${maxF > 0 ? (list.length / maxF) * 100 : 0}%` }} />
        </div>
        <span className="text-[11px] text-white/50 font-mono shrink-0">{list.length}/{maxF} fungsi</span>
        {done && <span className="text-[11px] text-green-400 font-bold animate-pulse">🎉 Lengkap!</span>}
      </div>

      {/* ── SVG Diagram ── */}
      <div className="flex justify-center">
        <div className="bg-slate-900/60 rounded-xl border border-white/10 p-2 select-none w-full" style={{ maxWidth: SVG_W + 16 }}>
          <div className="flex justify-between px-4 mb-1 text-[10px] font-bold font-mono">
            <span className="text-cyan-400">Domain ({domLabel})</span>
            <span className="text-violet-400">Kodomain ({codLabel})</span>
          </div>
          <svg ref={svgRef} viewBox={`0 0 ${SVG_W} ${H}`} width="100%"
            style={{ cursor: drag ? "crosshair" : "default", touchAction: "none" }}
            onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={() => setDrag(null)}
            onTouchMove={onMove} onTouchEnd={onUp}>
            <defs>
              <marker id="ah2" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6 Z" fill="#f0abfc" />
              </marker>
              <marker id="ahd2" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6 Z" fill="#fbbf24" />
              </marker>
            </defs>
            <line x1={SVG_W/2} y1={8} x2={SVG_W/2} y2={H-8} stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="4 3" />

            {domain.map(el => {
              const target = cur[el]; if (!target) return null;
              return <path key={el} d={bezierPath(domPos[el], codPos[target])} fill="none" stroke="#f0abfc" strokeWidth={2.5} markerEnd="url(#ah2)" />;
            })}

            {drag && dragFromPos && (
              <path d={bezierPath(dragFromPos, mouse, NODE_R, 0)} fill="none" stroke="#fbbf24" strokeWidth={2} strokeDasharray="6 3" markerEnd="url(#ahd2)" />
            )}

            {codomain.map((el) => {
              const p = codPos[el];
              const hover = drag !== null && Math.hypot(mouse.x - p.x, mouse.y - p.y) < NODE_R + 10;
              return (
                <g key={el}>
                  <circle cx={p.x} cy={p.y} r={NODE_R} fill={hover?"#5b21b6":"#3b1f7a"} stroke={hover?"#c4b5fd":"#a78bfa"} strokeWidth={hover?2.5:1.5} />
                  <text x={p.x} y={p.y+1} textAnchor="middle" dominantBaseline="middle" fill="#ede9fe" fontSize={13} fontWeight="bold" fontFamily="monospace">{el}</text>
                </g>
              );
            })}

            {domain.map(el => {
              const p = domPos[el];
              const hasArr = cur[el] !== undefined;
              const isDragging = drag?.from === el;
              return (
                <g key={el} style={{ cursor: "grab" }}
                  onMouseDown={e => startDrag(el, e)} onTouchStart={e => startDrag(el, e)}
                  onDoubleClick={() => hasArr && removeArrow(el)}>
                  <circle cx={p.x} cy={p.y} r={NODE_R} fill={isDragging?"#164e63":hasArr?"#0c4a6e":"#0e4f6e"} stroke={isDragging?"#fbbf24":hasArr?"#67e8f9":"#22d3ee"} strokeWidth={isDragging?2.5:1.5} />
                  <text x={p.x} y={p.y+1} textAnchor="middle" dominantBaseline="middle" fill="#e0f2fe" fontSize={13} fontWeight="bold" fontFamily="monospace">{el}</text>
                  {hasArr && <circle cx={p.x+15} cy={p.y-15} r={7} fill="#10b981" stroke="#6ee7b7" strokeWidth={1} />}
                  {hasArr && <text x={p.x+15} y={p.y-14} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={8} fontWeight="bold">✓</text>}
                </g>
              );
            })}
          </svg>
          <p className="text-center text-[10px] text-white/25 mt-1">👆 Seret dari kiri ke kanan · Double-tap untuk hapus panah</p>
        </div>
      </div>

      {/* ── Status ── */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-body ${isComplete&&!isDup?"bg-green-900/30 border border-green-500/30 text-green-300":isDup?"bg-orange-900/30 border border-orange-500/30 text-orange-300":"bg-slate-800/50 border border-white/10 text-white/40"}`}>
        {isComplete && !isDup && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
        {isDup && <XCircle className="w-3.5 h-3.5 shrink-0" />}
        {!isComplete && <div className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" />}
        {isComplete && !isDup
          ? "✅ Fungsi valid! Setiap elemen domain punya tepat satu pasangan."
          : isDup
          ? "⚠️ Fungsi ini sudah ada! Coba kombinasi lain."
          : `Hubungkan ${domain.filter(el => !cur[el]).length} elemen domain yang tersisa.`}
      </div>

      {msg && <div className={`text-center text-xs font-bold py-1.5 px-3 rounded-lg ${msg.ok?"bg-green-900/40 text-green-300 border border-green-500/30":"bg-red-900/40 text-red-300 border border-red-500/30"}`}>{msg.t}</div>}

      {/* ── Tombol Aksi ── */}
      <div className="flex gap-2">
        <button onClick={() => { playPopSound(); setCur({}); }}
          className="flex items-center gap-1 bg-slate-700/50 hover:bg-slate-600/60 border border-white/15 text-white/60 text-xs font-bold px-3 py-2 rounded-lg transition-all active:scale-95">
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
        <button onClick={() => { playPopSound(); resetAll(); }}
          className="flex items-center gap-1 bg-slate-700/50 hover:bg-red-900/40 border border-white/15 hover:border-red-500/40 text-white/60 hover:text-red-300 text-xs font-bold px-3 py-2 rounded-lg transition-all active:scale-95">
          <RotateCcw className="w-3 h-3" /> Reset Semua
        </button>
        <button onClick={addFn} disabled={!isComplete || isDup}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg border transition-all active:scale-95 ${isComplete&&!isDup?"bg-fuchsia-600/80 hover:bg-fuchsia-500/90 border-fuchsia-400/60 text-white cursor-pointer":"bg-slate-800/40 border-white/10 text-white/20 cursor-not-allowed"}`}>
          <Trophy className="w-3.5 h-3.5" /> Simpan ke Koleksi
        </button>
      </div>

      {/* ── Galeri Mini-Diagram ── */}
      {list.length > 0 && (
        <div>
          <p className="text-[11px] font-bold text-yellow-300 mb-2 flex items-center gap-1">
            <Trophy className="w-3 h-3" /> Fungsi {domLabel}→{codLabel} yang ditemukan ({list.length}/{maxF}):
          </p>
          <div className="flex flex-wrap gap-2">
            {list.map((m, i) => <MiniDiag key={i} mapping={m} domain={domain} codomain={codomain} idx={i} />)}
            {showPlaceholders && Array.from({ length: maxF - list.length }).map((_, i) => (
              <div key={i} className="w-[110px] h-[100px] rounded-lg border border-dashed border-white/10 bg-slate-900/30 flex items-center justify-center">
                <span className="text-white/10 text-lg">?</span>
              </div>
            ))}
            {!showPlaceholders && list.length < maxF && (
              <div className="text-[10px] text-white/30 font-mono self-center px-2">
                … masih {maxF - list.length} lagi
              </div>
            )}
          </div>
          {done && (
            <div className="mt-3 bg-green-900/30 border border-green-500/30 rounded-lg p-3 text-center">
              <p className="text-green-300 font-bold text-xs">
                🎉 Terbukti! Banyak fungsi {domLabel}→{codLabel} = {nCodSize}{SUPERSCRIPTS[nDomSize] ?? `^${nDomSize}`} = {maxF}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   DIAGRAM INTERAKTIF BIJEKSI — komponen tertanam
══════════════════════════════════════════════════════ */
function factorial(x: number): number { return x <= 1 ? 1 : x * factorial(x - 1); }

const DiagramInteraktifBijeksi: React.FC = () => {
  const [n, setN]       = useState(2);
  const [cur, setCur]   = useState<Mapping>({});
  const [list, setList] = useState<Mapping[]>([]);
  const [drag, setDrag] = useState<{ from: string } | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [msg, setMsg]   = useState<{ t: string; ok: boolean } | null>(null);
  const [done, setDone] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const domain   = ALL_DOM_LABELS.slice(0, n);
  const codomain = ALL_COD_LABELS.slice(0, n);
  const maxF = factorial(n);
  const H = svgH(n, n);

  const domPos = Object.fromEntries(domain.map((el, i)   => [el, nodePos(i, n, DOM_X, H)]));
  const codPos = Object.fromEntries(codomain.map((el, i) => [el, nodePos(i, n, COD_X, H)]));

  const usedTargets  = Object.values(cur);
  const isComplete   = domain.every(el => cur[el] !== undefined);
  const isInjective  = new Set(usedTargets).size === usedTargets.length;
  const isBijective  = isComplete && isInjective;
  const isDup        = isBijective && list.some(d => mappingsEqual(d, cur));

  const resetAll  = () => { setCur({}); setList([]); setDone(false); setMsg(null); };
  const changeN   = (v: number) => { setN(v); resetAll(); };

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 2500);
    return () => clearTimeout(t);
  }, [msg]);

  const findCod = useCallback((x: number, y: number) => {
    for (const el of codomain) { if (Math.hypot(x - codPos[el].x, y - codPos[el].y) < NODE_R + 8) return el; }
    return null;
  }, [codomain, codPos]);

  const startDrag = useCallback((el: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); setDrag({ from: el });
    if (svgRef.current) setMouse(getSVGCoords(e, svgRef.current, H));
  }, [H]);

  const onMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!drag || !svgRef.current) return;
    e.preventDefault(); setMouse(getSVGCoords(e, svgRef.current, H));
  }, [drag, H]);

  const onUp = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!drag || !svgRef.current) return;
    const pos = getSVGCoords(e, svgRef.current, H);
    const target = findCod(pos.x, pos.y);
    if (target) { playPopSound(); setCur(p => ({ ...p, [drag.from]: target })); }
    setDrag(null);
  }, [drag, findCod, H]);

  const removeArrow = (el: string) => {
    playPopSound();
    setCur(p => { const n2 = { ...p }; delete n2[el]; return n2; });
  };

  const addBijection = () => {
    if (!isComplete)  { setMsg({ t: "Belum semua elemen domain dipasangkan!", ok: false }); return; }
    if (!isInjective) { setMsg({ t: "Bukan bijeksi! Ada dua elemen menuju target yang sama.", ok: false }); return; }
    if (isDup)        { setMsg({ t: "Korespondensi ini sudah ada! Coba kombinasi lain.", ok: false }); return; }
    playPopSound();
    const next = [...list, { ...cur }];
    setList(next); setCur({});
    if (next.length === maxF) { setDone(true); setMsg({ t: `🎉 Semua ${maxF} korespondensi ditemukan!`, ok: true }); }
    else setMsg({ t: `✅ Korespondensi ke-${next.length} disimpan!`, ok: true });
  };

  const dragFromPos = drag ? domPos[drag.from] : null;

  const dupStatusMsg = (() => {
    if (!isComplete || isInjective) return null;
    const seen: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(cur)) { (seen[v] = seen[v] ?? []).push(k); }
    const dup = Object.entries(seen).find(([, ks]) => ks.length > 1);
    return dup ? `${dup[1].join(" & ")} → "${dup[0]}" sama` : null;
  })();

  return (
    <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="font-body text-sm font-bold text-green-300">🎮 Buktikan Sendiri — Seret Panah Bijeksi!</p>
        <span className="text-[11px] font-mono bg-green-800/40 text-green-200 px-2 py-0.5 rounded border border-green-500/30">
          {n}! = {maxF} korespondensi
        </span>
      </div>

      {/* Size selector */}
      <div className="bg-slate-800/60 border border-white/10 rounded-xl p-3 space-y-2">
        <p className="text-[10px] text-green-300/70 font-bold font-body mb-1">⚙️ Pilih ukuran n(A) = n(B):</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold font-mono w-8 shrink-0 text-green-400">n =</span>
          {[1, 2, 3, 4, 5].map(v => (
            <button key={v} onClick={() => changeN(v)}
              className={`w-7 h-7 rounded-lg text-[12px] font-bold font-mono transition-all active:scale-95 border ${
                n === v
                  ? "bg-green-600/80 border-green-400/70 text-white ring-1 ring-green-400"
                  : "bg-slate-700/50 border-white/10 text-white/40 hover:bg-slate-600/60 hover:text-white/80"
              }`}>{v}</button>
          ))}
          <span className="text-[10px] text-white/30 font-mono">anggota</span>
        </div>
        <div className="pt-2 border-t border-white/5 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-white/40 font-body">Banyak korespondensi =</span>
          <span className="text-[11px] font-mono text-white/50">n! =</span>
          <span className="text-[13px] font-bold font-mono text-yellow-300">
            {n}! = {maxF}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${maxF > 0 ? (list.length / maxF) * 100 : 0}%` }} />
        </div>
        <span className="text-[11px] text-white/50 font-mono shrink-0">{list.length}/{maxF}</span>
        {done && <span className="text-[11px] text-green-400 font-bold animate-pulse">🎉 Lengkap!</span>}
      </div>

      {/* SVG Diagram */}
      <div className="flex justify-center">
        <div className="bg-slate-900/60 rounded-xl border border-white/10 p-2 select-none w-full" style={{ maxWidth: SVG_W + 16 }}>
          <div className="flex justify-between px-4 mb-1 text-[10px] font-bold font-mono">
            <span className="text-cyan-400">Domain (A)</span>
            <span className="text-violet-400">Kodomain (B)</span>
          </div>
          <svg ref={svgRef} viewBox={`0 0 ${SVG_W} ${H}`} width="100%"
            style={{ cursor: drag ? "crosshair" : "default", touchAction: "none" }}
            onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={() => setDrag(null)}
            onTouchMove={onMove} onTouchEnd={onUp}>
            <defs>
              <marker id="ah-bij"     markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#6ee7b7" /></marker>
              <marker id="ah-bij-dup" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#f87171" /></marker>
              <marker id="ahd-bij"    markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#fbbf24" /></marker>
            </defs>
            <line x1={SVG_W/2} y1={8} x2={SVG_W/2} y2={H-8} stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="4 3" />

            {/* Existing arrows */}
            {domain.map(el => {
              const tgt = cur[el]; if (!tgt) return null;
              const isDupArrow = usedTargets.filter(t => t === tgt).length > 1;
              return <path key={el} d={bezierPath(domPos[el], codPos[tgt])} fill="none"
                stroke={isDupArrow ? "#f87171" : "#6ee7b7"} strokeWidth={2.5}
                markerEnd={isDupArrow ? "url(#ah-bij-dup)" : "url(#ah-bij)"} />;
            })}

            {/* Dragging arrow */}
            {drag && dragFromPos && (
              <path d={bezierPath(dragFromPos, mouse, NODE_R, 0)} fill="none" stroke="#fbbf24" strokeWidth={2} strokeDasharray="6 3" markerEnd="url(#ahd-bij)" />
            )}

            {/* Codomain nodes */}
            {codomain.map(el => {
              const p = codPos[el];
              const hover    = drag !== null && Math.hypot(mouse.x - p.x, mouse.y - p.y) < NODE_R + 10;
              const isDupTgt = usedTargets.filter(t => t === el).length > 1;
              const isHit    = usedTargets.includes(el);
              return (
                <g key={el}>
                  <circle cx={p.x} cy={p.y} r={NODE_R}
                    fill={hover ? "#5b21b6" : isDupTgt ? "#7f1d1d" : "#3b1f7a"}
                    stroke={hover ? "#c4b5fd" : isDupTgt ? "#f87171" : isHit ? "#6ee7b7" : "#a78bfa"}
                    strokeWidth={hover || isDupTgt ? 2.5 : 1.5} />
                  <text x={p.x} y={p.y+1} textAnchor="middle" dominantBaseline="middle" fill="#ede9fe" fontSize={13} fontWeight="bold" fontFamily="monospace">{el}</text>
                  {isDupTgt && <text x={p.x} y={p.y+17} textAnchor="middle" fill="#f87171" fontSize={8} fontWeight="bold">×2!</text>}
                </g>
              );
            })}

            {/* Domain nodes */}
            {domain.map(el => {
              const p = domPos[el];
              const hasArr    = cur[el] !== undefined;
              const isDragging = drag?.from === el;
              const isDupArrow = hasArr && usedTargets.filter(t => t === cur[el]).length > 1;
              return (
                <g key={el} style={{ cursor: "grab" }}
                  onMouseDown={e => startDrag(el, e)} onTouchStart={e => startDrag(el, e)}
                  onDoubleClick={() => hasArr && removeArrow(el)}>
                  <circle cx={p.x} cy={p.y} r={NODE_R}
                    fill={isDragging ? "#164e63" : hasArr ? "#0c4a6e" : "#0e4f6e"}
                    stroke={isDragging ? "#fbbf24" : isDupArrow ? "#f87171" : hasArr ? "#6ee7b7" : "#22d3ee"}
                    strokeWidth={isDragging ? 2.5 : 1.5} />
                  <text x={p.x} y={p.y+1} textAnchor="middle" dominantBaseline="middle" fill="#e0f2fe" fontSize={13} fontWeight="bold" fontFamily="monospace">{el}</text>
                  {hasArr && (
                    <>
                      <circle cx={p.x+15} cy={p.y-15} r={7} fill={isDupArrow ? "#dc2626" : "#10b981"} stroke={isDupArrow ? "#f87171" : "#6ee7b7"} strokeWidth={1} />
                      <text x={p.x+15} y={p.y-14} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={8} fontWeight="bold">{isDupArrow ? "!" : "✓"}</text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
          <p className="text-center text-[10px] text-white/25 mt-1">👆 Seret dari kiri ke kanan · Double-tap untuk hapus panah</p>
        </div>
      </div>

      {/* Status */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-body ${
        isBijective && !isDup ? "bg-green-900/30 border border-green-500/30 text-green-300"
        : isComplete && !isInjective ? "bg-red-900/30 border border-red-500/30 text-red-300"
        : isDup ? "bg-orange-900/30 border border-orange-500/30 text-orange-300"
        : "bg-slate-800/50 border border-white/10 text-white/40"
      }`}>
        {isBijective && !isDup  && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
        {(isComplete && !isInjective || isDup) && <XCircle className="w-3.5 h-3.5 shrink-0" />}
        {!isComplete && !isDup  && <div className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" />}
        {isBijective && !isDup
          ? "✅ Bijeksi valid! Setiap elemen berpasangan tepat satu-satu."
          : isComplete && !isInjective
          ? `❌ Bukan bijeksi! ${dupStatusMsg ?? "Ada target yang dipakai dua kali."}`
          : isDup
          ? "⚠️ Korespondensi ini sudah ada! Coba kombinasi lain."
          : `Hubungkan ${domain.filter(el => !cur[el]).length} elemen domain yang tersisa.`}
      </div>

      {msg && (
        <div className={`text-center text-xs font-bold py-1.5 px-3 rounded-lg ${msg.ok ? "bg-green-900/40 text-green-300 border border-green-500/30" : "bg-red-900/40 text-red-300 border border-red-500/30"}`}>
          {msg.t}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button onClick={() => { playPopSound(); setCur({}); }}
          className="flex items-center gap-1 bg-slate-700/50 hover:bg-slate-600/60 border border-white/15 text-white/60 text-xs font-bold px-3 py-2 rounded-lg transition-all active:scale-95">
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
        <button onClick={() => { playPopSound(); resetAll(); }}
          className="flex items-center gap-1 bg-slate-700/50 hover:bg-red-900/40 border border-white/15 hover:border-red-500/40 text-white/60 hover:text-red-300 text-xs font-bold px-3 py-2 rounded-lg transition-all active:scale-95">
          <RotateCcw className="w-3 h-3" /> Reset Semua
        </button>
        <button onClick={addBijection} disabled={!isBijective || isDup}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg border transition-all active:scale-95 ${
            isBijective && !isDup
              ? "bg-green-600/80 hover:bg-green-500/90 border-green-400/60 text-white cursor-pointer"
              : "bg-slate-800/40 border-white/10 text-white/20 cursor-not-allowed"
          }`}>
          <Trophy className="w-3.5 h-3.5" /> Simpan ke Koleksi
        </button>
      </div>

      {/* Gallery */}
      {list.length > 0 && (
        <div>
          <p className="text-[11px] font-bold text-yellow-300 mb-2 flex items-center gap-1">
            <Trophy className="w-3 h-3" /> Korespondensi yang ditemukan ({list.length}/{maxF}):
          </p>
          <div className="flex flex-wrap gap-2">
            {list.map((m, i) => <MiniDiag key={i} mapping={m} domain={domain} codomain={codomain} idx={i} />)}
            {Array.from({ length: maxF - list.length }).map((_, i) => (
              <div key={i} className="w-[110px] h-[100px] rounded-lg border border-dashed border-white/10 bg-slate-900/30 flex items-center justify-center">
                <span className="text-white/10 text-lg">?</span>
              </div>
            ))}
          </div>
          {done && (
            <div className="mt-3 bg-green-900/30 border border-green-500/30 rounded-lg p-3 text-center">
              <p className="text-green-300 font-bold text-xs">
                🎉 Terbukti! Banyak korespondensi satu-satu = {n}! = {maxF}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const BanyakFungsiPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "rumus", "korespondensi", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const SectionHeader = ({ id, icon, iconColor, title }: {
    id: string; icon: React.ReactNode; iconColor?: string; title: string;
  }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      <ChevronUp className="w-5 h-5 text-primary" />
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <Hash className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          MENENTUKAN BANYAK FUNGSI & KORESPONDENSI SATU-SATU
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Hitung Berapa Fungsi yang Bisa Dibentuk!
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Relasi dan Fungsi · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Berapa Banyak Fungsi yang Bisa Dibuat?" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Diberikan dua himpunan, berapa banyak fungsi yang bisa kita buat dari satu himpunan ke himpunan lain? Pertanyaan ini punya jawaban matematika yang elegan dan bisa dihitung dengan rumus sederhana!
                </p>
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">🔢 Ide Dasar</p>
                  <p className="font-body text-sm text-white/70 leading-relaxed">
                    Jika <InlineMath math="A = \{1, 2\}" /> dan <InlineMath math="B = \{a, b, c\}" />, maka setiap anggota A bisa dipasangkan ke salah satu dari 3 pilihan di B.
                    Karena ada 2 anggota di A, maka total fungsi = <InlineMath math="3 \times 3 = 3^2 = 9" /> fungsi.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RUMUS BANYAK FUNGSI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rumus" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title="📘 Rumus Menentukan Banyak Fungsi" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Jika <InlineMath math="n(A)" /> menyatakan banyak anggota himpunan A dan <InlineMath math="n(B)" /> menyatakan banyak anggota himpunan B, maka banyak fungsi yang dapat dibentuk dari A ke B adalah:
                  </p>
                  <div className="bg-violet-900/40 border border-violet-400/40 rounded-xl p-4 mt-3 text-center">
                    <BlockMath math="\text{Banyak fungsi dari } A \text{ ke } B = n(B)^{n(A)}" />
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-white mb-3">🔎 Mengapa Rumusnya Demikian?</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-700/40 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold text-xs mb-1">Misalkan A = &#123;a₁, a₂, ..., aₘ&#125; dan B = &#123;b₁, b₂, ..., bₙ&#125;</p>
                      <ul className="text-white/70 text-xs space-y-1 list-disc list-inside">
                        <li><InlineMath math="a_1" /> bisa dipasangkan ke salah satu dari <InlineMath math="n" /> pilihan di B</li>
                        <li><InlineMath math="a_2" /> bisa dipasangkan ke salah satu dari <InlineMath math="n" /> pilihan di B</li>
                        <li>... dan seterusnya hingga <InlineMath math="a_m" /></li>
                      </ul>
                      <p className="text-white/70 text-xs mt-2">Total = <InlineMath math="n \times n \times \cdots \times n" /> (sebanyak m kali) <InlineMath math="= n^m" /></p>
                    </div>
                  </div>
                </div>

                {/* ── DIAGRAM PANAH INTERAKTIF ── */}
                <DiagramInteraktifBanyakFungsi />

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-cyan-900/40">
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">n(A)</th>
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">n(B)</th>
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">Banyak Fungsi A→B</th>
                        <th className="border border-cyan-500/30 px-3 py-2 text-cyan-200 text-left">Banyak Fungsi B→A</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        [2, 2, "2²=4", "2²=4"],
                        [2, 3, "3²=9", "2³=8"],
                        [3, 2, "2³=8", "3²=9"],
                        [3, 4, "4³=64", "3⁴=81"],
                        [4, 3, "3⁴=81", "4³=64"],
                      ].map(([nA, nB, f1, f2], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-bold text-center">{nA}</td>
                          <td className="border border-white/10 px-3 py-2 text-violet-300 font-bold text-center">{nB}</td>
                          <td className="border border-white/10 px-3 py-2 text-green-300 font-mono text-center">{f1}</td>
                          <td className="border border-white/10 px-3 py-2 text-orange-300 font-mono text-center">{f2}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* KORESPONDENSI SATU-SATU */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="korespondensi" icon={<BookOpen className="w-5 h-5" />} iconColor="text-green-400" title="🔗 Korespondensi Satu-Satu (Bijeksi)" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-cyan-300">Korespondensi satu-satu</strong> (bijeksi) adalah fungsi yang memenuhi dua syarat sekaligus:
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-2 text-sm text-white/80">
                      <span className="text-green-400 shrink-0">1.</span>
                      <p><strong className="text-yellow-300">Injektif (satu-satu):</strong> Setiap anggota kodomain dipasangkan oleh paling banyak satu anggota domain. Tidak ada dua anggota domain yang punya pasangan sama.</p>
                    </div>
                    <div className="flex gap-2 text-sm text-white/80">
                      <span className="text-green-400 shrink-0">2.</span>
                      <p><strong className="text-orange-300">Surjektif (pada):</strong> Setiap anggota kodomain punya pasangan (tidak ada yang "menganggur").</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-white mb-3">📐 Syarat Korespondensi Satu-Satu</p>
                  <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                    <p className="text-sm text-white/80 font-body">Korespondensi satu-satu hanya dapat terjadi jika:</p>
                    <BlockMath math="n(A) = n(B)" />
                    <p className="text-xs text-white/50">Jumlah anggota domain dan kodomain harus sama!</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="font-body text-sm font-bold text-white mb-3">🔢 Rumus Banyak Korespondensi Satu-Satu</p>
                  <div className="bg-violet-900/30 border border-violet-500/30 rounded-lg p-4 text-center">
                    <BlockMath math="\text{Banyak korespondensi satu-satu} = n! = n \times (n-1) \times \cdots \times 2 \times 1" />
                    <p className="text-xs text-white/50 mt-1">di mana n = n(A) = n(B)</p>
                  </div>

                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-violet-900/40">
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200">n(A) = n(B)</th>
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200">n! (Faktorial)</th>
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200">Banyak Korespondensi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          [1, "1! = 1", 1],
                          [2, "2! = 2×1", 2],
                          [3, "3! = 3×2×1", 6],
                          [4, "4! = 4×3×2×1", 24],
                          [5, "5! = 5×4×3×2×1", 120],
                        ].map(([n, faktr, hasil], i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                            <td className="border border-white/10 px-3 py-2 text-cyan-300 font-bold text-center">{n}</td>
                            <td className="border border-white/10 px-3 py-2 text-white/70 text-center">{faktr}</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300 font-bold text-center">{hasil}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Visual korespondensi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-900/20 border border-green-500/40 rounded-xl p-4">
                    <p className="text-xs font-bold text-green-300 text-center mb-2">✅ KORESPONDENSI SATU-SATU</p>
                    <div className="flex gap-3 justify-center items-center">
                      <div className="space-y-1.5 text-center">
                        <p className="text-xs text-cyan-400 font-bold">A</p>
                        {["1", "2", "3"].map(x => <div key={x} className="bg-cyan-800/40 rounded px-3 py-1 text-cyan-200 text-xs font-bold">{x}</div>)}
                      </div>
                      <div className="flex flex-col gap-1.5 pt-5">
                        {["→", "→", "→"].map((a, i) => <span key={i} className="text-green-400 font-bold">{a}</span>)}
                      </div>
                      <div className="space-y-1.5 text-center">
                        <p className="text-xs text-violet-400 font-bold">B</p>
                        {["a", "b", "c"].map(x => <div key={x} className="bg-violet-800/40 rounded px-3 py-1 text-violet-200 text-xs font-bold">{x}</div>)}
                      </div>
                    </div>
                    <p className="text-xs text-white/40 text-center mt-2">n(A)=n(B)=3, tiap elemen berpasangan tepat satu</p>
                  </div>
                  <div className="bg-red-900/20 border border-red-500/40 rounded-xl p-4">
                    <p className="text-xs font-bold text-red-300 text-center mb-2">❌ BUKAN KORESPONDENSI 1-1</p>
                    <div className="flex gap-3 justify-center items-center">
                      <div className="space-y-1.5 text-center">
                        <p className="text-xs text-cyan-400 font-bold">A</p>
                        {["1", "2", "3"].map(x => <div key={x} className="bg-cyan-800/40 rounded px-3 py-1 text-cyan-200 text-xs font-bold">{x}</div>)}
                      </div>
                      <div className="flex flex-col gap-1.5 pt-5">
                        <span className="text-red-400 font-bold">→</span>
                        <span className="text-red-400 font-bold">→</span>
                        <span className="text-red-400 font-bold">→</span>
                      </div>
                      <div className="space-y-1.5 text-center">
                        <p className="text-xs text-violet-400 font-bold">B</p>
                        {["a", "b", "c", "d"].map(x => <div key={x} className="bg-violet-800/40 rounded px-3 py-1 text-violet-200 text-xs font-bold">{x}</div>)}
                      </div>
                    </div>
                    <p className="text-xs text-red-400 text-center mt-2">n(A)≠n(B), elemen d tidak punya pasangan</p>
                  </div>
                </div>

                {/* Animasi Interaktif Bijeksi */}
                <DiagramInteraktifBijeksi />

              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Tingkat Mudah" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Diketahui <InlineMath math="A = \{p, q, r\}" /> dan <InlineMath math="B = \{1, 2, 3, 4\}" />. Tentukan banyaknya fungsi yang dapat dibuat dari A ke B!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Identifikasi:</p>
                      <p className="text-white/70 text-xs"><InlineMath math="n(A) = 3" /> (banyak anggota domain)</p>
                      <p className="text-white/70 text-xs"><InlineMath math="n(B) = 4" /> (banyak pilihan untuk setiap anggota A)</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">Gunakan Rumus:</p>
                      <BlockMath math="\text{Banyak fungsi} = n(B)^{n(A)} = 4^3 = 64" />
                    </div>
                    <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-green-300">✅ Banyak fungsi dari A ke B = <strong>64 fungsi</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Tingkat Sedang" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Diketahui <InlineMath math="P = \{a, b, c, d\}" /> dan <InlineMath math="Q = \{1, 2, 3, 4\}" />.
                    <br />a) Berapa banyak korespondensi satu-satu dari P ke Q?
                    <br />b) Berapa banyak fungsi (bukan hanya korespondensi) dari P ke Q?
                    <br />c) Berapa perbandingan keduanya?
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-1">Identifikasi:</p>
                      <p className="text-white/60 text-xs"><InlineMath math="n(P) = 4" />, <InlineMath math="n(Q) = 4" /> → n(P) = n(Q) = 4, bisa dibuat korespondensi!</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">a) Korespondensi Satu-Satu:</p>
                      <BlockMath math="n! = 4! = 4 \times 3 \times 2 \times 1 = 24" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">b) Semua Fungsi dari P ke Q:</p>
                      <BlockMath math="n(Q)^{n(P)} = 4^4 = 256" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-orange-300 font-semibold mb-1">c) Perbandingan:</p>
                      <BlockMath math="\frac{\text{Korespondensi}}{\text{Total Fungsi}} = \frac{24}{256} = \frac{3}{32}" />
                      <p className="text-white/50 text-xs mt-1">Hanya sekitar 9,4% dari semua fungsi yang merupakan korespondensi satu-satu!</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-yellow-300">✅ Korespondensi = 24, Total Fungsi = 256</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Tingkat Sulit" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85 leading-relaxed">
                    Himpunan <InlineMath math="A" /> mempunyai <InlineMath math="n(A) = m" /> anggota dan himpunan <InlineMath math="B" /> mempunyai <InlineMath math="n(B) = 4" /> anggota. Jika banyaknya fungsi dari A ke B adalah 1024, tentukan:
                    <br />a) Nilai <InlineMath math="m" />
                    <br />b) Apakah mungkin membuat korespondensi satu-satu dari A ke B? Jika ya, berapa banyaknya?
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-3 text-sm font-body">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">a) Mencari nilai m:</p>
                      <p className="text-white/70 text-xs mb-1">Gunakan rumus banyak fungsi:</p>
                      <BlockMath math="n(B)^{n(A)} = 1024" />
                      <BlockMath math="4^m = 1024" />
                      <p className="text-white/70 text-xs mb-1">Ingat bahwa <InlineMath math="1024 = 2^{10}" /> dan <InlineMath math="4 = 2^2" />, maka:</p>
                      <BlockMath math="(2^2)^m = 2^{10} \implies 2^{2m} = 2^{10}" />
                      <BlockMath math="2m = 10 \implies m = 5" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">b) Korespondensi Satu-Satu?</p>
                      <p className="text-white/70 text-xs">n(A) = 5, n(B) = 4</p>
                      <p className="text-white/70 text-xs mt-1">Karena <InlineMath math="n(A) \neq n(B)" /> (5 ≠ 4), maka <strong className="text-red-300">korespondensi satu-satu tidak mungkin dibuat</strong>.</p>
                      <p className="text-white/50 text-xs mt-1">Syarat korespondensi satu-satu adalah n(A) = n(B).</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                      <p className="font-body text-sm font-bold text-red-300">✅ m = 5. Korespondensi satu-satu tidak mungkin karena n(A) ≠ n(B).</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman & Kesimpulan" />
            {true && (
              <div className="px-5 pb-6 space-y-4">

                {/* RANGKUMAN */}
                <p className="font-display text-xs font-bold text-rose-300 uppercase tracking-wider pt-1">📚 Rangkuman Materi</p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { icon: "🔢", label: "Banyak Fungsi A → B", desc: "Rumus: n(B)^n(A) — kodomain dijadikan basis, domain dijadikan pangkat.", color: "from-rose-900/60 to-red-900/60 border-rose-500/40 text-rose-300" },
                    { icon: "🔄", label: "Korespondensi Satu-Satu", desc: "Fungsi di mana setiap anggota A berpasangan unik dengan setiap anggota B (bijektif).", color: "from-pink-900/60 to-fuchsia-900/60 border-pink-500/40 text-pink-300" },
                    { icon: "⚖️", label: "Syarat Korespondensi", desc: "Hanya mungkin jika n(A) = n(B) — jumlah anggota kedua himpunan harus sama.", color: "from-purple-900/60 to-violet-900/60 border-purple-500/40 text-purple-300" },
                    { icon: "🏆", label: "Banyak Korespondensi", desc: "Rumus: n! (n faktorial) di mana n = n(A) = n(B).", color: "from-orange-900/60 to-amber-900/60 border-orange-500/40 text-orange-300" },
                    { icon: "❗", label: "Faktorial", desc: "n! = n × (n−1) × (n−2) × … × 2 × 1. Contoh: 4! = 4×3×2×1 = 24.", color: "from-amber-900/60 to-yellow-900/60 border-amber-500/40 text-amber-300" },
                  ].map(({ icon, label, desc, color }) => (
                    <div key={label} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-3 flex gap-3 items-start`}>
                      <span className="text-xl shrink-0">{icon}</span>
                      <div>
                        <p className="font-display text-xs font-bold mb-0.5">{label}</p>
                        <p className="font-body text-xs text-white/80 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* TIPS & TRIK */}
                <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/40 rounded-xl p-4">
                  <p className="font-display text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">💡 Tips &amp; Trik</p>
                  <div className="space-y-2">
                    {[
                      "Rumus n(B)^n(A): ingat B = tujuan = basis, A = asal = pangkat. Jangan terbalik!",
                      "Korespondensi hanya bisa ada jika n(A) = n(B). Cek dulu sebelum menghitung!",
                      "Trik hitung faktorial: mulai dari n, kalikan mundur sampai 1. Contoh: 5! = 5×4×3×2×1 = 120.",
                    ].map((tip, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-amber-500/30 text-amber-200 flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
                        <p className="font-body text-xs text-amber-100/90 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KESIMPULAN */}
                <div className="bg-gradient-to-r from-rose-900/60 to-pink-900/60 border border-rose-400/40 rounded-xl p-4">
                  <p className="font-display text-xs font-bold text-rose-300 uppercase tracking-wider mb-2">🎯 Kesimpulan</p>
                  <p className="font-body text-sm text-white/90 leading-relaxed">
                    Banyak fungsi = <strong className="text-rose-300">menghitung semua kemungkinan</strong>. Kuasai rumus <strong className="text-orange-300">n(B)^n(A)</strong> untuk fungsi biasa dan <strong className="text-pink-300">n!</strong> untuk korespondensi satu-satu!
                  </p>
                </div>

              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/relasi-dan-fungsi"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Relasi dan Fungsi
          </button>
        </div>
      </div>
    </div>
  );
};

export default BanyakFungsiPage;
