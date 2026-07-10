import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";

const makeFmt = (lang: string) => (n: number) =>
  (lang === "id" ? "Rp " : "$ ") + Math.round(n).toLocaleString(lang === "id" ? "id-ID" : "en-US");

const MENU = [
  { id: 1, nama: "Nasi Goreng / Fried Rice", emoji: "🍳", harga: 28000, kategori: "Food" },
  { id: 2, nama: "Ayam Bakar / Grilled Chicken", emoji: "🍗", harga: 35000, kategori: "Food" },
  { id: 3, nama: "Mie Goreng / Fried Noodles", emoji: "🍜", harga: 32000, kategori: "Food" },
  { id: 4, nama: "Pizza Mini", emoji: "🍕", harga: 45000, kategori: "Food" },
  { id: 5, nama: "Iced Tea / Es Teh", emoji: "🧊", harga: 8000, kategori: "Drink" },
  { id: 6, nama: "Orange Juice / Jus Jeruk", emoji: "🍊", harga: 15000, kategori: "Drink" },
  { id: 7, nama: "Coffee Latte / Kopi Susu", emoji: "☕", harga: 20000, kategori: "Drink" },
  { id: 8, nama: "Prawn Crackers / Kerupuk", emoji: "🦐", harga: 5000, kategori: "Snack" },
];

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
      <rect x="28" y="120" width="13" height="32" rx="5" fill="#1e3a8a" />
      <rect x="49" y="120" width="13" height="32" rx="5" fill="#1e3a8a" />
      <ellipse cx="34" cy="152" rx="10" ry="5" fill="#0f172a" />
      <ellipse cx="55" cy="152" rx="10" ry="5" fill="#0f172a" />
      <path d="M 22 118 Q 45 130 68 118 L 65 100 Q 45 108 25 100 Z" fill="#7c3aed" />
      <rect x="25" y="78" width="40" height="44" rx="8" fill="#ec4899" />
      <path d="M 38 78 L 45 90 L 52 78" fill="white" opacity="0.9" />
      <rect x="33" y="82" width="24" height="36" rx="4" fill="white" opacity="0.25" />
      <rect x="38" y="87" width="18" height="10" rx="2" fill="white" opacity="0.85" />
      <text x="47" y="94.5" textAnchor="middle" fontSize="5" fill="#7c3aed" fontWeight="bold">KASIR</text>
      <motion.g
        animate={nodding ? { rotate: [-5, 5, -5] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
        style={{ originX: "24px", originY: "88px" }}
      >
        <ellipse cx="18" cy="96" rx="8" ry="6" fill="#ec4899" transform="rotate(-20 18 96)" />
        <rect x="2" y="88" width="22" height="28" rx="3" fill="#fef3c7" />
        <rect x="2" y="88" width="22" height="6"  rx="3" fill="#f59e0b" />
        <line x1="6"  y1="100" x2="20" y2="100" stroke="#d97706" strokeWidth="1.2" />
        <line x1="6"  y1="104" x2="20" y2="104" stroke="#d97706" strokeWidth="1.2" />
        <line x1="6"  y1="108" x2="16" y2="108" stroke="#d97706" strokeWidth="1.2" />
        <circle cx="3" cy="91" r="1.5" fill="#d97706" />
        <circle cx="3" cy="96" r="1.5" fill="#d97706" />
        <circle cx="3" cy="101" r="1.5" fill="#d97706" />
      </motion.g>
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
      <motion.g
        animate={nodding ? { rotate: [0, 8, -4, 0] } : {}}
        transition={{ duration: 0.6, repeat: Infinity }}
        style={{ originX: "45px", originY: "68px" }}
      >
        <circle cx="45" cy="48" r="22" fill="#fcd5a8" />
        <ellipse cx="45" cy="28" rx="20" ry="12" fill="#92400e" />
        <ellipse cx="45" cy="20" rx="10" ry="8"  fill="#78350f" />
        <ellipse cx="30" cy="36" rx="8" ry="14"  fill="#92400e" />
        <ellipse cx="60" cy="36" rx="8" ry="14"  fill="#92400e" />
        <circle cx="45" cy="18" r="8" fill="#78350f" />
        <circle cx="45" cy="18" r="5" fill="#92400e" />
        <ellipse cx="38" cy="46" rx="3"   ry="3.5" fill="#1e293b" />
        <ellipse cx="52" cy="46" rx="3"   ry="3.5" fill="#1e293b" />
        <circle  cx="39" cy="44.5" r="1.2" fill="white" />
        <circle  cx="53" cy="44.5" r="1.2" fill="white" />
        <line x1="35" y1="43" x2="33" y2="41" stroke="#1e293b" strokeWidth="1.2" />
        <line x1="38" y1="42" x2="37" y2="40" stroke="#1e293b" strokeWidth="1.2" />
        <line x1="49" y1="42" x2="48" y2="40" stroke="#1e293b" strokeWidth="1.2" />
        <line x1="52" y1="43" x2="54" y2="41" stroke="#1e293b" strokeWidth="1.2" />
        <ellipse cx="33" cy="52" rx="5" ry="3" fill="#f87171" opacity="0.5" />
        <ellipse cx="57" cy="52" rx="5" ry="3" fill="#f87171" opacity="0.5" />
        {happy ? (
          <path d="M 38 57 Q 45 64 52 57" stroke="#c2410c" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M 39 57 Q 45 61 51 57" stroke="#c2410c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        )}
        <path d="M 24 38 Q 45 26 66 38" stroke="#ec4899" strokeWidth="3" fill="none" />
        <circle cx="45" cy="26" r="4" fill="#f9a8d4" />
      </motion.g>
    </svg>
  );
};

const CounterSVG = () => (
  <svg width="100%" height="55" viewBox="0 0 360 55" preserveAspectRatio="none" fill="none">
    <rect x="0" y="10" width="360" height="45" rx="6" fill="#78350f" />
    <rect x="0" y="10" width="360" height="12" rx="6" fill="#92400e" />
    <rect x="10" y="14" width="340" height="6" rx="2" fill="#fde68a" opacity="0.15" />
    <rect x="0" y="22" width="360" height="2" fill="#d97706" opacity="0.4" />
    <rect x="280" y="2" width="68" height="52" rx="5" fill="#1e293b" />
    <rect x="284" y="6"  width="60" height="30" rx="3" fill="#0f172a" />
    <rect x="286" y="8"  width="56" height="26" rx="2" fill="#0ea5e9" opacity="0.2" />
    <text x="314" y="25" textAnchor="middle" fontSize="8" fill="#38bdf8" fontWeight="bold">KASIR</text>
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

const Receipt = ({
  items, ppnPct, onClose, ui, fmt,
}: {
  items: { nama: string; qty: number; harga: number; emoji: string }[];
  ppnPct: number;
  onClose: () => void;
  ui: Record<string, string>;
  fmt: (n: number) => string;
}) => {
  const subtotal = items.reduce((s, it) => s + it.harga * it.qty, 0);
  const ppnRp    = subtotal * (ppnPct / 100);
  const total    = subtotal + ppnRp;
  const now      = new Date();
  const locale   = ui.locale;
  const jam      = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  const tgl      = now.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });

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
        <div className="bg-white rounded-t-2xl overflow-hidden shadow-2xl" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
          <div className="py-4 px-5 text-center" style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}>
            <p className="text-white font-black text-base tracking-widest">🍽️ RESTORAN NUMATIK</p>
            <p className="text-white/70 text-[10px] mt-0.5">Jl. Matematika No. 7, Indonesia</p>
          </div>

          <div className="px-5 pt-3 pb-1 font-mono">
            <div className="flex justify-between text-[10px] text-gray-400 mb-3">
              <span>{ui.labelDate}: {tgl}</span>
              <span>{ui.labelTime}: {jam}</span>
              <span>No: #0042</span>
            </div>

            <div className="border-t-2 border-dashed border-gray-300 mb-3" />

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
              <span>{ui.subtotal}</span>
              <span className="font-semibold">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs mb-2" style={{ color: "#7c3aed" }}>
              <span className="font-semibold">{ui.taxLabel} {ppnPct}%</span>
              <span className="font-bold">+ {fmt(ppnRp)}</span>
            </div>

            <div className="border-t-2 border-gray-400 mb-2" />
            <div className="flex justify-between text-sm font-black text-gray-900 mb-1">
              <span>{ui.totalLabel}</span>
              <span style={{ color: "#7c3aed" }}>{fmt(total)}</span>
            </div>

            <div className="border-t-2 border-dashed border-gray-300 mt-3 mb-3" />
            <p className="text-[9px] text-gray-400 text-center leading-relaxed">
              {ui.receiptFooter(ppnPct)}
            </p>

            <div className="flex justify-center mt-2 mb-3 gap-px">
              {Array.from({ length: 32 }, (_, i) => (
                <div key={i} className="bg-gray-800"
                  style={{ width: i % 3 === 0 ? 3 : 1.5, height: 28 }} />
              ))}
            </div>
          </div>
        </div>

        <div className="relative h-4 bg-white overflow-hidden">
          <svg width="100%" height="16" viewBox="0 0 320 16" preserveAspectRatio="none">
            <path d="M0,0 Q10,16 20,8 Q30,0 40,8 Q50,16 60,8 Q70,0 80,8 Q90,16 100,8 Q110,0 120,8 Q130,16 140,8 Q150,0 160,8 Q170,16 180,8 Q190,0 200,8 Q210,16 220,8 Q230,0 240,8 Q250,16 260,8 Q270,0 280,8 Q290,16 300,8 Q310,0 320,8 L320,0 Z"
              fill="white" />
          </svg>
        </div>

        <motion.button
          onClick={onClose}
          className="w-full mt-3 py-3 rounded-2xl font-bold text-sm text-white shadow-lg"
          style={{ background: "linear-gradient(90deg, #7c3aed, #ec4899)" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          {ui.btnClose}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

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

type OrderItem = { id: number; nama: string; emoji: string; harga: number; qty: number; kategori: string };

export default function RestoranPPN() {
  const { language: lang } = useLanguage();
  const fmt = makeFmt(lang);

  const uiMap = {
    id: {
      locale: "id-ID",
      headerTitle: "Restoran Numatik – Simulasi PPN",
      headerSub: "Pesan makanan → lihat struk → hitung PPN!",
      badge: "INTERAKTIF",
      menuBoard: "🌟 MENU HARI INI",
      tabFood: "Makanan",
      tabDrink: "Minuman",
      tabSnack: "Cemilan",
      taxRate: "Tarif PPN (%)",
      taxPreset: "Preset:",
      taxCustom: "Kustom",
      orderTitle: "Pesanan",
      btnPay: "💳 Bayar",
      btnReset: "🔄 Reset",
      labelDate: "Tgl",
      labelTime: "Pukul",
      subtotal: "Subtotal",
      taxLabel: "PPN",
      totalLabel: "TOTAL BAYAR",
      receiptFooter: (pct: number) =>
        `Harga sudah termasuk PPN ${pct}% sesuai UU Harmonisasi Perpajakan. Terima kasih telah makan di Restoran Numatik! 🙏`,
      btnClose: "✅ Selesai Bayar",
      speechWelcome: "Selamat datang! 😊",
      speechWelcomeSub: "Silakan pilih menu dari daftar di bawah!",
      speechTaking: "Oke, dicatat! ✍️",
      speechTakingSub: "Pesanan kamu sudah masuk ya~",
      speechCounting: "Menghitung total... 🧮",
      speechCountingSub: (pct: number) => `Termasuk PPN ${pct}% ya!`,
      speechPresenting: "Ini struk-nya! 🧾",
      speechPresentingSub: (total: string) => `Total: ${total}`,
      speechPresentingNote: "(sudah termasuk PPN)",
      speechReady: "Pesanan siap! 🍽️",
      speechReadySub: 'Tekan "Bayar" saat selesai memesan.',
      floatReady: "Struk siap! 🧾",
      orderEmpty: "Belum ada pesanan",
      addItem: "+",
    },
    en: {
      locale: "en-US",
      headerTitle: "Restoran Numatik – VAT Simulation",
      headerSub: "Order food → see receipt → calculate VAT!",
      badge: "INTERACTIVE",
      menuBoard: "🌟 TODAY'S MENU",
      tabFood: "Food",
      tabDrink: "Drink",
      tabSnack: "Snack",
      taxRate: "VAT Rate (%)",
      taxPreset: "Preset:",
      taxCustom: "Custom",
      orderTitle: "Order",
      btnPay: "💳 Pay",
      btnReset: "🔄 Reset",
      labelDate: "Date",
      labelTime: "Time",
      subtotal: "Subtotal",
      taxLabel: "VAT",
      totalLabel: "TOTAL",
      receiptFooter: (pct: number) =>
        `Price includes ${pct}% VAT. This simulation uses Indonesia's VAT system as an illustrative example. Thank you for dining at Restoran Numatik! 🙏`,
      btnClose: "✅ Done",
      speechWelcome: "Welcome! 😊",
      speechWelcomeSub: "Please choose from the menu below!",
      speechTaking: "Got it! ✍️",
      speechTakingSub: "Your order has been noted~",
      speechCounting: "Calculating total... 🧮",
      speechCountingSub: (pct: number) => `Including ${pct}% VAT!`,
      speechPresenting: "Here's your receipt! 🧾",
      speechPresentingSub: (total: string) => `Total: ${total}`,
      speechPresentingNote: "(VAT included)",
      speechReady: "Order ready! 🍽️",
      speechReadySub: 'Press "Pay" when done ordering.',
      floatReady: "Receipt ready! 🧾",
      orderEmpty: "No items yet",
      addItem: "+",
    },
    ja: {
      locale: "ja-JP",
      headerTitle: "レストランNUMATIK – 消費税シミュレーション",
      headerSub: "注文する → 領収書を見る → 消費税を計算！",
      badge: "インタラクティブ",
      menuBoard: "🌟 本日のメニュー",
      tabFood: "料理",
      tabDrink: "飲み物",
      tabSnack: "おつまみ",
      taxRate: "消費税率（%）",
      taxPreset: "プリセット:",
      taxCustom: "カスタム",
      orderTitle: "注文",
      btnPay: "💳 支払う",
      btnReset: "🔄 リセット",
      labelDate: "日付",
      labelTime: "時刻",
      subtotal: "小計",
      taxLabel: "消費税",
      totalLabel: "合計",
      receiptFooter: (pct: number) =>
        `価格には消費税${pct}%が含まれています。これはインドネシアの消費税制度を用いた学習例です。ありがとうございました！🙏`,
      btnClose: "✅ 完了",
      speechWelcome: "いらっしゃいませ！😊",
      speechWelcomeSub: "下のメニューからお選びください！",
      speechTaking: "承りました！✍️",
      speechTakingSub: "ご注文を承りました〜",
      speechCounting: "合計を計算中... 🧮",
      speechCountingSub: (pct: number) => `消費税${pct}%を含みます！`,
      speechPresenting: "領収書です！🧾",
      speechPresentingSub: (total: string) => `合計: ${total}`,
      speechPresentingNote: "（消費税込み）",
      speechReady: "ご注文完了！🍽️",
      speechReadySub: '注文が終わったら「支払う」を押してください。',
      floatReady: "領収書準備完了！🧾",
      orderEmpty: "まだ注文がありません",
      addItem: "+",
    },
  };
  const ui = uiMap[lang as keyof typeof uiMap] ?? uiMap.id;

  const [order, setOrder]           = useState<OrderItem[]>([]);
  const [ppnPct, setPpnPct]         = useState(11);
  const [customMode, setCustomMode] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [phase, setPhase]           = useState<"idle" | "taking" | "counting" | "presenting">("idle");
  const [showReceipt, setShowReceipt] = useState(false);
  const [floatKey, setFloatKey]     = useState(0);
  const [floatText, setFloatText]   = useState("");
  const [floatColor, setFloatColor] = useState("bg-green-500");
  const [activeKat, setActiveKat]   = useState<string>("Food");

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
        triggerFloat(ui.floatReady, "bg-green-500");
      }, 600);
    }, 1200);
  };

  const handleReset = () => {
    playPopSound();
    setOrder([]);
    setShowReceipt(false);
    setPhase("idle");
  };

  const kategoriList = [ui.tabFood, ui.tabDrink, ui.tabSnack];
  const menuByKat: Record<string, string> = {
    [ui.tabFood]: "Food",
    [ui.tabDrink]: "Drink",
    [ui.tabSnack]: "Snack",
  };

  return (
    <div
      className="rounded-2xl overflow-hidden border-2"
      style={{
        background: "linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)",
        borderColor: "rgba(167,139,250,0.5)",
        boxShadow: "0 0 50px rgba(124,58,237,0.2)",
      }}
    >
      <div
        className="px-5 py-3 flex items-center gap-3"
        style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.3), rgba(236,72,153,0.15))" }}
      >
        <span className="text-2xl">🍽️</span>
        <div>
          <p className="font-body font-bold text-purple-200 text-sm">{ui.headerTitle}</p>
          <p className="font-body text-[10px] text-purple-400/60">{ui.headerSub}</p>
        </div>
        <span className="ml-auto bg-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{ui.badge}</span>
      </div>

      <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(180deg, #fdf2f8 0%, #fce7f3 40%, #f5f0ff 100%)" }}>
        <div className="absolute inset-0">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="absolute top-0 border-r border-pink-200/40" style={{ left: `${i * 12.5}%`, height: "40%", width: 1 }} />
          ))}
          <div className="absolute top-2 left-1/4 w-1 h-6 bg-amber-400 rounded-full opacity-60" />
          <div className="absolute top-2 right-1/4 w-1 h-6 bg-amber-400 rounded-full opacity-60" />
          <div className="absolute top-2 left-1/4 -translate-x-4 w-8 h-3 bg-amber-200 rounded-full opacity-40 blur-sm" />
          <div className="absolute top-2 right-1/4 translate-x-4 w-8 h-3 bg-amber-200 rounded-full opacity-40 blur-sm" />
          <div className="absolute top-3 left-1/2 -translate-x-1/2 rounded-lg px-4 py-1.5" style={{ background: "#7c3aed", border: "2px solid #a78bfa" }}>
            <p className="text-white text-[9px] font-black tracking-wider">{ui.menuBoard}</p>
          </div>
          <div className="absolute bottom-20 left-4 text-lg opacity-80">🌸</div>
          <div className="absolute bottom-20 right-4 text-lg opacity-80">🌺</div>
        </div>

        <div className="relative flex items-end justify-between px-4 pt-14 pb-0">
          <div className="relative flex-shrink-0">
            <WaitressSVG phase={phase} />
            <AnimatePresence mode="wait">
              {phase === "idle" && order.length === 0 && (
                <motion.div
                  key="welcome"
                  className="absolute -top-2 left-full ml-2 bg-white border-2 border-purple-300 rounded-2xl rounded-tl-none px-3 py-2 shadow-lg w-44 z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <p className="text-purple-700 font-bold text-[10px]">{ui.speechWelcome}</p>
                  <p className="text-gray-600 text-[9px] mt-0.5">{ui.speechWelcomeSub}</p>
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
                  <p className="text-green-700 font-bold text-[10px]">{ui.speechTaking}</p>
                  <p className="text-gray-500 text-[9px] mt-0.5">{ui.speechTakingSub}</p>
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
                  <p className="text-blue-700 font-bold text-[10px]">{ui.speechCounting}</p>
                  <p className="text-gray-500 text-[9px]">{ui.speechCountingSub(ppnPct)}</p>
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
                  <p className="text-pink-700 font-bold text-[10px]">{ui.speechPresenting}</p>
                  <p className="text-gray-600 text-[9px] mt-0.5">
                    {ui.speechPresentingSub(fmt(total))}
                  </p>
                  <p className="text-gray-400 text-[9px]">{ui.speechPresentingNote}</p>
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
                  <p className="text-amber-700 font-bold text-[10px]">{ui.speechReady}</p>
                  <p className="text-gray-500 text-[9px]">{ui.speechReadySub}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
                  <p className="text-purple-700 font-black text-[10px] mb-1">{ui.orderTitle}:</p>
                  {order.map((it) => (
                    <div key={it.id} className="flex items-center justify-between text-[10px] mb-0.5">
                      <span className="text-gray-700">{it.emoji} ×{it.qty}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-purple-600 font-bold">{fmt(it.harga * it.qty)}</span>
                        <button onClick={() => removeItem(it.id)} className="text-red-400 hover:text-red-600 font-bold text-xs px-1">−</button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-purple-200 mt-1 pt-1 flex justify-between text-[10px]">
                    <span className="text-gray-500">{ui.subtotal}</span>
                    <span className="font-bold text-gray-700">{fmt(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span style={{ color: "#7c3aed" }}>{ui.taxLabel} {ppnPct}%</span>
                    <span className="font-bold" style={{ color: "#7c3aed" }}>+{fmt(ppnRp)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black border-t border-purple-200 mt-0.5 pt-0.5">
                    <span className="text-gray-800">{ui.totalLabel}</span>
                    <span style={{ color: "#7c3aed" }}>{fmt(total)}</span>
                  </div>
                </motion.div>
              )}
              {order.length === 0 && (
                <motion.div className="rounded-xl px-3 py-3 text-center"
                  style={{ background: "rgba(255,255,255,0.5)" }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-gray-400 text-[10px]">{ui.orderEmpty}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <CounterSVG />

        <AnimatePresence>
          {floatKey > 0 && (
            <FloatLabel key={floatKey} text={floatText} color={floatColor} />
          )}
        </AnimatePresence>
      </div>

      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <p className="font-body text-[10px] text-purple-300 font-bold">{ui.taxRate}:</p>
          <div className="flex gap-1.5 flex-wrap">
            {PRESET_RATES.map((r) => (
              <button key={r}
                onClick={() => { setPpnPct(r); setCustomMode(false); playPopSound(); }}
                className="text-[10px] font-black px-2 py-1 rounded-full transition-all"
                style={ppnPct === r && !customMode
                  ? { background: "#7c3aed", color: "white" }
                  : { background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}>
                {r}%
              </button>
            ))}
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={customInput}
                onChange={(e) => { setCustomInput(e.target.value); if (e.target.value) { setPpnPct(parseFloat(e.target.value)); setCustomMode(true); } }}
                placeholder={ui.taxCustom}
                className="w-16 text-[10px] rounded-full px-2 py-1 font-body focus:outline-none"
                style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", color: "#a78bfa" }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-2 flex-wrap">
          {kategoriList.map((kat) => (
            <button key={kat}
              onClick={() => setActiveKat(kat)}
              className="text-[10px] font-black px-3 py-1 rounded-full transition-all"
              style={activeKat === kat
                ? { background: "#ec4899", color: "white" }
                : { background: "rgba(236,72,153,0.1)", color: "#f9a8d4" }}>
              {kat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {MENU.filter((m) => {
            const engKat = menuByKat[activeKat] || activeKat;
            return m.kategori === engKat;
          }).map((item) => {
            const inOrder = order.find((o) => o.id === item.id);
            return (
              <button key={item.id}
                onClick={() => addItem(item)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-left transition-all"
                style={{
                  background: inOrder ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.07)",
                  border: inOrder ? "1px solid rgba(167,139,250,0.5)" : "1px solid rgba(255,255,255,0.1)",
                }}>
                <span className="text-base">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] text-purple-200 font-body truncate">{item.nama}</p>
                  <p className="text-[10px] font-black text-purple-300">{fmt(item.harga)}</p>
                </div>
                {inOrder && <span className="text-[10px] font-black text-pink-400">×{inOrder.qty}</span>}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <motion.button
            onClick={handleBayar}
            disabled={order.length === 0 || phase !== "idle"}
            className="flex-1 py-2.5 rounded-xl font-body font-black text-sm text-white transition-all disabled:opacity-40"
            style={{ background: "linear-gradient(90deg, #7c3aed, #ec4899)" }}
            whileHover={{ scale: order.length > 0 ? 1.02 : 1 }}
            whileTap={{ scale: 0.97 }}
          >
            {ui.btnPay}
          </motion.button>
          <motion.button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl font-body font-black text-sm transition-all"
            style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            {ui.btnReset}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showReceipt && (
          <Receipt
            items={order}
            ppnPct={ppnPct}
            onClose={() => { setShowReceipt(false); setPhase("idle"); }}
            ui={ui as unknown as Record<string, string>}
            fmt={fmt}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
