import React, {
  useRef, useEffect, useState, useCallback, useLayoutEffect, useId,
} from "react";
import {
  ZoomIn, ZoomOut, RotateCcw, Grid3x3, Eye, EyeOff,
  Plus, Trash2, Download, MousePointer2, Move,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────── */
interface LineEntry {
  id: string;
  raw: string;
  color: string;
  visible: boolean;
  error: string | null;
}

interface ParsedLine {
  kind: "slope" | "vertical" | "invalid";
  m: number;
  c: number;
  x?: number;
}

interface KeyPoint {
  x: number;
  y: number;
  label: string;
  color: string;
}

/* ─── Preset colors ─────────────────────────────────────── */
const PALETTE = [
  "#22d3ee", "#a78bfa", "#4ade80", "#fb923c",
  "#f472b6", "#facc15", "#f87171", "#34d399",
];

/* ─── Equation parser ────────────────────────────────────── */
function parseLine(raw: string): ParsedLine {
  const s = raw.trim().replace(/\s+/g, "").toLowerCase()
    .replace(/−/g, "-").replace(/×/g, "*").replace(/÷/g, "/");

  if (!s) return { kind: "invalid", m: 0, c: 0 };

  // x = k
  const xEq = /^x=(-?\d*\.?\d+(?:\/\d+)?)$/.exec(s);
  if (xEq) {
    const v = evalFrac(xEq[1]);
    return v !== null ? { kind: "vertical", m: 0, c: 0, x: v } : { kind: "invalid", m: 0, c: 0 };
  }

  // y = ... (explicit)
  const yEq = /^y=(.+)$/.exec(s);
  if (yEq) {
    const rhs = yEq[1];
    // y = mx + c, y = mx - c, y = c, y = mx
    const full = /^(-?\d*\.?\d*(?:\/\d+)?)\*?x([+-]\d*\.?\d+(?:\/\d+)?)?$/.exec(rhs);
    if (full) {
      const mRaw = full[1] === "" || full[1] === "-" ? (full[1] === "-" ? "-1" : "1") : full[1];
      const m = evalFrac(mRaw) ?? NaN;
      const c = full[2] ? evalFrac(full[2]) ?? NaN : 0;
      if (!isNaN(m) && !isNaN(c)) return { kind: "slope", m, c };
    }
    // y = constant
    const constOnly = /^(-?\d*\.?\d+(?:\/\d+)?)$/.exec(rhs);
    if (constOnly) {
      const c = evalFrac(constOnly[1]);
      if (c !== null) return { kind: "slope", m: 0, c };
    }
    // fallback: y = generic linear ax
    const linX = /^(-?\d*\.?\d+(?:\/\d+)?)\*?x$/.exec(rhs);
    if (linX) {
      const m = evalFrac(linX[1]);
      if (m !== null) return { kind: "slope", m, c: 0 };
    }
  }

  // ax + by + c = 0 or ax + by = c
  const general = normalizeGeneral(s);
  if (general) return general;

  // x/a + y/b = 1 (intercept form)
  const intercept = parseIntercept(s);
  if (intercept) return intercept;

  return { kind: "invalid", m: 0, c: 0 };
}

function evalFrac(s: string): number | null {
  if (!s) return null;
  const parts = s.split("/");
  if (parts.length === 1) {
    const n = parseFloat(s);
    return isNaN(n) ? null : n;
  }
  if (parts.length === 2) {
    const a = parseFloat(parts[0]), b = parseFloat(parts[1]);
    if (isNaN(a) || isNaN(b) || b === 0) return null;
    return a / b;
  }
  return null;
}

function normalizeGeneral(s: string): ParsedLine | null {
  // match: [coeff]x [+/-] [coeff]y [+/-] [const] = [something] OR = 0
  // Strategy: move everything to left → Ax + By + C = 0
  let eq = s;
  let rhs = 0;
  const eqIdx = eq.indexOf("=");
  if (eqIdx !== -1) {
    const rhsStr = eq.slice(eqIdx + 1);
    rhs = evalFrac(rhsStr) ?? 0;
    eq = eq.slice(0, eqIdx);
  }

  // tokenize terms like: -2x, +3y, 5x, -6, 4
  const terms = eq.match(/[+-]?[^+-]+/g);
  if (!terms) return null;
  let A = 0, B = 0, C = 0;
  for (const t of terms) {
    const xT = /^(-?\d*\.?\d*(?:\/\d+)?)\*?x$/.exec(t);
    const yT = /^(-?\d*\.?\d*(?:\/\d+)?)\*?y$/.exec(t);
    const cT = /^(-?\d*\.?\d+(?:\/\d+)?)$/.exec(t);
    if (xT) {
      const coeff = xT[1];
      A += evalFrac(coeff === "" || coeff === "+" ? "1" : coeff === "-" ? "-1" : coeff) ?? 0;
    } else if (yT) {
      const coeff = yT[1];
      B += evalFrac(coeff === "" || coeff === "+" ? "1" : coeff === "-" ? "-1" : coeff) ?? 0;
    } else if (cT) {
      C += evalFrac(cT[1]) ?? 0;
    } else {
      return null;
    }
  }
  C -= rhs;
  // Ax + By + C = 0 → y = (-A/B)x + (-C/B)
  if (Math.abs(B) < 1e-12) {
    // vertical: Ax + C = 0 → x = -C/A
    if (Math.abs(A) < 1e-12) return null;
    return { kind: "vertical", m: 0, c: 0, x: -C / A };
  }
  const m = -A / B, c = -C / B;
  if (isNaN(m) || isNaN(c)) return null;
  return { kind: "slope", m, c };
}

function parseIntercept(s: string): ParsedLine | null {
  // x/a + y/b = 1 or x/a - y/b = 1
  const m = /^x\/(-?\d*\.?\d+)\+?y\/(-?\d*\.?\d+)=1$/.exec(s) ||
            /^x\/(-?\d*\.?\d+)-y\/(-?\d*\.?\d+)=1$/.exec(s);
  if (!m) return null;
  const a = parseFloat(m[1]), b = parseFloat(m[2]);
  if (!a || !b) return null;
  // y/b = 1 - x/a → y = b - (b/a)x
  return { kind: "slope", m: -b / a, c: b };
}

function findKeyPoints(parsed: ParsedLine, color: string): KeyPoint[] {
  if (parsed.kind === "invalid") return [];
  const pts: KeyPoint[] = [];
  if (parsed.kind === "vertical") {
    pts.push({ x: parsed.x!, y: 0, label: `(${fmt(parsed.x!)}, 0)`, color });
    return pts;
  }
  const { m, c } = parsed;
  // y-intercept (x=0)
  pts.push({ x: 0, y: c, label: `(0, ${fmt(c)})`, color });
  // x-intercept (y=0)
  if (Math.abs(m) > 1e-10) {
    const xi = -c / m;
    pts.push({ x: xi, y: 0, label: `(${fmt(xi)}, 0)`, color });
  }
  return pts;
}

function fmt(n: number): string {
  if (!isFinite(n)) return "∞";
  if (Math.abs(n) < 1e-10) return "0";
  if (Number.isInteger(n)) return String(n);
  const frac = toFraction(n);
  if (frac) return frac;
  return n.toFixed(2).replace(/\.?0+$/, "");
}

function toFraction(x: number): string | null {
  for (let d = 1; d <= 12; d++) {
    const n = Math.round(x * d);
    if (Math.abs(n / d - x) < 1e-9 && Math.abs(n) <= 24) {
      if (d === 1) return String(n);
      const g = gcd(Math.abs(n), d);
      return `${n / g}/${d / g}`;
    }
  }
  return null;
}

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

/* ─── Canvas drawing ─────────────────────────────────────── */
function drawGrid(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  originX: number, originY: number,
  unitPx: number,
  showGrid: boolean,
  showLabels: boolean,
) {
  ctx.clearRect(0, 0, W, H);

  const step = niceStep(unitPx);
  const startX = Math.floor(-originX / unitPx / step) * step;
  const endX = Math.ceil((W - originX) / unitPx / step) * step;
  const startY = Math.floor(-(originY) / unitPx / step) * step * -1;
  const endY = Math.ceil((H - originY) / unitPx / step) * step * -1;

  // grid lines
  if (showGrid) {
    ctx.strokeStyle = "rgba(148,163,184,0.12)";
    ctx.lineWidth = 1;
    for (let gx = startX; gx <= endX; gx += step) {
      const px = originX + gx * unitPx;
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();
    }
    for (let gy = Math.ceil(endY / step) * step; gy <= Math.floor(startY / step) * step; gy += step) {
      const py = originY - gy * unitPx;
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke();
    }
  }

  // sub-grid (lighter)
  if (showGrid && unitPx > 40) {
    ctx.strokeStyle = "rgba(148,163,184,0.05)";
    ctx.lineWidth = 0.5;
    for (let gx = startX; gx <= endX; gx += step / 2) {
      if (Math.abs(gx % step) < 1e-9) continue;
      const px = originX + gx * unitPx;
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();
    }
  }

  // axes
  ctx.strokeStyle = "rgba(148,163,184,0.6)";
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(W, originY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, H); ctx.stroke();

  // arrowheads
  const aw = 7, ah = 5;
  ctx.fillStyle = "rgba(148,163,184,0.6)";
  // right arrow
  ctx.beginPath(); ctx.moveTo(W, originY); ctx.lineTo(W - aw, originY - ah); ctx.lineTo(W - aw, originY + ah); ctx.closePath(); ctx.fill();
  // top arrow
  ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX - ah, aw); ctx.lineTo(originX + ah, aw); ctx.closePath(); ctx.fill();

  // tick marks and labels
  if (showLabels) {
    ctx.fillStyle = "rgba(148,163,184,0.8)";
    ctx.font = `${Math.max(9, Math.min(12, unitPx * 0.3))}px monospace`;
    ctx.textAlign = "center";
    for (let gx = startX; gx <= endX; gx += step) {
      if (Math.abs(gx) < 1e-9) continue;
      const px = originX + gx * unitPx;
      ctx.beginPath(); ctx.moveTo(px, originY - 4); ctx.lineTo(px, originY + 4);
      ctx.strokeStyle = "rgba(148,163,184,0.5)"; ctx.lineWidth = 1; ctx.stroke();
      if (px > 8 && px < W - 8) ctx.fillText(fmt(gx), px, originY + 14);
    }
    ctx.textAlign = "right";
    for (let gy = Math.ceil(endY / step) * step; gy <= Math.floor(startY / step) * step; gy += step) {
      if (Math.abs(gy) < 1e-9) continue;
      const py = originY - gy * unitPx;
      ctx.beginPath(); ctx.moveTo(originX - 4, py); ctx.lineTo(originX + 4, py);
      ctx.strokeStyle = "rgba(148,163,184,0.5)"; ctx.lineWidth = 1; ctx.stroke();
      if (py > 8 && py < H - 8) ctx.fillText(fmt(gy), originX - 7, py + 4);
    }
    // axis labels
    ctx.fillStyle = "rgba(148,163,184,0.9)";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "left";
    ctx.fillText("x", W - 14, originY - 8);
    ctx.textAlign = "center";
    ctx.fillText("y", originX + 10, 12);
    ctx.fillText("O", originX + 10, originY + 14);
  }
}

function niceStep(unitPx: number): number {
  // target ~60-100px between major grid lines
  const targetPx = 70;
  const raw = targetPx / unitPx;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / pow;
  if (norm < 1.5) return pow;
  if (norm < 3.5) return 2 * pow;
  if (norm < 7.5) return 5 * pow;
  return 10 * pow;
}

function drawLines(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  originX: number, originY: number,
  unitPx: number,
  lines: LineEntry[],
) {
  for (const line of lines) {
    if (!line.visible || line.error) continue;
    const parsed = parseLine(line.raw);
    if (parsed.kind === "invalid") continue;

    ctx.strokeStyle = line.color;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.shadowColor = line.color;
    ctx.shadowBlur = 4;
    ctx.beginPath();

    if (parsed.kind === "vertical") {
      const px = originX + (parsed.x ?? 0) * unitPx;
      ctx.moveTo(px, 0); ctx.lineTo(px, H);
    } else {
      const { m, c } = parsed;
      // compute y at x = screen left and right
      const xl = -originX / unitPx;
      const xr = (W - originX) / unitPx;
      const yl = m * xl + c;
      const yr = m * xr + c;
      const pxl = originX + xl * unitPx;
      const pyl = originY - yl * unitPx;
      const pxr = originX + xr * unitPx;
      const pyr = originY - yr * unitPx;
      ctx.moveTo(pxl, pyl);
      ctx.lineTo(pxr, pyr);
    }

    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

function drawPoints(
  ctx: CanvasRenderingContext2D,
  originX: number, originY: number, unitPx: number,
  lines: LineEntry[],
  showPoints: boolean,
) {
  if (!showPoints) return;
  const seen = new Set<string>();
  for (const line of lines) {
    if (!line.visible || line.error) continue;
    const parsed = parseLine(line.raw);
    const pts = findKeyPoints(parsed, line.color);
    for (const pt of pts) {
      const key = `${pt.x.toFixed(4)},${pt.y.toFixed(4)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const px = originX + pt.x * unitPx;
      const py = originY - pt.y * unitPx;
      if (px < -20 || px > ctx.canvas.width + 20 || py < -20 || py > ctx.canvas.height + 20) continue;

      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fillStyle = pt.color;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
}

function drawIntersections(
  ctx: CanvasRenderingContext2D,
  originX: number, originY: number, unitPx: number,
  lines: LineEntry[],
) {
  const visible = lines.filter(l => l.visible && !l.error);
  for (let i = 0; i < visible.length; i++) {
    for (let j = i + 1; j < visible.length; j++) {
      const p1 = parseLine(visible[i].raw);
      const p2 = parseLine(visible[j].raw);
      if (p1.kind === "invalid" || p2.kind === "invalid") continue;

      let ix: number, iy: number;
      if (p1.kind === "vertical" && p2.kind === "vertical") continue;
      if (p1.kind === "vertical") {
        ix = p1.x!; iy = p2.m * ix + p2.c;
      } else if (p2.kind === "vertical") {
        ix = p2.x!; iy = p1.m * ix + p1.c;
      } else {
        if (Math.abs(p1.m - p2.m) < 1e-10) continue;
        ix = (p2.c - p1.c) / (p1.m - p2.m);
        iy = p1.m * ix + p1.c;
      }

      const px = originX + ix * unitPx;
      const py = originY - iy * unitPx;
      if (px < -10 || px > ctx.canvas.width + 10 || py < -10 || py > ctx.canvas.height + 10) continue;

      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(250,204,21,0.9)";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
}

function drawCursor(
  ctx: CanvasRenderingContext2D,
  mx: number, my: number,
  originX: number, originY: number,
  unitPx: number,
) {
  const mathX = (mx - originX) / unitPx;
  const mathY = (originY - my) / unitPx;

  ctx.strokeStyle = "rgba(148,163,184,0.25)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(mx, 0); ctx.lineTo(mx, ctx.canvas.height); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, my); ctx.lineTo(ctx.canvas.width, my); ctx.stroke();
  ctx.setLineDash([]);

  const label = `(${mathX.toFixed(2)}, ${mathY.toFixed(2)})`;
  ctx.font = "11px monospace";
  const tw = ctx.measureText(label).width;
  let lx = mx + 8, ly = my - 8;
  if (lx + tw + 10 > ctx.canvas.width) lx = mx - tw - 14;
  if (ly - 18 < 0) ly = my + 22;

  ctx.fillStyle = "rgba(15,23,42,0.85)";
  ctx.beginPath();
  ctx.roundRect(lx - 4, ly - 14, tw + 12, 20, 4);
  ctx.fill();
  ctx.fillStyle = "#22d3ee";
  ctx.fillText(label, lx + 2, ly);
}

/* ─── Main component ─────────────────────────────────────── */
const INITIAL_UNIT = 50;

export default function GeoGebraGrapher() {
  const uid = useId().replace(/:/g, "");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 600, h: 420 });
  const [unitPx, setUnitPx] = useState(INITIAL_UNIT);
  const [origin, setOrigin] = useState({ x: 300, y: 210 });
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showPoints, setShowPoints] = useState(true);
  const [showIntersections, setShowIntersections] = useState(true);
  const [tool, setTool] = useState<"pointer" | "pan">("pointer");
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [lines, setLines] = useState<LineEntry[]>([
    { id: uid + "0", raw: "y = 2x + 1", color: PALETTE[0], visible: true, error: null },
    { id: uid + "1", raw: "y = -x + 3", color: PALETTE[1], visible: true, error: null },
  ]);
  const [input, setInput] = useState("");
  const [colorIdx, setColorIdx] = useState(2);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  // Resize observer
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      const h = Math.max(340, Math.min(500, width * 0.65));
      setSize({ w: width, h });
      setOrigin(prev => ({ x: width / 2, y: h / 2 }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = size;
    canvas.width = w; canvas.height = h;
    drawGrid(ctx, w, h, origin.x, origin.y, unitPx, showGrid, showLabels);
    drawLines(ctx, w, h, origin.x, origin.y, unitPx, lines);
    drawPoints(ctx, origin.x, origin.y, unitPx, lines, showPoints);
    if (showIntersections) drawIntersections(ctx, origin.x, origin.y, unitPx, lines);
    if (cursor) drawCursor(ctx, cursor.x, cursor.y, origin.x, origin.y, unitPx);
  }, [size, unitPx, origin, showGrid, showLabels, showPoints, showIntersections, lines, cursor]);

  // Mouse handlers
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (dragRef.current && tool === "pan") {
      const dx = mx - dragRef.current.startX;
      const dy = my - dragRef.current.startY;
      setOrigin({ x: dragRef.current.origX + dx, y: dragRef.current.origY + dy });
    }
    if (tool === "pointer") setCursor({ x: mx, y: my });
  }, [tool]);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      origX: origin.x,
      origY: origin.y,
    };
  }, [origin]);

  const onMouseUp = useCallback(() => { dragRef.current = null; }, []);
  const onMouseLeave = useCallback(() => { dragRef.current = null; setCursor(null); }, []);

  const onWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setUnitPx(u => Math.max(8, Math.min(200, u * factor)));
    setOrigin(prev => ({
      x: mx + (prev.x - mx) * factor,
      y: my + (prev.y - my) * factor,
    }));
  }, []);

  // Touch support
  const touchRef = useRef<{ x: number; y: number; dist: number } | null>(null);
  const onTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const rect = e.currentTarget.getBoundingClientRect();
      const t = e.touches[0];
      touchRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top, dist: 0 };
      dragRef.current = { startX: t.clientX - rect.left, startY: t.clientY - rect.top, origX: origin.x, origY: origin.y };
    }
  }, [origin]);

  const onTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.touches.length === 1 && dragRef.current) {
      const t = e.touches[0];
      const mx = t.clientX - rect.left, my = t.clientY - rect.top;
      setOrigin({ x: dragRef.current.origX + mx - dragRef.current.startX, y: dragRef.current.origY + my - dragRef.current.startY });
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0], t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      if (touchRef.current && touchRef.current.dist > 0) {
        const factor = dist / touchRef.current.dist;
        setUnitPx(u => Math.max(8, Math.min(200, u * factor)));
      }
      if (touchRef.current) touchRef.current.dist = dist;
    }
  }, []);

  const onTouchEnd = useCallback(() => { dragRef.current = null; if (touchRef.current) touchRef.current.dist = 0; }, []);

  // Add line
  const addLine = useCallback(() => {
    const raw = input.trim();
    if (!raw) return;
    const parsed = parseLine(raw);
    const newLine: LineEntry = {
      id: uid + Date.now(),
      raw,
      color: PALETTE[colorIdx % PALETTE.length],
      visible: true,
      error: parsed.kind === "invalid" ? "Persamaan tidak dikenali" : null,
    };
    setLines(prev => [...prev, newLine]);
    setInput("");
    setColorIdx(c => c + 1);
  }, [input, colorIdx, uid]);

  const toggleLine = useCallback((id: string) => {
    setLines(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  }, []);

  const removeLine = useCallback((id: string) => {
    setLines(prev => prev.filter(l => l.id !== id));
  }, []);

  const updateLineRaw = useCallback((id: string, raw: string) => {
    const parsed = parseLine(raw);
    setLines(prev => prev.map(l => l.id === id
      ? { ...l, raw, error: raw && parsed.kind === "invalid" ? "Persamaan tidak dikenali" : null }
      : l));
  }, []);

  const changeLineColor = useCallback((id: string, color: string) => {
    setLines(prev => prev.map(l => l.id === id ? { ...l, color } : l));
  }, []);

  const reset = useCallback(() => {
    setUnitPx(INITIAL_UNIT);
    setOrigin({ x: size.w / 2, y: size.h / 2 });
  }, [size]);

  const downloadCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "grafik-persamaan-garis-lurus.png";
    link.href = canvas.toDataURL();
    link.click();
  }, []);

  const zoom = useCallback((factor: number) => {
    setUnitPx(u => Math.max(8, Math.min(200, u * factor)));
    setOrigin(prev => ({
      x: size.w / 2 + (prev.x - size.w / 2) * factor,
      y: size.h / 2 + (prev.y - size.h / 2) * factor,
    }));
  }, [size]);

  // Parse math origin coords for display
  const originMath = {
    x: (-origin.x / unitPx).toFixed(1),
    y: (origin.y / unitPx).toFixed(1),
  };

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 backdrop-blur overflow-hidden select-none">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-white/10 bg-slate-800/60">
        <span className="font-display font-bold text-cyan-300 text-sm mr-1">📐 GrafikPGL</span>
        <div className="flex gap-1">
          <ToolBtn active={tool === "pointer"} onClick={() => setTool("pointer")} title="Pointer / Koordinat">
            <MousePointer2 className="w-4 h-4" />
          </ToolBtn>
          <ToolBtn active={tool === "pan"} onClick={() => setTool("pan")} title="Geser Bidang">
            <Move className="w-4 h-4" />
          </ToolBtn>
        </div>
        <div className="w-px h-5 bg-white/20 mx-1" />
        <div className="flex gap-1">
          <ToolBtn onClick={() => zoom(1.25)} title="Perbesar"><ZoomIn className="w-4 h-4" /></ToolBtn>
          <ToolBtn onClick={() => zoom(0.8)} title="Perkecil"><ZoomOut className="w-4 h-4" /></ToolBtn>
          <ToolBtn onClick={reset} title="Reset Tampilan"><RotateCcw className="w-4 h-4" /></ToolBtn>
        </div>
        <div className="w-px h-5 bg-white/20 mx-1" />
        <div className="flex gap-1">
          <ToolBtn active={showGrid} onClick={() => setShowGrid(s => !s)} title="Tampilkan Grid">
            <Grid3x3 className="w-4 h-4" />
          </ToolBtn>
          <ToolBtn active={showPoints} onClick={() => setShowPoints(s => !s)} title="Titik Kunci">
            {showPoints ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </ToolBtn>
        </div>
        <div className="ml-auto">
          <ToolBtn onClick={downloadCanvas} title="Unduh Gambar"><Download className="w-4 h-4" /></ToolBtn>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Canvas */}
        <div ref={containerRef} className="flex-1 relative" style={{ minWidth: 0 }}>
          <canvas
            ref={canvasRef}
            width={size.w}
            height={size.h}
            style={{
              display: "block",
              width: "100%",
              cursor: tool === "pan" ? "grab" : "crosshair",
              background: "rgb(10,17,32)",
            }}
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onWheel={onWheel}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
          {/* Origin info badge */}
          <div className="absolute bottom-2 left-2 text-xs text-white/30 font-mono pointer-events-none">
            pusat ({originMath.x}, {originMath.y}) | skala {unitPx.toFixed(0)}px/unit
          </div>
        </div>

        {/* Equation panel */}
        <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-white/10 bg-slate-900/60 flex flex-col">
          {/* Add equation */}
          <div className="p-3 border-b border-white/10 space-y-2">
            <p className="text-xs font-bold text-white/60 uppercase tracking-wider">Tambah Persamaan</p>
            <div className="flex gap-1">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addLine()}
                placeholder="y = 2x + 1"
                className="flex-1 bg-slate-800 border border-white/20 rounded-lg px-2 py-1.5 text-sm text-white placeholder-white/30 font-mono focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={addLine}
                className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg px-2 py-1.5 transition-colors"
                title="Tambah"
              ><Plus className="w-4 h-4" /></button>
            </div>
            <div className="text-xs text-white/40 space-y-0.5">
              <p>Contoh format:</p>
              <p className="font-mono text-white/60">y = 2x + 1</p>
              <p className="font-mono text-white/60">3x - 2y + 6 = 0</p>
              <p className="font-mono text-white/60">x/4 + y/3 = 1</p>
              <p className="font-mono text-white/60">x = 5</p>
              <p className="font-mono text-white/60">y = -3</p>
            </div>
          </div>

          {/* Line list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {lines.length === 0 && (
              <p className="text-xs text-white/30 text-center py-4">Belum ada persamaan.<br />Ketik dan tekan Enter!</p>
            )}
            {lines.map((line) => (
              <div
                key={line.id}
                className={`rounded-xl border p-2 space-y-1.5 ${line.error ? "border-red-500/40 bg-red-900/10" : "border-white/10 bg-slate-800/40"}`}
              >
                <div className="flex items-center gap-1.5">
                  {/* Color dot / picker */}
                  <div className="relative">
                    <input
                      type="color"
                      value={line.color}
                      onChange={e => changeLineColor(line.id, e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="w-4 h-4 rounded-full border border-white/30 shrink-0" style={{ background: line.color }} />
                  </div>

                  {/* Editable equation */}
                  <input
                    type="text"
                    value={line.raw}
                    onChange={e => updateLineRaw(line.id, e.target.value)}
                    className="flex-1 bg-transparent text-xs font-mono text-white focus:outline-none min-w-0"
                    style={{ color: line.color }}
                  />

                  {/* Toggle visibility */}
                  <button onClick={() => toggleLine(line.id)} className="text-white/40 hover:text-white/80 transition-colors shrink-0">
                    {line.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Delete */}
                  <button onClick={() => removeLine(line.id)} className="text-white/40 hover:text-red-400 transition-colors shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Error */}
                {line.error && <p className="text-xs text-red-400">{line.error}</p>}

                {/* Key points */}
                {!line.error && line.visible && (() => {
                  const parsed = parseLine(line.raw);
                  const pts = findKeyPoints(parsed, line.color);
                  if (pts.length === 0) return null;
                  return (
                    <div className="space-y-0.5">
                      {pts.map((pt, i) => (
                        <p key={i} className="text-xs font-mono" style={{ color: line.color }}>
                          {pt.label}
                        </p>
                      ))}
                      {parsed.kind === "slope" && (
                        <p className="text-xs text-white/40">
                          m = {fmt(parsed.m)} · c = {fmt(parsed.c)}
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>

          {/* Settings toggles */}
          <div className="p-2 border-t border-white/10 space-y-1">
            <Toggle label="Titik Perpotongan" checked={showIntersections} onChange={setShowIntersections} />
            <Toggle label="Label Sumbu" checked={showLabels} onChange={setShowLabels} />
          </div>
        </div>
      </div>

      {/* Help bar */}
      <div className="px-3 py-1.5 border-t border-white/10 bg-slate-800/40 text-xs text-white/40 flex flex-wrap gap-x-4 gap-y-0.5">
        <span>🖱️ Scroll = zoom</span>
        <span>🤏 Pinch = zoom (sentuh)</span>
        <span>✋ Mode Geser = seret bidang</span>
        <span>👆 Hover = koordinat</span>
        <span>🟡 Titik kuning = titik potong</span>
      </div>
    </div>
  );
}

/* ─── Small UI helpers ───────────────────────────────────── */
function ToolBtn({ children, onClick, title, active }: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg transition-colors ${
        active
          ? "bg-cyan-600 text-white"
          : "bg-white/5 text-white/60 hover:bg-white/15 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between text-xs text-white/50 hover:text-white/80 transition-colors"
    >
      <span>{label}</span>
      <div className={`w-7 h-4 rounded-full transition-colors ${checked ? "bg-cyan-600" : "bg-slate-600"} relative`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${checked ? "left-3.5" : "left-0.5"}`} />
      </div>
    </button>
  );
}
