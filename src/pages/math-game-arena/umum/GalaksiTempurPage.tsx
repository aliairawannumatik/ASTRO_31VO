import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz } from "@/hooks/useGuruQuiz";
import type { GuruQuestion } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";

const CW = 420;
const CH = 560;
const PLAYER_SPD = 290;
const BULLET_SPD = 520;
const JOYSTICK_R = 48;
const BOSS_INTERVAL = 60;
const BOSS_W = 160;
const BOSS_H = 148;
const BOSS_HP = 25;

let _uid = 0;
interface Player { x: number; y: number; w: number; h: number; invincible: number }
interface Bullet { id: number; x: number; y: number; vx: number; vy: number; isEnemy: boolean; powerType?: PowerType }
interface Enemy {
  id: number; x: number; y: number; w: number; h: number;
  hp: number; maxHp: number; vx: number; vy: number;
  glow: string;
  type: "bomber" | "fighter" | "raider" | "saucer" | "raja";
  imgIdx: number;
  isBoss?: boolean;
  shootTimer: number; pulse: number; phase2?: boolean;
}
interface Particle { x: number; y: number; vx: number; vy: number; alpha: number; color: string; r: number }
interface Star { x: number; y: number; r: number; spd: number }
interface ScorePop { x: number; y: number; txt: string; alpha: number; vy: number }

type Phase = "idle" | "playing" | "dead";
type PowerType = "spread" | "rapid" | "double" | "laser";
interface PowerUp { id: number; x: number; y: number; type: PowerType; vy: number; pulse: number }

const POWER_DEFS: Record<PowerType, { label: string; color: string; icon: string; duration: number; cooldown: number }> = {
  spread: { label: "SPREAD", color: "#facc15", icon: "✦", duration: 8,  cooldown: 0.18 },
  rapid:  { label: "RAPID",  color: "#22d3ee", icon: "⚡", duration: 8,  cooldown: 0.06 },
  double: { label: "DOUBLE", color: "#c084fc", icon: "▲▲", duration: 8, cooldown: 0.14 },
  laser:  { label: "LASER",  color: "#f87171", icon: "☄",  duration: 6,  cooldown: 0.24 },
};

const ENEMY_DEFS = [
  { type: "bomber" as const,  glow: "#ff6b6b", pts: 30, hp: 1, imgIdx: 0, rotate: true  },
  { type: "fighter" as const, glow: "#818cf8", pts: 20, hp: 1, imgIdx: 1, rotate: true  },
  { type: "raider" as const,  glow: "#fb923c", pts: 25, hp: 1, imgIdx: 2, rotate: false },
  { type: "saucer" as const,  glow: "#4ade80", pts: 35, hp: 1, imgIdx: 3, rotate: true  },
];

const DIFFICULTY_STAGES = [
  { label: "MUDAH",        color: "#4ade80", count: [1, 2], vyBase: 46,  vyRand: 20, spawnMs: 2800, shootMin: 4.0, shootRand: 2.5, typePool: [0, 1]       },
  { label: "SEDANG",       color: "#facc15", count: [2, 3], vyBase: 78,  vyRand: 25, spawnMs: 2200, shootMin: 3.0, shootRand: 2.0, typePool: [0, 1, 2]    },
  { label: "SULIT",        color: "#f97316", count: [3, 4], vyBase: 110, vyRand: 30, spawnMs: 1700, shootMin: 2.2, shootRand: 1.5, typePool: [0, 1, 2, 3] },
  { label: "SANGAT SULIT", color: "#ef4444", count: [4, 5], vyBase: 142, vyRand: 35, spawnMs: 1350, shootMin: 1.5, shootRand: 1.2, typePool: [0, 1, 2, 3] },
  { label: "EKSTREM",      color: "#a855f7", count: [5, 6], vyBase: 170, vyRand: 40, spawnMs: 1100, shootMin: 1.0, shootRand: 1.0, typePool: [0, 1, 2, 3] },
];
const getDiffStage = (elapsed: number) => Math.min(Math.floor(elapsed / 30), DIFFICULTY_STAGES.length - 1);

interface GalaksiTempurPageProps {
  topicLabel: string;
  backPath: string;
  homePath: string;
  quizQuestions?: GuruQuestion[];
}

const GalaksiTempurPage = ({ topicLabel, backPath, homePath, quizQuestions }: GalaksiTempurPageProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);

  const phaseRef = useRef<Phase>("idle");
  const guruQuiz = useGuruQuiz(phaseRef, "playing", 25000, quizQuestions);

  const playerRef = useRef<Player>({ x: CW / 2 - 24, y: CH - 110, w: 56, h: 64, invincible: 0 });
  const bulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const scorePopRef = useRef<ScorePop[]>([]);
  const starsRef = useRef<Star[]>([]);
  const keysRef = useRef<Record<string, boolean>>({});
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const bestRef = useRef(0);
  const shootCoolRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const elapsedRef = useRef(0);
  const waveRef = useRef(0);

  const joyBaseRef = useRef({ x: 55, y: 55 });
  const joyHandleRef = useRef({ x: 55, y: 55 });
  const joyDirRef = useRef({ x: 0, y: 0 });
  const joyActiveRef = useRef(false);
  const fireRef = useRef(false);

  const shipImgRef = useRef<HTMLImageElement | null>(null);
  const enemyImgsRef = useRef<Array<HTMLImageElement | null>>([null, null, null, null, null]);

  const nextBossAtRef = useRef(BOSS_INTERVAL);
  const bossAlertTimerRef = useRef(0);
  const diffTierRef = useRef(0);
  const tierAlertTimerRef = useRef(0);

  const powerUpsRef = useRef<PowerUp[]>([]);
  const activePowerRef = useRef<PowerType | null>(null);
  const powerTimerRef = useRef(0);
  const powerSpawnTimerRef = useRef(14);

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [best, setBest] = useState(0);
  const [joyHandle, setJoyHandle] = useState({ x: 55, y: 55 });
  const [joyActive, setJoyActive] = useState(false);
  const [bossAlert, setBossAlert] = useState(false);
  const [diffTier, setDiffTier] = useState(0);
  const [tierAlert, setTierAlert] = useState(false);
  const [activePower, setActivePower] = useState<PowerType | null>(null);
  const [powerTimeLeft, setPowerTimeLeft] = useState(0);

  const spawnParticles = useCallback((x: number, y: number, color: string, n = 12) => {
    for (let i = 0; i < n; i++) {
      const ang = (Math.PI * 2 * i) / n + Math.random() * 0.5;
      const spd = 60 + Math.random() * 160;
      particlesRef.current.push({ x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, alpha: 1, color, r: 2 + Math.random() * 4 });
    }
  }, []);

  const spawnWave = useCallback(() => {
    waveRef.current++;
    const stage = DIFFICULTY_STAGES[getDiffStage(elapsedRef.current)];
    const [minC, maxC] = stage.count;
    const count = minC + Math.floor(Math.random() * (maxC - minC + 1));
    for (let i = 0; i < count; i++) {
      const defIdx = stage.typePool[Math.floor(Math.random() * stage.typePool.length)];
      const def = ENEMY_DEFS[defIdx];
      const w = def.type === "saucer" ? 60 : def.type === "bomber" ? 54 : 42 + Math.random() * 10;
      const h = def.type === "saucer" ? 56 : def.type === "bomber" ? 38 : 30 + Math.random() * 10;
      enemiesRef.current.push({
        id: _uid++,
        x: 20 + Math.random() * (CW - w - 20),
        y: -70 - i * 65,
        w, h,
        hp: def.hp, maxHp: def.hp,
        vx: (Math.random() - 0.5) * 90,
        vy: stage.vyBase + Math.random() * stage.vyRand,
        glow: def.glow,
        type: def.type,
        imgIdx: def.imgIdx,
        shootTimer: stage.shootMin + Math.random() * stage.shootRand,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }, []);

  const spawnBoss = useCallback(() => {
    setBossAlert(true);
    bossAlertTimerRef.current = 2.5;
    enemiesRef.current = enemiesRef.current.filter(e => !e.isBoss);
    setTimeout(() => {
      enemiesRef.current.push({
        id: _uid++,
        x: CW / 2 - BOSS_W / 2,
        y: -BOSS_H - 20,
        w: BOSS_W, h: BOSS_H,
        hp: BOSS_HP, maxHp: BOSS_HP,
        vx: 55, vy: 38,
        glow: "#ff2222",
        type: "raja",
        imgIdx: 4,
        isBoss: true,
        shootTimer: 1.5,
        pulse: 0,
        phase2: false,
      });
    }, 2500);
  }, []);

  const drawEnemy = useCallback((ctx: CanvasRenderingContext2D, e: Enemy) => {
    const cx = e.x + e.w / 2, cy = e.y + e.h / 2;
    const img = enemyImgsRef.current[e.imgIdx];
    const def = ENEMY_DEFS[e.imgIdx];
    ctx.save();
    ctx.shadowColor = e.glow;
    ctx.shadowBlur = 18 + Math.sin(e.pulse) * 5;
    if (img) {
      if (def?.rotate) {
        ctx.translate(cx, cy);
        ctx.rotate(Math.PI);
        ctx.drawImage(img, -e.w / 2, -e.h / 2, e.w, e.h);
      } else {
        ctx.drawImage(img, e.x, e.y, e.w, e.h);
      }
    } else {
      ctx.fillStyle = e.glow;
      ctx.beginPath(); ctx.ellipse(cx, cy, e.w / 2, e.h / 2, 0, 0, Math.PI * 2); ctx.fill();
    }
    if (e.hp > 1 && !e.isBoss) {
      const barW = e.w * 0.8, barH = 4;
      const barX = cx - barW / 2, barY = e.y + e.h + 5;
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(barX, barY, barW, barH);
      ctx.fillStyle = e.glow;
      ctx.fillRect(barX, barY, barW * (e.hp / e.maxHp), barH);
    }
    ctx.shadowBlur = 0;
    ctx.restore();
  }, []);

  const drawPlayer = useCallback((ctx: CanvasRenderingContext2D, p: Player, ts: number) => {
    const cx = p.x + p.w / 2;
    const engY = p.y + p.h - 4;
    const thrPulse = 0.7 + 0.3 * Math.sin(ts / 80);
    const eng = ctx.createRadialGradient(cx, engY, 0, cx, engY, 24 * thrPulse);
    eng.addColorStop(0, "rgba(255,200,60,1)");
    eng.addColorStop(0.35, "rgba(255,100,0,0.7)");
    eng.addColorStop(1, "transparent");
    ctx.fillStyle = eng;
    ctx.beginPath(); ctx.arc(cx, engY, 24 * thrPulse, 0, Math.PI * 2); ctx.fill();
    if (p.invincible > 0 && Math.floor(ts / 80) % 2 === 0) return;
    if (shipImgRef.current) {
      ctx.save();
      ctx.shadowColor = "rgba(80,180,255,0.6)";
      ctx.shadowBlur = 18;
      ctx.drawImage(shipImgRef.current, p.x, p.y, p.w, p.h);
      ctx.shadowBlur = 0;
      ctx.restore();
    } else {
      ctx.fillStyle = "#00BFFF";
      ctx.shadowColor = "#00FFFF"; ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.moveTo(cx, p.y); ctx.lineTo(p.x + p.w, p.y + p.h);
      ctx.lineTo(cx, p.y + p.h * 0.72); ctx.lineTo(p.x, p.y + p.h);
      ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, []);

  const resetGame = useCallback(() => {
    playerRef.current = { x: CW / 2 - 28, y: CH - 120, w: 56, h: 64, invincible: 0 };
    bulletsRef.current = []; enemiesRef.current = [];
    particlesRef.current = []; scorePopRef.current = [];
    keysRef.current = {};
    scoreRef.current = 0; livesRef.current = 3;
    elapsedRef.current = 0; spawnTimerRef.current = 0; waveRef.current = 0;
    nextBossAtRef.current = BOSS_INTERVAL; bossAlertTimerRef.current = 0;
    diffTierRef.current = 0; tierAlertTimerRef.current = 0;
    powerUpsRef.current = []; activePowerRef.current = null;
    powerTimerRef.current = 0; powerSpawnTimerRef.current = 14;
    joyActiveRef.current = false; joyDirRef.current = { x: 0, y: 0 };
    fireRef.current = false; shootCoolRef.current = 0;
    setScore(0); setLives(3); setJoyActive(false); setJoyHandle({ x: 55, y: 55 });
    setBossAlert(false); setDiffTier(0); setTierAlert(false);
    setActivePower(null); setPowerTimeLeft(0);
    starsRef.current = Array.from({ length: 90 }, () => ({
      x: Math.random() * CW, y: Math.random() * CH,
      r: 0.4 + Math.random() * 1.6, spd: 30 + Math.random() * 70,
    }));
  }, []);

  const loop = useCallback((ts: number) => {
    const dt = Math.min((ts - (lastTsRef.current || ts)) / 1000, 0.05);
    lastTsRef.current = ts;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const ph = phaseRef.current;

    const bgGrad = ctx.createLinearGradient(0, 0, 0, CH);
    bgGrad.addColorStop(0, "#020210"); bgGrad.addColorStop(1, "#060620");
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, CW, CH);

    starsRef.current.forEach(s => {
      if (ph === "playing") { s.y += s.spd * dt; if (s.y > CH) s.y = -4; }
      ctx.globalAlpha = 0.3 + Math.random() * 0.5;
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    const neb = ctx.createRadialGradient(CW * 0.8, CH * 0.25, 0, CW * 0.8, CH * 0.25, 180);
    neb.addColorStop(0, "rgba(70,0,100,0.07)"); neb.addColorStop(1, "transparent");
    ctx.fillStyle = neb; ctx.fillRect(0, 0, CW, CH);

    if (ph === "playing" && !guruQuiz.isPausedRef.current) {
      elapsedRef.current += dt;

      const newTier = getDiffStage(elapsedRef.current);
      if (newTier !== diffTierRef.current) {
        diffTierRef.current = newTier;
        setDiffTier(newTier);
        tierAlertTimerRef.current = 2.5;
        setTierAlert(true);
      }
      if (tierAlertTimerRef.current > 0) {
        tierAlertTimerRef.current -= dt;
        if (tierAlertTimerRef.current <= 0) setTierAlert(false);
      }

      const p = playerRef.current;

      let dx = 0, dy = 0;
      if (keysRef.current["ArrowLeft"] || keysRef.current["a"] || keysRef.current["A"]) dx -= 1;
      if (keysRef.current["ArrowRight"] || keysRef.current["d"] || keysRef.current["D"]) dx += 1;
      if (keysRef.current["ArrowUp"] || keysRef.current["w"] || keysRef.current["W"]) dy -= 1;
      if (keysRef.current["ArrowDown"] || keysRef.current["s"] || keysRef.current["S"]) dy += 1;
      if (joyActiveRef.current) { dx = joyDirRef.current.x; dy = joyDirRef.current.y; }
      const mag = Math.sqrt(dx * dx + dy * dy);
      if (mag > 0) { dx /= mag; dy /= mag; }
      p.x = Math.max(0, Math.min(CW - p.w, p.x + dx * PLAYER_SPD * dt));
      p.y = Math.max(0, Math.min(CH - p.h, p.y + dy * PLAYER_SPD * dt));
      if (p.invincible > 0) p.invincible -= dt;

      if (shootCoolRef.current > 0) shootCoolRef.current -= dt;
      if ((keysRef.current[" "] || fireRef.current) && shootCoolRef.current <= 0) {
        const cx2 = p.x + p.w / 2;
        const ap = activePowerRef.current;
        if (ap === "spread") {
          [-0.5, -0.25, 0, 0.25, 0.5].forEach(a => {
            bulletsRef.current.push({ id: _uid++, x: cx2, y: p.y + 4, vx: Math.sin(a) * BULLET_SPD, vy: -Math.cos(a) * BULLET_SPD, isEnemy: false, powerType: "spread" });
          });
        } else if (ap === "rapid") {
          bulletsRef.current.push({ id: _uid++, x: cx2, y: p.y + 4, vx: 0, vy: -BULLET_SPD, isEnemy: false, powerType: "rapid" });
        } else if (ap === "double") {
          bulletsRef.current.push({ id: _uid++, x: cx2 - 13, y: p.y + 4, vx: 0, vy: -BULLET_SPD, isEnemy: false, powerType: "double" });
          bulletsRef.current.push({ id: _uid++, x: cx2 + 13, y: p.y + 4, vx: 0, vy: -BULLET_SPD, isEnemy: false, powerType: "double" });
        } else if (ap === "laser") {
          bulletsRef.current.push({ id: _uid++, x: cx2, y: p.y + 4, vx: 0, vy: -BULLET_SPD * 1.4, isEnemy: false, powerType: "laser" });
        } else {
          bulletsRef.current.push({ id: _uid++, x: cx2, y: p.y + 4, vx: 0, vy: -BULLET_SPD, isEnemy: false });
        }
        shootCoolRef.current = ap ? POWER_DEFS[ap].cooldown : 0.17;
      }

      powerSpawnTimerRef.current -= dt;
      if (powerSpawnTimerRef.current <= 0) {
        const types: PowerType[] = ["spread", "rapid", "double", "laser"];
        const t = types[Math.floor(Math.random() * types.length)];
        powerUpsRef.current.push({ id: _uid++, x: 30 + Math.random() * (CW - 60), y: -20, type: t, vy: 55 + Math.random() * 30, pulse: 0 });
        powerSpawnTimerRef.current = 14 + Math.random() * 10;
      }

      const killPowers = new Set<number>();
      powerUpsRef.current.forEach(pw => {
        pw.y += pw.vy * dt;
        pw.pulse += dt * 3;
        if (pw.y > CH + 20) { killPowers.add(pw.id); return; }
        if (p.x < pw.x + 18 && p.x + p.w > pw.x - 18 && p.y < pw.y + 18 && p.y + p.h > pw.y - 18) {
          killPowers.add(pw.id);
          activePowerRef.current = pw.type;
          setActivePower(pw.type);
          powerTimerRef.current = POWER_DEFS[pw.type].duration;
          setPowerTimeLeft(POWER_DEFS[pw.type].duration);
          spawnParticles(pw.x, pw.y, POWER_DEFS[pw.type].color, 22);
          scorePopRef.current.push({ x: pw.x, y: pw.y, txt: `${POWER_DEFS[pw.type].icon} ${POWER_DEFS[pw.type].label}!`, alpha: 1, vy: -80 });
          playPopSound();
        }
      });
      powerUpsRef.current = powerUpsRef.current.filter(pw => !killPowers.has(pw.id));

      if (activePowerRef.current) {
        powerTimerRef.current -= dt;
        setPowerTimeLeft(Math.max(0, powerTimerRef.current));
        if (powerTimerRef.current <= 0) {
          activePowerRef.current = null;
          setActivePower(null);
          setPowerTimeLeft(0);
        }
      }

      spawnTimerRef.current -= dt * 1000;
      if (spawnTimerRef.current <= 0) {
        spawnWave();
        spawnTimerRef.current = DIFFICULTY_STAGES[getDiffStage(elapsedRef.current)].spawnMs;
      }

      if (bossAlertTimerRef.current > 0) {
        bossAlertTimerRef.current -= dt;
        if (bossAlertTimerRef.current <= 0) setBossAlert(false);
      }

      if (elapsedRef.current >= nextBossAtRef.current) {
        nextBossAtRef.current += BOSS_INTERVAL;
        spawnBoss();
      }

      bulletsRef.current.forEach(b => { b.x += b.vx * dt; b.y += b.vy * dt; });
      bulletsRef.current = bulletsRef.current.filter(b => b.y > -30 && b.y < CH + 30 && b.x > -30 && b.x < CW + 30);

      enemiesRef.current.forEach(e => {
        e.pulse += dt * 2.2;
        if (e.isBoss) {
          const targetY = 30;
          if (e.y < targetY) {
            e.y += e.vy * dt;
            if (e.y >= targetY) { e.y = targetY; e.vy = 0; }
          }
          e.x += e.vx * dt;
          if (e.x < 0 || e.x + e.w > CW) { e.vx *= -1; e.x = Math.max(0, Math.min(CW - e.w, e.x)); }
          if (!e.phase2 && e.hp <= BOSS_HP / 2) { e.phase2 = true; e.vx *= 1.5; }
          e.shootTimer -= dt;
          if (e.shootTimer <= 0) {
            const bx = e.x + e.w / 2, by = e.y + e.h * 0.7;
            const shots = e.phase2 ? 5 : 3;
            for (let si = 0; si < shots; si++) {
              const ang = (Math.PI / 2) + ((si - (shots - 1) / 2) * 0.35);
              bulletsRef.current.push({ id: _uid++, x: bx, y: by, vx: Math.cos(ang) * 180, vy: Math.sin(ang) * 180, isEnemy: true });
            }
            e.shootTimer = e.phase2 ? 1.1 : 1.6;
          }
        } else {
          e.x += e.vx * dt; e.y += e.vy * dt;
          if (e.x < 0 || e.x + e.w > CW) { e.vx *= -1; e.x = Math.max(0, Math.min(CW - e.w, e.x)); }
          e.shootTimer -= dt;
          if (e.shootTimer <= 0 && e.y > -10) {
            const ex = e.x + e.w / 2, ey2 = e.y + e.h;
            const spread = (Math.random() - 0.5) * 0.4;
            bulletsRef.current.push({ id: _uid++, x: ex, y: ey2, vx: Math.sin(spread) * 150, vy: 155 + Math.random() * 30, isEnemy: true });
            const st = DIFFICULTY_STAGES[getDiffStage(elapsedRef.current)];
            e.shootTimer = st.shootMin + Math.random() * st.shootRand;
          }
        }
      });
      enemiesRef.current = enemiesRef.current.filter(e => e.isBoss ? true : e.y < CH + 70);

      const killBullets = new Set<number>();
      const killEnemies = new Set<number>();
      bulletsRef.current.forEach(b => {
        if (b.isEnemy) return;
        enemiesRef.current.forEach(e => {
          if (killEnemies.has(e.id)) return;
          if (b.x > e.x && b.x < e.x + e.w && b.y > e.y && b.y < e.y + e.h) {
            if (b.powerType !== "laser") killBullets.add(b.id);
            e.hp--;
            if (e.hp <= 0) {
              killEnemies.add(e.id);
              const pts = e.isBoss ? 200 : (ENEMY_DEFS[e.imgIdx]?.pts ?? 20);
              scoreRef.current += pts;
              setScore(scoreRef.current);
              spawnParticles(e.x + e.w / 2, e.y + e.h / 2, e.glow, e.isBoss ? 40 : 14);
              scorePopRef.current.push({ x: e.x + e.w / 2, y: e.y, txt: `+${pts}`, alpha: 1, vy: -90 });
              playPopSound();
            }
          }
        });
      });
      bulletsRef.current = bulletsRef.current.filter(b => !killBullets.has(b.id));
      enemiesRef.current = enemiesRef.current.filter(e => !killEnemies.has(e.id));

      bulletsRef.current.forEach(b => {
        if (!b.isEnemy) return;
        const p2 = playerRef.current;
        if (p2.invincible > 0) return;
        if (b.x > p2.x && b.x < p2.x + p2.w && b.y > p2.y && b.y < p2.y + p2.h) {
          killBullets.add(b.id);
          livesRef.current--;
          setLives(livesRef.current);
          p2.invincible = 2.2;
          spawnParticles(p2.x + p2.w / 2, p2.y + p2.h / 2, "#00BFFF", 18);
          if (livesRef.current <= 0) {
            phaseRef.current = "dead";
            setPhase("dead");
            if (scoreRef.current > bestRef.current) { bestRef.current = scoreRef.current; setBest(scoreRef.current); }
          }
        }
      });
      bulletsRef.current = bulletsRef.current.filter(b => !killBullets.has(b.id));
    }

    // Draw power-ups
    powerUpsRef.current.forEach(pw => {
      const pd = POWER_DEFS[pw.type];
      const glow = 0.6 + 0.4 * Math.sin(pw.pulse);
      ctx.save();
      ctx.shadowColor = pd.color;
      ctx.shadowBlur = 14 * glow;
      ctx.beginPath();
      ctx.arc(pw.x, pw.y, 11, 0, Math.PI * 2);
      const g = ctx.createRadialGradient(pw.x, pw.y, 0, pw.x, pw.y, 11);
      g.addColorStop(0, pd.color + "cc"); g.addColorStop(1, pd.color + "44");
      ctx.fillStyle = g; ctx.fill();
      ctx.strokeStyle = pd.color; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.font = "bold 11px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff"; ctx.fillText(pd.icon, pw.x, pw.y);
      ctx.restore();
    });

    enemiesRef.current.forEach(e => drawEnemy(ctx, e));

    if (ph === "playing" || ph === "dead") {
      drawPlayer(ctx, playerRef.current, ts);
    }

    bulletsRef.current.forEach(b => {
      ctx.save();
      if (b.powerType === "laser") {
        ctx.strokeStyle = "#ff5555"; ctx.lineWidth = 3;
        ctx.shadowColor = "#ff0000"; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x, b.y - 18); ctx.stroke();
      } else if (b.isEnemy) {
        const eg = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 5);
        eg.addColorStop(0, "#ff4444"); eg.addColorStop(1, "transparent");
        ctx.fillStyle = eg;
        ctx.beginPath(); ctx.arc(b.x, b.y, 5, 0, Math.PI * 2); ctx.fill();
      } else {
        const pg = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 4);
        const col = b.powerType === "spread" ? "#facc15" : b.powerType === "double" ? "#c084fc" : b.powerType === "rapid" ? "#22d3ee" : "#00FFFF";
        pg.addColorStop(0, col); pg.addColorStop(1, "transparent");
        ctx.fillStyle = pg;
        ctx.shadowColor = col; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(b.x, b.y, 4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    });

    particlesRef.current.forEach(p => {
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.vx *= 0.96; p.vy *= 0.96;
      p.alpha = Math.max(0, p.alpha - dt * 1.4);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    particlesRef.current = particlesRef.current.filter(p => p.alpha > 0.02);

    scorePopRef.current.forEach(sp => {
      sp.y += sp.vy * dt;
      sp.alpha = Math.max(0, sp.alpha - dt * 1.1);
      ctx.save();
      ctx.globalAlpha = sp.alpha;
      ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#FFD700";
      ctx.shadowColor = "#FF8800"; ctx.shadowBlur = 6;
      ctx.fillText(sp.txt, sp.x, sp.y);
      ctx.restore();
    });
    scorePopRef.current = scorePopRef.current.filter(sp => sp.alpha > 0.02);

    // Boss HP bar
    const boss = enemiesRef.current.find(e => e.isBoss);
    if (boss) {
      const bw = CW * 0.7, bh = 8, bx = (CW - bw) / 2, by = CH - 22;
      ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(bx, by, bw, bh);
      const pct = boss.hp / boss.maxHp;
      const hpGrad = ctx.createLinearGradient(bx, by, bx + bw, by);
      hpGrad.addColorStop(0, "#ff4444"); hpGrad.addColorStop(0.5, "#ff8800"); hpGrad.addColorStop(1, "#ffcc00");
      ctx.fillStyle = hpGrad; ctx.fillRect(bx, by, bw * pct, bh);
      ctx.strokeStyle = "#ff4444"; ctx.lineWidth = 1; ctx.strokeRect(bx, by, bw, bh);
      ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#fff";
      ctx.fillText(`👑 RAJA — ${boss.hp}/${boss.maxHp} HP`, CW / 2, by - 3);
    }

    // Guru quiz countdown chip
    if (guruQuiz.isCountdownActive && ph === "playing") {
      const s = guruQuiz.secondsUntilNext;
      const isUrgent = s <= 5;
      const chipW = 130, chipH = 22, chipX = (CW - chipW) / 2, chipY = 6;
      ctx.save();
      ctx.globalAlpha = 0.88;
      ctx.fillStyle = isUrgent ? "rgba(200,0,0,0.85)" : "rgba(0,0,0,0.7)";
      ctx.beginPath(); ctx.roundRect(chipX, chipY, chipW, chipH, 11); ctx.fill();
      ctx.strokeStyle = isUrgent ? "#ff4444" : "rgba(0,255,255,0.35)"; ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.font = `bold 11px sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = isUrgent ? "#ff9999" : "#00FFFF";
      ctx.fillText(`👩‍🏫 SOAL GURU: ${s}s`, CW / 2, chipY + chipH / 2);
      ctx.restore();
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [drawEnemy, drawPlayer, spawnWave, spawnBoss, spawnParticles, guruQuiz.isPausedRef, guruQuiz.isCountdownActive, guruQuiz.secondsUntilNext]);

  const startGame = useCallback(() => {
    playPopSound();
    resetGame();
    phaseRef.current = "playing";
    setPhase("playing");
    lastTsRef.current = 0;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [resetGame, loop]);

  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," "].includes(e.key)) e.preventDefault();
      keysRef.current[e.key] = true;
    };
    const up = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", dn); window.removeEventListener("keyup", up); };
  }, []);

  useEffect(() => {
    resetGame();
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop, resetGame]);

  useEffect(() => {
    const img = new Image();
    img.src = "/pesawat-nobg-new.png";
    img.onload = () => { shipImgRef.current = img; };
  }, []);

  useEffect(() => {
    const srcs = ["/musuh-1.png", "/musuh-2.png", "/musuh-3.png", "/musuh-4.png", "/raja.png"];
    srcs.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => { enemyImgsRef.current[i] = img; };
    });
  }, []);

  const onJoyStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const bx = touch.clientX - rect.left, by = touch.clientY - rect.top;
    joyBaseRef.current = { x: bx, y: by };
    joyHandleRef.current = { x: bx, y: by };
    joyActiveRef.current = true;
    joyDirRef.current = { x: 0, y: 0 };
    setJoyActive(true);
    setJoyHandle({ x: bx, y: by });
  }, []);

  const onJoyMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!joyActiveRef.current) return;
    const touch = e.touches[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const tx = touch.clientX - rect.left, ty = touch.clientY - rect.top;
    const bx = joyBaseRef.current.x, by = joyBaseRef.current.y;
    const dx = tx - bx, dy = ty - by;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clamp = Math.min(dist, JOYSTICK_R);
    const ang = Math.atan2(dy, dx);
    const hx = bx + Math.cos(ang) * clamp, hy = by + Math.sin(ang) * clamp;
    joyHandleRef.current = { x: hx, y: hy };
    joyDirRef.current = { x: (clamp / JOYSTICK_R) * Math.cos(ang), y: (clamp / JOYSTICK_R) * Math.sin(ang) };
    setJoyHandle({ x: hx, y: hy });
  }, []);

  const onJoyEnd = useCallback(() => {
    joyActiveRef.current = false;
    joyDirRef.current = { x: 0, y: 0 };
    setJoyActive(false);
    setJoyHandle({ x: 55, y: 55 });
  }, []);

  return (
    <div className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: "100dvh" }}>
      {isLight ? <Snowfall /> : <Starfield />}
      <GuruQuizOverlay {...guruQuiz} />

      {/* IDLE START SCREEN */}
      {phase === "idle" && (
        <div className="fixed inset-0 z-40 overflow-hidden">
          <style>{`
            @keyframes gt-floatA { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
            @keyframes gt-floatB { 0%,100%{transform:translateY(-5px)} 50%{transform:translateY(7px)} }
            @keyframes gt-floatC { 0%,100%{transform:translateY(0px) rotate(180deg)} 50%{transform:translateY(-8px) rotate(180deg)} }
            @keyframes gt-pulse  { 0%,100%{opacity:0.75} 50%{opacity:1} }
            @keyframes gt-shimmer{ 0%{background-position:200% center} 100%{background-position:-200% center} }
            @keyframes gt-scanY  { 0%{transform:translateY(-120%)} 100%{transform:translateY(220%)} }
            .gt-fa{animation:gt-floatA 3.2s ease-in-out infinite}
            .gt-fb{animation:gt-floatB 3.8s ease-in-out infinite}
            .gt-fc{animation:gt-floatC 3.5s ease-in-out infinite}
            .gt-fp{animation:gt-pulse 2s ease-in-out infinite}
            .gt-title-shine{background:linear-gradient(90deg,#00FFFF,#22d3ee,#818cf8,#c084fc,#22d3ee,#00FFFF);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:gt-shimmer 4s linear infinite}
            @keyframes gt-breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
            .gt-btn-breathe{animation:gt-breathe 2.8s ease-in-out infinite}
            .gt-scroll { height:100%; overflow-y:auto; scrollbar-width:none; display:flex; flex-direction:column; }
            .gt-wrap   { flex:1; display:flex; flex-direction:column; justify-content:space-evenly; padding:0.5rem 1rem; width:100%; }
            .gt-main   { display:flex; flex-direction:column; gap:0.75rem; }
            .gt-battle { display:flex; flex-direction:column; gap:0.5rem; }
            .gt-action { display:flex; flex-direction:column; gap:0.5rem; }
            @media (orientation:landscape) {
              .gt-wrap   { justify-content:space-evenly; padding:0.35rem 1.75rem; max-width:860px; margin:0 auto; width:100%; }
              .gt-header { margin-bottom:0; }
              .gt-main   { flex-direction:row; align-items:stretch; gap:2rem; }
              .gt-battle { flex:1; justify-content:center; gap:0.6rem; }
              .gt-action { flex:1; justify-content:center; gap:0.6rem; }
            }
          `}</style>

          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 15%, rgba(0,50,130,1) 0%, rgba(4,0,30,1) 60%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 10% 50%, rgba(80,0,180,0.2) 0%, transparent 55%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 90% 30%, rgba(0,100,200,0.15) 0%, transparent 55%)" }} />
          <div className="absolute inset-x-0 h-[1px] pointer-events-none" style={{ background: "linear-gradient(to right, transparent, rgba(0,255,255,0.18), transparent)", animation: "gt-scanY 6s linear infinite" }} />

          <div className="gt-scroll relative z-10">
            <div className="gt-wrap">
              <div className="gt-header flex flex-col items-center text-center">
                <div className="flex items-center justify-between w-full mb-1">
                  <button onClick={() => { playPopSound(); navigate(backPath); }}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-xs shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:opacity-90 transition-opacity cursor-pointer">
                    <span className="text-base leading-none">←</span>
                    <span>Kembali</span>
                  </button>
                  <div className="text-[7px] tracking-[5px] text-cyan-500/60 uppercase font-bold">⬡ NUMATIK GAME ⬡</div>
                  <button onClick={() => { playPopSound(); navigate(homePath); }}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-xs shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:opacity-90 transition-opacity cursor-pointer">
                    <span className="text-base leading-none">🏠</span>
                    <span>Home</span>
                  </button>
                </div>
                <div className="gt-title-shine font-display font-black leading-none" style={{ fontSize: "clamp(1.6rem,5vw,2.2rem)" }}>GALAKSI TEMPUR</div>
                <div className="mx-auto mt-0.5 h-0.5 w-28 rounded-full" style={{ background: "linear-gradient(to right, transparent, #00FFFF, #818cf8, transparent)" }} />
                <p className="text-cyan-400/70 text-[9px] font-bold tracking-wider uppercase mt-1">{topicLabel}</p>
                <p className="text-white/40 text-[8px] tracking-widest uppercase mt-0.5">⚡ Pertarungan Epik di Luar Angkasa ⚡</p>
              </div>

              <div className="gt-main">
                <div className="gt-battle">
                  <div className="flex items-end justify-center gap-4 w-full">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="text-[7px] text-cyan-400/70 font-bold tracking-wider uppercase">PESAWATMU</div>
                      <div className="relative">
                        <div className="absolute inset-0 pointer-events-none rounded-full" style={{ background: "radial-gradient(circle, rgba(0,255,255,0.2) 0%, transparent 70%)", transform: "scale(2)" }} />
                        <img src="/pesawat-nobg-new.png" alt="pesawat" className="gt-fa relative z-10"
                          style={{ width: 48, filter: "drop-shadow(0 0 14px #00FFFF) drop-shadow(0 0 28px #0088FF)" }} />
                      </div>
                      <div className="w-1.5 h-4 rounded-full" style={{ background: "linear-gradient(to bottom, rgba(0,200,255,0.8), transparent)" }} />
                      <div className="text-[8px] font-bold text-cyan-400">KAMU</div>
                    </div>
                    <div className="flex flex-col items-center pb-4">
                      <div className="text-xl font-black text-white/20">VS</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { src: "/musuh-1.png", glow: "#ff6b6b", pts: 30, name: "BOMBER",  rotated: true,  delay: "0s"   },
                        { src: "/musuh-2.png", glow: "#818cf8", pts: 20, name: "FIGHTER", rotated: true,  delay: "0.5s" },
                        { src: "/musuh-3.png", glow: "#fb923c", pts: 25, name: "RAIDER",  rotated: false, delay: "1s"   },
                        { src: "/musuh-4.png", glow: "#4ade80", pts: 35, name: "SAUCER",  rotated: true,  delay: "1.5s" },
                      ].map(e => (
                        <div key={e.name} className="flex flex-col items-center gap-0.5">
                          <div className="relative rounded-lg p-1.5 border"
                            style={{ borderColor: e.glow + "55", background: e.glow + "12", boxShadow: `0 0 10px ${e.glow}33` }}>
                            <img src={e.src} alt={e.name}
                              style={{ width: 30, height: "auto", filter: `drop-shadow(0 0 7px ${e.glow}) drop-shadow(0 0 2px ${e.glow})`, transform: e.rotated ? "rotate(180deg)" : undefined, animation: `gt-floatB 3.4s ease-in-out infinite`, animationDelay: e.delay }} />
                          </div>
                          <span className="text-[6px] font-bold" style={{ color: e.glow }}>{e.name}</span>
                          <span className="text-[7px] font-bold text-yellow-300">+{e.pts}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="w-full h-px my-1.5" style={{ background: "linear-gradient(to right, transparent, rgba(255,50,50,0.35), transparent)" }} />
                    <div className="flex items-center gap-3 w-full px-1">
                      <div className="relative rounded-xl border-2 px-2.5 py-1.5 flex flex-col items-center shrink-0"
                        style={{ borderColor: "#ff444477", background: "linear-gradient(160deg, rgba(100,0,0,0.5), rgba(30,0,0,0.7))", boxShadow: "0 0 25px rgba(255,40,0,0.4), inset 0 1px 0 rgba(255,80,80,0.1)" }}>
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm">👑</div>
                        <img src="/raja.png" alt="Raja" className="gt-fp mt-1"
                          style={{ width: 52, filter: "drop-shadow(0 0 16px #ff4444) drop-shadow(0 0 30px rgba(255,0,0,0.45)) drop-shadow(0 0 5px #ff8800)" }} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <div className="text-[8px] text-red-400/60 tracking-widest uppercase font-bold">💀 RAJA BESAR</div>
                        <div className="text-sm font-black text-red-300" style={{ textShadow: "0 0 10px #ff4444" }}>200 POIN</div>
                        <div className="text-[7px] text-white/30 leading-relaxed">25 HP · 2 Fase Serangan · Muncul tiap 60 detik</div>
                        <div className="flex gap-1 mt-0.5">
                          {["#ff4444","#ff8800","#ffcc00"].map(c => (
                            <div key={c} className="w-1.5 h-1.5 rounded-full" style={{ background: c, boxShadow: `0 0 4px ${c}` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="gt-action">
                  <div>
                    <div className="w-full h-px mb-1.5" style={{ background: "linear-gradient(to right, transparent, rgba(250,204,21,0.3), transparent)" }} />
                    <div className="text-[7px] text-white/35 tracking-widest uppercase mb-1.5 font-bold text-center">⚡ Power-Up Tembakan</div>
                    <div className="grid grid-cols-4 gap-1.5 w-full">
                      {(Object.entries(POWER_DEFS) as [PowerType, typeof POWER_DEFS[PowerType]][]).map(([, pd]) => (
                        <div key={pd.label} className="flex flex-col items-center gap-0.5 rounded-xl py-1.5 px-1 border"
                          style={{ borderColor: pd.color + "44", background: pd.color + "0f", boxShadow: `0 0 8px ${pd.color}33` }}>
                          <span className="text-base leading-none" style={{ filter: `drop-shadow(0 0 5px ${pd.color})` }}>{pd.icon}</span>
                          <span className="text-[7px] font-black" style={{ color: pd.color }}>{pd.label}</span>
                          <span className="text-[6px] text-white/35 text-center leading-tight">
                            {pd.label === "SPREAD" && "5 arah"}
                            {pd.label === "RAPID" && "3× cepat"}
                            {pd.label === "DOUBLE" && "2 sejajar"}
                            {pd.label === "LASER" && "Tembus"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1 mt-2">
                    <button onClick={startGame}
                      className="gt-btn-breathe relative overflow-hidden font-display font-black text-black text-lg px-8 py-3 rounded-2xl cursor-pointer hover:scale-110 active:scale-95 w-full"
                      style={{
                        background: "linear-gradient(135deg, #00FFFF 0%, #22d3ee 40%, #0ea5e9 100%)",
                        boxShadow: "0 0 30px rgba(0,200,255,0.9), 0 0 60px rgba(0,120,200,0.4), 0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.4)",
                      }}>
                      <span className="relative z-10 tracking-wide">🚀 MULAI BERMAIN</span>
                    </button>
                    <div className="text-[7px] text-white/20 text-center leading-relaxed">
                      Joystick / WASD untuk bergerak · SPASI / FIRE untuk menembak
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`relative z-10 w-full max-w-lg px-2 flex flex-col items-center ${phase === "idle" ? "pt-0 pb-0" : "pt-6 pb-2"}`} style={{ height: "100dvh" }}>
        {phase !== "idle" && (
          <div className="flex items-center justify-between w-full mb-2 shrink-0 gap-2">
            <button onClick={() => { playPopSound(); navigate(backPath); }}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:opacity-90 transition-opacity cursor-pointer"
              title="Kembali">
              <span className="text-base leading-none">←</span>
              <span className="hidden sm:inline">Kembali</span>
            </button>
            <h1 className="font-display text-xl font-bold text-primary text-glow-cyan text-center flex-1">🌌 GALAKSI TEMPUR</h1>
            <button onClick={() => { playPopSound(); navigate(homePath); }}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,200,255,0.4)] hover:opacity-90 transition-opacity cursor-pointer"
              title="Menu Utama">
              <span className="text-base leading-none">🏠</span>
              <span className="hidden sm:inline">Home</span>
            </button>
          </div>
        )}

        {phase !== "idle" && (
          <div className="flex gap-4 mb-1 text-xs font-display shrink-0">
            <span className="text-cyan-400">SKOR: <span className="font-bold text-sm">{score}</span></span>
            <span className="text-white/50">REKOR: <span className="text-yellow-400 font-bold">{best}</span></span>
            <span className="flex gap-0.5">{[...Array(3)].map((_, i) => <span key={i} className={i < lives ? "opacity-100" : "opacity-20"}>💙</span>)}</span>
          </div>
        )}

        {phase !== "idle" && activePower && (
          <div className="flex items-center gap-1.5 mb-1 shrink-0">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
              style={{ color: POWER_DEFS[activePower].color, borderColor: POWER_DEFS[activePower].color, background: POWER_DEFS[activePower].color + "22", boxShadow: `0 0 8px ${POWER_DEFS[activePower].color}66` }}>
              {POWER_DEFS[activePower].icon} {POWER_DEFS[activePower].label}
            </span>
            <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{ width: `${(powerTimeLeft / POWER_DEFS[activePower].duration) * 100}%`, background: powerTimeLeft < 2 ? "#ff5555" : POWER_DEFS[activePower].color }} />
            </div>
            <span className="text-[9px] text-white/40">{Math.ceil(powerTimeLeft)}s</span>
          </div>
        )}

        <div className={`relative w-full select-none shrink-0`} style={{ maxWidth: CW, ...(phase === "idle" ? { height: "100dvh" } : { aspectRatio: `${CW}/${CH}`, maxHeight: "calc(100dvh - 240px)" }) }}>
          <canvas ref={canvasRef} width={CW} height={CH} className="rounded-2xl border border-border shadow-2xl w-full h-full" />

          {tierAlert && (
            <div className="absolute inset-x-0 top-4 flex items-start justify-center pointer-events-none z-30">
              <div className="animate-bounce rounded-2xl px-5 py-2.5 text-center shadow-2xl border-2"
                style={{ background: "rgba(0,0,0,0.85)", borderColor: DIFFICULTY_STAGES[diffTier].color, boxShadow: `0 0 24px ${DIFFICULTY_STAGES[diffTier].color}` }}>
                <p className="font-bold text-base tracking-widest" style={{ color: DIFFICULTY_STAGES[diffTier].color }}>
                  ⚡ TINGKAT: {DIFFICULTY_STAGES[diffTier].label}!
                </p>
                <p className="text-white/70 text-[11px] mt-0.5">Musuh makin cepat dan berbahaya!</p>
              </div>
            </div>
          )}

          {bossAlert && (
            <div className="absolute inset-x-0 top-16 flex items-start justify-center pointer-events-none z-30">
              <div className="animate-bounce bg-red-900/90 border-2 border-red-500 rounded-2xl px-6 py-3 text-center shadow-2xl" style={{ boxShadow: "0 0 30px #ff2222" }}>
                <p className="text-red-400 font-bold text-lg tracking-widest">⚠️ RAJA MUNCUL! ⚠️</p>
                <p className="text-yellow-300 text-xs mt-0.5">Musuh RAJA sedang memasuki arena!</p>
              </div>
            </div>
          )}

          {phase === "dead" && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/75">
              <div className="text-center px-5">
                <div className="text-4xl mb-2">💥</div>
                <h2 className="font-display text-2xl font-bold text-red-400 mb-1">GAME OVER</h2>
                <p className="text-white mb-1">Skor: <span className="text-yellow-400 font-bold text-2xl">{score}</span></p>
                <p className="text-white/50 text-sm mb-5">Rekor: {best}</p>
                <button onClick={startGame} className="bg-cyan-500 text-black font-bold px-8 py-3 rounded-xl hover:opacity-90 transition cursor-pointer shadow-lg">
                  🚀 Main Lagi
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={`flex items-center justify-between w-full max-w-sm mt-auto mb-2 px-3 shrink-0 ${phase === "idle" ? "hidden" : ""}`}>
          <div
            className="relative touch-none select-none"
            style={{ width: 110, height: 110 }}
            onTouchStart={onJoyStart}
            onTouchMove={onJoyMove}
            onTouchEnd={onJoyEnd}
            onTouchCancel={onJoyEnd}
          >
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 bg-cyan-500/10 backdrop-blur-sm" />
            <div className="absolute" style={{ left: "50%", top: "12%", bottom: "12%", width: 1, background: "rgba(0,255,255,0.2)", transform: "translateX(-50%)" }} />
            <div className="absolute" style={{ top: "50%", left: "12%", right: "12%", height: 1, background: "rgba(0,255,255,0.2)", transform: "translateY(-50%)" }} />
            {["↑","↓","←","→"].map((arrow, i) => {
              const pos = [
                { top: "4%", left: "50%", transform: "translateX(-50%)" },
                { bottom: "4%", left: "50%", transform: "translateX(-50%)" },
                { top: "50%", left: "4%", transform: "translateY(-50%)" },
                { top: "50%", right: "4%", transform: "translateY(-50%)" },
              ][i];
              return <span key={i} className="absolute text-cyan-300/40 text-xs font-bold" style={pos}>{arrow}</span>;
            })}
            <div
              className="absolute rounded-full bg-cyan-400/85 border-2 border-cyan-200/70"
              style={{
                width: 38, height: 38,
                left: joyHandle.x - 19,
                top: joyHandle.y - 19,
                boxShadow: joyActive ? "0 0 20px rgba(0,255,255,0.85)" : "0 0 10px rgba(0,255,255,0.4)",
                transition: joyActive ? "none" : "left 0.15s, top 0.15s",
              }}
            />
            <p className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-cyan-300/50 whitespace-nowrap">GERAK</p>
          </div>

          <div className="text-center flex flex-col items-center gap-1 text-white/25">
            <span className="text-[10px]">⌨️ WASD / ↑↓←→</span>
            <span className="text-[10px]">SPASI tembak</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button
              className="rounded-full border-4 border-red-300/60 active:scale-90 transition-transform select-none touch-none flex items-center justify-center font-black text-white text-2xl"
              style={{
                width: 80, height: 80,
                background: "radial-gradient(circle at 35% 35%, #ff6b6b, #cc0000)",
                boxShadow: "0 0 28px rgba(255,60,60,0.75), inset 0 2px 4px rgba(255,255,255,0.25)",
              }}
              onPointerDown={(e) => { e.preventDefault(); fireRef.current = true; }}
              onPointerUp={() => { fireRef.current = false; }}
              onPointerLeave={() => { fireRef.current = false; }}
              onPointerCancel={() => { fireRef.current = false; }}
            >
              🔥
            </button>
            <p className="text-[9px] text-red-300/50 -mt-0.5">FIRE</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalaksiTempurPage;
