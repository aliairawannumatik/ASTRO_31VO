import { useState } from "react";
import { RotateCcw } from "lucide-react";
import type { Language } from "@/contexts/LanguageContext";

const VA_COLOR = "#f97316";
const VB_COLOR = "#22d3ee";
const VC_COLOR = "#a855f7";

const REF_A = { x: 82, y: 128 };
const REF_B = { x: 127, y: 128 };
const REF_C = { x: 82, y: 68 };

const TRF_CX = 305;
const TRF_CY = 140;

const BASE_AB = 45;
const BASE_AC = 60;
const BASE_BC = 75;

const translations = {
  id: {
    header:        "Simulasi Interaktif — Konsep Kesebangunan",
    svgRef:        "REFERENSI (△ABC)",
    svgSimilar:    "sebangun",
    svgResult:     (k: string) => `HASIL (k = ${k}×)`,
    scaleLabel:    "🔢 Faktor Skala (k)",
    scaleMin:      "0.4× (lebih kecil)",
    scaleMid:      "1× (sama)",
    scaleMax:      "2.5× (lebih besar)",
    sideAB:        "Sisi A′B′",
    sideAC:        "Sisi A′C′",
    sideBC:        "Sisi B′C′",
    rotateTitle:   "🔄 Putar (Rotasi)",
    rotated:       (deg: number) => `Diputar: ${deg}°`,
    flipTitle:     "🪞 Balik / Cermin",
    flipH:         "↔ Kiri-Kanan",
    flipV:         "↕ Atas-Bawah",
    mirrorHV:      "Cermin H + V aktif",
    mirrorH:       "Cermin Horizontal aktif",
    mirrorV:       "Cermin Vertikal aktif",
    mirrorNone:    "Tidak dicerminkan",
    statusDefault: "Coba geser slider, putar, atau balikkan segitiga!",
    statusScaled:  (k: string) => `Diperbesar/dikecilkan ${k}×. Sudut tetap sama → masih SEBANGUN!`,
    statusRotated: (deg: number) => `Diputar ${deg}°. Sudut tetap sama → masih SEBANGUN!`,
    statusFlipped: (h: string, v: string) => `Dicerminkan${h}${v}. Sudut tetap sama → masih SEBANGUN!`,
    statusAll:     "Diskala, diputar, dicerminkan — tapi sudut selalu tetap 90°, 53°, 37°. SEBANGUN!",
    statusBadge:   "SEBANGUN (∼) — Terbukti!",
    ratioEqual:    (k: string) => `✓ Semua rasio sama = k = ${k} → SEBANGUN`,
    congrTitle:    "💡 Kapan menjadi KONGRUEN (≅)?",
    congrBody:     (
      <>
        Jika k = 1.0 (skala tetap 1×), maka sisi-sisi juga sama panjang → dua bangun sebangun
        yang ukurannya sama disebut{" "}
        <strong className="text-purple-300">kongruen</strong>. Rotasi dan cermin boleh, asal
        ukuran tidak berubah!
      </>
    ),
    congrActive:   "k ≈ 1.0 sekarang → Bangun ini KONGRUEN! (≅)",
    resetBtn:      "Reset ke Posisi Awal",
    flipHWord:     " horizontal",
    flipVWord:     " vertikal",
  },
  en: {
    header:        "Interactive Simulation — Similarity Concept",
    svgRef:        "REFERENCE (△ABC)",
    svgSimilar:    "similar",
    svgResult:     (k: string) => `RESULT (k = ${k}×)`,
    scaleLabel:    "🔢 Scale Factor (k)",
    scaleMin:      "0.4× (smaller)",
    scaleMid:      "1× (same)",
    scaleMax:      "2.5× (larger)",
    sideAB:        "Side A′B′",
    sideAC:        "Side A′C′",
    sideBC:        "Side B′C′",
    rotateTitle:   "🔄 Rotate",
    rotated:       (deg: number) => `Rotated: ${deg}°`,
    flipTitle:     "🪞 Flip / Mirror",
    flipH:         "↔ Left-Right",
    flipV:         "↕ Up-Down",
    mirrorHV:      "H + V Mirror active",
    mirrorH:       "Horizontal Mirror active",
    mirrorV:       "Vertical Mirror active",
    mirrorNone:    "No mirror",
    statusDefault: "Try sliding, rotating, or flipping the triangle!",
    statusScaled:  (k: string) => `Scaled ${k}×. Angles unchanged → still SIMILAR!`,
    statusRotated: (deg: number) => `Rotated ${deg}°. Angles unchanged → still SIMILAR!`,
    statusFlipped: (h: string, v: string) => `Mirrored${h}${v}. Angles unchanged → still SIMILAR!`,
    statusAll:     "Scaled, rotated, mirrored — but angles always stay 90°, 53°, 37°. SIMILAR!",
    statusBadge:   "SIMILAR (∼) — Proven!",
    ratioEqual:    (k: string) => `✓ All ratios equal = k = ${k} → SIMILAR`,
    congrTitle:    "💡 When does it become CONGRUENT (≅)?",
    congrBody:     (
      <>
        When k = 1.0 (scale stays 1×), the sides are also equal → two similar figures with the
        same size are called{" "}
        <strong className="text-purple-300">congruent</strong>. Rotation and mirroring are
        allowed, as long as size doesn't change!
      </>
    ),
    congrActive:   "k ≈ 1.0 now → This figure is CONGRUENT! (≅)",
    resetBtn:      "Reset to Initial Position",
    flipHWord:     " horizontally",
    flipVWord:     " vertically",
  },
  ja: {
    header:        "インタラクティブシミュレーション — 相似の概念",
    svgRef:        "参照 (△ABC)",
    svgSimilar:    "相似",
    svgResult:     (k: string) => `結果 (k = ${k}×)`,
    scaleLabel:    "🔢 スケール係数 (k)",
    scaleMin:      "0.4×（小さく）",
    scaleMid:      "1×（同じ）",
    scaleMax:      "2.5×（大きく）",
    sideAB:        "辺A′B′",
    sideAC:        "辺A′C′",
    sideBC:        "辺B′C′",
    rotateTitle:   "🔄 回転",
    rotated:       (deg: number) => `回転: ${deg}°`,
    flipTitle:     "🪞 反転 / 鏡像",
    flipH:         "↔ 左右",
    flipV:         "↕ 上下",
    mirrorHV:      "水平・垂直反転中",
    mirrorH:       "水平反転中",
    mirrorV:       "垂直反転中",
    mirrorNone:    "反転なし",
    statusDefault: "スライダーを動かしたり、回転・反転してみよう！",
    statusScaled:  (k: string) => `${k}×スケール。角度は変わらず → まだ相似！`,
    statusRotated: (deg: number) => `${deg}°回転。角度は変わらず → まだ相似！`,
    statusFlipped: (h: string, v: string) => `反転${h}${v}。角度は変わらず → まだ相似！`,
    statusAll:     "スケール・回転・反転 — でも角度は常に90°、53°、37°。相似！",
    statusBadge:   "相似 (∼) — 証明済み！",
    ratioEqual:    (k: string) => `✓ すべての比が等しい = k = ${k} → 相似`,
    congrTitle:    "💡 いつ合同（≅）になる？",
    congrBody:     (
      <>
        k = 1.0（スケール1×）のとき、辺の長さも等しくなり → 大きさが同じ2つの相似な図形を
        <strong className="text-purple-300">合同</strong>と呼ぶ。
        サイズが変わらなければ、回転・反転は構わない！
      </>
    ),
    congrActive:   "k ≈ 1.0 現在 → この図形は合同！（≅）",
    resetBtn:      "初期位置にリセット",
    flipHWord:     "（水平）",
    flipVWord:     "（垂直）",
  },
} as const;

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

interface Props {
  lang?: Language;
}

export default function SimilarityAnimation({ lang = "id" }: Props) {
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const t = translations[lang] ?? translations.id;

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

  const degNorm = ((rotation % 360) + 360) % 360;

  let statusNote: string;
  if (isResized && !isRotated && !isFlipped)
    statusNote = t.statusScaled(scale.toFixed(1));
  else if (isRotated && !isFlipped)
    statusNote = t.statusRotated(degNorm);
  else if (isFlipped && !isRotated)
    statusNote = t.statusFlipped(
      flipH ? t.flipHWord : "",
      flipV ? t.flipVWord : ""
    );
  else if (isResized || isRotated || isFlipped)
    statusNote = t.statusAll;
  else
    statusNote = t.statusDefault;

  const mirrorStatus = flipH && flipV
    ? t.mirrorHV
    : flipH
    ? t.mirrorH
    : flipV
    ? t.mirrorV
    : t.mirrorNone;

  return (
    <div className="rounded-xl border border-blue-500/30 bg-slate-900/60 overflow-hidden">
      <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-3 flex items-center gap-2">
        <span className="text-lg">📐</span>
        <span className="font-body font-semibold text-blue-300 text-sm">
          {t.header}
        </span>
      </div>

      <div className="p-4 space-y-4">

        {/* SVG Canvas */}
        <div className="bg-slate-800/60 rounded-xl overflow-hidden border border-slate-700/50">
          <svg viewBox="0 0 410 195" className="w-full">
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
            <text x="103" y="18" textAnchor="middle" fontSize="9.5" fill="#64748b" fontFamily="sans-serif" letterSpacing="0.5">
              {t.svgRef}
            </text>

            <polygon
              points={`${REF_A.x},${REF_A.y} ${REF_B.x},${REF_B.y} ${REF_C.x},${REF_C.y}`}
              fill="#22d3ee"
              fillOpacity="0.12"
              stroke="#22d3ee"
              strokeWidth="2"
              strokeLinejoin="round"
            />

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

            {/* Angle arc at B (53°) */}
            <path d="M 114,128 A 13,13 0 0,1 119,118" fill="none" stroke={VB_COLOR} strokeWidth="1.5" />

            {/* Angle arc at C (37°) */}
            <path d="M 82,76 A 8,8 0 0,0 87,74" fill="none" stroke={VC_COLOR} strokeWidth="1.5" />

            {/* ── SIMILARITY SYMBOL ── */}
            <text x="200" y="100" textAnchor="middle" fontSize="26" fill="#facc15" fontWeight="bold">∼</text>
            <text x="200" y="117" textAnchor="middle" fontSize="8" fill="#a16207" fontFamily="sans-serif">
              {t.svgSimilar}
            </text>

            {/* ── TRANSFORMED TRIANGLE ── */}
            <text x="305" y="18" textAnchor="middle" fontSize="9.5" fill="#60a5fa" fontFamily="sans-serif" letterSpacing="0.5">
              {t.svgResult(scale.toFixed(1))}
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

              {/* Angle arc at B (53°) */}
              <path d={`M ${BASE_AB - 13},0 A 13,13 0 0,1 ${BASE_AB - 7.8},${-10.4}`} fill="none" stroke={VB_COLOR} strokeWidth="1.5" />

              {/* Angle arc at C (37°) */}
              <path d={`M 0,${-BASE_AC + 8} A 8,8 0 0,0 ${4.8},${-BASE_AC + 6.4}`} fill="none" stroke={VC_COLOR} strokeWidth="1.5" />
            </g>

          </svg>
        </div>

        {/* Scale Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-body text-xs font-semibold text-white/70">{t.scaleLabel}</label>
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
            <span>{t.scaleMin}</span>
            <span>{t.scaleMid}</span>
            <span>{t.scaleMax}</span>
          </div>
        </div>

        {/* Side Lengths Info */}
        <div className="bg-slate-800/50 rounded-lg p-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="font-body text-xs text-white/40 mb-0.5">{t.sideAB}</p>
            <p className="font-mono text-sm font-bold text-cyan-400">{sideAB.toFixed(0)} px</p>
            <p className="font-body text-xs text-white/30">({(sideAB / BASE_AB).toFixed(1)}×)</p>
          </div>
          <div>
            <p className="font-body text-xs text-white/40 mb-0.5">{t.sideAC}</p>
            <p className="font-mono text-sm font-bold text-cyan-400">{sideAC.toFixed(0)} px</p>
            <p className="font-body text-xs text-white/30">({(sideAC / BASE_AC).toFixed(1)}×)</p>
          </div>
          <div>
            <p className="font-body text-xs text-white/40 mb-0.5">{t.sideBC}</p>
            <p className="font-mono text-sm font-bold text-cyan-400">{sideBC.toFixed(0)} px</p>
            <p className="font-body text-xs text-white/30">({(sideBC / BASE_BC).toFixed(1)}×)</p>
          </div>
        </div>

        {/* Rotate & Flip Controls */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <p className="font-body text-xs font-semibold text-white/60">{t.rotateTitle}</p>
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
              {t.rotated(degNorm)}
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="font-body text-xs font-semibold text-white/60">{t.flipTitle}</p>
            <div className="flex gap-1.5">
              <button
                onClick={() => setFlipH(f => !f)}
                className={`flex-1 py-2 text-xs rounded-lg font-body cursor-pointer transition-all active:scale-95 ${
                  flipH
                    ? "bg-pink-500/50 text-white border border-pink-400/50"
                    : "bg-pink-500/15 hover:bg-pink-500/30 text-pink-300"
                }`}
              >
                {t.flipH}
              </button>
              <button
                onClick={() => setFlipV(f => !f)}
                className={`flex-1 py-2 text-xs rounded-lg font-body cursor-pointer transition-all active:scale-95 ${
                  flipV
                    ? "bg-pink-500/50 text-white border border-pink-400/50"
                    : "bg-pink-500/15 hover:bg-pink-500/30 text-pink-300"
                }`}
              >
                {t.flipV}
              </button>
            </div>
            <p className="font-body text-xs text-pink-400/70 text-center">
              {mirrorStatus}
            </p>
          </div>
        </div>

        {/* Status / Info */}
        <div className="bg-green-500/10 border border-green-500/25 rounded-lg p-3 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <p className="font-body text-xs font-semibold text-green-300">{t.statusBadge}</p>
          </div>
          <p className="font-body text-xs text-white/60 leading-relaxed">{statusNote}</p>
          <div className="bg-slate-900/50 rounded p-2 font-mono text-xs text-white/70 space-y-0.5">
            <p>
              A′B′/AB = {sideAB.toFixed(0)}/{BASE_AB} ={" "}
              <span className="text-cyan-400">{(sideAB / BASE_AB).toFixed(2)}</span>
            </p>
            <p>
              A′C′/AC = {sideAC.toFixed(0)}/{BASE_AC} ={" "}
              <span className="text-cyan-400">{(sideAC / BASE_AC).toFixed(2)}</span>
            </p>
            <p>
              B′C′/BC = {sideBC.toFixed(0)}/{BASE_BC} ={" "}
              <span className="text-cyan-400">{(sideBC / BASE_BC).toFixed(2)}</span>
            </p>
            <p className="text-green-400 pt-0.5">
              {t.ratioEqual(scale.toFixed(2))}
            </p>
          </div>
        </div>

        {/* Kekongruenan / Congruence Note */}
        <div className="bg-purple-500/10 border border-purple-500/25 rounded-lg p-3">
          <p className="font-body text-xs font-semibold text-purple-300 mb-1">
            {t.congrTitle}
          </p>
          <p className="font-body text-xs text-white/60 leading-relaxed">
            {t.congrBody}
          </p>
          {Math.abs(scale - 1.0) < 0.05 && (
            <div className="mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <p className="font-body text-xs font-semibold text-purple-300">
                {t.congrActive}
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
          {t.resetBtn}
        </button>
      </div>
    </div>
  );
}
