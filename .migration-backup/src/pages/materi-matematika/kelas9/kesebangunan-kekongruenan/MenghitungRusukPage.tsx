import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const DiagramTrapesium = () => (
  <svg viewBox="0 0 340 175" className="w-full max-w-sm mx-auto">
    {/* Trapesium siku-siku ABCD (kiri, biru) */}
    {/* Siku-siku di A (bawah-kiri) dan D (atas-kiri) — sisi AD vertikal */}
    {/* A=bawah-kiri, B=bawah-kanan, C=atas-kanan, D=atas-kiri */}
    <polygon points="18,140 82,140 68,92 18,92" fill="#3b82f6" fillOpacity="0.3" stroke="#60a5fa" strokeWidth="2"/>
    {/* Tanda siku-siku di A */}
    <polyline points="18,132 26,132 26,140" fill="none" stroke="#93c5fd" strokeWidth="1.2"/>
    {/* Tanda siku-siku di D */}
    <polyline points="18,100 26,100 26,92" fill="none" stroke="#93c5fd" strokeWidth="1.2"/>
    {/* Label titik sudut */}
    <text x="7"  y="150" fontSize="9" fill="#93c5fd" fontWeight="bold">A</text>
    <text x="84" y="150" fontSize="9" fill="#93c5fd" fontWeight="bold">B</text>
    <text x="70" y="89"  fontSize="9" fill="#93c5fd" fontWeight="bold">C</text>
    <text x="5"  y="89"  fontSize="9" fill="#93c5fd" fontWeight="bold">D</text>
    {/* Nama */}
    <text x="50" y="122" textAnchor="middle" fontSize="9" fill="#93c5fd" fontWeight="bold">ABCD</text>

    {/* Simbol ~ */}
    <text x="122" y="122" fontSize="18" fill="#facc15" textAnchor="middle">~</text>

    {/* Trapesium siku-siku PQRS (kanan, hijau, lebih besar) */}
    {/* Siku-siku di P (bawah-kiri) dan S (atas-kiri) — sisi PS vertikal */}
    {/* P=bawah-kiri, Q=bawah-kanan, R=atas-kanan, S=atas-kiri */}
    <polygon points="155,144 263,144 241,82 155,82" fill="#22c55e" fillOpacity="0.25" stroke="#4ade80" strokeWidth="2"/>
    {/* Tanda siku-siku di P */}
    <polyline points="155,136 163,136 163,144" fill="none" stroke="#86efac" strokeWidth="1.2"/>
    {/* Tanda siku-siku di S */}
    <polyline points="155,90 163,90 163,82" fill="none" stroke="#86efac" strokeWidth="1.2"/>
    {/* Label titik sudut */}
    <text x="143" y="155" fontSize="9" fill="#86efac" fontWeight="bold">P</text>
    <text x="265" y="155" fontSize="9" fill="#86efac" fontWeight="bold">Q</text>
    <text x="243" y="79"  fontSize="9" fill="#86efac" fontWeight="bold">R</text>
    <text x="142" y="79"  fontSize="9" fill="#86efac" fontWeight="bold">S</text>
    {/* Nama */}
    <text x="209" y="122" textAnchor="middle" fontSize="9" fill="#86efac" fontWeight="bold">PQRS</text>

    {/* Info box */}
    <rect x="10" y="8" width="185" height="20" rx="4" fill="#1e293b" stroke="#334155"/>
    <text x="102" y="22" textAnchor="middle" fontSize="9" fill="#fde68a" fontWeight="bold">dengan faktor skala k</text>
  </svg>
);


const DiagramContoh1 = () => (
  <svg viewBox="0 0 360 195" className="w-full max-w-lg mx-auto">
    {/* === ABCD (kiri, biru) === */}
    {/* A=bawah-kiri, B=bawah-kanan, C=atas-kanan, D=atas-kiri */}
    {/* AB=8, DC=6, AD=4(vertikal), BC=miring */}
    <polygon points="20,155 80,155 65,115 20,115" fill="#3b82f6" fillOpacity="0.25" stroke="#60a5fa" strokeWidth="1.8"/>
    {/* siku-siku A */}
    <polyline points="20,147 28,147 28,155" fill="none" stroke="#93c5fd" strokeWidth="1.1"/>
    {/* siku-siku D */}
    <polyline points="20,123 28,123 28,115" fill="none" stroke="#93c5fd" strokeWidth="1.1"/>
    {/* label titik */}
    <text x="10" y="167" fontSize="9" fill="#93c5fd" fontWeight="bold">A</text>
    <text x="82" y="167" fontSize="9" fill="#93c5fd" fontWeight="bold">B</text>
    <text x="67" y="111" fontSize="9" fill="#93c5fd" fontWeight="bold">C</text>
    <text x="8"  y="111" fontSize="9" fill="#93c5fd" fontWeight="bold">D</text>
    {/* dimensi AB */}
    <text x="50" y="170" textAnchor="middle" fontSize="8" fill="#7dd3fc">8 cm</text>
    {/* dimensi DC */}
    <text x="43" y="110" textAnchor="middle" fontSize="8" fill="#7dd3fc">6 cm</text>
    {/* dimensi AD */}
    <text x="5" y="138" textAnchor="middle" fontSize="8" fill="#7dd3fc">4</text>
    {/* dimensi BC */}
    <text x="84" y="138" textAnchor="start" fontSize="8" fill="#7dd3fc">5</text>

    {/* simbol ~ */}
    <text x="118" y="140" fontSize="20" fill="#facc15" textAnchor="middle">~</text>

    {/* === PQRS (kanan, hijau, 2× lebih besar) === */}
    {/* P=bawah-kiri, Q=bawah-kanan, R=atas-kanan, S=atas-kiri */}
    {/* PQ=16, RS=?, PS=?(vertikal), QR=? */}
    <polygon points="148,160 268,160 238,80 148,80" fill="#22c55e" fillOpacity="0.2" stroke="#4ade80" strokeWidth="1.8"/>
    {/* siku-siku P */}
    <polyline points="148,152 156,152 156,160" fill="none" stroke="#86efac" strokeWidth="1.1"/>
    {/* siku-siku S */}
    <polyline points="148,88 156,88 156,80" fill="none" stroke="#86efac" strokeWidth="1.1"/>
    {/* label titik */}
    <text x="137" y="173" fontSize="9" fill="#86efac" fontWeight="bold">P</text>
    <text x="270" y="173" fontSize="9" fill="#86efac" fontWeight="bold">Q</text>
    <text x="240" y="77"  fontSize="9" fill="#86efac" fontWeight="bold">R</text>
    <text x="136" y="77"  fontSize="9" fill="#86efac" fontWeight="bold">S</text>
    {/* dimensi PQ */}
    <text x="208" y="175" textAnchor="middle" fontSize="8" fill="#86efac">16 cm</text>
    {/* dimensi RS */}
    <text x="193" y="75" textAnchor="middle" fontSize="8" fill="#fbbf24">RS = ?</text>
    {/* dimensi PS */}
    <text x="130" y="122" textAnchor="middle" fontSize="8" fill="#fbbf24">PS=?</text>
    {/* dimensi QR */}
    <text x="274" y="122" textAnchor="start" fontSize="8" fill="#fbbf24">QR=?</text>
  </svg>
);

const DiagramContoh2 = () => (
  <svg viewBox="0 0 370 185" className="w-full max-w-lg mx-auto">
    {/* === ABCD (kiri, biru, lebih kecil) === */}
    <polygon points="28,155 95,155 80,99 28,99" fill="#3b82f6" fillOpacity="0.22" stroke="#60a5fa" strokeWidth="1.8"/>
    {/* Label titik */}
    <text x="15"  y="167" fontSize="9" fill="#93c5fd" fontWeight="bold">A</text>
    <text x="97"  y="167" fontSize="9" fill="#93c5fd" fontWeight="bold">B</text>
    <text x="81"  y="96"  fontSize="9" fill="#93c5fd" fontWeight="bold">C</text>
    <text x="14"  y="96"  fontSize="9" fill="#93c5fd" fontWeight="bold">D</text>
    {/* Dimensi AD (kiri, vertikal) */}
    <text x="10" y="130" textAnchor="middle" fontSize="8" fill="#7dd3fc">4 cm</text>
    {/* Dimensi DC (atas) */}
    <text x="55" y="94"  textAnchor="middle" fontSize="8" fill="#7dd3fc">3 cm</text>
    {/* Sudut A = 75° — arc kecil di pojok A */}
    <path d="M 28,143 A 12,12 0 0,1 40,155" fill="none" stroke="#facc15" strokeWidth="1.4"/>
    <text x="42"  y="151" fontSize="7.5" fill="#facc15" fontWeight="bold">75°</text>

    {/* Simbol ~ */}
    <text x="122" y="133" fontSize="20" fill="#facc15" textAnchor="middle">~</text>

    {/* === PQRS (kanan, hijau, lebih besar) === */}
    <polygon points="152,161 252,161 232,77 152,77" fill="#22c55e" fillOpacity="0.18" stroke="#4ade80" strokeWidth="1.8"/>
    {/* Label titik */}
    <text x="139" y="174" fontSize="9" fill="#86efac" fontWeight="bold">P</text>
    <text x="254" y="174" fontSize="9" fill="#86efac" fontWeight="bold">Q</text>
    <text x="233" y="74"  fontSize="9" fill="#86efac" fontWeight="bold">R</text>
    <text x="138" y="74"  fontSize="9" fill="#86efac" fontWeight="bold">S</text>
    {/* Dimensi PS (kiri, vertikal) */}
    <text x="134" y="122" textAnchor="middle" fontSize="8" fill="#86efac">6 cm</text>
    {/* Dimensi RS (atas, ditanya) */}
    <text x="193" y="71"  textAnchor="middle" fontSize="8" fill="#fbbf24">RS = ?</text>
    {/* Sudut P = ? — arc kecil di pojok P */}
    <path d="M 152,149 A 12,12 0 0,1 164,161" fill="none" stroke="#facc15" strokeWidth="1.4"/>
    <text x="167" y="156" fontSize="7.5" fill="#fbbf24" fontWeight="bold">∠P=?</text>
  </svg>
);

const ShadowAnimation = () => {
  const [angleDeg, setAngleDeg] = useState(63);
  const angleRad = (angleDeg * Math.PI) / 180;

  const GROUND_Y = 188;
  const SCALE = 15;
  const TIANG_H_PX = 4 * SCALE; // 60px = 4m
  const TREE_H_PX  = 8 * SCALE; // 120px = 8m (2× tiang)
  const tiangX = 370;
  const treeX  = 78;

  const shadowTiangPx = (4 / Math.tan(angleRad)) * SCALE;
  const shadowTreePx  = (8 / Math.tan(angleRad)) * SCALE;
  const tiangTop = GROUND_Y - TIANG_H_PX; // 128
  const treeTop  = GROUND_Y - TREE_H_PX;  // 68
  const tiangShadowEnd = tiangX + shadowTiangPx;
  const treeShadowEnd  = treeX  + shadowTreePx;

  const shadowTiangM = (4 / Math.tan(angleRad)).toFixed(2);
  const shadowTreeM  = (8 / Math.tan(angleRad)).toFixed(2);
  const ratio = (parseFloat(shadowTiangM) / parseFloat(shadowTreeM)).toFixed(2);

  const tr = "all 0.25s ease";

  return (
    <div className="space-y-3">
      <svg viewBox="0 0 520 215" className="w-full" overflow="visible">
        {/* Ground */}
        <line x1="0" y1={GROUND_Y} x2="520" y2={GROUND_Y} stroke="#475569" strokeWidth="2"/>

        {/* ── Pohon (hijau) ── */}
        {/* Triangle area */}
        <polygon
          points={`${treeX},${GROUND_Y} ${treeX},${treeTop} ${treeShadowEnd},${GROUND_Y}`}
          fill="#22c55e" fillOpacity="0.12" stroke="none"
          style={{ transition: tr }}
        />
        {/* Trunk */}
        <rect x={treeX - 3} y={treeTop + 55} width={6} height={TREE_H_PX - 55} fill="#92400e" rx="1"/>
        {/* Canopy circles */}
        <circle cx={treeX}      cy={treeTop + 18} r={24} fill="#16a34a" fillOpacity="0.85"/>
        <circle cx={treeX - 14} cy={treeTop + 32} r={17} fill="#15803d" fillOpacity="0.85"/>
        <circle cx={treeX + 14} cy={treeTop + 32} r={17} fill="#15803d" fillOpacity="0.85"/>
        <circle cx={treeX}      cy={treeTop + 40} r={20} fill="#22c55e" fillOpacity="0.7"/>
        {/* Hypotenuse (sinar matahari) */}
        <line x1={treeX} y1={treeTop} x2={treeShadowEnd} y2={GROUND_Y}
          stroke="#4ade80" strokeWidth="1.5" strokeDasharray="6,3"
          style={{ transition: tr }}/>
        {/* Shadow line */}
        <line x1={treeX} y1={GROUND_Y} x2={treeShadowEnd} y2={GROUND_Y}
          stroke="#facc15" strokeWidth="3.5" strokeLinecap="round"
          style={{ transition: tr }}/>
        {/* Right angle */}
        <polyline points={`${treeX+9},${GROUND_Y} ${treeX+9},${GROUND_Y-9} ${treeX},${GROUND_Y-9}`}
          fill="none" stroke="#4ade80" strokeWidth="1.2"/>
        {/* Height label */}
        <text x={treeX - 8} y={(treeTop + GROUND_Y) / 2 + 4} textAnchor="end" fontSize="10" fill="#86efac" fontWeight="bold">8 m</text>
        {/* Shadow label */}
        <text
          x={(treeX + treeShadowEnd) / 2} y={GROUND_Y + 16}
          textAnchor="middle" fontSize="9" fill="#fde68a" fontWeight="bold"
          style={{ transition: tr }}
        >{shadowTreeM} m</text>
        <text
          x={(treeX + treeShadowEnd) / 2} y={GROUND_Y + 28}
          textAnchor="middle" fontSize="8" fill="#fb923c" fontWeight="bold"
          style={{ transition: tr }}
        >(= 2 × {shadowTiangM})</text>

        {/* ── Tiang Bendera (biru) ── */}
        {/* Triangle area */}
        <polygon
          points={`${tiangX},${GROUND_Y} ${tiangX},${tiangTop} ${tiangShadowEnd},${GROUND_Y}`}
          fill="#3b82f6" fillOpacity="0.15" stroke="none"
          style={{ transition: tr }}
        />
        {/* Pole */}
        <rect x={tiangX - 2} y={tiangTop} width={4} height={TIANG_H_PX} fill="#93c5fd" rx="1"/>
        {/* Flag (merah putih) */}
        <polygon points={`${tiangX+2},${tiangTop} ${tiangX+22},${tiangTop+9} ${tiangX+2},${tiangTop+18}`} fill="#ef4444"/>
        <polygon points={`${tiangX+2},${tiangTop+9} ${tiangX+22},${tiangTop+18} ${tiangX+2},${tiangTop+18}`} fill="#f8fafc"/>
        {/* Hypotenuse (sinar matahari) */}
        <line x1={tiangX} y1={tiangTop} x2={tiangShadowEnd} y2={GROUND_Y}
          stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="6,3"
          style={{ transition: tr }}/>
        {/* Shadow line */}
        <line x1={tiangX} y1={GROUND_Y} x2={tiangShadowEnd} y2={GROUND_Y}
          stroke="#facc15" strokeWidth="3.5" strokeLinecap="round"
          style={{ transition: tr }}/>
        {/* Right angle */}
        <polyline points={`${tiangX+9},${GROUND_Y} ${tiangX+9},${GROUND_Y-9} ${tiangX},${GROUND_Y-9}`}
          fill="none" stroke="#93c5fd" strokeWidth="1.2"/>
        {/* Height label */}
        <text x={tiangX - 8} y={(tiangTop + GROUND_Y) / 2 + 4} textAnchor="end" fontSize="10" fill="#7dd3fc" fontWeight="bold">4 m</text>
        {/* Shadow label */}
        <text
          x={(tiangX + tiangShadowEnd) / 2} y={GROUND_Y + 16}
          textAnchor="middle" fontSize="9" fill="#fde68a" fontWeight="bold"
          style={{ transition: tr }}
        >{shadowTiangM} m</text>

        {/* Similarity symbol */}
        <text x="228" y="148" textAnchor="middle" fontSize="22" fill="#facc15" fontWeight="bold">~</text>

        {/* Sun icon (dekoratif, kanan atas) */}
        <circle cx="500" cy="22" r="13" fill="#fde047" fillOpacity="0.95"/>
        {[0,45,90,135,180,225,270,315].map((a) => {
          const r = (a * Math.PI) / 180;
          return (
            <line key={a}
              x1={500 + 15 * Math.cos(r)} y1={22 + 15 * Math.sin(r)}
              x2={500 + 21 * Math.cos(r)} y2={22 + 21 * Math.sin(r)}
              stroke="#fde047" strokeWidth="1.8"/>
          );
        })}
        <text x="500" y="47" textAnchor="middle" fontSize="8" fill="#fde68a">☀️ matahari</text>

        {/* ── Sudut elevasi matahari (tiang) ── */}
        <path
          d={`M ${tiangShadowEnd - 22} ${GROUND_Y} A 22 22 0 0 1 ${tiangShadowEnd - 22 * Math.cos(angleRad)} ${GROUND_Y - 22 * Math.sin(angleRad)}`}
          fill="#facc1530" stroke="#facc15" strokeWidth="1.5"
          style={{ transition: tr }}
        />
        <text
          x={tiangShadowEnd - 36 * Math.cos(angleRad / 2)}
          y={GROUND_Y - 36 * Math.sin(angleRad / 2) + 4}
          textAnchor="middle" fontSize="9" fill="#facc15" fontWeight="bold"
          style={{ transition: tr }}
        >θ</text>

        {/* ── Sudut elevasi matahari (pohon) ── */}
        <path
          d={`M ${treeShadowEnd - 22} ${GROUND_Y} A 22 22 0 0 1 ${treeShadowEnd - 22 * Math.cos(angleRad)} ${GROUND_Y - 22 * Math.sin(angleRad)}`}
          fill="#fde04730" stroke="#fde047" strokeWidth="1.5"
          style={{ transition: tr }}
        />
        <text
          x={treeShadowEnd - 36 * Math.cos(angleRad / 2)}
          y={GROUND_Y - 36 * Math.sin(angleRad / 2) + 4}
          textAnchor="middle" fontSize="9" fill="#fde047" fontWeight="bold"
          style={{ transition: tr }}
        >θ</text>

        {/* "bayangan" labels */}
        <text x={(treeX + treeShadowEnd) / 2} y={GROUND_Y + 38} textAnchor="middle" fontSize="7.5" fill="#94a3b8" style={{ transition: tr }}>bayangan pohon</text>
        <text x={(tiangX + tiangShadowEnd) / 2} y={GROUND_Y + 28} textAnchor="middle" fontSize="7.5" fill="#94a3b8" style={{ transition: tr }}>bayangan tiang</text>
      </svg>

      {/* Slider */}
      <div className="px-3 mt-6">
        <div className="flex items-center justify-between mb-1">
          <span className="font-body text-xs text-white/60">☀️ Geser untuk ubah sudut matahari</span>
          <span className="font-body text-xs text-yellow-300 font-bold">{angleDeg}°</span>
        </div>
        <input
          type="range" min="40" max="75" step="1" value={angleDeg}
          onChange={(e) => setAngleDeg(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-yellow-400 bg-slate-700"
        />
        <div className="flex justify-between text-xs text-white/30 mt-1 font-body">
          <span>40° (matahari rendah)</span>
          <span>75° (matahari tinggi)</span>
        </div>
      </div>

      {/* Live ratio */}
      <div className="bg-slate-900/70 border border-slate-700/50 rounded-lg p-3 font-body text-sm text-center space-y-2">
        <p className="text-white/50 text-xs">Perbandingan selalu konstan — berapapun sudutnya:</p>
        <p className="text-cyan-200 font-bold text-sm">
          <span className="text-white/70">tinggi tiang / tinggi pohon </span>=
          <span className="text-blue-300"> 4 / 8 </span>=
          <span className="text-yellow-300"> 0.50</span>
        </p>
        <p className="text-cyan-200 font-bold text-sm">
          <span className="text-white/70">bayangan tiang / bayangan pohon </span>=
          <span className="text-green-300"> {shadowTiangM} / {shadowTreeM} </span>=
          <span className="text-yellow-300"> {ratio}</span>
        </p>
        <p className="text-orange-300 text-xs font-semibold">
          ✦ bayangan pohon selalu = 2 × bayangan tiang ({shadowTiangM} × 2 = {shadowTreeM} m)
        </p>
      </div>
    </div>
  );
};

const MenghitungRusukPage = () => {
  const navigate = useNavigate();
  const Header = ({ id, icon, color, label }: { id: string; icon: React.ReactNode; color: string; label: string }) => (
    <div className="w-full flex items-center px-5 py-4">
      <div className="flex items-center gap-3"><span style={{ color }}>{icon}</span><span className="font-body font-semibold text-white">{label}</span></div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">MENGHITUNG PANJANG RUSUK BANGUN DATAR YANG SEBANGUN</h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Kesebangunan dan Kekongruenan · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="intro" icon={<Lightbulb className="w-5 h-5" />} color="#facc15" label="📐 Cara Menghitung Rusuk yang Belum Diketahui" />
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Kalau dua bangun sudah terbukti sebangun, kita bisa memanfaatkan sifat <strong className="text-cyan-300">rusuk-rusuk sebanding</strong> untuk mencari panjang rusuk yang belum diketahui. Caranya sangat sistematis!
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    <strong>Langkah Umum:</strong>
                  </p>
                  <ol className="font-body text-sm text-cyan-100 space-y-1 list-decimal list-inside mt-2">
                    <li>Identifikasi pasangan rusuk yang bersesuaian</li>
                    <li>Bentuk persamaan perbandingan: <InlineMath math="\frac{a}{p} = \frac{b}{q} = \frac{c}{r}" /></li>
                    <li>Gunakan perkalian silang untuk mencari rusuk yang belum diketahui</li>
                  </ol>
                </div>
              </div>
          </div>

          {/* KONSEP */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep1" icon={<Target className="w-5 h-5" />} color="#4ade80" label="📘 Konsep: Rumus Perbandingan Rusuk" />
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                    <DiagramTrapesium />
                    <p className="font-body text-xs text-white/50 text-center mt-2">Trapesium ABCD ~ PQRS dengan faktor skala k</p>
                  </div>
                  <p className="font-body text-sm text-white/80">Jika bangun <InlineMath math="ABCD \sim PQRS" />, maka berlaku:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4">
                    <BlockMath math="\frac{AB}{PQ} = \frac{BC}{QR} = \frac{CD}{RS} = \frac{DA}{SP} = k" />
                  </div>
                  <p className="font-body text-sm text-white/80">Dari persamaan tersebut, jika tiga nilai diketahui, nilai ke-4 dapat dicari dengan <strong className="text-green-300">perkalian silang</strong>:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4">
                    <BlockMath math="\frac{a}{p} = \frac{b}{q} \Rightarrow a \times q = b \times p" />
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-green-300 mb-1">Kasus Bayangan (Kontekstual):</p>
                    <BlockMath math="\frac{\text{tinggi orang}}{\text{tinggi pohon}} = \frac{\text{tinggi bayangan orang}}{\text{tinggi bayangan pohon}}" />
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">🌳 ILUSTRASI BAYANGAN:</p>
                  <img src="/bayangan-orang-pohon.png" alt="Ilustrasi bayangan orang dan pohon" className="w-full max-w-lg mx-auto rounded-lg block" />
                  <p className="font-body text-xs text-white/40 text-center mt-2">gemini.google.com/app</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Selalu pastikan satuan panjangnya sama sebelum menghitung! Jika ada yang dalam cm dan ada yang dalam meter, ubah dulu ke satuan yang sama.
                  </p>
                </div>
              </div>
          </div>

          {/* ANIMASI INTERAKTIF */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="animasi" icon={<Target className="w-5 h-5" />} color="#f97316" label="🎮 Animasi Interaktif — Bayangan & Segitiga Sebangun" />
            <div className="px-5 pb-5 space-y-3">
              <p className="font-body text-sm text-white/70 leading-relaxed">
                Geser slider untuk mengubah sudut matahari. Perhatikan bagaimana panjang bayangan berubah, tetapi <strong className="text-orange-300">perbandingan tinggi tiang : tinggi pohon selalu sama</strong> dengan perbandingan bayangan tiang : bayangan pohon.
              </p>
              <ShadowAnimation />
            </div>
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="contoh1" icon={<Calculator className="w-5 h-5" />} color="#60a5fa" label="📝 Contoh Soal — Menghitung Panjang Rusuk" />
              <div className="px-5 pb-5 space-y-6">
                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Trapesium ABCD sebangun dengan trapesium PQRS. Diketahui <InlineMath math="AB = 8" /> cm, <InlineMath math="DC = 6" /> cm, <InlineMath math="BC = 5" /> cm, <InlineMath math="AD = 4" /> cm, dan <InlineMath math="PQ = 16" /> cm. Tentukan panjang <InlineMath math="QR" />, <InlineMath math="RS" />, dan <InlineMath math="PS" />!
                    </p>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3">
                    <DiagramContoh1 />
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p>Karena ABCD ∼ PQRS, sisi-sisi yang bersesuaian membentuk perbandingan yang sama:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{AB}{PQ} = \frac{BC}{QR} = \frac{DC}{RS} = \frac{AD}{PS}" />
                      </div>
                      <p><strong>Mencari QR</strong> (AB bersesuaian dengan PQ, BC bersesuaian dengan QR):</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{AB}{PQ} = \frac{BC}{QR} \Rightarrow \frac{8}{16} = \frac{5}{QR}" />
                        <BlockMath math="8 \times QR = 16 \times 5 \Rightarrow QR = \frac{80}{8} = 10 \text{ cm}" />
                      </div>
                      <p><strong>Mencari RS</strong> (DC bersesuaian dengan RS):</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{AB}{PQ} = \frac{DC}{RS} \Rightarrow \frac{8}{16} = \frac{6}{RS}" />
                        <BlockMath math="8 \times RS = 16 \times 6 \Rightarrow RS = \frac{96}{8} = 12 \text{ cm}" />
                      </div>
                      <p><strong>Mencari PS</strong> (AD bersesuaian dengan PS):</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{AB}{PQ} = \frac{AD}{PS} \Rightarrow \frac{8}{16} = \frac{4}{PS}" />
                        <BlockMath math="8 \times PS = 16 \times 4 \Rightarrow PS = \frac{64}{8} = 8 \text{ cm}" />
                      </div>
                      <p><strong className="text-green-300">QR = 10 cm, RS = 12 cm, PS = 8 cm.</strong></p>
                    </div>
                  </div>
                </div>
                {/* SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Segiempat ABCD sebangun dengan PQRS. Diketahui <InlineMath math="AD = 4" /> cm, <InlineMath math="PS = 6" /> cm, <InlineMath math="CD = 3" /> cm, dan <InlineMath math="\angle A = 75°" />. Tentukan panjang <InlineMath math="RS" /> dan besar <InlineMath math="\angle P" />!
                    </p>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3">
                    <DiagramContoh2 />
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Cari RS:</strong> AD bersesuaian dengan PS, CD bersesuaian dengan RS:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{AD}{PS} = \frac{CD}{RS} \Rightarrow \frac{4}{6} = \frac{3}{RS}" />
                        <BlockMath math="RS = \frac{3 \times 6}{4} = \frac{18}{4} = 4{,}5 \text{ cm}" />
                      </div>
                      <p><strong>Cari ∠P:</strong> Sudut yang bersesuaian sama besar:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\angle P = \angle A = 75°" />
                      </div>
                      <p><strong className="text-yellow-300">RS = 4,5 cm dan ∠P = 75°.</strong></p>
                    </div>
                  </div>
                </div>
                {/* SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Pada siang hari, sebuah tiang bendera setinggi 4 m mempunyai bayangan 2 m. Pada saat yang sama, sebuah pohon mempunyai bayangan sepanjang 3 m. Tentukan tinggi pohon tersebut!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Konsep:</strong> Tiang dan bayangan membentuk segitiga yang sebangun dengan pohon dan bayangannya (karena sudut elevasi matahari sama).</p>
                      <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-2 my-2">
                        <img src="/bayangan-tiang-pohon.png" alt="Ilustrasi bayangan tiang dan pohon" className="w-full max-w-sm mx-auto rounded-lg block" />
                      </div>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{\text{tinggi tiang}}{\text{tinggi pohon}} = \frac{\text{bayangan tiang}}{\text{bayangan pohon}}" />
                        <BlockMath math="\frac{4}{x} = \frac{2}{3}" />
                      </div>
                      <p><strong>Selesaikan:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="x = \frac{4 \times 3}{2} = \frac{12}{2} = 6 \text{ m}" />
                      </div>
                      <p><strong className="text-primary">Tinggi pohon = 6 m.</strong></p>
                    </div>
                  </div>
                </div>
              </div>
          </div>

          {/* ── RANGKUMAN, TIPS & TRIK, KESIMPULAN ── */}
          <div className="space-y-4">

            {/* Rangkuman */}
            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 rounded-xl p-5 space-y-4">
              <p className="font-body text-base font-bold text-emerald-300">📋 Rangkuman — Menghitung Rusuk Bangun Sebangun</p>
              <div className="overflow-x-auto">
                <table className="w-full font-body text-xs text-white/80">
                  <thead>
                    <tr className="border-b border-emerald-500/30">
                      <th className="text-left py-2 pr-4 text-emerald-300">Konsep</th>
                      <th className="text-left py-2 text-emerald-300">Rumus / Cara</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    <tr>
                      <td className="py-2 pr-4 text-green-300 font-semibold">Faktor Skala</td>
                      <td className="py-2"><InlineMath math="k = \dfrac{\text{rusuk bangun besar}}{\text{rusuk bangun kecil}}" /></td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-blue-300 font-semibold">Perbandingan Sisi</td>
                      <td className="py-2"><InlineMath math="\dfrac{AB}{PQ} = \dfrac{BC}{QR} = \dfrac{CD}{RS} = k" /></td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-purple-300 font-semibold">Cari Rusuk Baru</td>
                      <td className="py-2"><InlineMath math="\text{rusuk besar} = k \times \text{rusuk kecil}" /></td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-cyan-300 font-semibold">Sudut</td>
                      <td className="py-2">Semua sudut bersesuaian <strong>selalu sama besar</strong> (tidak berubah meski k ≠ 1)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-slate-900/60 rounded-lg p-3 space-y-1 font-body text-xs text-white/75">
                <p>📌 <strong className="text-emerald-300">Langkah sistematik:</strong> (1) Tentukan pasangan sisi bersesuaian → (2) Hitung k dari pasangan yang diketahui → (3) Gunakan k untuk mencari sisi yang ditanya</p>
                <p>📌 <strong className="text-emerald-300">Soal bayangan:</strong> Tiang dan pohon sebangun jika sudut elevasi matahari sama → tinggi/bayangan selalu konstan</p>
                <p>📌 <strong className="text-emerald-300">Validasi:</strong> Semua perbandingan sisi bersesuaian harus menghasilkan nilai k yang sama</p>
              </div>
            </div>

            {/* Tips & Trik */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 space-y-3">
              <p className="font-body text-base font-bold text-amber-300">💡 Tips &amp; Trik</p>
              <div className="space-y-3 font-body text-sm text-white/80">
                <div className="flex gap-3">
                  <span className="text-amber-400 font-bold shrink-0">①</span>
                  <div>
                    <p><strong className="text-amber-300">Identifikasi sisi "pasangan" terlebih dulu:</strong> Sebelum menghitung, gambar atau tandai mana sisi A yang bersesuaian dengan sisi P. Kesalahan terbesar siswa adalah memasangkan sisi yang salah.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-amber-400 font-bold shrink-0">②</span>
                  <div>
                    <p><strong className="text-amber-300">Gunakan perkalian silang untuk efisiensi:</strong></p>
                    <div className="bg-slate-900/50 rounded p-2 mt-1">
                      <BlockMath math="\frac{a}{p} = \frac{x}{q} \;\Longrightarrow\; x = \frac{a \times q}{p}" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-amber-400 font-bold shrink-0">③</span>
                  <p><strong className="text-amber-300">Soal bayangan / cermin:</strong> Selalu buat proporsi <InlineMath math="\frac{\text{tinggi objek}}{\text{panjang bayangan}} = \text{konstan}" />. Sudut matahari yang sama → AA → sebangun otomatis.</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-amber-400 font-bold shrink-0">④</span>
                  <p><strong className="text-amber-300">Cek masuk akal:</strong> Jika k &gt; 1, bangun kedua lebih besar. Jika k &lt; 1, lebih kecil. Pastikan jawaban sesuai dengan gambar soal.</p>
                </div>
              </div>
            </div>

            {/* Kesimpulan */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 space-y-3">
              <p className="font-body text-base font-bold text-green-300">✅ Kesimpulan</p>
              <div className="space-y-2 font-body text-sm text-white/80">
                <p>Menghitung rusuk bangun sebangun bermuara pada satu kunci: <strong className="text-yellow-300">faktor skala k</strong>.</p>
                <div className="bg-slate-900/60 rounded-lg p-3 space-y-1">
                  <p>🔹 Temukan <InlineMath math="k" /> dari sepasang sisi yang diketahui</p>
                  <p>🔹 Gunakan <InlineMath math="k" /> untuk menghitung semua sisi lainnya</p>
                  <p>🔹 Sudut tidak perlu dihitung ulang — sudut bersesuaian selalu sama besar</p>
                  <p>🔹 Aplikasi nyata: peta, foto, model miniatur, bayangan — semuanya menggunakan prinsip ini!</p>
                </div>
                <p className="text-xs text-white/55 italic">Penguasaan konsep ini membuka jalan untuk memahami transformasi geometri, skala peta, dan trigonometri.</p>
              </div>
            </div>

          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/kesebangunan-kekongruenan"); }} className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Kesebangunan dan Kekongruenan
          </button>
        </div>
      </div>
    </div>
  );
};
export default MenghitungRusukPage;
