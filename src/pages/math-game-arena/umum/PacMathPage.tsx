import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz, type GuruQuestion } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";

// ── Maze layout (0=dot, 1=wall, 2=empty, 3=power pellet) ────────────────────
const MAZE_TEMPLATE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,3,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,3,1],
  [1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1],
  [1,0,1,1,0,0,0,1,0,0,0,1,0,0,0,1,1,0,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1],
  [1,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
  [1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
  [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,0,1,1,0,0,0,1,0,0,0,1,0,0,0,1,1,0,1],
  [1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1],
  [1,3,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,3,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const ROWS = MAZE_TEMPLATE.length;    // 15
const COLS = MAZE_TEMPLATE[0].length; // 19
const CELL = 28;
const CANVAS_W = COLS * CELL;
const CANVAS_H = ROWS * CELL + 60;
const PAC_START_COL = 9;
const PAC_START_ROW = 6;

type Dir = "right" | "left" | "up" | "down" | "none";

interface GhostState {
  x: number; y: number; col: number; row: number;
  dir: Dir; nextDir: Dir;
  color: string; glowColor: string;
  moveTimer: number; moveInterval: number;
  frightened: boolean; frightenTimer: number;
}

interface PacMathPageProps {
  topicLabel?: string;
  backPath?: string;
  homePath?: string;
  quizQuestions?: GuruQuestion[];
}

const GHOST_COLORS = [
  { color: "#ff4da6", glow: "rgba(255,77,166,0.8)" },
  { color: "#00cfff", glow: "rgba(0,207,255,0.8)" },
];
const GHOST_STARTS = [
  { col: 7, row: 6 },
  { col: 11, row: 6 },
];

function buildMaze(): number[][] {
  return MAZE_TEMPLATE.map(row => [...row]);
}

function isWalkable(maze: number[][], row: number, col: number): boolean {
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return false;
  return maze[row][col] !== 1;
}

const DIR_DELTA: Record<Dir, { dr: number; dc: number }> = {
  right: { dr: 0, dc: 1 },
  left:  { dr: 0, dc: -1 },
  up:    { dr: -1, dc: 0 },
  down:  { dr: 1, dc: 0 },
  none:  { dr: 0, dc: 0 },
};
const DIRS: Dir[] = ["right", "left", "up", "down"];

function randomDir(maze: number[][], row: number, col: number, exclude?: Dir): Dir {
  const opts = DIRS.filter(d => d !== exclude && isWalkable(maze, row + DIR_DELTA[d].dr, col + DIR_DELTA[d].dc));
  if (opts.length === 0) return exclude ?? "right";
  return opts[Math.floor(Math.random() * opts.length)];
}

const PacMathPage = ({
  topicLabel,
  backPath,
  homePath = "/menu",
  quizQuestions,
}: PacMathPageProps = {}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<string>("idle");
  const guruQuiz = useGuruQuiz(phaseRef, "playing", 25_000, quizQuestions);

  // game state refs
  const mazeRef       = useRef<number[][]>(buildMaze());
  const pacRef        = useRef({ col: PAC_START_COL, row: PAC_START_ROW, dir: "right" as Dir, nextDir: "right" as Dir, mouthAngle: 0, mouthDir: 1, moveTimer: 0 });
  const ghostsRef     = useRef<GhostState[]>([]);
  const scoreRef      = useRef(0);
  const livesRef      = useRef(3);
  const dotsLeftRef   = useRef(0);
  const gameOverRef   = useRef(false);
  const wonRef        = useRef(false);
  const animRef       = useRef(0);
  const lastTimeRef   = useRef(0);
  const phaseLocalRef = useRef<"playing" | "dying" | "idle">("idle");
  const dyingTimerRef = useRef(0);

  const [score, setScore]       = useState(0);
  const [lives, setLives]       = useState(3);
  const [started, setStarted]   = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon]           = useState(false);

  const initGhosts = useCallback(() => {
    ghostsRef.current = GHOST_STARTS.map((start, i) => ({
      col: start.col, row: start.row,
      x: start.col * CELL + CELL / 2, y: start.row * CELL + CELL / 2,
      dir: DIRS[i * 2] as Dir, nextDir: "none" as Dir,
      color: GHOST_COLORS[i].color, glowColor: GHOST_COLORS[i].glow,
      moveTimer: 0, moveInterval: 300 + i * 80,
      frightened: false, frightenTimer: 0,
    }));
  }, []);

  const countDots = useCallback((maze: number[][]) => {
    return maze.flat().filter(c => c === 0 || c === 3).length;
  }, []);

  const resetPac = useCallback(() => {
    pacRef.current = { col: PAC_START_COL, row: PAC_START_ROW, dir: "right", nextDir: "right", mouthAngle: 0.25, mouthDir: 1, moveTimer: 0 };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = CANVAS_W, mazeH = ROWS * CELL;

    // Background
    ctx.fillStyle = "#0a0a1a";
    ctx.fillRect(0, 0, W, CANVAS_H);

    const maze = mazeRef.current;

    // Draw maze cells
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = maze[r][c];
        const px = c * CELL, py = r * CELL;
        if (cell === 1) {
          // wall
          const wGrad = ctx.createLinearGradient(px, py, px + CELL, py + CELL);
          wGrad.addColorStop(0, "#1e3a5f");
          wGrad.addColorStop(1, "#0f1f3a");
          ctx.fillStyle = wGrad;
          ctx.fillRect(px, py, CELL, CELL);
          ctx.strokeStyle = "rgba(0,150,255,0.25)";
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 0.5, py + 0.5, CELL - 1, CELL - 1);
        } else if (cell === 0) {
          // dot
          ctx.shadowColor = "rgba(255,220,100,0.7)";
          ctx.shadowBlur = 6;
          ctx.fillStyle = "#ffe066";
          ctx.beginPath();
          ctx.arc(px + CELL / 2, py + CELL / 2, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (cell === 3) {
          // power pellet
          const pulse = 0.7 + 0.3 * Math.sin(Date.now() / 200);
          ctx.shadowColor = "rgba(255,100,255,0.9)";
          ctx.shadowBlur = 12 * pulse;
          ctx.fillStyle = "#ff66ff";
          ctx.beginPath();
          ctx.arc(px + CELL / 2, py + CELL / 2, 6 * pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    // Pac-Man
    const pac = pacRef.current;
    const px = pac.col * CELL + CELL / 2;
    const py = pac.row * CELL + CELL / 2;
    const mouthOpen = pac.mouthAngle * Math.PI;
    const facingAngle = pac.dir === "right" ? 0 : pac.dir === "left" ? Math.PI : pac.dir === "up" ? -Math.PI / 2 : Math.PI / 2;

    ctx.shadowColor = "rgba(255,220,0,0.8)";
    ctx.shadowBlur = 14;
    const pacGrad = ctx.createRadialGradient(px - 3, py - 3, 2, px, py, 11);
    pacGrad.addColorStop(0, "#ffe566");
    pacGrad.addColorStop(0.7, "#ffd000");
    pacGrad.addColorStop(1, "#cc9900");
    ctx.fillStyle = pacGrad;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.arc(px, py, 11, facingAngle + mouthOpen, facingAngle + Math.PI * 2 - mouthOpen);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Eye
    const eyeAngle = facingAngle - Math.PI / 3;
    const eyeX = px + Math.cos(eyeAngle) * 5;
    const eyeY = py + Math.sin(eyeAngle) * 5;
    ctx.fillStyle = "#0a0a1a";
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 2, 0, Math.PI * 2);
    ctx.fill();

    // Ghosts
    for (const g of ghostsRef.current) {
      const gx = g.x, gy = g.y;
      const r = 11;
      ctx.shadowColor = g.frightened ? "rgba(100,100,255,0.8)" : g.glowColor;
      ctx.shadowBlur = 14;
      const ghostColor = g.frightened ? "#4444ff" : g.color;
      const ghostGrad = ctx.createRadialGradient(gx - 3, gy - 3, 2, gx, gy, r);
      ghostGrad.addColorStop(0, lightenColor(ghostColor, 0.3));
      ghostGrad.addColorStop(0.7, ghostColor);
      ghostGrad.addColorStop(1, darkenColor(ghostColor, 0.25));
      ctx.fillStyle = ghostGrad;
      ctx.beginPath();
      ctx.arc(gx, gy - 2, r, Math.PI, 0);
      ctx.lineTo(gx + r, gy + r - 2);
      // skirt
      const skirtSegs = 3;
      for (let s = skirtSegs; s >= 0; s--) {
        const sx = gx + r - (s / skirtSegs) * r * 2;
        const sy = gy + r - 2 - (s % 2 === 0 ? 4 : 0);
        ctx.lineTo(sx, sy);
      }
      ctx.lineTo(gx - r, gy + r - 2);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      // eyes
      if (!g.frightened) {
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.ellipse(gx - 4, gy - 4, 3.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(gx + 4, gy - 4, 3.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#0000cc";
        ctx.beginPath(); ctx.arc(gx - 4, gy - 3, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(gx + 4, gy - 3, 2, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("x x", gx, gy - 2);
      }
    }

    // HUD bar
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, mazeH, W, 60);
    ctx.fillStyle = "#ffd000";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("SKOR:", 10, mazeH + 30);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px system-ui";
    ctx.fillText(String(scoreRef.current), 65, mazeH + 30);

    ctx.fillStyle = "#ffd000";
    ctx.font = "bold 14px system-ui";
    ctx.textAlign = "right";
    ctx.fillText("NYAWA: " + "😊".repeat(livesRef.current), W - 10, mazeH + 30);

    // Game over overlay
    if (gameOverRef.current || wonRef.current) {
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.fillRect(0, 0, W, mazeH);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (wonRef.current) {
        ctx.fillStyle = "#ffd000";
        ctx.font = "bold 36px system-ui";
        ctx.fillText("🎉 MENANG!", W / 2, mazeH / 2 - 20);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 20px system-ui";
        ctx.fillText(`Skor: ${scoreRef.current}`, W / 2, mazeH / 2 + 20);
      } else {
        ctx.fillStyle = "#ff4444";
        ctx.font = "bold 36px system-ui";
        ctx.fillText("💔 GAME OVER", W / 2, mazeH / 2 - 20);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 20px system-ui";
        ctx.fillText(`Skor: ${scoreRef.current}`, W / 2, mazeH / 2 + 20);
      }
    }
  }, []);

  const loop = useCallback((timestamp: number) => {
    const dt = Math.min(timestamp - (lastTimeRef.current || timestamp), 100);
    lastTimeRef.current = timestamp;

    if (!guruQuiz.isPausedRef.current && phaseLocalRef.current === "playing") {
      const pac = pacRef.current;
      const maze = mazeRef.current;

      // Dying animation
      if (phaseLocalRef.current === "playing") {
        // Pac movement
        pac.moveTimer += dt;
        const moveInterval = 140;
        if (pac.moveTimer >= moveInterval) {
          pac.moveTimer = 0;
          // Try next dir first
          const nd = DIR_DELTA[pac.nextDir];
          if (isWalkable(maze, pac.row + nd.dr, pac.col + nd.dc)) {
            pac.dir = pac.nextDir;
          }
          const d = DIR_DELTA[pac.dir];
          const nr = pac.row + d.dr, nc = pac.col + d.dc;
          if (isWalkable(maze, nr, nc)) {
            pac.row = nr; pac.col = nc;
            // eat dot
            const cell = maze[nr][nc];
            if (cell === 0) {
              maze[nr][nc] = 2;
              scoreRef.current += 10;
              setScore(scoreRef.current);
              dotsLeftRef.current -= 1;
            } else if (cell === 3) {
              maze[nr][nc] = 2;
              scoreRef.current += 50;
              setScore(scoreRef.current);
              dotsLeftRef.current -= 1;
              // frighten ghosts
              for (const g of ghostsRef.current) {
                g.frightened = true;
                g.frightenTimer = 5000;
              }
            }
          }
        }

        // Pac mouth animation
        pac.mouthAngle += pac.mouthDir * dt * 0.003;
        if (pac.mouthAngle >= 0.35) pac.mouthDir = -1;
        if (pac.mouthAngle <= 0.02) pac.mouthDir = 1;

        // Ghost movement
        for (const g of ghostsRef.current) {
          g.moveTimer += dt;
          if (g.frightened) {
            g.frightenTimer -= dt;
            if (g.frightenTimer <= 0) g.frightened = false;
          }
          if (g.moveTimer >= g.moveInterval) {
            g.moveTimer = 0;
            const d = DIR_DELTA[g.dir];
            const nr = g.row + d.dr, nc = g.col + d.dc;
            if (isWalkable(maze, nr, nc)) {
              g.row = nr; g.col = nc;
            } else {
              g.dir = randomDir(maze, g.row, g.col);
            }
            // Occasionally change direction
            if (Math.random() < 0.3) {
              g.dir = randomDir(maze, g.row, g.col, g.dir);
            }
            g.x = g.col * CELL + CELL / 2;
            g.y = g.row * CELL + CELL / 2;
          }

          // Collision with pac
          const distToGhost = Math.hypot((pac.col - g.col) * CELL, (pac.row - g.row) * CELL);
          if (distToGhost < CELL) {
            if (g.frightened) {
              // eat ghost
              g.frightened = false;
              g.col = GHOST_STARTS[ghostsRef.current.indexOf(g)].col;
              g.row = GHOST_STARTS[ghostsRef.current.indexOf(g)].row;
              g.x = g.col * CELL + CELL / 2;
              g.y = g.row * CELL + CELL / 2;
              scoreRef.current += 200;
              setScore(scoreRef.current);
            } else {
              // pac dies
              livesRef.current -= 1;
              setLives(livesRef.current);
              if (livesRef.current <= 0) {
                gameOverRef.current = true;
                phaseRef.current = "over";
                phaseLocalRef.current = "idle";
                setGameOver(true);
              } else {
                resetPac();
                initGhosts();
              }
            }
          }
        }

        // Win check
        if (dotsLeftRef.current <= 0) {
          wonRef.current = true;
          phaseRef.current = "over";
          phaseLocalRef.current = "idle";
          setWon(true);
          cancelAnimationFrame(animRef.current);
          draw();
          return;
        }
      }
    }

    draw();
    animRef.current = requestAnimationFrame(loop);
  }, [draw, initGhosts, resetPac]);

  const startGame = useCallback(() => {
    playPopSound();
    const maze = buildMaze();
    mazeRef.current = maze;
    dotsLeftRef.current = countDots(maze);
    scoreRef.current = 0;
    livesRef.current = 3;
    gameOverRef.current = false;
    wonRef.current = false;
    phaseLocalRef.current = "playing";
    phaseRef.current = "playing";
    lastTimeRef.current = 0;
    resetPac();
    initGhosts();
    setScore(0);
    setLives(3);
    setGameOver(false);
    setWon(false);
    setStarted(true);
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(loop);
  }, [loop, resetPac, initGhosts, countDots]);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)) return;
      e.preventDefault();
      const pac = pacRef.current;
      if (e.key === "ArrowLeft")  pac.nextDir = "left";
      if (e.key === "ArrowRight") pac.nextDir = "right";
      if (e.key === "ArrowUp")    pac.nextDir = "up";
      if (e.key === "ArrowDown")  pac.nextDir = "down";
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Touch/swipe controls
  const touchStartRef = useRef({ x: 0, y: 0 });
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const pac = pacRef.current;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 15) pac.nextDir = "right";
      else if (dx < -15) pac.nextDir = "left";
    } else {
      if (dy > 15) pac.nextDir = "down";
      else if (dy < -15) pac.nextDir = "up";
    }
  };

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  // ── D-pad for mobile ──────────────────────────────────────────────────────
  const DPad = () => (
    <div className="grid grid-cols-3 gap-1 mt-2 md:hidden">
      {[
        { dir: "up", emoji: "▲", col: "col-start-2" },
        { dir: "left", emoji: "◀", col: "col-start-1" },
        { dir: "down", emoji: "▼", col: "col-start-2" },
        { dir: "right", emoji: "▶", col: "col-start-3" },
      ].map(({ dir, emoji, col }, i) => (
        <button
          key={dir}
          onTouchStart={() => { pacRef.current.nextDir = dir as Dir; }}
          onClick={() => { pacRef.current.nextDir = dir as Dir; }}
          className={`${col} ${i === 1 || i === 3 ? "row-start-2" : i === 0 ? "row-start-1" : "row-start-3"} w-11 h-11 rounded-xl bg-white/10 border border-white/20 text-white font-black text-lg flex items-center justify-center active:bg-white/30 select-none`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );

  // ── Start Screen ─────────────────────────────────────────────────────────
  if (!started || (gameOver && !won)) {
    return (
      <div className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
        {isLight ? <Snowfall /> : <Starfield />}
        <div className="fixed inset-0 z-40 overflow-hidden">
          <style>{`
            @keyframes pga-floatA { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
            @keyframes pga-floatB { 0%,100%{transform:translateY(-5px)} 50%{transform:translateY(7px)} }
            @keyframes pga-chomp  { 0%,100%{transform:scale(1) rotate(-10deg)} 50%{transform:scale(1.15) rotate(10deg)} }
            @keyframes pga-pulse  { 0%,100%{opacity:0.65;transform:scale(1)} 50%{opacity:1;transform:scale(1.12)} }
            @keyframes pga-shimmer{ 0%{background-position:200% center} 100%{background-position:-200% center} }
            @keyframes pga-scanY  { 0%{transform:translateY(-120%)} 100%{transform:translateY(220%)} }
            @keyframes pga-pellet { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
            .pga-fa{animation:pga-floatA 3.2s ease-in-out infinite}
            .pga-fb{animation:pga-floatB 3.8s ease-in-out infinite}
            .pga-chomp{animation:pga-chomp 0.5s ease-in-out infinite}
            .pga-fp{animation:pga-pulse 2.4s ease-in-out infinite}
            .pga-pel{animation:pga-pellet 1.2s ease-in-out infinite}
            .pga-title-shine{background:linear-gradient(90deg,#facc15,#fbbf24,#fb923c,#facc15,#fbbf24,#facc15);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:pga-shimmer 3.5s linear infinite}
            @keyframes pga-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
            .pga-btn-breathe{animation:pga-breathe 2.8s ease-in-out infinite}
            .pga-scroll{height:100%;overflow-y:auto;scrollbar-width:none;display:flex;flex-direction:column}
            .pga-wrap{flex:1;display:flex;flex-direction:column;justify-content:space-evenly;padding:0.5rem 1rem;width:100%}
            .pga-main{display:flex;flex-direction:column;gap:0.75rem}
            .pga-visual{display:flex;flex-direction:column;gap:0.5rem}
            .pga-action{display:flex;flex-direction:column;gap:0.5rem}
            @media(orientation:landscape){
              .pga-wrap{justify-content:space-evenly;padding:0.35rem 1.75rem;max-width:860px;margin:0 auto;width:100%}
              .pga-main{flex-direction:row;align-items:stretch;gap:2rem}
              .pga-visual{flex:1;justify-content:center;gap:0.6rem}
              .pga-action{flex:1;justify-content:center;gap:0.6rem}
            }
          `}</style>

          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 15%, rgba(10,30,100,1) 0%, rgba(2,4,30,1) 60%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 10% 55%, rgba(250,204,21,0.1) 0%, transparent 55%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 90% 30%, rgba(30,144,255,0.1) 0%, transparent 55%)" }} />
          <div className="absolute inset-x-0 h-[1px] pointer-events-none" style={{ background: "linear-gradient(to right,transparent,rgba(250,204,21,0.25),transparent)", animation: "pga-scanY 6s linear infinite" }} />

          <div className="pga-scroll relative z-10">
            <div className="pga-wrap">

              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-between w-full mb-1">
                  <button onClick={() => { playPopSound(); backPath ? navigate(backPath) : navigate(-1); }}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-display font-bold text-xs shadow-[0_0_15px_rgba(250,204,21,0.5)] hover:opacity-90 transition-opacity cursor-pointer">
                    <span className="text-base leading-none">←</span>
                    <span>Kembali</span>
                  </button>
                  <div className="text-[7px] tracking-[5px] text-yellow-400/60 uppercase font-bold">⬡ MATH GAME ARENA ⬡</div>
                  <button onClick={() => { playPopSound(); navigate(homePath); }}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-display font-bold text-xs shadow-[0_0_15px_rgba(250,204,21,0.5)] hover:opacity-90 transition-opacity cursor-pointer">
                    <span className="text-base leading-none">🏠</span>
                    <span>Home</span>
                  </button>
                </div>
                <div className="pga-title-shine font-display font-black leading-none" style={{ fontSize: "clamp(1.7rem,5vw,2.4rem)" }}>PAC MATH</div>
                <div className="mx-auto mt-0.5 h-0.5 w-28 rounded-full" style={{ background: "linear-gradient(to right,transparent,#facc15,#fb923c,transparent)" }} />
                <p className="text-yellow-400/70 text-[9px] font-bold tracking-wider uppercase mt-1">Makan · Hindari · Taklukkan</p>
                {topicLabel && <p className="text-white/35 text-[8px] tracking-widest uppercase mt-0.5">🕹️ {topicLabel} 🕹️</p>}
                {gameOver && (
                  <div className="mt-2 py-1.5 px-4 rounded-xl bg-red-500/20 border border-red-400/30">
                    <p className="text-red-300 text-[9px] font-bold">Skor terakhir: <span className="text-yellow-300">{score}</span></p>
                  </div>
                )}
              </div>

              <div className="pga-main">
                <div className="pga-visual">
                  <div className="flex items-end justify-center gap-5 w-full">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="text-[7px] text-yellow-400/70 font-bold tracking-wider uppercase">PAC-MAN</div>
                      <div className="relative">
                        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle,rgba(250,204,21,0.3) 0%,transparent 70%)", transform: "scale(2.4)", borderRadius: "50%" }} />
                        <div className="pga-chomp relative z-10 text-5xl" style={{ filter: "drop-shadow(0 0 16px #facc15) drop-shadow(0 0 32px #f59e0b)" }}>😁</div>
                      </div>
                      <div className="w-1.5 h-4 rounded-full" style={{ background: "linear-gradient(to bottom,rgba(250,204,21,0.8),transparent)" }} />
                      <div className="text-[8px] font-bold text-yellow-400">KAMU</div>
                    </div>
                    <div className="flex flex-col items-center pb-4">
                      <div className="text-xl font-black text-white/20">VS</div>
                    </div>
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
                            <div className="pga-fb text-2xl" style={{ animationDelay: g.delay, filter: `drop-shadow(0 0 7px ${g.glow})` }}>👻</div>
                            <span className="text-[6px] font-bold" style={{ color: g.glow }}>{g.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px" style={{ background: "linear-gradient(to right,transparent,rgba(250,204,21,0.4),transparent)" }} />

                  <div>
                    <div className="text-[7px] text-white/35 tracking-widest uppercase mb-1.5 font-bold text-center">⚡ Kapsul Warna = Pilihan Jawaban</div>
                    <div className="grid grid-cols-4 gap-1.5 w-full">
                      {(["MERAH","CYAN","PINK","ORANYE"] as string[]).map((name, i) => {
                        const glow = ["#ff4444","#00ccff","#ff88ff","#ffaa00"][i];
                        return (
                          <div key={name} className="flex flex-col items-center gap-0.5 rounded-xl py-1.5 px-1 border"
                            style={{ borderColor: glow + "44", background: glow + "10", boxShadow: `0 0 8px ${glow}30` }}>
                            <div className="pga-pel rounded-full" style={{ width: 18, height: 18, background: glow, boxShadow: `0 0 8px ${glow}`, animationDelay: `${i * 0.25}s` }} />
                            <span className="text-[7px] font-black" style={{ color: glow }}>{name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-1.5 py-0.5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="rounded-full bg-yellow-400/50" style={{ width: 4, height: 4 }} />
                    ))}
                  </div>
                </div>

                <div className="pga-action">
                  <div className="w-full h-px" style={{ background: "linear-gradient(to right,transparent,rgba(250,204,21,0.28),transparent)" }} />
                  <div className="text-[7px] text-white/35 tracking-widest uppercase mb-1 font-bold text-center">📖 Cara Bermain</div>
                  <div className="space-y-1.5">
                    {[
                      { icon: "🟡", text: "Gerakkan Pac-Man makan semua titik di labirin" },
                      { icon: "⚡", text: "Kapsul warna besar = pilihan jawaban soal matematika" },
                      { icon: "✅", text: "Kapsul BENAR = +500 poin + semua hantu ketakutan!" },
                      { icon: "👻", text: "Makan hantu ketakutan (biru) = +300 poin bonus" },
                      { icon: "❌", text: "Jangan sampai tertangkap hantu — 3 nyawa tersedia!" },
                    ].map(({ icon, text }) => (
                      <div key={text} className="flex items-start gap-2 px-1">
                        <span className="text-sm shrink-0 leading-none mt-0.5">{icon}</span>
                        <p className="text-[8px] text-white/55 leading-relaxed">{text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col items-center gap-1.5 mt-2">
                    <button onClick={startGame}
                      className="pga-btn-breathe font-display font-black text-black text-lg px-8 py-3 rounded-2xl cursor-pointer hover:scale-110 active:scale-95 w-full"
                      style={{
                        background: "linear-gradient(135deg,#facc15 0%,#fbbf24 45%,#f59e0b 100%)",
                        boxShadow: "0 0 30px rgba(250,204,21,0.85),0 0 60px rgba(245,158,11,0.35),0 4px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.3)",
                      }}>
                      {gameOver ? "🔄 MAIN LAGI!" : "😁 MULAI BERMAIN"}
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
      </div>
    );
  }

  // ── Win Screen ────────────────────────────────────────────────────────────
  if (won) {
    return (
      <div className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`}>
        {isLight ? <Snowfall /> : <Starfield />}
        <div className="relative z-10 text-center animate-slide-up px-4">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-display text-4xl font-black text-yellow-400 mb-2">KAMU MENANG!</h2>
          <p className="text-white/60 font-body mb-6">Semua titik telah dimakan!</p>
          <div className="bg-card/70 border border-white/10 rounded-2xl p-6 mb-8 inline-block">
            <p className="text-white/50 text-sm font-body mb-1">Skor Akhir</p>
            <p className="font-display text-5xl font-black text-yellow-400">{score}</p>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <button onClick={startGame}
              className="px-8 py-3 rounded-xl font-display text-base font-black text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}>
              🔄 Main Lagi
            </button>
            {backPath && (
              <button onClick={() => navigate(backPath)}
                className="text-sm text-white/40 hover:text-yellow-400 transition-colors font-body">
                ← Pilih Game Lain
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Gameplay ─────────────────────────────────────────────────────────────
  return (
    <div className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`}>
      {isLight ? <Snowfall /> : <Starfield />}
      <div className="relative z-10 flex flex-col items-center gap-2 w-full px-2">
        <div className="text-xs text-yellow-300/70 font-body tracking-widest uppercase">
          👾 PAC MATH · {topicLabel ?? "MATH GAME ARENA"}
        </div>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="rounded-2xl"
          style={{
            maxWidth: "min(532px, 95vw)",
            maxHeight: "75vh",
            boxShadow: "0 0 40px rgba(245,158,11,0.3)",
            touchAction: "none",
          }}
        />
        <DPad />
        <div className="hidden md:block text-xs text-white/30 font-body">
          Kontrol: Tombol Arah ↑ ↓ ← →
        </div>
        <div className="flex gap-6 mt-1">
          {backPath && (
            <button onClick={() => { playPopSound(); navigate(backPath); }}
              className="text-xs text-white/40 hover:text-yellow-400 transition-colors font-body">
              ← Game Lain
            </button>
          )}
          <button onClick={() => { playPopSound(); navigate(homePath); }}
            className="text-xs text-white/40 hover:text-cyan-400 transition-colors font-body">
            🏠 Menu
          </button>
        </div>
      </div>
      <GuruQuizOverlay {...guruQuiz} />
    </div>
  );
};

// ── Color helpers ─────────────────────────────────────────────────────────────
function lightenColor(hex: string, amt: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const c = (v: number) => Math.min(255, Math.round(v + amt * 255));
  return `rgb(${c(r)},${c(g)},${c(b)})`;
}
function darkenColor(hex: string, amt: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const c = (v: number) => Math.max(0, Math.round(v - amt * 255));
  return `rgb(${c(r)},${c(g)},${c(b)})`;
}

export default PacMathPage;
