import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";
import MathGameIntro from "@/components/MathGameIntro";

const CW = 420;
const CH = 600;
const PLAYER_Y = CH - 80;
const BULLET_SPEED = 430;
const ENEMY_BULLET_SPEED = 195;
const QUIZ_INTERVAL = 40;
const QUIZ_BONUS_PTS = 150;
const QUIZ_BONUS_TIME = 6;
const TILE_SIZE = 40;

// ── Quiz Pool ────────────────────────────────────────────────────────────────
export interface MQ { q: string; opts: string[]; ans: number }

const DEFAULT_QUIZ_POOL: MQ[] = [
  { q: "FPB dari 24 dan 36 adalah ...", opts: ["12", "6", "8", "18"], ans: 0 },
  { q: "KPK dari 6 dan 8 adalah ...", opts: ["24", "12", "48", "16"], ans: 0 },
  { q: "Hasil dari 5² + 3² = ...", opts: ["34", "64", "25", "16"], ans: 0 },
  { q: "√144 = ...", opts: ["12", "14", "11", "13"], ans: 0 },
  { q: "Luas persegi sisi 9 cm = ... cm²", opts: ["81", "72", "36", "18"], ans: 0 },
  { q: "Keliling persegi panjang P=10, L=5 adalah ...", opts: ["30", "50", "15", "20"], ans: 0 },
  { q: "Nilai dari 3³ adalah ...", opts: ["27", "9", "81", "18"], ans: 0 },
  { q: "Pecahan ³⁄₄ dalam persen = ...", opts: ["75%", "70%", "80%", "65%"], ans: 0 },
  { q: "Rasio 12 : 8 dalam bentuk sederhana = ...", opts: ["3:2", "6:4", "4:3", "2:3"], ans: 0 },
  { q: "Jika 2x + 5 = 13, maka x = ...", opts: ["4", "3", "5", "8"], ans: 0 },
  { q: "Sudut dalam segitiga berjumlah ...", opts: ["180°", "90°", "360°", "270°"], ans: 0 },
  { q: "Luas lingkaran dengan r = 7 (π=22/7) = ...", opts: ["154", "44", "49", "77"], ans: 0 },
  { q: "Keliling lingkaran r = 14 (π=22/7) = ...", opts: ["88", "44", "28", "154"], ans: 0 },
  { q: "Bilangan prima di antara 10 dan 20 = ...", opts: ["11,13,17,19", "10,12,14,16", "11,15,17,19", "13,15,17,19"], ans: 0 },
  { q: "Volume kubus sisi 5 cm = ... cm³", opts: ["125", "25", "75", "150"], ans: 0 },
  { q: "Harga setelah diskon 20% dari Rp50.000 = ...", opts: ["Rp40.000", "Rp45.000", "Rp30.000", "Rp35.000"], ans: 0 },
  { q: "Persamaan garis y = 2x + 3, saat x=4, y = ...", opts: ["11", "10", "9", "14"], ans: 0 },
  { q: "Nilai rata-rata dari 6, 8, 10, 12 = ...", opts: ["9", "8", "10", "7"], ans: 0 },
  { q: "Peluang muncul angka 6 pada dadu = ...", opts: ["1/6", "1/3", "1/2", "1/4"], ans: 0 },
  { q: "Sudut lancip memiliki besar antara ...", opts: ["0°–90°", "90°–180°", "0°–45°", "90°–360°"], ans: 0 },
  { q: "Jika p = 3, nilai 4p² = ...", opts: ["36", "144", "12", "24"], ans: 0 },
  { q: "Faktor dari 36 berjumlah ...", opts: ["9", "6", "8", "12"], ans: 0 },
  { q: "0,75 dalam bentuk pecahan = ...", opts: ["3/4", "1/4", "7/10", "7/5"], ans: 0 },
  { q: "Hasil 15% × 200 = ...", opts: ["30", "15", "45", "25"], ans: 0 },
  { q: "Volume balok P=8, L=5, T=3 = ... cm³", opts: ["120", "80", "160", "240"], ans: 0 },
];

// ── Palettes ─────────────────────────────────────────────────────────────────
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

// ── Interfaces ────────────────────────────────────────────────────────────────
interface EnemyTank {
  id: number; x: number; y: number;
  vx: number; baseVx: number;
  palette: typeof ENEMY_PALETTES[0];
  alive: boolean;
  turretAngle: number;
  flashT: number; invT: number;
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

// ── Helpers ───────────────────────────────────────────────────────────────────
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

interface BattleTankPageProps {
  questions?: MQ[];
  topicLabel?: string;
  backPath?: string;
  homePath?: string;
}

const BattleTankPage = ({
  questions,
  topicLabel,
  backPath,
  homePath = "/ruang-untuk-guru/numatik-game",
}: BattleTankPageProps = {}) => {
  const QUIZ_POOL = questions && questions.length > 0 ? questions : DEFAULT_QUIZ_POOL;
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastRef = useRef(0);

  const phaseRef = useRef<Phase>("idle");
  const guruQuiz = useGuruQuiz(phaseRef);
  const enemiesRef = useRef<EnemyTank[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const explosionsRef = useRef<Explosion[]>([]);
  const floatTextsRef = useRef<FloatText[]>([]);
  const groundMarksRef = useRef<GroundMark[]>([]);

  const playerRef = useRef({ x: CW / 2, targetX: CW / 2, turretAngle: -Math.PI / 2, invT: 0 });
  const mouseRef = useRef({ x: CW / 2, y: CH / 2 });

  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const bestRef = useRef(0);
  const levelRef = useRef(1);
  const timerRef = useRef(120);
  const timerAccRef = useRef(0);
  const comboRef = useRef(0);
  const comboAccRef = useRef(0);
  const shakeRef = useRef(0);
  const hueRef = useRef(0);
  const tileOffsetRef = useRef(0);
  const waveRef = useRef(1);

  const quizNextRef = useRef(QUIZ_INTERVAL);
  const quizActiveRef = useRef(false);
  const usedQuizRef = useRef<Set<number>>(new Set());

  const [, forceRender] = useState(0);
  const rerender = useCallback(() => forceRender(n => n + 1), []);
  const [activeQuiz, setActiveQuiz] = useState<MQ | null>(null);
  const [quizCountdown, setQuizCountdown] = useState(QUIZ_INTERVAL);

  // ── Spawn wave ────────────────────────────────────────────────────────────
  const spawnWave = useCallback(() => {
    const wave = waveRef.current;
    const cols = Math.min(4, 2 + Math.floor(wave / 2));
    const rows = Math.min(3, 1 + Math.floor(wave / 3));
    const total = rows * cols;
    const enemies: EnemyTank[] = [];
    const gapX = (CW - 80) / (cols + 1);
    for (let r = 0; r < rows; r++) {
      const rowDir = r % 2 === 0 ? 1 : -1;
      const baseSpd = 40 + wave * 8;
      for (let c = 0; c < cols; c++) {
        const spd = baseSpd + Math.random() * 20;
        const pal = ENEMY_PALETTES[~~(Math.random() * ENEMY_PALETTES.length)];
        enemies.push({
          id: _id++,
          x: 40 + gapX * (c + 1),
          y: 150 + r * 105,
          vx: rowDir * spd, baseVx: spd,
          palette: pal, alive: true,
          turretAngle: Math.PI / 2,
          flashT: 0, invT: 0,
          fireAcc: Math.random() * 3,
          fireInterval: 3 + Math.random() * 3,
          wobbleT: Math.random() * Math.PI * 2,
          scatterVx: 0, scatterVy: 0, scatterT: 0,
        });
      }
    }
    enemiesRef.current = enemies;
    void total;
  }, []);

  // ── Quiz helpers ──────────────────────────────────────────────────────────
  const triggerQuiz = useCallback(() => {
    if (quizActiveRef.current) return;
    quizActiveRef.current = true;
    let idx = ~~(Math.random() * QUIZ_POOL.length);
    if (usedQuizRef.current.size >= QUIZ_POOL.length) usedQuizRef.current.clear();
    let guard = 0;
    while (usedQuizRef.current.has(idx) && guard < 60) {
      idx = ~~(Math.random() * QUIZ_POOL.length);
      guard++;
    }
    usedQuizRef.current.add(idx);
    setActiveQuiz(QUIZ_POOL[idx]);
  }, []);

  const handleQuizAnswer = useCallback((optIdx: number) => {
    if (!quizActiveRef.current || !activeQuiz) return;
    if (optIdx === activeQuiz.ans) {
      scoreRef.current += QUIZ_BONUS_PTS;
      timerRef.current = Math.min(180, timerRef.current + QUIZ_BONUS_TIME);
      if (scoreRef.current > bestRef.current) bestRef.current = scoreRef.current;
      floatTextsRef.current.push({ x: CW / 2, y: CH / 2 - 20, txt: `✅ BENAR! +${QUIZ_BONUS_PTS} pts`, alpha: 1, vy: -80, good: true });
      playPopSound();
    } else {
      timerRef.current = Math.max(5, timerRef.current - 5);
      floatTextsRef.current.push({ x: CW / 2, y: CH / 2 - 20, txt: "❌ Salah! −5 detik", alpha: 1, vy: -80, good: false });
      shakeRef.current = 0.4;
    }
    quizActiveRef.current = false;
    quizNextRef.current = QUIZ_INTERVAL;
    setActiveQuiz(null);
    rerender();
  }, [activeQuiz, rerender]);

  // ── Explosions / Bullets ──────────────────────────────────────────────────
  const addExplosion = (x: number, y: number, color: string, big: boolean) => {
    const count = big ? 28 : 14;
    explosionsRef.current.push({
      x, y, color,
      flashAlpha: 1, flashR: big ? 50 : 28,
      particles: Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const spd = (big ? 130 : 70) + Math.random() * (big ? 210 : 100);
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

  // ── Start / Reset ─────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    scoreRef.current = 0; livesRef.current = 3; levelRef.current = 1;
    timerRef.current = 120; timerAccRef.current = 0;
    comboRef.current = 0; comboAccRef.current = 0;
    shakeRef.current = 0; waveRef.current = 1;
    quizNextRef.current = QUIZ_INTERVAL;
    quizActiveRef.current = false;
    usedQuizRef.current.clear();
    bulletsRef.current = []; explosionsRef.current = [];
    floatTextsRef.current = []; groundMarksRef.current = [];
    playerRef.current = { x: CW / 2, targetX: CW / 2, turretAngle: -Math.PI / 2, invT: 0 };
    setActiveQuiz(null);
    spawnWave();
    phaseRef.current = "playing";
    rerender();
  }, [spawnWave, rerender]);

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
    if (phaseRef.current !== "playing" || quizActiveRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (CW / rect.width);
    const cy = (e.clientY - rect.top) * (CH / rect.height);
    const px = playerRef.current.x;
    const ang = playerRef.current.turretAngle;
    fireBullet(true, px + Math.cos(ang) * 28, PLAYER_Y + Math.sin(ang) * 28, cx, cy, "#00f0ff", "#00f0ff");
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
    if (phaseRef.current !== "playing" || quizActiveRef.current) return;
    const px = playerRef.current.x, ang = playerRef.current.turretAngle;
    fireBullet(true, px + Math.cos(ang) * 28, PLAYER_Y + Math.sin(ang) * 28, mouseRef.current.x, mouseRef.current.y, "#00f0ff", "#00f0ff");
    playPopSound();
  }, [startGame, fireBullet]);

  // ── Draw tank (top-down) ──────────────────────────────────────────────────
  const drawTank = (
    ctx: CanvasRenderingContext2D, x: number, y: number,
    bodyAngle: number, turretAngle: number,
    bw: number, bh: number,
    bodyColor: string, trackColor: string, turretColor: string,
    glowColor: string, isPlayer: boolean, flashT: number, invT: number, ts: number,
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.shadowBlur = isPlayer ? 22 : 18;
    ctx.shadowColor = flashT > 0 ? "#ff3333" : glowColor;
    ctx.rotate(bodyAngle);

    ctx.fillStyle = trackColor;
    ctx.beginPath(); roundRect(ctx, -bw / 2 - 5, -bh / 2 - 4, bw + 10, 7, 3); ctx.fill();
    ctx.beginPath(); roundRect(ctx, -bw / 2 - 5, bh / 2 - 3, bw + 10, 7, 3); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 1;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath(); ctx.moveTo(i * (bw / 5), -bh / 2 - 4); ctx.lineTo(i * (bw / 5), -bh / 2 + 3); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(i * (bw / 5), bh / 2 - 3); ctx.lineTo(i * (bw / 5), bh / 2 + 4); ctx.stroke();
    }

    ctx.fillStyle = flashT > 0 ? "#ff5555" : bodyColor;
    ctx.shadowBlur = 0;
    ctx.beginPath(); roundRect(ctx, -bw / 2, -bh / 2, bw, bh, 5); ctx.fill();
    const bg = ctx.createLinearGradient(-bw / 2, -bh / 2, -bw / 2, bh / 2);
    bg.addColorStop(0, "rgba(255,255,255,0.22)"); bg.addColorStop(0.5, "rgba(255,255,255,0.06)"); bg.addColorStop(1, "rgba(0,0,0,0.15)");
    ctx.fillStyle = bg;
    ctx.beginPath(); roundRect(ctx, -bw / 2, -bh / 2, bw, bh, 5); ctx.fill();
    ctx.rotate(-bodyAngle);

    ctx.rotate(turretAngle);
    ctx.shadowBlur = 14; ctx.shadowColor = flashT > 0 ? "#ff3333" : glowColor;
    ctx.fillStyle = turretColor;
    ctx.beginPath(); ctx.ellipse(0, 0, bh * 0.45, bh * 0.45, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = trackColor;
    ctx.beginPath(); roundRect(ctx, bh * 0.38, -3, bw * 0.48, 6, 3); ctx.fill();
    ctx.shadowBlur = 12; ctx.shadowColor = isPlayer ? "#00f0ff" : glowColor;
    ctx.fillStyle = isPlayer ? "#00f0ff" : glowColor;
    ctx.beginPath(); ctx.arc(bh * 0.38 + bw * 0.48, 0, 4, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.rotate(-turretAngle);

    if (isPlayer && invT > 0) {
      const sa = Math.min(1, invT * 2) * (0.5 + 0.5 * Math.sin(ts / 80));
      ctx.globalAlpha = sa; ctx.strokeStyle = "#00f0ff"; ctx.lineWidth = 3;
      ctx.shadowBlur = 20; ctx.shadowColor = "#00f0ff";
      ctx.beginPath(); ctx.arc(0, 0, bw * 0.75, 0, Math.PI * 2); ctx.stroke();
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }
    ctx.restore();
  };

  // ── Quiz countdown display sync ───────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      if (phaseRef.current === "playing" && !quizActiveRef.current) {
        setQuizCountdown(Math.ceil(quizNextRef.current));
      }
    }, 500);
    return () => clearInterval(id);
  }, []);

  // ── Main loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = (ts: number) => {
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05);
      lastRef.current = ts;
      if (guruQuiz.isPausedRef.current) { rafRef.current = requestAnimationFrame(loop); return; }
      hueRef.current = (hueRef.current + dt * 18) % 360;
      tileOffsetRef.current = (tileOffsetRef.current + dt * 20) % TILE_SIZE;
      const hue = hueRef.current;
      const phase = phaseRef.current;

      // ── Player update ────────────────────────────────────────────────────
      const player = playerRef.current;
      player.x += (Math.max(30, Math.min(CW - 30, mouseRef.current.x)) - player.x) * Math.min(1, dt * 10);
      player.turretAngle = Math.atan2(mouseRef.current.y - PLAYER_Y, mouseRef.current.x - player.x);
      if (player.invT > 0) player.invT = Math.max(0, player.invT - dt);
      if (shakeRef.current > 0) shakeRef.current = Math.max(0, shakeRef.current - dt * 2.5);

      if (phase === "playing" && !quizActiveRef.current) {
        // ── Timer countdown ────────────────────────────────────────────────
        timerAccRef.current += dt;
        if (timerAccRef.current >= 1) {
          timerAccRef.current -= 1;
          timerRef.current--;
          if (timerRef.current <= 0) { timerRef.current = 0; phaseRef.current = "dead"; rerender(); }
        }

        // ── Quiz countdown ─────────────────────────────────────────────────
        quizNextRef.current -= dt;
        if (quizNextRef.current <= 0) { quizNextRef.current = 0; triggerQuiz(); }

        // ── Combo decay ───────────────────────────────────────────────────
        if (comboRef.current > 0) {
          comboAccRef.current += dt;
          if (comboAccRef.current > 3.5) { comboRef.current = 0; comboAccRef.current = 0; }
        }

        // ── Enemy update ──────────────────────────────────────────────────
        for (const e of enemiesRef.current) {
          if (!e.alive) continue;
          e.wobbleT += dt * 2;
          if (e.flashT > 0) e.flashT = Math.max(0, e.flashT - dt * 3);
          if (e.invT > 0) e.invT = Math.max(0, e.invT - dt);
          if (e.scatterT > 0) {
            e.x += e.scatterVx * dt; e.y += e.scatterVy * dt;
            e.scatterT = Math.max(0, e.scatterT - dt);
            e.x = Math.max(30, Math.min(CW - 30, e.x));
            e.y = Math.max(130, Math.min(PLAYER_Y - 120, e.y));
          } else {
            e.x += e.vx * dt;
          }
          if (e.x < 32) { e.x = 32; e.vx = Math.abs(e.vx); }
          if (e.x > CW - 32) { e.x = CW - 32; e.vx = -Math.abs(e.vx); }
          e.turretAngle = Math.atan2(PLAYER_Y - e.y, player.x - e.x);
          e.fireAcc += dt;
          if (e.fireAcc >= e.fireInterval) {
            e.fireAcc = 0; e.fireInterval = 3 + Math.random() * 4;
            const ang = e.turretAngle;
            fireBullet(false, e.x + Math.cos(ang) * 26, e.y + Math.sin(ang) * 26, player.x, PLAYER_Y, e.palette.glow, e.palette.glow);
          }
        }

        // ── Respawn if all dead ───────────────────────────────────────────
        if (enemiesRef.current.every(e => !e.alive)) {
          waveRef.current++;
          levelRef.current = Math.floor(waveRef.current / 2) + 1;
          spawnWave(); rerender();
        }

        // ── Bullet update ─────────────────────────────────────────────────
        for (const b of bulletsRef.current) {
          b.trail.push({ x: b.x, y: b.y, alpha: 0.6 });
          if (b.trail.length > 10) b.trail.shift();
          for (const t of b.trail) t.alpha -= dt * 5;
          b.x += b.vx * dt; b.y += b.vy * dt;

          if (b.fromPlayer) {
            for (const e of enemiesRef.current) {
              if (!e.alive || e.invT > 0) continue;
              const dx = b.x - e.x, dy = b.y - e.y;
              if (Math.sqrt(dx * dx + dy * dy) < 26) {
                bulletsRef.current = bulletsRef.current.filter(bb => bb !== b);
                comboRef.current++; comboAccRef.current = 0;
                const combo = comboRef.current;
                const pts = (15 + levelRef.current * 5) * Math.min(combo, 5);
                scoreRef.current += pts;
                if (scoreRef.current > bestRef.current) bestRef.current = scoreRef.current;
                addExplosion(e.x, e.y, e.palette.glow, true);
                for (const oe of enemiesRef.current) {
                  if (oe === e || !oe.alive) continue;
                  const adx = oe.x - e.x, ady = oe.y - e.y;
                  const dist = Math.sqrt(adx * adx + ady * ady) || 1;
                  oe.scatterVx = (adx / dist) * 160; oe.scatterVy = (ady / dist) * 160; oe.scatterT = 0.4;
                }
                e.alive = false;
                const label = combo >= 3 ? `💥 COMBO ×${combo}! +${pts}` : `+${pts}`;
                floatTextsRef.current.push({ x: e.x, y: e.y - 30, txt: label, alpha: 1, vy: -90, good: true });
                playPopSound();
                break;
              }
            }
          } else {
            if (player.invT <= 0) {
              const dx = b.x - player.x, dy = b.y - PLAYER_Y;
              if (Math.sqrt(dx * dx + dy * dy) < 22) {
                bulletsRef.current = bulletsRef.current.filter(bb => bb !== b);
                livesRef.current--; player.invT = 2;
                shakeRef.current = 0.5; comboRef.current = 0; comboAccRef.current = 0;
                addExplosion(player.x, PLAYER_Y, "#00f0ff", false);
                floatTextsRef.current.push({ x: player.x, y: PLAYER_Y - 30, txt: "💥 Kena!", alpha: 1, vy: -70, good: false });
                if (livesRef.current <= 0) { phaseRef.current = "dead"; rerender(); }
              }
            }
          }
        }
        bulletsRef.current = bulletsRef.current.filter(b => b.x > -20 && b.x < CW + 20 && b.y > -20 && b.y < CH + 20);
      }

      // ── Explosions, floats, marks ─────────────────────────────────────────
      for (const ex of explosionsRef.current) {
        ex.flashAlpha = Math.max(0, ex.flashAlpha - dt * 4); ex.flashR += dt * 60;
        for (const p of ex.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 120 * dt; p.alpha -= dt * 1.8; p.r *= 0.97; }
        ex.particles = ex.particles.filter(p => p.alpha > 0);
      }
      explosionsRef.current = explosionsRef.current.filter(ex => ex.flashAlpha > 0 || ex.particles.length > 0);
      for (const f of floatTextsRef.current) { f.y += f.vy * dt; f.alpha -= dt * 1.2; }
      floatTextsRef.current = floatTextsRef.current.filter(f => f.alpha > 0);
      for (const m of groundMarksRef.current) m.alpha -= dt * 0.3;
      groundMarksRef.current = groundMarksRef.current.filter(m => m.alpha > 0);

      // ── Draw ──────────────────────────────────────────────────────────────
      const sx = shakeRef.current > 0 ? (Math.random() - 0.5) * shakeRef.current * 12 : 0;
      const sy = shakeRef.current > 0 ? (Math.random() - 0.5) * shakeRef.current * 5 : 0;
      ctx.save(); ctx.translate(sx, sy);

      // Ground
      const groundGrad = ctx.createLinearGradient(0, 108, 0, CH);
      groundGrad.addColorStop(0, `hsl(${(hue + 120) % 360}, 28%, 14%)`);
      groundGrad.addColorStop(1, `hsl(${(hue + 120) % 360}, 20%, 9%)`);
      ctx.fillStyle = groundGrad; ctx.fillRect(0, 108, CW, CH);

      ctx.strokeStyle = `hsla(${(hue + 120) % 360}, 30%, 30%, 0.22)`; ctx.lineWidth = 1;
      const off = tileOffsetRef.current;
      for (let x = -TILE_SIZE + (off % TILE_SIZE); x < CW + TILE_SIZE; x += TILE_SIZE) {
        ctx.beginPath(); ctx.moveTo(x, 108); ctx.lineTo(x, CH); ctx.stroke();
      }
      for (let y = 108 + (off % TILE_SIZE); y < CH + TILE_SIZE; y += TILE_SIZE) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke();
      }

      // Ground marks
      for (const m of groundMarksRef.current) {
        ctx.globalAlpha = m.alpha; ctx.fillStyle = m.color;
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // HUD sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 108);
      skyGrad.addColorStop(0, `hsl(${hue}, 70%, 9%)`);
      skyGrad.addColorStop(1, `hsl(${hue}, 50%, 15%)`);
      ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, CW, 108);
      ctx.strokeStyle = `hsla(${hue}, 80%, 55%, 0.35)`; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, 108); ctx.lineTo(CW, 108); ctx.stroke();

      // HUD text
      const drawHUD = (text: string, x: number, y: number, size: number, color: string, align: CanvasTextAlign = "left") => {
        ctx.fillStyle = color; ctx.font = `900 ${size}px 'Orbitron', monospace`;
        ctx.textAlign = align; ctx.textBaseline = "middle";
        ctx.shadowBlur = 12; ctx.shadowColor = color;
        ctx.fillText(text, x, y); ctx.shadowBlur = 0;
      };
      drawHUD("SHOOT TANK", CW / 2, 22, 17, "#00f0ff", "center");
      drawHUD(`SKOR: ${scoreRef.current}`, 12, 52, 12, "#bbf7d0", "left");
      drawHUD(`TERBAIK: ${bestRef.current}`, 12, 70, 10, "#fde047", "left");
      drawHUD(`❤️ ${"♥".repeat(Math.max(0, livesRef.current))}`, CW / 2, 52, 13, "#ff5e87", "center");
      drawHUD(`LVL ${levelRef.current}`, CW / 2, 70, 11, "#c4b5fd", "center");
      const timer = timerRef.current;
      drawHUD(`⏱ ${timer}s`, CW - 12, 52, 13, timer <= 15 ? "#ff5e87" : "#fde047", "right");
      if (!quizActiveRef.current && phase === "playing") {
        const qNext = Math.ceil(quizNextRef.current);
        drawHUD(`❓ ${qNext}s`, CW - 12, 70, 10, "#a5f3fc", "right");
      }

      // Combo bar
      if (comboRef.current >= 2) {
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = "#fde047"; ctx.font = `900 14px 'Orbitron', monospace`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.shadowBlur = 14; ctx.shadowColor = "#fde047";
        ctx.fillText(`🔥 COMBO ×${comboRef.current}`, CW / 2, 88);
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      }

      // Enemy tanks
      for (const e of enemiesRef.current) {
        if (!e.alive) continue;
        drawTank(ctx, e.x, e.y, 0, e.turretAngle, 42, 30, e.palette.body, e.palette.track, e.palette.turret, e.palette.glow, false, e.flashT, e.invT, ts);
      }

      // Player tank
      drawTank(ctx, player.x, PLAYER_Y, 0, player.turretAngle, 46, 32, "#00e6d2", "#005544", "#00bbaa", "#00f0ff", true, 0, player.invT, ts);

      // Bullets & trails
      for (const b of bulletsRef.current) {
        for (const t of b.trail) {
          if (t.alpha <= 0) continue;
          ctx.globalAlpha = t.alpha * 0.4;
          ctx.fillStyle = b.color; ctx.beginPath(); ctx.arc(t.x, t.y, b.r * 0.6, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 18; ctx.shadowColor = b.glow; ctx.fillStyle = b.color;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      // Explosions
      for (const ex of explosionsRef.current) {
        if (ex.flashAlpha > 0) {
          ctx.globalAlpha = ex.flashAlpha * 0.35;
          ctx.fillStyle = ex.color;
          ctx.beginPath(); ctx.arc(ex.x, ex.y, ex.flashR, 0, Math.PI * 2); ctx.fill();
        }
        for (const p of ex.particles) {
          ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color;
          ctx.shadowBlur = 10; ctx.shadowColor = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
        }
      }
      ctx.globalAlpha = 1;

      // Float texts
      for (const f of floatTextsRef.current) {
        ctx.globalAlpha = f.alpha;
        ctx.fillStyle = f.good ? "#bbf7d0" : "#fecaca";
        ctx.font = `900 13px 'Orbitron', monospace`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.shadowBlur = 12; ctx.shadowColor = f.good ? "#22c55e" : "#ef4444";
        ctx.fillText(f.txt, f.x, f.y); ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      // Dead overlay (idle now uses fancy HTML overlay below)
      if (phase === "dead") {
        ctx.fillStyle = "rgba(2,6,23,0.78)"; ctx.fillRect(30, 185, CW - 60, 250);
        ctx.strokeStyle = "#ff5e87"; ctx.lineWidth = 3; ctx.strokeRect(30, 185, CW - 60, 250);
        const oc = "#ff5e87";
        drawHUD("PERMAINAN SELESAI", CW / 2, 228, 20, oc, "center");
        drawHUD(`Skor: ${scoreRef.current}`, CW / 2, 273, 15, "#ffffff", "center");
        drawHUD("Tembak semua tank musuh!", CW / 2, 318, 13, "#bbf7d0", "center");
        drawHUD("Jawab soal tiap 40 detik = +150 pts", CW / 2, 348, 11, "#fde047", "center");
        drawHUD("Hindari peluru musuh!", CW / 2, 376, 12, "#fecaca", "center");
        drawHUD(`Terbaik: ${bestRef.current}`, CW / 2, 408, 13, "#c4b5fd", "center");
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [rerender, spawnWave, fireBullet, triggerQuiz]);

  if (phaseRef.current === "idle") {
    return (
      <MathGameIntro
        gameTitle="SHOOT TANK"
        subtitle="🎯 MEDAN PERTEMPURAN 🎯"
        topicLabel={topicLabel}
        heroEmoji="💥"
        startLabel="MULAI BERTEMPUR"
        theme="battle"
        onStart={startGame}
        onBack={() => { playPopSound(); if (backPath) navigate(backPath); else navigate(-1); }}
        onHome={() => { playPopSound(); navigate(homePath); }}
        bestLabel={bestRef.current > 0 ? `Rekor Tertinggi: ${bestRef.current}` : undefined}
        instructions={[
          { text: <>Gerakkan <strong className="text-yellow-300">mouse / sentuh</strong> layar untuk membidik</> },
          { text: <><strong className="text-yellow-300">Klik / tap</strong> untuk menembakkan peluru ke arah bidikan</> },
          { text: <>Hancurkan semua tank musuh dan hindari peluru mereka — kamu punya <strong className="text-pink-300">3 nyawa</strong></> },
          { text: <>Tiap <strong className="text-yellow-300">{QUIZ_INTERVAL} detik</strong> muncul soal bonus = <strong className="text-green-400">+{QUIZ_BONUS_PTS} pts</strong></> },
        ]}
      />
    );
  }

  return (
    <div
      className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`}
      style={{ height: '100dvh' }}
    >
      {isLight ? <Snowfall /> : <Starfield />}

      {/* Header */}
      <div className="relative z-10 w-full shrink-0 flex items-center justify-between pt-2 pb-1 px-3 gap-2">
        <button
          onClick={() => { playPopSound(); if (backPath) navigate(backPath); else navigate(-1); }}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:opacity-90 transition-opacity cursor-pointer"
          title="Kembali ke pilihan game"
        >
          <span className="text-base leading-none">←</span>
          <span className="hidden sm:inline">Kembali</span>
        </button>
        <div className="text-center flex-1">
          <h1 className="font-display text-lg sm:text-2xl font-bold text-primary text-glow-cyan leading-tight">
            💥 Shoot Tank
          </h1>
          <p className="font-body text-[10px] text-white/50 mt-0.5">
            {topicLabel ? topicLabel : "🖱️ Mouse/sentuh untuk membidik · Klik/tap untuk menembak"}
          </p>
        </div>
        <button
          onClick={() => { playPopSound(); navigate(homePath); }}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:opacity-90 transition-opacity cursor-pointer"
          title="Menu Utama"
        >
          <span className="text-base leading-none">🏠</span>
          <span className="hidden sm:inline">Home</span>
        </button>
      </div>

      {/* Canvas – fills remaining space */}
      <div className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center px-2 py-1">
        <div className="relative inline-flex rounded-[28px] p-2 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 shadow-[0_0_45px_rgba(0,240,255,0.35)]">
          <canvas
            ref={canvasRef}
            width={CW} height={CH}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="block rounded-[20px] bg-slate-950 cursor-crosshair select-none touch-none border-4 border-slate-900"
            style={{ maxHeight: 'calc(100dvh - 120px)', width: 'auto', maxWidth: '96vw' }}
          />

          {activeQuiz && (
            <div className="absolute inset-0 flex items-center justify-center z-20 rounded-[28px] p-3">
              <div className="w-full max-w-[390px] mx-auto bg-slate-950/95 border-2 border-cyan-400 rounded-2xl p-5 shadow-[0_0_40px_rgba(0,240,255,0.4)]">
                <div className="text-center mb-3">
                  <span className="inline-flex items-center gap-1 bg-cyan-500/20 border border-cyan-400/50 rounded-full px-3 py-1 text-cyan-300 text-xs font-bold tracking-widest">
                    ❓ SOAL BONUS +{QUIZ_BONUS_PTS} PTS
                  </span>
                </div>
                <p className="text-white font-display text-sm font-bold text-center mb-4 leading-snug">
                  {activeQuiz.q}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {activeQuiz.opts.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuizAnswer(i)}
                      className="bg-slate-800 hover:bg-cyan-700/60 border border-slate-600 hover:border-cyan-400 rounded-xl py-3 px-2 text-white text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <p className="text-center text-white/40 text-[10px] mt-3 font-body">
                  Benar = +{QUIZ_BONUS_PTS} pts & +{QUIZ_BONUS_TIME} detik · Salah = −5 detik
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="relative z-10 w-full shrink-0 flex flex-wrap justify-center gap-2 pb-2 px-2">
        <button
          onClick={startGame}
          className="rounded-full bg-accent px-5 py-2 text-xs font-bold text-black hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30"
        >
          Mulai / Ulangi
        </button>
        <button
          onClick={() => { playPopSound(); if (backPath) navigate(backPath); else navigate(-1); }}
          className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-bold text-white hover:bg-white/20 transition-colors"
        >
          Kembali
        </button>
      </div>

      <GuruQuizOverlay {...guruQuiz} />
    </div>
  );
};

export default BattleTankPage;
