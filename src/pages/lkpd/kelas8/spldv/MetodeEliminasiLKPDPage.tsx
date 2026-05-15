import { useState, createContext, useContext, useCallback, useRef } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";

/* ─── helpers ─────────────────────────────────────────────── */
function normalize(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}
function checkAnswer(val: string, accepted: string[]): boolean {
  const n = normalize(val);
  return accepted.some((a) => normalize(a) === n);
}

/* ─── correct answers ─────────────────────────────────────── */
const ANSWERS: Record<string, string[]> = {
  /* Section A */
  a1: ["dua variabel", "2 variabel", "dua", "2"],
  a2: ["1", "satu", "pangkat 1", "satu (1)"],
  a3: ["real", "bilangan real", "nyata"],
  a4: ["banyak", "tak hingga", "tak terhingga", "lebih dari satu", "infinit"],

  /* Kasus 1 – Eliminasi */
  k1_dik: ["2x + y = 8 dan x – y = 10", "2x + y = 8 dan x - y = 10", "2x+y=8 dan x-y=10", "2x+y=8 dan x–y=10"],
  k1_tan: ["nilai x dan y", "x dan y", "penyelesaian", "himpunan penyelesaian"],
  k1_r1a: ["2x"],
  k1_r1b: ["y"],
  k1_r1c: ["8"],
  k1_r2a: ["2x"],
  k1_r2b: ["2y"],
  k1_r2c: ["20"],
  k1_resl: ["3y"],
  k1_resr: ["-12", "−12"],
  k1_ynilai: ["-4", "−4", "y = -4", "y = −4"],
  k1_xfinal: ["6"],
  k1_yfinal: ["-4", "−4"],
  k1_cek1a: ["6"],
  k1_cek1b: ["-4", "−4"],
  k1_cek1c: ["8"],
  k1_cek2a: ["6"],
  k1_cek2b: ["-4", "−4"],
  k1_cek2c: ["10"],

  /* Kasus 2 – Substitusi */
  k2_dik: ["2x - y = 4 dan x + y = 5", "2x – y = 4 dan x + y = 5", "2x-y=4 dan x+y=5"],
  k2_tan: ["nilai x dan y", "x dan y", "penyelesaian"],
  k2_xsubst: ["y"],
  k2_xsubst2: ["y"],
  k2_r1l: ["10"],
  k2_r1r: ["2y"],
  k2_r2l: ["10"],
  k2_r2r: ["3y"],
  k2_y: ["2"],
  k2_ysub: ["2"],
  k2_xhasil: ["3"],
  k2_xfinal: ["3"],
  k2_yfinal: ["2"],
  k2_cek1a: ["3"],
  k2_cek1b: ["2"],
  k2_cek1c: ["5"],
  k2_cek2a: ["3"],
  k2_cek2b: ["2"],
  k2_cek2c: ["4"],

  /* Kasus 3 – Campuran */
  k3_dik: ["2x + y = 5 dan 3x - 2y = 11", "2x+y=5 dan 3x-2y=11", "2x + y = 5 dan 3x – 2y = 11"],
  k3_tan: ["nilai x dan y", "x dan y", "penyelesaian"],
  k3_r1a: ["3x"],
  k3_r1b: ["2y"],
  k3_r1c: ["11"],
  k3_r2a: ["4x"],
  k3_r2b: ["2y"],
  k3_r2c: ["10"],
  k3_resl: ["7x"],
  k3_resr: ["21"],
  k3_x: ["3"],
  k3_substx: ["3"],
  k3_kiri: ["6"],
  k3_y: ["-1", "−1"],
  k3_xfinal: ["3"],
  k3_yfinal: ["-1", "−1"],
  k3_cek1a: ["3"],
  k3_cek1b: ["-1", "−1"],
  k3_cek1c: ["5"],
  k3_cek2a: ["3"],
  k3_cek2b: ["-1", "−1"],
  k3_cek2c: ["11"],
};

const SECTIONS: Record<string, string[]> = {
  a: ["a1","a2","a3","a4"],
  k1step1: ["k1_r1a","k1_r1b","k1_r1c","k1_r2a","k1_r2b","k1_r2c","k1_resl","k1_resr","k1_ynilai","k1_xfinal","k1_yfinal"],
  k1step2: ["k1_cek1a","k1_cek1b","k1_cek1c","k1_cek2a","k1_cek2b","k1_cek2c"],
  k2step1: ["k2_xsubst","k2_xsubst2","k2_r1l","k2_r1r","k2_r2l","k2_r2r","k2_y","k2_ysub","k2_xhasil","k2_xfinal","k2_yfinal"],
  k2step2: ["k2_cek1a","k2_cek1b","k2_cek1c","k2_cek2a","k2_cek2b","k2_cek2c"],
  k3step1: ["k3_r1a","k3_r1b","k3_r1c","k3_r2a","k3_r2b","k3_r2c","k3_resl","k3_resr","k3_x","k3_substx","k3_kiri","k3_y","k3_xfinal","k3_yfinal"],
  k3step2: ["k3_cek1a","k3_cek1b","k3_cek1c","k3_cek2a","k3_cek2b","k3_cek2c"],
};

/* ─── Page Context (prevents input remount on re-render) ──── */
type PageCtxType = {
  vals: Record<string, string>;
  res: Record<string, boolean | null>;
  onChange: (id: string, v: string) => void;
  onCek: (k: string) => void;
};
const PageCtx = createContext<PageCtxType>({
  vals: {}, res: {}, onChange: () => {}, onCek: () => {},
});

/* ─── Blank (module-level — stable reference) ─────────────── */
function Blank({ id, w = "w-20", mono = true }: { id: string; w?: string; mono?: boolean }) {
  const { vals, res, onChange } = useContext(PageCtx);
  const r = res[id] ?? null;

  const borderStyle = r === null
    ? "border-2 border-dashed border-cyan-400/70 focus:border-cyan-300"
    : r
    ? "border-2 border-solid border-emerald-400"
    : "border-2 border-solid border-red-400";
  const bg = r === null ? "bg-white/5" : r ? "bg-emerald-500/20" : "bg-red-500/20";
  const tc = r === null ? "text-white" : r ? "text-emerald-200" : "text-red-200";

  return (
    <span className="inline-flex items-center gap-0.5 align-middle">
      <input
        value={vals[id] ?? ""}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder="···"
        size={18}
        className={`${w} min-w-[3rem] ${borderStyle} ${bg} ${tc} rounded-md text-center text-base outline-none px-2 py-1 transition-all duration-200 ${mono ? "font-mono" : "font-body"} placeholder-white/30 font-bold`}
      />
      {r !== null && (
        <span className={`text-sm font-bold ${r ? "text-emerald-400" : "text-red-400"}`}>{r ? "✓" : "✗"}</span>
      )}
    </span>
  );
}

/* ─── CekButton (module-level — stable reference) ─────────── */
function CekButton({ sectionKey }: { sectionKey: string }) {
  const { vals, res, onCek } = useContext(PageCtx);
  const ids = SECTIONS[sectionKey] ?? [];
  const checked = ids.some((id) => res[id] !== null && res[id] !== undefined);
  const correct = ids.filter((id) => res[id] === true).length;
  return (
    <div className="flex items-center gap-3 mt-4">
      <button
        onClick={() => onCek(sectionKey)}
        className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold font-display tracking-wide hover:opacity-90 active:scale-95 transition-all shadow-[0_0_16px_rgba(6,182,212,0.4)]"
      >
        Cek Jawaban
      </button>
      {checked && (
        <span className={`text-sm font-bold font-display ${correct === ids.length ? "text-emerald-400" : "text-amber-400"}`}>
          {correct}/{ids.length} benar
        </span>
      )}
    </div>
  );
}

/* ─── Shorthand aliases (module-level — stable) ───────────── */
const B = ({ id, w, mono }: { id: string; w?: string; mono?: boolean }) =>
  <Blank id={id} w={w} mono={mono} />;
const CK = ({ sectionKey }: { sectionKey: string }) =>
  <CekButton sectionKey={sectionKey} />;

/* ─── StepCard ────────────────────────────────────────────── */
function StepCard({ step, title, color = "cyan", children }: { step: string; title: string; color?: "cyan" | "emerald" | "violet" | "amber"; children: React.ReactNode }) {
  const headerColors: Record<string, string> = {
    cyan: "bg-gradient-to-r from-cyan-600/60 to-blue-700/60 border-b border-cyan-400/40",
    emerald: "bg-gradient-to-r from-emerald-600/60 to-teal-700/60 border-b border-emerald-400/40",
    violet: "bg-gradient-to-r from-violet-600/60 to-purple-700/60 border-b border-violet-400/40",
    amber: "bg-gradient-to-r from-amber-600/60 to-orange-700/60 border-b border-amber-400/40",
  };
  const iconColors: Record<string, string> = {
    cyan: "bg-cyan-400/30 border-cyan-300/60 text-cyan-200",
    emerald: "bg-emerald-400/30 border-emerald-300/60 text-emerald-200",
    violet: "bg-violet-400/30 border-violet-300/60 text-violet-200",
    amber: "bg-amber-400/30 border-amber-300/60 text-amber-200",
  };
  const titleColors: Record<string, string> = {
    cyan: "text-cyan-100",
    emerald: "text-emerald-100",
    violet: "text-violet-100",
    amber: "text-amber-100",
  };
  const bodyColors: Record<string, string> = {
    cyan: "bg-gradient-to-br from-cyan-950/60 to-blue-950/60 border-cyan-400/20",
    emerald: "bg-gradient-to-br from-emerald-950/60 to-teal-950/60 border-emerald-400/20",
    violet: "bg-gradient-to-br from-violet-950/60 to-purple-950/60 border-violet-400/20",
    amber: "bg-gradient-to-br from-amber-950/60 to-orange-950/60 border-amber-400/20",
  };
  return (
    <div className={`rounded-2xl border overflow-hidden mb-4 ${bodyColors[color]}`}>
      <div className={`flex items-center gap-2 px-4 py-3 ${headerColors[color]}`}>
        <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-sm font-black font-display shrink-0 ${iconColors[color]}`}>{step}</span>
        <p className={`text-sm font-black font-display tracking-wide uppercase ${titleColors[color]}`}>{title}</p>
      </div>
      <div className="px-4 py-4 font-body text-base text-white/90 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

/* ─── SectionHeader ───────────────────────────────────────── */
function SectionHeader({ label, color = "cyan", children }: { label: string; color?: string; children?: React.ReactNode }) {
  const colors: Record<string, string> = {
    cyan:    "from-cyan-500/50 to-blue-600/40 border-cyan-400/60 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.2)]",
    emerald: "from-emerald-500/50 to-teal-600/40 border-emerald-400/60 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.2)]",
    violet:  "from-violet-500/50 to-purple-600/40 border-violet-400/60 text-violet-100 shadow-[0_0_20px_rgba(139,92,246,0.2)]",
    amber:   "from-amber-500/50 to-orange-600/40 border-amber-400/60 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.2)]",
  };
  return (
    <div className={`rounded-2xl p-4 mb-4 bg-gradient-to-br border ${colors[color]}`}>
      <p className={`font-display text-base font-black tracking-wide ${colors[color].split(" ").slice(-1)}`}>{label}</p>
      {children && <div className="mt-2 text-sm text-white/85 font-body">{children}</div>}
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
const MetodeEliminasiLKPDPage = () => {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [res, setRes] = useState<Record<string, boolean | null>>({});

  const valsRef = useRef(vals);
  valsRef.current = vals;

  const handleChange = useCallback((id: string, v: string) => {
    setVals((prev) => ({ ...prev, [id]: v }));
    setRes((prev) => ({ ...prev, [id]: null }));
  }, []);

  const handleCek = useCallback((sectionKey: string) => {
    const ids = SECTIONS[sectionKey] ?? [];
    const updates: Record<string, boolean | null> = {};
    ids.forEach((id) => {
      updates[id] = checkAnswer(valsRef.current[id] ?? "", ANSWERS[id] ?? []);
    });
    setRes((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <PageCtx.Provider value={{ vals, res, onChange: handleChange, onCek: handleCek }}>
    <div className="relative min-h-screen flex flex-col gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath="/lkpd/kelas-8/spldv" />

      <div className="relative z-10 max-w-2xl w-full mx-auto px-4 pt-6 pb-24">

        {/* ── Header LKS ── */}
        <div className="rounded-3xl border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-600/30 via-blue-700/25 to-violet-600/25 p-6 mb-6 text-center shadow-[0_0_40px_rgba(6,182,212,0.25)]">
          <p className="font-display text-xs font-bold tracking-widest text-cyan-300 uppercase mb-1">Lembar Kerja Siswa 2 (LKS 2)</p>
          <h1 className="font-display text-xl md:text-2xl font-black text-white mb-2 drop-shadow-lg">Penyelesaian SPLDV Menggunakan Metode Eliminasi</h1>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-body text-white/70">
            <p>Mata Pelajaran: <span className="text-white font-bold">Matematika</span></p>
            <p>Kelas / Semester: <span className="text-white font-bold">VIII / I</span></p>
            <p>Alokasi Waktu: <span className="text-white font-bold">2 × 40 menit</span></p>
            <p>Satuan Pendidikan: <span className="text-white font-bold">SMP</span></p>
          </div>
          <p className="mt-3 text-sm text-white/80 font-body leading-relaxed text-left">
            <span className="text-cyan-300 font-bold">14. &nbsp; Tujuan Pembelajaran :</span> Peserta didik dapat menyelesaikan sistem persamaan linear dua variabel dengan metode eliminasi untuk penyelesaian masalah.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════
             BAGIAN A — PENGERTIAN SPLDV
        ══════════════════════════════════════════════════════ */}
        <SectionHeader label="A. Pengertian Sistem Persamaan Linear Dua Variabel (SPLDV)" color="cyan" />

        <div className="rounded-2xl border-2 border-cyan-400/30 bg-gradient-to-br from-cyan-900/40 to-blue-900/30 p-5 mb-4 font-body text-base text-white/90">
          <p className="mb-4 text-white font-semibold">Pada pembahasan mengenai PLDV, ciri-ciri dari PLDV antara lain :</p>
          <div className="space-y-4 pl-2">
            <p className="flex flex-wrap items-baseline gap-2">
              <span className="text-cyan-300 font-bold shrink-0 text-lg">1.</span>
              <span>Memiliki</span>
              <B id="a1" w="w-28" mono={false} />
              <span className="text-cyan-200/70">(misalnya variabel <span className="text-yellow-300 font-bold font-mono text-lg">x</span> dan <span className="text-yellow-300 font-bold font-mono text-lg">y</span>)</span>
            </p>
            <p className="flex flex-wrap items-baseline gap-2">
              <span className="text-cyan-300 font-bold shrink-0 text-lg">2.</span>
              <span>Pangkat masing-masing variabelnya adalah</span>
              <B id="a2" w="w-16" mono={false} />
              <span className="text-cyan-200/70">(disebut linear)</span>
            </p>
            <p className="flex flex-wrap items-baseline gap-2">
              <span className="text-cyan-300 font-bold shrink-0 text-lg">3.</span>
              <span>Koefisien variabel berupa bilangan</span>
              <B id="a3" w="w-20" mono={false} />
            </p>
            <p className="flex flex-wrap items-baseline gap-2">
              <span className="text-cyan-300 font-bold shrink-0 text-lg">4.</span>
              <span>Memiliki</span>
              <B id="a4" w="w-28" mono={false} />
              <span>penyelesaian</span>
            </p>
          </div>
          <CK sectionKey="a" />
        </div>

        {/* Contoh pengantar */}
        <div className="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-900/50 to-indigo-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="font-bold text-white text-lg mb-1">Contoh Penyelesaian SPLDV menggunakan metode eliminasi:</p>
          <p className="text-sm text-blue-200/80 mb-3">Tentukan himpunan penyelesaian dari:</p>
          <div className="font-mono text-center my-3 space-y-1 bg-blue-950/60 rounded-xl p-4 border border-blue-400/30">
            <p className="text-xl font-bold text-white"><span className="text-yellow-300">x</span> + <span className="text-yellow-300">y</span> = 5</p>
            <p className="text-xl font-bold text-white"><span className="text-yellow-300">x</span> − <span className="text-yellow-300">y</span> = 1</p>
            <p className="text-blue-300/60 text-sm mt-1">untuk <span className="text-yellow-300 font-bold">x</span>, <span className="text-yellow-300 font-bold">y</span> ∈ ℝ</p>
          </div>

          {/* Eliminasi 1 — mencari y */}
          <div className="mt-4 rounded-xl bg-cyan-900/40 border border-cyan-400/30 p-4">
            <p className="text-sm font-bold text-cyan-300 mb-3">
              ① Eliminasi variabel <span className="text-yellow-300 text-base font-mono font-black">x</span> → cari nilai <span className="text-yellow-300 text-base font-mono font-black">y</span>
              <span className="text-white/50 font-normal ml-2">(kedua persamaan dikurangkan)</span>
            </p>
            <div className="inline-block min-w-[15rem] bg-blue-950/50 rounded-xl p-3 border border-blue-400/20">
              <div className="flex items-center gap-3 font-mono text-base">
                <span className="w-6 text-right text-white/30 text-sm"> </span>
                <span className="text-white"><span className="text-yellow-300 font-bold text-lg">x</span> + <span className="text-yellow-300 font-bold text-lg">y</span></span>
                <span className="text-white/60 mx-1">=</span>
                <span className="text-white font-bold">5</span>
                <span className="ml-auto text-white/40 text-xs">… (1)</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-base">
                <span className="w-6 text-right text-red-400 font-black text-xl leading-none">−</span>
                <span className="text-white"><span className="text-yellow-300 font-bold text-lg">x</span> − <span className="text-yellow-300 font-bold text-lg">y</span></span>
                <span className="text-white/60 mx-1">=</span>
                <span className="text-white font-bold">1</span>
                <span className="ml-auto text-white/40 text-xs">… (2)</span>
              </div>
              <div className="border-t-2 border-cyan-400/60 my-2" />
              <div className="flex items-center gap-3 font-mono text-base">
                <span className="w-6"> </span>
                <span className="text-emerald-300 font-black text-lg">2<span className="text-yellow-300">y</span></span>
                <span className="text-white/60 mx-1">=</span>
                <span className="text-emerald-300 font-black text-lg">4</span>
                <span className="ml-3 text-white/50 text-xs">← variabel <span className="text-yellow-300 font-bold">x</span> tereliminasi</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-base mt-1">
                <span className="w-6"> </span>
                <span className="text-yellow-300 font-black text-xl">y</span>
                <span className="text-white/60 mx-1">=</span>
                <span className="text-yellow-300 font-black text-xl">2</span>
                <span className="ml-3 text-white/50 text-xs">← bagi kedua ruas dengan 2</span>
              </div>
            </div>
          </div>

          {/* Eliminasi 2 — mencari x */}
          <div className="mt-4 rounded-xl bg-emerald-900/40 border border-emerald-400/30 p-4">
            <p className="text-sm font-bold text-emerald-300 mb-3">
              ② Eliminasi variabel <span className="text-yellow-300 text-base font-mono font-black">y</span> → cari nilai <span className="text-yellow-300 text-base font-mono font-black">x</span>
              <span className="text-white/50 font-normal ml-2">(kedua persamaan dijumlahkan)</span>
            </p>
            <div className="inline-block min-w-[15rem] bg-emerald-950/50 rounded-xl p-3 border border-emerald-400/20">
              <div className="flex items-center gap-3 font-mono text-base">
                <span className="w-6 text-right text-white/30 text-sm"> </span>
                <span className="text-white"><span className="text-yellow-300 font-bold text-lg">x</span> + <span className="text-yellow-300 font-bold text-lg">y</span></span>
                <span className="text-white/60 mx-1">=</span>
                <span className="text-white font-bold">5</span>
                <span className="ml-auto text-white/40 text-xs">… (1)</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-base">
                <span className="w-6 text-right text-emerald-400 font-black text-xl leading-none">+</span>
                <span className="text-white"><span className="text-yellow-300 font-bold text-lg">x</span> − <span className="text-yellow-300 font-bold text-lg">y</span></span>
                <span className="text-white/60 mx-1">=</span>
                <span className="text-white font-bold">1</span>
                <span className="ml-auto text-white/40 text-xs">… (2)</span>
              </div>
              <div className="border-t-2 border-emerald-400/60 my-2" />
              <div className="flex items-center gap-3 font-mono text-base">
                <span className="w-6"> </span>
                <span className="text-emerald-300 font-black text-lg">2<span className="text-yellow-300">x</span></span>
                <span className="text-white/60 mx-1">=</span>
                <span className="text-emerald-300 font-black text-lg">6</span>
                <span className="ml-3 text-white/50 text-xs">← variabel <span className="text-yellow-300 font-bold">y</span> tereliminasi</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-base mt-1">
                <span className="w-6"> </span>
                <span className="text-yellow-300 font-black text-xl">x</span>
                <span className="text-white/60 mx-1">=</span>
                <span className="text-yellow-300 font-black text-xl">3</span>
                <span className="ml-3 text-white/50 text-xs">← bagi kedua ruas dengan 2</span>
              </div>
            </div>
          </div>

          {/* ✅ Memeriksa Hasil Kembali — highlighted */}
          <div className="mt-4 rounded-xl bg-gradient-to-br from-amber-600/30 to-orange-700/20 border-2 border-amber-400/60 p-4 shadow-[0_0_16px_rgba(245,158,11,0.25)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-amber-400 text-black text-xs font-black px-2 py-0.5 rounded-full font-display tracking-wide">🔍 MEMERIKSA HASIL KEMBALI</span>
            </div>
            <p className="text-sm text-amber-100/80 mb-3 font-body">Substitusikan <span className="text-yellow-300 font-black font-mono text-base">x = 3</span> dan <span className="text-yellow-300 font-black font-mono text-base">y = 2</span> ke kedua persamaan untuk memverifikasi:</p>
            <div className="space-y-2 font-mono text-base bg-amber-950/40 rounded-xl p-3 border border-amber-400/20">
              <p className="flex flex-wrap items-center gap-2">
                <span className="text-amber-300 font-bold">Persamaan 1 :</span>
                <span className="text-white"><span className="text-yellow-300 font-black text-lg">x</span> + <span className="text-yellow-300 font-black text-lg">y</span> = <span className="text-yellow-300 font-black text-lg">3</span> + <span className="text-yellow-300 font-black text-lg">2</span> = <span className="text-emerald-300 font-black text-lg">5</span></span>
                <span className="text-emerald-400 font-black text-lg">✓</span>
              </p>
              <p className="flex flex-wrap items-center gap-2">
                <span className="text-amber-300 font-bold">Persamaan 2 :</span>
                <span className="text-white"><span className="text-yellow-300 font-black text-lg">x</span> − <span className="text-yellow-300 font-black text-lg">y</span> = <span className="text-yellow-300 font-black text-lg">3</span> − <span className="text-yellow-300 font-black text-lg">2</span> = <span className="text-emerald-300 font-black text-lg">1</span></span>
                <span className="text-emerald-400 font-black text-lg">✓</span>
              </p>
            </div>
          </div>

          {/* Kesimpulan */}
          <div className="mt-4 rounded-xl bg-gradient-to-br from-emerald-600/30 to-teal-700/20 border-2 border-emerald-400/60 p-4">
            <p className="text-base font-black text-emerald-300 font-display mb-1">✅ Kesimpulan:</p>
            <p className="text-white text-lg font-mono font-bold">Himpunan penyelesaian = <span className="text-yellow-300">{"{"}(3, 2){"}"}</span></p>
            <p className="text-emerald-200/60 text-sm mt-1 font-body">Kedua persamaan terpenuhi → jawaban benar!</p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
             BAGIAN B — METODE ELIMINASI (KASUS 1)
        ══════════════════════════════════════════════════════ */}
        <SectionHeader label="Kasus 1 Penyelesaian SPLDV Menggunakan Metode Eliminasi" color="cyan">
          Tentukan penyelesaian dari <span className="font-mono text-white font-bold text-base">2<span className="text-yellow-300">x</span> + <span className="text-yellow-300">y</span> = 8</span> dan <span className="font-mono text-white font-bold text-base"><span className="text-yellow-300">x</span> − <span className="text-yellow-300">y</span> = 10</span> dengan <span className="text-yellow-300 font-mono font-bold">x</span>, <span className="text-yellow-300 font-mono font-bold">y</span> ∈ ℝ menggunakan <strong className="text-cyan-300">metode eliminasi</strong>.
        </SectionHeader>

        {/* Step 1 */}
        <StepCard step="1" title="Penyelesaian" color="cyan">
          <p className="font-mono text-sm text-cyan-200/70 mb-3">2<span className="text-yellow-300 font-bold">x</span> + <span className="text-yellow-300 font-bold">y</span> = 8 &nbsp; … (persamaan 1)<br /><span className="text-yellow-300 font-bold">x</span> − <span className="text-yellow-300 font-bold">y</span> = 10 &nbsp; … (persamaan 2)</p>
          <p className="text-white/80 text-sm mb-3">Koefisien <span className="text-yellow-300 font-bold font-mono text-base">y</span> sudah sama (berlawanan tanda) → <span className="text-cyan-300 font-bold">jumlahkan</span> kedua persamaan untuk menghilangkan <span className="text-yellow-300 font-bold font-mono text-base">y</span>:</p>
          <div className="rounded-xl bg-cyan-950/60 border-2 border-cyan-400/30 p-4 font-mono text-lg text-center mb-4 space-y-2">
            <p className="text-white">2<span className="text-yellow-300 font-black">x</span> + <span className="text-yellow-300 font-black">y</span> &nbsp;= 8</p>
            <p className="text-white"><span className="text-yellow-300 font-black">x</span> − <span className="text-yellow-300 font-black">y</span> &nbsp;= 10 &nbsp;<span className="text-white/50 text-sm">+</span></p>
            <div className="border-t-2 border-cyan-400/60 pt-2">
              <p className="text-emerald-300 font-black">3<span className="text-yellow-300">x</span> = 18 &nbsp;→&nbsp; <span className="text-yellow-300">x</span> = <span className="text-yellow-300">6</span></p>
            </div>
          </div>

          <p className="text-white/80 text-sm mb-3">Untuk mencari <span className="text-yellow-300 font-bold font-mono text-base">y</span>, eliminasi variabel <span className="text-yellow-300 font-bold font-mono text-base">x</span> (koefisien <span className="text-yellow-300 font-bold font-mono">x</span> belum sama: 2 dan 1, KPK = 2 → kalikan persamaan 2 dengan 2):</p>
          <div className="rounded-xl bg-cyan-950/60 border-2 border-cyan-400/30 p-4 font-mono text-base mb-4">
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center">
              <span className="text-white/50 text-xs">2<span className="text-yellow-300">x</span> + <span className="text-yellow-300">y</span> = 8 &nbsp;× 1</span>
              <span className="flex items-center gap-1 flex-wrap">
                <B id="k1_r1a" w="w-12" /> +
                <B id="k1_r1b" w="w-10" /> =
                <B id="k1_r1c" w="w-10" />
              </span>
              <span className="text-white/50 text-xs"><span className="text-yellow-300">x</span> − <span className="text-yellow-300">y</span> = 10 × 2</span>
              <span className="flex items-center gap-1 flex-wrap">
                <B id="k1_r2a" w="w-12" /> −
                <B id="k1_r2b" w="w-12" /> =
                <B id="k1_r2c" w="w-10" />
              </span>
              <span className="text-white/40 text-sm border-t border-white/10 pt-1">−</span>
              <span className="border-t border-white/20 pt-1 flex items-center gap-1">
                <B id="k1_resl" w="w-14" /> =
                <B id="k1_resr" w="w-14" />
              </span>
              <span />
              <span className="flex items-center gap-1 text-yellow-200 font-bold">
                <span className="text-yellow-300 text-lg">y</span> =
                <B id="k1_ynilai" w="w-14" />
              </span>
            </div>
          </div>

          <p className="text-white/90 text-base">
            Maka nilai <span className="text-yellow-300 font-black font-mono text-lg">x</span> = <B id="k1_xfinal" w="w-12" /> dan <span className="text-yellow-300 font-black font-mono text-lg">y</span> = <B id="k1_yfinal" w="w-12" />
          </p>
          <CK sectionKey="k1step1" />
        </StepCard>

        {/* Step 2 */}
        <StepCard step="2" title="Memeriksa Hasil Kembali" color="amber">
          <p className="text-white/80 text-sm mb-4">Substitusikan <span className="text-yellow-300 font-black font-mono text-base">x = 6</span> dan <span className="text-yellow-300 font-black font-mono text-base">y = −4</span> ke kedua persamaan:</p>
          <div className="space-y-3 font-mono text-base">
            <p className="flex flex-wrap items-center gap-2">
              <span className="text-amber-300 font-bold text-sm">Persamaan 1 :</span>
              2(<B id="k1_cek1a" w="w-10" />) + (<B id="k1_cek1b" w="w-10" />) = <B id="k1_cek1c" w="w-10" />
              <span className="text-white/50 font-body text-sm">(hasil harus 8)</span>
            </p>
            <p className="flex flex-wrap items-center gap-2">
              <span className="text-amber-300 font-bold text-sm">Persamaan 2 :</span>
              <B id="k1_cek2a" w="w-10" /> − (<B id="k1_cek2b" w="w-10" />) = <B id="k1_cek2c" w="w-10" />
              <span className="text-white/50 font-body text-sm">(hasil harus 10)</span>
            </p>
          </div>
          <CK sectionKey="k1step2" />
        </StepCard>

        <div className="rounded-xl border-2 border-cyan-400/25 bg-gradient-to-br from-cyan-900/30 to-blue-900/20 p-4 mb-6">
          <p className="text-sm text-cyan-300 font-body mb-2">💬 Kesan menggunakan metode eliminasi :</p>
          <textarea rows={2} className="w-full bg-transparent text-base text-white/90 font-body outline-none resize-none placeholder-white/30" placeholder="Tuliskan kesanmu di sini…" />
        </div>


        {/* ══════════════════════════════════════════════════════
             BAGIAN B — METODE SUBSTITUSI (KASUS 2)
        ══════════════════════════════════════════════════════ */}
        <SectionHeader label="B. Metode Substitusi — KASUS 2" color="emerald">
          Tentukan penyelesaian dari <span className="font-mono text-white font-bold text-base">2<span className="text-yellow-300">x</span> − <span className="text-yellow-300">y</span> = 4</span> dan <span className="font-mono text-white font-bold text-base"><span className="text-yellow-300">x</span> + <span className="text-yellow-300">y</span> = 5</span> dengan <span className="text-yellow-300 font-mono font-bold">x</span>, <span className="text-yellow-300 font-mono font-bold">y</span> ∈ ℝ menggunakan <strong className="text-emerald-300">metode substitusi</strong>.
        </SectionHeader>

        <StepCard step="1" title="Penyelesaian" color="emerald">
          <p className="font-mono text-sm text-emerald-200/70 mb-3"><span className="text-yellow-300 font-bold">x</span> + <span className="text-yellow-300 font-bold">y</span> = 5 &nbsp; … (persamaan 1)<br />2<span className="text-yellow-300 font-bold">x</span> − <span className="text-yellow-300 font-bold">y</span> = 4 &nbsp; … (persamaan 2)</p>

          <p className="text-sm text-white/80 mb-2">Nyatakan <span className="text-yellow-300 font-black font-mono text-base">x</span> sebagai <span className="text-yellow-300 font-black font-mono text-base">y</span> pada persamaan 1 :</p>
          <p className="font-mono text-lg mb-4">
            <span className="text-yellow-300 font-black">x</span> + <span className="text-yellow-300 font-black">y</span> = 5 &nbsp;→&nbsp; <span className="text-yellow-300 font-black">x</span> = 5 − <B id="k2_xsubst" w="w-12" />
          </p>

          <p className="text-sm text-white/80 mb-2">Substitusikan <span className="text-yellow-300 font-black font-mono text-base">x</span> = 5 − <B id="k2_xsubst2" w="w-12" /> ke persamaan 2 :</p>
          <div className="rounded-xl bg-emerald-950/60 border-2 border-emerald-400/30 p-4 font-mono text-lg mb-4 space-y-2">
            <p>2(5 − <span className="text-yellow-300 font-black">y</span>) − <span className="text-yellow-300 font-black">y</span> = 4</p>
            <p className="flex items-center gap-1">
              <B id="k2_r1l" w="w-12" /> − <B id="k2_r1r" w="w-12" /> − <span className="text-yellow-300 font-black">y</span> = 4
            </p>
            <p className="flex items-center gap-1">
              <B id="k2_r2l" w="w-12" /> − <B id="k2_r2r" w="w-12" /> = 4
            </p>
            <p className="flex items-center gap-1 text-emerald-200">
              <span className="text-yellow-300 font-black text-xl">y</span> = <B id="k2_y" w="w-12" />
            </p>
          </div>

          <p className="text-sm text-white/80 mb-2">Substitusikan <span className="text-yellow-300 font-black font-mono text-base">y</span> = <B id="k2_ysub" w="w-12" /> ke persamaan 1 :</p>
          <div className="rounded-xl bg-emerald-950/60 border-2 border-emerald-400/30 p-4 font-mono text-lg mb-4 space-y-2">
            <p className="flex items-center gap-2">
              <span className="text-yellow-300 font-black">x</span> + <B id="k2_ysub" w="w-12" /> = 5
            </p>
            <p className="flex items-center gap-2 text-emerald-200">
              <span className="text-yellow-300 font-black text-xl">x</span> = <B id="k2_xhasil" w="w-12" />
            </p>
          </div>

          <p className="text-white/90 text-base">
            Maka nilai <span className="text-yellow-300 font-black font-mono text-lg">x</span> = <B id="k2_xfinal" w="w-12" /> dan <span className="text-yellow-300 font-black font-mono text-lg">y</span> = <B id="k2_yfinal" w="w-12" />
          </p>
          <CK sectionKey="k2step1" />
        </StepCard>

        <StepCard step="2" title="Memeriksa Hasil Kembali" color="amber">
          <p className="text-white/80 text-sm mb-4">Substitusikan <span className="text-yellow-300 font-black font-mono text-base">x = 3</span> dan <span className="text-yellow-300 font-black font-mono text-base">y = 2</span> ke kedua persamaan:</p>
          <div className="space-y-3 font-mono text-base">
            <p className="flex flex-wrap items-center gap-2">
              <span className="text-amber-300 font-bold text-sm">Persamaan 1 :</span>
              <B id="k2_cek1a" w="w-10" /> + <B id="k2_cek1b" w="w-10" /> = <B id="k2_cek1c" w="w-10" />
              <span className="text-white/50 font-body text-sm">(hasil harus 5)</span>
            </p>
            <p className="flex flex-wrap items-center gap-2">
              <span className="text-amber-300 font-bold text-sm">Persamaan 2 :</span>
              2(<B id="k2_cek2a" w="w-10" />) − <B id="k2_cek2b" w="w-10" /> = <B id="k2_cek2c" w="w-10" />
              <span className="text-white/50 font-body text-sm">(hasil harus 4)</span>
            </p>
          </div>
          <CK sectionKey="k2step2" />
        </StepCard>

        <div className="rounded-xl border-2 border-emerald-400/25 bg-gradient-to-br from-emerald-900/30 to-teal-900/20 p-4 mb-6">
          <p className="text-sm text-emerald-300 font-body mb-2">💬 Kesan menggunakan metode substitusi :</p>
          <textarea rows={2} className="w-full bg-transparent text-base text-white/90 font-body outline-none resize-none placeholder-white/30" placeholder="Tuliskan kesanmu di sini…" />
        </div>


        {/* ══════════════════════════════════════════════════════
             BAGIAN B — METODE CAMPURAN (KASUS 3)
        ══════════════════════════════════════════════════════ */}
        <SectionHeader label="B. Metode Campuran — KASUS 3" color="violet">
          Tentukan penyelesaian dari <span className="font-mono text-white font-bold text-base">2<span className="text-yellow-300">x</span> + <span className="text-yellow-300">y</span> = 5</span> dan <span className="font-mono text-white font-bold text-base">3<span className="text-yellow-300">x</span> − 2<span className="text-yellow-300">y</span> = 11</span> dengan <span className="text-yellow-300 font-mono font-bold">x</span>, <span className="text-yellow-300 font-mono font-bold">y</span> ∈ ℝ menggunakan <strong className="text-violet-300">metode campuran</strong>.
        </SectionHeader>

        <StepCard step="1" title="Penyelesaian" color="violet">
          <p className="font-mono text-sm text-violet-200/70 mb-3">2<span className="text-yellow-300 font-bold">x</span> + <span className="text-yellow-300 font-bold">y</span> = 5 &nbsp; … (persamaan 1)<br />3<span className="text-yellow-300 font-bold">x</span> − 2<span className="text-yellow-300 font-bold">y</span> = 11 … (persamaan 2)</p>

          <p className="text-sm text-white/80 mb-2">Langkah 1 — <strong className="text-cyan-300">Eliminasi</strong> variabel <span className="text-yellow-300 font-black font-mono text-base">y</span> (KPK koefisien <span className="text-yellow-300 font-mono">y</span>: 1 dan 2 = 2, kalikan P1 dengan 2):</p>
          <div className="rounded-xl bg-violet-950/60 border-2 border-violet-400/30 p-4 font-mono text-base mb-4">
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center">
              <span className="text-white/50 text-xs">3<span className="text-yellow-300">x</span> − 2<span className="text-yellow-300">y</span> = 11 × 1</span>
              <span className="flex items-center gap-1 flex-wrap">
                <B id="k3_r1a" w="w-12" /> − <B id="k3_r1b" w="w-12" /> = <B id="k3_r1c" w="w-10" />
              </span>
              <span className="text-white/50 text-xs">2<span className="text-yellow-300">x</span> + <span className="text-yellow-300">y</span> = 5 &nbsp; × 2</span>
              <span className="flex items-center gap-1 flex-wrap">
                <B id="k3_r2a" w="w-12" /> + <B id="k3_r2b" w="w-12" /> = <B id="k3_r2c" w="w-10" />
              </span>
              <span className="text-white/40 text-sm border-t border-white/10 pt-1">+</span>
              <span className="border-t border-white/20 pt-1 flex items-center gap-1">
                <B id="k3_resl" w="w-14" /> = <B id="k3_resr" w="w-14" />
              </span>
              <span />
              <span className="flex items-center gap-1 text-yellow-200 font-bold">
                <span className="text-yellow-300 text-lg">x</span> = <B id="k3_x" w="w-12" />
              </span>
            </div>
          </div>

          <p className="text-sm text-white/80 mb-2">Langkah 2 — <strong className="text-emerald-300">Substitusi</strong> <span className="text-yellow-300 font-black font-mono text-base">x</span> = <B id="k3_substx" w="w-10" /> ke persamaan 1 :</p>
          <div className="rounded-xl bg-violet-950/60 border-2 border-violet-400/30 p-4 font-mono text-lg mb-4 space-y-2">
            <p>2(<B id="k3_substx" w="w-10" />) + <span className="text-yellow-300 font-black">y</span> = 5</p>
            <p className="flex items-center gap-2">
              <B id="k3_kiri" w="w-10" /> + <span className="text-yellow-300 font-black">y</span> = 5
            </p>
            <p className="flex items-center gap-2 text-violet-200">
              <span className="text-yellow-300 font-black text-xl">y</span> = <B id="k3_y" w="w-12" />
            </p>
          </div>

          <p className="text-white/90 text-base">
            Maka nilai <span className="text-yellow-300 font-black font-mono text-lg">x</span> = <B id="k3_xfinal" w="w-12" /> dan <span className="text-yellow-300 font-black font-mono text-lg">y</span> = <B id="k3_yfinal" w="w-12" />
          </p>
          <CK sectionKey="k3step1" />
        </StepCard>

        <StepCard step="2" title="Memeriksa Hasil Kembali" color="amber">
          <p className="text-white/80 text-sm mb-4">Substitusikan <span className="text-yellow-300 font-black font-mono text-base">x = 3</span> dan <span className="text-yellow-300 font-black font-mono text-base">y = −1</span> ke kedua persamaan:</p>
          <div className="space-y-3 font-mono text-base">
            <p className="flex flex-wrap items-center gap-2">
              <span className="text-amber-300 font-bold text-sm">Persamaan 1 :</span>
              2(<B id="k3_cek1a" w="w-10" />) + (<B id="k3_cek1b" w="w-10" />) = <B id="k3_cek1c" w="w-10" />
              <span className="text-white/50 font-body text-sm">(hasil harus 5)</span>
            </p>
            <p className="flex flex-wrap items-center gap-2">
              <span className="text-amber-300 font-bold text-sm">Persamaan 2 :</span>
              3(<B id="k3_cek2a" w="w-10" />) − 2(<B id="k3_cek2b" w="w-10" />) = <B id="k3_cek2c" w="w-10" />
              <span className="text-white/50 font-body text-sm">(hasil harus 11)</span>
            </p>
          </div>
          <CK sectionKey="k3step2" />
        </StepCard>

        <div className="rounded-xl border-2 border-violet-400/25 bg-gradient-to-br from-violet-900/30 to-purple-900/20 p-4 mb-6">
          <p className="text-sm text-violet-300 font-body mb-2">💬 Kesan menggunakan metode campuran :</p>
          <textarea rows={2} className="w-full bg-transparent text-base text-white/90 font-body outline-none resize-none placeholder-white/30" placeholder="Tuliskan kesanmu di sini…" />
        </div>

        {/* Footer */}
        <div className="text-center">
          <button
            onClick={() => window.history.back()}
            className="text-sm text-white/50 hover:text-cyan-400 transition-colors font-body"
          >
            ← Kembali ke menu SPLDV
          </button>
        </div>
      </div>
    </div>
    </PageCtx.Provider>
  );
};

export default MetodeEliminasiLKPDPage;
