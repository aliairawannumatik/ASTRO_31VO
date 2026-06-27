import React, { useState, useRef } from "react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";

type Phase = "idle" | "feeding" | "processing" | "done";

const BAHAN = [
  {
    id: "beras", icon: "🌾",
    warna: "#e8e2cc", warnaGelap: "#b8aa80", warnaShine: "#fffff0",
    warnaTepung: "#faf9f4",
    bgFrom: "#3a3020", bgTo: "#5a5030",
  },
  {
    id: "gandum", icon: "🌾",
    warna: "#c8904a", warnaGelap: "#8a5820", warnaShine: "#f0c870",
    warnaTepung: "#f5f0e4",
    bgFrom: "#3a2510", bgTo: "#5a3818",
  },
  {
    id: "jagung", icon: "🌽",
    warna: "#f0b800", warnaGelap: "#c07800", warnaShine: "#ffe060",
    warnaTepung: "#fffae0",
    bgFrom: "#3a3000", bgTo: "#5a4800",
  },
  {
    id: "kedelai", icon: "🫘",
    warna: "#b89828", warnaGelap: "#806010", warnaShine: "#e8c840",
    warnaTepung: "#f0e8c0",
    bgFrom: "#302800", bgTo: "#504000",
  },
  {
    id: "singkong", icon: "🥔",
    warna: "#d4b878", warnaGelap: "#8a7040", warnaShine: "#f0dca0",
    warnaTepung: "#fafaf6",
    bgFrom: "#2a2010", bgTo: "#483518",
  },
];

const BAHAN_TEXTS: Record<string, Record<string, { nama: string; produk: string; produkDesc: string; bagLabel: string }>> = {
  beras: {
    id: { nama: "Beras", produk: "Tepung Beras", produkDesc: "Putih halus, bebas gluten", bagLabel: "BERAS" },
    en: { nama: "Rice", produk: "Rice Flour", produkDesc: "Fine white, gluten-free", bagLabel: "RICE" },
    ja: { nama: "米", produk: "米粉", produkDesc: "白くて細かい・グルテンフリー", bagLabel: "米粉" },
  },
  gandum: {
    id: { nama: "Gandum", produk: "Tepung Terigu", produkDesc: "Putih krem, serbaguna", bagLabel: "TERIGU" },
    en: { nama: "Wheat", produk: "Wheat Flour", produkDesc: "Cream white, versatile", bagLabel: "WHEAT" },
    ja: { nama: "小麦", produk: "小麦粉", produkDesc: "クリーム色、多目的", bagLabel: "小麦粉" },
  },
  jagung: {
    id: { nama: "Jagung", produk: "Tepung Maizena", produkDesc: "Putih kekuningan, pengental", bagLabel: "MAIZENA" },
    en: { nama: "Corn", produk: "Corn Starch", produkDesc: "Pale yellow, thickener", bagLabel: "CORN" },
    ja: { nama: "トウモロコシ", produk: "コーンスターチ", produkDesc: "薄黄色・とろみ用", bagLabel: "コーン" },
  },
  kedelai: {
    id: { nama: "Kedelai", produk: "Tepung Kedelai", produkDesc: "Kuning pucat, kaya protein", bagLabel: "KEDELAI" },
    en: { nama: "Soybean", produk: "Soy Flour", produkDesc: "Pale yellow, high protein", bagLabel: "SOY" },
    ja: { nama: "大豆", produk: "大豆粉", produkDesc: "薄黄色・高タンパク", bagLabel: "大豆粉" },
  },
  singkong: {
    id: { nama: "Singkong", produk: "Tepung Tapioka", produkDesc: "Putih bersih, transparan kena air", bagLabel: "TAPIOKA" },
    en: { nama: "Cassava", produk: "Tapioca Flour", produkDesc: "Pure white, clear when wet", bagLabel: "TAPIOCA" },
    ja: { nama: "キャッサバ", produk: "タピオカ粉", produkDesc: "純白・水に入ると透明", bagLabel: "タピオカ" },
  },
};

const UI_TEXTS = {
  id: {
    header: "⚙️ Mesin Penepung (Disk Mill) — Analogi Fungsi",
    subtitle1: "Setiap bahan mentah (domain) menghasilkan ",
    subtitleBold: "tepat satu",
    subtitle2: " jenis tepung (range) — itulah fungsi!",
    selectLabel: "Pilih Bahan Mentah (Domain)",
    rawMaterial: "Bahan Mentah",
    machine: "Mesin Penepung",
    notProcessed: "Belum diolah",
    feedingShort: "⬇ memasukkan...",
    grindingShort: "⚙ menggiling...",
    feedingLong: "⬇ Memasukkan bahan...",
    grindingLong: "⚙ Menggiling...",
    processBtn: "▶ Olah Sekarang",
    feedingBtn: "⬇ Memasukkan...",
    grindingBtn: "⚙ Menggiling...",
    resetBtn: "🔄 Reset",
    sliceLabel: "irisan",
    bagTopLabel: "TEPUNG",
    functionNote1: "Satu bahan → tepat satu produk ✅ Ini adalah ",
    functionWord: "fungsi",
    functionNote2: "!",
  },
  en: {
    header: "⚙️ Disk Mill Machine — Function Analogy",
    subtitle1: "Each raw material (domain) produces exactly ",
    subtitleBold: "one",
    subtitle2: " flour type (range) — that's a function!",
    selectLabel: "Select Raw Material (Domain)",
    rawMaterial: "Raw Material",
    machine: "Mill Machine",
    notProcessed: "Not processed",
    feedingShort: "⬇ feeding...",
    grindingShort: "⚙ grinding...",
    feedingLong: "⬇ Feeding material...",
    grindingLong: "⚙ Grinding...",
    processBtn: "▶ Process Now",
    feedingBtn: "⬇ Feeding...",
    grindingBtn: "⚙ Grinding...",
    resetBtn: "🔄 Reset",
    sliceLabel: "cross-section",
    bagTopLabel: "FLOUR",
    functionNote1: "One ingredient → exactly one product ✅ This is a ",
    functionWord: "function",
    functionNote2: "!",
  },
  ja: {
    header: "⚙️ ディスクミル機 — 関数のアナロジー",
    subtitle1: "各原材料（定義域）は",
    subtitleBold: "必ず一種類",
    subtitle2: "の粉（値域）を生成します — これが関数！",
    selectLabel: "原材料を選ぶ（定義域）",
    rawMaterial: "原材料",
    machine: "粉砕機",
    notProcessed: "未処理",
    feedingShort: "⬇ 投入中...",
    grindingShort: "⚙ 粉砕中...",
    feedingLong: "⬇ 材料投入中...",
    grindingLong: "⚙ 粉砕中...",
    processBtn: "▶ 今すぐ処理",
    feedingBtn: "⬇ 投入中...",
    grindingBtn: "⚙ 粉砕中...",
    resetBtn: "🔄 リセット",
    sliceLabel: "断面",
    bagTopLabel: "粉",
    functionNote1: "一つの材料 → 必ず一種類の製品 ✅ これが",
    functionWord: "関数",
    functionNote2: "！",
  },
};

/* ─── SVG GRAIN DRAWINGS ─── */
function GrainSVG({ id, w, dark, shine, sz = 110, uid = "x", sliceLabel = "irisan" }: { id: string; w: string; dark: string; shine: string; sz?: number; uid?: string; sliceLabel?: string }) {
  const gid = `${uid}-g-${id}`;
  if (id === "beras") {
    const grains = [
      [50,52,18],[38,60,-12],[62,58,22],[47,42,6],[63,43,-25],[36,48,32],[52,70,8],[42,72,-5],[64,68,15],
    ];
    return (
      <svg width={sz} height={sz} viewBox="0 0 110 110">
        <defs>
          <radialGradient id={gid} cx="38%" cy="30%" r="60%">
            <stop offset="0%" stopColor={shine} />
            <stop offset="100%" stopColor={dark} />
          </radialGradient>
        </defs>
        {grains.map(([cx,cy,rot],i) => (
          <g key={i} transform={`rotate(${rot},${cx},${cy})`}>
            <ellipse cx={cx} cy={cy} rx={6.5} ry={14} fill={`url(#${gid})`} stroke={dark} strokeWidth="0.6"/>
            <line x1={cx} y1={cy-12} x2={cx} y2={cy+12} stroke={dark} strokeWidth="0.5" opacity="0.3"/>
          </g>
        ))}
      </svg>
    );
  }
  if (id === "gandum") {
    const grains = [
      [50,54,12],[37,62,-15],[63,60,28],[45,43,3],[65,45,-22],[34,50,35],[53,72,5],[67,72,-10],
    ];
    return (
      <svg width={sz} height={sz} viewBox="0 0 110 110">
        <defs>
          <radialGradient id={gid} cx="35%" cy="28%" r="65%">
            <stop offset="0%" stopColor={shine}/>
            <stop offset="100%" stopColor={dark}/>
          </radialGradient>
        </defs>
        {grains.map(([cx,cy,rot],i) => (
          <g key={i} transform={`rotate(${rot},${cx},${cy})`}>
            <ellipse cx={cx} cy={cy} rx={7} ry={14.5} fill={`url(#${gid})`} stroke={dark} strokeWidth="0.7"/>
            <line x1={cx} y1={cy-13} x2={cx} y2={cy+13} stroke={dark} strokeWidth="0.5" opacity="0.35"/>
            <line x1={cx-3} y1={cy-8} x2={cx+3} y2={cy-4} stroke={dark} strokeWidth="0.4" opacity="0.25"/>
          </g>
        ))}
        {[45,65].map((cx,i) => (
          <g key={`t${i}`} transform={`translate(${cx},28) rotate(${i===0?8:-8})`}>
            {[-6,-2,2,6].map((dx,j) => (
              <line key={j} x1={dx} y1={0} x2={dx+(j%2===0?-3:3)} y2={-10}
                stroke={dark} strokeWidth="1.2" strokeLinecap="round"/>
            ))}
          </g>
        ))}
      </svg>
    );
  }
  if (id === "jagung") {
    return (
      <svg width={sz} height={sz} viewBox="0 0 110 110">
        <defs>
          <radialGradient id={gid} cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor={shine}/>
            <stop offset="100%" stopColor={dark}/>
          </radialGradient>
        </defs>
        <ellipse cx="55" cy="62" rx="18" ry="32" fill="#c8a828" stroke="#806000" strokeWidth="1"/>
        <path d="M37,50 Q25,30 42,22 Q52,50 37,50" fill="#5a8028" stroke="#3a6010" strokeWidth="0.8" opacity="0.9"/>
        <path d="M73,50 Q85,30 68,22 Q58,50 73,50" fill="#5a8028" stroke="#3a6010" strokeWidth="0.8" opacity="0.9"/>
        <path d="M42,28 Q55,15 68,28" fill="none" stroke="#3a6010" strokeWidth="1"/>
        {Array.from({length:5},(_,row) =>
          Array.from({length:7},(_,col) => {
            const cx = 40 + col*5;
            const cy = 38 + row*9;
            const onCob = Math.pow((cx-55)/16,2)+Math.pow((cy-62)/30,2) < 0.9;
            return onCob ? (
              <ellipse key={`${row}-${col}`} cx={cx} cy={cy} rx={2.8} ry={3.2}
                fill={`url(#${gid})`} stroke={dark} strokeWidth="0.5"/>
            ) : null;
          })
        )}
        <path d="M48,32 Q55,18 62,32" fill="none" stroke="#c8a000" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if (id === "kedelai") {
    const beans = [
      [50,50],[37,45],[63,48],[44,64],[60,62],[50,35],[35,60],[65,58],[42,75],[62,75],
    ];
    return (
      <svg width={sz} height={sz} viewBox="0 0 110 110">
        <defs>
          <radialGradient id={gid} cx="38%" cy="32%" r="60%">
            <stop offset="0%" stopColor={shine}/>
            <stop offset="100%" stopColor={dark}/>
          </radialGradient>
        </defs>
        {beans.map(([cx,cy],i) => (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx={10} ry={9} fill={`url(#${gid})`} stroke={dark} strokeWidth="0.7"/>
            <line x1={cx-3} y1={cy+2} x2={cx+3} y2={cy+2} stroke={dark} strokeWidth="0.8" strokeLinecap="round" opacity="0.4"/>
          </g>
        ))}
      </svg>
    );
  }
  if (id === "singkong") {
    return (
      <svg width={sz} height={sz} viewBox="0 0 110 110">
        <defs>
          <radialGradient id={gid} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor={shine}/>
            <stop offset="60%" stopColor={w}/>
            <stop offset="100%" stopColor={dark}/>
          </radialGradient>
          <radialGradient id={`${gid}-cut`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffff0"/>
            <stop offset="70%" stopColor="#f0ead0"/>
            <stop offset="100%" stopColor={w}/>
          </radialGradient>
        </defs>
        <ellipse cx="52" cy="65" rx="16" ry="30" fill={`url(#${gid})`} stroke={dark} strokeWidth="1.2" transform="rotate(-8,52,65)"/>
        <path d="M42,50 Q38,60 42,70" stroke={dark} strokeWidth="0.7" fill="none" opacity="0.4"/>
        <path d="M60,48 Q65,58 60,68" stroke={dark} strokeWidth="0.7" fill="none" opacity="0.4"/>
        <path d="M48,48 Q44,56 50,65" stroke={dark} strokeWidth="0.5" fill="none" opacity="0.3"/>
        {[0,1,2,3].map(i => (
          <ellipse key={i} cx="52" cy={48+i*11} rx="15" ry="2.5" fill="none"
            stroke={dark} strokeWidth="0.6" opacity="0.25" transform="rotate(-8,52,65)"/>
        ))}
        <ellipse cx="75" cy="42" rx="14" ry="12" fill={`url(#${gid}-cut)`} stroke={dark} strokeWidth="1"/>
        <ellipse cx="75" cy="42" rx="5" ry="4" fill="#ffffff" opacity="0.7"/>
        <text x="75" y="57" textAnchor="middle" fontSize="7" fill={dark} opacity="0.6">{sliceLabel}</text>
      </svg>
    );
  }
  return <span className="text-5xl">🌾</span>;
}

/* ─── SVG FLOUR BAG ─── */
function TepungSVG({ warna, warnaGelap, visible, sz = 110, uid = "x", bagTopLabel = "TEPUNG", bagLabel = "" }: { warna: string; warnaGelap: string; visible: boolean; sz?: number; uid?: string; bagTopLabel?: string; bagLabel?: string }) {
  const gid = `${uid}-tf-${bagLabel.replace(/\s/g,"")}`;
  return (
    <svg width={sz} height={Math.round(sz*120/110)} viewBox="0 0 110 120">
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={visible ? 1 : 0.1}/>
          <stop offset="100%" stopColor={warnaGelap} stopOpacity={visible ? 0.8 : 0.1}/>
        </linearGradient>
      </defs>
      {/* bag body */}
      <path d="M25,35 Q24,95 30,105 Q55,112 80,105 Q86,95 85,35 Z"
        fill={`url(#${gid})`} stroke={warnaGelap}
        strokeWidth="1.2" opacity={visible ? 1 : 0.2}/>
      {/* bag top fold */}
      <path d="M25,35 Q30,25 55,23 Q80,25 85,35 Q80,42 55,44 Q30,42 25,35 Z"
        fill={warna} stroke={warnaGelap} strokeWidth="1" opacity={visible ? 0.9 : 0.2}/>
      {/* label strip */}
      <rect x="30" y="58" width="50" height="30" rx="4"
        fill={warnaGelap} opacity={visible ? 0.25 : 0.05}/>
      {/* label text */}
      {visible && (
        <>
          <text x="55" y="72" textAnchor="middle" fontSize="6.5" fontWeight="bold"
            fill={warnaGelap} fontFamily="sans-serif">{bagTopLabel}</text>
          <text x="55" y="82" textAnchor="middle" fontSize="5.5"
            fill={warnaGelap} fontFamily="sans-serif" opacity="0.8">
            {bagLabel}
          </text>
        </>
      )}
      {/* powder puff at bottom */}
      {visible && (
        <ellipse cx="55" cy="108" rx="28" ry="5" fill={warna} opacity="0.4"/>
      )}
      {/* tie at top */}
      <path d="M42,30 Q55,20 68,30" fill="none" stroke={warnaGelap}
        strokeWidth="1.5" strokeLinecap="round" opacity={visible ? 0.6 : 0.15}/>
      {/* bag texture lines */}
      {visible && [40,50,60,70].map(x => (
        <line key={x} x1={x} y1={48} x2={x} y2={100}
          stroke={warnaGelap} strokeWidth="0.4" opacity="0.12"/>
      ))}
    </svg>
  );
}

/* ─── DISK MILL MACHINE SVG ─── */
function MesinSVG({ spinning, phase, warnaAktif, size = "lg", uid = "x" }: { spinning: boolean; phase: Phase; warnaAktif: string; size?: "xs" | "sm" | "lg"; uid?: string }) {
  const W = size === "xs" ? 130 : size === "sm" ? 150 : 200;
  const H = size === "xs" ? 143 : size === "sm" ? 165 : 220;
  const isOn = phase !== "idle";
  const dg = `${uid}-disc-grad`;
  const bg = `${uid}-body-grad`;
  const hg = `${uid}-hopper-grad`;
  const mg = `${uid}-motor-grad`;
  const ag = `${uid}-base-grad`;
  const cg = `${uid}-chute-grad`;
  const gw = `${uid}-glow`;
  const ms = `${uid}-metalsheen`;
  return (
    <svg width={W} height={H} viewBox="0 0 200 220" className="overflow-visible">
      <defs>
        <radialGradient id={dg} cx="38%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#a0aab8"/>
          <stop offset="50%" stopColor="#606878"/>
          <stop offset="100%" stopColor="#2e343e"/>
        </radialGradient>
        <linearGradient id={bg} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a7a3a"/>
          <stop offset="50%" stopColor="#2e5a22"/>
          <stop offset="100%" stopColor="#1c3a14"/>
        </linearGradient>
        <linearGradient id={hg} x1="0%" y1="0%" x2="10%" y2="100%">
          <stop offset="0%" stopColor="#c8d0d0"/>
          <stop offset="40%" stopColor="#909898"/>
          <stop offset="100%" stopColor="#606868"/>
        </linearGradient>
        <linearGradient id={mg} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d04030"/>
          <stop offset="100%" stopColor="#801818"/>
        </linearGradient>
        <linearGradient id={ag} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a4030"/>
          <stop offset="100%" stopColor="#1e2418"/>
        </linearGradient>
        <linearGradient id={cg} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a0a8a0"/>
          <stop offset="100%" stopColor="#606860"/>
        </linearGradient>
        <filter id={gw}>
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id={ms}>
          <feGaussianBlur stdDeviation="1" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <rect x="25" y="175" width="150" height="9" rx="3" fill={`url(#${ag})`} stroke="#0e1408" strokeWidth="1"/>
      <rect x="30" y="148" width="140" height="11" rx="3" fill={`url(#${ag})`} stroke="#0e1408" strokeWidth="1"/>
      {[42,82,108,148].map(x => (
        <g key={x}>
          <rect x={x} y="159" width="10" height="18" rx="2" fill="#263020" stroke="#0e1408" strokeWidth="0.8"/>
          <circle cx={x+5} cy={160} r="2" fill="#5a6850" stroke="#384028" strokeWidth="0.5"/>
        </g>
      ))}

      <rect x="118" y="128" width="54" height="30" rx="5" fill={`url(#${mg})`} stroke="#580808" strokeWidth="1.2"/>
      {[124,129,134,139,144,149,154,159].map(x => (
        <line key={x} x1={x} y1="128" x2={x} y2="158" stroke="#600a0a" strokeWidth="1" opacity="0.5"/>
      ))}
      <rect x="122" y="136" width="46" height="14" rx="2" fill="#701010" opacity="0.6"/>
      <text x="145" y="146" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#ffcccc" fontFamily="monospace">MOTOR</text>
      <ellipse cx="168" cy="143" rx="5" ry="5" fill="#601010" stroke="#400808" strokeWidth="0.8"/>
      <line x1="168" y1="138" x2="168" y2="148" stroke="#ff8888" strokeWidth="0.8" opacity="0.5"/>
      <line x1="163" y1="143" x2="173" y2="143" stroke="#ff8888" strokeWidth="0.8" opacity="0.5"/>
      <ellipse cx="118" cy="143" rx="9" ry="9" fill="#3a3a3a" stroke="#686868" strokeWidth="1.5"/>
      <ellipse cx="118" cy="143" rx="5" ry="5" fill="#1e1e1e" stroke="#505050" strokeWidth="1"/>
      <circle cx="118" cy="143" r="2" fill="#888"/>

      <line x1="118" y1="134" x2="30" y2="89" stroke="#111111" strokeWidth="5" strokeLinecap="round"/>
      <line x1="118" y1="152" x2="30" y2="107" stroke="#111111" strokeWidth="5" strokeLinecap="round"/>
      <line x1="118" y1="135" x2="30" y2="90" stroke="#383838" strokeWidth="1.5" opacity="0.7"/>
      <line x1="118" y1="151" x2="30" y2="106" stroke="#383838" strokeWidth="1.5" opacity="0.4"/>

      <rect x="55" y="60" width="95" height="90" rx="7" fill={`url(#${bg})`} stroke="#0e2208" strokeWidth="2"/>
      <path d="M57,67 Q57,62 62,62 L148,62" fill="none" stroke="#6aaa50" strokeWidth="1" opacity="0.4"/>
      <rect x="63" y="69" width="79" height="73" rx="4" fill="none" stroke="#1e4a14" strokeWidth="1" strokeDasharray="3,4"/>
      {[[63,69],[140,69],[63,142],[140,142]].map(([bx,by],i) => (
        <g key={i}>
          <circle cx={bx} cy={by} r="4" fill="#1a2e10" stroke="#4a7a30" strokeWidth="0.8"/>
          <circle cx={bx} cy={by} r="2" fill="#2e5020" stroke="#608040" strokeWidth="0.5"/>
        </g>
      ))}
      <rect x="55" y="122" width="95" height="6" rx="0"
        fill="none" stroke="#e8c020" strokeWidth="0" opacity="0"/>
      <rect x="70" y="116" width="60" height="20" rx="3" fill="#1a3010" stroke="#3a6020" strokeWidth="0.8"/>
      <text x="100" y="126" textAnchor="middle" fontSize="7" fontWeight="bold"
        fill="#a0e060" fontFamily="monospace">DISK MILL</text>
      <text x="100" y="133" textAnchor="middle" fontSize="5.5"
        fill="#6aaa40" fontFamily="monospace">PENEPUNG</text>

      <rect x="55" y="86" width="13" height="30" rx="2" fill="#0e1e08" stroke="#2a5018" strokeWidth="1"/>
      <rect x="53" y="84" width="5" height="34" rx="1" fill="#3a6a28" stroke="#1e4010" strokeWidth="0.8"/>

      <path d="M80,150 L94,150 L100,177 L74,177 Z" fill={`url(#${cg})`} stroke="#505850" strokeWidth="1.2"/>
      <line x1="82" y1="152" x2="76" y2="175" stroke="#d0d8d0" strokeWidth="0.8" opacity="0.5"/>
      <rect x="70" y="176" width="34" height="5" rx="2" fill="#707870" stroke="#484848" strokeWidth="0.8"/>

      <g transform="translate(30,98)">
        <ellipse cx="3" cy="3" rx="43" ry="43" fill="#000000" opacity="0.4"/>
        <circle r="42" fill="#3a3e48" stroke="#585e68" strokeWidth="2.5"/>
        <circle r="39" fill={`url(#${dg})`}/>
        <g>
          {spinning && (
            <animateTransform attributeName="transform" type="rotate"
              values="0;360" dur="0.45s" repeatCount="indefinite"/>
          )}
          {[0,45,90,135,180,225,270,315].map(a => (
            <line key={a}
              x1={0} y1={0}
              x2={33*Math.cos(a*Math.PI/180)}
              y2={33*Math.sin(a*Math.PI/180)}
              stroke="#c8d0d8" strokeWidth="3.5" strokeLinecap="round"/>
          ))}
          {[0,45,90,135,180,225,270,315].map(a => (
            <line key={`s${a}`}
              x1={0} y1={0}
              x2={33*Math.cos(a*Math.PI/180)}
              y2={33*Math.sin(a*Math.PI/180)}
              stroke="#6878a0" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
          ))}
          <circle r="38" fill="none" stroke="#888fa0" strokeWidth="1.2"/>
          <circle r="30" fill="none" stroke="#707880" strokeWidth="0.8"/>
          <circle r="20" fill="none" stroke="#606878" strokeWidth="0.6"/>
          {Array.from({length:16},(_,i) => {
            const a = i * (360/16) * Math.PI / 180;
            return (
              <line key={i}
                x1={14*Math.cos(a)} y1={14*Math.sin(a)}
                x2={27*Math.cos(a)} y2={27*Math.sin(a)}
                stroke="#d0d8e0" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
            );
          })}
        </g>
        <circle r="11" fill="#282e38" stroke="#c0c8d0" strokeWidth="2"/>
        <circle r="6" fill="#181e28" stroke="#808890" strokeWidth="1"/>
        <circle r="3" fill="#a8b0b8" stroke="#686870" strokeWidth="0.8"/>
        <circle r="1.2" fill="#d0d8d8"/>
      </g>

      <path d="M72,15 L50,60 L120,60 L98,15 Z" fill={`url(#${hg})`} stroke="#484e4e" strokeWidth="1.5"/>
      <rect x="69" y="9" width="32" height="9" rx="2" fill="#b0b8b8" stroke="#484e4e" strokeWidth="1.2"/>
      <rect x="71" y="10" width="28" height="6" rx="1" fill="#d0d8d8"/>
      <path d="M76,20 L58,58 L112,58 L94,20 Z" fill="#1a2020" opacity="0.65"/>
      <line x1="72" y1="15" x2="52" y2="59" stroke="#e0e8e8" strokeWidth="0.7" opacity="0.5"/>
      <line x1="98" y1="15" x2="118" y2="59" stroke="#e0e8e8" strokeWidth="0.7" opacity="0.5"/>
      <line x1="85" y1="12" x2="85" y2="60" stroke="#c0c8c8" strokeWidth="0.4" opacity="0.3"/>
      {[[72,16],[98,16],[52,59],[118,59]].map(([bx,by],i) => (
        <g key={i}>
          <circle cx={bx} cy={by} r="3" fill="#585e5e" stroke="#888e8e" strokeWidth="0.8"/>
          <circle cx={bx} cy={by} r="1.2" fill="#b0b8b8"/>
        </g>
      ))}

      <circle cx="130" cy="70" r="4" fill="#1a2e10" stroke="#3a5a20" strokeWidth="0.8"/>
      <circle cx="130" cy="70" r="5.5"
        fill={isOn ? warnaAktif : "#1a2010"}
        stroke={isOn ? warnaAktif : "#2a4018"}
        strokeWidth="1"
        opacity={isOn ? 1 : 0.3}
        filter={isOn ? `url(#${gw})` : "none"}
      />
      {isOn && (
        <circle cx="130" cy="70" r="5.5" fill={warnaAktif} opacity="0.45">
          <animate attributeName="r" values="5.5;9;5.5" dur="0.8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.45;0;0.45" dur="0.8s" repeatCount="indefinite"/>
        </circle>
      )}
      <circle cx="140" cy="70" r="3"
        fill={isOn ? "#30d030" : "#1a2010"}
        stroke={isOn ? "#20a020" : "#2a4018"}
        strokeWidth="0.8"
        opacity={isOn ? 0.9 : 0.2}
      />

      {spinning && (
        <>
          {[0,1,2,3].map(i => (
            <ellipse key={i} cx={78+i*7} cy={56} rx="3.5" ry="2" fill="#e8e0d0" opacity="0.55">
              <animate attributeName="cy" values="56;28;10" dur={`${0.7+i*0.25}s`}
                repeatCount="indefinite" begin={`${i*0.2}s`}/>
              <animate attributeName="opacity" values="0.55;0.2;0" dur={`${0.7+i*0.25}s`}
                repeatCount="indefinite" begin={`${i*0.2}s`}/>
              <animate attributeName="rx" values="3.5;6;1" dur={`${0.7+i*0.25}s`}
                repeatCount="indefinite" begin={`${i*0.2}s`}/>
            </ellipse>
          ))}
        </>
      )}
    </svg>
  );
}

/* ─── GRAIN FALLING ANIMATION ─── */
function GrainFalling({ color, active }: { color: string; active: boolean }) {
  if (!active) return null;
  return (
    <svg width="40" height="60" viewBox="0 0 40 60" className="absolute left-1/2 -translate-x-1/2 -top-2">
      {[0,1,2,3].map(i => (
        <circle key={i} cx={12+i*6} cy={10+i*8} r="3" fill={color} opacity="0.8">
          <animate attributeName="cy" values={`${10+i*8};55`} dur="0.6s"
            repeatCount="indefinite" begin={`${i*0.12}s`}/>
          <animate attributeName="opacity" values="0.9;0" dur="0.6s"
            repeatCount="indefinite" begin={`${i*0.12}s`}/>
        </circle>
      ))}
    </svg>
  );
}

/* ─── FLOUR FALLING FROM CHUTE ─── */
function TepungJatuh({ color, active }: { color: string; active: boolean }) {
  if (!active) return null;
  return (
    <svg width="40" height="50" viewBox="0 0 40 50" className="absolute left-1/2 -translate-x-1/2 top-0">
      {[0,1,2,3,4].map(i => (
        <ellipse key={i} cx={8+i*7} cy={5+i*6} rx="3" ry="2" fill={color} opacity="0.7">
          <animate attributeName="cy" values={`${5+i*6};45`} dur="0.5s"
            repeatCount="indefinite" begin={`${i*0.08}s`}/>
          <animate attributeName="opacity" values="0.8;0.1" dur="0.5s"
            repeatCount="indefinite" begin={`${i*0.08}s`}/>
        </ellipse>
      ))}
    </svg>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function DiskMillMachine() {
  const { language } = useLanguage();
  const ui = UI_TEXTS[language as keyof typeof UI_TEXTS] ?? UI_TEXTS.id;

  const [selectedId, setSelectedId] = useState(BAHAN[0].id);
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const selected = BAHAN.find(b => b.id === selectedId) ?? BAHAN[0];
  const bt = BAHAN_TEXTS[selected.id]?.[language as string] ?? BAHAN_TEXTS[selected.id]?.id;

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const after = (ms: number, cb: () => void) => { timers.current.push(setTimeout(cb, ms)); };

  const olah = () => {
    if (phase === "processing" || phase === "feeding") return;
    playPopSound();
    clear();
    setPhase("feeding");
    after(1200, () => setPhase("processing"));
    after(3800, () => setPhase("done"));
  };

  const reset = () => {
    playPopSound();
    clear();
    setPhase("idle");
  };

  const pilih = (id: string) => {
    playPopSound();
    clear();
    setSelectedId(id);
    setPhase("idle");
  };

  const spinning = phase === "processing";
  const feeding  = phase === "feeding";
  const done     = phase === "done";
  const isRunning = phase === "feeding" || phase === "processing";

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-600/40 bg-gradient-to-br from-slate-900/95 to-slate-800/80 backdrop-blur">
      <style>{`
        @keyframes dmm-appear { from{opacity:0;transform:scale(0.7) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes dmm-shine  { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes dmm-shake  { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-2px)} 75%{transform:translateX(2px)} }
        .dmm-appear { animation: dmm-appear 0.5s cubic-bezier(.34,1.56,.64,1) forwards; }
        .dmm-shine  { animation: dmm-shine 1s ease-in-out infinite; }
        .dmm-shake  { animation: dmm-shake 0.15s linear infinite; }
      `}</style>

      {/* HEADER */}
      <div className="px-5 pt-4 pb-3 border-b border-slate-700/50">
        <p className="font-display text-sm font-bold text-amber-300 text-center">{ui.header}</p>
        <p className="text-xs text-white/50 font-body text-center mt-1">
          {ui.subtitle1}<strong className="text-amber-200">{ui.subtitleBold}</strong>{ui.subtitle2}
        </p>
      </div>

      {/* BAHAN SELECTOR */}
      <div className="px-4 pt-3 pb-2">
        <p className="text-[10px] text-white/40 font-body uppercase tracking-widest mb-2 text-center">{ui.selectLabel}</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {BAHAN.map(b => {
            const bText = BAHAN_TEXTS[b.id]?.[language as string] ?? BAHAN_TEXTS[b.id]?.id;
            const isActive = selected.id === b.id;
            return (
              <button key={b.id} onClick={() => pilih(b.id)} disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold font-body transition-all duration-200 disabled:opacity-50"
                style={isActive
                  ? { borderColor: b.warna, color: b.warnaShine, background: `${b.warnaGelap}30`, boxShadow: `0 0 8px ${b.warna}40` }
                  : { borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.04)" }
                }>
                <span>{b.icon}</span>
                <span>{bText.nama}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN VISUAL AREA */}
      <div className="px-3 py-3">

        {/* ── PORTRAIT / MOBILE — vertical stack ── */}
        <div className="flex sm:hidden flex-col items-center gap-1 w-full">

          {/* Domain card */}
          <div className="flex flex-col items-center gap-1 w-full max-w-[260px]">
            <span className="text-[9px] font-body uppercase tracking-widest font-bold" style={{ color: selected.warnaShine }}>Domain</span>
            <div className="rounded-xl border-2 px-3 py-2 flex flex-col items-center gap-0.5 w-full"
              style={{ borderColor: selected.warna, background: `linear-gradient(135deg,${selected.bgFrom},${selected.bgTo})`, boxShadow: `0 0 20px ${selected.warna}60` }}>
              <div className="relative" style={{ filter: `drop-shadow(0 0 6px ${selected.warna}80)` }}>
                <div className={spinning ? "dmm-shake" : ""}>
                  <GrainSVG id={selected.id} w={selected.warna} dark={selected.warnaGelap} shine={selected.warnaShine} sz={90} uid="p" sliceLabel={ui.sliceLabel}/>
                </div>
                <GrainFalling color={selected.warna} active={feeding}/>
              </div>
              <p className="text-sm font-bold font-body" style={{ color: selected.warnaShine }}>{bt.nama}</p>
              <p className="text-[10px] font-body" style={{ color: selected.warnaShine, opacity: 0.7 }}>{ui.rawMaterial}</p>
            </div>
          </div>

          {/* Arrow down (domain → mesin) */}
          <svg width="24" height="36" viewBox="0 0 24 36">
            <line x1="12" y1="2" x2="12" y2="26" stroke={isRunning||done ? selected.warna : "#3a4050"}
              strokeWidth="2.5" strokeDasharray="5,3">
              {(isRunning||done) && <animate attributeName="stroke-dashoffset" values="24;0" dur="0.4s" repeatCount="indefinite"/>}
            </line>
            <polygon points="6,24 12,36 18,24" fill={isRunning||done ? selected.warna : "#3a4050"}/>
          </svg>

          {/* Machine */}
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] text-white/40 font-body uppercase tracking-widest">{ui.machine}</span>
            <div className={spinning ? "dmm-shine" : ""}>
              <MesinSVG spinning={spinning} phase={phase} warnaAktif={selected.warna} size="sm" uid="p"/>
            </div>
            <div className={`h-5 flex items-center transition-opacity duration-300 ${isRunning ? "opacity-100" : "opacity-0"}`}>
              <span className="text-[9px] font-body font-bold" style={{ color: selected.warnaShine }}>
                {feeding ? ui.feedingShort : ui.grindingShort}
              </span>
            </div>
          </div>

          {/* Arrow down (mesin → range) */}
          <svg width="24" height="36" viewBox="0 0 24 36">
            <line x1="12" y1="2" x2="12" y2="26" stroke={done ? selected.warnaTepung : "#3a4050"}
              strokeWidth="2.5" strokeDasharray="5,3">
              {done && <animate attributeName="stroke-dashoffset" values="24;0" dur="0.4s" repeatCount="indefinite"/>}
            </line>
            <polygon points="6,24 12,36 18,24" fill={done ? selected.warnaTepung : "#3a4050"}/>
          </svg>

          {/* Range card */}
          <div className="flex flex-col items-center gap-1 w-full max-w-[260px]">
            <span className="text-[9px] font-body uppercase tracking-widest font-bold"
              style={{ color: done ? selected.warnaTepung : `${selected.warnaTepung}80` }}>Range</span>
            <div className="rounded-xl border-2 px-3 py-2 flex flex-col items-center gap-0.5 w-full transition-all duration-500"
              style={{
                borderColor: done ? selected.warnaTepung : `${selected.warna}50`,
                background: `linear-gradient(135deg,${selected.bgFrom},${selected.bgTo})`,
                boxShadow: done ? `0 0 22px ${selected.warnaTepung}70` : `0 0 10px ${selected.warna}30`,
              }}>
              <div className="relative" style={{ filter: done ? `drop-shadow(0 0 8px ${selected.warnaTepung}80)` : "none" }}>
                <div className={done ? "dmm-appear" : ""} style={{ opacity: done ? 1 : 0.35 }}>
                  <TepungSVG warna={selected.warnaTepung} warnaGelap={selected.warnaGelap} visible={done} sz={90} uid="p" bagTopLabel={ui.bagTopLabel} bagLabel={bt.bagLabel}/>
                </div>
                <TepungJatuh color={selected.warnaTepung} active={spinning}/>
              </div>
              <p className="text-sm font-bold font-body" style={{ color: done ? selected.warnaShine : `${selected.warnaShine}99` }}>
                {bt.produk}
              </p>
              <p className="text-[10px] font-body" style={{ color: done ? "rgba(255,255,255,0.7)" : `${selected.warnaShine}77` }}>
                {done ? bt.produkDesc : ui.notProcessed}
              </p>
            </div>
          </div>
        </div>

        {/* ── LANDSCAPE / DESKTOP — horizontal layout ── */}
        <div className="hidden sm:flex items-center justify-center gap-0 gap-x-2">

          {/* DOMAIN */}
          <div className="flex flex-col items-center gap-1 min-w-[130px]">
            <span className="text-[10px] font-body uppercase tracking-widest font-bold" style={{ color: selected.warnaShine }}>Domain</span>
            <div className="rounded-xl border-2 px-3 py-2 flex flex-col items-center gap-1 w-full"
              style={{ borderColor: selected.warna, background: `linear-gradient(135deg,${selected.bgFrom},${selected.bgTo})`, boxShadow: `0 0 20px ${selected.warna}60` }}>
              <div className="relative flex items-center justify-center"
                style={{ filter: `drop-shadow(0 0 6px ${selected.warna}80)` }}>
                <div className={spinning ? "dmm-shake" : ""}>
                  <GrainSVG id={selected.id} w={selected.warna} dark={selected.warnaGelap} shine={selected.warnaShine} uid="l" sliceLabel={ui.sliceLabel}/>
                </div>
                <GrainFalling color={selected.warna} active={feeding}/>
              </div>
              <p className="text-xs font-bold font-body" style={{ color: selected.warnaShine }}>{bt.nama}</p>
              <p className="text-[10px] font-body" style={{ color: selected.warnaShine, opacity: 0.7 }}>{ui.rawMaterial}</p>
            </div>
          </div>

          {/* ARROW in */}
          <div className="flex-shrink-0 mx-1">
            <svg width="40" height="24" viewBox="0 0 40 24">
              <line x1="2" y1="12" x2="30" y2="12" stroke={isRunning||done ? selected.warna : "#3a4050"}
                strokeWidth="2.5" strokeDasharray="5,3">
                {(isRunning||done) && <animate attributeName="stroke-dashoffset" values="24;0" dur="0.4s" repeatCount="indefinite"/>}
              </line>
              <polygon points="30,7 40,12 30,17" fill={isRunning||done ? selected.warna : "#3a4050"}/>
            </svg>
          </div>

          {/* MACHINE */}
          <div className="flex flex-col items-center gap-1 relative">
            <span className="text-[10px] text-white/40 font-body uppercase tracking-widest">{ui.machine}</span>
            <div className={spinning ? "dmm-shine" : ""}>
              <MesinSVG spinning={spinning} phase={phase} warnaAktif={selected.warna} uid="l"/>
            </div>
            <div className={`h-6 transition-all duration-300 ${isRunning ? "opacity-100" : "opacity-0"}`}>
              <span className="text-xs font-body font-bold" style={{ color: selected.warnaShine }}>
                {feeding ? ui.feedingLong : ui.grindingLong}
              </span>
            </div>
          </div>

          {/* ARROW out */}
          <div className="flex-shrink-0 mx-1">
            <svg width="40" height="24" viewBox="0 0 40 24">
              <line x1="2" y1="12" x2="30" y2="12" stroke={done ? selected.warnaTepung : "#3a4050"}
                strokeWidth="2.5" strokeDasharray="5,3">
                {done && <animate attributeName="stroke-dashoffset" values="24;0" dur="0.4s" repeatCount="indefinite"/>}
              </line>
              <polygon points="30,7 40,12 30,17" fill={done ? selected.warnaTepung : "#3a4050"}/>
            </svg>
          </div>

          {/* RANGE */}
          <div className="flex flex-col items-center gap-1 min-w-[130px]">
            <span className="text-[10px] font-body uppercase tracking-widest font-bold"
              style={{ color: done ? selected.warnaTepung : `${selected.warnaTepung}80` }}>Range</span>
            <div className="rounded-xl border-2 px-3 py-2 flex flex-col items-center gap-1 w-full transition-all duration-500"
              style={{
                borderColor: done ? selected.warnaTepung : `${selected.warna}50`,
                background: `linear-gradient(135deg,${selected.bgFrom},${selected.bgTo})`,
                boxShadow: done ? `0 0 22px ${selected.warnaTepung}70` : `0 0 10px ${selected.warna}30`,
              }}>
              <div className="relative flex items-center justify-center"
                style={{ filter: done ? `drop-shadow(0 0 8px ${selected.warnaTepung}80)` : "none" }}>
                <div className={done ? "dmm-appear" : ""} style={{ opacity: done ? 1 : 0.35 }}>
                  <TepungSVG warna={selected.warnaTepung} warnaGelap={selected.warnaGelap} visible={done} uid="l" bagTopLabel={ui.bagTopLabel} bagLabel={bt.bagLabel}/>
                </div>
                <TepungJatuh color={selected.warnaTepung} active={spinning}/>
              </div>
              <p className="text-xs font-bold font-body" style={{ color: done ? selected.warnaShine : `${selected.warnaShine}99` }}>
                {bt.produk}
              </p>
              <p className="text-[10px] font-body" style={{ color: done ? "rgba(255,255,255,0.7)" : `${selected.warnaShine}77` }}>
                {done ? bt.produkDesc : ui.notProcessed}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FUNCTION NOTATION */}
      {done && (
        <div className="mx-4 mb-3 dmm-appear">
          <div className="rounded-xl border px-4 py-2.5 text-center"
            style={{ borderColor: `${selected.warna}40`, background: `${selected.warnaTepung}08` }}>
            <p className="font-mono text-sm font-bold" style={{ color: selected.warnaShine }}>
              f({bt.nama}) = {bt.produk}
            </p>
            <p className="text-[11px] text-white/50 font-body mt-0.5">
              {ui.functionNote1}<strong className="text-white/70">{ui.functionWord}</strong>{ui.functionNote2}
            </p>
          </div>
        </div>
      )}

      {/* TOMBOL */}
      <div className="px-4 pb-4 flex gap-2 justify-center">
        <button
          onClick={olah}
          disabled={isRunning}
          className="px-6 py-2.5 rounded-xl font-display font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            background: isRunning ? `${selected.warnaGelap}30` : `${selected.warna}25`,
            border: `1.5px solid ${selected.warna}70`,
            color: selected.warnaShine,
            boxShadow: isRunning ? "none" : `0 0 12px ${selected.warna}30`,
          }}
        >
          {feeding ? ui.feedingBtn : spinning ? ui.grindingBtn : ui.processBtn}
        </button>
        {(done || phase !== "idle") && (
          <button onClick={reset}
            className="px-4 py-2.5 rounded-xl font-body text-sm transition-all hover:bg-slate-700 active:scale-95 cursor-pointer bg-slate-800 text-white/50 hover:text-white border border-slate-600/40">
            {ui.resetBtn}
          </button>
        )}
      </div>

      {/* INFO STRIP */}
      <div className="border-t border-slate-700/50 px-4 py-3">
        <div className="flex flex-wrap gap-2 justify-center">
          {BAHAN.map(b => {
            const bText = BAHAN_TEXTS[b.id]?.[language as string] ?? BAHAN_TEXTS[b.id]?.id;
            return (
              <div key={b.id} className="flex items-center gap-1.5 text-[11px] font-body text-white/50">
                <span className="font-bold" style={{ color: b.warnaShine }}>{bText.nama}</span>
                <span className="text-white/25">→</span>
                <span>{bText.produk}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
