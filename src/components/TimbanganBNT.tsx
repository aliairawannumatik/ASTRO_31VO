import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

/* ─── Data produk ───────────────────────────────────────────────── */
interface Produk {
  id: number;
  emoji: string;
  isiEmoji: string;
  bungkusEmoji: string;
  nama: string;
  isi: string;
  bungkus: string;
  netto: number; // gram
  tara: number;  // gram
  warna: string;
  bgCard: string;
}

const PRODUK: Produk[] = [
  { id:1, emoji:"🎁", isiEmoji:"🧸", bungkusEmoji:"📦", nama:"Kado Ultah",    isi:"Boneka Teddy",    bungkus:"Kotak Kardus",   netto:850,  tara:350, warna:"#e53e3e", bgCard:"bg-red-50 border-red-200" },
  { id:2, emoji:"🍎", isiEmoji:"🍎", bungkusEmoji:"🧺", nama:"Apel Malang",   isi:"Apel Segar",     bungkus:"Keranjang Rotan",netto:1200, tara:450, warna:"#38a169", bgCard:"bg-green-50 border-green-200" },
  { id:3, emoji:"🧃", isiEmoji:"💧", bungkusEmoji:"🥡", nama:"Jus Mangga",    isi:"Jus Segar",      bungkus:"Kotak Tetrapack",netto:500,  tara:120, warna:"#d69e2e", bgCard:"bg-yellow-50 border-yellow-200" },
  { id:4, emoji:"🍚", isiEmoji:"🌾", bungkusEmoji:"👜", nama:"Beras Pulen",   isi:"Beras Organik",  bungkus:"Karung Plastik", netto:5000, tara:280, warna:"#d97706", bgCard:"bg-amber-50 border-amber-200" },
  { id:5, emoji:"🍫", isiEmoji:"🍫", bungkusEmoji:"🥫", nama:"Coklat Lezat",  isi:"Coklat Premium", bungkus:"Kotak Kaleng",   netto:320,  tara:195, warna:"#92400e", bgCard:"bg-orange-50 border-orange-200" },
  { id:6, emoji:"🥛", isiEmoji:"🥛", bungkusEmoji:"🫙", nama:"Susu Segar",    isi:"Susu Full Cream", bungkus:"Botol Kaca",   netto:750,  tara:330, warna:"#2b6cb0", bgCard:"bg-blue-50 border-blue-200" },
];

const fmtG = (g: number) =>
  g >= 1000 ? (g / 1000).toFixed(g % 1000 === 0 ? 0 : 2) + " kg" : g + " g";

/* ─── SVG Timbangan ─────────────────────────────────────────────── */
const DialScale = ({ weightG, maxG, color }: { weightG: number; maxG: number; color: string }) => {
  const ratio = Math.min(weightG / maxG, 1);
  // Needle rotates: 0 deg = pointing left (-90°), 180 deg = pointing right (+90°)
  // We rotate the needle group around center (80,88)
  const needleDeg = ratio * 180 - 90; // -90° at 0, +90° at max

  const r2c = (deg: number) => (deg * Math.PI) / 180;

  const ticks = Array.from({ length: 11 }, (_, i) => {
    const a = -90 + i * 18;
    const rad = r2c(a);
    const r1 = 62, r2 = i % 5 === 0 ? 50 : 56;
    return {
      x1: 80 + r1 * Math.cos(rad), y1: 88 + r1 * Math.sin(rad),
      x2: 80 + r2 * Math.cos(rad), y2: 88 + r2 * Math.sin(rad),
      big: i % 5 === 0, idx: i,
    };
  });

  const arcFill = (() => {
    if (ratio <= 0) return "";
    const sx = 80 + 70 * Math.cos(r2c(-90));
    const sy = 88 + 70 * Math.sin(r2c(-90));
    const ex = 80 + 70 * Math.cos(r2c(needleDeg));
    const ey = 88 + 70 * Math.sin(r2c(needleDeg));
    const large = ratio > 0.5 ? 1 : 0;
    return `M80,88 L${sx.toFixed(2)},${sy.toFixed(2)} A70,70 0 ${large},1 ${ex.toFixed(2)},${ey.toFixed(2)} Z`;
  })();

  return (
    <svg width="160" height="110" viewBox="0 0 160 110" fill="none">
      {/* Dial background semicircle */}
      <path d="M10,88 A70,70 0 0,1 150,88" fill="white" stroke="#e2e8f0" strokeWidth="2" />

      {/* Colored fill arc */}
      {arcFill && <path d={arcFill} fill={color} opacity="0.15" />}

      {/* Ticks */}
      {ticks.map(t => (
        <line key={t.idx}
          x1={t.x1.toFixed(2)} y1={t.y1.toFixed(2)}
          x2={t.x2.toFixed(2)} y2={t.y2.toFixed(2)}
          stroke={t.big ? "#4a5568" : "#a0aec0"} strokeWidth={t.big ? 2 : 1}
        />
      ))}

      {/* Labels at 5 positions */}
      {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
        const deg = -90 + r * 180;
        const rad = r2c(deg);
        const rx = 80 + 44 * Math.cos(rad);
        const ry = 88 + 44 * Math.sin(rad);
        return (
          <text key={i} x={rx.toFixed(2)} y={ry.toFixed(2)}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="7" fill="#4a5568" fontWeight="bold">
            {fmtG(Math.round(maxG * r))}
          </text>
        );
      })}

      {/* Outer border arc */}
      <path d="M10,88 A70,70 0 0,1 150,88" fill="none" stroke="#cbd5e0" strokeWidth="3" />

      {/* Needle — rotated around pivot (80,88) */}
      <motion.g
        style={{ originX: "80px", originY: "88px" }}
        animate={{ rotate: needleDeg }}
        transition={{ type: "spring", stiffness: 55, damping: 13 }}
      >
        {/* Needle rod pointing straight up from pivot */}
        <line x1="80" y1="88" x2="80" y2="32"
          stroke={color} strokeWidth="3" strokeLinecap="round" />
        {/* Counterweight at bottom */}
        <line x1="80" y1="88" x2="80" y2="96"
          stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.4" />
      </motion.g>

      {/* Pivot hub */}
      <circle cx="80" cy="88" r="6" fill={color} />
      <circle cx="80" cy="88" r="3" fill="white" />

      {/* Weight readout box */}
      <rect x="54" y="60" width="52" height="19" rx="5" fill={color} />
      <AnimatePresence mode="wait">
        <motion.text
          key={weightG}
          x="80" y="73" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {weightG > 0 ? fmtG(weightG) : "0 g"}
        </motion.text>
      </AnimatePresence>

      {/* Base */}
      <rect x="20" y="91" width="120" height="17" rx="8" fill="#e2e8f0" />
      <rect x="26" y="95" width="108" height="9" rx="4" fill="#cbd5e0" />
      <text x="80" y="103" textAnchor="middle" fontSize="7" fill="#718096" fontWeight="bold">TIMBANGAN</text>
    </svg>
  );
};

/* ─── Platform timbangan ─────────────────────────────────────────── */
const Platform = ({ hasItem, hasPackaging, produk, stage, weighType }:
  { hasItem: boolean; hasPackaging: boolean; produk: Produk | null; stage: string; weighType: string }) => (
  <div className="relative">
    {/* Wadah / bowl */}
    <div className="relative mx-auto" style={{ width: 140 }}>
      {/* Item on platform */}
      <AnimatePresence>
        {hasItem && produk && (
          <motion.div
            key="item-platform"
            className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
            initial={{ y: -40, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -40, opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            {/* Wrapped or unwrapped */}
            {stage === "bruto" || stage === "separating" ? (
              <div className="relative">
                <motion.div
                  className="text-5xl filter drop-shadow-lg"
                  animate={stage === "separating" ? { rotate: [0, -10, 10, -5, 0], scale: [1, 1.1, 0.9, 1] } : { y: [0, -3, 0] }}
                  transition={stage === "separating" ? { duration: 0.6, repeat: 3 } : { duration: 2, repeat: Infinity }}
                >
                  {produk.emoji}
                </motion.div>
                {/* Bungkus overlay hint */}
                {stage === "bruto" && (
                  <div className="absolute -top-2 -right-2 text-lg">{produk.bungkusEmoji}</div>
                )}
              </div>
            ) : (
              /* Separated: isi saja */
              weighType === "netto" ? (
                <motion.div className="text-5xl filter drop-shadow-lg"
                  animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  {produk.isiEmoji}
                </motion.div>
              ) : weighType === "tara" ? (
                <motion.div className="text-5xl filter drop-shadow-lg"
                  animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  {produk.bungkusEmoji}
                </motion.div>
              ) : null
            )}
            {/* Label */}
            <div className="text-xs font-bold px-2 py-0.5 rounded-full text-white shadow"
              style={{ backgroundColor: produk.warna }}>
              {stage === "bruto" || stage === "separating" ? "Bruto"
                : weighType === "netto" ? "Netto" : weighType === "tara" ? "Tara" : ""}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Platform bowl */}
      <div className="relative mx-auto rounded-full border-4 border-gray-300 bg-gradient-to-b from-gray-100 to-gray-200 shadow-inner flex items-center justify-center"
        style={{ width: 130, height: 20, borderRadius: "50%", boxShadow: "inset 0 3px 8px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)" }}>
        <div className="absolute inset-x-6 top-1 h-1 rounded-full bg-white/60" />
      </div>
      {/* Support rod */}
      <div className="mx-auto w-2 h-6 bg-gradient-to-b from-gray-400 to-gray-500" style={{ marginTop: -2 }} />
    </div>
  </div>
);

/* ─── Kartu Produk ───────────────────────────────────────────────── */
const ProdukCard = ({ p, selected, onSelect }: { p: Produk; selected: boolean; onSelect: () => void }) => (
  <motion.button
    whileTap={{ scale: 0.93 }}
    onClick={onSelect}
    className={`relative flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
      selected ? "border-current shadow-lg scale-105" : `${p.bgCard} hover:scale-102 hover:shadow-md`
    }`}
    style={selected ? { borderColor: p.warna, backgroundColor: p.warna + "22" } : {}}
  >
    {selected && (
      <div className="absolute -top-2 -right-2 text-green-500 text-lg">✅</div>
    )}
    <span className="text-3xl">{p.emoji}</span>
    <span className="text-xs font-black text-gray-700 text-center leading-tight">{p.nama}</span>
    <span className="text-xs text-gray-500">{fmtG(p.netto + p.tara)}</span>
  </motion.button>
);

/* ─── Kotak Hasil ───────────────────────────────────────────────── */
const HasilBox = ({ label, sublabel, value, unit, icon, color, bg, shown, big }:
  { label: string; sublabel: string; value: string; unit?: string; icon: string; color: string; bg: string; shown: boolean; big?: boolean }) => (
  <motion.div
    className={`rounded-2xl border-2 p-3 flex flex-col items-center gap-1 shadow ${bg} ${big ? "col-span-2" : ""}`}
    animate={shown ? { scale: [0.9, 1.06, 1], opacity: 1 } : { opacity: 0.35, scale: 0.95 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
  >
    <span className="text-2xl">{icon}</span>
    <span className={`text-xs font-black uppercase tracking-wide ${color}`}>{label}</span>
    <span className="text-xs text-gray-500 text-center">{sublabel}</span>
    <motion.span key={value} className={`font-black text-base ${color}`}
      initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300 }}>
      {shown ? value : "—"}
    </motion.span>
    {unit && shown && <span className="text-xs text-gray-400">{unit}</span>}
  </motion.div>
);

/* ─── Main Component ─────────────────────────────────────────────── */
type Stage = "idle" | "bruto" | "separating" | "separated" | "complete";
type WeighType = "none" | "netto" | "tara";

const TimbanganBNT = () => {
  const [selected, setSelected] = useState<Produk | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [weighType, setWeighType] = useState<WeighType>("none");
  const [showNetto, setShowNetto] = useState(false);
  const [showTara, setShowTara] = useState(false);
  const [showBruto, setShowBruto] = useState(false);

  const bruto = selected ? selected.netto + selected.tara : 0;
  const netto = selected ? selected.netto : 0;
  const tara  = selected ? selected.tara  : 0;
  const pctTara  = bruto > 0 ? (tara  / bruto) * 100 : 0;
  const pctNetto = bruto > 0 ? (netto / bruto) * 100 : 0;
  const maxG = selected ? Math.ceil((bruto * 1.4) / 500) * 500 : 2000;

  const displayWeight =
    stage === "bruto" ? bruto
    : stage === "separating" ? bruto
    : weighType === "netto" ? netto
    : weighType === "tara" ? tara
    : 0;

  const scaleColor =
    stage === "bruto" || stage === "separating" ? "#dd6b20"
    : weighType === "netto" ? "#38a169"
    : weighType === "tara" ? "#3182ce"
    : "#718096";

  /* Pilih produk → reset semua */
  const handleSelect = (p: Produk) => {
    setSelected(p);
    setStage("idle");
    setWeighType("none");
    setShowBruto(false);
    setShowNetto(false);
    setShowTara(false);
  };

  /* Timbang Bruto */
  const handleTimbanBruto = async () => {
    if (!selected || stage === "bruto") return;
    setStage("bruto");
    setWeighType("none");
    await new Promise(r => setTimeout(r, 600));
    setShowBruto(true);
  };

  /* Pisahkan */
  const handlePisahkan = async () => {
    if (stage !== "bruto") return;
    setStage("separating");
    await new Promise(r => setTimeout(r, 1800));
    setStage("separated");
    setWeighType("none");
  };

  /* Timbang Netto */
  const handleTimbanNetto = () => {
    setWeighType("netto");
    setTimeout(() => setShowNetto(true), 600);
  };

  /* Timbang Tara */
  const handleTimbanTara = () => {
    setWeighType("tara");
    setTimeout(() => setShowTara(true), 600);
  };

  /* Check complete */
  useEffect(() => {
    if (showBruto && showNetto && showTara) setStage("complete");
  }, [showBruto, showNetto, showTara]);

  const canTimbanBruto = !!selected && stage !== "bruto" && stage !== "separating" && stage !== "separated" && stage !== "complete";
  const canPisahkan    = stage === "bruto";
  const canNetto       = stage === "separated" || stage === "complete";
  const canTara        = stage === "separated" || stage === "complete";

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl"
      style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #eff6ff 50%, #fefce8 100%)" }}>

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-500 px-5 py-4 flex items-center justify-between">
        <div>
          <div className="text-white font-black text-xl drop-shadow">⚖️ Timbangan Interaktif</div>
          <div className="text-cyan-100 text-sm font-semibold">Bruto · Netto · Tara — Kelas 7</div>
        </div>
        <div className="bg-white/20 rounded-full px-3 py-1 text-white text-xs font-bold">
          {stage === "complete" ? "🎉 Selesai!" : stage === "idle" && !selected ? "👆 Pilih Barang" : stage === "bruto" ? "⚖️ Menimbang Bruto" : stage === "separating" ? "✂️ Memisahkan..." : stage === "separated" ? "🔓 Terpisah!" : "📦 Siap Ditimbang"}
        </div>
      </div>

      <div className="p-4 md:p-5 space-y-4">

        {/* ── STEP INDICATOR ──────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-1 text-xs flex-wrap">
          {[
            { label: "1. Pilih Barang",     done: !!selected,  active: !selected },
            { label: "2. Timbang Bruto",    done: showBruto,   active: !!selected && !showBruto },
            { label: "3. Pisahkan",         done: stage === "separated" || stage === "complete", active: stage === "bruto" },
            { label: "4. Netto & Tara",     done: showNetto && showTara, active: stage === "separated" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`px-2.5 py-1 rounded-full font-bold transition-all ${
                s.done ? "bg-green-500 text-white"
                : s.active ? "bg-blue-500 text-white animate-pulse"
                : "bg-gray-200 text-gray-500"
              }`}>
                {s.done ? "✓" : s.label}
              </div>
              {i < 3 && <span className="text-gray-300 mx-1">›</span>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {/* ── PILIH PRODUK (2 col) ─────────────────────────────── */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-center font-black text-gray-700 text-sm uppercase tracking-wide">
              📦 Pilih Barang
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PRODUK.map(p => (
                <ProdukCard key={p.id} p={p} selected={selected?.id === p.id} onSelect={() => handleSelect(p)} />
              ))}
            </div>

            {/* Keterangan barang terpilih */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="rounded-2xl border-2 p-3 space-y-2"
                  style={{ borderColor: selected.warna, backgroundColor: selected.warna + "11" }}
                >
                  <div className="font-black text-sm text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">{selected.emoji}</span> {selected.nama}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <div className="bg-white/70 rounded-xl p-2 text-center">
                      <div className="text-xl mb-1">{selected.isiEmoji}</div>
                      <div className="font-bold text-green-700">Isi</div>
                      <div className="text-gray-600">{selected.isi}</div>
                    </div>
                    <div className="bg-white/70 rounded-xl p-2 text-center">
                      <div className="text-xl mb-1">{selected.bungkusEmoji}</div>
                      <div className="font-bold text-blue-700">Kemasan</div>
                      <div className="text-gray-600">{selected.bungkus}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── TIMBANGAN (3 col) ────────────────────────────────── */}
          <div className="md:col-span-3 flex flex-col items-center gap-3">

            {/* Area timbangan */}
            <div className="w-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 rounded-3xl border-2 border-slate-300 shadow-inner pt-10 pb-4 relative"
              style={{ minHeight: 220 }}>

              {/* Drag hint */}
              {selected && stage === "idle" && (
                <motion.div
                  className="absolute top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full border border-blue-200"
                  animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
                >
                  👇 Klik "Timbang Bruto" untuk menimbang!
                </motion.div>
              )}

              {/* Item terpisah (saat separated) */}
              <AnimatePresence>
                {(stage === "separated" || stage === "complete") && selected && (
                  <div className="absolute top-3 left-0 right-0 flex justify-around px-4">
                    {/* Isi */}
                    <motion.div
                      initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                      className="flex flex-col items-center gap-1 cursor-pointer"
                      onClick={handleTimbanNetto}
                      title="Klik untuk timbang isi"
                    >
                      <motion.div className="text-4xl"
                        animate={weighType === "netto" ? { scale: [1, 1.2, 1], y: [0, -8, 0] } : { y: [0, -3, 0] }}
                        transition={{ duration: weighType === "netto" ? 0.5 : 2, repeat: Infinity }}>
                        {selected.isiEmoji}
                      </motion.div>
                      <div className={`text-xs font-black px-2 py-0.5 rounded-full ${weighType === "netto" ? "bg-green-500 text-white" : "bg-white border border-green-300 text-green-700"}`}>
                        Isi
                      </div>
                      <div className="text-xs text-gray-500">{selected.isi}</div>
                    </motion.div>

                    <div className="flex flex-col items-center justify-center text-gray-400 font-black text-xl">+</div>

                    {/* Kemasan */}
                    <motion.div
                      initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                      className="flex flex-col items-center gap-1 cursor-pointer"
                      onClick={handleTimbanTara}
                      title="Klik untuk timbang kemasan"
                    >
                      <motion.div className="text-4xl"
                        animate={weighType === "tara" ? { scale: [1, 1.2, 1], y: [0, -8, 0] } : { y: [0, -3, 0] }}
                        transition={{ duration: weighType === "tara" ? 0.5 : 2, repeat: Infinity, delay: 0.5 }}>
                        {selected.bungkusEmoji}
                      </motion.div>
                      <div className={`text-xs font-black px-2 py-0.5 rounded-full ${weighType === "tara" ? "bg-blue-500 text-white" : "bg-white border border-blue-300 text-blue-700"}`}>
                        Kemasan
                      </div>
                      <div className="text-xs text-gray-500">{selected.bungkus}</div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Platform + Dial */}
              <Platform
                hasItem={stage === "bruto" || stage === "separating" || (stage !== "idle" && weighType !== "none")}
                hasPackaging={stage === "bruto" || stage === "separating"}
                produk={selected}
                stage={stage}
                weighType={weighType}
              />

              <DialScale weightG={displayWeight} maxG={maxG} color={scaleColor} />

              {/* Pisah animation overlay */}
              <AnimatePresence>
                {stage === "separating" && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center rounded-3xl"
                    style={{ background: "rgba(255,255,255,0.85)" }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    <div className="text-center space-y-2">
                      <motion.div
                        className="text-5xl"
                        animate={{ rotate: [0, -20, 20, -20, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: 3 }}
                      >
                        ✂️
                      </motion.div>
                      <div className="font-black text-gray-700">Memisahkan kemasan...</div>
                      <div className="flex gap-3 text-3xl justify-center">
                        <motion.span animate={{ x: [-5, -30] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                          {selected?.bungkusEmoji}
                        </motion.span>
                        <motion.span animate={{ x: [5, 30] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                          {selected?.isiEmoji}
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── TOMBOL AKSI ───────────────────────────────────────── */}
            <div className="w-full grid grid-cols-2 gap-2">
              {/* Timbang Bruto */}
              <motion.button whileTap={{ scale: 0.93 }} onClick={handleTimbanBruto}
                disabled={!canTimbanBruto}
                className={`py-2.5 rounded-xl font-black text-sm transition-all ${
                  canTimbanBruto
                    ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-md hover:shadow-orange-300/50 hover:shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}>
                {showBruto ? "✅ Bruto Tercatat" : "⚖️ Timbang Bruto"}
              </motion.button>

              {/* Pisahkan */}
              <motion.button whileTap={{ scale: 0.93 }} onClick={handlePisahkan}
                disabled={!canPisahkan}
                className={`py-2.5 rounded-xl font-black text-sm transition-all ${
                  canPisahkan
                    ? "bg-gradient-to-r from-red-500 to-pink-400 text-white shadow-md hover:shadow-red-300/50 hover:shadow-lg animate-pulse"
                    : (stage === "separated" || stage === "complete")
                    ? "bg-green-100 text-green-600 border border-green-300"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}>
                {stage === "separated" || stage === "complete" ? "✅ Sudah Dipisah" : stage === "separating" ? "✂️ Memisahkan..." : "✂️ Pisahkan Kemasan!"}
              </motion.button>

              {/* Timbang Netto */}
              <motion.button whileTap={{ scale: 0.93 }} onClick={handleTimbanNetto}
                disabled={!canNetto}
                className={`py-2.5 rounded-xl font-black text-sm transition-all ${
                  canNetto
                    ? weighType === "netto" || showNetto
                    ? "bg-gradient-to-r from-green-600 to-emerald-400 text-white shadow-md"
                    : "bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-md hover:shadow-green-300/50"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}>
                {showNetto ? "✅ Netto Tercatat" : "🌿 Timbang Isi (Netto)"}
              </motion.button>

              {/* Timbang Tara */}
              <motion.button whileTap={{ scale: 0.93 }} onClick={handleTimbanTara}
                disabled={!canTara}
                className={`py-2.5 rounded-xl font-black text-sm transition-all ${
                  canTara
                    ? weighType === "tara" || showTara
                    ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white shadow-md"
                    : "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md hover:shadow-blue-300/50"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}>
                {showTara ? "✅ Tara Tercatat" : "📦 Timbang Kemasan (Tara)"}
              </motion.button>
            </div>

            {/* Reset */}
            {selected && (
              <button onClick={() => handleSelect(selected)}
                className="w-full py-1.5 rounded-xl text-xs font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all border border-dashed border-gray-300">
                🔄 Ulangi dengan barang ini
              </button>
            )}
          </div>
        </div>

        {/* ── HASIL ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <HasilBox label="BRUTO" sublabel="Berat Kotor (isi + kemasan)" value={fmtG(bruto)}
            icon="⚖️" color="text-orange-700" bg="bg-orange-50 border-orange-300" shown={showBruto} />
          <HasilBox label="NETTO" sublabel="Berat Bersih (isi saja)" value={fmtG(netto)}
            icon="🌿" color="text-green-700" bg="bg-green-50 border-green-300" shown={showNetto} />
          <HasilBox label="TARA" sublabel="Berat Kemasan saja" value={fmtG(tara)}
            icon="📦" color="text-blue-700" bg="bg-blue-50 border-blue-300" shown={showTara} />
          <HasilBox label="% TARA" sublabel={`Tara ÷ Bruto × 100%`} value={`${pctTara.toFixed(1)}%`}
            icon="📊" color="text-purple-700" bg="bg-purple-50 border-purple-300" shown={showTara && showBruto} />
        </div>

        {/* ── STEP BY STEP CALCULATION ─────────────────────────────── */}
        <AnimatePresence>
          {showBruto && selected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 rounded-2xl border-2 border-teal-200 p-4 space-y-3"
            >
              <div className="text-center font-black text-teal-700 text-sm uppercase tracking-wide">
                📐 Perhitungan Lengkap — {selected.nama}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 space-y-1">
                  <div className="font-black text-orange-600 text-center text-sm">BRUTO</div>
                  <div className="text-center text-orange-800">= Netto + Tara</div>
                  <div className="text-center font-bold text-orange-700">
                    = {fmtG(netto)} + {fmtG(tara)}
                  </div>
                  <div className="text-center font-black text-orange-900 text-base">= {fmtG(bruto)}</div>
                </div>
                <div className={`border rounded-xl p-3 space-y-1 ${showNetto ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 opacity-50"}`}>
                  <div className="font-black text-green-600 text-center text-sm">NETTO</div>
                  <div className="text-center text-green-800">= Bruto − Tara</div>
                  <div className="text-center font-bold text-green-700">
                    = {fmtG(bruto)} − {fmtG(tara)}
                  </div>
                  <div className="text-center font-black text-green-900 text-base">{showNetto ? `= ${fmtG(netto)}` : "= ?"}</div>
                </div>
                <div className={`border rounded-xl p-3 space-y-1 ${showTara ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200 opacity-50"}`}>
                  <div className="font-black text-blue-600 text-center text-sm">TARA</div>
                  <div className="text-center text-blue-800">= Bruto − Netto</div>
                  <div className="text-center font-bold text-blue-700">
                    = {fmtG(bruto)} − {fmtG(netto)}
                  </div>
                  <div className="text-center font-black text-blue-900 text-base">{showTara ? `= ${fmtG(tara)}` : "= ?"}</div>
                </div>
              </div>

              {showTara && showBruto && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs font-mono text-center space-y-1">
                  <div className="font-black text-purple-700 text-sm">% TARA</div>
                  <div className="text-purple-800">= Tara ÷ Bruto × 100%</div>
                  <div className="text-purple-800 font-bold">= {fmtG(tara)} ÷ {fmtG(bruto)} × 100%</div>
                  <div className="font-black text-purple-900 text-lg">= {pctTara.toFixed(2)}%</div>
                  <div className="text-purple-600 text-xs">Artinya {pctTara.toFixed(1)}% dari berat total adalah kemasan</div>
                </motion.div>
              )}

              {/* Complete celebration */}
              <AnimatePresence>
                {stage === "complete" && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="text-center py-2 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-xl"
                  >
                    <div className="text-white font-black text-lg">🎉 Semua Nilai Berhasil Ditemukan!</div>
                    <div className="text-cyan-100 text-xs">
                      B={fmtG(bruto)} · N={fmtG(netto)} · T={fmtG(tara)} · %T={pctTara.toFixed(1)}%
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── RUMUS RINGKAS ─────────────────────────────────────────── */}
        <div className="bg-white/80 rounded-2xl border-2 border-slate-200 p-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {[
            { f: "Bruto = Netto + Tara",     c: "text-orange-700 bg-orange-50 border-orange-200", i: "⚖️" },
            { f: "Netto = Bruto − Tara",     c: "text-green-700 bg-green-50 border-green-200",   i: "🌿" },
            { f: "Tara = Bruto − Netto",     c: "text-blue-700 bg-blue-50 border-blue-200",     i: "📦" },
            { f: "%Tara = Tara÷Bruto×100%", c: "text-purple-700 bg-purple-50 border-purple-200",i: "📊" },
          ].map((r, i) => (
            <div key={i} className={`rounded-xl border p-2 text-center font-bold ${r.c}`}>
              <div className="text-lg mb-1">{r.i}</div>
              <div>{r.f}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimbanganBNT;
