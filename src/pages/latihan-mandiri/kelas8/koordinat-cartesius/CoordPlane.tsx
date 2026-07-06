type Pt = {
  x: number; y: number;
  label?: string;
  color?: string;
  labelPos?: 'tr' | 'tl' | 'br' | 'bl' | 'top' | 'bot';
};
type Seg = {
  x1: number; y1: number; x2: number; y2: number;
  color?: string; dashed?: boolean; label?: string;
};
type ExtraText = { x: number; y: number; text: string; color?: string; size?: number };
type ShadeRegion = { type: 'rect'; x1: number; y1: number; x2: number; y2: number; color?: string };
type Circle = { cx: number; cy: number; r: number; color?: string; dashed?: boolean };
type RightAngleMark = { points: [[number, number], [number, number], [number, number]]; color?: string };
/** Arrow mark drawn along a line to indicate parallel lines.
 *  x, y  — position in math coordinates (tip of arrowhead)
 *  slope — slope of the line (determines arrowhead direction)
 *  size  — arrowhead length in coordinate units (default 0.7)
 *  reverse — flip direction (default false = points toward increasing x)
 */
type ArrowMark = { x: number; y: number; slope: number; size?: number; color?: string; reverse?: boolean };

export type CoordPlaneProps = {
  pts?: Pt[];
  segs?: Seg[];
  circles?: Circle[];
  range?: number;
  size?: number;
  extraTexts?: ExtraText[];
  shades?: ShadeRegion[];
  quadrantLabels?: boolean;
  title?: string;
  lightBg?: boolean;
  rightAngleMarks?: RightAngleMark[];
  arrowMarks?: ArrowMark[];
};

const CoordPlane = ({
  pts = [],
  segs = [],
  circles = [],
  range = 6,
  size = 240,
  extraTexts = [],
  shades = [],
  quadrantLabels = false,
  title,
  lightBg = false,
  rightAngleMarks = [],
  arrowMarks = [],
}: CoordPlaneProps) => {
  const pad = 18;
  const inner = size - 2 * pad;
  const sc = inner / (2 * range);
  const cx = pad + range * sc;
  const cy = pad + range * sc;
  const px = (x: number) => cx + x * sc;
  const py = (y: number) => cy - y * sc;
  const ticks = Array.from({ length: 2 * range - 1 }, (_, i) => i - range + 1).filter(n => n !== 0);

  // Theme colours
  const bg          = lightBg ? '#ffffff'               : 'rgba(2,8,23,0.95)';
  const gridLine    = lightBg ? 'rgba(0,0,0,0.09)'      : 'rgba(148,163,184,0.07)';
  const axisStroke  = lightBg ? 'rgba(30,30,30,0.75)'   : 'rgba(148,163,184,0.55)';
  const axisLabel   = lightBg ? 'rgba(30,30,30,0.85)'   : 'rgba(148,163,184,0.8)';
  const originLabel = lightBg ? 'rgba(30,30,30,0.5)'    : 'rgba(148,163,184,0.45)';
  const tickStroke  = lightBg ? 'rgba(30,30,30,0.5)'    : 'rgba(148,163,184,0.4)';
  const tickNum     = lightBg ? 'rgba(30,30,30,0.6)'    : 'rgba(148,163,184,0.45)';
  const ptStroke    = lightBg ? 'rgba(0,0,0,0.25)'      : 'rgba(255,255,255,0.8)';
  const extraFill   = lightBg ? 'rgba(0,0,0,0.6)'       : 'rgba(255,255,255,0.5)';
  const titleColor  = lightBg ? 'text-black/50'         : 'text-white/50';

  return (
    <div className="flex flex-col items-center">
      {title && <p className={`${titleColor} text-[10px] text-center mb-1 font-body`}>{title}</p>}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-xl overflow-hidden">
        <rect width={size} height={size} fill={bg} rx="12" />

        {/* Shaded regions */}
        {shades.map((s, i) => (
          <rect key={i}
            x={Math.min(px(s.x1), px(s.x2))}
            y={Math.min(py(s.y1), py(s.y2))}
            width={Math.abs(px(s.x2) - px(s.x1))}
            height={Math.abs(py(s.y2) - py(s.y1))}
            fill={s.color || 'rgba(96,165,250,0.1)'}
          />
        ))}

        {/* Grid lines */}
        {ticks.map(n => (
          <g key={n}>
            <line x1={px(n)} y1={pad} x2={px(n)} y2={size - pad} stroke={gridLine} strokeWidth="0.5" />
            <line x1={pad} y1={py(n)} x2={size - pad} y2={py(n)} stroke={gridLine} strokeWidth="0.5" />
          </g>
        ))}

        {/* Axes */}
        <line x1={pad} y1={cy} x2={size - pad + 4} y2={cy} stroke={axisStroke} strokeWidth="1.5" />
        <line x1={cx} y1={size - pad + 4} x2={cx} y2={pad - 4} stroke={axisStroke} strokeWidth="1.5" />

        {/* Axis arrows */}
        <polygon points={`${size - pad + 5},${cy} ${size - pad - 3},${cy - 4} ${size - pad - 3},${cy + 4}`} fill={axisStroke} />
        <polygon points={`${cx},${pad - 5} ${cx - 4},${pad + 3} ${cx + 4},${pad + 3}`} fill={axisStroke} />

        {/* Axis labels */}
        <text x={size - pad + 8} y={cy + 4} fill={axisLabel} fontSize="12" textAnchor="start" fontStyle="italic">x</text>
        <text x={cx + 6} y={pad - 6} fill={axisLabel} fontSize="12" fontStyle="italic">y</text>
        <text x={cx + 5} y={cy + 12} fill={originLabel} fontSize="9">O</text>

        {/* Tick marks & numbers */}
        {ticks.map(n => (
          <g key={n}>
            <line x1={px(n)} y1={cy - 3} x2={px(n)} y2={cy + 3} stroke={tickStroke} strokeWidth="1" />
            <line x1={cx - 3} y1={py(n)} x2={cx + 3} y2={py(n)} stroke={tickStroke} strokeWidth="1" />
            <text x={px(n)} y={cy + 13} fill={tickNum} fontSize="8" textAnchor="middle">{n}</text>
            <text x={cx - 5} y={py(n) + 3} fill={tickNum} fontSize="8" textAnchor="end">{n}</text>
          </g>
        ))}

        {/* Quadrant labels */}
        {quadrantLabels && (
          <>
            <text x={cx + inner * 0.3} y={cy - inner * 0.3} fill={lightBg ? 'rgba(202,138,4,0.35)' : 'rgba(250,204,21,0.3)'} fontSize="18" fontWeight="bold" textAnchor="middle">I</text>
            <text x={cx - inner * 0.3} y={cy - inner * 0.3} fill={lightBg ? 'rgba(109,40,217,0.3)' : 'rgba(167,139,250,0.3)'} fontSize="18" fontWeight="bold" textAnchor="middle">II</text>
            <text x={cx - inner * 0.3} y={cy + inner * 0.35} fill={lightBg ? 'rgba(4,120,87,0.3)' : 'rgba(52,211,153,0.3)'} fontSize="18" fontWeight="bold" textAnchor="middle">III</text>
            <text x={cx + inner * 0.3} y={cy + inner * 0.35} fill={lightBg ? 'rgba(190,18,60,0.3)' : 'rgba(251,113,133,0.3)'} fontSize="18" fontWeight="bold" textAnchor="middle">IV</text>
          </>
        )}

        {/* Circles */}
        {circles.map((c, i) => (
          <circle key={i}
            cx={px(c.cx)} cy={py(c.cy)} r={c.r * sc}
            fill="none"
            stroke={c.color || '#60a5fa'} strokeWidth="1.8"
            strokeDasharray={c.dashed ? "6,4" : undefined}
          />
        ))}

        {/* Segments */}
        {segs.map((s, i) => {
          const mx = (px(s.x1) + px(s.x2)) / 2;
          const my = (py(s.y1) + py(s.y2)) / 2;
          return (
            <g key={i}>
              <line x1={px(s.x1)} y1={py(s.y1)} x2={px(s.x2)} y2={py(s.y2)}
                stroke={s.color || '#60a5fa'} strokeWidth="1.8"
                strokeDasharray={s.dashed ? "5,3" : undefined} />
              {s.label && (
                <text x={mx + 5} y={my - 5} fill={s.color || '#60a5fa'} fontSize="10" fontWeight="bold">{s.label}</text>
              )}
            </g>
          );
        })}

        {/* Points */}
        {pts.map((p, i) => {
          const lx = p.labelPos?.includes('l') ? px(p.x) - 9 : px(p.x) + 9;
          const ly =
            p.labelPos === 'top' ? py(p.y) - 9
            : p.labelPos === 'bot' ? py(p.y) + 15
            : p.labelPos?.includes('b') ? py(p.y) + 15
            : py(p.y) - 7;
          return (
            <g key={i}>
              <circle cx={px(p.x)} cy={py(p.y)} r={4.5} fill={p.color || '#f472b6'} stroke={ptStroke} strokeWidth="1.2" />
              {p.label && (
                <text x={lx} y={ly} fill={p.color || '#f472b6'} fontSize="11" fontWeight="bold"
                  textAnchor={p.labelPos?.includes('l') ? 'end' : 'start'}>{p.label}</text>
              )}
            </g>
          );
        })}

        {/* Right-angle marks */}
        {rightAngleMarks.map((m, i) => (
          <polyline key={i}
            points={m.points.map(([x, y]) => `${px(x)},${py(y)}`).join(' ')}
            fill="none" stroke={m.color || axisStroke} strokeWidth="1.5"
          />
        ))}

        {/* Arrow marks — indicate parallel lines */}
        {arrowMarks.map((m, i) => {
          const dir = m.reverse ? -1 : 1;
          const len = Math.sqrt(1 + m.slope * m.slope);
          // SVG direction: x→right, y flipped so dy_svg = -slope
          const nx = dir / len;
          const ny = dir * (-m.slope) / len;
          const s = (m.size ?? 0.7) * sc;
          const tipX = px(m.x);
          const tipY = py(m.y);
          const bx = tipX - nx * s;
          const by = tipY - ny * s;
          // perpendicular for wing spread
          const wx = -ny * s * 0.45;
          const wy =  nx * s * 0.45;
          return (
            <polygon key={i}
              points={`${tipX},${tipY} ${bx + wx},${by + wy} ${bx - wx},${by - wy}`}
              fill={m.color || axisStroke}
            />
          );
        })}

        {/* Extra text elements */}
        {extraTexts.map((t, i) => (
          <text key={i} x={px(t.x)} y={py(t.y)} fill={t.color || extraFill}
            fontSize={t.size || 9} textAnchor="middle">{t.text}</text>
        ))}
      </svg>
    </div>
  );
};

export default CoordPlane;
