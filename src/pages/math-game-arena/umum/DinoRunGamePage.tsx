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
const P_W = 34;
const P_H_STAND = 48;
const P_H_DUCK = 28;
const GRAVITY = 1800;
const JUMP_VY = -560;

// ── Obstacle constants ──────────────────────────────────────────────────────
type ObstacleKind = "cactus" | "rock" | "bird";
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
  player: "#00FF88",
  playerDark: "#00cc66",
  cactus: "#2eb82e",
  rock: "#9999bb",
  bird: "#FF7B54",
  star: "#ffffff",
  cloud: "#ffffff",
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

  // game state (all in refs so the loop doesn't need closures to re-capture)
  const phaseRef = useRef<Phase>("idle");
  const pyRef = useRef(GROUND_Y - P_H_STAND);
  const pvyRef = useRef(0);
  const isDuckRef = useRef(false);
  const isOnGroundRef = useRef(true);
  const speedRef = useRef(220);
  const distRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const nextObstRef = useRef(1400);
  const questionIdxRef = useRef(-1);
  const stunTimerRef = useRef(0);
  const usedQRef = useRef<Set<number>>(new Set());
  const bgOffRef = useRef(0);
  const cloudXRef = useRef([80, 260, 440]);
  const cloudYRef = useRef([30, 55, 20]);
  const jumpPressedRef = useRef(false);
  const duckPressedRef = useRef(false);
  const highScoreRef = useRef(0);

  // react state (for UI overlays only)
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
    const kinds: ObstacleKind[] = ["cactus", "rock", "bird"];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    let w = 22, h = 44, y = GROUND_Y - 44;
    if (kind === "rock") { w = 30; h = 28; y = GROUND_Y - 28; }
    if (kind === "bird") { w = 36; h = 22; y = GROUND_Y - P_H_STAND - 10; }

    const avail = QUESTIONS.map((_, i) => i).filter(i => !usedQRef.current.has(i));
    const hasQ = Math.random() < 0.45 && avail.length > 0;
    let qIdx = -1;
    if (hasQ) {
      qIdx = avail[Math.floor(Math.random() * avail.length)];
      usedQRef.current.add(qIdx);
      if (usedQRef.current.size >= QUESTIONS.length) usedQRef.current = new Set();
    }

    obstaclesRef.current.push({ kind, x: CW + 20, y, w, h, hasQuestion: hasQ, questionIdx: qIdx });
    nextObstRef.current = 700 + Math.random() * 800 - Math.min(speedRef.current * 1.2, 400);
  }, []);

  // ── Reset / start ───────────────────────────────────────────────────────
  const resetGame = useCallback(() => {
    pyRef.current = GROUND_Y - P_H_STAND;
    pvyRef.current = 0;
    isDuckRef.current = false;
    isOnGroundRef.current = true;
    speedRef.current = 220;
    distRef.current = 0;
    scoreRef.current = 0;
    livesRef.current = 3;
    obstaclesRef.current = [];
    nextObstRef.current = 1400;
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

    // stars (dark mode)
    if (!isLight) {
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      for (let i = 0; i < 30; i++) {
        const sx = ((i * 137 + bgOffRef.current * 0.05) % CW + CW) % CW;
        const sy = (i * 53) % (CH - 50);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }
    }

    // clouds
    cloudXRef.current = cloudXRef.current.map((cx, i) => {
      const nx = ph === "running" ? cx - speedRef.current * 0.06 * dt : cx;
      const wrapped = nx < -80 ? CW + 60 : nx;
      return wrapped;
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

    // scrolling ground pattern
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
    const hitbox = { x: P_X + 4, y: playerY + 4, w: P_W - 8, h: playerH - 8 };

    obstaclesRef.current = obstaclesRef.current.filter(ob => ob.x + ob.w > -20);
    obstaclesRef.current.forEach(ob => {
      if (ph === "running") ob.x -= speedRef.current * dt;

      // draw obstacle
      drawObstacle(ctx, ob, isLight);

      // collision check (only while running, not stunned)
      if (ph === "running") {
        const ox = ob.x + 3, ow = ob.w - 6, oy = ob.y + 3, oh = ob.h - 6;
        const collide =
          hitbox.x < ox + ow &&
          hitbox.x + hitbox.w > ox &&
          hitbox.y < oy + oh &&
          hitbox.y + hitbox.h > oy;

        if (collide) {
          if (ob.hasQuestion && ob.questionIdx >= 0) {
            // trigger question
            ob.hasQuestion = false;
            questionIdxRef.current = ob.questionIdx;
            phaseRef.current = "question";
            setPhase("question");
            setActiveQ(QUESTIONS[ob.questionIdx]);
          } else {
            // direct hit
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
      // jump input
      if (jumpPressedRef.current && isOnGroundRef.current) {
        pvyRef.current = JUMP_VY;
        isOnGroundRef.current = false;
        jumpPressedRef.current = false;
      }
      // apply gravity
      pvyRef.current += GRAVITY * dt;
      pyRef.current += pvyRef.current * dt;
      const groundLevel = GROUND_Y - (isDuckRef.current ? P_H_DUCK : P_H_STAND);
      if (pyRef.current >= groundLevel) {
        pyRef.current = groundLevel;
        pvyRef.current = 0;
        isOnGroundRef.current = true;
      }
      // duck
      if (duckPressedRef.current && isOnGroundRef.current) {
        isDuckRef.current = true;
      } else if (!duckPressedRef.current) {
        isDuckRef.current = false;
        if (isOnGroundRef.current) pyRef.current = GROUND_Y - P_H_STAND;
      }

      // score & speed
      distRef.current += speedRef.current * dt;
      scoreRef.current = Math.floor(distRef.current / 10);
      speedRef.current = Math.min(220 + distRef.current * 0.04, 520);
      if (Math.floor(distRef.current) % 60 === 0) setScore(scoreRef.current);
    }

    if (ph === "stunned") {
      stunTimerRef.current -= dt;
      if (stunTimerRef.current <= 0) {
        phaseRef.current = "running";
        setPhase("running");
      }
    }

    // ── Draw player ─────────────────────────────────────────────────
    drawPlayer(ctx, pyRef.current, isDuckRef.current, ph, ts, isLight);

    // ── HUD ─────────────────────────────────────────────────────────
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.beginPath();
    ctx.roundRect(8, 8, 140, 36, 8);
    ctx.fill();
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 13px monospace";
    ctx.fillText(`SKOR: ${scoreRef.current}`, 18, 28);
    // lives
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i < livesRef.current ? "#FF4E4E" : "rgba(255,255,255,0.2)";
      ctx.font = "16px sans-serif";
      ctx.fillText("♥", CW - 28 - i * 22, 28);
    }

    // stun overlay flash
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
    return () => {
      if (feedbackRef.current) clearTimeout(feedbackRef.current);
    };
  }, []);

  // ── Touch: tap = jump, hold bottom = duck ───────────────────────────────
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
            🦕 LARI MATEMATIKA
          </h1>
        </div>

        {/* Score strip above canvas */}
        <div className="flex gap-6 mb-2 text-sm font-display">
          <span className="text-yellow-400">SKOR: <span className="font-bold">{score}</span></span>
          <span className="text-white/50">REKOR: <span className="text-accent font-bold">{highScore}</span></span>
          <span className="text-red-400">{"♥".repeat(lives)}{"🖤".repeat(Math.max(0, 3 - lives))}</span>
        </div>

        {/* Canvas wrapper */}
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

          {/* Feedback toast */}
          {feedback && (
            <div className={`absolute top-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl font-bold text-sm shadow-xl pointer-events-none z-30 animate-bounce ${
              feedback.good ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
            }`}>
              {feedback.txt}
            </div>
          )}

          {/* Idle overlay */}
          {phase === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/65 rounded-xl">
              <div className="text-center px-4">
                <div className="text-5xl mb-2">🦕</div>
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

          {/* Dead overlay */}
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

          {/* Question overlay */}
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

        {/* Mobile controls */}
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
    ctx.fillStyle = PALETTE.cactus;
    // trunk
    ctx.fillRect(ob.x + ob.w / 2 - 5, ob.y, 10, ob.h);
    // arms
    ctx.fillRect(ob.x + 2, ob.y + 10, ob.w / 2 - 3, 7);
    ctx.fillRect(ob.x + ob.w / 2 + 3, ob.y + 16, ob.w / 2 - 3, 7);
    ctx.fillRect(ob.x + 2, ob.y + 3, 7, 12);
    ctx.fillRect(ob.x + ob.w - 9, ob.y + 9, 7, 12);
  } else if (ob.kind === "rock") {
    ctx.fillStyle = light ? "#8888aa" : PALETTE.rock;
    ctx.beginPath();
    ctx.ellipse(ob.x + ob.w / 2, ob.y + ob.h / 2, ob.w / 2, ob.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath();
    ctx.ellipse(ob.x + ob.w / 2 - 4, ob.y + ob.h / 2 - 4, ob.w / 4, ob.h / 5, -0.4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // bird
    ctx.fillStyle = PALETTE.bird;
    ctx.beginPath();
    ctx.ellipse(ob.x + ob.w / 2, ob.y + ob.h / 2, ob.w / 2, ob.h / 3, 0, 0, Math.PI * 2);
    ctx.fill();
    // wings
    ctx.fillStyle = "#ff9966";
    const wingOff = Math.sin(Date.now() / 120) * 6;
    ctx.beginPath();
    ctx.moveTo(ob.x + ob.w / 2, ob.y + ob.h / 2);
    ctx.lineTo(ob.x + ob.w / 2 - 14, ob.y - wingOff);
    ctx.lineTo(ob.x + ob.w / 2 + 14, ob.y - wingOff);
    ctx.closePath();
    ctx.fill();
    // beak
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.moveTo(ob.x + ob.w - 2, ob.y + ob.h / 2 - 2);
    ctx.lineTo(ob.x + ob.w + 10, ob.y + ob.h / 2);
    ctx.lineTo(ob.x + ob.w - 2, ob.y + ob.h / 2 + 2);
    ctx.closePath();
    ctx.fill();
  }

  // question badge
  if (ob.hasQuestion) {
    ctx.fillStyle = PALETTE.question_badge;
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";
    ctx.fillText("⚡?", ob.x + ob.w / 2, ob.y - 4);
    ctx.textAlign = "left";
  }
}

// ── Helper: draw player ────────────────────────────────────────────────────
function drawPlayer(
  ctx: CanvasRenderingContext2D,
  py: number,
  duck: boolean,
  phase: Phase,
  ts: number,
  _light: boolean
) {
  const ph = P_W;
  const h = duck ? P_H_DUCK : P_H_STAND;
  const x = P_X;
  const y = py;

  const stunFlash = phase === "stunned" && Math.floor(ts / 120) % 2 === 0;
  if (stunFlash) { ctx.globalAlpha = 0.35; }

  // body
  ctx.fillStyle = "#00DD77";
  ctx.beginPath();
  ctx.roundRect(x, y, ph, h, 6);
  ctx.fill();

  // visor / helmet top
  ctx.fillStyle = "#00FFAA";
  ctx.beginPath();
  ctx.roundRect(x + 4, y + 2, ph - 8, duck ? 10 : 14, 4);
  ctx.fill();

  if (!duck) {
    // eyes
    ctx.fillStyle = "#0d0d1a";
    ctx.beginPath(); ctx.arc(x + ph / 2 - 6, y + 18, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + ph / 2 + 6, y + 18, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(x + ph / 2 - 7, y + 17, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + ph / 2 + 5, y + 17, 1.2, 0, Math.PI * 2); ctx.fill();

    // legs animation
    const legSwing = Math.sin(ts / 100) * 7;
    ctx.fillStyle = "#009955";
    ctx.fillRect(x + 4, y + h - 14, 10, 12 + legSwing);
    ctx.fillRect(x + ph - 14, y + h - 14, 10, 12 - legSwing);
  } else {
    // duck shape — legs splayed
    ctx.fillStyle = "#009955";
    ctx.fillRect(x + 2, y + h - 8, 10, 8);
    ctx.fillRect(x + ph - 12, y + h - 8, 10, 8);
  }

  ctx.globalAlpha = 1;
}

export default DinoRunGamePage;
