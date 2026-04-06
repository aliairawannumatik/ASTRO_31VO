type ArrowDiagramProps = {
  setA: (string | number)[];
  setB: (string | number)[];
  arrows: [number, number][];
  labelA?: string;
  labelB?: string;
  title?: string;
  colorA?: string;
  colorB?: string;
  arrowColor?: string;
  size?: "sm" | "md" | "lg";
  questionMarks?: boolean;
};

const ArrowDiagram = ({
  setA,
  setB,
  arrows,
  labelA = "A",
  labelB = "B",
  title,
  colorA = "#38bdf8",
  colorB = "#a78bfa",
  arrowColor = "#f472b6",
  size = "md",
  questionMarks = false,
}: ArrowDiagramProps) => {
  const W = size === "sm" ? 260 : size === "lg" ? 380 : 320;
  const leftX = size === "sm" ? 55 : size === "lg" ? 75 : 65;
  const rightX = W - leftX;
  const ovalW = size === "sm" ? 40 : size === "lg" ? 56 : 48;
  const rowH = size === "sm" ? 28 : size === "lg" ? 36 : 32;
  const maxRows = Math.max(setA.length, setB.length);
  const topPad = 52;
  const H = topPad + maxRows * rowH + 30;
  const ovalH = maxRows * rowH + 20;
  const ovalTop = topPad - 10;

  const ayOf = (i: number) => topPad + i * rowH + rowH / 2;
  const byOf = (i: number) => topPad + i * rowH + rowH / 2;

  return (
    <div className="flex flex-col items-center my-2">
      {title && <p className="text-white/50 text-[10px] text-center mb-1 font-body">{title}</p>}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect width={W} height={H} fill="rgba(2,8,23,0.85)" rx="14" />

        <ellipse cx={leftX} cy={ovalTop + ovalH / 2} rx={ovalW} ry={ovalH / 2}
          fill={`${colorA}18`} stroke={colorA} strokeWidth="1.5" strokeOpacity="0.7" />
        <ellipse cx={rightX} cy={ovalTop + ovalH / 2} rx={ovalW} ry={ovalH / 2}
          fill={`${colorB}18`} stroke={colorB} strokeWidth="1.5" strokeOpacity="0.7" />

        <text x={leftX} y={ovalTop - 8} fill={colorA} fontSize="12" fontWeight="bold" textAnchor="middle" opacity="0.9">{labelA}</text>
        <text x={rightX} y={ovalTop - 8} fill={colorB} fontSize="12" fontWeight="bold" textAnchor="middle" opacity="0.9">{labelB}</text>

        {setA.map((el, i) => (
          <text key={i} x={leftX} y={ayOf(i) + 4} fill="rgba(255,255,255,0.85)" fontSize="12"
            fontWeight="bold" textAnchor="middle">{el}</text>
        ))}
        {setB.map((el, i) => (
          <text key={i} x={rightX} y={byOf(i) + 4} fill="rgba(255,255,255,0.85)" fontSize="12"
            fontWeight="bold" textAnchor="middle">
            {questionMarks && el === "?" ? "?" : el}
          </text>
        ))}

        <defs>
          <marker id={`arr-${colorA.replace('#','')}`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill={arrowColor} opacity="0.85" />
          </marker>
        </defs>
        {arrows.map(([ai, bi], idx) => {
          const x1 = leftX + ovalW - 4;
          const y1 = ayOf(ai);
          const x2 = rightX - ovalW + 4;
          const y2 = byOf(bi);
          return (
            <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={arrowColor} strokeWidth="1.6" opacity="0.85"
              markerEnd={`url(#arr-${colorA.replace('#','')})`} />
          );
        })}
      </svg>
    </div>
  );
};

export default ArrowDiagram;
