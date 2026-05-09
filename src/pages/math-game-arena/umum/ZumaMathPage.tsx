import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";

// ── Canvas ─────────────────────────────────────────────────────────────────
const CW = 480;
const CH = 560;
const CANNON_X = 240;
const CANNON_Y = 300;

// ── Ball ───────────────────────────────────────────────────────────────────
const BALL_R = 15;
const SPACING = BALL_R * 2 + 2; // center-to-center
const BASE_SPEED = 0.28;         // t-units per frame (normal)
const FAST_SPEED = 1.8;          // when chain is being pushed back (on wrong)
const PROJ_SPEED = 11;

// ── Colors: 4 vivid saturated colors ──────────────────────────────────────
const C_FILL  = ["#0040c0", "#c00000", "#006600", "#c05000"];
const C_GLOW  = ["#1e90ff", "#ff1a1a", "#00cc00", "#ff7700"];
const C_LIGHT = ["#b0d4ff", "#ffb3b3", "#b3ffb3", "#ffd0a0"];
const C_NAME  = ["BIRU", "MERAH", "HIJAU", "ORANYE"];

// ── Math questions ─────────────────────────────────────────────────────────
interface MQ { q: string; ans: number }
function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }
const makeQ = (): MQ => {
  const t = Math.floor(Math.random() * 8);
  switch (t) {
    case 0: { const a = 2 + Math.floor(Math.random() * 9), b = 2 + Math.floor(Math.random() * 9); return { q: `${a} × ${b}`, ans: a * b }; }
    case 1: { const a = 10 + Math.floor(Math.random() * 80), b = 10 + Math.floor(Math.random() * 60); return { q: `${a} + ${b}`, ans: a + b }; }
    case 2: { const b = 5 + Math.floor(Math.random() * 30), a = b + 5 + Math.floor(Math.random() * 40); return { q: `${a} − ${b}`, ans: a - b }; }
    case 3: { const b = 2 + Math.floor(Math.random() * 9), a = b * (2 + Math.floor(Math.random() * 9)); return { q: `${a} ÷ ${b}`, ans: a / b }; }
    case 4: { const sq = [4,9,16,25,36,49,64,81,100,121][Math.floor(Math.random() * 10)]; return { q: `√${sq}`, ans: Math.round(Math.sqrt(sq)) }; }
    case 5: { const a = 2 + Math.floor(Math.random() * 8); return { q: `${a}²`, ans: a * a }; }
    case 6: { const a = 2 + Math.floor(Math.random() * 9), b = 2 + Math.floor(Math.random() * 9); return { q: `FPB(${a * 2}, ${a * 3})`, ans: a }; }
    default: { const a = 2 + Math.floor(Math.random() * 9), b = 2 + Math.floor(Math.random() * 9); return { q: `KPK(${a},${b})`, ans: a * b / gcd(a, b) }; }
  }
};
const makeWrong = (ans: number, used: Set<number>): number => {
  let v: number, tries = 0;
  do {
    const d = 1 + Math.floor(Math.random() * 15);
    v = ans + (Math.random() < 0.5 ? d : -d);
    tries++;
  } while ((used.has(v) || v <= 0 || v === ans) && tries < 80);
  return Math.max(1, v);
};

// ── Catmull-Rom smooth path ────────────────────────────────────────────────
const CTRL: [number, number][] = [
  [500, 80], [360, 80], [200, 75], [90, 145],
  [80, 240], [160, 320], [330, 360],
  [420, 445], [310, 510], [140, 510],
  [40, 490], [-30, 470],
];

function catmullRomPoint(p0: [number,number], p1: [number,number], p2: [number,number], p3: [number,number], t: number): [number,number] {
  const t2 = t * t, t3 = t2 * t;
  const x = 0.5 * ((2*p1[0]) + (-p0[0]+p2[0])*t + (2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2 + (-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3);
  const y = 0.5 * ((2*p1[1]) + (-p0[1]+p2[1])*t + (2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2 + (-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3);
  return [x, y];
}

// Precompute 800 points along spline
const PATH_PTS: [number,number][] = [];
const STEPS_PER_SEG = 80;
for (let i = 1; i < CTRL.length - 2; i++) {
  const p0 = CTRL[Math.max(0, i-1)], p1 = CTRL[i], p2 = CTRL[i+1], p3 = CTRL[Math.min(CTRL.length-1, i+2)];
  for (let s = 0; s < STEPS_PER_SEG; s++) {
    PATH_PTS.push(catmullRomPoint(p0, p1, p2, p3, s / STEPS_PER_SEG));
  }
}
PATH_PTS.push(CTRL[CTRL.length - 2]);

// Cumulative arc lengths
const CUM_LEN: number[] = [0];
for (let i = 1; i < PATH_PTS.length; i++) {
  const dx = PATH_PTS[i][0] - PATH_PTS[i-1][0];
  const dy = PATH_PTS[i][1] - PATH_PTS[i-1][1];
  CUM_LEN.push(CUM_LEN[i-1] + Math.sqrt(dx*dx + dy*dy));
}
const TOTAL_LEN = CUM_LEN[CUM_LEN.length - 1];

function getPathPos(t: number): [number, number] {
  t = Math.max(0, Math.min(TOTAL_LEN, t));
  let lo = 0, hi = CUM_LEN.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (CUM_LEN[mid] <= t) lo = mid; else hi = mid;
  }
  const frac = CUM_LEN[lo] === CUM_LEN[hi] ? 0 : (t - CUM_LEN[lo]) / (CUM_LEN[hi] - CUM_LEN[lo]);
  const p0 = PATH_PTS[lo], p1 = PATH_PTS[hi];
  return [p0[0] + (p1[0] - p0[0]) * frac, p0[1] + (p1[1] - p0[1]) * frac];
}

// ── Types ──────────────────────────────────────────────────────────────────
interface ChainBall { t: number; color: number; id: number; popAnim: number }
interface Projectile { x: number; y: number; vx: number; vy: number; color: number }
interface Particle { x: number; y: number; vx: number; vy: number; r: number; color: string; a: number }
interface Star { x: number; y: number; r: number; a: number }

let _uid = 0;

// ── Component ──────────────────────────────────────────────────────────────
const ZumaMathPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  // UI state
  const [phase, setPhase] = useState<"idle"|"playing"|"dead"|"win">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [question, setQuestion] = useState("");
  const [opts, setOpts] = useState<number[]>([0, 0, 0, 0]);
  const [correctColor, setCorrectColor] = useState(0);
  const [flashMsg, setFlashMsg] = useState("");
  const [combo, setCombo] = useState(0);

  // Refs
  const phaseRef = useRef<"idle"|"playing"|"dead"|"win">("idle");
  const guruQuiz = useGuruQuiz(phaseRef);
  const chainRef = useRef<ChainBall[]>([]);
  const projRef = useRef<Projectile | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const cannonAngleRef = useRef(0);
  const currentColorRef = useRef(0);
  const nextColorRef = useRef(0);
  const mqRef = useRef<MQ>({ q: "", ans: 0 });
  const optsRef = useRef<number[]>([0, 0, 0, 0]);   // value for each color
  const correctColorRef = useRef(0);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const livesRef = useRef(3);
  const levelRef = useRef(1);
  const comboRef = useRef(0);
  const flashTimerRef = useRef(0);
  const flashMsgTextRef = useRef("");
  const speedRef = useRef(BASE_SPEED);
  const totalBallsRef = useRef(0);
  const maxBallsRef = useRef(35);
  const prevMouseRef = useRef({ x: CANNON_X, y: CANNON_Y - 50 });

  // ── Question setup ─────────────────────────────────────────────────────
  const setupQuestion = useCallback(() => {
    const mq = makeQ();
    mqRef.current = mq;
    const correctC = Math.floor(Math.random() * 4);
    correctColorRef.current = correctC;
    const used = new Set<number>([mq.ans]);
    const vals: number[] = [0, 0, 0, 0];
    vals[correctC] = mq.ans;
    for (let i = 0; i < 4; i++) {
      if (i === correctC) continue;
      const w = makeWrong(mq.ans, used);
      used.add(w);
      vals[i] = w;
    }
    optsRef.current = vals;
    setQuestion(mq.q);
    setOpts([...vals]);
    setCorrectColor(correctC);
  }, []);

  // ── Random color (biased toward correct color slightly) ────────────────
  const randomColor = useCallback(() => Math.floor(Math.random() * 4), []);

  // ── Initialize chain ───────────────────────────────────────────────────
  const initChain = useCallback((lv: number) => {
    const count = 20 + lv * 3;
    const balls: ChainBall[] = [];
    for (let i = 0; i < count; i++) {
      balls.push({ t: i * SPACING, color: randomColor(), id: _uid++, popAnim: 0 });
    }
    chainRef.current = balls;
    totalBallsRef.current = count;
    maxBallsRef.current = count;
  }, [randomColor]);

  // ── Flash ──────────────────────────────────────────────────────────────
  const flash = useCallback((msg: string) => {
    flashMsgTextRef.current = msg;
    flashTimerRef.current = 90;
    setFlashMsg(msg);
  }, []);

  // ── Explode particles ──────────────────────────────────────────────────
  const explode = useCallback((x: number, y: number, color: string, n = 12) => {
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 1.5 + Math.random() * 4;
      particlesRef.current.push({ x, y, vx: Math.cos(angle)*spd, vy: Math.sin(angle)*spd, r: 2+Math.random()*4, color, a: 1 });
    }
  }, []);

  // ── Match check (3+ consecutive same color) ────────────────────────────
  const checkMatch = useCallback((chain: ChainBall[], startIdx: number): [number, number] | null => {
    if (chain.length === 0) return null;
    const c = chain[startIdx].color;
    let lo = startIdx, hi = startIdx;
    while (lo > 0 && chain[lo-1].color === c && Math.abs(chain[lo-1].t - chain[lo].t) <= SPACING + 8) lo--;
    while (hi < chain.length-1 && chain[hi+1].color === c && Math.abs(chain[hi+1].t - chain[hi].t) <= SPACING + 8) hi++;
    if (hi - lo + 1 >= 3) return [lo, hi];
    return null;
  }, []);

  // ── Pop balls ──────────────────────────────────────────────────────────
  const popBalls = useCallback((lo: number, hi: number, chain: ChainBall[]) => {
    const color = chain[lo].color;
    const midPos = getPathPos(chain[Math.floor((lo+hi)/2)].t);
    const isCorrect = color === correctColorRef.current;

    const pts = (hi - lo + 1) * (isCorrect ? 80 : 30) * (1 + comboRef.current * 0.2);
    scoreRef.current += Math.round(pts);
    setScore(scoreRef.current);

    for (let i = lo; i <= hi; i++) {
      const pos = getPathPos(chain[i].t);
      explode(pos[0], pos[1], C_GLOW[color], 10);
    }
    chain.splice(lo, hi - lo + 1);

    if (isCorrect) {
      comboRef.current++;
      setCombo(comboRef.current);
      playPopSound();
      flash(`✅ JAWABAN BENAR! +${Math.round(pts)} (COMBO x${comboRef.current})`);
      setupQuestion();
    } else {
      comboRef.current = 0;
      setCombo(0);
      flash(`💥 +${Math.round(pts)} poin`);
    }

    explode(midPos[0], midPos[1], "#ffffff", 6);

    // cascade check
    if (lo > 0 && lo < chain.length) {
      const match = checkMatch(chain, lo);
      if (match) {
        setTimeout(() => popBalls(match[0], match[1], chain), 80);
      }
    }
  }, [explode, flash, setupQuestion, checkMatch]);

  // ── Start game ─────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    playPopSound();
    phaseRef.current = "playing";
    setPhase("playing");
    scoreRef.current = 0;
    livesRef.current = 3;
    levelRef.current = 1;
    comboRef.current = 0;
    speedRef.current = BASE_SPEED;
    setScore(0); setLives(3); setLevel(1); setCombo(0); setFlashMsg("");
    particlesRef.current = [];
    projRef.current = null;
    currentColorRef.current = randomColor();
    nextColorRef.current = randomColor();
    starsRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * CW, y: Math.random() * CH,
      r: 0.4 + Math.random() * 2, a: 0.3 + Math.random() * 0.7,
    }));
    initChain(1);
    setupQuestion();
  }, [randomColor, initChain, setupQuestion]);

  // ── Shoot ──────────────────────────────────────────────────────────────
  const shoot = useCallback(() => {
    if (projRef.current) return;
    if (phaseRef.current !== "playing") return;
    const angle = cannonAngleRef.current;
    projRef.current = {
      x: CANNON_X, y: CANNON_Y,
      vx: Math.cos(angle) * PROJ_SPEED,
      vy: Math.sin(angle) * PROJ_SPEED,
      color: currentColorRef.current,
    };
    currentColorRef.current = nextColorRef.current;
    nextColorRef.current = randomColor();
  }, [randomColor]);

  // ── Swap cannon color ──────────────────────────────────────────────────
  const swapColor = useCallback(() => {
    const tmp = currentColorRef.current;
    currentColorRef.current = nextColorRef.current;
    nextColorRef.current = tmp;
  }, []);

  // ── Mouse / touch aim ──────────────────────────────────────────────────
  const updateAngle = useCallback((cx: number, cy: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scaleX = CW / rect.width;
    const scaleY = CH / rect.height;
    const mx = (cx - rect.left) * scaleX;
    const my = (cy - rect.top) * scaleY;
    cannonAngleRef.current = Math.atan2(my - CANNON_Y, mx - CANNON_X);
    prevMouseRef.current = { x: mx, y: my };
  }, []);

  // ── Game loop ──────────────────────────────────────────────────────────
  const loop = useCallback(() => {
    if (guruQuiz.isPausedRef.current) { rafRef.current = requestAnimationFrame(loop); return; }
    rafRef.current = requestAnimationFrame(loop);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || phaseRef.current !== "playing") return;

    const chain = chainRef.current;

    // ── Move chain forward ──────────────────────────────────────────
    const spd = speedRef.current + levelRef.current * 0.03;
    for (const b of chain) b.t += spd;

    // ── Spawn new balls at tail ─────────────────────────────────────
    if (chain.length > 0 && totalBallsRef.current < maxBallsRef.current) {
      const tailT = chain[0].t;
      if (tailT >= SPACING) {
        chain.unshift({ t: 0, color: randomColor(), id: _uid++, popAnim: 0 });
        totalBallsRef.current++;
      }
    }

    // ── Check game over (front ball reaches hole) ───────────────────
    if (chain.length > 0 && chain[chain.length-1].t >= TOTAL_LEN - 5) {
      livesRef.current--;
      setLives(livesRef.current);
      // Remove balls that passed
      while (chain.length > 0 && chain[chain.length-1].t >= TOTAL_LEN - 5) chain.pop();
      comboRef.current = 0;
      setCombo(0);
      if (livesRef.current <= 0) {
        phaseRef.current = "dead";
        setPhase("dead");
        if (scoreRef.current > bestRef.current) { bestRef.current = scoreRef.current; setBest(bestRef.current); }
      } else {
        flash("💥 Bola masuk lubang! −1 nyawa");
      }
    }

    // ── Check win (all balls cleared) ──────────────────────────────
    if (chain.length === 0 && totalBallsRef.current >= maxBallsRef.current) {
      if (levelRef.current >= 8) {
        phaseRef.current = "win";
        setPhase("win");
        if (scoreRef.current > bestRef.current) { bestRef.current = scoreRef.current; setBest(bestRef.current); }
      } else {
        levelRef.current++;
        setLevel(levelRef.current);
        totalBallsRef.current = 0;
        initChain(levelRef.current);
        flash(`🚀 Level ${levelRef.current}! Rantai baru datang...`);
      }
    }

    // ── Move projectile ─────────────────────────────────────────────
    if (projRef.current) {
      const pr = projRef.current;
      pr.x += pr.vx; pr.y += pr.vy;

      // Bounce off walls
      if (pr.x < BALL_R) { pr.x = BALL_R; pr.vx *= -1; }
      if (pr.x > CW - BALL_R) { pr.x = CW - BALL_R; pr.vx *= -1; }
      if (pr.y < BALL_R) { pr.y = BALL_R; pr.vy *= -1; }
      if (pr.y > CH - BALL_R) projRef.current = null;

      if (projRef.current) {
        // Collision with chain
        let hitIdx = -1, hitDist = Infinity;
        for (let i = 0; i < chain.length; i++) {
          const pos = getPathPos(chain[i].t);
          const dx = pr.x - pos[0], dy = pr.y - pos[1];
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < BALL_R * 2 && d < hitDist) { hitDist = d; hitIdx = i; }
        }
        if (hitIdx >= 0) {
          // Insert ball near hitIdx
          const hitPos = getPathPos(chain[hitIdx].t);
          const dx = pr.x - hitPos[0], dy = pr.y - hitPos[1];
          const dot = dx * pr.vx + dy * pr.vy;
          const insertIdx = dot < 0 ? hitIdx + 1 : hitIdx;
          const insertT = insertIdx < chain.length ? Math.max(0, chain[insertIdx > 0 ? insertIdx - 1 : 0].t - SPACING) : chain[chain.length - 1].t + SPACING;
          const newBall: ChainBall = { t: Math.max(0, insertT), color: pr.color, id: _uid++, popAnim: 0 };
          chain.splice(Math.min(insertIdx, chain.length), 0, newBall);
          projRef.current = null;

          // Sort by t (just the inserted region)
          chain.sort((a, b) => a.t - b.t);

          // Re-space around inserted ball
          const ni = chain.findIndex(b => b.id === newBall.id);
          if (ni >= 0) {
            for (let k = ni - 1; k >= 0; k--) {
              const needed = chain[k+1].t - SPACING;
              if (chain[k].t > needed) chain[k].t = needed;
              else break;
            }
            for (let k = ni + 1; k < chain.length; k++) {
              const needed = chain[k-1].t + SPACING;
              if (chain[k].t < needed) chain[k].t = needed;
              else break;
            }

            // Check for match
            const match = checkMatch(chain, ni);
            if (match) popBalls(match[0], match[1], chain);
          }
        }
      }
    }

    // ── Update particles ────────────────────────────────────────────
    particlesRef.current = particlesRef.current.filter(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.a -= 0.022; return p.a > 0;
    });

    // ── Flash ───────────────────────────────────────────────────────
    if (flashTimerRef.current > 0) { flashTimerRef.current--; if (flashTimerRef.current === 0) setFlashMsg(""); }

    // ══════════════ DRAW ════════════════════════════════════════════
    ctx.fillStyle = "#00000f";
    ctx.fillRect(0, 0, CW, CH);

    // Stars
    for (const s of starsRef.current) {
      ctx.globalAlpha = s.a;
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Path track (dashed glow trail)
    ctx.save();
    ctx.strokeStyle = "#ffffff18";
    ctx.lineWidth = BALL_R * 2 + 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(PATH_PTS[0][0], PATH_PTS[0][1]);
    for (let i = 1; i < PATH_PTS.length; i++) ctx.lineTo(PATH_PTS[i][0], PATH_PTS[i][1]);
    ctx.stroke();
    ctx.strokeStyle = "#00ffcc0a";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 12]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Hole indicator at end of path
    const holePos = getPathPos(TOTAL_LEN);
    ctx.save();
    ctx.shadowColor = "#ff0000"; ctx.shadowBlur = 20;
    ctx.strokeStyle = "#ff4444"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(holePos[0], holePos[1], 14, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = "#00000f";
    ctx.beginPath(); ctx.arc(holePos[0], holePos[1], 11, 0, Math.PI*2); ctx.fill();
    ctx.font = "10px monospace"; ctx.fillStyle = "#ff4444"; ctx.textAlign = "center";
    ctx.fillText("☠", holePos[0], holePos[1] + 4);
    ctx.restore();

    // Entry indicator
    const entryPos = getPathPos(0);
    ctx.save();
    ctx.shadowColor = "#00ff88"; ctx.shadowBlur = 10;
    ctx.fillStyle = "#00ff8844";
    ctx.beginPath(); ctx.arc(entryPos[0], entryPos[1], 10, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    // Draw chain balls
    for (const b of chain) {
      const [bx, by] = getPathPos(b.t);
      const g = C_GLOW[b.color], f = C_FILL[b.color], l = C_LIGHT[b.color];
      ctx.save();
      ctx.shadowColor = g; ctx.shadowBlur = 14;
      // outer ring
      ctx.strokeStyle = g; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(bx, by, BALL_R, 0, Math.PI*2); ctx.stroke();
      // fill
      const grad = ctx.createRadialGradient(bx-4, by-4, 1, bx, by, BALL_R);
      grad.addColorStop(0, l);
      grad.addColorStop(0.4, g);
      grad.addColorStop(1, f);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(bx, by, BALL_R - 1, 0, Math.PI*2); ctx.fill();
      // value text
      ctx.font = `bold 9px monospace`;
      ctx.textAlign = "center";
      ctx.fillStyle = "#000";
      ctx.fillText(String(optsRef.current[b.color]), bx, by + 3);
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // Draw projectile
    if (projRef.current) {
      const pr = projRef.current;
      const g = C_GLOW[pr.color], l = C_LIGHT[pr.color], f = C_FILL[pr.color];
      ctx.save();
      ctx.shadowColor = g; ctx.shadowBlur = 20;
      const grad = ctx.createRadialGradient(pr.x-4, pr.y-4, 1, pr.x, pr.y, BALL_R);
      grad.addColorStop(0, l); grad.addColorStop(0.5, g); grad.addColorStop(1, f);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(pr.x, pr.y, BALL_R, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = g; ctx.lineWidth = 2;
      ctx.stroke();
      ctx.font = "bold 9px monospace"; ctx.textAlign = "center"; ctx.fillStyle = "#000";
      ctx.fillText(String(optsRef.current[pr.color]), pr.x, pr.y + 3);
      ctx.restore();
    }

    // Draw cannon
    const angle = cannonAngleRef.current;
    const barrelLen = 36, barrelW = 10;
    ctx.save();
    ctx.translate(CANNON_X, CANNON_Y);
    // base circle
    ctx.shadowColor = "#00ffcc"; ctx.shadowBlur = 20;
    const baseGrad = ctx.createRadialGradient(-4, -4, 2, 0, 0, 28);
    baseGrad.addColorStop(0, "#00ffcc"); baseGrad.addColorStop(0.5, "#0891b2"); baseGrad.addColorStop(1, "#0c1a2e");
    ctx.fillStyle = baseGrad;
    ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = "#00ffcc88"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI*2); ctx.stroke();
    // next ball preview (small dot at bottom)
    ctx.fillStyle = C_GLOW[nextColorRef.current];
    ctx.shadowColor = C_GLOW[nextColorRef.current]; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(0, 16, 6, 0, Math.PI*2); ctx.fill();
    // current ball indicator
    const cg = C_GLOW[currentColorRef.current], cf = C_FILL[currentColorRef.current], cl = C_LIGHT[currentColorRef.current];
    ctx.shadowColor = cg; ctx.shadowBlur = 12;
    const cgrad = ctx.createRadialGradient(-2, -2, 1, 0, -2, 11);
    cgrad.addColorStop(0, cl); cgrad.addColorStop(0.5, cg); cgrad.addColorStop(1, cf);
    ctx.fillStyle = cgrad;
    ctx.beginPath(); ctx.arc(0, -2, 11, 0, Math.PI*2); ctx.fill();
    ctx.font = "bold 8px monospace"; ctx.textAlign = "center"; ctx.fillStyle = "#000";
    ctx.fillText(String(optsRef.current[currentColorRef.current]), 0, 1);
    // barrel
    ctx.rotate(angle);
    ctx.shadowColor = "#00ffcc"; ctx.shadowBlur = 10;
    ctx.fillStyle = "#0891b2";
    ctx.beginPath();
    ctx.roundRect(14, -barrelW/2, barrelLen, barrelW, 4);
    ctx.fill();
    ctx.strokeStyle = "#00ffcc"; ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Draw particles
    for (const p of particlesRef.current) {
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;

    // Flash message
    if (flashTimerRef.current > 0) {
      ctx.globalAlpha = Math.min(1, flashTimerRef.current / 25);
      ctx.font = "bold 15px monospace"; ctx.textAlign = "center";
      ctx.fillStyle = "#fff"; ctx.shadowColor = "#00ffcc"; ctx.shadowBlur = 14;
      ctx.fillText(flashMsgTextRef.current, CW/2, CANNON_Y - 50);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.textAlign = "left";
    }
  }, [randomColor, initChain, setupQuestion, flash, explode, checkMatch, popBalls]);

  // ── Setup loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    starsRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * CW, y: Math.random() * CH,
      r: 0.5 + Math.random() * 2, a: 0.3 + Math.random() * 0.7,
    }));
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop]);

  // ── Event listeners ────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => updateAngle(e.clientX, e.clientY);
    const onClick = (e: MouseEvent) => {
      if (phaseRef.current !== "playing") return;
      updateAngle(e.clientX, e.clientY);
      shoot();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "z" || e.key === "Z") { e.preventDefault(); shoot(); }
      if (e.key === "s" || e.key === "S" || e.key === "x" || e.key === "X") swapColor();
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [updateAngle, shoot, swapColor]);

  // ── Touch handlers on canvas ───────────────────────────────────────────
  const handleTouch = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.touches[0];
    updateAngle(t.clientX, t.clientY);
    shoot();
  }, [updateAngle, shoot]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.touches[0];
    updateAngle(t.clientX, t.clientY);
  }, [updateAngle]);

  return (
    <div className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}
      <div className="relative z-10 flex flex-col items-center px-4 pt-7 pb-4 w-full max-w-lg">
        <div className="flex items-center justify-between w-full mb-1">
          <button
            onClick={() => { playPopSound(); navigate('/ruang-untuk-guru/numatik-game'); }}
            className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all text-sm"
            title="Menu Utama"
          >
            🏠
          </button>
          <h1 className="font-display text-2xl font-bold text-primary text-glow-cyan mb-1 text-center flex-1">
            🔮 ZUMA MATH
          </h1>
          <button
            onClick={() => { playPopSound(); navigate(-1); }}
            className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all font-bold"
            title="Keluar"
          >
            ✕
          </button>
        </div>
        <p className="text-white/50 text-xs font-body mb-3 text-center">
          Tembak bola warna yang cocok untuk meledakkan rantai!
        </p>

        {/* Question panel */}
        {phase === "playing" && (
          <div className="bg-black/60 border border-white/10 rounded-xl px-4 py-2 mb-3 w-full max-w-sm">
            <p className="text-center text-white/60 text-xs font-body mb-1">❓ Soal:</p>
            <p className="text-center text-yellow-300 font-display text-lg font-bold mb-2">{question} = ?</p>
            <div className="grid grid-cols-4 gap-1">
              {opts.map((val, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div className="rounded-full w-6 h-6 border-2 flex items-center justify-center text-[10px] font-bold text-black"
                    style={{ background: C_GLOW[i], borderColor: C_LIGHT[i], boxShadow: `0 0 8px ${C_GLOW[i]}` }}>
                    {i === correctColor ? "★" : ""}
                  </div>
                  <span className="text-white text-[10px] font-mono font-bold">{val}</span>
                  <span className="text-white/40 text-[8px] font-body">{C_NAME[i]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Canvas */}
        <div className="relative" style={{ width: CW, maxWidth: "100%", maxHeight: 'calc(100dvh - 265px)', aspectRatio: `${CW}/${CH}` }}>
          <canvas
            ref={canvasRef}
            width={CW} height={CH}
            className="rounded-xl border border-white/10 shadow-2xl w-full h-full cursor-crosshair"
            style={{ touchAction: "none" }}
            onTouchStart={handleTouch}
            onTouchMove={handleTouchMove}
          />

          {/* IDLE overlay */}
          {phase === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 rounded-xl gap-4">
              <div className="text-5xl">🔮</div>
              <h2 className="font-display text-2xl text-white text-glow-cyan">ZUMA MATH</h2>
              <div className="text-white/60 text-xs text-center max-w-xs font-body px-4 space-y-1">
                <p>Bola-bola berwarna bergerak menuju lubang <span className="text-red-400">☠</span></p>
                <p>Tembak bola dari meriam untuk mencocokkan <span className="text-yellow-400">3+ bola</span> warna yang sama!</p>
                <p>Setiap warna = satu pilihan jawaban soal.</p>
                <p><span className="text-yellow-400">★</span> Tembak warna BENAR = BONUS besar!</p>
                <p className="text-white/40 pt-1">🖱️ Gerak mouse = arah | Klik/Space = tembak<br/>S/X = tukar warna | 📱 Sentuh untuk mobile</p>
              </div>
              <button onClick={startGame} className="px-8 py-3 bg-accent text-black font-display font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-glow">
                MULAI
              </button>
              {best > 0 && <p className="text-yellow-400 text-xs font-body">🏆 Rekor: {best}</p>}
            </div>
          )}

          {/* DEAD overlay */}
          {phase === "dead" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-xl gap-3">
              <div className="text-5xl">☠️</div>
              <h2 className="font-display text-2xl text-red-400">GAME OVER</h2>
              <p className="text-white font-body">Skor: <span className="text-yellow-400 font-bold">{score}</span></p>
              {score >= best && score > 0 && <p className="text-green-400 text-sm font-body">🏆 Rekor baru!</p>}
              <p className="text-white/50 text-xs font-body">Rekor: {best}</p>
              <button onClick={startGame} className="mt-2 px-8 py-3 bg-accent text-black font-display font-bold rounded-full hover:scale-105 transition-transform">MAIN LAGI</button>
              <button onClick={() => { playPopSound(); navigate(-1); }} className="text-white/40 text-xs hover:text-white font-body cursor-pointer">Kembali ke Menu</button>
            </div>
          )}

          {/* WIN overlay */}
          {phase === "win" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-xl gap-3">
              <div className="text-5xl">🏆</div>
              <h2 className="font-display text-2xl text-yellow-400">MENANG!</h2>
              <p className="text-white font-body">Semua level selesai!</p>
              <p className="text-white font-body">Skor: <span className="text-yellow-400 font-bold">{score}</span></p>
              {score >= best && <p className="text-green-400 text-sm font-body">🏆 Rekor baru!</p>}
              <button onClick={startGame} className="mt-2 px-8 py-3 bg-accent text-black font-display font-bold rounded-full hover:scale-105 transition-transform">MAIN LAGI</button>
              <button onClick={() => { playPopSound(); navigate(-1); }} className="text-white/40 text-xs hover:text-white font-body cursor-pointer">Kembali ke Menu</button>
            </div>
          )}
        </div>

        {/* Stats + swap button */}
        {phase === "playing" && (
          <div className="flex items-center gap-4 mt-3">
            <span className="text-xs font-body text-white/60">❤️ {lives}</span>
            <span className="text-xs font-body text-white/60">⭐ {score}</span>
            <span className="text-xs font-body text-white/60">🔥 x{combo}</span>
            <span className="text-xs font-body text-white/60">📶 Lv{level}</span>
            <button
              onClick={swapColor}
              className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-xs font-body hover:bg-white/20 transition cursor-pointer"
            >
              ↔ Tukar Warna (S)
            </button>
          </div>
        )}

        {flashMsg && phase === "playing" && (
          <p className="mt-1 text-xs font-body text-center text-white/80 animate-pulse">{flashMsg}</p>
        )}

        {/* Touch shoot button */}
        {phase === "playing" && (
          <div className="mt-3 flex gap-3">
            <button
              className="px-6 py-3 bg-cyan-500/20 border border-cyan-400/40 rounded-full text-white text-sm font-bold cursor-pointer select-none active:opacity-60"
              onPointerDown={(e) => { e.preventDefault(); shoot(); }}
            >
              🔫 TEMBAK
            </button>
            <button
              className="px-6 py-3 bg-purple-500/20 border border-purple-400/40 rounded-full text-white text-sm font-bold cursor-pointer select-none active:opacity-60"
              onPointerDown={(e) => { e.preventDefault(); swapColor(); }}
            >
              ↔ TUKAR
            </button>
          </div>
        )}
      <GuruQuizOverlay {...guruQuiz} />
      </div>
    </div>
  );
};

export default ZumaMathPage;
