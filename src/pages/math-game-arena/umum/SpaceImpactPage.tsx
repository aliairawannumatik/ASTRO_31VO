import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";
import MathGameIntro from "@/components/MathGameIntro";

// ── Canvas dimensions ─────────────────────────────────────────────────────
const CW = 480;
const CH = 520;

// ── Types ─────────────────────────────────────────────────────────────────
interface Vec2 { x: number; y: number }
interface Bullet { x: number; y: number; vx: number; vy: number; isPlayer: boolean; color: string }
interface Enemy {
  x: number; y: number; w: number; h: number;
  hp: number; maxHp: number;
  vx: number; vy: number;
  value: number; correct: boolean;
  color: string; glowColor: string;
  shape: "saucer" | "fighter" | "bomber";
  pulse: number;
  shootTimer: number;
}
interface Particle {
  x: number; y: number; vx: number; vy: number;
  alpha: number; color: string; r: number; life: number;
}
interface Star { x: number; y: number; r: number; speed: number; alpha: number }
interface PowerUp { x: number; y: number; type: "shield" | "rapid" | "spread" }

type Phase = "idle" | "playing" | "dead" | "levelup" | "win";

// ── Math question generator ───────────────────────────────────────────────
export interface MQ { q: string; ans: number }
const makeQ = (level: number): MQ => {
  const difficulty = Math.min(level, 5);
  const type = Math.floor(Math.random() * (3 + difficulty));
  switch (type % 8) {
    case 0: {
      const a = 2 + Math.floor(Math.random() * (4 + difficulty * 2));
      const b = 2 + Math.floor(Math.random() * (4 + difficulty * 2));
      return { q: `${a} × ${b}`, ans: a * b };
    }
    case 1: {
      const a = 10 + Math.floor(Math.random() * (50 + difficulty * 10));
      const b = 10 + Math.floor(Math.random() * (50 + difficulty * 10));
      return { q: `${a} + ${b}`, ans: a + b };
    }
    case 2: {
      const b = 5 + Math.floor(Math.random() * (10 + difficulty * 5));
      const a = b + 5 + Math.floor(Math.random() * 50);
      return { q: `${a} − ${b}`, ans: a - b };
    }
    case 3: {
      const b = 2 + Math.floor(Math.random() * 9);
      const a = b * (2 + Math.floor(Math.random() * 9));
      return { q: `${a} ÷ ${b}`, ans: a / b };
    }
    case 4: {
      const sq = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169][Math.floor(Math.random() * 12)];
      return { q: `√${sq}`, ans: Math.round(Math.sqrt(sq)) };
    }
    case 5: {
      const a = 2 + Math.floor(Math.random() * 8);
      return { q: `${a}²`, ans: a * a };
    }
    case 6: {
      const a = 2 + Math.floor(Math.random() * 10);
      return { q: `FPB(${a * 2}, ${a * 3})`, ans: a };
    }
    default: {
      const a = 2 + Math.floor(Math.random() * 12);
      const b = 2 + Math.floor(Math.random() * 12);
      return { q: `KPK(${a}, ${b})`, ans: (a * b) / gcd(a, b) };
    }
  }
};
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const makeWrong = (ans: number, used: Set<number>): number => {
  let v: number, tries = 0;
  do {
    const d = 1 + Math.floor(Math.random() * 20);
    v = ans + (Math.random() < 0.5 ? d : -d);
    tries++;
  } while ((used.has(v) || v === ans) && tries < 100);
  return v;
};

// ── Enemy colors per shape ────────────────────────────────────────────────
const ENEMY_COLORS: Record<string, { color: string; glow: string }> = {
  saucer: { color: "#a855f7", glow: "#d8b4fe" },
  fighter: { color: "#06b6d4", glow: "#67e8f9" },
  bomber: { color: "#f97316", glow: "#fdba74" },
};

// ── Draw helpers ──────────────────────────────────────────────────────────
function drawSaucer(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, glow: string, pulse: number) {
  ctx.save();
  ctx.shadowColor = glow;
  ctx.shadowBlur = 12 + pulse * 4;
  // body ellipse
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 3, 0, 0, Math.PI * 2);
  ctx.fill();
  // dome
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h / 2 - 2, w / 5, h / 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // underlight
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h / 2 + h / 4, w / 3, h / 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFighter(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, glow: string, pulse: number) {
  ctx.save();
  ctx.shadowColor = glow;
  ctx.shadowBlur = 10 + pulse * 3;
  // body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + w, y + h / 2);
  ctx.lineTo(x + w / 4, y);
  ctx.lineTo(x, y + h / 2);
  ctx.lineTo(x + w / 4, y + h);
  ctx.closePath();
  ctx.fill();
  // wings
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + h / 3);
  ctx.lineTo(x + w / 4, y - 2);
  ctx.lineTo(x + w / 5, y + h / 2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + h * 2 / 3);
  ctx.lineTo(x + w / 4, y + h + 2);
  ctx.lineTo(x + w / 5, y + h / 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawBomber(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, glow: string, pulse: number) {
  ctx.save();
  ctx.shadowColor = glow;
  ctx.shadowBlur = 14 + pulse * 5;
  // main body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x + w * 0.1, y + h * 0.2, w * 0.8, h * 0.6, 6);
  ctx.fill();
  // cockpit
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(x + w * 0.75, y + h / 2, w * 0.12, h * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();
  // engines
  ctx.fillStyle = "#ff4400";
  ctx.shadowColor = "#ff6600";
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.ellipse(x + w * 0.15, y + h * 0.35, w * 0.08, h * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + w * 0.15, y + h * 0.65, w * 0.08, h * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPlayerShip(ctx: CanvasRenderingContext2D, x: number, y: number, shield: boolean, rapid: boolean, spread: boolean) {
  const w = 48, h = 30;
  ctx.save();
  if (shield) {
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w * 0.65, h * 0.9, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.shadowColor = "#00ff88";
  ctx.shadowBlur = 12;
  // fuselage
  ctx.fillStyle = "#00ff88";
  ctx.beginPath();
  ctx.moveTo(x + w, y + h / 2);
  ctx.lineTo(x + w / 5, y + 4);
  ctx.lineTo(x + 4, y + h / 2);
  ctx.lineTo(x + w / 5, y + h - 4);
  ctx.closePath();
  ctx.fill();
  // wings
  ctx.fillStyle = "#00cc66";
  ctx.beginPath();
  ctx.moveTo(x + w * 0.55, y + h / 2 - 2);
  ctx.lineTo(x + w * 0.35, y - 3);
  ctx.lineTo(x + w * 0.2, y + h / 2 - 3);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + w * 0.55, y + h / 2 + 2);
  ctx.lineTo(x + w * 0.35, y + h + 3);
  ctx.lineTo(x + w * 0.2, y + h / 2 + 3);
  ctx.closePath();
  ctx.fill();
  // cockpit
  ctx.fillStyle = "#80ffcc";
  ctx.shadowColor = "#80ffcc";
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.ellipse(x + w * 0.65, y + h / 2, w * 0.12, h * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  // engine glow
  ctx.fillStyle = rapid ? "#ff6600" : "#ff4400";
  ctx.shadowColor = rapid ? "#ff8800" : "#ff4400";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.ellipse(x + 5, y + h / 2, 5, rapid ? 9 : 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // spread indicator
  if (spread) {
    ctx.fillStyle = "#facc15";
    ctx.shadowColor = "#facc15";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(x + w * 0.4, y + 5, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w * 0.4, y + h - 5, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function spawnWave(level: number, q: MQ): Enemy[] {
  const enemies: Enemy[] = [];
  const used = new Set<number>([q.ans]);
  const shapes: Array<"saucer" | "fighter" | "bomber"> = ["saucer", "fighter", "bomber"];
  const totalEnemies = 4 + level;
  const correctIdx = Math.floor(Math.random() * totalEnemies);

  for (let i = 0; i < totalEnemies; i++) {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const { color, glow } = ENEMY_COLORS[shape];
    const isCorrect = i === correctIdx;
    const value = isCorrect ? q.ans : makeWrong(q.ans, used);
    if (!isCorrect) used.add(value);
    const col = Math.floor(Math.random() * 3);
    const row = Math.floor(Math.random() * 4);
    const w = shape === "bomber" ? 46 : 40;
    const h = shape === "bomber" ? 28 : 24;
    const hp = 3;
    enemies.push({
      x: CW + 50 + col * 140 + Math.random() * 60,
      y: 60 + row * ((CH - 100) / 4) + Math.random() * 20,
      w, h, hp, maxHp: hp,
      vx: -(0.6 + level * 0.15 + Math.random() * 0.3),
      vy: (Math.random() - 0.5) * 0.5,
      value, correct: isCorrect,
      color,
      glowColor: glow,
      shape, pulse: 0,
      shootTimer: 60 + Math.random() * 120,
    });
  }
  return enemies;
}

// ── Main component ────────────────────────────────────────────────────────
interface SpaceImpactPageProps {
  questions?: MQ[];
  topicLabel?: string;
  backPath?: string;
  homePath?: string;
}

const SpaceImpactPage = ({
  questions,
  topicLabel,
  backPath,
  homePath = "/ruang-untuk-guru/numatik-game",
}: SpaceImpactPageProps = {}) => {
  const customQuestionsRef = useRef<MQ[] | undefined>(questions && questions.length > 0 ? questions : undefined);
  const customQIdxRef = useRef(0);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  // UI state
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [question, setQuestion] = useState("");
  const [combo, setCombo] = useState(0);
  const [flashMsg, setFlashMsg] = useState("");
  const [nextQuizIn, setNextQuizIn] = useState(25);
  const sessionStartRef = useRef(0);

  // game refs
  const phaseRef = useRef<Phase>("idle");
  const guruQuiz = useGuruQuiz(phaseRef, "playing", 25000);
  const playerRef = useRef<Vec2>({ x: 60, y: CH / 2 - 15 });
  const bulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const livesRef = useRef(3);
  const levelRef = useRef(1);
  const comboRef = useRef(0);
  const questionRef = useRef<MQ>({ q: "", ans: 0 });
  const shieldRef = useRef(false);
  const shieldTimerRef = useRef(0);
  const rapidRef = useRef(false);
  const rapidTimerRef = useRef(0);
  const spreadRef = useRef(false);
  const spreadTimerRef = useRef(0);
  const shootCooldownRef = useRef(0);
  const invincibleRef = useRef(0);
  const flashTimerRef = useRef(0);
  const flashMsgRef = useRef("");
  const waveActiveRef = useRef(false);
  const waveDelayRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const touchRef = useRef<{ up: boolean; down: boolean; left: boolean; right: boolean; shoot: boolean }>({
    up: false, down: false, left: false, right: false, shoot: false,
  });

  // ── Initialize stars ──────────────────────────────────────────────────
  const initStars = useCallback(() => {
    starsRef.current = Array.from({ length: 80 }, () => ({
      x: Math.random() * CW,
      y: Math.random() * CH,
      r: 0.5 + Math.random() * 2,
      speed: 0.3 + Math.random() * 1.5,
      alpha: 0.3 + Math.random() * 0.7,
    }));
  }, []);

  // ── Spawn new question + wave ─────────────────────────────────────────
  const spawnQuestion = useCallback((lv: number) => {
    let q: MQ;
    const pool = customQuestionsRef.current;
    if (pool && pool.length > 0) {
      q = pool[customQIdxRef.current % pool.length];
      customQIdxRef.current += 1;
    } else {
      q = makeQ(lv);
    }
    questionRef.current = q;
    setQuestion(q.q);
    const wave = spawnWave(lv, q);
    enemiesRef.current = wave;
    waveActiveRef.current = true;
  }, []);

  // ── Start game ────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    playPopSound();
    playerRef.current = { x: 60, y: CH / 2 - 15 };
    bulletsRef.current = [];
    particlesRef.current = [];
    powerUpsRef.current = [];
    scoreRef.current = 0;
    livesRef.current = 3;
    levelRef.current = 1;
    comboRef.current = 0;
    shieldRef.current = false;
    rapidRef.current = false;
    spreadRef.current = false;
    invincibleRef.current = 0;
    waveActiveRef.current = false;
    waveDelayRef.current = 60;
    initStars();
    setScore(0);
    setLives(3);
    setLevel(1);
    setCombo(0);
    setFlashMsg("");
    setNextQuizIn(25);
    sessionStartRef.current = Date.now();
    phaseRef.current = "playing";
    setPhase("playing");
  }, [initStars, spawnQuestion]);

  // ── Shoot ─────────────────────────────────────────────────────────────
  const shoot = useCallback(() => {
    if (shootCooldownRef.current > 0) return;
    const p = playerRef.current;
    const bx = p.x + 48;
    const by = p.y + 15;
    const spd = 9;
    bulletsRef.current.push({ x: bx, y: by, vx: spd, vy: 0, isPlayer: true, color: rapidRef.current ? "#ff6600" : "#00ffcc" });
    if (spreadRef.current) {
      bulletsRef.current.push({ x: bx, y: by, vx: spd * 0.85, vy: -2.5, isPlayer: true, color: "#facc15" });
      bulletsRef.current.push({ x: bx, y: by, vx: spd * 0.85, vy: 2.5, isPlayer: true, color: "#facc15" });
    }
    shootCooldownRef.current = rapidRef.current ? 6 : 14;
  }, []);

  // ── Explosion particles ───────────────────────────────────────────────
  const explode = useCallback((x: number, y: number, color: string, big = false) => {
    const count = big ? 24 : 14;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const spd = 1.5 + Math.random() * (big ? 5 : 3);
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        alpha: 1,
        color,
        r: big ? 3 + Math.random() * 4 : 1.5 + Math.random() * 3,
        life: big ? 0.018 : 0.028,
      });
    }
  }, []);

  // ── Flash message ─────────────────────────────────────────────────────
  const showFlash = useCallback((msg: string) => {
    flashMsgRef.current = msg;
    flashTimerRef.current = 80;
    setFlashMsg(msg);
  }, []);

  // ── Game loop ─────────────────────────────────────────────────────────
  const loop = useCallback(() => {
    if (guruQuiz.isPausedRef.current) { rafRef.current = requestAnimationFrame(loop); return; }
    rafRef.current = requestAnimationFrame(loop);
    if (phaseRef.current !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const keys = keysRef.current;
    const touch = touchRef.current;
    const p = playerRef.current;
    const PW = 48, PH = 30;
    const SPEED = 3.5;

    // ── Move player ──────────────────────────────────────────────────
    if ((keys.has("ArrowUp") || keys.has("w") || touch.up) && p.y > 30) p.y -= SPEED;
    if ((keys.has("ArrowDown") || keys.has("s") || touch.down) && p.y < CH - PH - 10) p.y += SPEED;
    if ((keys.has("ArrowLeft") || keys.has("a") || touch.left) && p.x > 10) p.x -= SPEED;
    if ((keys.has("ArrowRight") || keys.has("d") || touch.right) && p.x < CW * 0.45) p.x += SPEED;

    // ── Shoot ────────────────────────────────────────────────────────
    if (keys.has(" ") || keys.has("z") || touch.shoot) shoot();
    if (shootCooldownRef.current > 0) shootCooldownRef.current--;

    // ── Power-up timers ──────────────────────────────────────────────
    if (shieldRef.current) { shieldTimerRef.current--; if (shieldTimerRef.current <= 0) shieldRef.current = false; }
    if (rapidRef.current) { rapidTimerRef.current--; if (rapidTimerRef.current <= 0) rapidRef.current = false; }
    if (spreadRef.current) { spreadTimerRef.current--; if (spreadTimerRef.current <= 0) spreadRef.current = false; }
    if (invincibleRef.current > 0) invincibleRef.current--;

    // ── Wave delay ───────────────────────────────────────────────────
    if (!waveActiveRef.current) {
      if (waveDelayRef.current > 0) { waveDelayRef.current--; }
      else { spawnQuestion(levelRef.current); }
    }

    // ── Move bullets ─────────────────────────────────────────────────
    bulletsRef.current = bulletsRef.current.filter(b => {
      b.x += b.vx; b.y += b.vy;
      return b.x > -10 && b.x < CW + 10 && b.y > -10 && b.y < CH + 10;
    });

    // ── Move enemies ─────────────────────────────────────────────────
    for (const e of enemiesRef.current) {
      e.x += e.vx;
      e.y += e.vy;
      e.pulse = (e.pulse + 0.08) % (Math.PI * 2);

      // bounce vertically
      if (e.y < 35 || e.y + e.h > CH - 10) e.vy *= -1;

      // enemy shoots
      if (phaseRef.current === "playing") {
        e.shootTimer--;
        if (e.shootTimer <= 0) {
          const angle = Math.atan2(p.y + PH / 2 - (e.y + e.h / 2), p.x + PW / 2 - (e.x + e.w / 2));
          const spd = 2.5 + levelRef.current * 0.2;
          bulletsRef.current.push({
            x: e.x, y: e.y + e.h / 2, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
            isPlayer: false, color: e.glowColor,
          });
          e.shootTimer = 90 + Math.random() * 90 - levelRef.current * 8;
        }
      }

      // enemy exits left — respawn from right (no penalty)
      if (e.x + e.w < -20) {
        e.x = CW + 80;
      }
    }

    // ── Move power-ups ───────────────────────────────────────────────
    powerUpsRef.current = powerUpsRef.current.filter(pu => {
      pu.x -= 1.5;
      // collect
      if (pu.x < p.x + PW && pu.x + 20 > p.x && pu.y < p.y + PH && pu.y + 20 > p.y) {
        if (pu.type === "shield") { shieldRef.current = true; shieldTimerRef.current = 360; showFlash("🛡️ Pelindung aktif!"); }
        if (pu.type === "rapid") { rapidRef.current = true; rapidTimerRef.current = 300; showFlash("⚡ Rapid Fire!"); }
        if (pu.type === "spread") { spreadRef.current = true; spreadTimerRef.current = 300; showFlash("🌟 Spread Shot!"); }
        return false;
      }
      return pu.x > -30;
    });

    // ── Bullet ↔ Enemy collision ──────────────────────────────────────
    bulletsRef.current = bulletsRef.current.filter(b => {
      if (!b.isPlayer) return true;
      let hit = false;
      for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
        const e = enemiesRef.current[i];
        if (b.x > e.x && b.x < e.x + e.w && b.y > e.y && b.y < e.y + e.h) {
          e.hp--;
          explode(b.x, b.y, e.glowColor);
          if (e.hp <= 0) {
            explode(e.x + e.w / 2, e.y + e.h / 2, e.glowColor, true);
            enemiesRef.current.splice(i, 1);
            comboRef.current++;
            const pts = (50 + levelRef.current * 20) * comboRef.current;
            scoreRef.current += pts;
            setScore(scoreRef.current);
            setCombo(comboRef.current);
            showFlash(`💥 +${pts} (x${comboRef.current})`);
            playPopSound();
            // maybe drop power-up
            if (Math.random() < 0.25) {
              const types: Array<"shield" | "rapid" | "spread"> = ["shield", "rapid", "spread"];
              powerUpsRef.current.push({ x: e.x + e.w / 2, y: e.y + e.h / 2, type: types[Math.floor(Math.random() * 3)] });
            }
          }
          hit = true;
          break;
        }
      }
      return !hit;
    });

    // ── Enemy bullet ↔ Player collision ──────────────────────────────
    bulletsRef.current = bulletsRef.current.filter(b => {
      if (b.isPlayer) return true;
      const hit = b.x > p.x && b.x < p.x + PW && b.y > p.y && b.y < p.y + PH;
      if (hit && invincibleRef.current <= 0) {
        if (shieldRef.current) {
          showFlash("🛡️ Pelindung menahan serangan!");
        } else {
          livesRef.current--;
          setLives(livesRef.current);
          invincibleRef.current = 120;
          explode(p.x + PW / 2, p.y + PH / 2, "#ff4444", false);
          showFlash("💥 Kena tembak!");
          if (livesRef.current <= 0) {
            phaseRef.current = "dead";
            setPhase("dead");
            if (scoreRef.current > bestRef.current) bestRef.current = scoreRef.current;
            setBest(bestRef.current);
          }
        }
        return false;
      }
      return !hit;
    });

    // ── Check wave clear ─────────────────────────────────────────────
    if (waveActiveRef.current && enemiesRef.current.length === 0) {
      waveActiveRef.current = false;
      levelRef.current++;
      setLevel(levelRef.current);
      waveDelayRef.current = 90;
      if (levelRef.current > 10) {
        phaseRef.current = "win";
        setPhase("win");
        if (scoreRef.current > bestRef.current) bestRef.current = scoreRef.current;
        setBest(bestRef.current);
        return;
      }
      showFlash(`🚀 Level ${levelRef.current}! Gelombang berikutnya...`);
    }

    // ── Flash timer ──────────────────────────────────────────────────
    if (flashTimerRef.current > 0) { flashTimerRef.current--; if (flashTimerRef.current === 0) setFlashMsg(""); }

    // ── Update particles ─────────────────────────────────────────────
    particlesRef.current = particlesRef.current.filter(pt => {
      pt.x += pt.vx; pt.y += pt.vy;
      pt.alpha -= pt.life;
      return pt.alpha > 0;
    });

    // ══════════════ DRAW ════════════════════════════════════════════

    // background
    ctx.fillStyle = isLight ? "#0a0a2e" : "#000010";
    ctx.fillRect(0, 0, CW, CH);

    // scrolling stars
    for (const s of starsRef.current) {
      s.x -= s.speed;
      if (s.x < 0) { s.x = CW; s.y = Math.random() * CH; }
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // HUD background strip
    ctx.fillStyle = "rgba(0,0,20,0.7)";
    ctx.fillRect(0, 0, CW, 36);
    ctx.strokeStyle = "#00ffcc33";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, CW, 36);

    // lives
    for (let i = 0; i < livesRef.current; i++) {
      ctx.fillStyle = "#00ff88";
      ctx.shadowColor = "#00ff88"; ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(10 + i * 20, 12);
      ctx.lineTo(10 + i * 20 + 5, 6);
      ctx.lineTo(10 + i * 20 + 10, 12);
      ctx.lineTo(10 + i * 20 + 5, 20);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // level display
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#facc15";
    ctx.shadowColor = "#facc15"; ctx.shadowBlur = 8;
    ctx.fillText(`LEVEL ${levelRef.current}`, CW / 2, 23);
    ctx.shadowBlur = 0;

    // score
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "right";
    ctx.fillStyle = "#00ffcc";
    ctx.fillText(`${scoreRef.current}`, CW - 8, 22);
    ctx.textAlign = "left";

    // power-up icons
    let iconX = 10;
    if (shieldRef.current) { ctx.fillStyle = "#38bdf8"; ctx.font = "12px serif"; ctx.fillText("🛡️", iconX, 54); iconX += 24; }
    if (rapidRef.current) { ctx.fillText("⚡", iconX, 54); iconX += 24; }
    if (spreadRef.current) { ctx.fillText("🌟", iconX, 54); }

    // draw power-ups on field
    for (const pu of powerUpsRef.current) {
      ctx.font = "18px serif";
      ctx.textAlign = "center";
      const icon = pu.type === "shield" ? "🛡️" : pu.type === "rapid" ? "⚡" : "🌟";
      ctx.shadowColor = "#ffffff"; ctx.shadowBlur = 10;
      ctx.fillText(icon, pu.x, pu.y + 14);
      ctx.shadowBlur = 0;
    }
    ctx.textAlign = "left";

    // draw enemies
    for (const e of enemiesRef.current) {
      const pv = Math.sin(e.pulse);
      if (e.shape === "saucer") drawSaucer(ctx, e.x, e.y, e.w, e.h, e.color, e.glowColor, pv);
      else if (e.shape === "fighter") drawFighter(ctx, e.x, e.y, e.w, e.h, e.color, e.glowColor, pv);
      else drawBomber(ctx, e.x, e.y, e.w, e.h, e.color, e.glowColor, pv);

      // HP bar
      if (e.maxHp > 1) {
        ctx.fillStyle = "#333";
        ctx.fillRect(e.x, e.y - 5, e.w, 3);
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x, e.y - 5, (e.hp / e.maxHp) * e.w, 3);
      }

    }
    ctx.textAlign = "left";

    // draw bullets
    for (const b of bulletsRef.current) {
      ctx.shadowColor = b.color; ctx.shadowBlur = 8;
      ctx.fillStyle = b.color;
      if (b.isPlayer) {
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x - 12, b.y - 3);
        ctx.lineTo(b.x - 12, b.y + 3);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    // draw player (blink when invincible)
    if (invincibleRef.current <= 0 || Math.floor(invincibleRef.current / 6) % 2 === 0) {
      drawPlayerShip(ctx, p.x, p.y, shieldRef.current, rapidRef.current, spreadRef.current);
    }

    // draw particles
    for (const pt of particlesRef.current) {
      ctx.globalAlpha = pt.alpha;
      ctx.fillStyle = pt.color;
      ctx.shadowColor = pt.color; ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;

    // flash message
    if (flashTimerRef.current > 0) {
      const alpha = Math.min(1, flashTimerRef.current / 30);
      ctx.globalAlpha = alpha;
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#00ffcc"; ctx.shadowBlur = 14;
      ctx.fillText(flashMsgRef.current, CW / 2, CH / 2 - 20);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.textAlign = "left";
    }
  }, [isLight, shoot, explode, showFlash, spawnQuestion]);

  // ── Setup & cleanup ───────────────────────────────────────────────────
  useEffect(() => {
    initStars();
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop, initStars]);

  // ── Countdown to next quiz ────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      if (phaseRef.current !== "playing" || sessionStartRef.current === 0) return;
      const elapsed = (Date.now() - sessionStartRef.current) / 1000;
      const remaining = Math.max(0, Math.ceil(25 - (elapsed % 25)));
      setNextQuizIn(remaining);
    }, 250);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === " ") e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  // ── Touch control helpers ─────────────────────────────────────────────
  const setTouch = (key: keyof typeof touchRef.current, val: boolean) => { touchRef.current[key] = val; };

  const btnClass = "select-none active:opacity-70 bg-white/10 border border-white/20 rounded-lg font-bold text-white text-lg flex items-center justify-center cursor-pointer touch-none";

  if (phase === "idle") {
    return (
      <MathGameIntro
        gameTitle="SPACE IMPACT MATH"
        subtitle="⚔️ PERTEMPURAN GALAKSI ⚔️"
        topicLabel={topicLabel}
        heroEmoji="🚀"
        startLabel="MULAI MISI"
        theme="galaxy"
        onStart={startGame}
        onBack={() => { playPopSound(); if (backPath) navigate(backPath); else navigate(-1); }}
        onHome={() => { playPopSound(); navigate(homePath); }}
        bestLabel={best > 0 ? `Rekor Tertinggi: ${best}` : undefined}
        decorations={[
          { src: "/pesawat.png", className: "absolute top-[12%] left-[6%] w-14 h-16 md:w-20 md:h-24 opacity-70 animate-float-slow", glowRgba: "rgba(168,85,247,0.5)" },
          { src: "/meteor.png", className: "absolute top-[20%] right-[8%] w-12 h-12 md:w-16 md:h-16 opacity-65 animate-float-medium", glowRgba: "rgba(255,100,50,0.5)" },
          { src: "/meteor.png", className: "absolute top-[55%] left-[5%] w-10 h-10 md:w-14 md:h-14 opacity-55 animate-float-fast", glowRgba: "rgba(255,80,40,0.45)" },
          { src: "/pesawat.png", className: "absolute bottom-[18%] right-[10%] w-12 h-14 md:w-18 md:h-22 opacity-65 animate-float-medium", glowRgba: "rgba(168,85,247,0.45)" },
          { src: "/meteor.png", className: "absolute bottom-[30%] left-[12%] w-9 h-9 md:w-12 md:h-12 opacity-50 animate-float-slow", glowRgba: "rgba(255,90,45,0.45)" },
        ]}
        instructions={[
          { text: <>Pakai <strong className="text-yellow-300">WASD / ↑↓←→</strong> untuk gerak, <strong className="text-yellow-300">SPASI</strong> untuk tembak</> },
          { text: <>Tembak musuh — butuh <strong className="text-cyan-300">3x</strong> hit untuk hancurkan</> },
          { text: <>Tiap <strong className="text-yellow-300">25 detik</strong> muncul soal bonus untuk skor besar</> },
          { text: <>Kumpulkan power-up: shield, rapid fire, dan spread shot!</> },
        ]}
      />
    );
  }

  return (
    <div className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}
      <div className="relative z-10 flex flex-col items-center px-4 py-4 w-full max-w-lg">
        <div className="flex items-center justify-between w-full mb-1 gap-2">
          <button
            onClick={() => { playPopSound(); if (backPath) navigate(backPath); else navigate(-1); }}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:opacity-90 transition-opacity cursor-pointer"
            title="Kembali ke pilihan game"
          >
            <span className="text-base leading-none">←</span>
            <span className="hidden sm:inline">Kembali</span>
          </button>
          <h1 className="font-display text-2xl font-bold text-primary text-glow-cyan mb-1 text-center flex-1">
            🚀 SPACE IMPACT MATH
            {topicLabel ? <span className="block text-xs md:text-sm text-cyan-300 font-body mt-0.5">{topicLabel}</span> : null}
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
        <p className="text-white/50 text-xs font-body mb-4 text-center">
          Tembak musuh sebanyak-banyaknya! Setiap musuh perlu 3 tembakan.
        </p>

        {/* Canvas */}
        <div className="relative" style={{ width: CW, maxWidth: "100%", maxHeight: 'calc(100dvh - 250px)', aspectRatio: `${CW}/${CH}` }}>
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            className="rounded-xl border border-white/10 shadow-2xl w-full h-full"
            style={{ imageRendering: "pixelated", touchAction: "none" }}
          />

          {/* GAME OVER overlay */}
          {phase === "dead" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-xl gap-3">
              <div className="text-5xl">💥</div>
              <h2 className="font-display text-2xl text-red-400">GAME OVER</h2>
              <p className="text-white font-body">Skor: <span className="text-yellow-400 font-bold">{score}</span></p>
              {score >= best && score > 0 && <p className="text-green-400 text-sm font-body">🏆 Rekor baru!</p>}
              <p className="text-white/50 text-xs font-body">Rekor: {best}</p>
              <button onClick={startGame} className="mt-2 px-8 py-3 bg-accent text-black font-display font-bold rounded-full hover:scale-105 transition-transform">
                MAIN LAGI
              </button>
              <button onClick={() => { playPopSound(); if (backPath) navigate(backPath); else navigate(-1); }} className="text-white/50 text-xs hover:text-white transition-colors font-body cursor-pointer">
                Kembali ke Menu
              </button>
            </div>
          )}

          {/* WIN overlay */}
          {phase === "win" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-xl gap-3">
              <div className="text-5xl">🏆</div>
              <h2 className="font-display text-2xl text-yellow-400">MENANG!</h2>
              <p className="text-white font-body">Kamu berhasil melewati semua level!</p>
              <p className="text-white font-body">Skor: <span className="text-yellow-400 font-bold">{score}</span></p>
              {score >= best && <p className="text-green-400 text-sm font-body">🏆 Rekor baru!</p>}
              <button onClick={startGame} className="mt-2 px-8 py-3 bg-accent text-black font-display font-bold rounded-full hover:scale-105 transition-transform">
                MAIN LAGI
              </button>
              <button onClick={() => { playPopSound(); if (backPath) navigate(backPath); else navigate(-1); }} className="text-white/50 text-xs hover:text-white transition-colors font-body cursor-pointer">
                Kembali ke Menu
              </button>
            </div>
          )}
        </div>

        {/* Stats bar */}
        {phase === "playing" && (
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mt-3 text-xs font-body text-white/60">
            <span>❤️ {lives}</span>
            <span>⭐ {score}</span>
            <span>🔥 Kombo x{combo}</span>
            <span>📶 Level {level}</span>
            <span className={nextQuizIn <= 5 ? "text-yellow-300 font-bold animate-pulse" : "text-cyan-300"}>
              ⏱️ Soal: {nextQuizIn}s
            </span>
          </div>
        )}

        {/* Flash message */}
        {flashMsg && phase === "playing" && (
          <p className="mt-1 text-xs font-body text-center text-white/80 animate-pulse">{flashMsg}</p>
        )}

        {/* Touch controls */}
        {phase === "playing" && (
          <div className="mt-4 w-full flex justify-between items-end gap-2 select-none" style={{ maxWidth: CW }}>
            {/* D-pad */}
            <div className="grid grid-cols-3 gap-1" style={{ width: 120 }}>
              <div />
              <button className={`${btnClass} h-10`}
                onPointerDown={() => setTouch("up", true)} onPointerUp={() => setTouch("up", false)} onPointerLeave={() => setTouch("up", false)}>▲</button>
              <div />
              <button className={`${btnClass} h-10`}
                onPointerDown={() => setTouch("left", true)} onPointerUp={() => setTouch("left", false)} onPointerLeave={() => setTouch("left", false)}>◀</button>
              <div />
              <button className={`${btnClass} h-10`}
                onPointerDown={() => setTouch("right", true)} onPointerUp={() => setTouch("right", false)} onPointerLeave={() => setTouch("right", false)}>▶</button>
              <div />
              <button className={`${btnClass} h-10`}
                onPointerDown={() => setTouch("down", true)} onPointerUp={() => setTouch("down", false)} onPointerLeave={() => setTouch("down", false)}>▼</button>
              <div />
            </div>
            {/* Fire */}
            <button
              className={`${btnClass} rounded-full text-2xl`}
              style={{ width: 72, height: 72, background: "rgba(0,255,140,0.15)", borderColor: "#00ff8c" }}
              onPointerDown={() => setTouch("shoot", true)} onPointerUp={() => setTouch("shoot", false)} onPointerLeave={() => setTouch("shoot", false)}
            >
              🔫
            </button>
          </div>
        )}

        <p className="mt-6 text-white/30 text-xs font-body text-center">
          🛡️ Pelindung &nbsp;|&nbsp; ⚡ Rapid Fire &nbsp;|&nbsp; 🌟 Spread — item muncul saat musuh dihancurkan
        </p>
      <GuruQuizOverlay {...guruQuiz} />
      </div>
    </div>
  );
};

export default SpaceImpactPage;
