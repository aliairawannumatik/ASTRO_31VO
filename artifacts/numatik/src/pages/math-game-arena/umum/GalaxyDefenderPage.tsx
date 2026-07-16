import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { ArrowLeft, RotateCcw, Trophy, Heart, Zap, Rocket } from "lucide-react";

type Phase = "idle" | "playing" | "gameover";

interface MQ { q: string; ans: number; }

interface Alien {
  id: number;
  x: number;       // 0..100 (% of arena width)
  y: number;       // 0..100 (% of arena height)
  vy: number;      // % per frame
  value: number;
  type: 0 | 1 | 2; // visual variant
  wobble: number;  // phase offset
  alive: boolean;
  exploding: boolean;
  explodeFrame: number;
  isCorrect: boolean;
}

interface Laser {
  id: number;
  fromX: number; fromY: number;
  toX: number; toY: number;
  life: number;
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; color: string; size: number;
}

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

const makeQ = (level: number): MQ => {
  const t = Math.floor(Math.random() * (level >= 3 ? 7 : 5));
  switch (t) {
    case 0: { const a = 4 + Math.floor(Math.random() * (8 + level * 4)); const b = 2 + Math.floor(Math.random() * (6 + level * 2)); return { q: `${a} × ${b}`, ans: a * b }; }
    case 1: { const a = 15 + Math.floor(Math.random() * (40 + level * 25)); const b = 10 + Math.floor(Math.random() * (30 + level * 15)); return { q: `${a} + ${b}`, ans: a + b }; }
    case 2: { const b = 8 + Math.floor(Math.random() * (25 + level * 8)); const a = b + 8 + Math.floor(Math.random() * (30 + level * 12)); return { q: `${a} − ${b}`, ans: a - b }; }
    case 3: { const b = 2 + Math.floor(Math.random() * (5 + level)); const k = 2 + Math.floor(Math.random() * (7 + level)); return { q: `${b * k} ÷ ${b}`, ans: k }; }
    case 4: { const sqList = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144]; const sq = sqList[Math.floor(Math.random() * sqList.length)]; return { q: `√${sq}`, ans: Math.round(Math.sqrt(sq)) }; }
    case 5: { const bases = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; const a = bases[Math.floor(Math.random() * bases.length)]; return { q: `${a}²`, ans: a * a }; }
    default: { const a = 2 + Math.floor(Math.random() * 9); const b = 2 + Math.floor(Math.random() * 9); return { q: `KPK(${a},${b})`, ans: (a * b) / gcd(a, b) }; }
  }
};

const makeWrong = (ans: number, used: Set<number>): number => {
  let v = 0; let tries = 0;
  do {
    const d = 1 + Math.floor(Math.random() * Math.max(4, Math.floor(ans * 0.25)));
    v = ans + (Math.random() < 0.5 ? d : -d);
    tries++;
  } while ((used.has(v) || v < 0) && tries < 80);
  return v < 0 ? ans + 1 + Math.floor(Math.random() * 10) : v;
};

const ALIEN_COLORS: Array<{ body: string; glow: string; eye: string }> = [
  { body: "#a855f7", glow: "rgba(168,85,247,0.6)", eye: "#fde047" },
  { body: "#22d3ee", glow: "rgba(34,211,238,0.6)", eye: "#fb7185" },
  { body: "#34d399", glow: "rgba(52,211,153,0.6)", eye: "#fbbf24" },
];

let _idCounter = 1;
const nextId = () => _idCounter++;

const GalaxyDefenderPage = () => {
  const navigate = useNavigate();
  const arenaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(() => Number(localStorage.getItem("galaxy-defender-best-combo") || 0));
  const [lives, setLives] = useState(3);
  const [shieldFlash, setShieldFlash] = useState(0); // tick
  const [shake, setShake] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem("galaxy-defender-highscore") || 0));
  const [question, setQuestion] = useState<MQ>(() => makeQ(1));
  const [aliens, setAliens] = useState<Alien[]>([]);
  const [popup, setPopup] = useState<{ id: number; text: string; good: boolean; x: number; y: number } | null>(null);

  // refs that mirror state for the RAF loop
  const aliensRef = useRef<Alien[]>([]);
  const questionRef = useRef<MQ>(question);
  const phaseRef = useRef<Phase>(phase);
  const levelRef = useRef<number>(level);
  const livesRef = useRef<number>(lives);
  const lastSpawnRef = useRef<number>(0);
  const lasersRef = useRef<Laser[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => { aliensRef.current = aliens; }, [aliens]);
  useEffect(() => { questionRef.current = question; }, [question]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { levelRef.current = level; }, [level]);
  useEffect(() => { livesRef.current = lives; }, [lives]);

  const newQuestion = useCallback((lv: number) => {
    const q = makeQ(lv);
    setQuestion(q);
    questionRef.current = q;
  }, []);

  // Spawn one alien wave (1 correct + 0-2 wrongs)
  const spawnAliens = useCallback(() => {
    const q = questionRef.current;
    const lv = levelRef.current;
    const wrongCount = Math.min(2, 1 + Math.floor(lv / 2));
    const used = new Set<number>([q.ans]);
    const items: Alien[] = [];
    // correct
    items.push({
      id: nextId(),
      x: 8 + Math.random() * 84,
      y: -8 - Math.random() * 6,
      vy: 0.10 + lv * 0.04 + Math.random() * 0.06,
      value: q.ans,
      type: Math.floor(Math.random() * 3) as 0 | 1 | 2,
      wobble: Math.random() * Math.PI * 2,
      alive: true,
      exploding: false,
      explodeFrame: 0,
      isCorrect: true,
    });
    for (let i = 0; i < wrongCount; i++) {
      const w = makeWrong(q.ans, used);
      used.add(w);
      items.push({
        id: nextId(),
        x: 8 + Math.random() * 84,
        y: -8 - Math.random() * 30,
        vy: 0.09 + lv * 0.035 + Math.random() * 0.06,
        value: w,
        type: Math.floor(Math.random() * 3) as 0 | 1 | 2,
        wobble: Math.random() * Math.PI * 2,
        alive: true,
        exploding: false,
        explodeFrame: 0,
        isCorrect: false,
      });
    }
    aliensRef.current = [...aliensRef.current, ...items];
    setAliens(aliensRef.current);
  }, []);

  const spawnParticles = (x: number, y: number, color: string, count: number) => {
    const arr = particlesRef.current;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 1 + Math.random() * 3;
      arr.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 0, max: 24 + Math.random() * 18,
        color, size: 2 + Math.random() * 3,
      });
    }
  };

  const fireLaser = (toXpx: number, toYpx: number) => {
    const c = canvasRef.current;
    if (!c) return;
    lasersRef.current.push({
      id: nextId(),
      fromX: c.width / 2,
      fromY: c.height - 30,
      toX: toXpx,
      toY: toYpx,
      life: 0,
    });
  };

  const handleAlienTap = useCallback((alien: Alien) => {
    if (phaseRef.current !== "playing") return;
    if (!alien.alive || alien.exploding) return;
    const arena = arenaRef.current;
    const c = canvasRef.current;
    if (!arena || !c) return;
    const rect = arena.getBoundingClientRect();
    const ax = (alien.x / 100) * rect.width;
    const ay = (alien.y / 100) * rect.height;
    fireLaser(ax, ay);
    playPopSound();

    if (alien.isCorrect) {
      // Mark as exploding
      alien.exploding = true;
      const color = ALIEN_COLORS[alien.type].body;
      spawnParticles(ax, ay, color, 30);
      spawnParticles(ax, ay, "#fde047", 16);
      setScore((s) => s + 100 + combo * 15);
      setCombo((cm) => {
        const next = cm + 1;
        if (next > bestCombo) {
          setBestCombo(next);
          localStorage.setItem("galaxy-defender-best-combo", String(next));
        }
        return next;
      });
      setPopup({ id: nextId(), text: `+${100 + combo * 15}`, good: true, x: alien.x, y: alien.y });
      // Remove other aliens (same wave) — they fly away
      aliensRef.current = aliensRef.current.map((a) => a.id === alien.id ? alien : { ...a, alive: a.isCorrect ? a.alive : false });
      setAliens([...aliensRef.current]);
      // New question next wave
      const newLv = Math.min(8, 1 + Math.floor((score + 100) / 800));
      setLevel(newLv);
      newQuestion(newLv);
    } else {
      // Wrong tap → penalty
      spawnParticles(ax, ay, "#ef4444", 18);
      setCombo(0);
      setShake(8);
      setShieldFlash(Date.now());
      setLives((lv) => {
        const n = lv - 1;
        if (n <= 0) {
          setPhase("gameover");
        }
        return n;
      });
      setPopup({ id: nextId(), text: "−1 ❤", good: false, x: alien.x, y: alien.y });
      // Mark wrong alien as exploding too (visual feedback)
      alien.exploding = true;
      aliensRef.current = aliensRef.current.map((a) => a.id === alien.id ? alien : a);
      setAliens([...aliensRef.current]);
    }
  }, [bestCombo, combo, newQuestion, score]);

  // Main loop
  useEffect(() => {
    if (phase !== "playing") return;
    const c = canvasRef.current;
    const arena = arenaRef.current;
    if (!c || !arena) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let lastT = performance.now();
    startTimeRef.current = performance.now();
    lastSpawnRef.current = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(40, now - lastT);
      lastT = now;
      const factor = dt / 16.6;

      // Resize canvas to match arena
      const rect = arena.getBoundingClientRect();
      if (c.width !== Math.floor(rect.width) || c.height !== Math.floor(rect.height)) {
        c.width = Math.floor(rect.width);
        c.height = Math.floor(rect.height);
      }

      // Spawn timing
      const spawnInterval = Math.max(1300, 3500 - levelRef.current * 280);
      const aliveCount = aliensRef.current.filter((a) => a.alive && !a.exploding).length;
      if (aliveCount === 0 || now - lastSpawnRef.current > spawnInterval) {
        if (aliveCount < 5) {
          spawnAliens();
          lastSpawnRef.current = now;
        }
      }

      // Update aliens
      let damaged = 0;
      const updated: Alien[] = [];
      for (const a of aliensRef.current) {
        if (a.exploding) {
          a.explodeFrame += factor;
          if (a.explodeFrame < 14) updated.push(a);
          continue;
        }
        if (!a.alive) continue;
        a.y += a.vy * factor;
        a.x += Math.sin((now / 600) + a.wobble) * 0.05 * factor;
        if (a.y >= 86) {
          // reached planet
          if (a.isCorrect) {
            damaged += 1;
          }
          a.alive = false;
          continue;
        }
        updated.push(a);
      }
      aliensRef.current = updated;
      setAliens([...updated]);

      if (damaged > 0) {
        setLives((lv) => {
          const n = Math.max(0, lv - damaged);
          if (n <= 0) setPhase("gameover");
          return n;
        });
        setShake(10);
        setShieldFlash(Date.now());
        setCombo(0);
        // If correct alien crashed, generate new question to keep flow
        const lv = Math.min(8, levelRef.current);
        newQuestion(lv);
      }

      // Render canvas: lasers + particles
      ctx.clearRect(0, 0, c.width, c.height);

      // Lasers
      const lasers = lasersRef.current;
      for (let i = lasers.length - 1; i >= 0; i--) {
        const L = lasers[i];
        L.life += factor;
        const t = Math.min(1, L.life / 6);
        const x = L.fromX + (L.toX - L.fromX) * t;
        const y = L.fromY + (L.toY - L.fromY) * t;
        ctx.save();
        ctx.strokeStyle = "rgba(125, 252, 255, 0.9)";
        ctx.lineWidth = 3;
        ctx.shadowColor = "#67e8f9";
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.moveTo(L.fromX, L.fromY);
        ctx.lineTo(x, y);
        ctx.stroke();
        // Inner core
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(L.fromX, L.fromY);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();
        if (L.life >= 8) lasers.splice(i, 1);
      }

      // Particles
      const ps = particlesRef.current;
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.life += factor;
        p.x += p.vx * factor;
        p.y += p.vy * factor;
        p.vy += 0.05 * factor;
        const a = Math.max(0, 1 - p.life / p.max);
        if (p.life >= p.max) { ps.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, spawnAliens, newQuestion]);

  // Shake decay
  useEffect(() => {
    if (shake <= 0) return;
    const id = setTimeout(() => setShake((s) => Math.max(0, s - 2)), 60);
    return () => clearTimeout(id);
  }, [shake]);

  // Popup auto-dismiss
  useEffect(() => {
    if (!popup) return;
    const id = setTimeout(() => setPopup(null), 700);
    return () => clearTimeout(id);
  }, [popup]);

  // Save high score on game over
  useEffect(() => {
    if (phase === "gameover") {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("galaxy-defender-highscore", String(score));
      }
      // Stop spawning by clearing aliens
      aliensRef.current = [];
      setAliens([]);
      lasersRef.current = [];
    }
  }, [phase, score, highScore]);

  const startGame = () => {
    playPopSound();
    setScore(0);
    setCombo(0);
    setLives(3);
    setLevel(1);
    aliensRef.current = [];
    lasersRef.current = [];
    particlesRef.current = [];
    setAliens([]);
    newQuestion(1);
    setPhase("playing");
  };

  const shakeStyle: React.CSSProperties = shake > 0 ? {
    transform: `translate(${(Math.random() - 0.5) * shake}px, ${(Math.random() - 0.5) * shake}px)`,
  } : {};

  return (
    <div className="relative min-h-screen gradient-space overflow-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru/numatik-game" />

      <div className="relative z-10 max-w-md mx-auto px-3 pt-20 pb-12">
        {/* Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/40 bg-fuchsia-500/10 px-3 py-1 text-[10px] font-semibold text-fuchsia-100 mb-2">
            <Rocket className="w-3 h-3" /> Pertahanan Galaksi
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-fuchsia-300 leading-tight" style={{ textShadow: "0 0 20px rgba(217,70,239,0.6)" }}>
            GALAKSI DEFENDER MATH
          </h1>
          <p className="text-white/55 text-[11px] mt-1 font-body">
            Tembak alien yang membawa <span className="text-emerald-300 font-semibold">jawaban benar</span>! Lindungi Bumi!
          </p>
        </div>

        {/* HUD */}
        <div className="grid grid-cols-4 gap-2 mb-3 text-center">
          <div className="bg-black/40 border border-white/10 rounded-lg py-1.5">
            <div className="text-[9px] text-white/50 uppercase">Skor</div>
            <div className="text-fuchsia-300 font-bold text-sm">{score}</div>
          </div>
          <div className="bg-black/40 border border-white/10 rounded-lg py-1.5">
            <div className="text-[9px] text-white/50 uppercase">Combo</div>
            <div className="text-amber-300 font-bold text-sm">⚡{combo}</div>
          </div>
          <div className="bg-black/40 border border-white/10 rounded-lg py-1.5">
            <div className="text-[9px] text-white/50 uppercase">Nyawa</div>
            <div className="font-bold text-sm flex items-center justify-center gap-0.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart key={i} className={`w-3.5 h-3.5 ${i < lives ? "text-rose-400 fill-rose-500" : "text-white/15"}`} />
              ))}
            </div>
          </div>
          <div className="bg-black/40 border border-white/10 rounded-lg py-1.5">
            <div className="text-[9px] text-white/50 uppercase">Level</div>
            <div className="text-cyan-300 font-bold text-sm">{level}</div>
          </div>
        </div>

        {/* Question banner */}
        {phase === "playing" && (
          <div className="mb-2 mx-auto bg-gradient-to-r from-fuchsia-900/60 via-violet-900/60 to-cyan-900/60 border border-fuchsia-300/40 rounded-xl px-4 py-2 text-center backdrop-blur">
            <div className="text-[9px] uppercase tracking-widest text-fuchsia-200/70 mb-0.5">Hancurkan Alien dengan Jawaban</div>
            <div className="font-display text-2xl font-black text-white">
              {question.q} <span className="text-fuchsia-300">= ?</span>
            </div>
          </div>
        )}

        {/* Arena */}
        <div
          ref={arenaRef}
          className="relative w-full overflow-hidden rounded-2xl border-2 border-white/20 select-none"
          style={{ aspectRatio: "9 / 14", ...shakeStyle, transition: shake > 0 ? "none" : "transform 0.1s ease" }}
        >
          {/* Deep space gradient */}
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 55%, #020617 100%)"
          }} />

          {/* Distant nebula */}
          <div className="absolute -top-10 -left-8 w-44 h-44 rounded-full bg-fuchsia-500/15 blur-3xl" />
          <div className="absolute top-1/3 -right-10 w-44 h-44 rounded-full bg-cyan-500/15 blur-3xl" />

          {/* Twinkling stars (in-arena) */}
          {Array.from({ length: 40 }).map((_, i) => {
            const x = (i * 263) % 100;
            const y = (i * 97) % 100;
            const sz = 1 + (i % 3);
            return (
              <div key={i} className="absolute rounded-full bg-white" style={{
                left: `${x}%`, top: `${y}%`, width: sz, height: sz, opacity: 0.3 + ((i % 5) * 0.12),
                boxShadow: "0 0 4px rgba(255,255,255,0.6)",
              }} />
            );
          })}

          {/* Aliens */}
          {aliens.map((a) => {
            const c = ALIEN_COLORS[a.type];
            return (
              <button
                key={a.id}
                disabled={!a.alive || a.exploding || phase !== "playing"}
                onClick={() => handleAlienTap(a)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
                style={{
                  left: `${a.x}%`,
                  top: `${a.y}%`,
                  transition: "left 0.1s linear",
                  pointerEvents: a.alive && !a.exploding ? "auto" : "none",
                }}
              >
                <div className="relative" style={{
                  width: 56, height: 44,
                  transform: a.exploding ? `scale(${1 + a.explodeFrame * 0.18})` : "scale(1)",
                  opacity: a.exploding ? Math.max(0, 1 - a.explodeFrame / 14) : 1,
                  transition: "transform 0.05s linear",
                  filter: a.exploding ? "blur(2px) brightness(2)" : "none",
                }}>
                  {/* UFO Dome */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 w-7 h-5 rounded-t-full"
                    style={{
                      background: "linear-gradient(to bottom, #f0abfc 0%, #c4b5fd 70%, #818cf8 100%)",
                      boxShadow: "inset 0 1px 4px rgba(255,255,255,0.7), 0 0 8px rgba(196,181,253,0.6)",
                      border: "1px solid rgba(255,255,255,0.5)",
                    }}
                  />
                  {/* UFO Disc */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-3.5 w-14 h-4 rounded-full flex items-center justify-center"
                    style={{
                      background: `radial-gradient(ellipse at center, ${c.body} 0%, ${c.body}cc 60%, #1e293b 100%)`,
                      border: `1.5px solid ${c.body}`,
                      boxShadow: `0 0 14px ${c.glow}, inset 0 -2px 4px rgba(0,0,0,0.4)`,
                    }}
                  >
                    <span className="font-display font-black text-[12px] text-white" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.9)" }}>
                      {a.value}
                    </span>
                  </div>
                  {/* Lights */}
                  <div className="absolute left-1 top-4 w-1.5 h-1.5 rounded-full" style={{ background: c.eye, boxShadow: `0 0 6px ${c.eye}` }} />
                  <div className="absolute right-1 top-4 w-1.5 h-1.5 rounded-full" style={{ background: c.eye, boxShadow: `0 0 6px ${c.eye}` }} />
                  {/* Tractor beam (subtle) */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-7 w-10 h-3 opacity-40"
                    style={{
                      background: `linear-gradient(to bottom, ${c.body}80, transparent)`,
                      clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0 100%)",
                    }}
                  />
                </div>
              </button>
            );
          })}

          {/* Earth / Cannon at bottom */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center" style={{ width: "100%" }}>
            {/* Shield flash */}
            {Date.now() - shieldFlash < 280 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(239,68,68,0.45) 0%, transparent 70%)",
                  animation: "ping 0.3s ease-out",
                }}
              />
            )}
            {/* Cannon */}
            <div className="relative mb-[-6px] z-10">
              <div className="w-3 h-7 rounded-t bg-gradient-to-b from-cyan-200 to-cyan-500 mx-auto" style={{ boxShadow: "0 0 10px rgba(34,211,238,0.7)" }} />
            </div>
            {/* Earth dome */}
            <div className="relative w-full" style={{ height: 80 }}>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[-40px] w-[150%] h-[150px] rounded-full"
                style={{
                  background: "radial-gradient(ellipse at 35% 30%, #60a5fa 0%, #2563eb 30%, #1e3a8a 65%, #0c1f4a 100%)",
                  boxShadow: "0 -10px 40px rgba(59,130,246,0.5), inset 0 4px 18px rgba(125,211,252,0.6)",
                  border: "2px solid rgba(125,211,252,0.5)",
                }}
              >
                {/* Continents (decorative blobs) */}
                <div className="absolute top-2 left-1/3 w-12 h-6 rounded-full bg-emerald-500/70 blur-[1px]" />
                <div className="absolute top-6 right-1/4 w-10 h-5 rounded-full bg-emerald-600/70 blur-[1px]" />
                <div className="absolute top-4 left-1/2 w-6 h-3 rounded-full bg-emerald-500/60 blur-[1px]" />
              </div>
            </div>
          </div>

          {/* Canvas overlay (lasers + particles) */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          {/* Floating popup */}
          {popup && (
            <div
              key={popup.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-slide-up"
              style={{ left: `${popup.x}%`, top: `${popup.y}%` }}
            >
              <div className={`px-2 py-0.5 rounded font-display font-black text-sm ${
                popup.good ? "text-emerald-300" : "text-rose-300"
              }`} style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>
                {popup.text}
              </div>
            </div>
          )}

          {/* Idle overlay */}
          {phase === "idle" && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur flex flex-col items-center justify-center px-6 text-center">
              <Rocket className="w-12 h-12 text-fuchsia-300 mb-3" />
              <h2 className="font-display text-xl font-bold text-fuchsia-200 mb-2">Pertahankan Bumi!</h2>
              <p className="text-white/70 text-xs mb-4 leading-relaxed">
                Alien turun membawa angka. <strong className="text-emerald-300">Tap alien dengan angka jawaban benar</strong> untuk menembaknya.
                Salah tembak = kurangi nyawa. Alien lolos = kurangi nyawa.
              </p>
              <ul className="text-white/60 text-[11px] mb-4 space-y-0.5">
                <li>👽 Tembak alien jawaban benar</li>
                <li>⚡ Combo = poin bonus</li>
                <li>❤ 3 nyawa, level naik tiap 800 poin</li>
              </ul>
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-full bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-900 font-display font-bold text-sm shadow-lg transition-transform hover:scale-105"
              >
                MULAI MISI
              </button>
            </div>
          )}

          {/* Game Over overlay */}
          {phase === "gameover" && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur flex flex-col items-center justify-center px-6 text-center">
              <Trophy className="w-12 h-12 text-amber-300 mb-3" />
              <h2 className="font-display text-2xl font-bold text-amber-200 mb-1">Misi Selesai!</h2>
              <p className="text-white/70 text-xs mb-4">Bumi membutuhkan pejuang baru!</p>
              <div className="grid grid-cols-2 gap-3 mb-5 w-full max-w-xs">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-[10px] text-white/50">Skor Akhir</div>
                  <div className="text-fuchsia-300 text-2xl font-bold">{score}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-[10px] text-white/50">Combo Terbaik</div>
                  <div className="text-amber-300 text-2xl font-bold">⚡{bestCombo}</div>
                </div>
                <div className="col-span-2 bg-white/10 rounded-lg p-3">
                  <div className="text-[10px] text-white/50">Skor Tertinggi</div>
                  <div className="text-cyan-300 text-2xl font-bold">{Math.max(score, highScore)}</div>
                </div>
              </div>
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-full bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-900 font-display font-bold text-sm shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> MAIN LAGI
              </button>
            </div>
          )}
        </div>

        {/* Hint */}
        {phase === "playing" && (
          <div className="mt-3 text-center text-white/55 text-[11px] font-body flex items-center justify-center gap-1">
            <Zap className="w-3 h-3 text-amber-300" /> Tap alien dengan jawaban benar — hindari salah tembak!
          </div>
        )}

        {/* Bottom nav */}
        <div className="mt-5 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/ruang-untuk-guru/numatik-game"); }}
            className="inline-flex items-center gap-2 text-xs text-white/55 hover:text-fuchsia-300 transition-colors font-body"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Numatik Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalaxyDefenderPage;
