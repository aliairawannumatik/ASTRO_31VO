import { useState, createContext, useContext, useCallback, useRef } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { ChevronDown, ChevronUp, Lightbulb, BookOpen, Minus } from "lucide-react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ─── helpers ─────────────────────────────────────────────── */
function normalize(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}
function checkAnswer(val: string, accepted: string[]): boolean {
  const n = normalize(val);
  return accepted.some((a) => normalize(a) === n);
}

/* ─── SVG fruit helpers ────────────────────────────────────── */
function Apple({ size = 34 }: { size?: number }) {
  const h = Math.round(size * 1.22);
  return (
    <svg width={size} height={h} viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 5 C18 2 23 1 22 5" stroke="#5a3825" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="22" cy="4" rx="5" ry="2.5" fill="#16a34a" transform="rotate(-25 22 4)"/>
      <path d="M17 8 C6 8 2 16 2 23 C2 33 8 41 17 41 C26 41 32 33 32 23 C32 16 28 8 17 8Z" fill="#ef4444"/>
      <path d="M17 8 C14 8 11 10 10 12 C12 10 15 9 17 9 C19 9 22 10 24 12 C23 10 20 8 17 8Z" fill="#dc2626"/>
      <ellipse cx="10" cy="19" rx="3.5" ry="2.5" fill="#fca5a5" opacity="0.45"/>
    </svg>
  );
}
function Banana({ size = 52 }: { size?: number }) {
  const h = Math.round(size * 0.52);
  return (
    <svg width={size} height={h} viewBox="0 0 52 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 22 Q18 4 36 5 Q47 6 48 14" stroke="#a16207" strokeWidth="9" fill="none" strokeLinecap="round"/>
      <path d="M4 22 Q18 4 36 5 Q47 6 48 14" stroke="#fde047" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <path d="M5 21 Q19 6 37 7 Q46 8 47 14" stroke="#fef9c3" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
      <circle cx="4" cy="22" r="3" fill="#7c2d12"/>
      <circle cx="48" cy="14" r="3" fill="#7c2d12"/>
    </svg>
  );
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

  /* Kasus 3 – 2x + y = 5 dan 3x – 2y = 11 */
  k3_r1a: ["4x"], k3_r1b: ["2y"], k3_r1c: ["10"],
  k3_r2a: ["3x"], k3_r2b: ["2y"], k3_r2c: ["11"],
  k3_resl_x: ["7x"], k3_resr_x: ["21"], k3_xval: ["3","x = 3"],
  k3_r3a: ["6x"], k3_r3b: ["3y"], k3_r3c: ["15"],
  k3_r4a: ["6x"], k3_r4b: ["4y"], k3_r4c: ["22"],
  k3_resl_y: ["7y"], k3_resr_y: ["-7","−7"], k3_yval: ["-1","−1","y = -1","y = −1"],
  k3_xfinal: ["3"], k3_yfinal: ["-1","−1"],
  k3_cek1a: ["3"], k3_cek1b: ["-1","−1"], k3_cek1c: ["5"],
  k3_cek2a: ["3"], k3_cek2b: ["-1","−1"], k3_cek2c: ["11"],

  /* Kasus 4 – Kontekstual Buah (same, all blanks incl. model) */
  k4_vara: ["a", "x"],
  k4_varb: ["b", "y"],
  k4_coef1a: ["4"], k4_coef1b: ["2"], k4_rhs1: ["12.500","12500"],
  k4_coef2a: ["3"], k4_coef2b: ["1"], k4_rhs2: ["9.000","9000"],
  k4_e1a: ["4a"], k4_e1b: ["2b"], k4_e1c: ["12.500","12500"],
  k4_e2a: ["6a"], k4_e2b: ["2b"], k4_e2c: ["18.000","18000"],
  k4_resl_a: ["2a"], k4_resr_a: ["5.500","5500"], k4_aval: ["2.750","2750"],
  k4_e3a: ["12a"], k4_e3b: ["6b"], k4_e3c: ["37.500","37500"],
  k4_e4a: ["12a"], k4_e4b: ["4b"], k4_e4c: ["36.000","36000"],
  k4_resl_b: ["2b"], k4_resr_b: ["1.500","1500"], k4_bval: ["750"],
  k4_afinal: ["2.750","2750"], k4_bfinal: ["750"],
  k4_cek1a: ["2.750","2750"], k4_cek1b: ["750"], k4_cek1c: ["12.500","12500"],
  k4_cek2a: ["2.750","2750"], k4_cek2b: ["750"], k4_cek2c: ["9.000","9000"],
  k4_jawab: ["6.250","6250","Rp 6.250","Rp 6250"],

  /* Kasus 2 – Eliminasi (2x − y = 4 dan x + y = 5) */
  k2_r1a: ["2x"],
  k2_r1b: ["y"],
  k2_r1c: ["4"],
  k2_r2a: ["x"],
  k2_r2b: ["y"],
  k2_r2c: ["5"],
  k2_resl_x: ["3x"],
  k2_resr_x: ["9"],
  k2_xhasil: ["3"],
  k2_r3a: ["2x"],
  k2_r3b: ["y"],
  k2_r3c: ["4"],
  k2_r4a: ["2x"],
  k2_r4b: ["2y"],
  k2_r4c: ["10"],
  k2_resl_y: ["3y"],
  k2_resr_y: ["6"],
  k2_ynilai: ["2"],
  k2_xfinal: ["3"],
  k2_yfinal: ["2"],
  k2_cek1a: ["3"],
  k2_cek1b: ["2"],
  k2_cek1c: ["4"],
  k2_cek2a: ["3"],
  k2_cek2b: ["2"],
  k2_cek2c: ["5"],
};

const SECTIONS: Record<string, string[]> = {
  a: ["a1","a2","a3","a4"],
  k1step1: ["k1_r1a","k1_r1b","k1_r1c","k1_r2a","k1_r2b","k1_r2c","k1_resl","k1_resr","k1_ynilai","k1_xfinal","k1_yfinal"],
  k1step2: ["k1_cek1a","k1_cek1b","k1_cek1c","k1_cek2a","k1_cek2b","k1_cek2c"],
  k2step1: ["k2_r1a","k2_r1b","k2_r1c","k2_r2a","k2_r2b","k2_r2c","k2_resl_x","k2_resr_x","k2_xhasil","k2_r3a","k2_r3b","k2_r3c","k2_r4a","k2_r4b","k2_r4c","k2_resl_y","k2_resr_y","k2_ynilai","k2_xfinal","k2_yfinal"],
  k2step2: ["k2_cek1a","k2_cek1b","k2_cek1c","k2_cek2a","k2_cek2b","k2_cek2c"],
  k3step1: ["k3_r1a","k3_r1b","k3_r1c","k3_r2a","k3_r2b","k3_r2c","k3_resl_x","k3_resr_x","k3_xval","k3_r3a","k3_r3b","k3_r3c","k3_r4a","k3_r4b","k3_r4c","k3_resl_y","k3_resr_y","k3_yval","k3_xfinal","k3_yfinal"],
  k3step2: ["k3_cek1a","k3_cek1b","k3_cek1c","k3_cek2a","k3_cek2b","k3_cek2c"],
  k4model: ["k4_vara","k4_varb","k4_coef1a","k4_coef1b","k4_rhs1","k4_coef2a","k4_coef2b","k4_rhs2"],
  k4step1: ["k4_e1a","k4_e1b","k4_e1c","k4_e2a","k4_e2b","k4_e2c","k4_resl_a","k4_resr_a","k4_aval","k4_e3a","k4_e3b","k4_e3c","k4_e4a","k4_e4b","k4_e4c","k4_resl_b","k4_resr_b","k4_bval","k4_afinal","k4_bfinal"],
  k4step2: ["k4_cek1a","k4_cek1b","k4_cek1c","k4_cek2a","k4_cek2b","k4_cek2c"],
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
  const [materiOpen, setMateriOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(["ide"]);
  const toggleMateriSection = (id: string) =>
    setOpenSections((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

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
          <p className="font-display text-xs font-bold tracking-widest text-cyan-300 uppercase mb-1">Lembar Kerja Peserta Didik (LKPD 2)</p>
          <h1 className="font-display text-xl md:text-2xl font-black text-white mb-2 drop-shadow-lg">Penyelesaian SPLDV Menggunakan Metode Eliminasi</h1>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-body text-white/70">
            <p>Mata Pelajaran: <span className="text-white font-bold">Matematika</span></p>
            <p>Kelas / Semester: <span className="text-white font-bold">VIII / I</span></p>
            <p>Alokasi Waktu: <span className="text-white font-bold">2 × 40 menit</span></p>
            <p>Satuan Pendidikan: <span className="text-white font-bold">SMP</span></p>
          </div>
          <p className="mt-3 text-sm text-white/80 font-body leading-relaxed text-left">
            <span className="text-cyan-300 font-bold">Tujuan Pembelajaran :</span> Peserta didik dapat menyelesaikan sistem persamaan linear dua variabel dengan metode eliminasi untuk penyelesaian masalah.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════
             PANDUAN MATERI — COLLAPSIBLE
        ══════════════════════════════════════════════════════ */}
        <div className="mb-6">
          <button
            onClick={() => setMateriOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-yellow-400/60 bg-gradient-to-r from-yellow-600/30 via-amber-600/20 to-orange-600/20 shadow-[0_0_24px_rgba(234,179,8,0.2)] hover:opacity-90 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <div className="text-left">
                <p className="font-display text-sm font-black text-yellow-200 tracking-wide uppercase">Panduan Materi — Metode Eliminasi</p>
                <p className="font-body text-xs text-yellow-300/70 mt-0.5">{materiOpen ? "Tutup panduan materi" : "Buka untuk membaca teori sebelum mengerjakan"}</p>
              </div>
            </div>
            {materiOpen
              ? <ChevronUp className="w-5 h-5 text-yellow-300 shrink-0" />
              : <ChevronDown className="w-5 h-5 text-yellow-300 shrink-0" />}
          </button>

          {materiOpen && (
            <div className="mt-3 rounded-2xl border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-950/60 via-amber-950/50 to-orange-950/40 overflow-hidden">

              {/* ── Sub-section: Ide Dasar ── */}
              <div className="border-b border-yellow-400/20">
                <button
                  onClick={() => toggleMateriSection("ide")}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span className="font-body text-sm font-semibold text-white">🌟 Ide Dasar Metode Eliminasi</span>
                  </div>
                  {openSections.includes("ide") ? <ChevronUp className="w-4 h-4 text-yellow-300" /> : <ChevronDown className="w-4 h-4 text-yellow-300" />}
                </button>
                {openSections.includes("ide") && (
                  <div className="px-5 pb-5 space-y-4">
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      Kata "eliminasi" berasal dari bahasa Latin yang berarti <strong className="text-cyan-300">menghilangkan</strong> atau <strong className="text-cyan-300">mengeliminasi</strong>. Ide utama metode ini: kita <em>menghapus</em> salah satu variabel dari sistem persamaan dengan cara menjumlahkan atau mengurangkan kedua persamaan, sehingga tersisa hanya satu variabel yang bisa langsung diselesaikan.
                    </p>
                    <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4">
                      <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-3">🔄 Prinsip Dasar Eliminasi</p>
                      <div className="space-y-2 text-sm font-body text-white/80">
                        <div className="bg-slate-800/60 border border-cyan-500/10 rounded-lg px-3 py-2">
                          <p className="text-cyan-300 font-semibold mb-1">Koefisien SAMA dan BERTANDA SAMA → Kurangkan</p>
                          <BlockMath math="(ax + by) - (ax + cy) = d - e \;\Rightarrow\; (b-c)y = d - e" />
                        </div>
                        <div className="bg-slate-800/60 border border-violet-500/10 rounded-lg px-3 py-2">
                          <p className="text-violet-300 font-semibold mb-1">Koefisien SAMA dan BERTANDA BERBEDA → Jumlahkan</p>
                          <BlockMath math="(ax + by) + (ax - by) = d + e \;\Rightarrow\; 2ax = d + e" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { icon: "1️⃣", title: "Samakan Koefisien", desc: "Kalikan salah satu atau kedua persamaan agar koefisien variabel yang akan dieliminasi menjadi sama.", color: "border-cyan-500/30 bg-cyan-900/10" },
                        { icon: "2️⃣", title: "Eliminasi Variabel", desc: "Jumlahkan atau kurangkan kedua persamaan untuk menghilangkan satu variabel.", color: "border-violet-500/30 bg-violet-900/10" },
                        { icon: "3️⃣", title: "Selesaikan & Cari Variabel Lain", desc: "Selesaikan persamaan satu variabel, lalu eliminasi variabel lain untuk mendapat nilai lengkap.", color: "border-green-500/30 bg-green-900/10" },
                      ].map(({ icon, title, desc, color }) => (
                        <div key={title} className={`border ${color} rounded-xl p-3 text-center`}>
                          <p className="text-2xl mb-1">{icon}</p>
                          <p className="font-display text-sm font-bold text-white mb-1">{title}</p>
                          <p className="font-body text-xs text-white/60">{desc}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                      <p className="font-body text-sm text-yellow-200">
                        <strong>Keunggulan Eliminasi:</strong> Sangat efektif ketika koefisien variabel sudah sama atau bisa disamakan dengan perkalian sederhana. Tidak perlu menyatakan satu variabel secara eksplisit seperti metode substitusi!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Sub-section: Langkah-Langkah ── */}
              <div className="border-b border-yellow-400/20">
                <button
                  onClick={() => toggleMateriSection("langkah")}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Minus className="w-4 h-4 text-red-400" />
                    <span className="font-body text-sm font-semibold text-white">📘 Langkah-Langkah Metode Eliminasi</span>
                  </div>
                  {openSections.includes("langkah") ? <ChevronUp className="w-4 h-4 text-yellow-300" /> : <ChevronDown className="w-4 h-4 text-yellow-300" />}
                </button>
                {openSections.includes("langkah") && (
                  <div className="px-5 pb-5 space-y-4">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <p className="font-body text-sm font-semibold text-red-300 mb-2">🎯 Ringkasan Intisari</p>
                      <p className="font-body text-sm text-white/80 leading-relaxed">
                        Metode eliminasi "menghapus" satu variabel dengan membuat koefisiennya sama di kedua persamaan, lalu menjumlahkan atau mengurangkan. Proses ini dilakukan dua kali — sekali untuk mencari <InlineMath math="x" />, sekali untuk mencari <InlineMath math="y" />.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="font-body text-sm font-bold text-white">📋 5 Langkah Sistematis</p>
                      {[
                        { no: "1", title: "Tulis kedua persamaan sejajar", color: "border-cyan-500/30 bg-cyan-900/10", body: <p className="text-white/70 text-xs">Pastikan kedua persamaan sudah dalam bentuk standar <InlineMath math="ax + by = c" /> dan tuliskan satu di atas yang lain.</p> },
                        { no: "2", title: "Pilih variabel yang akan dieliminasi", color: "border-violet-500/30 bg-violet-900/10", body: <p className="text-white/70 text-xs">Pilih variabel yang paling mudah disamakan koefisiennya. Kalikan salah satu atau kedua persamaan dengan bilangan yang tepat.</p> },
                        { no: "3", title: "Samakan koefisien variabel yang dipilih", color: "border-green-500/30 bg-green-900/10", body: <p className="text-white/70 text-xs">Setelah perkalian, koefisien variabel yang dipilih harus sama besar di kedua persamaan.</p> },
                        { no: "4", title: "Kurangkan atau jumlahkan kedua persamaan", color: "border-orange-500/30 bg-orange-900/10", body: <p className="text-white/70 text-xs">Koefisien bertanda sama → kurangkan. Bertanda berbeda → jumlahkan. Variabel yang dipilih akan lenyap!</p> },
                        { no: "5", title: "Eliminasi variabel lain untuk nilai lengkap", color: "border-yellow-500/30 bg-yellow-900/10", body: <p className="text-white/70 text-xs">Ulangi proses eliminasi, kali ini hapus variabel yang sudah ditemukan nilainya untuk mendapat variabel satunya.</p> },
                      ].map(({ no, title, color, body }) => (
                        <div key={no} className={`border ${color} rounded-xl p-3`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-display text-sm font-bold text-white bg-white/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0">{no}</span>
                            <p className="font-body text-sm font-semibold text-white">{title}</p>
                          </div>
                          <div className="pl-8">{body}</div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-slate-800/40 border border-yellow-500/20 rounded-xl p-3 space-y-2">
                      <p className="font-body text-sm font-bold text-yellow-300">⚡ Kapan Pilih Eliminasi vs Substitusi?</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-body border-collapse">
                          <thead>
                            <tr className="bg-yellow-900/40">
                              <th className="border border-yellow-500/30 px-3 py-1 text-yellow-200 text-left">Kondisi SPLDV</th>
                              <th className="border border-yellow-500/30 px-3 py-1 text-yellow-200 text-center">Pilih</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              ["Ada variabel berkoefisien 1", "Substitusi (lebih cepat)"],
                              ["Koefisien variabel sama di kedua persamaan", "Eliminasi (langsung)"],
                              ["Semua koefisien besar, tidak ada yang 1", "Eliminasi (lebih efisien)"],
                              ["Persamaan sudah dalam bentuk y = mx + c", "Substitusi (tanpa perlu isolasi)"],
                            ].map(([kondisi, pilih], i) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                                <td className="border border-white/10 px-3 py-1 text-white/70">{kondisi}</td>
                                <td className="border border-white/10 px-3 py-1 text-center text-cyan-300 font-semibold">{pilih}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Sub-section: Contoh Soal ── */}
              <div className="border-b border-yellow-400/20">
                <button
                  onClick={() => toggleMateriSection("contoh")}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-base">🎯</span>
                    <span className="font-body text-sm font-semibold text-white">📝 Contoh Soal &amp; Pembahasan</span>
                  </div>
                  {openSections.includes("contoh") ? <ChevronUp className="w-4 h-4 text-yellow-300" /> : <ChevronDown className="w-4 h-4 text-yellow-300" />}
                </button>
                {openSections.includes("contoh") && (
                  <div className="px-5 pb-5 space-y-6">

                    {/* Soal 1 — Mudah */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold font-body bg-green-700/60 text-green-200">MUDAH</span>
                        <p className="font-body text-sm font-semibold text-white">Soal 1</p>
                      </div>
                      <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                        <p className="font-body text-sm text-white/90">
                          Selesaikan SPLDV berikut dengan metode eliminasi:<br />
                          <InlineMath math="3x + y = 7" /> dan <InlineMath math="x + y = 3" />
                        </p>
                      </div>
                      <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-4">
                        <p className="font-body text-xs font-bold text-green-300 uppercase">✅ Pembahasan</p>
                        <div>
                          <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 1 — Eliminasi variabel <InlineMath math="y" /> untuk mencari <InlineMath math="x" />:</strong></p>
                          <p className="font-body text-xs text-white/60 mb-2">Koefisien <InlineMath math="y" /> di kedua persamaan sudah sama (= 1) dan bertanda sama → kurangkan.</p>
                          <div className="bg-slate-800/50 rounded-lg px-4 py-3 space-y-1 text-sm font-body">
                            <div className="flex items-center gap-2">
                              <span className="text-white/40 w-4">P1</span>
                              <span className="text-white font-mono">3x + y = 7</span>
                            </div>
                            <div className="flex items-center gap-2 border-b border-white/20 pb-1">
                              <span className="text-white/40 w-4">P2</span>
                              <span className="text-white font-mono">x + y = 3</span>
                              <span className="text-red-400 ml-auto text-xs">(dikurangkan)</span>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-white/40 w-4"></span>
                              <span className="text-cyan-300 font-mono font-bold">2x = 4</span>
                            </div>
                          </div>
                          <BlockMath math="2x = 4 \;\Rightarrow\; x = 2" />
                        </div>
                        <div>
                          <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 2 — Eliminasi variabel <InlineMath math="x" /> untuk mencari <InlineMath math="y" />:</strong></p>
                          <p className="font-body text-xs text-white/60 mb-2">Kalikan P2 dengan 3 agar koefisien <InlineMath math="x" /> sama, lalu kurangkan.</p>
                          <div className="bg-slate-800/50 rounded-lg px-4 py-3 space-y-1 text-sm font-body">
                            <div className="flex items-center gap-2">
                              <span className="text-white/40 w-8">P1</span>
                              <span className="text-white font-mono">3x + y = 7</span>
                            </div>
                            <div className="flex items-center gap-2 border-b border-white/20 pb-1">
                              <span className="text-white/40 w-8">P2×3</span>
                              <span className="text-white font-mono">3x + 3y = 9</span>
                              <span className="text-red-400 ml-auto text-xs">(dikurangkan)</span>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-white/40 w-8"></span>
                              <span className="text-cyan-300 font-mono font-bold">−2y = −2</span>
                            </div>
                          </div>
                          <BlockMath math="-2y = -2 \;\Rightarrow\; y = 1" />
                        </div>
                        <div>
                          <p className="font-body text-sm text-white/80 mb-1"><strong>Langkah 3 — Verifikasi:</strong></p>
                          <BlockMath math="P1: 3(2) + 1 = 7 \checkmark \quad P2: 2 + 1 = 3 \checkmark" />
                        </div>
                        <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                          <p className="font-body text-xs text-green-300">🔑 Solusi: <InlineMath math="x = 2,\ y = 1" /></p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/10" />

                    {/* Soal 2 — Sedang */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold font-body bg-yellow-700/60 text-yellow-200">SEDANG</span>
                        <p className="font-body text-sm font-semibold text-white">Soal 2</p>
                      </div>
                      <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                        <p className="font-body text-sm text-white/90">
                          Selesaikan dengan metode eliminasi:<br />
                          <InlineMath math="2x + 3y = 16" /> dan <InlineMath math="5x - 2y = 2" />
                        </p>
                      </div>
                      <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-4">
                        <p className="font-body text-xs font-bold text-yellow-300 uppercase">✅ Pembahasan</p>
                        <p className="font-body text-xs text-white/60">Koefisien tidak ada yang sama — perlu perkalian dulu sebelum eliminasi.</p>
                        <div>
                          <p className="font-body text-sm text-white/80 mb-1"><strong>Eliminasi <InlineMath math="y" /> → cari <InlineMath math="x" />:</strong></p>
                          <p className="font-body text-xs text-white/60 mb-2">KPK dari 3 dan 2 adalah 6. Kalikan P1 × 2 dan P2 × 3.</p>
                          <div className="bg-slate-800/50 rounded-lg px-4 py-3 space-y-1 text-sm font-body">
                            <div className="flex items-center gap-2">
                              <span className="text-white/40 w-8 shrink-0">P1×2</span>
                              <span className="text-white font-mono">4x + 6y = 32</span>
                            </div>
                            <div className="flex items-center gap-2 border-b border-white/20 pb-1">
                              <span className="text-white/40 w-8 shrink-0">P2×3</span>
                              <span className="text-white font-mono">15x − 6y = 6</span>
                              <span className="text-green-400 ml-auto text-xs">(dijumlahkan)</span>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-white/40 w-8 shrink-0"></span>
                              <span className="text-cyan-300 font-mono font-bold">19x = 38</span>
                            </div>
                          </div>
                          <BlockMath math="x = 2" />
                        </div>
                        <div>
                          <p className="font-body text-sm text-white/80 mb-1"><strong>Eliminasi <InlineMath math="x" /> → cari <InlineMath math="y" />:</strong></p>
                          <p className="font-body text-xs text-white/60 mb-2">KPK dari 2 dan 5 adalah 10. Kalikan P1 × 5 dan P2 × 2.</p>
                          <div className="bg-slate-800/50 rounded-lg px-4 py-3 space-y-1 text-sm font-body">
                            <div className="flex items-center gap-2">
                              <span className="text-white/40 w-8 shrink-0">P1×5</span>
                              <span className="text-white font-mono">10x + 15y = 80</span>
                            </div>
                            <div className="flex items-center gap-2 border-b border-white/20 pb-1">
                              <span className="text-white/40 w-8 shrink-0">P2×2</span>
                              <span className="text-white font-mono">10x − 4y = 4</span>
                              <span className="text-red-400 ml-auto text-xs">(dikurangkan)</span>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-white/40 w-8 shrink-0"></span>
                              <span className="text-cyan-300 font-mono font-bold">19y = 76</span>
                            </div>
                          </div>
                          <BlockMath math="y = 4" />
                        </div>
                        <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                          <p className="font-body text-xs text-yellow-300">💡 Solusi: <InlineMath math="x = 2,\ y = 4" />. Ingat: tanda berbeda → jumlahkan, tanda sama → kurangkan!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Sub-section: Rangkuman ── */}
              <div>
                <button
                  onClick={() => toggleMateriSection("rangkuman")}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="font-body text-sm font-semibold text-white">📋 Rangkuman</span>
                  </div>
                  {openSections.includes("rangkuman") ? <ChevronUp className="w-4 h-4 text-yellow-300" /> : <ChevronDown className="w-4 h-4 text-yellow-300" />}
                </button>
                {openSections.includes("rangkuman") && (
                  <div className="px-5 pb-5 space-y-3">
                    <div className="grid grid-cols-1 gap-2 font-body text-sm">
                      {[
                        { poin: "Metode eliminasi menghilangkan satu variabel dengan menyamakan koefisiennya, lalu menjumlahkan atau mengurangkan kedua persamaan.", icon: "🗑️" },
                        { poin: "Koefisien sama, tanda sama → kurangkan. Koefisien sama, tanda berbeda → jumlahkan.", icon: "➕➖" },
                        { poin: "Lakukan proses eliminasi dua kali: sekali untuk x, sekali untuk y.", icon: "🔁" },
                        { poin: "Sederhanakan persamaan di awal (bagi dengan faktor persekutuan) untuk mempermudah perhitungan.", icon: "✂️" },
                        { poin: "Selalu verifikasi solusi ke KEDUA persamaan awal untuk memastikan kebenaran jawaban.", icon: "✅" },
                      ].map(({ poin, icon }) => (
                        <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                          <span className="text-lg shrink-0">{icon}</span>
                          <p className="text-white/80">{poin}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mt-2">
                      <p className="font-body text-xs text-center text-red-300 font-bold mb-1">Inti Metode Eliminasi</p>
                      <BlockMath math="\text{Samakan koefisien} \;\xrightarrow{+\text{ atau }-}\; \text{variabel lenyap} \;\Rightarrow\; \text{selesaikan}" />
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
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

          {/* Eliminasi 1 — mencari y */}
          <div className="mt-4 rounded-xl bg-cyan-900/40 border border-cyan-400/30 p-4">
            <p className="text-sm font-bold text-cyan-300 mb-3">
              ① Eliminasi variabel <span className="text-yellow-300 text-base font-mono font-black">x</span> → cari nilai <span className="text-yellow-300 text-base font-mono font-black">y</span>
              <span className="text-white/50 font-normal ml-2">(kedua persamaan dikurangkan)</span>
            </p>
            <div className="bg-blue-950/50 rounded-xl p-3 border border-blue-400/20 font-mono text-base">
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
                <span className="text-emerald-300 font-black text-lg">4 <span className="text-white/50 text-xs ml-2 font-normal">← variabel <span className="text-yellow-300">x</span> tereliminasi</span></span>
                <span className="w-6"> </span>
                <span className="text-right text-yellow-300 font-black text-xl">y</span>
                <span className="text-white/60 px-1">=</span>
                <span className="text-yellow-300 font-black text-xl">2 <span className="text-white/50 text-xs ml-2 font-normal">← bagi kedua ruas dengan 2</span></span>
              </div>
            </div>
          </div>

          {/* Eliminasi 2 — mencari x */}
          <div className="mt-4 rounded-xl bg-emerald-900/40 border border-emerald-400/30 p-4">
            <p className="text-sm font-bold text-emerald-300 mb-3">
              ② Eliminasi variabel <span className="text-yellow-300 text-base font-mono font-black">y</span> → cari nilai <span className="text-yellow-300 text-base font-mono font-black">x</span>
              <span className="text-white/50 font-normal ml-2">(kedua persamaan dijumlahkan)</span>
            </p>
            <div className="bg-emerald-950/50 rounded-xl p-3 border border-emerald-400/20 font-mono text-base">
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-1 items-center">
                <span className="w-6 text-right text-white/30 text-sm"> </span>
                <span className="text-right text-white"><span className="text-yellow-300 font-bold text-lg">x</span> + <span className="text-yellow-300 font-bold text-lg">y</span></span>
                <span className="text-white/60 px-1">=</span>
                <span className="text-white font-bold">5 <span className="text-white/40 text-xs ml-2">… (1)</span></span>
                <span className="w-6 text-right text-emerald-400 font-black text-xl leading-none">+</span>
                <span className="text-right text-white"><span className="text-yellow-300 font-bold text-lg">x</span> − <span className="text-yellow-300 font-bold text-lg">y</span></span>
                <span className="text-white/60 px-1">=</span>
                <span className="text-white font-bold">1 <span className="text-white/40 text-xs ml-2">… (2)</span></span>
              </div>
              <div className="border-t-2 border-emerald-400/60 my-2" />
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-1 items-center">
                <span className="w-6"> </span>
                <span className="text-right text-emerald-300 font-black text-lg">2<span className="text-yellow-300">x</span></span>
                <span className="text-white/60 px-1">=</span>
                <span className="text-emerald-300 font-black text-lg">6 <span className="text-white/50 text-xs ml-2 font-normal">← variabel <span className="text-yellow-300">y</span> tereliminasi</span></span>
                <span className="w-6"> </span>
                <span className="text-right text-yellow-300 font-black text-xl">x</span>
                <span className="text-white/60 px-1">=</span>
                <span className="text-yellow-300 font-black text-xl">3 <span className="text-white/50 text-xs ml-2 font-normal">← bagi kedua ruas dengan 2</span></span>
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
        <SectionHeader label="Kasus 1 Penyelesaian SPLDV Menggunakan Metode Eliminasi" color="cyan" />

        <div className="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-900/50 to-indigo-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-blue-200/80 mb-3">Tentukan himpunan penyelesaian dari:</p>
          <div className="font-mono my-3 bg-blue-950/60 rounded-xl p-4 border border-blue-400/30 flex flex-col items-center">
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 items-center text-xl font-bold text-white">
              <span className="text-right">2<span className="text-yellow-300">x</span> + <span className="text-yellow-300">y</span></span>
              <span className="text-white/70">=</span>
              <span>8</span>
              <span className="text-right"><span className="text-yellow-300">x</span> − <span className="text-yellow-300">y</span></span>
              <span className="text-white/70">=</span>
              <span>10</span>
            </div>
            <p className="text-blue-300/60 text-sm mt-2">untuk <span className="text-yellow-300 font-bold">x</span>, <span className="text-yellow-300 font-bold">y</span> ∈ ℝ</p>
          </div>

          {/* Langkah ① — Eliminasi y → cari x */}
          <div className="mt-4 rounded-xl bg-cyan-900/40 border border-cyan-400/30 p-4">
            <p className="text-sm font-bold text-cyan-300 mb-3">
              ① Eliminasi variabel <span className="text-yellow-300 text-base font-mono font-black">y</span> → cari nilai <span className="text-yellow-300 text-base font-mono font-black">x</span>
              <span className="text-white/50 font-normal ml-2">(koefisien y berlawanan tanda → jumlahkan)</span>
            </p>
            <div className="bg-cyan-950/50 rounded-xl p-3 border border-cyan-400/20 font-mono text-base">
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-1 items-center">
                <span className="w-6 text-right text-white/30 text-sm"> </span>
                <span className="text-right text-white">2<span className="text-yellow-300 font-bold text-lg">x</span> + <span className="text-yellow-300 font-bold text-lg">y</span></span>
                <span className="text-white/60 px-1">=</span>
                <span className="text-white font-bold">8 <span className="text-white/40 text-xs ml-2">… (1)</span></span>
                <span className="w-6 text-right text-emerald-400 font-black text-xl leading-none">+</span>
                <span className="text-right text-white"><span className="text-yellow-300 font-bold text-lg">x</span> − <span className="text-yellow-300 font-bold text-lg">y</span></span>
                <span className="text-white/60 px-1">=</span>
                <span className="text-white font-bold">10 <span className="text-white/40 text-xs ml-2">… (2)</span></span>
              </div>
              <div className="border-t-2 border-cyan-400/60 my-2" />
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-1 items-center">
                <span className="w-6"> </span>
                <span className="text-right text-emerald-300 font-black text-lg">3<span className="text-yellow-300">x</span></span>
                <span className="text-white/60 px-1">=</span>
                <span className="text-emerald-300 font-black text-lg">18 <span className="text-white/50 text-xs ml-2 font-normal">← variabel <span className="text-yellow-300">y</span> tereliminasi</span></span>
                <span className="w-6"> </span>
                <span className="text-right text-yellow-300 font-black text-xl">x</span>
                <span className="text-white/60 px-1">=</span>
                <span className="flex items-center gap-2"><B id="k1_xfinal" w="w-14" /><span className="text-white/50 text-xs font-normal">← bagi kedua ruas dengan 3</span></span>
              </div>
            </div>
          </div>

          {/* Langkah ② — Eliminasi x → cari y */}
          <div className="mt-4 rounded-xl bg-emerald-900/40 border border-emerald-400/30 p-4">
            <p className="text-sm font-bold text-emerald-300 mb-3">
              ② Eliminasi variabel <span className="text-yellow-300 text-base font-mono font-black">x</span> → cari nilai <span className="text-yellow-300 text-base font-mono font-black">y</span>
              <span className="text-white/50 font-normal ml-2">(koefisien x belum sama, KPK = 2 → kalikan persamaan 2 dengan 2)</span>
            </p>
            <div className="bg-emerald-950/50 rounded-xl p-3 border border-emerald-400/20 font-mono text-base">
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-2 items-center">
                <span className="text-white/50 text-xs whitespace-nowrap">2<span className="text-yellow-300">x</span> + <span className="text-yellow-300">y</span> = 8 × 1</span>
                <span className="text-right flex items-center gap-1"><B id="k1_r1a" w="w-12" /> +&#8202;<B id="k1_r1b" w="w-10" /></span>
                <span className="text-white/60 px-1">=</span>
                <span><B id="k1_r1c" w="w-10" /></span>
                <span className="text-white/50 text-xs whitespace-nowrap"><span className="text-yellow-300">x</span> − <span className="text-yellow-300">y</span> = 10 × 2</span>
                <span className="text-right flex items-center gap-1"><B id="k1_r2a" w="w-12" /> −&#8202;<B id="k1_r2b" w="w-12" /></span>
                <span className="text-white/60 px-1">=</span>
                <span><B id="k1_r2c" w="w-10" /></span>
              </div>
              <div className="border-t border-white/20 my-2" />
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-1 items-center">
                <span className="w-6 text-right text-white/40 text-sm">−</span>
                <span className="text-right"><B id="k1_resl" w="w-14" /></span>
                <span className="text-white/60 px-1">=</span>
                <span className="flex items-center gap-2"><B id="k1_resr" w="w-14" /><span className="text-white/40 text-xs font-normal">← variabel <span className="text-yellow-300">x</span> tereliminasi</span></span>
                <span className="w-6"> </span>
                <span className="text-right text-yellow-300 font-black text-xl">y</span>
                <span className="text-white/60 px-1">=</span>
                <span className="flex items-center gap-2"><B id="k1_ynilai" w="w-14" /><span className="text-white/40 text-xs font-normal">← bagi kedua ruas</span></span>
              </div>
            </div>
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
                <span className="text-white/50 font-body text-sm">(hasil harus 8)</span>
              </p>
              <p className="flex flex-wrap items-center gap-2">
                <span className="text-amber-300 font-bold text-sm">Persamaan 2 :</span>
                <B id="k1_cek2a" w="w-10" /> − (<B id="k1_cek2b" w="w-10" />) = <B id="k1_cek2c" w="w-10" />
                <span className="text-white/50 font-body text-sm">(hasil harus 10)</span>
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


        {/* ══════════════════════════════════════════════════════
             KASUS 2 — METODE ELIMINASI
        ══════════════════════════════════════════════════════ */}
        <SectionHeader label="Kasus 2 Penyelesaian SPLDV Menggunakan Metode Eliminasi" color="emerald" />

        <div className="rounded-2xl border-2 border-emerald-400/40 bg-gradient-to-br from-emerald-900/50 to-teal-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-emerald-200/80 mb-3">Tentukan himpunan penyelesaian dari:</p>
          <div className="font-mono my-3 bg-emerald-950/60 rounded-xl p-4 border border-emerald-400/30 flex flex-col items-center">
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 items-center text-xl font-bold text-white">
              <span className="text-right">2<span className="text-yellow-300">x</span> − <span className="text-yellow-300">y</span></span>
              <span className="text-white/70">=</span>
              <span>4</span>
              <span className="text-right"><span className="text-yellow-300">x</span> + <span className="text-yellow-300">y</span></span>
              <span className="text-white/70">=</span>
              <span>5</span>
            </div>
            <p className="text-emerald-300/60 text-sm mt-2">untuk <span className="text-yellow-300 font-bold">x</span>, <span className="text-yellow-300 font-bold">y</span> ∈ ℝ</p>
          </div>

          {/* Langkah ① — Eliminasi y → cari x */}
          <div className="mt-4 rounded-xl bg-teal-900/40 border border-teal-400/30 p-4">
            <p className="text-sm font-bold text-teal-300 mb-3">
              ① Eliminasi variabel <span className="text-yellow-300 text-base font-mono font-black">y</span> → cari nilai <span className="text-yellow-300 text-base font-mono font-black">x</span>
              <span className="text-white/50 font-normal ml-2">(koefisien y berlawanan tanda: −1 dan +1 → jumlahkan)</span>
            </p>
            <div className="bg-teal-950/50 rounded-xl p-3 border border-teal-400/20 font-mono text-base">
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-1 items-center">
                <span className="w-6 text-right text-white/30 text-sm"> </span>
                <span className="text-right text-white">2<span className="text-yellow-300 font-bold text-lg">x</span> − <span className="text-yellow-300 font-bold text-lg">y</span></span>
                <span className="text-white/60 px-1">=</span>
                <span className="text-white font-bold">4 <span className="text-white/40 text-xs ml-2">… (1)</span></span>
                <span className="w-6 text-right text-emerald-400 font-black text-xl leading-none">+</span>
                <span className="text-right text-white"><span className="text-yellow-300 font-bold text-lg">x</span> + <span className="text-yellow-300 font-bold text-lg">y</span></span>
                <span className="text-white/60 px-1">=</span>
                <span className="text-white font-bold">5 <span className="text-white/40 text-xs ml-2">… (2)</span></span>
              </div>
              <div className="border-t-2 border-teal-400/60 my-2" />
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-1 items-center">
                <span className="w-6"> </span>
                <span className="text-right text-emerald-300 font-black text-lg">3<span className="text-yellow-300">x</span></span>
                <span className="text-white/60 px-1">=</span>
                <span className="text-emerald-300 font-black text-lg">9 <span className="text-white/50 text-xs ml-2 font-normal">← variabel <span className="text-yellow-300">y</span> tereliminasi</span></span>
                <span className="w-6"> </span>
                <span className="text-right text-yellow-300 font-black text-xl">x</span>
                <span className="text-white/60 px-1">=</span>
                <span className="text-yellow-300 font-black text-xl">3 <span className="text-white/50 text-xs ml-2 font-normal">← bagi kedua ruas dengan 3</span></span>
              </div>
            </div>
          </div>

          {/* Langkah ② — Eliminasi x → cari y */}
          <div className="mt-4 rounded-xl bg-emerald-900/40 border border-emerald-400/30 p-4">
            <p className="text-sm font-bold text-emerald-300 mb-3">
              ② Eliminasi variabel <span className="text-yellow-300 text-base font-mono font-black">x</span> → cari nilai <span className="text-yellow-300 text-base font-mono font-black">y</span>
              <span className="text-white/50 font-normal ml-2">(koefisien x: 2 dan 1, KPK = 2 → kalikan P2 dengan 2)</span>
            </p>
            <div className="bg-emerald-950/50 rounded-xl p-3 border border-emerald-400/20 font-mono text-base">
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-2 items-center">
                <span className="text-white/50 text-xs whitespace-nowrap">2<span className="text-yellow-300">x</span> − <span className="text-yellow-300">y</span> = 4 × 1</span>
                <span className="text-right flex items-center gap-1"><B id="k2_r3a" w="w-12" /> −&#8202;<B id="k2_r3b" w="w-10" /></span>
                <span className="text-white/60 px-1">=</span>
                <span><B id="k2_r3c" w="w-10" /></span>
                <span className="text-white/50 text-xs whitespace-nowrap"><span className="text-yellow-300">x</span> + <span className="text-yellow-300">y</span> = 5 × 2</span>
                <span className="text-right flex items-center gap-1"><B id="k2_r4a" w="w-12" /> +&#8202;<B id="k2_r4b" w="w-12" /></span>
                <span className="text-white/60 px-1">=</span>
                <span><B id="k2_r4c" w="w-10" /></span>
              </div>
              <div className="border-t border-white/20 my-2" />
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-1 items-center">
                <span className="w-6 text-right text-white/40 text-sm">−</span>
                <span className="text-right"><B id="k2_resl_y" w="w-14" /></span>
                <span className="text-white/60 px-1">=</span>
                <span className="flex items-center gap-2"><B id="k2_resr_y" w="w-14" /><span className="text-white/40 text-xs font-normal">← variabel <span className="text-yellow-300">x</span> tereliminasi</span></span>
                <span className="w-6"> </span>
                <span className="text-right text-yellow-300 font-black text-xl">y</span>
                <span className="text-white/60 px-1">=</span>
                <span className="flex items-center gap-2"><B id="k2_ynilai" w="w-14" /><span className="text-white/40 text-xs font-normal">← bagi kedua ruas dengan 3</span></span>
              </div>
            </div>
          </div>

          {/* Isian langkah eliminasi y (soal) */}
          <div className="mt-4 rounded-xl bg-teal-900/30 border border-teal-400/20 p-4">
            <p className="text-sm text-teal-200/80 mb-3 font-body">Lengkapi tabel eliminasi variabel <span className="text-yellow-300 font-black font-mono">y</span> di bawah ini:</p>
            <div className="bg-teal-950/50 rounded-xl p-3 border border-teal-400/20 font-mono text-base">
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-2 items-center">
                <span className="text-white/50 text-xs whitespace-nowrap">2<span className="text-yellow-300">x</span> − <span className="text-yellow-300">y</span> = 4 × 1</span>
                <span className="text-right flex items-center gap-1"><B id="k2_r1a" w="w-12" /> −&#8202;<B id="k2_r1b" w="w-10" /></span>
                <span className="text-white/60 px-1">=</span>
                <span><B id="k2_r1c" w="w-10" /></span>
                <span className="text-white/50 text-xs whitespace-nowrap"><span className="text-yellow-300">x</span> + <span className="text-yellow-300">y</span> = 5 × 1</span>
                <span className="text-right flex items-center gap-1"><B id="k2_r2a" w="w-12" /> +&#8202;<B id="k2_r2b" w="w-10" /></span>
                <span className="text-white/60 px-1">=</span>
                <span><B id="k2_r2c" w="w-10" /></span>
              </div>
              <div className="border-t border-white/20 my-2" />
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-1 items-center">
                <span className="w-6 text-right text-white/40 text-sm">+</span>
                <span className="text-right"><B id="k2_resl_x" w="w-14" /></span>
                <span className="text-white/60 px-1">=</span>
                <span className="flex items-center gap-2"><B id="k2_resr_x" w="w-14" /><span className="text-white/40 text-xs font-normal">← variabel <span className="text-yellow-300">y</span> tereliminasi</span></span>
                <span className="w-6"> </span>
                <span className="text-right text-yellow-300 font-black text-xl">x</span>
                <span className="text-white/60 px-1">=</span>
                <span className="flex items-center gap-2"><B id="k2_xhasil" w="w-14" /><span className="text-white/40 text-xs font-normal">← bagi kedua ruas dengan 3</span></span>
              </div>
            </div>
            <CK sectionKey="k2step1" />
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
                2(<B id="k2_cek1a" w="w-10" />) − (<B id="k2_cek1b" w="w-10" />) = <B id="k2_cek1c" w="w-10" />
                <span className="text-white/50 font-body text-sm">(hasil harus 4)</span>
              </p>
              <p className="flex flex-wrap items-center gap-2">
                <span className="text-amber-300 font-bold text-sm">Persamaan 2 :</span>
                <B id="k2_cek2a" w="w-10" /> + (<B id="k2_cek2b" w="w-10" />) = <B id="k2_cek2c" w="w-10" />
                <span className="text-white/50 font-body text-sm">(hasil harus 5)</span>
              </p>
            </div>
            <CK sectionKey="k2step2" />
          </div>

          {/* Kesimpulan */}
          <div className="mt-4 rounded-xl bg-gradient-to-br from-emerald-600/30 to-teal-700/20 border-2 border-emerald-400/60 p-4">
            <p className="text-base font-black text-emerald-300 font-display mb-2">✅ Kesimpulan:</p>
            <p className="text-white text-lg font-mono font-bold flex flex-wrap items-center gap-2">
              Himpunan penyelesaian = {"{"}(<B id="k2_xfinal" w="w-14" />, <B id="k2_yfinal" w="w-14" />){"}"}
            </p>
            <p className="text-emerald-200/60 text-sm mt-2 font-body">Kedua persamaan terpenuhi → jawaban benar!</p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
             KASUS 3 — ELIMINASI (2x + y = 5, 3x – 2y = 11)
        ══════════════════════════════════════════════════════ */}
        <SectionHeader label="Kasus 3 Penyelesaian SPLDV Menggunakan Metode Eliminasi" color="amber" />

        <div className="rounded-2xl border-2 border-orange-400/40 bg-gradient-to-br from-orange-900/50 to-amber-900/40 p-5 mb-6 font-body text-base text-white/90">

          {/* ── Soal ─────────────────────────────────────────── */}
          <div className="rounded-xl bg-amber-950/50 border border-amber-400/30 p-4 mb-4 text-center">
            <p className="text-sm text-amber-200/80 mb-3 font-body">Tentukan himpunan penyelesaian dari sistem persamaan:</p>
            <div className="font-mono my-2 bg-blue-950/60 rounded-xl p-4 border border-amber-400/30 inline-block">
              <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 items-center text-xl font-bold text-white text-right">
                <span>2<span className="text-yellow-300">x</span> + <span className="text-yellow-300">y</span></span>
                <span className="text-white/70">=</span>
                <span>5</span>
                <span>3<span className="text-yellow-300">x</span> − 2<span className="text-yellow-300">y</span></span>
                <span className="text-white/70">=</span>
                <span>11</span>
              </div>
              <p className="text-amber-300/60 text-sm mt-2">untuk <span className="text-yellow-300 font-bold">x</span>, <span className="text-yellow-300 font-bold">y</span> ∈ ℝ</p>
            </div>
          </div>

          {/* ── Langkah ① — Eliminasi y → cari x ────────────── */}
          <div className="rounded-xl bg-orange-900/40 border border-orange-400/30 p-4 mb-4">
            <p className="text-sm font-bold text-orange-300 mb-1">
              ① Eliminasi variabel <span className="text-yellow-300 text-base font-mono font-black">y</span> → cari nilai <span className="text-yellow-300 text-base font-mono font-black">x</span>
            </p>
            <p className="text-xs text-white/50 mb-3">(koefisien y: 1 dan 2, KPK = 2 → P1 × 2, P2 × 1, lalu jumlahkan)</p>
            <div className="bg-orange-950/50 rounded-xl p-3 border border-orange-400/20 font-mono text-base">
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-2 items-center">
                <span className="text-white/45 text-xs whitespace-nowrap">2x + y = 5 × 2</span>
                <span className="flex items-center gap-1"><B id="k3_r1a" w="w-10" /> +&#8202;<B id="k3_r1b" w="w-10" /></span>
                <span className="text-white/60 px-1">=</span>
                <span><B id="k3_r1c" w="w-10" /></span>
                <span className="text-white/45 text-xs whitespace-nowrap">3x − 2y = 11 × 1</span>
                <span className="flex items-center gap-1"><B id="k3_r2a" w="w-10" /> −&#8202;<B id="k3_r2b" w="w-10" /></span>
                <span className="text-white/60 px-1">=</span>
                <span><B id="k3_r2c" w="w-10" /></span>
              </div>
              <div className="border-t border-white/20 my-2" />
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-1 items-center">
                <span className="w-6 text-right text-emerald-400 font-black text-xl leading-none">+</span>
                <span><B id="k3_resl_x" w="w-10" /></span>
                <span className="text-white/60 px-1">=</span>
                <span className="flex items-center gap-2"><B id="k3_resr_x" w="w-14" /><span className="text-white/40 text-xs font-sans">← variabel <span className="text-yellow-300">y</span> tereliminasi</span></span>
                <span className="w-6"> </span>
                <span className="text-right text-yellow-300 font-black text-xl">x</span>
                <span className="text-white/60 px-1">=</span>
                <span className="flex items-center gap-2"><B id="k3_xval" w="w-14" /><span className="text-white/40 text-xs font-sans">← bagi kedua ruas dengan 7</span></span>
              </div>
            </div>
          </div>

          {/* ── Langkah ② — Eliminasi x → cari y ────────────── */}
          <div className="rounded-xl bg-amber-900/40 border border-amber-400/30 p-4 mb-4">
            <p className="text-sm font-bold text-amber-300 mb-1">
              ② Eliminasi variabel <span className="text-yellow-300 text-base font-mono font-black">x</span> → cari nilai <span className="text-yellow-300 text-base font-mono font-black">y</span>
            </p>
            <p className="text-xs text-white/50 mb-3">(koefisien x: 2 dan 3, KPK = 6 → P1 × 3, P2 × 2, lalu kurangkan)</p>
            <div className="bg-amber-950/50 rounded-xl p-3 border border-amber-400/20 font-mono text-base">
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-2 items-center">
                <span className="text-white/45 text-xs whitespace-nowrap">2x + y = 5 × 3</span>
                <span className="flex items-center gap-1"><B id="k3_r3a" w="w-10" /> +&#8202;<B id="k3_r3b" w="w-10" /></span>
                <span className="text-white/60 px-1">=</span>
                <span><B id="k3_r3c" w="w-10" /></span>
                <span className="text-white/45 text-xs whitespace-nowrap">3x − 2y = 11 × 2</span>
                <span className="flex items-center gap-1"><B id="k3_r4a" w="w-10" /> −&#8202;<B id="k3_r4b" w="w-10" /></span>
                <span className="text-white/60 px-1">=</span>
                <span><B id="k3_r4c" w="w-10" /></span>
              </div>
              <div className="border-t border-white/20 my-2" />
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-1 items-center">
                <span className="w-6 text-right text-red-400 font-black text-xl leading-none">−</span>
                <span><B id="k3_resl_y" w="w-10" /></span>
                <span className="text-white/60 px-1">=</span>
                <span className="flex items-center gap-2"><B id="k3_resr_y" w="w-14" /><span className="text-white/40 text-xs font-sans">← variabel <span className="text-yellow-300">x</span> tereliminasi</span></span>
                <span className="w-6"> </span>
                <span className="text-right text-yellow-300 font-black text-xl">y</span>
                <span className="text-white/60 px-1">=</span>
                <span className="flex items-center gap-2"><B id="k3_yval" w="w-14" /><span className="text-white/40 text-xs font-sans">← bagi kedua ruas dengan 7</span></span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-white/90 text-sm font-body">
                Maka nilai <span className="text-yellow-300 font-black font-mono">x</span> = <B id="k3_xfinal" w="w-14" /> dan <span className="text-yellow-300 font-black font-mono">y</span> = <B id="k3_yfinal" w="w-14" />
              </p>
            </div>
            <CK sectionKey="k3step1" />
          </div>

          {/* ── Memeriksa Hasil ───────────────────────────────── */}
          <div className="rounded-xl bg-gradient-to-br from-amber-600/30 to-orange-700/20 border-2 border-amber-400/60 p-4 mb-4 shadow-[0_0_16px_rgba(245,158,11,0.2)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-amber-400 text-black text-xs font-black px-2 py-0.5 rounded-full font-display">🔍 MEMERIKSA HASIL KEMBALI</span>
            </div>
            <p className="text-sm text-amber-100/80 mb-3 font-body">Substitusikan nilai <span className="text-yellow-300 font-black font-mono text-base">x</span> dan <span className="text-yellow-300 font-black font-mono text-base">y</span> yang diperoleh ke kedua persamaan:</p>
            <div className="space-y-3 font-mono text-base bg-amber-950/40 rounded-xl p-3 border border-amber-400/20">
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
          </div>

          {/* ── Kesimpulan ────────────────────────────────────── */}
          <div className="rounded-xl bg-gradient-to-br from-emerald-600/30 to-teal-700/20 border-2 border-emerald-400/60 p-4">
            <p className="text-base font-black text-emerald-300 font-display mb-2">✅ Kesimpulan:</p>
            <p className="text-white text-lg font-mono font-bold flex flex-wrap items-center gap-2">
              Himpunan penyelesaian = {"{"}(<B id="k3_xfinal" w="w-14" />, <B id="k3_yfinal" w="w-14" />){"}"}
            </p>
            <p className="text-emerald-200/60 text-sm mt-2 font-body">Kedua persamaan terpenuhi → jawaban benar!</p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
             KASUS 4 — KONTEKSTUAL MANDIRI (rose/pink)
        ══════════════════════════════════════════════════════ */}
        <SectionHeader label="Kasus 4 Penyelesaian SPLDV Menggunakan Metode Eliminasi" color="violet" />

        <div className="rounded-2xl border-2 border-pink-400/40 bg-gradient-to-br from-pink-900/50 to-rose-900/40 p-5 mb-6 font-body text-base text-white/90">

          {/* ── Konteks (same story) ─────────────────────────── */}
          <p className="text-sm text-pink-200/90 font-body mb-4 leading-relaxed">
            Dhea ingin berbelanja buah-buahan di pasar dan berencana membeli <strong className="text-yellow-300">2 buah apel</strong> dan <strong className="text-yellow-300">1 buah pisang</strong>. Saat tiba di tempat penjualan buah, terpampang harga di depan toko sebagai berikut:
          </p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl border border-pink-400/40 bg-pink-950/50 p-3 text-center">
              <p className="text-xs font-bold text-pink-300 mb-2 font-display">Susunan 1</p>
              <div className="flex flex-wrap justify-center gap-1 mb-1">
                <Apple /><Apple /><Apple /><Apple />
              </div>
              <div className="flex justify-center gap-2 mb-2">
                <Banana /><Banana />
              </div>
              <p className="text-sm font-mono text-white font-bold">Rp 12.500,00</p>
            </div>
            <div className="rounded-xl border border-pink-400/40 bg-pink-950/50 p-3 text-center">
              <p className="text-xs font-bold text-pink-300 mb-2 font-display">Susunan 2</p>
              <div className="flex flex-wrap justify-center gap-1 mb-1">
                <Apple /><Apple /><Apple />
              </div>
              <div className="flex justify-center mb-2">
                <Banana />
              </div>
              <p className="text-sm font-mono text-white font-bold">Rp 9.000,00</p>
            </div>
          </div>
          <div className="flex justify-center gap-10 mb-4">
            <div className="flex flex-col items-center gap-1">
              <Apple size={30} /><p className="text-xs text-white/55">Buah apel</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Banana size={46} /><p className="text-xs text-white/55">Buah pisang</p>
            </div>
          </div>
          <p className="text-xs text-pink-200/60 italic font-body mb-5">
            "Masalah penjualan kedua jenis buah di atas adalah salah satu masalah sehari-hari yang dapat diselesaikan melalui suatu metode dalam sistem persamaan linear dua variabel (SPLDV)."
          </p>

          {/* ── A. Model Matematika (semua isian) ────────────── */}
          <div className="rounded-xl bg-rose-900/40 border border-rose-400/30 p-4 mb-4">
            <p className="text-sm font-bold text-rose-300 mb-3">📐 Membuat Model Matematika</p>
            <p className="text-sm text-white/85 mb-3 font-body">
              Misalkan harga 1 buah apel = <B id="k4_vara" w="w-10" /> dan harga 1 buah pisang = <B id="k4_varb" w="w-10" />
            </p>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex flex-wrap items-center gap-2 text-white/85">
                <span className="text-rose-300 font-bold">Susunan 1 :</span>
                <B id="k4_coef1a" w="w-8" />
                <span className="text-yellow-300 font-bold">a</span> +
                <B id="k4_coef1b" w="w-8" />
                <span className="text-yellow-300 font-bold">b</span>
                <span>=</span>
                <span>Rp</span>
                <B id="k4_rhs1" w="w-20" />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-white/85">
                <span className="text-rose-300 font-bold">Susunan 2 :</span>
                <B id="k4_coef2a" w="w-8" />
                <span className="text-yellow-300 font-bold">a</span> +
                <B id="k4_coef2b" w="w-8" />
                <span className="text-yellow-300 font-bold">b</span>
                <span>=</span>
                <span>Rp</span>
                <B id="k4_rhs2" w="w-20" />
              </div>
            </div>
            <CK sectionKey="k4model" />
          </div>

          {/* ── B. Eliminasi b → cari a ───────────────────────── */}
          <div className="rounded-xl bg-pink-900/40 border border-pink-400/30 p-4 mb-4">
            <p className="text-sm font-bold text-pink-300 mb-1">① Eliminasi variabel <span className="font-mono text-yellow-300">b</span> → cari nilai <span className="font-mono text-yellow-300">a</span></p>
            <p className="text-xs text-white/50 mb-3">(KPK koefisien b: 2 dan 1 = 2 → P1 × 1, P2 × 2, lalu kurangkan)</p>
            <div className="bg-pink-950/50 rounded-xl p-3 border border-pink-400/20 font-mono text-sm">
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-2 items-center">
                <span className="text-white/45 text-xs whitespace-nowrap">4a + 2b = 12.500 × 1</span>
                <span className="flex items-center gap-1"><B id="k4_e1a" w="w-10" /> +&#8202;<B id="k4_e1b" w="w-10" /></span>
                <span className="text-white/60 px-1">=</span>
                <span><B id="k4_e1c" w="w-16" /></span>
                <span className="text-white/45 text-xs whitespace-nowrap">3a + b = 9.000 × 2</span>
                <span className="flex items-center gap-1"><B id="k4_e2a" w="w-10" /> +&#8202;<B id="k4_e2b" w="w-10" /></span>
                <span className="text-white/60 px-1">=</span>
                <span><B id="k4_e2c" w="w-16" /></span>
              </div>
              <div className="border-t border-white/20 my-2" />
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-1 items-center">
                <span className="w-6 text-right text-white/40 text-xs">−</span>
                <span><B id="k4_resl_a" w="w-10" /></span>
                <span className="text-white/60 px-1">=</span>
                <span className="flex items-center gap-2"><B id="k4_resr_a" w="w-16" /><span className="text-white/40 text-xs font-sans">← b tereliminasi</span></span>
                <span className="w-6"> </span>
                <span className="text-yellow-300 font-black">a</span>
                <span className="text-white/60 px-1">=</span>
                <span className="flex items-center gap-2"><B id="k4_aval" w="w-20" /><span className="text-white/40 text-xs font-sans">← bagi 2</span></span>
              </div>
            </div>
          </div>

          {/* ── C. Eliminasi a → cari b ───────────────────────── */}
          <div className="rounded-xl bg-rose-900/40 border border-rose-400/30 p-4 mb-4">
            <p className="text-sm font-bold text-rose-300 mb-1">② Eliminasi variabel <span className="font-mono text-yellow-300">a</span> → cari nilai <span className="font-mono text-yellow-300">b</span></p>
            <p className="text-xs text-white/50 mb-3">(KPK koefisien a: 4 dan 3 = 12 → P1 × 3, P2 × 4, lalu kurangkan)</p>
            <div className="bg-rose-950/50 rounded-xl p-3 border border-rose-400/20 font-mono text-sm">
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-2 items-center">
                <span className="text-white/45 text-xs whitespace-nowrap">4a + 2b = 12.500 × 3</span>
                <span className="flex items-center gap-1"><B id="k4_e3a" w="w-12" /> +&#8202;<B id="k4_e3b" w="w-10" /></span>
                <span className="text-white/60 px-1">=</span>
                <span><B id="k4_e3c" w="w-16" /></span>
                <span className="text-white/45 text-xs whitespace-nowrap">3a + b = 9.000 × 4</span>
                <span className="flex items-center gap-1"><B id="k4_e4a" w="w-12" /> +&#8202;<B id="k4_e4b" w="w-10" /></span>
                <span className="text-white/60 px-1">=</span>
                <span><B id="k4_e4c" w="w-16" /></span>
              </div>
              <div className="border-t border-white/20 my-2" />
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-1 items-center">
                <span className="w-6 text-right text-white/40 text-xs">−</span>
                <span><B id="k4_resl_b" w="w-10" /></span>
                <span className="text-white/60 px-1">=</span>
                <span className="flex items-center gap-2"><B id="k4_resr_b" w="w-16" /><span className="text-white/40 text-xs font-sans">← a tereliminasi</span></span>
                <span className="w-6"> </span>
                <span className="text-yellow-300 font-black">b</span>
                <span className="text-white/60 px-1">=</span>
                <span className="flex items-center gap-2"><B id="k4_bval" w="w-20" /><span className="text-white/40 text-xs font-sans">← bagi 2</span></span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-white/90 text-sm font-body">Maka harga 1 apel = Rp <B id="k4_afinal" w="w-20" /> dan harga 1 pisang = Rp <B id="k4_bfinal" w="w-16" /></p>
            </div>
            <CK sectionKey="k4step1" />
          </div>

          {/* ── D. Memeriksa ─────────────────────────────────── */}
          <div className="rounded-xl bg-gradient-to-br from-amber-600/30 to-orange-700/20 border-2 border-amber-400/60 p-4 mb-4 shadow-[0_0_16px_rgba(245,158,11,0.2)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-amber-400 text-black text-xs font-black px-2 py-0.5 rounded-full font-display">🔍 MEMERIKSA HASIL KEMBALI</span>
            </div>
            <p className="text-xs text-amber-100/75 mb-3 font-body">Substitusikan nilai a dan b yang diperoleh ke kedua persamaan:</p>
            <div className="space-y-2 font-mono text-sm bg-amber-950/40 rounded-xl p-3 border border-amber-400/20">
              <p className="flex flex-wrap items-center gap-2">
                <span className="text-amber-300 font-bold text-xs">Susunan 1 :</span>
                4(<B id="k4_cek1a" w="w-16" />) + 2(<B id="k4_cek1b" w="w-14" />) = <B id="k4_cek1c" w="w-16" />
                <span className="text-white/45 font-body text-xs">(harus 12.500)</span>
              </p>
              <p className="flex flex-wrap items-center gap-2">
                <span className="text-amber-300 font-bold text-xs">Susunan 2 :</span>
                3(<B id="k4_cek2a" w="w-16" />) + (<B id="k4_cek2b" w="w-14" />) = <B id="k4_cek2c" w="w-16" />
                <span className="text-white/45 font-body text-xs">(harus 9.000)</span>
              </p>
            </div>
            <CK sectionKey="k4step2" />
          </div>

          {/* ── E. Kesimpulan ─────────────────────────────────── */}
          <div className="rounded-xl bg-gradient-to-br from-emerald-600/30 to-teal-700/20 border-2 border-emerald-400/60 p-4">
            <p className="text-base font-black text-emerald-300 font-display mb-2">✅ Kesimpulan:</p>
            <p className="text-white/85 text-sm font-body mb-2">Biaya yang harus dibayar Dhea untuk 2 apel + 1 pisang:</p>
            <p className="font-mono text-base text-white mb-1">2 × Rp <B id="k4_afinal" w="w-20" /> + 1 × Rp <B id="k4_bfinal" w="w-16" /> = Rp <B id="k4_jawab" w="w-20" /></p>
            <p className="text-emerald-200/60 text-sm mt-2 font-body">Jadi Dhea harus membayar <span className="text-yellow-300 font-black">Rp 6.250,00</span></p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
             KESAN MENGGUNAKAN METODE ELIMINASI
        ══════════════════════════════════════════════════════ */}
        <div className="rounded-3xl border-2 border-cyan-400/40 bg-gradient-to-br from-cyan-900/50 via-blue-900/40 to-violet-900/40 p-6 mb-6 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">✨</span>
            <h2 className="font-display text-lg font-black text-cyan-200 tracking-wide uppercase">Kesan Menggunakan Metode Eliminasi</h2>
          </div>

          <p className="text-white/85 font-body text-sm leading-relaxed mb-5">
            Setelah mempelajari dan mempraktikkan metode eliminasi, tuliskan kesanmu secara jujur dan penuh semangat!
          </p>

          {/* Card kesan 1 */}
          <div className="rounded-2xl bg-gradient-to-br from-cyan-800/40 to-blue-800/30 border border-cyan-400/30 p-4 mb-3 flex gap-3 items-start">
            <span className="text-2xl shrink-0 mt-0.5">🚀</span>
            <div>
              <p className="font-display text-sm font-black text-cyan-300 mb-1">Kekuatan Metode Eliminasi</p>
              <p className="text-white/80 font-body text-sm leading-relaxed">
                Metode eliminasi bagaikan senjata rahasia matematika — dengan <span className="text-yellow-300 font-bold">menyamakan koefisien</span> lalu menjumlahkan atau mengurangkan, satu variabel <em>lenyap</em> seketika! Tidak perlu substitusi panjang, cukup satu langkah dan variabel pertama sudah di tangan.
              </p>
            </div>
          </div>

          {/* Card kesan 2 */}
          <div className="rounded-2xl bg-gradient-to-br from-violet-800/40 to-purple-800/30 border border-violet-400/30 p-4 mb-3 flex gap-3 items-start">
            <span className="text-2xl shrink-0 mt-0.5">💡</span>
            <div>
              <p className="font-display text-sm font-black text-violet-300 mb-1">Serasa Jadi Detektif Matematika</p>
              <p className="text-white/80 font-body text-sm leading-relaxed">
                Setiap langkah eliminasi terasa seperti <span className="text-yellow-300 font-bold">memecahkan teka-teki</span> — mencari KPK koefisien, mengalikan persamaan, lalu menonton variabel menghilang satu per satu. Prosesnya sistematis, terstruktur, dan sangat memuaskan ketika jawaban akhir ditemukan!
              </p>
            </div>
          </div>

          {/* Card kesan 3 */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-800/40 to-teal-800/30 border border-emerald-400/30 p-4 mb-3 flex gap-3 items-start">
            <span className="text-2xl shrink-0 mt-0.5">🎯</span>
            <div>
              <p className="font-display text-sm font-black text-emerald-300 mb-1">Andalan untuk Koefisien Besar</p>
              <p className="text-white/80 font-body text-sm leading-relaxed">
                Ketika koefisien variabelnya besar atau tidak mudah dinyatakan satu sama lain, metode eliminasi justru <span className="text-yellow-300 font-bold">bersinar paling terang</span>. Ia bekerja tanpa menghasilkan pecahan rumit di tengah jalan — solusi tetap bersih, rapi, dan mudah diperiksa kembali.
              </p>
            </div>
          </div>

          {/* Card kesan 4 */}
          <div className="rounded-2xl bg-gradient-to-br from-amber-800/40 to-orange-800/30 border border-amber-400/30 p-4 mb-5 flex gap-3 items-start">
            <span className="text-2xl shrink-0 mt-0.5">🌟</span>
            <div>
              <p className="font-display text-sm font-black text-amber-300 mb-1">Refleksi Diri</p>
              <p className="text-white/80 font-body text-sm leading-relaxed">
                Belajar metode eliminasi mengajarkan kita bahwa <span className="text-yellow-300 font-bold">kesabaran dan keteraturan</span> adalah kunci. Setiap langkah yang dilakukan dengan teliti membawa kita selangkah lebih dekat ke jawaban yang tepat — persis seperti menghadapi tantangan di kehidupan nyata!
              </p>
            </div>
          </div>

          {/* Penutup motivasi */}
          <div className="rounded-2xl bg-gradient-to-r from-yellow-500/20 to-amber-500/15 border border-yellow-400/40 p-4 text-center">
            <p className="text-yellow-300 font-display font-black text-base mb-1">🏆 Selamat! Kamu Telah Menguasai Metode Eliminasi!</p>
            <p className="text-white/75 font-body text-sm leading-relaxed">
              Teruslah berlatih dan jangan takut mencoba soal-soal baru. Setiap soal yang berhasil diselesaikan adalah bukti bahwa kamu semakin hebat dalam matematika! 💪
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
             KOTAK KESAN SISWA
        ══════════════════════════════════════════════════════ */}
        <div className="rounded-3xl border-2 border-cyan-400/40 bg-gradient-to-br from-slate-900/80 via-blue-950/60 to-violet-950/60 p-6 mb-6 shadow-[0_0_32px_rgba(6,182,212,0.12)]">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">✍️</span>
            <h2 className="font-display text-base font-black text-cyan-200 tracking-wide uppercase">Kesanku Belajar Hari Ini</h2>
          </div>
          <p className="font-body text-xs text-white/55 mb-5 pl-9">
            Tuliskan kesanmu secara jujur setelah mempelajari dan mengerjakan LKPD ini!
          </p>

          {/* Pertanyaan 1 */}
          <div className="mb-4">
            <label className="block font-body text-sm font-semibold text-cyan-300 mb-2">
              1. Apa yang paling kamu sukai dari metode eliminasi?
            </label>
            <textarea
              rows={3}
              placeholder="Tuliskan jawabanmu di sini..."
              className="w-full rounded-xl border-2 border-dashed border-cyan-400/50 bg-white/5 text-white placeholder-white/25 font-body text-sm px-4 py-3 outline-none focus:border-cyan-300 focus:bg-white/8 resize-none transition-all duration-200 leading-relaxed"
            />
          </div>

          {/* Pertanyaan 2 */}
          <div className="mb-4">
            <label className="block font-body text-sm font-semibold text-violet-300 mb-2">
              2. Bagian mana yang menurutmu paling sulit? Mengapa?
            </label>
            <textarea
              rows={3}
              placeholder="Tuliskan jawabanmu di sini..."
              className="w-full rounded-xl border-2 border-dashed border-violet-400/50 bg-white/5 text-white placeholder-white/25 font-body text-sm px-4 py-3 outline-none focus:border-violet-300 focus:bg-white/8 resize-none transition-all duration-200 leading-relaxed"
            />
          </div>

          {/* Pertanyaan 3 */}
          <div className="mb-4">
            <label className="block font-body text-sm font-semibold text-emerald-300 mb-2">
              3. Apa yang ingin kamu pelajari lebih lanjut setelah ini?
            </label>
            <textarea
              rows={3}
              placeholder="Tuliskan jawabanmu di sini..."
              className="w-full rounded-xl border-2 border-dashed border-emerald-400/50 bg-white/5 text-white placeholder-white/25 font-body text-sm px-4 py-3 outline-none focus:border-emerald-300 focus:bg-white/8 resize-none transition-all duration-200 leading-relaxed"
            />
          </div>

          {/* Penilaian diri */}
          <div className="mb-2">
            <label className="block font-body text-sm font-semibold text-amber-300 mb-3">
              4. Seberapa paham kamu dengan materi hari ini?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { emoji: "😕", label: "Belum Paham", color: "border-red-400/50 bg-red-900/20 hover:bg-red-900/40" },
                { emoji: "🙂", label: "Cukup Paham", color: "border-yellow-400/50 bg-yellow-900/20 hover:bg-yellow-900/40" },
                { emoji: "😊", label: "Paham", color: "border-blue-400/50 bg-blue-900/20 hover:bg-blue-900/40" },
                { emoji: "🤩", label: "Sangat Paham", color: "border-emerald-400/50 bg-emerald-900/20 hover:bg-emerald-900/40" },
              ].map(({ emoji, label, color }) => (
                <button
                  key={label}
                  type="button"
                  className={`rounded-xl border-2 ${color} p-3 text-center transition-all duration-200 active:scale-95 group`}
                  onClick={(e) => {
                    const parent = (e.currentTarget as HTMLElement).parentElement!;
                    parent.querySelectorAll("button").forEach((b) => b.classList.remove("ring-2", "ring-white/60", "scale-105"));
                    (e.currentTarget as HTMLElement).classList.add("ring-2", "ring-white/60", "scale-105");
                  }}
                >
                  <p className="text-2xl mb-1">{emoji}</p>
                  <p className="font-body text-xs text-white/80 font-semibold leading-tight">{label}</p>
                </button>
              ))}
            </div>
          </div>
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
