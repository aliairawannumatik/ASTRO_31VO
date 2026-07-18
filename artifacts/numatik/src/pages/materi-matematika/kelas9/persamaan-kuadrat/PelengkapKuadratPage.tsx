import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const PelengkapKuadratPage = () => {
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
          pageTitle: "QUADRATIC EQUATION ROOTS — COMPLETING THE SQUARE",
          subtitle: "Grade 9 · Quadratic Equations · Math Material",
          introHeader: "🧩 What Is Completing the Square?",
          introCyan: (
            <>
              Completing the square is a method of rewriting a quadratic equation into the form{" "}
              <InlineMath math="(x + p)^2 = q" />, which is easy to solve. This technique is also
              used to <strong>derive the quadratic formula</strong>!
            </>
          ),
          introOrangeTitle: "🔑 Key Identity:",
          introOrangeNote: (
            <>
              Notice: the coefficient of <InlineMath math="x" /> is <InlineMath math="2p" />, and
              the constant is{" "}
              <InlineMath math="p^2 = \left(\frac{2p}{2}\right)^2" />. This is the key trick!
            </>
          ),
          introTip: (
            <>
              <strong>💡 Core Trick:</strong> To complete the square from{" "}
              <InlineMath math="x^2 + bx" />, add{" "}
              <InlineMath math="\left(\dfrac{b}{2}\right)^2" /> to both sides.
            </>
          ),
          teoriHeader: "📘 Steps for Completing the Square",
          teoriSummaryTitle: "🎯 Key Summary",
          teoriSummaryBody: (
            <>
              To solve <InlineMath math="ax^2 + bx + c = 0" /> by completing the square:
            </>
          ),
          teoriSteps: [
            <>
              If <InlineMath math="a \neq 1" />, divide the entire equation by{" "}
              <InlineMath math="a" />
            </>,
            <>
              Move the constant to the right:{" "}
              <InlineMath math="x^2 + \frac{b}{a}x = -\frac{c}{a}" />
            </>,
            <>
              Add <InlineMath math="\left(\frac{b}{2a}\right)^2" /> to both sides
            </>,
            <>
              Write the left side as a perfect square:{" "}
              <InlineMath math="\left(x + \frac{b}{2a}\right)^2 = \ldots" />
            </>,
            <>
              Take the square root of both sides, solve for <InlineMath math="x" />
            </>,
          ],
          contohHeader: "📝 Practice Problems — Completing the Square",
          levelMap: { MUDAH: "EASY", SEDANG: "MEDIUM", SULIT: "HARD" } as Record<string, string>,
          exampleLabel: "Example",
          solutionLabel: "📋 SOLUTION:",
          ex1soal: (
            <>
              Solve <InlineMath math="x^2 + 6x + 5 = 0" /> by completing the square.
            </>
          ),
          ex1sol: (
            <>
              <p>
                <strong>Step 1:</strong> Move the constant to the right:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 + 6x = -5" />
              </div>
              <p>
                <strong>Step 2:</strong> Add{" "}
                <InlineMath math="\left(\frac{6}{2}\right)^2 = 9" /> to both sides:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 + 6x + 9 = -5 + 9 = 4" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="(x + 3)^2 = 4" />
              </div>
              <p>
                <strong>Step 3:</strong> Take square root: <InlineMath math="x + 3 = \pm 2" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = -1" /> and <InlineMath math="x_2 = -5" />
              </p>
            </>
          ),
          ex2soal: (
            <>
              Solve <InlineMath math="x^2 - 8x + 12 = 0" />
            </>
          ),
          ex2sol: (
            <>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 8x = -12" />
              </div>
              <p>
                Add <InlineMath math="\left(\frac{-8}{2}\right)^2 = 16" />:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 8x + 16 = 4 \implies (x-4)^2 = 4" />
              </div>
              <p>
                <InlineMath math="x - 4 = \pm 2" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = 6" /> and <InlineMath math="x_2 = 2" />
              </p>
            </>
          ),
          ex3soal: (
            <>
              Solve <InlineMath math="x^2 + 5x - 14 = 0" />
            </>
          ),
          ex3sol: (
            <>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 + 5x = 14" />
              </div>
              <p>
                Add <InlineMath math="\left(\frac{5}{2}\right)^2 = \frac{25}{4}" />:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 + 5x + \frac{25}{4} = 14 + \frac{25}{4} = \frac{81}{4}" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="\left(x + \frac{5}{2}\right)^2 = \frac{81}{4}" />
              </div>
              <p>
                <InlineMath math="x + \frac{5}{2} = \pm \frac{9}{2}" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = 2" /> and <InlineMath math="x_2 = -7" />
              </p>
            </>
          ),
          ex4soal: (
            <>
              Solve <InlineMath math="2x^2 - 8x - 10 = 0" />
            </>
          ),
          ex4sol: (
            <>
              <p>
                <strong>Step 1:</strong> Divide by 2:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 4x - 5 = 0 \implies x^2 - 4x = 5" />
              </div>
              <p>Add 4:</p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="(x-2)^2 = 9 \implies x - 2 = \pm 3" />
              </div>
              <p>
                ✅ <InlineMath math="x_1 = 5" /> and <InlineMath math="x_2 = -1" />
              </p>
            </>
          ),
          ex5soal: (
            <>
              Solve <InlineMath math="3x^2 + 6x - 24 = 0" /> by completing the square.
            </>
          ),
          ex5sol: (
            <>
              <p>
                Divide by 3: <InlineMath math="x^2 + 2x - 8 = 0" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 + 2x = 8" />
              </div>
              <p>
                Add <InlineMath math="\left(\frac{2}{2}\right)^2 = 1" />:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="(x+1)^2 = 9 \implies x+1 = \pm 3" />
              </div>
              <p>
                ✅ <InlineMath math="x_1 = 2" /> and <InlineMath math="x_2 = -4" />
              </p>
            </>
          ),
          ex6soal: (
            <>
              Solve <InlineMath math="4x^2 - 4x - 3 = 0" /> by completing the square.
            </>
          ),
          ex6sol: (
            <>
              <p>
                Divide by 4: <InlineMath math="x^2 - x - \frac{3}{4} = 0" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - x = \frac{3}{4}" />
              </div>
              <p>
                Add <InlineMath math="\frac{1}{4}" />:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="\left(x - \frac{1}{2}\right)^2 = \frac{3}{4} + \frac{1}{4} = 1" />
              </div>
              <p>
                <InlineMath math="x - \frac{1}{2} = \pm 1" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = \frac{3}{2}" /> and{" "}
                <InlineMath math="x_2 = -\frac{1}{2}" />
              </p>
            </>
          ),
          backLabel: "Back to Quadratic Equations",
        }
      : language === "ja"
      ? {
          pageTitle: "二次方程式の解 — 平方完成",
          subtitle: "中学3年 · 二次方程式 · 数学教材",
          introHeader: "🧩 平方完成とは？",
          introCyan: (
            <>
              平方完成は、二次方程式を <InlineMath math="(x + p)^2 = q" />{" "}
              という解きやすい形に変形する方法です。この技法は
              <strong>二次方程式の解の公式の導出</strong>にも使われます！
            </>
          ),
          introOrangeTitle: "🔑 鍵となる等式：",
          introOrangeNote: (
            <>
              注目：<InlineMath math="x" /> の係数は <InlineMath math="2p" />、定数は{" "}
              <InlineMath math="p^2 = \left(\frac{2p}{2}\right)^2" /> です。これが核心のコツです！
            </>
          ),
          introTip: (
            <>
              <strong>💡 核心のコツ：</strong> <InlineMath math="x^2 + bx" /> から平方完成するには、両辺に{" "}
              <InlineMath math="\left(\dfrac{b}{2}\right)^2" /> を加えます。
            </>
          ),
          teoriHeader: "📘 平方完成の手順",
          teoriSummaryTitle: "🎯 まとめ",
          teoriSummaryBody: (
            <>
              平方完成で <InlineMath math="ax^2 + bx + c = 0" /> を解くには：
            </>
          ),
          teoriSteps: [
            <>
              <InlineMath math="a \neq 1" /> の場合、方程式全体を <InlineMath math="a" /> で割る
            </>,
            <>
              定数を右辺に移項する：<InlineMath math="x^2 + \frac{b}{a}x = -\frac{c}{a}" />
            </>,
            <>
              両辺に <InlineMath math="\left(\frac{b}{2a}\right)^2" /> を加える
            </>,
            <>
              左辺を完全平方式として書く：
              <InlineMath math="\left(x + \frac{b}{2a}\right)^2 = \ldots" />
            </>,
            <>
              両辺の平方根をとり、<InlineMath math="x" /> を求める
            </>,
          ],
          contohHeader: "📝 練習問題 — 平方完成",
          levelMap: { MUDAH: "基本", SEDANG: "標準", SULIT: "発展" } as Record<string, string>,
          exampleLabel: "例題",
          solutionLabel: "📋 解説：",
          ex1soal: (
            <>
              平方完成を使って <InlineMath math="x^2 + 6x + 5 = 0" /> を解きなさい。
            </>
          ),
          ex1sol: (
            <>
              <p>
                <strong>手順1：</strong>定数を右辺に移項する：
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 + 6x = -5" />
              </div>
              <p>
                <strong>手順2：</strong>両辺に{" "}
                <InlineMath math="\left(\frac{6}{2}\right)^2 = 9" /> を加える：
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 + 6x + 9 = -5 + 9 = 4" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="(x + 3)^2 = 4" />
              </div>
              <p>
                <strong>手順3：</strong>平方根をとる：<InlineMath math="x + 3 = \pm 2" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = -1" />、<InlineMath math="x_2 = -5" />
              </p>
            </>
          ),
          ex2soal: (
            <>
              <InlineMath math="x^2 - 8x + 12 = 0" /> を解きなさい。
            </>
          ),
          ex2sol: (
            <>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 8x = -12" />
              </div>
              <p>
                両辺に <InlineMath math="\left(\frac{-8}{2}\right)^2 = 16" /> を加える：
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 8x + 16 = 4 \implies (x-4)^2 = 4" />
              </div>
              <p>
                <InlineMath math="x - 4 = \pm 2" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = 6" />、<InlineMath math="x_2 = 2" />
              </p>
            </>
          ),
          ex3soal: (
            <>
              <InlineMath math="x^2 + 5x - 14 = 0" /> を解きなさい。
            </>
          ),
          ex3sol: (
            <>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 + 5x = 14" />
              </div>
              <p>
                両辺に <InlineMath math="\left(\frac{5}{2}\right)^2 = \frac{25}{4}" /> を加える：
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 + 5x + \frac{25}{4} = 14 + \frac{25}{4} = \frac{81}{4}" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="\left(x + \frac{5}{2}\right)^2 = \frac{81}{4}" />
              </div>
              <p>
                <InlineMath math="x + \frac{5}{2} = \pm \frac{9}{2}" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = 2" />、<InlineMath math="x_2 = -7" />
              </p>
            </>
          ),
          ex4soal: (
            <>
              <InlineMath math="2x^2 - 8x - 10 = 0" /> を解きなさい。
            </>
          ),
          ex4sol: (
            <>
              <p>
                <strong>手順1：</strong>2で割る：
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 4x - 5 = 0 \implies x^2 - 4x = 5" />
              </div>
              <p>4を加える：</p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="(x-2)^2 = 9 \implies x - 2 = \pm 3" />
              </div>
              <p>
                ✅ <InlineMath math="x_1 = 5" />、<InlineMath math="x_2 = -1" />
              </p>
            </>
          ),
          ex5soal: (
            <>
              平方完成を使って <InlineMath math="3x^2 + 6x - 24 = 0" /> を解きなさい。
            </>
          ),
          ex5sol: (
            <>
              <p>
                3で割る：<InlineMath math="x^2 + 2x - 8 = 0" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 + 2x = 8" />
              </div>
              <p>
                両辺に <InlineMath math="\left(\frac{2}{2}\right)^2 = 1" /> を加える：
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="(x+1)^2 = 9 \implies x+1 = \pm 3" />
              </div>
              <p>
                ✅ <InlineMath math="x_1 = 2" />、<InlineMath math="x_2 = -4" />
              </p>
            </>
          ),
          ex6soal: (
            <>
              平方完成を使って <InlineMath math="4x^2 - 4x - 3 = 0" /> を解きなさい。
            </>
          ),
          ex6sol: (
            <>
              <p>
                4で割る：<InlineMath math="x^2 - x - \frac{3}{4} = 0" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - x = \frac{3}{4}" />
              </div>
              <p>
                <InlineMath math="\frac{1}{4}" /> を加える：
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="\left(x - \frac{1}{2}\right)^2 = \frac{3}{4} + \frac{1}{4} = 1" />
              </div>
              <p>
                <InlineMath math="x - \frac{1}{2} = \pm 1" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = \frac{3}{2}" />、
                <InlineMath math="x_2 = -\frac{1}{2}" />
              </p>
            </>
          ),
          backLabel: "二次方程式に戻る",
        }
      : {
          pageTitle: "AKAR PERSAMAAN KUADRAT — MELENGKAPI KUADRAT",
          subtitle: "Kelas 9 · Persamaan Kuadrat · Materi Matematika",
          introHeader: "🧩 Apa Itu Melengkapi Kuadrat?",
          introCyan: (
            <>
              Melengkapi kuadrat (completing the square) adalah metode mengubah persamaan kuadrat
              menjadi bentuk <InlineMath math="(x + p)^2 = q" /> yang mudah diselesaikan. Ini
              adalah teknik yang juga digunakan untuk <strong>menurunkan rumus ABC</strong>!
            </>
          ),
          introOrangeTitle: "🔑 Identitas Kunci:",
          introOrangeNote: (
            <>
              Perhatikan: koefisien <InlineMath math="x" /> adalah <InlineMath math="2p" />, dan
              konstanta adalah{" "}
              <InlineMath math="p^2 = \left(\frac{2p}{2}\right)^2" />. Ini kunci triknya!
            </>
          ),
          introTip: (
            <>
              <strong>💡 Trik Inti:</strong> Untuk melengkapi kuadrat dari{" "}
              <InlineMath math="x^2 + bx" />, tambahkan{" "}
              <InlineMath math="\left(\dfrac{b}{2}\right)^2" /> ke kedua ruas.
            </>
          ),
          teoriHeader: "📘 Langkah-Langkah Melengkapi Kuadrat",
          teoriSummaryTitle: "🎯 Ringkasan Intisari",
          teoriSummaryBody: (
            <>
              Untuk menyelesaikan <InlineMath math="ax^2 + bx + c = 0" /> dengan melengkapi
              kuadrat:
            </>
          ),
          teoriSteps: [
            <>
              Jika <InlineMath math="a \neq 1" />, bagi seluruh persamaan dengan{" "}
              <InlineMath math="a" />
            </>,
            <>
              Pindahkan konstanta ke kanan:{" "}
              <InlineMath math="x^2 + \frac{b}{a}x = -\frac{c}{a}" />
            </>,
            <>
              Tambahkan <InlineMath math="\left(\frac{b}{2a}\right)^2" /> ke kedua ruas
            </>,
            <>
              Tulis ruas kiri sebagai kuadrat sempurna:{" "}
              <InlineMath math="\left(x + \frac{b}{2a}\right)^2 = \ldots" />
            </>,
            <>
              Akar-kan kedua ruas, selesaikan untuk <InlineMath math="x" />
            </>,
          ],
          contohHeader: "📝 Contoh Soal — Melengkapi Kuadrat",
          levelMap: { MUDAH: "MUDAH", SEDANG: "SEDANG", SULIT: "SULIT" } as Record<string, string>,
          exampleLabel: "Contoh",
          solutionLabel: "📋 PEMBAHASAN:",
          ex1soal: (
            <>
              Selesaikan <InlineMath math="x^2 + 6x + 5 = 0" /> dengan melengkapi kuadrat.
            </>
          ),
          ex1sol: (
            <>
              <p>
                <strong>Langkah 1:</strong> Pindah konstanta ke kanan:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 + 6x = -5" />
              </div>
              <p>
                <strong>Langkah 2:</strong> Tambah{" "}
                <InlineMath math="\left(\frac{6}{2}\right)^2 = 9" /> ke kedua ruas:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 + 6x + 9 = -5 + 9 = 4" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="(x + 3)^2 = 4" />
              </div>
              <p>
                <strong>Langkah 3:</strong> Akar-kan: <InlineMath math="x + 3 = \pm 2" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = -1" /> dan <InlineMath math="x_2 = -5" />
              </p>
            </>
          ),
          ex2soal: (
            <>
              Selesaikan <InlineMath math="x^2 - 8x + 12 = 0" />
            </>
          ),
          ex2sol: (
            <>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 8x = -12" />
              </div>
              <p>
                Tambah <InlineMath math="\left(\frac{-8}{2}\right)^2 = 16" />:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 8x + 16 = 4 \implies (x-4)^2 = 4" />
              </div>
              <p>
                <InlineMath math="x - 4 = \pm 2" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = 6" /> dan <InlineMath math="x_2 = 2" />
              </p>
            </>
          ),
          ex3soal: (
            <>
              Selesaikan <InlineMath math="x^2 + 5x - 14 = 0" />
            </>
          ),
          ex3sol: (
            <>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 + 5x = 14" />
              </div>
              <p>
                Tambah <InlineMath math="\left(\frac{5}{2}\right)^2 = \frac{25}{4}" />:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 + 5x + \frac{25}{4} = 14 + \frac{25}{4} = \frac{81}{4}" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="\left(x + \frac{5}{2}\right)^2 = \frac{81}{4}" />
              </div>
              <p>
                <InlineMath math="x + \frac{5}{2} = \pm \frac{9}{2}" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = 2" /> dan <InlineMath math="x_2 = -7" />
              </p>
            </>
          ),
          ex4soal: (
            <>
              Selesaikan <InlineMath math="2x^2 - 8x - 10 = 0" />
            </>
          ),
          ex4sol: (
            <>
              <p>
                <strong>Langkah 1:</strong> Bagi dengan 2:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 4x - 5 = 0 \implies x^2 - 4x = 5" />
              </div>
              <p>Tambah 4:</p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="(x-2)^2 = 9 \implies x - 2 = \pm 3" />
              </div>
              <p>
                ✅ <InlineMath math="x_1 = 5" /> dan <InlineMath math="x_2 = -1" />
              </p>
            </>
          ),
          ex5soal: (
            <>
              Selesaikan <InlineMath math="3x^2 + 6x - 24 = 0" /> dengan melengkapi kuadrat.
            </>
          ),
          ex5sol: (
            <>
              <p>
                Bagi dengan 3: <InlineMath math="x^2 + 2x - 8 = 0" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 + 2x = 8" />
              </div>
              <p>
                Tambah <InlineMath math="\left(\frac{2}{2}\right)^2 = 1" />:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="(x+1)^2 = 9 \implies x+1 = \pm 3" />
              </div>
              <p>
                ✅ <InlineMath math="x_1 = 2" /> dan <InlineMath math="x_2 = -4" />
              </p>
            </>
          ),
          ex6soal: (
            <>
              Selesaikan <InlineMath math="4x^2 - 4x - 3 = 0" /> dengan melengkapi kuadrat.
            </>
          ),
          ex6sol: (
            <>
              <p>
                Bagi dengan 4: <InlineMath math="x^2 - x - \frac{3}{4} = 0" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - x = \frac{3}{4}" />
              </div>
              <p>
                Tambah <InlineMath math="\frac{1}{4}" />:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="\left(x - \frac{1}{2}\right)^2 = \frac{3}{4} + \frac{1}{4} = 1" />
              </div>
              <p>
                <InlineMath math="x - \frac{1}{2} = \pm 1" />
              </p>
              <p>
                ✅ <InlineMath math="x_1 = \frac{3}{2}" /> dan{" "}
                <InlineMath math="x_2 = -\frac{1}{2}" />
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
    MUDAH: {
      badge: "bg-green-500/20 text-green-400 border border-green-500",
      bar: "border-green-500",
      bg: "rgba(34,197,94,0.04)",
      border: "rgba(34,197,94,0.2)",
      pColor: "text-green-400",
    },
    SEDANG: {
      badge: "bg-yellow-500/20 text-yellow-400 border border-yellow-500",
      bar: "border-yellow-500",
      bg: "rgba(234,179,8,0.04)",
      border: "rgba(234,179,8,0.2)",
      pColor: "text-yellow-400",
    },
    SULIT: {
      badge: "bg-red-500/20 text-red-400 border border-red-500",
      bar: "border-red-500",
      bg: "rgba(239,68,68,0.04)",
      border: "rgba(239,68,68,0.2)",
      pColor: "text-red-400",
    },
  };

  const ExampleBlock = ({
    level,
    no,
    soal,
    pembahasan,
  }: {
    level: "MUDAH" | "SEDANG" | "SULIT";
    no: number;
    soal: React.ReactNode;
    pembahasan: React.ReactNode;
  }) => {
    const c = levelColors[level];
    return (
      <div className={`border-l-4 ${c.bar} pl-4 space-y-3`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded ${c.badge}`}>
            {t.levelMap[level]}
          </span>
          <span className="font-body font-semibold text-white">
            {t.exampleLabel} {no}
          </span>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 font-body text-sm text-white/90">{soal}</div>
        <div
          className="rounded-lg p-4"
          style={{ background: c.bg, border: `1px solid ${c.border}` }}
        >
          <p className={`font-body text-xs font-semibold mb-3 ${c.pColor}`}>{t.solutionLabel}</p>
          <div className="space-y-2 font-body text-sm text-white/80">{pembahasan}</div>
        </div>
      </div>
    );
  };

  const Box = ({ color, children }: { color: string; children: React.ReactNode }) => {
    const map: Record<string, string> = {
      cyan: "bg-cyan-500/10 border-cyan-500/30 text-cyan-100",
      green: "bg-green-500/10 border-green-500/30 text-green-100",
      yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-100",
      purple: "bg-purple-500/10 border-purple-500/30 text-purple-100",
      orange: "bg-orange-500/10 border-orange-500/30 text-orange-100",
      slate: "bg-slate-900/60 border-slate-700/40 text-white/80",
    };
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
            <SectionHeader
              id="intro"
              icon={<Lightbulb className="w-5 h-5" />}
              iconColor="text-yellow-400"
              title={t.introHeader}
            />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="cyan">
                  <p className="font-body text-sm leading-relaxed">{t.introCyan}</p>
                </Box>
                <Box color="orange">
                  <p className="font-body text-sm font-semibold text-orange-300 mb-2">
                    {t.introOrangeTitle}
                  </p>
                  <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                    <BlockMath math="(x + p)^2 = x^2 + 2px + p^2" />
                  </div>
                  <p className="font-body text-xs text-white/70 mt-1">{t.introOrangeNote}</p>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm">{t.introTip}</p>
                </Box>
              </div>
            )}
          </div>

          {/* TEORI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="teori"
              icon={<Target className="w-5 h-5" />}
              iconColor="text-purple-400"
              title={t.teoriHeader}
            />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">
                    {t.teoriSummaryTitle}
                  </p>
                  <p className="font-body text-sm">{t.teoriSummaryBody}</p>
                </Box>
                <Box color="slate">
                  <ol className="font-body text-sm text-white/80 space-y-3 list-decimal list-inside">
                    {t.teoriSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </Box>
              </div>
            )}
          </div>

          {/* CONTOH */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="contoh"
              icon={<Calculator className="w-5 h-5" />}
              iconColor="text-blue-400"
              title={t.contohHeader}
            />
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
            <button
              onClick={() => {
                playPopSound();
                navigate("/materi-matematika/kelas-9/persamaan-kuadrat");
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body flex items-center gap-2 mx-auto"
            >
              <Star className="w-4 h-4" /> {t.backLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PelengkapKuadratPage;
