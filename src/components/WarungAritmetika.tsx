import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

interface CalcState {
  hargaBeli: string;
  hargaJual: string;
}

const formatRupiah = (val: number) =>
  "Rp " + val.toLocaleString("id-ID");

const Coin = ({ x, y, delay }: { x: number; y: number; delay: number }) => (
  <motion.div
    className="absolute pointer-events-none select-none text-2xl"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0, y: 0 }}
    animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.3, 1, 0.8], y: [-10, -50, -80, -110] }}
    transition={{ duration: 1.2, delay, ease: "easeOut" }}
  >
    🪙
  </motion.div>
);

const Smoke = ({ x, y, delay }: { x: number; y: number; delay: number }) => (
  <motion.div
    className="absolute pointer-events-none select-none text-lg opacity-60"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 0.5, 0], scale: [0.5, 1.5, 2], y: [0, -30, -60] }}
    transition={{ duration: 1.8, delay, ease: "easeOut", repeat: Infinity, repeatDelay: 2 }}
  >
    ☁️
  </motion.div>
);

const PenjualSVG = () => (
  <svg width="80" height="110" viewBox="0 0 80 110" fill="none">
    {/* Body - baju merah */}
    <ellipse cx="40" cy="75" rx="20" ry="24" fill="#e53e3e" />
    {/* Tangan kiri */}
    <ellipse cx="18" cy="80" rx="7" ry="5" fill="#e53e3e" transform="rotate(-20 18 80)" />
    {/* Tangan kanan extended (menyerahkan barang) */}
    <ellipse cx="62" cy="73" rx="9" ry="5" fill="#e53e3e" transform="rotate(15 62 73)" />
    {/* Kepala */}
    <circle cx="40" cy="38" r="18" fill="#f6ad55" />
    {/* Mata */}
    <circle cx="34" cy="36" r="2.5" fill="#2d3748" />
    <circle cx="46" cy="36" r="2.5" fill="#2d3748" />
    <circle cx="35" cy="35" r="1" fill="white" />
    <circle cx="47" cy="35" r="1" fill="white" />
    {/* Senyum */}
    <path d="M33 44 Q40 50 47 44" stroke="#2d3748" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Rambut */}
    <ellipse cx="40" cy="22" rx="18" ry="8" fill="#2d3748" />
    {/* Peci / topi */}
    <rect x="25" y="16" width="30" height="8" rx="3" fill="#2b6cb0" />
    {/* Kaki */}
    <rect x="28" y="95" width="10" height="14" rx="4" fill="#2d3748" />
    <rect x="42" y="95" width="10" height="14" rx="4" fill="#2d3748" />
    {/* Barang di tangan */}
    <rect x="58" y="62" width="18" height="14" rx="3" fill="#48bb78" />
    <text x="59" y="73" fontSize="10" fill="white" fontWeight="bold">📦</text>
  </svg>
);

const PembeliSVG = ({ walking }: { walking: boolean }) => (
  <svg width="72" height="108" viewBox="0 0 72 108" fill="none">
    {/* Body - baju biru */}
    <ellipse cx="36" cy="74" rx="19" ry="22" fill="#4299e1" />
    {/* Tangan kiri memberi uang */}
    <ellipse cx="57" cy="76" rx="9" ry="5" fill="#4299e1" transform="rotate(-15 57 76)" />
    {/* Tangan kanan */}
    <ellipse cx="16" cy="80" rx="7" ry="5" fill="#4299e1" transform="rotate(20 16 80)" />
    {/* Kepala */}
    <circle cx="36" cy="37" r="17" fill="#fbd38d" />
    {/* Mata */}
    <circle cx="30" cy="35" r="2.5" fill="#2d3748" />
    <circle cx="42" cy="35" r="2.5" fill="#2d3748" />
    <circle cx="31" cy="34" r="1" fill="white" />
    <circle cx="43" cy="34" r="1" fill="white" />
    {/* Senyum */}
    <path d="M29 43 Q36 49 43 43" stroke="#2d3748" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Rambut */}
    <ellipse cx="36" cy="23" rx="17" ry="10" fill="#744210" />
    {/* Kaki animasi berjalan */}
    <motion.rect
      x="24" y="93" width="10" height="14" rx="4" fill="#2d3748"
      animate={walking ? { rotate: [0, 20, -20, 0], originX: "50%", originY: "0%" } : {}}
      transition={{ duration: 0.5, repeat: Infinity }}
    />
    <motion.rect
      x="38" y="93" width="10" height="14" rx="4" fill="#2d3748"
      animate={walking ? { rotate: [0, -20, 20, 0], originX: "50%", originY: "0%" } : {}}
      transition={{ duration: 0.5, repeat: Infinity }}
    />
    {/* Uang di tangan */}
    <rect x="52" y="68" width="18" height="10" rx="2" fill="#68d391" />
    <text x="53" y="77" fontSize="8" fill="#22543d" fontWeight="bold">Rp</text>
  </svg>
);

const WarungBuilding = () => (
  <svg width="320" height="220" viewBox="0 0 320 220" fill="none">
    {/* Dinding belakang */}
    <rect x="20" y="80" width="280" height="130" fill="#fef3c7" rx="4" />
    {/* Bata-bata dinding */}
    {[0,1,2,3,4,5].map(row =>
      [0,1,2,3].map(col => (
        <rect
          key={`${row}-${col}`}
          x={22 + col * 70 + (row % 2) * 35}
          y={82 + row * 22}
          width={66}
          height={18}
          rx="2"
          fill="none"
          stroke="#f6ad55"
          strokeWidth="1"
          opacity="0.4"
        />
      ))
    )}

    {/* Atap genteng - segitiga */}
    <polygon points="0,80 160,10 320,80" fill="#c53030" />
    {/* Garis genteng */}
    <line x1="0" y1="80" x2="320" y2="80" stroke="#9b2c2c" strokeWidth="3" />
    {/* Detail genteng */}
    {[0,1,2,3,4,5,6].map(i => (
      <line key={i} x1={i*53+5} y1={80} x2={160} y2={10} stroke="#9b2c2c" strokeWidth="1" opacity="0.4" />
    ))}

    {/* Papan nama warung */}
    <rect x="80" y="58" width="160" height="30" rx="6" fill="#2b6cb0" />
    <rect x="83" y="61" width="154" height="24" rx="4" fill="#2c5282" />
    <text x="160" y="78" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold" fontFamily="sans-serif">🏪 WARUNG MAJU JAYA</text>

    {/* Etalase / meja counter */}
    <rect x="60" y="155" width="200" height="10" rx="3" fill="#92400e" />
    <rect x="55" y="160" width="210" height="50" rx="4" fill="#b45309" />
    {/* Kaca etalase */}
    <rect x="60" y="163" width="200" height="44" rx="3" fill="rgba(186,230,253,0.35)" stroke="#7dd3fc" strokeWidth="1.5" />

    {/* Barang di etalase */}
    <text x="80" y="192" fontSize="18">🍎</text>
    <text x="110" y="192" fontSize="18">🍌</text>
    <text x="140" y="192" fontSize="18">🍬</text>
    <text x="170" y="192" fontSize="18">🥤</text>
    <text x="200" y="192" fontSize="18">🍫</text>
    <text x="230" y="192" fontSize="18">🧃</text>

    {/* Rak di belakang */}
    <rect x="25" y="90" width="270" height="5" rx="2" fill="#92400e" />
    <rect x="25" y="110" width="270" height="4" rx="2" fill="#92400e" />
    <rect x="25" y="128" width="270" height="4" rx="2" fill="#92400e" />
    {/* Barang di rak */}
    <text x="30" y="108" fontSize="14">🥫</text>
    <text x="55" y="108" fontSize="14">🧴</text>
    <text x="80" y="108" fontSize="14">🥫</text>
    <text x="105" y="108" fontSize="14">📦</text>
    <text x="130" y="108" fontSize="14">🧂</text>
    <text x="155" y="108" fontSize="14">🫙</text>
    <text x="180" y="108" fontSize="14">🥫</text>
    <text x="205" y="108" fontSize="14">🧴</text>
    <text x="230" y="108" fontSize="14">🥫</text>
    <text x="255" y="108" fontSize="14">📦</text>

    <text x="30" y="126" fontSize="13">🧃</text>
    <text x="55" y="126" fontSize="13">🍫</text>
    <text x="80" y="126" fontSize="13">🍬</text>
    <text x="105" y="126" fontSize="13">🥤</text>
    <text x="130" y="126" fontSize="13">🧁</text>
    <text x="155" y="126" fontSize="13">🍪</text>
    <text x="180" y="126" fontSize="13">🍭</text>
    <text x="205" y="126" fontSize="13">🧃</text>

    {/* Pintu */}
    <rect x="130" y="142" width="60" height="13" rx="3" fill="#92400e" />

    {/* Lampu warung */}
    <circle cx="160" cy="50" r="5" fill="#fde68a" />
    <line x1="160" y1="10" x2="160" y2="45" stroke="#d1d5db" strokeWidth="1.5" />
  </svg>
);

const ResultBox = ({
  label,
  value,
  color,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  color: string;
  icon: string;
  highlight: boolean;
}) => (
  <motion.div
    className={`rounded-xl border-2 p-3 flex flex-col items-center gap-1 ${color} ${
      highlight ? "shadow-lg scale-105" : ""
    }`}
    animate={highlight ? { scale: [1, 1.07, 1], boxShadow: ["0 0 0px transparent", "0 0 18px rgba(72,187,120,0.7)", "0 0 0px transparent"] } : {}}
    transition={{ duration: 0.7 }}
  >
    <span className="text-2xl">{icon}</span>
    <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{label}</span>
    <motion.span
      className="text-sm font-black"
      key={value}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {value}
    </motion.span>
  </motion.div>
);

const PRESET_ITEMS = [
  { nama: "Apel 🍎", hargaBeli: 8000, hargaJual: 10000 },
  { nama: "Buku 📚", hargaBeli: 15000, hargaJual: 12000 },
  { nama: "Minuman 🥤", hargaBeli: 5000, hargaJual: 7500 },
  { nama: "Snack 🍫", hargaBeli: 12000, hargaJual: 12000 },
];

const WarungAritmetika = () => {
  const [hargaBeli, setHargaBeli] = useState("10000");
  const [hargaJual, setHargaJual] = useState("13000");
  const [isTransacting, setIsTransacting] = useState(false);
  const [showCoins, setShowCoins] = useState(false);
  const [buyerPos, setBuyerPos] = useState(320);
  const [transactionDone, setTransactionDone] = useState(false);
  const [activePreset, setActivePreset] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const hb = parseFloat(hargaBeli.replace(/\D/g, "")) || 0;
  const hj = parseFloat(hargaJual.replace(/\D/g, "")) || 0;
  const selisih = hj - hb;
  const isUntung = selisih > 0;
  const isRugi = selisih < 0;
  const isPas = selisih === 0;

  const pctUntung = hb > 0 && isUntung ? ((selisih / hb) * 100).toFixed(1) + "%" : "-";
  const pctRugi = hb > 0 && isRugi ? ((Math.abs(selisih) / hb) * 100).toFixed(1) + "%" : "-";

  const handleTransaksi = async () => {
    if (isTransacting || hb === 0 || hj === 0) return;
    setIsTransacting(true);
    setShowResult(false);
    setTransactionDone(false);

    // Buyer walks in
    setBuyerPos(320);
    await new Promise(r => setTimeout(r, 100));
    setBuyerPos(10);
    await new Promise(r => setTimeout(r, 900));
    setShowCoins(true);
    await new Promise(r => setTimeout(r, 1200));
    setShowCoins(false);
    setTransactionDone(true);
    setShowResult(true);

    // Buyer walks out
    await new Promise(r => setTimeout(r, 1000));
    setBuyerPos(320);
    await new Promise(r => setTimeout(r, 800));
    setIsTransacting(false);
  };

  const applyPreset = (idx: number) => {
    const p = PRESET_ITEMS[idx];
    setHargaBeli(p.hargaBeli.toString());
    setHargaJual(p.hargaJual.toString());
    setActivePreset(idx);
    setShowResult(false);
    setTransactionDone(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl"
      style={{ background: "linear-gradient(135deg, #fef9c3 0%, #d1fae5 50%, #dbeafe 100%)" }}>

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-400 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-white font-black text-xl drop-shadow">📊 Aritmetika Sosial</div>
          <div className="text-yellow-100 text-sm font-semibold">Jual · Beli · Untung · Rugi — Kelas 7</div>
        </div>
        <div className="bg-white/20 rounded-full px-4 py-1 text-white text-sm font-bold">🏪 Warung Interaktif</div>
      </div>

      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT: Warung Scene */}
        <div className="flex flex-col gap-3">

          {/* Preset items */}
          <div className="flex gap-2 flex-wrap">
            {PRESET_ITEMS.map((item, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.92 }}
                onClick={() => applyPreset(i)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                  activePreset === i
                    ? "bg-amber-400 border-amber-500 text-white shadow-md"
                    : "bg-white border-gray-200 text-gray-600 hover:border-amber-300"
                }`}
              >
                {item.nama}
              </motion.button>
            ))}
          </div>

          {/* Warung scene */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-sky-300 via-sky-200 to-green-200"
            style={{ minHeight: 260 }}>

            {/* Awan */}
            <motion.div className="absolute top-3 left-4 text-4xl opacity-70"
              animate={{ x: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>☁️</motion.div>
            <motion.div className="absolute top-5 right-8 text-3xl opacity-60"
              animate={{ x: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>☁️</motion.div>

            {/* Matahari */}
            <motion.div className="absolute top-2 right-4 text-3xl"
              animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>☀️</motion.div>

            {/* Tanah */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-500 to-green-400 rounded-b-2xl" />
            <div className="absolute bottom-14 left-0 right-0 h-4 bg-gray-400 opacity-60" style={{ borderRadius: "0 0 0 0" }} />

            {/* Warung building centered */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
              <WarungBuilding />
            </div>

            {/* Asap rokok/dapur */}
            <Smoke x={160} y={20} delay={0} />
            <Smoke x={175} y={15} delay={0.8} />

            {/* Penjual - behind counter */}
            <div className="absolute bottom-14" style={{ left: "calc(50% - 10px)" }}>
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <PenjualSVG />
              </motion.div>
            </div>

            {/* Pembeli - bergerak */}
            <motion.div
              className="absolute bottom-14"
              animate={{ x: buyerPos - 280 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ right: 10 }}
            >
              <PembeliSVG walking={isTransacting && buyerPos < 200} />
            </motion.div>

            {/* Coin animations */}
            <AnimatePresence>
              {showCoins && (
                <>
                  <Coin x={160} y={140} delay={0} />
                  <Coin x={180} y={148} delay={0.15} />
                  <Coin x={145} y={152} delay={0.3} />
                  <Coin x={165} y={145} delay={0.45} />
                  <Coin x={175} y={140} delay={0.6} />
                </>
              )}
            </AnimatePresence>

            {/* Transaksi label */}
            <AnimatePresence>
              {transactionDone && (
                <motion.div
                  className={`absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full font-black text-white text-sm shadow-lg ${
                    isUntung ? "bg-green-500" : isRugi ? "bg-red-500" : "bg-yellow-500"
                  }`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  {isUntung ? "✅ Transaksi Untung!" : isRugi ? "❌ Transaksi Rugi!" : "⚖️ Modal = Harga Jual!"}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tombol transaksi */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleTransaksi}
            disabled={isTransacting || hb === 0 || hj === 0}
            className={`w-full py-3 rounded-2xl font-black text-white text-lg shadow-lg transition-all ${
              isTransacting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 hover:shadow-green-300/50 hover:shadow-xl"
            }`}
          >
            {isTransacting ? "⏳ Sedang Bertransaksi..." : "🛒 MULAI TRANSAKSI!"}
          </motion.button>
        </div>

        {/* RIGHT: Calculator + Results */}
        <div className="flex flex-col gap-4">

          {/* Input boxes */}
          <div className="bg-white/80 rounded-2xl p-4 shadow-md space-y-3 border border-amber-100">
            <div className="text-center font-black text-gray-700 text-sm uppercase tracking-wide mb-1">
              🧮 Masukkan Harga
            </div>

            <div>
              <label className="text-xs font-bold text-blue-700 uppercase tracking-wide block mb-1">
                💰 Harga Beli (Modal)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">Rp</span>
                <input
                  type="number"
                  value={hargaBeli}
                  onChange={e => { setHargaBeli(e.target.value); setShowResult(false); }}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-blue-200 focus:border-blue-500 outline-none font-bold text-gray-800 bg-blue-50 text-sm"
                  placeholder="Contoh: 10000"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-orange-700 uppercase tracking-wide block mb-1">
                🏷️ Harga Jual
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">Rp</span>
                <input
                  type="number"
                  value={hargaJual}
                  onChange={e => { setHargaJual(e.target.value); setShowResult(false); }}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-orange-200 focus:border-orange-500 outline-none font-bold text-gray-800 bg-orange-50 text-sm"
                  placeholder="Contoh: 13000"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Result boxes */}
          <div className="grid grid-cols-2 gap-2">
            <ResultBox
              label="Harga Beli"
              value={hb > 0 ? formatRupiah(hb) : "-"}
              color="bg-blue-100 border-blue-300 text-blue-800"
              icon="💰"
              highlight={false}
            />
            <ResultBox
              label="Harga Jual"
              value={hj > 0 ? formatRupiah(hj) : "-"}
              color="bg-orange-100 border-orange-300 text-orange-800"
              icon="🏷️"
              highlight={false}
            />
            <ResultBox
              label={isRugi ? "Rugi" : "Untung"}
              value={
                hb > 0 && hj > 0
                  ? isUntung
                    ? formatRupiah(selisih)
                    : isRugi
                    ? formatRupiah(Math.abs(selisih))
                    : "Impas"
                  : "-"
              }
              color={
                isUntung
                  ? "bg-green-100 border-green-400 text-green-800"
                  : isRugi
                  ? "bg-red-100 border-red-400 text-red-800"
                  : "bg-yellow-100 border-yellow-400 text-yellow-800"
              }
              icon={isUntung ? "📈" : isRugi ? "📉" : "⚖️"}
              highlight={showResult}
            />
            <ResultBox
              label={isRugi ? "% Rugi" : "% Untung"}
              value={isUntung ? pctUntung : isRugi ? pctRugi : hb > 0 ? "0%" : "-"}
              color={
                isUntung
                  ? "bg-green-100 border-green-400 text-green-800"
                  : isRugi
                  ? "bg-red-100 border-red-400 text-red-800"
                  : "bg-yellow-100 border-yellow-400 text-yellow-800"
              }
              icon={isUntung ? "✅" : isRugi ? "❌" : "➡️"}
              highlight={showResult}
            />
          </div>

          {/* Rumus box */}
          <motion.div
            className="bg-white/90 rounded-2xl p-4 border-2 border-indigo-200 shadow"
            animate={showResult ? { borderColor: ["#c7d2fe", "#818cf8", "#c7d2fe"] } : {}}
            transition={{ duration: 1.2, repeat: showResult ? 2 : 0 }}
          >
            <div className="text-center text-xs font-black text-indigo-700 uppercase tracking-wide mb-2">📐 Rumus</div>
            <div className="space-y-1.5 text-xs text-gray-700 font-mono">
              <div className="flex justify-between bg-blue-50 rounded-lg px-3 py-1.5">
                <span className="text-blue-700 font-bold">Untung</span>
                <span>= Harga Jual − Harga Beli</span>
              </div>
              <div className="flex justify-between bg-red-50 rounded-lg px-3 py-1.5">
                <span className="text-red-700 font-bold">Rugi</span>
                <span>= Harga Beli − Harga Jual</span>
              </div>
              <div className="flex justify-between bg-green-50 rounded-lg px-3 py-1.5">
                <span className="text-green-700 font-bold">% Untung</span>
                <span>= Untung ÷ HB × 100%</span>
              </div>
              <div className="flex justify-between bg-orange-50 rounded-lg px-3 py-1.5">
                <span className="text-orange-700 font-bold">% Rugi</span>
                <span>= Rugi ÷ HB × 100%</span>
              </div>
            </div>

            {/* Dynamic formula result */}
            {showResult && hb > 0 && hj > 0 && (
              <motion.div
                className={`mt-3 rounded-xl px-3 py-2 text-center font-black text-sm ${
                  isUntung ? "bg-green-100 text-green-800" : isRugi ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                }`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {isUntung
                  ? `Rp ${hj.toLocaleString()} − Rp ${hb.toLocaleString()} = Untung Rp ${selisih.toLocaleString()} (${pctUntung})`
                  : isRugi
                  ? `Rp ${hb.toLocaleString()} − Rp ${hj.toLocaleString()} = Rugi Rp ${Math.abs(selisih).toLocaleString()} (${pctRugi})`
                  : `Harga Jual = Harga Beli → Impas (tidak untung/rugi)`}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WarungAritmetika;
