type CirclePt = {
  angle: number;
  label?: string;
  color?: string;
  labelOffset?: number;
};
type CircleArc = {
  startAngle: number;
  endAngle: number;
  color: string;
  width?: number;
};
type CircleSector = {
  startAngle: number;
  endAngle: number;
  fillColor: string;
  strokeColor?: string;
  label?: string;
  labelAngle?: number;
};
type CircleChord = {
  angle1: number;
  angle2: number;
  color?: string;
  label?: string;
  dashed?: boolean;
};
type CircleRadius = {
  angle: number;
  color?: string;
  label?: string;
  dashed?: boolean;
  toEdge?: boolean;
};
type ExtraLine = {
  x1: number; y1: number; x2: number; y2: number;
  color?: string; dashed?: boolean; label?: string;
};
type ExtraCircle = {
  cx: number; cy: number; r: number;
  color?: string; fill?: string; strokeWidth?: number;
};
type ExtraText = { x: number; y: number; text: string; color?: string; size?: number; bold?: boolean };
type AngleArc = {
  vertex: [number, number];
  from: number;
  to: number;
  color?: string;
  label?: string;
  arcR?: number;
};
type ExtraRect = {
  x: number; y: number; w: number; h: number;
  color?: string; fill?: string;
};

export type CircleDiagramProps = {
  size?: number;
  r?: number;
  showCenter?: boolean;
  centerLabel?: string;
  centerColor?: string;
  circleFill?: string;
  circleStroke?: string;
  pts?: CirclePt[];
  arcs?: CircleArc[];
  sectors?: CircleSector[];
  chords?: CircleChord[];
  radii?: CircleRadius[];
  extraLines?: ExtraLine[];
  extraTexts?: ExtraText[];
  extraCircles?: ExtraCircle[];
  extraRects?: ExtraRect[];
  angleArcs?: AngleArc[];
  title?: string;
};

const toRad = (deg: number) => (deg * Math.PI) / 180;

const CircleDiagram = ({
  size = 260,
  r: rFrac = 0.65,
  showCenter = true,
  centerLabel = "O",
  centerColor = "#94a3b8",
  circleFill = "rgba(56,189,248,0.05)",
  circleStroke = "rgba(56,189,248,0.6)",
  pts = [],
  arcs = [],
  sectors = [],
  chords = [],
  radii = [],
  extraLines = [],
  extraTexts = [],
  extraCircles = [],
  extraRects = [],
  angleArcs = [],
  title,
}: CircleDiagramProps) => {
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * rFrac;

  const ptX = (angle: number, radius?: number) => cx + (radius ?? R) * Math.cos(toRad(angle));
  const ptY = (angle: number, radius?: number) => cy - (radius ?? R) * Math.sin(toRad(angle));

  const arcPath = (sa: number, ea: number, radius: number) => {
    const x1 = ptX(sa, radius);
    const y1 = ptY(sa, radius);
    const x2 = ptX(ea, radius);
    const y2 = ptY(ea, radius);
    let sweep = sa - ea;
    if (sweep < 0) sweep += 360;
    const large = sweep > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 0 ${x2} ${y2}`;
  };

  const sectorPath = (sa: number, ea: number) => {
    const x1 = ptX(sa);
    const y1 = ptY(sa);
    const x2 = ptX(ea);
    const y2 = ptY(ea);
    let sweep = sa - ea;
    if (sweep < 0) sweep += 360;
    const large = sweep > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${large} 0 ${x2} ${y2} Z`;
  };

  const anglePath = (vertex: [number, number], from: number, to: number, arcR: number) => {
    const [vx, vy] = vertex;
    const x1 = vx + arcR * Math.cos(toRad(from));
    const y1 = vy - arcR * Math.sin(toRad(from));
    const x2 = vx + arcR * Math.cos(toRad(to));
    const y2 = vy - arcR * Math.sin(toRad(to));
    let diff = to - from;
    if (diff < 0) diff += 360;
    const large = diff > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${arcR} ${arcR} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <div className="flex flex-col items-center">
      {title && <p className="text-white/50 text-[10px] text-center mb-1 font-body">{title}</p>}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-xl overflow-hidden">
        <rect width={size} height={size} fill="rgba(2,8,23,0.95)" rx="12" />

        {extraRects.map((rect, i) => (
          <rect key={i} x={rect.x} y={rect.y} width={rect.w} height={rect.h}
            fill={rect.fill || "none"} stroke={rect.color || "#94a3b8"} strokeWidth="1.5" />
        ))}

        {extraCircles.map((c, i) => (
          <circle key={i} cx={c.cx} cy={c.cy} r={c.r}
            fill={c.fill || "none"} stroke={c.color || "#94a3b8"} strokeWidth={c.strokeWidth ?? 1.5} />
        ))}

        {sectors.map((s, i) => (
          <path key={i} d={sectorPath(s.startAngle, s.endAngle)}
            fill={s.fillColor} stroke={s.strokeColor || "none"} strokeWidth="1" />
        ))}

        <circle cx={cx} cy={cy} r={R} fill={circleFill} stroke={circleStroke} strokeWidth="2" />

        {arcs.map((a, i) => (
          <path key={i} d={arcPath(a.startAngle, a.endAngle, R)}
            fill="none" stroke={a.color} strokeWidth={a.width ?? 4} strokeLinecap="round" />
        ))}

        {extraLines.map((l, i) => {
          const mx = (l.x1 + l.x2) / 2;
          const my = (l.y1 + l.y2) / 2;
          return (
            <g key={i}>
              <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                stroke={l.color || "#94a3b8"} strokeWidth="1.8"
                strokeDasharray={l.dashed ? "5,3" : undefined} />
              {l.label && <text x={mx + 6} y={my - 5} fill={l.color || "#94a3b8"} fontSize="10" fontWeight="bold">{l.label}</text>}
            </g>
          );
        })}

        {radii.map((rad, i) => {
          const ex = ptX(rad.angle);
          const ey = ptY(rad.angle);
          const mx = (cx + ex) / 2;
          const my = (cy + ey) / 2;
          const loff = rad.labelOffset ?? 12;
          const lx = mx + loff * Math.cos(toRad(rad.angle + 90));
          const ly = my - loff * Math.sin(toRad(rad.angle + 90));
          return (
            <g key={i}>
              <line x1={rad.toEdge ? ptX(rad.angle + 180) : cx} y1={rad.toEdge ? ptY(rad.angle + 180) : cy}
                x2={ex} y2={ey}
                stroke={rad.color || "#60a5fa"} strokeWidth="1.8"
                strokeDasharray={rad.dashed ? "5,3" : undefined} />
              {rad.label && <text x={lx} y={ly} fill={rad.color || "#60a5fa"} fontSize="11" fontWeight="bold" textAnchor="middle">{rad.label}</text>}
            </g>
          );
        })}

        {chords.map((ch, i) => {
          const x1 = ptX(ch.angle1);
          const y1 = ptY(ch.angle1);
          const x2 = ptX(ch.angle2);
          const y2 = ptY(ch.angle2);
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2;
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={ch.color || "#f472b6"} strokeWidth="1.8"
                strokeDasharray={ch.dashed ? "5,3" : undefined} />
              {ch.label && <text x={mx + 7} y={my - 5} fill={ch.color || "#f472b6"} fontSize="10" fontWeight="bold">{ch.label}</text>}
            </g>
          );
        })}

        {angleArcs.map((a, i) => {
          const arcR = a.arcR ?? 22;
          const midAngle = (a.from + a.to) / 2;
          const lx = a.vertex[0] + (arcR + 12) * Math.cos(toRad(midAngle));
          const ly = a.vertex[1] - (arcR + 12) * Math.sin(toRad(midAngle));
          return (
            <g key={i}>
              <path d={anglePath(a.vertex, a.from, a.to, arcR)}
                fill="none" stroke={a.color || "#facc15"} strokeWidth="1.5" />
              {a.label && <text x={lx} y={ly + 4} fill={a.color || "#facc15"} fontSize="10" fontWeight="bold" textAnchor="middle">{a.label}</text>}
            </g>
          );
        })}

        {sectors.map((s, i) => {
          if (!s.label) return null;
          const la = s.labelAngle ?? (s.startAngle + s.endAngle) / 2;
          const lx = cx + (R * 0.55) * Math.cos(toRad(la));
          const ly = cy - (R * 0.55) * Math.sin(toRad(la));
          return (
            <text key={`sl${i}`} x={lx} y={ly + 4} fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="bold" textAnchor="middle">{s.label}</text>
          );
        })}

        {showCenter && (
          <>
            <circle cx={cx} cy={cy} r={3.5} fill={centerColor} stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
            <text x={cx + 7} y={cy - 5} fill={centerColor} fontSize="12" fontWeight="bold">{centerLabel}</text>
          </>
        )}

        {pts.map((p, i) => {
          const px = ptX(p.angle);
          const py = ptY(p.angle);
          const off = p.labelOffset ?? 14;
          const lx = px + off * Math.cos(toRad(p.angle));
          const ly = py - off * Math.sin(toRad(p.angle));
          return (
            <g key={i}>
              <circle cx={px} cy={py} r={4} fill={p.color || "#f472b6"} stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" />
              {p.label && <text x={lx} y={ly + 4} fill={p.color || "#f472b6"} fontSize="11" fontWeight="bold" textAnchor="middle">{p.label}</text>}
            </g>
          );
        })}

        {extraTexts.map((t, i) => (
          <text key={i} x={t.x} y={t.y} fill={t.color || "rgba(255,255,255,0.6)"}
            fontSize={t.size || 10} fontWeight={t.bold ? "bold" : "normal"} textAnchor="middle">{t.text}</text>
        ))}
      </svg>
    </div>
  );
};

export default CircleDiagram;
