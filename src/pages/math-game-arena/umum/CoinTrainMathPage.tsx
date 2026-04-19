import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const CW = 420;
const CH = 600;
const LANES = [225, 315, 405];
const PLAYER_X = 92;

type Phase = "idle" | "playing" | "over";
type ItemKind = "coin" | "wrong" | "bomb" | "star";

interface Question {
  q: string;
  ans: number;
}

interface RailItem {
  id: number;
  x: number;
  y: number;
  lane: number;
  value: number;
  kind: ItemKind;
  color: string;
  glow: string;
  r: number;
  spin: number;
  pulse: number;
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
  alpha: number;
  vy: number;
  color: string;
}

let uid = 1;

const colors = [
  { color: "#22d3ee", glow: "#67e8f9" },
  { color: "#f472b6", glow: "#f9a8d4" },
  { color: "#a78bfa", glow: "#c4b5fd" },
  { color: "#34d399", glow: "#86efac" },
  { color: "#facc15", glow: "#fde047" },
  { color: "#fb923c", glow: "#fdba74" },
];

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const makeQuestion = (): Question => {
  const t = Math.floor(Math.random() * 9);
  if (t === 0) {
    const a = 6 + Math.floor(Math.random() * 35);
    const b = 4 + Math.floor(Math.random() * 35);
    return { q: `${a} + ${b}`, ans: a + b };
  }
  if (t === 1) {
    const b = 5 + Math.floor(Math.random() * 35);
    const a = b + 10 + Math.floor(Math.random() * 55);
    return { q: `${a} − ${b}`, ans: a - b };
  }
  if (t === 2) {
    const a = 3 + Math.floor(Math.random() * 10);
    const b = 3 + Math.floor(Math.random() * 10);
    return { q: `${a} × ${b}`, ans: a * b };
  }
  if (t === 3) {
    const b = 2 + Math.floor(Math.random() * 9);
    const ans = 3 + Math.floor(Math.random() * 12);
    return { q: `${b * ans} ÷ ${b}`, ans };
  }
  if (t === 4) {
    const a = 2 + Math.floor(Math.random() * 11);
    return { q: `${a}²`, ans: a * a };
  }
  if (t === 5) {
    const roots = [16, 25, 36, 49, 64, 81, 100, 121, 144];
    const n = roots[Math.floor(Math.random() * roots.length)];
    return { q: `√${n}`, ans: Math.round(Math.sqrt(n)) };
  }
  if (t === 6) {
    const a = 2 + Math.floor(Math.random() * 10);
    const b = 2 + Math.floor(Math.random() * 10);
    return { q: `KPK(${a}, ${b})`, ans: (a * b) / gcd(a, b) };
  }
  if (t === 7) {
    const a = 8 + Math.floor(Math.random() * 30);
    const b = 2 + Math.floor(Math.random() * 8);
    return { q: `${a} mod ${b}`, ans: a % b };
  }
  const a = 10 + Math.floor(Math.random() * 35);
  const b = 2 + Math.floor(Math.random() * 9);
  return { q: `${a} + ${b} × 2`, ans: a + b * 2 };
};

const makeWrong = (ans: number, used: Set<number>) => {
  let v = ans;
  let guard = 0;
  while ((v === ans || used.has(v) || v < 0) && guard < 80) {
    const delta = 1 + Math.floor(Math.random() * 16);
    v = ans + (Math.random() < 0.5 ? delta : -delta);
    guard += 1;
  }
  if (v < 0 || used.has(v) || v === ans) v = ans + used.size + 3;
  used.add(v);
  return v;
};

const CoinTrainMathPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  const qRef = useRef<Question>(makeQuestion());
  const laneRef = useRef(1);
  const playerYRef = useRef(LANES[1]);
  const itemsRef = useRef<RailItem[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatsRef = useRef<FloatText[]>([]);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const livesRef = useRef(3);
  const comboRef = useRef(0);
  const levelRef = useRef(1);
  const timerRef = useRef(90);
  const spawnAccRef = useRef(0);
  const speedRef = useRef(185);
  const shakeRef = useRef(0);
  const trackRef = useRef(0);
  const hueRef = useRef(0);
  const [, forceRender] = useState(0);

  const rerender = useCallback(() => forceRender(n => n + 1), []);

  const addFloat = (x: number, y: number, text: string, color: string) => {
    floatsRef.current.push({ x, y, text, alpha: 1, vy: -75, color });
  };

  const burst = (x: number, y: number, color: string, count = 18) => {
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const s = 70 + Math.random() * 210;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        alpha: 1,
        r: 2 + Math.random() * 5,
        color,
      });
    }
  };

  const makeRound = useCallback(() => {
    const q = makeQuestion();
    qRef.current = q;
    const used = new Set<number>([q.ans]);
    const lanes = [0, 1, 2].sort(() => Math.random() - 0.5);
    const correctLane = lanes[0];
    const startX = CW + 90;
    const items: RailItem[] = [];
    const pal = colors[Math.floor(Math.random() * colors.length)];
    items.push({
      id: uid++,
      x: startX,
      y: LANES[correctLane],
      lane: correctLane,
      value: q.ans,
      kind: "coin",
      color: pal.color,
      glow: pal.glow,
      r: 28,
      spin: Math.random() * 10,
      pulse: Math.random() * 10,
    });
    for (let i = 1; i < 3; i++) {
      const wrongPal = colors[(Math.floor(Math.random() * colors.length) + i) % colors.length];
      items.push({
        id: uid++,
        x: startX + Math.random() * 35,
        y: LANES[lanes[i]],
        lane: lanes[i],
        value: makeWrong(q.ans, used),
        kind: "wrong",
        color: wrongPal.color,
        glow: wrongPal.glow,
        r: 26,
        spin: Math.random() * 10,
        pulse: Math.random() * 10,
      });
    }
    if (Math.random() < 0.7) {
      const bombLane = Math.floor(Math.random() * 3);
      items.push({
        id: uid++,
        x: startX + 155 + Math.random() * 110,
        y: LANES[bombLane],
        lane: bombLane,
        value: 0,
        kind: "bomb",
        color: "#ef4444",
        glow: "#fca5a5",
        r: 24,
        spin: Math.random() * 10,
        pulse: Math.random() * 10,
      });
    }
    if (comboRef.current >= 3 && Math.random() < 0.45) {
      const starLane = Math.floor(Math.random() * 3);
      items.push({
        id: uid++,
        x: startX + 240 + Math.random() * 140,
        y: LANES[starLane],
        lane: starLane,
        value: 0,
        kind: "star",
        color: "#fef08a",
        glow: "#fde047",
        r: 22,
        spin: Math.random() * 10,
        pulse: Math.random() * 10,
      });
    }
    itemsRef.current.push(...items);
    rerender();
  }, [rerender]);

  const startGame = useCallback(() => {
    phaseRef.current = "playing";
    laneRef.current = 1;
    playerYRef.current = LANES[1];
    itemsRef.current = [];
    particlesRef.current = [];
    floatsRef.current = [];
    scoreRef.current = 0;
    livesRef.current = 3;
    comboRef.current = 0;
    levelRef.current = 1;
    timerRef.current = 90;
    spawnAccRef.current = 0;
    speedRef.current = 185;
    shakeRef.current = 0;
    qRef.current = makeQuestion();
    makeRound();
    rerender();
    playPopSound();
  }, [makeRound, rerender]);

  const moveLane = useCallback((dir: number) => {
    if (phaseRef.current !== "playing") return;
    laneRef.current = Math.max(0, Math.min(2, laneRef.current + dir));
    playPopSound();
  }, []);

  const chooseLane = useCallback((clientY: number, rect: DOMRect) => {
    if (phaseRef.current === "idle" || phaseRef.current === "over") {
      startGame();
      return;
    }
    const y = (clientY - rect.top) * (CH / rect.height);
    let nearest = 0;
    let best = Infinity;
    LANES.forEach((laneY, i) => {
      const d = Math.abs(y - laneY);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    laneRef.current = nearest;
    playPopSound();
  }, [startGame]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    chooseLane(e.clientY, rect);
  }, [chooseLane]);

  const handleTouch = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0] || e.changedTouches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    chooseLane(touch.clientY, rect);
  }, [chooseLane]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") moveLane(-1);
      if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") moveLane(1);
      if (e.key === " " || e.key === "Enter") {
        if (phaseRef.current !== "playing") startGame();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moveLane, startGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawText = (text: string, x: number, y: number, size: number, color = "#ffffff", align: CanvasTextAlign = "center") => {
      ctx.fillStyle = color;
      ctx.font = `800 ${size}px Orbitron, Inter, sans-serif`;
      ctx.textAlign = align;
      ctx.textBaseline = "middle";
      ctx.shadowBlur = 14;
      ctx.shadowColor = color;
      ctx.fillText(text, x, y);
      ctx.shadowBlur = 0;
    };

    const drawGem = (item: RailItem, t: number) => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.spin + t * 0.002);
      const pulse = Math.sin(t * 0.006 + item.pulse) * 3;
      ctx.shadowBlur = 24;
      ctx.shadowColor = item.glow;
      if (item.kind === "bomb") {
        ctx.fillStyle = "#111827";
        ctx.beginPath();
        ctx.arc(0, 0, item.r + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(8, -10, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fde047";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(5, -22);
        ctx.quadraticCurveTo(18, -36, 25, -18);
        ctx.stroke();
        ctx.restore();
        drawText("BOM", item.x, item.y + 1, 11, "#fecaca");
        return;
      }
      if (item.kind === "star") {
        ctx.fillStyle = item.color;
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const a = -Math.PI / 2 + (Math.PI * 2 * i) / 10;
          const r = i % 2 === 0 ? item.r + pulse : item.r * 0.48;
          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        drawText("+5", item.x, item.y, 14, "#78350f");
        return;
      }
      const grad = ctx.createRadialGradient(-8, -10, 4, 0, 0, item.r + 4);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.28, item.glow);
      grad.addColorStop(1, item.color);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, -item.r - pulse);
      ctx.lineTo(item.r + pulse, -5);
      ctx.lineTo(item.r * 0.65, item.r + pulse);
      ctx.lineTo(-item.r * 0.65, item.r + pulse);
      ctx.lineTo(-item.r - pulse, -5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = item.kind === "coin" ? "#ffffff" : "#111827";
      ctx.lineWidth = item.kind === "coin" ? 3 : 2;
      ctx.stroke();
      ctx.restore();
      drawText(String(item.value), item.x, item.y + 1, item.value > 99 ? 13 : 16, item.kind === "coin" ? "#0f172a" : "#ffffff");
    };

    const drawPlayer = (t: number) => {
      const y = playerYRef.current;
      ctx.save();
      ctx.translate(PLAYER_X, y);
      ctx.shadowBlur = 28;
      ctx.shadowColor = "#22d3ee";
      const grad = ctx.createLinearGradient(-35, -28, 35, 28);
      grad.addColorStop(0, "#22d3ee");
      grad.addColorStop(0.45, "#a78bfa");
      grad.addColorStop(1, "#f472b6");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(42, 0);
      ctx.lineTo(4, -28);
      ctx.lineTo(-34, -18);
      ctx.lineTo(-24, 0);
      ctx.lineTo(-34, 18);
      ctx.lineTo(4, 28);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.beginPath();
      ctx.ellipse(4, -3, 14, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `hsla(${(hueRef.current + 160) % 360}, 100%, 60%, 0.9)`;
      ctx.beginPath();
      ctx.moveTo(-36, -12);
      ctx.lineTo(-62 - Math.sin(t * 0.01) * 10, 0);
      ctx.lineTo(-36, 12);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const loop = (ts: number) => {
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05) || 0;
      lastRef.current = ts;
      hueRef.current = (hueRef.current + dt * 42) % 360;
      trackRef.current += dt * speedRef.current;
      if (shakeRef.current > 0) shakeRef.current = Math.max(0, shakeRef.current - dt * 2.8);
      const phase = phaseRef.current;
      const targetY = LANES[laneRef.current];
      playerYRef.current += (targetY - playerYRef.current) * Math.min(1, dt * 12);

      if (phase === "playing") {
        spawnAccRef.current += dt;
        timerRef.current -= dt;
        levelRef.current = Math.max(1, Math.floor(scoreRef.current / 180) + 1);
        speedRef.current = 175 + levelRef.current * 18;
        if (spawnAccRef.current > Math.max(1.15, 2.35 - levelRef.current * 0.08)) {
          spawnAccRef.current = 0;
          makeRound();
        }
        if (timerRef.current <= 0) {
          timerRef.current = 0;
          phaseRef.current = "over";
          rerender();
        }
        for (const item of itemsRef.current) {
          item.x -= speedRef.current * dt;
          item.spin += dt * (item.kind === "star" ? 4.4 : 2.2);
          const dx = item.x - PLAYER_X;
          const dy = item.y - playerYRef.current;
          if (Math.hypot(dx, dy) < item.r + 25) {
            item.x = -999;
            if (item.kind === "coin") {
              comboRef.current += 1;
              const pts = 25 * comboRef.current + levelRef.current * 5;
              scoreRef.current += pts;
              bestRef.current = Math.max(bestRef.current, scoreRef.current);
              timerRef.current = Math.min(99, timerRef.current + 4);
              addFloat(item.x + 20, item.y - 20, `+${pts} ×${comboRef.current}`, "#bbf7d0");
              burst(PLAYER_X + 24, playerYRef.current, item.glow, 24);
              playPopSound();
            } else if (item.kind === "star") {
              scoreRef.current += 60;
              timerRef.current = Math.min(99, timerRef.current + 5);
              addFloat(PLAYER_X + 24, playerYRef.current - 18, "+BONUS", "#fde047");
              burst(PLAYER_X + 24, playerYRef.current, "#fde047", 30);
              playPopSound();
            } else {
              comboRef.current = 0;
              livesRef.current -= 1;
              shakeRef.current = 0.45;
              addFloat(PLAYER_X + 24, playerYRef.current - 18, item.kind === "bomb" ? "BOM!" : "Salah!", "#fecaca");
              burst(PLAYER_X + 24, playerYRef.current, "#ef4444", 22);
              if (livesRef.current <= 0) {
                livesRef.current = 0;
                phaseRef.current = "over";
                rerender();
              }
            }
          }
        }
        itemsRef.current = itemsRef.current.filter(item => item.x > -80);
      }

      particlesRef.current.forEach(p => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 180 * dt;
        p.alpha -= dt * 1.8;
        p.r *= 0.985;
      });
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);
      floatsRef.current.forEach(f => {
        f.y += f.vy * dt;
        f.alpha -= dt * 1.2;
      });
      floatsRef.current = floatsRef.current.filter(f => f.alpha > 0);

      ctx.save();
      const shake = shakeRef.current * 10;
      ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      const bg = ctx.createLinearGradient(0, 0, 0, CH);
      bg.addColorStop(0, `hsl(${hueRef.current}, 95%, 15%)`);
      bg.addColorStop(0.45, "#111827");
      bg.addColorStop(1, `hsl(${(hueRef.current + 110) % 360}, 90%, 16%)`);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, CW, CH);

      for (let i = 0; i < 55; i++) {
        const x = (i * 83 + trackRef.current * 0.18) % (CW + 80) - 40;
        const y = 40 + ((i * 47) % 500);
        ctx.fillStyle = `hsla(${(hueRef.current + i * 17) % 360}, 100%, 75%, ${0.15 + (i % 4) * 0.06})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.3 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "rgba(15,23,42,0.78)";
      ctx.fillRect(0, 172, CW, 305);
      LANES.forEach((laneY, i) => {
        const grad = ctx.createLinearGradient(0, laneY - 30, CW, laneY + 30);
        grad.addColorStop(0, `hsla(${(hueRef.current + i * 80) % 360}, 100%, 55%, 0.16)`);
        grad.addColorStop(0.5, `hsla(${(hueRef.current + 140 + i * 80) % 360}, 100%, 60%, 0.28)`);
        grad.addColorStop(1, `hsla(${(hueRef.current + 250 + i * 80) % 360}, 100%, 55%, 0.16)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, laneY - 33, CW, 66);
        ctx.strokeStyle = i === laneRef.current ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.22)";
        ctx.lineWidth = i === laneRef.current ? 4 : 2;
        ctx.setLineDash([18, 16]);
        ctx.lineDashOffset = -trackRef.current * 0.22;
        ctx.beginPath();
        ctx.moveTo(0, laneY + 33);
        ctx.lineTo(CW, laneY + 33);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      ctx.fillStyle = "rgba(2,6,23,0.72)";
      ctx.fillRect(0, 0, CW, 150);
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(0, 150, CW, 2);
      drawText("KERETA KOIN MATH", CW / 2, 28, 18, "#67e8f9");
      drawText(`Soal: ${qRef.current.q}`, CW / 2, 70, 28, "#ffffff");
      drawText(`Skor ${scoreRef.current}`, 28, 119, 13, "#bbf7d0", "left");
      drawText(`Nyawa ${"❤".repeat(livesRef.current)}`, CW / 2, 119, 13, "#fecaca");
      drawText(`Waktu ${Math.ceil(timerRef.current)}`, CW - 28, 119, 13, "#fde047", "right");

      itemsRef.current.forEach(item => drawGem(item, ts));
      drawPlayer(ts);

      particlesRef.current.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
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
        ctx.fillStyle = "rgba(2,6,23,0.72)";
        ctx.fillRect(22, 185, CW - 44, 250);
        ctx.strokeStyle = phase === "idle" ? "#67e8f9" : "#f472b6";
        ctx.lineWidth = 3;
        ctx.strokeRect(22, 185, CW - 44, 250);
        drawText(phase === "idle" ? "SIAP BERBURU KOIN?" : "PERMAINAN SELESAI", CW / 2, 230, 22, phase === "idle" ? "#67e8f9" : "#f9a8d4");
        drawText(phase === "idle" ? "Klik / sentuh jalur untuk mulai" : `Skor akhir: ${scoreRef.current}`, CW / 2, 278, 18, "#ffffff");
        drawText("Ambil koin jawaban benar", CW / 2, 322, 15, "#bbf7d0");
        drawText("Hindari bom dan jawaban salah", CW / 2, 352, 15, "#fecaca");
        drawText("↑ ↓ atau sentuh jalur untuk pindah", CW / 2, 392, 14, "#fde047");
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [makeRound, rerender, startGame]);

  return (
    <div className={`relative min-h-screen flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`}>
      {isLight ? <Snowfall /> : <Starfield />}
      <PageNavigation prevPath="/math-game-arena/umum" />
      <div className="relative z-10 w-full max-w-5xl px-4 py-6 flex flex-col items-center">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-950/40 px-4 py-2 text-cyan-100 text-xs font-bold tracking-widest">
            GAME BARU · FULL COLOR · UMUM
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-primary text-glow-cyan mt-3">
            🚆 Kereta Koin Math
          </h1>
          <p className="font-body text-sm text-white/65 mt-2 max-w-xl mx-auto">
            Pindah jalur, ambil koin jawaban benar, kumpulkan combo, dan hindari bom neon!
          </p>
        </div>

        <div className="relative rounded-[28px] p-3 bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-amber-300 shadow-[0_0_45px_rgba(34,211,238,0.35)]">
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            onClick={handleCanvasClick}
            onTouchStart={handleTouch}
            className="w-[min(420px,92vw)] h-auto rounded-[20px] bg-slate-950 cursor-pointer select-none touch-none border-4 border-slate-900"
          />
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            onClick={startGame}
            className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-black hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30"
          >
            Mulai / Ulangi
          </button>
          <button
            onClick={() => { playPopSound(); navigate("/math-game-arena/umum"); }}
            className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition-colors"
          >
            Kembali ke Game Umum
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoinTrainMathPage;
