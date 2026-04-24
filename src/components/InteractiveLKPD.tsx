import { ReactNode, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import {
  ArrowLeft,
  Award,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Lightbulb,
  RefreshCcw,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";

const normalize = (value: string) =>
  value.toLowerCase().replace(/\s+/g, "").replace(/,/g, ".").replace(/\./g, "");

const answerMatches = (value: string, accepted: string[]) => {
  const cleanValue = normalize(value);
  return accepted.some((answer) => normalize(answer) === cleanValue);
};

const hasAnswer = (value?: string) => Boolean(value?.trim());

export type GuidedItem = {
  id: string;
  label: string;
  suffix?: string;
  answers: string[];
  discussion: string[];
};

export type PracticeItem = {
  id: string;
  question: string;
  answers: string[];
  hint: string;
  discussion: string[];
};

export type SummaryCard = {
  title: string;
  text: string;
  tone?: "cyan" | "yellow" | "emerald" | "violet" | "rose";
};

export type SituationCard = {
  title: string;
  visual: ReactNode;
  text: string;
};

type Props = {
  badgeText: string;
  title: string;
  intro: string;
  steps?: { icon: "Compass" | "Lightbulb" | "Target"; title: string; text: string }[];
  situations: SituationCard[];
  guidedIntro: string;
  guidedItems: GuidedItem[];
  summaryCards: SummaryCard[];
  practiceIntro: string;
  practiceItems: PracticeItem[];
  prevPath: string;
  backLabel: string;
  scoreMessages?: {
    perfect: string;
    high: string;
    medium: string;
    low: string;
  };
};

const toneClass: Record<NonNullable<SummaryCard["tone"]>, string> = {
  cyan: "bg-cyan-500/10 border-cyan-200/20 text-cyan-100",
  yellow: "bg-yellow-500/10 border-yellow-200/20 text-yellow-100",
  emerald: "bg-emerald-500/10 border-emerald-200/20 text-emerald-100",
  violet: "bg-violet-500/10 border-violet-200/20 text-violet-100",
  rose: "bg-rose-500/10 border-rose-200/20 text-rose-100",
};

const stepIcons = { Compass, Lightbulb, Target };

const DiscussionBox = ({ steps }: { steps: string[] }) => (
  <details className="mt-3 rounded-2xl border border-yellow-200/25 bg-yellow-400/10 px-4 py-3 text-sm text-white/80">
    <summary className="cursor-pointer select-none font-semibold text-yellow-100 hover:text-yellow-200">
      Lihat Pembahasan
    </summary>
    <ol className="mt-3 space-y-2 list-decimal pl-5 font-body">
      {steps.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ol>
  </details>
);

const InteractiveLKPD = ({
  badgeText,
  title,
  intro,
  steps = [
    { icon: "Compass", title: "Amati", text: "Baca situasi dan informasi yang diberikan." },
    { icon: "Lightbulb", title: "Temukan", text: "Isi bagian kosong untuk menemukan konsep dan rumus." },
    { icon: "Target", title: "Terapkan", text: "Gunakan kesimpulan pada soal kontekstual." },
  ],
  situations,
  guidedIntro,
  guidedItems,
  summaryCards,
  practiceIntro,
  practiceItems,
  prevPath,
  backLabel,
  scoreMessages,
}: Props) => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const allQuestions = useMemo(() => [...guidedItems, ...practiceItems], [guidedItems, practiceItems]);

  const results = useMemo(() => {
    return allQuestions.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.id] = answerMatches(answers[item.id] || "", item.answers);
      return acc;
    }, {});
  }, [answers, allQuestions]);

  const score = useMemo(() => Object.values(results).filter(Boolean).length, [results]);
  const total = allQuestions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const updateAnswer = (id: string, value: string) =>
    setAnswers((current) => ({ ...current, [id]: value }));

  const checkAnswers = () => {
    playPopSound();
    setChecked(true);
    setTimeout(
      () => document.getElementById("lkpd-score")?.scrollIntoView({ behavior: "smooth", block: "center" }),
      100,
    );
  };

  const resetAnswers = () => {
    playPopSound();
    setAnswers({});
    setChecked(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const messages = scoreMessages ?? {
    perfect: "Luar biasa! Pemahamanmu sudah mantap.",
    high: "Bagus! Periksa kembali bagian yang masih merah agar makin mantap.",
    medium: "Kamu sudah mulai paham. Baca lagi penemuan terbimbing dan rumus bakunya.",
    low: "Tetap semangat. Ikuti langkahnya perlahan dari konsep sampai penerapan.",
  };

  const getMessage = () => {
    if (percentage === 100) return messages.perfect;
    if (percentage >= 75) return messages.high;
    if (percentage >= 50) return messages.medium;
    return messages.low;
  };

  return (
    <div className="relative min-h-screen gradient-space overflow-x-hidden text-white">
      <Starfield />
      <PageNavigation prevPath={prevPath} />
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-14">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 mb-4">
            <ClipboardCheck className="w-4 h-4" />
            {badgeText}
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary text-glow-cyan leading-tight">
            {title}
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-3xl mx-auto font-body">{intro}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {steps.map((item) => {
            const Icon = stepIcons[item.icon];
            return (
              <div key={item.title} className="bg-card/80 backdrop-blur border border-border rounded-2xl p-5 shadow-lg">
                <Icon className="w-8 h-8 text-yellow-300 mb-3" />
                <h2 className="font-display font-bold text-lg text-white mb-1">{item.title}</h2>
                <p className="text-sm text-white/65 font-body">{item.text}</p>
              </div>
            );
          })}
        </div>

        <section className="bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-violet-500/15 border border-cyan-200/30 rounded-3xl p-5 md:p-7 mb-6 backdrop-blur">
          <div className="flex items-start gap-3 mb-5">
            <BookOpenCheck className="w-8 h-8 text-cyan-200 shrink-0" />
            <div>
              <h2 className="font-display text-2xl font-bold text-cyan-100">A. Penemuan Terbimbing</h2>
              <p className="text-sm text-white/70 font-body mt-1">{guidedIntro}</p>
            </div>
          </div>

          {situations.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-5 mb-6">
              {situations.map((situation) => (
                <div key={situation.title} className="rounded-2xl bg-black/20 border border-white/10 p-5">
                  <h3 className="font-display font-bold text-yellow-200 mb-3">{situation.title}</h3>
                  <div className="rounded-xl bg-white/5 p-4 mb-4">{situation.visual}</div>
                  <p className="text-sm text-white/75 font-body">{situation.text}</p>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 mb-6">
            {guidedItems.map((item, index) => (
              <label key={item.id} className="block rounded-2xl bg-card/80 border border-white/10 p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="flex-1 text-sm md:text-base text-white/85 font-body">
                    <span className="font-bold text-cyan-200">{index + 1}.</span> {item.label}{" "}
                    <span className="text-cyan-200">...</span> {item.suffix ?? ""}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      value={answers[item.id] || ""}
                      onChange={(event) => updateAnswer(item.id, event.target.value)}
                      className="w-full md:w-52 rounded-xl border border-cyan-200/30 bg-black/30 px-4 py-2 text-white outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                      placeholder="isi jawaban"
                    />
                    {hasAnswer(answers[item.id]) && (
                      <span
                        className={`inline-flex min-w-24 items-center justify-center gap-1 rounded-full px-3 py-2 text-xs font-semibold ${
                          results[item.id] ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"
                        }`}
                      >
                        {results[item.id] ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {results[item.id] ? "Benar" : "Salah"}
                      </span>
                    )}
                  </div>
                </div>
                {checked && <DiscussionBox steps={item.discussion} />}
              </label>
            ))}
          </div>

          <div className="rounded-3xl border border-fuchsia-200/25 bg-fuchsia-500/10 p-5">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="w-7 h-7 text-fuchsia-200 shrink-0" />
              <div>
                <h3 className="font-display text-xl font-bold text-fuchsia-100">Kesimpulan dan Rumus Baku</h3>
                <p className="text-sm text-white/70 font-body">
                  Gunakan hasil isian di atas sebagai ringkasan sebelum mengerjakan soal.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {summaryCards.map((card) => (
                <div key={card.title} className={`rounded-2xl border p-4 ${toneClass[card.tone ?? "cyan"]}`}>
                  <h4 className="font-bold mb-2">{card.title}</h4>
                  <p className="text-sm text-white/75">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-rose-500/15 border border-fuchsia-200/30 rounded-3xl p-5 md:p-7 mb-6 backdrop-blur">
          <div className="flex items-start gap-3 mb-5">
            <Target className="w-8 h-8 text-rose-200 shrink-0" />
            <div>
              <h2 className="font-display text-2xl font-bold text-rose-100">B. Soal Latihan</h2>
              <p className="text-sm text-white/70 font-body mt-1">{practiceIntro}</p>
            </div>
          </div>
          <div className="space-y-4">
            {practiceItems.map((item, index) => (
              <div key={item.id} className="rounded-2xl bg-card/80 border border-white/10 p-4">
                <p className="text-sm md:text-base text-white/85 font-body mb-3">
                  <span className="font-bold text-rose-200">{index + 1}.</span> {item.question}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <input
                    value={answers[item.id] || ""}
                    onChange={(event) => updateAnswer(item.id, event.target.value)}
                    className="flex-1 rounded-xl border border-fuchsia-200/30 bg-black/30 px-4 py-2 text-white outline-none focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-300/20"
                    placeholder="tulis jawabanmu"
                  />
                  {hasAnswer(answers[item.id]) && (
                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
                        results[item.id] ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"
                      }`}
                    >
                      {results[item.id] ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {results[item.id] ? "Benar" : "Salah"}
                    </div>
                  )}
                </div>
                {hasAnswer(answers[item.id]) && !results[item.id] && (
                  <p className="mt-2 text-xs text-yellow-200/90 font-body">Petunjuk: {item.hint}</p>
                )}
                {checked && <DiscussionBox steps={item.discussion} />}
              </div>
            ))}
          </div>
        </section>

        <section
          id="lkpd-score"
          className="rounded-3xl border border-emerald-200/30 bg-emerald-500/10 backdrop-blur p-5 md:p-7 text-center mb-8"
        >
          <Award className="w-12 h-12 text-yellow-300 mx-auto mb-3" />
          <h2 className="font-display text-2xl font-bold text-emerald-100 mb-2">Skor Akhir</h2>
          {checked ? (
            <>
              <p className="text-5xl font-display font-bold text-white mb-2">
                {score}/{total}
              </p>
              <p className="text-lg font-semibold text-emerald-100 mb-3">Nilai: {percentage}</p>
              <p className="text-sm text-white/75 max-w-2xl mx-auto">{getMessage()}</p>
            </>
          ) : (
            <p className="text-sm text-white/70">
              Benar/salah terlihat langsung di setiap isian. Tekan tombol di bawah untuk melihat skor akhir.
            </p>
          )}
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={checkAnswers}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground hover:scale-105 transition-transform"
            >
              <ClipboardCheck className="w-5 h-5" />
              Lihat Skor Akhir
            </button>
            <button
              onClick={resetAnswers}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/15 transition-colors"
            >
              <RefreshCcw className="w-5 h-5" />
              Ulangi LKPD
            </button>
          </div>
        </section>

        <div className="text-center">
          <button
            onClick={() => {
              playPopSound();
              navigate(prevPath);
            }}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveLKPD;
