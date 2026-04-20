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

// ── Bonus question interval (seconds) ───────────────────────────────────────
const QUESTION_INTERVAL = 40;

// ── Obstacle constants ──────────────────────────────────────────────────────
type ObstacleKind = "cactus" | "rock" | "bird" | "lowbar";
interface Obstacle {
  kind: ObstacleKind;
  x: number;
  y: number;
  w: number;
  h: number;
}

// ── Math questions ───────────────────────────────────────────────────────────
interface MQ {
  q: string;
  opts: string[];
  correctIndex: number;
  bonus: number;
}

const QUESTIONS: MQ[] = [
  { q: "12 × 8 = ?",            opts: ["86","96","106","76"],    correctIndex: 1, bonus: 30 },
  { q: "144 ÷ 12 = ?",          opts: ["10","11","12","13"],     correctIndex: 2, bonus: 30 },
  { q: "√169 = ?",              opts: ["11","12","13","14"],     correctIndex: 2, bonus: 40 },
  { q: "7² + 1 = ?",            opts: ["48","50","52","54"],     correctIndex: 1, bonus: 35 },
  { q: "25% dari 200 = ?",      opts: ["40","50","60","70"],     correctIndex: 1, bonus: 30 },
  { q: "3³ = ?",                opts: ["9","18","27","36"],      correctIndex: 2, bonus: 35 },
  { q: "56 + 79 = ?",           opts: ["125","130","135","145"], correctIndex: 2, bonus: 25 },
  { q: "180 − 97 = ?",          opts: ["73","83","93","63"],     correctIndex: 1, bonus: 25 },
  { q: "15 × 15 = ?",           opts: ["205","215","225","235"], correctIndex: 2, bonus: 35 },
  { q: "FPB dari 24 dan 36 = ?",opts: ["6","8","12","18"],       correctIndex: 2, bonus: 40 },
  { q: "KPK dari 4 dan 6 = ?",  opts: ["8","12","16","24"],      correctIndex: 1, bonus: 35 },
  { q: "2x + 6 = 20, x = ?",   opts: ["5","6","7","8"],         correctIndex: 2, bonus: 40 },
  { q: "(-8) × (-5) = ?",       opts: ["-40","-13","13","40"],   correctIndex: 3, bonus: 35 },
  { q: "2/3 + 1/6 = ?",         opts: ["3/9","5/6","1/2","7/6"],correctIndex: 1, bonus: 40 },
  { q: "√64 = ?",               opts: ["6","7","8","9"],         correctIndex: 2, bonus: 30 },
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
type Phase = "idle" | "running" | "stunned" | "question" | "dead";

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
  const nextObstRef = useRef(3500);
  const stunTimerRef = useRef(0);
  const bgOffRef = useRef(0);
  const cloudXRef = useRef([80, 260, 440]);
  const cloudYRef = useRef([30, 55, 20]);
  const jumpPressedRef = useRef(false);
  const duckPressedRef = useRef(false);
  const highScoreRef = useRef(0);
  const timeRef = useRef(0);
  const distScoreRef = useRef(0);

  // ── Question state ───────────────────────────────────────────────────────
  const questionTimerRef = useRef(0);
  const usedQRef = useRef<Set<number>>(new Set());
  const activeQRef = useRef<MQ | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);
  const [feedback, setFeedback] = useState<{ txt: string; good: boolean } | null>(null);
  const [activeQ, setActiveQ] = useState<MQ | null>(null);
  const feedbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFeedback = useCallback((txt: string, good: boolean) => {
    setFeedback({ txt, good });
    if (feedbackRef.current) clearTimeout(feedbackRef.current);
    feedbackRef.current = setTimeout(() => setFeedback(null), 2200);
  }, []);

  // ── Pick random question ─────────────────────────────────────────────────
  const pickQuestion = useCallback((): MQ => {
    let avail = QUESTIONS.map((_, i) => i).filter(i => !usedQRef.current.has(i));
    if (avail.length === 0) { usedQRef.current = new Set(); avail = QUESTIONS.map((_, i) => i); }
    const idx = avail[Math.floor(Math.random() * avail.length)];
    usedQRef.current.add(idx);
    return QUESTIONS[idx];
  }, []);

  // ── Difficulty tier — based on internal distance score (every 1000) ──────
  const getDiffTier = () => Math.min(Math.floor(distScoreRef.current / 1000), 4);

  // ── Spawn obstacle ──────────────────────────────────────────────────────
  const spawnObstacle = useCallback(() => {
    const tier = getDiffTier();

    const birdCut   = [0.25, 0.35, 0.40, 0.45, 0.50][tier];
    const cactusCut = [0.60, 0.60, 0.60, 0.60, 0.60][tier];
    const rockCut   = [0.85, 0.75, 0.70, 0.70, 0.70][tier];
    const roll = Math.random();
    const kind: ObstacleKind =
      roll < birdCut ? "bird" :
      roll < cactusCut ? "cactus" :
      roll < rockCut ? "rock" : "lowbar";

    let w = 18, h = 36, y = GROUND_Y - 36;
    if (kind === "rock") { w = 24; h = 20; y = GROUND_Y - 20; }
    if (kind === "bird") { w = 38; h = 20; y = GROUND_Y - P_H_STAND + 6; }
    if (kind === "lowbar") { w = 26; h = 150; y = 0; }

    obstaclesRef.current.push({ kind, x: CW + 20, y, w, h });
    const gapMin  = [3200, 1600, 1200,  900,  700][tier];
    const gapRng  = [2300, 1400, 1200,  900,  600][tier];
    nextObstRef.current = gapMin + Math.random() * gapRng;
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
    distScoreRef.current = 0;
    timeRef.current = 0;
    livesRef.current = 3;
    obstaclesRef.current = [];
    nextObstRef.current = 3500;
    stunTimerRef.current = 0;
    bgOffRef.current = 0;
    jumpPressedRef.current = false;
    duckPressedRef.current = false;
    questionTimerRef.current = 0;
    usedQRef.current = new Set();
    activeQRef.current = null;
    setScore(0);
    setTime(0);
    setLives(3);
    setFeedback(null);
    setActiveQ(null);
  }, []);

  // ── Handle answer ────────────────────────────────────────────────────────
  const handleAnswer = useCallback((idx: number) => {
    const q = activeQRef.current;
    if (!q) return;
    playPopSound();
    if (idx === q.correctIndex) {
      scoreRef.current += q.bonus;
      setScore(scoreRef.current);
      showFeedback(`🌟 BENAR! +${q.bonus} skor bonus!`, true);
    } else {
      showFeedback(`❌ Salah! Jawaban: ${q.opts[q.correctIndex]}`, false);
    }
    activeQRef.current = null;
    setActiveQ(null);
    questionTimerRef.current = 0;
    phaseRef.current = "running";
    setPhase("running");
  }, [showFeedback]);

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

    // clouds — only move when running
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
    // Obstacles ONLY move and collide during "running" — they FREEZE during "question"
    if (ph === "running") {
      nextObstRef.current -= dt * 1000;
      if (nextObstRef.current <= 0) spawnObstacle();
    }

    const playerH = isDuckRef.current ? P_H_DUCK : P_H_STAND;
    const playerY = pyRef.current;
    const hitbox = { x: P_X + 10, y: playerY + 8, w: P_W - 18, h: playerH - 14 };

    obstaclesRef.current = obstaclesRef.current.filter(ob => ob.x + ob.w > -20);
    obstaclesRef.current.forEach(ob => {
      if (ph === "running") ob.x -= speedRef.current * dt;

      drawObstacle(ctx, ob, isLight);

      if (ph === "running") {
        const ox = ob.x + 5, ow = ob.w - 10, oy = ob.y + 5, oh = ob.h - 8;
        const collide =
          hitbox.x < ox + ow &&
          hitbox.x + hitbox.w > ox &&
          hitbox.y < oy + oh &&
          hitbox.y + hitbox.h > oy;

        if (collide) {
          livesRef.current = Math.max(0, livesRef.current - 1);
          setLives(livesRef.current);
          stunTimerRef.current = 1.2;
          phaseRef.current = "stunned";
          setPhase("stunned");
          showFeedback("💥 Kena! Hati-hati!", false);
          if (livesRef.current <= 0) {
            phaseRef.current = "dead";
            setPhase("dead");
          }
        }
      }
    });

    // ── Update player ───────────────────────────────────────────────
    // Player physics also FREEZE during "question"
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
      timeRef.current += dt;
      distScoreRef.current = Math.floor(distRef.current / 10);

      // Speed ramp
      {
        const spTier = getDiffTier();
        const ramp = [0.020, 0.035, 0.050, 0.065, 0.080][spTier];
        const cap  = [360,   430,   490,   540,   590  ][spTier];
        speedRef.current = Math.min(190 + distRef.current * ramp, cap);
      }

      if (Math.floor(timeRef.current * 2) % 2 === 0) setTime(Math.floor(timeRef.current));

      // ── Bonus question timer ─────────────────────────────────────
      questionTimerRef.current += dt;
      if (questionTimerRef.current >= QUESTION_INTERVAL) {
        const q = pickQuestion();
        activeQRef.current = q;
        setActiveQ(q);
        phaseRef.current = "question";
        setPhase("question");
      }
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
    const mm = String(Math.floor(timeRef.current / 60)).padStart(2, "0");
    const ss = String(Math.floor(timeRef.current % 60)).padStart(2, "0");
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.beginPath();
    ctx.roundRect(8, 8, 150, 36, 8);
    ctx.fill();
    ctx.fillStyle = "#00FFCC";
    ctx.font = "bold 13px monospace";
    ctx.fillText(`WAKTU: ${mm}:${ss}`, 18, 28);
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i < livesRef.current ? "#FF4E4E" : "rgba(255,255,255,0.2)";
      ctx.font = "16px sans-serif";
      ctx.fillText("♥", CW - 28 - i * 22, 28);
    }

    // ── Next question countdown badge ────────────────────────────────
    if (ph === "running" || ph === "stunned") {
      const remaining = Math.max(0, Math.ceil(QUESTION_INTERVAL - questionTimerRef.current));
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.beginPath();
      ctx.roundRect(CW / 2 - 52, 8, 104, 26, 7);
      ctx.fill();
      ctx.fillStyle = remaining <= 10 ? "#FFD700" : "#aaaaff";
      ctx.font = `bold 11px monospace`;
      ctx.textAlign = "center";
      ctx.fillText(`❓ SOAL dalam ${remaining}s`, CW / 2, 25);
      ctx.textAlign = "left";
    }

    if (ph === "stunned") {
      ctx.fillStyle = `rgba(255,60,60,${0.15 + 0.1 * Math.sin(ts / 80)})`;
      ctx.fillRect(0, 0, CW, CH);
    }

    // ── Difficulty tier badge ────────────────────────────────────────
    const badgeTier = getDiffTier();
    if (badgeTier >= 1 && (ph === "running" || ph === "stunned")) {
      const badgeLabels = ["", "🔥 HARD MODE!", "⚡ VERY HARD!", "💀 EXTREME!", "☠️ INSANE!"];
      const badgeColors = ["", "#FF4500",      "#9400D3",      "#CC0000",    "#000000"  ];
      const badgeBorder = ["", "",              "",              "",           "#FF0000"  ];
      const pulse = 0.75 + 0.25 * Math.sin(ts / 220);
      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.fillStyle = badgeColors[badgeTier];
      ctx.beginPath();
      ctx.roundRect(CW / 2 - 58, 38, 116, 24, 6);
      ctx.fill();
      if (badgeBorder[badgeTier]) {
        ctx.strokeStyle = badgeBorder[badgeTier];
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.globalAlpha = pulse;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText(badgeLabels[badgeTier], CW / 2, 54);
      ctx.textAlign = "left";
      ctx.restore();
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [isLight, spawnObstacle, showFeedback, pickQuestion]);

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
            onClick={() => { playPopSound(); navigate(-1); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-body cursor-pointer"
          >
            ← Kembali
          </button>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan text-center flex-1">
            🐢 Turtle Run Math
          </h1>
        </div>

        <div className="flex gap-5 mb-2 text-sm font-display flex-wrap justify-center">
          <span className="text-cyan-400">⏱ WAKTU: <span className="font-bold">{String(Math.floor(time / 60)).padStart(2,"0")}:{String(time % 60).padStart(2,"0")}</span></span>
          <span className="text-yellow-400">⭐ SKOR: <span className="font-bold">{score}</span></span>
          <span className="text-white/50">🏆 REKOR: <span className="text-accent font-bold">{highScore}</span></span>
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
                <div className="text-5xl mb-2">🐢</div>
                <h2 className="font-display text-2xl font-bold text-accent mb-2">TURTLE RUN MATH</h2>
                <p className="text-white/65 text-xs mb-4 leading-relaxed">
                  <span className="text-cyan-300 font-bold">SPASI / ↑</span> Loncat &nbsp;·&nbsp; <span className="text-cyan-300 font-bold">↓</span> Tiarap<br />
                  Hindari semua rintangan — kena = kehilangan nyawa 💥<br />
                  3 nyawa habis = permainan berakhir! &nbsp;·&nbsp; <span className="text-yellow-300 font-bold">Soal bonus tiap 40 detik!</span>
                </p>
                <button onClick={startGame} className="bg-accent text-black font-bold px-8 py-3 rounded-xl hover:opacity-90 transition text-lg cursor-pointer shadow-lg">
                  ▶ MULAI
                </button>
              </div>
            </div>
          )}

          {/* ── Bonus question popup — game is PAUSED while this is open ── */}
          {phase === "question" && activeQ && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/75 rounded-xl z-20">
              <div className="bg-card/95 backdrop-blur border-2 border-yellow-400 rounded-2xl p-5 mx-3 shadow-2xl w-full max-w-xs">
                <div className="text-[10px] text-white/40 font-display text-center mb-1 tracking-widest">
                  ⏸ GAME PAUSED
                </div>
                <div className="text-xs text-yellow-400 font-display mb-2 text-center tracking-widest">
                  ⭐ SOAL BONUS ⭐
                </div>
                <p className="text-white font-bold text-center text-base mb-4 leading-snug">
                  {activeQ.q}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {activeQ.opts.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className="bg-primary/20 hover:bg-yellow-400/20 border border-border hover:border-yellow-400 text-white font-bold py-3 px-2 rounded-xl text-sm transition-all cursor-pointer active:scale-95"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <p className="text-white/40 text-xs text-center mt-3">
                  Benar = +{activeQ.bonus} skor bonus 🌟
                </p>
              </div>
            </div>
          )}

          {phase === "dead" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
              <div className="text-center px-4">
                <div className="text-4xl mb-2">💀</div>
                <h2 className="font-display text-xl font-bold text-red-400 mb-1">GAME OVER</h2>
                <p className="text-cyan-300 text-xs mb-1">⏱ Waktu: <span className="font-bold">{String(Math.floor(time / 60)).padStart(2,"0")}:{String(time % 60).padStart(2,"0")}</span></p>
                <p className="text-white text-sm mb-1">⭐ Skor: <span className="text-yellow-400 font-bold text-xl">{score}</span></p>
                <p className="text-white/50 text-xs mb-4">🏆 Rekor: {highScore}</p>
                <button onClick={startGame} className="bg-accent text-black font-bold px-7 py-3 rounded-xl hover:opacity-90 transition cursor-pointer shadow-lg">
                  Main Lagi
                </button>
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
          Keyboard: SPASI / ↑ loncat &nbsp;·&nbsp; ↓ tiarap &nbsp;·&nbsp; Soal bonus otomatis tiap 40 detik ❓
        </div>
      </div>
    </div>
  );
};

// ── Helper: draw obstacle ──────────────────────────────────────────────────
function drawObstacle(ctx: CanvasRenderingContext2D, ob: Obstacle, light: boolean) {
  if (ob.kind === "cactus") {
    ctx.fillStyle = "#2eb82e";
    ctx.beginPath();
    ctx.roundRect(ob.x + ob.w / 2 - 4, ob.y, 8, ob.h, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(ob.x + 1, ob.y + ob.h * 0.3, ob.w / 2 - 2, 6, 2);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(ob.x + 1, ob.y + 4, 6, ob.h * 0.32, 2);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(ob.x + ob.w / 2 + 2, ob.y + ob.h * 0.42, ob.w / 2 - 2, 6, 2);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(ob.x + ob.w - 7, ob.y + ob.h * 0.15, 6, ob.h * 0.32, 2);
    ctx.fill();
    ctx.fillStyle = "#1a8c1a";
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(ob.x + ob.w / 2 - 1, ob.y + i * 12, 2, 5);
    }
  } else if (ob.kind === "rock") {
    const cx = ob.x + ob.w / 2;
    const cy = ob.y + ob.h / 2;
    const grad = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, ob.w / 2);
    grad.addColorStop(0, light ? "#b0b0cc" : "#c0c0dd");
    grad.addColorStop(1, light ? "#6a6a88" : "#7a7a99");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, ob.w / 2, ob.h / 2, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.ellipse(cx - 4, cy - 5, ob.w / 5, ob.h / 5, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 2, cy - 4); ctx.lineTo(cx + 4, cy + 2);
    ctx.moveTo(cx - 5, cy + 1); ctx.lineTo(cx, cy + 5);
    ctx.stroke();
  } else if (ob.kind === "bird") {
    const cx = ob.x + ob.w / 2;
    const cy = ob.y + ob.h / 2;
    const wingFlap = Math.sin(Date.now() / 110) * 8;

    ctx.fillStyle = "#E8622A";
    ctx.beginPath();
    ctx.ellipse(cx, cy, ob.w / 2 - 4, ob.h / 2 - 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#F0862A";
    ctx.beginPath();
    ctx.moveTo(cx - ob.w / 2 + 2, cy - 4);
    ctx.quadraticCurveTo(cx - ob.w / 2 - 8, cy - 10 - wingFlap, cx - ob.w / 2 - 4, cy - 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#F0862A";
    ctx.beginPath();
    ctx.moveTo(cx + ob.w / 2 - 2, cy - 4);
    ctx.quadraticCurveTo(cx + ob.w / 2 + 8, cy - 10 + wingFlap, cx + ob.w / 2 + 4, cy - 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.moveTo(cx + ob.w / 2 - 2, cy);
    ctx.lineTo(cx + ob.w / 2 + 6, cy - 2);
    ctx.lineTo(cx + ob.w / 2 + 6, cy + 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(cx + ob.w / 2 - 6, cy - 3, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(cx + ob.w / 2 - 5, cy - 4, 1, 0, Math.PI * 2);
    ctx.fill();
  } else if (ob.kind === "lowbar") {
    const grad = ctx.createLinearGradient(ob.x, 0, ob.x + ob.w, 0);
    grad.addColorStop(0, "#8B0000");
    grad.addColorStop(0.5, "#CC2200");
    grad.addColorStop(1, "#8B0000");
    ctx.fillStyle = grad;
    ctx.fillRect(ob.x, ob.y, ob.w, ob.h);

    ctx.strokeStyle = "#FF4444";
    ctx.lineWidth = 1;
    for (let ry = 0; ry < ob.h; ry += 16) {
      ctx.beginPath();
      ctx.moveTo(ob.x, ob.y + ry);
      ctx.lineTo(ob.x + ob.w, ob.y + ry);
      ctx.stroke();
    }

    ctx.fillStyle = "#FF6600";
    ctx.fillRect(ob.x - 4, ob.y, ob.w + 8, 6);

    const spikeCount = 3;
    const spikeW = ob.w / spikeCount;
    ctx.fillStyle = "#FF2200";
    for (let s = 0; s < spikeCount; s++) {
      const sx = ob.x + s * spikeW;
      ctx.beginPath();
      ctx.moveTo(sx, ob.y + ob.h);
      ctx.lineTo(sx + spikeW / 2, ob.y + ob.h + 14);
      ctx.lineTo(sx + spikeW, ob.y + ob.h);
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = "rgba(255,50,0,0.12)";
    ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
  }
}

// ── Helper: draw dino (turtle) ────────────────────────────────────────────
function drawDino(ctx: CanvasRenderingContext2D, py: number, isDuck: boolean, phase: Phase, ts: number) {
  const x = P_X;
  const h = isDuck ? P_H_DUCK : P_H_STAND;
  const w = P_W;
  const y = py;

  const isStunned = phase === "stunned";
  const flash = isStunned && Math.floor(ts / 120) % 2 === 0;
  if (flash) return;

  ctx.save();

  const legAnim = Math.sin(ts / 120) * 5;

  if (!isDuck) {
    ctx.fillStyle = "#1a6b1a";
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h * 0.45, w * 0.32, h * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#228B22";
    ctx.beginPath();
    ctx.roundRect(x + 4, y + 6, w - 8, h * 0.55, 8);
    ctx.fill();

    ctx.fillStyle = "#2eb82e";
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h * 0.28, h * 0.22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(x + w / 2 + 5, y + h * 0.22, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x + w / 2 + 6, y + h * 0.21, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1a6b1a";
    ctx.beginPath();
    ctx.moveTo(x + w - 2, y + h * 0.28);
    ctx.lineTo(x + w + 10, y + h * 0.22);
    ctx.lineTo(x + w + 8, y + h * 0.32);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#228B22";
    ctx.fillRect(x + 5, y + h * 0.75, 7, 14 + legAnim);
    ctx.fillRect(x + w - 12, y + h * 0.75, 7, 14 - legAnim);
  } else {
    ctx.fillStyle = "#1a6b1a";
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h * 0.5, w * 0.45, h * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2eb82e";
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h * 0.45, w * 0.35, h * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(x + w - 4, y + h * 0.35, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a6b1a";
    ctx.beginPath();
    ctx.moveTo(x + w - 2, y + h * 0.32);
    ctx.lineTo(x + w + 9, y + h * 0.27);
    ctx.lineTo(x + w + 7, y + h * 0.37);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

export default DinoRunGamePage;
