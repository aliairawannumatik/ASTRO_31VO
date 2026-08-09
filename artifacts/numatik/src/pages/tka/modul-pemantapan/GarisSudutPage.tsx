import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";
import { getTkaContohSoal } from "@/data/tkaContohSoal";
import { useTheme } from "@/contexts/ThemeContext";

// ─── Diagram SVG untuk tiap soal — diduplikasi dari OlimpiadeGarisSudutPage.tsx
// (menu OLIMPIADE MATEMATIKA > GARIS DAN SUDUT > LATIHAN DASAR) agar soal di
// modul pemantapan ini juga lengkap dengan gambar. ───
const materiSections: MateriSection[] = [
  { heading: "A. Jenis-jenis Sudut", content: `- Sudut siku-siku: 90°\n- Sudut lancip: 0° < α < 90°\n- Sudut tumpul: 90° < α < 180°\n- Sudut lurus: 180°\n- Sudut refleks: 180° < α < 360°\n- Sudut penuh: 360°` },
  { heading: "B. Hubungan Antar Sudut", content: `1. Sudut berpelurus (suplemen): dua sudut berjumlah 180°\n   Jika sudut A dan sudut B berpelurus: $A + B = 180°$\n\n2. Sudut berpenyiku (komplemen): dua sudut berjumlah 90°\n   Jika sudut A dan sudut B berpenyiku: $A + B = 90°$\n\n3. Sudut bertolak belakang: dua sudut yang bertolak belakang nilainya sama.\n\n4. Sudut sehadap: $\\alpha_1 = \\alpha_2$ (pada dua garis sejajar)\n5. Sudut berseberangan dalam: $\\alpha_1 = \\alpha_2$\n6. Sudut berseberangan luar: $\\alpha_1 = \\alpha_2$\n7. Sudut sepihak (dalam): $\\alpha_1 + \\alpha_2 = 180°$` },
  { heading: "C. Hubungan Sudut pada Garis Sejajar", content: `Jika dua garis sejajar dipotong oleh garis lain (transversal):\n\n1. Sudut sehadap sama besar (F-angle)\n2. Sudut berseberangan dalam sama besar (Z-angle)\n3. Sudut berseberangan luar sama besar\n4. Sudut sepihak dalam berjumlah 180° (C-angle)` },
  { heading: "D. Jumlah Sudut Segitiga dan Segiempat", content: `Segitiga: jumlah ketiga sudut = 180°\nSegiempat: jumlah keempat sudut = 360°\n\nSudut luar segitiga = jumlah dua sudut dalam yang tidak berdekatan dengan sudut luar tersebut.` },
  { heading: "E. Sudut pada Lingkaran", content: `Sudut pusat = 2 × sudut keliling yang menghadap busur yang sama\n\nSudut keliling yang menghadap busur yang sama besarnya sama.\n\nSudut dalam setengah lingkaran = 90°` },
];
const Soal1SVG = () => (
  <svg
    viewBox="0 0 420 220"
    className="w-full max-w-md mx-auto"
    style={{ background: "transparent" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Horizontal line passing through N – K – L */}
    <line x1="20" y1="175" x2="400" y2="175" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Triangle sides KM and ML */}
    <line x1="140" y1="175" x2="240" y2="35" stroke="var(--icon-stroke)" strokeWidth="2" />
    <line x1="240" y1="35"  x2="380" y2="175" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* Angle arcs (small accents to show the 3 angles) */}
    {/* Angle at M (apex) — opens downward, ~50° */}
    <path d="M 226,55 A 22,22 0 0,0 254,55" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
    {/* Angle at K — opens to the upper-right */}
    <path d="M 168,175 A 28,28 0 0,0 158,154" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
    {/* Angle at L — opens to the upper-left (sweep CW so it bulges into the triangle) */}
    <path d="M 352,175 A 28,28 0 0,1 360,155" fill="none" stroke="#fbbf24" strokeWidth="1.6" />

    {/* Vertex dots (red) */}
    <circle cx="40"  cy="175" r="3.5" fill="#ef4444" />
    <circle cx="140" cy="175" r="3.5" fill="#ef4444" />
    <circle cx="240" cy="35"  r="3.5" fill="#ef4444" />
    <circle cx="380" cy="175" r="3.5" fill="#ef4444" />

    {/* Vertex labels (cyan italic serif, like other figures in this file) */}
    <text x="32"  y="168" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">N</text>
    <text x="132" y="200" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">K</text>
    <text x="385" y="200" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">L</text>
    <text x="232" y="25"  fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">M</text>

    {/* Angle measurements */}
    {/* 50° at M (just below the apex, inside the triangle) */}
    <text x="240" y="80" textAnchor="middle" fill="#fbbf24" fontSize="13" fontFamily="serif">
      50°
    </text>
    {/* (6x + 20)° at K — inside, slightly up & right of K */}
    <text x="186" y="167" fill="#fbbf24" fontSize="13" fontFamily="serif">
      (6<tspan fontStyle="italic">x</tspan> + 20)°
    </text>
    {/* (4x)° at L — closer to the L vertex, just left of the arc */}
    <text x="348" y="170" textAnchor="end" fill="#fbbf24" fontSize="13" fontFamily="serif">
      (4<tspan fontStyle="italic">x</tspan>)°
    </text>
  </svg>
);

// ── Shared marker definitions for arrows on soal SVGs ────────────────────────
const ArrowDef = ({ id, color = "#ffffff" }: { id: string; color?: string }) => (
  <marker id={id} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
    <path d="M 0 0 L 7 4 L 0 8 Z" fill={color} />
  </marker>
);

// ── Soal 2: Two parallel lines a, b cut by horizontal transversal c ──────────
const Soal2SVG = () => (
  <svg viewBox="0 0 420 220" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <defs><ArrowDef id="ar-s2" /></defs>
    {/* Transversal c */}
    <line x1="20" y1="120" x2="400" y2="120" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s2)" />
    {/* Line a (left, ↗) */}
    <line x1="60" y1="200" x2="180" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s2)" />
    {/* Line b (right, ↗, parallel to a) */}
    <line x1="220" y1="200" x2="340" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s2)" />

    <text x="178" y="32" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">a</text>
    <text x="338" y="32" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">b</text>
    <text x="406" y="116" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">c</text>

    {/* Numbers around left intersection (120, 120). The narrow wedges (NE, SW)
        require pushing 2 and 4 further away so they don't sit on top of the
        diagonal line. */}
    <text x="94"  y="108" fill="#38bdf8" fontSize="13" fontWeight="bold">1</text>
    <text x="158" y="108" fill="#38bdf8" fontSize="13" fontWeight="bold">2</text>
    <text x="158" y="152" fill="#38bdf8" fontSize="13" fontWeight="bold">3</text>
    <text x="76"  y="152" fill="#38bdf8" fontSize="13" fontWeight="bold">4</text>

    {/* Numbers around right intersection (280, 120) */}
    <text x="254" y="108" fill="#38bdf8" fontSize="13" fontWeight="bold">5</text>
    <text x="318" y="108" fill="#38bdf8" fontSize="13" fontWeight="bold">6</text>
    <text x="318" y="152" fill="#38bdf8" fontSize="13" fontWeight="bold">7</text>
    <text x="236" y="152" fill="#38bdf8" fontSize="13" fontWeight="bold">8</text>

    <circle cx="120" cy="120" r="3" fill="#ef4444" />
    <circle cx="280" cy="120" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 3: Two parallel horizontal lines (A, B) cut by transversal ──────────
const Soal3SVG = () => (
  <svg viewBox="0 0 380 240" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="80" x2="360" y2="80" stroke="var(--icon-stroke)" strokeWidth="2" />
    <line x1="20" y1="180" x2="360" y2="180" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Transversal — slope 220/160 = 1.375; at y=80 x≈164, at y=180 x≈236 */}
    <line x1="120" y1="20" x2="280" y2="240" stroke="var(--icon-stroke)" strokeWidth="2" />

    <text x="80" y="60" fill="#38bdf8" fontSize="16" fontFamily="serif" fontStyle="italic" fontWeight="bold">A</text>
    <text x="80" y="160" fill="#38bdf8" fontSize="16" fontFamily="serif" fontStyle="italic" fontWeight="bold">B</text>

    {/* Top intersection numbers (~164, 80). Transversal slope = 1.375, so the
        right-of-transversal positions need extra horizontal offset to clear
        the line, especially the lower half (number 3). */}
    <text x="138" y="70"  fill="#fbbf24" fontSize="13" fontWeight="bold">1</text>
    <text x="180" y="70"  fill="#fbbf24" fontSize="13" fontWeight="bold">2</text>
    <text x="192" y="102" fill="#fbbf24" fontSize="13" fontWeight="bold">3</text>
    <text x="138" y="102" fill="#fbbf24" fontSize="13" fontWeight="bold">4</text>

    {/* Bottom intersection numbers (~236, 180) */}
    <text x="210" y="170" fill="#fbbf24" fontSize="13" fontWeight="bold">1</text>
    <text x="252" y="170" fill="#fbbf24" fontSize="13" fontWeight="bold">2</text>
    <text x="264" y="202" fill="#fbbf24" fontSize="13" fontWeight="bold">3</text>
    <text x="210" y="202" fill="#fbbf24" fontSize="13" fontWeight="bold">4</text>

    <circle cx="164" cy="80" r="3" fill="#ef4444" />
    <circle cx="236" cy="180" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 4: Two parallel lines BD, EG; transversal AH; angles (3x)°, (x+40)° ─
const Soal4SVG = () => (
  <svg viewBox="0 0 360 300" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <line x1="40" y1="100" x2="320" y2="100" stroke="var(--icon-stroke)" strokeWidth="2" />
    <line x1="40" y1="220" x2="320" y2="220" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Transversal AH near vertical, slight tilt */}
    <line x1="160" y1="20" x2="200" y2="280" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* C ≈ (172, 100), F ≈ (190, 220) on the transversal */}
    <text x="186" y="14" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">A</text>
    <text x="22" y="106" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">B</text>
    <text x="328" y="106" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">D</text>
    <text x="146" y="92" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">C</text>
    <text x="22" y="226" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">E</text>
    <text x="328" y="226" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">G</text>
    <text x="174" y="240" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">F</text>
    <text x="208" y="294" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">H</text>

    {/* Angle labels — placed snug next to the vertices C and F */}
    <text x="180" y="116" fill="#fbbf24" fontSize="13" fontFamily="serif">(3<tspan fontStyle="italic">x</tspan>)°</text>
    <text x="198" y="212" fill="#fbbf24" fontSize="13" fontFamily="serif">(<tspan fontStyle="italic">x</tspan>+40)°</text>

    <circle cx="172" cy="100" r="3" fill="#ef4444" />
    <circle cx="190" cy="220" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 5: Line C-B-A horizontal, ray BD up; angles (2x+5)°, (3x-25)° ───────
const Soal5SVG = () => (
  <svg viewBox="0 0 380 200" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="150" x2="360" y2="150" stroke="var(--icon-stroke)" strokeWidth="2" />
    <line x1="200" y1="150" x2="290" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" />

    <text x="20" y="170" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">C</text>
    <text x="194" y="172" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">B</text>
    <text x="350" y="170" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">A</text>
    <text x="294" y="38" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">D</text>

    <text x="148" y="138" fill="#fbbf24" fontSize="13" fontFamily="serif">(2<tspan fontStyle="italic">x</tspan>+5)°</text>
    <text x="218" y="142" fill="#fbbf24" fontSize="13" fontFamily="serif">(3<tspan fontStyle="italic">x</tspan>-25)°</text>

    <circle cx="200" cy="150" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 7: Triangle PQR with extension; ∠Q=72°, 7x at R, 6x exterior at Q ───
const Soal7SVG = () => (
  <svg viewBox="0 0 360 220" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <defs><ArrowDef id="ar-s7" /></defs>
    {/* Horizontal P-Q-extension */}
    <line x1="40" y1="170" x2="340" y2="170" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s7)" />
    {/* PR */}
    <line x1="60" y1="170" x2="180" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* QR */}
    <line x1="240" y1="170" x2="180" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" />

    <text x="44" y="190" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">P</text>
    <text x="232" y="190" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">Q</text>
    <text x="184" y="38" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">R</text>

    {/* 7x at vertex R (interior angle of the triangle) */}
    <text x="172" y="68" fill="#fbbf24" fontSize="13" fontFamily="serif">7<tspan fontStyle="italic">x</tspan></text>
    {/* 72° at Q (interior, between QP and QR) */}
    <text x="208" y="162" fill="#fbbf24" fontSize="12" fontFamily="serif">72°</text>
    {/* 6x exterior at Q (between QR and Q-extension) — nudged left toward Q */}
    <text x="246" y="162" fill="#fbbf24" fontSize="13" fontFamily="serif">6<tspan fontStyle="italic">x</tspan></text>
  </svg>
);

// ── Soal 8: Triangle ABC with D on extension of AB; (3x-15)° at C, 2x and (5x+5)° at B ──
const Soal8SVG = () => (
  <svg viewBox="0 0 380 220" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <defs><ArrowDef id="ar-s8" /></defs>
    <line x1="20" y1="170" x2="360" y2="170" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s8)" />
    {/* AC */}
    <line x1="40" y1="170" x2="200" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* BC */}
    <line x1="240" y1="170" x2="200" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" />

    <text x="32" y="190" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">A</text>
    <text x="232" y="190" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">B</text>
    <text x="350" y="190" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">D</text>
    <text x="194" y="34" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">C</text>

    <text x="165" y="78" fill="#fbbf24" fontSize="12" fontFamily="serif">(3<tspan fontStyle="italic">x</tspan>-15)°</text>
    <text x="218" y="160" fill="#fbbf24" fontSize="13" fontFamily="serif">2<tspan fontStyle="italic">x</tspan></text>
    <text x="246" y="162" fill="#fbbf24" fontSize="13" fontFamily="serif">(5<tspan fontStyle="italic">x</tspan>+5)°</text>
  </svg>
);

// ── Soal 9: Triangle ABC, E above C, D right of B; ∠A=40°, (4x-5)° at C, 5x° exterior at B ──
const Soal9SVG = () => (
  <svg viewBox="0 0 380 260" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <defs><ArrowDef id="ar-s9" /></defs>
    {/* A-B-D horizontal */}
    <line x1="20" y1="220" x2="360" y2="220" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s9)" />
    {/* AC and CE collinear: A(40,220) -> C(160,80) -> E(200,33) */}
    <line x1="40" y1="220" x2="200" y2="33" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* BC: B(220,220) -> C(160,80) */}
    <line x1="220" y1="220" x2="160" y2="80" stroke="var(--icon-stroke)" strokeWidth="2" />

    <text x="32" y="240" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">A</text>
    <text x="212" y="240" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">B</text>
    <text x="350" y="240" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">D</text>
    <text x="144" y="82" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">C</text>
    <text x="206" y="30" fill="#38bdf8" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="bold">E</text>

    <text x="60" y="212" fill="#fbbf24" fontSize="13" fontFamily="serif">40°</text>
    <text x="175" y="94" fill="#fbbf24" fontSize="13" fontFamily="serif">(4<tspan fontStyle="italic">x</tspan>-5)°</text>
    <text x="232" y="212" fill="#fbbf24" fontSize="13" fontFamily="serif">5<tspan fontStyle="italic">x</tspan>°</text>
  </svg>
);

// ── Soal 13: Cyclic quadrilateral inscribed in a circle with α, β, δ, θ ──────
const Soal13SVG = () => (
  <svg viewBox="0 0 280 280" className="w-full max-w-xs mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <circle cx="140" cy="140" r="110" stroke="var(--icon-stroke)" strokeWidth="2" fill="none" />
    {/* Vertices on circle: α(left), θ(top-right), δ(right), β(bottom) */}
    {/* Polar angles: α≈180°, θ≈55°, δ≈340°, β≈260° */}
    {/* α: (30,140), θ: (203,50), δ: (243,178), β: (121,248) */}
    <polygon points="30,140 203,50 243,178 121,248" fill="none" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* Arcs at each vertex — span between the two adjacent polygon edges */}
    {/* α(30,140): edges to θ(NE, -27.5°) and β(SE, 49.9°), interior opens east */}
    <path d="M 49.5,129.9 A 22,22 0 0,1 44.2,156.8" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
    {/* θ(203,50): edges to δ(SE, 72.6°) and α(WSW, 152.5°), interior opens south-southwest */}
    <path d="M 209,69 A 20,20 0 0,1 185.3,59.2" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
    {/* δ(243,178): edges to β(WSW, 150.2°) and θ(NW, 252.6°), interior opens west */}
    <path d="M 225.6,188 A 20,20 0 0,1 237,158.9" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
    {/* β(121,248): edges to α(NW, 229.9°) and δ(NE, 330.2°), interior opens north */}
    <path d="M 106.6,231.4 A 22,22 0 0,1 140,237" fill="none" stroke="#fbbf24" strokeWidth="1.6" />

    <text x="56" y="148" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">α</text>
    <text x="184" y="86" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">θ</text>
    <text x="212" y="174" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">δ</text>
    <text x="120" y="224" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">β</text>

    <circle cx="30" cy="140" r="3" fill="#ef4444" />
    <circle cx="203" cy="50" r="3" fill="#ef4444" />
    <circle cx="243" cy="178" r="3" fill="#ef4444" />
    <circle cx="121" cy="248" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 14: Three crossing lines (triangle) with angles a, b, y (left) and x (right) ──
const Soal14SVG = () => {
  // Endpoints (chosen so intersections are exact):
  //   V (near-vertical): (177,25) → (125,270), passes (160,105) and (140,200)
  //   B (upper-left to right vertex): (35,72) → (390,165), passes (160,105)
  //   C (lower-left to right vertex): (30,215) → (390,165), passes (140,200)
  return (
    <svg viewBox="0 0 420 300" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
      {/* Pink shaded angle wedges (drawn first, beneath the lines) */}
      {/* Angle a at (160,105) — between V going down and B going right */}
      <path d="M 160 105 L 155.47 126.53 A 22 22 0 0 0 181.29 110.55 Z" fill="#fde2e2" stroke="none" />
      {/* Angle b at (140,200) — between V going up and C going right */}
      <path d="M 140 200 L 144.53 178.46 A 22 22 0 0 1 161.79 196.95 Z" fill="#fde2e2" stroke="none" />
      {/* Angle y at (140,200) — between V going down and C going left */}
      <path d="M 140 200 L 135.39 221.51 A 22 22 0 0 1 118.20 202.97 Z" fill="#fde2e2" stroke="none" />
      {/* Angle x at (390,165) — between B going left-up and C going left-down */}
      <path d="M 390 165 L 368.71 159.45 A 22 22 0 0 0 368.21 168.05 Z" fill="#fde2e2" stroke="none" />

      {/* Lines (dark navy) */}
      <line x1="177" y1="25"  x2="125" y2="270" stroke="#1e3a8a" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="35"  y1="72"  x2="390" y2="165" stroke="#1e3a8a" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="30"  y1="215" x2="390" y2="165" stroke="#1e3a8a" strokeWidth="2.2" strokeLinecap="round" />

      {/* Endpoint dots (red) */}
      <circle cx="177" cy="25"  r="3.5" fill="#b91c1c" />
      <circle cx="125" cy="270" r="3.5" fill="#b91c1c" />
      <circle cx="35"  cy="72"  r="3.5" fill="#b91c1c" />
      <circle cx="30"  cy="215" r="3.5" fill="#b91c1c" />
      <circle cx="390" cy="165" r="3.5" fill="#b91c1c" />

      {/* Angle labels (italic serif, dark navy) */}
      <text x="167" y="121" fill="#1e1b4b" fontSize="16" fontStyle="italic" fontFamily="'Times New Roman', serif">a</text>
      <text x="148" y="195" fill="#1e1b4b" fontSize="16" fontStyle="italic" fontFamily="'Times New Roman', serif">b</text>
      <text x="123" y="215" fill="#1e1b4b" fontSize="16" fontStyle="italic" fontFamily="'Times New Roman', serif">y</text>
      <text x="372" y="169" fill="#1e1b4b" fontSize="16" fontStyle="italic" fontFamily="'Times New Roman', serif">x</text>
    </svg>
  );
};

// ── Soal 15: 2 horizontal parallels l₁, l₂ cut by slanted transversal ────────
// Transversal: from (212,10) to (150,250). SVG y-down coordinates.
// Intersections: l₁ y=85 → x≈193; l₂ y=185 → x≈167
// Transversal up-unit from (193,85): toward (212,10) → (19,-75)/77.4 ≈ (0.245,-0.969)
// Transversal up-unit from (167,185): toward (193,85) → (26,-100)/103.3 ≈ (0.252,-0.968)
//
// Arc sweep rules (SVG y-down):
//   sweep=0 (CCW on screen) | sweep=1 (CW on screen)
//
// Top arc (x+39): centre≈(193,85), P1=(215,85) at 0°, P2≈(198,64) at 286° CW.
//   Short path = CCW 74° → sweep=0
// Bottom arc (2x – pelurus, upper-left): centre≈(167,185), P1=(145,185) at 180°,
//   P2≈(173,164) at 286° CW.  Short path = CW 106° → sweep=1
const Soal15SVG = () => (
  <svg viewBox="0 0 380 265" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    {/* l₁ and l₂ horizontal lines */}
    <line x1="30"  y1="85"  x2="335" y2="85"  stroke="var(--icon-stroke)" strokeWidth="2" />
    <line x1="30"  y1="185" x2="335" y2="185" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Transversal (slanted: lower-left → upper-right) */}
    <line x1="212" y1="10"  x2="150" y2="250" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* Labels */}
    <text x="342" y="91"  fill="#fbbf24" fontSize="14" fontFamily="serif" fontStyle="italic">l₁</text>
    <text x="342" y="191" fill="#fbbf24" fontSize="14" fontFamily="serif" fontStyle="italic">l₂</text>

    {/* Top intersection (193,85):
        P1 = l₁-right  (215, 85)  [angle 0°]
        P2 = transversal-up (198, 64)  [angle 286° CW ≡ 74° CCW]
        Short arc = CCW 74° → sweep=0 → traces upper-right quadrant ✓ */}
    <path d="M 215,85 A 22,22 0 0,0 198,64" fill="none" stroke="#22c55e" strokeWidth="1.8" />
    <text x="208" y="60" fill="#fbbf24" fontSize="13" fontFamily="serif">
      <tspan fontStyle="italic">x</tspan> + 39
    </text>

    {/* Bottom intersection (167,185) – pelurus (sudut dalam kiri atas):
        P1 = l₂-left   (145,185)  [angle 180°]
        P2 = transversal-up (173,164)  [angle 286° CW]
        Short arc = CW 106° → sweep=1 → traces upper-left quadrant ✓ */}
    <path d="M 145,185 A 22,22 0 0,1 173,164" fill="none" stroke="#22c55e" strokeWidth="1.8" />
    <text x="120" y="170" fill="#fbbf24" fontSize="13" fontFamily="serif">
      2<tspan fontStyle="italic">x</tspan>
    </text>

    {/* Red endpoint dots */}
    <circle cx="212" cy="10"  r="4" fill="#ef4444" />
    <circle cx="150" cy="250" r="4" fill="#ef4444" />
    <circle cx="30"  cy="85"  r="4" fill="#ef4444" />
    <circle cx="335" cy="85"  r="4" fill="#ef4444" />
    <circle cx="30"  cy="185" r="4" fill="#ef4444" />
    <circle cx="335" cy="185" r="4" fill="#ef4444" />
  </svg>
);

// ── Soal 16: Two intersecting lines forming X with p, q, r, s ────────────────
const Soal16SVG = () => (
  <svg viewBox="0 0 420 240" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="60" x2="400" y2="180" stroke="var(--icon-stroke)" strokeWidth="2" />
    <line x1="20" y1="180" x2="400" y2="60" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* Center ≈ (210, 120) */}
    <circle cx="210" cy="120" r="3.5" fill="#ef4444" />

    <text x="206" y="100" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">p</text>
    <text x="240" y="124" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">q</text>
    <text x="206" y="148" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">r</text>
    <text x="170" y="124" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">s</text>
  </svg>
);

// ── Soal 17: Cube ABCD.EFGH with diagonals BG, GE, EB highlighted ────────────
const Soal17SVG = () => {
  // Cube vertices (front face A,B,F,E; back face D,C,G,H; depth offset = (-50,-40))
  const A = [80, 220], B = [220, 220], C = [270, 180], D = [130, 180];
  const E = [80, 100], F = [220, 100], G = [270, 60], H = [130, 60];
  return (
    <svg viewBox="0 0 320 280" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
      {/* Hidden edges (DA, DC, DH dashed) */}
      <line x1={D[0]} y1={D[1]} x2={A[0]} y2={A[1]} stroke="var(--icon-stroke)" strokeWidth="1.5" strokeDasharray="5,4" />
      <line x1={D[0]} y1={D[1]} x2={C[0]} y2={C[1]} stroke="var(--icon-stroke)" strokeWidth="1.5" strokeDasharray="5,4" />
      <line x1={D[0]} y1={D[1]} x2={H[0]} y2={H[1]} stroke="var(--icon-stroke)" strokeWidth="1.5" strokeDasharray="5,4" />

      {/* Visible edges */}
      <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke="var(--icon-stroke)" strokeWidth="2" />
      <line x1={B[0]} y1={B[1]} x2={C[0]} y2={C[1]} stroke="var(--icon-stroke)" strokeWidth="2" />
      <line x1={A[0]} y1={A[1]} x2={E[0]} y2={E[1]} stroke="var(--icon-stroke)" strokeWidth="2" />
      <line x1={B[0]} y1={B[1]} x2={F[0]} y2={F[1]} stroke="var(--icon-stroke)" strokeWidth="2" />
      <line x1={C[0]} y1={C[1]} x2={G[0]} y2={G[1]} stroke="var(--icon-stroke)" strokeWidth="2" />
      <line x1={E[0]} y1={E[1]} x2={F[0]} y2={F[1]} stroke="var(--icon-stroke)" strokeWidth="2" />
      <line x1={F[0]} y1={F[1]} x2={G[0]} y2={G[1]} stroke="var(--icon-stroke)" strokeWidth="2" />
      <line x1={G[0]} y1={G[1]} x2={H[0]} y2={H[1]} stroke="var(--icon-stroke)" strokeWidth="2" />
      <line x1={H[0]} y1={H[1]} x2={E[0]} y2={E[1]} stroke="var(--icon-stroke)" strokeWidth="2" />

      {/* Diagonals BG, GE, EB highlighted */}
      <line x1={B[0]} y1={B[1]} x2={G[0]} y2={G[1]} stroke="#ef4444" strokeWidth="2.4" />
      <line x1={G[0]} y1={G[1]} x2={E[0]} y2={E[1]} stroke="#ef4444" strokeWidth="2.4" />
      <line x1={E[0]} y1={E[1]} x2={B[0]} y2={B[1]} stroke="#ef4444" strokeWidth="2.4" />

      {/* Vertex labels */}
      <text x={A[0] - 14} y={A[1] + 15} fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">A</text>
      <text x={B[0] + 4} y={B[1] + 15} fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">B</text>
      <text x={C[0] + 6} y={C[1] + 4} fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">C</text>
      <text x={D[0] - 4} y={D[1] - 4} fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">D</text>
      <text x={E[0] - 14} y={E[1] - 4} fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">E</text>
      <text x={F[0] - 4} y={F[1] - 4} fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">F</text>
      <text x={G[0] + 4} y={G[1] - 2} fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">G</text>
      <text x={H[0] - 4} y={H[1] - 4} fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">H</text>
    </svg>
  );
};

// ── Soal 18: Cross at O with right angle, 7x° between vertical-up & diag,2x° between horiz-left & diag ──
// O = (200,140). Diagonal AB passes through O: A(40,180)→B(360,100).
// Diagonal angle from horizontal ≈ 14° above (slope -80/320 = -0.25).
// Quadrant I  (upper-right): 7x — between vertical-up and diagonal-toward-B
// Quadrant II (upper-left) : right-angle marker — between vertical-up and horizontal-left
// Quadrant III(lower-left) : 2x — between diagonal-toward-A and horizontal-left
const Soal18SVG = () => (
  <svg viewBox="0 0 380 240" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="140" x2="360" y2="140" stroke="var(--icon-stroke)" strokeWidth="2" />
    <line x1="200" y1="20" x2="200" y2="220" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Diagonal A(lower-left) → B(upper-right) through O(200,140) */}
    <line x1="40" y1="180" x2="360" y2="100" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* Right-angle marker in quadrant II (upper-left of O):
        vertical-up point (200,126) → left (186,126) → horizontal-left point (186,140) */}
    <polyline points="200,126 186,126 186,140" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" />

    {/* O label — slightly right and below intersection */}
    <text x="204" y="155" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif" fontWeight="bold">O</text>
    <text x="28"  y="198" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">A</text>
    <text x="346" y="96"  fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">B</text>

    {/* 7x in quadrant I (upper-right): moved down closer to the angle */}
    <text x="210" y="122" fill="#fbbf24" fontSize="13" fontFamily="serif">7<tspan fontStyle="italic">x</tspan>°</text>

    {/* 2x in quadrant III (lower-left): moved down away from the diagonal line above */}
    <text x="108" y="158" fill="#fbbf24" fontSize="13" fontFamily="serif">2<tspan fontStyle="italic">x</tspan>°</text>

    <circle cx="200" cy="140" r="3" fill="#ef4444" />
    <circle cx="40"  cy="180" r="3" fill="#ef4444" />
    <circle cx="360" cy="100" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 19 ────────────────────────────────────────────────────────────────────
// Geometry (viewBox 0 0 400 270):
//   P  = (220, 80)  — upper crossing of the two diagonals
//   L  = (75, 200)  — Diag1 meets the horizontal baseline
//   R  = (310, 200) — Diag2 meets the horizontal baseline
//
//   Diag1 (lower-left ↔ upper-right): (0,262) → (299,15)  unit dir=(0.770,−0.637)
//   Diag2 (upper-left ↔ lower-right): (171,15) → (359,265) unit dir=(0.600, 0.800)
//
// Angle sectors (r=22):
//   b  at P — blue,   RIGHT pocket: Diag1-upright(237,66) → Diag2-downright(233,98) CW (sweep=1, ~93°)
//   x  at L — green,  large angle: horiz-RIGHT (97,200) → Diag1-downleft (58,214) CW (sweep=1, ~140°)
//   a  at R — pink,   small angle: Diag2-upleft (297,182) → horiz-left (288,200) CCW (sweep=0)
//   y  at R — purple, LEFT-below pocket: Diag2-downright(323,218) → horiz-left(288,200) CW (sweep=1, ~127°)
const Soal19SVG = () => {
  const { isDark } = useTheme();

  // Lines: bright on space/dark themes, dark navy on light themes
  const lineColor  = isDark ? "#93c5fd" : "#1e3a8a";
  const line2Color = isDark ? "#bfdbfe" : "#2563eb";
  const dotColor   = isDark ? "#f87171" : "#dc2626";

  // Labels: light/vivid on dark, deep/saturated on light
  const lblB = isDark ? "#93c5fd" : "#1d4ed8";
  const lblX = isDark ? "#86efac" : "#15803d";
  const lblA = isDark ? "#fca5a5" : "#b91c1c";
  const lblY = isDark ? "#d8b4fe" : "#7e22ce";

  // Sector fills: lighter tint on dark (more visible against dark bg)
  const fillB = isDark ? "rgba(147,197,253,0.55)" : "rgba(59,130,246,0.45)";
  const fillX = isDark ? "rgba(134,239,172,0.50)" : "rgba(34,197,94,0.40)";
  const fillA = isDark ? "rgba(252,165,165,0.55)" : "rgba(239,68,68,0.40)";
  const fillY = isDark ? "rgba(216,180,254,0.55)" : "rgba(168,85,247,0.40)";

  return (
    <svg viewBox="0 0 400 270" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
      {/* ── Filled angle sectors (drawn first, behind lines) ── */}

      {/* b — blue sector at P(220,80): RIGHT pocket Diag1-upright(237,66) → Diag2-downright(233,98) CW */}
      <path d="M 237,66 A 22,22 0 0,1 233,98 L 220,80 Z"
        fill={fillB} stroke={lblB} strokeWidth="1.5" />

      {/* x — green sector at L(75,200): horiz-right(97,200) → Diag1-downleft(58,214) CW ~140° */}
      <path d="M 97,200 A 22,22 0 0,1 58,214 L 75,200 Z"
        fill={fillX} stroke={lblX} strokeWidth="1.5" />

      {/* a — pink sector at R(310,200): Diag2-upleft(297,182) → horiz-left(288,200) CCW */}
      <path d="M 297,182 A 22,22 0 0,0 288,200 L 310,200 Z"
        fill={fillA} stroke={lblA} strokeWidth="1.5" />

      {/* y — purple sector at R(310,200): LEFT-below pocket Diag2-downright(323,218) → horiz-left(288,200) CW */}
      <path d="M 323,218 A 22,22 0 0,1 288,200 L 310,200 Z"
        fill={fillY} stroke={lblY} strokeWidth="1.5" />

      {/* ── Lines ── */}
      {/* Horizontal baseline */}
      <line x1="15"  y1="200" x2="385" y2="200" stroke={lineColor}  strokeWidth="2.5" />
      {/* Diag1: lower-left → upper-right (through L and P) */}
      <line x1="0"   y1="262" x2="299" y2="15"  stroke={lineColor}  strokeWidth="2.5" />
      {/* Diag2: upper-left → lower-right (through P and R) */}
      <line x1="171" y1="15"  x2="359" y2="265" stroke={line2Color} strokeWidth="2.5" />

      {/* ── Vertex dots ── */}
      <circle cx="220" cy="80"  r="4" fill={dotColor} />
      <circle cx="75"  cy="200" r="4" fill={dotColor} />
      <circle cx="310" cy="200" r="4" fill={dotColor} />

      {/* ── Labels ── */}
      {/* b: right of P, inside the right pocket */}
      <text x="244" y="86"  fill={lblB} fontSize="16" fontStyle="italic" fontWeight="bold" fontFamily="'Times New Roman',serif">b</text>
      {/* x: centered at bisector of the green sector (midpoint ~70° CW from right, r=32 from L) */}
      <text x="82"  y="232" fill={lblX} fontSize="16" fontStyle="italic" fontWeight="bold" fontFamily="'Times New Roman',serif">x</text>
      {/* a: above the pink sector at R */}
      <text x="277" y="194" fill={lblA} fontSize="14" fontStyle="italic" fontFamily="'Times New Roman',serif">a</text>
      {/* y: lower-left of R, inside the left-below pocket */}
      <text x="272" y="226" fill={lblY} fontSize="16" fontStyle="italic" fontWeight="bold" fontFamily="'Times New Roman',serif">y</text>
    </svg>
  );
};

// ── Soal 20: AB ∥ CD; right-angle perpendicular + x-ray at A; 2x RIGHT of A; 120° at C ──
// Geometry (viewBox 0 0 480 230):
//   A=(80,80)  B_actual=(306,80) [label at B_actual]  C=(240,195)  D=(15,195)
//   Diagonal: A(80,80) → midpoint of DC (146,195) [dir (0.5,0.866), 60° below AB-right]
//   2x sector RIGHT side: AB-right(102,80) → diag-dir(91,99) CW 60° → x=30° ✓
//   BC: CB dir (0.5,−0.866) → interior angle at C = 120° CCW to CD-left ✓
//   Perpendicular at A: straight up to (80,35); x-ray at 30° left of perp → (53,32)
//   Sectors r=22 at A; r=26 at C
const Soal20SVG = () => {
  const { isDark } = useTheme();
  const lineColor = isDark ? "#93c5fd" : "#1e3a8a";
  const ptColor   = isDark ? "#f87171" : "#dc2626";
  const lblColor  = isDark ? "#93c5fd" : "#1e3a8a";
  const fillG     = isDark ? "rgba(134,239,172,0.55)" : "rgba(21,128,61,0.40)";
  const strkG     = isDark ? "#86efac" : "#15803d";
  const txtG      = isDark ? "#86efac" : "#15803d";
  return (
    <svg viewBox="0 0 480 230" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
      {/* ── Angle sectors (drawn behind lines) ── */}

      {/* x — 30° CCW from perp-up(80,58) to x-ray(69,61) */}
      <path d="M 80,58 A 22,22 0 0,0 69,61 L 80,80 Z"
        fill={fillG} stroke={strkG} strokeWidth="1" />

      {/* 2x — 60° CW from diag-right(91,99) to AD-left(69,99) — area DAC below AB */}
      <path d="M 91,99 A 22,22 0 0,1 69,99 L 80,80 Z"
        fill={fillG} stroke={strkG} strokeWidth="1.2" />

      {/* 120° — CCW from CB-dir(253,173) through top to CD-left(214,195) */}
      <path d="M 253,173 A 26,26 0 0,0 214,195 L 240,195 Z"
        fill={fillG} stroke={strkG} strokeWidth="1.2" />

      {/* ── Lines ── */}
      {/* Full-width top line AB */}
      <line x1="0"   y1="80"  x2="480" y2="80"  stroke={lineColor} strokeWidth="2.2" />
      {/* Full-width bottom line DC */}
      <line x1="0"   y1="195" x2="480" y2="195" stroke={lineColor} strokeWidth="2.2" />
      {/* AD: A(80,80) → D(15,195) */}
      <line x1="80"  y1="80"  x2="15"  y2="195" stroke={lineColor} strokeWidth="2" />
      {/* BC: B_actual(306,80) → C(240,195) */}
      <line x1="306" y1="80"  x2="240" y2="195" stroke={lineColor} strokeWidth="2" />
      {/* Diagonal A → midpoint of DC (146,195) [60° below AB-right, 2x=60°] */}
      <line x1="80"  y1="80"  x2="146" y2="195" stroke={lineColor} strokeWidth="2" />
      {/* Perpendicular at A going straight up */}
      <line x1="80"  y1="80"  x2="80"  y2="35"  stroke={lineColor} strokeWidth="2" />
      {/* x-ray: 30° left of perpendicular, dir=(−0.5,−0.866) */}
      <line x1="80"  y1="80"  x2="53"  y2="32"  stroke={lineColor} strokeWidth="2" />

      {/* ── Right angle marker at A (between AB-right and perpendicular-up) ── */}
      <polyline points="92,80 92,68 80,68" fill="none" stroke={lineColor} strokeWidth="1.5" />

      {/* ── Vertex dots ── */}
      <circle cx="80"  cy="80"  r="3.5" fill={ptColor} />
      <circle cx="240" cy="195" r="3.5" fill={ptColor} />

      {/* ── Vertex labels ── */}
      {/* A: shifted left to avoid collision with lines */}
      <text x="52"  y="76"  fill={lblColor} fontSize="14" fontStyle="italic" fontWeight="bold" fontFamily="'Times New Roman',serif">A</text>
      {/* B: at the B_actual intersection (306,80) */}
      <text x="308" y="76"  fill={lblColor} fontSize="14" fontStyle="italic" fontWeight="bold" fontFamily="'Times New Roman',serif">B</text>
      <text x="6"   y="212" fill={lblColor} fontSize="14" fontStyle="italic" fontWeight="bold" fontFamily="'Times New Roman',serif">D</text>
      <text x="244" y="212" fill={lblColor} fontSize="14" fontStyle="italic" fontWeight="bold" fontFamily="'Times New Roman',serif">C</text>

      {/* ── Angle labels ── */}
      {/* x: bisector between perp and x-ray above AB */}
      <text x="70"  y="54"  fill={txtG} fontSize="12" fontStyle="italic" fontFamily="'Times New Roman',serif">x</text>
      {/* 2x: bisector of DAC sector, straight down from A */}
      <text x="73"  y="120" fill={txtG} fontSize="13" fontFamily="'Times New Roman',serif">2<tspan fontStyle="italic">x</tspan></text>
      {/* 120°: inside sector at C */}
      <text x="205" y="163" fill={txtG} fontSize="12" fontFamily="'Times New Roman',serif">120°</text>
    </svg>
  );
};

// ── Soal 21: Right angle at Q, ray QS between QP (up) and QR (right) ─────────
// Q=(200,180); P=(200,20) up; R=right; S=298,119 at 32° above horizontal
// Right-angle marker on LEFT side; arcs at different radii so they look separate
const Soal21SVG = () => (
  <svg viewBox="0 0 400 290" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    {/* Horizontal line: full width */}
    <line x1="20" y1="180" x2="375" y2="180" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Vertical PQ */}
    <line x1="200" y1="20" x2="200" y2="180" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Diagonal QS: 32° above horizontal */}
    <line x1="200" y1="180" x2="298" y2="119" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* Right-angle marker — moved to LEFT side (between QP-up and left-horizontal) */}
    <polyline points="200,160 180,160 180,180" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" />

    {/* Labels */}
    <text x="192" y="14"  fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">P</text>
    <text x="184" y="202" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">Q</text>
    <text x="358" y="174" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">R</text>
    <text x="302" y="113" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">S</text>

    {/* Arc ∠SQR (3x+5)°: r=35, from QR-right(235,180) → QS-dir(230,162) CCW */}
    <path d="M 235,180 A 35,35 0 0,0 230,162" fill="none" stroke="#a855f7" strokeWidth="2.4" />
    {/* Label at bisector 16°, r=44 from Q — just outside the arc */}
    <text x="241" y="169" fill="#a855f7" fontSize="11" fontFamily="serif">(3<tspan fontStyle="italic">x</tspan>+5)°</text>

    {/* Arc ∠PQS (6x+4)°: r=52, from QS-dir(244,152) → QP-up(200,128) CCW */}
    <path d="M 244,152 A 52,52 0 0,0 200,128" fill="none" stroke="#ef4444" strokeWidth="2.4" />
    {/* Label at bisector 61°, r=63 from Q — just outside the arc */}
    <text x="224" y="127" fill="#ef4444" fontSize="11" fontFamily="serif">(6<tspan fontStyle="italic">x</tspan>+4)°</text>

    {/* Dot at Q */}
    <circle cx="200" cy="180" r="3" fill="#facc15" />
  </svg>
);

// ── Soal 22: Two parallel lines l, m with diagonal & triangle (1..6 angles) ──
const Soal22SVG = () => (
  <svg viewBox="0 0 400 300" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <defs><ArrowDef id="ar-s22" /></defs>
    {/* Top horizontal l */}
    <line x1="20" y1="80" x2="380" y2="80" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s22)" />
    {/* Bottom horizontal m */}
    <line x1="20" y1="240" x2="380" y2="240" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s22)" />
    {/* Diagonal from upper-left going down-right, crossing both lines */}
    <line x1="200" y1="20" x2="120" y2="290" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Triangle: from (170, 130) on diagonal go to point on bottom line */}
    <line x1="170" y1="130" x2="320" y2="240" stroke="var(--icon-stroke)" strokeWidth="2" />

    <text x="364" y="74" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">l</text>
    <text x="364" y="234" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">m</text>

    {/* Numbers at top intersection ≈ (180, 80) */}
    <text x="192" y="74" fill="#38bdf8" fontSize="13" fontWeight="bold">4</text>
    <text x="156" y="98" fill="#38bdf8" fontSize="13" fontWeight="bold">1</text>

    {/* Numbers at triangle apex (170, 130) */}
    <text x="174" y="124" fill="#38bdf8" fontSize="13" fontWeight="bold">2</text>
    <text x="172" y="148" fill="#38bdf8" fontSize="13" fontWeight="bold">6</text>

    {/* Numbers at bottom intersection of diagonal & m ≈ (138, 240) */}
    <text x="148" y="234" fill="#38bdf8" fontSize="13" fontWeight="bold">5</text>
    {/* 3 inside triangle near bottom-right */}
    <text x="282" y="234" fill="#38bdf8" fontSize="13" fontWeight="bold">3</text>

    <circle cx="180" cy="80" r="3" fill="#ef4444" />
    <circle cx="138" cy="240" r="3" fill="#ef4444" />
    <circle cx="320" cy="240" r="3" fill="#ef4444" />
    <circle cx="170" cy="130" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 23: Triangle ABC with D on extension of AC; ∠C=108° ext, ∠B=36° ────
const Soal23SVG = () => (
  <svg viewBox="0 0 380 280" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    {/* AB horizontal */}
    <line x1="40" y1="240" x2="340" y2="240" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* AD diagonal through C */}
    <line x1="40" y1="240" x2="220" y2="20" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* BC: B(300,240) -> C at intersection with AD ≈ (166,87) */}
    <line x1="300" y1="240" x2="166" y2="87" stroke="var(--icon-stroke)" strokeWidth="2" />

    <text x="32" y="262" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">A</text>
    <text x="304" y="262" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">B</text>
    <text x="144" y="84" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">C</text>
    <text x="226" y="22" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">D</text>

    {/* 108° shifted to upper-right of C to avoid collision */}
    <text x="182" y="90" fill="#fbbf24" fontSize="13" fontFamily="serif">108°</text>
    {/* 36° at B (interior) */}
    <text x="262" y="232" fill="#fbbf24" fontSize="13" fontFamily="serif">36°</text>

    <circle cx="166" cy="87" r="3" fill="#ef4444" />
    <circle cx="40" cy="240" r="3" fill="#ef4444" />
    <circle cx="300" cy="240" r="3" fill="#ef4444" />
    <circle cx="220" cy="20" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 24: Parallelogram SPQR with PT (through U) and QT to T below; x at U ──
// Soal 24: parallelogram S(40,180)-P(140,40)-Q(380,40)-R(280,180)
// QRT collinear: Q→R→T where T=(180,320) [R is midpoint of QT, direction (-100,140) per unit]
// PT crosses SR at U=(160,180); angle x = ∠RUT ≈ 82° in lower-right area
const Soal24SVG = () => (
  <svg viewBox="0 0 440 360" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    {/* Top side PQ */}
    <line x1="140" y1="40" x2="380" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Left side PS */}
    <line x1="140" y1="40" x2="40" y2="180" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Bottom side SR */}
    <line x1="40" y1="180" x2="280" y2="180" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* QRT: Q→T passing through R(280,180) — one continuous collinear line */}
    <line x1="380" y1="40" x2="180" y2="320" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Diagonal PT: P(140,40)→T(180,320) passing through U(160,180) */}
    <line x1="140" y1="40" x2="180" y2="320" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* Labels */}
    <text x="22"  y="194" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">S</text>
    <text x="130" y="34"  fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">P</text>
    <text x="384" y="34"  fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">Q</text>
    <text x="284" y="196" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">R</text>
    <text x="165" y="338" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">T</text>
    {/* U: lower-left of intersection, away from angle x area (upper-right) */}
    <text x="140" y="196" fill="#38bdf8" fontSize="13" fontStyle="italic" fontFamily="serif" fontWeight="bold">U</text>

    {/* Filled wedge for x = ∠PUR at U(160,180) */}
    {/* UR direction: right → (182,180); UP direction: (-20,-140)/141.4 at r=22 → (157,158) */}
    {/* Arc goes CCW on screen (sweep=0) from UR to UP, spanning ≈98°, upper-right area */}
    <path d="M 160,180 L 182,180 A 22,22 0 0,0 157,158 Z"
          fill="#fbbf24" fillOpacity="0.25" stroke="#fbbf24" strokeWidth="1.8" />
    {/* Label at bisector ~49° CCW from UR, r=30 from U */}
    <text x="178" y="156" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">x</text>

    <circle cx="160" cy="180" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 25: Horizontal line with one ray going up; angles x (left) y (right) ──
const Soal25SVG = () => (
  <svg viewBox="0 0 400 200" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="160" x2="380" y2="160" stroke="var(--icon-stroke)" strokeWidth="2" />
    <line x1="220" y1="160" x2="170" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* x arc: from left-horizontal (185,160) clockwise up to ray direction (207,128); r=35 */}
    <path d="M 185,160 A 35,35 0 0,1 207,128" fill="none" stroke="#38bdf8" strokeWidth="1.8" />
    <text x="191" y="153" fill="#38bdf8" fontSize="14" fontStyle="italic" fontFamily="serif">x</text>

    {/* y arc: from ray direction (207,128) clockwise down to right-horizontal (255,160); r=35 */}
    <path d="M 207,128 A 35,35 0 0,1 255,160" fill="none" stroke="#fbbf24" strokeWidth="1.8" />
    <text x="229" y="151" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">y</text>

    <circle cx="220" cy="160" r="3" fill="var(--icon-color)" />
  </svg>
);

// ── Soal 26: Two parallel lines AD (top), EG (bottom); triangle B-F-C ────────
const Soal26SVG = () => (
  <svg viewBox="0 0 400 240" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <ArrowDef id="ar-s26-l" color="#ffffff" />
      <marker id="ar-s26-l-start" markerWidth="8" markerHeight="8" refX="1" refY="4" orient="auto">
        <path d="M 7 0 L 0 4 L 7 8 Z" fill="var(--icon-color)" />
      </marker>
    </defs>
    {/* Top line AD */}
    <line x1="20" y1="60" x2="380" y2="60" stroke="var(--icon-stroke)" strokeWidth="2" markerStart="url(#ar-s26-l-start)" markerEnd="url(#ar-s26-l)" />
    {/* Bottom line EG */}
    <line x1="20" y1="200" x2="380" y2="200" stroke="var(--icon-stroke)" strokeWidth="2" markerStart="url(#ar-s26-l-start)" markerEnd="url(#ar-s26-l)" />
    {/* B-F */}
    <line x1="120" y1="60" x2="200" y2="200" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* C-F */}
    <line x1="280" y1="60" x2="200" y2="200" stroke="var(--icon-stroke)" strokeWidth="2" />

    <text x="20" y="50" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">A</text>
    <text x="116" y="50" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">B</text>
    <text x="276" y="50" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">C</text>
    <text x="364" y="50" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">D</text>
    <text x="20" y="222" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">E</text>
    <text x="194" y="222" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">F</text>
    <text x="364" y="222" fill="#38bdf8" fontSize="15" fontStyle="italic" fontFamily="serif" fontWeight="bold">G</text>

    <circle cx="120" cy="60" r="3" fill="#ef4444" />
    <circle cx="280" cy="60" r="3" fill="#ef4444" />
    <circle cx="200" cy="200" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 27: Two parallels with zigzag; 30° top, a° middle, 50° bottom ───────
const Soal27SVG = () => (
  <svg viewBox="0 0 380 280" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <defs><ArrowDef id="ar-s27" /></defs>
    <line x1="40" y1="40" x2="360" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s27)" />
    <line x1="40" y1="240" x2="360" y2="240" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s27)" />
    {/* Zigzag: top point (90,40) -> middle vertex (240,140) -> bottom (90,240) */}
    <line x1="90" y1="40" x2="240" y2="140" stroke="var(--icon-stroke)" strokeWidth="2" />
    <line x1="240" y1="140" x2="90" y2="240" stroke="var(--icon-stroke)" strokeWidth="2" />

    <text x="122" y="56" fill="#fbbf24" fontSize="13" fontFamily="serif">30°</text>
    <text x="206" y="148" fill="#fbbf24" fontSize="13" fontFamily="serif"><tspan fontStyle="italic">a</tspan>°</text>
    <text x="124" y="232" fill="#fbbf24" fontSize="13" fontFamily="serif">50°</text>

    <circle cx="90" cy="40" r="3" fill="#ef4444" />
    <circle cx="240" cy="140" r="3" fill="#ef4444" />
    <circle cx="90" cy="240" r="3" fill="#ef4444" />
  </svg>
);

// ── Soal 28: Two parallels with triangle apex; 30° top, x apex, 110° bottom ──
const Soal28SVG = () => (
  <svg viewBox="0 0 380 260" className="w-full max-w-md mx-auto" style={{ background: "transparent" }} xmlns="http://www.w3.org/2000/svg">
    <defs><ArrowDef id="ar-s28" /></defs>
    {/* Top horizontal */}
    <line x1="40" y1="60" x2="360" y2="60" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s28)" />
    {/* Bottom horizontal */}
    <line x1="40" y1="220" x2="360" y2="220" stroke="var(--icon-stroke)" strokeWidth="2" markerEnd="url(#ar-s28)" />
    {/* Long diagonal from lower-left up-right (passes from (60,220) up to (300,40)) */}
    <line x1="60" y1="220" x2="300" y2="40" stroke="var(--icon-stroke)" strokeWidth="2" />
    {/* Short top segment forming the small triangle: from (130, 60) down-right to apex (200, 130) */}
    <line x1="130" y1="60" x2="200" y2="130" stroke="var(--icon-stroke)" strokeWidth="2" />

    {/* 30° at top - moved right to clear short segment line */}
    <text x="156" y="78" fill="#fbbf24" fontSize="13" fontFamily="serif">30°</text>
    {/* x at left supplementary angle of apex (~191,121) */}
    <text x="176" y="124" fill="#fbbf24" fontSize="14" fontStyle="italic" fontFamily="serif">x</text>
    {/* 110° at bottom-left - moved right to clear diagonal line */}
    <text x="92" y="208" fill="#fbbf24" fontSize="13" fontFamily="serif">110°</text>
  </svg>
);

const latihanDasar: LatihanSoal[] = [
  {
    no: 1, type: "pg",
    soal: "Perhatikan gambar.\n\nBesar $\\angle KLM$ adalah …",
    gambar: <Soal1SVG />,
    options: ["A. $15°$", "B. $30°$", "C. $42°$", "D. $60°$"],
    jawaban: "B",
    pembahasan: "Konsep: sifat sudut dalam segitiga (jumlah $=180°$) dan sudut berpelurus digunakan bersama untuk mencari sudut yang ditanya.\n\n1. Perhatikan segitiga KLM dan gunakan sifat sudut dalam segitiga: $\\angle K + \\angle L + \\angle M = 180°$.\n2. Gunakan sifat sudut berpelurus pada garis bantu untuk menyatakan sudut yang tidak diketahui.\n3. Substitusi nilai sudut yang diketahui dan selesaikan untuk mendapatkan $\\angle KLM = 30°$.\n\nRumus: $\\angle K + \\angle L + \\angle M = 180°$\n\nJawaban: B",
  },
  {
    no: 2, type: "pg",
    soal: "Perhatikan gambar berikut!\n\nPerhatikan pernyataan berikut!\n(i) Sudut 1 dan sudut 7, sudut luar berseberangan\n(ii) Sudut 1 dan sudut 6, sudut luar sepihak\n(iii) Sudut 4 dan sudut 6, sudut bertolak belakang\n(iv) Sudut 3 dan sudut 7, sudut sehadap\n\nPernyataan yang benar adalah ….",
    gambar: <Soal2SVG />,
    options: ["A. (i) dan (ii) saja", "B. (ii) dan (iv) saja", "C. (i), (ii) dan (iii)", "D. (i), (ii) dan (iv)"],
    jawaban: "D",
    pembahasan: "Konsep: pada dua garis sejajar yang dipotong transversal terbentuk 8 sudut dengan berbagai hubungan: sehadap, luar berseberangan, luar sepihak, dan bertolak belakang.\n\n(i) Sudut 1 dan 7 berada di luar dan saling bersilangan ⇒ sudut luar berseberangan ✓\n(ii) Sudut 1 dan 6 sama-sama di luar dan di sisi yang sama dari transversal ⇒ sudut luar sepihak ✓\n(iii) Sudut 4 dan 6 berbeda sisi di antara dua garis sejajar ⇒ sudut dalam berseberangan, BUKAN bertolak belakang ✗\n(iv) Sudut 3 dan 7 menempati posisi serupa pada masing-masing garis ⇒ sudut sehadap ✓\n\nPernyataan benar: (i), (ii), dan (iv).\n\nJawaban: D",
  },
  {
    no: 3, type: "pg",
    soal: "Perhatikan gambar\n\n$\\angle A_1 = 103°$, maka besar $\\angle B_4$ dan $\\angle A_3$ berturut-turut adalah …",
    gambar: <Soal3SVG />,
    options: ["A. $13°$ dan $90°$", "B. $90°$ dan $130°$", "C. $77°$ dan $103°$", "D. $103°$ dan $77°$"],
    jawaban: "D",
    pembahasan: "Konsep: sudut sehadap pada dua garis sejajar besarnya sama; sudut berpelurus berjumlah $180°$.\n\n1. Karena dua garis sejajar dipotong transversal, $\\angle B_4$ sehadap dengan $\\angle A_1$, sehingga $\\angle B_4 = \\angle A_1 = 103°$.\n2. $\\angle A_3$ berpelurus dengan $\\angle A_1$: $\\angle A_3 = 180° - 103° = 77°$.\n\nRumus: sehadap = sama besar; berpelurus = berjumlah $180°$\n\nJawaban: D",
  },
  {
    no: 4, type: "pg",
    soal: "Perhatikan gambar\n\nBesar $\\angle BCF$ adalah ….",
    gambar: <Soal4SVG />,
    options: ["A. $35°$", "B. $45°$", "C. $60°$", "D. $75°$"],
    jawaban: "D",
    pembahasan: "Konsep: gunakan sudut sehadap/berseberangan untuk memindahkan sudut diketahui, lalu selesaikan dengan sifat jumlah sudut segitiga.\n\n1. Identifikasi pasangan sudut sehadap/berseberangan pada gambar untuk memindahkan sudut yang diketahui ke titik C atau F.\n2. Gunakan jumlah sudut pada segitiga atau sudut berpelurus untuk menghitung $\\angle BCF$.\n3. Diperoleh $\\angle BCF = 75°$.\n\nRumus: sudut berseberangan dalam (sama besar) dan $\\angle A + \\angle B + \\angle C = 180°$\n\nJawaban: D",
  },
  {
    no: 5, type: "pg",
    soal: "Perhatikan gambar\n\nDiketahui besar $\\angle CBD = (2x + 5)°$ dan $\\angle ABD = (3x - 25)°$. Besar pelurus sudut CBD adalah ...",
    gambar: <Soal5SVG />,
    options: ["A. $82°$", "B. $85°$", "C. $95°$", "D. $104°$"],
    jawaban: "C",
    pembahasan: "Konsep: dua sudut berpelurus berjumlah $180°$; susun persamaan linear dari ekspresi sudut yang diberikan.\n\n1. $\\angle ABD$ dan $\\angle CBD$ saling berpelurus: $(3x-25)° + (2x+5)° = 180°$\n2. $5x - 20 = 180 \\Rightarrow 5x = 200 \\Rightarrow x = 40$\n3. $\\angle CBD = (2 \\times 40 + 5)° = 85°$\n4. Pelurus $\\angle CBD = 180° - 85° = 95°$\n\nRumus: sudut berpelurus $\\alpha + \\beta = 180°$\n\nJawaban: C",
  },
  {
    no: 6, type: "pg",
    soal: "Pelurus suatu sudut besarnya 3 kali sudut tersebut. Besar sudut tersebut adalah…",
    options: ["A. $15°$", "B. $30°$", "C. $45°$", "D. $60°$"],
    jawaban: "C",
    pembahasan: "Konsep: pelurus (suplemen) dua sudut berjumlah $180°$; susun persamaan dari perbandingan yang diketahui.\n\n1. Misalkan sudut tersebut $=x°$, maka pelurusnya $=(180-x)°$.\n2. Diketahui pelurus $=3\\times$ sudut: $(180-x)=3x$\n3. $180=4x \\Rightarrow x=45°$\n\nRumus: pelurus $=180°-x$\n\nJawaban: C",
  },
  {
    no: 7, type: "pg",
    soal: "Perhatikan gambar berikut.\n\nDari gambar di atas besar $\\angle QPR$ adalah ..",
    gambar: <Soal7SVG />,
    options: ["A. $18°$", "B. $36°$", "C. $45°$", "D. $54°$"],
    jawaban: "B",
    pembahasan: "Konsep: gabungkan sifat sudut berpelurus dan jumlah sudut dalam segitiga untuk mencari $\\angle QPR$.\n\n1. Tandai sudut-sudut yang diketahui pada gambar.\n2. Gunakan sifat sudut berpelurus untuk mengekspresikan sudut-sudut dalam segitiga.\n3. Terapkan jumlah sudut dalam segitiga $=180°$ untuk mendapatkan $\\angle QPR = 36°$.\n\nRumus: $\\angle A + \\angle B + \\angle C = 180°$; sudut berpelurus $=180°$\n\nJawaban: B",
  },
  {
    no: 8, type: "pg",
    soal: "Perhatikan gambar berikut\n\nBesar $\\angle BAC$ adalah …",
    gambar: <Soal8SVG />,
    options: ["A. $80°$", "B. $70°$", "C. $60°$", "D. $50°$"],
    jawaban: "A",
    pembahasan: "Konsep: pindahkan sudut dari garis sejajar ke titik yang diinginkan, lalu gunakan jumlah sudut segitiga.\n\n1. Gunakan sifat sudut sehadap atau berseberangan dari garis sejajar pada gambar untuk memindahkan sudut ke titik A.\n2. Terapkan jumlah sudut pada segitiga: $\\angle BAC = 180° - \\angle B - \\angle C$.\n3. Diperoleh $\\angle BAC = 80°$.\n\nRumus: sudut sehadap sama besar; $\\angle A + \\angle B + \\angle C = 180°$\n\nJawaban: A",
  },
  {
    no: 9, type: "pg",
    soal: "Perhatikan gambar berikut!\n\nBesar sudut ACB adalah ….",
    gambar: <Soal9SVG />,
    options: ["A. $55°$", "B. $85°$", "C. $95°$", "D. $125°$"],
    jawaban: "D",
    pembahasan: "Konsep: sudut luar segitiga sama dengan jumlah dua sudut dalam yang tidak bersebelahan.\n\n1. Identifikasi sudut luar pada gambar.\n2. Gunakan: sudut luar $=$ jumlah dua sudut dalam yang tidak bersebelahan.\n3. Setelah substitusi: $\\angle ACB = 125°$.\n\nRumus: sudut luar $= \\alpha + \\beta$ (dua sudut dalam yang tidak bersebelahan)\n\nJawaban: D",
  },
  {
    no: 10, type: "pg",
    soal: "Besar sudut terkecil dari dua jarum jam pada pukul 22.10 adalah …",
    options: ["A. $145°$", "B. $125°$", "C. $115°$", "D. $95°$"],
    jawaban: "C",
    pembahasan: "Konsep: posisi jarum jam dinyatakan dalam derajat; sudut dihitung dari selisih posisi kedua jarum.\n\n1. Pukul 22.10 = pukul 10.10.\n2. Jarum jam: $10 \\times 30° + \\frac{10}{60}\\times30° = 300°+5°=305°$\n3. Jarum menit: $10\\times6°=60°$\n4. Selisih: $|305°-60°|=245°$. Sudut terkecil: $360°-245°=115°$\n\nRumus: jarum jam $=30°\\times h + 0{,}5°\\times m$; jarum menit $=6°\\times m$\n\nJawaban: C",
  },
  {
    no: 11, type: "pg",
    soal: "Besar sudut terkecil dari dua jarum jam pada pukul 07.20 adalah …",
    options: ["A. $90°$", "B. $100°$", "C. $105°$", "D. $110°$"],
    jawaban: "B",
    pembahasan: "Konsep: posisi jarum jam dinyatakan dalam derajat; sudut dihitung dari selisih posisi kedua jarum.\n\n1. Pukul 07.20.\n2. Jarum jam: $7\\times30° + \\frac{20}{60}\\times30° = 210°+10°=220°$\n3. Jarum menit: $20\\times6°=120°$\n4. Selisih: $|220°-120°|=100°$\n\nRumus: jarum jam $=30°\\times h + 0{,}5°\\times m$; jarum menit $=6°\\times m$\n\nJawaban: B",
  },
  {
    no: 12, type: "pg",
    soal: "Diketahui besar $\\angle A = (2x + 3)°$ dan $\\angle B = (3x - 8)°$ saling berpelurus, maka penyiku sudut A adalah....",
    options: ["A. $13°$", "B. $37°$", "C. $77°$", "D. $103°$"],
    jawaban: "A",
    pembahasan: "Konsep: gunakan sudut berpelurus untuk mencari $x$, lalu hitung penyiku sudut yang diperoleh.\n\n1. $\\angle A$ dan $\\angle B$ berpelurus: $(2x+3)°+(3x-8)°=180°$\n2. $5x-5=180 \\Rightarrow x=37$\n3. $\\angle A=(2\\times37+3)°=77°$\n4. Penyiku $\\angle A = 90°-77°=13°$\n\nRumus: berpelurus $\\alpha+\\beta=180°$; penyiku $90°-\\alpha$\n\nJawaban: A",
  },
  {
    no: 13, type: "pg",
    soal: "Perhatikan gambar berikut ini!\n\nJika $\\angle\\alpha = 3x° - y° - 15°$, $\\angle\\beta = 2y°$, $\\angle\\delta = y° - x° + 85°$, $\\angle\\theta = 2x° + y° - 20°$. Maka nilai dari $x + y = \\cdots$",
    gambar: <Soal13SVG />,
    options: ["A. 85", "B. 80", "C. 55", "D. 30"],
    jawaban: "A",
    pembahasan: "Konsep: susun sistem dua persamaan linear dari pasangan sudut berpelurus pada gambar, lalu selesaikan untuk $x$ dan $y$.\n\n1. Dari $\\alpha+\\beta=180°$: $(3x-y-15)+2y=180 \\Rightarrow 3x+y=195$ … (1)\n2. Dari $\\delta+\\theta=180°$: $(y-x+85)+(2x+y-20)=180 \\Rightarrow x+2y=115$ … (2)\n3. Dari (1): $y=195-3x$. Substitusi ke (2): $x+2(195-3x)=115 \\Rightarrow -5x=-275 \\Rightarrow x=55$\n4. $y=195-3(55)=30$. Jadi $x+y=55+30=85$.\n\nRumus: sudut berpelurus $\\alpha+\\beta=180°$\n\nJawaban: A",
  },
  {
    no: 14, type: "pg",
    soal: "Perhatikan gambar berikut:\n\nJika besar $\\angle a = 95°$ dan $\\angle b = 70°$ maka selisih besar sudut x dan y adalah...",
    gambar: <Soal14SVG />,
    options: ["A. $25°$", "B. $45°$", "C. $65°$", "D. $85°$"],
    jawaban: "A",
    pembahasan: "Konsep: gunakan sudut sehadap untuk mengekspresikan $x$ dan $y$ dalam $a$ dan $b$, lalu hitung selisihnya.\n\n1. Gunakan sudut sehadap dan sudut berpelurus pada gambar untuk menyatakan $x$ dan $y$ dalam $a$ dan $b$.\n2. Substitusi $a=95°$ dan $b=70°$.\n3. Diperoleh $|x-y|=25°$.\n\nRumus: sudut sehadap sama besar; berpelurus berjumlah $180°$\n\nJawaban: A",
  },
  {
    no: 15, type: "pg",
    soal: "Perhatikan gambar berikut:\n\nJika garis $l_1$ dan $l_2$ adalah dua garis yang sejajar, maka nilai x adalah...",
    gambar: <Soal15SVG />,
    options: ["A. $13°$", "B. $39°$", "C. $47°$", "D. $55°$"],
    jawaban: "B",
    pembahasan: "Konsep: garis-garis sejajar dipotong transversal; gunakan sudut sehadap/berseberangan untuk membentuk dan menyelesaikan persamaan.\n\n1. Garis $l_1 \\parallel l_2$ dipotong transversal. Tentukan pasangan sudut sehadap/berseberangan pada gambar.\n2. Bangun persamaan dari hubungan sudut-sudut tersebut.\n3. Selesaikan persamaan untuk mendapatkan $x=39°$.\n\nRumus: sudut sehadap sama besar; sudut dalam berseberangan sama besar\n\nJawaban: B",
  },
  {
    no: 16, type: "pg",
    soal: "Empat sudut terbentuk oleh dua garis berpotongan seperti pada gambar berikut:\n\nBila diketahui $q° = 45°$ maka:",
    gambar: <Soal16SVG />,
    options: [
      "A. $p = 135°$; $s = 45°$; $r = 135°$",
      "B. $p = 130°$; $s = 45°$; $r = 130°$",
      "C. $p = 135°$; $s = 40°$; $r = 135°$",
      "D. $p = 130°$; $s = 40°$; $r = 130°$",
    ],
    jawaban: "A",
    pembahasan: "Konsep: sudut berpelurus berjumlah $180°$; sudut bertolak belakang besarnya sama.\n\n1. $p$ dan $q$ berpelurus: $p=180°-q=180°-45°=135°$\n2. $r$ bertolak belakang dengan $p$: $r=p=135°$\n3. $s$ bertolak belakang dengan $q$: $s=q=45°$\n\nRumus: berpelurus $p+q=180°$; bertolak belakang: sama besar\n\nJawaban: A",
  },
  {
    no: 17, type: "pg",
    soal: "Pada kubus ABCD.EFGH besar sudut BGE adalah...",
    gambar: <Soal17SVG />,
    options: ["A. $30°$", "B. $60°$", "C. $45°$", "D. $90°$"],
    jawaban: "B",
    pembahasan: "Konsep: diagonal sisi kubus sama panjang ($a\\sqrt{2}$); segitiga dengan ketiga sisi sama panjang adalah segitiga sama sisi dengan setiap sudut $60°$.\n\n1. BG, GE, dan EB adalah diagonal-diagonal sisi kubus dengan panjang $a\\sqrt{2}$ (sama).\n2. Maka $\\triangle BGE$ adalah segitiga sama sisi.\n3. Setiap sudut segitiga sama sisi $=60°$, sehingga $\\angle BGE=60°$.\n\nRumus: diagonal sisi kubus $=a\\sqrt{2}$; sudut segitiga sama sisi $=60°$\n\nJawaban: B",
  },
  {
    no: 18, type: "pg",
    soal: "Perhatikan gambar.\n\nBesar sudut AOB adalah ...",
    gambar: <Soal18SVG />,
    options: ["A. $70°$", "B. $120°$", "C. $140°$", "D. $160°$"],
    jawaban: "C",
    pembahasan: "Konsep: identifikasi pasangan sudut bertolak belakang (sama besar) dan berpelurus ($180°$) di sekitar titik O.\n\n1. Identifikasi sudut-sudut bertolak belakang dan berpelurus di sekitar titik O.\n2. Gunakan hubungan sudut-sudut tersebut dengan nilai yang diberikan pada gambar.\n3. Diperoleh $\\angle AOB=140°$.\n\nRumus: bertolak belakang: sama besar; berpelurus: berjumlah $180°$\n\nJawaban: C",
  },
  {
    no: 19, type: "pg",
    soal: "Perhatikan gambar berikut!\n\nJika besar $\\angle a = 35°$ dan $\\angle b = 45°$ maka jumlah besar sudut x dan y adalah ...",
    gambar: <Soal19SVG />,
    options: ["A. $285°$", "B. $300°$", "C. $315°$", "D. $330°$"],
    jawaban: "A",
    pembahasan: "Konsep: jumlah sudut di sekeliling satu titik $=360°$; gunakan untuk mencari total sudut yang ditanya.\n\n1. Jumlah semua sudut di sekeliling titik $=360°$.\n2. Identifikasi $x$, $y$, $a$, dan $b$ pada gambar sehingga $x+y+a+b=360°$ (dengan koreksi sudut sesuai konfigurasi gambar).\n3. Substitusi $a=35°$ dan $b=45°$, diperoleh $x+y=285°$.\n\nRumus: jumlah sudut di sekeliling titik $=360°$\n\nJawaban: A",
  },
  {
    no: 20, type: "pg",
    soal: "Perhatikan gambar berikut!\n\nJika diketahui AB sejajar CD, maka nilai x adalah ...",
    gambar: <Soal20SVG />,
    options: ["A. $15°$", "B. $30°$", "C. $40°$", "D. $45°$"],
    jawaban: "B",
    pembahasan: "Konsep: garis sejajar dipotong transversal: sudut sehadap sama besar, sudut dalam berseberangan sama besar.\n\n1. Karena $AB \\parallel CD$, gunakan sudut sehadap atau sudut dalam berseberangan untuk memindahkan sudut.\n2. Bentuk persamaan dari sudut-sudut yang sama besar.\n3. Selesaikan persamaan: diperoleh $x=30°$.\n\nRumus: sudut sehadap sama besar; sudut dalam berseberangan sama besar\n\nJawaban: B",
  },
  {
    no: 21, type: "pg",
    soal: "Perhatikan gambar berikut!\n\nBesar penyiku $\\angle SQR$ adalah ...",
    gambar: <Soal21SVG />,
    options: ["A. $9°$", "B. $32°$", "C. $48°$", "D. $58°$"],
    jawaban: "B",
    pembahasan: "Konsep: hitung sudut yang ditanya dengan sifat jumlah sudut segitiga/berpelurus, lalu ambil penyikunya.\n\n1. Hitung $\\angle SQR$ dari informasi pada gambar menggunakan sifat sudut berpelurus atau jumlah sudut segitiga.\n2. Penyiku $\\angle SQR = 90° - \\angle SQR$.\n3. Diperoleh penyiku $=32°$.\n\nRumus: penyiku $=90°-\\alpha$\n\nJawaban: B",
  },
  {
    no: 22, type: "pg",
    soal: "Perhatikan gambar berikut!\n\nBesar sudut nomor 1 adalah $95°$, dan sudut nomor 2 adalah $110°$. Besar sudut nomor 3 adalah ...",
    gambar: <Soal22SVG />,
    options: ["A. $5°$", "B. $15°$", "C. $25°$", "D. $35°$"],
    jawaban: "C",
    pembahasan: "Konsep: pada konfigurasi zig-zag antara dua garis sejajar, sudut tengah $=$ selisih dua sudut luar.\n\n1. Pada konfigurasi zig-zag dengan dua garis sejajar, sudut tengah memenuhi: $\\angle 3 = \\angle 1 - (180° - \\angle 2)$.\n2. $\\angle 3 = 95° - (180° - 110°) = 95° - 70° = 25°$.\n\nRumus: zig-zag $\\angle_{tengah} = \\angle_1 - (180° - \\angle_2)$\n\nJawaban: C",
  },
  {
    no: 23, type: "pg",
    soal: "Perhatikan gambar berikut.\n\nBesar $\\angle BAC$ adalah...",
    gambar: <Soal23SVG />,
    options: ["A. $24°$", "B. $48°$", "C. $72°$", "D. $98°$"],
    jawaban: "B",
    pembahasan: "Konsep: gunakan sifat sudut luar segitiga atau jumlah sudut dalam segitiga.\n\n1. Identifikasi segitiga dan sudut-sudut yang diketahui pada gambar.\n2. Gunakan sifat sudut luar segitiga atau jumlah sudut dalam $\\triangle ABC = 180°$.\n3. Diperoleh $\\angle BAC = 48°$.\n\nRumus: sudut luar $=\\alpha+\\beta$; $\\angle A+\\angle B+\\angle C=180°$\n\nJawaban: B",
  },
  {
    no: 24, type: "pg",
    soal: "Perhatikan gambar di bawah ini.\n\nDiketahui sudut SPT $= 83°$ dan sudut PQT $= 41°$. Garis PQ dan RS sejajar, demikian juga garis PS dan QT sejajar. Maka besar x = …",
    gambar: <Soal24SVG />,
    options: ["A. $41°$", "B. $82°$", "C. $124°$", "D. $139°$"],
    jawaban: "C",
    pembahasan: "Konsep: gunakan dua pasang garis sejajar secara bertingkat untuk memindahkan sudut, lalu jumlahkan.\n\n1. Karena $PS \\parallel QT$, maka $\\angle SPT$ dan $\\angle PTQ$ saling berseberangan dalam: $\\angle PTQ = 83°$.\n2. Karena $PQ \\parallel RS$, maka $x = \\angle PTQ + \\angle PQT = 83° + 41° = 124°$.\n\nRumus: sudut dalam berseberangan sama besar; sudut luar segitiga $=\\alpha+\\beta$\n\nJawaban: C",
  },
  {
    no: 25, type: "pg",
    soal: "Dari gambar berikut, diketahui perbandingan x:y adalah 2:7. Besar sudut x adalah ...",
    gambar: <Soal25SVG />,
    options: ["A. $120°$", "B. $60°$", "C. $40°$", "D. $20°$"],
    jawaban: "C",
    pembahasan: "Konsep: sudut berpelurus berjumlah $180°$; gunakan perbandingan untuk mencari nilai masing-masing sudut.\n\n1. $x$ dan $y$ saling berpelurus: $x+y=180°$.\n2. Perbandingan $x:y=2:7$, sehingga $x=\\frac{2}{2+7}\\times180°=\\frac{2}{9}\\times180°=40°$.\n\nRumus: berpelurus $x+y=180°$; $x=\\frac{p}{p+q}\\times180°$\n\nJawaban: C",
  },
  {
    no: 26, type: "pg",
    soal: "Perhatikan gambar. Jika $\\angle EFB = 65°$ dan $\\angle FCD = 120°$, maka besar $\\angle BFC$ adalah...",
    gambar: <Soal26SVG />,
    options: ["A. $55°$", "B. $45°$", "C. $50°$", "D. $35°$"],
    jawaban: "A",
    pembahasan: "Konsep: gunakan sifat sudut luar segitiga: sudut luar $=$ jumlah dua sudut dalam yang tidak bersebelahan.\n\n1. Gunakan sifat sudut luar segitiga atau hubungan sudut-sudut pada garis sejajar di gambar.\n2. $\\angle BFC = \\angle FCD - \\angle EFB = 120° - 65° = 55°$.\n\nRumus: sudut luar segitiga $=\\alpha+\\beta$ (dua sudut dalam tidak bersebelahan)\n\nJawaban: A",
  },
  {
    no: 27, type: "pg",
    soal: "Perhatikan gambar berikut. Besar sudut a adalah ...",
    gambar: <Soal27SVG />,
    options: ["A. $30°$", "B. $50°$", "C. $80°$", "D. $100°$"],
    jawaban: "C",
    pembahasan: "Konsep: pindahkan sudut menggunakan sifat garis sejajar secara bertingkat sampai ke sudut yang ditanya.\n\n1. Gunakan sifat sudut sehadap dan berpelurus pada garis-garis sejajar di gambar untuk memindahkan sudut ke posisi $a$.\n2. Diperoleh $a=80°$.\n\nRumus: sehadap: sama besar; berpelurus: $180°$; berseberangan dalam: sama besar\n\nJawaban: C",
  },
  {
    no: 28, type: "pg",
    soal: "Perhatikan gambar di bawah ini!\n\nNilai x adalah ...",
    gambar: <Soal28SVG />,
    options: ["A. $150°$", "B. $140°$", "C. $110°$", "D. $100°$"],
    jawaban: "B",
    pembahasan: "Konsep: gunakan sudut sehadap/berseberangan pada garis sejajar untuk menyusun dan menyelesaikan persamaan.\n\n1. Bangun persamaan dari sudut sehadap/berseberangan pada gambar yang memuat $x$.\n2. Setelah substitusi, diperoleh $x=140°$.\n\nRumus: sehadap: sama besar; berseberangan dalam: sama besar\n\nJawaban: B",
  },
];

const GarisSudutPage = () => (
  <TKAPemantapanLayout
    title="GARIS DAN SUDUT"
    materiSections={materiSections}
    contohSoal={getTkaContohSoal("garis-dan-sudut")}
  latihanDasar={latihanDasar}
  />
);

export default GarisSudutPage;
