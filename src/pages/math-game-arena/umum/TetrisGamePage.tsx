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
    return (
      <div className="fixed inset-0 z-40 overflow-hidden">
        <style>{`
          @keyframes tg-floatA { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
          @keyframes tg-floatB { 0%,100%{transform:translateY(-5px)} 50%{transform:translateY(7px)} }
          @keyframes tg-shimmer{ 0%{background-position:200% center} 100%{background-position:-200% center} }
          @keyframes tg-scanY  { 0%{transform:translateY(-120%)} 100%{transform:translateY(220%)} }
          @keyframes tg-breathe{ 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
          .tg-fa{animation:tg-floatA 3.2s ease-in-out infinite}
          .tg-fb{animation:tg-floatB 3.8s ease-in-out infinite}
          .tg-title-shine{background:linear-gradient(90deg,#e879f9,#c084fc,#818cf8,#e879f9,#c084fc,#e879f9);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:tg-shimmer 3.5s linear infinite}
          .tg-btn-breathe{animation:tg-breathe 2.8s ease-in-out infinite}
          .tg-scroll{height:100%;overflow-y:auto;scrollbar-width:none;display:flex;flex-direction:column}
          .tg-wrap{flex:1;display:flex;flex-direction:column;justify-content:space-evenly;padding:0.5rem 1rem;width:100%}
          .tg-main{display:flex;flex-direction:column;gap:0.75rem}
          .tg-visual{display:flex;flex-direction:column;gap:0.5rem}
          .tg-action{display:flex;flex-direction:column;gap:0.5rem}
          @media(orientation:landscape){
            .tg-wrap{justify-content:space-evenly;padding:0.35rem 1.75rem;max-width:860px;margin:0 auto;width:100%}
            .tg-main{flex-direction:row;align-items:stretch;gap:2rem}
            .tg-visual{flex:1;justify-content:center;gap:0.6rem}
            .tg-action{flex:1;justify-content:center;gap:0.6rem}
          }
        `}</style>

        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 15%, rgba(40,5,70,1) 0%, rgba(5,2,15,1) 60%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 10% 55%, rgba(168,85,247,0.15) 0%, transparent 55%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 90% 30%, rgba(236,72,153,0.12) 0%, transparent 55%)" }} />
        <div className="absolute inset-x-0 h-[1px] pointer-events-none" style={{ background: "linear-gradient(to right,transparent,rgba(192,132,252,0.25),transparent)", animation: "tg-scanY 6s linear infinite" }} />

        {([
          { pos: "top-[8%] left-[6%]",       anim: "tg-fa", cells: [[1,1,1,1]] as number[][], color: "#00E5FF", delay: "0s"   },
          { pos: "top-[12%] right-[10%]",     anim: "tg-fb", cells: [[1,1],[1,1]] as number[][], color: "#FFD93D", delay: "0.5s" },
          { pos: "top-[40%] left-[4%]",       anim: "tg-fa", cells: [[0,1,0],[1,1,1]] as number[][], color: "#C147E9", delay: "1s"   },
          { pos: "bottom-[18%] right-[6%]",   anim: "tg-fb", cells: [[0,1,1],[1,1,0]] as number[][], color: "#27E8A7", delay: "0.3s" },
          { pos: "bottom-[10%] left-[12%]",   anim: "tg-fa", cells: [[1,1,0],[0,1,1]] as number[][], color: "#FF3D6E", delay: "0.8s" },
        ]).map((t, i) => (
          <div key={i} className={`absolute ${t.pos} pointer-events-none ${t.anim}`} style={{ animationDelay: t.delay }}>
            <div className="flex flex-col gap-[2px] opacity-55">
              {t.cells.map((row, r) => (
                <div key={r} className="flex gap-[2px]">
                  {row.map((cell, c) => cell ? (
                    <div key={c} className="w-3.5 h-3.5 rounded-sm" style={{ background: t.color, boxShadow: `0 0 8px ${t.color}` }} />
                  ) : (
                    <div key={c} className="w-3.5 h-3.5" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="tg-scroll relative z-10">
          <div className="tg-wrap">

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-between w-full mb-1">
                <button onClick={() => { playPopSound(); if (backPath) navigate(backPath); else navigate(-1); }}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600 text-white font-display font-bold text-xs shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:opacity-90 transition-opacity cursor-pointer">
                  <span className="text-base leading-none">←</span>
                  <span>Kembali</span>
                </button>
                <div className="text-[7px] tracking-[5px] text-fuchsia-400/60 uppercase font-bold">⬡ MATH GAME ARENA ⬡</div>
                <button onClick={() => { playPopSound(); navigate(homePath); }}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600 text-white font-display font-bold text-xs shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:opacity-90 transition-opacity cursor-pointer">
                  <span className="text-base leading-none">🏠</span>
                  <span>Home</span>
                </button>
              </div>
              <div className="tg-title-shine font-display font-black leading-none" style={{ fontSize: "clamp(1.7rem,5vw,2.4rem)" }}>TETRIS NUMATIK</div>
              <div className="mx-auto mt-0.5 h-0.5 w-28 rounded-full" style={{ background: "linear-gradient(to right,transparent,#c084fc,#e879f9,transparent)" }} />
              <p className="text-fuchsia-400/70 text-[9px] font-bold tracking-wider uppercase mt-1">🧩 Susun · Hapus Baris · Skor!</p>
              {topicLabel && <p className="text-white/35 text-[8px] tracking-widest uppercase mt-0.5">🕹️ {topicLabel} 🕹️</p>}
            </div>

            <div className="tg-main">
              <div className="tg-visual">
                <div className="flex items-center justify-center gap-5 w-full">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="text-[7px] text-fuchsia-400/70 font-bold tracking-wider uppercase">BALOK JATUH</div>
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle,rgba(192,132,252,0.25) 0%,transparent 70%)", transform: "scale(2.2)", borderRadius: "50%" }} />
                      <div className="tg-fa relative z-10 text-5xl" style={{ filter: "drop-shadow(0 0 14px #c084fc) drop-shadow(0 0 28px #a855f7)" }}>🧩</div>
                    </div>
                    <div className="w-1.5 h-4 rounded-full" style={{ background: "linear-gradient(to bottom,rgba(192,132,252,0.8),transparent)" }} />
                    <div className="text-[8px] font-bold text-fuchsia-400">KAMU</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-[7px] text-white/40 font-bold tracking-wider uppercase mb-1">BALOK-BALOK</div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {([
                        { color: "#00E5FF", cells: [[1,1,1,1]] as number[][], label: "I" },
                        { color: "#FFD93D", cells: [[1,1],[1,1]] as number[][], label: "O" },
                        { color: "#C147E9", cells: [[0,1,0],[1,1,1]] as number[][], label: "T" },
                        { color: "#FF3D6E", cells: [[1,1,0],[0,1,1]] as number[][], label: "Z" },
                      ]).map((t, i) => (
                        <div key={t.label} className="flex flex-col items-center gap-0.5 rounded-lg p-1.5 border"
                          style={{ borderColor: t.color + "55", background: t.color + "12", boxShadow: `0 0 10px ${t.color}33` }}>
                          <div className="tg-fb flex flex-col gap-[2px]" style={{ animationDelay: `${i * 0.4}s` }}>
                            {t.cells.map((row, r) => (
                              <div key={r} className="flex gap-[2px]">
                                {row.map((cell, c) => cell ? (
                                  <div key={c} className="w-2.5 h-2.5 rounded-sm" style={{ background: t.color, boxShadow: `0 0 5px ${t.color}` }} />
                                ) : (
                                  <div key={c} className="w-2.5 h-2.5" />
                                ))}
                              </div>
                            ))}
                          </div>
                          <span className="text-[6px] font-bold" style={{ color: t.color }}>{t.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full h-px" style={{ background: "linear-gradient(to right,transparent,rgba(192,132,252,0.4),transparent)" }} />

                <div>
                  <div className="text-[7px] text-white/35 tracking-widest uppercase mb-1.5 font-bold text-center">⚡ Kontrol</div>
                  <div className="grid grid-cols-3 gap-1.5 w-full">
                    {([
                      { icon: "◀▶",  label: "GESER",  desc: "← → atau A/D",    color: "#c084fc" },
                      { icon: "🔄",  label: "PUTAR",  desc: "↑ / Swipe atas",  color: "#f472b6" },
                      { icon: "⬇️",  label: "JATUH",  desc: "↓ · Spasi drop",  color: "#facc15" },
                    ] as const).map(w => (
                      <div key={w.label} className="flex flex-col items-center gap-0.5 rounded-xl py-1.5 px-1 border"
                        style={{ borderColor: w.color + "44", background: w.color + "0f", boxShadow: `0 0 8px ${w.color}30` }}>
                        <span className="text-base leading-none" style={{ filter: `drop-shadow(0 0 5px ${w.color})` }}>{w.icon}</span>
                        <span className="text-[7px] font-black" style={{ color: w.color }}>{w.label}</span>
                        <span className="text-[6px] text-white/35 text-center leading-tight">{w.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="tg-action">
                <div className="w-full h-px" style={{ background: "linear-gradient(to right,transparent,rgba(192,132,252,0.28),transparent)" }} />
                <div className="text-[7px] text-white/35 tracking-widest uppercase mb-1 font-bold text-center">📖 Cara Bermain</div>
                <div className="space-y-1.5">
                  {[
                    { icon: "🧩", text: "Susun balok yang jatuh agar membentuk baris penuh tanpa celah" },
                    { icon: "◀▶", text: "Gunakan ← → untuk menggeser dan ↑ (atau swipe atas) untuk memutar balok" },
                    { icon: "⬇️", text: "Tekan ↓ untuk turun cepat, SPASI untuk hard drop langsung ke bawah" },
                    { icon: "📝", text: "Tiap 25 detik muncul soal dari guru — game pause, jawab benar = +20 poin" },
                    { icon: "⏸️", text: "Tekan P untuk pause. Level semakin tinggi, balok semakin cepat jatuh!" },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-start gap-2 px-1">
                      <span className="text-sm shrink-0 leading-none mt-0.5">{icon}</span>
                      <p className="text-[8px] text-white/55 leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-center gap-1.5 mt-2">
                  <button onClick={startGame}
                    className="tg-btn-breathe font-display font-black text-white text-lg px-8 py-3 rounded-2xl cursor-pointer hover:scale-110 active:scale-95 w-full"
                    style={{
                      background: "linear-gradient(135deg,#a855f7 0%,#c026d3 45%,#ec4899 100%)",
                      boxShadow: "0 0 30px rgba(168,85,247,0.85),0 0 60px rgba(192,38,211,0.35),0 4px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.2)",
                    }}>
                    🧩 MULAI GAME
                  </button>
                  <div className="text-[7px] text-white/20 text-center leading-relaxed">
                    ← → geser · ↑ putar · ↓ turun · Spasi hard drop · P pause
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
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
