import { ReactNode, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import LKPDGameZone, { LKPDGame } from "@/components/LKPDGameZone";
import { playPopSound } from "@/hooks/useAudio";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
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

const hasText = (value?: string) => Boolean(value?.trim());

type CommonGuided = { id: string; label: string; discussion: string[] };
type CommonPractice = { id: string; question: string; hint: string; discussion: string[] };

type FillGuided = CommonGuided & { kind?: "fill"; suffix?: string; answers: string[] };
type ChoiceGuided = CommonGuided & { kind: "choice"; options: string[]; correctIndex: number };
type TFGuided = CommonGuided & { kind: "truefalse"; correct: boolean };
type MatchGuided = CommonGuided & { kind: "match"; pairs: { left: string; right: string }[] };
type SortGuided = CommonGuided & { kind: "sort"; items: string[]; correctOrder: string[] };
type BaseExpGuided = CommonGuided & { kind: "base-exp"; base: string; exp: string };

type FillPractice = CommonPractice & { kind?: "fill"; answers: string[] };
type ChoicePractice = CommonPractice & { kind: "choice"; options: string[]; correctIndex: number };
type TFPractice = CommonPractice & { kind: "truefalse"; correct: boolean };
type MatchPractice = CommonPractice & { kind: "match"; pairs: { left: string; right: string }[] };
type SortPractice = CommonPractice & { kind: "sort"; items: string[]; correctOrder: string[] };
type BaseExpPractice = CommonPractice & { kind: "base-exp"; base: string; exp: string };

export type GuidedItem = FillGuided | ChoiceGuided | TFGuided | MatchGuided | SortGuided | BaseExpGuided;
export type PracticeItem = FillPractice | ChoicePractice | TFPractice | MatchPractice | SortPractice | BaseExpPractice;

export type SummaryCard = { title: string; text: string; tone?: "cyan" | "yellow" | "emerald" | "violet" | "rose" };
export type SituationCard = { title: string; visual: ReactNode; text: string };

type Props = {
  badgeText: string;
  title: string;
  intro: string;
  steps?: { icon: "Compass" | "Lightbulb" | "Target"; title: string; text: string }[];
  headerSlot?: ReactNode;
  situations: SituationCard[];
  guidedIntro: string;
  guidedItems: GuidedItem[];
  summaryCards: SummaryCard[];
  practiceIntro: string;
  practiceItems: PracticeItem[];
  games?: LKPDGame[];
  midSlot?: ReactNode;
  prevPath: string;
  backLabel: string;
  scoreMessages?: { perfect: string; high: string; medium: string; low: string };
};

const toneClass: Record<NonNullable<SummaryCard["tone"]>, string> = {
  cyan: "bg-cyan-500/10 border-cyan-200/20",
  yellow: "bg-yellow-500/10 border-yellow-200/20",
  emerald: "bg-emerald-500/10 border-emerald-200/20",
  violet: "bg-violet-500/10 border-violet-200/20",
  rose: "bg-rose-500/10 border-rose-200/20",
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

type ItemWithKind = GuidedItem | PracticeItem;

const isAnswered = (item: ItemWithKind, value: unknown): boolean => {
  const kind = item.kind ?? "fill";
  if (kind === "fill") return hasText(value as string);
  if (kind === "choice") return typeof value === "number";
  if (kind === "truefalse") return value === true || value === false;
  if (kind === "match") return value !== undefined && Object.values(value as Record<string, string>).some((v) => Boolean(v));
  if (kind === "sort") return Array.isArray(value);
  if (kind === "base-exp") {
    const v = value as { base?: string; exp?: string } | undefined;
    return hasText(v?.base) && hasText(v?.exp);
  }
  return false;
};

const isCorrect = (item: ItemWithKind, value: unknown): boolean => {
  const kind = item.kind ?? "fill";
  if (kind === "fill") {
    return answerMatches((value as string) || "", (item as FillGuided | FillPractice).answers);
  }
  if (kind === "choice") {
    return value === (item as ChoiceGuided | ChoicePractice).correctIndex;
  }
  if (kind === "truefalse") {
    return value === (item as TFGuided | TFPractice).correct;
  }
  if (kind === "match") {
    const pairs = (item as MatchGuided | MatchPractice).pairs;
    const map = (value as Record<string, string>) || {};
    return pairs.every((p) => map[p.left] === p.right);
  }
  if (kind === "sort") {
    const correct = (item as SortGuided | SortPractice).correctOrder;
    const arr = (value as string[]) || [];
    return arr.length === correct.length && arr.every((v, i) => v === correct[i]);
  }
  if (kind === "base-exp") {
    const be = item as BaseExpGuided | BaseExpPractice;
    const v = value as { base?: string; exp?: string } | undefined;
    return answerMatches(v?.base || "", [be.base]) && answerMatches(v?.exp || "", [be.exp]);
  }
  return false;
};

const ResultBadge = ({ correct, size = "sm" }: { correct: boolean; size?: "sm" | "lg" }) => (
  <span
    className={`inline-flex ${size === "lg" ? "min-w-24" : "min-w-20"} items-center justify-center gap-1 rounded-full px-3 py-2 text-xs font-semibold ${
      correct ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"
    }`}
  >
    {correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
    {correct ? "Benar" : "Salah"}
  </span>
);

const ChoiceInput = ({
  options,
  value,
  onChange,
  correctIndex,
  showResult,
  variant,
}: {
  options: string[];
  value: number | undefined;
  onChange: (v: number) => void;
  correctIndex: number;
  showResult: boolean;
  variant: "guided" | "practice";
}) => {
  const ring = variant === "guided" ? "focus:ring-cyan-300/30" : "focus:ring-fuchsia-300/30";
  return (
    <div className="grid sm:grid-cols-2 gap-2 mt-2">
      {options.map((opt, i) => {
        const selected = value === i;
        const correct = i === correctIndex;
        let cls = "border-white/15 bg-black/30 hover:bg-white/10";
        if (selected && showResult) {
          cls = correct ? "border-emerald-300 bg-emerald-500/20" : "border-rose-300 bg-rose-500/20";
        } else if (selected) {
          cls = "border-cyan-300 bg-cyan-500/20";
        }
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(i)}
            className={`text-left rounded-xl border px-4 py-2 text-sm text-white transition-colors outline-none focus:ring-2 ${ring} ${cls}`}
          >
            <span className="font-semibold text-white/60 mr-2">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        );
      })}
    </div>
  );
};

const TrueFalseInput = ({
  value,
  onChange,
}: {
  value: boolean | undefined;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex gap-2 mt-2">
    {[
      { v: true, label: "Benar" },
      { v: false, label: "Salah" },
    ].map((o) => {
      const selected = value === o.v;
      return (
        <button
          key={o.label}
          type="button"
          onClick={() => onChange(o.v)}
          className={`flex-1 rounded-xl border px-4 py-2 text-sm font-bold text-white transition-colors ${
            selected ? "border-cyan-300 bg-cyan-500/20" : "border-white/15 bg-black/30 hover:bg-white/10"
          }`}
        >
          {o.label}
        </button>
      );
    })}
  </div>
);

const MatchInput = ({
  pairs,
  value,
  onChange,
}: {
  pairs: { left: string; right: string }[];
  value: Record<string, string> | undefined;
  onChange: (v: Record<string, string>) => void;
}) => {
  const rights = useMemo(() => Array.from(new Set(pairs.map((p) => p.right))), [pairs]);
  const map = value || {};
  return (
    <div className="space-y-2 mt-2">
      {pairs.map((p) => {
        const selected = map[p.left] || "";
        return (
          <div key={p.left} className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex-1 rounded-xl border border-white/15 bg-black/20 px-4 py-2 text-sm text-white/85">
              {p.left}
            </div>
            <span className="text-white/40 text-center">↔</span>
            <select
              value={selected}
              onChange={(e) => onChange({ ...map, [p.left]: e.target.value })}
              className="flex-1 rounded-xl border border-cyan-200/30 bg-black/30 px-4 py-2 text-sm text-white outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
            >
              <option value="">— pilih pasangan —</option>
              {rights.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
};

const SortInput = ({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string[] | undefined;
  onChange: (v: string[]) => void;
}) => {
  const order = value && value.length === items.length ? value : items;
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <ul className="space-y-2 mt-2">
      {order.map((it, i) => (
        <li key={it} className="flex items-center gap-2 rounded-xl border border-white/15 bg-black/20 px-3 py-2">
          <span className="text-xs font-bold text-cyan-200 w-6 text-center">{i + 1}</span>
          <span className="flex-1 text-sm text-white/85">{it}</span>
          <button
            type="button"
            onClick={() => move(i, -1)}
            className="rounded-md border border-white/15 bg-white/5 p-1 text-white/70 hover:bg-white/10 disabled:opacity-30"
            disabled={i === 0}
            aria-label="Naikkan"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => move(i, 1)}
            className="rounded-md border border-white/15 bg-white/5 p-1 text-white/70 hover:bg-white/10 disabled:opacity-30"
            disabled={i === order.length - 1}
            aria-label="Turunkan"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </li>
      ))}
    </ul>
  );
};

const BaseExpInput = ({
  value,
  onChange,
  variant,
}: {
  value: { base?: string; exp?: string } | undefined;
  onChange: (v: { base?: string; exp?: string }) => void;
  variant: "guided" | "practice";
}) => {
  const borderColor = variant === "guided" ? "border-cyan-400/70" : "border-fuchsia-400/70";
  const focusRing = variant === "guided"
    ? "focus:ring-cyan-300/30 focus:border-cyan-300"
    : "focus:ring-fuchsia-300/30 focus:border-fuchsia-300";
  const badgeColor = variant === "guided"
    ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-200"
    : "bg-fuchsia-500/20 border-fuchsia-400/50 text-fuchsia-200";
  const v = value || {};
  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wide ${badgeColor}`}>
          ✏️ ISIAN SISWA
        </span>
        <span className="text-white/35 text-xs">← isi bilangan pokok dan pangkatnya</span>
      </div>
      <div className="flex items-start gap-1">
        <input
          type="text"
          inputMode="numeric"
          value={v.base || ""}
          onChange={(e) => onChange({ ...v, base: e.target.value })}
          placeholder="?"
          className={`w-14 h-14 rounded-xl border-2 border-dashed bg-black/30 text-center text-2xl font-bold text-white outline-none focus:ring-2 focus:border-solid ${borderColor} ${focusRing}`}
        />
        <input
          type="text"
          inputMode="numeric"
          value={v.exp || ""}
          onChange={(e) => onChange({ ...v, exp: e.target.value })}
          placeholder="?"
          className={`w-8 h-8 rounded-lg border-2 border-dashed bg-black/30 text-center text-sm font-bold text-white outline-none focus:ring-2 focus:border-solid ${borderColor} ${focusRing} -mt-1`}
        />
      </div>
    </div>
  );
};

const KindLabel = ({ kind }: { kind: NonNullable<ItemWithKind["kind"]> | "fill" }) => {
  const map: Record<string, string> = {
    fill: "Isian",
    choice: "Pilihan Ganda",
    truefalse: "Benar / Salah",
    match: "Menjodohkan",
    sort: "Mengurutkan",
    "base-exp": "Bentuk Pangkat",
  };
  return <span className="text-[10px] uppercase tracking-wider text-cyan-300/80 font-bold">{map[kind]}</span>;
};

const InteractiveLKPD = ({
  badgeText,
  title,
  intro,
  steps = [
    { icon: "Compass", title: "Amati", text: "Baca situasi dan informasi yang diberikan." },
    { icon: "Lightbulb", title: "Temukan", text: "Selesaikan setiap soal untuk menemukan konsep." },
    { icon: "Target", title: "Terapkan", text: "Gunakan kesimpulan pada soal kontekstual." },
  ],
  headerSlot,
  situations,
  guidedIntro,
  guidedItems,
  summaryCards,
  practiceIntro,
  practiceItems,
  games,
  midSlot,
  prevPath,
  backLabel,
  scoreMessages,
}: Props) => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [checked, setChecked] = useState(false);

  const allItems = useMemo(() => [...guidedItems, ...practiceItems], [guidedItems, practiceItems]);

  const results = useMemo(() => {
    return allItems.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.id] = isCorrect(item, answers[item.id]);
      return acc;
    }, {});
  }, [answers, allItems]);

  const score = useMemo(() => Object.values(results).filter(Boolean).length, [results]);
  const total = allItems.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const update = (id: string, value: unknown) => setAnswers((cur) => ({ ...cur, [id]: value }));

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

  const renderInput = (item: ItemWithKind, variant: "guided" | "practice") => {
    const kind = item.kind ?? "fill";
    const value = answers[item.id];
    if (kind === "fill") {
      const f = item as FillGuided | FillPractice;
      const suffix = "suffix" in f ? f.suffix : undefined;
      const borderColor = variant === "guided" ? "border-cyan-400/70" : "border-fuchsia-400/70";
      const focusRing = variant === "guided" ? "focus:ring-cyan-300/30 focus:border-cyan-300" : "focus:ring-fuchsia-300/30 focus:border-fuchsia-300";
      const badgeColor = variant === "guided" ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-200" : "bg-fuchsia-500/20 border-fuchsia-400/50 text-fuchsia-200";
      return (
        <div className="mt-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wide ${badgeColor}`}>
              ✏️ ISIAN SISWA
            </span>
            <span className="text-white/35 text-xs">← wajib diisi</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <input
              value={(value as string) || ""}
              onChange={(e) => update(item.id, e.target.value)}
              className={`flex-1 rounded-xl border-2 border-dashed bg-black/30 px-4 py-2.5 text-white outline-none focus:ring-2 focus:border-solid ${borderColor} ${focusRing}`}
              placeholder="✏️ Tulis jawabanmu di sini..."
            />
            {suffix && <span className="text-sm text-white/65">{suffix}</span>}
            {isAnswered(item, value) && <ResultBadge correct={results[item.id]} />}
          </div>
        </div>
      );
    }
    if (kind === "choice") {
      const c = item as ChoiceGuided | ChoicePractice;
      return (
        <>
          <ChoiceInput
            options={c.options}
            value={value as number | undefined}
            onChange={(v) => update(item.id, v)}
            correctIndex={c.correctIndex}
            showResult={isAnswered(item, value)}
            variant={variant}
          />
          {isAnswered(item, value) && (
            <div className="mt-2">
              <ResultBadge correct={results[item.id]} />
            </div>
          )}
        </>
      );
    }
    if (kind === "truefalse") {
      return (
        <>
          <TrueFalseInput value={value as boolean | undefined} onChange={(v) => update(item.id, v)} />
          {isAnswered(item, value) && (
            <div className="mt-2">
              <ResultBadge correct={results[item.id]} />
            </div>
          )}
        </>
      );
    }
    if (kind === "match") {
      const m = item as MatchGuided | MatchPractice;
      return (
        <>
          <MatchInput pairs={m.pairs} value={value as Record<string, string> | undefined} onChange={(v) => update(item.id, v)} />
          {isAnswered(item, value) && (
            <div className="mt-2">
              <ResultBadge correct={results[item.id]} />
            </div>
          )}
        </>
      );
    }
    if (kind === "sort") {
      const s = item as SortGuided | SortPractice;
      return (
        <>
          <SortInput items={s.items} value={value as string[] | undefined} onChange={(v) => update(item.id, v)} />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => update(item.id, (value as string[] | undefined) ?? s.items)}
              className="text-xs text-cyan-200/80 underline"
            >
              periksa urutanku
            </button>
            {isAnswered(item, value) && <ResultBadge correct={results[item.id]} />}
          </div>
        </>
      );
    }
    if (kind === "base-exp") {
      return (
        <>
          <BaseExpInput
            value={value as { base?: string; exp?: string } | undefined}
            onChange={(v) => update(item.id, v)}
            variant={variant}
          />
          {isAnswered(item, value) && (
            <div className="mt-2">
              <ResultBadge correct={results[item.id]} />
            </div>
          )}
        </>
      );
    }
    return null;
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

        {headerSlot}

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
            {guidedItems.map((item, index) => {
              const kind = item.kind ?? "fill";
              return (
                <div key={item.id} className="rounded-2xl bg-card/80 border border-white/10 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="flex-1 text-sm md:text-base text-white/85 font-body">
                      <span className="font-bold text-cyan-200">{index + 1}.</span> {item.label}
                    </p>
                    <KindLabel kind={kind} />
                  </div>
                  {renderInput(item, "guided")}
                  {checked && <DiscussionBox steps={item.discussion} />}
                </div>
              );
            })}
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
                <div key={card.title} className={`rounded-2xl border p-4 text-white ${toneClass[card.tone ?? "cyan"]}`}>
                  <h4 className="font-bold mb-2">{card.title}</h4>
                  <p className="text-sm text-white/75">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {midSlot}

        {games && games.length > 0 && <LKPDGameZone games={games} />}

        <section className="bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-rose-500/15 border border-fuchsia-200/30 rounded-3xl p-5 md:p-7 mb-6 backdrop-blur">
          <div className="flex items-start gap-3 mb-5">
            <Target className="w-8 h-8 text-rose-200 shrink-0" />
            <div>
              <h2 className="font-display text-2xl font-bold text-rose-100">{games && games.length > 0 ? "D" : "B"}. Soal Latihan</h2>
              <p className="text-sm text-white/70 font-body mt-1">{practiceIntro}</p>
            </div>
          </div>
          <div className="space-y-4">
            {practiceItems.map((item, index) => {
              const kind = item.kind ?? "fill";
              const value = answers[item.id];
              return (
                <div key={item.id} className="rounded-2xl bg-card/80 border border-white/10 p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="flex-1 text-sm md:text-base text-white/85 font-body">
                      <span className="font-bold text-rose-200">{index + 1}.</span> {item.question}
                    </p>
                    <KindLabel kind={kind} />
                  </div>
                  {renderInput(item, "practice")}
                  {isAnswered(item, value) && !results[item.id] && (
                    <p className="mt-2 text-xs text-yellow-200/90 font-body">Petunjuk: {item.hint}</p>
                  )}
                  {checked && <DiscussionBox steps={item.discussion} />}
                </div>
              );
            })}
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
              Benar/salah terlihat langsung di setiap soal. Tekan tombol di bawah untuk melihat skor akhir.
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
