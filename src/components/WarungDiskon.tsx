import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const makeFmt = (lang: string) => (n: number) =>
  (lang === "id" ? "Rp " : "$ ") + Math.round(n).toLocaleString(lang === "id" ? "id-ID" : "en-US");

const pct = (n: number) => n.toFixed(1).replace(/\.0$/, "") + "%";

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

const PenjualDiskonSVG = ({ excited }: { excited: boolean }) => (
  <svg width="78" height="108" viewBox="0 0 78 108" fill="none">
    <ellipse cx="39" cy="74" rx="20" ry="23" fill="#38a169" />
    <ellipse cx="18" cy="80" rx="7" ry="5" fill="#38a169" transform="rotate(-20 18 80)" />
    <motion.g
      animate={excited ? { rotate: [0, -15, 15, -10, 0] } : { rotate: [0, -5, 0] }}
      transition={{ duration: excited ? 0.5 : 2, repeat: Infinity, ease: "easeInOut" }}
      style={{ originX: "60px", originY: "70px" }}
    >
      <ellipse cx="62" cy="68" rx="9" ry="5" fill="#38a169" transform="rotate(10 62 68)" />
      <rect x="58" y="48" width="32" height="20" rx="4" fill="#e53e3e" />
      <rect x="60" y="50" width="28" height="16" rx="3" fill="#fc8181" />
      <text x="74" y="62" textAnchor="middle" fontSize="8" fill="#7b0000" fontWeight="bold">SALE!</text>
      <line x1="70" y1="68" x2="70" y2="48" stroke="#c53030" strokeWidth="2" />
    </motion.g>
    <circle cx="39" cy="37" r="18" fill="#f6ad55" />
    <circle cx="33" cy="35" r="2.5" fill="#2d3748" />
    <circle cx="45" cy="35" r="2.5" fill="#2d3748" />
    <circle cx="34" cy="34" r="1" fill="white" />
    <circle cx="46" cy="34" r="1" fill="white" />
    <motion.path
      d={excited ? "M30 44 Q39 54 48 44" : "M31 44 Q39 51 47 44"}
      stroke="#2d3748" strokeWidth="2.5" fill="none" strokeLinecap="round"
    />
    <ellipse cx="39" cy="21" rx="18" ry="9" fill="#744210" />
    <rect x="24" y="15" width="30" height="8" rx="3" fill="#276749" />
    <rect x="20" y="22" width="38" height="4" rx="2" fill="#276749" />
    <rect x="27" y="93" width="11" height="14" rx="4" fill="#2d3748" />
    <rect x="40" y="93" width="11" height="14" rx="4" fill="#2d3748" />
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
    <ellipse cx="35" cy="72" rx="18" ry="22" fill="#805ad5" />
    <ellipse cx="15" cy="77" rx="7" ry="5" fill="#805ad5" transform="rotate(20 15 77)" />
    <ellipse cx="56" cy="74" rx="8" ry="5" fill="#805ad5" transform="rotate(-15 56 74)" />
    <rect x="52" y="74" width="18" height="16" rx="3" fill="#f6e05e" />
    <path d="M55 74 Q56 68 61 68 Q66 68 67 74" stroke="#d69e2e" strokeWidth="2" fill="none" />
    <text x="53" y="86" fontSize="9">🛍️</text>
    <circle cx="35" cy="36" r="17" fill="#fbd38d" />
    <circle cx="29" cy="34" r="2.5" fill="#2d3748" />
    <circle cx="41" cy="34" r="2.5" fill="#2d3748" />
    <circle cx="30" cy="33" r="1" fill="white" />
    <circle cx="42" cy="33" r="1" fill="white" />
    {happy ? (
      <>
        <path d="M27 43 Q35 52 43 43" stroke="#2d3748" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <text x="10" y="22" fontSize="11">😍</text>
      </>
    ) : (
      <path d="M28 43 Q35 49 42 43" stroke="#2d3748" strokeWidth="2" fill="none" strokeLinecap="round" />
    )}
    <ellipse cx="35" cy="22" rx="17" ry="10" fill="#e53e3e" />
    <path d="M24 18 Q35 12 46 18" stroke="#fc8181" strokeWidth="3" fill="none" />
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

const WarungDiskonBuilding = ({ mode }: { mode: "biasa" | "berganda" }) => (
  <svg width="310" height="215" viewBox="0 0 310 215" fill="none">
    <rect x="15" y="78" width="280" height="128" fill="#fff9f0" rx="4" />
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
    <polygon points="0,78 155,8 310,78"
      fill={mode === "biasa" ? "#c05621" : "#553c9a"} />
    <line x1="0" y1="78" x2="310" y2="78"
      stroke={mode === "biasa" ? "#9c4221" : "#44337a"} strokeWidth="3" />
    <rect x="65" y="52" width="180" height="34" rx="7"
      fill={mode === "biasa" ? "#c05621" : "#553c9a"} />
    <rect x="68" y="55" width="174" height="28" rx="5"
      fill={mode === "biasa" ? "#dd6b20" : "#6b46c1"} />
    <text x="155" y="74" textAnchor="middle" fill="#fefcbf"
      fontSize="12" fontWeight="bold" fontFamily="sans-serif">
      {mode === "biasa" ? "🏷️ SALE STORE" : "🏷️ DOUBLE SALE"}
    </text>
    <rect x="50" y="153" width="210" height="10" rx="3" fill="#92400e" />
    <rect x="45" y="158" width="220" height="50" rx="4" fill="#b45309" />
    <rect x="50" y="161" width="210" height="44" rx="3"
      fill="rgba(186,230,253,0.3)" stroke="#7dd3fc" strokeWidth="1.5" />
    <text x="62" y="190" fontSize="17">👗</text>
    <text x="92" y="190" fontSize="17">👟</text>
    <text x="122" y="190" fontSize="17">📱</text>
    <text x="152" y="190" fontSize="17">🎒</text>
    <text x="182" y="190" fontSize="17">⌚</text>
    <text x="212" y="190" fontSize="17">🕶️</text>
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
    <circle cx="155" cy="48" r="5" fill="#fefcbf" />
    <line x1="155" y1="8" x2="155" y2="43" stroke="#d1d5db" strokeWidth="1.5" />
  </svg>
);

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

const InputBox = ({
  label, value, onChange, placeholder, icon, color, currSymbol,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  placeholder: string; icon: string; color: string; currSymbol: string;
}) => (
  <div>
    <label className={`text-xs font-bold uppercase tracking-wide block mb-1 ${color}`}>
      {icon} {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">{currSymbol}</span>
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

const WarungDiskon = () => {
  const { language: lang } = useLanguage();
  const fmt = makeFmt(lang);
  const curr = lang === "id" ? "Rp" : "$";

  const ui = {
    id: {
      header: "🏷️ Warung Diskon Interaktif",
      subheader: "Aritmetika Sosial — Kelas 7",
      tabBiasa: "🏷️ Diskon Biasa",
      tabBerganda: "🎉 Diskon Berganda",
      btnBeli: "🛍️ BELI SEKARANG!",
      btnWait: "⏳ Proses...",
      labelHarga: "Harga Awal",
      labelDiskon: "Diskon (%)",
      labelHargaG: "Harga Awal",
      labelD1: "Diskon 1 (%)",
      labelD2: "Diskon 2 (%)",
      phHarga: "200000",
      phHargaG: "500000",
      phD: "30",
      chipHarga: "Harga Awal",
      chipDiskon: "Besar Diskon",
      chipBayar: "Harga Bayar",
      chipSetelahD1: "Setelah Diskon 1",
      chipSetelahD2: "Harga Bayar",
      chipEfektif: "Total Hemat",
      bannerSale: "💥 SALE!",
      bannerDouble: "🎉 2x DISKON!",
      floatSave: "Hemat",
      floatCheap: "🎉 MURAH!",
      resultBiasa: (hmt: string, bayar: string) => `✅ Hemat ${hmt}! Bayar ${bayar}`,
      resultBerganda: (hmt: string, bayar: string) => `✅ Hemat ${hmt}! Bayar ${bayar}`,
      rumusTitle: "📐 Rumus",
      rumusBiasa: "Harga Bayar = Harga Awal × (1 − %Diskon)",
      rumusBesarDiskon: "Besar Diskon = Harga Awal × %Diskon",
      rumusBerganda: "Diskon berganda: terapkan diskon pertama, lalu diskon kedua dari sisa",
      rumusEfektif: "Efektif = 100 − (100 − D1)(100 − D2)/100",
      infoEfektif: (pct1: number, pct2: number, eff: string) =>
        `Diskon ${pct1}% + ${pct2}% ≠ ${pct1 + pct2}%. Efektif hanya ${eff}!`,
    },
    en: {
      header: "🏷️ Interactive Discount Shop",
      subheader: "Social Arithmetic — Grade 7",
      tabBiasa: "🏷️ Single Discount",
      tabBerganda: "🎉 Double Discount",
      btnBeli: "🛍️ BUY NOW!",
      btnWait: "⏳ Processing...",
      labelHarga: "Original Price",
      labelDiskon: "Discount (%)",
      labelHargaG: "Original Price",
      labelD1: "Discount 1 (%)",
      labelD2: "Discount 2 (%)",
      phHarga: "200000",
      phHargaG: "500000",
      phD: "30",
      chipHarga: "Original Price",
      chipDiskon: "Discount Amount",
      chipBayar: "Price to Pay",
      chipSetelahD1: "After Discount 1",
      chipSetelahD2: "Price to Pay",
      chipEfektif: "Total Saved",
      bannerSale: "💥 SALE!",
      bannerDouble: "🎉 DOUBLE SALE!",
      floatSave: "Saved",
      floatCheap: "🎉 BARGAIN!",
      resultBiasa: (hmt: string, bayar: string) => `✅ Saved ${hmt}! Pay ${bayar}`,
      resultBerganda: (hmt: string, bayar: string) => `✅ Saved ${hmt}! Pay ${bayar}`,
      rumusTitle: "📐 Formulas",
      rumusBiasa: "Price to Pay = Original × (1 − %Discount)",
      rumusBesarDiskon: "Discount Amount = Original × %Discount",
      rumusBerganda: "Double discount: apply first discount, then second on remaining price",
      rumusEfektif: "Effective = 100 − (100 − D1)(100 − D2)/100",
      infoEfektif: (pct1: number, pct2: number, eff: string) =>
        `${pct1}% + ${pct2}% ≠ ${pct1 + pct2}%. Effective discount is only ${eff}!`,
    },
    ja: {
      header: "🏷️ 割引ショップ体験",
      subheader: "社会算数 — 中学1年",
      tabBiasa: "🏷️ 通常割引",
      tabBerganda: "🎉 二重割引",
      btnBeli: "🛍️ 購入する！",
      btnWait: "⏳ 処理中...",
      labelHarga: "定価",
      labelDiskon: "割引率（%）",
      labelHargaG: "定価",
      labelD1: "割引1（%）",
      labelD2: "割引2（%）",
      phHarga: "200000",
      phHargaG: "500000",
      phD: "30",
      chipHarga: "定価",
      chipDiskon: "割引額",
      chipBayar: "支払い額",
      chipSetelahD1: "割引1後",
      chipSetelahD2: "支払い額",
      chipEfektif: "合計節約",
      bannerSale: "💥 セール！",
      bannerDouble: "🎉 ダブルセール！",
      floatSave: "節約",
      floatCheap: "🎉 お得！",
      resultBiasa: (hmt: string, bayar: string) => `✅ ${hmt}節約！${bayar}支払い`,
      resultBerganda: (hmt: string, bayar: string) => `✅ ${hmt}節約！${bayar}支払い`,
      rumusTitle: "📐 公式",
      rumusBiasa: "支払い額 = 定価 × (1 − 割引率)",
      rumusBesarDiskon: "割引額 = 定価 × 割引率",
      rumusBerganda: "二重割引：1回目の割引後、残額に2回目の割引を適用",
      rumusEfektif: "実効割引 = 100 − (100 − D1)(100 − D2)/100",
      infoEfektif: (pct1: number, pct2: number, eff: string) =>
        `${pct1}% + ${pct2}% ≠ ${pct1 + pct2}%。実効割引は${eff}のみ！`,
    },
  };
  const t = ui[lang as keyof typeof ui] ?? ui.id;

  const [mode, setMode] = useState<"biasa" | "berganda">("biasa");

  const [harga, setHarga] = useState("200000");
  const [diskon, setDiskon] = useState("30");

  const [hargaG, setHargaG] = useState("500000");
  const [d1, setD1] = useState("20");
  const [d2, setD2] = useState("10");

  const [isTransacting, setIsTransacting] = useState(false);
  const [buyerX, setBuyerX] = useState(330);
  const [showFloats, setShowFloats] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [buyerHappy, setBuyerHappy] = useState(false);
  const [penjualExcited, setPenjualExcited] = useState(false);

  const ha = parseFloat(harga) || 0;
  const dp = parseFloat(diskon) || 0;
  const besarDiskon = ha * dp / 100;
  const hargaBayar = ha - besarDiskon;

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

      <div className={`px-6 py-4 flex items-center justify-between ${
        mode === "biasa"
          ? "bg-gradient-to-r from-orange-500 via-red-400 to-pink-400"
          : "bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500"
      }`}>
        <div>
          <div className="text-white font-black text-xl drop-shadow">{t.header}</div>
          <div className="text-yellow-100 text-sm font-semibold">{t.subheader}</div>
        </div>
        <div className="bg-white/20 rounded-full px-3 py-1 text-white text-xs font-bold animate-pulse">
          {mode === "biasa" ? t.bannerSale : t.bannerDouble}
        </div>
      </div>

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
          {t.tabBiasa}
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
          {t.tabBerganda}
        </button>
      </div>

      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="flex flex-col gap-3">
          <div className="relative rounded-2xl overflow-hidden"
            style={{
              minHeight: 270,
              background: "linear-gradient(180deg, #bfdbfe 0%, #ddd6fe 40%, #bbf7d0 100%)"
            }}>

            <motion.div className="absolute top-2 left-3 text-4xl opacity-70"
              animate={{ x: [0, 14, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>☁️</motion.div>
            <motion.div className="absolute top-4 right-8 text-3xl opacity-60"
              animate={{ x: [0, -10, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>☁️</motion.div>
            <motion.div className="absolute top-1 right-3 text-3xl"
              animate={{ rotate: [0, 360] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
              {mode === "biasa" ? "🌟" : "💫"}
            </motion.div>

            <SwingBanner text="🔥 SALE!" color="bg-red-500" x={18} delay={0} />
            <SwingBanner text="💸 SAVE!" color="bg-green-500" x={110} delay={0.4} />
            <SwingBanner text={mode === "biasa" ? "🏷️ SALE!" : "✨ 2x OFF!"} color={mode === "biasa" ? "bg-orange-500" : "bg-purple-600"} x={200} delay={0.8} />

            <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-green-500 to-green-400 rounded-b-2xl" />

            <div className="absolute bottom-11 left-1/2 -translate-x-1/2">
              <WarungDiskonBuilding mode={mode} />
            </div>

            <div className="absolute bottom-12" style={{ left: "calc(50% - 14px)" }}>
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <PenjualDiskonSVG excited={penjualExcited} />
              </motion.div>
            </div>

            <motion.div
              className="absolute bottom-12"
              animate={{ x: buyerX - 300 }}
              transition={{ duration: 0.75, ease: "easeInOut" }}
              style={{ right: 10 }}
            >
              <PembeliDiskonSVG running={isTransacting && buyerX < 200} happy={buyerHappy} />
            </motion.div>

            <AnimatePresence>
              {showFloats && mode === "biasa" && (
                <>
                  <FloatTag text={`-${dp}%`} x={120} y={140} delay={0} color="bg-red-500" />
                  <FloatTag text={`${t.floatSave} ${fmt(besarDiskon)}`} x={90} y={155} delay={0.2} color="bg-green-600" />
                  <FloatTag text={t.floatCheap} x={155} y={145} delay={0.4} color="bg-orange-500" />
                  <Confetti x={130} y={120} delay={0} emoji="🎊" />
                  <Confetti x={155} y={115} delay={0.2} emoji="💸" />
                  <Confetti x={105} y={125} delay={0.35} emoji="🏷️" />
                  <Confetti x={170} y={128} delay={0.5} emoji="⭐" />
                </>
              )}
              {showFloats && mode === "berganda" && (
                <>
                  <FloatTag text={`-${dp1}%`} x={100} y={138} delay={0} color="bg-purple-600" />
                  <FloatTag text={`-${dp2}%`} x={115} y={155} delay={0.3} color="bg-indigo-600" />
                  <FloatTag text={`${t.floatSave} ${pct(pctEfektif)}!`} x={80} y={170} delay={0.6} color="bg-green-600" />
                  <Confetti x={130} y={115} delay={0} emoji="🎉" />
                  <Confetti x={150} y={120} delay={0.15} emoji="💜" />
                  <Confetti x={110} y={118} delay={0.3} emoji="✨" />
                  <Confetti x={165} y={112} delay={0.45} emoji="🎊" />
                  <Confetti x={95} y={125} delay={0.6} emoji="💸" />
                </>
              )}
            </AnimatePresence>

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
                    ? t.resultBiasa(fmt(besarDiskon), fmt(hargaBayar))
                    : t.resultBerganda(fmt(totalPotongan), fmt(setelahD2))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleBeli}
            disabled={isTransacting || !canBuy}
            className={`w-full py-3 rounded-2xl font-black text-white text-lg shadow-lg transition-all ${
              isTransacting || !canBuy
                ? "bg-gray-400 cursor-not-allowed"
                : mode === "biasa"
                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 hover:shadow-orange-300/50 hover:shadow-xl"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-300/50 hover:shadow-xl"
            }`}
          >
            {isTransacting ? t.btnWait : t.btnBeli}
          </motion.button>
        </div>

        <div className="flex flex-col gap-4">

          {mode === "biasa" ? (
            <div className="bg-white/80 rounded-2xl p-4 shadow-md space-y-3 border border-orange-100">
              <InputBox label={t.labelHarga} value={harga} onChange={v => { setHarga(v); setShowResult(false); }}
                placeholder={t.phHarga} icon="💰" color="text-orange-700" currSymbol={curr} />
              <PctInput label={t.labelDiskon} value={diskon} onChange={v => { setDiskon(v); setShowResult(false); }}
                placeholder={t.phD} icon="🏷️" color="text-red-700" />
            </div>
          ) : (
            <div className="bg-white/80 rounded-2xl p-4 shadow-md space-y-3 border border-purple-100">
              <InputBox label={t.labelHargaG} value={hargaG} onChange={v => { setHargaG(v); setShowResult(false); }}
                placeholder={t.phHargaG} icon="💰" color="text-purple-700" currSymbol={curr} />
              <PctInput label={t.labelD1} value={d1} onChange={v => { setD1(v); setShowResult(false); }}
                placeholder="20" icon="1️⃣" color="text-purple-700" />
              <PctInput label={t.labelD2} value={d2} onChange={v => { setD2(v); setShowResult(false); }}
                placeholder="10" icon="2️⃣" color="text-indigo-700" />
            </div>
          )}

          {mode === "biasa" ? (
            <div className="grid grid-cols-3 gap-2">
              <ResultChip label={t.chipHarga} value={ha > 0 ? fmt(ha) : "-"} icon="💰" bg="bg-blue-50 border-2 border-blue-200" shown={true} />
              <ResultChip label={t.chipDiskon} value={ha > 0 && dp > 0 ? fmt(besarDiskon) : "-"} icon="✂️" bg="bg-red-50 border-2 border-red-200" shown={showResult} />
              <ResultChip label={t.chipBayar} value={ha > 0 && dp > 0 ? fmt(hargaBayar) : "-"} icon="🛍️" bg="bg-green-50 border-2 border-green-300" shown={showResult} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <ResultChip label={t.chipHarga} value={hg > 0 ? fmt(hg) : "-"} icon="💰" bg="bg-blue-50 border-2 border-blue-200" shown={true} />
              <ResultChip label={t.chipSetelahD1} value={hg > 0 && dp1 > 0 ? fmt(setelahD1) : "-"} icon="1️⃣" bg="bg-purple-50 border-2 border-purple-200" shown={showResult} />
              <ResultChip label={t.chipSetelahD2} value={hg > 0 && dp1 > 0 && dp2 > 0 ? fmt(setelahD2) : "-"} icon="🛍️" bg="bg-green-50 border-2 border-green-300" shown={showResult} />
              <ResultChip label={t.chipEfektif} value={hg > 0 && dp1 > 0 && dp2 > 0 ? `${pct(pctEfektif)}` : "-"} icon="📊" bg="bg-yellow-50 border-2 border-yellow-300" shown={showResult} />
            </div>
          )}

          <div className="bg-white/90 rounded-2xl p-4 border-2 border-indigo-100 shadow">
            <div className="text-center text-xs font-black text-indigo-600 uppercase tracking-wide mb-2">{t.rumusTitle}</div>
            {mode === "biasa" ? (
              <div className="space-y-1.5 text-xs text-gray-700 font-mono">
                <div className="bg-red-50 rounded-lg px-3 py-1.5">{t.rumusBiasa}</div>
                <div className="bg-blue-50 rounded-lg px-3 py-1.5">{t.rumusBesarDiskon}</div>
              </div>
            ) : (
              <div className="space-y-1.5 text-xs text-gray-700 font-mono">
                <div className="bg-purple-50 rounded-lg px-3 py-1.5">{t.rumusBerganda}</div>
                <div className="bg-indigo-50 rounded-lg px-3 py-1.5">{t.rumusEfektif}</div>
                {dp1 > 0 && dp2 > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1.5 text-yellow-800 font-bold">
                    ⚠️ {t.infoEfektif(dp1, dp2, pct(diskonGabungan))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarungDiskon;
