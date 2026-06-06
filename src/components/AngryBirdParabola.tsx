import React, { useRef, useEffect, useState, useCallback } from "react";
import { InlineMath, BlockMath } from "react-katex";
import { RefreshCw, Info, Trophy, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";

/* ─── Canvas constants ─────────────────────────────────── */
const CW = 700, CH = 390;
const GY = 348;           // ground Y in canvas
const GRAVITY = 950;      // px/s² (downward in canvas)
const PX_M = 22;          // pixels per meter
const BIRD_R = 19;
const MAX_DRAG = 62;

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const lastTRef  = useRef(0);

  const g = useRef({
    phase: "ready" as Phase,
    bx: REST_X, by: REST_Y,
    vx: 0, vy: 0,
    lx: REST_X, ly: REST_Y,     // launch position
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

  const [ui, setUi] = useState({
    phase:"ready" as Phase,
    shots:5, score:0,
    eq: null as null|{a:number;b:number;c:number},
    peak: null as null|{xm:number;hm:number},
    hint:"🏹 Tarik burung ke belakang, lalu lepaskan!",
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
        s.vx*=0.4; s.vy=-(Math.abs(s.vy)*0.3+s.vx*0.2);
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

    /* ── Physics update ── */
    if(s.phase==="flying"){
      s.bx+=s.vx*dt;
      s.vy+=GRAVITY*dt;
      s.by+=s.vy*dt;
      s.trail.push({x:s.bx,y:s.by});
      if(s.trail.length>120) s.trail.shift();

      checkCollisions();

      const allDead=s.pigs.every(p=>!p.alive);
      if(allDead){ s.phase="celebrating"; s.happyTimer=2.5; }
      else if(s.by>GY+50||s.bx>CW+50){
        if(s.shots>1){ s.shots--; s.bx=REST_X; s.by=REST_Y; s.vx=0; s.vy=0; s.trail=[]; s.phase="ready"; }
        else { s.phase="lost"; }
        setUi(u=>({...u,phase:s.phase,shots:s.shots,hint:s.phase==="lost"?"😢 Percobaan habis! Klik Reset untuk coba lagi.":"🏹 Tarik lagi!"}));
      }
    }

    /* ── Pig boom animation ── */
    s.pigs.forEach(p=>{ if(p.boom>0) p.boom=Math.max(0,p.boom-dt*3); });

    /* ── Celebrating ── */
    if(s.phase==="celebrating"){
      s.happyTimer-=dt;
      if(s.happyTimer<=0){ s.phase="won";
        setUi(u=>({...u,phase:"won",score:s.score,hint:"🎉 Semua babi terkalahkan! Fungsi kuadrat terbukti!"})); }
    }

    /* ── Stars/particles ── */
    s.stars.forEach(st=>{ st.x+=st.vx*dt; st.y+=st.vy*dt; st.vy+=400*dt; st.life-=dt*1.2; });
    s.stars=s.stars.filter(st=>st.life>0);

    /* ── Draw ── */
    ctx.clearRect(0,0,CW,CH);
    drawBackground(ctx);

    // Parabola preview when aiming
    if(s.phase==="aiming"&&s.dragging){
      const dx=REST_X-s.dragX, dy=REST_Y-s.dragY;
      const power=6.5;
      const pvx=dx*power, pvy=dy*power;
      ctx.setLineDash([5,7]); ctx.strokeStyle="rgba(255,255,100,0.55)"; ctx.lineWidth=2.5;
      ctx.beginPath();
      let first=true;
      for(let t=0;t<2;t+=0.04){
        const px2=REST_X+pvx*t, py2=REST_Y+pvy*t+0.5*GRAVITY*t*t;
        if(py2>GY) break;
        if(first){ctx.moveTo(px2,py2);first=false;}else ctx.lineTo(px2,py2);
      }
      ctx.stroke(); ctx.setLineDash([]);
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
    ctx.fillStyle="#fff"; ctx.font="bold 14px sans-serif"; ctx.fillText(`🏹 ${s.shots} lemparan`,16,30);

    // Score
    ctx.fillStyle="rgba(0,0,0,0.45)"; ctx.beginPath(); ctx.roundRect(CW-120,8,112,34,8); ctx.fill();
    ctx.fillStyle="#ffd700"; ctx.font="bold 14px sans-serif"; ctx.textAlign="right"; ctx.fillText(`⭐ ${s.score}`,CW-14,30); ctx.textAlign="left";

    // Won/Lost overlay
    if(s.phase==="won"||s.phase==="lost"){
      ctx.fillStyle=s.phase==="won"?"rgba(0,80,0,0.6)":"rgba(80,0,0,0.6)";
      ctx.fillRect(0,0,CW,CH);
      ctx.fillStyle="#fff"; ctx.font="bold 36px sans-serif"; ctx.textAlign="center";
      ctx.fillText(s.phase==="won"?"🎉 LEVEL SELESAI!":"😢 COBA LAGI!",CW/2,CH/2-20);
      ctx.font="20px sans-serif"; ctx.fillText(s.phase==="won"?`Skor: ${s.score}`:"Semua lemparan habis!",CW/2,CH/2+20);
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
      const power=6.5;
      const res=calcEquation(dx*power,dy*power,REST_X,REST_Y);
      if(res) setUi(u=>({...u,eq:{a:res.a,b:res.b,c:res.c},peak:res.peak,hint:"🔓 Lepaskan untuk meluncurkan!"}));
    }
  }
  function endDrag(){
    const s=g.current;
    if(!s.dragging) return;
    s.dragging=false;
    const dx=REST_X-s.dragX, dy=REST_Y-s.dragY;
    const dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<10){ s.phase="ready"; s.dragX=REST_X; s.dragY=REST_Y; return; }
    const power=6.5;
    s.vx=dx*power; s.vy=dy*power;
    s.lx=REST_X; s.ly=REST_Y;
    s.bx=REST_X; s.by=REST_Y;
    s.phase="flying"; s.trail=[];
    playPopSound();
    const res=calcEquation(s.vx,s.vy,s.lx,s.ly);
    if(res) setUi(u=>({...u,phase:"flying",shots:s.shots,eq:{a:res.a,b:res.b,c:res.c},peak:res.peak,
      hint:`Meluncur! a=${res.a}, b=${res.b.toFixed(2)}, c=${res.c.toFixed(1)}`}));
  }

  const onMouseDown=(e:React.MouseEvent)=>{ const {cx,cy}=toCanvas(e.clientX,e.clientY); startDrag(cx,cy); };
  const onMouseMove=(e:React.MouseEvent)=>{ const {cx,cy}=toCanvas(e.clientX,e.clientY); moveDrag(cx,cy); };
  const onMouseUp=()=>endDrag();
  const onTouchStart=(e:React.TouchEvent)=>{ e.preventDefault(); const t=e.touches[0]; const {cx,cy}=toCanvas(t.clientX,t.clientY); startDrag(cx,cy); };
  const onTouchMove=(e:React.TouchEvent)=>{ e.preventDefault(); const t=e.touches[0]; const {cx,cy}=toCanvas(t.clientX,t.clientY); moveDrag(cx,cy); };
  const onTouchEnd=(e:React.TouchEvent)=>{ e.preventDefault(); endDrag(); };

  function reset(){
    playPopSound();
    const lv=initLevel();
    const s=g.current;
    Object.assign(s,{ phase:"ready",bx:REST_X,by:REST_Y,vx:0,vy:0,dragX:REST_X,dragY:REST_Y,
      dragging:false,trail:[],stars:[],pigs:lv.pigs,blocks:lv.blocks,shots:5,score:0,happyTimer:0 });
    setUi({ phase:"ready",shots:5,score:0,eq:null,peak:null,hint:"🏹 Tarik burung ke belakang, lalu lepaskan!" });
  }

  const { eq, peak, hint, phase, score } = ui;
  const fmt=(n:number)=>n>=0?`+${n.toFixed(2)}`:`${n.toFixed(2)}`;

  return (
    <div className="bg-gradient-to-b from-slate-900/95 to-blue-950/70 border border-blue-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/30">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-blue-500/20 bg-blue-900/20">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-400" />
          <div>
            <p className="font-display text-sm font-bold text-orange-300">🐦 Laboratorium Parabola — Angry Math Bird</p>
            <p className="font-body text-xs text-white/40">Lintasan burung mengikuti fungsi kuadrat h(x) = ax² + bx + c</p>
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
                <Info className="w-3 h-3" /> Persamaan Lintasan
              </p>
              <div className="text-center">
                <InlineMath math={`h(x) = ${eq.a}x^2 ${fmt(eq.b)}x ${fmt(eq.c)}`} />
              </div>
              <div className="grid grid-cols-3 gap-1 text-xs font-body">
                <div className="bg-red-900/30 border border-red-500/20 rounded-lg p-1.5 text-center">
                  <p className="text-red-300 font-bold">{eq.a}</p>
                  <p className="text-white/40 text-[10px]">a (buka bawah)</p>
                </div>
                <div className="bg-green-900/30 border border-green-500/20 rounded-lg p-1.5 text-center">
                  <p className="text-green-300 font-bold">{eq.b.toFixed(2)}</p>
                  <p className="text-white/40 text-[10px]">b (sudut)</p>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/20 rounded-lg p-1.5 text-center">
                  <p className="text-yellow-300 font-bold">{eq.c.toFixed(1)}</p>
                  <p className="text-white/40 text-[10px]">c (tinggi awal)</p>
                </div>
              </div>
            </div>

            {/* Peak info */}
            {peak && (
              <div className="bg-slate-900/70 border border-yellow-500/30 rounded-xl p-3 space-y-2">
                <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-wide">📐 Titik Puncak (Maks)</p>
                <div className="space-y-1 font-body text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-xs">Jarak horizontal:</span>
                    <span className="text-cyan-300 font-bold">{peak.xm.toFixed(2)} m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-xs">Tinggi maksimum:</span>
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
            <p className="font-body text-xs text-white/30">Tarik burung untuk melihat persamaan lintasannya! 🎯</p>
            <div className="mt-2 text-center opacity-40">
              <InlineMath math="h(x) = ax^2 + bx + c" />
            </div>
          </div>
        )}

        {/* Concept reminder */}
        <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl px-4 py-2 flex gap-2">
          <span className="text-purple-400 text-sm shrink-0">💡</span>
          <p className="font-body text-xs text-purple-200 leading-relaxed">
            Lintasan benda yang dilempar selalu berbentuk <strong>parabola</strong> karena pengaruh gravitasi.
            Nilai <strong className="text-red-300">a&lt;0</strong> → parabola terbuka ke bawah → ada nilai <strong className="text-yellow-300">maksimum</strong> (ketinggian puncak).
            Inilah penerapan fungsi kuadrat di fisika!
          </p>
        </div>

        {phase==="won" && (
          <div className="bg-green-900/30 border border-green-400/40 rounded-xl p-3 text-center">
            <p className="font-display text-sm font-bold text-green-300">🎉 Level Selesai! Skor: {score}</p>
            <p className="font-body text-xs text-white/50 mt-1">Klik reset untuk main lagi dengan sudut berbeda!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AngryBirdParabola;
