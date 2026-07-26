import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { InlineMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";

/* ─────────────────────────────────────────────
   IMAGE DIAGRAMS
───────────────────────────────────────────── */

const DiagramQ1 = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
    <div className="flex flex-col items-center gap-1">
      <span className="text-accent font-semibold text-sm">a.</span>
      <img src={"/images/1a_1774935683575.png"} alt="Segitiga a soal 1" className="w-full max-w-[220px] mx-auto rounded-lg" />
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-accent font-semibold text-sm">b.</span>
      <img src={"/images/1b_1774935683576.png"} alt="Segitiga b soal 1" className="w-full max-w-[220px] mx-auto rounded-lg" />
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-accent font-semibold text-sm">c.</span>
      <img src={"/images/1c_1774935683576.png"} alt="Segitiga c soal 1" className="w-full max-w-[220px] mx-auto rounded-lg" />
    </div>
  </div>
);

const DiagramQ2 = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
    <div className="flex flex-col items-center gap-1">
      <span className="text-accent font-semibold text-sm">a.</span>
      <img src={"/images/2a_1774935683577.png"} alt="Segitiga a soal 2" className="w-full max-w-[260px] mx-auto rounded-lg" />
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-accent font-semibold text-sm">b.</span>
      <img src={"/images/2b_1774935683577.png"} alt="Segitiga b soal 2" className="w-full max-w-[260px] mx-auto rounded-lg" />
    </div>
  </div>
);

const DiagramQ3 = () => (
  <img src={"/images/3_1774935683577.png"} alt="Segitiga ABC soal 3" className="w-full max-w-sm mx-auto my-4 rounded-lg" />
);

const DiagramQ4 = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
    <div className="flex flex-col items-center gap-1">
      <span className="text-accent font-semibold text-sm">a.</span>
      <img src={"/images/4a_1774935683578.png"} alt="Bangun a soal 4" className="w-full max-w-[240px] mx-auto rounded-lg" />
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-accent font-semibold text-sm">b.</span>
      <img src={"/images/4b_1774935683578.png"} alt="Bangun b soal 4" className="w-full max-w-[240px] mx-auto rounded-lg" />
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-accent font-semibold text-sm">c.</span>
      <img src={"/images/4c_1774935683579.png"} alt="Bangun c soal 4" className="w-full max-w-[240px] mx-auto rounded-lg" />
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-accent font-semibold text-sm">d.</span>
      <img src={"/images/4d_1774935683579.png"} alt="Bangun d soal 4" className="w-full max-w-[240px] mx-auto rounded-lg" />
    </div>
  </div>
);

const DiagramQ5 = () => (
  <img src={"/images/5_1774935683579.png"} alt="Belah ketupat ABCD soal 5" className="w-full max-w-xs mx-auto my-4 rounded-lg" />
);

/* Q6: Trapezoid ABCD — DC=10 cm (top), AB=16 cm (bottom), AD=8 cm, BC=6 cm */
const DiagramQ6 = () => (
  <svg viewBox="0 0 340 210" className="w-full max-w-sm mx-auto my-4" aria-label="Trapesium ABCD">
    <polygon points="20,175 300,175 250,35 90,35" fill="rgba(248,113,113,0.10)" stroke="#f87171" strokeWidth="2" />
    <text x="4"   y="192" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="304" y="192" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="255" y="28"  fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="72"  y="28"  fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="150" y="28"  fill="#ffffff" fontSize="13" fontFamily="monospace">10 cm</text>
    <text x="145" y="195" fill="#ffffff" fontSize="13" fontFamily="monospace">16 cm</text>
    <text x="18"  y="115" fill="#ffffff" fontSize="12" fontFamily="monospace" transform="rotate(-75 35 115)">8 cm</text>
    <text x="292" y="115" fill="#ffffff" fontSize="12" fontFamily="monospace" transform="rotate(65 292 115)">6 cm</text>
  </svg>
);

/* ─────────────────────────────────────────────
   QUESTION CARD COMPONENT
───────────────────────────────────────────── */
type QuestionCardProps = {
  no: number;
  question: React.ReactNode;
  diagram?: React.ReactNode;
};

const QuestionCard = ({ no, question, diagram }: QuestionCardProps) => (
  <div className="flex gap-3 items-start">
    <span className="shrink-0 font-bold text-accent text-sm min-w-[28px] pt-0.5 text-right">{no}.</span>
    <div className="flex-1 space-y-3">
      <div className="text-white/90 text-sm leading-relaxed">{question}</div>
      {diagram && <div>{diagram}</div>}
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────── */
const KelilingSegitigaSegiempatLatihanPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const K = "practice.segitigaSegiempat.kelilingSegitigaSegiempat";

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t(`${K}.title`)}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t(`${K}.subtitle`)}
        </p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <h2 className="text-lg font-bold text-accent mb-4 font-display">{t(`${K}.sectionTitle`)}</h2>
          <p className="text-white/70 text-sm mb-6 font-body">
            {t(`${K}.instruction`)}
          </p>

          <div className="space-y-8 font-body">

            {/* Q1 — no InlineMath */}
            <QuestionCard
              no={1}
              diagram={<DiagramQ1 />}
              question={<p>{t(`${K}.q1`)}</p>}
            />

            {/* Q2 — 2 InlineMath: [70 cm] [LM] */}
            <QuestionCard
              no={2}
              diagram={<DiagramQ2 />}
              question={
                <p>
                  {t(`${K}.q2pre`)} <InlineMath math="70 \text{ cm}" />{t(`${K}.q2mid`)} <InlineMath math="LM" />{t(`${K}.q2end`)}
                </p>
              }
            />

            {/* Q3 — 4 InlineMath: [18 cm] [AB] [AC] [BC] */}
            <QuestionCard
              no={3}
              diagram={<DiagramQ3 />}
              question={
                <p>
                  {t(`${K}.q3pre`)} <InlineMath math="18 \text{ cm}" />{t(`${K}.q3mid`)} <InlineMath math="AB" />, <InlineMath math="AC" />, {t(`${K}.q3andWord`)} <InlineMath math="BC" />{t(`${K}.q3end`)}
                </p>
              }
            />

            {/* Q4 — no InlineMath */}
            <QuestionCard
              no={4}
              diagram={<DiagramQ4 />}
              question={<p>{t(`${K}.q4`)}</p>}
            />

            {/* Q5 — 1 InlineMath: [AB = 8 cm] */}
            <QuestionCard
              no={5}
              diagram={<DiagramQ5 />}
              question={
                <p>
                  {t(`${K}.q5pre`)} <InlineMath math="AB = 8 \text{ cm}" />{t(`${K}.q5end`)}
                </p>
              }
            />

            {/* Q6 — no InlineMath */}
            <QuestionCard
              no={6}
              diagram={<DiagramQ6 />}
              question={<p>{t(`${K}.q6`)}</p>}
            />

            {/* Q7 — 1 InlineMath: [100] */}
            <QuestionCard
              no={7}
              question={
                <p>
                  {t(`${K}.q7pre`)} <InlineMath math="100" /> {t(`${K}.q7end`)}
                </p>
              }
            />

            {/* Q8 — 2 InlineMath: [2:1] [15] */}
            <QuestionCard
              no={8}
              question={
                <p>
                  {t(`${K}.q8pre`)} <InlineMath math="2 : 1" />{t(`${K}.q8mid`)} <InlineMath math="15" /> {t(`${K}.q8end`)}
                </p>
              }
            />

            {/* Q9 — 2 InlineMath: [3:2] [24 cm] */}
            <QuestionCard
              no={9}
              question={
                <p>
                  {t(`${K}.q9pre`)} <InlineMath math="3 : 2" />{t(`${K}.q9mid`)} <InlineMath math="24 \text{ cm}" />{t(`${K}.q9end`)}
                </p>
              }
            />

            {/* Q10 — 3 InlineMath: [2:1] [2:3] [55 cm] */}
            <QuestionCard
              no={10}
              question={
                <p>
                  {t(`${K}.q10pre`)} <InlineMath math="2 : 1" />{t(`${K}.q10mid`)} <InlineMath math="2 : 3" />{t(`${K}.q10mid2`)} <InlineMath math="55 \text{ cm}" />{t(`${K}.q10end`)}
                </p>
              }
            />

            {/* Q11 — 5 InlineMath: [x] [x+2] [x+4] [24 cm] [x] */}
            <QuestionCard
              no={11}
              question={
                <p>
                  {t(`${K}.q11pre`)} <InlineMath math="x" />, <InlineMath math="x+2" />, {t(`${K}.q11andWord`)} <InlineMath math="x+4" />{t(`${K}.q11mid`)} <InlineMath math="24 \text{ cm}" />{t(`${K}.q11end`)} <InlineMath math="x" />{t(`${K}.q11suffix`)}
                </p>
              }
            />

            {/* Q12 — 4 InlineMath: [y] [2y] [36 cm] [y] */}
            <QuestionCard
              no={12}
              question={
                <p>
                  {t(`${K}.q12pre`)} <InlineMath math="y" /> {t(`${K}.q12mid`)} <InlineMath math="2y" />{t(`${K}.q12mid2`)} <InlineMath math="36 \text{ cm}" />{t(`${K}.q12end`)} <InlineMath math="y" />{t(`${K}.q12suffix`)}
                </p>
              }
            />

            {/* Q13 — 3 InlineMath: [(2x-1) cm] [44 cm] [x] */}
            <QuestionCard
              no={13}
              question={
                <p>
                  {t(`${K}.q13pre`)} <InlineMath math="(2x-1) \text{ cm}" />{t(`${K}.q13mid`)} <InlineMath math="44 \text{ cm}" />{t(`${K}.q13end`)} <InlineMath math="x" />{t(`${K}.q13suffix`)}
                </p>
              }
            />

            {/* Q14 — 3 InlineMath: [20 m] [10 m] [5 m] */}
            <QuestionCard
              no={14}
              question={
                <p>
                  {t(`${K}.q14pre`)} <InlineMath math="20 \text{ m}" /> {t(`${K}.q14mid`)} <InlineMath math="10 \text{ m}" />{t(`${K}.q14mid2`)} <InlineMath math="5 \text{ m}" />{t(`${K}.q14end`)}
                </p>
              }
            />

            {/* Q15 — 4 InlineMath: [40 m] [16 m] [15 m] [4 m] */}
            <QuestionCard
              no={15}
              question={
                <p>
                  {t(`${K}.q15pre`)} <InlineMath math="40 \text{ m}" /> {t(`${K}.q15mid`)} <InlineMath math="16 \text{ m}" />{t(`${K}.q15mid2`)} <InlineMath math="15 \text{ m}" />{t(`${K}.q15mid3`)} <InlineMath math="4 \text{ m}" />{t(`${K}.q15end`)}
                </p>
              }
            />

          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              playPopSound();
              navigate("/latihan-mandiri/kelas-7/segitiga-dan-segiempat");
            }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            <ChevronLeft className="w-4 h-4" />
            {t(`${K}.back`)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KelilingSegitigaSegiempatLatihanPage;
