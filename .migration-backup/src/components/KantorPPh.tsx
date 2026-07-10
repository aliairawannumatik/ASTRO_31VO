import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";

const makeFmt = (lang: string) => (n: number) =>
  (lang === "id" ? "Rp " : "$ ") + Math.round(n).toLocaleString(lang === "id" ? "id-ID" : "en-US");
const makeFmtM = (lang: string) => (n: number) =>
  (lang === "id" ? "Rp " : "$ ") +
  (n / 1_000_000).toFixed(1).replace(/\.0$/, "") +
  (lang === "id" ? " jt" : "M");

const PTKP_LIST = [
  { key: "tk0",  nilai: 54_000_000 },
  { key: "tk1",  nilai: 58_500_000 },
  { key: "k0",   nilai: 58_500_000 },
  { key: "k1",   nilai: 63_000_000 },
  { key: "k2",   nilai: 67_500_000 },
  { key: "k3",   nilai: 72_000_000 },
];

const getPtkpLabel = (key: string, lang: string) => {
  const map: Record<string, Record<string, string>> = {
    tk0: { id: "TK/0 – Lajang, tanpa tanggungan",       en: "Single, no dependants",         ja: "独身・扶養なし" },
    tk1: { id: "TK/1 – Lajang, 1 tanggungan",           en: "Single, 1 dependant",           ja: "独身・扶養1名" },
    k0:  { id: "K/0  – Kawin, tanpa tanggungan",         en: "Married, no dependants",        ja: "既婚・扶養なし" },
    k1:  { id: "K/1  – Kawin, 1 tanggungan",             en: "Married, 1 dependant",          ja: "既婚・扶養1名" },
    k2:  { id: "K/2  – Kawin, 2 tanggungan",             en: "Married, 2 dependants",         ja: "既婚・扶養2名" },
    k3:  { id: "K/3  – Kawin, 3 tanggungan",             en: "Married, 3 dependants",         ja: "既婚・扶養3名" },
  };
  return map[key]?.[lang] ?? map[key]?.id ?? key;
};

const PROFESI = [
  { key: "pns",  emoji: "👨‍💼", gaji: 5_000_000 },
  { key: "swasta", emoji: "👷", gaji: 8_000_000 },
  { key: "dokter", emoji: "🩺", gaji: 15_000_000 },
  { key: "dev",  emoji: "💻",  gaji: 25_000_000 },
  { key: "dir",  emoji: "🏢",  gaji: 50_000_000 },
  { key: "hakim",emoji: "⚖️", gaji: 110_000_000 },
];

const getProfesiLabel = (key: string, lang: string) => {
  const map: Record<string, Record<string, string>> = {
    pns:    { id: "Pegawai Negeri",    en: "Civil Servant",       ja: "公務員" },
    swasta: { id: "Karyawan Swasta",   en: "Private Employee",    ja: "会社員" },
    dokter: { id: "Dokter RS",         en: "Hospital Doctor",     ja: "病院医師" },
    dev:    { id: "Software Engineer", en: "Software Engineer",   ja: "ソフトウェアエンジニア" },
    dir:    { id: "Direktur",          en: "Director",            ja: "取締役" },
    hakim:  { id: "Hakim",             en: "Judge",               ja: "裁判官" },
  };
  return map[key]?.[lang] ?? key;
};

const hitungPPhProgresif = (pkpTahun: number): number => {
  if (pkpTahun <= 0) return 0;
  let pph = 0;
  if (pkpTahun > 0)           pph += Math.min(pkpTahun, 60_000_000) * 0.05;
  if (pkpTahun > 60_000_000)  pph += Math.min(pkpTahun - 60_000_000, 190_000_000) * 0.15;
  if (pkpTahun > 250_000_000) pph += Math.min(pkpTahun - 250_000_000, 250_000_000) * 0.25;
  if (pkpTahun > 500_000_000) pph += (pkpTahun - 500_000_000) * 0.30;
  return pph;
};

const tarifLabel = (pkp: number) => {
  if (pkp <= 0)           return "0%";
  if (pkp <= 60_000_000)  return "5%";
  if (pkp <= 250_000_000) return "5–15%";
  if (pkp <= 500_000_000) return "5–25%";
  return "5–30%";
};

const WorkerSVG = ({ phase }: { phase: string }) => {
  const typing = phase === "hitung";
  const happy  = phase === "selesai";
  return (
    <svg width="110" height="160" viewBox="0 0 110 160" fill="none">
      <rect x="5"  y="130" width="100" height="25" rx="5" fill="#1e3a8a" />
      <rect x="15" y="108" width="80"  height="28" rx="6" fill="#1d4ed8" />
      <rect x="25" y="92"  width="60"  height="20" rx="4" fill="white" opacity="0.12" />
      <rect x="30" y="95"  width="50"  height="14" rx="3" fill="#bfdbfe" opacity="0.3" />
      <rect x="4"  y="95"  width="30"  height="40" rx="5" fill="#1e40af" />
      <motion.g
        animate={typing ? { rotate: [0, -8, 8, 0] } : {}}
        transition={{ duration: 0.3, repeat: Infinity }}
        style={{ originX: "20px", originY: "115px" }}
      >
        <rect x="0" y="115" width="28" height="18" rx="4" fill="#1e40af" />
        <ellipse cx="14" cy="134" rx="10" ry="5" fill="#1e3a8a" />
      </motion.g>
      <rect x="76" y="95"  width="30"  height="40" rx="5" fill="#1e40af" />
      <rect x="78" y="115" width="28"  height="18" rx="4" fill="#1e40af" />
      <ellipse cx="92" cy="134" rx="10" ry="5" fill="#1e3a8a" />
      <rect x="20" y="70" width="70" height="50" rx="10" fill="#3b82f6" />
      <rect x="30" y="75" width="50" height="40" rx="6" fill="white" opacity="0.15" />
      <rect x="35" y="80" width="40" height="12" rx="3" fill="white" opacity="0.85" />
      <text x="55" y="90" textAnchor="middle" fontSize="6" fill="#1e40af" fontWeight="bold">PAJAK</text>
      {typing && (
        <>
          {[0,1,2].map((i) => (
            <motion.rect key={i} x={37 + i * 14} y={95} width={11} height={7} rx="2" fill="white" opacity="0.5"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
            />
          ))}
        </>
      )}
      <circle cx="55" cy="36" r="22" fill="#fcd5a8" />
      <ellipse cx="55" cy="18" rx="20" ry="12" fill="#92400e" />
      <ellipse cx="55" cy="11" rx="12" ry="9" fill="#78350f" />
      <circle cx="49" cy="34" r="3" fill="#1e293b" />
      <circle cx="61" cy="34" r="3" fill="#1e293b" />
      <circle cx="50" cy="32" r="1.2" fill="white" />
      <circle cx="62" cy="32" r="1.2" fill="white" />
      {happy
        ? <path d="M47 44 Q55 53 63 44" stroke="#c2410c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        : <path d="M48 43 Q55 49 62 43" stroke="#c2410c" strokeWidth="2" fill="none" strokeLinecap="round" />}
      <ellipse cx="44" cy="40" rx="5" ry="3" fill="#f87171" opacity="0.4" />
      <ellipse cx="66" cy="40" rx="5" ry="3" fill="#f87171" opacity="0.4" />
      <rect x="30" y="20" width="50" height="10" rx="4" fill="#1e3a8a" />
      <rect x="20" y="26" width="70" height="6" rx="3" fill="#1e40af" />
      {happy && <text x="75" y="18" fontSize="14">🎉</text>}
      {typing && <text x="75" y="18" fontSize="12">💡</text>}
    </svg>
  );
};

const DeskSVG = () => (
  <svg width="100%" height="50" viewBox="0 0 400 50" preserveAspectRatio="none" fill="none">
    <rect x="0" y="10" width="400" height="35" rx="5" fill="#1e3a8a" />
    <rect x="0" y="10" width="400" height="10" rx="5" fill="#2563eb" />
    <rect x="10" y="13" width="380" height="5" rx="2" fill="#bfdbfe" opacity="0.1" />
    <rect x="280" y="0" width="100" height="44" rx="4" fill="#0f172a" />
    <rect x="286" y="4"  width="88" height="32" rx="3" fill="#1e293b" />
    <rect x="288" y="6"  width="84" height="28" rx="2" fill="#0ea5e9" opacity="0.15" />
    <text x="330" y="22" textAnchor="middle" fontSize="8" fill="#38bdf8" fontWeight="bold">SISTEM</text>
    <text x="330" y="31" textAnchor="middle" fontSize="6" fill="#7dd3fc">PAJAK</text>
    {[0,1,2].map(row =>
      [0,1,2,3].map(col => (
        <rect key={`${row}-${col}`}
          x={290 + col * 15} y={38 + row * 4} width={12} height={3} rx="1" fill="#334155" />
      ))
    )}
  </svg>
);

const ResultPanel = ({
  brutoPerBulan, brutoPerTahun, ptkpPerTahun, pkp, pph, bersih,
  tarif, fmt, fmtM, ui,
}: {
  brutoPerBulan: number; brutoPerTahun: number; ptkpPerTahun: number;
  pkp: number; pph: number; bersih: number; tarif: string;
  fmt: (n: number) => string;
  fmtM: (n: number) => string;
  ui: Record<string, string>;
}) => (
  <motion.div
    className="rounded-2xl overflow-hidden shadow-xl"
    style={{ background: "rgba(15,23,42,0.95)", border: "2px solid rgba(59,130,246,0.4)" }}
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 180 }}
  >
    <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-3">
      <p className="text-white font-black text-sm tracking-wider">{ui.resultTitle}</p>
      <p className="text-blue-200 text-[10px]">{ui.resultSub}</p>
    </div>
    <div className="px-5 py-4 space-y-2 font-mono">
      {[
        { label: `${ui.labelBruto} (${ui.labelBulan})`, val: fmt(brutoPerBulan), color: "text-white" },
        { label: `${ui.labelBruto} (${ui.labelTahun})`, val: fmt(brutoPerTahun), color: "text-blue-200" },
        { label: `−${ui.labelPtkp} (${ui.labelTahun})`, val: fmt(ptkpPerTahun), color: "text-orange-400" },
        { label: ui.labelPkp, val: fmt(Math.max(0, pkp)), color: "text-yellow-300" },
        { label: `${ui.labelPph} (${tarif})`, val: fmt(pph), color: "text-red-400" },
      ].map(({ label, val, color }) => (
        <div key={label} className="flex justify-between items-center text-xs">
          <span className="text-white/50">{label}</span>
          <span className={`font-bold ${color}`}>{val}</span>
        </div>
      ))}
      <div className="border-t border-blue-700/50 pt-2 flex justify-between">
        <span className="text-blue-100 font-black text-sm">{ui.labelBersih} ({ui.labelTahun})</span>
        <motion.span key={bersih} className="text-green-400 font-black text-base"
          initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          {fmt(bersih)}
        </motion.span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-white/40">{ui.labelBersih} ({ui.labelBulan})</span>
        <span className="text-green-300 font-semibold">{fmt(bersih / 12)}</span>
      </div>
      {pkp <= 0 && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2 text-center">
          <p className="text-xs text-green-300 font-semibold">✅ {ui.bebasPajak}</p>
        </div>
      )}
    </div>
  </motion.div>
);

export default function KantorPPh() {
  const { language: lang } = useLanguage();
  const fmt  = makeFmt(lang);
  const fmtM = makeFmtM(lang);

  const uiMap = {
    id: {
      headerTitle: "Kantor Pajak — Simulasi PPh Progresif",
      headerSub: "Aritmetika Sosial · Kelas 7",
      badge: "PPh PROGRESIF",
      profesiTitle: "👔 Pilih Profesi",
      ptkpTitle: "📋 PTKP (Non-Kena Pajak / Tahun)",
      gajiTitle: "💰 Gaji Bruto / Bulan",
      btnHitung: "🧮 Hitung PPh",
      resultTitle: "HASIL PERHITUNGAN PPh",
      resultSub: "Berdasarkan aturan pasal 17",
      labelBruto: "Gaji Bruto",
      labelBulan: "Bln",
      labelTahun: "Thn",
      labelPtkp: "PTKP",
      labelPkp: "PKP (Kena Pajak)",
      labelPph: "PPh Terutang",
      labelBersih: "Gaji Bersih / THP",
      bebasPajak: "Penghasilan di bawah PTKP → Bebas PPh!",
      noteLabel: "Sistem PPh Indonesia digunakan sebagai contoh pembelajaran pajak penghasilan.",
      phGaji: "Masukkan gaji bruto per bulan",
      phaseHitung: "🧮 MENGHITUNG...",
      phaseSelesai: "✅ SELESAI!",
    },
    en: {
      headerTitle: "Tax Office — Progressive Income Tax Simulation",
      headerSub: "Social Arithmetic · Grade 7",
      badge: "INCOME TAX",
      profesiTitle: "👔 Choose Profession",
      ptkpTitle: "📋 Tax-Free Threshold (per Year)",
      gajiTitle: "💰 Gross Salary / Month",
      btnHitung: "🧮 Calculate Tax",
      resultTitle: "INCOME TAX CALCULATION",
      resultSub: "Based on progressive rates",
      labelBruto: "Gross Salary",
      labelBulan: "Month",
      labelTahun: "Year",
      labelPtkp: "Tax-Free Threshold",
      labelPkp: "Taxable Income",
      labelPph: "Income Tax",
      labelBersih: "Net Salary / Take-Home Pay",
      bebasPajak: "Income below tax-free threshold → No Income Tax!",
      noteLabel: "This simulation uses Indonesia's income tax (PPh) system as an illustrative example of progressive income tax.",
      phGaji: "Enter monthly gross salary",
      phaseHitung: "🧮 CALCULATING...",
      phaseSelesai: "✅ DONE!",
    },
    ja: {
      headerTitle: "税務署 — 累進所得税シミュレーション",
      headerSub: "社会算数 · 中学1年",
      badge: "所得税",
      profesiTitle: "👔 職業を選択",
      ptkpTitle: "📋 非課税基準額（年間）",
      gajiTitle: "💰 額面給与（月）",
      btnHitung: "🧮 税金を計算",
      resultTitle: "所得税計算結果",
      resultSub: "累進課税方式による",
      labelBruto: "額面給与",
      labelBulan: "月",
      labelTahun: "年",
      labelPtkp: "非課税基準額",
      labelPkp: "課税所得",
      labelPph: "所得税",
      labelBersih: "手取り",
      bebasPajak: "非課税基準額以下 → 所得税免除！",
      noteLabel: "このシミュレーションはインドネシアの所得税制度を累進課税の学習例として使用しています。",
      phGaji: "月額給与を入力",
      phaseHitung: "🧮 計算中...",
      phaseSelesai: "✅ 完了！",
    },
  };
  const ui = uiMap[lang as keyof typeof uiMap] ?? uiMap.id;

  const [selectedProfesi, setSelectedProfesi] = useState(0);
  const [selectedPtkpIdx, setSelectedPtkpIdx] = useState(0);
  const [gajiInput, setGajiInput] = useState("");
  const [phase, setPhase] = useState("idle");
  const [showResult, setShowResult] = useState(false);

  const profesi = PROFESI[selectedProfesi];
  const ptkpItem = PTKP_LIST[selectedPtkpIdx];
  const gajiBruto = parseFloat(gajiInput.replace(/[^0-9.]/g, "")) || profesi.gaji;
  const brutoPerTahun = gajiBruto * 12;
  const pkpTahun = brutoPerTahun - ptkpItem.nilai;
  const pphTahun = hitungPPhProgresif(Math.max(0, pkpTahun));
  const bersihTahun = brutoPerTahun - pphTahun;

  const handleHitung = () => {
    if (gajiBruto <= 0) return;
    setPhase("hitung");
    setShowResult(false);
    playPopSound();
    setTimeout(() => {
      setPhase("selesai");
      setShowResult(true);
      setTimeout(() => setPhase("idle"), 3000);
    }, 1200);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e3a8a 100%)",
        border: "2px solid rgba(59,130,246,0.3)",
        boxShadow: "0 0 40px rgba(59,130,246,0.1)",
      }}
    >
      <div className="px-5 py-3 flex items-center gap-3"
        style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.2), rgba(99,102,241,0.1))" }}>
        <span className="text-2xl">🏢</span>
        <div>
          <p className="font-body font-bold text-blue-200 text-sm">{ui.headerTitle}</p>
          <p className="font-body text-[10px] text-blue-400/60">{ui.headerSub}</p>
        </div>
        <span className="ml-auto bg-blue-700 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{ui.badge}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div>
          <div className="relative rounded-2xl overflow-hidden mb-3"
            style={{ background: "linear-gradient(180deg, #dbeafe 0%, #bfdbfe 40%, #a5b4fc 100%)", minHeight: 200 }}>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-blue-800 to-transparent" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <WorkerSVG phase={phase} />
            </div>
            <DeskSVG />
            {phase === "hitung" && (
              <motion.div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-full"
                animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                {ui.phaseHitung}
              </motion.div>
            )}
            {phase === "selesai" && (
              <motion.div className="absolute top-3 right-3 bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded-full"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                {ui.phaseSelesai}
              </motion.div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <p className="font-body text-xs font-bold text-blue-300 mb-2">{ui.profesiTitle}</p>
              <div className="grid grid-cols-3 gap-1.5">
                {PROFESI.map((p, i) => (
                  <motion.button
                    key={p.key}
                    onClick={() => { setSelectedProfesi(i); setGajiInput(""); setShowResult(false); playPopSound(); }}
                    className="rounded-lg px-2 py-2 text-center transition-all"
                    style={selectedProfesi === i
                      ? { background: "rgba(59,130,246,0.25)", border: "1.5px solid rgba(59,130,246,0.7)" }
                      : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(59,130,246,0.15)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-lg block">{p.emoji}</span>
                    <span className="text-[9px] font-body font-bold text-blue-200 block leading-tight mt-0.5">
                      {getProfesiLabel(p.key, lang)}
                    </span>
                    <span className="text-[8px] text-blue-400">{fmtM(p.gaji)}/bln</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="font-body text-xs font-bold text-blue-300 mb-2">{ui.gajiTitle}</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 font-bold text-sm">
                {lang === "id" ? "Rp" : "$"}
              </span>
              <input
                type="number"
                value={gajiInput}
                onChange={(e) => { setGajiInput(e.target.value); setShowResult(false); }}
                placeholder={`${ui.phGaji} (${fmtM(profesi.gaji)})`}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl font-body text-sm text-white focus:outline-none"
                style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.3)" }}
              />
            </div>
          </div>

          <div>
            <p className="font-body text-xs font-bold text-blue-300 mb-2">{ui.ptkpTitle}</p>
            <div className="space-y-1">
              {PTKP_LIST.map((item, i) => (
                <button
                  key={item.key}
                  onClick={() => { setSelectedPtkpIdx(i); setShowResult(false); playPopSound(); }}
                  className="w-full rounded-lg px-3 py-2 text-left flex justify-between items-center transition-all"
                  style={selectedPtkpIdx === i
                    ? { background: "rgba(59,130,246,0.2)", border: "1.5px solid rgba(59,130,246,0.6)" }
                    : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(59,130,246,0.1)" }}
                >
                  <span className="font-body text-[10px] text-blue-200">{getPtkpLabel(item.key, lang)}</span>
                  <span className="font-body text-[10px] font-bold text-blue-300">{fmtM(item.nilai)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-900/30 border border-blue-700/30 rounded-lg px-3 py-2">
            <p className="font-body text-[10px] text-blue-400/70 leading-relaxed">{ui.noteLabel}</p>
          </div>

          <motion.button
            onClick={handleHitung}
            className="w-full py-3 rounded-xl font-body font-black text-sm text-white"
            style={{ background: "linear-gradient(90deg, #1d4ed8, #4f46e5)" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {ui.btnHitung}
          </motion.button>

          <AnimatePresence>
            {showResult && (
              <ResultPanel
                brutoPerBulan={gajiBruto}
                brutoPerTahun={brutoPerTahun}
                ptkpPerTahun={ptkpItem.nilai}
                pkp={pkpTahun}
                pph={pphTahun}
                bersih={bersihTahun}
                tarif={tarifLabel(Math.max(0, pkpTahun))}
                fmt={fmt}
                fmtM={fmtM}
                ui={ui as unknown as Record<string, string>}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
