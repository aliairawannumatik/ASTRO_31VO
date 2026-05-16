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
const PAC_BASE = 0.065;  // progress units per frame
const GHOST_BASE = 0.065;
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
  const [joystickKnob, setJoystickKnob] = useState({ x: 0, y: 0 });

  // Game refs
  const phaseRef = useRef<Phase>("idle");
  const guruQuiz = useGuruQuiz(phaseRef);
  const mazeRef = useRef<number[][]>(BASE_MAZE.map(r => [...r]));
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
  const joystickActiveRef = useRef(false);
  const joystickCenterRef = useRef({ x: 0, y: 0 });

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
      // Draw dying animation
      ctx.fillStyle = "#00000f";
      ctx.fillRect(0, 0, CW, CH);
      drawMaze(ctx, mazeRef.current);
      const [px, py] = cellCenter(pacRef.current.row, pacRef.current.col);
      const dyingFrac = 1 - dyingTimerRef.current / 60;
      ctx.save();
      ctx.shadowColor = "#facc15"; ctx.shadowBlur = 16;
      ctx.fillStyle = "#facc15";
      const mouthClose = Math.min(1, dyingFrac * 2) * Math.PI;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.arc(px, py, CELL / 2 - 1, mouthClose / 2, Math.PI * 2 - mouthClose / 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      drawHUD(ctx);
      return;
    }

    if (phaseRef.current !== "playing") {
      ctx.fillStyle = "#00000f";
      ctx.fillRect(0, 0, CW, CH);
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
    pac.mouthA = Math.abs(Math.sin(frameRef.current * 0.18)) * 0.38;

    // If stopped, try immediately starting in queued direction
    if (pac.dx === 0 && pac.dy === 0) {
      const tr = pac.row + pac.ndy, tc = ((pac.col + pac.ndx) % COLS + COLS) % COLS;
      if (passable(maze, tr, tc)) { pac.dx = pac.ndx; pac.dy = pac.ndy; }
    }
    // Allow instant 180° reverse while moving
    if ((pac.ndx !== 0 || pac.ndy !== 0) &&
        pac.ndx === -pac.dx && pac.ndy === -pac.dy) {
      pac.dx = pac.ndx; pac.dy = pac.ndy; pac.prog = 1 - pac.prog;
    }

    pac.prog += spd;

    while (pac.prog >= 1) {
      pac.prog -= 1;
      // Try queued turn at this cell crossing
      const tryR = pac.row + pac.ndy, tryC = ((pac.col + pac.ndx) % COLS + COLS) % COLS;
      if (passable(maze, tryR, tryC)) { pac.dy = pac.ndy; pac.dx = pac.ndx; }
      // Advance to next cell
      const nr = pac.row + pac.dy;
      let nc = pac.col + pac.dx;
      if (passable(maze, nr, ((nc % COLS) + COLS) % COLS)) {
        pac.row = nr;
        if (pac.row === TUNNEL_ROW) nc = ((nc % COLS) + COLS) % COLS;
        pac.col = nc;
        eatCell(pac.row, pac.col);
      } else {
        pac.dy = 0; pac.dx = 0; pac.prog = 0;
      }
    }

    // ── Prevent visual wall clipping ────────────────────────────────
    // If the next cell in current direction is a wall, snap to cell center
    if (pac.dx !== 0 || pac.dy !== 0) {
      const nextR = pac.row + pac.dy;
      const nextC = ((pac.col + pac.dx) % COLS + COLS) % COLS;
      if (!passable(maze, nextR, nextC)) {
        pac.prog = 0; pac.dx = 0; pac.dy = 0;
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
        pac.row + pac.dy * pac.prog,
        pac.col + pac.dx * pac.prog,
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
    ctx.fillStyle = "#00000f";
    ctx.fillRect(0, 0, CW, CH);

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

  // ── Draw helpers ─────────────────────────────────────────────────────────
  function drawMaze(ctx: CanvasRenderingContext2D, maze: number[][]) {
    if (!maze || maze.length < ROWS) return;
    for (let r = 0; r < ROWS; r++) {
      if (!maze[r] || maze[r].length < COLS) continue;
      for (let c = 0; c < COLS; c++) {
        const v = maze[r][c];
        const x = OX + c * CELL, y = OY + r * CELL;
        if (v === 1) {
          ctx.fillStyle = "#00004a";
          ctx.fillRect(x, y, CELL, CELL);
          ctx.strokeStyle = "#1a1aff";
          ctx.lineWidth = 1;
          ctx.shadowColor = "#4444ff"; ctx.shadowBlur = 4;
          ctx.strokeRect(x + 1, y + 1, CELL - 2, CELL - 2);
          ctx.shadowBlur = 0;
        } else if (v === 0) {
          ctx.fillStyle = "#ffdd88";
          ctx.shadowColor = "#ffdd88"; ctx.shadowBlur = 4;
          ctx.beginPath(); ctx.arc(x + CELL / 2, y + CELL / 2, 2.5, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
        } else if (v === 2) {
          const spot = POWER_SPOTS.find(([sr, sc]) => sr === r && sc === c);
          const optIdx = spot ? spot[2] : 0;
          const colors = ["#22d3ee", "#f472b6", "#a3e635", "#fb923c"];
          const glows  = ["#a5f3fc", "#fce7f3", "#ecfccb", "#ffedd5"];
          const pulse = 0.7 + 0.3 * Math.sin(Date.now() * 0.005 + optIdx);
          ctx.fillStyle = colors[optIdx];
          ctx.shadowColor = glows[optIdx]; ctx.shadowBlur = 14 * pulse;
          ctx.beginPath(); ctx.arc(x + CELL / 2, y + CELL / 2, 6 * pulse, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
          ctx.font = "bold 8px monospace"; ctx.textAlign = "center";
          ctx.fillStyle = "#000";
          ctx.fillText(String(optsRef.current[optIdx]), x + CELL / 2, y + CELL / 2 + 3);
          ctx.textAlign = "left";
        }
      }
    }
  }

  function drawPac(ctx: CanvasRenderingContext2D, px: number, py: number, pac: typeof pacRef.current) {
    const dir = Math.atan2(pac.dy, pac.dx) || 0;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(dir);
    ctx.shadowColor = "#facc15"; ctx.shadowBlur = 18;
    ctx.fillStyle = "#facc15";
    const m = pac.mouthA;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, CELL / 2 - 1, m, Math.PI * 2 - m);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawGhost(ctx: CanvasRenderingContext2D, gx: number, gy: number, g: Ghost) {
    const r = CELL / 2 - 1;
    const fright = g.frightTimer > 0;
    const mainColor = fright ? (g.frightTimer < 80 && Math.floor(g.frightTimer / 10) % 2 === 0 ? "#ffffff" : "#0000cc") : g.color;
    ctx.save();
    ctx.shadowColor = fright ? "#0066ff" : g.glowColor;
    ctx.shadowBlur = 12;
    ctx.fillStyle = mainColor;
    ctx.beginPath();
    ctx.arc(gx, gy - r * 0.2, r, Math.PI, 0);
    ctx.lineTo(gx + r, gy + r * 0.8);
    const ww = r / 2.5;
    for (let i = 3; i >= 0; i--) {
      const wx = gx - r + i * ww;
      const dir2 = i % 2 === 0 ? -1 : 1;
      ctx.quadraticCurveTo(wx + ww / 2, gy + r * 0.8 + dir2 * r * 0.35, wx, gy + r * 0.8);
    }
    ctx.closePath();
    ctx.fill();
    if (!fright) {
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.ellipse(gx - r * 0.3, gy - r * 0.2, r * 0.22, r * 0.28, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(gx + r * 0.3, gy - r * 0.2, r * 0.22, r * 0.28, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#00f";
      ctx.beginPath(); ctx.arc(gx - r * 0.28, gy - r * 0.18, r * 0.1, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(gx + r * 0.32, gy - r * 0.18, r * 0.1, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = "#fff";
      ctx.font = "8px monospace"; ctx.textAlign = "center";
      ctx.fillText("^_^", gx, gy);
      ctx.textAlign = "left";
    }
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function drawHUD(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "rgba(0,0,15,0.85)";
    ctx.fillRect(0, 0, CW, OY - 2);
    for (let i = 0; i < livesRef.current; i++) {
      const lx = 14 + i * 22, ly = 18;
      ctx.fillStyle = "#facc15"; ctx.shadowColor = "#facc15"; ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(lx, ly); ctx.arc(lx, ly, 8, 0.3, Math.PI * 2 - 0.3); ctx.closePath();
      ctx.fill(); ctx.shadowBlur = 0;
    }
    ctx.font = "bold 12px monospace"; ctx.textAlign = "right";
    ctx.fillStyle = "#00ffcc"; ctx.shadowColor = "#00ffcc"; ctx.shadowBlur = 8;
    ctx.fillText(`${scoreRef.current}`, CW - 10, 22);
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

  // ── Analog joystick ────────────────────────────────────────────────────
  const handleJoyDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    joystickCenterRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    joystickActiveRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handleJoyMove = useCallback((e: React.PointerEvent) => {
    if (!joystickActiveRef.current) return;
    e.preventDefault();
    const { x: cx, y: cy } = joystickCenterRef.current;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxR = 30;
    const clamp = Math.min(dist, maxR);
    const angle = Math.atan2(dy, dx);
    setJoystickKnob({ x: Math.cos(angle) * clamp, y: Math.sin(angle) * clamp });
    if (dist > 10) {
      if (Math.abs(dx) >= Math.abs(dy)) {
        pacRef.current.ndx = dx > 0 ? 1 : -1;
        pacRef.current.ndy = 0;
      } else {
        pacRef.current.ndx = 0;
        pacRef.current.ndy = dy > 0 ? 1 : -1;
      }
    }
  }, []);

  const handleJoyUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    joystickActiveRef.current = false;
    setJoystickKnob({ x: 0, y: 0 });
  }, []);

  return (
    <div className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}

      {/* ── IDLE START SCREEN ─────────────────────────────────────────────── */}
      {phase === "idle" && (
        <div className="fixed inset-0 z-40 overflow-hidden">
          <style>{`
            @keyframes pm-floatA { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
            @keyframes pm-floatB { 0%,100%{transform:translateY(-5px)} 50%{transform:translateY(7px)} }
            @keyframes pm-chomp  { 0%,100%{transform:scale(1) rotate(-10deg)} 50%{transform:scale(1.15) rotate(10deg)} }
            @keyframes pm-pulse  { 0%,100%{opacity:0.65;transform:scale(1)} 50%{opacity:1;transform:scale(1.12)} }
            @keyframes pm-shimmer{ 0%{background-position:200% center} 100%{background-position:-200% center} }
            @keyframes pm-scanY  { 0%{transform:translateY(-120%)} 100%{transform:translateY(220%)} }
            @keyframes pm-pellet { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
            .pm-fa{animation:pm-floatA 3.2s ease-in-out infinite}
            .pm-fb{animation:pm-floatB 3.8s ease-in-out infinite}
            .pm-chomp{animation:pm-chomp 0.5s ease-in-out infinite}
            .pm-fp{animation:pm-pulse 2.4s ease-in-out infinite}
            .pm-pel{animation:pm-pellet 1.2s ease-in-out infinite}
            .pm-title-shine{background:linear-gradient(90deg,#facc15,#fbbf24,#fb923c,#facc15,#fbbf24,#facc15);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:pm-shimmer 3.5s linear infinite}
            @keyframes pm-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
            .pm-btn-breathe{animation:pm-breathe 2.8s ease-in-out infinite}
            .pm-scroll{height:100%;overflow-y:auto;scrollbar-width:none;display:flex;flex-direction:column}
            .pm-wrap{flex:1;display:flex;flex-direction:column;justify-content:space-evenly;padding:0.5rem 1rem;width:100%}
            .pm-main{display:flex;flex-direction:column;gap:0.75rem}
            .pm-visual{display:flex;flex-direction:column;gap:0.5rem}
            .pm-action{display:flex;flex-direction:column;gap:0.5rem}
            @media(orientation:landscape){
              .pm-wrap{justify-content:space-evenly;padding:0.35rem 1.75rem;max-width:860px;margin:0 auto;width:100%}
              .pm-main{flex-direction:row;align-items:stretch;gap:2rem}
              .pm-visual{flex:1;justify-content:center;gap:0.6rem}
              .pm-action{flex:1;justify-content:center;gap:0.6rem}
            }
          `}</style>

          {/* Background layers — dark arcade navy */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 15%, rgba(10,30,100,1) 0%, rgba(2,4,30,1) 60%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 10% 55%, rgba(250,204,21,0.1) 0%, transparent 55%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 90% 30%, rgba(30,144,255,0.1) 0%, transparent 55%)" }} />
          <div className="absolute inset-x-0 h-[1px] pointer-events-none" style={{ background: "linear-gradient(to right,transparent,rgba(250,204,21,0.25),transparent)", animation: "pm-scanY 6s linear infinite" }} />

          <div className="pm-scroll relative z-10">
            <div className="pm-wrap">

              {/* Header row */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-between w-full mb-1">
                  <button onClick={() => { playPopSound(); navigate(-1); }}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-display font-bold text-xs shadow-[0_0_15px_rgba(250,204,21,0.5)] hover:opacity-90 transition-opacity cursor-pointer">
                    <span className="text-base leading-none">←</span>
                    <span>Kembali</span>
                  </button>
                  <div className="text-[7px] tracking-[5px] text-yellow-400/60 uppercase font-bold">⬡ NUMATIK GAME ⬡</div>
                  <button onClick={() => { playPopSound(); navigate('/ruang-untuk-guru/numatik-game'); }}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-display font-bold text-xs shadow-[0_0_15px_rgba(250,204,21,0.5)] hover:opacity-90 transition-opacity cursor-pointer">
                    <span className="text-base leading-none">🏠</span>
                    <span>Home</span>
                  </button>
                </div>
                <div className="pm-title-shine font-display font-black leading-none" style={{ fontSize: "clamp(1.7rem,5vw,2.4rem)" }}>PAC MATH</div>
                <div className="mx-auto mt-0.5 h-0.5 w-28 rounded-full" style={{ background: "linear-gradient(to right,transparent,#facc15,#fb923c,transparent)" }} />
                <p className="text-yellow-400/70 text-[9px] font-bold tracking-wider uppercase mt-1">Makan · Hindari · Taklukkan</p>
                <p className="text-white/35 text-[8px] tracking-widest uppercase mt-0.5">🕹️ Game Arkade Matematika Epik 🕹️</p>
              </div>

              <div className="pm-main">
                {/* Left – visual */}
                <div className="pm-visual">
                  <div className="flex items-end justify-center gap-5 w-full">
                    {/* Pac-Man side */}
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="text-[7px] text-yellow-400/70 font-bold tracking-wider uppercase">PAC-MAN</div>
                      <div className="relative">
                        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle,rgba(250,204,21,0.3) 0%,transparent 70%)", transform: "scale(2.4)", borderRadius: "50%" }} />
                        <div className="pm-chomp relative z-10 text-5xl" style={{ filter: "drop-shadow(0 0 16px #facc15) drop-shadow(0 0 32px #f59e0b)" }}>😁</div>
                      </div>
                      <div className="w-1.5 h-4 rounded-full" style={{ background: "linear-gradient(to bottom,rgba(250,204,21,0.8),transparent)" }} />
                      <div className="text-[8px] font-bold text-yellow-400">KAMU</div>
                    </div>

                    <div className="flex flex-col items-center pb-4">
                      <div className="text-xl font-black text-white/20">VS</div>
                    </div>

                    {/* Ghosts side */}
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="text-[7px] text-white/40 font-bold tracking-wider uppercase mb-0.5">HANTU MUSUH</div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {([
                          { glow: "#ff4444", name: "BLINKY", delay: "0s" },
                          { glow: "#ff9ff3", name: "PINKY",  delay: "0.5s" },
                          { glow: "#00d2ff", name: "INKY",   delay: "1s" },
                          { glow: "#ffa500", name: "CLYDE",  delay: "1.5s" },
                        ]).map(g => (
                          <div key={g.name} className="flex flex-col items-center gap-0.5 rounded-lg p-1.5 border"
                            style={{ borderColor: g.glow + "55", background: g.glow + "12", boxShadow: `0 0 10px ${g.glow}33` }}>
                            <div className="pm-fb text-2xl" style={{ animationDelay: g.delay, filter: `drop-shadow(0 0 7px ${g.glow})` }}>👻</div>
                            <span className="text-[6px] font-bold" style={{ color: g.glow }}>{g.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px" style={{ background: "linear-gradient(to right,transparent,rgba(250,204,21,0.4),transparent)" }} />

                  {/* Power pellet legend */}
                  <div>
                    <div className="text-[7px] text-white/35 tracking-widest uppercase mb-1.5 font-bold text-center">⚡ Pelet Warna = Pilihan Jawaban</div>
                    <div className="grid grid-cols-4 gap-1.5 w-full">
                      {(["BIRU","MERAH","HIJAU","ORANYE"] as string[]).map((name, i) => {
                        const glow = ["#1e90ff","#ff4444","#00cc44","#ff7700"][i];
                        return (
                          <div key={name} className="flex flex-col items-center gap-0.5 rounded-xl py-1.5 px-1 border"
                            style={{ borderColor: glow + "44", background: glow + "10", boxShadow: `0 0 8px ${glow}30` }}>
                            <div className="pm-pel rounded-full" style={{ width: 18, height: 18, background: glow, boxShadow: `0 0 8px ${glow}`, animationDelay: `${i * 0.25}s` }} />
                            <span className="text-[7px] font-black" style={{ color: glow }}>{name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Small dot trail decoration */}
                  <div className="flex justify-center items-center gap-1.5 py-0.5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="rounded-full bg-yellow-400/50" style={{ width: 4, height: 4, animationDelay: `${i * 0.12}s` }} />
                    ))}
                  </div>
                </div>

                {/* Right – how to play + start */}
                <div className="pm-action">
                  <div className="w-full h-px" style={{ background: "linear-gradient(to right,transparent,rgba(250,204,21,0.28),transparent)" }} />
                  <div className="text-[7px] text-white/35 tracking-widest uppercase mb-1 font-bold text-center">📖 Cara Bermain</div>
                  <div className="space-y-1.5">
                    {[
                      { icon: "🟡", text: "Makan semua titik kuning di labirin untuk naik level" },
                      { icon: "⚡", text: "4 pelet warna besar = pilihan jawaban soal matematika" },
                      { icon: "✅", text: "Pelet BENAR = +500 poin + semua hantu ketakutan!" },
                      { icon: "👻", text: "Makan hantu ketakutan (biru) = +300 poin bonus" },
                      { icon: "❌", text: "Jangan sampai tertangkap hantu — kamu punya 3 nyawa!" },
                    ].map(({ icon, text }) => (
                      <div key={text} className="flex items-start gap-2 px-1">
                        <span className="text-sm shrink-0 leading-none mt-0.5">{icon}</span>
                        <p className="text-[8px] text-white/55 leading-relaxed">{text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col items-center gap-1.5 mt-2">
                    {best > 0 && (
                      <div className="text-[8px] text-yellow-400/80 font-bold">🏆 Rekor: {best}</div>
                    )}
                    <button onClick={() => startGame(true)}
                      className="pm-btn-breathe font-display font-black text-black text-lg px-8 py-3 rounded-2xl cursor-pointer hover:scale-110 active:scale-95 w-full"
                      style={{
                        background: "linear-gradient(135deg,#facc15 0%,#fbbf24 45%,#f59e0b 100%)",
                        boxShadow: "0 0 30px rgba(250,204,21,0.85),0 0 60px rgba(245,158,11,0.35),0 4px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.3)",
                      }}>
                      😁 MULAI BERMAIN
                    </button>
                    <div className="text-[7px] text-white/20 text-center leading-relaxed">
                      WASD / Panah = gerak · Joystick kiri untuk mobile
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Main game container ───────────────────────────────────────────── */}
      <div className={`relative z-10 flex flex-col items-center px-2 pb-4 w-full max-w-lg ${phase === "idle" ? "pt-0" : "pt-6"}`} style={{ height: '100dvh' }}>
        {phase !== "idle" && (
          <div className="flex items-center justify-between w-full mb-1 shrink-0 gap-2">
            <button onClick={() => { playPopSound(); navigate(-1); }}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-display font-bold text-xs shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:opacity-90 transition-opacity cursor-pointer">
              <span className="text-base leading-none">←</span>
              <span className="hidden sm:inline">Kembali</span>
            </button>
            <h1 className="font-display text-xl font-bold text-center flex-1" style={{ background: "linear-gradient(90deg,#facc15,#fbbf24,#fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              😁 PAC MATH
            </h1>
            <button onClick={() => { playPopSound(); navigate('/ruang-untuk-guru/numatik-game'); }}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-display font-bold text-xs shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:opacity-90 transition-opacity cursor-pointer">
              <span className="text-base leading-none">🏠</span>
              <span className="hidden sm:inline">Home</span>
            </button>
          </div>
        )}
        {/* Canvas */}
        <div className="relative" style={{ width: CW, maxWidth: "100%", maxHeight: 'calc(100dvh - 160px)', aspectRatio: `${CW}/${CH}` }}>
          <canvas
            ref={canvasRef}
            width={CW} height={CH}
            className="rounded-xl border border-white/10 shadow-2xl w-full h-full"
            style={{ touchAction: "none" }}
          />

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


        {/* Analog joystick — fixed to bottom-left so always visible in portrait & landscape */}
        {(phase === "playing" || phase === "dying") && (
          <div
            onPointerDown={handleJoyDown}
            onPointerMove={handleJoyMove}
            onPointerUp={handleJoyUp}
            onPointerCancel={handleJoyUp}
            style={{
              position: 'fixed', bottom: 24, left: 24, zIndex: 50,
              touchAction: 'none', userSelect: 'none',
              width: 88, height: 88, borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
              border: '2px solid rgba(255,255,255,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 18px rgba(250,204,21,0.18)',
              cursor: 'none',
            }}
          >
            {/* Cardinal guides */}
            {['▲','▼','◀','▶'].map((a, i) => (
              <span key={i} style={{
                position: 'absolute',
                top: i === 0 ? 4 : i === 1 ? 'auto' : '50%',
                bottom: i === 1 ? 4 : 'auto',
                left: i === 2 ? 4 : i === 3 ? 'auto' : '50%',
                right: i === 3 ? 4 : 'auto',
                transform: (i === 0 || i === 1) ? 'translateX(-50%)' : 'translateY(-50%)',
                fontSize: 9, color: 'rgba(255,255,255,0.3)', lineHeight: 1, pointerEvents: 'none'
              }}>{a}</span>
            ))}
            {/* Knob */}
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #ffe066, #facc15)',
              border: '2px solid rgba(255,255,200,0.5)',
              boxShadow: '0 0 14px rgba(250,204,21,0.55)',
              position: 'absolute',
              transform: `translate(${joystickKnob.x}px, ${joystickKnob.y}px)`,
              transition: joystickActiveRef.current ? 'none' : 'transform 0.12s ease',
              pointerEvents: 'none',
            }} />
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
