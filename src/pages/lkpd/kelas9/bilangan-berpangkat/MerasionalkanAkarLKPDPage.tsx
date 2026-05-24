import { useState, useRef, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

/* ══════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════ */

type BoxAnswers = string[];

type EqLine = {
  kind?: "eq";
  text: string;
  boxes: BoxAnswers[];
  hint?: string;
  isHeader?: boolean;
};

type Line = EqLine;

type Problem = {
  n: number;
  emoji: string;
  tipe: 1 | 2;
  title: string;
  color: string;
  border: string;
  badge: string;
  lines: Line[];
};

/* ══════════════════════════════════════════════════════════
   PROBLEM DATA
══════════════════════════════════════════════════════════ */

const problems: Problem[] = [

  /* ── TIPE 1 ─────────────────────────────────────────── */

  {
    n: 1, emoji: "🌱", tipe: 1, title: "Rasionalkan  3 / √5",
    color: "from-cyan-900/60 to-blue-900/60", border: "border-cyan-500/40", badge: "bg-cyan-500/20 text-cyan-300",
    lines: [
      { text: "3 / √5", boxes: [], isHeader: true },
      { text: "= (3/√5)  ×  (%% / %%)",         boxes: [["√5"], ["√5"]],       hint: "Kalikan dengan √5/√5 agar nilai pecahan tetap sama" },
      { text: "= 3√5 / %%",                       boxes: [["5"]],                hint: "√5 × √5 = 5" },
      { text: "= %%",                              boxes: [["3√5/5"]],           hint: "Tidak bisa disederhanakan lagi → 3√5/5" },
    ],
  },

  {
    n: 2, emoji: "🌱", tipe: 1, title: "Rasionalkan  6 / √3",
    color: "from-violet-900/60 to-purple-900/60", border: "border-violet-500/40", badge: "bg-violet-500/20 text-violet-300",
    lines: [
      { text: "6 / √3", boxes: [], isHeader: true },
      { text: "= (6/√3)  ×  (%% / %%)",           boxes: [["√3"], ["√3"]],       hint: "Kalikan dengan √3/√3" },
      { text: "= 6√3 / %%",                         boxes: [["3"]],                hint: "√3 × √3 = 3" },
      { text: "= %%",                                boxes: [["2√3"]],             hint: "6√3/3 = 2√3 (sederhanakan 6/3 = 2)" },
    ],
  },

  {
    n: 3, emoji: "🌱", tipe: 1, title: "Rasionalkan  4 / √2",
    color: "from-amber-900/60 to-yellow-900/60", border: "border-amber-500/40", badge: "bg-amber-500/20 text-amber-300",
    lines: [
      { text: "4 / √2", boxes: [], isHeader: true },
      { text: "= (4/√2)  ×  (%% / %%)",            boxes: [["√2"], ["√2"]],       hint: "Kalikan dengan √2/√2" },
      { text: "= 4√2 / %%",                          boxes: [["2"]],                hint: "√2 × √2 = 2" },
      { text: "= %%",                                 boxes: [["2√2"]],             hint: "4√2/2 = 2√2 (sederhanakan 4/2 = 2)" },
    ],
  },

  {
    n: 4, emoji: "🌱", tipe: 1, title: "Rasionalkan  10 / √5",
    color: "from-emerald-900/60 to-green-900/60", border: "border-emerald-500/40", badge: "bg-emerald-500/20 text-emerald-300",
    lines: [
      { text: "10 / √5", boxes: [], isHeader: true },
      { text: "= (10/√5)  ×  (%% / %%)",           boxes: [["√5"], ["√5"]],       hint: "Kalikan dengan √5/√5" },
      { text: "= 10√5 / %%",                         boxes: [["5"]],                hint: "√5 × √5 = 5" },
      { text: "= %%",                                 boxes: [["2√5"]],             hint: "10√5/5 = 2√5 (sederhanakan 10/5 = 2)" },
    ],
  },

  /* ── TIPE 2 ─────────────────────────────────────────── */

  {
    n: 5, emoji: "🔁", tipe: 2, title: "Rasionalkan  3 / (√5 + √2)",
    color: "from-rose-900/60 to-red-900/60", border: "border-rose-500/40", badge: "bg-rose-500/20 text-rose-300",
    lines: [
      { text: "3 / (√5 + √2)", boxes: [], isHeader: true },
      { text: "= (3/(√5 + √2))  ×  (%% / %%)",    boxes: [["(√5 − √2)","√5 − √2"], ["(√5 − √2)","√5 − √2"]], hint: "Sekawan dari (√5 + √2) adalah (√5 − √2)" },
      { text: "= 3(%%) / ((√5)² − (√2)²)",        boxes: [["√5 − √2","(√5 − √2)"]],                           hint: "Penyebut = selisih kuadrat: (a+b)(a−b) = a² − b²" },
      { text: "= 3(√5 − √2) / (%% − %%)",          boxes: [["5"], ["2"]],                                       hint: "(√5)² = 5 dan (√2)² = 2" },
      { text: "= 3(√5 − √2) / %%",                  boxes: [["3"]],                                              hint: "5 − 2 = 3" },
      { text: "= %%",                                boxes: [["√5 − √2","√5−√2"]],                              hint: "3(√5 − √2)/3 = √5 − √2" },
    ],
  },

  {
    n: 6, emoji: "🔁", tipe: 2, title: "Rasionalkan  4 / (√7 − √3)",
    color: "from-orange-900/60 to-amber-900/60", border: "border-orange-500/40", badge: "bg-orange-500/20 text-orange-300",
    lines: [
      { text: "4 / (√7 − √3)", boxes: [], isHeader: true },
      { text: "= (4/(√7 − √3))  ×  (%% / %%)",    boxes: [["(√7 + √3)","√7 + √3"], ["(√7 + √3)","√7 + √3"]], hint: "Sekawan dari (√7 − √3) adalah (√7 + √3)" },
      { text: "= 4(%%) / ((√7)² − (√3)²)",        boxes: [["√7 + √3","(√7 + √3)"]],                           hint: "Penyebut: (a−b)(a+b) = a² − b²" },
      { text: "= 4(√7 + √3) / (%% − %%)",          boxes: [["7"], ["3"]],                                       hint: "(√7)² = 7 dan (√3)² = 3" },
      { text: "= 4(√7 + √3) / %%",                  boxes: [["4"]],                                              hint: "7 − 3 = 4" },
      { text: "= %%",                                boxes: [["√7 + √3","√7+√3"]],                              hint: "4(√7 + √3)/4 = √7 + √3" },
    ],
  },

  {
    n: 7, emoji: "🔁", tipe: 2, title: "Rasionalkan  6 / (√5 − √2)",
    color: "from-sky-900/60 to-indigo-900/60", border: "border-sky-500/40", badge: "bg-sky-500/20 text-sky-300",
    lines: [
      { text: "6 / (√5 − √2)", boxes: [], isHeader: true },
      { text: "= (6/(√5 − √2))  ×  (%% / %%)",    boxes: [["(√5 + √2)","√5 + √2"], ["(√5 + √2)","√5 + √2"]], hint: "Sekawan dari (√5 − √2) adalah (√5 + √2)" },
      { text: "= 6(%%) / ((√5)² − (√2)²)",        boxes: [["√5 + √2","(√5 + √2)"]],                           hint: "Penyebut: (a−b)(a+b) = a² − b²" },
      { text: "= 6(√5 + √2) / (%% − %%)",          boxes: [["5"], ["2"]],                                       hint: "(√5)² = 5 dan (√2)² = 2" },
      { text: "= 6(√5 + √2) / %%",                  boxes: [["3"]],                                              hint: "5 − 2 = 3" },
      { text: "= %%",                                boxes: [["2(√5 + √2)","2√5 + 2√2","2(√5+√2)"]],           hint: "6(√5+√2)/3 = 2(√5+√2) = 2√5 + 2√2" },
    ],
  },

  {
    n: 8, emoji: "🔁", tipe: 2, title: "Rasionalkan  2 / (3 + √5)",
    color: "from-fuchsia-900/60 to-pink-900/60", border: "border-fuchsia-500/40", badge: "bg-fuchsia-500/20 text-fuchsia-300",
    lines: [
      { text: "2 / (3 + √5)", boxes: [], isHeader: true },
      { text: "= (2/(3 + √5))  ×  (%% / %%)",     boxes: [["(3 − √5)","3 − √5"], ["(3 − √5)","3 − √5"]],    hint: "Sekawan dari (3 + √5) adalah (3 − √5)" },
      { text: "= 2(%%) / (3² − (√5)²)",            boxes: [["3 − √5","(3 − √5)"]],                            hint: "Penyebut: (a+b)(a−b) = a² − b²" },
      { text: "= 2(3 − √5) / (%% − %%)",           boxes: [["9"], ["5"]],                                      hint: "3² = 9 dan (√5)² = 5" },
      { text: "= 2(3 − √5) / %%",                   boxes: [["4"]],                                             hint: "9 − 5 = 4" },
      { text: "= %%",                                boxes: [["(3 − √5)/2","(3−√5)/2"]],                       hint: "2(3−√5)/4 = (3−√5)/2" },
    ],
  },
];

/* ══════════════════════════════════════════════════════════
   STATE TYPES
══════════════════════════════════════════════════════════ */

type BoxState  = { value: string; status: "idle"|"correct"|"wrong" };
type LineState = { boxStates: BoxState[]; status: "idle"|"correct"|"wrong" };

function initLineState(line: Line): LineState {
  if (line.isHeader || line.boxes.length === 0) return { boxStates: [], status: "correct" };
  return { boxStates: line.boxes.map(() => ({ value: "", status: "idle" as const })), status: "idle" };
}

/* ══════════════════════════════════════════════════════════
   INLINE BOX
══════════════════════════════════════════════════════════ */

function InlineBox({ value, status, onChange, onEnter, disabled }: {
  value: string; status: "idle"|"correct"|"wrong";
  onChange: (v: string) => void;
  onEnter: () => void;
  disabled: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const width = Math.max(52, value.length * 9 + 32);
  return (
    <input ref={ref} type="text"
      disabled={disabled || status === "correct"}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") onEnter(); }}
      style={{ width }}
      className={`
        inline-block mx-1 px-2 py-0.5 rounded-lg border text-center font-mono text-sm align-baseline
        outline-none transition-all duration-200
        ${status === "correct" ? "bg-emerald-500/20 border-emerald-400/60 text-emerald-200 cursor-default"
        : status === "wrong"   ? "bg-rose-500/15 border-rose-400/60 text-rose-200"
        : disabled             ? "bg-white/5 border-white/10 text-white/25 cursor-not-allowed"
        : "bg-white/10 border-white/30 text-white focus:border-yellow-400/70 focus:bg-white/15"}
      `}
    />
  );
}

/* ══════════════════════════════════════════════════════════
   EQ LINE ROW
══════════════════════════════════════════════════════════ */

function EqLineRow({ line, lineState, onBoxChange, onCheck, locked }: {
  line: EqLine; lineState: LineState;
  onBoxChange: (bi: number, v: string) => void;
  onCheck: () => void;
  locked: boolean;
}) {
  const isDone    = lineState.status === "correct";
  const isWrong   = lineState.status === "wrong";
  const noBoxes   = line.isHeader || line.boxes.length === 0;
  const allFilled = lineState.boxStates.every(b => b.value.trim() !== "");
  const parts     = line.text.split("%%");

  return (
    <div className={`transition-all duration-300 ${locked ? "opacity-25 select-none pointer-events-none" : ""}`}>
      <div className={`flex items-center flex-wrap gap-y-1 rounded-xl px-3 py-2 border font-mono text-sm leading-relaxed transition-all
        ${noBoxes  ? "border-white/8 bg-white/3 text-white/60 italic"
        : isDone   ? "border-emerald-500/30 bg-emerald-500/8 text-white"
        : isWrong  ? "border-rose-500/30 bg-rose-500/8 text-white"
        :            "border-white/10 bg-white/5 text-white"}`}>
        {noBoxes ? (
          <span className="text-yellow-300 font-bold text-base tracking-wide">{line.text}</span>
        ) : (
          <>
            {parts.map((part, pi) => (
              <span key={pi} className="inline-flex items-center flex-wrap">
                <span>{part}</span>
                {pi < parts.length - 1 && (
                  <InlineBox
                    value={lineState.boxStates[pi]?.value ?? ""}
                    status={lineState.boxStates[pi]?.status ?? "idle"}
                    onChange={v => onBoxChange(pi, v)}
                    onEnter={() => { if (allFilled) onCheck(); }}
                    disabled={locked || isDone}
                  />
                )}
              </span>
            ))}
            {!isDone && (
              <button disabled={!allFilled} onClick={() => { playPopSound(); onCheck(); }}
                className="ml-2 inline-flex items-center gap-1 px-3 py-0.5 rounded-lg border text-xs font-bold transition-all cursor-pointer
                  bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:text-white
                  disabled:opacity-30 disabled:cursor-not-allowed">
                Cek ✓
              </button>
            )}
            {isDone  && <span className="ml-2 text-emerald-400 text-xs font-bold">✅</span>}
            {isWrong && (
              <span className="ml-2 text-rose-400 text-xs">
                ✗ {line.hint && <span className="text-white/45 ml-1">💡 {line.hint}</span>}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PROBLEM CARD
══════════════════════════════════════════════════════════ */

function ProblemCard({ prob, lineStates, onBoxChange, onCheck }: {
  prob: Problem;
  lineStates: LineState[];
  onBoxChange: (li: number, bi: number, v: string) => void;
  onCheck: (li: number) => void;
}) {
  const [showSol, setShowSol] = useState(false);
  const allDone = lineStates.every(s => s.status === "correct");
  const doneCount = lineStates.filter(s => s.status === "correct" && s.boxStates.length > 0).length;
  const totalCount = lineStates.filter(s => s.boxStates.length > 0).length;

  return (
    <div className={`relative rounded-2xl overflow-hidden border ${prob.border} bg-gradient-to-br ${prob.color} backdrop-blur-sm`}>
      {allDone && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {["⭐","✨","🎉","💫","🌟","🎊"].map((e, i) => (
            <span key={i} className="absolute text-base animate-bounce"
              style={{ top:`${8+i*13}%`, left:`${4+i*16}%`, animationDelay:`${i*0.12}s`, opacity:0.5 }}>{e}</span>
          ))}
        </div>
      )}

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full ${prob.badge} border border-white/20 flex items-center justify-center text-base shrink-0 font-black`}>
            {allDone ? "✅" : prob.n}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-1">
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${prob.badge}`}>
                {prob.emoji} Soal {prob.n}
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${prob.badge}`}>
                Tipe {prob.tipe === 1 ? "1 — Penyebut √a" : "2 — Penyebut (a ± √b)"}
              </span>
            </div>
            <p className="text-white font-bold text-sm font-mono">{prob.title}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-white/35 text-[10px] font-bold uppercase tracking-widest">
            Langkah Penyelesaian ({doneCount}/{totalCount})
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Lines */}
        <div className="flex flex-col gap-2">
          {prob.lines.map((line, li) => {
            const prevDone = li === 0 || lineStates[li - 1].status === "correct";
            return (
              <EqLineRow key={li}
                line={line} lineState={lineStates[li]}
                onBoxChange={(bi, v) => onBoxChange(li, bi, v)}
                onCheck={() => onCheck(li)}
                locked={!prevDone} />
            );
          })}
        </div>

        {/* Solution toggle */}
        {allDone && (
          <div className="mt-4">
            <button onClick={() => { playPopSound(); setShowSol(s => !s); }}
              className="w-full py-2 rounded-xl border text-sm font-bold transition-all cursor-pointer font-body bg-white/8 border-white/15 text-white/60 hover:bg-white/12 hover:text-white/80">
              {showSol ? "▲ Tutup Pembahasan" : "▼ Lihat Pembahasan 📖"}
            </button>
            {showSol && (
              <div className="mt-2 rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-col gap-1 font-mono text-sm">
                  {prob.lines.map((line, li) => (
                    <span key={li} className={line.isHeader ? "text-yellow-300 font-bold" : "text-white/80"}>
                      {line.text.replace(/%%/g, "■")}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */

const MerasionalkanAkarLKPDPage = () => {
  const navigate = useNavigate();

  const [allLineStates, setAllLineStates] = useState<LineState[][]>(
    problems.map(p => p.lines.map(initLineState))
  );

  const handleBoxChange = (pi: number, li: number, bi: number, v: string) =>
    setAllLineStates(prev => {
      const next = prev.map(ls => ls.map(s => ({ ...s, boxStates: s.boxStates.map(b => ({ ...b })) })));
      next[pi][li].boxStates[bi] = { value: v, status: "idle" };
      next[pi][li].status = "idle";
      return next;
    });

  const handleCheck = (pi: number, li: number) => {
    const line = problems[pi].lines[li];
    const ls   = allLineStates[pi][li];
    const norm = (s: string) => s.trim().replace(/\s+/g, "").toLowerCase();
    const newBoxes = ls.boxStates.map((b, bi) => ({
      ...b,
      status: (line.boxes[bi].some(a => norm(a) === norm(b.value)) ? "correct" : "wrong") as "correct"|"wrong",
    }));
    const allCorrect = newBoxes.every(b => b.status === "correct");
    setAllLineStates(prev => {
      const next = prev.map(ls => ls.map(s => ({ ...s, boxStates: s.boxStates.map(b => ({ ...b })) })));
      next[pi][li] = { boxStates: newBoxes, status: allCorrect ? "correct" : "wrong" };
      return next;
    });
  };

  const tipe1 = problems.filter(p => p.tipe === 1);
  const tipe2 = problems.filter(p => p.tipe === 2);

  const totalSteps = allLineStates.reduce((a, ls) => a + ls.filter(s => s.boxStates.length > 0).length, 0);
  const doneSteps  = allLineStates.reduce((a, ls) => a + ls.filter(s => s.status === "correct" && s.boxStates.length > 0).length, 0);
  const pct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;
  const allDone = doneSteps === totalSteps;

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── HEADER ── */}
        <div className="flex flex-col items-center mb-7 text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 border-2 border-yellow-400/60 flex items-center justify-center mb-3">
            <span className="text-3xl">🔁</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-yellow-300 mb-1"
            style={{ textShadow: "0 0 24px rgba(234,179,8,0.7)" }}>
            MERASIONALKAN BENTUK AKAR
          </h1>
          <p className="text-white/50 text-xs font-body">Kelas 9 · Bilangan Berpangkat · LKPD Interaktif</p>
          <p className="mt-2 text-white/60 text-sm font-body max-w-xl">
            Ubah pecahan dengan penyebut akar menjadi pecahan dengan penyebut bilangan rasional — isi kotak dalam setiap langkah!
          </p>
        </div>

        {/* ── MENGAPA DIRASIONALKAN ── */}
        <div className="mb-5 bg-yellow-900/20 border border-yellow-500/25 rounded-xl p-4">
          <p className="text-yellow-300 text-xs font-bold mb-2">💡 Mengapa penyebut akar harus dirasionalkan?</p>
          <div className="space-y-1 text-sm font-body text-white/75 leading-relaxed">
            <p>📌 Untuk <strong className="text-yellow-200">menyederhanakan bentuk</strong> pecahan agar lebih mudah dibaca.</p>
            <p>📌 Untuk <strong className="text-yellow-200">memudahkan proses perhitungan</strong> matematika selanjutnya.</p>
            <p>📌 Untuk mengubah penyebut dari bilangan <strong className="text-yellow-200">irasional (akar) → rasional (bukan akar)</strong>.</p>
          </div>
        </div>

        {/* ── RUMUS TIPE 1 ── */}
        <div className="mb-5 bg-cyan-900/20 border border-cyan-500/25 rounded-xl p-4">
          <p className="text-cyan-300 text-xs font-bold mb-3">🌱 Tipe 1 — Penyebut berbentuk √a</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-3 font-mono text-sm text-center space-y-1">
              <p className="text-white/60 text-xs">Rumus:</p>
              <p className="text-white text-base font-bold">p / √a</p>
              <p className="text-white/50 text-xs">×</p>
              <p className="text-white text-base font-bold">√a / √a</p>
              <p className="text-cyan-400 text-xs">↓</p>
              <p className="text-cyan-300 font-bold">= p√a / a</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 font-mono text-sm space-y-2">
              <p className="text-white/60 text-xs font-body">Contoh:</p>
              <p className="text-white">1/√3 × √3/√3</p>
              <p className="text-white">= 1×√3 / (√3×√3)</p>
              <p className="text-white">= √3 / 3</p>
              <p className="text-cyan-300 font-bold">= √3/3  ✅</p>
            </div>
          </div>
        </div>

        {/* ── PROGRESS ── */}
        <div className="mb-5 bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-xs font-bold">Progress</span>
            <span className={`text-xs font-bold ${allDone ? "text-emerald-400" : "text-yellow-400"}`}>
              {doneSteps}/{totalSteps} langkah ({pct}%)
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${pct}%` }} />
          </div>
          {allDone && (
            <p className="mt-2 text-center text-emerald-400 text-sm font-bold animate-bounce">
              🎉 Luar biasa! Semua soal merasionalkan berhasil kamu kuasai! 🌟
            </p>
          )}
        </div>

        {/* ── TIPE 1 PROBLEMS ── */}
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-cyan-500/30" />
          <span className="text-cyan-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30">
            🌱 Tipe 1 — Penyebut √a (4 soal)
          </span>
          <div className="h-px flex-1 bg-cyan-500/30" />
        </div>
        <div className="flex flex-col gap-5 mb-8">
          {tipe1.map(prob => {
            const pi = problems.indexOf(prob);
            return (
              <ProblemCard key={pi} prob={prob} lineStates={allLineStates[pi]}
                onBoxChange={(li, bi, v) => handleBoxChange(pi, li, bi, v)}
                onCheck={li => handleCheck(pi, li)} />
            );
          })}
        </div>

        {/* ── RUMUS TIPE 2 ── */}
        <div className="mb-5 bg-rose-900/20 border border-rose-500/25 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-3">🔁 Tipe 2 — Penyebut berbentuk (a + √b) atau (a − √b)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-3 font-mono text-sm space-y-1">
              <p className="text-white/60 text-xs font-body">Penyebut (a + √b) → kalikan sekawan (a − √b):</p>
              <p className="text-white text-xs">p/(a + √b) × (a − √b)/(a − √b)</p>
              <p className="text-rose-300 font-bold text-xs">= p(a − √b) / (a² − b)</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 font-mono text-sm space-y-1">
              <p className="text-white/60 text-xs font-body">Penyebut (a − √b) → kalikan sekawan (a + √b):</p>
              <p className="text-white text-xs">p/(a − √b) × (a + √b)/(a + √b)</p>
              <p className="text-rose-300 font-bold text-xs">= p(a + √b) / (a² − b)</p>
            </div>
          </div>
          <div className="mt-3 bg-white/5 rounded-lg p-3">
            <p className="text-white/50 text-xs font-body">💡 <strong className="text-yellow-300">Kunci:</strong> penyebut menggunakan <strong className="text-rose-300">a² − b²  =  (a+b)(a−b)</strong> sehingga akar hilang!</p>
          </div>
        </div>

        {/* ── TIPE 2 PROBLEMS ── */}
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-rose-500/30" />
          <span className="text-rose-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30">
            🔁 Tipe 2 — Penyebut (a ± √b) (4 soal)
          </span>
          <div className="h-px flex-1 bg-rose-500/30" />
        </div>
        <div className="flex flex-col gap-5 mb-8">
          {tipe2.map(prob => {
            const pi = problems.indexOf(prob);
            return (
              <ProblemCard key={pi} prob={prob} lineStates={allLineStates[pi]}
                onBoxChange={(li, bi, v) => handleBoxChange(pi, li, bi, v)}
                onCheck={li => handleCheck(pi, li)} />
            );
          })}
        </div>

        {/* ── KESIMPULAN ── */}
        <div className="mb-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-yellow-300 text-xs font-bold mb-3">📋 Kesimpulan</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-body text-white/75">
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
              <p className="text-cyan-300 font-bold mb-1">Tipe 1: Penyebut √a</p>
              <p>Kalikan dengan <strong className="text-white">√a/√a</strong> → penyebut jadi <strong className="text-white">a</strong></p>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
              <p className="text-rose-300 font-bold mb-1">Tipe 2: Penyebut (a ± √b)</p>
              <p>Kalikan dengan <strong className="text-white">sekawannya</strong> → gunakan rumus <strong className="text-white">a² − b²</strong></p>
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div className="mt-4 text-center">
          <button onClick={() => { playPopSound(); navigate("/lkpd/kelas-9/bilangan-berpangkat"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke LKPD Bilangan Berpangkat
          </button>
        </div>
      </div>
    </div>
  );
};

export default MerasionalkanAkarLKPDPage;
