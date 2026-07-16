import { useLanguage } from "@/contexts/LanguageContext";
import InteractiveLKPD, { GuidedItem, PracticeItem, SituationCard, SummaryCard } from "@/components/InteractiveLKPD";

const PenguranganLKPDPage = () => {
  const { language } = useLanguage();
  const L = language;

  const s = (id: string, en: string, ja: string) => L === "en" ? en : L === "ja" ? ja : id;

  const guidedItems: GuidedItem[] = [
    {
      id: "g1",
      label: s(
        "Pengurangan a − b sama dengan menjumlahkan a dengan ...",
        "Subtraction a − b equals adding a to...",
        "a − b の引き算は、a に ... を足すことと同じです"
      ),
      kind: "choice",
      options: L === "en"
        ? ["opposite of b", "reciprocal of b", "square root of b", "negative of a"]
        : L === "ja"
        ? ["bの反対", "bの逆数", "bの平方根", "aの負の値"]
        : ["lawan dari b", "kebalikan dari b", "akar dari b", "negatif dari a"],
      correctIndex: 0,
      discussion: [
        s("Aturan dasar: a − b = a + (−b).", "Basic rule: a − b = a + (−b).", "基本ルール：a − b = a + (−b)。"),
        s("−b adalah lawan dari b (mengubah tanda).", "−b is the opposite of b (changes the sign).", "−b は b の反対（符号を変える）。"),
      ],
    },
    {
      id: "g2",
      label: "8 − (-5) = ...",
      kind: "fill",
      answers: ["13"],
      discussion: [
        "8 − (-5) = 8 + 5 = 13.",
        s("Tanda minus bertemu minus menjadi plus.", "Minus meets minus becomes plus.", "マイナス同士はプラスになります。"),
      ],
    },
    {
      id: "g3",
      label: s(
        "Benar atau salah: \"Pengurangan bilangan bulat bersifat komutatif (a − b = b − a).\"",
        "True or false: \"Integer subtraction is commutative (a − b = b − a).\"",
        "正誤問題：「整数の引き算は交換法則が成り立つ（a − b = b − a）。」"
      ),
      kind: "truefalse",
      correct: false,
      discussion: [
        s("Contoh: 5 − 3 = 2, sedangkan 3 − 5 = -2. Berbeda.", "Example: 5 − 3 = 2, while 3 − 5 = -2. Different.", "例：5 − 3 = 2、一方 3 − 5 = -2。異なります。"),
        s("Pengurangan TIDAK komutatif.", "Subtraction is NOT commutative.", "引き算は交換法則が成り立ちません。"),
      ],
    },
    {
      id: "g4",
      label: s(
        "Jodohkan ekspresi pengurangan dengan hasilnya:",
        "Match each subtraction expression with its result:",
        "引き算の式と答えを結びましょう："
      ),
      kind: "match",
      pairs: [
        { left: "12 − 5", right: "7" },
        { left: "5 − 12", right: "-7" },
        { left: "-9 − 4", right: "-13" },
        { left: "-9 − (-4)", right: "-5" },
      ],
      discussion: [
        "12 − 5 = 7.",
        "5 − 12 = -7.",
        "-9 − 4 = -13.",
        "-9 − (-4) = -9 + 4 = -5.",
      ],
    },
    {
      id: "g5",
      label: s(
        "Urutkan langkah menghitung -7 − (-3):",
        "Order the steps to calculate -7 − (-3):",
        "-7 − (-3) の計算手順を並べましょう："
      ),
      kind: "sort",
      items: L === "en"
        ? ["Result = -4", "Rewrite as addition: -7 + 3", "Calculate -7 + 3", "The opposite of -3 is 3"]
        : L === "ja"
        ? ["答え = -4", "足し算に書き直す：-7 + 3", "-7 + 3 を計算する", "-3 の反対は 3"]
        : ["Hasil = -4", "Tulis ulang sebagai penjumlahan: -7 + 3", "Hitung -7 + 3", "Lawan dari -3 adalah 3"],
      correctOrder: L === "en"
        ? ["The opposite of -3 is 3", "Rewrite as addition: -7 + 3", "Calculate -7 + 3", "Result = -4"]
        : L === "ja"
        ? ["-3 の反対は 3", "足し算に書き直す：-7 + 3", "-7 + 3 を計算する", "答え = -4"]
        : ["Lawan dari -3 adalah 3", "Tulis ulang sebagai penjumlahan: -7 + 3", "Hitung -7 + 3", "Hasil = -4"],
      discussion: [
        s("Cari lawan bilangan pengurang, ubah operasi menjadi penjumlahan.", "Find the opposite of the subtrahend, change the operation to addition.", "引く数の反対を求め、演算を足し算に変換します。"),
        "-7 + 3 = -4.",
      ],
    },
    {
      id: "g6",
      label: s(
        "Suhu kota A 5°C, kota B -8°C. Selisih suhu A dengan B = ...°C",
        "City A temperature is 5°C, city B is -8°C. The temperature difference A minus B = ...°C",
        "都市Aの気温は5°C、都市Bは-8°C。AとBの気温差 = ...°C"
      ),
      kind: "fill",
      answers: ["13"],
      discussion: [
        s("Selisih = 5 − (-8) = 5 + 8 = 13.", "Difference = 5 − (-8) = 5 + 8 = 13.", "差 = 5 − (-8) = 5 + 8 = 13。"),
        s("Jadi, selisihnya 13°C.", "So, the difference is 13°C.", "したがって、差は13°Cです。"),
      ],
    },
    {
      id: "g7",
      label: s(
        "Pilih pernyataan yang BENAR:",
        "Choose the CORRECT statement:",
        "正しい文を選んでください："
      ),
      kind: "choice",
      options: L === "en"
        ? ["a − 0 = a", "0 − a = a", "a − a = 1", "a − b > a for all b > 0"]
        : L === "ja"
        ? ["a − 0 = a", "0 − a = a", "a − a = 1", "すべての b > 0 に対して a − b > a"]
        : ["a − 0 = a", "0 − a = a", "a − a = 1", "a − b > a untuk semua b > 0"],
      correctIndex: 0,
      discussion: [
        s("Mengurangi 0 tidak mengubah bilangan: a − 0 = a.", "Subtracting 0 does not change the number: a − 0 = a.", "0 を引いても数は変わりません：a − 0 = a。"),
        s("Sebaliknya, 0 − a = -a, dan a − a = 0.", "Conversely, 0 − a = -a, and a − a = 0.", "逆に、0 − a = -a、そして a − a = 0 です。"),
      ],
    },
  ];

  const practiceItems: PracticeItem[] = [
    {
      id: "p1",
      question: s("Hitung: 17 − (-23)", "Calculate: 17 − (-23)", "計算しましょう：17 − (-23)"),
      kind: "fill",
      answers: ["40"],
      hint: s("Minus bertemu minus menjadi plus.", "Minus meets minus becomes plus.", "マイナス同士はプラスになります。"),
      discussion: ["17 − (-23) = 17 + 23 = 40."],
    },
    {
      id: "p2",
      question: s("Pilih hasil yang benar untuk -12 − 8:", "Choose the correct result for -12 − 8:", "-12 − 8 の正しい答えを選んでください："),
      kind: "choice",
      options: ["-20", "20", "-4", "4"],
      correctIndex: 0,
      hint: "-12 − 8 = -12 + (-8).",
      discussion: ["-12 − 8 = -12 + (-8) = -20."],
    },
    {
      id: "p3",
      question: s(
        "Benar atau salah: \"Hasil dari 0 − (-15) adalah 15.\"",
        "True or false: \"The result of 0 − (-15) is 15.\"",
        "正誤問題：「0 − (-15) の答えは 15 です。」"
      ),
      kind: "truefalse",
      correct: true,
      hint: "0 + 15 = 15.",
      discussion: [s("0 − (-15) = 0 + 15 = 15. Benar.", "0 − (-15) = 0 + 15 = 15. True.", "0 − (-15) = 0 + 15 = 15. 正解です。")],
    },
    {
      id: "p4",
      question: s("Jodohkan operasi dengan hasilnya:", "Match each operation with its result:", "演算と答えを結びましょう："),
      kind: "match",
      pairs: [
        { left: "25 − 40", right: "-15" },
        { left: "-18 − (-22)", right: "4" },
        { left: "-30 − 12", right: "-42" },
        { left: "50 − (-50)", right: "100" },
      ],
      hint: s("Ubah pengurangan menjadi penjumlahan dengan lawan.", "Convert subtraction to addition using the opposite.", "引き算を反対を使った足し算に変換しましょう。"),
      discussion: [
        "25 − 40 = -15.",
        "-18 − (-22) = -18 + 22 = 4.",
        "-30 − 12 = -42.",
        "50 − (-50) = 50 + 50 = 100.",
      ],
    },
    {
      id: "p5",
      question: s(
        "Selisih ketinggian puncak gunung 1.250 m dengan dasar lembah -45 m adalah ... m",
        "The height difference between a mountain peak at 1,250 m and a valley floor at -45 m is ... m",
        "標高1,250mの山頂と-45mの谷底との高低差は ... m"
      ),
      kind: "fill",
      answers: ["1295"],
      hint: s("Hitung 1.250 − (-45).", "Calculate 1,250 − (-45).", "1,250 − (-45) を計算しましょう。"),
      discussion: [s("1.250 − (-45) = 1.250 + 45 = 1.295 m.", "1,250 − (-45) = 1,250 + 45 = 1,295 m.", "1,250 − (-45) = 1,250 + 45 = 1,295 m。")],
    },
    {
      id: "p6",
      question: s(
        "Saldo Andi Rp 250.000. Ia menarik Rp 320.000 sehingga saldo menjadi minus. Berapa saldo akhirnya (rupiah)?",
        "Andi's balance is Rp 250,000. He withdraws Rp 320,000, making the balance negative. What is the final balance (rupiah)?",
        "アンディの残高はRp 250,000です。Rp 320,000を引き出すと残高はマイナスになります。最終残高（ルピア）は？"
      ),
      kind: "fill",
      answers: ["-70000"],
      hint: s("250.000 − 320.000.", "250,000 − 320,000.", "250,000 − 320,000。"),
      discussion: [
        s("250.000 − 320.000 = -70.000.", "250,000 − 320,000 = -70,000.", "250,000 − 320,000 = -70,000。"),
        s("Saldo akhir Rp -70.000 (kurang Rp 70.000).", "Final balance Rp -70,000 (short Rp 70,000).", "最終残高 Rp -70,000（Rp 70,000 不足）。"),
      ],
    },
  ];

  const situations: SituationCard[] = [
    {
      title: s("Situasi: Selisih Suhu", "Situation: Temperature Difference", "状況：気温差"),
      visual: (
        <div className="text-center space-y-1">
          <p className="text-lg font-bold text-white">
            {s("Kota A: 5°C · Kota B: -8°C", "City A: 5°C · City B: -8°C", "都市A：5°C · 都市B：-8°C")}
          </p>
          <p className="text-sm text-white/65">{s("Selisih = 5 − (-8)", "Difference = 5 − (-8)", "差 = 5 − (-8)")}</p>
        </div>
      ),
      text: s(
        "Pengurangan bilangan bulat dipakai untuk mencari selisih suhu, ketinggian, atau saldo.",
        "Integer subtraction is used to find differences in temperature, altitude, or balance.",
        "整数の引き算は、気温・高度・残高の差を求めるときに使われます。"
      ),
    },
    {
      title: s("Situasi: Aturan Tanda", "Situation: Sign Rule", "状況：符号のルール"),
      visual: (
        <div className="text-center space-y-1">
          <p className="text-lg font-bold text-white">a − b = a + (−b)</p>
          <p className="text-sm text-white/65">
            {s("Pengurangan diubah menjadi penjumlahan dengan lawan.", "Subtraction is converted to addition using the opposite.", "引き算は反対を使った足し算に変換されます。")}
          </p>
        </div>
      ),
      text: s(
        "Aturan kunci: ubah pengurangan menjadi penjumlahan dengan lawan agar mudah dikerjakan.",
        "Key rule: convert subtraction to addition using the opposite to make it easier.",
        "重要ルール：引き算は反対を使った足し算に変換すると計算しやすくなります。"
      ),
    },
  ];

  const summaryCards: SummaryCard[] = [
    {
      title: s("Aturan Utama", "Main Rule", "主なルール"),
      text: s("a − b = a + (−b). Tanda minus bertemu minus jadi plus.", "a − b = a + (−b). Minus meets minus becomes plus.", "a − b = a + (−b)。マイナス同士はプラスになります。"),
      tone: "cyan",
    },
    {
      title: s("Bukan Komutatif", "Not Commutative", "交換法則なし"),
      text: s("a − b ≠ b − a, kecuali jika a = b (hasil 0).", "a − b ≠ b − a, except when a = b (result 0).", "a − b ≠ b − a（a = b の場合のみ結果は0）。"),
      tone: "yellow",
    },
    {
      title: s("Selisih", "Difference", "差"),
      text: s(
        "Selisih dua bilangan = pengurangan dari yang lebih besar dengan yang lebih kecil.",
        "The difference of two numbers = subtracting the smaller from the larger.",
        "2つの数の差 = 大きい数から小さい数を引いたもの。"
      ),
      tone: "emerald",
    },
  ];

  return (
    <InteractiveLKPD
      badgeText={s("LKPD Interaktif Matematika Kelas 7", "Interactive Math LKPD Grade 7", "数学インタラクティブワークシート 中学1年")}
      title={s("Pengurangan Bilangan Bulat", "Integer Subtraction", "整数の引き算")}
      intro={s(
        "LKPD ini melatih Sobat Numatik mengurangkan bilangan bulat dengan beragam tipe soal interaktif.",
        "This worksheet trains NUMATIK Friends to subtract integers with various interactive question types.",
        "このワークシートでは、NUMATIKフレンドが様々なインタラクティブな問題形式で整数の引き算を練習します。"
      )}
      situations={situations}
      guidedIntro={s(
        "Kerjakan setiap pertanyaan untuk menemukan aturan pengurangan bilangan bulat.",
        "Complete each question to discover the rules of integer subtraction.",
        "各問題を解いて、整数の引き算のルールを発見しましょう。"
      )}
      guidedItems={guidedItems}
      summaryCards={summaryCards}
      practiceIntro={s(
        "Selalu ubah pengurangan menjadi penjumlahan dengan lawan, lalu terapkan aturan tanda.",
        "Always convert subtraction to addition using the opposite, then apply the sign rule.",
        "引き算は常に反対を使った足し算に変換してから、符号のルールを適用しましょう。"
      )}
      practiceItems={practiceItems}
      prevPath="/lkpd/kelas-7/bilangan-bulat"
      backLabel={s("Kembali ke LKPD Bilangan Bulat", "Back to Integer LKPD", "整数のワークシートに戻る")}
    />
  );
};

export default PenguranganLKPDPage;
