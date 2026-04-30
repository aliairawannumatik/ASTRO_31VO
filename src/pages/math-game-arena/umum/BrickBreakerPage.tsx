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
interface Trail { x: number; y: number; alpha: number; r: number }

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
      const targetX = Math.max(paddle.w / 2, Math.min(CW - paddle.w / 2, mouseTRef.current));
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

          // trail
          trailRef.current.push({ x: ball.x, y: ball.y, alpha: 0.5, r: BALL_R });
          if (trailRef.current.length > 18) trailRef.current.shift();
          for (const t of trailRef.current) { t.alpha -= dt * 4; t.r *= 0.96; }
          trailRef.current = trailRef.current.filter(t => t.alpha > 0);

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

        ctx.save();
        ctx.translate(cx2, cy2);
        ctx.scale(scale, scale);
        ctx.translate(-cx2, -cy2);

        ctx.shadowBlur = 8 + b.hitT * 14;
        ctx.shadowColor = b.color.glow;

        // brick body
        const brickGrad = ctx.createLinearGradient(b.x, b.y, b.x, b.y + BRICK_H);
        const fillColor = b.color.fill;
        brickGrad.addColorStop(0, lightenColor(fillColor, 0.35));
        brickGrad.addColorStop(0.5, fillColor);
        brickGrad.addColorStop(1, darkenColor(fillColor, 0.3));
        ctx.fillStyle = brickGrad;
        ctx.beginPath();
        roundRect(ctx, b.x + 1, b.y + 1, BRICK_W - 2, BRICK_H - 2, 5);
        ctx.fill();

        // top highlight
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.beginPath();
        roundRect(ctx, b.x + 2, b.y + 2, BRICK_W - 4, BRICK_H * 0.4, 3);
        ctx.fill();

        // border
        ctx.strokeStyle = "rgba(255,255,255,0.28)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        roundRect(ctx, b.x + 1, b.y + 1, BRICK_W - 2, BRICK_H - 2, 5);
        ctx.stroke();

        // crack overlay after first hit
        if (b.cracked) {
          ctx.strokeStyle = "rgba(0,0,0,0.7)";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(b.x + BRICK_W * 0.18, b.y + 3);
          ctx.lineTo(b.x + BRICK_W * 0.34, b.y + BRICK_H * 0.45);
          ctx.lineTo(b.x + BRICK_W * 0.24, b.y + BRICK_H * 0.7);
          ctx.lineTo(b.x + BRICK_W * 0.42, b.y + BRICK_H - 3);
          ctx.moveTo(b.x + BRICK_W * 0.7, b.y + 3);
          ctx.lineTo(b.x + BRICK_W * 0.56, b.y + BRICK_H * 0.5);
          ctx.lineTo(b.x + BRICK_W * 0.76, b.y + BRICK_H * 0.75);
          ctx.lineTo(b.x + BRICK_W * 0.64, b.y + BRICK_H - 3);
          ctx.stroke();
        }

        ctx.restore();
      }

      // ── Ball trail ───────────────────────────────────────────────────────
      for (let i = 0; i < trailRef.current.length; i++) {
        const t = trailRef.current[i];
        const frac = i / trailRef.current.length;
        ctx.globalAlpha = t.alpha * frac;
        ctx.fillStyle = `hsl(${(hue + frac * 60) % 360}, 100%, 70%)`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, Math.max(1, t.r * frac), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // ── Ball ───────────────────────────────────────────────────────────
      if (phase === "playing" || phase === "ready") {
        const ball = ballRef.current;
        const ballGrad = ctx.createRadialGradient(ball.x - BALL_R * 0.3, ball.y - BALL_R * 0.3, 1, ball.x, ball.y, BALL_R);
        ballGrad.addColorStop(0, "#ffffff");
        ballGrad.addColorStop(0.4, `hsl(${hue}, 100%, 75%)`);
        ballGrad.addColorStop(1, `hsl(${(hue + 60) % 360}, 100%, 55%)`);
        ctx.shadowBlur = 22;
        ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
        ctx.fillStyle = ballGrad;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── Paddle ─────────────────────────────────────────────────────────
      if (phase === "playing" || phase === "ready") {
        const paddle = paddleRef.current;
        const isPowered = paddle.powerT > 0;
        const pColor = isPowered ? `hsl(${hue}, 100%, 70%)` : `hsl(${(hue + 180) % 360}, 90%, 65%)`;
        const paddleGrad = ctx.createLinearGradient(paddle.x - paddle.w / 2, PADDLE_Y - PADDLE_H / 2, paddle.x - paddle.w / 2, PADDLE_Y + PADDLE_H / 2);
        paddleGrad.addColorStop(0, lightenColor(pColor, 0.4));
        paddleGrad.addColorStop(0.4, pColor);
        paddleGrad.addColorStop(1, darkenColor(pColor, 0.3));
        ctx.shadowBlur = isPowered ? 30 : 16;
        ctx.shadowColor = pColor;
        ctx.fillStyle = paddleGrad;
        ctx.beginPath();
        roundRect(ctx, paddle.x - paddle.w / 2, PADDLE_Y - PADDLE_H / 2, paddle.w, PADDLE_H, 7);
        ctx.fill();
        // highlight
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,0.28)";
        ctx.beginPath();
        roundRect(ctx, paddle.x - paddle.w / 2 + 3, PADDLE_Y - PADDLE_H / 2 + 2, paddle.w - 6, PADDLE_H * 0.38, 4);
        ctx.fill();
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
        ctx.fillText("🧱 PECAH JAWABAN!", CW / 2, CH / 2 - 72);

        ctx.font = "13px 'Orbitron', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.shadowBlur = 0;
        [
          "Gerakkan paddle dengan mouse / sentuhan!",
          "Setiap bata pecah setelah 2× kena bola 🧱",
          "Tiap 25 detik muncul Soal Pak/Bu Guru ⏱️",
          "Combo = poin berlipat! 🔥",
        ].forEach((l, i) => ctx.fillText(l, CW / 2, CH / 2 - 4 + i * 24));

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
          <div className="rounded-xl border border-amber-400/60 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 px-3 py-1 flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(255,200,0,0.35)]">
            <span className="text-sm">👨‍🏫</span>
            <span className="font-display text-[11px] sm:text-xs font-bold text-amber-200 tracking-wide drop-shadow-[0_0_6px_rgba(255,215,0,0.55)]">
              SOAL GURU ke-{guruQuiz.questionNumber + 1}/{guruQuiz.totalQuestions} dalam
            </span>
            <span
              className={`font-display text-sm sm:text-base font-black tabular-nums drop-shadow-[0_0_8px_rgba(255,215,0,0.85)] ${
                guruQuiz.secondsUntilNext <= 5 ? "text-red-300 animate-pulse" : "text-amber-100"
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

function lightenColor(color: string, amt: number): string {
  if (color.startsWith("hsl")) {
    const m = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (m) return `hsl(${m[1]}, ${m[2]}%, ${Math.min(100, Number(m[3]) + amt * 50)}%)`;
  }
  if (color.startsWith("#")) {
    const n = parseInt(color.slice(1), 16);
    const r = Math.min(255, (n >> 16) + Math.round(255 * amt));
    const g = Math.min(255, ((n >> 8) & 0xff) + Math.round(255 * amt));
    const b = Math.min(255, (n & 0xff) + Math.round(255 * amt));
    return `rgb(${r},${g},${b})`;
  }
  return color;
}

function darkenColor(color: string, amt: number): string {
  if (color.startsWith("hsl")) {
    const m = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (m) return `hsl(${m[1]}, ${m[2]}%, ${Math.max(0, Number(m[3]) - amt * 50)}%)`;
  }
  if (color.startsWith("#")) {
    const n = parseInt(color.slice(1), 16);
    const r = Math.max(0, (n >> 16) - Math.round(255 * amt));
    const g = Math.max(0, ((n >> 8) & 0xff) - Math.round(255 * amt));
    const b = Math.max(0, (n & 0xff) - Math.round(255 * amt));
    return `rgb(${r},${g},${b})`;
  }
  return color;
}

export default BrickBreakerPage;
