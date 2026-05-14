import { useState } from "react";
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
  a1: ["dua variabel", "2 variabel", "memiliki dua variabel", "mempunyai dua variabel"],
  a2: ["pangkat 1", "berderajat 1", "linear", "derajat 1", "berpangkat 1", "pangkat tertinggi 1", "1"],
  a3: ["ax + by = c", "ax+by=c", "berbentuk ax + by = c", "koefisien bilangan real", "bilangan real"],
  a4: ["lebih dari satu penyelesaian", "banyak penyelesaian", "tak hingga penyelesaian", "tak terhingga", "lebih dari satu", "banyak"],

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
  k1step1: ["k1_dik","k1_tan"],
  k1step3: ["k1_r1a","k1_r1b","k1_r1c","k1_r2a","k1_r2b","k1_r2c","k1_resl","k1_resr","k1_ynilai","k1_xfinal","k1_yfinal"],
  k1step4: ["k1_cek1a","k1_cek1b","k1_cek1c","k1_cek2a","k1_cek2b","k1_cek2c"],
  k2step1: ["k2_dik","k2_tan"],
  k2step3: ["k2_xsubst","k2_xsubst2","k2_r1l","k2_r1r","k2_r2l","k2_r2r","k2_y","k2_ysub","k2_xhasil","k2_xfinal","k2_yfinal"],
  k2step4: ["k2_cek1a","k2_cek1b","k2_cek1c","k2_cek2a","k2_cek2b","k2_cek2c"],
  k3step1: ["k3_dik","k3_tan"],
  k3step3: ["k3_r1a","k3_r1b","k3_r1c","k3_r2a","k3_r2b","k3_r2c","k3_resl","k3_resr","k3_x","k3_substx","k3_kiri","k3_y","k3_xfinal","k3_yfinal"],
  k3step4: ["k3_cek1a","k3_cek1b","k3_cek1c","k3_cek2a","k3_cek2b","k3_cek2c"],
};

/* ─── FillBlank ───────────────────────────────────────────── */
type BlankProps = {
  id: string;
  vals: Record<string, string>;
  res: Record<string, boolean | null>;
  onChange: (id: string, v: string) => void;
  w?: string;
  mono?: boolean;
};

function Blank({ id, vals, res, onChange, w = "w-20", mono = true }: BlankProps) {
  const r = res[id] ?? null;
  const border = r === null ? "border-white/40 focus-within:border-cyan-400" : r ? "border-emerald-400" : "border-red-400";
  const bg = r === null ? "" : r ? "bg-emerald-500/10" : "bg-red-500/10";
  const tc = r === null ? "text-white" : r ? "text-emerald-300" : "text-red-300";
  return (
    <span className="inline-flex items-center gap-0.5 align-middle">
      <input
        value={vals[id] ?? ""}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder="……"
        className={`${w} ${border} ${bg} ${tc} border-b-2 border-t-0 border-l-0 border-r-0 text-center text-sm outline-none px-1 py-0.5 transition-colors ${mono ? "font-mono" : "font-body"}`}
      />
      {r !== null && (
        <span className={`text-xs font-bold ${r ? "text-emerald-400" : "text-red-400"}`}>{r ? "✓" : "✗"}</span>
      )}
    </span>
  );
}

/* ─── CekButton ───────────────────────────────────────────── */
type CekProps = { sectionKey: string; vals: Record<string, string>; onCek: (k: string) => void; res: Record<string, boolean | null> };
function CekButton({ sectionKey, vals, onCek, res }: CekProps) {
  const ids = SECTIONS[sectionKey] ?? [];
  const checked = ids.some((id) => res[id] !== null && res[id] !== undefined);
  const correct = ids.filter((id) => res[id] === true).length;
  return (
    <div className="flex items-center gap-3 mt-3">
      <button
        onClick={() => onCek(sectionKey)}
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold font-display tracking-wide hover:opacity-90 active:scale-95 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)]"
      >
        Cek Jawaban
      </button>
      {checked && (
        <span className={`text-xs font-bold font-display ${correct === ids.length ? "text-emerald-400" : "text-amber-400"}`}>
          {correct}/{ids.length} benar
        </span>
      )}
    </div>
  );
}

/* ─── StepCard ────────────────────────────────────────────── */
function StepCard({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 overflow-hidden mb-4">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border-b border-white/8">
        <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-xs font-bold text-cyan-300 font-display shrink-0">{step}</span>
        <p className="text-xs font-bold text-cyan-200 font-display tracking-wide uppercase">{title}</p>
      </div>
      <div className="px-4 py-3 font-body text-sm text-white/85 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

/* ─── SectionHeader ───────────────────────────────────────── */
function SectionHeader({ label, color = "cyan", children }: { label: string; color?: string; children?: React.ReactNode }) {
  const colors: Record<string, string> = {
    cyan: "from-cyan-500/20 to-blue-500/10 border-cyan-400/30 text-cyan-300",
    emerald: "from-emerald-500/20 to-teal-500/10 border-emerald-400/30 text-emerald-300",
    violet: "from-violet-500/20 to-purple-500/10 border-violet-400/30 text-violet-300",
    amber: "from-amber-500/20 to-orange-500/10 border-amber-400/30 text-amber-300",
  };
  return (
    <div className={`rounded-2xl p-4 mb-4 bg-gradient-to-br border ${colors[color]}`}>
      <p className={`font-display text-base font-black tracking-wide ${colors[color].split(" ").slice(-1)}`}>{label}</p>
      {children && <div className="mt-2 text-sm text-white/75 font-body">{children}</div>}
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
const MetodeEliminasiLKPDPage = () => {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [res, setRes] = useState<Record<string, boolean | null>>({});

  const handleChange = (id: string, v: string) => {
    setVals((prev) => ({ ...prev, [id]: v }));
    setRes((prev) => ({ ...prev, [id]: null }));
  };

  const handleCek = (sectionKey: string) => {
    const ids = SECTIONS[sectionKey] ?? [];
    const updates: Record<string, boolean | null> = {};
    ids.forEach((id) => {
      updates[id] = checkAnswer(vals[id] ?? "", ANSWERS[id] ?? []);
    });
    setRes((prev) => ({ ...prev, ...updates }));
  };

  const B = (props: Omit<BlankProps, "vals" | "res" | "onChange">) => (
    <Blank {...props} vals={vals} res={res} onChange={handleChange} />
  );
  const CK = (props: Omit<CekProps, "vals" | "onCek" | "res">) => (
    <CekButton {...props} vals={vals} onCek={handleCek} res={res} />
  );

  return (
    <div className="relative min-h-screen flex flex-col gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath="/lkpd/kelas-8/spldv" />

      <div className="relative z-10 max-w-2xl w-full mx-auto px-4 pt-6 pb-24">

        {/* ── Header LKS ── */}
        <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-violet-500/10 p-5 mb-6 text-center">
          <p className="font-display text-xs font-bold tracking-widest text-cyan-400 uppercase mb-1">Lembar Kerja Siswa 2 (LKS 2)</p>
          <h1 className="font-display text-xl md:text-2xl font-black text-white mb-2">Penyelesaian SPLDV</h1>
          <p className="font-body text-xs text-white/55">Metode Eliminasi · Substitusi · Campuran</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-body text-white/60">
            <p>Mata Pelajaran: <span className="text-white/80">Matematika</span></p>
            <p>Kelas / Semester: <span className="text-white/80">VIII / I</span></p>
            <p>Alokasi Waktu: <span className="text-white/80">2 × 40 menit</span></p>
            <p>Satuan Pendidikan: <span className="text-white/80">SMP</span></p>
          </div>
          <p className="mt-3 text-xs text-white/50 font-body leading-relaxed">
            Pada LKS ini kamu akan belajar menyelesaikan SPLDV melalui metode <strong className="text-cyan-300">Eliminasi</strong>, <strong className="text-emerald-300">Substitusi</strong>, dan <strong className="text-violet-300">Campuran</strong>.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════
             BAGIAN A — PENGERTIAN SPLDV
        ══════════════════════════════════════════════════════ */}
        <SectionHeader label="A. Pengertian Sistem Persamaan Linear Dua Variabel (SPLDV)" color="cyan" />

        <div className="rounded-2xl border border-white/10 bg-white/4 p-4 mb-4 font-body text-sm text-white/85">
          <p className="mb-2">Pada pembahasan mengenai PLDV, ciri-ciri dari PLDV antara lain :</p>
          <div className="space-y-2 pl-2">
            {["a1","a2","a3","a4"].map((id, i) => (
              <p key={id} className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">{i+1}.</span>
                <B id={id} w="w-56" mono={false} />
              </p>
            ))}
          </div>
          <CK sectionKey="a" />
        </div>

        {/* Contoh pengantar */}
        <div className="rounded-2xl border border-white/8 bg-[#0d1627]/60 p-4 mb-6 font-body text-sm text-white/80">
          <p className="font-bold text-white mb-2">Contoh SPLDV:</p>
          <p className="mb-1">Tentukan himpunan penyelesaian dari:</p>
          <div className="font-mono text-center my-2 text-cyan-200 space-y-0.5">
            <p>x + y = 5</p>
            <p>x − y = 1</p>
            <p className="text-white/40 text-xs">untuk x, y ∈ ℝ</p>
          </div>
          <div className="mt-3 space-y-1 text-xs text-white/70 border-t border-white/10 pt-3">
            <p><span className="text-yellow-300 font-bold">Diketahui:</span> sistem persamaan x + y = 5 dan x − y = 1</p>
            <p><span className="text-yellow-300 font-bold">Ditanyakan:</span> nilai x dan y</p>
            <p><span className="text-emerald-300 font-bold">Jawab:</span> Dengan cara tebak → x = 3, y = 2</p>
            <p>Cek: x + y = 3 + 2 = 5 ✓ &nbsp;|&nbsp; x − y = 3 − 2 = 1 ✓</p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
             BAGIAN B — METODE ELIMINASI (KASUS 1)
        ══════════════════════════════════════════════════════ */}
        <SectionHeader label="B. Metode Eliminasi — KASUS 1" color="cyan">
          Tentukan penyelesaian dari <span className="font-mono text-white">2x + y = 8</span> dan <span className="font-mono text-white">x − y = 10</span> dengan x, y ∈ ℝ menggunakan <strong className="text-cyan-300">metode eliminasi</strong>.
        </SectionHeader>

        {/* Step 1 */}
        <StepCard step="1" title="Memahami Masalah">
          <p>Unsur yang <span className="text-yellow-300">diketahui</span> :</p>
          <p><B id="k1_dik" w="w-64" mono={false} /></p>
          <p className="mt-2">Unsur yang <span className="text-yellow-300">ditanyakan</span> :</p>
          <p><B id="k1_tan" w="w-48" mono={false} /></p>
          <CK sectionKey="k1step1" />
        </StepCard>

        {/* Step 2 */}
        <StepCard step="2" title="Merencanakan Strategi">
          <p>Strategi yang akan digunakan :</p>
          <div className="flex items-start gap-2 mt-1">
            <span className="text-cyan-400 mt-0.5">✦</span>
            <p>Metode <strong className="text-cyan-300">eliminasi</strong>, yaitu menghilangkan salah satu variabel dengan menyamakan koefisiennya kemudian menjumlahkan atau mengurangkan kedua persamaan.</p>
          </div>
        </StepCard>

        {/* Step 3 */}
        <StepCard step="3" title="Menjalankan Rencana Penyelesaian">
          <p className="font-mono text-xs text-white/60 mb-2">2x + y = 8 &nbsp; … (persamaan 1)<br />x − y = 10 &nbsp; … (persamaan 2)</p>
          <p className="text-white/70 text-xs mb-3">Koefisien y sudah sama (berlawanan tanda) → <span className="text-cyan-300">jumlahkan</span> kedua persamaan untuk menghilangkan y:</p>
          <div className="rounded-xl bg-[#0d1627]/80 border border-white/8 p-3 font-mono text-sm text-center mb-3 space-y-1">
            <p className="text-white/80">2x + y &nbsp;= 8</p>
            <p className="text-white/80">x − y &nbsp;= 10 &nbsp;<span className="text-white/40">+</span></p>
            <div className="border-t border-white/20 pt-1">
              <p className="text-emerald-300 font-bold">3x = 18 &nbsp;→&nbsp; <span className="text-yellow-300">x = 6</span></p>
            </div>
          </div>

          <p className="text-white/70 text-xs mb-3">Untuk mencari y, eliminasi variabel x (koefisien x belum sama: 2 dan 1, KPK = 2 → kalikan persamaan 2 dengan 2):</p>
          <div className="rounded-xl bg-[#0d1627]/80 border border-white/8 p-3 font-mono text-sm mb-3">
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 items-center">
              <span className="text-white/50 text-xs">2x + y = 8 &nbsp;× 1</span>
              <span className="flex items-center gap-1 flex-wrap">
                <B id="k1_r1a" w="w-10" /> +
                <B id="k1_r1b" w="w-8" /> =
                <B id="k1_r1c" w="w-8" />
              </span>
              <span className="text-white/50 text-xs">x − y = 10 × 2</span>
              <span className="flex items-center gap-1 flex-wrap">
                <B id="k1_r2a" w="w-10" /> −
                <B id="k1_r2b" w="w-10" /> =
                <B id="k1_r2c" w="w-8" />
              </span>
              <span className="text-white/30 text-xs border-t border-white/10 pt-1">−</span>
              <span className="border-t border-white/20 pt-1 flex items-center gap-1">
                <B id="k1_resl" w="w-12" /> =
                <B id="k1_resr" w="w-12" />
              </span>
              <span />
              <span className="flex items-center gap-1 text-yellow-200">
                y =
                <B id="k1_ynilai" w="w-12" />
              </span>
            </div>
          </div>

          <p className="text-white/80">
            Maka nilai x = <B id="k1_xfinal" w="w-10" /> dan y = <B id="k1_yfinal" w="w-10" />
          </p>
          <CK sectionKey="k1step3" />
        </StepCard>

        {/* Step 4 */}
        <StepCard step="4" title="Memeriksa Hasil Kembali">
          <p className="text-white/70 text-xs mb-3">Substitusikan x = 6 dan y = −4 ke kedua persamaan:</p>
          <div className="space-y-2 font-mono text-sm">
            <p className="flex flex-wrap items-center gap-1">
              <span className="text-white/60">Persamaan 1 :</span>
              2(<B id="k1_cek1a" w="w-8" />) + (<B id="k1_cek1b" w="w-8" />) = <B id="k1_cek1c" w="w-8" />
              <span className="text-white/50 font-body text-xs">(hasil harus 8)</span>
            </p>
            <p className="flex flex-wrap items-center gap-1">
              <span className="text-white/60">Persamaan 2 :</span>
              <B id="k1_cek2a" w="w-8" /> − (<B id="k1_cek2b" w="w-8" />) = <B id="k1_cek2c" w="w-8" />
              <span className="text-white/50 font-body text-xs">(hasil harus 10)</span>
            </p>
          </div>
          <CK sectionKey="k1step4" />
        </StepCard>

        <div className="rounded-xl border border-white/8 bg-white/3 p-3 mb-6">
          <p className="text-xs text-white/50 font-body mb-1">💬 Kesan menggunakan metode eliminasi :</p>
          <textarea rows={2} className="w-full bg-transparent text-sm text-white/80 font-body outline-none resize-none placeholder-white/25" placeholder="Tuliskan kesanmu di sini…" />
        </div>


        {/* ══════════════════════════════════════════════════════
             BAGIAN B — METODE SUBSTITUSI (KASUS 2)
        ══════════════════════════════════════════════════════ */}
        <SectionHeader label="B. Metode Substitusi — KASUS 2" color="emerald">
          Tentukan penyelesaian dari <span className="font-mono text-white">2x − y = 4</span> dan <span className="font-mono text-white">x + y = 5</span> dengan x, y ∈ ℝ menggunakan <strong className="text-emerald-300">metode substitusi</strong>.
        </SectionHeader>

        <StepCard step="1" title="Memahami Masalah">
          <p>Unsur yang <span className="text-yellow-300">diketahui</span> :</p>
          <p><B id="k2_dik" w="w-64" mono={false} /></p>
          <p className="mt-2">Unsur yang <span className="text-yellow-300">ditanyakan</span> :</p>
          <p><B id="k2_tan" w="w-48" mono={false} /></p>
          <CK sectionKey="k2step1" />
        </StepCard>

        <StepCard step="2" title="Merencanakan Strategi">
          <div className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">✦</span>
            <p>Metode <strong className="text-emerald-300">substitusi</strong>, yaitu menyatakan variabel satu ke dalam variabel lain pada suatu persamaan, kemudian menggantikan ke persamaan lainnya.</p>
          </div>
        </StepCard>

        <StepCard step="3" title="Menjalankan Rencana Penyelesaian">
          <p className="font-mono text-xs text-white/60 mb-2">x + y = 5 &nbsp; … (persamaan 1)<br />2x − y = 4 &nbsp; … (persamaan 2)</p>

          <p className="text-xs text-white/70 mb-2">Nyatakan x sebagai y pada persamaan 1 :</p>
          <p className="font-mono text-sm mb-3">
            x + y = 5 &nbsp;→&nbsp; x = 5 − <B id="k2_xsubst" w="w-10" />
          </p>

          <p className="text-xs text-white/70 mb-2">Substitusikan x = 5 − <B id="k2_xsubst2" w="w-10" /> ke persamaan 2 :</p>
          <div className="rounded-xl bg-[#0d1627]/80 border border-white/8 p-3 font-mono text-sm mb-3 space-y-1">
            <p>2(5 − y) − y = 4</p>
            <p className="flex items-center gap-1">
              <B id="k2_r1l" w="w-10" /> − <B id="k2_r1r" w="w-10" /> − y = 4
            </p>
            <p className="flex items-center gap-1">
              <B id="k2_r2l" w="w-10" /> − <B id="k2_r2r" w="w-10" /> = 4
            </p>
            <p className="flex items-center gap-1 text-emerald-200">
              y = <B id="k2_y" w="w-10" />
            </p>
          </div>

          <p className="text-xs text-white/70 mb-2">Substitusikan y = <B id="k2_ysub" w="w-10" /> ke persamaan 1 :</p>
          <div className="rounded-xl bg-[#0d1627]/80 border border-white/8 p-3 font-mono text-sm mb-3 space-y-1">
            <p className="flex items-center gap-1">
              x + <B id="k2_ysub" w="w-10" /> = 5
            </p>
            <p className="flex items-center gap-1 text-emerald-200">
              x = <B id="k2_xhasil" w="w-10" />
            </p>
          </div>

          <p className="text-white/80">
            Maka nilai x = <B id="k2_xfinal" w="w-10" /> dan y = <B id="k2_yfinal" w="w-10" />
          </p>
          <CK sectionKey="k2step3" />
        </StepCard>

        <StepCard step="4" title="Memeriksa Hasil Kembali">
          <p className="text-white/70 text-xs mb-3">Substitusikan x = 3 dan y = 2 ke kedua persamaan:</p>
          <div className="space-y-2 font-mono text-sm">
            <p className="flex flex-wrap items-center gap-1">
              <span className="text-white/60">Persamaan 1 :</span>
              <B id="k2_cek1a" w="w-8" /> + <B id="k2_cek1b" w="w-8" /> = <B id="k2_cek1c" w="w-8" />
              <span className="text-white/50 font-body text-xs">(hasil harus 5)</span>
            </p>
            <p className="flex flex-wrap items-center gap-1">
              <span className="text-white/60">Persamaan 2 :</span>
              2(<B id="k2_cek2a" w="w-8" />) − <B id="k2_cek2b" w="w-8" /> = <B id="k2_cek2c" w="w-8" />
              <span className="text-white/50 font-body text-xs">(hasil harus 4)</span>
            </p>
          </div>
          <CK sectionKey="k2step4" />
        </StepCard>

        <div className="rounded-xl border border-white/8 bg-white/3 p-3 mb-6">
          <p className="text-xs text-white/50 font-body mb-1">💬 Kesan menggunakan metode substitusi :</p>
          <textarea rows={2} className="w-full bg-transparent text-sm text-white/80 font-body outline-none resize-none placeholder-white/25" placeholder="Tuliskan kesanmu di sini…" />
        </div>


        {/* ══════════════════════════════════════════════════════
             BAGIAN B — METODE CAMPURAN (KASUS 3)
        ══════════════════════════════════════════════════════ */}
        <SectionHeader label="B. Metode Campuran — KASUS 3" color="violet">
          Tentukan penyelesaian dari <span className="font-mono text-white">2x + y = 5</span> dan <span className="font-mono text-white">3x − 2y = 11</span> dengan x, y ∈ ℝ menggunakan <strong className="text-violet-300">metode campuran</strong>.
        </SectionHeader>

        <StepCard step="1" title="Memahami Masalah">
          <p>Unsur yang <span className="text-yellow-300">diketahui</span> :</p>
          <p><B id="k3_dik" w="w-64" mono={false} /></p>
          <p className="mt-2">Unsur yang <span className="text-yellow-300">ditanyakan</span> :</p>
          <p><B id="k3_tan" w="w-48" mono={false} /></p>
          <CK sectionKey="k3step1" />
        </StepCard>

        <StepCard step="2" title="Merencanakan Strategi">
          <div className="flex items-start gap-2">
            <span className="text-violet-400 mt-0.5">✦</span>
            <p>Metode <strong className="text-violet-300">campuran</strong>, yaitu menggunakan metode eliminasi terlebih dahulu untuk mendapatkan salah satu nilai variabel, kemudian menggunakan metode substitusi untuk nilai variabel lainnya.</p>
          </div>
        </StepCard>

        <StepCard step="3" title="Menjalankan Rencana Penyelesaian">
          <p className="font-mono text-xs text-white/60 mb-2">2x + y = 5 &nbsp; … (persamaan 1)<br />3x − 2y = 11 … (persamaan 2)</p>

          <p className="text-xs text-white/70 mb-2">Langkah 1 — <strong className="text-cyan-300">Eliminasi</strong> variabel y (KPK koefisien y: 1 dan 2 = 2, kalikan P1 dengan 2):</p>
          <div className="rounded-xl bg-[#0d1627]/80 border border-white/8 p-3 font-mono text-sm mb-3">
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 items-center">
              <span className="text-white/50 text-xs">3x − 2y = 11 × 1</span>
              <span className="flex items-center gap-1 flex-wrap">
                <B id="k3_r1a" w="w-10" /> − <B id="k3_r1b" w="w-10" /> = <B id="k3_r1c" w="w-8" />
              </span>
              <span className="text-white/50 text-xs">2x + y = 5 &nbsp; × 2</span>
              <span className="flex items-center gap-1 flex-wrap">
                <B id="k3_r2a" w="w-10" /> + <B id="k3_r2b" w="w-10" /> = <B id="k3_r2c" w="w-8" />
              </span>
              <span className="text-white/30 text-xs border-t border-white/10 pt-1">+</span>
              <span className="border-t border-white/20 pt-1 flex items-center gap-1">
                <B id="k3_resl" w="w-12" /> = <B id="k3_resr" w="w-12" />
              </span>
              <span />
              <span className="flex items-center gap-1 text-yellow-200">
                x = <B id="k3_x" w="w-10" />
              </span>
            </div>
          </div>

          <p className="text-xs text-white/70 mb-2">Langkah 2 — <strong className="text-emerald-300">Substitusi</strong> x = <B id="k3_substx" w="w-8" /> ke persamaan 1 :</p>
          <div className="rounded-xl bg-[#0d1627]/80 border border-white/8 p-3 font-mono text-sm mb-3 space-y-1">
            <p>2(<B id="k3_substx" w="w-8" />) + y = 5</p>
            <p className="flex items-center gap-1">
              <B id="k3_kiri" w="w-8" /> + y = 5
            </p>
            <p className="flex items-center gap-1 text-violet-200">
              y = <B id="k3_y" w="w-10" />
            </p>
          </div>

          <p className="text-white/80">
            Maka nilai x = <B id="k3_xfinal" w="w-10" /> dan y = <B id="k3_yfinal" w="w-10" />
          </p>
          <CK sectionKey="k3step3" />
        </StepCard>

        <StepCard step="4" title="Memeriksa Hasil Kembali">
          <p className="text-white/70 text-xs mb-3">Substitusikan x = 3 dan y = −1 ke kedua persamaan:</p>
          <div className="space-y-2 font-mono text-sm">
            <p className="flex flex-wrap items-center gap-1">
              <span className="text-white/60">Persamaan 1 :</span>
              2(<B id="k3_cek1a" w="w-8" />) + (<B id="k3_cek1b" w="w-8" />) = <B id="k3_cek1c" w="w-8" />
              <span className="text-white/50 font-body text-xs">(hasil harus 5)</span>
            </p>
            <p className="flex flex-wrap items-center gap-1">
              <span className="text-white/60">Persamaan 2 :</span>
              3(<B id="k3_cek2a" w="w-8" />) − 2(<B id="k3_cek2b" w="w-8" />) = <B id="k3_cek2c" w="w-8" />
              <span className="text-white/50 font-body text-xs">(hasil harus 11)</span>
            </p>
          </div>
          <CK sectionKey="k3step4" />
        </StepCard>

        <div className="rounded-xl border border-white/8 bg-white/3 p-3 mb-6">
          <p className="text-xs text-white/50 font-body mb-1">💬 Kesan menggunakan metode campuran :</p>
          <textarea rows={2} className="w-full bg-transparent text-sm text-white/80 font-body outline-none resize-none placeholder-white/25" placeholder="Tuliskan kesanmu di sini…" />
        </div>

        {/* Footer */}
        <div className="text-center">
          <button
            onClick={() => window.history.back()}
            className="text-sm text-white/40 hover:text-cyan-400 transition-colors font-body"
          >
            ← Kembali ke menu SPLDV
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetodeEliminasiLKPDPage;
