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

  /* Kasus 1 – Campuran (2x + y = 5 dan 3x − 2y = 11) */
  k1_r1a: ["3x"],
  k1_r1b: ["2y"],
  k1_r1c: ["11"],
  k1_r2a: ["4x"],
  k1_r2b: ["2y"],
  k1_r2c: ["10"],
  k1_resl: ["7x"],
  k1_resr: ["21"],
  k1_x: ["3"],
  k1_substx: ["3"],
  k1_kiri: ["6"],
  k1_y: ["-1", "−1"],
  k1_xfinal: ["3"],
  k1_yfinal: ["-1", "−1"],
  k1_cek1a: ["3"],
  k1_cek1b: ["-1", "−1"],
  k1_cek1c: ["5"],
  k1_cek2a: ["3"],
  k1_cek2b: ["-1", "−1"],
  k1_cek2c: ["11"],
};

const SECTIONS: Record<string, string[]> = {
  a: ["a1","a2","a3","a4"],
  k1step1: ["k1_r1a","k1_r1b","k1_r1c","k1_r2a","k1_r2b","k1_r2c","k1_resl","k1_resr","k1_x","k1_substx","k1_kiri","k1_y","k1_xfinal","k1_yfinal"],
  k1step2: ["k1_cek1a","k1_cek1b","k1_cek1c","k1_cek2a","k1_cek2b","k1_cek2c"],
};

/* ─── Page Context ─────────────────────────────────────────── */
type PageCtxType = {
  vals: Record<string, string>;
  res: Record<string, boolean | null>;
  onChange: (id: string, v: string) => void;
  onCek: (k: string) => void;
};
const PageCtx = createContext<PageCtxType>({
  vals: {}, res: {}, onChange: () => {}, onCek: () => {},
});

/* ─── Blank ────────────────────────────────────────────────── */
function Blank({ id, w = "w-20" }: { id: string; w?: string }) {
  const { vals, res, onChange } = useContext(PageCtx);
  const border =
    res[id] === true
      ? "border-emerald-400 bg-emerald-900/40"
      : res[id] === false
      ? "border-red-400 bg-red-900/30"
      : "border-dashed border-white/40 bg-white/5";
  return (
    <input
      type="text"
      value={vals[id] ?? ""}
      onChange={(e) => onChange(id, e.target.value)}
      className={`inline-block ${w} rounded-lg border-2 ${border} px-2 py-0.5 text-center font-mono text-base text-white outline-none transition-colors`}
      placeholder="..."
    />
  );
}
const B = Blank;

/* ─── CekButton ────────────────────────────────────────────── */
function CekButton({ sectionKey }: { sectionKey: string }) {
  const { onCek } = useContext(PageCtx);
  return (
    <button
      onClick={() => onCek(sectionKey)}
      className="mt-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
    >
      Cek Jawaban
    </button>
  );
}
const CK = CekButton;

/* ─── SectionHeader ────────────────────────────────────────── */
function SectionHeader({
  label,
  color = "cyan",
  children,
}: {
  label: string;
  color?: "cyan" | "emerald" | "violet" | "amber";
  children?: React.ReactNode;
}) {
  const clr: Record<string, string> = {
    cyan: "from-cyan-600/80 to-blue-700/80 border-cyan-400/50",
    emerald: "from-emerald-600/80 to-teal-700/80 border-emerald-400/50",
    violet: "from-violet-600/80 to-purple-700/80 border-violet-400/50",
    amber: "from-amber-600/80 to-orange-700/80 border-amber-400/50",
  };
  return (
    <div className={`rounded-2xl bg-gradient-to-r ${clr[color]} border-2 p-4 mb-4`}>
      <p className="font-display font-black text-white text-lg">{label}</p>
      {children && <p className="text-sm text-white/85 mt-1 font-body">{children}</p>}
    </div>
  );
}

/* ─── StepCard ─────────────────────────────────────────────── */
function StepCard({
  step,
  title,
  color = "cyan",
  children,
}: {
  step: string | number;
  title: string;
  color?: "cyan" | "emerald" | "violet" | "amber";
  children: React.ReactNode;
}) {
  const clr: Record<string, string> = {
    cyan: "border-cyan-400/40 bg-gradient-to-br from-cyan-900/50 to-blue-900/40",
    emerald: "border-emerald-400/40 bg-gradient-to-br from-emerald-900/50 to-teal-900/40",
    violet: "border-violet-400/40 bg-gradient-to-br from-violet-900/50 to-purple-900/40",
    amber: "border-amber-400/40 bg-gradient-to-br from-amber-900/50 to-orange-900/40",
  };
  const badge: Record<string, string> = {
    cyan: "bg-cyan-500 text-white",
    emerald: "bg-emerald-500 text-white",
    violet: "bg-violet-500 text-white",
    amber: "bg-amber-500 text-black",
  };
  return (
    <div className={`rounded-2xl border-2 ${clr[color]} p-5 mb-4`}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`rounded-xl ${badge[color]} px-3 py-1 text-sm font-black font-display`}>
          Langkah {step}
        </span>
        <span className="text-white font-bold font-display text-base">{title}</span>
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════ */
const MetodeCampuranLKPDPage = () => {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [res, setRes] = useState<Record<string, boolean | null>>({});
  const inputRefs = useRef<Record<string, string>>({});

  const onChange = useCallback((id: string, v: string) => {
    inputRefs.current[id] = v;
    setVals((prev) => ({ ...prev, [id]: v }));
  }, []);

  const onCek = useCallback((sectionKey: string) => {
    const keys = SECTIONS[sectionKey] ?? [];
    setRes((prev) => {
      const next = { ...prev };
      keys.forEach((k) => {
        const v = inputRefs.current[k] ?? "";
        const accepted = ANSWERS[k];
        next[k] = accepted ? checkAnswer(v, accepted) : null;
      });
      return next;
    });
  }, []);

  return (
    <PageCtx.Provider value={{ vals, res, onChange, onCek }}>
    <div className="relative min-h-screen bg-gradient-to-b from-[#060d1f] via-[#0b1628] to-[#0d1f38] text-white overflow-x-hidden">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 pt-20 pb-16">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="rounded-3xl border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur p-6 mb-8 text-center shadow-2xl">
          <p className="text-xs font-bold text-violet-300 tracking-widest font-display mb-1 uppercase">Lembar Kerja Siswa 4 (LKS 4)</p>
          <h1 className="font-display font-black text-2xl md:text-3xl text-white leading-tight mb-4">
            Penyelesaian SPLDV Menggunakan Metode Campuran
          </h1>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-body text-white/80 mb-4">
            <p>Mata Pelajaran: <strong className="text-white">Matematika</strong></p>
            <p>Kelas / Semester: <strong className="text-white">VIII / I</strong></p>
            <p>Alokasi Waktu: <strong className="text-white">2 × 40 menit</strong></p>
            <p>Satuan Pendidikan: <strong className="text-white">SMP</strong></p>
          </div>
          <p className="text-sm text-white/85 font-body text-left">
            <span className="text-violet-300 font-bold">Tujuan Pembelajaran : </span>
            Peserta didik dapat menyelesaikan sistem persamaan linear dua variabel dengan metode campuran (eliminasi + substitusi) untuk penyelesaian masalah.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════
             BAGIAN A — PENGERTIAN SPLDV
        ══════════════════════════════════════════════════════ */}
        <SectionHeader label="A. Pengertian Sistem Persamaan Linear Dua Variabel (SPLDV)" color="violet" />

        <div className="rounded-2xl border border-white/15 bg-white/5 p-5 mb-6 font-body text-base text-white/90">
          <p className="mb-3">Pada pembahasan mengenai PLDV, ciri-ciri dari PLDV antara lain :</p>
          <ol className="list-decimal list-inside space-y-3 text-white/90">
            <li>Memiliki <B id="a1" w="w-32" /> (misalnya variabel <span className="text-yellow-300 font-bold font-mono">x</span> dan <span className="text-yellow-300 font-bold font-mono">y</span>)</li>
            <li>Pangkat masing-masing variabelnya adalah <B id="a2" w="w-16" /> (disebut linear)</li>
            <li>Koefisien variabel berupa bilangan <B id="a3" w="w-20" /></li>
            <li>Memiliki <B id="a4" w="w-32" /> penyelesaian</li>
          </ol>
          <CK sectionKey="a" />
        </div>

        {/* ══════════════════════════════════════════════════════
             CONTOH — METODE CAMPURAN
        ══════════════════════════════════════════════════════ */}
        <SectionHeader label="Contoh Penyelesaian SPLDV Menggunakan Metode Campuran" color="violet" />

        <div className="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-900/50 to-indigo-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="font-bold text-white text-lg mb-1">Contoh Penyelesaian SPLDV menggunakan metode campuran:</p>
          <p className="text-sm text-blue-200/80 mb-3">Tentukan himpunan penyelesaian dari:</p>
          <div className="font-mono my-3 bg-blue-950/60 rounded-xl p-4 border border-blue-400/30 flex flex-col items-center">
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 items-center text-xl font-bold text-white">
              <span className="text-right"><span className="text-yellow-300">x</span> + <span className="text-yellow-300">y</span></span>
              <span className="text-white/70">=</span>
              <span>5</span>
              <span className="text-right"><span className="text-yellow-300">x</span> − <span className="text-yellow-300">y</span></span>
              <span className="text-white/70">=</span>
              <span>1</span>
            </div>
            <p className="text-blue-300/60 text-sm mt-2">untuk <span className="text-yellow-300 font-bold">x</span>, <span className="text-yellow-300 font-bold">y</span> ∈ ℝ</p>
          </div>

          {/* Langkah ① — Eliminasi */}
          <div className="mt-4 rounded-xl bg-cyan-900/40 border border-cyan-400/30 p-4">
            <p className="text-sm font-bold text-cyan-300 mb-3">
              ① <span className="text-cyan-200">Eliminasi</span> variabel <span className="text-yellow-300 text-base font-mono font-black">x</span> → cari nilai <span className="text-yellow-300 text-base font-mono font-black">y</span>
              <span className="text-white/50 font-normal ml-2">(koefisien x sama → kurangkan)</span>
            </p>
            <div className="bg-cyan-950/50 rounded-xl p-3 border border-cyan-400/20 font-mono text-base">
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-1 items-center">
                <span className="w-6 text-right text-white/30 text-sm"> </span>
                <span className="text-right text-white"><span className="text-yellow-300 font-bold text-lg">x</span> + <span className="text-yellow-300 font-bold text-lg">y</span></span>
                <span className="text-white/60 px-1">=</span>
                <span className="text-white font-bold">5 <span className="text-white/40 text-xs ml-2">… (1)</span></span>
                <span className="w-6 text-right text-red-400 font-black text-xl leading-none">−</span>
                <span className="text-right text-white"><span className="text-yellow-300 font-bold text-lg">x</span> − <span className="text-yellow-300 font-bold text-lg">y</span></span>
                <span className="text-white/60 px-1">=</span>
                <span className="text-white font-bold">1 <span className="text-white/40 text-xs ml-2">… (2)</span></span>
              </div>
              <div className="border-t-2 border-cyan-400/60 my-2" />
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-1 items-center">
                <span className="w-6"> </span>
                <span className="text-right text-emerald-300 font-black text-lg">2<span className="text-yellow-300">y</span></span>
                <span className="text-white/60 px-1">=</span>
                <span className="text-emerald-300 font-black text-lg">4 <span className="text-white/50 text-xs ml-2 font-normal">← variabel x tereliminasi</span></span>
                <span className="w-6"> </span>
                <span className="text-right text-yellow-300 font-black text-xl">y</span>
                <span className="text-white/60 px-1">=</span>
                <span className="text-yellow-300 font-black text-xl">2 <span className="text-white/50 text-xs ml-2 font-normal">← bagi kedua ruas dengan 2</span></span>
              </div>
            </div>
          </div>

          {/* Langkah ② — Substitusi */}
          <div className="mt-4 rounded-xl bg-emerald-900/40 border border-emerald-400/30 p-4">
            <p className="text-sm font-bold text-emerald-300 mb-3">
              ② <span className="text-emerald-200">Substitusi</span> <span className="text-yellow-300 text-base font-mono font-black">y</span> = 2 ke persamaan 1 → cari nilai <span className="text-yellow-300 text-base font-mono font-black">x</span>
            </p>
            <div className="bg-emerald-950/50 rounded-xl p-3 border border-emerald-400/20 font-mono text-base space-y-1">
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 items-center">
                <span className="w-6"> </span>
                <span className="text-right text-white"><span className="text-yellow-300 font-bold">x</span> + 2</span>
                <span className="text-white/60 px-1">=</span>
                <span className="text-white font-bold">5</span>
              </div>
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 items-center">
                <span className="w-6"> </span>
                <span className="text-right text-yellow-300 font-black text-xl">x</span>
                <span className="text-white/60 px-1">=</span>
                <span className="text-yellow-300 font-black text-xl">3 <span className="text-white/50 text-xs ml-2 font-normal">← 5−2=3</span></span>
              </div>
            </div>
          </div>

          {/* Memeriksa */}
          <div className="mt-4 rounded-xl bg-gradient-to-br from-amber-600/30 to-orange-700/20 border-2 border-amber-400/60 p-4 shadow-[0_0_16px_rgba(245,158,11,0.25)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-amber-400 text-black text-xs font-black px-2 py-0.5 rounded-full font-display tracking-wide">🔍 MEMERIKSA HASIL KEMBALI</span>
            </div>
            <p className="text-sm text-amber-100/80 mb-3 font-body">Substitusikan <span className="text-yellow-300 font-black font-mono text-base">x = 3</span> dan <span className="text-yellow-300 font-black font-mono text-base">y = 2</span> ke kedua persamaan:</p>
            <div className="space-y-2 font-mono text-base bg-amber-950/40 rounded-xl p-3 border border-amber-400/20">
              <p className="flex flex-wrap items-center gap-2">
                <span className="text-amber-300 font-bold">Persamaan 1 :</span>
                <span className="text-white"><span className="text-yellow-300 font-black text-lg">3</span> + <span className="text-yellow-300 font-black text-lg">2</span> = <span className="text-emerald-300 font-black text-lg">5</span></span>
                <span className="text-emerald-400 font-black text-lg">✓</span>
              </p>
              <p className="flex flex-wrap items-center gap-2">
                <span className="text-amber-300 font-bold">Persamaan 2 :</span>
                <span className="text-white"><span className="text-yellow-300 font-black text-lg">3</span> − <span className="text-yellow-300 font-black text-lg">2</span> = <span className="text-emerald-300 font-black text-lg">1</span></span>
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
             KASUS 1 — METODE CAMPURAN
        ══════════════════════════════════════════════════════ */}
        <SectionHeader label="Kasus 1 Penyelesaian SPLDV Menggunakan Metode Campuran" color="violet" />

        <div className="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-900/50 to-indigo-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-blue-200/80 mb-3">Tentukan himpunan penyelesaian dari:</p>
          <div className="font-mono my-3 bg-blue-950/60 rounded-xl p-4 border border-blue-400/30 flex flex-col items-center">
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 items-center text-xl font-bold text-white">
              <span className="text-right">2<span className="text-yellow-300">x</span> + <span className="text-yellow-300">y</span></span>
              <span className="text-white/70">=</span>
              <span>5</span>
              <span className="text-right">3<span className="text-yellow-300">x</span> − 2<span className="text-yellow-300">y</span></span>
              <span className="text-white/70">=</span>
              <span>11</span>
            </div>
            <p className="text-blue-300/60 text-sm mt-2">untuk <span className="text-yellow-300 font-bold">x</span>, <span className="text-yellow-300 font-bold">y</span> ∈ ℝ</p>
          </div>

          {/* Langkah ① — Eliminasi y */}
          <div className="mt-4 rounded-xl bg-cyan-900/40 border border-cyan-400/30 p-4">
            <p className="text-sm font-bold text-cyan-300 mb-3">
              ① <span className="text-cyan-200">Eliminasi</span> variabel <span className="text-yellow-300 text-base font-mono font-black">y</span> → cari nilai <span className="text-yellow-300 text-base font-mono font-black">x</span>
              <span className="text-white/50 font-normal ml-2">(KPK koefisien y: 1 dan 2 = 2, kalikan P1 dengan 2)</span>
            </p>
            <div className="bg-violet-950/50 rounded-xl p-3 border border-violet-400/20 font-mono text-base">
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-2 items-center">
                <span className="text-white/50 text-xs whitespace-nowrap">3<span className="text-yellow-300">x</span> − 2<span className="text-yellow-300">y</span> = 11 × 1</span>
                <span className="text-right flex items-center gap-1"><B id="k1_r1a" w="w-12" /> −&#8202;<B id="k1_r1b" w="w-12" /></span>
                <span className="text-white/60 px-1">=</span>
                <span><B id="k1_r1c" w="w-10" /></span>
                <span className="text-white/50 text-xs whitespace-nowrap">2<span className="text-yellow-300">x</span> + <span className="text-yellow-300">y</span> = 5 × 2</span>
                <span className="text-right flex items-center gap-1"><B id="k1_r2a" w="w-12" /> +&#8202;<B id="k1_r2b" w="w-12" /></span>
                <span className="text-white/60 px-1">=</span>
                <span><B id="k1_r2c" w="w-10" /></span>
              </div>
              <div className="border-t border-white/20 my-2" />
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-1 items-center">
                <span className="w-6 text-right text-white/40 text-sm">+</span>
                <span className="text-right"><B id="k1_resl" w="w-14" /></span>
                <span className="text-white/60 px-1">=</span>
                <span className="flex items-center gap-2"><B id="k1_resr" w="w-14" /><span className="text-white/40 text-xs font-normal">← variabel <span className="text-yellow-300">y</span> tereliminasi</span></span>
                <span className="w-6"> </span>
                <span className="text-right text-yellow-300 font-black text-xl">x</span>
                <span className="text-white/60 px-1">=</span>
                <span className="flex items-center gap-2"><B id="k1_x" w="w-14" /><span className="text-white/40 text-xs font-normal">← bagi kedua ruas dengan 7</span></span>
              </div>
            </div>
          </div>

          {/* Langkah ② — Substitusi */}
          <div className="mt-4 rounded-xl bg-emerald-900/40 border border-emerald-400/30 p-4">
            <p className="text-sm font-bold text-emerald-300 mb-3">
              ② <span className="text-emerald-200">Substitusi</span> <span className="text-yellow-300 text-base font-mono font-black">x</span> = <B id="k1_substx" w="w-10" /> ke persamaan 1 → cari nilai <span className="text-yellow-300 text-base font-mono font-black">y</span>
            </p>
            <div className="bg-violet-950/60 rounded-xl border-2 border-violet-400/30 p-4 font-mono text-lg mb-2 space-y-2">
              <p>2(<B id="k1_substx" w="w-10" />) + <span className="text-yellow-300 font-black">y</span> = 5</p>
              <p className="flex items-center gap-2">
                <B id="k1_kiri" w="w-10" /> + <span className="text-yellow-300 font-black">y</span> = 5
              </p>
              <p className="flex items-center gap-2 text-violet-200">
                <span className="text-yellow-300 font-black text-xl">y</span> = <B id="k1_y" w="w-12" />
              </p>
            </div>
            <p className="text-white/90 text-base mt-3">
              Maka nilai <span className="text-yellow-300 font-black font-mono text-lg">x</span> = <B id="k1_xfinal" w="w-12" /> dan <span className="text-yellow-300 font-black font-mono text-lg">y</span> = <B id="k1_yfinal" w="w-12" />
            </p>
            <CK sectionKey="k1step1" />
          </div>

          {/* Memeriksa Hasil Kembali */}
          <div className="mt-4 rounded-xl bg-gradient-to-br from-amber-600/30 to-orange-700/20 border-2 border-amber-400/60 p-4 shadow-[0_0_16px_rgba(245,158,11,0.25)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-amber-400 text-black text-xs font-black px-2 py-0.5 rounded-full font-display tracking-wide">🔍 MEMERIKSA HASIL KEMBALI</span>
            </div>
            <p className="text-sm text-amber-100/80 mb-3 font-body">Substitusikan nilai <span className="text-yellow-300 font-black font-mono text-base">x</span> dan <span className="text-yellow-300 font-black font-mono text-base">y</span> yang diperoleh ke kedua persamaan:</p>
            <div className="space-y-3 font-mono text-base bg-amber-950/40 rounded-xl p-3 border border-amber-400/20">
              <p className="flex flex-wrap items-center gap-2">
                <span className="text-amber-300 font-bold text-sm">Persamaan 1 :</span>
                2(<B id="k1_cek1a" w="w-10" />) + (<B id="k1_cek1b" w="w-10" />) = <B id="k1_cek1c" w="w-10" />
                <span className="text-white/50 font-body text-sm">(hasil harus 5)</span>
              </p>
              <p className="flex flex-wrap items-center gap-2">
                <span className="text-amber-300 font-bold text-sm">Persamaan 2 :</span>
                3(<B id="k1_cek2a" w="w-10" />) − 2(<B id="k1_cek2b" w="w-10" />) = <B id="k1_cek2c" w="w-10" />
                <span className="text-white/50 font-body text-sm">(hasil harus 11)</span>
              </p>
            </div>
            <CK sectionKey="k1step2" />
          </div>

          {/* Kesimpulan */}
          <div className="mt-4 rounded-xl bg-gradient-to-br from-emerald-600/30 to-teal-700/20 border-2 border-emerald-400/60 p-4">
            <p className="text-base font-black text-emerald-300 font-display mb-2">✅ Kesimpulan:</p>
            <p className="text-white text-lg font-mono font-bold flex flex-wrap items-center gap-2">
              Himpunan penyelesaian = {"{"}(<B id="k1_xfinal" w="w-14" />, <B id="k1_yfinal" w="w-14" />){"}"}
            </p>
            <p className="text-emerald-200/60 text-sm mt-2 font-body">Kedua persamaan terpenuhi → jawaban benar!</p>
          </div>
        </div>

        <div className="rounded-xl border-2 border-violet-400/25 bg-gradient-to-br from-violet-900/30 to-purple-900/20 p-4 mb-6">
          <p className="text-sm text-violet-300 font-body mb-2">💬 Kesan menggunakan metode campuran :</p>
          <textarea rows={2} className="w-full bg-transparent text-base text-white/90 font-body outline-none resize-none placeholder-white/30" placeholder="Tuliskan kesanmu di sini…" />
        </div>

        {/* Footer */}
        <div className="text-center">
          <button
            onClick={() => window.history.back()}
            className="text-sm text-white/50 hover:text-violet-400 transition-colors font-body"
          >
            ← Kembali ke menu SPLDV
          </button>
        </div>
      </div>
    </div>
    </PageCtx.Provider>
  );
};

export default MetodeCampuranLKPDPage;
