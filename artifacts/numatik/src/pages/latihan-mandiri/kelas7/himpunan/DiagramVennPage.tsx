import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { InlineMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";

/* ─── SVG DIAGRAMS ─── */

/* Two-set Venn diagram */
const VennDua = ({ labelA = "A", labelB = "B", colorA = "#60a5fa", colorB = "#a78bfa",
  itemsLeft = ["2","4"], itemsMiddle = ["6"], itemsRight = ["8","10"],
  sLabel = "S" }) => (
  <svg viewBox="0 0 380 220" className="w-full max-w-sm mx-auto my-3" aria-label="Diagram Venn dua himpunan">
    <rect x="5" y="5" width="370" height="210" rx="10" fill="none" stroke="#ffffff30" strokeWidth="1.5" />
    <text x="14" y="24" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">{sLabel}</text>
    <ellipse cx="145" cy="110" rx="100" ry="75" fill={colorA + "20"} stroke={colorA} strokeWidth="2" />
    <ellipse cx="235" cy="110" rx="100" ry="75" fill={colorB + "20"} stroke={colorB} strokeWidth="2" />
    <text x="90"  y="40" fill={colorA} fontSize="14" fontFamily="monospace" fontWeight="bold">{labelA}</text>
    <text x="280" y="40" fill={colorB} fontSize="14" fontFamily="monospace" fontWeight="bold">{labelB}</text>
    {itemsLeft.map((v, i) => <text key={i} x="88" y={95 + i * 20} fill="#e2e8f0" fontSize="13" fontFamily="monospace" textAnchor="middle">{v}</text>)}
    {itemsMiddle.map((v, i) => <text key={i} x="190" y={103 + i * 20} fill="#facc15" fontSize="13" fontFamily="monospace" textAnchor="middle">{v}</text>)}
    {itemsRight.map((v, i) => <text key={i} x="290" y={95 + i * 20} fill="#e2e8f0" fontSize="13" fontFamily="monospace" textAnchor="middle">{v}</text>)}
  </svg>
);

/* Three-set Venn diagram */
const VennTiga = () => (
  <svg viewBox="0 0 380 270" className="w-full max-w-sm mx-auto my-3" aria-label="Diagram Venn tiga himpunan">
    <rect x="5" y="5" width="370" height="260" rx="10" fill="none" stroke="#ffffff30" strokeWidth="1.5" />
    <text x="14" y="24" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">S</text>
    <ellipse cx="155" cy="105" rx="95" ry="70" fill="rgba(96,165,250,0.15)" stroke="#60a5fa" strokeWidth="2" />
    <ellipse cx="225" cy="105" rx="95" ry="70" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="2" />
    <ellipse cx="190" cy="175" rx="95" ry="70" fill="rgba(74,222,128,0.15)" stroke="#4ade80" strokeWidth="2" />
    <text x="110" y="65"  fill="#60a5fa"  fontSize="14" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="270" y="65"  fill="#a78bfa"  fontSize="14" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="190" y="260" fill="#4ade80"  fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">C</text>
    {/* region labels — SVG text intentionally kept as hardcoded Indonesian per project rules */}
    <text x="115" y="105"  fill="#e2e8f0" fontSize="12" fontFamily="monospace" textAnchor="middle">hanya A</text>
    <text x="268" y="105"  fill="#e2e8f0" fontSize="12" fontFamily="monospace" textAnchor="middle">hanya B</text>
    <text x="190" y="235"  fill="#e2e8f0" fontSize="12" fontFamily="monospace" textAnchor="middle">hanya C</text>
    <text x="190" y="95"   fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle">A∩B</text>
    <text x="148" y="165"  fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle">A∩C</text>
    <text x="232" y="165"  fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle">B∩C</text>
    <text x="190" y="138"  fill="#f87171" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">A∩B∩C</text>
  </svg>
);

/* Venn for survey problem */
const VennSurvei = () => (
  <svg viewBox="0 0 380 200" className="w-full max-w-sm mx-auto my-3" aria-label="Diagram Venn survei">
    <rect x="5" y="5" width="370" height="190" rx="10" fill="none" stroke="#ffffff30" strokeWidth="1.5" />
    <text x="14" y="22" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">S (40 siswa)</text>
    <ellipse cx="145" cy="100" rx="100" ry="68" fill="rgba(251,146,60,0.15)" stroke="#fb923c" strokeWidth="2" />
    <ellipse cx="235" cy="100" rx="100" ry="68" fill="rgba(248,113,113,0.15)" stroke="#f87171" strokeWidth="2" />
    <text x="80"  y="35" fill="#fb923c" fontSize="13" fontFamily="monospace" fontWeight="bold">Mtk</text>
    <text x="270" y="35" fill="#f87171" fontSize="13" fontFamily="monospace" fontWeight="bold">IPA</text>
    <text x="82"  y="105" fill="#facc15" fontSize="14" fontFamily="monospace" textAnchor="middle">?</text>
    <text x="190" y="105" fill="#facc15" fontSize="14" fontFamily="monospace" textAnchor="middle">8</text>
    <text x="298" y="105" fill="#facc15" fontSize="14" fontFamily="monospace" textAnchor="middle">?</text>
    <text x="340" y="160" fill="#e2e8f0" fontSize="12" fontFamily="monospace" textAnchor="middle">5</text>
  </svg>
);

/* ─── REUSABLE ─── */
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

/* ─── PAGE ─── */
const DiagramVennLatihanPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const p = "practice.himpunan.diagramVenn";

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.4)" }}>
            <BookOpen className="w-7 h-7 text-green-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1">
            {t(`${p}.title`)}
          </h1>
          <p className="text-white/50 text-xs font-body">Kelas 7 · {t('practice.breadcrumb')} · {t(`${p}.topic`)}</p>
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            {["UN", "TKA", "ANBK"].map(tag => (
              <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400/15 text-yellow-300 border border-yellow-400/30">{tag}</span>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-green-500/10 border border-green-500/30 px-5 py-4 mb-4 text-sm text-white/80 font-body">
          <p className="font-bold text-green-300 mb-2">{t(`${p}.tipTitle`)}</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
            <span>• {t(`${p}.tipItem1`)}</span>
            <span>• {t(`${p}.tipItem2`)}</span>
            <span>• {t(`${p}.tipIrisan`)}<InlineMath math="A \cap B" /></span>
            <span>• {t(`${p}.tipLuar`)}{' '}<InlineMath math="A \cup B" /></span>
          </div>
        </div>

        <div className="space-y-5 animate-slide-up">
          <Section title={t(`${p}.sectionA`)} color="#60a5fa">

            <Q no={1} badge={t(`${p}.q1.badge`)} badgeColor="#60a5fa">
              <p>
                {t(`${p}.q1.pre`)}<br/>
                <InlineMath math="S = \{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}" />,<br/>
                <InlineMath math="A = \{1, 2, 3, 4, 5\}" />,<br/>
                <InlineMath math="B = \{3, 4, 5, 6, 7\}" /><br/>
                {t(`${p}.q1.lalu`)}
                (a) <InlineMath math="A \cap B" />,&nbsp;
                (b) <InlineMath math="A \cup B" />,&nbsp;
                (c) <InlineMath math="A - B" />,&nbsp;
                (d) <InlineMath math="B - A" />,&nbsp;
                (e) <InlineMath math="A^c" />,&nbsp;
                (f) <InlineMath math="B^c" />!
              </p>
            </Q>

            <Q no={2} badge={t(`${p}.q2.badge`)} badgeColor="#60a5fa"
              diagram={<VennDua labelA="A" labelB="B" colorA="#60a5fa" colorB="#a78bfa"
                itemsLeft={["2","4","8"]} itemsMiddle={["6","12"]} itemsRight={["3","9","15"]} sLabel="S" />}>
              <p>
                {t(`${p}.q2.pre`)}
                (a) <InlineMath math="A" />,&nbsp;
                (b) <InlineMath math="B" />,&nbsp;
                (c) <InlineMath math="A \cap B" />,&nbsp;
                (d) <InlineMath math="A \cup B" />,&nbsp;
                (e) <InlineMath math="A - B" />,&nbsp;
                (f) <InlineMath math="B - A" />,&nbsp;
                (g) {t(`${p}.q2.itemG`)}
              </p>
            </Q>

            <Q no={3} badge={t(`${p}.q3.badge`)} badgeColor="#60a5fa">
              <p>
                {t(`${p}.q3.diketahui`)}{' '}<InlineMath math="S = \{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}" />,
                <InlineMath math="\; A = \{2, 4, 6, 8, 10\}" />,
                <InlineMath math="\; B = \{1, 2, 3, 4, 5\}" />.{' '}
                {t(`${p}.q3.post`)}{' '}<InlineMath math="A^c" />!
              </p>
            </Q>

            <Q no={4} badge={t(`${p}.q4.badge`)} badgeColor="#60a5fa">
              <p>
                {t(`${p}.q4.pre`)}{' '}<InlineMath math="n(S) = 30" />, <InlineMath math="n(A) = 18" />,
                <InlineMath math="\; n(B) = 14" />, <InlineMath math="\; n(A \cap B) = 6" />.{' '}
                {t(`${p}.q4.tentukan`)}
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="n(A \cup B)" /></li>
                <li>(b) {t(`${p}.q4.itemBPre`)}<InlineMath math="A" />{t(`${p}.q4.itemBPost`)}</li>
                <li>(c) {t(`${p}.q4.itemBPre`)}<InlineMath math="B" />{t(`${p}.q4.itemBPost`)}</li>
                <li>(d) {t(`${p}.q4.itemDPre`)}<InlineMath math="A" />{t(`${p}.q4.itemDMid`)}<InlineMath math="B" />{t(`${p}.q4.itemDPost`)}</li>
              </ul>
            </Q>

            {/* Q5 — restored: soal Menentukan anggota operasi himpunan dari deskripsi */}
            <Q no={5} badge={t(`${p}.q5.badge`)} badgeColor="#60a5fa">
              <p>
                {t(`${p}.q5.pre`)}{' '}<InlineMath math="S = \{1, 2, 3, \ldots, 20\}" />,{' '}
                <InlineMath math="A" />{' '}{t(`${p}.q5.setA`)},{' '}
                <InlineMath math="B" />{' '}{t(`${p}.q5.setB`)}.{' '}
                {t(`${p}.q5.tentukan`)}
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="A \cap B" /></li>
                <li>(b) <InlineMath math="A \cup B" /></li>
                <li>(c) <InlineMath math="A - B" /></li>
                <li>(d) {t(`${p}.q5.itemD`)}{' '}<InlineMath math="A \cup B" /></li>
              </ul>
            </Q>
          </Section>

          <Section title={t(`${p}.sectionB`)} color="#4ade80">

            <Q no={6} badge={t(`${p}.q6.badge`)} badgeColor="#4ade80" diagram={<VennSurvei />}>
              <p>
                <Trans i18nKey={`${p}.q6.instruction`} components={{ strong: <strong className="text-green-300" /> }} />
              </p>
            </Q>

            <Q no={7} badge={t(`${p}.q7.badge`)} badgeColor="#4ade80">
              <p>
                {t(`${p}.q7.pre`)}<br/>
                (a) {t(`${p}.q7.subA`)}<br/>
                (b) {t(`${p}.q7.subB`)}
              </p>
            </Q>

            <Q no={8} badge={t(`${p}.q8.badge`)} badgeColor="#4ade80">
              <p>{t(`${p}.q8.data`)}</p>
              <p className="mt-1">
                {t(`${p}.q8.tentukan`)}
                (a) {t(`${p}.q8.itemA`)}, (b) {t(`${p}.q8.itemB`)}, (c) {t(`${p}.q8.itemC`)}
              </p>
            </Q>

            <Q no={9} badge={t(`${p}.q9.badge`)} badgeColor="#4ade80">
              <p>
                {t(`${p}.q9.pre`)}{' '}<InlineMath math="n(A \cup B) = 35" />,
                <InlineMath math="\; n(A) = 20" />, <InlineMath math="\; n(A \cap B) = 7" />.{' '}
                {t(`${p}.q9.post`)}{' '}<InlineMath math="n(B)" />!
              </p>
            </Q>

            <Q no={10} badge={t(`${p}.q10.badge`)} badgeColor="#4ade80">
              <p>{t(`${p}.q10.instruction`)}</p>
            </Q>
          </Section>

          <Section title={t(`${p}.sectionC`)} color="#fb923c">

            <Q no={11} badge={t(`${p}.q11.badge`)} badgeColor="#fb923c">
              <p>
                {t(`${p}.q11.pre`)}<br/>
                (a) {t(`${p}.q11.subA`)}<br/>
                (b) {t(`${p}.q11.subB`)}
              </p>
            </Q>

            <Q no={12} badge={t(`${p}.q12.badge`)} badgeColor="#fb923c">
              <p>
                <Trans i18nKey={`${p}.q12.instruction`} components={{ strong: <strong className="text-orange-300" /> }} />
              </p>
            </Q>

            <Q no={13} badge={t(`${p}.q13.badge`)} badgeColor="#fb923c">
              <p>
                {t(`${p}.q13.pre`)}{' '}<InlineMath math="n(S) = 50" />, <InlineMath math="n(A \cup B) = 42" />,
                <InlineMath math="\; n(A) = 2 \cdot n(B)" />,{' '}{t(`${p}.q13.dan`)}{' '}<InlineMath math="\; n(A \cap B) = 8" />.{' '}
                {t(`${p}.q13.post`)}{' '}<InlineMath math="n(A)" />{' '}{t(`${p}.q13.dan`)}{' '}<InlineMath math="n(B)" />!
              </p>
            </Q>

            <Q no={14} badge={t(`${p}.q14.badge`)} badgeColor="#fb923c">
              <p>
                {t(`${p}.q14.pre`)}{' '}<InlineMath math="x" />{' '}{t(`${p}.q14.mid`)}{' '}<InlineMath math="x" />{t(`${p}.q14.end`)}
              </p>
            </Q>

            <Q no={15} badge={t(`${p}.q15.badge`)} badgeColor="#fb923c">
              <p>{t(`${p}.q15.intro`)}</p>
              <ul className="list-none mt-1 space-y-0.5 text-white/75 text-xs">
                <li>• {t(`${p}.q15.b1`)}</li>
                <li>• {t(`${p}.q15.b2`)}</li>
                <li>• {t(`${p}.q15.b3`)}</li>
                <li>• {t(`${p}.q15.b4`)}</li>
                <li>• {t(`${p}.q15.b5`)}</li>
                <li>• {t(`${p}.q15.b6`)}</li>
                <li>• {t(`${p}.q15.b7`)}</li>
              </ul>
              <p className="mt-2">
                (a) {t(`${p}.q15.subA`)}<br/>
                (b) {t(`${p}.q15.subB`)}
              </p>
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

export default DiagramVennLatihanPage;
