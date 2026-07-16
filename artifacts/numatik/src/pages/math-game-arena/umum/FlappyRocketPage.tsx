import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz, type GuruQuestion } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";

// ── Canvas ───────────────────────────────────────────────────────────────────
const CW = 420;
const CH = 580;
const PIPE_W = 58;
const PIPE_GAP = 160;
const PIPE_SPEED = 180;
const GRAVITY = 1100;
const FLAP_VY = -380;
const ROCKET_X = 80;
const ROCKET_R = 16;

// ── Math question type (kept for backward compat with wrapper pages; gameplay
//    no longer uses an in-game pipe quiz — only the 25-detik "Soal Guru"). ──
export interface MQ { q: string; opts: string[]; ans: number }

// ── Particle ──────────────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number; vx: number; vy: number;
  r: number; alpha: number; color: string; life: number;
}

// ── Pipe ──────────────────────────────────────────────────────────────────────
interface Pipe {
  x: number;
  gapY: number;        // top of gap
  scored: boolean;
  color: string;
  glowPhase: number;
}

type Phase = "idle" | "playing" | "dead";

// ── Nebula cloud ──────────────────────────────────────────────────────────────
interface NebulaCloud { x: number; y: number; rx: number; ry: number; color: string; alpha: number; speed: number }

// ── Component ─────────────────────────────────────────────────────────────────
interface FlappyRocketPageProps {
  questions?: MQ[];
  topicLabel?: string;
  backPath?: string;
  homePath?: string;
  quizQuestions?: GuruQuestion[];
}

const FlappyRocketPage = ({
  topicLabel,
  backPath,
  homePath = "/ruang-untuk-guru/numatik-game",
  quizQuestions,
}: FlappyRocketPageProps = {}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastTRef = useRef(0);

  // game refs
  const phaseRef = useRef<Phase>("idle");
  const guruQuiz = useGuruQuiz(phaseRef, "playing", 25_000, quizQuestions);
  const ryRef = useRef(CH / 2);
  const rvyRef = useRef(0);
  const rotRef = useRef(0);
  const pipesRef = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const nextPipeRef = useRef(900);
  const particlesRef = useRef<Particle[]>([]);
  const flapRef = useRef(false);
  const shieldRef = useRef(0);
  const comboRef = useRef(0);
  const flashRef = useRef(0);          // flash alpha for wrong answer
  const nebulasRef = useRef<NebulaCloud[]>([]);
  const bgStarsRef = useRef<{ x: number; y: number; r: number; twinkle: number }[]>([]);
  const trailRef = useRef<{ x: number; y: number; vx: number; vy: number; r: number; alpha: number; hot: boolean }[]>([]);
  const shakeDurRef = useRef(0);
  const shakeMagRef = useRef(0);

  // React state (UI overlay only)
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [feedback, setFeedback] = useState<{ txt: string; good: boolean } | null>(null);
  const [combo, setCombo] = useState(0);
  const fbTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFeedback = useCallback((txt: string, good: boolean) => {
    setFeedback({ txt, good });
    if (fbTimerRef.current) clearTimeout(fbTimerRef.current);
    fbTimerRef.current = setTimeout(() => setFeedback(null), 2200);
  }, []);

  const spawnParticles = useCallback((x: number, y: number, color: string, count = 14) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const speed = 60 + Math.random() * 160;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 2 + Math.random() * 3,
        alpha: 1,
        color,
        life: 0.7 + Math.random() * 0.5,
      });
    }
  }, []);

  const spawnPipe = useCallback(() => {
    const gapY = 80 + Math.random() * (CH - PIPE_GAP - 160);
    const PIPE_COLORS = ["#00E5FF", "#FF6B6B", "#00FF88", "#AA77FF"];
    pipesRef.current.push({
      x: CW + 10,
      gapY,
      scored: false,
      color: PIPE_COLORS[Math.floor(Math.random() * PIPE_COLORS.length)],
      glowPhase: Math.random() * Math.PI * 2,
    });
  }, []);

  const initStatics = useCallback(() => {
    bgStarsRef.current = Array.from({ length: 120 }, () => ({
      x: Math.random() * CW,
      y: Math.random() * CH,
      r: 0.5 + Math.random() * 1.8,
      twinkle: Math.random() * Math.PI * 2,
    }));
    nebulasRef.current = [
      { x: 80,  y: 120, rx: 110, ry: 60, color: "#3a0066", alpha: 0.25, speed: 0.012 },
      { x: 300, y: 300, rx: 90,  ry: 50, color: "#001a66", alpha: 0.2,  speed: 0.008 },
      { x: 160, y: 440, rx: 130, ry: 70, color: "#006633", alpha: 0.18, speed: 0.015 },
    ];
  }, []);

  const resetGame = useCallback(() => {
    ryRef.current = CH / 2;
    rvyRef.current = 0;
    rotRef.current = 0;
    pipesRef.current = [];
    particlesRef.current = [];
    trailRef.current = [];
    scoreRef.current = 0;
    nextPipeRef.current = 900;
    shieldRef.current = 0;
    comboRef.current = 0;
    flashRef.current = 0;
    shakeDurRef.current = 0;
    shakeMagRef.current = 0;
    flapRef.current = false;
    setScore(0);
    setFeedback(null);
    setCombo(0);
  }, []);

  // ── Draw asteroids (rocky obstacles) ───────────────────────────────────────
  const drawPipe = useCallback((ctx: CanvasRenderingContext2D, p: Pipe, ts: number) => {
    const seed = p.glowPhase;
    const rnd = (i: number) => {
      const x = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };

    const baseColor = "#8A7B6B";
    const darkColor = "#3F362E";
    const lightColor = "#B8A896";
    const glowCol = p.color;

    const SIDE_STEPS = 6;
    const FACE_BUMPS = 5;

    // ── Top asteroid (hanging from above) ────────────────────────────────────
    const topH = p.gapY;
    ctx.save();
    ctx.shadowColor = glowCol;
    ctx.shadowBlur = 14 + 4 * Math.sin(ts / 600 + seed);

    ctx.beginPath();
    ctx.moveTo(p.x - 4, -10);
    ctx.lineTo(p.x + PIPE_W + 4, -10);
    // right edge — irregular
    for (let i = 1; i <= SIDE_STEPS; i++) {
      const y = (topH - 6) * (i / SIDE_STEPS);
      const bulge = (rnd(i) - 0.5) * 8;
      ctx.lineTo(p.x + PIPE_W + bulge, y);
    }
    // jagged bottom edge facing the gap
    for (let i = FACE_BUMPS; i >= 0; i--) {
      const t = i / FACE_BUMPS;
      const x = p.x + PIPE_W * t;
      const yOff = (rnd(20 + i) - 0.5) * 14 - 4;
      ctx.lineTo(x, topH + yOff);
    }
    // left edge going back up
    for (let i = SIDE_STEPS; i >= 1; i--) {
      const y = (topH - 6) * (i / SIDE_STEPS);
      const bulge = (rnd(40 + i) - 0.5) * 8;
      ctx.lineTo(p.x + bulge, y);
    }
    ctx.closePath();

    const gradT = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
    gradT.addColorStop(0, darkColor);
    gradT.addColorStop(0.5, baseColor);
    gradT.addColorStop(1, darkColor);
    ctx.fillStyle = gradT;
    ctx.fill();

    // dark rim outline
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(0,0,0,0.45)";
    ctx.stroke();

    // craters
    for (let i = 0; i < 4; i++) {
      const cy = 24 + rnd(60 + i) * Math.max(10, topH - 44);
      const ccx = p.x + 10 + rnd(70 + i) * (PIPE_W - 20);
      const cr = 3 + rnd(80 + i) * 5;
      ctx.fillStyle = darkColor;
      ctx.beginPath();
      ctx.arc(ccx, cy, cr, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = lightColor;
      ctx.beginPath();
      ctx.arc(ccx - cr * 0.3, cy - cr * 0.3, cr * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // ── Bottom asteroid (rising from below) ──────────────────────────────────
    const botY = p.gapY + PIPE_GAP;
    const botH = CH - botY;
    ctx.save();
    ctx.shadowColor = glowCol;
    ctx.shadowBlur = 14 + 4 * Math.sin(ts / 600 + seed + 1.7);

    ctx.beginPath();
    // jagged top edge facing the gap
    ctx.moveTo(p.x, botY + 4);
    for (let i = 0; i <= FACE_BUMPS; i++) {
      const t = i / FACE_BUMPS;
      const x = p.x + PIPE_W * t;
      const yOff = (rnd(100 + i) - 0.5) * 14 + 4;
      ctx.lineTo(x, botY + yOff);
    }
    // right edge going down
    for (let i = 1; i <= SIDE_STEPS; i++) {
      const y = botY + 6 + (botH - 6) * (i / SIDE_STEPS);
      const bulge = (rnd(120 + i) - 0.5) * 8;
      ctx.lineTo(p.x + PIPE_W + bulge, y);
    }
    ctx.lineTo(p.x + PIPE_W + 4, CH + 10);
    ctx.lineTo(p.x - 4, CH + 10);
    // left edge going up
    for (let i = SIDE_STEPS; i >= 1; i--) {
      const y = botY + 6 + (botH - 6) * (i / SIDE_STEPS);
      const bulge = (rnd(140 + i) - 0.5) * 8;
      ctx.lineTo(p.x + bulge, y);
    }
    ctx.closePath();

    const gradB = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
    gradB.addColorStop(0, darkColor);
    gradB.addColorStop(0.5, baseColor);
    gradB.addColorStop(1, darkColor);
    ctx.fillStyle = gradB;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(0,0,0,0.45)";
    ctx.stroke();

    // craters
    for (let i = 0; i < 4; i++) {
      const cy = botY + 20 + rnd(160 + i) * Math.max(10, botH - 40);
      const ccx = p.x + 10 + rnd(170 + i) * (PIPE_W - 20);
      const cr = 3 + rnd(180 + i) * 5;
      ctx.fillStyle = darkColor;
      ctx.beginPath();
      ctx.arc(ccx, cy, cr, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = lightColor;
      ctx.beginPath();
      ctx.arc(ccx - cr * 0.3, cy - cr * 0.3, cr * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.textAlign = "left";
  }, []);

  // ── Draw rocket (cute & detailed, with animated multi-layer flame) ────────
  const drawRocket = useCallback((ctx: CanvasRenderingContext2D, y: number, rot: number, ts: number, shield: number) => {
    ctx.save();
    ctx.translate(ROCKET_X, y);
    ctx.rotate(rot);

    // Shield bubble
    if (shield > 0) {
      const alpha = 0.3 + 0.2 * Math.sin(ts / 120);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#00FFFF";
      ctx.shadowColor = "#00FFFF";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(0, 0, ROCKET_R + 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    // ── Big animated FLAME (drawn first so the body sits on top) ─────────
    const t = ts / 50;
    const flick1 = 1 + 0.18 * Math.sin(t);
    const flick2 = 1 + 0.22 * Math.sin(t * 1.7 + 1.1);
    const len1 = (26 + 6 * Math.sin(t)) * flick1;       // outer flame length
    const len2 = (16 + 4 * Math.sin(t * 1.3 + 1)) * flick2; // inner flame length
    const wid  = 8.5 + 1.6 * Math.sin(t * 0.7);

    // Outer warm halo glow
    const haloGrad = ctx.createRadialGradient(-ROCKET_R - 8, 0, 2, -ROCKET_R - 8, 0, 36);
    haloGrad.addColorStop(0, "rgba(255,180,60,0.55)");
    haloGrad.addColorStop(0.45, "rgba(255,100,30,0.28)");
    haloGrad.addColorStop(1, "rgba(255,60,0,0)");
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(-ROCKET_R - 8, 0, 36, 0, Math.PI * 2);
    ctx.fill();

    // Outer red→orange→yellow flame tongue
    const flameOuter = ctx.createLinearGradient(-ROCKET_R - len1, 0, -ROCKET_R + 2, 0);
    flameOuter.addColorStop(0, "rgba(255,40,0,0)");
    flameOuter.addColorStop(0.25, "rgba(255,90,0,0.6)");
    flameOuter.addColorStop(0.6, "rgba(255,170,30,0.92)");
    flameOuter.addColorStop(1, "rgba(255,235,120,1)");
    ctx.fillStyle = flameOuter;
    ctx.beginPath();
    ctx.moveTo(-ROCKET_R + 2, -wid);
    ctx.quadraticCurveTo(-ROCKET_R - len1 * 0.45, -wid * 1.45, -ROCKET_R - len1, 0);
    ctx.quadraticCurveTo(-ROCKET_R - len1 * 0.45, wid * 1.45, -ROCKET_R + 2, wid);
    ctx.closePath();
    ctx.fill();

    // Inner white-hot flame core
    const flameInner = ctx.createLinearGradient(-ROCKET_R - len2, 0, -ROCKET_R + 2, 0);
    flameInner.addColorStop(0, "rgba(255,200,80,0)");
    flameInner.addColorStop(0.5, "rgba(255,240,180,0.92)");
    flameInner.addColorStop(1, "rgba(255,255,255,1)");
    ctx.fillStyle = flameInner;
    ctx.beginPath();
    ctx.moveTo(-ROCKET_R + 2, -wid * 0.55);
    ctx.quadraticCurveTo(-ROCKET_R - len2 * 0.5, -wid * 0.7, -ROCKET_R - len2, 0);
    ctx.quadraticCurveTo(-ROCKET_R - len2 * 0.5, wid * 0.7, -ROCKET_R + 2, wid * 0.55);
    ctx.closePath();
    ctx.fill();

    // ── Fins (red, with shading) – behind body ───────────────────────────
    const FIN_COL = "#E63950";
    const FIN_SHADE = "#A8202F";
    // top fin
    ctx.fillStyle = FIN_COL;
    ctx.beginPath();
    ctx.moveTo(-ROCKET_R + 4, -ROCKET_R * 0.5);
    ctx.lineTo(-ROCKET_R - 6, -ROCKET_R - 5);
    ctx.lineTo(-ROCKET_R - 6, -ROCKET_R * 0.55);
    ctx.lineTo(-ROCKET_R + 8, -ROCKET_R * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = FIN_SHADE;
    ctx.beginPath();
    ctx.moveTo(-ROCKET_R - 6, -ROCKET_R - 5);
    ctx.lineTo(-ROCKET_R - 6, -ROCKET_R * 0.55);
    ctx.lineTo(-ROCKET_R + 4, -ROCKET_R * 0.5);
    ctx.closePath();
    ctx.fill();
    // bottom fin
    ctx.fillStyle = FIN_COL;
    ctx.beginPath();
    ctx.moveTo(-ROCKET_R + 4, ROCKET_R * 0.5);
    ctx.lineTo(-ROCKET_R - 6, ROCKET_R + 5);
    ctx.lineTo(-ROCKET_R - 6, ROCKET_R * 0.55);
    ctx.lineTo(-ROCKET_R + 8, ROCKET_R * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = FIN_SHADE;
    ctx.beginPath();
    ctx.moveTo(-ROCKET_R - 6, ROCKET_R + 5);
    ctx.lineTo(-ROCKET_R - 6, ROCKET_R * 0.55);
    ctx.lineTo(-ROCKET_R + 4, ROCKET_R * 0.5);
    ctx.closePath();
    ctx.fill();

    // ── Engine nozzle (dark, behind body) ────────────────────────────────
    ctx.fillStyle = "#3A4555";
    ctx.beginPath();
    ctx.roundRect(-ROCKET_R - 1, -wid * 0.85, 5, wid * 1.7, 2);
    ctx.fill();
    ctx.strokeStyle = "#1A1F28";
    ctx.lineWidth = 1;
    ctx.stroke();

    // ── Body (rounded capsule, white/cream with subtle shading) ──────────
    const bodyGrad = ctx.createLinearGradient(0, -ROCKET_R * 0.72, 0, ROCKET_R * 0.72);
    bodyGrad.addColorStop(0, "#FFFFFF");
    bodyGrad.addColorStop(0.45, "#F2F5FA");
    bodyGrad.addColorStop(1, "#B3BECF");
    ctx.fillStyle = bodyGrad;
    ctx.shadowColor = "rgba(255,200,120,0.45)";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(-ROCKET_R + 2, -ROCKET_R * 0.72);
    ctx.lineTo(ROCKET_R * 0.55, -ROCKET_R * 0.72);
    ctx.quadraticCurveTo(ROCKET_R * 1.1, -ROCKET_R * 0.55, ROCKET_R * 1.1, 0);
    ctx.quadraticCurveTo(ROCKET_R * 1.1, ROCKET_R * 0.55, ROCKET_R * 0.55, ROCKET_R * 0.72);
    ctx.lineTo(-ROCKET_R + 2, ROCKET_R * 0.72);
    ctx.quadraticCurveTo(-ROCKET_R - 1, ROCKET_R * 0.55, -ROCKET_R - 1, 0);
    ctx.quadraticCurveTo(-ROCKET_R - 1, -ROCKET_R * 0.55, -ROCKET_R + 2, -ROCKET_R * 0.72);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#7A8294";
    ctx.lineWidth = 1.1;
    ctx.stroke();

    // Bottom highlight strip (gives chubby/glossy feel)
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.ellipse(2, -ROCKET_R * 0.42, ROCKET_R * 0.55, 1.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Engine ring at back (red band)
    ctx.fillStyle = "#E63950";
    ctx.fillRect(-ROCKET_R + 2, -ROCKET_R * 0.72, 3, ROCKET_R * 1.44);

    // Red stripe band near front
    ctx.fillStyle = "#E63950";
    ctx.fillRect(ROCKET_R * 0.32, -ROCKET_R * 0.72, 3.5, ROCKET_R * 1.44);

    // ── Nose cone (red, rounded tip) ─────────────────────────────────────
    const noseGrad = ctx.createLinearGradient(ROCKET_R * 0.55, 0, ROCKET_R + 14, 0);
    noseGrad.addColorStop(0, "#FF7C8A");
    noseGrad.addColorStop(0.6, "#E63950");
    noseGrad.addColorStop(1, "#A8202F");
    ctx.fillStyle = noseGrad;
    ctx.beginPath();
    ctx.moveTo(ROCKET_R * 0.55, -ROCKET_R * 0.72);
    ctx.quadraticCurveTo(ROCKET_R + 14, -ROCKET_R * 0.32, ROCKET_R + 14, 0);
    ctx.quadraticCurveTo(ROCKET_R + 14, ROCKET_R * 0.32, ROCKET_R * 0.55, ROCKET_R * 0.72);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#7A1820";
    ctx.lineWidth = 1;
    ctx.stroke();
    // nose highlight
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.ellipse(ROCKET_R * 0.85, -ROCKET_R * 0.42, 3.2, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // ── Cute porthole window with reflection ─────────────────────────────
    // Window outer ring (metallic)
    ctx.fillStyle = "#2A3548";
    ctx.beginPath();
    ctx.arc(2, 0, 7, 0, Math.PI * 2);
    ctx.fill();
    // Inner ring (lighter)
    ctx.fillStyle = "#5A6578";
    ctx.beginPath();
    ctx.arc(2, 0, 6.2, 0, Math.PI * 2);
    ctx.fill();
    // Window glass
    const winGrad = ctx.createRadialGradient(0, -2, 1, 2, 0, 8);
    winGrad.addColorStop(0, "#C8FAFF");
    winGrad.addColorStop(0.55, "#3FCDFF");
    winGrad.addColorStop(1, "#0E5A99");
    ctx.fillStyle = winGrad;
    ctx.shadowColor = "#3FCDFF";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(2, 0, 5.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // Reflection highlight (crescent)
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(0.7, -1.6, 1.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.arc(3.5, 1.8, 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // ── Cute rivets along the body ───────────────────────────────────────
    ctx.fillStyle = "#A8B0C0";
    const rivetXs = [-ROCKET_R + 5, -ROCKET_R + 10, ROCKET_R * 0.5];
    for (const rx of rivetXs) {
      ctx.beginPath();
      ctx.arc(rx, -ROCKET_R * 0.55, 0.95, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(rx, ROCKET_R * 0.55, 0.95, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }, []);

  // ── Main loop ─────────────────────────────────────────────────────────────
  const loop = useCallback((ts: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dt = Math.min((ts - (lastTRef.current || ts)) / 1000, 0.05);
    lastTRef.current = ts;
    if (guruQuiz.isPausedRef.current) { rafRef.current = requestAnimationFrame(loop); return; }

    const ph = phaseRef.current;

    // screen shake
    let sx = 0, sy = 0;
    if (shakeDurRef.current > 0) {
      shakeDurRef.current -= dt;
      sx = (Math.random() - 0.5) * shakeMagRef.current * 2;
      sy = (Math.random() - 0.5) * shakeMagRef.current * 2;
    }
    ctx.save();
    ctx.translate(sx, sy);

    // ── Background ──────────────────────────────────────────────────────
    if (isLight) {
      const skyGrad = ctx.createLinearGradient(0, 0, 0, CH);
      skyGrad.addColorStop(0, "#1a1a4e");
      skyGrad.addColorStop(1, "#0d0d2e");
      ctx.fillStyle = skyGrad;
    } else {
      const skyGrad = ctx.createLinearGradient(0, 0, 0, CH);
      skyGrad.addColorStop(0, "#050510");
      skyGrad.addColorStop(1, "#0a0a20");
      ctx.fillStyle = skyGrad;
    }
    ctx.fillRect(0, 0, CW, CH);

    // nebulas (parallax slower)
    nebulasRef.current.forEach(n => {
      if (ph === "playing") n.x -= n.speed * PIPE_SPEED * dt * 0.3;
      if (n.x + n.rx < 0) n.x = CW + n.rx;
      ctx.save();
      ctx.globalAlpha = n.alpha;
      const ng = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, Math.max(n.rx, n.ry));
      ng.addColorStop(0, n.color);
      ng.addColorStop(1, "transparent");
      ctx.fillStyle = ng;
      ctx.scale(1, n.ry / n.rx);
      ctx.beginPath();
      ctx.arc(n.x, n.y * (n.rx / n.ry), n.rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // stars
    bgStarsRef.current.forEach(s => {
      s.twinkle += dt * 2;
      const a = 0.4 + 0.6 * Math.abs(Math.sin(s.twinkle));
      ctx.globalAlpha = a;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // ── Pipes ──────────────────────────────────────────────────────────
    if (ph === "playing") {
      nextPipeRef.current -= PIPE_SPEED * dt;
      if (nextPipeRef.current <= 0) {
        spawnPipe();
        const speed = Math.max(140, PIPE_SPEED - scoreRef.current * 1.5);
        nextPipeRef.current = speed + 160 + Math.random() * 120;
      }
    }
    pipesRef.current = pipesRef.current.filter(p => p.x + PIPE_W > -10);
    pipesRef.current.forEach(p => {
      if (ph === "playing") p.x -= (PIPE_SPEED + scoreRef.current * 1.5) * dt;
      drawPipe(ctx, p, ts);

      // score
      if (ph === "playing" && !p.scored && p.x + PIPE_W < ROCKET_X - ROCKET_R) {
        p.scored = true;
        scoreRef.current += 1 + comboRef.current;
        setScore(scoreRef.current);
        spawnParticles(ROCKET_X + 30, ryRef.current, "#00FF88", 10);
      }

      // collision
      if (ph === "playing") {
        const rx = ROCKET_X, ry = ryRef.current;
        const topOk = ry - ROCKET_R > p.gapY;
        const botOk = ry + ROCKET_R < p.gapY + PIPE_GAP;
        const inX = rx + ROCKET_R > p.x + 4 && rx - ROCKET_R < p.x + PIPE_W - 4;
        if (inX && !(topOk && botOk)) {
          if (shieldRef.current > 0) {
            shieldRef.current = 0;
            showFeedback("🛡️ Perisai melindungimu!", true);
            spawnParticles(rx, ry, "#00FFFF", 20);
          } else {
            phaseRef.current = "dead";
            setPhase("dead");
            spawnParticles(rx, ry, "#FF4444", 30);
            shakeDurRef.current = 0.4;
            shakeMagRef.current = 8;
            if (scoreRef.current > bestRef.current) {
              bestRef.current = scoreRef.current;
              setBest(bestRef.current);
            }
          }
        }
      }
    });

    // ── Ground / ceiling ──────────────────────────────────────────────
    // ceiling
    ctx.fillStyle = "#1a1a3a";
    ctx.fillRect(0, 0, CW, 8);
    ctx.shadowColor = "#4444ff";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#5555ff";
    ctx.fillRect(0, 6, CW, 2);
    ctx.shadowBlur = 0;
    // floor
    ctx.fillStyle = "#1a1a3a";
    ctx.fillRect(0, CH - 8, CW, 8);
    ctx.shadowColor = "#4444ff";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#5555ff";
    ctx.fillRect(0, CH - 8, CW, 2);
    ctx.shadowBlur = 0;

    // ── Rocket physics ─────────────────────────────────────────────────
    if (ph === "playing") {
      if (flapRef.current) {
        rvyRef.current = FLAP_VY;
        flapRef.current = false;
        spawnParticles(ROCKET_X - ROCKET_R, ryRef.current, "#FF8800", 6);
      }
      rvyRef.current += GRAVITY * dt;
      ryRef.current += rvyRef.current * dt;
      rotRef.current = Math.max(-0.5, Math.min(1.2, rvyRef.current * 0.0016));

      if (ryRef.current - ROCKET_R < 8) {
        ryRef.current = 8 + ROCKET_R;
        rvyRef.current = 120;
      }
      if (ryRef.current + ROCKET_R > CH - 8) {
        if (shieldRef.current > 0) {
          ryRef.current = CH - 8 - ROCKET_R;
          rvyRef.current = FLAP_VY * 0.5;
          shieldRef.current = 0;
        } else {
          phaseRef.current = "dead";
          setPhase("dead");
          spawnParticles(ROCKET_X, ryRef.current, "#FF4444", 30);
          shakeDurRef.current = 0.4;
          shakeMagRef.current = 8;
          if (scoreRef.current > bestRef.current) {
            bestRef.current = scoreRef.current;
            setBest(bestRef.current);
          }
        }
      }
    }

    // shield timer
    if (shieldRef.current > 0) shieldRef.current -= dt;

    // ── Rocket flame trail (sparks + smoke) ────────────────────────────
    if (ph === "playing") {
      // Spawn 3 fresh particles per frame: 2 hot sparks + 1 smoke puff
      for (let k = 0; k < 2; k++) {
        trailRef.current.push({
          x: ROCKET_X - ROCKET_R - 2,
          y: ryRef.current + (Math.random() - 0.5) * 5,
          vx: -90 - Math.random() * 80,
          vy: (Math.random() - 0.5) * 50,
          r: 1.8 + Math.random() * 1.6,
          alpha: 1,
          hot: true,
        });
      }
      trailRef.current.push({
        x: ROCKET_X - ROCKET_R - 4,
        y: ryRef.current + (Math.random() - 0.5) * 3,
        vx: -50 - Math.random() * 30,
        vy: (Math.random() - 0.5) * 18,
        r: 3.5 + Math.random() * 2.2,
        alpha: 0.55,
        hot: false,
      });
    }
    // Update + draw trail particles
    trailRef.current = trailRef.current.filter(t => t.alpha > 0.04);
    for (const t of trailRef.current) {
      t.x += t.vx * dt;
      t.y += t.vy * dt;
      if (t.hot) {
        t.alpha -= dt * 3.2;
        t.r *= 0.97;
        // hot particle: orange→yellow gradient
        const hg = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, Math.max(0.5, t.r * 1.4));
        hg.addColorStop(0, `rgba(255,250,200,${Math.min(1, t.alpha)})`);
        hg.addColorStop(0.5, `rgba(255,160,40,${Math.min(1, t.alpha) * 0.85})`);
        hg.addColorStop(1, "rgba(255,80,0,0)");
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(t.x, t.y, Math.max(0.5, t.r * 1.4), 0, Math.PI * 2);
        ctx.fill();
      } else {
        t.alpha -= dt * 1.1;
        t.r += dt * 6; // smoke expands
        ctx.globalAlpha = t.alpha * 0.55;
        const sg = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.r);
        sg.addColorStop(0, "rgba(220,220,220,0.7)");
        sg.addColorStop(1, "rgba(120,120,130,0)");
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    ctx.globalAlpha = 1;

    // ── Particles ─────────────────────────────────────────────────────
    particlesRef.current = particlesRef.current.filter(p => p.alpha > 0 && p.life > 0);
    particlesRef.current.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 200 * dt;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / 0.8);
      ctx.globalAlpha = p.alpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // ── Rocket ────────────────────────────────────────────────────────
    if (ph !== "dead") {
      drawRocket(ctx, ryRef.current, rotRef.current, ts, shieldRef.current);
    }

    // ── HUD ───────────────────────────────────────────────────────────
    if (ph === "playing") {
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.beginPath();
      ctx.roundRect(CW / 2 - 60, 14, 120, 40, 10);
      ctx.fill();
      ctx.fillStyle = "#FFD700";
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 8;
      ctx.font = "bold 22px 'Orbitron', monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${scoreRef.current}`, CW / 2, 41);
      ctx.shadowBlur = 0;
      ctx.textAlign = "left";

      if (comboRef.current >= 2) {
        ctx.fillStyle = "#FF69B4";
        ctx.shadowColor = "#FF69B4";
        ctx.shadowBlur = 6;
        ctx.font = "bold 13px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`COMBO ×${comboRef.current + 1}`, CW / 2, 62);
        ctx.shadowBlur = 0;
        ctx.textAlign = "left";
      }
      if (shieldRef.current > 0) {
        ctx.fillStyle = "#00FFFF";
        ctx.font = "13px monospace";
        ctx.fillText(`🛡️ ${shieldRef.current.toFixed(1)}s`, 14, 68);
      }
    }

    // flash overlay
    if (flashRef.current > 0) {
      flashRef.current -= dt * 3;
      ctx.fillStyle = `rgba(255,60,60,${flashRef.current * 0.35})`;
      ctx.fillRect(0, 0, CW, CH);
    }

    ctx.restore();
    rafRef.current = requestAnimationFrame(loop);
  }, [isLight, drawPipe, drawRocket, spawnParticles, spawnPipe, showFeedback]);

  const startGame = useCallback(() => {
    playPopSound();
    resetGame();
    phaseRef.current = "playing";
    setPhase("playing");
    lastTRef.current = 0;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [resetGame, loop]);

  const flap = useCallback(() => {
    if (phaseRef.current === "playing") {
      flapRef.current = true;
    } else if (phaseRef.current === "idle" || phaseRef.current === "dead") {
      startGame();
    }
  }, [startGame]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp") { e.preventDefault(); flap(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flap]);

  useEffect(() => {
    initStatics();
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop, initStatics]);

  useEffect(() => () => {
    if (fbTimerRef.current) clearTimeout(fbTimerRef.current);
  }, []);

  if (phase === "idle") {
    return (
      <div className="fixed inset-0 z-40 overflow-hidden">
        <style>{`
          @keyframes fr-floatA { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
          @keyframes fr-floatB { 0%,100%{transform:translateY(-5px)} 50%{transform:translateY(7px)} }
          @keyframes fr-pulse  { 0%,100%{opacity:0.75} 50%{opacity:1} }
          @keyframes fr-shimmer{ 0%{background-position:200% center} 100%{background-position:-200% center} }
          @keyframes fr-scanY  { 0%{transform:translateY(-120%)} 100%{transform:translateY(220%)} }
          @keyframes fr-breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
          .fr-fa{animation:fr-floatA 3.2s ease-in-out infinite}
          .fr-fb{animation:fr-floatB 3.8s ease-in-out infinite}
          .fr-fp{animation:fr-pulse 2s ease-in-out infinite}
          .fr-title-shine{background:linear-gradient(90deg,#00FFFF,#38bdf8,#818cf8,#c084fc,#38bdf8,#00FFFF);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:fr-shimmer 4s linear infinite}
          .fr-btn-breathe{animation:fr-breathe 2.8s ease-in-out infinite}
          .fr-scroll { height:100%; overflow-y:auto; scrollbar-width:none; display:flex; flex-direction:column; }
          .fr-wrap   { flex:1; display:flex; flex-direction:column; justify-content:space-evenly; padding:0.5rem 1rem; width:100%; }
          .fr-main   { display:flex; flex-direction:column; gap:0.75rem; }
          .fr-battle { display:flex; flex-direction:column; gap:0.5rem; }
          .fr-action { display:flex; flex-direction:column; gap:0.5rem; }
          @media (orientation:landscape) {
            .fr-wrap   { justify-content:space-evenly; padding:0.35rem 1.75rem; max-width:860px; margin:0 auto; width:100%; }
            .fr-main   { flex-direction:row; align-items:stretch; gap:2rem; }
            .fr-battle { flex:1; justify-content:center; gap:0.6rem; }
            .fr-action { flex:1; justify-content:center; gap:0.6rem; }
          }
        `}</style>

        {/* Deep space background */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 15%, rgba(0,30,100,1) 0%, rgba(2,0,25,1) 60%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 15% 50%, rgba(56,100,200,0.18) 0%, transparent 55%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 85% 30%, rgba(130,0,200,0.12) 0%, transparent 55%)" }} />
        <div className="absolute inset-x-0 h-[1px] pointer-events-none" style={{ background: "linear-gradient(to right, transparent, rgba(0,255,255,0.18), transparent)", animation: "fr-scanY 6s linear infinite" }} />

        <div className="fr-scroll relative z-10">
          <div className="fr-wrap">

            {/* ── HEADER ── */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-between w-full mb-1">
                <button onClick={() => { playPopSound(); if (backPath) navigate(backPath); else navigate(-1); }}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-xs shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:opacity-90 transition-opacity cursor-pointer">
                  <span className="text-base leading-none">←</span>
                  <span>Kembali</span>
                </button>
                <div className="text-[7px] tracking-[5px] text-cyan-500/60 uppercase font-bold">⬡ MATH GAME ARENA ⬡</div>
                <button onClick={() => { playPopSound(); navigate(homePath); }}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-xs shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:opacity-90 transition-opacity cursor-pointer">
                  <span className="text-base leading-none">🏠</span>
                  <span>Home</span>
                </button>
              </div>
              <div className="fr-title-shine font-display font-black leading-none" style={{ fontSize: "clamp(1.6rem,5vw,2.2rem)" }}>FLAPPY ROCKET</div>
              <div className="mx-auto mt-0.5 h-0.5 w-28 rounded-full" style={{ background: "linear-gradient(to right, transparent, #00FFFF, #818cf8, transparent)" }} />
              <p className="text-white/40 text-[8px] tracking-widest uppercase mt-0.5">🚀 Hindari · Terbang · Taklukkan 🚀</p>
              {topicLabel && <p className="text-cyan-300/70 text-[9px] tracking-wider mt-0.5 font-bold">✦ {topicLabel} ✦</p>}
            </div>

            {/* ── MAIN BODY ── */}
            <div className="fr-main">

              {/* LEFT — rocket vs pipe visual */}
              <div className="fr-battle">
                <div className="flex items-end justify-center gap-6 w-full">
                  {/* Rocket player */}
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="text-[7px] text-cyan-400/70 font-bold tracking-wider uppercase">ROKETMU</div>
                    <div className="relative">
                      <div className="absolute inset-0 pointer-events-none rounded-full" style={{ background: "radial-gradient(circle, rgba(0,255,255,0.25) 0%, transparent 70%)", transform: "scale(2.4)" }} />
                      {/* Cute detailed rocket — points RIGHT (game direction) */}
                      <svg viewBox="0 0 110 70" className="fr-fa relative z-10" style={{ width: 72, filter: "drop-shadow(0 0 10px #00FFFF) drop-shadow(0 0 22px #0066FF)" }}>
                        <defs>
                          <linearGradient id="fr-body2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FFFFFF"/>
                            <stop offset="45%" stopColor="#E8F4FF"/>
                            <stop offset="100%" stopColor="#A0C4E8"/>
                          </linearGradient>
                          <linearGradient id="fr-nose2" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#FF9AA8"/>
                            <stop offset="55%" stopColor="#EE3355"/>
                            <stop offset="100%" stopColor="#AA1133"/>
                          </linearGradient>
                          <linearGradient id="fr-fin2" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#EE3355"/>
                            <stop offset="100%" stopColor="#991133"/>
                          </linearGradient>
                          <linearGradient id="fr-flame-outer" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="rgba(255,40,0,0)"/>
                            <stop offset="35%" stopColor="rgba(255,110,0,0.85)"/>
                            <stop offset="70%" stopColor="rgba(255,200,40,1)"/>
                            <stop offset="100%" stopColor="rgba(255,240,160,1)"/>
                          </linearGradient>
                          <linearGradient id="fr-flame-inner" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="rgba(255,210,80,0)"/>
                            <stop offset="50%" stopColor="rgba(255,240,190,0.95)"/>
                            <stop offset="100%" stopColor="rgba(255,255,255,1)"/>
                          </linearGradient>
                          <radialGradient id="fr-win2" cx="35%" cy="35%" r="60%">
                            <stop offset="0%" stopColor="#D0FAFF"/>
                            <stop offset="50%" stopColor="#30C8FF"/>
                            <stop offset="100%" stopColor="#0E5A99"/>
                          </radialGradient>
                          <radialGradient id="fr-halo" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="rgba(255,160,40,0.55)"/>
                            <stop offset="55%" stopColor="rgba(255,90,20,0.22)"/>
                            <stop offset="100%" stopColor="rgba(255,40,0,0)"/>
                          </radialGradient>
                        </defs>

                        {/* Engine nozzle */}
                        <rect x="10" y="27" width="7" height="16" rx="2" fill="#2A3548" stroke="#111820" strokeWidth="0.8"/>

                        {/* Flame halo glow */}
                        <ellipse cx="8" cy="35" rx="18" ry="14" fill="url(#fr-halo)"/>

                        {/* Outer flame */}
                        <path d="M16,27 Q2,31 0,35 Q2,39 16,43 Q14,38 14,35 Q14,32 16,27Z" fill="url(#fr-flame-outer)"/>
                        {/* Inner flame core */}
                        <path d="M16,30 Q5,33 4,35 Q5,37 16,40 Q13,37 13,35 Q13,33 16,30Z" fill="url(#fr-flame-inner)"/>

                        {/* Top fin */}
                        <path d="M22,22 L12,8 L12,22 L26,24Z" fill="url(#fr-fin2)" stroke="#880022" strokeWidth="0.6"/>
                        {/* Bottom fin */}
                        <path d="M22,48 L12,62 L12,48 L26,46Z" fill="url(#fr-fin2)" stroke="#880022" strokeWidth="0.6"/>

                        {/* Main body capsule */}
                        <path d="M17,22 L68,22 Q76,22 76,35 Q76,48 68,48 L17,48 Q14,44 14,35 Q14,26 17,22Z" fill="url(#fr-body2)" stroke="#7A8294" strokeWidth="1"/>

                        {/* Nose cone */}
                        <path d="M68,22 Q90,24 96,35 Q90,46 68,48Z" fill="url(#fr-nose2)" stroke="#880022" strokeWidth="0.8"/>
                        {/* Nose highlight */}
                        <ellipse cx="78" cy="29" rx="5" ry="2.5" fill="rgba(255,255,255,0.45)" transform="rotate(-20,78,29)"/>

                        {/* Red engine band */}
                        <rect x="17" y="22" width="5" height="26" rx="1.5" fill="#EE3355"/>
                        {/* Red accent stripe */}
                        <rect x="54" y="22" width="5" height="26" rx="1.5" fill="#EE3355"/>

                        {/* Porthole window outer ring */}
                        <circle cx="40" cy="35" r="10" fill="#2A3548"/>
                        <circle cx="40" cy="35" r="9" fill="#4A5568"/>
                        {/* Window glass */}
                        <circle cx="40" cy="35" r="8" fill="url(#fr-win2)"/>
                        {/* Window shine */}
                        <circle cx="36.5" cy="31.5" r="3" fill="rgba(255,255,255,0.9)"/>
                        <circle cx="43" cy="38" r="1.4" fill="rgba(255,255,255,0.45)"/>

                        {/* Cute face in window — astronaut */}
                        <circle cx="40" cy="35" r="5.5" fill="#FFE8C8"/>
                        {/* Eyes */}
                        <ellipse cx="37.5" cy="33.5" rx="1.2" ry="1.5" fill="#222"/>
                        <ellipse cx="42.5" cy="33.5" rx="1.2" ry="1.5" fill="#222"/>
                        {/* Eye shine */}
                        <circle cx="38" cy="33" r="0.55" fill="white"/>
                        <circle cx="43" cy="33" r="0.55" fill="white"/>
                        {/* Smile */}
                        <path d="M37.5,37 Q40,39.5 42.5,37" stroke="#A05030" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
                        {/* Rosy cheeks */}
                        <circle cx="36.5" cy="36.5" r="1.5" fill="rgba(255,100,100,0.35)"/>
                        <circle cx="43.5" cy="36.5" r="1.5" fill="rgba(255,100,100,0.35)"/>

                        {/* Rivets */}
                        <circle cx="22" cy="27" r="1.2" fill="#A8B8CC"/>
                        <circle cx="22" cy="43" r="1.2" fill="#A8B8CC"/>
                        <circle cx="30" cy="23" r="1.1" fill="#A8B8CC"/>
                        <circle cx="30" cy="47" r="1.1" fill="#A8B8CC"/>

                        {/* Glossy sheen on body */}
                        <path d="M17,22 L68,22 Q72,22 74,28 L17,28 Q14,26 17,22Z" fill="rgba(255,255,255,0.18)"/>

                        {/* Star decorations around rocket */}
                        <polygon points="5,14 6.2,11 7.4,14 10.5,14 8,16 9,19 6.2,17.2 3.4,19 4.4,16 2,14" fill="#FFD700" opacity="0.8"/>
                        <polygon points="100,18 101,15.5 102,18 104.5,18 102.5,19.5 103.2,22 101,20.5 98.8,22 99.5,19.5 97.5,18" fill="#FF88CC" opacity="0.7"/>
                      </svg>
                    </div>
                    <div className="w-1.5 h-4 rounded-full" style={{ background: "linear-gradient(to bottom, rgba(0,200,255,0.8), transparent)" }} />
                    <div className="text-[8px] font-bold text-cyan-400">KAMU</div>
                  </div>
                  <div className="flex flex-col items-center pb-4">
                    <div className="text-xl font-black text-white/20">VS</div>
                  </div>
                  {/* Asteroid obstacles */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-[7px] text-red-400/70 font-bold tracking-wider uppercase">RINTANGAN</div>
                    <div className="relative flex items-center justify-center fr-fb" style={{ width: 60, height: 86 }}>
                      <svg viewBox="0 0 60 86" style={{ width: 60, height: 86 }}>
                        <defs>
                          <linearGradient id="fr-ast-top" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#3F362E"/>
                            <stop offset="50%" stopColor="#8A7B6B"/>
                            <stop offset="100%" stopColor="#3F362E"/>
                          </linearGradient>
                          <linearGradient id="fr-ast-bot" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#3F362E"/>
                            <stop offset="50%" stopColor="#8A7B6B"/>
                            <stop offset="100%" stopColor="#3F362E"/>
                          </linearGradient>
                        </defs>
                        {/* Top asteroid (hanging from top) */}
                        <path d="M2,-2 L58,-2 L60,4 L57,10 L59,16 L56,22 L58,28 L53,33 Q47,37 40,35 Q33,38 26,35 Q20,38 14,34 L10,28 L12,22 L8,16 L11,10 L8,4 Z" fill="url(#fr-ast-top)" stroke="rgba(0,0,0,0.4)" strokeWidth="1"/>
                        {/* Craters on top asteroid */}
                        <circle cx="18" cy="12" r="4" fill="#3F362E"/>
                        <circle cx="16.5" cy="10.5" r="1.5" fill="#B8A896"/>
                        <circle cx="40" cy="20" r="5" fill="#3F362E"/>
                        <circle cx="38.5" cy="18.5" r="2" fill="#B8A896"/>
                        <circle cx="28" cy="8" r="3" fill="#3F362E"/>
                        <circle cx="27" cy="7" r="1.2" fill="#B8A896"/>
                        {/* Glow edge on top asteroid bottom */}
                        <path d="M14,34 Q26,32 30,36 Q34,32 47,35 L53,33" stroke="#00E5FF" strokeWidth="1.5" fill="none" strokeOpacity="0.7"/>

                        {/* Gap label */}
                        <text x="30" y="45" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#FFD700">CELAH</text>

                        {/* Bottom asteroid (rising from bottom) */}
                        <path d="M6,54 Q12,50 18,53 Q24,49 30,53 Q36,49 42,52 Q49,49 55,53 L58,58 L56,64 L59,70 L56,76 L58,82 L57,88 L2,88 L3,82 L1,76 L4,70 L2,64 L5,58 Z" fill="url(#fr-ast-bot)" stroke="rgba(0,0,0,0.4)" strokeWidth="1"/>
                        {/* Craters on bottom asteroid */}
                        <circle cx="20" cy="66" r="4.5" fill="#3F362E"/>
                        <circle cx="18.5" cy="64.5" r="1.8" fill="#B8A896"/>
                        <circle cx="42" cy="72" r="4" fill="#3F362E"/>
                        <circle cx="40.5" cy="70.5" r="1.5" fill="#B8A896"/>
                        <circle cx="31" cy="60" r="3" fill="#3F362E"/>
                        <circle cx="30" cy="59" r="1.1" fill="#B8A896"/>
                        {/* Glow edge on bottom asteroid top */}
                        <path d="M6,54 Q18,57 30,53 Q42,57 55,53" stroke="#FF6B6B" strokeWidth="1.5" fill="none" strokeOpacity="0.7"/>
                      </svg>
                    </div>
                    <span className="text-[8px] font-bold text-red-400">HINDARI!</span>
                  </div>
                </div>

                {/* Kontrol grid */}
                <div>
                  <div className="w-full h-px my-1.5" style={{ background: "linear-gradient(to right, transparent, rgba(0,200,255,0.25), transparent)" }} />
                  <div className="grid grid-cols-3 gap-1.5 w-full px-1">
                    {([
                      { icon: "👆", label: "TAP",   desc: "Layar untuk naik" },
                      { icon: "⌨️", label: "SPASI", desc: "Atau tombol ↑"    },
                      { icon: "📝", label: "SOAL",  desc: "Tiap 25 detik"    },
                    ] as const).map(t => (
                      <div key={t.label} className="flex flex-col items-center gap-0.5 rounded-xl py-1.5 px-1 border border-cyan-500/20"
                        style={{ background: "rgba(0,200,255,0.07)", boxShadow: "0 0 8px rgba(0,200,255,0.12)" }}>
                        <span className="text-base leading-none">{t.icon}</span>
                        <span className="text-[7px] font-black text-cyan-300">{t.label}</span>
                        <span className="text-[6px] text-white/35 text-center leading-tight">{t.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT — instructions + button */}
              <div className="fr-action">
                <div>
                  <div className="w-full h-px mb-1.5" style={{ background: "linear-gradient(to right, transparent, rgba(0,200,255,0.3), transparent)" }} />
                  <div className="text-[7px] text-white/35 tracking-widest uppercase mb-1.5 font-bold text-center">📋 CARA BERMAIN</div>
                  <div className="space-y-1.5 px-1">
                    {[
                      { icon: "🚀", text: "Tap layar atau tekan SPASI untuk membuat roket terbang naik" },
                      { icon: "🚧", text: "Hindari pipa dan terus terbang melewati setiap celah" },
                      { icon: "📝", text: "Tiap 25 detik muncul soal dari guru — jawab benar = +20 poin" },
                      { icon: "🏆", text: "Semakin jauh terbang, semakin tinggi skor kamu!" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-xs shrink-0 mt-0.5">{item.icon}</span>
                        <span className="text-[8px] text-white/60 leading-tight">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 mt-2">
                  {best > 0 && (
                    <div className="text-[8px] text-yellow-300/80 font-bold mb-0.5">🏆 Rekor Tertinggi: {best}</div>
                  )}
                  <button onClick={startGame}
                    className="fr-btn-breathe relative overflow-hidden font-display font-black text-black text-lg px-8 py-3 rounded-2xl cursor-pointer hover:scale-110 active:scale-95 w-full"
                    style={{
                      background: "linear-gradient(135deg, #00FFFF 0%, #22d3ee 40%, #0ea5e9 100%)",
                      boxShadow: "0 0 30px rgba(0,200,255,0.9), 0 0 60px rgba(0,120,200,0.4), 0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.4)",
                    }}>
                    <span className="relative z-10 tracking-wide">🚀 MULAI TERBANG</span>
                  </button>
                  <div className="text-[7px] text-white/20 text-center">Tap layar / SPASI / ↑ untuk terbang</div>
                </div>
              </div>

            </div>{/* fr-main */}
          </div>{/* fr-wrap */}
        </div>{/* fr-scroll */}
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}

      <div className="relative z-10 w-full max-w-lg px-2 pt-12 pb-4 flex flex-col items-center">
        {/* header */}
        <div className="flex items-center justify-between w-full mb-3 gap-2">
          <button
            onClick={() => { playPopSound(); if (backPath) navigate(backPath); else navigate(-1); }}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:opacity-90 transition-opacity cursor-pointer"
            title="Kembali ke pilihan game"
          >
            <span className="text-base leading-none">←</span>
            <span className="hidden sm:inline">Kembali</span>
          </button>
          <h1 className="font-display text-xl font-bold text-primary text-glow-cyan flex-1 text-center">
            🚀 FLAPPY ROCKET
          </h1>
          <button
            onClick={() => { playPopSound(); navigate(homePath); }}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:opacity-90 transition-opacity cursor-pointer"
            title="Menu Utama"
          >
            <span className="text-base leading-none">🏠</span>
            <span className="hidden sm:inline">Home</span>
          </button>
        </div>

        {/* best score strip */}
        <div className="flex gap-6 mb-2 text-xs font-display">
          <span className="text-yellow-400">⭐ SKOR: <span className="font-bold text-sm">{score}</span></span>
          <span className="text-white/50">🏆 REKOR: <span className="text-accent font-bold">{best}</span></span>
        </div>

        {/* canvas */}
        <div
          className="relative w-full cursor-pointer select-none"
          style={{ maxWidth: CW, maxHeight: 'calc(100dvh - 155px)', aspectRatio: `${CW}/${CH}` }}
          onClick={flap}
          onTouchStart={(e) => { e.preventDefault(); flap(); }}
        >
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            className="rounded-2xl border border-border shadow-2xl w-full h-full"
          />

          {/* feedback toast */}
          {feedback && (
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl font-bold text-sm shadow-xl pointer-events-none z-30 ${
              feedback.good ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
            } animate-bounce`}>
              {feedback.txt}
            </div>
          )}

          {/* dead */}
          {phase === "dead" && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/70">
              <div className="text-center px-5">
                <div className="text-4xl mb-2">💥</div>
                <h2 className="font-display text-2xl font-bold text-red-400 mb-1">GAME OVER</h2>
                <p className="text-white mb-1">Skor: <span className="text-yellow-400 font-bold text-2xl">{score}</span></p>
                <p className="text-white/50 text-sm mb-5">Rekor: {best}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); startGame(); }}
                  className="bg-accent text-black font-bold px-8 py-3 rounded-xl hover:opacity-90 transition cursor-pointer shadow-lg"
                >
                  🚀 Main Lagi
                </button>
              </div>
            </div>
          )}

        </div>

        <p className="mt-2 text-white/40 text-xs font-body text-center">
          Ketuk layar / SPASI / ↑ untuk terbang &nbsp;·&nbsp; Soal Guru muncul tiap 25 detik 📝
        </p>
      <GuruQuizOverlay {...guruQuiz} />
      </div>
    </div>
  );
};

// ── Utility ────────────────────────────────────────────────────────────────────
function shadeColor(hex: string, amt: number): string {
  let col = hex.replace("#", "");
  if (col.length === 3) col = col.split("").map(c => c + c).join("");
  const r = Math.max(0, Math.min(255, parseInt(col.substring(0, 2), 16) + amt));
  const g = Math.max(0, Math.min(255, parseInt(col.substring(2, 4), 16) + amt));
  const b = Math.max(0, Math.min(255, parseInt(col.substring(4, 6), 16) + amt));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export default FlappyRocketPage;
