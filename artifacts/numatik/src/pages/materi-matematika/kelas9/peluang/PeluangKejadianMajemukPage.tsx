import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, GitMerge, GitBranch, Layers } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { RangkumanSection } from "@/components/RangkumanSection";
import { useLanguage } from "@/contexts/LanguageContext";

const PeluangKejadianMajemukPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "saling-lepas", "tidak-saling-lepas", "saling-bebas", "bersyarat", "contoh", "rangkuman",
  ]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  // ── \mathrm{} variables for KaTeX ──
  const kAce =
    language === "en" ? "Ace" :
    language === "ja" ? "エース" : "As";
  const kDuaMerah =
    language === "en" ? "both\\,red" :
    language === "ja" ? "両方赤" : "keduanya\\,merah";
  const kDuaBiru =
    language === "en" ? "both\\,blue" :
    language === "ja" ? "両方青" : "keduanya\\,biru";
  const kMin1Merah =
    language === "en" ? "at\\,least\\,1\\,red" :
    language === "ja" ? "少なくとも1つ赤" : "setidaknya\\,1\\,merah";

  // ── UI translations ──
  const t =
    language === "en"
      ? {
          title: "COMPOUND EVENTS PROBABILITY",
          subtitle: "Combining Two or More Events in One Calculation",
          breadcrumb: "Grade 9 · Probability · Mathematics",
          typeBadges: [
            { label: "Mutually Exclusive", color: "bg-blue-700/50 text-blue-200 border border-blue-500/40" },
            { label: "Non-Mutually Exclusive", color: "bg-purple-700/50 text-purple-200 border border-purple-500/40" },
            { label: "Independent Events", color: "bg-green-700/50 text-green-200 border border-green-500/40" },
            { label: "Conditional", color: "bg-orange-700/50 text-orange-200 border border-orange-500/40" },
          ],
          introTitle: "🌟 What Are Compound Events?",
          introText: (
            <>
              <strong className="text-cyan-300">Compound events</strong> are the combination of two or more events. For example, when rolling a die, we can ask: "What is the probability of getting an even number <em>or</em> a number greater than 4?" — this involves two events at once.
            </>
          ),
          conceptMapTitle: "🗺️ Concept Map – Compound Events",
          conceptMapItems: [
            { label: "Union Operation (∪)", desc: "A or B", color: "bg-blue-900/40 border-blue-500/40 text-blue-300" },
            { label: "Intersection (∩)", desc: "A and B", color: "bg-purple-900/40 border-purple-500/40 text-purple-300" },
            { label: "Conditional Event", desc: "A | B (A given B)", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
          ],
          termCards: [
            { term: "Event A ∪ B", icon: "🔵", desc: "Union: A occurs, B occurs, or both occur.", color: "bg-blue-900/40 border-blue-500/40 text-blue-300" },
            { term: "Event A ∩ B", icon: "🟣", desc: "Intersection: A and B both occur simultaneously.", color: "bg-purple-900/40 border-purple-500/40 text-purple-300" },
            { term: "Mutually Exclusive", icon: "↔️", desc: "A and B cannot occur together: A ∩ B = ∅.", color: "bg-sky-900/40 border-sky-500/40 text-sky-300" },
            { term: "Independent Events", icon: "⚡", desc: "Whether A occurs does not affect the probability of B.", color: "bg-green-900/40 border-green-500/40 text-green-300" },
          ],
          sectionME: "🔵 Mutually Exclusive Events",
          meDesc: (
            <>
              Two events are called <strong className="text-blue-300">mutually exclusive</strong> if they cannot both occur at the same time. This means their intersection is empty: <InlineMath math="A \cap B = \emptyset" />.
            </>
          ),
          vennME: "📊 Venn Diagram – Mutually Exclusive",
          vennMECaption: "Circles A and B do not overlap → mutually exclusive",
          formulaME: "📐 Formula – Mutually Exclusive Events",
          formulaMENote: "Since A ∩ B = ∅, then P(A ∩ B) = 0",
          formulaMECaption: "No need to subtract the intersection because there are no shared outcomes!",
          exampleMETitle: "🎲 Example: Rolling a Die Once",
          exampleMEText: (
            <>
              A = outcome is 2 = <InlineMath math="\{2\}" />, B = outcome is 5 = <InlineMath math="\{5\}" />.
              <br />A ∩ B = ∅ → mutually exclusive ✓
            </>
          ),
          sectionNME: "🟣 Non-Mutually Exclusive Events",
          nmeDesc: (
            <>
              Two events are called <strong className="text-purple-300">non-mutually exclusive</strong> if they can occur together. Some outcomes belong to both events simultaneously: <InlineMath math="A \cap B \neq \emptyset" />.
            </>
          ),
          vennNME: "📊 Venn Diagram – Non-Mutually Exclusive",
          vennNMECaption: "Circles A and B overlap → there is an intersection",
          formulaNME: "📐 General Addition Rule (Non-Mutually Exclusive)",
          formulaNMENote: "Intersection members are counted twice, so subtract once:",
          formulaNMETip: "💡 This formula works for ALL cases! If mutually exclusive, P(A ∩ B) = 0, so the formula becomes P(A) + P(B).",
          exampleNMETitle: "🃏 Example: Playing Cards",
          exampleNMEText: "A = red cards (26 cards), B = Ace cards (4 cards), A ∩ B = red Aces (2 cards).",
          sectionInd: "🟢 Independent Events",
          indDesc: "Two events are called <strong>independent</strong> if whether one occurs does not affect the probability of the other. Classic example: flipping two separate coins.",
          indYes: "✅ Examples of Independence",
          indYesList: [
            "• Flipping a coin and rolling a die",
            "• Rolling two dice simultaneously",
            "• Drawing a ball with replacement",
          ],
          indNo: "❌ Not Independent",
          indNoList: [
            "• Drawing a ball without replacement",
            "• Events that influence each other",
            "• Conditional events (A | B)",
          ],
          formulaInd: "📐 Formula – Multiplication Rule (Independent Events)",
          formulaIndN: "For n independent events:",
          tableType: "Type",
          tableFormula: "Formula P(A ∩ B)",
          tableFeature: "Characteristic",
          tableRows: [
            ["Independent", "P(A) × P(B)", "Events do not influence each other"],
            ["Dependent", "P(A) × P(B|A)", "P(B) is affected by A"],
            ["Mutually Exclusive", "0", "Cannot occur simultaneously"],
          ],
          sectionCond: "🟠 Conditional Probability",
          condDesc: (
            <>
              <strong className="text-orange-300">Conditional probability</strong> is the probability that event A occurs given that event B has already occurred. Written as <InlineMath math="P(A|B)" /> (read: "probability of A given B").
            </>
          ),
          condAnalogyTitle: "🔑 Everyday Analogy",
          condAnalogyText: "\"What is the probability that a student gets an A, <em>given that</em> the student studies diligently?\" — This is conditional probability. The condition 'studies diligently' narrows the sample space we consider.",
          formulaCond: "📐 Formula – Conditional Probability",
          formulaCondDerived: "Derived from it – General Multiplication Rule:",
          exampleCondTitle: "🎴 Example: Playing Cards",
          exampleCondText: "From a deck of 52 cards, a card is drawn without replacement. Find the probability the second card is an Ace, given the first card was an Ace.",
          exampleCondNote: "After 1 Ace is drawn, 51 cards remain with 3 Aces:",
          sectionEx: "📝 Worked Examples",
          soal1Badge: "EASY",
          soal1BadgeColor: "bg-green-700/60 text-green-200",
          soal1Title: "Problem 1 – Mutually Exclusive Events",
          soal1Q: "A die is rolled once. Find the probability of getting a 2 or a 5!",
          soal1Answer: "✅ Solution",
          soal1Steps: [
            <>• A = outcome is 2 = <InlineMath math="\{2\}" />, so <InlineMath math="P(A) = \frac{1}{6}" /></>,
            <>• B = outcome is 5 = <InlineMath math="\{5\}" />, so <InlineMath math="P(B) = \frac{1}{6}" /></>,
            <>• A ∩ B = ∅ (impossible to get 2 and 5 simultaneously) → <strong>Mutually Exclusive</strong></>,
          ],
          soal1Key: <>🔑 The probability of getting a 2 or 5 is <InlineMath math="\frac{1}{3}" />.</>,
          soal2Badge: "MEDIUM",
          soal2BadgeColor: "bg-yellow-700/60 text-yellow-200",
          soal2Title: "Problem 2 – Non-Mutually Exclusive",
          soal2Q: "From a deck of 52 playing cards, one card is drawn at random. Find the probability of drawing a red card or a face card (J, Q, K)!",
          soal2Answer: "✅ Solution",
          soal2Steps: [
            <><InlineMath math="n(S) = 52" /></>,
            <>• A = red cards: <InlineMath math="n(A) = 26" />, so <InlineMath math="P(A) = \frac{26}{52} = \frac{1}{2}" /></>,
            <>• B = face cards (J, Q, K): <InlineMath math="n(B) = 12" />, so <InlineMath math="P(B) = \frac{12}{52} = \frac{3}{13}" /></>,
            <>• A ∩ B = red face cards (J♥, Q♥, K♥, J♦, Q♦, K♦): <InlineMath math="n(A \cap B) = 6" /></>,
            <>• <InlineMath math="P(A \cap B) = \frac{6}{52} = \frac{3}{26}" /></>,
          ],
          soal2Note: <>A ∩ B ≠ ∅, so <strong className="text-yellow-300">non-mutually exclusive</strong>. Use the general addition rule:</>,
          soal2Key: <>💡 The probability of drawing a red or face card is <InlineMath math="\frac{8}{13}" />.</>,
          soal3Badge: "HARD",
          soal3BadgeColor: "bg-red-700/60 text-red-200",
          soal3Title: "Problem 3 – Independent & Conditional Events",
          soal3Q: (
            <>
              A box contains 5 red balls and 3 blue balls. Two balls are drawn one by one <strong>without replacement</strong>. Find the probability of:
              <br />a. Both balls are red
              <br />b. First ball red and second ball blue
              <br />c. At least one red ball
            </>
          ),
          soal3Answer: "✅ Solution",
          soal3Setup: [
            "• Box: 5 red + 3 blue = 8 balls total",
            <>• Drawing without replacement → <strong className="text-orange-300">dependent events</strong></>,
          ],
          soal3aTitle: "a. P(both red)",
          soal3aNote: (
            <><InlineMath math="P(R_1) = \frac{5}{8}" />, after 1 red drawn: <InlineMath math="P(R_2|R_1) = \frac{4}{7}" /></>
          ),
          soal3bTitle: "b. P(first red, second blue)",
          soal3bNote: (
            <><InlineMath math="P(R_1) = \frac{5}{8}" />, after 1 red drawn: <InlineMath math="P(B_2|R_1) = \frac{3}{7}" /></>
          ),
          soal3cTitle: "c. P(at least 1 red) — Use the complement!",
          soal3cNote: "Complement: 'no red at all' = both blue:",
          soal3Warning: [
            "• 'Without replacement' → dependent events → use conditional multiplication rule.",
            "• For 'at least one', always consider the complement strategy — much faster!",
            "• Check: a + b + (BB) = 5/14 + 15/56 + 3/28 = 20/56 + 15/56 + 6/56 = 41/56 ≠ 1 (because a, b, BB are not all possibilities — blue-red also exists). Confirm: P(blue-red) = 3/8 × 5/7 = 15/56. Total: 20+15+15+6 = 56/56 = 1 ✓",
          ],
          sectionSummary: "📋 Summary",
          summaryPoints: [
            { poin: "Mutually Exclusive: A ∩ B = ∅, so P(A ∪ B) = P(A) + P(B).", icon: "🔵", color: "text-blue-300" },
            { poin: "Non-Mutually Exclusive: P(A ∪ B) = P(A) + P(B) − P(A ∩ B).", icon: "🟣", color: "text-purple-300" },
            { poin: "Independent Events: P(A ∩ B) = P(A) × P(B).", icon: "🟢", color: "text-green-300" },
            { poin: "Conditional Probability: P(A|B) = P(A ∩ B) / P(B).", icon: "🟠", color: "text-orange-300" },
            { poin: "General multiplication rule: P(A ∩ B) = P(A) × P(B|A).", icon: "⚡", color: "text-yellow-300" },
            { poin: "For 'at least one', use complement: 1 − P(none).", icon: "💡", color: "text-cyan-300" },
          ],
          tableHead: ["Event Type", "Condition", "Main Formula"],
          tableData: [
            ["Mutually Exclusive", "A ∩ B = ∅", "P(A∪B) = P(A) + P(B)"],
            ["Non-Mutually Exclusive", "A ∩ B ≠ ∅", "P(A∪B) = P(A) + P(B) − P(A∩B)"],
            ["Independent Events", "A & B independent", "P(A∩B) = P(A) × P(B)"],
            ["Conditional", "B has occurred", "P(A|B) = P(A∩B) / P(B)"],
          ],
          rangkumanJudul: "Summary — Compound Events Probability",
          rangkumanSubjudul: "Combining two or more events — three event types you must master!",
          rangkumanRingkasan: [
            {
              emoji: "🔵",
              judul: "Mutually Exclusive Events",
              isi: "A and B cannot occur simultaneously. A ∩ B = ∅. Union formula: P(A ∪ B) = P(A) + P(B). Example: getting an even OR odd number on one die.",
              bg: "bg-rose-900/50",
              border: "border-rose-500/40",
              textColor: "text-rose-200",
            },
            {
              emoji: "🟣",
              judul: "Non-Mutually Exclusive Events",
              isi: "A and B can occur simultaneously (there is an intersection). Formula: P(A ∪ B) = P(A) + P(B) − P(A ∩ B). Must subtract P(intersection) to avoid double-counting!",
              bg: "bg-pink-900/50",
              border: "border-pink-500/40",
              textColor: "text-pink-200",
            },
            {
              emoji: "🟢",
              judul: "Independent Events",
              isi: "Event A does not affect event B at all. Intersection formula: P(A ∩ B) = P(A) × P(B). Example: rolling a die and flipping a coin simultaneously.",
              bg: "bg-red-900/50",
              border: "border-red-500/40",
              textColor: "text-red-200",
            },
            {
              emoji: "📊",
              judul: "How to Identify the Type",
              isi: "Mutually exclusive: can they occur simultaneously? Independent: does A's outcome affect B? Check both before choosing the correct formula.",
              bg: "bg-orange-900/50",
              border: "border-orange-500/40",
              textColor: "text-orange-200",
            },
          ],
          rangkumanRumus: [
            { label: "Mutually Exclusive: P(A or B)", rumus: "P(A \\cup B) = P(A) + P(B)", bg: "bg-rose-900/60", border: "border-rose-400/40", labelColor: "text-rose-300" },
            { label: "Non-Mutually Exclusive: P(A or B)", rumus: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)", bg: "bg-pink-900/60", border: "border-pink-400/40", labelColor: "text-pink-300" },
          ],
          rangkumanTips: [
            { emoji: "🔑", teks: "Key identification: (1) Mutually exclusive: A ∩ B = ∅. (2) Non-mutually exclusive: A ∩ B ≠ ∅. (3) Independent: P(A|B) = P(A), meaning B does not change P(A)." },
            { emoji: "⚠️", teks: "Most common mistake: forgetting to subtract P(A ∩ B) for non-mutually exclusive events. Always draw a Venn diagram to help visualize!" },
            { emoji: "🎲", teks: "Independent ≠ Mutually Exclusive! Independent means no influence on each other. Mutually exclusive means cannot occur simultaneously. Two different concepts!" },
            { emoji: "💡", teks: "For two dice or two separate coin flips, always use the independence formula: P(A and B) = P(A) × P(B) because the outcomes do not affect each other." },
          ],
          rangkumanKesimpulan: "Compound events are at the heart of modern statistics — every real-world decision involves combining several events at once. From weather analysis (rain AND strong winds), stock predictions (up OR down), to medical diagnosis — they all use the principles of compound event probability!",
          backBtn: "← Back to Probability Menu",
        }
      : language === "ja"
      ? {
          title: "複合事象の確率",
          subtitle: "2つ以上の事象を1つの計算で組み合わせる",
          breadcrumb: "中学3年 · 確率 · 数学",
          typeBadges: [
            { label: "排反事象", color: "bg-blue-700/50 text-blue-200 border border-blue-500/40" },
            { label: "非排反事象", color: "bg-purple-700/50 text-purple-200 border border-purple-500/40" },
            { label: "独立事象", color: "bg-green-700/50 text-green-200 border border-green-500/40" },
            { label: "条件付き確率", color: "bg-orange-700/50 text-orange-200 border border-orange-500/40" },
          ],
          introTitle: "🌟 複合事象とは？",
          introText: (
            <>
              <strong className="text-cyan-300">複合事象</strong>とは、2つ以上の事象を組み合わせたものです。例えば、サイコロを振るとき「偶数<em>または</em>4より大きい数が出る確率は？」と問うことがあります — これは2つの事象を同時に扱っています。
            </>
          ),
          conceptMapTitle: "🗺️ 概念マップ — 複合事象",
          conceptMapItems: [
            { label: "和事象 (∪)", desc: "AまたはB", color: "bg-blue-900/40 border-blue-500/40 text-blue-300" },
            { label: "積事象 (∩)", desc: "AかつB", color: "bg-purple-900/40 border-purple-500/40 text-purple-300" },
            { label: "条件付き事象", desc: "A | B（BのもとでのA）", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
          ],
          termCards: [
            { term: "事象 A ∪ B", icon: "🔵", desc: "和事象：AまたはBまたは両方が起こる。", color: "bg-blue-900/40 border-blue-500/40 text-blue-300" },
            { term: "事象 A ∩ B", icon: "🟣", desc: "積事象：AとBが同時に起こる。", color: "bg-purple-900/40 border-purple-500/40 text-purple-300" },
            { term: "排反事象", icon: "↔️", desc: "AとBは同時に起こらない：A ∩ B = ∅。", color: "bg-sky-900/40 border-sky-500/40 text-sky-300" },
            { term: "独立事象", icon: "⚡", desc: "Aが起こってもBの確率は変わらない。", color: "bg-green-900/40 border-green-500/40 text-green-300" },
          ],
          sectionME: "🔵 排反事象（互いに排反）",
          meDesc: (
            <>
              2つの事象が<strong className="text-blue-300">排反</strong>であるとは、同時に起こり得ないことをいいます。つまり交わりが空集合：<InlineMath math="A \cap B = \emptyset" />。
            </>
          ),
          vennME: "📊 ベン図 — 排反事象",
          vennMECaption: "円AとBは重ならない → 排反",
          formulaME: "📐 公式 — 排反事象",
          formulaMENote: "A ∩ B = ∅ なので P(A ∩ B) = 0",
          formulaMECaption: "共通部分がないため引く必要はありません！",
          exampleMETitle: "🎲 例：サイコロを1回振る",
          exampleMEText: (
            <>
              A = 2の目 = <InlineMath math="\{2\}" />，B = 5の目 = <InlineMath math="\{5\}" />。
              <br />A ∩ B = ∅ → 排反 ✓
            </>
          ),
          sectionNME: "🟣 非排反事象",
          nmeDesc: (
            <>
              2つの事象が<strong className="text-purple-300">非排反</strong>であるとは、同時に起こり得ることをいいます。両方の事象に属する結果が存在します：<InlineMath math="A \cap B \neq \emptyset" />。
            </>
          ),
          vennNME: "📊 ベン図 — 非排反事象",
          vennNMECaption: "円AとBが重なる → 共通部分あり",
          formulaNME: "📐 加法定理（一般）",
          formulaNMENote: "共通部分が2回数えられるため、1回引く：",
          formulaNMETip: "💡 この公式はすべての場合に使えます！排反なら P(A ∩ B) = 0 なので P(A) + P(B) になります。",
          exampleNMETitle: "🃏 例：トランプ",
          exampleNMEText: "A = 赤いカード（26枚），B = エース（4枚），A ∩ B = 赤いエース（2枚）。",
          sectionInd: "🟢 独立事象",
          indDesc: "一方の事象が起こっても他方の確率に影響しない2つの事象を<strong>独立</strong>といいます。典型例：2枚のコインを別々に投げる。",
          indYes: "✅ 独立の例",
          indYesList: [
            "• コインを投げ、サイコロを振る",
            "• 2つのサイコロを同時に振る",
            "• 元に戻してボールを取り出す",
          ],
          indNo: "❌ 独立でない例",
          indNoList: [
            "• 元に戻さずボールを取り出す",
            "• 互いに影響し合う事象",
            "• 条件付き事象（A | B）",
          ],
          formulaInd: "📐 公式 — 乗法定理（独立事象）",
          formulaIndN: "n個の独立な事象の場合：",
          tableType: "種類",
          tableFormula: "P(A ∩ B) の公式",
          tableFeature: "特徴",
          tableRows: [
            ["独立", "P(A) × P(B)", "互いに影響しない"],
            ["従属", "P(A) × P(B|A)", "P(B)がAの影響を受ける"],
            ["排反", "0", "同時に起こらない"],
          ],
          sectionCond: "🟠 条件付き確率",
          condDesc: (
            <>
              <strong className="text-orange-300">条件付き確率</strong>とは、事象Bが起こった条件のもとで事象Aが起こる確率のことです。<InlineMath math="P(A|B)" /> と表します（「BのもとでのAの確率」と読む）。
            </>
          ),
          condAnalogyTitle: "🔑 日常の例え",
          condAnalogyText: "「熱心に勉強している<em>ことがわかっている</em>場合、その生徒がAをとる確率はどのくらいか？」— これが条件付き確率です。条件「熱心に勉強」により標本空間が絞られます。",
          formulaCond: "📐 公式 — 条件付き確率",
          formulaCondDerived: "派生 — 乗法定理（一般）：",
          exampleCondTitle: "🎴 例：トランプ",
          exampleCondText: "52枚のトランプから1枚ずつ元に戻さずに取り出す。1枚目がエースのとき、2枚目がエースである確率を求めよ。",
          exampleCondNote: "エース1枚を取り出した後、残り51枚にエース3枚：",
          sectionEx: "📝 例題と解説",
          soal1Badge: "基本",
          soal1BadgeColor: "bg-green-700/60 text-green-200",
          soal1Title: "問題1 — 排反事象",
          soal1Q: "サイコロを1回振る。2または5の目が出る確率を求めよ。",
          soal1Answer: "✅ 解答",
          soal1Steps: [
            <>• A = 2の目 = <InlineMath math="\{2\}" />，<InlineMath math="P(A) = \frac{1}{6}" /></>,
            <>• B = 5の目 = <InlineMath math="\{5\}" />，<InlineMath math="P(B) = \frac{1}{6}" /></>,
            <>• A ∩ B = ∅（2と5が同時に出ることはない）→ <strong>排反事象</strong></>,
          ],
          soal1Key: <>🔑 2または5の目が出る確率は <InlineMath math="\frac{1}{3}" />。</>,
          soal2Badge: "標準",
          soal2BadgeColor: "bg-yellow-700/60 text-yellow-200",
          soal2Title: "問題2 — 非排反事象",
          soal2Q: "52枚のトランプから1枚無作為に取り出す。赤いカードまたは絵札（J・Q・K）を引く確率を求めよ。",
          soal2Answer: "✅ 解答",
          soal2Steps: [
            <><InlineMath math="n(S) = 52" /></>,
            <>• A = 赤いカード：<InlineMath math="n(A) = 26" />，<InlineMath math="P(A) = \frac{26}{52} = \frac{1}{2}" /></>,
            <>• B = 絵札（J・Q・K）：<InlineMath math="n(B) = 12" />，<InlineMath math="P(B) = \frac{12}{52} = \frac{3}{13}" /></>,
            <>• A ∩ B = 赤い絵札（J♥・Q♥・K♥・J♦・Q♦・K♦）：<InlineMath math="n(A \cap B) = 6" /></>,
            <>• <InlineMath math="P(A \cap B) = \frac{6}{52} = \frac{3}{26}" /></>,
          ],
          soal2Note: <>A ∩ B ≠ ∅ なので<strong className="text-yellow-300">非排反事象</strong>。加法定理（一般）を使う：</>,
          soal2Key: <>💡 赤いカードまたは絵札を引く確率は <InlineMath math="\frac{8}{13}" />。</>,
          soal3Badge: "発展",
          soal3BadgeColor: "bg-red-700/60 text-red-200",
          soal3Title: "問題3 — 独立事象と条件付き確率",
          soal3Q: (
            <>
              箱に赤いボール5個と青いボール3個が入っている。<strong>元に戻さず</strong>1個ずつ取り出す。次の確率を求めよ。
              <br />a. 両方赤
              <br />b. 1個目が赤、2個目が青
              <br />c. 少なくとも1個赤
            </>
          ),
          soal3Answer: "✅ 解答",
          soal3Setup: [
            "• 箱：赤5個＋青3個＝合計8個",
            <>• 元に戻さない取り出し → <strong className="text-orange-300">従属事象</strong></>,
          ],
          soal3aTitle: "a. P(両方赤)",
          soal3aNote: (
            <><InlineMath math="P(R_1) = \frac{5}{8}" />，1個目の赤を取り出した後：<InlineMath math="P(R_2|R_1) = \frac{4}{7}" /></>
          ),
          soal3bTitle: "b. P(1個目赤、2個目青)",
          soal3bNote: (
            <><InlineMath math="P(R_1) = \frac{5}{8}" />，1個目の赤を取り出した後：<InlineMath math="P(B_2|R_1) = \frac{3}{7}" /></>
          ),
          soal3cTitle: "c. P(少なくとも1個赤) — 余事象を使う！",
          soal3cNote: "余事象：「赤がまったくない」＝両方青：",
          soal3Warning: [
            "• 「元に戻さない」→ 従属事象 → 条件付き乗法定理を使う。",
            "• 「少なくとも1個」は余事象の戦略が断然速い！",
            "• 確認：a＋b＋（BB）＝5/14＋15/56＋3/28＝20/56＋15/56＋6/56＝41/56≠1（a・b・BBがすべての場合ではないため — 青→赤もある）。確認：P(青→赤)＝3/8×5/7＝15/56。合計：20＋15＋15＋6＝56/56＝1 ✓",
          ],
          sectionSummary: "📋 まとめ",
          summaryPoints: [
            { poin: "排反事象：A ∩ B = ∅ なので P(A ∪ B) = P(A) + P(B)。", icon: "🔵", color: "text-blue-300" },
            { poin: "非排反事象：P(A ∪ B) = P(A) + P(B) − P(A ∩ B)。", icon: "🟣", color: "text-purple-300" },
            { poin: "独立事象：P(A ∩ B) = P(A) × P(B)。", icon: "🟢", color: "text-green-300" },
            { poin: "条件付き確率：P(A|B) = P(A ∩ B) / P(B)。", icon: "🟠", color: "text-orange-300" },
            { poin: "乗法定理（一般）：P(A ∩ B) = P(A) × P(B|A)。", icon: "⚡", color: "text-yellow-300" },
            { poin: "「少なくとも1個」には余事象：1 − P(1つもない)。", icon: "💡", color: "text-cyan-300" },
          ],
          tableHead: ["事象の種類", "条件", "主要公式"],
          tableData: [
            ["排反事象", "A ∩ B = ∅", "P(A∪B) = P(A) + P(B)"],
            ["非排反事象", "A ∩ B ≠ ∅", "P(A∪B) = P(A) + P(B) − P(A∩B)"],
            ["独立事象", "A・B独立", "P(A∩B) = P(A) × P(B)"],
            ["条件付き", "Bが起こった", "P(A|B) = P(A∩B) / P(B)"],
          ],
          rangkumanJudul: "まとめ — 複合事象の確率",
          rangkumanSubjudul: "2つ以上の事象を組み合わせる — 必ず習得すべき3種類の事象！",
          rangkumanRingkasan: [
            {
              emoji: "🔵",
              judul: "排反事象（互いに排反）",
              isi: "AとBは同時に起こらない。A ∩ B = ∅。和の公式：P(A ∪ B) = P(A) + P(B)。例：サイコロで偶数または奇数の目が出る。",
              bg: "bg-rose-900/50",
              border: "border-rose-500/40",
              textColor: "text-rose-200",
            },
            {
              emoji: "🟣",
              judul: "非排反事象",
              isi: "AとBが同時に起こり得る（交わりがある）。公式：P(A ∪ B) = P(A) + P(B) − P(A ∩ B)。二重計算を避けるためP(交わり)を引く！",
              bg: "bg-pink-900/50",
              border: "border-pink-500/40",
              textColor: "text-pink-200",
            },
            {
              emoji: "🟢",
              judul: "独立事象",
              isi: "事象Aは事象Bにまったく影響しない。積の公式：P(A ∩ B) = P(A) × P(B)。例：サイコロとコインを同時に投げる。",
              bg: "bg-red-900/50",
              border: "border-red-500/40",
              textColor: "text-red-200",
            },
            {
              emoji: "📊",
              judul: "種類の見分け方",
              isi: "排反か？同時に起こり得るか？独立か？Aの結果はBに影響するか？正しい公式を選ぶ前に必ず両方を確認しよう。",
              bg: "bg-orange-900/50",
              border: "border-orange-500/40",
              textColor: "text-orange-200",
            },
          ],
          rangkumanRumus: [
            { label: "排反事象：P(AまたはB)", rumus: "P(A \\cup B) = P(A) + P(B)", bg: "bg-rose-900/60", border: "border-rose-400/40", labelColor: "text-rose-300" },
            { label: "非排反事象：P(AまたはB)", rumus: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)", bg: "bg-pink-900/60", border: "border-pink-400/40", labelColor: "text-pink-300" },
          ],
          rangkumanTips: [
            { emoji: "🔑", teks: "見分け方：(1) 排反：A ∩ B = ∅。(2) 非排反：A ∩ B ≠ ∅。(3) 独立：P(A|B) = P(A)、つまりBはP(A)を変えない。" },
            { emoji: "⚠️", teks: "最も多い間違い：非排反のとき P(A ∩ B) を引き忘れること。ベン図を描いて可視化しよう！" },
            { emoji: "🎲", teks: "独立 ≠ 排反！独立は互いに影響しないこと。排反は同時に起こらないこと。まったく別の概念！" },
            { emoji: "💡", teks: "2つのサイコロや2枚のコインを別々に投げる場合は、必ず独立の公式：P(AかつB) = P(A) × P(B)。" },
          ],
          rangkumanKesimpulan: "複合事象は現代統計の核心です — 現実世界のあらゆる意思決定は、複数の事象の組み合わせを伴います。天気予報（雨かつ強風）、株価予測（上昇または下落）、医学的診断まで — すべてが複合事象の確率の原理を使っています！",
          backBtn: "← 確率メニューに戻る",
        }
      : /* id (default) */ {
          title: "PELUANG KEJADIAN MAJEMUK",
          subtitle: "Menggabungkan Dua Kejadian atau Lebih dalam Satu Perhitungan",
          breadcrumb: "Kelas 9 · Peluang · Materi Matematika",
          typeBadges: [
            { label: "Saling Lepas", color: "bg-blue-700/50 text-blue-200 border border-blue-500/40" },
            { label: "Tidak Saling Lepas", color: "bg-purple-700/50 text-purple-200 border border-purple-500/40" },
            { label: "Saling Bebas", color: "bg-green-700/50 text-green-200 border border-green-500/40" },
            { label: "Bersyarat", color: "bg-orange-700/50 text-orange-200 border border-orange-500/40" },
          ],
          introTitle: "🌟 Apa Itu Kejadian Majemuk?",
          introText: (
            <>
              <strong className="text-cyan-300">Kejadian majemuk</strong> adalah gabungan dari dua kejadian atau lebih. Misalnya, saat melempar dadu, kita bisa menanyakan: "Berapa peluang muncul angka genap <em>atau</em> angka lebih dari 4?" — ini melibatkan dua kejadian sekaligus.
            </>
          ),
          conceptMapTitle: "🗺️ Peta Konsep Kejadian Majemuk",
          conceptMapItems: [
            { label: "Operasi Gabungan (∪)", desc: "A atau B", color: "bg-blue-900/40 border-blue-500/40 text-blue-300" },
            { label: "Operasi Irisan (∩)", desc: "A dan B", color: "bg-purple-900/40 border-purple-500/40 text-purple-300" },
            { label: "Kejadian Bersyarat", desc: "A | B (A jika B terjadi)", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
          ],
          termCards: [
            { term: "Kejadian A ∪ B", icon: "🔵", desc: "Gabungan: A terjadi, B terjadi, atau keduanya terjadi.", color: "bg-blue-900/40 border-blue-500/40 text-blue-300" },
            { term: "Kejadian A ∩ B", icon: "🟣", desc: "Irisan: A dan B keduanya terjadi secara bersamaan.", color: "bg-purple-900/40 border-purple-500/40 text-purple-300" },
            { term: "Saling Lepas", icon: "↔️", desc: "A dan B tidak bisa terjadi bersamaan: A ∩ B = ∅.", color: "bg-sky-900/40 border-sky-500/40 text-sky-300" },
            { term: "Saling Bebas", icon: "⚡", desc: "Terjadinya A tidak mempengaruhi peluang terjadinya B.", color: "bg-green-900/40 border-green-500/40 text-green-300" },
          ],
          sectionME: "🔵 Kejadian Saling Lepas (Mutually Exclusive)",
          meDesc: (
            <>
              Dua kejadian disebut <strong className="text-blue-300">saling lepas</strong> jika tidak mungkin keduanya terjadi pada saat yang sama. Artinya irisan keduanya kosong: <InlineMath math="A \cap B = \emptyset" />.
            </>
          ),
          vennME: "📊 Diagram Venn – Saling Lepas",
          vennMECaption: "Lingkaran A dan B tidak berpotongan → saling lepas",
          formulaME: "📐 Rumus – Kejadian Saling Lepas",
          formulaMENote: "Karena A ∩ B = ∅, maka P(A ∩ B) = 0",
          formulaMECaption: "Tidak perlu dikurangi irisan karena tidak ada anggota yang sama!",
          exampleMETitle: "🎲 Contoh: Dadu Satu Kali",
          exampleMEText: (
            <>
              A = muncul angka 2 = <InlineMath math="\{2\}" />, B = muncul angka 5 = <InlineMath math="\{5\}" />.
              <br />A ∩ B = ∅ → saling lepas ✓
            </>
          ),
          sectionNME: "🟣 Kejadian Tidak Saling Lepas (Non-Mutually Exclusive)",
          nmeDesc: (
            <>
              Dua kejadian disebut <strong className="text-purple-300">tidak saling lepas</strong> jika bisa terjadi bersamaan. Ada anggota yang merupakan bagian dari kedua kejadian sekaligus: <InlineMath math="A \cap B \neq \emptyset" />.
            </>
          ),
          vennNME: "📊 Diagram Venn – Tidak Saling Lepas",
          vennNMECaption: "Lingkaran A dan B berpotongan → ada irisan",
          formulaNME: "📐 Rumus Umum Peluang Gabungan (Aturan Penjumlahan)",
          formulaNMENote: "Anggota irisan dihitung dua kali, jadi harus dikurangi sekali:",
          formulaNMETip: "💡 Rumus ini berlaku untuk SEMUA kasus! Jika saling lepas, P(A ∩ B) = 0, sehingga rumus menjadi P(A) + P(B).",
          exampleNMETitle: "🃏 Contoh: Kartu Bridge",
          exampleNMEText: "A = kartu merah (26 kartu), B = kartu As (4 kartu), A ∩ B = As merah (2 kartu).",
          sectionInd: "🟢 Kejadian Saling Bebas (Independent Events)",
          indDesc: "Dua kejadian disebut <strong>saling bebas</strong> jika terjadinya salah satu kejadian tidak mempengaruhi peluang kejadian lainnya. Contoh klasik: melempar dua koin secara terpisah.",
          indYes: "✅ Contoh Saling Bebas",
          indYesList: [
            "• Melempar koin dan melempar dadu",
            "• Melempar dua dadu secara bersamaan",
            "• Mengambil bola dengan pengembalian",
          ],
          indNo: "❌ Bukan Saling Bebas",
          indNoList: [
            "• Mengambil bola tanpa pengembalian",
            "• Peristiwa yang saling mempengaruhi",
            "• Kejadian bersyarat (A | B)",
          ],
          formulaInd: "📐 Rumus – Aturan Perkalian (Kejadian Saling Bebas)",
          formulaIndN: "Untuk n kejadian saling bebas:",
          tableType: "Jenis",
          tableFormula: "Rumus P(A ∩ B)",
          tableFeature: "Ciri Khas",
          tableRows: [
            ["Saling Bebas", "P(A) × P(B)", "Kejadian tidak saling pengaruhi"],
            ["Tidak Saling Bebas", "P(A) × P(B|A)", "Peluang B dipengaruhi A"],
            ["Saling Lepas", "0", "Tidak bisa terjadi bersamaan"],
          ],
          sectionCond: "🟠 Peluang Kejadian Bersyarat (Conditional Probability)",
          condDesc: (
            <>
              <strong className="text-orange-300">Peluang bersyarat</strong> adalah peluang terjadinya kejadian A dengan syarat bahwa kejadian B sudah terjadi. Ditulis <InlineMath math="P(A|B)" /> (dibaca: "peluang A diketahui B").
            </>
          ),
          condAnalogyTitle: "🔑 Analogi Sehari-hari",
          condAnalogyText: "\"Berapa peluang seorang siswa mendapat nilai A, <em>jika diketahui</em> siswa tersebut rajin belajar?\" — Ini adalah peluang bersyarat. Syarat \"rajin belajar\" mempersempit ruang sampel yang kita pertimbangkan.",
          formulaCond: "📐 Rumus – Peluang Bersyarat",
          formulaCondDerived: "Turunannya – Aturan Perkalian Umum:",
          exampleCondTitle: "🎴 Contoh: Kartu Bridge",
          exampleCondText: "Dari setumpuk kartu bridge (52 kartu), sebuah kartu diambil tanpa dikembalikan. Tentukan peluang kartu kedua adalah As, jika kartu pertama adalah As.",
          exampleCondNote: "Setelah 1 kartu As diambil, tersisa 51 kartu dan 3 kartu As:",
          sectionEx: "📝 Contoh Soal & Pembahasan",
          soal1Badge: "MUDAH",
          soal1BadgeColor: "bg-green-700/60 text-green-200",
          soal1Title: "Soal 1 – Kejadian Saling Lepas",
          soal1Q: "Sebuah dadu dilempar sekali. Tentukan peluang muncul angka 2 atau angka 5!",
          soal1Answer: "✅ Pembahasan",
          soal1Steps: [
            <>• A = muncul angka 2 = <InlineMath math="\{2\}" />, sehingga <InlineMath math="P(A) = \frac{1}{6}" /></>,
            <>• B = muncul angka 5 = <InlineMath math="\{5\}" />, sehingga <InlineMath math="P(B) = \frac{1}{6}" /></>,
            <>• A ∩ B = ∅ (tidak mungkin muncul 2 dan 5 sekaligus) → <strong>Saling Lepas</strong></>,
          ],
          soal1Key: <>🔑 Peluang muncul angka 2 atau 5 adalah <InlineMath math="\frac{1}{3}" />.</>,
          soal2Badge: "SEDANG",
          soal2BadgeColor: "bg-yellow-700/60 text-yellow-200",
          soal2Title: "Soal 2 – Tidak Saling Lepas",
          soal2Q: "Dari setumpuk kartu bridge (52 kartu), sebuah kartu diambil secara acak. Tentukan peluang terambil kartu merah atau kartu bergambar (J, Q, K)!",
          soal2Answer: "✅ Pembahasan",
          soal2Steps: [
            <><InlineMath math="n(S) = 52" /></>,
            <>• A = kartu merah: <InlineMath math="n(A) = 26" />, maka <InlineMath math="P(A) = \frac{26}{52} = \frac{1}{2}" /></>,
            <>• B = kartu bergambar (J, Q, K): <InlineMath math="n(B) = 12" />, maka <InlineMath math="P(B) = \frac{12}{52} = \frac{3}{13}" /></>,
            <>• A ∩ B = kartu bergambar merah (J♥, Q♥, K♥, J♦, Q♦, K♦): <InlineMath math="n(A \cap B) = 6" /></>,
            <>• <InlineMath math="P(A \cap B) = \frac{6}{52} = \frac{3}{26}" /></>,
          ],
          soal2Note: <>A ∩ B ≠ ∅, jadi <strong className="text-yellow-300">tidak saling lepas</strong>. Gunakan aturan penjumlahan umum:</>,
          soal2Key: <>💡 Peluang terambil kartu merah atau bergambar adalah <InlineMath math="\frac{8}{13}" />.</>,
          soal3Badge: "SULIT",
          soal3BadgeColor: "bg-red-700/60 text-red-200",
          soal3Title: "Soal 3 – Saling Bebas & Bersyarat",
          soal3Q: (
            <>
              Sebuah kotak berisi 5 bola merah dan 3 bola biru. Dua bola diambil satu per satu <strong>tanpa pengembalian</strong>. Tentukan peluang:
              <br />a. Kedua bola merah
              <br />b. Bola pertama merah dan bola kedua biru
              <br />c. Setidaknya satu bola merah
            </>
          ),
          soal3Answer: "✅ Pembahasan",
          soal3Setup: [
            "• Kotak: 5 merah + 3 biru = 8 bola total",
            <>• Pengambilan tanpa pengembalian → <strong className="text-orange-300">kejadian tidak saling bebas</strong></>,
          ],
          soal3aTitle: "a. P(keduanya merah)",
          soal3aNote: (
            <><InlineMath math="P(M_1) = \frac{5}{8}" />, setelah 1 merah diambil: <InlineMath math="P(M_2|M_1) = \frac{4}{7}" /></>
          ),
          soal3bTitle: "b. P(pertama merah, kedua biru)",
          soal3bNote: (
            <><InlineMath math="P(M_1) = \frac{5}{8}" />, setelah 1 merah diambil: <InlineMath math="P(B_2|M_1) = \frac{3}{7}" /></>
          ),
          soal3cTitle: "c. P(setidaknya 1 merah) — Gunakan komplemen!",
          soal3cNote: "Komplemen: \"tidak ada yang merah\" = keduanya biru:",
          soal3Warning: [
            "• \"Tanpa pengembalian\" → kejadian tidak saling bebas → gunakan aturan perkalian bersyarat.",
            "• Untuk \"setidaknya satu\", selalu pertimbangkan strategi komplemen — jauh lebih cepat!",
            "• Periksa: a + b + (BB) = 5/14 + 15/56 + 3/28 = 20/56 + 15/56 + 6/56 = 41/56 ≠ 1 (karena a, b, BB bukan semua kemungkinan — ada juga biru-merah). Konfirmasi: P(biru-merah) = 3/8 × 5/7 = 15/56. Total: 20+15+15+6 = 56/56 = 1 ✓",
          ],
          sectionSummary: "📋 Rangkuman",
          summaryPoints: [
            { poin: "Kejadian Saling Lepas: A ∩ B = ∅, sehingga P(A ∪ B) = P(A) + P(B).", icon: "🔵", color: "text-blue-300" },
            { poin: "Kejadian Tidak Saling Lepas: P(A ∪ B) = P(A) + P(B) − P(A ∩ B).", icon: "🟣", color: "text-purple-300" },
            { poin: "Kejadian Saling Bebas: P(A ∩ B) = P(A) × P(B).", icon: "🟢", color: "text-green-300" },
            { poin: "Peluang Bersyarat: P(A|B) = P(A ∩ B) / P(B).", icon: "🟠", color: "text-orange-300" },
            { poin: "Aturan perkalian umum: P(A ∩ B) = P(A) × P(B|A).", icon: "⚡", color: "text-yellow-300" },
            { poin: "Untuk 'setidaknya satu', gunakan strategi komplemen: 1 − P(tidak satupun).", icon: "💡", color: "text-cyan-300" },
          ],
          tableHead: ["Jenis Kejadian", "Syarat", "Rumus Utama"],
          tableData: [
            ["Saling Lepas", "A ∩ B = ∅", "P(A∪B) = P(A) + P(B)"],
            ["Tidak Saling Lepas", "A ∩ B ≠ ∅", "P(A∪B) = P(A) + P(B) − P(A∩B)"],
            ["Saling Bebas", "A & B independen", "P(A∩B) = P(A) × P(B)"],
            ["Bersyarat", "B sudah terjadi", "P(A|B) = P(A∩B) / P(B)"],
          ],
          rangkumanJudul: "Rangkuman — Peluang Kejadian Majemuk",
          rangkumanSubjudul: "Menggabungkan dua kejadian atau lebih — tiga jenis hubungan yang wajib dikuasai!",
          rangkumanRingkasan: [
            {
              emoji: "🔵",
              judul: "Saling Lepas (Mutually Exclusive)",
              isi: "A dan B tidak bisa terjadi bersamaan. A irisan B = kosong. Rumus gabungan: P(A U B) = P(A) + P(B). Contoh: muncul angka genap ATAU ganjil pada satu dadu.",
              bg: "bg-rose-900/50",
              border: "border-rose-500/40",
              textColor: "text-rose-200",
            },
            {
              emoji: "🟣",
              judul: "Tidak Saling Lepas",
              isi: "A dan B bisa terjadi bersamaan (ada irisan). Rumus: P(A U B) = P(A) + P(B) - P(A irisan B). Harus dikurangi P(irisan) agar tidak dihitung dua kali!",
              bg: "bg-pink-900/50",
              border: "border-pink-500/40",
              textColor: "text-pink-200",
            },
            {
              emoji: "🟢",
              judul: "Saling Bebas (Independent)",
              isi: "Kejadian A tidak mempengaruhi kejadian B sama sekali. Rumus irisan: P(A irisan B) = P(A) x P(B). Contoh: melempar dadu dan koin secara bersamaan.",
              bg: "bg-red-900/50",
              border: "border-red-500/40",
              textColor: "text-red-200",
            },
            {
              emoji: "📊",
              judul: "Cara Identifikasi Jenisnya",
              isi: "Saling lepas: apakah bisa terjadi bersamaan? Saling bebas: apakah hasil A mempengaruhi B? Cek keduanya sebelum memilih rumus yang tepat.",
              bg: "bg-orange-900/50",
              border: "border-orange-500/40",
              textColor: "text-orange-200",
            },
          ],
          rangkumanRumus: [
            { label: "Saling Lepas: P(A atau B)", rumus: "P(A \\cup B) = P(A) + P(B)", bg: "bg-rose-900/60", border: "border-rose-400/40", labelColor: "text-rose-300" },
            { label: "Tidak Saling Lepas: P(A atau B)", rumus: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)", bg: "bg-pink-900/60", border: "border-pink-400/40", labelColor: "text-pink-300" },
          ],
          rangkumanTips: [
            { emoji: "🔑", teks: "Kunci identifikasi: (1) Saling lepas: A irisan B = kosong. (2) Tidak saling lepas: A irisan B tidak kosong. (3) Saling bebas: P(A|B) = P(A), artinya B tidak mengubah peluang A." },
            { emoji: "⚠️", teks: "Kesalahan paling umum: lupa mengurangi P(A irisan B) pada kejadian tidak saling lepas. Selalu gambar diagram Venn untuk membantu visualisasi!" },
            { emoji: "🎲", teks: "Saling bebas =/= saling lepas! Saling bebas berarti tidak saling mempengaruhi. Saling lepas berarti tidak bisa terjadi bersamaan. Dua konsep yang berbeda!" },
            { emoji: "💡", teks: "Untuk dua dadu atau dua lemparan koin yang terpisah, selalu gunakan rumus saling bebas: P(A dan B) = P(A) x P(B) karena hasilnya tidak saling mempengaruhi." },
          ],
          rangkumanKesimpulan: "Kejadian majemuk adalah inti dari statistika modern — setiap keputusan di dunia nyata melibatkan kombinasi beberapa kejadian sekaligus. Dari analisis cuaca (hujan DAN angin kencang), prediksi saham (naik ATAU turun), hingga diagnosis medis — semuanya menggunakan prinsip peluang kejadian majemuk!",
          backBtn: "← Kembali ke Menu Peluang",
        };

  const SectionHeader = ({
    id, icon, iconColor, title,
  }: { id: string; icon: React.ReactNode; iconColor?: string; title: string }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      {expandedSections.includes(id)
        ? <ChevronUp className="w-5 h-5 text-primary" />
        : <ChevronDown className="w-5 h-5 text-primary" />}
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold font-body ${color}`}>{label}</span>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden overflow-y-auto">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 pt-20 pb-12">

        {/* ── HEADER ── */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Layers className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
            {t.title}
          </h1>
          <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
            {t.subtitle}
          </p>
          <p className="text-white/50 text-xs text-center mb-4 font-body">
            {t.breadcrumb}
          </p>

          {/* ── TYPE BADGES ── */}
          <div className="flex flex-wrap gap-2 justify-center">
            {t.typeBadges.map(({ label, color }) => (
              <span key={label} className={`text-xs font-body font-semibold px-3 py-1 rounded-full ${color}`}>{label}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── INTRO ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.introTitle} />
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.introText}</p>

                {/* Concept Map */}
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-wide text-center mb-4">{t.conceptMapTitle}</p>
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-cyan-900/40 border border-cyan-500/50 rounded-lg px-6 py-2">
                      <p className="font-display font-bold text-cyan-200 text-sm text-center">
                        {language === "en" ? "Compound Events" : language === "ja" ? "複合事象" : "Kejadian Majemuk"}
                      </p>
                    </div>
                    <div className="flex gap-2 text-white/30 text-lg">↙ ↓ ↘</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                      {t.conceptMapItems.map(({ label, desc, color }) => (
                        <div key={label} className={`border ${color} rounded-lg p-3 text-center`}>
                          <p className="font-display font-bold text-xs">{label}</p>
                          <p className="font-body text-xs text-white/60 mt-1">{desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {t.termCards.map(({ term, icon, desc, color }) => (
                    <div key={term} className={`border ${color} rounded-xl p-3`}>
                      <p className="font-display text-sm font-bold mb-1">{icon} {term}</p>
                      <p className="font-body text-xs text-white/70 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── MUTUALLY EXCLUSIVE ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="saling-lepas" icon={<GitBranch className="w-5 h-5" />} iconColor="text-blue-400" title={t.sectionME} />
            {expandedSections.includes("saling-lepas") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.meDesc}</p>

                {/* Venn Diagram */}
                <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-blue-300 uppercase tracking-wide text-center mb-3">{t.vennME}</p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-24 h-24 rounded-full border-2 border-blue-400/70 bg-blue-900/40 flex items-center justify-center">
                      <span className="font-display font-bold text-blue-300 text-xl">A</span>
                    </div>
                    <div className="text-white/40 text-2xl font-bold">∅</div>
                    <div className="w-24 h-24 rounded-full border-2 border-purple-400/70 bg-purple-900/40 flex items-center justify-center">
                      <span className="font-display font-bold text-purple-300 text-xl">B</span>
                    </div>
                  </div>
                  <p className="font-body text-xs text-center text-white/50 mt-2">{t.vennMECaption}</p>
                </div>

                {/* Formula */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-blue-300 uppercase tracking-wide">📐 {t.formulaME}</p>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="font-body text-xs text-white/60 mb-1">{t.formulaMENote}</p>
                    <BlockMath math="P(A \cup B) = P(A) + P(B)" />
                  </div>
                  <p className="font-body text-xs text-center text-white/50">{t.formulaMECaption}</p>
                </div>

                {/* Example */}
                <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-white">{t.exampleMETitle}</p>
                  <p className="font-body text-sm text-white/80">{t.exampleMEText}</p>
                  <BlockMath math="P(A \cup B) = \frac{1}{6} + \frac{1}{6} = \frac{2}{6} = \frac{1}{3}" />
                </div>
              </div>
            )}
          </div>

          {/* ── NON-MUTUALLY EXCLUSIVE ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="tidak-saling-lepas" icon={<GitMerge className="w-5 h-5" />} iconColor="text-purple-400" title={t.sectionNME} />
            {expandedSections.includes("tidak-saling-lepas") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.nmeDesc}</p>

                {/* Venn Diagram */}
                <div className="bg-slate-800/60 border border-purple-500/20 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-purple-300 uppercase tracking-wide text-center mb-3">{t.vennNME}</p>
                  <div className="flex items-center justify-center">
                    <div className="relative w-52 h-28 flex items-center justify-center">
                      <div className="absolute left-4 w-28 h-24 rounded-full border-2 border-blue-400/70 bg-blue-900/40 flex items-center">
                        <span className="font-display font-bold text-blue-300 text-lg ml-4">A</span>
                      </div>
                      <div className="absolute right-4 w-28 h-24 rounded-full border-2 border-purple-400/70 bg-purple-900/40 flex items-end justify-end">
                        <span className="font-display font-bold text-purple-300 text-lg mr-4 mb-2">B</span>
                      </div>
                      <div className="relative z-10 bg-indigo-600/60 rounded-full w-10 h-14 border border-indigo-400/60 flex items-center justify-center">
                        <span className="font-display font-bold text-white text-xs">A∩B</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-body text-xs text-center text-white/50 mt-2">{t.vennNMECaption}</p>
                </div>

                {/* Formula */}
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-purple-300 uppercase tracking-wide">📐 {t.formulaNME}</p>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="font-body text-xs text-white/60 mb-1">{t.formulaNMENote}</p>
                    <BlockMath math="P(A \cup B) = P(A) + P(B) - P(A \cap B)" />
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                    <p className="font-body text-xs text-yellow-300">{t.formulaNMETip}</p>
                  </div>
                </div>

                {/* Example */}
                <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-white">{t.exampleNMETitle}</p>
                  <p className="font-body text-sm text-white/80">{t.exampleNMEText}</p>
                  <BlockMath math="P(A \cup B) = \frac{26}{52} + \frac{4}{52} - \frac{2}{52} = \frac{28}{52} = \frac{7}{13}" />
                </div>
              </div>
            )}
          </div>

          {/* ── INDEPENDENT EVENTS ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="saling-bebas" icon={<Layers className="w-5 h-5" />} iconColor="text-green-400" title={t.sectionInd} />
            {expandedSections.includes("saling-bebas") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: t.indDesc }} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-3">
                    <p className="font-display text-sm font-bold text-green-300 mb-2">{t.indYes}</p>
                    <ul className="font-body text-xs text-white/70 space-y-1">
                      {t.indYesList.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                  <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3">
                    <p className="font-display text-sm font-bold text-red-300 mb-2">{t.indNo}</p>
                    <ul className="font-body text-xs text-white/70 space-y-1">
                      {t.indNoList.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Formula */}
                <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-green-300 uppercase tracking-wide">{t.formulaInd}</p>
                  <div className="bg-black/20 rounded-lg p-3">
                    <BlockMath math="P(A \cap B) = P(A) \times P(B)" />
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="font-body text-xs text-white/60 mb-1">{t.formulaIndN}</p>
                    <BlockMath math="P(A_1 \cap A_2 \cap \cdots \cap A_n) = P(A_1) \times P(A_2) \times \cdots \times P(A_n)" />
                  </div>
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-green-900/50">
                        <th className="border border-green-500/30 px-3 py-2 text-green-200 text-left">{t.tableType}</th>
                        <th className="border border-green-500/30 px-3 py-2 text-green-200 text-center">{t.tableFormula}</th>
                        <th className="border border-green-500/30 px-3 py-2 text-green-200 text-center">{t.tableFeature}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.tableRows.map(([jenis, rumus, ciri], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-200 font-semibold">{jenis}</td>
                          <td className="border border-white/10 px-3 py-2 text-center text-green-300">{rumus}</td>
                          <td className="border border-white/10 px-3 py-2 text-white/60">{ciri}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ── CONDITIONAL PROBABILITY ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="bersyarat" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400" title={t.sectionCond} />
            {expandedSections.includes("bersyarat") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.condDesc}</p>

                <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
                  <p className="font-body text-xs font-bold text-orange-300 uppercase tracking-wide mb-2">{t.condAnalogyTitle}</p>
                  <p className="font-body text-sm text-white/80" dangerouslySetInnerHTML={{ __html: t.condAnalogyText }} />
                </div>

                {/* Formula */}
                <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-orange-300 uppercase tracking-wide">📐 {t.formulaCond}</p>
                  <div className="bg-black/20 rounded-lg p-3">
                    <BlockMath math="P(A|B) = \frac{P(A \cap B)}{P(B)}, \quad P(B) \neq 0" />
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="font-body text-xs text-white/60 mb-1">{t.formulaCondDerived}</p>
                    <BlockMath math="P(A \cap B) = P(B) \times P(A|B) = P(A) \times P(B|A)" />
                  </div>
                </div>

                {/* Example */}
                <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 space-y-2">
                  <p className="font-body text-sm font-bold text-white">{t.exampleCondTitle}</p>
                  <p className="font-body text-sm text-white/80">{t.exampleCondText}</p>
                  <div className="bg-slate-900/60 border border-orange-500/20 rounded-lg p-3 space-y-2">
                    <p className="font-body text-xs text-white/60">{t.exampleCondNote}</p>
                    <BlockMath math={`P(\\mathrm{${kAce}}_2 | \\mathrm{${kAce}}_1) = \\frac{3}{51} = \\frac{1}{17}`} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── WORKED EXAMPLES ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<BookOpen className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sectionEx} />
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-6">

                {/* PROBLEM 1 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.soal1Badge} color={t.soal1BadgeColor} />
                    <p className="font-body text-sm font-semibold text-white">{t.soal1Title}</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">{t.soal1Q}</p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">{t.soal1Answer}</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                      {t.soal1Steps.map((step, i) => <p key={i}>{step}</p>)}
                    </div>
                    <BlockMath math="P(A \cup B) = P(A) + P(B) = \frac{1}{6} + \frac{1}{6} = \frac{2}{6} = \frac{1}{3}" />
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">{t.soal1Key}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* PROBLEM 2 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.soal2Badge} color={t.soal2BadgeColor} />
                    <p className="font-body text-sm font-semibold text-white">{t.soal2Title}</p>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">{t.soal2Q}</p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">{t.soal2Answer}</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                      {t.soal2Steps.map((step, i) => <p key={i}>{step}</p>)}
                    </div>
                    <p className="font-body text-sm text-white/80">{t.soal2Note}</p>
                    <BlockMath math="P(A \cup B) = \frac{26}{52} + \frac{12}{52} - \frac{6}{52} = \frac{32}{52} = \frac{8}{13}" />
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">{t.soal2Key}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* PROBLEM 3 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.soal3Badge} color={t.soal3BadgeColor} />
                    <p className="font-body text-sm font-semibold text-white">{t.soal3Title}</p>
                  </div>
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">{t.soal3Q}</p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-4">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">{t.soal3Answer}</p>
                    <div className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm font-body text-white/80 space-y-1">
                      {t.soal3Setup.map((s, i) => <p key={i}>{s}</p>)}
                    </div>

                    {/* Part a */}
                    <div>
                      <p className="font-body text-sm font-semibold text-white mb-2">{t.soal3aTitle}</p>
                      <p className="font-body text-xs text-white/60 mb-1">{t.soal3aNote}</p>
                      <BlockMath math={`P(\\mathrm{${kDuaMerah}}) = \\frac{5}{8} \\times \\frac{4}{7} = \\frac{20}{56} = \\frac{5}{14}`} />
                    </div>

                    {/* Part b */}
                    <div>
                      <p className="font-body text-sm font-semibold text-white mb-2">{t.soal3bTitle}</p>
                      <p className="font-body text-xs text-white/60 mb-1">{t.soal3bNote}</p>
                      <BlockMath math="P(M_1 \cap B_2) = \frac{5}{8} \times \frac{3}{7} = \frac{15}{56}" />
                    </div>

                    {/* Part c */}
                    <div>
                      <p className="font-body text-sm font-semibold text-white mb-2">{t.soal3cTitle}</p>
                      <p className="font-body text-xs text-white/60 mb-1">{t.soal3cNote}</p>
                      <BlockMath math={`P(\\mathrm{${kDuaBiru}}) = \\frac{3}{8} \\times \\frac{2}{7} = \\frac{6}{56} = \\frac{3}{28}`} />
                      <BlockMath math={`P(\\mathrm{${kMin1Merah}}) = 1 - \\frac{3}{28} = \\frac{25}{28}`} />
                    </div>

                    <div className="bg-red-900/20 border border-red-500/20 rounded p-3 space-y-1">
                      <p className="font-body text-xs font-bold text-red-300">⚠️ {language === "en" ? "Key Points:" : language === "ja" ? "重要ポイント：" : "Poin Penting:"}</p>
                      {t.soal3Warning.map((w, i) => (
                        <p key={i} className="font-body text-xs text-white/70">• {w}</p>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── SUMMARY ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-primary" title={t.sectionSummary} />
            {expandedSections.includes("rangkuman") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-1 gap-2 font-body text-sm">
                  {t.summaryPoints.map(({ poin, icon, color }) => (
                    <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                      <span className={`text-lg shrink-0 ${color}`}>{icon}</span>
                      <p className="text-white/80">{poin}</p>
                    </div>
                  ))}
                </div>

                {/* Formula Summary Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-body border-collapse mt-2">
                    <thead>
                      <tr className="bg-primary/20">
                        {t.tableHead.map((h) => (
                          <th key={h} className={`border border-primary/30 px-3 py-2 text-primary ${h === t.tableHead[0] ? "text-left" : "text-center"}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {t.tableData.map(([jenis, syarat, rumus], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                          <td className="border border-white/10 px-3 py-2 text-cyan-200 font-semibold">{jenis}</td>
                          <td className="border border-white/10 px-3 py-2 text-center text-white/60">{syarat}</td>
                          <td className="border border-white/10 px-3 py-2 text-center text-yellow-300">{rumus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <RangkumanSection
            gradientFrom="from-rose-900"
            gradientVia="via-pink-900"
            gradientTo="to-red-900"
            borderColor="border-rose-500/40"
            accentColor="text-rose-300"
            headerIcon="🔗"
            judul={t.rangkumanJudul}
            subjudul={t.rangkumanSubjudul}
            ringkasan={t.rangkumanRingkasan}
            rumus={t.rangkumanRumus}
            tips={t.rangkumanTips}
            kesimpulan={t.rangkumanKesimpulan}
            kesimpulanBg="bg-gradient-to-r from-rose-900/80 to-pink-900/80"
            kesimpulanBorder="border-rose-400/50"
            kesimpulanTextColor="text-rose-100"
          />

          <div className="mt-4 text-center">
            <button
              onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/peluang"); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
            >
              {t.backBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeluangKejadianMajemukPage;
