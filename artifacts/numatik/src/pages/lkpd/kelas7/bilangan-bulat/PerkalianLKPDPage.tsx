import { useLanguage } from "@/contexts/LanguageContext";
import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";

const PerkalianLKPDPage = () => {
  const { language } = useLanguage();
  const L = language;

  const s = (id: string, en: string, ja: string) => L === "en" ? en : L === "ja" ? ja : id;

  const guidedItems: GuidedItem[] = [
    {
      id: "g1",
      label: s(
        "Perkalian dua bilangan bertanda SAMA (positif × positif atau negatif × negatif) menghasilkan bilangan ...",
        "Multiplying two numbers with the SAME sign (positive × positive or negative × negative) gives a ... number",
        "符号が同じ2数の積（正×正、または負×負）は ... になります"
      ),
      kind: "choice",
      options: L === "en"
        ? ["positive", "negative", "always zero", "depends on size"]
        : L === "ja"
        ? ["正の数", "負の数", "常にゼロ", "大きさによる"]
        : ["positif", "negatif", "selalu nol", "tergantung besar"],
      correctIndex: 0,
      discussion: [
        s("+ × + = + dan − × − = +.", "+ × + = + and − × − = +.", "+ × + = + そして − × − = +。"),
        s("Tanda sama menghasilkan positif.", "Same signs give a positive result.", "符号が同じならば結果は正になります。"),
      ],
    },
    {
      id: "g2",
      label: "(-6) × 7 = ...",
      kind: "fill",
      answers: ["-42"],
      discussion: [
        s("Tanda berbeda: hasil negatif.", "Different signs: negative result.", "符号が異なる：結果は負になります。"),
        s("6 × 7 = 42, jadi -42.", "6 × 7 = 42, so -42.", "6 × 7 = 42、したがって -42。"),
      ],
    },
    {
      id: "g3",
      label: s(
        "Benar atau salah: \"Hasil perkalian bilangan bulat dengan 0 selalu 0.\"",
        "True or false: \"The product of any integer and 0 is always 0.\"",
        "正誤問題：「任意の整数と0の積は常に0です。」"
      ),
      kind: "truefalse",
      correct: true,
      discussion: [s("Sifat absorpsi nol: a × 0 = 0 untuk semua a.", "Zero absorption property: a × 0 = 0 for all a.", "ゼロの吸収性：すべての a に対して a × 0 = 0。")],
    },
    {
      id: "g4",
      label: s(
        "Jodohkan perkalian dengan hasilnya:",
        "Match each multiplication with its result:",
        "積と答えを結びましょう："
      ),
      kind: "match",
      pairs: [
        { left: "(-4) × (-5)", right: "20" },
        { left: "8 × (-3)", right: "-24" },
        { left: "(-7) × 9", right: "-63" },
        { left: "(-6) × 0", right: "0" },
      ],
      discussion: [
        s("(-4) × (-5) = 20 (sama-sama negatif).", "(-4) × (-5) = 20 (both negative).", "(-4) × (-5) = 20（両方負の数）。"),
        s("8 × (-3) = -24 (beda tanda).", "8 × (-3) = -24 (different signs).", "8 × (-3) = -24（符号が異なる）。"),
        s("(-7) × 9 = -63 (beda tanda).", "(-7) × 9 = -63 (different signs).", "(-7) × 9 = -63（符号が異なる）。"),
        "(-6) × 0 = 0.",
      ],
    },
    {
      id: "g5",
      label: s(
        "Urutkan dari yang terkecil ke terbesar:",
        "Sort from smallest to largest:",
        "小さい順に並べましょう："
      ),
      kind: "sort",
      items: ["(-3) × 4", "(-2) × (-5)", "5 × (-1)", "(-4) × (-3)"],
      correctOrder: ["(-3) × 4", "5 × (-1)", "(-2) × (-5)", "(-4) × (-3)"],
      discussion: [
        s("(-3) × 4 = -12 (terkecil).", "(-3) × 4 = -12 (smallest).", "(-3) × 4 = -12（最小）。"),
        "5 × (-1) = -5.",
        "(-2) × (-5) = 10.",
        s("(-4) × (-3) = 12 (terbesar).", "(-4) × (-3) = 12 (largest).", "(-4) × (-3) = 12（最大）。"),
      ],
    },
    {
      id: "g6",
      label: s("Sifat komutatif perkalian: a × b = ...", "Commutative property of multiplication: a × b = ...", "乗法の交換法則：a × b = ..."),
      kind: "fill",
      answers: ["b×a", "ba", "b*a"],
      discussion: [
        s("a × b = b × a (komutatif).", "a × b = b × a (commutative).", "a × b = b × a（交換法則）。"),
        s("Misal: 4 × 7 = 7 × 4 = 28.", "Example: 4 × 7 = 7 × 4 = 28.", "例：4 × 7 = 7 × 4 = 28。"),
      ],
    },
    {
      id: "g7",
      label: s(
        "Pilih bentuk yang BENAR untuk sifat distributif:",
        "Choose the CORRECT form of the distributive property:",
        "分配法則の正しい形を選んでください："
      ),
      kind: "choice",
      options: [
        "a × (b + c) = a × b + a × c",
        "a × (b + c) = a + b × c",
        "(a + b) × c = a × b + c",
        "a × b × c = (a + b) × c",
      ],
      correctIndex: 0,
      discussion: [
        s("Sifat distributif: a × (b + c) = a × b + a × c.", "Distributive property: a × (b + c) = a × b + a × c.", "分配法則：a × (b + c) = a × b + a × c。"),
        s("Membuka tanda kurung dengan mengalikan ke setiap suku.", "Expand the brackets by multiplying each term.", "括弧を展開して各項に掛け算します。"),
      ],
    },
  ];

  const practiceItems: PracticeItem[] = [
    {
      id: "p1",
      question: s("Hitung: (-12) × (-8)", "Calculate: (-12) × (-8)", "計算しましょう：(-12) × (-8)"),
      kind: "fill",
      answers: ["96"],
      hint: s("Sama-sama negatif → positif. 12 × 8 = ?", "Both negative → positive. 12 × 8 = ?", "両方負の数 → 正の数。12 × 8 = ?"),
      discussion: ["(-12) × (-8) = +96."],
    },
    {
      id: "p2",
      question: s("Pilih hasil yang benar untuk 15 × (-4):", "Choose the correct result for 15 × (-4):", "15 × (-4) の正しい答えを選んでください："),
      kind: "choice",
      options: ["-60", "60", "-19", "19"],
      correctIndex: 0,
      hint: s("Beda tanda: hasilnya negatif.", "Different signs: negative result.", "符号が異なる：結果は負になります。"),
      discussion: [s("15 × 4 = 60, tanda berbeda → -60.", "15 × 4 = 60, different signs → -60.", "15 × 4 = 60、符号が異なる → -60。")],
    },
    {
      id: "p3",
      question: s(
        "Benar atau salah: \"(-1) × (-1) × (-1) = -1.\"",
        "True or false: \"(-1) × (-1) × (-1) = -1.\"",
        "正誤問題：「(-1) × (-1) × (-1) = -1。」"
      ),
      kind: "truefalse",
      correct: true,
      hint: s("Banyak tanda negatif ganjil = negatif.", "Odd number of negative signs = negative.", "負の符号が奇数個 = 負の数。"),
      discussion: [
        s("3 tanda negatif (ganjil) → hasil negatif.", "3 negative signs (odd) → negative result.", "負の符号が3個（奇数）→ 結果は負。"),
        "(-1) × (-1) × (-1) = -1.",
      ],
    },
    {
      id: "p4",
      question: s("Jodohkan perkalian dengan hasilnya:", "Match each multiplication with its result:", "積と答えを結びましょう："),
      kind: "match",
      pairs: [
        { left: "(-9) × 11", right: "-99" },
        { left: "(-13) × (-4)", right: "52" },
        { left: "25 × (-6)", right: "-150" },
        { left: "(-100) × 0", right: "0" },
      ],
      hint: s("Tentukan tanda dahulu, lalu hitung.", "Determine the sign first, then calculate.", "まず符号を決めてから計算しましょう。"),
      discussion: [
        "(-9) × 11 = -99.",
        "(-13) × (-4) = 52.",
        "25 × (-6) = -150.",
        "(-100) × 0 = 0.",
      ],
    },
    {
      id: "p5",
      question: s(
        "Sebuah lift turun 4 lantai per detik. Setelah 7 detik, lift bergerak ... lantai (gunakan tanda).",
        "An elevator descends 4 floors per second. After 7 seconds, the elevator moves ... floors (use sign).",
        "エレベーターが毎秒4階下がります。7秒後、エレベーターは ... 階移動します（符号を使いましょう）。"
      ),
      kind: "fill",
      answers: ["-28"],
      hint: s("Turun = negatif. (-4) × 7.", "Down = negative. (-4) × 7.", "下 = 負の数。(-4) × 7。"),
      discussion: [
        "(-4) × 7 = -28.",
        s("Lift bergerak -28 lantai (turun 28 lantai).", "The elevator moves -28 floors (descends 28 floors).", "エレベーターは -28 階移動します（28階下がる）。"),
      ],
    },
    {
      id: "p6",
      question: s(
        "Hitung: 4 × (15 − 8) menggunakan sifat distributif.",
        "Calculate: 4 × (15 − 8) using the distributive property.",
        "分配法則を使って計算しましょう：4 × (15 − 8)。"
      ),
      kind: "fill",
      answers: ["28"],
      hint: s("4 × 15 − 4 × 8 = 60 − 32.", "4 × 15 − 4 × 8 = 60 − 32.", "4 × 15 − 4 × 8 = 60 − 32。"),
      discussion: ["4 × (15 − 8) = 4 × 15 − 4 × 8 = 60 − 32 = 28."],
    },
  ];

  const situations: SituationCard[] = [
    {
      title: s("Situasi: Aturan Tanda", "Situation: Sign Rule", "状況：符号のルール"),
      visual: (
        <div className="text-center space-y-1">
          <p className="text-lg font-bold text-white">+ × + = +    − × − = +</p>
          <p className="text-lg font-bold text-white">+ × − = −    − × + = −</p>
        </div>
      ),
      text: s(
        "Tanda sama → positif, tanda beda → negatif.",
        "Same signs → positive, different signs → negative.",
        "符号が同じ → 正、符号が異なる → 負。"
      ),
    },
    {
      title: s("Situasi: Pengulangan", "Situation: Repeated Motion", "状況：繰り返しの動き"),
      visual: (
        <div className="text-center space-y-1">
          <p className="text-3xl">⬇️ ⬇️ ⬇️</p>
          <p className="text-lg font-bold text-white">
            {s("Lift turun 4 lantai × 3 kali", "Elevator down 4 floors × 3 times", "エレベーター 4階下 × 3回")}
          </p>
          <p className="text-sm text-white/65">(-4) × 3 = -12 {s("lantai", "floors", "階")}</p>
        </div>
      ),
      text: s(
        "Perkalian sebagai pengulangan: berapa kali pergerakan terjadi.",
        "Multiplication as repetition: how many times a movement occurs.",
        "乗法は繰り返しを表す：動きが何回起きるか。"
      ),
    },
  ];

  const summaryCards: SummaryCard[] = [
    {
      title: s("Aturan Tanda", "Sign Rule", "符号のルール"),
      text: s(
        "Tanda sama → positif, tanda berbeda → negatif. a × 0 = 0.",
        "Same signs → positive, different signs → negative. a × 0 = 0.",
        "符号が同じ → 正、符号が異なる → 負。a × 0 = 0。"
      ),
      tone: "cyan",
    },
    {
      title: s("Sifat", "Properties", "性質"),
      text: s(
        "Komutatif (a×b=b×a), asosiatif, distributif terhadap penjumlahan/pengurangan.",
        "Commutative (a×b=b×a), associative, distributive over addition/subtraction.",
        "交換法則（a×b=b×a）、結合法則、加減法に対する分配法則。"
      ),
      tone: "yellow",
    },
    {
      title: s("Banyak Tanda Negatif", "Number of Negative Signs", "負の符号の個数"),
      text: s(
        "Genap → positif, ganjil → negatif.",
        "Even → positive, odd → negative.",
        "偶数個 → 正、奇数個 → 負。"
      ),
      tone: "emerald",
    },
  ];

  return (
    <InteractiveLKPD
      badgeText={s("LKPD Interaktif Matematika Kelas 7", "Interactive Math LKPD Grade 7", "数学インタラクティブワークシート 中学1年")}
      title={s("Perkalian Bilangan Bulat", "Integer Multiplication", "整数の掛け算")}
      intro={s(
        "LKPD ini melatih Sobat Numatik menentukan aturan tanda dan sifat perkalian bilangan bulat.",
        "This worksheet trains NUMATIK Friends to determine sign rules and properties of integer multiplication.",
        "このワークシートでは、NUMATIKフレンドが整数の掛け算の符号のルールと性質を習得します。"
      )}
      situations={situations}
      guidedIntro={s(
        "Kerjakan setiap soal untuk menemukan aturan tanda perkalian.",
        "Complete each question to discover the sign rules of multiplication.",
        "各問題を解いて、掛け算の符号のルールを発見しましょう。"
      )}
      guidedItems={guidedItems}
      summaryCards={summaryCards}
      practiceIntro={s(
        "Tentukan tanda hasilnya dahulu, baru hitung perkaliannya.",
        "Determine the sign of the result first, then calculate the product.",
        "まず結果の符号を決めてから、掛け算を計算しましょう。"
      )}
      practiceItems={practiceItems}
      prevPath="/lkpd/kelas-7/bilangan-bulat"
      backLabel={s("Kembali ke LKPD Bilangan Bulat", "Back to Integer LKPD", "整数のワークシートに戻る")}
    />
  );
};

export default PerkalianLKPDPage;
