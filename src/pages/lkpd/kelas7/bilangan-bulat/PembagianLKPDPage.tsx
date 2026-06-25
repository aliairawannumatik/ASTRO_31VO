import { useLanguage } from "@/contexts/LanguageContext";
import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";

const PembagianLKPDPage = () => {
  const { language } = useLanguage();
  const L = language;

  const s = (id: string, en: string, ja: string) => L === "en" ? en : L === "ja" ? ja : id;

  const guidedItems: GuidedItem[] = [
    {
      id: "g1",
      label: s(
        "Aturan tanda pembagian SAMA dengan aturan tanda ...",
        "The sign rule for division is the SAME as the sign rule for ...",
        "割り算の符号のルールは ... の符号のルールと同じです"
      ),
      kind: "choice",
      options: L === "en"
        ? ["multiplication", "addition", "subtraction", "square root"]
        : L === "ja"
        ? ["掛け算", "足し算", "引き算", "平方根"]
        : ["perkalian", "penjumlahan", "pengurangan", "akar"],
      correctIndex: 0,
      discussion: [
        s("Tanda pembagian mengikuti tanda perkalian.", "Division sign rules follow multiplication sign rules.", "割り算の符号のルールは掛け算と同じです。"),
        s("Sama → positif, beda → negatif.", "Same signs → positive, different signs → negative.", "符号が同じ → 正、符号が異なる → 負。"),
      ],
    },
    {
      id: "g2",
      label: s("Hasil dari (-36) ÷ 4 = ...", "The result of (-36) ÷ 4 = ...", "(-36) ÷ 4 の答えは ..."),
      kind: "fill",
      answers: ["-9"],
      discussion: [
        s("Beda tanda → negatif.", "Different signs → negative.", "符号が異なる → 負。"),
        s("36 ÷ 4 = 9, jadi -9.", "36 ÷ 4 = 9, so -9.", "36 ÷ 4 = 9、したがって -9。"),
      ],
    },
    {
      id: "g3",
      label: s(
        "Benar atau salah: \"Bilangan dibagi nol hasilnya nol.\"",
        "True or false: \"A number divided by zero equals zero.\"",
        "正誤問題：「数をゼロで割るとゼロになります。」"
      ),
      kind: "truefalse",
      correct: false,
      discussion: [
        s("Pembagian dengan 0 TIDAK terdefinisi (undefined).", "Division by 0 is NOT defined (undefined).", "0による割り算は定義されていません（undefined）。"),
        s("Pernyataan SALAH.", "The statement is FALSE.", "この文は誤りです。"),
      ],
    },
    {
      id: "g4",
      label: s(
        "Jodohkan pembagian dengan hasilnya:",
        "Match each division with its result:",
        "割り算と答えを結びましょう："
      ),
      kind: "match",
      pairs: [
        { left: "(-48) ÷ (-6)", right: "8" },
        { left: "72 ÷ (-9)", right: "-8" },
        { left: "(-100) ÷ 4", right: "-25" },
        { left: "0 ÷ 5", right: "0" },
      ],
      discussion: [
        s("(-48) ÷ (-6) = 8 (sama negatif).", "(-48) ÷ (-6) = 8 (both negative).", "(-48) ÷ (-6) = 8（両方負の数）。"),
        s("72 ÷ (-9) = -8 (beda).", "72 ÷ (-9) = -8 (different signs).", "72 ÷ (-9) = -8（符号が異なる）。"),
        s("(-100) ÷ 4 = -25 (beda).", "(-100) ÷ 4 = -25 (different signs).", "(-100) ÷ 4 = -25（符号が異なる）。"),
        "0 ÷ 5 = 0.",
      ],
    },
    {
      id: "g5",
      label: s(
        "Urutkan langkah menghitung (-84) ÷ 7:",
        "Order the steps to calculate (-84) ÷ 7:",
        "(-84) ÷ 7 の計算手順を並べましょう："
      ),
      kind: "sort",
      items: L === "en"
        ? ["Result = -12", "Determine the sign: different → negative", "Calculate 84 ÷ 7 = 12", "Separate the sign and absolute value"]
        : L === "ja"
        ? ["答え = -12", "符号を決める：異なる → 負", "84 ÷ 7 = 12 を計算する", "符号と絶対値を分ける"]
        : ["Hasil = -12", "Tentukan tanda hasil: beda → negatif", "Hitung 84 ÷ 7 = 12", "Pisahkan tanda dan nilai mutlak"],
      correctOrder: L === "en"
        ? ["Separate the sign and absolute value", "Calculate 84 ÷ 7 = 12", "Determine the sign: different → negative", "Result = -12"]
        : L === "ja"
        ? ["符号と絶対値を分ける", "84 ÷ 7 = 12 を計算する", "符号を決める：異なる → 負", "答え = -12"]
        : ["Pisahkan tanda dan nilai mutlak", "Hitung 84 ÷ 7 = 12", "Tentukan tanda hasil: beda → negatif", "Hasil = -12"],
      discussion: [
        s("Pisahkan tanda dulu agar fokus pada perhitungan nilai mutlak.", "Separate the sign first to focus on the absolute value calculation.", "まず符号を分けて絶対値の計算に集中しましょう。"),
        s("Lalu beri tanda sesuai aturan.", "Then apply the sign according to the rule.", "それからルールに従って符号を付けます。"),
      ],
    },
    {
      id: "g6",
      label: s(
        "Pilih bentuk yang BENAR sebagai kebalikan perkalian:",
        "Choose the CORRECT form showing division as the inverse of multiplication:",
        "乗法の逆演算として正しい形を選んでください："
      ),
      kind: "choice",
      options: [
        s("Jika a × b = c maka a = c ÷ b (b ≠ 0)", "If a × b = c then a = c ÷ b (b ≠ 0)", "a × b = c ならば a = c ÷ b（b ≠ 0）"),
        s("Jika a × b = c maka a = c × b", "If a × b = c then a = c × b", "a × b = c ならば a = c × b"),
        s("Jika a × b = c maka a + b = c", "If a × b = c then a + b = c", "a × b = c ならば a + b = c"),
        s("Jika a × b = c maka a − b = c", "If a × b = c then a − b = c", "a × b = c ならば a − b = c"),
      ],
      correctIndex: 0,
      discussion: [
        s("Pembagian adalah kebalikan perkalian.", "Division is the inverse of multiplication.", "割り算は掛け算の逆演算です。"),
        s("a × b = c ⇒ a = c ÷ b (asalkan b ≠ 0).", "a × b = c ⇒ a = c ÷ b (provided b ≠ 0).", "a × b = c ⇒ a = c ÷ b（b ≠ 0 の場合）。"),
      ],
    },
    {
      id: "g7",
      label: s("144 dibagi (-12) sama dengan ...", "144 divided by (-12) equals ...", "144 ÷ (-12) = ..."),
      kind: "fill",
      answers: ["-12"],
      discussion: [s("144 ÷ (-12) = -12 (beda tanda).", "144 ÷ (-12) = -12 (different signs).", "144 ÷ (-12) = -12（符号が異なる）。")],
    },
  ];

  const practiceItems: PracticeItem[] = [
    {
      id: "p1",
      question: s("Hitung: (-225) ÷ (-15)", "Calculate: (-225) ÷ (-15)", "計算しましょう：(-225) ÷ (-15)"),
      kind: "fill",
      answers: ["15"],
      hint: s("Sama-sama negatif → positif. 225 ÷ 15.", "Both negative → positive. 225 ÷ 15.", "両方負の数 → 正の数。225 ÷ 15。"),
      discussion: ["(-225) ÷ (-15) = 15."],
    },
    {
      id: "p2",
      question: s("Pilih hasil yang benar untuk 96 ÷ (-8):", "Choose the correct result for 96 ÷ (-8):", "96 ÷ (-8) の正しい答えを選んでください："),
      kind: "choice",
      options: ["-12", "12", "-88", "104"],
      correctIndex: 0,
      hint: s("Beda tanda: hasilnya negatif.", "Different signs: negative result.", "符号が異なる：結果は負になります。"),
      discussion: [s("96 ÷ 8 = 12, tanda berbeda → -12.", "96 ÷ 8 = 12, different signs → -12.", "96 ÷ 8 = 12、符号が異なる → -12。")],
    },
    {
      id: "p3",
      question: s(
        "Benar atau salah: \"Hasil dari (-50) ÷ 1 adalah -50.\"",
        "True or false: \"The result of (-50) ÷ 1 is -50.\"",
        "正誤問題：「(-50) ÷ 1 の答えは -50 です。」"
      ),
      kind: "truefalse",
      correct: true,
      hint: s("Membagi dengan 1 menghasilkan bilangan itu sendiri.", "Dividing by 1 gives the number itself.", "1で割ると数はそのままです。"),
      discussion: [s("(-50) ÷ 1 = -50. Benar.", "(-50) ÷ 1 = -50. True.", "(-50) ÷ 1 = -50. 正解です。")],
    },
    {
      id: "p4",
      question: s("Jodohkan pembagian dengan hasilnya:", "Match each division with its result:", "割り算と答えを結びましょう："),
      kind: "match",
      pairs: [
        { left: "(-180) ÷ 12", right: "-15" },
        { left: "144 ÷ (-9)", right: "-16" },
        { left: "(-450) ÷ (-15)", right: "30" },
        { left: "0 ÷ (-7)", right: "0" },
      ],
      hint: s("Tentukan tanda dahulu, lalu bagi.", "Determine the sign first, then divide.", "まず符号を決めてから割り算しましょう。"),
      discussion: [
        "(-180) ÷ 12 = -15.",
        "144 ÷ (-9) = -16.",
        "(-450) ÷ (-15) = 30.",
        "0 ÷ (-7) = 0.",
      ],
    },
    {
      id: "p5",
      question: s(
        "Suatu lift turun total -56 lantai dalam 8 detik. Berapa lantai per detik (gunakan tanda)?",
        "An elevator descends a total of -56 floors in 8 seconds. How many floors per second (use sign)?",
        "エレベーターが8秒間で合計-56階下がりました。1秒あたり何階移動しますか（符号を使いましょう）？"
      ),
      kind: "fill",
      answers: ["-7"],
      hint: "(-56) ÷ 8.",
      discussion: [s("(-56) ÷ 8 = -7 lantai per detik (turun).", "(-56) ÷ 8 = -7 floors per second (descending).", "(-56) ÷ 8 = -7 階/秒（下降）。")],
    },
    {
      id: "p6",
      question: s(
        "Sebuah utang Rp 360.000 dibayar dalam 12 angsuran sama besar. Berapa rupiah perubahan saldo per bulan (gunakan tanda)?",
        "A debt of Rp 360,000 is paid in 12 equal installments. What is the change in balance per month (use sign)?",
        "Rp 360,000 の借金を12回の均等払いで返済します。毎月の残高の変化は何ルピアですか（符号を使いましょう）？"
      ),
      kind: "fill",
      answers: ["-30000"],
      hint: s("(-360.000) ÷ 12.", "(-360,000) ÷ 12.", "(-360,000) ÷ 12。"),
      discussion: [
        s("(-360.000) ÷ 12 = -30.000.", "(-360,000) ÷ 12 = -30,000.", "(-360,000) ÷ 12 = -30,000。"),
        s("Saldo berkurang Rp 30.000 per bulan.", "Balance decreases by Rp 30,000 per month.", "毎月残高が Rp 30,000 減ります。"),
      ],
    },
  ];

  const situations: SituationCard[] = [
    {
      title: s("Situasi: Aturan Tanda", "Situation: Sign Rule", "状況：符号のルール"),
      visual: (
        <div className="text-center space-y-1">
          <p className="text-lg font-bold text-white">+ ÷ + = +    − ÷ − = +</p>
          <p className="text-lg font-bold text-white">+ ÷ − = −    − ÷ + = −</p>
        </div>
      ),
      text: s(
        "Aturan tanda pembagian sama persis dengan perkalian.",
        "Division sign rules are exactly the same as multiplication.",
        "割り算の符号のルールは掛け算と全く同じです。"
      ),
    },
    {
      title: s("Situasi: Membagi Sama Besar", "Situation: Equal Division", "状況：均等分割"),
      visual: (
        <div className="text-center space-y-1">
          <p className="text-lg font-bold text-white">
            {s("-56 lantai ÷ 8 detik", "-56 floors ÷ 8 seconds", "-56 階 ÷ 8 秒")}
          </p>
          <p className="text-sm text-white/65">
            = -7 {s("lantai/detik", "floors/second", "階/秒")}
          </p>
        </div>
      ),
      text: s(
        "Pembagian dipakai untuk menemukan nilai per satuan saat hasil totalnya sudah diketahui.",
        "Division is used to find the value per unit when the total result is known.",
        "割り算は、合計値がわかっているときに単位あたりの値を求めるために使います。"
      ),
    },
  ];

  const summaryCards: SummaryCard[] = [
    {
      title: s("Aturan Tanda", "Sign Rule", "符号のルール"),
      text: s(
        "Sama → positif, beda → negatif. Pembagian dengan 0 tidak terdefinisi.",
        "Same → positive, different → negative. Division by 0 is undefined.",
        "符号が同じ → 正、異なる → 負。0による割り算は定義されていません。"
      ),
      tone: "cyan",
    },
    {
      title: s("Kebalikan Perkalian", "Inverse of Multiplication", "乗法の逆演算"),
      text: s(
        "a ÷ b = c artinya c × b = a. Periksa hasil dengan mengalikan kembali.",
        "a ÷ b = c means c × b = a. Verify the result by multiplying back.",
        "a ÷ b = c は c × b = a を意味します。掛け戻して答えを確認しましょう。"
      ),
      tone: "yellow",
    },
    {
      title: s("Bukan Komutatif", "Not Commutative", "交換法則なし"),
      text: s(
        "a ÷ b ≠ b ÷ a (kecuali a = b ≠ 0).",
        "a ÷ b ≠ b ÷ a (except when a = b ≠ 0).",
        "a ÷ b ≠ b ÷ a（a = b ≠ 0 の場合を除く）。"
      ),
      tone: "emerald",
    },
  ];

  return (
    <InteractiveLKPD
      badgeText={s("LKPD Interaktif Matematika Kelas 7", "Interactive Math LKPD Grade 7", "数学インタラクティブワークシート 中学1年")}
      title={s("Pembagian Bilangan Bulat", "Integer Division", "整数の割り算")}
      intro={s(
        "LKPD ini melatih Sobat Numatik membagi bilangan bulat dengan aturan tanda yang tepat.",
        "This worksheet trains NUMATIK Friends to divide integers using the correct sign rules.",
        "このワークシートでは、NUMATIKフレンドが正しい符号のルールを使って整数の割り算を練習します。"
      )}
      situations={situations}
      guidedIntro={s(
        "Kerjakan setiap soal untuk menemukan aturan tanda pembagian dan kaitannya dengan perkalian.",
        "Complete each question to discover the sign rules of division and its relationship to multiplication.",
        "各問題を解いて、割り算の符号のルールと掛け算との関係を発見しましょう。"
      )}
      guidedItems={guidedItems}
      summaryCards={summaryCards}
      practiceIntro={s(
        "Selalu tentukan tanda hasilnya dahulu sebelum membagi nilai mutlaknya.",
        "Always determine the sign of the result before dividing the absolute values.",
        "絶対値を割る前に、必ず結果の符号を決めましょう。"
      )}
      practiceItems={practiceItems}
      prevPath="/lkpd/kelas-7/bilangan-bulat"
      backLabel={s("Kembali ke LKPD Bilangan Bulat", "Back to Integer LKPD", "整数のワークシートに戻る")}
    />
  );
};

export default PembagianLKPDPage;
