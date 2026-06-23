import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { playPopSound } from "@/hooks/useAudio";

/* ─── helpers ─────────────────────────────────────────── */
const fmt  = (n: number) => "Rp " + Math.round(n).toLocaleString("id-ID");
const fmtM = (n: number) => "Rp " + Math.round(n / 1_000_000).toLocaleString("id-ID") + " jt";

/* ─── PTKP table (per tahun, sesuai aturan berlaku) ──── */
const PTKP_LIST = [
  { label: "TK/0 – Lajang, tanpa tanggungan",       nilai: 54_000_000 },
  { label: "TK/1 – Lajang, 1 tanggungan",           nilai: 58_500_000 },
  { label: "K/0  – Kawin, tanpa tanggungan",         nilai: 58_500_000 },
  { label: "K/1  – Kawin, 1 tanggungan",             nilai: 63_000_000 },
  { label: "K/2  – Kawin, 2 tanggungan",             nilai: 67_500_000 },
  { label: "K/3  – Kawin, 3 tanggungan",             nilai: 72_000_000 },
];

/* ─── Preset professions ──────────────────────────────── */
const PROFESI = [
  { nama: "Pegawai Negeri",     emoji: "👨‍💼", gaji: 5_000_000 },
  { nama: "Karyawan Swasta",    emoji: "👷",  gaji: 8_000_000 },
  { nama: "Dokter RS",          emoji: "🩺",  gaji: 15_000_000 },
  { nama: "Software Engineer",  emoji: "💻",  gaji: 25_000_000 },
  { nama: "Direktur",           emoji: "🏢",  gaji: 50_000_000 },
  { nama: "Hakim",              emoji: "⚖️",  gaji: 110_000_000 },
];

/* ─── PPh tarif progresif (pasal 17) ─────────────────── */
const hitungPPh = (pkpTahun: number): number => {
  if (pkpTahun <= 0) return 0;
  let pph = 0;
  if (pkpTahun > 0)           pph += Math.min(pkpTahun, 60_000_000)           * 0.05;
  if (pkpTahun > 60_000_000)  pph += Math.min(pkpTahun - 60_000_000, 190_000_000) * 0.15;
  if (pkpTahun > 250_000_000) pph += Math.min(pkpTahun - 250_000_000, 250_000_000)* 0.25;
  if (pkpTahun > 500_000_000) pph += (pkpTahun - 500_000_000)                  * 0.30;
  return pph;
};

const tarifLabel = (pkp: number) => {
  if (pkp <= 0)           return "0%";
  if (pkp <= 60_000_000)  return "5%";
  if (pkp <= 250_000_000) return "5–15%";
  if (pkp <= 500_000_000) return "5–25%";
  return "5–30%";
};

/* ════════════════════════════════════════════════════════
   WORKER SVG  (office worker at desk)
════════════════════════════════════════════════════════ */
const WorkerSVG = ({ phase }: { phase: string }) => {
  const happy     = phase === "done-clear" || phase === "done-tax";
  const worried   = phase === "done-tax";
  const holding   = phase === "done-clear" || phase === "done-tax" || phase === "anim";
  return (
    <svg width="100" height="170" viewBox="0 0 100 170" fill="none">
      {/* chair back */}
      <rect x="30" y="110" width="40" height="50" rx="8" fill="#374151" />
      <rect x="36" y="116" width="28" height="38" rx="5" fill="#4b5563" />
      {/* legs */}
      <rect x="33" y="145" width="10" height="22" rx="4" fill="#1f2937" />
      <rect x="57" y="145" width="10" height="22" rx="4" fill="#1f2937" />
      <ellipse cx="38" cy="167" rx="9" ry="4" fill="#111827" />
      <ellipse cx="62" cy="167" rx="9" ry="4" fill="#111827" />
      {/* body – jas */}
      <rect x="22" y="78" width="56" height="56" rx="10" fill="#1e40af" />
      {/* shirt & tie */}
      <rect x="38" y="78" width="24" height="56" rx="4" fill="#f1f5f9" />
      <polygon points="48,82 52,82 51,105 50,108 49,105" fill="#dc2626" />
      {/* lapel */}
      <polygon points="38,78 48,82 38,98" fill="#1e3a8a" />
      <polygon points="62,78 52,82 62,98" fill="#1e3a8a" />
      {/* pocket square */}
      <rect x="25" y="84" width="8" height="6" rx="1" fill="#fef3c7" />

      {/* left arm – resting */}
      <motion.g style={{ originX: "28px", originY: "90px" }}
        animate={phase === "idle" ? { rotate: [0, -3, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity }}>
        <rect x="14" y="90" width="16" height="36" rx="7" fill="#1e40af" />
        <circle cx="22" cy="128" r="8" fill="#fcd5a8" />
      </motion.g>

      {/* right arm – holding payslip when done */}
      <motion.g style={{ originX: "72px", originY: "90px" }}
        animate={holding ? { rotate: [-35, -30, -35] } : { rotate: [0, 3, 0] }}
        transition={{ duration: holding ? 1.5 : 3, repeat: Infinity, ease: "easeInOut" }}>
        <rect x="70" y="86" width="16" height="36" rx="7" fill="#1e40af" />
        <circle cx="78" cy="124" r="8" fill="#fcd5a8" />
        {holding && (
          <g>
            <rect x="62" y="68" width="30" height="22" rx="3" fill="#fef9c3" />
            <rect x="62" y="68" width="30" height="5"  rx="2" fill="#fbbf24" />
            <line x1="66" y1="77" x2="88" y2="77" stroke="#d97706" strokeWidth="1.2" />
            <line x1="66" y1="81" x2="88" y2="81" stroke="#d97706" strokeWidth="1.2" />
            <line x1="66" y1="85" x2="80" y2="85" stroke="#d97706" strokeWidth="1.2" />
            <text x="77" y="73.5" textAnchor="middle" fontSize="4.5" fill="#92400e" fontWeight="bold">SLIP GAJI</text>
          </g>
        )}
      </motion.g>

      {/* head */}
      <motion.g style={{ originX: "50px", originY: "55px" }}
        animate={worried ? { rotate: [-3, 3, -3] } : { rotate: [0, 1.5, 0] }}
        transition={{ duration: worried ? 0.7 : 4, repeat: Infinity, ease: "easeInOut" }}>
        <circle cx="50" cy="42" r="24" fill="#fcd5a8" />
        {/* hair */}
        <ellipse cx="50" cy="20" rx="22" ry="10" fill="#1e293b" />
        <ellipse cx="30" cy="34" rx="8"  ry="16" fill="#1e293b" />
        <ellipse cx="70" cy="34" rx="8"  ry="16" fill="#1e293b" />
        {/* parting */}
        <path d="M 50 18 Q 50 26 46 34" stroke="#374151" strokeWidth="2" fill="none" />
        {/* glasses */}
        <rect x="30" y="38" width="16" height="12" rx="5" fill="none" stroke="#374151" strokeWidth="2" />
        <rect x="54" y="38" width="16" height="12" rx="5" fill="none" stroke="#374151" strokeWidth="2" />
        <line x1="46" y1="44" x2="54" y2="44" stroke="#374151" strokeWidth="1.8" />
        <line x1="22" y1="42" x2="30" y2="42" stroke="#374151" strokeWidth="1.5" />
        <line x1="70" y1="42" x2="78" y2="42" stroke="#374151" strokeWidth="1.5" />
        {/* eyes behind glasses */}
        <circle cx="38" cy="44" r="3.5" fill="#1e293b" />
        <circle cx="62" cy="44" r="3.5" fill="#1e293b" />
        <circle cx="39" cy="43" r="1.2" fill="white" />
        <circle cx="63" cy="43" r="1.2" fill="white" />
        {/* cheeks */}
        <ellipse cx="34" cy="53" rx="5" ry="3" fill="#f87171" opacity={worried ? 0.7 : 0.35} />
        <ellipse cx="66" cy="53" rx="5" ry="3" fill="#f87171" opacity={worried ? 0.7 : 0.35} />
        {/* mouth */}
        {worried
          ? <path d="M 40 61 Q 50 56 60 61" stroke="#b91c1c" strokeWidth="2" fill="none" strokeLinecap="round" />
          : happy
          ? <path d="M 40 60 Q 50 68 60 60" stroke="#c2410c" strokeWidth="2" fill="none" strokeLinecap="round" />
          : <path d="M 41 60 Q 50 64 59 60" stroke="#c2410c" strokeWidth="1.8" fill="none" strokeLinecap="round" />}
        {/* sweat drop if worried */}
        {worried && (
          <motion.ellipse cx="74" cy="40" rx="3" ry="5" fill="#93c5fd" opacity={0.8}
            animate={{ y: [0, 6, 0] }} transition={{ duration: 1.2, repeat: Infinity }} />
        )}
      </motion.g>
    </svg>
  );
};

/* ════════════════════════════════════════════════════════
   DESK SVG
════════════════════════════════════════════════════════ */
const DeskSVG = () => (
  <svg width="100%" height="52" viewBox="0 0 360 52" preserveAspectRatio="none" fill="none">
    {/* desk top */}
    <rect x="0" y="0"  width="360" height="14" rx="4" fill="#92400e" />
    <rect x="0" y="14" width="360" height="32" rx="0" fill="#78350f" />
    {/* desk edge highlight */}
    <rect x="0" y="0" width="360" height="3" rx="2" fill="#fcd34d" opacity="0.25" />
    {/* monitor */}
    <rect x="220" y="-60" width="90" height="58" rx="6" fill="#0f172a" />
    <rect x="224" y="-56" width="82" height="50" rx="4" fill="#0c4a6e" opacity="0.5" />
    <rect x="226" y="-54" width="78" height="46" rx="3" fill="#0ea5e9" opacity="0.12" />
    {/* screen content */}
    <text x="265" y="-38" textAnchor="middle" fontSize="7" fill="#38bdf8" fontWeight="bold">APLIKASI PAJAK</text>
    <line x1="234" y1="-30" x2="296" y2="-30" stroke="#38bdf8" strokeWidth="0.8" opacity="0.5" />
    <line x1="234" y1="-22" x2="280" y2="-22" stroke="#38bdf8" strokeWidth="0.8" opacity="0.4" />
    <line x1="234" y1="-14" x2="290" y2="-14" stroke="#38bdf8" strokeWidth="0.8" opacity="0.4" />
    {/* monitor stand */}
    <rect x="257" y="-2" width="16" height="6" rx="2" fill="#1e293b" />
    <rect x="248" y="4"  width="34" height="4" rx="2" fill="#1e293b" />
    {/* keyboard */}
    <rect x="215" y="6" width="60" height="10" rx="3" fill="#1e293b" />
    {[0,1,2,3,4].map(i=>(
      <rect key={i} x={219+i*11} y="8" width="9" height="3" rx="1" fill="#334155" />
    ))}
    {/* papers on desk */}
    <rect x="30" y="-10" width="45" height="24" rx="2" fill="#f1f5f9" transform="rotate(-4 30 -10)" />
    <rect x="36" y="-4"  width="45" height="24" rx="2" fill="#e2e8f0" transform="rotate(2 36 -4)" />
    <line x1="33" y1="-4" x2="66" y2="-4" stroke="#cbd5e1" strokeWidth="1" />
    <line x1="33" y1="0"  x2="66" y2="0"  stroke="#cbd5e1" strokeWidth="1" />
    <line x1="33" y1="4"  x2="60" y2="4"  stroke="#cbd5e1" strokeWidth="1" />
    {/* pen */}
    <line x1="86" y1="-6" x2="80" y2="14" stroke="#1e40af" strokeWidth="3" strokeLinecap="round" />
    <polygon points="80,14 78,18 84,15" fill="#fbbf24" />
    {/* coffee mug */}
    <rect x="145" y="-12" width="22" height="26" rx="5" fill="#7c3aed" />
    <ellipse cx="156" cy="-12" rx="11" ry="4" fill="#9333ea" />
    <ellipse cx="156" cy="-11" rx="9"  ry="3" fill="#c4b5fd" opacity="0.4" />
    <path d="M 167 -4 Q 175 -4 175 2 Q 175 8 167 8" stroke="#7c3aed" strokeWidth="3" fill="none" />
    <text x="156" y="4" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">☕</text>
    {/* desk legs */}
    <rect x="10"  y="14" width="12" height="36" rx="3" fill="#6b3a1f" />
    <rect x="338" y="14" width="12" height="36" rx="3" fill="#6b3a1f" />
  </svg>
);

/* ════════════════════════════════════════════════════════
   SLIP GAJI MODAL
════════════════════════════════════════════════════════ */
const SlipGaji = ({
  profesi, gajiBrutoTahun, ptkpNilai, pkp, pphTahun, gajiBersihTahun, onClose,
}: {
  profesi: string; gajiBrutoTahun: number; ptkpNilai: number;
  pkp: number; pphTahun: number; gajiBersihTahun: number; onClose: () => void;
}) => {
  const kenaPajak = pkp > 0;
  const pphBulan  = pphTahun / 12;
  const brutoMbl  = gajiBrutoTahun / 12;
  const bersihMbl = gajiBersihTahun / 12;
  const pctPph    = gajiBrutoTahun > 0 ? (pphTahun / gajiBrutoTahun) * 100 : 0;

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="relative max-w-sm w-full"
        initial={{ y: -100, scale: 0.6, rotate: -5 }}
        animate={{ y: 0, scale: 1, rotate: 0 }}
        exit={{ y: 100, scale: 0.6 }}
        transition={{ type: "spring", damping: 16, stiffness: 180 }}>

        {/* ── AMPLOP / envelope top ── */}
        <div className="h-6 rounded-t-2xl overflow-hidden relative"
          style={{ background: kenaPajak ? "linear-gradient(90deg,#7f1d1d,#dc2626)" : "linear-gradient(90deg,#14532d,#16a34a)" }}>
          <div className="absolute inset-x-0 bottom-0 flex justify-center">
            <div className="w-0 h-0"
              style={{ borderLeft: "150px solid transparent", borderRight: "150px solid transparent",
                       borderTop: kenaPajak ? "24px solid #dc2626" : "24px solid #16a34a" }} />
          </div>
        </div>

        <div className="bg-white shadow-2xl" style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.6)" }}>
          {/* header */}
          <div className="py-4 px-5 text-center"
            style={{ background: kenaPajak ? "linear-gradient(135deg,#7f1d1d,#b91c1c)" : "linear-gradient(135deg,#14532d,#15803d)" }}>
            <p className="text-white font-black text-base tracking-widest">📄 SLIP GAJI RESMI</p>
            <p className="text-white/70 text-[10px] mt-0.5">PT. Numatik Indonesia — Periode 2024</p>
          </div>

          <div className="px-5 pt-4 pb-2 font-mono text-xs">
            {/* employee info */}
            <div className="flex justify-between mb-3 pb-3 border-b border-dashed border-gray-300">
              <div>
                <p className="text-gray-400 text-[9px]">Nama Pegawai</p>
                <p className="text-gray-800 font-bold">{profesi}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-[9px]">Status Pajak</p>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${kenaPajak ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                  {kenaPajak ? "🔴 KENA PPh" : "🟢 BEBAS PAJAK"}
                </span>
              </div>
            </div>

            {/* monthly section */}
            <p className="text-gray-500 font-bold text-[9px] tracking-widest mb-2">PER BULAN</p>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Gaji Bruto</span>
              <span className="text-gray-800 font-semibold">{fmt(brutoMbl)}</span>
            </div>
            <div className="flex justify-between mb-1" style={{ color: kenaPajak ? "#b91c1c" : "#15803d" }}>
              <span className="font-semibold">PPh 21 dipotong</span>
              <span className="font-bold">- {fmt(pphBulan)}</span>
            </div>
            <div className="flex justify-between mb-3 pb-3 border-b border-dashed border-gray-300">
              <span className="text-gray-800 font-bold">Gaji Bersih Diterima</span>
              <span className="font-black text-gray-900">{fmt(bersihMbl)}</span>
            </div>

            {/* yearly section */}
            <p className="text-gray-500 font-bold text-[9px] tracking-widest mb-2">PERHITUNGAN TAHUNAN</p>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Penghasilan Bruto</span>
              <span className="font-semibold text-gray-800">{fmt(gajiBrutoTahun)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">PTKP (batas bebas pajak)</span>
              <span className="font-semibold text-blue-600">- {fmt(ptkpNilai)}</span>
            </div>
            <div className="flex justify-between mb-1 pb-2 border-b border-dashed border-gray-200">
              <span className={kenaPajak ? "text-red-700 font-bold" : "text-green-700 font-bold"}>
                PKP (Penghasilan Kena Pajak)
              </span>
              <span className={kenaPajak ? "text-red-700 font-bold" : "text-green-700 font-bold"}>
                {fmt(pkp)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className={kenaPajak ? "text-red-700 font-black" : "text-green-700 font-black"}>
                PPh Terutang ({tarifLabel(pkp)})
              </span>
              <span className={kenaPajak ? "text-red-700 font-black" : "text-green-700 font-black"}>
                {fmt(pphTahun)}
              </span>
            </div>

            {/* visual bar */}
            {kenaPajak && (
              <div className="mb-3">
                <div className="flex h-5 rounded-lg overflow-hidden border border-gray-200 text-[9px] font-bold">
                  <div className="flex items-center justify-center text-white bg-green-600 transition-all duration-700"
                    style={{ width: `${100 - pctPph}%` }}>
                    {100 - pctPph > 15 ? `Bersih ${(100 - pctPph).toFixed(1)}%` : ""}
                  </div>
                  <div className="flex items-center justify-center text-white bg-red-600 transition-all duration-700"
                    style={{ width: `${pctPph}%` }}>
                    {pctPph > 8 ? `PPh ${pctPph.toFixed(1)}%` : ""}
                  </div>
                </div>
              </div>
            )}

            {!kenaPajak && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-green-50 border border-green-200">
                <p className="text-green-700 font-black text-[10px]">✅ BEBAS PAJAK!</p>
                <p className="text-green-600 text-[9px] mt-0.5">
                  Penghasilan kamu di bawah PTKP (Rp {(ptkpNilai/12).toLocaleString("id-ID")}/bln).
                  PPh = Rp 0.
                </p>
              </div>
            )}

            <div className="border-t border-dashed border-gray-300 mt-2 mb-3 pt-2">
              <div className="flex justify-between text-sm font-black text-gray-900">
                <span>GAJI BERSIH / TAHUN</span>
                <span style={{ color: kenaPajak ? "#b91c1c" : "#15803d" }}>{fmt(gajiBersihTahun)}</span>
              </div>
            </div>

            {/* stamp-like watermark */}
            <div className="flex justify-center mb-3">
              <div className={`border-4 rounded-lg px-4 py-1 font-black text-lg tracking-widest opacity-60 rotate-[-12deg]`}
                style={{ borderColor: kenaPajak ? "#b91c1c" : "#15803d", color: kenaPajak ? "#b91c1c" : "#15803d" }}>
                {kenaPajak ? "KENA PPh" : "BEBAS PAJAK"}
              </div>
            </div>

            <p className="text-[9px] text-gray-400 text-center">
              Dokumen resmi. Diterbitkan sistem otomatis NUMATIK.
            </p>
          </div>
        </div>

        {/* torn bottom */}
        <div className="relative h-4 bg-white overflow-hidden">
          <svg width="100%" height="16" viewBox="0 0 320 16" preserveAspectRatio="none">
            <path d="M0,0 Q8,16 16,8 Q24,0 32,8 Q40,16 48,8 Q56,0 64,8 Q72,16 80,8 Q88,0 96,8 Q104,16 112,8 Q120,0 128,8 Q136,16 144,8 Q152,0 160,8 Q168,16 176,8 Q184,0 192,8 Q200,16 208,8 Q216,0 224,8 Q232,16 240,8 Q248,0 256,8 Q264,16 272,8 Q280,0 288,8 Q296,16 304,8 Q312,0 320,8 L320,0 Z" fill="white" />
          </svg>
        </div>

        <motion.button onClick={onClose}
          className="w-full mt-3 py-3 rounded-2xl font-bold text-sm text-white shadow-xl"
          style={{ background: kenaPajak ? "linear-gradient(90deg,#b91c1c,#dc2626)" : "linear-gradient(90deg,#15803d,#16a34a)" }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          ✅ Tutup Slip Gaji
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════════
   FLOATING MONEY / TAX COINS
════════════════════════════════════════════════════════ */
const FloatEmoji = ({ emoji, x, y, delay }: { emoji: string; x: number; y: number; delay: number }) => (
  <motion.div className="absolute pointer-events-none select-none text-xl z-20" style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0, y: 0 }}
    animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.3, 1, 0.5], y: [0, -30, -70, -110] }}
    transition={{ duration: 1.8, delay, ease: "easeOut" }}>
    {emoji}
  </motion.div>
);

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════ */
export default function KantorPPh() {
  const [gajiBruto, setGajiBruto]   = useState("");
  const [ptkpIdx, setPtkpIdx]       = useState(0);
  const [periode, setPeriode]       = useState<"bulan" | "tahun">("bulan");
  const [phase, setPhase]           = useState<"idle" | "anim" | "done-clear" | "done-tax">("idle");
  const [showSlip, setShowSlip]     = useState(false);
  const [result, setResult]         = useState<null | { brutoTahun: number; pkp: number; pphTahun: number; bersihTahun: number }>(null);
  const [floats, setFloats]         = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);
  const [selectedProfesi, setSelectedProfesi] = useState<number | null>(null);

  const ptkp    = PTKP_LIST[ptkpIdx];
  const gajiNum = parseFloat(gajiBruto.replace(/[^0-9.]/g, "")) || 0;
  const brutoTahun  = periode === "bulan" ? gajiNum * 12 : gajiNum;
  const pkpPreview  = Math.max(0, brutoTahun - ptkp.nilai);
  const pphPreview  = hitungPPh(pkpPreview);
  const bersihTahun = brutoTahun - pphPreview;
  const kenaPajak   = pkpPreview > 0;
  const canGo       = gajiNum > 0;

  const spawnFloats = (clear: boolean) => {
    const emojis = clear ? ["💰","💵","🪙","✨","🎉"] : ["💰","📋","💸","🏛️","📊"];
    const items = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: 40 + Math.random() * 200,
      y: 20 + Math.random() * 60,
    }));
    setFloats(items);
    setTimeout(() => setFloats([]), 2400);
  };

  const handleHitung = () => {
    if (!canGo) return;
    playPopSound();
    setPhase("anim");

    setTimeout(() => {
      const r = {
        brutoTahun, pkp: pkpPreview, pphTahun: pphPreview, bersihTahun,
      };
      setResult(r);
      const clear = pkpPreview === 0;
      setPhase(clear ? "done-clear" : "done-tax");
      spawnFloats(clear);
    }, 1400);
  };

  const handleLihatSlip = () => {
    playPopSound();
    setShowSlip(true);
  };

  const handleReset = () => {
    playPopSound();
    setGajiBruto("");
    setResult(null);
    setPhase("idle");
    setShowSlip(false);
    setSelectedProfesi(null);
  };

  const selectProfesi = (idx: number) => {
    playPopSound();
    setSelectedProfesi(idx);
    setGajiBruto(String(PROFESI[idx].gaji));
    setPeriode("bulan");
    setResult(null);
    setPhase("idle");
  };

  /* quick-preview when user types */
  const brutoMonthly = periode === "bulan" ? gajiNum : gajiNum / 12;

  return (
    <div className="rounded-2xl overflow-hidden border-2"
      style={{ background: "linear-gradient(135deg,#0a1628 0%,#0f2040 50%,#080e1e 100%)", borderColor: "rgba(99,102,241,0.5)", boxShadow: "0 0 50px rgba(99,102,241,0.15)" }}>

      {/* ── Header ── */}
      <div className="px-5 py-3 flex items-center gap-3"
        style={{ background: "linear-gradient(90deg,rgba(99,102,241,0.3),rgba(16,185,129,0.1))" }}>
        <span className="text-2xl">🏢</span>
        <div>
          <p className="font-body font-bold text-indigo-200 text-sm">Kantor PT. Numatik – Simulasi PPh 21</p>
          <p className="font-body text-[10px] text-indigo-400/60">Masukkan gaji → lihat apakah kena pajak!</p>
        </div>
        <span className="ml-auto bg-indigo-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">ANIMASI</span>
      </div>

      {/* ── Office scene ── */}
      <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden" style={{ height: 220, background: "linear-gradient(180deg,#eef2ff 0%,#e0e7ff 50%,#c7d2fe 100%)" }}>
        {/* Wall */}
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="absolute top-0 border-r border-indigo-200/30" style={{ left: `${i * 16.67}%`, height: "55%", width: 1 }} />
        ))}
        {/* Window */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-36 h-24 rounded-t-2xl overflow-hidden border-4 border-indigo-200" style={{ background: "linear-gradient(180deg,#bae6fd,#7dd3fc)" }}>
          {/* clouds */}
          <motion.div className="absolute" style={{ top: 10, left: -10 }}
            animate={{ x: [0, 60, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
            <div className="w-20 h-8 bg-white/80 rounded-full blur-sm" />
          </motion.div>
          <motion.div className="absolute" style={{ top: 30, left: 30 }}
            animate={{ x: [0, -50, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "linear" }}>
            <div className="w-14 h-6 bg-white/60 rounded-full blur-sm" />
          </motion.div>
          {/* sun */}
          <div className="absolute top-2 right-4 w-10 h-10 bg-yellow-300 rounded-full blur-sm opacity-70" />
        </div>
        {/* Window sill */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-40 h-3 bg-indigo-100 rounded" />
        {/* Company sign */}
        <div className="absolute top-3 left-4 px-2 py-1 rounded border border-indigo-300 bg-indigo-50/80">
          <p className="text-indigo-700 font-black text-[8px] tracking-widest">🏛️ KANTOR PAJAK</p>
        </div>

        {/* PPh status badge */}
        <AnimatePresence>
          {phase === "done-clear" && (
            <motion.div className="absolute top-4 right-4 px-3 py-2 rounded-xl shadow-lg text-center"
              style={{ background: "linear-gradient(135deg,#14532d,#16a34a)", border: "2px solid #4ade80" }}
              initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}
              transition={{ type: "spring", damping: 12 }}>
              <p className="text-white font-black text-sm">🎉 BEBAS PAJAK!</p>
              <p className="text-green-200 text-[9px]">PPh = Rp 0</p>
            </motion.div>
          )}
          {phase === "done-tax" && (
            <motion.div className="absolute top-4 right-4 px-3 py-2 rounded-xl shadow-lg text-center"
              style={{ background: "linear-gradient(135deg,#7f1d1d,#b91c1c)", border: "2px solid #f87171" }}
              initial={{ scale: 0, rotate: 15 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}
              transition={{ type: "spring", damping: 12 }}>
              <p className="text-white font-black text-sm">📋 KENA PPh!</p>
              <p className="text-red-200 text-[9px]">- {fmt(result?.pphTahun ?? 0)}/thn</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Worker */}
        <div className="absolute bottom-14 left-6">
          <WorkerSVG phase={phase} />
        </div>

        {/* Speech bubble */}
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div key="idle"
              className="absolute text-[10px] font-body bg-white border-2 border-indigo-300 rounded-2xl rounded-bl-none px-3 py-2 shadow-lg"
              style={{ bottom: 100, left: 110, maxWidth: 180 }}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <p className="text-indigo-700 font-bold">💼 Halo! Saya karyawan.</p>
              <p className="text-gray-500 text-[9px] mt-0.5">Masukkan gaji saya untuk cek apakah kena PPh!</p>
            </motion.div>
          )}
          {phase === "anim" && (
            <motion.div key="anim"
              className="absolute text-[10px] font-body bg-white border-2 border-blue-300 rounded-2xl rounded-bl-none px-3 py-2 shadow-lg"
              style={{ bottom: 100, left: 110, maxWidth: 170 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-blue-700 font-bold">🧮 Sedang dihitung...</p>
              <div className="flex gap-1 mt-1">
                {[0,1,2].map(i => (
                  <motion.div key={i} className="w-2 h-2 rounded-full bg-blue-400"
                    animate={{ opacity: [0.3,1,0.3] }} transition={{ duration: 0.7, delay: i*0.22, repeat: Infinity }} />
                ))}
              </div>
            </motion.div>
          )}
          {phase === "done-clear" && (
            <motion.div key="clear"
              className="absolute text-[10px] font-body bg-white border-2 border-green-300 rounded-2xl rounded-bl-none px-3 py-2 shadow-lg"
              style={{ bottom: 100, left: 110, maxWidth: 185 }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="text-green-700 font-bold">🎊 Asyik, bebas pajak!</p>
              <p className="text-gray-500 text-[9px]">Gaji saya di bawah PTKP, jadi PPh = Rp 0.</p>
            </motion.div>
          )}
          {phase === "done-tax" && (
            <motion.div key="tax"
              className="absolute text-[10px] font-body bg-white border-2 border-red-300 rounded-2xl rounded-bl-none px-3 py-2 shadow-lg"
              style={{ bottom: 100, left: 110, maxWidth: 185 }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="text-red-700 font-bold">😅 Kena pajak nih...</p>
              <p className="text-gray-500 text-[9px]">Gaji di atas PTKP. PPh dipotong setiap bulan!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating emojis */}
        {floats.map(f => <FloatEmoji key={f.id} emoji={f.emoji} x={f.x} y={f.y} delay={Math.random() * 0.5} />)}

        {/* Desk */}
        <div className="absolute bottom-0 left-0 right-0" style={{ paddingTop: 20 }}>
          <DeskSVG />
        </div>
      </div>

      {/* ── Input section ── */}
      <div className="px-4 mt-4 space-y-3">

        {/* Preset professions */}
        <div>
          <p className="font-body text-xs text-indigo-300/70 mb-2">👔 Pilih profesi (opsional):</p>
          <div className="grid grid-cols-3 gap-2">
            {PROFESI.map((p, idx) => (
              <motion.button key={idx} onClick={() => selectProfesi(idx)}
                className="rounded-xl p-2 text-left transition-all"
                style={selectedProfesi === idx
                  ? { background: "rgba(99,102,241,0.3)", border: "1.5px solid rgba(129,140,248,0.8)" }
                  : { background: "rgba(99,102,241,0.07)", border: "1.5px solid rgba(99,102,241,0.2)" }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
                <div className="text-xl mb-0.5">{p.emoji}</div>
                <p className="font-body text-[9px] font-bold text-white/80 leading-tight">{p.nama}</p>
                <p className="font-body text-[9px] text-indigo-300">{fmtM(p.gaji)}/bln</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Manual input row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-body text-xs text-yellow-300 font-semibold">💰 Gaji / Penghasilan</label>
            <input type="number" value={gajiBruto}
              onChange={e => { setGajiBruto(e.target.value); setResult(null); setPhase("idle"); setSelectedProfesi(null); }}
              placeholder="contoh: 6000000"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white font-body focus:outline-none"
              style={{ background: "rgba(251,191,36,0.08)", border: "1.5px solid rgba(251,191,36,0.3)" }} />
          </div>
          <div className="space-y-1">
            <label className="font-body text-xs text-blue-300 font-semibold">📅 Periode</label>
            <div className="flex gap-2 h-[42px]">
              {(["bulan","tahun"] as const).map(s => (
                <button key={s} onClick={() => { setPeriode(s); setResult(null); setPhase("idle"); playPopSound(); }}
                  className="flex-1 rounded-lg text-xs font-body font-bold transition-all"
                  style={periode === s
                    ? { background: "rgba(99,102,241,0.35)", border: "1.5px solid rgba(129,140,248,0.8)", color: "#a5b4fc" }
                    : { background: "rgba(99,102,241,0.06)", border: "1.5px solid rgba(99,102,241,0.2)", color: "rgba(165,180,252,0.4)" }}>
                  {s.charAt(0).toUpperCase()+s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PTKP selector */}
        <div className="space-y-1">
          <label className="font-body text-xs text-green-300 font-semibold">👨‍👩‍👧 Status PTKP (Batas Bebas Pajak)</label>
          <select value={ptkpIdx}
            onChange={e => { setPtkpIdx(Number(e.target.value)); setResult(null); setPhase("idle"); playPopSound(); }}
            className="w-full rounded-lg px-3 py-2.5 text-sm text-white font-body focus:outline-none appearance-none cursor-pointer"
            style={{ background: "rgba(34,197,94,0.08)", border: "1.5px solid rgba(34,197,94,0.3)" }}>
            {PTKP_LIST.map((p, i) => (
              <option key={i} value={i} className="bg-slate-900 text-white">{p.label} ({fmt(p.nilai)}/thn)</option>
            ))}
          </select>
        </div>

        {/* Live preview bar */}
        <AnimatePresence>
          {canGo && (
            <motion.div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(99,102,241,0.3)" }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="px-4 py-3" style={{ background: "rgba(0,0,0,0.35)" }}>
                <p className="font-body text-[10px] text-indigo-300 font-semibold mb-2">📊 Preview Perhitungan (per tahun):</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {[
                    { label: "Gaji Bruto/thn", val: fmt(brutoTahun), color: "text-yellow-300" },
                    { label: "PTKP",           val: fmt(ptkp.nilai),  color: "text-blue-300"   },
                    { label: "PKP",            val: fmt(pkpPreview),  color: kenaPajak ? "text-red-300"   : "text-green-300" },
                    { label: "PPh terutang",   val: fmt(pphPreview),  color: kenaPajak ? "text-red-400"   : "text-green-400" },
                  ].map(it => (
                    <div key={it.label} className="rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="font-body text-[9px] text-white/40">{it.label}</p>
                      <p className={`font-body text-xs font-bold ${it.color}`}>{it.val}</p>
                    </div>
                  ))}
                </div>

                {/* progress bar gaji bersih vs PPh */}
                <div className="space-y-1">
                  <div className="flex h-5 rounded-lg overflow-hidden text-[9px] font-bold">
                    <motion.div className="flex items-center justify-center text-white"
                      style={{ background: "#16a34a" }}
                      initial={{ width: 0 }}
                      animate={{ width: brutoTahun > 0 ? `${((brutoTahun - pphPreview)/brutoTahun*100).toFixed(1)}%` : "100%" }}
                      transition={{ duration: 0.8 }}>
                      {brutoTahun > 0 && (brutoTahun - pphPreview)/brutoTahun > 0.18 ? `Bersih` : ""}
                    </motion.div>
                    {kenaPajak && (
                      <motion.div className="flex items-center justify-center text-white"
                        style={{ background: "#dc2626" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(pphPreview/brutoTahun*100).toFixed(1)}%` }}
                        transition={{ duration: 0.8 }}>
                        {pphPreview/brutoTahun > 0.08 ? "PPh" : ""}
                      </motion.div>
                    )}
                  </div>
                  <div className="flex justify-between font-body text-[9px]">
                    <span className="text-green-400">Bersih: {fmt(bersihTahun)}</span>
                    <span className={kenaPajak ? "text-red-400" : "text-green-400"}>PPh: {fmt(pphPreview)}</span>
                  </div>
                </div>

                {/* status badge */}
                <div className={`mt-2 px-3 py-1.5 rounded-lg text-center font-black font-body text-xs ${kenaPajak ? "bg-red-900/40 text-red-300 border border-red-700/50" : "bg-green-900/40 text-green-300 border border-green-700/50"}`}>
                  {kenaPajak
                    ? `🔴 KENA PPh — Gaji melebihi PTKP sebesar ${fmt(pkpPreview)}`
                    : `🟢 BEBAS PAJAK — Gaji di bawah PTKP (${fmt(ptkp.nilai)}/thn)`}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Action buttons ── */}
      <div className="px-4 pb-4 pt-3 flex gap-3">
        <motion.button onClick={handleHitung} disabled={!canGo || phase === "anim"}
          className="flex-1 font-body font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(90deg,#4f46e5,#6d28d9)", color: "white" }}
          whileHover={{ scale: canGo ? 1.02 : 1 }} whileTap={{ scale: canGo ? 0.97 : 1 }}>
          {phase === "anim"
            ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⚙️</motion.span> Menghitung...</>
            : <>🧮 Hitung PPh</>}
        </motion.button>

        {(phase === "done-clear" || phase === "done-tax") && (
          <motion.button onClick={handleLihatSlip}
            className="px-4 rounded-xl font-body text-sm py-3 font-bold transition-all"
            style={{ background: "linear-gradient(90deg,#d97706,#f59e0b)", color: "#1a0a00" }}
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            📄 Slip Gaji
          </motion.button>
        )}

        <motion.button onClick={handleReset}
          className="px-4 rounded-xl font-body text-sm py-3 transition-all"
          style={{ background: "rgba(99,102,241,0.1)", border: "1.5px solid rgba(99,102,241,0.25)", color: "rgba(165,180,252,0.7)" }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          🔄
        </motion.button>
      </div>

      {/* ── Slip Gaji Modal (portal → renders outside transformed parents) ── */}
      {createPortal(
        <AnimatePresence>
          {showSlip && result && (
            <SlipGaji
              key="slip-gaji"
              profesi={selectedProfesi !== null ? PROFESI[selectedProfesi].nama : "Karyawan"}
              gajiBrutoTahun={result.brutoTahun}
              ptkpNilai={ptkp.nilai}
              pkp={result.pkp}
              pphTahun={result.pphTahun}
              gajiBersihTahun={result.bersihTahun}
              onClose={() => { setShowSlip(false); playPopSound(); }}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
