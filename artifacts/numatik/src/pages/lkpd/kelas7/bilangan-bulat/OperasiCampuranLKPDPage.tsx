import { useState, useRef, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";

/* ══════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════ */

/** One inline box inside an equation line */
type BoxAnswers = string[]; // acceptable answers for that single box

/** A line of an equation, may contain %% placeholders for boxes */
type EqLine = {
  kind?: "eq";
  text: string;       // equation text; %% = blank box
  boxes: BoxAnswers[]; // one entry per %% in text
  hint?: string;
  isHeader?: boolean; // just display, no boxes
};

type ChoiceLine = {
  kind: "choice";
  label: string;
  choices: { key: string; text: string }[];
  correct: string;
  hint?: string;
};

type Line = EqLine | ChoiceLine;

type Problem = {
  n: number;
  emoji: string;
  title: string;
  context: string;
  color: string;
  border: string;
  badge: string;
  lines: Line[];
};

/* ══════════════════════════════════════════════════════════
   PROBLEM DATA
══════════════════════════════════════════════════════════ */

const problems: Problem[] = [
  /* ── Soal 1 ─────────────────────────────────── */
  {
    n: 1, emoji: "🧮", title: "Operasi Campuran I",
    context: "Hasil dari −25 × (8 + (−9)) + (2 − 7) adalah …",
    color: "from-cyan-900/60 to-blue-900/60",
    border: "border-cyan-500/40", badge: "bg-cyan-500/20 text-cyan-300",
    lines: [
      { text: "−25 × (8 + (−9)) + (2 − 7)", boxes: [], isHeader: true },
      { text: "= −25 × (%%) + (%%)",         boxes: [["-1","–1"], ["-5","–5"]], hint: "Selesaikan kurung dulu: 8+(−9) dan 2−7" },
      { text: "= %% + (−5)",                  boxes: [["25"]],                   hint: "−25 × (−1) = 25" },
      { text: "= %%",                          boxes: [["20"]],                   hint: "25 + (−5) = 20" },
    ],
  },

  /* ── Soal 2 ─────────────────────────────────── */
  {
    n: 2, emoji: "🔢", title: "Operasi Campuran II",
    context: "Hasil dari (−20) + 8 × 5 − 18 : (−3) adalah …",
    color: "from-violet-900/60 to-purple-900/60",
    border: "border-violet-500/40", badge: "bg-violet-500/20 text-violet-300",
    lines: [
      { text: "(−20) + 8 × 5 − 18 : (−3)",   boxes: [], isHeader: true },
      { text: "= (−20) + %% − (%%)",           boxes: [["40"], ["-6","–6"]], hint: "Kali/bagi dulu: 8×5 dan 18÷(−3)" },
      { text: "= (−20) + 40 + %%",             boxes: [["6"]],               hint: "−(−6) = +6, jadi tambahkan 6" },
      { text: "= %%",                           boxes: [["26"]],              hint: "−20 + 40 + 6 = 26" },
    ],
  },

  /* ── Soal 3 ─────────────────────────────────── */
  {
    n: 3, emoji: "📝", title: "Skor Bahasa Inggris Budi",
    context: "50 soal: benar +4 poin, salah −2 poin, tidak dijawab −1 poin.\nBudi menjawab 44 soal dan benar 36 soal. Skor Budi adalah …",
    color: "from-amber-900/60 to-yellow-900/60",
    border: "border-amber-500/40", badge: "bg-amber-500/20 text-amber-300",
    lines: [
      { text: "Skor = (benar × 4) + (salah × (−2)) + (kosong × (−1))", boxes: [], isHeader: true },
      { text: "Soal salah  = 44 − 36 = %%",                             boxes: [["8"]],  hint: "Jumlah yang dijawab − yang benar" },
      { text: "Soal kosong = 50 − 44 = %%",                             boxes: [["6"]],  hint: "Total soal − yang dijawab" },
      { text: "Skor = 36 × 4 + %% × (−2) + %% × (−1)",                 boxes: [["8"], ["6"]], hint: "Masukkan soal salah dan kosong" },
      { text: "     = %% + (%%) + (%%)",                                 boxes: [["144"], ["-16","–16"], ["-6","–6"]], hint: "Hitung masing-masing: 36×4, 8×(−2), 6×(−1)" },
      { text: "     = %%",                                               boxes: [["122"]], hint: "144 − 16 − 6 = 122" },
    ],
  },

  /* ── Soal 4 ─────────────────────────────────── */
  {
    n: 4, emoji: "⚽", title: "Nilai Tim SMP MAUNG",
    context: "Dalam suatu pertandingan sepak bola, setiap kemenangan mendapat nilai 3, seri bernilai 1, dan kalah bernilai −2.\nJika tim SMP MAUNG bermain sebanyak 20 kali dengan meraih 10 kemenangan dan 4 seri,\nmaka nilai yang diperoleh tim SMP MAUNG adalah …",
    color: "from-emerald-900/60 to-green-900/60",
    border: "border-emerald-500/40", badge: "bg-emerald-500/20 text-emerald-300",
    lines: [
      { text: "Nilai = (menang × 3) + (seri × 1) + (kalah × (−2))", boxes: [], isHeader: true },
      { text: "Kalah = 20 − 10 − 4 = %%",                           boxes: [["6"]],                       hint: "Total pertandingan − menang − seri = kalah" },
      { text: "Nilai = 10 × 3 + 4 × 1 + %% × (−2)",                 boxes: [["6"]],                       hint: "Masukkan jumlah kekalahan (6) ke dalam rumus" },
      { text: "      = %% + %% + (%%)",                              boxes: [["30"], ["4"], ["-12","–12"]], hint: "Hitung: 10×3=30, 4×1=4, 6×(−2)=−12" },
      { text: "      = %%",                                           boxes: [["22"]],                      hint: "30 + 4 − 12 = 22" },
    ],
  },

  /* ── Soal 5 ─────────────────────────────────── */
  {
    n: 5, emoji: "🚌", title: "Penumpang Bus Trans Jakarta",
    context: "Bus berangkat dari terminal. Halte 1: turun 4 orang. Halte 2: naik 2 orang.\nDi pasar ada 15 orang. Berapa penumpang yang naik di terminal?",
    color: "from-rose-900/60 to-red-900/60",
    border: "border-rose-500/40", badge: "bg-rose-500/20 text-rose-300",
    lines: [
      { text: "Misal penumpang di terminal = x", boxes: [], isHeader: true },
      { text: "x − 4 + 2 = 15",                  boxes: [], isHeader: true },
      { text: "x − %% = 15",                      boxes: [["2"]], hint: "−4 + 2 = −2, jadi koefisiennya 2" },
      { text: "x = 15 + %% = %%",                 boxes: [["2"], ["17"]], hint: "Pindah ruas: x = 15 + 2" },
    ],
  },

  /* ── Soal 6 ─────────────────────────────────── */
  {
    n: 6, emoji: "🌡️", title: "Selisih Suhu Beberapa Negara",
    context: "Suhu: Wina −7°C | Seoul −1°C | Baghdad 39°C | Surabaya 33°C\nSelisih suhu yang BENAR adalah …",
    color: "from-sky-900/60 to-cyan-900/60",
    border: "border-sky-500/40", badge: "bg-sky-500/20 text-sky-300",
    lines: [
      { text: "Selisih Wina − Seoul = (−7) − (−1) = (−7) + 1 = %%",           boxes: [["−6","-6","–6"]], hint: "(−7) − (−1) = −7 + 1 = −6  → selisihnya 6°C, bukan −6°C" },
      { text: "Selisih Baghdad − Wina = 39 − (−7) = 39 + 7 = %%",             boxes: [["46"]],           hint: "39 + 7 = 46°C, bukan 30°C" },
      { text: "Selisih Surabaya − Seoul = 33 − (−1) = 33 + 1 = %%",           boxes: [["34"]],           hint: "33 + 1 = 34°C ← ini cocok dengan pilihan C!" },
      { text: "Selisih Surabaya − Wina  = 33 − (−7) = 33 + 7 = %%",           boxes: [["40"]],           hint: "33 + 7 = 40°C, bukan 39°C" },
      {
        kind: "choice",
        label: "Berdasarkan perhitungan di atas, pernyataan yang BENAR adalah …",
        choices: [
          { key: "A", text: "Selisih suhu Wina dan Seoul = −6°C" },
          { key: "B", text: "Selisih suhu Baghdad dan Wina = 30°C" },
          { key: "C", text: "Selisih suhu Surabaya dan Seoul = 34°C" },
          { key: "D", text: "Selisih suhu Surabaya dan Wina = 39°C" },
        ],
        correct: "C",
        hint: "Perhatikan hasil hitunganmu di atas — mana yang nilainya cocok?",
      },
    ],
  },

  /* ── Soal 7 ─────────────────────────────────── */
  {
    n: 7, emoji: "🍟", title: "Kembalian Uang Gorengan",
    context: "Harga: Rp5.000 per 4 gorengan. Bagus membeli 32 gorengan.\nBayar Rp50.000. Uang kembali Bagus adalah …",
    color: "from-orange-900/60 to-amber-900/60",
    border: "border-orange-500/40", badge: "bg-orange-500/20 text-orange-300",
    lines: [
      { text: "Harga 32 gorengan = (32 ÷ 4) × 5.000", boxes: [], isHeader: true },
      { text: "= %% × 5.000",                          boxes: [["8"]],              hint: "32 ÷ 4 = 8 kelompok" },
      { text: "= Rp %%",                               boxes: [["40000","40.000"]], hint: "8 × 5.000 = 40.000" },
      { text: "Kembalian = 50.000 − %% = Rp %%",       boxes: [["40000","40.000"], ["10000","10.000"]], hint: "50.000 − 40.000 = 10.000" },
    ],
  },

  /* ── Soal 8 ─────────────────────────────────── */
  {
    n: 8, emoji: "❄️", title: "Suhu Kota Moskow",
    context: "Suhu awal 11°C. Turun 4°C setiap 15 menit.\nSuhu setelah 1 jam turun salju adalah …",
    color: "from-blue-900/60 to-indigo-900/60",
    border: "border-blue-500/40", badge: "bg-blue-500/20 text-blue-300",
    lines: [
      { text: "Suhu akhir = 11 − (interval × 4)", boxes: [], isHeader: true },
      { text: "Interval = 60 ÷ 15 = %% kali",     boxes: [["4"]],   hint: "1 jam = 60 menit → 60 ÷ 15 = 4" },
      { text: "= 11 − (%% × 4)",                  boxes: [["4"]],   hint: "Masukkan 4 interval" },
      { text: "= 11 − %%",                         boxes: [["16"]],  hint: "4 × 4 = 16" },
      { text: "= %%",                              boxes: [["-5","–5"]], hint: "11 − 16 = −5" },
    ],
  },

  /* ── Soal 9 ─────────────────────────────────── */
  {
    n: 9, emoji: "⭐", title: "Operasi Khusus ★",
    context: "Operasi ★ : a ★ b = (a × 2b) + b\nHasil dari 5 ★ 3 adalah …",
    color: "from-fuchsia-900/60 to-pink-900/60",
    border: "border-fuchsia-500/40", badge: "bg-fuchsia-500/20 text-fuchsia-300",
    lines: [
      { text: "5 ★ 3 = (5 × 2 × 3) + 3",  boxes: [], isHeader: true },
      { text: "= (5 × %%) + 3",            boxes: [["6"]],  hint: "2 × 3 = 6" },
      { text: "= %% + 3",                  boxes: [["30"]], hint: "5 × 6 = 30" },
      { text: "= %%",                      boxes: [["33"]], hint: "30 + 3 = 33" },
    ],
  },

  /* ── Soal 10 ─────────────────────────────────── */
  {
    n: 10, emoji: "💎", title: "Operasi Khusus #",
    context: "Operasi # : a # b = (a × b) − 2b\nHasil dari 5 # (−4) adalah …",
    color: "from-teal-900/60 to-emerald-900/60",
    border: "border-teal-500/40", badge: "bg-teal-500/20 text-teal-300",
    lines: [
      { text: "5 # (−4) = (5 × (−4)) − 2 × (−4)", boxes: [], isHeader: true },
      { text: "= (%%) − (%%)",                      boxes: [["-20","–20"], ["-8","–8"]], hint: "5×(−4)=−20 dan 2×(−4)=−8" },
      { text: "= (%%) + %%",                         boxes: [["-20","–20"], ["8"]], hint: "−(−8) = +8" },
      { text: "= %%",                               boxes: [["-12","–12"]], hint: "−20 + 8 = −12" },
    ],
  },
];

/* ══════════════════════════════════════════════════════════
   STATE TYPES
══════════════════════════════════════════════════════════ */

type BoxState = { value: string; status: "idle" | "correct" | "wrong" };
type LineState = { boxStates: BoxState[]; choiceSelected?: string; status: "idle"|"correct"|"wrong" };

function initLineState(line: Line): LineState {
  if (line.kind === "choice") return { boxStates: [], status: "idle" };
  const eq = line as EqLine;
  if (eq.isHeader || eq.boxes.length === 0) return { boxStates: [], status: "correct" };
  return { boxStates: eq.boxes.map(() => ({ value: "", status: "idle" as const })), status: "idle" };
}

/* ══════════════════════════════════════════════════════════
   INLINE BOX  (small input field inside equation text)
══════════════════════════════════════════════════════════ */

function InlineBox({ value, status, onChange, onEnter, disabled }: {
  value: string; status: "idle"|"correct"|"wrong";
  onChange: (v: string) => void;
  onEnter: () => void;
  disabled: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const width = Math.max(40, value.length * 10 + 28);

  return (
    <input
      ref={ref}
      type="text"
      disabled={disabled || status === "correct"}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") onEnter(); }}
      style={{ width }}
      className={`
        inline-block mx-1 px-2 py-0.5 rounded-lg border text-center font-mono text-sm align-baseline
        outline-none transition-all duration-200
        ${status === "correct"
          ? "bg-emerald-500/20 border-emerald-400/60 text-emerald-200 cursor-default"
          : status === "wrong"
          ? "bg-rose-500/15 border-rose-400/60 text-rose-200"
          : disabled
          ? "bg-white/5 border-white/10 text-white/25 cursor-not-allowed"
          : "bg-white/10 border-white/30 text-white focus:border-yellow-400/70 focus:bg-white/15"}
      `}
    />
  );
}

/* ══════════════════════════════════════════════════════════
   EQUATION LINE RENDERER
══════════════════════════════════════════════════════════ */

function EqLineRow({ line, lineState, onBoxChange, onCheck, locked }: {
  line: EqLine;
  lineState: LineState;
  onBoxChange: (bi: number, v: string) => void;
  onCheck: () => void;
  locked: boolean;
}) {
  const { language } = useLanguage();
  const checkLabel = language === "en" ? "Check ✓" : language === "ja" ? "確認 ✓" : "Cek ✓";
  const isDone   = lineState.status === "correct";
  const isWrong  = lineState.status === "wrong";
  const noBoxes  = line.isHeader || line.boxes.length === 0;
  const allFilled = lineState.boxStates.every(b => b.value.trim() !== "");

  const parts = line.text.split("%%");

  return (
    <div className={`relative transition-all duration-300 ${locked ? "opacity-30 select-none pointer-events-none" : ""}`}>
      <div className={`flex items-center flex-wrap gap-y-1 rounded-xl px-3 py-2 border font-mono text-sm leading-relaxed transition-all
        ${noBoxes
          ? "border-white/10 bg-white/3 text-white/70 italic"
          : isDone
          ? "border-emerald-500/30 bg-emerald-500/8 text-white"
          : isWrong
          ? "border-rose-500/30 bg-rose-500/8 text-white"
          : "border-white/10 bg-white/5 text-white"}`}>

        {noBoxes ? (
          <span className="text-white/60">{line.text}</span>
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
              <button
                disabled={!allFilled}
                onClick={() => { playPopSound(); onCheck(); }}
                className="ml-2 inline-flex items-center gap-1 px-3 py-0.5 rounded-lg border text-xs font-bold transition-all cursor-pointer
                  bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:text-white
                  disabled:opacity-30 disabled:cursor-not-allowed">
                {checkLabel}
              </button>
            )}

            {isDone && <span className="ml-2 text-emerald-400 text-xs font-bold">✅</span>}
            {isWrong && (
              <span className="ml-2 text-rose-400 text-xs">
                ✗ {line.hint && <span className="text-white/50 ml-1">💡 {line.hint}</span>}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CHOICE LINE RENDERER
══════════════════════════════════════════════════════════ */

function ChoiceLineRow({ line, lineState, onSelect, onCheck, locked }: {
  line: ChoiceLine;
  lineState: LineState;
  onSelect: (key: string) => void;
  onCheck: () => void;
  locked: boolean;
}) {
  const { language } = useLanguage();
  const isDone  = lineState.status === "correct";
  const isWrong = lineState.status === "wrong";
  const sel     = lineState.choiceSelected;

  return (
    <div className={`transition-all duration-300 ${locked ? "opacity-30 select-none pointer-events-none" : ""}`}>
      <div className={`rounded-xl border px-3 py-3 transition-all
        ${isDone ? "border-emerald-500/30 bg-emerald-500/8" : isWrong ? "border-rose-500/30 bg-rose-500/8" : "border-white/10 bg-white/5"}`}>
        <p className="text-white/80 text-sm font-body mb-3 leading-relaxed">{line.label}</p>
        <div className="grid grid-cols-1 gap-2">
          {line.choices.map(ch => {
            const isSelected = sel === ch.key;
            const isCorrect  = isDone && ch.key === line.correct;
            const isWrongSel = isWrong && isSelected;
            return (
              <button key={ch.key} disabled={isDone}
                onClick={() => { playPopSound(); onSelect(ch.key); }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-left text-sm font-body transition-all cursor-pointer
                  ${isCorrect  ? "bg-emerald-500/20 border-emerald-400/60 text-emerald-200"
                  : isWrongSel ? "bg-rose-500/15 border-rose-400/60 text-rose-200 line-through"
                  : isSelected ? "bg-white/15 border-white/40 text-white"
                  : "bg-white/5 border-white/10 text-white/75 hover:bg-white/10 hover:border-white/25"}`}>
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0
                  ${isCorrect ? "border-emerald-400 text-emerald-300" : isSelected ? "border-white/60 text-white" : "border-white/20 text-white/40"}`}>{ch.key}</span>
                <span>{ch.text}</span>
                {isCorrect  && <span className="ml-auto text-emerald-400">✓</span>}
                {isWrongSel && <span className="ml-auto text-rose-400">✗</span>}
              </button>
            );
          })}
        </div>
        {sel && !isDone && (
          <button onClick={() => { playPopSound(); onCheck(); }}
            className="mt-3 w-full py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/15 transition-all cursor-pointer font-body">
            {language === "en" ? "Check Answer ✓" : language === "ja" ? "答えを確認 ✓" : "Cek Jawaban ✓"}
          </button>
        )}
        {isWrong && <p className="mt-2 text-rose-400 text-xs">❌ {language === "en" ? "Not quite right." : language === "ja" ? "もう少し。" : "Kurang tepat."} {line.hint && <span className="text-white/50">💡 {line.hint}</span>}</p>}
        {isDone  && <p className="mt-2 text-emerald-400 text-xs font-bold">✅ {language === "en" ? "Correct!" : language === "ja" ? "正解！" : "Benar!"}</p>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PROBLEM CARD
══════════════════════════════════════════════════════════ */

function ProblemCard({ prob, lineStates, onBoxChange, onCheck, onChoiceSelect, onChoiceCheck }: {
  prob: Problem;
  lineStates: LineState[];
  onBoxChange: (li: number, bi: number, v: string) => void;
  onCheck: (li: number) => void;
  onChoiceSelect: (li: number, key: string) => void;
  onChoiceCheck: (li: number) => void;
}) {
  const { language } = useLanguage();
  const [showSol, setShowSol] = useState(false);
  const allDone = lineStates.every(s => s.status === "correct");
  const doneCount = lineStates.filter(s => s.status === "correct").length;

  return (
    <div className={`relative rounded-2xl overflow-hidden border ${prob.border} bg-gradient-to-br ${prob.color} backdrop-blur-sm`}>
      {allDone && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {["⭐","✨","🎉","💫","🌟","🎊","⭐","✨"].map((e, i) => (
            <span key={i} className="absolute text-base animate-bounce"
              style={{ top: `${8 + i * 11}%`, left: `${4 + i * 13}%`, animationDelay: `${i * 0.12}s`, opacity: 0.5 }}>{e}</span>
          ))}
        </div>
      )}

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full ${prob.badge} border border-white/20 flex items-center justify-center text-lg shrink-0 font-black`}>
            {allDone ? "✅" : prob.n}
          </div>
          <div>
            <div className="flex flex-wrap gap-2 mb-1">
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${prob.badge}`}>{prob.emoji} {language === "en" ? "Problem" : language === "ja" ? "問題" : "Soal"} {prob.n}</span>
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${prob.badge}`}>{prob.title}</span>
            </div>
            <p className="text-white/90 text-sm font-body leading-relaxed whitespace-pre-line">{prob.context}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-white/35 text-[10px] font-bold uppercase tracking-widest">
            {language === "en" ? "Solution Steps" : language === "ja" ? "解法ステップ" : "Langkah Penyelesaian"} ({doneCount}/{lineStates.length})
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Lines */}
        <div className="flex flex-col gap-2">
          {prob.lines.map((line, li) => {
            const prevDone = li === 0 || lineStates[li - 1].status === "correct";
            if (line.kind === "choice") {
              return (
                <ChoiceLineRow key={li}
                  line={line} lineState={lineStates[li]}
                  onSelect={key => onChoiceSelect(li, key)}
                  onCheck={() => onChoiceCheck(li)}
                  locked={!prevDone} />
              );
            }
            const eq = line as EqLine;
            return (
              <EqLineRow key={li}
                line={eq} lineState={lineStates[li]}
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
              {showSol ? (language === "en" ? "▲ Close Solution" : language === "ja" ? "▲ 閉じる" : "▲ Tutup Pembahasan") : (language === "en" ? "▼ Full Solution 📖" : language === "ja" ? "▼ 解説を見る 📖" : "▼ Lihat Pembahasan Lengkap 📖")}
            </button>
            {showSol && (
              <div className="mt-2 rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-col gap-1 font-mono text-sm">
                  {prob.lines.map((line, li) => (
                    <span key={li} className={
                      (line as EqLine).isHeader ? "text-yellow-300/80 font-bold" : "text-white/75"
                    }>
                      {(line as EqLine).text ?? (line as ChoiceLine).label}
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

const OperasiCampuranLKPDPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const s = (id: string, en: string, ja: string) => language === "en" ? en : language === "ja" ? ja : id;

  const [allLineStates, setAllLineStates] = useState<LineState[][]>(
    problems.map(p => p.lines.map(initLineState))
  );

  const patchLine = (pi: number, li: number, patch: Partial<LineState>) =>
    setAllLineStates(prev => {
      const next = prev.map(ls => ls.map(s => ({ ...s, boxStates: [...s.boxStates] })));
      next[pi][li] = { ...next[pi][li], ...patch };
      return next;
    });

  const handleBoxChange = (pi: number, li: number, bi: number, v: string) => {
    setAllLineStates(prev => {
      const next = prev.map(ls => ls.map(s => ({ ...s, boxStates: s.boxStates.map(b => ({ ...b })) })));
      next[pi][li].boxStates[bi] = { value: v, status: "idle" };
      next[pi][li].status = "idle";
      return next;
    });
  };

  const handleCheck = (pi: number, li: number) => {
    const line = problems[pi].lines[li] as EqLine;
    const ls   = allLineStates[pi][li];
    const newBoxes = ls.boxStates.map((b, bi) => {
      const accepted = line.boxes[bi];
      const norm = (s: string) => s.trim().replace(/\s/g, "").toLowerCase();
      const correct = accepted.some(a => norm(a) === norm(b.value));
      return { ...b, status: correct ? "correct" as const : "wrong" as const };
    });
    const allCorrect = newBoxes.every(b => b.status === "correct");
    patchLine(pi, li, { boxStates: newBoxes, status: allCorrect ? "correct" : "wrong" });
  };

  const handleChoiceSelect = (pi: number, li: number, key: string) => {
    patchLine(pi, li, { choiceSelected: key, status: "idle" });
  };

  const handleChoiceCheck = (pi: number, li: number) => {
    const line = problems[pi].lines[li] as ChoiceLine;
    const sel  = allLineStates[pi][li].choiceSelected;
    patchLine(pi, li, { status: sel === line.correct ? "correct" : "wrong" });
  };

  const totalLines = allLineStates.reduce((a, ls) =>
    a + ls.filter(s => s.boxStates.length > 0 || s.choiceSelected !== undefined || (s.status === "correct" && s.boxStates.length === 0)).length, 0);
  const totalReal  = allLineStates.reduce((a, ls) => a + ls.filter(s => s.boxStates.length > 0 || s.choiceSelected !== undefined).length, 0);
  const doneReal   = allLineStates.reduce((a, ls) => a + ls.filter(s => s.status === "correct" && (s.boxStates.length > 0 || s.choiceSelected !== undefined)).length, 0);
  const pct        = totalReal > 0 ? Math.round((doneReal / totalReal) * 100) : 0;
  const allDone    = doneReal === totalReal;

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── HEADER ── */}
        <div className="flex flex-col items-center mb-7 text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 border-2 border-yellow-400/60 flex items-center justify-center mb-3">
            <span className="text-3xl">🔢</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-yellow-300 mb-1"
            style={{ textShadow: "0 0 24px rgba(234,179,8,0.7)" }}>
            {s("PENERAPAN OPERASI HITUNG BILANGAN BULAT", "INTEGER OPERATIONS — APPLIED PROBLEMS", "整数計算の応用問題")}
          </h1>
          <p className="text-white/50 text-xs font-body">{s("Kelas 7 · Bilangan Bulat · LKPD Interaktif", "Grade 7 · Integers · Interactive LKPD", "7年生 · 整数 · インタラクティブLKPD")}</p>
          <p className="mt-2 text-white/60 text-sm font-body max-w-xl">
            {s("Isi kotak isian di dalam setiap baris langkah demi langkah — soalnya tetap utuh, kamu hanya mengisi nilai sub-operasinya!", "Fill in the blanks step by step — the problem stays intact, you only fill in the sub-operation values!", "各行の空欄を順番に埋めよう — 問題はそのままで、計算の途中の値だけ入力します！")}
          </p>
        </div>

        {/* ── CARA MENGERJAKAN ── */}
        <div className="mb-5 bg-yellow-900/20 border border-yellow-500/25 rounded-xl p-4">
          <p className="text-yellow-300 text-xs font-bold mb-3">{s("📌 Cara Mengerjakan", "📌 How to Work", "📌 解き方")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(language === "en" ? [
              { icon: "👁️", step: "1. Read the problem", desc: "Read the problem and look at the first row — that's the full equation." },
              { icon: "✏️", step: "2. Fill in the boxes", desc: "Each row has fill-in boxes. Fill all boxes, then press Check ✓." },
              { icon: "🔓", step: "3. Next row unlocks", desc: "If correct, the next row automatically unlocks. Keep going!" },
            ] : language === "ja" ? [
              { icon: "👁️", step: "1. 問題を読む", desc: "問題を読み、最初の行を確認しましょう — それが完全な等式です。" },
              { icon: "✏️", step: "2. 空欄を埋める", desc: "各行には空欄があります。すべて埋めて確認 ✓ を押しましょう。" },
              { icon: "🔓", step: "3. 次の行が開く", desc: "正解なら次の行が自動的に開きます。最後まで続けよう！" },
            ] : [
              { icon: "👁️", step: "1. Baca soal", desc: "Baca soal dan perhatikan baris pertama — itu persamaan lengkapnya." },
              { icon: "✏️", step: "2. Isi kotak dalam baris", desc: "Setiap baris memiliki kotak isian. Isi semua kotak, lalu tekan Cek ✓." },
              { icon: "🔓", step: "3. Baris berikutnya terbuka", desc: "Jika benar, baris selanjutnya otomatis terbuka. Lanjut sampai selesai!" },
            ]).map(c => (
              <div key={c.step} className="bg-white/5 rounded-lg p-3 flex gap-3 items-start">
                <span className="text-xl">{c.icon}</span>
                <div>
                  <p className="text-yellow-300 text-xs font-bold">{c.step}</p>
                  <p className="text-white/55 text-xs font-body mt-0.5 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── URUTAN OPERASI ── */}
        <div className="mb-5 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-yellow-300 text-xs font-bold mb-2">{s("💡 Ingat Urutan Operasi", "💡 Order of Operations", "💡 計算の順序")}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            {(language === "en" ? [
              { n:"1", lbl:"( Brackets )",     cls:"text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
              { n:"2", lbl:"× ÷ Multiply/Divide", cls:"text-rose-400 border-rose-500/30 bg-rose-500/10" },
              { n:"3", lbl:"+ − Add/Subtract", cls:"text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
              { n:"→", lbl:"Left to Right",    cls:"text-amber-400 border-amber-500/30 bg-amber-500/10" },
            ] : language === "ja" ? [
              { n:"1", lbl:"( カッコ )",       cls:"text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
              { n:"2", lbl:"× ÷ かけ算/わり算",cls:"text-rose-400 border-rose-500/30 bg-rose-500/10" },
              { n:"3", lbl:"+ − たし算/ひき算",cls:"text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
              { n:"→", lbl:"左から右へ",        cls:"text-amber-400 border-amber-500/30 bg-amber-500/10" },
            ] : [
              { n:"1", lbl:"( Kurung )",       cls:"text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
              { n:"2", lbl:"× ÷ Kali/Bagi",   cls:"text-rose-400 border-rose-500/30 bg-rose-500/10" },
              { n:"3", lbl:"+ − Tambah/Kurang",cls:"text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
              { n:"→", lbl:"Kiri ke Kanan",    cls:"text-amber-400 border-amber-500/30 bg-amber-500/10" },
            ]).map(r => (
              <div key={r.n} className={`border rounded-lg py-2 px-1 text-xs font-bold ${r.cls}`}>
                <div className="text-xl font-black">{r.n}</div>
                <div className="mt-0.5">{r.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PROGRESS ── */}
        <div className="mb-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-xs font-bold">{s("Progress", "Progress", "進捗")}</span>
            <span className={`text-xs font-bold ${allDone ? "text-emerald-400" : "text-yellow-400"}`}>
              {doneReal}/{totalReal} {s("langkah", "steps", "ステップ")} ({pct}%)
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${pct}%` }} />
          </div>
          {allDone && (
            <p className="mt-2 text-center text-emerald-400 text-sm font-bold animate-bounce">
              {s("🎉 Luar biasa! Semua soal berhasil kamu kerjakan! Sobat Numatik keren! 🌟", "🎉 Amazing! You've completed all problems! Great work! 🌟", "🎉 素晴らしい！全問題を解き終えました！ 🌟")}
            </p>
          )}
        </div>

        {/* ── PROBLEM CARDS ── */}
        <div className="flex flex-col gap-5">
          {problems.map((prob, pi) => (
            <ProblemCard key={pi}
              prob={prob}
              lineStates={allLineStates[pi]}
              onBoxChange={(li, bi, v) => handleBoxChange(pi, li, bi, v)}
              onCheck={li => handleCheck(pi, li)}
              onChoiceSelect={(li, key) => handleChoiceSelect(pi, li, key)}
              onChoiceCheck={li => handleChoiceCheck(pi, li)}
            />
          ))}
        </div>

        {/* ── BACK ── */}
        <div className="mt-10 text-center">
          <button onClick={() => { playPopSound(); navigate("/lkpd/kelas-7/bilangan-bulat"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            {s("← Kembali ke LKPD Bilangan Bulat", "← Back to Integer LKPD", "← 整数LKPDに戻る")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OperasiCampuranLKPDPage;
