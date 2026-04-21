import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";

const CW = 460;
const CH = 640;

type Phase = "idle" | "playing" | "over";
type EnemyType = "plane" | "sub";

interface Enemy {
  id: number;
  type: EnemyType;
  x: number;
  y: number;
  vx: number;
  hp: number;
  value: number;
  color: string;
  glow: string;
  dir: number;
}

interface Torpedo {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  fromEnemy?: boolean;
}

interface Bomb {
  id: number;
  x: number;
  y: number;
  vy: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  alpha: number;
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

const makeTarget = () => 20 + Math.floor(Math.random() * 80);

const SubmarineBattleMathPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const phaseRef = useRef<Phase>("idle");
  const guruQuiz = useGuruQuiz(phaseRef);
  const subXRef = useRef(CW / 2);
  const targetXRef = useRef(CW / 2);
  const keysRef = useRef({ left: false, right: false, up: false, down: false, shoot: false, torpedo: false });
  const enemiesRef = useRef<Enemy[]>([]);
  const shotsRef = useRef<Torpedo[]>([]);
  const bombsRef = useRef<Bomb[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatsRef = useRef<FloatText[]>([]);
  const scoreRef = useRef(0);
  const livesRef = useRef(4);
  const comboRef = useRef(0);
  const levelRef = useRef(1);
  const targetRef = useRef(makeTarget());
  const spawnRef = useRef(0);
  const planeBombRef = useRef(0);
  const shootCooldownRef = useRef(0);
  const torpedoCooldownRef = useRef(0);
  const [, setPulse] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");

  const syncPhase = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  const addFloat = (x: number, y: number, text: string, color: string) => {
    floatsRef.current.push({ x, y, text, color, alpha: 1, vy: -0.9 });
  };

  const burst = (x: number, y: number, colors: string[], count = 24) => {
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 5.8;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 2 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
      });
    }
  };

  const spawnEnemy = useCallback(() => {
    const isPlane = Math.random() < 0.55;
    const dir = Math.random() < 0.5 ? 1 : -1;
    const value = Math.random() < 0.45 ? targetRef.current : makeTarget();
    const planeColors = ["#f97316", "#facc15", "#fb7185", "#a855f7", "#38bdf8"];
    const subColors = ["#22c55e", "#06b6d4", "#8b5cf6", "#f43f5e", "#eab308"];
    const color = isPlane
      ? planeColors[Math.floor(Math.random() * planeColors.length)]
      : subColors[Math.floor(Math.random() * subColors.length)];
    enemiesRef.current.push({
      id: uid++,
      type: isPlane ? "plane" : "sub",
      x: dir > 0 ? -58 : CW + 58,
      y: isPlane ? 70 + Math.random() * 90 : 330 + Math.random() * 150,
      vx: dir * (1.4 + levelRef.current * 0.22 + Math.random() * 1.1),
      hp: 1,
      value,
      color,
      glow: isPlane ? "#fde68a" : "#a5f3fc",
      dir,
    });
  }, []);

  const startGame = useCallback(() => {
    playPopSound();
    enemiesRef.current = [];
    shotsRef.current = [];
    bombsRef.current = [];
    particlesRef.current = [];
    floatsRef.current = [];
    subXRef.current = CW / 2;
    targetXRef.current = CW / 2;
    scoreRef.current = 0;
    livesRef.current = 4;
    comboRef.current = 0;
    levelRef.current = 1;
    targetRef.current = makeTarget();
    spawnRef.current = 0;
    planeBombRef.current = 30;
    shootCooldownRef.current = 0;
    torpedoCooldownRef.current = 0;
    syncPhase("playing");
    setPulse(v => v + 1);
  }, []);

  const finishGame = useCallback(() => {
    if (phaseRef.current !== "playing") return;
    syncPhase("over");
    burst(subXRef.current, CH - 96, ["#67e8f9", "#f9a8d4", "#fde047", "#fb7185"], 50);
    setPulse(v => v + 1);
  }, []);

  const fireUp = useCallback(() => {
    if (shootCooldownRef.current > 0 || phaseRef.current !== "playing") return;
    shotsRef.current.push({
      id: uid++,
      x: subXRef.current,
      y: CH - 134,
      vx: 0,
      vy: -8.5,
      color: "#fde047",
    });
    shootCooldownRef.current = 10;
  }, []);

  const fireSide = useCallback((dir: number) => {
    if (torpedoCooldownRef.current > 0 || phaseRef.current !== "playing") return;
    shotsRef.current.push({
      id: uid++,
      x: subXRef.current + dir * 42,
      y: CH - 96,
      vx: dir * 8.2,
      vy: 0,
      color: "#67e8f9",
    });
    torpedoCooldownRef.current = 18;
  }, []);

  const damage = useCallback((x: number, y: number, text = "KENA!") => {
    livesRef.current -= 1;
    comboRef.current = 0;
    addFloat(x, y, text, "#fecaca");
    burst(x, y, ["#ef4444", "#fb7185", "#f97316", "#fde047"], 28);
    if (livesRef.current <= 0) finishGame();
    setPulse(v => v + 1);
  }, [finishGame]);

  const scoreEnemy = useCallback((enemy: Enemy) => {
    if (enemy.value === targetRef.current) {
      comboRef.current += 1;
      scoreRef.current += 35 + comboRef.current * 10 + levelRef.current * 5;
      addFloat(enemy.x, enemy.y, `+${35 + comboRef.current * 10}`, "#bbf7d0");
      burst(enemy.x, enemy.y, ["#22d3ee", "#fde047", "#86efac", "#f9a8d4"], 30);
      if (comboRef.current % 5 === 0) {
        levelRef.current += 1;
        addFloat(CW / 2, 148, `LEVEL ${levelRef.current}!`, "#fde047");
      }
      targetRef.current = makeTarget();
    } else {
      damage(enemy.x, enemy.y, "SALAH!");
    }
    setPulse(v => v + 1);
  }, [damage]);

  const moveTo = (clientX: number, rect: DOMRect) => {
    targetXRef.current = Math.max(54, Math.min(CW - 54, ((clientX - rect.left) / rect.width) * CW));
    if (phaseRef.current !== "playing") startGame();
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "arrowleft" || key === "a") keysRef.current.left = true;
      if (key === "arrowright" || key === "d") keysRef.current.right = true;
      if (key === "arrowup" || key === "w" || key === " ") {
        e.preventDefault();
        keysRef.current.shoot = true;
        if (phaseRef.current !== "playing") startGame();
      }
      if (key === "z") keysRef.current.torpedo = true;
      if (key === "enter" && phaseRef.current !== "playing") startGame();
    };
    const up = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "arrowleft" || key === "a") keysRef.current.left = false;
      if (key === "arrowright" || key === "d") keysRef.current.right = false;
      if (key === "arrowup" || key === "w" || key === " ") keysRef.current.shoot = false;
      if (key === "z") keysRef.current.torpedo = false;
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

    const drawText = (text: string, x: number, y: number, size: number, color = "#ffffff", align: CanvasTextAlign = "center") => {
      ctx.save();
      ctx.font = `900 ${size}px Inter, system-ui, sans-serif`;
      ctx.textAlign = align;
      ctx.textBaseline = "middle";
      ctx.lineWidth = Math.max(3, size / 5);
      ctx.strokeStyle = "rgba(2,6,23,0.88)";
      ctx.strokeText(text, x, y);
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      ctx.restore();
    };

    const rounded = (x: number, y: number, w: number, h: number, r: number, fill: string, stroke?: string) => {
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

    const drawPlane = (enemy: Enemy) => {
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      ctx.scale(enemy.dir, 1);
      ctx.shadowColor = enemy.glow;
      ctx.shadowBlur = 16;
      ctx.fillStyle = enemy.color;
      ctx.beginPath();
      ctx.moveTo(42, 0);
      ctx.lineTo(9, -15);
      ctx.lineTo(-38, -9);
      ctx.lineTo(-44, 0);
      ctx.lineTo(-38, 9);
      ctx.lineTo(9, 15);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#bae6fd";
      ctx.beginPath();
      ctx.moveTo(-6, -6);
      ctx.lineTo(16, -38);
      ctx.lineTo(28, -33);
      ctx.lineTo(15, 0);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-6, 6);
      ctx.lineTo(16, 38);
      ctx.lineTo(28, 33);
      ctx.lineTo(15, 0);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(13, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      rounded(enemy.x - 27, enemy.y + 24, 54, 25, 12, "rgba(15,23,42,0.82)", enemy.value === targetRef.current ? "#86efac" : "#f9a8d4");
      drawText(String(enemy.value), enemy.x, enemy.y + 37, 15, "#ffffff");
    };

    const drawEnemySub = (enemy: Enemy) => {
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      ctx.scale(enemy.dir, 1);
      ctx.shadowColor = enemy.glow;
      ctx.shadowBlur = 18;
      ctx.fillStyle = enemy.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, 48, 19, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#bae6fd";
      ctx.beginPath();
      ctx.roundRect(-12, -31, 24, 22, 8);
      ctx.fill();
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(18, -1, 5, 0, Math.PI * 2);
      ctx.arc(0, -1, 5, 0, Math.PI * 2);
      ctx.arc(-18, -1, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fde047";
      ctx.beginPath();
      ctx.moveTo(-48, 0);
      ctx.lineTo(-68, -18);
      ctx.lineTo(-62, 0);
      ctx.lineTo(-68, 18);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      rounded(enemy.x - 27, enemy.y + 25, 54, 25, 12, "rgba(15,23,42,0.82)", enemy.value === targetRef.current ? "#86efac" : "#f9a8d4");
      drawText(String(enemy.value), enemy.x, enemy.y + 38, 15, "#ffffff");
    };

    const drawPlayerSub = () => {
      const x = subXRef.current;
      const y = CH - 96;
      ctx.save();
      ctx.translate(x, y);
      ctx.shadowColor = "#67e8f9";
      ctx.shadowBlur = 25;
      const g = ctx.createLinearGradient(-62, -22, 62, 22);
      g.addColorStop(0, "#facc15");
      g.addColorStop(0.5, "#22d3ee");
      g.addColorStop(1, "#a855f7");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, 62, 25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fef3c7";
      ctx.beginPath();
      ctx.roundRect(-16, -42, 32, 28, 10);
      ctx.fill();
      ctx.fillStyle = "#0f172a";
      [-30, -10, 10, 30].forEach(px => {
        ctx.beginPath();
        ctx.arc(px, 0, 7, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = "#fb7185";
      ctx.beginPath();
      ctx.moveTo(-62, 0);
      ctx.lineTo(-88, -22);
      ctx.lineTo(-79, 0);
      ctx.lineTo(-88, 22);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#86efac";
      ctx.fillRect(-4, -67, 8, 27);
      ctx.beginPath();
      ctx.arc(0, -69, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const loop = (now: number) => {
      const dt = Math.min(32, now - last) / 16.67;
      last = now;
      if (guruQuiz.isPausedRef.current) { rafRef.current = requestAnimationFrame(loop); return; }

      const bg = ctx.createLinearGradient(0, 0, 0, CH);
      bg.addColorStop(0, "#1e1b4b");
      bg.addColorStop(0.25, "#0ea5e9");
      bg.addColorStop(0.43, "#0891b2");
      bg.addColorStop(1, "#020617");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, CW, CH);

      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.arc(390, 55, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.85)";
      for (let i = 0; i < 8; i += 1) {
        const x = (i * 77 + now * 0.014) % (CW + 80) - 40;
        const y = 42 + (i % 4) * 38;
        ctx.beginPath();
        ctx.ellipse(x, y, 28, 9, 0, 0, Math.PI * 2);
        ctx.ellipse(x + 20, y + 2, 20, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillRect(0, 195, CW, 5);
      for (let i = 0; i < 11; i += 1) {
        ctx.strokeStyle = i % 2 ? "rgba(186,230,253,0.55)" : "rgba(255,255,255,0.35)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = -20; x <= CW + 20; x += 24) {
          const y = 208 + i * 36 + Math.sin((x + now * 0.05 + i * 48) / 28) * 6;
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      for (let i = 0; i < 35; i += 1) {
        const x = (i * 61 + Math.sin(now * 0.001 + i) * 12) % CW;
        const y = 240 + ((i * 53 - now * 0.028) % 360);
        ctx.fillStyle = i % 4 === 0 ? "rgba(253,224,71,0.8)" : "rgba(125,211,252,0.45)";
        ctx.beginPath();
        ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }

      if (phaseRef.current === "playing") {
        spawnRef.current -= dt;
        planeBombRef.current -= dt;
        shootCooldownRef.current = Math.max(0, shootCooldownRef.current - dt);
        torpedoCooldownRef.current = Math.max(0, torpedoCooldownRef.current - dt);
        if (spawnRef.current <= 0) {
          spawnEnemy();
          spawnRef.current = Math.max(19, 58 - levelRef.current * 3 - Math.random() * 12);
        }
        if (planeBombRef.current <= 0) {
          const planes = enemiesRef.current.filter(e => e.type === "plane" && e.x > 20 && e.x < CW - 20);
          if (planes.length) {
            const p = planes[Math.floor(Math.random() * planes.length)];
            bombsRef.current.push({ id: uid++, x: p.x, y: p.y + 26, vy: 3.2 + levelRef.current * 0.22 });
          }
          planeBombRef.current = Math.max(22, 56 - levelRef.current * 3);
        }
        if (keysRef.current.left) targetXRef.current = Math.max(54, targetXRef.current - 7.5 * dt);
        if (keysRef.current.right) targetXRef.current = Math.min(CW - 54, targetXRef.current + 7.5 * dt);
        if (keysRef.current.shoot) fireUp();
        if (keysRef.current.torpedo) {
          const nearest = enemiesRef.current.find(e => e.type === "sub");
          fireSide(nearest && nearest.x < subXRef.current ? -1 : 1);
        }
        subXRef.current += (targetXRef.current - subXRef.current) * 0.17;
      }

      enemiesRef.current = enemiesRef.current
        .map(e => ({ ...e, x: e.x + e.vx * dt }))
        .filter(e => e.x > -95 && e.x < CW + 95);

      shotsRef.current = shotsRef.current
        .map(s => ({ ...s, x: s.x + s.vx * dt, y: s.y + s.vy * dt }))
        .filter(s => s.y > -40 && s.y < CH + 40 && s.x > -60 && s.x < CW + 60);

      bombsRef.current = bombsRef.current
        .map(b => ({ ...b, y: b.y + b.vy * dt }))
        .filter(b => {
          if (Math.abs(b.x - subXRef.current) < 48 && Math.abs(b.y - (CH - 96)) < 28 && phaseRef.current === "playing") {
            damage(b.x, b.y, "DIBOM!");
            return false;
          }
          return b.y < CH + 40;
        });

      const destroyedEnemies = new Set<number>();
      const usedShots = new Set<number>();
      shotsRef.current.forEach(shot => {
        enemiesRef.current.forEach(enemy => {
          if (destroyedEnemies.has(enemy.id) || usedShots.has(shot.id)) return;
          const dx = shot.x - enemy.x;
          const dy = shot.y - enemy.y;
          const radius = enemy.type === "plane" ? 43 : 48;
          const correctWeapon = enemy.type === "plane" ? shot.vy < 0 : Math.abs(shot.vx) > 0;
          if (correctWeapon && Math.hypot(dx, dy) < radius) {
            destroyedEnemies.add(enemy.id);
            usedShots.add(shot.id);
            scoreEnemy(enemy);
          }
        });
      });
      enemiesRef.current = enemiesRef.current.filter(e => !destroyedEnemies.has(e.id));
      shotsRef.current = shotsRef.current.filter(s => !usedShots.has(s.id));

      enemiesRef.current.forEach(enemy => {
        if (enemy.type === "plane") drawPlane(enemy);
        else drawEnemySub(enemy);
      });

      shotsRef.current.forEach(shot => {
        ctx.save();
        ctx.shadowColor = shot.color;
        ctx.shadowBlur = 18;
        ctx.fillStyle = shot.color;
        ctx.beginPath();
        ctx.ellipse(shot.x, shot.y, shot.vx === 0 ? 5 : 16, shot.vx === 0 ? 18 : 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      bombsRef.current.forEach(bomb => {
        ctx.save();
        ctx.shadowColor = "#fb7185";
        ctx.shadowBlur = 16;
        ctx.font = "30px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("💣", bomb.x, bomb.y);
        ctx.restore();
      });

      particlesRef.current = particlesRef.current
        .map(p => ({ ...p, x: p.x + p.vx * dt, y: p.y + p.vy * dt, vy: p.vy + 0.08 * dt, alpha: p.alpha - 0.024 * dt }))
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

      drawPlayerSub();

      rounded(12, 12, CW - 24, 108, 18, "rgba(15,23,42,0.72)", "rgba(125,211,252,0.55)");
      drawText(`TARGET ANGKA: ${targetRef.current}`, CW / 2, 40, 24, "#fde047");
      drawText(`Skor ${scoreRef.current}`, 58, 80, 15, "#bbf7d0");
      drawText(`Nyawa ${"❤️".repeat(Math.max(0, livesRef.current))}`, 176, 80, 15, "#fecaca");
      drawText(`Combo ×${comboRef.current}`, 310, 80, 15, "#f9a8d4");
      drawText(`Lv ${levelRef.current}`, 408, 80, 15, "#bfdbfe");

      if (phaseRef.current === "idle" || phaseRef.current === "over") {
        rounded(32, 190, CW - 64, 272, 25, "rgba(2,6,23,0.86)", phaseRef.current === "idle" ? "#67e8f9" : "#fde047");
        drawText(phaseRef.current === "idle" ? "SIAP MISI LAUT?" : "MISI SELESAI", CW / 2, 234, 23, phaseRef.current === "idle" ? "#67e8f9" : "#fde047");
        drawText(phaseRef.current === "idle" ? "Klik / sentuh untuk mulai" : `Skor akhir: ${scoreRef.current}`, CW / 2, 282, 18, "#ffffff");
        drawText("Tembak pesawat pembom di atas", CW / 2, 326, 15, "#bbf7d0");
        drawText("Tembak kapal selam musuh kiri/kanan", CW / 2, 356, 15, "#bae6fd");
        drawText("Hanya hancurkan angka target!", CW / 2, 390, 15, "#fde047");
        drawText("Tombol: ← → gerak, Spasi tembak atas, Z torpedo", CW / 2, 426, 12, "#c4b5fd");
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [damage, fireSide, fireUp, finishGame, scoreEnemy, spawnEnemy, startGame]);

  return (
    <div className={`relative flex flex-col overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}
      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        <div className="shrink-0 px-3 pt-2 pb-1 flex items-center gap-2 justify-center">
          <button onClick={() => { playPopSound(); navigate(-1); }} className="text-xs text-white/50 hover:text-white transition-colors font-body cursor-pointer">← Kembali</button>
          <span className="font-display text-base font-bold text-primary text-glow-cyan">🚢 Kapal Selam Math Battle</span>
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center px-2">
          <div className="relative rounded-[30px] p-2 bg-gradient-to-br from-cyan-300 via-blue-500 to-fuchsia-400 shadow-[0_0_50px_rgba(34,211,238,0.35)]">
            <canvas
              ref={canvasRef}
              width={CW}
              height={CH}
              onMouseDown={e => {
                moveTo(e.clientX, e.currentTarget.getBoundingClientRect());
                fireUp();
              }}
              onMouseMove={e => {
                if (e.buttons === 1) moveTo(e.clientX, e.currentTarget.getBoundingClientRect());
              }}
              onDoubleClick={() => fireSide(Math.random() < 0.5 ? -1 : 1)}
              onTouchStart={e => {
                e.preventDefault();
                const t = e.touches[0];
                moveTo(t.clientX, e.currentTarget.getBoundingClientRect());
                fireUp();
              }}
              onTouchMove={e => {
                e.preventDefault();
                const t = e.touches[0];
                moveTo(t.clientX, e.currentTarget.getBoundingClientRect());
              }}
              className="rounded-[22px] bg-slate-950 cursor-crosshair select-none touch-none border-4 border-slate-900"
              style={{ width: 'auto', height: 'auto', maxWidth: '92vw', maxHeight: 'calc(100dvh - 120px)' }}
            />
          </div>
        </div>

        <div className="shrink-0 px-3 pb-2 pt-1 flex flex-wrap justify-center gap-2">
          <button
            onClick={startGame}
            className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-black hover:scale-105 transition-transform"
          >
            Mulai / Ulangi
          </button>
          <button
            onClick={() => { fireSide(-1); }}
            className="rounded-full border border-cyan-300/30 bg-cyan-400/15 px-4 py-2 text-xs font-bold text-cyan-100 hover:bg-cyan-400/25 transition-colors"
          >
            Torpedo Kiri
          </button>
          <button
            onClick={() => { fireSide(1); }}
            className="rounded-full border border-cyan-300/30 bg-cyan-400/15 px-4 py-2 text-xs font-bold text-cyan-100 hover:bg-cyan-400/25 transition-colors"
          >
            Torpedo Kanan
          </button>
          <button
            onClick={() => { playPopSound(); navigate(-1); }}
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition-colors"
          >
            Kembali
          </button>
        </div>
      <GuruQuizOverlay {...guruQuiz} />
      </div>
    </div>
  );
};

export default SubmarineBattleMathPage;