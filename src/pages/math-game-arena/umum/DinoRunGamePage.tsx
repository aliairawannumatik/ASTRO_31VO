import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";

// ── Canvas dimensions ──────────────────────────────────────────────────────
const CW = 560;
const CH = 220;
const GROUND_Y = CH - 40;

// ── Player constants ────────────────────────────────────────────────────────
const P_X = 70;
const P_W = 36;
const P_H_STAND = 52;
const P_H_DUCK = 28;
const GRAVITY = 1600;
const JUMP_VY = -540;

// ── Obstacle constants ──────────────────────────────────────────────────────
type ObstacleKind = "cactus" | "rock";
interface Obstacle {
  kind: ObstacleKind;
  x: number;
  y: number;
  w: number;
  h: number;
  hasQuestion: boolean;
  questionIdx: number;
}

// ── Math questions ──────────────────────────────────────────────────────────
interface MathQuestion {
  q: string;
  opts: string[];
  ans: number;
}

const QUESTIONS: MathQuestion[] = [
  { q: "7 × 8 = ?", opts: ["54", "56", "58", "64"], ans: 1 },
  { q: "√144 = ?", opts: ["10", "11", "12", "13"], ans: 2 },
  { q: "15² = ?", opts: ["205", "215", "225", "235"], ans: 2 },
  { q: "360 ÷ 12 = ?", opts: ["25", "28", "30", "32"], ans: 2 },
  { q: "2/5 + 3/10 = ?", opts: ["5/15", "7/10", "1/2", "9/10"], ans: 1 },
  { q: "(-6) × (-7) = ?", opts: ["-42", "-13", "13", "42"], ans: 3 },
  { q: "3x = 21, x = ?", opts: ["5", "6", "7", "8"], ans: 2 },
  { q: "40% dari 150 = ?", opts: ["50", "55", "60", "65"], ans: 2 },
  { q: "FPB(18, 24) = ?", opts: ["4", "6", "8", "12"], ans: 1 },
  { q: "KPK(4, 6) = ?", opts: ["8", "12", "16", "24"], ans: 1 },
  { q: "5³ = ?", opts: ["75", "100", "125", "150"], ans: 2 },
  { q: "Luas segitiga alas 10, tinggi 6 = ?", opts: ["30", "40", "50", "60"], ans: 0 },
  { q: "Keliling lingkaran r=7, π=22/7 = ?", opts: ["38", "40", "44", "48"], ans: 2 },
  { q: "0,6 × 0,4 = ?", opts: ["0,024", "0,24", "2,4", "24"], ans: 1 },
  { q: "2⁸ = ?", opts: ["128", "256", "512", "1024"], ans: 1 },
  { q: "Median: 3,5,7,9,11 = ?", opts: ["5", "6", "7", "8"], ans: 2 },
  { q: "sin 30° = ?", opts: ["0", "1/2", "√2/2", "1"], ans: 1 },
  { q: "Persentase 45 dari 180 = ?", opts: ["20%", "25%", "30%", "35%"], ans: 1 },
  { q: "a²−b²= ? (a=7, b=5)", opts: ["16", "24", "45", "74"], ans: 1 },
  { q: "Volume kubus sisi 5 = ?", opts: ["75", "100", "125", "150"], ans: 2 },
];

// ── Colour palette ──────────────────────────────────────────────────────────
const PALETTE = {
  sky_dark: "#0d0d1a",
  sky_light: "#c8dff7",
  ground_dark: "#1e1e3a",
  ground_light: "#a0855a",
  line_dark: "#2a2a55",
  line_light: "#8a6f47",
  cactus: "#2eb82e",
  rock: "#9999bb",
  question_badge: "#FFD700",
};

// ── State machine ────────────────────────────────────────────────────────────
type Phase = "idle" | "running" | "question" | "stunned" | "dead";

// ── Component ────────────────────────────────────────────────────────────────
const DinoRunGamePage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastTRef = useRef(0);

  const phaseRef = useRef<Phase>("idle");
  const pyRef = useRef(GROUND_Y - P_H_STAND);
  const pvyRef = useRef(0);
  const isDuckRef = useRef(false);
  const isOnGroundRef = useRef(true);
  const speedRef = useRef(190);
  const distRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const nextObstRef = useRef(1800);
  const questionIdxRef = useRef(-1);
  const stunTimerRef = useRef(0);
  const usedQRef = useRef<Set<number>>(new Set());
  const bgOffRef = useRef(0);
  const cloudXRef = useRef([80, 260, 440]);
  const cloudYRef = useRef([30, 55, 20]);
  const jumpPressedRef = useRef(false);
  const duckPressedRef = useRef(false);
  const highScoreRef = useRef(0);

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);
  const [activeQ, setActiveQ] = useState<MathQuestion | null>(null);
  const [feedback, setFeedback] = useState<{ txt: string; good: boolean } | null>(null);
  const feedbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFeedback = useCallback((txt: string, good: boolean) => {
    setFeedback({ txt, good });
    if (feedbackRef.current) clearTimeout(feedbackRef.current);
    feedbackRef.current = setTimeout(() => setFeedback(null), 1400);
  }, []);

  // ── Spawn obstacle ──────────────────────────────────────────────────────
  const spawnObstacle = useCallback(() => {
    // Only cactus and rock — both are ground obstacles, easy to jump over
    const kinds: ObstacleKind[] = ["cactus", "rock"];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];

    // Smaller sizes so they're easier to clear
    let w = 18, h = 36, y = GROUND_Y - 36;
    if (kind === "rock") { w = 24; h = 20; y = GROUND_Y - 20; }

    const avail = QUESTIONS.map((_, i) => i).filter(i => !usedQRef.current.has(i));
    const hasQ = Math.random() < 0.45 && avail.length > 0;
    let qIdx = -1;
    if (hasQ) {
      qIdx = avail[Math.floor(Math.random() * avail.length)];
      usedQRef.current.add(qIdx);
      if (usedQRef.current.size >= QUESTIONS.length) usedQRef.current = new Set();
    }

    obstaclesRef.current.push({ kind, x: CW + 20, y, w, h, hasQuestion: hasQ, questionIdx: qIdx });
    // Larger, safer gap between obstacles
    nextObstRef.current = 1600 + Math.random() * 900;
  }, []);

  // ── Reset / start ───────────────────────────────────────────────────────
  const resetGame = useCallback(() => {
    pyRef.current = GROUND_Y - P_H_STAND;
    pvyRef.current = 0;
    isDuckRef.current = false;
    isOnGroundRef.current = true;
    speedRef.current = 190;
    distRef.current = 0;
    scoreRef.current = 0;
    livesRef.current = 3;
    obstaclesRef.current = [];
    nextObstRef.current = 1800;
    questionIdxRef.current = -1;
    stunTimerRef.current = 0;
    usedQRef.current = new Set();
    bgOffRef.current = 0;
    jumpPressedRef.current = false;
    duckPressedRef.current = false;
    setScore(0);
    setLives(3);
    setActiveQ(null);
    setFeedback(null);
  }, []);

  // ── Main loop ───────────────────────────────────────────────────────────
  const loop = useCallback((ts: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dt = Math.min((ts - (lastTRef.current || ts)) / 1000, 0.05);
    lastTRef.current = ts;

    const ph = phaseRef.current;

    // ── Draw background ─────────────────────────────────────────────
    ctx.fillStyle = isLight ? PALETTE.sky_light : PALETTE.sky_dark;
    ctx.fillRect(0, 0, CW, CH);

    if (!isLight) {
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      for (let i = 0; i < 30; i++) {
        const sx = ((i * 137 + bgOffRef.current * 0.05) % CW + CW) % CW;
        const sy = (i * 53) % (CH - 50);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }
    }

    // clouds
    cloudXRef.current = cloudXRef.current.map((cx) => {
      const nx = ph === "running" ? cx - speedRef.current * 0.06 * dt : cx;
      return nx < -80 ? CW + 60 : nx;
    });
    ctx.fillStyle = isLight ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.12)";
    cloudXRef.current.forEach((cx, i) => {
      const cy = cloudYRef.current[i];
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.arc(cx + 22, cy - 6, 14, 0, Math.PI * 2);
      ctx.arc(cx + 40, cy, 16, 0, Math.PI * 2);
      ctx.fill();
    });

    // ground
    ctx.fillStyle = isLight ? PALETTE.ground_light : PALETTE.ground_dark;
    ctx.fillRect(0, GROUND_Y, CW, CH - GROUND_Y);
    ctx.fillStyle = isLight ? PALETTE.line_light : PALETTE.line_dark;
    ctx.fillRect(0, GROUND_Y, CW, 2);

    if (ph === "running" || ph === "stunned") bgOffRef.current += speedRef.current * dt;
    for (let i = 0; i < 20; i++) {
      const lx = ((i * 52 - bgOffRef.current) % CW + CW) % CW;
      ctx.fillStyle = isLight ? "rgba(100,80,40,0.25)" : "rgba(255,255,255,0.06)";
      ctx.fillRect(lx, GROUND_Y + 8, 28, 3);
    }

    // ── Update & draw obstacles ─────────────────────────────────────
    if (ph === "running") {
      nextObstRef.current -= speedRef.current * dt * 1000 * dt;
      if (nextObstRef.current <= 0) spawnObstacle();
    }

    const playerH = isDuckRef.current ? P_H_DUCK : P_H_STAND;
    const playerY = pyRef.current;
    // Generous hitbox padding so collisions feel fair
    const hitbox = { x: P_X + 10, y: playerY + 8, w: P_W - 18, h: playerH - 14 };

    obstaclesRef.current = obstaclesRef.current.filter(ob => ob.x + ob.w > -20);
    obstaclesRef.current.forEach(ob => {
      if (ph === "running") ob.x -= speedRef.current * dt;

      drawObstacle(ctx, ob, isLight);

      if (ph === "running") {
        // Generous obstacle hitbox padding too
        const ox = ob.x + 5, ow = ob.w - 10, oy = ob.y + 5, oh = ob.h - 8;
        const collide =
          hitbox.x < ox + ow &&
          hitbox.x + hitbox.w > ox &&
          hitbox.y < oy + oh &&
          hitbox.y + hitbox.h > oy;

        if (collide) {
          if (ob.hasQuestion && ob.questionIdx >= 0) {
            ob.hasQuestion = false;
            questionIdxRef.current = ob.questionIdx;
            phaseRef.current = "question";
            setPhase("question");
            setActiveQ(QUESTIONS[ob.questionIdx]);
          } else {
            livesRef.current = Math.max(0, livesRef.current - 1);
            setLives(livesRef.current);
            stunTimerRef.current = 1.2;
            phaseRef.current = "stunned";
            setPhase("stunned");
            showFeedback("💥 Kena! Hati-hati!", false);
            if (livesRef.current <= 0) {
              phaseRef.current = "dead";
              setPhase("dead");
              if (scoreRef.current > highScoreRef.current) {
                highScoreRef.current = scoreRef.current;
                setHighScore(highScoreRef.current);
              }
            }
          }
        }
      }
    });

    // ── Update player ───────────────────────────────────────────────
    if (ph === "running") {
      if (jumpPressedRef.current && isOnGroundRef.current) {
        pvyRef.current = JUMP_VY;
        isOnGroundRef.current = false;
        jumpPressedRef.current = false;
      }
      pvyRef.current += GRAVITY * dt;
      pyRef.current += pvyRef.current * dt;
      const groundLevel = GROUND_Y - (isDuckRef.current ? P_H_DUCK : P_H_STAND);
      if (pyRef.current >= groundLevel) {
        pyRef.current = groundLevel;
        pvyRef.current = 0;
        isOnGroundRef.current = true;
      }
      if (duckPressedRef.current && isOnGroundRef.current) {
        isDuckRef.current = true;
      } else if (!duckPressedRef.current) {
        isDuckRef.current = false;
        if (isOnGroundRef.current) pyRef.current = GROUND_Y - P_H_STAND;
      }

      distRef.current += speedRef.current * dt;
      scoreRef.current = Math.floor(distRef.current / 10);
      // Gentler speed ramp — slower increase, lower cap
      speedRef.current = Math.min(190 + distRef.current * 0.02, 360);
      if (Math.floor(distRef.current) % 60 === 0) setScore(scoreRef.current);
    }

    if (ph === "stunned") {
      stunTimerRef.current -= dt;
      if (stunTimerRef.current <= 0) {
        phaseRef.current = "running";
        setPhase("running");
      }
    }

    // ── Draw player (dino) ──────────────────────────────────────────
    drawDino(ctx, pyRef.current, isDuckRef.current, ph, ts);

    // ── HUD ─────────────────────────────────────────────────────────
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.beginPath();
    ctx.roundRect(8, 8, 140, 36, 8);
    ctx.fill();
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 13px monospace";
    ctx.fillText(`SKOR: ${scoreRef.current}`, 18, 28);
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i < livesRef.current ? "#FF4E4E" : "rgba(255,255,255,0.2)";
      ctx.font = "16px sans-serif";
      ctx.fillText("♥", CW - 28 - i * 22, 28);
    }

    if (ph === "stunned") {
      ctx.fillStyle = `rgba(255,60,60,${0.15 + 0.1 * Math.sin(ts / 80)})`;
      ctx.fillRect(0, 0, CW, CH);
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [isLight, spawnObstacle, showFeedback]);

  // ── Start game ──────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    playPopSound();
    resetGame();
    phaseRef.current = "running";
    setPhase("running");
    lastTRef.current = 0;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [resetGame, loop]);

  // ── Answer question ─────────────────────────────────────────────────────
  const handleAnswer = useCallback((idx: number) => {
    const q = QUESTIONS[questionIdxRef.current];
    if (!q) return;
    playPopSound();
    if (idx === q.ans) {
      scoreRef.current += 200;
      setScore(scoreRef.current);
      showFeedback("🌟 BENAR! +200 Skor!", true);
    } else {
      livesRef.current = Math.max(0, livesRef.current - 1);
      setLives(livesRef.current);
      showFeedback(`❌ Salah! Jawaban: ${q.opts[q.ans]}`, false);
      if (livesRef.current <= 0) {
        phaseRef.current = "dead";
        setPhase("dead");
        if (scoreRef.current > highScoreRef.current) {
          highScoreRef.current = scoreRef.current;
          setHighScore(highScoreRef.current);
        }
        setActiveQ(null);
        return;
      }
    }
    questionIdxRef.current = -1;
    phaseRef.current = "running";
    setPhase("running");
    setActiveQ(null);
  }, [showFeedback]);

  // ── Input handling ──────────────────────────────────────────────────────
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", " "].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowUp" || e.key === " ") jumpPressedRef.current = true;
      if (e.key === "ArrowDown") duckPressedRef.current = true;
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") duckPressedRef.current = false;
      if (e.key === "ArrowUp" || e.key === " ") jumpPressedRef.current = false;
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop]);

  useEffect(() => {
    return () => { if (feedbackRef.current) clearTimeout(feedbackRef.current); };
  }, []);

  const touchRef = useRef<{ y: number; id: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    touchRef.current = { y: t.clientY, id: t.identifier };
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relY = t.clientY - rect.top;
    if (relY > rect.height * 0.65) {
      duckPressedRef.current = true;
    } else {
      jumpPressedRef.current = true;
    }
  };
  const onTouchEnd = () => {
    duckPressedRef.current = false;
    jumpPressedRef.current = false;
    touchRef.current = null;
  };

  return (
    <div className={`relative min-h-screen flex flex-col items-center justify-start overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`}>
      {isLight ? <Snowfall /> : <Starfield />}

      <div className="relative z-10 w-full max-w-2xl px-2 py-4 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-3 w-full">
          <button
            onClick={() => { playPopSound(); navigate("/math-game-arena/umum"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-body cursor-pointer"
          >
            ← Kembali
          </button>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan text-center flex-1">
            🦖 LARI MATEMATIKA
          </h1>
        </div>

        <div className="flex gap-6 mb-2 text-sm font-display">
          <span className="text-yellow-400">SKOR: <span className="font-bold">{score}</span></span>
          <span className="text-white/50">REKOR: <span className="text-accent font-bold">{highScore}</span></span>
          <span className="text-red-400">{"♥".repeat(lives)}{"🖤".repeat(Math.max(0, 3 - lives))}</span>
        </div>

        <div className="relative w-full" style={{ maxWidth: CW }}>
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            className="rounded-xl border border-border shadow-2xl w-full"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onClick={() => {
              if (phaseRef.current === "running") jumpPressedRef.current = true;
            }}
            style={{ cursor: "pointer" }}
          />

          {feedback && (
            <div className={`absolute top-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl font-bold text-sm shadow-xl pointer-events-none z-30 animate-bounce ${
              feedback.good ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
            }`}>
              {feedback.txt}
            </div>
          )}

          {phase === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/65 rounded-xl">
              <div className="text-center px-4">
                <div className="text-5xl mb-2">🦖</div>
                <h2 className="font-display text-2xl font-bold text-accent mb-2">LARI MATEMATIKA</h2>
                <p className="text-white/65 text-xs mb-4 leading-relaxed">
                  <span className="text-cyan-300 font-bold">SPASI / ↑</span> Loncat &nbsp;·&nbsp; <span className="text-cyan-300 font-bold">↓</span> Tiarap<br />
                  Jawab soal untuk bonus skor!<br />
                  Kena rintangan = nyawa berkurang 💥
                </p>
                <button onClick={startGame} className="bg-accent text-black font-bold px-8 py-3 rounded-xl hover:opacity-90 transition text-lg cursor-pointer shadow-lg">
                  ▶ MULAI
                </button>
              </div>
            </div>
          )}

          {phase === "dead" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
              <div className="text-center px-4">
                <div className="text-4xl mb-2">💀</div>
                <h2 className="font-display text-xl font-bold text-red-400 mb-1">GAME OVER</h2>
                <p className="text-white text-sm mb-1">Skor: <span className="text-yellow-400 font-bold text-xl">{score}</span></p>
                <p className="text-white/50 text-xs mb-4">Rekor: {highScore}</p>
                <button onClick={startGame} className="bg-accent text-black font-bold px-7 py-3 rounded-xl hover:opacity-90 transition cursor-pointer shadow-lg">
                  Main Lagi
                </button>
              </div>
            </div>
          )}

          {phase === "question" && activeQ && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/75 rounded-xl">
              <div className="bg-card/95 backdrop-blur border-2 border-yellow-400 rounded-2xl p-4 mx-3 shadow-2xl w-full max-w-xs">
                <div className="text-xs text-yellow-400 font-display mb-1 text-center tracking-wider">⚡ SOAL MATEMATIKA</div>
                <p className="text-white font-bold text-center text-base mb-3 leading-snug">{activeQ.q}</p>
                <div className="grid grid-cols-2 gap-2">
                  {activeQ.opts.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className="bg-primary/20 hover:bg-accent/30 border border-border hover:border-accent text-white font-bold py-3 px-2 rounded-xl text-sm transition-all duration-150 cursor-pointer active:scale-95"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-3">
          <button
            onPointerDown={() => { jumpPressedRef.current = true; }}
            onPointerUp={() => { jumpPressedRef.current = false; }}
            className="bg-card/80 border border-border text-white font-bold px-7 py-4 rounded-xl text-xl hover:border-accent transition cursor-pointer select-none active:scale-95"
          >
            ↑ LONCAT
          </button>
          <button
            onPointerDown={() => { duckPressedRef.current = true; }}
            onPointerUp={() => { duckPressedRef.current = false; }}
            className="bg-card/80 border border-border text-white font-bold px-7 py-4 rounded-xl text-xl hover:border-accent transition cursor-pointer select-none active:scale-95"
          >
            ↓ TIARAP
          </button>
        </div>

        <div className="mt-2 text-center text-white/40 text-xs font-body">
          Keyboard: SPASI / ↑ loncat &nbsp;·&nbsp; ↓ tiarap &nbsp;·&nbsp; Rintangan bertanda ⚡ = ada soal!
        </div>
      </div>
    </div>
  );
};

// ── Helper: draw obstacle ──────────────────────────────────────────────────
function drawObstacle(ctx: CanvasRenderingContext2D, ob: Obstacle, light: boolean) {
  if (ob.kind === "cactus") {
    // Cactus body (trunk)
    ctx.fillStyle = "#2eb82e";
    ctx.beginPath();
    ctx.roundRect(ob.x + ob.w / 2 - 4, ob.y, 8, ob.h, 3);
    ctx.fill();
    // Left arm
    ctx.beginPath();
    ctx.roundRect(ob.x + 1, ob.y + ob.h * 0.3, ob.w / 2 - 2, 6, 2);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(ob.x + 1, ob.y + 4, 6, ob.h * 0.32, 2);
    ctx.fill();
    // Right arm
    ctx.beginPath();
    ctx.roundRect(ob.x + ob.w / 2 + 2, ob.y + ob.h * 0.42, ob.w / 2 - 2, 6, 2);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(ob.x + ob.w - 7, ob.y + ob.h * 0.15, 6, ob.h * 0.32, 2);
    ctx.fill();
    // Spines
    ctx.fillStyle = "#1a8c1a";
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(ob.x + ob.w / 2 - 1, ob.y + i * 12, 2, 5);
    }
  } else {
    // Rock — rounded with shading
    const cx = ob.x + ob.w / 2;
    const cy = ob.y + ob.h / 2;
    const grad = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, ob.w / 2);
    grad.addColorStop(0, light ? "#b0b0cc" : "#c0c0dd");
    grad.addColorStop(1, light ? "#6a6a88" : "#7a7a99");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, ob.w / 2, ob.h / 2, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // Highlight
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.ellipse(cx - 4, cy - 5, ob.w / 5, ob.h / 5, -0.4, 0, Math.PI * 2);
    ctx.fill();
    // Cracks
    ctx.strokeStyle = "rgba(0,0,0,0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 2, cy - 4); ctx.lineTo(cx + 4, cy + 2);
    ctx.moveTo(cx - 5, cy + 1); ctx.lineTo(cx, cy + 5);
    ctx.stroke();
  }

  // Question badge
  if (ob.hasQuestion) {
    ctx.fillStyle = PALETTE.question_badge;
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";
    ctx.fillText("⚡?", ob.x + ob.w / 2, ob.y - 4);
    ctx.textAlign = "left";
  }
}

// ── Helper: draw T-Rex dino ────────────────────────────────────────────────
function drawDino(
  ctx: CanvasRenderingContext2D,
  py: number,
  duck: boolean,
  phase: Phase,
  ts: number
) {
  const x = P_X;
  const y = py;
  const h = duck ? P_H_DUCK : P_H_STAND;

  const stunFlash = phase === "stunned" && Math.floor(ts / 120) % 2 === 0;
  if (stunFlash) ctx.globalAlpha = 0.35;

  // Colors
  const bodyCol = "#4a9e3f";
  const darkCol = "#2d6b24";
  const bellyCol = "#a8d8a0";
  const eyeWhite = "#ffffff";

  if (duck) {
    // ── Ducking T-Rex ──
    // Low flat body
    ctx.fillStyle = bodyCol;
    ctx.beginPath();
    ctx.ellipse(x + P_W / 2, y + h / 2 + 2, P_W / 2 + 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail (left)
    ctx.fillStyle = darkCol;
    ctx.beginPath();
    ctx.moveTo(x + 4, y + h / 2 + 2);
    ctx.quadraticCurveTo(x - 8, y + h / 2 - 4, x - 2, y + h - 4);
    ctx.lineTo(x + 8, y + h / 2 + 4);
    ctx.closePath();
    ctx.fill();

    // Head (right)
    ctx.fillStyle = bodyCol;
    ctx.beginPath();
    ctx.roundRect(x + P_W - 2, y + 2, 18, 14, [5, 5, 3, 3]);
    ctx.fill();
    // Lower jaw
    ctx.fillStyle = bellyCol;
    ctx.beginPath();
    ctx.roundRect(x + P_W, y + 11, 16, 7, [0, 0, 4, 4]);
    ctx.fill();
    // Eye
    ctx.fillStyle = eyeWhite;
    ctx.beginPath(); ctx.arc(x + P_W + 9, y + 7, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath(); ctx.arc(x + P_W + 10, y + 8, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = eyeWhite;
    ctx.beginPath(); ctx.arc(x + P_W + 9, y + 7, 1, 0, Math.PI * 2); ctx.fill();
    // Nostril
    ctx.fillStyle = darkCol;
    ctx.beginPath(); ctx.arc(x + P_W + 15, y + 6, 1.2, 0, Math.PI * 2); ctx.fill();

    // Legs (splayed)
    const ls = Math.sin(ts / 90) * 5;
    ctx.fillStyle = darkCol;
    ctx.beginPath(); ctx.roundRect(x + 6, y + h - 6, 11, 7 + ls, 2); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x + 20, y + h - 6, 11, 7 - ls, 2); ctx.fill();
    // Feet
    ctx.fillStyle = "#1e4a1a";
    ctx.beginPath(); ctx.roundRect(x + 3, y + h, 16, 4, 2); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x + 18, y + h, 16, 4, 2); ctx.fill();
  } else {
    // ── Standing T-Rex ──

    // === TAIL ===
    ctx.fillStyle = darkCol;
    ctx.beginPath();
    ctx.moveTo(x + 6, y + h - 18);
    ctx.quadraticCurveTo(x - 12, y + h - 26, x - 5, y + h - 8);
    ctx.lineTo(x + 12, y + h - 14);
    ctx.closePath();
    ctx.fill();

    // === BODY ===
    ctx.fillStyle = bodyCol;
    ctx.beginPath();
    ctx.ellipse(x + P_W / 2, y + h * 0.57, P_W / 2 + 3, h * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();

    // === BELLY ===
    ctx.fillStyle = bellyCol;
    ctx.beginPath();
    ctx.ellipse(x + P_W / 2 + 4, y + h * 0.59, P_W * 0.26, h * 0.2, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // === HEAD ===
    // Upper jaw / head top
    ctx.fillStyle = bodyCol;
    ctx.beginPath();
    ctx.roundRect(x + P_W / 2 - 2, y + 1, P_W / 2 + 10, 20, [7, 7, 2, 2]);
    ctx.fill();
    // Lower jaw
    ctx.fillStyle = bellyCol;
    ctx.beginPath();
    ctx.roundRect(x + P_W / 2 + 1, y + 17, P_W / 2 + 7, 11, [2, 2, 6, 6]);
    ctx.fill();
    // Teeth
    ctx.fillStyle = "#ffffff";
    for (let t = 0; t < 3; t++) {
      ctx.beginPath();
      ctx.moveTo(x + P_W / 2 + 6 + t * 5, y + 17);
      ctx.lineTo(x + P_W / 2 + 4 + t * 5, y + 21);
      ctx.lineTo(x + P_W / 2 + 8 + t * 5, y + 21);
      ctx.closePath();
      ctx.fill();
    }
    // Nostril
    ctx.fillStyle = darkCol;
    ctx.beginPath(); ctx.arc(x + P_W + 5, y + 7, 1.8, 0, Math.PI * 2); ctx.fill();

    // === EYE ===
    ctx.fillStyle = eyeWhite;
    ctx.beginPath(); ctx.arc(x + P_W / 2 + 8, y + 9, 5.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath(); ctx.arc(x + P_W / 2 + 9, y + 10, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = eyeWhite;
    ctx.beginPath(); ctx.arc(x + P_W / 2 + 8, y + 9, 1.2, 0, Math.PI * 2); ctx.fill();
    // Brow
    ctx.strokeStyle = darkCol;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + P_W / 2 + 3, y + 5);
    ctx.lineTo(x + P_W / 2 + 13, y + 4);
    ctx.stroke();

    // === TINY ARMS ===
    ctx.fillStyle = darkCol;
    ctx.beginPath(); ctx.roundRect(x + P_W / 2 + 6, y + h * 0.42, 10, 6, 2); ctx.fill();
    // Claws
    for (let c = 0; c < 2; c++) {
      ctx.beginPath();
      ctx.moveTo(x + P_W / 2 + 14 + c * 3, y + h * 0.42 + 6);
      ctx.lineTo(x + P_W / 2 + 13 + c * 3, y + h * 0.42 + 11);
      ctx.lineTo(x + P_W / 2 + 16 + c * 3, y + h * 0.42 + 9);
      ctx.closePath();
      ctx.fillStyle = "#1e4a1a";
      ctx.fill();
    }

    // === LEGS ===
    const ls = Math.sin(ts / 95) * 10;
    ctx.fillStyle = darkCol;
    // Back leg
    ctx.beginPath(); ctx.roundRect(x + 4, y + h - 20, 13, 17 + ls, [4, 4, 2, 2]); ctx.fill();
    // Front leg
    ctx.beginPath(); ctx.roundRect(x + P_W / 2 - 1, y + h - 20, 13, 17 - ls, [4, 4, 2, 2]); ctx.fill();

    // Feet / claws
    ctx.fillStyle = "#1e4a1a";
    ctx.beginPath(); ctx.roundRect(x + 1, y + h - 4, 18, 5, [0, 0, 3, 3]); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x + P_W / 2 - 4, y + h - 4, 18, 5, [0, 0, 3, 3]); ctx.fill();
    // Toe claws
    ctx.strokeStyle = "#0e2e0c";
    ctx.lineWidth = 1;
    for (let c = 0; c < 3; c++) {
      ctx.beginPath();
      ctx.moveTo(x + 2 + c * 5, y + h + 1);
      ctx.lineTo(x + 1 + c * 5, y + h + 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + P_W / 2 - 3 + c * 5, y + h + 1);
      ctx.lineTo(x + P_W / 2 - 4 + c * 5, y + h + 5);
      ctx.stroke();
    }

    // === BACK SPINES ===
    ctx.fillStyle = "#1e5c18";
    const spineXs = [x + P_W / 2 - 4, x + P_W / 2, x + P_W / 2 + 4];
    const spineHs = [7, 9, 6];
    spineXs.forEach((sx, i) => {
      ctx.beginPath();
      ctx.moveTo(sx - 3, y + h * 0.38);
      ctx.lineTo(sx, y + h * 0.38 - spineHs[i]);
      ctx.lineTo(sx + 3, y + h * 0.38);
      ctx.closePath();
      ctx.fill();
    });
  }

  ctx.globalAlpha = 1;
}

export default DinoRunGamePage;
