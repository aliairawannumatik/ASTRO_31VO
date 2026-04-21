import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";

const COLS = 10;
const ROWS = 20;
const BLOCK = 28;
const CANVAS_W = COLS * BLOCK;
const CANVAS_H = ROWS * BLOCK;

type Color = string;
type Grid = (Color | null)[][];

const TETROMINOES = [
  { shape: [[1,1,1,1]], color: "#00FFFF" },           // I
  { shape: [[1,1],[1,1]], color: "#FFD700" },           // O
  { shape: [[0,1,0],[1,1,1]], color: "#AA00FF" },       // T
  { shape: [[1,0],[1,0],[1,1]], color: "#FF8C00" },     // L
  { shape: [[0,1],[0,1],[1,1]], color: "#1E90FF" },     // J
  { shape: [[0,1,1],[1,1,0]], color: "#00FF88" },       // S
  { shape: [[1,1,0],[0,1,1]], color: "#FF4444" },       // Z
];

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

const TetrisGamePage = () => {
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
  const guruQuiz = useGuruQuiz(tetrisPhaseRef);
  const dropTimerRef = useRef(0);
  const animRef = useRef(0);
  const lastTimeRef = useRef(0);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [flashRows, setFlashRows] = useState<number[]>([]);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const drawBlock = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, color: Color, alpha = 1) => {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK + 1, y * BLOCK + 1, BLOCK - 2, BLOCK - 2);
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(x * BLOCK + 1, y * BLOCK + 1, BLOCK - 2, 5);
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(x * BLOCK + 1, y * BLOCK + BLOCK - 6, BLOCK - 2, 5);
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
    const speed = LEVEL_SPEEDS[Math.min(levelRef.current - 1, LEVEL_SPEEDS.length - 1)];
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

  const hardDrop = useCallback(() => {
    if (!started || gameOverRef.current || pausedRef.current) return;
    const ghost = getGhost(gridRef.current, pieceRef.current);
    pieceRef.current = { ...pieceRef.current, y: ghost.y };
    lockPiece();
    render();
  }, [started, render, lockPiece]);

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

  return (
    <div className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
      {isLight ? <Snowfall /> : <Starfield />}

      <div className="relative z-10 w-full max-w-2xl px-2 py-4 flex flex-col items-center">
        <div className="flex items-center justify-between w-full mb-3">
          <button
            onClick={() => { playPopSound(); navigate('/ruang-untuk-guru/numatik-game'); }}
            className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all text-sm"
            title="Menu Utama"
          >
            🏠
          </button>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan text-center flex-1">
            🧩 TETRIS NUMATIK
          </h1>
          <button
            onClick={() => { playPopSound(); navigate(-1); }}
            className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all font-bold"
            title="Keluar"
          >
            ✕
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

              {!started && !gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <div className="text-center px-4">
                    <div className="text-5xl mb-3">🧩</div>
                    <h2 className="font-display text-2xl font-bold text-accent mb-3">TETRIS</h2>
                    <p className="text-white/60 text-xs mb-4 leading-relaxed">
                      ← → Geser &nbsp;·&nbsp; ↑ Putar<br />
                      ↓ Turun &nbsp;·&nbsp; SPASI Hard Drop<br />
                      P / ESC Pause
                    </p>
                    <button
                      onClick={startGame}
                      className="bg-accent text-black font-bold px-8 py-3 rounded-xl hover:opacity-90 transition text-lg cursor-pointer shadow-lg"
                    >
                      ▶ MULAI
                    </button>
                  </div>
                </div>
              )}

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

            <div className="flex gap-2 justify-center">
              <button onPointerDown={moveLeft} className="bg-card/80 border border-border text-white font-bold w-12 h-12 rounded-xl hover:border-accent transition cursor-pointer select-none active:scale-95 text-lg">◀</button>
              <button onPointerDown={rotatePiece} className="bg-card/80 border border-border text-white font-bold w-12 h-12 rounded-xl hover:border-accent transition cursor-pointer select-none active:scale-95 text-sm">↑</button>
              <button onPointerDown={moveDown} className="bg-card/80 border border-border text-white font-bold w-12 h-12 rounded-xl hover:border-accent transition cursor-pointer select-none active:scale-95 text-sm">↓</button>
              <button onPointerDown={moveRight} className="bg-card/80 border border-border text-white font-bold w-12 h-12 rounded-xl hover:border-accent transition cursor-pointer select-none active:scale-95 text-lg">▶</button>
              <button onPointerDown={hardDrop} className="bg-accent/20 border border-accent text-accent font-bold w-12 h-12 rounded-xl hover:bg-accent/40 transition cursor-pointer select-none active:scale-95 text-xs leading-tight">DROP</button>
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
