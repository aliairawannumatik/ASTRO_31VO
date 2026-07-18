import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const MenyusunPKBaruPage = () => {
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
          pageTitle: "FORMING NEW QUADRATIC EQUATIONS",
          subtitle: "Grade 9 · Quadratic Equations · Math Material",
          introHeader: "🏗️ Building an Equation from Its Roots",
          introCyan: (
            <>
              We have been learning to <em>find the roots of an equation</em>. Now we reverse it:{" "}
              <strong>given the roots, build the equation!</strong> It's like assembling a puzzle
              from pieces you already know.
            </>
          ),
          introMethodsLabel: "There are two main methods:",
          method1Title: "Method 1: Direct",
          method1Desc: (
            <>
              From the factor <InlineMath math="(x - x_1)(x - x_2) = 0" />
            </>
          ),
          method2Title: "Method 2: Vieta's Formula",
          method2Desc: "Use the sum and product of the roots.",
          teoriHeader: "📘 Vieta's Formulas & Forming New Quadratic Equations",
          teoriSummaryTitle: "🎯 Key Summary",
          teoriSummaryBody: (
            <>
              If <InlineMath math="x_1" /> and <InlineMath math="x_2" /> are the roots of{" "}
              <InlineMath math="ax^2 + bx + c = 0" />, then <strong>Vieta's Formulas</strong> hold:
            </>
          ),
          sumLabel: "Sum of Roots",
          productLabel: "Product of Roots",
          formTitle: "🏗️ Forming a New Equation",
          formBody: (
            <>
              If the roots <InlineMath math="x_1" /> and <InlineMath math="x_2" /> are known, form
              the equation:
            </>
          ),
          tipBody: (
            <>
              <strong>💡 Tip:</strong> Remember the pattern —{" "}
              <em>the coefficient of x is the negative of the sum of roots</em>, and{" "}
              <em>the constant is the product of roots</em>!
            </>
          ),
          contohHeader: "📝 Practice Problems — Forming New Quadratic Equations",
          levelMap: { MUDAH: "EASY", SEDANG: "MEDIUM", SULIT: "HARD" } as Record<string, string>,
          exampleLabel: "Example",
          solutionLabel: "📋 SOLUTION:",
          ex1soal: (
            <>
              Form a quadratic equation whose roots are <InlineMath math="3" /> and{" "}
              <InlineMath math="5" />.
            </>
          ),
          ex1sol: (
            <>
              <p>Direct method:</p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="(x - 3)(x - 5) = 0" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 8x + 15 = 0" />
              </div>
              <p>
                ✅ Equation: <strong><InlineMath math="x^2 - 8x + 15 = 0" /></strong>
              </p>
            </>
          ),
          ex2soal: (
            <>
              Form a quadratic equation whose roots are <InlineMath math="-2" /> and{" "}
              <InlineMath math="7" />.
            </>
          ),
          ex2sol: (
            <>
              <p>
                Sum: <InlineMath math="-2 + 7 = 5" />, Product:{" "}
                <InlineMath math="(-2)(7) = -14" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 5x + (-14) = 0" />
              </div>
              <p>
                ✅ <strong><InlineMath math="x^2 - 5x - 14 = 0" /></strong>
              </p>
            </>
          ),
          ex3soal: (
            <>
              Given that <InlineMath math="x_1" /> and <InlineMath math="x_2" /> are the roots of{" "}
              <InlineMath math="x^2 - 6x + 8 = 0" />. Form a new quadratic equation whose roots are{" "}
              <InlineMath math="2x_1" /> and <InlineMath math="2x_2" />.
            </>
          ),
          ex3sol: (
            <>
              <p>
                From Vieta: <InlineMath math="x_1 + x_2 = 6" /> and{" "}
                <InlineMath math="x_1 x_2 = 8" />
              </p>
              <p>
                New roots: sum = <InlineMath math="2(x_1 + x_2) = 12" />, product ={" "}
                <InlineMath math="4x_1 x_2 = 32" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 12x + 32 = 0" />
              </div>
              <p>
                ✅ <strong><InlineMath math="x^2 - 12x + 32 = 0" /></strong>
              </p>
            </>
          ),
          ex4soal: (
            <>
              Given that <InlineMath math="x_1" /> and <InlineMath math="x_2" /> are the roots of{" "}
              <InlineMath math="x^2 - 5x + 4 = 0" />. Form a new quadratic equation whose roots are{" "}
              <InlineMath math="(x_1 + 1)" /> and <InlineMath math="(x_2 + 1)" />.
            </>
          ),
          ex4sol: (
            <>
              <p>
                From Vieta: <InlineMath math="x_1 + x_2 = 5" />,{" "}
                <InlineMath math="x_1 x_2 = 4" />
              </p>
              <p>
                New root sum:{" "}
                <InlineMath math="(x_1+1)+(x_2+1) = 5+2 = 7" />
              </p>
              <p>
                New root product:{" "}
                <InlineMath math="(x_1+1)(x_2+1) = x_1x_2 + x_1 + x_2 + 1 = 4+5+1 = 10" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 7x + 10 = 0" />
              </div>
              <p>
                ✅ <strong><InlineMath math="x^2 - 7x + 10 = 0" /></strong>
              </p>
            </>
          ),
          ex5soal: (
            <>
              The roots of <InlineMath math="2x^2 - 4x - 6 = 0" /> are <InlineMath math="x_1" />{" "}
              and <InlineMath math="x_2" />. Find the value of{" "}
              <InlineMath math="x_1^2 + x_2^2" />.
            </>
          ),
          ex5sol: (
            <>
              <p>
                From Vieta (<InlineMath math="a=2, b=-4, c=-6" />):{" "}
                <InlineMath math="x_1+x_2 = 2" />, <InlineMath math="x_1 x_2 = -3" />
              </p>
              <p>Using the identity:</p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x_1^2 + x_2^2 = (x_1+x_2)^2 - 2x_1x_2 = 4 - 2(-3) = 4 + 6 = 10" />
              </div>
              <p>
                ✅ <InlineMath math="x_1^2 + x_2^2 = 10" />
              </p>
            </>
          ),
          ex6soal: (
            <>
              Form a new quadratic equation whose roots are <InlineMath math="\dfrac{1}{x_1}" /> and{" "}
              <InlineMath math="\dfrac{1}{x_2}" />, if <InlineMath math="x_1, x_2" /> are the roots
              of <InlineMath math="3x^2 - 7x + 2 = 0" />.
            </>
          ),
          ex6sol: (
            <>
              <p>
                From Vieta: <InlineMath math="x_1+x_2 = \frac{7}{3}" />,{" "}
                <InlineMath math="x_1 x_2 = \frac{2}{3}" />
              </p>
              <p>
                New root sum:{" "}
                <InlineMath math="\frac{1}{x_1}+\frac{1}{x_2} = \frac{x_1+x_2}{x_1 x_2} = \frac{7/3}{2/3} = \frac{7}{2}" />
              </p>
              <p>
                New root product:{" "}
                <InlineMath math="\frac{1}{x_1} \cdot \frac{1}{x_2} = \frac{1}{x_1 x_2} = \frac{3}{2}" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - \frac{7}{2}x + \frac{3}{2} = 0 \quad \times 2" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="2x^2 - 7x + 3 = 0" />
              </div>
              <p>
                ✅ <strong><InlineMath math="2x^2 - 7x + 3 = 0" /></strong>
              </p>
            </>
          ),
          backLabel: "Back to Quadratic Equations",
        }
      : language === "ja"
      ? {
          pageTitle: "新しい二次方程式の作成",
          subtitle: "中学3年 · 二次方程式 · 数学教材",
          introHeader: "🏗️ 解から方程式を作る",
          introCyan: (
            <>
              これまでは<em>方程式から解を求める</em>ことを学んできました。今度は逆です：
              <strong>解が与えられたら、方程式を作りましょう！</strong>
              すでに知っているピースからパズルを組み立てるようなものです。
            </>
          ),
          introMethodsLabel: "主な方法は2つあります：",
          method1Title: "方法1：直接法",
          method1Desc: (
            <>
              因数 <InlineMath math="(x - x_1)(x - x_2) = 0" /> から
            </>
          ),
          method2Title: "方法2：ヴィエタの公式",
          method2Desc: "解の和と積を使う。",
          teoriHeader: "📘 ヴィエタの公式と新しい二次方程式の作成",
          teoriSummaryTitle: "🎯 まとめ",
          teoriSummaryBody: (
            <>
              <InlineMath math="x_1" /> と <InlineMath math="x_2" /> が{" "}
              <InlineMath math="ax^2 + bx + c = 0" /> の解であるとき、
              <strong>ヴィエタの公式</strong>が成り立ちます：
            </>
          ),
          sumLabel: "解の和",
          productLabel: "解の積",
          formTitle: "🏗️ 新しい方程式の作成",
          formBody: (
            <>
              解 <InlineMath math="x_1" /> と <InlineMath math="x_2" /> がわかっているとき、
              方程式を作る：
            </>
          ),
          tipBody: (
            <>
              <strong>💡 ポイント：</strong> パターンを覚えておきましょう —{" "}
              <em>xの係数は解の和の符号を変えたもの</em>、
              <em>定数は解の積</em>です！
            </>
          ),
          contohHeader: "📝 練習問題 — 新しい二次方程式の作成",
          levelMap: { MUDAH: "基本", SEDANG: "標準", SULIT: "発展" } as Record<string, string>,
          exampleLabel: "例題",
          solutionLabel: "📋 解説：",
          ex1soal: (
            <>
              解が <InlineMath math="3" /> と <InlineMath math="5" /> である二次方程式を作りなさい。
            </>
          ),
          ex1sol: (
            <>
              <p>直接法：</p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="(x - 3)(x - 5) = 0" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 8x + 15 = 0" />
              </div>
              <p>
                ✅ 方程式：<strong><InlineMath math="x^2 - 8x + 15 = 0" /></strong>
              </p>
            </>
          ),
          ex2soal: (
            <>
              解が <InlineMath math="-2" /> と <InlineMath math="7" /> である二次方程式を作りなさい。
            </>
          ),
          ex2sol: (
            <>
              <p>
                和：<InlineMath math="-2 + 7 = 5" />、積：<InlineMath math="(-2)(7) = -14" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 5x + (-14) = 0" />
              </div>
              <p>
                ✅ <strong><InlineMath math="x^2 - 5x - 14 = 0" /></strong>
              </p>
            </>
          ),
          ex3soal: (
            <>
              <InlineMath math="x^2 - 6x + 8 = 0" /> の解を <InlineMath math="x_1" />、
              <InlineMath math="x_2" /> とする。解が <InlineMath math="2x_1" /> と{" "}
              <InlineMath math="2x_2" /> の新しい二次方程式を作りなさい。
            </>
          ),
          ex3sol: (
            <>
              <p>
                ヴィエタより：<InlineMath math="x_1 + x_2 = 6" />、
                <InlineMath math="x_1 x_2 = 8" />
              </p>
              <p>
                新しい解：和 = <InlineMath math="2(x_1 + x_2) = 12" />、積 ={" "}
                <InlineMath math="4x_1 x_2 = 32" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 12x + 32 = 0" />
              </div>
              <p>
                ✅ <strong><InlineMath math="x^2 - 12x + 32 = 0" /></strong>
              </p>
            </>
          ),
          ex4soal: (
            <>
              <InlineMath math="x^2 - 5x + 4 = 0" /> の解を <InlineMath math="x_1" />、
              <InlineMath math="x_2" /> とする。解が <InlineMath math="(x_1 + 1)" /> と{" "}
              <InlineMath math="(x_2 + 1)" /> の新しい二次方程式を作りなさい。
            </>
          ),
          ex4sol: (
            <>
              <p>
                ヴィエタより：<InlineMath math="x_1 + x_2 = 5" />、
                <InlineMath math="x_1 x_2 = 4" />
              </p>
              <p>
                新しい解の和：
                <InlineMath math="(x_1+1)+(x_2+1) = 5+2 = 7" />
              </p>
              <p>
                新しい解の積：
                <InlineMath math="(x_1+1)(x_2+1) = x_1x_2 + x_1 + x_2 + 1 = 4+5+1 = 10" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 7x + 10 = 0" />
              </div>
              <p>
                ✅ <strong><InlineMath math="x^2 - 7x + 10 = 0" /></strong>
              </p>
            </>
          ),
          ex5soal: (
            <>
              <InlineMath math="2x^2 - 4x - 6 = 0" /> の解を <InlineMath math="x_1" />、
              <InlineMath math="x_2" /> とする。<InlineMath math="x_1^2 + x_2^2" />{" "}
              の値を求めなさい。
            </>
          ),
          ex5sol: (
            <>
              <p>
                ヴィエタより（<InlineMath math="a=2, b=-4, c=-6" />）：
                <InlineMath math="x_1+x_2 = 2" />、<InlineMath math="x_1 x_2 = -3" />
              </p>
              <p>恒等式を使う：</p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x_1^2 + x_2^2 = (x_1+x_2)^2 - 2x_1x_2 = 4 - 2(-3) = 4 + 6 = 10" />
              </div>
              <p>
                ✅ <InlineMath math="x_1^2 + x_2^2 = 10" />
              </p>
            </>
          ),
          ex6soal: (
            <>
              <InlineMath math="x_1" />、<InlineMath math="x_2" /> が{" "}
              <InlineMath math="3x^2 - 7x + 2 = 0" /> の解であるとき、解が{" "}
              <InlineMath math="\dfrac{1}{x_1}" /> と <InlineMath math="\dfrac{1}{x_2}" />{" "}
              の新しい二次方程式を作りなさい。
            </>
          ),
          ex6sol: (
            <>
              <p>
                ヴィエタより：<InlineMath math="x_1+x_2 = \frac{7}{3}" />、
                <InlineMath math="x_1 x_2 = \frac{2}{3}" />
              </p>
              <p>
                新しい解の和：
                <InlineMath math="\frac{1}{x_1}+\frac{1}{x_2} = \frac{x_1+x_2}{x_1 x_2} = \frac{7/3}{2/3} = \frac{7}{2}" />
              </p>
              <p>
                新しい解の積：
                <InlineMath math="\frac{1}{x_1} \cdot \frac{1}{x_2} = \frac{1}{x_1 x_2} = \frac{3}{2}" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - \frac{7}{2}x + \frac{3}{2} = 0 \quad \times 2" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="2x^2 - 7x + 3 = 0" />
              </div>
              <p>
                ✅ <strong><InlineMath math="2x^2 - 7x + 3 = 0" /></strong>
              </p>
            </>
          ),
          backLabel: "二次方程式に戻る",
        }
      : {
          pageTitle: "MENYUSUN PERSAMAAN KUADRAT BARU",
          subtitle: "Kelas 9 · Persamaan Kuadrat · Materi Matematika",
          introHeader: "🏗️ Membangun Persamaan dari Akar-Akarnya",
          introCyan: (
            <>
              Selama ini kita belajar <em>mencari akar dari persamaan</em>. Sekarang kita balik:{" "}
              <strong>diberi akar-akarnya, susun persamaannya!</strong> Ini seperti membangun
              teka-teki dari potongan yang sudah diketahui.
            </>
          ),
          introMethodsLabel: "Ada dua cara utama:",
          method1Title: "Cara 1: Langsung",
          method1Desc: (
            <>
              Dari faktor <InlineMath math="(x - x_1)(x - x_2) = 0" />
            </>
          ),
          method2Title: "Cara 2: Rumus Vieta",
          method2Desc: "Gunakan jumlah dan hasil kali akar-akar.",
          teoriHeader: "📘 Rumus Vieta & Cara Menyusun PK Baru",
          teoriSummaryTitle: "🎯 Ringkasan Intisari",
          teoriSummaryBody: (
            <>
              Jika <InlineMath math="x_1" /> dan <InlineMath math="x_2" /> adalah akar-akar dari{" "}
              <InlineMath math="ax^2 + bx + c = 0" />, maka berlaku <strong>Rumus Vieta</strong>:
            </>
          ),
          sumLabel: "Jumlah Akar",
          productLabel: "Hasil Kali Akar",
          formTitle: "🏗️ Menyusun Persamaan Baru",
          formBody: (
            <>
              Jika diketahui akar-akar <InlineMath math="x_1" /> dan <InlineMath math="x_2" />,
              susun persamaan:
            </>
          ),
          tipBody: (
            <>
              <strong>💡 Tips:</strong> Ingat polanya —{" "}
              <em>koefisien x adalah negatif dari jumlah akar</em>, dan{" "}
              <em>konstanta adalah hasil kali akar</em>!
            </>
          ),
          contohHeader: "📝 Contoh Soal — Menyusun Persamaan Kuadrat Baru",
          levelMap: { MUDAH: "MUDAH", SEDANG: "SEDANG", SULIT: "SULIT" } as Record<string, string>,
          exampleLabel: "Contoh",
          solutionLabel: "📋 PEMBAHASAN:",
          ex1soal: (
            <>
              Susun persamaan kuadrat yang akar-akarnya <InlineMath math="3" /> dan{" "}
              <InlineMath math="5" />.
            </>
          ),
          ex1sol: (
            <>
              <p>Cara langsung:</p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="(x - 3)(x - 5) = 0" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 8x + 15 = 0" />
              </div>
              <p>
                ✅ Persamaan: <strong><InlineMath math="x^2 - 8x + 15 = 0" /></strong>
              </p>
            </>
          ),
          ex2soal: (
            <>
              Susun persamaan kuadrat yang akar-akarnya <InlineMath math="-2" /> dan{" "}
              <InlineMath math="7" />.
            </>
          ),
          ex2sol: (
            <>
              <p>
                Jumlah: <InlineMath math="-2 + 7 = 5" />, Hasil kali:{" "}
                <InlineMath math="(-2)(7) = -14" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 5x + (-14) = 0" />
              </div>
              <p>
                ✅ <strong><InlineMath math="x^2 - 5x - 14 = 0" /></strong>
              </p>
            </>
          ),
          ex3soal: (
            <>
              Diketahui akar-akar <InlineMath math="x^2 - 6x + 8 = 0" /> adalah{" "}
              <InlineMath math="x_1" /> dan <InlineMath math="x_2" />. Susun persamaan kuadrat baru
              yang akar-akarnya <InlineMath math="2x_1" /> dan <InlineMath math="2x_2" />.
            </>
          ),
          ex3sol: (
            <>
              <p>
                Dari Vieta: <InlineMath math="x_1 + x_2 = 6" /> dan{" "}
                <InlineMath math="x_1 x_2 = 8" />
              </p>
              <p>
                Akar baru: jumlah = <InlineMath math="2(x_1 + x_2) = 12" />, hasil kali ={" "}
                <InlineMath math="4x_1 x_2 = 32" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 12x + 32 = 0" />
              </div>
              <p>
                ✅ <strong><InlineMath math="x^2 - 12x + 32 = 0" /></strong>
              </p>
            </>
          ),
          ex4soal: (
            <>
              Diketahui akar-akar <InlineMath math="x^2 - 5x + 4 = 0" /> adalah{" "}
              <InlineMath math="x_1" /> dan <InlineMath math="x_2" />. Susun PK baru yang
              akar-akarnya <InlineMath math="(x_1 + 1)" /> dan <InlineMath math="(x_2 + 1)" />.
            </>
          ),
          ex4sol: (
            <>
              <p>
                Dari Vieta: <InlineMath math="x_1 + x_2 = 5" />,{" "}
                <InlineMath math="x_1 x_2 = 4" />
              </p>
              <p>
                Jumlah akar baru:{" "}
                <InlineMath math="(x_1+1)+(x_2+1) = 5+2 = 7" />
              </p>
              <p>
                Hasil kali baru:{" "}
                <InlineMath math="(x_1+1)(x_2+1) = x_1x_2 + x_1 + x_2 + 1 = 4+5+1 = 10" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 7x + 10 = 0" />
              </div>
              <p>
                ✅ <strong><InlineMath math="x^2 - 7x + 10 = 0" /></strong>
              </p>
            </>
          ),
          ex5soal: (
            <>
              Akar-akar <InlineMath math="2x^2 - 4x - 6 = 0" /> adalah <InlineMath math="x_1" />{" "}
              dan <InlineMath math="x_2" />. Tentukan nilai <InlineMath math="x_1^2 + x_2^2" />.
            </>
          ),
          ex5sol: (
            <>
              <p>
                Dari Vieta (<InlineMath math="a=2, b=-4, c=-6" />):{" "}
                <InlineMath math="x_1+x_2 = 2" />, <InlineMath math="x_1 x_2 = -3" />
              </p>
              <p>Gunakan identitas:</p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x_1^2 + x_2^2 = (x_1+x_2)^2 - 2x_1x_2 = 4 - 2(-3) = 4 + 6 = 10" />
              </div>
              <p>
                ✅ <InlineMath math="x_1^2 + x_2^2 = 10" />
              </p>
            </>
          ),
          ex6soal: (
            <>
              Susun PK baru yang akar-akarnya adalah <InlineMath math="\dfrac{1}{x_1}" /> dan{" "}
              <InlineMath math="\dfrac{1}{x_2}" />, jika <InlineMath math="x_1, x_2" /> adalah
              akar-akar dari <InlineMath math="3x^2 - 7x + 2 = 0" />.
            </>
          ),
          ex6sol: (
            <>
              <p>
                Dari Vieta: <InlineMath math="x_1+x_2 = \frac{7}{3}" />,{" "}
                <InlineMath math="x_1 x_2 = \frac{2}{3}" />
              </p>
              <p>
                Jumlah akar baru:{" "}
                <InlineMath math="\frac{1}{x_1}+\frac{1}{x_2} = \frac{x_1+x_2}{x_1 x_2} = \frac{7/3}{2/3} = \frac{7}{2}" />
              </p>
              <p>
                Hasil kali akar baru:{" "}
                <InlineMath math="\frac{1}{x_1} \cdot \frac{1}{x_2} = \frac{1}{x_1 x_2} = \frac{3}{2}" />
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - \frac{7}{2}x + \frac{3}{2} = 0 \quad \times 2" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="2x^2 - 7x + 3 = 0" />
              </div>
              <p>
                ✅ <strong><InlineMath math="2x^2 - 7x + 3 = 0" /></strong>
              </p>
            </>
          ),
          backLabel: "Kembali ke Persamaan Kuadrat",
        };

  const SectionHeader = ({ id, icon, iconColor, title }: { id: string; icon: React.ReactNode; iconColor: string; title: React.ReactNode }) => (
    <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
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

  const Dark = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-slate-900/70 rounded-lg p-3 my-2">{children}</div>
  );

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
                <p className="font-body text-sm text-white/80">{t.introMethodsLabel}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Box color="green">
                    <p className="font-body text-xs font-bold text-green-300 mb-1">{t.method1Title}</p>
                    <p className="font-body text-xs text-white/70">{t.method1Desc}</p>
                  </Box>
                  <Box color="orange">
                    <p className="font-body text-xs font-bold text-orange-300 mb-1">{t.method2Title}</p>
                    <p className="font-body text-xs text-white/70">{t.method2Desc}</p>
                  </Box>
                </div>
              </div>
            )}
          </div>

          {/* TEORI */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="teori" icon={<Target className="w-5 h-5" />} iconColor="text-orange-400" title={t.teoriHeader} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">{t.teoriSummaryTitle}</p>
                  <p className="font-body text-sm mb-2">{t.teoriSummaryBody}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <Box color="green">
                      <p className="font-body text-xs text-green-300 font-bold">{t.sumLabel}</p>
                      <Dark><BlockMath math="x_1 + x_2 = -\frac{b}{a}" /></Dark>
                    </Box>
                    <Box color="orange">
                      <p className="font-body text-xs text-orange-300 font-bold">{t.productLabel}</p>
                      <Dark><BlockMath math="x_1 \cdot x_2 = \frac{c}{a}" /></Dark>
                    </Box>
                  </div>
                </Box>
                <Box color="cyan">
                  <p className="font-body text-xs font-bold text-cyan-300 mb-2">{t.formTitle}</p>
                  <p className="font-body text-xs text-white/80 mb-2">{t.formBody}</p>
                  <Dark>
                    <BlockMath math="x^2 - (x_1 + x_2)x + x_1 \cdot x_2 = 0" />
                  </Dark>
                </Box>
                <Box color="yellow">
                  <p className="font-body text-sm">{t.tipBody}</p>
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

export default MenyusunPKBaruPage;
