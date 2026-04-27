import { useCallback, useEffect, useRef, useState } from "react";
import { Gamepad2, Heart, RotateCcw, Trophy } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const CW = 360;
const CH = 480;
const TANK_W = 56;
const TANK_H = 30;
const TANK_Y = CH - TANK_H - 10;
const TANK_SPEED = 320;
const BULLET_SPEED = 520;
const BULLET_R = 4;

type ShapeName =
  | "Segitiga"
  | "Persegi"
  | "Persegi Panjang"
  | "Jajar Genjang"
  | "Belah Ketupat"
  | "Layang-Layang"
  | "Trapesium";

interface FallingShape {
  id: number;
  x: number;
  y: number;
  vy: number;
  rot: number;
  rotSpd: number;
  name: ShapeName;
  color: string;
  hit: boolean;
  hitAnim: number;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

interface Question {
  prompt: string;
  target: ShapeName;
}

const SHAPE_COLORS: Record<ShapeName, string> = {
  Segitiga: "#22d3ee",
  Persegi: "#facc15",
  "Persegi Panjang": "#a78bfa",
  "Jajar Genjang": "#fb7185",
  "Belah Ketupat": "#34d399",
  "Layang-Layang": "#fb923c",
  Trapesium: "#f472b6",
};

const ALL_SHAPES: ShapeName[] = [
  "Segitiga",
  "Persegi",
  "Persegi Panjang",
  "Jajar Genjang",
  "Belah Ketupat",
  "Layang-Layang",
  "Trapesium",
];

const QUESTION_BANK: Question[] = [
  { prompt: "Tembak: 3 sisi & 3 sudut", target: "Segitiga" },
  { prompt: "Tembak: 4 sisi sama & 4 sudut siku-siku", target: "Persegi" },
  { prompt: "Tembak: sisi berhadapan sama, semua sudut 90°", target: "Persegi Panjang" },
  { prompt: "Tembak: 2 pasang sisi sejajar, sudut TIDAK 90°", target: "Jajar Genjang" },
  { prompt: "Tembak: 4 sisi sama panjang, sudut TIDAK siku-siku", target: "Belah Ketupat" },
  { prompt: "Tembak: 2 pasang sisi sama berdekatan", target: "Layang-Layang" },
  { prompt: "Tembak: hanya 1 pasang sisi sejajar", target: "Trapesium" },
  { prompt: "Tembak: bangun dengan jumlah sudut dalam 180°", target: "Segitiga" },
  { prompt: "Tembak: diagonalnya sama panjang & saling membagi 2", target: "Persegi" },
  { prompt: "Tembak: K = 2(p + l), L = p × l", target: "Persegi Panjang" },
];

let _id = 0;
type Phase = "idle" | "playing" | "dead";

const drawShape = (ctx: CanvasRenderingContext2D, name: ShapeName, size: number) => {
  ctx.save();
  switch (name) {
    case "Segitiga":
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.95, size * 0.7);
      ctx.lineTo(-size * 0.95, size * 0.7);
      ctx.closePath();
      break;
    case "Persegi":
      ctx.beginPath();
      ctx.rect(-size, -size, size * 2, size * 2);
      break;
    case "Persegi Panjang":
      ctx.beginPath();
      ctx.rect(-size * 1.3, -size * 0.7, size * 2.6, size * 1.4);
      break;
    case "Jajar Genjang":
      ctx.beginPath();
      ctx.moveTo(-size * 1.1, size * 0.7);
      ctx.lineTo(size * 0.9, size * 0.7);
      ctx.lineTo(size * 1.3, -size * 0.7);
      ctx.lineTo(-size * 0.7, -size * 0.7);
      ctx.closePath();
      break;
    case "Belah Ketupat":
      ctx.beginPath();
      ctx.moveTo(0, -size * 1.1);
      ctx.lineTo(size, 0);
      ctx.lineTo(0, size * 1.1);
      ctx.lineTo(-size, 0);
      ctx.closePath();
      break;
    case "Layang-Layang":
      ctx.beginPath();
      ctx.moveTo(0, -size * 1.2);
      ctx.lineTo(size * 0.85, 0);
      ctx.lineTo(0, size * 1);
      ctx.lineTo(-size * 0.85, 0);
      ctx.closePath();
      break;
    case "Trapesium":
      ctx.beginPath();
      ctx.moveTo(-size * 1.2, size * 0.7);
      ctx.lineTo(size * 1.2, size * 0.7);
      ctx.lineTo(size * 0.7, -size * 0.7);
      ctx.lineTo(-size * 0.7, -size * 0.7);
      ctx.closePath();
      break;
  }
  ctx.restore();
};

const TankShotBangunGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  const tankXRef = useRef(CW / 2 - TANK_W / 2);
  const shapesRef = useRef<FallingShape[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const keysRef = useRef<Record<string, boolean>>({});
  const touchXRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const nextSpawnRef = useRef(700);
  const shootCoolRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const bestRef = useRef(0);
  const qRef = useRef<Question>(QUESTION_BANK[0]);

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [best, setBest] = useState(0);
  const [questionPrompt, setQuestionPrompt] = useState(QUESTION_BANK[0].prompt);
  const [feedback, setFeedback] = useState<{ txt: string; good: boolean } | null>(null);
  const fbTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFb = useCallback((txt: string, good: boolean) => {
    setFeedback({ txt, good });
    if (fbTimerRef.current) clearTimeout(fbTimerRef.current);
    fbTimerRef.current = setTimeout(() => setFeedback(null), 1100);
  }, []);

  const newQuestion = useCallback(() => {
    const q = QUESTION_BANK[Math.floor(Math.random() * QUESTION_BANK.length)];
    qRef.current = q;
    setQuestionPrompt(q.prompt);
  }, []);

  const spawnShape = useCallback(() => {
    const target = qRef.current.target;
    const others = ALL_SHAPES.filter((s) => s !== target);
    const includeCorrect = Math.random() < 0.55 || shapesRef.current.every((s) => s.name !== target);
    const name: ShapeName = includeCorrect ? target : others[Math.floor(Math.random() * others.length)];
    const x = 30 + Math.random() * (CW - 60);
    const baseVy = 50 + elapsedRef.current * 2.6;
    shapesRef.current.push({
      id: _id++,
      x,
      y: -28,
      vy: baseVy + Math.random() * 25,
      rot: 0,
      rotSpd: (Math.random() - 0.5) * 1.2,
      name,
      color: SHAPE_COLORS[name],
      hit: false,
      hitAnim: 0,
    });
    nextSpawnRef.current = Math.max(550, 1400 - elapsedRef.current * 12);
  }, []);

  const fire = useCallback(() => {
    if (shootCoolRef.current > 0) return;
    bulletsRef.current.push({ id: _id++, x: tankXRef.current + TANK_W / 2, y: TANK_Y - 4 });
    shootCoolRef.current = 0.28;
  }, []);

  const addParticles = useCallback((x: number, y: number, color: string, n: number) => {
    for (let i = 0; i < n; i++) {
      const ang = (Math.PI * 2 * i) / n + Math.random() * 0.5;
      const spd = 60 + Math.random() * 140;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        alpha: 1,
        color,
      });
    }
  }, []);

  const reset = useCallback(() => {
    tankXRef.current = CW / 2 - TANK_W / 2;
    shapesRef.current = [];
    bulletsRef.current = [];
    particlesRef.current = [];
    elapsedRef.current = 0;
    nextSpawnRef.current = 600;
    shootCoolRef.current = 0;
    scoreRef.current = 0;
    livesRef.current = 3;
    setScore(0);
    setLives(3);
    setFeedback(null);
    newQuestion();
  }, [newQuestion]);

  const loop = useCallback(
    (ts: number) => {
      const dt = Math.min((ts - (lastTsRef.current || ts)) / 1000, 0.05);
      lastTsRef.current = ts;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const bg = ctx.createLinearGradient(0, 0, 0, CH);
      bg.addColorStop(0, "#0b1437");
      bg.addColorStop(1, "#1c0934");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, CW, CH);

      const ph = phaseRef.current;
      if (ph === "playing") {
        elapsedRef.current += dt;

        if (keysRef.current["ArrowLeft"] || keysRef.current["a"] || keysRef.current["A"]) {
          tankXRef.current = Math.max(0, tankXRef.current - TANK_SPEED * dt);
        }
        if (keysRef.current["ArrowRight"] || keysRef.current["d"] || keysRef.current["D"]) {
          tankXRef.current = Math.min(CW - TANK_W, tankXRef.current + TANK_SPEED * dt);
        }
        if (touchXRef.current !== null) {
          const target = touchXRef.current - TANK_W / 2;
          tankXRef.current += (target - tankXRef.current) * Math.min(1, 14 * dt);
          tankXRef.current = Math.max(0, Math.min(CW - TANK_W, tankXRef.current));
        }

        if (shootCoolRef.current > 0) shootCoolRef.current -= dt;
        if (keysRef.current[" "] && shootCoolRef.current <= 0) fire();

        nextSpawnRef.current -= dt * 1000;
        if (nextSpawnRef.current <= 0 && shapesRef.current.length < 6) spawnShape();

        bulletsRef.current.forEach((b) => (b.y -= BULLET_SPEED * dt));
        bulletsRef.current = bulletsRef.current.filter((b) => b.y > -20);

        bulletsRef.current.forEach((b) => {
          shapesRef.current.forEach((s) => {
            if (s.hit) return;
            const dx = b.x - s.x;
            const dy = b.y - s.y;
            if (Math.sqrt(dx * dx + dy * dy) < 26) {
              b.y = -999;
              s.hit = true;
              s.hitAnim = 0;
              if (s.name === qRef.current.target) {
                const pts = 15 + Math.floor(elapsedRef.current);
                scoreRef.current += pts;
                setScore(scoreRef.current);
                addParticles(s.x, s.y, "#fde047", 16);
                showFb("🎯 TEPAT!", true);
                newQuestion();
              } else {
                scoreRef.current = Math.max(0, scoreRef.current - 4);
                setScore(scoreRef.current);
                addParticles(s.x, s.y, "#fb7185", 10);
                showFb(`❌ Bukan ${s.name}!`, false);
              }
            }
          });
        });

        shapesRef.current.forEach((s) => {
          if (!s.hit) {
            s.y += s.vy * dt;
            s.rot += s.rotSpd * dt;
            if (s.y > CH + 30) {
              s.hit = true;
              if (s.name === qRef.current.target) {
                livesRef.current = Math.max(0, livesRef.current - 1);
                setLives(livesRef.current);
                showFb(`💔 Lolos! Targetnya ${qRef.current.target}`, false);
                if (livesRef.current <= 0) {
                  phaseRef.current = "dead";
                  setPhase("dead");
                  if (scoreRef.current > bestRef.current) {
                    bestRef.current = scoreRef.current;
                    setBest(bestRef.current);
                  }
                } else {
                  newQuestion();
                }
              }
            }
          } else {
            s.hitAnim += dt * 3.5;
          }
        });
        shapesRef.current = shapesRef.current.filter((s) => !s.hit || s.hitAnim < 1);

        particlesRef.current.forEach((p) => {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += 110 * dt;
          p.alpha -= dt * 2;
        });
        particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0);
      }

      shapesRef.current.forEach((s) => {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        const scale = s.hit ? 1 + s.hitAnim * 0.4 : 1;
        ctx.scale(scale, scale);
        ctx.globalAlpha = s.hit ? Math.max(0, 1 - s.hitAnim) : 1;
        drawShape(ctx, s.name, 22);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#0b1437";
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 9px ui-sans-serif,system-ui";
        ctx.textAlign = "center";
        ctx.globalAlpha = s.hit ? Math.max(0, 1 - s.hitAnim) : 1;
        ctx.fillText(s.name, s.x, s.y + 38);
        ctx.globalAlpha = 1;
      });

      bulletsRef.current.forEach((b) => {
        ctx.fillStyle = "#fde047";
        ctx.shadowColor = "#fde047";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(b.x, b.y, BULLET_R, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      particlesRef.current.forEach((p) => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#22c55e";
      ctx.fillRect(tankXRef.current, TANK_Y, TANK_W, TANK_H);
      ctx.fillStyle = "#16a34a";
      ctx.fillRect(tankXRef.current - 4, TANK_Y + TANK_H - 8, TANK_W + 8, 8);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(tankXRef.current + TANK_W / 2 - 3, TANK_Y - 12, 6, 14);
      ctx.fillStyle = "#15803d";
      ctx.beginPath();
      ctx.arc(tankXRef.current + TANK_W / 2, TANK_Y + 4, 9, 0, Math.PI * 2);
      ctx.fill();

      rafRef.current = requestAnimationFrame(loop);
    },
    [addParticles, fire, newQuestion, showFb, spawnShape],
  );

  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      keysRef.current[e.key] = true;
    };
    const up = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", dn);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    reset();
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop, reset]);

  useEffect(
    () => () => {
      if (fbTimerRef.current) clearTimeout(fbTimerRef.current);
    },
    [],
  );

  const start = () => {
    playPopSound();
    reset();
    phaseRef.current = "playing";
    setPhase("playing");
    lastTsRef.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    touchXRef.current = (e.touches[0].clientX - rect.left) * (CW / rect.width);
  };
  const onTouchEnd = () => {
    touchXRef.current = null;
  };

  return (
    <section className="bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-violet-500/15 border border-emerald-200/30 rounded-3xl p-5 md:p-7 mb-6 backdrop-blur">
      <div className="flex items-start gap-3 mb-4">
        <Gamepad2 className="w-8 h-8 text-emerald-200 shrink-0" />
        <div>
          <h2 className="font-display text-2xl font-bold text-emerald-100">B. Game: Tank Shot Bangun Datar</h2>
          <p className="text-sm text-white/70 font-body mt-1">
            Gerakkan tank kiri/kanan (panah ←→ atau geser layar), tembak ke atas (spasi) untuk menghancurkan bangun yang sesuai
            perintah. Hancurkan yang salah → skor turun. Bangun target lolos → nyawa berkurang.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[auto,1fr] gap-5 items-start">
        <div className="relative mx-auto">
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            className="rounded-2xl border-2 border-emerald-300/40 shadow-2xl bg-black touch-none"
            style={{ width: "min(100%, 360px)", aspectRatio: `${CW}/${CH}` }}
            onTouchStart={onTouchMove}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-2 pointer-events-none">
            <div className="bg-black/60 rounded-full px-3 py-1 text-[11px] font-bold text-yellow-300">
              SKOR {score}
            </div>
            <div className="bg-black/60 rounded-full px-3 py-1 text-[11px] font-bold text-emerald-300">
              REKOR {best}
            </div>
            <div className="bg-black/60 rounded-full px-3 py-1 text-[11px] font-bold text-rose-300 flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-3 h-3 ${i < lives ? "fill-rose-400 text-rose-400" : "text-rose-400/30"}`}
                />
              ))}
            </div>
          </div>
          <div className="absolute top-12 left-2 right-2 pointer-events-none">
            <div className="bg-black/70 border border-yellow-300/40 rounded-xl px-3 py-2 text-center text-yellow-100 text-xs font-bold leading-snug">
              {questionPrompt}
            </div>
          </div>
          {feedback && (
            <div
              className={`absolute bottom-16 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-sm font-bold pointer-events-none ${
                feedback.good ? "bg-emerald-500/80 text-white" : "bg-rose-500/80 text-white"
              }`}
            >
              {feedback.txt}
            </div>
          )}
          {phase !== "playing" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 rounded-2xl">
              {phase === "dead" && (
                <>
                  <Trophy className="w-12 h-12 text-yellow-300" />
                  <p className="text-2xl font-display font-bold text-white">Skor: {score}</p>
                  <p className="text-xs text-white/70">Rekor: {best}</p>
                </>
              )}
              <button
                onClick={start}
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-6 py-3 transition-transform hover:scale-105"
              >
                {phase === "dead" ? <RotateCcw className="w-5 h-5" /> : <Gamepad2 className="w-5 h-5" />}
                {phase === "dead" ? "MAIN LAGI" : "MULAI MAIN"}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3 text-sm text-white/80">
          <div className="rounded-xl bg-black/30 border border-white/10 p-4">
            <p className="font-bold text-cyan-200 mb-2">🎮 Cara Bermain</p>
            <ul className="space-y-1.5 list-disc pl-5 text-white/75">
              <li>
                Gerakkan tank: <kbd className="bg-white/10 px-1.5 rounded">←</kbd>{" "}
                <kbd className="bg-white/10 px-1.5 rounded">→</kbd> (atau geser jari di kanvas)
              </li>
              <li>
                Tembak ke atas: <kbd className="bg-white/10 px-1.5 rounded">SPASI</kbd> (di mobile, tekan tombol di bawah)
              </li>
              <li>Baca perintah di kanvas, hancurkan bangun yang sesuai!</li>
            </ul>
          </div>
          <div className="rounded-xl bg-black/30 border border-white/10 p-4">
            <p className="font-bold text-yellow-200 mb-2">🏆 Skor</p>
            <ul className="space-y-1 list-disc pl-5 text-white/75">
              <li>Tembak benar: +15 (atau lebih sesuai waktu)</li>
              <li>Tembak salah: −4</li>
              <li>Target lolos: nyawa −1 dari 3</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={fire}
            className="w-full sm:hidden rounded-full bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-bold py-3 transition-transform active:scale-95"
          >
            🔫 TEMBAK
          </button>
        </div>
      </div>
    </section>
  );
};

export default TankShotBangunGame;
