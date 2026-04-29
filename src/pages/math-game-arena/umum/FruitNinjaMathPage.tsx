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
const CH = 600;

type Phase = "idle" | "playing" | "over";
type FruitKind = "correct" | "wrong" | "bomb" | "bonus";

interface Question {
  q: string;
  ans: number;
  ansStr?: string;
  lines?: string[];
}

interface SpecialQuestion {
  lines: string[];
  ansStr: string;
  wrongOpts: string[];
}

interface Fruit {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  value: number;
  valueStr?: string;
  kind: FruitKind;
  color: string;
  glow: string;
  label: string;
  rot: number;
  spin: number;
  sliced: boolean;
}

interface SliceTrail {
  x: number;
  y: number;
  alpha: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  r: number;
  color: string;
}

interface FloatText {
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
}

let uid = 1;

const fruitPalettes = [
  { color: "#fb7185", glow: "#fecdd3", label: "🍓" },
  { color: "#f97316", glow: "#fed7aa", label: "🍊" },
  { color: "#facc15", glow: "#fef08a", label: "🍋" },
  { color: "#22c55e", glow: "#bbf7d0", label: "🍏" },
  { color: "#06b6d4", glow: "#a5f3fc", label: "🫐" },
  { color: "#a855f7", glow: "#e9d5ff", label: "🍇" },
  { color: "#ec4899", glow: "#fbcfe8", label: "🍑" },
];

const specialQPool: SpecialQuestion[] = [
  {
    lines: ["Menara P=135m, Q=180m.", "Rasio tinggi Q : P (paling sederhana)?"],
    ansStr: "4:3",
    wrongOpts: ["3:4", "5:3", "4:5"],
  },
  {
    lines: ["30 kelereng merah, 20 biru.", "Rasio merah : semua (paling sederhana)?"],
    ansStr: "3:5",
    wrongOpts: ["2:5", "3:2", "1:2"],
  },
];

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const makeQuestion = (): Question => {
  const t = Math.floor(Math.random() * 10);
  if (t === 0) {
    const a = 8 + Math.floor(Math.random() * 50);
    const b = 7 + Math.floor(Math.random() * 45);
    return { q: `${a} + ${b}`, ans: a + b };
  }
  if (t === 1) {
    const b = 7 + Math.floor(Math.random() * 42);
    const a = b + 12 + Math.floor(Math.random() * 70);
    return { q: `${a} − ${b}`, ans: a - b };
  }
  if (t === 2) {
    const a = 3 + Math.floor(Math.random() * 10);
    const b = 3 + Math.floor(Math.random() * 10);
    return { q: `${a} × ${b}`, ans: a * b };
  }
  if (t === 3) {
    const b = 2 + Math.floor(Math.random() * 10);
    const ans = 3 + Math.floor(Math.random() * 13);
    return { q: `${b * ans} ÷ ${b}`, ans };
  }
  if (t === 4) {
    const a = 2 + Math.floor(Math.random() * 12);
    return { q: `${a}²`, ans: a * a };
  }
  if (t === 5) {
    const roots = [16, 25, 36, 49, 64, 81, 100, 121, 144, 169];
    const n = roots[Math.floor(Math.random() * roots.length)];
    return { q: `√${n}`, ans: Math.round(Math.sqrt(n)) };
  }
  if (t === 6) {
    const a = 2 + Math.floor(Math.random() * 10);
    const b = 2 + Math.floor(Math.random() * 10);
    return { q: `FPB(${a}, ${b})`, ans: gcd(a, b) };
  }
  if (t === 7) {
    const a = 2 + Math.floor(Math.random() * 10);
    const b = 2 + Math.floor(Math.random() * 10);
    return { q: `KPK(${a}, ${b})`, ans: (a * b) / gcd(a, b) };
  }
  if (t === 8) {
    const a = 12 + Math.floor(Math.random() * 35);
    const b = 2 + Math.floor(Math.random() * 8);
    return { q: `${a} mod ${b}`, ans: a % b };
  }
  const a = 10 + Math.floor(Math.random() * 40);
  const b = 2 + Math.floor(Math.random() * 9);
  return { q: `${a} + ${b} × 3`, ans: a + b * 3 };
};

const wrongValue = (ans: number, used: Set<number>) => {
  let v = ans;
  let guard = 0;
  while ((v === ans || used.has(v) || v < 0) && guard < 80) {
    const d = 1 + Math.floor(Math.random() * 18);
    v = ans + (Math.random() < 0.5 ? d : -d);
    guard += 1;
  }
  if (v < 0 || used.has(v) || v === ans) v = ans + used.size + 4;
  used.add(v);
  return v;
};

const FruitNinjaMathPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  const QUIZ_INTERVAL_S = 15 * 60;
  const guruQuiz = useGuruQuiz(phaseRef, "playing", QUIZ_INTERVAL_S * 1000);
  const sessionStartRef = useRef(0);
  const nextQuizInRef = useRef(QUIZ_INTERVAL_S);
  const [, setNextQuizIn] = useState(QUIZ_INTERVAL_S);
  const qRef = useRef<Question>(makeQuestion());
  const fruitsRef = useRef<Fruit[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatsRef = useRef<FloatText[]>([]);
  const trailRef = useRef<SliceTrail[]>([]);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const livesRef = useRef(3);
  const comboRef = useRef(0);
  const levelRef = useRef(1);
  const timerRef = useRef(90);
  const spawnAccRef = useRef(0);
  const hueRef = useRef(0);
  const shakeRef = useRef(0);
  const specialTriggered = useRef<boolean[]>([false, false]);
  const pendingSpecialQ = useRef<SpecialQuestion | null>(null);
  const [, forceRender] = useState(0);

  const rerender = useCallback(() => forceRender(n => n + 1), []);

  const addFloat = (x: number, y: number, text: string, color: string) => {
    floatsRef.current.push({ x, y, text, color, alpha: 1, vy: -85 });
  };

  const burst = (x: number, y: number, color: string, count = 24) => {
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const s = 80 + Math.random() * 240;
      particlesRef.current.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, alpha: 1, r: 2 + Math.random() * 6, color });
    }
  };

  const spawnWave = useCallback(() => {
    const specialQ = pendingSpecialQ.current;
    pendingSpecialQ.current = null;

    if (specialQ) {
      const q: Question = {
        q: specialQ.lines.join(" "),
        ans: -9999,
        ansStr: specialQ.ansStr,
        lines: specialQ.lines,
      };
      qRef.current = q;

      const allOpts = [specialQ.ansStr, ...specialQ.wrongOpts];
      const shuffled = allOpts.sort(() => Math.random() - 0.5);
      const fruits: Fruit[] = [];
      const total = shuffled.length;
      const baseX = 55 + Math.random() * (CW - 110);

      for (let i = 0; i < total; i++) {
        const pal = fruitPalettes[(Math.floor(Math.random() * fruitPalettes.length) + i) % fruitPalettes.length];
        const isCorrect = shuffled[i] === specialQ.ansStr;
        const kind: FruitKind = isCorrect ? "correct" : "wrong";
        const spread = (i - (total - 1) / 2) * (50 + Math.random() * 10);
        fruits.push({
          id: uid++,
          x: Math.max(45, Math.min(CW - 45, baseX + spread)),
          y: CH + 35 + Math.random() * 30,
          vx: (Math.random() - 0.5) * 92,
          vy: -(510 + Math.random() * 165 + levelRef.current * 12),
          r: 32 + Math.random() * 5,
          value: 0,
          valueStr: shuffled[i],
          kind,
          color: pal.color,
          glow: pal.glow,
          label: pal.label,
          rot: Math.random() * Math.PI * 2,
          spin: (Math.random() < 0.5 ? -1 : 1) * (1.6 + Math.random() * 3.3),
          sliced: false,
        });
      }
      fruitsRef.current.push(...fruits);
      rerender();
      return;
    }

    const q = makeQuestion();
    qRef.current = q;
    const used = new Set<number>([q.ans]);
    const total = 4 + Math.min(2, Math.floor(levelRef.current / 3));
    const correctIndex = Math.floor(Math.random() * total);
    const fruits: Fruit[] = [];
    // distribute fruits across the screen width, give each its own random launch position + delay
    const slotW = (CW - 80) / total;
    const order = Array.from({ length: total }, (_, i) => i).sort(() => Math.random() - 0.5);
    for (let i = 0; i < total; i++) {
      const pal = fruitPalettes[(Math.floor(Math.random() * fruitPalettes.length) + i) % fruitPalettes.length];
      const kind: FruitKind = i === correctIndex ? "correct" : "wrong";
      const value = kind === "correct" ? q.ans : wrongValue(q.ans, used);
      const slot = order[i];
      const x = 40 + slot * slotW + Math.random() * slotW * 0.6;
      // staggered spawn: launch from below screen at varying depths so they appear at different times
      const launchOffset = Math.random() * 360;
      fruits.push({
        id: uid++,
        x: Math.max(40, Math.min(CW - 40, x)),
        y: CH + 35 + launchOffset,
        vx: (Math.random() - 0.5) * 145,
        vy: -(620 + Math.random() * 200 + levelRef.current * 18),
        r: 22 + Math.random() * 5,
        value,
        kind,
        color: pal.color,
        glow: pal.glow,
        label: pal.label,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() < 0.5 ? -1 : 1) * (2.6 + Math.random() * 4.5),
        sliced: false,
      });
    }
    if (Math.random() < Math.min(0.65, 0.22 + levelRef.current * 0.04)) {
      fruits.push({
        id: uid++,
        x: 55 + Math.random() * (CW - 110),
        y: CH + 50,
        vx: (Math.random() - 0.5) * 125,
        vy: -(470 + Math.random() * 135),
        r: 27,
        value: 0,
        kind: "bomb",
        color: "#111827",
        glow: "#ef4444",
        label: "💣",
        rot: Math.random() * Math.PI * 2,
        spin: 3 + Math.random() * 4,
        sliced: false,
      });
    }
    if (comboRef.current >= 4 && Math.random() < 0.35) {
      fruits.push({
        id: uid++,
        x: 55 + Math.random() * (CW - 110),
        y: CH + 60,
        vx: (Math.random() - 0.5) * 95,
        vy: -(500 + Math.random() * 135),
        r: 24,
        value: 0,
        kind: "bonus",
        color: "#facc15",
        glow: "#fef08a",
        label: "⭐",
        rot: Math.random() * Math.PI * 2,
        spin: 4,
        sliced: false,
      });
    }
    fruitsRef.current.push(...fruits);
    rerender();
  }, [rerender]);

  const startGame = useCallback(() => {
    phaseRef.current = "playing";
    scoreRef.current = 0;
    livesRef.current = 3;
    comboRef.current = 0;
    levelRef.current = 1;
    timerRef.current = 90;
    spawnAccRef.current = 0;
    shakeRef.current = 0;
    fruitsRef.current = [];
    particlesRef.current = [];
    floatsRef.current = [];
    trailRef.current = [];
    specialTriggered.current = [false, false];
    pendingSpecialQ.current = specialQPool[0];
    qRef.current = makeQuestion();
    sessionStartRef.current = Date.now();
    nextQuizInRef.current = QUIZ_INTERVAL_S;
    setNextQuizIn(QUIZ_INTERVAL_S);
    spawnWave();
    rerender();
    playPopSound();
  }, [rerender, spawnWave]);

  const sliceAt = useCallback((x: number, y: number) => {
    if (phaseRef.current !== "playing") {
      startGame();
      return;
    }
    trailRef.current.push({ x, y, alpha: 1 });
    let hit = false;
    for (const fruit of fruitsRef.current) {
      if (fruit.sliced) continue;
      const d = Math.hypot(x - fruit.x, y - fruit.y);
      if (d <= fruit.r + 12) {
        hit = true;
        fruit.sliced = true;
        if (fruit.kind === "correct") {
          comboRef.current += 1;
          const pts = 30 * comboRef.current + levelRef.current * 10;
          scoreRef.current += pts;
          bestRef.current = Math.max(bestRef.current, scoreRef.current);
          levelRef.current = Math.max(1, Math.floor(scoreRef.current / 220) + 1);
          addFloat(fruit.x, fruit.y - 10, `+${pts} ×${comboRef.current}`, "#bbf7d0");
          burst(fruit.x, fruit.y, fruit.glow, 34);
          qRef.current = makeQuestion();
          playPopSound();
        } else if (fruit.kind === "bonus") {
          scoreRef.current += 80;
          addFloat(fruit.x, fruit.y - 10, "+BONUS", "#fde047");
          burst(fruit.x, fruit.y, "#fde047", 42);
          playPopSound();
        } else {
          comboRef.current = 0;
          livesRef.current -= fruit.kind === "bomb" ? 2 : 1;
          shakeRef.current = fruit.kind === "bomb" ? 0.7 : 0.35;
          addFloat(fruit.x, fruit.y - 10, fruit.kind === "bomb" ? "BOOM!" : "Salah!", "#fecaca");
          burst(fruit.x, fruit.y, "#ef4444", 32);
          if (livesRef.current <= 0) {
            livesRef.current = 0;
            phaseRef.current = "over";
            rerender();
          }
        }
      }
    }
    if (!hit) {
      comboRef.current = Math.max(0, comboRef.current - 1);
    }
  }, [rerender, startGame]);

  const handlePointer = useCallback((clientX: number, clientY: number, rect: DOMRect) => {
    const x = (clientX - rect.left) * (CW / rect.width);
    const y = (clientY - rect.top) * (CH / rect.height);
    sliceAt(x, y);
  }, [sliceAt]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === " " || e.key === "Enter") && phaseRef.current !== "playing") startGame();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [startGame]);

  useEffect(() => {
    const id = setInterval(() => {
      if (phaseRef.current !== "playing" || sessionStartRef.current === 0) return;
      const elapsed = (Date.now() - sessionStartRef.current) / 1000;
      const remaining = Math.max(0, Math.ceil(QUIZ_INTERVAL_S - (elapsed % QUIZ_INTERVAL_S)));
      nextQuizInRef.current = remaining;
      setNextQuizIn(remaining);
    }, 250);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawText = (text: string, x: number, y: number, size: number, color = "#ffffff", align: CanvasTextAlign = "center") => {
      ctx.fillStyle = color;
      ctx.font = `900 ${size}px Orbitron, Inter, sans-serif`;
      ctx.textAlign = align;
      ctx.textBaseline = "middle";
      ctx.shadowBlur = 14;
      ctx.shadowColor = color;
      ctx.fillText(text, x, y);
      ctx.shadowBlur = 0;
    };

    const drawFruit = (fruit: Fruit, ts: number) => {
      ctx.save();
      ctx.translate(fruit.x, fruit.y);
      ctx.rotate(fruit.rot);
      const pulse = Math.sin(ts * 0.006 + fruit.id) * 2.5;
      ctx.shadowBlur = 24;
      ctx.shadowColor = fruit.glow;
      if (fruit.kind === "bomb") {
        ctx.fillStyle = "#111827";
        ctx.beginPath();
        ctx.arc(0, 0, fruit.r + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = "#fde047";
        ctx.beginPath();
        ctx.arc(9, -15, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        drawText("BOM", fruit.x, fruit.y + 2, 11, "#fecaca");
        return;
      }
      if (fruit.kind === "bonus") {
        ctx.fillStyle = fruit.color;
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const a = -Math.PI / 2 + (Math.PI * 2 * i) / 10;
          const r = i % 2 === 0 ? fruit.r + pulse : fruit.r * 0.46;
          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        drawText("+", fruit.x, fruit.y, 18, "#78350f");
        return;
      }
      const grad = ctx.createRadialGradient(-10, -10, 4, 0, 0, fruit.r + 6);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.25, fruit.glow);
      grad.addColorStop(1, fruit.color);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, fruit.r + pulse, fruit.r * 0.9 + pulse, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = fruit.kind === "correct" ? "#ffffff" : "rgba(15,23,42,0.9)";
      ctx.lineWidth = fruit.kind === "correct" ? 4 : 2;
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.beginPath();
      ctx.ellipse(-9, -11, 7, 4, -0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      const displayLabel = fruit.valueStr ?? String(fruit.value);
      const fontSize = displayLabel.length > 3 ? 13 : (fruit.value > 99 ? 13 : 17);
      drawText(displayLabel, fruit.x, fruit.y + 1, fontSize, fruit.kind === "correct" ? "#0f172a" : "#ffffff");
      drawText(fruit.label, fruit.x - 24, fruit.y - 24, 17, "#ffffff");
    };

    const loop = (ts: number) => {
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05) || 0;
      lastRef.current = ts;
      if (guruQuiz.isPausedRef.current) { rafRef.current = requestAnimationFrame(loop); return; }
      hueRef.current = (hueRef.current + dt * 45) % 360;
      const phase = phaseRef.current;
      if (shakeRef.current > 0) shakeRef.current = Math.max(0, shakeRef.current - dt * 2.5);

      if (phase === "playing") {
        timerRef.current -= dt;
        spawnAccRef.current += dt;
        if (timerRef.current <= 0) {
          timerRef.current = 0;
          phaseRef.current = "over";
          rerender();
        }

        if (!specialTriggered.current[1] && timerRef.current <= 30) {
          specialTriggered.current[1] = true;
          pendingSpecialQ.current = specialQPool[1];
          fruitsRef.current = [];
          spawnAccRef.current = 999;
        }

        const interval = Math.max(1.05, 2.25 - levelRef.current * 0.09);
        if (spawnAccRef.current >= interval) {
          spawnAccRef.current = 0;
          spawnWave();
        }
        for (const fruit of fruitsRef.current) {
          fruit.x += fruit.vx * dt;
          fruit.y += fruit.vy * dt;
          fruit.vy += (540 + levelRef.current * 12) * dt;
          fruit.rot += fruit.spin * dt;
          if (!fruit.sliced && fruit.kind === "correct" && fruit.y > CH + 55 && fruit.vy > 0) {
            fruit.sliced = true;
            comboRef.current = 0;
            livesRef.current -= 1;
            addFloat(Math.max(60, Math.min(CW - 60, fruit.x)), CH - 52, "Lewat!", "#fecaca");
            shakeRef.current = 0.3;
            if (livesRef.current <= 0) {
              livesRef.current = 0;
              phaseRef.current = "over";
              rerender();
            }
          }
        }
        fruitsRef.current = fruitsRef.current.filter(fruit => fruit.y < CH + 110 && fruit.x > -85 && fruit.x < CW + 85 && !fruit.sliced);
      }

      particlesRef.current.forEach(p => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 240 * dt;
        p.alpha -= dt * 1.8;
        p.r *= 0.985;
      });
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);
      floatsRef.current.forEach(f => {
        f.y += f.vy * dt;
        f.alpha -= dt * 1.15;
      });
      floatsRef.current = floatsRef.current.filter(f => f.alpha > 0);
      trailRef.current.forEach(t => t.alpha -= dt * 2.8);
      trailRef.current = trailRef.current.filter(t => t.alpha > 0);

      ctx.save();
      const shake = shakeRef.current * 12;
      ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      const bg = ctx.createLinearGradient(0, 0, 0, CH);
      bg.addColorStop(0, `hsl(${hueRef.current}, 95%, 16%)`);
      bg.addColorStop(0.48, "#111827");
      bg.addColorStop(1, `hsl(${(hueRef.current + 135) % 360}, 95%, 18%)`);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, CW, CH);

      for (let i = 0; i < 72; i++) {
        const x = (i * 61 + ts * 0.025) % (CW + 70) - 35;
        const y = 38 + ((i * 89 + Math.sin(ts * 0.001 + i) * 18) % 520);
        ctx.fillStyle = `hsla(${(hueRef.current + i * 19) % 360}, 100%, 72%, ${0.13 + (i % 4) * 0.05})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.2 + (i % 4), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "rgba(2,6,23,0.72)";
      ctx.fillRect(0, 0, CW, 146);
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 146);
      ctx.lineTo(CW, 146);
      ctx.stroke();
      drawText("NINJA BUAH MATH", CW / 2, 27, 18, "#f9a8d4");

      const currentQ = qRef.current;
      if (currentQ.lines && currentQ.lines.length > 0) {
        const lineCount = currentQ.lines.length;
        const startY = lineCount === 1 ? 70 : 55;
        const lineGap = 26;
        currentQ.lines.forEach((line, i) => {
          drawText(line, CW / 2, startY + i * lineGap, 13, "#fde047");
        });
      } else {
        drawText(`Soal: ${currentQ.q}`, CW / 2, 70, 28, "#ffffff");
      }

      drawText(`Skor ${scoreRef.current}`, 27, 110, 13, "#bbf7d0", "left");
      drawText(`Nyawa ${"❤".repeat(livesRef.current)}`, CW / 2, 110, 13, "#fecaca");
      drawText(`Waktu ${Math.ceil(timerRef.current)}`, CW - 27, 110, 13, "#fde047", "right");
      const quizSecs = nextQuizInRef.current;
      const mm = Math.floor(quizSecs / 60);
      const ss = quizSecs % 60;
      const quizUrgent = quizSecs <= 10;
      const pulse = quizUrgent ? 0.7 + Math.sin(ts * 0.012) * 0.3 : 1;
      const pillW = 200;
      const pillX = (CW - pillW) / 2;
      const pillY = 124;
      const pillH = 22;
      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.fillStyle = quizUrgent ? "rgba(253,224,71,0.25)" : "rgba(103,232,249,0.18)";
      ctx.strokeStyle = quizUrgent ? "#fde047" : "#67e8f9";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 11);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      drawText(`⏱ SOAL DALAM ${mm}:${String(ss).padStart(2, "0")}`, CW / 2, pillY + 15, 12, quizUrgent ? "#fde047" : "#a5f3fc");

      ctx.fillStyle = "rgba(15,23,42,0.45)";
      ctx.fillRect(0, 146, CW, CH - 146);
      ctx.strokeStyle = `hsla(${hueRef.current}, 100%, 65%, 0.28)`;
      ctx.lineWidth = 2;
      for (let y = 180; y < CH; y += 58) {
        ctx.beginPath();
        ctx.moveTo(0, y + Math.sin(ts * 0.002 + y) * 6);
        ctx.bezierCurveTo(120, y - 20, 260, y + 25, CW, y - 5);
        ctx.stroke();
      }

      fruitsRef.current.forEach(fruit => drawFruit(fruit, ts));

      for (let i = 1; i < trailRef.current.length; i++) {
        const a = trailRef.current[i - 1];
        const b = trailRef.current[i];
        ctx.globalAlpha = Math.min(a.alpha, b.alpha);
        ctx.strokeStyle = "#ffffff";
        ctx.shadowBlur = 18;
        ctx.shadowColor = "#67e8f9";
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      particlesRef.current.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 14;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      floatsRef.current.forEach(f => {
        ctx.globalAlpha = f.alpha;
        drawText(f.text, f.x, f.y, 16, f.color);
      });
      ctx.globalAlpha = 1;

      if (phase === "idle" || phase === "over") {
        ctx.fillStyle = "rgba(2,6,23,0.76)";
        ctx.fillRect(24, 188, CW - 48, 248);
        ctx.strokeStyle = phase === "idle" ? "#f9a8d4" : "#67e8f9";
        ctx.lineWidth = 3;
        ctx.strokeRect(24, 188, CW - 48, 248);
        drawText(phase === "idle" ? "SIAP JADI NINJA?" : "PERMAINAN SELESAI", CW / 2, 231, 22, phase === "idle" ? "#f9a8d4" : "#67e8f9");
        drawText(phase === "idle" ? "Klik / sentuh buah untuk mulai" : `Skor akhir: ${scoreRef.current}`, CW / 2, 279, 18, "#ffffff");
        drawText("Iris buah dengan jawaban benar", CW / 2, 323, 15, "#bbf7d0");
        drawText("Jangan iris bom atau jawaban salah", CW / 2, 353, 15, "#fecaca");
        drawText("Combo tinggi = skor makin besar", CW / 2, 391, 14, "#fde047");
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [rerender, spawnWave, startGame]);

  return (
    <div className={`relative flex flex-col overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}
      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        <div className="shrink-0 px-3 pt-5 pb-1 flex flex-col items-center">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => { playPopSound(); navigate('/ruang-untuk-guru/numatik-game'); }}
              className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all text-sm"
              title="Menu Utama"
            >
              🏠
            </button>
            <span className="font-display text-base font-bold text-primary text-glow-cyan">🍉 Ninja Buah Math</span>
            <button
              onClick={() => { playPopSound(); navigate(-1); }}
              className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all font-bold"
              title="Keluar"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center px-2">
          <div className="relative rounded-[28px] p-2 bg-gradient-to-br from-pink-400 via-cyan-400 to-lime-300 shadow-[0_0_45px_rgba(244,114,182,0.35)]">
            <canvas
              ref={canvasRef}
              width={CW}
              height={CH}
              onMouseDown={e => handlePointer(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect())}
              onMouseMove={e => {
                if (e.buttons === 1) handlePointer(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
              }}
              onTouchStart={e => {
                e.preventDefault();
                const t = e.touches[0];
                handlePointer(t.clientX, t.clientY, e.currentTarget.getBoundingClientRect());
              }}
              onTouchMove={e => {
                e.preventDefault();
                const t = e.touches[0];
                handlePointer(t.clientX, t.clientY, e.currentTarget.getBoundingClientRect());
              }}
              className="rounded-[20px] bg-slate-950 cursor-crosshair select-none touch-none border-4 border-slate-900"
              style={{ width: 'auto', height: 'auto', maxWidth: '92vw', maxHeight: 'calc(100dvh - 110px)' }}
            />
          </div>
        </div>

        <div className="shrink-0 px-3 pb-2 pt-1 flex flex-wrap justify-center gap-2">
          <button
            onClick={startGame}
            className="rounded-full bg-accent px-5 py-2 text-sm font-bold text-black hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30"
          >
            Mulai / Ulangi
          </button>
          <button
            onClick={() => { playPopSound(); navigate(-1); }}
            className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold text-white hover:bg-white/20 transition-colors"
          >
            Kembali
          </button>
        </div>
      <GuruQuizOverlay {...guruQuiz} />
      </div>
    </div>
  );
};

export default FruitNinjaMathPage;
