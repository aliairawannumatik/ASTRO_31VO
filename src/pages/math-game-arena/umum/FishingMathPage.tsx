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
const WATER_Y = 118;   // y where water starts
const ROD_X = CW / 2; // rod tip x position (centered)
const ROD_Y = 60;      // rod tip y

// ── Math ────────────────────────────────────────────────────────────────────
interface MQ { q: string; ans: number }
function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

const makeQ = (): MQ => {
  const t = Math.floor(Math.random() * 8);
  switch (t) {
    case 0: { const a = 2 + ~~(Math.random() * 10), b = 2 + ~~(Math.random() * 10); return { q: `${a} × ${b}`, ans: a * b }; }
    case 1: { const a = 10 + ~~(Math.random() * 80), b = 10 + ~~(Math.random() * 80); return { q: `${a} + ${b}`, ans: a + b }; }
    case 2: { const b = 5 + ~~(Math.random() * 40), a = b + 5 + ~~(Math.random() * 50); return { q: `${a} − ${b}`, ans: a - b }; }
    case 3: { const b = 2 + ~~(Math.random() * 9), a = b * (2 + ~~(Math.random() * 9)); return { q: `${a} ÷ ${b}`, ans: a / b }; }
    case 4: { const sq = [4,9,16,25,36,49,64,81,100][~~(Math.random() * 9)]; return { q: `√${sq}`, ans: Math.round(Math.sqrt(sq)) }; }
    case 5: { const a = 2 + ~~(Math.random() * 9); return { q: `${a}²`, ans: a * a }; }
    case 6: { const a = 2 + ~~(Math.random() * 9), b = 2 + ~~(Math.random() * 9); return { q: `KPK(${a},${b})`, ans: (a * b) / gcd(a, b) }; }
    default: { const a = 10 + ~~(Math.random() * 40), b = 2 + ~~(Math.random() * 8); return { q: `${a} mod ${b}`, ans: a % b }; }
  }
};

const makeWrong = (ans: number, used: Set<number>): number => {
  let v: number, tries = 0;
  do {
    const d = 1 + ~~(Math.random() * 15);
    v = ans + (Math.random() < 0.5 ? d : -d);
    tries++;
  } while ((used.has(v) || v < 0) && tries < 100);
  return v < 0 ? ans + 1 + ~~(Math.random() * 10) : v;
};

// ── Fish colors ──────────────────────────────────────────────────────────────
const FISH_COLORS = [
  { body: "#ff5e87", fin: "#ff2255", glow: "#ff5e87", stripe: "#ffaacc" },
  { body: "#ffc94a", fin: "#cc8800", glow: "#ffc94a", stripe: "#ffe499" },
  { body: "#72f572", fin: "#22aa22", glow: "#72f572", stripe: "#b8ffb8" },
  { body: "#5ec8ff", fin: "#1a88cc", glow: "#5ec8ff", stripe: "#aae4ff" },
  { body: "#cc66ff", fin: "#8800cc", glow: "#cc66ff", stripe: "#e0aaff" },
  { body: "#ff9040", fin: "#cc5500", glow: "#ff9040", stripe: "#ffcc99" },
  { body: "#00e6d2", fin: "#00998a", glow: "#00e6d2", stripe: "#99fff5" },
  { body: "#ff7fa0", fin: "#cc3366", glow: "#ff7fa0", stripe: "#ffccdd" },
];

interface Fish {
  id: number;
  x: number;
  y: number;
  vx: number;        // pixels/sec
  w: number;         // half-width
  h: number;         // half-height
  value: number;
  correct: boolean;
  color: typeof FISH_COLORS[0];
  wobble: number;
  wobbleSpd: number;
  alpha: number;
  hooked: boolean;
  hookT: number;     // 0..1 pull-up animation
  hookX: number;
  hookY: number;
  shine: number;
  splashT: number;   // 0..1 splash after catch
}

interface Bubble { x: number; y: number; r: number; vy: number; alpha: number; t: number }
interface Ripple { x: number; y: number; r: number; alpha: number }
interface FloatText { x: number; y: number; txt: string; alpha: number; vy: number; good: boolean }
interface Splash { x: number; y: number; drops: SplashDrop[] }
interface SplashDrop { vx: number; vy: number; x: number; y: number; alpha: number; r: number; color: string }

type Phase = "idle" | "playing" | "dead";

let _fid = 0;

const DEPTHS = [168, 220, 278, 340, 400, 455];   // y positions for fish lanes

const FishingMathPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastRef = useRef(0);

  const phaseRef = useRef<Phase>("idle");
  const guruQuiz = useGuruQuiz(phaseRef);
  const fishRef = useRef<Fish[]>([]);
  const bubblesRef = useRef<Bubble[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const floatTextsRef = useRef<FloatText[]>([]);
  const splashesRef = useRef<Splash[]>([]);

  const currentQRef = useRef<MQ>(makeQ());
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const bestRef = useRef(0);
  const levelRef = useRef(1);
  const timerRef = useRef(60);
  const timerAccRef = useRef(0);
  const comboRef = useRef(0);
  const shakeRef = useRef(0);
  const hueRef = useRef(0);
  const spawnAccRef = useRef(0);
  const lineRef = useRef<{ x: number; y: number; alpha: number } | null>(null);
  const waveTRef = useRef(0);

  const [, forceRender] = useState(0);
  const rerender = useCallback(() => forceRender(n => n + 1), []);

  // ── Build fish pool for current question ─────────────────────────────────
  const spawnFishPool = useCallback((q: MQ) => {
    const count = Math.min(6 + Math.floor(levelRef.current / 2), DEPTHS.length);
    const used = new Set<number>([q.ans]);
    const values: number[] = [q.ans];
    while (values.length < count) {
      const w = makeWrong(q.ans, used);
      used.add(w);
      values.push(w);
    }
    // shuffle
    for (let i = values.length - 1; i > 0; i--) {
      const j = ~~(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }

    fishRef.current = values.map((val, i) => {
      const col = FISH_COLORS[~~(Math.random() * FISH_COLORS.length)];
      const dir = Math.random() < 0.5 ? 1 : -1;
      const spd = 55 + Math.random() * 60 + levelRef.current * 6;
      const startX = dir > 0 ? -80 : CW + 80;
      const fw = 42 + Math.random() * 18;
      const fh = 18 + Math.random() * 10;
      return {
        id: _fid++,
        x: startX,
        y: DEPTHS[i % DEPTHS.length],
        vx: dir * spd,
        w: fw,
        h: fh,
        value: val,
        correct: val === q.ans,
        color: col,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpd: 1.2 + Math.random() * 1.5,
        alpha: 1,
        hooked: false,
        hookT: 0,
        hookX: 0,
        hookY: 0,
        shine: Math.random() * Math.PI * 2,
        splashT: 0,
      };
    });
  }, []);

  const spawnBubbles = useCallback(() => {
    bubblesRef.current = Array.from({ length: 30 }, () => ({
      x: Math.random() * CW,
      y: WATER_Y + Math.random() * (CH - WATER_Y),
      r: 2 + Math.random() * 7,
      vy: -(14 + Math.random() * 28),
      alpha: 0.1 + Math.random() * 0.25,
      t: Math.random() * Math.PI * 2,
    }));
  }, []);

  const addSplash = (x: number, y: number, color: string) => {
    const drops: SplashDrop[] = Array.from({ length: 14 }, () => {
      const angle = -Math.PI + Math.random() * Math.PI;
      const spd = 60 + Math.random() * 140;
      return { vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd - 80, x, y, alpha: 1, r: 2 + Math.random() * 4, color };
    });
    splashesRef.current.push({ x, y, drops });
  };

  const addRipple = (x: number) => {
    ripplesRef.current.push({ x, y: WATER_Y, r: 6, alpha: 0.9 });
  };

  const startGame = useCallback(() => {
    phaseRef.current = "playing";
    scoreRef.current = 0;
    livesRef.current = 3;
    levelRef.current = 1;
    timerRef.current = 60;
    timerAccRef.current = 0;
    spawnAccRef.current = 0;
    comboRef.current = 0;
    shakeRef.current = 0;
    fishRef.current = [];
    floatTextsRef.current = [];
    splashesRef.current = [];
    ripplesRef.current = [];
    lineRef.current = null;
    const q = makeQ();
    currentQRef.current = q;
    spawnFishPool(q);
    spawnBubbles();
    rerender();
  }, [spawnFishPool, spawnBubbles, rerender]);

  // ── Click ────────────────────────────────────────────────────────────────
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (phaseRef.current === "idle") { startGame(); return; }
    if (phaseRef.current === "dead") { startGame(); return; }

    const rect = canvas.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (CW / rect.width);
    const cy = (e.clientY - rect.top) * (CH / rect.height);

    // only allow clicking in water
    if (cy < WATER_Y) return;

    playPopSound();
    lineRef.current = { x: cx, y: cy, alpha: 1 };
    addRipple(cx);

    const fish = fishRef.current;
    for (const f of fish) {
      if (f.hooked || f.alpha <= 0) continue;
      const dx = cx - f.x, dy = cy - (f.y + Math.sin(f.wobble) * 5);
      if (Math.abs(dx) < f.w + 10 && Math.abs(dy) < f.h + 12) {
        f.hooked = true;
        f.hookX = f.x;
        f.hookY = f.y;
        if (f.correct) {
          comboRef.current++;
          const pts = 10 * comboRef.current * levelRef.current;
          scoreRef.current += pts;
          if (scoreRef.current > bestRef.current) bestRef.current = scoreRef.current;
          floatTextsRef.current.push({ x: f.x, y: f.y - 30, txt: `+${pts}${comboRef.current > 1 ? ` 🔥×${comboRef.current}` : ""}`, alpha: 1, vy: -90, good: true });
          addSplash(f.x, WATER_Y, f.color.glow);
          levelRef.current = Math.floor(scoreRef.current / 100) + 1;
          setTimeout(() => {
            if (phaseRef.current !== "playing") return;
            fish.forEach(ff => { if (!ff.hooked) { ff.alpha = 0; } });
            const q = makeQ();
            currentQRef.current = q;
            setTimeout(() => { spawnFishPool(q); spawnBubbles(); }, 300);
          }, 700);
        } else {
          comboRef.current = 0;
          livesRef.current--;
          shakeRef.current = 0.4;
          floatTextsRef.current.push({ x: f.x, y: f.y - 30, txt: "✗ Salah!", alpha: 1, vy: -70, good: false });
          if (livesRef.current <= 0) { phaseRef.current = "dead"; rerender(); }
        }
        return;
      }
    }
  }, [startGame, spawnFishPool, spawnBubbles, rerender]);

  // ── Draw fish ────────────────────────────────────────────────────────────
  const drawFish = (ctx: CanvasRenderingContext2D, f: Fish) => {
    if (f.alpha <= 0.01) return;
    const dir = f.vx >= 0 ? 1 : -1;
    const wobY = Math.sin(f.wobble) * 5;
    const px = f.hooked ? f.hookX + (ROD_X - f.hookX) * Math.min(f.hookT, 1) : f.x;
    const py = f.hooked
      ? (f.hookY + wobY) - (f.hookY + wobY - ROD_Y) * Math.min(f.hookT, 1)
      : f.y + wobY;
    const shine = Math.sin(f.shine) * 0.5 + 0.5;

    ctx.save();
    ctx.globalAlpha = f.alpha;
    ctx.translate(px, py);
    ctx.scale(dir, 1);  // flip for direction

    // glow
    ctx.shadowBlur = 22;
    ctx.shadowColor = f.color.glow;

    // body
    const bodyGrad = ctx.createRadialGradient(-f.w * 0.25, -f.h * 0.3, 2, 0, 0, f.w);
    const light = lightenHex(f.color.body, 0.4);
    bodyGrad.addColorStop(0, light);
    bodyGrad.addColorStop(0.55, f.color.body);
    bodyGrad.addColorStop(1, f.color.fin);
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, f.w, f.h, 0, 0, Math.PI * 2);
    ctx.fill();

    // stripe
    ctx.globalAlpha = f.alpha * (0.3 + shine * 0.25);
    ctx.strokeStyle = f.color.stripe;
    ctx.lineWidth = f.h * 0.3;
    ctx.beginPath();
    ctx.moveTo(-f.w * 0.5, -f.h * 0.1);
    ctx.lineTo(f.w * 0.3, -f.h * 0.1);
    ctx.stroke();
    ctx.globalAlpha = f.alpha;

    // tail
    ctx.shadowBlur = 14;
    ctx.fillStyle = f.color.fin;
    ctx.beginPath();
    ctx.moveTo(-f.w * 0.85, 0);
    ctx.lineTo(-f.w * 1.45, -f.h * 1.1);
    ctx.lineTo(-f.w * 1.45, f.h * 1.1);
    ctx.closePath();
    ctx.fill();

    // top fin
    ctx.fillStyle = f.color.fin;
    ctx.beginPath();
    ctx.moveTo(-f.w * 0.1, -f.h);
    ctx.lineTo(f.w * 0.4, -f.h * 1.5);
    ctx.lineTo(f.w * 0.3, -f.h);
    ctx.closePath();
    ctx.fill();

    // eye
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff";
    const ew = f.h * 0.55;
    ctx.beginPath();
    ctx.ellipse(f.w * 0.55, -f.h * 0.2, ew, ew, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.ellipse(f.w * 0.58, -f.h * 0.22, ew * 0.55, ew * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(f.w * 0.6, -f.h * 0.28, ew * 0.22, ew * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    // lips
    ctx.strokeStyle = f.color.fin;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(f.w * 0.9, 0, f.h * 0.25, 0.2, 1.1);
    ctx.stroke();

    // number badge
    ctx.shadowBlur = 16;
    ctx.shadowColor = f.color.glow;
    ctx.fillStyle = "#fff";
    const vStr = String(f.value);
    ctx.font = `bold ${vStr.length > 3 ? 11 : 14}px 'Orbitron', monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // flip text back to be readable
    ctx.scale(dir, 1);
    ctx.fillText(vStr, dir === 1 ? -f.w * 0.15 : f.w * 0.15, f.h * 0.25);

    ctx.restore();
  };

  // ── Draw water surface ───────────────────────────────────────────────────
  const drawWater = (ctx: CanvasRenderingContext2D, t: number) => {
    ctx.save();

    // deep water fill
    const waterGrad = ctx.createLinearGradient(0, WATER_Y, 0, CH);
    waterGrad.addColorStop(0, "rgba(0, 180, 220, 0.55)");
    waterGrad.addColorStop(0.3, "rgba(0, 120, 180, 0.72)");
    waterGrad.addColorStop(0.7, "rgba(0, 60, 130, 0.88)");
    waterGrad.addColorStop(1, "rgba(0, 20, 80, 0.95)");
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, WATER_Y, CW, CH - WATER_Y);

    // wavy surface
    ctx.beginPath();
    ctx.moveTo(0, WATER_Y);
    for (let x = 0; x <= CW; x += 6) {
      const wy = WATER_Y + Math.sin(x / 30 + t * 1.8) * 4 + Math.sin(x / 14 + t * 2.8) * 2;
      ctx.lineTo(x, wy);
    }
    ctx.lineTo(CW, WATER_Y - 8);
    ctx.lineTo(0, WATER_Y - 8);
    ctx.closePath();
    const surfGrad = ctx.createLinearGradient(0, WATER_Y - 8, 0, WATER_Y + 12);
    surfGrad.addColorStop(0, "rgba(120, 240, 255, 0.08)");
    surfGrad.addColorStop(0.5, "rgba(80, 200, 255, 0.35)");
    surfGrad.addColorStop(1, "rgba(0, 160, 220, 0.15)");
    ctx.fillStyle = surfGrad;
    ctx.fill();

    // shimmer sparkles on surface
    for (let i = 0; i < 6; i++) {
      const sx = ((i * 73 + t * 80) % CW);
      const sy = WATER_Y + Math.sin(sx / 28 + t * 2) * 4;
      const sa = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i));
      ctx.globalAlpha = sa;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // depth lines (caustics effect)
    for (let i = 0; i < 4; i++) {
      const dy = WATER_Y + 60 + i * 90;
      ctx.globalAlpha = 0.04;
      ctx.strokeStyle = "#88eeff";
      ctx.lineWidth = 22;
      ctx.beginPath();
      for (let x = 0; x <= CW; x += 8) {
        const wy = dy + Math.sin(x / 25 + t * 0.7 + i) * 8;
        if (x === 0) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  };

  // ── Main loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    spawnBubbles();

    const loop = (ts: number) => {
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05);
      lastRef.current = ts;
      if (guruQuiz.isPausedRef.current) { rafRef.current = requestAnimationFrame(loop); return; }
      hueRef.current = (hueRef.current + dt * 20) % 360;
      waveTRef.current += dt;
      const hue = hueRef.current;

      // ── Update ──────────────────────────────────────────────────────────
      if (phaseRef.current === "playing") {
        timerAccRef.current += dt;
        if (timerAccRef.current >= 1) {
          timerAccRef.current -= 1;
          timerRef.current--;
          if (timerRef.current <= 0) { timerRef.current = 0; phaseRef.current = "dead"; rerender(); }
        }
        if (shakeRef.current > 0) shakeRef.current = Math.max(0, shakeRef.current - dt * 2.5);

        // Fish
        for (const f of fishRef.current) {
          if (f.alpha <= 0) continue;
          f.wobble += f.wobbleSpd * dt;
          f.shine += dt * 1.8;

          if (f.hooked) {
            f.hookT = Math.min(f.hookT + dt * 2.5, 1.2);
            if (f.hookT >= 1.05) { f.alpha = Math.max(0, f.alpha - dt * 3); }
          } else {
            f.x += f.vx * dt;
            // wrap around
            if (f.vx > 0 && f.x - f.w > CW + 20) { f.x = -f.w - 20; }
            if (f.vx < 0 && f.x + f.w < -20) { f.x = CW + f.w + 20; }
          }
        }
        // Respawn if all non-hooked are gone
        const alive = fishRef.current.filter(f => f.alpha > 0.01 && !f.hooked);
        if (alive.length === 0 && fishRef.current.every(f => f.hooked || f.alpha <= 0.01)) {
          // waiting for new spawn from timeout
        }
      }

      // Bubbles
      for (const b of bubblesRef.current) {
        b.y += b.vy * dt;
        b.t += dt;
        b.x += Math.sin(b.t * 1.2) * 0.5;
        if (b.y + b.r < WATER_Y) { b.y = CH; b.x = Math.random() * CW; }
      }

      // Ripples
      for (const r of ripplesRef.current) {
        r.r += dt * 80;
        r.alpha -= dt * 2.2;
      }
      ripplesRef.current = ripplesRef.current.filter(r => r.alpha > 0);

      // Splashes
      for (const s of splashesRef.current) {
        for (const d of s.drops) {
          d.x += d.vx * dt; d.y += d.vy * dt;
          d.vy += 280 * dt;
          d.alpha -= dt * 2;
        }
        s.drops = s.drops.filter(d => d.alpha > 0);
      }
      splashesRef.current = splashesRef.current.filter(s => s.drops.length > 0);

      // Float texts
      for (const f of floatTextsRef.current) { f.y += f.vy * dt; f.alpha -= dt * 1.3; }
      floatTextsRef.current = floatTextsRef.current.filter(f => f.alpha > 0);

      // Fishing line fade
      if (lineRef.current) { lineRef.current.alpha -= dt * 2.5; if (lineRef.current.alpha <= 0) lineRef.current = null; }

      // ── Draw ─────────────────────────────────────────────────────────────
      const sx = shakeRef.current > 0 ? (Math.random() - 0.5) * shakeRef.current * 11 : 0;
      const sy = shakeRef.current > 0 ? (Math.random() - 0.5) * shakeRef.current * 5 : 0;
      ctx.save();
      ctx.translate(sx, sy);

      // Sky / background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, WATER_Y);
      skyGrad.addColorStop(0, `hsl(${hue}, 55%, 10%)`);
      skyGrad.addColorStop(0.6, `hsl(${(hue + 40) % 360}, 50%, 14%)`);
      skyGrad.addColorStop(1, `hsl(${(hue + 80) % 360}, 60%, 18%)`);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, CW, WATER_Y);

      // Stars in sky
      for (let i = 0; i < 24; i++) {
        const sx2 = ((i * 61 + 7) % CW);
        const sy2 = ((i * 43 + 5) % (WATER_Y - 14)) + 4;
        const sa = 0.3 + 0.7 * Math.abs(Math.sin(ts / 1200 + i));
        ctx.globalAlpha = sa;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(sx2, sy2, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Moon / sun glow in sky
      const moonX = CW * 0.8, moonY = 40;
      ctx.shadowBlur = 35;
      ctx.shadowColor = `hsl(${(hue + 30) % 360}, 100%, 80%)`;
      ctx.fillStyle = `hsl(${(hue + 30) % 360}, 100%, 82%)`;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Water
      drawWater(ctx, waveTRef.current);

      // Bubbles (behind fish)
      for (const b of bubblesRef.current) {
        ctx.globalAlpha = b.alpha;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(180,240,255,0.8)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Ripples
      for (const r of ripplesRef.current) {
        ctx.globalAlpha = r.alpha * 0.7;
        ctx.strokeStyle = `rgba(120,230,255,0.9)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.r, r.r * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // HUD bar (sky area)
      const barGrad = ctx.createLinearGradient(0, 0, CW, 0);
      barGrad.addColorStop(0, "rgba(5,5,20,0.88)");
      barGrad.addColorStop(1, "rgba(10,3,30,0.88)");
      ctx.fillStyle = barGrad;
      ctx.fillRect(0, 0, CW, 108);

      if (phaseRef.current === "playing") {
        // Instruction
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.font = "bold 12px 'Orbitron', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.65)";
        ctx.shadowBlur = 0;
        ctx.fillText("Klik ikan yang membawa jawaban BENAR! 🎣", CW / 2, 16);

        // Question
        ctx.shadowBlur = 26;
        ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
        ctx.fillStyle = `hsl(${hue}, 100%, 82%)`;
        ctx.font = "bold 30px 'Orbitron', monospace";
        ctx.fillText(currentQRef.current.q, CW / 2, 52);
        ctx.shadowBlur = 0;

        // Score
        ctx.textAlign = "left";
        ctx.font = "bold 12px 'Orbitron', monospace";
        ctx.fillStyle = "#ffc94a";
        ctx.shadowBlur = 10; ctx.shadowColor = "#ffc94a";
        ctx.fillText(`⭐ ${scoreRef.current}`, 10, 84);

        // Lives
        ctx.textAlign = "right";
        ctx.fillStyle = "#ff5e87";
        ctx.shadowColor = "#ff5e87";
        ctx.fillText(`❤️ ${"♥".repeat(Math.max(0, livesRef.current))}`, CW - 10, 84);

        // Level
        ctx.textAlign = "center";
        ctx.font = "bold 10px 'Orbitron', monospace";
        ctx.fillStyle = `hsl(${(hue + 60) % 360}, 100%, 75%)`;
        ctx.fillText(`LEVEL ${levelRef.current}`, CW / 2, 84);
        ctx.shadowBlur = 0;

        // Timer bar
        const tFrac = timerRef.current / 60;
        const tCol = `hsl(${tFrac * 120}, 100%, 55%)`;
        ctx.fillStyle = "rgba(255,255,255,0.07)";
        ctx.fillRect(0, 106, CW, 5);
        ctx.fillStyle = tCol;
        ctx.shadowBlur = 8; ctx.shadowColor = tCol;
        ctx.fillRect(0, 106, CW * tFrac, 5);
        ctx.shadowBlur = 0;
      }

      // Fishing rod
      const rodBaseX = CW / 2 - 60, rodBaseY = 0;
      ctx.strokeStyle = "#a0522d";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(rodBaseX, rodBaseY + 2);
      ctx.quadraticCurveTo(rodBaseX + 30, 40, ROD_X, ROD_Y);
      ctx.stroke();

      // Fishing line (when cast)
      if (lineRef.current && lineRef.current.alpha > 0) {
        ctx.globalAlpha = lineRef.current.alpha * 0.85;
        ctx.strokeStyle = `rgba(200, 230, 255, 0.9)`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(ROD_X, ROD_Y);
        ctx.lineTo(lineRef.current.x, lineRef.current.y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        // hook
        ctx.globalAlpha = lineRef.current.alpha;
        ctx.fillStyle = "#aaccff";
        ctx.beginPath();
        ctx.arc(lineRef.current.x, lineRef.current.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Hooked fish lines
      for (const f of fishRef.current) {
        if (!f.hooked || f.alpha <= 0) continue;
        const fpx = f.hookX + (ROD_X - f.hookX) * Math.min(f.hookT, 1);
        const fpy = (f.hookY + Math.sin(f.wobble) * 5) - ((f.hookY + Math.sin(f.wobble) * 5) - ROD_Y) * Math.min(f.hookT, 1);
        ctx.globalAlpha = f.alpha * 0.7;
        ctx.strokeStyle = "rgba(200,230,255,0.8)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(ROD_X, ROD_Y);
        ctx.lineTo(fpx, fpy);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }

      // Fish
      for (const f of fishRef.current) drawFish(ctx, f);

      // Splash drops
      for (const s of splashesRef.current) {
        for (const d of s.drops) {
          ctx.globalAlpha = Math.max(0, d.alpha);
          ctx.fillStyle = d.color;
          ctx.shadowBlur = 8; ctx.shadowColor = d.color;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;
      }

      // Float texts
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

      // ── Idle overlay ──────────────────────────────────────────────────────
      if (phaseRef.current === "idle") {
        ctx.fillStyle = "rgba(0,0,0,0.60)";
        ctx.fillRect(0, 0, CW, CH);
        ctx.textAlign = "center"; ctx.textBaseline = "middle";

        ctx.font = "bold 11px 'Orbitron', monospace";
        ctx.fillStyle = `hsl(${hue}, 100%, 75%)`;
        ctx.shadowBlur = 14; ctx.shadowColor = `hsl(${hue}, 100%, 55%)`;
        ctx.fillText("MATH ARENA × NUMATIK AI", CW / 2, CH / 2 - 128);

        ctx.font = "bold 34px 'Orbitron', monospace";
        ctx.fillStyle = `hsl(${(hue + 60) % 360}, 100%, 80%)`;
        ctx.shadowBlur = 32; ctx.shadowColor = `hsl(${(hue + 60) % 360}, 100%, 60%)`;
        ctx.fillText("🎣 MANCING SOAL!", CW / 2, CH / 2 - 72);

        ctx.font = "13px 'Orbitron', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.shadowBlur = 0;
        [
          "Ikan berenang membawa angka-angka!",
          "Klik ikan dengan jawaban yang BENAR!",
          "Klik ikan salah → kehilangan nyawa!",
          "Combo = poin berlipat ganda! 🔥",
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
      if (phaseRef.current === "dead") {
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
        ctx.fillText("Terus semangat belajar! 🌟", CW / 2, CH / 2 + 44);

        ctx.font = "bold 15px 'Orbitron', monospace";
        ctx.fillStyle = `hsl(${hue}, 100%, 80%)`;
        ctx.shadowBlur = 18; ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        const pulse2 = 0.82 + 0.18 * Math.sin(ts / 310);
        ctx.globalAlpha = pulse2;
        ctx.fillText("[ KLIK UNTUK MAIN LAGI ]", CW / 2, CH / 2 + 95);
        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [spawnBubbles, spawnFishPool, rerender]);

  return (
    <div className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}
      <div className="relative z-10 flex flex-col items-center gap-4 py-6 w-full">
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          onClick={handleClick}
          style={{
            cursor: "crosshair",
            borderRadius: 20,
            boxShadow: "0 0 40px rgba(0,160,220,0.45), 0 0 80px rgba(0,80,180,0.2)",
            maxWidth: "95vw",
            maxHeight: "calc(100dvh - 80px)",
            objectFit: "contain",
          }}
        />
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
        >
          ← Kembali ke Game Arena
        </button>
      <GuruQuizOverlay {...guruQuiz} />
      </div>
    </div>
  );
};

function lightenHex(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (n >> 16) + Math.round(255 * amt));
  const g = Math.min(255, ((n >> 8) & 0xff) + Math.round(255 * amt));
  const b = Math.min(255, (n & 0xff) + Math.round(255 * amt));
  return `rgb(${r},${g},${b})`;
}

export default FishingMathPage;
