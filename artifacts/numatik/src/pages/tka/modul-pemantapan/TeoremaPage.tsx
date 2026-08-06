import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

// ─── SVG Components (duplicated from Olimpiade Matematika - Teorema Pythagoras) ───

const SegitigaPQRSVG = () => {
  const W = 260, H = 170;
  const Ax = 30, Ay = H - 30;
  const Bx = W - 30, By = H - 30;
  const Cx = 30, Cy = 25;
  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill="none" stroke="#22d3ee" strokeWidth="2" />
        <rect x={Ax} y={Ay - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1" />
        <text x={Ax - 10} y={(Ay + Cy) / 2 + 4} fill="#fbbf24" fontSize="14" fontStyle="italic" fontWeight="bold" textAnchor="end">p</text>
        <text x={(Ax + Bx) / 2} y={By + 18} fill="#fbbf24" fontSize="14" fontStyle="italic" fontWeight="bold" textAnchor="middle">q</text>
        <text x={(Bx + Cx) / 2 + 4} y={(By + Cy) / 2 - 4} fill="#fbbf24" fontSize="14" fontStyle="italic" fontWeight="bold">r</text>
      </svg>
    </div>
  );
};

const SegitigaABC182430SVG = () => {
  const W = 280, H = 200;
  const Ax = 30, Ay = H - 30;
  const Bx = W - 30, By = H - 30;
  const Cx = W - 30, Cy = 25;
  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2" />
        <rect x={Bx - 12} y={By - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1.2" />
        <circle cx={Ax} cy={Ay} r="3" fill="#22d3ee" />
        <circle cx={Bx} cy={By} r="3" fill="#22d3ee" />
        <circle cx={Cx} cy={Cy} r="3" fill="#22d3ee" />
        <text x={Ax - 10} y={Ay + 4} fill="#e5e7eb" fontSize="14" fontWeight="bold" textAnchor="end">A</text>
        <text x={Bx + 8} y={By + 12} fill="#e5e7eb" fontSize="14" fontWeight="bold">B</text>
        <text x={Cx + 8} y={Cy + 4} fill="#e5e7eb" fontSize="14" fontWeight="bold">C</text>
        <text x={(Ax + Bx) / 2} y={By + 18} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">24 cm</text>
        <text x={Bx - 8} y={(By + Cy) / 2 + 4} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end">18 cm</text>
        <text x={(Ax + Cx) / 2 - 8} y={(Ay + Cy) / 2 - 4} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end" transform={`rotate(-36 ${(Ax + Cx) / 2 - 8} ${(Ay + Cy) / 2 - 4})`}>?</text>
      </svg>
    </div>
  );
};

const SegitigaABD72425SVG = () => {
  const W = 280, H = 200;
  const Ax = 30, Ay = H - 30;
  const Bx = W - 30, By = H - 30;
  const Dx = W - 30, Dy = 50;
  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        <polygon points={`${Ax},${Ay} ${Bx},${By} ${Dx},${Dy}`} fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2" />
        <rect x={Bx - 12} y={By - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1.2" />
        <circle cx={Ax} cy={Ay} r="3" fill="#22d3ee" />
        <circle cx={Bx} cy={By} r="3" fill="#22d3ee" />
        <circle cx={Dx} cy={Dy} r="3" fill="#22d3ee" />
        <text x={Ax - 10} y={Ay + 4} fill="#e5e7eb" fontSize="14" fontWeight="bold" textAnchor="end">A</text>
        <text x={Bx + 8} y={By + 12} fill="#e5e7eb" fontSize="14" fontWeight="bold">B</text>
        <text x={Dx + 8} y={Dy + 4} fill="#e5e7eb" fontSize="14" fontWeight="bold">D</text>
        <text x={(Ax + Bx) / 2} y={By + 18} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">24 cm</text>
        <text x={Bx - 8} y={(By + Dy) / 2 + 4} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end">7 cm</text>
        <text x={(Ax + Dx) / 2 - 6} y={(Ay + Dy) / 2 - 6} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end" transform={`rotate(-22 ${(Ax + Dx) / 2 - 6} ${(Ay + Dy) / 2 - 6})`}>?</text>
      </svg>
    </div>
  );
};

const SegitigaCABD9_15_41_SVG = () => {
  const W = 320, H = 200;
  const Ax = 30, Ay = H - 30;
  const Cx = 30, Cy = 30;
  const Bx = W - 20, By = H - 30;
  const Dx = Ax + (12 / 40) * (Bx - Ax);
  const Dy = Ay;
  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        <polygon points={`${Cx},${Cy} ${Ax},${Ay} ${Bx},${By}`} fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2" />
        <line x1={Cx} y1={Cy} x2={Dx} y2={Dy} stroke="#22d3ee" strokeWidth="1.6" />
        <rect x={Ax} y={Ay - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1.2" />
        <circle cx={Cx} cy={Cy} r="3" fill="#22d3ee" />
        <circle cx={Ax} cy={Ay} r="3" fill="#22d3ee" />
        <circle cx={Bx} cy={By} r="3" fill="#22d3ee" />
        <circle cx={Dx} cy={Dy} r="3" fill="#22d3ee" />
        <text x={Cx - 8} y={Cy + 4} fill="#e5e7eb" fontSize="14" fontWeight="bold" textAnchor="end">C</text>
        <text x={Ax - 6} y={Ay + 16} fill="#e5e7eb" fontSize="14" fontWeight="bold" textAnchor="end">A</text>
        <text x={Bx + 6} y={By + 16} fill="#e5e7eb" fontSize="14" fontWeight="bold">B</text>
        <text x={Dx} y={Dy + 18} fill="#e5e7eb" fontSize="14" fontWeight="bold" textAnchor="middle">D</text>
        <text x={Cx - 6} y={(Cy + Ay) / 2 + 4} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end">9</text>
        <text x={(Cx + Bx) / 2 + 8} y={(Cy + By) / 2 - 4} fill="#fbbf24" fontSize="13" fontWeight="bold">41</text>
        <text x={(Cx + Dx) / 2 + 10} y={(Cy + Dy) / 2 + 4} fill="#fbbf24" fontSize="13" fontWeight="bold">15</text>
      </svg>
    </div>
  );
};

// Soal 7 — Bangun ABCDE (persegi panjang + segitiga siku-siku)
const Soal7ABCDESVG = () => (
  <svg viewBox="0 0 300 290" className="w-full max-w-xs mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <line x1="40" y1="250" x2="220" y2="250" stroke="#22d3ee" strokeWidth="2.2" />
    <line x1="220" y1="250" x2="220" y2="130" stroke="#22d3ee" strokeWidth="2.2" />
    <line x1="220" y1="130" x2="155" y2="44" stroke="#22d3ee" strokeWidth="2.2" />
    <line x1="155" y1="44" x2="40" y2="130" stroke="#22d3ee" strokeWidth="2.2" />
    <line x1="40" y1="130" x2="40" y2="250" stroke="#22d3ee" strokeWidth="2.2" />
    <line x1="40" y1="130" x2="220" y2="130" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="8,4" opacity="0.7" />
    <polyline points="159.8,50.4 153.4,55.2 148.6,48.8" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
    <line x1="33" y1="190" x2="47" y2="190" stroke="#22d3ee" strokeWidth="2" />
    <line x1="213" y1="190" x2="227" y2="190" stroke="#22d3ee" strokeWidth="2" />
    <circle cx="40"  cy="250" r="2.5" fill="#f87171" />
    <circle cx="220" cy="250" r="2.5" fill="#f87171" />
    <circle cx="220" cy="130" r="2.5" fill="#f87171" />
    <circle cx="155" cy="44"  r="2.5" fill="#f87171" />
    <circle cx="40"  cy="130" r="2.5" fill="#f87171" />
    <text x="26"  y="268" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">A</text>
    <text x="222" y="268" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">B</text>
    <text x="224" y="128" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">C</text>
    <text x="149" y="34"  fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">D</text>
    <text x="20"  y="128" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">E</text>
    <text x="130" y="272" fill="#fbbf24" fontSize="12" fontFamily="sans-serif" textAnchor="middle">15 cm</text>
    <text x="236" y="196" fill="#fbbf24" fontSize="12" fontFamily="sans-serif">10 cm</text>
    <text x="198" y="82"  fill="#fbbf24" fontSize="12" fontFamily="sans-serif">9 cm</text>
  </svg>
);

const TabelSegitiga11 = () => {
  const rows = [
    { tri: "△ABC", sisi: ["3", "10", "12"] },
    { tri: "△DEF", sisi: ["3", "4", "6"] },
    { tri: "△KLM", sisi: ["10", "24", "26"] },
    { tri: "△PQR", sisi: ["6", "8", "9"] },
  ];
  return (
    <div className="my-3 flex justify-center">
      <div className="w-full max-w-xs sm:max-w-sm overflow-hidden rounded-lg border border-cyan-400/40 bg-white/5">
        <table className="w-full text-sm text-white">
          <thead className="bg-cyan-500/20">
            <tr>
              <th className="px-3 py-2 text-left font-semibold border-b border-cyan-400/30">Segitiga</th>
              <th className="px-3 py-2 text-center font-semibold border-b border-cyan-400/30">Sisi 1</th>
              <th className="px-3 py-2 text-center font-semibold border-b border-cyan-400/30">Sisi 2</th>
              <th className="px-3 py-2 text-center font-semibold border-b border-cyan-400/30">Sisi 3</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.tri} className={i % 2 === 0 ? "bg-white/0" : "bg-white/5"}>
                <td className="px-3 py-2 font-semibold text-cyan-300 border-t border-cyan-400/20">{r.tri}</td>
                {r.sisi.map((s, j) => (
                  <td key={j} className="px-3 py-2 text-center text-yellow-300 border-t border-cyan-400/20">{s}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SegitigaXSVG = () => {
  const W = 280, H = 200;
  const Ax = 90, Ay = H - 30;
  const Bx = W - 30, By = H - 30;
  const Cx = 90, Cy = 25;
  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[180px] sm:max-w-[220px] rounded-lg border border-border/40 bg-white/5">
        <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2" />
        <rect x={Ax} y={Ay - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1.2" />
        <circle cx={Ax} cy={Ay} r="3" fill="#22d3ee" />
        <circle cx={Bx} cy={By} r="3" fill="#22d3ee" />
        <circle cx={Cx} cy={Cy} r="3" fill="#22d3ee" />
        <text x={Ax - 8} y={(Ay + Cy) / 2 + 4} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end">(x − 1) cm</text>
        <text x={(Ax + Bx) / 2} y={By + 18} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">(x + 1) cm</text>
        <text x={(Bx + Cx) / 2 + 6} y={(By + Cy) / 2 - 6} fill="#fbbf24" fontSize="13" fontWeight="bold">(x + 3) cm</text>
      </svg>
    </div>
  );
};

const LayangLayangABCDSVG = () => {
  const W = 240, H = 300;
  const cx = W / 2;
  const cy = H / 2 - 10;
  const B = { x: cx, y: 30 };
  const D = { x: cx, y: H - 20 };
  const A = { x: 30, y: cy };
  const C = { x: W - 30, y: cy };
  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[200px] sm:max-w-[240px] rounded-lg border border-border/40 bg-white/5">
        <line x1={B.x} y1={B.y} x2={D.x} y2={D.y} stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="5,4" />
        <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="5,4" />
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`} fill="rgba(34,211,238,0.06)" stroke="#22d3ee" strokeWidth="2" />
        <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke="#94a3b8" strokeWidth="1" />
        <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} stroke="#94a3b8" strokeWidth="1" />
        {[A, B, C, D].map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#22d3ee" />)}
        <text x={B.x} y={B.y - 8} fill="#e5e7eb" fontSize="14" fontWeight="bold" textAnchor="middle">B</text>
        <text x={D.x} y={D.y + 16} fill="#e5e7eb" fontSize="14" fontWeight="bold" textAnchor="middle">D</text>
        <text x={A.x - 8} y={A.y + 5} fill="#e5e7eb" fontSize="14" fontWeight="bold" textAnchor="end">A</text>
        <text x={C.x + 8} y={C.y + 5} fill="#e5e7eb" fontSize="14" fontWeight="bold">C</text>
      </svg>
    </div>
  );
};

const JajargenjangABCDSVG = () => {
  const W = 320, H = 250;
  const A = { x: 30, y: 210 };
  const E = { x: 80, y: 210 };
  const B = { x: 230, y: 210 };
  const D = { x: 80, y: 90 };
  const C = { x: 280, y: 90 };
  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`} fill="rgba(34,211,238,0.06)" stroke="#22d3ee" strokeWidth="2" />
        <line x1={D.x} y1={D.y} x2={E.x} y2={E.y} stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="5,4" />
        <rect x={E.x} y={E.y - 10} width="10" height="10" fill="none" stroke="#22d3ee" strokeWidth="1.2" />
        {[A, B, C, D, E].map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#22d3ee" />)}
        <text x={A.x - 6} y={A.y + 16} fill="#e5e7eb" fontSize="14" fontWeight="bold" textAnchor="end">A</text>
        <text x={B.x + 6} y={B.y + 16} fill="#e5e7eb" fontSize="14" fontWeight="bold">B</text>
        <text x={C.x + 6} y={C.y - 4} fill="#e5e7eb" fontSize="14" fontWeight="bold">C</text>
        <text x={D.x - 6} y={D.y - 4} fill="#e5e7eb" fontSize="14" fontWeight="bold" textAnchor="end">D</text>
        <text x={E.x} y={E.y + 16} fill="#e5e7eb" fontSize="13" fontWeight="bold" textAnchor="middle">E</text>
        <text x={(D.x + C.x) / 2} y={D.y - 8} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">20 cm</text>
        <text x={(A.x + D.x) / 2 - 8} y={(A.y + D.y) / 2} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end">13 cm</text>
        <text x={(E.x + B.x) / 2} y={B.y + 22} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">15 cm</text>
      </svg>
    </div>
  );
};

const SegitigaPQR30SVG = () => {
  const W = 300, H = 200;
  const P = { x: 40, y: 170 };
  const Q = { x: 260, y: 170 };
  const R = { x: 40, y: 40 };
  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        <polygon points={`${P.x},${P.y} ${Q.x},${Q.y} ${R.x},${R.y}`} fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2" />
        <rect x={P.x} y={P.y - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1.2" />
        <path d={`M ${Q.x - 28} ${Q.y} A 28 28 0 0 1 ${Q.x - 24.2} ${Q.y - 14}`} fill="none" stroke="#fbbf24" strokeWidth="1.4" />
        <text x={Q.x - 30} y={Q.y - 6} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end">30°</text>
        {[P, Q, R].map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#22d3ee" />)}
        <text x={P.x - 6} y={P.y + 16} fill="#e5e7eb" fontSize="14" fontWeight="bold" textAnchor="end">P</text>
        <text x={Q.x + 6} y={Q.y + 16} fill="#e5e7eb" fontSize="14" fontWeight="bold">Q</text>
        <text x={R.x - 6} y={R.y - 4} fill="#e5e7eb" fontSize="14" fontWeight="bold" textAnchor="end">R</text>
      </svg>
    </div>
  );
};

// Soal 29 — Segitiga ABC siku-siku di B, titik D pada AB, ∠A=30°, ∠CDB=45°, BC=5cm
const Soal29ABCDSVG = () => (
  <svg viewBox="65 115 245 160" className="w-full max-w-xs mx-auto rounded-lg border border-border/40 bg-white/5" xmlns="http://www.w3.org/2000/svg">
    <polygon points="87,240 260,240 260,140" fill="rgba(251,191,36,0.08)" stroke="none" />
    <line x1="87" y1="240" x2="260" y2="240" stroke="#22d3ee" strokeWidth="2" />
    <line x1="260" y1="240" x2="260" y2="140" stroke="#22d3ee" strokeWidth="2" />
    <line x1="87" y1="240" x2="260" y2="140" stroke="#22d3ee" strokeWidth="2" />
    <line x1="160" y1="240" x2="260" y2="140" stroke="#22d3ee" strokeWidth="1.8" />
    <polyline points="248,240 248,228 260,228" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
    <path d="M 111,240 A 24 24 0 0 0 107.78,228" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
    <path d="M 180,240 A 20 20 0 0 0 174.14,225.86" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
    <circle cx="87"  cy="240" r="2.5" fill="#f87171" />
    <circle cx="260" cy="240" r="2.5" fill="#f87171" />
    <circle cx="260" cy="140" r="2.5" fill="#f87171" />
    <circle cx="160" cy="240" r="2.5" fill="#f87171" />
    <text x="74"  y="258" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">A</text>
    <text x="264" y="258" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">B</text>
    <text x="264" y="140" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">C</text>
    <text x="154" y="258" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">D</text>
    <text x="115" y="234" fill="#fbbf24" fontSize="11" fontFamily="sans-serif">30°</text>
    <text x="182" y="232" fill="#fbbf24" fontSize="11" fontFamily="sans-serif">45°</text>
    <text x="268" y="196" fill="#fbbf24" fontSize="12" fontFamily="sans-serif">5 cm</text>
  </svg>
);

// ─── Materi ───────────────────────────────────────────────────────────────────

const materiSections: MateriSection[] = [
  {
    heading: "A. Konsep Dasar Pythagoras",
    content: `1. Kuadrat bilangan
$a^2 = a \\times a$ atau $a^2 = (-a) \\times (-a)$

2. Akar dari bilangan pada konsep Teorema Pythagoras diambil yang hasilnya positif karena sisi pada segitiga adalah bilangan positif.
$x^2 = p^2$ maka $x = p$
$x^2 = p$ maka $x = \\sqrt{p}$
$\\sqrt{a^2p} = a\\sqrt{p}$

3. Jika a, b, c merupakan sisi segitiga dan c merupakan sisi yang paling panjang, maka untuk membuat suatu segitiga harus dipenuhi syarat:
$c < a + b$

4. Jika a, b, c merupakan sisi segitiga dan c paling panjang:
$c^2 > a^2 + b^2$ : segitiga tumpul di C
$c^2 = a^2 + b^2$ : segitiga siku-siku di C
$c^2 < a^2 + b^2$ : segitiga lancip di C`,
  },
  {
    heading: "B. Teorema Pythagoras",
    content: `Diketahui segitiga siku-siku dengan sisi terpanjang c (sisi miring yang berhadapan dengan sudut siku-siku), sisi tegak a dan b, maka berlaku:

"Sisi terpanjang (sisi miring) kuadrat sama dengan jumlah kuadrat sisi-sisi lainnya."

$c^2 = a^2 + b^2$`,
  },
  {
    heading: "C. Jarak Antara 2 Titik Koordinat",
    content: `$|PQ| = \\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$

$|PQ|$: jarak titik P dan Q`,
  },
  {
    heading: "D. Sudut Khusus pada Segitiga Siku-siku",
    content: `1. Sudut $30°$ dan $60°$
Pada segitiga siku-siku dengan sudut $30°$, $60°$, dan $90°$:
- Sisi di depan sudut $30°$ = $\\frac{1}{2}$ sisi miring
- Sisi di depan sudut $60°$ = $\\frac{\\sqrt{3}}{2}$ sisi miring

2. Sudut $45°$
Pada segitiga siku-siku sama kaki dengan sudut $45°$, $45°$, dan $90°$:
- Kedua sisi tegak sama panjang
- Sisi miring = $\\sqrt{2}$ kali sisi tegak`,
  },
  {
    heading: "E. Tripel Pythagoras",
    content: `Tripel Pythagoras adalah 3 bilangan asli yang memenuhi teorema Pythagoras.\n\nTripel dasar yang sering muncul:\n- 3, 4, 5 (dan kelipatannya: 6,8,10 ; 9,12,15 ; ...)\n- 5, 12, 13 (dan kelipatannya: 10,24,26 ; ...)\n- 7, 24, 25\n- 8, 15, 17\n- 9, 40, 41`,
  },
];

// ─── Latihan Soal (sama dengan Olimpiade Matematika - Teorema Pythagoras - Latihan Dasar) ─────

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Diketahui ukuran segitiga:\ni. 1 cm, 1 cm, 1 cm\nii. 8 cm, 10 cm, 18 cm\niii. 12 cm, 21 cm, 8 cm\niv. 5 cm, 12 cm, 15 cm\nYang dapat membentuk suatu segitiga adalah ....", options: ["A. i dan iii", "B. iii dan iv", "C. i, iii dan iv", "D. i dan iv"] },
  { no: 2, soal: "Diketahui ukuran berikut:\ni. 2 cm, 2 cm, 2 cm\nii. 6 cm, 8 cm, 14 cm\niii. 7 cm, 15 cm, 25 cm\niv. 5 cm, 12 cm, 15 cm\nYang merupakan sisi pada segitiga adalah ..", options: ["A. i dan ii", "B. i dan iv", "C. ii dan iv", "D. iv saja"] },
  { no: 3, soal: "Perhatikan gambar! Dari pernyataan berikut yang benar adalah ....", options: ["A. $p = \\sqrt{r^2 + q^2}$", "B. $q = \\sqrt{r^2 - p^2}$", "C. $p = \\sqrt{q^2 - r^2}$", "D. $q = \\sqrt{r^2 + p^2}$"], gambar: <SegitigaPQRSVG /> },
  { no: 4, soal: "Panjang AC adalah..", options: ["A. 24 cm", "B. 28 cm", "C. 30 cm", "D. 32 cm"], gambar: <SegitigaABC182430SVG /> },
  { no: 5, soal: "Perhatikan gambar! Panjang AD adalah....", options: ["A. 15 cm", "B. 17 cm", "C. 24 cm", "D. 25 cm"], gambar: <SegitigaABD72425SVG /> },
  { no: 6, soal: "Perhatikan gambar berikut! Panjang BD adalah....", options: ["A. 12 cm", "B. 18 cm", "C. 18 cm", "D. 40 cm"], gambar: <SegitigaCABD9_15_41_SVG /> },
  { no: 7, soal: "Perhatikan gambar berikut! Keliling bangun ABCDE adalah....", options: ["A. 56 cm", "B. 74 cm", "C. 59 cm", "D. 86 cm"], gambar: <Soal7ABCDESVG /> },
  { no: 8, soal: "Perhatikan sisi-sisi segitiga di bawah\ni. 8, 15, dan 18\nii. 7, 24, dan 25\niii. 12, 15, dan 20\niv. 9, 12, dan 15\nYang merupakan tripel Pythagoras pada sisi-sisi segitiga diatas adalah...", options: ["A. i dan ii", "B. ii dan iii", "C. ii dan iv", "D. i dan iv"] },
  { no: 9, soal: "Besar kedua sudut segitiga $40°$ dan $70°$. Ditinjau dari panjang sisi dan besar sudutnya, jenis segitiga tersebut adalah....", options: ["A. segitiga lancip sama kaki", "B. segitiga siku-siku sama kaki", "C. segitiga tumpul sama kaki", "D. segitiga tumpul sembarang"] },
  { no: 10, soal: "Diketahui panjang sisi-sisi pada segitiga sebagai berikut:\n(1). 3 cm, 4 cm, 5 cm\n(2). 6 cm, 7 cm, 10 cm\n(3). 4 cm, 5 cm, 6 cm\n(4). 6 cm, 8 cm, 12 cm\nPanjang sisi-sisi diatas yang dapat membentuk segitiga tumpul adalah ...", options: ["A. (1) dan (2)", "B. (2) dan (3)", "C. (3) dan (4)", "D. (2) dan (4)"] },
  { no: 11, soal: "Perhatikan tabel berikut.\nPada tabel tersebut, segitiga yang merupakan segitiga siku-siku adalah .......", options: ["A. $\\triangle ABC$", "B. $\\triangle DEF$", "C. $\\triangle KLM$", "D. $\\triangle PQR$"], gambar: <TabelSegitiga11 /> },
  { no: 12, soal: "Suatu segitiga mempunyai ukuran sisi-sisinya 8 cm, 15 cm, dan 20 cm. Segitiga tersebut merupakan jenis segitiga ....", options: ["A. lancip", "B. tumpul", "C. siku-siku", "D. sama kaki"] },
  { no: 13, soal: "Diketahui ukuran segitiga:\ni. 2 cm, 2 cm, 2 cm\nii. 6 cm, 8 cm, 14 cm\niii. 7 cm, 24 cm, 25 cm\niv. 5 cm, 12 cm, 15 cm\nYang merupakan segitiga tumpul adalah ..", options: ["A. i dan ii", "B. i dan iv", "C. ii dan iv", "D. iv saja"] },
  { no: 14, soal: "Diketahui sebuah segitiga memiliki sudut $45°$ dan $100°$, maka jika ditinjau dari sisinya dan sudut segitiga tersebut adalah......", options: ["A. Segitiga tumpul sama kaki", "B. Segitiga tumpul sebarang", "C. Segitiga lancip sama sisi", "D. Segitiga siku-siku sama kaki"] },
  { no: 15, soal: "Pernyataan yang benar untuk gambar di bawah adalah ...", options: ["A. $x = 6$ cm", "B. $x = 7$ cm", "C. luas segitiga $= 48$ cm$^2$", "D. keliling segitiga $= 21$ cm"], gambar: <SegitigaXSVG /> },
  { no: 16, soal: "Diketahui keliling belah ketupat 52 cm dan salah satu diagonalnya 24 cm. Luas belah ketupat ABCD adalah....", options: ["A. 312 cm$^2$", "B. 274 cm$^2$", "C. 240 cm$^2$", "D. 120 cm$^2$"] },
  { no: 17, soal: "Panjang diagonal dan lebar sebuah persegi panjang berturut-turut adalah 15 cm dan 9 cm. Panjang persegi panjang tersebut adalah ......", options: ["A. 8 cm", "B. 10 cm", "C. 12 cm", "D. 14 cm"] },
  {
    no: 18,
    soal: "Perhatikan gambar berikut.\n[IMAGE:https://drive.google.com/thumbnail?id=1esQMfsShmsagj6xBd93KcfnNJuZeJkZo&sz=w400]\nDari gambar diatas, berapa kira-kira panjang tali layar dari layang-layang agar layar tersebut menarik kapal pada sudut $45°$ dan berada pada ketinggian vertikal 150 m, seperti diperlihatkan pada gambar?",
    options: ["A. 175 m", "B. 212 m", "C. 285 m", "D. 300 m"],
  },
  { no: 19, soal: "Sebuah kapal berlayar dari pelabuhan Ambu menuju arah barat sejauh 100 mil ke pelabuhan Beta. Dari Beta ke arah selatan sejauh 50 mil menuju pelabuhan Cinta. Dari Cinta ke arah timur sejauh 170 mil ke pelabuhan Delta. Dari Delta ke arah utara sejauh 290 mil menuju pelabuhan Eco. Jarak terdekat dari pelabuhan Ambu ke pelabuhan Eco adalah...", options: ["A. 130 mil", "B. 170 mil", "C. 250 mil", "D. 260 mil"] },
  {
    no: 20,
    soal: "Perhatikan gambar.\n[IMAGE:https://drive.google.com/thumbnail?id=1rm7EQCDS9GF7Fz4UtGreZ2GGgLvk9E3h&sz=w400]\nDiketahui AB = 15 cm, AF = 10 cm, BD = 12 cm. Luas bangun tersebut adalah ...",
    options: ["A. 140 cm$^2$", "B. 216 cm$^2$", "C. 250 cm$^2$", "D. 302 cm$^2$"],
  },
  {
    no: 21,
    soal: "Perhatikan gambar berikut.\n[IMAGE:https://drive.google.com/thumbnail?id=1Pm7o-z88MQ6qpVRrrCE0JE5GFgghrI21&sz=w400]\nLuas daerah di atas adalah",
    options: ["A. 48 cm$^2$", "B. 98 cm$^2$", "C. 120 cm$^2$", "D. 144 cm$^2$"],
  },
  { no: 22, soal: "Kebun berbentuk belah ketupat dengan panjang masing-masing diagonalnya 12 m dan 16 m. Di sekeliling kebun akan ditanami pohon dengan jarak antar pohon 2 m.\nBanyaknya seluruh pohon adalah", options: ["A. 14 pohon", "B. 20 pohon", "C. 28 pohon", "D. 56 pohon"] },
  { no: 23, soal: "Perhatikan gambar layang-layang ABCD di bawah ini.\nJika panjang AC = 24 cm, panjang AB = 13 cm dan panjang AD = 20 cm. Hitunglah luas bangun layang-layang di atas!", options: [], gambar: <LayangLayangABCDSVG /> },
  { no: 24, soal: "Perhatikan bangun datar jajargenjang ABCD di bawah ini.\nJika diketahui panjang AD = 13 cm, CD = 20 cm, dan BE = 15 cm. Hitunglah luas jajargenjang ABCD tersebut.", options: [], gambar: <JajargenjangABCDSVG /> },
  { no: 25, soal: "Sebidang tanah berbentuk trapesium sama kaki, panjang sisi sejajarnya 24 m dan 14 m, dan jarak sisi sejajar 12 m. Jika sekeliling tanah tersebut dibuat pagar, panjang pagar seluruhnya adalah...", options: ["A. 50 m", "B. 51 m", "C. 62 m", "D. 64 m"] },
  { no: 26, soal: "Seseorang berada di atas gedung yang tingginya 12 m. Dia melihat dua buah benda A dan benda B di tanah dengan arah yang sama. Jika jarak pandang orang tersebut dengan benda A adalah 15 m dan dengan benda B adalah 20 m, maka jarak benda A dan benda B di tanah adalah...", options: ["A. 7 m", "B. 9 m", "C. 12 m", "D. 16 m"] },
  { no: 27, soal: "Pada gambar di bawah, jika panjang PR = 12 cm maka panjang QR dan PQ adalah ...", options: [], gambar: <SegitigaPQR30SVG /> },
  {
    no: 28,
    soal: "Sebuah Helikopter terbang pada ketinggian 500 m di atas permukaan tanah. Helikopter tersebut melihat tiga titik di atas permukaan tanah, yaitu titik A, titik B, dan titik C.\nTentukanlah:\n1. jarak OA\n2. jarak AB\n3. jarak BC",
    options: [
      "A. $OA = 500$ m, $AB = 300$ m, $BC = 400$ m",
      "B. $OA = 400$ m, $AB = 300$ m, $BC = 500$ m",
      "C. $OA = 300$ m, $AB = 400$ m, $BC = 500$ m",
      "D. $OA = 500$ m, $AB = 400$ m, $BC = 300$ m",
    ],
  },
  { no: 29, soal: "Perhatikan gambar berikut.\nTentukanlah panjang sisi AB, AC, dan CD", options: [], gambar: <Soal29ABCDSVG /> },
  { no: 30, soal: "Hitunglah jarak antara titik $A(3, -2)$ dan titik $B(-5, 4)$ pada bidang koordinat Kartesius.", options: ["A. 8", "B. 10", "C. $10\\sqrt{2}$", "D. $\\sqrt{52}$"] },
  { no: 31, soal: "Jarak antara titik $P(k, 5)$ dan titik $Q(1, 1)$ adalah 5 satuan. Berapakah nilai k yang mungkin?", options: ["A. $k = 5$", "B. $k = 3$", "C. $k = -2$", "D. $k = 6$"] },
  { no: 32, soal: "Tiga titik di bidang koordinat adalah $K(2, 5)$, $L(6, 1)$, dan $M(10, 5)$. Tentukan jenis segitiga $\\triangle KLM$ dilihat dari panjang sisi-sisinya.", options: ["A. Segitiga Sembarang", "B. Segitiga Sama Kaki", "C. Segitiga Siku-siku", "D. Segitiga Sama Sisi"] },
  { no: 33, soal: "Titik $R(x, 0)$ terletak pada sumbu-x dan berjarak sama dari titik $A(2, 3)$ dan titik $B(5, -2)$. Berapakah koordinat titik R?", options: ["A. $R(4, 0)$", "B. $R(2, 0)$", "C. $R(3, 0)$", "D. $R\\left(\\frac{8}{3}, 0\\right)$"] },
];

const TeoremaPage = () => (
  <TKAPemantapanLayout
    title="TEOREMA PYTHAGORAS"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default TeoremaPage;
