type SimilarTrianglesProps = {
  label1?: string; label2?: string;
  sideLabels1?: [string, string, string];
  sideLabels2?: [string, string, string];
  vertices1?: [string, string, string];
  vertices2?: [string, string, string];
  color1?: string; color2?: string;
  type?: "scalene" | "right" | "isosceles";
  tickmarks?: boolean;
};

export const SimilarTriangles = ({
  label1 = "△ABC", label2 = "△DEF",
  sideLabels1 = ["3", "4", "5"], sideLabels2 = ["6", "8", "10"],
  vertices1 = ["A", "B", "C"], vertices2 = ["D", "E", "F"],
  color1 = "#38bdf8", color2 = "#a78bfa",
  type = "scalene", tickmarks = false,
}: SimilarTrianglesProps) => {
  const pts1 = type === "right"
    ? [[20, 110], [80, 110], [20, 50]] as [number, number][]
    : type === "isosceles"
    ? [[50, 45], [10, 110], [90, 110]] as [number, number][]
    : [[15, 110], [85, 110], [30, 50]] as [number, number][];
  const pts2 = type === "right"
    ? [[130, 120], [220, 120], [130, 50]] as [number, number][]
    : type === "isosceles"
    ? [[175, 40], [125, 120], [225, 120]] as [number, number][]
    : [[125, 120], [215, 120], [145, 50]] as [number, number][];
  const mid = (a: [number, number], b: [number, number]): [number, number] => [(a[0]+b[0])/2, (a[1]+b[1])/2];
  const toPath = (pts: [number, number][]) => pts.map((p,i) => `${i===0?'M':'L'}${p[0]},${p[1]}`).join(' ')+'Z';
  return (
    <svg width={260} height={155} viewBox="0 0 260 155" className="lm-kkg-svg" style={{display:'block'}}>
      <rect width="260" height="155" fill="rgba(2,8,23,0.85)" rx="12"/>
      <path d={toPath(pts1)} fill={`${color1}18`} stroke={color1} strokeWidth="1.8"/>
      <path d={toPath(pts2)} fill={`${color2}18`} stroke={color2} strokeWidth="1.8"/>
      {pts1.map((p,i) => <text key={i} x={p[0]+(i===0?-10:i===1?4:0)} y={p[1]+(i===2?-4:12)} fill={color1} fontSize="11" fontWeight="bold" textAnchor="middle">{vertices1[i]}</text>)}
      {pts2.map((p,i) => <text key={i} x={p[0]+(i===0?-10:i===1?4:0)} y={p[1]+(i===2?-4:12)} fill={color2} fontSize="11" fontWeight="bold" textAnchor="middle">{vertices2[i]}</text>)}
      {sideLabels1[0] && <text x={mid(pts1[0],pts1[1])[0]} y={mid(pts1[0],pts1[1])[1]+14} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{sideLabels1[0]}</text>}
      {sideLabels1[1] && <text x={mid(pts1[1],pts1[2])[0]+10} y={mid(pts1[1],pts1[2])[1]} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{sideLabels1[1]}</text>}
      {sideLabels1[2] && <text x={mid(pts1[0],pts1[2])[0]-10} y={mid(pts1[0],pts1[2])[1]} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{sideLabels1[2]}</text>}
      {sideLabels2[0] && <text x={mid(pts2[0],pts2[1])[0]} y={mid(pts2[0],pts2[1])[1]+14} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{sideLabels2[0]}</text>}
      {sideLabels2[1] && <text x={mid(pts2[1],pts2[2])[0]+10} y={mid(pts2[1],pts2[2])[1]} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{sideLabels2[1]}</text>}
      {sideLabels2[2] && <text x={mid(pts2[0],pts2[2])[0]-10} y={mid(pts2[0],pts2[2])[1]} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{sideLabels2[2]}</text>}
      <text x={50} y={14} fill={color1} fontSize="10" fontWeight="bold" textAnchor="middle">{label1}</text>
      <text x={175} y={14} fill={color2} fontSize="10" fontWeight="bold" textAnchor="middle">{label2}</text>
    </svg>
  );
};

type SimilarRectsProps = {
  w1?: number; h1?: number; w2?: number; h2?: number;
  label1?: string; label2?: string;
  sides1?: [string, string, string, string];
  sides2?: [string, string, string, string];
  color1?: string; color2?: string;
};

export const SimilarRects = ({
  w1=70, h1=45, w2=105, h2=68,
  label1="ABCD", label2="EFGH",
  sides1=["6 cm","4 cm","6 cm","4 cm"],
  sides2=["9 cm","6 cm","9 cm","6 cm"],
  color1="#38bdf8", color2="#f472b6",
}: SimilarRectsProps) => {
  const x1=15, y1=30, x2=x1+w1+45, y2=30;
  return (
    <svg width={x2+w2+20} height={Math.max(h1,h2)+60} viewBox={`0 0 ${x2+w2+20} ${Math.max(h1,h2)+60}`} className="lm-kkg-svg" style={{display:'block'}}>
      <rect width={x2+w2+20} height={Math.max(h1,h2)+60} fill="rgba(2,8,23,0.85)" rx="12"/>
      <rect x={x1} y={y1} width={w1} height={h1} fill={`${color1}18`} stroke={color1} strokeWidth="1.8" rx="2"/>
      <rect x={x2} y={y2} width={w2} height={h2} fill={`${color2}18`} stroke={color2} strokeWidth="1.8" rx="2"/>
      <text x={x1-5} y={y1-5} fill={color1} fontSize="9" fontWeight="bold">A</text>
      <text x={x1+w1+2} y={y1-5} fill={color1} fontSize="9" fontWeight="bold">B</text>
      <text x={x1+w1+2} y={y1+h1+12} fill={color1} fontSize="9" fontWeight="bold">C</text>
      <text x={x1-5} y={y1+h1+12} fill={color1} fontSize="9" fontWeight="bold">D</text>
      <text x={x2-5} y={y2-5} fill={color2} fontSize="9" fontWeight="bold">E</text>
      <text x={x2+w2+2} y={y2-5} fill={color2} fontSize="9" fontWeight="bold">F</text>
      <text x={x2+w2+2} y={y2+h2+12} fill={color2} fontSize="9" fontWeight="bold">G</text>
      <text x={x2-5} y={y2+h2+12} fill={color2} fontSize="9" fontWeight="bold">H</text>
      <text x={x1+w1/2} y={y1-8} fill="rgba(255,255,255,0.8)" fontSize="10" textAnchor="middle">{sides1[0]}</text>
      <text x={x1+w1+5} y={y1+h1/2} fill="rgba(255,255,255,0.8)" fontSize="10" textAnchor="start">{sides1[1]}</text>
      <text x={x2+w2/2} y={y2-8} fill="rgba(255,255,255,0.8)" fontSize="10" textAnchor="middle">{sides2[0]}</text>
      <text x={x2+w2+5} y={y2+h2/2} fill="rgba(255,255,255,0.8)" fontSize="10" textAnchor="start">{sides2[1]}</text>
      <text x={x1+w1/2} y={y1+h1+20} fill={color1} fontSize="9" fontWeight="bold" textAnchor="middle">{label1}</text>
      <text x={x2+w2/2} y={y2+h2+20} fill={color2} fontSize="9" fontWeight="bold" textAnchor="middle">{label2}</text>
    </svg>
  );
};

type TriangleAltitudeProps = {
  color1?: string; color2?: string; color3?: string;
  labelTop?: string; labelBotL?: string; labelBotR?: string; labelMid?: string;
  sideA?: string; sideB?: string; sideC?: string; sideD?: string;
  altLabel?: string;
  rightAngleAtTop?: boolean;
};

export const TriangleAltitude = ({
  color1="#38bdf8", color2="#f472b6", color3="#34d399",
  labelTop="A", labelBotL="B", labelBotR="C", labelMid="D",
  sideA="?", sideB="3", sideC="4", sideD="12",
  altLabel="AD",
  rightAngleAtTop=false,
}: TriangleAltitudeProps) => (
  <svg width={240} height={150} viewBox="0 0 240 150" className="lm-kkg-svg" style={{display:'block'}}>
    <rect width="240" height="150" fill="rgba(2,8,23,0.85)" rx="12"/>
    <line x1={30} y1={130} x2={210} y2={130} stroke={color1} strokeWidth="1.8"/>
    <line x1={30} y1={130} x2={120} y2={20} stroke={color2} strokeWidth="1.8"/>
    <line x1={210} y1={130} x2={120} y2={20} stroke={color2} strokeWidth="1.8"/>
    <line x1={120} y1={20} x2={120} y2={130} stroke={color3} strokeWidth="1.5" strokeDasharray="4,3"/>
    <rect x={112} y={122} width={8} height={8} fill="none" stroke={color3} strokeWidth="1.2"/>
    {rightAngleAtTop && <polyline points="116,25 120,31 124,25" fill="none" stroke={color2} strokeWidth="1.5"/>}
    <text x={120} y={14} fill={color1} fontSize="11" fontWeight="bold" textAnchor="middle">{labelTop}</text>
    <text x={22} y={140} fill={color1} fontSize="11" fontWeight="bold" textAnchor="middle">{labelBotL}</text>
    <text x={218} y={140} fill={color1} fontSize="11" fontWeight="bold" textAnchor="middle">{labelBotR}</text>
    <text x={120} y={140} fill={color3} fontSize="10" fontWeight="bold" textAnchor="middle">{labelMid}</text>
    <text x={75} y={145} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{sideB}</text>
    <text x={165} y={145} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{sideC}</text>
    <text x={130} y={78} fill={color3} fontSize="10" textAnchor="start">{altLabel}</text>
    <text x={65} y={80} fill={color2} fontSize="10" textAnchor="middle">{sideA}</text>
    <text x={175} y={80} fill={color2} fontSize="10" textAnchor="middle">{sideD}</text>
  </svg>
);

type CongruentTrianglesProps = {
  label1?: string; label2?: string;
  vertices1?: [string, string, string];
  vertices2?: [string, string, string];
  sides1?: [string, string, string];
  sides2?: [string, string, string];
  color1?: string; color2?: string;
  shape?: "scalene" | "right" | "isosceles";
  ticks?: boolean;
};

export const CongruentTriangles = ({
  label1="△ABC", label2="△DEF",
  vertices1=["A","B","C"], vertices2=["D","E","F"],
  sides1=["5 cm","4 cm","3 cm"], sides2=["5 cm","4 cm","3 cm"],
  color1="#34d399", color2="#fb923c",
  shape="scalene", ticks=true,
}: CongruentTrianglesProps) => {
  const p1: [number, number][] = shape==="right"
    ? [[20,110],[85,110],[20,45]]
    : shape==="isosceles"
    ? [[52,40],[12,110],[92,110]]
    : [[15,112],[88,112],[32,45]];
  const p2: [number, number][] = shape==="right"
    ? [[130,110],[195,110],[130,45]]
    : shape==="isosceles"
    ? [[172,40],[132,110],[212,110]]
    : [[132,112],[208,112],[150,45]];
  const toPath = (pts: [number,number][]) => pts.map((p,i)=>`${i===0?'M':'L'}${p[0]},${p[1]}`).join(' ')+'Z';
  const mid = (a:[number,number], b:[number,number]): [number,number] => [(a[0]+b[0])/2,(a[1]+b[1])/2];
  const tickOn = (a:[number,number], b:[number,number], n=1, c="#fff") => {
    const mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2;
    const dx=b[0]-a[0], dy=b[1]-a[1], len=Math.sqrt(dx*dx+dy*dy);
    const nx=-dy/len*5, ny=dx/len*5;
    return Array.from({length:n},(_,k)=>{
      const off=(k-(n-1)/2)*4;
      const tx=nx*off/5, ty=ny*off/5;
      return <line key={k} x1={mx+nx+tx} y1={my+ny+ty} x2={mx-nx+tx} y2={my-ny+ty} stroke={c} strokeWidth="1.5"/>;
    });
  };
  return (
    <svg width={240} height={140} viewBox="0 0 240 140" className="lm-kkg-svg" style={{display:'block'}}>
      <rect width="240" height="140" fill="rgba(2,8,23,0.85)" rx="12"/>
      <path d={toPath(p1)} fill={`${color1}18`} stroke={color1} strokeWidth="1.8"/>
      <path d={toPath(p2)} fill={`${color2}18`} stroke={color2} strokeWidth="1.8"/>
      {p1.map((p,i)=><text key={i} x={p[0]+(i===0?-8:i===1?6:2)} y={p[1]+(i===2?-5:12)} fill={color1} fontSize="11" fontWeight="bold" textAnchor="middle">{vertices1[i]}</text>)}
      {p2.map((p,i)=><text key={i} x={p[0]+(i===0?-8:i===1?6:2)} y={p[1]+(i===2?-5:12)} fill={color2} fontSize="11" fontWeight="bold" textAnchor="middle">{vertices2[i]}</text>)}
      {ticks && tickOn(p1[0],p1[1],1,color1)}
      {ticks && tickOn(p2[0],p2[1],1,color2)}
      <text x={mid(p1[0],p1[1])[0]} y={mid(p1[0],p1[1])[1]+13} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{sides1[0]}</text>
      <text x={mid(p1[1],p1[2])[0]+9} y={mid(p1[1],p1[2])[1]} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{sides1[1]}</text>
      <text x={mid(p2[0],p2[1])[0]} y={mid(p2[0],p2[1])[1]+13} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{sides2[0]}</text>
      <text x={mid(p2[1],p2[2])[0]+9} y={mid(p2[1],p2[2])[1]} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{sides2[1]}</text>
      <text x={52} y={13} fill={color1} fontSize="10" fontWeight="bold" textAnchor="middle">{label1}</text>
      <text x={172} y={13} fill={color2} fontSize="10" fontWeight="bold" textAnchor="middle">{label2}</text>
    </svg>
  );
};

type ParallelLinesTriangleProps = {
  topLabel?: string; botLabel?: string;
  leftA?: string; leftB?: string; rightA?: string; rightB?: string;
  topSide?: string; botSide?: string;
  color1?: string; color2?: string;
};

export const ParallelLinesTriangle = ({
  topLabel="DE", botLabel="BC",
  leftA="AD=?", leftB="DB=6",
  rightA="AE=4", rightB="EC=8",
  topSide="DE=5", botSide="BC=15",
  color1="#38bdf8", color2="#f472b6",
}: ParallelLinesTriangleProps) => (
  <svg width={240} height={160} viewBox="0 0 240 160" className="lm-kkg-svg" style={{display:'block'}}>
    <rect width="240" height="160" fill="rgba(2,8,23,0.85)" rx="12"/>
    <line x1={120} y1={15} x2={20} y2={145} stroke={color1} strokeWidth="1.8"/>
    <line x1={120} y1={15} x2={220} y2={145} stroke={color1} strokeWidth="1.8"/>
    <line x1={20} y1={145} x2={220} y2={145} stroke={color1} strokeWidth="2"/>
    <line x1={65} y1={80} x2={175} y2={80} stroke={color2} strokeWidth="1.8" strokeDasharray="5,2"/>
    <text x={120} y={10} fill={color1} fontSize="11" fontWeight="bold" textAnchor="middle">A</text>
    <text x={14} y={153} fill={color1} fontSize="11" fontWeight="bold" textAnchor="middle">B</text>
    <text x={226} y={153} fill={color1} fontSize="11" fontWeight="bold" textAnchor="middle">C</text>
    <text x={62} y={75} fill={color2} fontSize="11" fontWeight="bold" textAnchor="middle">D</text>
    <text x={178} y={75} fill={color2} fontSize="11" fontWeight="bold" textAnchor="middle">E</text>
    <text x={35} y={50} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{leftA}</text>
    <text x={30} y={118} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{leftB}</text>
    <text x={205} y={50} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{rightA}</text>
    <text x={205} y={118} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{rightB}</text>
    <text x={120} y={73} fill={color2} fontSize="10" fontWeight="bold" textAnchor="middle">{topSide}</text>
    <text x={120} y={158} fill={color1} fontSize="10" fontWeight="bold" textAnchor="middle">{botSide}</text>
  </svg>
);

type RightTriangleRatioProps = {
  a?: string; b?: string; c?: string; h?: string; p?: string; q?: string;
  labelA?: string; labelB?: string; labelC?: string; labelH?: string;
  color1?: string; color2?: string; color3?: string;
};

export const RightTriangleRatio = ({
  a="?", b="6", c="10", h="h", p="BD=?", q="DC=8",
  labelA="A", labelB="B", labelC="C", labelH="D",
  color1="#f472b6", color2="#38bdf8", color3="#34d399",
}: RightTriangleRatioProps) => (
  <svg width={240} height={155} viewBox="0 0 240 155" className="lm-kkg-svg" style={{display:'block'}}>
    <rect width="240" height="155" fill="rgba(2,8,23,0.85)" rx="12"/>
    <line x1={20} y1={130} x2={220} y2={130} stroke={color1} strokeWidth="2"/>
    <line x1={20} y1={130} x2={120} y2={20} stroke={color2} strokeWidth="1.8"/>
    <line x1={220} y1={130} x2={120} y2={20} stroke={color2} strokeWidth="1.8"/>
    <line x1={120} y1={20} x2={120} y2={130} stroke={color3} strokeWidth="1.5" strokeDasharray="4,3"/>
    <rect x={112} y={122} width={8} height={8} fill="none" stroke={color3} strokeWidth="1.2"/>
    <rect x={12} y={122} width={8} height={8} fill="none" stroke={color1} strokeWidth="1.2"/>
    <text x={120} y={14} fill="rgba(255,255,255,0.9)" fontSize="11" fontWeight="bold" textAnchor="middle">{labelA}</text>
    <text x={12} y={148} fill="rgba(255,255,255,0.9)" fontSize="11" fontWeight="bold" textAnchor="middle">{labelB}</text>
    <text x={228} y={148} fill="rgba(255,255,255,0.9)" fontSize="11" fontWeight="bold" textAnchor="middle">{labelC}</text>
    <text x={120} y={148} fill={color3} fontSize="10" fontWeight="bold" textAnchor="middle">{labelH}</text>
    <text x={70} y={85} fill={color2} fontSize="10" textAnchor="middle">{a}</text>
    <text x={170} y={85} fill={color2} fontSize="10" textAnchor="middle">{c}</text>
    <text x={130} y={78} fill={color3} fontSize="10" textAnchor="start">{h}</text>
    <text x={70} y={144} fill={color1} fontSize="10" textAnchor="middle">{p}</text>
    <text x={168} y={144} fill={color1} fontSize="10" textAnchor="middle">{q}</text>
    <text x={120} y={144} fill="none" fontSize="1">·</text>
  </svg>
);

type TwoShapesCongruentProps = {
  shape?: "rect" | "triangle" | "parallelogram";
  color1?: string; color2?: string;
  sides1?: string[]; sides2?: string[];
  label1?: string; label2?: string;
  angles1?: string[]; angles2?: string[];
};

export const TwoShapesCongruent = ({
  shape="rect", color1="#34d399", color2="#fb923c",
  sides1=["8 cm","5 cm"], sides2=["8 cm","5 cm"],
  label1="ABCD", label2="PQRS",
  angles1=["90°","90°"], angles2=["90°","90°"],
}: TwoShapesCongruentProps) => {
  const w1=70, h1=48, w2=70, h2=48;
  const x1=18, y1=28, x2=148, y2=28;
  if (shape==="rect") return (
    <svg width={240} height={115} viewBox="0 0 240 115" className="lm-kkg-svg" style={{display:'block'}}>
      <rect width="240" height="115" fill="rgba(2,8,23,0.85)" rx="12"/>
      <rect x={x1} y={y1} width={w1} height={h1} fill={`${color1}18`} stroke={color1} strokeWidth="1.8" rx="2"/>
      <rect x={x2} y={y2} width={w2} height={h2} fill={`${color2}18`} stroke={color2} strokeWidth="1.8" rx="2"/>
      {["A","B","C","D"].map((v,i)=>{
        const px=[x1-6,x1+w1+2,x1+w1+2,x1-6][i], py=[y1-4,y1-4,y1+h1+10,y1+h1+10][i];
        return <text key={v} x={px} y={py} fill={color1} fontSize="10" fontWeight="bold">{v}</text>;
      })}
      {["P","Q","R","S"].map((v,i)=>{
        const px=[x2-6,x2+w2+2,x2+w2+2,x2-6][i], py=[y2-4,y2-4,y2+h2+10,y2+h2+10][i];
        return <text key={v} x={px} y={py} fill={color2} fontSize="10" fontWeight="bold">{v}</text>;
      })}
      <text x={x1+w1/2} y={y1-8} fill="rgba(255,255,255,0.8)" fontSize="10" textAnchor="middle">{sides1[0]}</text>
      <text x={x1+w1+6} y={y1+h1/2} fill="rgba(255,255,255,0.8)" fontSize="10">{sides1[1]}</text>
      <text x={x2+w2/2} y={y2-8} fill="rgba(255,255,255,0.8)" fontSize="10" textAnchor="middle">{sides2[0]}</text>
      <text x={x2+w2+6} y={y2+h2/2} fill="rgba(255,255,255,0.8)" fontSize="10">{sides2[1]}</text>
      <text x={x1+w1/2} y={108} fill={color1} fontSize="9" fontWeight="bold" textAnchor="middle">{label1}</text>
      <text x={x2+w2/2} y={108} fill={color2} fontSize="9" fontWeight="bold" textAnchor="middle">{label2}</text>
      <text x={120} y={55} fill="rgba(255,255,255,0.5)" fontSize="16" textAnchor="middle">≅</text>
    </svg>
  );
  const t1: [number,number][] = [[52,75],[12,112],[92,112]];
  const t2: [number,number][] = [[172,75],[132,112],[212,112]];
  const toPath = (pts:[number,number][]) => pts.map((p,i)=>`${i===0?'M':'L'}${p[0]},${p[1]}`).join(' ')+'Z';
  const mid = (a:[number,number],b:[number,number]):[number,number] => [(a[0]+b[0])/2,(a[1]+b[1])/2];
  return (
    <svg width={240} height={130} viewBox="0 0 240 130" className="lm-kkg-svg" style={{display:'block'}}>
      <rect width="240" height="130" fill="rgba(2,8,23,0.85)" rx="12"/>
      <path d={toPath(t1)} fill={`${color1}18`} stroke={color1} strokeWidth="1.8"/>
      <path d={toPath(t2)} fill={`${color2}18`} stroke={color2} strokeWidth="1.8"/>
      {["A","B","C"].map((v,i)=>{const p=t1[i];return <text key={v} x={p[0]+(i===0?0:i===1?-8:6)} y={p[1]+(i===0?-5:14)} fill={color1} fontSize="11" fontWeight="bold" textAnchor="middle">{v}</text>;})}
      {["P","Q","R"].map((v,i)=>{const p=t2[i];return <text key={v} x={p[0]+(i===0?0:i===1?-8:6)} y={p[1]+(i===0?-5:14)} fill={color2} fontSize="11" fontWeight="bold" textAnchor="middle">{v}</text>;})}
      <text x={mid(t1[0],t1[1])[0]} y={mid(t1[0],t1[1])[1]+13} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{sides1[0]}</text>
      <text x={mid(t1[1],t1[2])[0]} y={mid(t1[1],t1[2])[1]+12} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{sides1[1]}</text>
      <text x={mid(t2[0],t2[1])[0]} y={mid(t2[0],t2[1])[1]+13} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{sides2[0]}</text>
      <text x={mid(t2[1],t2[2])[0]} y={mid(t2[1],t2[2])[1]+12} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{sides2[1]}</text>
      <text x={120} y={85} fill="rgba(255,255,255,0.5)" fontSize="16" textAnchor="middle">≅</text>
    </svg>
  );
};

type ScaleFigureProps = {
  scale?: string; label?: string;
  origSides?: string[]; newSides?: string[];
  color?: string;
};

export const ScaleFigure = ({
  scale="1:2", label="ABCD ~ EFGH",
  origSides=["4","3"], newSides=["?","?"],
  color="#60a5fa",
}: ScaleFigureProps) => (
  <svg width={220} height={110} viewBox="0 0 220 110" className="lm-kkg-svg" style={{display:'block'}}>
    <rect width="220" height="110" fill="rgba(2,8,23,0.85)" rx="12"/>
    <rect x={15} y={25} width={50} height={35} fill={`${color}18`} stroke={color} strokeWidth="1.8" rx="2"/>
    <rect x={105} y={15} width={85} height={70} fill={`${color}30`} stroke="#f472b6" strokeWidth="1.8" rx="2"/>
    <text x={40} y={20} fill={color} fontSize="10" fontWeight="bold" textAnchor="middle">ABCD</text>
    <text x={147} y={10} fill="#f472b6" fontSize="10" fontWeight="bold" textAnchor="middle">EFGH</text>
    <text x={40} y={73} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{origSides[0]}</text>
    <text x={70} y={45} fill="rgba(255,255,255,0.7)" fontSize="9" textAnchor="start">{origSides[1]}</text>
    <text x={147} y={98} fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">{newSides[0]}</text>
    <text x={192} y={55} fill="rgba(255,255,255,0.7)" fontSize="10">{newSides[1]}</text>
    <text x={110} y={55} fill="rgba(255,220,50,0.9)" fontSize="11" fontWeight="bold" textAnchor="middle">k={scale}</text>
    <line x1={66} y1={42} x2={103} y2={42} stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#ar)"/>
    <defs><marker id="ar" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><polygon points="0 0,5 2.5,0 5" fill="rgba(255,255,255,0.4)"/></marker></defs>
  </svg>
);
