import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Ruler } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import JarakDuaTitikInteraktif from "@/components/JarakDuaTitikInteraktif";

const JarakTitikGarisPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "jarakdua", "jarakgaris", "contoh1", "contoh2", "contoh3", "rangkuman",
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

  /* ── Visualisasi dua titik & jarak ── */
  const TwoPointGrid = () => {
    const A = [1, 4]; const B = [4, 1];
    const size = 5; const cellPx = 22; const total = size * 2;
    const toCell = (v: number) => (v + size) * cellPx;
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative border border-white/20 rounded-lg overflow-hidden"
          style={{ width: total * cellPx, height: total * cellPx, background: "rgba(15,23,42,0.85)" }}>
          {Array.from({ length: total + 1 }).map((_, i) => (
            <React.Fragment key={i}>
              <div className="absolute" style={{ left: i * cellPx, top: 0, width: 1, height: total * cellPx, background: i === size ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.07)" }} />
              <div className="absolute" style={{ top: i * cellPx, left: 0, height: 1, width: total * cellPx, background: i === size ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.07)" }} />
            </React.Fragment>
          ))}
          {/* Jarak garis diagonal */}
          {(() => {
            const ax = toCell(A[0]); const ay = toCell(-A[1]);
            const bx = toCell(B[0]); const by = toCell(-B[1]);
            const dx = bx - ax; const dy = by - ay;
            const len = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            return <div className="absolute z-10 origin-left" style={{ left: ax, top: ay, width: len, height: 2, background: "#22d3ee", transform: `rotate(${angle}deg)`, opacity: 0.8 }} />;
          })()}
          {/* Segitiga siku-siku */}
          <div className="absolute border-r-2 border-dashed border-cyan-400/40 z-5"
            style={{ left: toCell(A[0]), top: toCell(-A[1]), width: toCell(B[0]) - toCell(A[0]), height: toCell(-B[1]) - toCell(-A[1]) }} />
          {/* Labels Δx Δy */}
          <span className="absolute text-cyan-300 font-mono z-20" style={{ fontSize: 8, left: (toCell(A[0]) + toCell(B[0])) / 2, top: toCell(-A[1]) + 2 }}>Δx=3</span>
          <span className="absolute text-green-300 font-mono z-20" style={{ fontSize: 8, left: toCell(B[0]) + 2, top: (toCell(-A[1]) + toCell(-B[1])) / 2 }}>Δy=3</span>
          {/* Points */}
          {([[A[0], A[1], "A(1,4)", "bg-cyan-400", "text-cyan-300"], [B[0], B[1], "B(4,1)", "bg-pink-400", "text-pink-300"]] as [number, number, string, string, string][]).map(([x, y, label, bg, tc]) => (
            <div key={label}>
              <div className={`absolute rounded-full ${bg} border-2 border-white/80 z-20`} style={{ width: 8, height: 8, left: toCell(x) - 4, top: toCell(-y) - 4 }} />
              <span className={`absolute font-mono font-bold z-20 ${tc}`} style={{ fontSize: 8, left: toCell(x) + 5, top: toCell(-y) - 12, whiteSpace: "nowrap" }}>{label}</span>
            </div>
          ))}
        </div>
        <p className="text-cyan-300 text-xs font-mono">d(AB) = √(3²+3²) = √18 = 3√2 ≈ 4,24</p>
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
          JARAK ANTAR DUA TITIK DAN JARAK TITIK KE GARIS
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Teorema Pythagoras Bertemu Koordinat Kartesius!
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Koordinat Kartesius · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Mengapa Kita Perlu Mengukur Jarak di Koordinat?" />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Di peta digital, berapa jarak lurus dari rumahmu ke sekolah? Di game, berapa jarak karakter dari musuh? Semua pertanyaan ini dijawab dengan rumus yang sama: gabungan <strong className="text-cyan-300">koordinat Kartesius</strong> dan <strong className="text-cyan-300">Teorema Pythagoras</strong>. Konsep ini juga fundamental untuk menghitung jarak terdekat sebuah titik ke sebuah garis — dipakai dalam grafis komputer, engineering, dan GPS!
                </p>

                <div className="flex flex-col items-center gap-2">
                  <img
                    src="/images/peta-jarak-dua-titik.png"
                    alt="Contoh jarak dua titik pada peta Google Maps — Central Park New York, 0.60 miles"
                    className="rounded-xl border border-white/10 shadow-lg w-full max-w-sm object-cover"
                  />
                  <p className="text-white/40 text-xs font-body italic text-center">
                    Garis hitam menunjukkan jarak lurus antara dua titik di peta — konsep yang sama dengan rumus jarak koordinat Kartesius.{" "}
                    <a
                      href="https://terralogiq.com/cara-menghitung-jarak-antar-titik-dengan-maps-javascript-api/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400/70 hover:text-cyan-300 underline underline-offset-2 transition-colors"
                    >
                      Sumber: terralogiq.com
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* JARAK DUA TITIK */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="jarakdua" icon={<Ruler className="w-5 h-5" />} iconColor="text-cyan-400" title="📏 Bagian 1 — Jarak Antar Dua Titik" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">
                    Jarak antara dua titik di bidang Kartesius dihitung menggunakan <strong className="text-cyan-300">rumus jarak</strong> yang merupakan penerapan langsung Teorema Pythagoras. Dua titik membentuk hipotenusa segitiga siku-siku di mana selisih koordinatnya membentuk dua sisi tegak.
                  </p>
                </div>

                <div className="bg-slate-800/50 border border-cyan-500/30 rounded-xl p-4 text-center space-y-2">
                  <p className="font-body text-xs text-white/60">Rumus Jarak Dua Titik A(x₁, y₁) dan B(x₂, y₂):</p>
                  <BlockMath math="\boxed{d(AB) = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}}" />
                </div>

                {/* ANIMASI INTERAKTIF JARAK DUA TITIK */}
                <div className="bg-slate-800/60 border border-cyan-500/25 rounded-xl p-4 space-y-3">
                  <p className="text-cyan-300 font-mono font-bold text-sm">🎮 Animasi Interaktif — Seret Titik A dan B</p>
                  <p className="text-white/50 text-xs font-body">Geser titik A dan B — rumus, nilai x₁, y₁, x₂, y₂, dan jarak otomatis diperbarui!</p>
                  <JarakDuaTitikInteraktif />
                </div>
              </div>
            )}
          </div>

          {/* JARAK TITIK KE GARIS */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="jarakgaris" icon={<Ruler className="w-5 h-5" />} iconColor="text-green-400" title="📏 Bagian 2 — Jarak Titik ke Garis" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">
                    Jarak titik ke garis adalah <strong className="text-green-300">jarak terpendek</strong> dari titik tersebut ke garis — yang selalu berupa garis tegak lurus. Untuk garis horizontal/vertikal cukup hitung selisih koordinat. Untuk garis miring, gunakan rumus khusus.
                  </p>
                </div>

                {/* Kasus garis tegak/datar */}
                <div className="space-y-2 text-xs font-body">
                  <p className="font-bold text-white text-sm">Kasus Khusus (Garis Horizontal/Vertikal):</p>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-1">Garis horizontal <InlineMath math="y = k" />:</p>
                      <BlockMath math="d = |y_P - k|" />
                      <p className="text-white/60">Jarak titik P(a, b) ke garis y = k adalah |b − k|</p>
                    </div>
                    <div className="bg-slate-800/50 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">Garis vertikal <InlineMath math="x = k" />:</p>
                      <BlockMath math="d = |x_P - k|" />
                      <p className="text-white/60">Jarak titik P(a, b) ke garis x = k adalah |a − k|</p>
                    </div>
                    <div className="bg-slate-800/50 border border-violet-500/30 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">Garis miring <InlineMath math="ax + by + c = 0" />:</p>
                      <BlockMath math="d = \frac{|ax_P + by_P + c|}{\sqrt{a^2 + b^2}}" />
                      <p className="text-white/60">Masukkan koordinat P ke persamaan garis, bagi dengan panjang vektor normal</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Mudah (Jarak Dua Titik)" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">Tentukan jarak antara titik <InlineMath math="P(1, 2)" /> dan <InlineMath math="Q(4, 6)" />!</p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <BlockMath math="d(PQ) = \sqrt{(4-1)^2 + (6-2)^2}" />
                    <BlockMath math="= \sqrt{3^2 + 4^2} = \sqrt{9 + 16} = \sqrt{25} = 5" />
                  </div>
                  <div className="bg-slate-800/40 border border-white/10 rounded-lg p-2 text-xs">
                    <p className="text-yellow-200">✨ Perhatikan: 3² + 4² = 5² → ini <strong>Tripel Pythagoras</strong> yang terkenal (3-4-5)!</p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="text-cyan-300 text-sm font-bold">✅ Jarak PQ = <strong>5 satuan</strong></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Sedang (Jarak Titik ke Garis)" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">
                    Hitung jarak dari titik <InlineMath math="A(3, -2)" /> ke garis:<br />
                    a) <InlineMath math="y = 4" />&nbsp;&nbsp;&nbsp;b) <InlineMath math="x = -1" />
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-1">a) ke garis y = 4:</p>
                      <BlockMath math="d = |y_A - 4| = |-2 - 4|" />
                      <BlockMath math="= |-6| = 6" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-green-300 font-semibold mb-1">b) ke garis x = −1:</p>
                      <BlockMath math="d = |x_A - (-1)| = |3 + 1|" />
                      <BlockMath math="= |4| = 4" />
                    </div>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="text-cyan-300 text-sm font-bold">✅ a) Jarak ke y = 4 adalah <strong>6 satuan</strong>. b) Jarak ke x = −1 adalah <strong>4 satuan</strong>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Sulit (Jarak ke Garis Miring)" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">
                    Hitunglah jarak titik <InlineMath math="P(4, 3)" /> terhadap garis <InlineMath math="3x - 4y + 5 = 0" />!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-1">Identifikasi: <InlineMath math="a=3,\ b=-4,\ c=5" />, titik P(4, 3)</p>
                      <p className="text-white/70">Gunakan rumus jarak titik ke garis miring:</p>
                      <BlockMath math="d = \frac{|ax_P + by_P + c|}{\sqrt{a^2 + b^2}}" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">Substitusi:</p>
                      <BlockMath math="d = \frac{|3(4) + (-4)(3) + 5|}{\sqrt{3^2 + (-4)^2}}" />
                      <BlockMath math="= \frac{|12 - 12 + 5|}{\sqrt{9 + 16}} = \frac{|5|}{\sqrt{25}} = \frac{5}{5} = 1" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="text-cyan-300 text-sm font-bold">✅ Jarak P ke garis 3x − 4y + 5 = 0 adalah <strong>1 satuan</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman Rumus Jarak" />
            {true && (
              <div className="px-5 pb-5 space-y-3 text-sm font-body">
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { judul: "Jarak 2 Titik A(x₁,y₁) & B(x₂,y₂)", rumus: "d = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}", color: "bg-cyan-900/30 border-cyan-500/30" },
                    { judul: "Titik P(a,b) ke Garis y = k", rumus: "d = |b - k|", color: "bg-green-900/30 border-green-500/30" },
                    { judul: "Titik P(a,b) ke Garis x = k", rumus: "d = |a - k|", color: "bg-violet-900/30 border-violet-500/30" },
                    { judul: "Titik P(x₀,y₀) ke Garis ax+by+c=0", rumus: "d = \\dfrac{|ax_0+by_0+c|}{\\sqrt{a^2+b^2}}", color: "bg-orange-900/30 border-orange-500/30" },
                  ].map(({ judul, rumus, color }) => (
                    <div key={judul} className={`border ${color} rounded-lg p-3 text-center`}>
                      <p className="text-white/60 text-xs mb-1">{judul}</p>
                      <BlockMath math={rumus} />
                    </div>
                  ))}
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

export default JarakTitikGarisPage;
