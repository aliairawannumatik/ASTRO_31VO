import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

type Lang = "id" | "en" | "ja";

interface Question {
  number: number;
  type: "math" | "essay";
  math?: string;
  content?: string;
}

// Questions 1–7 are pure math expressions — identical across all languages.
const MATH_QUESTIONS: Question[] = [
  { number: 1,  type: "math", math: "25 + 48 : (-8) = ..." },
  { number: 2,  type: "math", math: "64 - 26 \\times (-4) = ..." },
  { number: 3,  type: "math", math: "12 + 120 : 10 \\times (-5) = ..." },
  { number: 4,  type: "math", math: "21 - 24 \\times (-6) : 12 = ..." },
  { number: 5,  type: "math", math: "80 : 5 + 9 \\times (-11) = ..." },
  { number: 6,  type: "math", math: "126 : 9 \\times (-13) - 6 \\times 17 = ..." },
  { number: 7,  type: "math", math: "(-20) + 8 \\times 5 - 18 : (-3) = ..." },
];

const ESSAY_QUESTIONS_BY_LANG: Record<Lang, Question[]> = {
  id: [
    { number: 8,  type: "essay", content: `Dalam kompetensi Bahasa Inggris yang terdiri dari 50 soal, peserta akan mendapatkan skor 4 untuk setiap jawaban benar, skor -2 untuk setiap jawaban salah, dan skor -1 untuk soal yang tidak dijawab. Jika Budi menjawab 44 soal dan yang benar 36 soal, maka skor yang diperoleh Budi adalah ...` },
    { number: 9,  type: "essay", content: `Dalam suatu pertandingan setiap kemenangan mendapat nilai 3, seri bernilai 1 dan kalah bernilai -2. Jika tim SMPN 28 BDG bermain sebanyak 20 kali dengan meraih 10 kemenangan dan 4 seri, maka nilai yang diperoleh SMPN 28 BDG adalah ...` },
    { number: 10, type: "essay", content: `Bus Trans Jakarta berisi penumpang berangkat dari terminal ke pasar, di halte pertama turun 4 orang, di halte kedua naik 2 orang sampai di pasar ternyata ada 15 orang. Berapa banyak penumpang yang naik pada terminal?` },
    { number: 11, type: "essay", content: `Perhatikan suhu udara di beberapa negara berikut!\nWina -7°C\nSoul -1°C\nBaghdad 39°C\nSurabaya 33°C\nSelisih suhu udara yang benar di bawah ini adalah.....\n- Selisih suhu udara Wina dan Soul -6°C\n- Selisih suhu udara Baghdad dan Wina 30°C\n- Selisih suhu udara Surabaya dan Soul adalah 34°C\n- Selisih udara Surabaya dan Wina adalah 39°C` },
    { number: 12, type: "essay", content: `Pa Bangun menjual gorengan dengan harga Rp. 5000 per 4 gorengan. Bagus membeli 32 gorengan. Jika Ia membayar dengan uang lima puluh ribu, uang kembali yang diterima Bagus adalah sebesar........` },
    { number: 13, type: "essay", content: `Suhu di kota Moskow 11°C. Pada saat turun salju, suhunya turun 4°C setiap 15 menit. Suhu di kota tersebut setelah turun salju 1 jam adalah ..` },
    { number: 14, type: "essay", content: `Operasi "*" berarti kalikan bilangan pertama dengan dua kali bilangan ke dua, kemudian tambahkan hasilnya dengan bilangan ke dua. Hasil dari 5 * 3 adalah .......` },
    { number: 15, type: "essay", content: `Operasi " # " artinya kalikan bilangan pertama dengan bilangan kedua, kemudian kurangkan hasilnya dengan dua kali bilangan kedua. Hasil dari 5 # - 4 adalah......` },
  ],
  en: [
    { number: 8,  type: "essay", content: `In an English language competition consisting of 50 questions, participants receive a score of 4 for each correct answer, −2 for each wrong answer, and −1 for each unanswered question. If Budi answers 44 questions and 36 of them are correct, Budi's score is ...` },
    { number: 9,  type: "essay", content: `In a competition, each win earns 3 points, a draw earns 1 point, and a loss earns −2 points. If SMPN 28 BDG team plays 20 games, winning 10 and drawing 4, the total score obtained by SMPN 28 BDG is ...` },
    { number: 10, type: "essay", content: `A Trans Jakarta bus carrying passengers departs from the terminal to the market. At the first stop, 4 people get off; at the second stop, 2 people get on. At the market, there are 15 people. How many passengers boarded at the terminal?` },
    { number: 11, type: "essay", content: `Notice the air temperature in several countries below!\nVienna −7°C\nSeoul −1°C\nBaghdad 39°C\nSurabaya 33°C\nWhich of the following temperature differences is correct?\n− Vienna and Seoul: −6°C\n− Baghdad and Vienna: 30°C\n− Surabaya and Seoul: 34°C\n− Surabaya and Vienna: 39°C` },
    { number: 12, type: "essay", content: `Mr. Bangun sells fried snacks at Rp. 5,000 per 4 pieces. Bagus buys 32 pieces. If he pays with a fifty-thousand rupiah bill, the change Bagus receives is ...` },
    { number: 13, type: "essay", content: `The temperature in Moscow is 11°C. When it snows, the temperature drops 4°C every 15 minutes. The temperature in that city after 1 hour of snowfall is ...` },
    { number: 14, type: "essay", content: `Operation "*" means multiply the first number by twice the second number, then add the result to the second number. The result of 5 * 3 is ...` },
    { number: 15, type: "essay", content: `Operation "#" means multiply the first number by the second number, then subtract twice the second number from the result. The result of 5 # −4 is ...` },
  ],
  ja: [
    { number: 8,  type: "essay", content: `50問からなる英語コンテストで、正解1問につき4点、不正解1問につき −2点、未回答1問につき −1点が与えられます。ブディが44問に答え、そのうち36問が正解だった場合、ブディの得点は…` },
    { number: 9,  type: "essay", content: `ある試合で、勝利は3点、引き分けは1点、敗北は −2点です。SMPN 28 BDG チームが20試合行い、10勝4分けだった場合、SMPN 28 BDG の合計スコアは…` },
    { number: 10, type: "essay", content: `乗客を乗せたトランスジャカルタのバスがターミナルから市場へ出発します。最初のバス停で4人が降り、2番目のバス停で2人が乗りました。市場では15人がいます。ターミナルで乗った乗客は何人ですか？` },
    { number: 11, type: "essay", content: `次のいくつかの国の気温に注目しなさい！\nウィーン −7℃\nソウル −1℃\nバグダード 39℃\nスラバヤ 33℃\n以下の気温差で正しいものはどれですか？\n− ウィーンとソウル：−6℃\n− バグダードとウィーン：30℃\n− スラバヤとソウル：34℃\n− スラバヤとウィーン：39℃` },
    { number: 12, type: "essay", content: `バングン氏は揚げスナックを4個で Rp. 5,000で売っています。バグスは32個購入しました。5万ルピア札で支払った場合、バグスが受け取るお釣りは…` },
    { number: 13, type: "essay", content: `モスクワの気温は11℃です。雪が降ると、15分ごとに温度が4℃下がります。1時間の降雪後の気温は…` },
    { number: 14, type: "essay", content: `演算「*」は最初の数に第二の数の2倍を掛け、その結果に第二の数を加えることを意味します。5 * 3 の結果は…` },
    { number: 15, type: "essay", content: `演算「#」は最初の数に第二の数を掛け、その結果から第二の数の2倍を引くことを意味します。5 # −4 の結果は…` },
  ],
};

const OperasiCampuranPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = (["id", "en", "ja"].includes(i18n.language) ? i18n.language : "en") as Lang;
  const questions: Question[] = [...MATH_QUESTIONS, ...ESSAY_QUESTIONS_BY_LANG[lang]];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t('practice.bilanganBulat.pageTitles.operasiCampuran')}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {t('practice.bilanganBulat.pageSubtitle')}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div
              key={q.number}
              className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4 animate-slide-up"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <div className="flex items-start gap-3">
                <span className="bg-accent/20 text-accent text-xs font-bold px-2 py-1 rounded shrink-0">
                  {q.number}
                </span>
                <div className="flex-1">
                  {q.type === "math" ? (
                    <div className="text-white">
                      <InlineMath math={q.math!} />
                    </div>
                  ) : (
                    <p className="font-body text-sm text-white whitespace-pre-line">{q.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/bilangan-bulat"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t('practice.bilanganBulat.backTo')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OperasiCampuranPage;
