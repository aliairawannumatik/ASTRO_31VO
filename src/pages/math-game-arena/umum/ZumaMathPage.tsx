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
interface Shockwave { x: number; y: number; r: number; maxR: number; a: number; color: string }

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
  const shockwaveRef = useRef<Shockwave[]>([]);
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
      const spd = 2 + Math.random() * 5.5;
      particlesRef.current.push({ x, y, vx: Math.cos(angle)*spd, vy: Math.sin(angle)*spd, r: 2+Math.random()*5, color, a: 1 });
    }
    shockwaveRef.current.push({ x, y, r: 3, maxR: BALL_R * 4.5, a: 0.88, color });
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
    shockwaveRef.current = [];
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

    // ── [1] Background: animated deep space ──────────────────────────
    const bgGrad = ctx.createRadialGradient(CW/2, CH*0.35, 0, CW/2, CH/2, CW);
    bgGrad.addColorStop(0, "#0e2050");
    bgGrad.addColorStop(0.42, "#07122e");
    bgGrad.addColorStop(1, "#020810");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CW, CH);

    // Animated drifting nebula clouds
    const nebDefs = [
      { x: 90,  y: 160, r: 145, c: "rgba(0,80,255,0.11)",  t: 0.017 },
      { x: 390, y: 420, r: 175, c: "rgba(110,0,210,0.10)", t: 0.013 },
      { x: 260, y: 50,  r: 115, c: "rgba(0,210,110,0.07)", t: 0.020 },
      { x: 175, y: 380, r: 125, c: "rgba(200,55,0,0.06)",  t: 0.011 },
      { x: 435, y: 225, r: 105, c: "rgba(0,160,255,0.08)", t: 0.015 },
    ];
    for (const nb of nebDefs) {
      const drift = Math.sin(frame * nb.t) * 14;
      const neb = ctx.createRadialGradient(nb.x + drift, nb.y, 0, nb.x, nb.y, nb.r);
      neb.addColorStop(0, nb.c);
      neb.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = neb;
      ctx.fillRect(0, 0, CW, CH);
    }

    // Twinkling stars
    for (let si = 0; si < starsRef.current.length; si++) {
      const s = starsRef.current[si];
      const twinkle = s.a * (0.38 + 0.62 * Math.sin(frame * 0.038 + si * 1.73));
      ctx.globalAlpha = twinkle;
      const sc = si % 4 === 0 ? "#aae0ff" : si % 6 === 0 ? "#ffddaa" : si % 9 === 0 ? "#ffaacc" : "#ffffff";
      ctx.fillStyle = sc; ctx.shadowColor = sc;
      ctx.shadowBlur = s.r > 1.5 ? 7 : 0;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;

    // ── [2] Path track: deep 3D groove with energy pulse ─────────────
    ctx.save();
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    const drawPath = () => {
      ctx.beginPath();
      ctx.moveTo(PATH_PTS[0][0], PATH_PTS[0][1]);
      for (let i = 1; i < PATH_PTS.length; i++) ctx.lineTo(PATH_PTS[i][0], PATH_PTS[i][1]);
    };
    ctx.strokeStyle = "rgba(0,0,0,0.88)";        ctx.lineWidth = BALL_R * 2 + 22; drawPath(); ctx.stroke();
    ctx.strokeStyle = "rgba(0,10,36,0.98)";       ctx.lineWidth = BALL_R * 2 + 14; drawPath(); ctx.stroke();
    ctx.strokeStyle = "rgba(0,55,130,0.32)";      ctx.lineWidth = BALL_R * 2 + 6;  drawPath(); ctx.stroke();
    ctx.strokeStyle = "rgba(0,3,15,0.96)";        ctx.lineWidth = BALL_R * 2 - 4;  drawPath(); ctx.stroke();
    const tgA = 0.07 + 0.05 * Math.sin(frame * 0.05);
    ctx.strokeStyle = `rgba(0,200,255,${tgA})`;   ctx.lineWidth = BALL_R * 2 - 14; drawPath(); ctx.stroke();
    ctx.strokeStyle = "rgba(0,200,255,0.13)";     ctx.lineWidth = 2;               drawPath(); ctx.stroke();
    ctx.strokeStyle = "rgba(0,255,210,0.08)";     ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 13]); ctx.lineDashOffset = -(frame * 0.7);
    drawPath(); ctx.stroke();
    ctx.setLineDash([]); ctx.lineDashOffset = 0;
    ctx.restore();

    // Energy orbs flowing along track
    for (let oi = 0; oi < 7; oi++) {
      const orbT = ((frame * 0.55 + oi * (TOTAL_LEN / 7)) % TOTAL_LEN);
      const [ox, oy] = getPathPos(orbT);
      ctx.save();
      ctx.globalAlpha = 0.20 + 0.14 * Math.sin(frame * 0.07 + oi * 1.4);
      ctx.shadowColor = "#00eeff"; ctx.shadowBlur = 14;
      ctx.fillStyle = "#00eeff";
      ctx.beginPath(); ctx.arc(ox, oy, 2.4, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }

    // ── [3] Entry portal ─────────────────────────────────────────────
    const entryPos = getPathPos(0);
    ctx.save();
    const entryPulse = 0.5 + 0.5 * Math.sin(frame * 0.07);
    ctx.shadowColor = "#00ff88"; ctx.shadowBlur = 18 + 8 * entryPulse;
    for (let ri = 0; ri < 4; ri++) {
      ctx.globalAlpha = (0.14 + ri * 0.12) * entryPulse;
      ctx.strokeStyle = "#00ff88"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(entryPos[0], entryPos[1], 4 + ri * 5, 0, Math.PI*2); ctx.stroke();
    }
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = "#00ff88";
    ctx.beginPath(); ctx.arc(entryPos[0], entryPos[1], 5, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    // ── [4] Hole: danger vortex ───────────────────────────────────────
    const holePos = getPathPos(TOTAL_LEN);
    const holePulse = 0.5 + 0.5 * Math.sin(frame * 0.09);
    ctx.save();
    ctx.shadowColor = "#ff2200"; ctx.shadowBlur = 22 + holePulse * 18;
    ctx.strokeStyle = `rgba(255,55,30,${0.5 + holePulse * 0.5})`; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(holePos[0], holePos[1], 17 + holePulse * 5, 0, Math.PI*2); ctx.stroke();
    const holeGrad = ctx.createRadialGradient(holePos[0], holePos[1], 0, holePos[0], holePos[1], 14);
    holeGrad.addColorStop(0, "#000000"); holeGrad.addColorStop(0.5, "#200005"); holeGrad.addColorStop(1, "#5a0010");
    ctx.fillStyle = holeGrad;
    ctx.beginPath(); ctx.arc(holePos[0], holePos[1], 14, 0, Math.PI*2); ctx.fill();
    const hRot = frame * 0.07;
    for (let ri = 0; ri < 4; ri++) {
      const a = hRot + (ri / 4) * Math.PI * 2;
      ctx.globalAlpha = 0.5 + 0.4 * Math.sin(frame * 0.1 + ri);
      ctx.strokeStyle = "#ff5533"; ctx.lineWidth = 1.5; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(holePos[0], holePos[1], 8, a, a + Math.PI * 0.6); ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    ctx.font = "bold 11px sans-serif"; ctx.fillStyle = "#ff4444"; ctx.textAlign = "center";
    ctx.fillText("☠", holePos[0], holePos[1] + 4);
    ctx.restore();

    // ── [5] Connector wire (plasma conduit) ───────────────────────────
    if (chain.length > 1) {
      ctx.save();
      ctx.lineCap = "round";
      for (let ci = 0; ci < chain.length - 1; ci++) {
        const [ax, ay] = getPathPos(chain[ci].t);
        const [bx2, by2] = getPathPos(chain[ci+1].t);
        ctx.globalAlpha = 0.20; ctx.lineWidth = 3.5;
        ctx.shadowColor = C_GLOW[chain[ci].color]; ctx.shadowBlur = 5;
        ctx.strokeStyle = C_GLOW[chain[ci].color];
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx2, by2); ctx.stroke();
      }
      ctx.restore();
    }

    // ── [6] Chain balls: photorealistic 3D spheres ────────────────────
    for (const b of chain) {
      const [bx, by] = getPathPos(b.t);
      const g = C_GLOW[b.color], f = C_FILL[b.color], l = C_LIGHT[b.color];

      // Drop shadow on track
      ctx.save();
      ctx.globalAlpha = 0.38;
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.ellipse(bx, by + BALL_R * 0.46, BALL_R * 0.80, BALL_R * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      // Outer glow ring
      ctx.shadowColor = g; ctx.shadowBlur = 18;
      ctx.strokeStyle = g + "77"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(bx, by, BALL_R + 2, 0, Math.PI*2); ctx.stroke();
      // Main 3D sphere gradient
      const hx = bx - BALL_R * 0.32, hy = by - BALL_R * 0.40;
      const grad = ctx.createRadialGradient(hx, hy, 0, bx, by, BALL_R);
      grad.addColorStop(0,    l);
      grad.addColorStop(0.22, g);
      grad.addColorStop(0.58, f);
      grad.addColorStop(0.85, shadeColor(f, -30));
      grad.addColorStop(1,    shadeColor(f, -65));
      ctx.fillStyle = grad; ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(bx, by, BALL_R, 0, Math.PI*2); ctx.fill();
      // Fresnel rim glow
      const rimFresnel = ctx.createRadialGradient(bx, by, BALL_R * 0.65, bx, by, BALL_R + 1.5);
      rimFresnel.addColorStop(0, "rgba(0,0,0,0)");
      rimFresnel.addColorStop(1, g + "99");
      ctx.fillStyle = rimFresnel;
      ctx.beginPath(); ctx.arc(bx, by, BALL_R + 1.5, 0, Math.PI*2); ctx.fill();
      // Primary specular
      const specG = ctx.createRadialGradient(hx, hy, 0, hx, hy, BALL_R * 0.56);
      specG.addColorStop(0, "rgba(255,255,255,0.95)");
      specG.addColorStop(0.38, "rgba(255,255,255,0.30)");
      specG.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = specG;
      ctx.beginPath(); ctx.arc(bx, by, BALL_R, 0, Math.PI*2); ctx.fill();
      // Secondary specular dot
      ctx.fillStyle = "rgba(255,255,255,0.96)";
      ctx.beginPath(); ctx.arc(bx - BALL_R * 0.20, by - BALL_R * 0.28, 2.2, 0, Math.PI*2); ctx.fill();
      // Bottom rim reflection
      const rimG = ctx.createRadialGradient(bx + BALL_R*0.18, by + BALL_R*0.55, 0, bx, by, BALL_R);
      rimG.addColorStop(0, "rgba(255,255,255,0.18)"); rimG.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = rimG;
      ctx.beginPath(); ctx.arc(bx, by, BALL_R, 0, Math.PI*2); ctx.fill();
      // Number
      ctx.font = "bold 10px monospace"; ctx.textAlign = "center";
      ctx.shadowBlur = 6; ctx.shadowColor = "rgba(0,0,0,1)";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(String(optsRef.current[b.color]), bx, by + 3.5);
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // ── [7] Aiming trajectory ─────────────────────────────────────────
    {
      const aimAngle = cannonAngleRef.current;
      const barrelLen = 36;
      const tipX = CANNON_X + Math.cos(aimAngle) * (14 + barrelLen + 4);
      const tipY = CANNON_Y + Math.sin(aimAngle) * (14 + barrelLen + 4);
      const aimColor = C_GLOW[currentColorRef.current];
      ctx.save();
      ctx.globalAlpha = 0.30; ctx.strokeStyle = aimColor; ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 9]); ctx.lineDashOffset = -(frame * 0.4);
      ctx.shadowColor = aimColor; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.moveTo(tipX, tipY);
      ctx.lineTo(tipX + Math.cos(aimAngle) * 300, tipY + Math.sin(aimAngle) * 300);
      ctx.stroke();
      ctx.setLineDash([]);
      for (let di = 0; di < 4; di++) {
        const dd = 60 + di * 55;
        ctx.globalAlpha = 0.14 - di * 0.03;
        ctx.fillStyle = aimColor;
        ctx.beginPath();
        ctx.arc(tipX + Math.cos(aimAngle)*dd, tipY + Math.sin(aimAngle)*dd, 2.8 - di * 0.5, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.setLineDash([]); ctx.lineDashOffset = 0;
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // ── [8] Projectile: 3D sphere with motion trail ───────────────────
    if (projRef.current) {
      const pr = projRef.current;
      const g = C_GLOW[pr.color], l = C_LIGHT[pr.color], f = C_FILL[pr.color];
      ctx.save();
      // Tapered glow trail
      for (let ti = 5; ti >= 1; ti--) {
        const tx = pr.x - pr.vx * ti * 0.65;
        const ty = pr.y - pr.vy * ti * 0.65;
        const ta = 0.05 + (6 - ti) * 0.025;
        const tr = BALL_R * (1 - ti * 0.13);
        ctx.globalAlpha = ta;
        const tg = ctx.createRadialGradient(tx, ty, 0, tx, ty, tr);
        tg.addColorStop(0, l); tg.addColorStop(0.5, g); tg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = tg;
        ctx.beginPath(); ctx.arc(tx, ty, tr, 0, Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      // Outer glow ring
      ctx.shadowColor = g; ctx.shadowBlur = 28;
      ctx.strokeStyle = g; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(pr.x, pr.y, BALL_R + 2.5, 0, Math.PI*2); ctx.stroke();
      // Main sphere
      const hx = pr.x - BALL_R * 0.32, hy = pr.y - BALL_R * 0.40;
      const grad = ctx.createRadialGradient(hx, hy, 0, pr.x, pr.y, BALL_R);
      grad.addColorStop(0, l); grad.addColorStop(0.22, g);
      grad.addColorStop(0.58, f); grad.addColorStop(1, shadeColor(f, -65));
      ctx.fillStyle = grad; ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(pr.x, pr.y, BALL_R, 0, Math.PI*2); ctx.fill();
      // Fresnel rim
      const pRim = ctx.createRadialGradient(pr.x, pr.y, BALL_R * 0.65, pr.x, pr.y, BALL_R + 1.5);
      pRim.addColorStop(0, "rgba(0,0,0,0)"); pRim.addColorStop(1, g + "99");
      ctx.fillStyle = pRim;
      ctx.beginPath(); ctx.arc(pr.x, pr.y, BALL_R + 1.5, 0, Math.PI*2); ctx.fill();
      // Specular
      const specG = ctx.createRadialGradient(hx, hy, 0, hx, hy, BALL_R * 0.56);
      specG.addColorStop(0, "rgba(255,255,255,0.95)");
      specG.addColorStop(0.38, "rgba(255,255,255,0.32)");
      specG.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = specG;
      ctx.beginPath(); ctx.arc(pr.x, pr.y, BALL_R, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.96)";
      ctx.beginPath(); ctx.arc(pr.x - BALL_R*0.20, pr.y - BALL_R*0.28, 2.2, 0, Math.PI*2); ctx.fill();
      // Number
      ctx.font = "bold 10px monospace"; ctx.textAlign = "center";
      ctx.shadowBlur = 6; ctx.shadowColor = "rgba(0,0,0,1)";
      ctx.fillStyle = "#fff";
      ctx.fillText(String(optsRef.current[pr.color]), pr.x, pr.y + 3.5);
      ctx.restore();
    }

    // ── [9] Cannon: mechanical turret ─────────────────────────────────
    {
      const angle = cannonAngleRef.current;
      const barrelLen = 36, barrelW = 10;
      ctx.save();
      ctx.translate(CANNON_X, CANNON_Y);
      // Floor shadow
      ctx.globalAlpha = 0.52;
      ctx.fillStyle = "#000";
      ctx.beginPath(); ctx.ellipse(0, 12, 28, 8, 0, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
      // Pulsing energy rings expanding outward
      for (let ri = 0; ri < 3; ri++) {
        const rp = ((frame * 0.022 + ri * 0.333) % 1);
        const rr = 32 + rp * 18;
        ctx.globalAlpha = (1 - rp) * 0.22;
        ctx.strokeStyle = "#00ffcc"; ctx.lineWidth = 1.5;
        ctx.shadowColor = "#00ffcc"; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(0, 0, rr, 0, Math.PI*2); ctx.stroke();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      // Rotating outer dashed ring
      ctx.strokeStyle = "#00ffcc28"; ctx.lineWidth = 1;
      ctx.setLineDash([3, 7]); ctx.lineDashOffset = frame * 0.28;
      ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI*2); ctx.stroke();
      ctx.setLineDash([]); ctx.lineDashOffset = 0;
      // Base plate
      ctx.shadowColor = "#00ffcc"; ctx.shadowBlur = 28;
      const baseGrad = ctx.createRadialGradient(-8, -10, 2, 0, 0, 26);
      baseGrad.addColorStop(0, "#4af8e0");
      baseGrad.addColorStop(0.22, "#0fb8d8");
      baseGrad.addColorStop(0.55, "#0a4a78");
      baseGrad.addColorStop(1, "#040e20");
      ctx.fillStyle = baseGrad;
      ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#00ffcc66"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI*2); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(-5, -7, 20, 1.1 * Math.PI, 1.65 * Math.PI); ctx.stroke();
      // Inner panel
      const innerGrad = ctx.createRadialGradient(-3, -4, 1, 0, 0, 16);
      innerGrad.addColorStop(0, "#1a5068"); innerGrad.addColorStop(1, "#040e20");
      ctx.fillStyle = innerGrad;
      ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI*2); ctx.fill();
      // Next ball preview
      const nc = nextColorRef.current;
      ctx.shadowColor = C_GLOW[nc]; ctx.shadowBlur = 10;
      const nbGrad = ctx.createRadialGradient(-1.5, 12.5, 0, 0, 15, 6);
      nbGrad.addColorStop(0, C_LIGHT[nc]); nbGrad.addColorStop(0.5, C_GLOW[nc]); nbGrad.addColorStop(1, C_FILL[nc]);
      ctx.fillStyle = nbGrad;
      ctx.beginPath(); ctx.arc(0, 15, 6, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.font = "bold 6px monospace"; ctx.textAlign = "center";
      ctx.fillStyle = "#fff"; ctx.shadowColor = "#000"; ctx.shadowBlur = 3;
      ctx.fillText(String(optsRef.current[nc]), 0, 17.5);
      ctx.shadowBlur = 0;
      // Current ball
      const cc = currentColorRef.current;
      ctx.shadowColor = C_GLOW[cc]; ctx.shadowBlur = 18;
      const cHx = -3.5, cHy = -5.5;
      const cGrad = ctx.createRadialGradient(cHx, cHy, 0, 0, -2, 11);
      cGrad.addColorStop(0, C_LIGHT[cc]); cGrad.addColorStop(0.22, C_GLOW[cc]);
      cGrad.addColorStop(0.58, C_FILL[cc]); cGrad.addColorStop(1, shadeColor(C_FILL[cc], -65));
      ctx.fillStyle = cGrad; ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(0, -2, 11, 0, Math.PI*2); ctx.fill();
      const cFresnel = ctx.createRadialGradient(0, -2, 7, 0, -2, 13);
      cFresnel.addColorStop(0, "rgba(0,0,0,0)"); cFresnel.addColorStop(1, C_GLOW[cc] + "88");
      ctx.fillStyle = cFresnel;
      ctx.beginPath(); ctx.arc(0, -2, 13, 0, Math.PI*2); ctx.fill();
      const cSpecG = ctx.createRadialGradient(cHx, cHy, 0, cHx, cHy, 7);
      cSpecG.addColorStop(0, "rgba(255,255,255,0.92)"); cSpecG.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = cSpecG;
      ctx.beginPath(); ctx.arc(0, -2, 11, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.96)";
      ctx.beginPath(); ctx.arc(-2.5, -4.5, 1.8, 0, Math.PI*2); ctx.fill();
      ctx.font = "bold 8px monospace"; ctx.textAlign = "center";
      ctx.shadowBlur = 5; ctx.shadowColor = "#000";
      ctx.fillStyle = "#fff"; ctx.fillText(String(optsRef.current[cc]), 0, 1.5);
      ctx.shadowBlur = 0;
      // Barrel
      ctx.rotate(angle);
      ctx.shadowColor = "#00ffcc"; ctx.shadowBlur = 18;
      const barrelGrad = ctx.createLinearGradient(0, -barrelW/2, 0, barrelW/2);
      barrelGrad.addColorStop(0, "#62f8ea");
      barrelGrad.addColorStop(0.20, "#0ec5e0");
      barrelGrad.addColorStop(0.55, "#077090");
      barrelGrad.addColorStop(1, "#022535");
      ctx.fillStyle = barrelGrad;
      ctx.beginPath(); ctx.roundRect(14, -barrelW/2, barrelLen, barrelW, [3, barrelW/2, barrelW/2, 3]); ctx.fill();
      ctx.strokeStyle = "#00ffcc77"; ctx.lineWidth = 1; ctx.shadowBlur = 0; ctx.stroke();
      ctx.globalAlpha = 0.46;
      ctx.strokeStyle = "rgba(200,255,250,0.98)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(16, -barrelW/2 + 2); ctx.lineTo(14 + barrelLen - 4, -barrelW/2 + 2); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.shadowColor = C_GLOW[cc]; ctx.shadowBlur = 22;
      ctx.fillStyle = C_GLOW[cc];
      ctx.beginPath(); ctx.arc(14 + barrelLen, 0, 5.5, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 0.72; ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(14 + barrelLen - 1.5, -1.5, 2.4, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // ── [10] Shockwave rings ──────────────────────────────────────────
    shockwaveRef.current = shockwaveRef.current.filter(sw => sw.a > 0);
    for (const sw of shockwaveRef.current) {
      sw.r += (sw.maxR - sw.r) * 0.19;
      sw.a -= 0.046;
      ctx.save();
      ctx.globalAlpha = Math.max(0, sw.a);
      ctx.shadowColor = sw.color; ctx.shadowBlur = 14;
      ctx.strokeStyle = sw.color; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI*2); ctx.stroke();
      ctx.globalAlpha = Math.max(0, sw.a * 0.38);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(sw.x, sw.y, sw.r * 1.45, 0, Math.PI*2); ctx.stroke();
      ctx.restore();
    }

    // ── [11] Particles: sparks with trails ────────────────────────────
    for (const p of particlesRef.current) {
      ctx.save();
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 13;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = p.a * 0.52;
      ctx.strokeStyle = p.color; ctx.lineWidth = p.r * 0.85; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
      ctx.stroke();
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    // ── [12] Screen vignette ──────────────────────────────────────────
    ctx.save();
    const vig = ctx.createRadialGradient(CW/2, CH/2, CW * 0.28, CW/2, CH/2, CW * 0.90);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(0,0,8,0.60)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, CW, CH);
    ctx.restore();

    // ── [13] Canvas border glow ───────────────────────────────────────
    ctx.save();
    const borderGrad = ctx.createLinearGradient(0, 0, CW, CH);
    borderGrad.addColorStop(0, "rgba(0,255,200,0.20)");
    borderGrad.addColorStop(0.5, "rgba(80,0,200,0.08)");
    borderGrad.addColorStop(1, "rgba(0,180,255,0.20)");
    ctx.strokeStyle = borderGrad; ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, CW-2, CH-2);
    ctx.restore();

    // ── [14] Flash message ────────────────────────────────────────────
    if (flashTimerRef.current > 0) {
      const alpha = Math.min(1, flashTimerRef.current / 25);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center";
      const tw = ctx.measureText(flashMsgTextRef.current).width;
      ctx.fillStyle = "rgba(0,0,0,0.72)";
      ctx.shadowColor = "#00ffcc"; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.roundRect(CW/2 - tw/2 - 14, CANNON_Y - 72, tw + 28, 28, 10); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ffffff"; ctx.shadowColor = "#00ffcc88"; ctx.shadowBlur = 10;
      ctx.fillText(flashMsgTextRef.current, CW/2, CANNON_Y - 53);
      ctx.shadowBlur = 0;
      ctx.restore();
      ctx.globalAlpha = 1;
    }
  }, [randomColor, initChain, setupQuestion, flash, explode, checkMatch, popBalls]);

  // ── Setup loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = CW * dpr;
      canvas.height = CH * dpr;
      const ctx2 = canvas.getContext("2d");
      if (ctx2) ctx2.scale(dpr, dpr);
    }
    starsRef.current = Array.from({ length: 70 }, () => ({
      x: Math.random() * CW, y: Math.random() * CH,
      r: 0.4 + Math.random() * 2.2, a: 0.25 + Math.random() * 0.75,
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

        {/* Canvas */}
        <div className="relative" style={{ width: CW, maxWidth: "100%", maxHeight: 'calc(100dvh - 160px)', aspectRatio: `${CW}/${CH}` }}>
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
