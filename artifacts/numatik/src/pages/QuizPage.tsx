import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import QuizNavigation from "@/components/QuizNavigation";
import { useAudio } from "@/hooks/useAudio";
import { quizQuestions } from "@/data/quizData";
import { spaceBg } from "@/assets/placeholder";

const spaceshipImg = "/pesawat.png";
const meteorImg = "/meteor.png";

interface MeteorState {
  id: number;
  x: number;
  label: string;
  hit: boolean;
  correct: boolean;
}

interface LaserState {
  fromX: number;
  toX: number;
  active: boolean;
  progress: number;
}

const QuizPage = () => {
  const navigate = useNavigate();
  const { playLaser, playExplosion, playCorrect, startBgMusic, stopBgMusic } = useAudio();

  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [shipX, setShipX] = useState(50);
  const [laser, setLaser] = useState<LaserState | null>(null);
  const [meteors, setMeteors] = useState<MeteorState[]>([]);
  const [feedback, setFeedback] = useState<{ type: "correct" | "wrong"; answer?: string } | null>(null);
  const [locked, setLocked] = useState(false);
  const animRef = useRef<number>(0);

  const setupMeteors = useCallback((qIndex: number) => {
    const q = quizQuestions[qIndex];
    const count = q.options.length;
    const spacing = 80 / (count + 1);
    setMeteors(
      q.options.map((opt, i) => ({
        id: i,
        x: 10 + spacing * (i + 1),
        label: opt,
        hit: false,
        correct: i === q.correctIndex,
      }))
    );
    setShipX(50);
    setLaser(null);
    setFeedback(null);
    setLocked(false);
  }, []);

  const handleStart = () => {
    setStarted(true);
    setCurrentQ(0);
    setScore(0);
    setFinished(false);
    startBgMusic();
    setupMeteors(0);
  };

  const handleMeteorClick = useCallback(
    (meteor: MeteorState) => {
      if (locked || meteor.hit) return;
      setLocked(true);
      setShipX(meteor.x);
      playLaser();

      setTimeout(() => {
        setLaser({ fromX: meteor.x, toX: meteor.x, active: true, progress: 0 });
        let p = 0;
        const step = () => {
          p += 0.03;
          setLaser((prev) => prev ? { ...prev, progress: Math.min(p, 1) } : null);
          if (p < 1) {
            animRef.current = requestAnimationFrame(step);
          } else {
            playExplosion();
            setMeteors((prev) => prev.map((m) => (m.id === meteor.id ? { ...m, hit: true } : m)));

            if (meteor.correct) {
              playCorrect();
              setScore((s) => s + 10);
              setFeedback({ type: "correct" });
            } else {
              const correctAnswer = quizQuestions[currentQ].options[quizQuestions[currentQ].correctIndex];
              setFeedback({ type: "wrong", answer: correctAnswer });
            }

            setTimeout(() => {
              setLaser(null);
              if (currentQ + 1 < quizQuestions.length) {
                setCurrentQ((q) => {
                  const next = q + 1;
                  setupMeteors(next);
                  return next;
                });
              } else {
                setFinished(true);
                stopBgMusic();
              }
            }, 1500);
          }
        };
        animRef.current = requestAnimationFrame(step);
      }, 500);
    },
    [locked, currentQ, playLaser, playExplosion, playCorrect, setupMeteors, stopBgMusic]
  );

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animRef.current);
      stopBgMusic();
    };
  }, [stopBgMusic]);

  const [floatOffset, setFloatOffset] = useState(0);
  useEffect(() => {
    if (!started || finished) return;
    let id: number;
    let t = 0;
    const anim = () => {
      t += 0.02;
      setFloatOffset(Math.sin(t) * 8);
      id = requestAnimationFrame(anim);
    };
    id = requestAnimationFrame(anim);
    return () => cancelAnimationFrame(id);
  }, [started, finished]);

  if (!started) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <img src={spaceBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/50" />
        <Starfield />
        <QuizNavigation />
        <div className="relative z-10 text-center animate-slide-up">
          <h1 className="font-display text-4xl md:text-5xl font-black gradient-neon bg-clip-text text-transparent mb-2">MATH SPACE</h1>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-accent text-glow-accent mb-6">QUIZ BRSD</h2>
          <p className="text-muted-foreground text-sm mb-8 font-body max-w-md mx-auto px-4">
            Tembak meteor yang berisi jawaban benar! Klik meteor untuk mengarahkan pesawat dan menembak.
          </p>
          <button onClick={handleStart} className="font-display text-xl px-12 py-4 rounded-xl bg-accent text-accent-foreground font-bold hover:scale-105 transition-transform duration-300 cursor-pointer box-glow-cyan">
            MULAI
          </button>
          <div className="mt-6">
            <button onClick={() => navigate("/olimpiade")} className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">← Kembali ke Olimpiade</button>
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    const maxScore = quizQuestions.length * 10;
    const pct = Math.round((score / maxScore) * 100);
    const stars = pct >= 80 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0;
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <img src={spaceBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/50" />
        <Starfield />
        <QuizNavigation />
        <div className="relative z-10 text-center animate-slide-up">
          <h1 className="font-display text-3xl font-bold text-primary text-glow-cyan mb-4">MISI SELESAI!</h1>
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-8 max-w-sm mx-auto mb-6">
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3].map((s) => (
                <span key={s} className={`text-4xl transition-all duration-500 ${s <= stars ? "opacity-100 scale-100" : "opacity-30 scale-75"}`}>⭐</span>
              ))}
            </div>
            <p className="font-display text-5xl font-black text-accent text-glow-accent mb-2">{score}</p>
            <p className="text-muted-foreground text-sm font-body">dari {maxScore} poin ({pct}%)</p>
            <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full gradient-neon rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-4 font-display text-sm text-foreground">
              {pct >= 80 ? "🌟 Luar biasa!" : pct >= 60 ? "👍 Bagus!" : "📚 Pelajari lagi materinya!"}
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={handleStart} className="font-display text-sm px-6 py-2 rounded-lg bg-primary text-primary-foreground cursor-pointer hover:opacity-90">🔄 Ulangi</button>
            <button onClick={() => navigate("/olimpiade")} className="font-display text-sm px-6 py-2 rounded-lg bg-muted text-foreground cursor-pointer hover:opacity-90">Olimpiade</button>
            <button onClick={() => navigate("/menu")} className="font-display text-sm px-6 py-2 rounded-lg bg-muted text-foreground cursor-pointer hover:opacity-90">Menu</button>
          </div>
        </div>
      </div>
    );
  }

  const q = quizQuestions[currentQ];

  return (
    <div className="relative min-h-screen overflow-hidden select-none">
      <img src={spaceBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <Starfield />
      <QuizNavigation />

      {/* HUD - centered scoreboard */}
      <div className="absolute top-0 left-0 right-0 z-20 flex flex-col items-center px-4 py-3">
        <div className="font-display text-xs text-muted-foreground mb-1">
          SOAL {currentQ + 1}/{quizQuestions.length}
        </div>
        <div className="font-display text-xl md:text-2xl font-bold text-accent text-glow-accent">
          SKOR: {score}
        </div>
      </div>

      {/* Question bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4">
        <div className="bg-card/90 backdrop-blur border border-primary/30 rounded-xl px-6 py-3 max-w-2xl mx-auto box-glow-cyan text-center">
          <p className="font-body text-sm md:text-base text-foreground">{q.question}</p>
        </div>
      </div>

      {/* Feedback popup */}
      {feedback && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className={`rounded-2xl px-8 py-6 text-center animate-scale-in ${
            feedback.type === "correct" ? "bg-primary/90 backdrop-blur" : "bg-destructive/90 backdrop-blur"
          }`}>
            {feedback.type === "correct" ? (
              <>
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3].map((s) => (
                    <span key={s} className="text-3xl animate-bounce" style={{ animationDelay: `${s * 100}ms` }}>⭐</span>
                  ))}
                </div>
                <p className="font-display text-xl font-black text-primary-foreground">JAWABAN BENAR</p>
              </>
            ) : (
              <>
                <p className="font-display text-xl font-black text-destructive-foreground mb-1">JAWABAN SALAH</p>
                <p className="font-body text-sm text-destructive-foreground/80">Jawaban: {feedback.answer}</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Meteors */}
      <div className="absolute top-[18%] left-0 right-0 z-10 h-[30%]">
        {meteors.map((m) => (
          <button key={m.id} onClick={() => handleMeteorClick(m)} disabled={m.hit || locked}
            className="absolute transition-all duration-500 cursor-pointer disabled:cursor-default"
            style={{
              left: `${m.x}%`, top: "50%",
              transform: `translate(-50%, ${-50 + floatOffset * (m.id % 2 === 0 ? 1 : -1)}%) ${m.hit ? "scale(0)" : "scale(1)"}`,
              opacity: m.hit ? 0 : 1,
              transition: m.hit ? "all 0.3s ease-out" : "transform 0.5s ease",
            }}>
            <div className="relative">
              <img src={meteorImg} alt="meteor" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-[0_0_15px_rgba(255,60,30,0.6)]" style={{ mixBlendMode: "screen", background: "transparent" }} />
              <span className="absolute inset-0 flex items-center justify-center font-display text-[9px] md:text-[10px] font-bold text-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] px-1 text-center leading-tight">{m.label}</span>
            </div>
            {m.hit && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-accent/60 animate-ping" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Laser */}
      {laser && laser.active && (
        <div className="absolute z-15 pointer-events-none" style={{
          left: `${laser.fromX}%`, bottom: "18%", transform: "translateX(-50%)",
          height: `${laser.progress * 55}%`, width: 6,
          background: "linear-gradient(to top, hsl(50, 100%, 55%), hsl(50, 100%, 80%, 0.3))",
          boxShadow: "0 0 15px hsl(50, 100%, 55%), 0 0 30px hsl(50, 100%, 55%, 0.5)",
          borderRadius: 3, transformOrigin: "bottom center",
        }} />
      )}

      {/* Spaceship */}
      <div className="absolute bottom-[12%] z-10 transition-all duration-500 ease-out" style={{ left: `${shipX}%`, transform: "translateX(-50%)" }}>
        <div className="relative">
          <img src={spaceshipImg} alt="spaceship" className="w-16 h-20 md:w-20 md:h-24 drop-shadow-[0_0_20px_rgba(0,180,255,0.4)]" style={{ mixBlendMode: "screen", background: "transparent" }} />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-8 animate-flame">
            <div className="w-full h-full rounded-full bg-gradient-to-t from-primary via-primary/50 to-transparent blur-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
