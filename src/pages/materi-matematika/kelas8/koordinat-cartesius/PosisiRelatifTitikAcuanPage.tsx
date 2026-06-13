import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, MapPin } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { RangkumanSection } from "@/components/RangkumanSection";

const PosisiRelatifTitikAcuanPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep", "contoh1", "contoh2", "contoh3", "rangkuman",
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

  /* ── Mini grid untuk visualisasi posisi relatif ── */
  const RelativeGrid = ({ acuan, titik, label }: {
    acuan: [number, number]; titik: [number, number][]; label: string[];
  }) => {
    const size = 5;
    const cellPx = 24;
    const total = size * 2;
    const toCell = (v: number) => v + size;
    const colors = ["bg-cyan-400", "bg-green-400", "bg-yellow-400", "bg-pink-400"];
    const textColors = ["text-cyan-300", "text-green-300", "text-yellow-300", "text-pink-300"];

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
          {/* Acuan point - orange star */}
          <div className="absolute z-20 flex items-center justify-center"
            style={{ left: toCell(acuan[0]) * cellPx - 6, top: toCell(-acuan[1]) * cellPx - 6, width: 12, height: 12 }}>
            <div className="w-3 h-3 bg-orange-400 rotate-45 border border-white/80" />
          </div>
          <span className="absolute z-20 font-mono font-bold text-orange-300"
            style={{ fontSize: 8, left: toCell(acuan[0]) * cellPx + 7, top: toCell(-acuan[1]) * cellPx - 12, whiteSpace: "nowrap" }}>
            Acuan({acuan[0]},{acuan[1]})
          </span>
          {/* Lines from acuan to titik */}
          {titik.map(([tx, ty], i) => {
            const ax = toCell(acuan[0]) * cellPx;
            const ay = toCell(-acuan[1]) * cellPx;
            const bx = toCell(tx) * cellPx;
            const by = toCell(-ty) * cellPx;
            const dx = bx - ax;
            const dy = by - ay;
            const len = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            return (
              <div key={i} className="absolute z-10 origin-left opacity-50"
                style={{ left: ax, top: ay, width: len, height: 1, background: ["#22d3ee", "#4ade80", "#facc15", "#f472b6"][i % 4], transform: `rotate(${angle}deg)` }} />
            );
          })}
          {/* Target points */}
          {titik.map(([tx, ty], i) => (
            <div key={i}>
              <div className={`absolute rounded-full ${colors[i % 4]} border-2 border-white/80 z-20`}
                style={{ width: 8, height: 8, left: toCell(tx) * cellPx - 4, top: toCell(-ty) * cellPx - 4 }} />
              <span className={`absolute font-mono font-bold z-20 ${textColors[i % 4]}`}
                style={{ fontSize: 8, left: toCell(tx) * cellPx + 5, top: toCell(-ty) * cellPx - 10, whiteSpace: "nowrap" }}>
                {label[i]}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          <span className="text-orange-300 text-xs font-mono flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-orange-400 rotate-45" />Titik Acuan
          </span>
          {titik.map((_, i) => (
            <span key={i} className={`text-xs font-mono flex items-center gap-1 ${textColors[i % 4]}`}>
              <span className={`inline-block w-2 h-2 rounded-full ${colors[i % 4]}`} />{label[i]}
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
          POSISI RELATIF TITIK TERHADAP TITIK ACUAN
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Bukan Hanya Terhadap Sumbu — Terhadap Titik Manapun!
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 8 · Koordinat Kartesius · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Bayangkan Ini..." />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Kamu berdiri di alun-alun kota (titik acuan). Temanmu ada di 3 meter ke kananmu dan 5 meter di depanmu. Ini bukan koordinat mutlak terhadap "nol" — ini adalah <strong className="text-cyan-300">posisi relatif</strong> terhadap dirimu sebagai titik acuan. Konsep yang sama digunakan dalam matematika: menentukan letak suatu titik bukan terhadap O(0,0), tapi terhadap <strong className="text-cyan-300">sembarang titik acuan</strong> yang kita pilih!
                </p>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>Aplikasi nyata:</strong> Sistem navigasi kapal, peta militer, permainan strategi, hingga robotika menggunakan konsep posisi relatif. Robot tahu "bergerak 3 langkah ke kanan dari posisi saat ini" — bukan dari titik nol mutlak!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* KONSEP */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep" icon={<MapPin className="w-5 h-5" />} iconColor="text-orange-400" title="📘 Konsep: Koordinat Relatif" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Jika <InlineMath math="A(x_1, y_1)" /> adalah titik acuan dan <InlineMath math="B(x_2, y_2)" /> adalah titik yang ingin kita tentukan posisinya, maka <strong className="text-cyan-300">posisi B relatif terhadap A</strong> dinyatakan sebagai selisih koordinat B terhadap A.
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4 text-center space-y-2">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-2">📐 Rumus Posisi Relatif</p>
                  <BlockMath math="\text{Posisi B relatif terhadap A} = (x_2 - x_1,\ y_2 - y_1)" />
                  <div className="flex justify-center gap-4 text-xs font-body flex-wrap mt-1">
                    <span className="text-cyan-300"><InlineMath math="x_2 - x_1" /> = selisih horizontal</span>
                    <span className="text-green-300"><InlineMath math="y_2 - y_1" /> = selisih vertikal</span>
                  </div>
                </div>

                {/* Visualisasi */}
                <div className="bg-slate-800/70 border border-orange-500/20 rounded-xl p-4 flex flex-col items-center gap-3">
                  <p className="font-body text-xs font-bold text-orange-300 uppercase">🗺️ Contoh Visual: A(2,1) sebagai Acuan</p>
                  <RelativeGrid
                    acuan={[2, 1]}
                    titik={[[-1, 4], [4, -2]]}
                    label={["P(−1,4)", "Q(4,−2)"]}
                  />
                  <div className="grid grid-cols-2 gap-2 w-full text-xs font-body">
                    <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-2">
                      <p className="text-cyan-300 font-semibold">P relatif terhadap A:</p>
                      <p className="text-white/70 mt-1"><InlineMath math="(-1-2,\ 4-1) = (-3, 3)" /></p>
                      <p className="text-white/50 text-xs">→ 3 ke kiri, 3 ke atas dari A</p>
                    </div>
                    <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-2">
                      <p className="text-green-300 font-semibold">Q relatif terhadap A:</p>
                      <p className="text-white/70 mt-1"><InlineMath math="(4-2,\ -2-1) = (2, -3)" /></p>
                      <p className="text-white/50 text-xs">→ 2 ke kanan, 3 ke bawah dari A</p>
                    </div>
                  </div>
                </div>

                {/* Cara membaca posisi relatif */}
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 space-y-2 text-xs font-body">
                  <p className="font-bold text-white mb-2">🧭 Cara Membaca Hasil (Δx, Δy):</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { kondisi: "Δx > 0", arti: "B ada di KANAN A", color: "text-cyan-300" },
                      { kondisi: "Δx < 0", arti: "B ada di KIRI A", color: "text-cyan-300" },
                      { kondisi: "Δy > 0", arti: "B ada di ATAS A", color: "text-green-300" },
                      { kondisi: "Δy < 0", arti: "B ada di BAWAH A", color: "text-green-300" },
                    ].map(({ kondisi, arti, color }) => (
                      <div key={kondisi} className="bg-slate-700/40 border border-white/10 rounded-lg p-2">
                        <p className={`font-mono font-bold ${color}`}>{kondisi}</p>
                        <p className="text-white/60 mt-0.5">{arti}</p>
                      </div>
                    ))}
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
                    Diketahui titik acuan <InlineMath math="A(3, 2)" /> dan titik <InlineMath math="B(7, 6)" />. Tentukan posisi titik B relatif terhadap titik A, dan jelaskan arahnya!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                    <p className="text-white/70">Posisi B relatif terhadap A:</p>
                    <BlockMath math="\Delta x = x_B - x_A = 7 - 3 = 4" />
                    <BlockMath math="\Delta y = y_B - y_A = 6 - 2 = 4" />
                    <p className="text-white/70">Posisi relatif: <strong className="text-cyan-300">(4, 4)</strong></p>
                    <p className="text-white/60 text-xs">→ <InlineMath math="\Delta x = 4 > 0" />: B berada 4 satuan di <strong className="text-cyan-300">kanan</strong> A</p>
                    <p className="text-white/60 text-xs">→ <InlineMath math="\Delta y = 4 > 0" />: B berada 4 satuan di <strong className="text-green-300">atas</strong> A</p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="text-cyan-300 text-sm font-bold">✅ Posisi B relatif terhadap A = (4, 4) — 4 satuan ke kanan dan 4 satuan ke atas.</p>
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
                    Titik <InlineMath math="P(1, -3)" /> digunakan sebagai titik acuan. Jika titik Q berposisi relatif <InlineMath math="(-4, 5)" /> terhadap P, tentukan koordinat titik Q yang sebenarnya (koordinat mutlaknya)!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                    <p className="text-white/70">Diketahui posisi relatif Q terhadap P = (−4, 5), artinya:</p>
                    <BlockMath math="x_Q - x_P = -4 \Rightarrow x_Q = x_P + (-4) = 1 + (-4) = -3" />
                    <BlockMath math="y_Q - y_P = 5 \Rightarrow y_Q = y_P + 5 = -3 + 5 = 2" />
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 text-xs">
                    <p className="text-yellow-200">💡 <strong>Rumus balik:</strong> Koordinat mutlak = koordinat acuan + posisi relatif</p>
                    <p className="text-white/60 mt-0.5"><InlineMath math="B = A + (\Delta x, \Delta y)" /></p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="text-cyan-300 text-sm font-bold">✅ Koordinat Q = <InlineMath math="(-3, 2)" /></p>
                    <p className="text-white/60 text-xs mt-1">Cek: Q−P = (−3−1, 2−(−3)) = (−4, 5) ✓</p>
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
                    Diketahui titik-titik <InlineMath math="A(-2, 4)" />, <InlineMath math="B(3, 1)" />, dan <InlineMath math="C(c_1, c_2)" />. Jika posisi C relatif terhadap B sama dengan posisi B relatif terhadap A, tentukan koordinat C!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Langkah 1 — Hitung posisi B relatif terhadap A:</p>
                      <BlockMath math="\Delta x_{BA} = x_B - x_A = 3 - (-2) = 5" />
                      <BlockMath math="\Delta y_{BA} = y_B - y_A = 1 - 4 = -3" />
                      <p className="text-white/70">Posisi B relatif terhadap A = <strong className="text-cyan-300">(5, −3)</strong></p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-2">Langkah 2 — Terapkan selisih yang sama untuk C relatif terhadap B:</p>
                      <p className="text-white/70">Posisi C relatif terhadap B juga = (5, −3)</p>
                      <BlockMath math="c_1 = x_B + 5 = 3 + 5 = 8" />
                      <BlockMath math="c_2 = y_B + (-3) = 1 - 3 = -2" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-white/60">
                      <p className="text-white/70 mb-1">💡 Ini sebenarnya membuat barisan aritmetika 2D: A → B → C dengan selisih (5, −3) di setiap langkah!</p>
                      <p>A(−2, 4) → B(3, 1) → C(8, −2)</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="text-cyan-300 text-sm font-bold">✅ Koordinat C = <InlineMath math="(8, -2)" /></p>
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
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                  {[
                    ["Posisi relatif B terhadap A", "(x₂ − x₁, y₂ − y₁)"],
                    ["Koordinat mutlak dari posisi relatif", "B = A + (Δx, Δy)"],
                    ["Δx > 0", "B di KANAN A"],
                    ["Δx < 0", "B di KIRI A"],
                    ["Δy > 0", "B di ATAS A"],
                    ["Δy < 0", "B di BAWAH A"],
                  ].map(([term, def]) => (
                    <div key={term} className="flex gap-2">
                      <span className="text-cyan-400 shrink-0">▸</span>
                      <p className="text-white/80"><strong className="text-cyan-300">{term}:</strong> {def}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-200 text-xs"><strong>💡 Perbedaan kunci:</strong> Koordinat mutlak selalu dihitung dari O(0,0). Koordinat relatif dihitung dari titik acuan yang dipilih. Keduanya bisa dikonversi satu sama lain!</p>
                </div>
              </div>
            )}
          </div>

          {/* ═══ RANGKUMAN ═══ */}
          <RangkumanSection
            gradientFrom="from-emerald-600" gradientVia="via-teal-600" gradientTo="to-cyan-700"
            borderColor="border-emerald-500/30" accentColor="text-emerald-200"
            headerIcon="📋" judul="Rangkuman — Posisi Relatif terhadap Titik Acuan"
            subjudul="Cara menentukan arah dan letak suatu titik dari titik referensi manapun"
            ringkasan={[
              { emoji:"🎯", judul:"Titik Acuan sebagai Pusat Lokal", bg:"bg-emerald-900/40", border:"border-emerald-500/30", textColor:"text-emerald-300",
                isi:"Titik acuan berperan sebagai 'origin baru'. Semua posisi dihitung relatif terhadap titik ini, bukan terhadap O(0,0) asli." },
              { emoji:"↔️", judul:"Selisih Absis (Δx)", bg:"bg-teal-900/40", border:"border-teal-500/30", textColor:"text-teal-300",
                isi:"Δx = xB − xA. Jika Δx > 0 → B di kanan A. Jika Δx < 0 → B di kiri A. Jika Δx = 0 → segaris vertikal." },
              { emoji:"↕️", judul:"Selisih Ordinat (Δy)", bg:"bg-cyan-900/40", border:"border-cyan-500/30", textColor:"text-cyan-300",
                isi:"Δy = yB − yA. Jika Δy > 0 → B di atas A. Jika Δy < 0 → B di bawah A. Jika Δy = 0 → segaris horizontal." },
              { emoji:"🔄", judul:"Posisi Relatif Berbalik", bg:"bg-green-900/40", border:"border-green-500/30", textColor:"text-green-300",
                isi:"Posisi B terhadap A ≠ posisi A terhadap B. Keduanya selalu berlawanan: jika B di kanan A, maka A di kiri B." },
            ]}
            rumus={[
              { label:"Selisih koordinat (posisi B terhadap A):", rumus:"\\Delta x = x_B - x_A \\qquad \\Delta y = y_B - y_A", bg:"bg-emerald-900/30", border:"border-emerald-500/25", labelColor:"text-emerald-300" },
            ]}
            tips={[
              { emoji:"🧠", teks:<>Rumus mudah: <strong>TUJUAN − ACUAN</strong>. Koordinat titik yang dicari posisinya (tujuan) dikurangi koordinat titik acuan. Jangan sampai terbalik!</> },
              { emoji:"🗺️", teks:"Bayangkan titik acuan sebagai 'rumahmu' yang menjadi titik (0,0) di peta barumu. Semua jarak diukur dari sana ke segala arah." },
              { emoji:"📐", teks:<>Δx = 0 → kedua titik pada garis vertikal yang sama. Δy = 0 → kedua titik pada garis horizontal yang sama. Keduanya nol → titik berimpit.</> },
              { emoji:"✅", teks:"Cek jawaban: jika B(5,3) dan A(2,1), maka Δx=3 (kanan 3 satuan), Δy=2 (atas 2 satuan). Bayangkan panah dari A ke B — masuk akal?" },
            ]}
            kesimpulan="Posisi relatif digunakan di mana-mana — arahan GPS ('belok kiri 200 m'), sistem koordinat robot, peta militer, hingga spreadsheet. Konsep Δx dan Δy adalah dasar dari semua sistem navigasi modern di bumi!"
            kesimpulanBg="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20"
            kesimpulanBorder="border-emerald-400/40"
            kesimpulanTextColor="text-emerald-100/90"
          />

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

export default PosisiRelatifTitikAcuanPage;
