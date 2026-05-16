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
      <div className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`}>
        {isLight ? <Snowfall /> : <Starfield />}
        <div className="relative z-10 text-center animate-slide-up px-4">
          <div className="mb-3">
            <h1 className="font-display text-3xl md:text-5xl font-black">
              <span className="bg-gradient-to-r from-yellow-300 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.6)]">
                MATH GAME ARENA
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h2 className="font-display text-4xl md:text-6xl font-black tracking-wider">
              <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(255,200,0,0.6)]">
                👾 PAC MATH
              </span>
            </h2>
          </div>
          <div className="mb-6 inline-block">
            <div className="px-5 py-2 rounded-full bg-gradient-to-r from-yellow-500/25 to-orange-500/25 border border-yellow-400/40 backdrop-blur-sm">
              <span className="font-display text-sm font-bold text-yellow-200 tracking-wide">
                {topicLabel ?? "MATH GAME"}
              </span>
            </div>
          </div>
          {gameOver && (
            <div className="mb-4 py-3 px-6 rounded-xl bg-red-500/20 border border-red-400/30">
              <p className="text-red-300 font-body">Skor terakhir: <span className="font-black text-xl text-yellow-300">{score}</span></p>
            </div>
          )}
          <div className="bg-card/70 backdrop-blur-md border border-yellow-500/30 rounded-2xl p-6 max-w-xs mx-auto mb-8">
            <h3 className="font-display text-base font-bold text-yellow-300 mb-3 flex items-center justify-center gap-2">
              🎮 CARA BERMAIN
            </h3>
            <ul className="text-sm text-white/70 font-body space-y-2 text-left">
              <li>🟡 Gerakkan Pac-Man dengan tombol arah / swipe</li>
              <li>⚪ Makan semua titik untuk menang</li>
              <li>🟣 Kapsul ungu: hantu jadi takut!</li>
              <li>👻 Hindari hantu — jika tertangkap kehilangan nyawa</li>
              <li>❓ Soal muncul setiap 25 detik!</li>
            </ul>
          </div>
          <button
            onClick={startGame}
            className="px-10 py-4 rounded-2xl font-display text-xl font-black text-white transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)", boxShadow: "0 4px 30px rgba(245,158,11,0.5)" }}
          >
            🚀 {gameOver ? "MAIN LAGI!" : "MULAI MAIN!"}
          </button>
          <div className="mt-6 flex gap-4 justify-center">
            {backPath && (
              <button onClick={() => { playPopSound(); navigate(backPath); }}
                className="text-sm text-white/40 hover:text-yellow-400 transition-colors font-body">
                ← Pilih Game Lain
              </button>
            )}
            <button onClick={() => { playPopSound(); navigate(homePath); }}
              className="text-sm text-white/40 hover:text-cyan-400 transition-colors font-body">
              🏠 Menu Utama
            </button>
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
