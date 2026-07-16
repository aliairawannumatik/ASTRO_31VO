import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";

const makeFmt = (lang: string) => (n: number) =>
  (lang === "id" ? "Rp " : "$ ") + Math.round(n).toLocaleString(lang === "id" ? "id-ID" : "en-US");

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

const BankBuildingSVG = () => (
  <svg width="200" height="170" viewBox="0 0 200 170" fill="none">
    <defs>
      <linearGradient id="bankWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#1e40af" stopOpacity="0.05" />
      </linearGradient>
    </defs>
    <rect x="10" y="145" width="180" height="20" rx="3" fill="#1a2744" />
    <rect x="20" y="80" width="160" height="70" fill="#1e3a5f" />
    <rect x="20" y="80" width="160" height="70" fill="url(#bankWall)" />
    {[38, 70, 102, 134, 162].map((x, i) => (
      <rect key={i} x={x} y="82" width="10" height="65" rx="3" fill="#2563a8" opacity="0.7" />
    ))}
    <rect x="60" y="100" width="80" height="50" fill="#1e3a8a" />
    <rect x="95" y="103" width="10" height="6"  rx="2" fill="#93c5fd" opacity="0.6" />
    <rect x="65" y="103" width="22" height="18" rx="2" fill="#1e40af" />
    <rect x="113" y="103" width="22" height="18" rx="2" fill="#1e40af" />
    {[[68,106],[70,111],[72,116],[116,106],[118,111],[120,116]].map(([cx,cy], i) => (
      <rect key={i} x={cx} y={cy} width="16" height="3" rx="1" fill="#93c5fd" opacity="0.4" />
    ))}
    <polygon points="10,80 100,20 190,80" fill="#1e3a8a" />
    <polygon points="25,80 100,30 175,80" fill="#2563eb" opacity="0.5" />
    <rect x="75" y="38" width="50" height="26" rx="3" fill="#1e40af" />
    <rect x="78" y="41" width="44" height="20" rx="2" fill="#dbeafe" opacity="0.1" />
    <text x="100" y="55" textAnchor="middle" fontSize="9" fill="#93c5fd" fontWeight="bold" fontFamily="sans-serif">BANK</text>
    <circle cx="100" cy="24" r="6" fill="#fbbf24" />
    <line x1="100" y1="18" x2="100" y2="2" stroke="#d1d5db" strokeWidth="1.5" />
    <rect x="75" y="0" width="50" height="5" rx="2" fill="#1e40af" />
    {[10, 175].map((x, i) => (
      <g key={i}>
        <rect x={x === 10 ? 10 : 167} y="130" width="16" height="14" rx="2" fill="#0f172a" />
        <rect x={x === 10 ? 11 : 168} y="131" width="14" height="10" rx="1" fill="#0ea5e9" opacity="0.2" />
        <text x={x === 10 ? 18 : 175} y="140" textAnchor="middle" fontSize="5" fill="#38bdf8">ATM</text>
      </g>
    ))}
    <rect x="35" y="90" width="18" height="22" rx="2" fill="#1e40af" />
    <rect x="37" y="92" width="14" height="12" rx="1" fill="#93c5fd" opacity="0.15" />
    <rect x="147" y="90" width="18" height="22" rx="2" fill="#1e40af" />
    <rect x="149" y="92" width="14" height="12" rx="1" fill="#93c5fd" opacity="0.15" />
  </svg>
);

const TellerSVG = ({ phase }: { phase: string }) => {
  const typing  = phase === "menghitung";
  const happy   = phase === "selesai";
  const waving  = phase === "idle";

  return (
    <svg width="100" height="160" viewBox="0 0 100 160" fill="none">
      <rect x="10" y="130" width="80" height="25" rx="5" fill="#1e3a8a" />
      <rect x="20" y="108" width="60" height="26" rx="5" fill="#1d4ed8" />
      <rect x="28" y="113" width="44" height="16" rx="3" fill="white" opacity="0.12" />
      <rect x="32" y="116" width="36" height="10" rx="2" fill="#bfdbfe" opacity="0.25" />
      <rect x="2" y="100" width="25" height="38" rx="5" fill="#1e40af" />
      <motion.g
        animate={
          waving ? { rotate: [0, -25, 20, -15, 5, 0], originX: "14px", originY: "118px" } :
          typing  ? { rotate: [0, -8, 8, 0], originX: "14px", originY: "118px" } :
          { rotate: [0, -5, 0], originX: "14px", originY: "118px" }
        }
        transition={{ duration: waving ? 1.2 : 0.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="2" y="118" width="24" height="18" rx="4" fill="#1e40af" />
        <ellipse cx="14" cy="137" rx="9" ry="5" fill="#1e3a8a" />
        {waving && <text x="-2" y="108" fontSize="13">👋</text>}
      </motion.g>
      <rect x="73" y="100" width="25" height="38" rx="5" fill="#1e40af" />
      <rect x="74" y="118" width="24" height="18" rx="4" fill="#1e40af" />
      <ellipse cx="86" cy="137" rx="9" ry="5" fill="#1e3a8a" />
      {typing && (
        <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 0.3, repeat: Infinity }}>
          <rect x="28" y="95" width="44" height="14" rx="3" fill="#1e40af" />
          <rect x="30" y="97" width="40" height="10" rx="2" fill="#0f172a" />
          {[0,1,2,3,4].map((i) => (
            <motion.rect key={i} x={32 + i * 8} y={99} width={6} height={5} rx="1" fill="#3b82f6"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }} />
          ))}
        </motion.g>
      )}
      <rect x="25" y="76" width="50" height="36" rx="9" fill="#3b82f6" />
      <rect x="32" y="81" width="36" height="26" rx="5" fill="white" opacity="0.13" />
      <rect x="36" y="85" width="28" height="9" rx="2.5" fill="white" opacity="0.85" />
      <text x="50" y="93" textAnchor="middle" fontSize="5.5" fill="#1e40af" fontWeight="bold">TELLER</text>
      <circle cx="50" cy="38" r="22" fill="#fcd5a8" />
      <ellipse cx="50" cy="20" rx="20" ry="12" fill="#92400e" />
      <ellipse cx="50" cy="13" rx="12" ry="9" fill="#78350f" />
      <circle cx="44" cy="36" r="3" fill="#1e293b" />
      <circle cx="56" cy="36" r="3" fill="#1e293b" />
      <circle cx="45" cy="34" r="1.2" fill="white" />
      <circle cx="57" cy="34" r="1.2" fill="white" />
      {happy
        ? <path d="M42 46 Q50 55 58 46" stroke="#c2410c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        : <path d="M43 45 Q50 51 57 45" stroke="#c2410c" strokeWidth="2" fill="none" strokeLinecap="round" />}
      <ellipse cx="38" cy="42" rx="5" ry="3" fill="#f87171" opacity="0.4" />
      <ellipse cx="62" cy="42" rx="5" ry="3" fill="#f87171" opacity="0.4" />
      <rect x="30" y="21" width="40" height="8" rx="4" fill="#1e3a8a" />
      <rect x="22" y="26" width="56" height="5" rx="2.5" fill="#1e40af" />
      {happy && <text x="65" y="20" fontSize="14">🎉</text>}
    </svg>
  );
};

const CounterSVG = () => (
  <svg width="100%" height="50" viewBox="0 0 400 50" preserveAspectRatio="none" fill="none">
    <rect x="0" y="10" width="400" height="35" rx="5" fill="#1a2744" />
    <rect x="0" y="10" width="400" height="10" rx="5" fill="#1e40af" />
    <rect x="10" y="13" width="380" height="5" rx="2" fill="#bfdbfe" opacity="0.08" />
    <rect x="290" y="0" width="100" height="44" rx="4" fill="#0f172a" />
    <rect x="296" y="4"  width="88" height="32" rx="3" fill="#1e293b" />
    <rect x="298" y="6"  width="84" height="28" rx="2" fill="#0ea5e9" opacity="0.15" />
    <text x="340" y="22" textAnchor="middle" fontSize="8" fill="#38bdf8" fontWeight="bold">BANK</text>
    <text x="340" y="31" textAnchor="middle" fontSize="5.5" fill="#7dd3fc">NUMATIK</text>
    {[0,1,2].map(row =>
      [0,1,2,3].map(col => (
        <rect key={`${row}-${col}`}
          x={298 + col * 15} y={38 + row * 4} width={12} height={3} rx="1" fill="#334155" />
      ))
    )}
    <rect x="15" y="18" width="50" height="22" rx="3" fill="#1e3a8a" />
    <rect x="17" y="20" width="46" height="16" rx="2" fill="#0f172a" />
    <text x="40" y="31" textAnchor="middle" fontSize="7" fill="#34d399" fontFamily="monospace">BANK</text>
    <rect x="80" y="18" width="50" height="22" rx="3" fill="#1e3a8a" />
    <rect x="82" y="20" width="46" height="16" rx="2" fill="#0f172a" />
    <text x="105" y="31" textAnchor="middle" fontSize="7" fill="#fbbf24" fontFamily="monospace">NUMATIK</text>
  </svg>
);

const GrowthChart = ({
  data, fmt,
}: {
  data: { tahun: number; saldo: number }[];
  fmt: (n: number) => string;
}) => {
  if (data.length < 2) return null;
  const maxSaldo = Math.max(...data.map((d) => d.saldo));
  const W = 280, H = 100;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (d.saldo / maxSaldo) * H * 0.85;
    return { x, y, ...d };
  });
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `${pathD} L ${W} ${H} L 0 ${H} Z`;

  return (
    <svg width={W} height={H + 20} viewBox={`0 0 ${W} ${H + 20}`} className="w-full">
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#chartFill)" />
      <path d={pathD} stroke="#34d399" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#34d399" stroke="#022c22" strokeWidth="2" />
          {i === pts.length - 1 && (
            <text x={Math.min(p.x, W - 30)} y={p.y - 8} fontSize="8" fill="#34d399" fontWeight="bold" textAnchor="middle">
              {fmt(p.saldo)}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};

export default function BankSimulasi() {
  const { language: lang } = useLanguage();
  const fmt = makeFmt(lang);

  const uiMap = {
    id: {
      headerTitle: "Bank Numatik — Simulasi Bunga Tunggal",
      headerSub: "Aritmetika Sosial · Kelas 7",
      badge: "💰 BUNGA TUNGGAL",
      modalTitle: "💵 Modal Awal",
      bungaTitle: "📈 Suku Bunga (%/tahun)",
      lamaTitle: "⏳ Lama Investasi",
      unitTahun: "Tahun",
      unitBulan: "Bulan",
      btnHitung: "💳 Hitung Bunga",
      btnReset: "🔄 Reset",
      resultTitle: "✅ HASIL SIMULASI",
      labelModal: "Modal Awal",
      labelBunga: "Total Bunga",
      labelAkhir: "Saldo Akhir",
      labelKeuntungan: "Keuntungan",
      labelPeriode: (n: number, unit: string) => `Setelah ${n} ${unit}`,
      chartTitle: "📊 Pertumbuhan Saldo per Tahun",
      rumusTitle: "📐 Rumus",
      rumusBunga: "Bunga = Modal × Suku Bunga × Lama",
      rumusSaldo: "Saldo Akhir = Modal + Bunga",
      phModal: "Masukkan modal awal",
      phaseMenghitung: "🧮 Menghitung...",
    },
    en: {
      headerTitle: "Bank Numatik — Simple Interest Simulation",
      headerSub: "Social Arithmetic · Grade 7",
      badge: "💰 SIMPLE INTEREST",
      modalTitle: "💵 Principal Amount",
      bungaTitle: "📈 Interest Rate (%/year)",
      lamaTitle: "⏳ Investment Period",
      unitTahun: "Years",
      unitBulan: "Months",
      btnHitung: "💳 Calculate Interest",
      btnReset: "🔄 Reset",
      resultTitle: "✅ SIMULATION RESULT",
      labelModal: "Principal",
      labelBunga: "Total Interest",
      labelAkhir: "Final Balance",
      labelKeuntungan: "Earnings",
      labelPeriode: (n: number, unit: string) => `After ${n} ${unit}`,
      chartTitle: "📊 Balance Growth per Year",
      rumusTitle: "📐 Formulas",
      rumusBunga: "Interest = Principal × Rate × Time",
      rumusSaldo: "Final Balance = Principal + Interest",
      phModal: "Enter principal amount",
      phaseMenghitung: "🧮 Calculating...",
    },
    ja: {
      headerTitle: "バンクNUMATIK — 単利シミュレーション",
      headerSub: "社会算数 · 中学1年",
      badge: "💰 単利",
      modalTitle: "💵 元金",
      bungaTitle: "📈 利率（%/年）",
      lamaTitle: "⏳ 預入期間",
      unitTahun: "年",
      unitBulan: "ヶ月",
      btnHitung: "💳 利息を計算",
      btnReset: "🔄 リセット",
      resultTitle: "✅ シミュレーション結果",
      labelModal: "元金",
      labelBunga: "合計利息",
      labelAkhir: "最終残高",
      labelKeuntungan: "収益",
      labelPeriode: (n: number, unit: string) => `${n}${unit}後`,
      chartTitle: "📊 年間残高推移",
      rumusTitle: "📐 公式",
      rumusBunga: "利息 = 元金 × 利率 × 期間",
      rumusSaldo: "最終残高 = 元金 + 利息",
      phModal: "元金を入力",
      phaseMenghitung: "🧮 計算中...",
    },
  };
  const ui = uiMap[lang as keyof typeof uiMap] ?? uiMap.id;

  const [modal, setModal]         = useState("1000000");
  const [bunga, setBunga]         = useState("6");
  const [lama, setLama]           = useState("2");
  const [unitLama, setUnitLama]   = useState<"tahun" | "bulan">("tahun");
  const [phase, setPhase]         = useState("idle");
  const [showResult, setShowResult] = useState(false);
  const [showCoins, setShowCoins] = useState(false);
  const [chartKey, setChartKey]   = useState(0);

  const M  = parseFloat(modal.replace(/\D/g, "")) || 0;
  const r  = parseFloat(bunga) / 100;
  const n  = parseFloat(lama) || 0;
  const t  = unitLama === "tahun" ? n : n / 12;
  const bungaRp = M * r * t;
  const saldo   = M + bungaRp;

  const PRESET_MODAL = [500_000, 1_000_000, 5_000_000, 10_000_000];
  const PRESET_BUNGA = [3, 6, 9, 12];
  const PRESET_LAMA  = [1, 2, 5, 10];

  const yearlyData = Array.from({ length: Math.min(Math.ceil(t), 20) + 1 }, (_, i) => ({
    tahun: i,
    saldo: M + M * r * i,
  }));

  const handleHitung = async () => {
    if (M <= 0) return;
    playPopSound();
    setPhase("menghitung");
    setShowResult(false);
    setShowCoins(false);
    await new Promise(res => setTimeout(res, 1000));
    setShowCoins(true);
    setPhase("selesai");
    setShowResult(true);
    setChartKey(k => k + 1);
    await new Promise(res => setTimeout(res, 2000));
    setShowCoins(false);
    setTimeout(() => setPhase("idle"), 1500);
  };

  const handleReset = () => {
    playPopSound();
    setModal("1000000");
    setBunga("6");
    setLama("2");
    setUnitLama("tahun");
    setShowResult(false);
    setPhase("idle");
  };

  const unitLabel = unitLama === "tahun" ? ui.unitTahun : ui.unitBulan;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #022c22 100%)",
        border: "2px solid rgba(52,211,153,0.3)",
        boxShadow: "0 0 40px rgba(52,211,153,0.1)",
      }}
    >
      <div className="px-5 py-3 flex items-center gap-3"
        style={{ background: "linear-gradient(90deg, rgba(52,211,153,0.2), rgba(16,185,129,0.1))" }}>
        <span className="text-2xl">🏦</span>
        <div>
          <p className="font-body font-bold text-emerald-200 text-sm">{ui.headerTitle}</p>
          <p className="font-body text-[10px] text-emerald-400/60">{ui.headerSub}</p>
        </div>
        <span className="ml-auto bg-emerald-700 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
          {ui.badge}
        </span>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="relative rounded-2xl overflow-hidden mb-3"
            style={{ background: "linear-gradient(180deg, #d1fae5 0%, #a7f3d0 40%, #6ee7b7 100%)", minHeight: 220 }}>
            <div className="absolute inset-0">
              <motion.div className="absolute top-2 left-3 text-4xl opacity-60"
                animate={{ x: [0, 12, 0] }} transition={{ duration: 7, repeat: Infinity }}>☁️</motion.div>
              <motion.div className="absolute top-3 right-6 text-3xl opacity-50"
                animate={{ x: [0, -8, 0] }} transition={{ duration: 9, repeat: Infinity }}>☁️</motion.div>
              <motion.div className="absolute top-1 right-2 text-3xl"
                animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>☀️</motion.div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-green-600 to-transparent" />
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
              <BankBuildingSVG />
            </div>
            <div className="absolute bottom-10" style={{ left: "calc(50% - 15px)" }}>
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
                <TellerSVG phase={phase} />
              </motion.div>
            </div>

            <AnimatePresence>
              {showCoins && (
                <>
                  <Coin x={100} y={100} delay={0}    emoji="🪙" />
                  <Coin x={130} y={95}  delay={0.15} emoji="💰" />
                  <Coin x={80}  y={108} delay={0.3}  emoji="🪙" />
                  <Coin x={150} y={100} delay={0.45} emoji="💵" />
                  <Coin x={115} y={90}  delay={0.6}  emoji="🪙" />
                  <FloatLabel text={`+${fmt(bungaRp)}`} x={70} y={80}  delay={0.2} color="bg-emerald-600" />
                  <FloatLabel text="📈 PROFIT!" x={140} y={70} delay={0.5} color="bg-blue-600" />
                </>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {phase !== "idle" && (
                <motion.div
                  className={`absolute top-3 left-3 text-[10px] font-black px-3 py-1.5 rounded-full text-white ${
                    phase === "selesai" ? "bg-emerald-600" : "bg-blue-600"
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {phase === "menghitung" ? ui.phaseMenghitung : `✅ +${fmt(bungaRp)}`}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <CounterSVG />
        </div>

        <div className="space-y-3">
          <div>
            <p className="font-body text-xs font-bold text-emerald-300 mb-1">{ui.modalTitle}</p>
            <div className="relative mb-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-sm">
                {lang === "id" ? "Rp" : "$"}
              </span>
              <input
                type="number"
                value={modal}
                onChange={(e) => { setModal(e.target.value); setShowResult(false); }}
                placeholder={ui.phModal}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl font-body text-sm text-white focus:outline-none"
                style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.3)" }}
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {PRESET_MODAL.map((v) => (
                <button key={v}
                  onClick={() => { setModal(v.toString()); setShowResult(false); playPopSound(); }}
                  className="text-[10px] font-body font-bold px-2.5 py-1 rounded-full transition-all"
                  style={modal === v.toString()
                    ? { background: "rgba(52,211,153,0.3)", border: "1px solid rgba(52,211,153,0.7)", color: "#34d399" }
                    : { background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)", color: "rgba(52,211,153,0.5)" }}>
                  {fmt(v)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-body text-xs font-bold text-emerald-300 mb-1">{ui.bungaTitle}</p>
            <div className="flex gap-2 flex-wrap">
              {PRESET_BUNGA.map((b) => (
                <button key={b}
                  onClick={() => { setBunga(b.toString()); setShowResult(false); playPopSound(); }}
                  className="flex-1 py-2 rounded-lg text-xs font-body font-bold transition-all"
                  style={bunga === b.toString()
                    ? { background: "rgba(52,211,153,0.25)", border: "1.5px solid rgba(52,211,153,0.8)", color: "#34d399" }
                    : { background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.2)", color: "rgba(52,211,153,0.4)" }}>
                  {b}%
                </button>
              ))}
              <input
                type="number"
                value={!PRESET_BUNGA.includes(parseFloat(bunga)) ? bunga : ""}
                onChange={(e) => { setBunga(e.target.value); setShowResult(false); }}
                placeholder="..."
                className="flex-1 rounded-lg px-2 py-2 text-xs font-body focus:outline-none text-center"
                style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}
              />
            </div>
          </div>

          <div>
            <p className="font-body text-xs font-bold text-emerald-300 mb-1">{ui.lamaTitle}</p>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex gap-1 rounded-lg overflow-hidden border border-emerald-700/40">
                {(["tahun", "bulan"] as const).map((u) => (
                  <button key={u}
                    onClick={() => { setUnitLama(u); setShowResult(false); playPopSound(); }}
                    className="px-3 py-1.5 text-xs font-body font-bold transition-all"
                    style={unitLama === u
                      ? { background: "rgba(52,211,153,0.3)", color: "#34d399" }
                      : { background: "transparent", color: "rgba(52,211,153,0.4)" }}>
                    {u === "tahun" ? ui.unitTahun : ui.unitBulan}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {PRESET_LAMA.map((l) => (
                <button key={l}
                  onClick={() => { setLama(l.toString()); setShowResult(false); playPopSound(); }}
                  className="text-[10px] font-body font-bold px-2.5 py-1 rounded-full transition-all"
                  style={lama === l.toString()
                    ? { background: "rgba(52,211,153,0.3)", border: "1px solid rgba(52,211,153,0.7)", color: "#34d399" }
                    : { background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)", color: "rgba(52,211,153,0.5)" }}>
                  {l} {unitLama === "tahun" ? ui.unitTahun : ui.unitBulan}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              onClick={handleHitung}
              disabled={M <= 0 || phase === "menghitung"}
              className="flex-1 py-3 rounded-xl font-body font-black text-sm text-white disabled:opacity-40"
              style={{ background: "linear-gradient(90deg, #059669, #10b981)" }}
              whileHover={{ scale: M > 0 ? 1.02 : 1 }}
              whileTap={{ scale: 0.97 }}
            >
              {phase === "menghitung" ? "⏳..." : ui.btnHitung}
            </motion.button>
            <motion.button
              onClick={handleReset}
              className="px-4 py-3 rounded-xl font-body font-black text-sm transition-all"
              style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "rgba(52,211,153,0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              🔄
            </motion.button>
          </div>

          <AnimatePresence>
            {showResult && M > 0 && (
              <motion.div
                className="rounded-xl overflow-hidden"
                style={{ background: "rgba(52,211,153,0.07)", border: "1.5px solid rgba(52,211,153,0.35)" }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 180 }}
              >
                <div className="px-4 py-3">
                  <p className="font-body text-xs font-bold text-emerald-300 mb-2">{ui.resultTitle}</p>
                  <p className="font-body text-[10px] text-emerald-400/60 mb-2">
                    {ui.labelPeriode(n, unitLabel)}
                  </p>
                  <div className="space-y-1.5">
                    {[
                      { label: ui.labelModal, val: fmt(M), color: "text-white" },
                      { label: `${ui.labelBunga} (${bunga}%/${unitLama === "tahun" ? ui.unitTahun : ui.unitBulan})`, val: `+${fmt(bungaRp)}`, color: "text-emerald-300" },
                      { label: ui.labelAkhir, val: fmt(saldo), color: "text-emerald-200", bold: true },
                    ].map(({ label, val, color, bold }) => (
                      <div key={label} className="flex justify-between items-center">
                        <span className="font-body text-xs text-emerald-200/60">{label}</span>
                        <motion.span
                          key={val}
                          className={`font-body text-sm ${bold ? "font-black" : "font-bold"} ${color}`}
                          initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                        >
                          {val}
                        </motion.span>
                      </div>
                    ))}
                  </div>
                </div>

                {t >= 1 && (
                  <div className="px-4 pb-3">
                    <p className="font-body text-[10px] text-emerald-300/60 mb-1">{ui.chartTitle}</p>
                    <GrowthChart key={chartKey} data={yearlyData} fmt={fmt} />
                  </div>
                )}

                <div className="px-4 pb-3">
                  <div className="rounded-lg p-2 text-[9px] font-mono text-emerald-300/50"
                    style={{ background: "var(--bg-secondary)", border: "1px dashed rgba(52,211,153,0.2)" }}>
                    <p>{ui.rumusBunga}</p>
                    <p>{ui.rumusSaldo}</p>
                    <p className="text-emerald-300 mt-1">
                      B = {fmt(M)} × {bunga}% × {n} = {fmt(bungaRp)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
