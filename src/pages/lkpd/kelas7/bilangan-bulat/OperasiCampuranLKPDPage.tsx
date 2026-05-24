import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

/* ═══════════════════════════════════════════════════
   DATA TYPES
═══════════════════════════════════════════════════ */

type StepKind = "fill" | "choice";

type Step = {
  label: string;
  kind: StepKind;
  answer?: string[];
  choices?: { key: string; text: string }[];
  correctChoice?: string;
  hint?: string;
};

type Problem = {
  n: number;
  emoji: string;
  title: string;
  context: string;
  color: string;
  border: string;
  badge: string;
  steps: Step[];
  solutionLines: string[];
};

/* ═══════════════════════════════════════════════════
   PROBLEM DATA  (10 soal dari PDF)
═══════════════════════════════════════════════════ */

const problems: Problem[] = [
  {
    n: 1, emoji: "🧮", title: "Operasi Campuran I",
    context: "Hasil dari −25 × (8 + (−9)) + (2 − 7) adalah …",
    color: "from-cyan-900/60 to-blue-900/60", border: "border-cyan-500/40", badge: "bg-cyan-500/20 text-cyan-300",
    steps: [
      { kind: "fill", label: "Langkah 1 — Selesaikan dalam kurung pertama:\n8 + (−9) = …", answer: ["-1","–1"], hint: "8 + (−9) = 8 − 9 = −1" },
      { kind: "fill", label: "Langkah 2 — Selesaikan dalam kurung kedua:\n2 − 7 = …", answer: ["-5","–5"], hint: "2 − 7 = −5" },
      { kind: "fill", label: "Langkah 3 — Kalikan:\n−25 × (−1) = …", answer: ["25"], hint: "Negatif × negatif = positif → 25" },
      { kind: "fill", label: "Langkah 4 — Gabungkan:\n25 + (−5) = …", answer: ["20"], hint: "25 − 5 = 20 ✓" },
    ],
    solutionLines: [
      "−25 × (8 + (−9)) + (2 − 7)",
      "= −25 × (−1) + (−5)",
      "= 25 + (−5)",
      "= 20 ✅",
    ],
  },
  {
    n: 2, emoji: "🔢", title: "Operasi Campuran II",
    context: "Hasil dari (−20) + 8 × 5 − 18 : (−3) adalah …",
    color: "from-violet-900/60 to-purple-900/60", border: "border-violet-500/40", badge: "bg-violet-500/20 text-violet-300",
    steps: [
      { kind: "fill", label: "Langkah 1 — Kali dahulu:\n8 × 5 = …", answer: ["40"], hint: "8 × 5 = 40" },
      { kind: "fill", label: "Langkah 2 — Bagi dahulu:\n18 : (−3) = …", answer: ["-6","–6"], hint: "18 : (−3) = −6 (positif ÷ negatif = negatif)" },
      { kind: "fill", label: "Langkah 3 — Tambah/kurang dari kiri:\n(−20) + 40 − (−6) = …", answer: ["26"], hint: "−20 + 40 + 6 = 26" },
    ],
    solutionLines: [
      "(−20) + 8 × 5 − 18 : (−3)",
      "= (−20) + 40 − (−6)",
      "= (−20) + 40 + 6",
      "= 26 ✅",
    ],
  },
  {
    n: 3, emoji: "📝", title: "Skor Bahasa Inggris Budi",
    context: "Dalam kompetensi Bahasa Inggris (50 soal): benar +4, salah −2, tidak dijawab −1. Budi menjawab 44 soal dan benar 36 soal. Skor Budi adalah …",
    color: "from-amber-900/60 to-yellow-900/60", border: "border-amber-500/40", badge: "bg-amber-500/20 text-amber-300",
    steps: [
      { kind: "fill", label: "Langkah 1 — Berapa soal yang salah?\nSoal salah = 44 − 36 = …", answer: ["8"], hint: "Budi menjawab 44, benar 36 → salah = 44 − 36 = 8" },
      { kind: "fill", label: "Langkah 2 — Berapa soal tidak dijawab?\nSoal tidak dijawab = 50 − 44 = …", answer: ["6"], hint: "Total 50 soal, dijawab 44 → tidak dijawab = 50 − 44 = 6" },
      { kind: "fill", label: "Langkah 3 — Hitung skor benar:\n36 × 4 = …", answer: ["144"], hint: "36 × 4 = 144" },
      { kind: "fill", label: "Langkah 4 — Hitung skor salah:\n8 × (−2) = …", answer: ["-16","–16"], hint: "8 × (−2) = −16" },
      { kind: "fill", label: "Langkah 5 — Hitung skor kosong:\n6 × (−1) = …", answer: ["-6","–6"], hint: "6 × (−1) = −6" },
      { kind: "fill", label: "Langkah 6 — Total skor Budi:\n144 + (−16) + (−6) = …", answer: ["122"], hint: "144 − 16 − 6 = 122" },
    ],
    solutionLines: [
      "Salah = 44 − 36 = 8 soal",
      "Tidak dijawab = 50 − 44 = 6 soal",
      "Skor = 36×4 + 8×(−2) + 6×(−1)",
      "     = 144 − 16 − 6",
      "     = 122 ✅",
    ],
  },
  {
    n: 4, emoji: "⚽", title: "Nilai Tim SMPN 28 BDG",
    context: "Pertandingan: menang +3, seri +1, kalah −2. Tim SMPN 28 BDG bermain 20 kali, meraih 10 kemenangan dan 4 seri. Nilai yang diperoleh adalah …",
    color: "from-emerald-900/60 to-green-900/60", border: "border-emerald-500/40", badge: "bg-emerald-500/20 text-emerald-300",
    steps: [
      { kind: "fill", label: "Langkah 1 — Berapa kali kalah?\nKalah = 20 − 10 − 4 = …", answer: ["6"], hint: "Total 20 − 10 menang − 4 seri = 6 kalah" },
      { kind: "fill", label: "Langkah 2 — Hitung nilai kemenangan:\n10 × 3 = …", answer: ["30"], hint: "10 × 3 = 30" },
      { kind: "fill", label: "Langkah 3 — Hitung nilai seri:\n4 × 1 = …", answer: ["4"], hint: "4 × 1 = 4" },
      { kind: "fill", label: "Langkah 4 — Hitung nilai kekalahan:\n6 × (−2) = …", answer: ["-12","–12"], hint: "6 × (−2) = −12" },
      { kind: "fill", label: "Langkah 5 — Total nilai:\n30 + 4 + (−12) = …", answer: ["22"], hint: "30 + 4 − 12 = 22" },
    ],
    solutionLines: [
      "Kalah = 20 − 10 − 4 = 6 kali",
      "Nilai = 10×3 + 4×1 + 6×(−2)",
      "      = 30 + 4 − 12",
      "      = 22 ✅",
    ],
  },
  {
    n: 5, emoji: "🚌", title: "Penumpang Bus Trans Jakarta",
    context: "Bus berangkat dari terminal. Di halte 1 turun 4 orang, di halte 2 naik 2 orang. Sampai di pasar ada 15 orang. Berapa penumpang yang naik di terminal?",
    color: "from-rose-900/60 to-red-900/60", border: "border-rose-500/40", badge: "bg-rose-500/20 text-rose-300",
    steps: [
      { kind: "fill", label: "Langkah 1 — Misalkan penumpang di terminal = x.\nSetelah halte 1 (turun 4): x − 4\nSetelah halte 2 (naik 2): x − 4 + 2 = x − 2\nDi pasar ada 15 orang, jadi:\nx − 2 = 15 → x = …", answer: ["17"], hint: "x − 2 = 15 → x = 15 + 2 = 17" },
    ],
    solutionLines: [
      "Misal penumpang awal = x",
      "x − 4 + 2 = 15",
      "x − 2 = 15",
      "x = 17 ✅",
    ],
  },
  {
    n: 6, emoji: "🌡️", title: "Selisih Suhu Beberapa Negara",
    context: "Suhu udara: Wina −7°C | Seoul −1°C | Baghdad 39°C | Surabaya 33°C\nSelisih suhu udara yang BENAR adalah …",
    color: "from-sky-900/60 to-cyan-900/60", border: "border-sky-500/40", badge: "bg-sky-500/20 text-sky-300",
    steps: [
      {
        kind: "choice",
        label: "Pilih pernyataan yang BENAR:",
        choices: [
          { key: "A", text: "Selisih suhu Wina dan Seoul = −6°C" },
          { key: "B", text: "Selisih suhu Baghdad dan Wina = 30°C" },
          { key: "C", text: "Selisih suhu Surabaya dan Seoul = 34°C" },
          { key: "D", text: "Selisih suhu Surabaya dan Wina = 39°C" },
        ],
        correctChoice: "C",
        hint: "Hitung: 33 − (−1) = 33 + 1 = 34 ✓",
      },
    ],
    solutionLines: [
      "A: Wina − Seoul = −7 − (−1) = −6°C → Selisih = 6°C (bukan −6) ✗",
      "B: Baghdad − Wina = 39 − (−7) = 46°C (bukan 30) ✗",
      "C: Surabaya − Seoul = 33 − (−1) = 34°C ✅",
      "D: Surabaya − Wina = 33 − (−7) = 40°C (bukan 39) ✗",
    ],
  },
  {
    n: 7, emoji: "🍟", title: "Kembalian Uang Gorengan",
    context: "Harga gorengan Rp5.000 per 4 buah. Bagus membeli 32 gorengan dan membayar Rp50.000. Uang kembali Bagus adalah …",
    color: "from-orange-900/60 to-amber-900/60", border: "border-orange-500/40", badge: "bg-orange-500/20 text-orange-300",
    steps: [
      { kind: "fill", label: "Langkah 1 — Berapa kelompok 4 gorengan yang dibeli?\n32 ÷ 4 = …", answer: ["8"], hint: "32 ÷ 4 = 8 kelompok" },
      { kind: "fill", label: "Langkah 2 — Harga total 32 gorengan:\n8 × 5.000 = … (dalam rupiah)", answer: ["40000","40.000"], hint: "8 × 5.000 = 40.000" },
      { kind: "fill", label: "Langkah 3 — Uang kembali:\n50.000 − 40.000 = … (dalam rupiah)", answer: ["10000","10.000"], hint: "50.000 − 40.000 = 10.000" },
    ],
    solutionLines: [
      "32 ÷ 4 = 8 kelompok",
      "Harga total = 8 × 5.000 = Rp40.000",
      "Kembalian = 50.000 − 40.000 = Rp10.000 ✅",
    ],
  },
  {
    n: 8, emoji: "❄️", title: "Suhu Kota Moskow",
    context: "Suhu awal Moskow 11°C. Saat turun salju, suhu turun 4°C setiap 15 menit. Suhu setelah 1 jam turun salju adalah …",
    color: "from-blue-900/60 to-indigo-900/60", border: "border-blue-500/40", badge: "bg-blue-500/20 text-blue-300",
    steps: [
      { kind: "fill", label: "Langkah 1 — Berapa kali interval 15 menit dalam 1 jam?\n60 ÷ 15 = …", answer: ["4"], hint: "60 menit ÷ 15 menit = 4 kali" },
      { kind: "fill", label: "Langkah 2 — Total penurunan suhu:\n4 × 4°C = …", answer: ["16"], hint: "4 × 4 = 16°C" },
      { kind: "fill", label: "Langkah 3 — Suhu akhir:\n11 − 16 = …", answer: ["-5","–5"], hint: "11 − 16 = −5°C" },
    ],
    solutionLines: [
      "1 jam = 60 menit = 4 × 15 menit",
      "Total turun = 4 × 4°C = 16°C",
      "Suhu akhir = 11 − 16 = −5°C ✅",
    ],
  },
  {
    n: 9, emoji: "⭐", title: "Operasi Khusus ★",
    context: "Operasi \"★\" artinya: kalikan bilangan pertama dengan DUA KALI bilangan kedua, lalu tambahkan bilangan kedua.\na ★ b = (a × 2b) + b\nHasil dari 5 ★ 3 adalah …",
    color: "from-fuchsia-900/60 to-pink-900/60", border: "border-fuchsia-500/40", badge: "bg-fuchsia-500/20 text-fuchsia-300",
    steps: [
      { kind: "fill", label: "Langkah 1 — Hitung dua kali bilangan kedua:\n2 × 3 = …", answer: ["6"], hint: "2 × 3 = 6" },
      { kind: "fill", label: "Langkah 2 — Kalikan bilangan pertama:\n5 × 6 = …", answer: ["30"], hint: "5 × 6 = 30" },
      { kind: "fill", label: "Langkah 3 — Tambahkan bilangan kedua:\n30 + 3 = …", answer: ["33"], hint: "30 + 3 = 33" },
    ],
    solutionLines: [
      "5 ★ 3 = (5 × 2×3) + 3",
      "      = (5 × 6) + 3",
      "      = 30 + 3",
      "      = 33 ✅",
    ],
  },
  {
    n: 10, emoji: "💎", title: "Operasi Khusus #",
    context: "Operasi \"#\" artinya: kalikan bilangan pertama dengan bilangan kedua, lalu KURANGI hasilnya dengan dua kali bilangan kedua.\na # b = (a × b) − 2b\nHasil dari 5 # (−4) adalah …",
    color: "from-teal-900/60 to-emerald-900/60", border: "border-teal-500/40", badge: "bg-teal-500/20 text-teal-300",
    steps: [
      { kind: "fill", label: "Langkah 1 — Kalikan dua bilangan:\n5 × (−4) = …", answer: ["-20","–20"], hint: "5 × (−4) = −20" },
      { kind: "fill", label: "Langkah 2 — Hitung dua kali bilangan kedua:\n2 × (−4) = …", answer: ["-8","–8"], hint: "2 × (−4) = −8" },
      { kind: "fill", label: "Langkah 3 — Kurangkan:\n(−20) − (−8) = …", answer: ["-12","–12"], hint: "(−20) − (−8) = −20 + 8 = −12" },
    ],
    solutionLines: [
      "5 # (−4) = (5 × (−4)) − 2×(−4)",
      "         = (−20) − (−8)",
      "         = −20 + 8",
      "         = −12 ✅",
    ],
  },
];

/* ═══════════════════════════════════════════════════
   STEP COMPONENT
═══════════════════════════════════════════════════ */

function StepBox({
  step, stepIdx, problemN,
  state, onInput, onCheck, onChoice,
}: {
  step: Step; stepIdx: number; problemN: number;
  state: { value: string; status: "idle" | "correct" | "wrong"; selectedChoice?: string };
  onInput: (v: string) => void;
  onCheck: () => void;
  onChoice: (key: string) => void;
}) {
  const isDone = state.status === "correct";
  const isWrong = state.status === "wrong";
  const inputRef = useRef<HTMLInputElement>(null);

  if (step.kind === "choice") {
    return (
      <div className={`rounded-xl border p-4 transition-all ${isDone ? "border-emerald-500/50 bg-emerald-500/10" : isWrong ? "border-rose-500/40 bg-rose-500/8" : "border-white/10 bg-white/5"}`}>
        <p className="text-white/80 text-sm font-body whitespace-pre-line leading-relaxed mb-3">{step.label}</p>
        <div className="grid grid-cols-1 gap-2">
          {step.choices!.map(ch => {
            const sel = state.selectedChoice === ch.key;
            const correct = isDone && ch.key === step.correctChoice;
            const wrong = isWrong && sel && ch.key !== step.correctChoice;
            const correctHighlight = isDone && ch.key === step.correctChoice;
            return (
              <button key={ch.key} disabled={isDone}
                onClick={() => { playPopSound(); onChoice(ch.key); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left text-sm font-body transition-all cursor-pointer
                  ${correctHighlight ? "bg-emerald-500/25 border-emerald-400 text-emerald-200"
                  : wrong ? "bg-rose-500/25 border-rose-400 text-rose-200 line-through"
                  : sel ? "bg-white/15 border-white/40 text-white"
                  : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/25"}`}>
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0
                  ${correctHighlight ? "border-emerald-400 text-emerald-300" : sel ? "border-white/60 text-white" : "border-white/20 text-white/50"}`}>{ch.key}</span>
                <span>{ch.text}</span>
                {correctHighlight && <span className="ml-auto text-emerald-400 font-bold">✓</span>}
                {wrong && <span className="ml-auto text-rose-400 font-bold">✗</span>}
              </button>
            );
          })}
        </div>
        {state.selectedChoice && !isDone && (
          <button onClick={() => { playPopSound(); onCheck(); }}
            className="mt-3 w-full py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/15 transition-all cursor-pointer font-body">
            Cek Jawaban ✓
          </button>
        )}
        {isDone && <p className="mt-2 text-emerald-400 text-xs font-bold">✅ Benar! Lanjut ke langkah berikutnya.</p>}
        {isWrong && <p className="mt-2 text-rose-400 text-xs">❌ Kurang tepat. Coba lagi! 💡 {step.hint}</p>}
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-4 transition-all ${isDone ? "border-emerald-500/50 bg-emerald-500/10" : isWrong ? "border-rose-500/40 bg-rose-500/8" : "border-white/10 bg-white/5"}`}>
      <p className="text-white/80 text-sm font-body whitespace-pre-line leading-relaxed mb-3">{step.label}</p>
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            disabled={isDone}
            value={state.value}
            onChange={e => onInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && state.value.trim()) { playPopSound(); onCheck(); } }}
            placeholder="Ketik jawabanmu di sini …"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono text-white bg-transparent outline-none transition-all
              placeholder:text-white/25
              ${isDone ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-200"
              : isWrong ? "border-rose-400/60 bg-rose-500/8"
              : "border-white/20 focus:border-white/50 bg-white/5 focus:bg-white/8"}`}
          />
          {isDone && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">✓</span>}
          {isWrong && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400 font-bold">✗</span>}
        </div>
        {!isDone && (
          <button
            onClick={() => { if (state.value.trim()) { playPopSound(); onCheck(); } }}
            disabled={!state.value.trim()}
            className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer font-body shrink-0">
            Cek ✓
          </button>
        )}
      </div>
      {isDone && <p className="mt-2 text-emerald-400 text-xs font-bold">✅ Benar! Lanjut ke langkah berikutnya.</p>}
      {isWrong && <p className="mt-2 text-rose-400 text-xs">❌ Kurang tepat. Coba lagi! 💡 {step.hint}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PROBLEM CARD COMPONENT
═══════════════════════════════════════════════════ */

function ProblemCard({ prob, stepStates, onInput, onCheck, onChoice }:{
  prob: Problem;
  stepStates: { value: string; status: "idle"|"correct"|"wrong"; selectedChoice?: string }[];
  onInput: (si: number, v: string) => void;
  onCheck: (si: number) => void;
  onChoice: (si: number, key: string) => void;
}) {
  const allDone = stepStates.every(s => s.status === "correct");
  const doneCount = stepStates.filter(s => s.status === "correct").length;
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className={`relative rounded-2xl overflow-hidden border ${prob.border} bg-gradient-to-br ${prob.color} backdrop-blur-sm`}>
      {allDone && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="absolute text-lg animate-bounce"
              style={{ top: `${10 + i * 14}%`, left: `${5 + i * 16}%`, animationDelay: `${i * 0.15}s`, opacity: 0.6 }}>
              {["⭐","✨","🎉","💫","🌟","🎊"][i]}
            </span>
          ))}
        </div>
      )}

      <div className="relative p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full ${prob.badge} border border-white/20 flex items-center justify-center text-xl shrink-0 font-bold`}>
            {allDone ? "✅" : prob.n}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${prob.badge}`}>
                {prob.emoji} Soal {prob.n}
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${prob.badge}`}>
                {prob.title}
              </span>
            </div>
            <p className="font-body text-sm text-white/90 leading-relaxed whitespace-pre-line">{prob.context}</p>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest px-2">
            Langkah Penyelesaian ({doneCount}/{prob.steps.length})
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="flex flex-col gap-3">
          {prob.steps.map((step, si) => {
            const prevDone = si === 0 || stepStates[si - 1].status === "correct";
            if (!prevDone) {
              return (
                <div key={si} className="rounded-xl border border-white/8 p-4 opacity-35 select-none">
                  <p className="text-white/50 text-sm font-body">{step.label.split("\n")[0]}</p>
                  <p className="text-white/30 text-xs mt-1">🔒 Selesaikan langkah sebelumnya dulu …</p>
                </div>
              );
            }
            return (
              <StepBox key={si}
                step={step} stepIdx={si} problemN={prob.n}
                state={stepStates[si]}
                onInput={v => onInput(si, v)}
                onCheck={() => onCheck(si)}
                onChoice={key => onChoice(si, key)}
              />
            );
          })}
        </div>

        {allDone && (
          <div className="mt-4">
            <button onClick={() => { playPopSound(); setShowSolution(s => !s); }}
              className={`w-full py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer font-body
                ${showSolution ? "bg-white/15 border-white/30 text-white" : "bg-white/8 border-white/15 text-white/70 hover:bg-white/12"}`}>
              {showSolution ? "▲ Sembunyikan Pembahasan" : "▼ Lihat Pembahasan Lengkap 📖"}
            </button>
            {showSolution && (
              <div className="mt-3 rounded-xl border border-white/15 bg-white/5 p-4">
                <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">📌 Pembahasan</p>
                <div className="font-mono text-sm space-y-1">
                  {prob.solutionLines.map((line, i) => (
                    <p key={i} className={line.includes("✅") ? "text-emerald-400 font-bold" : "text-white/80"}>{line}</p>
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

/* ═══════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════ */

type StepState = { value: string; status: "idle"|"correct"|"wrong"; selectedChoice?: string };

const OperasiCampuranLKPDPage = () => {
  const navigate = useNavigate();

  const [states, setStates] = useState<StepState[][][]>(
    problems.map(p => p.steps.map(() => ({ value: "", status: "idle" as const })))
  );

  const totalSteps = problems.reduce((a, p) => a + p.steps.length, 0);
  const doneSteps  = states.reduce((a, ps) => a + ps.filter(s => s.status === "correct").length, 0);
  const allDone    = doneSteps === totalSteps;

  const setStep = (pi: number, si: number, patch: Partial<StepState>) => {
    setStates(prev => {
      const next = prev.map(ps => [...ps.map(s => ({ ...s }))]);
      next[pi][si] = { ...next[pi][si], ...patch };
      return next;
    });
  };

  const handleInput = (pi: number, si: number, v: string) =>
    setStep(pi, si, { value: v, status: "idle" });

  const handleCheck = (pi: number, si: number) => {
    const step = problems[pi].steps[si];
    const val  = states[pi][si].value.trim().replace(/\s/g, "");
    if (step.kind === "fill") {
      const correct = step.answer!.some(a => a.replace(/\s/g, "").toLowerCase() === val.toLowerCase());
      setStep(pi, si, { status: correct ? "correct" : "wrong" });
    } else {
      const sel = states[pi][si].selectedChoice;
      setStep(pi, si, { status: sel === step.correctChoice ? "correct" : "wrong" });
    }
  };

  const handleChoice = (pi: number, si: number, key: string) =>
    setStep(pi, si, { selectedChoice: key, status: "idle" });

  const pct = Math.round((doneSteps / totalSteps) * 100);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* HEADER */}
        <div className="flex flex-col items-center mb-7">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 border-2 border-yellow-400/60 flex items-center justify-center mb-3">
            <span className="text-3xl">🔢</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-yellow-300 text-center mb-1"
            style={{ textShadow: "0 0 24px rgba(234,179,8,0.7)" }}>
            PENERAPAN OPERASI HITUNG BILANGAN BULAT
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 7 · Bilangan Bulat · LKPD Interaktif</p>
          <div className="mt-3 flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2">
              <span className="text-yellow-400 text-xs font-bold">📋 10 Soal</span>
              <span className="text-white/30 text-xs">·</span>
              <span className="text-white/50 text-xs">Isi titik-titik & cek jawabanmu!</span>
            </div>
          </div>
        </div>

        {/* PANDUAN */}
        <div className="mb-6 bg-yellow-900/20 border border-yellow-500/25 rounded-xl p-4">
          <p className="text-yellow-300 text-xs font-bold mb-3">📌 Cara Mengerjakan</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: "📖", step: "1. Baca soal", desc: "Baca soal dengan teliti dan pahami informasinya." },
              { icon: "✏️", step: "2. Isi titik-titik", desc: "Ketik jawabanmu pada setiap langkah, lalu tekan Cek ✓." },
              { icon: "🎯", step: "3. Cek jawaban", desc: "Langkah berikutnya terbuka setelah langkah ini benar!" },
            ].map(c => (
              <div key={c.step} className="bg-white/5 rounded-lg p-3 flex gap-3 items-start">
                <span className="text-xl">{c.icon}</span>
                <div>
                  <p className="text-yellow-300 text-xs font-bold">{c.step}</p>
                  <p className="text-white/60 text-xs font-body mt-0.5">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mb-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-xs font-bold">Progress</span>
            <span className={`text-xs font-bold ${allDone ? "text-emerald-400" : "text-yellow-400"}`}>
              {doneSteps}/{totalSteps} langkah selesai ({pct}%)
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${pct}%` }} />
          </div>
          {allDone && (
            <p className="mt-2 text-center text-emerald-400 text-sm font-bold animate-bounce">
              🎉 Luar biasa! Semua soal berhasil kamu selesaikan! Sobat Numatik keren! 🌟
            </p>
          )}
        </div>

        {/* SOAL-SOAL STRATEGI */}
        <div className="mb-5 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-yellow-300 text-xs font-bold mb-2">💡 Ingat Urutan Operasi (KaKaBaTa)</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            {[
              { n: "1", label: "( Kurung )", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
              { n: "2", label: "× ÷ Kali/Bagi", color: "text-rose-400 border-rose-500/30 bg-rose-500/10" },
              { n: "3", label: "+ − Tambah/Kurang", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
              { n: "→", label: "Kiri ke Kanan", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
            ].map(r => (
              <div key={r.n} className={`border rounded-lg py-2 px-2 text-xs font-bold ${r.color}`}>
                <div className="text-lg font-black">{r.n}</div>
                <div>{r.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PROBLEM CARDS */}
        <div className="flex flex-col gap-5">
          {problems.map((prob, pi) => (
            <ProblemCard key={pi}
              prob={prob}
              stepStates={states[pi]}
              onInput={(si, v) => handleInput(pi, si, v)}
              onCheck={si => handleCheck(pi, si)}
              onChoice={(si, key) => handleChoice(pi, si, key)}
            />
          ))}
        </div>

        {/* BACK BUTTON */}
        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/lkpd/kelas-7/bilangan-bulat"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke LKPD Bilangan Bulat
          </button>
        </div>
      </div>
    </div>
  );
};

export default OperasiCampuranLKPDPage;
