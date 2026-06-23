import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

/* ── helpers ─────────────────────────────────────────────── */
const fmt = (n: number) =>
  "Rp " + Math.round(n).toLocaleString("id-ID");

const pct = (n: number) => n.toFixed(1).replace(/\.0$/, "") + "%";

/* ── Floating tag animation ──────────────────────────────── */
const FloatTag = ({
  text, x, y, delay, color,
}: { text: string; x: number; y: number; delay: number; color: string }) => (
  <motion.div
    className={`absolute pointer-events-none select-none font-black text-white text-xs px-2 py-1 rounded-full shadow-lg ${color}`}
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0, rotate: -20 }}
    animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1.1, 0], y: [-5, -30, -60, -90], rotate: [-20, 5, -10, 0] }}
    transition={{ duration: 1.6, delay, ease: "easeOut" }}
  >
    {text}
  </motion.div>
);

const Confetti = ({ x, y, delay, emoji }: { x: number; y: number; delay: number; emoji: string }) => (
  <motion.div
    className="absolute pointer-events-none select-none text-xl"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.4, 1, 0.5], y: [0, -40, -80, -120], x: [0, (Math.random() - 0.5) * 60] }}
    transition={{ duration: 1.5, delay, ease: "easeOut" }}
  >
    {emoji}
  </motion.div>
);

/* ── Warung scene SVG characters ────────────────────────── */
const PenjualDiskonSVG = ({ excited }: { excited: boolean }) => (
  <svg width="78" height="108" viewBox="0 0 78 108" fill="none">
    {/* Baju hijau penjual */}
    <ellipse cx="39" cy="74" rx="20" ry="23" fill="#38a169" />
    <ellipse cx="18" cy="80" rx="7" ry="5" fill="#38a169" transform="rotate(-20 18 80)" />
    {/* Tangan kanan angkat papan diskon */}
    <motion.g
      animate={excited ? { rotate: [0, -15, 15, -10, 0] } : { rotate: [0, -5, 0] }}
      transition={{ duration: excited ? 0.5 : 2, repeat: Infinity, ease: "easeInOut" }}
      style={{ originX: "60px", originY: "70px" }}
    >
      <ellipse cx="62" cy="68" rx="9" ry="5" fill="#38a169" transform="rotate(10 62 68)" />
      {/* Papan diskon */}
      <rect x="58" y="48" width="32" height="20" rx="4" fill="#e53e3e" />
      <rect x="60" y="50" width="28" height="16" rx="3" fill="#fc8181" />
      <text x="74" y="62" textAnchor="middle" fontSize="8" fill="#7b0000" fontWeight="bold">DISKON!</text>
      <line x1="70" y1="68" x2="70" y2="48" stroke="#c53030" strokeWidth="2" />
    </motion.g>
    {/* Kepala */}
    <circle cx="39" cy="37" r="18" fill="#f6ad55" />
    {/* Mata bersinar */}
    <circle cx="33" cy="35" r="2.5" fill="#2d3748" />
    <circle cx="45" cy="35" r="2.5" fill="#2d3748" />
    <circle cx="34" cy="34" r="1" fill="white" />
    <circle cx="46" cy="34" r="1" fill="white" />
    {/* Mulut senyum lebar */}
    <motion.path
      d={excited ? "M30 44 Q39 54 48 44" : "M31 44 Q39 51 47 44"}
      stroke="#2d3748" strokeWidth="2.5" fill="none" strokeLinecap="round"
    />
    {/* Rambut */}
    <ellipse cx="39" cy="21" rx="18" ry="9" fill="#744210" />
    {/* Topi hijau */}
    <rect x="24" y="15" width="30" height="8" rx="3" fill="#276749" />
    <rect x="20" y="22" width="38" height="4" rx="2" fill="#276749" />
    {/* Kaki */}
    <rect x="27" y="93" width="11" height="14" rx="4" fill="#2d3748" />
    <rect x="40" y="93" width="11" height="14" rx="4" fill="#2d3748" />
    {/* Bintang semangat */}
    {excited && (
      <>
        <text x="2" y="25" fontSize="12">⭐</text>
        <text x="55" y="20" fontSize="10">✨</text>
      </>
    )}
  </svg>
);

const PembeliDiskonSVG = ({ running, happy }: { running: boolean; happy: boolean }) => (
  <svg width="70" height="106" viewBox="0 0 70 106" fill="none">
    {/* Baju ungu pembeli */}
    <ellipse cx="35" cy="72" rx="18" ry="22" fill="#805ad5" />
    <ellipse cx="15" cy="77" rx="7" ry="5" fill="#805ad5" transform="rotate(20 15 77)" />
    {/* Tangan kanan pegang kantong belanja */}
    <ellipse cx="56" cy="74" rx="8" ry="5" fill="#805ad5" transform="rotate(-15 56 74)" />
    {/* Kantong belanja */}
    <rect x="52" y="74" width="18" height="16" rx="3" fill="#f6e05e" />
    <path d="M55 74 Q56 68 61 68 Q66 68 67 74" stroke="#d69e2e" strokeWidth="2" fill="none" />
    <text x="53" y="86" fontSize="9">🛍️</text>
    {/* Kepala */}
    <circle cx="35" cy="36" r="17" fill="#fbd38d" />
    {/* Mata */}
    <circle cx="29" cy="34" r="2.5" fill="#2d3748" />
    <circle cx="41" cy="34" r="2.5" fill="#2d3748" />
    <circle cx="30" cy="33" r="1" fill="white" />
    <circle cx="42" cy="33" r="1" fill="white" />
    {/* Ekspresi wajah */}
    {happy ? (
      <>
        <path d="M27 43 Q35 52 43 43" stroke="#2d3748" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <text x="10" y="22" fontSize="11">😍</text>
      </>
    ) : (
      <path d="M28 43 Q35 49 42 43" stroke="#2d3748" strokeWidth="2" fill="none" strokeLinecap="round" />
    )}
    {/* Rambut */}
    <ellipse cx="35" cy="22" rx="17" ry="10" fill="#e53e3e" />
    {/* Pita rambut */}
    <path d="M24 18 Q35 12 46 18" stroke="#fc8181" strokeWidth="3" fill="none" />
    {/* Kaki berlari */}
    <motion.rect x="22" y="91" width="11" height="14" rx="4" fill="#2d3748"
      animate={running ? { rotate: [0, 25, -25, 0], y: [0, -4, 0] } : {}}
      transition={{ duration: 0.4, repeat: Infinity }}
    />
    <motion.rect x="36" y="91" width="11" height="14" rx="4" fill="#2d3748"
      animate={running ? { rotate: [0, -25, 25, 0], y: [0, -4, 0] } : {}}
      transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }}
    />
  </svg>
);

/* ── Warung bangunan dengan nuansa diskon ──────────────── */
const WarungDiskonBuilding = ({ mode }: { mode: "biasa" | "berganda" }) => (
  <svg width="310" height="215" viewBox="0 0 310 215" fill="none">
    {/* Dinding */}
    <rect x="15" y="78" width="280" height="128" fill="#fff9f0" rx="4" />
    {/* Bata */}
    {[0, 1, 2, 3, 4, 5].map(row =>
      [0, 1, 2, 3].map(col => (
        <rect key={`${row}-${col}`}
          x={17 + col * 70 + (row % 2) * 35}
          y={80 + row * 22}
          width={66} height={18} rx="2"
          fill="none" stroke="#fcd9a8" strokeWidth="1" opacity="0.5"
        />
      ))
    )}
    {/* Atap — warna beda untuk tiap mode */}
    <polygon points="0,78 155,8 310,78"
      fill={mode === "biasa" ? "#c05621" : "#553c9a"} />
    <line x1="0" y1="78" x2="310" y2="78"
      stroke={mode === "biasa" ? "#9c4221" : "#44337a"} strokeWidth="3" />

    {/* Papan nama besar */}
    <rect x="65" y="52" width="180" height="34" rx="7"
      fill={mode === "biasa" ? "#c05621" : "#553c9a"} />
    <rect x="68" y="55" width="174" height="28" rx="5"
      fill={mode === "biasa" ? "#dd6b20" : "#6b46c1"} />
    <text x="155" y="74" textAnchor="middle" fill="#fefcbf"
      fontSize="12" fontWeight="bold" fontFamily="sans-serif">
      {mode === "biasa" ? "🏷️ TOKO SUPER DISKON" : "🏷️ TOKO DOUBLE DISKON"}
    </text>

    {/* Etalase / counter */}
    <rect x="50" y="153" width="210" height="10" rx="3" fill="#92400e" />
    <rect x="45" y="158" width="220" height="50" rx="4" fill="#b45309" />
    <rect x="50" y="161" width="210" height="44" rx="3"
      fill="rgba(186,230,253,0.3)" stroke="#7dd3fc" strokeWidth="1.5" />
    {/* Barang diskon di etalase */}
    <text x="62" y="190" fontSize="17">👗</text>
    <text x="92" y="190" fontSize="17">👟</text>
    <text x="122" y="190" fontSize="17">📱</text>
    <text x="152" y="190" fontSize="17">🎒</text>
    <text x="182" y="190" fontSize="17">⌚</text>
    <text x="212" y="190" fontSize="17">🕶️</text>

    {/* Rak atas */}
    <rect x="18" y="88" width="274" height="5" rx="2" fill="#92400e" />
    <rect x="18" y="108" width="274" height="4" rx="2" fill="#92400e" />
    <rect x="18" y="126" width="274" height="4" rx="2" fill="#92400e" />
    <text x="25" y="106" fontSize="13">👔</text>
    <text x="50" y="106" fontSize="13">👗</text>
    <text x="75" y="106" fontSize="13">👠</text>
    <text x="100" y="106" fontSize="13">🧣</text>
    <text x="125" y="106" fontSize="13">🧤</text>
    <text x="150" y="106" fontSize="13">👒</text>
    <text x="175" y="106" fontSize="13">🎩</text>
    <text x="200" y="106" fontSize="13">🧢</text>
    <text x="225" y="106" fontSize="13">💍</text>
    <text x="250" y="106" fontSize="13">💎</text>

    {/* Price tags gantung */}
    <line x1="80" y1="78" x2="80" y2="95" stroke="#d69e2e" strokeWidth="1.5" strokeDasharray="2 2" />
    <rect x="64" y="95" width="32" height="16" rx="8" fill="#faf089" />
    <text x="80" y="107" textAnchor="middle" fontSize="8" fill="#744210" fontWeight="bold">
      {mode === "biasa" ? "30% OFF" : "20%+10%"}
    </text>

    <line x1="155" y1="78" x2="155" y2="95" stroke="#d69e2e" strokeWidth="1.5" strokeDasharray="2 2" />
    <rect x="139" y="95" width="32" height="16" rx="8" fill="#faf089" />
    <text x="155" y="107" textAnchor="middle" fontSize="8" fill="#744210" fontWeight="bold">
      {mode === "biasa" ? "50% OFF" : "30%+20%"}
    </text>

    <line x1="230" y1="78" x2="230" y2="95" stroke="#d69e2e" strokeWidth="1.5" strokeDasharray="2 2" />
    <rect x="214" y="95" width="32" height="16" rx="8" fill="#faf089" />
    <text x="230" y="107" textAnchor="middle" fontSize="8" fill="#744210" fontWeight="bold">
      {mode === "biasa" ? "70% OFF" : "40%+15%"}
    </text>

    {/* Lampu toko */}
    <circle cx="155" cy="48" r="5" fill="#fefcbf" />
    <line x1="155" y1="8" x2="155" y2="43" stroke="#d1d5db" strokeWidth="1.5" />
  </svg>
);

/* ── Banner & tag animasi ──────────────────────────────── */
const SwingBanner = ({ text, color, x, delay }: { text: string; color: string; x: number; delay: number }) => (
  <motion.div
    className={`absolute top-3 font-black text-white text-xs px-3 py-1 rounded-full shadow-lg border-2 border-white/30 ${color}`}
    style={{ left: x }}
    animate={{ rotate: [-5, 5, -5], y: [0, -4, 0] }}
    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay }}
  >
    {text}
  </motion.div>
);

/* ── Komponen Input ──────────────────────────────────────── */
const InputBox = ({
  label, value, onChange, placeholder, icon, color,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  placeholder: string; icon: string; color: string;
}) => (
  <div>
    <label className={`text-xs font-bold uppercase tracking-wide block mb-1 ${color}`}>
      {icon} {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Rp</span>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-orange-400 outline-none font-bold text-gray-800 bg-white/80 text-sm"
        min="0"
      />
    </div>
  </div>
);

const PctInput = ({
  label, value, onChange, placeholder, icon, color,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  placeholder: string; icon: string; color: string;
}) => (
  <div>
    <label className={`text-xs font-bold uppercase tracking-wide block mb-1 ${color}`}>
      {icon} {label}
    </label>
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pr-10 pl-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none font-bold text-gray-800 bg-white/80 text-sm"
        min="0" max="100"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">%</span>
    </div>
  </div>
);

/* ── Result chip ─────────────────────────────────────────── */
const ResultChip = ({
  label, value, icon, bg, shown,
}: { label: string; value: string; icon: string; bg: string; shown: boolean }) => (
  <motion.div
    className={`rounded-2xl p-3 flex flex-col items-center gap-1 shadow-md ${bg}`}
    initial={false}
    animate={shown ? { scale: [0.85, 1.08, 1], opacity: 1 } : { opacity: 0.4, scale: 0.95 }}
    transition={{ type: "spring", stiffness: 260, damping: 18 }}
  >
    <span className="text-2xl">{icon}</span>
    <span className="text-xs font-bold text-gray-600 uppercase tracking-wide text-center">{label}</span>
    <motion.span
      key={value}
      className="text-sm font-black text-gray-800 text-center"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {value}
    </motion.span>
  </motion.div>
);

/* ── MAIN COMPONENT ──────────────────────────────────────── */
const WarungDiskon = () => {
  const [mode, setMode] = useState<"biasa" | "berganda">("biasa");

  /* Diskon Biasa */
  const [harga, setHarga] = useState("200000");
  const [diskon, setDiskon] = useState("30");

  /* Diskon Berganda */
  const [hargaG, setHargaG] = useState("500000");
  const [d1, setD1] = useState("20");
  const [d2, setD2] = useState("10");

  const [isTransacting, setIsTransacting] = useState(false);
  const [buyerX, setBuyerX] = useState(330);
  const [showFloats, setShowFloats] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [buyerHappy, setBuyerHappy] = useState(false);
  const [penjualExcited, setPenjualExcited] = useState(false);

  /* ── Kalkulasi Biasa ── */
  const ha = parseFloat(harga) || 0;
  const dp = parseFloat(diskon) || 0;
  const besarDiskon = ha * dp / 100;
  const hargaBayar = ha - besarDiskon;

  /* ── Kalkulasi Berganda ── */
  const hg = parseFloat(hargaG) || 0;
  const dp1 = parseFloat(d1) || 0;
  const dp2 = parseFloat(d2) || 0;
  const setelahD1 = hg * (1 - dp1 / 100);
  const setelahD2 = setelahD1 * (1 - dp2 / 100);
  const totalPotongan = hg - setelahD2;
  const pctEfektif = hg > 0 ? (totalPotongan / hg) * 100 : 0;
  const diskonGabungan = 100 - (100 - dp1) * (100 - dp2) / 100;

  const handleBeli = async () => {
    if (isTransacting) return;
    const cukup = mode === "biasa" ? ha > 0 && dp > 0 : hg > 0 && dp1 > 0 && dp2 > 0;
    if (!cukup) return;

    setIsTransacting(true);
    setShowResult(false);
    setBuyerHappy(false);
    setPenjualExcited(true);
    setBuyerX(330);

    await new Promise(r => setTimeout(r, 120));
    setBuyerX(30);
    await new Promise(r => setTimeout(r, 900));
    setShowFloats(true);
    await new Promise(r => setTimeout(r, 1400));
    setShowFloats(false);
    setBuyerHappy(true);
    setShowResult(true);

    await new Promise(r => setTimeout(r, 1200));
    setBuyerX(330);
    await new Promise(r => setTimeout(r, 800));
    setPenjualExcited(false);
    setBuyerHappy(false);
    setIsTransacting(false);
  };

  const canBuy = mode === "biasa" ? ha > 0 && dp > 0 && dp <= 100
    : hg > 0 && dp1 > 0 && dp2 > 0 && dp1 + dp2 <= 100;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl"
      style={{ background: "linear-gradient(135deg, #fefce8 0%, #fdf4ff 50%, #eff6ff 100%)" }}>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className={`px-6 py-4 flex items-center justify-between ${
        mode === "biasa"
          ? "bg-gradient-to-r from-orange-500 via-red-400 to-pink-400"
          : "bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500"
      }`}>
        <div>
          <div className="text-white font-black text-xl drop-shadow">🏷️ Warung Diskon Interaktif</div>
          <div className="text-yellow-100 text-sm font-semibold">Aritmetika Sosial — Kelas 7</div>
        </div>
        <div className="bg-white/20 rounded-full px-3 py-1 text-white text-xs font-bold animate-pulse">
          {mode === "biasa" ? "💥 SALE!" : "🎉 DOUBLE SALE!"}
        </div>
      </div>

      {/* ── MODE TABS ──────────────────────────────────────── */}
      <div className="flex gap-3 px-4 py-3 bg-gray-100/80 border-b-2 border-gray-200">
        <button
          onClick={() => { setMode("biasa"); setShowResult(false); }}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-sm transition-all duration-200 cursor-pointer select-none
            border-2 shadow-md active:scale-95 active:shadow-sm ${
            mode === "biasa"
              ? "bg-gradient-to-r from-orange-400 to-red-400 text-white border-orange-500 shadow-orange-200"
              : "bg-white text-gray-600 border-gray-300 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 hover:shadow-orange-100"
          }`}
        >
          🏷️ Diskon Biasa
        </button>
        <button
          onClick={() => { setMode("berganda"); setShowResult(false); }}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-sm transition-all duration-200 cursor-pointer select-none
            border-2 shadow-md active:scale-95 active:shadow-sm ${
            mode === "berganda"
              ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-600 shadow-purple-200"
              : "bg-white text-gray-600 border-gray-300 hover:border-purple-400 hover:text-purple-500 hover:bg-purple-50 hover:shadow-purple-100"
          }`}
        >
          🎉 Diskon Berganda
        </button>
      </div>

      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* ── LEFT: Animasi Warung ─────────────────────────── */}
        <div className="flex flex-col gap-3">
          <div className="relative rounded-2xl overflow-hidden"
            style={{
              minHeight: 270,
              background: "linear-gradient(180deg, #bfdbfe 0%, #ddd6fe 40%, #bbf7d0 100%)"
            }}>

            {/* Awan bergerak */}
            <motion.div className="absolute top-2 left-3 text-4xl opacity-70"
              animate={{ x: [0, 14, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>☁️</motion.div>
            <motion.div className="absolute top-4 right-8 text-3xl opacity-60"
              animate={{ x: [0, -10, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>☁️</motion.div>

            {/* Matahari berputar */}
            <motion.div className="absolute top-1 right-3 text-3xl"
              animate={{ rotate: [0, 360] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
              {mode === "biasa" ? "🌟" : "💫"}
            </motion.div>

            {/* Banner diskon mengayun */}
            <SwingBanner text="🔥 DISKON!" color="bg-red-500" x={18} delay={0} />
            <SwingBanner text="💸 HEMAT!" color="bg-green-500" x={110} delay={0.4} />
            <SwingBanner text={mode === "biasa" ? "🏷️ SALE!" : "✨ 2x DISKON!"} color={mode === "biasa" ? "bg-orange-500" : "bg-purple-600"} x={200} delay={0.8} />

            {/* Tanah */}
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-green-500 to-green-400 rounded-b-2xl" />

            {/* Warung */}
            <div className="absolute bottom-11 left-1/2 -translate-x-1/2">
              <WarungDiskonBuilding mode={mode} />
            </div>

            {/* Penjual */}
            <div className="absolute bottom-12" style={{ left: "calc(50% - 14px)" }}>
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <PenjualDiskonSVG excited={penjualExcited} />
              </motion.div>
            </div>

            {/* Pembeli */}
            <motion.div
              className="absolute bottom-12"
              animate={{ x: buyerX - 300 }}
              transition={{ duration: 0.75, ease: "easeInOut" }}
              style={{ right: 10 }}
            >
              <PembeliDiskonSVG running={isTransacting && buyerX < 200} happy={buyerHappy} />
            </motion.div>

            {/* Floating tags saat transaksi */}
            <AnimatePresence>
              {showFloats && mode === "biasa" && (
                <>
                  <FloatTag text={`-${dp}%`} x={120} y={140} delay={0} color="bg-red-500" />
                  <FloatTag text={`Hemat ${fmt(besarDiskon)}`} x={90} y={155} delay={0.2} color="bg-green-600" />
                  <FloatTag text="🎉 MURAH!" x={155} y={145} delay={0.4} color="bg-orange-500" />
                  <Confetti x={130} y={120} delay={0} emoji="🎊" />
                  <Confetti x={155} y={115} delay={0.2} emoji="💸" />
                  <Confetti x={105} y={125} delay={0.35} emoji="🏷️" />
                  <Confetti x={170} y={128} delay={0.5} emoji="⭐" />
                </>
              )}
              {showFloats && mode === "berganda" && (
                <>
                  <FloatTag text={`-${dp1}% dulu!`} x={100} y={138} delay={0} color="bg-purple-600" />
                  <FloatTag text={`-${dp2}% lagi!`} x={115} y={155} delay={0.3} color="bg-indigo-600" />
                  <FloatTag text={`Total hemat ${pct(pctEfektif)}!`} x={80} y={170} delay={0.6} color="bg-green-600" />
                  <Confetti x={130} y={115} delay={0} emoji="🎉" />
                  <Confetti x={150} y={120} delay={0.15} emoji="💜" />
                  <Confetti x={110} y={118} delay={0.3} emoji="✨" />
                  <Confetti x={165} y={112} delay={0.45} emoji="🎊" />
                  <Confetti x={95} y={125} delay={0.6} emoji="💸" />
                </>
              )}
            </AnimatePresence>

            {/* Label hasil transaksi */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  className={`absolute top-14 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full font-black text-white text-sm shadow-xl ${
                    mode === "biasa" ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gradient-to-r from-purple-600 to-indigo-600"
                  }`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  {mode === "biasa"
                    ? `✅ Hemat ${fmt(besarDiskon)}! Bayar ${fmt(hargaBayar)}`
                    : `✅ Hemat ${fmt(totalPotongan)}! Bayar ${fmt(setelahD2)}`}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tombol Beli */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleBeli}
            disabled={isTransacting || !canBuy}
            className={`w-full py-3.5 rounded-2xl font-black text-white text-lg shadow-lg transition-all ${
              isTransacting || !canBuy
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : mode === "biasa"
                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 hover:shadow-orange-300/50 hover:shadow-xl"
                : "bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 hover:shadow-purple-300/50 hover:shadow-xl"
            }`}
          >
            {isTransacting
              ? "⏳ Lagi belanja..."
              : mode === "biasa"
              ? "🛍️ BELI SEKARANG!"
              : "🎉 AMBIL DOUBLE DISKON!"}
          </motion.button>
        </div>

        {/* ── RIGHT: Input + Hasil ─────────────────────────── */}
        <div className="flex flex-col gap-4">

          <AnimatePresence mode="wait">
            {mode === "biasa" ? (
              <motion.div key="biasa"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4">

                {/* Input Diskon Biasa */}
                <div className="bg-white/80 rounded-2xl p-4 shadow border border-orange-100 space-y-3">
                  <div className="text-center font-black text-orange-600 text-sm uppercase tracking-wide mb-1">
                    🏷️ Masukkan Data
                  </div>
                  <InputBox label="Harga Awal" value={harga} onChange={v => { setHarga(v); setShowResult(false); }}
                    placeholder="Contoh: 200000" icon="💰" color="text-orange-600" />
                  <PctInput label="Diskon (%)" value={diskon} onChange={v => { setDiskon(v); setShowResult(false); }}
                    placeholder="Contoh: 30" icon="🔖" color="text-red-600" />
                </div>

                {/* Hasil Diskon Biasa */}
                <div className="grid grid-cols-2 gap-2">
                  <ResultChip label="Harga Awal" value={ha > 0 ? fmt(ha) : "-"}
                    icon="🏷️" bg="bg-orange-100 border-2 border-orange-200" shown={ha > 0} />
                  <ResultChip label="Diskon" value={ha > 0 && dp > 0 ? pct(dp) : "-"}
                    icon="🔖" bg="bg-red-100 border-2 border-red-200" shown={ha > 0 && dp > 0} />
                  <ResultChip label="Besar Potongan" value={ha > 0 && dp > 0 ? fmt(besarDiskon) : "-"}
                    icon="💸" bg="bg-yellow-100 border-2 border-yellow-300" shown={showResult} />
                  <ResultChip label="Harga Bayar" value={ha > 0 && dp > 0 ? fmt(hargaBayar) : "-"}
                    icon="✅" bg="bg-green-100 border-2 border-green-300" shown={showResult} />
                </div>

                {/* Rumus Diskon Biasa */}
                <div className="bg-white/90 rounded-2xl p-4 border-2 border-orange-100 shadow space-y-2">
                  <div className="text-center text-xs font-black text-orange-600 uppercase tracking-wide">📐 Rumus</div>
                  <div className="space-y-1.5 text-xs font-mono text-gray-700">
                    <div className="bg-red-50 rounded-lg px-3 py-1.5 flex justify-between">
                      <span className="text-red-700 font-bold">Besar Diskon</span>
                      <span>= % Diskon × Harga Awal</span>
                    </div>
                    <div className="bg-green-50 rounded-lg px-3 py-1.5 flex justify-between">
                      <span className="text-green-700 font-bold">Harga Bayar</span>
                      <span>= Harga Awal − Besar Diskon</span>
                    </div>
                    <div className="bg-blue-50 rounded-lg px-3 py-1.5 flex justify-between">
                      <span className="text-blue-700 font-bold">Harga Bayar</span>
                      <span>= (100 − %) × Harga Awal ÷ 100</span>
                    </div>
                  </div>
                  {showResult && ha > 0 && dp > 0 && (
                    <motion.div
                      className="mt-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 text-center font-black text-orange-800 text-xs"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    >
                      {fmt(ha)} × {dp}% = {fmt(besarDiskon)} → Bayar {fmt(hargaBayar)}
                    </motion.div>
                  )}
                </div>
              </motion.div>

            ) : (
              <motion.div key="berganda"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4">

                {/* Input Diskon Berganda */}
                <div className="bg-white/80 rounded-2xl p-4 shadow border border-purple-100 space-y-3">
                  <div className="text-center font-black text-purple-600 text-sm uppercase tracking-wide mb-1">
                    🎉 Masukkan Data Double Diskon
                  </div>
                  <InputBox label="Harga Awal" value={hargaG} onChange={v => { setHargaG(v); setShowResult(false); }}
                    placeholder="Contoh: 500000" icon="💰" color="text-purple-700" />
                  <div className="grid grid-cols-2 gap-2">
                    <PctInput label="Diskon ke-1" value={d1} onChange={v => { setD1(v); setShowResult(false); }}
                      placeholder="Contoh: 20" icon="1️⃣" color="text-purple-600" />
                    <PctInput label="Diskon ke-2" value={d2} onChange={v => { setD2(v); setShowResult(false); }}
                      placeholder="Contoh: 10" icon="2️⃣" color="text-indigo-600" />
                  </div>
                  <div className="bg-purple-50 rounded-xl px-3 py-2 text-xs text-purple-700 font-semibold text-center">
                    ⚠️ Diskon berganda: diskon ke-2 dihitung dari sisa harga setelah diskon ke-1
                  </div>
                </div>

                {/* Hasil Diskon Berganda - langkah demi langkah */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <ResultChip label="Harga Awal" value={hg > 0 ? fmt(hg) : "-"}
                      icon="💰" bg="bg-purple-100 border-2 border-purple-200" shown={hg > 0} />
                    <ResultChip label={`Setelah Diskon ${dp1}%`} value={hg > 0 && dp1 > 0 ? fmt(setelahD1) : "-"}
                      icon="1️⃣" bg="bg-violet-100 border-2 border-violet-200" shown={hg > 0 && dp1 > 0} />
                    <ResultChip label={`Setelah Diskon ${dp2}%`} value={hg > 0 && dp2 > 0 ? fmt(setelahD2) : "-"}
                      icon="2️⃣" bg="bg-indigo-100 border-2 border-indigo-200" shown={showResult} />
                    <ResultChip label="Total Hemat" value={hg > 0 && dp1 > 0 && dp2 > 0 ? fmt(totalPotongan) : "-"}
                      icon="💸" bg="bg-green-100 border-2 border-green-300" shown={showResult} />
                  </div>
                  {showResult && hg > 0 && (
                    <motion.div
                      className="bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-purple-200 rounded-xl p-3 text-center"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="text-xs text-purple-600 font-bold mb-1">⚡ Diskon Efektif Total</div>
                      <div className="text-2xl font-black text-purple-800">{pct(pctEfektif)}</div>
                      <div className="text-xs text-purple-500 mt-0.5">
                        ≠ {dp1}% + {dp2}% = {dp1 + dp2}% (diskon berganda BUKAN penjumlahan!)
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Rumus Diskon Berganda */}
                <div className="bg-white/90 rounded-2xl p-4 border-2 border-purple-100 shadow space-y-2">
                  <div className="text-center text-xs font-black text-purple-600 uppercase tracking-wide">📐 Rumus</div>
                  <div className="space-y-1.5 text-xs font-mono text-gray-700">
                    <div className="bg-purple-50 rounded-lg px-3 py-1.5 flex justify-between">
                      <span className="text-purple-700 font-bold">Harga setelah D1</span>
                      <span>= (100 − D1)% × H.Awal</span>
                    </div>
                    <div className="bg-indigo-50 rounded-lg px-3 py-1.5 flex justify-between">
                      <span className="text-indigo-700 font-bold">Harga setelah D2</span>
                      <span>= (100 − D2)% × H.stlh D1</span>
                    </div>
                    <div className="bg-green-50 rounded-lg px-3 py-1.5 flex justify-between">
                      <span className="text-green-700 font-bold">Efektif</span>
                      <span>= 100 − (100−D1)(100−D2)/100</span>
                    </div>
                  </div>
                  {showResult && hg > 0 && (
                    <motion.div
                      className="mt-2 bg-purple-50 border border-purple-200 rounded-xl px-3 py-2 text-center font-bold text-purple-800 text-xs leading-relaxed"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    >
                      {fmt(hg)} → -{dp1}% → {fmt(setelahD1)} → -{dp2}% → {fmt(setelahD2)}
                      <br />Efektif: 100 − {(100-dp1).toFixed(0)}×{(100-dp2).toFixed(0)}/100 = {pct(diskonGabungan)}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WarungDiskon;
