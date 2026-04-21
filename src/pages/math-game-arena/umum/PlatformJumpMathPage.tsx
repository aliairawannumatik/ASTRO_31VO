import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";

const CW = 420;
const CH = 580;
const GRAVITY = 1150;
const JUMP_VY = -560;
const DBL_JUMP_VY = -490;
const MOVE_SPEED = 215;
const GROUND_Y = CH - 38;
const CHAR_W = 22;
const CHAR_H = 32;
const PW = 96;
const PH = 16;

type Phase = "idle" | "playing" | "over";

interface Question { q: string; ans: number; }

interface Char {
  x: number; y: number;
  vx: number; vy: number;
  onGround: boolean;
  jumpsLeft: number;
  facing: 1 | -1;
  runFrame: number;
  runTimer: number;
}

interface Platform {
  id: number;
  x: number; y: number;
  value: number;
  kind: "correct" | "wrong";
  hue: number;
  flash: number;
  pulseT: number;
}

interface FloatText {
  x: number; y: number; text: string; color: string; alpha: number; vy: number;
}

interface Particle {
  x: number; y: number; vx: number; vy: number; alpha: number; r: number; color: string;
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const makeQuestion = (): Question => {
  const t = Math.floor(Math.random() * 9);
  if (t === 0) { const a = 8 + Math.floor(Math.random() * 45); const b = 6 + Math.floor(Math.random() * 40); return { q: `${a} + ${b}`, ans: a + b }; }
  if (t === 1) { const b = 6 + Math.floor(Math.random() * 38); const a = b + 10 + Math.floor(Math.random() * 55); return { q: `${a} − ${b}`, ans: a - b }; }
  if (t === 2) { const a = 3 + Math.floor(Math.random() * 9); const b = 3 + Math.floor(Math.random() * 9); return { q: `${a} × ${b}`, ans: a * b }; }
  if (t === 3) { const b = 2 + Math.floor(Math.random() * 9); const ans = 3 + Math.floor(Math.random() * 12); return { q: `${b * ans} ÷ ${b}`, ans }; }
  if (t === 4) { const a = 2 + Math.floor(Math.random() * 11); return { q: `${a}²`, ans: a * a }; }
  if (t === 5) { const roots = [16, 25, 36, 49, 64, 81, 100, 121]; const n = roots[Math.floor(Math.random() * roots.length)]; return { q: `√${n}`, ans: Math.round(Math.sqrt(n)) }; }
  if (t === 6) { const a = 2 + Math.floor(Math.random() * 10); const b = 2 + Math.floor(Math.random() * 10); return { q: `FPB(${a},${b})`, ans: gcd(a, b) }; }
  if (t === 7) { const a = 2 + Math.floor(Math.random() * 10); const b = 2 + Math.floor(Math.random() * 10); return { q: `KPK(${a},${b})`, ans: (a * b) / gcd(a, b) }; }
  const a = 10 + Math.floor(Math.random() * 35); const b = 2 + Math.floor(Math.random() * 8); return { q: `${a} + ${b}×3`, ans: a + b * 3 };
};

const wrongVal = (ans: number, used: Set<number>) => {
  let v = ans; let guard = 0;
  while ((v === ans || used.has(v) || v < 0) && guard < 80) {
    const d = 1 + Math.floor(Math.random() * 18);
    v = ans + (Math.random() < 0.5 ? d : -d);
    guard++;
  }
  if (v < 0 || used.has(v) || v === ans) v = ans + used.size + 5;
  used.add(v); return v;
};

const ROWS = [GROUND_Y - 90, GROUND_Y - 155, GROUND_Y - 215, GROUND_Y - 270];

const makePlatforms = (ans: number): Platform[] => {
  const used = new Set<number>([ans]);
  const rows = [...ROWS].sort(() => Math.random() - 0.5);
  const correctIdx = Math.floor(Math.random() * 4);
  const hues = [200, 270, 30, 300];
  return Array.from({ length: 4 }, (_, i) => {
    const kind: "correct" | "wrong" = i === correctIdx ? "correct" : "wrong";
    const value = kind === "correct" ? ans : wrongVal(ans, used);
    const x = 15 + Math.random() * (CW - PW - 30);
    return { id: i, x, y: rows[i], value, kind, hue: kind === "correct" ? 130 + Math.random() * 30 : hues[i], flash: 0, pulseT: Math.random() * Math.PI * 2 };
  });
};

const initChar = (): Char => ({
  x: CW / 2 - CHAR_W / 2, y: GROUND_Y - CHAR_H,
  vx: 0, vy: 0, onGround: true, jumpsLeft: 2, facing: 1, runFrame: 0, runTimer: 0,
});

const PlatformJumpMathPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  const guruQuiz = useGuruQuiz(phaseRef);
  const qRef = useRef<Question>(makeQuestion());
  const charRef = useRef<Char>(initChar());
  const platformsRef = useRef<Platform[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatsRef = useRef<FloatText[]>([]);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const livesRef = useRef(3);
  const comboRef = useRef(0);
  const levelRef = useRef(1);
  const timerRef = useRef(90);
  const shakeRef = useRef(0);
  const hueRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const touchRef = useRef({ left: false, right: false });
  const jumpPressedRef = useRef(false);
  const [, forceRender] = useState(0);
  const rerender = useCallback(() => forceRender(n => n + 1), []);

  const addFloat = (x: number, y: number, text: string, color: string) => {
    floatsRef.current.push({ x, y, text, color, alpha: 1, vy: -85 });
  };

  const burst = (x: number, y: number, color: string, count = 28) => {
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const s = 70 + Math.random() * 220;
      particlesRef.current.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, alpha: 1, r: 3 + Math.random() * 5, color });
    }
  };

  const doJump = useCallback(() => {
    const char = charRef.current;
    if (char.jumpsLeft > 0) {
      char.vy = char.jumpsLeft === 2 ? JUMP_VY : DBL_JUMP_VY;
      char.onGround = false;
      char.jumpsLeft--;
      playPopSound();
    }
  }, []);

  const startGame = useCallback(() => {
    phaseRef.current = "playing";
    scoreRef.current = 0;
    livesRef.current = 3;
    comboRef.current = 0;
    levelRef.current = 1;
    timerRef.current = 90;
    shakeRef.current = 0;
    particlesRef.current = [];
    floatsRef.current = [];
    qRef.current = makeQuestion();
    platformsRef.current = makePlatforms(qRef.current.ans);
    charRef.current = initChar();
    rerender();
    playPopSound();
  }, [rerender]);

  const nextRound = useCallback(() => {
    qRef.current = makeQuestion();
    platformsRef.current = makePlatforms(qRef.current.ans);
    charRef.current = initChar();
  }, []);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if ((e.key === " " || e.key === "Enter") && phaseRef.current !== "playing") { startGame(); return; }
      if ((e.key === "ArrowUp" || e.key === " " || e.key === "w" || e.key === "W") && phaseRef.current === "playing") {
        if (!jumpPressedRef.current) { jumpPressedRef.current = true; doJump(); }
      }
    };
    const onUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
      if (e.key === "ArrowUp" || e.key === " " || e.key === "w" || e.key === "W") jumpPressedRef.current = false;
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, [startGame, doJump]);

  const handleTouchJump = useCallback(() => {
    if (phaseRef.current !== "playing") { startGame(); return; }
    doJump();
  }, [startGame, doJump]);

  const handleCanvasClick = useCallback(() => {
    if (phaseRef.current !== "playing") startGame();
  }, [startGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawText = (text: string, x: number, y: number, size: number, color = "#fff", align: CanvasTextAlign = "center") => {
      ctx.fillStyle = color;
      ctx.font = `900 ${size}px Orbitron, Inter, sans-serif`;
      ctx.textAlign = align;
      ctx.textBaseline = "middle";
      ctx.shadowBlur = 12;
      ctx.shadowColor = color;
      ctx.fillText(text, x, y);
      ctx.shadowBlur = 0;
    };

    const drawChar = (char: Char, ts: number) => {
      const cx = char.x + CHAR_W / 2;
      const cy = char.y + CHAR_H / 2;
      ctx.save();
      ctx.translate(cx, cy);
      if (char.facing === -1) ctx.scale(-1, 1);
      ctx.shadowBlur = 18;
      ctx.shadowColor = "#67e8f9";

      // Head
      ctx.fillStyle = "#0ea5e9";
      ctx.beginPath(); ctx.ellipse(0, -14, 9, 9, 0, 0, Math.PI * 2); ctx.fill();
      // Visor
      ctx.fillStyle = "#bae6fd";
      ctx.beginPath(); ctx.ellipse(2, -15, 5, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.beginPath(); ctx.ellipse(0, -16, 2.5, 2, 0, 0, Math.PI * 2); ctx.fill();

      // Body suit
      ctx.fillStyle = "#0284c7";
      ctx.beginPath(); ctx.roundRect(-8, -4, 16, 14, 3); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.beginPath(); ctx.roundRect(-5, -2, 10, 5, 2); ctx.fill();

      // Arms
      const armSwing = char.onGround ? Math.sin(ts * 0.01 + char.runFrame) * 16 : 0;
      ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.moveTo(-8, -1); ctx.lineTo(-13, 3 + armSwing); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(8, -1); ctx.lineTo(13, 3 - armSwing); ctx.stroke();

      // Legs
      const legSwing = char.onGround ? Math.sin(ts * 0.01 + char.runFrame + Math.PI) * 12 : 0;
      ctx.strokeStyle = "#0369a1";
      ctx.beginPath(); ctx.moveTo(-4, 10); ctx.lineTo(-5, 10 + 10 + legSwing); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4, 10); ctx.lineTo(5, 10 + 10 - legSwing); ctx.stroke();

      // Jetpack fire when airborne
      if (!char.onGround) {
        ctx.shadowBlur = 22; ctx.shadowColor = "#f97316";
        ctx.strokeStyle = "#fb923c"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(-4, 10); ctx.lineTo(-4, 10 + 10 + Math.random() * 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(4, 10); ctx.lineTo(4, 10 + 10 + Math.random() * 6); ctx.stroke();
      }
      ctx.restore();
    };

    const drawPlatform = (p: Platform, ts: number) => {
      const pulse = Math.sin(ts * 0.004 + p.pulseT) * 2.5;
      const isCorrect = p.kind === "correct";
      const color = p.flash > 0 ? "#ef4444" : `hsl(${p.hue}, 100%, ${isCorrect ? 50 : 44}%)`;
      ctx.save();
      ctx.shadowBlur = isCorrect ? 22 + pulse : 14;
      ctx.shadowColor = p.flash > 0 ? "#ef4444" : color;
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.roundRect(p.x, p.y, PW, PH, 8); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.beginPath(); ctx.roundRect(p.x + 4, p.y + 2, PW - 8, 4, 4); ctx.fill();
      ctx.shadowBlur = 0; ctx.restore();

      const textColor = isCorrect && p.flash === 0 ? "#0f172a" : "#ffffff";
      drawText(String(p.value), p.x + PW / 2, p.y + PH / 2, 13, textColor);

      if (isCorrect && p.flash === 0) {
        const arrowBob = Math.sin(ts * 0.006 + p.pulseT) * 4;
        drawText("▼", p.x + PW / 2, p.y - 14 + arrowBob, 11, "#86efac");
      }
    };

    const drawGround = () => {
      const grad = ctx.createLinearGradient(0, GROUND_Y, 0, CH);
      grad.addColorStop(0, "#1e3a5f"); grad.addColorStop(1, "#0f172a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, GROUND_Y, CW, CH - GROUND_Y);
      ctx.strokeStyle = "rgba(56,189,248,0.7)"; ctx.lineWidth = 2;
      ctx.shadowBlur = 8; ctx.shadowColor = "#38bdf8";
      ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(CW, GROUND_Y); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(56,189,248,0.12)"; ctx.lineWidth = 1;
      for (let gx = 0; gx < CW; gx += 42) {
        ctx.beginPath(); ctx.moveTo(gx, GROUND_Y); ctx.lineTo(gx, CH); ctx.stroke();
      }
    };

    const loop = (ts: number) => {
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05) || 0;
      lastRef.current = ts;
      if (guruQuiz.isPausedRef.current) { rafRef.current = requestAnimationFrame(loop); return; }
      hueRef.current = (hueRef.current + dt * 20) % 360;
      const phase = phaseRef.current;
      if (shakeRef.current > 0) shakeRef.current = Math.max(0, shakeRef.current - dt * 3);
      for (const p of platformsRef.current) if (p.flash > 0) p.flash = Math.max(0, p.flash - dt * 3.5);

      if (phase === "playing") {
        timerRef.current -= dt;
        if (timerRef.current <= 0) { timerRef.current = 0; phaseRef.current = "over"; rerender(); }

        const char = charRef.current;
        const keys = keysRef.current;
        const touch = touchRef.current;

        const goLeft = keys.has("ArrowLeft") || keys.has("a") || keys.has("A") || touch.left;
        const goRight = keys.has("ArrowRight") || keys.has("d") || keys.has("D") || touch.right;

        if (goLeft) { char.vx = -MOVE_SPEED; char.facing = -1; }
        else if (goRight) { char.vx = MOVE_SPEED; char.facing = 1; }
        else char.vx = 0;

        if ((goLeft || goRight) && char.onGround) {
          char.runTimer += dt;
          if (char.runTimer > 0.1) { char.runFrame = (char.runFrame + 1) % 4; char.runTimer = 0; }
        }

        char.vy = Math.min(char.vy + GRAVITY * dt, 900);
        const prevBottom = char.y + CHAR_H;
        char.x += char.vx * dt;
        char.y += char.vy * dt;

        // Wrap horizontally
        if (char.x < -CHAR_W) char.x = CW;
        if (char.x > CW) char.x = -CHAR_W;

        char.onGround = false;

        // Ground landing
        if (char.y + CHAR_H >= GROUND_Y && char.vy >= 0) {
          char.y = GROUND_Y - CHAR_H; char.vy = 0;
          char.onGround = true; char.jumpsLeft = 2;
        }

        // Platform landing
        const newBottom = char.y + CHAR_H;
        for (const p of platformsRef.current) {
          if (
            char.vy >= 0 &&
            prevBottom <= p.y + 3 &&
            newBottom >= p.y &&
            char.x + CHAR_W > p.x + 6 &&
            char.x < p.x + PW - 6
          ) {
            char.y = p.y - CHAR_H; char.vy = 0;
            char.onGround = true; char.jumpsLeft = 2;

            if (p.kind === "correct") {
              comboRef.current++;
              const pts = 100 + comboRef.current * 25 + levelRef.current * 10;
              scoreRef.current += pts;
              bestRef.current = Math.max(bestRef.current, scoreRef.current);
              timerRef.current = Math.min(99, timerRef.current + 5);
              levelRef.current = Math.max(1, Math.floor(scoreRef.current / 350) + 1);
              addFloat(p.x + PW / 2, p.y - 22, `+${pts} 🎯`, "#86efac");
              burst(p.x + PW / 2, p.y, `hsl(${130 + Math.random() * 40}, 100%, 65%)`, 36);
              playPopSound();
              nextRound();
            } else {
              comboRef.current = 0;
              livesRef.current--;
              shakeRef.current = 0.55;
              p.flash = 1;
              addFloat(p.x + PW / 2, p.y - 22, "Salah! ❌", "#fca5a5");
              burst(p.x + PW / 2, p.y, "#ef4444", 24);
              char.vy = -340;
              char.onGround = false;
              char.jumpsLeft = 1;
              if (livesRef.current <= 0) { livesRef.current = 0; phaseRef.current = "over"; rerender(); }
            }
            break;
          }
        }

        // Fell off bottom
        if (char.y > CH + 80) {
          charRef.current = initChar();
          livesRef.current--;
          shakeRef.current = 0.4;
          addFloat(CW / 2, GROUND_Y - 60, "Jatuh! 💨", "#fde68a");
          if (livesRef.current <= 0) { livesRef.current = 0; phaseRef.current = "over"; rerender(); }
        }
      }

      // Particles
      particlesRef.current.forEach(p => {
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.vy += 280 * dt; p.alpha -= dt * 1.6; p.r *= 0.989;
      });
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);
      floatsRef.current.forEach(f => { f.y += f.vy * dt; f.alpha -= dt * 1.1; });
      floatsRef.current = floatsRef.current.filter(f => f.alpha > 0);

      // ─── DRAW ───
      ctx.save();
      const shake = shakeRef.current * 10;
      ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, CH);
      bg.addColorStop(0, `hsl(${hueRef.current}, 85%, 9%)`);
      bg.addColorStop(0.5, "#080e1a");
      bg.addColorStop(1, `hsl(${(hueRef.current + 155) % 360}, 85%, 11%)`);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, CW, CH);

      // Stars
      for (let i = 0; i < 60; i++) {
        const sx = ((i * 79 + ts * 0.012) % (CW + 50)) - 25;
        const sy = (i * 63 + Math.sin(ts * 0.0007 + i) * 14) % (CH - 55);
        ctx.fillStyle = `hsla(${(hueRef.current + i * 22) % 360}, 100%, 82%, ${0.08 + (i % 5) * 0.055})`;
        ctx.beginPath(); ctx.arc(sx, sy, 0.8 + (i % 3) * 0.5, 0, Math.PI * 2); ctx.fill();
      }
      // Nebula blobs
      for (let i = 0; i < 3; i++) {
        const nx = 60 + i * 130 + Math.sin(ts * 0.0005 + i * 2) * 18;
        const ny = 180 + i * 100 + Math.cos(ts * 0.0004 + i) * 15;
        const gr = ctx.createRadialGradient(nx, ny, 0, nx, ny, 70);
        gr.addColorStop(0, `hsla(${(hueRef.current + i * 80) % 360}, 100%, 60%, 0.06)`);
        gr.addColorStop(1, "transparent");
        ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(nx, ny, 70, 0, Math.PI * 2); ctx.fill();
      }

      // HUD
      ctx.fillStyle = "rgba(2,6,23,0.8)"; ctx.fillRect(0, 0, CW, 130);
      ctx.strokeStyle = "rgba(56,189,248,0.22)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, 130); ctx.lineTo(CW, 130); ctx.stroke();
      drawText("LOMPAT JAWABAN", CW / 2, 22, 15, "#67e8f9");
      drawText(`Soal: ${qRef.current.q}`, CW / 2, 64, 27, "#ffffff");
      const hp = Math.max(0, livesRef.current);
      drawText("❤️".repeat(hp), 18, 108, 11, "#f87171", "left");
      drawText(`Skor ${scoreRef.current}`, CW / 2, 108, 12, "#86efac");
      drawText(`⏱ ${Math.ceil(timerRef.current)}`, CW - 18, 108, 12, "#fde68a", "right");
      if (comboRef.current >= 2) drawText(`COMBO ×${comboRef.current} 🔥`, CW / 2, 141, 12, "#fb923c");

      // Ground + platforms
      drawGround();
      for (const p of platformsRef.current) drawPlatform(p, ts);

      // Character
      if (phase === "playing") drawChar(charRef.current, ts);

      // Particles
      particlesRef.current.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color; ctx.shadowBlur = 10; ctx.shadowColor = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;

      // Float texts
      floatsRef.current.forEach(f => { ctx.globalAlpha = f.alpha; drawText(f.text, f.x, f.y, 15, f.color); });
      ctx.globalAlpha = 1;

      // Overlay
      if (phase === "idle" || phase === "over") {
        ctx.fillStyle = "rgba(2,6,23,0.84)";
        ctx.fillRect(22, 150, CW - 44, 255);
        ctx.strokeStyle = phase === "idle" ? "#67e8f9" : "#f87171"; ctx.lineWidth = 3;
        ctx.strokeRect(22, 150, CW - 44, 255);
        drawText(phase === "idle" ? "🪐 SIAP MELOMPAT?" : "PERMAINAN SELESAI", CW / 2, 194, 19, phase === "idle" ? "#67e8f9" : "#f87171");
        if (phase === "over") {
          drawText(`Skor akhir: ${scoreRef.current}`, CW / 2, 230, 16, "#ffffff");
          drawText(`Terbaik: ${bestRef.current}`, CW / 2, 257, 13, "#fde68a");
        } else {
          drawText("Lompat ke platform jawaban benar!", CW / 2, 230, 12, "#a5f3fc");
          drawText("Jangan salah platform — hilang nyawa!", CW / 2, 254, 11, "#fca5a5");
        }
        drawText("← → untuk gerak   ↑ / Spasi = lompat", CW / 2, 290, 11, "#94a3b8");
        drawText("Double jump tersedia! 💫", CW / 2, 313, 11, "#c084fc");
        drawText(phase === "idle" ? "Klik Mulai atau tekan Spasi" : "Klik Ulangi atau tekan Enter", CW / 2, 370, 13, "#fde68a");
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [rerender, nextRound, startGame]);

  return (
    <div className={`relative flex flex-col overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}
      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        <div className="shrink-0 px-3 pt-2 pb-1 flex items-center justify-between">
          <button
            onClick={() => { playPopSound(); navigate('/ruang-untuk-guru/numatik-game'); }}
            className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all text-sm"
            title="Menu Utama"
          >
            🏠
          </button>
          <span className="font-display text-base font-bold text-primary text-glow-cyan">🪐 Lompat Jawaban</span>
          <button
            onClick={() => { playPopSound(); navigate(-1); }}
            className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all font-bold"
            title="Keluar"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center px-2">
          <div className="relative rounded-[28px] p-2 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 shadow-[0_0_50px_rgba(103,232,249,0.28)]">
            <canvas
              ref={canvasRef}
              width={CW}
              height={CH}
              onClick={handleCanvasClick}
              className="rounded-[20px] bg-slate-950 select-none touch-none border-4 border-slate-900 cursor-pointer"
              style={{ width: 'auto', height: 'auto', maxWidth: '92vw', maxHeight: 'calc(100dvh - 130px)' }}
            />
          </div>
        </div>

        <div className="shrink-0 px-3 pb-2 pt-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            <button
              onPointerDown={() => { touchRef.current.left = true; }}
              onPointerUp={() => { touchRef.current.left = false; }}
              onPointerLeave={() => { touchRef.current.left = false; }}
              className="w-12 h-12 rounded-full bg-white/10 border border-white/25 text-xl font-bold text-white active:bg-white/25 select-none touch-none"
            >◀</button>
            <button
              onPointerDown={handleTouchJump}
              className="w-14 h-14 rounded-full bg-cyan-500/30 border-2 border-cyan-400/60 text-xl text-white active:bg-cyan-400/40 select-none touch-none flex items-center justify-center"
            >⬆</button>
            <button
              onPointerDown={() => { touchRef.current.right = true; }}
              onPointerUp={() => { touchRef.current.right = false; }}
              onPointerLeave={() => { touchRef.current.right = false; }}
              className="w-12 h-12 rounded-full bg-white/10 border border-white/25 text-xl font-bold text-white active:bg-white/25 select-none touch-none"
            >▶</button>
            <button
              onClick={startGame}
              className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-black hover:scale-105 transition-transform"
            >
              Mulai / Ulangi
            </button>
          </div>
        </div>
      <GuruQuizOverlay {...guruQuiz} />
      </div>
    </div>
  );
};

export default PlatformJumpMathPage;
