import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz, type GuruQuestion } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";
import { spaceBg } from "@/assets/placeholder";

const COLS = 10;
const ROWS = 20;
const BLOCK = 28;
const CANVAS_W = COLS * BLOCK;
const CANVAS_H = ROWS * BLOCK;

type Color = string;
type Grid = (Color | null)[][];

const TETROMINOES = [
  { shape: [[1,1,1,1]], color: "#00E5FF" },           // I — electric cyan
  { shape: [[1,1],[1,1]], color: "#FFD93D" },           // O — sun gold
  { shape: [[0,1,0],[1,1,1]], color: "#C147E9" },       // T — vibrant magenta
  { shape: [[1,0],[1,0],[1,1]], color: "#FF8A3D" },     // L — bright orange
  { shape: [[0,1],[0,1],[1,1]], color: "#2196F3" },     // J — royal blue
  { shape: [[0,1,1],[1,1,0]], color: "#27E8A7" },       // S — lush green
  { shape: [[1,1,0],[0,1,1]], color: "#FF3D6E" },       // Z — hot pink
];

// Color helpers for vibrant 3D gem-style blocks
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m) return { r: 0, g: 0, b: 0 };
  return { r: parseInt(m[0], 16), g: parseInt(m[1], 16), b: parseInt(m[2], 16) };
}
function shiftColor(hex: string, amt: number): string {
  const { r, g, b } = hexToRgb(hex);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
  return `rgb(${clamp(r)}, ${clamp(g)}, ${clamp(b)})`;
}
function rgbaFromHex(hex: string, a: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function createGrid(): Grid {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function rotate(shape: number[][]): number[][] {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      rotated[c][rows - 1 - r] = shape[r][c];
  return rotated;
}

interface Piece {
  shape: number[][];
  color: Color;
  x: number;
  y: number;
}

function randomPiece(): Piece {
  const t = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
  return {
    shape: t.shape.map(r => [...r]),
    color: t.color,
    x: Math.floor(COLS / 2) - Math.floor(t.shape[0].length / 2),
    y: 0,
  };
}

function isValid(grid: Grid, piece: Piece, dx = 0, dy = 0, shape?: number[][]): boolean {
  const s = shape || piece.shape;
  for (let r = 0; r < s.length; r++) {
    for (let c = 0; c < s[r].length; c++) {
      if (!s[r][c]) continue;
      const nx = piece.x + c + dx;
      const ny = piece.y + r + dy;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
      if (ny >= 0 && grid[ny][nx]) return false;
    }
  }
  return true;
}

function placePiece(grid: Grid, piece: Piece): Grid {
  const newGrid = grid.map(r => [...r]);
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const ny = piece.y + r;
      const nx = piece.x + c;
      if (ny >= 0) newGrid[ny][nx] = piece.color;
    }
  }
  return newGrid;
}

function clearLines(grid: Grid): { grid: Grid; cleared: number } {
  const newGrid = grid.filter(row => row.some(cell => !cell));
  const cleared = ROWS - newGrid.length;
  const empty = Array.from({ length: cleared }, () => Array(COLS).fill(null));
  return { grid: [...empty, ...newGrid], cleared };
}

function getGhost(grid: Grid, piece: Piece): Piece {
  let ghost = { ...piece };
  while (isValid(grid, ghost, 0, 1)) ghost = { ...ghost, y: ghost.y + 1 };
  return ghost;
}

const SCORES = [0, 100, 300, 500, 800];
const LEVEL_SPEEDS = [800, 700, 600, 500, 400, 320, 250, 200, 160, 130];

interface TetrisGamePageProps {
  topicLabel?: string;
  backPath?: string;
  homePath?: string;
  quizQuestions?: GuruQuestion[];
}

const TetrisGamePage = ({
  topicLabel,
  backPath,
  homePath = "/ruang-untuk-guru/numatik-game",
  quizQuestions,
}: TetrisGamePageProps = {}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextCanvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Grid>(createGrid());
  const pieceRef = useRef<Piece>(randomPiece());
  const nextPieceRef = useRef<Piece>(randomPiece());
  const scoreRef = useRef(0);
  const linesRef = useRef(0);
  const levelRef = useRef(1);
  const gameOverRef = useRef(false);
  const pausedRef = useRef(false);
  const tetrisPhaseRef = useRef<string>("idle");
  const guruQuiz = useGuruQuiz(tetrisPhaseRef, "playing", 25_000, quizQuestions);
  const dropTimerRef = useRef(0);
  const animRef = useRef(0);
  const lastTimeRef = useRef(0);
  // When true (e.g. user holds the up button), the falling speed is slowed.
  const slowDropRef = useRef(false);
  // Multiplier applied to the per-level drop interval while slowDrop is on.
  const SLOW_DROP_FACTOR = 4;
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [flashRows, setFlashRows] = useState<number[]>([]);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const drawBlock = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, color: Color, alpha = 1) => {
    const px = x * BLOCK;
    const py = y * BLOCK;
    const inset = 1;
    const size = BLOCK - inset * 2;
    const bevel = Math.max(2, Math.floor(BLOCK * 0.18));

    ctx.globalAlpha = alpha;

    // 1) Soft outer glow halo
    ctx.shadowColor = rgbaFromHex(color, 0.55);
    ctx.shadowBlur = 8;
    ctx.fillStyle = color;
    ctx.fillRect(px + inset, py + inset, size, size);
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    // 2) Diagonal gradient body for depth (light TL → deep BR)
    const grad = ctx.createLinearGradient(px + inset, py + inset, px + inset + size, py + inset + size);
    grad.addColorStop(0, shiftColor(color, 0.22));
    grad.addColorStop(0.55, color);
    grad.addColorStop(1, shiftColor(color, -0.28));
    ctx.fillStyle = grad;
    ctx.fillRect(px + inset, py + inset, size, size);

    // 3) Inner radial sheen — glossy gem highlight in the top-left
    const sheenR = size * 0.85;
    const sheen = ctx.createRadialGradient(
      px + inset + size * 0.32, py + inset + size * 0.28, 0,
      px + inset + size * 0.32, py + inset + size * 0.28, sheenR
    );
    sheen.addColorStop(0, "rgba(255,255,255,0.55)");
    sheen.addColorStop(0.4, "rgba(255,255,255,0.12)");
    sheen.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sheen;
    ctx.fillRect(px + inset, py + inset, size, size);

    // 4) Beveled edges — light on top/left
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillRect(px + inset, py + inset, size, bevel);                 // top
    ctx.fillRect(px + inset, py + inset, bevel, size);                 // left
    // Corner highlight pop
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillRect(px + inset + 1, py + inset + 1, bevel - 1, 1);
    ctx.fillRect(px + inset + 1, py + inset + 1, 1, bevel - 1);

    // 5) Beveled edges — dark on bottom/right
    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.fillRect(px + inset, py + inset + size - bevel, size, bevel);  // bottom
    ctx.fillRect(px + inset + size - bevel, py + inset, bevel, size);  // right

    // 6) Crisp outline for definition
    ctx.strokeStyle = rgbaFromHex(color, 0.95);
    ctx.lineWidth = 1;
    ctx.strokeRect(px + inset + 0.5, py + inset + 0.5, size - 1, size - 1);

    ctx.globalAlpha = 1;
  }, []);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = isLight ? "#1a1a2e" : "#0d0d1a";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.strokeStyle = isLight ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.04)";
    ctx.lineWidth = 0.5;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        ctx.strokeRect(c * BLOCK, r * BLOCK, BLOCK, BLOCK);
      }
    }

    const grid = gridRef.current;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (grid[r][c]) {
          const isFlash = flashRows.includes(r);
          drawBlock(ctx, c, r, isFlash ? "#FFFFFF" : grid[r][c]!, isFlash ? 0.85 : 1);
        }
      }
    }
  }, [isLight, drawBlock, flashRows]);

  const drawPiece = useCallback((ctx: CanvasRenderingContext2D, piece: Piece, alpha = 1) => {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          drawBlock(ctx, piece.x + c, piece.y + r, piece.color, alpha);
        }
      }
    }
  }, [drawBlock]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    drawGrid(ctx);
    const ghost = getGhost(gridRef.current, pieceRef.current);
    if (ghost.y !== pieceRef.current.y) drawPiece(ctx, ghost, 0.25);
    drawPiece(ctx, pieceRef.current);

    const nextCanvas = nextCanvasRef.current;
    if (nextCanvas) {
      const nc = nextCanvas.getContext("2d")!;
      nc.fillStyle = isLight ? "#1a1a2e" : "#0d0d1a";
      nc.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
      const np = nextPieceRef.current;
      const offX = Math.floor((4 - np.shape[0].length) / 2);
      const offY = Math.floor((4 - np.shape.length) / 2);
      for (let r = 0; r < np.shape.length; r++) {
        for (let c = 0; c < np.shape[r].length; c++) {
          if (np.shape[r][c]) drawBlock(nc, offX + c, offY + r, np.color);
        }
      }
    }
  }, [drawGrid, drawPiece, isLight]);

  const lockPiece = useCallback(() => {
    const newGrid = placePiece(gridRef.current, pieceRef.current);
    const { grid: clearedGrid, cleared } = clearLines(newGrid);

    if (cleared > 0) {
      const clearedIdxs: number[] = [];
      for (let r = 0; r < ROWS; r++) {
        if (newGrid[r].every(c => c !== null)) clearedIdxs.push(r);
      }
      setFlashRows(clearedIdxs);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      flashTimerRef.current = setTimeout(() => setFlashRows([]), 300);
    }

    gridRef.current = clearedGrid;
    scoreRef.current += SCORES[cleared] * levelRef.current;
    linesRef.current += cleared;
    levelRef.current = Math.min(10, Math.floor(linesRef.current / 10) + 1);
    setScore(scoreRef.current);
    setLines(linesRef.current);
    setLevel(levelRef.current);

    const next = nextPieceRef.current;
    pieceRef.current = next;
    nextPieceRef.current = randomPiece();

    if (!isValid(clearedGrid, next)) {
      gameOverRef.current = true;
      tetrisPhaseRef.current = "over";
      setGameOver(true);
      cancelAnimationFrame(animRef.current);
    }
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    if (gameOverRef.current) return;
    if (guruQuiz.isPausedRef.current || pausedRef.current) { animRef.current = requestAnimationFrame(gameLoop); return; }
    const dt = Math.min(timestamp - (lastTimeRef.current || timestamp), 100);
    lastTimeRef.current = timestamp;
    const baseSpeed = LEVEL_SPEEDS[Math.min(levelRef.current - 1, LEVEL_SPEEDS.length - 1)];
    const speed = slowDropRef.current ? baseSpeed * SLOW_DROP_FACTOR : baseSpeed;
    dropTimerRef.current += dt;
    if (dropTimerRef.current >= speed) {
      dropTimerRef.current = 0;
      if (isValid(gridRef.current, pieceRef.current, 0, 1)) {
        pieceRef.current = { ...pieceRef.current, y: pieceRef.current.y + 1 };
      } else {
        lockPiece();
      }
    }
    render();
    animRef.current = requestAnimationFrame(gameLoop);
  }, [lockPiece, render]);

  const startGame = useCallback(() => {
    playPopSound();
    gridRef.current = createGrid();
    pieceRef.current = randomPiece();
    nextPieceRef.current = randomPiece();
    scoreRef.current = 0;
    linesRef.current = 0;
    levelRef.current = 1;
    gameOverRef.current = false;
    pausedRef.current = false;
    tetrisPhaseRef.current = "playing";
    dropTimerRef.current = 0;
    lastTimeRef.current = 0;
    slowDropRef.current = false;
    if (hardDropAnimRef.current) {
      clearInterval(hardDropAnimRef.current);
      hardDropAnimRef.current = null;
    }
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setPaused(false);
    setStarted(true);
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  const togglePause = useCallback(() => {
    if (gameOverRef.current) return;
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    if (!pausedRef.current) {
      lastTimeRef.current = 0;
      animRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameLoop]);

  const moveLeft = useCallback(() => {
    if (!started || gameOverRef.current || pausedRef.current) return;
    if (isValid(gridRef.current, pieceRef.current, -1, 0))
      pieceRef.current = { ...pieceRef.current, x: pieceRef.current.x - 1 };
    render();
  }, [started, render]);

  const moveRight = useCallback(() => {
    if (!started || gameOverRef.current || pausedRef.current) return;
    if (isValid(gridRef.current, pieceRef.current, 1, 0))
      pieceRef.current = { ...pieceRef.current, x: pieceRef.current.x + 1 };
    render();
  }, [started, render]);

  const moveDown = useCallback(() => {
    if (!started || gameOverRef.current || pausedRef.current) return;
    if (isValid(gridRef.current, pieceRef.current, 0, 1)) {
      pieceRef.current = { ...pieceRef.current, y: pieceRef.current.y + 1 };
      dropTimerRef.current = 0;
    } else {
      lockPiece();
    }
    render();
  }, [started, render, lockPiece]);

  // Slow-motion hard drop: instead of teleporting the piece to the bottom,
  // animate it downward one row at a time so the user can see the descent.
  const hardDropAnimRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const HARD_DROP_STEP_MS = 35; // ~28 rows/sec — fast slide but clearly visible

  const stopHardDropAnim = useCallback(() => {
    if (hardDropAnimRef.current) {
      clearInterval(hardDropAnimRef.current);
      hardDropAnimRef.current = null;
    }
  }, []);

  const hardDrop = useCallback(() => {
    if (!started || gameOverRef.current || pausedRef.current) return;
    if (hardDropAnimRef.current) return; // animation already in progress

    hardDropAnimRef.current = setInterval(() => {
      if (gameOverRef.current || pausedRef.current || guruQuiz.isPausedRef.current) {
        stopHardDropAnim();
        return;
      }
      if (isValid(gridRef.current, pieceRef.current, 0, 1)) {
        pieceRef.current = { ...pieceRef.current, y: pieceRef.current.y + 1 };
        dropTimerRef.current = 0;
        render();
      } else {
        stopHardDropAnim();
        lockPiece();
        render();
      }
    }, HARD_DROP_STEP_MS);
  }, [started, render, lockPiece, stopHardDropAnim, guruQuiz.isPausedRef]);

  const rotatePiece = useCallback(() => {
    if (!started || gameOverRef.current || pausedRef.current) return;
    const rotated = rotate(pieceRef.current.shape);
    const kicks = [0, -1, 1, -2, 2];
    for (const kick of kicks) {
      if (isValid(gridRef.current, pieceRef.current, kick, 0, rotated)) {
        pieceRef.current = { ...pieceRef.current, shape: rotated, x: pieceRef.current.x + kick };
        break;
      }
    }
    render();
  }, [started, render]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowLeft","ArrowRight","ArrowDown","ArrowUp"," "].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowLeft") moveLeft();
      else if (e.key === "ArrowRight") moveRight();
      else if (e.key === "ArrowDown") moveDown();
      else if (e.key === "ArrowUp") rotatePiece();
      else if (e.key === " ") hardDrop();
      else if (e.key === "p" || e.key === "P" || e.key === "Escape") togglePause();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moveLeft, moveRight, moveDown, rotatePiece, hardDrop, togglePause]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animRef.current);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      if (hardDropAnimRef.current) {
        clearInterval(hardDropAnimRef.current);
        hardDropAnimRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = isLight ? "#1a1a2e" : "#0d0d1a";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    const nextCanvas = nextCanvasRef.current;
    if (nextCanvas) {
      const nc = nextCanvas.getContext("2d")!;
      nc.fillStyle = isLight ? "#1a1a2e" : "#0d0d1a";
      nc.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    }
  }, [isLight]);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    const dt = Date.now() - touchStartTime.current;
    if (dt < 200 && Math.abs(dx) < 10 && Math.abs(dy) < 10) { rotatePiece(); return; }
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20) moveRight();
      else if (dx < -20) moveLeft();
    } else {
      if (dy > 40) hardDrop();
      else if (dy > 15) moveDown();
    }
  };

  if (!started) {
    const tetrominoBlocks: Array<{ pos: string; anim: string; cells: number[][]; color: string; glow: string; size: string }> = [
      { pos: "top-[8%] left-[6%]", anim: "animate-float-slow", cells: [[1,1,1,1]], color: "bg-cyan-400", glow: "rgba(0,255,255,0.55)", size: "w-3 h-3 md:w-4 md:h-4" },
      { pos: "top-[12%] right-[10%]", anim: "animate-float-medium", cells: [[1,1],[1,1]], color: "bg-yellow-400", glow: "rgba(255,215,0,0.55)", size: "w-3 h-3 md:w-4 md:h-4" },
      { pos: "top-[40%] left-[4%]", anim: "animate-float-fast", cells: [[0,1,0],[1,1,1]], color: "bg-fuchsia-500", glow: "rgba(217,70,239,0.6)", size: "w-3 h-3 md:w-4 md:h-4" },
      { pos: "top-[35%] right-[5%]", anim: "animate-float-slow", cells: [[1,0],[1,0],[1,1]], color: "bg-orange-400", glow: "rgba(255,140,0,0.55)", size: "w-3 h-3 md:w-4 md:h-4" },
      { pos: "bottom-[18%] left-[8%]", anim: "animate-float-medium", cells: [[0,1],[0,1],[1,1]], color: "bg-blue-500", glow: "rgba(30,144,255,0.55)", size: "w-3 h-3 md:w-4 md:h-4" },
      { pos: "bottom-[22%] right-[7%]", anim: "animate-float-fast", cells: [[0,1,1],[1,1,0]], color: "bg-emerald-400", glow: "rgba(0,255,136,0.55)", size: "w-3 h-3 md:w-4 md:h-4" },
      { pos: "bottom-[8%] left-[14%]", anim: "animate-float-slow", cells: [[1,1,0],[0,1,1]], color: "bg-pink-500", glow: "rgba(255,68,68,0.55)", size: "w-3 h-3 md:w-4 md:h-4" },
      { pos: "top-[55%] right-[14%]", anim: "animate-float-fast", cells: [[1,1],[1,1]], color: "bg-fuchsia-400", glow: "rgba(232,121,249,0.55)", size: "w-2.5 h-2.5 md:w-3.5 md:h-3.5" },
    ];

    return (
      <>
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
          <img src={spaceBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950/80 via-background/40 to-fuchsia-950/70" />
          <Starfield />

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {tetrominoBlocks.map((t, i) => (
              <div key={i} className={`absolute ${t.pos} ${t.anim}`}>
                <div className="flex flex-col gap-[2px] opacity-70">
                  {t.cells.map((row, r) => (
                    <div key={r} className="flex gap-[2px]">
                      {row.map((cell, c) =>
                        cell ? (
                          <div
                            key={c}
                            className={`${t.size} ${t.color} rounded-sm`}
                            style={{ boxShadow: `0 0 12px ${t.glow}, inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.25)` }}
                          />
                        ) : (
                          <div key={c} className={t.size} />
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 text-center animate-slide-up px-4">
            <div className="mb-2">
              <h1 className="font-display text-3xl md:text-5xl font-black tracking-wider">
                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(217,70,239,0.55)]">
                  MATH GAME ARENA
                </span>
              </h1>
            </div>
            <div className="mb-2">
              <h2 className="font-display text-4xl md:text-6xl font-black tracking-[0.18em]">
                <span className="bg-gradient-to-r from-fuchsia-300 via-pink-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(236,72,153,0.6)]">
                  🧩 TETRIS
                </span>
              </h2>
            </div>
            <div className="mb-6">
              <h3 className="font-display text-2xl md:text-4xl font-black tracking-[0.25em]">
                <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(255,180,0,0.55)]">
                  NUMATIK
                </span>
              </h3>
            </div>

            <div className="inline-block mb-8">
              <div className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500/25 to-fuchsia-500/25 border border-fuchsia-400/40 backdrop-blur-sm">
                <span className="font-display text-sm md:text-base font-bold text-fuchsia-200 tracking-wide">
                  {topicLabel ?? "MATH GAME"}
                </span>
              </div>
            </div>

            <div className="bg-card/70 backdrop-blur-md border border-fuchsia-500/30 rounded-2xl p-6 max-w-md mx-auto mb-8 shadow-[0_0_30px_rgba(217,70,239,0.15)]">
              <h3 className="font-display text-lg font-bold text-fuchsia-300 mb-4 flex items-center justify-center gap-2">
                <span className="text-xl">🧩</span> CARA BERMAIN <span className="text-xl">🧩</span>
              </h3>
              <ul className="text-left space-y-3 font-body text-sm text-foreground/90">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-fuchsia-500/30 flex items-center justify-center text-fuchsia-200 font-bold text-xs">1</span>
                  <span>Susun balok yang jatuh agar membentuk <strong className="text-fuchsia-300">baris penuh</strong> tanpa celah</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-fuchsia-500/30 flex items-center justify-center text-fuchsia-200 font-bold text-xs">2</span>
                  <span>Gunakan tombol <strong className="text-fuchsia-300">◀ / ▶</strong> untuk menggeser balok dan <strong className="text-yellow-300">PUTAR</strong> untuk mengubah posisi balok</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-fuchsia-500/30 flex items-center justify-center text-fuchsia-200 font-bold text-xs">3</span>
                  <span><strong className="text-yellow-300">Tahan tombol ↑</strong> untuk memperlambat jatuhnya balok, atau tekan tombol <strong className="text-fuchsia-300">↓</strong> untuk menjatuhkannya langsung ke bawah</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-fuchsia-500/30 flex items-center justify-center text-fuchsia-200 font-bold text-xs">4</span>
                  <span>Setiap baris yang penuh akan hilang dan menambah <strong className="text-green-400">skor</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-fuchsia-500/30 flex items-center justify-center text-fuchsia-200 font-bold text-xs">5</span>
                  <span className="text-xs">Di komputer: <strong className="text-fuchsia-300">← →</strong> geser, <strong className="text-fuchsia-300">↑</strong> putar, <strong className="text-fuchsia-300">↓</strong> turun, <strong className="text-yellow-300">SPASI</strong> hard drop, <strong className="text-fuchsia-300">P</strong> pause</span>
                </li>
              </ul>
            </div>

            <button
              onClick={startGame}
              className="relative font-display text-xl md:text-2xl px-14 py-5 rounded-2xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600 text-white font-black tracking-wider cursor-pointer shadow-[0_0_40px_rgba(217,70,239,0.55)] hover:shadow-[0_0_60px_rgba(217,70,239,0.75)] transition-shadow duration-300 animate-pulse-scale"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span>&#9658;</span> MULAI GAME <span>&#9658;</span>
              </span>
            </button>
          </div>
        </div>

        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-3 md:p-4 pointer-events-none"
          style={{
            paddingTop: "max(0.75rem, env(safe-area-inset-top, 0px))",
            paddingLeft: "max(0.75rem, env(safe-area-inset-left, 0px))",
            paddingRight: "max(0.75rem, env(safe-area-inset-right, 0px))",
          }}
        >
          <button
            onClick={() => { playPopSound(); if (backPath) navigate(backPath); else navigate(-1); }}
            className="pointer-events-auto shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(217,70,239,0.45)] hover:opacity-90 transition-opacity cursor-pointer"
            title="Kembali"
          >
            <span className="text-base leading-none">←</span>
            <span className="hidden sm:inline">Kembali</span>
          </button>
          <button
            onClick={() => { playPopSound(); navigate(homePath); }}
            className="pointer-events-auto shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(217,70,239,0.45)] hover:opacity-90 transition-opacity cursor-pointer"
            title="Menu Utama"
          >
            <span className="text-base leading-none">🏠</span>
            <span className="hidden sm:inline">Home</span>
          </button>
        </div>
      </>
    );
  }

  return (
    <div className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}

      <div className="relative z-10 w-full max-w-2xl px-2 pt-7 pb-4 flex flex-col items-center">
        <div className="flex items-center justify-between w-full mb-3 gap-2">
          <button
            onClick={() => { playPopSound(); if (backPath) navigate(backPath); else navigate(-1); }}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(217,70,239,0.45)] hover:opacity-90 transition-opacity cursor-pointer"
            title="Kembali ke pilihan game"
          >
            <span className="text-base leading-none">←</span>
            <span className="hidden sm:inline">Kembali</span>
          </button>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan flex-1 text-center leading-tight">
            🧩 TETRIS NUMATIK
            {topicLabel ? <span className="block text-[10px] md:text-xs text-fuchsia-300 font-body mt-0.5">{topicLabel}</span> : null}
          </h1>
          <button
            onClick={() => { playPopSound(); navigate(homePath); }}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600 text-white font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(217,70,239,0.45)] hover:opacity-90 transition-opacity cursor-pointer"
            title="Menu Utama"
          >
            <span className="text-base leading-none">🏠</span>
            <span className="hidden sm:inline">Home</span>
          </button>
        </div>

        <div className="flex gap-4 items-start justify-center w-full">
          <div className="flex flex-col gap-3">
            <div
              className="rounded-xl border border-border shadow-2xl overflow-hidden relative"
              style={{ width: CANVAS_W, flexShrink: 0, maxHeight: 'calc(100dvh - 175px)', aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} style={{ display: "block", width: '100%', height: '100%' }} />

              {gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/75">
                  <div className="text-center px-5">
                    <div className="text-4xl mb-2">💥</div>
                    <h2 className="font-display text-2xl font-bold text-red-400 mb-2">GAME OVER</h2>
                    <div className="text-white text-sm mb-1">Skor: <span className="text-yellow-400 font-bold text-xl">{score}</span></div>
                    <div className="text-white/60 text-xs mb-4">Baris: {lines} &nbsp;·&nbsp; Level: {level}</div>
                    <button
                      onClick={startGame}
                      className="bg-accent text-black font-bold px-7 py-3 rounded-xl hover:opacity-90 transition cursor-pointer shadow-lg"
                    >
                      Main Lagi
                    </button>
                  </div>
                </div>
              )}

              {paused && !gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <div className="text-center">
                    <div className="text-4xl mb-3">⏸️</div>
                    <h2 className="font-display text-2xl font-bold text-accent mb-3">PAUSE</h2>
                    <button
                      onClick={togglePause}
                      className="bg-accent text-black font-bold px-7 py-3 rounded-xl hover:opacity-90 transition cursor-pointer"
                    >
                      ▶ Lanjut
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center items-center">
              {/* Left arrow */}
              <button
                onPointerDown={moveLeft}
                aria-label="Geser kiri"
                className="bg-card/80 border border-border text-white font-bold w-12 h-12 rounded-xl hover:border-accent transition cursor-pointer select-none active:scale-95 text-lg"
              >◀</button>

              {/* Up / Down stacked (D-pad style) */}
              <div className="flex flex-col gap-2 items-center">
                <button
                  onPointerDown={() => { slowDropRef.current = true; }}
                  onPointerUp={() => { slowDropRef.current = false; }}
                  onPointerLeave={() => { slowDropRef.current = false; }}
                  onPointerCancel={() => { slowDropRef.current = false; }}
                  onContextMenu={(e) => e.preventDefault()}
                  aria-label="Tahan untuk perlambat balok"
                  title="Tahan untuk memperlambat jatuhnya balok"
                  className="bg-yellow-500/15 border border-yellow-400/60 text-yellow-200 font-bold w-12 h-10 rounded-xl hover:bg-yellow-500/30 transition cursor-pointer select-none active:scale-95 text-sm leading-none flex items-center justify-center"
                >↑</button>
                <button
                  onPointerDown={hardDrop}
                  aria-label="Jatuhkan balok ke bawah"
                  className="bg-card/80 border border-border text-white font-bold w-12 h-10 rounded-xl hover:border-accent transition cursor-pointer select-none active:scale-95 text-sm leading-none flex items-center justify-center"
                >↓</button>
              </div>

              {/* Right arrow */}
              <button
                onPointerDown={moveRight}
                aria-label="Geser kanan"
                className="bg-card/80 border border-border text-white font-bold w-12 h-12 rounded-xl hover:border-accent transition cursor-pointer select-none active:scale-95 text-lg"
              >▶</button>

              {/* Rotate piece */}
              <button
                onPointerDown={rotatePiece}
                aria-label="Putar balok"
                className="bg-accent/20 border border-accent text-accent font-bold w-12 h-12 rounded-xl hover:bg-accent/40 transition cursor-pointer select-none active:scale-95 text-xs leading-tight"
              >PUTAR</button>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[100px]">
            <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-3">
              <div className="text-xs text-white/50 font-display mb-1">SKOR</div>
              <div className="text-yellow-400 font-bold text-lg font-display">{score}</div>
            </div>
            <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-3">
              <div className="text-xs text-white/50 font-display mb-1">LEVEL</div>
              <div className="text-accent font-bold text-lg font-display">{level}</div>
            </div>
            <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-3">
              <div className="text-xs text-white/50 font-display mb-1">BARIS</div>
              <div className="text-white font-bold text-lg font-display">{lines}</div>
            </div>
            <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-3">
              <div className="text-xs text-white/50 font-display mb-1">BERIKUTNYA</div>
              <canvas ref={nextCanvasRef} width={4 * BLOCK} height={4 * BLOCK} className="rounded-lg" style={{ display: "block", marginTop: 4 }} />
            </div>
            {started && !gameOver && (
              <button
                onClick={togglePause}
                className="bg-card/80 border border-border text-white text-xs font-bold py-2 px-3 rounded-xl hover:border-accent transition cursor-pointer"
              >
                {paused ? "▶ Lanjut" : "⏸ Pause"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 text-center text-white/40 text-xs font-body">
          Keyboard: ← → geser &nbsp;·&nbsp; ↑ putar &nbsp;·&nbsp; ↓ turun &nbsp;·&nbsp; SPASI hard drop &nbsp;·&nbsp; P pause
        </div>
      <GuruQuizOverlay {...guruQuiz} />
      </div>
    </div>
  );
};

export default TetrisGamePage;
