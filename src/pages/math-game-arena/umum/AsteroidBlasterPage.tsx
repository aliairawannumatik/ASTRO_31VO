import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";

// ── Canvas dims ────────────────────────────────────────────────────────────
const CW = 420;
const CH = 560;
const PLAYER_SPD = 290;
const BULLET_SPD = 520;
const JOYSTICK_R = 48;
const BOSS_INTERVAL = 60;  // seconds between boss appearances
const BOSS_W = 160;
const BOSS_H = 148;
const BOSS_HP = 25;
const BOSS_PTS = 200;

// ── Types ──────────────────────────────────────────────────────────────────
let _uid = 0;
interface Player { x: number; y: number; w: number; h: number; invincible: number }
interface Bullet { id: number; x: number; y: number; vx: number; vy: number; isEnemy: boolean }
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

// imgIdx → file, glow, rotate180
const ENEMY_DEFS = [
  { type: "bomber" as const,  glow: "#ff6b6b", pts: 30, hp: 3, imgIdx: 0, rotate: true  }, // musuh-1 merah besar
  { type: "fighter" as const, glow: "#818cf8", pts: 20, hp: 2, imgIdx: 1, rotate: true  }, // musuh-2 biru dark
  { type: "raider" as const,  glow: "#fb923c", pts: 25, hp: 2, imgIdx: 2, rotate: false }, // musuh-3 oranye emas
  { type: "saucer" as const,  glow: "#4ade80", pts: 35, hp: 4, imgIdx: 3, rotate: true  }, // musuh-4 hijau ungu boss
];

// ── Component ─────────────────────────────────────────────────────────────
const AsteroidBlasterPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);

  const phaseRef = useRef<Phase>("idle");
  const guruQuiz = useGuruQuiz(phaseRef);

  // Game object refs
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

  // Joystick refs
  const joyBaseRef = useRef({ x: 55, y: 55 });
  const joyHandleRef = useRef({ x: 55, y: 55 });
  const joyDirRef = useRef({ x: 0, y: 0 });
  const joyActiveRef = useRef(false);
  const fireRef = useRef(false);

  // Images
  const shipImgRef = useRef<HTMLImageElement | null>(null);
  const enemyImgsRef = useRef<Array<HTMLImageElement | null>>([null, null, null, null, null]);

  // Boss refs
  const nextBossAtRef = useRef(BOSS_INTERVAL);
  const bossAlertTimerRef = useRef(0);

  // React state
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [best, setBest] = useState(0);
  const [joyHandle, setJoyHandle] = useState({ x: 55, y: 55 });
  const [joyActive, setJoyActive] = useState(false);
  const [bossAlert, setBossAlert] = useState(false);

  // ── Spawn helpers ──────────────────────────────────────────────────────
  const spawnParticles = useCallback((x: number, y: number, color: string, n = 12) => {
    for (let i = 0; i < n; i++) {
      const ang = (Math.PI * 2 * i) / n + Math.random() * 0.5;
      const spd = 60 + Math.random() * 160;
      particlesRef.current.push({ x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, alpha: 1, color, r: 2 + Math.random() * 4 });
    }
  }, []);

  const spawnWave = useCallback(() => {
    waveRef.current++;
    const wave = waveRef.current;
    const count = Math.min(2 + Math.floor(wave / 3), 6);
    for (let i = 0; i < count; i++) {
      const pool = wave >= 5 ? ENEMY_DEFS : ENEMY_DEFS.slice(0, 3);
      const def = pool[Math.floor(Math.random() * pool.length)];
      const w = def.type === "saucer" ? 60 : def.type === "bomber" ? 54 : 42 + Math.random() * 10;
      const h = def.type === "saucer" ? 56 : def.type === "bomber" ? 38 : 30 + Math.random() * 10;
      enemiesRef.current.push({
        id: _uid++,
        x: 20 + Math.random() * (CW - w - 20),
        y: -70 - i * 65,
        w, h,
        hp: def.hp, maxHp: def.hp,
        vx: (Math.random() - 0.5) * 90,
        vy: 46 + Math.random() * 34 + wave * 2.2,
        glow: def.glow,
        type: def.type,
        imgIdx: def.imgIdx,
        shootTimer: 2.5 + Math.random() * 3.5,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }, []);

  const spawnBoss = useCallback(() => {
    setBossAlert(true);
    bossAlertTimerRef.current = 2.5;
    // Remove any previous boss
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

  // ── Draw enemy ────────────────────────────────────────────────────────
  const drawEnemy = useCallback((ctx: CanvasRenderingContext2D, e: Enemy) => {
    const cx = e.x + e.w / 2, cy = e.y + e.h / 2;
    const img = enemyImgsRef.current[e.imgIdx];
    const def = ENEMY_DEFS[e.imgIdx];
    ctx.save();

    // Outer glow halo
    ctx.shadowColor = e.glow;
    ctx.shadowBlur = 18 + Math.sin(e.pulse) * 5;

    if (img) {
      // Rotate 180° if needed (so nose faces downward toward player)
      if (def.rotate) {
        ctx.translate(cx, cy);
        ctx.rotate(Math.PI);
        ctx.drawImage(img, -e.w / 2, -e.h / 2, e.w, e.h);
      } else {
        ctx.drawImage(img, e.x, e.y, e.w, e.h);
      }
    } else {
      // Fallback: simple colored shape
      ctx.fillStyle = e.glow;
      ctx.beginPath(); ctx.ellipse(cx, cy, e.w / 2, e.h / 2, 0, 0, Math.PI * 2); ctx.fill();
    }

    // HP bar (shown when hp > 1, skip boss — it has its own HUD bar)
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

  // ── Draw player ───────────────────────────────────────────────────────
  const drawPlayer = useCallback((ctx: CanvasRenderingContext2D, p: Player, ts: number) => {
    const cx = p.x + p.w / 2;
    // Engine glow
    const engY = p.y + p.h - 4;
    const thrPulse = 0.7 + 0.3 * Math.sin(ts / 80);
    const eng = ctx.createRadialGradient(cx, engY, 0, cx, engY, 24 * thrPulse);
    eng.addColorStop(0, "rgba(255,200,60,1)");
    eng.addColorStop(0.35, "rgba(255,100,0,0.7)");
    eng.addColorStop(1, "transparent");
    ctx.fillStyle = eng;
    ctx.beginPath(); ctx.arc(cx, engY, 24 * thrPulse, 0, Math.PI * 2); ctx.fill();

    // Invincibility flicker
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

  // ── Reset ─────────────────────────────────────────────────────────────
  const resetGame = useCallback(() => {
    playerRef.current = { x: CW / 2 - 28, y: CH - 120, w: 56, h: 64, invincible: 0 };
    bulletsRef.current = []; enemiesRef.current = [];
    particlesRef.current = []; scorePopRef.current = [];
    keysRef.current = {};
    scoreRef.current = 0; livesRef.current = 3;
    elapsedRef.current = 0; spawnTimerRef.current = 0; waveRef.current = 0;
    nextBossAtRef.current = BOSS_INTERVAL; bossAlertTimerRef.current = 0;
    joyActiveRef.current = false; joyDirRef.current = { x: 0, y: 0 };
    fireRef.current = false; shootCoolRef.current = 0;
    setScore(0); setLives(3); setJoyActive(false); setJoyHandle({ x: 55, y: 55 });
    setBossAlert(false);
    starsRef.current = Array.from({ length: 90 }, () => ({
      x: Math.random() * CW, y: Math.random() * CH,
      r: 0.4 + Math.random() * 1.6, spd: 30 + Math.random() * 70,
    }));
  }, []);

  // ── Main loop ──────────────────────────────────────────────────────────
  const loop = useCallback((ts: number) => {
    const dt = Math.min((ts - (lastTsRef.current || ts)) / 1000, 0.05);
    lastTsRef.current = ts;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const ph = phaseRef.current;

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, CH);
    bgGrad.addColorStop(0, "#020210"); bgGrad.addColorStop(1, "#060620");
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, CW, CH);

    // Scrolling stars
    starsRef.current.forEach(s => {
      if (ph === "playing") { s.y += s.spd * dt; if (s.y > CH) s.y = -4; }
      ctx.globalAlpha = 0.3 + Math.random() * 0.5;
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Nebula accent
    const neb = ctx.createRadialGradient(CW * 0.8, CH * 0.25, 0, CW * 0.8, CH * 0.25, 180);
    neb.addColorStop(0, "rgba(70,0,100,0.07)"); neb.addColorStop(1, "transparent");
    ctx.fillStyle = neb; ctx.fillRect(0, 0, CW, CH);

    if (ph === "playing" && !guruQuiz.isPausedRef.current) {
      elapsedRef.current += dt;
      const p = playerRef.current;

      // ── Player movement ──────────────────────────────────────────────
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

      // ── Shoot ────────────────────────────────────────────────────────
      if (shootCoolRef.current > 0) shootCoolRef.current -= dt;
      if ((keysRef.current[" "] || fireRef.current) && shootCoolRef.current <= 0) {
        const cx2 = p.x + p.w / 2;
        bulletsRef.current.push({ id: _uid++, x: cx2, y: p.y + 4, vx: 0, vy: -BULLET_SPD, isEnemy: false });
        shootCoolRef.current = 0.17;
      }

      // ── Spawn waves ──────────────────────────────────────────────────
      spawnTimerRef.current -= dt * 1000;
      if (spawnTimerRef.current <= 0) {
        spawnWave();
        spawnTimerRef.current = Math.max(1100, 1900 - elapsedRef.current * 6);
      }

      // ── Boss alert countdown ──────────────────────────────────────────
      if (bossAlertTimerRef.current > 0) {
        bossAlertTimerRef.current -= dt;
        if (bossAlertTimerRef.current <= 0) setBossAlert(false);
      }

      // ── Boss spawn check (every BOSS_INTERVAL seconds) ───────────────
      if (elapsedRef.current >= nextBossAtRef.current) {
        nextBossAtRef.current += BOSS_INTERVAL;
        spawnBoss();
      }

      // ── Move bullets ─────────────────────────────────────────────────
      bulletsRef.current.forEach(b => { b.x += b.vx * dt; b.y += b.vy * dt; });
      bulletsRef.current = bulletsRef.current.filter(b => b.y > -30 && b.y < CH + 30 && b.x > -30 && b.x < CW + 30);

      // ── Move enemies ──────────────────────────────────────────────────
      enemiesRef.current.forEach(e => {
        e.pulse += dt * 2.2;

        if (e.isBoss) {
          // Boss: enter from top, settle at y=30, then oscillate side to side
          const targetY = 30;
          if (e.y < targetY) {
            e.y += e.vy * dt;
            if (e.y >= targetY) { e.y = targetY; e.vy = 0; }
          }
          e.x += e.vx * dt;
          if (e.x < 0 || e.x + e.w > CW) { e.vx *= -1; e.x = Math.max(0, Math.min(CW - e.w, e.x)); }
          // Phase 2 at half HP — faster, shoots more
          if (!e.phase2 && e.hp <= BOSS_HP / 2) { e.phase2 = true; e.vx *= 1.5; }
          // Boss shoot — spread pattern
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
          // Regular enemy fire
          e.shootTimer -= dt;
          if (e.shootTimer <= 0 && e.y > -10) {
            const ex = e.x + e.w / 2, ey2 = e.y + e.h;
            const spread = (Math.random() - 0.5) * 0.4;
            bulletsRef.current.push({ id: _uid++, x: ex, y: ey2, vx: Math.sin(spread) * 150, vy: 155 + Math.random() * 30, isEnemy: true });
            e.shootTimer = 2.8 + Math.random() * 3;
          }
        }
      });
      enemiesRef.current = enemiesRef.current.filter(e => e.isBoss ? true : e.y < CH + 70);

      // ── Player bullet → enemy ─────────────────────────────────────────
      const killBullets = new Set<number>();
      const killEnemies = new Set<number>();
      bulletsRef.current.forEach(b => {
        if (b.isEnemy) return;
        enemiesRef.current.forEach(e => {
          if (killEnemies.has(e.id)) return;
          if (b.x > e.x && b.x < e.x + e.w && b.y > e.y && b.y < e.y + e.h) {
            killBullets.add(b.id);
            e.hp--;
            if (e.hp <= 0) {
              killEnemies.add(e.id);
              const pts = e.isBoss ? BOSS_PTS : ENEMY_DEFS[e.imgIdx]?.pts ?? 20;
              scoreRef.current += pts;
              setScore(scoreRef.current);
              const particleCount = e.isBoss ? 40 : 15;
              spawnParticles(e.x + e.w / 2, e.y + e.h / 2, e.glow, particleCount);
              if (e.isBoss) {
                spawnParticles(e.x + e.w / 2, e.y + e.h / 2, "#FF4444", 25);
                spawnParticles(e.x + e.w / 2, e.y + e.h / 2, "#FF8800", 20);
              }
              scorePopRef.current.push({ x: e.x + e.w / 2, y: e.y + e.h / 2, txt: `+${pts}${e.isBoss ? " 👑" : ""}`, alpha: 1, vy: -75 });
            } else {
              spawnParticles(b.x, b.y, e.glow, e.isBoss ? 8 : 5);
            }
          }
        });
      });
      bulletsRef.current = bulletsRef.current.filter(b => !killBullets.has(b.id));
      enemiesRef.current = enemiesRef.current.filter(e => !killEnemies.has(e.id));

      // ── Enemy bullet → player ─────────────────────────────────────────
      if (p.invincible <= 0) {
        let hit = false;
        bulletsRef.current.forEach(b => {
          if (!b.isEnemy || hit) return;
          if (b.x > p.x + 8 && b.x < p.x + p.w - 8 && b.y > p.y + 10 && b.y < p.y + p.h - 10) {
            b.y = -9999;
            hit = true;
          }
        });
        if (hit) {
          livesRef.current = Math.max(0, livesRef.current - 1);
          setLives(livesRef.current);
          p.invincible = 2.5;
          spawnParticles(p.x + p.w / 2, p.y + p.h / 2, "#FF4444", 18);
          if (livesRef.current <= 0) {
            phaseRef.current = "dead"; setPhase("dead");
            if (scoreRef.current > bestRef.current) { bestRef.current = scoreRef.current; setBest(scoreRef.current); }
          }
        }
        bulletsRef.current = bulletsRef.current.filter(b => b.y !== -9999);
      }

      // ── Enemy → player collision ──────────────────────────────────────
      if (p.invincible <= 0) {
        enemiesRef.current.forEach(e => {
          if (p.x < e.x + e.w && p.x + p.w > e.x && p.y < e.y + e.h && p.y + p.h > e.y) {
            livesRef.current = Math.max(0, livesRef.current - 1);
            setLives(livesRef.current);
            p.invincible = 2.5;
            if (!e.isBoss) e.hp = 0; // Boss survives body collision
            spawnParticles(p.x + p.w / 2, p.y + p.h / 2, "#FF4444", 20);
          }
        });
        enemiesRef.current = enemiesRef.current.filter(e => e.hp > 0);
      }

      // Update particles & pops
      particlesRef.current.forEach(pt => { pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.vy += 90 * dt; pt.alpha -= dt * 1.8; });
      particlesRef.current = particlesRef.current.filter(pt => pt.alpha > 0);
      scorePopRef.current.forEach(sp => { sp.y += sp.vy * dt; sp.alpha -= dt * 2.2; });
      scorePopRef.current = scorePopRef.current.filter(sp => sp.alpha > 0);
    }

    // ── Draw enemies ──────────────────────────────────────────────────
    enemiesRef.current.forEach(e => drawEnemy(ctx, e));

    // ── Draw bullets ──────────────────────────────────────────────────
    bulletsRef.current.forEach(b => {
      ctx.save();
      if (b.isEnemy) {
        ctx.shadowColor = "#ff5555"; ctx.shadowBlur = 8; ctx.fillStyle = "#ff5555";
        ctx.beginPath(); ctx.ellipse(b.x, b.y, 3, 6, 0, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.shadowColor = "#00FFFF"; ctx.shadowBlur = 12; ctx.fillStyle = "#00FFFF";
        ctx.beginPath(); ctx.ellipse(b.x, b.y, 3, 9, 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0; ctx.restore();
    });

    // ── Draw particles ────────────────────────────────────────────────
    particlesRef.current.forEach(pt => {
      ctx.globalAlpha = pt.alpha;
      ctx.shadowColor = pt.color; ctx.shadowBlur = 5;
      ctx.fillStyle = pt.color;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;

    // ── Draw score pops ───────────────────────────────────────────────
    scorePopRef.current.forEach(sp => {
      ctx.globalAlpha = sp.alpha;
      ctx.fillStyle = "#FFD700"; ctx.shadowColor = "#FFD700"; ctx.shadowBlur = 6;
      ctx.font = "bold 14px monospace"; ctx.textAlign = "center";
      ctx.fillText(sp.txt, sp.x, sp.y);
      ctx.shadowBlur = 0;
    });
    ctx.globalAlpha = 1;

    // ── Draw player ───────────────────────────────────────────────────
    if (ph !== "dead") drawPlayer(ctx, playerRef.current, ts);

    // ── HUD ───────────────────────────────────────────────────────────
    ctx.textBaseline = "top"; ctx.textAlign = "left";
    ctx.fillStyle = "#00FFAA"; ctx.font = "bold 14px monospace";
    ctx.fillText(`SKOR: ${scoreRef.current}`, 10, 10);
    ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.font = "11px monospace";
    ctx.fillText(`REKOR: ${bestRef.current}`, 10, 28);

    ctx.textAlign = "right"; ctx.font = "18px sans-serif";
    for (let i = 0; i < 3; i++) {
      ctx.globalAlpha = i < livesRef.current ? 1 : 0.2;
      ctx.fillText("💙", CW - 8 - i * 26, 10);
    }
    ctx.globalAlpha = 1; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // ── Boss HP bar (drawn on canvas above everything) ────────────────
    const boss = enemiesRef.current.find(e => e.isBoss);
    if (boss) {
      const barW = CW - 60, barH = 10;
      const barX = 30, barY = CH - 22;
      const hpRatio = Math.max(0, boss.hp / boss.maxHp);
      // Track — bg
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(barX - 2, barY - 2, barW + 4, barH + 4);
      ctx.fillStyle = "#330000";
      ctx.fillRect(barX, barY, barW, barH);
      // Fill — color shifts red→orange as hp drops
      const barColor = hpRatio > 0.5 ? "#ff2222" : "#ff8800";
      ctx.shadowColor = barColor; ctx.shadowBlur = 8;
      ctx.fillStyle = barColor;
      ctx.fillRect(barX, barY, barW * hpRatio, barH);
      ctx.shadowBlur = 0;
      // Label
      ctx.fillStyle = "#FFD700"; ctx.font = "bold 10px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "bottom";
      ctx.fillText(`👑 RAJA — ${boss.hp} / ${boss.maxHp} HP${boss.phase2 ? " ⚡ FASE 2!" : ""}`, CW / 2, barY - 3);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [drawEnemy, drawPlayer, spawnWave, spawnBoss, spawnParticles, guruQuiz.isPausedRef]);

  // ── Start game ────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    playPopSound();
    resetGame();
    phaseRef.current = "playing";
    setPhase("playing");
    lastTsRef.current = 0;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [resetGame, loop]);

  // Keyboard events
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

  // Init
  useEffect(() => {
    resetGame();
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop, resetGame]);

  // Load ship image
  useEffect(() => {
    const img = new Image();
    img.src = "/pesawat-nobg-new.png";
    img.onload = () => { shipImgRef.current = img; };
  }, []);

  // Load enemy images (index 4 = raja boss)
  useEffect(() => {
    const srcs = ["/musuh-1.png", "/musuh-2.png", "/musuh-3.png", "/musuh-4.png", "/raja.png"];
    srcs.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => { enemyImgsRef.current[i] = img; };
    });
  }, []);

  // ── Joystick handlers ─────────────────────────────────────────────────
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

      <div className="relative z-10 w-full max-w-lg px-2 pt-6 pb-2 flex flex-col items-center" style={{ height: "100dvh" }}>
        {/* Nav */}
        <div className="flex items-center justify-between w-full mb-2 shrink-0">
          <button onClick={() => { playPopSound(); navigate("/ruang-untuk-guru/numatik-game"); }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all text-sm shrink-0">🏠</button>
          <h1 className="font-display text-xl font-bold text-primary text-glow-cyan text-center flex-1">🌌 GALAKSI TEMPUR</h1>
          <button onClick={() => { playPopSound(); navigate(-1); }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all font-bold shrink-0">✕</button>
        </div>

        {/* Mini HUD */}
        <div className="flex gap-4 mb-2 text-xs font-display shrink-0">
          <span className="text-cyan-400">SKOR: <span className="font-bold text-sm">{score}</span></span>
          <span className="text-white/50">REKOR: <span className="text-yellow-400 font-bold">{best}</span></span>
          <span className="flex gap-0.5">{[...Array(3)].map((_, i) => <span key={i} className={i < lives ? "opacity-100" : "opacity-20"}>💙</span>)}</span>
        </div>

        {/* Canvas */}
        <div className="relative w-full select-none shrink-0" style={{ maxWidth: CW, aspectRatio: `${CW}/${CH}`, maxHeight: "calc(100dvh - 240px)" }}>
          <canvas ref={canvasRef} width={CW} height={CH} className="rounded-2xl border border-border shadow-2xl w-full h-full" />

          {/* Boss Alert Overlay */}
          {bossAlert && (
            <div className="absolute inset-x-0 top-16 flex items-start justify-center pointer-events-none z-30">
              <div className="animate-bounce bg-red-900/90 border-2 border-red-500 rounded-2xl px-6 py-3 text-center shadow-2xl" style={{ boxShadow: "0 0 30px #ff2222" }}>
                <p className="text-red-400 font-bold text-lg tracking-widest">⚠️ RAJA MUNCUL! ⚠️</p>
                <p className="text-yellow-300 text-xs mt-0.5">Musuh RAJA sedang memasuki arena!</p>
              </div>
            </div>
          )}

          {phase === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/75">
              <div className="text-center px-5 max-w-xs">
                <div className="text-5xl mb-2">🌌</div>
                <h2 className="font-display text-2xl font-bold text-cyan-400 mb-2">GALAKSI TEMPUR</h2>
                <p className="text-white/65 text-xs mb-4 leading-relaxed">
                  Hancurkan pesawat musuh yang menyerbu! Gunakan <span className="text-cyan-400 font-bold">joystick analog</span> untuk bergerak ke segala arah dan tombol <span className="text-red-400 font-bold">FIRE</span> untuk menembak.<br/><br/>
                  Setiap <span className="text-yellow-400 font-bold">25 detik</span> muncul soal matematika. Setiap <span className="text-red-400 font-bold">60 detik</span> muncul <span className="text-red-400 font-bold">👑 RAJA</span> — musuh boss berukuran besar yang harus ditembak berulang-ulang!
                </p>
                <div className="flex justify-center gap-2 mb-4 text-xs flex-wrap">
                  <span className="bg-red-900/30 border border-red-500/40 rounded-lg px-2 py-1">🔴 Bomber: 30 poin</span>
                  <span className="bg-indigo-900/30 border border-indigo-400/40 rounded-lg px-2 py-1">🔵 Fighter: 20 poin</span>
                  <span className="bg-orange-900/30 border border-orange-400/40 rounded-lg px-2 py-1">🟠 Raider: 25 poin</span>
                  <span className="bg-green-900/30 border border-green-400/40 rounded-lg px-2 py-1">🟢 Saucer: 35 poin</span>
                  <span className="bg-red-900/60 border border-red-400 rounded-lg px-2 py-1 font-bold text-red-300">👑 RAJA: 200 poin</span>
                </div>
                <button onClick={startGame} className="bg-cyan-500 text-black font-bold px-10 py-3 rounded-xl hover:opacity-90 transition text-lg cursor-pointer shadow-lg">
                  🚀 MULAI
                </button>
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

        {/* ── Controls ── */}
        <div className="flex items-center justify-between w-full max-w-sm mt-auto mb-2 px-3 shrink-0">

          {/* Joystick */}
          <div
            className="relative touch-none select-none"
            style={{ width: 110, height: 110 }}
            onTouchStart={onJoyStart}
            onTouchMove={onJoyMove}
            onTouchEnd={onJoyEnd}
            onTouchCancel={onJoyEnd}
          >
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 bg-cyan-500/10 backdrop-blur-sm" />
            {/* Cross guides */}
            <div className="absolute" style={{ left: "50%", top: "12%", bottom: "12%", width: 1, background: "rgba(0,255,255,0.2)", transform: "translateX(-50%)" }} />
            <div className="absolute" style={{ top: "50%", left: "12%", right: "12%", height: 1, background: "rgba(0,255,255,0.2)", transform: "translateY(-50%)" }} />
            {/* Arrow hints */}
            {["↑","↓","←","→"].map((arrow, i) => {
              const pos = [
                { top: "4%", left: "50%", transform: "translateX(-50%)" },
                { bottom: "4%", left: "50%", transform: "translateX(-50%)" },
                { top: "50%", left: "4%", transform: "translateY(-50%)" },
                { top: "50%", right: "4%", transform: "translateY(-50%)" },
              ][i];
              return <span key={i} className="absolute text-cyan-300/40 text-xs font-bold" style={pos}>{arrow}</span>;
            })}
            {/* Handle */}
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

          {/* Center hint */}
          <div className="text-center flex flex-col items-center gap-1 text-white/25">
            <span className="text-[10px]">⌨️ WASD / ↑↓←→</span>
            <span className="text-[10px]">SPASI tembak</span>
          </div>

          {/* Fire button */}
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

export default AsteroidBlasterPage;
