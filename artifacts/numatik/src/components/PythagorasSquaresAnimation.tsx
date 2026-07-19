import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

// ─── Geometry: 3-4-5 triangle, 40 px/unit ────────────────────────────────────
// a=120 px, b=160 px, c=200 px
const C_PT = { x: 260, y: 310 }; // right-angle vertex
const B_PT = { x: 260, y: 190 }; // top (leg a)
const A_PT = { x: 420, y: 310 }; // right (leg b)

// Square a² – left of CB [BR, TR, TL, BL]
const SQ_A = [
  { x: 260, y: 310 }, // BR
  { x: 260, y: 190 }, // TR
  { x: 140, y: 190 }, // TL
  { x: 140, y: 310 }, // BL
];

// Square b² – below CA [TL, TR, BR, BL]
const SQ_B = [
  { x: 260, y: 310 }, // TL
  { x: 420, y: 310 }, // TR
  { x: 420, y: 470 }, // BR
  { x: 260, y: 470 }, // BL
];

// Square c² – on hypotenuse (200×200, rotated)
// Outward perpendicular PERP = CW-rotate BA = (120, -160)
const PERP = { x: 120, y: -160 };
const SQ_C = [
  { x: 260, y: 190 }, // B
  { x: 420, y: 310 }, // A
  { x: 540, y: 150 }, // A+PERP
  { x: 380, y:  30 }, // B+PERP
];

// ── Derived centres ──────────────────────────────────────────────────────────
function avgPts(pts: {x:number;y:number}[]) {
  return {
    x: pts.reduce((s,p)=>s+p.x,0)/pts.length,
    y: pts.reduce((s,p)=>s+p.y,0)/pts.length,
  };
}
const CTR_A = avgPts(SQ_A); // (200, 250)
const CTR_B = avgPts(SQ_B); // (340, 390)
const CTR_C = avgPts(SQ_C); // (400, 170)

// ── c² strip geometry ─────────────────────────────────────────────────────────
// a² occupies 9/25 of c²; b² the remaining 16/25.
// Fill direction = PERP/200; strip at fraction f: B+f*PERP to A+f*PERP
const F_A = 9 / 25; // 0.36

function cStrip(f1:number, f2:number) {
  return [
    { x: 260 + PERP.x*f1, y: 190 + PERP.y*f1 },
    { x: 420 + PERP.x*f1, y: 310 + PERP.y*f1 },
    { x: 420 + PERP.x*f2, y: 310 + PERP.y*f2 },
    { x: 260 + PERP.x*f2, y: 190 + PERP.y*f2 },
  ];
}

const DST_A = avgPts(cStrip(0,   F_A));   // centre of a-zone in c²
const DST_B = avgPts(cStrip(F_A, 1.0));  // centre of b-zone in c²

// ── Morphed rectangles (same area, same centre, new dimensions) ──────────────
// a²: 120×120 (area 14 400 px²) → 200×72  (same area)   half: 100×36
// b²: 160×160 (area 25 600 px²) → 200×128 (same area)   half: 100×64
//
// Vertex order must match source squares so lerpPts gives sensible cross-fade.
// SQ_A order: [BR, TR, TL, BL]  → RECT_A same order [BR, TR, TL, BL]
const RECT_A = [
  { x: 300, y: 286 }, // BR  (was 260,310)
  { x: 300, y: 214 }, // TR  (was 260,190)
  { x: 100, y: 214 }, // TL  (was 140,190)
  { x: 100, y: 286 }, // BL  (was 140,310)
];
// SQ_B order: [TL, TR, BR, BL] → RECT_B same order
const RECT_B = [
  { x: 240, y: 326 }, // TL  (was 260,310)
  { x: 440, y: 326 }, // TR  (was 420,310)
  { x: 440, y: 454 }, // BR  (was 420,470)
  { x: 240, y: 454 }, // BL  (was 260,470)
];

// Rotation angle: BA direction = atan2(120,160) ≈ 36.87°
// A 200×72 or 200×128 rect rotated by ANGLE_C and placed at DST_A / DST_B
// will EXACTLY coincide with the corresponding c² strip.
const ANGLE_C = Math.atan2(120, 160); // ≈ 0.6435 rad
const COS_C   = 160 / 200;
const SIN_C   = 120 / 200;

const W = 600;
const H = 500;
const DURATION = 8000; // ms

const COL_A  = "#4fc3f7";
const COL_B  = "#81c784";
const COL_C  = "#ffb74d";
const COL_BG = "#1a1a2e";

// ─── Narration ────────────────────────────────────────────────────────────────
const NARRATION = [
  { t: 0.00, text: "Langkah 1: Segitiga siku-siku dengan tiga sisi: a, b, dan c (hipotenusa)." },
  { t: 0.10, text: "Langkah 2: Persegi terbentuk di setiap sisi segitiga — masing-masing luasnya a², b², dan c²." },
  { t: 0.38, text: "Langkah 3: Perhatikan luas masing-masing persegi: a², b², dan c²." },
  { t: 0.52, text: "Langkah 4: a² berubah bentuk jadi persegi panjang — perhatikan LUAS TETAP sama! Grid tidak hilang." },
  { t: 0.60, text: "Langkah 5: b² berubah bentuk jadi persegi panjang — LUAS TETAP sama! Sama banyak kotaknya." },
  { t: 0.72, text: "Langkah 6: Persegi panjang biru (luas a²) BERGESER masuk ke persegi c²..." },
  { t: 0.83, text: "Langkah 7: Persegi panjang hijau (luas b²) BERGESER masuk mengisi sisa c²..." },
  { t: 0.96, text: "Langkah 8: a² + b² = c²  ✓  Teorema Pythagoras Terbukti secara visual!" },
];

const NARRATION_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    "Langkah 1: Segitiga siku-siku dengan tiga sisi: a, b, dan c (hipotenusa).": "Step 1: A right triangle with three sides: a, b, and c (hypotenuse).",
    "Langkah 2: Persegi terbentuk di setiap sisi segitiga — masing-masing luasnya a², b², dan c².": "Step 2: Squares form on each side of the triangle — with areas a², b², and c² respectively.",
    "Langkah 3: Perhatikan luas masing-masing persegi: a², b², dan c².": "Step 3: Notice the area of each square: a², b², and c².",
    "Langkah 4: a² berubah bentuk jadi persegi panjang — perhatikan LUAS TETAP sama! Grid tidak hilang.": "Step 4: a² reshapes into a rectangle — notice the AREA STAYS the same! The grid doesn't disappear.",
    "Langkah 5: b² berubah bentuk jadi persegi panjang — LUAS TETAP sama! Sama banyak kotaknya.": "Step 5: b² reshapes into a rectangle — AREA STAYS the same! Same number of grid cells.",
    "Langkah 6: Persegi panjang biru (luas a²) BERGESER masuk ke persegi c²...": "Step 6: The blue rectangle (area a²) SLIDES into square c²...",
    "Langkah 7: Persegi panjang hijau (luas b²) BERGESER masuk mengisi sisa c²...": "Step 7: The green rectangle (area b²) SLIDES in to fill the rest of c²...",
    "Langkah 8: a² + b² = c²  ✓  Teorema Pythagoras Terbukti secara visual!": "Step 8: a² + b² = c²  ✓  Pythagorean Theorem visually proven!",
  },
  ja: {
    "Langkah 1: Segitiga siku-siku dengan tiga sisi: a, b, dan c (hipotenusa).": "ステップ 1: 直角三角形の 3 辺：a、b、c（斜辺）。",
    "Langkah 2: Persegi terbentuk di setiap sisi segitiga — masing-masing luasnya a², b², dan c².": "ステップ 2: 三角形の各辺に正方形が形成されます — それぞれの面積は a²、b²、c²。",
    "Langkah 3: Perhatikan luas masing-masing persegi: a², b², dan c².": "ステップ 3: 各正方形の面積に注目：a²、b²、c²。",
    "Langkah 4: a² berubah bentuk jadi persegi panjang — perhatikan LUAS TETAP sama! Grid tidak hilang.": "ステップ 4: a² が長方形に変形 — 面積は変わりません！グリッドも消えません。",
    "Langkah 5: b² berubah bentuk jadi persegi panjang — LUAS TETAP sama! Sama banyak kotaknya.": "ステップ 5: b² が長方形に変形 — 面積は変わりません！マス目の数も同じ。",
    "Langkah 6: Persegi panjang biru (luas a²) BERGESER masuk ke persegi c²...": "ステップ 6: 青い長方形（面積 a²）が c² の正方形の中に移動...",
    "Langkah 7: Persegi panjang hijau (luas b²) BERGESER masuk mengisi sisa c²...": "ステップ 7: 緑の長方形（面積 b²）が c² の残りを埋めます...",
    "Langkah 8: a² + b² = c²  ✓  Teorema Pythagoras Terbukti secara visual!": "ステップ 8: a² + b² = c²  ✓  三平方の定理を視覚的に証明！",
  },
};

const SQ_UI_TRANSLATIONS = {
  id: {
    title: "🟦 Pembuktian Teorema Pythagoras 3 Animasi persegi bergerak",
    subtitle: "Persegi berubah bentuk (luas tetap!) lalu masuk dan mengisi tepat seluruh persegi c²",
    play: "▶ Play",
    pause: "⏸ Pause",
    resume: "▶ Lanjut",
    reset: "🔄 Reset",
    replay: "🔄 Ulangi",
    hintIdle: "Tekan ▶ Play — perhatikan bagaimana setiap persegi berubah bentuk (luas tetap!) lalu masuk ke c²!",
    hintPlaying: "Perhatikan jumlah kotak grid tidak berubah saat persegi jadi persegi panjang…",
    hintPaused: "Dijeda. Tekan Lanjut untuk melanjutkan.",
    hintDone: "a² (biru) + b² (hijau) = tepat mengisi c² ✓  Teorema Pythagoras terbukti!",
  },
  en: {
    title: "🟦 Pythagorean Theorem Proof 3 — Moving squares animation",
    subtitle: "Squares reshape (area unchanged!) then slide in and exactly fill square c²",
    play: "▶ Play",
    pause: "⏸ Pause",
    resume: "▶ Resume",
    reset: "🔄 Reset",
    replay: "🔄 Replay",
    hintIdle: "Press ▶ Play — watch how each square reshapes (area unchanged!) then slides into c²!",
    hintPlaying: "Notice the number of grid cells doesn't change as the square becomes a rectangle…",
    hintPaused: "Paused. Press Resume to continue.",
    hintDone: "a² (blue) + b² (green) = exactly fills c² ✓  Pythagorean Theorem proven!",
  },
  ja: {
    title: "🟦 三平方の定理の証明 3 — 動く正方形のアニメーション",
    subtitle: "正方形が変形（面積不変！）して c² にぴったり収まります",
    play: "▶ 再生",
    pause: "⏸ 一時停止",
    resume: "▶ 再開",
    reset: "🔄 リセット",
    replay: "🔄 くり返す",
    hintIdle: "▶ 再生を押して — 各正方形が変形（面積不変！）して c² に入る様子を観察しよう！",
    hintPlaying: "正方形が長方形になってもマス目の数が変わらないことに注目…",
    hintPaused: "一時停止中。再開を押してください。",
    hintDone: "a²（青）+ b²（緑）= c² をぴったり満たす ✓  三平方の定理 証明済み！",
  },
};

// ─── Easing ───────────────────────────────────────────────────────────────────
function eO3(t:number) { return 1-Math.pow(1-t,3); }
function eO5(t:number) { return 1-Math.pow(1-t,5); }
function eIO3(t:number) { return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2; }
function ph(t:number,s:number,e:number) { return Math.max(0,Math.min(1,(t-s)/(e-s))); }
function lerp(a:number,b:number,t:number) { return a+(b-a)*t; }
function lerpPt(a:{x:number;y:number},b:{x:number;y:number},t:number) {
  return { x:lerp(a.x,b.x,t), y:lerp(a.y,b.y,t) };
}
function lerpPts(a:{x:number;y:number}[],b:{x:number;y:number}[],t:number) {
  return a.map((p,i)=>lerpPt(p,b[i],t));
}

// ─── Canvas utilities ─────────────────────────────────────────────────────────
function poly(ctx:CanvasRenderingContext2D, pts:{x:number;y:number}[]) {
  ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y);
  for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x,pts[i].y);
  ctx.closePath();
}

function roundRect(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h-r); ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
  ctx.lineTo(x+r,y+h); ctx.arcTo(x,y+h,x,y+h-r,r);
  ctx.lineTo(x,y+r); ctx.arcTo(x,y,x+r,y,r);
  ctx.closePath();
}

function lbl(ctx:CanvasRenderingContext2D,text:string,x:number,y:number,color:string,size:number,alpha:number) {
  if(alpha<0.005) return;
  ctx.save();
  ctx.globalAlpha=alpha; ctx.fillStyle=color;
  ctx.font=`bold ${size}px Arial,sans-serif`;
  ctx.textAlign="center"; ctx.textBaseline="middle";
  ctx.shadowColor="rgba(0,0,0,0.95)"; ctx.shadowBlur=8;
  ctx.fillText(text,x,y);
  ctx.restore();
}

// Draw bilinear-interpolated quad grid (cols × rows cells)
// pts in [TL, TR, BR, BL] order
function drawQuadGrid(
  ctx:CanvasRenderingContext2D,
  pts:{x:number;y:number}[],
  cols:number, rows:number,
  color:string, alpha:number
) {
  if(alpha<0.01) return;
  const [tl,tr,br,bl] = pts;
  function blerp(u:number,v:number) {
    return {
      x:(1-u)*(1-v)*tl.x + u*(1-v)*tr.x + u*v*br.x + (1-u)*v*bl.x,
      y:(1-u)*(1-v)*tl.y + u*(1-v)*tr.y + u*v*br.y + (1-u)*v*bl.y,
    };
  }
  ctx.save();
  ctx.globalAlpha=alpha;
  ctx.strokeStyle=color; ctx.lineWidth=0.9;
  for(let i=1;i<cols;i++) {
    const u=i/cols; const p1=blerp(u,0); const p2=blerp(u,1);
    ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y); ctx.stroke();
  }
  for(let j=1;j<rows;j++) {
    const v=j/rows; const p1=blerp(0,v); const p2=blerp(1,v);
    ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y); ctx.stroke();
  }
  ctx.restore();
}

// Draw a morphing square/rect with grid + area label
function drawMorphShape(
  ctx:CanvasRenderingContext2D,
  pts:{x:number;y:number}[],              // current interpolated vertices (TL,TR,BR,BL)
  gridCols:number, gridRows:number,
  fillColor:string, strokeColor:string,
  alpha:number,
  ctrX:number, ctrY:number,
  areaText:string,
  morphProgress:number   // 0=square, 1=rect — used to show "luas tetap" label
) {
  if(alpha<0.005) return;
  ctx.save();
  ctx.globalAlpha=alpha;
  poly(ctx,pts); ctx.fillStyle=fillColor; ctx.fill();
  ctx.strokeStyle=strokeColor; ctx.lineWidth=2.5; ctx.stroke();
  ctx.restore();

  drawQuadGrid(ctx,pts,gridCols,gridRows,strokeColor,alpha*0.55);

  lbl(ctx,areaText,ctrX,ctrY-8,strokeColor,16,alpha);

  // "LUAS TETAP!" badge — pops in during morph
  if(morphProgress>0.15) {
    const ba=Math.min((morphProgress-0.15)/0.3,1)*alpha;
    ctx.save();
    ctx.globalAlpha=ba*0.92;
    ctx.fillStyle="rgba(250,204,21,0.22)"; ctx.strokeStyle="#fbbf24"; ctx.lineWidth=1.2;
    roundRect(ctx,ctrX-44,ctrY+4,88,20,5); ctx.fill(); ctx.stroke();
    ctx.restore();
    lbl(ctx,"LUAS TETAP!",ctrX,ctrY+14,"#fde047",11,ba);
  }
}

// Draw a flying rectangle (translated + rotated)
function drawFlyingRect(
  ctx:CanvasRenderingContext2D,
  cx:number, cy:number, angle:number,
  halfW:number, halfH:number,
  alpha:number, fill:string, stroke:string
) {
  if(alpha<0.005) return;
  ctx.save();
  ctx.globalAlpha=alpha;
  ctx.translate(cx,cy); ctx.rotate(angle);
  ctx.beginPath(); ctx.rect(-halfW,-halfH,halfW*2,halfH*2);
  ctx.fillStyle=fill; ctx.fill();
  ctx.strokeStyle=stroke; ctx.lineWidth=2.5; ctx.stroke();
  ctx.restore();
}

// Draw grid inside flying rect
function drawFlyingGrid(
  ctx:CanvasRenderingContext2D,
  cx:number,cy:number,angle:number,
  halfW:number,halfH:number,
  cols:number,rows:number,
  color:string,alpha:number
) {
  if(alpha<0.01) return;
  ctx.save();
  ctx.globalAlpha=alpha*0.55;
  ctx.strokeStyle=color; ctx.lineWidth=0.9;
  ctx.translate(cx,cy); ctx.rotate(angle);
  for(let i=1;i<cols;i++) {
    const x=-halfW+halfW*2*i/cols;
    ctx.beginPath(); ctx.moveTo(x,-halfH); ctx.lineTo(x,halfH); ctx.stroke();
  }
  for(let j=1;j<rows;j++) {
    const y=-halfH+halfH*2*j/rows;
    ctx.beginPath(); ctx.moveTo(-halfW,y); ctx.lineTo(halfW,y); ctx.stroke();
  }
  ctx.restore();
}

// ─── Main draw ────────────────────────────────────────────────────────────────
function drawFrame(ctx:CanvasRenderingContext2D, elapsed:number): number {
  const t=Math.min(elapsed/DURATION,1);

  ctx.clearRect(0,0,W,H);
  ctx.fillStyle=COL_BG; ctx.fillRect(0,0,W,H);

  // ── phase fractions ──────────────────────────────────────────────────────────
  const pTri    = eO3(ph(t,0.00,0.10));   // triangle
  const pSqA    = eO3(ph(t,0.10,0.26));   // a² square grows
  const pSqB    = eO3(ph(t,0.20,0.36));   // b² square grows
  const pSqC    = eO3(ph(t,0.32,0.50));   // c² outline appears
  const pMorphA = eIO3(ph(t,0.52,0.63));  // a² square → rectangle
  const pMorphB = eIO3(ph(t,0.59,0.70));  // b² square → rectangle
  const pMvA    = eIO3(ph(t,0.72,0.82));  // a-rect slides to c²
  const pMvB    = eIO3(ph(t,0.81,0.91));  // b-rect slides to c²
  // zone reveals instantly once rect arrives (no gradual fill)
  const arrivedA = eO3(ph(t,0.83,0.87));  // a-zone snaps in as flying rect fades out
  const arrivedB = eO3(ph(t,0.92,0.96));  // b-zone snaps in as flying rect fades out
  const pDiv    = eO3(ph(t,0.88,0.94));   // divider line
  const pFrm    = eO3(ph(t,0.96,1.00));   // formula

  // ── 1. c² fill zones — full zone appears once rect has arrived ───────────────
  if(pSqC>0) {
    if(arrivedA>0.002) {
      ctx.save(); ctx.globalAlpha=arrivedA;
      poly(ctx,cStrip(0,F_A)); ctx.fillStyle=COL_A+"bb"; ctx.fill();
      ctx.restore();
    }
    if(arrivedB>0.002) {
      ctx.save(); ctx.globalAlpha=arrivedB;
      poly(ctx,cStrip(F_A,1.0)); ctx.fillStyle=COL_B+"bb"; ctx.fill();
      ctx.restore();
    }
  }

  // ── 2. c² outline ───────────────────────────────────────────────────────────
  if(pSqC>0) {
    ctx.save();
    ctx.globalAlpha=pSqC;
    ctx.translate(CTR_C.x,CTR_C.y); ctx.scale(pSqC,pSqC); ctx.translate(-CTR_C.x,-CTR_C.y);
    if(arrivedA>0||arrivedB>0) { ctx.shadowColor=COL_C; ctx.shadowBlur=16; }
    poly(ctx,SQ_C); ctx.strokeStyle=COL_C; ctx.lineWidth=3/pSqC; ctx.stroke();
    ctx.restore();
    if(pMvA<0.05) {
      lbl(ctx,"c²",CTR_C.x,CTR_C.y,COL_C,22,pSqC);
    }
  }

  // ── 3. Divider line a-zone / b-zone ─────────────────────────────────────────
  if(pDiv>0.02) {
    const dp1={x:260+PERP.x*F_A,y:190+PERP.y*F_A};
    const dp2={x:420+PERP.x*F_A,y:310+PERP.y*F_A};
    ctx.save(); ctx.globalAlpha=pDiv*0.88;
    ctx.strokeStyle="#fff"; ctx.lineWidth=1.8; ctx.setLineDash([6,4]);
    ctx.beginPath(); ctx.moveTo(dp1.x,dp1.y); ctx.lineTo(dp2.x,dp2.y); ctx.stroke();
    ctx.setLineDash([]); ctx.restore();
  }

  // ── 4. Square a² morphing to rectangle ──────────────────────────────────────
  if(pSqA>0) {
    // shape alpha: quick fade-out right as the slide begins (flying rect takes over seamlessly)
    const shapeAlpha = Math.min(pSqA*2,1) * Math.max(0, 1 - pMvA*5);
    if(shapeAlpha>0.005) {
      const morphed = lerpPts(SQ_A, RECT_A, pMorphA);
      // reorder [BR,TR,TL,BL] → [TL,TR,BR,BL] for the grid function
      const gridPts = [morphed[2],morphed[1],morphed[0],morphed[3]];
      const ctr = avgPts(morphed);
      drawMorphShape(ctx,gridPts,1,1,COL_A+"44",COL_A,shapeAlpha,
        ctr.x,ctr.y,"a²",pMorphA);
    }
  }

  // ── 5. Square b² morphing to rectangle ──────────────────────────────────────
  if(pSqB>0) {
    const shapeAlpha = Math.min(pSqB*2,1) * Math.max(0, 1 - pMvB*5);
    if(shapeAlpha>0.005) {
      const morphed = lerpPts(SQ_B, RECT_B, pMorphB);
      // SQ_B already in [TL,TR,BR,BL] order
      const ctr = avgPts(morphed);
      drawMorphShape(ctx,morphed,1,1,COL_B+"44",COL_B,shapeAlpha,
        ctr.x,ctr.y,"b²",pMorphB);
    }
  }

  // ── 6. Flying rectangle a² — label travels with rect, stays after arriving ───
  if(pMvA>0) {
    const flyX   = lerp(CTR_A.x, DST_A.x, pMvA);
    const flyY   = lerp(CTR_A.y, DST_A.y, pMvA);
    const flyAng = ANGLE_C * pMvA;
    const slideIn  = Math.min(pMvA * 5, 1);
    const fadeOut  = Math.max(0, 1 - eO3(ph(t, 0.82, 0.88)));
    const flyAlpha = slideIn * fadeOut;
    drawFlyingRect(ctx,flyX,flyY,flyAng,100,36,flyAlpha,COL_A+"66",COL_A);
    // label travels with the rectangle
    if(flyAlpha>0.005) lbl(ctx,"a²",flyX,flyY,"#e0f7ff",15,flyAlpha);
  }
  // label stays at destination after rect fades out
  if(arrivedA>0.005) {
    lbl(ctx,"a²",DST_A.x,DST_A.y,"#e0f7ff",15,arrivedA);
  }

  // ── 7. Flying rectangle b² — label travels with rect, stays after arriving ───
  if(pMvB>0) {
    const flyX   = lerp(CTR_B.x, DST_B.x, pMvB);
    const flyY   = lerp(CTR_B.y, DST_B.y, pMvB);
    const flyAng = ANGLE_C * pMvB;
    const slideIn  = Math.min(pMvB * 5, 1);
    const fadeOut  = Math.max(0, 1 - eO3(ph(t, 0.91, 0.96)));
    const flyAlpha = slideIn * fadeOut;
    drawFlyingRect(ctx,flyX,flyY,flyAng,100,64,flyAlpha,COL_B+"66",COL_B);
    // label travels with the rectangle
    if(flyAlpha>0.005) lbl(ctx,"b²",flyX,flyY,"#e0ffe0",15,flyAlpha);
  }
  // label stays at destination after rect fades out
  if(arrivedB>0.005) {
    lbl(ctx,"b²",DST_B.x,DST_B.y,"#e0ffe0",15,arrivedB);
  }

  // ── 9. Triangle ──────────────────────────────────────────────────────────────
  if(pTri>0) {
    ctx.save(); ctx.globalAlpha=pTri;
    poly(ctx,[C_PT,B_PT,A_PT]);
    ctx.fillStyle="rgba(255,255,255,0.10)"; ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,0.95)"; ctx.lineWidth=2.5; ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(C_PT.x,C_PT.y-15); ctx.lineTo(C_PT.x+15,C_PT.y-15); ctx.lineTo(C_PT.x+15,C_PT.y);
    ctx.strokeStyle="rgba(255,255,255,0.55)"; ctx.lineWidth=1.5; ctx.stroke();
    ctx.restore();
  }


  // ── 11. Formula banner ───────────────────────────────────────────────────────
  if(pFrm>0) {
    const fx=W/2, fy=H-40;
    ctx.save(); ctx.globalAlpha=pFrm;
    ctx.shadowColor="#fde047"; ctx.shadowBlur=20;
    ctx.fillStyle="rgba(234,179,8,0.20)"; ctx.strokeStyle="#eab308"; ctx.lineWidth=1.5;
    roundRect(ctx,fx-152,fy-20,304,40,10); ctx.fill(); ctx.stroke();
    ctx.shadowBlur=12; ctx.fillStyle="#fde047";
    ctx.font="bold 20px Arial,sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText("a² + b² = c²  ✓",fx,fy);
    ctx.restore();
  }

  return t;
}

// ─── React component ──────────────────────────────────────────────────────────
type UIState="idle"|"playing"|"paused"|"done";

const FIXED_SPEED = 0.5;

const PythagorasSquaresAnimation:React.FC=()=>{
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const squi = SQ_UI_TRANSLATIONS[language as keyof typeof SQ_UI_TRANSLATIONS] ?? SQ_UI_TRANSLATIONS.id;
  const translateNarration = (text: string) =>
    NARRATION_TRANSLATIONS[language]?.[text] ?? text;
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const anim=useRef({running:false,raf:0,startTs:0,elapsed:0,speed:FIXED_SPEED});
  const stepRef=useRef<(ts:number)=>void>(()=>{});
  const [uiState,setUiState]=useState<UIState>("idle");
  const [narration,setNarration]=useState(NARRATION[0].text);
  const [prog,setProg]=useState(0);

  const draw=useCallback((elapsed:number)=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d"); if(!ctx) return;
    const t=drawFrame(ctx,elapsed);
    setProg(t);
    let narr=NARRATION[0].text;
    for(const n of NARRATION){if(t>=n.t) narr=n.text;}
    setNarration(narr);
  },[]);

  useEffect(()=>{
    stepRef.current=(ts:number)=>{
      const a=anim.current; if(!a.running) return;
      const elapsed=(ts-a.startTs)*a.speed;
      if(elapsed>=DURATION){a.running=false;a.elapsed=DURATION;draw(DURATION);setUiState("done");return;}
      a.elapsed=elapsed; draw(elapsed);
      a.raf=requestAnimationFrame(stepRef.current);
    };
  });

  const play=useCallback(()=>{
    const a=anim.current; if(a.running) return;
    a.running=true; a.startTs=performance.now()-a.elapsed/a.speed;
    setUiState("playing"); a.raf=requestAnimationFrame(stepRef.current);
  },[]);

  const pause=useCallback(()=>{
    anim.current.running=false; cancelAnimationFrame(anim.current.raf); setUiState("paused");
  },[]);

  const reset=useCallback(()=>{
    const a=anim.current; a.running=false; cancelAnimationFrame(a.raf);
    a.elapsed=0; a.startTs=0; setUiState("idle"); setProg(0);
    setNarration(NARRATION[0].text); draw(0);
  },[draw]);

  useEffect(()=>{draw(0);},[draw]);
  useEffect(()=>()=>cancelAnimationFrame(anim.current.raf),[]);

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-2 w-full text-center">
        <p className="font-display text-xs font-bold text-blue-300 uppercase tracking-widest">{squi.title}</p>
        <p className={isDark ? "font-body text-xs text-white/50 mt-0.5" : "font-body text-xs text-gray-500 mt-0.5"}>{squi.subtitle}</p>
      </div>

      <div className="w-full max-w-lg mx-auto rounded-xl overflow-hidden border border-slate-700/50" style={{background:COL_BG}}>
        <canvas ref={canvasRef} width={W} height={H} className="w-full h-auto block"/>
      </div>

      <div className={isDark ? "w-full max-w-lg mx-auto bg-slate-800 rounded-full h-1.5 overflow-hidden" : "w-full max-w-lg mx-auto bg-gray-200 rounded-full h-1.5 overflow-hidden"}>
        <div className="h-full rounded-full" style={{
          width:`${prog*100}%`,
          background:"linear-gradient(to right,#4fc3f7,#81c784,#ffb74d)",
          transition:"width 80ms linear",
        }}/>
      </div>

      <div className="flex gap-3 items-center flex-wrap justify-center">
        {uiState==="idle"&&(
          <button onClick={play} className="px-6 py-2.5 rounded-xl font-body font-bold text-sm bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95">{squi.play}</button>
        )}
        {uiState==="playing"&&(
          <button onClick={pause} className="px-6 py-2.5 rounded-xl font-body font-bold text-sm bg-slate-700 hover:bg-slate-600 border border-slate-500 text-white transition-all active:scale-95">{squi.pause}</button>
        )}
        {uiState==="paused"&&(
          <>
            <button onClick={play} className="px-6 py-2.5 rounded-xl font-body font-bold text-sm bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95">{squi.resume}</button>
            <button onClick={reset} className="px-5 py-2.5 rounded-xl font-body font-bold text-sm bg-slate-700 hover:bg-slate-600 border border-slate-500 text-white transition-all active:scale-95">{squi.reset}</button>
          </>
        )}
        {uiState==="done"&&(
          <button onClick={reset} className="px-6 py-2.5 rounded-xl font-body font-bold text-sm bg-slate-700 hover:bg-slate-600 border border-slate-500 text-white transition-all active:scale-95">{squi.replay}</button>
        )}
      </div>

      <div className={isDark ? "w-full max-w-lg mx-auto bg-slate-800/60 border border-slate-600/40 rounded-xl px-4 py-3 min-h-[52px] flex items-center" : "w-full max-w-lg mx-auto bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 min-h-[52px] flex items-center"}>
        <p className={isDark ? "font-body text-sm text-white/85 leading-relaxed" : "font-body text-sm text-gray-700 leading-relaxed"}>{translateNarration(narration)}</p>
      </div>

      <p className={`text-center font-body text-xs max-w-sm leading-relaxed transition-colors duration-300 ${
        uiState==="done"?"text-yellow-300 font-semibold":uiState==="playing"?"text-cyan-300":"text-white/45"
      }`}>
        {uiState==="idle"&&squi.hintIdle}
        {uiState==="playing"&&squi.hintPlaying}
        {uiState==="paused"&&squi.hintPaused}
        {uiState==="done"&&squi.hintDone}
      </p>
    </div>
  );
};

export default PythagorasSquaresAnimation;
