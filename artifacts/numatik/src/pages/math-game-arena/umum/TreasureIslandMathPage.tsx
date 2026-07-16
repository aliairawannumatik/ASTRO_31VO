import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";

const CW = 440;
const CH = 620;

type Phase = "idle" | "playing" | "over";
type DropKind = "correct" | "wrong" | "bomb" | "bonus";

interface Question {
  q: string;
  ans: number;
}

interface Drop {
  id: number;
  x: number;
  y: number;
  vy: number;
  r: number;
  value: number;
  kind: DropKind;
  emoji: string;
  color: string;
  glow: string;
  rot: number;
  spin: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
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

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const makeQuestion = (): Question => {
  const t = Math.floor(Math.random() * 10);
  if (t === 0) {
    const a = 12 + Math.floor(Math.random() * 70);
    const b = 8 + Math.floor(Math.random() * 60);
    return { q: `${a} + ${b}`, ans: a + b };
  }
  if (t === 1) {
    const b = 8 + Math.floor(Math.random() * 55);
    const a = b + 18 + Math.floor(Math.random() * 80);
    return { q: `${a} − ${b}`, ans: a - b };
  }
  if (t === 2) {
    const a = 3 + Math.floor(Math.random() * 11);
    const b = 3 + Math.floor(Math.random() * 11);
    return { q: `${a} × ${b}`, ans: a * b };
  }
  if (t === 3) {
    const b = 2 + Math.floor(Math.random() * 11);
    const ans = 4 + Math.floor(Math.random() * 14);
    return { q: `${b * ans} ÷ ${b}`, ans };
  }
  if (t === 4) {
    const a = 3 + Math.floor(Math.random() * 12);
    return { q: `${a}²`, ans: a * a };
  }
  if (t === 5) {
    const roots = [25, 36, 49, 64, 81, 100, 121, 144, 169, 196];
    const n = roots[Math.floor(Math.random() * roots.length)];
    return { q: `√${n}`, ans: Math.round(Math.sqrt(n)) };
  }
  if (t === 6) {
    const a = 3 + Math.floor(Math.random() * 13);
    const b = 3 + Math.floor(Math.random() * 13);
    return { q: `FPB(${a}, ${b})`, ans: gcd(a, b) };
  }
  if (t === 7) {
    const a = 2 + Math.floor(Math.random() * 10);
    const b = 2 + Math.floor(Math.random() * 10);
    return { q: `KPK(${a}, ${b})`, ans: (a * b) / gcd(a, b) };
  }
  if (t === 8) {
    const a = 14 + Math.floor(Math.random() * 40);
    return { q: `${a} + 3 × 4`, ans: a + 12 };
  }
  const a = 30 + Math.floor(Math.random() * 50);
  const b = 2 + Math.floor(Math.random() * 9);
  return { q: `${a} mod ${b}`, ans: a % b };
};

const wrongValue = (ans: number, used: Set<number>) => {
  let value = ans;
  let guard = 0;
  while ((value === ans || used.has(value) || value < 0) && guard < 80) {
    const delta = 1 + Math.floor(Math.random() * 22);
    value = ans + (Math.random() < 0.5 ? delta : -delta);
    guard += 1;
  }
  if (value < 0 || used.has(value) || value === ans) value = ans + used.size + 7;
  used.add(value);
  return value;
};

const TreasureIslandMathPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const keysRef = useRef({ left: false, right: false });
  const dropsRef = useRef<Drop[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatsRef = useRef<FloatText[]>([]);
  const shipXRef = useRef(CW / 2);
  const targetXRef = useRef(CW / 2);
  const phaseRef = useRef<Phase>("idle");
  const guruQuiz = useGuruQuiz(phaseRef);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const comboRef = useRef(0);
  const levelRef = useRef(1);
  const timeRef = useRef(75);
  const spawnRef = useRef(0);
  const questionRef = useRef<Question>(makeQuestion());
  const [, setPulse] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");

  const syncPhase = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  const addFloat = (x: number, y: number, text: string, color: string) => {
    floatsRef.current.push({ x, y, text, color, alpha: 1, vy: -0.8 });
  };

  const burst = (x: number, y: number, colors: string[], count = 18) => {
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 2 + Math.random() * 5,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  };

  const spawnDrop = useCallback(() => {
    const q = questionRef.current;
    const used = new Set<number>([q.ans]);
    const roll = Math.random();
    let kind: DropKind = "wrong";
    if (roll < 0.34) kind = "correct";
    else if (roll < 0.5) kind = "bonus";
    else if (roll > 0.82) kind = "bomb";
    const palettes = [
      { emoji: "💎", color: "#22d3ee", glow: "#a5f3fc" },
      { emoji: "🪙", color: "#facc15", glow: "#fef08a" },
      { emoji: "🏆", color: "#fb923c", glow: "#fed7aa" },
      { emoji: "🧭", color: "#a78bfa", glow: "#ddd6fe" },
      { emoji: "🌟", color: "#fb7185", glow: "#fecdd3" },
    ];
    const p = palettes[Math.floor(Math.random() * palettes.length)];
    const value = kind === "correct" ? q.ans : kind === "bomb" ? 0 : kind === "bonus" ? q.ans : wrongValue(q.ans, used);
    dropsRef.current.push({
      id: uid++,
      x: 38 + Math.random() * (CW - 76),
      y: -40,
      vy: 1.7 + levelRef.current * 0.28 + Math.random() * 1.4,
      r: kind === "bomb" ? 24 : 26,
      value,
      kind,
      emoji: kind === "bomb" ? "💣" : kind === "bonus" ? "⭐" : p.emoji,
      color: kind === "bomb" ? "#ef4444" : kind === "bonus" ? "#f0f9ff" : p.color,
      glow: kind === "bomb" ? "#fecaca" : kind === "bonus" ? "#fde047" : p.glow,
      rot: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.08,
    });
  }, []);

  const startGame = useCallback(() => {
    playPopSound();
    dropsRef.current = [];
    particlesRef.current = [];
    floatsRef.current = [];
    shipXRef.current = CW / 2;
    targetXRef.current = CW / 2;
    scoreRef.current = 0;
    livesRef.current = 3;
    comboRef.current = 0;
    levelRef.current = 1;
    timeRef.current = 75;
    spawnRef.current = 0;
    questionRef.current = makeQuestion();
    syncPhase("playing");
    setPulse(v => v + 1);
  }, []);

  const finishGame = useCallback(() => {
    if (phaseRef.current !== "playing") return;
    syncPhase("over");
    burst(shipXRef.current, CH - 92, ["#67e8f9", "#f9a8d4", "#fde047", "#86efac"], 44);
    setPulse(v => v + 1);
  }, []);

  const handleCatch = useCallback((drop: Drop) => {
    if (drop.kind === "correct" || drop.kind === "bonus") {
      comboRef.current += 1;
      const bonus = drop.kind === "bonus" ? 45 : 25;
      scoreRef.current += bonus + comboRef.current * 8 + levelRef.current * 5;
      if (drop.kind === "bonus") timeRef.current = Math.min(99, timeRef.current + 4);
      addFloat(drop.x, drop.y, drop.kind === "bonus" ? "+BONUS!" : `+${bonus}`, "#bbf7d0");
      burst(drop.x, drop.y, ["#22d3ee", "#a7f3d0", "#fde047", "#f9a8d4"], drop.kind === "bonus" ? 30 : 20);
      if (comboRef.current % 4 === 0) {
        levelRef.current += 1;
        addFloat(CW / 2, 130, `LEVEL ${levelRef.current}!`, "#fde047");
      }
      questionRef.current = makeQuestion();
    } else {
      comboRef.current = 0;
      livesRef.current -= drop.kind === "bomb" ? 2 : 1;
      addFloat(drop.x, drop.y, drop.kind === "bomb" ? "BOOM!" : "SALAH!", "#fecaca");
      burst(drop.x, drop.y, ["#ef4444", "#fb7185", "#f97316", "#fde047"], 28);
      if (livesRef.current <= 0) finishGame();
    }
    setPulse(v => v + 1);
  }, [finishGame]);

  const moveShipTo = (clientX: number, rect: DOMRect) => {
    const x = ((clientX - rect.left) / rect.width) * CW;
    targetXRef.current = Math.max(36, Math.min(CW - 36, x));
    if (phaseRef.current !== "playing") startGame();
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") keysRef.current.left = true;
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") keysRef.current.right = true;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (phaseRef.current !== "playing") startGame();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") keysRef.current.left = false;
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") keysRef.current.right = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [startGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let last = performance.now();

    const drawText = (text: string, x: number, y: number, size: number, color = "#fff", align: CanvasTextAlign = "center") => {
      ctx.save();
      ctx.font = `900 ${size}px Inter, system-ui, sans-serif`;
      ctx.textAlign = align;
      ctx.textBaseline = "middle";
      ctx.lineWidth = Math.max(3, size / 5);
      ctx.strokeStyle = "rgba(2,6,23,0.85)";
      ctx.strokeText(text, x, y);
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      ctx.restore();
    };

    const drawRounded = (x: number, y: number, w: number, h: number, r: number, fill: string, stroke?: string) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fillStyle = fill;
      ctx.fill();
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(32, now - last) / 16.67;
      last = now;
      if (guruQuiz.isPausedRef.current) { rafRef.current = requestAnimationFrame(loop); return; }
      const sky = ctx.createLinearGradient(0, 0, 0, CH);
      sky.addColorStop(0, "#0f172a");
      sky.addColorStop(0.24, "#312e81");
      sky.addColorStop(0.54, "#0891b2");
      sky.addColorStop(1, "#06b6d4");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, CW, CH);

      for (let i = 0; i < 70; i += 1) {
        const x = (i * 73 + now * 0.008) % CW;
        const y = (i * 41) % 310;
        ctx.fillStyle = i % 3 === 0 ? "rgba(253,224,71,0.9)" : "rgba(255,255,255,0.55)";
        ctx.beginPath();
        ctx.arc(x, y, i % 3 === 0 ? 1.6 : 1, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#fef3c7";
      ctx.beginPath();
      ctx.arc(65, 84, 31, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fde68a";
      ctx.beginPath();
      ctx.arc(65, 84, 20, 0, Math.PI * 2);
      ctx.fill();

      const sea = ctx.createLinearGradient(0, 270, 0, CH);
      sea.addColorStop(0, "rgba(34,211,238,0.28)");
      sea.addColorStop(0.45, "rgba(14,165,233,0.72)");
      sea.addColorStop(1, "#1d4ed8");
      ctx.fillStyle = sea;
      ctx.fillRect(0, 260, CW, CH - 260);

      for (let i = 0; i < 9; i += 1) {
        ctx.strokeStyle = i % 2 ? "rgba(186,230,253,0.65)" : "rgba(255,255,255,0.45)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = -20; x <= CW + 20; x += 24) {
          const y = 292 + i * 34 + Math.sin((x + now * 0.055 + i * 60) / 30) * 7;
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.ellipse(365, 302, 88, 36, -0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.ellipse(344, 282, 44, 24, -0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#16a34a";
      ctx.fillRect(378, 235, 8, 52);
      ctx.fillStyle = "#22c55e";
      for (let i = 0; i < 5; i += 1) {
        ctx.beginPath();
        ctx.ellipse(382, 236, 12, 38, (i - 2) * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }

      if (phaseRef.current === "playing") {
        timeRef.current -= dt / 60;
        spawnRef.current -= dt;
        if (spawnRef.current <= 0) {
          spawnDrop();
          spawnRef.current = Math.max(17, 48 - levelRef.current * 3 - Math.random() * 10);
        }
        if (keysRef.current.left) targetXRef.current = Math.max(36, targetXRef.current - 7.2 * dt);
        if (keysRef.current.right) targetXRef.current = Math.min(CW - 36, targetXRef.current + 7.2 * dt);
        shipXRef.current += (targetXRef.current - shipXRef.current) * 0.18;
        if (timeRef.current <= 0) finishGame();
      }

      const shipY = CH - 86;
      dropsRef.current = dropsRef.current
        .map(drop => ({ ...drop, y: drop.y + drop.vy * dt, rot: drop.rot + drop.spin * dt }))
        .filter(drop => {
          const caught = phaseRef.current === "playing" && Math.abs(drop.x - shipXRef.current) < 45 && Math.abs(drop.y - shipY) < 38;
          if (caught) {
            handleCatch(drop);
            return false;
          }
          if (drop.y > CH + 60) return false;
          return true;
        });

      dropsRef.current.forEach(drop => {
        ctx.save();
        ctx.translate(drop.x, drop.y);
        ctx.rotate(drop.rot);
        ctx.shadowColor = drop.glow;
        ctx.shadowBlur = 18;
        const g = ctx.createRadialGradient(0, 0, 4, 0, 0, drop.r + 9);
        g.addColorStop(0, drop.glow);
        g.addColorStop(0.55, drop.color);
        g.addColorStop(1, "rgba(15,23,42,0.9)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, drop.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.font = "24px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(drop.emoji, 0, -2);
        ctx.restore();
        if (drop.kind !== "bomb") {
          drawRounded(drop.x - 26, drop.y + 23, 52, 25, 11, "rgba(15,23,42,0.82)", drop.kind === "correct" ? "#86efac" : "#f9a8d4");
          drawText(String(drop.value), drop.x, drop.y + 36, 15, "#ffffff");
        }
      });

      particlesRef.current = particlesRef.current
        .map(p => ({ ...p, x: p.x + p.vx * dt, y: p.y + p.vy * dt, vy: p.vy + 0.09 * dt, alpha: p.alpha - 0.025 * dt }))
        .filter(p => p.alpha > 0);
      particlesRef.current.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      floatsRef.current = floatsRef.current
        .map(f => ({ ...f, y: f.y + f.vy * dt, alpha: f.alpha - 0.016 * dt }))
        .filter(f => f.alpha > 0);
      floatsRef.current.forEach(f => {
        ctx.globalAlpha = f.alpha;
        drawText(f.text, f.x, f.y, 19, f.color);
        ctx.globalAlpha = 1;
      });

      ctx.save();
      ctx.translate(shipXRef.current, shipY);
      ctx.shadowColor = "#67e8f9";
      ctx.shadowBlur = 22;
      ctx.fillStyle = "#7c2d12";
      ctx.beginPath();
      ctx.moveTo(-52, 9);
      ctx.quadraticCurveTo(0, 45, 52, 9);
      ctx.lineTo(37, 31);
      ctx.lineTo(-37, 31);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#f97316";
      ctx.fillRect(-8, -50, 7, 62);
      ctx.fillStyle = "#fde047";
      ctx.beginPath();
      ctx.moveTo(0, -48);
      ctx.lineTo(48, -17);
      ctx.lineTo(0, -6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#fb7185";
      ctx.beginPath();
      ctx.moveTo(-3, -42);
      ctx.lineTo(-42, -16);
      ctx.lineTo(-3, -7);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#fef3c7";
      ctx.beginPath();
      ctx.arc(0, 9, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0f172a";
      ctx.font = "18px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🦜", 0, 8);
      ctx.restore();

      drawRounded(12, 12, CW - 24, 103, 18, "rgba(15,23,42,0.72)", "rgba(125,211,252,0.55)");
      drawText(`SOAL: ${questionRef.current.q}`, CW / 2, 39, 24, "#fde047");
      drawText(`Skor ${scoreRef.current}`, 58, 78, 15, "#bbf7d0");
      drawText(`Nyawa ${"❤️".repeat(Math.max(0, livesRef.current))}`, 164, 78, 15, "#fecaca");
      drawText(`Combo ×${comboRef.current}`, 285, 78, 15, "#f9a8d4");
      drawText(`⏱ ${Math.ceil(Math.max(0, timeRef.current))}`, 382, 78, 15, "#bfdbfe");

      if (phaseRef.current === "idle" || phaseRef.current === "over") {
        drawRounded(30, 188, CW - 60, 255, 25, "rgba(2,6,23,0.84)", phaseRef.current === "idle" ? "#fde047" : "#67e8f9");
        drawText(phaseRef.current === "idle" ? "BERBURU HARTA?" : "PETUALANGAN SELESAI", CW / 2, 229, 22, phaseRef.current === "idle" ? "#fde047" : "#67e8f9");
        drawText(phaseRef.current === "idle" ? "Klik / sentuh untuk mulai" : `Skor akhir: ${scoreRef.current}`, CW / 2, 276, 18, "#ffffff");
        drawText("Gerakkan kapal ke peti jawaban benar", CW / 2, 322, 15, "#bbf7d0");
        drawText("Hindari bom dan jawaban salah", CW / 2, 352, 15, "#fecaca");
        drawText("Bintang memberi waktu bonus!", CW / 2, 386, 15, "#fde047");
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [finishGame, handleCatch, spawnDrop, startGame]);

  return (
    <div className={`relative flex flex-col overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}
      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        <div className="shrink-0 px-3 pt-5 pb-1 flex items-center justify-between">
          <button
            onClick={() => { playPopSound(); navigate('/ruang-untuk-guru/numatik-game'); }}
            className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all text-sm"
            title="Menu Utama"
          >
            🏠
          </button>
          <span className="font-display text-base font-bold text-primary text-glow-cyan">🏝️ Pulau Harta Math</span>
          <button
            onClick={() => { playPopSound(); navigate(-1); }}
            className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all font-bold"
            title="Keluar"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center px-2">
          <div className="relative rounded-[30px] p-2 bg-gradient-to-br from-yellow-300 via-cyan-300 to-fuchsia-400 shadow-[0_0_50px_rgba(34,211,238,0.35)]">
            <canvas
              ref={canvasRef}
              width={CW}
              height={CH}
              onMouseDown={e => moveShipTo(e.clientX, e.currentTarget.getBoundingClientRect())}
              onMouseMove={e => {
                if (e.buttons === 1) moveShipTo(e.clientX, e.currentTarget.getBoundingClientRect());
              }}
              onTouchStart={e => {
                e.preventDefault();
                const t = e.touches[0];
                moveShipTo(t.clientX, e.currentTarget.getBoundingClientRect());
              }}
              onTouchMove={e => {
                e.preventDefault();
                const t = e.touches[0];
                moveShipTo(t.clientX, e.currentTarget.getBoundingClientRect());
              }}
              className="rounded-[22px] bg-slate-950 cursor-pointer select-none touch-none border-4 border-slate-900"
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

export default TreasureIslandMathPage;