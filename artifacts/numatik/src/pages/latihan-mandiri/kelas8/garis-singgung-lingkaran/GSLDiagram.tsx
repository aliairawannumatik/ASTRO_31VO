import { useTheme } from "@/contexts/ThemeContext";

type GSLVariant =
  | "tangent-basic"
  | "tangent-two"
  | "tangent-right-angle"
  | "tangent-external-point"
  | "gspl-two-circles"
  | "gspd-two-circles"
  | "belt-equal"
  | "belt-unequal"
  | "tangent-chord"
  | "tangent-angle";

type GSLDiagramProps = {
  variant: GSLVariant;
  size?: number;
  labels?: Record<string, string>;
  values?: Record<string, number>;
  color?: string;
  title?: string;
  tangentLabel?: string;
  beltLabel?: string;
};

const GSLDiagram = ({ variant, size = 240, labels = {}, values = {}, color = "#38bdf8", title, tangentLabel = "Garis Singgung", beltLabel = "Sabuk" }: GSLDiagramProps) => {
  const { isDark } = useTheme();
  const svgBg = isDark ? "rgba(2,8,23,0.95)" : "rgba(241,245,249,0.97)";
  const r = values.r ?? 65;
  const R = values.R ?? 80;
  const r2 = values.r2 ?? 40;

  const renderDiagram = () => {
    switch (variant) {
      case "tangent-basic": {
        const cx = size / 2 - 20;
        const cy = size / 2;
        const tx = cx + r;
        const py = cy - r * 1.5;
        const px = tx + 30;
        const tangentX = cx + r;
        const dy = Math.sqrt(Math.max(0, (px - cx) ** 2 - r ** 2));
        const sinA = r / Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
        const cosA = Math.sqrt(1 - sinA * sinA);
        const tpx = cx + r * cosA * cosA;
        const tpy = cy - r * cosA * sinA;
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <rect width={size} height={size} fill={svgBg} rx="12" />
            <circle cx={cx} cy={cy} r={r} fill="rgba(56,189,248,0.06)" stroke={color} strokeWidth="2" />
            <line x1={cx} y1={cy} x2={tangentX} y2={cy} stroke="#60a5fa" strokeWidth="1.8" />
            <line x1={tangentX} y1={cy - r * 1.6} x2={tangentX} y2={cy + r * 1.6} stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />
            <line x1={tangentX - 8} y1={cy - 8} x2={tangentX - 8} y2={cy} stroke="#f472b6" strokeWidth="1.5" />
            <line x1={tangentX - 8} y1={cy} x2={tangentX} y2={cy} stroke="#f472b6" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r={3.5} fill="#94a3b8" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={cx - 10} y={cy + 5} fill="#94a3b8" fontSize="13" fontWeight="bold">{labels.O ?? "O"}</text>
            <circle cx={tangentX} cy={cy} r={3.5} fill="#f472b6" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={tangentX + 7} y={cy + 5} fill="#f472b6" fontSize="12" fontWeight="bold">{labels.T ?? "T"}</text>
            <text x={(cx + tangentX) / 2} y={cy - 8} fill="#60a5fa" fontSize="11" fontWeight="bold">{labels.r ?? "r"}</text>
            <text x={tangentX + 10} y={cy - r * 0.8} fill="#f472b6" fontSize="11" fontWeight="bold">{tangentLabel}</text>
            <text x={tangentX + 5} y={cy - 20} fill="#facc15" fontSize="10">90°</text>
          </svg>
        );
      }

      case "tangent-two": {
        const cx = size / 2 - 25;
        const cy = size / 2;
        const pr = values.p ?? 130;
        const px = cx + pr;
        const py = cy;
        const sinA = r / pr;
        const cosA = Math.sqrt(1 - sinA * sinA);
        const tx1 = cx + r * cosA * cosA;
        const ty1 = cy - r * cosA * sinA;
        const tx2 = cx + r * cosA * cosA;
        const ty2 = cy + r * cosA * sinA;
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <rect width={size} height={size} fill={svgBg} rx="12" />
            <circle cx={cx} cy={cy} r={r} fill="rgba(56,189,248,0.06)" stroke={color} strokeWidth="2" />
            <line x1={px} y1={py} x2={tx1} y2={ty1} stroke="#34d399" strokeWidth="2" />
            <line x1={px} y1={py} x2={tx2} y2={ty2} stroke="#fb923c" strokeWidth="2" />
            <line x1={cx} y1={cy} x2={tx1} y2={ty1} stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4,3" />
            <line x1={cx} y1={cy} x2={tx2} y2={ty2} stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4,3" />
            <circle cx={cx} cy={cy} r={3.5} fill="#94a3b8" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={cx - 12} y={cy + 5} fill="#94a3b8" fontSize="12" fontWeight="bold">{labels.O ?? "O"}</text>
            <circle cx={px} cy={py} r={4} fill="#facc15" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={px + 7} y={py + 5} fill="#facc15" fontSize="12" fontWeight="bold">{labels.P ?? "P"}</text>
            <circle cx={tx1} cy={ty1} r={3.5} fill="#34d399" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={tx1 - 15} y={ty1 - 6} fill="#34d399" fontSize="12" fontWeight="bold">{labels.A ?? "A"}</text>
            <circle cx={tx2} cy={ty2} r={3.5} fill="#fb923c" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={tx2 - 15} y={ty2 + 14} fill="#fb923c" fontSize="12" fontWeight="bold">{labels.B ?? "B"}</text>
            <text x={(px + tx1) / 2 + 5} y={(py + ty1) / 2 - 6} fill="#34d399" fontSize="10" fontWeight="bold">{labels.PA ?? "PA"}</text>
            <text x={(px + tx2) / 2 + 5} y={(py + ty2) / 2 + 14} fill="#fb923c" fontSize="10" fontWeight="bold">{labels.PB ?? "PB"}</text>
          </svg>
        );
      }

      case "tangent-right-angle": {
        const cx = size / 2 - 20;
        const cy = size / 2;
        const px = cx + r + 60;
        const py = cy;
        const sinA = r / (px - cx);
        const cosA = Math.sqrt(1 - sinA * sinA);
        const tx = cx + r * cosA * cosA;
        const ty = cy - r * cosA * sinA;
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <rect width={size} height={size} fill={svgBg} rx="12" />
            <circle cx={cx} cy={cy} r={r} fill="rgba(56,189,248,0.06)" stroke={color} strokeWidth="2" />
            <line x1={px} y1={py} x2={tx} y2={ty} stroke="#34d399" strokeWidth="2" />
            <line x1={cx} y1={cy} x2={tx} y2={ty} stroke="#60a5fa" strokeWidth="1.8" />
            <line x1={cx} y1={cy} x2={px} y2={py} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,3" />
            <rect x={tx - 8} y={ty - 3} width="8" height="8" fill="none" stroke="#facc15" strokeWidth="1.5"
              transform={`rotate(${-Math.atan2(ty - cy, tx - cx) * 180 / Math.PI}, ${tx}, ${ty})`} />
            <circle cx={cx} cy={cy} r={3.5} fill="#94a3b8" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={cx - 13} y={cy + 5} fill="#94a3b8" fontSize="12" fontWeight="bold">{labels.O ?? "O"}</text>
            <circle cx={px} cy={py} r={4} fill="#facc15" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={px + 7} y={py + 5} fill="#facc15" fontSize="12" fontWeight="bold">{labels.P ?? "P"}</text>
            <circle cx={tx} cy={ty} r={3.5} fill="#34d399" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={tx - 14} y={ty - 8} fill="#34d399" fontSize="12" fontWeight="bold">{labels.T ?? "T"}</text>
            <text x={(cx + tx) / 2 - 14} y={(cy + ty) / 2 - 4} fill="#60a5fa" fontSize="10" fontWeight="bold">{labels.r ?? "r"}</text>
            <text x={(px + tx) / 2 + 4} y={(py + ty) / 2 - 6} fill="#34d399" fontSize="10" fontWeight="bold">{labels.PT ?? "PT"}</text>
            <text x={(cx + px) / 2} y={cy + 16} fill="#94a3b8" fontSize="10" fontWeight="bold">{labels.PO ?? "PO"}</text>
          </svg>
        );
      }

      case "tangent-external-point": {
        const cx = 70;
        const cy = size / 2;
        const px = size - 35;
        const py = size / 2;
        const pr = px - cx;
        const sinA = r / pr;
        const cosA = Math.sqrt(Math.max(0, 1 - sinA * sinA));
        const tx1 = cx + r * cosA * cosA;
        const ty1 = cy - r * cosA * sinA;
        const tx2 = cx + r * cosA * cosA;
        const ty2 = cy + r * cosA * sinA;
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <rect width={size} height={size} fill={svgBg} rx="12" />
            <circle cx={cx} cy={cy} r={r} fill="rgba(56,189,248,0.06)" stroke={color} strokeWidth="2" />
            <line x1={px} y1={py} x2={tx1} y2={ty1} stroke="#34d399" strokeWidth="2.2" />
            <line x1={px} y1={py} x2={tx2} y2={ty2} stroke="#34d399" strokeWidth="2.2" />
            <line x1={cx} y1={cy} x2={tx1} y2={ty1} stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4,3" />
            <line x1={cx} y1={cy} x2={tx2} y2={ty2} stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4,3" />
            <line x1={cx} y1={cy} x2={px} y2={py} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="5,3" />
            <circle cx={cx} cy={cy} r={3.5} fill="#94a3b8" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={cx + 6} y={cy + 5} fill="#94a3b8" fontSize="12" fontWeight="bold">{labels.O ?? "O"}</text>
            <circle cx={px} cy={py} r={4} fill="#facc15" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={px + 6} y={py + 5} fill="#facc15" fontSize="12" fontWeight="bold">{labels.P ?? "P"}</text>
            <circle cx={tx1} cy={ty1} r={3.5} fill="#34d399" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={tx1 - 6} y={ty1 - 8} fill="#34d399" fontSize="12" fontWeight="bold">{labels.A ?? "A"}</text>
            <circle cx={tx2} cy={ty2} r={3.5} fill="#34d399" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={tx2 - 6} y={ty2 + 16} fill="#34d399" fontSize="12" fontWeight="bold">{labels.B ?? "B"}</text>
            <text x={cx - 14} y={cy - r / 2} fill="#60a5fa" fontSize="10" fontWeight="bold">{labels.r ?? "r"}</text>
            <text x={(cx + px) / 2} y={cy - 8} fill="#94a3b8" fontSize="10" fontWeight="bold">{labels.d ?? "d"}</text>
          </svg>
        );
      }

      case "gspl-two-circles": {
        const cx1 = 60;
        const cy1 = size / 2;
        const cx2 = size - 60;
        const cy2 = size / 2;
        const rA = values.r1 ?? 55;
        const rB = values.r2 ?? 35;
        const d = cx2 - cx1;
        const rDiff = rA - rB;
        const lLen = Math.sqrt(Math.max(0, d * d - rDiff * rDiff));
        const sinA = rDiff / d;
        const cosA = Math.sqrt(Math.max(0, 1 - sinA * sinA));
        const ty1 = cy1 - rA * cosA;
        const tx1 = cx1 + rA * sinA;
        const ty2 = cy2 - rB * cosA;
        const tx2 = cx2 + rB * sinA;
        const ty3 = cy1 + rA * cosA;
        const tx3 = cx1 + rA * sinA;
        const ty4 = cy2 + rB * cosA;
        const tx4 = cx2 + rB * sinA;
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <rect width={size} height={size} fill={svgBg} rx="12" />
            <circle cx={cx1} cy={cy1} r={rA} fill="rgba(56,189,248,0.06)" stroke={color} strokeWidth="2" />
            <circle cx={cx2} cy={cy2} r={rB} fill="rgba(251,146,60,0.06)" stroke="#fb923c" strokeWidth="2" />
            <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke="#34d399" strokeWidth="2" />
            <line x1={tx3} y1={ty3} x2={tx4} y2={ty4} stroke="#34d399" strokeWidth="2" />
            <line x1={cx1} y1={cy1} x2={cx2} y2={cy2} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3" />
            <circle cx={cx1} cy={cy1} r={3.5} fill="#94a3b8" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={cx1 - 8} y={cy1 + 18} fill="#94a3b8" fontSize="12" fontWeight="bold">{labels.O1 ?? "O₁"}</text>
            <circle cx={cx2} cy={cy2} r={3.5} fill="#94a3b8" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={cx2 - 4} y={cy2 + 18} fill="#94a3b8" fontSize="12" fontWeight="bold">{labels.O2 ?? "O₂"}</text>
            <text x={(cx1 + cx2) / 2} y={cy1 + 14} fill="#94a3b8" fontSize="10" fontWeight="bold">{labels.d ?? "d"}</text>
            <text x={cx1 - 20} y={cy1 - rA / 2} fill={color} fontSize="10" fontWeight="bold">{labels.R ?? "R"}</text>
            <text x={cx2 + 8} y={cy2 - rB / 2} fill="#fb923c" fontSize="10" fontWeight="bold">{labels.r ?? "r"}</text>
            <text x={(tx1 + tx2) / 2 - 20} y={(ty1 + ty2) / 2 - 8} fill="#34d399" fontSize="10" fontWeight="bold">{labels.GSPL ?? "GSPL"}</text>
          </svg>
        );
      }

      case "gspd-two-circles": {
        const cx1 = 55;
        const cy1 = size / 2;
        const cx2 = size - 55;
        const cy2 = size / 2;
        const rA = values.r1 ?? 50;
        const rB = values.r2 ?? 35;
        const d = cx2 - cx1;
        const rSum = rA + rB;
        const cosA = rSum / d;
        const sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
        const tx1 = cx1 + rA * cosA;
        const ty1 = cy1 - rA * sinA;
        const tx2 = cx2 - rB * cosA;
        const ty2 = cy2 + rB * sinA;
        const tx3 = cx1 + rA * cosA;
        const ty3 = cy1 + rA * sinA;
        const tx4 = cx2 - rB * cosA;
        const ty4 = cy2 - rB * sinA;
        const crossX = cx1 + d * rA / rSum;
        const crossY = cy1;
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <rect width={size} height={size} fill={svgBg} rx="12" />
            <circle cx={cx1} cy={cy1} r={rA} fill="rgba(167,139,250,0.06)" stroke="#a78bfa" strokeWidth="2" />
            <circle cx={cx2} cy={cy2} r={rB} fill="rgba(251,146,60,0.06)" stroke="#fb923c" strokeWidth="2" />
            <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke="#f472b6" strokeWidth="2" />
            <line x1={tx3} y1={ty3} x2={tx4} y2={ty4} stroke="#f472b6" strokeWidth="2" />
            <circle cx={crossX} cy={crossY} r={3.5} fill="#facc15" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={crossX + 5} y={crossY - 6} fill="#facc15" fontSize="10" fontWeight="bold">{labels.X ?? "X"}</text>
            <line x1={cx1} y1={cy1} x2={cx2} y2={cy2} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3" />
            <circle cx={cx1} cy={cy1} r={3.5} fill="#94a3b8" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={cx1 - 10} y={cy1 + 18} fill="#94a3b8" fontSize="12" fontWeight="bold">{labels.O1 ?? "O₁"}</text>
            <circle cx={cx2} cy={cy2} r={3.5} fill="#94a3b8" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={cx2 - 6} y={cy2 + 18} fill="#94a3b8" fontSize="12" fontWeight="bold">{labels.O2 ?? "O₂"}</text>
            <text x={(cx1 + cx2) / 2} y={cy1 + 14} fill="#94a3b8" fontSize="10" fontWeight="bold">{labels.d ?? "d"}</text>
            <text x={cx1 - 22} y={cy1 - rA / 2} fill="#a78bfa" fontSize="10" fontWeight="bold">{labels.R ?? "R"}</text>
            <text x={cx2 + 8} y={cy2 - rB / 2} fill="#fb923c" fontSize="10" fontWeight="bold">{labels.r ?? "r"}</text>
            <text x={(tx1 + tx2) / 2} y={(ty1 + ty2) / 2 - 8} fill="#f472b6" fontSize="10" fontWeight="bold">{labels.GSPD ?? "GSPD"}</text>
          </svg>
        );
      }

      case "belt-equal": {
        const cx1 = 65;
        const cy = size / 2;
        const cx2 = size - 65;
        const rr = values.r ?? 45;
        const d = cx2 - cx1;
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <rect width={size} height={size} fill={svgBg} rx="12" />
            <path d={`M ${cx1} ${cy - rr} L ${cx2} ${cy - rr}`} stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
            <path d={`M ${cx1} ${cy + rr} L ${cx2} ${cy + rr}`} stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
            <path d={`M ${cx1} ${cy - rr} A ${rr} ${rr} 0 0 0 ${cx1} ${cy + rr}`} stroke="#facc15" strokeWidth="2.5" fill="none" />
            <path d={`M ${cx2} ${cy - rr} A ${rr} ${rr} 0 0 1 ${cx2} ${cy + rr}`} stroke="#facc15" strokeWidth="2.5" fill="none" />
            <circle cx={cx1} cy={cy} r={rr} fill="rgba(56,189,248,0.06)" stroke={color} strokeWidth="2" />
            <circle cx={cx2} cy={cy} r={rr} fill="rgba(56,189,248,0.06)" stroke={color} strokeWidth="2" />
            <line x1={cx1} y1={cy} x2={cx2} y2={cy} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3" />
            <circle cx={cx1} cy={cy} r={3.5} fill="#94a3b8" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={cx1 - 8} y={cy + 18} fill="#94a3b8" fontSize="12" fontWeight="bold">{labels.O1 ?? "O₁"}</text>
            <circle cx={cx2} cy={cy} r={3.5} fill="#94a3b8" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={cx2 - 6} y={cy + 18} fill="#94a3b8" fontSize="12" fontWeight="bold">{labels.O2 ?? "O₂"}</text>
            <text x={(cx1 + cx2) / 2} y={cy + 14} fill="#94a3b8" fontSize="10" fontWeight="bold">{labels.d ?? "d"}</text>
            <text x={cx1 + 5} y={cy - rr / 2} fill={color} fontSize="10" fontWeight="bold">{labels.r ?? "r"}</text>
            <text x={cx1 + 6} y={cy - rr - 8} fill="#facc15" fontSize="10" fontWeight="bold">{beltLabel}</text>
          </svg>
        );
      }

      case "belt-unequal": {
        const cx1 = 60;
        const cy = size / 2;
        const cx2 = size - 55;
        const rA = values.r1 ?? 50;
        const rB = values.r2 ?? 30;
        const d = cx2 - cx1;
        const rDiff = rA - rB;
        const sinA = rDiff / d;
        const cosA = Math.sqrt(Math.max(0, 1 - sinA * sinA));
        const ty1 = cy - rA * cosA;
        const tx1 = cx1 + rA * sinA;
        const ty2 = cy - rB * cosA;
        const tx2 = cx2 + rB * sinA;
        const ty3 = cy + rA * cosA;
        const tx3 = cx1 + rA * sinA;
        const ty4 = cy + rB * cosA;
        const tx4 = cx2 + rB * sinA;
        const halfAngle1 = Math.acos(cosA) * 180 / Math.PI;
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <rect width={size} height={size} fill={svgBg} rx="12" />
            <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke="#facc15" strokeWidth="2.5" />
            <line x1={tx3} y1={ty3} x2={tx4} y2={ty4} stroke="#facc15" strokeWidth="2.5" />
            <path d={`M ${tx1} ${ty1} A ${rA} ${rA} 0 0 0 ${tx3} ${ty3}`} stroke="#facc15" strokeWidth="2.5" fill="none" />
            <path d={`M ${tx2} ${ty2} A ${rB} ${rB} 0 0 1 ${tx4} ${ty4}`} stroke="#facc15" strokeWidth="2.5" fill="none" />
            <circle cx={cx1} cy={cy} r={rA} fill="rgba(56,189,248,0.06)" stroke={color} strokeWidth="2" />
            <circle cx={cx2} cy={cy} r={rB} fill="rgba(251,146,60,0.06)" stroke="#fb923c" strokeWidth="2" />
            <line x1={cx1} y1={cy} x2={cx2} y2={cy} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3" />
            <circle cx={cx1} cy={cy} r={3.5} fill="#94a3b8" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={cx1 - 10} y={cy + 18} fill="#94a3b8" fontSize="12" fontWeight="bold">{labels.O1 ?? "O₁"}</text>
            <circle cx={cx2} cy={cy} r={3.5} fill="#94a3b8" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={cx2 - 6} y={cy + 18} fill="#94a3b8" fontSize="12" fontWeight="bold">{labels.O2 ?? "O₂"}</text>
            <text x={(cx1 + cx2) / 2} y={cy + 14} fill="#94a3b8" fontSize="10" fontWeight="bold">{labels.d ?? "d"}</text>
            <text x={cx1 - 22} y={cy - rA / 2} fill={color} fontSize="10" fontWeight="bold">{labels.R ?? "R"}</text>
            <text x={cx2 + 6} y={cy - rB / 2} fill="#fb923c" fontSize="10" fontWeight="bold">{labels.r ?? "r"}</text>
          </svg>
        );
      }

      case "tangent-chord": {
        const cx = size / 2;
        const cy = size / 2;
        const rr = values.r ?? 75;
        const tAngle = 0;
        const tx = cx + rr;
        const chord1 = -50;
        const chord2 = 60;
        const c1x = cx + rr * Math.cos(chord1 * Math.PI / 180);
        const c1y = cy - rr * Math.sin(chord1 * Math.PI / 180);
        const c2x = cx + rr * Math.cos(chord2 * Math.PI / 180);
        const c2y = cy - rr * Math.sin(chord2 * Math.PI / 180);
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <rect width={size} height={size} fill={svgBg} rx="12" />
            <circle cx={cx} cy={cy} r={rr} fill="rgba(56,189,248,0.06)" stroke={color} strokeWidth="2" />
            <line x1={tx} y1={cy - rr * 1.3} x2={tx} y2={cy + rr * 1.3} stroke="#f472b6" strokeWidth="2.5" />
            <line x1={c1x} y1={c1y} x2={tx} y2={cy} stroke="#34d399" strokeWidth="2" />
            <line x1={c2x} y1={c2y} x2={tx} y2={cy} stroke="#fb923c" strokeWidth="2" />
            <circle cx={cx} cy={cy} r={3.5} fill="#94a3b8" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={cx - 12} y={cy + 5} fill="#94a3b8" fontSize="12" fontWeight="bold">O</text>
            <circle cx={tx} cy={cy} r={4} fill="#facc15" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={tx + 7} y={cy + 5} fill="#facc15" fontSize="12" fontWeight="bold">P</text>
            <circle cx={c1x} cy={c1y} r={3.5} fill="#34d399" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={c1x + 7} y={c1y + 14} fill="#34d399" fontSize="12" fontWeight="bold">A</text>
            <circle cx={c2x} cy={c2y} r={3.5} fill="#fb923c" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={c2x + 7} y={c2y - 5} fill="#fb923c" fontSize="12" fontWeight="bold">B</text>
          </svg>
        );
      }

      case "tangent-angle": {
        const cx = size / 2 - 10;
        const cy = size / 2;
        const rr = values.r ?? 70;
        const px = cx + rr + 70;
        const py = cy;
        const pr = px - cx;
        const sinA = rr / pr;
        const cosA = Math.sqrt(1 - sinA * sinA);
        const tx = cx + rr * cosA * cosA;
        const ty = cy - rr * cosA * sinA;
        const alphaDeg = Math.asin(sinA) * 180 / Math.PI;
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <rect width={size} height={size} fill={svgBg} rx="12" />
            <circle cx={cx} cy={cy} r={rr} fill="rgba(56,189,248,0.06)" stroke={color} strokeWidth="2" />
            <line x1={px} y1={py} x2={tx} y2={ty} stroke="#34d399" strokeWidth="2" />
            <line x1={cx} y1={cy} x2={tx} y2={ty} stroke="#60a5fa" strokeWidth="1.8" strokeDasharray="4,3" />
            <line x1={cx} y1={cy} x2={px} y2={py} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="5,3" />
            <path d={`M ${px - 28} ${py} A 28 28 0 0 0 ${px - 28 * cosA} ${py - 28 * sinA}`}
              fill="none" stroke="#facc15" strokeWidth="1.8" />
            <circle cx={cx} cy={cy} r={3.5} fill="#94a3b8" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={cx - 12} y={cy + 5} fill="#94a3b8" fontSize="12" fontWeight="bold">O</text>
            <circle cx={px} cy={py} r={4} fill="#facc15" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={px + 6} y={py + 5} fill="#facc15" fontSize="12" fontWeight="bold">P</text>
            <circle cx={tx} cy={ty} r={3.5} fill="#34d399" stroke="var(--icon-stroke)" strokeWidth="1" />
            <text x={tx - 14} y={ty - 7} fill="#34d399" fontSize="12" fontWeight="bold">T</text>
            <text x={px - 40} y={py - 16} fill="#facc15" fontSize="11" fontWeight="bold">α</text>
          </svg>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center">
      {title && <p className={`${isDark ? "text-white/50" : "text-gray-500"} text-[10px] text-center mb-1 font-body`}>{title}</p>}
      <div className="rounded-xl overflow-hidden">{renderDiagram()}</div>
    </div>
  );
};

export default GSLDiagram;
