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

// ── Math question generator ───────────────────────────────────────────────────
interface MQ { q: string; ans: number }

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

const makeQ = (): MQ => {
  const t = Math.floor(Math.random() * 8);
  switch (t) {
    case 0: { const a = 2 + Math.floor(Math.random() * 10), b = 2 + Math.floor(Math.random() * 10); return { q: `${a} × ${b}`, ans: a * b }; }
    case 1: { const a = 10 + Math.floor(Math.random() * 90), b = 10 + Math.floor(Math.random() * 90); return { q: `${a} + ${b}`, ans: a + b }; }
    case 2: { const b = 5 + Math.floor(Math.random() * 45), a = b + 5 + Math.floor(Math.random() * 50); return { q: `${a} − ${b}`, ans: a - b }; }
    case 3: { const b = 2 + Math.floor(Math.random() * 9), a = b * (2 + Math.floor(Math.random() * 9)); return { q: `${a} ÷ ${b}`, ans: a / b }; }
    case 4: { const sqList = [4,9,16,25,36,49,64,81,100]; const sq = sqList[Math.floor(Math.random() * sqList.length)]; return { q: `√${sq}`, ans: Math.round(Math.sqrt(sq)) }; }
    case 5: { const bases = [2,3,4,5,6,7,8,9]; const a = bases[Math.floor(Math.random() * bases.length)]; return { q: `${a}²`, ans: a * a }; }
    case 6: { const a = 2 + Math.floor(Math.random() * 9), b = 2 + Math.floor(Math.random() * 9); return { q: `KPK(${a},${b})`, ans: (a * b) / gcd(a, b) }; }
    default: { const a = 2 + Math.floor(Math.random() * 9), b = 2 + Math.floor(Math.random() * 9); return { q: `FPB(${a * b},${a * b * 2})`, ans: a * b }; }
  }
};

const makeWrong = (ans: number, used: Set<number>): number => {
  let v: number, tries = 0;
  do {
    const d = 1 + Math.floor(Math.random() * 12);
    v = ans + (Math.random() < 0.5 ? d : -d);
    tries++;
  } while ((used.has(v) || v < 0) && tries < 100);
  return v < 0 ? ans + 1 + Math.floor(Math.random() * 8) : v;
};

// ── Mole colors ───────────────────────────────────────────────────────────────
const MOLE_COLORS = [
  { body: "#ff5e87", shadow: "#cc2255", glow: "#ff5e87", hat: "#cc2255" },
  { body: "#5ec8ff", shadow: "#1a88cc", glow: "#5ec8ff", hat: "#1a88cc" },
  { body: "#72f572", shadow: "#22aa22", glow: "#72f572", hat: "#22aa22" },
  { body: "#ffc94a", shadow: "#cc8800", glow: "#ffc94a", hat: "#cc8800" },
  { body: "#cc66ff", shadow: "#8800cc", glow: "#cc66ff", hat: "#8800cc" },
  { body: "#ff9040", shadow: "#cc5500", glow: "#ff9040", hat: "#cc5500" },
  { body: "#00e6d2", shadow: "#00998a", glow: "#00e6d2", hat: "#00998a" },
  { body: "#ff7faa", shadow: "#cc3366", glow: "#ff7faa", hat: "#cc3366" },
  { body: "#a0f0f0", shadow: "#33aaaa", glow: "#a0f0f0", hat: "#33aaaa" },
];

// ── Hole layout ───────────────────────────────────────────────────────────────
const COLS = 3;
const ROWS = 3;
const HOLE_RX = 52;
const HOLE_RY = 18;
const HOLE_GAP_X = CW / (COLS + 1);   // 105
const HOLE_GAP_Y = 128;
const HOLE_START_Y = 230;
const MOLE_H = 78;

interface Hole {
  idx: number;
  cx: number;
  cy: number;
  value: number;
  correct: boolean;
  color: typeof MOLE_COLORS[0];
  // animation: 0 = hidden, 1 = fully up
  riseT: number;   // current animation t (0..1)
  state: "hidden" | "rising" | "up" | "falling" | "hit" | "miss";
  upDur: number;   // how long to stay up
  upAcc: number;
  hitT: number;    // hit animation timer
  stars: StarParticle[];
}

interface StarParticle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number;
  color: string;
  r: number;
}

interface FloatText {
  x: number; y: number;
  txt: string;
  alpha: number;
  vy: number;
  good: boolean;
}

type Phase = "idle" | "playing" | "dead";

const easeOutBack = (t: number) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const easeInBack = (t: number) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return c3 * t * t * t - c1 * t * t;
};

let _hid = 0;

const MolSmashPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastRef = useRef(0);

  const phaseRef = useRef<Phase>("idle");
  const guruQuiz = useGuruQuiz(phaseRef);
  const holesRef = useRef<Hole[]>([]);
  const floatTextsRef = useRef<FloatText[]>([]);
  const currentQRef = useRef<MQ>(makeQ());
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const bestRef = useRef(0);
  const levelRef = useRef(1);
  const timerRef = useRef(60);
  const timerAccRef = useRef(0);
  const comboRef = useRef(0);
  const shakeRef = useRef(0);
  const rainbowHueRef = useRef(0);
  const spawnAccRef = useRef(0);
  const hammerRef = useRef<{ x: number; y: number; swingT: number; active: boolean }>({ x: 0, y: 0, swingT: 0, active: false });
  const mousePosRef = useRef({ x: 0, y: 0 });
  void _hid;

  const [, forceRender] = useState(0);
  const rerender = useCallback(() => forceRender(n => n + 1), []);

  // ── Init holes ────────────────────────────────────────────────────────────
  const initHoles = useCallback(() => {
    const holes: Hole[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const idx = r * COLS + c;
        holes.push({
          idx,
          cx: HOLE_GAP_X * (c + 1),
          cy: HOLE_START_Y + r * HOLE_GAP_Y,
          value: 0,
          correct: false,
          color: MOLE_COLORS[idx % MOLE_COLORS.length],
          riseT: 0,
          state: "hidden",
          upDur: 2.5,
          upAcc: 0,
          hitT: 0,
          stars: [],
        });
      }
    }
    holesRef.current = holes;
  }, []);

  // ── Assign values to holes for current question ───────────────────────────
  const assignValues = useCallback((q: MQ) => {
    const used = new Set<number>([q.ans]);
    const values: number[] = [q.ans];
    while (values.length < 9) {
      const w = makeWrong(q.ans, used);
      used.add(w);
      values.push(w);
    }
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    const holes = holesRef.current;
    holes.forEach((h, i) => {
      h.value = values[i];
      h.correct = values[i] === q.ans;
      h.color = MOLE_COLORS[Math.floor(Math.random() * MOLE_COLORS.length)];
      h.state = "hidden";
      h.riseT = 0;
      h.upAcc = 0;
      h.hitT = 0;
      h.stars = [];
    });
  }, []);

  const spawnParticles = (h: Hole) => {
    const stars: StarParticle[] = [];
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.4;
      const speed = 60 + Math.random() * 130;
      stars.push({
        x: h.cx, y: h.cy - MOLE_H * 0.5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: h.color.glow,
        r: 3 + Math.random() * 5,
      });
    }
    h.stars = stars;
  };

  const scheduleMoles = useCallback(() => {
    const holes = holesRef.current;
    const level = levelRef.current;
    const upCount = Math.min(2 + Math.floor(level / 2), 6);
    const hidden = holes.filter(h => h.state === "hidden");
    // ensure correct mole is always visible somewhere
    const correctHole = holes.find(h => h.correct && h.state === "hidden");
    const toRise = new Set<number>();
    if (correctHole) toRise.add(correctHole.idx);
    const pool = hidden.filter(h => !h.correct);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    let picked = 0;
    for (const h of pool) {
      if (toRise.size >= upCount) break;
      toRise.add(h.idx);
      picked++;
      void picked;
    }
    for (const idx of toRise) {
      const h = holes[idx];
      if (h.state === "hidden") {
        h.state = "rising";
        h.upDur = Math.max(1.2, 2.8 - level * 0.12);
      }
    }
  }, []);

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
    floatTextsRef.current = [];
    rainbowHueRef.current = 0;
    const q = makeQ();
    currentQRef.current = q;
    initHoles();
    assignValues(q);
    scheduleMoles();
    rerender();
  }, [initHoles, assignValues, scheduleMoles, rerender]);

  // ── Canvas click ─────────────────────────────────────────────────────────
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (phaseRef.current === "idle") { startGame(); return; }
    if (phaseRef.current === "dead") { startGame(); return; }

    const rect = canvas.getBoundingClientRect();
    const scaleX = CW / rect.width;
    const scaleY = CH / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;

    // hammer swing
    hammerRef.current = { x: cx, y: cy, swingT: 0, active: true };

    playPopSound();

    const holes = holesRef.current;
    for (const h of holes) {
      if (h.state !== "up" && h.state !== "rising") continue;
      const moleTop = h.cy - MOLE_H * easeOutBack(h.riseT);
      const moleBot = h.cy;
      if (cx >= h.cx - HOLE_RX && cx <= h.cx + HOLE_RX && cy >= moleTop && cy <= moleBot) {
        if (h.correct) {
          comboRef.current++;
          const pts = 10 * comboRef.current * levelRef.current;
          scoreRef.current += pts;
          if (scoreRef.current > bestRef.current) bestRef.current = scoreRef.current;
          spawnParticles(h);
          floatTextsRef.current.push({ x: h.cx, y: h.cy - MOLE_H, txt: `+${pts}${comboRef.current > 1 ? ` 🔥×${comboRef.current}` : ""}`, alpha: 1, vy: -80, good: true });
          h.state = "hit";
          h.hitT = 0;
          // all other moles fall
          holes.forEach(oh => { if (oh !== h && (oh.state === "up" || oh.state === "rising")) { oh.state = "falling"; } });
          levelRef.current = Math.floor(scoreRef.current / 100) + 1;
          // next question after short delay
          setTimeout(() => {
            if (phaseRef.current !== "playing") return;
            const q = makeQ();
            currentQRef.current = q;
            assignValues(q);
            setTimeout(() => scheduleMoles(), 400);
          }, 600);
        } else {
          comboRef.current = 0;
          livesRef.current--;
          shakeRef.current = 0.45;
          h.state = "falling";
          floatTextsRef.current.push({ x: h.cx, y: h.cy - MOLE_H * 0.5, txt: "✗ Salah!", alpha: 1, vy: -70, good: false });
          if (livesRef.current <= 0) {
            phaseRef.current = "dead";
            rerender();
          }
        }
        return;
      }
    }
  }, [startGame, assignValues, scheduleMoles, rerender]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mousePosRef.current = {
      x: (e.clientX - rect.left) * (CW / rect.width),
      y: (e.clientY - rect.top) * (CH / rect.height),
    };
  }, []);

  // ── Draw helpers ──────────────────────────────────────────────────────────
  const drawHole = (ctx: CanvasRenderingContext2D, h: Hole) => {
    ctx.save();
    ctx.shadowBlur = 16;
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    const holeGrad = ctx.createRadialGradient(h.cx, h.cy, 2, h.cx, h.cy, HOLE_RX);
    holeGrad.addColorStop(0, "rgba(0,0,0,0.9)");
    holeGrad.addColorStop(1, "rgba(20,10,40,0.7)");
    ctx.fillStyle = holeGrad;
    ctx.beginPath();
    ctx.ellipse(h.cx, h.cy, HOLE_RX, HOLE_RY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  };

  const drawMole = (ctx: CanvasRenderingContext2D, h: Hole, ts: number) => {
    if (h.state === "hidden") return;
    const t = Math.max(0, Math.min(1, h.riseT));
    let offset: number;
    if (h.state === "rising") offset = easeOutBack(t);
    else if (h.state === "falling") offset = 1 - easeInBack(1 - t);
    else if (h.state === "hit") offset = 1 - easeInBack(1 - t);
    else offset = 1; // up

    const moleY = h.cy - MOLE_H * offset;
    const moleVisible = offset > 0.02;
    if (!moleVisible) return;

    const hitScale = h.state === "hit" ? 1 + 0.3 * Math.sin(h.hitT * Math.PI) : 1;

    ctx.save();
    // clip to hole area (mole should emerge from hole)
    ctx.beginPath();
    ctx.rect(h.cx - HOLE_RX - 4, -10, (HOLE_RX + 4) * 2, h.cy + HOLE_RY + 10);
    ctx.clip();

    ctx.translate(h.cx, moleY + MOLE_H / 2);
    ctx.scale(hitScale, hitScale);

    // glow
    ctx.shadowBlur = 28;
    ctx.shadowColor = h.color.glow;

    // body
    const bodyGrad = ctx.createRadialGradient(-8, -10, 4, 0, 0, HOLE_RX * 0.85);
    bodyGrad.addColorStop(0, lighten(h.color.body, 0.5));
    bodyGrad.addColorStop(0.5, h.color.body);
    bodyGrad.addColorStop(1, h.color.shadow);
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, HOLE_RX * 0.82, MOLE_H / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // hat
    const hatW = HOLE_RX * 0.6;
    const hatH = 22;
    ctx.fillStyle = h.color.hat;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.ellipse(0, -MOLE_H / 2 + 4, hatW, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = h.color.hat;
    ctx.fillRect(-hatW * 0.7, -MOLE_H / 2 - hatH + 4, hatW * 1.4, hatH);
    ctx.fillStyle = lighten(h.color.body, 0.3);
    ctx.fillRect(-hatW * 0.7, -MOLE_H / 2 - hatH + 4, hatW * 1.4, 5);

    // eyes
    const eyeY = -MOLE_H * 0.12;
    const blink = Math.floor(ts / 2000) % 10 === 0;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#fff";
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    if (blink) {
      ctx.fillRect(-18, eyeY - 1, 12, 2);
      ctx.fillRect(6, eyeY - 1, 12, 2);
    } else {
      ctx.ellipse(-12, eyeY, 7, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(12, eyeY, 7, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#111";
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.ellipse(-12, eyeY + 1, 3.5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(12, eyeY + 1, 3.5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.ellipse(-10, eyeY - 1, 1.5, 1.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(14, eyeY - 1, 1.5, 1.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // snout
    const snoutY = eyeY + 18;
    ctx.fillStyle = lighten(h.color.body, 0.3);
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.ellipse(0, snoutY, 14, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.ellipse(-5, snoutY, 3, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(5, snoutY, 3, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // value label
    ctx.shadowBlur = 18;
    ctx.shadowColor = h.color.glow;
    ctx.fillStyle = "#ffffff";
    const valStr = String(h.value);
    ctx.font = `bold ${valStr.length > 3 ? 14 : 18}px 'Orbitron', monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(valStr, 0, snoutY + 20);

    ctx.restore();
  };

  // ── Main game loop ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    initHoles();

    const loop = (ts: number) => {
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05);
      lastRef.current = ts;
      if (guruQuiz.isPausedRef.current) { rafRef.current = requestAnimationFrame(loop); return; }
      rainbowHueRef.current = (rainbowHueRef.current + dt * 25) % 360;
      const h = rainbowHueRef.current;

      // ── Update ──────────────────────────────────────────────────────────
      if (phaseRef.current === "playing") {
        timerAccRef.current += dt;
        if (timerAccRef.current >= 1) {
          timerAccRef.current -= 1;
          timerRef.current--;
          if (timerRef.current <= 0) {
            timerRef.current = 0;
            phaseRef.current = "dead";
            rerender();
          }
        }
        if (shakeRef.current > 0) shakeRef.current = Math.max(0, shakeRef.current - dt * 2.5);

        // spawn scheduler
        spawnAccRef.current += dt;
        const interval = Math.max(0.8, 2.2 - levelRef.current * 0.1);
        if (spawnAccRef.current >= interval) {
          spawnAccRef.current = 0;
          const allDown = holesRef.current.every(h => h.state === "hidden" || h.state === "falling");
          if (allDown || holesRef.current.filter(h => h.state === "up").length === 0) {
            scheduleMoles();
          }
        }

        // update holes
        const RISE_SPD = 2.2 + levelRef.current * 0.1;
        const FALL_SPD = 3.5;
        for (const hole of holesRef.current) {
          // star particles
          for (const s of hole.stars) {
            s.x += s.vx * dt; s.y += s.vy * dt;
            s.vy += 180 * dt; s.alpha -= dt * 2;
            s.r *= 0.97;
          }
          hole.stars = hole.stars.filter(s => s.alpha > 0);

          if (hole.state === "rising") {
            hole.riseT = Math.min(1, hole.riseT + dt * RISE_SPD);
            if (hole.riseT >= 1) { hole.state = "up"; hole.riseT = 1; }
          } else if (hole.state === "up") {
            hole.upAcc += dt;
            if (hole.upAcc >= hole.upDur) {
              hole.state = "falling";
              if (hole.correct) {
                comboRef.current = 0;
                livesRef.current--;
                shakeRef.current = 0.35;
                floatTextsRef.current.push({ x: hole.cx, y: hole.cy - MOLE_H, txt: "💨 Kabur!", alpha: 1, vy: -70, good: false });
                if (livesRef.current <= 0) { phaseRef.current = "dead"; rerender(); }
                setTimeout(() => {
                  if (phaseRef.current !== "playing") return;
                  const q = makeQ();
                  currentQRef.current = q;
                  assignValues(q);
                  setTimeout(() => scheduleMoles(), 400);
                }, 600);
              }
            }
          } else if (hole.state === "falling") {
            hole.riseT = Math.max(0, hole.riseT - dt * FALL_SPD);
            if (hole.riseT <= 0) { hole.state = "hidden"; }
          } else if (hole.state === "hit") {
            hole.hitT = Math.min(1, hole.hitT + dt * 4);
            hole.riseT = Math.max(0, hole.riseT - dt * FALL_SPD);
            if (hole.riseT <= 0) { hole.state = "hidden"; }
          }
        }
      }

      // update hammer
      if (hammerRef.current.active) {
        hammerRef.current.swingT = Math.min(1, hammerRef.current.swingT + dt * 5);
        if (hammerRef.current.swingT >= 1) hammerRef.current.active = false;
      }

      // update float texts
      const fts = floatTextsRef.current;
      for (const f of fts) { f.y += f.vy * dt; f.alpha -= dt * 1.4; }
      floatTextsRef.current = fts.filter(f => f.alpha > 0);

      // ── Draw ─────────────────────────────────────────────────────────────
      const sx = shakeRef.current > 0 ? (Math.random() - 0.5) * shakeRef.current * 12 : 0;
      const sy = shakeRef.current > 0 ? (Math.random() - 0.5) * shakeRef.current * 5 : 0;
      ctx.save();
      ctx.translate(sx, sy);

      // background
      const bgGrad = ctx.createLinearGradient(0, 0, CW, CH);
      bgGrad.addColorStop(0, `hsl(${h}, 65%, 7%)`);
      bgGrad.addColorStop(0.5, `hsl(${(h + 80) % 360}, 55%, 9%)`);
      bgGrad.addColorStop(1, `hsl(${(h + 160) % 360}, 60%, 7%)`);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, CW, CH);

      // grass platform
      for (let i = 0; i < ROWS; i++) {
        const groundY = HOLE_START_Y + i * HOLE_GAP_Y + HOLE_RY;
        const gGrad = ctx.createLinearGradient(0, groundY, 0, groundY + 50);
        gGrad.addColorStop(0, `hsl(${(h + 120) % 360}, 50%, 18%)`);
        gGrad.addColorStop(1, `hsl(${(h + 120) % 360}, 40%, 10%)`);
        ctx.fillStyle = gGrad;
        ctx.fillRect(0, groundY, CW, 50);
      }

      // top HUD bar
      const barGrad = ctx.createLinearGradient(0, 0, CW, 0);
      barGrad.addColorStop(0, "rgba(10,10,30,0.94)");
      barGrad.addColorStop(1, "rgba(25,5,50,0.94)");
      ctx.fillStyle = barGrad;
      ctx.fillRect(0, 0, CW, 100);

      // Question
      if (phaseRef.current === "playing") {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 13px 'Orbitron', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.shadowBlur = 0;
        ctx.fillText("Hajar mol dengan jawaban yang BENAR! 🔨", CW / 2, 18);

        ctx.shadowBlur = 28;
        ctx.shadowColor = `hsl(${h}, 100%, 70%)`;
        ctx.fillStyle = `hsl(${h}, 100%, 82%)`;
        ctx.font = "bold 32px 'Orbitron', monospace";
        ctx.fillText(currentQRef.current.q, CW / 2, 58);
        ctx.shadowBlur = 0;
      }

      // Score / Lives / Timer
      if (phaseRef.current === "playing") {
        ctx.textAlign = "left";
        ctx.font = "bold 13px 'Orbitron', monospace";
        ctx.fillStyle = "#ffc94a";
        ctx.shadowColor = "#ffc94a";
        ctx.shadowBlur = 10;
        ctx.fillText(`⭐ ${scoreRef.current}`, 10, 88);

        ctx.textAlign = "right";
        ctx.fillStyle = "#ff5e87";
        ctx.shadowColor = "#ff5e87";
        ctx.fillText(`❤️ ${"♥".repeat(Math.max(0, livesRef.current))}`, CW - 10, 88);

        ctx.textAlign = "center";
        ctx.font = "bold 11px 'Orbitron', monospace";
        ctx.fillStyle = `hsl(${(h + 60) % 360}, 100%, 75%)`;
        ctx.fillText(`LEVEL ${levelRef.current}`, CW / 2, 88);
        ctx.shadowBlur = 0;

        // timer bar
        const tFrac = timerRef.current / 60;
        const timerColor = `hsl(${tFrac * 120}, 100%, 55%)`;
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.fillRect(0, 100, CW, 5);
        ctx.fillStyle = timerColor;
        ctx.shadowBlur = 8;
        ctx.shadowColor = timerColor;
        ctx.fillRect(0, 100, CW * tFrac, 5);
        ctx.shadowBlur = 0;
      }

      // draw holes (back layer)
      for (const hole of holesRef.current) drawHole(ctx, hole);

      // draw moles
      for (const hole of holesRef.current) drawMole(ctx, hole, ts);

      // draw star particles (on top of moles)
      for (const hole of holesRef.current) {
        for (const s of hole.stars) {
          ctx.globalAlpha = Math.max(0, s.alpha);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = s.color;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      }

      // draw hammer cursor
      const { x: mx, y: my, swingT, active } = hammerRef.current;
      if (active) {
        const angle = -0.7 + swingT * 0.9;
        ctx.save();
        ctx.translate(mx, my);
        ctx.rotate(angle);
        // handle
        ctx.fillStyle = "#a0522d";
        ctx.fillRect(-4, 0, 8, 36);
        // head
        ctx.fillStyle = `hsl(${h}, 80%, 65%)`;
        ctx.shadowBlur = 18;
        ctx.shadowColor = `hsl(${h}, 100%, 70%)`;
        ctx.fillRect(-16, -16, 32, 16);
        ctx.shadowBlur = 0;
        ctx.restore();
      } else {
        // idle hammer at mouse position
        const { x: msx, y: msy } = mousePosRef.current;
        ctx.save();
        ctx.translate(msx, msy);
        ctx.rotate(-0.7);
        ctx.fillStyle = "#a0522d";
        ctx.globalAlpha = 0.5;
        ctx.fillRect(-4, 0, 8, 36);
        ctx.fillStyle = `hsl(${h}, 80%, 65%)`;
        ctx.fillRect(-16, -16, 32, 16);
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      // float texts
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

      // ── idle overlay ─────────────────────────────────────────────────────
      if (phaseRef.current === "idle") {
        ctx.fillStyle = "rgba(0,0,0,0.62)";
        ctx.fillRect(0, 0, CW, CH);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = "bold 11px 'Orbitron', monospace";
        ctx.fillStyle = `hsl(${h}, 100%, 75%)`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = `hsl(${h}, 100%, 55%)`;
        ctx.fillText("MATH ARENA × NUMATIK AI", CW / 2, CH / 2 - 125);

        ctx.font = "bold 36px 'Orbitron', monospace";
        ctx.fillStyle = `hsl(${(h + 60) % 360}, 100%, 80%)`;
        ctx.shadowBlur = 32;
        ctx.shadowColor = `hsl(${(h + 60) % 360}, 100%, 60%)`;
        ctx.fillText("🔨 HAJAR MOL!", CW / 2, CH / 2 - 68);

        ctx.font = "13px 'Orbitron', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.78)";
        ctx.shadowBlur = 0;
        const lines = [
          "Mol naik membawa angka-angka!",
          "Klik mol yang membawa jawaban BENAR!",
          "Mol kabur → kehilangan nyawa!",
          "Combo = poin berlipat! 🔥",
        ];
        lines.forEach((l, i) => ctx.fillText(l, CW / 2, CH / 2 - 4 + i * 24));

        ctx.font = "bold 17px 'Orbitron', monospace";
        ctx.fillStyle = `hsl(${h}, 100%, 80%)`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsl(${h}, 100%, 60%)`;
        const pulse = 0.82 + 0.18 * Math.sin(ts / 320);
        ctx.globalAlpha = pulse;
        ctx.fillText("[ KLIK UNTUK MULAI ]", CW / 2, CH / 2 + 105);
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      // ── dead overlay ──────────────────────────────────────────────────────
      if (phaseRef.current === "dead") {
        ctx.fillStyle = "rgba(0,0,0,0.68)";
        ctx.fillRect(0, 0, CW, CH);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = "bold 32px 'Orbitron', monospace";
        ctx.fillStyle = "#ff5e87";
        ctx.shadowBlur = 30;
        ctx.shadowColor = "#ff5e87";
        ctx.fillText("GAME OVER", CW / 2, CH / 2 - 90);

        ctx.font = "bold 20px 'Orbitron', monospace";
        ctx.fillStyle = "#ffc94a";
        ctx.shadowColor = "#ffc94a";
        ctx.shadowBlur = 16;
        ctx.fillText(`Skor: ${scoreRef.current}`, CW / 2, CH / 2 - 38);

        ctx.font = "bold 16px 'Orbitron', monospace";
        ctx.fillStyle = "#72f572";
        ctx.shadowColor = "#72f572";
        ctx.shadowBlur = 12;
        ctx.fillText(`Rekor: ${bestRef.current}`, CW / 2, CH / 2 + 4);

        ctx.font = "13px 'Orbitron', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.shadowBlur = 0;
        ctx.fillText("Hebat! Terus semangat berlatih! 🌟", CW / 2, CH / 2 + 44);

        ctx.font = "bold 15px 'Orbitron', monospace";
        ctx.fillStyle = `hsl(${h}, 100%, 80%)`;
        ctx.shadowBlur = 18;
        ctx.shadowColor = `hsl(${h}, 100%, 60%)`;
        const pulse2 = 0.82 + 0.18 * Math.sin(ts / 320);
        ctx.globalAlpha = pulse2;
        ctx.fillText("[ KLIK UNTUK MAIN LAGI ]", CW / 2, CH / 2 + 95);
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [initHoles, assignValues, scheduleMoles, rerender]);

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`}
    >
      {isLight ? <Snowfall /> : <Starfield />}
      <div className="relative z-10 flex flex-col items-center gap-4 py-6 w-full">
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          style={{
            cursor: "none",
            borderRadius: 20,
            boxShadow: "0 0 40px rgba(100,80,255,0.4), 0 0 80px rgba(80,200,255,0.15)",
            maxWidth: "95vw",
            maxHeight: "90vh",
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

// ── Utility ───────────────────────────────────────────────────────────────────
function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (num >> 16) + Math.round(255 * amount));
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * amount));
  const b = Math.min(255, (num & 0xff) + Math.round(255 * amount));
  return `rgb(${r},${g},${b})`;
}

export default MolSmashPage;
