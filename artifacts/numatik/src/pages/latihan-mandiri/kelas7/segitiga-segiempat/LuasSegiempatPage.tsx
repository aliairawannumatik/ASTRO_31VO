import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { InlineMath, BlockMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";

/* ─────────────── SVG DIAGRAMS ─────────────── */

const DiagramPersegi = () => (
  <svg viewBox="0 0 240 240" className="w-full max-w-xs mx-auto my-3" aria-label="Persegi sisi 15 cm">
    <rect x="30" y="30" width="180" height="180" fill="rgba(96,165,250,0.10)" stroke="#60a5fa" strokeWidth="2" />
    <polyline points="30,42 42,42 42,30"     fill="none" stroke="#60a5fa" strokeWidth="1.5" />
    <polyline points="196,42 196,30 208,30"  fill="none" stroke="#60a5fa" strokeWidth="1.5" />
    <polyline points="196,196 196,208 208,208" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
    <polyline points="30,196 42,196 42,208"   fill="none" stroke="#60a5fa" strokeWidth="1.5" />
    <text x="100" y="22"  fill="#ffffff" fontSize="13" fontFamily="monospace" textAnchor="middle">15 cm</text>
    <text x="100" y="230" fill="#ffffff" fontSize="13" fontFamily="monospace" textAnchor="middle">15 cm</text>
    <text x="16"  y="125" fill="#ffffff" fontSize="12" fontFamily="monospace" transform="rotate(-90 18 125)">15 cm</text>
  </svg>
);

const DiagramPersegipanjang = () => (
  <svg viewBox="0 0 360 210" className="w-full max-w-sm mx-auto my-3" aria-label="Persegi panjang 22 x 13">
    <rect x="20" y="30" width="300" height="140" fill="rgba(167,139,250,0.10)" stroke="#a78bfa" strokeWidth="2" />
    <text x="160" y="22"  fill="#ffffff" fontSize="13" fontFamily="monospace" textAnchor="middle">22 cm</text>
    <text x="160" y="195" fill="#ffffff" fontSize="13" fontFamily="monospace" textAnchor="middle">22 cm</text>
    <text x="8"   y="104" fill="#ffffff" fontSize="12" fontFamily="monospace" transform="rotate(-90 8 104)">13 cm</text>
  </svg>
);

const DiagramJajargenjang = () => (
  <svg viewBox="0 0 360 200" className="w-full max-w-sm mx-auto my-3" aria-label="Jajargenjang alas 24 tinggi 10">
    <polygon points="60,170 300,170 260,30 20,30" fill="rgba(74,222,128,0.10)" stroke="#4ade80" strokeWidth="2" />
    <line x1="60" y1="30" x2="60" y2="170" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,4" />
    <polyline points="60,158 72,158 72,170" fill="none" stroke="#facc15" strokeWidth="1.5" />
    <text x="160" y="192" fill="#ffffff" fontSize="13" fontFamily="monospace" textAnchor="middle">24 cm</text>
    <text x="74"  y="105" fill="#ffffff" fontSize="12" fontFamily="monospace">10 cm</text>
  </svg>
);

const DiagramTrapesium = () => (
  <svg viewBox="0 0 360 210" className="w-full max-w-sm mx-auto my-3" aria-label="Trapesium siku-siku">
    <polygon points="30,180 320,180 260,30 30,30" fill="rgba(251,146,60,0.10)" stroke="#fb923c" strokeWidth="2" />
    <polyline points="30,168 42,168 42,180" fill="none" stroke="#fb923c" strokeWidth="1.5" />
    <polyline points="30,42 42,42 42,30"   fill="none" stroke="#fb923c" strokeWidth="1.5" />
    <line x1="260" y1="30" x2="260" y2="180" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,4" />
    <polyline points="260,168 272,168 272,180" fill="none" stroke="#facc15" strokeWidth="1.5" />
    <text x="135" y="22"  fill="#ffffff" fontSize="12" fontFamily="monospace">a = 14 cm</text>
    <text x="155" y="198" fill="#ffffff" fontSize="12" fontFamily="monospace">b = 22 cm</text>
    <text x="14"  y="108" fill="#ffffff" fontSize="12" fontFamily="monospace" transform="rotate(-90 14 108)">12 cm</text>
    <text x="268" y="108" fill="#ffffff" fontSize="12" fontFamily="monospace">t</text>
  </svg>
);

const DiagramLayangLayang = () => (
  <svg viewBox="0 0 260 320" className="w-full max-w-xs mx-auto my-3" aria-label="Layang-layang d1=20 d2=30">
    <polygon points="130,20 30,130 130,300 230,130" fill="rgba(248,113,113,0.10)" stroke="#f87171" strokeWidth="2" />
    <line x1="30"  y1="130" x2="230" y2="130" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,4" />
    <line x1="130" y1="20"  x2="130" y2="300" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5,4" />
    <text x="118" y="14"  fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="12"  y="138" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="118" y="315" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="235" y="138" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="138" y="82"  fill="#ffffff" fontSize="12" fontFamily="monospace">20 cm</text>
    <text x="138" y="220" fill="#ffffff" fontSize="12" fontFamily="monospace">10 cm</text>
    <text x="50"  y="125" fill="#ffffff" fontSize="12" fontFamily="monospace">15 cm</text>
    <text x="158" y="125" fill="#ffffff" fontSize="12" fontFamily="monospace">15 cm</text>
  </svg>
);

const DiagramBelaKetupat = () => (
  <svg viewBox="0 0 280 280" className="w-full max-w-xs mx-auto my-3" aria-label="Belah ketupat d1=24 d2=18">
    <polygon points="140,20 260,140 140,260 20,140" fill="rgba(34,211,238,0.10)" stroke="#22d3ee" strokeWidth="2" />
    <line x1="20"  y1="140" x2="260" y2="140" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,4" />
    <line x1="140" y1="20"  x2="140" y2="260" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5,4" />
    <text x="128" y="14"  fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="262" y="146" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="128" y="276" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="4"   y="146" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="148" y="86"  fill="#ffffff" fontSize="12" fontFamily="monospace">d₂ = 24 cm</text>
    <text x="75"  y="135" fill="#ffffff" fontSize="12" fontFamily="monospace">d₁ = 18 cm</text>
  </svg>
);

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
const LuasSegiempatLatihanPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const p = "practice.segitigaSegiempat.luasSegiempat";

  // Pre-compute BlockMath Q15 text fragments to avoid nested template literals
  const q15l1 = t(`${p}.q15line1`);
  const q15l2 = t(`${p}.q15line2`);
  const q15l3 = t(`${p}.q15line3`);
  const q15l4 = t(`${p}.q15line4`);
  const q15h  = t(`${p}.q15tinggi`);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.4)" }}>
            <BookOpen className="w-7 h-7 text-violet-400" />
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

        {/* Formula summary box */}
        <div className="rounded-xl bg-violet-500/10 border border-violet-500/30 px-5 py-4 mb-6 text-sm font-body space-y-1">
          <p className="font-bold text-violet-300 mb-2">{t(`${p}.formulaTitle`)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white/80 text-xs">
            <span>{t(`${p}.formulaSquare`)} <InlineMath math="s^2" /></span>
            <span>{t(`${p}.formulaRect`)} <InlineMath math="p \times l" /></span>
            <span>{t(`${p}.formulaParallel`)} <InlineMath math="a \times t" /></span>
            <span>{t(`${p}.formulaTrap`)} <InlineMath math="\frac{1}{2}(a+b) \times t" /></span>
            <span>{t(`${p}.formulaKite`)} <InlineMath math="\frac{1}{2} \times d_1 \times d_2" /></span>
            <span>{t(`${p}.formulaRhombus`)} <InlineMath math="\frac{1}{2} \times d_1 \times d_2" /></span>
          </div>
        </div>

        <div className="space-y-5 animate-slide-up">

          {/* BAGIAN A */}
          <Section title={t(`${p}.sectionA`)} color="#60a5fa">

            <Q no={1} badge={t(`${p}.badgePersegi`)} badgeColor="#60a5fa" diagram={<DiagramPersegi />}>
              <p>{t(`${p}.q1pre`)} <InlineMath math="15 \text{ cm}" /> {t(`${p}.q1end`)}</p>
            </Q>

            <Q no={2} badge={t(`${p}.badgePersegiPanjang`)} badgeColor="#60a5fa" diagram={<DiagramPersegipanjang />}>
              <p>{t(`${p}.q2`)}</p>
            </Q>

            <Q no={3} badge={t(`${p}.badgeMencariSisi`)} badgeColor="#60a5fa">
              <p>
                {t(`${p}.q3pre`)} <InlineMath math="484 \text{ cm}^2" />{t(`${p}.q3end`)}
              </p>
            </Q>

            <Q no={4} badge={t(`${p}.badgeUNStyle`)} badgeColor="#60a5fa">
              <p>
                {t(`${p}.q4pre`)} <InlineMath math="8 \text{ m}" /> {t(`${p}.q4mid`)}{" "}
                <InlineMath math="6 \text{ m}" />{t(`${p}.q4mid2`)}{" "}
                <InlineMath math="40 \text{ cm} \times 40 \text{ cm}" />{t(`${p}.q4end`)}
              </p>
            </Q>

            <Q no={5} badge={t(`${p}.badgePerbandingan`)} badgeColor="#60a5fa">
              <p>
                {t(`${p}.q5pre`)} <InlineMath math="3" /> {t(`${p}.q5mid`)}{" "}
                <InlineMath math="147 \text{ cm}^2" />{t(`${p}.q5end`)}
              </p>
            </Q>
          </Section>

          {/* BAGIAN B */}
          <Section title={t(`${p}.sectionB`)} color="#4ade80">

            <Q no={6} badge={t(`${p}.badgeJajargenjang`)} badgeColor="#4ade80" diagram={<DiagramJajargenjang />}>
              <p>
                {t(`${p}.q6pre`)} <InlineMath math="24 \text{ cm}" /> {t(`${p}.q6mid`)}{" "}
                <InlineMath math="10 \text{ cm}" />{t(`${p}.q6end`)}
              </p>
            </Q>

            <Q no={7} badge={t(`${p}.badgeTrapesium`)} badgeColor="#4ade80" diagram={<DiagramTrapesium />}>
              <p>
                {t(`${p}.q7pre`)} <InlineMath math="14 \text{ cm}" /> {t(`${p}.q7andWord`)}{" "}
                <InlineMath math="22 \text{ cm}" />{t(`${p}.q7mid`)} <InlineMath math="12 \text{ cm}" />{t(`${p}.q7end`)}
              </p>
            </Q>

            <Q no={8} badge={t(`${p}.badgeBelahKetupat`)} badgeColor="#4ade80" diagram={<DiagramBelaKetupat />}>
              <p>
                {t(`${p}.q8pre`)} <InlineMath math="ABCD" /> {t(`${p}.q8mid`)} <InlineMath math="d_1 = 18 \text{ cm}" />{" "}
                {t(`${p}.q8andWord`)} <InlineMath math="d_2 = 24 \text{ cm}" />{t(`${p}.q8end`)}
              </p>
            </Q>

            <Q no={9} badge={t(`${p}.badgeLayangLayang`)} badgeColor="#4ade80" diagram={<DiagramLayangLayang />}>
              <p>
                {t(`${p}.q9pre`)} <InlineMath math="ABCD" /> {t(`${p}.q9mid`)} <InlineMath math="AC = 30 \text{ cm}" />{" "}
                {t(`${p}.q9andWord`)} <InlineMath math="BD = 30 \text{ cm}" />{t(`${p}.q9end`)}
              </p>
            </Q>

            <Q no={10} badge={t(`${p}.badgeMencariDiagonal`)} badgeColor="#4ade80">
              <p>
                {t(`${p}.q10pre`)} <InlineMath math="240 \text{ cm}^2" />{t(`${p}.q10mid`)}{" "}
                <InlineMath math="20 \text{ cm}" />{t(`${p}.q10end`)}
              </p>
            </Q>
          </Section>

          {/* BAGIAN C */}
          <Section title={t(`${p}.sectionC`)} color="#fb923c">

            <Q no={11} badge={t(`${p}.badgeKontekstual`)} badgeColor="#fb923c">
              <p>
                {t(`${p}.q11pre`)} <InlineMath math="30 \text{ m}" /> {t(`${p}.q11andWord`)}{" "}
                <InlineMath math="50 \text{ m}" />{t(`${p}.q11mid`)} <InlineMath math="20 \text{ m}" />{t(`${p}.q11mid2`)}{" "}
                <InlineMath math="Rp\,25.000" /> {t(`${p}.q11per`)}{" "}
                <InlineMath math="\text{m}^2" />{t(`${p}.q11end`)}
              </p>
            </Q>

            <Q no={12} badge={t(`${p}.badgeANBK`)} badgeColor="#fb923c">
              <p>
                {t(`${p}.q12pre`)} <InlineMath math="600 \text{ m}^2" /> {t(`${p}.q12mid`)}{" "}
                <InlineMath math="30 \text{ m}" />{t(`${p}.q12mid2`)}{" "}
                <InlineMath math="Rp\,50.000" /> {t(`${p}.q12end`)}
              </p>
            </Q>

            <Q no={13} badge={t(`${p}.badgeTKA`)} badgeColor="#fb923c">
              <p>
                {t(`${p}.q13pre`)} <InlineMath math="52 \text{ cm}" />{t(`${p}.q13mid`)} <InlineMath math="4:9" />{" "}
                {t(`${p}.q13mid2`)} <InlineMath math="24 \text{ cm}" />{t(`${p}.q13end`)}
              </p>
            </Q>

            <Q no={14} badge={t(`${p}.badgeGabungan`)} badgeColor="#fb923c">
              <p>
                {t(`${p}.q14pre`)}{" "}
                <InlineMath math="12 \text{ cm} \times 8 \text{ cm}" /> {t(`${p}.q14mid`)}{" "}
                <InlineMath math="4 \text{ cm} \times 4 \text{ cm}" />{t(`${p}.q14end`)}
              </p>
            </Q>

            <Q no={15} badge={t(`${p}.badgeUNStyle`)} badgeColor="#fb923c">
              <p>{t(`${p}.q15intro`)}</p>
              <BlockMath math={`\\begin{array}{l}
(1)\\text{ ${q15l1} }12\\text{ cm} \\Rightarrow L = 144\\text{ cm}^2\\\\
(2)\\text{ ${q15l2} }15\\text{ cm}\\times 7\\text{ cm} \\Rightarrow L = 115\\text{ cm}^2\\\\
(3)\\text{ ${q15l3} }18\\text{ cm,\\ }\\text{${q15h}\\ }9\\text{ cm} \\Rightarrow L = 162\\text{ cm}^2\\\\
(4)\\text{ ${q15l4} }10{,}16\\text{ cm,\\ }\\text{${q15h}\\ }8\\text{ cm} \\Rightarrow L = 104\\text{ cm}^2
\\end{array}`} />
              <p className="mt-2">
                {t(`${p}.q15pre`)} <span className="text-green-400 font-bold">{t(`${p}.q15correctWord`)}</span> {t(`${p}.q15end`)}
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

export default LuasSegiempatLatihanPage;
