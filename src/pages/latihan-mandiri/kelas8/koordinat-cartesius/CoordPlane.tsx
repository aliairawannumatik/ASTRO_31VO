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

export type CoordPlaneProps = {
  pts?: Pt[];
  segs?: Seg[];
  range?: number;
  size?: number;
  extraTexts?: ExtraText[];
  shades?: ShadeRegion[];
  quadrantLabels?: boolean;
  title?: string;
};

const CoordPlane = ({
  pts = [],
  segs = [],
  range = 6,
  size = 240,
  extraTexts = [],
  shades = [],
  quadrantLabels = false,
  title,
}: CoordPlaneProps) => {
  const pad = 18;
  const inner = size - 2 * pad;
  const sc = inner / (2 * range);
  const cx = pad + range * sc;
  const cy = pad + range * sc;
  const px = (x: number) => cx + x * sc;
  const py = (y: number) => cy - y * sc;
  const ticks = Array.from({ length: 2 * range - 1 }, (_, i) => i - range + 1).filter(n => n !== 0);

  return (
    <div className="flex flex-col items-center">
      {title && <p className="text-white/50 text-[10px] text-center mb-1 font-body">{title}</p>}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-xl overflow-hidden">
        <rect width={size} height={size} fill="rgba(2,8,23,0.95)" rx="12" />

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
            <line x1={px(n)} y1={pad} x2={px(n)} y2={size - pad} stroke="rgba(148,163,184,0.07)" strokeWidth="0.5" />
            <line x1={pad} y1={py(n)} x2={size - pad} y2={py(n)} stroke="rgba(148,163,184,0.07)" strokeWidth="0.5" />
          </g>
        ))}

        {/* Axes */}
        <line x1={pad} y1={cy} x2={size - pad + 4} y2={cy} stroke="rgba(148,163,184,0.55)" strokeWidth="1.5" />
        <line x1={cx} y1={size - pad + 4} x2={cx} y2={pad - 4} stroke="rgba(148,163,184,0.55)" strokeWidth="1.5" />

        {/* Axis arrows */}
        <polygon points={`${size - pad + 5},${cy} ${size - pad - 3},${cy - 4} ${size - pad - 3},${cy + 4}`} fill="rgba(148,163,184,0.55)" />
        <polygon points={`${cx},${pad - 5} ${cx - 4},${pad + 3} ${cx + 4},${pad + 3}`} fill="rgba(148,163,184,0.55)" />

        {/* Axis labels */}
        <text x={size - pad + 8} y={cy + 4} fill="rgba(148,163,184,0.8)" fontSize="12" textAnchor="start" fontStyle="italic">x</text>
        <text x={cx + 6} y={pad - 6} fill="rgba(148,163,184,0.8)" fontSize="12" fontStyle="italic">y</text>
        <text x={cx + 5} y={cy + 12} fill="rgba(148,163,184,0.45)" fontSize="9">O</text>

        {/* Tick marks & numbers */}
        {ticks.map(n => (
          <g key={n}>
            <line x1={px(n)} y1={cy - 3} x2={px(n)} y2={cy + 3} stroke="rgba(148,163,184,0.4)" strokeWidth="1" />
            <line x1={cx - 3} y1={py(n)} x2={cx + 3} y2={py(n)} stroke="rgba(148,163,184,0.4)" strokeWidth="1" />
            <text x={px(n)} y={cy + 13} fill="rgba(148,163,184,0.45)" fontSize="8" textAnchor="middle">{n}</text>
            <text x={cx - 5} y={py(n) + 3} fill="rgba(148,163,184,0.45)" fontSize="8" textAnchor="end">{n}</text>
          </g>
        ))}

        {/* Quadrant labels */}
        {quadrantLabels && (
          <>
            <text x={cx + inner * 0.3} y={cy - inner * 0.3} fill="rgba(250,204,21,0.3)" fontSize="18" fontWeight="bold" textAnchor="middle">I</text>
            <text x={cx - inner * 0.3} y={cy - inner * 0.3} fill="rgba(167,139,250,0.3)" fontSize="18" fontWeight="bold" textAnchor="middle">II</text>
            <text x={cx - inner * 0.3} y={cy + inner * 0.35} fill="rgba(52,211,153,0.3)" fontSize="18" fontWeight="bold" textAnchor="middle">III</text>
            <text x={cx + inner * 0.3} y={cy + inner * 0.35} fill="rgba(251,113,133,0.3)" fontSize="18" fontWeight="bold" textAnchor="middle">IV</text>
          </>
        )}

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
              <circle cx={px(p.x)} cy={py(p.y)} r={4.5} fill={p.color || '#f472b6'} stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" />
              {p.label && (
                <text x={lx} y={ly} fill={p.color || '#f472b6'} fontSize="11" fontWeight="bold"
                  textAnchor={p.labelPos?.includes('l') ? 'end' : 'start'}>{p.label}</text>
              )}
            </g>
          );
        })}

        {/* Extra text elements */}
        {extraTexts.map((t, i) => (
          <text key={i} x={px(t.x)} y={py(t.y)} fill={t.color || 'rgba(255,255,255,0.5)'}
            fontSize={t.size || 9} textAnchor="middle">{t.text}</text>
        ))}
      </svg>
    </div>
  );
};

export default CoordPlane;
