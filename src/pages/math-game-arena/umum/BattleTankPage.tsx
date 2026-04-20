import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";

const CW = 420;
const CH = 600;
const PLAYER_Y = CH - 80;
const BULLET_SPEED = 420;
const ENEMY_BULLET_SPEED = 220;

// ── Math ────────────────────────────────────────────────────────────────────
interface MQ { q: string; opts: string[]; ans: number; pts: number }

const QUIZ: MQ[] = [
  {
    q: "Rumus baku: Rasio a terhadap b ditulis ...",
    opts: ["a : b", "a × b", "a + b", "a − b"],
    ans: 0, pts: 30,
  },
  {
    q: "Rasio paling sederhana diperoleh dengan membagi kedua bilangan oleh ...",
    opts: ["FPB", "KPK", "Jumlah", "Selisih"],
    ans: 0, pts: 30,
  },
  {
    q: "Nilai tiap 1 satuan diperoleh dari jumlah besaran dibagi ...",
    opts: ["Banyak Satuan", "Setengahnya", "2", "KPK"],
    ans: 0, pts: 40,
  },
];

// ── Colors ───────────────────────────────────────────────────────────────────
const ENEMY_PALETTES = [
  { body: "#ff5e87", track: "#aa2244", turret: "#ff2255", glow: "#ff5e87" },
  { body: "#ffc94a", track: "#aa8800", turret: "#ffaa00", glow: "#ffc94a" },
  { body: "#72f572", track: "#228822", turret: "#44cc44", glow: "#72f572" },
  { body: "#cc66ff", track: "#7700aa", turret: "#aa44dd", glow: "#cc66ff" },
  { body: "#ff9040", track: "#aa4400", turret: "#dd6600", glow: "#ff9040" },
  { body: "#00e6d2", track: "#007766", turret: "#00bbaa", glow: "#00e6d2" },
  { body: "#ffaaff", track: "#aa44aa", turret: "#dd66dd", glow: "#ffaaff" },
  { body: "#5ec8ff", track: "#115588", turret: "#2299dd", glow: "#5ec8ff" },
];

// ── Interfaces ───────────────────────────────────────────────────────────────
interface EnemyTank {
  id: number; x: number; y: number;
  vx: number; baseVx: number;
  label: string; correct: boolean;
  palette: typeof ENEMY_PALETTES[0];
  alive: boolean;
  turretAngle: number;
  flashT: number;
  invT: number;        // invincibility after wrong hit
  fireAcc: number; fireInterval: number;
  wobbleT: number;
  scatterVx: number; scatterVy: number; scatterT: number;
}

interface Bullet {
  id: number; x: number; y: number;
  vx: number; vy: number;
  fromPlayer: boolean;
  color: string; glow: string;
  r: number; trail: { x: number; y: number; alpha: number }[];
}

interface Explosion {
  x: number; y: number;
  particles: { x:number; y:number; vx:number; vy:number; alpha:number; r:number; color:string }[];
  flashAlpha: number; flashR: number;
  color: string;
}

interface FloatText { x:number; y:number; txt:string; alpha:number; vy:number; good:boolean }
interface GroundMark { x:number; y:number; alpha:number; r:number; color:string }

type Phase = "idle" | "playing" | "dead";
let _id = 0;

// ── Ground tile pattern ───────────────────────────────────────────────────────
const TILE_SIZE = 40;

const BattleTankPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastRef = useRef(0);

  const phaseRef = useRef<Phase>("idle");
  const enemiesRef = useRef<EnemyTank[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const explosionsRef = useRef<Explosion[]>([]);
  const floatTextsRef = useRef<FloatText[]>([]);
  const groundMarksRef = useRef<GroundMark[]>([]);

  const playerRef = useRef({ x: CW / 2, targetX: CW / 2, turretAngle: -Math.PI / 2, invT: 0, shieldT: 0 });
  const mouseRef = useRef({ x: CW / 2, y: CH / 2 });

  const currentQRef = useRef<MQ>(QUIZ[0]);
  const quizIdxRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const bestRef = useRef(0);
  const levelRef = useRef(1);
  const timerRef = useRef(90);
  const timerAccRef = useRef(0);
  const comboRef = useRef(0);
  const shakeRef = useRef(0);
  const hueRef = useRef(0);
  const tileOffsetRef = useRef(0);

  const [, forceRender] = useState(0);
  const rerender = useCallback(() => forceRender(n => n + 1), []);

  // ── Spawn enemies ─────────────────────────────────────────────────────────
  const spawnEnemies = useCallback((q: MQ) => {
    const ROWS = 2, COLS = 4;
    const total = ROWS * COLS;
    const correctLabel = q.opts[q.ans];
    const wrongs = q.opts.filter((_, i) => i !== q.ans);
    const labels: string[] = [correctLabel];
    while (labels.length < total) {
      labels.push(wrongs[(labels.length - 1) % wrongs.length]);
    }
    for (let i = labels.length - 1; i > 0; i--) {
      const j = ~~(Math.random() * (i + 1));
      [labels[i], labels[j]] = [labels[j], labels[i]];
    }

    const enemies: EnemyTank[] = [];
    let li = 0;
    const gapX = (CW - 80) / (COLS + 1);
    for (let r = 0; r < ROWS; r++) {
      const baseSpd = 50;
      const rowDir = r % 2 === 0 ? 1 : -1;
      for (let c = 0; c < COLS; c++) {
        const spd = baseSpd + Math.random() * 20;
        const pal = ENEMY_PALETTES[~~(Math.random() * ENEMY_PALETTES.length)];
        enemies.push({
          id: _id++,
          x: 40 + gapX * (c + 1),
          y: 165 + r * 110,
          vx: rowDir * spd,
          baseVx: spd,
          label: labels[li++],
          correct: false,
          palette: pal,
          alive: true,
          turretAngle: Math.PI / 2,
          flashT: 0,
          invT: 0,
          fireAcc: Math.random() * 4,
          fireInterval: 3.5 + Math.random() * 3,
          wobbleT: Math.random() * Math.PI * 2,
          scatterVx: 0, scatterVy: 0, scatterT: 0,
        });
      }
    }
    // mark correct one
    const correctIdx = enemies.findIndex(e => e.label === correctLabel);
    if (correctIdx >= 0) enemies[correctIdx].correct = true;
    enemiesRef.current = enemies;
  }, []);

  const addExplosion = (x: number, y: number, color: string, big: boolean) => {
    const count = big ? 28 : 14;
    explosionsRef.current.push({
      x, y, color,
      flashAlpha: 1, flashR: big ? 50 : 28,
      particles: Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const spd = (big ? 120 : 70) + Math.random() * (big ? 200 : 100);
        return { x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, alpha: 1, r: (big ? 4 : 2) + Math.random() * 5, color };
      }),
    });
    groundMarksRef.current.push({ x, y, alpha: 0.7, r: big ? 22 : 12, color: "#333" });
  };

  const fireBullet = useCallback((fromPlayer: boolean, sx: number, sy: number, tx: number, ty: number, color: string, glow: string) => {
    const ang = Math.atan2(ty - sy, tx - sx);
    const spd = fromPlayer ? BULLET_SPEED : ENEMY_BULLET_SPEED;
    bulletsRef.current.push({
      id: _id++, x: sx, y: sy,
      vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
      fromPlayer, color, glow, r: fromPlayer ? 5 : 4, trail: [],
    });
  }, []);

  const startGame = useCallback(() => {
    scoreRef.current = 0; livesRef.current = 3; levelRef.current = 1;
    timerRef.current = 90; timerAccRef.current = 0;
    comboRef.current = 0; shakeRef.current = 0; quizIdxRef.current = 0;
    bulletsRef.current = []; explosionsRef.current = [];
    floatTextsRef.current = []; groundMarksRef.current = [];
    playerRef.current = { x: CW / 2, targetX: CW / 2, turretAngle: -Math.PI / 2, invT: 0, shieldT: 0 };
    const q = QUIZ[0]; currentQRef.current = q;
    spawnEnemies(q);
    phaseRef.current = "playing";
    rerender();
  }, [spawnEnemies, rerender]);

  // ── Input ─────────────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) * (CW / rect.width),
      y: (e.clientY - rect.top) * (CH / rect.height),
    };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas) return;
    if (phaseRef.current === "idle") { startGame(); return; }
    if (phaseRef.current === "dead") { startGame(); return; }
    if (phaseRef.current !== "playing") return;

    const rect = canvas.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (CW / rect.width);
    const cy = (e.clientY - rect.top) * (CH / rect.height);
    const px = playerRef.current.x;
    // Barrel tip position
    const ang = playerRef.current.turretAngle;
    const tipX = px + Math.cos(ang) * 28;
    const tipY = PLAYER_Y + Math.sin(ang) * 28;
    fireBullet(true, tipX, tipY, cx, cy, "#00f0ff", "#00f0ff");
    playPopSound();
  }, [startGame, fireBullet]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: (e.touches[0].clientX - rect.left) * (CW / rect.width),
      y: (e.touches[0].clientY - rect.top) * (CH / rect.height),
    };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (phaseRef.current === "idle") { startGame(); return; }
    if (phaseRef.current === "dead") { startGame(); return; }
    if (phaseRef.current !== "playing") return;
    const px = playerRef.current.x, ang = playerRef.current.turretAngle;
    const tipX = px + Math.cos(ang) * 28, tipY = PLAYER_Y + Math.sin(ang) * 28;
    fireBullet(true, tipX, tipY, mouseRef.current.x, mouseRef.current.y, "#00f0ff", "#00f0ff");
    playPopSound();
  }, [startGame, fireBullet]);

  // ── Draw tank (top-down) ──────────────────────────────────────────────────
  const drawTank = (
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    bodyAngle: number, turretAngle: number,
    bw: number, bh: number,
    bodyColor: string, trackColor: string, turretColor: string,
    glowColor: string,
    value: string | null,
    isPlayer: boolean,
    flashT: number,
    invT: number,
    ts: number,
  ) => {
    ctx.save();
    ctx.translate(x, y);

    // glow
    ctx.shadowBlur = isPlayer ? 22 : 18;
    ctx.shadowColor = flashT > 0 ? "#ff3333" : glowColor;

    ctx.rotate(bodyAngle);

    // track left
    ctx.fillStyle = trackColor;
    ctx.beginPath();
    roundRect(ctx, -bw / 2 - 5, -bh / 2 - 4, bw + 10, 7, 3);
    ctx.fill();
    // track right
    ctx.beginPath();
    roundRect(ctx, -bw / 2 - 5, bh / 2 - 3, bw + 10, 7, 3);
    ctx.fill();
    // track detail lines
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 1;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(i * (bw / 5), -bh / 2 - 4);
      ctx.lineTo(i * (bw / 5), -bh / 2 + 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(i * (bw / 5), bh / 2 - 3);
      ctx.lineTo(i * (bw / 5), bh / 2 + 4);
      ctx.stroke();
    }

    // body
    const bodyC = flashT > 0 ? "#ff5555" : bodyColor;
    ctx.fillStyle = bodyC;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    roundRect(ctx, -bw / 2, -bh / 2, bw, bh, 5);
    ctx.fill();
    // body highlight
    const bodyGrad = ctx.createLinearGradient(-bw / 2, -bh / 2, -bw / 2, bh / 2);
    bodyGrad.addColorStop(0, "rgba(255,255,255,0.22)");
    bodyGrad.addColorStop(0.5, "rgba(255,255,255,0.06)");
    bodyGrad.addColorStop(1, "rgba(0,0,0,0.15)");
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    roundRect(ctx, -bw / 2, -bh / 2, bw, bh, 5);
    ctx.fill();
    ctx.rotate(-bodyAngle);

    // turret
    ctx.rotate(turretAngle);
    ctx.shadowBlur = 14;
    ctx.shadowColor = flashT > 0 ? "#ff3333" : glowColor;
    ctx.fillStyle = turretColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, bh * 0.45, bh * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    // barrel
    ctx.fillStyle = trackColor;
    ctx.beginPath();
    roundRect(ctx, bh * 0.38, -3, bw * 0.48, 6, 3);
    ctx.fill();
    // barrel tip glow
    ctx.shadowBlur = 12;
    ctx.shadowColor = isPlayer ? "#00f0ff" : glowColor;
    ctx.fillStyle = isPlayer ? "#00f0ff" : glowColor;
    ctx.beginPath();
    ctx.arc(bh * 0.38 + bw * 0.48, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.rotate(-turretAngle);

    // value label (unrotated)
    if (value !== null) {
      ctx.fillStyle = "#ffffff";
      ctx.shadowBlur = 10;
      ctx.shadowColor = glowColor;
      ctx.font = `bold ${value.length > 10 ? 6 : value.length > 5 ? 7 : value.length > 3 ? 9 : 11}px 'Orbitron', monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(value, 0, 0);
      ctx.shadowBlur = 0;
    }

    // shield ring for player
    if (isPlayer && invT > 0) {
      const shieldAlpha = Math.min(1, invT * 2) * (0.5 + 0.5 * Math.sin(ts / 80));
      ctx.globalAlpha = shieldAlpha;
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#00f0ff";
      ctx.beginPath();
      ctx.arc(0, 0, bw * 0.75, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  };

  // ── Main loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = (ts: number) => {
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05);
      lastRef.current = ts;
      hueRef.current = (hueRef.current + dt * 18) % 360;
      tileOffsetRef.current = (tileOffsetRef.current + dt * 20) % TILE_SIZE;
      const hue = hueRef.current;
      const phase = phaseRef.current;

      // ── Update player ────────────────────────────────────────────────────
      const player = playerRef.current;
      const mx = Math.max(30, Math.min(CW - 30, mouseRef.current.x));
      player.targetX = mx;
      player.x += (player.targetX - player.x) * Math.min(1, dt * 10);
      player.turretAngle = Math.atan2(mouseRef.current.y - PLAYER_Y, mouseRef.current.x - player.x);
      if (player.invT > 0) player.invT = Math.max(0, player.invT - dt);
      if (shakeRef.current > 0) shakeRef.current = Math.max(0, shakeRef.current - dt * 2.5);

      // ── Update timer ─────────────────────────────────────────────────────
      if (phase === "playing") {
        timerAccRef.current += dt;
        if (timerAccRef.current >= 1) {
          timerAccRef.current -= 1;
          timerRef.current--;
          if (timerRef.current <= 0) { timerRef.current = 0; phaseRef.current = "dead"; rerender(); }
        }
      }

      // ── Update enemies ───────────────────────────────────────────────────
      if (phase === "playing") {
        for (const e of enemiesRef.current) {
          if (!e.alive) continue;
          e.wobbleT += dt * 2;
          if (e.flashT > 0) e.flashT = Math.max(0, e.flashT - dt * 3);
          if (e.invT > 0) e.invT = Math.max(0, e.invT - dt);

          // scatter bounce
          if (e.scatterT > 0) {
            e.x += e.scatterVx * dt;
            e.y += e.scatterVy * dt;
            e.scatterT = Math.max(0, e.scatterT - dt);
            e.x = Math.max(30, Math.min(CW - 30, e.x));
            e.y = Math.max(130, Math.min(PLAYER_Y - 120, e.y));
          } else {
            e.x += e.vx * dt;
          }
          // wall bounce
          if (e.x < 32) { e.x = 32; e.vx = Math.abs(e.vx); }
          if (e.x > CW - 32) { e.x = CW - 32; e.vx = -Math.abs(e.vx); }

          // turret faces player
          e.turretAngle = Math.atan2(PLAYER_Y - e.y, player.x - e.x);

          // fire at player
          e.fireAcc += dt;
          if (e.fireAcc >= e.fireInterval) {
            e.fireAcc = 0;
            e.fireInterval = 3 + Math.random() * 4;
            const ang = e.turretAngle;
            const tipX = e.x + Math.cos(ang) * 26;
            const tipY = e.y + Math.sin(ang) * 26;
            fireBullet(false, tipX, tipY, player.x, PLAYER_Y, e.palette.glow, e.palette.glow);
          }
        }
      }

      // ── Update bullets ───────────────────────────────────────────────────
      if (phase === "playing") {
        for (const b of bulletsRef.current) {
          b.trail.push({ x: b.x, y: b.y, alpha: 0.6 });
          if (b.trail.length > 10) b.trail.shift();
          for (const t of b.trail) t.alpha -= dt * 5;

          b.x += b.vx * dt;
          b.y += b.vy * dt;

          if (b.fromPlayer) {
            // check enemy collisions
            for (const e of enemiesRef.current) {
              if (!e.alive || e.invT > 0) continue;
              const dx = b.x - e.x, dy = b.y - e.y;
              if (Math.sqrt(dx * dx + dy * dy) < 26) {
                bulletsRef.current = bulletsRef.current.filter(bb => bb !== b);
                if (e.correct) {
                  const pts = currentQRef.current.pts;
                  scoreRef.current += pts;
                  if (scoreRef.current > bestRef.current) bestRef.current = scoreRef.current;
                  addExplosion(e.x, e.y, e.palette.glow, true);
                  for (const oe of enemiesRef.current) {
                    if (oe === e || !oe.alive) continue;
                    const adx = oe.x - e.x, ady = oe.y - e.y;
                    const dist = Math.sqrt(adx * adx + ady * ady) || 1;
                    oe.scatterVx = (adx / dist) * 160;
                    oe.scatterVy = (ady / dist) * 160;
                    oe.scatterT = 0.4;
                  }
                  e.alive = false;
                  floatTextsRef.current.push({ x: e.x, y: e.y - 30, txt: `✅ +${pts}`, alpha: 1, vy: -90, good: true });
                  playPopSound();
                  quizIdxRef.current++;
                  setTimeout(() => {
                    if (phaseRef.current !== "playing") return;
                    bulletsRef.current = bulletsRef.current.filter(bb => bb.fromPlayer);
                    if (quizIdxRef.current >= QUIZ.length) {
                      phaseRef.current = "dead"; rerender();
                    } else {
                      const q = QUIZ[quizIdxRef.current]; currentQRef.current = q;
                      spawnEnemies(q); rerender();
                    }
                  }, 700);
                } else {
                  e.flashT = 0.6; e.invT = 0.5;
                  addExplosion(e.x, e.y, "#ff3333", false);
                  floatTextsRef.current.push({ x: e.x, y: e.y - 20, txt: "❌ Salah!", alpha: 1, vy: -70, good: false });
                  shakeRef.current = 0.3;
                  livesRef.current--;
                  if (livesRef.current <= 0) { phaseRef.current = "dead"; rerender(); }
                }
                break;
              }
            }
          } else {
            // enemy bullet hits player
            if (player.invT <= 0) {
              const dx = b.x - player.x, dy = b.y - PLAYER_Y;
              if (Math.sqrt(dx * dx + dy * dy) < 22) {
                bulletsRef.current = bulletsRef.current.filter(bb => bb !== b);
                livesRef.current--;
                player.invT = 2;
                shakeRef.current = 0.5;
                comboRef.current = 0;
                addExplosion(player.x, PLAYER_Y, "#00f0ff", false);
                floatTextsRef.current.push({ x: player.x, y: PLAYER_Y - 30, txt: "💥 Kena!", alpha: 1, vy: -70, good: false });
                if (livesRef.current <= 0) { phaseRef.current = "dead"; rerender(); }
              }
            }
          }
        }
        bulletsRef.current = bulletsRef.current.filter(b =>
          b.x > -20 && b.x < CW + 20 && b.y > -20 && b.y < CH + 20
        );
      }

      // ── Update explosions ─────────────────────────────────────────────────
      for (const ex of explosionsRef.current) {
        ex.flashAlpha = Math.max(0, ex.flashAlpha - dt * 4);
        ex.flashR += dt * 60;
        for (const p of ex.particles) {
          p.x += p.vx * dt; p.y += p.vy * dt;
          p.vy += 120 * dt;
          p.alpha -= dt * 1.8; p.r *= 0.97;
        }
        ex.particles = ex.particles.filter(p => p.alpha > 0);
      }
      explosionsRef.current = explosionsRef.current.filter(ex => ex.flashAlpha > 0 || ex.particles.length > 0);

      // ── Update float texts ────────────────────────────────────────────────
      for (const f of floatTextsRef.current) { f.y += f.vy * dt; f.alpha -= dt * 1.3; }
      floatTextsRef.current = floatTextsRef.current.filter(f => f.alpha > 0);
      for (const m of groundMarksRef.current) { m.alpha -= dt * 0.3; }
      groundMarksRef.current = groundMarksRef.current.filter(m => m.alpha > 0);

      // ── Draw ──────────────────────────────────────────────────────────────
      const sx = shakeRef.current > 0 ? (Math.random() - 0.5) * shakeRef.current * 12 : 0;
      const sy = shakeRef.current > 0 ? (Math.random() - 0.5) * shakeRef.current * 5 : 0;
      ctx.save();
      ctx.translate(sx, sy);

      // Ground (tiled battlefield)
      const groundGrad = ctx.createLinearGradient(0, 108, 0, CH);
      groundGrad.addColorStop(0, `hsl(${(hue + 120) % 360}, 28%, 14%)`);
      groundGrad.addColorStop(0.5, `hsl(${(hue + 120) % 360}, 22%, 11%)`);
      groundGrad.addColorStop(1, `hsl(${(hue + 120) % 360}, 20%, 9%)`);
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, 108, CW, CH);

      // Grid lines on ground
      ctx.strokeStyle = `hsla(${(hue + 120) % 360}, 30%, 30%, 0.22)`;
      ctx.lineWidth = 1;
      const off = tileOffsetRef.current;
      for (let x = -TILE_SIZE + (off % TILE_SIZE); x < CW + TILE_SIZE; x += TILE_SIZE) {
        ctx.beginPath(); ctx.moveTo(x, 108); ctx.lineTo(x, CH); ctx.stroke();
      }
      for (let y = 108 + (off % TILE_SIZE); y < CH + TILE_SIZE; y += TILE_SIZE) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke();
      }

      // Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 115);
      skyGrad.addColorStop(0, `hsl(${hue}, 55%, 6%)`);
      skyGrad.addColorStop(1, `hsl(${(hue + 50) % 360}, 48%, 10%)`);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, CW, 115);

      // Horizon line
      ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.25)`;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
      ctx.beginPath(); ctx.moveTo(0, 112); ctx.lineTo(CW, 112); ctx.stroke();
      ctx.shadowBlur = 0;

      // HUD
      const barGrad = ctx.createLinearGradient(0, 0, CW, 0);
      barGrad.addColorStop(0, "rgba(5,5,20,0.94)");
      barGrad.addColorStop(1, "rgba(10,3,30,0.94)");
      ctx.fillStyle = barGrad;
      ctx.fillRect(0, 0, CW, 108);

      if (phase === "playing" || phase === "dead") {
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.font = "bold 10px 'Orbitron', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.fillText(`Soal ${Math.min(quizIdxRef.current + 1, QUIZ.length)} / ${QUIZ.length}  •  Tembak tank dengan jawaban BENAR! 🎯`, CW / 2, 14);

        // Wrapped question text
        ctx.shadowBlur = 22; ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
        ctx.fillStyle = `hsl(${hue}, 100%, 86%)`;
        ctx.font = "bold 11px 'Orbitron', monospace";
        const qWords = currentQRef.current.q.split(" ");
        const qLines: string[] = []; let qLine = "";
        for (const w of qWords) {
          const test = qLine ? qLine + " " + w : w;
          if (ctx.measureText(test).width > CW - 24) { qLines.push(qLine); qLine = w; }
          else qLine = test;
        }
        qLines.push(qLine);
        const qStartY = qLines.length === 1 ? 52 : 44;
        qLines.forEach((l, i) => ctx.fillText(l, CW / 2, qStartY + i * 16));
        ctx.shadowBlur = 0;

        ctx.textAlign = "left"; ctx.font = "bold 12px 'Orbitron', monospace";
        ctx.fillStyle = "#ffc94a"; ctx.shadowBlur = 10; ctx.shadowColor = "#ffc94a";
        ctx.fillText(`⭐ ${scoreRef.current}`, 10, 92);
        ctx.textAlign = "right";
        ctx.fillStyle = "#ff5e87"; ctx.shadowColor = "#ff5e87";
        ctx.fillText(`❤️ ${"♥".repeat(Math.max(0, livesRef.current))}`, CW - 10, 92);
        ctx.shadowBlur = 0;

        const tFrac = timerRef.current / 90;
        const tCol = `hsl(${tFrac * 120}, 100%, 55%)`;
        ctx.fillStyle = "rgba(255,255,255,0.07)"; ctx.fillRect(0, 106, CW, 5);
        ctx.fillStyle = tCol; ctx.shadowBlur = 8; ctx.shadowColor = tCol;
        ctx.fillRect(0, 106, CW * tFrac, 5); ctx.shadowBlur = 0;
      }

      // Ground marks (craters)
      for (const m of groundMarksRef.current) {
        ctx.globalAlpha = m.alpha * 0.5;
        ctx.fillStyle = "#111";
        ctx.beginPath(); ctx.ellipse(m.x, m.y, m.r, m.r * 0.55, 0, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Bullets (trails first)
      for (const b of bulletsRef.current) {
        for (let i = 0; i < b.trail.length; i++) {
          const t = b.trail[i];
          const frac = i / b.trail.length;
          ctx.globalAlpha = t.alpha * frac;
          ctx.fillStyle = b.color;
          ctx.shadowBlur = 8; ctx.shadowColor = b.glow;
          ctx.beginPath();
          ctx.arc(t.x, t.y, Math.max(1, b.r * frac * 0.7), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 20; ctx.shadowColor = b.glow;
        ctx.fillStyle = b.fromPlayer ? "#ffffff" : b.color;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Aim line from player
      if (phase === "playing") {
        const player2 = playerRef.current;
        const ang = player2.turretAngle;
        const tipX = player2.x + Math.cos(ang) * 28, tipY = PLAYER_Y + Math.sin(ang) * 28;
        ctx.save();
        ctx.setLineDash([8, 10]);
        ctx.strokeStyle = "rgba(0, 240, 255, 0.22)";
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(tipX, tipY);
        ctx.lineTo(tipX + Math.cos(ang) * 200, tipY + Math.sin(ang) * 200);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // Enemies
      for (const e of enemiesRef.current) {
        if (!e.alive) continue;
        // correct tank pulse
        if (e.correct) {
          const pulse = 0.7 + 0.3 * Math.sin(ts / 250);
          ctx.save();
          ctx.globalAlpha = pulse * 0.35;
          ctx.fillStyle = `hsl(${hue}, 100%, 65%)`;
          ctx.shadowBlur = 30; ctx.shadowColor = `hsl(${hue}, 100%, 65%)`;
          ctx.beginPath();
          ctx.ellipse(e.x, e.y, 36, 36, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        const bodyAngle = e.vx > 0 ? 0 : Math.PI;
        drawTank(ctx, e.x, e.y, bodyAngle, e.turretAngle, 44, 22,
          e.palette.body, e.palette.track, e.palette.turret, e.palette.glow,
          e.label, false, e.flashT, e.invT, ts);
      }

      // Explosions
      for (const ex of explosionsRef.current) {
        if (ex.flashAlpha > 0) {
          ctx.globalAlpha = ex.flashAlpha * 0.6;
          ctx.fillStyle = ex.color;
          ctx.shadowBlur = 30; ctx.shadowColor = ex.color;
          ctx.beginPath(); ctx.arc(ex.x, ex.y, ex.flashR, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        }
        for (const p of ex.particles) {
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10; ctx.shadowColor = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;
      }

      // Player tank
      if (phase === "playing" || phase === "dead") {
        const player2 = playerRef.current;
        drawTank(ctx, player2.x, PLAYER_Y, -Math.PI / 2, player2.turretAngle, 48, 24,
          "#5ec8ff", "#115588", "#2299dd", "#00f0ff",
          null, true, 0, player2.invT, ts);
      }

      // Float texts
      for (const f of floatTextsRef.current) {
        ctx.globalAlpha = Math.max(0, f.alpha);
        ctx.font = "bold 17px 'Orbitron', monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.shadowBlur = 14;
        ctx.shadowColor = f.good ? "#72f572" : "#ff5e87";
        ctx.fillStyle = f.good ? "#72f572" : "#ff5555";
        ctx.fillText(f.txt, f.x, f.y);
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      }

      // ── Idle overlay ──────────────────────────────────────────────────────
      if (phase === "idle") {
        ctx.fillStyle = "rgba(0,0,0,0.65)"; ctx.fillRect(0, 0, CW, CH);
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.font = "bold 11px 'Orbitron', monospace";
        ctx.fillStyle = `hsl(${hue}, 100%, 75%)`; ctx.shadowBlur = 14; ctx.shadowColor = `hsl(${hue}, 100%, 55%)`;
        ctx.fillText("MATH ARENA × NUMATIK AI", CW / 2, CH / 2 - 130);
        ctx.font = "bold 34px 'Orbitron', monospace";
        ctx.fillStyle = `hsl(${(hue+60)%360}, 100%, 80%)`; ctx.shadowBlur = 32; ctx.shadowColor = `hsl(${(hue+60)%360}, 100%, 60%)`;
        ctx.fillText("🪖 TEMBAK TANK!", CW / 2, CH / 2 - 72);
        ctx.font = "13px 'Orbitron', monospace"; ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.shadowBlur = 0;
        ["Gerakkan mouse → tank bergerak kiri-kanan!", "Turret otomatis mengincar mouse!", "Klik → tembak ke arah kursor!", "Hancurkan tank dengan jawaban BENAR! 🎯",
         "Tank musuh juga menembak balik — DODGE! 💨"].forEach((l, i) => ctx.fillText(l, CW / 2, CH / 2 - 8 + i * 22));
        ctx.font = "bold 17px 'Orbitron', monospace";
        ctx.fillStyle = `hsl(${hue}, 100%, 80%)`; ctx.shadowBlur = 20; ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        const pulse = 0.82 + 0.18 * Math.sin(ts / 310);
        ctx.globalAlpha = pulse; ctx.fillText("[ KLIK UNTUK MULAI ]", CW / 2, CH / 2 + 118); ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      }

      // ── Dead overlay ──────────────────────────────────────────────────────
      if (phase === "dead") {
        ctx.fillStyle = "rgba(0,0,0,0.72)"; ctx.fillRect(0, 0, CW, CH);
        ctx.textAlign = "center"; ctx.textBaseline = "middle";

        const finalScore = scoreRef.current;
        const category = finalScore >= 100 ? "HEBAT! 🌟" : finalScore >= 60 ? "BAGUS! 👍" : "COBA LAGI! 💪";
        const catColor = finalScore >= 100 ? "#FFD700" : finalScore >= 60 ? "#72f572" : "#ff9040";

        ctx.font = "bold 14px 'Orbitron', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.shadowBlur = 0;
        ctx.fillText("— HASIL KUIS —", CW / 2, CH / 2 - 110);

        ctx.font = `bold 36px 'Orbitron', monospace`;
        ctx.fillStyle = catColor; ctx.shadowBlur = 36; ctx.shadowColor = catColor;
        ctx.fillText(category, CW / 2, CH / 2 - 68);

        ctx.font = "bold 22px 'Orbitron', monospace";
        ctx.fillStyle = "#ffc94a"; ctx.shadowColor = "#ffc94a"; ctx.shadowBlur = 16;
        ctx.fillText(`Skor: ${finalScore} / 100`, CW / 2, CH / 2 - 18);

        ctx.font = "bold 14px 'Orbitron', monospace";
        ctx.fillStyle = "#aaa"; ctx.shadowBlur = 0;
        ctx.fillText("Q1: +30   Q2: +30   Q3: +40", CW / 2, CH / 2 + 22);

        ctx.font = "13px 'Orbitron', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.fillText(finalScore >= 100 ? "Sempurna! Kamu menguasai semua soal! 🎉" : "Terus semangat belajar rasio! 💪", CW / 2, CH / 2 + 60);

        ctx.font = "bold 15px 'Orbitron', monospace";
        ctx.fillStyle = `hsl(${hue}, 100%, 80%)`; ctx.shadowBlur = 18; ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        const p2 = 0.82 + 0.18 * Math.sin(ts / 310);
        ctx.globalAlpha = p2; ctx.fillText("[ KLIK UNTUK MAIN LAGI ]", CW / 2, CH / 2 + 105); ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [spawnEnemies, fireBullet, rerender]);

  return (
    <div className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`}>
      {isLight ? <Snowfall /> : <Starfield />}
      <div className="relative z-10 flex flex-col items-center gap-4 py-6 w-full">
        <canvas
          ref={canvasRef}
          width={CW} height={CH}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            cursor: "crosshair",
            borderRadius: 20,
            boxShadow: "0 0 40px rgba(0,200,255,0.4), 0 0 80px rgba(0,80,200,0.18)",
            maxWidth: "95vw", maxHeight: "90vh", objectFit: "contain",
          }}
        />
        <button onClick={() => navigate("/math-game-arena/umum")}
          className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
          ← Kembali ke Game Arena
        </button>
      </div>
    </div>
  );
};

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export default BattleTankPage;
