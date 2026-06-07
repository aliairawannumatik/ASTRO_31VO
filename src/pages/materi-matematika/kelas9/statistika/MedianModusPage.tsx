import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target, BarChart2 } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ─── Animasi Interaktif Penentuan Median ─── */
const MedianAnimator = () => {
  const [screen, setScreen] = useState<"input" | "sort" | "sorted" | "median">("input");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [original, setOriginal] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [sortRevealed, setSortRevealed] = useState(false);
  const [elimStep, setElimStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [medianDone, setMedianDone] = useState(false);

  const n = sorted.length;
  const maxElim = Math.floor(n / 2);
  const isOdd = n % 2 === 1;
  const medianIdx1 = isOdd ? Math.floor(n / 2) : n / 2 - 1;
  const medianIdx2 = isOdd ? Math.floor(n / 2) : n / 2;
  const medianValue = n > 0
    ? (isOdd ? sorted[medianIdx1] : (sorted[medianIdx1] + sorted[medianIdx2]) / 2)
    : 0;
  const fmt = (v: number) =>
    Number.isInteger(v) ? v.toString() : parseFloat(v.toFixed(2)).toString();

  /* auto-step animasi eliminasi */
  useEffect(() => {
    if (!isAnimating) return;
    if (elimStep >= maxElim) {
      const t = setTimeout(() => { setMedianDone(true); setIsAnimating(false); }, 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setElimStep(prev => prev + 1);
      playPopSound();
    }, 900);
    return () => clearTimeout(t);
  }, [isAnimating, elimStep, maxElim]);

  const goToInput = () => {
    playPopSound();
    setScreen("input");
    setIsSorting(false);
    setSortRevealed(false);
    setElimStep(0);
    setIsAnimating(false);
    setMedianDone(false);
  };

  const handleSubmit = () => {
    playPopSound();
    setError("");
    const parts = input.split(",").map(s => s.trim()).filter(s => s !== "");
    if (parts.length < 3) { setError("Masukkan minimal 3 angka!"); return; }
    if (parts.length > 13) { setError("Maksimal 13 angka agar animasi optimal."); return; }
    const vals = parts.map(p => parseFloat(p.replace(",", ".")));
    if (vals.some(isNaN)) { setError("Pastikan semua data adalah angka yang valid."); return; }
    setOriginal(vals);
    setSorted([...vals].sort((a, b) => a - b));
    setSortRevealed(false);
    setElimStep(0);
    setMedianDone(false);
    setIsAnimating(false);
    setScreen("sort");
  };

  const handleSort = () => {
    if (isSorting || sortRevealed) return;
    playPopSound();
    setIsSorting(true);
    setTimeout(() => { setIsSorting(false); setSortRevealed(true); playPopSound(); }, 1400);
  };

  const goToSorted = () => {
    playPopSound();
    setScreen("sorted");
  };

  const startMedianAnimation = () => {
    playPopSound();
    setElimStep(0);
    setMedianDone(false);
    setScreen("median");
    setTimeout(() => setIsAnimating(true), 500);
  };

  /* reusable chip row — data terurut (selalu tampil, tidak berubah) */
  const SortedReferenceRow = ({ label }: { label: string }) => (
    <div>
      <p className="font-body text-xs text-purple-300/70 mb-2 uppercase tracking-wide font-semibold">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {sorted.map((v, i) => {
          const isMedPos = isOdd ? i === medianIdx1 : i === medianIdx1 || i === medianIdx2;
          return (
            <div
              key={i}
              className={`rounded-lg px-2.5 py-1.5 text-center border ${
                isMedPos
                  ? "bg-purple-700/50 border-purple-400/60 ring-1 ring-purple-400/50"
                  : "bg-slate-700/40 border-slate-600/40"
              }`}
            >
              <p className={`font-bold text-xs font-body ${isMedPos ? "text-purple-200" : "text-white/60"}`}>{fmt(v)}</p>
              <p className="text-white/25 text-[10px] font-body">ke-{i + 1}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ── Layar 1: Input ── */
  if (screen === "input") return (
    <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2.5 py-1 rounded-full font-body">Layar 1 / 4</span>
        <p className="font-body text-sm font-bold text-purple-300">🔢 Input Data</p>
      </div>
      <p className="font-body text-xs text-white/55 leading-relaxed">
        Masukkan data angka dipisah <strong className="text-purple-300">koma</strong>. Boleh ganjil atau genap.
        <br /><span className="text-white/35">Contoh: </span><span className="text-purple-300 font-mono">9, 3, 7, 5, 11, 1, 13</span>
      </p>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSubmit()}
        placeholder="9, 3, 7, 5, 11, 1, 13"
        className="w-full bg-slate-900/80 border border-slate-600 text-white text-sm font-body rounded-lg px-3 py-2.5 outline-none focus:border-purple-500 placeholder:text-white/25"
      />
      {error && <p className="text-red-400 text-xs font-body">⚠️ {error}</p>}
      <button
        onClick={handleSubmit}
        className="w-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold font-body py-2.5 rounded-lg transition-colors cursor-pointer"
      >
        Lanjut → Lihat Data
      </button>
    </div>
  );

  /* ── Layar 2: Urutkan ── */
  if (screen === "sort") return (
    <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2.5 py-1 rounded-full font-body">Layar 2 / 4</span>
          <p className="font-body text-sm font-bold text-purple-300">🔀 Urutkan Data</p>
        </div>
        <button onClick={goToInput} className="text-xs text-white/40 hover:text-white/70 font-body cursor-pointer transition-colors">← Kembali</button>
      </div>

      <div>
        <p className="font-body text-xs text-white/40 mb-2 uppercase tracking-wide font-semibold">Data asli (belum terurut):</p>
        <div className="flex flex-wrap gap-2">
          {original.map((v, i) => (
            <div
              key={i}
              className="bg-slate-700/60 border border-slate-500/50 rounded-lg px-3 py-2 text-center transition-all duration-500"
              style={{ opacity: isSorting ? 0.25 : 1, transform: isSorting ? "scale(0.85)" : "scale(1)" }}
            >
              <p className="text-white/80 font-bold text-sm font-body">{fmt(v)}</p>
            </div>
          ))}
        </div>
      </div>

      {!sortRevealed ? (
        <button
          onClick={handleSort}
          disabled={isSorting}
          className={`w-full text-sm font-bold font-body py-2.5 rounded-lg transition-all cursor-pointer ${
            isSorting ? "bg-purple-800/50 text-purple-400" : "bg-purple-600 hover:bg-purple-500 text-white"
          }`}
        >
          {isSorting ? "⏳ Sedang mengurutkan..." : "🔀 Urutkan dari Kecil ke Besar"}
        </button>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="font-body text-xs text-purple-300 mb-2 uppercase tracking-wide font-bold">✅ Data terurut:</p>
            <div className="flex flex-wrap gap-2">
              {sorted.map((v, i) => (
                <div
                  key={i}
                  className="bg-purple-800/50 border border-purple-500/50 rounded-lg px-3 py-2 text-center transition-all duration-500"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <p className="text-purple-200 font-bold text-sm font-body">{fmt(v)}</p>
                  <p className="text-purple-400/60 text-xs font-body">ke-{i + 1}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={goToSorted}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold font-body py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Lanjut → Lihat Data Terurut
          </button>
        </div>
      )}
    </div>
  );

  /* ── Layar 3: Data Terurut (permanen) ── */
  if (screen === "sorted") return (
    <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2.5 py-1 rounded-full font-body">Layar 3 / 4</span>
          <p className="font-body text-sm font-bold text-purple-300">📋 Data Terurut</p>
        </div>
        <button
          onClick={() => { playPopSound(); setScreen("sort"); setSortRevealed(true); }}
          className="text-xs text-white/40 hover:text-white/70 font-body cursor-pointer transition-colors"
        >
          ← Kembali
        </button>
      </div>

      {/* Chips terurut — ukuran penuh, label lengkap */}
      <div>
        <p className="font-body text-xs text-purple-300 mb-3 uppercase tracking-wide font-bold">Data terurut dari kecil ke besar:</p>
        <div className="flex flex-wrap gap-2">
          {sorted.map((v, i) => (
            <div
              key={i}
              className="bg-purple-800/50 border border-purple-500/50 rounded-lg px-3 py-2 text-center"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <p className="text-purple-200 font-bold text-sm font-body">{fmt(v)}</p>
              <p className="text-purple-400/60 text-xs font-body">ke-{i + 1}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Info n dan posisi median */}
      <div className="bg-slate-800/60 rounded-xl p-4 space-y-2">
        <div className="grid grid-cols-3 gap-2 text-xs font-body text-center">
          <div className="bg-slate-900/60 rounded-lg p-2.5">
            <p className="text-white/40 mb-1">Banyak Data (n)</p>
            <p className="text-white font-bold text-lg">{n}</p>
          </div>
          <div className="bg-slate-900/60 rounded-lg p-2.5">
            <p className="text-white/40 mb-1">Jenis n</p>
            <p className={`font-bold text-lg ${isOdd ? "text-purple-300" : "text-cyan-300"}`}>
              {isOdd ? "Ganjil" : "Genap"}
            </p>
          </div>
          <div className="bg-purple-900/40 border border-purple-500/30 rounded-lg p-2.5">
            <p className="text-white/40 mb-1">Posisi Median</p>
            <p className="text-purple-300 font-bold text-xs leading-tight">
              {isOdd ? `ke-${medianIdx1 + 1}` : `ke-${medianIdx1+1} & ke-${medianIdx2+1}`}
            </p>
          </div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
          {isOdd ? (
            <p className="font-body text-xs text-white/60">
              n = {n} (ganjil) → posisi tengah = <strong className="text-purple-300">{`(${n}+1)/2 = ${medianIdx1+1}`}</strong> → nilai ke-{medianIdx1+1} = <strong className="text-purple-300">{fmt(sorted[medianIdx1])}</strong>
            </p>
          ) : (
            <p className="font-body text-xs text-white/60">
              n = {n} (genap) → dua nilai tengah = <strong className="text-purple-300">ke-{medianIdx1+1}</strong> dan <strong className="text-purple-300">ke-{medianIdx2+1}</strong> → rata-ratakan keduanya
            </p>
          )}
        </div>
      </div>

      <button
        onClick={startMedianAnimation}
        className="w-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold font-body py-2.5 rounded-lg transition-colors cursor-pointer"
      >
        🎯 Mulai Animasi Median →
      </button>
    </div>
  );

  /* ── Layar 4: Penentuan Median (Slow Motion) ── */
  return (
    <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2.5 py-1 rounded-full font-body">Layar 4 / 4</span>
          <p className="font-body text-sm font-bold text-purple-300">🎯 Penentuan Median</p>
        </div>
        <button
          onClick={() => { playPopSound(); setScreen("sorted"); setIsAnimating(false); }}
          className="text-xs text-white/40 hover:text-white/70 font-body cursor-pointer transition-colors"
        >
          ← Kembali
        </button>
      </div>

      {/* Baris referensi — data terurut SELALU tampil, tidak berubah */}
      <div className="bg-slate-800/50 border border-slate-600/30 rounded-xl p-3">
        <SortedReferenceRow label="📋 Data terurut (referensi):" />
      </div>

      <div className="border-t border-slate-700/50 pt-3 space-y-3">
        {!medianDone && (
          <p className="font-body text-xs text-white/40 text-center">
            {isAnimating
              ? `⬅️ Menyingkirkan data dari ujung kiri & kanan... (${elimStep}/${maxElim}) ➡️`
              : "Siap memulai animasi..."}
          </p>
        )}

        {/* Chip animasi eliminasi */}
        <div className="flex flex-wrap gap-2 justify-center">
          {sorted.map((v, i) => {
            const isElim = elimStep > 0 && (i < elimStep || i >= n - elimStep);
            const isMid = medianDone && !isElim;
            const isActiveLeft = !medianDone && isAnimating && i === elimStep - 1;
            const isActiveRight = !medianDone && isAnimating && i === n - elimStep;
            return (
              <div
                key={i}
                className={`rounded-lg px-3 py-2 text-center border transition-all duration-500 ${
                  isMid
                    ? "bg-purple-700/70 border-purple-400 ring-2 ring-purple-400 scale-110 shadow-lg shadow-purple-500/40"
                    : isElim
                    ? "bg-slate-800/30 border-slate-700/30 opacity-20 scale-90"
                    : isActiveLeft || isActiveRight
                    ? "bg-red-900/40 border-red-500/60 scale-105"
                    : "bg-slate-700/60 border-slate-500/50"
                }`}
              >
                <p className={`font-bold text-sm font-body ${
                  isMid ? "text-purple-200" : isElim ? "text-white/30 line-through" : "text-white/80"
                }`}>
                  {fmt(v)}
                </p>
                <p className={`text-xs font-body ${isMid ? "text-purple-400" : "text-white/30"}`}>
                  ke-{i + 1}
                </p>
              </div>
            );
          })}
        </div>

        {isAnimating && !medianDone && (
          <div className="flex justify-between text-xs font-body px-2">
            <span className="text-red-400 font-bold">← singkirkan</span>
            <span className="text-red-400 font-bold">singkirkan →</span>
          </div>
        )}

        {/* Hasil */}
        {medianDone && (
          <div className="space-y-3">
            <div className="bg-slate-900/70 rounded-lg p-3 text-center overflow-x-auto">
              {isOdd ? (
                <BlockMath math={`\\text{Me} = x_{\\left(\\frac{${n}+1}{2}\\right)} = x_{(${medianIdx1+1})} = ${fmt(sorted[medianIdx1])}`} />
              ) : (
                <BlockMath math={`\\text{Me} = \\frac{x_{(${medianIdx1+1})} + x_{(${medianIdx2+1})}}{2} = \\frac{${fmt(sorted[medianIdx1])} + ${fmt(sorted[medianIdx2])}}{2} = ${fmt(medianValue)}`} />
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-body text-center">
              <div className="bg-slate-800/60 rounded-lg p-2">
                <p className="text-white/40 mb-1">Banyak Data (n)</p>
                <p className="text-white font-bold text-base">{n}</p>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-2">
                <p className="text-white/40 mb-1">Jenis n</p>
                <p className={`font-bold text-base ${isOdd ? "text-purple-300" : "text-cyan-300"}`}>
                  {isOdd ? "Ganjil" : "Genap"}
                </p>
              </div>
              <div className="bg-purple-900/50 border border-purple-500/40 rounded-lg p-2">
                <p className="text-white/40 mb-1">Median (Me)</p>
                <p className="text-purple-300 font-bold text-base">{fmt(medianValue)}</p>
              </div>
            </div>
            <button
              onClick={goToInput}
              className="w-full bg-slate-700/60 hover:bg-slate-600/60 text-white text-sm font-bold font-body py-2 rounded-lg transition-colors cursor-pointer"
            >
              🔄 Coba Data Lain
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Animasi Interaktif Modus Data Tunggal ─── */
const ModusAnimator = () => {
  const [screen, setScreen] = useState<"input" | "count" | "result">("input");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<number[]>([]);
  const [countStep, setCountStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [countDone, setCountDone] = useState(false);

  const fmt = (v: number) =>
    Number.isInteger(v) ? v.toString() : parseFloat(v.toFixed(2)).toString();

  const n = data.length;
  const uniqueVals = [...new Set(data)].sort((a, b) => a - b);

  /* frekuensi berjalan sampai countStep */
  const runningFreq: Record<string, number> = {};
  for (let i = 0; i < countStep; i++) {
    const k = fmt(data[i]);
    runningFreq[k] = (runningFreq[k] || 0) + 1;
  }

  /* frekuensi lengkap */
  const fullFreq: Record<string, number> = {};
  for (const v of data) {
    const k = fmt(v);
    fullFreq[k] = (fullFreq[k] || 0) + 1;
  }

  const maxFreq = uniqueVals.length > 0 ? Math.max(...uniqueVals.map(v => fullFreq[fmt(v)] || 0)) : 0;
  const modeVals = uniqueVals.filter(v => fullFreq[fmt(v)] === maxFreq);
  const hasMode = modeVals.length < uniqueVals.length;
  const modeType = !hasMode ? "Tidak Ada Modus"
    : modeVals.length === 1 ? "Unimodal"
    : modeVals.length === 2 ? "Bimodal"
    : "Multimodal";

  /* auto-step animasi hitung */
  useEffect(() => {
    if (!isAnimating) return;
    if (countStep >= n) {
      const t = setTimeout(() => { setCountDone(true); setIsAnimating(false); }, 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setCountStep(prev => prev + 1);
      playPopSound();
    }, 650);
    return () => clearTimeout(t);
  }, [isAnimating, countStep, n]);

  const goToInput = () => {
    playPopSound();
    setScreen("input");
    setCountStep(0);
    setIsAnimating(false);
    setCountDone(false);
  };

  const handleSubmit = () => {
    playPopSound();
    setError("");
    const parts = input.split(",").map(s => s.trim()).filter(s => s !== "");
    if (parts.length < 3) { setError("Masukkan minimal 3 angka!"); return; }
    if (parts.length > 15) { setError("Maksimal 15 angka agar animasi optimal."); return; }
    const vals = parts.map(p => parseFloat(p.replace(",", ".")));
    if (vals.some(isNaN)) { setError("Pastikan semua data adalah angka yang valid."); return; }
    setData(vals);
    setCountStep(0);
    setCountDone(false);
    setIsAnimating(false);
    setScreen("count");
  };

  const startCounting = () => {
    if (isAnimating) return;
    playPopSound();
    setCountStep(0);
    setCountDone(false);
    setTimeout(() => setIsAnimating(true), 300);
  };

  /* ── Layar 1: Input ── */
  if (screen === "input") return (
    <div className="bg-orange-950/40 border border-orange-500/30 rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="bg-orange-500/20 text-orange-300 text-xs font-bold px-2.5 py-1 rounded-full font-body">Layar 1 / 3</span>
        <p className="font-body text-sm font-bold text-orange-300">🔢 Input Data</p>
      </div>
      <p className="font-body text-xs text-white/55 leading-relaxed">
        Masukkan data angka dipisah <strong className="text-orange-300">koma</strong>. Boleh ada nilai yang berulang.
        <br /><span className="text-white/35">Contoh: </span><span className="text-orange-300 font-mono">4, 7, 2, 7, 9, 7, 3, 5, 7</span>
      </p>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSubmit()}
        placeholder="4, 7, 2, 7, 9, 7, 3, 5, 7"
        className="w-full bg-slate-900/80 border border-slate-600 text-white text-sm font-body rounded-lg px-3 py-2.5 outline-none focus:border-orange-500 placeholder:text-white/25"
      />
      {error && <p className="text-red-400 text-xs font-body">⚠️ {error}</p>}
      <button
        onClick={handleSubmit}
        className="w-full bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold font-body py-2.5 rounded-lg transition-colors cursor-pointer"
      >
        Lanjut → Hitung Frekuensi
      </button>
    </div>
  );

  /* ── Layar 2: Hitung Frekuensi (Slow Motion) ── */
  if (screen === "count") return (
    <div className="bg-orange-950/40 border border-orange-500/30 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-orange-500/20 text-orange-300 text-xs font-bold px-2.5 py-1 rounded-full font-body">Layar 2 / 3</span>
          <p className="font-body text-sm font-bold text-orange-300">📊 Hitung Frekuensi</p>
        </div>
        <button onClick={goToInput} className="text-xs text-white/40 hover:text-white/70 font-body cursor-pointer transition-colors">← Kembali</button>
      </div>

      {/* Chips data — chip aktif menyala oranye */}
      <div>
        <p className="font-body text-xs text-white/40 mb-2 uppercase tracking-wide font-semibold">
          Data ({n} nilai):
        </p>
        <div className="flex flex-wrap gap-1.5">
          {data.map((v, i) => {
            const isPast = i < countStep;
            const isCurrent = i === countStep - 1;
            return (
              <div
                key={i}
                className={`rounded-lg px-2.5 py-1.5 text-center border transition-all duration-300 ${
                  isCurrent
                    ? "bg-orange-600/70 border-orange-400 ring-2 ring-orange-400 scale-110 shadow-md shadow-orange-500/30"
                    : isPast
                    ? "bg-orange-900/30 border-orange-700/40"
                    : "bg-slate-700/50 border-slate-600/40"
                }`}
              >
                <p className={`font-bold text-sm font-body ${
                  isCurrent ? "text-orange-200" : isPast ? "text-orange-300/60" : "text-white/50"
                }`}>
                  {fmt(v)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabel frekuensi terbentuk secara real-time */}
      <div>
        <p className="font-body text-xs text-white/40 mb-2 uppercase tracking-wide font-semibold">Tabel frekuensi:</p>
        <div className="space-y-1.5">
          {uniqueVals.map(v => {
            const k = fmt(v);
            const freq = runningFreq[k] || 0;
            return (
              <div
                key={k}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 border transition-all duration-300 ${
                  freq > 0 ? "bg-orange-900/20 border-orange-700/30" : "bg-slate-800/30 border-slate-700/20 opacity-40"
                }`}
              >
                <div className="w-8 text-center">
                  <span className={`font-bold text-sm font-body ${freq > 0 ? "text-orange-300" : "text-white/30"}`}>
                    {fmt(v)}
                  </span>
                </div>
                <div className="flex gap-1 flex-1 flex-wrap min-h-[1.25rem]">
                  {Array.from({ length: freq }).map((_, ti) => (
                    <span key={ti} className="text-orange-400 text-base leading-none">●</span>
                  ))}
                </div>
                <div className="w-6 text-center">
                  <span className={`font-bold text-sm font-body ${freq > 0 ? "text-white" : "text-white/20"}`}>
                    {freq > 0 ? freq : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!countDone ? (
        <button
          onClick={startCounting}
          disabled={isAnimating}
          className={`w-full text-sm font-bold font-body py-2.5 rounded-lg transition-all cursor-pointer ${
            isAnimating ? "bg-orange-800/50 text-orange-400" : "bg-orange-600 hover:bg-orange-500 text-white"
          }`}
        >
          {isAnimating ? `⏳ Menghitung... (${countStep}/${n})` : "▶ Mulai Hitung Frekuensi"}
        </button>
      ) : (
        <button
          onClick={() => { playPopSound(); setScreen("result"); }}
          className="w-full bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold font-body py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          🏆 Lihat Modus →
        </button>
      )}
    </div>
  );

  /* ── Layar 3: Hasil Modus ── */
  return (
    <div className="bg-orange-950/40 border border-orange-500/30 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-orange-500/20 text-orange-300 text-xs font-bold px-2.5 py-1 rounded-full font-body">Layar 3 / 3</span>
          <p className="font-body text-sm font-bold text-orange-300">🏆 Modus Ditemukan!</p>
        </div>
        <button
          onClick={() => { playPopSound(); setScreen("count"); }}
          className="text-xs text-white/40 hover:text-white/70 font-body cursor-pointer transition-colors"
        >
          ← Kembali
        </button>
      </div>

      {/* Bar chart frekuensi */}
      <div>
        <p className="font-body text-xs text-orange-300 mb-3 uppercase tracking-wide font-bold">📊 Grafik Frekuensi:</p>
        <div className="space-y-2">
          {uniqueVals.map(v => {
            const k = fmt(v);
            const freq = fullFreq[k];
            const isMode = hasMode && freq === maxFreq;
            const barPct = Math.round((freq / maxFreq) * 100);
            return (
              <div
                key={k}
                className={`rounded-lg p-2.5 border transition-all duration-500 ${
                  isMode
                    ? "bg-orange-900/40 border-orange-400/60 ring-1 ring-orange-400/40 shadow-md shadow-orange-500/20"
                    : "bg-slate-800/40 border-slate-700/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 text-center font-bold text-sm font-body ${isMode ? "text-orange-300" : "text-white/60"}`}>
                    {fmt(v)}
                  </div>
                  <div className="flex-1 bg-slate-900/60 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${isMode ? "bg-orange-500" : "bg-slate-600"}`}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                  <div className={`w-6 text-center font-bold text-sm font-body ${isMode ? "text-orange-300" : "text-white/50"}`}>
                    {freq}×
                  </div>
                  {isMode && <span className="text-orange-400 text-xs font-bold">← MODUS</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hasil & label tipe modus */}
      <div className={`rounded-xl p-4 space-y-3 border ${
        hasMode ? "bg-orange-900/30 border-orange-500/40" : "bg-slate-800/50 border-slate-600/40"
      }`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full font-body ${
            !hasMode ? "bg-slate-600/40 text-slate-300"
            : modeVals.length === 1 ? "bg-orange-500/20 text-orange-300"
            : modeVals.length === 2 ? "bg-yellow-500/20 text-yellow-300"
            : "bg-red-500/20 text-red-300"
          }`}>
            {modeType}
          </span>
        </div>

        {hasMode ? (
          <div className="space-y-2">
            <p className="font-body text-xs text-white/55">
              Nilai yang muncul <strong className="text-orange-300">{maxFreq}×</strong> (terbanyak):
            </p>
            <div className="flex flex-wrap gap-2">
              {modeVals.map(v => (
                <div
                  key={fmt(v)}
                  className="bg-orange-600/40 border-2 border-orange-400 ring-2 ring-orange-400/50 rounded-lg px-4 py-2 text-center shadow-lg shadow-orange-500/20"
                >
                  <p className="text-orange-200 font-bold text-xl font-body">{fmt(v)}</p>
                  <p className="text-orange-400 text-xs font-body">{maxFreq}× muncul</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-900/60 rounded-lg p-2.5 text-center">
              <p className="font-body text-xs text-white/60">
                <strong className="text-orange-300">Modus (Mo)</strong> ={" "}
                <strong className="text-white">{modeVals.map(v => fmt(v)).join(" dan ")}</strong>
              </p>
            </div>
          </div>
        ) : (
          <p className="font-body text-sm text-slate-400 text-center py-1">
            Semua nilai muncul <strong className="text-white">{maxFreq}×</strong> — tidak ada nilai yang dominan.
          </p>
        )}
      </div>

      <button
        onClick={goToInput}
        className="w-full bg-slate-700/60 hover:bg-slate-600/60 text-white text-sm font-bold font-body py-2 rounded-lg transition-colors cursor-pointer"
      >
        🔄 Coba Data Lain
      </button>
    </div>
  );
};

const MedianModusPage = () => {
  const navigate = useNavigate();
  const expandedSections = [
    "intro",
    "konsep1","contoh1",
    "konsep2","contoh2",
    "konsep3","contoh3",
    "konsep4","contoh4",
    "konsep5","contoh5",
    "rangkuman",
  ];

  const SectionHeader = ({
    id, icon, iconColor, title,
  }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <div className="w-full flex items-center px-5 py-4">
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          UKURAN PEMUSATAN DATA
        </h1>
        <p className="font-display text-sm font-semibold text-purple-400 text-center mb-1">Median & Modus</p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Statistika · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* PENGANTAR */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title="🌟 Median & Modus — Dua Saudara Rata-Rata" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Selain rata-rata, ada dua ukuran pemusatan data lain yang sering digunakan:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-purple-900/40 border border-purple-500/40 rounded-xl p-4">
                    <p className="font-display text-3xl font-bold text-purple-300 text-center mb-2">Me</p>
                    <p className="font-body text-sm font-bold text-white text-center mb-2">MEDIAN</p>
                    <p className="font-body text-xs text-white/60 text-center">Nilai tengah setelah data diurutkan. Tidak terpengaruh nilai ekstrem.</p>
                    <p className="font-body text-xs text-purple-400 text-center mt-2 italic">Cocok untuk data yang ada nilai sangat besar/kecil.</p>
                  </div>
                  <div className="bg-orange-900/40 border border-orange-500/40 rounded-xl p-4">
                    <p className="font-display text-3xl font-bold text-orange-300 text-center mb-2">Mo</p>
                    <p className="font-body text-sm font-bold text-white text-center mb-2">MODUS</p>
                    <p className="font-body text-xs text-white/60 text-center">Nilai yang paling sering muncul dalam data. Bisa lebih dari satu.</p>
                    <p className="font-body text-xs text-orange-400 text-center mt-2 italic">Cocok untuk data kategori atau nilai terpopuler.</p>
                  </div>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    <strong>Perbandingan singkat:</strong> Gaji 5 karyawan = 3, 3, 4, 5, 100 juta. Rata-rata = 23 juta (tidak representatif karena terpengaruh angka 100). Median = 4 juta (lebih representatif). Modus = 3 juta (paling sering muncul). 🚀
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SUB-BAB 1: MEDIAN DATA TUNGGAL (JUMLAH GANJIL) */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Target className="w-5 h-5" />} iconColor="text-purple-400" title="📘 Sub-Bab 1: Median Data Tunggal (Jumlah Data Ganjil)" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ketika banyak data (<InlineMath math="n" />) adalah <strong className="text-purple-300">bilangan ganjil</strong>, ada tepat satu nilai di posisi tengah setelah data diurutkan. Nilai inilah yang menjadi median.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 text-center space-y-2">
                    <p className="font-body text-xs text-white/50 mb-1">Rumus posisi median (n ganjil)</p>
                    <BlockMath math="\text{Me} = x_{\left(\frac{n+1}{2}\right)}" />
                    <p className="font-body text-xs text-white/50">
                      Median = nilai data pada urutan ke-<InlineMath math="\dfrac{n+1}{2}" />
                    </p>
                  </div>
                </div>

                {/* Visual median ganjil */}
                <div className="bg-slate-800/60 border border-purple-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">📌 Ilustrasi Median Data Ganjil (n = 7)</p>
                  <p className="font-body text-xs text-white/50 mb-3">Data terurut: 12, 15, 18, <span className="text-purple-300 font-bold">21</span>, 25, 30, 35</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
                    {[12,15,18,21,25,30,35].map((v,i) => (
                      <div key={i} className={`rounded-lg px-3 py-2 text-center border ${i === 3 ? "bg-purple-700/60 border-purple-400 ring-2 ring-purple-400" : "bg-slate-700/50 border-slate-600/40"}`}>
                        <p className={`font-bold text-sm ${i === 3 ? "text-purple-200" : "text-white/70"}`}>{v}</p>
                        <p className="text-white/30 text-xs">ke-{i+1}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 text-center">
                    <p className="font-body text-xs text-white/50 mb-1"><InlineMath math="n = 7" /> (ganjil) → posisi median = <InlineMath math="\frac{7+1}{2} = 4" /></p>
                    <p className="font-body text-sm text-purple-300 font-bold">Median = data urutan ke-4 = <strong>21</strong></p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Langkah mencari median:</strong> (1) Urutkan data dari kecil ke besar. (2) Hitung banyak data (<InlineMath math="n" />). (3) Jika <InlineMath math="n" /> ganjil, median = data urutan ke-<InlineMath math="\frac{n+1}{2}" />.
                  </p>
                </div>

                {/* Animasi Interaktif */}
                <div className="space-y-2">
                  <p className="font-body text-xs font-bold text-purple-300 uppercase tracking-wide">🎮 Coba Sendiri — Animasi Penentuan Median</p>
                  <p className="font-body text-xs text-white/45 leading-relaxed">
                    Masukkan data kamu sendiri dan lihat proses penentuan median secara visual, langkah demi langkah. Berlaku untuk n ganjil maupun genap!
                  </p>
                  <MedianAnimator />
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Calculator className="w-5 h-5" />} iconColor="text-purple-400" title="📝 Contoh Soal — Median Data Ganjil" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Tentukan median dari data berikut: 9, 3, 7, 5, 11, 1, 13
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Urutkan: 1, 3, 5, <strong className="text-purple-300">7</strong>, 9, 11, 13</p>
                      <p><strong>Langkah 2:</strong> <InlineMath math="n = 7" /> (ganjil) → posisi tengah = <InlineMath math="\frac{7+1}{2} = 4" /></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p className="text-purple-300 font-semibold">Median = data urutan ke-4 = <strong>7</strong></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CONTOH 2 — Tabel Distribusi Frekuensi Data Tunggal */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm text-white">Tabel distribusi frekuensi nilai ulangan Bahasa Indonesia disajikan berikut. Tentukan median nilainya!</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-body">
                        <thead><tr className="bg-slate-700/40"><th className="px-3 py-1.5 text-left text-white/70">Nilai (xᵢ)</th><th className="px-3 py-1.5 text-center text-white/70">Frekuensi (fᵢ)</th></tr></thead>
                        <tbody className="divide-y divide-slate-700/30">
                          {[["70","2"],["75","4"],["80","5"],["85","3"],["90","1"]].map(([x,f]) => (
                            <tr key={x}><td className="px-3 py-1.5 text-white font-semibold">{x}</td><td className="px-3 py-1.5 text-center text-yellow-300">{f}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Hitung total data <InlineMath math="n" /> dan buat frekuensi kumulatif:</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead><tr className="bg-slate-700/30"><th className="px-2 py-1 text-left text-white/50">Nilai (xᵢ)</th><th className="px-2 py-1 text-center text-white/50">fᵢ</th><th className="px-2 py-1 text-center text-white/50">Frekuensi Kumulatif</th></tr></thead>
                          <tbody className="divide-y divide-slate-700/20">
                            {[["70","2","2"],["75","4","6"],["80","5","11"],["85","3","14"],["90","1","15"]].map(([x,f,fk], i) => (
                              <tr key={x} className={i===2 ? "bg-purple-900/30" : ""}>
                                <td className={`px-2 py-1 font-semibold ${i===2 ? "text-purple-300" : "text-white/70"}`}>{x}</td>
                                <td className="px-2 py-1 text-center text-yellow-300">{f}</td>
                                <td className={`px-2 py-1 text-center font-bold ${i===2 ? "text-purple-300" : "text-white/60"}`}>{fk}</td>
                              </tr>
                            ))}
                            <tr className="border-t border-slate-500/40 font-bold"><td className="px-2 py-1 text-white">Total</td><td className="px-2 py-1 text-center text-yellow-400">15</td><td></td></tr>
                          </tbody>
                        </table>
                      </div>
                      <p><strong>Langkah 2:</strong> <InlineMath math="n = 15" /> (ganjil) → posisi median = <InlineMath math="\frac{15+1}{2} = 8" /></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p className="text-xs text-white/50">Data ke-1 s.d. ke-2 → Nilai <strong className="text-white">70</strong></p>
                        <p className="text-xs text-white/50">Data ke-3 s.d. ke-6 → Nilai <strong className="text-white">75</strong></p>
                        <p className="text-xs text-purple-300 font-semibold">Data ke-7 s.d. ke-11 → Nilai <strong>80</strong> ← posisi ke-8 ada di sini!</p>
                      </div>
                      <p><strong className="text-primary">Median = 80</strong></p>
                    </div>
                  </div>
                </div>

                {/* CONTOH 3 — Diagram Batang */}
                <div className="border-l-4 border-orange-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2 py-1 rounded">DIAGRAM</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <p className="font-body text-sm text-white">Diagram batang berikut menunjukkan nilai ulangan harian siswa kelas 9A. Tentukan median nilai ulangan tersebut!</p>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="font-body text-xs text-white/50 text-center mb-2">📊 Diagram Batang Nilai Ulangan Kelas 9A</p>
                      <svg viewBox="0 0 260 140" className="w-full max-h-40">
                        {/* Grid lines & y-axis labels */}
                        {[0,2,4,6].map(v => (
                          <g key={v}>
                            <line x1="35" y1={115 - v*15} x2="250" y2={115 - v*15} stroke="#334155" strokeWidth="0.5"/>
                            <text x="30" y={115 - v*15 + 3} textAnchor="end" fontSize="7" fill="#64748b">{v}</text>
                          </g>
                        ))}
                        {/* Bars */}
                        {[
                          {val:"6", f:2, cx:60,  color:"#ef4444"},
                          {val:"7", f:5, cx:100, color:"#f59e0b"},
                          {val:"8", f:6, cx:140, color:"#22c55e"},
                          {val:"9", f:4, cx:180, color:"#3b82f6"},
                          {val:"10",f:2, cx:220, color:"#a855f7"},
                        ].map(({val,f,cx,color}) => (
                          <g key={val}>
                            <rect x={cx-14} y={115-f*15} width="28" height={f*15} fill={color} fillOpacity="0.8" rx="2"/>
                            <text x={cx} y="128" textAnchor="middle" fontSize="8" fill="#94a3b8">{val}</text>
                          </g>
                        ))}
                        {/* Axes */}
                        <line x1="35" y1="20" x2="35" y2="115" stroke="#475569" strokeWidth="1"/>
                        <line x1="35" y1="115" x2="250" y2="115" stroke="#475569" strokeWidth="1"/>
                        <text x="143" y="138" textAnchor="middle" fontSize="7" fill="#64748b">Nilai</text>
                        <text x="12" y="72" textAnchor="middle" fontSize="7" fill="#64748b" transform="rotate(-90,12,72)">Frekuensi</text>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-orange-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Baca data dari diagram batang dan buat tabel frekuensi kumulatif:</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body">
                          <thead><tr className="bg-slate-700/30"><th className="px-2 py-1 text-left text-white/50">Nilai</th><th className="px-2 py-1 text-center text-white/50">Frekuensi</th><th className="px-2 py-1 text-center text-white/50">Frekuensi Kumulatif</th></tr></thead>
                          <tbody className="divide-y divide-slate-700/20">
                            {[["6","2","2"],["7","5","7"],["8","6","13"],["9","4","17"],["10","2","19"]].map(([x,f,fk], i) => (
                              <tr key={x} className={i===2 ? "bg-purple-900/30" : ""}>
                                <td className={`px-2 py-1 font-semibold ${i===2 ? "text-purple-300" : "text-white/70"}`}>{x}</td>
                                <td className="px-2 py-1 text-center text-orange-300">{f}</td>
                                <td className={`px-2 py-1 text-center font-bold ${i===2 ? "text-purple-300" : "text-white/60"}`}>{fk}</td>
                              </tr>
                            ))}
                            <tr className="border-t border-slate-500/40 font-bold"><td className="px-2 py-1 text-white">Total</td><td className="px-2 py-1 text-center text-orange-400">19</td><td></td></tr>
                          </tbody>
                        </table>
                      </div>
                      <p><strong>Langkah 2:</strong> <InlineMath math="n = 19" /> (ganjil) → posisi median = <InlineMath math="\frac{19+1}{2} = 10" /></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p className="text-xs text-white/50">Data ke-1 s.d. ke-2 → Nilai <strong className="text-white">6</strong></p>
                        <p className="text-xs text-white/50">Data ke-3 s.d. ke-7 → Nilai <strong className="text-white">7</strong></p>
                        <p className="text-xs text-purple-300 font-semibold">Data ke-8 s.d. ke-13 → Nilai <strong>8</strong> ← posisi ke-10 ada di sini!</p>
                      </div>
                      <p><strong className="text-primary">Median = 8</strong></p>
                    </div>
                  </div>
                </div>

                {/* CONTOH 4 — SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 4</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Data terdiri dari 11 bilangan yang sudah terurut. Diketahui median = 45, dan semua data di bawah median adalah 20, 25, 28, 32, <InlineMath math="a" />. Jika rata-rata data di bawah median = 27, tentukan nilai <InlineMath math="a" />!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><InlineMath math="n=11" /> ganjil, median = data ke-6 = 45. Data di bawah median: posisi 1–5 = 20, 25, 28, 32, <InlineMath math="a" /></p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <BlockMath math="\bar{x}_{\text{bawah}} = \frac{20+25+28+32+a}{5} = 27" />
                        <BlockMath math="105 + a = 135" />
                        <BlockMath math="a = 30" />
                      </div>
                      <p>Cek urutan: 20, 25, 28, 30, 32 ✓ (terurut naik, semua &lt; 45 ✓)</p>
                      <p><strong className="text-primary">a = 30</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* SUB-BAB 2: MEDIAN DATA TUNGGAL (JUMLAH GENAP) */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep2" icon={<Target className="w-5 h-5" />} iconColor="text-indigo-400" title="📘 Sub-Bab 2: Median Data Tunggal (Jumlah Data Genap)" />
            {expandedSections.includes("konsep2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-indigo-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Ketika banyak data (<InlineMath math="n" />) adalah <strong className="text-indigo-300">bilangan genap</strong>, tidak ada satu nilai tepat di tengah. Median diperoleh dengan merata-ratakan dua nilai yang berada di posisi tengah.
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 text-center space-y-2">
                    <p className="font-body text-xs text-white/50 mb-1">Rumus Median (n genap)</p>
                    <BlockMath math="\text{Me} = \frac{x_{\left(\frac{n}{2}\right)} + x_{\left(\frac{n}{2}+1\right)}}{2}" />
                    <p className="font-body text-xs text-white/50">
                      Median = rata-rata data urutan ke-<InlineMath math="\frac{n}{2}" /> dan ke-<InlineMath math="\frac{n}{2}+1" />
                    </p>
                  </div>
                </div>

                {/* Visual median genap */}
                <div className="bg-slate-800/60 border border-indigo-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">📌 Ilustrasi Median Data Genap (n = 8)</p>
                  <p className="font-body text-xs text-white/50 mb-3">Data terurut: 10, 14, 18, <span className="text-indigo-300 font-bold">20</span>, <span className="text-indigo-300 font-bold">24</span>, 28, 32, 36</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
                    {[10,14,18,20,24,28,32,36].map((v,i) => (
                      <div key={i} className={`rounded-lg px-3 py-2 text-center border ${(i===3||i===4) ? "bg-indigo-700/60 border-indigo-400 ring-2 ring-indigo-400" : "bg-slate-700/50 border-slate-600/40"}`}>
                        <p className={`font-bold text-sm ${(i===3||i===4) ? "text-indigo-200" : "text-white/70"}`}>{v}</p>
                        <p className="text-white/30 text-xs">ke-{i+1}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-900/50 rounded p-3 text-center">
                    <p className="font-body text-xs text-white/50 mb-1"><InlineMath math="n = 8" /> (genap) → dua nilai tengah = ke-4 dan ke-5</p>
                    <BlockMath math="\text{Me} = \frac{20 + 24}{2} = \frac{44}{2} = 22" />
                  </div>
                </div>

                {/* Tabel ringkas perbandingan */}
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl overflow-hidden">
                  <div className="bg-slate-700/40 px-4 py-2">
                    <p className="font-body text-xs font-bold text-slate-200 uppercase tracking-wide">🔍 Perbandingan: Ganjil vs Genap</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead><tr className="bg-slate-700/30">
                        <th className="px-3 py-2 text-left text-white/50">Kondisi</th>
                        <th className="px-3 py-2 text-center text-purple-300 font-bold">n Ganjil</th>
                        <th className="px-3 py-2 text-center text-indigo-300 font-bold">n Genap</th>
                      </tr></thead>
                      <tbody className="divide-y divide-slate-700/30">
                        <tr><td className="px-3 py-2 text-white/70">Posisi tengah</td><td className="px-3 py-2 text-center text-purple-300"><InlineMath math="\frac{n+1}{2}" /></td><td className="px-3 py-2 text-center text-indigo-300"><InlineMath math="\frac{n}{2}" /> dan <InlineMath math="\frac{n}{2}+1" /></td></tr>
                        <tr><td className="px-3 py-2 text-white/70">Nilai median</td><td className="px-3 py-2 text-center text-purple-300">1 nilai langsung</td><td className="px-3 py-2 text-center text-indigo-300">Rata-rata 2 nilai tengah</td></tr>
                        <tr><td className="px-3 py-2 text-white/70">Contoh (n=9)</td><td className="px-3 py-2 text-center text-purple-300">data ke-5</td><td className="px-3 py-2 text-center text-indigo-300">—</td></tr>
                        <tr><td className="px-3 py-2 text-white/70">Contoh (n=10)</td><td className="px-3 py-2 text-center text-purple-300">—</td><td className="px-3 py-2 text-center text-indigo-300">rata2 data ke-5 & ke-6</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips cepat:</strong> Selalu urutkan data terlebih dahulu! Ini adalah langkah paling sering terlupakan yang menyebabkan kesalahan dalam mencari median.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 2 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh2" icon={<Calculator className="w-5 h-5" />} iconColor="text-indigo-400" title="📝 Contoh Soal — Median Data Tunggal (Genap)" />
            {expandedSections.includes("contoh2") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Tentukan median dari data: 14, 8, 22, 5, 18, 11, 27, 3
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Urutkan: 3, 5, 8, <strong className="text-indigo-300">11</strong>, <strong className="text-indigo-300">14</strong>, 18, 22, 27</p>
                      <p><strong>Langkah 2:</strong> <InlineMath math="n = 8" /> (genap) → dua nilai tengah = ke-4 dan ke-5</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Me} = \frac{11 + 14}{2} = \frac{25}{2} = 12{,}5" />
                      </div>
                      <p><strong className="text-primary">Median = 12,5</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-3">
                      Data nilai matematika 12 siswa disajikan dalam tabel distribusi frekuensi tunggal berikut. Tentukan median data tersebut!
                    </p>
                    <div className="overflow-x-auto">
                      <table className="text-xs font-body border-collapse">
                        <thead>
                          <tr className="bg-indigo-800/40">
                            <td className="border border-indigo-500/40 px-3 py-2 text-indigo-300 font-bold text-center">Nilai</td>
                            {[60,65,70,75,80,85].map(v => (
                              <td key={v} className="border border-indigo-500/40 px-4 py-2 text-white font-bold text-center">{v}</td>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-slate-700/30">
                            <td className="border border-indigo-500/40 px-3 py-2 text-indigo-300 font-bold text-center">Frekuensi</td>
                            {[1,2,3,3,2,1].map((f,i) => (
                              <td key={i} className="border border-indigo-500/40 px-4 py-2 text-green-300 font-bold text-center">{f}</td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Hitung total data: <InlineMath math="n = 1+2+3+3+2+1 = 12" /> (genap)</p>
                      <p><strong>Langkah 2:</strong> Susun data terurut dari tabel:<br />
                        60, 65, 65, 70, 70, <strong className="text-indigo-300">70</strong>, <strong className="text-indigo-300">75</strong>, 75, 75, 80, 80, 85
                      </p>
                      <p><strong>Langkah 3:</strong> <InlineMath math="n=12" /> (genap) → dua nilai tengah = data ke-6 dan ke-7</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Me} = \frac{x_{(6)} + x_{(7)}}{2} = \frac{70 + 75}{2} = \frac{145}{2} = 72{,}5" />
                      </div>
                      <p><strong className="text-primary">Median = 72,5</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Terdapat 12 data terurut. Nilai terkecil 40, terbesar 95. Median = 68. Jika semua nilai di atas median dinaikkan 5, tentukan median yang baru!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><InlineMath math="n=12" /> (genap) → median = rata-rata data ke-6 dan ke-7.</p>
                      <p>Median awal = 68 berarti: <InlineMath math="\frac{x_6 + x_7}{2} = 68 \implies x_6 + x_7 = 136" /></p>
                      <p>Nilai di atas median = data ke-7 s.d. ke-12. Data ke-7 termasuk "di atas median" (nilai ke-7 ≥ nilai ke-6).</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-2">
                        <p>Setelah data ke-7 s.d. ke-12 dinaikkan 5:</p>
                        <p>• <InlineMath math="x_6" /> tetap (tidak berubah)</p>
                        <p>• <InlineMath math="x_7" /> menjadi <InlineMath math="x_7 + 5" /></p>
                        <BlockMath math="\text{Me}_{\text{baru}} = \frac{x_6 + (x_7+5)}{2} = \frac{x_6+x_7}{2} + \frac{5}{2} = 68 + 2{,}5 = 70{,}5" />
                      </div>
                      <p><strong className="text-primary">Median baru = 70,5</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-1 rounded">DIAGRAM BATANG</span>
                    <span className="font-body font-semibold text-white">Contoh 4</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-3">
                      Diagram batang berikut menunjukkan banyak buku yang dibaca siswa kelas 9A selama satu bulan. Tentukan median data tersebut!
                    </p>
                    {/* Diagram Batang */}
                    <div className="bg-slate-900/60 rounded-xl p-4">
                      <p className="font-body text-xs text-white/50 mb-3 text-center">Banyak Buku yang Dibaca Siswa Kelas 9A</p>
                      <div className="flex items-end justify-center gap-4 h-32">
                        {[{val:1,f:3},{val:2,f:5},{val:3,f:4},{val:4,f:6},{val:5,f:2}].map(({val,f}) => (
                          <div key={val} className="flex flex-col items-center gap-1">
                            <span className="font-body text-xs text-indigo-300 font-bold">{f}</span>
                            <div
                              className="w-10 bg-indigo-500/70 border border-indigo-400/60 rounded-t-md"
                              style={{ height: `${f * 16}px` }}
                            />
                            <span className="font-body text-xs text-white/60">{val}</span>
                          </div>
                        ))}
                      </div>
                      <p className="font-body text-xs text-white/40 text-center mt-2">Banyak Buku (judul)</p>
                    </div>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-blue-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Baca data dari diagram batang:</p>
                      <div className="overflow-x-auto">
                        <table className="text-xs font-body border-collapse w-full max-w-sm">
                          <thead>
                            <tr className="bg-indigo-800/40">
                              <td className="border border-indigo-500/40 px-3 py-2 text-indigo-300 font-bold text-center">Banyak Buku</td>
                              {[1,2,3,4,5].map(v => <td key={v} className="border border-indigo-500/40 px-3 py-2 text-white font-bold text-center">{v}</td>)}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-slate-700/30">
                              <td className="border border-indigo-500/40 px-3 py-2 text-indigo-300 font-bold text-center">Frekuensi</td>
                              {[3,5,4,6,2].map((f,i) => <td key={i} className="border border-indigo-500/40 px-3 py-2 text-green-300 font-bold text-center">{f}</td>)}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p><strong>Langkah 2:</strong> Total data: <InlineMath math="n = 3+5+4+6+2 = 20" /> (genap)</p>
                      <p><strong>Langkah 3:</strong> Cari posisi dua nilai tengah = ke-10 dan ke-11.</p>
                      <div className="bg-slate-900/50 rounded p-3 text-xs space-y-1">
                        <p>• Buku 1: posisi 1 – 3 (fk = 3)</p>
                        <p>• Buku 2: posisi 4 – 8 (fk = 8)</p>
                        <p>• Buku 3: posisi 9 – 12 (fk = 12) <span className="text-indigo-300">← ke-10 dan ke-11 ada di sini ✓</span></p>
                      </div>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\text{Me} = \frac{x_{(10)} + x_{(11)}}{2} = \frac{3 + 3}{2} = 3" />
                      </div>
                      <p><strong className="text-primary">Median = 3 buku</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* SUB-BAB 4: MODUS DATA TUNGGAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep4" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400" title="📘 Sub-Bab 4: Modus Data Tunggal" />
            {expandedSections.includes("konsep4") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-orange-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    <strong className="text-orange-300">Modus</strong> adalah nilai yang paling sering muncul dalam sekumpulan data. Berbeda dengan rata-rata dan median, modus <em>tidak perlu mengurutkan data</em> — cukup cari nilai yang frekuensinya terbesar.
                  </p>
                </div>

                {/* Jenis-jenis modus */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/30 rounded-xl p-3">
                    <p className="font-body text-xs font-bold text-orange-300 mb-1">Unimodal</p>
                    <p className="font-body text-xs text-white/60 mb-2">Hanya satu nilai terbanyak</p>
                    <p className="font-body text-xs text-white/80">Data: 2, 3, <strong className="text-orange-300">5</strong>, <strong className="text-orange-300">5</strong>, 7, 8</p>
                    <p className="font-body text-xs text-orange-400 mt-1">Modus = <strong>5</strong></p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/30 rounded-xl p-3">
                    <p className="font-body text-xs font-bold text-yellow-300 mb-1">Bimodal</p>
                    <p className="font-body text-xs text-white/60 mb-2">Dua nilai terbanyak (sama frekuensi)</p>
                    <p className="font-body text-xs text-white/80">Data: 2, <strong className="text-yellow-300">3</strong>, <strong className="text-yellow-300">3</strong>, <strong className="text-yellow-300">5</strong>, <strong className="text-yellow-300">5</strong>, 8</p>
                    <p className="font-body text-xs text-yellow-400 mt-1">Modus = <strong>3 dan 5</strong></p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 border border-slate-600/30 rounded-xl p-3">
                    <p className="font-body text-xs font-bold text-slate-300 mb-1">Tidak Memiliki Modus</p>
                    <p className="font-body text-xs text-white/60 mb-2">Semua nilai frekuensinya sama</p>
                    <p className="font-body text-xs text-white/80">Data: 2, 3, 5, 7, 8, 9</p>
                    <p className="font-body text-xs text-slate-400 mt-1">Modus = <strong>tidak ada</strong></p>
                  </div>
                </div>

                {/* Visual modus */}
                <div className="bg-slate-800/60 border border-orange-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">📌 Contoh Mencari Modus</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/60 rounded-lg p-3">
                      <p className="font-body text-xs text-white/50 mb-2">Data: 4, 7, 2, 7, 9, 7, 3, 5, 7, 2, 4</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {[4,7,2,7,9,7,3,5,7,2,4].map((v,i) => (
                          <div key={i} className={`rounded-md px-2 py-1 text-xs font-bold ${v===7 ? "bg-orange-600/50 text-orange-200 ring-1 ring-orange-500" : "bg-slate-700/50 text-white/60"}`}>{v}</div>
                        ))}
                      </div>
                      <p className="font-body text-xs text-orange-300 font-semibold">Angka 7 muncul 4 kali → Modus = <strong>7</strong></p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Cara paling mudah mencari modus data tunggal adalah membuat tabel frekuensi sederhana, lalu lihat nilai mana yang frekuensinya paling tinggi.
                  </p>
                </div>

                {/* Animasi Interaktif Modus */}
                <div className="space-y-2">
                  <p className="font-body text-xs font-bold text-orange-300 uppercase tracking-wide">🎮 Coba Sendiri — Animasi Penentuan Modus</p>
                  <p className="font-body text-xs text-white/45 leading-relaxed">
                    Masukkan data kamu dan lihat proses penghitungan frekuensi secara visual — modus akan ditemukan otomatis!
                  </p>
                  <ModusAnimator />
                </div>
              </div>
            )}
          </div>

          {/* Contoh Soal Sub-Bab 4 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh4" icon={<Calculator className="w-5 h-5" />} iconColor="text-orange-400" title="📝 Contoh Soal — Modus Data Tunggal" />
            {expandedSections.includes("contoh4") && (
              <div className="px-5 pb-5 space-y-6">

                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Tentukan modus dari data nilai ulangan berikut: 7, 8, 6, 9, 8, 7, 8, 6, 10, 8
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Hitung frekuensi tiap nilai:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <div className="flex flex-wrap gap-3 text-xs">
                          {[["6","2×"],["7","2×"],["8","4×"],["9","1×"],["10","1×"]].map(([v,f]) => (
                            <div key={v} className={`rounded-lg px-3 py-2 text-center border ${v==="8" ? "bg-orange-700/40 border-orange-400 ring-1 ring-orange-400" : "bg-slate-700/40 border-slate-600/40"}`}>
                              <p className={`font-bold text-sm ${v==="8" ? "text-orange-200" : "text-white/70"}`}>{v}</p>
                              <p className={v==="8" ? "text-orange-400" : "text-white/40"}>{f}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p>Nilai 8 muncul paling banyak (4 kali). <strong className="text-primary">Modus = 8</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-3">
                      Data ukuran sepatu 20 siswa kelas 9B disajikan dalam tabel distribusi frekuensi tunggal berikut. Tentukan modus data tersebut!
                    </p>
                    <div className="overflow-x-auto">
                      <table className="text-xs font-body border-collapse">
                        <thead>
                          <tr className="bg-orange-800/40">
                            <td className="border border-orange-500/40 px-3 py-2 text-orange-300 font-bold text-center">Ukuran Sepatu</td>
                            {[37,38,39,40,41].map(v => (
                              <td key={v} className="border border-orange-500/40 px-4 py-2 text-white font-bold text-center">{v}</td>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-slate-700/30">
                            <td className="border border-orange-500/40 px-3 py-2 text-orange-300 font-bold text-center">Frekuensi</td>
                            {[2,5,7,4,2].map((f,i) => (
                              <td key={i} className="border border-orange-500/40 px-4 py-2 text-green-300 font-bold text-center">{f}</td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Baca frekuensi dari tabel:</p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        {[[37,2],[38,5],[39,7],[40,4],[41,2]].map(([v,f]) => (
                          <div key={v} className={`rounded-lg px-3 py-2 text-center border ${f===7 ? "bg-orange-700/40 border-orange-400 ring-1 ring-orange-400" : "bg-slate-700/40 border-slate-600/40"}`}>
                            <p className={`font-bold text-sm ${f===7 ? "text-orange-200" : "text-white/70"}`}>No. {v}</p>
                            <p className={f===7 ? "text-orange-400" : "text-white/40"}>{f}×</p>
                          </div>
                        ))}
                      </div>
                      <p>Ukuran 39 memiliki frekuensi tertinggi (7 siswa).</p>
                      <p><strong className="text-primary">Modus = 39</strong></p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Data: 5, 8, <InlineMath math="p" />, 8, 12, 5, 15, <InlineMath math="p" />, 8, 5. Jika modus data tersebut adalah 5, tentukan nilai <InlineMath math="p" /> yang mungkin, disertai penjelasan!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Frekuensi nilai yang sudah diketahui: 5 muncul 3×, 8 muncul 3×, 12 muncul 1×, 15 muncul 1×. Nilai <InlineMath math="p" /> muncul 2×.</p>
                      <p>Agar modus = 5, maka frekuensi 5 (=3) harus <strong>lebih besar</strong> dari semua frekuensi lain.</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>• Nilai 8 sudah 3× → sama dengan 5. Agar 5 satu-satunya modus, nilai 8 tidak boleh bertambah. Jadi <InlineMath math="p \neq 8" />.</p>
                        <p>• Nilai <InlineMath math="p" /> muncul 2×, sudah lebih kecil dari 3 → oke selama <InlineMath math="p \neq 5" /> dan <InlineMath math="p \neq 8" />.</p>
                      </div>
                      <p><strong className="text-primary">p bisa berupa nilai apapun kecuali 5 dan 8, misalnya p = 3, 7, 10, 11, dll.</strong></p>
                      <p className="text-xs text-white/50">(Jika p=5, maka 5 muncul 5× → modus tetap 5 ✓. Jika p=8, maka 8 muncul 5× → modus menjadi 8, bukan 5 ✗)</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-1 rounded">DIAGRAM BATANG</span>
                    <span className="font-body font-semibold text-white">Contoh 4</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-3">
                      Diagram batang berikut menunjukkan nilai ulangan IPA siswa kelas 9C. Tentukan modus data tersebut!
                    </p>
                    <div className="bg-slate-900/60 rounded-xl p-4">
                      <p className="font-body text-xs text-white/50 mb-3 text-center">Nilai Ulangan IPA Kelas 9C</p>
                      <div className="flex items-end justify-center gap-4 h-36">
                        {[{val:6,f:3},{val:7,f:8},{val:8,f:8},{val:9,f:5},{val:10,f:1}].map(({val,f}) => (
                          <div key={val} className="flex flex-col items-center gap-1">
                            <span className="font-body text-xs text-orange-300 font-bold">{f}</span>
                            <div
                              className={`w-10 rounded-t-md border ${(f===8) ? "bg-orange-500/70 border-orange-400/80" : "bg-slate-600/60 border-slate-500/50"}`}
                              style={{ height: `${f * 16}px` }}
                            />
                            <span className="font-body text-xs text-white/60">{val}</span>
                          </div>
                        ))}
                      </div>
                      <p className="font-body text-xs text-white/40 text-center mt-2">Nilai</p>
                    </div>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-blue-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p><strong>Langkah 1:</strong> Baca data dari diagram batang:</p>
                      <div className="overflow-x-auto">
                        <table className="text-xs font-body border-collapse w-full max-w-sm">
                          <thead>
                            <tr className="bg-orange-800/40">
                              <td className="border border-orange-500/40 px-3 py-2 text-orange-300 font-bold text-center">Nilai</td>
                              {[6,7,8,9,10].map(v => <td key={v} className="border border-orange-500/40 px-3 py-2 text-white font-bold text-center">{v}</td>)}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-slate-700/30">
                              <td className="border border-orange-500/40 px-3 py-2 text-orange-300 font-bold text-center">Frekuensi</td>
                              {[3,8,8,5,1].map((f,i) => <td key={i} className="border border-orange-500/40 px-3 py-2 text-green-300 font-bold text-center">{f}</td>)}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p><strong>Langkah 2:</strong> Cari frekuensi terbesar.</p>
                      <div className="bg-slate-900/50 rounded p-3 text-xs space-y-1">
                        <p>• Nilai 6 → 3 siswa</p>
                        <p>• Nilai 7 → <strong className="text-orange-300">8 siswa</strong> ← tertinggi bersama nilai 8</p>
                        <p>• Nilai 8 → <strong className="text-orange-300">8 siswa</strong> ← tertinggi bersama nilai 7</p>
                        <p>• Nilai 9 → 5 siswa</p>
                        <p>• Nilai 10 → 1 siswa</p>
                      </div>
                      <p>Nilai 7 dan 8 sama-sama memiliki frekuensi tertinggi (8 siswa).</p>
                      <p><strong className="text-primary">Modus = 7 dan 8 (data bimodal)</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* RANGKUMAN */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BarChart2 className="w-5 h-5" />} iconColor="text-yellow-400" title="🏁 Rangkuman Median & Modus" />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-slate-800/60 border border-purple-500/20 rounded-xl p-4 space-y-4">
                  <p className="font-body text-sm font-bold text-purple-300 text-center mb-2">⭐ Rumus-Rumus Kunci Median & Modus</p>

                  <div className="space-y-3">
                    <div className="border border-purple-500/30 bg-purple-900/20 rounded-xl p-3">
                      <p className="font-body text-xs font-bold text-purple-300 mb-2">MEDIAN</p>
                      <div className="space-y-2">
                        <div className="bg-slate-900/50 rounded p-2">
                          <p className="font-body text-xs text-white/50 mb-1">Data tunggal — n ganjil:</p>
                          <BlockMath math="\text{Me} = x_{\left(\frac{n+1}{2}\right)}" />
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <p className="font-body text-xs text-white/50 mb-1">Data tunggal — n genap:</p>
                          <BlockMath math="\text{Me} = \frac{x_{\left(\frac{n}{2}\right)} + x_{\left(\frac{n}{2}+1\right)}}{2}" />
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <p className="font-body text-xs text-white/50 mb-1">Data berkelompok:</p>
                          <BlockMath math="\text{Me} = T_b + p \cdot \frac{\frac{n}{2} - F}{f}" />
                        </div>
                      </div>
                    </div>

                    <div className="border border-orange-500/30 bg-orange-900/20 rounded-xl p-3">
                      <p className="font-body text-xs font-bold text-orange-300 mb-2">MODUS</p>
                      <div className="space-y-2">
                        <div className="bg-slate-900/50 rounded p-2">
                          <p className="font-body text-xs text-white/50 mb-1">Data tunggal:</p>
                          <p className="font-body text-xs text-orange-300">Nilai dengan frekuensi terbesar</p>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <p className="font-body text-xs text-white/50 mb-1">Data berkelompok:</p>
                          <BlockMath math="\text{Mo} = T_b + p \cdot \frac{d_1}{d_1+d_2}" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabel perbandingan */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body">
                      <thead><tr className="bg-slate-700/40">
                        <th className="px-2 py-2 text-left text-white/50">Ukuran</th>
                        <th className="px-2 py-2 text-center text-cyan-300">Rata-rata</th>
                        <th className="px-2 py-2 text-center text-purple-300">Median</th>
                        <th className="px-2 py-2 text-center text-orange-300">Modus</th>
                      </tr></thead>
                      <tbody className="divide-y divide-slate-700/30">
                        <tr>
                          <td className="px-2 py-2 text-white/70">Dipengaruhi nilai ekstrem?</td>
                          <td className="px-2 py-2 text-center text-red-400">Ya</td>
                          <td className="px-2 py-2 text-center text-green-400">Tidak</td>
                          <td className="px-2 py-2 text-center text-green-400">Tidak</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-white/70">Perlu diurutkan?</td>
                          <td className="px-2 py-2 text-center text-green-400">Tidak</td>
                          <td className="px-2 py-2 text-center text-red-400">Ya</td>
                          <td className="px-2 py-2 text-center text-green-400">Tidak</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-2 text-white/70">Selalu ada 1 nilai?</td>
                          <td className="px-2 py-2 text-center text-green-400">Ya</td>
                          <td className="px-2 py-2 text-center text-green-400">Ya</td>
                          <td className="px-2 py-2 text-center text-red-400">Bisa lebih dari 1</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    <strong>Selamat! 🎉</strong> Kamu sudah menguasai Median dan Modus. Lanjutkan ke materi berikutnya: Ukuran Letak Data (Kuartil) untuk belajar cara membagi data menjadi bagian-bagian yang lebih detail! 🚀
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/statistika"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Statistika
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedianModusPage;
