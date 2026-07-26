import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { InlineMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";

/* ─────────────── SVG DIAGRAMS ─────────────── */

/* Q1: L-shape */
const DiagramQ1 = () => (
  <svg viewBox="0 0 380 280" className="w-full max-w-sm mx-auto my-3" aria-label="Bangun L">
    <polygon points="30,30 200,30 200,140 310,140 310,250 30,250"
      fill="rgba(96,165,250,0.12)" stroke="#60a5fa" strokeWidth="2" />
    <polyline points="30,42 42,42 42,30"   fill="none" stroke="#60a5fa" strokeWidth="1.5" />
    <polyline points="188,30 188,42 200,42" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
    <polyline points="200,128 212,128 212,140" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
    <polyline points="298,140 298,152 310,152" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
    <polyline points="298,250 298,238 310,238" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
    <polyline points="30,238 42,238 42,250"   fill="none" stroke="#60a5fa" strokeWidth="1.5" />
    <text x="106" y="22"  fill="#ffffff" fontSize="12" fontFamily="monospace" textAnchor="middle">10 cm</text>
    <text x="255" y="135" fill="#ffffff" fontSize="12" fontFamily="monospace" textAnchor="middle">8 cm</text>
    <text x="170" y="268" fill="#ffffff" fontSize="12" fontFamily="monospace" textAnchor="middle">14 cm</text>
    <text x="316" y="198" fill="#ffffff" fontSize="12" fontFamily="monospace">6 cm</text>
    <text x="14"  y="145" fill="#ffffff" fontSize="12" fontFamily="monospace" transform="rotate(-90 14 145)">11 cm</text>
    <text x="194" y="88"  fill="#ffffff" fontSize="12" fontFamily="monospace" transform="rotate(-90 194 88)">? cm</text>
    {/* keliling arrow */}
    <text x="60" y="170" fill="#ffffff" fontSize="11" fontFamily="monospace">Hitung keliling!</text>
  </svg>
);

/* Q2: T-shape (stepped) */
const DiagramQ2 = () => (
  <svg viewBox="0 0 380 280" className="w-full max-w-sm mx-auto my-3" aria-label="Bangun bertingkat">
    <polygon points="30,250 30,150 120,150 120,30 260,30 260,150 350,150 350,250"
      fill="rgba(167,139,250,0.12)" stroke="#a78bfa" strokeWidth="2" />
    <text x="185" y="22"  fill="#ffffff" fontSize="12" fontFamily="monospace" textAnchor="middle">14 cm</text>
    <text x="185" y="268" fill="#ffffff" fontSize="12" fontFamily="monospace" textAnchor="middle">32 cm</text>
    <text x="14"  y="200" fill="#ffffff" fontSize="12" fontFamily="monospace" transform="rotate(-90 14 200)">10 cm</text>
    <text x="364" y="200" fill="#ffffff" fontSize="12" fontFamily="monospace" transform="rotate(90 360 200)">10 cm</text>
    <text x="73"  y="145" fill="#ffffff" fontSize="11" fontFamily="monospace">9 cm</text>
    <text x="261" y="145" fill="#ffffff" fontSize="11" fontFamily="monospace">9 cm</text>
    <text x="114" y="92"  fill="#ffffff" fontSize="11" fontFamily="monospace" transform="rotate(-90 114 92)">12 cm</text>
    <text x="261" y="92"  fill="#ffffff" fontSize="11" fontFamily="monospace" transform="rotate(90 260 92)">12 cm</text>
  </svg>
);

/* Q3: House shape (pentagon) */
const DiagramQ3 = () => (
  <svg viewBox="0 0 320 300" className="w-full max-w-xs mx-auto my-3" aria-label="Rumah (gabungan persegi + segitiga)">
    <rect  x="50" y="140" width="210" height="140" fill="rgba(74,222,128,0.10)" stroke="#4ade80" strokeWidth="2" />
    <polygon points="155,20 50,140 260,140" fill="rgba(74,222,128,0.15)" stroke="#4ade80" strokeWidth="2" />
    <line x1="155" y1="20" x2="155" y2="140" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,4" />
    <polyline points="155,128 167,128 167,140" fill="none" stroke="#facc15" strokeWidth="1.5" />
    <text x="155" y="268" fill="#ffffff" fontSize="12" fontFamily="monospace" textAnchor="middle">21 cm</text>
    <text x="270" y="214" fill="#ffffff" fontSize="12" fontFamily="monospace" transform="rotate(90 268 214)">14 cm</text>
    <text x="163" y="85"  fill="#ffffff" fontSize="11" fontFamily="monospace">8 cm</text>
  </svg>
);

/* Q4: Cross / plus shape */
const DiagramQ4 = () => (
  <svg viewBox="0 0 320 320" className="w-full max-w-xs mx-auto my-3" aria-label="Bangun plus/salip">
    <polygon points="110,30 200,30 200,110 280,110 280,200 200,200 200,280 110,280 110,200 30,200 30,110 110,110"
      fill="rgba(251,146,60,0.12)" stroke="#fb923c" strokeWidth="2" />
    <text x="155" y="24"  fill="#ffffff" fontSize="11" fontFamily="monospace" textAnchor="middle">6 cm</text>
    <text x="155" y="298" fill="#ffffff" fontSize="11" fontFamily="monospace" textAnchor="middle">6 cm</text>
    <text x="14"  y="160" fill="#ffffff" fontSize="11" fontFamily="monospace" transform="rotate(-90 14 160)">6 cm</text>
    <text x="304" y="160" fill="#ffffff" fontSize="11" fontFamily="monospace" transform="rotate(90 304 160)">6 cm</text>
    <text x="148" y="160" fill="#ffffff" fontSize="11" fontFamily="monospace" textAnchor="middle">6 cm</text>
    <text x="100" y="25"  fill="#ffffff" fontSize="10" fontFamily="monospace">6 cm</text>
  </svg>
);

/* Q5: Grid-based irregular shape */
const DiagramQ5 = () => {
  const cell = 36;
  const grid = [
    [0,1,1,0],
    [1,1,1,1],
    [1,1,1,0],
    [0,1,0,0],
  ];
  return (
    <svg viewBox="0 0 200 200" className="w-36 mx-auto my-3" aria-label="Bangun pada grid">
      {grid.map((row, r) =>
        row.map((val, c) =>
          val ? (
            <rect key={`${r}-${c}`} x={c * cell + 10} y={r * cell + 10} width={cell} height={cell}
              fill="rgba(96,165,250,0.20)" stroke="#60a5fa" strokeWidth="1.5" />
          ) : null
        )
      )}
      <text x="100" y="190" fill="#ffffff" fontSize="11" fontFamily="monospace" textAnchor="middle">1 kotak = 1 cm²</text>
    </svg>
  );
};

/* ─────────────── SECTION & QUESTION ─────────────── */
type SectionProps = { title: string; color: string; children: React.ReactNode };
const Section = ({ title, color, children }: SectionProps) => (
  <div className="rounded-xl border p-5 space-y-6" style={{ borderColor: color + "55", background: color + "0a" }}>
    <h3 className="font-display font-bold text-sm uppercase tracking-widest" style={{ color }}>{title}</h3>
    {children}
  </div>
);

type QProps = { no: number; children: React.ReactNode; diagram?: React.ReactNode; badge?: string; badgeColor?: string };
const Q = ({ no, children, diagram, badge, badgeColor = "#60a5fa" }: QProps) => (
  <div className="flex gap-3">
    <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-black" style={{ background: badgeColor }}>
      {no}
    </div>
    <div className="flex-1 space-y-2">
      {badge && (
        <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-1" style={{ background: badgeColor + "33", color: badgeColor }}>
          {badge}
        </span>
      )}
      {diagram && <div>{diagram}</div>}
      <div className="text-white/90 text-sm leading-relaxed font-body">{children}</div>
    </div>
  </div>
);

/* ─────────────── PAGE ─────────────── */
const KelilingLuasBangunTakBeraturanLatihanPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const p = "practice.segitigaSegiempat.kelilingLuasBangunTakBeraturan";

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.4)" }}>
            <BookOpen className="w-7 h-7 text-orange-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1">
            {t(`${p}.title`)}
          </h1>
          <p className="text-white/50 text-xs font-body">{t(`${p}.subtitle`)}</p>
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            {["UN", "TKA", "ANBK"].map(tag => (
              <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400/15 text-yellow-300 border border-yellow-400/30">{tag}</span>
            ))}
          </div>
        </div>

        {/* Tip Box */}
        <div className="rounded-xl bg-orange-500/10 border border-orange-500/30 px-5 py-4 mb-6 text-sm text-white/80 font-body leading-relaxed">
          <p className="font-bold text-orange-300 mb-1">{t(`${p}.tipTitle`)}</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-white/70">
            <li>{t(`${p}.tip1`)}</li>
            <li>{t(`${p}.tip2`)}</li>
            <li>{t(`${p}.tip3`)}</li>
          </ul>
        </div>

        <div className="space-y-5 animate-slide-up">

          {/* ── BAGIAN A: Keliling ── */}
          <Section title={t(`${p}.sectionA`)} color="#60a5fa">

            <Q no={1} badge={t(`${p}.badgeBangunL`)} badgeColor="#60a5fa" diagram={<DiagramQ1 />}>
              <p>
                {t(`${p}.q1pre`)}{" "}
                <span className="text-blue-300 font-semibold">{t(`${p}.q1bold`)}</span>{" "}
                {t(`${p}.q1end`)}
              </p>
            </Q>

            <Q no={2} badge={t(`${p}.badgeBertingkat`)} badgeColor="#60a5fa" diagram={<DiagramQ2 />}>
              <p>
                {t(`${p}.q2pre`)}{" "}
                <span className="text-blue-300 font-semibold">{t(`${p}.q2bold`)}</span>{" "}
                {t(`${p}.q2end`)}
              </p>
            </Q>

            <Q no={3} badge={t(`${p}.badgeKontekstual`)} badgeColor="#60a5fa">
              <p>
                {t(`${p}.q3pre`)} <InlineMath math="20 \text{ m}" />
                {t(`${p}.q3m1`)} <InlineMath math="30 \text{ m}" />
                {t(`${p}.q3m2`)} <InlineMath math="10 \text{ m}" />
                {t(`${p}.q3m3`)} <InlineMath math="15 \text{ m}" />
                {t(`${p}.q3end`)}
              </p>
            </Q>

            <Q no={4} badge={t(`${p}.badgeUNStyle`)} badgeColor="#60a5fa">
              <p>
                {t(`${p}.q4pre`)} <InlineMath math="18 \text{ m}" />
                {t(`${p}.q4m1`)} <InlineMath math="12 \text{ m}" />
                {t(`${p}.q4m2`)} <InlineMath math="6 \text{ m}" />
                {t(`${p}.q4m3`)} <InlineMath math="8 \text{ m}" />
                {t(`${p}.q4end`)}
              </p>
            </Q>

            <Q no={5} badge={t(`${p}.badgeGabungan`)} badgeColor="#60a5fa">
              <p>
                {t(`${p}.q5pre`)}{" "}
                <InlineMath math="16 \text{ cm} \times 10 \text{ cm}" />{" "}
                {t(`${p}.q5mid`)} <InlineMath math="6 \text{ cm}" />
                {t(`${p}.q5mid2`)} <InlineMath math="10 \text{ cm}" />
                {t(`${p}.q5end`)}
                <span className="block mt-1 text-white/50 text-xs">{t(`${p}.q5hint`)}</span>
              </p>
            </Q>
          </Section>

          {/* ── BAGIAN B: Luas ── */}
          <Section title={t(`${p}.sectionB`)} color="#4ade80">

            <Q no={6} badge={t(`${p}.badgeBangunRumah`)} badgeColor="#4ade80" diagram={<DiagramQ3 />}>
              <p>
                {t(`${p}.q6pre`)}{" "}
                <InlineMath math="21 \text{ cm} \times 14 \text{ cm}" />{" "}
                {t(`${p}.q6mid`)} <InlineMath math="21 \text{ cm}" />{" "}
                {t(`${p}.q6mid2`)} <InlineMath math="8 \text{ cm}" />
                {t(`${p}.q6end`)}
              </p>
            </Q>

            <Q no={7} badge={t(`${p}.badgeBangunPlus`)} badgeColor="#4ade80" diagram={<DiagramQ4 />}>
              <p>
                {t(`${p}.q7pre`)}{" "}
                <InlineMath math="6 \text{ cm} \times 6 \text{ cm}" />
                {t(`${p}.q7end`)}
              </p>
            </Q>

            <Q no={8} badge={t(`${p}.badgePengurangan`)} badgeColor="#4ade80">
              <p>
                {t(`${p}.q8pre`)} <InlineMath math="20 \text{ cm} \times 20 \text{ cm}" />
                {t(`${p}.q8mid`)}{" "}
                <InlineMath math="8 \text{ cm} \times 5 \text{ cm}" />{" "}
                {t(`${p}.q8end`)}
              </p>
            </Q>

            <Q no={9} badge={t(`${p}.badgeGrid`)} badgeColor="#4ade80" diagram={<DiagramQ5 />}>
              <p>
                {t(`${p}.q9pre`)}{" "}
                <InlineMath math="1 \text{ cm} \times 1 \text{ cm}" />
                {t(`${p}.q9end`)}
              </p>
            </Q>

            <Q no={10} badge={t(`${p}.badgePenyesuaian`)} badgeColor="#4ade80">
              <p>
                {t(`${p}.q10pre`)}{" "}
                <InlineMath math="12 \text{ m} \times 8 \text{ m}" />{" "}
                {t(`${p}.q10mid`)}{" "}
                <InlineMath math="6 \text{ m} \times 4 \text{ m}" />
                {t(`${p}.q10end`)}
              </p>
            </Q>
          </Section>

          {/* ── BAGIAN C: Aplikasi ── */}
          <Section title={t(`${p}.sectionC`)} color="#f87171">

            <Q no={11} badge={t(`${p}.badgeBiayaCat`)} badgeColor="#f87171">
              <p>
                {t(`${p}.q11pre`)}{" "}
                <InlineMath math="15 \text{ m} \times 8 \text{ m}" />
                {t(`${p}.q11mid`)}{" "}
                <InlineMath math="1{,}2 \text{ m} \times 1 \text{ m}" />{" "}
                {t(`${p}.q11mid2`)}{" "}
                <InlineMath math="2 \text{ m} \times 1{,}5 \text{ m}" />
                {t(`${p}.q11mid3`)}{" "}
                <InlineMath math="Rp\,45.000/\text{m}^2" />
                {t(`${p}.q11end`)}
              </p>
            </Q>

            <Q no={12} badge={t(`${p}.badgeANBK`)} badgeColor="#f87171">
              <p>
                {t(`${p}.q12pre`)}{" "}
                <InlineMath math="20 \text{ m} \times 6 \text{ m}" />{" "}
                {t(`${p}.q12mid`)}{" "}
                <InlineMath math="12 \text{ m} \times 8 \text{ m}" />
                {t(`${p}.q12mid2`)}{" "}
                <InlineMath math="60 \text{ cm} \times 60 \text{ cm}" />
                {t(`${p}.q12end`)}
              </p>
            </Q>

            <Q no={13} badge={t(`${p}.badgeTKA`)} badgeColor="#f87171">
              <p>
                {t(`${p}.q13pre`)}{" "}
                <InlineMath math="24 \text{ m} \times 16 \text{ m}" />
                {t(`${p}.q13mid`)}{" "}
                <InlineMath math="6 \text{ m}" />{" "}
                {t(`${p}.q13andWord`)}{" "}
                <InlineMath math="8 \text{ m}" />
                {t(`${p}.q13end`)}
              </p>
            </Q>

            <Q no={14} badge={t(`${p}.badgeUN2018`)} badgeColor="#f87171">
              <p>
                {t(`${p}.q14pre`)}{" "}
                <InlineMath math="40 \text{ m} \times 25 \text{ m}" />
                {t(`${p}.q14mid`)}{" "}
                <InlineMath math="2 \text{ m}" />{" "}
                {t(`${p}.q14end`)}
              </p>
            </Q>

            <Q no={15} badge={t(`${p}.badgeHOTS`)} badgeColor="#f87171">
              <p>{t(`${p}.q15intro`)}</p>
              <div className="bg-white/5 rounded-lg p-4 my-2 text-xs font-mono text-white/80 leading-loose">
                <span className="block">{t(`${p}.q15denahLine1`)}</span>
                <span className="block">{t(`${p}.q15denahLine2`)}</span>
              </div>
              <p>
                {t(`${p}.q15a`)}<br/>
                {t(`${p}.q15b`)}<br/>
                {t(`${p}.q15cpre`)} <InlineMath math="Rp\,180.000/\text{m}^2" /> {t(`${p}.q15cend`)}
              </p>
            </Q>
          </Section>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/segitiga-dan-segiempat"); }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            <ChevronLeft className="w-4 h-4" />
            {t(`${p}.back`)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KelilingLuasBangunTakBeraturanLatihanPage;
