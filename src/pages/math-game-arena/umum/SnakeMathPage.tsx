import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";

// ── Grid ──────────────────────────────────────────────────────────────────
const COLS = 20;
const ROWS = 20;
const CELL = 21;
const GW = COLS * CELL; // 420
const GH = ROWS * CELL; // 420
const HUD_H = 90;
const CW = GW;          // 420
const CH = GH + HUD_H;  // 510

// ── Directions ────────────────────────────────────────────────────────────
type Dir = "U" | "D" | "L" | "R";
const OPP: Record<Dir, Dir> = { U: "D", D: "U", L: "R", R: "L" };
const DVEC: Record<Dir, [number, number]> = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };

// ── Math questions ────────────────────────────────────────────────────────
interface MQ { q: string; ans: number }
const makeQ = (): MQ => {
  const type = Math.floor(Math.random() * 7);
  switch (type) {
    case 0: { const a = 2 + Math.floor(Math.random() * 11), b = 2 + Math.floor(Math.random() * 11); return { q: `${a} × ${b}`, ans: a * b }; }
    case 1: { const a = 10 + Math.floor(Math.random() * 91), b = 10 + Math.floor(Math.random() * 91); return { q: `${a} + ${b}`, ans: a + b }; }
    case 2: { const a = 20 + Math.floor(Math.random() * 81), b = 5 + Math.floor(Math.random() * 16); return { q: `${a + b} − ${b}`, ans: a }; }
    case 3: { const b = 2 + Math.floor(Math.random() * 9), a = b * (2 + Math.floor(Math.random() * 9)); return { q: `${a} ÷ ${b}`, ans: a / b }; }
    case 4: { const b = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144][Math.floor(Math.random() * 11)]; return { q: `√${b}`, ans: Math.round(Math.sqrt(b)) }; }
    case 5: { const a = 2 + Math.floor(Math.random() * 9), p = 2 + Math.floor(Math.random() * 3); return { q: `${a}^${p}`, ans: Math.pow(a, p) }; }
    default: { const a = 2 + Math.floor(Math.random() * 13), b = 2 + Math.floor(Math.random() * 13); return { q: `FPB(${a * 2}, ${a * 3})`, ans: a }; }
  }
};
const makeWrong = (ans: number, existing: Set<number>): number => {
  let v: number;
  let tries = 0;
  do {
    const delta = (1 + Math.floor(Math.random() * 15)) * (Math.random() < 0.5 ? 1 : -1);
    v = ans + delta;
    tries++;
  } while ((existing.has(v) || v < 0 || v === ans) && tries < 80);
  return v;
};

// ── Food ──────────────────────────────────────────────────────────────────
interface Food { x: number; y: number; value: number; correct: boolean; pulse: number }

// ── Particle ─────────────────────────────────────────────────────────────
interface Particle { x: number; y: number; vx: number; vy: number; alpha: number; color: string; r: number }

type Phase = "idle" | "playing" | "dead";

const INIT_LENGTH = 5;
const INIT_INTERVAL = 180;
const MIN_INTERVAL = 68;
const GROW_ON_CORRECT = 3;
const SHRINK_ON_WRONG = 2;

const SnakeMathPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  // game state (refs for loop)
  const phaseRef = useRef<Phase>("idle");
  const guruQuiz = useGuruQuiz(phaseRef);
  const snakeRef = useRef<Array<{ x: number; y: number }>>([]);
  const dirRef = useRef<Dir>("R");
  const nextDirRef = useRef<Dir>("R");
  const qRef = useRef<MQ>({ q: "", ans: 0 });
  const foodsRef = useRef<Food[]>([]);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const intervalRef = useRef(INIT_INTERVAL);
  const lastStepRef = useRef(0);
  const growPendRef = useRef(0);
  const shrinkFlashRef = useRef(0);
  const correctFlashRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const bgStarsRef = useRef<Array<{ x: number; y: number; r: number; t: number; s: number }>>([]);
  const trailRef = useRef<Array<{ x: number; y: number; alpha: number }>>([]);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const combo = useRef(0);

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
    const q = makeQ();
    qRef.current = q;
    const usedVals = new Set<number>([q.ans]);
    const wrong1 = makeWrong(q.ans, usedVals); usedVals.add(wrong1);
    const wrong2 = makeWrong(q.ans, usedVals); usedVals.add(wrong2);
    const wrong3 = makeWrong(q.ans, usedVals);

    const values = [q.ans, wrong1, wrong2, wrong3];
    // shuffle
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }

    foodsRef.current = values.map(v => {
      const pos = randomCell();
      return { ...pos, value: v, correct: v === q.ans, pulse: Math.random() * Math.PI * 2 };
    });
  }, []);

  const spawnParticles = (x: number, y: number, color: string, n = 12) => {
    const px = x * CELL + CELL / 2;
    const py = y * CELL + CELL / 2 + HUD_H;
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
    shrinkFlashRef.current = 0;
    correctFlashRef.current = 0;
    combo.current = 0;
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
      if (eaten.correct) {
        combo.current += 1;
        const bonus = 10 + combo.current * 5;
        scoreRef.current += bonus;
        setScore(scoreRef.current);
        growPendRef.current += GROW_ON_CORRECT;
        correctFlashRef.current = 0.6;
        intervalRef.current = Math.max(MIN_INTERVAL, intervalRef.current - 6);
        spawnParticles(nx, ny, "#00FF88", 14);
        showFeedback(`✅ BENAR! +${bonus}${combo.current > 1 ? ` COMBO ×${combo.current}` : ""}`, true);
        placeFoods();
      } else {
        combo.current = 0;
        shrinkFlashRef.current = 0.8;
        spawnParticles(nx, ny, "#FF4444", 10);
        // remove tail cells
        const remove = Math.min(SHRINK_ON_WRONG + 1, snakeRef.current.length - 2);
        if (snakeRef.current.length - remove <= 1) {
          phaseRef.current = "dead";
          setPhase("dead");
          if (scoreRef.current > bestRef.current) { bestRef.current = scoreRef.current; setBest(bestRef.current); }
          return;
        }
        snakeRef.current = snakeRef.current.slice(0, snakeRef.current.length - remove);
        showFeedback(`❌ Salah! Jawaban: ${qRef.current.ans}`, false);
        // replace eaten wrong food
        const pos = randomCell();
        let newWrong: number;
        const used = new Set<number>([qRef.current.ans, ...foodsRef.current.map(f => f.value)]);
        newWrong = makeWrong(qRef.current.ans, used);
        foodsRef.current = foodsRef.current.map(f => f === eaten ? { ...pos, value: newWrong, correct: false, pulse: Math.random() * Math.PI * 2 } : f);
      }
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
  }, [placeFoods]);

  // ── Draw ─────────────────────────────────────────────────────────────
  const draw = useCallback((ts: number, dt: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // bg
    ctx.fillStyle = "#06060f";
    ctx.fillRect(0, 0, CW, CH);

    // HUD bg
    const hudGrad = ctx.createLinearGradient(0, 0, 0, HUD_H);
    hudGrad.addColorStop(0, "#0a0a1e");
    hudGrad.addColorStop(1, "#060612");
    ctx.fillStyle = hudGrad;
    ctx.fillRect(0, 0, CW, HUD_H);

    // grid bg
    const gridGrad = ctx.createLinearGradient(0, HUD_H, 0, HUD_H + GH);
    gridGrad.addColorStop(0, "#050510");
    gridGrad.addColorStop(1, "#080820");
    ctx.fillStyle = gridGrad;
    ctx.fillRect(0, HUD_H, GW, GH);

    // stars
    bgStarsRef.current.forEach(s => {
      s.t += dt * s.s;
      const a = 0.25 + 0.75 * Math.abs(Math.sin(s.t));
      ctx.globalAlpha = a;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // grid lines (subtle)
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 0.5;
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath(); ctx.moveTo(c * CELL, HUD_H); ctx.lineTo(c * CELL, HUD_H + GH); ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath(); ctx.moveTo(0, HUD_H + r * CELL); ctx.lineTo(GW, HUD_H + r * CELL); ctx.stroke();
    }

    // border glow
    ctx.shadowColor = "#00FFAA";
    ctx.shadowBlur = 8;
    ctx.strokeStyle = "#00FFAA44";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, HUD_H + 1, GW - 2, GH - 2);
    ctx.shadowBlur = 0;

    // foods
    foodsRef.current.forEach(f => {
      f.pulse += dt * 3;
      const px = f.x * CELL + CELL / 2;
      const py = f.y * CELL + CELL / 2 + HUD_H;
      const pulse = 0.8 + 0.2 * Math.sin(f.pulse);
      const r = CELL / 2 - 2;

      if (f.correct) {
        // glowing circle
        const grad = ctx.createRadialGradient(px, py, 0, px, py, r * pulse);
        grad.addColorStop(0, "#FFD700");
        grad.addColorStop(0.6, "#FFA500");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.shadowColor = "#FFD700";
        ctx.shadowBlur = 14 + 6 * Math.sin(f.pulse);
        ctx.beginPath();
        ctx.arc(px, py, r * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        // star shape
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(f.pulse * 0.3);
        ctx.fillStyle = "#FFD700";
        ctx.shadowColor = "#FFD700";
        ctx.shadowBlur = 8;
        const sp = 5;
        const outer = r * pulse * 0.8;
        const inner = outer * 0.45;
        ctx.beginPath();
        for (let i = 0; i < sp * 2; i++) {
          const ang = (Math.PI / sp) * i - Math.PI / 2;
          const rad = i % 2 === 0 ? outer : inner;
          i === 0 ? ctx.moveTo(Math.cos(ang) * rad, Math.sin(ang) * rad) : ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
        }
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      } else {
        // wrong — blue hexagon
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(f.pulse * 0.15);
        const rh = r * 0.88;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const ang = (Math.PI / 3) * i;
          i === 0 ? ctx.moveTo(Math.cos(ang) * rh, Math.sin(ang) * rh) : ctx.lineTo(Math.cos(ang) * rh, Math.sin(ang) * rh);
        }
        ctx.closePath();
        ctx.fillStyle = "#1a1a55";
        ctx.strokeStyle = "#4488FF";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#4488FF";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      // value label
      ctx.fillStyle = f.correct ? "#111" : "#88AAFF";
      ctx.font = `bold ${f.value > 99 ? 9 : f.value > 9 ? 11 : 13}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(f.value), px, py + (f.correct ? 0.5 : 0));
    });

    // snake trail
    trailRef.current.forEach(t => {
      t.alpha -= dt * 4;
      if (t.alpha <= 0) return;
      ctx.globalAlpha = t.alpha * 0.35;
      ctx.fillStyle = "#00FF88";
      ctx.beginPath();
      ctx.arc(t.x * CELL + CELL / 2, t.y * CELL + CELL / 2 + HUD_H, CELL / 2 - 4, 0, Math.PI * 2);
      ctx.fill();
    });
    trailRef.current = trailRef.current.filter(t => t.alpha > 0);
    ctx.globalAlpha = 1;

    // snake body
    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      const px = seg.x * CELL;
      const py = seg.y * CELL + HUD_H;
      const isHead = i === 0;
      const t = i / snake.length;

      const r = isHead ? CELL / 2 - 1 : CELL / 2 - 2;
      const hue = 140 + t * 60;
      const color = isHead ? `hsl(${hue},100%,60%)` : `hsl(${hue},90%,${50 - t * 15}%)`;

      ctx.shadowColor = isHead ? "#00FF88" : "#00CC66";
      ctx.shadowBlur = isHead ? 14 : 5;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(px + 1, py + 1, CELL - 2, CELL - 2, r);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (isHead) {
        // eyes
        const [edx, edy] = DVEC[dirRef.current];
        const eyeR = 2.5;
        const ex = px + CELL / 2 + edx * 4;
        const ey = py + CELL / 2 + edy * 4;
        const perp = Math.abs(edx) > 0 ? [0, 1] : [1, 0];
        [[1], [-1]].forEach(([s]) => {
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(ex + perp[0] * s * 4, ey + perp[1] * s * 4, eyeR, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#222";
          ctx.beginPath();
          ctx.arc(ex + perp[0] * s * 4 + edx, ey + perp[1] * s * 4 + edy, 1.5, 0, Math.PI * 2);
          ctx.fill();
        });
        // tongue
        if (Math.sin(ts / 200) > 0) {
          ctx.strokeStyle = "#FF3366";
          ctx.lineWidth = 1.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(px + CELL / 2 + edx * (CELL / 2 - 1), py + CELL / 2 + edy * (CELL / 2 - 1));
          ctx.lineTo(px + CELL / 2 + edx * (CELL / 2 + 5), py + CELL / 2 + edy * (CELL / 2 + 5));
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(px + CELL / 2 + edx * (CELL / 2 + 4), py + CELL / 2 + edy * (CELL / 2 + 4));
          ctx.lineTo(px + CELL / 2 + edx * (CELL / 2 + 5) + perp[0] * 3, py + CELL / 2 + edy * (CELL / 2 + 5) + perp[1] * 3);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(px + CELL / 2 + edx * (CELL / 2 + 4), py + CELL / 2 + edy * (CELL / 2 + 4));
          ctx.lineTo(px + CELL / 2 + edx * (CELL / 2 + 5) - perp[0] * 3, py + CELL / 2 + edy * (CELL / 2 + 5) - perp[1] * 3);
          ctx.stroke();
        }
      }
    });

    // particles
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

    // flash overlays
    if (correctFlashRef.current > 0) {
      correctFlashRef.current -= dt * 2.5;
      ctx.fillStyle = `rgba(0,255,136,${Math.max(0, correctFlashRef.current) * 0.12})`;
      ctx.fillRect(0, HUD_H, CW, GH);
    }
    if (shrinkFlashRef.current > 0) {
      shrinkFlashRef.current -= dt * 2.5;
      ctx.fillStyle = `rgba(255,60,60,${Math.max(0, shrinkFlashRef.current) * 0.22})`;
      ctx.fillRect(0, HUD_H, CW, GH);
    }

    // ── HUD ──────────────────────────────────────────────────────────
    // question box
    ctx.fillStyle = "rgba(255,215,0,0.1)";
    ctx.beginPath();
    ctx.roundRect(8, 8, CW - 16, 46, 10);
    ctx.fill();
    ctx.strokeStyle = "#FFD70055";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#FFD700";
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 8;
    ctx.font = "bold 22px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${qRef.current.q} = ?`, CW / 2, 31);
    ctx.shadowBlur = 0;

    // score & length
    ctx.textAlign = "left";
    ctx.fillStyle = "#00FF88";
    ctx.font = "bold 13px monospace";
    ctx.fillText(`SKOR: ${scoreRef.current}`, 10, 70);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "11px monospace";
    ctx.fillText(`PANJANG: ${snakeRef.current.length}`, 10, 84);

    // speed bar
    const spd = (INIT_INTERVAL - intervalRef.current) / (INIT_INTERVAL - MIN_INTERVAL);
    const spdColor = `hsl(${120 - spd * 120},100%,55%)`;
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.roundRect(CW - 114, 60, 106, 10, 4);
    ctx.fill();
    ctx.fillStyle = spdColor;
    ctx.beginPath();
    ctx.roundRect(CW - 114, 60, 106 * spd, 10, 4);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.font = "10px monospace";
    ctx.textAlign = "right";
    ctx.fillText("⚡ KECEPATAN", CW - 10, 58);

    // best
    ctx.fillStyle = "#00EEFF";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "right";
    ctx.fillText(`REKOR: ${bestRef.current}`, CW - 10, 84);
    ctx.textAlign = "left";
  }, []);

  // ── Main RAF ─────────────────────────────────────────────────────────
  const lastRafRef = useRef(0);
  const loop = useCallback((ts: number) => {
    const dt = Math.min((ts - (lastRafRef.current || ts)) / 1000, 0.05);
    lastRafRef.current = ts;
    if (guruQuiz.isPausedRef.current) { rafRef.current = requestAnimationFrame(loop); return; }

    if (phaseRef.current === "playing") {
      const elapsed = ts - lastStepRef.current;
      if (elapsed >= intervalRef.current) {
        step();
        lastStepRef.current = ts;
      }
    }

    draw(ts, dt);
    rafRef.current = requestAnimationFrame(loop);
  }, [step, draw]);

  const startGame = useCallback(() => {
    playPopSound();
    resetGame();
    phaseRef.current = "playing";
    setPhase("playing");
    lastStepRef.current = performance.now();
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

  return (
    <div className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}

      <div className="relative z-10 w-full max-w-lg px-2 py-4 flex flex-col items-center">
        {/* nav */}
        <div className="flex items-center justify-between w-full mb-2">
          <button
            onClick={() => { playPopSound(); navigate('/ruang-untuk-guru/numatik-game'); }}
            className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all text-sm"
            title="Menu Utama"
          >
            🏠
          </button>
          <h1 className="font-display text-xl font-bold text-primary text-glow-cyan text-center flex-1">
            🐍 SNAKE MATEMATIKA
          </h1>
          <button
            onClick={() => { playPopSound(); navigate(-1); }}
            className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all font-bold"
            title="Keluar"
          >
            ✕
          </button>
        </div>

        {/* stat strip */}
        <div className="flex gap-4 mb-2 text-xs font-display">
          <span className="text-yellow-400">SKOR: <span className="font-bold text-sm">{score}</span></span>
          <span className="text-white/50">REKOR: <span className="text-cyan-400 font-bold">{best}</span></span>
          <span className="text-green-400">PANJANG: <span className="font-bold">{snakeLen}</span></span>
        </div>

        {/* canvas */}
        <div
          className="relative w-full select-none"
          style={{ maxWidth: CW, maxHeight: 'calc(100dvh - 195px)', aspectRatio: `${CW}/${CH}` }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            className="rounded-2xl border border-border shadow-2xl w-full h-full"
          />

          {/* feedback toast */}
          {feedback && (
            <div className={`absolute top-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl font-bold text-sm shadow-xl pointer-events-none z-30 whitespace-nowrap ${
              feedback.good ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
            }`}>
              {feedback.txt}
            </div>
          )}

          {/* idle */}
          {phase === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/68">
              <div className="text-center px-5 max-w-xs">
                <div className="text-5xl mb-2">🐍</div>
                <h2 className="font-display text-2xl font-bold text-accent mb-2">SNAKE MATEMATIKA</h2>
                <p className="text-white/65 text-xs mb-4 leading-relaxed">
                  Arahkan ular untuk memakan angka yang <span className="text-yellow-400 font-bold">⭐ benar</span> dari soal matematika!<br />
                  Makan angka <span className="text-blue-400 font-bold">salah</span> → ular memendek<br />
                  Tabrak tembok atau diri sendiri → Game Over!
                </p>
                <div className="flex justify-center gap-2 mb-4 text-xs flex-wrap">
                  <span className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg px-2 py-1">⭐ Jawaban Benar</span>
                  <span className="bg-blue-500/20 border border-blue-500/40 rounded-lg px-2 py-1">🔷 Salah → Memendek</span>
                </div>
                <p className="text-white/40 text-xs mb-5">Makin banyak benar → makin cepat + COMBO bonus!</p>
                <button onClick={startGame} className="bg-accent text-black font-bold px-10 py-3 rounded-xl hover:opacity-90 transition text-lg cursor-pointer shadow-lg">
                  ▶ MULAI
                </button>
              </div>
            </div>
          )}

          {/* dead */}
          {phase === "dead" && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/72">
              <div className="text-center px-5">
                <div className="text-4xl mb-2">💀</div>
                <h2 className="font-display text-2xl font-bold text-red-400 mb-1">GAME OVER</h2>
                <p className="text-white mb-1">Skor: <span className="text-yellow-400 font-bold text-2xl">{score}</span></p>
                <p className="text-white/50 text-sm mb-5">Rekor: {best}</p>
                <button onClick={startGame} className="bg-accent text-black font-bold px-8 py-3 rounded-xl hover:opacity-90 transition cursor-pointer shadow-lg">
                  🐍 Main Lagi
                </button>
              </div>
            </div>
          )}
        </div>

        {/* d-pad mobile */}
        <div className="mt-3 flex flex-col items-center gap-1">
          <button
            onPointerDown={() => { if (nextDirRef.current !== "D") nextDirRef.current = "U"; }}
            className="bg-card/80 border border-border text-white font-bold px-6 py-3 rounded-xl hover:border-accent transition cursor-pointer active:scale-95 select-none"
          >▲</button>
          <div className="flex gap-2">
            <button
              onPointerDown={() => { if (nextDirRef.current !== "R") nextDirRef.current = "L"; }}
              className="bg-card/80 border border-border text-white font-bold px-6 py-3 rounded-xl hover:border-accent transition cursor-pointer active:scale-95 select-none"
            >◀</button>
            <button
              onPointerDown={() => { if (nextDirRef.current !== "U") nextDirRef.current = "D"; }}
              className="bg-card/80 border border-border text-white font-bold px-6 py-3 rounded-xl hover:border-accent transition cursor-pointer active:scale-95 select-none"
            >▼</button>
            <button
              onPointerDown={() => { if (nextDirRef.current !== "L") nextDirRef.current = "R"; }}
              className="bg-card/80 border border-border text-white font-bold px-6 py-3 rounded-xl hover:border-accent transition cursor-pointer active:scale-95 select-none"
            >▶</button>
          </div>
        </div>

        <p className="mt-2 text-white/40 text-xs font-body text-center">
          Keyboard: ← ↑ → ↓ / WASD &nbsp;·&nbsp; Mobile: swipe atau D-pad
        </p>
      <GuruQuizOverlay {...guruQuiz} />
      </div>
    </div>
  );
};

export default SnakeMathPage;
