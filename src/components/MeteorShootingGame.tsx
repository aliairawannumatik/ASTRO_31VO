import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowLeft } from "lucide-react";
import Starfield from "@/components/Starfield";
import QuizNavigation from "@/components/QuizNavigation";
import { useAudio } from "@/hooks/useAudio";
import { useSound } from "@/contexts/SoundContext";
import { spaceBg } from "@/assets/placeholder";

const spaceshipImg = "/pesawat.png";
const meteorImg = "/meteor.png";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface MeteorShootingGameProps {
  questions: QuizQuestion[];
  topicLabel: string;
  backPath: string;
  backLabel?: string;
}

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

const MeteorShootingGame = ({ questions, topicLabel, backPath, backLabel = "Kembali" }: MeteorShootingGameProps) => {
  const navigate = useNavigate();
  const { playExplosion, playCorrect, playLaser, startBgMusic, stopBgMusic } = useAudio();
  const { soundOn } = useSound();


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
  const [isLandscape, setIsLandscape] = useState(() => window.innerWidth > window.innerHeight);

  useEffect(() => {
    const handleResize = () => setIsLandscape(window.innerWidth > window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const setupMeteors = useCallback((qIndex: number) => {
    const q = questions[qIndex];
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
  }, [questions]);

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
              setScore((s) => s + 20);
              setFeedback({ type: "correct" });
            } else {
              const correctAnswer = questions[currentQ].options[questions[currentQ].correctIndex];
              setFeedback({ type: "wrong", answer: correctAnswer });
            }

            setTimeout(() => {
              setLaser(null);
              if (currentQ + 1 < questions.length) {
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
    [locked, currentQ, questions, playLaser, playExplosion, playCorrect, setupMeteors, stopBgMusic]
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
      <>
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <img src={spaceBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background/80" />
        <Starfield />
        <QuizNavigation />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[8%] animate-float-slow">
            <img src={meteorImg} alt="" className="w-12 h-12 md:w-16 md:h-16 opacity-60 drop-shadow-[0_0_15px_rgba(255,100,50,0.5)]" />
          </div>
          <div className="absolute top-[15%] right-[12%] animate-float-medium">
            <img src={meteorImg} alt="" className="w-10 h-10 md:w-14 md:h-14 opacity-50 drop-shadow-[0_0_12px_rgba(255,80,40,0.5)]" />
          </div>
          <div className="absolute top-[40%] left-[5%] animate-float-fast">
            <img src={meteorImg} alt="" className="w-8 h-8 md:w-12 md:h-12 opacity-40 drop-shadow-[0_0_10px_rgba(255,60,30,0.5)]" />
          </div>
          <div className="absolute top-[35%] right-[6%] animate-float-slow">
            <img src={meteorImg} alt="" className="w-14 h-14 md:w-18 md:h-18 opacity-55 drop-shadow-[0_0_18px_rgba(255,90,45,0.5)]" />
          </div>
          <div className="absolute bottom-[20%] left-[10%] animate-float-medium">
            <img src={meteorImg} alt="" className="w-9 h-9 md:w-13 md:h-13 opacity-45 drop-shadow-[0_0_12px_rgba(255,70,35,0.5)]" />
          </div>
          <div className="absolute bottom-[25%] right-[8%] animate-float-fast">
            <img src={meteorImg} alt="" className="w-11 h-11 md:w-15 md:h-15 opacity-50 drop-shadow-[0_0_14px_rgba(255,85,40,0.5)]" />
          </div>
          <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 animate-hover-ship">
            <div className="relative flex flex-col items-center">
              <img src={spaceshipImg} alt="" className="w-20 h-24 md:w-28 md:h-32 opacity-70 drop-shadow-[0_0_25px_rgba(0,200,255,0.4)]" />
              <div className="absolute -bottom-1 w-5 h-7 md:w-6 md:h-8 animate-flame" style={{ left: "40%", transform: "translateX(-50%)" }}>
                <div className="w-full h-full flex flex-col items-center">
                  <div className="w-2 md:w-2.5 h-full rounded-full bg-gradient-to-t from-white via-yellow-300 to-transparent blur-[1px] opacity-90" />
                  <div className="absolute w-full h-full rounded-full bg-gradient-to-t from-orange-500/80 via-red-500/40 to-transparent blur-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-center animate-slide-up px-4">
          <div className="mb-2">
            <h1 className="font-display text-3xl md:text-5xl font-black tracking-wider">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,200,255,0.5)]">
                MATH GAME ARENA
              </span>
            </h1>
          </div>
          <div className="mb-6">
            <h2 className="font-display text-4xl md:text-6xl font-black tracking-[0.2em]">
              <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,180,0,0.6)]">
                NUMATIK
              </span>
            </h2>
          </div>

          <div className="inline-block mb-8">
            <div className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 backdrop-blur-sm">
              <span className="font-display text-sm md:text-base font-bold text-cyan-300 tracking-wide">
                {topicLabel}
              </span>
            </div>
          </div>

          <div className="bg-card/70 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 max-w-md mx-auto mb-8 shadow-[0_0_30px_rgba(0,200,255,0.15)]">
            <h3 className="font-display text-lg font-bold text-cyan-400 mb-4 flex items-center justify-center gap-2">
              <span className="text-xl">🚀</span> CARA BERMAIN <span className="text-xl">🚀</span>
            </h3>
            <ul className="text-left space-y-3 font-body text-sm text-foreground/90">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-xs">1</span>
                <span>Baca soal matematika yang muncul di bawah layar</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-xs">2</span>
                <span>Cari jawaban yang <strong className="text-cyan-300">BENAR</strong> pada meteor yang jatuh</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-xs">3</span>
                <span><strong className="text-yellow-300">KLIK</strong> meteor tersebut untuk menembak!</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-xs">4</span>
                <span>Setiap jawaban benar mendapat <strong className="text-green-400">+20 poin</strong></span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleStart}
            className="relative font-display text-xl md:text-2xl px-14 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-black tracking-wider cursor-pointer shadow-[0_0_40px_rgba(0,200,255,0.5)] hover:shadow-[0_0_60px_rgba(0,200,255,0.7)] transition-shadow duration-300 animate-pulse-scale"
          >
            <span className="relative z-10 flex items-center gap-3">
              <span>&#9658;</span> MULAI GAME <span>&#9658;</span>
            </span>
          </button>

        </div>
      </div>

      <div
        className="fixed left-0 bottom-0 z-50 p-4"
        style={{
          paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
          paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
        }}
      >
        <button
          onClick={() => { navigate(backPath); }}
          className="w-11 h-11 rounded-full bg-card/80 backdrop-blur border border-border 
            flex items-center justify-center text-primary hover:border-primary/60 
            hover:box-glow-cyan transition-all duration-300 cursor-pointer"
          title={backLabel}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
      </>
    );
  }

  if (finished) {
    const totalQuestions = questions.length;
    const correctAnswers = score / 20;
    const maxScore = totalQuestions * 20;
    const pct = Math.round((score / maxScore) * 100);

    const getCategory = () => {
      if (correctAnswers === totalQuestions) {
        return {
          title: "MASTER GALAKSI",
          icon: "🚀",
          color: "from-yellow-400 via-orange-400 to-red-500",
          borderColor: "border-yellow-400/60",
          glowColor: "shadow-[0_0_40px_rgba(255,180,0,0.4)]",
          message: "Luar biasa! Seluruh meteor musuh musnah! Navigasi dan logika matematika kamu benar-benar sempurna. Kamu adalah Kapten Math Space sejati!",
          stars: 5,
        };
      } else if (correctAnswers >= totalQuestions * 0.8) {
        return {
          title: "NAVIGATOR HANDAL",
          icon: "🌟",
          color: "from-cyan-400 via-blue-400 to-purple-500",
          borderColor: "border-cyan-400/60",
          glowColor: "shadow-[0_0_35px_rgba(0,200,255,0.4)]",
          message: "Hebat, Sobat Numatik! Kamu berhasil membersihkan sebagian besar jalur meteor. Hanya satu yang terlewat, tetap fokus di misi berikutnya!",
          stars: 4,
        };
      } else if (correctAnswers >= totalQuestions * 0.6) {
        return {
          title: "PENJELAJAH ORBIT",
          icon: "🛸",
          color: "from-green-400 via-emerald-400 to-teal-500",
          borderColor: "border-green-400/60",
          glowColor: "shadow-[0_0_30px_rgba(0,255,150,0.3)]",
          message: "Bagus! Kamu berhasil menembus sabuk asteroid. Sedikit lagi menuju puncak, yuk asah lagi pemahaman konsep dasar matematikanya!",
          stars: 3,
        };
      } else if (correctAnswers >= totalQuestions * 0.4) {
        return {
          title: "CADET PEMULA",
          icon: "🌙",
          color: "from-blue-400 via-indigo-400 to-violet-500",
          borderColor: "border-blue-400/60",
          glowColor: "shadow-[0_0_25px_rgba(100,150,255,0.3)]",
          message: "Wah, kapal terkena guncangan meteor! Jangan menyerah, Sobat. Ayo pelajari kembali langkah-langkah pengerjaannya agar pesawatmu lebih tangguh.",
          stars: 2,
        };
      } else {
        return {
          title: "MISI PELATIHAN",
          icon: "💫",
          color: "from-slate-400 via-gray-400 to-zinc-500",
          borderColor: "border-slate-400/60",
          glowColor: "shadow-[0_0_20px_rgba(150,150,150,0.3)]",
          message: "Misi gagal! Tapi jangan sedih, ini saatnya latihan lebih keras lagi. Ayo kita mulai sesi training untuk memperbaiki kemampuan menembakmu!",
          stars: 1,
        };
      }
    };

    const category = getCategory();

    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <img src={spaceBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/80" />
        <Starfield />
        <QuizNavigation />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[8%] animate-float-slow">
            <img src={meteorImg} alt="" className="w-10 h-10 opacity-40" />
          </div>
          <div className="absolute top-[15%] right-[12%] animate-float-medium">
            <img src={meteorImg} alt="" className="w-8 h-8 opacity-30" />
          </div>
          <div className="absolute bottom-[15%] left-[5%] animate-float-fast">
            <img src={meteorImg} alt="" className="w-12 h-12 opacity-35" />
          </div>
          <div className="absolute bottom-[20%] right-[8%] animate-float-slow">
            <img src={meteorImg} alt="" className="w-9 h-9 opacity-30" />
          </div>
        </div>

        <div className="relative z-10 text-center animate-slide-up px-4 max-w-lg mx-auto">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-cyan-400 text-glow-cyan mb-6">MISI SELESAI!</h1>

          <div className={`bg-card/80 backdrop-blur-md border-2 ${category.borderColor} rounded-2xl p-6 md:p-8 mb-6 ${category.glowColor}`}>
            <div className="text-5xl md:text-6xl mb-3 animate-bounce">{category.icon}</div>
            <div className="mb-4">
              <p className="font-display text-lg text-muted-foreground mb-1">{correctAnswers} / {totalQuestions}</p>
              <h2 className={`font-display text-2xl md:text-3xl font-black bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                {category.title}
              </h2>
            </div>
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={`text-2xl md:text-3xl transition-all duration-500 ${s <= category.stars ? "opacity-100 scale-100" : "opacity-20 scale-75"}`}
                >
                  {s <= category.stars ? "⭐" : "☆"}
                </span>
              ))}
            </div>
            <div className="bg-background/50 rounded-xl px-4 py-3 mb-4">
              <p className="font-display text-3xl md:text-4xl font-black text-accent text-glow-accent">{score}</p>
              <p className="text-muted-foreground text-xs font-body">dari {maxScore} poin ({pct}%)</p>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
              <div
                className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-1000`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="font-body text-sm text-foreground/90 leading-relaxed italic">
              "{category.message}"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleStart}
              className="font-display text-sm px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold cursor-pointer hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(0,200,255,0.3)]"
            >
              Ulangi Misi
            </button>
            <button
              onClick={() => navigate(backPath)}
              className="font-display text-sm px-8 py-3 rounded-xl bg-card border border-border text-foreground font-bold cursor-pointer hover:bg-muted transition-colors"
            >
              Kembali
            </button>
            <button
              onClick={() => navigate("/menu")}
              className="font-display text-sm px-8 py-3 rounded-xl bg-card border border-border text-foreground font-bold cursor-pointer hover:bg-muted transition-colors"
            >
              Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="relative h-[100dvh] overflow-hidden select-none flex flex-col">
      <img src={spaceBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <Starfield />
      <QuizNavigation />

      <button
        onClick={() => { stopBgMusic(); navigate(backPath); }}
        className="absolute top-4 left-4 z-30 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-card/70 backdrop-blur border border-border text-foreground/80 hover:text-foreground hover:bg-card transition-all duration-200 font-body text-xs cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        {backLabel}
      </button>

      <div className={`relative z-20 shrink-0 flex flex-col items-center px-4 ${isLandscape ? "pt-4" : "pt-10 md:pt-14"} pb-1`}>
        <div className="font-display text-xs text-muted-foreground mb-0.5">
          SOAL {currentQ + 1}/{questions.length}
        </div>
        <div className="font-display text-xl md:text-2xl font-bold text-accent text-glow-accent">
          SKOR: {score}
        </div>
      </div>

      <div className="relative flex-1 min-h-0">
        <div className={`absolute ${isLandscape ? "top-[1%] h-[28%]" : "top-[3%] h-[45%]"} left-0 right-0 z-10`}>
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
                <img src={meteorImg} alt="meteor" className={`${isLandscape ? "w-14 h-14" : "w-16 h-16 md:w-20 md:h-20"} drop-shadow-[0_0_15px_rgba(255,60,30,0.6)]`} style={{ mixBlendMode: "screen", background: "transparent" }} />
                <span className="absolute inset-0 flex items-center justify-center font-display text-[8px] md:text-[9px] font-bold text-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] px-1 text-center leading-tight">{m.label}</span>
              </div>
              {m.hit && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 rounded-full bg-accent/60 animate-ping" />
                </div>
              )}
            </button>
          ))}
        </div>

        {laser && laser.active && (
          <div className="absolute z-10 pointer-events-none" style={{
            left: `${laser.fromX}%`, bottom: "20%", transform: "translateX(-50%)",
            height: `${laser.progress * 80}%`, width: 12,
            background: "linear-gradient(to top, hsl(50, 100%, 60%), hsl(50, 100%, 85%), hsl(50, 100%, 90%, 0.4))",
            boxShadow: "0 0 20px hsl(50, 100%, 60%), 0 0 40px hsl(50, 100%, 55%), 0 0 60px hsl(50, 100%, 50%, 0.4)",
            borderRadius: 6, transformOrigin: "bottom center",
          }} />
        )}

        <div className={`absolute ${isLandscape ? "bottom-[2%]" : "bottom-[18%]"} z-20 transition-all duration-500 ease-out`} style={{ left: `${shipX}%`, transform: "translateX(-50%)" }}>
          <div className="relative flex flex-col items-center">
            <img src={spaceshipImg} alt="spaceship" className={`${isLandscape ? "w-14 h-16" : "w-14 h-16 md:w-20 md:h-24"} drop-shadow-[0_0_20px_rgba(0,200,255,0.5)]`} />
            <div className="absolute -bottom-1 w-4 h-6 md:w-5 md:h-7 animate-flame" style={{ left: "40%", transform: "translateX(-50%)" }}>
              <div className="w-full h-full flex flex-col items-center">
                <div className="w-1.5 md:w-2 h-full rounded-full bg-gradient-to-t from-white via-yellow-300 to-transparent blur-[1px] opacity-90" />
                <div className="absolute w-full h-full rounded-full bg-gradient-to-t from-orange-500/80 via-red-500/40 to-transparent blur-sm" />
              </div>
            </div>
          </div>
        </div>

        {feedback && (
          <div className={`absolute top-[52%] left-1/2 -translate-x-1/2 z-30 px-5 py-2 rounded-full font-display text-sm font-bold backdrop-blur-sm border animate-slide-up ${
            feedback.type === "correct"
              ? "bg-green-500/80 border-green-400 text-white shadow-[0_0_20px_rgba(0,255,100,0.4)]"
              : "bg-red-500/80 border-red-400 text-white shadow-[0_0_20px_rgba(255,0,0,0.4)]"
          }`}>
            {feedback.type === "correct"
              ? "✅ BENAR! +20 Poin"
              : `❌ Jawaban: ${feedback.answer}`}
          </div>
        )}
      </div>

      <div className="relative z-20 shrink-0 bg-card/80 backdrop-blur-md border-t border-border px-4 py-3 md:py-4">
        <p className="font-body text-xs md:text-sm text-center text-foreground/90 leading-relaxed max-w-2xl mx-auto">
          {q.question}
        </p>
      </div>
    </div>
  );
};

export default MeteorShootingGame;
