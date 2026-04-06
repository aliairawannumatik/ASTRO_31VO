import { useState } from "react";
import { RotateCcw } from "lucide-react";

const VA_COLOR = "#f97316";
const VB_COLOR = "#22d3ee";
const VC_COLOR = "#a855f7";

const REF_A = { x: 82, y: 158 };
const REF_B = { x: 127, y: 158 };
const REF_C = { x: 82, y: 98 };

const TRF_CX = 305;
const TRF_CY = 140;

const BASE_AB = 45;
const BASE_AC = 60;
const BASE_BC = 75;

function RightAngleSquare({ x, y, size = 8, stroke }: { x: number; y: number; size?: number; stroke: string }) {
  return (
    <path
      d={`M ${x + size},${y} L ${x + size},${y - size} L ${x},${y - size}`}
      fill="none"
      stroke={stroke}
      strokeWidth="1.5"
    />
  );
}

function ScaleDisplay({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-xs font-body">
      <span className="text-white/50">{label}</span>
      <span className="font-mono text-cyan-400 font-bold">{value.toFixed(0)} px</span>
    </div>
  );
}

export default function SimilarityAnimation() {
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const handleReset = () => {
    setScale(1.0);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  };

  const sx = flipH ? -1 : 1;
  const sy = flipV ? -1 : 1;

  const cssTransform = `translate(${TRF_CX}px,${TRF_CY}px) rotate(${rotation}deg) scale(${sx * scale},${sy * scale})`;

  const sideAB = BASE_AB * scale;
  const sideAC = BASE_AC * scale;
  const sideBC = BASE_BC * scale;

  const isResized = Math.abs(scale - 1.0) > 0.05;
  const isRotated = rotation % 360 !== 0;
  const isFlipped = flipH || flipV;

  let statusNote = "Coba geser slider, putar, atau balikkan segitiga!";
  if (isResized && !isRotated && !isFlipped)
    statusNote = `Diperbesar/dikecilkan ${scale.toFixed(1)}×. Sudut tetap sama → masih SEBANGUN!`;
  else if (isRotated && !isFlipped)
    statusNote = `Diputar ${((rotation % 360) + 360) % 360}°. Sudut tetap sama → masih SEBANGUN!`;
  else if (isFlipped && !isRotated)
    statusNote = `Dicerminkan${flipH ? " horizontal" : ""}${flipV ? " vertikal" : ""}. Sudut tetap sama → masih SEBANGUN!`;
  else if (isResized || isRotated || isFlipped)
    statusNote = `Diskala, diputar, dicerminkan — tapi sudut selalu tetap 90°, 53°, 37°. SEBANGUN!`;

  return (
    <div className="rounded-xl border border-blue-500/30 bg-slate-900/60 overflow-hidden">
      <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-3 flex items-center gap-2">
        <span className="text-lg">📐</span>
        <span className="font-body font-semibold text-blue-300 text-sm">
          Simulasi Interaktif — Konsep Kesebangunan
        </span>
      </div>

      <div className="p-4 space-y-4">

        {/* SVG Canvas */}
        <div className="bg-slate-800/60 rounded-xl overflow-hidden border border-slate-700/50">
          <svg viewBox="0 0 410 235" className="w-full">
            <defs>
              <pattern id="simgrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
              </pattern>
              <marker id="arrowY" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#facc15" />
              </marker>
            </defs>
            <rect width="410" height="235" fill="url(#simgrid)" />

            {/* ── REFERENCE TRIANGLE ── */}
            <text x="103" y="18" textAnchor="middle" fontSize="9.5" fill="#64748b" fontFamily="sans-serif" letterSpacing="0.5">REFERENSI (△ABC)</text>

            <polygon
              points={`${REF_A.x},${REF_A.y} ${REF_B.x},${REF_B.y} ${REF_C.x},${REF_C.y}`}
              fill="#22d3ee"
              fillOpacity="0.12"
              stroke="#22d3ee"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Side labels for reference */}
            <text x={(REF_A.x + REF_B.x) / 2} y={REF_A.y + 13} textAnchor="middle" fontSize="8" fill="#94a3b8">45px</text>
            <text x={REF_A.x - 18} y={(REF_A.y + REF_C.y) / 2 + 3} textAnchor="middle" fontSize="8" fill="#94a3b8">60px</text>
            <text x={(REF_B.x + REF_C.x) / 2 + 14} y={(REF_B.y + REF_C.y) / 2 + 3} textAnchor="middle" fontSize="8" fill="#94a3b8">75px</text>

            {/* Right-angle square at A */}
            <RightAngleSquare x={REF_A.x} y={REF_A.y} stroke={VA_COLOR} />

            {/* Vertex dots */}
            <circle cx={REF_A.x} cy={REF_A.y} r="5" fill={VA_COLOR} />
            <circle cx={REF_B.x} cy={REF_B.y} r="5" fill={VB_COLOR} />
            <circle cx={REF_C.x} cy={REF_C.y} r="5" fill={VC_COLOR} />

            {/* Vertex labels */}
            <text x={REF_A.x - 13} y={REF_A.y + 4} fontSize="10" fill={VA_COLOR} fontWeight="bold">A</text>
            <text x={REF_B.x + 5} y={REF_B.y + 4} fontSize="10" fill={VB_COLOR} fontWeight="bold">B</text>
            <text x={REF_C.x - 13} y={REF_C.y + 4} fontSize="10" fill={VC_COLOR} fontWeight="bold">C</text>

            {/* Angle arc at B (approximate 53°) */}
            <path d="M 118,158 A 8,8 0 0,0 108,151" fill="none" stroke={VB_COLOR} strokeWidth="1.5" />
            {/* Angle arc at C (approximate 37°) */}
            <path d="M 82,106 A 8,8 0 0,1 90,103" fill="none" stroke={VC_COLOR} strokeWidth="1.5" />

            {/* ── SIMILARITY SYMBOL ── */}
            <text x="200" y="128" textAnchor="middle" fontSize="26" fill="#facc15" fontWeight="bold">∼</text>
            <text x="200" y="145" textAnchor="middle" fontSize="8" fill="#a16207" fontFamily="sans-serif">sebangun</text>

            {/* ── TRANSFORMED TRIANGLE ── */}
            <text x="305" y="18" textAnchor="middle" fontSize="9.5" fill="#60a5fa" fontFamily="sans-serif" letterSpacing="0.5">
              HASIL (k = {scale.toFixed(1)}×)
            </text>

            <g
              style={{
                transform: cssTransform,
                transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              {/* Triangle */}
              <polygon
                points={`0,0 ${BASE_AB},0 0,${-BASE_AC}`}
                fill="#3b82f6"
                fillOpacity="0.18"
                stroke="#60a5fa"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Right-angle square at A (local origin) */}
              <RightAngleSquare x={0} y={0} stroke={VA_COLOR} />

              {/* Vertex dots */}
              <circle cx={0} cy={0} r="5" fill={VA_COLOR} />
              <circle cx={BASE_AB} cy={0} r="5" fill={VB_COLOR} />
              <circle cx={0} cy={-BASE_AC} r="5" fill={VC_COLOR} />

              {/* Angle arc at B */}
              <path d={`M ${BASE_AB - 9},0 A 8,8 0 0,0 ${BASE_AB - 7},${-8}`} fill="none" stroke={VB_COLOR} strokeWidth="1.5" />
              {/* Angle arc at C */}
              <path d={`M 0,${-BASE_AC + 9} A 8,8 0 0,1 8,${-BASE_AC + 7}`} fill="none" stroke={VC_COLOR} strokeWidth="1.5" />
            </g>

            {/* ── ANGLE LEGEND ── */}
            <g transform="translate(8,210)">
              <circle cx="8" cy="0" r="4" fill={VA_COLOR} />
              <text x="16" y="4" fontSize="9" fill={VA_COLOR} fontFamily="sans-serif">∠A = 90°</text>

              <circle cx="88" cy="0" r="4" fill={VB_COLOR} />
              <text x="96" y="4" fontSize="9" fill={VB_COLOR} fontFamily="sans-serif">∠B = 53°</text>

              <circle cx="168" cy="0" r="4" fill={VC_COLOR} />
              <text x="176" y="4" fontSize="9" fill={VC_COLOR} fontFamily="sans-serif">∠C = 37°</text>

              <rect x="248" y="-7" width="148" height="14" rx="4" fill="#15803d" fillOpacity="0.3" />
              <text x="322" y="4" textAnchor="middle" fontSize="9" fill="#4ade80" fontWeight="bold" fontFamily="sans-serif">
                ✓ Sudut SELALU sama!
              </text>
            </g>
          </svg>
        </div>

        {/* Scale Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-body text-xs font-semibold text-white/70">🔢 Faktor Skala (k)</label>
            <span className="font-mono text-sm text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">
              k = {scale.toFixed(1)}×
            </span>
          </div>
          <input
            type="range"
            min="0.4"
            max="2.5"
            step="0.1"
            value={scale}
            onChange={e => setScale(parseFloat(e.target.value))}
            className="w-full h-2 rounded-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-white/30 font-body">
            <span>0.4× (lebih kecil)</span>
            <span>1× (sama)</span>
            <span>2.5× (lebih besar)</span>
          </div>
        </div>

        {/* Side Lengths Info */}
        <div className="bg-slate-800/50 rounded-lg p-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="font-body text-xs text-white/40 mb-0.5">Sisi A'B'</p>
            <p className="font-mono text-sm font-bold text-cyan-400">{sideAB.toFixed(0)} px</p>
            <p className="font-body text-xs text-white/30">({(sideAB / BASE_AB).toFixed(1)}×)</p>
          </div>
          <div>
            <p className="font-body text-xs text-white/40 mb-0.5">Sisi A'C'</p>
            <p className="font-mono text-sm font-bold text-cyan-400">{sideAC.toFixed(0)} px</p>
            <p className="font-body text-xs text-white/30">({(sideAC / BASE_AC).toFixed(1)}×)</p>
          </div>
          <div>
            <p className="font-body text-xs text-white/40 mb-0.5">Sisi B'C'</p>
            <p className="font-mono text-sm font-bold text-cyan-400">{sideBC.toFixed(0)} px</p>
            <p className="font-body text-xs text-white/30">({(sideBC / BASE_BC).toFixed(1)}×)</p>
          </div>
        </div>

        {/* Rotate & Flip Controls */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <p className="font-body text-xs font-semibold text-white/60">🔄 Putar (Rotasi)</p>
            <div className="flex gap-1.5">
              <button
                onClick={() => setRotation(r => r - 45)}
                className="flex-1 py-2 text-xs rounded-lg bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 font-body cursor-pointer transition-all active:scale-95"
              >
                ↺ −45°
              </button>
              <button
                onClick={() => setRotation(r => r + 45)}
                className="flex-1 py-2 text-xs rounded-lg bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 font-body cursor-pointer transition-all active:scale-95"
              >
                ↻ +45°
              </button>
            </div>
            <p className="font-body text-xs text-indigo-400/70 text-center">
              Diputar: {((rotation % 360) + 360) % 360}°
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="font-body text-xs font-semibold text-white/60">🪞 Balik / Cermin</p>
            <div className="flex gap-1.5">
              <button
                onClick={() => setFlipH(f => !f)}
                className={`flex-1 py-2 text-xs rounded-lg font-body cursor-pointer transition-all active:scale-95 ${
                  flipH
                    ? "bg-pink-500/50 text-white border border-pink-400/50"
                    : "bg-pink-500/15 hover:bg-pink-500/30 text-pink-300"
                }`}
              >
                ↔ Kiri-Kanan
              </button>
              <button
                onClick={() => setFlipV(f => !f)}
                className={`flex-1 py-2 text-xs rounded-lg font-body cursor-pointer transition-all active:scale-95 ${
                  flipV
                    ? "bg-pink-500/50 text-white border border-pink-400/50"
                    : "bg-pink-500/15 hover:bg-pink-500/30 text-pink-300"
                }`}
              >
                ↕ Atas-Bawah
              </button>
            </div>
            <p className="font-body text-xs text-pink-400/70 text-center">
              {flipH && flipV ? "Cermin H + V aktif" : flipH ? "Cermin Horizontal aktif" : flipV ? "Cermin Vertikal aktif" : "Tidak dicerminkan"}
            </p>
          </div>
        </div>

        {/* Status / Info */}
        <div className="bg-green-500/10 border border-green-500/25 rounded-lg p-3 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <p className="font-body text-xs font-semibold text-green-300">SEBANGUN (∼) — Terbukti!</p>
          </div>
          <p className="font-body text-xs text-white/60 leading-relaxed">{statusNote}</p>
          <div className="bg-slate-900/50 rounded p-2 font-mono text-xs text-white/70 space-y-0.5">
            <p>
              A'B'/AB = {sideAB.toFixed(0)}/{BASE_AB} ={" "}
              <span className="text-cyan-400">{(sideAB / BASE_AB).toFixed(2)}</span>
            </p>
            <p>
              A'C'/AC = {sideAC.toFixed(0)}/{BASE_AC} ={" "}
              <span className="text-cyan-400">{(sideAC / BASE_AC).toFixed(2)}</span>
            </p>
            <p>
              B'C'/BC = {sideBC.toFixed(0)}/{BASE_BC} ={" "}
              <span className="text-cyan-400">{(sideBC / BASE_BC).toFixed(2)}</span>
            </p>
            <p className="text-green-400 pt-0.5">
              ✓ Semua rasio sama = k = {scale.toFixed(2)} → SEBANGUN
            </p>
          </div>
        </div>

        {/* Kekongruenan Note */}
        <div className="bg-purple-500/10 border border-purple-500/25 rounded-lg p-3">
          <p className="font-body text-xs font-semibold text-purple-300 mb-1">
            💡 Kapan menjadi KONGRUEN (≅)?
          </p>
          <p className="font-body text-xs text-white/60 leading-relaxed">
            Jika k = 1.0 (skala tetap 1×), maka sisi-sisi juga sama panjang → dua bangun sebangun yang ukurannya sama disebut{" "}
            <strong className="text-purple-300">kongruen</strong>. Rotasi dan cermin boleh, asal ukuran tidak berubah!
          </p>
          {Math.abs(scale - 1.0) < 0.05 && (
            <div className="mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <p className="font-body text-xs font-semibold text-purple-300">
                k ≈ 1.0 sekarang → Bangun ini KONGRUEN! (≅)
              </p>
            </div>
          )}
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-600/60 text-white/50 hover:text-white text-xs font-body cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset ke Posisi Awal
        </button>
      </div>
    </div>
  );
}
