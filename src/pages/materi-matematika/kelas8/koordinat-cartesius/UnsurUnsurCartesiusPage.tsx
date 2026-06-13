import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Grid } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import CartesianDragAnimation from "@/components/CartesianDragAnimation";

const UnsurUnsurCartesiusPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "unsur", "kuadran", "contoh1", "contoh2", "contoh3", "rangkuman",
  ]);

  const toggleSection = (id: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const SectionHeader = ({ id, icon, iconColor, title }: {
    id: string; icon: React.ReactNode; iconColor?: string; title: string;
  }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      <ChevronUp className="w-5 h-5 text-primary" />
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  /* ── Mini Coordinate Grid ── */
  const CoordGrid = () => {
    const points = [
      { x: 3, y: 4, label: "A(3,4)", color: "bg-cyan-400", textColor: "text-cyan-300" },
      { x: -2, y: 3, label: "B(–2,3)", color: "bg-green-400", textColor: "text-green-300" },
      { x: -3, y: -2, label: "C(–3,–2)", color: "bg-yellow-400", textColor: "text-yellow-300" },
      { x: 2, y: -4, label: "D(2,–4)", color: "bg-pink-400", textColor: "text-pink-300" },
    ];
    const size = 6; // grid from -6 to +6
    const cellPx = 22;
    const total = size * 2;
    const toCell = (v: number) => v + size; // map coordinate to grid index

    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative border border-white/20 rounded-lg overflow-hidden"
          style={{ width: total * cellPx, height: total * cellPx, background: "rgba(15,23,42,0.8)" }}
        >
          {/* Grid lines */}
          {Array.from({ length: total + 1 }).map((_, i) => (
            <React.Fragment key={i}>
              <div className="absolute" style={{ left: i * cellPx, top: 0, width: 1, height: total * cellPx, background: i === size ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.08)" }} />
              <div className="absolute" style={{ top: i * cellPx, left: 0, height: 1, width: total * cellPx, background: i === size ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.08)" }} />
            </React.Fragment>
          ))}
          {/* Axis labels */}
          <span className="absolute text-white/60 font-mono" style={{ right: 2, top: size * cellPx - 14, fontSize: 9 }}>+x</span>
          <span className="absolute text-white/60 font-mono" style={{ left: 2, top: size * cellPx - 14, fontSize: 9 }}>−x</span>
          <span className="absolute text-white/60 font-mono" style={{ left: size * cellPx + 3, top: 2, fontSize: 9 }}>+y</span>
          <span className="absolute text-white/60 font-mono" style={{ left: size * cellPx + 3, bottom: 2, fontSize: 9 }}>−y</span>
          {/* Quadrant labels */}
          <span className="absolute font-bold opacity-30 text-white" style={{ left: size * cellPx + 6, top: 6, fontSize: 10 }}>I</span>
          <span className="absolute font-bold opacity-30 text-white" style={{ right: size * cellPx - 4 + 8, top: 6, fontSize: 10 }}>II</span>
          <span className="absolute font-bold opacity-30 text-white" style={{ right: size * cellPx - 4 + 4, bottom: 6, fontSize: 10 }}>III</span>
          <span className="absolute font-bold opacity-30 text-white" style={{ left: size * cellPx + 6, bottom: 6, fontSize: 10 }}>IV</span>
          {/* Points */}
          {points.map(({ x, y, label, color, textColor }) => (
            <div key={label}>
              <div className={`absolute rounded-full ${color} border-2 border-white/80 z-10`}
                style={{ width: 8, height: 8, left: toCell(x) * cellPx - 4, top: toCell(-y) * cellPx - 4 }} />
              <span className={`absolute font-mono font-bold z-10 ${textColor}`}
                style={{ fontSize: 8, left: toCell(x) * cellPx + 5, top: toCell(-y) * cellPx - 10, whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          {points.map(({ label, color, textColor }) => (
            <span key={label} className="flex items-center gap-1 text-xs font-mono">
              <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
              <span className={textColor}>{label}</span>
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          UNSUR-UNSUR PADA DIAGRAM KARTESIUS
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Peta Koordinat — Bahasa Universal Matematika!
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Koordinat Kartesius · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Dari GPS ke Matematika — Koordinat Ada di Mana-mana!" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Saat kamu share lokasi ke teman lewat Google Maps, kamu sebenarnya sedang berbagi dua angka: garis lintang dan garis bujur. Itulah konsep <strong className="text-cyan-300">koordinat</strong>! Dalam matematika, kita menggunakan <strong className="text-cyan-300">Diagram Kartesius</strong> — sebuah sistem peta angka yang diciptakan filsuf Prancis René Descartes — untuk menentukan posisi setiap titik di bidang datar secara tepat dan jelas.
                </p>
                <div className="flex flex-col items-center gap-2">
                  <img
                    src="/koordinat-maps.png"
                    alt="Koordinat GPS pada smartphone"
                    className="rounded-xl w-full max-w-xs border border-cyan-500/30 shadow-lg"
                  />
                  <p className="text-[11px] text-white/45 font-body text-center">
                    Koordinat di smartphone — prinsipnya persis sama dengan Diagram Kartesius!{" "}
                    <a href="https://www.bing.com/images/create" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">
                      Sumber gambar
                    </a>
                  </p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Fakta keren:</strong> Nama "Cartesius" berasal dari nama Latin René Descartes (Renatus Kartesius). Menurut cerita, ide sistem koordinat ini muncul saat ia berbaring di tempat tidur dan mengamati seekor lalat di langit-langit kamar. Ia berpikir: bagaimana cara menentukan posisi lalat itu secara tepat? 🪰
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* UNSUR-UNSUR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="unsur" icon={<Grid className="w-5 h-5" />} iconColor="text-cyan-400" title="📘 Komponen Utama Diagram Kartesius" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">
                    Diagram Kartesius terdiri dari dua garis bilangan yang saling tegak lurus. Setiap titik di bidang Kartesius dinyatakan dengan pasangan bilangan <strong className="text-cyan-300">(x, y)</strong> yang disebut <strong className="text-cyan-300">koordinat</strong>.
                  </p>
                </div>

                {/* Interactive Cartesian */}
                <CartesianDragAnimation />

                {/* Komponen */}
                <div className="space-y-2 text-sm font-body">
                  {[
                    { nama: "Sumbu-x (Absis)", warna: "border-cyan-500/40 bg-cyan-900/30 text-cyan-200", icon: "→", desc: "Garis horizontal (mendatar). Nilai positif ke kanan, negatif ke kiri." },
                    { nama: "Sumbu-y (Ordinat)", warna: "border-green-500/40 bg-green-900/30 text-green-200", icon: "↑", desc: "Garis vertikal (tegak). Nilai positif ke atas, negatif ke bawah." },
                    { nama: "Titik Asal (Origin)", warna: "border-white/30 bg-slate-700/40 text-white/80", icon: "O", desc: "Titik perpotongan sumbu-x dan sumbu-y. Koordinatnya selalu (0, 0)." },
                    { nama: "Absis (koordinat x)", warna: "border-violet-500/40 bg-violet-900/30 text-violet-200", icon: "x", desc: "Jarak titik ke sumbu-y, diukur sejajar sumbu-x. Bilangan pertama dalam (x, y)." },
                    { nama: "Ordinat (koordinat y)", warna: "border-pink-500/40 bg-pink-900/30 text-pink-200", icon: "y", desc: "Jarak titik ke sumbu-x, diukur sejajar sumbu-y. Bilangan kedua dalam (x, y)." },
                  ].map(({ nama, warna, icon, desc }) => (
                    <div key={nama} className={`border ${warna} rounded-lg px-4 py-2 flex gap-3 items-start`}>
                      <span className="font-display font-bold text-sm w-6 h-6 flex items-center justify-center rounded bg-white/10 shrink-0">{icon}</span>
                      <div>
                        <p className="font-semibold">{nama}</p>
                        <p className="text-white/60 text-xs mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-800/50 border border-white/10 rounded-lg p-3 text-sm font-body text-center">
                  <p className="text-white/60 text-xs mb-1">Cara menulis koordinat sebuah titik:</p>
                  <BlockMath math="P(x, y) \quad \rightarrow \quad x = \text{absis}, \quad y = \text{ordinat}" />
                  <p className="text-yellow-300 text-xs mt-1">⚠️ Urutan selalu x dulu, baru y! Jangan tertukar.</p>
                </div>
              </div>
            )}
          </div>

          {/* KUADRAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="kuadran" icon={<Grid className="w-5 h-5" />} iconColor="text-violet-400" title="🧭 Empat Kuadran — Wilayah di Bidang Kartesius" />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/80">Sumbu-x dan sumbu-y membagi bidang Kartesius menjadi <strong className="text-violet-300">4 daerah</strong> yang disebut kuadran, diberi nomor romawi I, II, III, IV berlawanan arah jarum jam:</p>

                {/* Kuadran visual */}
                <div className="grid grid-cols-2 gap-2 text-xs font-body">
                  {[
                    { roman: "I", pos: "Kanan Atas", x: "+", y: "+", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-200", example: "A(3, 4)" },
                    { roman: "II", pos: "Kiri Atas", x: "−", y: "+", color: "bg-green-900/40 border-green-500/40 text-green-200", example: "B(−2, 3)" },
                    { roman: "III", pos: "Kiri Bawah", x: "−", y: "−", color: "bg-yellow-900/40 border-yellow-500/40 text-yellow-200", example: "C(−3, −2)" },
                    { roman: "IV", pos: "Kanan Bawah", x: "+", y: "−", color: "bg-pink-900/40 border-pink-500/40 text-pink-200", example: "D(2, −4)" },
                  ].map(({ roman, pos, x, y, color, example }) => (
                    <div key={roman} className={`border ${color} rounded-xl p-3`}>
                      <p className="font-display font-bold text-lg mb-1">Kuadran {roman}</p>
                      <p className="text-white/70">{pos}</p>
                      <p className="font-mono mt-1"><InlineMath math={`x ${x === "+" ? "> 0" : "< 0"}`} />, <InlineMath math={`y ${y === "+" ? "> 0" : "< 0"}`} /></p>
                      <p className="text-white/50 mt-1">Contoh: {example}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-3 text-sm font-body">
                  <p className="text-violet-300 font-semibold mb-1">📍 Titik di Sumbu (bukan di kuadran manapun):</p>
                  <div className="space-y-1 text-xs text-white/70">
                    <p>• Titik di <strong className="text-cyan-300">sumbu-x</strong>: ordinatnya = 0, contoh E(5, 0)</p>
                    <p>• Titik di <strong className="text-green-300">sumbu-y</strong>: absisnya = 0, contoh F(0, −3)</p>
                    <p>• <strong className="text-white">Titik asal O</strong>: koordinat (0, 0), bukan di kuadran manapun</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Mudah" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">
                    Tentukan koordinat (absis dan ordinat) dari setiap titik berikut, lalu sebutkan titik itu berada di kuadran berapa:<br />
                    a) <InlineMath math="P(4, 7)" />, b) <InlineMath math="Q(-5, 2)" />, c) <InlineMath math="R(-1, -6)" />, d) <InlineMath math="S(3, -3)" />
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-body text-sm font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-cyan-900/40">
                          <th className="border border-white/10 px-3 py-2 text-cyan-200">Titik</th>
                          <th className="border border-white/10 px-3 py-2 text-cyan-200">Absis (x)</th>
                          <th className="border border-white/10 px-3 py-2 text-cyan-200">Ordinat (y)</th>
                          <th className="border border-white/10 px-3 py-2 text-cyan-200">Kuadran</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["P(4, 7)", "4 (positif)", "7 (positif)", "I (+, +)"],
                          ["Q(−5, 2)", "−5 (negatif)", "2 (positif)", "II (−, +)"],
                          ["R(−1, −6)", "−1 (negatif)", "−6 (negatif)", "III (−, −)"],
                          ["S(3, −3)", "3 (positif)", "−3 (negatif)", "IV (+, −)"],
                        ].map(([t, x, y, k], i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                            <td className="border border-white/10 px-3 py-2 text-white font-semibold">{t}</td>
                            <td className="border border-white/10 px-3 py-2 text-cyan-300">{x}</td>
                            <td className="border border-white/10 px-3 py-2 text-green-300">{y}</td>
                            <td className="border border-white/10 px-3 py-2 text-violet-300 font-bold">{k}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="text-cyan-300 text-sm font-bold">✅ P → Kuadran I, Q → Kuadran II, R → Kuadran III, S → Kuadran IV</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Sedang" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">
                    Diketahui titik <InlineMath math="A(2a-4,\ 3b+6)" />. Tentukan nilai <InlineMath math="a" /> dan <InlineMath math="b" /> agar titik A berada tepat di titik asal O(0, 0)!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-white/70 mb-1">Agar A berada di O(0,0), maka absis = 0 dan ordinat = 0:</p>
                      <p className="text-cyan-300 font-semibold">Absis:</p>
                      <BlockMath math="2a - 4 = 0 \Rightarrow 2a = 4 \Rightarrow a = 2" />
                      <p className="text-green-300 font-semibold">Ordinat:</p>
                      <BlockMath math="3b + 6 = 0 \Rightarrow 3b = -6 \Rightarrow b = -2" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="text-cyan-300 text-sm font-bold">✅ <InlineMath math="a = 2" /> dan <InlineMath math="b = -2" /></p>
                      <p className="text-white/60 text-xs mt-1">Cek: A(2(2)−4, 3(−2)+6) = A(0, 0) ✓</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Sulit" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">
                    Titik <InlineMath math="P(3a - 9,\ 2a + 4)" /> berada di sumbu-y (bukan di titik asal). Tentukan nilai <InlineMath math="a" /> dan koordinat titik <InlineMath math="P" />!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-white/70 mb-1">Titik di sumbu-y → absis = 0, tapi ordinat ≠ 0:</p>
                      <p className="text-cyan-300 font-semibold">Syarat absis = 0:</p>
                      <BlockMath math="3a - 9 = 0 \Rightarrow 3a = 9 \Rightarrow a = 3" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">Cek ordinat dengan <InlineMath math="a = 3" />:</p>
                      <BlockMath math="\text{ordinat} = 2(3) + 4 = 6 + 4 = 10 \neq 0 \quad \checkmark" />
                      <p className="text-white/50 text-xs mt-1">(Ordinat ≠ 0, jadi titik memang di sumbu-y, bukan di titik asal)</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3 space-y-1">
                      <p className="text-cyan-300 text-sm font-bold">✅ <InlineMath math="a = 3" />, sehingga <InlineMath math="P(0,\ 10)" /></p>
                      <p className="text-white/60 text-xs">Cek: absis <InlineMath math="= 3(3) - 9 = 0" /> ✓ · ordinat <InlineMath math="= 2(3) + 4 = 10" /> ✓</p>
                      <p className="text-white/60 text-xs">Titik P berada di sumbu-y, bagian positif.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman" />
            {true && (
              <div className="px-5 pb-5 space-y-3 text-sm font-body">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead><tr className="bg-cyan-900/40"><th className="border border-white/10 px-3 py-2 text-cyan-200">Istilah</th><th className="border border-white/10 px-3 py-2 text-cyan-200">Penjelasan</th></tr></thead>
                    <tbody>
                      {[
                        ["Koordinat P(x,y)", "Pasangan terurut (absis, ordinat) yang menyatakan posisi titik P"],
                        ["Absis (x)", "Posisi horizontal — jarak ke sumbu-y"],
                        ["Ordinat (y)", "Posisi vertikal — jarak ke sumbu-x"],
                        ["Titik asal O", "(0,0) — perpotongan kedua sumbu"],
                        ["Kuadran I", "x > 0, y > 0 (kanan atas)"],
                        ["Kuadran II", "x < 0, y > 0 (kiri atas)"],
                        ["Kuadran III", "x < 0, y < 0 (kiri bawah)"],
                        ["Kuadran IV", "x > 0, y < 0 (kanan bawah)"],
                      ].map(([t, d], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-300 font-semibold">{t}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/70">{d}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-200 text-xs"><strong>💡 Hafalan Kuadran:</strong> Mulai dari Kuadran I (kanan atas) lalu putar berlawanan jarum jam → II → III → IV. Tanda koordinatnya: (+,+) → (−,+) → (−,−) → (+,−)</p>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-8/koordinat-cartesius"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Koordinat Kartesius
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsurUnsurCartesiusPage;
