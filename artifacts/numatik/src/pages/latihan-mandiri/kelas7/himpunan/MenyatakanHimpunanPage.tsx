import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { InlineMath, BlockMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";

/* ─── REUSABLE ─── */
type SectionProps = { title: string; color: string; children: React.ReactNode };
const Section = ({ title, color, children }: SectionProps) => (
  <div className="rounded-xl border p-5 space-y-6" style={{ borderColor: color + "55", background: color + "0a" }}>
    <h3 className="font-display font-bold text-sm uppercase tracking-widest" style={{ color }}>{title}</h3>
    {children}
  </div>
);

type QProps = { no: number; children: React.ReactNode; badge?: string; badgeColor?: string };
const Q = ({ no, children, badge, badgeColor = "#a78bfa" }: QProps) => (
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
      <div className="text-white/90 text-sm leading-relaxed font-body">{children}</div>
    </div>
  </div>
);

/* ─── SVG: empty set symbol diagram ─── */
const EmptySetDiagram = () => (
  <svg viewBox="0 0 260 120" className="w-full max-w-xs mx-auto my-3" aria-label="Himpunan kosong">
    <rect x="10" y="15" width="110" height="90" rx="12" fill="rgba(96,165,250,0.10)" stroke="#60a5fa" strokeWidth="1.5" />
    <text x="65" y="70" fill="#60a5fa" fontSize="28" fontFamily="monospace" textAnchor="middle">∅</text>
    <text x="65" y="105" fill="#e2e8f0" fontSize="11" fontFamily="monospace" textAnchor="middle">Himpunan Kosong</text>
    <rect x="140" y="15" width="110" height="90" rx="12" fill="rgba(74,222,128,0.10)" stroke="#4ade80" strokeWidth="1.5" />
    <text x="195" y="55" fill="#4ade80" fontSize="11" fontFamily="monospace" textAnchor="middle">S = {"{bilangan"}</text>
    <text x="195" y="72" fill="#4ade80" fontSize="11" fontFamily="monospace" textAnchor="middle">asli ≤ 10{"}"}</text>
    <text x="195" y="105" fill="#e2e8f0" fontSize="11" fontFamily="monospace" textAnchor="middle">Himpunan Semesta</text>
  </svg>
);

/* ─── PAGE ─── */
const MenyatakanHimpunanLatihanPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const p = "practice.himpunan.menyatakanHimpunan";

  /* \text{} interpolation vars — computed once, used inside InlineMath template literals */
  const q2textA       = t(`${p}.q2.textA`);
  const q2textB       = t(`${p}.q2.textB`);
  const q2textC       = t(`${p}.q2.textC`);
  const q5days        = t(`${p}.q5.days`);
  const q6textA       = t(`${p}.q6.textA`);
  const q6textD       = t(`${p}.q6.textD`);
  const q7colors      = t(`${p}.q7.itemBColors`);
  const q7animals     = t(`${p}.q7.itemCAnimals`);
  const q12textA      = t(`${p}.q12.textA`);
  const q12textB      = t(`${p}.q12.textB`);
  const q15textBulat  = t(`${p}.q15.textBulat`);
  const q15textGanjil = t(`${p}.q15.textGanjilGenap`);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* ── header ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.4)" }}>
            <BookOpen className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1">
            {t(`${p}.title`)}
          </h1>
          <p className="text-white/50 text-xs font-body">{t(`${p}.grade`)} · {t('practice.breadcrumb')} · {t(`${p}.topicName`)}</p>
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            {["UN", "TKA", "ANBK"].map(tag => (
              <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400/15 text-yellow-300 border border-yellow-400/30">{tag}</span>
            ))}
          </div>
        </div>

        {/* ── tip box ── */}
        <div className="rounded-xl bg-violet-500/10 border border-violet-500/30 px-5 py-4 mb-6 text-sm text-white/80 font-body">
          <p className="font-bold text-violet-300 mb-2">{t(`${p}.tipTitle`)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-white/70">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="font-semibold text-violet-200 mb-1">{t(`${p}.tipM1`)}</p>
              <InlineMath math="A = \{1, 2, 3, 4, 5\}" />
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="font-semibold text-violet-200 mb-1">{t(`${p}.tipM2`)}</p>
              <InlineMath math="A = \{x \mid 1 \leq x \leq 5\}" />
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="font-semibold text-violet-200 mb-1">{t(`${p}.tipM3`)}</p>
              <p>{t(`${p}.tipM3Desc`)}</p>
            </div>
          </div>
          <div className="mt-3 flex gap-4 text-xs text-white/70">
            <span>
              <InlineMath math="\emptyset" /> {t(`${p}.tipOr`)} <InlineMath math="\{\}" /> {t(`${p}.tipEmpty`)}
            </span>
          </div>
        </div>

        <EmptySetDiagram />

        <div className="space-y-5 animate-slide-up">
          {/* ══ BAGIAN A ══ */}
          <Section title={t(`${p}.sectionA`)} color="#a78bfa">

            {/* Q1 */}
            <Q no={1} badge={t(`${p}.q1.badge`)} badgeColor="#a78bfa">
              <p>
                {t(`${p}.q1.introPre`)} <InlineMath math="A" /> {t(`${p}.q1.introMid`)} <InlineMath math="-3" /> {t(`${p}.q1.introMid2`)} <InlineMath math="4" />{" "}
                {t(`${p}.q1.introMid3`)} <strong className="text-violet-300">{t(`${p}.q1.bold`)}</strong> {t(`${p}.q1.introEnd`)}
              </p>
            </Q>

            {/* Q2 */}
            <Q no={2} badge={t(`${p}.q2.badge`)} badgeColor="#a78bfa">
              <p>
                {t(`${p}.q2.instrPre`)} <strong className="text-violet-300">{t(`${p}.q2.bold`)}</strong>{t(`${p}.q2.instrEnd`)}
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math={`P = \\{x \\mid x \\text{ ${q2textA}}\\}`} /></li>
                <li>(b) <InlineMath math={`Q = \\{x \\mid x \\text{ ${q2textB}},\\, x \\leq 50\\}`} /></li>
                <li>(c) <InlineMath math={`R = \\{x \\mid x \\text{ ${q2textC}},\\, 6 \\leq x \\leq 36\\}`} /></li>
              </ul>
            </Q>

            {/* Q3 */}
            <Q no={3} badge={t(`${p}.q3.badge`)} badgeColor="#a78bfa">
              <p>
                {t(`${p}.q3.instrPre`)} <strong className="text-violet-300">{t(`${p}.q3.bold`)}</strong>{t(`${p}.q3.instrEnd`)}
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="A = \{5, 10, 15, 20, 25\}" /></li>
                <li>(b) <InlineMath math="B = \{1, 4, 9, 16, 25, 36, 49\}" /></li>
                <li>(c) <InlineMath math="C = \{2, 3, 5, 7, 11, 13\}" /></li>
              </ul>
            </Q>

            {/* Q4 — BlockMath TIDAK disentuh */}
            <Q no={4} badge={t(`${p}.q4.badge`)} badgeColor="#a78bfa">
              <p>
                {t(`${p}.q4.instrPre`)} <InlineMath math="K = \{x \mid 2 \leq x \leq 8,\; x \in \mathbb{Z}\}" />.{" "}
                {t(`${p}.q4.instrMid`)} <strong className="text-green-300">{t(`${p}.q4.bold`)}</strong> {t(`${p}.q4.instrEnd`)}
              </p>
              <BlockMath math={`\\begin{array}{ll}
(A)\\; n(K) = 6 & (B)\\; n(K) = 7 \\\\
(C)\\; 2 \\notin K & (D)\\; 9 \\in K
\\end{array}`} />
            </Q>

            {/* Q5 */}
            <Q no={5} badge={t(`${p}.q5.badge`)} badgeColor="#a78bfa">
              <p>
                {t(`${p}.q5.instrPre`)} <InlineMath math={`S = \\{${q5days}\\}`} /> {t(`${p}.q5.instrMid`)} <InlineMath math="n(S)" />{t(`${p}.q5.instrEnd`)}
              </p>
            </Q>
          </Section>

          {/* ══ BAGIAN B ══ */}
          <Section title={t(`${p}.sectionB`)} color="#4ade80">

            {/* Q6 */}
            <Q no={6} badge={t(`${p}.q6.badge`)} badgeColor="#4ade80">
              <p>
                {t(`${p}.q6.instrPre`)} <strong className="text-green-300">{t(`${p}.q6.bold`)}</strong>{t(`${p}.q6.instrEnd`)}
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math={`A = \\{x \\mid x \\text{ ${q6textA}}\\}`} /></li>
                <li>(b) <InlineMath math="B = \{x \mid x^2 = -4,\; x \in \mathbb{R}\}" /></li>
                <li>(c) <InlineMath math="C = \{x \mid x + 5 = 5,\; x \in \mathbb{Z}\}" /></li>
                <li>(d) <InlineMath math={`D = \\{x \\mid x \\text{ ${q6textD}}\\}`} /></li>
              </ul>
            </Q>

            {/* Q7 */}
            <Q no={7} badge={t(`${p}.q7.badge`)} badgeColor="#4ade80">
              <p>{t(`${p}.q7.instruction`)}</p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="A = \{2, 4, 6, 8, 10\}" /></li>
                <li>(b) <InlineMath math={`B = \\{${q7colors}\\}`} /></li>
                <li>(c) <InlineMath math={`C = \\{${q7animals}\\}`} /></li>
              </ul>
            </Q>

            {/* Q8 */}
            <Q no={8} badge={t(`${p}.q8.badge`)} badgeColor="#4ade80">
              <p>
                {t(`${p}.q8.instrPre`)} <InlineMath math="S = \{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}" />{" "}
                {t(`${p}.q8.instrMid`)} <InlineMath math="A = \{1, 3, 5, 7, 9\}" />.{" "}
                {t(`${p}.q8.instrMid2`)} <InlineMath math="A" /> {t(`${p}.q8.instrMid3`)} <InlineMath math="S" />{t(`${p}.q8.instrEnd`)}
              </p>
            </Q>

            {/* Q9 */}
            <Q no={9} badge={t(`${p}.q9.badge`)} badgeColor="#4ade80">
              <p>
                {t(`${p}.q9.instrPre`)} <strong className="text-green-300">{t(`${p}.q9.boldA`)}</strong> {t(`${p}.q9.instrMid`)} <strong className="text-red-400">{t(`${p}.q9.boldB`)}</strong>{t(`${p}.q9.instrEnd`)}
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) {t(`${p}.q9.itemAPre`)} <InlineMath math="\emptyset = \{0\}" /></li>
                <li>(b) <InlineMath math="n(\emptyset) = 0" /></li>
                <li>(c) {t(`${p}.q9.itemC`)}</li>
                <li>(d) <InlineMath math="\{0\}" /> {t(`${p}.q9.itemDPost`)}</li>
              </ul>
            </Q>

            {/* Q10 */}
            <Q no={10} badge={t(`${p}.q10.badge`)} badgeColor="#4ade80">
              <p>
                {t(`${p}.q10.pre`)} <InlineMath math="S = \{x \mid x \leq 15,\; x \in \mathbb{N}\}" />{t(`${p}.q10.diketahui`)} <InlineMath math="A" /> {t(`${p}.q10.aDef`)}{" "}
                {t(`${p}.q10.dan`)} <InlineMath math="B" /> {t(`${p}.q10.bDef`)}
              </p>
              <p className="mt-1">
                {t(`${p}.q10.post`)} (a) <InlineMath math="A" />,&nbsp;
                (b) <InlineMath math="B" />,&nbsp;
                (c) <InlineMath math="A^c" /> ({t(`${p}.q10.komplemen`)} <InlineMath math="A" />),&nbsp;
                (d) <InlineMath math="n(A^c)" />
              </p>
            </Q>
          </Section>

          {/* ══ BAGIAN C ══ */}
          <Section title={t(`${p}.sectionC`)} color="#fb923c">

            {/* Q11 */}
            <Q no={11} badge={t(`${p}.q11.badge`)} badgeColor="#fb923c">
              <p>{t(`${p}.q11.instruction`)}</p>
            </Q>

            {/* Q12 — \text{} interpolation: q12textA, q12textB */}
            <Q no={12} badge={t(`${p}.q12.badge`)} badgeColor="#fb923c">
              <p>
                {t(`${p}.q12.diketahui`)} <InlineMath math="S = \{1, 2, 3, \ldots, 12\}" />,{" "}
                <InlineMath math={`\\; A = \\{x \\mid x \\text{ ${q12textA}}\\}`} />,{" "}
                <InlineMath math={`\\; B = \\{x \\mid x \\text{ ${q12textB}}\\}`} />.{" "}
                {t(`${p}.q12.tentukan`)} (a) <InlineMath math="A" />, (b) <InlineMath math="B" />, (c) <InlineMath math="A^c" />
              </p>
            </Q>

            {/* Q13 */}
            <Q no={13} badge={t(`${p}.q13.badge`)} badgeColor="#fb923c">
              <p>
                {t(`${p}.q13.introPre`)} <InlineMath math="P = \{a, b, c, d\}" /> {t(`${p}.q13.dan`)} <InlineMath math="Q = \{1, 2, 3, 4\}" />.{" "}
                {t(`${p}.q13.instrMid`)} <InlineMath math="P" /> {t(`${p}.q13.dan`)} <InlineMath math="Q" /> {t(`${p}.q13.instrEnd`)}
              </p>
            </Q>

            {/* Q14 */}
            <Q no={14} badge={t(`${p}.q14.badge`)} badgeColor="#fb923c">
              <p>{t(`${p}.q14.instruction`)}</p>
            </Q>

            {/* Q15 — \text{} interpolation: q15textBulat, q15textGanjil */}
            <Q no={15} badge={t(`${p}.q15.badge`)} badgeColor="#fb923c">
              <p>
                {t(`${p}.q15.instrPre`)} <InlineMath math={`S = \\{x \\mid x \\text{ ${q15textBulat}}, -5 \\leq x \\leq 5\\}`} />.{" "}
                {t(`${p}.q15.instrMid`)}
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="A = \{x \mid x^2 = 4\}" /></li>
                <li>(b) <InlineMath math="B = \{x \mid x < -5\}" /></li>
                <li>(c) <InlineMath math={`C = \\{x \\mid x \\text{ ${q15textGanjil}}\\}`} /></li>
                <li>(d) <InlineMath math="D = \{x \mid |x| \leq 2\}" /></li>
              </ul>
            </Q>
          </Section>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/himpunan"); }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            <ChevronLeft className="w-4 h-4" />
            {t(`${p}.backBtn`)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenyatakanHimpunanLatihanPage;
