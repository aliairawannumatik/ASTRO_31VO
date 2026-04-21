import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";

// ── Canvas ───────────────────────────────────────────────────────────────
const CW = 420;
const CH = 560;
const BASKET_W = 70;
const BASKET_H = 40;
const BASKET_Y = CH - 55;
const BASKET_SPEED = 340;
const ITEM_R = 18;

// ── Item types ────────────────────────────────────────────────────────────
type ItemKind = "star" | "gem" | "coin" | "math" | "bomb";
interface FallingItem {
  id: number;
  x: number;
  y: number;
  vy: number;
  kind: ItemKind;
  label: string;
  color: string;
  glow: string;
  points: number;
  caught: boolean;
  missed: boolean;
  catchAnim: number;  // >0 = playing catch animation
  wobble: number;
  wobbleSpeed: number;
}

// ── Math questions ────────────────────────────────────────────────────────
interface MQ { q: string; opts: string[]; ans: number }
const QUESTIONS: MQ[] = [
  { q: "8 × 9 = ?", opts: ["63","72","81","90"], ans: 1 },
  { q: "√225 = ?", opts: ["13","14","15","16"], ans: 2 },
  { q: "2⁷ = ?", opts: ["64","128","256","512"], ans: 1 },
  { q: "FPB(48, 36) = ?", opts: ["6","9","12","18"], ans: 2 },
  { q: "45% × 200 = ?", opts: ["75","80","90","100"], ans: 2 },
  { q: "(-8)×(-9) = ?", opts: ["-72","-17","17","72"], ans: 3 },
  { q: "3x − 5 = 19, x = ?", opts: ["6","7","8","9"], ans: 2 },
  { q: "KPK(8, 12) = ?", opts: ["16","20","24","32"], ans: 2 },
  { q: "Luas trapesium (a=6,b=10,t=4) = ?", opts: ["28","30","32","34"], ans: 2 },
  { q: "4² + 3² = ?", opts: ["20","23","25","30"], ans: 2 },
  { q: "cos 0° = ?", opts: ["0","1/2","√2/2","1"], ans: 3 },
  { q: "Rata-rata: 5,8,10,12,15 = ?", opts: ["9","10","11","12"], ans: 1 },
  { q: "60% dari 250 = ?", opts: ["130","140","150","160"], ans: 2 },
  { q: "a=4,b=3 → √(a²+b²) = ?", opts: ["4","5","6","7"], ans: 1 },
  { q: "3/4 × 2/3 = ?", opts: ["1/4","1/3","1/2","2/3"], ans: 2 },
  { q: "Volume kerucut r=3,t=4 ≈ ?", opts: ["30,2","37,7","50,3","75,4"], ans: 1 },
  { q: "Suku ke-10: 3,6,9,... = ?", opts: ["27","30","33","36"], ans: 1 },
  { q: "n² − 4 = 32, n = ?", opts: ["4","5","6","7"], ans: 2 },
  { q: "Median: 2,4,6,8,10,12 = ?", opts: ["5","6","7","8"], ans: 2 },
  { q: "1/2 + 2/3 + 1/6 = ?", opts: ["1","4/3","3/2","7/6"], ans: 0 },
];

const ITEM_POOL: Array<{ kind: ItemKind; label: string; color: string; glow: string; points: number; weight: number }> = [
  { kind: "star",  label: "⭐", color: "#FFD700", glow: "#FFD700", points: 10, weight: 25 },
  { kind: "gem",   label: "💎", color: "#00E5FF", glow: "#00E5FF", points: 15, weight: 20 },
  { kind: "coin",  label: "🪙", color: "#FFA500", glow: "#FFA500", points: 8,  weight: 22 },
  { kind: "math",  label: "➕", color: "#00FF88", glow: "#00FF88", points: 20, weight: 15 },
  { kind: "math",  label: "✖️", color: "#FF69B4", glow: "#FF69B4", points: 20, weight: 13 },
  { kind: "bomb",  label: "💣", color: "#FF4444", glow: "#FF4444", points: 0,  weight: 5 },
];

function pickItem(): typeof ITEM_POOL[number] {
  const total = ITEM_POOL.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (const item of ITEM_POOL) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return ITEM_POOL[0];
}

type Phase = "idle" | "playing" | "question" | "dead";

let _itemId = 0;

// ── Background decorations ────────────────────────────────────────────────
interface BgStar { x: number; y: number; r: number; t: number; speed: number }

const CatchItemsGamePage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastTRef = useRef(0);

  // game state refs
  const phaseRef = useRef<Phase>("idle");
  const guruQuiz = useGuruQuiz(phaseRef);
  const bxRef = useRef(CW / 2 - BASKET_W / 2);
  const itemsRef = useRef<FallingItem[]>([]);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const bestRef = useRef(0);
  const elapsedRef = useRef(0);
  const nextItemRef = useRef(1200);
  const usedQRef = useRef<Set<number>>(new Set());
  const mathCaughtRef = useRef(0);
  const multiplierRef = useRef(1);
  const multiplierTimerRef = useRef(0);
  const bgStarsRef = useRef<BgStar[]>([]);
  const keysRef = useRef<Record<string, boolean>>({});
  const touchXRef = useRef<number | null>(null);
  const shakeDurRef = useRef(0);
  const catchFlashRef = useRef(0);
  const missFlashRef = useRef(0);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; alpha: number; color: string; r: number }>>([]);
  const questionPendingRef = useRef(false);
  const postQuestionGraceRef = useRef(0);

  // React state (UI only)
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [best, setBest] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [activeQ, setActiveQ] = useState<MQ | null>(null);
  const [feedback, setFeedback] = useState<{ txt: string; good: boolean } | null>(null);
  const fbRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFeedback = useCallback((txt: string, good: boolean) => {
    setFeedback({ txt, good });
    if (fbRef.current) clearTimeout(fbRef.current);
    fbRef.current = setTimeout(() => setFeedback(null), 1400);
  }, []);

  const spawnParticles = useCallback((x: number, y: number, color: string, n = 12) => {
    for (let i = 0; i < n; i++) {
      const ang = (Math.PI * 2 * i) / n + Math.random() * 0.5;
      const spd = 50 + Math.random() * 130;
      particlesRef.current.push({ x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, alpha: 1, color, r: 2 + Math.random() * 3 });
    }
  }, []);

  const getQuestion = useCallback((): MQ => {
    const avail = QUESTIONS.map((_, i) => i).filter(i => !usedQRef.current.has(i));
    if (!avail.length) { usedQRef.current = new Set(); return getQuestion(); }
    const idx = avail[Math.floor(Math.random() * avail.length)];
    usedQRef.current.add(idx);
    return QUESTIONS[idx];
  }, []);

  // ── Speed calculation ────────────────────────────────────────────────
  const getSpeed = useCallback((elapsed: number) => {
    return Math.min(100 + elapsed * 18, 440);
  }, []);

  const getSpawnInterval = useCallback((elapsed: number) => {
    return Math.max(380, 1200 - elapsed * 45);
  }, []);

  // ── Reset ────────────────────────────────────────────────────────────
  const resetGame = useCallback(() => {
    bxRef.current = CW / 2 - BASKET_W / 2;
    itemsRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    livesRef.current = 3;
    elapsedRef.current = 0;
    nextItemRef.current = 1200;
    mathCaughtRef.current = 0;
    multiplierRef.current = 1;
    multiplierTimerRef.current = 0;
    shakeDurRef.current = 0;
    catchFlashRef.current = 0;
    missFlashRef.current = 0;
    questionPendingRef.current = false;
    postQuestionGraceRef.current = 0;
    keysRef.current = {};
    touchXRef.current = null;
    setScore(0);
    setLives(3);
    setMultiplier(1);
    setActiveQ(null);
    setFeedback(null);
    bgStarsRef.current = Array.from({ length: 80 }, () => ({
      x: Math.random() * CW, y: Math.random() * CH,
      r: 0.5 + Math.random() * 1.5, t: Math.random() * Math.PI * 2, speed: 0.8 + Math.random() * 1.5,
    }));
  }, []);

  // ── Basket draw ───────────────────────────────────────────────────────
  const drawBasket = useCallback((ctx: CanvasRenderingContext2D, bx: number, ts: number, shake: number) => {
    const x = bx + (shake > 0 ? (Math.random() - 0.5) * shake * 6 : 0);
    const y = BASKET_Y;

    // glow ring
    ctx.shadowColor = "#00FFAA";
    ctx.shadowBlur = 18;
    // base trapezoid
    const grad = ctx.createLinearGradient(x, y, x, y + BASKET_H);
    grad.addColorStop(0, "#00CC77");
    grad.addColorStop(1, "#007744");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(x + 6, y);
    ctx.lineTo(x + BASKET_W - 6, y);
    ctx.lineTo(x + BASKET_W, y + BASKET_H);
    ctx.lineTo(x, y + BASKET_H);
    ctx.closePath();
    ctx.fill();

    // rim
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#00FF88";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 2, y + 2);
    ctx.lineTo(x + BASKET_W - 2, y + 2);
    ctx.stroke();

    // weave lines
    ctx.strokeStyle = "rgba(0,255,136,0.3)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * (BASKET_W / 4), y);
      ctx.lineTo(x + i * (BASKET_W / 4) + 3, y + BASKET_H);
      ctx.stroke();
    }
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x, y + i * (BASKET_H / 3));
      ctx.lineTo(x + BASKET_W, y + i * (BASKET_H / 3));
      ctx.stroke();
    }

    // pulse ring when multiplier active
    if (multiplierRef.current > 1) {
      const pulse = 0.5 + 0.5 * Math.sin(ts / 200);
      ctx.strokeStyle = `rgba(255,215,0,${pulse})`;
      ctx.lineWidth = 3;
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(x - 5, y - 5, BASKET_W + 10, BASKET_H + 10, 8);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    ctx.shadowBlur = 0;
  }, []);

  // ── Item draw ────────────────────────────────────────────────────────
  const drawItem = useCallback((ctx: CanvasRenderingContext2D, item: FallingItem, ts: number) => {
    if (item.missed) return;
    const wobX = Math.sin(ts / 300 * item.wobbleSpeed + item.wobble) * 3;
    const x = item.x + wobX;
    const scale = item.caught ? Math.max(0, 1 + item.catchAnim * 0.5) : 1;

    ctx.save();
    ctx.translate(x, item.y);
    ctx.scale(scale, scale);
    ctx.shadowColor = item.glow;
    ctx.shadowBlur = 12 + 6 * Math.sin(ts / 400);
    ctx.font = `${ITEM_R * 1.6}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(item.label, 0, 0);
    ctx.shadowBlur = 0;

    // points badge when just caught
    if (item.caught && item.catchAnim > 0.5) {
      ctx.globalAlpha = (item.catchAnim - 0.3) / 0.7;
      ctx.fillStyle = item.kind === "bomb" ? "#FF4444" : "#FFD700";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.fillText(item.kind === "bomb" ? "-💥" : `+${item.points * multiplierRef.current}`, 0, -ITEM_R - 8);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }, []);

  // ── Main loop ─────────────────────────────────────────────────────────
  const loop = useCallback((ts: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dt = Math.min((ts - (lastTRef.current || ts)) / 1000, 0.05);
    lastTRef.current = ts;
    if (guruQuiz.isPausedRef.current) { rafRef.current = requestAnimationFrame(loop); return; }
    const ph = phaseRef.current;

    // ── Background ────────────────────────────────────────────────
    const bgGrad = ctx.createLinearGradient(0, 0, 0, CH);
    if (isLight) {
      bgGrad.addColorStop(0, "#0d0d2e");
      bgGrad.addColorStop(1, "#1a1a4a");
    } else {
      bgGrad.addColorStop(0, "#050512");
      bgGrad.addColorStop(1, "#0a0a22");
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CW, CH);

    // stars
    bgStarsRef.current.forEach(s => {
      s.t += dt * s.speed;
      const a = 0.3 + 0.7 * Math.abs(Math.sin(s.t));
      ctx.globalAlpha = a;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // ── Spawn items ───────────────────────────────────────────────
    if (ph === "playing") {
      elapsedRef.current += dt;
      nextItemRef.current -= getSpawnInterval(elapsedRef.current) * dt / 1000 * getSpawnInterval(elapsedRef.current);
      // simpler: just countdown by ms
      nextItemRef.current -= dt * 1000;
      if (nextItemRef.current <= 0) {
        const pool = pickItem();
        itemsRef.current.push({
          id: _itemId++,
          x: ITEM_R + Math.random() * (CW - ITEM_R * 2),
          y: -ITEM_R,
          vy: getSpeed(elapsedRef.current),
          kind: pool.kind,
          label: pool.label,
          color: pool.color,
          glow: pool.glow,
          points: pool.points,
          caught: false,
          missed: false,
          catchAnim: 0,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.5 + Math.random(),
        });
        nextItemRef.current = getSpawnInterval(elapsedRef.current);
      }

      // multiplier timer
      if (multiplierTimerRef.current > 0) {
        multiplierTimerRef.current -= dt;
        if (multiplierTimerRef.current <= 0) {
          multiplierRef.current = 1;
          setMultiplier(1);
        }
      }
    }

    // ── Update items ─────────────────────────────────────────────
    // Grace period countdown after answering a question
    if (postQuestionGraceRef.current > 0) postQuestionGraceRef.current -= dt;

    // During "question" phase the game is PAUSED — items freeze in place,
    // no collision / miss logic runs so player cannot lose lives while answering.
    if (ph === "playing") {
      itemsRef.current.forEach(item => {
        if (item.caught) {
          item.catchAnim = Math.max(0, item.catchAnim - dt * 3);
          return;
        }
        if (item.missed) return;
        item.y += item.vy * dt;

        // catch check
        const bx = bxRef.current;
        if (
          item.y + ITEM_R > BASKET_Y &&
          item.y - ITEM_R < BASKET_Y + BASKET_H &&
          item.x > bx &&
          item.x < bx + BASKET_W
        ) {
          item.caught = true;
          item.catchAnim = 1;
          spawnParticles(item.x, item.y, item.color, 10);
          if (item.kind === "bomb" && postQuestionGraceRef.current <= 0) {
            livesRef.current = Math.max(0, livesRef.current - 1);
            setLives(livesRef.current);
            shakeDurRef.current = 0.4;
            missFlashRef.current = 1;
            showFeedback("💣 BOM! Nyawa berkurang!", false);
            if (livesRef.current <= 0) {
              phaseRef.current = "dead";
              setPhase("dead");
              if (scoreRef.current > bestRef.current) { bestRef.current = scoreRef.current; setBest(bestRef.current); }
            }
          } else if (item.kind === "bomb") {
            // grace period active — bomb caught but no damage
          } else {
            const pts = item.points * multiplierRef.current;
            scoreRef.current += pts;
            setScore(scoreRef.current);
            catchFlashRef.current = 0.4;
            if (item.kind === "math") {
              mathCaughtRef.current += 1;
              if (mathCaughtRef.current >= 3 && !questionPendingRef.current) {
                mathCaughtRef.current = 0;
                questionPendingRef.current = true;
                setTimeout(() => {
                  if (phaseRef.current === "playing") {
                    phaseRef.current = "question";
                    setPhase("question");
                    setActiveQ(getQuestion());
                  }
                  questionPendingRef.current = false;
                }, 300);
              }
            }
          }
          return;
        }

        // miss check
        if (item.y - ITEM_R > CH) {
          if (item.kind !== "bomb" && postQuestionGraceRef.current <= 0) {
            item.missed = true;
            livesRef.current = Math.max(0, livesRef.current - 1);
            setLives(livesRef.current);
            shakeDurRef.current = 0.3;
            missFlashRef.current = 0.8;
            showFeedback("❌ Terlewat! Nyawa berkurang!", false);
            if (livesRef.current <= 0) {
              phaseRef.current = "dead";
              setPhase("dead");
              if (scoreRef.current > bestRef.current) { bestRef.current = scoreRef.current; setBest(bestRef.current); }
            }
          } else {
            item.missed = true; // bomb fell off safely, or grace period active
          }
        }
      });
      itemsRef.current = itemsRef.current.filter(i => !i.missed && (i.catchAnim > 0 || !i.caught) ? true : i.caught && i.catchAnim > 0);
    }

    // ── Basket movement ───────────────────────────────────────────
    if (ph === "playing") {
      if (keysRef.current["ArrowLeft"] || keysRef.current["a"] || keysRef.current["A"]) {
        bxRef.current = Math.max(0, bxRef.current - BASKET_SPEED * dt);
      }
      if (keysRef.current["ArrowRight"] || keysRef.current["d"] || keysRef.current["D"]) {
        bxRef.current = Math.min(CW - BASKET_W, bxRef.current + BASKET_SPEED * dt);
      }
      if (touchXRef.current !== null) {
        const target = touchXRef.current - BASKET_W / 2;
        const diff = target - bxRef.current;
        bxRef.current = Math.max(0, Math.min(CW - BASKET_W, bxRef.current + diff * Math.min(1, BASKET_SPEED * dt / Math.max(1, Math.abs(diff)))));
      }
    }

    // ── Draw items ────────────────────────────────────────────────
    itemsRef.current.forEach(item => drawItem(ctx, item, ts));

    // ── Particles ─────────────────────────────────────────────────
    particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);
    particlesRef.current.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 180 * dt;
      p.alpha -= dt * 2.5;
      ctx.globalAlpha = p.alpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 4;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // ── Basket ────────────────────────────────────────────────────
    if (ph !== "dead") {
      const shake = shakeDurRef.current > 0 ? shakeDurRef.current : 0;
      if (shakeDurRef.current > 0) shakeDurRef.current -= dt;
      drawBasket(ctx, bxRef.current, ts, shake * 10);
    }

    // ── Ground line ────────────────────────────────────────────────
    ctx.strokeStyle = "rgba(0,255,136,0.2)";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 8]);
    ctx.beginPath();
    ctx.moveTo(0, BASKET_Y + BASKET_H + 10);
    ctx.lineTo(CW, BASKET_Y + BASKET_H + 10);
    ctx.stroke();
    ctx.setLineDash([]);

    // ── Flash overlays ────────────────────────────────────────────
    if (catchFlashRef.current > 0) {
      catchFlashRef.current -= dt * 3;
      ctx.fillStyle = `rgba(0,255,136,${catchFlashRef.current * 0.12})`;
      ctx.fillRect(0, 0, CW, CH);
    }
    if (missFlashRef.current > 0) {
      missFlashRef.current -= dt * 3;
      ctx.fillStyle = `rgba(255,60,60,${missFlashRef.current * 0.2})`;
      ctx.fillRect(0, 0, CW, CH);
    }

    // ── HUD ───────────────────────────────────────────────────────
    // score
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.roundRect(8, 8, 160, 42, 10);
    ctx.fill();
    ctx.fillStyle = "#FFD700";
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 6;
    ctx.font = "bold 18px monospace";
    ctx.fillText(`SKOR: ${scoreRef.current}`, 18, 34);
    ctx.shadowBlur = 0;

    // multiplier badge
    if (multiplierRef.current > 1) {
      ctx.fillStyle = "rgba(255,215,0,0.2)";
      ctx.beginPath();
      ctx.roundRect(175, 8, 80, 42, 10);
      ctx.fill();
      ctx.fillStyle = "#FFD700";
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 8;
      ctx.font = "bold 16px monospace";
      ctx.fillText(`×${multiplierRef.current}`, 190, 34);
      ctx.shadowBlur = 0;
    }

    // speed indicator
    const spd = getSpeed(elapsedRef.current);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.roundRect(CW - 120, 8, 112, 42, 10);
    ctx.fill();
    const spdPct = Math.min((spd - 100) / 340, 1);
    const spdColor = `hsl(${120 - spdPct * 120},100%,55%)`;
    ctx.fillStyle = spdColor;
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "right";
    ctx.fillText(`⚡ KECEPATAN`, CW - 10, 24);
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(CW - 118, 30, 108, 10);
    ctx.fillStyle = spdColor;
    ctx.fillRect(CW - 118, 30, 108 * spdPct, 10);
    ctx.textAlign = "left";

    // lives
    for (let i = 0; i < 3; i++) {
      ctx.font = "20px sans-serif";
      ctx.globalAlpha = i < livesRef.current ? 1 : 0.2;
      ctx.fillText("❤️", 12 + i * 28, CH - 14);
    }
    ctx.globalAlpha = 1;

    // time
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "11px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.floor(elapsedRef.current)}s`, CW / 2, CH - 10);
    ctx.textAlign = "left";

    rafRef.current = requestAnimationFrame(loop);
  }, [isLight, drawBasket, drawItem, getSpeed, getSpawnInterval, spawnParticles, showFeedback, getQuestion]);

  const startGame = useCallback(() => {
    playPopSound();
    resetGame();
    phaseRef.current = "playing";
    setPhase("playing");
    lastTRef.current = 0;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [resetGame, loop]);

  const handleAnswer = useCallback((idx: number) => {
    const q = activeQ;
    if (!q) return;
    playPopSound();
    if (idx === q.ans) {
      multiplierRef.current = Math.min(multiplierRef.current + 1, 5);
      multiplierTimerRef.current = 12;
      setMultiplier(multiplierRef.current);
      const bonus = 50 * multiplierRef.current;
      scoreRef.current += bonus;
      setScore(scoreRef.current);
      spawnParticles(CW / 2, CH / 2, "#FFD700", 22);
      showFeedback(`🌟 BENAR! +${bonus} · MULTIPLIER ×${multiplierRef.current}!`, true);
    } else {
      multiplierRef.current = 1;
      multiplierTimerRef.current = 0;
      setMultiplier(1);
      showFeedback(`❌ Salah! Jawaban: ${q.opts[q.ans]}`, false);
      missFlashRef.current = 0.7;
    }
    setActiveQ(null);
    // Grace period: bomb/miss damage disabled for 1s so items near basket don't cause instant loss
    postQuestionGraceRef.current = 1.0;
    phaseRef.current = "playing";
    setPhase("playing");
  }, [activeQ, spawnParticles, showFeedback]);

  // keys
  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      if (["ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
      keysRef.current[e.key] = true;
    };
    const up = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", dn); window.removeEventListener("keyup", up); };
  }, []);

  useEffect(() => {
    resetGame();
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop, resetGame]);

  useEffect(() => () => { if (fbRef.current) clearTimeout(fbRef.current); }, []);

  // touch: follow finger position
  const onTouchMove = (e: React.TouchEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (e.touches[0].clientX - rect.left) * (CW / rect.width);
    touchXRef.current = relX;
  };
  const onTouchEnd = () => { touchXRef.current = null; };

  const level = Math.floor(elapsedRef.current / 10) + 1;

  return (
    <div className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}

      <div className="relative z-10 w-full max-w-lg px-2 py-4 flex flex-col items-center">
        {/* header */}
        <div className="flex items-center justify-between w-full mb-2">
          <button
            onClick={() => { playPopSound(); navigate('/ruang-untuk-guru/numatik-game'); }}
            className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all text-sm"
            title="Menu Utama"
          >
            🏠
          </button>
          <h1 className="font-display text-xl font-bold text-primary text-glow-cyan text-center flex-1">
            🧺 TANGKAP BENDA!
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
          <span className="text-white/50">REKOR: <span className="text-accent font-bold">{best}</span></span>
          {multiplier > 1 && <span className="text-yellow-300 font-bold animate-pulse">×{multiplier} MULTIPLIER!</span>}
        </div>

        {/* canvas */}
        <div
          className="relative w-full select-none"
          style={{ maxWidth: CW, maxHeight: 'calc(100dvh - 200px)', aspectRatio: `${CW}/${CH}` }}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchStart={onTouchMove}
        >
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            className="rounded-2xl border border-border shadow-2xl w-full h-full"
          />

          {/* feedback */}
          {feedback && (
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl font-bold text-sm shadow-xl pointer-events-none z-30 whitespace-nowrap animate-bounce ${
              feedback.good ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
            }`}>
              {feedback.txt}
            </div>
          )}

          {/* idle */}
          {phase === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/65">
              <div className="text-center px-5">
                <div className="text-5xl mb-3">🧺</div>
                <h2 className="font-display text-2xl font-bold text-accent mb-2">TANGKAP BENDA!</h2>
                <p className="text-white/65 text-xs mb-2 leading-relaxed">
                  Gerakkan keranjang <span className="text-cyan-400 font-bold">← →</span> untuk menangkap benda!<br />
                  Jangan sampai ada yang terlewat atau kamu tangkap <span className="text-red-400 font-bold">💣 bom</span>!
                </p>
                <div className="flex justify-center gap-3 mb-4 flex-wrap">
                  {[["⭐","10 poin"],["💎","15 poin"],["🪙","8 poin"],["➕","20 poin"],["💣","HINDARI!"]].map(([e,t])=>(
                    <span key={e} className="bg-white/10 rounded-lg px-2 py-1 text-xs">
                      {e} <span className="text-white/60">{t}</span>
                    </span>
                  ))}
                </div>
                <p className="text-yellow-400/80 text-xs mb-4">
                  Tangkap 3× ➕/✖️ → soal matematika → Multiplier naik! ×2 ×3 ×4 ×5
                </p>
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
                <div className="text-4xl mb-2">💔</div>
                <h2 className="font-display text-2xl font-bold text-red-400 mb-1">GAME OVER</h2>
                <p className="text-white mb-1">Skor: <span className="text-yellow-400 font-bold text-2xl">{score}</span></p>
                <p className="text-white/50 text-sm mb-5">Rekor: {best}</p>
                <button onClick={startGame} className="bg-accent text-black font-bold px-8 py-3 rounded-xl hover:opacity-90 transition cursor-pointer shadow-lg">
                  🧺 Main Lagi
                </button>
              </div>
            </div>
          )}

          {/* question */}
          {phase === "question" && activeQ && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/78 rounded-2xl">
              <div className="bg-card/95 backdrop-blur border-2 border-yellow-400 rounded-2xl p-5 mx-3 shadow-2xl w-full max-w-xs">
                <div className="text-[10px] text-white/40 font-display text-center mb-1 tracking-widest">
                  ⏸ GAME PAUSED
                </div>
                <div className="text-xs text-yellow-400 font-display mb-2 text-center tracking-widest">
                  ⚡ BONUS MULTIPLIER ⚡
                </div>
                <p className="text-white font-bold text-center text-base mb-4 leading-snug">{activeQ.q}</p>
                <div className="grid grid-cols-2 gap-2">
                  {activeQ.opts.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className="bg-primary/20 hover:bg-yellow-400/20 border border-border hover:border-yellow-400 text-white font-bold py-3 px-2 rounded-xl text-sm transition-all cursor-pointer active:scale-95"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <p className="text-white/40 text-xs text-center mt-3">Benar = multiplier skor naik s/d ×5!</p>
              </div>
            </div>
          )}
        </div>

        {/* mobile controls */}
        <div className="flex gap-3 mt-3">
          <button
            onPointerDown={() => { keysRef.current["ArrowLeft"] = true; }}
            onPointerUp={() => { keysRef.current["ArrowLeft"] = false; }}
            onPointerLeave={() => { keysRef.current["ArrowLeft"] = false; }}
            className="bg-card/80 border border-border text-white font-bold px-8 py-4 rounded-xl text-xl hover:border-accent transition cursor-pointer select-none active:scale-95"
          >
            ◀
          </button>
          <button
            onPointerDown={() => { keysRef.current["ArrowRight"] = true; }}
            onPointerUp={() => { keysRef.current["ArrowRight"] = false; }}
            onPointerLeave={() => { keysRef.current["ArrowRight"] = false; }}
            className="bg-card/80 border border-border text-white font-bold px-8 py-4 rounded-xl text-xl hover:border-accent transition cursor-pointer select-none active:scale-95"
          >
            ▶
          </button>
        </div>

        <p className="mt-2 text-white/40 text-xs font-body text-center">
          Keyboard: ← → pindah keranjang &nbsp;·&nbsp; Sentuh & geser di layar untuk mobile
        </p>
      <GuruQuizOverlay {...guruQuiz} />
      </div>
    </div>
  );
};

export default CatchItemsGamePage;
