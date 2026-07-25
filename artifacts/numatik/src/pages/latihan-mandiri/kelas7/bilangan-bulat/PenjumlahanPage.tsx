import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

type Lang = "id" | "en" | "ja";

interface Question {
  number: number;
  title: string;
  content: string;
  type: string;
}

const QUESTIONS_BY_LANG: Record<Lang, Question[]> = {
  id: [
    { number: 1, title: "Perubahan Suhu", content: `Pada suatu pagi, suhu di sebuah ruangan pendingin adalah 4°C. Berapa derajat suhu di ruangan tersebut jika mengalami perubahan berikut?\na. Suhu naik 7°C.\nb. Suhu turun 12°C.`, type: "essay" },
    { number: 2, title: "Posisi Ketinggian/Kedalaman", content: `Pasangan bilangan berikut menunjukkan posisi ketinggian suatu tempat atau kedalaman penyelam dari permukaan air laut. Dari tiap-tiap pasangan bilangan berikut, manakah posisi yang lebih tinggi?\na. 15 m dan -25 m\nb. -50 m dan -10 m`, type: "essay" },
    { number: 3, title: "Selisih Suhu", content: `Suhu sebuah ruangan biasa tercatat 25°C. Suhu di dalam lemari pembeku (freezer) 33°C lebih rendah dari suhu ruangan tersebut. Berapa suhu di dalam lemari pembeku saat ini?`, type: "essay" },
    { number: 4, title: "Perbandingan Suhu", content: `Tentukan, suhu manakah yang lebih tinggi dari pasangan suhu berikut?\na. 18°C dan 14°C\nb. 5°C dan 0°C\nc. 0°C dan -7°C\nd. -3°C dan -1°C\ne. -8°C dan 2°C`, type: "essay" },
    { number: 5, title: "Menyisipkan Tanda Ketidaksamaan", content: `Sisipkan lambang > atau < sehingga menjadi kalimat matematika yang benar!\na. 52 ... -31\nb. 74 ... -92\nc. -41 ... 55\nd. -95 ... 112\ne. -18 ... -14`, type: "essay" },
    { number: 6, title: "Mengurutkan Bilangan Bulat", content: `Susunlah deretan bilangan berikut menurut urutan naik (dari yang terkecil ke yang terbesar), dan sisipkan lambang < sehingga menjadi kalimat yang benar!\na. 9, 21, 14\nb. -7, 15, 0\nc. 11, -14, 5\nd. -20, -25, 18`, type: "essay" },
    { number: 7, title: "Penjumlahan dengan Garis Bilangan", content: `Pergunakan garis bilangan untuk menghitung hasil operasi penjumlahan berikut!\na. 4 + 6\nb. 8 + (-3)\nc. 6 + (-10)\nd. -4 + 7\ne. -8 + 5\nf. -7 + (-2)`, type: "essay" },
    { number: 8, title: "Penjumlahan Bilangan Bulat", content: `Hitunglah hasil penjumlahan bilangan bulat berikut tanpa menggunakan alat bantu (kalkulator)!\na. 35 + (-15)\nb. 12 + (-21)\nc. -9 + (-15)\nd. 56 + (-24)\ne. -58 + (-64)`, type: "essay" },
  ],
  en: [
    { number: 1, title: "Temperature Change", content: `One morning, the temperature in a cold storage room is 4°C. What is the temperature in that room if it undergoes the following changes?\na. Temperature rises 7°C.\nb. Temperature drops 12°C.`, type: "essay" },
    { number: 2, title: "Altitude / Depth Positions", content: `The following number pairs show the altitude of a location or the depth of a diver from sea level. From each pair of numbers below, which position is higher?\na. 15 m and −25 m\nb. −50 m and −10 m`, type: "essay" },
    { number: 3, title: "Temperature Difference", content: `The temperature of a regular room is recorded as 25°C. The temperature inside a freezer is 33°C lower than the room temperature. What is the current temperature inside the freezer?`, type: "essay" },
    { number: 4, title: "Temperature Comparison", content: `Determine which temperature is higher from each of the following pairs:\na. 18°C and 14°C\nb. 5°C and 0°C\nc. 0°C and −7°C\nd. −3°C and −1°C\ne. −8°C and 2°C`, type: "essay" },
    { number: 5, title: "Inserting Inequality Symbols", content: `Insert the symbol > or < to make each a correct mathematical sentence!\na. 52 ... −31\nb. 74 ... −92\nc. −41 ... 55\nd. −95 ... 112\ne. −18 ... −14`, type: "essay" },
    { number: 6, title: "Ordering Integers", content: `Arrange the following number sequences in ascending order (smallest to largest) and insert < to make a correct sentence!\na. 9, 21, 14\nb. −7, 15, 0\nc. 11, −14, 5\nd. −20, −25, 18`, type: "essay" },
    { number: 7, title: "Addition Using a Number Line", content: `Use a number line to calculate the result of the following addition operations!\na. 4 + 6\nb. 8 + (−3)\nc. 6 + (−10)\nd. −4 + 7\ne. −8 + 5\nf. −7 + (−2)`, type: "essay" },
    { number: 8, title: "Integer Addition", content: `Calculate the result of the following integer additions without using a calculator!\na. 35 + (−15)\nb. 12 + (−21)\nc. −9 + (−15)\nd. 56 + (−24)\ne. −58 + (−64)`, type: "essay" },
  ],
  ja: [
    { number: 1, title: "温度の変化", content: `ある朝、冷蔵庫の温度は4℃でした。次の変化があった場合、部屋の温度は何度になりますか？\na. 温度が7℃上がる。\nb. 温度が12℃下がる。`, type: "essay" },
    { number: 2, title: "高度・深度の位置", content: `次の数のペアは、ある場所の高度または海面からのダイバーの深度を示しています。次のペアのうち、どちらの位置が高いですか？\na. 15 m と −25 m\nb. −50 m と −10 m`, type: "essay" },
    { number: 3, title: "温度差", content: `普通の部屋の温度は25℃と記録されています。冷凍庫の中の温度は室温より33℃低いです。現在の冷凍庫の温度は何℃ですか？`, type: "essay" },
    { number: 4, title: "温度の比較", content: `次の温度ペアのうち、どちらが高いか答えなさい。\na. 18℃ と 14℃\nb. 5℃ と 0℃\nc. 0℃ と −7℃\nd. −3℃ と −1℃\ne. −8℃ と 2℃`, type: "essay" },
    { number: 5, title: "不等号の挿入", content: `正しい数式になるように > または < を入れなさい！\na. 52 ... −31\nb. 74 ... −92\nc. −41 ... 55\nd. −95 ... 112\ne. −18 ... −14`, type: "essay" },
    { number: 6, title: "整数の順序", content: `次の数列を昇順（小さい順）に並べ替え、< を入れて正しい文にしなさい！\na. 9, 21, 14\nb. −7, 15, 0\nc. 11, −14, 5\nd. −20, −25, 18`, type: "essay" },
    { number: 7, title: "数直線を使った加法", content: `数直線を使って次の加法の結果を求めなさい！\na. 4 + 6\nb. 8 + (−3)\nc. 6 + (−10)\nd. −4 + 7\ne. −8 + 5\nf. −7 + (−2)`, type: "essay" },
    { number: 8, title: "整数の加法", content: `計算機を使わずに次の整数の加法を計算しなさい！\na. 35 + (−15)\nb. 12 + (−21)\nc. −9 + (−15)\nd. 56 + (−24)\ne. −58 + (−64)`, type: "essay" },
  ],
};

const PenjumlahanPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = (["id", "en", "ja"].includes(i18n.language) ? i18n.language : "en") as Lang;
  const questions = QUESTIONS_BY_LANG[lang];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t('practice.bilanganBulat.pageTitles.penjumlahan')}
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
                  <h3 className="font-body text-sm font-semibold text-primary mb-2">{q.title}</h3>
                  <p className="font-body text-sm text-white whitespace-pre-line">{q.content}</p>
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

export default PenjumlahanPage;
