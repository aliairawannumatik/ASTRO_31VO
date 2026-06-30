import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Layers, Edit } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const W = 180, H = 150, MX = 90, MY = 75, SC = 14;
const toX = (x: number) => MX + x * SC;
const toY = (y: number) => MY - y * SC;

const CoordSys = ({ children, label = "" }: { children?: React.ReactNode; label?: string }) => (
  <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl" style={{ maxHeight: 170, background: "rgba(15,23,42,0.7)" }}>
    {[-5,-4,-3,-2,-1,1,2,3,4,5].map(v => (
      <g key={v}>
        <line x1={MX+v*SC*0.7} y1={4} x2={MX+v*SC*0.7} y2={H-4} stroke="#1e293b" strokeWidth="0.7" />
        <line x1={4} y1={MY-v*SC*0.7} x2={W-4} y2={MY-v*SC*0.7} stroke="#1e293b" strokeWidth="0.7" />
      </g>
    ))}
    <line x1={4} y1={MY} x2={W-4} y2={MY} stroke="#475569" strokeWidth="1.5" />
    <line x1={MX} y1={H-4} x2={MX} y2={4} stroke="#475569" strokeWidth="1.5" />
    <text x={W-10} y={MY+11} fill="#64748b" fontSize="8">x</text>
    <text x={MX+3} y={11} fill="#64748b" fontSize="8">y</text>
    <text x={MX+2} y={MY+10} fill="#475569" fontSize="7">O</text>
    {label && <text x={5} y={13} fill="#94a3b8" fontSize="8">{label}</text>}
    {children}
  </svg>
);

// ── Interactive calculator helpers ──────────────────────────────────────
const _gcd = (a: number, b: number): number => {
  a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
  while (b) { const t = b; b = a % b; a = t; }
  return a || 1;
};
const toFrac = (n: number, d: number): string => {
  if (Math.abs(d) < 1e-9) return "\\nexists";
  const ni = Math.round(n), di = Math.round(d);
  if (Math.abs(ni - n) < 1e-4 && Math.abs(di - d) < 1e-4) {
    const g = _gcd(Math.abs(ni), Math.abs(di));
    const sn = (di < 0 ? -ni : ni) / g, sd = Math.abs(di) / g;
    return sd === 1 ? String(sn) : `\\frac{${sn}}{${sd}}`;
  }
  return String(Math.round((n / d) * 10000) / 10000);
};
const nL = (v: number) => String(Math.round(v * 10000) / 10000);
const pL = (v: number) => v < 0 ? `(${nL(v)})` : nL(v);
const sT = (v: number): string => {
  const r = Math.round(v * 10000) / 10000;
  if (Math.abs(r) < 1e-9) return "";
  return r > 0 ? `+ ${r}` : `- ${-r}`;
};
const gPts = (m: number, c: number) =>
  [-7, -4, -1, 2, 5, 7].map(x => `${toX(x)},${toY(m * x + c)}`).join(' ');
// ────────────────────────────────────────────────────────────────────────

const T_MENENTUKAN = {
  id: {
    title: "MENENTUKAN PERSAMAAN GARIS LURUS",
    subtitle: "Bangun Persamaan dari Informasi yang Ada!",
    breadcrumb: "Kelas 8 · Persamaan Garis Lurus · Materi Matematika",
    sh_intro: "🌟 Dua Skenario Menentukan Persamaan Garis",
    sh_rumus1: "📐 Skenario 1: Diketahui m dan Satu Titik (x₁, y₁)",
    sh_rumus2: "📐 Skenario 2: Diketahui Dua Titik",
    sh_peta: "🗺️ Peta Lengkap: Pilih Rumus yang Tepat!",
    sh_contoh1: "✏️ Contoh 1 — Tingkat Mudah",
    sh_contoh2: "✏️ Contoh 2 — Tingkat Sedang",
    sh_contoh3: "✏️ Contoh 3 — Tingkat Sulit",
    sh_rangkuman: "📌 Rangkuman",
    back: "← Kembali ke Persamaan Garis Lurus",
    mudah: "MUDAH", sedang: "SEDANG", sulit: "SULIT",
  },
  en: {
    title: "FINDING THE EQUATION OF A LINE",
    subtitle: "Build the Equation from the Given Information!",
    breadcrumb: "Grade 8 · Equation of a Line · Mathematics",
    sh_intro: "🌟 Two Scenarios for Finding a Line Equation",
    sh_rumus1: "📐 Scenario 1: Given m and One Point (x₁, y₁)",
    sh_rumus2: "📐 Scenario 2: Given Two Points",
    sh_peta: "🗺️ Complete Map: Choose the Right Formula!",
    sh_contoh1: "✏️ Example 1 — Easy Level",
    sh_contoh2: "✏️ Example 2 — Medium Level",
    sh_contoh3: "✏️ Example 3 — Hard Level",
    sh_rangkuman: "📌 Summary",
    back: "← Back to Equation of a Line",
    mudah: "EASY", sedang: "MEDIUM", sulit: "HARD",
  },
  ja: {
    title: "直線の方程式を求める",
    subtitle: "与えられた情報から方程式を構築しよう！",
    breadcrumb: "中学2年 · 直線の方程式 · 数学",
    sh_intro: "🌟 方程式を求める2つのシナリオ",
    sh_rumus1: "📐 シナリオ1：傾き m と1点 (x₁, y₁) が与えられた場合",
    sh_rumus2: "📐 シナリオ2：2点が与えられた場合",
    sh_peta: "🗺️ 完全マップ：正しい公式を選ぼう！",
    sh_contoh1: "✏️ 例題1 — 基本レベル",
    sh_contoh2: "✏️ 例題2 — 標準レベル",
    sh_contoh3: "✏️ 例題3 — 発展レベル",
    sh_rangkuman: "📌 まとめ",
    back: "← 直線の方程式に戻る",
    mudah: "基本", sedang: "標準", sulit: "発展",
  },
};

const MenentukanPGLPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = T_MENENTUKAN[language];
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "rumus1", "rumus2", "peta-rumus", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);
  const toggle = (s: string) => { playPopSound(); setExpandedSections(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]); };
  const SH = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3"><span className={iconColor}>{icon}</span><span className="font-body font-semibold text-white">{title}</span></div>
      <ChevronUp className="w-5 h-5 text-primary" />
    </button>
  );
  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  // ── Interactive Skenario 1 state ────────────────────────────────────────
  const [iv1, setIv1] = useState({ m: "", x1: "", y1: "", step: 0, error: "" });
  const [iv1Off, setIv1Off] = useState(10000);
  const _m1 = parseFloat(iv1.m), _x1a = parseFloat(iv1.x1), _y1a = parseFloat(iv1.y1);
  const iv1ok = !isNaN(_m1) && !isNaN(_x1a) && !isNaN(_y1a);
  const iv1c = iv1ok ? -_m1 * _x1a + _y1a : 0;

  // ── Interactive Skenario 2 state ────────────────────────────────────────
  const [iv2, setIv2] = useState({ x1: "", y1: "", x2: "", y2: "", step: 0, error: "" });
  const [iv2Off, setIv2Off] = useState(10000);
  const _x1b = parseFloat(iv2.x1), _y1b = parseFloat(iv2.y1);
  const _x2b = parseFloat(iv2.x2), _y2b = parseFloat(iv2.y2);
  const iv2ok = !isNaN(_x1b) && !isNaN(_y1b) && !isNaN(_x2b) && !isNaN(_y2b) && Math.abs(_x2b - _x1b) > 1e-9;
  const iv2mn = iv2ok ? _y2b - _y1b : 0;
  const iv2md = iv2ok ? _x2b - _x1b : 1;
  const iv2m = iv2mn / iv2md;
  const iv2mF = iv2ok ? toFrac(iv2mn, iv2md) : "0";
  const iv2mPlain = iv2ok ? String(Math.round(iv2m * 10000) / 10000) : "0";
  const iv2c = iv2ok ? _y1b - iv2m * _x1b : 0;

  // ── Interactive Skenario 2 Cara 1 (rumus dua titik langsung) state ───────
  const [iv3, setIv3] = useState({ x1: "", y1: "", x2: "", y2: "", step: 0, error: "" });
  const [iv3Off, setIv3Off] = useState(10000);
  const _x1c = parseFloat(iv3.x1), _y1c = parseFloat(iv3.y1);
  const _x2c = parseFloat(iv3.x2), _y2c = parseFloat(iv3.y2);
  const iv3ok = !isNaN(_x1c) && !isNaN(_y1c) && !isNaN(_x2c) && !isNaN(_y2c) && Math.abs(_x2c - _x1c) > 1e-9;
  const iv3dx = iv3ok ? _x2c - _x1c : 1;
  const iv3dy = iv3ok ? _y2c - _y1c : 0;
  const iv3m3 = iv3dy / iv3dx;
  const iv3mF3 = iv3ok ? toFrac(iv3dy, iv3dx) : "0";
  const iv3mPlain3 = iv3ok ? String(Math.round(iv3m3 * 10000) / 10000) : "0";
  const iv3c3 = iv3ok ? _y1c - iv3m3 * _x1c : 0;
  const mCoef3 = (mF: string) => mF === "1" ? "" : mF === "-1" ? "-" : mF;

  // ── Graph animation effects ─────────────────────────────────────────────
  useEffect(() => {
    if (iv1.step >= 3) { setIv1Off(10000); const t = setTimeout(() => setIv1Off(0), 80); return () => clearTimeout(t); }
  }, [iv1.step]);
  useEffect(() => {
    if (iv2.step >= 4) { setIv2Off(10000); const t = setTimeout(() => setIv2Off(0), 80); return () => clearTimeout(t); }
  }, [iv2.step]);
  useEffect(() => {
    if (iv3.step >= 5) { setIv3Off(10000); const t = setTimeout(() => setIv3Off(0), 80); return () => clearTimeout(t); }
  }, [iv3.step]);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <Edit className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">{t.title}</h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">{t.subtitle}</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.breadcrumb}</p>
        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sh_intro} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">Bergantung pada informasi yang diberikan, ada dua skenario utama untuk menentukan persamaan garis lurus. Pilih rumus yang sesuai dengan data yang tersedia!</p>
                {/* Peta skenario */}
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-cyan-300 uppercase mb-3">🗺️ Peta Skenario Penentuan Persamaan Garis</p>
                  <div className="space-y-2">
                    {[
                      { no: "1", info: "Diketahui gradien (m) dan satu titik (x₁, y₁)", rumus: "y − y₁ = m(x − x₁)", color: "border-violet-500/40 bg-violet-900/10" },
                      { no: "2", info: "Diketahui dua titik (x₁, y₁) dan (x₂, y₂)", rumus: "y − y₁ / y₂ − y₁ = x − x₁ / x₂ − x₁", color: "border-orange-500/40 bg-orange-900/10" },
                    ].map(({ no, info, rumus, color }) => (
                      <div key={no} className={`border ${color} rounded-xl p-3 flex gap-3 text-sm font-body`}>
                        <div className="bg-white/10 rounded-full w-7 h-7 shrink-0 flex items-center justify-center font-bold text-white font-display">{no}</div>
                        <div>
                          <p className="text-white/80 text-xs">Info: <span className="text-white font-semibold">{info}</span></p>
                          <p className="text-cyan-300 font-mono text-xs mt-1">Rumus: {rumus}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SKENARIO 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="rumus1" icon={<Layers className="w-5 h-5" />} iconColor="text-violet-400" title={t.sh_rumus1} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-900/20 border border-violet-500/40 rounded-xl p-4 text-center">
                  <BlockMath math="y - y_1 = m(x - x_1)" />
                  <p className="text-xs text-white/60 mt-1">Rumus titik-gradien (point-slope form)</p>
                </div>
                {/* Step visual */}
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="text-xs font-bold text-violet-300 mb-2">Langkah-langkah:</p>
                  <div className="space-y-2">
                    {[
                      { n:"1", t:"Substitusi m, x₁, y₁ ke rumus", c:"border-violet-500/30 bg-violet-900/10" },
                      { n:"2", t:"Ekspansi ruas kanan: y − y₁ = mx − mx₁", c:"border-cyan-500/30 bg-cyan-900/10" },
                      { n:"3", t:"Pindahkan y₁ ke ruas kanan: y = mx − mx₁ + y₁", c:"border-green-500/30 bg-green-900/10" },
                    ].map(({ n,t,c }) => (
                      <div key={n} className={`border ${c} rounded-lg p-2 flex gap-2 text-xs font-body`}>
                        <span className="bg-white/10 rounded-full w-5 h-5 flex items-center justify-center font-bold text-white shrink-0">{n}</span>
                        <span className="text-white/70">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Example visual */}
                <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-3">
                  <p className="text-xs font-bold text-violet-300 mb-2">Contoh: m = 3, titik (1, 2) → y = 3x − 1</p>
                  <CoordSys label="y = 3x − 1">
                    <polyline points={[[-2,-7],[-1,-4],[0,-1],[1,2],[2,5]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx={toX(1)} cy={toY(2)} r="5" fill="#facc15" stroke="#fde047" strokeWidth="1.5" />
                    <text x={toX(1)+5} y={toY(2)-4} fill="#facc15" fontSize="8">(1,2)</text>
                  </CoordSys>
                </div>

                {/* ── INTERACTIVE S1 ── */}
                <div className="bg-violet-900/10 border border-violet-500/30 rounded-xl p-4 space-y-4">
                  <p className="text-xs font-bold text-violet-300 uppercase tracking-wider">🎮 Kalkulator Interaktif Menentukan Persamaan Garis yang Melalui Titik (x₁, y₁) dan Bergradien m – Coba Sendiri!</p>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      ["Gradien (m)", iv1.m, (v: string) => setIv1(p => ({...p, m: v, step: 0, error: ""}))],
                      ["x₁", iv1.x1, (v: string) => setIv1(p => ({...p, x1: v, step: 0, error: ""}))],
                      ["y₁", iv1.y1, (v: string) => setIv1(p => ({...p, y1: v, step: 0, error: ""}))],
                    ] as [string, string, (v: string) => void][]).map(([label, val, onChange]) => (
                      <div key={label}>
                        <p className="text-xs text-white/50 mb-1 text-center font-body">{label}</p>
                        <input
                          type="number"
                          value={val}
                          onChange={e => { playPopSound(); onChange(e.target.value); }}
                          placeholder="0"
                          className="w-full bg-slate-900/60 border border-slate-600 hover:border-violet-500/60 focus:border-violet-400 rounded-lg px-2 py-2 text-white text-sm text-center font-mono focus:outline-none transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                  {iv1.error && <p className="text-red-400 text-xs text-center font-body">{iv1.error}</p>}
                  {iv1.step === 0 && (
                    <button
                      onClick={() => {
                        if (!iv1ok) { setIv1(p => ({...p, error: "Isi semua kotak dengan angka yang valid!"})); return; }
                        playPopSound();
                        setIv1(p => ({...p, step: 1, error: ""}));
                      }}
                      className="w-full bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-bold py-2.5 rounded-lg text-sm transition-all cursor-pointer font-display"
                    >🚀 Mulai Langkah Demi Langkah</button>
                  )}
                  {iv1.step >= 1 && iv1ok && (() => {
                    const steps = [
                      { title: "Langkah 1 — Substitusi ke Rumus", accent: "border-violet-500/40 bg-violet-900/20",
                        note: `Masukkan m = ${nL(_m1)}, x₁ = ${nL(_x1a)}, y₁ = ${nL(_y1a)} ke rumus y − y₁ = m(x − x₁)`,
                        math: `y - ${pL(_y1a)} = ${nL(_m1)}\\left(x - ${pL(_x1a)}\\right)` },
                      { title: "Langkah 2 — Ekspansi Ruas Kanan", accent: "border-cyan-500/40 bg-cyan-900/20",
                        note: `Distribusikan: ${nL(_m1)} × x = ${nL(_m1)}x  dan  ${nL(_m1)} × ${pL(_x1a)} = ${nL(_m1 * _x1a)}`,
                        math: `y - ${pL(_y1a)} = ${nL(_m1)}x ${sT(-_m1 * _x1a)}` },
                      { title: "Langkah 3 — Persamaan Garis Lurus ✅", accent: "border-green-500/40 bg-green-900/20",
                        note: `Tambahkan ${pL(_y1a)} ke kedua ruas → bentuk y = mx + c`,
                        math: `y = ${nL(_m1)}x ${sT(iv1c)}`,
                        showGraph: true },
                    ];
                    return (
                      <div className="space-y-3">
                        {steps.slice(0, iv1.step).map((st, i) => (
                          <div key={i} className={`border ${st.accent} rounded-xl p-3 space-y-2`}>
                            <p className="text-xs font-bold text-white/90 font-display">{st.title}</p>
                            <p className="text-xs text-white/50 font-body italic">{st.note}</p>
                            <BlockMath math={st.math} />
                            {st.showGraph && (
                              <div className="mt-2 space-y-1">
                                <p className="text-xs text-green-400 font-semibold font-body">📈 Grafik tergambar:</p>
                                <CoordSys label={`y=${nL(_m1)}x${iv1c >= 0 ? '+'+nL(iv1c) : nL(iv1c)}`}>
                                  <polyline points={gPts(_m1, iv1c)} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"
                                    strokeDasharray={10000} strokeDashoffset={iv1Off}
                                    style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
                                </CoordSys>
                              </div>
                            )}
                          </div>
                        ))}
                        {iv1.step < steps.length && (
                          <button onClick={() => { playPopSound(); setIv1(p => ({...p, step: p.step + 1})); }}
                            className="w-full bg-violet-800/60 hover:bg-violet-700 border border-violet-500/40 text-white font-bold py-2 rounded-lg text-sm transition-all cursor-pointer font-display active:scale-95">
                            ▶ Langkah Berikutnya
                          </button>
                        )}
                        {iv1.step >= steps.length && (
                          <button onClick={() => { playPopSound(); setIv1({ m:"", x1:"", y1:"", step:0, error:"" }); setIv1Off(10000); }}
                            className="w-full bg-slate-700/60 hover:bg-slate-600 border border-slate-500/30 text-white/70 hover:text-white py-2 rounded-lg text-sm transition-all cursor-pointer font-body">
                            🔄 Coba Angka Lain
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* SKENARIO 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="rumus2" icon={<Layers className="w-5 h-5" />} iconColor="text-orange-400" title={t.sh_rumus2} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-900/20 border border-orange-500/40 rounded-xl p-4 text-center">
                  <BlockMath math="\frac{y - y_1}{y_2 - y_1} = \frac{x - x_1}{x_2 - x_1}" />
                  <p className="text-xs text-white/60 mt-1">Rumus dua titik (two-point form)</p>
                </div>
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <p className="text-xs font-bold text-orange-300 mb-2">Strategi Alternatif (Lebih Mudah):</p>
                  <div className="space-y-1 text-xs font-body text-white/70">
                    <p>1. Hitung dulu gradien: <InlineMath math="m = \frac{y_2 - y_1}{x_2 - x_1}" /></p>
                    <p>2. Pilih salah satu titik, masukkan ke skenario 1</p>
                    <p>3. Selesaikan untuk mendapat bentuk y = mx + c</p>
                  </div>
                </div>
                {/* Example visual */}
                <div className="bg-slate-800/60 border border-orange-500/20 rounded-xl p-3">
                  <p className="text-xs font-bold text-orange-300 mb-2">Contoh: titik A(0, 1) dan B(3, 7) → y = 2x + 1</p>
                  <CoordSys label="Melalui A(0,1) dan B(3,7)">
                    <polyline points={[[-1,-1],[0,1],[1,3],[2,5],[3,7],[4,9]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" />
                    {[[0,1],[3,7]].map(([x,y]) => (
                      <g key={`${x},${y}`}>
                        <circle cx={toX(x)} cy={toY(y)} r="5" fill="#facc15" stroke="#fde047" strokeWidth="1.5" />
                        <text x={toX(x)+5} y={toY(y)-4} fill="#facc15" fontSize="8">({x},{y})</text>
                      </g>
                    ))}
                  </CoordSys>
                </div>

                {/* ── INTERACTIVE S2 CARA 1 (rumus dua titik langsung) ── */}
                <div className="bg-cyan-900/10 border border-cyan-500/30 rounded-xl p-4 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider">🎮 Kalkulator Interaktif Menentukan Persamaan Garis yang Melalui 2 Titik (x₁, y₁) dan (x₂, y₂) – Coba Sendiri!</p>
                    <p className="text-xs text-cyan-400/70 mt-1 font-body">📐 Cara 1 — Menggunakan Rumus: <InlineMath math="\dfrac{y - y_1}{y_2 - y_1} = \dfrac{x - x_1}{x_2 - x_1}" /></p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      ["x₁", iv3.x1, (v: string) => setIv3(p => ({...p, x1: v, step: 0, error: ""}))],
                      ["y₁", iv3.y1, (v: string) => setIv3(p => ({...p, y1: v, step: 0, error: ""}))],
                      ["x₂", iv3.x2, (v: string) => setIv3(p => ({...p, x2: v, step: 0, error: ""}))],
                      ["y₂", iv3.y2, (v: string) => setIv3(p => ({...p, y2: v, step: 0, error: ""}))],
                    ] as [string, string, (v: string) => void][]).map(([label, val, onChange]) => (
                      <div key={label}>
                        <p className="text-xs text-white/50 mb-1 text-center font-body">{label}</p>
                        <input
                          type="number"
                          value={val}
                          onChange={e => { playPopSound(); onChange(e.target.value); }}
                          placeholder="0"
                          className="w-full bg-slate-900/60 border border-slate-600 hover:border-cyan-500/60 focus:border-cyan-400 rounded-lg px-2 py-2 text-white text-sm text-center font-mono focus:outline-none transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                  {iv3.error && <p className="text-red-400 text-xs text-center font-body">{iv3.error}</p>}
                  {iv3.step === 0 && (
                    <button
                      onClick={() => {
                        if (!iv3ok) {
                          const msg = (!isNaN(_x1c) && !isNaN(_x2c) && Math.abs(_x2c - _x1c) < 1e-9)
                            ? "x₁ dan x₂ tidak boleh sama (garis vertikal)!"
                            : "Isi semua kotak dengan angka yang valid!";
                          setIv3(p => ({...p, error: msg})); return;
                        }
                        playPopSound();
                        setIv3(p => ({...p, step: 1, error: ""}));
                      }}
                      className="w-full bg-cyan-700 hover:bg-cyan-600 active:scale-95 text-white font-bold py-2.5 rounded-lg text-sm transition-all cursor-pointer font-display"
                    >🚀 Mulai Langkah Demi Langkah</button>
                  )}
                  {iv3.step >= 1 && iv3ok && (() => {
                    const constTerm = -iv3dy * _x1c + iv3dx * _y1c;
                    const steps = [
                      { title: "Langkah 1 — Substitusi ke Rumus Dua Titik", accent: "border-cyan-500/40 bg-cyan-900/20",
                        note: `x₁ = ${nL(_x1c)}, y₁ = ${nL(_y1c)}, x₂ = ${nL(_x2c)}, y₂ = ${nL(_y2c)}`,
                        maths: [
                          `\\frac{y - y_1}{y_2 - y_1} = \\frac{x - x_1}{x_2 - x_1}`,
                          `\\frac{y - ${pL(_y1c)}}{${nL(iv3dy)}} = \\frac{x - ${pL(_x1c)}}{${nL(iv3dx)}}`,
                        ]},
                      { title: "Langkah 2 — Kalikan Silang", accent: "border-violet-500/40 bg-violet-900/20",
                        note: "Kalikan silang untuk menghilangkan penyebut",
                        maths: [
                          `${nL(iv3dx)}\\left(y - ${pL(_y1c)}\\right) = ${nL(iv3dy)}\\left(x - ${pL(_x1c)}\\right)`,
                        ]},
                      { title: "Langkah 3 — Ekspansi (Buka Kurung)", accent: "border-yellow-500/40 bg-yellow-900/20",
                        note: `Kalikan ${nL(iv3dx)} ke kiri dan ${nL(iv3dy)} ke kanan`,
                        maths: [
                          `${nL(iv3dx)}y ${sT(-iv3dx * _y1c)} = ${nL(iv3dy)}x ${sT(-iv3dy * _x1c)}`,
                        ]},
                      { title: "Langkah 4 — Kumpulkan Suku & Bagi dengan " + nL(iv3dx), accent: "border-green-500/40 bg-green-900/20",
                        note: `Pindahkan konstanta ke ruas kanan, lalu bagi kedua ruas dengan ${nL(iv3dx)}`,
                        maths: [
                          `${nL(iv3dx)}y = ${nL(iv3dy)}x ${sT(constTerm)}`,
                          `y = ${iv3mF3}x ${sT(iv3c3)}`,
                        ]},
                      { title: "Langkah 5 — Persamaan Garis Lurus ✅", accent: "border-pink-500/40 bg-pink-900/20",
                        note: `Gradien m = ${iv3mPlain3}, konstanta c = ${nL(iv3c3)}`,
                        maths: [`y = ${mCoef3(iv3mF3)}x ${sT(iv3c3)}`],
                        showGraph: true },
                    ];
                    return (
                      <div className="space-y-3">
                        {steps.slice(0, iv3.step).map((st, i) => (
                          <div key={i} className={`border ${st.accent} rounded-xl p-3 space-y-2`}>
                            <p className="text-xs font-bold text-white/90 font-display">{st.title}</p>
                            <p className="text-xs text-white/50 font-body italic">{st.note}</p>
                            {st.maths.map((m, mi) => <BlockMath key={mi} math={m} />)}
                            {st.showGraph && (
                              <div className="mt-2 space-y-1">
                                <p className="text-xs text-pink-400 font-semibold font-body">📈 Grafik tergambar:</p>
                                <CoordSys label={`y=${iv3mPlain3}x${iv3c3 >= 0 ? '+'+nL(iv3c3) : nL(iv3c3)}`}>
                                  <polyline points={gPts(iv3m3, iv3c3)} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round"
                                    strokeDasharray={10000} strokeDashoffset={iv3Off}
                                    style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
                                  {[[_x1c, _y1c], [_x2c, _y2c]].map(([x, y], idx) => (
                                    <g key={idx}>
                                      <circle cx={toX(x)} cy={toY(y)} r="5" fill="#facc15" stroke="#fde047" strokeWidth="1.5" />
                                      <text x={toX(x)+5} y={toY(y)-4} fill="#facc15" fontSize="8">({nL(x)},{nL(y)})</text>
                                    </g>
                                  ))}
                                </CoordSys>
                              </div>
                            )}
                          </div>
                        ))}
                        {iv3.step < steps.length && (
                          <button onClick={() => { playPopSound(); setIv3(p => ({...p, step: p.step + 1})); }}
                            className="w-full bg-cyan-800/60 hover:bg-cyan-700 border border-cyan-500/40 text-white font-bold py-2 rounded-lg text-sm transition-all cursor-pointer font-display active:scale-95">
                            ▶ Langkah Berikutnya
                          </button>
                        )}
                        {iv3.step >= steps.length && (
                          <button onClick={() => { playPopSound(); setIv3({ x1:"", y1:"", x2:"", y2:"", step:0, error:"" }); setIv3Off(10000); }}
                            className="w-full bg-slate-700/60 hover:bg-slate-600 border border-slate-500/30 text-white/70 hover:text-white py-2 rounded-lg text-sm transition-all cursor-pointer font-body">
                            🔄 Coba Angka Lain
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* ── INTERACTIVE S2 ── */}
                <div className="bg-orange-900/10 border border-orange-500/30 rounded-xl p-4 space-y-4">
                  <p className="text-xs font-bold text-orange-300 uppercase tracking-wider">🎮 Kalkulator Interaktif Menentukan Persamaan Garis yang Melalui 2 Titik (x₁, y₁) dan (x₂, y₂) – Coba Sendiri!</p>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      ["x₁", iv2.x1, (v: string) => setIv2(p => ({...p, x1: v, step: 0, error: ""}))],
                      ["y₁", iv2.y1, (v: string) => setIv2(p => ({...p, y1: v, step: 0, error: ""}))],
                      ["x₂", iv2.x2, (v: string) => setIv2(p => ({...p, x2: v, step: 0, error: ""}))],
                      ["y₂", iv2.y2, (v: string) => setIv2(p => ({...p, y2: v, step: 0, error: ""}))],
                    ] as [string, string, (v: string) => void][]).map(([label, val, onChange]) => (
                      <div key={label}>
                        <p className="text-xs text-white/50 mb-1 text-center font-body">{label}</p>
                        <input
                          type="number"
                          value={val}
                          onChange={e => { playPopSound(); onChange(e.target.value); }}
                          placeholder="0"
                          className="w-full bg-slate-900/60 border border-slate-600 hover:border-orange-500/60 focus:border-orange-400 rounded-lg px-2 py-2 text-white text-sm text-center font-mono focus:outline-none transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                  {iv2.error && <p className="text-red-400 text-xs text-center font-body">{iv2.error}</p>}
                  {iv2.step === 0 && (
                    <button
                      onClick={() => {
                        if (!iv2ok) {
                          const msg = (!isNaN(_x1b) && !isNaN(_x2b) && Math.abs(_x2b - _x1b) < 1e-9)
                            ? "x₁ dan x₂ tidak boleh sama (garis vertikal)!"
                            : "Isi semua kotak dengan angka yang valid!";
                          setIv2(p => ({...p, error: msg})); return;
                        }
                        playPopSound();
                        setIv2(p => ({...p, step: 1, error: ""}));
                      }}
                      className="w-full bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-bold py-2.5 rounded-lg text-sm transition-all cursor-pointer font-display"
                    >🚀 Mulai Langkah Demi Langkah</button>
                  )}
                  {iv2.step >= 1 && iv2ok && (() => {
                    const steps = [
                      { title: "Langkah 1 — Hitung Gradien (m)", accent: "border-orange-500/40 bg-orange-900/20",
                        note: "Gradien = selisih y dibagi selisih x dari dua titik",
                        math: `m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{${nL(iv2mn)}}{${nL(iv2md)}} = ${iv2mF}` },
                      { title: "Langkah 2 — Substitusi ke Rumus Titik-Gradien", accent: "border-violet-500/40 bg-violet-900/20",
                        note: `Pakai m = ${iv2mPlain} dan titik pertama (${nL(_x1b)}, ${nL(_y1b)})`,
                        math: `y - ${pL(_y1b)} = ${iv2mF}\\left(x - ${pL(_x1b)}\\right)` },
                      { title: "Langkah 3 — Ekspansi Ruas Kanan", accent: "border-cyan-500/40 bg-cyan-900/20",
                        note: `Kalikan ${iv2mPlain} dengan (x − ${pL(_x1b)})`,
                        math: `y - ${pL(_y1b)} = ${iv2mF}x ${sT(-iv2m * _x1b)}` },
                      { title: "Langkah 4 — Persamaan Garis Lurus ✅", accent: "border-green-500/40 bg-green-900/20",
                        note: `Tambahkan ${pL(_y1b)} ke kedua ruas → bentuk y = mx + c`,
                        math: `y = ${iv2mF}x ${sT(iv2c)}`,
                        showGraph: true },
                    ];
                    return (
                      <div className="space-y-3">
                        {steps.slice(0, iv2.step).map((st, i) => (
                          <div key={i} className={`border ${st.accent} rounded-xl p-3 space-y-2`}>
                            <p className="text-xs font-bold text-white/90 font-display">{st.title}</p>
                            <p className="text-xs text-white/50 font-body italic">{st.note}</p>
                            <BlockMath math={st.math} />
                            {st.showGraph && (
                              <div className="mt-2 space-y-1">
                                <p className="text-xs text-green-400 font-semibold font-body">📈 Grafik tergambar:</p>
                                <CoordSys label={`y=${iv2mPlain}x${iv2c >= 0 ? '+'+nL(iv2c) : nL(iv2c)}`}>
                                  <polyline points={gPts(iv2m, iv2c)} fill="none" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round"
                                    strokeDasharray={10000} strokeDashoffset={iv2Off}
                                    style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
                                  {[[_x1b, _y1b], [_x2b, _y2b]].map(([x, y], idx) => (
                                    <g key={idx}>
                                      <circle cx={toX(x)} cy={toY(y)} r="5" fill="#facc15" stroke="#fde047" strokeWidth="1.5" />
                                      <text x={toX(x)+5} y={toY(y)-4} fill="#facc15" fontSize="8">({nL(x)},{nL(y)})</text>
                                    </g>
                                  ))}
                                </CoordSys>
                              </div>
                            )}
                          </div>
                        ))}
                        {iv2.step < steps.length && (
                          <button onClick={() => { playPopSound(); setIv2(p => ({...p, step: p.step + 1})); }}
                            className="w-full bg-orange-800/60 hover:bg-orange-700 border border-orange-500/40 text-white font-bold py-2 rounded-lg text-sm transition-all cursor-pointer font-display active:scale-95">
                            ▶ Langkah Berikutnya
                          </button>
                        )}
                        {iv2.step >= steps.length && (
                          <button onClick={() => { playPopSound(); setIv2({ x1:"", y1:"", x2:"", y2:"", step:0, error:"" }); setIv2Off(10000); }}
                            className="w-full bg-slate-700/60 hover:bg-slate-600 border border-slate-500/30 text-white/70 hover:text-white py-2 rounded-lg text-sm transition-all cursor-pointer font-body">
                            🔄 Coba Angka Lain
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* PETA RUMUS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="peta-rumus" icon={<BookOpen className="w-5 h-5" />} iconColor="text-yellow-400" title="🗺️ Peta Lengkap: Pilih Rumus yang Tepat!" />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-slate-800/60 border border-yellow-500/20 rounded-xl p-4">
                  <svg viewBox="0 0 260 200" className="w-full" style={{ maxHeight: 200 }}>
                    {/* Start */}
                    <rect x="80" y="5" width="100" height="30" rx="6" fill="#1e3a5f" stroke="#22d3ee" strokeWidth="1.5" />
                    <text x="130" y="25" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="bold">INFO GARIS?</text>
                    {/* Arrow down */}
                    <line x1="130" y1="35" x2="130" y2="52" stroke="#475569" strokeWidth="1.5" />
                    <polygon points="125,50 135,50 130,57" fill="#475569" />
                    {/* 2 branches */}
                    <line x1="130" y1="57" x2="65" y2="82" stroke="#a78bfa" strokeWidth="1.2" />
                    <line x1="130" y1="57" x2="195" y2="82" stroke="#fb923c" strokeWidth="1.2" />
                    {/* Labels on branches */}
                    <text x="65" y="74" textAnchor="middle" fill="#a78bfa" fontSize="8">m dan 1 titik</text>
                    <text x="195" y="74" textAnchor="middle" fill="#fb923c" fontSize="8">2 titik</text>
                    {/* Box 1 */}
                    <rect x="10" y="85" width="110" height="40" rx="5" fill="#1a0b3a" stroke="#a78bfa" strokeWidth="1.2" />
                    <text x="65" y="101" textAnchor="middle" fill="#a78bfa" fontSize="8" fontWeight="bold">y−y₁ = m(x−x₁)</text>
                    <text x="65" y="114" textAnchor="middle" fill="#c4b5fd" fontSize="7">Titik-gradien</text>
                    {/* Box 2 */}
                    <rect x="140" y="85" width="110" height="40" rx="5" fill="#1c0d00" stroke="#fb923c" strokeWidth="1.2" />
                    <text x="195" y="101" textAnchor="middle" fill="#fb923c" fontSize="7" fontWeight="bold">Hitung m dulu,</text>
                    <text x="195" y="113" textAnchor="middle" fill="#fb923c" fontSize="7" fontWeight="bold">lalu skenario 1</text>
                    {/* Both converge to result */}
                    <line x1="65" y1="125" x2="65" y2="152" stroke="#475569" strokeWidth="1" />
                    <line x1="195" y1="125" x2="195" y2="152" stroke="#475569" strokeWidth="1" />
                    <line x1="65" y1="152" x2="195" y2="152" stroke="#475569" strokeWidth="1" />
                    <line x1="130" y1="152" x2="130" y2="165" stroke="#475569" strokeWidth="1" />
                    <polygon points="125,163 135,163 130,170" fill="#4ade80" />
                    <rect x="70" y="170" width="120" height="26" rx="5" fill="#064e3b" stroke="#4ade80" strokeWidth="1.5" />
                    <text x="130" y="187" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="bold">y = mx + c ✅</text>
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Tingkat Mudah" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-green-300 mb-2 font-body">📝 Soal</p>
                  <p className="text-sm text-white/85 font-body">Tentukan persamaan garis dengan gradien <InlineMath math="m = 4" /> yang melalui titik <InlineMath math="(0, -3)" />.</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-1">Gunakan rumus skenario 1: y − y₁ = m(x − x₁)</p>
                    <BlockMath math="y - (-3) = 4(x - 0)" />
                    <BlockMath math="y + 3 = 4x" />
                    <BlockMath math="y = 4x - 3" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-orange-300 font-semibold mb-2 text-xs">Grafik y = 4x − 3:</p>
                    <CoordSys label="y = 4x − 3">
                      <polyline points={[[-2,-11],[-1,-7],[0,-3],[1,1],[2,5]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx={toX(0)} cy={toY(-3)} r="5" fill="#facc15" stroke="#fde047" strokeWidth="1.5" />
                      <text x={toX(0)+5} y={toY(-3)-4} fill="#facc15" fontSize="8">(0,−3)</text>
                    </CoordSys>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-green-300">✅ Persamaan: y = 4x − 3</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Tingkat Sedang" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-yellow-300 mb-2 font-body">📝 Soal</p>
                  <p className="text-sm text-white/85 font-body">Tentukan persamaan garis bergradien <InlineMath math="-\frac{1}{2}" /> yang melalui titik <InlineMath math="(4, 1)" />!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-1">Gunakan rumus skenario 2: y − y₁ = m(x − x₁)</p>
                    <BlockMath math="y - 1 = -\frac{1}{2}(x - 4)" />
                    <BlockMath math="y - 1 = -\frac{1}{2}x + 2" />
                    <BlockMath math="y = -\frac{1}{2}x + 3" />
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-2 text-xs">Grafik y = −½x + 3:</p>
                    <CoordSys label="y = −½x + 3">
                      <polyline points={[[-4,5],[-2,4],[0,3],[2,2],[4,1],[6,0]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
                      {[[0,3],[4,1]].map(([x,y]) => (
                        <g key={`${x},${y}`}>
                          <circle cx={toX(x)} cy={toY(y)} r="5" fill="#22d3ee" stroke="#67e8f9" strokeWidth="1.5" />
                          <text x={toX(x)+5} y={toY(y)-4} fill="#22d3ee" fontSize="8">({x},{y})</text>
                        </g>
                      ))}
                    </CoordSys>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-yellow-300">✅ Persamaan: <InlineMath math="y = -\frac{1}{2}x + 3" /> atau <InlineMath math="x + 2y - 6 = 0" /></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Tingkat Sulit" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-red-300 mb-2 font-body">📝 Soal</p>
                  <p className="text-sm text-white/85 font-body">Tentukan persamaan garis yang melalui titik <InlineMath math="A(-2, 5)" /> dan <InlineMath math="B(4, -1)" />. Nyatakan dalam bentuk <InlineMath math="ax + by + c = 0" />!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">

                  {/* ── CARA 1 ── */}
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                    <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider">📐 Cara 1 — Rumus Dua Titik Langsung</p>
                    <p className="text-xs text-white/60 mt-1">Gunakan rumus dua titik secara langsung: <InlineMath math="\dfrac{y - y_1}{y_2 - y_1} = \dfrac{x - x_1}{x_2 - x_1}" /></p>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-1">Langkah 1 — Substitusi ke Rumus Dua Titik</p>
                    <p className="text-xs text-white/50 mb-2 font-body">x₁ = −2, y₁ = 5, x₂ = 4, y₂ = −1</p>
                    <BlockMath math="\frac{y - 5}{-1 - 5} = \frac{x - (-2)}{4 - (-2)}" />
                    <BlockMath math="\frac{y - 5}{-6} = \frac{x + 2}{6}" />
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-1">Langkah 2 — Kalikan Silang</p>
                    <BlockMath math="6(y - 5) = -6(x + 2)" />
                    <BlockMath math="6y - 30 = -6x - 12" />
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-green-300 font-semibold mb-1">Langkah 3 — Sederhanakan</p>
                    <BlockMath math="6y = -6x - 12 + 30" />
                    <BlockMath math="6y = -6x + 18" />
                    <BlockMath math="y = -x + 3" />
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-pink-300 font-semibold mb-1">Langkah 4 — Ubah ke Bentuk Umum</p>
                    <BlockMath math="y = -x + 3 \implies x + y - 3 = 0" />
                  </div>

                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="text-sm font-bold text-cyan-300">✅ Persamaan (Cara 1): y = −x + 3 atau x + y − 3 = 0</p>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 py-1">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-xs text-white/30 font-body">atau gunakan cara berikut</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* Label Cara 2 */}
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                    <p className="text-xs font-bold text-orange-300 uppercase tracking-wider">💡 Cara 2 — Alternatif Penyelesaian</p>
                    <p className="text-xs text-white/60 mt-1">Cari gradien (m) terlebih dahulu menggunakan <InlineMath math="m = \frac{y_2 - y_1}{x_2 - x_1}" />, kemudian substitusi ke rumus <InlineMath math="y - y_1 = m(x - x_1)" /></p>
                  </div>

                  {/* Langkah 1 */}
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-cyan-300 font-semibold mb-1">Langkah 1 — Hitung Gradien (m)</p>
                    <p className="text-xs text-white/50 mb-2 font-body">Diketahui: x₁ = −2, y₁ = 5, x₂ = 4, y₂ = −1</p>
                    <BlockMath math="m = \frac{y_2 - y_1}{x_2 - x_1} = \frac{-1 - 5}{4 - (-2)} = \frac{-6}{6} = -1" />
                  </div>

                  {/* Langkah 2 */}
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-violet-300 font-semibold mb-1">Langkah 2 — Substitusi ke y − y₁ = m(x − x₁)</p>
                    <p className="text-xs text-white/50 mb-2 font-body">Gunakan m = −1 dan titik A(−2, 5) → x₁ = −2, y₁ = 5</p>
                    <BlockMath math="y - 5 = -1\bigl(x - (-2)\bigr)" />
                    <BlockMath math="y - 5 = -1(x + 2)" />
                  </div>

                  {/* Langkah 3 */}
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-green-300 font-semibold mb-1">Langkah 3 — Sederhanakan</p>
                    <BlockMath math="y - 5 = -x - 2" />
                    <BlockMath math="y = -x - 2 + 5" />
                    <BlockMath math="y = -x + 3" />
                  </div>

                  {/* Langkah 4 */}
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-pink-300 font-semibold mb-1">Langkah 4 — Ubah ke Bentuk Umum ax + by + c = 0</p>
                    <BlockMath math="y = -x + 3 \implies x + y - 3 = 0" />
                  </div>

                  {/* Grafik */}
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-orange-300 font-semibold mb-2 text-xs">Grafik melalui A(−2, 5) dan B(4, −1):</p>
                    <CoordSys label="x + y − 3 = 0">
                      <polyline points={[[-2,5],[-1,4],[0,3],[1,2],[2,1],[3,0],[4,-1]].map(([x,y])=>`${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />
                      {[[-2,5],[4,-1]].map(([x,y]) => (
                        <g key={`${x},${y}`}>
                          <circle cx={toX(x)} cy={toY(y)} r="5" fill="#facc15" stroke="#fde047" strokeWidth="1.5" />
                          <text x={toX(x)+5} y={toY(y)-4} fill="#facc15" fontSize="8">({x},{y})</text>
                        </g>
                      ))}
                    </CoordSys>
                  </div>

                  {/* Hasil */}
                  <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3 space-y-1">
                    <p className="text-sm font-bold text-red-300">✅ Persamaan: y = −x + 3  atau  x + y − 3 = 0</p>
                    <p className="text-xs text-white/50 font-body">Verifikasi: A(−2, 5): (−2) + 5 − 3 = 0 ✓ &nbsp;|&nbsp; B(4, −1): 4 + (−1) − 3 = 0 ✓</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SH id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman" />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2 text-sm font-body">
                  {[
                    ["Skenario 1 (m & 1 titik)", "y − y₁ = m(x − x₁)"],
                    ["Skenario 2 (2 titik)", "Hitung m dulu, lalu pakai skenario 1"],
                    ["Bentuk Umum", "ax + by + c = 0 (pindahkan semua ke satu sisi)"],
                    ["Verifikasi", "Substitusi koordinat titik ke persamaan, harus memenuhi!"],
                  ].map(([t,d]) => (
                    <div key={t} className="flex gap-2"><span className="text-cyan-400 shrink-0">▸</span><p className="text-white/80"><strong className="text-cyan-300">{t}:</strong> {d}</p></div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-xs text-yellow-200 font-body"><strong>💡 Selalu verifikasi!</strong> Setelah mendapat persamaan garis, cek dengan mensubstitusi koordinat titik yang diketahui. Jika benar, hasilnya harus memenuhi (sama kiri-kanan).</p>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/persamaan-garis-lurus"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
};
export default MenentukanPGLPage;
