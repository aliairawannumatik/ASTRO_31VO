import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { TrendingUp, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ─────────────────────────────────────────────────────────────
   ANIMATED SVGs
───────────────────────────────────────────────────────────── */

const ScaleComparisonSVG = () => (
  <svg viewBox="0 0 320 180" className="w-full max-w-sm mx-auto my-2" aria-label="Perbandingan skala bangun ruang">
    <defs>
      <style>{`
        @keyframes scaleGlow{0%,100%{opacity:1;}50%{opacity:0.4;}}
        .sc-a{animation:scaleGlow 1.8s ease-in-out infinite;}
        @keyframes arrowPulse{0%,100%{stroke-opacity:1;}50%{stroke-opacity:0.3;}}
        .arr{animation:arrowPulse 1.2s ease-in-out infinite;}
      `}</style>
    </defs>
    {/* Tabung kecil (asli) */}
    <ellipse cx="70" cy="70" rx="35" ry="10" fill="rgba(14,116,144,0.3)" stroke="#0891b2" strokeWidth="1.5"/>
    <rect x="35" y="70" width="70" height="60" fill="rgba(8,145,178,0.15)" stroke="none"/>
    <line x1="35" y1="70" x2="35" y2="130" stroke="#0891b2" strokeWidth="1.5"/>
    <line x1="105" y1="70" x2="105" y2="130" stroke="#0891b2" strokeWidth="1.5"/>
    <ellipse cx="70" cy="130" rx="35" ry="10" fill="rgba(14,116,144,0.3)" stroke="#0891b2" strokeWidth="1.5"/>
    <text x="70" y="155" textAnchor="middle" fill="#67e8f9" fontSize="9" fontFamily="monospace" fontWeight="700">r, t</text>
    <text x="70" y="165" textAnchor="middle" fill="#a5f3fc" fontSize="8" fontFamily="monospace">V = πr²t</text>

    {/* Panah → */}
    <line x1="120" y1="100" x2="155" y2="100" stroke="#fbbf24" strokeWidth="2.5" className="arr"/>
    <polygon points="155,96 163,100 155,104" fill="#fbbf24" className="sc-a"/>
    <text x="140" y="94" textAnchor="middle" fill="#fbbf24" fontSize="8" fontFamily="monospace">× k</text>

    {/* Tabung besar (diperbesar k kali) */}
    <ellipse cx="240" cy="55" rx="55" ry="15" fill="rgba(168,85,247,0.3)" stroke="#a855f7" strokeWidth="2"/>
    <rect x="185" y="55" width="110" height="90" fill="rgba(168,85,247,0.12)" stroke="none"/>
    <line x1="185" y1="55" x2="185" y2="145" stroke="#a855f7" strokeWidth="2"/>
    <line x1="295" y1="55" x2="295" y2="145" stroke="#a855f7" strokeWidth="2"/>
    <ellipse cx="240" cy="145" rx="55" ry="15" fill="rgba(168,85,247,0.3)" stroke="#a855f7" strokeWidth="2"/>
    <text x="240" y="163" textAnchor="middle" fill="#d8b4fe" fontSize="9" fontFamily="monospace" fontWeight="700">kr, kt</text>
    <text x="240" y="173" textAnchor="middle" fill="#c4b5fd" fontSize="8" fontFamily="monospace">V = k³·πr²t</text>
  </svg>
);

const TabungPerubahanSVG = ({ kFactor }: { kFactor: number }) => {
  const r = 40;
  const h = 60;
  const r2 = r * kFactor;
  const h2 = h * kFactor;
  const cx1 = 70, cx2 = 220;
  return (
    <svg viewBox="0 0 300 180" className="w-full max-w-sm mx-auto" aria-label="Tabung sebelum dan sesudah perubahan">
      {/* Tabung 1 */}
      <ellipse cx={cx1} cy={50} rx={r} ry={r * 0.3} fill="rgba(14,116,144,0.35)" stroke="#0891b2" strokeWidth="1.5"/>
      <rect x={cx1 - r} y={50} width={r * 2} height={h} fill="rgba(8,145,178,0.2)" stroke="none"/>
      <line x1={cx1 - r} y1={50} x2={cx1 - r} y2={50 + h} stroke="#0891b2" strokeWidth="1.5"/>
      <line x1={cx1 + r} y1={50} x2={cx1 + r} y2={50 + h} stroke="#0891b2" strokeWidth="1.5"/>
      <ellipse cx={cx1} cy={50 + h} rx={r} ry={r * 0.3} fill="rgba(14,116,144,0.35)" stroke="#0891b2" strokeWidth="1.5"/>
      <text x={cx1} y={50 + h + 20} textAnchor="middle" fill="#67e8f9" fontSize="9" fontFamily="monospace">Asal</text>

      {/* Tabung 2 */}
      <ellipse cx={cx2} cy={50} rx={Math.min(r2, 55)} ry={Math.min(r2, 55) * 0.3} fill="rgba(168,85,247,0.35)" stroke="#a855f7" strokeWidth="2"/>
      <rect x={cx2 - Math.min(r2, 55)} y={50} width={Math.min(r2, 55) * 2} height={Math.min(h2, 100)} fill="rgba(168,85,247,0.15)" stroke="none"/>
      <line x1={cx2 - Math.min(r2, 55)} y1={50} x2={cx2 - Math.min(r2, 55)} y2={50 + Math.min(h2, 100)} stroke="#a855f7" strokeWidth="2"/>
      <line x1={cx2 + Math.min(r2, 55)} y1={50} x2={cx2 + Math.min(r2, 55)} y2={50 + Math.min(h2, 100)} stroke="#a855f7" strokeWidth="2"/>
      <ellipse cx={cx2} cy={50 + Math.min(h2, 100)} rx={Math.min(r2, 55)} ry={Math.min(r2, 55) * 0.3} fill="rgba(168,85,247,0.35)" stroke="#a855f7" strokeWidth="2"/>
      <text x={cx2} y={50 + Math.min(h2, 100) + 20} textAnchor="middle" fill="#d8b4fe" fontSize="9" fontFamily="monospace">
        {kFactor}× lebih besar
      </text>

      {/* Arrow */}
      <line x1="120" y1="90" x2="155" y2="90" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,2"/>
      <polygon points="155,86 162,90 155,94" fill="#fbbf24"/>
      <text x="138" y="85" textAnchor="middle" fill="#fbbf24" fontSize="8" fontFamily="monospace">×{kFactor}</text>
    </svg>
  );
};

const BolaPerubahanSVG = () => (
  <svg viewBox="0 0 280 140" className="w-full max-w-sm mx-auto my-2" aria-label="Perubahan bola">
    <defs>
      <radialGradient id="bGrad1" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9"/>
        <stop offset="100%" stopColor="#0e7490" stopOpacity="0.7"/>
      </radialGradient>
      <radialGradient id="bGrad2" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9"/>
        <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.7"/>
      </radialGradient>
    </defs>
    {/* Bola kecil */}
    <circle cx="70" cy="70" r="35" fill="url(#bGrad1)" stroke="#0891b2" strokeWidth="1.5"/>
    <text x="70" y="115" textAnchor="middle" fill="#67e8f9" fontSize="9" fontFamily="monospace">r</text>
    {/* Arrow */}
    <line x1="115" y1="70" x2="150" y2="70" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,2"/>
    <polygon points="150,66 157,70 150,74" fill="#fbbf24"/>
    <text x="132" y="65" textAnchor="middle" fill="#fbbf24" fontSize="8" fontFamily="monospace">×2</text>
    {/* Bola besar */}
    <circle cx="215" cy="70" r="55" fill="url(#bGrad2)" stroke="#a855f7" strokeWidth="2"/>
    <text x="215" y="134" textAnchor="middle" fill="#d8b4fe" fontSize="9" fontFamily="monospace">2r</text>
    {/* Labels */}
    <text x="70" y="125" textAnchor="middle" fill="#a5f3fc" fontSize="8" fontFamily="monospace">V = (4/3)πr³</text>
    <text x="215" y="8" textAnchor="middle" fill="#c4b5fd" fontSize="8" fontFamily="monospace">V = 8 × (4/3)πr³ (r²→4r², L×4)</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE SCALE CALCULATOR
───────────────────────────────────────────────────────────── */
const ScaleCalculator = () => {
  const [shape, setShape] = useState<"tabung" | "kerucut" | "bola">("tabung");
  const [kR, setKR] = useState(2);
  const [kT, setKT] = useState(1);

  const computeVolumeRatio = () => {
    if (shape === "bola") return Math.pow(kR, 3);
    if (shape === "tabung") return Math.pow(kR, 2) * kT;
    return Math.pow(kR, 2) * kT;
  };
  const computeLuasRatio = () => {
    if (shape === "bola") return Math.pow(kR, 2);
    if (shape === "tabung") return Math.pow(kR, 2);
    return Math.pow(kR, 2);
  };

  const vRatio = computeVolumeRatio();
  const lRatio = computeLuasRatio();

  return (
    <div className="bg-slate-800/70 border border-slate-600/40 rounded-xl p-4 space-y-4 font-body">
      <p className="text-cyan-300 font-bold text-sm">🧮 Kalkulator Perubahan Skala Interaktif</p>
      <div className="flex flex-wrap gap-2">
        {(["tabung","kerucut","bola"] as const).map(s => (
          <button key={s} onClick={() => { playPopSound(); setShape(s); }}
            className={`px-3 py-1.5 text-xs font-bold border rounded-lg transition-colors cursor-pointer ${shape === s ? "bg-cyan-800/80 border-cyan-500 text-cyan-200" : "bg-slate-900/60 border-slate-600 text-slate-300"}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-white/60 mb-1 block">Perubahan jari-jari (k_r): <strong className="text-yellow-300">{kR}×</strong></label>
          <input type="range" min={1} max={5} step={0.5} value={kR}
            onChange={e => setKR(parseFloat(e.target.value))}
            className="w-full accent-cyan-400"/>
        </div>
        {shape !== "bola" && (
          <div>
            <label className="text-xs text-white/60 mb-1 block">Perubahan tinggi (k_t): <strong className="text-green-300">{kT}×</strong></label>
            <input type="range" min={1} max={5} step={0.5} value={kT}
              onChange={e => setKT(parseFloat(e.target.value))}
              className="w-full accent-green-400"/>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-950/60 border border-blue-700/40 rounded-lg p-3 text-center">
          <p className="text-blue-300 text-xs font-bold mb-1">📦 Volume menjadi</p>
          <p className="text-white text-2xl font-bold font-mono">{vRatio}×</p>
          <p className="text-blue-200 text-xs">dari volume asal</p>
        </div>
        <div className="bg-orange-950/60 border border-orange-700/40 rounded-lg p-3 text-center">
          <p className="text-orange-300 text-xs font-bold mb-1">🎨 Luas Permukaan</p>
          <p className="text-white text-2xl font-bold font-mono">{lRatio}×</p>
          <p className="text-orange-200 text-xs">dari luas asal</p>
        </div>
      </div>
      <p className="text-white/40 text-xs">* Hasil berlaku jika hanya jari-jari dan/atau tinggi yang diubah secara proporsional</p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SECTIONS DATA
───────────────────────────────────────────────────────────── */
type Sec = { title: string; icon: string; content: React.ReactNode };

const sections: Sec[] = [
  {
    title: "Konsep Perubahan Dimensi",
    icon: "🔄",
    content: (
      <div className="space-y-4 font-body">
        <p className="text-white/80 text-sm leading-relaxed">
          Pernahkah kamu bertanya: <em>"Kalau jari-jari tabung diperbesar 2 kali, apakah volumenya juga 2 kali lebih besar?"</em>{" "}
          Jawabannya adalah <strong className="text-red-400">TIDAK</strong> — dan inilah yang akan kita pelajari di bab ini!
        </p>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-4 text-sm text-cyan-100 space-y-2">
          <p className="font-semibold text-cyan-300">📌 Konsep Inti:</p>
          <p>Jika <strong>satu unsur</strong> bangun ruang (seperti jari-jari atau tinggi) diubah sebesar faktor <strong className="text-yellow-300">k</strong>, maka:</p>
          <ul className="list-disc list-inside space-y-1 text-white/80 text-xs mt-2">
            <li><strong className="text-orange-300">Luas permukaan</strong> berubah sebesar <strong className="text-yellow-300">k²</strong> kali (proporsional dengan pangkat 2)</li>
            <li><strong className="text-blue-300">Volume</strong> berubah sebesar <strong className="text-yellow-300">k³</strong> kali (proporsional dengan pangkat 3)</li>
          </ul>
        </div>
        <ScaleComparisonSVG />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
            <p className="text-yellow-400 font-bold text-sm">🔑 Aturan Kunci:</p>
            <p>• <strong className="text-orange-300">Luas</strong> ~ dimensi <strong>pangkat 2</strong></p>
            <p>• <strong className="text-blue-300">Volume</strong> ~ dimensi <strong>pangkat 3</strong></p>
            <p>• Semua dimensi × k → L × k², V × k³</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3 text-xs text-slate-300 space-y-1">
            <p className="text-cyan-400 font-bold text-sm">📐 Contoh Nyata:</p>
            <p>• Bola mini → Bola basket (r × 3)</p>
            <p>• L permukaan → 9× lebih besar</p>
            <p>• Volume → 27× lebih besar</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Perubahan pada Tabung",
    icon: "🔵",
    content: (
      <div className="space-y-4 font-body">
        <p className="text-white/80 text-sm">
          Tabung memiliki dua variabel: <strong className="text-yellow-300">r (jari-jari)</strong> dan <strong className="text-green-300">t (tinggi)</strong>.
          Perubahan masing-masing memberi efek yang berbeda!
        </p>
        <div className="space-y-3">
          <div className="bg-amber-950/40 border border-amber-700/40 rounded-xl p-4 space-y-2">
            <p className="text-amber-300 font-bold text-sm">1. Jika Jari-jari (r) Diperbesar k kali (tinggi tetap)</p>
            <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
              <p className="text-white/60 mb-1">Rumus asli: <InlineMath math="V = \pi r^2 t" />, <InlineMath math="L = 2\pi r^2 + 2\pi r t" /></p>
              <BlockMath math="V_{\text{baru}} = \pi (kr)^2 t = k^2 \cdot \pi r^2 t = k^2 \cdot V" />
              <p className="text-orange-300 font-semibold">→ Volume menjadi <strong>k²</strong> kali volume semula</p>
              <BlockMath math="L_{\text{baru}} = 2\pi (kr)^2 + 2\pi (kr) t = k^2 \cdot 2\pi r^2 + k \cdot 2\pi r t" />
              <p className="text-orange-300 text-xs">→ Luas tidak bisa disederhanakan menjadi k² × L kecuali t juga turut berubah</p>
            </div>
          </div>
          <div className="bg-green-950/40 border border-green-700/40 rounded-xl p-4 space-y-2">
            <p className="text-green-300 font-bold text-sm">2. Jika Tinggi (t) Diperbesar k kali (jari-jari tetap)</p>
            <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
              <BlockMath math="V_{\text{baru}} = \pi r^2 \cdot (kt) = k \cdot \pi r^2 t = k \cdot V" />
              <p className="text-green-300 font-semibold">→ Volume menjadi <strong>k</strong> kali volume semula</p>
              <p className="text-white/60 text-xs">Luas selimut: <InlineMath math="L_s = 2\pi r \cdot kt = k \cdot 2\pi rt" /> → selimut menjadi k kali</p>
            </div>
          </div>
          <div className="bg-blue-950/40 border border-blue-700/40 rounded-xl p-4 space-y-2">
            <p className="text-blue-300 font-bold text-sm">3. Jika Semua Dimensi Diperbesar k kali (r → kr, t → kt)</p>
            <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
              <BlockMath math="V_{\text{baru}} = \pi (kr)^2 (kt) = k^3 \cdot \pi r^2 t = k^3 \cdot V" />
              <BlockMath math="L_{\text{baru}} = 2\pi (kr)^2 + 2\pi (kr)(kt) = k^2(2\pi r^2 + 2\pi rt) = k^2 \cdot L" />
            </div>
            <div className="bg-blue-950/70 border border-blue-600/40 rounded p-2 text-xs">
              <p className="text-blue-200 font-semibold">✨ Kesimpulan:</p>
              <p className="text-white/80">Jika semua dimensi × k: <strong className="text-yellow-300">L × k²</strong> dan <strong className="text-yellow-300">V × k³</strong></p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead><tr className="bg-slate-800">
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">Perubahan</th>
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">Volume</th>
              <th className="px-3 py-2 text-cyan-300">Luas Permukaan</th>
            </tr></thead>
            <tbody>
              {[
                ["r → kr (t tetap)","V_baru = k² × V","Tidak proporsional"],
                ["t → kt (r tetap)","V_baru = k × V","Selimut = k × L_s"],
                ["r → kr, t → kt","V_baru = k³ × V","L_baru = k² × L"],
              ].map(([b, r, c], i) => (
                <tr key={i} className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/30"}`}>
                  <td className="px-3 py-2 text-white/90 font-semibold border-r border-slate-700 text-left">{b}</td>
                  <td className="px-3 py-2 text-blue-300 font-mono border-r border-slate-700">{r}</td>
                  <td className="px-3 py-2 text-orange-300 font-mono text-left">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    title: "Perubahan pada Kerucut",
    icon: "🔺",
    content: (
      <div className="space-y-4 font-body">
        <p className="text-white/80 text-sm">
          Kerucut memiliki <strong className="text-yellow-300">r (jari-jari)</strong>, <strong className="text-green-300">t (tinggi)</strong>, dan{" "}
          <strong className="text-purple-300">s (garis pelukis)</strong> di mana <InlineMath math="s = \sqrt{r^2 + t^2}" />.
        </p>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4 space-y-3">
          <p className="text-orange-300 font-bold text-sm">📐 Rumus Kerucut (Asal):</p>
          <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
            <p><InlineMath math="V = \frac{1}{3} \pi r^2 t" /></p>
            <p><InlineMath math="L = \pi r^2 + \pi r s" /></p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-amber-950/40 border border-amber-700/40 rounded-xl p-4 space-y-2">
            <p className="text-amber-300 font-bold text-sm">Jika Jari-jari (r) → kr (tinggi tetap)</p>
            <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
              <BlockMath math="V_{\text{baru}} = \frac{1}{3}\pi (kr)^2 t = k^2 \cdot \frac{1}{3}\pi r^2 t = k^2 \cdot V" />
              <p className="text-white/60">Garis pelukis baru: <InlineMath math="s_{\text{baru}} = \sqrt{(kr)^2 + t^2} \neq k \cdot s" /></p>
              <p className="text-amber-300 font-semibold">→ Volume menjadi k² kali; luas permukaan tidak sederhana karena s berubah berbeda</p>
            </div>
          </div>
          <div className="bg-blue-950/40 border border-blue-700/40 rounded-xl p-4 space-y-2">
            <p className="text-blue-300 font-bold text-sm">Jika Semua Dimensi → k kali (r → kr, t → kt, s → ks)</p>
            <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
              <BlockMath math="V_{\text{baru}} = \frac{1}{3}\pi (kr)^2(kt) = k^3 \cdot V" />
              <BlockMath math="L_{\text{baru}} = \pi (kr)^2 + \pi (kr)(ks) = k^2(\pi r^2 + \pi rs) = k^2 \cdot L" />
            </div>
            <div className="bg-blue-950/70 border border-blue-600/40 rounded p-2 text-xs text-blue-200 font-semibold">
              ✨ Prinsip yang sama: Semua dimensi × k → L × k², V × k³
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Perubahan pada Bola",
    icon: "⚽",
    content: (
      <div className="space-y-4 font-body">
        <p className="text-white/80 text-sm">
          Bola hanya punya satu variabel: <strong className="text-yellow-300">r (jari-jari)</strong>. Sehingga perubahan jari-jari langsung berpengaruh ke semua!
        </p>
        <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4 space-y-3">
          <p className="text-orange-300 font-bold text-sm">📐 Rumus Bola (Asal):</p>
          <div className="bg-slate-900/60 rounded p-3 text-xs space-y-1">
            <p><InlineMath math="V = \frac{4}{3} \pi r^3" /></p>
            <p><InlineMath math="L = 4 \pi r^2" /></p>
          </div>
        </div>
        <div className="bg-purple-950/40 border border-purple-700/40 rounded-xl p-4 space-y-3">
          <p className="text-purple-300 font-bold text-sm">Jika r → kr:</p>
          <div className="bg-slate-900/60 rounded p-3 text-xs space-y-2">
            <BlockMath math="V_{\text{baru}} = \frac{4}{3}\pi (kr)^3 = k^3 \cdot \frac{4}{3}\pi r^3 = k^3 \cdot V" />
            <BlockMath math="L_{\text{baru}} = 4\pi (kr)^2 = k^2 \cdot 4\pi r^2 = k^2 \cdot L" />
          </div>
          <div className="bg-purple-950/70 border border-purple-600/40 rounded p-3 text-xs">
            <p className="text-purple-200 font-semibold">✨ Untuk bola, sangat mudah diingat:</p>
            <p className="text-white/80 mt-1">• r diperbesar <strong className="text-yellow-300">2×</strong> → V menjadi <strong className="text-blue-300">8×</strong>, L menjadi <strong className="text-orange-300">4×</strong></p>
            <p className="text-white/80">• r diperbesar <strong className="text-yellow-300">3×</strong> → V menjadi <strong className="text-blue-300">27×</strong>, L menjadi <strong className="text-orange-300">9×</strong></p>
          </div>
        </div>
        <BolaPerubahanSVG />
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead><tr className="bg-slate-800">
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700">r diperbesar</th>
              <th className="px-3 py-2 text-orange-300 border-r border-slate-700">L menjadi</th>
              <th className="px-3 py-2 text-blue-300">V menjadi</th>
            </tr></thead>
            <tbody>
              {[[2,4,8],[3,9,27],[4,16,64],[5,25,125]].map(([k,l,v],i) => (
                <tr key={i} className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/30"}`}>
                  <td className="px-3 py-2 text-yellow-300 font-bold border-r border-slate-700">{k}× lebih besar</td>
                  <td className="px-3 py-2 text-orange-300 font-mono border-r border-slate-700">{l}× L</td>
                  <td className="px-3 py-2 text-blue-300 font-mono">{v}× V</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    title: "Kalkulator & Ringkasan Perubahan",
    icon: "📊",
    content: (
      <div className="space-y-4 font-body">
        <ScaleCalculator />
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-xs text-center">
            <thead><tr className="bg-slate-800">
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">Bangun</th>
              <th className="px-3 py-2 text-cyan-300 border-r border-slate-700 text-left">Perubahan</th>
              <th className="px-3 py-2 text-orange-300 border-r border-slate-700">Luas Permukaan</th>
              <th className="px-3 py-2 text-blue-300">Volume</th>
            </tr></thead>
            <tbody>
              {[
                ["Tabung","r→kr, t→kt","× k²","× k³"],
                ["Tabung","r→kr (t tetap)","Tidak sederhana","× k²"],
                ["Tabung","t→kt (r tetap)","Selimut × k","× k"],
                ["Kerucut","r→kr, t→kt, s→ks","× k²","× k³"],
                ["Bola","r→kr","× k²","× k³"],
              ].map(([b, p, l, v], i) => (
                <tr key={i} className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/30"}`}>
                  <td className="px-3 py-2 text-white/90 font-semibold border-r border-slate-700 text-left">{b}</td>
                  <td className="px-3 py-2 text-yellow-300 font-mono border-r border-slate-700 text-left">{p}</td>
                  <td className="px-3 py-2 text-orange-300 font-mono border-r border-slate-700">{l}</td>
                  <td className="px-3 py-2 text-blue-300 font-mono">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
          <p>🚀 <strong>Cara cepat mengingat:</strong></p>
          <p>• Dimensi linier × k → Luas (2D) × k² → Volume (3D) × k³</p>
          <p>• Bayangkan seperti: memperbesar panjang sisi kubus — luas sisi jadi k², volume jadi k³!</p>
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   EXAMPLE PROBLEMS
───────────────────────────────────────────────────────────── */
type Ex = { level: string; color: string; bg: string; border: string; badgeBg: string; question: React.ReactNode; answer: React.ReactNode };

const examples: Ex[] = [
  {
    level: "MUDAH", color: "text-green-400", bg: "bg-green-950/30", border: "border-green-700/50", badgeBg: "bg-green-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah bola memiliki jari-jari <InlineMath math="5 \text{ cm}" /> dan volume <InlineMath math="V" />.</p>
        <p>Jika jari-jari bola diperbesar menjadi <InlineMath math="10 \text{ cm}" />, berapa kali volume bola yang baru dibanding volume semula?</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-green-400 font-semibold">Analisis: r diperbesar dari 5 cm → 10 cm</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <p>Faktor perubahan:</p>
          <BlockMath math="k = \frac{r_{\text{baru}}}{r_{\text{lama}}} = \frac{10}{5} = 2" />
          <p>Karena <InlineMath math="V = \frac{4}{3}\pi r^3" />, maka:</p>
          <BlockMath math="V_{\text{baru}} = \frac{4}{3}\pi (2r)^3 = 2^3 \cdot V = 8V" />
        </div>
        <div className="bg-green-950/60 border border-green-700/40 rounded p-3">
          <p className="text-green-300 font-semibold">✅ Volume bola baru = <strong>8 kali</strong> volume semula</p>
        </div>
      </div>
    ),
  },
  {
    level: "SEDANG", color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-700/50", badgeBg: "bg-yellow-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah tabung memiliki jari-jari <InlineMath math="r" /> dan tinggi <InlineMath math="t" />.</p>
        <p>Jika jari-jari diperbesar <strong>3 kali</strong> dan tinggi <strong>diperkecil menjadi setengahnya</strong>, bagaimana perbandingan volume baru terhadap volume lama?</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-yellow-400 font-semibold">Diketahui: <InlineMath math="r_{\text{baru}} = 3r" />, <InlineMath math="t_{\text{baru}} = \frac{t}{2}" /></p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-2">
          <BlockMath math="V_{\text{lama}} = \pi r^2 t" />
          <BlockMath math="V_{\text{baru}} = \pi (3r)^2 \cdot \frac{t}{2} = \pi \cdot 9r^2 \cdot \frac{t}{2} = \frac{9}{2} \pi r^2 t" />
          <BlockMath math="\frac{V_{\text{baru}}}{V_{\text{lama}}} = \frac{\frac{9}{2}\pi r^2 t}{\pi r^2 t} = \frac{9}{2} = 4{,}5" />
        </div>
        <div className="bg-yellow-950/60 border border-yellow-700/40 rounded p-3 text-xs">
          <p className="text-yellow-300 font-semibold">✅ Volume baru = <strong>4,5 kali</strong> volume lama</p>
          <p className="text-white/60 mt-1">Meskipun tinggi diperkecil ½, perbesaran r³ lebih mendominasi</p>
        </div>
      </div>
    ),
  },
  {
    level: "SULIT", color: "text-red-400", bg: "bg-red-950/30", border: "border-red-700/50", badgeBg: "bg-red-900/60",
    question: (
      <div className="text-sm text-white/85 font-body space-y-1">
        <p>Sebuah tabung A memiliki jari-jari <InlineMath math="6 \text{ cm}" /> dan tinggi <InlineMath math="10 \text{ cm}" />.</p>
        <p>Tabung B memiliki luas permukaan <strong>4 kali</strong> tabung A dan tinggi yang sama dengan tabung A.</p>
        <p>Tentukan: (a) jari-jari tabung B, (b) perbandingan volume tabung B terhadap tabung A.</p>
        <p className="text-xs text-white/50">(π = 3,14)</p>
      </div>
    ),
    answer: (
      <div className="space-y-3 text-sm font-body">
        <p className="text-red-400 font-semibold">Langkah 1 — Hitung luas permukaan tabung A:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="L_A = 2\pi r_A^2 + 2\pi r_A t = 2\pi (6)^2 + 2\pi (6)(10)" />
          <BlockMath math="L_A = 2 \times 3{,}14 \times 36 + 2 \times 3{,}14 \times 60" />
          <BlockMath math="L_A = 226{,}08 + 376{,}8 = 602{,}88 \text{ cm}^2" />
        </div>
        <p className="text-red-400 font-semibold">Langkah 2 — Cari jari-jari tabung B (L_B = 4 × L_A, t sama):</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="L_B = 4 \times L_A = 4 \times 602{,}88 = 2411{,}52 \text{ cm}^2" />
          <BlockMath math="2\pi r_B^2 + 2\pi r_B (10) = 2411{,}52" />
          <BlockMath math="6{,}28 r_B^2 + 62{,}8 r_B - 2411{,}52 = 0" />
          <p className="text-white/60">Bagi dengan 6,28:</p>
          <BlockMath math="r_B^2 + 10 r_B - 384 = 0" />
          <BlockMath math="(r_B - 16)(r_B + 24) = 0 \Rightarrow r_B = 16 \text{ cm}" />
        </div>
        <p className="text-red-400 font-semibold">Langkah 3 — Perbandingan volume:</p>
        <div className="bg-slate-800/60 border border-slate-600 rounded p-3 text-xs space-y-1">
          <BlockMath math="\frac{V_B}{V_A} = \frac{\pi r_B^2 t}{\pi r_A^2 t} = \frac{r_B^2}{r_A^2} = \frac{16^2}{6^2} = \frac{256}{36} = \frac{64}{9} \approx 7{,}11" />
        </div>
        <div className="bg-red-950/60 border border-red-700/40 rounded p-3 text-xs space-y-1">
          <p className="text-red-300 font-semibold">✅ Jawaban:</p>
          <p className="text-white/80">• Jari-jari tabung B = <strong className="text-yellow-300">16 cm</strong></p>
          <p className="text-white/80">• Volume B : Volume A = <strong className="text-yellow-300">64 : 9</strong> ≈ 7,11 kali lebih besar</p>
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   EXAMPLE CARD COMPONENT
───────────────────────────────────────────────────────────── */

const ExampleCard = ({ ex, idx, prefix }: { ex: Ex; idx: number; prefix: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className={`border ${ex.border} rounded-xl overflow-hidden`}>
      <div className={`${ex.bg} px-5 py-4`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold font-display px-2 py-0.5 rounded ${ex.badgeBg} ${ex.color} border ${ex.border}`}>
            {prefix} {idx + 1} — {ex.level}
          </span>
        </div>
        {ex.question}
      </div>
      <button onClick={() => { playPopSound(); setShow(v => !v); }}
        className="w-full flex items-center justify-between px-5 py-3 bg-slate-800/60 hover:bg-slate-800/90 transition-colors cursor-pointer border-t border-slate-700/50">
        <span className={`text-xs font-semibold font-body ${ex.color}`}>{show ? "Sembunyikan" : "Lihat Pembahasan"}</span>
        {show ? <ChevronUp className="w-4 h-4 text-muted-foreground"/> : <ChevronDown className="w-4 h-4 text-muted-foreground"/>}
      </button>
      {show && <div className="px-5 py-4 bg-slate-900/60 border-t border-slate-700/30">{ex.answer}</div>}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
const PerubahanVolumePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Pengantar: Perubahan Luas & Volume",
      icon: "🔄",
      content: (
        <div className="space-y-4 font-body">
          <p className="text-white/80 text-sm leading-relaxed">
            Apa yang terjadi jika jari-jari sebuah bola diperbesar 3 kali? Apakah volumenya juga 3 kali?{" "}
            <strong className="text-red-400">Tidak!</strong> Di sini kamu akan belajar bagaimana perubahan{" "}
            <strong className="text-yellow-300">satu unsur</strong> bangun ruang sisi lengkung memengaruhi{" "}
            <strong className="text-orange-300">luas permukaan</strong> dan <strong className="text-blue-300">volume</strong>-nya secara dramatis.
          </p>
          <ScaleComparisonSVG />
          <div className="bg-cyan-950/50 border border-cyan-700/40 rounded-lg p-3 text-xs text-cyan-200 space-y-1">
            <p className="font-bold text-cyan-300">🚀 Cara cepat mengingat:</p>
            <p>• Dimensi linier × k → Luas (2D) × k² → Volume (3D) × k³</p>
            <p>• Seperti memperbesar panjang sisi kubus: luas sisi jadi k², volume jadi k³!</p>
          </div>
        </div>
      ),
    },
    ...sections.map(sec => ({ title: sec.title, icon: sec.icon, content: sec.content })),
    {
      title: "Contoh Soal — Perubahan Volume & Luas",
      icon: "📝",
      content: (
        <div className="space-y-4">
          <p className="text-white/40 text-xs text-center font-body">Latihan bertingkat dari mudah hingga sulit</p>
          <div className="flex flex-col gap-4">
            {examples.map((ex, i) => <ExampleCard key={`e${i}`} ex={ex} idx={i} prefix="SOAL"/>)}
          </div>
        </div>
      ),
    },
  ];

  const total = slides.length;
  const slide = slides[currentSlide];

  const goPrev = () => { playPopSound(); setCurrentSlide(i => Math.max(0, i - 1)); };
  const goNext = () => { playPopSound(); setCurrentSlide(i => Math.min(total - 1, i + 1)); };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <TrendingUp className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          PERUBAHAN LUAS DAN VOLUME BANGUN RUANG SISI LENGKUNG
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Bangun Ruang Sisi Lengkung</p>

        <div className="flex justify-center gap-1.5 mb-6 flex-wrap">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { playPopSound(); setCurrentSlide(i); }}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${i === currentSlide ? "bg-primary scale-125" : "bg-white/20 hover:bg-white/40"}`}
            />
          ))}
        </div>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden mb-6">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50">
            <span className="text-2xl">{slide.icon}</span>
            <h2 className="font-display text-sm font-semibold text-white">{slide.title}</h2>
            <span className="ml-auto text-xs text-white/30 font-body">{currentSlide + 1}/{total}</span>
          </div>
          <div className="px-5 py-5">{slide.content}</div>
        </div>

        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-body border border-border rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors cursor-pointer disabled:cursor-default"
          >
            <ChevronLeft className="w-4 h-4" /> Sebelumnya
          </button>
          <button
            onClick={goNext}
            disabled={currentSlide === total - 1}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-body border border-border rounded-lg disabled:opacity-30 hover:bg-white/5 transition-colors cursor-pointer disabled:cursor-default"
          >
            Selanjutnya <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/bangun-ruang-sisi-lengkung"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Bangun Ruang Sisi Lengkung
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerubahanVolumePage;
