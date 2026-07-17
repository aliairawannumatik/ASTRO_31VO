import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Target, Calculator } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { RangkumanSection } from "@/components/RangkumanSection";
import { useLanguage } from "@/contexts/LanguageContext";

const PeluangTeoretikPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "intro", "konsep1", "contoh1", "rangkuman",
  ]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  /* ── translations ── */
  const t = {
    id: {
      title: "PELUANG TEORETIK",
      subtitle: "Peluang Berdasarkan Penalaran Logis & Matematika",
      breadcrumb: "Kelas 9 · Peluang · Materi Matematika",
      sec1Title: "🌟 Apa Itu Peluang Teoretik?",
      sec2Title: "📘 Rumus & Konsep Peluang Teoretik",
      sec3Title: "📝 Contoh Soal & Pembahasan",
      sec4Title: "📋 Rangkuman",
      intro: (
        <>
          Bayangkan kamu punya dadu sempurna yang benar-benar seimbang. Tanpa perlu melemparnya
          ribuan kali, kamu bisa langsung bilang: "Peluang muncul angka 3 adalah{" "}
          <InlineMath math="\frac{1}{6}" />." Inilah{" "}
          <strong className="text-cyan-300">Peluang Teoretik</strong> — peluang yang dihitung
          berdasarkan logika dan matematika, dengan asumsi semua kemungkinan memiliki kesempatan
          yang <em>sama besar</em> untuk terjadi.
        </>
      ),
      defCards: [
        { term: "Kejadian Sama Mungkin", icon: "⚖️", desc: "Syarat utama peluang teoretik: setiap hasil percobaan harus memiliki peluang yang sama untuk terjadi.", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300" },
        { term: "n(A)", icon: "🎯", desc: "Banyaknya anggota kejadian A — hasil yang kita inginkan dari percobaan.", color: "bg-green-900/40 border-green-500/40 text-green-300" },
        { term: "n(S)", icon: "🌐", desc: "Banyaknya anggota ruang sampel — semua kemungkinan hasil yang bisa terjadi.", color: "bg-violet-900/40 border-violet-500/40 text-violet-300" },
        { term: "P(A)", icon: "📊", desc: "Peluang kejadian A — nilai antara 0 dan 1 yang menyatakan seberapa mungkin A terjadi.", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
      ],
      tipKey: "Perbedaan Kunci:",
      tipText: "Peluang empirik butuh percobaan nyata. Peluang teoretik cukup dengan menghitung kemungkinan secara logis, tanpa harus melakukan percobaan!",
      intisariLabel: "🎯 Ringkasan Intisari",
      intisariText: "Peluang teoretik dihitung dengan membandingkan banyaknya hasil yang kita inginkan",
      intisariText2: "terhadap total semua kemungkinan hasil yang ada",
      formulaLabel: "📐 Rumus Peluang Teoretik",
      fPA: "Peluang kejadian A", fnA: "Banyak anggota kejadian A", fnS: "Banyak anggota ruang sampel",
      diceIllTitle: "🎲 Ilustrasi: Peluang Pada Dadu",
      diceIllNote: "Angka biru = bilangan genap (kejadian yang dicari)",
      tableTitle: "📊 Tabel Peluang Teoretik Dadu",
      tKejadian: "Kejadian", tAnggota: "Anggota",
      tableRows: [
        ["Bilangan Genap", "{2, 4, 6}", "3", "3/6 = 1/2"],
        ["Bilangan Ganjil", "{1, 3, 5}", "3", "3/6 = 1/2"],
        ["Bilangan Prima", "{2, 3, 5}", "3", "3/6 = 1/2"],
        ["Bilangan > 4", "{5, 6}", "2", "2/6 = 1/3"],
        ["Bilangan = 7", "{ }", "0", "0 (mustahil)"],
        ["Bilangan ≤ 6", "{1,2,3,4,5,6}", "6", "6/6 = 1 (pasti)"],
      ] as [string, string, string, string][],
      bMudah: "MUDAH", bSedang: "SEDANG", bSulit: "SULIT",
      soal: "Soal", pembahasan: "✅ Pembahasan",
      // Soal 1
      s1q: "Sebuah dadu bermuka enam dilempar satu kali. Tentukan peluang muncul mata dadu bilangan ganjil!",
      s1step1: "Langkah 1 — Tentukan ruang sampel:",
      s1step2: "Langkah 2 — Tentukan anggota kejadian (bilangan ganjil):",
      s1step3: "Langkah 3 — Hitung peluang teoretik:",
      s1key: "🔑 Peluang muncul bilangan ganjil adalah",
      s1keyOr: "atau",
      // Soal 2
      s2q: "Dari satu set kartu bridge (52 kartu), diambil satu kartu secara acak. Tentukan peluang terambil:\na. Kartu As (A)\nb. Kartu berwarna merah\nc. Kartu King berwarna hitam",
      s2a: "a. Kartu As ada 4 (♠A, ♥A, ♦A, ♣A):",
      s2b: "b. Kartu merah = ♥ dan ♦ = 26 kartu:",
      s2c: "c. King hitam = K♠ dan K♣ = 2 kartu:",
      s2tip: "💡 Pastikan kamu menghitung",
      s2tip2: "dengan teliti sebelum memasukkan ke rumus!",
      // Soal 3
      s3q: "Dua buah dadu dilempar bersama-sama satu kali. Tentukan peluang:\na. Jumlah kedua mata dadu sama dengan 7\nb. Selisih kedua mata dadu sama dengan 2\nc. Jumlah kedua mata dadu merupakan bilangan prima",
      s3ns: "Dua dadu:",
      s3a: "a. Jumlah = 7: pasangan yang memenuhi:",
      s3aPairs: "(1,6), (2,5), (3,4), (4,3), (5,2), (6,1) → 6 pasangan",
      s3b: "b. Selisih = 2 (|dadu1 − dadu2| = 2):",
      s3bPairs: "(1,3),(2,4),(3,5),(4,6),(3,1),(4,2),(5,3),(6,4) → 8 pasangan",
      s3c: "c. Jumlah prima (2, 3, 5, 7, 11):",
      s3cRows: ["Jumlah 2: (1,1) → 1 pasangan", "Jumlah 3: (1,2),(2,1) → 2 pasangan", "Jumlah 5: (1,4),(2,3),(3,2),(4,1) → 4 pasangan", "Jumlah 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) → 6 pasangan", "Jumlah 11: (5,6),(6,5) → 2 pasangan", "Total: 1+2+4+6+2 = 15 pasangan"],
      s3tip: "⚠️ Untuk dua dadu, susunlah semua kemungkinan secara sistematis agar tidak ada yang terlewat. Tabel pasangan dadu sangat membantu!",
      // Rangkuman points
      rPoints: [
        { poin: "Peluang teoretik dihitung menggunakan logika, tanpa perlu melakukan percobaan nyata.", icon: "🧠" },
        { poin: "Rumus: P(A) = n(A) / n(S), dengan syarat setiap hasil memiliki kesempatan yang sama.", icon: "📐" },
        { poin: "Nilai peluang selalu antara 0 (mustahil) dan 1 (pasti terjadi).", icon: "📏" },
        { poin: "Semakin besar n(A) dibanding n(S), semakin besar peluang kejadian A.", icon: "📈" },
        { poin: "Untuk dua alat atau lebih, n(S) = perkalian kemungkinan masing-masing alat.", icon: "✖️" },
      ],
      backBtn: "← Kembali ke Menu Peluang",
    },
    en: {
      title: "THEORETICAL PROBABILITY",
      subtitle: "Probability Based on Logic & Mathematics",
      breadcrumb: "Grade 9 · Probability · Mathematics",
      sec1Title: "🌟 What Is Theoretical Probability?",
      sec2Title: "📘 Formula & Concept of Theoretical Probability",
      sec3Title: "📝 Worked Examples",
      sec4Title: "📋 Summary",
      intro: (
        <>
          Imagine you have a perfectly balanced die. Without rolling it thousands of times, you can
          immediately say: "The probability of rolling 3 is{" "}
          <InlineMath math="\frac{1}{6}" />." This is{" "}
          <strong className="text-cyan-300">Theoretical Probability</strong> — probability
          calculated through logic and mathematics, assuming all outcomes have an{" "}
          <em>equally likely</em> chance of occurring.
        </>
      ),
      defCards: [
        { term: "Equally Likely Outcomes", icon: "⚖️", desc: "The key requirement for theoretical probability: every outcome must have an equal chance of occurring.", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300" },
        { term: "n(A)", icon: "🎯", desc: "The number of elements in event A — the outcomes we want from the experiment.", color: "bg-green-900/40 border-green-500/40 text-green-300" },
        { term: "n(S)", icon: "🌐", desc: "The number of elements in the sample space — all possible outcomes that can occur.", color: "bg-violet-900/40 border-violet-500/40 text-violet-300" },
        { term: "P(A)", icon: "📊", desc: "Probability of event A — a value between 0 and 1 expressing how likely A is to occur.", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
      ],
      tipKey: "Key Difference:",
      tipText: "Empirical probability requires real experiments. Theoretical probability only needs logical counting — no experiment required!",
      intisariLabel: "🎯 Key Summary",
      intisariText: "Theoretical probability is calculated by comparing the number of desired outcomes",
      intisariText2: "against the total number of all possible outcomes",
      formulaLabel: "📐 Theoretical Probability Formula",
      fPA: "Probability of event A", fnA: "Number of elements in event A", fnS: "Number of elements in sample space",
      diceIllTitle: "🎲 Illustration: Probability on a Die",
      diceIllNote: "Blue numbers = even numbers (the target event)",
      tableTitle: "📊 Theoretical Probability Table for a Die",
      tKejadian: "Event", tAnggota: "Members",
      tableRows: [
        ["Even Numbers", "{2, 4, 6}", "3", "3/6 = 1/2"],
        ["Odd Numbers", "{1, 3, 5}", "3", "3/6 = 1/2"],
        ["Prime Numbers", "{2, 3, 5}", "3", "3/6 = 1/2"],
        ["Numbers > 4", "{5, 6}", "2", "2/6 = 1/3"],
        ["Number = 7", "{ }", "0", "0 (impossible)"],
        ["Numbers ≤ 6", "{1,2,3,4,5,6}", "6", "6/6 = 1 (certain)"],
      ] as [string, string, string, string][],
      bMudah: "EASY", bSedang: "MEDIUM", bSulit: "HARD",
      soal: "Problem", pembahasan: "✅ Solution",
      // Soal 1
      s1q: "A standard six-sided die is rolled once. Find the probability of rolling an odd number!",
      s1step1: "Step 1 — Determine the sample space:",
      s1step2: "Step 2 — Determine the event elements (odd numbers):",
      s1step3: "Step 3 — Calculate the theoretical probability:",
      s1key: "🔑 The probability of rolling an odd number is",
      s1keyOr: "or",
      // Soal 2
      s2q: "One card is drawn at random from a standard deck of 52 playing cards. Find the probability of drawing:\na. An Ace\nb. A red card\nc. A Black King",
      s2a: "a. There are 4 Aces (♠A, ♥A, ♦A, ♣A):",
      s2b: "b. Red cards = ♥ and ♦ = 26 cards:",
      s2c: "c. Black Kings = K♠ and K♣ = 2 cards:",
      s2tip: "💡 Make sure you carefully count",
      s2tip2: "before substituting into the formula!",
      // Soal 3
      s3q: "Two dice are rolled together once. Find the probability that:\na. The sum of both dice equals 7\nb. The difference of both dice equals 2\nc. The sum of both dice is a prime number",
      s3ns: "Two dice:",
      s3a: "a. Sum = 7: pairs that satisfy:",
      s3aPairs: "(1,6), (2,5), (3,4), (4,3), (5,2), (6,1) → 6 pairs",
      s3b: "b. Difference = 2 (|die1 − die2| = 2):",
      s3bPairs: "(1,3),(2,4),(3,5),(4,6),(3,1),(4,2),(5,3),(6,4) → 8 pairs",
      s3c: "c. Prime sum (2, 3, 5, 7, 11):",
      s3cRows: ["Sum 2: (1,1) → 1 pair", "Sum 3: (1,2),(2,1) → 2 pairs", "Sum 5: (1,4),(2,3),(3,2),(4,1) → 4 pairs", "Sum 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) → 6 pairs", "Sum 11: (5,6),(6,5) → 2 pairs", "Total: 1+2+4+6+2 = 15 pairs"],
      s3tip: "⚠️ For two dice, list all possibilities systematically so none are missed. A dice-pair table is very helpful!",
      // Rangkuman points
      rPoints: [
        { poin: "Theoretical probability is calculated using logic, without needing real experiments.", icon: "🧠" },
        { poin: "Formula: P(A) = n(A) / n(S), provided every outcome has an equal chance.", icon: "📐" },
        { poin: "Probability values always lie between 0 (impossible) and 1 (certain).", icon: "📏" },
        { poin: "The larger n(A) is relative to n(S), the higher the probability of event A.", icon: "📈" },
        { poin: "For two or more items, n(S) = product of the individual possibilities.", icon: "✖️" },
      ],
      backBtn: "← Back to Probability Menu",
    },
    ja: {
      title: "理論的確率",
      subtitle: "論理と数学に基づく確率",
      breadcrumb: "9年生 · 確率 · 数学",
      sec1Title: "🌟 理論的確率とは？",
      sec2Title: "📘 理論的確率の公式と概念",
      sec3Title: "📝 例題と解説",
      sec4Title: "📋 まとめ",
      intro: (
        <>
          完全に均等なサイコロを持っていると想像してください。何千回も投げることなく、すぐに「3の目が出る確率は{" "}
          <InlineMath math="\frac{1}{6}" />」と言えます。これが{" "}
          <strong className="text-cyan-300">理論的確率</strong> —
          すべての結果が<em>同様に確からしい</em>と仮定して、論理と数学で計算する確率です。
        </>
      ),
      defCards: [
        { term: "同様に確からしい", icon: "⚖️", desc: "理論的確率の基本条件：各実験結果が起こる確率が等しい必要があります。", color: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300" },
        { term: "n(A)", icon: "🎯", desc: "事象Aの要素数 — 実験で求めたい結果の個数。", color: "bg-green-900/40 border-green-500/40 text-green-300" },
        { term: "n(S)", icon: "🌐", desc: "標本空間の要素数 — 起こりうるすべての結果の個数。", color: "bg-violet-900/40 border-violet-500/40 text-violet-300" },
        { term: "P(A)", icon: "📊", desc: "事象Aの確率 — Aが起こる可能性を示す0から1の値。", color: "bg-orange-900/40 border-orange-500/40 text-orange-300" },
      ],
      tipKey: "重要な違い：",
      tipText: "経験的確率は実際の実験が必要です。理論的確率は論理的な数え上げだけで求められます — 実験不要！",
      intisariLabel: "🎯 重要まとめ",
      intisariText: "理論的確率は、求める結果の数",
      intisariText2: "をすべての起こりうる結果の総数と比較して計算します",
      formulaLabel: "📐 理論的確率の公式",
      fPA: "事象Aの確率", fnA: "事象Aの要素数", fnS: "標本空間の要素数",
      diceIllTitle: "🎲 イラスト：サイコロの確率",
      diceIllNote: "青の数字 = 偶数（求めたい事象）",
      tableTitle: "📊 サイコロの理論的確率表",
      tKejadian: "事象", tAnggota: "要素",
      tableRows: [
        ["偶数", "{2, 4, 6}", "3", "3/6 = 1/2"],
        ["奇数", "{1, 3, 5}", "3", "3/6 = 1/2"],
        ["素数", "{2, 3, 5}", "3", "3/6 = 1/2"],
        ["4より大きい数", "{5, 6}", "2", "2/6 = 1/3"],
        ["7に等しい数", "{ }", "0", "0（不可能）"],
        ["6以下の数", "{1,2,3,4,5,6}", "6", "6/6 = 1（確実）"],
      ] as [string, string, string, string][],
      bMudah: "基本", bSedang: "標準", bSulit: "発展",
      soal: "問題", pembahasan: "✅ 解説",
      // Soal 1
      s1q: "標準的な6面サイコロを1回投げます。奇数の目が出る確率を求めなさい。",
      s1step1: "ステップ1 — 標本空間を決める：",
      s1step2: "ステップ2 — 事象の要素（奇数）を決める：",
      s1step3: "ステップ3 — 理論的確率を計算する：",
      s1key: "🔑 奇数が出る確率は",
      s1keyOr: "または",
      // Soal 2
      s2q: "52枚の標準的なトランプから1枚をランダムに引きます。次の確率を求めなさい：\na. エースを引く\nb. 赤いカードを引く\nc. 黒のキングを引く",
      s2a: "a. エースは4枚（♠A, ♥A, ♦A, ♣A）：",
      s2b: "b. 赤いカード = ♥と♦ = 26枚：",
      s2c: "c. 黒のキング = K♠とK♣ = 2枚：",
      s2tip: "💡 公式に代入する前に",
      s2tip2: "を正確に数えることを忘れずに！",
      // Soal 3
      s3q: "2つのサイコロを同時に1回投げます。次の確率を求めなさい：\na. 2つのサイコロの和が7になる\nb. 2つのサイコロの差が2になる\nc. 2つのサイコロの和が素数になる",
      s3ns: "2つのサイコロ：",
      s3a: "a. 和 = 7：条件を満たす組み合わせ：",
      s3aPairs: "(1,6), (2,5), (3,4), (4,3), (5,2), (6,1) → 6組",
      s3b: "b. 差 = 2（|サイコロ1 − サイコロ2| = 2）：",
      s3bPairs: "(1,3),(2,4),(3,5),(4,6),(3,1),(4,2),(5,3),(6,4) → 8組",
      s3c: "c. 素数の和（2, 3, 5, 7, 11）：",
      s3cRows: ["和2：(1,1) → 1組", "和3：(1,2),(2,1) → 2組", "和5：(1,4),(2,3),(3,2),(4,1) → 4組", "和7：(1,6),(2,5),(3,4),(4,3),(5,2),(6,1) → 6組", "和11：(5,6),(6,5) → 2組", "合計：1+2+4+6+2 = 15組"],
      s3tip: "⚠️ 2つのサイコロの場合、見落としがないよう系統的にすべての組み合わせを書き出しましょう。対の表が大変役立ちます！",
      // Rangkuman points
      rPoints: [
        { poin: "理論的確率は、実際の実験をせずに論理だけで計算されます。", icon: "🧠" },
        { poin: "公式：P(A) = n(A) / n(S)、各結果が等しい確率を持つことが条件。", icon: "📐" },
        { poin: "確率の値は常に0（不可能）から1（確実）の間にあります。", icon: "📏" },
        { poin: "n(S)に対するn(A)が大きいほど、事象Aの確率は高くなります。", icon: "📈" },
        { poin: "2つ以上の試行では、n(S) = それぞれの可能性の積。", icon: "✖️" },
      ],
      backBtn: "← 確率メニューへ戻る",
    },
  }[language];

  /* ── decimal separator ── */
  const dc = language === "id" ? "{,}" : ".";

  /* ── language-adaptive KaTeX \text{} labels ── */
  const kGenap     = language === "id" ? "\\text{genap}"      : language === "en" ? "\\text{even}"       : "\\text{偶数}";
  const kAs        = language === "id" ? "\\text{As}"         : language === "en" ? "\\text{Ace}"        : "\\text{エース}";
  const kMerah     = language === "id" ? "\\text{merah}"      : language === "en" ? "\\text{red}"        : "\\text{赤}";
  const kKingHitam = language === "id" ? "\\text{King hitam}" : language === "en" ? "\\text{Black King}" : "\\text{黒のキング}";
  const kJumlah7   = language === "id" ? "\\text{jumlah}=7"   : language === "en" ? "\\text{sum}=7"      : "\\text{和}=7";
  const kSelisih2  = language === "id" ? "\\text{selisih}=2"  : language === "en" ? "\\text{difference}=2" : "\\text{差}=2";
  const kJumlahP   = language === "id" ? "\\text{jumlah prima}" : language === "en" ? "\\text{prime sum}" : "\\text{素数の和}";

  /* ── RangkumanSection data ── */
  const rangkumanData = language === "id" ? {
    judul: "Rangkuman — Peluang Teoretik",
    subjudul: "Peluang berdasarkan logika murni — tanpa perlu satu pun percobaan nyata!",
    ringkasan: [
      { emoji: "🧠", judul: "Apa Itu Peluang Teoretik?", isi: "Peluang yang dihitung menggunakan logika matematika dengan asumsi semua kemungkinan memiliki kesempatan sama besar (equally likely). Tidak perlu melakukan percobaan nyata.", bg: "bg-blue-900/50", border: "border-blue-500/40", textColor: "text-blue-200" },
      { emoji: "📐", judul: "Rumus Dasar", isi: "P(A) = n(A)/n(S). n(A) = banyak hasil yang diinginkan (anggota kejadian A). n(S) = banyak semua kemungkinan (anggota ruang sampel).", bg: "bg-indigo-900/50", border: "border-indigo-500/40", textColor: "text-indigo-200" },
      { emoji: "✅", judul: "Kejadian Pasti & Mustahil", isi: "Kejadian pasti: P(A) = 1 (pasti terjadi). Kejadian mustahil: P(A) = 0 (tidak mungkin terjadi). Semua peluang lain berada di antara 0 dan 1.", bg: "bg-violet-900/50", border: "border-violet-500/40", textColor: "text-violet-200" },
      { emoji: "🎯", judul: "Hubungan dengan Empirik", isi: "Peluang empirik mendekati peluang teoretik seiring bertambahnya percobaan. Keduanya saling melengkapi — teoretik memberi prediksi, empirik memberi verifikasi.", bg: "bg-purple-900/50", border: "border-purple-500/40", textColor: "text-purple-200" },
    ],
    tips: [
      { emoji: "🔢", teks: "Langkah sistematis: (1) Tentukan ruang sampel S, (2) Tentukan kejadian A yang diinginkan, (3) Hitung n(A) dan n(S), (4) Bagi n(A)/n(S)." },
      { emoji: "💡", teks: "Peluang selalu antara 0 dan 1. Jika hasilmu lebih dari 1 atau negatif, pasti ada kesalahan! Jadikan ini cek wajib setelah menghitung." },
      { emoji: "🎲", teks: "Dadu seimbang: P(tiap angka) = 1/6. Koin seimbang: P(G) = P(A) = 1/2. Kartu bridge: P(tiap kartu) = 1/52. Hafal fakta dasar ini!" },
      { emoji: "🃏", teks: "Trik cepat: untuk kartu bridge, ada 4 As, 13 kartu hati, 12 kartu gambar (J+Q+K x4), dan 26 kartu merah (hati+wajik). Sangat sering muncul di soal!" },
    ],
    kesimpulan: "Peluang teoretik adalah kekuatan matematika untuk memprediksi masa depan tanpa harus mengalaminya. Dari menghitung peluang jackpot lotere hingga memperkirakan efektivitas vaksin — semuanya bermula dari rumus sederhana P(A) = n(A)/n(S)!",
  } : language === "en" ? {
    judul: "Summary — Theoretical Probability",
    subjudul: "Probability based on pure logic — no experiment needed!",
    ringkasan: [
      { emoji: "🧠", judul: "What Is Theoretical Probability?", isi: "Probability calculated using mathematical logic, assuming all outcomes are equally likely. No real experiment is required.", bg: "bg-blue-900/50", border: "border-blue-500/40", textColor: "text-blue-200" },
      { emoji: "📐", judul: "Basic Formula", isi: "P(A) = n(A)/n(S). n(A) = number of desired outcomes (elements of event A). n(S) = total number of possible outcomes (elements of sample space).", bg: "bg-indigo-900/50", border: "border-indigo-500/40", textColor: "text-indigo-200" },
      { emoji: "✅", judul: "Certain & Impossible Events", isi: "Certain event: P(A) = 1 (always occurs). Impossible event: P(A) = 0 (can never occur). All other probabilities lie between 0 and 1.", bg: "bg-violet-900/50", border: "border-violet-500/40", textColor: "text-violet-200" },
      { emoji: "🎯", judul: "Relationship with Empirical", isi: "Empirical probability approaches theoretical probability as the number of trials increases. Both complement each other — theoretical gives predictions, empirical gives verification.", bg: "bg-purple-900/50", border: "border-purple-500/40", textColor: "text-purple-200" },
    ],
    tips: [
      { emoji: "🔢", teks: "Systematic steps: (1) Determine sample space S, (2) Identify event A, (3) Count n(A) and n(S), (4) Divide n(A)/n(S)." },
      { emoji: "💡", teks: "Probability is always between 0 and 1. If your result exceeds 1 or is negative, there's definitely a mistake! Make this a mandatory check after calculating." },
      { emoji: "🎲", teks: "Balanced die: P(each face) = 1/6. Fair coin: P(H) = P(T) = 1/2. Bridge cards: P(each card) = 1/52. Memorize these basic facts!" },
      { emoji: "🃏", teks: "Quick tip: in a bridge deck, there are 4 Aces, 13 hearts, 12 face cards (J+Q+K ×4), and 26 red cards (hearts+diamonds). These come up very often in problems!" },
    ],
    kesimpulan: "Theoretical probability is mathematics' power to predict the future without having to experience it. From calculating lottery jackpot odds to estimating vaccine effectiveness — it all starts from the simple formula P(A) = n(A)/n(S)!",
  } : {
    judul: "まとめ — 理論的確率",
    subjudul: "純粋な論理に基づく確率 — 実験は一切不要！",
    ringkasan: [
      { emoji: "🧠", judul: "理論的確率とは？", isi: "すべての結果が同様に確からしいという仮定のもと、数学的論理を使って計算される確率。実際の実験は不要です。", bg: "bg-blue-900/50", border: "border-blue-500/40", textColor: "text-blue-200" },
      { emoji: "📐", judul: "基本公式", isi: "P(A) = n(A)/n(S)。n(A) = 求めたい結果の数（事象Aの要素数）。n(S) = 起こりうる全結果の数（標本空間の要素数）。", bg: "bg-indigo-900/50", border: "border-indigo-500/40", textColor: "text-indigo-200" },
      { emoji: "✅", judul: "確実事象と不可能事象", isi: "確実事象：P(A) = 1（必ず起こる）。不可能事象：P(A) = 0（絶対に起こらない）。他のすべての確率は0と1の間。", bg: "bg-violet-900/50", border: "border-violet-500/40", textColor: "text-violet-200" },
      { emoji: "🎯", judul: "経験的確率との関係", isi: "試行回数が増えるにつれ、経験的確率は理論的確率に近づきます。両者は補い合う関係 — 理論が予測を与え、経験が検証を与えます。", bg: "bg-purple-900/50", border: "border-purple-500/40", textColor: "text-purple-200" },
    ],
    tips: [
      { emoji: "🔢", teks: "体系的な手順：(1)標本空間Sを決める、(2)事象Aを特定する、(3)n(A)とn(S)を数える、(4)n(A)/n(S)を計算する。" },
      { emoji: "💡", teks: "確率は常に0と1の間です。結果が1を超えたり負になったりした場合は必ず間違いがあります！計算後の必須チェックにしましょう。" },
      { emoji: "🎲", teks: "均等なサイコロ：P(各目) = 1/6。均等なコイン：P(表) = P(裏) = 1/2。トランプ：P(各カード) = 1/52。これらの基本事実を覚えましょう！" },
      { emoji: "🃏", teks: "早見メモ：トランプには4枚のエース、13枚のハート、12枚の絵札(J+Q+K×4)、26枚の赤いカード（ハート+ダイヤ）があります。問題に頻出です！" },
    ],
    kesimpulan: "理論的確率は、経験しなくても未来を予測できる数学の力です。宝くじの当選確率の計算からワクチンの有効性の推定まで — すべては簡単な公式P(A) = n(A)/n(S)から始まります！",
  };

  /* ── helpers ── */
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
      {true
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
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t.title}
        </h1>
        <p className="font-display text-sm font-semibold text-cyan-400 text-center mb-1">
          {t.subtitle}
        </p>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t.breadcrumb}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* ── PENGANTAR ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="intro" icon={<Lightbulb className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sec1Title} />
            {true && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {t.intro}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {t.defCards.map(({ term, icon, desc, color }) => (
                    <div key={term} className={`border ${color} rounded-xl p-3`}>
                      <p className="font-display text-sm font-bold mb-1">{icon} {term}</p>
                      <p className="font-body text-xs text-white/70 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>{t.tipKey}</strong>{" "}{t.tipText}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── KONSEP & RUMUS ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="konsep1" icon={<Calculator className="w-5 h-5" />} iconColor="text-blue-400" title={t.sec2Title} />
            {true && (
              <div className="px-5 pb-5 space-y-5">

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">{t.intisariLabel}</p>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {t.intisariText}{" "}
                    (<InlineMath math="n(A)" />){" "}
                    {t.intisariText2}{" "}
                    (<InlineMath math="n(S)" />).
                  </p>
                </div>

                {/* Rumus Utama */}
                <div className="bg-slate-800/60 border border-blue-500/30 rounded-xl p-4 space-y-3">
                  <p className="font-body text-xs font-bold text-blue-300 uppercase tracking-wide">{t.formulaLabel}</p>
                  <BlockMath math="P(A) = \frac{n(A)}{n(S)}" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-body">
                    <div className="bg-blue-900/30 border border-blue-500/20 rounded-lg p-2 text-center">
                      <p className="text-blue-300 font-bold"><InlineMath math="P(A)" /></p>
                      <p className="text-white/60 mt-1">{t.fPA}</p>
                    </div>
                    <div className="bg-green-900/30 border border-green-500/20 rounded-lg p-2 text-center">
                      <p className="text-green-300 font-bold"><InlineMath math="n(A)" /></p>
                      <p className="text-white/60 mt-1">{t.fnA}</p>
                    </div>
                    <div className="bg-violet-900/30 border border-violet-500/20 rounded-lg p-2 text-center">
                      <p className="text-violet-300 font-bold"><InlineMath math="n(S)" /></p>
                      <p className="text-white/60 mt-1">{t.fnS}</p>
                    </div>
                  </div>
                </div>

                {/* Contoh Visual: Dadu */}
                <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-white">{t.diceIllTitle}</p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div key={n} className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 font-display text-xl font-bold
                        ${[2, 4, 6].includes(n) ? "bg-cyan-800/60 border-cyan-400 text-cyan-200" : "bg-white/10 border-white/20 text-white/60"}`}>
                        {n}
                      </div>
                    ))}
                  </div>
                  <p className="font-body text-xs text-center text-cyan-300">{t.diceIllNote}</p>
                  <div className="bg-slate-800/40 border border-cyan-500/20 rounded-lg p-3 text-sm font-body">
                    <BlockMath math={`P(${kGenap}) = \\frac{n(\\{2,4,6\\})}{n(\\{1,2,3,4,5,6\\})} = \\frac{3}{6} = \\frac{1}{2}`} />
                  </div>
                </div>

                {/* Tabel Peluang */}
                <div className="space-y-2">
                  <p className="font-body text-sm font-bold text-white">{t.tableTitle}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-body border-collapse">
                      <thead>
                        <tr className="bg-violet-900/50">
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-left">{t.tKejadian}</th>
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-center">{t.tAnggota}</th>
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-center"><InlineMath math="n(A)" /></th>
                          <th className="border border-violet-500/30 px-3 py-2 text-violet-200 text-center"><InlineMath math="P(A)" /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {t.tableRows.map(([k, a, n, p], i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
                            <td className="border border-white/10 px-3 py-2 text-white">{k}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-cyan-300">{a}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-green-300">{n}</td>
                            <td className="border border-white/10 px-3 py-2 text-center text-yellow-300">{p}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── CONTOH SOAL ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="contoh1" icon={<Target className="w-5 h-5" />} iconColor="text-yellow-400" title={t.sec3Title} />
            {true && (
              <div className="px-5 pb-5 space-y-6">

                {/* SOAL 1 — MUDAH */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.bMudah} color="bg-green-700/60 text-green-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.soal} 1</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90">{t.s1q}</p>
                  </div>
                  <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-green-300 uppercase">{t.pembahasan}</p>
                    <p className="font-body text-sm text-white/80">{t.s1step1}</p>
                    <BlockMath math="S = \{1, 2, 3, 4, 5, 6\},\quad n(S) = 6" />
                    <p className="font-body text-sm text-white/80">{t.s1step2}</p>
                    <BlockMath math="A = \{1, 3, 5\},\quad n(A) = 3" />
                    <p className="font-body text-sm text-white/80">{t.s1step3}</p>
                    <BlockMath math="P(A) = \frac{n(A)}{n(S)} = \frac{3}{6} = \frac{1}{2}" />
                    <div className="bg-green-900/20 border border-green-500/20 rounded p-2">
                      <p className="font-body text-xs text-green-300">
                        {t.s1key}{" "}
                        <InlineMath math="\frac{1}{2}" /> {t.s1keyOr} <InlineMath math={`0${dc}5`} />.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 2 — SEDANG */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.bSedang} color="bg-yellow-700/60 text-yellow-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.soal} 2</p>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90" style={{ whiteSpace: "pre-line" }}>{t.s2q}</p>
                  </div>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-yellow-300 uppercase">{t.pembahasan}</p>
                    <BlockMath math="n(S) = 52" />
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{t.s2a}</p>
                      <BlockMath math={`P(${kAs}) = \\frac{4}{52} = \\frac{1}{13}`} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{t.s2b}</p>
                      <BlockMath math={`P(${kMerah}) = \\frac{26}{52} = \\frac{1}{2}`} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{t.s2c}</p>
                      <BlockMath math={`P(${kKingHitam}) = \\frac{2}{52} = \\frac{1}{26}`} />
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded p-2">
                      <p className="font-body text-xs text-yellow-300">
                        {t.s2tip} <InlineMath math="n(A)" /> {t.s2tip2}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* SOAL 3 — SULIT */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge label={t.bSulit} color="bg-red-700/60 text-red-200" />
                    <p className="font-body text-sm font-semibold text-white">{t.soal} 3</p>
                  </div>
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                    <p className="font-body text-sm text-white/90" style={{ whiteSpace: "pre-line" }}>{t.s3q}</p>
                  </div>
                  <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <p className="font-body text-xs font-bold text-red-300 uppercase">{t.pembahasan}</p>
                    <p className="font-body text-sm text-white/80">{t.s3ns} <InlineMath math="n(S) = 6 \times 6 = 36" /></p>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{t.s3a}</p>
                      <div className="bg-slate-800/50 rounded-lg px-3 py-2 text-xs font-body text-white/70 mb-1">
                        {t.s3aPairs}
                      </div>
                      <BlockMath math={`P(${kJumlah7}) = \\frac{6}{36} = \\frac{1}{6}`} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{t.s3b}</p>
                      <div className="bg-slate-800/50 rounded-lg px-3 py-2 text-xs font-body text-white/70 mb-1">
                        {t.s3bPairs}
                      </div>
                      <BlockMath math={`P(${kSelisih2}) = \\frac{8}{36} = \\frac{2}{9}`} />
                    </div>
                    <div>
                      <p className="font-body text-sm text-white/80 mb-1">{t.s3c}</p>
                      <div className="bg-slate-800/50 rounded-lg px-3 py-2 text-xs font-body text-white/70 mb-1 space-y-1">
                        {t.s3cRows.map((row, i) => (
                          <p key={i} className={i === t.s3cRows.length - 1 ? "font-bold text-white/90" : ""}>{row}</p>
                        ))}
                      </div>
                      <BlockMath math={`P(${kJumlahP}) = \\frac{15}{36} = \\frac{5}{12}`} />
                    </div>
                    <div className="bg-red-900/20 border border-red-500/20 rounded p-2">
                      <p className="font-body text-xs text-red-300">{t.s3tip}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RANGKUMAN ── */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <SectionHeader id="rangkuman" icon={<BookOpen className="w-5 h-5" />} iconColor="text-primary" title={t.sec4Title} />
            {true && (
              <div className="px-5 pb-5 space-y-3">
                <div className="grid grid-cols-1 gap-2 font-body text-sm">
                  {t.rPoints.map(({ poin, icon }) => (
                    <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                      <span className="text-lg shrink-0">{icon}</span>
                      <p className="text-white/80">{poin}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mt-2">
                  <BlockMath math="P(A) = \frac{n(A)}{n(S)} \quad,\quad 0 \leq P(A) \leq 1" />
                </div>
              </div>
            )}
          </div>

          <RangkumanSection
            gradientFrom="from-blue-900"
            gradientVia="via-indigo-900"
            gradientTo="to-violet-900"
            borderColor="border-blue-500/40"
            accentColor="text-blue-300"
            headerIcon="⚖️"
            judul={rangkumanData.judul}
            subjudul={rangkumanData.subjudul}
            ringkasan={rangkumanData.ringkasan}
            rumus={[
              {
                label: language === "id" ? "Peluang Teoretik" : language === "en" ? "Theoretical Probability" : "理論的確率",
                rumus: "P(A) = \\frac{n(A)}{n(S)}",
                bg: "bg-blue-900/60",
                border: "border-blue-400/40",
                labelColor: "text-blue-300",
              },
              {
                label: language === "id" ? "Rentang Nilai Peluang" : language === "en" ? "Probability Range" : "確率の範囲",
                rumus: "0 \\leq P(A) \\leq 1",
                bg: "bg-indigo-900/60",
                border: "border-indigo-400/40",
                labelColor: "text-indigo-300",
              },
            ]}
            tips={rangkumanData.tips}
            kesimpulan={rangkumanData.kesimpulan}
            kesimpulanBg="bg-gradient-to-r from-blue-900/80 to-indigo-900/80"
            kesimpulanBorder="border-blue-400/50"
            kesimpulanTextColor="text-blue-100"
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

export default PeluangTeoretikPage;
