import React, { useRef, useEffect, useState, useCallback } from "react";
import { InlineMath } from "react-katex";
import { RefreshCw, Info, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";

/* ─── Canvas constants ─────────────────────────────────── */
const CW = 700, CH = 390;
const GY = 348;           // ground Y in canvas
const GRAVITY = 950;      // px/s² (downward in canvas)
const PX_M = 22;          // pixels per meter
const BIRD_R = 19;
const MAX_DRAG = 70;
const POWER    = 10;

// Slingshot
const SL_X = 102, SL_FORK_Y = GY - 88;
const SL_FL = SL_X - 14, SL_FR = SL_X + 14;
const REST_X = SL_X, REST_Y = SL_FORK_Y - BIRD_R - 2;

type Phase = "ready" | "aiming" | "flying" | "celebrating" | "won" | "lost";

interface Pig  { id:number; cx:number; cy:number; r:number; alive:boolean; boom:number }
interface Block { x:number; y:number; w:number; h:number; kind:"wood"|"stone"; hp:number; maxHp:number }
interface Star  { x:number; y:number; vx:number; vy:number; life:number; color:string; size:number }

function initLevel() {
  return {
    pigs: [
      { id:1, cx:447, cy:GY-90, r:23, alive:true, boom:0 },
      { id:2, cx:563, cy:GY-132, r:23, alive:true, boom:0 },
      { id:3, cx:641, cy:GY-27, r:23, alive:true, boom:0 },
    ] as Pig[],
    blocks: [
      { x:422, y:GY-82, w:50, h:82, kind:"wood",  hp:2, maxHp:2 },
      { x:530, y:GY-65, w:66, h:65, kind:"wood",  hp:2, maxHp:2 },
      { x:537, y:GY-126,w:52, h:61, kind:"stone", hp:3, maxHp:3 },
      { x:615, y:GY-50, w:26, h:50, kind:"stone", hp:2, maxHp:2 },
    ] as Block[],
  };
}

/* ─── Translations ─────────────────────────────────────── */
function getTrans(lang: Language) {
  return {
    hint_ready:   lang === "id" ? "🏹 Tarik burung ke belakang, lalu lepaskan!"
                : lang === "en" ? "🏹 Pull the bird back, then release!"
                :                 "🏹 鳥を後ろに引いて、離してください！",
    hint_lost:    lang === "id" ? "😢 Percobaan habis! Klik Reset untuk coba lagi."
                : lang === "en" ? "😢 Out of attempts! Click Reset to try again."
                :                 "😢 試行回数がなくなりました！リセットをクリックしてもう一度。",
    hint_again:   lang === "id" ? "🏹 Tarik lagi!"
                : lang === "en" ? "🏹 Pull again!"
                :                 "🏹 もう一度引いて！",
    hint_won:     lang === "id" ? "🎉 Semua babi terkalahkan! Fungsi kuadrat terbukti!"
                : lang === "en" ? "🎉 All pigs defeated! Quadratic function proven!"
                :                 "🎉 全ての豚を倒した！二次関数の証明！",
    hint_release: lang === "id" ? "🔓 Lepaskan untuk meluncurkan!"
                : lang === "en" ? "🔓 Release to launch!"
                :                 "🔓 離して発射！",
    launching:    (a: number, b: string, c: string) =>
                  lang === "id" ? `Meluncur! a=${a}, b=${b}, c=${c}`
                : lang === "en" ? `Launched! a=${a}, b=${b}, c=${c}`
                :                 `発射！a=${a}, b=${b}, c=${c}`,
    hud_shots:    (n: number) =>
                  lang === "id" ? `🏹 ${n} lemparan`
                : lang === "en" ? `🏹 ${n} shots`
                :                 `🏹 ${n} 発`,
    overlay_won:  lang === "id" ? "🎉 LEVEL SELESAI!"
                : lang === "en" ? "🎉 LEVEL CLEAR!"
                :                 "🎉 レベルクリア！",
    overlay_lost: lang === "id" ? "😢 COBA LAGI!"
                : lang === "en" ? "😢 TRY AGAIN!"
                :                 "😢 もう一度！",
    overlay_score: (s: number) =>
                  lang === "id" ? `Skor: ${s}`
                : lang === "en" ? `Score: ${s}`
                :                 `スコア: ${s}`,
    overlay_noshots: lang === "id" ? "Semua lemparan habis!"
                   : lang === "en" ? "All throws used up!"
                   :                 "すべての投球を使い切りました！",
    header_title: lang === "id" ? "🐦 Laboratorium Parabola — Angry Math Bird"
                : lang === "en" ? "🐦 Parabola Lab — Angry Math Bird"
                :                 "🐦 放物線ラボ — アングリーマスバード",
    header_sub:   lang === "id" ? "Lintasan burung mengikuti fungsi kuadrat h(x) = ax² + bx + c"
                : lang === "en" ? "The bird's trajectory follows the quadratic function h(x) = ax² + bx + c"
                :                 "鳥の軌道は二次関数 h(x) = ax² + bx + c に従います",
    eq_label:     lang === "id" ? "Persamaan Lintasan"
                : lang === "en" ? "Trajectory Equation"
                :                 "軌道の方程式",
    peak_label:   lang === "id" ? "📐 Titik Puncak (Maks)"
                : lang === "en" ? "📐 Vertex (Max)"
                :                 "📐 頂点（最大値）",
    peak_horiz:   lang === "id" ? "Jarak horizontal:"
                : lang === "en" ? "Horizontal distance:"
                :                 "水平距離：",
    peak_height:  lang === "id" ? "Tinggi maksimum:"
                : lang === "en" ? "Max height:"
                :                 "最大高さ：",
    pull_hint:    lang === "id" ? "Tarik burung untuk melihat persamaan lintasannya! 🎯"
                : lang === "en" ? "Pull the bird to see its trajectory equation! 🎯"
                :                 "鳥を引いて軌道の方程式を見よう！🎯",
    coeff_a:      lang === "id" ? "a (buka bawah)"
                : lang === "en" ? "a (opens down)"
                :                 "a (下に開く)",
    coeff_b:      lang === "id" ? "b (sudut)"
                : lang === "en" ? "b (angle)"
                :                 "b (角度)",
    coeff_c:      lang === "id" ? "c (tinggi awal)"
                : lang === "en" ? "c (init height)"
                :                 "c (初期高さ)",
    won_title:    (s: number) =>
                  lang === "id" ? `🎉 Level Selesai! Skor: ${s}`
                : lang === "en" ? `🎉 Level Clear! Score: ${s}`
                :                 `🎉 レベルクリア！スコア: ${s}`,
    won_replay:   lang === "id" ? "Klik reset untuk main lagi dengan sudut berbeda!"
                : lang === "en" ? "Click reset to play again with a different angle!"
                :                 "リセットをクリックして別の角度で再挑戦！",
  };
}

/* ─── Drawing helpers ─────────────────────────────────── */
function drawBackground(ctx: CanvasRenderingContext2D) {
  const skyGrad = ctx.createLinearGradient(0,0,0,CH);
  skyGrad.addColorStop(0,"#7ec8e3"); skyGrad.addColorStop(1,"#b5ddf0");
  ctx.fillStyle = skyGrad; ctx.fillRect(0,0,CW,CH);

  // clouds
  [[120,55,50],[260,40,38],[430,65,45],[590,48,40]].forEach(([cx,cy,r]) => {
    ctx.fillStyle="#ffffffcc";
    [-40,-20,0,20,40].forEach(dx => { ctx.beginPath(); ctx.arc(cx+dx,cy,r*0.55+Math.abs(dx)*0.1,0,Math.PI*2); ctx.fill(); });
  });

  // hills
  ctx.fillStyle="#5da832";
  [[160,GY+5,120],[380,GY+5,90],[580,GY+5,110]].forEach(([x,y,r]) => { ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); });

  // ground
  const gg = ctx.createLinearGradient(0,GY,0,CH);
  gg.addColorStop(0,"#5ca62d"); gg.addColorStop(0.15,"#4a8c22"); gg.addColorStop(1,"#3a6b18");
  ctx.fillStyle=gg; ctx.fillRect(0,GY,CW,CH-GY);
  // grass detail
  ctx.strokeStyle="#6dc936"; ctx.lineWidth=2;
  for(let gx=10;gx<CW;gx+=18){ctx.beginPath();ctx.moveTo(gx,GY);ctx.lineTo(gx-4,GY-7);ctx.stroke();ctx.beginPath();ctx.moveTo(gx+4,GY);ctx.lineTo(gx,GY-9);ctx.stroke();}
}

function drawSling(ctx: CanvasRenderingContext2D) {
  ctx.lineWidth=9; ctx.lineCap="round"; ctx.strokeStyle="#7a4b14";
  // main post
  ctx.beginPath(); ctx.moveTo(SL_X,GY); ctx.lineTo(SL_X,SL_FORK_Y+12); ctx.stroke();
  // fork left
  ctx.lineWidth=8; ctx.strokeStyle="#8b5a1a";
  ctx.beginPath(); ctx.moveTo(SL_X,SL_FORK_Y+20); ctx.lineTo(SL_FL,SL_FORK_Y); ctx.stroke();
  // fork right
  ctx.beginPath(); ctx.moveTo(SL_X,SL_FORK_Y+20); ctx.lineTo(SL_FR,SL_FORK_Y); ctx.stroke();
  // nubs
  ctx.fillStyle="#5c3a0d";
  ctx.beginPath(); ctx.arc(SL_FL,SL_FORK_Y,5,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(SL_FR,SL_FORK_Y,5,0,Math.PI*2); ctx.fill();
}

function drawRubber(ctx: CanvasRenderingContext2D, bx:number, by:number, pulling:boolean) {
  ctx.lineWidth=4; ctx.strokeStyle=pulling?"#8b3a0a":"#a0522d"; ctx.lineCap="round";
  ctx.beginPath(); ctx.moveTo(SL_FL,SL_FORK_Y); ctx.lineTo(bx,by); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(SL_FR,SL_FORK_Y); ctx.lineTo(bx,by); ctx.stroke();
}

function drawBird(ctx: CanvasRenderingContext2D, x:number, y:number, r:number, angle=0, happy=false) {
  ctx.save(); ctx.translate(x,y); ctx.rotate(angle);
  // shadow
  ctx.fillStyle="rgba(0,0,0,0.15)"; ctx.beginPath(); ctx.ellipse(0,r+2,r*0.9,r*0.35,0,0,Math.PI*2); ctx.fill();
  // body
  const bg=ctx.createRadialGradient(-r*0.3,-r*0.3,2,0,0,r);
  bg.addColorStop(0,"#ff9a3c"); bg.addColorStop(0.6,"#e85c00"); bg.addColorStop(1,"#b33e00");
  ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();
  // feather tufts top
  ctx.fillStyle="#ff6a00";
  [[-4,-r+2],[0,-r-3],[4,-r+2]].forEach(([fx,fy])=>{ ctx.beginPath(); ctx.ellipse(fx,fy,3,6,-0.2,0,Math.PI*2); ctx.fill(); });
  // white belly
  ctx.fillStyle="rgba(255,255,255,0.25)"; ctx.beginPath(); ctx.ellipse(2,3,r*0.5,r*0.4,0,0,Math.PI*2); ctx.fill();
  // eyebrows (angry)
  ctx.strokeStyle="#5c2000"; ctx.lineWidth=2.5; ctx.lineCap="round";
  if(!happy){ ctx.beginPath(); ctx.moveTo(-r*0.55,-r*0.25); ctx.lineTo(-r*0.2,-r*0.1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(r*0.55,-r*0.25); ctx.lineTo(r*0.2,-r*0.1); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(-r*0.55,-r*0.3); ctx.quadraticCurveTo(-r*0.35,-r*0.15,-r*0.1,-r*0.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(r*0.55,-r*0.3); ctx.quadraticCurveTo(r*0.35,-r*0.15,r*0.1,-r*0.2); ctx.stroke();
  }
  // eyes
  ctx.fillStyle="white"; ctx.beginPath(); ctx.arc(-r*0.32,-r*0.1,r*0.22,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(r*0.32,-r*0.1,r*0.22,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#1a1a1a"; ctx.beginPath(); ctx.arc(-r*0.28,-r*0.08,r*0.12,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(r*0.36,-r*0.08,r*0.12,0,Math.PI*2); ctx.fill();
  // beak
  ctx.fillStyle="#f5c518"; ctx.strokeStyle="#c9a010"; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(-r*0.22,r*0.15); ctx.lineTo(r*0.22,r*0.15); ctx.lineTo(0,r*0.45); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}

function drawPig(ctx: CanvasRenderingContext2D, p: Pig) {
  if(!p.alive && p.boom<=0) return;
  const { cx,cy,r } = p;
  const alpha = p.boom>0 ? p.boom : 1;
  ctx.save(); ctx.globalAlpha=alpha;
  if(p.boom>0){ const s=1+( 1-p.boom)*0.5; ctx.translate(cx,cy); ctx.scale(s,s); ctx.translate(-cx,-cy); }

  // shadow
  ctx.fillStyle="rgba(0,0,0,0.13)"; ctx.beginPath(); ctx.ellipse(cx,cy+r-2,r*0.85,r*0.3,0,0,Math.PI*2); ctx.fill();
  // body
  const pg=ctx.createRadialGradient(cx-r*0.25,cy-r*0.25,1,cx,cy,r);
  pg.addColorStop(0,"#7bc950"); pg.addColorStop(0.65,"#4a9a22"); pg.addColorStop(1,"#2f6b12");
  ctx.fillStyle=pg; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
  // ears
  ctx.fillStyle="#3d8018";
  ctx.beginPath(); ctx.ellipse(cx-r*0.62,cy-r*0.6,r*0.28,r*0.35,-0.4,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx+r*0.62,cy-r*0.6,r*0.28,r*0.35,0.4,0,Math.PI*2); ctx.fill();
  // snout
  ctx.fillStyle="#5ab030"; ctx.beginPath(); ctx.ellipse(cx,cy+r*0.25,r*0.4,r*0.3,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#2d6610"; ctx.beginPath(); ctx.arc(cx-r*0.15,cy+r*0.22,3,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+r*0.15,cy+r*0.22,3,0,Math.PI*2); ctx.fill();
  // eyes
  ctx.fillStyle="white"; ctx.beginPath(); ctx.arc(cx-r*0.32,cy-r*0.18,r*0.22,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+r*0.32,cy-r*0.18,r*0.22,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#111"; ctx.beginPath(); ctx.arc(cx-r*0.28,cy-r*0.16,r*0.11,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+r*0.36,cy-r*0.16,r*0.11,0,Math.PI*2); ctx.fill();
  // smile
  ctx.strokeStyle="#1e4f0a"; ctx.lineWidth=2; ctx.lineCap="round";
  ctx.beginPath(); ctx.arc(cx,cy+r*0.1,r*0.25,0.2,Math.PI-0.2); ctx.stroke();
  ctx.restore();
}

function drawBlock(ctx: CanvasRenderingContext2D, b: Block) {
  const dmg = 1 - b.hp/b.maxHp;
  if(b.kind==="wood"){
    ctx.fillStyle=dmg>0.5?"#9b6a1a":"#c4872a";
    ctx.strokeStyle="#7a5010"; 
  } else {
    ctx.fillStyle=dmg>0.5?"#7a7a8a":"#a0a0b8";
    ctx.strokeStyle="#606070";
  }
  ctx.lineWidth=2;
  ctx.beginPath(); ctx.roundRect(b.x,b.y,b.w,b.h,4); ctx.fill(); ctx.stroke();
  // grain/texture
  if(b.kind==="wood"){
    ctx.strokeStyle="rgba(0,0,0,0.1)"; ctx.lineWidth=1;
    for(let i=8;i<b.h;i+=10){ ctx.beginPath(); ctx.moveTo(b.x+2,b.y+i); ctx.lineTo(b.x+b.w-2,b.y+i); ctx.stroke(); }
  }
  // crack marks if damaged
  if(dmg>0){
    ctx.strokeStyle="rgba(0,0,0,0.35)"; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(b.x+b.w*0.3,b.y+b.h*0.2); ctx.lineTo(b.x+b.w*0.6,b.y+b.h*0.55); ctx.stroke();
  }
}

/* ─── Main component ──────────────────────────────────── */
const AngryBirdParabola: React.FC = () => {
  const { language } = useLanguage();
  // ref so the memoized loop callback always reads the current language
  const langRef = useRef<Language>(language);
  useEffect(() => { langRef.current = language; }, [language]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const lastTRef  = useRef(0);

  const g = useRef({
    phase: "ready" as Phase,
    bx: REST_X, by: REST_Y,
    vx: 0, vy: 0,
    vx0: 0, vy0: 0, elapsed: 0,  // parametric physics
    lx: REST_X, ly: REST_Y,       // launch position
    dragX: REST_X, dragY: REST_Y,
    dragging: false,
    trail: [] as {x:number;y:number}[],
    stars: [] as Star[],
    pigs: initLevel().pigs,
    blocks: initLevel().blocks,
    shots: 5,
    score: 0,
    happyTimer: 0,
  });

  const [ui, setUi] = useState(() => {
    const t0 = getTrans("id");
    return {
      phase:"ready" as Phase,
      shots:5, score:0,
      eq: null as null|{a:number;b:number;c:number},
      peak: null as null|{xm:number;hm:number},
      hint: t0.hint_ready,
    };
  });

  /* Convert canvas coords → equation coefficients */
  function calcEquation(vx:number,vy:number,lx:number,ly:number){
    if(Math.abs(vx)<1) return null;
    const a = -0.5*GRAVITY*(PX_M)/(vx*vx);          // a in m⁻¹ · m
    const b = -vy/vx;                                 // dimensionless
    const c = (GY-ly)/PX_M;                           // launch height in m
    const xPeak = -b/(2*a);
    const hPeak = a*xPeak*xPeak + b*xPeak + c;
    return { a:parseFloat(a.toFixed(2)), b:parseFloat(b.toFixed(2)), c:parseFloat(c.toFixed(2)), peak:{xm:xPeak,hm:hPeak} };
  }

  /* Convert client coords → canvas coords */
  function toCanvas(clientX:number, clientY:number){
    const cv = canvasRef.current!;
    const rect = cv.getBoundingClientRect();
    return {
      cx: (clientX-rect.left)*(CW/rect.width),
      cy: (clientY-rect.top)*(CH/rect.height),
    };
  }

  /* Clamp drag */
  function clampDrag(mx:number, my:number){
    const dx=mx-REST_X, dy=my-REST_Y;
    const dist=Math.sqrt(dx*dx+dy*dy);
    if(dist>MAX_DRAG){
      const ratio=MAX_DRAG/dist;
      return {x:REST_X+dx*ratio, y:REST_Y+dy*ratio};
    }
    return {x:mx,y:my};
  }

  /* Collision: bird vs pig */
  function checkCollisions(){
    const s=g.current;
    let hit=false;
    s.pigs.forEach(p=>{
      if(!p.alive) return;
      const dist=Math.sqrt((s.bx-p.cx)**2+(s.by-p.cy)**2);
      if(dist<BIRD_R+p.r-4){
        p.alive=false; p.boom=1.0;
        s.score+=100;
        // debris stars
        for(let i=0;i<12;i++){
          const ang=Math.random()*Math.PI*2;
          const spd=80+Math.random()*150;
          s.stars.push({x:p.cx,y:p.cy,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd-80,life:1,
            color:["#ffd700","#ff6600","#ff3333","#66ff33","#ffffff"][Math.floor(Math.random()*5)],size:3+Math.random()*4});
        }
        hit=true;
      }
    });
    // bird vs blocks
    s.blocks.forEach(b=>{
      if(s.bx>b.x-BIRD_R && s.bx<b.x+b.w+BIRD_R && s.by>b.y-BIRD_R && s.by<b.y+b.h+BIRD_R){
        b.hp=Math.max(0,b.hp-1);
        const newVx = s.vx*0.4;
        const newVy = -(Math.abs(s.vy)*0.3+newVx*0.2);
        // restart parametric reference from collision point
        s.lx=s.bx; s.ly=s.by; s.vx0=newVx; s.vy0=newVy; s.elapsed=0;
        s.vx=newVx; s.vy=newVy;
        hit=true;
      }
    });
    return hit;
  }

  /* Main loop */
  const loop = useCallback((now:number)=>{
    const dt = Math.min((now-lastTRef.current)/1000, 0.05);
    lastTRef.current=now;
    const s=g.current;
    const cv=canvasRef.current;
    if(!cv) return;
    const ctx=cv.getContext("2d")!;
    // use langRef so this memoized callback always gets the current language
    const tl = getTrans(langRef.current);

    /* ── Physics update (parametric — exact match with preview) ── */
    if(s.phase==="flying"){
      s.elapsed+=dt;
      s.bx = s.lx + s.vx0*s.elapsed;
      s.by = s.ly + s.vy0*s.elapsed + 0.5*GRAVITY*s.elapsed*s.elapsed;
      s.vx = s.vx0;
      s.vy = s.vy0 + GRAVITY*s.elapsed;   // velocity for rotation angle only
      s.trail.push({x:s.bx,y:s.by});
      if(s.trail.length>160) s.trail.shift();

      checkCollisions();

      const allDead=s.pigs.every(p=>!p.alive);
      if(allDead){ s.phase="celebrating"; s.happyTimer=2.5; }
      else if(s.by>GY+50||s.bx>CW+50){
        if(s.shots>1){ s.shots--; s.bx=REST_X; s.by=REST_Y; s.vx=0; s.vy=0; s.trail=[]; s.phase="ready"; }
        else { s.phase="lost"; }
        setUi(u=>({...u,phase:s.phase,shots:s.shots,hint:s.phase==="lost"? tl.hint_lost : tl.hint_again}));
      }
    }

    /* ── Pig boom animation ── */
    s.pigs.forEach(p=>{ if(p.boom>0) p.boom=Math.max(0,p.boom-dt*3); });

    /* ── Celebrating ── */
    if(s.phase==="celebrating"){
      s.happyTimer-=dt;
      if(s.happyTimer<=0){ s.phase="won";
        setUi(u=>({...u,phase:"won",score:s.score,hint:tl.hint_won})); }
    }

    /* ── Stars/particles ── */
    s.stars.forEach(st=>{ st.x+=st.vx*dt; st.y+=st.vy*dt; st.vy+=400*dt; st.life-=dt*1.2; });
    s.stars=s.stars.filter(st=>st.life>0);

    /* ── Draw ── */
    ctx.clearRect(0,0,CW,CH);
    drawBackground(ctx);

    // Parabola preview when aiming — exact parametric, extends to ground
    if(s.phase==="aiming"&&s.dragging){
      const dx=REST_X-s.dragX, dy=REST_Y-s.dragY;
      const pvx=dx*POWER, pvy=dy*POWER;
      ctx.setLineDash([6,8]); ctx.strokeStyle="rgba(255,255,80,0.7)"; ctx.lineWidth=2.5;
      ctx.beginPath();
      let first=true;
      for(let t=0;t<4;t+=0.016){
        const px2=REST_X+pvx*t;
        const py2=REST_Y+pvy*t+0.5*GRAVITY*t*t;
        if(px2<0||px2>CW) break;
        if(first){ctx.moveTo(px2,py2);first=false;}else ctx.lineTo(px2,py2);
        if(py2>=GY) break;   // stop exactly at ground
      }
      ctx.stroke(); ctx.setLineDash([]);

      // landing marker
      for(let t=0;t<4;t+=0.01){
        const py2=REST_Y+pvy*t+0.5*GRAVITY*t*t;
        if(py2>=GY){
          const lx2=REST_X+pvx*t;
          if(lx2>0&&lx2<CW){
            ctx.beginPath(); ctx.arc(lx2,GY,5,0,Math.PI*2);
            ctx.fillStyle="rgba(255,255,80,0.55)"; ctx.fill();
          }
          break;
        }
      }
    }

    // Trail
    if(s.trail.length>1){
      for(let i=1;i<s.trail.length;i++){
        const a=i/s.trail.length;
        ctx.beginPath(); ctx.arc(s.trail[i].x,s.trail[i].y,3*a,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,165,0,${a*0.7})`; ctx.fill();
      }
    }

    // Blocks
    s.blocks.forEach(b=>drawBlock(ctx,b));

    // Rubber band (before bird so bird is on top)
    if(s.phase==="ready"||s.phase==="aiming"){
      drawRubber(ctx,s.dragging?s.dragX:REST_X, s.dragging?s.dragY:REST_Y, s.dragging);
    }

    // Pigs
    s.pigs.forEach(p=>drawPig(ctx,p));

    // Slingshot (in front of ground, behind bird)
    drawSling(ctx);

    // Bird
    const bAngle = s.phase==="flying" ? Math.atan2(s.vy,s.vx)*0.6 : 0;
    const happy  = s.phase==="celebrating"||s.phase==="won";
    drawBird(ctx,s.bx,s.by,BIRD_R,bAngle,happy);

    // Stars/particles
    s.stars.forEach(st=>{
      ctx.save(); ctx.globalAlpha=Math.max(0,st.life);
      ctx.fillStyle=st.color;
      ctx.beginPath(); ctx.arc(st.x,st.y,st.size,0,Math.PI*2); ctx.fill();
      ctx.restore();
    });

    // HUD: shots remaining
    ctx.fillStyle="rgba(0,0,0,0.45)"; ctx.beginPath(); ctx.roundRect(8,8,110,34,8); ctx.fill();
    ctx.fillStyle="#fff"; ctx.font="bold 14px sans-serif"; ctx.fillText(tl.hud_shots(s.shots),16,30);

    // Score
    ctx.fillStyle="rgba(0,0,0,0.45)"; ctx.beginPath(); ctx.roundRect(CW-120,8,112,34,8); ctx.fill();
    ctx.fillStyle="#ffd700"; ctx.font="bold 14px sans-serif"; ctx.textAlign="right"; ctx.fillText(`⭐ ${s.score}`,CW-14,30); ctx.textAlign="left";

    // Won/Lost overlay
    if(s.phase==="won"||s.phase==="lost"){
      ctx.fillStyle=s.phase==="won"?"rgba(0,80,0,0.6)":"rgba(80,0,0,0.6)";
      ctx.fillRect(0,0,CW,CH);
      ctx.fillStyle="#fff"; ctx.font="bold 36px sans-serif"; ctx.textAlign="center";
      ctx.fillText(s.phase==="won"? tl.overlay_won : tl.overlay_lost, CW/2,CH/2-20);
      ctx.font="20px sans-serif";
      ctx.fillText(s.phase==="won"? tl.overlay_score(s.score) : tl.overlay_noshots, CW/2,CH/2+20);
      ctx.textAlign="left";
    }

    rafRef.current=requestAnimationFrame(loop);
  },[]);

  useEffect(()=>{
    lastTRef.current=performance.now();
    rafRef.current=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(rafRef.current);
  },[loop]);

  /* ── Event helpers ── */
  function startDrag(cx:number,cy:number){
    const s=g.current;
    if(s.phase!=="ready"&&s.phase!=="aiming") return;
    const dist=Math.sqrt((cx-s.bx)**2+(cy-s.by)**2);
    if(dist<BIRD_R*2.5){ s.dragging=true; s.phase="aiming"; }
  }
  function moveDrag(cx:number,cy:number){
    const s=g.current;
    if(!s.dragging) return;
    const clamped=clampDrag(cx,cy);
    s.dragX=clamped.x; s.dragY=clamped.y;
    // preview equation
    const dx=REST_X-clamped.x, dy=REST_Y-clamped.y;
    if(Math.sqrt(dx*dx+dy*dy)>8){
      const res=calcEquation(dx*POWER,dy*POWER,REST_X,REST_Y);
      const t = getTrans(language);
      if(res) setUi(u=>({...u,eq:{a:res.a,b:res.b,c:res.c},peak:res.peak,hint:t.hint_release}));
    }
  }
  function endDrag(){
    const s=g.current;
    if(!s.dragging) return;
    s.dragging=false;
    const dx=REST_X-s.dragX, dy=REST_Y-s.dragY;
    const dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<10){ s.phase="ready"; s.dragX=REST_X; s.dragY=REST_Y; return; }
    s.vx0=dx*POWER; s.vy0=dy*POWER; s.elapsed=0;
    s.vx=s.vx0; s.vy=s.vy0;
    s.lx=REST_X; s.ly=REST_Y;
    s.bx=REST_X; s.by=REST_Y;
    s.phase="flying"; s.trail=[];
    playPopSound();
    const res=calcEquation(s.vx0,s.vy0,s.lx,s.ly);
    const t = getTrans(language);
    if(res) setUi(u=>({...u,phase:"flying",shots:s.shots,eq:{a:res.a,b:res.b,c:res.c},peak:res.peak,
      hint:t.launching(res.a, res.b.toFixed(2), res.c.toFixed(1))}));
  }

  const onMouseDown=(e:React.MouseEvent)=>{ const {cx,cy}=toCanvas(e.clientX,e.clientY); startDrag(cx,cy); };
  const onMouseMove=(e:React.MouseEvent)=>{ const {cx,cy}=toCanvas(e.clientX,e.clientY); moveDrag(cx,cy); };
  const onMouseUp=()=>endDrag();
  const onTouchStart=(e:React.TouchEvent)=>{ e.preventDefault(); const touch=e.touches[0]; const {cx,cy}=toCanvas(touch.clientX,touch.clientY); startDrag(cx,cy); };
  const onTouchMove=(e:React.TouchEvent)=>{ e.preventDefault(); const touch=e.touches[0]; const {cx,cy}=toCanvas(touch.clientX,touch.clientY); moveDrag(cx,cy); };
  const onTouchEnd=(e:React.TouchEvent)=>{ e.preventDefault(); endDrag(); };

  function reset(){
    playPopSound();
    const lv=initLevel();
    const s=g.current;
    const t = getTrans(language);
    Object.assign(s,{ phase:"ready",bx:REST_X,by:REST_Y,vx:0,vy:0,vx0:0,vy0:0,elapsed:0,
      dragX:REST_X,dragY:REST_Y,dragging:false,trail:[],stars:[],pigs:lv.pigs,blocks:lv.blocks,
      shots:5,score:0,happyTimer:0 });
    setUi({ phase:"ready",shots:5,score:0,eq:null,peak:null,hint:t.hint_ready });
  }

  const t = getTrans(language);
  const { eq, peak, hint, phase, score } = ui;
  const fmt=(n:number)=>n>=0?`+${n.toFixed(2)}`:`${n.toFixed(2)}`;

  return (
    <div className="bg-gradient-to-b from-slate-900/95 to-blue-950/70 border border-blue-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/30">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-blue-500/20 bg-blue-900/20">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-400" />
          <div>
            <p className="font-display text-sm font-bold text-orange-300">{t.header_title}</p>
            <p className="font-body text-xs text-white/40">{t.header_sub}</p>
          </div>
        </div>
        <button onClick={reset} className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 text-white/50 hover:text-white transition-all" title="Reset">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas ref={canvasRef} width={CW} height={CH}
          style={{ width:"100%", height:"auto", cursor:"crosshair", display:"block" }}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        />
      </div>

      {/* Math panel */}
      <div className="p-4 space-y-3 border-t border-white/10">
        {/* Hint */}
        <div className="bg-blue-900/30 border border-blue-500/20 rounded-xl px-4 py-2">
          <p className="font-body text-xs text-blue-200">{hint}</p>
        </div>

        {eq ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Equation */}
            <div className="bg-slate-900/70 border border-cyan-500/30 rounded-xl p-3 space-y-2">
              <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-wide flex items-center gap-1">
                <Info className="w-3 h-3" /> {t.eq_label}
              </p>
              <div className="text-center">
                <InlineMath math={`h(x) = ${eq.a}x^2 ${fmt(eq.b)}x ${fmt(eq.c)}`} />
              </div>
              <div className="grid grid-cols-3 gap-1 text-xs font-body">
                <div className="bg-red-900/30 border border-red-500/20 rounded-lg p-1.5 text-center">
                  <p className="text-red-300 font-bold">{eq.a}</p>
                  <p className="text-white/40 text-[10px]">{t.coeff_a}</p>
                </div>
                <div className="bg-green-900/30 border border-green-500/20 rounded-lg p-1.5 text-center">
                  <p className="text-green-300 font-bold">{eq.b.toFixed(2)}</p>
                  <p className="text-white/40 text-[10px]">{t.coeff_b}</p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/20 rounded-lg p-1.5 text-center">
                  <p className="text-yellow-300 font-bold">{eq.c.toFixed(1)}</p>
                  <p className="text-white/40 text-[10px]">{t.coeff_c}</p>
                </div>
              </div>
            </div>

            {/* Peak info */}
            {peak && (
              <div className="bg-slate-900/70 border border-yellow-500/30 rounded-xl p-3 space-y-2">
                <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-wide">{t.peak_label}</p>
                <div className="space-y-1 font-body text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-xs">{t.peak_horiz}</span>
                    <span className="text-cyan-300 font-bold">{peak.xm.toFixed(2)} m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-xs">{t.peak_height}</span>
                    <span className="text-yellow-300 font-bold">{Math.max(0,peak.hm).toFixed(2)} m</span>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg px-2 py-1 text-center text-xs">
                    <InlineMath math={`x_p = -\\frac{b}{2a} = -\\frac{${eq.b.toFixed(2)}}{2 \\times ${eq.a}} \\approx ${peak.xm.toFixed(2)}`} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-white/5 rounded-xl p-3 text-center">
            <p className="font-body text-xs text-white/30">{t.pull_hint}</p>
            <div className="mt-2 text-center opacity-40">
              <InlineMath math="h(x) = ax^2 + bx + c" />
            </div>
          </div>
        )}

        {/* Concept reminder */}
        <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl px-4 py-2 flex gap-2">
          <span className="text-purple-400 text-sm shrink-0">💡</span>
          <p className="font-body text-xs text-purple-200 leading-relaxed">
            {language === "id" ? (
              <>Lintasan benda yang dilempar selalu berbentuk <strong>parabola</strong> karena pengaruh gravitasi.
              Nilai <strong className="text-red-300">a&lt;0</strong> → parabola terbuka ke bawah → ada nilai <strong className="text-yellow-300">maksimum</strong> (ketinggian puncak).
              Inilah penerapan fungsi kuadrat di fisika!</>
            ) : language === "en" ? (
              <>The trajectory of a thrown object always forms a <strong>parabola</strong> due to gravity.
              Value <strong className="text-red-300">a&lt;0</strong> → parabola opens downward → there is a <strong className="text-yellow-300">maximum</strong> value (peak height).
              This is the quadratic function applied in physics!</>
            ) : (
              <>投げられた物体の軌道は、重力の影響で常に<strong>放物線</strong>を描きます。
              <strong className="text-red-300">a&lt;0</strong> → 放物線は下に開く → <strong className="text-yellow-300">最大値</strong>（頂点の高さ）が存在します。
              これが物理における二次関数の応用です！</>
            )}
          </p>
        </div>

        {phase==="won" && (
          <div className="bg-green-900/30 border border-green-400/40 rounded-xl p-3 text-center">
            <p className="font-display text-sm font-bold text-green-300">{t.won_title(score)}</p>
            <p className="font-body text-xs text-white/50 mt-1">{t.won_replay}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AngryBirdParabola;
