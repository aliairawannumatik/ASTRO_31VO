import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playPopSound } from "@/hooks/useAudio";

const fmt = (n: number) =>
  "Rp " + Math.round(n).toLocaleString("id-ID");

/* ── Floating coin ─────────────────────────────────────────── */
const Coin = ({ x, y, delay, emoji }: { x: number; y: number; delay: number; emoji: string }) => (
  <motion.div
    className="absolute pointer-events-none select-none text-2xl z-20"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0, y: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      scale: [0, 1.3, 1.1, 0.8],
      y: [0, -30, -70, -110],
      x: [0, (Math.random() - 0.5) * 40],
      rotate: [0, 20, -15, 10],
    }}
    transition={{ duration: 1.8, delay, ease: "easeOut" }}
  >
    {emoji}
  </motion.div>
);

/* ── FloatLabel ─────────────────────────────────────────────── */
const FloatLabel = ({ text, x, y, delay, color }: { text: string; x: number; y: number; delay: number; color: string }) => (
  <motion.div
    className={`absolute pointer-events-none select-none font-black text-white text-xs px-2 py-1 rounded-full shadow-xl z-20 ${color}`}
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0, rotate: -15 }}
    animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0], y: [0, -25, -55, -80], rotate: [-15, 5, -5, 0] }}
    transition={{ duration: 1.6, delay, ease: "easeOut" }}
  >
    {text}
  </motion.div>
);

/* ── Bank Building SVG ─────────────────────────────────────── */
const BankBuildingSVG = () => (
  <svg width="200" height="170" viewBox="0 0 200 170" fill="none">
    {/* Foundation */}
    <rect x="10" y="145" width="180" height="20" rx="3" fill="#1a2744" />
    {/* Main body */}
    <rect x="20" y="80" width="160" height="70" fill="#1e3a5f" />
    <rect x="20" y="80" width="160" height="70" fill="url(#bankWall)" />
    {/* Columns */}
    {[38, 70, 102, 134, 162].map((x, i) => (
      <rect key={i} x={x} y="82" width="10" height="65" rx="3" fill="#2563a8" opacity="0.7" />
    ))}
    {/* Roof pediment */}
    <polygon points="10,80 100,30 190,80" fill="#1a2f5c" />
    <polygon points="18,80 100,38 182,80" fill="#1e3a6e" />
    {/* Roof trim */}
    <line x1="10" y1="80" x2="190" y2="80" stroke="#3b82f6" strokeWidth="2.5" />
    {/* Bank sign */}
    <rect x="60" y="50" width="80" height="22" rx="4" fill="#0f172a" opacity="0.8" />
    <text x="100" y="65" textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold" fontFamily="monospace">🏦 BANK NUMATIK</text>
    {/* Windows */}
    {[30, 90, 148].map((x, i) => (
      <g key={i}>
        <rect x={x} y="90" width="26" height="22" rx="3" fill="#0ea5e9" opacity="0.3" />
        <rect x={x} y="90" width="26" height="22" rx="3" stroke="#38bdf8" strokeWidth="1" fill="none" />
        <line x1={x + 13} y1="90" x2={x + 13} y2="112" stroke="#38bdf8" strokeWidth="0.8" opacity="0.6" />
        <line x1={x} y1="101" x2={x + 26} y2="101" stroke="#38bdf8" strokeWidth="0.8" opacity="0.6" />
      </g>
    ))}
    {/* Door */}
    <rect x="83" y="115" width="34" height="30" rx="4" fill="#0369a1" />
    <rect x="83" y="115" width="34" height="30" rx="4" stroke="#38bdf8" strokeWidth="1.5" fill="none" />
    <circle cx="113" cy="130" r="2" fill="#fbbf24" />
    {/* Steps */}
    <rect x="70" y="143" width="60" height="5" rx="1" fill="#253b6e" />
    <rect x="60" y="148" width="80" height="5" rx="1" fill="#1e3060" />
    {/* Flag */}
    <line x1="100" y1="10" x2="100" y2="36" stroke="#64748b" strokeWidth="1.5" />
    <polygon points="100,12 118,20 100,28" fill="#22c55e" />
    <defs>
      <linearGradient id="bankWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2563a8" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

/* ── Teller SVG ────────────────────────────────────────────── */
const TellerSVG = ({ waving, happy }: { waving: boolean; happy: boolean }) => (
  <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
    {/* Window frame */}
    <rect x="2" y="60" width="76" height="58" rx="5" fill="#0c1a3a" />
    <rect x="5" y="63" width="70" height="52" rx="4" fill="#0e2040" />
    {/* Counter */}
    <rect x="0" y="100" width="80" height="18" rx="3" fill="#1e3a6e" />
    <rect x="0" y="100" width="80" height="5" rx="2" fill="#2563a8" />
    {/* Teller body – kemeja biru */}
    <rect x="24" y="80" width="32" height="24" rx="4" fill="#1d4ed8" />
    {/* Teller name tag */}
    <rect x="30" y="86" width="20" height="10" rx="2" fill="#bfdbfe" />
    <text x="40" y="93.5" textAnchor="middle" fontSize="5" fill="#1e3a6e" fontWeight="bold">TELLER</text>
    {/* Head */}
    <circle cx="40" cy="68" r="14" fill="#fcd5a8" />
    {/* Hair */}
    <ellipse cx="40" cy="56" rx="13" ry="7" fill="#92400e" />
    {/* Eyes */}
    <circle cx="35" cy="67" r="2.2" fill="#1e293b" />
    <circle cx="45" cy="67" r="2.2" fill="#1e293b" />
    <circle cx="35.8" cy="66.2" r="0.8" fill="white" />
    <circle cx="45.8" cy="66.2" r="0.8" fill="white" />
    {/* Smile */}
    {happy ? (
      <path d="M 34 73 Q 40 79 46 73" stroke="#c2410c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    ) : (
      <path d="M 35 73 Q 40 75 45 73" stroke="#c2410c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    )}
    {/* Waving arm */}
    <motion.g
      animate={waving ? { rotate: [0, -30, 30, -20, 10, 0] } : { rotate: [0, -8, 0] }}
      transition={{ duration: waving ? 0.8 : 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ originX: "58px", originY: "85px" }}
    >
      <ellipse cx="60" cy="88" rx="9" ry="5" fill="#1d4ed8" transform="rotate(20 60 88)" />
      <circle cx="65" cy="84" r="5" fill="#fcd5a8" />
    </motion.g>
    {/* Other arm – resting */}
    <ellipse cx="22" cy="88" rx="9" ry="5" fill="#1d4ed8" transform="rotate(-20 22 88)" />
    <circle cx="17" cy="84" r="5" fill="#fcd5a8" />
    {/* Window bars */}
    <line x1="40" y1="63" x2="40" y2="98" stroke="#334155" strokeWidth="1.5" opacity="0.6" />
    <line x1="5" y1="80" x2="75" y2="80" stroke="#334155" strokeWidth="1.5" opacity="0.6" />
    {/* Computer on counter */}
    <rect x="10" y="92" width="20" height="13" rx="2" fill="#0f172a" />
    <rect x="11" y="93" width="18" height="10" rx="1" fill="#0ea5e9" opacity="0.4" />
    <rect x="17" y="105" width="6" height="3" rx="1" fill="#1e293b" />
  </svg>
);

/* ── Customer SVG ─────────────────────────────────────────── */
const CustomerSVG = ({ walking, depositing }: { walking: boolean; depositing: boolean }) => (
  <svg width="70" height="120" viewBox="0 0 70 120" fill="none">
    {/* Body */}
    <ellipse cx="35" cy="82" rx="16" ry="22" fill="#16a34a" />
    {/* Bag / envelope */}
    {depositing && (
      <motion.g
        animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        <rect x="44" y="58" width="22" height="16" rx="3" fill="#fbbf24" />
        <line x1="44" y1="58" x2="55" y2="66" stroke="#f59e0b" strokeWidth="1.2" />
        <line x1="66" y1="58" x2="55" y2="66" stroke="#f59e0b" strokeWidth="1.2" />
        <text x="55" y="71" textAnchor="middle" fontSize="6" fill="#92400e" fontWeight="bold">Rp</text>
      </motion.g>
    )}
    {/* Arms */}
    <motion.g
      animate={walking ? { rotate: [15, -15, 15] } : { rotate: [0, -5, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
      style={{ originX: "20px", originY: "75px" }}
    >
      <ellipse cx="18" cy="80" rx="7" ry="5" fill="#16a34a" transform="rotate(-20 18 80)" />
      <circle cx="13" cy="77" r="5" fill="#fcd5a8" />
    </motion.g>
    <motion.g
      animate={walking ? { rotate: [-15, 15, -15] } : { rotate: [0, 5, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
      style={{ originX: "52px", originY: "75px" }}
    >
      <ellipse cx="52" cy="80" rx="7" ry="5" fill="#16a34a" transform="rotate(20 52 80)" />
      <circle cx="57" cy="77" r="5" fill="#fcd5a8" />
    </motion.g>
    {/* Legs */}
    <motion.g
      animate={walking ? { rotate: [20, -20, 20] } : {}}
      transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
      style={{ originX: "30px", originY: "100px" }}
    >
      <rect x="26" y="100" width="10" height="18" rx="4" fill="#1e40af" />
    </motion.g>
    <motion.g
      animate={walking ? { rotate: [-20, 20, -20] } : {}}
      transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
      style={{ originX: "42px", originY: "100px" }}
    >
      <rect x="38" y="100" width="10" height="18" rx="4" fill="#1e40af" />
    </motion.g>
    {/* Shoes */}
    <ellipse cx="31" cy="118" rx="8" ry="4" fill="#1e293b" />
    <ellipse cx="43" cy="118" rx="8" ry="4" fill="#1e293b" />
    {/* Head */}
    <circle cx="35" cy="52" r="16" fill="#fcd5a8" />
    {/* Hair */}
    <ellipse cx="35" cy="39" rx="15" ry="8" fill="#1e293b" />
    {/* Eyes */}
    <circle cx="30" cy="51" r="2.5" fill="#1e293b" />
    <circle cx="40" cy="51" r="2.5" fill="#1e293b" />
    <circle cx="30.8" cy="50.2" r="0.9" fill="white" />
    <circle cx="40.8" cy="50.2" r="0.9" fill="white" />
    {/* Smile */}
    <path d="M 29 57 Q 35 63 41 57" stroke="#c2410c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </svg>
);

/* ── Money Stack Visual ─────────────────────────────────────── */
const MoneyStack = ({ amount, maxAmount, label, color }: {
  amount: number; maxAmount: number; label: string; color: string;
}) => {
  const pct = maxAmount > 0 ? Math.min((amount / maxAmount) * 100, 100) : 0;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-16 h-24 relative flex flex-col justify-end rounded-lg overflow-hidden border border-white/20" style={{ background: "rgba(0,0,0,0.4)" }}>
        <motion.div
          className="w-full rounded-b-lg"
          style={{ background: color }}
          initial={{ height: 0 }}
          animate={{ height: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">💰</span>
        </div>
      </div>
      <p className="text-[10px] text-white/60 font-body text-center leading-tight">{label}</p>
      <p className="text-xs font-bold text-white font-body text-center">{fmt(amount)}</p>
    </div>
  );
};

/* ── Main Component ─────────────────────────────────────────── */
export default function BankSimulasi() {
  const [tabAwal, setTabAwal] = useState("");
  const [waktu, setWaktu] = useState("");
  const [persenBunga, setPersenBunga] = useState("");
  const [satuanWaktu, setSatuanWaktu] = useState<"tahun" | "bulan">("tahun");
  const [phase, setPhase] = useState<"idle" | "walking" | "depositing" | "counting" | "done">("idle");
  const [result, setResult] = useState<{ bunga: number; tabAkhir: number; waktuTahun: number } | null>(null);
  const [coins, setCoins] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([]);
  const [labels, setLabels] = useState<Array<{ id: number; text: string; x: number; y: number; color: string }>>([]);

  const tabAwalNum = parseFloat(tabAwal.replace(/[^0-9.]/g, "")) || 0;
  const waktuNum = parseFloat(waktu) || 0;
  const persenNum = parseFloat(persenBunga) || 0;

  const canCompute = tabAwalNum > 0 && waktuNum > 0 && persenNum > 0;

  const spawnCoins = () => {
    const emojis = ["💰", "🪙", "💵", "💴", "💶"];
    const newCoins = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: 100 + Math.random() * 100,
      y: 80 + Math.random() * 40,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setCoins(newCoins);
    setTimeout(() => setCoins([]), 2500);
  };

  const spawnLabels = (bunga: number, tabAkhir: number) => {
    const newLabels = [
      { id: 1, text: `+${fmt(bunga)}`, x: 60, y: 40, color: "bg-green-500" },
      { id: 2, text: `Total: ${fmt(tabAkhir)}`, x: 130, y: 20, color: "bg-blue-500" },
    ];
    setLabels(newLabels);
    setTimeout(() => setLabels([]), 3000);
  };

  const handleSimulasi = () => {
    if (!canCompute) return;
    playPopSound();

    const wTahun = satuanWaktu === "bulan" ? waktuNum / 12 : waktuNum;
    const bunga = tabAwalNum * wTahun * (persenNum / 100);
    const tabAkhir = tabAwalNum + bunga;

    setPhase("walking");
    setTimeout(() => {
      setPhase("depositing");
      spawnCoins();
    }, 1200);
    setTimeout(() => {
      setPhase("counting");
    }, 2500);
    setTimeout(() => {
      setResult({ bunga, tabAkhir, waktuTahun: wTahun });
      spawnLabels(bunga, tabAkhir);
      setPhase("done");
    }, 3500);
  };

  const handleReset = () => {
    playPopSound();
    setPhase("idle");
    setResult(null);
    setCoins([]);
    setLabels([]);
  };

  const maxForBar = result ? result.tabAkhir * 1.1 : tabAwalNum * 1.5 || 1000000;

  return (
    <div
      className="rounded-2xl overflow-hidden border-2"
      style={{
        background: "linear-gradient(135deg, #0a0f2e 0%, #0c1a45 50%, #071024 100%)",
        borderColor: "rgba(59,130,246,0.5)",
        boxShadow: "0 0 40px rgba(59,130,246,0.15)",
      }}
    >
      {/* Header */}
      <div className="px-5 py-3 flex items-center gap-3" style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.2), rgba(99,102,241,0.1))" }}>
        <span className="text-2xl">🏦</span>
        <div>
          <p className="font-body font-bold text-blue-200 text-sm">Simulasi Menabung di Bank</p>
          <p className="font-body text-[10px] text-blue-400/60">Masukkan data → tekan Simulasi → lihat animasinya!</p>
        </div>
        <span className="ml-auto bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">ANIMASI</span>
      </div>

      {/* Scene */}
      <div className="relative mx-4 mt-4 rounded-xl overflow-hidden" style={{ height: 190, background: "linear-gradient(180deg, #050d20 0%, #0a1929 60%, #111c2e 100%)" }}>
        {/* Sky dots */}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white" style={{ width: 1.5, height: 1.5, top: `${Math.random() * 60}%`, left: `${Math.random() * 100}%`, opacity: Math.random() * 0.7 + 0.2 }} />
        ))}
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-10 rounded-b-xl" style={{ background: "linear-gradient(180deg, #1a3a1a 0%, #0f2410 100%)" }} />
        {/* Road markings */}
        {[15, 35, 55, 75].map((x, i) => (
          <div key={i} className="absolute bottom-3" style={{ left: `${x}%`, width: 20, height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 2 }} />
        ))}

        {/* Bank building – right side */}
        <div className="absolute right-4 bottom-8" style={{ filter: "drop-shadow(0 0 12px rgba(37,99,200,0.5))" }}>
          <BankBuildingSVG />
        </div>

        {/* Teller at window */}
        <div className="absolute bottom-8" style={{ right: 50 }}>
          <TellerSVG waving={phase === "idle" || phase === "done"} happy={phase === "done" || phase === "depositing"} />
        </div>

        {/* Customer */}
        <motion.div
          className="absolute bottom-8"
          initial={{ left: -60 }}
          animate={{
            left: phase === "idle" ? -60
              : phase === "walking" ? "22%"
              : phase === "depositing" || phase === "counting" ? "30%"
              : "30%",
          }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        >
          <CustomerSVG walking={phase === "walking"} depositing={phase === "depositing"} />
        </motion.div>

        {/* Speech bubble for idle */}
        <AnimatePresence>
          {phase === "idle" && (
            <motion.div
              className="absolute font-body text-[10px] text-white bg-blue-900/80 border border-blue-500/50 rounded-xl px-3 py-1.5 shadow-lg"
              style={{ top: 16, left: 16 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              💭 "Ayo nabung supaya dapat bunga!"
              <div className="absolute bottom-0 left-6 translate-y-full w-0 h-0" style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "8px solid rgba(30,58,166,0.9)" }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Counting animation overlay */}
        <AnimatePresence>
          {phase === "counting" && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-slate-900/90 border border-yellow-500/50 rounded-xl px-6 py-3 text-center"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <p className="text-yellow-300 font-body text-sm font-bold">🧮 Menghitung bunga...</p>
                <div className="flex gap-1 justify-center mt-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="w-2 h-2 rounded-full bg-yellow-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.8, delay: i * 0.25, repeat: Infinity }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Done speech bubble from teller */}
        <AnimatePresence>
          {phase === "done" && result && (
            <motion.div
              className="absolute font-body text-[10px] text-white bg-green-900/90 border border-green-500/50 rounded-xl px-3 py-2 shadow-lg"
              style={{ top: 12, right: 16 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="font-bold text-green-300">✅ Tabungan berhasil!</p>
              <p>Bunga: <span className="text-yellow-300 font-bold">{fmt(result.bunga)}</span></p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating coins */}
        {coins.map((c) => (
          <Coin key={c.id} x={c.x} y={c.y} delay={Math.random() * 0.6} emoji={c.emoji} />
        ))}
        {labels.map((l) => (
          <FloatLabel key={l.id} text={l.text} x={l.x} y={l.y} delay={0.3} color={l.color} />
        ))}
      </div>

      {/* Input section */}
      <div className="px-4 pt-4 pb-2">
        <p className="font-body text-xs text-blue-300/70 mb-3 text-center">📝 Isi data tabunganmu di bawah ini</p>
        <div className="grid grid-cols-2 gap-3">
          {/* Tabungan Awal */}
          <div className="col-span-2 space-y-1">
            <label className="font-body text-xs text-yellow-300 font-semibold flex items-center gap-1">
              💰 Tabungan Awal (Rp)
            </label>
            <input
              type="number"
              value={tabAwal}
              onChange={(e) => { setTabAwal(e.target.value); handleReset(); }}
              placeholder="contoh: 5000000"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white font-body focus:outline-none transition-all"
              style={{ background: "rgba(251,191,36,0.08)", border: "1.5px solid rgba(251,191,36,0.3)" }}
            />
          </div>

          {/* Waktu */}
          <div className="space-y-1">
            <label className="font-body text-xs text-blue-300 font-semibold flex items-center gap-1">
              ⏱ Waktu
            </label>
            <input
              type="number"
              value={waktu}
              onChange={(e) => { setWaktu(e.target.value); handleReset(); }}
              placeholder="contoh: 2"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white font-body focus:outline-none"
              style={{ background: "rgba(59,130,246,0.08)", border: "1.5px solid rgba(59,130,246,0.3)" }}
            />
          </div>

          {/* Satuan waktu toggle */}
          <div className="space-y-1">
            <label className="font-body text-xs text-blue-300 font-semibold">📅 Satuan</label>
            <div className="flex gap-2 h-[42px]">
              {(["tahun", "bulan"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => { setSatuanWaktu(s); handleReset(); playPopSound(); }}
                  className="flex-1 rounded-lg text-xs font-body font-bold transition-all"
                  style={satuanWaktu === s
                    ? { background: "rgba(59,130,246,0.35)", border: "1.5px solid rgba(99,102,241,0.8)", color: "#93c5fd" }
                    : { background: "rgba(59,130,246,0.06)", border: "1.5px solid rgba(59,130,246,0.2)", color: "rgba(147,197,253,0.4)" }}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Persen bunga */}
          <div className="col-span-2 space-y-1">
            <label className="font-body text-xs text-green-300 font-semibold flex items-center gap-1">
              📈 Suku Bunga (% per {satuanWaktu})
            </label>
            <input
              type="number"
              value={persenBunga}
              onChange={(e) => { setPersenBunga(e.target.value); handleReset(); }}
              placeholder={`contoh: 6  (artinya 6% per ${satuanWaktu})`}
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white font-body focus:outline-none"
              style={{ background: "rgba(34,197,94,0.08)", border: "1.5px solid rgba(34,197,94,0.3)" }}
            />
          </div>
        </div>

        {/* Result boxes – always visible once data ready */}
        <AnimatePresence>
          {(canCompute && phase === "idle") || phase === "done" ? (
            <motion.div
              className="mt-3 grid grid-cols-3 gap-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Bunga per satuan */}
              <div className="rounded-lg p-2.5 text-center" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
                <p className="font-body text-[9px] text-green-400/70 mb-0.5">Bunga ({satuanWaktu})</p>
                <p className="font-body text-[11px] font-bold text-green-300">
                  {persenNum > 0 ? `${persenNum}%` : "—"}
                </p>
              </div>
              {/* Besar bunga */}
              <div className="rounded-lg p-2.5 text-center" style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)" }}>
                <p className="font-body text-[9px] text-yellow-400/70 mb-0.5">Total Bunga</p>
                <p className="font-body text-[10px] font-bold text-yellow-300 leading-tight">
                  {result
                    ? fmt(result.bunga)
                    : canCompute
                    ? fmt(tabAwalNum * (satuanWaktu === "bulan" ? waktuNum / 12 : waktuNum) * (persenNum / 100))
                    : "—"}
                </p>
              </div>
              {/* Tabungan akhir */}
              <div className="rounded-lg p-2.5 text-center" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)" }}>
                <p className="font-body text-[9px] text-indigo-400/70 mb-0.5">Tabungan Akhir</p>
                <p className="font-body text-[10px] font-bold text-indigo-200 leading-tight">
                  {result
                    ? fmt(result.tabAkhir)
                    : canCompute
                    ? fmt(tabAwalNum + tabAwalNum * (satuanWaktu === "bulan" ? waktuNum / 12 : waktuNum) * (persenNum / 100))
                    : "—"}
                </p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Money bar visualization */}
        <AnimatePresence>
          {(canCompute || result) && (
            <motion.div
              className="mt-3 flex gap-4 justify-center items-end px-4 py-3 rounded-xl"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MoneyStack
                amount={tabAwalNum}
                maxAmount={maxForBar}
                label="Tabungan Awal"
                color="linear-gradient(to top, #0369a1, #38bdf8)"
              />
              <div className="flex flex-col items-center self-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-green-400 font-bold text-lg"
                >
                  +
                </motion.div>
                <div className="text-[9px] text-white/40 font-body">bunga</div>
              </div>
              <MoneyStack
                amount={result ? result.bunga : tabAwalNum * (satuanWaktu === "bulan" ? waktuNum / 12 : waktuNum) * (persenNum / 100)}
                maxAmount={maxForBar}
                label="Bunga"
                color="linear-gradient(to top, #92400e, #fbbf24)"
              />
              <div className="flex flex-col items-center self-center mb-6">
                <div className="text-blue-400 font-bold text-lg">=</div>
              </div>
              <MoneyStack
                amount={result ? result.tabAkhir : tabAwalNum + tabAwalNum * (satuanWaktu === "bulan" ? waktuNum / 12 : waktuNum) * (persenNum / 100)}
                maxAmount={maxForBar}
                label="Tabungan Akhir"
                color="linear-gradient(to top, #4f46e5, #818cf8)"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Formula display */}
        <AnimatePresence>
          {canCompute && (
            <motion.div
              className="mt-3 rounded-lg px-4 py-2.5 font-body text-xs text-white/70"
              style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-indigo-300 font-semibold text-[10px] mb-1">📐 Penghitungan:</p>
              <p>B = {fmt(tabAwalNum)} × {satuanWaktu === "bulan" ? `(${waktuNum}/12)` : waktuNum} × {persenNum}%</p>
              <p className="text-yellow-300 font-semibold mt-0.5">
                B = {fmt(tabAwalNum * (satuanWaktu === "bulan" ? waktuNum / 12 : waktuNum) * (persenNum / 100))}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-4 pt-2 flex gap-3">
        <motion.button
          onClick={handleSimulasi}
          disabled={!canCompute || (phase !== "idle" && phase !== "done")}
          className="flex-1 font-body font-bold text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(90deg, #1d4ed8, #4f46e5)", color: "white" }}
          whileHover={{ scale: canCompute ? 1.02 : 1 }}
          whileTap={{ scale: canCompute ? 0.97 : 1 }}
        >
          🚀 Mulai Simulasi
        </motion.button>
        <motion.button
          onClick={handleReset}
          className="px-4 rounded-xl font-body text-sm py-3 transition-all"
          style={{ background: "rgba(59,130,246,0.1)", border: "1.5px solid rgba(59,130,246,0.25)", color: "rgba(147,197,253,0.7)" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          🔄
        </motion.button>
      </div>
    </div>
  );
}
