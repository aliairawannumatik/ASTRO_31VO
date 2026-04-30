import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";

const CW = 420;
const CH = 600;

const PADDLE_Y = CH - 38;
const PADDLE_H = 14;
const PADDLE_W_BASE = 96;
const BALL_R = 9;
const BALL_SPEED_BASE = 230;

const BRICK_COLS = 7;
const BRICK_ROWS = 5;
const BRICK_PAD = 5;
const BRICK_START_X = 12;
const BRICK_START_Y = 60;
const BRICK_W = (CW - BRICK_START_X * 2 - BRICK_PAD * (BRICK_COLS - 1)) / BRICK_COLS;
const BRICK_H = 26;

// ── Brick color palette ──────────────────────────────────────────────────────
const ROW_COLORS = [
  { fill: "#ff5e87", glow: "#ff5e87" },
  { fill: "#ff9040", glow: "#ff9040" },
  { fill: "#ffc94a", glow: "#ffc94a" },
  { fill: "#72f572", glow: "#72f572" },
  { fill: "#5ec8ff", glow: "#5ec8ff" },
];

interface Brick {
  col: number; row: number;
  x: number; y: number;
  color: typeof ROW_COLORS[0];
  alive: boolean;
  hits: number;     // number of times this brick has been hit by the ball
  cracked: boolean; // becomes true after first hit (visual crack)
  hitT: number;     // hit pop animation
  hitCooldown: number; // seconds remaining where the brick can't be re-hit
  sparkles: Sparkle[];
}

interface Sparkle { x: number; y: number; vx: number; vy: number; alpha: number; r: number; color: string }
interface FloatText { x: number; y: number; txt: string; alpha: number; vy: number; good: boolean }
// Flame particle for the ball's burning trail
interface Trail { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; r: number }

type Phase = "idle" | "ready" | "playing" | "dead";

const BrickBreakerPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastRef = useRef(0);

  const phaseRef = useRef<Phase>("idle");
  const guruQuiz = useGuruQuiz(phaseRef);
  const bricksRef = useRef<Brick[]>([]);
  const floatTextsRef = useRef<FloatText[]>([]);
  const trailRef = useRef<Trail[]>([]);

  const ballRef = useRef({ x: CW / 2, y: PADDLE_Y - BALL_R - 2, vx: 0, vy: 0, launched: false });
  const paddleRef = useRef({ x: CW / 2, w: PADDLE_W_BASE, powerT: 0 });
  const mouseTRef = useRef(CW / 2);
  // On-screen control buttons (left side)
  const holdLeftRef = useRef(false);
  const holdRightRef = useRef(false);
  const BUTTON_SPEED = 360; // px / second (in canvas coordinates)

  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const bestRef = useRef(0);
  const levelRef = useRef(1);
  const timerRef = useRef(90);
  const timerAccRef = useRef(0);
  const comboRef = useRef(0);
  const shakeRef = useRef(0);
  const hueRef = useRef(0);
  const bgStarsRef = useRef<{ x: number; y: number; r: number; alpha: number; t: number }[]>([]);

  const [, forceRender] = useState(0);
  const rerender = useCallback(() => forceRender(n => n + 1), []);

  // ── Build brick grid (color-only, no math) ────────────────────────────────
  const buildBricks = useCallback(() => {
    const bricks: Brick[] = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks.push({
          col, row,
          x: BRICK_START_X + col * (BRICK_W + BRICK_PAD),
          y: BRICK_START_Y + row * (BRICK_H + BRICK_PAD),
          color: ROW_COLORS[row % ROW_COLORS.length],
          alive: true,
          hits: 0,
          cracked: false,
          hitT: 0,
          hitCooldown: 0,
          sparkles: [],
        });
      }
    }
    bricksRef.current = bricks;
  }, []);

  const resetBall = useCallback(() => {
    const px = paddleRef.current.x;
    ballRef.current = { x: px, y: PADDLE_Y - BALL_R - 2, vx: 0, vy: 0, launched: false };
    phaseRef.current = "ready";
  }, []);

  const launchBall = useCallback(() => {
    const speed = BALL_SPEED_BASE + levelRef.current * 18;
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
    ballRef.current.vx = Math.cos(angle) * speed;
    ballRef.current.vy = Math.sin(angle) * speed;
    ballRef.current.launched = true;
    phaseRef.current = "playing";
  }, []);

  const spawnBgStars = useCallback(() => {
    bgStarsRef.current = Array.from({ length: 40 }, () => ({
      x: Math.random() * CW, y: Math.random() * CH,
      r: 0.8 + Math.random() * 1.8,
      alpha: 0.2 + Math.random() * 0.6,
      t: Math.random() * Math.PI * 2,
    }));
  }, []);

  const startGame = useCallback(() => {
    scoreRef.current = 0;
    livesRef.current = 3;
    levelRef.current = 1;
    timerRef.current = 90;
    timerAccRef.current = 0;
    comboRef.current = 0;
    shakeRef.current = 0;
    floatTextsRef.current = [];
    trailRef.current = [];
    paddleRef.current = { x: CW / 2, w: PADDLE_W_BASE, powerT: 0 };
    mouseTRef.current = CW / 2;
    buildBricks();
    spawnBgStars();
    resetBall();
    rerender();
  }, [buildBricks, resetBall, spawnBgStars, rerender]);

  const addSparkles = (b: Brick) => {
    const count = 18;
    b.sparkles = Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const spd = 80 + Math.random() * 180;
      return {
        x: b.x + BRICK_W / 2, y: b.y + BRICK_H / 2,
        vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
        alpha: 1, r: 3 + Math.random() * 5, color: b.color.glow,
      };
    });
  };

  // ── Input ─────────────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseTRef.current = (e.clientX - rect.left) * (CW / rect.width);
  }, []);

  const handleClick = useCallback(() => {
    if (phaseRef.current === "idle") { startGame(); return; }
    if (phaseRef.current === "dead") { startGame(); return; }
    if (phaseRef.current === "ready") { launchBall(); return; }
  }, [startGame, launchBall]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseTRef.current = (e.touches[0].clientX - rect.left) * (CW / rect.width);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseTRef.current = (e.touches[0].clientX - rect.left) * (CW / rect.width);
    if (phaseRef.current === "idle") { startGame(); return; }
    if (phaseRef.current === "dead") { startGame(); return; }
    if (phaseRef.current === "ready") { launchBall(); return; }
  }, [startGame, launchBall]);

  // ── Main loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    spawnBgStars();

    const loop = (ts: number) => {
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05);
      lastRef.current = ts;
      if (guruQuiz.isPausedRef.current) { rafRef.current = requestAnimationFrame(loop); return; }
      hueRef.current = (hueRef.current + dt * 22) % 360;
      const hue = hueRef.current;

      const phase = phaseRef.current;

      // ── Update paddle ──────────────────────────────────────────────────
      const paddle = paddleRef.current;
      // Button hold: nudge target X smoothly while a control button is pressed.
      if (holdLeftRef.current) mouseTRef.current -= BUTTON_SPEED * dt;
      if (holdRightRef.current) mouseTRef.current += BUTTON_SPEED * dt;
      mouseTRef.current = Math.max(paddle.w / 2, Math.min(CW - paddle.w / 2, mouseTRef.current));
      const targetX = mouseTRef.current;
      paddle.x += (targetX - paddle.x) * Math.min(1, dt * 18);
      if (paddle.powerT > 0) paddle.powerT = Math.max(0, paddle.powerT - dt);

      // ── Timer & update ─────────────────────────────────────────────────
      if (phase === "playing") {
        timerAccRef.current += dt;
        if (timerAccRef.current >= 1) {
          timerAccRef.current -= 1;
          timerRef.current--;
          if (timerRef.current <= 0) { timerRef.current = 0; phaseRef.current = "dead"; rerender(); }
        }
        if (shakeRef.current > 0) shakeRef.current = Math.max(0, shakeRef.current - dt * 2.5);

        // ── Ball physics ───────────────────────────────────────────────
        const ball = ballRef.current;
        if (ball.launched) {
          const spd = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
          const targetSpd = BALL_SPEED_BASE + levelRef.current * 18;
          if (spd < targetSpd * 0.95) {
            ball.vx *= targetSpd / spd;
            ball.vy *= targetSpd / spd;
          }

          ball.x += ball.vx * dt;
          ball.y += ball.vy * dt;

          // wall bounce
          if (ball.x - BALL_R < 0) { ball.x = BALL_R; ball.vx = Math.abs(ball.vx); }
          if (ball.x + BALL_R > CW) { ball.x = CW - BALL_R; ball.vx = -Math.abs(ball.vx); }
          if (ball.y - BALL_R < 0) { ball.y = BALL_R; ball.vy = Math.abs(ball.vy); }

          // ── Fire trail ── spawn flame particles trailing behind the ball
          // Direction *opposite* to motion (so flames stream behind it).
          const speed = Math.hypot(ball.vx, ball.vy);
          if (speed > 1) {
            const dirX = -ball.vx / speed;
            const dirY = -ball.vy / speed;
            // emit 3 fresh flame particles per frame
            for (let k = 0; k < 3; k++) {
              const spread = 0.6;
              const ang = Math.atan2(dirY, dirX) + (Math.random() - 0.5) * spread;
              const sp = 30 + Math.random() * 70;
              const offsetT = k * 0.35; // slight stagger so the tail looks long
              trailRef.current.push({
                x: ball.x + dirX * (BALL_R * 0.6) + (Math.random() - 0.5) * 4,
                y: ball.y + dirY * (BALL_R * 0.6) + (Math.random() - 0.5) * 4,
                vx: Math.cos(ang) * sp + ball.vx * 0.15,
                vy: Math.sin(ang) * sp + ball.vy * 0.15 - 30, // buoyancy: flames rise
                life: 0.55 - offsetT * 0.05,
                maxLife: 0.55 - offsetT * 0.05,
                r: BALL_R * (0.85 + Math.random() * 0.45),
              });
            }
          }
          // hard cap so the array doesn't grow without bound
          if (trailRef.current.length > 220) {
            trailRef.current.splice(0, trailRef.current.length - 220);
          }
          // tick existing flame particles: drift, rise, shrink, cool down
          for (const t of trailRef.current) {
            t.x += t.vx * dt;
            t.y += t.vy * dt;
            t.vy -= 90 * dt;       // continued upward acceleration (heat rises)
            t.vx *= 0.94;          // air drag
            t.life -= dt;
            t.r *= 0.965;          // shrink as it cools
          }
          trailRef.current = trailRef.current.filter(t => t.life > 0 && t.r > 0.5);

          // paddle collision
          const halfW = paddle.w / 2;
          if (
            ball.y + BALL_R >= PADDLE_Y - PADDLE_H / 2 &&
            ball.y + BALL_R <= PADDLE_Y + PADDLE_H / 2 + 4 &&
            ball.x >= paddle.x - halfW - BALL_R &&
            ball.x <= paddle.x + halfW + BALL_R &&
            ball.vy > 0
          ) {
            const rel = (ball.x - paddle.x) / halfW; // -1 to 1
            const angle = rel * (Math.PI / 3);        // ±60°
            const spd2 = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
            ball.vx = Math.sin(angle) * spd2;
            ball.vy = -Math.abs(Math.cos(angle) * spd2);
            ball.y = PADDLE_Y - PADDLE_H / 2 - BALL_R;
            playPopSound();
          }

          // ball lost
          if (ball.y - BALL_R > CH) {
            comboRef.current = 0;
            livesRef.current--;
            shakeRef.current = 0.5;
            floatTextsRef.current.push({ x: CW / 2, y: CH - 80, txt: "💨 Bola Jatuh!", alpha: 1, vy: -60, good: false });
            if (livesRef.current <= 0) {
              phaseRef.current = "dead";
              rerender();
            } else {
              resetBall();
            }
          }

          // ── Brick collisions ─────────────────────────────────────────
          for (const b of bricksRef.current) {
            if (!b.alive) continue;
            const bx = b.x, by = b.y, bw = BRICK_W, bh = BRICK_H;
            // AABB with ball
            const nearX = Math.max(bx, Math.min(ball.x, bx + bw));
            const nearY = Math.max(by, Math.min(ball.y, by + bh));
            const dx = ball.x - nearX, dy = ball.y - nearY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < BALL_R) {
              // determine bounce axis & push ball outside the brick
              const overlapX = ball.x < bx ? ball.x - bx : ball.x > bx + bw ? ball.x - (bx + bw) : 0;
              const overlapY = ball.y < by ? ball.y - by : ball.y > by + bh ? ball.y - (by + bh) : 0;
              if (Math.abs(overlapX) > Math.abs(overlapY)) {
                ball.vx = -ball.vx;
                ball.x += overlapX > 0 ? (BALL_R - Math.abs(dx)) : -(BALL_R - Math.abs(dx));
              } else {
                ball.vy = -ball.vy;
                ball.y += overlapY > 0 ? (BALL_R - Math.abs(dy)) : -(BALL_R - Math.abs(dy));
              }

              // Skip the hit-counter logic if this brick was just hit a moment
              // ago (avoids the ball registering 2 hits across consecutive frames
              // while still inside the brick).
              if (b.hitCooldown > 0) {
                break;
              }

              b.hits++;
              b.hitT = 1;
              b.hitCooldown = 0.18;
              playPopSound();

              if (b.hits < 2) {
                // First hit — brick cracks but stays alive.
                b.cracked = true;
                floatTextsRef.current.push({
                  x: b.x + BRICK_W / 2, y: b.y,
                  txt: "💥", alpha: 1, vy: -70, good: true,
                });
              } else {
                // Second hit — brick opens / breaks.
                comboRef.current++;
                const pts = 10 * comboRef.current * levelRef.current;
                scoreRef.current += pts;
                if (scoreRef.current > bestRef.current) bestRef.current = scoreRef.current;
                addSparkles(b);
                b.alive = false;
                levelRef.current = Math.floor(scoreRef.current / 200) + 1;
                timerRef.current = Math.min(timerRef.current + 2, 90);
                paddle.w = Math.min(PADDLE_W_BASE + 18, 140);
                paddle.powerT = 2.5;
                floatTextsRef.current.push({
                  x: b.x + BRICK_W / 2, y: b.y,
                  txt: `+${pts}${comboRef.current > 1 ? ` 🔥×${comboRef.current}` : ""}`,
                  alpha: 1, vy: -90, good: true,
                });
                // If every brick is cleared, give a bonus and rebuild a fresh wall.
                const remaining = bricksRef.current.filter(br => br.alive).length;
                if (remaining === 0) {
                  scoreRef.current += 200;
                  timerRef.current = Math.min(timerRef.current + 15, 90);
                  floatTextsRef.current.push({
                    x: CW / 2, y: CH / 2,
                    txt: "💎 BONUS LANTAI BERSIH +200!",
                    alpha: 1, vy: -50, good: true,
                  });
                  setTimeout(() => {
                    if (phaseRef.current !== "playing" && phaseRef.current !== "ready") return;
                    buildBricks();
                    rerender();
                  }, 600);
                }
              }
              break;
            }
          }
        } else {
          // ball follows paddle when not launched
          const ball = ballRef.current;
          ball.x = paddle.x;
          ball.y = PADDLE_Y - BALL_R - PADDLE_H / 2 - 2;
        }
      }

      // ── Update bricks ──────────────────────────────────────────────────
      for (const b of bricksRef.current) {
        if (b.hitT > 0) b.hitT = Math.max(0, b.hitT - dt * 3);
        if (b.hitCooldown > 0) b.hitCooldown = Math.max(0, b.hitCooldown - dt);
        for (const s of b.sparkles) {
          s.x += s.vx * dt; s.y += s.vy * dt;
          s.vy += 200 * dt;
          s.alpha -= dt * 2.2;
          s.r *= 0.97;
        }
        b.sparkles = b.sparkles.filter(s => s.alpha > 0);
      }

      // ── Update float texts ─────────────────────────────────────────────
      for (const f of floatTextsRef.current) { f.y += f.vy * dt; f.alpha -= dt * 1.4; }
      floatTextsRef.current = floatTextsRef.current.filter(f => f.alpha > 0);

      // ── Draw ──────────────────────────────────────────────────────────
      const sx = shakeRef.current > 0 ? (Math.random() - 0.5) * shakeRef.current * 12 : 0;
      const sy = shakeRef.current > 0 ? (Math.random() - 0.5) * shakeRef.current * 5 : 0;
      ctx.save();
      ctx.translate(sx, sy);

      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, CW, CH);
      bgGrad.addColorStop(0, `hsl(${hue}, 60%, 6%)`);
      bgGrad.addColorStop(0.5, `hsl(${(hue + 70) % 360}, 55%, 8%)`);
      bgGrad.addColorStop(1, `hsl(${(hue + 140) % 360}, 60%, 6%)`);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, CW, CH);

      // Background stars
      for (const s of bgStarsRef.current) {
        s.t += dt * 1.2;
        const a = s.alpha * (0.5 + 0.5 * Math.sin(s.t));
        ctx.globalAlpha = a;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Neon grid lines (decorative)
      ctx.globalAlpha = 0.05;
      ctx.strokeStyle = `hsl(${hue}, 100%, 70%)`;
      ctx.lineWidth = 1;
      for (let x = 0; x < CW; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke();
      }
      for (let y = 0; y < CH; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // HUD bar (compact — no math question, just stats)
      const HUD_H = 44;
      const barGrad = ctx.createLinearGradient(0, 0, CW, 0);
      barGrad.addColorStop(0, "rgba(5,5,20,0.92)");
      barGrad.addColorStop(1, "rgba(10,3,30,0.92)");
      ctx.fillStyle = barGrad;
      ctx.fillRect(0, 0, CW, HUD_H);

      if (phase === "playing" || phase === "ready") {
        ctx.textBaseline = "middle";
        ctx.font = "bold 13px 'Orbitron', monospace";

        ctx.textAlign = "left";
        ctx.fillStyle = "#ffc94a"; ctx.shadowBlur = 10; ctx.shadowColor = "#ffc94a";
        ctx.fillText(`⭐ ${scoreRef.current}`, 10, 18);

        ctx.textAlign = "center";
        ctx.fillStyle = `hsl(${(hue + 60) % 360}, 100%, 75%)`;
        ctx.shadowColor = `hsl(${(hue + 60) % 360}, 100%, 60%)`;
        ctx.fillText(`LEVEL ${levelRef.current}`, CW / 2, 18);

        ctx.textAlign = "right";
        ctx.fillStyle = "#ff5e87"; ctx.shadowColor = "#ff5e87";
        ctx.fillText(`❤️ ${"♥".repeat(Math.max(0, livesRef.current))}`, CW - 10, 18);
        ctx.shadowBlur = 0;

        // Timer bar
        const tFrac = Math.max(0, Math.min(1, timerRef.current / 90));
        const tCol = `hsl(${tFrac * 120}, 100%, 55%)`;
        ctx.fillStyle = "rgba(255,255,255,0.07)";
        ctx.fillRect(0, HUD_H - 5, CW, 5);
        ctx.fillStyle = tCol; ctx.shadowBlur = 8; ctx.shadowColor = tCol;
        ctx.fillRect(0, HUD_H - 5, CW * tFrac, 5);
        ctx.shadowBlur = 0;
      }

      // ── Bricks ──────────────────────────────────────────────────────────
      for (const b of bricksRef.current) {
        if (!b.alive && b.sparkles.length === 0) continue;

        // Sparkles (even after brick dies)
        for (const s of b.sparkles) {
          ctx.globalAlpha = Math.max(0, s.alpha);
          ctx.fillStyle = s.color;
          ctx.shadowBlur = 10; ctx.shadowColor = s.color;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;

        if (!b.alive) continue;

        // hit pop scale animation
        const scale = 1 + b.hitT * 0.08;
        const cx2 = b.x + BRICK_W / 2, cy2 = b.y + BRICK_H / 2;

        // Deterministic seeded random for this crystal (stable per cell)
        const seed = (b.col * 73 + b.row * 137 + 19) | 0;
        const rndA = (i: number) => {
          const v = Math.sin(seed * 9301 + i * 49297) * 233280;
          return v - Math.floor(v);
        };

        // ── Build a faceted crystal silhouette ───────────────────────────
        // Hexagonal-ish gem with subtle per-asteroid variation, slow
        // rotation gives a gentle "floating crystal" feel.
        const halfBW = BRICK_W * 0.48;
        const halfBH = BRICK_H * 0.48;
        const rotation = (rndA(3) - 0.5) * 0.6 + Math.sin(ts / 2400 + seed) * 0.04;
        const N = 8;
        const points: { x: number; y: number }[] = [];
        for (let i = 0; i < N; i++) {
          const a = (i / N) * Math.PI * 2 + rotation;
          const jitter = 0.92 + rndA(i + 11) * 0.16;
          points.push({
            x: Math.cos(a) * halfBW * jitter,
            y: Math.sin(a) * halfBH * jitter,
          });
        }

        ctx.save();
        ctx.translate(cx2, cy2);
        ctx.scale(scale, scale);

        // Crystal silhouette path (sharp facet edges — lines, not curves)
        const tracePath = () => {
          ctx.beginPath();
          for (let i = 0; i < points.length; i++) {
            const p = points[i];
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();
        };

        // ── Outer halo glow (soft colored aura around the gem) ──────────
        ctx.save();
        const haloPulse = 0.85 + 0.15 * Math.sin(ts / 600 + seed);
        const haloR = Math.max(halfBW, halfBH) * 1.55 * haloPulse;
        const halo = ctx.createRadialGradient(0, 0, halfBW * 0.4, 0, 0, haloR);
        halo.addColorStop(0,   hexToRgba(b.color.glow, 0.55));
        halo.addColorStop(0.45, hexToRgba(b.color.glow, 0.20));
        halo.addColorStop(1,   hexToRgba(b.color.glow, 0));
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(0, 0, haloR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // ── Drop shadow under the gem ───────────────────────────────────
        ctx.save();
        ctx.shadowBlur = 14 + b.hitT * 16;
        ctx.shadowColor = hexToRgba(b.color.glow, 0.85);
        ctx.shadowOffsetY = 3;

        // Vibrant gem body — bright color with deep saturated core
        const bodyGrad = ctx.createRadialGradient(
          -halfBW * 0.30, -halfBH * 0.45, halfBW * 0.05,
          0, 0, Math.max(halfBW, halfBH) * 1.25
        );
        bodyGrad.addColorStop(0,    "#ffffff");
        bodyGrad.addColorStop(0.18, mixColor("#ffffff", b.color.fill, 0.55));
        bodyGrad.addColorStop(0.55, b.color.fill);
        bodyGrad.addColorStop(1,    mixColor(b.color.fill, "#1a0030", 0.80));
        ctx.fillStyle = bodyGrad;
        tracePath();
        ctx.fill();
        ctx.restore();

        // ── Inner facets (clipped to crystal silhouette) ────────────────
        ctx.save();
        tracePath();
        ctx.clip();

        // Lit facets — connect adjacent vertices to the centre, then fill
        // each triangle with a slight shading variation. This produces the
        // gem-like faceted look.
        for (let i = 0; i < points.length; i++) {
          const p1 = points[i];
          const p2 = points[(i + 1) % points.length];
          const cxF = (p1.x + p2.x) / 3;
          const cyF = (p1.y + p2.y) / 3;
          // Brighter on facets pointing toward the upper-left light
          const dirLight = (-cxF - cyF) / (halfBW + halfBH);
          const lit = Math.max(0, Math.min(1, dirLight * 0.8 + 0.5));

          const facetGrad = ctx.createLinearGradient(0, 0, cxF, cyF);
          facetGrad.addColorStop(0, `rgba(255,255,255,${0.20 * lit})`);
          facetGrad.addColorStop(1, `rgba(0,0,0,${0.18 * (1 - lit)})`);
          ctx.fillStyle = facetGrad;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.closePath();
          ctx.fill();

          // Crisp facet edge from center to vertex
          ctx.strokeStyle = `rgba(255,255,255,${0.18 * lit + 0.05})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }

        // Bright specular wedge on the upper-left
        const sparkleGrad = ctx.createRadialGradient(
          -halfBW * 0.45, -halfBH * 0.55, 0,
          -halfBW * 0.45, -halfBH * 0.55, halfBW * 0.85
        );
        sparkleGrad.addColorStop(0,   "rgba(255,255,255,0.85)");
        sparkleGrad.addColorStop(0.45, "rgba(255,255,255,0.20)");
        sparkleGrad.addColorStop(1,   "rgba(255,255,255,0)");
        ctx.fillStyle = sparkleGrad;
        ctx.fillRect(-BRICK_W, -BRICK_H, BRICK_W * 2, BRICK_H * 2);

        // Twinkling 4-point sparkle stars on the surface
        const twinkleT = ts / 1000;
        const sparkles: [number, number, number, number][] = [
          [-halfBW * 0.40, -halfBH * 0.45, 0.0, 1.6],
          [ halfBW * 0.30, -halfBH * 0.15, 1.3, 1.0],
          [-halfBW * 0.10,  halfBH * 0.30, 2.1, 1.2],
        ];
        for (const [sx, sy, phase2, sz] of sparkles) {
          const a = 0.55 + 0.45 * Math.sin(twinkleT * 3 + phase2 + seed * 0.1);
          if (a < 0.05) continue;
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.beginPath();
          ctx.moveTo(0, -sz * 2.2);
          ctx.lineTo(sz * 0.5, 0);
          ctx.lineTo(0, sz * 2.2);
          ctx.lineTo(-sz * 0.5, 0);
          ctx.closePath();
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-sz * 2.2, 0);
          ctx.lineTo(0, sz * 0.5);
          ctx.lineTo(sz * 2.2, 0);
          ctx.lineTo(0, -sz * 0.5);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // ── Cracked overlay after first hit ─────────────────────────────
        // Inner light leaks out as a brighter, prismatic glow.
        if (b.cracked) {
          ctx.save();
          ctx.shadowBlur = 14;
          ctx.shadowColor = hexToRgba(b.color.glow, 0.95);

          ctx.strokeStyle = "rgba(255,255,255,0.85)";
          ctx.lineWidth = 1.1;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          ctx.moveTo(-halfBW * 0.55, -halfBH * 0.40);
          ctx.lineTo(-halfBW * 0.20, -halfBH * 0.10);
          ctx.lineTo( halfBW * 0.05,  halfBH * 0.10);
          ctx.lineTo(-halfBW * 0.20,  halfBH * 0.45);
          ctx.lineTo( halfBW * 0.10,  halfBH * 0.65);
          ctx.moveTo( halfBW * 0.05,  halfBH * 0.10);
          ctx.lineTo( halfBW * 0.35, -halfBH * 0.05);
          ctx.lineTo( halfBW * 0.60,  halfBH * 0.35);
          ctx.stroke();

          // Bright spark at each crack junction
          ctx.fillStyle = "rgba(255,255,255,0.95)";
          ctx.beginPath();
          ctx.arc( halfBW * 0.05, halfBH * 0.10, 1.6, 0, Math.PI * 2);
          ctx.arc(-halfBW * 0.20, -halfBH * 0.10, 1.2, 0, Math.PI * 2);
          ctx.arc( halfBW * 0.35, -halfBH * 0.05, 1.0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();

        // ── Crisp colored facet outline ─────────────────────────────────
        ctx.strokeStyle = mixColor(b.color.fill, "#ffffff", 0.55);
        ctx.lineWidth = 1.1;
        ctx.shadowBlur = 8;
        ctx.shadowColor = hexToRgba(b.color.glow, 0.9);
        tracePath();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.restore();
      }

      // ── Fire trail ───────────────────────────────────────────────────────
      // Use additive blending so overlapping flames build to white-hot cores.
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const t of trailRef.current) {
        // ratio: 1 = freshly spawned (hot), 0 = about to die (cool smoke)
        const ratio = Math.max(0, Math.min(1, t.life / t.maxLife));

        // Compute flame color (r,g,b) by interpolating along a hot→cool ramp:
        //   ratio 1.00 → white-hot         (255, 250, 210)
        //   ratio 0.70 → bright yellow     (255, 220,  80)
        //   ratio 0.45 → vivid orange      (255, 130,   0)
        //   ratio 0.20 → deep red          (220,  30,   0)
        //   ratio 0.00 → dark smoke        ( 30,  15,  10)
        let r: number, g: number, b: number;
        if (ratio > 0.7) {
          const k = (ratio - 0.7) / 0.3;       // 0..1 from yellow → white
          r = 255;
          g = Math.round(220 + 30 * k);
          b = Math.round(80 + 130 * k);
        } else if (ratio > 0.45) {
          const k = (ratio - 0.45) / 0.25;     // orange → yellow
          r = 255;
          g = Math.round(130 + 90 * k);
          b = Math.round(0 + 80 * k);
        } else if (ratio > 0.2) {
          const k = (ratio - 0.2) / 0.25;      // red → orange
          r = Math.round(220 + 35 * k);
          g = Math.round(30 + 100 * k);
          b = 0;
        } else {
          const k = ratio / 0.2;               // smoke → red
          r = Math.round(30 + 190 * k);
          g = Math.round(15 + 15 * k);
          b = Math.round(10 - 10 * k);
        }

        // Soft glow halo per particle
        const glowR = t.r * (1.2 + ratio * 0.7);
        const coreA = Math.min(1, ratio * 1.1 + 0.05);
        const midA = coreA * 0.55;
        const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, glowR);
        grad.addColorStop(0,    `rgba(${r},${g},${b},${coreA})`);
        grad.addColorStop(0.45, `rgba(${r},${g},${b},${midA})`);
        grad.addColorStop(1,    `rgba(${r},${g},${b},0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(t.x, t.y, glowR, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // ── Ball (burning fireball) ───────────────────────────────────────
      if (phase === "playing" || phase === "ready") {
        const ball = ballRef.current;

        // Soft warm contact shadow on the floor (under the ball)
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = "rgba(40,0,0,0.6)";
        ctx.beginPath();
        ctx.ellipse(ball.x, ball.y + BALL_R + 1, BALL_R * 0.9, BALL_R * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Outer flickering aura (additive) — uses time for shimmer
        const tSec = ts / 1000;
        const flicker = 0.85 + Math.sin(tSec * 22) * 0.08 + Math.sin(tSec * 47) * 0.06;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const auraR = BALL_R * (2.4 * flicker);
        const aura = ctx.createRadialGradient(ball.x, ball.y, BALL_R * 0.4, ball.x, ball.y, auraR);
        aura.addColorStop(0,   "rgba(255,230,140,0.85)");
        aura.addColorStop(0.35, "rgba(255,140,30,0.55)");
        aura.addColorStop(0.7, "rgba(255,60,0,0.25)");
        aura.addColorStop(1,   "rgba(255,40,0,0)");
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, auraR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Drop-shadow glow under the sphere
        ctx.shadowBlur = 28;
        ctx.shadowColor = "rgba(255,140,30,0.95)";

        // Meteor body — molten rocky core wrapped in fire
        const ballGrad = ctx.createRadialGradient(
          ball.x - BALL_R * 0.25, ball.y - BALL_R * 0.25, BALL_R * 0.05,
          ball.x, ball.y, BALL_R
        );
        ballGrad.addColorStop(0,    "#fffbe8");
        ballGrad.addColorStop(0.20, "#ffd06a");
        ballGrad.addColorStop(0.45, "#ff8a30");
        ballGrad.addColorStop(0.72, "#c43108");
        ballGrad.addColorStop(1,    "#3a0a02");  // dark rocky rim
        ctx.fillStyle = ballGrad;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Rocky surface specks — small dark spots embedded in the meteor
        ctx.save();
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = "rgba(20,5,0,0.55)";
        const speckPositions: [number, number, number][] = [
          [0.20, 0.10, 1.4],
          [-0.15, 0.35, 1.2],
          [0.40, -0.20, 1.0],
          [-0.30, -0.10, 0.9],
          [0.10, 0.45, 0.8],
        ];
        for (const [dx, dy, sr] of speckPositions) {
          ctx.beginPath();
          ctx.arc(ball.x + BALL_R * dx, ball.y + BALL_R * dy, sr, 0, Math.PI * 2);
          ctx.fill();
        }
        // Faint glowing fissures on the surface
        ctx.strokeStyle = "rgba(255,180,60,0.55)";
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(ball.x - BALL_R * 0.55, ball.y + BALL_R * 0.05);
        ctx.lineTo(ball.x - BALL_R * 0.10, ball.y + BALL_R * 0.30);
        ctx.lineTo(ball.x + BALL_R * 0.30, ball.y + BALL_R * 0.55);
        ctx.stroke();
        ctx.restore();

        // White-hot specular spot
        ctx.fillStyle = "rgba(255,255,240,0.9)";
        ctx.beginPath();
        ctx.ellipse(ball.x - BALL_R * 0.35, ball.y - BALL_R * 0.4, BALL_R * 0.28, BALL_R * 0.2, -0.5, 0, Math.PI * 2);
        ctx.fill();

        // Tiny bright pinpoint
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.beginPath();
        ctx.arc(ball.x - BALL_R * 0.45, ball.y - BALL_R * 0.5, BALL_R * 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Bottom rim ember glow (ambient bounce light)
        ctx.strokeStyle = "rgba(255,180,60,0.6)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_R - 0.5, Math.PI * 0.15, Math.PI * 0.85);
        ctx.stroke();
      }

      // ── Paddle (sleek spaceship / alat luar angkasa) ──────────────────
      if (phase === "playing" || phase === "ready") {
        const paddle = paddleRef.current;
        const isPowered = paddle.powerT > 0;
        const pHue = isPowered ? (hue + 40) % 360 : 195; // cyan ship by default, shifts when powered
        const cxS = paddle.x;
        const cyS = PADDLE_Y;
        const halfW = paddle.w / 2;
        const noseY = cyS - PADDLE_H / 2 - 7;   // pointed bow extends above
        const tailY = cyS + PADDLE_H / 2;       // engines exit at tail
        const wingY = cyS + 1;

        // ── Hover shadow under the ship ────────────────────────────────
        ctx.save();
        ctx.globalAlpha = 0.32;
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.beginPath();
        ctx.ellipse(cxS, tailY + 5, halfW * 0.95, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // ── Twin engine thruster flames ─────────────────────────────────
        const fT = ts / 1000;
        const flameLen = 11 + Math.sin(fT * 14) * 2.5 + (isPowered ? 7 : 0);
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (const offX of [-halfW * 0.45, halfW * 0.45]) {
          const fx = cxS + offX;
          const fy = tailY + flameLen * 0.45;
          const grd = ctx.createRadialGradient(fx, fy, 0, fx, fy, flameLen);
          grd.addColorStop(0,   "rgba(255,255,220,0.95)");
          grd.addColorStop(0.35, `hsla(${pHue}, 100%, 70%, 0.75)`);
          grd.addColorStop(1,   `hsla(${pHue}, 100%, 50%, 0)`);
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.ellipse(fx, fy, 4.2, flameLen, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Helper: trace the spaceship hull silhouette
        const traceShip = () => {
          ctx.beginPath();
          ctx.moveTo(cxS, noseY);
          ctx.quadraticCurveTo(cxS + halfW * 0.42, noseY + 4, cxS + halfW * 0.55, wingY);
          ctx.lineTo(cxS + halfW, wingY + 2);                   // right wing tip
          ctx.lineTo(cxS + halfW * 0.92, tailY);
          ctx.lineTo(cxS + halfW * 0.55, tailY);                // right engine block
          ctx.lineTo(cxS + halfW * 0.35, tailY - 1);
          ctx.lineTo(cxS - halfW * 0.35, tailY - 1);
          ctx.lineTo(cxS - halfW * 0.55, tailY);                // left engine block
          ctx.lineTo(cxS - halfW * 0.92, tailY);
          ctx.lineTo(cxS - halfW, wingY + 2);                   // left wing tip
          ctx.lineTo(cxS - halfW * 0.55, wingY);
          ctx.quadraticCurveTo(cxS - halfW * 0.42, noseY + 4, cxS, noseY);
          ctx.closePath();
        };

        // ── Hull glow ───────────────────────────────────────────────────
        ctx.shadowBlur = isPowered ? 26 : 14;
        ctx.shadowColor = `hsl(${pHue}, 100%, 60%)`;

        // Hull body — chrome blue/cyan with vertical gradient
        const hullGrad = ctx.createLinearGradient(0, noseY, 0, tailY);
        hullGrad.addColorStop(0,    `hsl(${pHue}, 50%, 92%)`);
        hullGrad.addColorStop(0.35, `hsl(${pHue}, 70%, 65%)`);
        hullGrad.addColorStop(0.7,  `hsl(${pHue}, 80%, 38%)`);
        hullGrad.addColorStop(1,    `hsl(${pHue}, 85%, 22%)`);
        ctx.fillStyle = hullGrad;
        traceShip();
        ctx.fill();
        ctx.shadowBlur = 0;

        // ── Side darkening (volumetric edge falloff) ───────────────────
        ctx.save();
        traceShip();
        ctx.clip();
        const sideGrad = ctx.createLinearGradient(cxS - halfW, 0, cxS + halfW, 0);
        sideGrad.addColorStop(0,    "rgba(0,0,0,0.45)");
        sideGrad.addColorStop(0.18, "rgba(0,0,0,0)");
        sideGrad.addColorStop(0.82, "rgba(0,0,0,0)");
        sideGrad.addColorStop(1,    "rgba(0,0,0,0.45)");
        ctx.fillStyle = sideGrad;
        ctx.fillRect(cxS - halfW - 4, noseY - 4, paddle.w + 8, (tailY - noseY) + 8);

        // Centerline highlight strip down the spine
        const spineGrad = ctx.createLinearGradient(0, noseY, 0, tailY);
        spineGrad.addColorStop(0, "rgba(255,255,255,0.85)");
        spineGrad.addColorStop(0.6, "rgba(255,255,255,0.15)");
        spineGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = spineGrad;
        ctx.beginPath();
        ctx.moveTo(cxS, noseY);
        ctx.quadraticCurveTo(cxS + 3.5, cyS, cxS + 1.5, tailY - 1);
        ctx.lineTo(cxS - 1.5, tailY - 1);
        ctx.quadraticCurveTo(cxS - 3.5, cyS, cxS, noseY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // ── Cockpit dome (glowing canopy) ──────────────────────────────
        const cockpitR = PADDLE_H * 0.7;
        const ckGrad = ctx.createRadialGradient(cxS - 1.5, cyS - 2, 1, cxS, cyS - 1, cockpitR);
        ckGrad.addColorStop(0,   "rgba(230,255,255,0.95)");
        ckGrad.addColorStop(0.45, `hsla(${(pHue + 25) % 360}, 100%, 75%, 0.85)`);
        ckGrad.addColorStop(1,   `hsla(${pHue}, 100%, 28%, 0.95)`);
        ctx.fillStyle = ckGrad;
        ctx.beginPath();
        ctx.ellipse(cxS, cyS - 1, cockpitR * 0.85, cockpitR * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();
        // Cockpit reflection glint
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.beginPath();
        ctx.ellipse(cxS - cockpitR * 0.35, cyS - cockpitR * 0.35, cockpitR * 0.18, cockpitR * 0.1, -0.5, 0, Math.PI * 2);
        ctx.fill();

        // ── Wing tip navigation lights (blink red ⇄ green) ─────────────
        const blink = (Math.sin(ts / 200) + 1) * 0.5;
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(255,40,40,0.95)";
        ctx.fillStyle = `rgba(255,90,90,${0.45 + blink * 0.55})`;
        ctx.beginPath();
        ctx.arc(cxS - halfW + 2, wingY + 2, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = "rgba(40,255,80,0.95)";
        ctx.fillStyle = `rgba(120,255,140,${0.45 + (1 - blink) * 0.55})`;
        ctx.beginPath();
        ctx.arc(cxS + halfW - 2, wingY + 2, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // ── Hull outline ───────────────────────────────────────────────
        ctx.strokeStyle = `hsla(${pHue}, 90%, 14%, 0.85)`;
        ctx.lineWidth = 1;
        traceShip();
        ctx.stroke();
      }

      // ── Float texts ─────────────────────────────────────────────────────
      for (const f of floatTextsRef.current) {
        ctx.globalAlpha = Math.max(0, f.alpha);
        ctx.font = "bold 18px 'Orbitron', monospace";
        ctx.textAlign = "center";
        ctx.shadowBlur = 14;
        ctx.shadowColor = f.good ? "#72f572" : "#ff5e87";
        ctx.fillStyle = f.good ? "#72f572" : "#ff5555";
        ctx.fillText(f.txt, f.x, f.y);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      // ── Ready hint ──────────────────────────────────────────────────────
      if (phase === "ready") {
        const pulse = 0.75 + 0.25 * Math.sin(ts / 350);
        ctx.globalAlpha = pulse;
        ctx.font = "bold 14px 'Orbitron', monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = `hsl(${hue}, 100%, 80%)`;
        ctx.shadowBlur = 16; ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        ctx.fillText("[ KLIK / TAP UNTUK LEMPAR BOLA ]", CW / 2, PADDLE_Y - 30);
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      }

      // ── Idle overlay ──────────────────────────────────────────────────────
      if (phase === "idle") {
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fillRect(0, 0, CW, CH);
        ctx.textAlign = "center"; ctx.textBaseline = "middle";

        ctx.font = "bold 11px 'Orbitron', monospace";
        ctx.fillStyle = `hsl(${hue}, 100%, 75%)`;
        ctx.shadowBlur = 14; ctx.shadowColor = `hsl(${hue}, 100%, 55%)`;
        ctx.fillText("MATH ARENA × NUMATIK AI", CW / 2, CH / 2 - 130);

        ctx.font = "bold 34px 'Orbitron', monospace";
        ctx.fillStyle = `hsl(${(hue + 60) % 360}, 100%, 80%)`;
        ctx.shadowBlur = 32; ctx.shadowColor = `hsl(${(hue + 60) % 360}, 100%, 60%)`;
        ctx.fillText("☄️ PECAH JAWABAN!", CW / 2, CH / 2 - 72);

        ctx.font = "13px 'Orbitron', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.shadowBlur = 0;
        [
          "Kemudikan pesawat dengan mouse / sentuhan!",
          "Pantulkan meteor untuk hancurkan asteroid 🌑",
          "Setiap asteroid pecah setelah 2× kena meteor",
          "Tiap 25 detik muncul Soal NUMATIK 🤖",
          "Combo = poin berlipat! 🔥",
        ].forEach((l, i) => ctx.fillText(l, CW / 2, CH / 2 - 4 + i * 22));

        ctx.font = "bold 17px 'Orbitron', monospace";
        ctx.fillStyle = `hsl(${hue}, 100%, 80%)`;
        ctx.shadowBlur = 20; ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        const pulse = 0.82 + 0.18 * Math.sin(ts / 310);
        ctx.globalAlpha = pulse;
        ctx.fillText("[ KLIK UNTUK MULAI ]", CW / 2, CH / 2 + 108);
        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      }

      // ── Dead overlay ──────────────────────────────────────────────────────
      if (phase === "dead") {
        ctx.fillStyle = "rgba(0,0,0,0.68)";
        ctx.fillRect(0, 0, CW, CH);
        ctx.textAlign = "center"; ctx.textBaseline = "middle";

        ctx.font = "bold 32px 'Orbitron', monospace";
        ctx.fillStyle = "#ff5e87"; ctx.shadowBlur = 30; ctx.shadowColor = "#ff5e87";
        ctx.fillText("GAME OVER", CW / 2, CH / 2 - 90);

        ctx.font = "bold 20px 'Orbitron', monospace";
        ctx.fillStyle = "#ffc94a"; ctx.shadowColor = "#ffc94a"; ctx.shadowBlur = 16;
        ctx.fillText(`Skor: ${scoreRef.current}`, CW / 2, CH / 2 - 38);

        ctx.font = "bold 16px 'Orbitron', monospace";
        ctx.fillStyle = "#72f572"; ctx.shadowColor = "#72f572"; ctx.shadowBlur = 12;
        ctx.fillText(`Rekor: ${bestRef.current}`, CW / 2, CH / 2 + 4);

        ctx.font = "13px 'Orbitron', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.shadowBlur = 0;
        ctx.fillText("Kamu luar biasa! Terus berlatih! 🌟", CW / 2, CH / 2 + 44);

        ctx.font = "bold 15px 'Orbitron', monospace";
        ctx.fillStyle = `hsl(${hue}, 100%, 80%)`;
        ctx.shadowBlur = 18; ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        const p2 = 0.82 + 0.18 * Math.sin(ts / 310);
        ctx.globalAlpha = p2;
        ctx.fillText("[ KLIK UNTUK MAIN LAGI ]", CW / 2, CH / 2 + 95);
        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [buildBricks, resetBall, spawnBgStars, rerender]);

  return (
    <div className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}

      {/* Top bar — always compact so portrait & landscape both fit */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-md px-3 pt-2 pb-1 shrink-0">
        <button
          onClick={() => { playPopSound(); navigate('/ruang-untuk-guru/numatik-game'); }}
          className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all text-sm"
          title="Menu Utama"
        >
          🏠
        </button>
        <span className="font-display text-sm text-accent">🧱 Pecah Jawaban</span>
        <button
          onClick={() => { playPopSound(); navigate(-1); }}
          className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all font-bold"
          title="Keluar"
        >
          ✕
        </button>
      </div>

      {/* Countdown chip: reserve a fixed slot so the canvas size doesn't jump */}
      <div className="relative z-10 h-9 flex items-center justify-center w-full px-3 shrink-0">
        {guruQuiz.isCountdownActive && (
          <div className="rounded-xl border border-cyan-400/60 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 px-3 py-1 flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(34,211,238,0.45)]">
            <img
              src="/numatik-ai-avatar.png"
              alt="NUMATIK"
              className="h-5 w-5 rounded-full object-cover ring-1 ring-cyan-300/70"
            />
            <span className="font-display text-[11px] sm:text-xs font-bold text-cyan-200 tracking-wide drop-shadow-[0_0_6px_rgba(34,211,238,0.55)]">
              SOAL NUMATIK ke-{guruQuiz.questionNumber + 1}/{guruQuiz.totalQuestions} dalam
            </span>
            <span
              className={`font-display text-sm sm:text-base font-black tabular-nums drop-shadow-[0_0_8px_rgba(34,211,238,0.85)] ${
                guruQuiz.secondsUntilNext <= 5 ? "text-red-300 animate-pulse" : "text-cyan-100"
              }`}
            >
              {guruQuiz.secondsUntilNext}s
            </span>
          </div>
        )}
      </div>

      {/* Canvas area — fills remaining space; scales preserving 7:10 aspect */}
      <div className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center px-2 pb-2">
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onTouchStart={handleTouchStart}
          style={{
            cursor: "none",
            borderRadius: 20,
            boxShadow: "0 0 40px rgba(130,80,255,0.45), 0 0 80px rgba(80,0,200,0.2)",
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "100%",
            aspectRatio: `${CW} / ${CH}`,
            objectFit: "contain",
            touchAction: "none",
          }}
        />
      </div>

      {/* On-screen control buttons — fixed at bottom-left for one-hand play */}
      {(phaseRef.current === "playing" || phaseRef.current === "ready") && (
        <div
          className="absolute z-20 bottom-3 left-3 flex items-center gap-2 select-none"
          style={{ touchAction: "none" }}
        >
          <button
            type="button"
            aria-label="Geser kiri"
            onPointerDown={(e) => { e.preventDefault(); (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId); holdLeftRef.current = true; }}
            onPointerUp={(e) => { holdLeftRef.current = false; try { (e.currentTarget as HTMLButtonElement).releasePointerCapture(e.pointerId); } catch {} }}
            onPointerCancel={() => { holdLeftRef.current = false; }}
            onPointerLeave={() => { holdLeftRef.current = false; }}
            onContextMenu={(e) => e.preventDefault()}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-white/30 to-white/10 backdrop-blur-md border-2 border-white/40 shadow-[0_4px_20px_rgba(130,80,255,0.5),inset_0_1px_0_rgba(255,255,255,0.5)] active:scale-95 active:from-white/50 active:to-white/20 transition-transform flex items-center justify-center text-white text-3xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          >
            ◀
          </button>
          <button
            type="button"
            aria-label="Geser kanan"
            onPointerDown={(e) => { e.preventDefault(); (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId); holdRightRef.current = true; }}
            onPointerUp={(e) => { holdRightRef.current = false; try { (e.currentTarget as HTMLButtonElement).releasePointerCapture(e.pointerId); } catch {} }}
            onPointerCancel={() => { holdRightRef.current = false; }}
            onPointerLeave={() => { holdRightRef.current = false; }}
            onContextMenu={(e) => e.preventDefault()}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-white/30 to-white/10 backdrop-blur-md border-2 border-white/40 shadow-[0_4px_20px_rgba(130,80,255,0.5),inset_0_1px_0_rgba(255,255,255,0.5)] active:scale-95 active:from-white/50 active:to-white/20 transition-transform flex items-center justify-center text-white text-3xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          >
            ▶
          </button>
        </div>
      )}

      <GuruQuizOverlay {...guruQuiz} />
    </div>
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Parse a hex color like "#ff5e87" into [r,g,b]
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

// Build a `rgba(...)` string from a hex color and alpha [0..1]
function hexToRgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Linearly mix two hex colors. t = 0 returns base, t = 1 returns tint.
function mixColor(base: string, tint: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(base);
  const [r2, g2, b2] = hexToRgb(tint);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

export default BrickBreakerPage;
