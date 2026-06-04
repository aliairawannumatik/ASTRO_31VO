import React, { useState } from "react";

const W = 268, H = 182;
const OX = 24, OY = 155;
const SC = 18;
const gx = (x: number) => OX + x * SC;
const gy = (y: number) => OY - y * SC;

type Tri = {
  x1: number; y1: number;
  x2: number; y2: number;
  color: string;
  datar: number;
  tegak: number;
  gradStr: string;
};

const TRIS_POS: Tri[] = [
  { x1:1, y1:2/3,  x2:4, y2:8/3,  color:"#22d3ee", datar:3, tegak:2, gradStr:"+2/3" },
  { x1:4, y1:8/3,  x2:7, y2:14/3, color:"#4ade80", datar:3, tegak:2, gradStr:"+2/3" },
  { x1:1, y1:2/3,  x2:7, y2:14/3, color:"#facc15", datar:6, tegak:4, gradStr:"+4/6 = +2/3" },
];

const TRIS_NEG: Tri[] = [
  { x1:1, y1:13/3, x2:4, y2:7/3,  color:"#f472b6", datar:3, tegak:2, gradStr:"−2/3" },
  { x1:4, y1:7/3,  x2:7, y2:1/3,  color:"#fb923c", datar:3, tegak:2, gradStr:"−2/3" },
  { x1:1, y1:13/3, x2:7, y2:1/3,  color:"#ef4444", datar:6, tegak:4, gradStr:"−4/6 = −2/3" },
];

function TriDraw({ tri, isNeg }: { tri: Tri; isNeg: boolean }) {
  const cx1 = gx(tri.x1), cy1 = gy(tri.y1);
  const cx2 = gx(tri.x2), cy2 = gy(tri.y2);
  const cX = cx2, cY = cy1;
  const c = tri.color;
  const RA = 5;
  const raDir = isNeg ? +RA : -RA;

  return (
    <g style={{ animation: "gfadeIn 0.45s ease-out" }}>
      <line x1={cx1} y1={cY} x2={cX} y2={cY}
        stroke={c} strokeWidth="2" strokeDasharray="5,2" opacity="0.9" />
      <line x1={cX} y1={cY} x2={cx2} y2={cy2}
        stroke={c} strokeWidth="2" strokeDasharray="5,2" opacity="0.9" />
      <polyline
        points={`${cX-RA},${cY} ${cX-RA},${cY+raDir} ${cX},${cY+raDir}`}
        fill="none" stroke={c} strokeWidth="0.9" opacity="0.55"
      />
      <circle cx={cx1} cy={cy1} r="3.5" fill={c} />
      <circle cx={cx2} cy={cy2} r="3.5" fill={c} />
      <text x={(cx1+cX)/2} y={cY + (isNeg ? -7 : 13)}
        textAnchor="middle" fontSize="9" fontWeight="bold" fill="#facc15">{tri.datar}</text>
      <text x={cX+7} y={(cY+cy2)/2+3.5}
        fontSize="9" fontWeight="bold" fill="#facc15">{tri.tegak}</text>
    </g>
  );
}

export default function GradienInvariantAnimation() {
  const [mode, setMode] = useState<"pos" | "neg">("pos");
  const [step, setStep] = useState(0);
  const tris = mode === "pos" ? TRIS_POS : TRIS_NEG;
  const lineColor = mode === "pos" ? "#22d3ee" : "#f472b6";

  const switchMode = (m: "pos" | "neg") => { setMode(m); setStep(0); };

  const lx1 = 0, ly1 = mode === "pos" ? 0 : 5;
  const lx2 = mode === "pos" ? 8 : 7.5, ly2 = mode === "pos" ? 8*(2/3) : 0;

  const btnLabels = ["Tampilkan Segitiga 1", "Tampilkan Segitiga 2", "Tampilkan Segitiga 3"];

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(["pos", "neg"] as const).map(m => (
          <button key={m} onClick={() => switchMode(m)}
            className={`flex-1 text-xs font-bold py-2 rounded-lg border transition-all duration-200 font-body ${
              mode === m
                ? m === "pos"
                  ? "bg-cyan-900/60 border-cyan-400/60 text-cyan-200 scale-105"
                  : "bg-pink-900/60 border-pink-400/60 text-pink-200 scale-105"
                : "bg-slate-800/40 border-white/10 text-white/40 hover:text-white/70"
            }`}>
            {m === "pos" ? "↗ Gradien Positif" : "↘ Gradien Negatif"}
          </button>
        ))}
      </div>

      <div className={`text-xs font-body rounded-lg px-3 py-2 border font-semibold ${
        mode === "pos"
          ? "bg-cyan-900/20 border-cyan-500/30 text-cyan-200"
          : "bg-pink-900/20 border-pink-500/30 text-pink-200"
      }`}>
        {mode === "pos"
          ? "✅ Garis naik ke kanan atas → gradien POSITIF (+2/3)"
          : "❌ Garis turun ke kanan bawah → gradien NEGATIF (−2/3)"}
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)" }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%">
          {[1,2,3,4,5,6,7,8].map(v => (
            <g key={v}>
              <line x1={gx(v)} y1={4} x2={gx(v)} y2={H-4} stroke="#1a2744" strokeWidth="0.6" />
              <line x1={4} y1={gy(v)} x2={W-4} y2={gy(v)} stroke="#1a2744" strokeWidth="0.6" />
            </g>
          ))}
          <line x1={OX} y1={4} x2={OX} y2={H-4} stroke="#334155" strokeWidth="1.5" />
          <line x1={4} y1={OY} x2={W-4} y2={OY} stroke="#334155" strokeWidth="1.5" />
          <text x={W-13} y={OY+10} fill="#475569" fontSize="9">x</text>
          <text x={OX+3} y={12} fill="#475569" fontSize="9">y</text>

          <line
            x1={gx(lx1)} y1={gy(ly1)} x2={gx(lx2)} y2={gy(ly2)}
            stroke={lineColor} strokeWidth="2.8" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 5px ${lineColor}55)` }}
          />

          {tris.slice(0, step).map((t, i) => (
            <TriDraw key={i} tri={t} isNeg={mode === "neg"} />
          ))}

          <text x={OX+2} y={OY-3} fill="#475569" fontSize="8">O</text>

          <text x={W-65} y={18} fill={lineColor} fontSize="8" fontWeight="bold">
            {mode === "pos" ? "y = ⅔x" : "y = −⅔x + 5"}
          </text>

          {step === 0 && (
            <text x={W/2} y={H/2+20} fill="#475569" fontSize="9" textAnchor="middle">
              Tekan tombol di bawah untuk mulai
            </text>
          )}

          {step > 0 && (
            <>
              <text x={W-48} y={H-10} fill="#475569" fontSize="7.5">sisi datar →</text>
              <text x={W-48} y={H-2} fill="#475569" fontSize="7.5">↕ sisi tegak</text>
            </>
          )}
        </svg>
      </div>

      <div className="flex gap-2">
        {step < 3 && (
          <button onClick={() => setStep(s => s + 1)}
            className={`flex-1 text-xs font-bold py-2.5 rounded-lg border transition-all font-body ${
              mode === "pos"
                ? "bg-cyan-900/40 border-cyan-500/40 text-cyan-200 hover:bg-cyan-900/70"
                : "bg-pink-900/40 border-pink-500/40 text-pink-200 hover:bg-pink-900/70"
            }`}>
            {btnLabels[step]}
          </button>
        )}
        {step > 0 && (
          <button onClick={() => setStep(0)}
            className="text-xs font-bold py-2.5 px-4 rounded-lg border border-white/15 text-white/40 hover:text-white/70 transition-all font-body">
            Ulangi
          </button>
        )}
      </div>

      {step > 0 && (
        <div className="space-y-1.5">
          {tris.slice(0, step).map((t, i) => (
            <div key={i} className="flex items-start gap-2.5 bg-slate-800/50 rounded-lg px-3 py-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5" style={{ background: t.color }} />
              <div className="text-xs font-body leading-relaxed">
                <span className="text-white/50">Segitiga {i+1}: </span>
                <span style={{ color: t.color }}>sisi datar = {t.datar}, sisi tegak = {t.tegak}</span>
                <span className="text-white/30 mx-1.5">→</span>
                <span className="font-bold text-white">m = {t.gradStr}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className={`border rounded-xl p-4 space-y-2 ${
          mode === "pos" ? "bg-cyan-500/10 border-cyan-500/40" : "bg-pink-500/10 border-pink-500/40"
        }`}>
          <p className="text-sm font-bold text-white font-body text-center">
            {mode === "pos"
              ? "✅ Ketiga segitiga berbeda ukuran — gradiennya tetap +2/3!"
              : "✅ Ketiga segitiga berbeda ukuran — gradiennya tetap −2/3!"}
          </p>
          <p className="text-xs text-white/60 font-body text-center leading-relaxed">
            Gradien <strong className="text-white/80">tidak bergantung</strong> pada panjang atau posisi bagian garis yang diukur.
            Kamu bisa memilih segitiga dari bagian mana pun — hasilnya selalu sama.
          </p>
        </div>
      )}

      <style>{`
        @keyframes gfadeIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
