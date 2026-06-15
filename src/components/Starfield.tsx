import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

// ── Shared RAF loop: 60fps cap + visibility pause ─────────────
function startLoop(render: () => void, fps = 60): () => void {
  const interval = 1000 / fps - 1;
  let rafId: number;
  let last = 0;
  const loop = (t: number) => {
    rafId = requestAnimationFrame(loop);
    if (t - last < interval) return;
    last = t;
    render();
  };
  rafId = requestAnimationFrame(loop);
  const onVis = () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      last = 0;
      rafId = requestAnimationFrame(loop);
    }
  };
  document.addEventListener("visibilitychange", onVis);
  return () => {
    cancelAnimationFrame(rafId);
    document.removeEventListener("visibilitychange", onVis);
  };
}

// ── Shared: crystal snowflake drawing ─────────────────────────
function drawCrystalFlake(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, size: number, rotation: number, opacity: number, colorIdx: number
) {
  const colors = [
    `rgba(59,130,246,${opacity})`, `rgba(96,165,250,${opacity})`,
    `rgba(147,197,253,${opacity})`, `rgba(14,165,233,${opacity})`,
    `rgba(186,230,253,${opacity})`,
  ];
  const color = colors[colorIdx % colors.length];
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(0.5, size * 0.055);
  ctx.lineCap = "round";
  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 3);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -size); ctx.stroke();
    const b1 = size * 0.38; const bl1 = size * 0.22;
    ctx.beginPath(); ctx.moveTo(0, -b1); ctx.lineTo( bl1 * 0.71, -b1 - bl1 * 0.71); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -b1); ctx.lineTo(-bl1 * 0.71, -b1 - bl1 * 0.71); ctx.stroke();
    const b2 = size * 0.65; const bl2 = size * 0.14;
    ctx.beginPath(); ctx.moveTo(0, -b2); ctx.lineTo( bl2 * 0.71, -b2 - bl2 * 0.71); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -b2); ctx.lineTo(-bl2 * 0.71, -b2 - bl2 * 0.71); ctx.stroke();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 0, Math.max(1, size * 0.08), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ── 1. Space: star field ───────────────────────────────────────
const StarCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5, speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random(), twinkleSpeed: Math.random() * 0.02 + 0.005,
    }));
    const stop = startLoop(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 1 || star.opacity < 0.2) star.twinkleSpeed *= -1;
        star.y += star.speed;
        if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,230,255,${star.opacity})`;
        ctx.fill();
      });
    });
    return () => { stop(); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// ── 2. Snow: crystal snowflakes ────────────────────────────────
const SnowCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const flakes = Array.from({ length: 60 }, (_, i) => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      size: Math.random() * 10 + 5, speed: Math.random() * 0.8 + 0.3,
      drift: Math.random() * 0.4 - 0.2, opacity: Math.random() * 0.55 + 0.3,
      rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.008,
      colorIdx: i % 5,
    }));
    const stop = startLoop(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      flakes.forEach((flake) => {
        flake.y += flake.speed; flake.x += flake.drift; flake.rotation += flake.rotSpeed;
        if (flake.y > canvas.height + flake.size) { flake.y = -flake.size * 2; flake.x = Math.random() * canvas.width; }
        if (flake.x > canvas.width + flake.size) flake.x = -flake.size;
        if (flake.x < -flake.size) flake.x = canvas.width + flake.size;
        drawCrystalFlake(ctx, flake.x, flake.y, flake.size, flake.rotation, flake.opacity, flake.colorIdx);
      });
    });
    return () => { stop(); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// ── 3. White: floating soft circles (subtle, minimal) ─────────
const WhiteCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const dots = Array.from({ length: 45 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight + window.innerHeight,
      r: Math.random() * 18 + 6,
      speed: Math.random() * 0.35 + 0.1,
      opacity: Math.random() * 0.10 + 0.04,
      drift: Math.random() * 0.3 - 0.15,
      phase: Math.random() * Math.PI * 2,
      wobble: Math.random() * 0.01 + 0.005,
    }));
    let frame = 0;
    const stop = startLoop(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      dots.forEach((d) => {
        d.y -= d.speed;
        d.x += d.drift + Math.sin(frame * d.wobble + d.phase) * 0.4;
        if (d.y < -d.r * 2) { d.y = canvas.height + d.r; d.x = Math.random() * canvas.width; }
        if (d.x > canvas.width + d.r) d.x = -d.r;
        if (d.x < -d.r) d.x = canvas.width + d.r;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148,163,184,${d.opacity})`;
        ctx.fill();
      });
    });
    return () => { stop(); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// ── 4. Forest: falling leaves ──────────────────────────────────
const ForestCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const colors = ["#4ade80","#22c55e","#16a34a","#86efac","#bbf7d0","#a3e635","#84cc16","#65a30d","#d9f99d"];
    const leaves = Array.from({ length: 45 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight - window.innerHeight * 0.3,
      size: Math.random() * 13 + 6,
      speed: Math.random() * 1.0 + 0.35,
      drift: Math.random() * 1.0 - 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.045,
      opacity: Math.random() * 0.5 + 0.35,
      color: colors[Math.floor(Math.random() * colors.length)],
      swaySpeed: Math.random() * 0.022 + 0.008,
      swayAmt: Math.random() * 1.8 + 0.5,
      phase: Math.random() * Math.PI * 2,
    }));
    let frame = 0;
    const stop = startLoop(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      leaves.forEach((leaf) => {
        leaf.y += leaf.speed;
        leaf.x += leaf.drift + Math.sin(frame * leaf.swaySpeed + leaf.phase) * leaf.swayAmt;
        leaf.rotation += leaf.rotSpeed;
        if (leaf.y > canvas.height + leaf.size) { leaf.y = -leaf.size * 2; leaf.x = Math.random() * canvas.width; }
        if (leaf.x > canvas.width + leaf.size) leaf.x = -leaf.size;
        if (leaf.x < -leaf.size) leaf.x = canvas.width + leaf.size;
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rotation);
        ctx.globalAlpha = leaf.opacity;
        ctx.beginPath();
        ctx.moveTo(0, -leaf.size);
        ctx.bezierCurveTo(leaf.size * 0.72, -leaf.size * 0.42, leaf.size * 0.72, leaf.size * 0.42, 0, leaf.size);
        ctx.bezierCurveTo(-leaf.size * 0.72, leaf.size * 0.42, -leaf.size * 0.72, -leaf.size * 0.42, 0, -leaf.size);
        ctx.fillStyle = leaf.color;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, -leaf.size);
        ctx.lineTo(0, leaf.size);
        ctx.strokeStyle = "rgba(0,80,0,0.20)";
        ctx.lineWidth = leaf.size * 0.07;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.restore();
      });
    });
    return () => { stop(); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// ── 5. Ocean: rising bubbles ───────────────────────────────────
const OceanCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const bubbles = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight + window.innerHeight,
      r: Math.random() * 14 + 2,
      speed: Math.random() * 1.3 + 0.28,
      drift: Math.random() * 0.5 - 0.25,
      opacity: Math.random() * 0.42 + 0.12,
      phase: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.028 + 0.01,
      wobbleAmt: Math.random() * 1.4 + 0.4,
    }));
    let frame = 0;
    const stop = startLoop(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      bubbles.forEach((b) => {
        b.y -= b.speed;
        b.x += b.drift + Math.sin(frame * b.wobbleSpeed + b.phase) * b.wobbleAmt;
        if (b.y < -b.r * 2) { b.y = canvas.height + b.r; b.x = Math.random() * canvas.width; }
        if (b.x > canvas.width + b.r) b.x = -b.r;
        if (b.x < -b.r) b.x = canvas.width + b.r;
        ctx.save();
        ctx.globalAlpha = b.opacity;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(147,210,255,${Math.min(b.opacity * 2, 0.85)})`;
        ctx.lineWidth = Math.max(0.5, b.r * 0.14);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
      });
    });
    return () => { stop(); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// ── 6. Sunset: floating embers / fireflies ─────────────────────
// Note: gradient creation moved out of per-frame loop to avoid GC pressure.
// Each ember uses a simple solid circle instead of createRadialGradient per frame.
const SunsetCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const colors = ["#fbbf24","#f97316","#ef4444","#fcd34d","#fb923c","#f87171","#fde68a","#fdba74"];
    const embers = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight + window.innerHeight * 0.2,
      r: Math.random() * 3 + 1,
      speed: Math.random() * 1.4 + 0.4,
      drift: Math.random() * 1.4 - 0.7,
      opacity: Math.random() * 0.75 + 0.20,
      twinkleSpeed: Math.random() * 0.038 + 0.01,
      twinkleDir: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.018 + 0.008,
    }));
    let frame = 0;
    const stop = startLoop(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      embers.forEach((e) => {
        e.y -= e.speed;
        e.x += e.drift + Math.sin(frame * e.wobbleSpeed + e.phase) * 0.9;
        e.opacity += e.twinkleSpeed * e.twinkleDir;
        if (e.opacity >= 0.95 || e.opacity <= 0.08) e.twinkleDir *= -1;
        if (e.y < -e.r * 2) { e.y = canvas.height + e.r; e.x = Math.random() * canvas.width; }
        if (e.x > canvas.width + 12) e.x = -12;
        if (e.x < -12) e.x = canvas.width + 12;
        ctx.save();
        ctx.globalAlpha = e.opacity * 0.4;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = e.color;
        ctx.fill();
        ctx.globalAlpha = e.opacity;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
      });
    });
    return () => { stop(); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// ── Theme-aware switcher ───────────────────────────────────────
const Starfield = () => {
  const { theme } = useTheme();
  switch (theme) {
    case "light":   return <SnowCanvas />;
    case "white":   return <WhiteCanvas />;
    case "forest":  return <ForestCanvas />;
    case "ocean":   return <OceanCanvas />;
    case "sunset":  return null;
    default:        return <StarCanvas />;
  }
};

export default Starfield;
