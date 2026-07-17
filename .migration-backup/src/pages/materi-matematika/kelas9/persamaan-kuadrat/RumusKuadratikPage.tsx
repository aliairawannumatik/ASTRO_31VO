import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const RumusKuadratikPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const allSections = ["intro", "teori", "contoh"];
  const [expandedSections, setExpandedSections] = useState<string[]>(allSections);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const t =
    language === "en"
      ? {
          pageTitle: "QUADRATIC EQUATION ROOTS — QUADRATIC FORMULA",
          subtitle: "Grade 9 · Quadratic Equations · Math Material",
          introHeader: "🚀 The Most Powerful Formula — ABC!",
          introCyan: (
            <>
              The quadratic formula (often called the <strong>ABC formula</strong>) is the ultimate
              tool for finding the roots of a quadratic equation. No matter how complex the equation
              — as long as it is in the form <InlineMath math="ax^2 + bx + c = 0" /> with{" "}
              <InlineMath math="a \neq 0" />, this formula always works!
            </>
          ),
          introTip: (
            <>
              <strong>💡 When to use this formula?</strong> Use the quadratic formula when the
              equation <strong>cannot be factored</strong> easily, or when the coefficients are large
              numbers or fractions.
            </>
          ),
          teoriHeader: "📘 The Quadratic Formula & How to Read It",
          teoriSummaryTitle: "🎯 Key Summary",
          teoriSummaryBody: (
            <>
              For every equation <InlineMath math="ax^2 + bx + c = 0" />, its roots are:
            </>
          ),
          teoriPmNote: (
            <>
              The <InlineMath math="\pm" /> sign means there are <strong>two</strong> solutions: one
              using <InlineMath math="+" />, one using <InlineMath math="-" />.
            </>
          ),
          root1Label: "First root (use the + sign)",
          root2Label: "Second root (use the − sign)",
          stepsTitle: "🔑 STEPS TO USE:",
          steps: [
            <>
              Ensure the form: <InlineMath math="ax^2 + bx + c = 0" />
            </>,
            <>
              Identify the values <InlineMath math="a" />, <InlineMath math="b" />,{" "}
              <InlineMath math="c" />
            </>,
            <>
              Calculate the value under the root: <InlineMath math="D = b^2 - 4ac" />
            </>,
            <>Substitute into the formula</>,
            <>Simplify</>,
          ],
          contohHeader: "📝 Practice Problems — Quadratic Formula",
          levelMap: { MUDAH: "EASY", SEDANG: "MEDIUM", SULIT: "HARD" } as Record<string, string>,
          exampleLabel: "Example",
          solutionLabel: "📋 SOLUTION:",
          ex1soal: (
            <>
              Find the roots of <InlineMath math="x^2 - 5x + 6 = 0" /> using the quadratic formula.
            </>
          ),
          ex1sol: (
            <>
              <p>
                <InlineMath math="a = 1,\; b = -5,\; c = 6" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x = \frac{-(-5) \pm \sqrt{(-5)^2 - 4(1)(6)}}{2(1)} = \frac{5 \pm \sqrt{25-24}}{2} = \frac{5 \pm 1}{2}" />
              </div>
              <p>
                <InlineMath math="x_1 = \dfrac{5+1}{2} = 3" />,{" "}
                <InlineMath math="x_2 = \dfrac{5-1}{2} = 2" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = 3" /> and <InlineMath math="x_2 = 2" />
              </p>
            </>
          ),
          ex2soal: (
            <>
              Solve: <InlineMath math="x^2 + 4x - 5 = 0" />
            </>
          ),
          ex2sol: (
            <>
              <p>
                <InlineMath math="a = 1,\; b = 4,\; c = -5" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x = \frac{-4 \pm \sqrt{16 + 20}}{2} = \frac{-4 \pm \sqrt{36}}{2} = \frac{-4 \pm 6}{2}" />
              </div>
              <p>
                <InlineMath math="x_1 = \dfrac{-4+6}{2} = 1" />,{" "}
                <InlineMath math="x_2 = \dfrac{-4-6}{2} = -5" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = 1" /> and <InlineMath math="x_2 = -5" />
              </p>
            </>
          ),
          ex3soal: (
            <>
              Find the roots of: <InlineMath math="2x^2 - 3x - 2 = 0" />
            </>
          ),
          ex3sol: (
            <>
              <p>
                <InlineMath math="a = 2,\; b = -3,\; c = -2" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x = \frac{3 \pm \sqrt{9 + 16}}{4} = \frac{3 \pm \sqrt{25}}{4} = \frac{3 \pm 5}{4}" />
              </div>
              <p>
                <InlineMath math="x_1 = \dfrac{3+5}{4} = 2" />,{" "}
                <InlineMath math="x_2 = \dfrac{3-5}{4} = -\dfrac{1}{2}" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = 2" /> and <InlineMath math="x_2 = -\tfrac{1}{2}" />
              </p>
            </>
          ),
          ex4soal: (
            <>
              Solve: <InlineMath math="3x^2 + x - 4 = 0" />
            </>
          ),
          ex4sol: (
            <>
              <p>
                <InlineMath math="a = 3,\; b = 1,\; c = -4" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="D = 1 + 48 = 49 \Rightarrow \sqrt{D} = 7" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x = \frac{-1 \pm 7}{6}" />
              </div>
              <p>
                <InlineMath math="x_1 = \dfrac{6}{6} = 1" />,{" "}
                <InlineMath math="x_2 = \dfrac{-8}{6} = -\dfrac{4}{3}" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = 1" /> and <InlineMath math="x_2 = -\tfrac{4}{3}" />
              </p>
            </>
          ),
          ex5soal: (
            <>
              Solve: <InlineMath math="x^2 - 4x + 1 = 0" /> (answer in radical form).
            </>
          ),
          ex5sol: (
            <>
              <p>
                <InlineMath math="a = 1,\; b = -4,\; c = 1" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="D = 16 - 4 = 12 \Rightarrow \sqrt{12} = 2\sqrt{3}" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x = \frac{4 \pm 2\sqrt{3}}{2} = 2 \pm \sqrt{3}" />
              </div>
              <p>
                ✅ <InlineMath math="x_1 = 2 + \sqrt{3}" /> and{" "}
                <InlineMath math="x_2 = 2 - \sqrt{3}" />
              </p>
            </>
          ),
          ex6soal: (
            <>
              Given <InlineMath math="5x^2 - 2x - 7 = 0" />. Find its roots and verify the result.
            </>
          ),
          ex6sol: (
            <>
              <p>
                <InlineMath math="a = 5,\; b = -2,\; c = -7" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="D = 4 + 140 = 144 \Rightarrow \sqrt{D} = 12" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x = \frac{2 \pm 12}{10}" />
              </div>
              <p>
                <InlineMath math="x_1 = \dfrac{14}{10} = \dfrac{7}{5}" />,{" "}
                <InlineMath math="x_2 = \dfrac{-10}{10} = -1" />
              </p>
              <p>
                <strong>Verification</strong> <InlineMath math="x_2 = -1" />:{" "}
                <InlineMath math="5(1) - 2(-1) - 7 = 5 + 2 - 7 = 0" /> ✅
              </p>
            </>
          ),
          backLabel: "Back to Quadratic Equations",
        }
      : language === "ja"
      ? {
          pageTitle: "二次方程式の解 — 二次方程式の解の公式",
          subtitle: "中学3年 · 二次方程式 · 数学教材",
          introHeader: "🚀 最強の公式 — ABC公式！",
          introCyan: (
            <>
              二次方程式の解の公式（<strong>ABC公式</strong>とも呼ばれる）は、二次方程式の解を求めるための最強のツールです。
              方程式がどれほど複雑であっても、<InlineMath math="a \neq 0" /> で{" "}
              <InlineMath math="ax^2 + bx + c = 0" /> の形であれば、この公式は必ず使えます！
            </>
          ),
          introTip: (
            <>
              <strong>💡 この公式をいつ使う？</strong>{" "}
              方程式が簡単に<strong>因数分解できない</strong>とき、または係数が大きな数や分数のときに
              二次方程式の解の公式を使いましょう。
            </>
          ),
          teoriHeader: "📘 二次方程式の解の公式とその読み方",
          teoriSummaryTitle: "🎯 まとめ",
          teoriSummaryBody: (
            <>
              <InlineMath math="ax^2 + bx + c = 0" /> のすべての方程式について、解は次の通りです：
            </>
          ),
          teoriPmNote: (
            <>
              <InlineMath math="\pm" /> の符号は<strong>2つ</strong>の解があることを意味します：
              一方は <InlineMath math="+" />、もう一方は <InlineMath math="-" />。
            </>
          ),
          root1Label: "第1の解（＋符号を使う）",
          root2Label: "第2の解（－符号を使う）",
          stepsTitle: "🔑 使い方の手順：",
          steps: [
            <>
              形式を確認：<InlineMath math="ax^2 + bx + c = 0" />
            </>,
            <>
              <InlineMath math="a" />、<InlineMath math="b" />、<InlineMath math="c" />{" "}
              の値を識別する
            </>,
            <>
              根号の下の値を計算する：<InlineMath math="D = b^2 - 4ac" />
            </>,
            <>公式に代入する</>,
            <>整理する</>,
          ],
          contohHeader: "📝 練習問題 — 二次方程式の解の公式",
          levelMap: { MUDAH: "基本", SEDANG: "標準", SULIT: "発展" } as Record<string, string>,
          exampleLabel: "例題",
          solutionLabel: "📋 解説：",
          ex1soal: (
            <>
              二次方程式の解の公式を使って <InlineMath math="x^2 - 5x + 6 = 0" /> の解を求めなさい。
            </>
          ),
          ex1sol: (
            <>
              <p>
                <InlineMath math="a = 1,\; b = -5,\; c = 6" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x = \frac{-(-5) \pm \sqrt{(-5)^2 - 4(1)(6)}}{2(1)} = \frac{5 \pm \sqrt{25-24}}{2} = \frac{5 \pm 1}{2}" />
              </div>
              <p>
                <InlineMath math="x_1 = \dfrac{5+1}{2} = 3" />、
                <InlineMath math="x_2 = \dfrac{5-1}{2} = 2" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = 3" />、<InlineMath math="x_2 = 2" />
              </p>
            </>
          ),
          ex2soal: (
            <>
              次を解きなさい：<InlineMath math="x^2 + 4x - 5 = 0" />
            </>
          ),
          ex2sol: (
            <>
              <p>
                <InlineMath math="a = 1,\; b = 4,\; c = -5" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x = \frac{-4 \pm \sqrt{16 + 20}}{2} = \frac{-4 \pm \sqrt{36}}{2} = \frac{-4 \pm 6}{2}" />
              </div>
              <p>
                <InlineMath math="x_1 = \dfrac{-4+6}{2} = 1" />、
                <InlineMath math="x_2 = \dfrac{-4-6}{2} = -5" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = 1" />、<InlineMath math="x_2 = -5" />
              </p>
            </>
          ),
          ex3soal: (
            <>
              次の解を求めなさい：<InlineMath math="2x^2 - 3x - 2 = 0" />
            </>
          ),
          ex3sol: (
            <>
              <p>
                <InlineMath math="a = 2,\; b = -3,\; c = -2" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x = \frac{3 \pm \sqrt{9 + 16}}{4} = \frac{3 \pm \sqrt{25}}{4} = \frac{3 \pm 5}{4}" />
              </div>
              <p>
                <InlineMath math="x_1 = \dfrac{3+5}{4} = 2" />、
                <InlineMath math="x_2 = \dfrac{3-5}{4} = -\dfrac{1}{2}" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = 2" />、<InlineMath math="x_2 = -\tfrac{1}{2}" />
              </p>
            </>
          ),
          ex4soal: (
            <>
              次を解きなさい：<InlineMath math="3x^2 + x - 4 = 0" />
            </>
          ),
          ex4sol: (
            <>
              <p>
                <InlineMath math="a = 3,\; b = 1,\; c = -4" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="D = 1 + 48 = 49 \Rightarrow \sqrt{D} = 7" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x = \frac{-1 \pm 7}{6}" />
              </div>
              <p>
                <InlineMath math="x_1 = \dfrac{6}{6} = 1" />、
                <InlineMath math="x_2 = \dfrac{-8}{6} = -\dfrac{4}{3}" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = 1" />、<InlineMath math="x_2 = -\tfrac{4}{3}" />
              </p>
            </>
          ),
          ex5soal: (
            <>
              次を解きなさい：<InlineMath math="x^2 - 4x + 1 = 0" />（答えは根号の形で）。
            </>
          ),
          ex5sol: (
            <>
              <p>
                <InlineMath math="a = 1,\; b = -4,\; c = 1" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="D = 16 - 4 = 12 \Rightarrow \sqrt{12} = 2\sqrt{3}" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x = \frac{4 \pm 2\sqrt{3}}{2} = 2 \pm \sqrt{3}" />
              </div>
              <p>
                ✅ <InlineMath math="x_1 = 2 + \sqrt{3}" />、
                <InlineMath math="x_2 = 2 - \sqrt{3}" />
              </p>
            </>
          ),
          ex6soal: (
            <>
              <InlineMath math="5x^2 - 2x - 7 = 0" /> が与えられている。解を求め、結果を検証しなさい。
            </>
          ),
          ex6sol: (
            <>
              <p>
                <InlineMath math="a = 5,\; b = -2,\; c = -7" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="D = 4 + 140 = 144 \Rightarrow \sqrt{D} = 12" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x = \frac{2 \pm 12}{10}" />
              </div>
              <p>
                <InlineMath math="x_1 = \dfrac{14}{10} = \dfrac{7}{5}" />、
                <InlineMath math="x_2 = \dfrac{-10}{10} = -1" />
              </p>
              <p>
                <strong>検証</strong> <InlineMath math="x_2 = -1" />：{" "}
                <InlineMath math="5(1) - 2(-1) - 7 = 5 + 2 - 7 = 0" /> ✅
              </p>
            </>
          ),
          backLabel: "二次方程式に戻る",
        }
      : {
          pageTitle: "AKAR PERSAMAAN KUADRAT — RUMUS KUADRATIK",
          subtitle: "Kelas 9 · Persamaan Kuadrat · Materi Matematika",
          introHeader: "🚀 Rumus Paling Sakti — ABC!",
          introCyan: (
            <>
              Rumus kuadratik (sering disebut <strong>rumus ABC</strong>) adalah senjata pamungkas
              untuk mencari akar persamaan kuadrat. Tidak peduli seberapa rumit persamaannya —
              selama ia berbentuk <InlineMath math="ax^2 + bx + c = 0" /> dengan{" "}
              <InlineMath math="a \neq 0" />, rumus ini selalu bisa dipakai!
            </>
          ),
          introTip: (
            <>
              <strong>💡 Kapan pakai rumus ini?</strong> Gunakan rumus ABC saat persamaan{" "}
              <strong>tidak bisa difaktorkan</strong> dengan mudah, atau saat koefisiennya bilangan
              besar/pecahan.
            </>
          ),
          teoriHeader: "📘 Rumus Kuadratik & Cara Membacanya",
          teoriSummaryTitle: "🎯 Ringkasan Intisari",
          teoriSummaryBody: (
            <>
              Untuk setiap persamaan <InlineMath math="ax^2 + bx + c = 0" />, akar-akarnya adalah:
            </>
          ),
          teoriPmNote: (
            <>
              Tanda <InlineMath math="\pm" /> berarti ada <strong>dua</strong> solusi: satu pakai{" "}
              <InlineMath math="+" />, satu pakai <InlineMath math="-" />.
            </>
          ),
          root1Label: "Akar pertama (gunakan tanda +)",
          root2Label: "Akar kedua (gunakan tanda −)",
          stepsTitle: "🔑 LANGKAH PENGGUNAAN:",
          steps: [
            <>
              Pastikan bentuk: <InlineMath math="ax^2 + bx + c = 0" />
            </>,
            <>
              Identifikasi nilai <InlineMath math="a" />, <InlineMath math="b" />,{" "}
              <InlineMath math="c" />
            </>,
            <>
              Hitung nilai di bawah akar: <InlineMath math="D = b^2 - 4ac" />
            </>,
            <>Substitusikan ke rumus</>,
            <>Sederhanakan</>,
          ],
          contohHeader: "📝 Contoh Soal — Rumus Kuadratik",
          levelMap: { MUDAH: "MUDAH", SEDANG: "SEDANG", SULIT: "SULIT" } as Record<string, string>,
          exampleLabel: "Contoh",
          solutionLabel: "📋 PEMBAHASAN:",
          ex1soal: (
            <>
              Tentukan akar-akar <InlineMath math="x^2 - 5x + 6 = 0" /> menggunakan rumus
              kuadratik.
            </>
          ),
          ex1sol: (
            <>
              <p>
                <InlineMath math="a = 1,\; b = -5,\; c = 6" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x = \frac{-(-5) \pm \sqrt{(-5)^2 - 4(1)(6)}}{2(1)} = \frac{5 \pm \sqrt{25-24}}{2} = \frac{5 \pm 1}{2}" />
              </div>
              <p>
                <InlineMath math="x_1 = \dfrac{5+1}{2} = 3" />,{" "}
                <InlineMath math="x_2 = \dfrac{5-1}{2} = 2" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = 3" /> dan <InlineMath math="x_2 = 2" />
              </p>
            </>
          ),
          ex2soal: (
            <>
              Selesaikan: <InlineMath math="x^2 + 4x - 5 = 0" />
            </>
          ),
          ex2sol: (
            <>
              <p>
                <InlineMath math="a = 1,\; b = 4,\; c = -5" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x = \frac{-4 \pm \sqrt{16 + 20}}{2} = \frac{-4 \pm \sqrt{36}}{2} = \frac{-4 \pm 6}{2}" />
              </div>
              <p>
                <InlineMath math="x_1 = \dfrac{-4+6}{2} = 1" />,{" "}
                <InlineMath math="x_2 = \dfrac{-4-6}{2} = -5" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = 1" /> dan <InlineMath math="x_2 = -5" />
              </p>
            </>
          ),
          ex3soal: (
            <>
              Tentukan akar-akar: <InlineMath math="2x^2 - 3x - 2 = 0" />
            </>
          ),
          ex3sol: (
            <>
              <p>
                <InlineMath math="a = 2,\; b = -3,\; c = -2" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x = \frac{3 \pm \sqrt{9 + 16}}{4} = \frac{3 \pm \sqrt{25}}{4} = \frac{3 \pm 5}{4}" />
              </div>
              <p>
                <InlineMath math="x_1 = \dfrac{3+5}{4} = 2" />,{" "}
                <InlineMath math="x_2 = \dfrac{3-5}{4} = -\dfrac{1}{2}" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = 2" /> dan <InlineMath math="x_2 = -\tfrac{1}{2}" />
              </p>
            </>
          ),
          ex4soal: (
            <>
              Selesaikan: <InlineMath math="3x^2 + x - 4 = 0" />
            </>
          ),
          ex4sol: (
            <>
              <p>
                <InlineMath math="a = 3,\; b = 1,\; c = -4" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="D = 1 + 48 = 49 \Rightarrow \sqrt{D} = 7" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x = \frac{-1 \pm 7}{6}" />
              </div>
              <p>
                <InlineMath math="x_1 = \dfrac{6}{6} = 1" />,{" "}
                <InlineMath math="x_2 = \dfrac{-8}{6} = -\dfrac{4}{3}" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = 1" /> dan <InlineMath math="x_2 = -\tfrac{4}{3}" />
              </p>
            </>
          ),
          ex5soal: (
            <>
              Selesaikan: <InlineMath math="x^2 - 4x + 1 = 0" /> (jawaban dalam bentuk akar).
            </>
          ),
          ex5sol: (
            <>
              <p>
                <InlineMath math="a = 1,\; b = -4,\; c = 1" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="D = 16 - 4 = 12 \Rightarrow \sqrt{12} = 2\sqrt{3}" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x = \frac{4 \pm 2\sqrt{3}}{2} = 2 \pm \sqrt{3}" />
              </div>
              <p>
                ✅ <InlineMath math="x_1 = 2 + \sqrt{3}" /> dan{" "}
                <InlineMath math="x_2 = 2 - \sqrt{3}" />
              </p>
            </>
          ),
          ex6soal: (
            <>
              Diketahui <InlineMath math="5x^2 - 2x - 7 = 0" />. Tentukan akar-akarnya dan
              verifikasi hasil.
            </>
          ),
          ex6sol: (
            <>
              <p>
                <InlineMath math="a = 5,\; b = -2,\; c = -7" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="D = 4 + 140 = 144 \Rightarrow \sqrt{D} = 12" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x = \frac{2 \pm 12}{10}" />
              </div>
              <p>
                <InlineMath math="x_1 = \dfrac{14}{10} = \dfrac{7}{5}" />,{" "}
                <InlineMath math="x_2 = \dfrac{-10}{10} = -1" />
              </p>
              <p>
                <strong>Verifikasi</strong> <InlineMath math="x_2 = -1" />:{" "}
                <InlineMath math="5(1) - 2(-1) - 7 = 5 + 2 - 7 = 0" /> ✅
              </p>
            </>
          ),
          backLabel: "Kembali ke Persamaan Kuadrat",
        };

  const SectionHeader = ({
    id,
    icon,
    iconColor,
    title,
  }: {
    id: string;
    icon: React.ReactNode;
    iconColor: string;
    title: React.ReactNode;
  }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span className={iconColor}>{icon}</span>
        <span className="font-body font-semibold text-white">{title}</span>
      </div>
      <ChevronUp className="w-5 h-5 text-primary" />
    </button>
  );

  const levelColors = {
    MUDAH: { badge: "bg-green-500/20 text-green-400 border border-green-500", bar: "border-green-500", bg: "rgba(34,197,94,0.04)", border: "rgba(34,197,94,0.2)", pColor: "text-green-400" },
    SEDANG: { badge: "bg-yellow-500/20 text-yellow-400 border border-yellow-500", bar: "border-yellow-500", bg: "rgba(234,179,8,0.04)", border: "rgba(234,179,8,0.2)", pColor: "text-yellow-400" },
    SULIT: { badge: "bg-red-500/20 text-red-400 border border-red-500", bar: "border-red-500", bg: "rgba(239,68,68,0.04)", border: "rgba(239,68,68,0.2)", pColor: "text-red-400" },
  };

  const ExampleBlock = ({ level, no, soal, pembahasan }: { level: "MUDAH" | "SEDANG" | "SULIT"; no: number; soal: React.ReactNode; pembahasan: React.ReactNode }) => {
    const c = levelColors[level];
    return (
      <div className={`border-l-4 ${c.bar} pl-4 space-y-3`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded ${c.badge}`}>{t.levelMap[level]}</span>
          <span className="font-body font-semibold text-white">{t.exampleLabel} {no}</span>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 font-body text-sm text-white/90">{soal}</div>
        <div className="rounded-lg p-4" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
          <p className={`font-body text-xs font-semibold mb-3 ${c.pColor}`}>{t.solutionLabel}</p>
          <div className="space-y-2 font-body text-sm text-white/80">{pembahasan}</div>
        </div>
      </div>
    );
  };

  const Box = ({ color, children }: { color: string; children: React.ReactNode }) => {
    const map: Record<string, string> = { cyan: "bg-cyan-500/10 border-cyan-500/30 text-cyan-100", green: "bg-green-500/10 border-green-500/30 text-green-100", yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-100", purple: "bg-purple-500/10 border-purple-500/30 text-purple-100", orange: "bg-orange-500/10 border-orange-500/30 text-orange-100", slate: "bg-slate-900/60 border-slate-700/40 text-white/80" };
    return <div className={`border rounded-xl p-4 ${map[color] || map.slate}`}>{children}</div>;
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.pageTitle}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">{t.subtitle}</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.introHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">{t.introCyan}</p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm">{t.introTip}</p>
                </Box>
              </div>
            )}
          </div>

          {/* TEORI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="teori" icon={<Target className="w-5 h-5" />} iconColor="text-cyan-400" title={t.teoriHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">{t.teoriSummaryTitle}</p>
                  <p className="font-body text-sm mb-2">{t.teoriSummaryBody}</p>
                  <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                    <BlockMath math="x_{1,2} = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" />
                  </div>
                  <p className="font-body text-sm mt-2">{t.teoriPmNote}</p>
                </Box>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Box color="green">
                    <p className="font-body text-xs font-bold text-green-300 mb-1"><InlineMath math="x_1 = \dfrac{-b + \sqrt{b^2-4ac}}{2a}" /></p>
                    <p className="font-body text-xs text-white/70">{t.root1Label}</p>
                  </Box>
                  <Box color="orange">
                    <p className="font-body text-xs font-bold text-orange-300 mb-1"><InlineMath math="x_2 = \dfrac{-b - \sqrt{b^2-4ac}}{2a}" /></p>
                    <p className="font-body text-xs text-white/70">{t.root2Label}</p>
                  </Box>
                </div>
                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">{t.stepsTitle}</p>
                  <ol className="font-body text-xs text-white/70 space-y-1 list-decimal list-inside">
                    {t.steps.map((step, i) => <li key={i}>{step}</li>)}
                  </ol>
                </Box>
              </div>
            )}
          </div>

          {/* CONTOH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400" title={t.contohHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-7">
                <ExampleBlock level="MUDAH" no={1} soal={t.ex1soal} pembahasan={t.ex1sol} />
                <ExampleBlock level="MUDAH" no={2} soal={t.ex2soal} pembahasan={t.ex2sol} />
                <ExampleBlock level="SEDANG" no={3} soal={t.ex3soal} pembahasan={t.ex3sol} />
                <ExampleBlock level="SEDANG" no={4} soal={t.ex4soal} pembahasan={t.ex4sol} />
                <ExampleBlock level="SULIT" no={5} soal={t.ex5soal} pembahasan={t.ex5sol} />
                <ExampleBlock level="SULIT" no={6} soal={t.ex6soal} pembahasan={t.ex6sol} />
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/persamaan-kuadrat"); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body flex items-center gap-2 mx-auto">
              <Star className="w-4 h-4" /> {t.backLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RumusKuadratikPage;
