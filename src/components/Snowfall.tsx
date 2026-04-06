import { useEffect, useRef } from "react";

function drawCrystalFlake(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  opacity: number,
  colorIdx: number
) {
  const colors = [
    `rgba(59,130,246,${opacity})`,
    `rgba(96,165,250,${opacity})`,
    `rgba(147,197,253,${opacity})`,
    `rgba(14,165,233,${opacity})`,
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

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -size);
    ctx.stroke();

    const b1 = size * 0.38;
    const bl1 = size * 0.22;
    ctx.beginPath();
    ctx.moveTo(0, -b1);
    ctx.lineTo(bl1 * 0.71, -b1 - bl1 * 0.71);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -b1);
    ctx.lineTo(-bl1 * 0.71, -b1 - bl1 * 0.71);
    ctx.stroke();

    const b2 = size * 0.65;
    const bl2 = size * 0.14;
    ctx.beginPath();
    ctx.moveTo(0, -b2);
    ctx.lineTo(bl2 * 0.71, -b2 - bl2 * 0.71);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -b2);
    ctx.lineTo(-bl2 * 0.71, -b2 - bl2 * 0.71);
    ctx.stroke();

    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(0, 0, Math.max(1, size * 0.08), 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

const Snowfall = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const flakes = Array.from({ length: 90 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 10 + 5,
      speed: Math.random() * 0.8 + 0.3,
      drift: Math.random() * 0.4 - 0.2,
      opacity: Math.random() * 0.55 + 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.008,
      colorIdx: i % 5,
    }));

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      flakes.forEach((flake) => {
        flake.y += flake.speed;
        flake.x += flake.drift;
        flake.rotation += flake.rotSpeed;

        if (flake.y > canvas.height + flake.size) {
          flake.y = -flake.size * 2;
          flake.x = Math.random() * canvas.width;
        }
        if (flake.x > canvas.width + flake.size) flake.x = -flake.size;
        if (flake.x < -flake.size) flake.x = canvas.width + flake.size;

        drawCrystalFlake(
          ctx,
          flake.x,
          flake.y,
          flake.size,
          flake.rotation,
          flake.opacity,
          flake.colorIdx
        );
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
  );
};

export default Snowfall;
