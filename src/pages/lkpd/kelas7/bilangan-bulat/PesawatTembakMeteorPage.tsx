import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";

const CW = 420;
const CH = 580;
const SHIP_W = 48;
const SHIP_H = 44;
const SHIP_Y = CH - 72;
const SHIP_SPEED = 320;
const BULLET_SPEED = 480;
const BULLET_R = 4;
const AST_R = 26;

interface MQ { q: string; ans: number }

const fmt = (n: number) => (n < 0 ? `(${n})` : `${n}`);
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const makeQ = (): MQ => {
  const t = Math.floor(Math.random() * 8);
  switch (t) {
    case 0: {
      const a = randInt(-20, 20), b = randInt(-20, 20);
      return { q: `${fmt(a)} + ${fmt(b)}`, ans: a + b };
    }
    case 1: {
      const a = randInt(-25, 25), b = randInt(-25, 25);
      return { q: `${fmt(a)} − ${fmt(b)}`, ans: a - b };
    }
    case 2: {
      const a = randInt(-12, 12), b = randInt(-12, 12);
      return { q: `${fmt(a)} × ${fmt(b)}`, ans: a * b };
    }
    case 3: {
      const b = randInt(2, 10) * (Math.random() < 0.5 ? -1 : 1);
      const k = randInt(-10, 10);
      const a = b * k;
      return { q: `${fmt(a)} ÷ ${fmt(b)}`, ans: k };
    }
    case 4: {
      const a = randInt(-15, 15), b = randInt(-15, 15), c = randInt(-15, 15);
      return { q: `${fmt(a)} + ${fmt(b)} − ${fmt(c)}`, ans: a + b - c };
    }
    case 5: {
      const a = randInt(-10, 10), b = randInt(-10, 10);
      return { q: `${fmt(-a)} + ${fmt(b)}`, ans: -a + b };
    }
    case 6: {
      const a = randInt(2, 9), b = randInt(2, 9);
      const sign = Math.random() < 0.5 ? -1 : 1;
      return { q: `${fmt(sign * a)} × ${fmt(-b)}`, ans: sign * a * (-b) };
    }
    default: {
      const a = randInt(-15, 15);
      return { q: `|${fmt(a)}|`, ans: Math.abs(a) };
    }
  }
};

const makeWrong = (ans: number, used: Set<number>): number => {
  let v: number, tries = 0;
  do {
    const d = (1 + Math.floor(Math.random() * 12)) * (Math.random() < 0.5 ? 1 : -1);
    v = ans + d;
    tries++;
  } while (used.has(v) && tries < 80);
  return v;
};

let _id = 0;
interface Asteroid {
  id: number; x: number; y: number; vy: number; value: number; correct: boolean;
  rot: number; rotSpd: number; color: string; hit: boolean; hitAnim: number;
  cracks: Array<[number,number,number,number]>;
}
interface Bullet { id: number; x: number; y: number; trail: Array<{x:number;y:number}> }
interface Particle { x: number; y: number; vx: number; vy: number; alpha: number; color: string; r: number }
interface BgStar { x: number; y: number; r: number; t: number; s: number }
interface ScorePop { x: number; y: number; txt: string; alpha: number; vy: number; good: boolean }

type Phase = "idle" | "playing" | "dead";

const AST_COLORS = ["#A0522D","#8B6914","#6B5B45","#7C5C3E","#9E7B4A"];

const PesawatTembakMeteorPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastRafRef = useRef(0);

  const phaseRef = useRef<Phase>("idle");
  const shipXRef = useRef(CW / 2 - SHIP_W / 2);
  const asteroidsRef = useRef<Asteroid[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const scorePopRef = useRef<ScorePop[]>([]);
  const bgStarsRef = useRef<BgStar[]>([]);
  const keysRef = useRef<Record<string, boolean>>({});
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const bestRef = useRef(0);
  const qRef = useRef<MQ>({ q: "", ans: 0 });
  const elapsedRef = useRef(0);
  const nextAstRef = useRef(2000);
  const maxAstRef = useRef(3);
  const shakeDurRef = useRef(0);
  const shootCoolRef = useRef(0);
  const thrusterRef = useRef(0);
  const autoShootRef = useRef(false);
  const touchXRef = useRef<number | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [best, setBest] = useState(0);
  const [, setCurrentQ] = useState("");
  const [feedback, setFeedback] = useState<{txt:string;good:boolean}|null>(null);
  const fbRef = useRef<ReturnType<typeof setTimeout>|null>(null);

  const showFeedback = useCallback((txt: string, good: boolean) => {
    setFeedback({ txt, good });
    if (fbRef.current) clearTimeout(fbRef.current);
    fbRef.current = setTimeout(() => setFeedback(null), 1200);
  }, []);

  const spawnParticles = useCallback((x: number, y: number, color: string, n = 14) => {
    for (let i = 0; i < n; i++) {
      const ang = (Math.PI * 2 * i) / n + Math.random() * 0.6;
      const spd = 60 + Math.random() * 160;
      particlesRef.current.push({ x, y, vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd, alpha: 1, color, r: 2+Math.random()*4 });
    }
  }, []);

  const newQuestion = useCallback(() => {
    const q = makeQ();
    qRef.current = q;
    setCurrentQ(q.q);
  }, []);

  const spawnAsteroid = useCallback(() => {
    const q = qRef.current;
    const used = new Set<number>([q.ans, ...asteroidsRef.current.map(a => a.value)]);
    const totalSlots = maxAstRef.current;
    const correctIdx = Math.floor(Math.random() * totalSlots);
    const newAsts: Asteroid[] = [];

    for (let i = 0; i < totalSlots; i++) {
      let value: number;
      let correct = false;
      if (i === correctIdx) {
        value = q.ans;
        correct = true;
      } else {
        value = makeWrong(q.ans, used);
        used.add(value);
      }
      const laneW = CW / totalSlots;
      const x = laneW * i + laneW * 0.2 + Math.random() * laneW * 0.6;
      const baseVy = 55 + elapsedRef.current * 3.5;
      const cracks: Array<[number,number,number,number]> = [];
      for (let c = 0; c < 4; c++) {
        const ang = Math.random() * Math.PI * 2;
        const len = 5 + Math.random() * 12;
        cracks.push([Math.cos(ang)*4, Math.sin(ang)*4, Math.cos(ang)*len, Math.sin(ang)*len]);
      }
      newAsts.push({
        id: _id++, x, y: -AST_R - Math.random() * 60,
        vy: baseVy + Math.random() * 20,
        value, correct,
        rot: Math.random() * Math.PI * 2,
        rotSpd: (Math.random() - 0.5) * 1.5,
        color: AST_COLORS[Math.floor(Math.random() * AST_COLORS.length)],
        hit: false, hitAnim: 0, cracks,
      });
    }
    asteroidsRef.current = [...asteroidsRef.current, ...newAsts];
    nextAstRef.current = Math.max(900, 2500 - elapsedRef.current * 25);
  }, []);

  const resetGame = useCallback(() => {
    shipXRef.current = CW / 2 - SHIP_W / 2;
    asteroidsRef.current = [];
    bulletsRef.current = [];
    particlesRef.current = [];
    scorePopRef.current = [];
    scoreRef.current = 0;
    livesRef.current = 3;
    elapsedRef.current = 0;
    nextAstRef.current = 300;
    maxAstRef.current = 3;
    shakeDurRef.current = 0;
    shootCoolRef.current = 0;
    thrusterRef.current = 0;
    keysRef.current = {};
    touchXRef.current = null;
    setScore(0);
    setLives(3);
    setFeedback(null);
    bgStarsRef.current = Array.from({ length: 100 }, () => ({
      x: Math.random()*CW, y: Math.random()*CH,
      r: 0.4+Math.random()*1.6, t: Math.random()*Math.PI*2, s: 0.6+Math.random()*1.8,
    }));
    newQuestion();
  }, [newQuestion]);

  const fireBullet = useCallback(() => {
    if (shootCoolRef.current > 0) return;
    const sx = shipXRef.current + SHIP_W / 2;
    bulletsRef.current.push({ id: _id++, x: sx, y: SHIP_Y - 10, trail: [] });
    shootCoolRef.current = 0.22;
  }, []);

  const drawShip = useCallback((ctx: CanvasRenderingContext2D, x: number, _ts: number, shakeX: number) => {
    const cx = x + SHIP_W / 2 + shakeX;
    const top = SHIP_Y;

    thrusterRef.current += 0.15;
    const thrPulse = 0.6 + 0.4 * Math.sin(thrusterRef.current * 6);
    const grad = ctx.createRadialGradient(cx, top + SHIP_H + 5, 0, cx, top + SHIP_H + 5, 22 * thrPulse);
    grad.addColorStop(0, "rgba(255,160,0,0.9)");
    grad.addColorStop(0.4, "rgba(255,60,0,0.5)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, top + SHIP_H + 5, 22 * thrPulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = "#00FFFF";
    ctx.shadowBlur = 16;
    const bodyGrad = ctx.createLinearGradient(cx - SHIP_W/2, top, cx + SHIP_W/2, top + SHIP_H);
    bodyGrad.addColorStop(0, "#2a9dc7");
    bodyGrad.addColorStop(1, "#1a5f7a");
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(cx, top);
    ctx.lineTo(cx + 18, top + 30);
    ctx.lineTo(cx + 24, top + SHIP_H);
    ctx.lineTo(cx - 24, top + SHIP_H);
    ctx.lineTo(cx - 18, top + 30);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    const wingGrad = ctx.createLinearGradient(cx, top, cx, top + SHIP_H);
    wingGrad.addColorStop(0, "#1a6b8a");
    wingGrad.addColorStop(1, "#0d3d52");
    ctx.fillStyle = wingGrad;
    ctx.shadowColor = "#00EEFF";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(cx - 18, top + 30);
    ctx.lineTo(cx - SHIP_W/2 - 10, top + SHIP_H);
    ctx.lineTo(cx - 24, top + SHIP_H);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 18, top + 30);
    ctx.lineTo(cx + SHIP_W/2 + 10, top + SHIP_H);
    ctx.lineTo(cx + 24, top + SHIP_H);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    const cockpitGrad = ctx.createRadialGradient(cx, top + 14, 2, cx, top + 14, 10);
    cockpitGrad.addColorStop(0, "#aaffff");
    cockpitGrad.addColorStop(1, "#004466");
    ctx.fillStyle = cockpitGrad;
    ctx.beginPath();
    ctx.ellipse(cx, top + 16, 8, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#00FFFF";
    ctx.shadowColor = "#00FFFF";
    ctx.shadowBlur = 6;
    ctx.fillRect(cx - 3, top - 10, 6, 14);
    ctx.shadowBlur = 0;

    ctx.strokeStyle = "rgba(0,255,255,0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 10, top + 22);
    ctx.lineTo(cx + 10, top + 22);
    ctx.stroke();
  }, []);

  const drawAsteroid = useCallback((ctx: CanvasRenderingContext2D, a: Asteroid, ts: number) => {
    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.rotate(a.rot);
    const scale = a.hit ? 1 + a.hitAnim * 0.5 : 1;
    ctx.scale(scale, scale);
    const alpha = a.hit ? Math.max(0, 1 - a.hitAnim * 2) : 1;
    ctx.globalAlpha = alpha;

    const pts = 10;
    const irregularity = 0.28;
    ctx.beginPath();
    for (let i = 0; i < pts; i++) {
      const ang = (Math.PI * 2 / pts) * i;
      const r = AST_R * (1 - irregularity/2 + irregularity * Math.sin(i * 2.4 + a.id));
      i === 0 ? ctx.moveTo(Math.cos(ang)*r, Math.sin(ang)*r) : ctx.lineTo(Math.cos(ang)*r, Math.sin(ang)*r);
    }
    ctx.closePath();

    const grad = ctx.createRadialGradient(-4, -4, 2, 0, 0, AST_R);
    grad.addColorStop(0, lighten(a.color, 30));
    grad.addColorStop(1, a.correct ? "#5a3e00" : "#2a1a0a");
    ctx.fillStyle = grad;
    ctx.shadowColor = a.correct ? "#FFD700" : (a.hit ? "#FF4444" : "rgba(0,0,0,0)");
    ctx.shadowBlur = a.correct ? 16 + 8*Math.sin(ts/400) : (a.hit ? 20 : 0);
    ctx.fill();

    ctx.strokeStyle = a.correct ? "#FFD700" : "#3a2a15";
    ctx.lineWidth = a.correct ? 2.5 : 1.5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 1;
    a.cracks.forEach(([sx,sy,ex,ey]) => {
      ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(ex,ey); ctx.stroke();
    });

    const valStr = String(a.value);
    const fs = valStr.length > 3 ? 11 : valStr.length > 2 ? 13 : 16;
    ctx.fillStyle = a.correct ? "#FFD700" : "#fff";
    ctx.shadowColor = a.correct ? "#FFD700" : "transparent";
    ctx.shadowBlur = a.correct ? 6 : 0;
    ctx.font = `bold ${fs}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(valStr, 0, 0);
    ctx.shadowBlur = 0;

    ctx.globalAlpha = 1;
    ctx.restore();
  }, []);

  function lighten(hex: string, amt: number): string {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, (num >> 16) + amt);
    const g = Math.min(255, ((num >> 8) & 0xff) + amt);
    const b = Math.min(255, (num & 0xff) + amt);
    return `rgb(${r},${g},${b})`;
  }

  const loop = useCallback((ts: number) => {
    const dt = Math.min((ts - (lastRafRef.current || ts)) / 1000, 0.05);
    lastRafRef.current = ts;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const ph = phaseRef.current;

    const bgGrad = ctx.createLinearGradient(0, 0, 0, CH);
    bgGrad.addColorStop(0, "#030310");
    bgGrad.addColorStop(1, "#070720");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CW, CH);

    bgStarsRef.current.forEach(s => {
      s.t += dt * s.s;
      ctx.globalAlpha = 0.2 + 0.8 * Math.abs(Math.sin(s.t));
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    const neb = ctx.createRadialGradient(CW*0.7, CH*0.3, 0, CW*0.7, CH*0.3, 160);
    neb.addColorStop(0, "rgba(60,0,80,0.08)");
    neb.addColorStop(1, "transparent");
    ctx.fillStyle = neb;
    ctx.fillRect(0, 0, CW, CH);

    if (ph === "playing") {
      elapsedRef.current += dt;

      if (elapsedRef.current > 30) maxAstRef.current = 4;
      if (elapsedRef.current > 60) maxAstRef.current = 5;

      nextAstRef.current -= dt * 1000;
      if (nextAstRef.current <= 0 && asteroidsRef.current.length < maxAstRef.current * 2) {
        spawnAsteroid();
      }

      const shaking = shakeDurRef.current > 0;
      if (!shaking) {
        if (keysRef.current["ArrowLeft"] || keysRef.current["a"] || keysRef.current["A"]) {
          shipXRef.current = Math.max(0, shipXRef.current - SHIP_SPEED * dt);
        }
        if (keysRef.current["ArrowRight"] || keysRef.current["d"] || keysRef.current["D"]) {
          shipXRef.current = Math.min(CW - SHIP_W, shipXRef.current + SHIP_SPEED * dt);
        }
        if (touchXRef.current !== null) {
          const target = touchXRef.current - SHIP_W / 2;
          shipXRef.current += (target - shipXRef.current) * Math.min(1, 12 * dt);
          shipXRef.current = Math.max(0, Math.min(CW - SHIP_W, shipXRef.current));
        }
      }

      if (shootCoolRef.current > 0) shootCoolRef.current -= dt;

      if ((keysRef.current[" "] || autoShootRef.current) && shootCoolRef.current <= 0) {
        fireBullet();
      }

      if (shakeDurRef.current > 0) shakeDurRef.current -= dt;

      bulletsRef.current = bulletsRef.current.filter(b => b.y > -10);
      bulletsRef.current.forEach(b => {
        b.trail.push({ x: b.x, y: b.y });
        if (b.trail.length > 8) b.trail.shift();
        b.y -= BULLET_SPEED * dt;

        asteroidsRef.current.forEach(a => {
          if (a.hit) return;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          if (Math.sqrt(dx*dx+dy*dy) < AST_R) {
            b.y = -999;
            a.hit = true;
            a.hitAnim = 0;

            if (a.correct) {
              const pts = 20 + Math.floor(elapsedRef.current);
              scoreRef.current += pts;
              setScore(scoreRef.current);
              spawnParticles(a.x, a.y, "#FFD700", 18);
              scorePopRef.current.push({ x: a.x, y: a.y, txt: `+${pts}`, alpha: 1, vy: -80, good: true });
              showFeedback("🎯 TEPAT! Meteor hancur!", true);
              newQuestion();
              asteroidsRef.current.forEach(other => { if (!other.hit && !other.correct) other.hit = true; });
            } else {
              scoreRef.current = Math.max(0, scoreRef.current - 5);
              setScore(scoreRef.current);
              spawnParticles(a.x, a.y, "#FF6644", 10);
              scorePopRef.current.push({ x: a.x, y: a.y, txt: "−5 SALAH!", alpha: 1, vy: -70, good: false });
              showFeedback(`❌ Salah! Jawaban: ${qRef.current.ans}`, false);
            }
          }
        });
      });

      asteroidsRef.current.forEach(a => {
        if (!a.hit) {
          a.y += a.vy * dt;
          a.rot += a.rotSpd * dt;
          if (a.y - AST_R > CH) {
            a.hit = true;
            if (a.correct) {
              livesRef.current = Math.max(0, livesRef.current - 1);
              setLives(livesRef.current);
              shakeDurRef.current = 0.45;
              showFeedback("💥 Meteor lolos! Nyawa berkurang!", false);
              if (livesRef.current <= 0) {
                phaseRef.current = "dead";
                setPhase("dead");
                if (scoreRef.current > bestRef.current) { bestRef.current = scoreRef.current; setBest(bestRef.current); }
              } else {
                newQuestion();
              }
            }
          }
        } else {
          a.hitAnim += dt * 3.5;
        }
      });
      asteroidsRef.current = asteroidsRef.current.filter(a => !a.hit || a.hitAnim < 1);

      scorePopRef.current = scorePopRef.current.filter(p => p.alpha > 0);
      scorePopRef.current.forEach(p => { p.y += p.vy * dt; p.alpha -= dt * 2.2; });

      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);
      particlesRef.current.forEach(p => { p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=120*dt; p.alpha-=dt*2; });
    }

    ctx.strokeStyle = "rgba(0,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.setLineDash([8,10]);
    ctx.beginPath();
    ctx.moveTo(0, SHIP_Y - 16);
    ctx.lineTo(CW, SHIP_Y - 16);
    ctx.stroke();
    ctx.setLineDash([]);

    bulletsRef.current.forEach(b => {
      b.trail.forEach((pt, i) => {
        const a = (i+1) / b.trail.length;
        ctx.globalAlpha = a * 0.5;
        ctx.fillStyle = "#00FFFF";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, BULLET_R * a, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.shadowColor = "#00FFFF";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#00FFFF";
      ctx.beginPath();
      ctx.arc(b.x, b.y, BULLET_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    asteroidsRef.current.forEach(a => drawAsteroid(ctx, a, ts));

    particlesRef.current.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 4;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    scorePopRef.current.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.good ? "#FFD700" : "#FF6644";
      ctx.shadowColor = p.good ? "#FFD700" : "#FF4444";
      ctx.shadowBlur = 6;
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText(p.txt, p.x, p.y);
      ctx.shadowBlur = 0;
    });
    ctx.globalAlpha = 1;
    ctx.textAlign = "left";

    if (ph !== "dead") {
      const shakeX = shakeDurRef.current > 0 ? (Math.random()-0.5) * shakeDurRef.current * 10 : 0;
      drawShip(ctx, shipXRef.current, ts, shakeX);
    }

    const qBannerH = 44;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath();
    ctx.roundRect(8, 8, CW - 16, qBannerH, 10);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,215,0,0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#FFD700";
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 10;
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${qRef.current.q} = ?`, CW/2, 8 + qBannerH/2);
    ctx.shadowBlur = 0;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "#00FFAA";
    ctx.font = "bold 15px monospace";
    ctx.fillText(`SKOR: ${scoreRef.current}`, 10, CH - 34);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "11px monospace";
    ctx.fillText(`REKOR: ${bestRef.current}`, 10, CH - 18);

    for (let i = 0; i < 3; i++) {
      ctx.globalAlpha = i < livesRef.current ? 1 : 0.2;
      ctx.font = "20px sans-serif";
      ctx.fillText("💙", CW - 80 + i * 26, CH - 18);
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "11px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.floor(elapsedRef.current)}s`, CW/2, CH - 10);
    ctx.textAlign = "left";

    rafRef.current = requestAnimationFrame(loop);
  }, [drawShip, drawAsteroid, spawnAsteroid, fireBullet, spawnParticles, showFeedback, newQuestion]);

  const startGame = useCallback(() => {
    playPopSound();
    resetGame();
    phaseRef.current = "playing";
    setPhase("playing");
    lastRafRef.current = 0;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [resetGame, loop]);

  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      if (["ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault();
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

  useEffect(() => () => { if (fbRef.current) clearTimeout(fbRef.current); }, []);

  const onTouchMove = (e: React.TouchEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    touchXRef.current = (e.touches[0].clientX - rect.left) * (CW / rect.width);
  };
  const onTouchEnd = () => { touchXRef.current = null; };
  const onTouchStart = (e: React.TouchEvent) => { onTouchMove(e); };

  return (
    <div className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}
      <div className="relative z-10 w-full max-w-lg px-2 py-4 flex flex-col items-center">
        <div className="flex items-center justify-between w-full mb-2">
          <button
            onClick={() => { playPopSound(); navigate('/lkpd/kelas-7/bilangan-bulat'); }}
            className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all text-sm"
            title="Menu LKPD"
          >
            🏠
          </button>
          <h1 className="font-display text-lg sm:text-xl font-bold text-primary text-glow-cyan text-center flex-1">
            🚀 PESAWAT TEMBAK METEOR
          </h1>
          <button
            onClick={() => { playPopSound(); navigate(-1); }}
            className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all font-bold"
            title="Keluar"
          >
            ✕
          </button>
        </div>
        <div className="flex gap-4 mb-2 text-xs font-display">
          <span className="text-cyan-400">SKOR: <span className="font-bold text-sm">{score}</span></span>
          <span className="text-white/50">REKOR: <span className="text-yellow-400 font-bold">{best}</span></span>
          <span className="text-pink-300">NYAWA: <span className="font-bold text-sm">{lives}</span></span>
        </div>

        <div
          className="relative w-full select-none"
          style={{ maxWidth: CW, maxHeight: 'calc(100dvh - 200px)', aspectRatio: `${CW}/${CH}` }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            className="rounded-2xl border border-border shadow-2xl w-full h-full"
          />

          {feedback && (
            <div className={`absolute top-16 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl font-bold text-sm shadow-xl pointer-events-none z-30 whitespace-nowrap ${
              feedback.good ? "bg-green-500/90 text-white" : "bg-red-600/90 text-white"
            }`}>
              {feedback.txt}
            </div>
          )}

          {phase === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/70">
              <div className="text-center px-5 max-w-xs">
                <div className="text-5xl mb-2">☄️</div>
                <h2 className="font-display text-xl font-bold text-cyan-400 mb-2">PESAWAT TEMBAK METEOR</h2>
                <p className="text-white/65 text-xs mb-3 leading-relaxed">
                  Hitung operasi <span className="text-yellow-400 font-bold">bilangan bulat</span> di atas layar!<br />
                  Tembak meteor yang membawa <span className="text-yellow-400 font-bold">jawaban benar</span>!<br />
                  Salah tembak: <span className="text-red-400">−5 poin</span> · Jawaban lolos: <span className="text-red-400">nyawa berkurang</span>
                </p>
                <div className="flex justify-center gap-2 mb-3 text-[10px] flex-wrap">
                  <span className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg px-2 py-1">✨ Meteor emas = jawaban benar</span>
                  <span className="bg-slate-500/20 border border-slate-400/30 rounded-lg px-2 py-1">🪨 Abu-abu = salah</span>
                </div>
                <p className="text-white/40 text-[10px] mb-4">
                  Keyboard: ← → gerak · SPASI tembak<br />
                  HP: sentuh & geser + tombol TEMBAK
                </p>
                <button onClick={startGame} className="bg-cyan-500 text-black font-bold px-10 py-3 rounded-xl hover:opacity-90 transition text-lg cursor-pointer shadow-lg">
                  🚀 MULAI
                </button>
              </div>
            </div>
          )}

          {phase === "dead" && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/72">
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

        <div className="flex gap-3 mt-3 items-center">
          <button
            onPointerDown={() => { keysRef.current["ArrowLeft"] = true; }}
            onPointerUp={() => { keysRef.current["ArrowLeft"] = false; }}
            onPointerLeave={() => { keysRef.current["ArrowLeft"] = false; }}
            className="bg-card/80 border border-border text-white font-bold px-7 py-4 rounded-xl hover:border-cyan-400 transition cursor-pointer active:scale-95 select-none text-xl"
          >◀</button>
          <button
            onPointerDown={() => { autoShootRef.current = true; }}
            onPointerUp={() => { autoShootRef.current = false; }}
            onPointerLeave={() => { autoShootRef.current = false; }}
            className="bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400 font-bold px-6 py-4 rounded-xl hover:bg-cyan-500/40 transition cursor-pointer active:scale-95 select-none text-sm"
          >🔫 TEMBAK</button>
          <button
            onPointerDown={() => { keysRef.current["ArrowRight"] = true; }}
            onPointerUp={() => { keysRef.current["ArrowRight"] = false; }}
            onPointerLeave={() => { keysRef.current["ArrowRight"] = false; }}
            className="bg-card/80 border border-border text-white font-bold px-7 py-4 rounded-xl hover:border-cyan-400 transition cursor-pointer active:scale-95 select-none text-xl"
          >▶</button>
        </div>
        <p className="mt-2 text-white/35 text-xs font-body text-center">
          Keyboard: ← → gerak · SPASI tembak &nbsp;·&nbsp; HP: sentuh & geser layar
        </p>
      </div>
    </div>
  );
};

export default PesawatTembakMeteorPage;
