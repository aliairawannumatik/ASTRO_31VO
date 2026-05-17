import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import { playPopSound } from "@/hooks/useAudio";
import { useGuruQuiz, type GuruQuestion } from "@/hooks/useGuruQuiz";
import GuruQuizOverlay from "@/components/GuruQuizOverlay";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Bubble {
  id: number;
  x: number;
  y: number;
  vy: number;
  radius: number;
  text: string;
  isCorrect: boolean;
  color: string;
  glowColor: string;
  state: "falling" | "hit-correct" | "hit-wrong" | "gone";
  popAlpha: number;
  popScale: number;
}

interface MathQuestion {
  question: string;
  options: string[];
  correctIdx: number;
}

interface ZumMathPageProps {
  topicLabel?: string;
  backPath?: string;
  homePath?: string;
  quizQuestions?: GuruQuestion[];
}

// ── Math question generator ───────────────────────────────────────────────────
function genQuestion(): MathQuestion {
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;
  if (op === "+") { a = Math.floor(Math.random() * 50) + 1; b = Math.floor(Math.random() * 50) + 1; answer = a + b; }
  else if (op === "-") { a = Math.floor(Math.random() * 50) + 10; b = Math.floor(Math.random() * a) + 1; answer = a - b; }
  else { a = Math.floor(Math.random() * 12) + 1; b = Math.floor(Math.random() * 12) + 1; answer = a * b; }
  const wrongs = new Set<number>();
  while (wrongs.size < 3) {
    const delta = (Math.floor(Math.random() * 10) + 1) * (Math.random() < 0.5 ? 1 : -1);
    const w = answer + delta;
    if (w !== answer && w >= 0) wrongs.add(w);
  }
  const options = [...wrongs].map(String);
  const correctIdx = Math.floor(Math.random() * 4);
  options.splice(correctIdx, 0, String(answer));
  return { question: `${a} ${op} ${b} = ?`, options, correctIdx };
}

// ── Constants ─────────────────────────────────────────────────────────────────
const BUBBLE_COLORS = [
  { bg: "#7c3aed", glow: "rgba(124,58,237,0.7)" },
  { bg: "#0ea5e9", glow: "rgba(14,165,233,0.7)" },
  { bg: "#e11d48", glow: "rgba(225,29,72,0.7)" },
  { bg: "#16a34a", glow: "rgba(22,163,74,0.7)" },
];
const CANVAS_W = 400;
const CANVAS_H = 560;
const BUBBLE_RADIUS = 40;
const INITIAL_LIVES = 3;

// ── Component ─────────────────────────────────────────────────────────────────
const ZumMathPage = ({
  topicLabel,
  backPath,
  homePath = "/menu",
  quizQuestions,
}: ZumMathPageProps = {}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<string>("idle");
  const guruQuiz = useGuruQuiz(phaseRef, "playing", 25_000, quizQuestions);

  const bubblesRef = useRef<Bubble[]>([]);
  const questionRef = useRef<MathQuestion>(genQuestion());
  const scoreRef = useRef(0);
  const livesRef = useRef(INITIAL_LIVES);
  const speedMultRef = useRef(1);
  const correctCountRef = useRef(0);
  const nextIdRef = useRef(0);
  const animRef = useRef(0);
  const waitingRef = useRef(false);
  const gameOverRef = useRef(false);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [question, setQuestion] = useState<MathQuestion>(genQuestion());

  // spawn 4 bubbles for current question
  const spawnBubbles = useCallback(() => {
    const q = questionRef.current;
    const slots = [CANVAS_W * 0.15, CANVAS_W * 0.38, CANVAS_W * 0.62, CANVAS_W * 0.85];
    const shuffled = [...slots].sort(() => Math.random() - 0.5);
    bubblesRef.current = q.options.map((opt, i) => ({
      id: nextIdRef.current++,
      x: shuffled[i],
      y: -BUBBLE_RADIUS - i * 60,
      vy: (1.4 + Math.random() * 0.4) * speedMultRef.current,
      radius: BUBBLE_RADIUS,
      text: opt,
      isCorrect: i === q.correctIdx,
      color: BUBBLE_COLORS[i].bg,
      glowColor: BUBBLE_COLORS[i].glow,
      state: "falling" as const,
      popAlpha: 1,
      popScale: 1,
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    correctCountRef.current += 1;
    if (correctCountRef.current % 5 === 0) speedMultRef.current = Math.min(3, speedMultRef.current + 0.25);
    const q = genQuestion();
    questionRef.current = q;
    setQuestion(q);
    spawnBubbles();
    waitingRef.current = false;
  }, [spawnBubbles]);

  const endGame = useCallback(() => {
    gameOverRef.current = true;
    phaseRef.current = "over";
    setGameOver(true);
    cancelAnimationFrame(animRef.current);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = CANVAS_W, H = CANVAS_H;

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0f0c29");
    bg.addColorStop(0.5, "#302b63");
    bg.addColorStop(1, "#24243e");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Question box
    const qGrad = ctx.createLinearGradient(0, 10, 0, 80);
    qGrad.addColorStop(0, "rgba(124,58,237,0.35)");
    qGrad.addColorStop(1, "rgba(14,165,233,0.15)");
    ctx.fillStyle = qGrad;
    roundRect(ctx, 20, 10, W - 40, 70, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(124,58,237,0.6)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, 20, 10, W - 40, 70, 16);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "bold 13px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("JAWAB YANG BENAR!", W / 2, 30);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 26px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(questionRef.current.question, W / 2, 63);

    // Draw bubbles
    for (const b of bubblesRef.current) {
      if (b.state === "gone") continue;
      ctx.save();
      ctx.globalAlpha = b.popAlpha;
      ctx.translate(b.x, b.y);
      ctx.scale(b.popScale, b.popScale);

      // glow
      ctx.shadowColor = b.state === "hit-correct" ? "rgba(34,197,94,0.9)" :
                        b.state === "hit-wrong"   ? "rgba(239,68,68,0.9)" :
                        b.glowColor;
      ctx.shadowBlur = b.state !== "falling" ? 30 : 18;

      // circle body
      const grad = ctx.createRadialGradient(-b.radius * 0.3, -b.radius * 0.3, 2, 0, 0, b.radius);
      const baseColor = b.state === "hit-correct" ? "#16a34a" :
                        b.state === "hit-wrong"   ? "#dc2626" :
                        b.color;
      grad.addColorStop(0, lighten(baseColor, 0.3));
      grad.addColorStop(0.6, baseColor);
      grad.addColorStop(1, darken(baseColor, 0.3));
      ctx.beginPath();
      ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // shine
      ctx.beginPath();
      ctx.arc(-b.radius * 0.28, -b.radius * 0.28, b.radius * 0.38, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.fill();

      // text
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${b.text.length > 3 ? "16" : "20"}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(b.text, 0, 0);

      ctx.restore();
    }

    // HUD bottom bar
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    roundRect(ctx, 10, H - 52, W - 20, 42, 12);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "bold 13px system-ui";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("SKOR:", 22, H - 32);
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 18px system-ui";
    ctx.fillText(String(scoreRef.current), 78, H - 32);

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "bold 13px system-ui";
    ctx.textAlign = "right";
    ctx.fillText("NYAWA: " + "❤️".repeat(livesRef.current), W - 18, H - 32);
  }, []);

  const loop = useCallback(() => {
    if (gameOverRef.current) return;
    if (!guruQuiz.isPausedRef.current && !waitingRef.current) {
      for (const b of bubblesRef.current) {
        if (b.state === "falling") {
          b.y += b.vy;
          if (b.y > CANVAS_H + BUBBLE_RADIUS) {
            // bubble escaped — if correct, it's a miss
            if (b.isCorrect) {
              b.state = "gone";
              livesRef.current = Math.max(0, livesRef.current - 1);
              setLives(livesRef.current);
              if (livesRef.current <= 0) { endGame(); return; }
              waitingRef.current = true;
              setTimeout(() => nextQuestion(), 600);
            } else {
              b.state = "gone";
            }
          }
        } else if (b.state === "hit-correct" || b.state === "hit-wrong") {
          b.popScale += 0.06;
          b.popAlpha -= 0.06;
          if (b.popAlpha <= 0) b.state = "gone";
        }
      }
    }
    if (!guruQuiz.isPausedRef.current) {
      // animate any remaining falling bubbles even while guruquiz not active
    }
    draw();
    animRef.current = requestAnimationFrame(loop);
  }, [draw, endGame, nextQuestion]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameOverRef.current || waitingRef.current || guruQuiz.isPausedRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;
    for (const b of bubblesRef.current) {
      if (b.state !== "falling") continue;
      const dist = Math.hypot(cx - b.x, cy - b.y);
      if (dist <= b.radius) {
        if (b.isCorrect) {
          b.state = "hit-correct";
          scoreRef.current += 20;
          setScore(scoreRef.current);
          // mark all others gone
          for (const ob of bubblesRef.current) if (ob.id !== b.id) ob.state = "gone";
          waitingRef.current = true;
          playPopSound();
          setTimeout(() => nextQuestion(), 800);
        } else {
          b.state = "hit-wrong";
          livesRef.current = Math.max(0, livesRef.current - 1);
          setLives(livesRef.current);
          if (livesRef.current <= 0) {
            setTimeout(() => endGame(), 600);
          }
        }
        break;
      }
    }
  }, [nextQuestion, endGame]);

  const startGame = useCallback(() => {
    playPopSound();
    scoreRef.current = 0;
    livesRef.current = INITIAL_LIVES;
    speedMultRef.current = 1;
    correctCountRef.current = 0;
    gameOverRef.current = false;
    waitingRef.current = false;
    const q = genQuestion();
    questionRef.current = q;
    setQuestion(q);
    setScore(0);
    setLives(INITIAL_LIVES);
    setGameOver(false);
    setStarted(true);
    phaseRef.current = "playing";
    setTimeout(() => spawnBubbles(), 100);
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(loop);
  }, [loop, spawnBubbles]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  // ── Start screen ─────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className={`relative flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`} style={{ height: '100dvh' }}>
        {isLight ? <Snowfall /> : <Starfield />}
        <div className="fixed inset-0 z-40 overflow-hidden">
          <style>{`
            @keyframes zga-floatA { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
            @keyframes zga-floatB { 0%,100%{transform:translateY(-5px)} 50%{transform:translateY(7px)} }
            @keyframes zga-pulse  { 0%,100%{opacity:0.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
            @keyframes zga-shimmer{ 0%{background-position:200% center} 100%{background-position:-200% center} }
            @keyframes zga-scanY  { 0%{transform:translateY(-120%)} 100%{transform:translateY(220%)} }
            .zga-fa{animation:zga-floatA 3.2s ease-in-out infinite}
            .zga-fb{animation:zga-floatB 3.8s ease-in-out infinite}
            .zga-fp{animation:zga-pulse 2.4s ease-in-out infinite}
            .zga-title-shine{background:linear-gradient(90deg,#e879f9,#a855f7,#7c3aed,#ec4899,#a855f7,#e879f9);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:zga-shimmer 4s linear infinite}
            @keyframes zga-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
            .zga-btn-breathe{animation:zga-breathe 2.8s ease-in-out infinite}
            .zga-scroll{height:100%;overflow-y:auto;scrollbar-width:none;display:flex;flex-direction:column}
            .zga-wrap{flex:1;display:flex;flex-direction:column;justify-content:space-evenly;padding:0.5rem 1rem;width:100%}
            .zga-main{display:flex;flex-direction:column;gap:0.75rem}
            .zga-visual{display:flex;flex-direction:column;gap:0.5rem}
            .zga-action{display:flex;flex-direction:column;gap:0.5rem}
            @media(orientation:landscape){
              .zga-wrap{justify-content:space-evenly;padding:0.35rem 1.75rem;max-width:860px;margin:0 auto;width:100%}
              .zga-main{flex-direction:row;align-items:stretch;gap:2rem}
              .zga-visual{flex:1;justify-content:center;gap:0.6rem}
              .zga-action{flex:1;justify-content:center;gap:0.6rem}
            }
          `}</style>

          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 15%, rgba(120,30,200,1) 0%, rgba(20,0,60,1) 60%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 10% 55%, rgba(236,72,153,0.2) 0%, transparent 55%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 90% 30%, rgba(124,58,237,0.15) 0%, transparent 55%)" }} />
          <div className="absolute inset-x-0 h-[1px] pointer-events-none" style={{ background: "linear-gradient(to right,transparent,rgba(232,121,249,0.3),transparent)", animation: "zga-scanY 6s linear infinite" }} />

          <div className="zga-scroll relative z-10">
            <div className="zga-wrap">

              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-between w-full mb-1">
                  <button onClick={() => { playPopSound(); backPath ? navigate(backPath) : navigate(-1); }}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-700 text-white font-display font-bold text-xs shadow-[0_0_15px_rgba(232,121,249,0.5)] hover:opacity-90 transition-opacity cursor-pointer">
                    <span className="text-base leading-none">←</span>
                    <span>Kembali</span>
                  </button>
                  <div className="text-[7px] tracking-[5px] text-fuchsia-400/60 uppercase font-bold">⬡ MATH GAME ARENA ⬡</div>
                  <button onClick={() => { playPopSound(); navigate(homePath); }}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-700 text-white font-display font-bold text-xs shadow-[0_0_15px_rgba(232,121,249,0.5)] hover:opacity-90 transition-opacity cursor-pointer">
                    <span className="text-base leading-none">🏠</span>
                    <span>Home</span>
                  </button>
                </div>
                <div className="zga-title-shine font-display font-black leading-none" style={{ fontSize: "clamp(1.7rem,5vw,2.4rem)" }}>ZUM MATH</div>
                <div className="mx-auto mt-0.5 h-0.5 w-28 rounded-full" style={{ background: "linear-gradient(to right,transparent,#e879f9,#a855f7,transparent)" }} />
                <p className="text-fuchsia-300/70 text-[9px] font-bold tracking-wider uppercase mt-1">Klik · Jawab · Ledakkan</p>
                {topicLabel && <p className="text-white/35 text-[8px] tracking-widest uppercase mt-0.5">✨ {topicLabel} ✨</p>}
              </div>

              <div className="zga-main">
                <div className="zga-visual">
                  <div className="flex items-end justify-center gap-5 w-full">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="text-[7px] text-fuchsia-400/70 font-bold tracking-wider uppercase">KAMU</div>
                      <div className="relative">
                        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle,rgba(232,121,249,0.28) 0%,transparent 70%)", transform: "scale(2.4)", borderRadius: "50%" }} />
                        <div className="zga-fa relative z-10 text-5xl" style={{ filter: "drop-shadow(0 0 16px #e879f9) drop-shadow(0 0 32px #a855f7)" }}>🔮</div>
                      </div>
                      <div className="w-1.5 h-4 rounded-full" style={{ background: "linear-gradient(to bottom,rgba(232,121,249,0.8),transparent)" }} />
                      <div className="text-[8px] font-bold text-fuchsia-400">PILIH</div>
                    </div>
                    <div className="flex flex-col items-center pb-4">
                      <div className="text-xl font-black text-white/20">VS</div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="text-[7px] text-white/40 font-bold tracking-wider uppercase mb-0.5">GELEMBUNG JAWABAN</div>
                      <div className="flex gap-1.5 items-center">
                        {(["#7c3aed","#0ea5e9","#e11d48","#16a34a"] as string[]).map((col, i) => (
                          <div key={i} className="zga-fb rounded-full flex items-center justify-center"
                            style={{ width: 28, height: 28, animationDelay: `${i * 0.3}s`,
                              background: `radial-gradient(circle at 35% 35%,${col}cc,${col})`,
                              boxShadow: `0 0 10px ${col},0 0 20px ${col}44`,
                              fontSize: 10, color: "#fff", fontWeight: 900 }}>
                            {["A","B","C","D"][i]}
                          </div>
                        ))}
                      </div>
                      <div className="zga-fp mt-1 text-2xl" style={{ filter: "drop-shadow(0 0 8px #e11d48)" }}>☠</div>
                      <div className="text-[7px] text-red-400/70 font-bold">JANGAN SALAH</div>
                    </div>
                  </div>

                  <div className="w-full h-px" style={{ background: "linear-gradient(to right,transparent,rgba(232,121,249,0.4),transparent)" }} />

                  <div>
                    <div className="text-[7px] text-white/35 tracking-widest uppercase mb-1.5 font-bold text-center">🎨 Warna Gelembung = Pilihan Jawaban</div>
                    <div className="grid grid-cols-4 gap-1.5 w-full">
                      {(["UNGU","BIRU","MERAH","HIJAU"] as string[]).map((name, i) => {
                        const col = ["#7c3aed","#0ea5e9","#e11d48","#16a34a"][i];
                        return (
                          <div key={name} className="flex flex-col items-center gap-0.5 rounded-xl py-1.5 px-1 border"
                            style={{ borderColor: col + "44", background: col + "10", boxShadow: `0 0 8px ${col}30` }}>
                            <div className="rounded-full" style={{ width: 18, height: 18,
                              background: `radial-gradient(circle at 35% 35%,${col}cc,${col})`,
                              boxShadow: `0 0 6px ${col}` }} />
                            <span className="text-[7px] font-black" style={{ color: col }}>{name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="zga-action">
                  <div className="w-full h-px" style={{ background: "linear-gradient(to right,transparent,rgba(232,121,249,0.28),transparent)" }} />
                  <div className="text-[7px] text-white/35 tracking-widest uppercase mb-1 font-bold text-center">📖 Cara Bermain</div>
                  <div className="space-y-1.5">
                    {[
                      { icon: "🔮", text: "Gelembung berisi jawaban jatuh dari atas layar" },
                      { icon: "✅", text: "Klik gelembung dengan jawaban BENAR untuk poin!" },
                      { icon: "❌", text: "Klik jawaban SALAH = kehilangan 1 nyawa" },
                      { icon: "⚡", text: "Kecepatan meningkat tiap 5 soal — tetap fokus!" },
                    ].map(({ icon, text }) => (
                      <div key={text} className="flex items-start gap-2 px-1">
                        <span className="text-sm shrink-0 leading-none mt-0.5">{icon}</span>
                        <p className="text-[8px] text-white/55 leading-relaxed">{text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col items-center gap-1.5 mt-2">
                    <button onClick={startGame}
                      className="zga-btn-breathe font-display font-black text-white text-lg px-8 py-3 rounded-2xl cursor-pointer hover:scale-110 active:scale-95 w-full"
                      style={{
                        background: "linear-gradient(135deg,#e879f9 0%,#a855f7 45%,#7c3aed 100%)",
                        boxShadow: "0 0 30px rgba(232,121,249,0.85),0 0 60px rgba(168,85,247,0.35),0 4px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.18)",
                      }}>
                      🔮 MULAI BERMAIN
                    </button>
                    <div className="text-[7px] text-white/20 text-center leading-relaxed">
                      Tap / klik gelembung · 3 nyawa tersedia
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

  // ── Game Over screen ─────────────────────────────────────────────────────
  if (gameOver) {
    return (
      <div className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`}>
        {isLight ? <Snowfall /> : <Starfield />}
        <div className="relative z-10 text-center animate-slide-up px-4">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="font-display text-4xl font-black text-red-400 mb-2">GAME OVER</h2>
          <p className="text-white/60 font-body mb-6">Kamu hebat sudah mencoba!</p>
          <div className="bg-card/70 border border-white/10 rounded-2xl p-6 mb-8 inline-block">
            <p className="text-white/50 text-sm font-body mb-1">Skor Akhir</p>
            <p className="font-display text-5xl font-black text-yellow-400">{score}</p>
          </div>
          <div className="flex flex-col gap-3 items-center">
            <button onClick={startGame}
              className="px-8 py-3 rounded-xl font-display text-base font-black text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}>
              🔄 Main Lagi
            </button>
            {backPath && (
              <button onClick={() => navigate(backPath)}
                className="text-sm text-white/40 hover:text-fuchsia-400 transition-colors font-body">
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
      <div className="relative z-10 flex flex-col items-center gap-3 w-full px-2">
        {/* Topic label */}
        <div className="text-xs text-fuchsia-300/70 font-body tracking-widest uppercase">
          🔮 ZUM MATH · {topicLabel ?? "MATH GAME ARENA"}
        </div>
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          onClick={handleClick}
          className="rounded-2xl cursor-pointer"
          style={{
            maxWidth: "min(400px, 95vw)",
            maxHeight: "70vh",
            boxShadow: "0 0 40px rgba(124,58,237,0.4)",
            touchAction: "none",
          }}
        />
        {/* Bottom nav */}
        <div className="flex gap-6 mt-1">
          {backPath && (
            <button onClick={() => { playPopSound(); navigate(backPath); }}
              className="text-xs text-white/40 hover:text-fuchsia-400 transition-colors font-body">
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

// ── Canvas helpers ────────────────────────────────────────────────────────────
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}
function lighten(hex: string, amt: number) {
  const { r, g, b } = hexToRgb(hex);
  const c = (v: number) => Math.min(255, Math.round(v + amt * 255));
  return `rgb(${c(r)},${c(g)},${c(b)})`;
}
function darken(hex: string, amt: number) {
  const { r, g, b } = hexToRgb(hex);
  const c = (v: number) => Math.max(0, Math.round(v - amt * 255));
  return `rgb(${c(r)},${c(g)},${c(b)})`;
}

export default ZumMathPage;
