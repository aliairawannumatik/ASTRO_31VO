import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronUp, Lightbulb, Calculator, Target, Star } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const BentukUmumPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const allSections = ["intro", "rumus", "contoh"];
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
          pageTitle: "GENERAL FORM OF A QUADRATIC EQUATION",
          subtitle: "Grade 9 · Quadratic Equations · Math Material",
          introHeader: "🚀 What Is a Quadratic Equation?",
          introCyan: (
            <>
              A quadratic equation is a polynomial equation of <strong>degree two</strong> — meaning
              the variable has a highest power of 2. The name "quadratic" comes from the Latin{" "}
              <em>quadratus</em> meaning square, because the variable is squared!
            </>
          ),
          introParag:
            "Imagine throwing a ball into the air 🏀. The ball's trajectory forms a curve (parabola) described by a quadratic equation. Want to know when the ball lands? Solve the quadratic equation!",
          introTip: (
            <>
              <strong>💡 Tip:</strong> A quadratic equation always has at most{" "}
              <strong>two roots</strong> (solutions). This is different from a linear equation which
              has only one.
            </>
          ),
          rumusHeader: "📘 General Form & Main Components",
          rumusSummaryTitle: "🎯 Key Summary",
          rumusSummaryBody: "Every quadratic equation can be written in the following standard form:",
          rumusCondition: (
            <>
              with the mandatory condition:{" "}
              <strong className="text-purple-300">
                <InlineMath math="a \neq 0" />
              </strong>
              . If <InlineMath math="a = 0" />, the equation becomes linear (not quadratic).
            </>
          ),
          cardALabel: "Coefficient",
          cardADesc: (
            <>
              Coefficient of <InlineMath math="x^2" />. Determines the{" "}
              <strong>direction of the parabola</strong> (opens up/down) and must not be 0.
            </>
          ),
          cardBLabel: "Coefficient",
          cardBDesc: (
            <>
              Coefficient of <InlineMath math="x" />. May be zero. Affects the position of the axis
              of symmetry of the parabola.
            </>
          ),
          cardCLabel: "Constant",
          cardCDesc: (
            <>
              Constant term (no variable). May be zero. Determines the{" "}
              <InlineMath math="y" />-intercept of the graph.
            </>
          ),
          tableTitle: "📊 IDENTIFICATION TABLE — EXAMPLES:",
          tableEquation: "Equation",
          rumusNote: (
            <>
              ⚠️ <strong>Important Note:</strong> The equation must first be rewritten in the form{" "}
              <InlineMath math="ax^2 + bx + c = 0" /> (all terms moved to the left, right side = 0)
              before identifying <InlineMath math="a" />, <InlineMath math="b" />,{" "}
              <InlineMath math="c" />.
            </>
          ),
          contohHeader: "📝 Practice Problems — Identifying General Form",
          levelMap: { MUDAH: "EASY", SEDANG: "MEDIUM", SULIT: "HARD" } as Record<string, string>,
          exampleLabel: "Example",
          solutionLabel: "📋 SOLUTION:",
          ex1soal: (
            <>
              Find the values of <InlineMath math="a" />, <InlineMath math="b" />, and{" "}
              <InlineMath math="c" /> from the equation <InlineMath math="3x^2 + 7x - 2 = 0" />.
            </>
          ),
          ex1sol: (
            <>
              <p>
                The equation is already in the form <InlineMath math="ax^2 + bx + c = 0" />,
                identify directly:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="3x^2 + 7x + (-2) = 0" />
              </div>
              <p>
                ✅ <strong>a = 3</strong>, <strong>b = 7</strong>, <strong>c = −2</strong>
              </p>
            </>
          ),
          ex2soal: (
            <>
              Find <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" /> from{" "}
              <InlineMath math="x^2 - 16 = 0" />.
            </>
          ),
          ex2sol: (
            <>
              <p>
                The equation takes the form{" "}
                <InlineMath math="x^2 + 0 \cdot x - 16 = 0" />. Coefficient{" "}
                <InlineMath math="b = 0" /> since there is no <InlineMath math="x" /> term.
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="1 \cdot x^2 + 0 \cdot x + (-16) = 0" />
              </div>
              <p>
                ✅ <strong>a = 1</strong>, <strong>b = 0</strong>, <strong>c = −16</strong>
              </p>
            </>
          ),
          ex3soal: (
            <>
              Rewrite in general form, then identify <InlineMath math="a" />,{" "}
              <InlineMath math="b" />, <InlineMath math="c" />:{" "}
              <InlineMath math="5x^2 = 3x - 4" />
            </>
          ),
          ex3sol: (
            <>
              <p>
                <strong>Step 1:</strong> Move all terms to the left (right side = 0):
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="5x^2 - 3x + 4 = 0" />
              </div>
              <p>
                <strong>Step 2:</strong> Identify:
              </p>
              <p>
                ✅ <strong>a = 5</strong>, <strong>b = −3</strong>, <strong>c = 4</strong>
              </p>
            </>
          ),
          ex4soal: (
            <>
              Find <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" /> from:{" "}
              <InlineMath math="(x+3)(x-5) = 0" />
            </>
          ),
          ex4sol: (
            <>
              <p>
                <strong>Step 1:</strong> Expand the two binomials (FOIL):
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 5x + 3x - 15 = 0" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 2x - 15 = 0" />
              </div>
              <p>
                <strong>Step 2:</strong> Identify:
              </p>
              <p>
                ✅ <strong>a = 1</strong>, <strong>b = −2</strong>, <strong>c = −15</strong>
              </p>
            </>
          ),
          ex5soal: (
            <>
              Rewrite in general form and identify the coefficients:{" "}
              <InlineMath math="\dfrac{x^2 - 1}{2} = 3x + 2" />
            </>
          ),
          ex5sol: (
            <>
              <p>
                <strong>Step 1:</strong> Multiply both sides by 2 to eliminate the fraction:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 1 = 6x + 4" />
              </div>
              <p>
                <strong>Step 2:</strong> Move everything to the left:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 6x - 5 = 0" />
              </div>
              <p>
                ✅ <strong>a = 1</strong>, <strong>b = −6</strong>, <strong>c = −5</strong>
              </p>
            </>
          ),
          ex6soal: (
            <>
              Is the equation <InlineMath math="(2x-1)^2 + 3 = 5x" /> a quadratic equation? If
              yes, find <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" />.
            </>
          ),
          ex6sol: (
            <>
              <p>
                <strong>Step 1:</strong> Expand <InlineMath math="(2x-1)^2" />:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="4x^2 - 4x + 1 + 3 = 5x" />
              </div>
              <p>
                <strong>Step 2:</strong> Move everything to the left:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="4x^2 - 4x + 4 - 5x = 0" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="4x^2 - 9x + 4 = 0" />
              </div>
              <p>
                <strong>Step 3:</strong> Check: <InlineMath math="a = 4 \neq 0" />, so this is a{" "}
                <strong>quadratic equation</strong>. ✅
              </p>
              <p>
                ✅ <strong>a = 4</strong>, <strong>b = −9</strong>, <strong>c = 4</strong>
              </p>
            </>
          ),
          backLabel: "Back to Quadratic Equations",
        }
      : language === "ja"
      ? {
          pageTitle: "二次方程式の一般形",
          subtitle: "中学3年 · 二次方程式 · 数学教材",
          introHeader: "🚀 二次方程式とは？",
          introCyan: (
            <>
              二次方程式は<strong>2次</strong>の多項式方程式です。つまり、変数の最大次数が2です。
              「二次」という名前はラテン語の <em>quadratus</em>（正方形）に由来し、変数が2乗されることから来ています！
            </>
          ),
          introParag:
            "ボールを空中に投げる場面を想像してみてください 🏀。ボールの軌跡は放物線（パラボラ）を形成し、それが二次方程式で表されます。ボールがいつ着地するか知りたいですか？二次方程式を解けばわかります！",
          introTip: (
            <>
              <strong>💡 ポイント：</strong> 二次方程式は常に最大<strong>2つの解（根）</strong>
              を持ちます。解が1つしかない一次方程式とは異なります。
            </>
          ),
          rumusHeader: "📘 一般形と主な構成要素",
          rumusSummaryTitle: "🎯 まとめ",
          rumusSummaryBody: "すべての二次方程式は次の標準形で書くことができます：",
          rumusCondition: (
            <>
              必須条件：
              <strong className="text-purple-300">
                <InlineMath math="a \neq 0" />
              </strong>
              。<InlineMath math="a = 0" /> の場合、方程式は一次式（二次ではない）になります。
            </>
          ),
          cardALabel: "係数",
          cardADesc: (
            <>
              <InlineMath math="x^2" /> の係数。<strong>放物線の向き</strong>
              （上向き・下向き）を決定し、0であってはなりません。
            </>
          ),
          cardBLabel: "係数",
          cardBDesc: (
            <>
              <InlineMath math="x" /> の係数。0でもよい。放物線の対称軸の位置に影響します。
            </>
          ),
          cardCLabel: "定数",
          cardCDesc: (
            <>
              定数項（変数なし）。0でもよい。グラフと <InlineMath math="y" /> 軸の交点を決定します。
            </>
          ),
          tableTitle: "📊 識別の例：",
          tableEquation: "方程式",
          rumusNote: (
            <>
              ⚠️ <strong>重要な注意：</strong> <InlineMath math="a" />、<InlineMath math="b" />、
              <InlineMath math="c" /> を特定する前に、方程式を{" "}
              <InlineMath math="ax^2 + bx + c = 0" />{" "}
              の形（すべての項を左辺に移項し、右辺=0）に変形する必要があります。
            </>
          ),
          contohHeader: "📝 練習問題 — 一般形の識別",
          levelMap: { MUDAH: "基本", SEDANG: "標準", SULIT: "発展" } as Record<string, string>,
          exampleLabel: "例題",
          solutionLabel: "📋 解説：",
          ex1soal: (
            <>
              方程式 <InlineMath math="3x^2 + 7x - 2 = 0" /> の <InlineMath math="a" />、
              <InlineMath math="b" />、<InlineMath math="c" /> の値を求めなさい。
            </>
          ),
          ex1sol: (
            <>
              <p>
                方程式はすでに <InlineMath math="ax^2 + bx + c = 0" /> の形なので、直接識別します：
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="3x^2 + 7x + (-2) = 0" />
              </div>
              <p>
                ✅ <strong>a = 3</strong>、<strong>b = 7</strong>、<strong>c = −2</strong>
              </p>
            </>
          ),
          ex2soal: (
            <>
              <InlineMath math="x^2 - 16 = 0" /> の <InlineMath math="a" />、
              <InlineMath math="b" />、<InlineMath math="c" /> を求めなさい。
            </>
          ),
          ex2sol: (
            <>
              <p>
                方程式は <InlineMath math="x^2 + 0 \cdot x - 16 = 0" /> の形です。
                <InlineMath math="x" /> の項がないため、係数 <InlineMath math="b = 0" /> です。
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="1 \cdot x^2 + 0 \cdot x + (-16) = 0" />
              </div>
              <p>
                ✅ <strong>a = 1</strong>、<strong>b = 0</strong>、<strong>c = −16</strong>
              </p>
            </>
          ),
          ex3soal: (
            <>
              一般形に変形し、<InlineMath math="a" />、<InlineMath math="b" />、
              <InlineMath math="c" /> を識別しなさい：<InlineMath math="5x^2 = 3x - 4" />
            </>
          ),
          ex3sol: (
            <>
              <p>
                <strong>手順1：</strong>すべての項を左辺に移項する（右辺=0）：
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="5x^2 - 3x + 4 = 0" />
              </div>
              <p>
                <strong>手順2：</strong>識別する：
              </p>
              <p>
                ✅ <strong>a = 5</strong>、<strong>b = −3</strong>、<strong>c = 4</strong>
              </p>
            </>
          ),
          ex4soal: (
            <>
              <InlineMath math="(x+3)(x-5) = 0" /> の <InlineMath math="a" />、
              <InlineMath math="b" />、<InlineMath math="c" /> を求めなさい。
            </>
          ),
          ex4sol: (
            <>
              <p>
                <strong>手順1：</strong>2つの二項式を展開する（FOIL法）：
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 5x + 3x - 15 = 0" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 2x - 15 = 0" />
              </div>
              <p>
                <strong>手順2：</strong>識別する：
              </p>
              <p>
                ✅ <strong>a = 1</strong>、<strong>b = −2</strong>、<strong>c = −15</strong>
              </p>
            </>
          ),
          ex5soal: (
            <>
              一般形に変形し、係数を識別しなさい：
              <InlineMath math="\dfrac{x^2 - 1}{2} = 3x + 2" />
            </>
          ),
          ex5sol: (
            <>
              <p>
                <strong>手順1：</strong>分数を消すために両辺に2をかける：
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 1 = 6x + 4" />
              </div>
              <p>
                <strong>手順2：</strong>すべて左辺に移項する：
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 6x - 5 = 0" />
              </div>
              <p>
                ✅ <strong>a = 1</strong>、<strong>b = −6</strong>、<strong>c = −5</strong>
              </p>
            </>
          ),
          ex6soal: (
            <>
              方程式 <InlineMath math="(2x-1)^2 + 3 = 5x" /> は二次方程式ですか？そうであれば、
              <InlineMath math="a" />、<InlineMath math="b" />、<InlineMath math="c" />{" "}
              を求めなさい。
            </>
          ),
          ex6sol: (
            <>
              <p>
                <strong>手順1：</strong>
                <InlineMath math="(2x-1)^2" /> を展開する：
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="4x^2 - 4x + 1 + 3 = 5x" />
              </div>
              <p>
                <strong>手順2：</strong>すべて左辺に移項する：
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="4x^2 - 4x + 4 - 5x = 0" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="4x^2 - 9x + 4 = 0" />
              </div>
              <p>
                <strong>手順3：</strong>確認：<InlineMath math="a = 4 \neq 0" />、よってこれは
                <strong>二次方程式</strong>です。✅
              </p>
              <p>
                ✅ <strong>a = 4</strong>、<strong>b = −9</strong>、<strong>c = 4</strong>
              </p>
            </>
          ),
          backLabel: "二次方程式に戻る",
        }
      : {
          pageTitle: "BENTUK UMUM PERSAMAAN KUADRAT",
          subtitle: "Kelas 9 · Persamaan Kuadrat · Materi Matematika",
          introHeader: "🚀 Apa Itu Persamaan Kuadrat?",
          introCyan: (
            <>
              Persamaan kuadrat adalah persamaan polinomial berderajat <strong>dua</strong> —
              artinya variabelnya punya pangkat tertinggi 2. Nama "kuadrat" berasal dari bahasa
              Latin <em>quadratus</em> yang berarti persegi, karena variabelnya dikuadratkan!
            </>
          ),
          introParag:
            "Coba bayangkan kamu melempar bola ke udara 🏀. Lintasan bolanya membentuk kurva (parabola) yang digambarkan oleh persamaan kuadrat. Mau tahu kapan bola mendarat? Selesaikan persamaan kuadratnya!",
          introTip: (
            <>
              <strong>💡 Tips:</strong> Persamaan kuadrat selalu punya paling banyak{" "}
              <strong>dua akar</strong> (solusi). Ini beda dengan persamaan linear yang hanya punya
              satu.
            </>
          ),
          rumusHeader: "📘 Bentuk Umum & Komponen Utama",
          rumusSummaryTitle: "🎯 Ringkasan Intisari",
          rumusSummaryBody: "Setiap persamaan kuadrat bisa ditulis dalam bentuk standar berikut:",
          rumusCondition: (
            <>
              dengan syarat wajib:{" "}
              <strong className="text-purple-300">
                <InlineMath math="a \neq 0" />
              </strong>
              . Kalau <InlineMath math="a = 0" />, persamaannya menjadi linear (bukan kuadrat).
            </>
          ),
          cardALabel: "Koefisien",
          cardADesc: (
            <>
              Koefisien <InlineMath math="x^2" />. Menentukan <strong>arah parabola</strong> (buka
              ke atas/bawah) dan tidak boleh 0.
            </>
          ),
          cardBLabel: "Koefisien",
          cardBDesc: (
            <>
              Koefisien <InlineMath math="x" />. Boleh nol. Mempengaruhi posisi sumbu simetri
              parabola.
            </>
          ),
          cardCLabel: "Konstanta",
          cardCDesc: (
            <>
              Suku bebas (tidak ada variabel). Boleh nol. Menentukan titik potong grafik dengan
              sumbu-<InlineMath math="y" />.
            </>
          ),
          tableTitle: "📊 TABEL CONTOH IDENTIFIKASI:",
          tableEquation: "Persamaan",
          rumusNote: (
            <>
              ⚠️ <strong>Catatan Penting:</strong> Persamaan harus diubah ke bentuk{" "}
              <InlineMath math="ax^2 + bx + c = 0" /> terlebih dahulu (semua suku pindah ke kiri,
              ruas kanan = 0) sebelum mengidentifikasi <InlineMath math="a" />,{" "}
              <InlineMath math="b" />, <InlineMath math="c" />.
            </>
          ),
          contohHeader: "📝 Contoh Soal — Identifikasi Bentuk Umum",
          levelMap: { MUDAH: "MUDAH", SEDANG: "SEDANG", SULIT: "SULIT" } as Record<string, string>,
          exampleLabel: "Contoh",
          solutionLabel: "📋 PEMBAHASAN:",
          ex1soal: (
            <>
              Tentukan nilai <InlineMath math="a" />, <InlineMath math="b" />, dan{" "}
              <InlineMath math="c" /> dari persamaan <InlineMath math="3x^2 + 7x - 2 = 0" />.
            </>
          ),
          ex1sol: (
            <>
              <p>
                Persamaan sudah dalam bentuk <InlineMath math="ax^2 + bx + c = 0" />, langsung
                identifikasi:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="3x^2 + 7x + (-2) = 0" />
              </div>
              <p>
                ✅ <strong>a = 3</strong>, <strong>b = 7</strong>, <strong>c = −2</strong>
              </p>
            </>
          ),
          ex2soal: (
            <>
              Tentukan <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" />{" "}
              dari <InlineMath math="x^2 - 16 = 0" />.
            </>
          ),
          ex2sol: (
            <>
              <p>
                Persamaan berbentuk <InlineMath math="x^2 + 0 \cdot x - 16 = 0" />. Koefisien{" "}
                <InlineMath math="b = 0" /> karena tidak ada suku <InlineMath math="x" />.
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="1 \cdot x^2 + 0 \cdot x + (-16) = 0" />
              </div>
              <p>
                ✅ <strong>a = 1</strong>, <strong>b = 0</strong>, <strong>c = −16</strong>
              </p>
            </>
          ),
          ex3soal: (
            <>
              Ubah ke bentuk umum, lalu identifikasi <InlineMath math="a" />,{" "}
              <InlineMath math="b" />, <InlineMath math="c" />:{" "}
              <InlineMath math="5x^2 = 3x - 4" />
            </>
          ),
          ex3sol: (
            <>
              <p>
                <strong>Langkah 1:</strong> Pindahkan semua suku ke kiri (ruas kanan = 0):
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="5x^2 - 3x + 4 = 0" />
              </div>
              <p>
                <strong>Langkah 2:</strong> Identifikasi:
              </p>
              <p>
                ✅ <strong>a = 5</strong>, <strong>b = −3</strong>, <strong>c = 4</strong>
              </p>
            </>
          ),
          ex4soal: (
            <>
              Tentukan <InlineMath math="a" />, <InlineMath math="b" />, <InlineMath math="c" />{" "}
              dari: <InlineMath math="(x+3)(x-5) = 0" />
            </>
          ),
          ex4sol: (
            <>
              <p>
                <strong>Langkah 1:</strong> Kalikan dua binomial (distribusi/FOIL):
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 5x + 3x - 15 = 0" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 2x - 15 = 0" />
              </div>
              <p>
                <strong>Langkah 2:</strong> Identifikasi:
              </p>
              <p>
                ✅ <strong>a = 1</strong>, <strong>b = −2</strong>, <strong>c = −15</strong>
              </p>
            </>
          ),
          ex5soal: (
            <>
              Ubah ke bentuk umum dan identifikasi koefisiennya:{" "}
              <InlineMath math="\dfrac{x^2 - 1}{2} = 3x + 2" />
            </>
          ),
          ex5sol: (
            <>
              <p>
                <strong>Langkah 1:</strong> Kalikan kedua ruas dengan 2 untuk menghilangkan
                pecahan:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 1 = 6x + 4" />
              </div>
              <p>
                <strong>Langkah 2:</strong> Pindahkan semua ke kiri:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="x^2 - 6x - 5 = 0" />
              </div>
              <p>
                ✅ <strong>a = 1</strong>, <strong>b = −6</strong>, <strong>c = −5</strong>
              </p>
            </>
          ),
          ex6soal: (
            <>
              Persamaan <InlineMath math="(2x-1)^2 + 3 = 5x" /> apakah merupakan persamaan
              kuadrat? Jika ya, tentukan <InlineMath math="a" />, <InlineMath math="b" />,{" "}
              <InlineMath math="c" />.
            </>
          ),
          ex6sol: (
            <>
              <p>
                <strong>Langkah 1:</strong> Ekspansi <InlineMath math="(2x-1)^2" />:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="4x^2 - 4x + 1 + 3 = 5x" />
              </div>
              <p>
                <strong>Langkah 2:</strong> Pindahkan semua ke kiri:
              </p>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="4x^2 - 4x + 4 - 5x = 0" />
              </div>
              <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                <BlockMath math="4x^2 - 9x + 4 = 0" />
              </div>
              <p>
                <strong>Langkah 3:</strong> Cek: <InlineMath math="a = 4 \neq 0" />, jadi ini{" "}
                <strong>persamaan kuadrat</strong>. ✅
              </p>
              <p>
                ✅ <strong>a = 4</strong>, <strong>b = −9</strong>, <strong>c = 4</strong>
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
      blue: "bg-blue-500/10 border-blue-500/30 text-blue-100",
      pink: "bg-pink-500/10 border-pink-500/30 text-pink-100",
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

          {/* ── INTRO ── */}
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
                <p className="font-body text-sm text-white/80 leading-relaxed">{t.introParag}</p>
                <Box color="yellow">
                  <p className="font-body text-sm">{t.introTip}</p>
                </Box>
              </div>
            )}
          </div>

          {/* ── RUMUS ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader
              id="rumus"
              icon={<Target className="w-5 h-5" />}
              iconColor="text-cyan-400"
              title={t.rumusHeader}
            />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <Box color="purple">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-3">
                    {t.rumusSummaryTitle}
                  </p>
                  <p className="font-body text-sm leading-relaxed">{t.rumusSummaryBody}</p>
                  <div className="bg-slate-900/70 rounded-lg p-3 my-2">
                    <BlockMath math="ax^2 + bx + c = 0" />
                  </div>
                  <p className="font-body text-sm leading-relaxed">{t.rumusCondition}</p>
                </Box>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Box color="green">
                    <p className="font-body text-xs font-bold text-green-300 mb-1">
                      {t.cardALabel} <InlineMath math="a" />
                    </p>
                    <p className="font-body text-xs text-white/70">{t.cardADesc}</p>
                  </Box>
                  <Box color="orange">
                    <p className="font-body text-xs font-bold text-orange-300 mb-1">
                      {t.cardBLabel} <InlineMath math="b" />
                    </p>
                    <p className="font-body text-xs text-white/70">{t.cardBDesc}</p>
                  </Box>
                  <Box color="pink">
                    <p className="font-body text-xs font-bold text-pink-300 mb-1">
                      {t.cardCLabel} <InlineMath math="c" />
                    </p>
                    <p className="font-body text-xs text-white/70">{t.cardCDesc}</p>
                  </Box>
                </div>

                <Box color="slate">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">
                    {t.tableTitle}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-2 pr-4 text-slate-300">{t.tableEquation}</th>
                          <th className="text-center py-2 px-2 text-green-300">
                            <InlineMath math="a" />
                          </th>
                          <th className="text-center py-2 px-2 text-orange-300">
                            <InlineMath math="b" />
                          </th>
                          <th className="text-center py-2 px-2 text-pink-300">
                            <InlineMath math="c" />
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2 pr-4">
                            <InlineMath math="2x^2 + 5x - 3 = 0" />
                          </td>
                          <td className="text-center px-2">2</td>
                          <td className="text-center px-2">5</td>
                          <td className="text-center px-2">-3</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2 pr-4">
                            <InlineMath math="x^2 - 9 = 0" />
                          </td>
                          <td className="text-center px-2">1</td>
                          <td className="text-center px-2">0</td>
                          <td className="text-center px-2">-9</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2 pr-4">
                            <InlineMath math="-3x^2 + 7x = 0" />
                          </td>
                          <td className="text-center px-2">-3</td>
                          <td className="text-center px-2">7</td>
                          <td className="text-center px-2">0</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4">
                            <InlineMath math="4x^2 = 0" />
                          </td>
                          <td className="text-center px-2">4</td>
                          <td className="text-center px-2">0</td>
                          <td className="text-center px-2">0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Box>

                <Box color="yellow">
                  <p className="font-body text-sm">{t.rumusNote}</p>
                </Box>
              </div>
            )}
          </div>

          {/* ── CONTOH SOAL ── */}
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

export default BentukUmumPage;
