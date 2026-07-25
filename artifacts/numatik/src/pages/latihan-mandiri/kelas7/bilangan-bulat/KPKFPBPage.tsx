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
}

const QUESTIONS_BY_LANG: Record<Lang, Question[]> = {
  id: [
    { number: 1,  type: "essay", content: `a. Tulislah bilangan-bilangan kelipatan 6 dan kelipatan 8 yang kurang dari 60!\nb. Tentukan kelipatan persekutuan dari 6 dan 8!\nc. Berapakah KPK dari 6 dan 8?` },
    { number: 2,  type: "essay", content: `a. Tulislah bilangan-bilangan kelipatan 3, 6, dan 9 yang kurang dari 50!\nb. Tentukan kelipatan persekutuan dari 3, 6, dan 9!\nc. Berapakah KPK dari 3, 6, dan 9?` },
    { number: 3,  type: "essay", content: `a. Tulislah faktor-faktor dari 42 dan 56!\nb. Tentukan faktor-faktor persekutuan dari 42 dan 56!\nc. Berapakah FPB dari 42 dan 56?` },
    { number: 4,  type: "essay", content: `a. Tulislah faktor-faktor dari 40, 60, dan 100!\nb. Tentukan faktor-faktor persekutuan dari 40, 60, dan 100!\nc. Berapakah FPB dari 40, 60, dan 100?` },
    { number: 5,  type: "essay", content: `Tentukan KPK dari pasangan bilangan berikut!\na. 18 dan 45\nb. 20 dan 50\nc. 28, 42, dan 70` },
    { number: 6,  type: "essay", content: `Tentukan FPB dari pasangan bilangan berikut!\na. 48 dan 72\nb. 90 dan 120\nc. 36, 54, dan 90` },
    { number: 7,  type: "essay", content: `Sebuah toko lampu memiliki tiga jenis lampu hias. Lampu warna merah menyala setiap 20 menit, lampu kuning setiap 30 menit, dan lampu hijau setiap 40 menit. Jika pada pukul 19.00 ketiga lampu tersebut menyala bersamaan, pada pukul berapakah ketiga lampu akan menyala bersamaan lagi berikutnya?` },
    { number: 8,  type: "essay", content: `Petugas keamanan A berjaga setiap 3 hari sekali, petugas B setiap 4 hari sekali, dan petugas C setiap 5 hari sekali. Jika tanggal 1 Mei mereka berjaga bersama, kapan mereka akan berjaga bersama lagi berikutnya?` },
    { number: 9,  type: "essay", content: `Tersedia 72 butir telur asin, 54 butir telur ayam, dan 90 butir telur bebek yang akan dimasukkan ke dalam beberapa wadah. Jika setiap wadah berisi jenis telur dengan jumlah yang sama rata, berapa wadah sebanyak-banyaknya yang dibutuhkan?` },
    { number: 10, type: "essay", content: `Panitia bakti sosial menyediakan 120 buku tulis dan 80 pensil. Jika buku dan pensil tersebut akan dibagikan secara merata kepada anak-anak kurang mampu, berapa orang terbanyak yang dapat menerima paket bantuan tersebut?` },
  ],
  en: [
    { number: 1,  type: "essay", content: `a. Write down the multiples of 6 and multiples of 8 that are less than 60!\nb. Find the common multiples of 6 and 8!\nc. What is the LCM of 6 and 8?` },
    { number: 2,  type: "essay", content: `a. Write down the multiples of 3, 6, and 9 that are less than 50!\nb. Find the common multiples of 3, 6, and 9!\nc. What is the LCM of 3, 6, and 9?` },
    { number: 3,  type: "essay", content: `a. Write down the factors of 42 and 56!\nb. Find the common factors of 42 and 56!\nc. What is the GCF of 42 and 56?` },
    { number: 4,  type: "essay", content: `a. Write down the factors of 40, 60, and 100!\nb. Find the common factors of 40, 60, and 100!\nc. What is the GCF of 40, 60, and 100?` },
    { number: 5,  type: "essay", content: `Find the LCM of the following number pairs!\na. 18 and 45\nb. 20 and 50\nc. 28, 42, and 70` },
    { number: 6,  type: "essay", content: `Find the GCF of the following number pairs!\na. 48 and 72\nb. 90 and 120\nc. 36, 54, and 90` },
    { number: 7,  type: "essay", content: `A decoration lamp store has three types of decorative lights. The red light flashes every 20 minutes, the yellow light every 30 minutes, and the green light every 40 minutes. If all three lights flash simultaneously at 7:00 PM, at what time will all three lights next flash together?` },
    { number: 8,  type: "essay", content: `Security guard A is on duty every 3 days, guard B every 4 days, and guard C every 5 days. If on May 1st they are all on duty together, when will they next be on duty together?` },
    { number: 9,  type: "essay", content: `There are 72 salted eggs, 54 chicken eggs, and 90 duck eggs that will be placed into several containers. If each container holds the same number of each type of egg, how many containers at most are needed?` },
    { number: 10, type: "essay", content: `The social service committee provides 120 notebooks and 80 pencils. If the books and pencils are to be distributed equally to underprivileged children, what is the maximum number of children who can receive the aid package?` },
  ],
  ja: [
    { number: 1,  type: "essay", content: `a. 60より小さい6の倍数と8の倍数を書きなさい！\nb. 6と8の公倍数を求めなさい！\nc. 6と8の最小公倍数（LCM）はいくつですか？` },
    { number: 2,  type: "essay", content: `a. 50より小さい3、6、9の倍数を書きなさい！\nb. 3、6、9の公倍数を求めなさい！\nc. 3、6、9の最小公倍数（LCM）はいくつですか？` },
    { number: 3,  type: "essay", content: `a. 42と56の約数を書きなさい！\nb. 42と56の公約数を求めなさい！\nc. 42と56の最大公約数（GCF）はいくつですか？` },
    { number: 4,  type: "essay", content: `a. 40、60、100の約数を書きなさい！\nb. 40、60、100の公約数を求めなさい！\nc. 40、60、100の最大公約数（GCF）はいくつですか？` },
    { number: 5,  type: "essay", content: `次の数のペアの最小公倍数（LCM）を求めなさい！\na. 18 と 45\nb. 20 と 50\nc. 28、42、70` },
    { number: 6,  type: "essay", content: `次の数のペアの最大公約数（GCF）を求めなさい！\na. 48 と 72\nb. 90 と 120\nc. 36、54、90` },
    { number: 7,  type: "essay", content: `ある照明店に3種類の装飾ライトがあります。赤いライトは20分ごと、黄色いライトは30分ごと、緑のライトは40分ごとに点灯します。19時に3つのライトが同時に点灯した場合、次に同時に点灯するのは何時ですか？` },
    { number: 8,  type: "essay", content: `警備員Aは3日ごと、警備員Bは4日ごと、警備員Cは5日ごとに当番です。5月1日に3人が一緒に当番の場合、次に一緒に当番になるのはいつですか？` },
    { number: 9,  type: "essay", content: `塩卵72個、鶏卵54個、アヒル卵90個をいくつかの容器に入れます。各容器に各種類の卵を同じ数だけ入れる場合、必要な容器の最大数は何個ですか？` },
    { number: 10, type: "essay", content: `社会奉仕委員会がノート120冊と鉛筆80本を用意しました。これらを恵まれない子どもたちに均等に配る場合、支援パッケージを受け取れる最大人数は何人ですか？` },
  ],
};

const KPKFPBPage = () => {
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
          {t('practice.bilanganBulat.pageTitles.kpkFpb')}
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

export default KPKFPBPage;
