import React, { useState, useRef, useCallback, useEffect } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { ArrowLeftRight, RotateCcw, CheckCircle2, XCircle, Trophy, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  id: {
    badge: "📖 BUKU ANIMASI MATEMATIKA · KELAS 8",
    title: "BANYAK FUNGSI & KORESPONDENSI SATU-SATU",
    subtitle: "Relasi dan Fungsi · Seret panah untuk membuktikan",
    atobLabel: "A → B = {a,b,c}",
    btoaLabel: "B → A = {a,b,c}",
    atobFormula: "A = {1, 2} → B = {a, b, c}",
    btoaFormula: "B = {a,b,c} → A = {1, 2}",
    atobFuncs: "n(B)^n(A) fungsi",
    btoaFuncs: "n(A)^n(B) fungsi",
    switchMode: "Switch Mode",
    foundFuncs: "Fungsi ditemukan:",
    complete: "🎉 LENGKAP!",
    domainLabel: "Domain",
    codomainLabel: "Kodomain",
    hint: "👆 Seret dari node",
    hintDomain: "domain",
    hintAnd: "ke node",
    hintCodomain: "kodomain",
    hintDoubleTap: "· Double-tap untuk hapus panah",
    statusValid: "✅ Fungsi valid! Setiap elemen domain punya tepat satu pasangan.",
    statusDup: "⚠️ Fungsi ini sudah ada di koleksimu. Coba kombinasi yang berbeda!",
    statusRemaining: (n: number) => `Hubungkan ${n} elemen domain yang tersisa.`,
    errNotComplete: "Belum semua elemen domain dipasangkan!",
    errDuplicate: "Fungsi ini sudah ada di koleksimu! Coba kombinasi lain.",
    feedAllFound: (n: number) => `🎉 Semua ${n} fungsi berhasil ditemukan!`,
    feedAdded: (n: number) => `✅ Fungsi ke-${n} ditambahkan! Lanjut temukan yang lain!`,
    resetArrows: "Reset Panah",
    saveBtn: "Simpan ke Koleksi!",
    resetAll: "Reset Semua",
    hintTitle: "Petunjuk & Aturan Fungsi",
    hintFuncTitle: "📌 Syarat sebuah FUNGSI:",
    hintFuncRule1: "✔ Setiap anggota",
    hintFuncRule1b: "domain",
    hintFuncRule1c: "harus punya",
    hintFuncRule1d: "tepat satu",
    hintFuncRule1e: "pasangan di kodomain.",
    hintFuncRule2: "✔ Boleh ada anggota kodomain yang tidak dipasangkan (surjektif tidak wajib).",
    hintFuncRule3: "✔ Boleh ada dua anggota domain yang dipasangkan ke anggota kodomain yang sama.",
    hintCountTitle: "🔢 Cara menghitung banyak fungsi:",
    hintCountAB: "A→B:",
    hintCountABDetail: "Setiap elemen A punya 3 pilihan di B. Ada 2 elemen di A, jadi 3×3 = 9.",
    hintCountBA: "B→A:",
    hintCountBADetail: "Setiap elemen B punya 2 pilihan di A. Ada 3 elemen di B, jadi 2×2×2 = 8.",
    hintHowTitle: "🎯 Cara menggunakan:",
    hintHow1: "1. Tekan & seret dari node domain (kiri) menuju node kodomain (kanan)",
    hintHow2: "2. Double-tap node domain untuk menghapus panahnya",
    hintHow3: "3. Klik \"Simpan ke Koleksi!\" jika fungsi sudah lengkap dan baru",
    hintHow4: (n: number) => `4. Coba temukan semua ${n} fungsi yang mungkin!`,
    galleryTitle: (mode: string) => `Koleksi Fungsi ${mode}`,
    celebrateTitle: (n: number) => `Luar biasa! Semua ${n} fungsi berhasil ditemukan!`,
    celebrateDetail: (mode: string) => `Kamu telah membuktikan bahwa banyak fungsi ${mode}`,
    conclusionTitle: "📌 Kesimpulan",
    conclusionText: (nA: string, nB: string, nBA: string) =>
      `Banyak fungsi yang dapat dibentuk dari himpunan dengan ${nA} anggota ke himpunan dengan ${nB} anggota adalah ${nBA}. Untuk A = {1,2} dan B = {a,b,c}, banyak fungsi dari A ke B = 3² = 9, dan dari B ke A = 2³ = 8.`,
  },
  en: {
    badge: "📖 MATH ANIMATION BOOK · GRADE 8",
    title: "NUMBER OF FUNCTIONS & ONE-TO-ONE CORRESPONDENCE",
    subtitle: "Relations and Functions · Drag arrows to prove",
    atobLabel: "A → B = {a,b,c}",
    btoaLabel: "B → A = {a,b,c}",
    atobFormula: "A = {1, 2} → B = {a, b, c}",
    btoaFormula: "B = {a,b,c} → A = {1, 2}",
    atobFuncs: "n(B)^n(A) functions",
    btoaFuncs: "n(A)^n(B) functions",
    switchMode: "Switch Mode",
    foundFuncs: "Functions found:",
    complete: "🎉 COMPLETE!",
    domainLabel: "Domain",
    codomainLabel: "Codomain",
    hint: "👆 Drag from",
    hintDomain: "domain",
    hintAnd: "node to",
    hintCodomain: "codomain",
    hintDoubleTap: "node · Double-tap to remove arrow",
    statusValid: "✅ Valid function! Every domain element has exactly one pair.",
    statusDup: "⚠️ This function is already in your collection. Try a different combination!",
    statusRemaining: (n: number) => `Connect ${n} remaining domain element(s).`,
    errNotComplete: "Not all domain elements are paired yet!",
    errDuplicate: "This function is already in your collection! Try another combination.",
    feedAllFound: (n: number) => `🎉 All ${n} functions found!`,
    feedAdded: (n: number) => `✅ Function #${n} added! Keep finding more!`,
    resetArrows: "Reset Arrows",
    saveBtn: "Save to Collection!",
    resetAll: "Reset All",
    hintTitle: "Hints & Function Rules",
    hintFuncTitle: "📌 Requirements for a FUNCTION:",
    hintFuncRule1: "✔ Every",
    hintFuncRule1b: "domain",
    hintFuncRule1c: "element must have",
    hintFuncRule1d: "exactly one",
    hintFuncRule1e: "pair in the codomain.",
    hintFuncRule2: "✔ Codomain elements may be unpaired (surjectivity not required).",
    hintFuncRule3: "✔ Two domain elements may be paired to the same codomain element.",
    hintCountTitle: "🔢 How to count functions:",
    hintCountAB: "A→B:",
    hintCountABDetail: "Each element of A has 3 choices in B. There are 2 elements in A, so 3×3 = 9.",
    hintCountBA: "B→A:",
    hintCountBADetail: "Each element of B has 2 choices in A. There are 3 elements in B, so 2×2×2 = 8.",
    hintHowTitle: "🎯 How to use:",
    hintHow1: "1. Press & drag from domain node (left) to codomain node (right)",
    hintHow2: "2. Double-tap a domain node to remove its arrow",
    hintHow3: "3. Click \"Save to Collection!\" when the function is complete and new",
    hintHow4: (n: number) => `4. Try to find all ${n} possible functions!`,
    galleryTitle: (mode: string) => `Function Collection ${mode}`,
    celebrateTitle: (n: number) => `Amazing! All ${n} functions found!`,
    celebrateDetail: (mode: string) => `You have proven that the number of functions ${mode}`,
    conclusionTitle: "📌 Conclusion",
    conclusionText: (nA: string, nB: string, nBA: string) =>
      `The number of functions that can be formed from a set with ${nA} elements to a set with ${nB} elements is ${nBA}. For A = {1,2} and B = {a,b,c}: functions from A to B = 3² = 9, and from B to A = 2³ = 8.`,
  },
  ja: {
    badge: "📖 数学アニメーションブック · 中学2年",
    title: "関数の個数と全単射",
    subtitle: "関係と関数 · 矢印をドラッグして証明しよう",
    atobLabel: "A → B = {a,b,c}",
    btoaLabel: "B → A = {a,b,c}",
    atobFormula: "A = {1, 2} → B = {a, b, c}",
    btoaFormula: "B = {a,b,c} → A = {1, 2}",
    atobFuncs: "n(B)^n(A) 個の関数",
    btoaFuncs: "n(A)^n(B) 個の関数",
    switchMode: "モード切替",
    foundFuncs: "発見した関数：",
    complete: "🎉 完成！",
    domainLabel: "定義域",
    codomainLabel: "終域",
    hint: "👆",
    hintDomain: "定義域",
    hintAnd: "ノードから",
    hintCodomain: "終域",
    hintDoubleTap: "ノードへドラッグ · ダブルタップで矢印削除",
    statusValid: "✅ 有効な関数！定義域の各要素にちょうど1つの対応があります。",
    statusDup: "⚠️ この関数はすでにコレクションにあります。別の組み合わせを試してください！",
    statusRemaining: (n: number) => `残り${n}個の定義域要素を接続してください。`,
    errNotComplete: "まだすべての定義域要素が対応していません！",
    errDuplicate: "この関数はすでにコレクションにあります！別の組み合わせを試してください。",
    feedAllFound: (n: number) => `🎉 全${n}個の関数を発見しました！`,
    feedAdded: (n: number) => `✅ 関数${n}番目を追加しました！続けて見つけましょう！`,
    resetArrows: "矢印リセット",
    saveBtn: "コレクションに保存！",
    resetAll: "全リセット",
    hintTitle: "ヒント・関数の規則",
    hintFuncTitle: "📌 関数の条件：",
    hintFuncRule1: "✔",
    hintFuncRule1b: "定義域",
    hintFuncRule1c: "のすべての要素は終域に",
    hintFuncRule1d: "ちょうど1つ",
    hintFuncRule1e: "の対応を持つ必要があります。",
    hintFuncRule2: "✔ 終域の要素が対応を持たなくてもよい（全射は不要）。",
    hintFuncRule3: "✔ 定義域の2つの要素が同じ終域要素に対応してもよい。",
    hintCountTitle: "🔢 関数の個数の数え方：",
    hintCountAB: "A→B：",
    hintCountABDetail: "Aの各要素はBの3択。Aに2要素あるので3×3 = 9。",
    hintCountBA: "B→A：",
    hintCountBADetail: "Bの各要素はAの2択。Bに3要素あるので2×2×2 = 8。",
    hintHowTitle: "🎯 使い方：",
    hintHow1: "1. 定義域ノード（左）から終域ノード（右）へドラッグ",
    hintHow2: "2. 定義域ノードをダブルタップして矢印を削除",
    hintHow3: "3. 関数が完成したら「コレクションに保存！」をクリック",
    hintHow4: (n: number) => `4. 可能な全${n}個の関数を見つけてみよう！`,
    galleryTitle: (mode: string) => `関数コレクション ${mode}`,
    celebrateTitle: (n: number) => `素晴らしい！全${n}個の関数を発見しました！`,
    celebrateDetail: (mode: string) => `関数の個数 ${mode} であることが証明されました`,
    conclusionTitle: "📌 まとめ",
    conclusionText: (nA: string, nB: string, nBA: string) =>
      `${nA}個の要素を持つ集合から${nB}個の要素を持つ集合への関数の個数は${nBA}です。A = {1,2}、B = {a,b,c}の場合：A→Bの関数 = 3² = 9個、B→Aの関数 = 2³ = 8個。`,
  },
} as const;

type Mode = "AtoB" | "BtoA";
type Mapping = Record<string, string>;

const DOMAIN_A = ["1", "2"];
const CODOMAIN_B = ["a", "b", "c"];

const SVG_W = 320;
const SVG_H = 300;
const DOM_X = 72;
const COD_X = 248;
const NODE_R = 24;

const COLORS = {
  domain: { fill: "#0e7490", stroke: "#22d3ee", text: "#e0f2fe" },
  codomain: { fill: "#6d28d9", stroke: "#a78bfa", text: "#ede9fe" },
  arrow: "#f0abfc",
  arrowDrag: "#fbbf24",
  arrowHead: "url(#ah)",
  arrowHeadDrag: "url(#ahd)",
};

function nodePos(idx: number, total: number, x: number): { x: number; y: number } {
  const spacing = (SVG_H - 50) / (total + 1);
  return { x, y: 25 + spacing * (idx + 1) };
}

function bezierPath(
  from: { x: number; y: number },
  to: { x: number; y: number },
  rFrom: number = NODE_R,
  rTo: number = NODE_R
): string {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const angleBack = Math.atan2(from.y - to.y, from.x - to.x);
  const sx = from.x + rFrom * Math.cos(angle);
  const sy = from.y + rFrom * Math.sin(angle);
  const ex = to.x + rTo * Math.cos(angleBack);
  const ey = to.y + rTo * Math.sin(angleBack);
  const cpx = (sx + ex) / 2;
  return `M ${sx} ${sy} C ${cpx} ${sy} ${cpx} ${ey} ${ex} ${ey}`;
}

function mappingsEqual(a: Mapping, b: Mapping): boolean {
  const keys = Object.keys(a).sort();
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((k) => a[k] === b[k]);
}

function getSVGCoords(
  e: React.MouseEvent | React.TouchEvent,
  svgEl: SVGSVGElement
): { x: number; y: number } {
  const rect = svgEl.getBoundingClientRect();
  const scaleX = SVG_W / rect.width;
  const scaleY = SVG_H / rect.height;
  if ("touches" in e) {
    const t = e.touches[0] || (e as React.TouchEvent).changedTouches[0];
    return {
      x: (t.clientX - rect.left) * scaleX,
      y: (t.clientY - rect.top) * scaleY,
    };
  }
  return {
    x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
    y: ((e as React.MouseEvent).clientY - rect.top) * scaleY,
  };
}

const MiniDiagram: React.FC<{
  mapping: Mapping;
  domain: string[];
  codomain: string[];
  index: number;
}> = ({ mapping, domain, codomain, index }) => {
  const W = 120;
  const H = 110;
  const dx = 28;
  const cx = 92;
  const r = 11;

  function mNodePos(i: number, total: number, x: number) {
    const sp = (H - 24) / (total + 1);
    return { x, y: 12 + sp * (i + 1) };
  }

  function mBezier(from: { x: number; y: number }, to: { x: number; y: number }) {
    const cpx = (from.x + to.x) / 2;
    return `M ${from.x + r} ${from.y} C ${cpx} ${from.y} ${cpx} ${to.y} ${to.x - r} ${to.y}`;
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-bold text-white/40 font-mono">#{index + 1}</span>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="rounded-lg bg-slate-900/60 border border-white/10">
        <defs>
          <marker id={`mah${index}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#c084fc" />
          </marker>
        </defs>
        {domain.map((el, i) => {
          const pos = mNodePos(i, domain.length, dx);
          return (
            <g key={el}>
              <circle cx={pos.x} cy={pos.y} r={r} fill="#0e4f6e" stroke="#22d3ee" strokeWidth={1} />
              <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fill="#e0f2fe" fontSize={9} fontWeight="bold" fontFamily="monospace">{el}</text>
            </g>
          );
        })}
        {codomain.map((el, i) => {
          const pos = mNodePos(i, codomain.length, cx);
          return (
            <g key={el}>
              <circle cx={pos.x} cy={pos.y} r={r} fill="#3b1f7a" stroke="#a78bfa" strokeWidth={1} />
              <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fill="#ede9fe" fontSize={9} fontWeight="bold" fontFamily="monospace">{el}</text>
            </g>
          );
        })}
        {domain.map((el, i) => {
          const target = mapping[el];
          if (!target) return null;
          const ti = codomain.indexOf(target);
          const from = mNodePos(i, domain.length, dx);
          const to = mNodePos(ti, codomain.length, cx);
          return (
            <path key={el} d={mBezier(from, to)} fill="none" stroke="#c084fc" strokeWidth={1.5}
              markerEnd={`url(#mah${index})`} />
          );
        })}
        <text x={dx} y={H - 4} textAnchor="middle" fill="#22d3ee" fontSize={7} fontFamily="sans-serif">{domain === DOMAIN_A ? "A" : "B"}</text>
        <text x={cx} y={H - 4} textAnchor="middle" fill="#a78bfa" fontSize={7} fontFamily="sans-serif">{codomain === CODOMAIN_B ? "B" : "A"}</text>
      </svg>
      <div className="text-[9px] text-white/30 font-mono text-center leading-tight">
        {domain.map(el => `${el}→${mapping[el] ?? "?"}`).join(", ")}
      </div>
    </div>
  );
};

const BukuAnimasiBanyakFungsiPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [mode, setMode] = useState<Mode>("AtoB");
  const [currentMapping, setCurrentMapping] = useState<Mapping>({});
  const [discoveredAtoB, setDiscoveredAtoB] = useState<Mapping[]>([]);
  const [discoveredBtoA, setDiscoveredBtoA] = useState<Mapping[]>([]);
  const [dragging, setDragging] = useState<{ from: string } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [feedback, setFeedback] = useState<{ msg: string; type: "ok" | "err" | "info" } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const domain = mode === "AtoB" ? DOMAIN_A : CODOMAIN_B;
  const codomain = mode === "AtoB" ? CODOMAIN_B : DOMAIN_A;
  const maxFuncs = mode === "AtoB" ? 9 : 8;
  const discovered = mode === "AtoB" ? discoveredAtoB : discoveredBtoA;
  const setDiscovered = mode === "AtoB" ? setDiscoveredAtoB : setDiscoveredBtoA;

  const domainLabel = mode === "AtoB" ? "A = {1, 2}" : "B = {a, b, c}";
  const codomainLabel = mode === "AtoB" ? "B = {a, b, c}" : "A = {1, 2}";

  const domainPositions = Object.fromEntries(
    domain.map((el, i) => [el, nodePos(i, domain.length, DOM_X)])
  );
  const codomainPositions = Object.fromEntries(
    codomain.map((el, i) => [el, nodePos(i, codomain.length, COD_X)])
  );

  const isComplete = domain.every((el) => currentMapping[el] !== undefined);
  const isDuplicate = isComplete && discovered.some((d) => mappingsEqual(d, currentMapping));

  useEffect(() => {
    if (!feedback) return;
    const t2 = setTimeout(() => setFeedback(null), 2200);
    return () => clearTimeout(t2);
  }, [feedback]);

  const findCodomainAt = useCallback(
    (x: number, y: number): string | null => {
      for (const el of codomain) {
        const pos = codomainPositions[el];
        if (Math.hypot(x - pos.x, y - pos.y) < NODE_R + 8) return el;
      }
      return null;
    },
    [codomain, codomainPositions]
  );

  const startDrag = useCallback(
    (el: string, e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setDragging({ from: el });
      if (svgRef.current) {
        setMousePos(getSVGCoords(e, svgRef.current));
      }
    },
    []
  );

  const onSVGMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!dragging || !svgRef.current) return;
      e.preventDefault();
      setMousePos(getSVGCoords(e, svgRef.current));
    },
    [dragging]
  );

  const onSVGUp = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!dragging || !svgRef.current) return;
      const pos = getSVGCoords(e, svgRef.current);
      const target = findCodomainAt(pos.x, pos.y);
      if (target) {
        playPopSound();
        setCurrentMapping((prev) => ({ ...prev, [dragging.from]: target }));
      }
      setDragging(null);
    },
    [dragging, findCodomainAt]
  );

  const removeDomainArrow = (el: string) => {
    playPopSound();
    setCurrentMapping((prev) => {
      const next = { ...prev };
      delete next[el];
      return next;
    });
  };

  const addFunction = () => {
    if (!isComplete) {
      setFeedback({ msg: t.errNotComplete, type: "err" });
      return;
    }
    if (isDuplicate) {
      setFeedback({ msg: t.errDuplicate, type: "err" });
      return;
    }
    playPopSound();
    const next = [...discovered, { ...currentMapping }];
    setDiscovered(next as any);
    setCurrentMapping({});
    if (next.length === maxFuncs) {
      setCelebrate(true);
      setFeedback({ msg: t.feedAllFound(maxFuncs), type: "ok" });
    } else {
      setFeedback({ msg: t.feedAdded(next.length), type: "ok" });
    }
  };

  const resetCurrent = () => {
    playPopSound();
    setCurrentMapping({});
    setFeedback(null);
  };

  const resetAll = () => {
    playPopSound();
    setCurrentMapping({});
    setDiscovered([] as any);
    setCelebrate(false);
    setFeedback(null);
  };

  const switchMode = () => {
    playPopSound();
    setMode((m) => (m === "AtoB" ? "BtoA" : "AtoB"));
    setCurrentMapping({});
    setFeedback(null);
    setCelebrate(false);
  };

  const draggingFromPos = dragging ? domainPositions[dragging.from] : null;

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto pb-16">
      <Starfield />
      <PageNavigation />

      <div className="relative z-10 max-w-2xl w-full px-4 pt-20">

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-fuchsia-900/40 border border-fuchsia-500/40 rounded-full px-4 py-1 text-xs font-bold text-fuchsia-300 mb-3">
            {t.badge}
          </div>
          <h1 className="font-display text-lg md:text-2xl font-bold text-primary text-glow-cyan mb-1">
            {t.title}
          </h1>
          <p className="text-white/50 text-xs font-body">{t.subtitle}</p>
        </div>

        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-3 text-center">
            <p className="text-[10px] font-bold text-cyan-400 mb-1">{t.atobFormula}</p>
            <p className="text-2xl font-bold text-cyan-300 font-mono">3² = <span className="text-yellow-300">9</span></p>
            <p className="text-[10px] text-white/40">{t.atobFuncs}</p>
          </div>
          <div className="flex items-center justify-center text-white/30 text-xl">⇄</div>
          <div className="flex-1 bg-violet-900/30 border border-violet-500/30 rounded-lg p-3 text-center">
            <p className="text-[10px] font-bold text-violet-400 mb-1">{t.btoaFormula}</p>
            <p className="text-2xl font-bold text-violet-300 font-mono">2³ = <span className="text-yellow-300">8</span></p>
            <p className="text-[10px] text-white/40">{t.btoaFuncs}</p>
          </div>
        </div>

        <div className="flex items-center justify-center mb-4 gap-3">
          <span className={`text-sm font-bold font-mono px-3 py-1 rounded-lg transition-all ${mode === "AtoB" ? "bg-cyan-700/60 text-cyan-200 ring-1 ring-cyan-400" : "text-white/30"}`}>
            A → B
          </span>
          <button
            onClick={switchMode}
            className="flex items-center gap-1 bg-slate-700/60 hover:bg-slate-600/70 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full transition-all active:scale-95"
          >
            <ArrowLeftRight className="w-4 h-4" />
            {t.switchMode}
          </button>
          <span className={`text-sm font-bold font-mono px-3 py-1 rounded-lg transition-all ${mode === "BtoA" ? "bg-violet-700/60 text-violet-200 ring-1 ring-violet-400" : "text-white/30"}`}>
            B → A
          </span>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-white/50 font-body">
              {t.foundFuncs} <span className="text-yellow-300 font-bold">{discovered.length}</span> / {maxFuncs}
            </span>
            {celebrate && (
              <span className="text-xs text-green-400 font-bold animate-pulse">{t.complete}</span>
            )}
          </div>
          <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full transition-all duration-500"
              style={{ width: `${(discovered.length / maxFuncs) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-4 mb-4 shadow-xl">
          <div className="flex justify-between mb-2 px-2">
            <div className="text-center">
              <span className="text-xs font-bold text-cyan-400 font-mono">{t.domainLabel}</span>
              <br />
              <span className="text-[11px] text-cyan-300/70 font-mono">{domainLabel}</span>
            </div>
            <div className="text-center">
              <span className="text-xs font-bold text-violet-400 font-mono">{t.codomainLabel}</span>
              <br />
              <span className="text-[11px] text-violet-300/70 font-mono">{codomainLabel}</span>
            </div>
          </div>

          <div className="flex justify-center select-none">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              width="100%"
              style={{ maxWidth: SVG_W, cursor: dragging ? "crosshair" : "default", touchAction: "none" }}
              onMouseMove={onSVGMove}
              onMouseUp={onSVGUp}
              onMouseLeave={() => setDragging(null)}
              onTouchMove={onSVGMove}
              onTouchEnd={onSVGUp}
            >
              <defs>
                <marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6 Z" fill="#f0abfc" />
                </marker>
                <marker id="ahd" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6 Z" fill="#fbbf24" />
                </marker>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              <line x1={SVG_W / 2} y1={10} x2={SVG_W / 2} y2={SVG_H - 10} stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="4 4" />

              <text x={DOM_X} y={SVG_H - 8} textAnchor="middle" fill="#22d3ee" fontSize={11} fontFamily="monospace" fontWeight="bold">{mode === "AtoB" ? "A" : "B"}</text>
              <text x={COD_X} y={SVG_H - 8} textAnchor="middle" fill="#a78bfa" fontSize={11} fontFamily="monospace" fontWeight="bold">{mode === "AtoB" ? "B" : "A"}</text>

              {domain.map((el) => {
                const target = currentMapping[el];
                if (!target) return null;
                const from = domainPositions[el];
                const to = codomainPositions[target];
                return (
                  <path
                    key={el}
                    d={bezierPath(from, to)}
                    fill="none"
                    stroke="#f0abfc"
                    strokeWidth={2.5}
                    markerEnd="url(#ah)"
                    opacity={0.9}
                  />
                );
              })}

              {dragging && draggingFromPos && (
                <path
                  d={bezierPath(draggingFromPos, mousePos, NODE_R, 0)}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  markerEnd="url(#ahd)"
                  opacity={0.8}
                />
              )}

              {codomain.map((el) => {
                const pos = codomainPositions[el];
                const isTarget = dragging !== null &&
                  Math.hypot(mousePos.x - pos.x, mousePos.y - pos.y) < NODE_R + 10;
                return (
                  <g key={el}>
                    <circle
                      cx={pos.x} cy={pos.y} r={NODE_R}
                      fill={isTarget ? "#5b21b6" : COLORS.codomain.fill}
                      stroke={isTarget ? "#c4b5fd" : COLORS.codomain.stroke}
                      strokeWidth={isTarget ? 2.5 : 1.5}
                      style={{ filter: isTarget ? "url(#glow)" : undefined }}
                    />
                    <text
                      x={pos.x} y={pos.y + 1}
                      textAnchor="middle" dominantBaseline="middle"
                      fill={COLORS.codomain.text} fontSize={14} fontWeight="bold" fontFamily="monospace"
                    >{el}</text>
                  </g>
                );
              })}

              {domain.map((el) => {
                const pos = domainPositions[el];
                const hasArrow = currentMapping[el] !== undefined;
                const isDraggingThis = dragging?.from === el;
                return (
                  <g
                    key={el}
                    style={{ cursor: "grab" }}
                    onMouseDown={(e) => startDrag(el, e)}
                    onTouchStart={(e) => startDrag(el, e)}
                    onDoubleClick={() => hasArrow && removeDomainArrow(el)}
                  >
                    <circle
                      cx={pos.x} cy={pos.y} r={NODE_R}
                      fill={isDraggingThis ? "#164e63" : hasArrow ? "#0c4a6e" : COLORS.domain.fill}
                      stroke={isDraggingThis ? "#fbbf24" : hasArrow ? "#67e8f9" : COLORS.domain.stroke}
                      strokeWidth={isDraggingThis ? 2.5 : 1.5}
                      style={{ filter: isDraggingThis ? "url(#glow)" : undefined }}
                    />
                    <text
                      x={pos.x} y={pos.y + 1}
                      textAnchor="middle" dominantBaseline="middle"
                      fill={COLORS.domain.text} fontSize={14} fontWeight="bold" fontFamily="monospace"
                    >{el}</text>
                    {hasArrow && (
                      <circle cx={pos.x + 17} cy={pos.y - 17} r={8} fill="#10b981" stroke="#6ee7b7" strokeWidth={1} />
                    )}
                    {hasArrow && (
                      <text x={pos.x + 17} y={pos.y - 16} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={9} fontWeight="bold">✓</text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <p className="text-center text-[11px] text-white/30 mt-2 font-body">
            {t.hint} <span className="text-cyan-400">{t.hintDomain}</span> {t.hintAnd} <span className="text-violet-400">{t.hintCodomain}</span> {t.hintDoubleTap}
          </p>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl mb-3 text-sm font-body transition-all ${
          isComplete && !isDuplicate
            ? "bg-green-900/40 border border-green-500/40 text-green-300"
            : isDuplicate
            ? "bg-orange-900/40 border border-orange-500/40 text-orange-300"
            : "bg-slate-800/60 border border-white/10 text-white/50"
        }`}>
          {isComplete && !isDuplicate && <CheckCircle2 className="w-4 h-4 shrink-0" />}
          {isDuplicate && <XCircle className="w-4 h-4 shrink-0" />}
          {!isComplete && <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" />}
          <span>
            {isComplete && !isDuplicate
              ? t.statusValid
              : isDuplicate
              ? t.statusDup
              : t.statusRemaining(domain.filter(el => !currentMapping[el]).length)}
          </span>
        </div>

        {feedback && (
          <div className={`text-center text-sm font-bold py-2 px-4 rounded-xl mb-3 transition-all ${
            feedback.type === "ok" ? "bg-green-900/50 text-green-300 border border-green-500/40" :
            feedback.type === "err" ? "bg-red-900/50 text-red-300 border border-red-500/40" :
            "bg-slate-800/60 text-white/70 border border-white/10"
          }`}>
            {feedback.msg}
          </div>
        )}

        <div className="flex gap-2 mb-6">
          <button
            onClick={resetCurrent}
            className="flex items-center gap-1.5 bg-slate-700/60 hover:bg-slate-600/70 border border-white/15 text-white/70 text-xs font-bold px-3 py-2.5 rounded-xl transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t.resetArrows}
          </button>
          <button
            onClick={addFunction}
            disabled={!isComplete || isDuplicate}
            className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-xl border transition-all active:scale-95 ${
              isComplete && !isDuplicate
                ? "bg-fuchsia-600/80 hover:bg-fuchsia-500/90 border-fuchsia-400/60 text-white shadow-lg shadow-fuchsia-500/20 cursor-pointer"
                : "bg-slate-800/50 border-white/10 text-white/25 cursor-not-allowed"
            }`}
          >
            <Trophy className="w-4 h-4" />
            {t.saveBtn}
          </button>
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 bg-red-900/40 hover:bg-red-800/50 border border-red-500/30 text-red-300 text-xs font-bold px-3 py-2.5 rounded-xl transition-all active:scale-95"
          >
            <XCircle className="w-3.5 h-3.5" />
            {t.resetAll}
          </button>
        </div>

        <div className="bg-slate-800/50 border border-white/10 rounded-xl overflow-hidden mb-6">
          <button
            onClick={() => { setShowHint(h => !h); playPopSound(); }}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <div className="flex items-center gap-2 text-yellow-300 text-sm font-bold">
              <Lightbulb className="w-4 h-4" /> {t.hintTitle}
            </div>
            {showHint ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </button>
          {showHint && (
            <div className="px-4 pb-4 space-y-3 text-sm font-body">
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 space-y-1.5">
                <p className="text-yellow-300 font-bold text-xs">{t.hintFuncTitle}</p>
                <p className="text-white/70 text-xs">
                  {t.hintFuncRule1} <strong className="text-cyan-300">{t.hintFuncRule1b}</strong> {t.hintFuncRule1c} <strong>{t.hintFuncRule1d}</strong> {t.hintFuncRule1e}
                </p>
                <p className="text-white/70 text-xs">{t.hintFuncRule2}</p>
                <p className="text-white/70 text-xs">{t.hintFuncRule3}</p>
              </div>
              <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3 space-y-1.5">
                <p className="text-cyan-300 font-bold text-xs">{t.hintCountTitle}</p>
                <p className="text-white/70 text-xs"><strong>{t.hintCountAB}</strong> n(B)^n(A) = 3² = <strong className="text-yellow-300">9</strong></p>
                <p className="text-white/70 text-xs">{t.hintCountABDetail}</p>
                <p className="text-white/70 text-xs mt-1"><strong>{t.hintCountBA}</strong> n(A)^n(B) = 2³ = <strong className="text-yellow-300">8</strong></p>
                <p className="text-white/70 text-xs">{t.hintCountBADetail}</p>
              </div>
              <div className="bg-fuchsia-900/20 border border-fuchsia-500/30 rounded-lg p-3 space-y-1.5">
                <p className="text-fuchsia-300 font-bold text-xs">{t.hintHowTitle}</p>
                <p className="text-white/70 text-xs">{t.hintHow1}</p>
                <p className="text-white/70 text-xs">{t.hintHow2}</p>
                <p className="text-white/70 text-xs">{t.hintHow3}</p>
                <p className="text-white/70 text-xs">{t.hintHow4(maxFuncs)}</p>
              </div>
            </div>
          )}
        </div>

        {discovered.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <h2 className="text-sm font-bold text-yellow-300">
                {t.galleryTitle(mode === "AtoB" ? "A → B" : "B → A")}
                <span className="ml-2 text-white/40 font-normal">({discovered.length}/{maxFuncs})</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-3 justify-start">
              {discovered.map((mapping, idx) => (
                <MiniDiagram
                  key={idx}
                  index={idx}
                  mapping={mapping}
                  domain={domain}
                  codomain={codomain}
                />
              ))}
              {Array.from({ length: maxFuncs - discovered.length }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="w-[120px] h-[110px] rounded-lg border border-dashed border-white/10 bg-slate-900/30 flex items-center justify-center"
                >
                  <span className="text-white/15 text-xl">?</span>
                </div>
              ))}
            </div>

            {celebrate && (
              <div className="mt-4 bg-gradient-to-r from-yellow-900/40 to-green-900/40 border border-yellow-500/40 rounded-xl p-4 text-center">
                <p className="text-xl mb-1">🎉🏆🎉</p>
                <p className="text-yellow-300 font-bold text-sm">{t.celebrateTitle(maxFuncs)}</p>
                <p className="text-white/50 text-xs mt-1">
                  {t.celebrateDetail(mode === "AtoB" ? "A→B = n(B)^n(A) = 3² = 9" : "B→A = n(A)^n(B) = 2³ = 8")}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-white/10 rounded-xl p-4 mb-6 text-sm font-body">
          <p className="font-bold text-white mb-2">{t.conclusionTitle}</p>
          <p className="text-white/70 text-xs leading-relaxed">
            {t.conclusionText(
              language === "id" ? "<strong class='text-cyan-300'>n(A)</strong>" : "<strong class='text-cyan-300'>n(A)</strong>",
              language === "id" ? "<strong class='text-violet-300'>n(B)</strong>" : "<strong class='text-violet-300'>n(B)</strong>",
              language === "id" ? "<strong class='text-yellow-300'>n(B)^n(A)</strong>" : "<strong class='text-yellow-300'>n(B)^n(A)</strong>"
            )}
          </p>
          <p className="text-white/70 text-xs leading-relaxed mt-1">
            {language === "id"
              ? "Untuk A = {1,2} dan B = {a,b,c}, banyak fungsi dari A ke B = 3² = 9, dan dari B ke A = 2³ = 8."
              : language === "en"
              ? "For A = {1,2} and B = {a,b,c}: functions from A to B = 3² = 9, and from B to A = 2³ = 8."
              : "A = {1,2}、B = {a,b,c}の場合：A→Bの関数 = 3² = 9個、B→Aの関数 = 2³ = 8個。"}
          </p>
        </div>

      </div>
    </div>
  );
};

export default BukuAnimasiBanyakFungsiPage;
