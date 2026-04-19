import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

const CW = 420;
const CH = 560;
const GROUND_Y = 412;
const PLAYER_X = 72;
const BATTLE_ENEMY_X = 318;
const PLAYER_MAX_HP = 8;

type Phase = "idle" | "exploring" | "battling" | "enemy_dying" | "victory_floor" | "over" | "won";
type EnemyKind = "slime" | "goblin" | "skeleton" | "dragon";

interface EnemyStats { maxHp: number; speed: number; pts: number; w: number; h: number; label: string; }
const ENEMY_STATS: Record<EnemyKind, EnemyStats> = {
  slime:    { maxHp: 1, speed: 44, pts: 20,  w: 40, h: 32, label: "Slime" },
  goblin:   { maxHp: 2, speed: 58, pts: 35,  w: 34, h: 46, label: "Goblin" },
  skeleton: { maxHp: 3, speed: 66, pts: 55,  w: 32, h: 50, label: "Kerangka" },
  dragon:   { maxHp: 8, speed: 28, pts: 200, w: 64, h: 58, label: "🐉 NAGA BOSS" },
};

const WAVES: EnemyKind[][] = [
  ["slime", "slime", "goblin", "slime", "goblin", "dragon"],
  ["goblin", "skeleton", "goblin", "skeleton", "skeleton", "dragon"],
  ["skeleton", "skeleton", "skeleton", "goblin", "skeleton", "dragon"],
];
const FLOOR_NAMES = ["Hutan Mistik", "Gua Kegelapan", "Kastil Setan"];
const FLOOR_DESC  = ["Lantai 2: Gua Kegelapan — musuh makin kuat!", "Lantai 3: Kastil Setan — pertarungan terakhir! 🐉"];

interface Question { q: string; ans: number; }
interface FloatText { x: number; y: number; text: string; color: string; alpha: number; vy: number; }
interface Particle { x: number; y: number; vx: number; vy: number; alpha: number; r: number; color: string; }

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const makeQuestion = (floor: number): Question => {
  const t = Math.floor(Math.random() * 9);
  if (t === 0) { const a = 8 + Math.floor(Math.random() * (28 + floor * 14)); const b = 5 + Math.floor(Math.random() * (22 + floor * 10)); return { q: `${a} + ${b}`, ans: a + b }; }
  if (t === 1) { const b = 5 + Math.floor(Math.random() * (28 + floor * 10)); const a = b + 8 + Math.floor(Math.random() * (38 + floor * 14)); return { q: `${a} − ${b}`, ans: a - b }; }
  if (t === 2) { const a = 2 + Math.floor(Math.random() * (8 + floor * 3)); const b = 2 + Math.floor(Math.random() * (8 + floor * 3)); return { q: `${a} × ${b}`, ans: a * b }; }
  if (t === 3) { const b = 2 + Math.floor(Math.random() * (9 + floor * 2)); const ans = 2 + Math.floor(Math.random() * (12 + floor * 3)); return { q: `${b * ans} ÷ ${b}`, ans }; }
  if (t === 4) { const a = 2 + Math.floor(Math.random() * (10 + floor * 2)); return { q: `${a}²`, ans: a * a }; }
  if (t === 5) { const roots = [16, 25, 36, 49, 64, 81, 100, 121]; const n = roots[Math.floor(Math.random() * roots.length)]; return { q: `√${n}`, ans: Math.round(Math.sqrt(n)) }; }
  if (t === 6) { const a = 2 + Math.floor(Math.random() * 12); const b = 2 + Math.floor(Math.random() * 12); return { q: `FPB(${a},${b})`, ans: gcd(a, b) }; }
  if (t === 7) { const a = 2 + Math.floor(Math.random() * 10); const b = 2 + Math.floor(Math.random() * 10); return { q: `KPK(${a},${b})`, ans: (a * b) / gcd(a, b) }; }
  const a = 10 + Math.floor(Math.random() * 30); const b = 2 + Math.floor(Math.random() * 8); return { q: `${a} + ${b}×3`, ans: a + b * 3 };
};

const wrongVal = (ans: number, used: Set<number>) => {
  let v = ans; let guard = 0;
  while ((v === ans || used.has(v) || v < 0) && guard < 80) {
    const d = 1 + Math.floor(Math.random() * 20);
    v = ans + (Math.random() < 0.5 ? d : -d);
    guard++;
  }
  if (v < 0 || used.has(v) || v === ans) v = ans + used.size + 5;
  used.add(v); return v;
};

const makeOptions = (ans: number): number[] => {
  const used = new Set<number>([ans]);
  const opts = [ans, wrongVal(ans, used), wrongVal(ans, used), wrongVal(ans, used)];
  for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
  return opts;
};

const BTN_W = 182, BTN_H = 38, BTN_GAP = 8;
const BTNS = [
  { x: 14,              y: 474 },
  { x: 14 + BTN_W + BTN_GAP, y: 474 },
  { x: 14,              y: 474 + BTN_H + BTN_GAP },
  { x: 14 + BTN_W + BTN_GAP, y: 474 + BTN_H + BTN_GAP },
];
const BTN_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444"];
const BTN_GLOW   = ["#818cf8", "#fcd34d", "#6ee7b7", "#fca5a5"];

const KsatriaMatPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastRef = useRef(0);

  const phaseRef     = useRef<Phase>("idle");
  const floorRef     = useRef(0);
  const waveIdxRef   = useRef(0);
  const playerHpRef  = useRef(PLAYER_MAX_HP);
  const attackTRef   = useRef(0);
  const hurtTRef     = useRef(0);
  const scoreRef     = useRef(0);
  const bestRef      = useRef(0);
  const comboRef     = useRef(0);
  const bgScrollRef  = useRef(0);
  const shakeRef     = useRef(0);
  const hueRef       = useRef(0);
  const transRef     = useRef({ text: "", sub: "", timer: 0 });

  const enemyRef = useRef({
    kind: "slime" as EnemyKind,
    x: CW + 50,
    hp: 1, maxHp: 1,
    hurtTimer: 0, deathTimer: 0, animT: 0, pts: 20,
  });

  const qRef         = useRef<Question>({ q: "", ans: 0 });
  const optsRef      = useRef<number[]>([0, 0, 0, 0]);
  const feedbackRef  = useRef<{ correct: boolean; idx: number; timer: number } | null>(null);

  const particlesRef = useRef<Particle[]>([]);
  const floatsRef    = useRef<FloatText[]>([]);

  const [, forceRender] = useState(0);
  const rerender = useCallback(() => forceRender(n => n + 1), []);

  const addFloat = (x: number, y: number, text: string, color: string) =>
    floatsRef.current.push({ x, y, text, color, alpha: 1, vy: -78 });

  const burst = (x: number, y: number, color: string, count = 28) => {
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const s = 60 + Math.random() * 240;
      particlesRef.current.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, alpha: 1, r: 3 + Math.random() * 5, color });
    }
  };

  const spawnQuestion = useCallback(() => {
    const q = makeQuestion(floorRef.current);
    qRef.current = q;
    optsRef.current = makeOptions(q.ans);
    feedbackRef.current = null;
  }, []);

  const loadEnemy = useCallback(() => {
    const floor = floorRef.current;
    const wIdx  = waveIdxRef.current;
    if (floor >= WAVES.length) { phaseRef.current = "won"; rerender(); return; }
    if (wIdx >= WAVES[floor].length) {
      const isLast = floor >= WAVES.length - 1;
      transRef.current = {
        text: isLast ? "MENANG! 🏆" : `Lantai ${floor + 1} Selesai! ⭐`,
        sub:  isLast ? "Semua musuh dikalahkan!" : FLOOR_DESC[floor],
        timer: 2.6,
      };
      phaseRef.current = "victory_floor";
      rerender();
      return;
    }
    const kind  = WAVES[floor][wIdx];
    const stats = ENEMY_STATS[kind];
    enemyRef.current = { kind, x: CW + stats.w, hp: stats.maxHp, maxHp: stats.maxHp, hurtTimer: 0, deathTimer: 0, animT: 0, pts: stats.pts };
    phaseRef.current = "exploring";
    rerender();
  }, [rerender]);

  const startBattle = useCallback(() => {
    spawnQuestion();
    phaseRef.current = "battling";
    rerender();
  }, [rerender, spawnQuestion]);

  const startGame = useCallback(() => {
    phaseRef.current = "exploring";
    floorRef.current = 0; waveIdxRef.current = 0;
    playerHpRef.current = PLAYER_MAX_HP;
    attackTRef.current = 0; hurtTRef.current = 0;
    scoreRef.current = 0; comboRef.current = 0;
    bgScrollRef.current = 0; shakeRef.current = 0;
    particlesRef.current = []; floatsRef.current = [];
    feedbackRef.current = null;
    transRef.current = { text: "", sub: "", timer: 0 };
    const kind  = WAVES[0][0];
    const stats = ENEMY_STATS[kind];
    enemyRef.current = { kind, x: CW + stats.w, hp: stats.maxHp, maxHp: stats.maxHp, hurtTimer: 0, deathTimer: 0, animT: 0, pts: stats.pts };
    rerender();
    playPopSound();
  }, [rerender]);

  const handleAnswer = useCallback((idx: number) => {
    if (phaseRef.current !== "battling") return;
    if (feedbackRef.current && feedbackRef.current.timer > 0.35) return;
    const chosen  = optsRef.current[idx];
    const correct = chosen === qRef.current.ans;
    feedbackRef.current = { correct, idx, timer: 0.65 };
    const enemy = enemyRef.current;

    if (correct) {
      attackTRef.current = 0.55;
      enemy.hp--;
      enemy.hurtTimer = 0.38;
      comboRef.current++;
      const pts = enemy.pts + comboRef.current * 5;
      scoreRef.current += pts;
      bestRef.current = Math.max(bestRef.current, scoreRef.current);
      addFloat(enemy.x, GROUND_Y - enemy.maxHp * 12 - 60, `+${pts} ⚔️`, "#86efac");
      burst(enemy.x, GROUND_Y - 30, "#fde68a", 18);
      playPopSound();
      if (enemy.hp <= 0) {
        enemy.deathTimer = 1.0;
        burst(enemy.x, GROUND_Y - 35, "#f97316", 55);
        addFloat(enemy.x, GROUND_Y - 85, enemy.kind === "dragon" ? "NAGA KALAH! 🎉🎉🎉" : "Kalah! 💀", "#fbbf24");
        phaseRef.current = "enemy_dying";
      } else {
        spawnQuestion();
      }
    } else {
      comboRef.current = 0;
      playerHpRef.current = Math.max(0, playerHpRef.current - 1);
      hurtTRef.current = 0.5;
      shakeRef.current = 0.5;
      addFloat(PLAYER_X, GROUND_Y - 80, "Salah! 💔 -1 HP", "#fca5a5");
      burst(PLAYER_X, GROUND_Y - 32, "#ef4444", 18);
      if (playerHpRef.current <= 0) { phaseRef.current = "over"; rerender(); return; }
      spawnQuestion();
    }
    rerender();
  }, [rerender, spawnQuestion]);

  const handleCanvasClick = useCallback((cx: number, cy: number) => {
    const phase = phaseRef.current;
    if (phase === "idle" || phase === "over" || phase === "won") { startGame(); return; }
    if (phase === "battling") {
      for (let i = 0; i < BTNS.length; i++) {
        const b = BTNS[i];
        if (cx >= b.x && cx <= b.x + BTN_W && cy >= b.y && cy <= b.y + BTN_H) { handleAnswer(i); return; }
      }
    }
  }, [startGame, handleAnswer]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const phase = phaseRef.current;
      if (e.key === " " || e.key === "Enter") { if (phase === "idle" || phase === "over" || phase === "won") { startGame(); return; } }
      if (phase === "battling") {
        if (e.key === "1") handleAnswer(0);
        else if (e.key === "2") handleAnswer(1);
        else if (e.key === "3") handleAnswer(2);
        else if (e.key === "4") handleAnswer(3);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [startGame, handleAnswer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dt_ = (text: string, x: number, y: number, size: number, color = "#fff", align: CanvasTextAlign = "center") => {
      ctx.fillStyle = color; ctx.font = `900 ${size}px Orbitron, Inter, sans-serif`;
      ctx.textAlign = align; ctx.textBaseline = "middle";
      ctx.shadowBlur = 10; ctx.shadowColor = color; ctx.fillText(text, x, y); ctx.shadowBlur = 0;
    };

    const drawBG = (floor: number, scroll: number, ts: number) => {
      const GY = GROUND_Y;
      if (floor === 0) {
        const sk = ctx.createLinearGradient(0, 90, 0, GY); sk.addColorStop(0, "#0ea5e9"); sk.addColorStop(1, "#7dd3fc");
        ctx.fillStyle = sk; ctx.fillRect(0, 90, CW, GY - 90);
        ctx.fillStyle = "#fef08a"; ctx.shadowBlur = 28; ctx.shadowColor = "#fde047";
        ctx.beginPath(); ctx.arc(360, 128, 30, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
        for (let i = 0; i < 3; i++) { const cx2 = ((i * 145 + scroll * 0.14) % (CW + 110)) - 55; ctx.fillStyle = "rgba(255,255,255,0.82)"; ctx.beginPath(); ctx.ellipse(cx2, 148 + i * 26, 38, 18, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx2 + 24, 146 + i * 26, 28, 14, 0, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = "#16a34a";
        for (let i = 0; i < 4; i++) { const mx = ((i * 118 + scroll * 0.28) % (CW + 160)) - 80; ctx.beginPath(); ctx.moveTo(mx - 58, GY); ctx.lineTo(mx, GY - 98); ctx.lineTo(mx + 58, GY); ctx.fill(); }
        for (let i = 0; i < 6; i++) { const tx = ((i * 68 + scroll * 0.68) % (CW + 100)) - 50; const th = 58 + (i % 3) * 22; ctx.fillStyle = "#15803d"; ctx.beginPath(); ctx.moveTo(tx - 22, GY); ctx.lineTo(tx, GY - th); ctx.lineTo(tx + 22, GY); ctx.fill(); ctx.fillStyle = "#166534"; ctx.beginPath(); ctx.moveTo(tx - 18, GY - th * 0.38); ctx.lineTo(tx, GY - th - 16); ctx.lineTo(tx + 18, GY - th * 0.38); ctx.fill(); ctx.fillStyle = "#166534"; ctx.fillRect(tx - 4, GY - 18, 8, 18); }
        ctx.fillStyle = "#16a34a"; ctx.fillRect(0, GY, CW, CH - GY);
        ctx.fillStyle = "#15803d"; ctx.fillRect(0, GY, CW, 7);
      } else if (floor === 1) {
        const sk = ctx.createLinearGradient(0, 90, 0, GY); sk.addColorStop(0, "#0c0a1a"); sk.addColorStop(1, "#1e1b4b");
        ctx.fillStyle = sk; ctx.fillRect(0, 90, CW, GY - 90);
        ctx.fillStyle = "#312e81";
        for (let i = 0; i < 9; i++) { const sx2 = ((i * 54 + scroll * 0.5) % (CW + 80)) - 40; const sh = 28 + (i % 3) * 22; ctx.beginPath(); ctx.moveTo(sx2 - 11, 90); ctx.lineTo(sx2, 90 + sh); ctx.lineTo(sx2 + 11, 90); ctx.fill(); }
        for (let i = 0; i < 5; i++) { const kx = ((i * 88 + scroll * 0.4) % (CW + 60)) - 30; const ky = GY - 18 - (i % 3) * 16; const kh = `hsl(${260 + i * 22}, 100%, 65%, ${0.4 + Math.sin(ts * 0.003 + i) * 0.14})`; ctx.fillStyle = kh; ctx.shadowBlur = 18; ctx.shadowColor = "#818cf8"; ctx.beginPath(); ctx.moveTo(kx, ky - 20); ctx.lineTo(kx - 8, ky); ctx.lineTo(kx + 8, ky); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0; }
        ctx.fillStyle = "#1e1b4b"; ctx.fillRect(0, GY, CW, CH - GY);
        ctx.fillStyle = "#312e81"; ctx.fillRect(0, GY, CW, 7);
      } else {
        const sk = ctx.createLinearGradient(0, 90, 0, GY); sk.addColorStop(0, "#180428"); sk.addColorStop(1, "#3b0764");
        ctx.fillStyle = sk; ctx.fillRect(0, 90, CW, GY - 90);
        for (let i = 0; i < 28; i++) { const sx2 = (i * 65 + scroll * 0.08) % CW; const sy2 = 95 + (i * 41) % (GY - 148); ctx.fillStyle = `rgba(255,255,255,${0.25 + (i % 4) * 0.14})`; ctx.beginPath(); ctx.arc(sx2, sy2, 1 + (i % 3) * 0.6, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = "#4c1d95";
        for (let i = 0; i < 7; i++) { const bx = ((i * 60 + scroll * 0.2) % (CW + 80)) - 40; ctx.fillRect(bx, GY - 82, 44, 82); ctx.fillRect(bx + 4, GY - 100, 10, 20); ctx.fillRect(bx + 28, GY - 100, 10, 20); }
        for (let i = 0; i < 4; i++) { const tx2 = ((i * 100 + scroll * 0.55) % (CW + 50)) - 25; ctx.fillStyle = "#78350f"; ctx.fillRect(tx2 - 2, GY - 52, 4, 22); ctx.fillStyle = `hsl(${28 + Math.sin(ts * 0.01 + i) * 12}, 100%, ${58 + Math.sin(ts * 0.015 + i) * 10}%)`; ctx.shadowBlur = 18; ctx.shadowColor = "#f97316"; ctx.beginPath(); ctx.arc(tx2, GY - 54, 5 + Math.random() * 2, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; }
        ctx.fillStyle = "#3b0764"; ctx.fillRect(0, GY, CW, CH - GY);
        ctx.fillStyle = "#4c1d95"; ctx.fillRect(0, GY, CW, 7);
      }
    };

    const drawPlayer = (ts: number, atkT: number, hrtT: number) => {
      const wobble = Math.sin(ts * 0.008) * 2.5;
      const hShake = hrtT > 0 ? (Math.random() - 0.5) * 8 : 0;
      const px = PLAYER_X + hShake;
      const py = GROUND_Y;
      ctx.save();
      ctx.globalAlpha = hrtT > 0 ? (Math.floor(ts / 55) % 2 === 0 ? 0.45 : 1) : 1;
      // Cape
      ctx.fillStyle = "#1d4ed8"; ctx.shadowBlur = 8; ctx.shadowColor = "#3b82f6";
      ctx.beginPath(); ctx.moveTo(px - 4, py - 42); ctx.lineTo(px - 20, py - 26); ctx.lineTo(px - 10, py); ctx.closePath(); ctx.fill();
      // Body armor
      ctx.fillStyle = "#94a3b8"; ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.roundRect(px - 12, py - 40, 24, 30, 3); ctx.fill();
      ctx.fillStyle = "#64748b"; ctx.fillRect(px - 10, py - 36, 20, 5); ctx.fillRect(px - 10, py - 27, 20, 5);
      // Helmet
      ctx.fillStyle = "#cbd5e1"; ctx.shadowBlur = 6; ctx.shadowColor = "#94a3b8";
      ctx.beginPath(); ctx.ellipse(px, py - 53 + wobble, 13, 13, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#475569"; ctx.shadowBlur = 0;
      ctx.fillRect(px - 8, py - 61 + wobble, 16, 7);
      ctx.fillRect(px - 4, py - 60 + wobble, 8, 12);
      // Legs
      ctx.fillStyle = "#64748b"; ctx.fillRect(px - 11, py - 12, 9, 14); ctx.fillRect(px + 2, py - 12, 9, 14);
      ctx.fillStyle = "#475569"; ctx.fillRect(px - 11, py - 3, 9, 5); ctx.fillRect(px + 2, py - 3, 9, 5);
      // Shield
      ctx.fillStyle = "#1d4ed8"; ctx.shadowBlur = 5; ctx.shadowColor = "#3b82f6";
      ctx.beginPath(); ctx.roundRect(px - 24, py - 40, 11, 20, 4); ctx.fill();
      ctx.fillStyle = "#fbbf24"; ctx.shadowBlur = 4; ctx.shadowColor = "#f59e0b";
      ctx.beginPath(); ctx.arc(px - 18, py - 30, 4, 0, Math.PI * 2); ctx.fill();
      // Sword
      const sExt = atkT > 0 ? (1 - atkT / 0.55) * 40 : 0;
      ctx.strokeStyle = atkT > 0 ? "#fbbf24" : "#cbd5e1"; ctx.lineWidth = 4.5; ctx.lineCap = "round";
      ctx.shadowBlur = atkT > 0 ? 22 : 7; ctx.shadowColor = atkT > 0 ? "#f59e0b" : "#94a3b8";
      ctx.beginPath(); ctx.moveTo(px + 13, py - 34); ctx.lineTo(px + 14 + sExt + 22, py - 34); ctx.stroke();
      if (atkT > 0) {
        ctx.strokeStyle = `rgba(251,191,36,${atkT * 1.6})`; ctx.lineWidth = 3; ctx.shadowBlur = 20; ctx.shadowColor = "#f59e0b";
        ctx.beginPath(); ctx.arc(px + sExt + 24, py - 44, 20, 0.2, 1.45); ctx.stroke();
      }
      ctx.shadowBlur = 0; ctx.globalAlpha = 1; ctx.restore();
    };

    const drawEnemy = (enemy: typeof enemyRef.current, ts: number) => {
      const { kind, x, hp, maxHp, hurtTimer, deathTimer, animT } = enemy;
      const stats = ENEMY_STATS[kind];
      const py = GROUND_Y;
      if (deathTimer > 0) {
        ctx.globalAlpha = deathTimer; ctx.save(); ctx.translate(x, py - stats.h / 2);
        ctx.rotate((1 - deathTimer) * Math.PI * 4); ctx.scale(deathTimer, deathTimer); ctx.translate(-x, -(py - stats.h / 2));
      }
      const hs = hurtTimer > 0 ? (Math.random() - 0.5) * 10 : 0;
      const ex = x + hs;
      const wob = Math.sin(ts * 0.007 + animT) * 3;
      ctx.shadowBlur = kind === "dragon" ? 30 : 16;

      if (kind === "slime") {
        ctx.shadowColor = "#4ade80";
        const sq = Math.sin(ts * 0.009 + animT) * 0.1;
        ctx.fillStyle = "#22c55e"; ctx.beginPath(); ctx.ellipse(ex, py - stats.h / 2 + wob, stats.w / 2, stats.h / 2 * (1 + sq), 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#86efac"; ctx.beginPath(); ctx.ellipse(ex - 5, py - stats.h * 0.7 + wob, stats.w / 2 * 0.5, stats.h / 2 * 0.35, -0.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#14532d"; ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(ex - 9, py - stats.h * 0.62 + wob, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex + 9, py - stats.h * 0.62 + wob, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ex - 8, py - stats.h * 0.64 + wob, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex + 10, py - stats.h * 0.64 + wob, 2, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#14532d"; ctx.lineWidth = 2; ctx.lineCap = "round";
        ctx.beginPath(); ctx.arc(ex, py - stats.h * 0.4 + wob, 7, 0.2, Math.PI - 0.2); ctx.stroke();

      } else if (kind === "goblin") {
        ctx.shadowColor = "#fb923c";
        ctx.fillStyle = "#c2410c"; ctx.beginPath(); ctx.roundRect(ex - 13, py - 40, 26, 24, 5); ctx.fill();
        ctx.fillStyle = "#fb923c"; ctx.beginPath(); ctx.ellipse(ex, py - 51 + wob, 14, 14, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#c2410c";
        ctx.beginPath(); ctx.moveTo(ex - 14, py - 57 + wob); ctx.lineTo(ex - 23, py - 66 + wob); ctx.lineTo(ex - 10, py - 52 + wob); ctx.fill();
        ctx.beginPath(); ctx.moveTo(ex + 14, py - 57 + wob); ctx.lineTo(ex + 23, py - 66 + wob); ctx.lineTo(ex + 10, py - 52 + wob); ctx.fill();
        ctx.fillStyle = "#7c2d12"; ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(ex - 5, py - 53 + wob, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex + 5, py - 53 + wob, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ex - 4, py - 54 + wob, 1.2, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(ex + 6, py - 54 + wob, 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#c2410c"; ctx.fillRect(ex - 11, py - 17, 9, 18); ctx.fillRect(ex + 2, py - 17, 9, 18);
        ctx.strokeStyle = "#78350f"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.moveTo(ex - 14, py - 32); ctx.lineTo(ex - 26, py - 52 + wob); ctx.stroke();
        ctx.fillStyle = "#78350f"; ctx.beginPath(); ctx.ellipse(ex - 28, py - 56 + wob, 7, 9, -0.4, 0, Math.PI * 2); ctx.fill();

      } else if (kind === "skeleton") {
        ctx.shadowColor = "#e2e8f0";
        ctx.fillStyle = "#f1f5f9"; ctx.beginPath(); ctx.ellipse(ex, py - 53 + wob, 14, 14, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#0f172a"; ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.ellipse(ex - 6, py - 56 + wob, 4.5, 5.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(ex + 6, py - 56 + wob, 4.5, 5.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#f1f5f9"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(ex, py - 44 + wob, 8, 0.1, Math.PI - 0.1); ctx.stroke();
        for (let ti = 0; ti < 3; ti++) { ctx.beginPath(); ctx.moveTo(ex - 4 + ti * 4, py - 44 + wob); ctx.lineTo(ex - 4 + ti * 4, py - 40 + wob); ctx.stroke(); }
        ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 3;
        for (let ri = 0; ri < 3; ri++) { ctx.beginPath(); ctx.moveTo(ex - 10, py - 36 + ri * 8); ctx.lineTo(ex + 10, py - 36 + ri * 8); ctx.stroke(); }
        ctx.beginPath(); ctx.moveTo(ex, py - 37); ctx.lineTo(ex, py - 14); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ex - 10, py - 35); ctx.lineTo(ex - 22, py - 22 + wob); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ex + 10, py - 35); ctx.lineTo(ex + 22, py - 22 + wob); ctx.stroke();
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(ex - 5, py - 14); ctx.lineTo(ex - 9, py); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ex + 5, py - 14); ctx.lineTo(ex + 9, py); ctx.stroke();

      } else if (kind === "dragon") {
        ctx.shadowColor = "#ef4444";
        const wf = Math.sin(ts * 0.01) * 16;
        ctx.fillStyle = "rgba(239,68,68,0.5)";
        ctx.beginPath(); ctx.moveTo(ex, py - 42); ctx.lineTo(ex - 55, py - 65 - wf); ctx.lineTo(ex - 40, py - 20); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(ex, py - 42); ctx.lineTo(ex + 55, py - 65 - wf); ctx.lineTo(ex + 40, py - 20); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#dc2626"; ctx.shadowBlur = 20; ctx.shadowColor = "#ef4444";
        ctx.beginPath(); ctx.ellipse(ex, py - 28, 30, 24, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#b91c1c";
        ctx.beginPath(); ctx.ellipse(ex + 22, py - 46 + wob, 20, 18, 0.3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#7f1d1d";
        ctx.beginPath(); ctx.moveTo(ex + 12, py - 58 + wob); ctx.lineTo(ex + 5, py - 76 + wob); ctx.lineTo(ex + 19, py - 62 + wob); ctx.fill();
        ctx.beginPath(); ctx.moveTo(ex + 27, py - 57 + wob); ctx.lineTo(ex + 36, py - 74 + wob); ctx.lineTo(ex + 30, py - 61 + wob); ctx.fill();
        ctx.fillStyle = "#fbbf24"; ctx.shadowBlur = 10; ctx.shadowColor = "#f59e0b";
        ctx.beginPath(); ctx.moveTo(ex + 8, py - 63 + wob); ctx.lineTo(ex + 13, py - 72 + wob); ctx.lineTo(ex + 18, py - 63 + wob); ctx.lineTo(ex + 22, py - 74 + wob); ctx.lineTo(ex + 26, py - 63 + wob); ctx.lineTo(ex + 28, py - 62 + wob); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#fef08a"; ctx.shadowBlur = 14; ctx.shadowColor = "#fde047";
        ctx.beginPath(); ctx.arc(ex + 27, py - 48 + wob, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#111"; ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(ex + 28, py - 49 + wob, 2.2, 0, Math.PI * 2); ctx.fill();
        for (let fi = 0; fi < 6; fi++) { const fx = ex + 40 + fi * 13 + Math.sin(ts * 0.02 + fi * 0.8) * 5; const fy = py - 44 + wob + (Math.random() - 0.5) * 8; const fr = (6 - fi) * 3.5 + Math.random() * 3; ctx.fillStyle = `hsla(${18 + fi * 9 + Math.sin(ts * 0.02) * 12}, 100%, ${52 + fi * 5}%, ${0.85 - fi * 0.11})`; ctx.shadowBlur = 14; ctx.shadowColor = "#f97316"; ctx.beginPath(); ctx.arc(fx, fy, fr, 0, Math.PI * 2); ctx.fill(); }
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#b91c1c"; ctx.fillRect(ex - 25, py - 10, 14, 13); ctx.fillRect(ex + 11, py - 10, 14, 13);
        ctx.fillStyle = "#7f1d1d";
        for (let ci = 0; ci < 3; ci++) { ctx.fillRect(ex - 26 + ci * 5, py + 2, 4, 7); ctx.fillRect(ex + 9 + ci * 5, py + 2, 4, 7); }
      }

      if (deathTimer > 0) { ctx.restore(); ctx.globalAlpha = 1; }
      ctx.shadowBlur = 0;

      if (hp > 0 && deathTimer <= 0) {
        const bW = Math.max(55, stats.w * 2.4);
        const bX = x - bW / 2;
        const bY = py - stats.h - 28;
        ctx.fillStyle = "rgba(0,0,0,0.65)"; ctx.fillRect(bX - 2, bY - 2, bW + 4, 13);
        const pct = hp / maxHp;
        ctx.fillStyle = pct > 0.5 ? "#22c55e" : pct > 0.25 ? "#f59e0b" : "#ef4444";
        ctx.shadowBlur = 5; ctx.shadowColor = ctx.fillStyle;
        ctx.fillRect(bX, bY, bW * pct, 9); ctx.shadowBlur = 0;
        dt_(stats.label, x, bY - 10, 9, "#fde68a");
      }
    };

    const drawHUD = () => {
      ctx.fillStyle = "rgba(2,6,23,0.92)"; ctx.fillRect(0, 0, CW, 92);
      ctx.strokeStyle = "rgba(99,102,241,0.35)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, 92); ctx.lineTo(CW, 92); ctx.stroke();
      dt_(`⚔ KSATRIA — ${FLOOR_NAMES[floorRef.current]}`, CW / 2, 14, 12, "#818cf8");
      const phW = 128;
      ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(10, 26, phW + 4, 15);
      const hpPct = playerHpRef.current / PLAYER_MAX_HP;
      ctx.fillStyle = hpPct > 0.5 ? "#22c55e" : hpPct > 0.25 ? "#f59e0b" : "#ef4444";
      ctx.shadowBlur = 7; ctx.shadowColor = ctx.fillStyle;
      ctx.fillRect(12, 28, Math.max(0, phW * hpPct), 11); ctx.shadowBlur = 0;
      dt_(`HP: ${playerHpRef.current}/${PLAYER_MAX_HP}`, 12 + phW / 2, 34, 9, "#a7f3d0");
      const wave = WAVES[floorRef.current] || [];
      const wIdx = Math.min(waveIdxRef.current, wave.length);
      dt_(`Musuh: ${wIdx}/${wave.length}`, 12, 68, 9, "#94a3b8", "left");
      dt_(`Skor: ${scoreRef.current}`, CW - 12, 30, 11, "#fde68a", "right");
      dt_(`Best: ${bestRef.current}`, CW - 12, 50, 9, "#94a3b8", "right");
      if (comboRef.current >= 2) dt_(`COMBO ×${comboRef.current} 🔥`, CW - 12, 70, 10, "#fb923c", "right");
    };

    const drawQPanel = () => {
      ctx.fillStyle = "rgba(2,6,23,0.93)"; ctx.fillRect(0, 452, CW, CH - 452);
      ctx.strokeStyle = "rgba(99,102,241,0.5)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, 452); ctx.lineTo(CW, 452); ctx.stroke();
      dt_(`${qRef.current.q} = ?`, CW / 2, 464, 18, "#ffffff");
      optsRef.current.forEach((opt, i) => {
        const b = BTNS[i];
        const fb = feedbackRef.current;
        let bg = BTN_COLORS[i], glow = BTN_GLOW[i];
        if (fb && fb.idx === i) { bg = fb.correct ? "#22c55e" : "#ef4444"; glow = fb.correct ? "#86efac" : "#fca5a5"; }
        ctx.fillStyle = bg; ctx.shadowBlur = 12; ctx.shadowColor = glow;
        ctx.beginPath(); ctx.roundRect(b.x, b.y, BTN_W, BTN_H, 10); ctx.fill(); ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,0.13)"; ctx.beginPath(); ctx.roundRect(b.x + 4, b.y + 3, BTN_W - 8, 7, 5); ctx.fill();
        dt_(`${i + 1}. ${opt}`, b.x + BTN_W / 2, b.y + BTN_H / 2, 14, "#ffffff");
      });
    };

    const drawOverlay = (phase: Phase) => {
      if (phase !== "idle" && phase !== "over" && phase !== "won" && phase !== "victory_floor") return;
      ctx.fillStyle = "rgba(2,6,23,0.9)"; ctx.fillRect(18, 130, CW - 36, 285);
      const bdrColor = phase === "won" ? "#fbbf24" : phase === "over" ? "#ef4444" : "#6366f1";
      ctx.strokeStyle = bdrColor; ctx.lineWidth = 3; ctx.strokeRect(18, 130, CW - 36, 285);
      if (phase === "idle") {
        dt_("⚔ KSATRIA MATEMATIKA ⚔", CW / 2, 172, 17, "#818cf8");
        dt_("Jawab soal untuk menyerang musuh!", CW / 2, 206, 11, "#a5f3fc");
        dt_("3 Lantai · 6 Musuh per Lantai · Naga Boss 🐉", CW / 2, 228, 10, "#fde68a");
        dt_("✅ Benar = serang musuh ⚔", CW / 2, 254, 11, "#86efac");
        dt_("❌ Salah = serangan balik 💔 -1 HP", CW / 2, 275, 11, "#fca5a5");
        dt_("Tekan 1 / 2 / 3 / 4 = pilih jawaban", CW / 2, 300, 10, "#94a3b8");
        dt_("Klik atau tekan Spasi untuk mulai!", CW / 2, 384, 14, "#fbbf24");
      } else if (phase === "over") {
        dt_("KALAH! 💀", CW / 2, 177, 24, "#ef4444");
        dt_(`Skor akhir: ${scoreRef.current}`, CW / 2, 220, 16, "#ffffff");
        dt_(`Terbaik: ${bestRef.current}`, CW / 2, 250, 12, "#fde68a");
        dt_(`Lantai ${floorRef.current + 1} dari 3`, CW / 2, 276, 11, "#94a3b8");
        dt_("Klik atau Spasi untuk coba lagi", CW / 2, 384, 13, "#f87171");
      } else if (phase === "won") {
        dt_("MENANG! 🏆", CW / 2, 177, 24, "#fbbf24");
        dt_("Semua musuh & naga dikalahkan!", CW / 2, 216, 13, "#86efac");
        dt_(`Skor akhir: ${scoreRef.current}`, CW / 2, 248, 16, "#ffffff");
        dt_(`Terbaik: ${bestRef.current}`, CW / 2, 274, 12, "#fde68a");
        dt_("Klik atau Spasi untuk main lagi", CW / 2, 384, 13, "#fbbf24");
      } else if (phase === "victory_floor") {
        const t = transRef.current;
        dt_(t.text, CW / 2, 196, 21, "#fbbf24");
        dt_(t.sub, CW / 2, 240, 11, "#a5f3fc");
        dt_("Bersiaplah menghadapi lantai berikutnya...", CW / 2, 330, 10, "#94a3b8");
      }
    };

    const loop = (ts: number) => {
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05) || 0;
      lastRef.current = ts;
      hueRef.current = (hueRef.current + dt * 18) % 360;
      const phase = phaseRef.current;
      if (shakeRef.current > 0) shakeRef.current = Math.max(0, shakeRef.current - dt * 2.6);
      if (attackTRef.current > 0) attackTRef.current = Math.max(0, attackTRef.current - dt);
      if (hurtTRef.current > 0) hurtTRef.current = Math.max(0, hurtTRef.current - dt);
      const enemy = enemyRef.current;
      enemy.animT += dt;
      if (enemy.hurtTimer > 0) enemy.hurtTimer = Math.max(0, enemy.hurtTimer - dt);
      if (feedbackRef.current) { feedbackRef.current.timer -= dt; if (feedbackRef.current.timer <= 0) feedbackRef.current = null; }

      if (phase === "exploring") {
        bgScrollRef.current += 58 * dt;
        enemy.x -= ENEMY_STATS[enemy.kind].speed * dt;
        if (enemy.x <= BATTLE_ENEMY_X) { enemy.x = BATTLE_ENEMY_X; startBattle(); }
      } else if (phase === "battling") {
        bgScrollRef.current += 7 * dt;
      } else if (phase === "enemy_dying") {
        enemy.deathTimer -= dt;
        bgScrollRef.current += 18 * dt;
        if (enemy.deathTimer <= 0) { waveIdxRef.current++; loadEnemy(); }
      } else if (phase === "victory_floor") {
        transRef.current.timer -= dt;
        bgScrollRef.current += 12 * dt;
        if (transRef.current.timer <= 0) {
          const next = floorRef.current + 1;
          if (next >= WAVES.length) { phaseRef.current = "won"; rerender(); }
          else { floorRef.current = next; waveIdxRef.current = 0; loadEnemy(); }
        }
      }

      particlesRef.current.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 280 * dt; p.alpha -= dt * 1.5; p.r *= 0.99; });
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);
      floatsRef.current.forEach(f => { f.y += f.vy * dt; f.alpha -= dt * 0.95; });
      floatsRef.current = floatsRef.current.filter(f => f.alpha > 0);

      ctx.save();
      const shake = shakeRef.current * 10;
      ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      ctx.fillStyle = "#080e1a"; ctx.fillRect(0, 0, CW, CH);
      drawBG(floorRef.current, bgScrollRef.current, ts);
      drawPlayer(ts, attackTRef.current, hurtTRef.current);
      if (phase === "exploring" || phase === "battling" || phase === "enemy_dying") drawEnemy(enemy, ts);
      particlesRef.current.forEach(p => { ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color; ctx.shadowBlur = 8; ctx.shadowColor = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); });
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      floatsRef.current.forEach(f => { ctx.globalAlpha = f.alpha; dt_(f.text, f.x, f.y, 15, f.color); }); ctx.globalAlpha = 1;
      drawHUD();
      if (phase === "battling") drawQPanel();
      drawOverlay(phase);
      ctx.restore();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [rerender, startGame, handleAnswer, loadEnemy, startBattle]);

  return (
    <div className={`relative min-h-screen flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`}>
      {isLight ? <Snowfall /> : <Starfield />}
      <PageNavigation prevPath="/math-game-arena/umum" />
      <div className="relative z-10 w-full max-w-5xl px-4 py-6 flex flex-col items-center">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-950/40 px-4 py-2 text-indigo-100 text-xs font-bold tracking-widest">
            RPG PETUALANGAN · BOSS BATTLE · 3 LANTAI
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-primary text-glow-cyan mt-3">
            ⚔️ Ksatria Matematika
          </h1>
          <p className="font-body text-sm text-white/65 mt-2 max-w-xl mx-auto">
            Jadilah ksatria! Lawan slime, goblin, kerangka, dan naga boss raksasa lewat 3 lantai petualangan epik!
          </p>
        </div>

        <div className="relative rounded-[28px] p-3 bg-gradient-to-br from-indigo-500 via-purple-600 to-red-500 shadow-[0_0_55px_rgba(99,102,241,0.3)]">
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              handleCanvasClick(
                (e.clientX - rect.left) * (CW / rect.width),
                (e.clientY - rect.top) * (CH / rect.height),
              );
            }}
            onTouchStart={e => {
              e.preventDefault();
              const t = e.touches[0];
              const rect = e.currentTarget.getBoundingClientRect();
              handleCanvasClick(
                (t.clientX - rect.left) * (CW / rect.width),
                (t.clientY - rect.top) * (CH / rect.height),
              );
            }}
            className="w-[min(420px,92vw)] h-auto rounded-[20px] bg-slate-950 select-none touch-none border-4 border-slate-900 cursor-pointer"
          />
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            onClick={startGame}
            className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-black hover:scale-105 transition-transform shadow-lg shadow-indigo-500/30"
          >
            Mulai / Ulangi
          </button>
          <button
            onClick={() => { playPopSound(); navigate("/math-game-arena/umum"); }}
            className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition-colors"
          >
            Kembali ke Game Umum
          </button>
        </div>
        <p className="mt-3 text-xs text-white/40 font-body text-center">
          Saat bertarung: klik jawaban atau tekan tombol 1 / 2 / 3 / 4 di keyboard
        </p>
      </div>
    </div>
  );
};

export default KsatriaMatPage;
