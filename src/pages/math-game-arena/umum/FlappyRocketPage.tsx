import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";
import MathGameIntro from "@/components/MathGameIntro";

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

// ── Math questions ────────────────────────────────────────────────────────────
export interface MQ { q: string; opts: string[]; ans: number }
const DEFAULT_QUESTIONS: MQ[] = [
  {
    q: "Bentuk sederhana dari\n45 : 60 adalah ...",
    opts: ["1 : 2", "2 : 3", "3 : 4", "4 : 5"],
    ans: 2,
  },
  {
    q: "Jika 12 buku dibagikan kepada\n3 siswa, setiap 1 siswa\nmendapat ... buku",
    opts: ["3", "4", "5", "6"],
    ans: 1,
  },
  {
    q: "Jarak 150 km ditempuh dalam\n3 jam. Satuan pembanding\nkecepatannya adalah ...",
    opts: ["km", "jam", "km/jam", "m/s"],
    ans: 2,
  },
  {
    q: "Perbandingan digunakan untuk\nmembandingkan dua besaran.\nJika satuannya berbeda, satuan\nharus dibuat ... terlebih dahulu",
    opts: ["lebih besar", "sama", "berbeda", "lebih kecil"],
    ans: 1,
  },
];

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
  special: boolean;    // triggers math question
  qIdx: number;
  color: string;
  glowPhase: number;
}

type Phase = "idle" | "playing" | "question" | "dead";

// ── Nebula cloud ──────────────────────────────────────────────────────────────
interface NebulaCloud { x: number; y: number; rx: number; ry: number; color: string; alpha: number; speed: number }

// ── Component ─────────────────────────────────────────────────────────────────
interface FlappyRocketPageProps {
  questions?: MQ[];
  topicLabel?: string;
  backPath?: string;
  homePath?: string;
}

const FlappyRocketPage = ({
  questions,
  topicLabel,
  backPath,
  homePath = "/ruang-untuk-guru/numatik-game",
}: FlappyRocketPageProps = {}) => {
  const QUESTIONS = questions && questions.length > 0 ? questions : DEFAULT_QUESTIONS;
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastTRef = useRef(0);

  // game refs
  const phaseRef = useRef<Phase>("idle");
  const guruQuiz = useGuruQuiz(phaseRef);
  const ryRef = useRef(CH / 2);
  const rvyRef = useRef(0);
  const rotRef = useRef(0);
  const pipesRef = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const nextPipeRef = useRef(900);
  const particlesRef = useRef<Particle[]>([]);
  const flapRef = useRef(false);
  const usedQRef = useRef<Set<number>>(new Set());
  const pipeCountRef = useRef(0);
  const shieldRef = useRef(0);
  const comboRef = useRef(0);
  const flashRef = useRef(0);          // flash alpha for wrong answer
  const nebulasRef = useRef<NebulaCloud[]>([]);
  const bgStarsRef = useRef<{ x: number; y: number; r: number; twinkle: number }[]>([]);
  const trailRef = useRef<{ x: number; y: number; alpha: number }[]>([]);
  const activeQRef = useRef<MQ | null>(null);
  const shakeDurRef = useRef(0);
  const shakeMagRef = useRef(0);
  const postQuestionGraceRef = useRef(0);

  // React state (UI overlay only)
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [activeQ, setActiveQ] = useState<MQ | null>(null);
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

  const getQuestion = useCallback((): [MQ, number] => {
    const avail = QUESTIONS.map((_, i) => i).filter(i => !usedQRef.current.has(i));
    if (avail.length === 0) { usedQRef.current = new Set(); return getQuestion(); }
    const idx = avail[Math.floor(Math.random() * avail.length)];
    usedQRef.current.add(idx);
    return [QUESTIONS[idx], idx];
  }, []);

  const spawnPipe = useCallback(() => {
    pipeCountRef.current += 1;
    const gapY = 80 + Math.random() * (CH - PIPE_GAP - 160);
    // Question appears on every 4th pipe (pipe 4, 8, 12, 16 ...)
    const special = pipeCountRef.current % 4 === 0;
    const qIdx = special
      ? ((pipeCountRef.current / 4 - 1) % QUESTIONS.length)
      : -1;
    const PIPE_COLORS = ["#00E5FF", "#FF6B6B", "#00FF88", "#AA77FF"];
    pipesRef.current.push({
      x: CW + 10,
      gapY,
      scored: false,
      special,
      qIdx,
      color: special ? "#FFD700" : PIPE_COLORS[Math.floor(Math.random() * PIPE_COLORS.length)],
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
    pipeCountRef.current = 0;
    usedQRef.current = new Set();
    shieldRef.current = 0;
    comboRef.current = 0;
    flashRef.current = 0;
    shakeDurRef.current = 0;
    shakeMagRef.current = 0;
    activeQRef.current = null;
    postQuestionGraceRef.current = 0;
    flapRef.current = false;
    setScore(0);
    setActiveQ(null);
    setFeedback(null);
    setCombo(0);
  }, []);

  // ── Draw pipe (neon gate style) ────────────────────────────────────────────
  const drawPipe = useCallback((ctx: CanvasRenderingContext2D, p: Pipe, ts: number) => {
    const glow = 12 + 6 * Math.sin(ts / 600 + p.glowPhase);
    const col = p.color;

    // shadow/glow
    ctx.shadowColor = col;
    ctx.shadowBlur = glow;

    // top pipe
    const topH = p.gapY;
    const grad1 = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
    grad1.addColorStop(0, shadeColor(col, -30));
    grad1.addColorStop(0.5, col);
    grad1.addColorStop(1, shadeColor(col, -30));
    ctx.fillStyle = grad1;
    ctx.beginPath();
    ctx.roundRect(p.x, 0, PIPE_W, topH - 4, [0, 0, 10, 10]);
    ctx.fill();
    // cap
    ctx.beginPath();
    ctx.roundRect(p.x - 5, topH - 22, PIPE_W + 10, 22, [0, 0, 8, 8]);
    ctx.fill();

    // bottom pipe
    const botY = p.gapY + PIPE_GAP;
    const botH = CH - botY;
    const grad2 = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
    grad2.addColorStop(0, shadeColor(col, -30));
    grad2.addColorStop(0.5, col);
    grad2.addColorStop(1, shadeColor(col, -30));
    ctx.fillStyle = grad2;
    ctx.beginPath();
    ctx.roundRect(p.x, botY + 4, PIPE_W, botH, [8, 8, 0, 0]);
    ctx.fill();
    // cap
    ctx.beginPath();
    ctx.roundRect(p.x - 5, botY, PIPE_W + 10, 22, [8, 8, 0, 0]);
    ctx.fill();

    // inner highlight stripe
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(p.x + 8, 0, 6, topH - 4);
    ctx.fillRect(p.x + 8, botY + 4, 6, botH);

    // special badge
    if (p.special) {
      const pulse = 0.7 + 0.3 * Math.sin(ts / 300);
      ctx.globalAlpha = pulse;
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 15px monospace";
      ctx.textAlign = "center";
      ctx.fillText("⚡ SOAL", p.x + PIPE_W / 2, p.gapY + PIPE_GAP / 2 + 5);
      ctx.globalAlpha = 1;
    }
    ctx.shadowBlur = 0;
    ctx.textAlign = "left";
  }, []);

  // ── Draw rocket ────────────────────────────────────────────────────────────
  const drawRocket = useCallback((ctx: CanvasRenderingContext2D, y: number, rot: number, ts: number, shield: number) => {
    ctx.save();
    ctx.translate(ROCKET_X, y);
    ctx.rotate(rot);

    if (shield > 0) {
      const alpha = 0.3 + 0.2 * Math.sin(ts / 120);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#00FFFF";
      ctx.shadowColor = "#00FFFF";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(0, 0, ROCKET_R + 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    // engine glow
    const engGlow = ctx.createRadialGradient(-ROCKET_R - 4, 0, 1, -ROCKET_R - 4, 0, 16);
    engGlow.addColorStop(0, "rgba(255,160,0,0.95)");
    engGlow.addColorStop(0.4, "rgba(255,80,0,0.6)");
    engGlow.addColorStop(1, "rgba(255,0,0,0)");
    ctx.fillStyle = engGlow;
    ctx.beginPath();
    ctx.arc(-ROCKET_R - 4, 0, 16, 0, Math.PI * 2);
    ctx.fill();

    // flame flicker
    const fl = 8 + 5 * Math.sin(ts / 60);
    const flameGrad = ctx.createLinearGradient(-ROCKET_R - fl, 0, -ROCKET_R + 4, 0);
    flameGrad.addColorStop(0, "rgba(255,200,0,0)");
    flameGrad.addColorStop(0.5, "rgba(255,120,0,0.8)");
    flameGrad.addColorStop(1, "rgba(255,220,0,0.95)");
    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.moveTo(-ROCKET_R, -6);
    ctx.lineTo(-ROCKET_R - fl, 0);
    ctx.lineTo(-ROCKET_R, 6);
    ctx.closePath();
    ctx.fill();

    // body
    const bodyGrad = ctx.createLinearGradient(0, -ROCKET_R, 0, ROCKET_R);
    bodyGrad.addColorStop(0, "#88CCFF");
    bodyGrad.addColorStop(0.5, "#4499FF");
    bodyGrad.addColorStop(1, "#2255CC");
    ctx.fillStyle = bodyGrad;
    ctx.shadowColor = "#4499FF";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(0, 0, ROCKET_R, ROCKET_R * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // nose cone
    ctx.fillStyle = "#FF4E4E";
    ctx.beginPath();
    ctx.moveTo(ROCKET_R, 0);
    ctx.lineTo(ROCKET_R + 14, 0);
    ctx.lineTo(ROCKET_R, -5);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(ROCKET_R, 0);
    ctx.lineTo(ROCKET_R + 14, 0);
    ctx.lineTo(ROCKET_R, 5);
    ctx.closePath();
    ctx.fill();

    // fin top
    ctx.fillStyle = "#3377EE";
    ctx.beginPath();
    ctx.moveTo(-ROCKET_R, -ROCKET_R * 0.5);
    ctx.lineTo(-ROCKET_R - 8, -ROCKET_R - 4);
    ctx.lineTo(-ROCKET_R + 6, -ROCKET_R * 0.5);
    ctx.closePath();
    ctx.fill();
    // fin bot
    ctx.beginPath();
    ctx.moveTo(-ROCKET_R, ROCKET_R * 0.5);
    ctx.lineTo(-ROCKET_R - 8, ROCKET_R + 4);
    ctx.lineTo(-ROCKET_R + 6, ROCKET_R * 0.5);
    ctx.closePath();
    ctx.fill();

    // porthole
    ctx.fillStyle = "#00EEFF";
    ctx.shadowColor = "#00FFFF";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(4, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(3, -1, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

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
        if (p.special) {
          // trigger question
          phaseRef.current = "question";
          setPhase("question");
          activeQRef.current = QUESTIONS[p.qIdx];
          setActiveQ(QUESTIONS[p.qIdx]);
        } else {
          scoreRef.current += 1 + comboRef.current;
          setScore(scoreRef.current);
          spawnParticles(ROCKET_X + 30, ryRef.current, "#00FF88", 10);
        }
      }

      // collision
      if (ph === "playing" && postQuestionGraceRef.current <= 0) {
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

    // ── Grace period countdown ─────────────────────────────────────────
    if (postQuestionGraceRef.current > 0) postQuestionGraceRef.current -= dt;

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

    // ── Rocket trail ───────────────────────────────────────────────────
    if (ph === "playing") {
      trailRef.current.push({ x: ROCKET_X - ROCKET_R, y: ryRef.current, alpha: 0.7 });
    }
    trailRef.current = trailRef.current.filter(t => t.alpha > 0);
    trailRef.current.forEach((t, i) => {
      t.alpha -= dt * 3.5;
      const r = 3 * (t.alpha / 0.7);
      if (r > 0.3) {
        ctx.globalAlpha = t.alpha * 0.6;
        ctx.fillStyle = i % 2 === 0 ? "#FF8800" : "#FFDD00";
        ctx.beginPath();
        ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    });
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
    if (ph === "playing" || ph === "question") {
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

  const handleAnswer = useCallback((idx: number) => {
    const q = activeQRef.current;
    if (!q) return;
    playPopSound();
    if (idx === q.ans) {
      scoreRef.current += 25;
      setScore(scoreRef.current);
      // Big golden burst + green overlay
      spawnParticles(ROCKET_X, ryRef.current, "#FFD700", 28);
      spawnParticles(ROCKET_X, ryRef.current, "#00FF88", 14);
      showFeedback("✅ Jawaban Anda Benar! +25", true);
    } else {
      // Red flash + shake
      flashRef.current = 1.2;
      shakeDurRef.current = 0.4;
      shakeMagRef.current = 7;
      spawnParticles(ROCKET_X, ryRef.current, "#FF4444", 18);
      showFeedback(`❌ Jawaban Anda Salah! Jawaban: ${q.opts[q.ans]}`, false);
    }
    activeQRef.current = null;
    setActiveQ(null);
    // Grace period: collision disabled for 1.5s so rocket isn't immediately hit by frozen pipes
    postQuestionGraceRef.current = 1.5;
    phaseRef.current = "playing";
    setPhase("playing");
  }, [spawnParticles, showFeedback]);

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
      <MathGameIntro
        gameTitle="FLAPPY ROCKET"
        subtitle="🚀 MISI LUAR ANGKASA 🚀"
        topicLabel={topicLabel}
        heroEmoji="🚀"
        startLabel="TERBANG SEKARANG"
        theme="space"
        onStart={startGame}
        onBack={() => { playPopSound(); if (backPath) navigate(backPath); else navigate(-1); }}
        onHome={() => { playPopSound(); navigate(homePath); }}
        bestLabel={best > 0 ? `Rekor Tertinggi: ${best}` : undefined}
        decorations={[
          { src: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 100"><defs><linearGradient id="b1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#88CCFF"/><stop offset="50%" stop-color="#4499FF"/><stop offset="100%" stop-color="#2255CC"/></linearGradient><linearGradient id="n1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF8888"/><stop offset="100%" stop-color="#CC2222"/></linearGradient></defs><path d="M30,3 Q42,22 42,38 L18,38 Q18,22 30,3Z" fill="url(#n1)"/><rect x="16" y="36" width="28" height="36" rx="5" fill="url(#b1)"/><circle cx="30" cy="52" r="7" fill="#00EEFF" opacity="0.95"/><circle cx="28" cy="50" r="3" fill="white" opacity="0.8"/><path d="M16,66 L4,88 L16,80Z" fill="#3377EE"/><path d="M44,66 L56,88 L44,80Z" fill="#3377EE"/><ellipse cx="30" cy="76" rx="12" ry="5" fill="#FF8800" opacity="0.9"/><ellipse cx="30" cy="83" rx="7" ry="9" fill="#FFE000" opacity="0.85"/><ellipse cx="30" cy="91" rx="4" ry="5" fill="white" opacity="0.6"/></svg>')}`, className: "absolute top-[10%] left-[8%] w-14 h-20 md:w-20 md:h-28 opacity-80 animate-float-slow", glowRgba: "rgba(0,200,255,0.55)" },
          { src: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 100"><defs><linearGradient id="b2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#CCAAFF"/><stop offset="50%" stop-color="#9966FF"/><stop offset="100%" stop-color="#6633BB"/></linearGradient><linearGradient id="n2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFAAAA"/><stop offset="100%" stop-color="#FF3333"/></linearGradient></defs><path d="M30,3 Q42,22 42,38 L18,38 Q18,22 30,3Z" fill="url(#n2)"/><rect x="16" y="36" width="28" height="36" rx="5" fill="url(#b2)"/><circle cx="30" cy="52" r="7" fill="#FF99FF" opacity="0.95"/><circle cx="28" cy="50" r="3" fill="white" opacity="0.8"/><path d="M16,66 L4,88 L16,80Z" fill="#7744DD"/><path d="M44,66 L56,88 L44,80Z" fill="#7744DD"/><ellipse cx="30" cy="76" rx="12" ry="5" fill="#FF6600" opacity="0.9"/><ellipse cx="30" cy="83" rx="7" ry="9" fill="#FFCC00" opacity="0.85"/><ellipse cx="30" cy="91" rx="4" ry="5" fill="white" opacity="0.6"/></svg>')}`, className: "absolute top-[35%] right-[6%] w-10 h-14 md:w-14 md:h-20 opacity-70 animate-float-medium", glowRgba: "rgba(180,100,255,0.5)" },
          { src: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 100"><defs><linearGradient id="b3" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#88FFCC"/><stop offset="50%" stop-color="#00DDAA"/><stop offset="100%" stop-color="#009977"/></linearGradient><linearGradient id="n3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFDD88"/><stop offset="100%" stop-color="#FF9900"/></linearGradient></defs><path d="M30,3 Q42,22 42,38 L18,38 Q18,22 30,3Z" fill="url(#n3)"/><rect x="16" y="36" width="28" height="36" rx="5" fill="url(#b3)"/><circle cx="30" cy="52" r="7" fill="#AAFFEE" opacity="0.95"/><circle cx="28" cy="50" r="3" fill="white" opacity="0.8"/><path d="M16,66 L4,88 L16,80Z" fill="#00AA77"/><path d="M44,66 L56,88 L44,80Z" fill="#00AA77"/><ellipse cx="30" cy="76" rx="12" ry="5" fill="#FF7700" opacity="0.9"/><ellipse cx="30" cy="83" rx="7" ry="9" fill="#FFEE00" opacity="0.85"/><ellipse cx="30" cy="91" rx="4" ry="5" fill="white" opacity="0.6"/></svg>')}`, className: "absolute bottom-[18%] left-[10%] w-14 h-20 md:w-20 md:h-28 opacity-80 animate-float-fast", glowRgba: "rgba(0,220,170,0.55)" },
        ]}
        instructions={[
          { text: <>Tap layar atau tekan <strong className="text-yellow-300">SPASI</strong> untuk membuat roket terbang naik</> },
          { text: <>Hindari pipa dan terus terbang melewati setiap celah</> },
          { text: <><strong className="text-yellow-300">Gerbang Emas</strong> muncul tiap 4 pipa — masuk untuk dapat soal bonus</> },
          { text: <>Jawab benar dapat <strong className="text-green-400">+25 skor</strong></> },
        ]}
      />
    );
  }

  return (
    <div className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}

      <div className="relative z-10 w-full max-w-lg px-2 py-4 flex flex-col items-center">
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

          {/* question */}
          {phase === "question" && activeQ && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/75 rounded-2xl">
              <div className="bg-card/95 backdrop-blur border-2 border-yellow-400 rounded-2xl p-5 mx-3 shadow-2xl w-full max-w-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-[10px] text-white/40 font-display text-center mb-1 tracking-widest">
                  ⏸ GAME PAUSED
                </div>
                <div className="text-xs text-yellow-400 font-display mb-2 text-center tracking-widest">
                  ⚡ SOAL MATEMATIKA ⚡
                </div>
                <p className="text-white font-bold text-center text-sm mb-4 leading-snug whitespace-pre-line">
                  {activeQ.q}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {activeQ.opts.map((opt, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); handleAnswer(i); }}
                      className="bg-primary/20 hover:bg-yellow-400/20 border border-border hover:border-yellow-400 text-white font-bold py-3 px-2 rounded-xl text-sm transition-all cursor-pointer active:scale-95"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <p className="text-white/40 text-xs text-center mt-3">Jawab benar = +25 skor 🌟</p>
              </div>
            </div>
          )}
        </div>

        <p className="mt-2 text-white/40 text-xs font-body text-center">
          Ketuk layar / SPASI / ↑ untuk terbang &nbsp;·&nbsp; Gerbang emas setiap 4 pipa = ada soal! 📝
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
