import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz, type GuruQuestion } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";
import MathGameIntro from "@/components/MathGameIntro";

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
    playerRef.current = { x: CW / 2, y: PLAYER_Y, turretAngle: -Math.PI / 2, invT: 0 };
    spawnWave();
    setPhase("playing");
  }, [spawnWave, setPhase]);

  // ── Helper: nearest living enemy to player ────────────────────────────────
  const findNearestEnemy = useCallback(() => {
    const { x: px, y: py } = playerRef.current;
    let best: EnemyTank | null = null;
    let bestD = Infinity;
    for (const e of enemiesRef.current) {
      if (!e.alive) continue;
      const d = (e.x - px) * (e.x - px) + (e.y - py) * (e.y - py);
      if (d < bestD) { bestD = d; best = e; }
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
        decorations={[
          { src: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 72"><rect x="4" y="48" width="102" height="18" rx="9" fill="#222"/><rect x="4" y="50" width="102" height="14" rx="7" fill="#2a2a2a"/><circle cx="18" cy="57" r="7" fill="#444"/><circle cx="18" cy="57" r="3.5" fill="#1a1a1a"/><circle cx="36" cy="57" r="7" fill="#444"/><circle cx="36" cy="57" r="3.5" fill="#1a1a1a"/><circle cx="55" cy="57" r="7" fill="#444"/><circle cx="55" cy="57" r="3.5" fill="#1a1a1a"/><circle cx="74" cy="57" r="7" fill="#444"/><circle cx="74" cy="57" r="3.5" fill="#1a1a1a"/><circle cx="92" cy="57" r="7" fill="#444"/><circle cx="92" cy="57" r="3.5" fill="#1a1a1a"/><rect x="8" y="32" width="82" height="22" rx="5" fill="#3a6820"/><rect x="8" y="32" width="82" height="10" rx="5" fill="#4a8828"/><rect x="12" y="36" width="70" height="5" rx="2" fill="#5aaa33" opacity="0.4"/><ellipse cx="48" cy="30" rx="26" ry="16" fill="#336018"/><ellipse cx="48" cy="28" rx="24" ry="12" fill="#3e7822"/><rect x="65" y="24" width="40" height="9" rx="4" fill="#2a5010"/><rect x="100" y="22" width="10" height="13" rx="2" fill="#1a3808"/><circle cx="40" cy="22" r="8" fill="#2a5010"/><circle cx="40" cy="22" r="5" fill="#1a3808"/><rect cx="37" cy="19" width="6" height="6" rx="1" fill="#0a1804"/><circle cx="40" cy="22" r="2" fill="#0a1804"/><rect x="10" y="34" width="12" height="18" rx="2" fill="#2a5818" opacity="0.5"/><rect x="78" y="34" width="10" height="18" rx="2" fill="#2a5818" opacity="0.5"/></svg>')}`, className: "absolute top-[8%] left-[4%] w-24 h-16 md:w-32 md:h-20 opacity-80 animate-float-slow", glowRgba: "rgba(80,180,40,0.5)" },
          { src: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 72"><rect x="4" y="48" width="102" height="18" rx="9" fill="#1a1a22"/><rect x="4" y="50" width="102" height="14" rx="7" fill="#22222e"/><circle cx="18" cy="57" r="7" fill="#3a3a4a"/><circle cx="18" cy="57" r="3.5" fill="#111118"/><circle cx="36" cy="57" r="7" fill="#3a3a4a"/><circle cx="36" cy="57" r="3.5" fill="#111118"/><circle cx="55" cy="57" r="7" fill="#3a3a4a"/><circle cx="55" cy="57" r="3.5" fill="#111118"/><circle cx="74" cy="57" r="7" fill="#3a3a4a"/><circle cx="74" cy="57" r="3.5" fill="#111118"/><circle cx="92" cy="57" r="7" fill="#3a3a4a"/><circle cx="92" cy="57" r="3.5" fill="#111118"/><rect x="8" y="32" width="82" height="22" rx="5" fill="#3a3a55"/><rect x="8" y="32" width="82" height="10" rx="5" fill="#4a4a6a"/><rect x="12" y="36" width="70" height="5" rx="2" fill="#6a6a8a" opacity="0.4"/><ellipse cx="48" cy="30" rx="26" ry="16" fill="#2a2a45"/><ellipse cx="48" cy="28" rx="24" ry="12" fill="#353555"/><rect x="65" y="24" width="40" height="9" rx="4" fill="#1e1e38"/><rect x="100" y="22" width="10" height="13" rx="2" fill="#111128"/><circle cx="40" cy="22" r="8" fill="#1e1e38"/><circle cx="40" cy="22" r="5" fill="#111128"/><circle cx="40" cy="22" r="2" fill="#080810"/><rect x="10" y="34" width="12" height="18" rx="2" fill="#2a2a45" opacity="0.5"/><rect x="78" y="34" width="10" height="18" rx="2" fill="#2a2a45" opacity="0.5"/></svg>')}`, className: "absolute top-[42%] right-[4%] w-20 h-14 md:w-28 md:h-18 opacity-75 animate-float-medium", glowRgba: "rgba(80,80,180,0.5)" },
          { src: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 72"><rect x="4" y="48" width="102" height="18" rx="9" fill="#2a1a08"/><rect x="4" y="50" width="102" height="14" rx="7" fill="#3a2210"/><circle cx="18" cy="57" r="7" fill="#5a3a18"/><circle cx="18" cy="57" r="3.5" fill="#1a0e04"/><circle cx="36" cy="57" r="7" fill="#5a3a18"/><circle cx="36" cy="57" r="3.5" fill="#1a0e04"/><circle cx="55" cy="57" r="7" fill="#5a3a18"/><circle cx="55" cy="57" r="3.5" fill="#1a0e04"/><circle cx="74" cy="57" r="7" fill="#5a3a18"/><circle cx="74" cy="57" r="3.5" fill="#1a0e04"/><circle cx="92" cy="57" r="7" fill="#5a3a18"/><circle cx="92" cy="57" r="3.5" fill="#1a0e04"/><rect x="8" y="32" width="82" height="22" rx="5" fill="#b88830"/><rect x="8" y="32" width="82" height="10" rx="5" fill="#d4a040"/><rect x="12" y="36" width="70" height="5" rx="2" fill="#eec055" opacity="0.4"/><ellipse cx="48" cy="30" rx="26" ry="16" fill="#a07020"/><ellipse cx="48" cy="28" rx="24" ry="12" fill="#ba8a2a"/><rect x="65" y="24" width="40" height="9" rx="4" fill="#7a5010"/><rect x="100" y="22" width="10" height="13" rx="2" fill="#4a3008"/><circle cx="40" cy="22" r="8" fill="#7a5010"/><circle cx="40" cy="22" r="5" fill="#4a3008"/><circle cx="40" cy="22" r="2" fill="#2a1804"/><rect x="10" y="34" width="12" height="18" rx="2" fill="#a07020" opacity="0.5"/><rect x="78" y="34" width="10" height="18" rx="2" fill="#a07020" opacity="0.5"/></svg>')}`, className: "absolute bottom-[14%] left-[5%] w-22 h-14 md:w-30 md:h-20 opacity-80 animate-float-fast", glowRgba: "rgba(200,150,40,0.5)" },
        ]}
        instructions={[
          { text: <>Gunakan <strong className="text-yellow-300">stik analog</strong> atau <strong className="text-yellow-300">tombol panah</strong> untuk menggerakkan tank ke <strong className="text-cyan-300">atas, bawah, kiri, kanan</strong></> },
          { text: <>Meriam tank <strong className="text-cyan-300">otomatis mengunci musuh terdekat</strong> — kamu cukup tekan <strong className="text-pink-300">🔥 TEMBAK</strong> (atau klik / tap / spasi) dan peluru akan melesat tepat ke sasaran</> },
          { text: <>Hancurkan semua tank musuh yang juga bergerak ke segala arah — kamu punya <strong className="text-pink-300">3 nyawa</strong></> },
          { text: <>Setiap <strong className="text-yellow-300">25 detik</strong> akan muncul <strong className="text-pink-300">soal dari guru</strong> — game di-pause, jawab benar = <strong className="text-green-400">+20 poin</strong></> },
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
