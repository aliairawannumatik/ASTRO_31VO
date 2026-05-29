import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, Shapes } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ─────────────────────────────────────────────────────────────────────────────
   SVG DIAGRAMS — TRIANGLE CONGRUENCE
───────────────────────────────────────────────────────────────────────────── */

/**
 * DiagramSifatKongruen
 *
 * Triangles: ABC = A(40,185) B(160,185) C(100,55)
 *            PQR = P(230,185) Q(350,185) R(290,55)  (offset +190 in x)
 *
 * Tick placement — each tick line is drawn PERPENDICULAR to its side,
 * centred on the side's midpoint.
 *
 * Side AB / PQ  (horizontal):  perp = vertical  → double tick (green)
 * Side AC / PR  (left, slope): perp = (0.908, 0.419) → single tick (orange)
 * Side BC / QR  (right, slope):perp = (0.908,-0.419) → triple tick (yellow)
 *
 * Computed values:
 *   AC direction (60,-130), |AC|=143.2, unit=(0.419,-0.908)
 *   AC perp unit = (0.908, 0.419), half-len = 7
 *   Midpoint AC = (70,120)  → tick (63.6,117.1)→(76.4,122.9)
 *
 *   BC direction (-60,-130), perp unit=(0.908,-0.419), half-len=7
 *   Midpoint BC = (130,120)
 *   Triple spacing: along-unit=(-0.419,-0.908)*5=(-2.1,-4.5)
 *   Centers: (127.9,115.5) (130,120) (132.1,124.5)
 *   Each tick: center ± perp*7 = (±6.4, ∓2.9)
 */
const DiagramSifatKongruen = () => (
  <svg viewBox="0 0 410 215" className="w-full max-w-md mx-auto">

    {/* ── Triangle ABC  A(40,185) B(160,185) C(100,55) ── */}
    <polygon points="40,185 160,185 100,55"
      fill="#facc15" fillOpacity="0.55" stroke="#fde047" strokeWidth="2.5" strokeLinejoin="round" />
    <circle cx="40"  cy="185" r="3.5" fill="#fde047" />
    <circle cx="160" cy="185" r="3.5" fill="#fde047" />
    <circle cx="100" cy="55"  r="3.5" fill="#fde047" />
    <text x="22"  y="202" fontSize="14" fill="#fde047" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="163" y="202" fontSize="14" fill="#fde047" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="95"  y="47"  fontSize="14" fill="#fde047" fontWeight="bold" fontFamily="sans-serif">C</text>

    {/* AB — double tick (green) — perpendicular = vertical, midpoint (100,185) */}
    <line x1="94"  y1="178" x2="94"  y2="192" stroke="#22c55e" strokeWidth="2.4" />
    <line x1="106" y1="178" x2="106" y2="192" stroke="#22c55e" strokeWidth="2.4" />

    {/* AC — single tick (orange) — midpoint (70,120), perp=(0.908,0.419)*7 */}
    <line x1="64" y1="117" x2="76" y2="123" stroke="#f97316" strokeWidth="2.4" />

    {/* BC — triple tick (yellow) — midpoint (130,120), perp=(0.908,-0.419)*7 */}
    {/* center 1: (128,116)  line: (122,119)→(134,113) */}
    <line x1="122" y1="119" x2="134" y2="113" stroke="#facc15" strokeWidth="2.4" />
    {/* center 2: (130,120)  line: (124,123)→(136,117) */}
    <line x1="124" y1="123" x2="136" y2="117" stroke="#facc15" strokeWidth="2.4" />
    {/* center 3: (132,125)  line: (126,128)→(138,122) */}
    <line x1="126" y1="128" x2="138" y2="122" stroke="#facc15" strokeWidth="2.4" />

    {/*
      Angle arcs — △ABC
      A(40,185): between AB→right and AC→upper-right  color orange (#f97316)
      B(160,185): between BC→upper-left and BA→left   color sky   (#38bdf8)
      C(100,55) : between CA→lower-left and CB→lower-right color pink (#e879f9)
      radius = 18 px, drawn as proper SVG circular arcs centered at each vertex
      unit_AC = (60,-130)/143.2 = (0.419,-0.908)
      unit_BC = (-60,-130)/143.2 = (-0.419,-0.908)
    */}
    {/* ∠A — orange: arc from (58,185) on AB → (48,169) on AC, sweep CCW (0) */}
    <path d="M 58,185 A 18,18 0 0,0 48,169" fill="none" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" />
    {/* circle marker inside ∠A arc (bisector dir ≈ (0.843,−0.539), r=10 from A) */}
    <circle cx="48" cy="180" r="2.5" fill="#f97316" />
    {/* ∠B — sky: arc from (142,185) on BA → (153,169) on BC, sweep CW (1) into triangle */}
    <path d="M 142,185 A 18,18 0 0,1 153,169" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />
    {/* ∠C — pink: proper circular arc sweeping into triangle interior.
        Start r=15 on CA: (94,69), End r=15 on CB: (106,69), sweep CW (flag 1) */}
    <path d="M 94,69 A 15,15 0 0,1 106,69" fill="none" stroke="#e879f9" strokeWidth="2.2" strokeLinecap="round" />
    {/* × marker inside ∠C arc — bisector at (100,67) */}
    <line x1="97" y1="64" x2="103" y2="70" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" />
    <line x1="103" y1="64" x2="97" y2="70" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" />

    {/* ≅ */}
    <text x="195" y="128" fontSize="28" fill="#facc15" fontWeight="bold" fontFamily="serif">≅</text>

    {/* ── Triangle PQR  P(230,185) Q(350,185) R(290,55) — same shape, x+190 ── */}
    <polygon points="230,185 350,185 290,55"
      fill="#4ade80" fillOpacity="0.55" stroke="#86efac" strokeWidth="2.5" strokeLinejoin="round" />
    <circle cx="230" cy="185" r="3.5" fill="#86efac" />
    <circle cx="350" cy="185" r="3.5" fill="#86efac" />
    <circle cx="290" cy="55"  r="3.5" fill="#86efac" />
    <text x="212" y="202" fontSize="14" fill="#86efac" fontWeight="bold" fontFamily="sans-serif">P</text>
    <text x="353" y="202" fontSize="14" fill="#86efac" fontWeight="bold" fontFamily="sans-serif">Q</text>
    <text x="285" y="47"  fontSize="14" fill="#86efac" fontWeight="bold" fontFamily="sans-serif">R</text>

    {/* PQ — double tick (green) — midpoint (290,185) */}
    <line x1="284" y1="178" x2="284" y2="192" stroke="#22c55e" strokeWidth="2.4" />
    <line x1="296" y1="178" x2="296" y2="192" stroke="#22c55e" strokeWidth="2.4" />

    {/* PR — single tick (orange) — midpoint (260,120) = AC+190 */}
    <line x1="254" y1="117" x2="266" y2="123" stroke="#f97316" strokeWidth="2.4" />

    {/* QR — triple tick (yellow) — midpoint (320,120) = BC+190 */}
    <line x1="312" y1="119" x2="324" y2="113" stroke="#facc15" strokeWidth="2.4" />
    <line x1="314" y1="123" x2="326" y2="117" stroke="#facc15" strokeWidth="2.4" />
    <line x1="316" y1="128" x2="328" y2="122" stroke="#facc15" strokeWidth="2.4" />

    {/*
      Angle arcs — △PQR  (x+190 from △ABC, same colors → A↔P, B↔Q, C↔R)
      All arcs use proper SVG circular arcs (radius=18), same geometry as △ABC shifted +190 in x
    */}
    {/* ∠P — orange: arc from (248,185) on PQ → (238,169) on PR, sweep CCW (0) */}
    <path d="M 248,185 A 18,18 0 0,0 238,169" fill="none" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" />
    {/* circle marker inside ∠P arc (same as ∠A marker, bisector r=10 from P) */}
    <circle cx="238" cy="180" r="2.5" fill="#f97316" />
    {/* ∠Q — sky: arc from (332,185) on QP → (343,169) on QR, sweep CW (1) into triangle */}
    <path d="M 332,185 A 18,18 0 0,1 343,169" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />
    {/* ∠R — pink: proper circular arc sweeping into triangle interior.
        Start r=15 on RP: (284,69), End r=15 on RQ: (296,69), sweep CW (flag 1) */}
    <path d="M 284,69 A 15,15 0 0,1 296,69" fill="none" stroke="#e879f9" strokeWidth="2.2" strokeLinecap="round" />
    {/* × marker inside ∠R arc — bisector at (290,67) */}
    <line x1="287" y1="64" x2="293" y2="70" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" />
    <line x1="293" y1="64" x2="287" y2="70" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" />

    {/* title */}
    <text x="205" y="20" textAnchor="middle" fontSize="12" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">△ABC ≅ △PQR</text>
    <text x="205" y="36" textAnchor="middle" fontSize="9.5" fill="#94a3b8" fontFamily="sans-serif">Semua rusuk bersesuaian sama panjang &amp; sudut sama besar</text>
  </svg>
);

const DiagramSyaratRRR = () => (
  <svg viewBox="0 0 340 150" className="w-full max-w-sm mx-auto">
    <rect x="0" y="0" width="340" height="150" rx="10" fill="#0f172a" fillOpacity="0.5" />

    {/* Triangle 1 — kuning cerah */}
    <polygon points="30,125 145,125 88,30" fill="#facc15" fillOpacity="0.58" stroke="#fde047" strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="30" cy="125" r="3" fill="#fde047" />
    <circle cx="145" cy="125" r="3" fill="#fde047" />
    <circle cx="88" cy="30" r="3" fill="#fde047" />
    <text x="16" y="140" fontSize="12" fill="#fde047" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="147" y="140" fontSize="12" fill="#fde047" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="83" y="24" fontSize="12" fill="#fde047" fontWeight="bold" fontFamily="sans-serif">C</text>
    {/* AB double tick — perp=vertical, midpoint(87.5,125), centers x=85 & x=90 */}
    <line x1="85" y1="118" x2="85" y2="132" stroke="#ffffff" strokeWidth="2.2" />
    <line x1="90" y1="118" x2="90" y2="132" stroke="#ffffff" strokeWidth="2.2" />
    {/* AC single tick — perp=(0.853,0.521), midpoint(59,77.5), half-len=7 */}
    <line x1="53" y1="74" x2="65" y2="81" stroke="#ffffff" strokeWidth="2.2" />
    {/* BC triple tick — perp=(0.857,-0.514), midpoint(116.5,77.5), spacing=4 along side, half-len=6 */}
    <line x1="114" y1="84" x2="124" y2="78" stroke="#ffffff" strokeWidth="2.2" />
    <line x1="112" y1="81" x2="122" y2="75" stroke="#ffffff" strokeWidth="2.2" />
    <line x1="109" y1="77" x2="119" y2="71" stroke="#ffffff" strokeWidth="2.2" />

    {/* ≅ */}
    <text x="163" y="90" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

    {/* Triangle 2 — hijau cerah */}
    <polygon points="195,125 310,125 252,30" fill="#4ade80" fillOpacity="0.58" stroke="#86efac" strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="195" cy="125" r="3" fill="#86efac" />
    <circle cx="310" cy="125" r="3" fill="#86efac" />
    <circle cx="252" cy="30" r="3" fill="#86efac" />
    <text x="181" y="140" fontSize="12" fill="#86efac" fontWeight="bold" fontFamily="sans-serif">P</text>
    <text x="312" y="140" fontSize="12" fill="#86efac" fontWeight="bold" fontFamily="sans-serif">Q</text>
    <text x="247" y="24" fontSize="12" fill="#86efac" fontWeight="bold" fontFamily="sans-serif">R</text>
    {/* PQ double tick — x+165 from AB */}
    <line x1="250" y1="118" x2="250" y2="132" stroke="#ffffff" strokeWidth="2.2" />
    <line x1="255" y1="118" x2="255" y2="132" stroke="#ffffff" strokeWidth="2.2" />
    {/* PR single tick — x+165 from AC */}
    <line x1="218" y1="74" x2="230" y2="81" stroke="#ffffff" strokeWidth="2.2" />
    {/* QR triple tick — x+165 from BC */}
    <line x1="279" y1="84" x2="289" y2="78" stroke="#ffffff" strokeWidth="2.2" />
    <line x1="277" y1="81" x2="287" y2="75" stroke="#ffffff" strokeWidth="2.2" />
    <line x1="274" y1="77" x2="284" y2="71" stroke="#ffffff" strokeWidth="2.2" />

    <text x="170" y="14" textAnchor="middle" fontSize="10" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">RRR — 3 sisi bersesuaian sama panjang</text>
  </svg>
);

const DiagramSyaratRAR = () => (
  /*
   * Triangles: △ABC = A(30,125) B(145,125) C(88,30)
   *            △PQR = P(195,125) Q(310,125) R(252,30)  (offset x+165)
   *
   * RAR (Ruas-Apit-Ruas / SAS): AB=PQ, ∠A=∠P, AC=PR
   *
   * Ticks:
   *   AB/PQ (horizontal): double tick, perpendicular=vertical, midpoint (87.5,125)/(252.5,125)
   *     centers at x=85,90 and x=250,255  — extend ±7 from y=125
   *   AC/PR: single tick, perpendicular to side
   *     AC unit=(0.521,-0.854), perp=(0.854,0.521), midpoint (59,77.5)
   *     tick: (53,74)→(65,81)  |  PR: x+165 → (218,74)→(230,81)
   *
   * Angle arc at A(30,125) and P(195,125), radius=18, CCW (sweep=0):
   *   Start on AB ray r=18: (48,125) / (213,125)
   *   End   on AC ray r=18: A+(18·0.521, 18·(-0.854))=(39,110) / P+(same)=(204,110)
   *   Arc: M 48,125 A 18,18 0 0,0 39,110
   *
   * Dot inside ∠A/∠P — bisector unit≈(0.872,-0.490), r=12:
   *   A+(10.5,-5.9) = (41,119) | P+(same) = (206,119)
   */
  <svg viewBox="0 0 340 150" className="w-full max-w-sm mx-auto">
    <rect x="0" y="0" width="340" height="150" rx="10" fill="#0f172a" fillOpacity="0.5" />

    {/* ── Triangle 1: A(30,125) B(145,125) C(88,30) — magenta ── */}
    <polygon points="30,125 145,125 88,30" fill="#f472b6" fillOpacity="0.58" stroke="#fb7dd3" strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="30"  cy="125" r="3" fill="#fb7dd3" />
    <circle cx="145" cy="125" r="3" fill="#fb7dd3" />
    <circle cx="88"  cy="30"  r="3" fill="#fb7dd3" />
    <text x="16"  y="140" fontSize="12" fill="#fb7dd3" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="147" y="140" fontSize="12" fill="#fb7dd3" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="83"  y="24"  fontSize="12" fill="#fb7dd3" fontWeight="bold" fontFamily="sans-serif">C</text>

    {/* AB — double tick (vertical), midpoint (87.5,125), centers x=85 & x=90 */}
    <line x1="85" y1="118" x2="85" y2="132" stroke="#ffffff" strokeWidth="2.2" />
    <line x1="90" y1="118" x2="90" y2="132" stroke="#ffffff" strokeWidth="2.2" />

    {/* AC — single tick (perp to AC), midpoint (59,77.5), half-len=7 */}
    <line x1="53" y1="74" x2="65" y2="81" stroke="#ffffff" strokeWidth="2.2" />

    {/* ∠A arc — proper circular arc CCW, radius 18, from AB→AC sweeping into triangle */}
    <path d="M 48,125 A 18,18 0 0,0 39,110" fill="none" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* Circle dot inside ∠A — at bisector r=12 from A */}
    <circle cx="41" cy="119" r="2.5" fill="#facc15" />

    {/* ≅ */}
    <text x="163" y="90" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

    {/* ── Triangle 2: P(195,125) Q(310,125) R(252,30) — orange (x+165) ── */}
    <polygon points="195,125 310,125 252,30" fill="#fb923c" fillOpacity="0.58" stroke="#fdba74" strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="195" cy="125" r="3" fill="#fdba74" />
    <circle cx="310" cy="125" r="3" fill="#fdba74" />
    <circle cx="252" cy="30"  r="3" fill="#fdba74" />
    <text x="181" y="140" fontSize="12" fill="#fdba74" fontWeight="bold" fontFamily="sans-serif">P</text>
    <text x="312" y="140" fontSize="12" fill="#fdba74" fontWeight="bold" fontFamily="sans-serif">Q</text>
    <text x="247" y="24"  fontSize="12" fill="#fdba74" fontWeight="bold" fontFamily="sans-serif">R</text>

    {/* PQ — double tick (vertical), midpoint (252.5,125), centers x=250 & x=255 */}
    <line x1="250" y1="118" x2="250" y2="132" stroke="#ffffff" strokeWidth="2.2" />
    <line x1="255" y1="118" x2="255" y2="132" stroke="#ffffff" strokeWidth="2.2" />

    {/* PR — single tick (perp to PR), midpoint (224,77.5) = AC midpoint+165 */}
    <line x1="218" y1="74" x2="230" y2="81" stroke="#ffffff" strokeWidth="2.2" />

    {/* ∠P arc — same geometry as ∠A arc, x+165 */}
    <path d="M 213,125 A 18,18 0 0,0 204,110" fill="none" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* Circle dot inside ∠P — at bisector r=12 from P */}
    <circle cx="206" cy="119" r="2.5" fill="#facc15" />

    <text x="170" y="14" textAnchor="middle" fontSize="10" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">RAR — 2 sisi + sudut apit bersesuaian sama</text>
  </svg>
);

const DiagramSyaratARA = () => (
  /*
   * △ABC = A(30,125) B(145,125) C(88,30)
   * △PQR = P(195,125) Q(310,125) R(252,30)  (x+165)
   *
   * ARA/AAR: ∠A=∠P (•), AB=PQ (single tick), ∠B=∠Q (×)
   *
   * Arc at A/P — radius 16, CCW (sweep=0)
   *   Start on AB: A+(16,0)=(46,125) / P+(16,0)=(211,125)
   *   AC unit=(58,-95)/111.3=(0.521,-0.854)
   *   End on AC: A+16*(0.521,-0.854)=(38.3,111.3) / P+same=(203.3,111.3)
   *   Bisector unit=(1+0.521,-0.854)/|(...)| ≈ (0.872,-0.490)
   *   Dot at r=10: A+(8.7,-4.9)=(38.7,120.1) / P+same=(203.7,120.1)
   *
   * Arc at B/Q — radius 16, CW (sweep=1)
   *   BA unit=(-1,0), BC unit=(-0.515,-0.858)
   *   Start on BA: B+16*(-1,0)=(129,125) / Q+same=(294,125)
   *   End on BC: B+16*(-0.515,-0.858)=(136.8,111.3) / Q+same=(301.8,111.3)
   *   Bisector unit=(-0.870,-0.493)
   *   X at r=10: B+(-8.7,-4.9)=(136.3,120.1) / Q+same=(301.3,120.1)
   *
   * AB/PQ single tick: midpoint (87.5,125)/(252.5,125), vertical ±7
   */
  <svg viewBox="0 0 340 150" className="w-full max-w-sm mx-auto">
    <rect x="0" y="0" width="340" height="150" rx="10" fill="#0f172a" fillOpacity="0.5" />

    {/* ── Triangle 1: A(30,125) B(145,125) C(88,30) — cyan ── */}
    <polygon points="30,125 145,125 88,30" fill="#22d3ee" fillOpacity="0.58" stroke="#67e8f9" strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="30"  cy="125" r="3" fill="#67e8f9" />
    <circle cx="145" cy="125" r="3" fill="#67e8f9" />
    <circle cx="88"  cy="30"  r="3" fill="#67e8f9" />
    <text x="16"  y="140" fontSize="12" fill="#67e8f9" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="147" y="140" fontSize="12" fill="#67e8f9" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="83"  y="24"  fontSize="12" fill="#67e8f9" fontWeight="bold" fontFamily="sans-serif">C</text>

    {/* AB — single tick (vertical), midpoint (87.5,125) */}
    <line x1="87" y1="118" x2="87" y2="132" stroke="#ffffff" strokeWidth="2.2" />

    {/* ∠A arc — CCW (sweep=0), radius=16 */}
    <path d="M 46,125 A 16,16 0 0,0 38,111" fill="none" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* • dot inside ∠A — at bisector r=10 from A */}
    <circle cx="39" cy="120" r="3" fill="#facc15" />

    {/* ∠B arc — CW (sweep=1), radius=16 */}
    <path d="M 129,125 A 16,16 0 0,1 137,111" fill="none" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* × mark inside ∠B — at bisector r=10 from B */}
    <line x1="133" y1="117" x2="139" y2="123" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
    <line x1="139" y1="117" x2="133" y2="123" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />

    {/* ≅ */}
    <text x="163" y="90" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

    {/* ── Triangle 2: P(195,125) Q(310,125) R(252,30) — lime (x+165) ── */}
    <polygon points="195,125 310,125 252,30" fill="#a3e635" fillOpacity="0.58" stroke="#bef264" strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="195" cy="125" r="3" fill="#bef264" />
    <circle cx="310" cy="125" r="3" fill="#bef264" />
    <circle cx="252" cy="30"  r="3" fill="#bef264" />
    <text x="181" y="140" fontSize="12" fill="#bef264" fontWeight="bold" fontFamily="sans-serif">P</text>
    <text x="312" y="140" fontSize="12" fill="#bef264" fontWeight="bold" fontFamily="sans-serif">Q</text>
    <text x="247" y="24"  fontSize="12" fill="#bef264" fontWeight="bold" fontFamily="sans-serif">R</text>

    {/* PQ — single tick (vertical), midpoint (252.5,125) */}
    <line x1="252" y1="118" x2="252" y2="132" stroke="#ffffff" strokeWidth="2.2" />

    {/* ∠P arc — CCW (sweep=0), radius=16 — same as ∠A, x+165 */}
    <path d="M 211,125 A 16,16 0 0,0 203,111" fill="none" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* • dot inside ∠P — at bisector r=10 from P */}
    <circle cx="204" cy="120" r="3" fill="#facc15" />

    {/* ∠Q arc — CW (sweep=1), radius=16 — same as ∠B, x+165 */}
    <path d="M 294,125 A 16,16 0 0,1 302,111" fill="none" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* × mark inside ∠Q — at bisector r=10 from Q */}
    <line x1="298" y1="117" x2="304" y2="123" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
    <line x1="304" y1="117" x2="298" y2="123" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />

    <text x="170" y="14" textAnchor="middle" fontSize="10" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">ARA/AAR — 1 sisi + 2 sudut bersesuaian sama</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   SVG DIAGRAMS — NON-TRIANGLE SHAPES
───────────────────────────────────────────────────────────────────────────── */

const DiagramPersegi = () => (
  /*
   * Square 1: A(30,35) B(130,35) C(130,135) D(30,135)  side=100
   * Square 2: P(195,35) Q(295,35) R(295,135) S(195,135) side=100
   *
   * Side ticks (single, crossing edge by ±6):
   *   Top/Bottom midpoint x=80 (sq1) or 245 (sq2), vertical tick y±6 from edge
   *   Left/Right  midpoint y=85,              horizontal tick x±6 from edge
   *
   * Right-angle marks at every corner, inset 8 px, rendered via map()
   */
  <svg viewBox="0 0 340 160" className="w-full max-w-sm mx-auto">
    <rect x="0" y="0" width="340" height="160" rx="10" fill="#0f172a" fillOpacity="0.5" />

    {/* ── Square 1: A(30,35) B(130,35) C(130,135) D(30,135) ── */}
    <rect x="30" y="35" width="100" height="100" fill="#3b82f6" fillOpacity="0.2" stroke="#60a5fa" strokeWidth="2.2" />
    <text x="19"  y="32"  fontSize="12" fill="#93c5fd" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="133" y="32"  fontSize="12" fill="#93c5fd" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="133" y="148" fontSize="12" fill="#93c5fd" fontWeight="bold" fontFamily="sans-serif">C</text>
    <text x="19"  y="148" fontSize="12" fill="#93c5fd" fontWeight="bold" fontFamily="sans-serif">D</text>

    {/* single ticks — centered on each side midpoint, crossing ±6 px */}
    <line x1="80" y1="29" x2="80" y2="41" stroke="#facc15" strokeWidth="2.2" />  {/* top,  mid (80,35)  */}
    <line x1="80" y1="129" x2="80" y2="141" stroke="#facc15" strokeWidth="2.2" /> {/* bot,  mid (80,135) */}
    <line x1="24" y1="85" x2="36" y2="85" stroke="#facc15" strokeWidth="2.2" />   {/* left, mid (30,85)  */}
    <line x1="124" y1="85" x2="136" y2="85" stroke="#facc15" strokeWidth="2.2" /> {/* right,mid (130,85) */}

    {/* right-angle marks at each corner, inset 8 px */}
    {([[30,35],[130,35],[130,135],[30,135]] as [number,number][]).map(([cx,cy],i)=>{
      const dx = i<2?8:-8, dy = i===0||i===3?8:-8;
      return <g key={i}><line x1={cx} y1={cy+dy} x2={cx+dx} y2={cy+dy} stroke="#94a3b8" strokeWidth="1.4"/><line x1={cx+dx} y1={cy} x2={cx+dx} y2={cy+dy} stroke="#94a3b8" strokeWidth="1.4"/></g>;
    })}
    <text x="80" y="102" textAnchor="middle" fontSize="10" fill="#fde68a" fontFamily="sans-serif">s</text>

    {/* ≅ */}
    <text x="163" y="100" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

    {/* ── Square 2: P(195,35) Q(295,35) R(295,135) S(195,135) ── */}
    <rect x="195" y="35" width="100" height="100" fill="#a855f7" fillOpacity="0.18" stroke="#c084fc" strokeWidth="2.2" />
    <text x="184" y="32"  fontSize="12" fill="#d8b4fe" fontWeight="bold" fontFamily="sans-serif">P</text>
    <text x="298" y="32"  fontSize="12" fill="#d8b4fe" fontWeight="bold" fontFamily="sans-serif">Q</text>
    <text x="298" y="148" fontSize="12" fill="#d8b4fe" fontWeight="bold" fontFamily="sans-serif">R</text>
    <text x="184" y="148" fontSize="12" fill="#d8b4fe" fontWeight="bold" fontFamily="sans-serif">S</text>

    <line x1="245" y1="29"  x2="245" y2="41"  stroke="#facc15" strokeWidth="2.2" /> {/* top  mid (245,35)  */}
    <line x1="245" y1="129" x2="245" y2="141" stroke="#facc15" strokeWidth="2.2" /> {/* bot  mid (245,135) */}
    <line x1="189" y1="85"  x2="201" y2="85"  stroke="#facc15" strokeWidth="2.2" /> {/* left mid (195,85)  */}
    <line x1="289" y1="85"  x2="301" y2="85"  stroke="#facc15" strokeWidth="2.2" /> {/* right mid (295,85) */}

    {([[195,35],[295,35],[295,135],[195,135]] as [number,number][]).map(([cx,cy],i)=>{
      const dx = i<2?8:-8, dy = i===0||i===3?8:-8;
      return <g key={i}><line x1={cx} y1={cy+dy} x2={cx+dx} y2={cy+dy} stroke="#94a3b8" strokeWidth="1.4"/><line x1={cx+dx} y1={cy} x2={cx+dx} y2={cy+dy} stroke="#94a3b8" strokeWidth="1.4"/></g>;
    })}
    <text x="245" y="102" textAnchor="middle" fontSize="10" fill="#fde68a" fontFamily="sans-serif">s</text>

    <text x="170" y="16" textAnchor="middle" fontSize="10" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">Dua persegi kongruen jika sisinya sama panjang</text>
  </svg>
);

const DiagramPersegiPanjang = () => (
  /*
   * Rect 1: A(20,45) B(150,45) C(150,125) D(20,125)  p=130  l=80
   * Rect 2: P(200,45) Q(330,45) R(330,125) S(200,125) p=130  l=80
   *
   * Ticks (cross edge ±6 px):
   *   p-sides (top/bottom, len=130): double tick at x = mid±3, vertical, centred at x=85 / x=265
   *   l-sides (left/right,  len=80):  single tick, horizontal, centred at y=85
   *   l-side mid-x for Rect1 = (20+150)/2=85, Rect2 = (200+330)/2=265
   *
   * Right-angle marks at every corner, inset 7 px
   */
  <svg viewBox="0 0 360 170" className="w-full max-w-sm mx-auto">
    <rect x="0" y="0" width="360" height="170" rx="10" fill="#0f172a" fillOpacity="0.5" />

    {/* ── Rectangle 1: A(20,45) B(150,45) C(150,125) D(20,125) ── */}
    <rect x="20" y="45" width="130" height="80" fill="#0ea5e9" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="2.2" />
    <text x="7"   y="42"  fontSize="11" fill="#7dd3fc" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="153" y="42"  fontSize="11" fill="#7dd3fc" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="153" y="138" fontSize="11" fill="#7dd3fc" fontWeight="bold" fontFamily="sans-serif">C</text>
    <text x="7"   y="138" fontSize="11" fill="#7dd3fc" fontWeight="bold" fontFamily="sans-serif">D</text>

    {/* double tick on p-sides — centred at x=85, spacing 5, crossing ±6 */}
    <line x1="82" y1="39" x2="82" y2="51" stroke="#facc15" strokeWidth="2.2" />  {/* top  */}
    <line x1="88" y1="39" x2="88" y2="51" stroke="#facc15" strokeWidth="2.2" />
    <line x1="82" y1="119" x2="82" y2="131" stroke="#facc15" strokeWidth="2.2" /> {/* bot  */}
    <line x1="88" y1="119" x2="88" y2="131" stroke="#facc15" strokeWidth="2.2" />

    {/* single tick on l-sides — centred at y=85, crossing ±6 */}
    <line x1="14" y1="85" x2="26" y2="85" stroke="#22c55e" strokeWidth="2.2" />   {/* left  x=20 */}
    <line x1="144" y1="85" x2="156" y2="85" stroke="#22c55e" strokeWidth="2.2" /> {/* right x=150 */}

    <text x="85"  y="90" textAnchor="middle" fontSize="9" fill="#fde68a" fontFamily="sans-serif">p</text>
    <text x="32"  y="90" fontSize="9" fill="#fde68a" fontFamily="sans-serif">l</text>

    {/* right-angle marks inset 7 px */}
    {([[20,45],[150,45],[150,125],[20,125]] as [number,number][]).map(([cx,cy],i)=>{
      const dx=i<2?7:-7, dy=i===0||i===3?7:-7;
      return <g key={i}><line x1={cx} y1={cy+dy} x2={cx+dx} y2={cy+dy} stroke="#64748b" strokeWidth="1.4"/><line x1={cx+dx} y1={cy} x2={cx+dx} y2={cy+dy} stroke="#64748b" strokeWidth="1.4"/></g>;
    })}

    {/* ≅ */}
    <text x="180" y="100" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

    {/* ── Rectangle 2: P(200,45) Q(330,45) R(330,125) S(200,125) ── */}
    <rect x="200" y="45" width="130" height="80" fill="#0ea5e9" fillOpacity="0.16" stroke="#38bdf8" strokeWidth="2.2" />
    <text x="187" y="42"  fontSize="11" fill="#7dd3fc" fontWeight="bold" fontFamily="sans-serif">P</text>
    <text x="333" y="42"  fontSize="11" fill="#7dd3fc" fontWeight="bold" fontFamily="sans-serif">Q</text>
    <text x="333" y="138" fontSize="11" fill="#7dd3fc" fontWeight="bold" fontFamily="sans-serif">R</text>
    <text x="187" y="138" fontSize="11" fill="#7dd3fc" fontWeight="bold" fontFamily="sans-serif">S</text>

    {/* double tick on p-sides — centred at x=265 */}
    <line x1="262" y1="39" x2="262" y2="51" stroke="#facc15" strokeWidth="2.2" />
    <line x1="268" y1="39" x2="268" y2="51" stroke="#facc15" strokeWidth="2.2" />
    <line x1="262" y1="119" x2="262" y2="131" stroke="#facc15" strokeWidth="2.2" />
    <line x1="268" y1="119" x2="268" y2="131" stroke="#facc15" strokeWidth="2.2" />

    {/* single tick on l-sides */}
    <line x1="194" y1="85" x2="206" y2="85" stroke="#22c55e" strokeWidth="2.2" />  {/* left  x=200 */}
    <line x1="324" y1="85" x2="336" y2="85" stroke="#22c55e" strokeWidth="2.2" />  {/* right x=330 */}

    {([[200,45],[330,45],[330,125],[200,125]] as [number,number][]).map(([cx,cy],i)=>{
      const dx=i<2?7:-7, dy=i===0||i===3?7:-7;
      return <g key={i}><line x1={cx} y1={cy+dy} x2={cx+dx} y2={cy+dy} stroke="#64748b" strokeWidth="1.4"/><line x1={cx+dx} y1={cy} x2={cx+dx} y2={cy+dy} stroke="#64748b" strokeWidth="1.4"/></g>;
    })}

    <text x="180" y="17" textAnchor="middle" fontSize="9.5" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">Dua persegi panjang kongruen jika panjang dan lebarnya sama</text>
  </svg>
);

const DiagramJajarGenjang = () => (
  /*
   * Parallelogram 1: A(30,130) B(150,130) C(130,40) D(10,40)
   * Parallelogram 2: P(205,130) Q(325,130) R(305,40) S(185,40)  (offset x+175)
   *
   * Side directions & perpendiculars:
   *   AB/DC (horizontal, y=130/40): perp = vertical
   *     midpoint AB = (90,130), DC = (70,40)  → double tick centred at x=90/70
   *   AD: direction D−A=(−20,−90), |=92.2, unit=(−0.217,−0.976)
   *     perp unit (rotate 90° CCW) = (0.976,−0.217)
   *     midpoint AD = (20,85) → single tick: (20±6.8, 85∓1.5) = (13,87)→(27,83)
   *   BC: direction C−B=(−20,−90), same unit. midpoint BC=(140,85)
   *     single tick: (133,87)→(147,83)
   *
   * Angle arcs (proper circular arcs, r=15):
   *   ∠A (orange, obtuse ≈103°):
   *     start on AB: A+(15,0)=(45,130)
   *     end   on AD: A+15*(−0.217,−0.976)=(26.7,115.4)→(27,115)
   *     sweep CCW (flag 0)  → M 45,130 A 15,15 0 0,0 27,115
   *   ∠B (sky, acute ≈77°):
   *     start on BA: B+15*(−1,0)=(135,130)
   *     end   on BC: B+15*(−0.217,−0.976)=(146.7,115.4)→(147,115)
   *     sweep CW  (flag 1)  → M 135,130 A 15,15 0 0,1 147,115
   *   ∠P / ∠Q: same geometry, x+175
   */
  <svg viewBox="0 0 360 160" className="w-full max-w-sm mx-auto">
    <rect x="0" y="0" width="360" height="160" rx="10" fill="#0f172a" fillOpacity="0.5" />

    {/* ── Parallelogram 1: A(30,130) B(150,130) C(130,40) D(10,40) ── */}
    <polygon points="30,130 150,130 130,40 10,40"
      fill="#f59e0b" fillOpacity="0.2" stroke="#fbbf24" strokeWidth="2.2" strokeLinejoin="round" />
    <text x="19"  y="148" fontSize="11" fill="#fcd34d" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="152" y="148" fontSize="11" fill="#fcd34d" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="132" y="36"  fontSize="11" fill="#fcd34d" fontWeight="bold" fontFamily="sans-serif">C</text>
    <text x="-2"  y="36"  fontSize="11" fill="#fcd34d" fontWeight="bold" fontFamily="sans-serif">D</text>

    {/* AB double tick — midpoint (90,130), vertical, spacing 5 */}
    <line x1="87" y1="124" x2="87" y2="136" stroke="#facc15" strokeWidth="2.2" />
    <line x1="93" y1="124" x2="93" y2="136" stroke="#facc15" strokeWidth="2.2" />
    {/* DC double tick — midpoint (70,40), vertical, spacing 5 */}
    <line x1="67" y1="34"  x2="67" y2="46"  stroke="#facc15" strokeWidth="2.2" />
    <line x1="73" y1="34"  x2="73" y2="46"  stroke="#facc15" strokeWidth="2.2" />
    {/* AD single tick — midpoint (20,85), perp=(0.976,−0.217), half-len=7 */}
    {/* (20−6.8, 85+1.5)→(20+6.8, 85−1.5) = (13,87)→(27,84) */}
    <line x1="13" y1="87" x2="27" y2="84" stroke="#22c55e" strokeWidth="2.2" />
    {/* BC single tick — midpoint (140,85) */}
    <line x1="133" y1="87" x2="147" y2="84" stroke="#22c55e" strokeWidth="2.2" />

    {/* ∠A arc — orange, CCW (sweep=0), r=15 */}
    <path d="M 45,130 A 15,15 0 0,0 27,115" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
    {/* ∠B arc — sky, CW (sweep=1), r=15 */}
    <path d="M 135,130 A 15,15 0 0,1 147,115" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

    {/* ≅ */}
    <text x="180" y="95" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

    {/* ── Parallelogram 2: P(205,130) Q(325,130) R(305,40) S(185,40) ── */}
    <polygon points="205,130 325,130 305,40 185,40"
      fill="#f59e0b" fillOpacity="0.16" stroke="#fbbf24" strokeWidth="2.2" strokeLinejoin="round" />
    <text x="194" y="148" fontSize="11" fill="#fcd34d" fontWeight="bold" fontFamily="sans-serif">P</text>
    <text x="327" y="148" fontSize="11" fill="#fcd34d" fontWeight="bold" fontFamily="sans-serif">Q</text>
    <text x="307" y="36"  fontSize="11" fill="#fcd34d" fontWeight="bold" fontFamily="sans-serif">R</text>
    <text x="172" y="36"  fontSize="11" fill="#fcd34d" fontWeight="bold" fontFamily="sans-serif">S</text>

    {/* PQ double tick — midpoint (265,130) */}
    <line x1="262" y1="124" x2="262" y2="136" stroke="#facc15" strokeWidth="2.2" />
    <line x1="268" y1="124" x2="268" y2="136" stroke="#facc15" strokeWidth="2.2" />
    {/* SR double tick — midpoint (245,40) */}
    <line x1="242" y1="34"  x2="242" y2="46"  stroke="#facc15" strokeWidth="2.2" />
    <line x1="248" y1="34"  x2="248" y2="46"  stroke="#facc15" strokeWidth="2.2" />
    {/* PS single tick — midpoint (195,85) */}
    <line x1="188" y1="87" x2="202" y2="84" stroke="#22c55e" strokeWidth="2.2" />
    {/* QR single tick — midpoint (315,85) */}
    <line x1="308" y1="87" x2="322" y2="84" stroke="#22c55e" strokeWidth="2.2" />

    {/* ∠P arc — orange, CCW (sweep=0), r=15, x+175 from ∠A */}
    <path d="M 220,130 A 15,15 0 0,0 202,115" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
    {/* ∠Q arc — sky, CW (sweep=1), r=15, x+175 from ∠B */}
    <path d="M 310,130 A 15,15 0 0,1 322,115" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

    <text x="180" y="17" textAnchor="middle" fontSize="9.5" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">Dua jajar genjang kongruen: 2 sisi + sudut sama</text>
  </svg>
);

const DiagramBelahKetupat = () => (
  /*
   * Rhombus 1: A(80,45) B(150,88) C(80,131) D(10,88)  center=(80,88)
   *   h-half=70, v-half=43  →  side=sqrt(70²+43²)=82.2
   *   unit_AB=(0.852,0.523)  perp_AB(CCW)=(-0.523,0.852)
   *   unit_BC=(-0.852,0.523) perp_BC(CCW)=(-0.523,-0.852)
   *
   * Ticks — single on all 4 sides, half-len=7, perpendicular to side:
   *   AB mid(115,66.5): (119,61)→(111,72)
   *   BC mid(115,109.5):(119,116)→(111,104)
   *   CD mid(45,109.5): (41,116)→(49,104)
   *   DA mid(45,66.5):  (41,61)→(49,72)
   *
   * Angle arcs r=14:
   *   ∠A (obtuse≈120°): start AB (92,52), end AD (68,52), sweep CW(1)
   *   ∠B (acute≈60°):   start BA (138,81), end BC (138,95), sweep CCW(0)
   *   ∠D (acute, =∠B):  start DA (22,81), end DC (22,95), sweep CW(1)
   *
   * Rhombus 2: offset x+175  A'(255,45) B'(325,88) C'(255,131) D'(185,88)
   */
  <svg viewBox="0 0 340 170" className="w-full max-w-sm mx-auto">
    <rect x="0" y="0" width="340" height="170" rx="10" fill="#0f172a" fillOpacity="0.5" />

    {/* ── Rhombus 1: A(80,45) B(150,88) C(80,131) D(10,88) — violet ── */}
    <polygon points="80,45 150,88 80,131 10,88"
      fill="#8b5cf6" fillOpacity="0.22" stroke="#a78bfa" strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="80"  cy="45"  r="3" fill="#a78bfa" />
    <circle cx="150" cy="88"  r="3" fill="#a78bfa" />
    <circle cx="80"  cy="131" r="3" fill="#a78bfa" />
    <circle cx="10"  cy="88"  r="3" fill="#a78bfa" />
    <text x="74"  y="40"  fontSize="12" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="153" y="93"  fontSize="12" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="74"  y="147" fontSize="12" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">C</text>
    <text x="0"   y="93"  fontSize="12" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">D</text>

    {/* AB tick — mid(115,66.5) perp=(-0.523,0.852) half=7 */}
    <line x1="119" y1="61" x2="111" y2="72" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* BC tick — mid(115,109.5) */}
    <line x1="119" y1="116" x2="111" y2="104" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* CD tick — mid(45,109.5) */}
    <line x1="41"  y1="116" x2="49"  y2="104" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* DA tick — mid(45,66.5) */}
    <line x1="41"  y1="61"  x2="49"  y2="72"  stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />

    {/* ∠A — orange, obtuse, CW (sweep=1), r=14 */}
    <path d="M 92,52 A 14,14 0 0,1 68,52" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
    {/* ∠B — sky, acute, CCW (sweep=0), r=14 */}
    <path d="M 138,81 A 14,14 0 0,0 138,95" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
    {/* ∠D — sky, acute, CW (sweep=1), r=14 (equal to ∠B) */}
    <path d="M 22,81 A 14,14 0 0,1 22,95" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

    {/* ≅ */}
    <text x="168" y="97" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

    {/* ── Rhombus 2: A'(255,45) B'(325,88) C'(255,131) D'(185,88) — x+175 ── */}
    <polygon points="255,45 325,88 255,131 185,88"
      fill="#8b5cf6" fillOpacity="0.16" stroke="#a78bfa" strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="255" cy="45"  r="3" fill="#a78bfa" />
    <circle cx="325" cy="88"  r="3" fill="#a78bfa" />
    <circle cx="255" cy="131" r="3" fill="#a78bfa" />
    <circle cx="185" cy="88"  r="3" fill="#a78bfa" />
    <text x="249" y="40"  fontSize="12" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">P</text>
    <text x="328" y="93"  fontSize="12" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">Q</text>
    <text x="249" y="147" fontSize="12" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">R</text>
    <text x="175" y="93"  fontSize="12" fill="#c4b5fd" fontWeight="bold" fontFamily="sans-serif">S</text>

    {/* PQ tick */}
    <line x1="294" y1="61"  x2="286" y2="72"  stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* QR tick */}
    <line x1="294" y1="116" x2="286" y2="104" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* RS tick */}
    <line x1="216" y1="116" x2="224" y2="104" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* SP tick */}
    <line x1="216" y1="61"  x2="224" y2="72"  stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />

    {/* ∠P — orange, obtuse, CW (sweep=1) */}
    <path d="M 267,52 A 14,14 0 0,1 243,52" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
    {/* ∠Q — sky, acute, CCW (sweep=0) */}
    <path d="M 313,81 A 14,14 0 0,0 313,95" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
    {/* ∠S — sky, acute, CW (sweep=1) */}
    <path d="M 197,81 A 14,14 0 0,1 197,95" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

    <text x="170" y="16" textAnchor="middle" fontSize="9.5" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">Dua belah ketupat kongruen jika sisinya sama &amp; sudut apitnya sama</text>
  </svg>
);

const DiagramLayangLayang = () => (
  /*
   * Kite 1: A(80,20) B(22,88) C(80,155) D(138,88)
   *   AB=AD (top pair): dir AB=(-58,68) |=89.4  unit=(-0.649,0.761)
   *   CB=CD (bot pair): dir CB=(-58,-67)|=88.6  unit=(-0.655,-0.756)
   *
   * Ticks:
   *   AB single mid(51,54):   perp_AB=(-0.761,-0.649)  → (56,59)→(46,50)
   *   AD single mid(109,54):  perp_AD=(-0.761, 0.649)  → (114,50)→(104,59)
   *   CB double mid(51,121.5):perp_CB=(0.756,-0.655)   → two lines
   *   CD double mid(109,121.5):perp_CD=(0.756,0.655)   → two lines
   *
   * Angle arcs r=14 at ∠B and ∠D (equal angles in kite):
   *   ∠B at B(22,88):  start BA (31,77), end BC (31,99), sweep CW(1)
   *   ∠D at D(138,88): start DA (129,77), end DC (129,99), sweep CCW(0)
   *
   * Kite 2: offset x+175  A'(255,20) B'(197,88) C'(255,155) D'(313,88)
   */
  <svg viewBox="0 0 340 175" className="w-full max-w-sm mx-auto">
    <rect x="0" y="0" width="340" height="175" rx="10" fill="#0f172a" fillOpacity="0.5" />

    {/* ── Kite 1: A(80,20) B(22,88) C(80,155) D(138,88) — rose ── */}
    <polygon points="80,20 22,88 80,155 138,88"
      fill="#f43f5e" fillOpacity="0.2" stroke="#fb7185" strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="80"  cy="20"  r="3" fill="#fb7185" />
    <circle cx="22"  cy="88"  r="3" fill="#fb7185" />
    <circle cx="80"  cy="155" r="3" fill="#fb7185" />
    <circle cx="138" cy="88"  r="3" fill="#fb7185" />
    <text x="74"  y="15"  fontSize="12" fill="#fda4af" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="7"   y="93"  fontSize="12" fill="#fda4af" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="74"  y="170" fontSize="12" fill="#fda4af" fontWeight="bold" fontFamily="sans-serif">C</text>
    <text x="141" y="93"  fontSize="12" fill="#fda4af" fontWeight="bold" fontFamily="sans-serif">D</text>

    {/* AB single tick — mid(51,54), perp=(-0.761,-0.649), half=7 */}
    {/* mid - 7*perp = (51+5.33,54+4.54)=(56,59); mid + 7*perp = (51-5.33,54-4.54)=(46,50) */}
    <line x1="56" y1="59" x2="46" y2="50" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />

    {/* AD single tick — mid(109,54), perp=(-0.761,0.649), half=7 */}
    {/* mid - 7*perp = (109+5.33,54-4.54)=(114,50); mid + 7*perp = (109-5.33,54+4.54)=(104,59) */}
    <line x1="114" y1="50" x2="104" y2="59" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />

    {/* CB double tick — mid(51,121.5), unit=(-0.655,-0.756), perp=(0.756,-0.655) */}
    {/* c1=mid-2*unit=(52.3,123.0): line (47,127)→(57,119)  */}
    {/* c2=mid+2*unit=(49.7,120.0): line (45,124)→(55,116)  */}
    <line x1="47" y1="127" x2="57" y2="119" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="45" y1="124" x2="55" y2="116" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" />

    {/* CD double tick — mid(109,121.5), unit=(0.655,-0.756), perp=(0.756,0.655) */}
    {/* c1=(107.7,123.0): line (103,119)→(113,127)  */}
    {/* c2=(110.3,120.0): line (105,116)→(115,124)  */}
    <line x1="103" y1="119" x2="113" y2="127" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="105" y1="116" x2="115" y2="124" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" />

    {/* ∠B — orange, CW (sweep=1), r=14 */}
    <path d="M 31,77 A 14,14 0 0,1 31,99" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
    {/* ∠D — orange, CCW (sweep=0), r=14 (equal to ∠B) */}
    <path d="M 129,77 A 14,14 0 0,0 129,99" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />

    {/* ≅ */}
    <text x="168" y="97" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

    {/* ── Kite 2: A'(255,20) B'(197,88) C'(255,155) D'(313,88) — x+175 ── */}
    <polygon points="255,20 197,88 255,155 313,88"
      fill="#f43f5e" fillOpacity="0.15" stroke="#fb7185" strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="255" cy="20"  r="3" fill="#fb7185" />
    <circle cx="197" cy="88"  r="3" fill="#fb7185" />
    <circle cx="255" cy="155" r="3" fill="#fb7185" />
    <circle cx="313" cy="88"  r="3" fill="#fb7185" />
    <text x="249" y="15"  fontSize="12" fill="#fda4af" fontWeight="bold" fontFamily="sans-serif">P</text>
    <text x="182" y="93"  fontSize="12" fill="#fda4af" fontWeight="bold" fontFamily="sans-serif">Q</text>
    <text x="249" y="170" fontSize="12" fill="#fda4af" fontWeight="bold" fontFamily="sans-serif">R</text>
    <text x="316" y="93"  fontSize="12" fill="#fda4af" fontWeight="bold" fontFamily="sans-serif">S</text>

    {/* PQ single tick — x+175 from AB */}
    <line x1="231" y1="59" x2="221" y2="50" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* PS single tick — x+175 from AD */}
    <line x1="289" y1="50" x2="279" y2="59" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
    {/* RQ double tick — x+175 from CB */}
    <line x1="222" y1="127" x2="232" y2="119" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="220" y1="124" x2="230" y2="116" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" />
    {/* RS double tick — x+175 from CD */}
    <line x1="278" y1="119" x2="288" y2="127" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="280" y1="116" x2="290" y2="124" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" />

    {/* ∠Q — orange, CW (sweep=1), r=14 */}
    <path d="M 206,77 A 14,14 0 0,1 206,99" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
    {/* ∠S — orange, CCW (sweep=0), r=14 */}
    <path d="M 304,77 A 14,14 0 0,0 304,99" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />

    <text x="170" y="16" textAnchor="middle" fontSize="9.5" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">Dua layang-layang kongruen jika semua sisi &amp; sudut bersesuaian sama</text>
  </svg>
);

const DiagramLingkaran = () => (
  <svg viewBox="0 0 320 150" className="w-full max-w-sm mx-auto">
    <rect x="0" y="0" width="320" height="150" rx="10" fill="#0f172a" fillOpacity="0.5" />
    {/* Circle 1 */}
    <circle cx="80" cy="78" r="52" fill="#ec4899" fillOpacity="0.15" stroke="#f472b6" strokeWidth="2.2" />
    <line x1="80" y1="78" x2="132" y2="78" stroke="#f472b6" strokeWidth="1.8" strokeDasharray="4 3" />
    <circle cx="80" cy="78" r="2.5" fill="#f472b6" />
    <text x="90" y="73" fontSize="10" fill="#fde68a" fontFamily="sans-serif">r</text>
    <text x="70" y="140" fontSize="11" fill="#f9a8d4" fontWeight="bold" fontFamily="sans-serif">Lingkaran 1</text>

    {/* ≅ */}
    <text x="152" y="88" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

    {/* Circle 2 */}
    <circle cx="242" cy="78" r="52" fill="#ec4899" fillOpacity="0.12" stroke="#f472b6" strokeWidth="2.2" />
    <line x1="242" y1="78" x2="294" y2="78" stroke="#f472b6" strokeWidth="1.8" strokeDasharray="4 3" />
    <circle cx="242" cy="78" r="2.5" fill="#f472b6" />
    <text x="252" y="73" fontSize="10" fill="#fde68a" fontFamily="sans-serif">r</text>
    <text x="232" y="140" fontSize="11" fill="#f9a8d4" fontWeight="bold" fontFamily="sans-serif">Lingkaran 2</text>

    <text x="160" y="17" textAnchor="middle" fontSize="10" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">Dua lingkaran kongruen jika jari-jarinya sama</text>
  </svg>
);

const DiagramTrapesium = () => (
  /*
   * Trapezoid 1: A(15,130) B(155,130) C(125,45) D(45,45)
   * Trapezoid 2: P(200,130) Q(340,130) R(310,45) S(230,45)  (offset x+185)
   *
   * Ticks (cross edge ±6 px, perpendicular to each side):
   *
   *   AB (bottom, horizontal, len=140): triple tick centred at x=85, y=130, spacing 5
   *     → x=80,85,90  y=124→136
   *   DC (top, horizontal, len=80): single tick centred at x=85, y=45
   *     → x=85, y=39→51
   *
   *   AD (left leg): A(15,130)→D(45,45), dir=(30,−85), |=90.1
   *     unit=(0.333,−0.943), perp=(0.943,0.333)
   *     midpoint=(30,87.5)
   *     double tick — two lines, spacing 4 along unit, half-len=6:
   *       c1 = mid − 2·unit = (29.3, 89.4)
   *       c2 = mid + 2·unit = (30.7, 85.6)
   *       line1: c1 ± 6·perp = (23.7,87.4)→(35.0,91.4) → (24,87)→(35,91)
   *       line2: c2 ± 6·perp = (25.0,83.6)→(36.4,87.6) → (25,84)→(36,88)
   *
   *   BC (right leg): B(155,130)→C(125,45), dir=(−30,−85), |=90.1
   *     unit=(−0.333,−0.943), perp=(0.943,−0.333)
   *     midpoint=(140,87.5)
   *       c1 = (140.7,89.4)  c2 = (139.3,85.6)
   *       line1: (135.0,91.4)→(146.3,87.4) → (135,91)→(146,87)
   *       line2: (133.6,87.6)→(145.0,83.6) → (134,88)→(145,84)
   *
   *   Trapezoid 2 is same geometry x+185.
   */
  <svg viewBox="0 0 360 165" className="w-full max-w-sm mx-auto">
    <rect x="0" y="0" width="360" height="165" rx="10" fill="#0f172a" fillOpacity="0.5" />

    {/* ── Trapezoid 1: A(15,130) B(155,130) C(125,45) D(45,45) ── */}
    <polygon points="15,130 155,130 125,45 45,45"
      fill="#14b8a6" fillOpacity="0.2" stroke="#2dd4bf" strokeWidth="2.2" strokeLinejoin="round" />
    <text x="3"   y="147" fontSize="11" fill="#5eead4" fontWeight="bold" fontFamily="sans-serif">A</text>
    <text x="158" y="147" fontSize="11" fill="#5eead4" fontWeight="bold" fontFamily="sans-serif">B</text>
    <text x="127" y="40"  fontSize="11" fill="#5eead4" fontWeight="bold" fontFamily="sans-serif">C</text>
    <text x="33"  y="40"  fontSize="11" fill="#5eead4" fontWeight="bold" fontFamily="sans-serif">D</text>

    {/* AB — triple tick, centred at (85,130), spacing 5, crossing ±6 */}
    <line x1="80" y1="124" x2="80" y2="136" stroke="#facc15" strokeWidth="2.2" />
    <line x1="85" y1="124" x2="85" y2="136" stroke="#facc15" strokeWidth="2.2" />
    <line x1="90" y1="124" x2="90" y2="136" stroke="#facc15" strokeWidth="2.2" />

    {/* DC — single tick, centred at (85,45), crossing ±6 */}
    <line x1="85" y1="39" x2="85" y2="51" stroke="#f97316" strokeWidth="2.2" />

    {/* AD — double tick, perpendicular, midpoint (30,87.5) */}
    <line x1="24" y1="87" x2="35" y2="91" stroke="#22c55e" strokeWidth="2.2" />
    <line x1="25" y1="84" x2="36" y2="88" stroke="#22c55e" strokeWidth="2.2" />

    {/* BC — double tick, perpendicular, midpoint (140,87.5) */}
    <line x1="135" y1="91" x2="146" y2="87" stroke="#22c55e" strokeWidth="2.2" />
    <line x1="134" y1="88" x2="145" y2="84" stroke="#22c55e" strokeWidth="2.2" />

    {/* ≅ */}
    <text x="183" y="100" fontSize="22" fill="#facc15" fontFamily="serif">≅</text>

    {/* ── Trapezoid 2: P(200,130) Q(340,130) R(310,45) S(230,45) ── */}
    <polygon points="200,130 340,130 310,45 230,45"
      fill="#14b8a6" fillOpacity="0.15" stroke="#2dd4bf" strokeWidth="2.2" strokeLinejoin="round" />
    <text x="188" y="147" fontSize="11" fill="#5eead4" fontWeight="bold" fontFamily="sans-serif">P</text>
    <text x="343" y="147" fontSize="11" fill="#5eead4" fontWeight="bold" fontFamily="sans-serif">Q</text>
    <text x="312" y="40"  fontSize="11" fill="#5eead4" fontWeight="bold" fontFamily="sans-serif">R</text>
    <text x="218" y="40"  fontSize="11" fill="#5eead4" fontWeight="bold" fontFamily="sans-serif">S</text>

    {/* PQ — triple tick, centred at (270,130) */}
    <line x1="265" y1="124" x2="265" y2="136" stroke="#facc15" strokeWidth="2.2" />
    <line x1="270" y1="124" x2="270" y2="136" stroke="#facc15" strokeWidth="2.2" />
    <line x1="275" y1="124" x2="275" y2="136" stroke="#facc15" strokeWidth="2.2" />

    {/* SR — single tick, centred at (270,45) */}
    <line x1="270" y1="39" x2="270" y2="51" stroke="#f97316" strokeWidth="2.2" />

    {/* PS — double tick, perpendicular, midpoint (215,87.5)  [x+185 from AD] */}
    <line x1="209" y1="87" x2="220" y2="91" stroke="#22c55e" strokeWidth="2.2" />
    <line x1="210" y1="84" x2="221" y2="88" stroke="#22c55e" strokeWidth="2.2" />

    {/* QR — double tick, perpendicular, midpoint (325,87.5) [x+185 from BC] */}
    <line x1="320" y1="91" x2="331" y2="87" stroke="#22c55e" strokeWidth="2.2" />
    <line x1="319" y1="88" x2="330" y2="84" stroke="#22c55e" strokeWidth="2.2" />

    <text x="180" y="17" textAnchor="middle" fontSize="9.5" fill="#fde68a" fontWeight="bold" fontFamily="sans-serif">Dua trapesium kongruen: semua sisi &amp; sudut bersesuaian sama</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────────────────────────── */

const KekongruenBangunDatarPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep1", "konsep2", "bangunLain", "contoh1",
  ]);
  const toggleSection = (s: string) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const Header = ({
    id, icon, color, label,
  }: {
    id: string; icon: React.ReactNode; color: string; label: string;
  }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span style={{ color }}>{icon}</span>
        <span className="font-body font-semibold text-white">{label}</span>
      </div>
      {expandedSections.includes(id)
        ? <ChevronUp className="w-5 h-5 text-primary" />
        : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          KEKONGRUENAN BANGUN DATAR
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 9 · Kesebangunan dan Kekongruenan · Materi Matematika
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── INTRO ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="intro" icon={<Lightbulb className="w-5 h-5" />} color="#facc15" label="🧱 Apa Itu Kekongruenan?" />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Dua bangun datar dikatakan <strong className="text-cyan-300">kongruen</strong> jika salah satunya dapat
                  ditutupkan <em>persis</em> di atas yang lain — seperti dua puzzle identik yang saling menutupi tanpa celah.
                  Kekongruenan berlaku untuk <strong className="text-yellow-300">semua jenis bangun datar</strong>, bukan hanya segitiga!
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-cyan-300">📌 Definisi Formal</p>
                  <p className="font-body text-sm text-white/80">
                    Dua bangun datar <InlineMath math="F_1" /> dan <InlineMath math="F_2" /> disebut kongruen
                    (<InlineMath math="F_1 \cong F_2" />) jika dan hanya jika:
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-1 font-body text-sm text-white/80">
                    <p>① Semua sisi yang bersesuaian <strong className="text-green-300">sama panjang</strong></p>
                    <p>② Semua sudut yang bersesuaian <strong className="text-blue-300">sama besar</strong></p>
                  </div>
                  <p className="font-body text-xs text-white/60 italic">
                    Bangun yang kongruen bisa saja dibalik (refleksi) atau diputar untuk saling menutupi.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── SIFAT SEGITIGA ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep1" icon={<Target className="w-5 h-5" />} color="#4ade80" label="📘 Sub-Bab 1 — Sifat Dua Segitiga Kongruen" />
            {expandedSections.includes("konsep1") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">
                    Jika <InlineMath math="\triangle ABC \cong \triangle PQR" />, maka berlaku dua sifat sekaligus:
                  </p>
                  <div className="bg-slate-900/60 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="font-body text-xs font-semibold text-green-300 mb-1">① Rusuk-rusuk bersesuaian sama panjang:</p>
                      <BlockMath math="AB = PQ, \quad BC = QR, \quad CA = RP" />
                    </div>
                    <div>
                      <p className="font-body text-xs font-semibold text-blue-300 mb-1">② Sudut-sudut bersesuaian sama besar:</p>
                      <BlockMath math="\angle A = \angle P, \quad \angle B = \angle Q, \quad \angle C = \angle R" />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-3">🔍 ILUSTRASI SIFAT KEKONGRUENAN SEGITIGA:</p>
                  <DiagramSifatKongruen />
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>⚠️ Perhatikan urutan penulisan!</strong>{" "}
                    <InlineMath math="\triangle ABC \cong \triangle PQR" /> berarti A↔P, B↔Q, C↔R.
                    Jadi <InlineMath math="AB = PQ" /> (bukan <InlineMath math="AB = PR" />!).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── SYARAT SEGITIGA ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep2" icon={<Target className="w-5 h-5" />} color="#c084fc" label="📘 Sub-Bab 2 — Syarat Dua Segitiga Kongruen" />
            {expandedSections.includes("konsep2") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-2">
                  <p className="font-body text-sm font-semibold text-purple-300">🎯 Ringkasan Intisari</p>
                  <p className="font-body text-sm text-white/80">
                    Untuk membuktikan dua segitiga kongruen, cukup tunjukkan <strong>salah satu</strong> dari 4 syarat berikut:
                  </p>
                </div>

                {/* RRR */}
                <div className="bg-slate-800/60 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">① Syarat RRR — Sisi-Sisi-Sisi</p>
                  <DiagramSyaratRRR />
                  <p className="font-body text-sm text-white/80">
                    Ketiga pasang sisi bersesuaian sama panjang.
                  </p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="AB=PQ,\; BC=QR,\; CA=RP \Rightarrow \triangle ABC \cong \triangle PQR" />
                  </div>
                </div>

                {/* RAR */}
                <div className="bg-slate-800/60 border border-purple-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-purple-300">② Syarat RAR — Sisi-Sudut-Sisi</p>
                  <DiagramSyaratRAR />
                  <p className="font-body text-sm text-white/80">
                    Dua sisi bersesuaian sama panjang <strong>dan sudut apitnya</strong> sama besar.
                  </p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="AB=PQ,\; \angle A=\angle P,\; AC=PR \Rightarrow \triangle ABC \cong \triangle PQR" />
                  </div>
                </div>

                {/* ARA / AAR */}
                <div className="bg-slate-800/60 border border-cyan-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-cyan-300">③ Syarat ARA / AAR — Sudut-Sisi-Sudut</p>
                  <DiagramSyaratARA />
                  <p className="font-body text-sm text-white/80">
                    Satu sisi bersesuaian sama panjang dan dua sudut bersesuaian sama besar
                    (sisi boleh diapit atau dihadapkan ke salah satu sudut).
                  </p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math="\angle A=\angle P,\; AB=PQ,\; \angle B=\angle Q \Rightarrow \triangle ABC \cong \triangle PQR" />
                  </div>
                </div>

                {/* Tabel ringkasan */}
                <div className="bg-slate-900/60 border border-slate-600/40 rounded-lg p-4 overflow-x-auto">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">📊 RINGKASAN SYARAT KEKONGRUENAN SEGITIGA:</p>
                  <table className="w-full font-body text-xs text-white/80">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-2 pr-3 text-cyan-300">Kode</th>
                        <th className="text-left py-2 pr-3 text-cyan-300">Syarat</th>
                        <th className="text-left py-2 text-cyan-300">Yang Dibutuhkan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      <tr><td className="py-2 pr-3 text-green-300 font-bold">RRR</td><td className="py-2 pr-3">3 pasang sisi sama</td><td className="py-2">3 rusuk</td></tr>
                      <tr><td className="py-2 pr-3 text-purple-300 font-bold">RAR</td><td className="py-2 pr-3">2 sisi + sudut apit sama</td><td className="py-2">2 rusuk + 1 sudut</td></tr>
                      <tr><td className="py-2 pr-3 text-cyan-300 font-bold">ARA</td><td className="py-2 pr-3">1 sisi diapit + 2 sudut sama</td><td className="py-2">1 rusuk + 2 sudut</td></tr>
                      <tr><td className="py-2 pr-3 text-yellow-300 font-bold">AAR/RAA</td><td className="py-2 pr-3">1 sisi dihadapkan + 2 sudut sama</td><td className="py-2">1 rusuk + 2 sudut</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ── KEKONGRUENAN BANGUN SELAIN SEGITIGA ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="bangunLain" icon={<Shapes className="w-5 h-5" />} color="#38bdf8" label="📘 Sub-Bab 3 — Kekongruenan Bangun Datar Lainnya" />
            {expandedSections.includes("bangunLain") && (
              <div className="px-5 pb-5 space-y-5">
                <div className="bg-sky-500/10 border border-sky-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-sky-200">
                    Kekongruenan tidak hanya berlaku pada segitiga. Semua bangun datar — persegi, persegi panjang,
                    jajar genjang, trapesium, belah ketupat, layang-layang, lingkaran, maupun poligon lainnya — dapat bersifat kongruen.
                    Syarat umumnya tetap sama: <strong className="text-yellow-300">semua sisi bersesuaian sama panjang
                    DAN semua sudut bersesuaian sama besar.</strong>
                  </p>
                </div>

                {/* Persegi */}
                <div className="bg-slate-800/60 border border-blue-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-blue-300">① Persegi (Square)</p>
                  <DiagramPersegi />
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2 font-body text-sm text-white/80">
                    <p className="font-semibold text-blue-200">Syarat kekongruenan persegi:</p>
                    <p>Dua persegi kongruen jika dan hanya jika <strong className="text-yellow-300">panjang sisinya sama</strong>.</p>
                    <div className="bg-slate-900/70 rounded p-2 mt-1">
                      <BlockMath math="\text{Persegi } ABCD \cong \text{Persegi } PQRS \iff AB = PQ" />
                    </div>
                    <p className="text-xs text-white/60 italic">
                      Karena semua sudut persegi sudah 90°, hanya 1 syarat sisi yang diperlukan!
                    </p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 font-body text-sm text-white/80 space-y-1">
                    <p className="font-semibold text-blue-300">Sifat yang berlaku jika kongruen:</p>
                    <p>✅ <InlineMath math="AB = BC = CD = DA = PQ = QR = RS = SP" /></p>
                    <p>✅ <InlineMath math="\angle A = \angle B = \angle C = \angle D = \angle P = \angle Q = \angle R = \angle S = 90°" /></p>
                  </div>
                </div>

                {/* Persegi Panjang */}
                <div className="bg-slate-800/60 border border-sky-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-sky-300">② Persegi Panjang (Rectangle)</p>
                  <DiagramPersegiPanjang />
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2 font-body text-sm text-white/80">
                    <p className="font-semibold text-sky-200">Syarat kekongruenan persegi panjang:</p>
                    <p>Dua persegi panjang kongruen jika <strong className="text-yellow-300">panjang (<InlineMath math="p" />) dan lebarnya (<InlineMath math="l" />) sama</strong>.</p>
                    <div className="bg-slate-900/70 rounded p-2 mt-1">
                      <BlockMath math="ABCD \cong PQRS \iff AB = PQ \text{ dan } BC = QR" />
                    </div>
                    <p className="text-xs text-white/60 italic">
                      Semua sudut persegi panjang sudah 90°, jadi hanya perlu 2 pasang sisi bersesuaian sama.
                    </p>
                  </div>
                  <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-3 font-body text-sm text-white/80 space-y-1">
                    <p className="font-semibold text-sky-300">Contoh cepat:</p>
                    <p>Persegi panjang 6 cm × 4 cm <strong className="text-yellow-300">≅</strong> persegi panjang 6 cm × 4 cm ✓</p>
                    <p>Persegi panjang 6 cm × 4 cm <strong className="text-red-400">≇</strong> persegi panjang 4 cm × 6 cm ✗
                      <span className="text-xs text-white/50 ml-1">(perlu periksa pasangan sisi yang bersesuaian!)</span>
                    </p>
                  </div>
                </div>

                {/* Jajar Genjang */}
                <div className="bg-slate-800/60 border border-yellow-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-yellow-300">③ Jajar Genjang (Parallelogram)</p>
                  <DiagramJajarGenjang />
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2 font-body text-sm text-white/80">
                    <p className="font-semibold text-yellow-200">Syarat kekongruenan jajar genjang:</p>
                    <p>Dua jajar genjang kongruen jika <strong className="text-yellow-300">dua sisi bersesuaian sama panjang DAN sudut apit sama besar</strong>.</p>
                    <div className="bg-slate-900/70 rounded p-2 mt-1">
                      <BlockMath math="ABCD \cong PQRS \iff AB=PQ,\; BC=QR,\; \angle A=\angle P" />
                    </div>
                    <p className="text-xs text-white/60 italic">
                      ⚠️ Dua jajar genjang dengan sisi sama belum tentu kongruen jika sudutnya berbeda!
                    </p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 font-body text-sm text-white/80 space-y-1">
                    <p className="font-semibold text-yellow-300">Sifat tambahan:</p>
                    <p>✅ <InlineMath math="AB = CD = PQ = RS" /> dan <InlineMath math="BC = AD = QR = PS" /></p>
                    <p>✅ <InlineMath math="\angle A = \angle C = \angle P = \angle R" /> (sudut-sudut berhadapan)</p>
                    <p>✅ <InlineMath math="\angle A + \angle B = 180°" /> (sudut-sudut berdekatan)</p>
                  </div>
                </div>

                {/* Trapesium */}
                <div className="bg-slate-800/60 border border-teal-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-teal-300">④ Trapesium (Trapezoid)</p>
                  <DiagramTrapesium />
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2 font-body text-sm text-white/80">
                    <p className="font-semibold text-teal-200">Syarat kekongruenan trapesium:</p>
                    <p>Dua trapesium kongruen jika <strong className="text-yellow-300">semua sisi bersesuaian sama panjang DAN semua sudut bersesuaian sama besar</strong>.</p>
                    <div className="bg-slate-900/70 rounded p-2 mt-1">
                      <BlockMath math="ABCD \cong PQRS \iff AB=PQ,\; BC=QR,\; CD=RS,\; DA=SP" />
                      <BlockMath math="\angle A=\angle P,\; \angle B=\angle Q,\; \angle C=\angle R,\; \angle D=\angle S" />
                    </div>
                  </div>
                  <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-3 font-body text-sm text-white/80">
                    <p className="font-semibold text-teal-300 mb-1">Trapesium Sama Kaki:</p>
                    <p>Pada trapesium sama kaki yang kongruen, kaki-kakinya bersesuaian sama panjang dan sudut-sudut alasnya sama besar.</p>
                    <div className="mt-2">
                      <BlockMath math="BC = AD = QR = PS \text{ (kaki sama panjang)}" />
                    </div>
                  </div>
                </div>

                {/* Belah Ketupat */}
                <div className="bg-slate-800/60 border border-violet-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-violet-300">⑤ Belah Ketupat (Rhombus)</p>
                  <DiagramBelahKetupat />
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2 font-body text-sm text-white/80">
                    <p className="font-semibold text-violet-200">Syarat kekongruenan belah ketupat:</p>
                    <p>Dua belah ketupat kongruen jika <strong className="text-yellow-300">panjang sisinya sama DAN salah satu sudut apitnya sama besar</strong>.</p>
                    <div className="bg-slate-900/70 rounded p-2 mt-1">
                      <BlockMath math="ABCD \cong PQRS \iff AB = PQ \text{ dan } \angle A = \angle P" />
                    </div>
                    <p className="text-xs text-white/60 italic">
                      ⚠️ Dua belah ketupat dengan sisi sama belum tentu kongruen — sudut apitnya harus sama!
                    </p>
                  </div>
                  <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3 font-body text-sm text-white/80 space-y-1">
                    <p className="font-semibold text-violet-300">Sifat tambahan:</p>
                    <p>✅ <InlineMath math="AB = BC = CD = DA = PQ = QR = RS = SP" /> (semua sisi sama)</p>
                    <p>✅ <InlineMath math="\angle A = \angle C" /> dan <InlineMath math="\angle B = \angle D" /> (sudut berhadapan sama)</p>
                    <p>✅ Diagonal saling berpotongan tegak lurus dan saling membagi dua sama panjang</p>
                  </div>
                </div>

                {/* Layang-layang */}
                <div className="bg-slate-800/60 border border-rose-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-rose-300">⑥ Layang-layang (Kite)</p>
                  <DiagramLayangLayang />
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2 font-body text-sm text-white/80">
                    <p className="font-semibold text-rose-200">Syarat kekongruenan layang-layang:</p>
                    <p>Dua layang-layang kongruen jika <strong className="text-yellow-300">semua sisi bersesuaian sama panjang DAN semua sudut bersesuaian sama besar</strong>.</p>
                    <div className="bg-slate-900/70 rounded p-2 mt-1">
                      <BlockMath math="ABCD \cong PQRS \iff AB=PQ,\; AD=PS,\; CB=QR,\; CD=RS" />
                      <BlockMath math="\angle B = \angle Q \text{ (sudut di antara sisi berbeda panjang)}" />
                    </div>
                  </div>
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 font-body text-sm text-white/80 space-y-1">
                    <p className="font-semibold text-rose-300">Sifat layang-layang:</p>
                    <p>✅ <InlineMath math="AB = AD" /> dan <InlineMath math="CB = CD" /> (dua pasang sisi berdekatan sama)</p>
                    <p>✅ <InlineMath math="\angle B = \angle D" /> (sudut di antara sisi yang berbeda panjang sama besar)</p>
                    <p>✅ Diagonal utama (AC) memotong diagonal lainnya (BD) tegak lurus dan membaginya sama panjang</p>
                  </div>
                </div>

                {/* Lingkaran */}
                <div className="bg-slate-800/60 border border-pink-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-pink-300">⑦ Lingkaran (Circle)</p>
                  <DiagramLingkaran />
                  <div className="bg-slate-900/60 rounded-lg p-3 space-y-2 font-body text-sm text-white/80">
                    <p className="font-semibold text-pink-200">Syarat kekongruenan lingkaran:</p>
                    <p>Dua lingkaran kongruen jika dan hanya jika <strong className="text-yellow-300">jari-jarinya sama panjang</strong>.</p>
                    <div className="bg-slate-900/70 rounded p-2 mt-1">
                      <BlockMath math="\text{Lingkaran}_1 \cong \text{Lingkaran}_2 \iff r_1 = r_2" />
                    </div>
                    <p className="text-xs text-white/60 italic">
                      Lingkaran tidak punya sudut, sehingga syaratnya hanya 1: jari-jari sama!
                    </p>
                  </div>
                  <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3 font-body text-sm text-white/80 space-y-1">
                    <p className="font-semibold text-pink-300">Akibatnya:</p>
                    <p>✅ Keliling sama: <InlineMath math="K_1 = 2\pi r_1 = 2\pi r_2 = K_2" /></p>
                    <p>✅ Luas sama: <InlineMath math="L_1 = \pi r_1^2 = \pi r_2^2 = L_2" /></p>
                  </div>
                </div>

                {/* Tabel umum */}
                <div className="bg-slate-900/60 border border-slate-600/40 rounded-lg p-4 overflow-x-auto">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">📊 RINGKASAN SYARAT KEKONGRUENAN BERBAGAI BANGUN DATAR:</p>
                  <table className="w-full font-body text-xs text-white/80">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-2 pr-2 text-cyan-300">Bangun</th>
                        <th className="text-left py-2 text-cyan-300">Syarat Kongruen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      <tr><td className="py-2 pr-2 text-green-300 font-semibold">Segitiga</td><td className="py-2">RRR / RAR / ARA / AAR (salah satu)</td></tr>
                      <tr><td className="py-2 pr-2 text-blue-300 font-semibold">Persegi</td><td className="py-2">Sisi sama panjang (1 syarat)</td></tr>
                      <tr><td className="py-2 pr-2 text-sky-300 font-semibold">Persegi Panjang</td><td className="py-2">Panjang dan lebar bersesuaian sama</td></tr>
                      <tr><td className="py-2 pr-2 text-yellow-300 font-semibold">Jajar Genjang</td><td className="py-2">2 sisi bersesuaian + sudut apit sama</td></tr>
                      <tr><td className="py-2 pr-2 text-teal-300 font-semibold">Trapesium</td><td className="py-2">Semua sisi + semua sudut bersesuaian sama</td></tr>
                      <tr><td className="py-2 pr-2 text-pink-300 font-semibold">Lingkaran</td><td className="py-2">Jari-jari sama (1 syarat)</td></tr>
                      <tr><td className="py-2 pr-2 text-orange-300 font-semibold">Poligon-n</td><td className="py-2">Semua n sisi + semua n sudut bersesuaian sama</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTOH SOAL ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="contoh1" icon={<Calculator className="w-5 h-5" />} color="#60a5fa" label="📝 Contoh Soal — Kekongruenan Segitiga & Bangun Lain" />
            {expandedSections.includes("contoh1") && (
              <div className="px-5 pb-5 space-y-6">

                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1 — Persegi</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Persegi ABCD memiliki sisi 9 cm. Persegi PQRS memiliki sisi 9 cm.
                      Apakah kedua persegi tersebut kongruen? Sebutkan alasannya!
                    </p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <p>Syarat kongruen persegi: sisi bersesuaian sama panjang.</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <p><InlineMath math="AB = PQ = 9 \text{ cm}" /> ✓</p>
                        <p>Semua sudut persegi = 90° ✓</p>
                      </div>
                      <p><strong className="text-green-300">Kesimpulan: Persegi ABCD ≅ Persegi PQRS ✓</strong></p>
                    </div>
                  </div>
                </div>

                {/* SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2 — Segitiga (RAR)</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Diketahui AC = EC dan BC = DC, serta kedua pasang ruas berpotongan di C.
                      Buktikan bahwa <InlineMath math="\triangle ABC \cong \triangle EDC" />!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>① <InlineMath math="AC = EC" /> (diketahui)</p>
                        <p>② <InlineMath math="BC = DC" /> (diketahui)</p>
                        <p>③ <InlineMath math="\angle ACB = \angle ECD" /> (sudut bertolak belakang)</p>
                      </div>
                      <p>Dua rusuk + sudut apit sama → <strong className="text-yellow-300">Syarat RAR ✓</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\therefore \triangle ABC \cong \triangle EDC \text{ (RAR)}" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEDANG 2 */}
                <div className="border-l-4 border-orange-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 3 — Persegi Panjang</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Persegi panjang ABCD memiliki panjang 12 cm dan lebar 5 cm. Persegi panjang EFGH
                      memiliki panjang 12 cm dan lebar 5 cm. Apakah ABCD ≅ EFGH? Tuliskan semua pasangan
                      sisi dan sudut yang bersesuaian!
                    </p>
                  </div>
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-orange-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-2 font-body text-sm text-white/80">
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>① <InlineMath math="AB = EF = 12 \text{ cm}" /> ✓</p>
                        <p>② <InlineMath math="BC = FG = 5 \text{ cm}" /> ✓</p>
                        <p>③ Semua sudut = 90° ✓</p>
                      </div>
                      <p><strong className="text-orange-300">ABCD ≅ EFGH ✓</strong></p>
                      <p className="text-xs">Pasangan sisi: <InlineMath math="AB=EF,\; BC=FG,\; CD=GH,\; DA=HE" /></p>
                      <p className="text-xs">Pasangan sudut: <InlineMath math="\angle A=\angle E=\angle B=\angle F=\angle C=\angle G=\angle D=\angle H=90°" /></p>
                    </div>
                  </div>
                </div>

                {/* SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 4 — Segitiga (RRR) dalam Persegi Panjang</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      ABCD adalah persegi panjang. Buktikan bahwa
                      <InlineMath math="\triangle ABD \cong \triangle CDB" />!
                      Kemudian tuliskan semua pasangan rusuk dan sudut yang bersesuaian!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p>Perhatikan △ABD dan △CDB (BD adalah diagonal persekutuan):</p>
                      <div className="bg-slate-900/50 rounded p-3 space-y-1">
                        <p>① <InlineMath math="AB = CD" /> (sisi berhadapan persegi panjang sama panjang)</p>
                        <p>② <InlineMath math="AD = CB" /> (sisi berhadapan persegi panjang sama panjang)</p>
                        <p>③ <InlineMath math="BD = BD" /> (diagonal persekutuan)</p>
                      </div>
                      <p>Ketiga pasang rusuk sama panjang → <strong className="text-red-300">Syarat RRR ✓</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\therefore \triangle ABD \cong \triangle CDB \text{ (RRR)}" />
                      </div>
                      <p className="font-semibold">Pasangan rusuk bersesuaian:</p>
                      <div className="bg-slate-900/50 rounded p-3 text-xs space-y-1">
                        <p><InlineMath math="AB = CD,\quad AD = CB,\quad BD = DB" /></p>
                      </div>
                      <p className="font-semibold">Pasangan sudut bersesuaian:</p>
                      <div className="bg-slate-900/50 rounded p-3 text-xs space-y-1">
                        <p><InlineMath math="\angle ABD = \angle CDB,\quad \angle ADB = \angle CBD,\quad \angle DAB = \angle BCD" /></p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── RANGKUMAN ── */}
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-xl p-5 space-y-3">
            <p className="font-body text-sm font-semibold text-purple-300">🌟 Rangkuman Kekongruenan Bangun Datar</p>
            <div className="font-body text-sm text-white/80 space-y-1">
              <p>✅ Dua bangun kongruen ↔ semua sisi & sudut bersesuaian sama</p>
              <p>✅ Segitiga: cukup pakai RRR / RAR / ARA / AAR</p>
              <p>✅ Persegi: cukup 1 syarat — sisi sama panjang</p>
              <p>✅ Persegi Panjang: panjang dan lebar bersesuaian sama</p>
              <p>✅ Jajar Genjang: 2 sisi + sudut apit bersesuaian sama</p>
              <p>✅ Trapesium & poligon umum: semua sisi + sudut bersesuaian sama</p>
              <p>✅ Lingkaran: cukup 1 syarat — jari-jari sama</p>
              <p>⚠️ Selalu perhatikan urutan titik sudut dalam penulisan notasi!</p>
            </div>
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/kesebangunan-kekongruenan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Kesebangunan dan Kekongruenan
          </button>
        </div>
      </div>
    </div>
  );
};

export default KekongruenBangunDatarPage;
