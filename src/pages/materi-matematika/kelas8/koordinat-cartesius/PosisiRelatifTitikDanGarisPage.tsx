import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Target, MapPin, Navigation, MousePointerClick } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { InteraktifTitikAcuan, InteraktifGaris } from "@/components/PosisiRelatifInteraktif";

const PosisiRelatifTitikDanGarisPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (id: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const SectionHeader = ({ id, icon, iconColor, title }: {
    id: string; icon: React.ReactNode; iconColor?: string; title: React.ReactNode;
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

  /* ── Mini grid untuk visualisasi posisi relatif terhadap titik acuan ── */
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
          <div className="absolute z-20 flex items-center justify-center"
            style={{ left: toCell(acuan[0]) * cellPx - 6, top: toCell(-acuan[1]) * cellPx - 6, width: 12, height: 12 }}>
            <div className="w-3 h-3 bg-orange-400 rotate-45 border border-white/80" />
          </div>
          <span className="absolute z-20 font-mono font-bold text-orange-300"
            style={{ fontSize: 8, left: toCell(acuan[0]) * cellPx + 7, top: toCell(-acuan[1]) * cellPx - 12, whiteSpace: "nowrap" }}>
            Acuan({acuan[0]},{acuan[1]})
          </span>
          {titik.map(([tx, ty], i) => {
            const ax = toCell(acuan[0]) * cellPx;
            const ay = toCell(-acuan[1]) * cellPx;
            const bx = toCell(tx) * cellPx;
            const by = toCell(-ty) * cellPx;
            const dx = bx - ax; const dy = by - ay;
            const len = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            return (
              <div key={i} className="absolute z-10 origin-left opacity-50"
                style={{ left: ax, top: ay, width: len, height: 1, background: ["#22d3ee", "#4ade80", "#facc15", "#f472b6"][i % 4], transform: `rotate(${angle}deg)` }} />
            );
          })}
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

  /* ── Visualisasi titik terhadap garis ── */
  const LinePointGrid = ({ slope, intercept, points }: {
    slope: number; intercept: number;
    points: { x: number; y: number; label: string; side: "atas" | "bawah" | "pada" }[];
  }) => {
    const size = 5; const cellPx = 22; const total = size * 2;
    const toCell = (v: number) => (v + size) * cellPx;
    const sideColors: Record<string, string> = { atas: "bg-cyan-400", bawah: "bg-pink-400", pada: "bg-green-400" };
    const textColors: Record<string, string> = { atas: "text-cyan-300", bawah: "text-pink-300", pada: "text-green-300" };

    const linePoints: [number, number][] = [];
    for (let xi = -size; xi <= size; xi++) {
      const yi = slope * xi + intercept;
      if (yi >= -size && yi <= size) linePoints.push([xi, yi]);
    }

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
          {linePoints.length >= 2 && (() => {
            const [x0, y0] = linePoints[0];
            const [x1, y1] = linePoints[linePoints.length - 1];
            const ax = toCell(x0); const ay = toCell(-y0);
            const bx = toCell(x1); const by = toCell(-y1);
            const dx = bx - ax; const dy = by - ay;
            const len = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            return <div className="absolute z-10 origin-left" style={{ left: ax, top: ay, width: len, height: 2, background: "#a78bfa", transform: `rotate(${angle}deg)`, opacity: 0.9 }} />;
          })()}
          {points.map(({ x, y, label, side }) => (
            <div key={label}>
              <div className={`absolute rounded-full ${sideColors[side]} border-2 border-white/80 z-20`}
                style={{ width: 8, height: 8, left: toCell(x) - 4, top: toCell(-y) - 4 }} />
              <span className={`absolute font-mono font-bold z-20 ${textColors[side]}`}
                style={{ fontSize: 8, left: toCell(x) + 5, top: toCell(-y) - 12, whiteSpace: "nowrap" }}>{label}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap justify-center text-xs font-mono">
          <span className="text-violet-300">── Garis</span>
          <span className="text-cyan-300">● Di atas</span>
          <span className="text-pink-300">● Di bawah</span>
          <span className="text-green-300">● Pada garis</span>
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
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          POSISI RELATIF TITIK TERHADAP SEMBARANG TITIK ACUAN DAN SUATU GARIS
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          Dua Cara Menentukan Posisi Titik dalam Bidang Kartesius
        </p>
        <p className="text-white/50 text-xs text-center mb-8 font-body">Kelas 8 · Koordinat Kartesius · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ══════════════════════════════════════════════ */}
          {/* BAGIAN 1: POSISI RELATIF TERHADAP TITIK ACUAN */}
          {/* ══════════════════════════════════════════════ */}
          <div className="bg-gradient-to-r from-orange-500/20 to-cyan-500/20 border border-orange-400/40 rounded-xl px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">📍</span>
            <div>
              <p className="font-display text-base font-bold text-orange-300 leading-tight">Bagian 1</p>
              <p className="font-body text-sm font-semibold text-white">Posisi Relatif Titik terhadap Sembarang Titik Acuan</p>
              <p className="font-body text-xs text-white/50 mt-0.5">Bukan hanya terhadap O(0,0) — terhadap titik manapun!</p>
            </div>
          </div>

          {/* INTRO 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro1" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Bayangkan Ini..." />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Kamu berdiri di alun-alun kota (titik acuan). Temanmu ada di 3 meter ke kananmu dan 5 meter di depanmu. Ini bukan koordinat mutlak terhadap "nol" — ini adalah <strong className="text-cyan-300">posisi relatif</strong> terhadap dirimu sebagai titik acuan. Konsep yang sama digunakan dalam matematika: menentukan letak suatu titik bukan terhadap O(0,0), tapi terhadap <strong className="text-cyan-300">sembarang titik acuan</strong> yang kita pilih!
                </p>
                <div className="rounded-xl overflow-hidden border border-orange-500/20">
                  <img
                    src="/images/posisi-relatif-alunalun.png"
                    alt="Ilustrasi posisi relatif di alun-alun kota"
                    className="w-full object-cover"
                  />
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>Aplikasi nyata:</strong> Sistem navigasi kapal, peta militer, permainan strategi, hingga robotika menggunakan konsep posisi relatif. Robot tahu "bergerak 3 langkah ke kanan dari posisi saat ini" — bukan dari titik nol mutlak!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* KONSEP 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<MapPin className="w-5 h-5" />} iconColor="text-orange-400" title="📘 Konsep: Koordinat Relatif terhadap Titik Acuan" />
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

          {/* ANIMASI INTERAKTIF 1 */}
          <div className="bg-card/80 backdrop-blur border border-orange-500/30 rounded-xl overflow-hidden">
            <div className="px-5 py-4 flex items-center gap-3 border-b border-orange-500/20">
              <MousePointerClick className="w-5 h-5 text-orange-400 shrink-0" />
              <div>
                <p className="font-body font-semibold text-white">🎮 Animasi Interaktif — Seret Titik Acuan & Dua Titik</p>
                <p className="text-white/50 text-xs font-body mt-0.5">Geser titik A (acuan), P, dan Q — posisi relatif otomatis dihitung!</p>
              </div>
            </div>
            <div className="px-5 py-5">
              <InteraktifTitikAcuan />
            </div>
          </div>

          {/* CONTOH 1A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1a" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Mudah (Titik Acuan)" />
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

          {/* CONTOH 2A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2a" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Sedang (Titik Acuan)" />
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

          {/* CONTOH 3A */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3a" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Sulit (Titik Acuan)" />
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
                      <p className="text-white/70 mb-1">💡 Ini sebenarnya membuat barisan aritmetika 2D: A → B → C dengan selisih (5, −3)!</p>
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

          {/* RANGKUMAN 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman1" icon={<BookOpen className="w-5 h-5" />} iconColor="text-cyan-400" title="📌 Rangkuman — Posisi Relatif terhadap Titik Acuan" />
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
                  <p className="text-yellow-200 text-xs"><strong>💡 Perbedaan kunci:</strong> Koordinat mutlak selalu dihitung dari O(0,0). Koordinat relatif dihitung dari titik acuan yang dipilih.</p>
                </div>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════ */}
          {/* BAGIAN 2: POSISI RELATIF TERHADAP GARIS       */}
          {/* ══════════════════════════════════════════════ */}
          <div className="bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-400/40 rounded-xl px-5 py-4 flex items-center gap-3 mt-4">
            <span className="text-2xl">🗺️</span>
            <div>
              <p className="font-display text-base font-bold text-violet-300 leading-tight">Bagian 2</p>
              <p className="font-body text-sm font-semibold text-white">Posisi Relatif Suatu Titik terhadap Suatu Garis</p>
              <p className="font-body text-xs text-white/50 mt-0.5">Di atas, di bawah, atau tepat di garis?</p>
            </div>
          </div>

          {/* INTRO 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro2" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Di Mana Posisimu Terhadap Garis Batas?" />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Bayangkan garis pantai sebagai batas antara laut dan daratan. Rumah di sisi mana? Di sisi laut atau daratan? Pertanyaan yang sama muncul di matematika: ketika ada sebuah garis di bidang Kartesius, kita bisa menentukan apakah suatu titik berada <strong className="text-cyan-300">di atas, di bawah, atau tepat pada garis</strong> tersebut — tanpa perlu menggambar, hanya dengan substitusi koordinat!
                </p>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-xs text-yellow-200">
                    <strong>Aplikasi nyata:</strong> Dalam machine learning, algoritma klasifikasi (seperti Support Vector Machine) menentukan apakah data baru berada di sisi positif atau negatif dari garis pemisah — persis konsep yang akan kamu pelajari ini!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* KONSEP 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep2" icon={<Navigation className="w-5 h-5" />} iconColor="text-violet-400" title="📘 Cara Menentukan Posisi Titik terhadap Garis" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-violet-300 mb-2">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">
                    Untuk menentukan posisi titik <InlineMath math="P(x_0, y_0)" /> terhadap garis <InlineMath math="ax + by + c = 0" />, kita <strong className="text-violet-300">substitusikan koordinat P</strong> ke ekspresi garis dan perhatikan tandanya.
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-violet-300 uppercase mb-1">🔑 Metode Substitusi</p>
                  <p className="font-body text-xs text-white/60">Hitung nilai <InlineMath math="f(P) = ax_0 + by_0 + c" />, lalu:</p>
                  <div className="space-y-2 text-xs font-body">
                    {[
                      { kondisi: "f(P) > 0", arti: "Titik P berada di sisi POSITIF garis", bg: "bg-cyan-900/40 border-cyan-500/40 text-cyan-200" },
                      { kondisi: "f(P) = 0", arti: "Titik P berada TEPAT PADA garis", bg: "bg-green-900/40 border-green-500/40 text-green-200" },
                      { kondisi: "f(P) < 0", arti: "Titik P berada di sisi NEGATIF garis", bg: "bg-pink-900/40 border-pink-500/40 text-pink-200" },
                    ].map(({ kondisi, arti, bg }) => (
                      <div key={kondisi} className={`border ${bg} rounded-lg p-3 flex gap-3 items-center`}>
                        <span className="font-mono font-bold text-sm min-w-[70px]">{kondisi}</span>
                        <span className="text-white/70">{arti}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/70 border border-violet-500/20 rounded-xl p-4 flex flex-col items-center gap-3">
                  <p className="font-body text-xs font-bold text-violet-300 uppercase">📐 Contoh: Garis y = x (atau x − y = 0)</p>
                  <LinePointGrid
                    slope={1}
                    intercept={0}
                    points={[
                      { x: -3, y: 2, label: "A(−3,2)", side: "atas" },
                      { x: 3, y: -1, label: "B(3,−1)", side: "bawah" },
                      { x: 2, y: 2, label: "C(2,2)", side: "pada" },
                    ]}
                  />
                  <div className="grid grid-cols-3 gap-2 w-full text-xs font-body">
                    <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-2 text-center">
                      <p className="text-cyan-300 font-bold">A(−3, 2)</p>
                      <p className="text-white/60">f(A) = −3−2 = −5</p>
                      <p className="text-cyan-300">Sisi negatif</p>
                      <p className="text-white/40 text-xs">(di atas garis y=x)</p>
                    </div>
                    <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-2 text-center">
                      <p className="text-green-300 font-bold">C(2, 2)</p>
                      <p className="text-white/60">f(C) = 2−2 = 0</p>
                      <p className="text-green-300">Pada garis</p>
                    </div>
                    <div className="bg-pink-900/30 border border-pink-500/30 rounded-lg p-2 text-center">
                      <p className="text-pink-300 font-bold">B(3, −1)</p>
                      <p className="text-white/60">f(B) = 3−(−1) = 4</p>
                      <p className="text-pink-300">Sisi positif</p>
                      <p className="text-white/40 text-xs">(di bawah garis y=x)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-xs font-body">
                  <p className="text-yellow-200 font-bold mb-1">⚠️ Catatan Penting:</p>
                  <p className="text-yellow-100/80">"Sisi positif" dan "sisi negatif" bergantung pada cara penulisan persamaan garis. Selalu pastikan garis ditulis dalam bentuk baku <InlineMath math="ax + by + c = 0" /> sebelum mensubstitusi.</p>
                </div>
              </div>
            )}
          </div>

          {/* ANIMASI INTERAKTIF 2 */}
          <div className="bg-card/80 backdrop-blur border border-violet-500/30 rounded-xl overflow-hidden">
            <div className="px-5 py-4 flex items-center gap-3 border-b border-violet-500/20">
              <MousePointerClick className="w-5 h-5 text-violet-400 shrink-0" />
              <div>
                <p className="font-body font-semibold text-white">🎮 Animasi Interaktif — Seret Garis & Titik P</p>
                <p className="text-white/50 text-xs font-body mt-0.5">Geser L₁, L₂ untuk mengubah garis, dan titik P — posisi P otomatis ditentukan!</p>
              </div>
            </div>
            <div className="px-5 py-5">
              <InteraktifGaris />
            </div>
          </div>

          {/* CONTOH 1B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1b" icon={<Target className="w-5 h-5" />} iconColor="text-green-400" title="✏️ Contoh 1 — Mudah (Posisi terhadap Garis)" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="MUDAH" color="bg-green-700/60 text-green-200" />
                <div className="bg-slate-800/60 border border-green-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">
                    Tentukan posisi masing-masing titik berikut terhadap garis <InlineMath math="2x + y - 4 = 0" />:<br />
                    a) <InlineMath math="A(3, 2)" />&nbsp;&nbsp;b) <InlineMath math="B(1, 2)" />&nbsp;&nbsp;c) <InlineMath math="C(-1, 0)" />
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-white/70 mb-2">Garis: <InlineMath math="f(x,y) = 2x + y - 4" />. Substitusi setiap titik:</p>
                    <div className="space-y-2 text-xs">
                      <div className="bg-pink-900/20 border border-pink-500/20 rounded p-2">
                        <p className="text-pink-300">a) f(A) = 2(3) + 2 − 4 = 6 + 2 − 4 = <strong>4 &gt; 0</strong></p>
                        <p className="text-white/60 mt-0.5">→ A berada di <strong className="text-pink-300">sisi positif</strong> garis</p>
                      </div>
                      <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                        <p className="text-green-300">b) f(B) = 2(1) + 2 − 4 = 2 + 2 − 4 = <strong>0</strong></p>
                        <p className="text-white/60 mt-0.5">→ B berada <strong className="text-green-300">tepat pada garis</strong></p>
                      </div>
                      <div className="bg-cyan-900/20 border border-cyan-500/20 rounded p-2">
                        <p className="text-cyan-300">c) f(C) = 2(−1) + 0 − 4 = −2 + 0 − 4 = <strong>−6 &lt; 0</strong></p>
                        <p className="text-white/60 mt-0.5">→ C berada di <strong className="text-cyan-300">sisi negatif</strong> garis</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                    <p className="text-cyan-300 text-sm font-bold">✅ A → sisi positif, B → tepat pada garis, C → sisi negatif</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 2B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2b" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title="✏️ Contoh 2 — Sedang (Posisi terhadap Garis)" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SEDANG" color="bg-yellow-700/60 text-yellow-200" />
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-yellow-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">
                    Garis <InlineMath math="\ell" /> memiliki persamaan <InlineMath math="x - 2y + 6 = 0" />. Titik <InlineMath math="P(k, 4)" /> berada di sisi negatif garis. Tentukan rentang nilai <InlineMath math="k" />!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-white/70">P di sisi negatif → substitusi P(k, 4) ke <InlineMath math="f(x,y) = x - 2y + 6" /> harus &lt; 0:</p>
                      <BlockMath math="f(P) = k - 2(4) + 6 < 0" />
                      <BlockMath math="k - 8 + 6 < 0" />
                      <BlockMath math="k - 2 < 0 \Rightarrow k < 2" />
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="text-cyan-300 text-sm font-bold">✅ Nilai k harus memenuhi <InlineMath math="k < 2" /></p>
                      <p className="text-white/60 text-xs mt-1">Misalnya k = 1, 0, −5 semuanya valid. Tapi k = 3 tidak.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTOH 3B */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh3b" icon={<Target className="w-5 h-5" />} iconColor="text-red-400" title="✏️ Contoh 3 — Sulit (Posisi terhadap Garis)" />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Badge label="SULIT" color="bg-red-700/60 text-red-200" />
                <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">📝 Soal</p>
                  <p className="font-body text-sm text-white/85">
                    Titik <InlineMath math="A(2, 1)" /> dan <InlineMath math="B(-4, 3)" /> berada di sisi yang sama atau berbeda terhadap garis <InlineMath math="3x + 2y - 6 = 0" />? Jelaskan!
                  </p>
                </div>
                <div className="bg-slate-700/40 border border-white/10 rounded-xl p-4 space-y-3 text-sm font-body">
                  <p className="font-semibold text-cyan-300">🔍 Pembahasan</p>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-cyan-300 font-semibold mb-2">Hitung f(A) dan f(B):</p>
                      <BlockMath math="f(A) = 3(2) + 2(1) - 6 = 6 + 2 - 6 = 2" />
                      <BlockMath math="f(B) = 3(-4) + 2(3) - 6 = -12 + 6 - 6 = -12" />
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-violet-300 font-semibold mb-1">Analisis:</p>
                      <p className="text-white/70 text-xs">f(A) = 2 &gt; 0 → A di sisi <strong className="text-pink-300">positif</strong></p>
                      <p className="text-white/70 text-xs">f(B) = −12 &lt; 0 → B di sisi <strong className="text-cyan-300">negatif</strong></p>
                      <p className="text-white/70 text-xs mt-2">Tanda berbeda → A dan B di sisi yang <strong className="text-yellow-300">berlawanan</strong>!</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-xs font-body">
                      <p className="text-white/60 mb-1">💡 <strong>Aturan umum:</strong></p>
                      <p className="text-white/60">• f(A) × f(B) &gt; 0 → A dan B di sisi yang <strong className="text-green-300">sama</strong></p>
                      <p className="text-white/60">• f(A) × f(B) &lt; 0 → A dan B di sisi yang <strong className="text-red-300">berbeda</strong></p>
                      <p className="text-white/60 mt-1">Cek: f(A) × f(B) = 2 × (−12) = −24 &lt; 0 ✓ (berbeda sisi)</p>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-3">
                      <p className="text-cyan-300 text-sm font-bold">✅ A dan B berada di sisi yang <strong>BERBEDA</strong> terhadap garis 3x + 2y − 6 = 0</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RANGKUMAN 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman2" icon={<BookOpen className="w-5 h-5" />} iconColor="text-violet-400" title="📌 Rangkuman — Posisi Titik terhadap Garis" />
            {true && (
              <div className="px-5 pb-5 space-y-3 text-sm font-body">
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-violet-300 font-semibold text-xs uppercase">Prosedur Menentukan Posisi Titik P(x₀,y₀) terhadap Garis ax+by+c=0</p>
                  <div className="space-y-2 text-xs">
                    {[
                      { step: "1", desc: "Tulis garis dalam bentuk baku ax + by + c = 0", color: "text-cyan-300" },
                      { step: "2", desc: "Substitusikan x₀ dan y₀ ke dalam ax + by + c", color: "text-violet-300" },
                      { step: "3", desc: "Hitung hasilnya: positif, nol, atau negatif?", color: "text-green-300" },
                      { step: "4", desc: "f(P) > 0 → sisi positif | f(P) = 0 → pada garis | f(P) < 0 → sisi negatif", color: "text-orange-300" },
                    ].map(({ step, desc, color }) => (
                      <div key={step} className="flex gap-2">
                        <span className={`font-display font-bold ${color} shrink-0`}>{step}.</span>
                        <p className="text-white/70">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-white/10 rounded-lg p-3 text-xs font-body">
                  <p className="text-white/70 font-semibold mb-1">🔄 Dua titik di sisi yang sama:</p>
                  <p className="text-white/60">Jika <strong className="text-green-300">f(A) × f(B) &gt; 0</strong>: sisi sama. Jika <strong className="text-red-300">f(A) × f(B) &lt; 0</strong>: sisi berbeda.</p>
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

export default PosisiRelatifTitikDanGarisPage;
