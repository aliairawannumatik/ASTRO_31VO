import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import { useAudio, playPopSound } from "@/hooks/useAudio";
import { useSound } from "@/contexts/SoundContext";
import { useTheme } from "@/contexts/ThemeContext";
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
  homePath?: string;
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

const MeteorShootingGame = ({ questions, topicLabel, backPath, backLabel = "Kembali", homePath = "/menu" }: MeteorShootingGameProps) => {
  const navigate = useNavigate();
  const { playExplosion, playCorrect, playLaser, startBgMusic, stopBgMusic } = useAudio();
  const { soundOn } = useSound();
  const { isDark } = useTheme();


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
  const moveIntervalRef = useRef<number | null>(null);
  const lockedRef = useRef(false);
  const meteorsRef = useRef<MeteorState[]>([]);
  const shipXRef = useRef(50);
  const [isLandscape, setIsLandscape] = useState(() => window.innerWidth > window.innerHeight);

  useEffect(() => { lockedRef.current = locked; }, [locked]);
  useEffect(() => { meteorsRef.current = meteors; }, [meteors]);
  useEffect(() => { shipXRef.current = shipX; }, [shipX]);

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

  const engageMeteor = useCallback(
    (meteor: MeteorState, fromX: number) => {
      if (lockedRef.current || meteor.hit) return;
      setLocked(true);
      lockedRef.current = true;
      playLaser();

      setLaser({ fromX, toX: fromX, active: true, progress: 0 });
      let p = 0;
      const step = () => {
        p += 0.04;
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
    },
    [currentQ, questions, playLaser, playExplosion, playCorrect, setupMeteors, stopBgMusic]
  );

  const fireLaser = useCallback(() => {
    if (lockedRef.current) return;
    const tolerance = 8;
    let target: MeteorState | null = null;
    let bestD = tolerance;
    for (const m of meteorsRef.current) {
      if (m.hit) continue;
      const d = Math.abs(m.x - shipXRef.current);
      if (d < bestD) { bestD = d; target = m; }
    }
    if (target) {
      engageMeteor(target, shipXRef.current);
      return;
    }
    // Visual miss: fire laser without hitting anything
    playLaser();
    const fromX = shipXRef.current;
    setLaser({ fromX, toX: fromX, active: true, progress: 0 });
    let p = 0;
    const step = () => {
      p += 0.05;
      setLaser((prev) => prev ? { ...prev, progress: Math.min(p, 1) } : null);
      if (p < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setTimeout(() => setLaser(null), 150);
      }
    };
    animRef.current = requestAnimationFrame(step);
  }, [engageMeteor, playLaser]);

  const moveShip = useCallback((dir: -1 | 1) => {
    if (lockedRef.current) return;
    setShipX((x) => Math.max(8, Math.min(92, x + dir * 2.5)));
  }, []);

  const startMove = useCallback((dir: -1 | 1) => {
    moveShip(dir);
    if (moveIntervalRef.current) window.clearInterval(moveIntervalRef.current);
    moveIntervalRef.current = window.setInterval(() => moveShip(dir), 35);
  }, [moveShip]);

  const stopMove = useCallback(() => {
    if (moveIntervalRef.current) {
      window.clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  }, []);

  // Keyboard support
  useEffect(() => {
    if (!started || finished) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        startMove(-1);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        startMove(1);
      } else if (e.key === " " || e.key === "ArrowUp" || e.key === "Enter") {
        e.preventDefault();
        fireLaser();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "a", "A", "d", "D"].includes(e.key)) {
        stopMove();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      stopMove();
    };
  }, [started, finished, startMove, stopMove, fireLaser]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animRef.current);
      stopBgMusic();
    };
  }, [stopBgMusic]);


  if (!started) {
    return (
      <div className="fixed inset-0 z-40 overflow-hidden">
        <style>{`
          @keyframes msg-floatA { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
          @keyframes msg-floatB { 0%,100%{transform:translateY(-5px)} 50%{transform:translateY(7px)} }
          @keyframes msg-floatC { 0%,100%{transform:translateY(0px) rotate(15deg)} 50%{transform:translateY(-8px) rotate(-10deg)} }
          @keyframes msg-pulse  { 0%,100%{opacity:0.75} 50%{opacity:1} }
          @keyframes msg-shimmer{ 0%{background-position:200% center} 100%{background-position:-200% center} }
          @keyframes msg-scanY  { 0%{transform:translateY(-120%)} 100%{transform:translateY(220%)} }
          @keyframes msg-breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
          @keyframes msg-fall   { 0%{transform:translateY(-20px) rotate(0deg)} 100%{transform:translateY(8px) rotate(20deg)} }
          .msg-fa{animation:msg-floatA 3.2s ease-in-out infinite}
          .msg-fb{animation:msg-floatB 3.8s ease-in-out infinite}
          .msg-fc{animation:msg-floatC 2.8s ease-in-out infinite}
          .msg-fp{animation:msg-pulse 2s ease-in-out infinite}
          .msg-title-shine{background:linear-gradient(90deg,#facc15,#fb923c,#ef4444,#f97316,#facc15);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:msg-shimmer 4s linear infinite}
          .msg-btn-breathe{animation:msg-breathe 2.8s ease-in-out infinite}
          .msg-scroll { height:100%; overflow-y:auto; scrollbar-width:none; display:flex; flex-direction:column; }
          .msg-wrap   { flex:1; display:flex; flex-direction:column; justify-content:space-evenly; padding:0.5rem 1rem; width:100%; }
          .msg-main   { display:flex; flex-direction:column; gap:0.75rem; }
          .msg-battle { display:flex; flex-direction:column; gap:0.5rem; }
          .msg-action { display:flex; flex-direction:column; gap:0.5rem; }
          @media (orientation:landscape) {
            .msg-wrap   { justify-content:space-evenly; padding:0.35rem 1.75rem; max-width:860px; margin:0 auto; width:100%; }
            .msg-main   { flex-direction:row; align-items:stretch; gap:2rem; }
            .msg-battle { flex:1; justify-content:center; gap:0.6rem; }
            .msg-action { flex:1; justify-content:center; gap:0.6rem; }
          }
        `}</style>

        {/* Deep space + meteor-fire background */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 15%, rgba(80,20,0,1) 0%, rgba(15,2,0,1) 60%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 10% 40%, rgba(200,60,0,0.18) 0%, transparent 55%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 90% 60%, rgba(150,30,0,0.14) 0%, transparent 55%)" }} />
        <div className="absolute inset-x-0 h-[1px] pointer-events-none" style={{ background: "linear-gradient(to right, transparent, rgba(255,150,50,0.2), transparent)", animation: "msg-scanY 6s linear infinite" }} />

        <div className="msg-scroll relative z-10">
          <div className="msg-wrap">

            {/* ── HEADER ── */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-between w-full mb-1">
                <button onClick={() => { playPopSound(); stopBgMusic(); navigate(backPath); }}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-display font-bold text-xs shadow-[0_0_15px_rgba(255,100,0,0.4)] hover:opacity-90 transition-opacity cursor-pointer">
                  <span className="text-base leading-none">←</span>
                  <span>Kembali</span>
                </button>
                <div className="text-[7px] tracking-[5px] text-orange-500/60 uppercase font-bold">⬡ MATH GAME ARENA ⬡</div>
                <button onClick={() => { playPopSound(); stopBgMusic(); navigate(homePath); }}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-display font-bold text-xs shadow-[0_0_15px_rgba(255,100,0,0.4)] hover:opacity-90 transition-opacity cursor-pointer">
                  <span className="text-base leading-none">🏠</span>
                  <span>Home</span>
                </button>
              </div>
              <div className="msg-title-shine font-display font-black leading-none" style={{ fontSize: "clamp(1.3rem,4vw,1.9rem)" }}>PESAWAT TEMBAK METEOR</div>
              <div className="mx-auto mt-0.5 h-0.5 w-36 rounded-full" style={{ background: "linear-gradient(to right, transparent, #fb923c, #ef4444, transparent)" }} />
              <p className="text-white/40 text-[8px] tracking-widest uppercase mt-0.5">🔥 Arahkan · Tembak · Hancurkan 🔥</p>
              {topicLabel && <p className="text-orange-300/70 text-[9px] tracking-wider mt-0.5 font-bold">✦ {topicLabel} ✦</p>}
            </div>

            {/* ── MAIN BODY ── */}
            <div className="msg-main">

              {/* LEFT — spaceship vs meteors visual */}
              <div className="msg-battle">
                <div className="flex items-end justify-center gap-6 w-full">
                  {/* Player ship */}
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="text-[7px] text-cyan-400/70 font-bold tracking-wider uppercase">PESAWATMU</div>
                    <div className="relative">
                      <div className="absolute inset-0 pointer-events-none rounded-full" style={{ background: "radial-gradient(circle, rgba(0,255,255,0.15) 0%, transparent 70%)", transform: "scale(2.2)" }} />
                      <img src={spaceshipImg} alt="pesawat" className="msg-fa relative z-10"
                        style={{ width: 48, filter: "drop-shadow(0 0 12px #00FFFF) drop-shadow(0 0 24px #0088FF)" }} />
                    </div>
                    <div className="w-1.5 h-4 rounded-full" style={{ background: "linear-gradient(to bottom, rgba(255,140,0,0.9), transparent)" }} />
                    <div className="text-[8px] font-bold text-cyan-400">KAMU</div>
                  </div>
                  <div className="flex flex-col items-center pb-4">
                    <div className="text-xl font-black text-white/20">VS</div>
                  </div>
                  {/* Meteors */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-[7px] text-orange-400/70 font-bold tracking-wider uppercase">METEOR MUSUH</div>
                    <div className="flex gap-2 items-end">
                      {[
                        { w: 36, delay: "0s",   opacity: 0.9 },
                        { w: 28, delay: "0.6s",  opacity: 0.75 },
                        { w: 42, delay: "1.1s",  opacity: 0.85 },
                      ].map((m, i) => (
                        <img key={i} src={meteorImg} alt="meteor"
                          style={{ width: m.w, filter: "drop-shadow(0 0 10px #ff6600) drop-shadow(0 0 20px #ff3300)", opacity: m.opacity, animation: `msg-floatB 3.4s ease-in-out infinite`, animationDelay: m.delay }} />
                      ))}
                    </div>
                    <span className="text-[8px] font-bold text-orange-400">HANCURKAN!</span>
                  </div>
                </div>

                {/* Laser beam hint */}
                <div>
                  <div className="w-full h-px my-1.5" style={{ background: "linear-gradient(to right, transparent, rgba(255,150,0,0.3), transparent)" }} />
                  <div className="grid grid-cols-3 gap-1.5 w-full px-1">
                    {([
                      { icon: "◀▶",  label: "GESER",  desc: "Kiri / Kanan"   },
                      { icon: "🔥",   label: "TEMBAK", desc: "Tombol api"     },
                      { icon: "⌨️",   label: "PC",     desc: "← → + SPASI"   },
                    ] as const).map(t => (
                      <div key={t.label} className="flex flex-col items-center gap-0.5 rounded-xl py-1.5 px-1 border border-orange-500/20"
                        style={{ background: "rgba(255,100,0,0.07)", boxShadow: "0 0 8px rgba(255,100,0,0.12)" }}>
                        <span className="text-base leading-none">{t.icon}</span>
                        <span className="text-[7px] font-black text-orange-300">{t.label}</span>
                        <span className="text-[6px] text-white/35 text-center leading-tight">{t.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT — instructions + button */}
              <div className="msg-action">
                <div>
                  <div className="w-full h-px mb-1.5" style={{ background: "linear-gradient(to right, transparent, rgba(255,150,0,0.3), transparent)" }} />
                  <div className="text-[7px] text-white/35 tracking-widest uppercase mb-1.5 font-bold text-center">📋 CARA BERMAIN</div>
                  <div className="space-y-1.5 px-1">
                    {[
                      { icon: "📖", text: "Baca soal matematika yang muncul di bawah layar" },
                      { icon: "◀▶", text: "Geser pesawat ke kiri/kanan agar sejajar dengan meteor BENAR" },
                      { icon: "🔥", text: "Tekan TEMBAK atau SPASI untuk menembakkan laser ke meteor" },
                      { icon: "✅", text: "Tembak jawaban BENAR = +20 poin · Salah = minus poin!" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-xs shrink-0 mt-0.5">{item.icon}</span>
                        <span className="text-[8px] text-white/60 leading-tight">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 mt-2">
                  <button onClick={handleStart}
                    className="msg-btn-breathe relative overflow-hidden font-display font-black text-white text-lg px-8 py-3 rounded-2xl cursor-pointer hover:scale-110 active:scale-95 w-full"
                    style={{
                      background: "linear-gradient(135deg, #f97316 0%, #ef4444 50%, #dc2626 100%)",
                      boxShadow: "0 0 30px rgba(255,100,0,0.9), 0 0 60px rgba(200,50,0,0.4), 0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)",
                    }}>
                    <span className="relative z-10 tracking-wide">🔥 MULAI TEMBAK</span>
                  </button>
                  <div className="text-[7px] text-white/20 text-center">◀ ▶ untuk bergerak · 🔥 TEMBAK untuk menembak</div>
                </div>
              </div>

            </div>{/* msg-main */}
          </div>{/* msg-wrap */}
        </div>{/* msg-scroll */}
      </div>
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

        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
          style={{
            paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
            paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
            paddingTop: "max(0.75rem, env(safe-area-inset-top, 0px))",
          }}
        >
          <button
            onClick={() => { playPopSound(); navigate(backPath); }}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:opacity-90 transition-opacity cursor-pointer"
            title={backLabel}
          >
            <span className="text-base leading-none">←</span>
            <span className="hidden sm:inline">Kembali</span>
          </button>
          <button
            onClick={() => { playPopSound(); navigate(homePath); }}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:opacity-90 transition-opacity cursor-pointer"
            title="Menu Utama"
          >
            <span className="text-base leading-none">🏠</span>
            <span className="hidden sm:inline">Home</span>
          </button>
        </div>

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

      <div
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3"
        style={{
          paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
          paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
          paddingTop: "max(0.75rem, env(safe-area-inset-top, 0px))",
        }}
      >
        <button
          onClick={() => { playPopSound(); stopBgMusic(); navigate(backPath); }}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:opacity-90 transition-opacity cursor-pointer"
          title={backLabel}
        >
          <span className="text-base leading-none">←</span>
          <span className="hidden sm:inline">Kembali</span>
        </button>
        <button
          onClick={() => { playPopSound(); stopBgMusic(); navigate(homePath); }}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:opacity-90 transition-opacity cursor-pointer"
          title="Menu Utama"
        >
          <span className="text-base leading-none">🏠</span>
          <span className="hidden sm:inline">Home</span>
        </button>
      </div>

      <div className={`relative z-20 shrink-0 flex flex-col items-center px-4 ${isLandscape ? "pt-4" : "pt-8 md:pt-14"} pb-1`}>
        <div className="font-display text-xs text-muted-foreground mb-0.5">
          SOAL {currentQ + 1}/{questions.length}
        </div>
        <div className="font-display text-xl md:text-2xl font-bold text-accent text-glow-accent">
          SKOR: {score}
        </div>
        <div className="mt-2 w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-md border border-border rounded-xl px-4 py-2">
          <p className="font-body text-xs md:text-sm text-center text-foreground/90 leading-snug line-clamp-3">
            {q.question}
          </p>
        </div>
      </div>

      <div className="relative flex-1 min-h-0">
        <div className={`absolute ${isLandscape ? "top-[1%] h-[28%]" : "top-[1%] h-[38%]"} left-0 right-0 z-10`}>
          {meteors.map((m) => {
            const aimed = !m.hit && !locked && Math.abs(m.x - shipX) < 8;
            return (
              <div key={m.id}
                className="absolute pointer-events-none"
                style={{ left: `${m.x}%`, top: "50%", transform: "translate(-50%, -50%)" }}>
                <div
                  className={m.hit ? "" : (m.id % 2 === 0 ? "meteor-float-up" : "meteor-float-down")}
                  style={{
                    transform: m.hit ? "scale(0)" : undefined,
                    opacity: m.hit ? 0 : 1,
                    transition: m.hit ? "transform 0.3s ease-out, opacity 0.3s ease-out" : undefined,
                  }}>
                <div className="relative">
                  {aimed && (
                    <div className="absolute -inset-2 rounded-full border-2 border-yellow-300/80 animate-pulse pointer-events-none" style={{ boxShadow: "0 0 18px rgba(250,200,0,0.55)" }} />
                  )}
                  <img src={meteorImg} alt="meteor" className={`${isLandscape ? "w-14 h-14" : "w-16 h-16 md:w-20 md:h-20"} drop-shadow-[0_0_15px_rgba(255,60,30,0.6)]`} style={{ mixBlendMode: "screen", background: "transparent" }} />
                  <span className={`absolute inset-x-0 flex justify-center px-1 ${isDark ? "inset-0 items-center" : "-top-5 bottom-auto"}`}>
                    <span
                      className="font-display text-[8px] md:text-[9px] font-bold leading-tight text-center px-1 py-0.5 rounded"
                      style={isDark
                        ? { color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.8)" }
                        : { color: "#111", background: "rgba(255,255,255,0.93)", boxShadow: "0 1px 4px rgba(0,0,0,0.55)" }
                      }
                    >{m.label}</span>
                  </span>
                </div>
                {m.hit && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 rounded-full bg-accent/60 animate-ping" />
                  </div>
                )}
              </div>
              </div>
            );
          })}
        </div>

        {laser && laser.active && (
          <div className="absolute z-10 pointer-events-none" style={{
            left: `${laser.fromX}%`, bottom: isLandscape ? "12%" : "27%", transform: "translateX(-50%)",
            height: `${laser.progress * 80}%`, width: 12,
            background: "linear-gradient(to top, hsl(50, 100%, 60%), hsl(50, 100%, 85%), hsl(50, 100%, 90%, 0.4))",
            boxShadow: "0 0 20px hsl(50, 100%, 60%), 0 0 40px hsl(50, 100%, 55%), 0 0 60px hsl(50, 100%, 50%, 0.4)",
            borderRadius: 6, transformOrigin: "bottom center",
          }} />
        )}

        <div className={`absolute ${isLandscape ? "bottom-[2%]" : "bottom-[24%]"} z-20 transition-all duration-500 ease-out`} style={{ left: `${shipX}%`, transform: "translateX(-50%)" }}>
          <div className="relative flex flex-col items-center">
            <img src={spaceshipImg} alt="spaceship" className={`${isLandscape ? "w-14 h-16" : "w-14 h-16 md:w-20 md:h-24"} drop-shadow-[0_0_20px_rgba(0,200,255,0.5)]`} />
            <div className="absolute -bottom-1 w-4 h-6 md:w-5 md:h-7 animate-flame" style={{ left: "30%", transform: "translateX(-50%)" }}>
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

        {/* On-screen controls: left/right move on the left side, fire on the right side */}
        <div
          className="absolute left-0 bottom-0 z-40 flex items-end gap-2 p-3 md:p-4 select-none touch-none"
          style={{ paddingLeft: "max(0.75rem, env(safe-area-inset-left, 0px))" }}
        >
          <button
            type="button"
            aria-label="Geser pesawat ke kiri"
            disabled={locked}
            onPointerDown={(e) => { e.preventDefault(); (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId); startMove(-1); }}
            onPointerUp={stopMove}
            onPointerCancel={stopMove}
            onPointerLeave={stopMove}
            onContextMenu={(e) => e.preventDefault()}
            className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-black border-2 backdrop-blur-md transition-all duration-150 active:scale-90 ${
              locked
                ? "bg-slate-700/50 border-slate-500/40 opacity-40 cursor-not-allowed"
                : "bg-cyan-500/30 border-cyan-300/70 shadow-[0_0_20px_rgba(0,200,255,0.45)] hover:bg-cyan-500/50 cursor-pointer"
            }`}
            style={isDark
              ? { color: "#ffffff" }
              : { color: "#FFD700", textShadow: "0 0 8px rgba(255,215,0,0.7)" }
            }
          >
            ◀
          </button>
          <button
            type="button"
            aria-label="Geser pesawat ke kanan"
            disabled={locked}
            onPointerDown={(e) => { e.preventDefault(); (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId); startMove(1); }}
            onPointerUp={stopMove}
            onPointerCancel={stopMove}
            onPointerLeave={stopMove}
            onContextMenu={(e) => e.preventDefault()}
            className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-black border-2 backdrop-blur-md transition-all duration-150 active:scale-90 ${
              locked
                ? "bg-slate-700/50 border-slate-500/40 opacity-40 cursor-not-allowed"
                : "bg-cyan-500/30 border-cyan-300/70 shadow-[0_0_20px_rgba(0,200,255,0.45)] hover:bg-cyan-500/50 cursor-pointer"
            }`}
            style={isDark
              ? { color: "#ffffff" }
              : { color: "#FFD700", textShadow: "0 0 8px rgba(255,215,0,0.7)" }
            }
          >
            ▶
          </button>
        </div>

        <div
          className="absolute right-0 bottom-0 z-40 flex items-end p-3 md:p-4 select-none touch-none"
          style={{ paddingRight: "max(0.75rem, env(safe-area-inset-right, 0px))" }}
        >
          <button
            type="button"
            aria-label="Tembak"
            disabled={locked}
            onPointerDown={(e) => { e.preventDefault(); fireLaser(); }}
            onContextMenu={(e) => e.preventDefault()}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl font-black text-white border-2 backdrop-blur-md transition-all duration-150 active:scale-90 ${
              locked
                ? "bg-slate-700/50 border-slate-500/40 opacity-40 cursor-not-allowed"
                : "bg-gradient-to-br from-red-500/80 to-orange-500/80 border-yellow-300/80 shadow-[0_0_25px_rgba(255,140,0,0.6)] hover:from-red-500 hover:to-orange-500 cursor-pointer"
            }`}
          >
            🔥
          </button>
        </div>
      </div>

    </div>
  );
};

export default MeteorShootingGame;
