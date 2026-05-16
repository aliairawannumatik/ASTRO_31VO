import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";

// ── Layout ────────────────────────────────────────────────────────────────
const COLS = 21;
const ROWS = 21;
const CELL = 26;
const CW = 560;
const OX = Math.round((CW - COLS * CELL) / 2); // = (560 - 546) / 2 = 7
const OY = 30;
const CH = OY + ROWS * CELL + 10; // = 30 + 546 + 10 = 586
const TUNNEL_ROW = 10;

// ── Speed ─────────────────────────────────────────────────────────────────
const PAC_BASE = 0.16;   // progress units per frame
const GHOST_BASE = 0.10;
const FRIGHT_DUR = 300;  // frames ghost stays frightened

// ── Maze (21×21): 0=dot 1=wall 2=power 3=empty 4=ghost-zone ──────────────
const BASE_MAZE: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // 0
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1], // 1
  [1,0,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1], // 2
  [1,2,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,2,1], // 3 ← power pellets
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 4
  [1,0,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,0,1], // 5
  [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1], // 6
  [1,1,1,1,0,1,1,1,3,1,1,1,3,1,1,1,0,1,1,1,1], // 7
  [1,1,1,1,0,3,3,3,3,3,3,3,3,3,3,3,0,1,1,1,1], // 8 ghost corridor
  [1,1,1,1,0,1,3,1,3,3,3,3,3,1,3,1,0,1,1,1,1], // 9
  [3,3,3,3,0,3,3,1,3,3,3,3,3,1,3,3,0,3,3,3,3], // 10 TUNNEL
  [1,1,1,1,0,1,3,1,3,3,3,3,3,1,3,1,0,1,1,1,1], // 11
  [1,1,1,1,0,1,3,3,3,3,3,3,3,3,3,1,0,1,1,1,1], // 12
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1], // 13
  [1,0,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1], // 14
  [1,2,0,1,0,0,0,0,0,0,3,0,0,0,0,0,0,1,0,2,1], // 15 ← power pellets
  [1,1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,1], // 16
  [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1], // 17
  [1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,0,1], // 18
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // 19
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // 20
];

// Power-pellet positions and their answer-option index (0-3)
const POWER_SPOTS: [number, number, number][] = [
  [3, 1, 0], [3, 19, 1], [15, 1, 2], [15, 19, 3],
];

// ── Math questions ────────────────────────────────────────────────────────
interface MQ { q: string; ans: number }
function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }
const makeQ = (): MQ => {
  const t = Math.floor(Math.random() * 8);
  switch (t) {
    case 0: { const a = 2 + Math.floor(Math.random() * 9), b = 2 + Math.floor(Math.random() * 9); return { q: `${a} × ${b}`, ans: a * b }; }
    case 1: { const a = 10 + Math.floor(Math.random() * 70), b = 10 + Math.floor(Math.random() * 50); return { q: `${a} + ${b}`, ans: a + b }; }
    case 2: { const b = 5 + Math.floor(Math.random() * 30), a = b + 5 + Math.floor(Math.random() * 40); return { q: `${a} − ${b}`, ans: a - b }; }
    case 3: { const b = 2 + Math.floor(Math.random() * 9), a = b * (2 + Math.floor(Math.random() * 9)); return { q: `${a} ÷ ${b}`, ans: a / b }; }
    case 4: { const sq = [4,9,16,25,36,49,64,81,100,121][Math.floor(Math.random() * 10)]; return { q: `√${sq}`, ans: Math.round(Math.sqrt(sq)) }; }
    case 5: { const a = 2 + Math.floor(Math.random() * 8); return { q: `${a}²`, ans: a * a }; }
    case 6: { const a = 2 + Math.floor(Math.random() * 9), b = 2 + Math.floor(Math.random() * 9); return { q: `FPB(${a * 2},${a * 3})`, ans: a }; }
    default: { const a = 2 + Math.floor(Math.random() * 9), b = 2 + Math.floor(Math.random() * 9); return { q: `KPK(${a},${b})`, ans: (a * b) / gcd(a, b) }; }
  }
};
const makeWrong = (ans: number, used: Set<number>): number => {
  let v: number, tries = 0;
  do { const d = 1 + Math.floor(Math.random() * 20); v = ans + (Math.random() < 0.5 ? d : -d); tries++; }
  while ((used.has(v) || v <= 0 || v === ans) && tries < 80);
  return Math.max(1, v);
};

// ── Types ─────────────────────────────────────────────────────────────────
interface Entity { row: number; col: number; dx: number; dy: number; prog: number }
interface Ghost extends Entity { frightTimer: number; eaten: boolean; color: string; glowColor: string; ndx: number; ndy: number }
interface Particle { x: number; y: number; vx: number; vy: number; r: number; color: string; a: number }

type Phase = "idle" | "playing" | "dying" | "dead" | "win";

const GHOST_COLORS = ["#ff4444", "#00ccff", "#ff88ff", "#ffaa00"];
const GHOST_GLOWS  = ["#ff8888", "#88eeff", "#ffccff", "#ffcc88"];

// ── Helpers ───────────────────────────────────────────────────────────────
function cellCenter(row: number, col: number): [number, number] {
  return [OX + col * CELL + CELL / 2, OY + row * CELL + CELL / 2];
}
function passable(maze: number[][], row: number, col: number): boolean {
  if (!maze || row < 0 || row >= ROWS) return false;
  const nc = ((col % COLS) + COLS) % COLS; // wrap cols for tunnel
  if (!maze[row]) return false;
  const v = maze[row][nc];
  return v !== 1;
}
function countDots(maze: number[][]): number {
  let n = 0;
  for (const row of maze) for (const v of row) if (v === 0 || v === 2) n++;
  return n;
}

// ── Main component ────────────────────────────────────────────────────────
const PacmanMathPage = () => {
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
  const [opts, setOpts] = useState<number[]>([0, 0, 0, 0]);
  const [correctOpt, setCorrectOpt] = useState(0);
  const [flashMsg, setFlashMsg] = useState("");

  // Game refs
  const phaseRef = useRef<Phase>("idle");
  const guruQuiz = useGuruQuiz(phaseRef);
  const mazeRef = useRef<number[][]>(BASE_MAZE.map(r => [...r]));
  // Static background stars (generated once)
  const bgStarsRef = useRef<{x:number;y:number;r:number;a:number}[]>(
    Array.from({length: 60}, () => ({
      x: Math.random() * CW,
      y: OY + Math.random() * (ROWS * CELL),
      r: 0.5 + Math.random() * 1.2,
      a: 0.3 + Math.random() * 0.7,
    }))
  );
  const pacRef = useRef<Entity & { ndx: number; ndy: number; mouthA: number }>({
    row: 15, col: 10, dx: 0, dy: 0, ndx: -1, ndy: 0, prog: 0, mouthA: 0.25
  });
  const ghostsRef = useRef<Ghost[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const livesRef = useRef(3);
  const levelRef = useRef(1);
  const mqRef = useRef<MQ>({ q: "", ans: 0 });
  const optsRef = useRef<number[]>([0, 0, 0, 0]);
  const correctOptRef = useRef(0);
  const dotsLeftRef = useRef(0);
  const flashTimerRef = useRef(0);
  const flashTextRef = useRef("");
  const dyingTimerRef = useRef(0);
  const frameRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const speedRef = useRef(PAC_BASE);

  // ── Setup question ──────────────────────────────────────────────────────
  const setupQ = useCallback(() => {
    const mq = makeQ();
    mqRef.current = mq;
    const ci = Math.floor(Math.random() * 4);
    correctOptRef.current = ci;
    const used = new Set([mq.ans]);
    const vals = [0, 0, 0, 0];
    vals[ci] = mq.ans;
    for (let i = 0; i < 4; i++) {
      if (i === ci) continue;
      const w = makeWrong(mq.ans, used);
      used.add(w); vals[i] = w;
    }
    optsRef.current = vals;
    setQuestion(mq.q);
    setOpts([...vals]);
    setCorrectOpt(ci);
  }, []);

  // ── Flash ───────────────────────────────────────────────────────────────
  const flash = useCallback((msg: string) => {
    flashTextRef.current = msg;
    flashTimerRef.current = 100;
    setFlashMsg(msg);
  }, []);

  // ── Particles ───────────────────────────────────────────────────────────
  const burst = useCallback((x: number, y: number, color: string, n = 14) => {
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.5;
      const s = 2 + Math.random() * 4;
      particlesRef.current.push({ x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s, r: 1.5+Math.random()*3, color, a: 1 });
    }
  }, []);

  // ── Init ghosts ─────────────────────────────────────────────────────────
  const initGhosts = useCallback((): Ghost[] => {
    const starts: [number, number][] = [[9, 9], [9, 11], [11, 9], [11, 11]];
    return starts.slice(0, 2 + Math.min(levelRef.current - 1, 2)).map((pos, i) => ({
      row: pos[0], col: pos[1], dx: 0, dy: -1, ndx: 0, ndy: -1,
      prog: 0, frightTimer: 0, eaten: false,
      color: GHOST_COLORS[i], glowColor: GHOST_GLOWS[i],
    }));
  }, []);

  // ── Start / reset ───────────────────────────────────────────────────────
  const startGame = useCallback((resetLives = true) => {
    const maze = BASE_MAZE.map(r => [...r]);
    mazeRef.current = maze;
    dotsLeftRef.current = countDots(maze);
    pacRef.current = { row: 15, col: 10, dx: 0, dy: 0, ndx: 0, ndy: 0, prog: 0, mouthA: 0.25 };
    ghostsRef.current = initGhosts();
    particlesRef.current = [];
    speedRef.current = PAC_BASE + levelRef.current * 0.01;
    frameRef.current = 0;
    if (resetLives) { livesRef.current = 3; scoreRef.current = 0; levelRef.current = 1; }
    setLives(livesRef.current); setScore(scoreRef.current); setLevel(levelRef.current);
    setFlashMsg("");
    setupQ();
    phaseRef.current = "playing";
    setPhase("playing");
    playPopSound();
  }, [initGhosts, setupQ]);

  // ── Ghost AI: choose next direction ─────────────────────────────────────
  const ghostAI = useCallback((g: Ghost, maze: number[][], pac: typeof pacRef.current) => {
    const DIRS: [number, number][] = [[0,1],[0,-1],[1,0],[-1,0]];
    // avoid reversing
    const valid = DIRS.filter(([dr, dc]) => {
      if (dr === -g.dy && dc === -g.dx) return false;
      return passable(maze, g.row + dr, g.col + dc);
    });
    if (valid.length === 0) { g.ndx = -g.dx; g.ndy = -g.dy; return; }
    if (g.frightTimer > 0) {
      const d = valid[Math.floor(Math.random() * valid.length)];
      g.ndx = d[1]; g.ndy = d[0];
    } else {
      // Chase pac-man: pick direction with min Manhattan distance
      let best = Infinity, bestD = valid[0];
      for (const [dr, dc] of valid) {
        const tr = g.row + dr, tc = g.col + dc;
        const dist = Math.abs(tr - pac.row) + Math.abs(tc - pac.col);
        if (dist < best) { best = dist; bestD = [dr, dc]; }
      }
      // 70% chance to pick best, 30% random
      const chosen = Math.random() < 0.7 ? bestD : valid[Math.floor(Math.random() * valid.length)];
      g.ndx = chosen[1]; g.ndy = chosen[0];
    }
  }, []);

  // ── Eat dot ─────────────────────────────────────────────────────────────
  const eatCell = useCallback((row: number, col: number) => {
    const maze = mazeRef.current;
    const v = maze[row][col];
    if (v === 0) {
      maze[row][col] = 3;
      scoreRef.current += 10;
      dotsLeftRef.current--;
      setScore(scoreRef.current);
    } else if (v === 2) {
      maze[row][col] = 3;
      scoreRef.current += 50;
      dotsLeftRef.current--;
      setScore(scoreRef.current);
      // Check which power spot this is
      const spot = POWER_SPOTS.find(([r, c]) => r === row && c === col);
      if (spot) {
        const optIdx = spot[2];
        const isCorrect = optIdx === correctOptRef.current;
        if (isCorrect) {
          scoreRef.current += 500;
          setScore(scoreRef.current);
          flash(`⭐ BENAR! +500 poin!`);
          setupQ();
          playPopSound();
        } else {
          flash(`❌ Salah! Cari ${C_OPT_NAMES[correctOptRef.current]}!`);
        }
        // Frighten all ghosts
        for (const g of ghostsRef.current) {
          g.frightTimer = FRIGHT_DUR;
          g.eaten = false;
        }
      }
    }
  }, [flash, setupQ]);

  // ── Game loop ─────────────────────────────────────────────────────────
  const loop = useCallback(() => {
    if (guruQuiz.isPausedRef.current) { rafRef.current = requestAnimationFrame(loop); return; }
    rafRef.current = requestAnimationFrame(loop);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    frameRef.current++;

    // ── Dying animation ─────────────────────────────────────────────
    if (phaseRef.current === "dying") {
      dyingTimerRef.current--;
      if (dyingTimerRef.current <= 0) {
        if (livesRef.current <= 0) {
          phaseRef.current = "dead";
          setPhase("dead");
          if (scoreRef.current > bestRef.current) { bestRef.current = scoreRef.current; setBest(bestRef.current); }
        } else {
          startGame(false);
        }
      }
      // Draw dying animation — spaceship explosion
      ctx.fillStyle = "#03001e";
      ctx.fillRect(0, 0, CW, CH);
      drawBackground(ctx);
      drawMaze(ctx, mazeRef.current);
      const [px, py] = cellCenter(pacRef.current.row, pacRef.current.col);
      const dyingFrac = 1 - dyingTimerRef.current / 60;
      // Expanding explosion rings
      const ringColors = ["#ff6600", "#ffcc00", "#ff3300", "#ffffff"];
      for (let ring = 0; ring < 4; ring++) {
        const rf = Math.min(1, dyingFrac * 2.5 - ring * 0.3);
        if (rf <= 0) continue;
        ctx.globalAlpha = (1 - rf) * 0.9;
        ctx.strokeStyle = ringColors[ring];
        ctx.lineWidth = 3 - ring * 0.5;
        ctx.shadowColor = ringColors[ring]; ctx.shadowBlur = 16;
        ctx.beginPath(); ctx.arc(px, py, rf * CELL * 2.5, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      drawHUD(ctx);
      return;
    }

    if (phaseRef.current !== "playing") {
      ctx.fillStyle = "#03001e";
      ctx.fillRect(0, 0, CW, CH);
      drawBackground(ctx);
      drawMaze(ctx, mazeRef.current);
      drawHUD(ctx);
      return;
    }

    const pac = pacRef.current;
    const maze = mazeRef.current;
    const spd = speedRef.current;
    const keys = keysRef.current;

    // ── Player input ────────────────────────────────────────────────
    if (keys.has("ArrowLeft")  || keys.has("a")) { pac.ndx = -1; pac.ndy = 0; }
    if (keys.has("ArrowRight") || keys.has("d")) { pac.ndx = 1;  pac.ndy = 0; }
    if (keys.has("ArrowUp")    || keys.has("w")) { pac.ndx = 0;  pac.ndy = -1; }
    if (keys.has("ArrowDown")  || keys.has("s")) { pac.ndx = 0;  pac.ndy = 1; }

    // ── Move pac-man ────────────────────────────────────────────────
    pac.prog += spd;
    pac.mouthA = Math.abs(Math.sin(frameRef.current * 0.18)) * 0.38;

    while (pac.prog >= 1) {
      pac.prog -= 1;
      const tryR = pac.row + pac.ndy, tryC = pac.col + pac.ndx;
      const tryRealC = ((tryC % COLS) + COLS) % COLS;
      if (passable(maze, tryR, tryRealC)) {
        pac.dy = pac.ndy; pac.dx = pac.ndx;
      }
      const nr = pac.row + pac.dy;
      let nc = pac.col + pac.dx;
      if (passable(maze, nr, ((nc % COLS) + COLS) % COLS)) {
        pac.row = nr;
        if (pac.row === TUNNEL_ROW) {
          nc = ((nc % COLS) + COLS) % COLS;
        }
        pac.col = nc;
        eatCell(pac.row, pac.col);
      } else {
        pac.dy = 0; pac.dx = 0; pac.prog = 0;
      }
    }

    // ── Move ghosts ─────────────────────────────────────────────────
    const ghostSpd = GHOST_BASE + levelRef.current * 0.008;
    for (const g of ghostsRef.current) {
      if (g.frightTimer > 0) g.frightTimer--;
      g.prog += g.frightTimer > 0 ? ghostSpd * 0.55 : ghostSpd;
      while (g.prog >= 1) {
        g.prog -= 1;
        g.row += g.ndy; g.col += g.ndx;
        // tunnel wrap
        if (g.row === TUNNEL_ROW) g.col = ((g.col % COLS) + COLS) % COLS;
        g.dy = g.ndy; g.dx = g.ndx;
        ghostAI(g, maze, pac);
      }
    }

    // ── Ghost–Pac collision ─────────────────────────────────────────
    for (const g of ghostsRef.current) {
      const [gx, gy] = cellCenter(
        g.row + g.ndy * g.prog,
        g.col + g.ndx * g.prog,
      );
      const [px2, py2] = cellCenter(
        pac.row + pac.dx * pac.prog,
        pac.col + pac.dy * pac.prog,
      );
      if (Math.abs(gx - px2) < CELL * 0.75 && Math.abs(gy - py2) < CELL * 0.75) {
        if (g.frightTimer > 0 && !g.eaten) {
          g.eaten = true;
          g.frightTimer = 0;
          g.row = 9; g.col = 10; g.dx = 0; g.dy = -1; g.ndx = 0; g.ndy = -1; g.prog = 0;
          scoreRef.current += 300;
          setScore(scoreRef.current);
          burst(gx, gy, g.glowColor, 18);
          flash("👻 Hantu dimakan! +300");
          playPopSound();
        } else if (g.frightTimer === 0 && !g.eaten) {
          // Pac dies
          livesRef.current--;
          setLives(livesRef.current);
          burst(px2, py2, "#facc15", 20);
          dyingTimerRef.current = 60;
          phaseRef.current = "dying";
          setPhase("dying");
          return;
        }
      }
    }

    // ── Check win ───────────────────────────────────────────────────
    if (dotsLeftRef.current <= 0) {
      levelRef.current++;
      setLevel(levelRef.current);
      if (levelRef.current > 6) {
        phaseRef.current = "win";
        setPhase("win");
        if (scoreRef.current > bestRef.current) { bestRef.current = scoreRef.current; setBest(bestRef.current); }
      } else {
        flash(`🎉 Level ${levelRef.current}!`);
        startGame(false);
      }
      return;
    }

    // ── Flash timer ─────────────────────────────────────────────────
    if (flashTimerRef.current > 0) { flashTimerRef.current--; if (flashTimerRef.current === 0) setFlashMsg(""); }

    // ── Update particles ────────────────────────────────────────────
    particlesRef.current = particlesRef.current.filter(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.a -= 0.022; return p.a > 0;
    });

    // ═══════════════ DRAW ═══════════════════════════════════════════
    ctx.fillStyle = "#03001e";
    ctx.fillRect(0, 0, CW, CH);
    drawBackground(ctx);

    drawMaze(ctx, maze);

    // Ghosts
    for (const g of ghostsRef.current) {
      const renderR = g.row + g.ndy * g.prog;
      const renderC = g.col + g.ndx * g.prog;
      const [gx, gy] = cellCenter(renderR, renderC);
      drawGhost(ctx, gx, gy, g);
    }

    // Pac-Man
    const renderR = pac.row + pac.dy * pac.prog;
    const renderC = pac.col + pac.dx * pac.prog;
    const [px, py] = cellCenter(renderR, renderC);
    drawPac(ctx, px, py, pac);

    // Particles
    for (const p of particlesRef.current) {
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;

    // Flash
    if (flashTimerRef.current > 0) {
      ctx.globalAlpha = Math.min(1, flashTimerRef.current / 30);
      ctx.font = "bold 15px monospace"; ctx.textAlign = "center";
      ctx.fillStyle = "#fff"; ctx.shadowColor = "#facc15"; ctx.shadowBlur = 16;
      ctx.fillText(flashTextRef.current, CW / 2, OY + ROWS * CELL / 2 - 20);
      ctx.shadowBlur = 0; ctx.globalAlpha = 1; ctx.textAlign = "left";
    }

    drawHUD(ctx);
  }, [startGame, eatCell, ghostAI, burst, flash, setupQ]);

  // ── Draw helpers (space theme) ────────────────────────────────────────
  function drawBackground(ctx: CanvasRenderingContext2D) {
    // Deep space gradient
    const grad = ctx.createLinearGradient(0, OY, 0, OY + ROWS * CELL);
    grad.addColorStop(0,   "#03001e");
    grad.addColorStop(0.5, "#07002a");
    grad.addColorStop(1,   "#03001e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, OY, CW, ROWS * CELL);
    // Background stars
    const tw = Date.now() * 0.001;
    for (const s of bgStarsRef.current) {
      const twinkle = s.a * (0.6 + 0.4 * Math.sin(tw * 1.3 + s.x));
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawMaze(ctx: CanvasRenderingContext2D, maze: number[][]) {
    if (!maze || maze.length < ROWS) return;
    for (let r = 0; r < ROWS; r++) {
      if (!maze[r] || maze[r].length < COLS) continue;
      for (let c = 0; c < COLS; c++) {
        const v = maze[r][c];
        const x = OX + c * CELL, y = OY + r * CELL;
        if (v === 1) {
          // Nebula wall — deep purple block with cosmic border
          ctx.fillStyle = "#0d0030";
          ctx.fillRect(x, y, CELL, CELL);
          ctx.strokeStyle = "#6d28d9";
          ctx.lineWidth = 1;
          ctx.shadowColor = "#a855f7"; ctx.shadowBlur = 5;
          ctx.strokeRect(x + 1, y + 1, CELL - 2, CELL - 2);
          ctx.shadowBlur = 0;
          // Inner nebula dot
          ctx.fillStyle = "rgba(139,92,246,0.18)";
          ctx.fillRect(x + 3, y + 3, CELL - 6, CELL - 6);
        } else if (v === 0) {
          // Star dot — small 4-point sparkle
          const sx = x + CELL / 2, sy = y + CELL / 2;
          ctx.fillStyle = "#bfdbfe";
          ctx.shadowColor = "#93c5fd"; ctx.shadowBlur = 6;
          ctx.beginPath();
          for (let p = 0; p < 8; p++) {
            const a = (p * Math.PI) / 4;
            const rad = p % 2 === 0 ? 2.8 : 1.0;
            if (p === 0) ctx.moveTo(sx + Math.cos(a) * rad, sy + Math.sin(a) * rad);
            else ctx.lineTo(sx + Math.cos(a) * rad, sy + Math.sin(a) * rad);
          }
          ctx.closePath(); ctx.fill();
          ctx.shadowBlur = 0;
        } else if (v === 2) {
          // Planet power pellet with ring
          const spot = POWER_SPOTS.find(([sr, sc]) => sr === r && sc === c);
          const optIdx = spot ? spot[2] : 0;
          const colors = ["#22d3ee", "#f472b6", "#a3e635", "#fb923c"];
          const glows  = ["#a5f3fc", "#fce7f3", "#ecfccb", "#ffedd5"];
          const pulse = 0.75 + 0.25 * Math.sin(Date.now() * 0.005 + optIdx);
          const cx = x + CELL / 2, cy = y + CELL / 2;
          const pr = 7 * pulse;
          // Planet body
          ctx.fillStyle = colors[optIdx];
          ctx.shadowColor = glows[optIdx]; ctx.shadowBlur = 18 * pulse;
          ctx.beginPath(); ctx.arc(cx, cy, pr, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
          // Ring
          ctx.save();
          ctx.globalAlpha = 0.75;
          ctx.strokeStyle = colors[optIdx];
          ctx.lineWidth = 1.5;
          ctx.shadowColor = glows[optIdx]; ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.ellipse(cx, cy, pr * 1.75, pr * 0.45, Math.PI / 5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
          // Answer value
          ctx.font = "bold 8px monospace"; ctx.textAlign = "center";
          ctx.fillStyle = "#000";
          ctx.fillText(String(optsRef.current[optIdx]), cx, cy + 3);
          ctx.textAlign = "left";
        }
      }
    }
  }

  // Spaceship player
  function drawPac(ctx: CanvasRenderingContext2D, px: number, py: number, pac: typeof pacRef.current) {
    const dir = Math.atan2(pac.dy, pac.dx) || 0;
    const half = CELL / 2 - 1;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(dir);
    // Engine exhaust glow
    const thrust = 0.5 + 0.5 * Math.abs(Math.sin(Date.now() * 0.015));
    ctx.fillStyle = `rgba(255,120,0,${0.5 * thrust})`;
    ctx.shadowColor = "#ff6600"; ctx.shadowBlur = 14 * thrust;
    ctx.beginPath();
    ctx.ellipse(-half * 0.8, 0, half * 0.35, half * 0.18 * thrust, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // Ship body — sleek cyan fighter
    ctx.shadowColor = "#00e5ff"; ctx.shadowBlur = 14;
    ctx.fillStyle = "#00e5ff";
    ctx.beginPath();
    ctx.moveTo(half, 0);                        // nose
    ctx.lineTo(-half * 0.5, -half * 0.55);     // top wing tip
    ctx.lineTo(-half * 0.2, -half * 0.22);     // top wing root
    ctx.lineTo(-half * 0.7, 0);                // tail center
    ctx.lineTo(-half * 0.2, half * 0.22);      // bottom wing root
    ctx.lineTo(-half * 0.5, half * 0.55);      // bottom wing tip
    ctx.closePath();
    ctx.fill();
    // Cockpit window
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#ffffff"; ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.ellipse(half * 0.18, 0, half * 0.2, half * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // UFO enemy
  function drawGhost(ctx: CanvasRenderingContext2D, gx: number, gy: number, g: Ghost) {
    const r = CELL / 2 - 1;
    const fright = g.frightTimer > 0;
    const flicker = fright && g.frightTimer < 80 && Math.floor(g.frightTimer / 10) % 2 === 0;
    const discColor = flicker ? "#ffffff" : fright ? "#1a0066" : g.color;
    const glowColor = fright ? "#4400ff" : g.glowColor;
    ctx.save();
    ctx.shadowColor = glowColor; ctx.shadowBlur = 14;
    // UFO disc body
    ctx.fillStyle = discColor;
    ctx.beginPath();
    ctx.ellipse(gx, gy + r * 0.25, r, r * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();
    // Dome
    ctx.fillStyle = fright ? "#110033" : "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.ellipse(gx, gy - r * 0.05, r * 0.55, r * 0.52, 0, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    // Dome tint
    if (!fright) {
      ctx.fillStyle = g.color;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.ellipse(gx, gy - r * 0.05, r * 0.55, r * 0.52, 0, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    // Underside lights
    if (!fright) {
      const lightColors = ["#fff", "#fff", "#fff"];
      for (let li = 0; li < 3; li++) {
        const lx = gx - r * 0.5 + li * r * 0.5;
        const blink = 0.5 + 0.5 * Math.sin(Date.now() * 0.008 + li * 2.1);
        ctx.fillStyle = lightColors[li];
        ctx.globalAlpha = blink * 0.9;
        ctx.beginPath(); ctx.arc(lx, gy + r * 0.3, r * 0.1, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else {
      // Scared X eyes
      ctx.fillStyle = "#aaa";
      ctx.font = `${Math.round(r * 0.7)}px monospace`; ctx.textAlign = "center";
      ctx.fillText("x_x", gx, gy + r * 0.18);
      ctx.textAlign = "left";
    }
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function drawHUD(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "rgba(3,0,30,0.9)";
    ctx.fillRect(0, 0, CW, OY - 2);
    // Rocket lives
    for (let i = 0; i < livesRef.current; i++) {
      const lx = 14 + i * 22, ly = 15;
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = "#00e5ff"; ctx.shadowColor = "#00e5ff"; ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(7, 0);
      ctx.lineTo(-5, -4);
      ctx.lineTo(-3, 0);
      ctx.lineTo(-5, 4);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    }
    // Score
    ctx.font = "bold 12px monospace"; ctx.textAlign = "right";
    ctx.fillStyle = "#a78bfa"; ctx.shadowColor = "#a78bfa"; ctx.shadowBlur = 8;
    ctx.fillText(`⭐ ${scoreRef.current}`, CW - 8, 20);
    ctx.shadowBlur = 0; ctx.textAlign = "left";
  }

  // ── Setup loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop]);

  // ── Keyboard ───────────────────────────────────────────────────────────
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  // ── Touch D-pad ────────────────────────────────────────────────────────
  const setDir = (dx: number, dy: number) => { pacRef.current.ndx = dx; pacRef.current.ndy = dy; };

  const btnCls = "select-none active:scale-95 bg-white/10 border border-white/20 rounded-xl text-white text-xl font-bold flex items-center justify-center cursor-pointer touch-none transition-transform";

  return (
    <div className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}
      <div className="relative z-10 flex flex-col items-center px-2 pt-7 pb-4 w-full max-w-lg">
        <div className="flex items-center justify-between w-full mb-1">
          <button
            onClick={() => { playPopSound(); navigate('/ruang-untuk-guru/numatik-game'); }}
            className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all text-sm"
            title="Menu Utama"
          >
            🏠
          </button>
          <h1 className="font-display text-2xl font-bold text-primary text-glow-cyan text-center flex-1">
            👾 PAC MATH
          </h1>
          <button
            onClick={() => { playPopSound(); navigate(-1); }}
            className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all font-bold"
            title="Keluar"
          >
            ✕
          </button>
        </div>
        {/* Canvas */}
        <div className="relative" style={{ width: CW, maxWidth: "100%", maxHeight: 'calc(100dvh - 160px)', aspectRatio: `${CW}/${CH}` }}>
          <canvas
            ref={canvasRef}
            width={CW} height={CH}
            className="rounded-xl border border-white/10 shadow-2xl w-full h-full"
            style={{ touchAction: "none" }}
          />

          {/* IDLE */}
          {phase === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-xl gap-3">
              <div className="text-5xl">👾</div>
              <h2 className="font-display text-2xl text-yellow-300">PAC MATH</h2>
              <div className="text-white/60 text-xs text-center max-w-xs font-body px-4 space-y-1">
                <p>Makan semua titik kuning untuk naik level!</p>
                <p>Ada 4 pelet warna besar — masing-masing = pilihan jawaban soal.</p>
                <p><span className="text-yellow-300">Pelet BENAR</span> = +500 poin + hantu ketakutan!</p>
                <p>Makan hantu yang ketakutan = +300 poin</p>
                <p className="text-white/40 pt-1">🎮 WASD / Panah = gerak<br/>📱 D-pad di bawah untuk mobile</p>
              </div>
              <button onClick={() => startGame(true)} className="px-8 py-3 bg-accent text-black font-display font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-glow">
                MULAI
              </button>
              {best > 0 && <p className="text-yellow-400 text-xs font-body">🏆 Rekor: {best}</p>}
            </div>
          )}

          {/* DEAD */}
          {phase === "dead" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 rounded-xl gap-3">
              <div className="text-5xl">💀</div>
              <h2 className="font-display text-2xl text-red-400">GAME OVER</h2>
              <p className="text-white font-body">Skor: <span className="text-yellow-400 font-bold">{score}</span></p>
              {score >= best && score > 0 && <p className="text-green-400 text-sm font-body">🏆 Rekor baru!</p>}
              <p className="text-white/50 text-xs">Rekor: {best}</p>
              <button onClick={() => startGame(true)} className="mt-2 px-8 py-3 bg-accent text-black font-display font-bold rounded-full hover:scale-105 transition-transform">MAIN LAGI</button>
              <button onClick={() => { playPopSound(); navigate(-1); }} className="text-white/40 text-xs hover:text-white font-body cursor-pointer">Kembali ke Menu</button>
            </div>
          )}

          {/* WIN */}
          {phase === "win" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 rounded-xl gap-3">
              <div className="text-5xl">🏆</div>
              <h2 className="font-display text-2xl text-yellow-300">MENANG!</h2>
              <p className="text-white font-body">Skor: <span className="text-yellow-400 font-bold">{score}</span></p>
              {score >= best && <p className="text-green-400 text-sm font-body">🏆 Rekor baru!</p>}
              <button onClick={() => startGame(true)} className="mt-2 px-8 py-3 bg-accent text-black font-display font-bold rounded-full hover:scale-105 transition-transform">MAIN LAGI</button>
              <button onClick={() => { playPopSound(); navigate(-1); }} className="text-white/40 text-xs hover:text-white font-body cursor-pointer">Kembali ke Menu</button>
            </div>
          )}
        </div>

        {/* Stats */}
        {(phase === "playing" || phase === "dying") && (
          <div className="flex gap-4 mt-2 text-xs font-body text-white/60">
            <span>❤️ {lives}</span>
            <span>⭐ {score}</span>
            <span>📶 Level {level}</span>
          </div>
        )}

        {flashMsg && (phase === "playing" || phase === "dying") && (
          <p className="mt-1 text-xs font-body text-center text-white/80 animate-pulse">{flashMsg}</p>
        )}


        {/* Touch controls */}
        {(phase === "playing" || phase === "dying") && (
          <div className="mt-4 grid grid-cols-3 gap-2" style={{ width: 150 }}>
            <div />
            <button className={`${btnCls} h-12`} onPointerDown={e => { e.preventDefault(); setDir(0, -1); }}>▲</button>
            <div />
            <button className={`${btnCls} h-12`} onPointerDown={e => { e.preventDefault(); setDir(-1, 0); }}>◀</button>
            <div className="h-12 flex items-center justify-center text-white/30 text-xs">•</div>
            <button className={`${btnCls} h-12`} onPointerDown={e => { e.preventDefault(); setDir(1, 0); }}>▶</button>
            <div />
            <button className={`${btnCls} h-12`} onPointerDown={e => { e.preventDefault(); setDir(0, 1); }}>▼</button>
            <div />
          </div>
        )}
      <GuruQuizOverlay {...guruQuiz} />
      </div>
    </div>
  );
};

// ── Color option names (used in HUD) ──────────────────────────────────────
const C_OPT_NAMES = ["Biru", "Merah", "Hijau", "Oranye"];

export default PacmanMathPage;
