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
  const [nextQuizIn, setNextQuizIn] = useState<number>(Math.ceil(quizIntervalMs / 1000));
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
    setNextQuizIn(Math.ceil(quizIntervalMs / 1000));
    bgStarsRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * CW, y: Math.random() * CH, r: 0.5 + Math.random() * 1.2,
      t: Math.random() * Math.PI * 2, s: 0.8 + Math.random() * 1.5,
    }));
    initSnake();
    placeFoods();
    setSnakeLen(INIT_LENGTH);
  }, [initSnake, placeFoods, quizIntervalMs]);

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

      // Update quiz countdown chip
      if (sessionStartRef.current > 0) {
        const sessionElapsed = (performance.now() - sessionStartRef.current) - pausedAccumRef.current;
        const totalQ = guruQuiz.totalQuestions;
        const askedQ = guruQuiz.questionNumber;
        if (askedQ < totalQ) {
          const nextAtMs = (askedQ + 1) * quizIntervalMs;
          const remainingMs = Math.max(0, nextAtMs - sessionElapsed);
          const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
          setNextQuizIn(prev => (prev !== remainingSec ? remainingSec : prev));
        } else {
          setNextQuizIn(prev => (prev !== 0 ? 0 : prev));
        }
      }
    }

    draw(ts, dt);
    rafRef.current = requestAnimationFrame(loop);
  }, [step, draw, guruQuiz.isPausedRef, guruQuiz.questionNumber, guruQuiz.totalQuestions, quizIntervalMs]);

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
    setNextQuizIn(Math.ceil(quizIntervalMs / 1000));
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [resetGame, loop, quizIntervalMs]);

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
    const decorations: Array<{ pos: string; anim: string; emoji: string; size: string; glow: string; opacity: string }> = [
      { pos: "top-[8%] left-[7%]", anim: "animate-float-slow", emoji: "🍎", size: "text-3xl md:text-5xl", glow: "drop-shadow-[0_0_15px_rgba(255,80,80,0.55)]", opacity: "opacity-80" },
      { pos: "top-[14%] right-[10%]", anim: "animate-float-medium", emoji: "🍏", size: "text-2xl md:text-4xl", glow: "drop-shadow-[0_0_15px_rgba(100,255,150,0.55)]", opacity: "opacity-75" },
      { pos: "top-[42%] left-[4%]", anim: "animate-float-fast", emoji: "⭐", size: "text-2xl md:text-3xl", glow: "drop-shadow-[0_0_15px_rgba(255,215,0,0.55)]", opacity: "opacity-70" },
      { pos: "top-[36%] right-[6%]", anim: "animate-float-slow", emoji: "🍒", size: "text-3xl md:text-4xl", glow: "drop-shadow-[0_0_15px_rgba(255,100,100,0.55)]", opacity: "opacity-75" },
      { pos: "bottom-[18%] left-[8%]", anim: "animate-float-medium", emoji: "🍇", size: "text-3xl md:text-5xl", glow: "drop-shadow-[0_0_15px_rgba(180,100,255,0.55)]", opacity: "opacity-75" },
      { pos: "bottom-[24%] right-[8%]", anim: "animate-float-fast", emoji: "🍊", size: "text-2xl md:text-4xl", glow: "drop-shadow-[0_0_15px_rgba(255,165,0,0.55)]", opacity: "opacity-75" },
      { pos: "bottom-[10%] left-[18%]", anim: "animate-float-slow", emoji: "✨", size: "text-2xl md:text-3xl", glow: "drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]", opacity: "opacity-80" },
      { pos: "top-[55%] right-[16%]", anim: "animate-float-fast", emoji: "🐍", size: "text-3xl md:text-5xl", glow: "drop-shadow-[0_0_18px_rgba(0,255,136,0.6)]", opacity: "opacity-80" },
    ];

    return (
      <>
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
          <img src={spaceBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 via-background/40 to-teal-950/70" />
          <Starfield />

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {decorations.map((d, i) => (
              <div key={i} className={`absolute ${d.pos} ${d.anim}`}>
                <span className={`${d.size} ${d.glow} ${d.opacity}`}>{d.emoji}</span>
              </div>
            ))}
            <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 animate-hover-ship">
              <span className="text-5xl md:text-7xl drop-shadow-[0_0_25px_rgba(0,255,136,0.6)]">🐍</span>
            </div>
          </div>

          <div className="relative z-10 text-center animate-slide-up px-4">
            <div className="mb-2">
              <h1 className="font-display text-3xl md:text-5xl font-black tracking-wider">
                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,255,136,0.55)]">
                  MATH GAME ARENA
                </span>
              </h1>
            </div>
            <div className="mb-2">
              <h2 className="font-display text-4xl md:text-6xl font-black tracking-[0.18em]">
                <span className="bg-gradient-to-r from-emerald-300 via-green-400 to-lime-400 bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(0,255,136,0.6)]">
                  🐍 SNAKE
                </span>
              </h2>
            </div>
            <div className="mb-6">
              <h3 className="font-display text-2xl md:text-4xl font-black tracking-[0.25em]">
                <span className="bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(190,255,80,0.55)]">
                  MATEMATIKA
                </span>
              </h3>
            </div>

            <div className="inline-block mb-8">
              <div className="px-6 py-2 rounded-full bg-gradient-to-r from-emerald-500/25 to-teal-500/25 border border-emerald-400/40 backdrop-blur-sm">
                <span className="font-display text-sm md:text-base font-bold text-emerald-200 tracking-wide">
                  {topicLabel ?? "MATH GAME"}
                </span>
              </div>
            </div>

            <div className="bg-card/70 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-6 max-w-md mx-auto mb-8 shadow-[0_0_30px_rgba(0,255,136,0.15)]">
              <h3 className="font-display text-lg font-bold text-emerald-300 mb-4 flex items-center justify-center gap-2">
                <span className="text-xl">🐍</span> CARA BERMAIN <span className="text-xl">🍎</span>
              </h3>
              <ul className="text-left space-y-3 font-body text-sm text-foreground/90">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-200 font-bold text-xs">1</span>
                  <span>Arahkan ular memakan <strong className="text-yellow-300">🍎 buah apa saja</strong> — ular akan <strong className="text-emerald-300">memanjang</strong> dan skor bertambah</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-200 font-bold text-xs">2</span>
                  <span>Jangan menabrak <strong className="text-red-400">bingkai/tembok</strong> atau <strong className="text-red-400">tubuh sendiri</strong> — kalau menabrak, Game Over!</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-200 font-bold text-xs">3</span>
                  <span>Setiap <strong className="text-amber-300">25 detik</strong> akan muncul <strong className="text-amber-300">soal matematika</strong> dari Pak/Bu Guru — jawab dengan benar untuk bonus skor</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-200 font-bold text-xs">4</span>
                  <span>Setelah <strong className="text-cyan-300">semua soal terjawab</strong>, permainan terus berjalan sampai ular mati</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-200 font-bold text-xs">5</span>
                  <span className="text-xs">Di komputer: gunakan <strong className="text-emerald-300">← ↑ → ↓</strong> atau <strong className="text-emerald-300">WASD</strong>. Di HP: swipe atau gunakan tombol arah di sebelah kiri layar.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={startGame}
              className="relative font-display text-xl md:text-2xl px-14 py-5 rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white font-black tracking-wider cursor-pointer shadow-[0_0_40px_rgba(0,255,136,0.55)] hover:shadow-[0_0_60px_rgba(0,255,136,0.75)] transition-shadow duration-300 animate-pulse-scale"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span>&#9658;</span> MULAI GAME <span>&#9658;</span>
              </span>
            </button>
          </div>
        </div>

        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-3 md:p-4 pointer-events-none"
          style={{
            paddingTop: "max(0.75rem, env(safe-area-inset-top, 0px))",
            paddingLeft: "max(0.75rem, env(safe-area-inset-left, 0px))",
            paddingRight: "max(0.75rem, env(safe-area-inset-right, 0px))",
          }}
        >
          <button
            onClick={() => { playPopSound(); if (backPath) navigate(backPath); else navigate(-1); }}
            className="pointer-events-auto shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,255,136,0.45)] hover:opacity-90 transition-opacity cursor-pointer"
            title="Kembali"
          >
            <span className="text-base leading-none">←</span>
            <span className="hidden sm:inline">Kembali</span>
          </button>
          <button
            onClick={() => { playPopSound(); navigate(homePath); }}
            className="pointer-events-auto shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,255,136,0.45)] hover:opacity-90 transition-opacity cursor-pointer"
            title="Menu Utama"
          >
            <span className="text-base leading-none">🏠</span>
            <span className="hidden sm:inline">Home</span>
          </button>
        </div>
      </>
    );
  }

  const speedPct = Math.round(((INIT_INTERVAL - intervalRef.current) / (INIT_INTERVAL - MIN_INTERVAL)) * 100);

  return (
    <div className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}

      <div className="relative z-10 w-full h-full px-2 py-2 flex flex-col items-center">
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
                {nextQuizIn}s
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

        {/* canvas + d-pad row — d-pad sits on the LEFT side of the playfield */}
        <div
          className="relative w-full flex-1 min-h-0 flex items-center justify-center gap-2 sm:gap-4 select-none"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* D-pad: ◀ | [▲ / ▼] | ▶ — always visible to the left of the canvas */}
          <div className="shrink-0 flex items-center gap-1 sm:gap-2">
            <button
              onPointerDown={() => { if (nextDirRef.current !== "R") nextDirRef.current = "L"; }}
              aria-label="Belok kiri"
              className="bg-card/80 border border-amber-400/40 text-amber-100 font-bold w-10 h-10 sm:w-12 sm:h-12 rounded-xl active:scale-95 select-none flex items-center justify-center text-lg shadow-[0_0_10px_rgba(255,200,80,0.18)]"
            >◀</button>
            <div className="flex flex-col gap-1 sm:gap-2">
              <button
                onPointerDown={() => { if (nextDirRef.current !== "D") nextDirRef.current = "U"; }}
                aria-label="Belok atas"
                className="bg-card/80 border border-amber-400/40 text-amber-100 font-bold w-10 h-10 sm:w-12 sm:h-10 rounded-xl active:scale-95 select-none flex items-center justify-center text-lg shadow-[0_0_10px_rgba(255,200,80,0.18)]"
              >▲</button>
              <button
                onPointerDown={() => { if (nextDirRef.current !== "U") nextDirRef.current = "D"; }}
                aria-label="Belok bawah"
                className="bg-card/80 border border-amber-400/40 text-amber-100 font-bold w-10 h-10 sm:w-12 sm:h-10 rounded-xl active:scale-95 select-none flex items-center justify-center text-lg shadow-[0_0_10px_rgba(255,200,80,0.18)]"
              >▼</button>
            </div>
            <button
              onPointerDown={() => { if (nextDirRef.current !== "L") nextDirRef.current = "R"; }}
              aria-label="Belok kanan"
              className="bg-card/80 border border-amber-400/40 text-amber-100 font-bold w-10 h-10 sm:w-12 sm:h-12 rounded-xl active:scale-95 select-none flex items-center justify-center text-lg shadow-[0_0_10px_rgba(255,200,80,0.18)]"
            >▶</button>
          </div>

          {/* Snake playfield */}
          <div
            className="relative max-w-full max-h-full"
            style={{ aspectRatio: `${CW}/${CH}`, width: 'min(100%, calc((100dvh - 240px) * ' + (CW / CH).toFixed(4) + '))' }}
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
        </div>

        <p className="text-white/40 text-[10px] font-body text-center mt-1">
          <span className="hidden sm:inline">Keyboard: ← ↑ → ↓ / WASD &nbsp;·&nbsp; </span>
          Mobile: swipe atau gunakan tombol di kiri
        </p>
        <GuruQuizOverlay {...guruQuiz} />
      </div>
    </div>
  );
};

export default SnakeMathPage;
