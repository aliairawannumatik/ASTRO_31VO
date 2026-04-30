import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz, type GuruQuestion } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";
import MathGameIntro from "@/components/MathGameIntro";

// ── Canvas dimensions ──────────────────────────────────────────────────────
const CW = 560;
const CH = 220;
const GROUND_Y = CH - 40;

// ── Player constants ────────────────────────────────────────────────────────
const P_X = 70;
const P_W = 36;
const P_H_STAND = 52;
const P_H_DUCK = 28;
const GRAVITY = 1600;
const JUMP_VY = -540;

// ── Obstacle constants ──────────────────────────────────────────────────────
type ObstacleKind = "cactus" | "rock" | "bird" | "lowbar";
interface Obstacle {
  kind: ObstacleKind;
  x: number;
  y: number;
  w: number;
  h: number;
}

// ── Math questions ───────────────────────────────────────────────────────────
export interface MQ {
  q: string;
  opts: string[];
  correctIndex: number;
  bonus: number;
}

const DEFAULT_QUESTIONS: MQ[] = [
  { q: "12 × 8 = ?",            opts: ["86","96","106","76"],    correctIndex: 1, bonus: 30 },
  { q: "144 ÷ 12 = ?",          opts: ["10","11","12","13"],     correctIndex: 2, bonus: 30 },
  { q: "√169 = ?",              opts: ["11","12","13","14"],     correctIndex: 2, bonus: 40 },
  { q: "7² + 1 = ?",            opts: ["48","50","52","54"],     correctIndex: 1, bonus: 35 },
  { q: "25% dari 200 = ?",      opts: ["40","50","60","70"],     correctIndex: 1, bonus: 30 },
  { q: "3³ = ?",                opts: ["9","18","27","36"],      correctIndex: 2, bonus: 35 },
  { q: "56 + 79 = ?",           opts: ["125","130","135","145"], correctIndex: 2, bonus: 25 },
  { q: "180 − 97 = ?",          opts: ["73","83","93","63"],     correctIndex: 1, bonus: 25 },
  { q: "15 × 15 = ?",           opts: ["205","215","225","235"], correctIndex: 2, bonus: 35 },
  { q: "FPB dari 24 dan 36 = ?",opts: ["6","8","12","18"],       correctIndex: 2, bonus: 40 },
  { q: "KPK dari 4 dan 6 = ?",  opts: ["8","12","16","24"],      correctIndex: 1, bonus: 35 },
  { q: "2x + 6 = 20, x = ?",   opts: ["5","6","7","8"],         correctIndex: 2, bonus: 40 },
  { q: "(-8) × (-5) = ?",       opts: ["-40","-13","13","40"],   correctIndex: 3, bonus: 35 },
  { q: "2/3 + 1/6 = ?",         opts: ["3/9","5/6","1/2","7/6"],correctIndex: 1, bonus: 40 },
  { q: "√64 = ?",               opts: ["6","7","8","9"],         correctIndex: 2, bonus: 30 },
];

// ── Colour palette ──────────────────────────────────────────────────────────
const PALETTE = {
  sky_dark: "#0d0d1a",
  sky_light: "#c8dff7",
  ground_dark: "#1e1e3a",
  ground_light: "#a0855a",
  line_dark: "#2a2a55",
  line_light: "#8a6f47",
  cactus: "#2eb82e",
  rock: "#9999bb",
  question_badge: "#FFD700",
};

// ── State machine ────────────────────────────────────────────────────────────
type Phase = "idle" | "running" | "stunned" | "dead";

// ── Component ────────────────────────────────────────────────────────────────
interface DinoRunGamePageProps {
  questions?: MQ[];
  topicLabel?: string;
  backPath?: string;
  homePath?: string;
  quizQuestions?: GuruQuestion[];
}

const DinoRunGamePage = ({
  questions,
  topicLabel,
  backPath,
  homePath = "/ruang-untuk-guru/numatik-game",
  quizQuestions,
}: DinoRunGamePageProps = {}) => {
  const QUESTIONS = questions && questions.length > 0 ? questions : DEFAULT_QUESTIONS;
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastTRef = useRef(0);

  const phaseRef = useRef<Phase>("idle");
  const guruQuiz = useGuruQuiz(phaseRef, "running", 25_000, quizQuestions);
  const pyRef = useRef(GROUND_Y - P_H_STAND);
  const pvyRef = useRef(0);
  const isDuckRef = useRef(false);
  const isOnGroundRef = useRef(true);
  const speedRef = useRef(190);
  const distRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const nextObstRef = useRef(3500);
  const stunTimerRef = useRef(0);
  const bgOffRef = useRef(0);
  const cloudXRef = useRef([80, 260, 440]);
  const cloudYRef = useRef([30, 55, 20]);
  const jumpPressedRef = useRef(false);
  const duckPressedRef = useRef(false);
  const highScoreRef = useRef(0);
  const timeRef = useRef(0);
  const distScoreRef = useRef(0);

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);
  const [feedback, setFeedback] = useState<{ txt: string; good: boolean } | null>(null);
  const feedbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFeedback = useCallback((txt: string, good: boolean) => {
    setFeedback({ txt, good });
    if (feedbackRef.current) clearTimeout(feedbackRef.current);
    feedbackRef.current = setTimeout(() => setFeedback(null), 2200);
  }, []);

  // ── Difficulty tier — based on internal distance score (every 1000) ──────
  const getDiffTier = () => Math.min(Math.floor(distScoreRef.current / 1000), 4);

  // ── Spawn obstacle ──────────────────────────────────────────────────────
  const spawnObstacle = useCallback(() => {
    const tier = getDiffTier();

    const birdCut   = [0.25, 0.35, 0.40, 0.45, 0.50][tier];
    const cactusCut = [0.60, 0.60, 0.60, 0.60, 0.60][tier];
    const rockCut   = [0.85, 0.75, 0.70, 0.70, 0.70][tier];
    const roll = Math.random();
    const kind: ObstacleKind =
      roll < birdCut ? "bird" :
      roll < cactusCut ? "cactus" :
      roll < rockCut ? "rock" : "lowbar";

    let w = 18, h = 36, y = GROUND_Y - 36;
    if (kind === "rock") { w = 24; h = 20; y = GROUND_Y - 20; }
    if (kind === "bird") { w = 38; h = 20; y = GROUND_Y - P_H_STAND + 6; }
    if (kind === "lowbar") { w = 26; h = 150; y = 0; }

    obstaclesRef.current.push({ kind, x: CW + 20, y, w, h });
    const gapMin  = [3200, 1600, 1200,  900,  700][tier];
    const gapRng  = [2300, 1400, 1200,  900,  600][tier];
    nextObstRef.current = gapMin + Math.random() * gapRng;
  }, []);

  // ── Reset / start ───────────────────────────────────────────────────────
  const resetGame = useCallback(() => {
    pyRef.current = GROUND_Y - P_H_STAND;
    pvyRef.current = 0;
    isDuckRef.current = false;
    isOnGroundRef.current = true;
    speedRef.current = 190;
    distRef.current = 0;
    scoreRef.current = 0;
    distScoreRef.current = 0;
    timeRef.current = 0;
    livesRef.current = 3;
    obstaclesRef.current = [];
    nextObstRef.current = 3500;
    stunTimerRef.current = 0;
    bgOffRef.current = 0;
    jumpPressedRef.current = false;
    duckPressedRef.current = false;
    setScore(0);
    setTime(0);
    setLives(3);
    setFeedback(null);
  }, []);

  // ── Main loop ───────────────────────────────────────────────────────────
  const loop = useCallback((ts: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dt = Math.min((ts - (lastTRef.current || ts)) / 1000, 0.05);
    lastTRef.current = ts;
    if (guruQuiz.isPausedRef.current) { rafRef.current = requestAnimationFrame(loop); return; }

    const ph = phaseRef.current;

    // ── Draw background ─────────────────────────────────────────────
    ctx.fillStyle = isLight ? PALETTE.sky_light : PALETTE.sky_dark;
    ctx.fillRect(0, 0, CW, CH);

    if (!isLight) {
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      for (let i = 0; i < 30; i++) {
        const sx = ((i * 137 + bgOffRef.current * 0.05) % CW + CW) % CW;
        const sy = (i * 53) % (CH - 50);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }
    }

    // clouds — only move when running
    cloudXRef.current = cloudXRef.current.map((cx) => {
      const nx = ph === "running" ? cx - speedRef.current * 0.06 * dt : cx;
      return nx < -80 ? CW + 60 : nx;
    });
    ctx.fillStyle = isLight ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.12)";
    cloudXRef.current.forEach((cx, i) => {
      const cy = cloudYRef.current[i];
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.arc(cx + 22, cy - 6, 14, 0, Math.PI * 2);
      ctx.arc(cx + 40, cy, 16, 0, Math.PI * 2);
      ctx.fill();
    });

    // ground
    ctx.fillStyle = isLight ? PALETTE.ground_light : PALETTE.ground_dark;
    ctx.fillRect(0, GROUND_Y, CW, CH - GROUND_Y);
    ctx.fillStyle = isLight ? PALETTE.line_light : PALETTE.line_dark;
    ctx.fillRect(0, GROUND_Y, CW, 2);

    if (ph === "running" || ph === "stunned") bgOffRef.current += speedRef.current * dt;
    for (let i = 0; i < 20; i++) {
      const lx = ((i * 52 - bgOffRef.current) % CW + CW) % CW;
      ctx.fillStyle = isLight ? "rgba(100,80,40,0.25)" : "rgba(255,255,255,0.06)";
      ctx.fillRect(lx, GROUND_Y + 8, 28, 3);
    }

    // ── Update & draw obstacles ─────────────────────────────────────
    // Obstacles ONLY move and collide during "running" — they FREEZE during "question"
    if (ph === "running") {
      nextObstRef.current -= dt * 1000;
      if (nextObstRef.current <= 0) spawnObstacle();
    }

    const playerH = isDuckRef.current ? P_H_DUCK : P_H_STAND;
    const playerY = pyRef.current;
    const hitbox = { x: P_X + 10, y: playerY + 8, w: P_W - 18, h: playerH - 14 };

    obstaclesRef.current = obstaclesRef.current.filter(ob => ob.x + ob.w > -20);
    obstaclesRef.current.forEach(ob => {
      if (ph === "running") ob.x -= speedRef.current * dt;

      drawObstacle(ctx, ob, isLight);

      if (ph === "running") {
        const ox = ob.x + 5, ow = ob.w - 10, oy = ob.y + 5, oh = ob.h - 8;
        const collide =
          hitbox.x < ox + ow &&
          hitbox.x + hitbox.w > ox &&
          hitbox.y < oy + oh &&
          hitbox.y + hitbox.h > oy;

        if (collide) {
          livesRef.current = Math.max(0, livesRef.current - 1);
          setLives(livesRef.current);
          stunTimerRef.current = 1.2;
          phaseRef.current = "stunned";
          setPhase("stunned");
          showFeedback("💥 Kena! Hati-hati!", false);
          if (livesRef.current <= 0) {
            phaseRef.current = "dead";
            setPhase("dead");
          }
        }
      }
    });

    // ── Update player ───────────────────────────────────────────────
    if (ph === "running") {
      if (jumpPressedRef.current && isOnGroundRef.current) {
        pvyRef.current = JUMP_VY;
        isOnGroundRef.current = false;
        jumpPressedRef.current = false;
      }
      pvyRef.current += GRAVITY * dt;
      pyRef.current += pvyRef.current * dt;
      const groundLevel = GROUND_Y - (isDuckRef.current ? P_H_DUCK : P_H_STAND);
      if (pyRef.current >= groundLevel) {
        pyRef.current = groundLevel;
        pvyRef.current = 0;
        isOnGroundRef.current = true;
      }
      if (duckPressedRef.current && isOnGroundRef.current) {
        isDuckRef.current = true;
      } else if (!duckPressedRef.current) {
        isDuckRef.current = false;
        if (isOnGroundRef.current) pyRef.current = GROUND_Y - P_H_STAND;
      }

      distRef.current += speedRef.current * dt;
      timeRef.current += dt;
      distScoreRef.current = Math.floor(distRef.current / 10);

      // Speed ramp
      {
        const spTier = getDiffTier();
        const ramp = [0.020, 0.035, 0.050, 0.065, 0.080][spTier];
        const cap  = [360,   430,   490,   540,   590  ][spTier];
        speedRef.current = Math.min(190 + distRef.current * ramp, cap);
      }

      if (Math.floor(timeRef.current * 2) % 2 === 0) setTime(Math.floor(timeRef.current));
    }

    if (ph === "stunned") {
      stunTimerRef.current -= dt;
      if (stunTimerRef.current <= 0) {
        phaseRef.current = "running";
        setPhase("running");
      }
    }

    // ── Draw player (dino) ──────────────────────────────────────────
    drawDino(ctx, pyRef.current, isDuckRef.current, ph, ts);

    // ── HUD ─────────────────────────────────────────────────────────
    const mm = String(Math.floor(timeRef.current / 60)).padStart(2, "0");
    const ss = String(Math.floor(timeRef.current % 60)).padStart(2, "0");
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.beginPath();
    ctx.roundRect(8, 8, 150, 36, 8);
    ctx.fill();
    ctx.fillStyle = "#00FFCC";
    ctx.font = "bold 13px monospace";
    ctx.fillText(`WAKTU: ${mm}:${ss}`, 18, 28);
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i < livesRef.current ? "#FF4E4E" : "rgba(255,255,255,0.2)";
      ctx.font = "16px sans-serif";
      ctx.fillText("♥", CW - 28 - i * 22, 28);
    }

    if (ph === "stunned") {
      ctx.fillStyle = `rgba(255,60,60,${0.15 + 0.1 * Math.sin(ts / 80)})`;
      ctx.fillRect(0, 0, CW, CH);
    }

    // ── Difficulty tier badge ────────────────────────────────────────
    const badgeTier = getDiffTier();
    if (badgeTier >= 1 && (ph === "running" || ph === "stunned")) {
      const badgeLabels = ["", "🔥 HARD MODE!", "⚡ VERY HARD!", "💀 EXTREME!", "☠️ INSANE!"];
      const badgeColors = ["", "#FF4500",      "#9400D3",      "#CC0000",    "#000000"  ];
      const badgeBorder = ["", "",              "",              "",           "#FF0000"  ];
      const pulse = 0.75 + 0.25 * Math.sin(ts / 220);
      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.fillStyle = badgeColors[badgeTier];
      ctx.beginPath();
      ctx.roundRect(CW / 2 - 58, 38, 116, 24, 6);
      ctx.fill();
      if (badgeBorder[badgeTier]) {
        ctx.strokeStyle = badgeBorder[badgeTier];
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.globalAlpha = pulse;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText(badgeLabels[badgeTier], CW / 2, 54);
      ctx.textAlign = "left";
      ctx.restore();
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [isLight, spawnObstacle, showFeedback, guruQuiz.isPausedRef]);

  // ── Start game ──────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    playPopSound();
    resetGame();
    phaseRef.current = "running";
    setPhase("running");
    lastTRef.current = 0;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [resetGame, loop]);

  // ── Input handling ──────────────────────────────────────────────────────
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", " "].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowUp" || e.key === " ") jumpPressedRef.current = true;
      if (e.key === "ArrowDown") duckPressedRef.current = true;
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") duckPressedRef.current = false;
      if (e.key === "ArrowUp" || e.key === " ") jumpPressedRef.current = false;
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop]);

  useEffect(() => {
    return () => { if (feedbackRef.current) clearTimeout(feedbackRef.current); };
  }, []);

  const touchRef = useRef<{ y: number; id: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    touchRef.current = { y: t.clientY, id: t.identifier };
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relY = t.clientY - rect.top;
    if (relY > rect.height * 0.65) {
      duckPressedRef.current = true;
    } else {
      jumpPressedRef.current = true;
    }
  };
  const onTouchEnd = () => {
    duckPressedRef.current = false;
    jumpPressedRef.current = false;
    touchRef.current = null;
  };

  if (phase === "idle") {
    return (
      <MathGameIntro
        gameTitle="TURTLE RUN MATH"
        subtitle="⚡ PETUALANGAN MATEMATIKA ⚡"
        topicLabel={topicLabel}
        heroEmoji="🐢"
        startLabel="MULAI PETUALANGAN"
        theme="ocean"
        onStart={startGame}
        onBack={() => { playPopSound(); if (backPath) navigate(backPath); else navigate(-1); }}
        onHome={() => { playPopSound(); navigate(homePath); }}
        bestLabel={highScore > 0 ? `Rekor Tertinggi: ${highScore}` : undefined}
        decorations={[
          { src: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 70"><defs><radialGradient id="sh1" cx="50%" cy="45%" r="50%"><stop offset="0%" stop-color="#88FFAA"/><stop offset="60%" stop-color="#22CC55"/><stop offset="100%" stop-color="#116622"/></radialGradient></defs><ellipse cx="45" cy="36" rx="28" ry="22" fill="url(#sh1)"/><path d="M26,28 L33,20 L45,18 L57,20 L64,28 L64,44 L57,52 L45,54 L33,52 L26,44Z" fill="#229944" opacity="0.5"/><line x1="45" y1="18" x2="45" y2="54" stroke="#116622" stroke-width="1.5" opacity="0.6"/><line x1="26" y1="36" x2="64" y2="36" stroke="#116622" stroke-width="1.5" opacity="0.6"/><line x1="31" y1="21" x2="59" y2="51" stroke="#116622" stroke-width="1" opacity="0.4"/><line x1="59" y1="21" x2="31" y2="51" stroke="#116622" stroke-width="1" opacity="0.4"/><ellipse cx="72" cy="33" rx="10" ry="8" fill="#44DD66"/><circle cx="77" cy="30" r="2" fill="#003300"/><circle cx="78" cy="29.5" r="0.8" fill="white"/><ellipse cx="73" cy="40" rx="4" ry="3" fill="#33BB44" opacity="0.8"/><ellipse cx="22" cy="22" rx="9" ry="6" fill="#44DD66" transform="rotate(-30,22,22)"/><ellipse cx="22" cy="50" rx="9" ry="6" fill="#44DD66" transform="rotate(30,22,50)"/><ellipse cx="65" cy="18" rx="9" ry="6" fill="#44DD66" transform="rotate(20,65,18)"/><ellipse cx="65" cy="54" rx="9" ry="6" fill="#44DD66" transform="rotate(-20,65,54)"/><ellipse cx="16" cy="37" rx="5" ry="3" fill="#229944" transform="rotate(10,16,37)"/></svg>')}`, className: "absolute top-[8%] left-[5%] w-16 h-12 md:w-24 md:h-18 opacity-80 animate-float-slow", glowRgba: "rgba(34,204,85,0.5)" },
          { src: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 70"><defs><radialGradient id="sh2" cx="50%" cy="45%" r="50%"><stop offset="0%" stop-color="#AAFFDD"/><stop offset="60%" stop-color="#00BBAA"/><stop offset="100%" stop-color="#006655"/></radialGradient></defs><ellipse cx="45" cy="36" rx="28" ry="22" fill="url(#sh2)"/><path d="M26,28 L33,20 L45,18 L57,20 L64,28 L64,44 L57,52 L45,54 L33,52 L26,44Z" fill="#009988" opacity="0.5"/><line x1="45" y1="18" x2="45" y2="54" stroke="#006655" stroke-width="1.5" opacity="0.6"/><line x1="26" y1="36" x2="64" y2="36" stroke="#006655" stroke-width="1.5" opacity="0.6"/><line x1="31" y1="21" x2="59" y2="51" stroke="#006655" stroke-width="1" opacity="0.4"/><line x1="59" y1="21" x2="31" y2="51" stroke="#006655" stroke-width="1" opacity="0.4"/><ellipse cx="72" cy="33" rx="10" ry="8" fill="#00CCAA"/><circle cx="77" cy="30" r="2" fill="#002222"/><circle cx="78" cy="29.5" r="0.8" fill="white"/><ellipse cx="73" cy="40" rx="4" ry="3" fill="#00AA88" opacity="0.8"/><ellipse cx="22" cy="22" rx="9" ry="6" fill="#00CCAA" transform="rotate(-30,22,22)"/><ellipse cx="22" cy="50" rx="9" ry="6" fill="#00CCAA" transform="rotate(30,22,50)"/><ellipse cx="65" cy="18" rx="9" ry="6" fill="#00CCAA" transform="rotate(20,65,18)"/><ellipse cx="65" cy="54" rx="9" ry="6" fill="#00CCAA" transform="rotate(-20,65,54)"/><ellipse cx="16" cy="37" rx="5" ry="3" fill="#009977" transform="rotate(10,16,37)"/></svg>')}`, className: "absolute top-[40%] right-[5%] w-14 h-10 md:w-20 md:h-15 opacity-75 animate-float-medium", glowRgba: "rgba(0,187,170,0.5)" },
          { src: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 70"><defs><radialGradient id="sh3" cx="50%" cy="45%" r="50%"><stop offset="0%" stop-color="#DDFFAA"/><stop offset="60%" stop-color="#88CC22"/><stop offset="100%" stop-color="#446600"/></radialGradient></defs><ellipse cx="45" cy="36" rx="28" ry="22" fill="url(#sh3)"/><path d="M26,28 L33,20 L45,18 L57,20 L64,28 L64,44 L57,52 L45,54 L33,52 L26,44Z" fill="#77BB11" opacity="0.5"/><line x1="45" y1="18" x2="45" y2="54" stroke="#446600" stroke-width="1.5" opacity="0.6"/><line x1="26" y1="36" x2="64" y2="36" stroke="#446600" stroke-width="1.5" opacity="0.6"/><line x1="31" y1="21" x2="59" y2="51" stroke="#446600" stroke-width="1" opacity="0.4"/><line x1="59" y1="21" x2="31" y2="51" stroke="#446600" stroke-width="1" opacity="0.4"/><ellipse cx="72" cy="33" rx="10" ry="8" fill="#AADD33"/><circle cx="77" cy="30" r="2" fill="#223300"/><circle cx="78" cy="29.5" r="0.8" fill="white"/><ellipse cx="73" cy="40" rx="4" ry="3" fill="#88BB22" opacity="0.8"/><ellipse cx="22" cy="22" rx="9" ry="6" fill="#AADD33" transform="rotate(-30,22,22)"/><ellipse cx="22" cy="50" rx="9" ry="6" fill="#AADD33" transform="rotate(30,22,50)"/><ellipse cx="65" cy="18" rx="9" ry="6" fill="#AADD33" transform="rotate(20,65,18)"/><ellipse cx="65" cy="54" rx="9" ry="6" fill="#AADD33" transform="rotate(-20,65,54)"/><ellipse cx="16" cy="37" rx="5" ry="3" fill="#77AA11" transform="rotate(10,16,37)"/></svg>')}`, className: "absolute bottom-[15%] left-[8%] w-16 h-12 md:w-22 md:h-16 opacity-80 animate-float-fast", glowRgba: "rgba(136,204,34,0.5)" },
        ]}
        instructions={[
          { text: <>Tekan <strong className="text-yellow-300">SPASI / ↑</strong> untuk loncat, <strong className="text-yellow-300">↓</strong> untuk tiarap</> },
          { text: <>Hindari kaktus, batu, burung, dan palang rendah</> },
          { text: <>Kamu punya <strong className="text-pink-300">3 nyawa</strong> — setiap kena rintangan kehilangan satu</> },
          { text: <>Tiap <strong className="text-yellow-300">25 detik</strong> muncul soal dari guru (5 soal total)</> },
        ]}
      />
    );
  }

  return (
    <div className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}

      <div className="relative z-10 w-full max-w-2xl px-2 pt-7 pb-4 flex flex-col items-center">
        <div className="flex items-center justify-between w-full mb-3 gap-2">
          <button
            onClick={() => { playPopSound(); if (backPath) navigate(backPath); else navigate(-1); }}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:opacity-90 transition-opacity cursor-pointer"
            title="Kembali ke pilihan game"
          >
            <span className="text-base leading-none">←</span>
            <span className="hidden sm:inline">Kembali</span>
          </button>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan flex-1 text-center">
            🐢 Turtle Run Math{topicLabel ? <span className="block text-xs md:text-sm text-cyan-300 font-body mt-0.5">{topicLabel}</span> : null}
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

        <div className="flex gap-5 mb-2 text-sm font-display flex-wrap justify-center">
          <span className="text-cyan-400">⏱ WAKTU: <span className="font-bold">{String(Math.floor(time / 60)).padStart(2,"0")}:{String(time % 60).padStart(2,"0")}</span></span>
          <span className="text-yellow-400">⭐ SKOR: <span className="font-bold">{score}</span></span>
          <span className="text-white/50">🏆 REKOR: <span className="text-accent font-bold">{highScore}</span></span>
          <span className="text-red-400">{"♥".repeat(lives)}{"🖤".repeat(Math.max(0, 3 - lives))}</span>
        </div>

        <div className="relative w-full" style={{ maxWidth: CW, maxHeight: 'calc(100dvh - 200px)', aspectRatio: `${CW}/${CH}` }}>
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            className="rounded-xl border border-border shadow-2xl w-full h-full"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onClick={() => {
              if (phaseRef.current === "running") jumpPressedRef.current = true;
            }}
            style={{ cursor: "pointer" }}
          />

          {feedback && (
            <div className={`absolute top-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl font-bold text-sm shadow-xl pointer-events-none z-30 animate-bounce ${
              feedback.good ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
            }`}>
              {feedback.txt}
            </div>
          )}

          {phase === "dead" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
              <div className="text-center px-4">
                <div className="text-4xl mb-2">💀</div>
                <h2 className="font-display text-xl font-bold text-red-400 mb-1">GAME OVER</h2>
                <p className="text-cyan-300 text-xs mb-1">⏱ Waktu: <span className="font-bold">{String(Math.floor(time / 60)).padStart(2,"0")}:{String(time % 60).padStart(2,"0")}</span></p>
                <p className="text-white text-sm mb-1">⭐ Skor: <span className="text-yellow-400 font-bold text-xl">{score}</span></p>
                <p className="text-white/50 text-xs mb-4">🏆 Rekor: {highScore}</p>
                <button onClick={startGame} className="bg-accent text-black font-bold px-7 py-3 rounded-xl hover:opacity-90 transition cursor-pointer shadow-lg">
                  Main Lagi
                </button>
              </div>
            </div>
          )}

        </div>

        <div className="flex gap-3 mt-3">
          <button
            onPointerDown={() => { jumpPressedRef.current = true; }}
            onPointerUp={() => { jumpPressedRef.current = false; }}
            className="bg-card/80 border border-border text-white font-bold px-7 py-4 rounded-xl text-xl hover:border-accent transition cursor-pointer select-none active:scale-95"
          >
            ↑ LONCAT
          </button>
          <button
            onPointerDown={() => { duckPressedRef.current = true; }}
            onPointerUp={() => { duckPressedRef.current = false; }}
            className="bg-card/80 border border-border text-white font-bold px-7 py-4 rounded-xl text-xl hover:border-accent transition cursor-pointer select-none active:scale-95"
          >
            ↓ TIARAP
          </button>
        </div>

        <div className="mt-2 text-center text-white/40 text-xs font-body">
          Keyboard: SPASI / ↑ loncat &nbsp;·&nbsp; ↓ tiarap
        </div>
      <GuruQuizOverlay {...guruQuiz} />
      </div>
    </div>
  );
};

// ── Helper: draw obstacle ──────────────────────────────────────────────────
function drawObstacle(ctx: CanvasRenderingContext2D, ob: Obstacle, light: boolean) {
  if (ob.kind === "cactus") {
    // Cactus body (trunk)
    ctx.fillStyle = "#2eb82e";
    ctx.beginPath();
    ctx.roundRect(ob.x + ob.w / 2 - 4, ob.y, 8, ob.h, 3);
    ctx.fill();
    // Left arm
    ctx.beginPath();
    ctx.roundRect(ob.x + 1, ob.y + ob.h * 0.3, ob.w / 2 - 2, 6, 2);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(ob.x + 1, ob.y + 4, 6, ob.h * 0.32, 2);
    ctx.fill();
    // Right arm
    ctx.beginPath();
    ctx.roundRect(ob.x + ob.w / 2 + 2, ob.y + ob.h * 0.42, ob.w / 2 - 2, 6, 2);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(ob.x + ob.w - 7, ob.y + ob.h * 0.15, 6, ob.h * 0.32, 2);
    ctx.fill();
    // Spines
    ctx.fillStyle = "#1a8c1a";
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(ob.x + ob.w / 2 - 1, ob.y + i * 12, 2, 5);
    }
  } else if (ob.kind === "rock") {
    // Rock — rounded with shading
    const cx = ob.x + ob.w / 2;
    const cy = ob.y + ob.h / 2;
    const grad = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, ob.w / 2);
    grad.addColorStop(0, light ? "#b0b0cc" : "#c0c0dd");
    grad.addColorStop(1, light ? "#6a6a88" : "#7a7a99");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, ob.w / 2, ob.h / 2, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // Highlight
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.ellipse(cx - 4, cy - 5, ob.w / 5, ob.h / 5, -0.4, 0, Math.PI * 2);
    ctx.fill();
    // Cracks
    ctx.strokeStyle = "rgba(0,0,0,0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 2, cy - 4); ctx.lineTo(cx + 4, cy + 2);
    ctx.moveTo(cx - 5, cy + 1); ctx.lineTo(cx, cy + 5);
    ctx.stroke();
  } else if (ob.kind === "bird") {
    // Bird — colourful flying bird with flapping wings
    const cx = ob.x + ob.w / 2;
    const cy = ob.y + ob.h / 2;
    const wingFlap = Math.sin(Date.now() / 110) * 8;

    // Body
    ctx.fillStyle = "#E8622A";
    ctx.beginPath();
    ctx.ellipse(cx, cy, ob.w / 2 - 4, ob.h / 2 - 2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Belly
    ctx.fillStyle = "#F4A460";
    ctx.beginPath();
    ctx.ellipse(cx + 4, cy + 2, ob.w / 5, ob.h / 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Upper wing (flapping up)
    ctx.fillStyle = "#C0392B";
    ctx.beginPath();
    ctx.moveTo(cx - 4, cy - 2);
    ctx.quadraticCurveTo(cx - ob.w / 2, cy - 6 - wingFlap, cx - ob.w / 2 + 4, cy - 12 - wingFlap);
    ctx.quadraticCurveTo(cx, cy - 8 - wingFlap * 0.5, cx + 4, cy - 2);
    ctx.closePath();
    ctx.fill();
    // Wing tip highlight
    ctx.fillStyle = "#E74C3C";
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy - 4);
    ctx.quadraticCurveTo(cx - ob.w / 2 + 2, cy - 4 - wingFlap, cx - ob.w / 2 + 8, cy - 10 - wingFlap);
    ctx.quadraticCurveTo(cx - 4, cy - 6 - wingFlap * 0.5, cx - 2, cy - 3);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(cx + ob.w / 2 - 8, cy - 2, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath(); ctx.arc(cx + ob.w / 2 - 7, cy - 2, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(cx + ob.w / 2 - 8, cy - 3, 1, 0, Math.PI * 2); ctx.fill();

    // Beak
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.moveTo(cx + ob.w / 2 - 5, cy - 2);
    ctx.lineTo(cx + ob.w / 2 + 6, cy);
    ctx.lineTo(cx + ob.w / 2 - 5, cy + 3);
    ctx.closePath();
    ctx.fill();

    // Tail feathers
    ctx.fillStyle = "#C0392B";
    ctx.beginPath();
    ctx.moveTo(cx - ob.w / 2 + 3, cy - 1);
    ctx.lineTo(cx - ob.w / 2 - 6, cy - 5);
    ctx.lineTo(cx - ob.w / 2 + 1, cy + 3);
    ctx.lineTo(cx - ob.w / 2 - 4, cy + 6);
    ctx.lineTo(cx - ob.w / 2 + 5, cy + 4);
    ctx.closePath();
    ctx.fill();

    // "TIARAP!" label above bird so player knows to duck
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath();
    ctx.roundRect(ob.x + ob.w / 2 - 24, ob.y - 18, 48, 14, 4);
    ctx.fill();
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("↓ TIARAP!", ob.x + ob.w / 2, ob.y - 7);
    ctx.textAlign = "left";
  } else {
    // ── Lowbar: hanging concrete beam — MUST DUCK, impossible to jump ──
    const bx = ob.x, bw = ob.w, by = ob.y, bh = ob.h;

    // Main concrete block body
    const grad = ctx.createLinearGradient(bx, by, bx + bw, by);
    grad.addColorStop(0, "#7a6040");
    grad.addColorStop(0.3, "#b08050");
    grad.addColorStop(0.7, "#c89060");
    grad.addColorStop(1, "#7a6040");
    ctx.fillStyle = grad;
    ctx.fillRect(bx, by, bw, bh - 18);

    // Danger stripes on the beam
    ctx.save();
    ctx.beginPath();
    ctx.rect(bx, by, bw, bh - 18);
    ctx.clip();
    for (let s = 0; s < bw + bh; s += 10) {
      ctx.fillStyle = s % 20 === 0 ? "rgba(255,200,0,0.18)" : "rgba(0,0,0,0.12)";
      ctx.beginPath();
      ctx.moveTo(bx + s, by);
      ctx.lineTo(bx + s + 10, by);
      ctx.lineTo(bx + s - (bh - 18), by + bh - 18);
      ctx.lineTo(bx + s - (bh - 18) - 10, by + bh - 18);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Side edge highlights
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(bx, by, 3, bh - 18);
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(bx + bw - 3, by, 3, bh - 18);

    // Stalactite spikes at the bottom
    ctx.fillStyle = "#8a6535";
    for (let si = 0; si < 3; si++) {
      const sx = bx + 3 + si * (bw - 6) / 2;
      const sLen = 12 + (si % 2) * 6;
      ctx.beginPath();
      ctx.moveTo(sx, by + bh - 18);
      ctx.lineTo(sx + 5, by + bh - 18);
      ctx.lineTo(sx + 2.5, by + bh - 18 + sLen);
      ctx.closePath();
      ctx.fill();
    }

    // "↓ TIARAP!" warning label on the beam face
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.beginPath();
    ctx.roundRect(bx - 2, by + bh - 78, bw + 4, 28, 4);
    ctx.fill();
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("↓", bx + bw / 2, by + bh - 62);
    ctx.fillText("TIARAP!", bx + bw / 2, by + bh - 52);
    ctx.textAlign = "left";

    // Bottom thick border
    ctx.fillStyle = "#5a4025";
    ctx.fillRect(bx - 2, by + bh - 18, bw + 4, 4);
  }
}

// ── Helper: draw T-Rex dino ────────────────────────────────────────────────
/**
 * drawDino — actually renders a CUTE, friendly turtle character.
 * (Function name preserved for backwards compatibility with the existing
 * call-site; the visuals are 100% turtle.)
 */
function drawDino(
  ctx: CanvasRenderingContext2D,
  py: number,
  duck: boolean,
  phase: Phase,
  ts: number
) {
  const x = P_X;
  const y = py;
  const h = duck ? P_H_DUCK : P_H_STAND;

  const stunFlash = phase === "stunned" && Math.floor(ts / 120) % 2 === 0;
  if (stunFlash) ctx.globalAlpha = 0.35;

  // ── Turtle palette ──────────────────────────────────────────────────
  const skin = "#88c870";        // light spring-green skin
  const skinShade = "#5fa050";   // darker shading on legs/head
  const skinDeep = "#3d7a30";    // foot/toe edges
  const shellRim = "#1f4a28";    // dark shell outline
  const shellMid = "#4a9e3f";    // mid shell green
  const shellHi = "#7dc878";     // shell highlight
  const plastron = "#e8d68a";    // creamy belly band
  const eyeWhite = "#ffffff";
  const pupil = "#1a1a2e";
  const blush = "rgba(255,140,150,0.45)";

  // Helper: hexagonal scute outline (squashed slightly to follow dome)
  const drawHex = (hx: number, hy: number, r: number, squashY = 0.7) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      const px = hx + Math.cos(a) * r;
      const py2 = hy + Math.sin(a) * r * squashY;
      if (i === 0) ctx.moveTo(px, py2);
      else ctx.lineTo(px, py2);
    }
    ctx.closePath();
    ctx.stroke();
  };

  if (duck) {
    // ── DUCKING / TUCKED TURTLE ───────────────────────────────────────
    // Shell flattens against the ground, head & legs retract.
    const cx = x + P_W / 2;
    const cy = y + h / 2 + 1;

    // Tail peeking out the back-left
    ctx.fillStyle = skinShade;
    ctx.beginPath();
    ctx.moveTo(x - 1, cy + 1);
    ctx.lineTo(x - 6, cy + 4);
    ctx.lineTo(x + 3, cy + 5);
    ctx.closePath();
    ctx.fill();

    // Tiny feet poking out at four corners
    ctx.fillStyle = skinShade;
    ctx.beginPath(); ctx.ellipse(x + 4, y + h - 1, 5.5, 2.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + P_W - 4, y + h - 1, 5.5, 2.6, 0, 0, Math.PI * 2); ctx.fill();

    // Shell outline (rim)
    ctx.fillStyle = shellRim;
    ctx.beginPath();
    ctx.ellipse(cx, cy, P_W / 2 + 6, h / 2 + 1, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shell body with soft radial highlight
    const shellGrad = ctx.createRadialGradient(cx - 4, cy - 5, 2, cx, cy + 1, P_W / 2 + 6);
    shellGrad.addColorStop(0, shellHi);
    shellGrad.addColorStop(0.55, shellMid);
    shellGrad.addColorStop(1, "#2a6638");
    ctx.fillStyle = shellGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, P_W / 2 + 4, h / 2 - 1, 0, 0, Math.PI * 2);
    ctx.fill();

    // Plastron band along bottom edge
    ctx.fillStyle = plastron;
    ctx.beginPath();
    ctx.ellipse(cx, y + h - 2, P_W / 2 + 2, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hex scute pattern
    ctx.strokeStyle = shellRim;
    ctx.lineWidth = 1.2;
    drawHex(cx, cy - 1, 5, 0.55);
    drawHex(cx - 9, cy, 4, 0.55);
    drawHex(cx + 9, cy, 4, 0.55);
    drawHex(cx - 4, cy + 5, 3.5, 0.55);
    drawHex(cx + 4, cy + 5, 3.5, 0.55);

    // Tiny shy eyes peeking from front of shell
    ctx.fillStyle = pupil;
    ctx.beginPath(); ctx.arc(x + P_W - 4, cy + 1, 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + P_W + 1, cy + 1, 1.6, 0, Math.PI * 2); ctx.fill();
    // Eye shine
    ctx.fillStyle = eyeWhite;
    ctx.beginPath(); ctx.arc(x + P_W - 4.3, cy + 0.5, 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + P_W + 0.7, cy + 0.5, 0.5, 0, Math.PI * 2); ctx.fill();
  } else {
    // ── STANDING / RUNNING TURTLE — SIDE PROFILE facing RIGHT ────────
    // Layout (left = behind, right = forward):
    //   tail | back leg | body+plastron+shell-dome | front leg | head+eye
    const legSwing = Math.sin(ts / 95) * 5;       // animation phase
    const cx = x + P_W / 2;

    // Shell footprint (dome that rests on the body line)
    const shellLeft = x - 2;
    const shellRight = x + P_W + 2;
    const shellW = shellRight - shellLeft;
    const plastronY = y + h - 12;                  // bottom edge of shell / top of body line
    const shellTop = y + 4;
    const shellH = plastronY - shellTop;

    // === TAIL (back-left, peeking under the shell rim) ===
    ctx.fillStyle = skinShade;
    ctx.beginPath();
    ctx.moveTo(shellLeft + 2, plastronY - 2);
    ctx.lineTo(shellLeft - 6, plastronY + 1);
    ctx.lineTo(shellLeft + 3, plastronY + 5);
    ctx.closePath();
    ctx.fill();

    // === BACK LEG (rear) ===
    // Both legs step to the RIGHT (forward). The animation alternates which one
    // is in the air: back leg lifts when legSwing > 0, plants when legSwing < 0.
    const backLift = Math.max(0, legSwing) * 1.1;        // 0..5  px lift off ground
    const backStride = legSwing * 1.2;                   // -6..+6 px forward/backward swing
    // Upper leg (rounded stub coming down from body)
    ctx.fillStyle = skinShade;
    ctx.beginPath();
    ctx.roundRect(x + 4 + backStride * 0.25, plastronY + 1, 8, 10 - backLift, [3, 3, 2, 2]);
    ctx.fill();
    // Foot — oval pointing FORWARD (right)
    ctx.fillStyle = skinDeep;
    ctx.beginPath();
    ctx.ellipse(x + 9 + backStride, y + h - 1 - backLift * 0.5, 7.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Toe claws — at the FRONT (right side) of the foot
    ctx.fillStyle = "#f5e6a8";
    for (let t = 0; t < 3; t++) {
      ctx.beginPath();
      ctx.arc(x + 13 + backStride - t * 1.6, y + h - 1 - backLift * 0.5, 0.95, 0, Math.PI * 2);
      ctx.fill();
    }

    // === BODY (visible underbody between legs and shell) ===
    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.ellipse(cx + 1, plastronY + 1, P_W / 2 + 1, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Plastron — creamy belly strip (the underside scutes, visible in side view)
    ctx.fillStyle = plastron;
    ctx.beginPath();
    ctx.ellipse(cx + 1, plastronY + 3.5, P_W / 2 - 2, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Subtle plastron seam down the middle (a line of small marks)
    ctx.fillStyle = "rgba(120,90,30,0.45)";
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(cx - 6 + i * 6, plastronY + 3.5, 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // === FRONT LEG (forward) ===
    const frontLift = Math.max(0, -legSwing) * 1.1;
    const frontStride = -legSwing * 1.2;
    ctx.fillStyle = skinShade;
    ctx.beginPath();
    ctx.roundRect(x + P_W - 12 + frontStride * 0.25, plastronY + 1, 8, 10 - frontLift, [3, 3, 2, 2]);
    ctx.fill();
    // Foot pointing forward (right)
    ctx.fillStyle = skinDeep;
    ctx.beginPath();
    ctx.ellipse(x + P_W - 7 + frontStride, y + h - 1 - frontLift * 0.5, 7.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Toe claws on the leading edge
    ctx.fillStyle = "#f5e6a8";
    for (let t = 0; t < 3; t++) {
      ctx.beginPath();
      ctx.arc(x + P_W - 3 + frontStride - t * 1.6, y + h - 1 - frontLift * 0.5, 0.95, 0, Math.PI * 2);
      ctx.fill();
    }

    // === SHELL DOME (drawn on top of the body) ===
    // Outer dark rim — slightly larger than the inner shell
    ctx.fillStyle = shellRim;
    ctx.beginPath();
    ctx.moveTo(shellLeft - 2, plastronY);
    ctx.bezierCurveTo(
      shellLeft - 2, shellTop - 2,
      shellRight + 2, shellTop - 2,
      shellRight + 2, plastronY
    );
    ctx.closePath();
    ctx.fill();
    // Inner shell with radial gradient (highlight upper-left for dome feel)
    const shellGrad = ctx.createRadialGradient(
      cx - 6, shellTop + 3, 2,
      cx, plastronY, shellW / 2 + 3
    );
    shellGrad.addColorStop(0, shellHi);
    shellGrad.addColorStop(0.55, shellMid);
    shellGrad.addColorStop(1, "#2a6638");
    ctx.fillStyle = shellGrad;
    ctx.beginPath();
    ctx.moveTo(shellLeft, plastronY);
    ctx.bezierCurveTo(
      shellLeft, shellTop,
      shellRight, shellTop,
      shellRight, plastronY
    );
    ctx.closePath();
    ctx.fill();
    // Glossy specular highlight on upper-left of dome
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.beginPath();
    ctx.ellipse(cx - 7, shellTop + 5, 6, 2.5, -0.4, 0, Math.PI * 2);
    ctx.fill();
    // Marginal scute — dark line where the dome meets the body
    ctx.strokeStyle = "#1a3d20";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(shellLeft, plastronY);
    ctx.lineTo(shellRight, plastronY);
    ctx.stroke();
    // Vertical scute seams along the dome (4 seams = 5 visible panels)
    ctx.strokeStyle = shellRim;
    ctx.lineWidth = 1.1;
    for (let i = 1; i < 5; i++) {
      const t = i / 5;
      const seamX = shellLeft + t * shellW;
      // Approximate the dome's height at this x using a parabola fit
      const yOnDome = plastronY - shellH * (1 - 4 * (t - 0.5) * (t - 0.5)) + 1;
      ctx.beginPath();
      ctx.moveTo(seamX, plastronY);
      ctx.lineTo(seamX, yOnDome);
      ctx.stroke();
    }
    // Top-of-dome ridge (separates the upper "vertebral" scutes from the side panels)
    ctx.beginPath();
    ctx.moveTo(shellLeft + 5, shellTop + 5);
    ctx.bezierCurveTo(
      shellLeft + 5, shellTop + 1,
      shellRight - 5, shellTop + 1,
      shellRight - 5, shellTop + 5
    );
    ctx.stroke();

    // === HEAD & NECK (drawn LAST so it overlaps the right side of the shell) ===
    // Neck — short stubby tube emerging from the front of the shell
    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.roundRect(x + P_W - 4, plastronY - 11, 13, 13, [3, 6, 6, 3]);
    ctx.fill();
    // Head — round and chubby, extends to the right
    ctx.beginPath();
    ctx.arc(x + P_W + 8, plastronY - 7, 9, 0, Math.PI * 2);
    ctx.fill();
    // Underside head shading (jawline)
    ctx.fillStyle = skinShade;
    ctx.beginPath();
    ctx.ellipse(x + P_W + 8, plastronY - 2, 7, 2.8, 0, 0, Math.PI);
    ctx.fill();
    // Cheek blush (front cheek, towards the direction of travel)
    ctx.fillStyle = blush;
    ctx.beginPath();
    ctx.arc(x + P_W + 12, plastronY - 4, 2.6, 0, Math.PI * 2);
    ctx.fill();
    // Eye — clearly on the visible (near) side of the head, looking forward
    ctx.fillStyle = eyeWhite;
    ctx.beginPath();
    ctx.arc(x + P_W + 9, plastronY - 9, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = pupil;
    ctx.beginPath();
    ctx.arc(x + P_W + 10.2, plastronY - 8.4, 2.6, 0, Math.PI * 2);
    ctx.fill();
    // Eye highlights
    ctx.fillStyle = eyeWhite;
    ctx.beginPath();
    ctx.arc(x + P_W + 9.4, plastronY - 9.6, 1.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + P_W + 11.3, plastronY - 7.4, 0.55, 0, Math.PI * 2);
    ctx.fill();
    // Nostril (front of the snout)
    ctx.fillStyle = skinShade;
    ctx.beginPath();
    ctx.arc(x + P_W + 16, plastronY - 5.5, 0.95, 0, Math.PI * 2);
    ctx.fill();
    // Smile — on the front of the snout (curving downward, facing right)
    ctx.strokeStyle = "#2a4a1a";
    ctx.lineWidth = 1.4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x + P_W + 12, plastronY - 3);
    ctx.quadraticCurveTo(x + P_W + 14.5, plastronY - 1.5, x + P_W + 16, plastronY - 3.5);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
}

export default DinoRunGamePage;
