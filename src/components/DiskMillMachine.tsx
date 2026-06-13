import React, { useState, useRef } from "react";
import { playPopSound } from "@/hooks/useAudio";

type Phase = "idle" | "feeding" | "processing" | "done";

const BAHAN = [
  {
    id: "beras", nama: "Beras", icon: "🌾",
    warna: "#e8e2cc", warnaGelap: "#b8aa80", warnaShine: "#fffff0",
    produk: "Tepung Beras", warnaTepung: "#faf9f4",
    produkDesc: "Putih halus, bebas gluten",
    bgFrom: "#3a3020", bgTo: "#5a5030",
  },
  {
    id: "gandum", nama: "Gandum", icon: "🌾",
    warna: "#c8904a", warnaGelap: "#8a5820", warnaShine: "#f0c870",
    produk: "Tepung Terigu", warnaTepung: "#f5f0e4",
    produkDesc: "Putih krem, serbaguna",
    bgFrom: "#3a2510", bgTo: "#5a3818",
  },
  {
    id: "jagung", nama: "Jagung", icon: "🌽",
    warna: "#f0b800", warnaGelap: "#c07800", warnaShine: "#ffe060",
    produk: "Tepung Maizena", warnaTepung: "#fffae0",
    produkDesc: "Putih kekuningan, pengental",
    bgFrom: "#3a3000", bgTo: "#5a4800",
  },
  {
    id: "kedelai", nama: "Kedelai", icon: "🫘",
    warna: "#b89828", warnaGelap: "#806010", warnaShine: "#e8c840",
    produk: "Tepung Kedelai", warnaTepung: "#f0e8c0",
    produkDesc: "Kuning pucat, kaya protein",
    bgFrom: "#302800", bgTo: "#504000",
  },
  {
    id: "singkong", nama: "Singkong", icon: "🥔",
    warna: "#d4b878", warnaGelap: "#8a7040", warnaShine: "#f0dca0",
    produk: "Tepung Tapioka", warnaTepung: "#fafaf6",
    produkDesc: "Putih bersih, transparan kena air",
    bgFrom: "#2a2010", bgTo: "#483518",
  },
];

/* ─── SVG GRAIN DRAWINGS ─── */
function GrainSVG({ id, w, dark, shine, sz = 110 }: { id: string; w: string; dark: string; shine: string; sz?: number }) {
  const gid = `g-${id}`;
  if (id === "beras") {
    const grains = [
      [50,52,18],[38,60,-12],[62,58,22],[47,42,6],[63,43,-25],[36,48,32],[52,70,8],[42,72,-5],[64,68,15],
    ];
    return (
      <svg width={sz} height={sz} viewBox="0 0 110 110">
        <defs>
          <radialGradient id={gid} cx="38%" cy="30%" r="60%">
            <stop offset="0%" stopColor={shine} />
            <stop offset="100%" stopColor={dark} />
          </radialGradient>
        </defs>
        {grains.map(([cx,cy,rot],i) => (
          <g key={i} transform={`rotate(${rot},${cx},${cy})`}>
            <ellipse cx={cx} cy={cy} rx={6.5} ry={14} fill={`url(#${gid})`} stroke={dark} strokeWidth="0.6"/>
            <line x1={cx} y1={cy-12} x2={cx} y2={cy+12} stroke={dark} strokeWidth="0.5" opacity="0.3"/>
          </g>
        ))}
      </svg>
    );
  }
  if (id === "gandum") {
    const grains = [
      [50,54,12],[37,62,-15],[63,60,28],[45,43,3],[65,45,-22],[34,50,35],[53,72,5],[67,72,-10],
    ];
    return (
      <svg width={sz} height={sz} viewBox="0 0 110 110">
        <defs>
          <radialGradient id={gid} cx="35%" cy="28%" r="65%">
            <stop offset="0%" stopColor={shine}/>
            <stop offset="100%" stopColor={dark}/>
          </radialGradient>
        </defs>
        {grains.map(([cx,cy,rot],i) => (
          <g key={i} transform={`rotate(${rot},${cx},${cy})`}>
            <ellipse cx={cx} cy={cy} rx={7} ry={14.5} fill={`url(#${gid})`} stroke={dark} strokeWidth="0.7"/>
            <line x1={cx} y1={cy-13} x2={cx} y2={cy+13} stroke={dark} strokeWidth="0.5" opacity="0.35"/>
            <line x1={cx-3} y1={cy-8} x2={cx+3} y2={cy-4} stroke={dark} strokeWidth="0.4" opacity="0.25"/>
          </g>
        ))}
        {/* wheat tuft on top grains */}
        {[45,65].map((cx,i) => (
          <g key={`t${i}`} transform={`translate(${cx},28) rotate(${i===0?8:-8})`}>
            {[-6,-2,2,6].map((dx,j) => (
              <line key={j} x1={dx} y1={0} x2={dx+(j%2===0?-3:3)} y2={-10}
                stroke={dark} strokeWidth="1.2" strokeLinecap="round"/>
            ))}
          </g>
        ))}
      </svg>
    );
  }
  if (id === "jagung") {
    return (
      <svg width={sz} height={sz} viewBox="0 0 110 110">
        <defs>
          <radialGradient id={gid} cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor={shine}/>
            <stop offset="100%" stopColor={dark}/>
          </radialGradient>
        </defs>
        {/* cob body */}
        <ellipse cx="55" cy="62" rx="18" ry="32" fill="#c8a828" stroke="#806000" strokeWidth="1"/>
        {/* leaf husk */}
        <path d="M37,50 Q25,30 42,22 Q52,50 37,50" fill="#5a8028" stroke="#3a6010" strokeWidth="0.8" opacity="0.9"/>
        <path d="M73,50 Q85,30 68,22 Q58,50 73,50" fill="#5a8028" stroke="#3a6010" strokeWidth="0.8" opacity="0.9"/>
        <path d="M42,28 Q55,15 68,28" fill="none" stroke="#3a6010" strokeWidth="1"/>
        {/* kernel rows */}
        {Array.from({length:5},(_,row) =>
          Array.from({length:7},(_,col) => {
            const cx = 40 + col*5;
            const cy = 38 + row*9;
            const onCob = Math.pow((cx-55)/16,2)+Math.pow((cy-62)/30,2) < 0.9;
            return onCob ? (
              <ellipse key={`${row}-${col}`} cx={cx} cy={cy} rx={2.8} ry={3.2}
                fill={`url(#${gid})`} stroke={dark} strokeWidth="0.5"/>
            ) : null;
          })
        )}
        {/* silk tip */}
        <path d="M48,32 Q55,18 62,32" fill="none" stroke="#c8a000" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if (id === "kedelai") {
    const beans = [
      [50,50],[37,45],[63,48],[44,64],[60,62],[50,35],[35,60],[65,58],[42,75],[62,75],
    ];
    return (
      <svg width={sz} height={sz} viewBox="0 0 110 110">
        <defs>
          <radialGradient id={gid} cx="38%" cy="32%" r="60%">
            <stop offset="0%" stopColor={shine}/>
            <stop offset="100%" stopColor={dark}/>
          </radialGradient>
        </defs>
        {beans.map(([cx,cy],i) => (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx={10} ry={9} fill={`url(#${gid})`} stroke={dark} strokeWidth="0.7"/>
            {/* hilum scar */}
            <line x1={cx-3} y1={cy+2} x2={cx+3} y2={cy+2} stroke={dark} strokeWidth="0.8" strokeLinecap="round" opacity="0.4"/>
          </g>
        ))}
      </svg>
    );
  }
  if (id === "singkong") {
    return (
      <svg width={sz} height={sz} viewBox="0 0 110 110">
        <defs>
          <radialGradient id={gid} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor={shine}/>
            <stop offset="60%" stopColor={w}/>
            <stop offset="100%" stopColor={dark}/>
          </radialGradient>
          <radialGradient id={`${gid}-cut`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffff0"/>
            <stop offset="70%" stopColor="#f0ead0"/>
            <stop offset="100%" stopColor={w}/>
          </radialGradient>
        </defs>
        {/* main tuber - elongated */}
        <ellipse cx="52" cy="65" rx="16" ry="30" fill={`url(#${gid})`} stroke={dark} strokeWidth="1.2" transform="rotate(-8,52,65)"/>
        {/* root markings */}
        <path d="M42,50 Q38,60 42,70" stroke={dark} strokeWidth="0.7" fill="none" opacity="0.4"/>
        <path d="M60,48 Q65,58 60,68" stroke={dark} strokeWidth="0.7" fill="none" opacity="0.4"/>
        <path d="M48,48 Q44,56 50,65" stroke={dark} strokeWidth="0.5" fill="none" opacity="0.3"/>
        {/* ring marks */}
        {[0,1,2,3].map(i => (
          <ellipse key={i} cx="52" cy={48+i*11} rx="15" ry="2.5" fill="none"
            stroke={dark} strokeWidth="0.6" opacity="0.25" transform="rotate(-8,52,65)"/>
        ))}
        {/* cross-section cut showing white interior */}
        <ellipse cx="75" cy="42" rx="14" ry="12" fill={`url(#${gid}-cut)`} stroke={dark} strokeWidth="1"/>
        <ellipse cx="75" cy="42" rx="5" ry="4" fill="#ffffff" opacity="0.7"/>
        <text x="75" y="57" textAnchor="middle" fontSize="7" fill={dark} opacity="0.6">irisan</text>
      </svg>
    );
  }
  return <span className="text-5xl">🌾</span>;
}

/* ─── SVG FLOUR BAG ─── */
function TepungSVG({ nama, warna, warnaGelap, visible, sz = 110 }: { nama: string; warna: string; warnaGelap: string; visible: boolean; sz?: number }) {
  const gid = `tf-${nama.replace(/\s/g,"")}`;
  return (
    <svg width={sz} height={Math.round(sz*120/110)} viewBox="0 0 110 120">
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={visible ? 1 : 0.1}/>
          <stop offset="100%" stopColor={warnaGelap} stopOpacity={visible ? 0.8 : 0.1}/>
        </linearGradient>
      </defs>
      {/* bag body */}
      <path d="M25,35 Q24,95 30,105 Q55,112 80,105 Q86,95 85,35 Z"
        fill={`url(#${gid})`} stroke={warnaGelap}
        strokeWidth="1.2" opacity={visible ? 1 : 0.2}/>
      {/* bag top fold */}
      <path d="M25,35 Q30,25 55,23 Q80,25 85,35 Q80,42 55,44 Q30,42 25,35 Z"
        fill={warna} stroke={warnaGelap} strokeWidth="1" opacity={visible ? 0.9 : 0.2}/>
      {/* label strip */}
      <rect x="30" y="58" width="50" height="30" rx="4"
        fill={warnaGelap} opacity={visible ? 0.25 : 0.05}/>
      {/* label text */}
      {visible && (
        <>
          <text x="55" y="72" textAnchor="middle" fontSize="6.5" fontWeight="bold"
            fill={warnaGelap} fontFamily="sans-serif">TEPUNG</text>
          <text x="55" y="82" textAnchor="middle" fontSize="5.5"
            fill={warnaGelap} fontFamily="sans-serif" opacity="0.8">
            {nama.replace("Tepung ","").toUpperCase()}
          </text>
        </>
      )}
      {/* powder puff at bottom */}
      {visible && (
        <ellipse cx="55" cy="108" rx="28" ry="5" fill={warna} opacity="0.4"/>
      )}
      {/* tie at top */}
      <path d="M42,30 Q55,20 68,30" fill="none" stroke={warnaGelap}
        strokeWidth="1.5" strokeLinecap="round" opacity={visible ? 0.6 : 0.15}/>
      {/* bag texture lines */}
      {visible && [40,50,60,70].map(x => (
        <line key={x} x1={x} y1={48} x2={x} y2={100}
          stroke={warnaGelap} strokeWidth="0.4" opacity="0.12"/>
      ))}
    </svg>
  );
}

/* ─── DISK MILL MACHINE SVG ─── */
function MesinSVG({ spinning, phase, warnaAktif, size = "lg" }: { spinning: boolean; phase: Phase; warnaAktif: string; size?: "xs" | "sm" | "lg" }) {
  const W = size === "xs" ? 130 : size === "sm" ? 150 : 200;
  const H = size === "xs" ? 143 : size === "sm" ? 165 : 220;
  const isOn = phase !== "idle";
  return (
    <svg width={W} height={H} viewBox="0 0 200 220" className="overflow-visible">
      <defs>
        <radialGradient id="disc-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#788090"/>
          <stop offset="100%" stopColor="#3a4050"/>
        </radialGradient>
        <linearGradient id="body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6a7080"/>
          <stop offset="100%" stopColor="#3a4050"/>
        </linearGradient>
        <linearGradient id="hopper-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#808898"/>
          <stop offset="100%" stopColor="#505868"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── BASE / FRAME ── */}
      <rect x="30" y="145" width="140" height="12" rx="3" fill="#2a303a" stroke="#1a202a" strokeWidth="1"/>
      {/* legs */}
      {[42,82,108,148].map(x => (
        <rect key={x} x={x} y="157" width="10" height="22" rx="2" fill="#232830" stroke="#1a1e28" strokeWidth="0.8"/>
      ))}
      {/* base plate */}
      <rect x="25" y="175" width="150" height="8" rx="3" fill="#1e2430" stroke="#12161e" strokeWidth="1"/>

      {/* ── MOTOR (bottom-right) ── */}
      <rect x="120" y="130" width="50" height="28" rx="4" fill="#3a4050" stroke="#2a3040" strokeWidth="1"/>
      <text x="145" y="147" textAnchor="middle" fontSize="7" fill="#8090a0" fontFamily="monospace">MOTOR</text>
      {/* motor pulley */}
      <ellipse cx="120" cy="144" rx="8" ry="8" fill="#2a303a" stroke="#4a5060" strokeWidth="1.5"/>
      <ellipse cx="120" cy="144" rx="4" ry="4" fill="#1a2030" stroke="#3a4050" strokeWidth="1"/>

      {/* ── V-BELT ── */}
      <line x1="120" y1="136" x2="30" y2="90" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round"/>
      <line x1="120" y1="152" x2="30" y2="106" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round"/>
      {/* belt highlights */}
      <line x1="120" y1="137" x2="30" y2="91" stroke="#3a3a3a" strokeWidth="1.5"/>

      {/* ── MAIN BODY ── */}
      <rect x="55" y="60" width="95" height="88" rx="6" fill="url(#body-grad)" stroke="#2a3040" strokeWidth="1.5"/>
      {/* body detail lines */}
      <rect x="62" y="68" width="81" height="72" rx="4" fill="none" stroke="#5a6070" strokeWidth="0.6" strokeDasharray="2,3"/>
      {/* body bolts */}
      {[[62,68],[136,68],[62,132],[136,132]].map(([bx,by],i) => (
        <circle key={i} cx={bx} cy={by} r="3" fill="#2a303a" stroke="#4a5060" strokeWidth="0.8"/>
      ))}

      {/* ── FEED OPENING (left side of body) ── */}
      <rect x="55" y="88" width="12" height="28" rx="2" fill="#1e2430" stroke="#3a4050" strokeWidth="1"/>

      {/* ── OUTPUT CHUTE (bottom) ── */}
      <path d="M82,148 L92,148 L98,176 L76,176 Z" fill="#505868" stroke="#3a4050" strokeWidth="1"/>
      <rect x="72" y="175" width="30" height="6" rx="2" fill="#3a4050" stroke="#2a3040" strokeWidth="0.8"/>

      {/* ── DISC / FLYWHEEL (left side, visible) ── */}
      <g transform="translate(30,98)">
        {/* disc shadow */}
        <ellipse cx="2" cy="2" rx="42" ry="42" fill="#000000" opacity="0.3"/>
        {/* disc body */}
        <circle r="42" fill="url(#disc-grad)" stroke="#5a6070" strokeWidth="2"/>
        {/* spinning content */}
        <g>
          {spinning && (
            <animateTransform attributeName="transform" type="rotate"
              values="0;360" dur="0.45s" repeatCount="indefinite"/>
          )}
          {/* spokes */}
          {[0,45,90,135,180,225,270,315].map(a => (
            <line key={a}
              x1={0} y1={0}
              x2={34*Math.cos(a*Math.PI/180)}
              y2={34*Math.sin(a*Math.PI/180)}
              stroke="#8090a4" strokeWidth="3" strokeLinecap="round"/>
          ))}
          {/* outer ring grooves */}
          <circle r="38" fill="none" stroke="#4a5568" strokeWidth="1"/>
          <circle r="30" fill="none" stroke="#5a6070" strokeWidth="0.5"/>
          {/* grinding ridges on disc face */}
          {Array.from({length:12},(_,i) => {
            const a = i * 30 * Math.PI / 180;
            return (
              <line key={i}
                x1={15*Math.cos(a)} y1={15*Math.sin(a)}
                x2={26*Math.cos(a)} y2={26*Math.sin(a)}
                stroke="#9aabb0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
            );
          })}
        </g>
        {/* disc hub */}
        <circle r="10" fill="#2a303a" stroke="#6a7080" strokeWidth="2"/>
        <circle r="5" fill="#1a2030" stroke="#4a5060" strokeWidth="1"/>
        {/* shaft bolt */}
        <circle r="2.5" fill="#788090"/>
      </g>

      {/* ── HOPPER (funnel on top) ── */}
      {/* outer hopper walls */}
      <path d="M72,15 L52,60 L118,60 L98,15 Z" fill="url(#hopper-grad)" stroke="#3a4050" strokeWidth="1.5"/>
      {/* hopper opening at top */}
      <rect x="70" y="10" width="30" height="8" rx="2" fill="#6a7080" stroke="#3a4050" strokeWidth="1"/>
      {/* hopper inner shadow */}
      <path d="M76,20 L60,58 L110,58 L94,20 Z" fill="#2a3040" opacity="0.5"/>
      {/* hopper seam lines */}
      <line x1="72" y1="15" x2="54" y2="58" stroke="#8090a0" strokeWidth="0.5" opacity="0.4"/>
      <line x1="98" y1="15" x2="116" y2="58" stroke="#8090a0" strokeWidth="0.5" opacity="0.4"/>
      {/* hopper bolts */}
      {[[72,15],[98,15],[54,58],[116,58]].map(([bx,by],i) => (
        <circle key={i} cx={bx} cy={by} r="2.5" fill="#2a303a" stroke="#5a6070" strokeWidth="0.7"/>
      ))}

      {/* ── STATUS INDICATOR ── */}
      <circle cx="148" cy="68" r="6"
        fill={isOn ? warnaAktif : "#2a303a"}
        stroke={isOn ? warnaAktif : "#3a4050"}
        strokeWidth="1"
        opacity={isOn ? 1 : 0.4}
        filter={isOn ? "url(#glow)" : "none"}
      />
      {isOn && (
        <circle cx="148" cy="68" r="6" fill={warnaAktif} opacity="0.4">
          <animate attributeName="r" values="6;10;6" dur="0.8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;0;0.4" dur="0.8s" repeatCount="indefinite"/>
        </circle>
      )}

      {/* ── SMOKE/DUST particles when processing ── */}
      {spinning && (
        <>
          {[0,1,2].map(i => (
            <circle key={i} cx={80+i*8} cy={58} r="3"
              fill="#c0c8d0" opacity="0.6">
              <animate attributeName="cy" values="58;30;15" dur={`${0.8+i*0.3}s`}
                repeatCount="indefinite" begin={`${i*0.25}s`}/>
              <animate attributeName="opacity" values="0.6;0.2;0" dur={`${0.8+i*0.3}s`}
                repeatCount="indefinite" begin={`${i*0.25}s`}/>
              <animate attributeName="r" values="3;5;1" dur={`${0.8+i*0.3}s`}
                repeatCount="indefinite" begin={`${i*0.25}s`}/>
            </circle>
          ))}
        </>
      )}

      {/* ── LABEL ON BODY ── */}
      <text x="102" y="100" textAnchor="middle" fontSize="7" fontWeight="bold"
        fill="#8090a0" fontFamily="monospace">DISK MILL</text>
      <text x="102" y="110" textAnchor="middle" fontSize="6"
        fill="#6a7880" fontFamily="monospace">PENEPUNG</text>
    </svg>
  );
}

/* ─── GRAIN FALLING ANIMATION ─── */
function GrainFalling({ color, active }: { color: string; active: boolean }) {
  if (!active) return null;
  return (
    <svg width="40" height="60" viewBox="0 0 40 60" className="absolute left-1/2 -translate-x-1/2 -top-2">
      {[0,1,2,3].map(i => (
        <circle key={i} cx={12+i*6} cy={10+i*8} r="3" fill={color} opacity="0.8">
          <animate attributeName="cy" values={`${10+i*8};55`} dur="0.6s"
            repeatCount="indefinite" begin={`${i*0.12}s`}/>
          <animate attributeName="opacity" values="0.9;0" dur="0.6s"
            repeatCount="indefinite" begin={`${i*0.12}s`}/>
        </circle>
      ))}
    </svg>
  );
}

/* ─── FLOUR FALLING FROM CHUTE ─── */
function TepungJatuh({ color, active }: { color: string; active: boolean }) {
  if (!active) return null;
  return (
    <svg width="40" height="50" viewBox="0 0 40 50" className="absolute left-1/2 -translate-x-1/2 top-0">
      {[0,1,2,3,4].map(i => (
        <ellipse key={i} cx={8+i*7} cy={5+i*6} rx="3" ry="2" fill={color} opacity="0.7">
          <animate attributeName="cy" values={`${5+i*6};45`} dur="0.5s"
            repeatCount="indefinite" begin={`${i*0.08}s`}/>
          <animate attributeName="opacity" values="0.8;0.1" dur="0.5s"
            repeatCount="indefinite" begin={`${i*0.08}s`}/>
        </ellipse>
      ))}
    </svg>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function DiskMillMachine() {
  const [selected, setSelected] = useState(BAHAN[0]);
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const after = (ms: number, cb: () => void) => { timers.current.push(setTimeout(cb, ms)); };

  const olah = () => {
    if (phase === "processing" || phase === "feeding") return;
    playPopSound();
    clear();
    setPhase("feeding");
    after(1200, () => setPhase("processing"));
    after(3800, () => setPhase("done"));
  };

  const reset = () => {
    playPopSound();
    clear();
    setPhase("idle");
  };

  const pilih = (b: typeof BAHAN[0]) => {
    playPopSound();
    clear();
    setSelected(b);
    setPhase("idle");
  };

  const spinning = phase === "processing";
  const feeding  = phase === "feeding";
  const done     = phase === "done";
  const isRunning = phase === "feeding" || phase === "processing";

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-600/40 bg-gradient-to-br from-slate-900/95 to-slate-800/80 backdrop-blur">
      <style>{`
        @keyframes dmm-appear { from{opacity:0;transform:scale(0.7) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes dmm-shine  { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes dmm-shake  { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-2px)} 75%{transform:translateX(2px)} }
        .dmm-appear { animation: dmm-appear 0.5s cubic-bezier(.34,1.56,.64,1) forwards; }
        .dmm-shine  { animation: dmm-shine 1s ease-in-out infinite; }
        .dmm-shake  { animation: dmm-shake 0.15s linear infinite; }
      `}</style>

      {/* HEADER */}
      <div className="px-5 pt-4 pb-3 border-b border-slate-700/50">
        <p className="font-display text-sm font-bold text-amber-300 text-center">⚙️ Mesin Penepung (Disk Mill) — Analogi Fungsi</p>
        <p className="text-xs text-white/50 font-body text-center mt-1">
          Setiap bahan mentah (domain) menghasilkan <strong className="text-amber-200">tepat satu</strong> jenis tepung (range) — itulah fungsi!
        </p>
      </div>

      {/* BAHAN SELECTOR */}
      <div className="px-4 pt-3 pb-2">
        <p className="text-[10px] text-white/40 font-body uppercase tracking-widest mb-2 text-center">Pilih Bahan Mentah (Domain)</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {BAHAN.map(b => {
            const isActive = selected.id === b.id;
            return (
              <button key={b.id} onClick={() => pilih(b)} disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold font-body transition-all duration-200 disabled:opacity-50"
                style={isActive
                  ? { borderColor: b.warna, color: b.warnaShine, background: `${b.warnaGelap}30`, boxShadow: `0 0 8px ${b.warna}40` }
                  : { borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.04)" }
                }>
                <span>{b.icon}</span>
                <span>{b.nama}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN VISUAL AREA */}
      <div className="px-3 py-3">

        {/* ── PORTRAIT / MOBILE — vertical stack: Domain ↓ Mesin ↓ Range ── */}
        <div className="flex sm:hidden flex-col items-center gap-1 w-full">

          {/* Domain card */}
          <div className="flex flex-col items-center gap-1 w-full max-w-[260px]">
            <span className="text-[9px] font-body uppercase tracking-widest font-bold" style={{ color: selected.warnaShine }}>Domain</span>
            <div className="rounded-xl border-2 px-3 py-2 flex flex-col items-center gap-0.5 w-full"
              style={{ borderColor: selected.warna, background: `linear-gradient(135deg, ${selected.bgFrom}, ${selected.bgTo})`, boxShadow: `0 0 12px ${selected.warna}30` }}>
              <div className="relative" style={{ filter: `drop-shadow(0 0 8px ${selected.warna}70)` }}>
                <div className={spinning ? "dmm-shake" : ""}>
                  <GrainSVG id={selected.id} w={selected.warna} dark={selected.warnaGelap} shine={selected.warnaShine} sz={90}/>
                </div>
                <GrainFalling color={selected.warna} active={feeding}/>
              </div>
              <p className="text-sm font-bold font-body" style={{ color: selected.warnaShine }}>{selected.nama}</p>
              <p className="text-[10px] font-body" style={{ color: `${selected.warna}bb` }}>Bahan Mentah</p>
            </div>
          </div>

          {/* Arrow down (domain → mesin) */}
          <svg width="24" height="36" viewBox="0 0 24 36">
            <line x1="12" y1="2" x2="12" y2="26" stroke={isRunning||done ? selected.warna : "#3a4050"}
              strokeWidth="2.5" strokeDasharray="5,3">
              {(isRunning||done) && <animate attributeName="stroke-dashoffset" values="24;0" dur="0.4s" repeatCount="indefinite"/>}
            </line>
            <polygon points="6,24 12,36 18,24" fill={isRunning||done ? selected.warna : "#3a4050"}/>
          </svg>

          {/* Machine */}
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] text-white/40 font-body uppercase tracking-widest">Mesin Penepung</span>
            <div className={spinning ? "dmm-shine" : ""}>
              <MesinSVG spinning={spinning} phase={phase} warnaAktif={selected.warna} size="sm"/>
            </div>
            <div className={`h-5 flex items-center transition-opacity duration-300 ${isRunning ? "opacity-100" : "opacity-0"}`}>
              <span className="text-[9px] font-body font-bold" style={{ color: selected.warnaShine }}>
                {feeding ? "⬇ memasukkan..." : "⚙ menggiling..."}
              </span>
            </div>
          </div>

          {/* Arrow down (mesin → range) */}
          <svg width="24" height="36" viewBox="0 0 24 36">
            <line x1="12" y1="2" x2="12" y2="26" stroke={done ? selected.warnaTepung : "#3a4050"}
              strokeWidth="2.5" strokeDasharray="5,3">
              {done && <animate attributeName="stroke-dashoffset" values="24;0" dur="0.4s" repeatCount="indefinite"/>}
            </line>
            <polygon points="6,24 12,36 18,24" fill={done ? selected.warnaTepung : "#3a4050"}/>
          </svg>

          {/* Range card */}
          <div className="flex flex-col items-center gap-1 w-full max-w-[260px]">
            <span className="text-[9px] font-body uppercase tracking-widest font-bold"
              style={{ color: done ? selected.warnaTepung : "#4a5060" }}>Range</span>
            <div className="rounded-xl border-2 px-3 py-2 flex flex-col items-center gap-0.5 w-full transition-all duration-500"
              style={{
                borderColor: done ? selected.warnaGelap : "#2a3040",
                background: done
                  ? `linear-gradient(135deg, ${selected.bgFrom}dd, ${selected.bgTo}dd)`
                  : "rgba(15,20,30,0.5)",
                boxShadow: done ? `0 0 14px ${selected.warnaTepung}30` : "none",
              }}>
              <div className="relative" style={{ filter: done ? `drop-shadow(0 0 10px ${selected.warnaTepung}80)` : "none" }}>
                <div className={done ? "dmm-appear" : ""} style={{ opacity: done ? 1 : 0.2 }}>
                  <TepungSVG nama={selected.produk} warna={selected.warnaTepung} warnaGelap={selected.warnaGelap} visible={done} sz={90}/>
                </div>
                <TepungJatuh color={selected.warnaTepung} active={spinning}/>
              </div>
              <p className="text-sm font-bold font-body" style={{ color: done ? selected.warnaTepung : "#4a5060" }}>
                {selected.produk}
              </p>
              <p className="text-[10px] font-body" style={{ color: done ? "rgba(255,255,255,0.5)" : "#3a4050" }}>
                {done ? selected.produkDesc : "Belum diolah"}
              </p>
            </div>
          </div>
        </div>

        {/* ── LANDSCAPE / DESKTOP — horizontal layout ── */}
        <div className="hidden sm:flex items-center justify-center gap-0 gap-x-2">

          {/* DOMAIN — grain */}
          <div className="flex flex-col items-center gap-1 min-w-[130px]">
            <span className="text-[10px] font-body uppercase tracking-widest font-bold" style={{ color: selected.warnaShine }}>Domain</span>
            <div className="rounded-xl border-2 px-3 py-2 flex flex-col items-center gap-1 w-full"
              style={{ borderColor: selected.warna, background: `linear-gradient(135deg, ${selected.bgFrom}, ${selected.bgTo})`, boxShadow: `0 0 14px ${selected.warna}35` }}>
              <div className="relative flex items-center justify-center"
                style={{ filter: `drop-shadow(0 0 8px ${selected.warna}70)` }}>
                <div className={spinning ? "dmm-shake" : ""}>
                  <GrainSVG id={selected.id} w={selected.warna} dark={selected.warnaGelap} shine={selected.warnaShine}/>
                </div>
                <GrainFalling color={selected.warna} active={feeding}/>
              </div>
              <p className="text-xs font-bold font-body" style={{ color: selected.warnaShine }}>{selected.nama}</p>
              <p className="text-[10px] font-body" style={{ color: `${selected.warna}bb` }}>Bahan Mentah</p>
            </div>
          </div>

          {/* ARROW in */}
          <div className="flex-shrink-0 mx-1">
            <svg width="40" height="24" viewBox="0 0 40 24">
              <line x1="2" y1="12" x2="30" y2="12" stroke={isRunning||done ? selected.warna : "#3a4050"}
                strokeWidth="2.5" strokeDasharray="5,3">
                {(isRunning||done) && <animate attributeName="stroke-dashoffset" values="24;0" dur="0.4s" repeatCount="indefinite"/>}
              </line>
              <polygon points="30,7 40,12 30,17" fill={isRunning||done ? selected.warna : "#3a4050"}/>
            </svg>
          </div>

          {/* MACHINE */}
          <div className="flex flex-col items-center gap-1 relative">
            <span className="text-[10px] text-white/40 font-body uppercase tracking-widest">Mesin Penepung</span>
            <div className={spinning ? "dmm-shine" : ""}>
              <MesinSVG spinning={spinning} phase={phase} warnaAktif={selected.warna}/>
            </div>
            <div className={`h-6 transition-all duration-300 ${isRunning ? "opacity-100" : "opacity-0"}`}>
              <span className="text-xs font-body font-bold" style={{ color: selected.warnaShine }}>
                {feeding ? "⬇ Memasukkan bahan..." : "⚙ Menggiling..."}
              </span>
            </div>
          </div>

          {/* ARROW out */}
          <div className="flex-shrink-0 mx-1">
            <svg width="40" height="24" viewBox="0 0 40 24">
              <line x1="2" y1="12" x2="30" y2="12" stroke={done ? selected.warnaTepung : "#3a4050"}
                strokeWidth="2.5" strokeDasharray="5,3">
                {done && <animate attributeName="stroke-dashoffset" values="24;0" dur="0.4s" repeatCount="indefinite"/>}
              </line>
              <polygon points="30,7 40,12 30,17" fill={done ? selected.warnaTepung : "#3a4050"}/>
            </svg>
          </div>

          {/* RANGE — flour bag */}
          <div className="flex flex-col items-center gap-1 min-w-[130px]">
            <span className="text-[10px] font-body uppercase tracking-widest font-bold"
              style={{ color: done ? selected.warnaTepung : "#4a5060" }}>Range</span>
            <div className="rounded-xl border-2 px-3 py-2 flex flex-col items-center gap-1 w-full transition-all duration-500"
              style={{
                borderColor: done ? selected.warnaGelap : "#2a3040",
                background: done
                  ? `linear-gradient(135deg, ${selected.bgFrom}dd, ${selected.bgTo}dd)`
                  : "rgba(15,20,30,0.5)",
                boxShadow: done ? `0 0 14px ${selected.warnaTepung}35` : "none",
              }}>
              <div className="relative flex items-center justify-center"
                style={{ filter: done ? `drop-shadow(0 0 10px ${selected.warnaTepung}80)` : "none" }}>
                <div className={done ? "dmm-appear" : ""} style={{ opacity: done ? 1 : 0.2 }}>
                  <TepungSVG nama={selected.produk} warna={selected.warnaTepung} warnaGelap={selected.warnaGelap} visible={done}/>
                </div>
                <TepungJatuh color={selected.warnaTepung} active={spinning}/>
              </div>
              <p className="text-xs font-bold font-body" style={{ color: done ? selected.warnaTepung : "#4a5060" }}>
                {selected.produk}
              </p>
              <p className="text-[10px] font-body" style={{ color: done ? "rgba(255,255,255,0.5)" : "#3a4050" }}>
                {done ? selected.produkDesc : "Belum diolah"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FUNCTION NOTATION */}
      {done && (
        <div className="mx-4 mb-3 dmm-appear">
          <div className="rounded-xl border px-4 py-2.5 text-center"
            style={{ borderColor: `${selected.warna}40`, background: `${selected.warnaTepung}08` }}>
            <p className="font-mono text-sm font-bold" style={{ color: selected.warnaShine }}>
              f({selected.nama}) = {selected.produk}
            </p>
            <p className="text-[11px] text-white/50 font-body mt-0.5">
              Satu bahan → tepat satu produk ✅ Ini adalah <strong className="text-white/70">fungsi</strong>!
            </p>
          </div>
        </div>
      )}

      {/* TOMBOL */}
      <div className="px-4 pb-4 flex gap-2 justify-center">
        <button
          onClick={olah}
          disabled={isRunning}
          className="px-6 py-2.5 rounded-xl font-display font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            background: isRunning ? `${selected.warnaGelap}30` : `${selected.warna}25`,
            border: `1.5px solid ${selected.warna}70`,
            color: selected.warnaShine,
            boxShadow: isRunning ? "none" : `0 0 12px ${selected.warna}30`,
          }}
        >
          {feeding ? "⬇ Memasukkan..." : spinning ? "⚙ Menggiling..." : "▶ Olah Sekarang"}
        </button>
        {(done || phase !== "idle") && (
          <button onClick={reset}
            className="px-4 py-2.5 rounded-xl font-body text-sm transition-all hover:bg-slate-700 active:scale-95 cursor-pointer bg-slate-800 text-white/50 hover:text-white border border-slate-600/40">
            🔄 Reset
          </button>
        )}
      </div>

      {/* INFO STRIP */}
      <div className="border-t border-slate-700/50 px-4 py-3">
        <div className="flex flex-wrap gap-2 justify-center">
          {BAHAN.map(b => (
            <div key={b.id} className="flex items-center gap-1.5 text-[11px] font-body text-white/50">
              <span className="font-bold" style={{ color: b.warnaShine }}>{b.nama}</span>
              <span className="text-white/25">→</span>
              <span>{b.produk}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
