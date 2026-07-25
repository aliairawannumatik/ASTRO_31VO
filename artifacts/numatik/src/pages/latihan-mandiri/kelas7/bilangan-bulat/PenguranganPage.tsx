import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

type Lang = "id" | "en" | "ja";

interface Question {
  number: number;
  content: string;
  type: string;
  image?: string;
  imageCaption?: string;
}

const QUESTIONS_BY_LANG: Record<Lang, Question[]> = {
  id: [
    {
      number: 1,
      content: `a. Hitunglah hasil pengurangan bilangan berikut ini!\n(i) 7 - 15 dan 15 - 7\n(ii) -12 - 6 dan 6 - (-12)\n(iii) 30 - (-9) dan -9 - 30\nb. Bila x dan y sembarang bilangan bulat, apakah x - y = y - x?\nc. Berdasarkan hasil di atas, apakah pengurangan pada bilangan bulat bersifat komutatif?`,
      type: "essay",
    },
    {
      number: 2,
      content: `Posisi sebuah drone pengintai (A), kapal selam (B), dan terumbu karang (C) berturut-turut adalah 85 m (di atas permukaan laut), -15 m, dan -45 m dari permukaan air laut. Berapa meter selisih ketinggian posisi-posisi berikut?\na. A dengan B\nb. C dengan B\nc. A dengan C`,
      type: "essay",
      image: "/images/drone-kapal-selam.png",
      imageCaption: "Sumber gambar: Bing Image Creator (https://www.bing.com/images/create)",
    },
    {
      number: 3,
      content: `Sederhanakanlah bentuk-bentuk operasi bilangan berikut!\na. 8 - 21 + 15\nb. 14 + (-9) + (-18)\nc. -11 - 32 + 25\nd. 26 + (-14) - (-8)\ne. -22 - (-35) - (-12)\nf. -27 + 18 - (-24)\ng. -9 - 18 - 25\nh. -45 - (-14) + 22`,
      type: "essay",
    },
    {
      number: 4,
      content: `Kecepatan jelajah sebuah pesawat baling-baling pada kondisi udara tenang adalah 250 km/jam. Jika pesawat tersebut terbang melintasi area pegunungan yang memiliki kecepatan hembusan angin 30 km/jam, hitunglah kecepatan aktual pesawat tersebut jika bergerak dengan kondisi berikut:\na. terbang searah dengan dorongan angin,\nb. terbang berlawanan arah dengan dorongan angin (melawan angin).`,
      type: "essay",
    },
    {
      number: 5,
      content: `Pada proses pembuatan baja, lelehan logam cair yang bersuhu 1.250°C didinginkan secara cepat menggunakan cairan pendingin khusus hingga suhunya turun tajam dan mencapai -15°C. Berapa derajatkah perbedaan suhu antara lelehan awal dan setelah didinginkan tersebut?`,
      type: "essay",
    },
  ],
  en: [
    {
      number: 1,
      content: `a. Calculate the result of the following subtractions!\n(i) 7 − 15 and 15 − 7\n(ii) −12 − 6 and 6 − (−12)\n(iii) 30 − (−9) and −9 − 30\nb. If x and y are any integers, is x − y = y − x?\nc. Based on the results above, is subtraction of integers commutative?`,
      type: "essay",
    },
    {
      number: 2,
      content: `The positions of a surveillance drone (A), a submarine (B), and a coral reef (C) are 85 m (above sea level), −15 m, and −45 m from sea level, respectively. How many meters is the difference in altitude between the following positions?\na. A and B\nb. C and B\nc. A and C`,
      type: "essay",
      image: "/images/drone-kapal-selam.png",
      imageCaption: "Image source: Bing Image Creator (https://www.bing.com/images/create)",
    },
    {
      number: 3,
      content: `Simplify the following number operations!\na. 8 − 21 + 15\nb. 14 + (−9) + (−18)\nc. −11 − 32 + 25\nd. 26 + (−14) − (−8)\ne. −22 − (−35) − (−12)\nf. −27 + 18 − (−24)\ng. −9 − 18 − 25\nh. −45 − (−14) + 22`,
      type: "essay",
    },
    {
      number: 4,
      content: `The cruising speed of a propeller aircraft in calm air conditions is 250 km/h. If the aircraft flies over a mountainous area with a wind speed of 30 km/h, calculate the actual speed of the aircraft under the following conditions:\na. flying in the same direction as the wind,\nb. flying against the wind (facing the wind).`,
      type: "essay",
    },
    {
      number: 5,
      content: `During steel production, molten metal at 1,250°C is rapidly cooled using a special coolant until its temperature drops sharply to −15°C. What is the temperature difference between the initial melt and after cooling?`,
      type: "essay",
    },
  ],
  ja: [
    {
      number: 1,
      content: `a. 次の引き算の結果を計算しなさい！\n(i) 7 − 15 と 15 − 7\n(ii) −12 − 6 と 6 − (−12)\n(iii) 30 − (−9) と −9 − 30\nb. x と y が任意の整数のとき、x − y = y − x は成り立つか？\nc. 以上の結果から、整数の引き算は交換法則が成り立つか？`,
      type: "essay",
    },
    {
      number: 2,
      content: `偵察ドローン（A）、潜水艦（B）、サンゴ礁（C）の位置は、それぞれ海面から 85 m（上）、−15 m、−45 m です。次の位置の高度差は何メートルですか？\na. A と B\nb. C と B\nc. A と C`,
      type: "essay",
      image: "/images/drone-kapal-selam.png",
      imageCaption: "画像出典：Bing Image Creator (https://www.bing.com/images/create)",
    },
    {
      number: 3,
      content: `次の計算を簡単にしなさい！\na. 8 − 21 + 15\nb. 14 + (−9) + (−18)\nc. −11 − 32 + 25\nd. 26 + (−14) − (−8)\ne. −22 − (−35) − (−12)\nf. −27 + 18 − (−24)\ng. −9 − 18 − 25\nh. −45 − (−14) + 22`,
      type: "essay",
    },
    {
      number: 4,
      content: `穏やかな気象条件でのプロペラ機の巡航速度は 250 km/h です。風速 30 km/h の山岳地帯を飛行する場合、次の条件での実際の速度を求めなさい：\na. 風と同じ方向に飛行する場合、\nb. 風と逆方向に飛行する場合（向かい風）。`,
      type: "essay",
    },
    {
      number: 5,
      content: `鉄鋼の製造過程で、1,250℃の溶融金属が特殊な冷却液で急速に冷却され、温度が −15℃まで急降下しました。初期の溶融状態と冷却後の温度差は何度ですか？`,
      type: "essay",
    },
  ],
};

const PenguranganPage = () => {
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
          {t('practice.bilanganBulat.pageTitles.pengurangan')}
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
                  {q.image && (
                    <div className="mb-3">
                      <img
                        src={q.image}
                        alt="Question illustration"
                        className="rounded-xl w-full max-w-xs mx-auto block object-cover"
                      />
                      {q.imageCaption && (
                        <p className="text-center text-white/40 text-xs mt-1 font-body italic">{q.imageCaption}</p>
                      )}
                    </div>
                  )}
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

export default PenguranganPage;
