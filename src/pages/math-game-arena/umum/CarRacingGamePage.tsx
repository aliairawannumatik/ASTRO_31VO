import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

const questions: Question[] = [
  { question: "12 × 8 = ?", options: ["86", "96", "106", "76"], correctIndex: 1 },
  { question: "144 ÷ 12 = ?", options: ["10", "11", "12", "13"], correctIndex: 2 },
  { question: "√169 = ?", options: ["11", "12", "13", "14"], correctIndex: 2 },
  { question: "7² + 1 = ?", options: ["48", "50", "52", "54"], correctIndex: 1 },
  { question: "25% dari 200 = ?", options: ["40", "50", "60", "70"], correctIndex: 1 },
  { question: "3³ = ?", options: ["9", "18", "27", "36"], correctIndex: 2 },
  { question: "56 + 79 = ?", options: ["125", "130", "135", "145"], correctIndex: 2 },
  { question: "180 - 97 = ?", options: ["73", "83", "93", "73"], correctIndex: 1 },
  { question: "15 × 15 = ?", options: ["205", "215", "225", "235"], correctIndex: 2 },
  { question: "FPB dari 24 dan 36 = ?", options: ["6", "8", "12", "18"], correctIndex: 2 },
  { question: "KPK dari 4 dan 6 = ?", options: ["8", "12", "16", "24"], correctIndex: 1 },
  { question: "0,75 = ?", options: ["1/2", "2/3", "3/4", "4/5"], correctIndex: 2 },
  { question: "2x + 6 = 20, x = ?", options: ["5", "6", "7", "8"], correctIndex: 2 },
  { question: "Luas lingkaran r=7 (π=22/7) = ?", options: ["144 cm²", "154 cm²", "164 cm²", "174 cm²"], correctIndex: 1 },
  { question: "Persentase 18 dari 60 = ?", options: ["25%", "30%", "35%", "40%"], correctIndex: 1 },
  { question: "(-8) × (-5) = ?", options: ["-40", "-13", "13", "40"], correctIndex: 3 },
  { question: "2/3 + 1/6 = ?", options: ["3/9", "5/6", "1/2", "7/6"], correctIndex: 1 },
  { question: "Sisi kubus jika volume 125 = ?", options: ["3 cm", "4 cm", "5 cm", "6 cm"], correctIndex: 2 },
  { question: "sin 90° = ?", options: ["0", "0,5", "√2/2", "1"], correctIndex: 3 },
  { question: "Median dari 3,5,7,9,11 = ?", options: ["5", "6", "7", "8"], correctIndex: 2 },
];

type GameState = "idle" | "countdown" | "playing" | "question" | "finished";

interface Car {
  x: number;
  y: number;
  speed: number;
  color: string;
  name: string;
  lane: number;
  distance: number;
  turboTimer: number;
  slowTimer: number;
  wobble: number;
}

const CANVAS_W = 420;
const CANVAS_H = 600;
const TRACK_LEFT = 50;
const TRACK_RIGHT = 370;
const TRACK_W = TRACK_RIGHT - TRACK_LEFT;
const LANE_COUNT = 4;
const LANE_W = TRACK_W / LANE_COUNT;
const CAR_W = 36;
const CAR_H = 56;
const TOTAL_DISTANCE = 3000;

function getLaneX(lane: number) {
  return TRACK_LEFT + lane * LANE_W + LANE_W / 2 - CAR_W / 2;
}

const AI_COLORS = ["#FF4E4E", "#FFD700", "#00E5FF", "#FF69B4"];
const AI_NAMES = ["Rival A", "Rival B", "Rival C", "Rival D"];

const CarRacingGamePage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const stateRef = useRef<GameState>("idle");
  const carsRef = useRef<Car[]>([]);
  const playerRef = useRef<Car | null>(null);
  const roadOffsetRef = useRef(0);
  const questionTimerRef = useRef(0);
  const currentQuestionRef = useRef<Question | null>(null);
  const usedQuestionsRef = useRef<Set<number>>(new Set());
  const countdownRef = useRef(3);
  const countdownTimerRef = useRef(0);
  const finishOrderRef = useRef<string[]>([]);
  const scoreRef = useRef(0);
  const correctCountRef = useRef(0);
  const wrongCountRef = useRef(0);
  const keysRef = useRef<Record<string, boolean>>({});

  const [gameState, setGameState] = useState<GameState>("idle");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [playerLane, setPlayerLane] = useState(1);
  const [finishOrder, setFinishOrder] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; good: boolean } | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFeedback = useCallback((text: string, good: boolean) => {
    setFeedbackMsg({ text, good });
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setFeedbackMsg(null), 1500);
  }, []);

  const initGame = useCallback(() => {
    const player: Car = {
      x: getLaneX(1),
      y: CANVAS_H - CAR_H - 20,
      speed: 0,
      color: "#00FF88",
      name: "Kamu",
      lane: 1,
      distance: 0,
      turboTimer: 0,
      slowTimer: 0,
      wobble: 0,
    };
    const aiCars: Car[] = [0, 2, 3].map((lane, i) => ({
      x: getLaneX(lane),
      y: CANVAS_H - CAR_H - 20,
      speed: 0,
      color: AI_COLORS[i],
      name: AI_NAMES[i],
      lane,
      distance: 0,
      turboTimer: 0,
      slowTimer: 0,
      wobble: 0,
    }));
    playerRef.current = player;
    carsRef.current = [player, ...aiCars];
    roadOffsetRef.current = 0;
    questionTimerRef.current = 4000;
    currentQuestionRef.current = null;
    usedQuestionsRef.current = new Set();
    finishOrderRef.current = [];
    scoreRef.current = 0;
    correctCountRef.current = 0;
    wrongCountRef.current = 0;
    setPlayerLane(1);
    setFinishOrder([]);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setCurrentQuestion(null);
  }, []);

  const getRandomQuestion = useCallback(() => {
    const available = questions
      .map((q, i) => i)
      .filter((i) => !usedQuestionsRef.current.has(i));
    if (available.length === 0) {
      usedQuestionsRef.current = new Set();
      return questions[Math.floor(Math.random() * questions.length)];
    }
    const idx = available[Math.floor(Math.random() * available.length)];
    usedQuestionsRef.current.add(idx);
    return questions[idx];
  }, []);

  const drawRoad = useCallback((ctx: CanvasRenderingContext2D, offset: number) => {
    ctx.fillStyle = isLight ? "#e8e0d5" : "#1a1a2e";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.fillStyle = isLight ? "#888" : "#444";
    ctx.fillRect(TRACK_LEFT, 0, TRACK_W, CANVAS_H);

    ctx.fillStyle = isLight ? "#aaa" : "#555";
    ctx.fillRect(TRACK_LEFT, 0, 6, CANVAS_H);
    ctx.fillRect(TRACK_RIGHT - 6, 0, 6, CANVAS_H);

    const dashLen = 40;
    const gap = 20;
    const period = dashLen + gap;
    for (let lane = 1; lane < LANE_COUNT; lane++) {
      const lx = TRACK_LEFT + lane * LANE_W;
      ctx.strokeStyle = isLight ? "rgba(200,200,200,0.8)" : "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.setLineDash([dashLen, gap]);
      const startY = -(offset % period);
      ctx.beginPath();
      ctx.moveTo(lx, startY);
      ctx.lineTo(lx, CANVAS_H);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    const crowdColors = isLight
      ? ["#c0c0c0", "#b0b0b0", "#a0a0a0"]
      : ["#2a2a4a", "#1f1f3a", "#252545"];
    for (let i = 0; i < 20; i++) {
      const y = ((i * 37 - offset * 0.2) % (CANVAS_H + 20) + CANVAS_H + 20) % (CANVAS_H + 20);
      ctx.fillStyle = crowdColors[i % crowdColors.length];
      ctx.fillRect(0, y - 5, TRACK_LEFT, 14);
      ctx.fillRect(TRACK_RIGHT, y - 5, CANVAS_W - TRACK_RIGHT, 14);
    }
  }, [isLight]);

  const drawCar = useCallback((ctx: CanvasRenderingContext2D, car: Car, isPlayer: boolean) => {
    const { x, y, color, turboTimer, slowTimer, wobble } = car;
    const w = CAR_W;
    const h = CAR_H;
    const wx = x + wobble;

    if (turboTimer > 0) {
      ctx.shadowColor = "#00FFFF";
      ctx.shadowBlur = 18;
    } else if (slowTimer > 0) {
      ctx.shadowColor = "#FF4444";
      ctx.shadowBlur = 12;
    }

    ctx.save();
    ctx.translate(wx + w / 2, y + h / 2);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 6);
    ctx.fill();

    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(-w / 2 + 5, -h / 2 + 10, w - 10, 12);
    ctx.fillRect(-w / 2 + 5, h / 2 - 22, w - 10, 12);

    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.roundRect(-w / 2 + 4, -h / 2 + 8, w - 8, 16, 3);
    ctx.fill();

    ctx.fillStyle = "#333";
    ctx.fillRect(-w / 2 - 5, -h / 2 + 8, 6, 10);
    ctx.fillRect(w / 2 - 1, -h / 2 + 8, 6, 10);
    ctx.fillRect(-w / 2 - 5, h / 2 - 18, 6, 10);
    ctx.fillRect(w / 2 - 1, h / 2 - 18, 6, 10);

    if (isPlayer) {
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 6);
      ctx.stroke();
    }

    if (turboTimer > 0) {
      const grad = ctx.createLinearGradient(0, h / 2, 0, h / 2 + 20);
      grad.addColorStop(0, "rgba(0,255,255,0.9)");
      grad.addColorStop(1, "rgba(0,255,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-6, h / 2);
      ctx.lineTo(6, h / 2);
      ctx.lineTo(3, h / 2 + 18);
      ctx.lineTo(-3, h / 2 + 18);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }, []);

  const drawHUD = useCallback((ctx: CanvasRenderingContext2D) => {
    const player = playerRef.current;
    if (!player) return;
    const pct = Math.min((player.distance / TOTAL_DISTANCE) * 100, 100);

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath();
    ctx.roundRect(10, 10, 180, 60, 10);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px 'Orbitron', monospace";
    ctx.fillText("PROGRESS", 20, 30);

    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(20, 36, 160, 12);
    ctx.fillStyle = player.turboTimer > 0 ? "#00FFFF" : player.slowTimer > 0 ? "#FF4444" : "#00FF88";
    ctx.fillRect(20, 36, 160 * (pct / 100), 12);
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 36, 160, 12);

    ctx.fillStyle = "#fff";
    ctx.font = "12px monospace";
    ctx.fillText(`${pct.toFixed(1)}%`, 20, 62);

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath();
    ctx.roundRect(230, 10, 180, 60, 10);
    ctx.fill();

    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 13px 'Orbitron', monospace";
    ctx.fillText(`SKOR: ${scoreRef.current}`, 245, 30);
    ctx.fillStyle = "#00FF88";
    ctx.font = "12px monospace";
    ctx.fillText(`✓ ${correctCountRef.current}  ✗ ${wrongCountRef.current}`, 245, 50);

    const allCars = [...carsRef.current].sort((a, b) => b.distance - a.distance);
    const pos = allCars.findIndex((c) => c.name === "Kamu") + 1;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath();
    ctx.roundRect(10, 80, 110, 40, 8);
    ctx.fill();
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 14px monospace";
    ctx.fillText(`POS: ${pos}/${carsRef.current.length}`, 22, 106);
  }, []);

  const drawFinishLine = useCallback((ctx: CanvasRenderingContext2D, roadOff: number) => {
    const finishScreenY = CANVAS_H - 20 - (TOTAL_DISTANCE - roadOff) * 0.5;
    if (finishScreenY < -20 || finishScreenY > CANVAS_H + 20) return;
    const squareSize = 12;
    const cols = Math.floor(TRACK_W / squareSize);
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < 2; r++) {
        const checker = (c + r) % 2 === 0;
        ctx.fillStyle = checker ? "#ffffff" : "#000000";
        ctx.fillRect(TRACK_LEFT + c * squareSize, finishScreenY + r * squareSize, squareSize, squareSize);
      }
    }
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    const dt = Math.min(timestamp - (lastTimeRef.current || timestamp), 50);
    lastTimeRef.current = timestamp;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = stateRef.current;

    if (state === "countdown") {
      countdownTimerRef.current -= dt;
      if (countdownTimerRef.current <= 0) {
        countdownRef.current -= 1;
        if (countdownRef.current <= 0) {
          stateRef.current = "playing";
          setGameState("playing");
          countdownRef.current = 3;
        } else {
          countdownTimerRef.current = 1000;
          setCountdown(countdownRef.current);
        }
      }
      drawRoad(ctx, roadOffsetRef.current);
      carsRef.current.forEach((c) => drawCar(ctx, c, c.name === "Kamu"));
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 100px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${countdownRef.current}`, CANVAS_W / 2, CANVAS_H / 2 + 30);
      ctx.textAlign = "left";
    } else if (state === "playing") {
      questionTimerRef.current -= dt;
      if (questionTimerRef.current <= 0) {
        const q = getRandomQuestion();
        currentQuestionRef.current = q;
        stateRef.current = "question";
        setCurrentQuestion(q);
        setGameState("question");
        questionTimerRef.current = 0;
      }

      const player = playerRef.current!;
      const targetLane = player.lane;

      if (keysRef.current["ArrowLeft"]) {
        if (player.lane > 0) { player.lane = Math.max(0, player.lane - 1); keysRef.current["ArrowLeft"] = false; }
      }
      if (keysRef.current["ArrowRight"]) {
        if (player.lane < LANE_COUNT - 1) { player.lane = Math.min(LANE_COUNT - 1, player.lane + 1); keysRef.current["ArrowRight"] = false; }
      }
      setPlayerLane(player.lane);

      const targetX = getLaneX(player.lane);
      player.x += (targetX - player.x) * 0.15;

      const basePlayerSpeed = 120;
      if (player.turboTimer > 0) {
        player.turboTimer = Math.max(0, player.turboTimer - dt);
        player.speed = basePlayerSpeed * 2.2;
      } else if (player.slowTimer > 0) {
        player.slowTimer = Math.max(0, player.slowTimer - dt);
        player.speed = basePlayerSpeed * 0.4;
      } else {
        player.speed = basePlayerSpeed;
      }

      player.distance += (player.speed * dt) / 1000;
      roadOffsetRef.current = player.distance;

      carsRef.current.forEach((c) => {
        if (c.name === "Kamu") return;
        if (c.turboTimer > 0) { c.turboTimer = Math.max(0, c.turboTimer - dt); c.speed = 115 * 1.6; }
        else if (c.slowTimer > 0) { c.slowTimer = Math.max(0, c.slowTimer - dt); c.speed = 55; }
        else {
          const variance = 80 + Math.random() * 60;
          c.speed += (variance - c.speed) * 0.02;
        }
        c.distance += (c.speed * dt) / 1000;
        c.wobble = Math.sin(timestamp / 200 + c.lane) * 1.5;
        const tx = getLaneX(c.lane);
        c.x += (tx - c.x) * 0.1;
        if (Math.random() < 0.003) c.lane = Math.floor(Math.random() * LANE_COUNT);
      });

      const allFinished = carsRef.current.every((c) => c.distance >= TOTAL_DISTANCE);
      const toFinish = carsRef.current
        .filter((c) => c.distance >= TOTAL_DISTANCE && !finishOrderRef.current.includes(c.name))
        .sort((a, b) => b.distance - a.distance);
      toFinish.forEach((c) => finishOrderRef.current.push(c.name));

      if (allFinished || finishOrderRef.current.length === carsRef.current.length) {
        stateRef.current = "finished";
        setFinishOrder([...finishOrderRef.current]);
        setScore(scoreRef.current);
        setCorrectCount(correctCountRef.current);
        setWrongCount(wrongCountRef.current);
        setGameState("finished");
        return;
      }

      const relativeOff = roadOffsetRef.current;
      drawRoad(ctx, relativeOff);
      drawFinishLine(ctx, relativeOff);

      const sorted = [...carsRef.current].sort((a, b) => b.distance - a.distance);
      sorted.forEach((c) => {
        const isPlayer = c.name === "Kamu";
        const relDist = c.distance - player.distance;
        const relY = player.y - relDist * 0.6;
        c.y = relY;
        if (c.y > -CAR_H && c.y < CANVAS_H + CAR_H) {
          drawCar(ctx, c, isPlayer);
        }
      });

      drawHUD(ctx);
    }

    animFrameRef.current = requestAnimationFrame(gameLoop);
  }, [drawRoad, drawCar, drawHUD, drawFinishLine, getRandomQuestion]);

  const startGame = useCallback(() => {
    playPopSound();
    initGame();
    countdownRef.current = 3;
    countdownTimerRef.current = 1000;
    stateRef.current = "countdown";
    setGameState("countdown");
    setCountdown(3);
    lastTimeRef.current = 0;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(gameLoop);
  }, [initGame, gameLoop]);

  const handleAnswer = useCallback((idx: number) => {
    const q = currentQuestionRef.current;
    if (!q) return;
    playPopSound();
    const player = playerRef.current!;
    if (idx === q.correctIndex) {
      player.turboTimer = 2500;
      scoreRef.current += 100;
      correctCountRef.current += 1;
      showFeedback("🚀 BENAR! TURBO!", true);
    } else {
      player.slowTimer = 2000;
      wrongCountRef.current += 1;
      showFeedback(`❌ Salah! Jawaban: ${q.options[q.correctIndex]}`, false);
    }
    setScore(scoreRef.current);
    setCorrectCount(correctCountRef.current);
    setWrongCount(wrongCountRef.current);
    questionTimerRef.current = 5000;
    currentQuestionRef.current = null;
    stateRef.current = "playing";
    setCurrentQuestion(null);
    setGameState("playing");
  }, [showFeedback]);

  const handleLaneChange = useCallback((dir: number) => {
    const player = playerRef.current;
    if (!player || stateRef.current !== "playing") return;
    const newLane = Math.max(0, Math.min(LANE_COUNT - 1, player.lane + dir));
    player.lane = newLane;
    setPlayerLane(newLane);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = isLight ? "#e8e0d5" : "#1a1a2e";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = isLight ? "#888" : "#444";
    ctx.fillRect(TRACK_LEFT, 0, TRACK_W, CANVAS_H);
    ctx.fillStyle = "#00FF88";
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Tekan MULAI untuk bermain!", CANVAS_W / 2, CANVAS_H / 2);
    ctx.textAlign = "left";
  }, [isLight]);

  const playerPos = finishOrder.indexOf("Kamu") + 1 || carsRef.current.length;

  return (
    <div className={`relative min-h-screen flex flex-col items-center justify-start overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`}>
      {isLight ? <Snowfall /> : <Starfield />}

      <div className="relative z-10 w-full max-w-2xl px-2 py-4 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-3 w-full">
          <button
            onClick={() => { playPopSound(); navigate("/math-game-arena/umum"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-body cursor-pointer"
          >
            ← Kembali
          </button>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan text-center flex-1">
            🏎️ BALAP MOBIL MATEMATIKA
          </h1>
        </div>

        <div className="relative w-full flex justify-center">
          <div className="relative" style={{ width: CANVAS_W, maxWidth: "100%" }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="rounded-xl border border-border shadow-2xl"
              style={{ maxWidth: "100%", height: "auto" }}
            />

            {feedbackMsg && (
              <div
                className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-3 rounded-xl font-bold text-lg text-center shadow-xl animate-bounce z-20 pointer-events-none ${
                  feedbackMsg.good
                    ? "bg-green-500/90 text-white"
                    : "bg-red-500/90 text-white"
                }`}
              >
                {feedbackMsg.text}
              </div>
            )}

            {gameState === "question" && currentQuestion && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-card/95 backdrop-blur-md border-2 border-accent rounded-2xl p-5 mx-3 shadow-2xl max-w-sm w-full">
                  <div className="text-xs text-accent font-display mb-2 text-center tracking-wider">
                    ⚡ PERTANYAAN MATEMATIKA
                  </div>
                  <p className="text-white font-bold text-center text-base mb-4 leading-snug">
                    {currentQuestion.question}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {currentQuestion.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        className="bg-primary/20 hover:bg-accent/30 border border-border hover:border-accent text-white font-bold py-3 px-2 rounded-xl text-sm transition-all duration-150 cursor-pointer active:scale-95"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {gameState === "finished" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
                <div className="bg-card/95 backdrop-blur-md border-2 border-accent rounded-2xl p-6 mx-3 text-center shadow-2xl max-w-xs w-full">
                  <div className="text-3xl mb-2">
                    {playerPos === 1 ? "🏆" : playerPos === 2 ? "🥈" : playerPos === 3 ? "🥉" : "🏎️"}
                  </div>
                  <h2 className="font-display text-xl font-bold text-accent mb-1">
                    {playerPos === 1 ? "KAMU MENANG!" : `POSISI ${playerPos}`}
                  </h2>
                  <div className="text-white/80 text-sm mb-3">
                    Skor: <span className="text-yellow-400 font-bold text-lg">{score}</span>
                  </div>
                  <div className="flex justify-center gap-4 mb-4 text-sm">
                    <span className="text-green-400">✓ {correctCount} Benar</span>
                    <span className="text-red-400">✗ {wrongCount} Salah</span>
                  </div>
                  <div className="mb-4 text-left">
                    <div className="text-xs text-white/50 mb-1 font-display">HASIL AKHIR:</div>
                    {finishOrder.map((name, i) => (
                      <div key={name} className={`text-sm py-1 flex items-center gap-2 ${name === "Kamu" ? "text-accent font-bold" : "text-white/70"}`}>
                        <span>{i + 1}.</span>
                        <span>{name === "Kamu" ? "🚗 Kamu" : `🚙 ${name}`}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={startGame}
                      className="flex-1 bg-accent text-black font-bold py-2 rounded-xl hover:opacity-90 transition cursor-pointer"
                    >
                      Main Lagi
                    </button>
                    <button
                      onClick={() => { playPopSound(); navigate("/math-game-arena/umum"); }}
                      className="flex-1 bg-card border border-border text-white py-2 rounded-xl hover:border-accent transition cursor-pointer text-sm"
                    >
                      Keluar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {gameState === "idle" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
                <div className="text-center px-6">
                  <div className="text-5xl mb-3">🏎️</div>
                  <h2 className="font-display text-2xl font-bold text-accent mb-2">BALAP MOBIL</h2>
                  <p className="text-white/70 text-sm mb-4 leading-relaxed">
                    Jawab soal matematika untuk<br />mendapatkan <span className="text-cyan-400 font-bold">TURBO BOOST</span>!<br />
                    Gunakan ← → untuk pindah jalur.
                  </p>
                  <button
                    onClick={startGame}
                    className="bg-accent text-black font-bold px-8 py-3 rounded-xl hover:opacity-90 transition text-lg cursor-pointer shadow-lg"
                  >
                    ▶ MULAI BALAPAN
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {(gameState === "playing" || gameState === "question") && (
          <div className="flex gap-4 mt-4">
            <button
              onPointerDown={() => handleLaneChange(-1)}
              className="bg-card/80 border border-border text-white font-bold px-6 py-4 rounded-xl text-xl hover:border-accent transition cursor-pointer select-none active:scale-95"
            >
              ◀
            </button>
            <div className="flex items-center px-4 text-white/60 text-sm font-body">
              Pindah Jalur
            </div>
            <button
              onPointerDown={() => handleLaneChange(1)}
              className="bg-card/80 border border-border text-white font-bold px-6 py-4 rounded-xl text-xl hover:border-accent transition cursor-pointer select-none active:scale-95"
            >
              ▶
            </button>
          </div>
        )}

        <div className="mt-3 text-center text-white/40 text-xs font-body">
          Keyboard: ← → untuk pindah jalur • Jawab soal untuk TURBO!
        </div>
      </div>
    </div>
  );
};

export default CarRacingGamePage;
