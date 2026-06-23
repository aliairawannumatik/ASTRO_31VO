import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playPopSound } from "@/hooks/useAudio";

const fmt = (n: number) =>
  "Rp " + Math.round(n).toLocaleString("id-ID");

/* ═══════════════════════════════════════════════════════════
   MENU DATA
═══════════════════════════════════════════════════════════ */
const MENU = [
  { id: 1, nama: "Nasi Goreng Spesial", emoji: "🍳", harga: 28000, kategori: "Makanan" },
  { id: 2, nama: "Ayam Bakar Madu",     emoji: "🍗", harga: 35000, kategori: "Makanan" },
  { id: 3, nama: "Mie Goreng Seafood",  emoji: "🍜", harga: 32000, kategori: "Makanan" },
  { id: 4, nama: "Pizza Mini",          emoji: "🍕", harga: 45000, kategori: "Makanan" },
  { id: 5, nama: "Es Teh Manis",        emoji: "🧊", harga: 8000,  kategori: "Minuman" },
  { id: 6, nama: "Jus Jeruk Segar",     emoji: "🍊", harga: 15000, kategori: "Minuman" },
  { id: 7, nama: "Kopi Susu",           emoji: "☕", harga: 20000, kategori: "Minuman" },
  { id: 8, nama: "Kerupuk Udang",       emoji: "🦐", harga: 5000,  kategori: "Cemilan" },
];

/* ═══════════════════════════════════════════════════════════
   WAITRESS SVG – side view, holding notepad
═══════════════════════════════════════════════════════════ */
const WaitressSVG = ({
  phase,
}: {
  phase: "idle" | "taking" | "counting" | "presenting";
}) => {
  const waving    = phase === "idle";
  const nodding   = phase === "taking";
  const happy     = phase === "presenting";

  return (
    <svg width="90" height="160" viewBox="0 0 90 160" fill="none">
      {/* ── legs ── */}
      <rect x="28" y="120" width="13" height="32" rx="5" fill="#1e3a8a" />
      <rect x="49" y="120" width="13" height="32" rx="5" fill="#1e3a8a" />
      {/* shoes */}
      <ellipse cx="34" cy="152" rx="10" ry="5" fill="#0f172a" />
      <ellipse cx="55" cy="152" rx="10" ry="5" fill="#0f172a" />

      {/* ── skirt ── */}
      <path d="M 22 118 Q 45 130 68 118 L 65 100 Q 45 108 25 100 Z" fill="#7c3aed" />

      {/* ── body / blouse ── */}
      <rect x="25" y="78" width="40" height="44" rx="8" fill="#ec4899" />
      {/* collar */}
      <path d="M 38 78 L 45 90 L 52 78" fill="white" opacity="0.9" />
      {/* apron */}
      <rect x="33" y="82" width="24" height="36" rx="4" fill="white" opacity="0.25" />
      {/* name badge */}
      <rect x="38" y="87" width="18" height="10" rx="2" fill="white" opacity="0.85" />
      <text x="47" y="94.5" textAnchor="middle" fontSize="5" fill="#7c3aed" fontWeight="bold">KASIR</text>

      {/* ── left arm (holding notepad) ── */}
      <motion.g
        animate={nodding ? { rotate: [-5, 5, -5] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
        style={{ originX: "24px", originY: "88px" }}
      >
        <ellipse cx="18" cy="96" rx="8" ry="6" fill="#ec4899" transform="rotate(-20 18 96)" />
        {/* notepad */}
        <rect x="2" y="88" width="22" height="28" rx="3" fill="#fef3c7" />
        <rect x="2" y="88" width="22" height="6"  rx="3" fill="#f59e0b" />
        <line x1="6"  y1="100" x2="20" y2="100" stroke="#d97706" strokeWidth="1.2" />
        <line x1="6"  y1="104" x2="20" y2="104" stroke="#d97706" strokeWidth="1.2" />
        <line x1="6"  y1="108" x2="16" y2="108" stroke="#d97706" strokeWidth="1.2" />
        <circle cx="3" cy="91" r="1.5" fill="#d97706" />
        <circle cx="3" cy="96" r="1.5" fill="#d97706" />
        <circle cx="3" cy="101" r="1.5" fill="#d97706" />
      </motion.g>

      {/* ── right arm (waving / resting) ── */}
      <motion.g
        animate={
          waving
            ? { rotate: [0, -30, 30, -20, 10, 0] }
            : happy
            ? { rotate: [0, -20, 0] }
            : { rotate: [0, -5, 0] }
        }
        transition={{
          duration: waving ? 1 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ originX: "66px", originY: "88px" }}
      >
        <ellipse cx="72" cy="96" rx="8" ry="6" fill="#ec4899" transform="rotate(20 72 96)" />
        <circle  cx="78" cy="92" r="7" fill="#fcd5a8" />
        {happy && (
          <text x="88" y="80" fontSize="14" textAnchor="middle">✨</text>
        )}
      </motion.g>

      {/* ── head ── */}
      <motion.g
        animate={nodding ? { rotate: [0, 8, -4, 0] } : {}}
        transition={{ duration: 0.6, repeat: Infinity }}
        style={{ originX: "45px", originY: "68px" }}
      >
        <circle cx="45" cy="48" r="22" fill="#fcd5a8" />
        {/* hair – bun style */}
        <ellipse cx="45" cy="28" rx="20" ry="12" fill="#92400e" />
        <ellipse cx="45" cy="20" rx="10" ry="8"  fill="#78350f" />
        <ellipse cx="30" cy="36" rx="8" ry="14"  fill="#92400e" />
        <ellipse cx="60" cy="36" rx="8" ry="14"  fill="#92400e" />
        {/* bun */}
        <circle cx="45" cy="18" r="8" fill="#78350f" />
        <circle cx="45" cy="18" r="5" fill="#92400e" />
        {/* eyes */}
        <ellipse cx="38" cy="46" rx="3"   ry="3.5" fill="#1e293b" />
        <ellipse cx="52" cy="46" rx="3"   ry="3.5" fill="#1e293b" />
        <circle  cx="39" cy="44.5" r="1.2" fill="white" />
        <circle  cx="53" cy="44.5" r="1.2" fill="white" />
        {/* lashes */}
        <line x1="35" y1="43" x2="33" y2="41" stroke="#1e293b" strokeWidth="1.2" />
        <line x1="38" y1="42" x2="37" y2="40" stroke="#1e293b" strokeWidth="1.2" />
        <line x1="49" y1="42" x2="48" y2="40" stroke="#1e293b" strokeWidth="1.2" />
        <line x1="52" y1="43" x2="54" y2="41" stroke="#1e293b" strokeWidth="1.2" />
        {/* cheeks */}
        <ellipse cx="33" cy="52" rx="5" ry="3" fill="#f87171" opacity="0.5" />
        <ellipse cx="57" cy="52" rx="5" ry="3" fill="#f87171" opacity="0.5" />
        {/* mouth */}
        {happy ? (
          <path d="M 38 57 Q 45 64 52 57" stroke="#c2410c" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M 39 57 Q 45 61 51 57" stroke="#c2410c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        )}
        {/* headband */}
        <path d="M 24 38 Q 45 26 66 38" stroke="#ec4899" strokeWidth="3" fill="none" />
        <circle cx="45" cy="26" r="4" fill="#f9a8d4" />
      </motion.g>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════
   COUNTER SVG
═══════════════════════════════════════════════════════════ */
const CounterSVG = () => (
  <svg width="100%" height="55" viewBox="0 0 360 55" preserveAspectRatio="none" fill="none">
    {/* counter body */}
    <rect x="0" y="10" width="360" height="45" rx="6" fill="#78350f" />
    <rect x="0" y="10" width="360" height="12" rx="6" fill="#92400e" />
    {/* glass panel */}
    <rect x="10" y="14" width="340" height="6" rx="2" fill="#fde68a" opacity="0.15" />
    {/* decorative strip */}
    <rect x="0" y="22" width="360" height="2" fill="#d97706" opacity="0.4" />
    {/* cash register suggestion */}
    <rect x="280" y="2" width="68" height="52" rx="5" fill="#1e293b" />
    <rect x="284" y="6"  width="60" height="30" rx="3" fill="#0f172a" />
    <rect x="286" y="8"  width="56" height="26" rx="2" fill="#0ea5e9" opacity="0.2" />
    <text x="314" y="25" textAnchor="middle" fontSize="8" fill="#38bdf8" fontWeight="bold">KASIR</text>
    {/* keypad */}
    {[0,1,2].map((row) =>
      [0,1,2].map((col) => (
        <rect key={`${row}-${col}`}
          x={288 + col * 14} y={38 + row * 5}
          width="11" height="4" rx="1"
          fill="#334155" />
      ))
    )}
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   RECEIPT PAPER
═══════════════════════════════════════════════════════════ */
const Receipt = ({
  items, ppnPct, onClose,
}: {
  items: { nama: string; qty: number; harga: number; emoji: string }[];
  ppnPct: number;
  onClose: () => void;
}) => {
  const subtotal = items.reduce((s, it) => s + it.harga * it.qty, 0);
  const ppnRp    = subtotal * (ppnPct / 100);
  const total    = subtotal + ppnRp;
  const now      = new Date();
  const jam      = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const tgl      = now.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative max-w-xs w-full"
        initial={{ y: -80, scale: 0.7 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 80, scale: 0.7 }}
        transition={{ type: "spring", damping: 18, stiffness: 200 }}
      >
        {/* receipt paper */}
        <div className="bg-white rounded-t-2xl overflow-hidden shadow-2xl" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
          {/* header strip */}
          <div className="py-4 px-5 text-center" style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}>
            <p className="text-white font-black text-base tracking-widest">🍽️ RESTORAN NUMATIK</p>
            <p className="text-white/70 text-[10px] mt-0.5">Jl. Matematika No. 7, Indonesia</p>
          </div>

          <div className="px-5 pt-3 pb-1 font-mono">
            <div className="flex justify-between text-[10px] text-gray-400 mb-3">
              <span>Tgl: {tgl}</span>
              <span>Pukul: {jam}</span>
              <span>No: #0042</span>
            </div>

            {/* divider */}
            <div className="border-t-2 border-dashed border-gray-300 mb-3" />

            {/* items */}
            {items.map((it, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between text-xs text-gray-700">
                  <span className="font-semibold">{it.emoji} {it.nama}</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 pl-2">
                  <span>{it.qty} x {fmt(it.harga)}</span>
                  <span className="font-semibold text-gray-700">{fmt(it.harga * it.qty)}</span>
                </div>
              </div>
            ))}

            <div className="border-t-2 border-dashed border-gray-300 mt-3 mb-2" />

            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Subtotal</span>
              <span className="font-semibold">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs mb-2" style={{ color: "#7c3aed" }}>
              <span className="font-semibold">PPN {ppnPct}%</span>
              <span className="font-bold">+ {fmt(ppnRp)}</span>
            </div>

            <div className="border-t-2 border-gray-400 mb-2" />
            <div className="flex justify-between text-sm font-black text-gray-900 mb-1">
              <span>TOTAL BAYAR</span>
              <span style={{ color: "#7c3aed" }}>{fmt(total)}</span>
            </div>

            <div className="border-t-2 border-dashed border-gray-300 mt-3 mb-3" />
            <p className="text-[9px] text-gray-400 text-center leading-relaxed">
              Harga sudah termasuk PPN {ppnPct}% sesuai UU Harmonisasi Perpajakan.
              Terima kasih telah makan di Restoran Numatik! 🙏
            </p>

            {/* barcode simulation */}
            <div className="flex justify-center mt-2 mb-3 gap-px">
              {Array.from({ length: 32 }, (_, i) => (
                <div key={i} className="bg-gray-800"
                  style={{ width: i % 3 === 0 ? 3 : 1.5, height: 28 }} />
              ))}
            </div>
          </div>
        </div>

        {/* torn edge */}
        <div className="relative h-4 bg-white overflow-hidden">
          <svg width="100%" height="16" viewBox="0 0 320 16" preserveAspectRatio="none">
            <path d="M0,0 Q10,16 20,8 Q30,0 40,8 Q50,16 60,8 Q70,0 80,8 Q90,16 100,8 Q110,0 120,8 Q130,16 140,8 Q150,0 160,8 Q170,16 180,8 Q190,0 200,8 Q210,16 220,8 Q230,0 240,8 Q250,16 260,8 Q270,0 280,8 Q290,16 300,8 Q310,0 320,8 L320,0 Z"
              fill="white" />
          </svg>
        </div>

        {/* close button */}
        <motion.button
          onClick={onClose}
          className="w-full mt-3 py-3 rounded-2xl font-bold text-sm text-white shadow-lg"
          style={{ background: "linear-gradient(90deg, #7c3aed, #ec4899)" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          ✅ Selesai Bayar
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════
   FLOATING LABEL
═══════════════════════════════════════════════════════════ */
const FloatLabel = ({ text, color }: { text: string; color: string }) => (
  <motion.div
    className={`absolute pointer-events-none font-black text-white text-xs px-2 py-1 rounded-full z-10 ${color}`}
    style={{ top: "30%", right: "30%" }}
    initial={{ opacity: 0, scale: 0, y: 0 }}
    animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0], y: [0, -30, -60, -90] }}
    transition={{ duration: 1.8, ease: "easeOut" }}
  >
    {text}
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
type OrderItem = { id: number; nama: string; emoji: string; harga: number; qty: number; kategori: string };

export default function RestoranPPN() {
  const [order, setOrder]           = useState<OrderItem[]>([]);
  const [ppnPct, setPpnPct]         = useState(11);
  const [customMode, setCustomMode] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [phase, setPhase]           = useState<"idle" | "taking" | "counting" | "presenting">("idle");
  const [showReceipt, setShowReceipt] = useState(false);
  const [floatKey, setFloatKey]     = useState(0);
  const [floatText, setFloatText]   = useState("");
  const [floatColor, setFloatColor] = useState("bg-green-500");
  const [activeKat, setActiveKat]   = useState<string>("Makanan");

  const PRESET_RATES = [10, 11, 12];
  const isCustomActive = !PRESET_RATES.includes(ppnPct) || customMode;

  const subtotal = order.reduce((s, it) => s + it.harga * it.qty, 0);
  const ppnRp    = subtotal * (ppnPct / 100);
  const total    = subtotal + ppnRp;

  const triggerFloat = (text: string, color: string) => {
    setFloatText(text);
    setFloatColor(color);
    setFloatKey((k) => k + 1);
  };

  const addItem = (item: typeof MENU[0]) => {
    playPopSound();
    setOrder((prev) => {
      const exist = prev.find((o) => o.id === item.id);
      if (exist) return prev.map((o) => o.id === item.id ? { ...o, qty: o.qty + 1 } : o);
      return [...prev, { ...item, qty: 1 }];
    });
    setPhase("taking");
    triggerFloat(`+${item.emoji}`, "bg-purple-500");
    setTimeout(() => setPhase("idle"), 1500);
  };

  const removeItem = (id: number) => {
    playPopSound();
    setOrder((prev) =>
      prev.map((o) => o.id === id ? { ...o, qty: o.qty - 1 } : o).filter((o) => o.qty > 0)
    );
  };

  const handleBayar = () => {
    if (order.length === 0) return;
    playPopSound();
    setPhase("counting");
    setTimeout(() => {
      setPhase("presenting");
      setTimeout(() => {
        setShowReceipt(true);
        triggerFloat("Struk siap! 🧾", "bg-green-500");
      }, 600);
    }, 1200);
  };

  const handleReset = () => {
    playPopSound();
    setOrder([]);
    setShowReceipt(false);
    setPhase("idle");
  };

  const kategoriList = ["Makanan", "Minuman", "Cemilan"];

  return (
    <div
      className="rounded-2xl overflow-hidden border-2"
      style={{
        background: "linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)",
        borderColor: "rgba(167,139,250,0.5)",
        boxShadow: "0 0 50px rgba(124,58,237,0.2)",
      }}
    >
      {/* ── Header ── */}
      <div
        className="px-5 py-3 flex items-center gap-3"
        style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.3), rgba(236,72,153,0.15))" }}
      >
        <span className="text-2xl">🍽️</span>
        <div>
          <p className="font-body font-bold text-purple-200 text-sm">Restoran Numatik – Simulasi PPN</p>
          <p className="font-body text-[10px] text-purple-400/60">Pesan makanan → lihat struk → hitung PPN!</p>
        </div>
        <span className="ml-auto bg-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">INTERAKTIF</span>
      </div>

      {/* ── Restaurant scene ── */}
      <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(180deg, #fdf2f8 0%, #fce7f3 40%, #f5f0ff 100%)" }}>
        {/* Wall decor */}
        <div className="absolute inset-0">
          {/* Tiles */}
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="absolute top-0 border-r border-pink-200/40" style={{ left: `${i * 12.5}%`, height: "40%", width: 1 }} />
          ))}
          {/* Lamps */}
          <div className="absolute top-2 left-1/4 w-1 h-6 bg-amber-400 rounded-full opacity-60" />
          <div className="absolute top-2 right-1/4 w-1 h-6 bg-amber-400 rounded-full opacity-60" />
          <div className="absolute top-2 left-1/4 -translate-x-4 w-8 h-3 bg-amber-200 rounded-full opacity-40 blur-sm" />
          <div className="absolute top-2 right-1/4 translate-x-4 w-8 h-3 bg-amber-200 rounded-full opacity-40 blur-sm" />
          {/* Menu board */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 rounded-lg px-4 py-1.5" style={{ background: "#7c3aed", border: "2px solid #a78bfa" }}>
            <p className="text-white text-[9px] font-black tracking-wider">🌟 MENU HARI INI</p>
          </div>
          {/* Decorative flowers */}
          <div className="absolute bottom-20 left-4 text-lg opacity-80">🌸</div>
          <div className="absolute bottom-20 right-4 text-lg opacity-80">🌺</div>
        </div>

        {/* Scene content */}
        <div className="relative flex items-end justify-between px-4 pt-14 pb-0">
          {/* Waitress */}
          <div className="relative flex-shrink-0">
            <WaitressSVG phase={phase} />
            {/* Speech bubble */}
            <AnimatePresence mode="wait">
              {phase === "idle" && order.length === 0 && (
                <motion.div
                  key="welcome"
                  className="absolute -top-2 left-full ml-2 bg-white border-2 border-purple-300 rounded-2xl rounded-tl-none px-3 py-2 shadow-lg w-44 z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <p className="text-purple-700 font-bold text-[10px]">Selamat datang! 😊</p>
                  <p className="text-gray-600 text-[9px] mt-0.5">Silakan pilih menu dari daftar di bawah!</p>
                </motion.div>
              )}
              {phase === "taking" && (
                <motion.div
                  key="taking"
                  className="absolute -top-2 left-full ml-2 bg-white border-2 border-green-300 rounded-2xl rounded-tl-none px-3 py-2 shadow-lg w-44 z-10"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-green-700 font-bold text-[10px]">Oke, dicatat! ✍️</p>
                  <p className="text-gray-500 text-[9px] mt-0.5">Pesanan kamu sudah masuk ya~</p>
                </motion.div>
              )}
              {phase === "counting" && (
                <motion.div
                  key="counting"
                  className="absolute -top-2 left-full ml-2 bg-white border-2 border-blue-300 rounded-2xl rounded-tl-none px-3 py-2 shadow-lg w-44 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-blue-700 font-bold text-[10px]">Menghitung total... 🧮</p>
                  <p className="text-gray-500 text-[9px]">Termasuk PPN {ppnPct}% ya!</p>
                </motion.div>
              )}
              {phase === "presenting" && (
                <motion.div
                  key="presenting"
                  className="absolute -top-2 left-full ml-2 bg-white border-2 border-pink-300 rounded-2xl rounded-tl-none px-3 py-2 shadow-lg w-48 z-10"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-pink-700 font-bold text-[10px]">Ini struk-nya! 🧾</p>
                  <p className="text-gray-600 text-[9px] mt-0.5">
                    Total: <span className="font-bold text-purple-600">{fmt(total)}</span>
                  </p>
                  <p className="text-gray-400 text-[9px]">(sudah termasuk PPN)</p>
                </motion.div>
              )}
              {phase === "idle" && order.length > 0 && (
                <motion.div
                  key="ready"
                  className="absolute -top-2 left-full ml-2 bg-white border-2 border-amber-300 rounded-2xl rounded-tl-none px-3 py-2 shadow-lg w-44 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-amber-700 font-bold text-[10px]">Pesanan siap! 🍽️</p>
                  <p className="text-gray-500 text-[9px]">Tekan "Bayar" saat selesai memesan.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary card on counter */}
          <div className="flex-1 mx-3 mb-0 relative">
            <AnimatePresence>
              {order.length > 0 && (
                <motion.div
                  className="rounded-xl px-3 py-2 mb-1"
                  style={{ background: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(167,139,250,0.6)" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-purple-700 font-black text-[10px] mb-1">📋 Pesanan Kamu:</p>
                  {order.map((it) => (
                    <div key={it.id} className="flex items-center justify-between text-[9px] text-gray-600 mb-0.5">
                      <span>{it.emoji} {it.nama} ×{it.qty}</span>
                      <span className="font-bold text-purple-600">{fmt(it.harga * it.qty)}</span>
                    </div>
                  ))}
                  <div className="border-t border-purple-200 mt-1 pt-1 flex justify-between text-[9px]">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold text-gray-700">{fmt(subtotal)}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Float labels */}
          <AnimatePresence>
            {floatText && (
              <FloatLabel key={floatKey} text={floatText} color={floatColor} />
            )}
          </AnimatePresence>
        </div>

        {/* Counter */}
        <div className="relative z-10">
          <CounterSVG />
        </div>
      </div>

      {/* ── PPN Rate selector ── */}
      <div className="mx-4 mt-3">
        <div className="px-4 py-3 rounded-xl space-y-2.5" style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(167,139,250,0.3)" }}>
          <div className="flex items-center justify-between">
            <span className="text-purple-300 font-body font-bold text-xs">📊 Tarif PPN:</span>
            <div className="text-right">
              <p className="text-[9px] text-purple-400/60 font-body">PPN saat ini</p>
              <p className="text-purple-200 font-black text-sm">{ppnPct}%</p>
            </div>
          </div>
          <div className="flex gap-2">
            {PRESET_RATES.map((p) => (
              <button
                key={p}
                onClick={() => { setPpnPct(p); setCustomMode(false); setCustomInput(""); playPopSound(); }}
                className="flex-1 py-1.5 rounded-lg text-xs font-bold font-body transition-all"
                style={ppnPct === p && !isCustomActive
                  ? { background: "rgba(124,58,237,0.5)", border: "1.5px solid #a78bfa", color: "#e9d5ff" }
                  : { background: "rgba(124,58,237,0.08)", border: "1.5px solid rgba(167,139,250,0.2)", color: "rgba(167,139,250,0.5)" }}
              >
                {p}%
              </button>
            ))}
            <button
              onClick={() => { setCustomMode(true); setCustomInput(String(ppnPct)); playPopSound(); }}
              className="flex-1 py-1.5 rounded-lg text-xs font-bold font-body transition-all"
              style={isCustomActive
                ? { background: "rgba(236,72,153,0.4)", border: "1.5px solid #f472b6", color: "#fce7f3" }
                : { background: "rgba(236,72,153,0.08)", border: "1.5px solid rgba(244,114,182,0.25)", color: "rgba(244,114,182,0.5)" }}
            >
              ✏️ Custom
            </button>
          </div>
          {isCustomActive && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={customInput}
                onChange={(e) => {
                  setCustomInput(e.target.value);
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val >= 0 && val <= 100) setPpnPct(val);
                }}
                placeholder="Masukkan % PPN..."
                className="flex-1 rounded-lg px-3 py-2 text-sm font-bold font-body focus:outline-none"
                style={{ background: "rgba(236,72,153,0.12)", border: "1.5px solid rgba(244,114,182,0.5)", color: "#fce7f3" }}
              />
              <span className="text-pink-300 font-black text-sm">%</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Menu ── */}
      <div className="px-4 mt-3">
        <p className="font-body text-xs text-purple-300/70 mb-2">🍽️ Pilih menu yang ingin kamu pesan:</p>

        {/* Category tabs */}
        <div className="flex gap-2 mb-3">
          {kategoriList.map((k) => (
            <button
              key={k}
              onClick={() => { setActiveKat(k); playPopSound(); }}
              className="flex-1 py-1.5 rounded-lg text-xs font-body font-bold transition-all"
              style={activeKat === k
                ? { background: "linear-gradient(90deg,#7c3aed,#ec4899)", color: "white" }
                : { background: "rgba(124,58,237,0.08)", border: "1px solid rgba(167,139,250,0.25)", color: "rgba(167,139,250,0.5)" }}
            >
              {k === "Makanan" ? "🍱" : k === "Minuman" ? "🥤" : "🍿"} {k}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {MENU.filter((m) => m.kategori === activeKat).map((item) => {
            const inOrder = order.find((o) => o.id === item.id);
            return (
              <motion.button
                key={item.id}
                onClick={() => addItem(item)}
                className="relative rounded-xl p-3 text-left transition-all"
                style={{
                  background: inOrder ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.05)",
                  border: inOrder ? "1.5px solid rgba(167,139,250,0.7)" : "1.5px solid rgba(255,255,255,0.1)",
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
              >
                <div className="text-2xl mb-1">{item.emoji}</div>
                <p className="font-body text-[10px] font-bold text-white leading-tight">{item.nama}</p>
                <p className="font-body text-[10px] text-purple-300 mt-0.5">{fmt(item.harga)}</p>
                {inOrder && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] text-white"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}>
                    {inOrder.qty}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Order & Calculation panel ── */}
      <AnimatePresence>
        {order.length > 0 && (
          <motion.div
            className="mx-4 mb-3 rounded-xl overflow-hidden"
            style={{ border: "1.5px solid rgba(167,139,250,0.4)" }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-4 py-3" style={{ background: "rgba(0,0,0,0.3)" }}>
              <p className="font-body text-xs text-purple-200 font-bold mb-2">🧮 Rincian Pembayaran</p>

              {/* Order items with remove */}
              {order.map((it) => (
                <div key={it.id} className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeItem(it.id)}
                      className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs flex items-center justify-center hover:bg-red-500/40 transition-colors"
                    >
                      −
                    </button>
                    <span className="font-body text-xs text-white/80">{it.emoji} {it.nama} ×{it.qty}</span>
                  </div>
                  <span className="font-body text-xs text-purple-300 font-bold">{fmt(it.harga * it.qty)}</span>
                </div>
              ))}

              <div className="border-t border-white/10 mt-2 pt-2 space-y-1.5">
                <div className="flex justify-between font-body text-xs text-white/60">
                  <span>Harga sebelum pajak</span>
                  <span className="font-bold text-white">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between font-body text-xs">
                  <span className="text-purple-300 font-semibold">PPN {ppnPct}%</span>
                  <span className="text-purple-300 font-bold">+ {fmt(ppnRp)}</span>
                </div>
                <div className="flex justify-between font-body text-xs rounded-lg px-2 py-1.5"
                  style={{ background: "rgba(124,58,237,0.25)", border: "1px solid rgba(167,139,250,0.4)" }}>
                  <span className="text-white font-black">TOTAL YANG HARUS DIBAYAR</span>
                  <span className="text-pink-300 font-black">{fmt(total)}</span>
                </div>
              </div>

              {/* Formula */}
              <div className="mt-2 px-3 py-2 rounded-lg font-body text-[10px]"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}>
                <p className="text-purple-300 font-semibold mb-0.5">📐 Rumus:</p>
                <p className="text-white/70">PPN = {fmt(subtotal)} × {ppnPct}% = <span className="text-purple-300 font-bold">{fmt(ppnRp)}</span></p>
                <p className="text-white/70">Total = {fmt(subtotal)} + {fmt(ppnRp)} = <span className="text-pink-300 font-bold">{fmt(total)}</span></p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Action buttons ── */}
      <div className="px-4 pb-4 flex gap-3">
        <motion.button
          onClick={handleBayar}
          disabled={order.length === 0 || phase === "counting"}
          className="flex-1 font-body font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(90deg, #7c3aed, #ec4899)", color: "white" }}
          whileHover={{ scale: order.length > 0 ? 1.02 : 1 }}
          whileTap={{ scale: order.length > 0 ? 0.97 : 1 }}
        >
          {phase === "counting" ? (
            <>
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⚙️</motion.span>
              Menghitung...
            </>
          ) : (
            <>🧾 Bayar & Cetak Struk</>
          )}
        </motion.button>
        <motion.button
          onClick={handleReset}
          className="px-4 rounded-xl font-body text-sm py-3 transition-all"
          style={{ background: "rgba(124,58,237,0.1)", border: "1.5px solid rgba(167,139,250,0.25)", color: "rgba(167,139,250,0.7)" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          🗑️
        </motion.button>
      </div>

      {/* ── Receipt Modal ── */}
      <AnimatePresence>
        {showReceipt && (
          <Receipt
            items={order}
            ppnPct={ppnPct}
            onClose={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
