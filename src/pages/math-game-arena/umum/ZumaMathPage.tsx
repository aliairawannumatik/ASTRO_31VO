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

// ── Shade hex color by pct (negative = darker) ────────────────────────────
function shadeColor(hex: string, pct: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + pct));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + pct));
  const b = Math.max(0, Math.min(255, (num & 0xff) + pct));
  return `rgb(${r},${g},${b})`;
}

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
  const frameRef = useRef(0);
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
    frameRef.current++;
    const frame = frameRef.current;

    // ── Background: deep space gradient + nebula patches ─────────────
    const bgGrad = ctx.createRadialGradient(CW/2, CH*0.4, 0, CW/2, CH/2, CW);
    bgGrad.addColorStop(0, "#0d1a3a");
    bgGrad.addColorStop(0.55, "#06102a");
    bgGrad.addColorStop(1, "#020810");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CW, CH);

    const neb1 = ctx.createRadialGradient(90, 160, 0, 90, 160, 130);
    neb1.addColorStop(0, "rgba(0,80,200,0.09)"); neb1.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = neb1; ctx.fillRect(0, 0, CW, CH);

    const neb2 = ctx.createRadialGradient(390, 420, 0, 390, 420, 160);
    neb2.addColorStop(0, "rgba(100,0,180,0.08)"); neb2.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = neb2; ctx.fillRect(0, 0, CW, CH);

    const neb3 = ctx.createRadialGradient(260, 50, 0, 260, 50, 100);
    neb3.addColorStop(0, "rgba(0,180,100,0.05)"); neb3.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = neb3; ctx.fillRect(0, 0, CW, CH);

    // Twinkling stars
    for (let si = 0; si < starsRef.current.length; si++) {
      const s = starsRef.current[si];
      const twinkle = s.a * (0.45 + 0.55 * Math.sin(frame * 0.038 + si * 1.73));
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = si % 5 === 0 ? "#aaddff" : si % 7 === 0 ? "#ffddaa" : "#ffffff";
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = s.r > 1.2 ? 5 : 0;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;

    // ── Path track: multi-layer 3D groove ────────────────────────────
    ctx.save();
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    const drawPath = () => {
      ctx.beginPath();
      ctx.moveTo(PATH_PTS[0][0], PATH_PTS[0][1]);
      for (let i = 1; i < PATH_PTS.length; i++) ctx.lineTo(PATH_PTS[i][0], PATH_PTS[i][1]);
    };
    // Outer shadow
    ctx.strokeStyle = "rgba(0,0,0,0.75)"; ctx.lineWidth = BALL_R * 2 + 18;
    drawPath(); ctx.stroke();
    // Deep groove base
    ctx.strokeStyle = "rgba(0,15,40,0.95)"; ctx.lineWidth = BALL_R * 2 + 10;
    drawPath(); ctx.stroke();
    // Mid glow rim
    ctx.strokeStyle = "rgba(0,70,140,0.38)"; ctx.lineWidth = BALL_R * 2 + 4;
    drawPath(); ctx.stroke();
    // Dark channel floor
    ctx.strokeStyle = "rgba(0,5,18,0.92)"; ctx.lineWidth = BALL_R * 2 - 6;
    drawPath(); ctx.stroke();
    // Top edge highlight (3D look)
    ctx.strokeStyle = "rgba(0,210,255,0.13)"; ctx.lineWidth = 2;
    drawPath(); ctx.stroke();
    // Animated dashed guide
    ctx.strokeStyle = "rgba(0,255,200,0.07)"; ctx.lineWidth = 1;
    ctx.setLineDash([6, 14]); ctx.lineDashOffset = -(frame * 0.6);
    drawPath(); ctx.stroke();
    ctx.setLineDash([]); ctx.lineDashOffset = 0;
    ctx.restore();

    // ── Entry portal ──────────────────────────────────────────────────
    const entryPos = getPathPos(0);
    ctx.save();
    const entryPulse = 0.5 + 0.5 * Math.sin(frame * 0.07);
    ctx.shadowColor = "#00ff88"; ctx.shadowBlur = 14 + 6 * entryPulse;
    for (let ri = 0; ri < 3; ri++) {
      ctx.globalAlpha = (0.18 + ri * 0.14) * entryPulse;
      ctx.strokeStyle = "#00ff88"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(entryPos[0], entryPos[1], 5 + ri * 5, 0, Math.PI*2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#00ff8890";
    ctx.beginPath(); ctx.arc(entryPos[0], entryPos[1], 5, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    // ── Hole: pulsing danger vortex ───────────────────────────────────
    const holePos = getPathPos(TOTAL_LEN);
    const holePulse = 0.5 + 0.5 * Math.sin(frame * 0.09);
    ctx.save();
    ctx.shadowColor = "#ff2200"; ctx.shadowBlur = 18 + holePulse * 16;
    ctx.strokeStyle = `rgba(255,55,30,${0.45 + holePulse * 0.55})`; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(holePos[0], holePos[1], 16 + holePulse * 4, 0, Math.PI*2); ctx.stroke();
    const holeGrad = ctx.createRadialGradient(holePos[0], holePos[1], 0, holePos[0], holePos[1], 13);
    holeGrad.addColorStop(0, "#000000"); holeGrad.addColorStop(0.5, "#200005"); holeGrad.addColorStop(1, "#5a0010");
    ctx.fillStyle = holeGrad;
    ctx.beginPath(); ctx.arc(holePos[0], holePos[1], 13, 0, Math.PI*2); ctx.fill();
    const rot = frame * 0.06;
    for (let ri = 0; ri < 3; ri++) {
      const a = rot + (ri / 3) * Math.PI * 2;
      ctx.globalAlpha = 0.5 + 0.4 * Math.sin(frame * 0.1 + ri);
      ctx.strokeStyle = "#ff5533"; ctx.lineWidth = 1.5; ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.arc(holePos[0], holePos[1], 8, a, a + Math.PI * 0.7); ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    ctx.font = "bold 11px sans-serif"; ctx.fillStyle = "#ff4444"; ctx.textAlign = "center";
    ctx.fillText("☠", holePos[0], holePos[1] + 4);
    ctx.restore();

    // ── Connector wire between chain balls ────────────────────────────
    if (chain.length > 1) {
      ctx.save();
      ctx.globalAlpha = 0.22; ctx.lineWidth = 3; ctx.lineCap = "round";
      for (let ci = 0; ci < chain.length - 1; ci++) {
        const [ax, ay] = getPathPos(chain[ci].t);
        const [bx2, by2] = getPathPos(chain[ci+1].t);
        ctx.strokeStyle = C_GLOW[chain[ci].color];
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx2, by2); ctx.stroke();
      }
      ctx.restore();
    }

    // ── Draw chain balls (3D sphere with specular highlight) ──────────
    for (const b of chain) {
      const [bx, by] = getPathPos(b.t);
      const g = C_GLOW[b.color], f = C_FILL[b.color], l = C_LIGHT[b.color];
      ctx.save();
      // Glow ring
      ctx.shadowColor = g; ctx.shadowBlur = 14;
      ctx.strokeStyle = g + "88"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(bx, by, BALL_R + 1.5, 0, Math.PI*2); ctx.stroke();
      // 3D main gradient (highlight top-left)
      const hx = bx - BALL_R * 0.3, hy = by - BALL_R * 0.38;
      const grad = ctx.createRadialGradient(hx, hy, 0, bx, by, BALL_R);
      grad.addColorStop(0, l); grad.addColorStop(0.28, g);
      grad.addColorStop(0.65, f); grad.addColorStop(1, shadeColor(f, -40));
      ctx.fillStyle = grad; ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(bx, by, BALL_R, 0, Math.PI*2); ctx.fill();
      // Specular highlight
      const specG = ctx.createRadialGradient(hx, hy, 0, hx, hy, BALL_R * 0.52);
      specG.addColorStop(0, "rgba(255,255,255,0.88)");
      specG.addColorStop(0.45, "rgba(255,255,255,0.28)");
      specG.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = specG;
      ctx.beginPath(); ctx.arc(bx, by, BALL_R, 0, Math.PI*2); ctx.fill();
      // Bottom rim reflection
      const rimG = ctx.createRadialGradient(bx + BALL_R*0.2, by + BALL_R*0.5, 0, bx, by, BALL_R);
      rimG.addColorStop(0, "rgba(255,255,255,0.14)"); rimG.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = rimG;
      ctx.beginPath(); ctx.arc(bx, by, BALL_R, 0, Math.PI*2); ctx.fill();
      // Number text
      ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center";
      ctx.shadowBlur = 4; ctx.shadowColor = "rgba(0,0,0,0.95)";
      ctx.fillStyle = "#fff";
      ctx.fillText(String(optsRef.current[b.color]), bx, by + 3.5);
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // ── Aiming trajectory line ────────────────────────────────────────
    {
      const aimAngle = cannonAngleRef.current;
      const barrelLen = 36;
      const tipX = CANNON_X + Math.cos(aimAngle) * (14 + barrelLen + 4);
      const tipY = CANNON_Y + Math.sin(aimAngle) * (14 + barrelLen + 4);
      const aimColor = C_GLOW[currentColorRef.current];
      ctx.save();
      ctx.globalAlpha = 0.26; ctx.strokeStyle = aimColor; ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 9]); ctx.lineDashOffset = -(frame * 0.4);
      ctx.shadowColor = aimColor; ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.moveTo(tipX, tipY);
      ctx.lineTo(tipX + Math.cos(aimAngle) * 300, tipY + Math.sin(aimAngle) * 300);
      ctx.stroke();
      ctx.setLineDash([]); ctx.lineDashOffset = 0;
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // ── Draw projectile (3D sphere + speed trail) ─────────────────────
    if (projRef.current) {
      const pr = projRef.current;
      const g = C_GLOW[pr.color], l = C_LIGHT[pr.color], f = C_FILL[pr.color];
      ctx.save();
      // Speed trail
      for (let ti = 1; ti <= 3; ti++) {
        ctx.globalAlpha = 0.14 - ti * 0.03;
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(pr.x - pr.vx * ti * 0.8, pr.y - pr.vy * ti * 0.8, BALL_R * (1 - ti * 0.18), 0, Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowColor = g; ctx.shadowBlur = 22;
      const hx = pr.x - BALL_R * 0.3, hy = pr.y - BALL_R * 0.38;
      const grad = ctx.createRadialGradient(hx, hy, 0, pr.x, pr.y, BALL_R);
      grad.addColorStop(0, l); grad.addColorStop(0.28, g);
      grad.addColorStop(0.65, f); grad.addColorStop(1, shadeColor(f, -40));
      ctx.fillStyle = grad; ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(pr.x, pr.y, BALL_R, 0, Math.PI*2); ctx.fill();
      const specG = ctx.createRadialGradient(hx, hy, 0, hx, hy, BALL_R * 0.52);
      specG.addColorStop(0, "rgba(255,255,255,0.88)");
      specG.addColorStop(0.45, "rgba(255,255,255,0.28)");
      specG.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = specG;
      ctx.beginPath(); ctx.arc(pr.x, pr.y, BALL_R, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.shadowBlur = 16; ctx.shadowColor = g;
      ctx.beginPath(); ctx.arc(pr.x, pr.y, BALL_R + 1, 0, Math.PI*2); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center";
      ctx.shadowBlur = 4; ctx.shadowColor = "rgba(0,0,0,0.95)";
      ctx.fillStyle = "#fff";
      ctx.fillText(String(optsRef.current[pr.color]), pr.x, pr.y + 3.5);
      ctx.restore();
    }

    // ── Draw cannon: mechanical turret ────────────────────────────────
    {
      const angle = cannonAngleRef.current;
      const barrelLen = 36, barrelW = 10;
      ctx.save();
      ctx.translate(CANNON_X, CANNON_Y);
      // Ellipse shadow on floor
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = "#000";
      ctx.beginPath(); ctx.ellipse(0, 10, 26, 7, 0, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
      // Slowly rotating outer dashed ring
      ctx.strokeStyle = "#00ffcc30"; ctx.lineWidth = 1;
      ctx.setLineDash([3, 7]); ctx.lineDashOffset = frame * 0.25;
      ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI*2); ctx.stroke();
      ctx.setLineDash([]); ctx.lineDashOffset = 0;
      // Base plate
      ctx.shadowColor = "#00ffcc"; ctx.shadowBlur = 22;
      const baseGrad = ctx.createRadialGradient(-7, -9, 2, 0, 0, 26);
      baseGrad.addColorStop(0, "#3af0d0");
      baseGrad.addColorStop(0.25, "#0e9abf");
      baseGrad.addColorStop(0.6, "#0a4570");
      baseGrad.addColorStop(1, "#040e20");
      ctx.fillStyle = baseGrad;
      ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI*2); ctx.fill();
      // Metallic rim
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#00ffcc55"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI*2); ctx.stroke();
      // Sheen arc (top-left highlight for 3D dome look)
      ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(-5, -7, 20, 1.1 * Math.PI, 1.65 * Math.PI); ctx.stroke();
      // Inner panel
      const innerGrad = ctx.createRadialGradient(-3, -4, 1, 0, 0, 16);
      innerGrad.addColorStop(0, "#1a4a60"); innerGrad.addColorStop(1, "#040e20");
      ctx.fillStyle = innerGrad;
      ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI*2); ctx.fill();
      // Next ball preview (bottom slot)
      const nc = nextColorRef.current;
      ctx.shadowColor = C_GLOW[nc]; ctx.shadowBlur = 8;
      const nbGrad = ctx.createRadialGradient(-1.5, 12.5, 0, 0, 15, 6);
      nbGrad.addColorStop(0, C_LIGHT[nc]); nbGrad.addColorStop(0.5, C_GLOW[nc]); nbGrad.addColorStop(1, C_FILL[nc]);
      ctx.fillStyle = nbGrad;
      ctx.beginPath(); ctx.arc(0, 15, 6, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.font = "bold 6px sans-serif"; ctx.textAlign = "center";
      ctx.fillStyle = "#000"; ctx.fillText(String(optsRef.current[nc]), 0, 17.5);
      // Current ball (3D sphere)
      const cc = currentColorRef.current;
      ctx.shadowColor = C_GLOW[cc]; ctx.shadowBlur = 14;
      const cHx = -3.5, cHy = -5.5;
      const cGrad = ctx.createRadialGradient(cHx, cHy, 0, 0, -2, 11);
      cGrad.addColorStop(0, C_LIGHT[cc]); cGrad.addColorStop(0.28, C_GLOW[cc]);
      cGrad.addColorStop(0.65, C_FILL[cc]); cGrad.addColorStop(1, shadeColor(C_FILL[cc], -40));
      ctx.fillStyle = cGrad; ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(0, -2, 11, 0, Math.PI*2); ctx.fill();
      const cSpecG = ctx.createRadialGradient(cHx, cHy, 0, cHx, cHy, 7);
      cSpecG.addColorStop(0, "rgba(255,255,255,0.82)"); cSpecG.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = cSpecG;
      ctx.beginPath(); ctx.arc(0, -2, 11, 0, Math.PI*2); ctx.fill();
      ctx.font = "bold 8px sans-serif"; ctx.textAlign = "center";
      ctx.fillStyle = "#000"; ctx.shadowBlur = 0;
      ctx.fillText(String(optsRef.current[cc]), 0, 1.5);
      // Barrel (rotates with aim)
      ctx.rotate(angle);
      ctx.shadowColor = "#00ffcc"; ctx.shadowBlur = 12;
      const barrelGrad = ctx.createLinearGradient(0, -barrelW/2, 0, barrelW/2);
      barrelGrad.addColorStop(0, "#5af0e0");
      barrelGrad.addColorStop(0.22, "#0bb8d4");
      barrelGrad.addColorStop(0.55, "#066a88");
      barrelGrad.addColorStop(1, "#022535");
      ctx.fillStyle = barrelGrad;
      ctx.beginPath(); ctx.roundRect(14, -barrelW/2, barrelLen, barrelW, [3, barrelW/2, barrelW/2, 3]); ctx.fill();
      ctx.strokeStyle = "#00ffcc88"; ctx.lineWidth = 1; ctx.stroke();
      // Highlight stripe on barrel top
      ctx.shadowBlur = 0; ctx.globalAlpha = 0.42;
      ctx.strokeStyle = "rgba(200,255,250,0.95)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(16, -barrelW/2 + 2); ctx.lineTo(14 + barrelLen - 4, -barrelW/2 + 2); ctx.stroke();
      ctx.globalAlpha = 1;
      // Nozzle flare (colored to current ball)
      ctx.shadowColor = C_GLOW[cc]; ctx.shadowBlur = 16;
      ctx.fillStyle = C_GLOW[cc] + "aa";
      ctx.beginPath(); ctx.arc(14 + barrelLen, 0, 4.5, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 0.65; ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(14 + barrelLen - 1, -1.2, 2, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // ── Draw particles (sparks with streak) ──────────────────────────
    for (const p of particlesRef.current) {
      ctx.save();
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
      if (p.r > 2.8) {
        ctx.globalAlpha = p.a * 0.45;
        ctx.strokeStyle = p.color; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3); ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    // ── Canvas border glow ────────────────────────────────────────────
    ctx.save();
    const borderGrad = ctx.createLinearGradient(0, 0, CW, CH);
    borderGrad.addColorStop(0, "rgba(0,255,200,0.16)");
    borderGrad.addColorStop(0.5, "rgba(80,0,200,0.07)");
    borderGrad.addColorStop(1, "rgba(0,180,255,0.16)");
    ctx.strokeStyle = borderGrad; ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, CW-2, CH-2);
    ctx.restore();

    // ── Flash message with pill background ───────────────────────────
    if (flashTimerRef.current > 0) {
      const alpha = Math.min(1, flashTimerRef.current / 25);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center";
      const tw = ctx.measureText(flashMsgTextRef.current).width;
      ctx.fillStyle = "rgba(0,0,0,0.62)";
      ctx.beginPath(); ctx.roundRect(CW/2 - tw/2 - 12, CANNON_Y - 70, tw + 24, 26, 8); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.shadowColor = "#00ffcc"; ctx.shadowBlur = 14;
      ctx.fillText(flashMsgTextRef.current, CW/2, CANNON_Y - 52);
      ctx.shadowBlur = 0;
      ctx.restore();
      ctx.globalAlpha = 1;
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
