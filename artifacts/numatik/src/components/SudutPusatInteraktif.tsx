import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";

const VW = 300, VH = 280;
const Ox = 150, Oy = 140, R = 105;

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

function ptAt(angleDeg: number) {
  return {
    x: Ox + R * Math.cos(toRad(angleDeg)),
    y: Oy - R * Math.sin(toRad(angleDeg)),
  };
}

const f = (n: number) => n.toFixed(1);

function arcPath(a1: number, a2: number, large: 0 | 1, sweep: 0 | 1) {
  const p1 = ptAt(a1), p2 = ptAt(a2);
  return `M ${f(p1.x)},${f(p1.y)} A ${R},${R} 0 ${large} ${sweep} ${f(p2.x)},${f(p2.y)}`;
}

function wedge(cx: number, cy: number, r: number, a1: number, a2: number) {
  const r1 = toRad(a1), r2 = toRad(a2);
  const p1 = { x: cx + r * Math.cos(r1), y: cy - r * Math.sin(r1) };
  const p2 = { x: cx + r * Math.cos(r2), y: cy - r * Math.sin(r2) };
  const span = ((a2 - a1) + 360) % 360;
  const large = span > 180 ? 1 : 0;
  return `M ${cx},${cy} L ${f(p1.x)},${f(p1.y)} A ${r},${r} 0 ${large} 0 ${f(p2.x)},${f(p2.y)} Z`;
}

const translations = {
  id: {
    svgAria: "Animasi interaktif sudut pusat dan sudut keliling",
    centralBadge: "⭐ Sudut Pusat ∠AOB",
    inscribedBadge: "🔵 Sudut Keliling ∠ACB",
    alwaysValid: "✓ selalu berlaku!",
    dragHint: "geser ✋",
    sliderLabel: "🎯 Besar Busur AB (Sudut Pusat)",
    presetLabel: "Coba preset busur:",
    infoText: (inscribed: number, central: number) =>
      `Geser titik C ke manapun di sepanjang busur besar — sudut keliling ∠ACB tetap selalu ${inscribed}° (setengah dari sudut pusat ${central}°)! Ini adalah bukti bahwa posisi C tidak mempengaruhi besar sudut keliling, selama menghadap busur yang sama.`,
    infoC: "Geser titik C",
    infoPos: "posisi C tidak mempengaruhi besar sudut keliling",
  },
  en: {
    svgAria: "Interactive animation of central and inscribed angles",
    centralBadge: "⭐ Central Angle ∠AOB",
    inscribedBadge: "🔵 Inscribed Angle ∠ACB",
    alwaysValid: "✓ always holds!",
    dragHint: "drag ✋",
    sliderLabel: "🎯 Arc AB size (Central Angle)",
    presetLabel: "Try arc presets:",
    infoText: (inscribed: number, central: number) =>
      `Drag point C anywhere along the major arc — the inscribed angle ∠ACB always stays ${inscribed}° (half of central angle ${central}°)! This proves that C's position does not affect the inscribed angle, as long as it faces the same arc.`,
    infoC: "Drag point C",
    infoPos: "C's position does not affect the inscribed angle",
  },
  ja: {
    svgAria: "中心角と円周角のインタラクティブアニメーション",
    centralBadge: "⭐ 中心角 ∠AOB",
    inscribedBadge: "🔵 円周角 ∠ACB",
    alwaysValid: "✓ 常に成立！",
    dragHint: "ドラッグ ✋",
    sliderLabel: "🎯 弧ABの大きさ（中心角）",
    presetLabel: "弧のプリセットを試す：",
    infoText: (inscribed: number, central: number) =>
      `点Cを大きな弧の任意の場所にドラッグしてください — 円周角∠ACBは常に${inscribed}°（中心角${central}°の半分）のままです！これはCの位置が円周角の大きさに影響しないことを証明しています（同じ弧に向き合う限り）。`,
    infoC: "点Cをドラッグ",
    infoPos: "Cの位置は円周角の大きさに影響しない",
  },
} as const;

export default function SudutPusatInteraktif() {
  const { language } = useLanguage();
  const t = translations[language];

  const [arcDeg, setArcDeg] = useState(100);
  const [cDeg, setCDeg] = useState(250);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setCDeg(prev => {
      const min = arcDeg + 5;
      const max = 355;
      return Math.max(min, Math.min(max, prev));
    });
  }, [arcDeg]);

  const svgAngleFromEvent = useCallback((clientX: number, clientY: number): number => {
    const svg = svgRef.current;
    if (!svg) return cDeg;
    const rect = svg.getBoundingClientRect();
    const scaleX = VW / rect.width;
    const scaleY = VH / rect.height;
    const mx = (clientX - rect.left) * scaleX;
    const my = (clientY - rect.top) * scaleY;
    const dx = mx - Ox;
    const dy = -(my - Oy);
    let angle = toDeg(Math.atan2(dy, dx));
    if (angle < 0) angle += 360;
    return angle;
  }, [cDeg]);

  const clampToMajorArc = useCallback((angle: number): number => {
    const min = arcDeg + 5;
    const max = 355;
    if (angle >= min && angle <= max) return angle;
    const distMin = Math.abs(angle - min);
    const distMax = Math.abs(angle - max);
    return distMin < distMax ? min : max;
  }, [arcDeg]);

  const handleMouseDown = (e: React.MouseEvent<SVGCircleElement>) => {
    e.preventDefault();
    setDragging(true);
  };
  const handleTouchStart = (e: React.TouchEvent<SVGCircleElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const angle = svgAngleFromEvent(e.clientX, e.clientY);
    setCDeg(clampToMajorArc(angle));
  }, [dragging, svgAngleFromEvent, clampToMajorArc]);

  const handleTouchMove = useCallback((e: React.TouchEvent<SVGSVGElement>) => {
    if (!dragging || !e.touches[0]) return;
    e.preventDefault();
    const angle = svgAngleFromEvent(e.touches[0].clientX, e.touches[0].clientY);
    setCDeg(clampToMajorArc(angle));
  }, [dragging, svgAngleFromEvent, clampToMajorArc]);

  const stopDrag = () => setDragging(false);

  const A  = ptAt(0);
  const B  = ptAt(arcDeg);
  const Cv = ptAt(cDeg);

  const centralAngle = arcDeg;
  const inscribedAngle = centralAngle / 2;

  const minorLarge: 0|1 = arcDeg > 180 ? 1 : 0;
  const minorArc = arcPath(0, arcDeg, minorLarge, 0);

  const majorSpan = 360 - arcDeg;
  const majorLarge: 0|1 = majorSpan > 180 ? 1 : 0;
  const majorArc = arcPath(arcDeg, 360, majorLarge, 0);

  const centralSector = wedge(Ox, Oy, 26, 0, arcDeg);

  const caDx = A.x - Cv.x, caDy = -(A.y - Cv.y);
  const cbDx = B.x - Cv.x, cbDy = -(B.y - Cv.y);
  const caAngle = toDeg(Math.atan2(caDy, caDx));
  const cbAngle = toDeg(Math.atan2(cbDy, cbDx));
  const ca = (caAngle + 360) % 360;
  const cb = (cbAngle + 360) % 360;
  const inscSectorA = Math.min(ca, cb);
  const inscSectorB = Math.max(ca, cb);
  const inscSpan = inscSectorB - inscSectorA;
  const inscribedSector = inscSpan <= 180
    ? wedge(Cv.x, Cv.y, 22, inscSectorA, inscSectorB)
    : wedge(Cv.x, Cv.y, 22, inscSectorB, inscSectorA + 360);

  const cMid = arcDeg / 2;
  const cLabelPt = { x: Ox + 38 * Math.cos(toRad(cMid)), y: Oy - 38 * Math.sin(toRad(cMid)) };

  const inscMid = (inscSectorA + inscSectorB) / 2;
  const inscLabelPt = { x: Cv.x + 32 * Math.cos(toRad(inscMid)), y: Cv.y - 32 * Math.sin(toRad(inscMid)) };

  return (
    <div className="flex flex-col items-center gap-3 px-1 py-3">
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        <div className="bg-amber-900/30 border border-amber-500/40 rounded-xl p-3 text-center">
          <p className="font-body text-[10px] text-amber-400/80 uppercase tracking-wide mb-1">{t.centralBadge}</p>
          <motion.p
            key={centralAngle}
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            className="font-display text-2xl font-black text-amber-300"
          >
            {centralAngle}°
          </motion.p>
          <p className="font-body text-[10px] text-amber-400/50 mt-0.5">= α</p>
        </div>
        <div className="bg-purple-900/30 border border-purple-500/40 rounded-xl p-3 text-center">
          <p className="font-body text-[10px] text-purple-400/80 uppercase tracking-wide mb-1">{t.inscribedBadge}</p>
          <motion.p
            key={inscribedAngle}
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            className="font-display text-2xl font-black text-purple-300"
          >
            {inscribedAngle}°
          </motion.p>
          <p className="font-body text-[10px] text-purple-400/50 mt-0.5">= α ÷ 2</p>
        </div>
      </div>

      <div className="w-full max-w-sm bg-cyan-900/20 border border-cyan-500/30 rounded-xl px-4 py-2 flex items-center justify-center gap-2">
        <span className="font-display text-sm font-bold text-amber-300">{centralAngle}°</span>
        <span className="font-body text-xs text-white/50">= 2 ×</span>
        <span className="font-display text-sm font-bold text-purple-300">{inscribedAngle}°</span>
        <span className="font-body text-xs text-cyan-400 ml-1">{t.alwaysValid}</span>
      </div>

      <div className="w-full max-w-xs sm:max-w-sm mx-auto relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VW} ${VH}`}
          className={`w-full touch-none ${dragging ? "cursor-grabbing" : "cursor-default"}`}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchMove={handleTouchMove}
          onTouchEnd={stopDrag}
          aria-label={t.svgAria}
        >
          <path d={majorArc} fill="none" stroke="#1e3a5f" strokeWidth="6" strokeLinecap="round"/>
          <path d={minorArc} fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round"/>
          <circle cx={Ox} cy={Oy} r={R} fill="rgba(6,182,212,0.05)" stroke="#06b6d430" strokeWidth="1.5"/>
          <path d={centralSector} fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.3)" strokeWidth="0.5"/>
          <path d={inscribedSector} fill="rgba(168,85,247,0.15)" stroke="rgba(168,85,247,0.3)" strokeWidth="0.5"/>
          <line x1={Ox} y1={Oy} x2={A.x} y2={A.y} stroke="#22c55e" strokeWidth="2"/>
          <line x1={Ox} y1={Oy} x2={B.x} y2={B.y} stroke="#22c55e" strokeWidth="2"/>
          <line x1={Cv.x} y1={Cv.y} x2={A.x} y2={A.y} stroke="#a855f7" strokeWidth="2"/>
          <line x1={Cv.x} y1={Cv.y} x2={B.x} y2={B.y} stroke="#a855f7" strokeWidth="2"/>
          <circle cx={Ox} cy={Oy} r="5" fill="#f59e0b"/>
          <circle cx={A.x} cy={A.y} r="6" fill="#22c55e"/>
          <circle cx={B.x} cy={B.y} r="6" fill="#22c55e"/>
          <circle
            cx={Cv.x} cy={Cv.y} r="9"
            fill="#a855f7"
            stroke="white" strokeWidth="2.5"
            className={`cursor-grab active:cursor-grabbing`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{ filter: dragging ? "drop-shadow(0 0 8px rgba(168,85,247,0.8))" : "drop-shadow(0 0 4px rgba(168,85,247,0.5))" }}
          />
          <text x={Ox + 8} y={Oy - 7} fill="#fbbf24" fontSize="12" fontWeight="bold" fontFamily="monospace">O</text>
          <text
            x={A.x + (A.x > Ox ? 8 : -20)}
            y={A.y + (A.y < Oy ? -6 : 14)}
            fill="#4ade80" fontSize="12" fontWeight="bold" fontFamily="monospace"
          >A</text>
          <text
            x={B.x + (B.x > Ox ? 8 : -20)}
            y={B.y + (B.y < Oy ? -6 : 14)}
            fill="#4ade80" fontSize="12" fontWeight="bold" fontFamily="monospace"
          >B</text>
          <text
            x={Cv.x + (Cv.x > Ox ? 12 : -22)}
            y={Cv.y + (Cv.y < Oy ? -10 : 18)}
            fill="#c084fc" fontSize="12" fontWeight="bold" fontFamily="monospace"
          >C</text>
          <text
            x={Math.max(10, Math.min(VW - 40, cLabelPt.x - 12))}
            y={Math.max(14, Math.min(VH - 10, cLabelPt.y + 4))}
            fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="monospace"
          >{centralAngle}°</text>
          <text
            x={Math.max(10, Math.min(VW - 50, inscLabelPt.x - 12))}
            y={Math.max(14, Math.min(VH - 10, inscLabelPt.y + 4))}
            fill="#c084fc" fontSize="11" fontWeight="bold" fontFamily="monospace"
          >{inscribedAngle}°</text>
          {!dragging && (
            <text
              x={Cv.x + (Cv.x > Ox ? 13 : -50)}
              y={Cv.y + (Cv.y < Oy ? -22 : 32)}
              fill="#c084fc" fontSize="9" fontFamily="monospace" opacity="0.7"
            >{t.dragHint}</text>
          )}
        </svg>
      </div>

      <div className="w-full max-w-sm space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="font-body text-xs text-white/60">
            {t.sliderLabel}
          </label>
          <span className="font-display text-xs font-bold text-amber-300">{arcDeg}°</span>
        </div>
        <input
          type="range"
          min={10}
          max={350}
          step={5}
          value={arcDeg}
          onChange={e => {
            const v = Number(e.target.value);
            setArcDeg(v);
            playPopSound();
          }}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #f59e0b ${((arcDeg-10)/340)*100}%, rgba(255,255,255,0.15) ${((arcDeg-10)/340)*100}%)`,
          }}
        />
        <div className="flex justify-between font-body text-[10px] text-white/30">
          <span>10°</span>
          <span>90°</span>
          <span>180°</span>
          <span>270°</span>
          <span>350°</span>
        </div>
      </div>

      <div className="w-full max-w-sm">
        <p className="font-body text-[10px] text-white/40 mb-2">{t.presetLabel}</p>
        <div className="grid grid-cols-4 gap-1.5">
          {[60, 90, 120, 180].map(v => (
            <button
              key={v}
              onClick={() => { setArcDeg(v); playPopSound(); }}
              className={`py-1.5 rounded-lg font-display text-xs font-bold transition cursor-pointer border ${
                arcDeg === v
                  ? "bg-amber-500/20 border-amber-500/60 text-amber-300"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
              }`}
            >
              {v}°
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-3">
        <p className="font-body text-xs text-white/65 leading-relaxed">
          💡 <strong className="text-cyan-300">{t.infoC}</strong>{" "}
          {t.infoText(inscribedAngle, centralAngle).split(t.infoC)[1]?.split(t.infoPos)[0]}
          <strong className="text-amber-300">{t.infoPos}</strong>
          {t.infoText(inscribedAngle, centralAngle).split(t.infoPos)[1]}
        </p>
      </div>
    </div>
  );
}
