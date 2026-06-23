import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

/* ─── Tipe Produk ─────────────────────────────────────────────── */
interface Produk {
  id: number;
  emoji: string;
  isiEmoji: string;
  bungkusEmoji: string;
  nama: string;
  isi: string;
  bungkus: string;
  netto: number;
  tara: number;
  warna: string;
  warnaBg: string;
  /* Apakah produk ini menampilkan isi DI DALAM bungkus? */
  brutoStack?: boolean;
}

const PRODUK: Produk[] = [
  { id:1, emoji:"🎁", isiEmoji:"🧸", bungkusEmoji:"📦", nama:"Kado",       isi:"Boneka Teddy",    bungkus:"Kotak Kardus",    netto:850,  tara:350, warna:"#e53e3e", warnaBg:"#fff5f5" },
  { id:2, emoji:"🍎", isiEmoji:"🍎", bungkusEmoji:"🧺", nama:"Apel",       isi:"Apel Segar",      bungkus:"Keranjang Rotan", netto:1200, tara:450, warna:"#38a169", warnaBg:"#f0fff4", brutoStack:true },
  { id:3, emoji:"🧃", isiEmoji:"💧", bungkusEmoji:"🥡", nama:"Jus Mangga", isi:"Jus Segar",       bungkus:"Kotak Tetrapack", netto:500,  tara:120, warna:"#d69e2e", warnaBg:"#fffff0" },
  { id:4, emoji:"🍚", isiEmoji:"🌾", bungkusEmoji:"👜", nama:"Beras",      isi:"Beras Organik",   bungkus:"Karung Plastik",  netto:5000, tara:280, warna:"#d97706", warnaBg:"#fffbeb" },
  { id:5, emoji:"🍫", isiEmoji:"🍫", bungkusEmoji:"🥫", nama:"Coklat",     isi:"Coklat Premium",  bungkus:"Kotak Kaleng",    netto:320,  tara:195, warna:"#92400e", warnaBg:"#fff7ed" },
  { id:6, emoji:"🥛", isiEmoji:"🥛", bungkusEmoji:"🫙", nama:"Susu",       isi:"Susu Full Cream", bungkus:"Botol Kaca",      netto:750,  tara:330, warna:"#2b6cb0", warnaBg:"#ebf8ff" },
];

/* Produk apel: isi di dalam bungkus (apple in basket) */
const renderBrutoEmoji = (p: Produk) => {
  if (p.brutoStack) {
    return (
      <div className="relative flex items-end justify-center" style={{ width: 72, height: 72 }}>
        <span className="text-5xl absolute bottom-0">{p.bungkusEmoji}</span>
        <span className="text-3xl absolute bottom-5 z-10">{p.isiEmoji}</span>
      </div>
    );
  }
  /* Default: bungkus di samping kanan-atas isi */
  return (
    <div className="relative">
      <span className="text-5xl">{p.emoji}</span>
      <span className="absolute -top-2 -right-5 text-2xl">{p.bungkusEmoji}</span>
    </div>
  );
};

/* ─── Skala timbangan nyata ─────────────────────────────────── */
const getScaleMax = (g: number) => {
  if (g <= 1000) return 1000;
  if (g <= 2000) return 2000;
  if (g <= 3000) return 3000;
  if (g <= 5000) return 5000;
  return 10000;
};

const fmtG = (g: number): string =>
  g >= 1000
    ? (g % 1000 === 0 ? g / 1000 + " kg" : (g / 1000).toFixed(2) + " kg")
    : g + " g";

/* ─── Dial Timbangan SVG ─────────────────────────────────────── */
const DialScale = ({
  weightG, maxG, color, label,
}: { weightG: number; maxG: number; color: string; label: string }) => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const ratio = Math.min(Math.max(weightG / maxG, 0), 1);
  const needleDeg = ratio * 180 - 90;
  /* SVG arc angle: 180°(kiri/0g) → 270°(atas/50%) → 360°(kanan/max) */
  const arcAngle = (r: number) => 180 + r * 180;

  const intervals: Record<number, number> = {
    1000:100, 2000:200, 3000:300, 5000:500, 10000:1000,
  };
  const interval = intervals[maxG] ?? Math.round(maxG / 10);
  const numDiv   = maxG / interval;
  const CX = 95, CY = 88, R = 68;

  const ticks = Array.from({ length: numDiv + 1 }, (_, i) => {
    const r  = i / numDiv;
    const rd = toRad(arcAngle(r));
    const isMajor = i % (numDiv / 5) === 0;
    const r1 = R, r2 = isMajor ? R - 13 : R - 6;
    return {
      x1: (CX + r1 * Math.cos(rd)).toFixed(2),
      y1: (CY + r1 * Math.sin(rd)).toFixed(2),
      x2: (CX + r2 * Math.cos(rd)).toFixed(2),
      y2: (CY + r2 * Math.sin(rd)).toFixed(2),
      isMajor,
    };
  });

  const labelPts = [0, 0.25, 0.5, 0.75, 1].map((r) => {
    const rd = toRad(arcAngle(r));
    return {
      x: (CX + (R - 22) * Math.cos(rd)).toFixed(2),
      y: (CY + (R - 22) * Math.sin(rd)).toFixed(2),
      text: fmtG(Math.round(maxG * r)),
    };
  });

  const arcD = (() => {
    if (ratio <= 0) return null;
    const rr = R - 4;
    const sx = (CX + rr * Math.cos(toRad(arcAngle(0)))).toFixed(2);
    const sy = (CY + rr * Math.sin(toRad(arcAngle(0)))).toFixed(2);
    const ex = (CX + rr * Math.cos(toRad(arcAngle(ratio)))).toFixed(2);
    const ey = (CY + rr * Math.sin(toRad(arcAngle(ratio)))).toFixed(2);
    return `M${CX},${CY} L${sx},${sy} A${rr},${rr} 0 ${ratio > 0.5 ? 1 : 0},1 ${ex},${ey} Z`;
  })();

  return (
    <svg width="190" height="105" viewBox="0 0 190 105" fill="none">
      <path d={`M${CX-R},${CY} A${R},${R} 0 0,1 ${CX+R},${CY}`} fill="white" />
      {arcD && <path d={arcD} fill={color} opacity="0.18" />}
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={t.isMajor ? "#475569" : "#94a3b8"} strokeWidth={t.isMajor ? 2 : 1} />
      ))}
      {labelPts.map((l, i) => (
        <text key={i} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle"
          fontSize="7" fill="#334155" fontWeight="bold">{l.text}</text>
      ))}
      <path d={`M${CX-R},${CY} A${R},${R} 0 0,1 ${CX+R},${CY}`}
        fill="none" stroke="#cbd5e0" strokeWidth="2.5" />

      {/* Jarum */}
      <motion.g
        style={{ originX: `${CX}px`, originY: `${CY}px` }}
        animate={{ rotate: needleDeg }}
        transition={{ type: "spring", stiffness: 48, damping: 11 }}
      >
        <line x1={CX} y1={CY} x2={CX} y2={CY-55}
          stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1={CX} y1={CY} x2={CX} y2={CY+9}
          stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.35" />
        <polygon points={`${CX},${CY-57} ${CX-3},${CY-45} ${CX+3},${CY-45}`} fill={color} />
      </motion.g>
      <circle cx={CX} cy={CY} r="7" fill={color} />
      <circle cx={CX} cy={CY} r="3.5" fill="white" />

      {/* Display digital */}
      <rect x={CX-36} y={CY-25} width="72" height="21" rx="5" fill={color} />
      <rect x={CX-35} y={CY-24} width="70" height="19" rx="4" fill="rgba(0,0,0,0.28)" />
      <motion.text
        key={weightG} x={CX} y={CY-12} textAnchor="middle"
        fontSize="10" fill="white" fontWeight="bold" fontFamily="monospace"
        initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
      >
        {weightG > 0 ? fmtG(weightG) : "0 g"}
      </motion.text>

      {/* Base */}
      <rect x="8" y="90" width="174" height="12" rx="6" fill="#e2e8f0" />
      <rect x="12" y="93" width="166" height="6" rx="3" fill="#cbd5e0" />
      <text x={CX} y="99" textAnchor="middle" fontSize="6" fill="#64748b" fontWeight="bold">
        {label || "TIMBANGAN"}
      </text>
    </svg>
  );
};

/* ─── Kartu Produk (draggable) ───────────────────────────────── */
const ProdukCard = ({
  p, selected, onSelect, onDragEnd, setDragging,
}: {
  p: Produk; selected: boolean;
  onSelect: () => void;
  onDragEnd: (p: Produk, info: PanInfo) => void;
  setDragging: (v: boolean) => void;
}) => (
  <motion.div className="relative flex flex-col items-center gap-0.5">
    <motion.div
      drag dragSnapToOrigin dragElastic={0.15}
      whileDrag={{
        scale: 1.35,
        zIndex: 50,
        backgroundColor: p.warna,          /* warna produk saat drag — tidak putih */
        boxShadow: `0 12px 40px ${p.warna}88`,
        borderColor: p.warna,
      }}
      onDragStart={() => setDragging(true)}
      onDragEnd={(_, info) => { setDragging(false); onDragEnd(p, info); }}
      onClick={onSelect}
      className="flex flex-col items-center gap-1 p-2.5 rounded-2xl border-2 select-none touch-none transition-all"
      style={selected
        ? { borderColor: p.warna, backgroundColor: p.warnaBg, boxShadow: `0 0 0 3px ${p.warna}44`, cursor: "grab" }
        : { borderColor: "#e2e8f0", backgroundColor: "white", cursor: "grab" }}
      animate={selected ? { scale: 1.06 } : { scale: 1 }}
      whileHover={{ scale: 1.05, borderColor: p.warna, backgroundColor: p.warnaBg }}
    >
      {selected && <div className="absolute -top-2 -right-2 text-sm z-10">✅</div>}
      <span className="text-3xl">{p.emoji}</span>
      <span className="text-xs font-black text-gray-700 text-center leading-tight">{p.nama}</span>
      <span className="text-xs text-gray-400">{fmtG(p.netto + p.tara)}</span>
      {/* Grip icon */}
      <div className="flex gap-0.5 mt-0.5">
        {[0,1,2].map(i => (
          <div key={i} className="flex flex-col gap-0.5">
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="w-1 h-1 rounded-full bg-gray-300" />
          </div>
        ))}
      </div>
    </motion.div>
    <span className="text-xs text-gray-400 leading-none">↕ seret</span>
  </motion.div>
);

/* ─── Kotak Hasil ─────────────────────────────────────────────── */
const HasilBox = ({
  label, sublabel, value, icon, color, bg, border, shown,
}: {
  label: string; sublabel: string; value: string;
  icon: string; color: string; bg: string; border: string; shown: boolean;
}) => (
  <motion.div
    className={`rounded-2xl border-2 p-3 flex flex-col items-center gap-1 ${bg} ${border}`}
    animate={shown ? { scale: [0.88, 1.06, 1], opacity: 1 } : { opacity: 0.3, scale: 0.95 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
  >
    <span className="text-2xl">{icon}</span>
    <span className={`text-xs font-black uppercase tracking-wide ${color}`}>{label}</span>
    <span className="text-xs text-gray-500 text-center leading-tight">{sublabel}</span>
    <motion.span
      key={value + shown} className={`font-black text-base ${color}`}
      initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {shown ? value : "—"}
    </motion.span>
  </motion.div>
);

/* ─── KOMPONEN UTAMA ──────────────────────────────────────────── */
type Stage = "idle" | "bruto" | "separating" | "separated" | "complete";
type WeighType = "none" | "netto" | "tara";

const TimbanganBNT = () => {
  const [selected, setSelected]         = useState<Produk | null>(null);
  const [stage, setStage]               = useState<Stage>("idle");
  const [weighType, setWeighType]       = useState<WeighType>("none");
  const [showBruto, setShowBruto]       = useState(false);
  const [showNetto, setShowNetto]       = useState(false);
  const [showTara, setShowTara]         = useState(false);
  const [isDraggingAny, setIsDraggingAny] = useState(false);

  const dropZoneRef = useRef<HTMLDivElement>(null);

  const bruto   = selected ? selected.netto + selected.tara : 0;
  const netto   = selected ? selected.netto : 0;
  const tara    = selected ? selected.tara  : 0;
  const pctTara = bruto > 0 ? (tara / bruto) * 100 : 0;
  const scaleMax = selected ? getScaleMax(bruto * 1.05) : 2000;

  const displayWeight =
    stage === "bruto" || stage === "separating" ? bruto
    : weighType === "netto" ? netto
    : weighType === "tara" ? tara
    : 0;

  const scaleColor =
    stage === "bruto" || stage === "separating" ? "#dd6b20"
    : weighType === "netto" ? "#16a34a"
    : weighType === "tara" ? "#2563eb"
    : "#94a3b8";

  const scaleLabel =
    stage === "bruto" || stage === "separating" ? `BRUTO: ${fmtG(bruto)}`
    : weighType === "netto" ? `NETTO: ${fmtG(netto)}`
    : weighType === "tara" ? `TARA: ${fmtG(tara)}`
    : `MAX ${fmtG(scaleMax)}`;

  const resetWith = useCallback((p: Produk) => {
    setSelected(p); setStage("idle"); setWeighType("none");
    setShowBruto(false); setShowNetto(false); setShowTara(false);
  }, []);

  const doTimbanBruto = useCallback((p: Produk) => {
    setSelected(p); setStage("bruto"); setWeighType("none");
    setShowNetto(false); setShowTara(false);
    setTimeout(() => setShowBruto(true), 700);
  }, []);

  const doPisahkan = useCallback(async () => {
    setStage("separating");
    /* tampilkan animasi pisah selama 1.2 detik lalu selesai */
    await new Promise(r => setTimeout(r, 1200));
    setStage("separated");
    setWeighType("none");
  }, []);

  const doTimbanNetto = useCallback(() => {
    setWeighType("netto");
    setTimeout(() => setShowNetto(true), 600);
  }, []);

  const doTimbanTara = useCallback(() => {
    setWeighType("tara");
    setTimeout(() => setShowTara(true), 600);
  }, []);

  const isComplete = showBruto && showNetto && showTara;

  /* Drag drop: cek koordinat vs drop zone (termasuk scroll) */
  const handleDragEnd = useCallback((p: Produk, info: PanInfo) => {
    const rect = dropZoneRef.current?.getBoundingClientRect();
    if (!rect) return;
    const sx = window.scrollX ?? 0, sy = window.scrollY ?? 0;
    const { x, y } = info.point;
    if (x >= rect.left+sx && x <= rect.right+sx && y >= rect.top+sy && y <= rect.bottom+sy) {
      doTimbanBruto(p);
    }
  }, [doTimbanBruto]);

  const canPisahkan = stage === "bruto";
  const canNetto    = stage === "separated" || isComplete;
  const canTara     = stage === "separated" || isComplete;

  /* Apakah item gabungan di platform? */
  const showCombined  = stage === "bruto" && !isDraggingAny;
  /* Apakah item individual (netto/tara) di platform? */
  const showIndividual = (stage === "separated" || isComplete) && weighType !== "none" && !isDraggingAny;
  /* Apakah tampilkan isi + bungkus terpisah di atas? */
  const showSeparated = stage === "separating" || stage === "separated" || isComplete;

  return (
    <div
      className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
      style={{ background: "linear-gradient(145deg,#f8fafc,#eff6ff,#f0fdf4)" }}
    >
      {/* HEADER */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-500 px-5 py-4 flex items-center justify-between">
        <div>
          <div className="text-white font-black text-xl drop-shadow">⚖️ Timbangan Interaktif</div>
          <div className="text-cyan-100 text-sm font-semibold">Bruto · Netto · Tara — Kelas 7</div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-bold">
          {isComplete ? "🎉 Selesai!"
            : !selected ? "👆 Seret Barang"
            : stage === "idle" ? "📦 Seret ke Timbangan!"
            : stage === "bruto" ? "⚖️ Bruto Terukur"
            : stage === "separating" ? "✂️ Memisahkan..."
            : stage === "separated" ? "🔓 Timbang Netto & Tara"
            : "✅ Selesai"}
        </div>
      </div>

      <div className="p-4 md:p-5 space-y-4">
        {/* STEP INDICATOR */}
        <div className="flex items-center justify-center gap-1 text-xs flex-wrap">
          {[
            { label: "1. Seret Barang",  done: !!selected && stage !== "idle" },
            { label: "2. Bruto Terukur", done: showBruto },
            { label: "3. Pisahkan",      done: stage === "separated" || isComplete },
            { label: "4. Netto + Tara",  done: showNetto && showTara },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`px-2.5 py-1 rounded-full font-bold transition-all ${
                s.done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
              }`}>{s.done ? `✓ ${s.label}` : s.label}</div>
              {i < 3 && <span className="text-gray-300">›</span>}
            </div>
          ))}
        </div>

        {/* LAYOUT UTAMA */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {/* ── KOLOM PRODUK ─────────────────────── */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-center font-black text-gray-600 text-xs uppercase tracking-widest">
              📦 Seret Barang ke Timbangan
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PRODUK.map(p => (
                <ProdukCard key={p.id} p={p}
                  selected={selected?.id === p.id}
                  onSelect={() => resetWith(p)}
                  onDragEnd={handleDragEnd}
                  setDragging={setIsDraggingAny}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {selected && (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="rounded-2xl border-2 p-3 space-y-2 text-xs"
                  style={{ borderColor: selected.warna, backgroundColor: selected.warnaBg }}
                >
                  <div className="font-black text-sm text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">
                      {/* Apel tampilkan dalam keranjang */}
                      {selected.brutoStack
                        ? <span className="relative inline-block w-10 h-10">
                            <span className="text-3xl absolute bottom-0">{selected.bungkusEmoji}</span>
                            <span className="text-xl absolute bottom-3 left-1/2 -translate-x-1/2 z-10">{selected.isiEmoji}</span>
                          </span>
                        : selected.emoji}
                    </span>
                    <div>
                      <div>{selected.nama}</div>
                      <div className="text-xs font-normal text-gray-500">Total: {fmtG(bruto)}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="bg-white/80 rounded-xl p-2 text-center border border-green-200">
                      <div className="text-xl">{selected.isiEmoji}</div>
                      <div className="font-bold text-green-700">Isi (Netto)</div>
                      <div className="text-gray-500 text-xs">{selected.isi}</div>
                      <div className="font-black text-green-800">{fmtG(selected.netto)}</div>
                    </div>
                    <div className="bg-white/80 rounded-xl p-2 text-center border border-blue-200">
                      <div className="text-xl">{selected.bungkusEmoji}</div>
                      <div className="font-bold text-blue-700">Kemasan (Tara)</div>
                      <div className="text-gray-500 text-xs">{selected.bungkus}</div>
                      <div className="font-black text-blue-800">{fmtG(selected.tara)}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── KOLOM TIMBANGAN ──────────────────── */}
          <div className="md:col-span-3 flex flex-col items-center gap-3">

            {/* DROP ZONE */}
            <div
              ref={dropZoneRef}
              className={`w-full rounded-3xl border-2 relative transition-all duration-200 ${
                isDraggingAny
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-300 bg-gradient-to-b from-slate-100 to-slate-200"
              }`}
              style={{ minHeight: 360 }}
            >
              {/* Glow hint saat drag */}
              <AnimatePresence>
                {isDraggingAny && (
                  <motion.div
                    className="absolute inset-0 rounded-3xl flex items-center justify-center z-20 pointer-events-none"
                    style={{ background: "rgba(59,130,246,0.08)" }}
                    initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  >
                    <motion.div className="text-center text-blue-500 font-black"
                      animate={{ scale:[1,1.06,1] }} transition={{ duration:1, repeat:Infinity }}>
                      <div className="text-5xl mb-2">⬇️</div>
                      <div className="text-sm">Lepaskan di sini!</div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ══ BARANG TERPISAH DI ATAS (animasi geser) ══
                  Muncul sejak stage=separating → sliding keluar dari tengah */}
              <AnimatePresence>
                {showSeparated && selected && (
                  <div className="absolute top-3 left-0 right-0 flex justify-around items-start px-3 z-10">

                    {/* ISI — geser dari kanan ke kiri */}
                    <motion.div
                      key="isi-top"
                      initial={{ x: 70, opacity: 0, scale: 0.6 }}
                      animate={{ x: 0, opacity: 1, scale: 1 }}
                      exit={{ x: 70, opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 240, damping: 24 }}
                      className="flex flex-col items-center gap-1 cursor-pointer group"
                      onClick={canNetto ? doTimbanNetto : undefined}
                    >
                      <span className={`text-5xl transition-transform ${
                        weighType === "netto" ? "scale-125" : "hover:scale-110"
                      }`}>
                        {selected.isiEmoji}
                      </span>
                      <div className={`text-xs font-black px-2 py-0.5 rounded-full border-2 transition-all ${
                        weighType === "netto"
                          ? "bg-green-500 text-white border-green-600"
                          : "bg-white border-green-300 text-green-700 group-hover:border-green-500"
                      }`}>Isi</div>
                      <div className="text-xs text-gray-500">{selected.isi}</div>
                      {!showNetto
                        ? <div className="text-xs text-blue-500 font-bold animate-pulse">👆 klik</div>
                        : <div className="text-xs text-green-600 font-bold">✓ {fmtG(netto)}</div>}
                    </motion.div>

                    {/* GUNTING di tengah saat separating */}
                    <div className="flex flex-col items-center justify-start pt-3">
                      <AnimatePresence>
                        {stage === "separating" && (
                          <motion.div
                            key="scissors"
                            initial={{ scale:0, opacity:0 }}
                            animate={{
                              scale:[1,1.2,1],
                              opacity:1,
                              rotate:[0,-20,20,-20,20,0],
                            }}
                            exit={{ scale:0, opacity:0 }}
                            transition={{ duration:0.4, repeat:3 }}
                            className="text-3xl"
                          >
                            ✂️
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {(stage === "separated" || isComplete) && (
                        <div className="text-gray-300 font-black text-xl mt-3">+</div>
                      )}
                    </div>

                    {/* BUNGKUS — geser dari kiri ke kanan
                        PENTING: Tampilkan emoji bungkus apa adanya tanpa filter/warna tambahan */}
                    <motion.div
                      key="bungkus-top"
                      initial={{ x: -70, opacity: 0, scale: 0.6 }}
                      animate={{ x: 0, opacity: 1, scale: 1 }}
                      exit={{ x: -70, opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 240, damping: 24 }}
                      className="flex flex-col items-center gap-1 cursor-pointer group"
                      onClick={canTara ? doTimbanTara : undefined}
                    >
                      <span className={`text-5xl transition-transform ${
                        weighType === "tara" ? "scale-125" : "hover:scale-110"
                      }`}>
                        {selected.bungkusEmoji}
                      </span>
                      <div className={`text-xs font-black px-2 py-0.5 rounded-full border-2 transition-all ${
                        weighType === "tara"
                          ? "bg-blue-500 text-white border-blue-600"
                          : "bg-white border-blue-300 text-blue-700 group-hover:border-blue-500"
                      }`}>Kemasan</div>
                      <div className="text-xs text-gray-500">{selected.bungkus}</div>
                      {!showTara
                        ? <div className="text-xs text-blue-500 font-bold animate-pulse">👆 klik</div>
                        : <div className="text-xs text-blue-600 font-bold">✓ {fmtG(tara)}</div>}
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Konten tengah: item di platform + dial */}
              <div className="flex flex-col items-center" style={{ paddingTop: 46, paddingBottom: 8 }}>

                {/* ══ ITEM DI PLATFORM ══ */}
                <AnimatePresence mode="wait">

                  {/* Item gabungan (bruto) — hanya saat stage=bruto */}
                  {showCombined && selected && (
                    <motion.div
                      key="combined"
                      className="flex flex-col items-center gap-1.5 mb-1"
                      initial={{ y:-40, opacity:0, scale:0.4 }}
                      animate={{ y:0, opacity:1, scale:1 }}
                      exit={{ y:-25, opacity:0, scale:0.5, transition:{ duration:0.3 } }}
                      transition={{ type:"spring", stiffness:200, damping:18 }}
                    >
                      {/* Render bruto (apel dalam keranjang, atau gabungan biasa) */}
                      <motion.div animate={{ y:[0,-4,0] }} transition={{ duration:2.2, repeat:Infinity }}>
                        {renderBrutoEmoji(selected)}
                      </motion.div>
                      <div className="text-xs font-black px-3 py-0.5 rounded-full text-white shadow"
                        style={{ backgroundColor: "#dd6b20" }}>
                        ⚖️ Bruto
                      </div>
                    </motion.div>
                  )}

                  {/* Item individual (netto atau tara) */}
                  {showIndividual && selected && (
                    <motion.div
                      key={`individual-${weighType}`}
                      className="flex flex-col items-center gap-1.5 mb-1"
                      initial={{ y:-30, opacity:0, scale:0.5 }}
                      animate={{ y:0, opacity:1, scale:1 }}
                      exit={{ y:-20, opacity:0, scale:0.6 }}
                      transition={{ type:"spring", stiffness:200, damping:18 }}
                    >
                      <motion.div animate={{ y:[0,-4,0] }} transition={{ duration:2.2, repeat:Infinity }}>
                        {/* Tampilkan emoji persis sama dengan di panel atas — tanpa filter */}
                        <span className="text-5xl">
                          {weighType === "netto" ? selected.isiEmoji : selected.bungkusEmoji}
                        </span>
                      </motion.div>
                      <div className="text-xs font-black px-3 py-0.5 rounded-full text-white shadow"
                        style={{ backgroundColor: weighType === "netto" ? "#16a34a" : "#2563eb" }}>
                        {weighType === "netto" ? "🌿 Netto" : "📦 Tara"}
                      </div>
                    </motion.div>
                  )}

                  {/* Hint kosong */}
                  {!showCombined && !showIndividual && !showSeparated && !isDraggingAny && (
                    <div className="flex flex-col items-center text-gray-300 mb-2">
                      <span className="text-4xl">⬇️</span>
                      <span className="text-xs text-gray-400 font-bold mt-1">
                        {selected ? "Seret barang ke sini" : "Pilih barang dulu"}
                      </span>
                    </div>
                  )}
                </AnimatePresence>

                {/* Platform timbangan */}
                <div className="relative mx-auto">
                  <div className="mx-auto rounded-full border-4 border-gray-400 bg-gradient-to-b from-gray-200 to-gray-300"
                    style={{
                      width:150, height:22, borderRadius:"50%",
                      boxShadow:"inset 0 4px 10px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1)"
                    }} />
                  <div className="absolute inset-x-8 top-2 h-1 rounded-full bg-white/50 pointer-events-none" />
                  <div className="mx-auto bg-gradient-to-b from-gray-400 to-gray-500"
                    style={{ width:10, height:30, marginLeft:"calc(50% - 5px)", marginTop:-2 }} />
                </div>

                <DialScale weightG={displayWeight} maxG={scaleMax} color={scaleColor} label={scaleLabel} />
              </div>
            </div>

            {/* TOMBOL AKSI */}
            <div className="w-full grid grid-cols-2 gap-2">
              <motion.button whileTap={{ scale:0.93 }}
                onClick={() => selected && doTimbanBruto(selected)}
                disabled={!selected || stage !== "idle"}
                className={`py-2.5 rounded-xl font-black text-sm transition-all ${
                  selected && stage === "idle"
                    ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-md hover:shadow-orange-300/40 hover:shadow-lg"
                    : showBruto
                    ? "bg-orange-100 text-orange-600 border border-orange-300"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}>
                {showBruto ? "✅ Bruto Tercatat" : "⚖️ Timbang Bruto"}
              </motion.button>

              <motion.button whileTap={{ scale:0.93 }}
                onClick={doPisahkan} disabled={!canPisahkan}
                className={`py-2.5 rounded-xl font-black text-sm transition-all ${
                  canPisahkan
                    ? "bg-gradient-to-r from-red-500 to-pink-400 text-white shadow-md animate-pulse"
                    : stage === "separated" || isComplete
                    ? "bg-green-100 text-green-600 border border-green-300"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}>
                {stage === "separated" || isComplete ? "✅ Sudah Dipisah"
                  : stage === "separating" ? "✂️ Memisahkan..."
                  : "✂️ Pisahkan Kemasan!"}
              </motion.button>

              <motion.button whileTap={{ scale:0.93 }}
                onClick={doTimbanNetto} disabled={!canNetto}
                className={`py-2.5 rounded-xl font-black text-sm transition-all ${
                  canNetto
                    ? showNetto
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-md"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}>
                {showNetto ? `✅ Netto: ${fmtG(netto)}` : "🌿 Timbang Isi (Netto)"}
              </motion.button>

              <motion.button whileTap={{ scale:0.93 }}
                onClick={doTimbanTara} disabled={!canTara}
                className={`py-2.5 rounded-xl font-black text-sm transition-all ${
                  canTara
                    ? showTara
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}>
                {showTara ? `✅ Tara: ${fmtG(tara)}` : "📦 Timbang Kemasan (Tara)"}
              </motion.button>
            </div>

            {selected && (
              <button onClick={() => resetWith(selected)}
                className="w-full py-1.5 rounded-xl text-xs font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-100 border border-dashed border-gray-300 transition-all">
                🔄 Ulangi dengan {selected.nama}
              </button>
            )}
          </div>
        </div>

        {/* KOTAK HASIL */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <HasilBox label="BRUTO" sublabel="Berat Kotor (isi+kemasan)" value={fmtG(bruto)}
            icon="⚖️" color="text-orange-700" bg="bg-orange-50" border="border-orange-300" shown={showBruto} />
          <HasilBox label="NETTO" sublabel="Berat Bersih (isi)" value={fmtG(netto)}
            icon="🌿" color="text-green-700" bg="bg-green-50" border="border-green-300" shown={showNetto} />
          <HasilBox label="TARA" sublabel="Berat Kemasan" value={fmtG(tara)}
            icon="📦" color="text-blue-700" bg="bg-blue-50" border="border-blue-300" shown={showTara} />
          <HasilBox label="% TARA" sublabel="Tara ÷ Bruto × 100%" value={`${pctTara.toFixed(1)}%`}
            icon="📊" color="text-purple-700" bg="bg-purple-50" border="border-purple-300" shown={showTara && showBruto} />
        </div>

        {/* KALKULASI */}
        <AnimatePresence>
          {showBruto && selected && (
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              className="bg-white/90 rounded-2xl border-2 border-teal-200 p-4 space-y-3">
              <div className="text-center font-black text-teal-700 text-sm uppercase tracking-wide">
                📐 Perhitungan — {selected.emoji} {selected.nama}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center space-y-1">
                  <div className="font-black text-orange-600 text-sm">BRUTO ⚖️</div>
                  <div className="text-orange-700">= Netto + Tara</div>
                  <div className="text-orange-800">= {fmtG(netto)} + {fmtG(tara)}</div>
                  <div className="font-black text-orange-900 text-lg">= {fmtG(bruto)}</div>
                </div>
                <div className={`border rounded-xl p-3 text-center space-y-1 ${showNetto ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 opacity-50"}`}>
                  <div className="font-black text-green-600 text-sm">NETTO 🌿</div>
                  <div className="text-green-700">= Bruto − Tara</div>
                  <div className="text-green-800">= {fmtG(bruto)} − {fmtG(tara)}</div>
                  <div className="font-black text-green-900 text-lg">{showNetto ? `= ${fmtG(netto)}` : "= ?"}</div>
                </div>
                <div className={`border rounded-xl p-3 text-center space-y-1 ${showTara ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200 opacity-50"}`}>
                  <div className="font-black text-blue-600 text-sm">TARA 📦</div>
                  <div className="text-blue-700">= Bruto − Netto</div>
                  <div className="text-blue-800">= {fmtG(bruto)} − {fmtG(netto)}</div>
                  <div className="font-black text-blue-900 text-lg">{showTara ? `= ${fmtG(tara)}` : "= ?"}</div>
                </div>
              </div>

              <AnimatePresence>
                {showTara && showBruto && (
                  <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                    className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center text-xs font-mono space-y-1">
                    <div className="font-black text-purple-700">% TARA 📊</div>
                    <div className="text-purple-800">= Tara ÷ Bruto × 100%</div>
                    <div className="text-purple-800 font-bold">= {fmtG(tara)} ÷ {fmtG(bruto)} × 100%</div>
                    <div className="font-black text-purple-900 text-xl">= {pctTara.toFixed(2)}%</div>
                    <div className="text-purple-600">{pctTara.toFixed(1)}% dari berat total adalah kemasan</div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isComplete && (
                  <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                    className="text-center py-3 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-xl">
                    <div className="text-white font-black text-lg">🎉 Semua Nilai Berhasil Ditemukan!</div>
                    <div className="text-cyan-100 text-xs mt-1">
                      Bruto={fmtG(bruto)} · Netto={fmtG(netto)} · Tara={fmtG(tara)} · %Tara={pctTara.toFixed(1)}%
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RUMUS RINGKAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {[
            { f:"Bruto = Netto + Tara",  i:"⚖️", c:"text-orange-700 bg-orange-50 border-orange-200" },
            { f:"Netto = Bruto − Tara",  i:"🌿", c:"text-green-700 bg-green-50 border-green-200"   },
            { f:"Tara = Bruto − Netto",  i:"📦", c:"text-blue-700 bg-blue-50 border-blue-200"     },
            { f:"%Tara = (T÷B)×100%",    i:"📊", c:"text-purple-700 bg-purple-50 border-purple-200"},
          ].map((r, i) => (
            <div key={i} className={`rounded-xl border-2 p-2.5 text-center font-bold ${r.c}`}>
              <div className="text-xl mb-1">{r.i}</div>{r.f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimbanganBNT;
