import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { InlineMath, BlockMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";

/* ─── REUSABLE COMPONENTS ─── */
type SectionProps = { title: string; color: string; children: React.ReactNode };
const Section = ({ title, color, children }: SectionProps) => (
  <div className="rounded-xl border p-5 space-y-6" style={{ borderColor: color + "55", background: color + "0a" }}>
    <h3 className="font-display font-bold text-sm uppercase tracking-widest" style={{ color }}>{title}</h3>
    {children}
  </div>
);

type QProps = { no: number; children: React.ReactNode; badge?: string; badgeColor?: string };
const Q = ({ no, children, badge, badgeColor = "#60a5fa" }: QProps) => (
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

/* ─── PAGE ─── */
const PengertianKeanggotaanLatihanPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const p = "practice.himpunan.pengertianKeanggotaan";

  const q5desc = t(`${p}.q5.textDesc`);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.4)" }}>
            <BookOpen className="w-7 h-7 text-blue-400" />
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

        <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 px-5 py-4 mb-6 text-sm text-white/80 font-body leading-relaxed">
          <p className="font-bold text-blue-300 mb-1">{t(`${p}.notasiTitle`)}</p>
          <ul className="text-xs text-white/70 space-y-1">
            <li><InlineMath math="a \in A" /> → {t(`${p}.notasi1`)}</li>
            <li><InlineMath math="a \notin A" /> → {t(`${p}.notasi2`)}</li>
            <li><InlineMath math="n(A)" /> → {t(`${p}.notasi3`)}</li>
          </ul>
        </div>

        <div className="space-y-5 animate-slide-up">
          <Section title={t(`${p}.sectionA`)} color="#60a5fa">

            <Q no={1} badge={t(`${p}.q1.badge`)} badgeColor="#60a5fa">
              <p><Trans i18nKey={`${p}.q1.instruction`} components={{ strong: <strong className="text-blue-300" /> }} /></p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) {t(`${p}.q1.itemA`)}</li>
                <li>(b) {t(`${p}.q1.itemB`)}</li>
                <li>(c) {t(`${p}.q1.itemC`)}</li>
                <li>(d) {t(`${p}.q1.itemD`)}</li>
              </ul>
            </Q>

            <Q no={2} badge={t(`${p}.q2.badge`)} badgeColor="#60a5fa">
              <p>
                {t(`${p}.q2.pre`)}{' '}<InlineMath math="A = \{2, 4, 6, 8, 10\}" />. {t(`${p}.q2.post`)}
              </p>
              <BlockMath math={`\\begin{array}{ll}
(a)\\; 4 \\in A & (b)\\; 5 \\in A \\\\
(c)\\; 10 \\notin A & (d)\\; 1 \\notin A
\\end{array}`} />
            </Q>

            <Q no={3} badge={t(`${p}.q3.badge`)} badgeColor="#60a5fa">
              <p>
                {t(`${p}.q3.instruction`)}
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="P" /> {t(`${p}.q3.itemA`)}</li>
                <li>(b) <InlineMath math="Q" /> {t(`${p}.q3.itemB`)}</li>
                <li>(c) <InlineMath math="R" /> {t(`${p}.q3.itemC`)}</li>
              </ul>
            </Q>

            <Q no={4} badge={t(`${p}.q4.badge`)} badgeColor="#60a5fa">
              <p>
                {t(`${p}.q4.instruction`)}
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="A = \{1, 3, 5, 7, 9, 11\}" /></li>
                <li>(b) <InlineMath math="B" /> {t(`${p}.q4.itemB`)}</li>
                <li>(c) <InlineMath math="C" /> {t(`${p}.q4.itemC`)}</li>
              </ul>
            </Q>

            <Q no={5} badge={t(`${p}.q5.badge`)} badgeColor="#60a5fa">
              <p>
                {t(`${p}.q5.pre`)}{' '}<InlineMath math={`K = \\{x \\mid x \\text{ ${q5desc}}\\}`} />.{' '}
                {t(`${p}.q5.midPre`)}{' '}<InlineMath math="K" />{' '}{t(`${p}.q5.midPost`)}
              </p>
            </Q>
          </Section>

          <Section title={t(`${p}.sectionB`)} color="#a78bfa">

            <Q no={6} badge={t(`${p}.q6.badge`)} badgeColor="#a78bfa">
              <p>
                {t(`${p}.q6.pre`)}{' '}<InlineMath math="B = \{x \mid 3 \leq x \leq 12,\; x \in \mathbb{N}\}" />.{' '}
                {t(`${p}.q6.mid`)}{' '}<InlineMath math="B" />{' '}{t(`${p}.q6.and`)}{' '}<InlineMath math="n(B)" />!
              </p>
            </Q>

            <Q no={7} badge={t(`${p}.q7.badge`)} badgeColor="#a78bfa">
              <p>
                {t(`${p}.q7.pre`)}{' '}<InlineMath math="A = \{1, 4, 9, 16, 25, 36\}" />{' '}{t(`${p}.q7.post`)}
              </p>
            </Q>

            <Q no={8} badge={t(`${p}.q8.badge`)} badgeColor="#a78bfa">
              <p>
                {t(`${p}.q8.pre`)}{' '}<InlineMath math="P = \{p, e, l, a, j, r\}" />{' '}{t(`${p}.q8.mid`)}{' '}{t(`${p}.q8.post`)}
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(A) <InlineMath math="n(P) = 7" /></li>
                <li>(B) <InlineMath math="'a' \notin P" /></li>
                <li>(C) <InlineMath math="n(P) = 6" /></li>
                <li>(D) <InlineMath math="'z' \in P" /></li>
              </ul>
            </Q>

            <Q no={9} badge={t(`${p}.q9.badge`)} badgeColor="#a78bfa">
              <p>
                {t(`${p}.q9.instruction`)}
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="A" /> {t(`${p}.q9.itemA`)}</li>
                <li>(b) <InlineMath math="B" /> {t(`${p}.q9.itemB`)}</li>
              </ul>
            </Q>

            <Q no={10} badge={t(`${p}.q10.badge`)} badgeColor="#a78bfa">
              <p>
                {t(`${p}.q10.pre`)}{' '}<InlineMath math="A = \{x \mid x^2 - 5x + 6 = 0,\; x \in \mathbb{Z}\}" />.{' '}
                {t(`${p}.q10.post1`)}{' '}<InlineMath math="A" />{' '}{t(`${p}.q10.post2`)}{' '}<InlineMath math="n(A)" />!
              </p>
            </Q>
          </Section>

          <Section title={t(`${p}.sectionC`)} color="#4ade80">

            <Q no={11} badge={t(`${p}.q11.badge`)} badgeColor="#4ade80">
              <p>
                {t(`${p}.q11.part1`)}{' '}
                {t(`${p}.q11.part2Pre`)}{' '}<InlineMath math="n" />{t(`${p}.q11.part2Post`)}
              </p>
            </Q>

            <Q no={12} badge={t(`${p}.q12.badge`)} badgeColor="#4ade80">
              <p>
                {t(`${p}.q12.pre`)}{' '}<InlineMath math="M = \{1, 2, 3, \ldots, 10\}" />.{' '}
                {t(`${p}.q12.mid`)}{' '}<InlineMath math="M" />{' '}{t(`${p}.q12.post`)}
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) {t(`${p}.q12.itemA`)}</li>
                <li>(b) {t(`${p}.q12.itemB`)}</li>
                <li>(c) {t(`${p}.q12.itemC`)}</li>
              </ul>
            </Q>

            <Q no={13} badge={t(`${p}.q13.badge`)} badgeColor="#4ade80">
              <p>
                <Trans i18nKey={`${p}.q13.instruction`} components={{ strong: <strong className="text-green-300" /> }} />
              </p>
            </Q>

            <Q no={14} badge={t(`${p}.q14.badge`)} badgeColor="#4ade80">
              <p>
                {t(`${p}.q14.set`)}{' '}<InlineMath math="A" />{' '}{t(`${p}.q14.has`)}{' '}<InlineMath math="n(A) = 4" />.{' '}
                {t(`${p}.q14.set`)}{' '}<InlineMath math="B" />{' '}{t(`${p}.q14.has`)}{' '}<InlineMath math="n(B) = 3" />.{' '}
                {t(`${p}.q14.jika`)}{' '}<InlineMath math="A \cap B = \{2, 5\}" />, {t(`${p}.q14.berapakah`)}{' '}<InlineMath math="n(A \cup B)" />?
              </p>
            </Q>

            <Q no={15} badge={t(`${p}.q15.badge`)} badgeColor="#4ade80">
              <p>
                {t(`${p}.q15.intro`)}
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>• {t(`${p}.q15.bullet1`)}</li>
                <li>• {t(`${p}.q15.bullet2`)}</li>
                <li>• {t(`${p}.q15.bullet3`)}</li>
              </ul>
              <p className="mt-2">
                (a) {t(`${p}.q15.subA`)}<br/>
                (b) {t(`${p}.q15.subB`)}<br/>
                (c) {t(`${p}.q15.subCPre`)}{' '}<InlineMath math="n(A \cup B)" />{' '}{t(`${p}.q15.subCSuffix`)}
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

export default PengertianKeanggotaanLatihanPage;
