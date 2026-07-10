import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz, type GuruQuestion } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";

// Canvas dimensions are orientation-aware: portrait keeps the original 420x600
// playfield; landscape uses a wider/shorter playfield so tanks have more room.
const PORTRAIT_DIMS = { CW: 420, CH: 600, PLAYER_Y: 520 };
const LANDSCAPE_DIMS = { CW: 820, CH: 520, PLAYER_Y: 440 };
type Dims = typeof PORTRAIT_DIMS;
const BULLET_SPEED = 430;
const ENEMY_BULLET_SPEED = 195;
const TILE_SIZE = 40;

// ── Quiz type (kept for backward compat with wrapper pages; gameplay no longer
//    uses an in-game bonus quiz — only the 25-detik "Soal Guru" pause-quiz). ──
export interface MQ { q: string; opts: string[]; ans: number }

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
  vy: number; baseVy: number;
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

// Boss tank ("raja") — much bigger, takes many hits, fires triple-shot bursts.
interface Boss {
  x: number; y: number;
  vx: number; vy: number;
  hp: number; maxHp: number;
  alive: boolean;
  turretAngle: number;
  flashT: number;
  fireAcc: number; fireInterval: number;
  wobbleT: number;
  spawnT: number;
}

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
  quizQuestions?: GuruQuestion[];
}

// ── On-screen analog joystick (touch + mouse) ───────────────────────────────
interface AnalogStickProps {
  size: number;
  onChange: (x: number, y: number) => void; // values normalized to [-1, 1]
}
const AnalogStick = ({ size, onChange }: AnalogStickProps) => {
  const baseRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const knobRadius = size * 0.32;
  const maxDist = size / 2 - knobRadius * 0.85;

  const updateFromPointer = (clientX: number, clientY: number) => {
    const el = baseRef.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > maxDist) { dx = (dx / dist) * maxDist; dy = (dy / dist) * maxDist; }
    setKnob({ x: dx, y: dy });
    onChange(dx / maxDist, dy / maxDist);
  };

  const release = () => {
    activeRef.current = false;
    setActive(false);
    setKnob({ x: 0, y: 0 });
    onChange(0, 0);
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={(e) => {
        e.preventDefault();
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        activeRef.current = true;
        setActive(true);
        updateFromPointer(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (!activeRef.current) return;
        e.preventDefault();
        updateFromPointer(e.clientX, e.clientY);
      }}
      onPointerUp={(e) => { e.preventDefault(); release(); }}
      onPointerCancel={(e) => { e.preventDefault(); release(); }}
      onContextMenu={(e) => e.preventDefault()}
      className="relative rounded-full bg-slate-900/75 border-2 border-cyan-400/60 shadow-[0_0_18px_rgba(0,240,255,0.35)] touch-none select-none"
      style={{ width: size, height: size }}
      aria-label="Stik analog"
    >
      {/* Center cross hint */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-1 h-6 bg-cyan-400/25 rounded" />
        <div className="absolute w-6 h-1 bg-cyan-400/25 rounded" />
      </div>
      {/* Knob */}
      <div
        className={`absolute rounded-full pointer-events-none border-2 ${
          active
            ? "bg-gradient-to-br from-cyan-200 to-cyan-500 border-white/70 shadow-[0_0_18px_rgba(0,240,255,0.85)]"
            : "bg-gradient-to-br from-cyan-400 to-cyan-700 border-white/40 shadow-[0_0_12px_rgba(0,240,255,0.55)]"
        }`}
        style={{
          width: knobRadius * 2,
          height: knobRadius * 2,
          left: `calc(50% - ${knobRadius}px)`,
          top: `calc(50% - ${knobRadius}px)`,
          transform: `translate(${knob.x}px, ${knob.y}px)`,
          transition: active ? "none" : "transform 0.12s ease-out",
        }}
      />
    </div>
  );
};

const BattleTankPage = ({
  topicLabel,
  backPath,
  homePath = "/ruang-untuk-guru/numatik-game",
  quizQuestions,
}: BattleTankPageProps = {}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";

  // ── Orientation-aware playfield dimensions ────────────────────────────────
  const [isLandscape, setIsLandscape] = useState<boolean>(() =>
    typeof window !== "undefined" && window.matchMedia("(orientation: landscape)").matches
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(orientation: landscape)");
    const handler = (e: MediaQueryListEvent) => setIsLandscape(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  const dims: Dims = isLandscape ? LANDSCAPE_DIMS : PORTRAIT_DIMS;
  const dimsRef = useRef<Dims>(dims);
  dimsRef.current = dims;

  // Re-clamp positions when orientation/dims change so entities stay in-bounds
  useEffect(() => {
    const { CW, CH } = dims;
    const p = playerRef.current;
    p.x = Math.max(30, Math.min(CW - 30, p.x));
    p.y = Math.max(140, Math.min(CH - 30, p.y));
    const m = mouseRef.current;
    m.x = Math.max(20, Math.min(CW - 20, m.x));
    m.y = Math.max(20, Math.min(CH - 20, m.y));
  }, [dims]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastRef = useRef(0);

  const phaseRef = useRef<Phase>("idle");
  const [phase, setPhaseState] = useState<Phase>("idle");
  const setPhase = useCallback((p: Phase) => { phaseRef.current = p; setPhaseState(p); }, []);
  const guruQuiz = useGuruQuiz(phaseRef, "playing", 25_000, quizQuestions);
  const enemiesRef = useRef<EnemyTank[]>([]);
  const bossRef = useRef<Boss | null>(null);
  const bossTimerAccRef = useRef(0);
  const bossesDefeatedRef = useRef(0);
  const BOSS_INTERVAL = 60; // seconds between boss spawns
  const bulletsRef = useRef<Bullet[]>([]);
  const explosionsRef = useRef<Explosion[]>([]);
  const floatTextsRef = useRef<FloatText[]>([]);
  const groundMarksRef = useRef<GroundMark[]>([]);

  const playerRef = useRef({ x: dims.CW / 2, y: dims.PLAYER_Y, turretAngle: -Math.PI / 2, invT: 0 });
  const mouseRef = useRef({ x: dims.CW / 2, y: dims.CH / 2 });
  const controlsRef = useRef({ left: false, right: false, up: false, down: false });
  const joyRef = useRef({ x: 0, y: 0 });
  const setJoy = useCallback((x: number, y: number) => {
    joyRef.current.x = x;
    joyRef.current.y = y;
  }, []);
  const setPadHeld = useCallback((key: "left" | "right" | "up" | "down", val: boolean) => {
    controlsRef.current[key] = val;
  }, []);

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

  const [, forceRender] = useState(0);
  const rerender = useCallback(() => forceRender(n => n + 1), []);

  // ── Spawn wave ────────────────────────────────────────────────────────────
  const spawnWave = useCallback(() => {
    const { CW } = dimsRef.current;
    const wave = waveRef.current;
    const cols = Math.min(4, 2 + Math.floor(wave / 2));
    const rows = Math.min(3, 1 + Math.floor(wave / 3));
    const total = rows * cols;
    const enemies: EnemyTank[] = [];
    const gapX = (CW - 80) / (cols + 1);
    for (let r = 0; r < rows; r++) {
      const rowDir = r % 2 === 0 ? 1 : -1;
      const baseSpd = 40 + wave * 8;
      const baseVSpd = 25 + wave * 5;
      for (let c = 0; c < cols; c++) {
        const spd = baseSpd + Math.random() * 20;
        const vspd = baseVSpd + Math.random() * 18;
        const colDir = c % 2 === 0 ? 1 : -1;
        const pal = ENEMY_PALETTES[~~(Math.random() * ENEMY_PALETTES.length)];
        enemies.push({
          id: _id++,
          x: 40 + gapX * (c + 1),
          y: 150 + r * 95,
          vx: rowDir * spd, baseVx: spd,
          vy: colDir * vspd, baseVy: vspd,
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

  // ── Spawn boss ("raja") ────────────────────────────────────────────────────
  const spawnBoss = useCallback(() => {
    const { CW } = dimsRef.current;
    const stage = bossesDefeatedRef.current;
    const maxHp = 8 + stage * 3;
    bossRef.current = {
      x: CW / 2, y: 170,
      vx: 60 + stage * 8, vy: 35 + stage * 4,
      hp: maxHp, maxHp,
      alive: true,
      turretAngle: Math.PI / 2,
      flashT: 0,
      fireAcc: 0, fireInterval: 1.6,
      wobbleT: 0,
      spawnT: 1.5,
    };
    floatTextsRef.current.push({
      x: CW / 2, y: 90, txt: "👑 BOS RAKSASA DATANG!", alpha: 1, vy: -25, good: false,
    });
    shakeRef.current = 0.5;
  }, []);

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
    const { CW, PLAYER_Y } = dimsRef.current;
    scoreRef.current = 0; livesRef.current = 3; levelRef.current = 1;
    timerRef.current = 120; timerAccRef.current = 0;
    comboRef.current = 0; comboAccRef.current = 0;
    shakeRef.current = 0; waveRef.current = 1;
    bulletsRef.current = []; explosionsRef.current = [];
    floatTextsRef.current = []; groundMarksRef.current = [];
    bossRef.current = null;
    bossTimerAccRef.current = 0;
    bossesDefeatedRef.current = 0;
    playerRef.current = { x: CW / 2, y: PLAYER_Y, turretAngle: -Math.PI / 2, invT: 0 };
    spawnWave();
    setPhase("playing");
  }, [spawnWave, setPhase]);

  // ── Helper: nearest living target (enemy or boss) to player ───────────────
  const findNearestEnemy = useCallback((): { x: number; y: number } | null => {
    const { x: px, y: py } = playerRef.current;
    let best: { x: number; y: number } | null = null;
    let bestD = Infinity;
    for (const e of enemiesRef.current) {
      if (!e.alive) continue;
      const d = (e.x - px) * (e.x - px) + (e.y - py) * (e.y - py);
      if (d < bestD) { bestD = d; best = e; }
    }
    const boss = bossRef.current;
    if (boss && boss.alive) {
      const d = (boss.x - px) * (boss.x - px) + (boss.y - py) * (boss.y - py);
      if (d < bestD) { bestD = d; best = boss; }
    }
    return best;
  }, []);

  // ── Fire (shared by click/tap/fire button/keyboard) ───────────────────────
  const fireNow = useCallback(() => {
    if (phaseRef.current === "idle" || phaseRef.current === "dead") { startGame(); return; }
    if (phaseRef.current !== "playing") return;
    const { x: px, y: py } = playerRef.current;
    const ang = playerRef.current.turretAngle;
    // Aim at locked-on enemy if any; otherwise shoot along the turret direction
    const target = findNearestEnemy();
    const tx = target ? target.x : px + Math.cos(ang) * 1000;
    const ty = target ? target.y : py + Math.sin(ang) * 1000;
    fireBullet(true, px + Math.cos(ang) * 28, py + Math.sin(ang) * 28, tx, ty, "#00f0ff", "#00f0ff");
    playPopSound();
  }, [startGame, fireBullet, findNearestEnemy]);

  // ── Keyboard support (arrow keys + space to fire) ────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      switch (e.key) {
        case "ArrowLeft": case "a": case "A": setPadHeld("left", true); e.preventDefault(); break;
        case "ArrowRight": case "d": case "D": setPadHeld("right", true); e.preventDefault(); break;
        case "ArrowUp": case "w": case "W": setPadHeld("up", true); e.preventDefault(); break;
        case "ArrowDown": case "s": case "S": setPadHeld("down", true); e.preventDefault(); break;
        case " ": case "Enter": fireNow(); e.preventDefault(); break;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft": case "a": case "A": setPadHeld("left", false); break;
        case "ArrowRight": case "d": case "D": setPadHeld("right", false); break;
        case "ArrowUp": case "w": case "W": setPadHeld("up", false); break;
        case "ArrowDown": case "s": case "S": setPadHeld("down", false); break;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [setPadHeld, fireNow]);

  // ── Input ─────────────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const { CW, CH } = dimsRef.current;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) * (CW / rect.width),
      y: (e.clientY - rect.top) * (CH / rect.height),
    };
  }, []);

  const handleClick = useCallback((_e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas) return;
    if (phaseRef.current === "idle") { startGame(); return; }
    if (phaseRef.current === "dead") { startGame(); return; }
    fireNow();
  }, [startGame, fireNow]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas) return;
    e.preventDefault();
    const { CW, CH } = dimsRef.current;
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
    fireNow();
  }, [startGame, fireNow]);

  // ── Draw tank (top-down, cute & detailed) ─────────────────────────────────
  const drawTank = (
    ctx: CanvasRenderingContext2D, x: number, y: number,
    bodyAngle: number, turretAngle: number,
    bw: number, bh: number,
    bodyColor: string, trackColor: string, turretColor: string,
    glowColor: string, isPlayer: boolean, flashT: number, invT: number, ts: number,
  ) => {
    ctx.save();
    ctx.translate(x, y);

    // ── Soft drop shadow under whole tank ────────────────────────────────
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.32)";
    ctx.beginPath();
    ctx.ellipse(2, 4, bw * 0.62, bh * 0.65, 0, 0, Math.PI * 2);
    ctx.filter = "blur(2px)";
    ctx.fill();
    ctx.restore();

    // Outer ambient glow (kept like before but softer — drawn once, not on every shape)
    ctx.shadowBlur = 0;

    ctx.rotate(bodyAngle);

    // ── TRACKS (top + bottom strips) ─────────────────────────────────────
    const trackXLeft = -bw / 2 - 6;
    const trackLen = bw + 12;
    const trackH = 8;
    const drawTrack = (ty: number) => {
      // Track base (dark with subtle gradient)
      const tg = ctx.createLinearGradient(0, ty, 0, ty + trackH);
      tg.addColorStop(0, "#1a1a1f");
      tg.addColorStop(0.5, "#2a2a30");
      tg.addColorStop(1, "#0a0a0e");
      ctx.fillStyle = tg;
      ctx.beginPath(); roundRect(ctx, trackXLeft, ty, trackLen, trackH, 3); ctx.fill();
      // Tread segments (dark slats across the track)
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      const segs = 9;
      const seg = trackLen / segs;
      for (let i = 0; i < segs; i++) {
        ctx.beginPath();
        roundRect(ctx, trackXLeft + i * seg + seg * 0.2, ty + 1, seg * 0.6, trackH - 2, 1);
        ctx.fill();
      }
      // Road wheels (5 per track) – grey tinted with palette accent
      const wheelCount = 5;
      for (let i = 0; i < wheelCount; i++) {
        const wx = trackXLeft + 5 + i * ((trackLen - 10) / (wheelCount - 1));
        const wy = ty + trackH / 2;
        // outer wheel
        ctx.fillStyle = "#3a3a44";
        ctx.beginPath(); ctx.arc(wx, wy, trackH * 0.5, 0, Math.PI * 2); ctx.fill();
        // hub
        ctx.fillStyle = "#15151b";
        ctx.beginPath(); ctx.arc(wx, wy, trackH * 0.26, 0, Math.PI * 2); ctx.fill();
        // hub highlight
        ctx.fillStyle = "rgba(255,255,255,0.32)";
        ctx.beginPath(); ctx.arc(wx - 0.6, wy - 0.6, trackH * 0.1, 0, Math.PI * 2); ctx.fill();
      }
    };
    drawTrack(-bh / 2 - 5);
    drawTrack(bh / 2 - 3);

    // ── HULL (rounded body) ──────────────────────────────────────────────
    const hullFill = flashT > 0 ? "#ff5555" : bodyColor;
    ctx.fillStyle = hullFill;
    ctx.beginPath(); roundRect(ctx, -bw / 2, -bh / 2, bw, bh, 6); ctx.fill();
    // 3D top-light gradient (top half lighter, bottom half darker)
    const hullGrad = ctx.createLinearGradient(0, -bh / 2, 0, bh / 2);
    hullGrad.addColorStop(0, "rgba(255,255,255,0.36)");
    hullGrad.addColorStop(0.5, "rgba(255,255,255,0.08)");
    hullGrad.addColorStop(1, "rgba(0,0,0,0.28)");
    ctx.fillStyle = hullGrad;
    ctx.beginPath(); roundRect(ctx, -bw / 2, -bh / 2, bw, bh, 6); ctx.fill();
    // Subtle outline
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath(); roundRect(ctx, -bw / 2, -bh / 2, bw, bh, 6); ctx.stroke();
    // Front armor plate (slight darker panel near the front)
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    roundRect(ctx, bw * 0.18, -bh / 2 + 3, bw * 0.3, bh - 6, 4);
    ctx.fill();
    // Rivets on hull corners
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    for (const [rx, ry] of [
      [-bw / 2 + 4, -bh / 2 + 4], [-bw / 2 + 4, bh / 2 - 4],
      [bw / 2 - 4, -bh / 2 + 4],  [bw / 2 - 4, bh / 2 - 4],
    ]) {
      ctx.beginPath(); ctx.arc(rx, ry, 1.1, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.beginPath(); ctx.arc(rx - 0.3, ry - 0.3, 0.45, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,0.6)";
    }

    // ── Cute "headlight eyes" at the front ───────────────────────────────
    const eyeColor = isPlayer ? "#aaffff" : "#ffe680";
    for (const ey of [-bh * 0.28, bh * 0.28]) {
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath(); ctx.arc(bw / 2 - 2.5, ey, 2.6, 0, Math.PI * 2); ctx.fill();
      ctx.shadowColor = eyeColor;
      ctx.shadowBlur = 6;
      ctx.fillStyle = eyeColor;
      ctx.beginPath(); ctx.arc(bw / 2 - 2.5, ey, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(bw / 2 - 3, ey - 0.5, 0.7, 0, Math.PI * 2); ctx.fill();
    }

    // ── Antenna at the back ──────────────────────────────────────────────
    ctx.strokeStyle = "rgba(20,20,28,0.9)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-bw / 2 + 4, -bh * 0.18);
    ctx.lineTo(-bw / 2 - 7, -bh * 0.55);
    ctx.stroke();
    ctx.shadowColor = isPlayer ? "#00f0ff" : glowColor;
    ctx.shadowBlur = 5;
    ctx.fillStyle = isPlayer ? "#00f0ff" : glowColor;
    ctx.beginPath(); ctx.arc(-bw / 2 - 7, -bh * 0.55, 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    ctx.rotate(-bodyAngle);

    // ── TURRET (rotates with the cannon) ─────────────────────────────────
    ctx.rotate(turretAngle);
    const tr = bh * 0.5;

    // Turret base shadow
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath(); ctx.ellipse(1, 1.5, tr + 1, tr + 1, 0, 0, Math.PI * 2); ctx.fill();

    // Cannon mantlet (trapezoid joining barrel to turret)
    ctx.fillStyle = trackColor;
    ctx.beginPath();
    ctx.moveTo(tr * 0.55, -tr * 0.55);
    ctx.lineTo(tr * 1.05, -tr * 0.4);
    ctx.lineTo(tr * 1.05, tr * 0.4);
    ctx.lineTo(tr * 0.55, tr * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Turret dome
    ctx.shadowColor = flashT > 0 ? "#ff3333" : glowColor;
    ctx.shadowBlur = 12;
    ctx.fillStyle = flashT > 0 ? "#ff5555" : turretColor;
    ctx.beginPath(); ctx.arc(0, 0, tr, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    // Turret rim shading (radial)
    const turretGrad = ctx.createRadialGradient(-tr * 0.35, -tr * 0.35, 1, 0, 0, tr);
    turretGrad.addColorStop(0, "rgba(255,255,255,0.45)");
    turretGrad.addColorStop(0.5, "rgba(255,255,255,0.08)");
    turretGrad.addColorStop(1, "rgba(0,0,0,0.32)");
    ctx.fillStyle = turretGrad;
    ctx.beginPath(); ctx.arc(0, 0, tr, 0, Math.PI * 2); ctx.fill();
    // Turret outline
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(0, 0, tr, 0, Math.PI * 2); ctx.stroke();

    // Hatch (small dark circle, slightly offset back)
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath(); ctx.arc(-tr * 0.32, 0, tr * 0.32, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.beginPath(); ctx.arc(-tr * 0.32, 0, tr * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath(); ctx.arc(-tr * 0.36, -tr * 0.05, tr * 0.07, 0, Math.PI * 2); ctx.fill();

    // ── Barrel (long, with muzzle brake) ─────────────────────────────────
    const barLen = bw * 0.55;
    const barW = 5.5;
    // Barrel body
    const barGrad = ctx.createLinearGradient(0, -barW / 2, 0, barW / 2);
    barGrad.addColorStop(0, "#3a3a44");
    barGrad.addColorStop(0.5, "#1f1f26");
    barGrad.addColorStop(1, "#0a0a0e");
    ctx.fillStyle = barGrad;
    ctx.beginPath(); roundRect(ctx, tr * 0.95, -barW / 2, barLen, barW, 1.5); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.lineWidth = 0.8;
    ctx.beginPath(); roundRect(ctx, tr * 0.95, -barW / 2, barLen, barW, 1.5); ctx.stroke();
    // Top highlight on barrel
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.fillRect(tr * 0.95 + 1, -barW / 2 + 0.6, barLen - 2, 0.9);
    // Muzzle brake (slightly fatter tip)
    ctx.fillStyle = "#15151b";
    ctx.beginPath(); roundRect(ctx, tr * 0.95 + barLen - 4, -barW / 2 - 1.2, 4.5, barW + 2.4, 1); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.6)";
    ctx.beginPath(); roundRect(ctx, tr * 0.95 + barLen - 4, -barW / 2 - 1.2, 4.5, barW + 2.4, 1); ctx.stroke();
    // Muzzle glow
    ctx.shadowColor = isPlayer ? "#00f0ff" : glowColor;
    ctx.shadowBlur = 10;
    ctx.fillStyle = isPlayer ? "#00f0ff" : glowColor;
    ctx.beginPath(); ctx.arc(tr * 0.95 + barLen - 0.5, 0, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    ctx.rotate(-turretAngle);

    // ── Player invincibility ring ────────────────────────────────────────
    if (isPlayer && invT > 0) {
      const sa = Math.min(1, invT * 2) * (0.5 + 0.5 * Math.sin(ts / 80));
      ctx.globalAlpha = sa;
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#00f0ff";
      ctx.beginPath(); ctx.arc(0, 0, bw * 0.75, 0, Math.PI * 2); ctx.stroke();
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
      const { CW, CH } = dimsRef.current;
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05);
      lastRef.current = ts;
      if (guruQuiz.isPausedRef.current) { rafRef.current = requestAnimationFrame(loop); return; }
      hueRef.current = (hueRef.current + dt * 18) % 360;
      tileOffsetRef.current = (tileOffsetRef.current + dt * 20) % TILE_SIZE;
      const hue = hueRef.current;
      const phase = phaseRef.current;

      // ── Apply analog joystick + keyboard controls to MOVE player ─────────
      const ctrl = controlsRef.current;
      const kx = (ctrl.right ? 1 : 0) - (ctrl.left ? 1 : 0);
      const ky = (ctrl.down ? 1 : 0) - (ctrl.up ? 1 : 0);
      const jx = joyRef.current.x;
      const jy = joyRef.current.y;
      // Pick whichever input has stronger magnitude per axis (so keyboard still works)
      const ax = Math.abs(jx) >= Math.abs(kx) ? jx : kx;
      const ay = Math.abs(jy) >= Math.abs(ky) ? jy : ky;

      // ── Player update ────────────────────────────────────────────────────
      const player = playerRef.current;
      if (ax !== 0 || ay !== 0) {
        const moveSpd = 220;
        player.x += ax * moveSpd * dt;
        player.y += ay * moveSpd * dt;
        player.x = Math.max(30, Math.min(CW - 30, player.x));
        player.y = Math.max(140, Math.min(CH - 30, player.y));
      }
      // Auto-aim: turret smoothly tracks the nearest living enemy.
      // Falls back to movement direction (or current angle) when no enemies exist.
      let targetAng = player.turretAngle;
      const lockTarget = findNearestEnemy();
      if (lockTarget) {
        targetAng = Math.atan2(lockTarget.y - player.y, lockTarget.x - player.x);
      } else if (ax !== 0 || ay !== 0) {
        targetAng = Math.atan2(ay, ax);
      }
      let angDiff = targetAng - player.turretAngle;
      while (angDiff > Math.PI) angDiff -= Math.PI * 2;
      while (angDiff < -Math.PI) angDiff += Math.PI * 2;
      const TURN_RATE = 12; // rad/s — fast snap, still smooth
      player.turretAngle += angDiff * Math.min(1, dt * TURN_RATE);
      if (player.invT > 0) player.invT = Math.max(0, player.invT - dt);
      if (shakeRef.current > 0) shakeRef.current = Math.max(0, shakeRef.current - dt * 2.5);

      if (phase === "playing") {
        // ── Timer countdown ────────────────────────────────────────────────
        timerAccRef.current += dt;
        if (timerAccRef.current >= 1) {
          timerAccRef.current -= 1;
          timerRef.current--;
          if (timerRef.current <= 0) { timerRef.current = 0; setPhase("dead"); }
        }

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
          } else {
            e.x += e.vx * dt;
            e.y += e.vy * dt;
          }
          if (e.x < 32) { e.x = 32; e.vx = Math.abs(e.vx); }
          if (e.x > CW - 32) { e.x = CW - 32; e.vx = -Math.abs(e.vx); }
          if (e.y < 130) { e.y = 130; e.vy = Math.abs(e.vy); }
          if (e.y > CH - 80) { e.y = CH - 80; e.vy = -Math.abs(e.vy); }
          e.turretAngle = Math.atan2(player.y - e.y, player.x - e.x);
          e.fireAcc += dt;
          if (e.fireAcc >= e.fireInterval) {
            e.fireAcc = 0; e.fireInterval = 3 + Math.random() * 4;
            const ang = e.turretAngle;
            fireBullet(false, e.x + Math.cos(ang) * 26, e.y + Math.sin(ang) * 26, player.x, player.y, e.palette.glow, e.palette.glow);
          }
        }

        // ── Respawn if all dead ───────────────────────────────────────────
        if (enemiesRef.current.every(e => !e.alive)) {
          waveRef.current++;
          levelRef.current = Math.floor(waveRef.current / 2) + 1;
          spawnWave(); rerender();
        }

        // ── Boss spawn timer (every BOSS_INTERVAL seconds) ────────────────
        if (!bossRef.current) {
          bossTimerAccRef.current += dt;
          if (bossTimerAccRef.current >= BOSS_INTERVAL) {
            bossTimerAccRef.current = 0;
            spawnBoss();
          }
        }

        // ── Boss update ───────────────────────────────────────────────────
        const boss = bossRef.current;
        if (boss && boss.alive) {
          if (boss.flashT > 0) boss.flashT = Math.max(0, boss.flashT - dt * 3);
          if (boss.spawnT > 0) boss.spawnT = Math.max(0, boss.spawnT - dt);
          boss.wobbleT += dt * 1.5;
          boss.x += boss.vx * dt;
          boss.y += boss.vy * dt;
          if (boss.x < 60) { boss.x = 60; boss.vx = Math.abs(boss.vx); }
          if (boss.x > CW - 60) { boss.x = CW - 60; boss.vx = -Math.abs(boss.vx); }
          if (boss.y < 130) { boss.y = 130; boss.vy = Math.abs(boss.vy); }
          if (boss.y > CH * 0.5) { boss.y = CH * 0.5; boss.vy = -Math.abs(boss.vy); }
          boss.turretAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
          boss.fireAcc += dt;
          if (boss.fireAcc >= boss.fireInterval) {
            boss.fireAcc = 0; boss.fireInterval = 1.4 + Math.random() * 0.7;
            const ang = boss.turretAngle;
            for (const off of [-0.22, 0, 0.22]) {
              const a = ang + off;
              fireBullet(false,
                boss.x + Math.cos(a) * 50, boss.y + Math.sin(a) * 50,
                boss.x + Math.cos(a) * 1000, boss.y + Math.sin(a) * 1000,
                "#ffd700", "#ffd700");
            }
          }
        }

        // ── Bullet update ─────────────────────────────────────────────────
        for (const b of bulletsRef.current) {
          b.trail.push({ x: b.x, y: b.y, alpha: 0.6 });
          if (b.trail.length > 10) b.trail.shift();
          for (const t of b.trail) t.alpha -= dt * 5;
          b.x += b.vx * dt; b.y += b.vy * dt;

          if (b.fromPlayer) {
            // Boss takes priority — if hit, consume the bullet and skip enemy check.
            const bossHit = bossRef.current;
            if (bossHit && bossHit.alive) {
              const bdx = b.x - bossHit.x, bdy = b.y - bossHit.y;
              if (Math.sqrt(bdx * bdx + bdy * bdy) < 50) {
                bulletsRef.current = bulletsRef.current.filter(bb => bb !== b);
                bossHit.hp = Math.max(0, bossHit.hp - 1);
                bossHit.flashT = 0.25;
                addExplosion(b.x, b.y, "#ffd700", false);
                if (bossHit.hp <= 0) {
                  bossHit.alive = false;
                  addExplosion(bossHit.x, bossHit.y, "#ffd700", true);
                  addExplosion(bossHit.x - 20, bossHit.y + 10, "#ff8800", true);
                  addExplosion(bossHit.x + 20, bossHit.y - 10, "#ff44ff", true);
                  shakeRef.current = 1.0;
                  const bonus = 500 + bossesDefeatedRef.current * 200;
                  scoreRef.current += bonus;
                  if (scoreRef.current > bestRef.current) bestRef.current = scoreRef.current;
                  floatTextsRef.current.push({
                    x: bossHit.x, y: bossHit.y - 60,
                    txt: `👑 BOS KALAH! +${bonus}`, alpha: 1, vy: -70, good: true,
                  });
                  bossesDefeatedRef.current++;
                  bossRef.current = null;
                } else {
                  floatTextsRef.current.push({
                    x: b.x, y: b.y - 18, txt: "-1 HP", alpha: 1, vy: -60, good: true,
                  });
                }
                playPopSound();
                continue;
              }
            }
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
              const dx = b.x - player.x, dy = b.y - player.y;
              if (Math.sqrt(dx * dx + dy * dy) < 22) {
                bulletsRef.current = bulletsRef.current.filter(bb => bb !== b);
                livesRef.current--; player.invT = 2;
                shakeRef.current = 0.5; comboRef.current = 0; comboAccRef.current = 0;
                addExplosion(player.x, player.y, "#00f0ff", false);
                floatTextsRef.current.push({ x: player.x, y: player.y - 30, txt: "💥 Kena!", alpha: 1, vy: -70, good: false });
                if (livesRef.current <= 0) { setPhase("dead"); }
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

      // Boss tank ("raja") with HP bar + crown
      const bossDraw = bossRef.current;
      if (bossDraw && bossDraw.alive) {
        // Pulsing aura ring
        const auraR = 60 + Math.sin(bossDraw.wobbleT * 2) * 4;
        const auraGrad = ctx.createRadialGradient(bossDraw.x, bossDraw.y, auraR * 0.4, bossDraw.x, bossDraw.y, auraR);
        auraGrad.addColorStop(0, "rgba(255,215,0,0.0)");
        auraGrad.addColorStop(0.7, "rgba(255,215,0,0.18)");
        auraGrad.addColorStop(1, "rgba(255,215,0,0)");
        ctx.fillStyle = auraGrad;
        ctx.beginPath(); ctx.arc(bossDraw.x, bossDraw.y, auraR, 0, Math.PI * 2); ctx.fill();
        // The big tank itself
        drawTank(ctx, bossDraw.x, bossDraw.y, 0, bossDraw.turretAngle, 88, 64, "#4b0082", "#2a0640", "#d4af37", "#ffd700", false, bossDraw.flashT, 0, ts);
        // Crown above the boss
        ctx.font = "30px serif";
        ctx.textAlign = "center";
        ctx.shadowColor = "#ffd700"; ctx.shadowBlur = 14;
        ctx.fillText("👑", bossDraw.x, bossDraw.y - 50);
        ctx.shadowBlur = 0;
        // HP bar
        const barW = 110, barH = 9;
        const bx = bossDraw.x - barW / 2, by = bossDraw.y - 78;
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(bx - 2, by - 2, barW + 4, barH + 4);
        ctx.fillStyle = "#3a0a14";
        ctx.fillRect(bx, by, barW, barH);
        const hpFrac = bossDraw.hp / bossDraw.maxHp;
        ctx.fillStyle = hpFrac > 0.5 ? "#4ade80" : hpFrac > 0.25 ? "#fbbf24" : "#ef4444";
        ctx.fillRect(bx, by, barW * hpFrac, barH);
        ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, barW, barH);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px sans-serif";
        ctx.fillText(`${bossDraw.hp}/${bossDraw.maxHp}`, bossDraw.x, by - 4);
        // Spawn entrance flash
        if (bossDraw.spawnT > 0) {
          ctx.globalAlpha = bossDraw.spawnT / 1.5;
          ctx.fillStyle = "rgba(255,215,0,0.35)";
          ctx.beginPath(); ctx.arc(bossDraw.x, bossDraw.y, 80 + (1.5 - bossDraw.spawnT) * 60, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      // Player tank
      drawTank(ctx, player.x, player.y, 0, player.turretAngle, 46, 32, "#00e6d2", "#005544", "#00bbaa", "#00f0ff", true, 0, player.invT, ts);

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
  }, [rerender, spawnWave, fireBullet, phase]);

  if (phase === "idle") {
    return (
      <div className="fixed inset-0 z-40 overflow-hidden">
        <style>{`
          @keyframes bt-floatA { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
          @keyframes bt-floatB { 0%,100%{transform:translateY(-5px)} 50%{transform:translateY(7px)} }
          @keyframes bt-shimmer{ 0%{background-position:200% center} 100%{background-position:-200% center} }
          @keyframes bt-scanY  { 0%{transform:translateY(-120%)} 100%{transform:translateY(220%)} }
          @keyframes bt-breathe{ 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
          .bt-fa{animation:bt-floatA 3.2s ease-in-out infinite}
          .bt-fb{animation:bt-floatB 3.8s ease-in-out infinite}
          .bt-title-shine{background:linear-gradient(90deg,#86efac,#4ade80,#bef264,#86efac,#4ade80,#86efac);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:bt-shimmer 3.5s linear infinite}
          .bt-btn-breathe{animation:bt-breathe 2.8s ease-in-out infinite}
          .bt-scroll{height:100%;overflow-y:auto;scrollbar-width:none;display:flex;flex-direction:column}
          .bt-wrap{flex:1;display:flex;flex-direction:column;justify-content:space-evenly;padding:0.5rem 1rem;width:100%}
          .bt-main{display:flex;flex-direction:column;gap:0.75rem}
          .bt-visual{display:flex;flex-direction:column;gap:0.5rem}
          .bt-action{display:flex;flex-direction:column;gap:0.5rem}
          @media(orientation:landscape){
            .bt-wrap{justify-content:space-evenly;padding:0.35rem 1.75rem;max-width:860px;margin:0 auto;width:100%}
            .bt-main{flex-direction:row;align-items:stretch;gap:2rem}
            .bt-visual{flex:1;justify-content:center;gap:0.6rem}
            .bt-action{flex:1;justify-content:center;gap:0.6rem}
          }
        `}</style>

        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 15%, rgba(20,60,10,1) 0%, rgba(2,10,2,1) 60%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 10% 55%, rgba(34,197,94,0.12) 0%, transparent 55%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 90% 30%, rgba(163,230,53,0.10) 0%, transparent 55%)" }} />
        <div className="absolute inset-x-0 h-[1px] pointer-events-none" style={{ background: "linear-gradient(to right,transparent,rgba(74,222,128,0.25),transparent)", animation: "bt-scanY 6s linear infinite" }} />

        <div className="bt-scroll relative z-10">
          <div className="bt-wrap">

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-between w-full mb-1">
                <button onClick={() => { playPopSound(); if (backPath) navigate(backPath); else navigate(-1); }}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-lime-600 text-black font-display font-bold text-xs shadow-[0_0_15px_rgba(74,222,128,0.5)] hover:opacity-90 transition-opacity cursor-pointer">
                  <span className="text-base leading-none">←</span>
                  <span>Kembali</span>
                </button>
                <div className="text-[7px] tracking-[5px] text-emerald-400/60 uppercase font-bold">⬡ MATH GAME ARENA ⬡</div>
                <button onClick={() => { playPopSound(); navigate(homePath); }}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-lime-600 text-black font-display font-bold text-xs shadow-[0_0_15px_rgba(74,222,128,0.5)] hover:opacity-90 transition-opacity cursor-pointer">
                  <span className="text-base leading-none">🏠</span>
                  <span>Home</span>
                </button>
              </div>
              <div className="bt-title-shine font-display font-black leading-none" style={{ fontSize: "clamp(1.7rem,5vw,2.4rem)" }}>SHOOT TANK</div>
              <div className="mx-auto mt-0.5 h-0.5 w-28 rounded-full" style={{ background: "linear-gradient(to right,transparent,#4ade80,#bef264,transparent)" }} />
              <p className="text-emerald-400/70 text-[9px] font-bold tracking-wider uppercase mt-1">🎯 Bidik · Tembak · Hancurkan</p>
              {topicLabel && <p className="text-white/35 text-[8px] tracking-widest uppercase mt-0.5">🕹️ {topicLabel} 🕹️</p>}
              {bestRef.current > 0 && (
                <div className="mt-1 py-1 px-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
                  <p className="text-emerald-300 text-[8px] font-bold">🏆 Rekor: <span className="text-yellow-300">{bestRef.current}</span></p>
                </div>
              )}
            </div>

            <div className="bt-main">
              <div className="bt-visual">

                {/* ── Tank battle row: Player VS Enemies ── */}
                <div className="flex items-center justify-center gap-4 w-full">

                  {/* Player tank */}
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="text-[7px] text-emerald-400/70 font-bold tracking-wider uppercase">TANKMU</div>
                    <div className="relative">
                      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle,rgba(74,222,128,0.3) 0%,transparent 70%)", transform: "scale(2.4)", borderRadius: "50%" }} />
                      {/* Player tank — green, faces right */}
                      <svg viewBox="0 0 80 56" className="bt-fa relative z-10" style={{ width: 72, filter: "drop-shadow(0 0 8px #4ade80) drop-shadow(0 0 18px #16a34a)" }}>
                        <defs>
                          <linearGradient id="bt-p-body" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#86efac"/>
                            <stop offset="55%" stopColor="#22c55e"/>
                            <stop offset="100%" stopColor="#15803d"/>
                          </linearGradient>
                          <linearGradient id="bt-p-track" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4ade80"/>
                            <stop offset="100%" stopColor="#166534"/>
                          </linearGradient>
                          <linearGradient id="bt-p-turret" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a7f3d0"/>
                            <stop offset="100%" stopColor="#059669"/>
                          </linearGradient>
                        </defs>
                        {/* Tracks */}
                        <rect x="4" y="34" width="72" height="16" rx="7" fill="url(#bt-p-track)" stroke="#14532d" strokeWidth="1.2"/>
                        {/* Track links */}
                        {[10,20,30,40,50,60,68].map(tx => (
                          <line key={tx} x1={tx} y1="34" x2={tx} y2="50" stroke="#14532d" strokeWidth="0.9" opacity="0.7"/>
                        ))}
                        {/* Body */}
                        <rect x="10" y="22" width="58" height="18" rx="5" fill="url(#bt-p-body)" stroke="#14532d" strokeWidth="1"/>
                        {/* Turret base */}
                        <ellipse cx="38" cy="22" rx="18" ry="9" fill="url(#bt-p-turret)" stroke="#065f46" strokeWidth="1"/>
                        {/* Turret dome */}
                        <rect x="22" y="11" width="28" height="14" rx="6" fill="url(#bt-p-turret)" stroke="#065f46" strokeWidth="1"/>
                        {/* Cannon */}
                        <rect x="46" y="16" width="26" height="6" rx="3" fill="#059669" stroke="#022c22" strokeWidth="1"/>
                        {/* Cannon tip flash */}
                        <circle cx="73" cy="19" r="3.5" fill="#bbf7d0" opacity="0.7"/>
                        {/* Hatch */}
                        <ellipse cx="34" cy="14" rx="7" ry="5" fill="#6ee7b7" stroke="#047857" strokeWidth="0.8"/>
                        <circle cx="34" cy="14" r="2.5" fill="#a7f3d0"/>
                        {/* Star emblem */}
                        <polygon points="54,27 55.4,31 59.5,31 56.3,33.4 57.7,37.5 54,35 50.3,37.5 51.7,33.4 48.5,31 52.6,31" fill="#fde68a" opacity="0.9"/>
                        {/* Antenna */}
                        <line x1="28" y1="11" x2="26" y2="4" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round"/>
                        <circle cx="26" cy="3.5" r="2" fill="#bbf7d0"/>
                        {/* Wheel bolts */}
                        {[14,28,42,56,68].map((wx,i) => (
                          <circle key={i} cx={wx} cy="42" r="3.5" fill="#166534" stroke="#bbf7d0" strokeWidth="0.7"/>
                        ))}
                        {/* Body panel lines */}
                        <line x1="10" y1="30" x2="68" y2="30" stroke="#065f46" strokeWidth="0.7" opacity="0.5"/>
                      </svg>
                    </div>
                    <div className="w-1.5 h-4 rounded-full" style={{ background: "linear-gradient(to bottom,rgba(74,222,128,0.8),transparent)" }} />
                    <div className="text-[8px] font-bold text-emerald-400">KAMU</div>
                  </div>

                  <div className="flex flex-col items-center pb-2 shrink-0">
                    <div className="text-lg font-black text-white/20">VS</div>
                  </div>

                  {/* Enemy tanks 2×2 grid */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-[7px] text-white/40 font-bold tracking-wider uppercase mb-0.5">TANK MUSUH</div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {([
                        { body: "#ff5e87", track: "#aa2244", turret: "#ff2255", name: "MERAH",  delay: "0s"   },
                        { body: "#ffc94a", track: "#aa8800", turret: "#ffaa00", name: "EMAS",   delay: "0.4s" },
                        { body: "#cc66ff", track: "#7700aa", turret: "#aa44dd", name: "UNGU",   delay: "0.8s" },
                        { body: "#00e6d2", track: "#007766", turret: "#00bbaa", name: "TEAL",   delay: "1.2s" },
                      ]).map(e => (
                        <div key={e.name} className="flex flex-col items-center gap-0.5 rounded-lg p-1.5 border"
                          style={{ borderColor: e.body + "55", background: e.body + "12", boxShadow: `0 0 10px ${e.body}33` }}>
                          <svg viewBox="0 0 64 44" className="bt-fb" style={{ width: 48, animationDelay: e.delay, filter: `drop-shadow(0 0 5px ${e.body})` }}>
                            <defs>
                              <linearGradient id={`bt-e-body-${e.name}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={e.body}/>
                                <stop offset="100%" stopColor={e.track}/>
                              </linearGradient>
                            </defs>
                            {/* Track */}
                            <rect x="2" y="28" width="60" height="13" rx="5.5" fill={e.track} stroke="#00000055" strokeWidth="1"/>
                            {[9,17,25,33,41,49,56].map(tx => (
                              <line key={tx} x1={tx} y1="28" x2={tx} y2="41" stroke="#00000044" strokeWidth="0.8"/>
                            ))}
                            {/* Body */}
                            <rect x="7" y="18" width="50" height="15" rx="4" fill={`url(#bt-e-body-${e.name})`} stroke="#00000044" strokeWidth="0.8"/>
                            {/* Turret */}
                            <rect x="16" y="8" width="26" height="13" rx="5" fill={e.turret} stroke="#00000044" strokeWidth="0.8"/>
                            {/* Cannon — faces LEFT (enemy) */}
                            <rect x="4" y="12" width="18" height="5" rx="2.5" fill={e.track} stroke="#00000055" strokeWidth="0.8"/>
                            {/* Hatch */}
                            <ellipse cx="30" cy="10" rx="5" ry="3.5" fill={e.body} opacity="0.7" stroke="#00000033" strokeWidth="0.6"/>
                            {/* Wheels */}
                            {[10,22,34,46,56].map((wx,i) => (
                              <circle key={i} cx={wx} cy="34.5" r="3" fill={e.track} stroke={e.body} strokeWidth="0.6"/>
                            ))}
                          </svg>
                          <span className="text-[6px] font-bold" style={{ color: e.body }}>{e.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full h-px" style={{ background: "linear-gradient(to right,transparent,rgba(74,222,128,0.4),transparent)" }} />

                {/* ── Boss / Raja Tank ── */}
                <div className="flex flex-col items-center gap-1 py-1 rounded-2xl border border-yellow-400/30 px-3"
                  style={{ background: "rgba(250,204,21,0.06)", boxShadow: "0 0 18px rgba(250,204,21,0.18)" }}>
                  <div className="text-[7px] text-yellow-300/80 font-black tracking-widest uppercase">👑 TANK RAJA (BOS)</div>
                  <div className="relative">
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle,rgba(250,204,21,0.3) 0%,transparent 65%)", transform: "scale(2.2)", borderRadius: "50%" }} />
                    {/* Boss tank SVG — large, golden, menacing, faces right */}
                    <svg viewBox="0 0 110 72" className="bt-fa relative z-10" style={{ width: 100, filter: "drop-shadow(0 0 10px #facc15) drop-shadow(0 0 22px #b45309)" }}>
                      <defs>
                        <linearGradient id="bt-boss-body" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#fde68a"/>
                          <stop offset="45%" stopColor="#f59e0b"/>
                          <stop offset="100%" stopColor="#92400e"/>
                        </linearGradient>
                        <linearGradient id="bt-boss-track" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#fbbf24"/>
                          <stop offset="100%" stopColor="#78350f"/>
                        </linearGradient>
                        <linearGradient id="bt-boss-turret" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#fef3c7"/>
                          <stop offset="100%" stopColor="#d97706"/>
                        </linearGradient>
                        <radialGradient id="bt-boss-glow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="rgba(253,224,71,0.4)"/>
                          <stop offset="100%" stopColor="rgba(253,224,71,0)"/>
                        </radialGradient>
                      </defs>

                      {/* Glow aura */}
                      <ellipse cx="55" cy="50" rx="48" ry="22" fill="url(#bt-boss-glow)"/>

                      {/* Tracks — wider and taller */}
                      <rect x="3" y="48" width="104" height="20" rx="9" fill="url(#bt-boss-track)" stroke="#451a03" strokeWidth="1.5"/>
                      {[12,22,32,42,52,62,72,82,92,100].map(tx => (
                        <line key={tx} x1={tx} y1="48" x2={tx} y2="68" stroke="#451a03" strokeWidth="1.1" opacity="0.6"/>
                      ))}
                      {/* Track spikes */}
                      {[8,24,40,56,72,88,102].map((tx,i) => (
                        <rect key={i} x={tx-2} y="66" width="4" height="5" rx="1" fill="#fbbf24" opacity="0.8"/>
                      ))}

                      {/* Body — armored, chunky */}
                      <rect x="8" y="30" width="90" height="24" rx="7" fill="url(#bt-boss-body)" stroke="#451a03" strokeWidth="1.5"/>
                      {/* Armor plates */}
                      <rect x="12" y="34" width="20" height="14" rx="3" fill="rgba(0,0,0,0.12)" stroke="#fbbf2444" strokeWidth="0.8"/>
                      <rect x="36" y="34" width="20" height="14" rx="3" fill="rgba(0,0,0,0.12)" stroke="#fbbf2444" strokeWidth="0.8"/>
                      <rect x="60" y="34" width="20" height="14" rx="3" fill="rgba(0,0,0,0.12)" stroke="#fbbf2444" strokeWidth="0.8"/>

                      {/* Turret base ring */}
                      <ellipse cx="50" cy="30" rx="26" ry="10" fill="#f59e0b" stroke="#451a03" strokeWidth="1.2"/>

                      {/* Turret dome — big and menacing */}
                      <rect x="26" y="12" width="42" height="22" rx="9" fill="url(#bt-boss-turret)" stroke="#451a03" strokeWidth="1.5"/>
                      {/* Turret rivets */}
                      {[[30,15],[64,15],[30,30],[64,30]].map(([rx,ry],i) => (
                        <circle key={i} cx={rx} cy={ry} r="2" fill="#fde68a" stroke="#78350f" strokeWidth="0.7"/>
                      ))}

                      {/* Main cannon — thick, double barrel */}
                      <rect x="64" y="17" width="38" height="8" rx="4" fill="#d97706" stroke="#451a03" strokeWidth="1.2"/>
                      <rect x="64" y="26" width="38" height="8" rx="4" fill="#b45309" stroke="#451a03" strokeWidth="1.2"/>
                      {/* Muzzle flash */}
                      <ellipse cx="104" cy="21" rx="5" ry="3.5" fill="#fef08a" opacity="0.8"/>
                      <ellipse cx="104" cy="30" rx="5" ry="3.5" fill="#fef08a" opacity="0.65"/>

                      {/* Hatch */}
                      <ellipse cx="44" cy="16" rx="8" ry="5.5" fill="#fde68a" stroke="#b45309" strokeWidth="1"/>
                      <circle cx="44" cy="16" r="3" fill="#fef3c7"/>

                      {/* Crown on turret */}
                      <path d="M36,12 L38,5 L44,10 L50,3 L56,10 L62,5 L64,12 Z" fill="#facc15" stroke="#92400e" strokeWidth="1"/>
                      {/* Crown gems */}
                      <circle cx="38" cy="8" r="2" fill="#f87171"/>
                      <circle cx="50" cy="5" r="2.5" fill="#34d399"/>
                      <circle cx="62" cy="8" r="2" fill="#60a5fa"/>

                      {/* Skull emblem on body */}
                      <circle cx="22" cy="41" r="6" fill="#1c1917" opacity="0.7"/>
                      <circle cx="20" cy="39.5" r="1.2" fill="white" opacity="0.8"/>
                      <circle cx="24" cy="39.5" r="1.2" fill="white" opacity="0.8"/>
                      <path d="M19.5,43 Q22,45 24.5,43" stroke="white" strokeWidth="0.9" fill="none" opacity="0.7"/>

                      {/* Large wheels */}
                      {[14,32,55,78,96].map((wx,i) => (
                        <circle key={i} cx={wx} cy="58" r="6" fill="#78350f" stroke="#fbbf24" strokeWidth="1.2"/>
                      ))}
                      {[14,32,55,78,96].map((wx,i) => (
                        <circle key={i} cx={wx} cy="58" r="2.5" fill="#fbbf24"/>
                      ))}

                      {/* HP bar hint */}
                      <rect x="20" y="72" width="70" height="4" rx="2" fill="#451a03"/>
                      <rect x="20" y="72" width="70" height="4" rx="2" fill="#ef4444" opacity="0.9"/>
                      <text x="55" y="75.5" textAnchor="middle" fontSize="3.5" fill="white" fontWeight="bold">HP RAJA</text>
                    </svg>
                  </div>
                  <div className="text-[7px] text-yellow-300/60 text-center leading-tight">Muncul tiap 60 detik · Mahkota &amp; 3 meriam · Butuh banyak tembakan!</div>
                </div>

                <div className="w-full h-px" style={{ background: "linear-gradient(to right,transparent,rgba(74,222,128,0.4),transparent)" }} />

                <div>
                  <div className="text-[7px] text-white/35 tracking-widest uppercase mb-1.5 font-bold text-center">⚡ Senjata &amp; Power-up</div>
                  <div className="grid grid-cols-3 gap-1.5 w-full">
                    {([
                      { icon: "💥", label: "TEMBAK", desc: "Klik/Tap/Spasi", color: "#4ade80" },
                      { icon: "👑", label: "BOS",    desc: "Tiap 60 detik",  color: "#facc15" },
                      { icon: "📝", label: "SOAL",   desc: "25 detik +20pts",color: "#f472b6" },
                    ] as const).map(w => (
                      <div key={w.label} className="flex flex-col items-center gap-0.5 rounded-xl py-1.5 px-1 border"
                        style={{ borderColor: w.color + "44", background: w.color + "0f", boxShadow: `0 0 8px ${w.color}30` }}>
                        <span className="text-base leading-none" style={{ filter: `drop-shadow(0 0 5px ${w.color})` }}>{w.icon}</span>
                        <span className="text-[7px] font-black" style={{ color: w.color }}>{w.label}</span>
                        <span className="text-[6px] text-white/35 text-center leading-tight">{w.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bt-action">
                <div className="w-full h-px" style={{ background: "linear-gradient(to right,transparent,rgba(74,222,128,0.28),transparent)" }} />
                <div className="text-[7px] text-white/35 tracking-widest uppercase mb-1 font-bold text-center">📖 Cara Bermain</div>
                <div className="space-y-1.5">
                  {[
                    { icon: "🕹️", text: "Gunakan stik analog atau tombol panah ↑↓←→ untuk menggerakkan tank ke segala arah" },
                    { icon: "💥", text: "Meriam otomatis mengunci musuh terdekat — tekan TEMBAK (klik/tap/spasi) untuk menembak" },
                    { icon: "❤️", text: "Hancurkan semua tank musuh yang bergerak — kamu punya 3 nyawa" },
                    { icon: "👑", text: "Tiap 60 detik muncul BOS RAKSASA — tembak berulang hingga HP-nya habis untuk bonus besar!" },
                    { icon: "📝", text: "Tiap 25 detik muncul soal dari guru — game pause, jawab benar = +20 poin" },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-start gap-2 px-1">
                      <span className="text-sm shrink-0 leading-none mt-0.5">{icon}</span>
                      <p className="text-[8px] text-white/55 leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-center gap-1.5 mt-2">
                  <button onClick={startGame}
                    className="bt-btn-breathe font-display font-black text-black text-lg px-8 py-3 rounded-2xl cursor-pointer hover:scale-110 active:scale-95 w-full"
                    style={{
                      background: "linear-gradient(135deg,#4ade80 0%,#22c55e 45%,#16a34a 100%)",
                      boxShadow: "0 0 30px rgba(74,222,128,0.85),0 0 60px rgba(34,197,94,0.35),0 4px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.3)",
                    }}>
                    🎯 MULAI BERTEMPUR
                  </button>
                  <div className="text-[7px] text-white/20 text-center leading-relaxed">
                    Panah / WASD = gerak · Klik/Tap/Spasi = tembak
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`}
      style={{ height: '100dvh' }}
    >
      {isLight ? <Snowfall /> : <Starfield />}

      {/* Header */}
      <div className="relative z-10 w-full shrink-0 flex items-center justify-between pt-10 pb-1 px-3 gap-2">
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
            {topicLabel ? topicLabel : "🎮 Tombol arah untuk membidik · 🔥 TEMBAK untuk menembak"}
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

      {/* Middle area – canvas (and in landscape, controls flank it for a wider playfield) */}
      <div
        className={`relative z-10 flex-1 min-h-0 w-full flex items-center justify-center gap-2 ${
          isLandscape ? "flex-row px-3 py-1" : "flex-col px-2 py-1"
        }`}
      >
        {/* Analog joystick – only visible here in landscape (flanking the canvas) */}
        {isLandscape && (
          <div className="shrink-0">
            <AnalogStick size={140} onChange={setJoy} />
          </div>
        )}

        {/* Canvas wrapper */}
        <div className="relative inline-flex rounded-[28px] p-2 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 shadow-[0_0_45px_rgba(0,240,255,0.35)]">
          <canvas
            ref={canvasRef}
            width={dims.CW} height={dims.CH}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="block rounded-[20px] bg-slate-950 cursor-crosshair select-none touch-none border-4 border-slate-900"
            style={
              isLandscape
                ? { maxHeight: 'calc(100dvh - 130px)', height: 'auto', width: 'auto', maxWidth: 'calc(100vw - 320px)' }
                : { maxHeight: 'calc(100dvh - 260px)', width: 'auto', maxWidth: '96vw' }
            }
          />

        </div>

        {/* Fire Button – only visible here in landscape (flanking the canvas) */}
        {isLandscape && (
          <button
            type="button"
            onPointerDown={(e) => { e.preventDefault(); (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId); fireNow(); }}
            onContextMenu={(e) => e.preventDefault()}
            className="shrink-0 flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 text-white font-display font-extrabold border-4 border-white/30 shadow-[0_0_28px_rgba(255,80,80,0.6)] active:scale-90 active:shadow-[0_0_36px_rgba(255,140,80,0.85)] transition-transform touch-none select-none"
            style={{ width: 100, height: 100 }}
            aria-label="Tembak"
          >
            <span className="text-3xl leading-none">🔥</span>
            <span className="text-[10px] tracking-widest mt-0.5">TEMBAK</span>
          </button>
        )}
      </div>

      {/* On-screen controls (portrait only): Joystick (left) + Fire button (right) */}
      {!isLandscape && (
        <div className="relative z-10 w-full shrink-0 flex items-center justify-between gap-3 px-4 pt-1 pb-1 select-none touch-none">
          {/* Analog joystick */}
          <AnalogStick size={150} onChange={setJoy} />

          {/* Fire Button */}
          <button
            type="button"
            onPointerDown={(e) => { e.preventDefault(); (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId); fireNow(); }}
            onContextMenu={(e) => e.preventDefault()}
            className="shrink-0 flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 text-white font-display font-extrabold border-4 border-white/30 shadow-[0_0_28px_rgba(255,80,80,0.6)] active:scale-90 active:shadow-[0_0_36px_rgba(255,140,80,0.85)] transition-transform touch-none"
            style={{ width: 110, height: 110 }}
            aria-label="Tembak"
          >
            <span className="text-3xl leading-none">🔥</span>
            <span className="text-[11px] tracking-widest mt-1">TEMBAK</span>
          </button>
        </div>
      )}

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
