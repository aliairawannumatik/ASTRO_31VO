import { useEffect, useMemo, useRef, useState } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";
import {
  Brain,
  Hash,
  Square,
  Box,
  Sigma,
  Percent,
  Timer,
  Trophy,
  Flame,
  Play,
  RotateCcw,
} from "lucide-react";

type ModeId = "perkalian" | "kuadrat" | "kubik" | "akar" | "pecahan";

type Card = {
  question: string;
  answer: string;
  options: string[];
};

const MODES: {
  id: ModeId;
  label: string;
  desc: string;
  icon: any;
  color: string;
  border: string;
}[] = [
  {
    id: "perkalian",
    label: "Perkalian 1 – 10",
    desc: "a × b acak dari 1 sampai 10",
    icon: Hash,
    color: "text-sky-300",
    border: "border-sky-500/40",
  },
  {
    id: "kuadrat",
    label: "Kuadrat 1 – 30",
    desc: "n² acak dari 1 sampai 30",
    icon: Square,
    color: "text-emerald-300",
    border: "border-emerald-500/40",
  },
  {
    id: "kubik",
    label: "Kubik 1 – 15",
    desc: "n³ acak dari 1 sampai 15",
    icon: Box,
    color: "text-violet-300",
    border: "border-violet-500/40",
  },
  {
    id: "akar",
    label: "Akar Kuadrat",
    desc: "√n untuk n kuadrat sempurna",
    icon: Sigma,
    color: "text-orange-300",
    border: "border-orange-500/40",
  },
  {
    id: "pecahan",
    label: "Pecahan ↔ Persen",
    desc: "Konversi pecahan dasar ke %",
    icon: Percent,
    color: "text-rose-300",
    border: "border-rose-500/40",
  },
];

const TOTAL_QUESTIONS = 10;
const TIME_LIMIT = 60; // detik

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildOptions = (correct: number): string[] => {
  const set = new Set<number>();
  set.add(correct);
  while (set.size < 4) {
    const delta = rand(1, Math.max(5, Math.round(Math.abs(correct) * 0.2) + 3));
    const sign = Math.random() < 0.5 ? -1 : 1;
    const cand = correct + sign * delta;
    if (cand > 0) set.add(cand);
  }
  return shuffle([...set].map(String));
};

const PECAHAN_PAIRS: [string, string][] = [
  ["1/2", "50%"],
  ["1/3", "33,33%"],
  ["2/3", "66,67%"],
  ["1/4", "25%"],
  ["3/4", "75%"],
  ["1/5", "20%"],
  ["2/5", "40%"],
  ["3/5", "60%"],
  ["4/5", "80%"],
  ["1/8", "12,5%"],
  ["3/8", "37,5%"],
  ["5/8", "62,5%"],
  ["7/8", "87,5%"],
  ["1/10", "10%"],
  ["1/20", "5%"],
  ["1/25", "4%"],
];

const generateCard = (mode: ModeId): Card => {
  if (mode === "perkalian") {
    const a = rand(2, 10);
    const b = rand(2, 10);
    const ans = a * b;
    return { question: `${a} × ${b} = ?`, answer: String(ans), options: buildOptions(ans) };
  }
  if (mode === "kuadrat") {
    const n = rand(2, 30);
    const ans = n * n;
    return { question: `${n}² = ?`, answer: String(ans), options: buildOptions(ans) };
  }
  if (mode === "kubik") {
    const n = rand(2, 15);
    const ans = n * n * n;
    return { question: `${n}³ = ?`, answer: String(ans), options: buildOptions(ans) };
  }
  if (mode === "akar") {
    const n = rand(2, 25);
    const sq = n * n;
    return { question: `√${sq} = ?`, answer: String(n), options: buildOptions(n) };
  }
  // pecahan
  const [frac, percent] = PECAHAN_PAIRS[rand(0, PECAHAN_PAIRS.length - 1)];
  const wrongs = shuffle(PECAHAN_PAIRS.filter((p) => p[1] !== percent))
    .slice(0, 3)
    .map((p) => p[1]);
  return {
    question: `${frac} = ... %`,
    answer: percent,
    options: shuffle([percent, ...wrongs]),
  };
};

const LatihanFlashcardPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ModeId | null>(null);
  const [card, setCard] = useState<Card | null>(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<number | null>(null);

  const start = (m: ModeId) => {
    playPopSound();
    setMode(m);
    setIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setPicked(null);
    setTimeLeft(TIME_LIMIT);
    setFinished(false);
    setCard(generateCard(m));
  };

  const stop = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (!mode || finished) return;
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stop();
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => stop();
  }, [mode, finished]);

  const handlePick = (opt: string) => {
    if (!card || picked || !mode || finished) return;
    playPopSound();
    setPicked(opt);
    const correct = opt === card.answer;
    if (correct) {
      setScore((s) => s + 10);
      setStreak((st) => {
        const ns = st + 1;
        setBestStreak((b) => Math.max(b, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }
    window.setTimeout(() => {
      const nextIdx = index + 1;
      if (nextIdx >= TOTAL_QUESTIONS) {
        stop();
        setFinished(true);
      } else {
        setIndex(nextIdx);
        setPicked(null);
        setCard(generateCard(mode));
      }
    }, 700);
  };

  const reset = () => {
    stop();
    setMode(null);
    setCard(null);
    setFinished(false);
  };

  const progress = useMemo(
    () => Math.round(((index + (picked ? 1 : 0)) / TOTAL_QUESTIONS) * 100),
    [index, picked],
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation prevPath="/menghitung-cepat" />
      <div className="relative z-10 max-w-2xl w-full px-4 pt-20 pb-12">
        <div className="text-center mb-6">
          <Brain className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <h1 className="font-display text-2xl md:text-3xl font-bold text-yellow-300 text-glow-cyan mb-2">
            LATIHAN FLASHCARD
          </h1>
          <p className="text-white/60 text-sm font-body">
            Latih kecepatan berhitungmu dengan kartu acak — 10 soal, {TIME_LIMIT}{" "}
            detik. Jawaban benar +10 poin dan menambah streak.
          </p>
        </div>

        {!mode && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => start(m.id)}
                className={`group bg-card/80 backdrop-blur border ${m.border} hover:border-white/60 rounded-xl p-4 text-left hover:box-glow-cyan transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-start gap-3">
                  <m.icon className={`w-6 h-6 ${m.color} mt-0.5 group-hover:scale-110 transition-transform shrink-0`} />
                  <div>
                    <h3 className="font-display text-sm font-bold text-foreground mb-0.5">
                      {m.label}
                    </h3>
                    <p className="text-xs text-muted-foreground font-body">{m.desc}</p>
                  </div>
                  <Play className="w-4 h-4 text-white/40 ml-auto" />
                </div>
              </button>
            ))}
          </div>
        )}

        {mode && !finished && card && (
          <div className="bg-card/80 backdrop-blur border border-white/10 rounded-xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-xs font-body">
              <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/70">
                Soal {index + 1} / {TOTAL_QUESTIONS}
              </span>
              <span className="px-2 py-1 rounded-md bg-yellow-500/15 border border-yellow-500/40 text-yellow-200 flex items-center gap-1">
                <Trophy className="w-3 h-3" /> {score}
              </span>
              <span className="px-2 py-1 rounded-md bg-orange-500/15 border border-orange-500/40 text-orange-200 flex items-center gap-1">
                <Flame className="w-3 h-3" /> Streak {streak}
              </span>
              <span
                className={`px-2 py-1 rounded-md border flex items-center gap-1 ${
                  timeLeft <= 10
                    ? "bg-rose-500/15 border-rose-500/40 text-rose-200 animate-pulse"
                    : "bg-cyan-500/15 border-cyan-500/40 text-cyan-200"
                }`}
              >
                <Timer className="w-3 h-3" /> {timeLeft}s
              </span>
            </div>

            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-5">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl py-10 mb-5 text-center">
              <p className="font-display text-4xl md:text-5xl font-bold text-white tracking-wide">
                {card.question}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {card.options.map((opt) => {
                const isCorrect = picked && opt === card.answer;
                const isWrongPick = picked === opt && opt !== card.answer;
                return (
                  <button
                    key={opt}
                    onClick={() => handlePick(opt)}
                    disabled={!!picked}
                    className={`px-4 py-4 rounded-xl border font-display text-lg font-bold transition-all
                      ${
                        isCorrect
                          ? "bg-emerald-500/30 border-emerald-400 text-emerald-100 scale-105"
                          : isWrongPick
                          ? "bg-rose-500/30 border-rose-400 text-rose-100"
                          : picked && opt === card.answer
                          ? "bg-emerald-500/30 border-emerald-400 text-emerald-100"
                          : "bg-white/5 border-white/15 text-white hover:bg-white/10 hover:border-white/40"
                      }
                      ${picked ? "cursor-default" : "cursor-pointer"}
                    `}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <button
              onClick={reset}
              className="mt-5 mx-auto block text-xs text-white/50 hover:text-white/80 transition font-body"
            >
              ← Ganti mode latihan
            </button>
          </div>
        )}

        {finished && (
          <div className="bg-card/80 backdrop-blur border border-yellow-500/40 rounded-xl p-6 text-center">
            <Trophy className="w-14 h-14 text-yellow-300 mx-auto mb-3" />
            <h2 className="font-display text-2xl font-bold text-yellow-200 mb-2">
              Selesai!
            </h2>
            <p className="text-white/70 font-body text-sm mb-5">
              Kamu menyelesaikan {Math.min(index + (picked ? 1 : 0), TOTAL_QUESTIONS)} soal.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-xs text-white/60 font-body">Skor</p>
                <p className="font-display text-2xl font-bold text-yellow-200">{score}</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                <p className="text-xs text-white/60 font-body">Streak Terbaik</p>
                <p className="font-display text-2xl font-bold text-orange-200">{bestStreak}</p>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                <p className="text-xs text-white/60 font-body">Sisa Waktu</p>
                <p className="font-display text-2xl font-bold text-cyan-200">{timeLeft}s</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => mode && start(mode)}
                className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 font-body text-sm hover:bg-emerald-500/30 transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Ulangi mode ini
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/15 text-white/80 font-body text-sm hover:bg-white/10 transition"
              >
                Pilih mode lain
              </button>
              <button
                onClick={() => {
                  playPopSound();
                  navigate("/menghitung-cepat");
                }}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/15 text-white/80 font-body text-sm hover:bg-white/10 transition"
              >
                Kembali ke menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatihanFlashcardPage;
