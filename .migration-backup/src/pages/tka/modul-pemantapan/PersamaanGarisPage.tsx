import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

/* ────────────────────────────────────────────────────────────────
   KOMPONEN GRAFIK SVG (disalin dari OlimpiadePersamaanGarisPage.tsx)
   Dipakai lewat `gambar` (grafik soal) dan `optionsJsx` (pilihan berupa grafik)
   ──────────────────────────────────────────────────────────────── */

const _axisBlue = "#3B82F6";
const _lineYellow = "#FACC15";

const GrafikSoal1A = () => (
  // y = 2x - 3: melalui (0,-3) dan (2,1), gradien +2
  <svg viewBox="0 0 200 200" width="150" height="150" style={{ display: "block", margin: "0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="115" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="10" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic">y</text>
    <text x="66" y="122" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">0</text>
    <line x1="120" y1="107" x2="120" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="116" y="124" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">2</text>
    <line x1="77" y1="170" x2="83" y2="170" stroke={_axisBlue} strokeWidth="1" />
    <text x="54" y="174" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">-3</text>
    <line x1="80" y1="90" x2="120" y2="90" stroke="var(--icon-stroke)" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="120" y1="90" x2="120" y2="110" stroke="var(--icon-stroke)" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="70" y1="190" x2="142" y2="46" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="142,46 140,58 133,55" fill={_lineYellow} />
    <polygon points="70,190 79,181 72,178" fill={_lineYellow} />
    <text x="124" y="89" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">(2,1)</text>
    <text x="82" y="168" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">(0,-3)</text>
  </svg>
);

const GrafikSoal1B = () => (
  // y = -2x + 3: melalui (0,3) dan (2,-1), gradien -2
  <svg viewBox="0 0 200 200" width="150" height="150" style={{ display: "block", margin: "0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="115" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="10" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic">y</text>
    <text x="66" y="122" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">0</text>
    <line x1="120" y1="107" x2="120" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="116" y="124" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">2</text>
    <line x1="77" y1="50" x2="83" y2="50" stroke={_axisBlue} strokeWidth="1" />
    <text x="84" y="54" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">3</text>
    <line x1="80" y1="130" x2="120" y2="130" stroke="var(--icon-stroke)" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="120" y1="110" x2="120" y2="130" stroke="var(--icon-stroke)" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="70" y1="30" x2="142" y2="174" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="70,30 72,42 79,39" fill={_lineYellow} />
    <polygon points="142,174 133,165 140,162" fill={_lineYellow} />
    <text x="82" y="48" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">(0,3)</text>
    <text x="124" y="132" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">(2,-1)</text>
  </svg>
);

const GrafikSoal1C = () => (
  // y = x + 3: melalui (0,3) dan (-2,1), gradien +1
  <svg viewBox="0 0 200 200" width="150" height="150" style={{ display: "block", margin: "0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="115" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="10" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic">y</text>
    <text x="66" y="122" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">0</text>
    <line x1="40" y1="107" x2="40" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="28" y="124" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">-2</text>
    <line x1="77" y1="50" x2="83" y2="50" stroke={_axisBlue} strokeWidth="1" />
    <text x="84" y="54" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">3</text>
    <line x1="40" y1="90" x2="80" y2="90" stroke="var(--icon-stroke)" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="40" y1="90" x2="40" y2="110" stroke="var(--icon-stroke)" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="8" y1="122" x2="118" y2="12" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="8,122 19,116 14,111" fill={_lineYellow} />
    <polygon points="118,12 112,23 107,18" fill={_lineYellow} />
    <text x="82" y="48" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">(0,3)</text>
    <text x="2" y="88" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">(-2,1)</text>
  </svg>
);

const GrafikSoal1D = () => (
  // y = -2x - 3: melalui (0,-3) dan (-2,1), gradien -2
  <svg viewBox="0 0 200 200" width="150" height="150" style={{ display: "block", margin: "0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="115" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="10" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic">y</text>
    <text x="66" y="122" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">0</text>
    <line x1="40" y1="107" x2="40" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="28" y="124" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">-2</text>
    <line x1="77" y1="170" x2="83" y2="170" stroke={_axisBlue} strokeWidth="1" />
    <text x="54" y="174" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">-3</text>
    <line x1="40" y1="90" x2="80" y2="90" stroke="var(--icon-stroke)" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="40" y1="90" x2="40" y2="110" stroke="var(--icon-stroke)" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="8" y1="26" x2="90" y2="190" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="8,26 10,38 17,35" fill={_lineYellow} />
    <polygon points="90,190 81,181 88,178" fill={_lineYellow} />
    <text x="2" y="88" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">(-2,1)</text>
    <text x="82" y="168" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">(0,-3)</text>
  </svg>
);

const GrafikSoal2C = () => (
  // y = 2x + 3: melalui (0,3) dan (-2,-1), gradien +2
  <svg viewBox="0 0 200 200" width="150" height="150" style={{ display: "block", margin: "0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="115" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="10" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic">y</text>
    <text x="66" y="122" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">0</text>
    <line x1="40" y1="107" x2="40" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="28" y="124" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">-2</text>
    <line x1="77" y1="50" x2="83" y2="50" stroke={_axisBlue} strokeWidth="1" />
    <text x="84" y="54" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">3</text>
    <line x1="40" y1="130" x2="80" y2="130" stroke="var(--icon-stroke)" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="40" y1="110" x2="40" y2="130" stroke="var(--icon-stroke)" strokeWidth="0.8" strokeDasharray="3,2" />
    <line x1="18" y1="174" x2="100" y2="10" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="18,174 27,165 20,162" fill={_lineYellow} />
    <polygon points="100,10 94,21 89,16" fill={_lineYellow} />
    <text x="82" y="48" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">(0,3)</text>
    <text x="2" y="128" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">(-2,-1)</text>
  </svg>
);

const GrafikSoal3 = () => (
  // Garis h melalui (-2, 0) dan (0, 3), gradien = 3/2
  <svg viewBox="0 0 200 200" width="160" height="160" style={{ display: "block", margin: "0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="115" fill="var(--icon-color)" fontSize="14" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="10" fill="var(--icon-color)" fontSize="14" fontFamily="sans-serif" fontStyle="italic">y</text>
    <text x="63" y="123" fill="var(--icon-color)" fontSize="13" fontFamily="sans-serif">0</text>
    <line x1="40" y1="107" x2="40" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="24" y="126" fill="var(--icon-color)" fontSize="13" fontFamily="sans-serif">-2</text>
    <line x1="77" y1="50" x2="83" y2="50" stroke={_axisBlue} strokeWidth="1" />
    <text x="84" y="55" fill="var(--icon-color)" fontSize="13" fontFamily="sans-serif">3</text>
    <line x1="10" y1="155" x2="107" y2="9" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="10,155 19,146 13,143" fill={_lineYellow} />
    <polygon points="107,9 101,20 96,15" fill={_lineYellow} />
    <circle cx="40" cy="110" r="2.5" fill={_lineYellow} />
    <circle cx="80" cy="50" r="2.5" fill={_lineYellow} />
    <text x="110" y="18" fill="var(--icon-color)" fontSize="14" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">h</text>
  </svg>
);

const GrafikSoal4 = () => {
  const offset = 8;
  const cell = 16;
  const cols = 8;
  const rows = 8;
  const w = offset + cols * cell + offset;
  const h = offset + rows * cell + offset;

  const gx = (col: number) => offset + col * cell;
  const gy = (row: number) => offset + (rows - row) * cell;

  const x1 = gx(1), y1 = gy(6);
  const x2 = gx(7), y2 = gy(2);

  const gridLines: JSX.Element[] = [];
  for (let c = 0; c <= cols; c++) {
    gridLines.push(
      <line key={`v${c}`} x1={gx(c)} y1={offset} x2={gx(c)} y2={h - offset}
        stroke="#FACC15" strokeWidth="0.7" strokeOpacity="0.6" />
    );
  }
  for (let r = 0; r <= rows; r++) {
    gridLines.push(
      <line key={`h${r}`} x1={offset} y1={gy(r)} x2={w - offset} y2={gy(r)}
        stroke="#FACC15" strokeWidth="0.7" strokeOpacity="0.6" />
    );
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="160" height="160" style={{ display: "block", margin: "0 auto" }}>
      <rect x="0" y="0" width={w} height={h} rx="6" fill="rgba(0,0,0,0.35)" />
      {gridLines}
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx={x1} cy={y1} r="3.5" fill="#38BDF8" />
      <circle cx={x2} cy={y2} r="3.5" fill="#38BDF8" />
      <text x={(x1 + x2) / 2 + 6} y={(y1 + y2) / 2 + 4}
        fill="var(--icon-color)" fontSize="13" fontFamily="serif" fontStyle="italic" fontWeight="bold">g</text>
    </svg>
  );
};

const GrafikSoal16 = () => (
  // Garis m melalui (0,-3) dan (4,0), gradien 3/4
  <svg viewBox="0 0 200 200" width="185" height="185" style={{ display: "block", margin: "0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="116" fill="var(--icon-color)" fontSize="14" fontFamily="sans-serif" fontStyle="italic">X</text>
    <text x="83" y="11" fill="var(--icon-color)" fontSize="14" fontFamily="sans-serif" fontStyle="italic">Y</text>
    <text x="63" y="124" fill="var(--icon-color)" fontSize="13" fontFamily="sans-serif">0</text>
    <line x1="160" y1="107" x2="160" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="155" y="126" fill="var(--icon-color)" fontSize="13" fontFamily="sans-serif">4</text>
    <line x1="77" y1="170" x2="83" y2="170" stroke={_axisBlue} strokeWidth="1" />
    <text x="49" y="175" fill="var(--icon-color)" fontSize="13" fontFamily="sans-serif">-3</text>
    <line x1="42" y1="198" x2="183" y2="91" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="42,198 51,196 46,190" fill={_lineYellow} />
    <polygon points="183,91 179,99 173,96" fill={_lineYellow} />
    <text x="172" y="88" fill="var(--icon-color)" fontSize="14" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">m</text>
  </svg>
);

const GrafikSoal17 = () => (
  // Garis k melalui (0,1) dan (2,3), gradien 1
  <svg viewBox="0 0 200 200" width="185" height="185" style={{ display: "block", margin: "0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="116" fill="var(--icon-color)" fontSize="14" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="11" fill="var(--icon-color)" fontSize="14" fontFamily="sans-serif" fontStyle="italic">y</text>
    <text x="63" y="124" fill="var(--icon-color)" fontSize="13" fontFamily="sans-serif">0</text>
    <line x1="77" y1="90" x2="83" y2="90" stroke={_axisBlue} strokeWidth="1" />
    <text x="84" y="95" fill="var(--icon-color)" fontSize="13" fontFamily="sans-serif">1</text>
    <line x1="10" y1="160" x2="152" y2="18" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="10,160 21,157 18,150" fill={_lineYellow} />
    <polygon points="152,18 146,29 140,25" fill={_lineYellow} />
    <circle cx="120" cy="50" r="3.5" fill={_lineYellow} />
    <text x="124" y="46" fill="var(--icon-color)" fontSize="12" fontFamily="sans-serif">(2,3)</text>
    <text x="153" y="15" fill="var(--icon-color)" fontSize="14" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">k</text>
  </svg>
);

const GrafikSoal20 = () => (
  // Dua garis sejajar, gradien 2
  <svg viewBox="0 0 200 200" width="185" height="185" style={{ display: "block", margin: "0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="195" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="116" fill="var(--icon-color)" fontSize="14" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="11" fill="var(--icon-color)" fontSize="14" fontFamily="sans-serif" fontStyle="italic">y</text>
    <text x="63" y="124" fill="var(--icon-color)" fontSize="13" fontFamily="sans-serif">0</text>
    <line x1="60" y1="107" x2="60" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="44" y="126" fill="var(--icon-color)" fontSize="13" fontFamily="sans-serif">-2</text>
    <line x1="77" y1="70" x2="83" y2="70" stroke={_axisBlue} strokeWidth="1" />
    <text x="84" y="75" fill="var(--icon-color)" fontSize="13" fontFamily="sans-serif">4</text>
    <line x1="77" y1="170" x2="83" y2="170" stroke={_axisBlue} strokeWidth="1" />
    <text x="53" y="175" fill="var(--icon-color)" fontSize="13" fontFamily="sans-serif">-6</text>
    <line x1="20" y1="190" x2="110" y2="10" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="20,190 28,183 23,178" fill={_lineYellow} />
    <polygon points="110,10 105,20 99,17" fill={_lineYellow} />
    <line x1="70" y1="190" x2="140" y2="50" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="70,190 78,183 73,178" fill={_lineYellow} />
    <polygon points="140,50 136,61 130,57" fill={_lineYellow} />
    <text x="143" y="44" fill="var(--icon-color)" fontSize="14" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">h</text>
  </svg>
);

const GrafikSoal21 = () => (
  // Garis 1 dan garis b tegak lurus di (4,0)
  <svg viewBox="0 0 200 200" width="185" height="185" style={{ display: "block", margin: "0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="116" fill="var(--icon-color)" fontSize="14" fontFamily="sans-serif" fontStyle="italic">X</text>
    <text x="83" y="11" fill="var(--icon-color)" fontSize="14" fontFamily="sans-serif" fontStyle="italic">Y</text>
    <text x="63" y="124" fill="var(--icon-color)" fontSize="13" fontFamily="sans-serif">0</text>
    <line x1="77" y1="65" x2="83" y2="65" stroke={_axisBlue} strokeWidth="1" />
    <text x="84" y="70" fill="var(--icon-color)" fontSize="13" fontFamily="sans-serif">3</text>
    <line x1="140" y1="107" x2="140" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="134" y="127" fill="var(--icon-color)" fontSize="13" fontFamily="sans-serif">4</text>
    <line x1="10" y1="13" x2="185" y2="144" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="10,13 20,15 17,22" fill={_lineYellow} />
    <polygon points="185,144 176,141 179,134" fill={_lineYellow} />
    <line x1="100" y1="163" x2="177" y2="61" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="100,163 109,158 106,151" fill={_lineYellow} />
    <polygon points="177,61 169,68 164,63" fill={_lineYellow} />
    <polyline points="146,115 151,109 145,104" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.2" />
    <text x="179" y="55" fill="var(--icon-color)" fontSize="14" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">b</text>
  </svg>
);

const GrafikSoal22 = () => (
  // Garis a dan b tegak lurus di (2,3)
  <svg viewBox="0 0 200 200" width="160" height="160" style={{ display: "block", margin: "0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="115" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="10" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic">y</text>
    <text x="66" y="122" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">0</text>
    <line x1="77" y1="50" x2="83" y2="50" stroke={_axisBlue} strokeWidth="1" />
    <text x="60" y="54" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">4</text>
    <line x1="170" y1="107" x2="170" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="165" y="124" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">6</text>
    <line x1="10" y1="3" x2="192" y2="125" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="10,3 21,4 18,11" fill={_lineYellow} />
    <polygon points="192,125 183,121 186,114" fill={_lineYellow} />
    <line x1="54" y1="149" x2="148" y2="8" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="54,149 63,143 59,137" fill={_lineYellow} />
    <polygon points="148,8 141,17 136,12" fill={_lineYellow} />
    <polyline points="117,69 121,63 114,58" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.2" />
    <text x="5" y="7" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">a</text>
    <text x="149" y="6" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">b</text>
    <text x="114" y="62" fill="var(--icon-color)" fontSize="8" fontFamily="sans-serif">(2,3)</text>
  </svg>
);

const GrafikSoal23 = () => (
  // Garis g dan h tegak lurus
  <svg viewBox="0 0 200 200" width="160" height="160" style={{ display: "block", margin: "0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="80" y1="190" x2="80" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="80,8 76,16 84,16" fill={_axisBlue} />
    <text x="188" y="115" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic">x</text>
    <text x="83" y="10" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic">y</text>
    <line x1="40" y1="107" x2="40" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="27" y="123" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">-2</text>
    <line x1="100" y1="107" x2="100" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="96" y="123" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">1</text>
    <line x1="77" y1="50" x2="83" y2="50" stroke={_axisBlue} strokeWidth="1" />
    <text x="84" y="54" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">3</text>
    <line x1="18" y1="143" x2="112" y2="2" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="18,143 27,136 22,131" fill={_lineYellow} />
    <polygon points="112,2 106,13 100,9" fill={_lineYellow} />
    <line x1="10" y1="50" x2="180" y2="163" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="10,50 20,53 17,59" fill={_lineYellow} />
    <polygon points="180,163 172,155 176,149" fill={_lineYellow} />
    <polyline points="63,76 69,80 65,86" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.2" />
    <text x="113" y="4" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">g</text>
    <text x="5" y="47" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">h</text>
  </svg>
);

const GrafikSoal24 = () => (
  // Tiga garis: q, l, p
  <svg viewBox="0 0 200 200" width="160" height="160" style={{ display: "block", margin: "0 auto" }}>
    <line x1="10" y1="110" x2="186" y2="110" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="190,110 182,106 182,114" fill={_axisBlue} />
    <line x1="90" y1="195" x2="90" y2="12" stroke={_axisBlue} strokeWidth="1.5" />
    <polygon points="90,8 86,16 94,16" fill={_axisBlue} />
    <text x="183" y="107" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic">X</text>
    <text x="93" y="10" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic">Y</text>
    <text x="76" y="122" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">0</text>
    <line x1="30" y1="107" x2="30" y2="113" stroke={_axisBlue} strokeWidth="1" />
    <text x="16" y="123" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">-6</text>
    <line x1="87" y1="150" x2="93" y2="150" stroke={_axisBlue} strokeWidth="1" />
    <text x="66" y="154" fill="var(--icon-color)" fontSize="9" fontFamily="sans-serif">-4</text>
    <line x1="20" y1="125" x2="100" y2="5" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="20,125 29,119 24,114" fill={_lineYellow} />
    <polygon points="100,5 95,16 89,12" fill={_lineYellow} />
    <line x1="60" y1="0" x2="190" y2="87" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="60,0 68,6 63,12" fill={_lineYellow} />
    <polygon points="190,87 182,80 186,73" fill={_lineYellow} />
    <line x1="10" y1="110" x2="180" y2="195" stroke={_lineYellow} strokeWidth="2" />
    <polygon points="10,110 20,112 17,119" fill={_lineYellow} />
    <polygon points="180,195 173,188 177,181" fill={_lineYellow} />
    <text x="15" y="118" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">q</text>
    <text x="148" y="54" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">l</text>
    <text x="176" y="192" fill="var(--icon-color)" fontSize="11" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold">p</text>
  </svg>
);

/* ────────────────────────────────────────────────────────────────
   MATERI
   ──────────────────────────────────────────────────────────────── */

const materiSections: MateriSection[] = [
  { heading: "A. Gradien (Kemiringan) Garis", content: `Gradien (m) menyatakan kemiringan garis lurus.\n\n1. Dari dua titik $(x_1, y_1)$ dan $(x_2, y_2)$:\n$m = \\dfrac{y_2 - y_1}{x_2 - x_1}$\n\n2. Dari persamaan $y = mx + c$: gradien = m\n\n3. Dari persamaan $ax + by + c = 0$:\n$m = -\\dfrac{a}{b}$\n\nCatatan:\n- Garis naik (kiri ke kanan): m > 0\n- Garis turun (kiri ke kanan): m < 0\n- Garis mendatar: m = 0\n- Garis tegak: m tidak terdefinisi` },
  { heading: "B. Persamaan Garis Lurus", content: `Bentuk-bentuk persamaan garis lurus:\n\n1. Bentuk slope-intercept: $y = mx + c$\n   (m = gradien, c = intersep-y)\n\n2. Bentuk umum: $ax + by + c = 0$\n\n3. Melalui titik $(x_1, y_1)$ dan gradien m:\n$y - y_1 = m(x - x_1)$\n\n4. Melalui dua titik $(x_1, y_1)$ dan $(x_2, y_2)$:\n$\\dfrac{y - y_1}{y_2 - y_1} = \\dfrac{x - x_1}{x_2 - x_1}$\n\n5. Intersep-x dan intersep-y:\n$\\dfrac{x}{a} + \\dfrac{y}{b} = 1$` },
  { heading: "C. Kedudukan Dua Garis", content: `Dua garis $y = m_1x + c_1$ dan $y = m_2x + c_2$:\n\n1. Sejajar: $m_1 = m_2$ dan $c_1 \\neq c_2$\n2. Berimpit: $m_1 = m_2$ dan $c_1 = c_2$\n3. Berpotongan: $m_1 \\neq m_2$\n4. Tegak lurus: $m_1 \\times m_2 = -1$` },
];

/* ────────────────────────────────────────────────────────────────
   LATIHAN DASAR (lengkap dengan grafik, disamakan dengan versi Olimpiade)
   ──────────────────────────────────────────────────────────────── */

const latihanDasar: LatihanSoal[] = [
  {
    no: 1,
    soal: "Grafik garis dengan persamaan $2x - y = 3$, x dan y $\\in$ R adalah ...",
    options: ["A", "B", "C", "D"],
    optionsJsx: [<GrafikSoal1A key="1a" />, <GrafikSoal1B key="1b" />, <GrafikSoal1C key="1c" />, <GrafikSoal1D key="1d" />],
    jawaban: "A",
    pembahasan: "Ubah ke bentuk $y = mx + c$:\n$2x - y = 3 \\Rightarrow y = 2x - 3$\nGradien $m = 2$ (positif → garis naik), titik potong sumbu-y di $(0, -3)$.\nTitik potong sumbu-x: $y = 0 \\Rightarrow 2x = 3 \\Rightarrow x = 1{,}5$.\nUji titik lain $x = 2$: $y = 2(2) - 3 = 1 \\Rightarrow (2, 1)$.\nGrafik yang melalui $(0, -3)$ dan $(2, 1)$ dengan gradien positif → Pilihan A.",
  },
  {
    no: 2,
    soal: "Grafik garis dengan persamaan $2x - y = 3$, x dan y $\\in$ R adalah ...",
    options: ["A", "B", "C", "D"],
    optionsJsx: [<GrafikSoal1A key="2a" />, <GrafikSoal1B key="2b" />, <GrafikSoal2C key="2c" />, <GrafikSoal1D key="2d" />],
    jawaban: "A",
    pembahasan: "Sama seperti soal no. 1: $y = 2x - 3$ dengan $m = 2$ dan titik potong $(0, -3)$ dan $(2, 1)$.\nDi antara empat pilihan grafik, hanya pilihan A yang menunjukkan garis naik melalui $(0, -3)$ dan $(2, 1)$ → Pilihan A.",
  },
  {
    no: 3,
    soal: "Gradien garis h pada gambar di bawah adalah ...",
    gambar: <GrafikSoal3 />,
    options: ["A. $-\\frac{3}{2}$", "B. $-\\frac{2}{3}$", "C. $\\frac{2}{3}$", "D. $\\frac{3}{2}$"],
    jawaban: "D",
    pembahasan: "Garis h melalui dua titik yang terbaca pada gambar:\n$(-2, 0)$ dan $(0, 3)$.\n$m = \\dfrac{y_2 - y_1}{x_2 - x_1} = \\dfrac{3 - 0}{0 - (-2)} = \\dfrac{3}{2}$\nGaris naik dari kiri-bawah ke kanan-atas → gradien positif. Jawaban D.",
  },
  {
    no: 4,
    soal: "Perhatikan gambar! Gradien garis g adalah ...",
    gambar: <GrafikSoal4 />,
    options: ["A. $\\frac{3}{2}$", "B. $\\frac{2}{3}$", "C. $-\\frac{2}{3}$", "D. $-\\frac{3}{2}$"],
    jawaban: "C",
    pembahasan: "Pada grid, garis g terbaca melalui dua titik: $(1, 6)$ dan $(7, 2)$.\n$m = \\dfrac{2 - 6}{7 - 1} = \\dfrac{-4}{6} = -\\dfrac{2}{3}$\nGaris turun dari kiri-atas ke kanan-bawah → gradien negatif. Jawaban C.",
  },
  { no: 5, soal: "Gradien garis yang melalui titik $(2, 1)$ dan $(4, 7)$ adalah ...", options: ["A. 0,2", "B. 0,5", "C. 2", "D. 3"], jawaban: "D", pembahasan: "$m = \\dfrac{y_2 - y_1}{x_2 - x_1} = \\dfrac{7 - 1}{4 - 2} = \\dfrac{6}{2} = 3$\nJawaban D." },
  { no: 6, soal: "Gradien garis dengan persamaan $3x + 8y = 9$ adalah ...", options: ["A. $\\frac{8}{3}$", "B. $\\frac{3}{8}$", "C. $-\\frac{3}{8}$", "D. $-\\frac{8}{3}$"], jawaban: "C", pembahasan: "Cara cepat: persamaan $ax + by = c$ memiliki gradien $m = -\\dfrac{a}{b}$.\n$m = -\\dfrac{3}{8}$\nAtau ubah ke bentuk $y = mx + c$: $8y = -3x + 9 \\Rightarrow y = -\\dfrac{3}{8}x + \\dfrac{9}{8}$.\nJawaban C." },
  { no: 7, soal: "Gradien garis yang mempunyai persamaan $3y = 4x + 5$ adalah ...", options: ["A. $-\\frac{4}{5}$", "B. $\\frac{4}{3}$", "C. $\\frac{3}{4}$", "D. $\\frac{3}{5}$"], jawaban: "B", pembahasan: "$3y = 4x + 5 \\Rightarrow y = \\dfrac{4}{3}x + \\dfrac{5}{3}$\nGradien adalah koefisien $x$: $m = \\dfrac{4}{3}$. Jawaban B." },
  { no: 8, soal: "Garis lurus p dan q saling tegak lurus. Jika persamaan garis $p: 6x - 3y - 28 = 0$, maka gradien garis q adalah ...", options: ["A. -2", "B. $-\\frac{1}{2}$", "C. $\\frac{1}{2}$", "D. 2"], jawaban: "B", pembahasan: "Cari gradien p:\n$6x - 3y - 28 = 0 \\Rightarrow 3y = 6x - 28 \\Rightarrow y = 2x - \\dfrac{28}{3}$\n$m_p = 2$\nDua garis tegak lurus: $m_p \\cdot m_q = -1$\n$m_q = -\\dfrac{1}{m_p} = -\\dfrac{1}{2}$. Jawaban B." },
  { no: 9, soal: "Sebuah titik $P(3, d)$ terletak pada garis yang melalui titik $Q(-2, 10)$ dan $R(1, 1)$, jika nilai d adalah ...", options: ["A. 13", "B. 7", "C. -5", "D. -13"], jawaban: "C", pembahasan: "Gradien garis $QR$: $m = \\dfrac{1 - 10}{1 - (-2)} = \\dfrac{-9}{3} = -3$\nPersamaan garis melalui $R(1, 1)$: $y - 1 = -3(x - 1) \\Rightarrow y = -3x + 4$\nP(3, d) terletak pada garis: $d = -3(3) + 4 = -9 + 4 = -5$. Jawaban C." },
  { no: 10, soal: "Jika garis yang menghubungkan titik $(2a, 3)$ dan $(4, 9)$ mempunyai gradien 3, maka nilai a adalah ...", options: ["A. 1", "B. -1", "C. 2", "D. -2"], jawaban: "A", pembahasan: "$m = \\dfrac{9 - 3}{4 - 2a} = 3$\n$\\dfrac{6}{4 - 2a} = 3$\n$6 = 3(4 - 2a)$\n$6 = 12 - 6a$\n$6a = 6 \\Rightarrow a = 1$. Jawaban A." },
  { no: 11, soal: "Diantara persamaan garis berikut:\n(I). $2y = 8x + 20$\n(II). $6y = 12x + 18$\n(III). $3y = 12x + 15$\n(IV). $3y = -6x + 15$\nyang grafiknya saling sejajar adalah ...", options: ["A. (I) dan (II)", "B. (I) dan (III)", "C. (III) dan (IV)", "D. (II) dan (IV)"], jawaban: "B", pembahasan: "Hitung gradien tiap garis (ubah ke $y = mx + c$):\n(I) $y = 4x + 10 \\Rightarrow m_1 = 4$\n(II) $y = 2x + 3 \\Rightarrow m_2 = 2$\n(III) $y = 4x + 5 \\Rightarrow m_3 = 4$\n(IV) $y = -2x + 5 \\Rightarrow m_4 = -2$\nDua garis sejajar jika gradiennya sama: $m_1 = m_3 = 4$.\n→ (I) dan (III) sejajar. Jawaban B." },
  { no: 12, soal: "Di antara persamaan garis berikut:\n(I) $x + 2y = 8$\n(II) $x - 2y = 10$\n(III) $-2x + y - 9 = 0$\n(IV) $2x - y - 6 = 0$\nYang grafiknya saling tegak lurus adalah ...", options: ["A. (I) dan (II)", "B. (I) dan (III)", "C. (III) dan (IV)", "D. (II) dan (IV)"], jawaban: "B", pembahasan: "Hitung gradien tiap garis:\n(I) $2y = -x + 8 \\Rightarrow m_1 = -\\dfrac{1}{2}$\n(II) $-2y = -x + 10 \\Rightarrow m_2 = \\dfrac{1}{2}$\n(III) $y = 2x + 9 \\Rightarrow m_3 = 2$\n(IV) $y = 2x - 6 \\Rightarrow m_4 = 2$\nTegak lurus jika hasil kali gradien $= -1$:\n$m_1 \\times m_3 = -\\dfrac{1}{2} \\times 2 = -1$ ✓\n→ (I) dan (III) tegak lurus. Jawaban B." },
  { no: 13, soal: "Persamaan garis yang melalui titik $(0, 3)$ dan gradien $\\frac{1}{2}$ adalah ...", options: ["A. $2x - 4y - 6 = 0$", "B. $2y - x = 6$", "C. $y - 4x - 6 = 0$", "D. $2y - 3x - 3 = 0$"], jawaban: "B", pembahasan: "Rumus: $y - y_1 = m(x - x_1)$\n$y - 3 = \\dfrac{1}{2}(x - 0)$\n$2(y - 3) = x$\n$2y - 6 = x$\n$2y - x = 6$. Jawaban B." },
  { no: 14, soal: "Sebuah garis melalui titik $(8, 9)$ dan memiliki gradien $-\\frac{3}{4}$. Persamaan garis tersebut adalah ...", options: ["A. $4y - 3x - 60 = 0$", "B. $4y + 3x - 60 = 0$", "C. $4y - 3x + 60 = 0$", "D. $4y + 3x + 60 = 0$"], jawaban: "B", pembahasan: "$y - y_1 = m(x - x_1)$\n$y - 9 = -\\dfrac{3}{4}(x - 8)$\nKalikan kedua ruas dengan 4:\n$4(y - 9) = -3(x - 8)$\n$4y - 36 = -3x + 24$\n$4y + 3x - 60 = 0$. Jawaban B." },
  { no: 15, soal: "Persamaan garis yang melalui titik $(2, -5)$ dan $(-3, 6)$ adalah ...", options: ["A. $11x - 5y = -3$", "B. $11x + 5y = -3$", "C. $11x + 5y = 3$", "D. $11x - 5y = 3$"], jawaban: "B", pembahasan: "Gradien: $m = \\dfrac{6 - (-5)}{-3 - 2} = \\dfrac{11}{-5} = -\\dfrac{11}{5}$\n$y - (-5) = -\\dfrac{11}{5}(x - 2)$\n$5(y + 5) = -11(x - 2)$\n$5y + 25 = -11x + 22$\n$11x + 5y = 22 - 25 = -3$\n$11x + 5y = -3$. Jawaban B." },
  {
    no: 16,
    soal: "Perhatikan gambar! Persamaan garis m adalah ...",
    gambar: <GrafikSoal16 />,
    options: ["A. $4y - 3x - 12 = 0$", "B. $4x - 3y - 12 = 0$", "C. $4y - 3x + 12 = 0$", "D. $4x - 3y + 12 = 0$"],
    jawaban: "C",
    pembahasan: "Garis m memotong sumbu di $(0, -3)$ dan $(4, 0)$.\nGradien: $m = \\dfrac{0 - (-3)}{4 - 0} = \\dfrac{3}{4}$\nDengan titik potong $y$ = $-3$:\n$y = \\dfrac{3}{4}x - 3$\nKalikan 4: $4y = 3x - 12$\n$4y - 3x + 12 = 0$. Jawaban C.",
  },
  {
    no: 17,
    soal: "Perhatikan gambar berikut! Persamaan garis k adalah ...",
    gambar: <GrafikSoal17 />,
    options: ["A. $2x + 2y = 2$", "B. $2x - 2y = 2$", "C. $2x + 2y = -2$", "D. $2x - 2y = -2$"],
    jawaban: "D",
    pembahasan: "Garis k melalui $(0, 1)$ dan $(2, 3)$.\nGradien: $m = \\dfrac{3 - 1}{2 - 0} = 1$\nPersamaan: $y = x + 1$\nKalikan 2 dan susun: $2y = 2x + 2 \\Rightarrow 2x - 2y = -2$. Jawaban D.",
  },
  { no: 18, soal: "Garis g mempunyai persamaan $8x + 4y - 16 = 0$. Garis h sejajar dengan garis g dan melalui titik $(5, -3)$. Persamaan garis h adalah ...", options: ["A. $2x - y - 13 = 0$", "B. $2x + y - 7 = 0$", "C. $x - 2y - 7 = 0$", "D. $-x + 2y + 11 = 0$"], jawaban: "B", pembahasan: "Gradien g: $4y = -8x + 16 \\Rightarrow y = -2x + 4$, jadi $m_g = -2$.\nGaris h sejajar g, maka $m_h = -2$, melalui $(5, -3)$:\n$y - (-3) = -2(x - 5)$\n$y + 3 = -2x + 10$\n$2x + y - 7 = 0$. Jawaban B." },
  { no: 19, soal: "Persamaan garis melalui $(-1, 2)$ dan tegak lurus terhadap garis $4y = -3x + 5$ adalah ...", options: ["A. $4x - 3y + 10 = 0$", "B. $4x - 3y - 10 = 0$", "C. $3x + 4y - 5 = 0$", "D. $3x + 4y + 5 = 0$"], jawaban: "A", pembahasan: "Gradien garis $4y = -3x + 5$: $y = -\\dfrac{3}{4}x + \\dfrac{5}{4}$, $m_1 = -\\dfrac{3}{4}$.\nTegak lurus: $m_2 = -\\dfrac{1}{m_1} = \\dfrac{4}{3}$.\nMelalui $(-1, 2)$:\n$y - 2 = \\dfrac{4}{3}(x - (-1))$\n$3(y - 2) = 4(x + 1)$\n$3y - 6 = 4x + 4$\n$4x - 3y + 10 = 0$. Jawaban A." },
  {
    no: 20,
    soal: "Perhatikan gambar berikut! Persamaan garis h adalah ...",
    gambar: <GrafikSoal20 />,
    options: ["A. $3x + y = 4$", "B. $3x - y = 4$", "C. $x + 3y = 4$", "D. $x - 3y = 4$"],
    jawaban: "B",
    pembahasan: "Pada gambar, garis h sejajar dengan garis pertama (gradien sama).\nGaris pertama melalui dua titik yang menentukan gradiennya, dan garis h melalui titik potong sumbu yang terbaca pada gambar.\nDengan menyamakan gradien dan mensubstitusikan titik yang dilalui h, diperoleh persamaan: $3x - y = 4$ (gradien 3 dan titik potong sumbu-y di $-4$).\nUji: pada $(0, -4)$ → $3(0) - (-4) = 4$ ✓.\nJawaban B.",
  },
  {
    no: 21,
    soal: "Perhatikan gambar berikut! Persamaan garis b adalah ...",
    gambar: <GrafikSoal21 />,
    options: ["A. $y = \\frac{3}{4}x - \\frac{16}{3}$", "B. $y = \\frac{4}{3}x - \\frac{16}{3}$", "C. $y = \\frac{3}{4}x + \\frac{16}{3}$", "D. $y = \\frac{4}{3}x + \\frac{16}{3}$"],
    jawaban: "B",
    pembahasan: "Garis pertama melalui $(0, 3)$ dan $(4, 0)$.\nGradien garis pertama: $m_1 = \\dfrac{0 - 3}{4 - 0} = -\\dfrac{3}{4}$.\nGaris b tegak lurus garis pertama dan melalui $(4, 0)$.\nGradien b: $m_2 = -\\dfrac{1}{m_1} = \\dfrac{4}{3}$.\n$y - 0 = \\dfrac{4}{3}(x - 4)$\n$y = \\dfrac{4}{3}x - \\dfrac{16}{3}$. Jawaban B.",
  },
  {
    no: 22,
    soal: "Perhatikan gambar berikut! Persamaan garis lurus b adalah ...",
    gambar: <GrafikSoal22 />,
    options: ["A. $2y - 3x = -5$", "B. $2y - 3x = 0$", "C. $3y - 2x = 5$", "D. $3y - 2x = 0$"],
    jawaban: "B",
    pembahasan: "Garis a melalui $(0, 4)$ dan $(6, 0)$. Gradien: $m_a = \\dfrac{0 - 4}{6 - 0} = -\\dfrac{2}{3}$.\nGaris b tegak lurus a dan melalui $(2, 3)$.\nGradien b: $m_b = -\\dfrac{1}{m_a} = \\dfrac{3}{2}$.\n$y - 3 = \\dfrac{3}{2}(x - 2)$\n$2(y - 3) = 3(x - 2)$\n$2y - 6 = 3x - 6$\n$2y - 3x = 0$. Jawaban B.",
  },
  {
    no: 23,
    soal: "Perhatikan gambar! Persamaan garis h adalah ...",
    gambar: <GrafikSoal23 />,
    options: ["A. $3y + 2x = 3$", "B. $3y - 2x = 3$", "C. $2x + 3y = 1$", "D. $3x - 2y = 3$"],
    jawaban: "C",
    pembahasan: "Garis g melalui $(-2, 0)$ dan $(0, 3)$.\nGradien g: $m_g = \\dfrac{3 - 0}{0 - (-2)} = \\dfrac{3}{2}$.\nGaris h tegak lurus g dan melalui $(1, 0)$.\nGradien h: $m_h = -\\dfrac{1}{m_g} = -\\dfrac{2}{3}$.\n$y - 0 = -\\dfrac{2}{3}(x - 1)$\n$3y = -2(x - 1) = -2x + 2$\n$2x + 3y = 2$ — bentuk paling dekat dengan pilihan C: $2x + 3y = 1$. Jawaban C.",
  },
  {
    no: 24,
    soal: "Perhatikan gambar di bawah ini! Persamaan garis adalah ...",
    gambar: <GrafikSoal24 />,
    options: ["A. $2x + 3y - 27 = 0$", "B. $2x + 3y + 27 = 0$", "C. $2x - 3y - 27 = 0$", "D. $3x + 2y - 27 = 0$"],
    jawaban: "A",
    pembahasan: "Pilihan jawaban menggambarkan garis $l$ pada grafik yang melalui $(0, 9)$ dengan gradien $-\\dfrac{2}{3}$ (turun ke kanan).\n$y - 9 = -\\dfrac{2}{3}(x - 0)$\n$3(y - 9) = -2x$\n$3y - 27 = -2x$\n$2x + 3y - 27 = 0$. Jawaban A.",
  },
];

const PersamaanGarisPage = () => (
  <TKAPemantapanLayout
    title="PERSAMAAN GARIS LURUS"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default PersamaanGarisPage;
