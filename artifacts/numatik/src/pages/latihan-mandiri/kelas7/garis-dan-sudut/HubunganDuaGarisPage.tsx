import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

const OPTION_LABELS = ["A", "B", "C", "D"];

const HubunganDuaGarisPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const p = "practice.garisDanSudut.hubunganDuaGaris";

  const questions = [
    {
      id: 1,
      image: "/images/GAMBAR_1_HUBUNGAN_2_GARIS.png",
      imageAlt: "Gambar 1 Hubungan 2 Garis",
      content: (
        <>
          <p className="mb-3">{t(`${p}.q1.intro`)}</p>
          <ol className="list-none space-y-1 mb-3 pl-2">
            <li>(i)&nbsp;&nbsp; {t(`${p}.q1.itemI`)}</li>
            <li>(ii)&nbsp;&nbsp;{t(`${p}.q1.itemII`)}</li>
            <li>(iii)&nbsp;{t(`${p}.q1.itemIII`)}</li>
            <li>(iv)&nbsp;{t(`${p}.q1.itemIV`)}</li>
          </ol>
          <p>{t(`${p}.q1.question`)}</p>
        </>
      ),
      options: [
        t(`${p}.q1.optA`),
        t(`${p}.q1.optB`),
        t(`${p}.q1.optC`),
        t(`${p}.q1.optD`),
      ],
    },
    {
      id: 2,
      content: (
        <>
          <p className="mb-3">{t(`${p}.q2.intro`)}</p>
          <ol className="list-none space-y-1 mb-3 pl-2">
            <li>(i)&nbsp;&nbsp; {t(`${p}.q2.itemI`)}</li>
            <li>
              (ii)&nbsp;&nbsp;{t(`${p}.q2.itemIIPre`)}
              <InlineMath math="a" />
              {t(`${p}.q2.itemIIMid1`)}
              <InlineMath math="b" />
              {t(`${p}.q2.itemIIMid2`)}
              <InlineMath math="b" />
              {t(`${p}.q2.itemIIMid3`)}
              <InlineMath math="c" />
              {t(`${p}.q2.itemIIMid4`)}
              <InlineMath math="a" />
              {t(`${p}.q2.itemIIMid5`)}
              <InlineMath math="c" />
              {t(`${p}.q2.itemIIEnd`)}
            </li>
            <li>(iii)&nbsp;{t(`${p}.q2.itemIII`)}</li>
            <li>(iv)&nbsp;{t(`${p}.q2.itemIV`)}</li>
          </ol>
          <p>{t(`${p}.q2.question`)}</p>
        </>
      ),
      options: [
        t(`${p}.q2.optA`),
        t(`${p}.q2.optB`),
        t(`${p}.q2.optC`),
        t(`${p}.q2.optD`),
      ],
    },
    {
      id: 3,
      content: (
        <p>{t(`${p}.q3.stem`)}</p>
      ),
      options: [
        t(`${p}.q3.optA`),
        t(`${p}.q3.optB`),
        t(`${p}.q3.optC`),
        t(`${p}.q3.optD`),
      ],
    },
    {
      id: 4,
      content: (
        <p>{t(`${p}.q4.stem`)}</p>
      ),
      options: [
        t(`${p}.q4.optA`),
        t(`${p}.q4.optB`),
        t(`${p}.q4.optC`),
        t(`${p}.q4.optD`),
      ],
    },
    {
      id: 5,
      content: (
        <p>
          {t(`${p}.q5.pre`)}
          <InlineMath math="90°" />
          {t(`${p}.q5.post`)}
        </p>
      ),
      options: [
        t(`${p}.q5.optA`),
        t(`${p}.q5.optB`),
        t(`${p}.q5.optC`),
        t(`${p}.q5.optD`),
      ],
    },
    {
      id: 6,
      content: (
        <p>{t(`${p}.q6.stem`)}</p>
      ),
      options: [
        t(`${p}.q6.optA`),
        t(`${p}.q6.optB`),
        t(`${p}.q6.optC`),
        t(`${p}.q6.optD`),
      ],
    },
    {
      id: 7,
      content: (
        <p>
          {t(`${p}.q7.pre`)}
          <InlineMath math="m" />
          {t(`${p}.q7.mid1`)}
          <InlineMath math="n" />
          {t(`${p}.q7.mid2`)}
          <InlineMath math="m" />
          {t(`${p}.q7.mid3`)}
          <InlineMath math="n" />
          {t(`${p}.q7.end`)}
        </p>
      ),
      options: [
        t(`${p}.q7.optA`),
        t(`${p}.q7.optB`),
        t(`${p}.q7.optC`),
        t(`${p}.q7.optD`),
      ],
    },
    {
      id: 8,
      content: (
        <p>
          {t(`${p}.q8.pre`)}
          <InlineMath math="k" />
          {t(`${p}.q8.mid1`)}
          <InlineMath math="(2, 3)" />
          {t(`${p}.q8.mid2`)}
          <InlineMath math="(5, 8)" />
          {t(`${p}.q8.mid3`)}
          <InlineMath math="l" />
          {t(`${p}.q8.mid4`)}
          <InlineMath math="(2, 3)" />
          {t(`${p}.q8.mid5`)}
          <InlineMath math="(5, 8)" />
          {t(`${p}.q8.mid6`)}
          <InlineMath math="k" />
          {t(`${p}.q8.mid7`)}
          <InlineMath math="l" />
          {t(`${p}.q8.end`)}
        </p>
      ),
      options: [
        t(`${p}.q8.optA`),
        t(`${p}.q8.optB`),
        t(`${p}.q8.optC`),
        t(`${p}.q8.optD`),
      ],
    },
    {
      id: 9,
      content: (
        <p>{t(`${p}.q9.stem`)}</p>
      ),
      options: [
        t(`${p}.q9.optA`),
        t(`${p}.q9.optB`),
        t(`${p}.q9.optC`),
        t(`${p}.q9.optD`),
      ],
    },
    {
      id: 10,
      image: "/images/GAMBAR_2_HUBUNGAN_2_GARIS.png",
      imageAlt: "Gambar 2 Hubungan 2 Garis",
      content: (
        <>
          <p className="mb-2">
            {t(`${p}.q10.pre`)}
            <InlineMath math="h" />
            {t(`${p}.q10.mid1`)}
            <InlineMath math="\overrightarrow{BQ}" />
            {t(`${p}.q10.mid2`)}
            <InlineMath math="\overrightarrow{AK}" />
            {t(`${p}.q10.mid3`)}
            <InlineMath math="h" />
            {t(`${p}.q10.mid4`)}
            <InlineMath math="k" />
            {t(`${p}.q10.mid5`)}
            <InlineMath math="AB = 8" />
            {t(`${p}.q10.mid6`)}
            <InlineMath math="PB = 15" />
            {t(`${p}.q10.mid7`)}
            <InlineMath math="KL = 10" />
            {t(`${p}.q10.end`)}
          </p>
        </>
      ),
      options: [
        t(`${p}.q10.optA`),
        t(`${p}.q10.optB`),
        t(`${p}.q10.optC`),
        t(`${p}.q10.optD`),
      ],
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t(`${p}.title`)}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t(`${p}.pageSubtitle`)}
        </p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <h2 className="text-lg font-bold text-accent mb-4 font-display">{t(`${p}.sectionTitle`)}</h2>
          <p className="text-white/70 text-sm mb-6 font-body">{t(`${p}.instruction`)}</p>

          <div className="space-y-8 text-white/90 font-body text-sm leading-relaxed">
            {questions.map((q) => (
              <div key={q.id} className="border-l-2 border-accent/50 pl-4 flex gap-3">
                <span className="font-semibold text-accent shrink-0 w-6">{q.id}.</span>

                <div className="flex-1 min-w-0">
                  {q.image && (
                    <div className="mb-4">
                      <div className="bg-white rounded-lg p-3 inline-block max-w-full">
                        <img
                          src={q.image}
                          alt={q.imageAlt}
                          className="w-full max-w-xs h-auto object-contain block"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mb-4">{q.content}</div>

                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-white/80">
                        <span className="font-semibold text-white/60 shrink-0 w-5">
                          {OPTION_LABELS[idx]}.
                        </span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              playPopSound();
              navigate("/latihan-mandiri/kelas-7/garis-dan-sudut");
            }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            <ChevronLeft className="w-4 h-4" />
            {t(`${p}.backTo`)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HubunganDuaGarisPage;
