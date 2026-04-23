import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { ArrowLeft, RotateCcw, Trophy, Heart, Coins, Gamepad2 } from "lucide-react";

type Phase = "idle" | "playing" | "gameover" | "win";

interface MQ { q: string; ans: number; }

interface Player {
  x: number; y: number; vx: number; vy: number;
  w: number; h: number;
  onGround: boolean;
  facing: 1 | -1;
  invuln: number; // frames of invulnerability
  walkAnim: number;
}

interface Platform { x: number; y: number; w: number; h: number; type: "ground" | "block" | "brick"; }
interface Coin { x: number; y: number; value: number; collected: boolean; bob: number; }
interface Goomba { x: number; y: number; vx: number; w: number; h: number; alive: boolean; squashFrame: number; }
interface Pipe { x: number; y: number; w: number; h: number; }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; }
interface Floater { x: number; y: number; text: string; life: number; color: string; }

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

const makeQ = (level: number): MQ => {
  const t = Math.floor(Math.random() * (level >= 3 ? 6 : 4));
  switch (t) {
    case 0: { const a = 3 + Math.floor(Math.random() * (8 + level * 3)); const b = 2 + Math.floor(Math.random() * (5 + level * 2)); return { q: `${a} × ${b}`, ans: a * b }; }
    case 1: { const a = 10 + Math.floor(Math.random() * (30 + level * 15)); const b = 8 + Math.floor(Math.random() * (25 + level * 10)); return { q: `${a} + ${b}`, ans: a + b }; }
    case 2: { const b = 5 + Math.floor(Math.random() * (15 + level * 6)); const a = b + 5 + Math.floor(Math.random() * (20 + level * 8)); return { q: `${a} − ${b}`, ans: a - b }; }
    case 3: { const b = 2 + Math.floor(Math.random() * (4 + level)); const k = 2 + Math.floor(Math.random() * (6 + level)); return { q: `${b * k} ÷ ${b}`, ans: k }; }
    case 4: { const sqs = [4, 9, 16, 25, 36, 49, 64, 81, 100]; const sq = sqs[Math.floor(Math.random() * sqs.length)]; return { q: `√${sq}`, ans: Math.round(Math.sqrt(sq)) }; }
    default: { const a = 2 + Math.floor(Math.random() * 9); const b = 2 + Math.floor(Math.random() * 9); return { q: `KPK(${a},${b})`, ans: (a * b) / gcd(a, b) }; }
  }
};

const makeWrong = (ans: number, used: Set<number>): number => {
  let v = 0; let tries = 0;
  do {
    const d = 1 + Math.floor(Math.random() * Math.max(3, Math.floor(ans * 0.25)));
    v = ans + (Math.random() < 0.5 ? d : -d);
    tries++;
  } while ((used.has(v) || v < 0) && tries < 80);
  return v < 0 ? ans + 1 + Math.floor(Math.random() * 10) : v;
};

const TILE = 32;
const GRAVITY = 0.7;
const JUMP_V = -12.5;
const MOVE_ACC = 0.6;
const MAX_VX = 4.2;
const FRICTION = 0.82;

interface World {
  width: number;
  ground: Platform[];
  blocks: Platform[];
  coins: Coin[];
  goombas: Goomba[];
  pipes: Pipe[];
  flagX: number;
}

// Build a level with platforms, gaps, blocks, coins, goombas
const buildWorld = (level: number, currentQ: MQ): World => {
  const W = 3200; // total level width in px
  const groundY = 14 * TILE; // arena height ~ 16 TILE → ground at 14*TILE
  const ground: Platform[] = [];
  const blocks: Platform[] = [];
  const coins: Coin[] = [];
  const goombas: Goomba[] = [];
  const pipes: Pipe[] = [];

  // Ground segments with gaps
  const gaps: Array<[number, number]> = [
    [9 * TILE, 11 * TILE],
    [22 * TILE, 24 * TILE],
    [40 * TILE, 42 * TILE],
    [58 * TILE, 60 * TILE],
    [74 * TILE, 76 * TILE],
  ];
  let cursor = 0;
  for (const [gs, ge] of gaps) {
    if (gs > cursor) ground.push({ x: cursor, y: groundY, w: gs - cursor, h: 2 * TILE, type: "ground" });
    cursor = ge;
  }
  if (cursor < W) ground.push({ x: cursor, y: groundY, w: W - cursor, h: 2 * TILE, type: "ground" });

  // Floating brick rows
  const brickRows = [
    { x: 5 * TILE, y: 9 * TILE, count: 3 },
    { x: 14 * TILE, y: 7 * TILE, count: 4 },
    { x: 28 * TILE, y: 9 * TILE, count: 3 },
    { x: 36 * TILE, y: 6 * TILE, count: 5 },
    { x: 50 * TILE, y: 9 * TILE, count: 4 },
    { x: 64 * TILE, y: 7 * TILE, count: 3 },
    { x: 80 * TILE, y: 9 * TILE, count: 4 },
  ];
  for (const br of brickRows) {
    for (let i = 0; i < br.count; i++) {
      blocks.push({ x: br.x + i * TILE, y: br.y, w: TILE, h: TILE, type: i === Math.floor(br.count / 2) ? "block" : "brick" });
    }
  }

  // Pipes
  pipes.push({ x: 18 * TILE, y: groundY - 2 * TILE, w: 2 * TILE, h: 2 * TILE });
  pipes.push({ x: 46 * TILE, y: groundY - 3 * TILE, w: 2 * TILE, h: 3 * TILE });
  pipes.push({ x: 70 * TILE, y: groundY - 2 * TILE, w: 2 * TILE, h: 2 * TILE });

  // Goombas walking back and forth on ground stretches
  const goombaSpots = [
    7 * TILE, 13 * TILE, 26 * TILE, 32 * TILE, 44 * TILE, 53 * TILE, 62 * TILE, 78 * TILE, 88 * TILE,
  ];
  for (const gx of goombaSpots) {
    goombas.push({ x: gx, y: groundY - TILE, vx: -1.0 - Math.random() * 0.5, w: TILE, h: TILE, alive: true, squashFrame: 0 });
  }

  // Coins: place 1 correct + 2-3 wrong values around the level
  const used = new Set<number>([currentQ.ans]);
  const coinSpots: Array<{ x: number; y: number; value: number }> = [];
  // Spread spots (avoid gaps)
  const placeXs = [4 * TILE, 12 * TILE, 16 * TILE, 25 * TILE, 30 * TILE, 38 * TILE, 47 * TILE, 55 * TILE, 65 * TILE, 78 * TILE, 86 * TILE];
  // Filter to valid x positions (not in gaps)
  const validXs = placeXs.filter((x) => !gaps.some(([gs, ge]) => x > gs - TILE && x < ge + TILE));
  // shuffle
  validXs.sort(() => Math.random() - 0.5);
  // Place correct answer
  if (validXs.length > 0) {
    const cx = validXs.shift()!;
    coinSpots.push({ x: cx, y: groundY - 3 * TILE - Math.floor(Math.random() * 3) * TILE, value: currentQ.ans });
  }
  // Place wrong answers
  const wrongCount = Math.min(validXs.length, 3 + Math.floor(level / 2));
  for (let i = 0; i < wrongCount; i++) {
    const w = makeWrong(currentQ.ans, used);
    used.add(w);
    const cx = validXs.shift()!;
    coinSpots.push({ x: cx, y: groundY - 3 * TILE - Math.floor(Math.random() * 3) * TILE, value: w });
  }
  for (const cs of coinSpots) {
    coins.push({ x: cs.x + TILE / 2, y: cs.y, value: cs.value, collected: false, bob: Math.random() * Math.PI * 2 });
  }

  return { width: W, ground, blocks, coins, goombas, pipes, flagX: W - 4 * TILE };
};

const MathBrosPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem("math-bros-highscore") || 0));
  const [question, setQuestion] = useState<MQ>(() => makeQ(1));

  // refs
  const phaseRef = useRef<Phase>(phase);
  const playerRef = useRef<Player>({ x: 64, y: 0, vx: 0, vy: 0, w: TILE - 4, h: TILE * 1.4, onGround: false, facing: 1, invuln: 0, walkAnim: 0 });
  const cameraRef = useRef<number>(0);
  const worldRef = useRef<World>(buildWorld(1, question));
  const questionRef = useRef<MQ>(question);
  const levelRef = useRef<number>(level);
  const livesRef = useRef<number>(lives);
  const keysRef = useRef<{ left: boolean; right: boolean; jump: boolean; jumpHeld: boolean }>({ left: false, right: false, jump: false, jumpHeld: false });
  const particlesRef = useRef<Particle[]>([]);
  const floatersRef = useRef<Floater[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { questionRef.current = question; }, [question]);
  useEffect(() => { levelRef.current = level; }, [level]);
  useEffect(() => { livesRef.current = lives; }, [lives]);

  const newQuestion = useCallback((lv: number) => {
    const q = makeQ(lv);
    setQuestion(q);
    questionRef.current = q;
    return q;
  }, []);

  const respawn = (q: MQ, lv: number) => {
    worldRef.current = buildWorld(lv, q);
    playerRef.current = { x: 64, y: worldRef.current.ground[0].y - TILE * 1.5, vx: 0, vy: 0, w: TILE - 4, h: TILE * 1.4, onGround: false, facing: 1, invuln: 60, walkAnim: 0 };
    cameraRef.current = 0;
  };

  const startGame = () => {
    playPopSound();
    setScore(0);
    setCoinsCollected(0);
    setLives(3);
    setLevel(1);
    const q = newQuestion(1);
    respawn(q, 1);
    setPhase("playing");
  };

  const spawnParticles = (x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 1 + Math.random() * 3;
      particlesRef.current.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1,
        life: 0, max: 24 + Math.random() * 16, color,
      });
    }
  };

  const addFloater = (x: number, y: number, text: string, color: string) => {
    floatersRef.current.push({ x, y, text, life: 0, color });
  };

  // Input
  useEffect(() => {
    const onKD = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") keysRef.current.left = true;
      if (e.key === "ArrowRight" || e.key === "d") keysRef.current.right = true;
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
        if (!keysRef.current.jumpHeld) keysRef.current.jump = true;
        keysRef.current.jumpHeld = true;
        e.preventDefault();
      }
    };
    const onKU = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") keysRef.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d") keysRef.current.right = false;
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") keysRef.current.jumpHeld = false;
    };
    window.addEventListener("keydown", onKD);
    window.addEventListener("keyup", onKU);
    return () => {
      window.removeEventListener("keydown", onKD);
      window.removeEventListener("keyup", onKU);
    };
  }, []);

  // Touch button helpers
  const setKey = (k: "left" | "right", v: boolean) => {
    keysRef.current[k] = v;
  };
  const triggerJump = () => {
    if (!keysRef.current.jumpHeld) keysRef.current.jump = true;
    keysRef.current.jumpHeld = true;
  };
  const releaseJump = () => { keysRef.current.jumpHeld = false; };

  // Main loop
  useEffect(() => {
    if (phase !== "playing") return;
    const c = canvasRef.current;
    const cont = containerRef.current;
    if (!c || !cont) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let lastT = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(40, now - lastT);
      lastT = now;
      const factor = dt / 16.6;

      // Resize canvas to container
      const rect = cont.getBoundingClientRect();
      if (c.width !== Math.floor(rect.width) || c.height !== Math.floor(rect.height)) {
        c.width = Math.floor(rect.width);
        c.height = Math.floor(rect.height);
      }

      const VIEW_W = c.width;
      const VIEW_H = c.height;
      const world = worldRef.current;
      const player = playerRef.current;

      // === Update player physics ===
      // Horizontal input
      if (keysRef.current.left) { player.vx -= MOVE_ACC * factor; player.facing = -1; }
      if (keysRef.current.right) { player.vx += MOVE_ACC * factor; player.facing = 1; }
      if (!keysRef.current.left && !keysRef.current.right) {
        player.vx *= Math.pow(FRICTION, factor);
        if (Math.abs(player.vx) < 0.1) player.vx = 0;
      }
      player.vx = Math.max(-MAX_VX, Math.min(MAX_VX, player.vx));

      // Jump
      if (keysRef.current.jump && player.onGround) {
        player.vy = JUMP_V;
        player.onGround = false;
        playPopSound();
      }
      keysRef.current.jump = false;

      // Variable jump (if jump released early & still going up)
      if (!keysRef.current.jumpHeld && player.vy < -4) {
        player.vy *= 0.85;
      }

      // Gravity
      player.vy += GRAVITY * factor;
      if (player.vy > 14) player.vy = 14;

      // Move X & resolve collisions
      player.x += player.vx * factor;
      const allSolid = [...world.ground, ...world.blocks, ...world.pipes.map((p) => ({ ...p, type: "block" as const }))];
      for (const s of allSolid) {
        if (player.x + player.w / 2 > s.x && player.x - player.w / 2 < s.x + s.w &&
            player.y + player.h / 2 > s.y && player.y - player.h / 2 < s.y + s.h) {
          if (player.vx > 0) player.x = s.x - player.w / 2;
          else if (player.vx < 0) player.x = s.x + s.w + player.w / 2;
          player.vx = 0;
        }
      }
      // Move Y & resolve
      player.y += player.vy * factor;
      player.onGround = false;
      for (const s of allSolid) {
        if (player.x + player.w / 2 > s.x && player.x - player.w / 2 < s.x + s.w &&
            player.y + player.h / 2 > s.y && player.y - player.h / 2 < s.y + s.h) {
          if (player.vy > 0) {
            player.y = s.y - player.h / 2;
            player.vy = 0;
            player.onGround = true;
          } else if (player.vy < 0) {
            player.y = s.y + s.h + player.h / 2;
            player.vy = 0;
          }
        }
      }

      // Walk anim
      if (Math.abs(player.vx) > 0.5 && player.onGround) player.walkAnim += factor * 0.3;

      if (player.invuln > 0) player.invuln -= factor;

      // Boundaries
      if (player.x - player.w / 2 < 0) { player.x = player.w / 2; player.vx = 0; }
      if (player.x + player.w / 2 > world.width) { player.x = world.width - player.w / 2; player.vx = 0; }

      // Fall off screen → lose life
      if (player.y > VIEW_H + 200) {
        loseLife();
      }

      // Camera follows
      cameraRef.current = Math.max(0, Math.min(world.width - VIEW_W, player.x - VIEW_W * 0.4));

      // === Update goombas ===
      for (const g of world.goombas) {
        if (!g.alive) {
          g.squashFrame += factor;
          continue;
        }
        g.x += g.vx * factor;
        // Goomba on ground? Find ground segment under
        let gOnGround = false;
        for (const gr of world.ground) {
          if (g.x + g.w / 2 > gr.x && g.x + g.w / 2 < gr.x + gr.w && Math.abs(g.y + g.h - gr.y) < 4) {
            gOnGround = true; break;
          }
        }
        if (!gOnGround) g.vx = -g.vx; // turn around at edge
        // Bump pipes
        for (const p of world.pipes) {
          if (g.x + g.w > p.x && g.x < p.x + p.w && g.y + g.h > p.y && g.y < p.y + p.h) {
            g.vx = -g.vx;
            if (g.vx > 0) g.x = p.x + p.w + 1; else g.x = p.x - g.w - 1;
          }
        }
        // Bounds
        if (g.x < 0) { g.x = 0; g.vx = -g.vx; }
        if (g.x > world.width - g.w) { g.x = world.width - g.w; g.vx = -g.vx; }

        // Player collision
        if (player.invuln <= 0 &&
            player.x + player.w / 2 > g.x && player.x - player.w / 2 < g.x + g.w &&
            player.y + player.h / 2 > g.y && player.y - player.h / 2 < g.y + g.h) {
          // Stomped from above?
          if (player.vy > 0 && (player.y + player.h / 2) - (player.vy * factor) <= g.y + 6) {
            g.alive = false;
            g.squashFrame = 0;
            player.vy = JUMP_V * 0.7;
            playPopSound();
            spawnParticles(g.x + g.w / 2, g.y, "#92400e", 14);
            setScore((s) => s + 50);
            addFloater(g.x + g.w / 2, g.y, "+50", "#fbbf24");
          } else {
            // Hit from side → lose life
            loseLife();
          }
        }
      }

      // === Coins ===
      for (const coin of world.coins) {
        if (coin.collected) continue;
        coin.bob += factor * 0.15;
        if (player.x + player.w / 2 > coin.x - 14 && player.x - player.w / 2 < coin.x + 14 &&
            player.y + player.h / 2 > coin.y - 16 && player.y - player.h / 2 < coin.y + 16) {
          coin.collected = true;
          const isCorrect = coin.value === questionRef.current.ans;
          if (isCorrect) {
            setScore((s) => s + 200);
            setCoinsCollected((cc) => cc + 1);
            addFloater(coin.x, coin.y, "+200", "#22c55e");
            spawnParticles(coin.x, coin.y, "#fde047", 22);
            spawnParticles(coin.x, coin.y, "#22c55e", 10);
            playPopSound();
            // New question
            const lv = levelRef.current;
            const q = newQuestion(lv);
            // Respawn coins only (regen with new question), keep player position
            const px = player.x, py = player.y;
            const nw = buildWorld(lv, q);
            // Filter out coins that are behind player (already passed)
            nw.coins = nw.coins.filter((nc) => nc.x > px - TILE * 2);
            // Keep existing goombas state (don't reset)
            nw.goombas = world.goombas.map((g) => ({ ...g }));
            worldRef.current = nw;
            // Restore world width / pipes / ground are deterministic same
          } else {
            // Wrong answer
            addFloater(coin.x, coin.y, "−1 ❤", "#ef4444");
            spawnParticles(coin.x, coin.y, "#ef4444", 16);
            loseLife();
          }
        }
      }

      // === Reach flag ===
      if (player.x >= world.flagX) {
        // Win level → next level
        const newLv = levelRef.current + 1;
        if (newLv > 5) {
          // Final win
          setPhase("win");
        } else {
          setLevel(newLv);
          setScore((s) => s + 500);
          addFloater(player.x, player.y - 30, "LEVEL CLEAR! +500", "#fde047");
          const q = newQuestion(newLv);
          respawn(q, newLv);
        }
      }

      // === Render ===
      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
      skyGrad.addColorStop(0, "#1e3a8a");
      skyGrad.addColorStop(0.6, "#3b82f6");
      skyGrad.addColorStop(1, "#93c5fd");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);

      // Distant clouds (parallax slower)
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      const cloudOff = -cameraRef.current * 0.25;
      for (let i = 0; i < 8; i++) {
        const cx = (i * 380 + cloudOff) % (VIEW_W + 380);
        const cy = 30 + (i % 3) * 24;
        drawCloud(ctx, cx, cy);
      }

      // Distant hills (parallax)
      ctx.fillStyle = "#1e7a55";
      const hillOff = -cameraRef.current * 0.5;
      for (let i = 0; i < 10; i++) {
        const hx = (i * 220 + hillOff) % (VIEW_W + 440) - 220;
        ctx.beginPath();
        ctx.ellipse(hx + 110, VIEW_H - 90, 140, 70, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      ctx.translate(-cameraRef.current, 0);

      // Ground
      for (const g of world.ground) {
        // soil
        ctx.fillStyle = "#7c2d12";
        ctx.fillRect(g.x, g.y, g.w, g.h);
        // grass top
        ctx.fillStyle = "#16a34a";
        ctx.fillRect(g.x, g.y, g.w, 8);
        ctx.fillStyle = "#15803d";
        ctx.fillRect(g.x, g.y + 8, g.w, 4);
        // dirt texture
        ctx.fillStyle = "rgba(0,0,0,0.18)";
        for (let dx = 0; dx < g.w; dx += 16) {
          ctx.fillRect(g.x + dx + 4, g.y + 16, 2, 2);
          ctx.fillRect(g.x + dx + 10, g.y + 28, 2, 2);
        }
      }

      // Pipes
      for (const p of world.pipes) {
        // Body
        ctx.fillStyle = "#16a34a";
        ctx.fillRect(p.x + 4, p.y + 12, p.w - 8, p.h - 12);
        ctx.fillStyle = "#15803d";
        ctx.fillRect(p.x + 4, p.y + 12, 4, p.h - 12);
        // Top cap
        ctx.fillStyle = "#22c55e";
        ctx.fillRect(p.x, p.y, p.w, 14);
        ctx.strokeStyle = "#064e3b";
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, p.y, p.w, 14);
        ctx.strokeRect(p.x + 4, p.y + 12, p.w - 8, p.h - 12);
      }

      // Blocks/bricks
      for (const b of world.blocks) {
        if (b.type === "block") {
          // Question block (golden)
          ctx.fillStyle = "#facc15";
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.strokeStyle = "#92400e";
          ctx.lineWidth = 2;
          ctx.strokeRect(b.x, b.y, b.w, b.h);
          ctx.fillStyle = "#92400e";
          ctx.font = "bold 18px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("?", b.x + b.w / 2, b.y + b.h / 2);
        } else {
          // Brick
          ctx.fillStyle = "#b45309";
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.strokeStyle = "#78350f";
          ctx.lineWidth = 1;
          for (let r = 0; r < 2; r++) {
            for (let cIdx = 0; cIdx < 2; cIdx++) {
              const offX = r % 2 === 0 ? 0 : TILE / 2;
              ctx.strokeRect(b.x - offX + cIdx * (TILE / 2), b.y + r * (TILE / 2), TILE / 2, TILE / 2);
            }
          }
        }
      }

      // Coins
      for (const coin of world.coins) {
        if (coin.collected) continue;
        const yOff = Math.sin(coin.bob) * 4;
        // Glow
        ctx.fillStyle = "rgba(253, 224, 71, 0.35)";
        ctx.beginPath();
        ctx.arc(coin.x, coin.y + yOff, 18, 0, Math.PI * 2);
        ctx.fill();
        // Coin body
        ctx.fillStyle = "#fde047";
        ctx.beginPath();
        ctx.arc(coin.x, coin.y + yOff, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#a16207";
        ctx.beginPath();
        ctx.arc(coin.x, coin.y + yOff, 10, 0, Math.PI * 2);
        ctx.fill();
        // Number
        ctx.fillStyle = "#fef9c3";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(coin.value), coin.x, coin.y + yOff + 1);
      }

      // Goombas
      for (const g of world.goombas) {
        if (!g.alive) {
          if (g.squashFrame < 16) {
            ctx.fillStyle = "#92400e";
            ctx.fillRect(g.x, g.y + g.h - 8, g.w, 8);
          }
          continue;
        }
        // Body
        ctx.fillStyle = "#92400e";
        ctx.beginPath();
        ctx.ellipse(g.x + g.w / 2, g.y + g.h * 0.55, g.w * 0.45, g.h * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        // Head shading
        ctx.fillStyle = "#7c2d12";
        ctx.beginPath();
        ctx.ellipse(g.x + g.w / 2, g.y + g.h * 0.35, g.w * 0.45, g.h * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        // Eyes
        ctx.fillStyle = "#fff";
        ctx.fillRect(g.x + 6, g.y + 8, 6, 8);
        ctx.fillRect(g.x + g.w - 12, g.y + 8, 6, 8);
        ctx.fillStyle = "#000";
        ctx.fillRect(g.x + 8 + (g.vx > 0 ? 2 : 0), g.y + 11, 3, 4);
        ctx.fillRect(g.x + g.w - 10 + (g.vx > 0 ? 2 : 0), g.y + 11, 3, 4);
        // Feet
        ctx.fillStyle = "#1c1917";
        const footStep = Math.floor(now / 200) % 2;
        ctx.fillRect(g.x + 2, g.y + g.h - 4, 8 + (footStep * 2), 4);
        ctx.fillRect(g.x + g.w - 10 - (footStep * 2), g.y + g.h - 4, 8 + (footStep * 2), 4);
      }

      // Player (Math Bro)
      drawPlayer(ctx, player, now);

      // Flag at end
      const fx = world.flagX;
      const fy = (world.ground[0]?.y ?? VIEW_H - 80);
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(fx, fy - 7 * TILE, 4, 7 * TILE);
      // Pennant
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.moveTo(fx + 4, fy - 7 * TILE);
      ctx.lineTo(fx + 4 + 36, fy - 7 * TILE + 14);
      ctx.lineTo(fx + 4, fy - 7 * TILE + 28);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("⭐", fx + 4 + 18, fy - 7 * TILE + 18);
      // Base
      ctx.fillStyle = "#facc15";
      ctx.fillRect(fx - 12, fy - 4, 28, 4);

      // Particles
      const ps = particlesRef.current;
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.life += factor;
        p.x += p.vx * factor;
        p.y += p.vy * factor;
        p.vy += 0.25 * factor;
        if (p.life >= p.max) { ps.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - p.life / p.max);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        ctx.restore();
      }

      // Floaters
      const fs = floatersRef.current;
      for (let i = fs.length - 1; i >= 0; i--) {
        const f = fs[i];
        f.life += factor;
        f.y -= 0.6 * factor;
        if (f.life >= 50) { fs.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - f.life / 50);
        ctx.fillStyle = f.color;
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "rgba(0,0,0,0.7)";
        ctx.lineWidth = 3;
        ctx.strokeText(f.text, f.x, f.y);
        ctx.fillText(f.text, f.x, f.y);
        ctx.restore();
      }

      ctx.restore(); // camera

      rafRef.current = requestAnimationFrame(tick);
    };

    function loseLife() {
      if (playerRef.current.invuln > 0) return;
      const newLv = livesRef.current - 1;
      setLives(newLv);
      if (newLv <= 0) {
        setPhase("gameover");
        return;
      }
      // Respawn at start
      const w = worldRef.current;
      const player = playerRef.current;
      player.x = 64;
      player.y = w.ground[0].y - TILE * 1.5;
      player.vx = 0; player.vy = 0;
      player.invuln = 90;
      cameraRef.current = 0;
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, newQuestion]);

  // Save high score
  useEffect(() => {
    if (phase === "gameover" || phase === "win") {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("math-bros-highscore", String(score));
      }
    }
  }, [phase, score, highScore]);

  return (
    <div className="relative min-h-screen gradient-space overflow-hidden text-white">
      <Starfield />
      <PageNavigation prevPath="/ruang-untuk-guru/numatik-game" />

      <div className="relative z-10 max-w-3xl mx-auto px-3 pt-20 pb-12">
        {/* Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-300/40 bg-rose-500/10 px-3 py-1 text-[10px] font-semibold text-rose-100 mb-2">
            <Gamepad2 className="w-3 h-3" /> Platformer Math
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-rose-300 leading-tight" style={{ textShadow: "0 0 20px rgba(244,63,94,0.6)" }}>
            MATH BROS — PETUALANGAN ANGKA
          </h1>
          <p className="text-white/55 text-[11px] mt-1 font-body">
            Lompati musuh & ambil koin dengan <span className="text-emerald-300 font-semibold">jawaban benar</span>!
          </p>
        </div>

        {/* HUD */}
        <div className="grid grid-cols-5 gap-2 mb-3 text-center">
          <div className="bg-black/40 border border-white/10 rounded-lg py-1.5">
            <div className="text-[9px] text-white/50 uppercase">Skor</div>
            <div className="text-rose-300 font-bold text-sm">{score}</div>
          </div>
          <div className="bg-black/40 border border-white/10 rounded-lg py-1.5">
            <div className="text-[9px] text-white/50 uppercase">Koin</div>
            <div className="text-amber-300 font-bold text-sm flex items-center justify-center gap-1"><Coins className="w-3 h-3" />{coinsCollected}</div>
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
            <div className="text-cyan-300 font-bold text-sm">{level}/5</div>
          </div>
          <div className="bg-black/40 border border-white/10 rounded-lg py-1.5">
            <div className="text-[9px] text-white/50 uppercase">Best</div>
            <div className="text-fuchsia-300 font-bold text-sm">{Math.max(score, highScore)}</div>
          </div>
        </div>

        {/* Question banner */}
        {phase === "playing" && (
          <div className="mb-2 mx-auto bg-gradient-to-r from-rose-900/60 via-amber-900/60 to-rose-900/60 border border-rose-300/40 rounded-xl px-4 py-2 text-center backdrop-blur">
            <div className="text-[9px] uppercase tracking-widest text-rose-200/70 mb-0.5">Ambil Koin dengan Jawaban</div>
            <div className="font-display text-2xl font-black text-white">
              {question.q} <span className="text-amber-300">= ?</span>
            </div>
          </div>
        )}

        {/* Game arena */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden rounded-2xl border-2 border-white/20 select-none"
          style={{ aspectRatio: "16 / 10", touchAction: "none" }}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Idle */}
          {phase === "idle" && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur flex flex-col items-center justify-center px-6 text-center">
              <Gamepad2 className="w-12 h-12 text-rose-300 mb-3" />
              <h2 className="font-display text-xl font-bold text-rose-200 mb-2">Petualangan Math Bros!</h2>
              <p className="text-white/70 text-xs mb-4 leading-relaxed max-w-md">
                Lompati musuh Goomba (atau injak dari atas), hindari jurang,
                dan <strong className="text-amber-300">ambil koin dengan angka jawaban benar</strong>!
                Capai bendera ⭐ di akhir level untuk lanjut ke level berikutnya.
              </p>
              <ul className="text-white/60 text-[11px] mb-4 space-y-0.5">
                <li>⌨️ ◀ ▶ untuk gerak, SPASI / ▲ untuk lompat</li>
                <li>📱 Tombol di bawah arena untuk layar sentuh</li>
                <li>🪙 Koin benar = +200, Koin salah = nyawa berkurang</li>
                <li>🟫 Injak Goomba = +50 poin</li>
                <li>🏁 5 level untuk menaklukkan!</li>
              </ul>
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-400 text-white font-display font-bold text-sm shadow-lg transition-transform hover:scale-105"
              >
                MULAI PETUALANGAN
              </button>
            </div>
          )}

          {/* Game over */}
          {phase === "gameover" && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur flex flex-col items-center justify-center px-6 text-center">
              <Trophy className="w-12 h-12 text-amber-300 mb-3" />
              <h2 className="font-display text-2xl font-bold text-amber-200 mb-1">Game Over!</h2>
              <p className="text-white/70 text-xs mb-4">Jangan menyerah — coba lagi, Math Bro!</p>
              <div className="grid grid-cols-2 gap-3 mb-5 w-full max-w-xs">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-[10px] text-white/50">Skor Akhir</div>
                  <div className="text-rose-300 text-2xl font-bold">{score}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-[10px] text-white/50">Koin</div>
                  <div className="text-amber-300 text-2xl font-bold">{coinsCollected}</div>
                </div>
                <div className="col-span-2 bg-white/10 rounded-lg p-3">
                  <div className="text-[10px] text-white/50">Skor Tertinggi</div>
                  <div className="text-cyan-300 text-2xl font-bold">{Math.max(score, highScore)}</div>
                </div>
              </div>
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-400 text-white font-display font-bold text-sm shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> COBA LAGI
              </button>
            </div>
          )}

          {/* Win */}
          {phase === "win" && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur flex flex-col items-center justify-center px-6 text-center">
              <Trophy className="w-14 h-14 text-amber-300 mb-3" />
              <h2 className="font-display text-3xl font-bold text-amber-200 mb-2">🎉 KAMU JUARA! 🎉</h2>
              <p className="text-white/80 text-sm mb-4">Semua 5 level berhasil ditaklukkan!</p>
              <div className="grid grid-cols-2 gap-3 mb-5 w-full max-w-xs">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-[10px] text-white/50">Skor Akhir</div>
                  <div className="text-rose-300 text-2xl font-bold">{score}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-[10px] text-white/50">Koin Terkumpul</div>
                  <div className="text-amber-300 text-2xl font-bold">{coinsCollected}</div>
                </div>
              </div>
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-400 text-white font-display font-bold text-sm shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> MAIN LAGI
              </button>
            </div>
          )}
        </div>

        {/* Touch controls */}
        {phase === "playing" && (
          <div className="mt-3 flex justify-between items-center gap-3">
            <div className="flex gap-2">
              <button
                onPointerDown={(e) => { e.preventDefault(); setKey("left", true); }}
                onPointerUp={() => setKey("left", false)}
                onPointerLeave={() => setKey("left", false)}
                className="w-14 h-14 rounded-full bg-rose-500/80 active:bg-rose-400 border-2 border-white/30 text-white text-2xl font-black shadow-lg select-none touch-none"
              >
                ◀
              </button>
              <button
                onPointerDown={(e) => { e.preventDefault(); setKey("right", true); }}
                onPointerUp={() => setKey("right", false)}
                onPointerLeave={() => setKey("right", false)}
                className="w-14 h-14 rounded-full bg-rose-500/80 active:bg-rose-400 border-2 border-white/30 text-white text-2xl font-black shadow-lg select-none touch-none"
              >
                ▶
              </button>
            </div>
            <button
              onPointerDown={(e) => { e.preventDefault(); triggerJump(); }}
              onPointerUp={releaseJump}
              onPointerLeave={releaseJump}
              className="px-6 h-14 rounded-full bg-amber-500/90 active:bg-amber-400 border-2 border-white/30 text-white text-base font-display font-black shadow-lg select-none touch-none"
            >
              LOMPAT ⤴
            </button>
          </div>
        )}

        {/* Bottom nav */}
        <div className="mt-5 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/ruang-untuk-guru/numatik-game"); }}
            className="inline-flex items-center gap-2 text-xs text-white/55 hover:text-rose-300 transition-colors font-body"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Numatik Game
          </button>
        </div>
      </div>
    </div>
  );
};

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath();
  ctx.arc(x, y, 18, 0, Math.PI * 2);
  ctx.arc(x + 18, y - 6, 22, 0, Math.PI * 2);
  ctx.arc(x + 38, y, 18, 0, Math.PI * 2);
  ctx.arc(x + 18, y + 8, 16, 0, Math.PI * 2);
  ctx.fill();
}

function drawPlayer(ctx: CanvasRenderingContext2D, p: Player, now: number) {
  const blink = p.invuln > 0 && Math.floor(now / 80) % 2 === 0;
  if (blink) return;
  const x = p.x - p.w / 2;
  const y = p.y - p.h / 2;
  const w = p.w;
  const h = p.h;
  // Hat (red cap)
  ctx.fillStyle = "#dc2626";
  ctx.fillRect(x, y, w, h * 0.18);
  ctx.fillRect(x - 3, y + h * 0.1, w + 6, h * 0.08);
  // Hat emblem
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h * 0.09, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#dc2626";
  ctx.font = "bold 7px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("M", x + w / 2, y + h * 0.09 + 1);
  // Face
  ctx.fillStyle = "#fde7c7";
  ctx.fillRect(x + 2, y + h * 0.18, w - 4, h * 0.22);
  // Eye
  ctx.fillStyle = "#000";
  ctx.fillRect(x + (p.facing === 1 ? w - 8 : 4), y + h * 0.24, 3, 4);
  // Mustache
  ctx.fillStyle = "#3b1d0f";
  ctx.fillRect(x + 3, y + h * 0.34, w - 6, 3);
  // Body (overalls blue)
  ctx.fillStyle = "#1d4ed8";
  ctx.fillRect(x, y + h * 0.4, w, h * 0.4);
  // Shirt straps (red)
  ctx.fillStyle = "#dc2626";
  ctx.fillRect(x + 2, y + h * 0.4, 3, h * 0.4);
  ctx.fillRect(x + w - 5, y + h * 0.4, 3, h * 0.4);
  // Buttons
  ctx.fillStyle = "#fde047";
  ctx.fillRect(x + 5, y + h * 0.5, 3, 3);
  ctx.fillRect(x + w - 8, y + h * 0.5, 3, 3);
  // Legs (animated)
  ctx.fillStyle = "#7c2d12";
  const swing = p.onGround ? Math.sin(p.walkAnim) * 3 : 0;
  ctx.fillRect(x + 2, y + h * 0.8, w / 2 - 3, h * 0.2);
  ctx.fillRect(x + w / 2 + 1, y + h * 0.8, w / 2 - 3, h * 0.2);
  // Shoes
  ctx.fillStyle = "#1c1917";
  ctx.fillRect(x - 2, y + h - 4 + swing, w / 2 + 1, 4);
  ctx.fillRect(x + w / 2 + 1, y + h - 4 - swing, w / 2 + 1, 4);
}

export default MathBrosPage;
