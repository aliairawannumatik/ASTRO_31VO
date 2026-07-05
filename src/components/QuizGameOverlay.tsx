import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { playPopSound } from "@/hooks/useAudio";

const QUIZ_INTERVAL = 40;
const MAX_LIVES = 3;

interface MQ { q: string; opts: string[]; ans: number }

const QUIZ_POOL: MQ[] = [
  { q: "FPB dari 24 dan 36 adalah ...", opts: ["12", "6", "8", "18"], ans: 0 },
  { q: "KPK dari 6 dan 8 adalah ...", opts: ["24", "12", "48", "16"], ans: 0 },
  { q: "Hasil dari 5² + 3² = ...", opts: ["34", "64", "25", "16"], ans: 0 },
  { q: "√144 = ...", opts: ["12", "14", "11", "13"], ans: 0 },
  { q: "Luas persegi sisi 9 cm = ... cm²", opts: ["81", "72", "36", "18"], ans: 0 },
  { q: "Keliling persegi panjang P=10, L=5 = ...", opts: ["30", "50", "15", "20"], ans: 0 },
  { q: "Nilai dari 3³ adalah ...", opts: ["27", "9", "81", "18"], ans: 0 },
  { q: "Pecahan ¾ dalam persen = ...", opts: ["75%", "70%", "80%", "65%"], ans: 0 },
  { q: "Rasio 12 : 8 dalam bentuk sederhana = ...", opts: ["3:2", "6:4", "4:3", "2:3"], ans: 0 },
  { q: "Jika 2x + 5 = 13, maka x = ...", opts: ["4", "3", "5", "8"], ans: 0 },
  { q: "Sudut dalam segitiga berjumlah ...", opts: ["180°", "90°", "360°", "270°"], ans: 0 },
  { q: "Luas lingkaran r = 7 (π = 22/7) = ...", opts: ["154", "44", "49", "77"], ans: 0 },
  { q: "Keliling lingkaran r = 14 (π = 22/7) = ...", opts: ["88", "44", "28", "154"], ans: 0 },
  { q: "Volume kubus sisi 5 cm = ... cm³", opts: ["125", "25", "75", "150"], ans: 0 },
  { q: "Harga setelah diskon 20% dari Rp50.000 = ...", opts: ["Rp40.000", "Rp45.000", "Rp30.000", "Rp35.000"], ans: 0 },
  { q: "y = 2x + 3, saat x = 4, y = ...", opts: ["11", "10", "9", "14"], ans: 0 },
  { q: "Rata-rata dari 6, 8, 10, 12 = ...", opts: ["9", "8", "10", "7"], ans: 0 },
  { q: "Peluang muncul angka 6 pada dadu = ...", opts: ["1/6", "1/3", "1/2", "1/4"], ans: 0 },
  { q: "Sudut lancip memiliki besar antara ...", opts: ["0°–90°", "90°–180°", "0°–45°", "90°–360°"], ans: 0 },
  { q: "Jika p = 3, nilai 4p² = ...", opts: ["36", "144", "12", "24"], ans: 0 },
  { q: "0,75 dalam bentuk pecahan = ...", opts: ["3/4", "1/4", "7/10", "7/5"], ans: 0 },
  { q: "Hasil 15% × 200 = ...", opts: ["30", "15", "45", "25"], ans: 0 },
  { q: "Volume balok P=8, L=5, T=3 = ... cm³", opts: ["120", "80", "160", "240"], ans: 0 },
  { q: "Bilangan prima di antara 10 dan 20 = ...", opts: ["11,13,17,19", "10,12,14,16", "11,15,17,19", "13,15,17,19"], ans: 0 },
  { q: "Perbandingan 15 : 25 disederhanakan = ...", opts: ["3:5", "5:3", "5:8", "1:2"], ans: 0 },
  { q: "Hasil 2/3 + 1/6 = ...", opts: ["5/6", "3/9", "3/6", "1/2"], ans: 0 },
  { q: "Jika AB sejajar CD, besar sudut dalam sepihak berjumlah ...", opts: ["180°", "90°", "360°", "270°"], ans: 0 },
  { q: "Luas trapesium dengan a=8, b=12, t=5 = ...", opts: ["50", "40", "48", "60"], ans: 0 },
  { q: "Jika 3y − 7 = 11, maka y = ...", opts: ["6", "4", "8", "3"], ans: 0 },
  { q: "Median dari data: 3, 5, 7, 9, 11 adalah ...", opts: ["7", "5", "9", "6"], ans: 0 },
  { q: "Modus dari data: 2, 3, 3, 4, 5, 3, 6 adalah ...", opts: ["3", "4", "2", "5"], ans: 0 },
  { q: "Nilai 7² − 4² = ...", opts: ["33", "65", "22", "45"], ans: 0 },
  { q: "FPB dari 18 dan 27 = ...", opts: ["9", "3", "6", "18"], ans: 0 },
  { q: "Luas segitiga dengan a=10, t=6 = ...", opts: ["30", "60", "15", "36"], ans: 0 },
  { q: "Jika rasio a:b = 2:3 dan jumlahnya 50, maka a = ...", opts: ["20", "30", "25", "15"], ans: 0 },
];

function pickQuestion(used: Set<number>): { q: MQ; idx: number } {
  if (used.size >= QUIZ_POOL.length) used.clear();
  let idx = Math.floor(Math.random() * QUIZ_POOL.length);
  let guard = 0;
  while (used.has(idx) && guard < 80) { idx = Math.floor(Math.random() * QUIZ_POOL.length); guard++; }
  used.add(idx);
  return { q: QUIZ_POOL[idx], idx };
}

const QuizGameOverlay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isGamePage = location.pathname.startsWith("/math-game-arena/umum/");

  const [countdown, setCountdown] = useState(QUIZ_INTERVAL);
  const [lives, setLives] = useState(MAX_LIVES);
  const [activeQuiz, setActiveQuiz] = useState<MQ | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAsked, setTotalAsked] = useState(0);

  const usedRef = useRef<Set<number>>(new Set());
  const prevPath = useRef("");

  useEffect(() => {
    if (isGamePage && location.pathname !== prevPath.current) {
      prevPath.current = location.pathname;
      setCountdown(QUIZ_INTERVAL);
      setLives(MAX_LIVES);
      setActiveQuiz(null);
      setFeedback(null);
      setGameOver(false);
      setScore(0);
      setTotalAsked(0);
      usedRef.current.clear();
    }
    if (!isGamePage) {
      prevPath.current = "";
      setActiveQuiz(null);
      setFeedback(null);
      setGameOver(false);
    }
  }, [location.pathname, isGamePage]);

  useEffect(() => {
    if (!isGamePage || activeQuiz !== null || gameOver) return;
    const id = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          const { q } = pickQuestion(usedRef.current);
          setTotalAsked(t2 => t2 + 1);
          setActiveQuiz(q);
          return QUIZ_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isGamePage, activeQuiz, gameOver]);

  const handleAnswer = useCallback((optIdx: number) => {
    if (!activeQuiz || feedback !== null) return;
    const correct = optIdx === activeQuiz.ans;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) {
      setScore(s => s + 1);
      playPopSound();
    }
    setTimeout(() => {
      setFeedback(null);
      if (!correct) {
        setLives(prev => {
          const next = prev - 1;
          if (next <= 0) {
            setActiveQuiz(null);
            setGameOver(true);
          } else {
            setActiveQuiz(null);
          }
          return next;
        });
      } else {
        setActiveQuiz(null);
      }
    }, 900);
  }, [activeQuiz, feedback]);

  if (!isGamePage) return null;

  return (
    <>
      {!activeQuiz && !gameOver && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
          <div className="game-quiz-panel flex items-center gap-2 bg-slate-950/80 border border-cyan-400/40 rounded-full px-4 py-1.5 shadow-lg backdrop-blur-sm">
            <span className="text-white/60 text-[10px] font-bold tracking-widest font-mono">{t('gameArena.countdownLabel')}</span>
            <span className={`text-sm font-black font-mono ${countdown <= 10 ? "text-red-400 animate-pulse" : "text-cyan-300"}`}>
              {countdown}s
            </span>
            <span className="text-white/40 mx-1">|</span>
            <span className="text-[10px] font-bold tracking-widest text-white/60 font-mono">{t('gameArena.livesLabel')}</span>
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <span key={i} className={`text-sm ${i < lives ? "text-red-400" : "text-white/20"}`}>♥</span>
            ))}
          </div>
        </div>
      )}

      {activeQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(2,6,23,0.82)" }}>
          <div className="game-quiz-panel w-full max-w-sm bg-slate-950 border-2 border-cyan-400 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,240,255,0.3)]">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 bg-cyan-500/15 border border-cyan-400/40 rounded-full px-3 py-1">
                <span className="text-cyan-300 text-xs font-bold tracking-widest">❓ {t('gameArena.quizHeader')}</span>
              </div>
              <div className="flex justify-center gap-1 mt-2">
                {Array.from({ length: MAX_LIVES }).map((_, i) => (
                  <span key={i} className={`text-lg ${i < lives ? "text-red-400" : "text-white/20"}`}>♥</span>
                ))}
              </div>
            </div>

            <p className="text-white text-sm font-bold text-center leading-snug mb-5">
              {activeQuiz.q}
            </p>

            <div className="grid grid-cols-2 gap-2">
              {activeQuiz.opts.map((opt, i) => {
                let btnClass = "bg-slate-800 hover:bg-cyan-800/60 border border-slate-600 hover:border-cyan-400 text-white";
                if (feedback !== null) {
                  if (i === activeQuiz.ans) btnClass = "bg-green-700/80 border-2 border-green-400 text-white";
                  else if (feedback === "wrong") btnClass = "bg-red-900/50 border border-red-500/40 text-white/50";
                  else btnClass = "bg-slate-800 border border-slate-700 text-white/40";
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={feedback !== null}
                    className={`rounded-xl py-3 px-2 text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${btnClass}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div className={`mt-4 rounded-xl py-2 text-center text-sm font-black tracking-wide ${feedback === "correct" ? "bg-green-600/30 text-green-300" : "bg-red-600/30 text-red-300"}`}>
                {feedback === "correct"
                  ? `✅ ${t('gameArena.correctFeedback')}`
                  : `❌ ${t('gameArena.wrongFeedback', { count: lives - 1 })}`}
              </div>
            )}

            <p className="text-center text-white/30 text-[10px] mt-3 font-mono">
              {t('gameArena.questionCounter', { asked: totalAsked, score })}
            </p>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(2,6,23,0.90)" }}>
          <div className="game-quiz-panel w-full max-w-sm bg-slate-950 border-2 border-red-500 rounded-2xl p-6 text-center shadow-[0_0_50px_rgba(255,80,80,0.3)]">
            <div className="text-5xl mb-3">💀</div>
            <h2 className="text-red-400 text-xl font-black tracking-widest font-display mb-1">{t('gameArena.gameOverTitle')}</h2>
            <p className="text-white/60 text-sm font-body mb-4">{t('gameArena.gameOverDesc')}</p>
            <div className="bg-slate-900 rounded-xl p-4 mb-5 space-y-1">
              <p className="text-white/50 text-xs font-mono">{t('gameArena.totalQuestions')}: <span className="text-white font-bold">{totalAsked}</span></p>
              <p className="text-white/50 text-xs font-mono">{t('gameArena.correctAnswers')}: <span className="text-green-400 font-bold">{score}</span></p>
              <p className="text-white/50 text-xs font-mono">{t('gameArena.wrongAnswers')}: <span className="text-red-400 font-bold">{totalAsked - score}</span></p>
            </div>
            <button
              onClick={() => { playPopSound(); navigate(-1); }}
              className="w-full rounded-xl bg-red-500 hover:bg-red-400 py-3 text-white font-bold text-sm transition-colors"
            >
              {t('gameArena.backToMenuOverlay')}
            </button>
            <button
              onClick={() => {
                setLives(MAX_LIVES);
                setCountdown(QUIZ_INTERVAL);
                setScore(0);
                setTotalAsked(0);
                setGameOver(false);
                usedRef.current.clear();
                playPopSound();
              }}
              className="w-full mt-2 rounded-xl bg-slate-700 hover:bg-slate-600 py-3 text-white font-bold text-sm transition-colors"
            >
              {t('gameArena.tryAgainBtn')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QuizGameOverlay;
