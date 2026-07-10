type Vertex = { x: number; y: number; label?: string; labelDx?: number; labelDy?: number; color?: string };
type SideMeta = { text?: string; color?: string; dx?: number; dy?: number };
type ExtraEl = { type: 'line'; x1: number; y1: number; x2: number; y2: number; color?: string; dashed?: boolean; label?: string; lx?: number; ly?: number }
             | { type: 'rect'; x: number; y: number; w: number; h: number; fill?: string; stroke?: string }
             | { type: 'text'; x: number; y: number; text: string; color?: string; size?: number; bold?: boolean; anchor?: string };

export type PythagorasDiagramProps = {
  A: Vertex; B: Vertex; C: Vertex;
  rightAngleAt?: 'A' | 'B' | 'C';
  AB?: SideMeta; BC?: SideMeta; CA?: SideMeta;
  extras?: ExtraEl[];
  size?: number;
  vw?: number; vh?: number;
  title?: string;
  fillColor?: string;
};

const RAMark = ({ vx, vy, va, vb, sz = 10 }: { vx: number; vy: number; va: Vertex; vb: Vertex; sz?: number }) => {
  const ax = va.x - vx; const ay = va.y - vy;
  const bx = vb.x - vx; const by = vb.y - vy;
  const la = Math.hypot(ax, ay); const lb = Math.hypot(bx, by);
  const uax = ax / la * sz; const uay = ay / la * sz;
  const ubx = bx / lb * sz; const uby = by / lb * sz;
  const px = vx + uax + ubx; const py = vy + uay + uby;
  return (
    <polygon
      points={`${vx + uax},${vy + uay} ${px},${py} ${vx + ubx},${vy + uby}`}
      fill="none" stroke="rgba(250,204,21,0.85)" strokeWidth="1.5"
    />
  );
};

const midLabel = (x1: number, y1: number, x2: number, y2: number, text: string, color: string, dx = 0, dy = 0) => {
  const mx = (x1 + x2) / 2 + dx;
  const my = (y1 + y2) / 2 + dy;
  return <text key={`sl-${text}`} x={mx} y={my} fill={color} fontSize="13" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">{text}</text>;
};

const PythagorasDiagram = ({
  A, B, C,
  rightAngleAt,
  AB, BC, CA,
  extras = [],
  size = 260,
  vw = 260, vh = 220,
  title,
  fillColor = 'rgba(56,189,248,0.07)',
}: PythagorasDiagramProps) => {
  const pts = `${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`;
  const raVx = rightAngleAt === 'A' ? A : rightAngleAt === 'B' ? B : C;
  const raVa = rightAngleAt === 'A' ? B : rightAngleAt === 'B' ? A : A;
  const raVb = rightAngleAt === 'A' ? C : rightAngleAt === 'B' ? C : B;

  return (
    <div className="flex flex-col items-center">
      {title && <p className="text-white/50 text-[10px] text-center mb-1 font-body">{title}</p>}
      <svg width={size} height={Math.round(size * vh / vw)} viewBox={`0 0 ${vw} ${vh}`} className="rounded-xl overflow-hidden">
        <rect width={vw} height={vh} fill="rgba(2,8,23,0.95)" rx="12" />

        {extras.map((el, i) => {
          if (el.type === 'rect') return (
            <rect key={i} x={el.x} y={el.y} width={el.w} height={el.h}
              fill={el.fill || 'rgba(56,189,248,0.12)'} stroke={el.stroke || 'rgba(56,189,248,0.4)'} strokeWidth="1" />
          );
          if (el.type === 'line') {
            const mx = (el.x1 + el.x2) / 2 + (el.lx || 0);
            const my = (el.y1 + el.y2) / 2 + (el.ly || 0);
            return (
              <g key={i}>
                <line x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2}
                  stroke={el.color || '#60a5fa'} strokeWidth="1.5"
                  strokeDasharray={el.dashed ? '5,3' : undefined} />
                {el.label && <text x={mx} y={my} fill={el.color || '#60a5fa'} fontSize="11" fontWeight="bold" textAnchor="middle">{el.label}</text>}
              </g>
            );
          }
          if (el.type === 'text') return (
            <text key={i} x={el.x} y={el.y} fill={el.color || 'rgba(255,255,255,0.7)'}
              fontSize={el.size || 12} fontWeight={el.bold ? 'bold' : undefined}
              textAnchor={el.anchor || 'middle'} dominantBaseline="middle">{el.text}</text>
          );
          return null;
        })}

        <polygon points={pts} fill={fillColor} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={AB?.color || '#60a5fa'} strokeWidth="2.5" strokeLinecap="round" />
        <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={BC?.color || '#f472b6'} strokeWidth="2.5" strokeLinecap="round" />
        <line x1={C.x} y1={C.y} x2={A.x} y2={A.y} stroke={CA?.color || '#34d399'} strokeWidth="2.5" strokeLinecap="round" />

        {rightAngleAt && (
          <RAMark vx={raVx.x} vy={raVx.y} va={raVa} vb={raVb} sz={12} />
        )}

        {AB?.text && midLabel(A.x, A.y, B.x, B.y, AB.text, AB?.color || '#60a5fa', AB.dx || 0, AB.dy || -8)}
        {BC?.text && midLabel(B.x, B.y, C.x, C.y, BC.text, BC?.color || '#f472b6', BC.dx || 0, BC.dy || 10)}
        {CA?.text && midLabel(C.x, C.y, A.x, A.y, CA.text, CA?.color || '#34d399', CA.dx || -8, CA.dy || 0)}

        {[A, B, C].map((v, i) => (
          <g key={i}>
            <circle cx={v.x} cy={v.y} r={3.5} fill={v.color || '#facc15'} />
            {v.label && (
              <text x={v.x + (v.labelDx ?? 0)} y={v.y + (v.labelDy ?? -10)}
                fill={v.color || '#facc15'} fontSize="13" fontWeight="bold" textAnchor="middle">{v.label}</text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default PythagorasDiagram;
