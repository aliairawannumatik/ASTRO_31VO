import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz, type GuruQuestion } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";
import { spaceBg } from "@/assets/placeholder";

// ── Grid ──────────────────────────────────────────────────────────────────
const COLS = 24;
const ROWS = 16;
const CELL = 36;
const GW = COLS * CELL; // 864
const GH = ROWS * CELL; // 576
const CW = GW;
const CH = GH;

// ── Fruits ────────────────────────────────────────────────────────────────
const FRUITS = ["🍎", "🍓", "🍒", "🍇", "🍊", "🍉", "🍑", "🥝", "🍌", "🍍", "🍐", "🥭"];
const pickFruit = () => FRUITS[Math.floor(Math.random() * FRUITS.length)];

// ── Directions ────────────────────────────────────────────────────────────
type Dir = "U" | "D" | "L" | "R";
const OPP: Record<Dir, Dir> = { U: "D", D: "U", L: "R", R: "L" };
const DVEC: Record<Dir, [number, number]> = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };

// ── Food ──────────────────────────────────────────────────────────────────
interface Food { x: number; y: number; pulse: number; fruit: string }

// ── Particle ─────────────────────────────────────────────────────────────
interface Particle { x: number; y: number; vx: number; vy: number; alpha: number; color: string; r: number }

type Phase = "idle" | "playing" | "dead";

const INIT_LENGTH = 5;
const INIT_INTERVAL = 180;
const MIN_INTERVAL = 68;
const GROW_PER_FOOD = 2;
const FOOD_COUNT = 4;
const QUIZ_INTERVAL_MS = 25_000;

interface SnakeMathPageProps {
  topicLabel?: string;
  backPath?: string;
  homePath?: string;
  quizQuestions?: GuruQuestion[];
  quizIntervalMs?: number;
}

const SnakeMathPage = ({
  topicLabel,
  backPath,
  homePath = "/ruang-untuk-guru/numatik-game",
  quizQuestions,
  quizIntervalMs = QUIZ_INTERVAL_MS,
}: SnakeMathPageProps = {}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  // game state (refs for loop)
  const phaseRef = useRef<Phase>("idle");
  const guruQuiz = useGuruQuiz(phaseRef, "playing", quizIntervalMs, quizQuestions);
  const snakeRef = useRef<Array<{ x: number; y: number }>>([]);
  const dirRef = useRef<Dir>("R");
  const nextDirRef = useRef<Dir>("R");
  const foodsRef = useRef<Food[]>([]);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const intervalRef = useRef(INIT_INTERVAL);
  const lastStepRef = useRef(0);
  const growPendRef = useRef(0);
  const correctFlashRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const bgStarsRef = useRef<Array<{ x: number; y: number; r: number; t: number; s: number }>>([]);
  const trailRef = useRef<Array<{ x: number; y: number; alpha: number }>>([]);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const sessionStartRef = useRef(0);
  const pausedAccumRef = useRef(0);
  const pauseStartRef = useRef(0);

  // react state
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [snakeLen, setSnakeLen] = useState(INIT_LENGTH);
  const [feedback, setFeedback] = useState<{ txt: string; good: boolean } | null>(null);
  const fbTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFeedback = (txt: string, good: boolean) => {
    setFeedback({ txt, good });
    if (fbTimerRef.current) clearTimeout(fbTimerRef.current);
    fbTimerRef.current = setTimeout(() => setFeedback(null), 1300);
  };

  // ── Helpers ───────────────────────────────────────────────────────────
  const occupied = (x: number, y: number, exclude?: Food) => {
    if (snakeRef.current.some(s => s.x === x && s.y === y)) return true;
    if (foodsRef.current.filter(f => f !== exclude).some(f => f.x === x && f.y === y)) return true;
    return false;
  };

  const randomCell = (exclude?: Food): { x: number; y: number } => {
    let x: number, y: number;
    let tries = 0;
    do {
      x = Math.floor(Math.random() * COLS);
      y = Math.floor(Math.random() * ROWS);
      tries++;
    } while (occupied(x, y, exclude) && tries < 200);
    return { x, y };
  };

  const placeFoods = useCallback(() => {
    foodsRef.current = Array.from({ length: FOOD_COUNT }, () => {
      const pos = randomCell();
      return { ...pos, pulse: Math.random() * Math.PI * 2, fruit: pickFruit() };
    });
  }, []);

  const replaceEatenFood = useCallback((eaten: Food) => {
    const pos = randomCell();
    foodsRef.current = foodsRef.current.map(f =>
      f === eaten ? { ...pos, pulse: Math.random() * Math.PI * 2, fruit: pickFruit() } : f
    );
  }, []);

  const spawnParticles = (x: number, y: number, color: string, n = 12) => {
    const px = x * CELL + CELL / 2;
    const py = y * CELL + CELL / 2;
    for (let i = 0; i < n; i++) {
      const ang = (Math.PI * 2 * i) / n + Math.random();
      const spd = 40 + Math.random() * 120;
      particlesRef.current.push({ x: px, y: py, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, alpha: 1, color, r: 2 + Math.random() * 3 });
    }
  };

  // ── Init ─────────────────────────────────────────────────────────────
  const initSnake = useCallback(() => {
    const mid = Math.floor(ROWS / 2);
    const body = [];
    for (let i = INIT_LENGTH - 1; i >= 0; i--) body.push({ x: i, y: mid });
    snakeRef.current = body;
    dirRef.current = "R";
    nextDirRef.current = "R";
  }, []);

  const resetGame = useCallback(() => {
    snakeRef.current = [];
    foodsRef.current = [];
    particlesRef.current = [];
    trailRef.current = [];
    scoreRef.current = 0;
    intervalRef.current = INIT_INTERVAL;
    lastStepRef.current = 0;
    growPendRef.current = 0;
    correctFlashRef.current = 0;
    sessionStartRef.current = 0;
    pausedAccumRef.current = 0;
    pauseStartRef.current = 0;
    setScore(0);
    setFeedback(null);
    bgStarsRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * CW, y: Math.random() * CH, r: 0.5 + Math.random() * 1.2,
      t: Math.random() * Math.PI * 2, s: 0.8 + Math.random() * 1.5,
    }));
    initSnake();
    placeFoods();
    setSnakeLen(INIT_LENGTH);
  }, [initSnake, placeFoods]);

  // ── Step ─────────────────────────────────────────────────────────────
  const step = useCallback(() => {
    if (phaseRef.current !== "playing") return;
    const dir = nextDirRef.current;
    dirRef.current = dir;
    const [dx, dy] = DVEC[dir];
    const head = snakeRef.current[0];
    const nx = head.x + dx;
    const ny = head.y + dy;

    // wall
    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) {
      phaseRef.current = "dead";
      setPhase("dead");
      if (scoreRef.current > bestRef.current) { bestRef.current = scoreRef.current; setBest(bestRef.current); }
      return;
    }
    // self
    if (snakeRef.current.slice(0, -1).some(s => s.x === nx && s.y === ny)) {
      phaseRef.current = "dead";
      setPhase("dead");
      if (scoreRef.current > bestRef.current) { bestRef.current = scoreRef.current; setBest(bestRef.current); }
      return;
    }

    // add head
    snakeRef.current = [{ x: nx, y: ny }, ...snakeRef.current];

    // check food
    const eaten = foodsRef.current.find(f => f.x === nx && f.y === ny);
    if (eaten) {
      const bonus = 10;
      scoreRef.current += bonus;
      setScore(scoreRef.current);
      growPendRef.current += GROW_PER_FOOD;
      correctFlashRef.current = 0.45;
      intervalRef.current = Math.max(MIN_INTERVAL, intervalRef.current - 3);
      spawnParticles(nx, ny, "#FFE066", 12);
      spawnParticles(nx, ny, "#FF8844", 8);
      showFeedback(`+${bonus} 🍎 NYAM!`, true);
      replaceEatenFood(eaten);
    } else {
      // normal move: remove tail unless grow pending
      if (growPendRef.current > 0) {
        growPendRef.current--;
      } else {
        snakeRef.current = snakeRef.current.slice(0, -1);
      }
    }

    setSnakeLen(snakeRef.current.length);
    // trail head
    trailRef.current.push({ x: nx, y: ny, alpha: 0.8 });
    if (trailRef.current.length > 12) trailRef.current.shift();
  }, [replaceEatenFood]);

  // ── Draw ─────────────────────────────────────────────────────────────
  const draw = useCallback((ts: number, dt: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // soft dark navy/indigo background — neutral so snake pops
    const bgGrad = ctx.createLinearGradient(0, 0, 0, CH);
    bgGrad.addColorStop(0, "#0d1424");
    bgGrad.addColorStop(0.5, "#121a30");
    bgGrad.addColorStop(1, "#0a1020");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CW, CH);

    // soft floating dust (reused bg stars) in warm white
    bgStarsRef.current.forEach(s => {
      s.t += dt * s.s;
      const a = 0.18 + 0.55 * Math.abs(Math.sin(s.t));
      ctx.globalAlpha = a;
      ctx.fillStyle = "#ffe9b8";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // checker tile pattern (very subtle for depth)
    ctx.fillStyle = "rgba(255,255,255,0.022)";
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if ((r + c) % 2 === 0) ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
      }
    }

    // golden border glow — strong contrast against dark bg
    ctx.shadowColor = "#FFC53D";
    ctx.shadowBlur = 16;
    ctx.strokeStyle = "rgba(255,197,61,0.65)";
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, GW - 3, GH - 3);
    ctx.shadowBlur = 0;

    // ── Foods (fruits with sparkle halo — all foods grow the snake) ─────────
    foodsRef.current.forEach(f => {
      f.pulse += dt * 3;
      const px = f.x * CELL + CELL / 2;
      const py = f.y * CELL + CELL / 2;
      const pulse = 0.94 + 0.08 * Math.sin(f.pulse);

      // shadow under fruit
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.ellipse(px, py + CELL * 0.38, CELL * 0.28, CELL * 0.07, 0, 0, Math.PI * 2);
      ctx.fill();

      // gentle warm halo so foods read as edible targets
      const haloR = CELL * (0.62 + 0.08 * Math.sin(f.pulse));
      const halo = ctx.createRadialGradient(px, py, 0, px, py, haloR);
      halo.addColorStop(0, "rgba(255,215,0,0.30)");
      halo.addColorStop(0.6, "rgba(255,215,0,0.10)");
      halo.addColorStop(1, "rgba(255,215,0,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(px, py, haloR, 0, Math.PI * 2);
      ctx.fill();

      // fruit emoji
      ctx.save();
      ctx.translate(px, py);
      ctx.scale(pulse, pulse);
      ctx.font = `${Math.floor(CELL * 0.85)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(f.fruit, 0, 1);
      ctx.restore();
    });

    // ── Snake trail (subtle motion blur) ──────────────────────────────
    trailRef.current.forEach(t => {
      t.alpha -= dt * 4;
      if (t.alpha <= 0) return;
      ctx.globalAlpha = t.alpha * 0.25;
      ctx.fillStyle = "#FB923C";
      ctx.beginPath();
      ctx.arc(t.x * CELL + CELL / 2, t.y * CELL + CELL / 2, CELL * 0.32, 0, Math.PI * 2);
      ctx.fill();
    });
    trailRef.current = trailRef.current.filter(t => t.alpha > 0);
    ctx.globalAlpha = 1;

    // ── Snake body (realistic, continuous) ────────────────────────────
    const snake = snakeRef.current;
    if (snake.length > 0) {
      const centers = snake.map(s => ({ x: s.x * CELL + CELL / 2, y: s.y * CELL + CELL / 2 }));

      const drawPath = () => {
        ctx.beginPath();
        centers.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      };

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // 1) Outer dark outline (gives body silhouette + warm glow)
      ctx.shadowColor = "rgba(255,140,40,0.55)";
      ctx.shadowBlur = 16;
      ctx.strokeStyle = "#5a1c08";
      ctx.lineWidth = CELL * 0.96;
      drawPath(); ctx.stroke();
      ctx.shadowBlur = 0;

      // 2) Main body fill (rich amber/orange)
      ctx.strokeStyle = "#EA580C";
      ctx.lineWidth = CELL * 0.84;
      drawPath(); ctx.stroke();

      // 3) Top highlight band (lighter cream-amber along the body)
      ctx.strokeStyle = "rgba(255,220,150,0.55)";
      ctx.lineWidth = CELL * 0.38;
      drawPath(); ctx.stroke();

      // 4) Dorsal dark stripe down the middle
      ctx.strokeStyle = "rgba(80,30,10,0.6)";
      ctx.lineWidth = CELL * 0.16;
      drawPath(); ctx.stroke();

      // 5) Tail taper — overdraw last 3 segments with progressively thinner background-color stroke to fake a taper at the tail
      if (snake.length > 3) {
        const tailEnd = centers[centers.length - 1];
        const tailPrev = centers[centers.length - 2];
        // small rounded highlight on tail tip
        ctx.fillStyle = "#7c2d12";
        ctx.beginPath();
        ctx.arc(tailEnd.x, tailEnd.y, CELL * 0.22, 0, Math.PI * 2);
        ctx.fill();
        // re-draw a smaller body stroke from tail-1 to tail to make tail taper
        ctx.strokeStyle = "#EA580C";
        ctx.lineWidth = CELL * 0.55;
        ctx.beginPath();
        ctx.moveTo(tailPrev.x, tailPrev.y);
        ctx.lineTo(tailEnd.x, tailEnd.y);
        ctx.stroke();
      }

      // 6) Per-segment scale dots oriented perpendicular to body direction
      for (let i = 1; i < snake.length - 1; i++) {
        const c = centers[i];
        const prev = centers[i - 1];
        const next = centers[i + 1];
        const dx = next.x - prev.x;
        const dy = next.y - prev.y;
        const angle = Math.atan2(dy, dx);

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(angle);

        // three lighter scale dots in a row perpendicular to body
        ctx.fillStyle = "rgba(225,255,225,0.55)";
        [-1, 0, 1].forEach(s => {
          ctx.beginPath();
          ctx.arc(0, s * CELL * 0.18, CELL * 0.055, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();
      }

      // 3) Head — bigger, oval, oriented in direction of travel, with detailed eyes/tongue
      const head = snake[0];
      const hx = head.x * CELL + CELL / 2;
      const hy = head.y * CELL + CELL / 2;
      const [edx, edy] = DVEC[dirRef.current];
      const headR = CELL * 0.58;
      const angle = Math.atan2(edy, edx);

      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(angle);

      // forked tongue (animated, drawn first so head covers base)
      const tongueOut = (Math.sin(ts / 180) + 1) * 0.5; // 0..1
      if (tongueOut > 0.25) {
        const tLen = headR * (0.8 + tongueOut * 0.8);
        const tBaseX = headR * 0.95;
        ctx.strokeStyle = "#FF2255";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.shadowColor = "rgba(255,40,90,0.6)";
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.moveTo(tBaseX, 0);
        ctx.lineTo(tBaseX + tLen * 0.55, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(tBaseX + tLen * 0.55, 0);
        ctx.lineTo(tBaseX + tLen, -tLen * 0.25);
        ctx.moveTo(tBaseX + tLen * 0.55, 0);
        ctx.lineTo(tBaseX + tLen, tLen * 0.25);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // head outline (dark ring for definition)
      ctx.fillStyle = "#5a1c08";
      ctx.beginPath();
      ctx.ellipse(headR * 0.15, 0, headR * 1.15, headR * 1.0, 0, 0, Math.PI * 2);
      ctx.fill();

      // head shape — vivid amber/orange elongated ellipse with strong gradient
      ctx.shadowColor = "rgba(255,140,40,0.8)";
      ctx.shadowBlur = 22;
      const hgrad = ctx.createRadialGradient(-headR * 0.25, -headR * 0.4, 0, 0, 0, headR * 1.2);
      hgrad.addColorStop(0, "#FFE4B5");
      hgrad.addColorStop(0.4, "#FFB347");
      hgrad.addColorStop(0.8, "#EA580C");
      hgrad.addColorStop(1, "#9A3412");
      ctx.fillStyle = hgrad;
      ctx.beginPath();
      ctx.ellipse(headR * 0.12, 0, headR * 1.05, headR * 0.92, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // dorsal stripe on head
      ctx.strokeStyle = "rgba(80,30,10,0.6)";
      ctx.lineWidth = headR * 0.18;
      ctx.beginPath();
      ctx.moveTo(-headR * 0.7, 0);
      ctx.lineTo(headR * 0.85, 0);
      ctx.stroke();

      // nostrils
      ctx.fillStyle = "rgba(40,15,5,0.75)";
      [-1, 1].forEach(s => {
        ctx.beginPath();
        ctx.ellipse(headR * 0.92, s * headR * 0.18, headR * 0.05, headR * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // eyes
      const eyeOffX = headR * 0.42;
      const eyeOffY = headR * 0.46;
      [-1, 1].forEach(s => {
        // eye socket shadow
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.beginPath();
        ctx.arc(eyeOffX, s * eyeOffY, headR * 0.3, 0, Math.PI * 2);
        ctx.fill();
        // sclera
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(eyeOffX, s * eyeOffY, headR * 0.24, 0, Math.PI * 2);
        ctx.fill();
        // iris (yellow-green)
        ctx.fillStyle = "#FFD500";
        ctx.beginPath();
        ctx.arc(eyeOffX + headR * 0.04, s * eyeOffY, headR * 0.17, 0, Math.PI * 2);
        ctx.fill();
        // vertical slit pupil
        ctx.fillStyle = "#0a0a0a";
        ctx.beginPath();
        ctx.ellipse(eyeOffX + headR * 0.06, s * eyeOffY, headR * 0.045, headR * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
        // shine highlight
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.beginPath();
        ctx.arc(eyeOffX + headR * 0.1, s * eyeOffY - headR * 0.08, headR * 0.06, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeOffX - headR * 0.02, s * eyeOffY + headR * 0.08, headR * 0.03, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    }

    // ── Particles (sparkle on eat) ────────────────────────────────────
    particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);
    particlesRef.current.forEach(p => {
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 150 * dt; p.alpha -= dt * 2.5;
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // ── Flash overlays ────────────────────────────────────────────────
    if (correctFlashRef.current > 0) {
      correctFlashRef.current -= dt * 2.5;
      ctx.fillStyle = `rgba(0,255,136,${Math.max(0, correctFlashRef.current) * 0.12})`;
      ctx.fillRect(0, 0, CW, CH);
    }
  }, []);

  // ── Main RAF ─────────────────────────────────────────────────────────
  const lastRafRef = useRef(0);
  const loop = useCallback((ts: number) => {
    const dt = Math.min((ts - (lastRafRef.current || ts)) / 1000, 0.05);
    lastRafRef.current = ts;
    if (guruQuiz.isPausedRef.current) {
      // Track pause start so we can keep step timing & quiz countdown stable
      if (pauseStartRef.current === 0) pauseStartRef.current = ts;
      draw(ts, dt);
      rafRef.current = requestAnimationFrame(loop);
      return;
    }
    if (pauseStartRef.current !== 0) {
      const pausedFor = ts - pauseStartRef.current;
      pausedAccumRef.current += pausedFor;
      lastStepRef.current += pausedFor;
      pauseStartRef.current = 0;
    }

    if (phaseRef.current === "playing") {
      const elapsed = ts - lastStepRef.current;
      if (elapsed >= intervalRef.current) {
        step();
        lastStepRef.current = ts;
      }

    }

    draw(ts, dt);
    rafRef.current = requestAnimationFrame(loop);
  }, [step, draw, guruQuiz.isPausedRef]);

  const startGame = useCallback(() => {
    playPopSound();
    resetGame();
    phaseRef.current = "playing";
    setPhase("playing");
    const now = performance.now();
    lastStepRef.current = now;
    sessionStartRef.current = now;
    pausedAccumRef.current = 0;
    pauseStartRef.current = 0;
    lastRafRef.current = 0;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [resetGame, loop]);

  // keys
  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = { ArrowUp: "U", ArrowDown: "D", ArrowLeft: "L", ArrowRight: "R", w: "U", s: "D", a: "L", d: "R", W: "U", S: "D", A: "L", D: "R" };
      const d = map[e.key];
      if (d && d !== OPP[dirRef.current]) { e.preventDefault(); nextDirRef.current = d; }
    };
    window.addEventListener("keydown", dn);
    return () => window.removeEventListener("keydown", dn);
  }, []);

  // touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartRef.current;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    let d: Dir;
    if (Math.abs(dx) > Math.abs(dy)) d = dx > 0 ? "R" : "L";
    else d = dy > 0 ? "D" : "U";
    if (d !== OPP[dirRef.current]) nextDirRef.current = d;
    touchStartRef.current = null;
  };

  useEffect(() => {
    resetGame();
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop, resetGame]);

  useEffect(() => () => { if (fbTimerRef.current) clearTimeout(fbTimerRef.current); }, []);

  if (phase === "idle") {
    return (
      <div className="fixed inset-0 z-40 overflow-hidden">
        <style>{`
          @keyframes sm-floatA { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
          @keyframes sm-floatB { 0%,100%{transform:translateY(-5px)} 50%{transform:translateY(7px)} }
          @keyframes sm-wiggle { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} }
          @keyframes sm-shimmer{ 0%{background-position:200% center} 100%{background-position:-200% center} }
          @keyframes sm-scanY  { 0%{transform:translateY(-120%)} 100%{transform:translateY(220%)} }
          @keyframes sm-breathe{ 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
          .sm-fa{animation:sm-floatA 3.2s ease-in-out infinite}
          .sm-fb{animation:sm-floatB 3.8s ease-in-out infinite}
          .sm-wiggle{animation:sm-wiggle 1.2s ease-in-out infinite}
          .sm-title-shine{background:linear-gradient(90deg,#86efac,#4ade80,#a3e635,#86efac,#4ade80,#86efac);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:sm-shimmer 3.5s linear infinite}
          .sm-btn-breathe{animation:sm-breathe 2.8s ease-in-out infinite}
          .sm-scroll{height:100%;overflow-y:auto;scrollbar-width:none;display:flex;flex-direction:column}
          .sm-wrap{flex:1;display:flex;flex-direction:column;justify-content:space-evenly;padding:0.5rem 1rem;width:100%}
          .sm-main{display:flex;flex-direction:column;gap:0.75rem}
          .sm-visual{display:flex;flex-direction:column;gap:0.5rem}
          .sm-action{display:flex;flex-direction:column;gap:0.5rem}
          @media(orientation:landscape){
            .sm-wrap{justify-content:space-evenly;padding:0.35rem 1.75rem;max-width:860px;margin:0 auto;width:100%}
            .sm-main{flex-direction:row;align-items:stretch;gap:2rem}
            .sm-visual{flex:1;justify-content:center;gap:0.6rem}
            .sm-action{flex:1;justify-content:center;gap:0.6rem}
          }
        `}</style>

        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 15%, rgba(5,40,15,1) 0%, rgba(2,8,4,1) 60%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 10% 55%, rgba(74,222,128,0.12) 0%, transparent 55%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 90% 30%, rgba(163,230,53,0.10) 0%, transparent 55%)" }} />
        <div className="absolute inset-x-0 h-[1px] pointer-events-none" style={{ background: "linear-gradient(to right,transparent,rgba(74,222,128,0.25),transparent)", animation: "sm-scanY 6s linear infinite" }} />

        <div className="sm-scroll relative z-10">
          <div className="sm-wrap">

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-between w-full mb-1">
                <button onClick={() => { playPopSound(); if (backPath) navigate(backPath); else navigate(-1); }}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white font-display font-bold text-xs shadow-[0_0_15px_rgba(74,222,128,0.5)] hover:opacity-90 transition-opacity cursor-pointer">
                  <span className="text-base leading-none">←</span>
                  <span>Kembali</span>
                </button>
                <div className="text-[7px] tracking-[5px] text-emerald-400/60 uppercase font-bold">⬡ MATH GAME ARENA ⬡</div>
                <button onClick={() => { playPopSound(); navigate(homePath); }}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white font-display font-bold text-xs shadow-[0_0_15px_rgba(74,222,128,0.5)] hover:opacity-90 transition-opacity cursor-pointer">
                  <span className="text-base leading-none">🏠</span>
                  <span>Home</span>
                </button>
              </div>
              <div className="sm-title-shine font-display font-black leading-none" style={{ fontSize: "clamp(1.5rem,4.5vw,2.2rem)" }}>SNAKE MATEMATIKA</div>
              <div className="mx-auto mt-0.5 h-0.5 w-32 rounded-full" style={{ background: "linear-gradient(to right,transparent,#4ade80,#a3e635,transparent)" }} />
              <p className="text-emerald-400/70 text-[9px] font-bold tracking-wider uppercase mt-1">🐍 Makan · Panjangkan · Bertahan</p>
              {topicLabel && <p className="text-white/35 text-[8px] tracking-widest uppercase mt-0.5">🕹️ {topicLabel} 🕹️</p>}
              {bestRef.current > 0 && (
                <div className="mt-1 py-1 px-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
                  <p className="text-emerald-300 text-[8px] font-bold">🏆 Rekor: <span className="text-yellow-300">{bestRef.current}</span></p>
                </div>
              )}
            </div>

            <div className="sm-main">
              <div className="sm-visual">
                <div className="flex items-end justify-center gap-5 w-full">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="text-[7px] text-emerald-400/70 font-bold tracking-wider uppercase">ULARMU</div>
                    <div className="relative">
                      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle,rgba(74,222,128,0.25) 0%,transparent 70%)", transform: "scale(2.2)", borderRadius: "50%" }} />
                      <div className="sm-wiggle relative z-10 text-5xl" style={{ filter: "drop-shadow(0 0 14px #4ade80) drop-shadow(0 0 28px #16a34a)" }}>🐍</div>
                    </div>
                    <div className="w-1.5 h-4 rounded-full" style={{ background: "linear-gradient(to bottom,rgba(74,222,128,0.8),transparent)" }} />
                    <div className="text-[8px] font-bold text-emerald-400">KAMU</div>
                  </div>
                  <div className="flex flex-col items-center pb-4">
                    <div className="text-base font-black text-white/20">MAKAN</div>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="text-[7px] text-white/40 font-bold tracking-wider uppercase mb-0.5">BUAH-BUAHAN</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {([
                        { emoji: "🍎", glow: "#ff6b6b", delay: "0s"   },
                        { emoji: "🍇", glow: "#c084fc", delay: "0.4s" },
                        { emoji: "🍊", glow: "#fb923c", delay: "0.8s" },
                        { emoji: "🍓", glow: "#f43f5e", delay: "1.2s" },
                        { emoji: "🍌", glow: "#fbbf24", delay: "0.2s" },
                        { emoji: "🥝", glow: "#86efac", delay: "0.6s" },
                      ] as const).map((f, i) => (
                        <div key={i} className="flex items-center justify-center rounded-lg p-1.5 border"
                          style={{ borderColor: f.glow + "44", background: f.glow + "12", boxShadow: `0 0 8px ${f.glow}30` }}>
                          <div className="sm-fb text-xl" style={{ animationDelay: f.delay, filter: `drop-shadow(0 0 6px ${f.glow})` }}>{f.emoji}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full h-px" style={{ background: "linear-gradient(to right,transparent,rgba(74,222,128,0.4),transparent)" }} />

                <div>
                  <div className="text-[7px] text-white/35 tracking-widest uppercase mb-1.5 font-bold text-center">⚡ Kontrol</div>
                  <div className="grid grid-cols-3 gap-1.5 w-full">
                    {([
                      { icon: "🕹️",  label: "ARAHKAN",  desc: "Panah / WASD",      color: "#4ade80" },
                      { icon: "👆",   label: "SWIPE",    desc: "Geser layar HP",    color: "#86efac" },
                      { icon: "📝",   label: "SOAL",     desc: "25 detik · +20pts", color: "#facc15" },
                    ] as const).map(w => (
                      <div key={w.label} className="flex flex-col items-center gap-0.5 rounded-xl py-1.5 px-1 border"
                        style={{ borderColor: w.color + "44", background: w.color + "0f", boxShadow: `0 0 8px ${w.color}30` }}>
                        <span className="text-base leading-none" style={{ filter: `drop-shadow(0 0 5px ${w.color})` }}>{w.icon}</span>
                        <span className="text-[7px] font-black" style={{ color: w.color }}>{w.label}</span>
                        <span className="text-[6px] text-white/35 text-center leading-tight">{w.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sm-action">
                <div className="w-full h-px" style={{ background: "linear-gradient(to right,transparent,rgba(74,222,128,0.28),transparent)" }} />
                <div className="text-[7px] text-white/35 tracking-widest uppercase mb-1 font-bold text-center">📖 Cara Bermain</div>
                <div className="space-y-1.5">
                  {[
                    { icon: "🐍", text: "Arahkan ular untuk memakan buah-buahan — ular akan memanjang dan skor bertambah" },
                    { icon: "💥", text: "Jangan menabrak bingkai/tembok atau tubuh sendiri — kalau menabrak, Game Over!" },
                    { icon: "⚡", text: "Semakin panjang ular, semakin cepat gerakannya — tetap fokus!" },
                    { icon: "📝", text: "Tiap 25 detik muncul soal dari guru (5 soal) — jawab benar = +20 poin bonus" },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-start gap-2 px-1">
                      <span className="text-sm shrink-0 leading-none mt-0.5">{icon}</span>
                      <p className="text-[8px] text-white/55 leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-center gap-1.5 mt-2">
                  <button onClick={startGame}
                    className="sm-btn-breathe font-display font-black text-white text-lg px-8 py-3 rounded-2xl cursor-pointer hover:scale-110 active:scale-95 w-full"
                    style={{
                      background: "linear-gradient(135deg,#22c55e 0%,#16a34a 45%,#15803d 100%)",
                      boxShadow: "0 0 30px rgba(74,222,128,0.85),0 0 60px rgba(34,197,94,0.35),0 4px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.2)",
                    }}>
                    🐍 MULAI BERMAIN
                  </button>
                  <div className="text-[7px] text-white/20 text-center leading-relaxed">
                    ← ↑ → ↓ atau WASD = arahkan · Swipe untuk mobile
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  const speedPct = Math.round(((INIT_INTERVAL - intervalRef.current) / (INIT_INTERVAL - MIN_INTERVAL)) * 100);

  return (
    <div className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}

      <div className="relative z-10 w-full h-full px-2 pt-5 pb-2 flex flex-col items-center">
        {/* nav */}
        <div className="flex items-center justify-between w-full mb-2 gap-2 max-w-6xl">
          <button
            onClick={() => { playPopSound(); if (backPath) navigate(backPath); else navigate(-1); }}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,255,136,0.45)] hover:opacity-90 transition-opacity cursor-pointer"
            title="Kembali ke pilihan game"
          >
            <span className="text-base leading-none">←</span>
            <span className="hidden sm:inline">Kembali</span>
          </button>
          <h1 className="font-display text-base sm:text-xl font-bold flex-1 text-center leading-tight">
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,215,0,0.45)]">
              🐍 SNAKE MATEMATIKA
            </span>
            {topicLabel ? <span className="block text-[10px] md:text-xs text-cyan-200 font-body mt-0.5">{topicLabel}</span> : null}
          </h1>
          <button
            onClick={() => { playPopSound(); navigate(homePath); }}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,255,136,0.45)] hover:opacity-90 transition-opacity cursor-pointer"
            title="Menu Utama"
          >
            <span className="text-base leading-none">🏠</span>
            <span className="hidden sm:inline">Home</span>
          </button>
        </div>

        {/* HUD: stats + quiz countdown */}
        <div className="w-full max-w-6xl mb-2 flex flex-col gap-2 px-1">
          <div className="rounded-xl border border-amber-400/50 bg-gradient-to-r from-amber-500/15 via-yellow-500/15 to-amber-500/15 px-4 py-2 flex items-center justify-center gap-3 shadow-[0_0_18px_rgba(255,200,0,0.25)]">
            <span className="text-xl sm:text-2xl">👨‍🏫</span>
            <span className="font-display text-sm sm:text-base font-bold text-amber-200 tracking-wide drop-shadow-[0_0_8px_rgba(255,215,0,0.55)]">
              {guruQuiz.questionNumber >= guruQuiz.totalQuestions
                ? `🎉 Semua soal selesai! Bertahan hidup selama mungkin!`
                : `Soal Pak/Bu Guru ke-${guruQuiz.questionNumber + 1}/${guruQuiz.totalQuestions} muncul dalam`}
            </span>
            {guruQuiz.questionNumber < guruQuiz.totalQuestions && (
              <span className="font-display text-xl sm:text-2xl font-black text-amber-100 tabular-nums drop-shadow-[0_0_10px_rgba(255,215,0,0.75)]">
                {guruQuiz.secondsUntilNext}s
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs sm:text-sm font-display">
            <div className="flex flex-wrap gap-3">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/40 text-amber-200">
                ⭐ SKOR: <span className="font-bold text-sm sm:text-base text-amber-100">{score}</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-400/40 text-cyan-200">
                🏆 REKOR: <span className="font-bold text-cyan-100">{best}</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-pink-500/15 border border-pink-400/40 text-pink-200">
                🐍 PANJANG: <span className="font-bold text-pink-100">{snakeLen}</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-400/40 text-emerald-200">
                📘 GURU: <span className="font-bold text-emerald-100">{guruQuiz.guruScore}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 min-w-[160px]">
              <span className="text-orange-300 text-[10px] sm:text-xs whitespace-nowrap">⚡ KECEPATAN</span>
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 via-orange-400 to-red-500 transition-[width] duration-300"
                  style={{ width: `${Math.max(0, Math.min(100, speedPct))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* canvas + d-pad column — d-pad sits BELOW the playfield so the game looks bigger and wider */}
        <div
          className="relative w-full flex-1 min-h-0 flex flex-col items-center justify-center gap-2 select-none"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Snake playfield */}
          <div
            className="relative max-w-full"
            style={{ aspectRatio: `${CW}/${CH}`, width: 'min(100%, calc((100dvh - 340px) * ' + (CW / CH).toFixed(4) + '))' }}
          >
            <canvas
              ref={canvasRef}
              width={CW}
              height={CH}
              className="rounded-2xl border-2 border-amber-400/40 shadow-[0_0_40px_rgba(255,200,80,0.28)] w-full h-full block"
            />

            {/* feedback toast */}
            {feedback && (
              <div className={`absolute top-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl font-bold text-sm shadow-xl pointer-events-none z-30 whitespace-nowrap animate-pulse ${
                feedback.good ? "bg-green-500/95 text-white" : "bg-red-500/95 text-white"
              }`}>
                {feedback.txt}
              </div>
            )}

            {/* dead */}
            {phase === "dead" && (
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/72 backdrop-blur-sm">
                <div className="text-center px-5">
                  <div className="text-5xl mb-2">💀</div>
                  <h2 className="font-display text-3xl font-bold text-red-400 mb-2">GAME OVER</h2>
                  <p className="text-white mb-1">Skor: <span className="text-yellow-400 font-bold text-2xl">{score}</span></p>
                  <p className="text-white/50 text-sm mb-5">Rekor: {best}</p>
                  <button onClick={startGame} className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition cursor-pointer shadow-[0_0_20px_rgba(0,255,136,0.55)]">
                    🐍 Main Lagi
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* D-pad: ◀ | [▲ / ▼] | ▶ — placed BELOW the canvas */}
          <div className="shrink-0 flex items-center gap-2 sm:gap-3">
            <button
              onPointerDown={() => { if (nextDirRef.current !== "R") nextDirRef.current = "L"; }}
              aria-label="Belok kiri"
              className="bg-card/80 border border-amber-400/40 text-amber-100 font-bold w-12 h-12 sm:w-14 sm:h-14 rounded-xl active:scale-95 select-none flex items-center justify-center text-xl shadow-[0_0_10px_rgba(255,200,80,0.18)]"
            >◀</button>
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <button
                onPointerDown={() => { if (nextDirRef.current !== "D") nextDirRef.current = "U"; }}
                aria-label="Belok atas"
                className="bg-card/80 border border-amber-400/40 text-amber-100 font-bold w-12 h-10 sm:w-14 sm:h-12 rounded-xl active:scale-95 select-none flex items-center justify-center text-lg shadow-[0_0_10px_rgba(255,200,80,0.18)]"
              >▲</button>
              <button
                onPointerDown={() => { if (nextDirRef.current !== "U") nextDirRef.current = "D"; }}
                aria-label="Belok bawah"
                className="bg-card/80 border border-amber-400/40 text-amber-100 font-bold w-12 h-10 sm:w-14 sm:h-12 rounded-xl active:scale-95 select-none flex items-center justify-center text-lg shadow-[0_0_10px_rgba(255,200,80,0.18)]"
              >▼</button>
            </div>
            <button
              onPointerDown={() => { if (nextDirRef.current !== "L") nextDirRef.current = "R"; }}
              aria-label="Belok kanan"
              className="bg-card/80 border border-amber-400/40 text-amber-100 font-bold w-12 h-12 sm:w-14 sm:h-14 rounded-xl active:scale-95 select-none flex items-center justify-center text-xl shadow-[0_0_10px_rgba(255,200,80,0.18)]"
            >▶</button>
          </div>
        </div>

        <p className="text-white/40 text-[10px] font-body text-center mt-1">
          <span className="hidden sm:inline">Keyboard: ← ↑ → ↓ / WASD &nbsp;·&nbsp; </span>
          Mobile: swipe atau gunakan tombol di bawah
        </p>
        <GuruQuizOverlay {...guruQuiz} />
      </div>
    </div>
  );
};

export default SnakeMathPage;
