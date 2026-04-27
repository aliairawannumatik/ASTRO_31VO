import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, BookOpen, Dumbbell, Star, ChevronRight } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import PembahasanCard from "@/components/PembahasanCard";
import { brslDasarPembahasan } from "@/data/pembahasan/brslDasar";
import { brslOlimpiadePembahasan } from "@/data/pembahasan/brslOlimpiade";
import dasarImg3 from "@assets/3_1777273872295.png";
import dasarImg5 from "@assets/5_1777273872296.png";
import dasarImg6 from "@assets/6_1777273872296.png";
import dasarImg13 from "@assets/13_1777273872297.png";
import dasarImg30 from "@assets/30_1777273872297.png";
import dasarImg31 from "@assets/31_1777273872298.png";
import dasarImg32 from "@assets/32_1777273872298.png";
import dasarImg33 from "@assets/33_1777273872299.png";
import dasarImg34 from "@assets/34_1777273872299.png";
import dasarImg35 from "@assets/35_1777273872299.png";
import dasarImg36 from "@assets/36_1777273872300.png";
import dasarImg37 from "@assets/37_1777273872301.png";

const brslDasarImages: Record<number, string> = {
  3: dasarImg3,
  5: dasarImg5,
  6: dasarImg6,
  13: dasarImg13,
  30: dasarImg30,
  31: dasarImg31,
  32: dasarImg32,
  33: dasarImg33,
  34: dasarImg34,
  35: dasarImg35,
  36: dasarImg36,
  37: dasarImg37,
};

/* ─────────────── LaTeX helper ─────────────── */
const renderWithLatex = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith("$") && part.endsWith("$")) {
      return <InlineMath key={index} math={part.slice(1, -1)} />;
    }
    return <span key={index}>{part}</span>;
  });
};

/* ══════════════════════════════════════════════
   ANIMATED TABUNG (Cylinder)
══════════════════════════════════════════════ */
const AnimatedTabung = () => {
  const [rot, setRot] = useState(0);
  useEffect(() => {
    let id: number;
    const loop = () => { setRot(r => r + 0.6); id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  const W = 180, H = 200, cx = W / 2, cy = H / 2;
  const rx = 60, ry = 18, h = 110;
  const topY = cy - h / 2, botY = cy + h / 2;

  const shade = (angle: number) => {
    const norm = (Math.cos((angle + rot) * Math.PI / 180) + 1) / 2;
    const r = Math.round(6 + norm * 30);
    const g = Math.round(182 + norm * 40);
    const b = Math.round(212 + norm * 30);
    return `rgb(${r},${g},${b})`;
  };

  const segs = 36;
  const faces: { path: string; z: number; fill: string }[] = [];
  for (let i = 0; i < segs; i++) {
    const a1 = (i / segs) * 360, a2 = ((i + 1) / segs) * 360;
    const r1 = (a1 + rot) * Math.PI / 180, r2 = (a2 + rot) * Math.PI / 180;
    const x1t = cx + rx * Math.cos(r1), y1t = topY + ry * Math.sin(r1);
    const x2t = cx + rx * Math.cos(r2), y2t = topY + ry * Math.sin(r2);
    const x1b = cx + rx * Math.cos(r1), y1b = botY + ry * Math.sin(r1);
    const x2b = cx + rx * Math.cos(r2), y2b = botY + ry * Math.sin(r2);
    const midA = (a1 + a2) / 2;
    const z = Math.cos((midA + rot) * Math.PI / 180);
    faces.push({ path: `M${x1t},${y1t} L${x2t},${y2t} L${x2b},${y2b} L${x1b},${y1b}Z`, z, fill: shade(midA) });
  }
  faces.sort((a, b) => a.z - b.z);

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
      <defs>
        <radialGradient id="tabTopGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#0891b2" />
        </radialGradient>
        <radialGradient id="tabBotGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#164e63" />
        </radialGradient>
      </defs>
      {/* Bottom ellipse (behind) */}
      <ellipse cx={cx} cy={botY} rx={rx} ry={ry} fill="url(#tabBotGrad)" stroke="#06b6d4" strokeWidth="1" opacity="0.9" />
      {/* Side faces */}
      {faces.map((f, i) => <path key={i} d={f.path} fill={f.fill} stroke="none" />)}
      {/* Top ellipse (front) */}
      <ellipse cx={cx} cy={topY} rx={rx} ry={ry} fill="url(#tabTopGrad)" stroke="#67e8f9" strokeWidth="1.5" />
      {/* Labels */}
      <line x1={cx} y1={topY} x2={cx} y2={botY} stroke="#f0f9ff" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
      <text x={cx + 4} y={(topY + botY) / 2} fill="#e0f2fe" fontSize="10" fontFamily="monospace" opacity="0.8">t</text>
      <line x1={cx} y1={topY} x2={cx + rx} y2={topY} stroke="#f0f9ff" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
      <text x={cx + rx / 2} y={topY - 5} fill="#e0f2fe" fontSize="10" fontFamily="monospace" opacity="0.8">r</text>
    </svg>
  );
};

/* ══════════════════════════════════════════════
   ANIMATED KERUCUT (Cone)
══════════════════════════════════════════════ */
const AnimatedKerucut = () => {
  const [rot, setRot] = useState(0);
  const [floatY, setFloatY] = useState(0);
  const tRef = useRef(0);
  useEffect(() => {
    let id: number;
    const loop = (ts: number) => {
      const dt = ts - tRef.current; tRef.current = ts;
      setRot(r => r + 0.7);
      setFloatY(Math.sin(ts / 900) * 6);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  const W = 180, H = 210, cx = W / 2;
  const baseY = 165 + floatY, tipY = 30 + floatY;
  const rx = 62, ry = 18;
  const segs = 32;
  const faces: { path: string; z: number; fill: string }[] = [];

  for (let i = 0; i < segs; i++) {
    const a1 = (i / segs) * 360, a2 = ((i + 1) / segs) * 360;
    const r1 = (a1 + rot) * Math.PI / 180, r2 = (a2 + rot) * Math.PI / 180;
    const x1b = cx + rx * Math.cos(r1), y1b = baseY + ry * Math.sin(r1);
    const x2b = cx + rx * Math.cos(r2), y2b = baseY + ry * Math.sin(r2);
    const midA = (a1 + a2) / 2;
    const cosV = Math.cos((midA + rot) * Math.PI / 180);
    const z = cosV;
    const norm = (cosV + 1) / 2;
    const r = Math.round(109 + norm * 40);
    const g = Math.round(40 + norm * 30);
    const b = Math.round(217 + norm * 30);
    faces.push({ path: `M${cx},${tipY} L${x1b},${y1b} L${x2b},${y2b}Z`, z, fill: `rgb(${r},${g},${b})` });
  }
  faces.sort((a, b) => a.z - b.z);

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]">
      <defs>
        <radialGradient id="coneBaseGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#5b21b6" />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={baseY} rx={rx} ry={ry} fill="url(#coneBaseGrad)" stroke="#8b5cf6" strokeWidth="1" opacity="0.85" />
      {faces.map((f, i) => <path key={i} d={f.path} fill={f.fill} />)}
      {/* Garis pelukis */}
      <line x1={cx} y1={tipY} x2={cx + rx} y2={baseY} stroke="#ddd6fe" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
      <text x={cx + rx / 2 + 4} y={(tipY + baseY) / 2} fill="#ede9fe" fontSize="10" fontFamily="monospace" opacity="0.9">s</text>
      <line x1={cx} y1={tipY} x2={cx} y2={baseY} stroke="#ddd6fe" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
      <text x={cx + 4} y={(tipY + baseY) / 2} fill="#ede9fe" fontSize="10" fontFamily="monospace" opacity="0.9">t</text>
      <line x1={cx} y1={baseY} x2={cx + rx} y2={baseY} stroke="#ddd6fe" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
      <text x={cx + rx / 2} y={baseY + 14} fill="#ede9fe" fontSize="10" fontFamily="monospace" opacity="0.9">r</text>
      <circle cx={cx} cy={tipY} r="4" fill="#f5d0fe" />
    </svg>
  );
};

/* ══════════════════════════════════════════════
   ANIMATED BOLA (Sphere)
══════════════════════════════════════════════ */
const AnimatedBola = () => {
  const [spin, setSpin] = useState(0);
  useEffect(() => {
    let id: number;
    const loop = () => { setSpin(s => s + 0.5); id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  const R = 70, cx = 100, cy = 100;
  const latLines = 4, lonLines = 6;

  return (
    <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-[0_0_20px_rgba(251,146,60,0.5)]">
      <defs>
        <radialGradient id="sphereGrad" cx="38%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="40%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#7c2d12" />
        </radialGradient>
        <clipPath id="sphereClip"><circle cx={cx} cy={cy} r={R} /></clipPath>
      </defs>
      {/* Base sphere */}
      <circle cx={cx} cy={cy} r={R} fill="url(#sphereGrad)" />
      {/* Latitude lines */}
      {Array.from({ length: latLines }).map((_, i) => {
        const lat = ((i + 1) / (latLines + 1) - 0.5) * Math.PI;
        const yr = cy + R * Math.sin(lat);
        const xr = R * Math.cos(lat);
        return <ellipse key={i} cx={cx} cy={yr} rx={xr} ry={xr * 0.22} fill="none" stroke="rgba(254,215,170,0.35)" strokeWidth="1.2" clipPath="url(#sphereClip)" />;
      })}
      {/* Longitude lines */}
      {Array.from({ length: lonLines }).map((_, i) => {
        const angle = ((i / lonLines) * 360 + spin) % 360;
        const rad = angle * Math.PI / 180;
        const x1 = cx + R * Math.cos(rad);
        const x2 = cx + R * Math.cos(rad + Math.PI);
        return (
          <ellipse key={i} cx={cx} cy={cy} rx={Math.abs(R * Math.sin(rad))} ry={R}
            fill="none" stroke="rgba(254,215,170,0.30)" strokeWidth="1.2" clipPath="url(#sphereClip)" />
        );
      })}
      {/* Highlight */}
      <ellipse cx={cx - 22} cy={cy - 24} rx={20} ry={14} fill="rgba(255,255,255,0.18)" />
      {/* Radius line */}
      <line x1={cx} y1={cy} x2={cx + R * 0.7} y2={cy - R * 0.7} stroke="#fed7aa" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.8" />
      <text x={cx + R * 0.35 + 4} y={cy - R * 0.35 - 4} fill="#fed7aa" fontSize="11" fontFamily="monospace" fontWeight="bold">r</text>
      <circle cx={cx} cy={cy} r="3" fill="#fef3c7" />
    </svg>
  );
};

/* ══════════════════════════════════════════════
   FORMULA CARD
══════════════════════════════════════════════ */
const FormulaCard = ({ headline, latex, accent }: { headline: string; latex: string; accent: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className={`rounded-2xl overflow-hidden border ${accent.border} ${accent.bg}`}
  >
    <div className={`px-4 py-2 ${accent.headBg} flex items-center gap-2`}>
      <span className="text-base">{accent.icon}</span>
      <span className={`font-display text-xs font-black tracking-wide uppercase ${accent.headText}`}>{headline}</span>
    </div>
    <div className="px-4 py-3 flex items-center justify-center">
      <BlockMath math={latex} />
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════════
   SHAPE SECTION
══════════════════════════════════════════════ */
const ShapeSection = ({ shape }: { shape: typeof shapes[0] }) => {
  const [open, setOpen] = useState(true);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl overflow-hidden border ${shape.border} ${shape.sectionBg} mb-5`}
    >
      {/* Header */}
      <button
        onClick={() => { playPopSound(); setOpen(p => !p); }}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
      >
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 ${shape.iconBg}`}>
          {shape.emoji}
        </div>
        <div className="flex-1">
          <h2 className={`font-display text-lg font-black tracking-wide ${shape.titleColor}`}>{shape.name}</h2>
          <p className="font-body text-xs text-white/40 mt-0.5">{shape.subtitle}</p>
        </div>
        <ChevronRight className={`w-5 h-5 ${shape.titleColor} transition-transform duration-300 ${open ? "rotate-90" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={`h-px w-full ${shape.divider}`} />
            <div className="px-5 pb-6 pt-4">
              {/* 3D Shape + Info */}
              <div className="flex flex-col sm:flex-row items-center gap-5 mb-5">
                {/* Animated Shape */}
                <div className={`rounded-2xl p-4 flex items-center justify-center shrink-0 ${shape.shapeBg}`}>
                  {shape.component}
                </div>
                {/* Unsur-unsur */}
                <div className="flex-1">
                  <p className={`font-display text-xs font-black tracking-widest uppercase mb-2 ${shape.titleColor}`}>
                    Unsur-Unsur
                  </p>
                  <ul className="space-y-1.5">
                    {shape.unsur.map((u, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${shape.dot}`} />
                        <span className="font-body text-xs text-white/75 leading-relaxed">{u}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Formula Cards */}
              <p className={`font-display text-xs font-black tracking-widest uppercase mb-3 ${shape.titleColor}`}>
                Rumus-Rumus
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shape.formulas.map((f, i) => (
                  <FormulaCard key={i} headline={f.headline} latex={f.latex} accent={shape.accent} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const shapes = [
  {
    name: "TABUNG",
    emoji: "🥫",
    subtitle: "Silinder · Bangun Sisi Lengkung Beraturan",
    component: <AnimatedTabung />,
    border: "border-cyan-500/20",
    sectionBg: "bg-[#041822]/70 backdrop-blur",
    shapeBg: "bg-cyan-950/40",
    iconBg: "bg-cyan-500/15",
    titleColor: "text-cyan-300",
    divider: "bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent",
    dot: "bg-cyan-400",
    accent: {
      bg: "bg-cyan-950/50",
      border: "border-cyan-500/20",
      headBg: "bg-cyan-500/15",
      headText: "text-cyan-300",
      icon: "📐",
    },
    unsur: [
      "Memiliki 3 sisi: sisi alas, sisi tutup, dan selimut",
      "Memiliki 2 rusuk (tepi atas dan bawah)",
      "Tinggi (t): jarak dari pusat alas ke pusat tutup",
      "Jari-jari (r): jari-jari lingkaran alas atau tutup",
    ],
    formulas: [
      { headline: "Luas Selimut Tabung", latex: "L_{selimut} = 2\\pi r t" },
      { headline: "Luas Permukaan Tabung", latex: "L_{permukaan} = 2\\pi r(r + t)" },
      { headline: "Volume Tabung", latex: "V = \\pi r^2 t" },
    ],
  },
  {
    name: "KERUCUT",
    emoji: "🍦",
    subtitle: "Limas Lingkaran · Bangun Sisi Lengkung",
    component: <AnimatedKerucut />,
    border: "border-violet-500/20",
    sectionBg: "bg-[#0d0818]/70 backdrop-blur",
    shapeBg: "bg-violet-950/40",
    iconBg: "bg-violet-500/15",
    titleColor: "text-violet-300",
    divider: "bg-gradient-to-r from-transparent via-violet-500/30 to-transparent",
    dot: "bg-violet-400",
    accent: {
      bg: "bg-violet-950/50",
      border: "border-violet-500/20",
      headBg: "bg-violet-500/15",
      headText: "text-violet-300",
      icon: "📏",
    },
    unsur: [
      "Memiliki 2 sisi: sisi alas (lingkaran) dan selimut",
      "Memiliki 1 rusuk (tepi alas)",
      "Tinggi (t): jarak titik puncak ke pusat alas",
      "Jari-jari (r): jari-jari lingkaran alas",
      "Garis pelukis (s): s² = r² + t²",
    ],
    formulas: [
      { headline: "Hubungan r, s, dan t", latex: "s^2 = r^2 + t^2" },
      { headline: "Luas Selimut Kerucut", latex: "L_{selimut} = \\pi r s" },
      { headline: "Luas Permukaan Kerucut", latex: "L_{permukaan} = \\pi r(s + r)" },
      { headline: "Volume Kerucut", latex: "V = \\frac{1}{3}\\pi r^2 t" },
    ],
  },
  {
    name: "BOLA",
    emoji: "⚽",
    subtitle: "Bangun Sisi Lengkung Satu Bidang",
    component: <AnimatedBola />,
    border: "border-orange-500/20",
    sectionBg: "bg-[#130a00]/70 backdrop-blur",
    shapeBg: "bg-orange-950/40",
    iconBg: "bg-orange-500/15",
    titleColor: "text-orange-300",
    divider: "bg-gradient-to-r from-transparent via-orange-500/30 to-transparent",
    dot: "bg-orange-400",
    accent: {
      bg: "bg-orange-950/50",
      border: "border-orange-500/20",
      headBg: "bg-orange-500/15",
      headText: "text-orange-300",
      icon: "🌐",
    },
    unsur: [
      "Memiliki 1 sisi (bidang lengkung)",
      "Tidak memiliki rusuk",
      "Tidak memiliki titik sudut",
      "Jari-jari (r): jarak dari pusat ke permukaan bola (semua sama)",
      "Diameter (d) = 2r",
    ],
    formulas: [
      { headline: "Luas Permukaan Bola", latex: "L_{permukaan} = 4\\pi r^2" },
      { headline: "Volume Bola", latex: "V = \\frac{4}{3}\\pi r^3" },
    ],
  },
];

const latihanDasar = [
  { no: 1, soal: "Banyak rusuk pada tabung adalah ...", options: ["A. Tidak ada", "B. 1 buah", "C. 2 buah", "D. 4 buah"] },
  { no: 2, soal: "Banyak sisi pada bola adalah ...", options: ["A. 4 buah", "B. 3 buah", "C. 2 buah", "D. 1 buah"] },
  { no: 3, soal: "Nomor yang menunjukkan rusuk pada kerucut berikut adalah ...", options: ["A. 1", "B. 2", "C. 3", "D. 4"] },
  { no: 4, soal: "Bentuk bangun dari selimut kerucut adalah ...", options: ["A. Tembereng", "B. Segitiga", "C. Lingkaran", "D. Juring lingkaran"] },
  { no: 5, soal: "Bentuk bangun dari selimut tabung adalah", options: ["A. Segi empat", "B. Persegi panjang", "C. Belah ketupat", "D. Bidang lengkung"] },
  { no: 6, soal: "Perhatikan gambar selimut tabung berikut.\nJari-jari tabung yang terjadi adalah ...", options: ["A. 3,5 cm", "B. 5 cm", "C. 7 cm", "D. 10 cm"] },
  { no: 7, soal: "Suatu tabung tanpa tutup dengan jari-jari alas 6 cm dan tingginya 10 cm. Jika $\\pi = 3,14$ maka luas tabung tanpa tutup adalah ...", options: ["A. 602,88 $cm^2$", "B. 489,84 $cm^2$", "C. 376,84 $cm^2$", "D. 301,44 $cm^2$"] },
  { no: 8, soal: "Suatu kerucut jari-jarinya 7 cm dan tingginya 24 cm. Jika $\\pi = \\frac{22}{7}$, maka luas seluruh permukaan kerucut tersebut adalah ...", options: ["A. 682 $cm^2$", "B. 704 $cm^2$", "C. 726 $cm^2$", "D. 752 $cm^2$"] },
  { no: 9, soal: "Sebuah kerucut luas alasnya 154 $cm^2$. Jika tinggi kerucut 24 cm, maka luas seluruh permukaan kerucut adalah ... ($\\pi = \\frac{22}{7}$)", options: ["A. 604 $cm^2$", "B. 614 $cm^2$", "C. 704 $cm^2$", "D. 714 $cm^2$"] },
  { no: 10, soal: "Bila luas kulit bola 616 $cm^2$ dan $\\pi = \\frac{22}{7}$, maka jari-jari bola itu adalah ...", options: ["A. 28 cm", "B. 21 cm", "C. 14 cm", "D. 7 cm"] },
  { no: 11, soal: "Luas permukaan $\\frac{3}{4}$ bola padat yang panjang jari-jarinya 7 cm adalah ... ($\\pi = \\frac{22}{7}$)", options: ["A. 616 $cm^2$", "B. 606 $cm^2$", "C. 462 $cm^2$", "D. 452 $cm^2$"] },
  { no: 12, soal: "Tanti akan membuat dua buah topi ulang tahun dari karton berukuran 30 cm x 50 cm. Jika diameter topi 21 cm dan garis pelukis 20 cm, maka sisa karton yang tidak terpakai adalah ....", options: ["A. 75 $cm^2$", "B. 100 $cm^2$", "C. 150 $cm^2$", "D. 180 $cm^2$"] },
  { no: 13, soal: "Perhatikan gambar topi berbentuk kerucut terbuat dari karton berikut ini!\nJika diameter lingkaran alas 28 cm dan tinggi topi 48 cm, luas karton minimal yang diperlukan untuk membuat 3 buah topi tersebut adalah ....", options: ["A. 2.112 $cm^2$", "B. 2.200 $cm^2$", "C. 6.336 $cm^2$", "D. 6.600 $cm^2$"] },
  { no: 14, soal: "Volume kerucut yang panjang diameternya 21 cm dan tinggi 12 cm adalah ...", options: ["A. 231 $cm^3$", "B. 986 $cm^3$", "C. 1.386 $cm^3$", "D. 2.958 $cm^3$"] },
  { no: 15, soal: "Sebuah kerucut setinggi 30 cm memiliki alas dengan keliling 66 cm ($\\pi = \\frac{22}{7}$). Volume kerucut itu adalah...", options: ["A. 16.860 $cm^3$", "B. 10.395 $cm^3$", "C. 6.930 $cm^3$", "D. 3.465 $cm^3$"] },
  { no: 16, soal: "Diketahui luas selimut kerucut 550 $cm^2$. Jika panjang garis pelukisnya 25 cm, maka volume kerucut adalah...", options: ["A. 1.232 $cm^3$", "B. 1.283 $cm^3$", "C. 3.696 $cm^3$", "D. 3.850 $cm^3$"] },
  { no: 17, soal: "Selisih luas permukaan bola berjari-jari 9 cm dan 5 cm dengan $\\pi = \\frac{22}{7}$ adalah ...", options: ["A. 440 $cm^2$", "B. 528 $cm^2$", "C. 628 $cm^2$", "D. 704 $cm^2$"] },
  { no: 18, soal: "Jika luas seluruh permukaan bola 144$\\pi$ $cm^2$, maka volume bola adalah ....", options: ["A. 278$\\pi$ $cm^3$", "B. 288$\\pi$ $cm^3$", "C. 432$\\pi$ $cm^3$", "D. 442$\\pi$ $cm^3$"] },
  { no: 19, soal: "Nasyara akan membuat nasi tumpeng berbentuk kerucut yang permukaannya akan ditutup penuh dengan hiasan dari makanan. Jika diameter tumpeng 28 cm dan tinggi 48 cm, luas tumpeng yang akan di hias makanan adalah...", options: ["A. 2.112 $cm^2$", "B. 2.200 $cm^2$", "C. 2.288 $cm^2$", "D. 2.376 $cm^2$"] },
  { no: 20, soal: "Panjang jari-jari alas kerucut 6 cm. Jika tinggi kerucut 8 cm, maka luas seluruh permukaan kerucut adalah... ($\\pi = 3,14$).", options: ["A. 3024,4 $cm^2$", "B. 3014,4 $cm^2$", "C. 302,44 $cm^2$", "D. 301,44 $cm^2$"] },
  { no: 21, soal: "Atap sebuah gedung berbentuk setengah bola dengan panjang diameter 14 m. Atap gedung tersebut akan dicat dengan biaya Rp50.000,00 setiap $m^2$. Biaya yang diperlukan untuk mengecat atap gedung itu adalah ....", options: ["A. Rp13.700.000,00", "B. Rp15.400.000,00", "C. Rp15.850.000,00", "D. Rp16.400.000,00"] },
  { no: 22, soal: "Kubah masjid berbentuk setengah bola yang akan dilapisi alumunium disisi luarnya. Panjang jari-jari kubah 3,5 m, luas alumunium yang dibutuhkan adalah ....", options: ["A. 77 $m^2$", "B. 154 $m^2$", "C. 770 $m^2$", "D. 1540 $m^2$"] },
  { no: 23, soal: "Volume sebuah kerucut adalah 314 $cm^3$, Jika jari-jari alasnya 5 cm dan $\\pi = 3,14$, maka panjang garis pelukisnya adalah ...", options: ["A. 4 cm", "B. 12 cm", "C. 13 cm", "D. 20 cm"] },
  { no: 24, soal: "Sebuah drum berbentuk tabung dengan panjang jari-jari 70 cm dan tinggi 100 cm penuh berisi minyak tanah. Minyak tanah tersebut akan dituang ke dalam tabung-tabung kecil dengan panjang jari-jari 35 cm dan tinggi 50 cm. Banyak tabung kecil yang akan diperlukan adalah....", options: ["A. 2 buah", "B. 4 buah", "C. 6 buah", "D. 8 buah"] },
  { no: 25, soal: "Sebuah drum berbentuk tabung dengan diameter alas 10 cm dan tinggi 100 cm. Bila $\\frac{3}{4}$ bagian dari drum berisi minyak, banyak minyak di dalam drum tersebut adalah ...", options: ["A. 8587,5 $cm^3$", "B. 8578,5 $cm^3$", "C. 5887,5 $cm^3$", "D. 5878,5 $cm^3$"] },
  { no: 26, soal: "Panjang jari-jari dua buah bola masing-masing adalah 12 cm dan 20 cm. tentukan perbandingan volume kedua bola itu...", options: ["A. 27 : 125", "B. 9 : 25", "C. 3 : 20", "D. 3 : 5"] },
  { no: 27, soal: "Sebuah kerucut mempunyai volume 40 $cm^3$, jika diameter kerucut diperbesar 2 kali dan tinggi diperbesar 3 kali, maka volume kerucut yang baru adalah ....", options: ["A. 240 $cm^3$", "B. 480 $cm^3$", "C. 720 $cm^3$", "D. 1440 $cm^3$"] },
  { no: 28, soal: "Diketahui volume suatu kerucut 120 $cm^3$, jika diameter kerucut diperbesar dua kali dan tinggi diperpanjang 3 kali, maka volume kerucut sekarang adalah....", options: ["A. 240 $cm^3$", "B. 480 $cm^3$", "C. 1.440 $cm^3$", "D. 1.540 $cm^3$"] },
  { no: 29, soal: "Sebuah kertas karton berbentuk juring lingkaran dengan sudut pusat $216^0$ dan panjang jari-jarinya 15 cm. Jika kertas karton tersebut dibuat kerucut, maka volume kerucut maksimum adalah ....", options: ["A. $324\\pi$ $cm^3$", "B. $405\\pi$ $cm^3$", "C. $620\\pi$ $cm^3$", "D. $675\\pi$ $cm^3$"] },
  { no: 30, soal: "Perhatikan gambar!\nLuas permukaan bangun ruang tersebut adalah ....", options: ["A. 550 $cm^2$", "B. 1320 $cm^2$", "C. 1474 $cm^2$", "D. 1584 $cm^2$"] },
  { no: 31, soal: "Perhatikan gambar!\nLuas permukaan gambar disamping adalah ...", options: ["A. 400$\\pi$ $cm^2$", "B. 800$\\pi$ $cm^2$", "C. 1200$\\pi$ $cm^2$", "D. 1600$\\pi$ $cm^2$"] },
  { no: 32, soal: "Perhatikan gambar!\nGambar diatas merupakan sebuah bandul terbuat dari logam. Jika berat setiap 1 $cm^3$ adalah 15 gram, maka berat bandul seluruhnya adalah ....", options: ["A. 7122 gram", "B. 7212 gram", "C. 7222 gram", "D. 7232 gram"] },
  { no: 33, soal: "Sebuah bandul terdiri dari kerucut dan belahan bola. Jika diameter bola 14 cm dan garis pelukis kerucutnya 25 cm, maka volume bandul tersebut adalah ....", options: ["A. 132,6 $cm^3$", "B. 1232,0 $cm^3$", "C. 1950,7 $cm^3$", "D. 2002,0 $cm^3$"] },
  { no: 34, soal: "Perhatikan gambar benda padat berbentuk tabung dan setengah bola berikut!\nLuas permukaan benda tersebut adalah ... ($\\pi = \\frac{22}{7}$)", options: ["A. 702 cm²", "B. 802 cm²", "C. 902 cm²", "D. 1.002 cm²"] },
  { no: 35, soal: "Perhatikan gambar berikut!\nSebuah peluru terbentuk dari tabung dan kerucut. Volume peluru tersebut adalah...", options: ["A. 4.312,0 $cm^3$", "B. 4.230,0 $cm^3$", "C. 4.358,2 $cm^3$", "D. 5.312,4 $cm^3$"] },
  { no: 36, soal: "Bangun pada gambar berikut terdiri dari tabung dan belahan bola.\nLuas permukaan bangun tersebut adalah....", options: ["A. 880 $cm^2$", "B. 1.496 $cm^2$", "C. 1.596 $cm^2$", "D. 2.010 $cm^2$"] },
  { no: 37, soal: "Gambar di bawah adalah sebuah bola dimasukkan ke sebuah tabung, jika luas permukaan bola 616 $cm^2$. Maka luas permukaan tabung adalah ....", options: ["A. 360 $cm^2$", "B. 300 $cm^2$", "C. 160 $cm^2$", "D. 150 $cm^2$"] },
  { no: 38, soal: "Sebuah bak air berbentuk tabung dengan diameter 140 cm dan memiliki tinggi 1 m yang terisi penuh. Dari tabung tersebut dialirkan air melalui kran dengan debit 20 liter/menit selama 1 jam. Maka volume air yang masih tersisa adalah ...", options: ["A. 40 liter", "B. 140 liter", "C. 240 liter", "D. 340 liter"] },
  { no: 39, soal: "Ke dalam tabung berisi air setinggi 30 cm dimasukkan 6 bola besi yang masing-masing berjari-jari 7 cm. Jika diameter tabung 28 cm, tinggi air dalam tabung setelah dimasukkan enam bola besi adalah ...", options: ["A. 37 cm", "B. 42 cm", "C. 44 cm", "D. 52 cm"] },
  { no: 40, soal: "Sebuah tabung berdiameter 24 cm dan tinggi 50 cm diisi air $\\frac{3}{5}$ dari tingginya. Tiga buah bola besi berjari-jari 6 cm dimasukan kedalam tabung. Tinggi air dalam tabung sekarang adalah ... ($\\pi = \\frac{22}{7}$)", options: ["A. 32 cm", "B. 34 cm", "C. 36 cm", "D. 42 cm"] },
  { no: 41, soal: "Sebuah tabung berjari-jari 10 cm dan tinggi 50 cm berisi air $\\frac{3}{5}$ tinggi tabung. Jika 4 bola besi berjari-jari 5 cm dimasukkan ke dalam tabung, maka permukaan air pada tabung akan naik setinggi ...", options: [] },
  { no: 42, soal: "Sebuah torn pengisi air berbentuk tabung dengan diameter 2 m dan tinggi 10 m. Torn tersebut diisi air dengan debit air 20 liter/menit. Maka torn tersebut akan terisi air hingga penuh selama ...", options: ["A. 2 jam 15 menit", "B. 2 jam 27 menit", "C. 2 jam 37 menit", "D. 2 jam 38 menit"] },
  { no: 43, soal: "Sebuah bola logam dimasukkan ke dalam tabung yang berisi air sehingga permukaan air di dalam tabung menjadi naik. Hitunglah tinggi air yang naik jika diameternya 3 cm dan diameter tabung 5 cm.", options: ["A. 0,72", "B. 52", "C. 18", "D. 7,2"] },
  { no: 44, soal: "Fitra menyalakan lilin berbentuk tabung dengan diameter 2,8 cm dan tinggi 15 cm. Jika setiap menit lilin terbakar 1,68 $cm^3$, maka lilin akan habis terbakar dalam waktu ... ($\\pi = \\frac{22}{7}$)", options: ["A. 48 menit", "B. 50 menit", "C. 55 menit", "D. 56 menit"] },
  { no: 45, soal: "Wadah pembuatan es cream berbentuk tabung dengan diameter 0,2 m dan tinggi 0,75 m. Jika es cream tersebut dimasukkan kedalam corong-corong es cream berbentuk kerucut dengan jari-jari 2,5 cm dan tinggi 10 cm. Maka banyak corong es cream yang dibutuhkan adalah...", options: ["A. 60", "B. 120", "C. 240", "D. 360"] },
];

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2004 Tingkat Kota\nSebuah tempat air berbentuk kerucut. Untuk mengisi tempat itu dengan air sampai pada ketinggian $\\frac{1}{2}t$ diperlukan air sebanyak 38,5 liter. Volum air yang diperlukan untuk memenuhi tempat tersebut adalah ... liter", options: [] },
  { no: 2, soal: "OSN Matematika 2005 Tingkat Kota\nPompa air merk Tangguh sanggup memompa sebanyak 25 liter setiap menit. Pompa merek perkasa sanggup memompa air 400 cc setiap detik, sedangkan merek Tahan Banting sanggup memompa 1,6 $m^3$ setiap jam. Pompa manakah yang paling cepat mengisi sebuah tangka air berkapasitas 500 liter.", options: [] },
  { no: 3, soal: "OSN Matematika 2006 Tingkat Kota\nDiberikan kerucut dengan volume 77 $cm^3$. Jika tinggi kerucut itu 6 cm, maka jari-jari alasnya adalah ... ($\\pi = \\frac{22}{7}$)", options: ["A. 2 cm", "B. 3,5 cm", "C. 7 cm", "D. 10,3 cm", "E. 12,25 cm"] },
  { no: 4, soal: "OSN Matematika 2008 Tingkat Kota\nSuatu kerucut tegak tertutup yang berisi air dengan diameter alas d cm dan tinggi x cm. tinggi air pada kerucut adalah $\\frac{1}{2}x$ cm. jika posisi kerucutnya dibalik, maka tinggi air kerucut tersebut adalah ...", options: [] },
  { no: 5, soal: "OSN Matematika 2011 Tingkat Kota\nPada gambar berikut tabung berisi air, tinggi dan diameter tabung tersebut adalah 18 cm dan 6 cm. kemudian ke dalam tabung dimasukkan 3 bola pejal identic (sama bentuk) sehingga bola tersebut menyinggung sisi tabung dan air dalam tabung keluar, maka sisa air di dalam tabung adalah ... $cm^3$", options: ["A. $51\\pi$", "B. $52\\pi$", "C. $53\\pi$", "D. $54\\pi$", "E. $54\\pi$"] },
  { no: 6, soal: "OSN Matematika 2013 Tingkat Kota\nSebuah silinder tegak diletakkan di dalam kubus ABCD.EFGH dengan panjang sisi kubus 2 m. selanjutnya silinder dipancung oleh bidang miring yang melalui titik A, B dan T Dimana T adalah titik perpotongan diagonal bidang CDHG. Volume terbesar silinder terpancung ini adalah ... $m^3$", options: ["A. $\\frac{3\\pi}{2}$", "B. $\\frac{4\\pi}{3}$", "C. $\\frac{5\\pi}{4}$", "D. $\\frac{5\\pi}{3}$", "E. $\\frac{7\\pi}{5}$"] },
  { no: 7, soal: "OSN Matematika 2015 Tingkat Kota\nDua botol yang berukuran sama berisi penuh dengan larutan gula. Rasio kandungan gula dan air pada botol pertama adalah 2 : 11 dan pada botol kedua 3 : 5. Jika isi botol tersebut dicampurkan, maka rasio kandungan gula dan air hasil campurannya adalah ...", options: [] },
  { no: 8, soal: "OSN Matematika 2016 Tingkat Kota\nKetika suatu segitiga siku-siku diputar pada salah satu sisi siku-sikunya, maka diperoleh kerucut dengan volume $392\\pi$ $cm^3$. Bila diputar pada sisi siku-siku lainnya akan diperoleh kerucut dengan volume $1344\\pi$ $cm^3$. Panjang sisi miring segitiga siku-siku tersebut adalah ... cm", options: [] },
  { no: 9, soal: "OSN Matematika 2019 Tingkat Kota\nDua akuarium A dan B diisi air sehingga volumnya sama yaitu 64.000 $cm^3$.", options: [] },
  { no: 10, soal: "OSN Matematika 2019 Tingkat Kota\nPerhatikan gambar di bawah ini. Gambar tersebut adalah gambar kap lampu yang tidak mempunyai alas dan tutup.", options: ["A. 1130,4", "B. 1120", "C. 565,2", "D. 560,2"] },
  { no: 11, soal: "OSN Matematika 2019 Tingkat Kota\nABCD adalah jajargenjang. E adalah titik Tengah AB. Ruas garis DE memotong AC di titik P.", options: ["A. 12 : 1", "B. 8 : 1", "C. 6 : 1", "D. 4 : 1"] },
  { no: 12, soal: "OSN Matematika 2020 Tingkat Kota\n$R_t$ dan $R_k$ berturut-turut menyatakan jari-jari tabung dan jari-jari kerucut. Jika tinggi tabung dan tinggi kerucut adalah 3600 cm, volum tabung $490\\pi$ liter dan volum kerucut $30\\pi$ liter, maka hubungan antara $R_t$ dan $R_k$ adalah ...", options: ["A. $7R_t = 3R_k$", "B. $3R_t = 7R_k$", "C. $6R_t = 7R_k$", "D. $6R_t = 3R_k$"] },
  { no: 13, soal: "OSN Matematika 2020 Tingkat Kota\nDi dalam sebuah kerucut terdapat sebuah balok. Volum kerucut $600\\pi$ $cm^3$ dan jari-jarinya 10 cm.", options: ["A. 72 $cm^3$", "B. 225 $cm^3$", "C. 450 $cm^3$", "D. 900 $cm^3$"] },
  { no: 14, soal: "OSN Matematika 2022 Tingkat Kota\nDiketahui persegi ABCD dengan panjang sisi 12 cm. titik P terletak pada sisi CD dengan CP : DP = 1 : 2.", options: ["A. 252", "B. 260", "C. 180", "D. 165"] },
  { no: 15, soal: "OSN Matematika 2023 Tingkat Kota\nSuatu bak penampung air berbentuk kerucut terbalik berisi air dengan volume 1 liter. Jika ditambahkan air sebanyak 331 mililiter, maka perbandingan tinggi air mula-mula dan setelah ditambah adalah ...", options: ["A. 10 : 11", "B. 11 : 13", "C. 331 : 1000", "D. 1000 : 1331"] },
  { no: 16, soal: "OSN Matematika 2023 Tingkat Provinsi\nSuatu kerucut memiliki jari-jari alas 3 cm dan panjang sisi miring 5 cm. Kerucut dicelupkan dalam posisi tegak ke dalam wadah berisi cat dengan ketinggian cat 2 cm.", options: [] },
  { no: 17, soal: "OSN Matematika 2024 Tingkat Kota\nDiketahui suatu kerucut dengan titik puncak T, pusat sisi alas O, dan diameter alas AB. Titik C berada pada ruas garis AT dengan AC = OC = 11 cm. Titik D merupakan titik potong antara garis OT dan BC dengan DC = 7 cm. Volume kerucut tersebut adalah ...", options: ["A. $196\\pi$", "B. $960\\pi$", "C. $1960\\pi$", "D. $9600\\pi$"] },
  { no: 18, soal: "OSN Matematika 2024 Tingkat Kota\nDiberikan 4 bola pejal berukuran sama dengan diameter 22 cm dan sebuah silinder dengan diameter 46 cm. Jika air dimasukkan ke dalam silinder sehingga menutupi seluruh permukaan bola, maka volume minimum air yang dimasukkan adalah ...", options: ["A. $307\\frac{1}{3}\\pi$", "B. $529\\frac{1}{3}\\pi$", "C. $1694\\pi$", "D. $7098\\frac{2}{3}\\pi$"] },
];

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
const OlimpiadeBangunRuangSisiLengkungPage = () => {
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");

  const tabs = [
    { key: "materi" as const, label: "Materi", icon: <BookOpen className="w-3.5 h-3.5" /> },
    { key: "dasar" as const, label: "Latihan Dasar", icon: <Dumbbell className="w-3.5 h-3.5" /> },
    { key: "olimpiade" as const, label: "Soal OSN", icon: <Star className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="relative min-h-screen flex flex-col gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 pt-20 pb-12">

        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/25 mb-4">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="font-display text-xs font-bold tracking-widest text-yellow-300 uppercase">Olimpiade Matematika</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
            BANGUN RUANG<br />
            <span className="text-glow-cyan text-cyan-300">SISI LENGKUNG</span>
          </h1>
          <p className="font-body text-xs text-white/40">Irawan Sutiawan, M.Pd · Matematika SMP Kelas 9</p>

          {/* Shape previews row */}
          <div className="flex justify-center gap-6 mt-5">
            {[
              { emoji: "🥫", label: "Tabung", color: "text-cyan-300" },
              { emoji: "🍦", label: "Kerucut", color: "text-violet-300" },
              { emoji: "⚽", label: "Bola", color: "text-orange-300" },
            ].map(s => (
              <motion.div
                key={s.label}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatType: "loop", delay: Math.random() }}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-3xl">{s.emoji}</span>
                <span className={`font-display text-[10px] font-bold ${s.color}`}>{s.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 justify-center mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => { playPopSound(); setActiveTab(tab.key); }}
              className={`flex items-center gap-1.5 font-display text-xs px-4 py-2 rounded-xl border transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-gradient-to-br from-cyan-500/25 to-blue-600/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                  : "bg-white/4 text-white/50 border-white/8 hover:border-white/20 hover:text-white/70"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Materi Tab ── */}
        <AnimatePresence mode="wait">
          {activeTab === "materi" && (
            <motion.div key="materi" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {shapes.map((shape, i) => (
                <ShapeSection key={i} shape={shape} />
              ))}
            </motion.div>
          )}

          {/* ── Latihan Dasar ── */}
          {activeTab === "dasar" && (
            <motion.div key="dasar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
              {latihanDasar.map((soal) => (
                <div key={soal.no} className="bg-[#0a1628]/80 backdrop-blur border border-white/6 rounded-2xl px-5 py-4">
                  <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap leading-relaxed">
                    <span className="text-cyan-400 font-bold font-display">{soal.no}.</span>{" "}
                    {soal.soal.split("\n").map((line, li) => (
                      <span key={li}>{li > 0 && <br />}{renderWithLatex(line)}</span>
                    ))}
                  </div>
                  {brslDasarImages[soal.no] && (
                    <div className="flex justify-center mb-3">
                      <img
                        src={brslDasarImages[soal.no]}
                        alt={`Gambar soal ${soal.no}`}
                        className="max-w-[280px] w-full rounded-lg border border-white/10 bg-white/90 p-2"
                      />
                    </div>
                  )}
                  {soal.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {soal.options.map((opt, j) => (
                        <div key={j} className="font-body text-xs text-white/65 bg-white/4 border border-white/6 rounded-xl px-3 py-2">
                          {renderWithLatex(opt)}
                        </div>
                      ))}
                    </div>
                  )}
                  {brslDasarPembahasan[soal.no] && (
                    <PembahasanCard
                      pembahasanKey={`brsl-dasar-${soal.no}`}
                      pembahasan={brslDasarPembahasan[soal.no]}
                    />
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {/* ── Soal OSN ── */}
          {activeTab === "olimpiade" && (
            <motion.div key="olimpiade" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
              {latihanOlimpiade.map((soal) => (
                <div key={soal.no} className="bg-[#0a1628]/80 backdrop-blur border border-yellow-500/10 rounded-2xl px-5 py-4">
                  <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap leading-relaxed">
                    <span className="text-yellow-400 font-bold font-display">{soal.no}.</span>{" "}
                    {soal.soal.split("\n").map((line, li) => (
                      <span key={li}>
                        {li > 0 && <br />}
                        {li === 0 && line.startsWith("OSN")
                          ? <span className="text-yellow-400 font-semibold font-display text-xs">{line}</span>
                          : renderWithLatex(line)}
                      </span>
                    ))}
                  </div>
                  {soal.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {soal.options.map((opt, j) => (
                        <div key={j} className="font-body text-xs text-white/65 bg-yellow-500/5 border border-yellow-500/10 rounded-xl px-3 py-2">
                          {renderWithLatex(opt)}
                        </div>
                      ))}
                    </div>
                  )}
                  {brslOlimpiadePembahasan[soal.no] && (
                    <PembahasanCard
                      pembahasanKey={`brsl-olim-${soal.no}`}
                      pembahasan={brslOlimpiadePembahasan[soal.no]}
                    />
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OlimpiadeBangunRuangSisiLengkungPage;
