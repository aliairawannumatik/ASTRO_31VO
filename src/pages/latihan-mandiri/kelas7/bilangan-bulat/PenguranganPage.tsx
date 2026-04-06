import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const questions = [
  {
    number: 1,
    content: `a. Hitunglah hasil pengurangan bilangan berikut ini!
(i) 7 - 15 dan 15 - 7
(ii) -12 - 6 dan 6 - (-12)
(iii) 30 - (-9) dan -9 - 30
b. Bila x dan y sembarang bilangan bulat, apakah x - y = y - x?
c. Berdasarkan hasil di atas, apakah pengurangan pada bilangan bulat bersifat komutatif?`,
    type: "essay"
  },
  {
    number: 2,
    content: `Posisi sebuah drone pengintai (A), kapal selam (B), dan terumbu karang (C) berturut-turut adalah 85 m (di atas permukaan laut), -45 m, dan -15 m dari permukaan air laut. Berapa meter selisih ketinggian posisi-posisi berikut?
a. A dengan B
b. C dengan B
c. A dengan C`,
    type: "essay"
  },
  {
    number: 3,
    content: `Sederhanakanlah bentuk-bentuk operasi bilangan berikut!
a. 8 - 21 + 15
b. 14 + (-9) + (-18)
c. -11 - 32 + 25
d. 26 + (-14) - (-8)
e. -22 - (-35) - (-12)
f. -27 + 18 - (-24)
g. -9 - 18 - 25
h. -45 - (-14) + 22`,
    type: "essay"
  },
  {
    number: 4,
    content: `Kecepatan jelajah sebuah pesawat baling-baling pada kondisi udara tenang adalah 250 km/jam. Jika pesawat tersebut terbang melintasi area pegunungan yang memiliki kecepatan hembusan angin 30 km/jam, hitunglah kecepatan aktual pesawat tersebut jika bergerak dengan kondisi berikut:
a. terbang searah dengan dorongan angin,
b. terbang berlawanan arah dengan dorongan angin (melawan angin).`,
    type: "essay"
  },
  {
    number: 5,
    content: `Pada proses pembuatan baja, lelehan logam cair yang bersuhu 1.250°C didinginkan secara cepat menggunakan cairan pendingin khusus hingga suhunya turun tajam dan mencapai -15°C. Berapa derajatkah perbedaan suhu antara lelehan awal dan setelah didinginkan tersebut?`,
    type: "essay"
  },
];

const PenguranganPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PENGURANGAN BILANGAN BULAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 7 - Bilangan Bulat - Latihan Mandiri</p>

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
            Kembali ke Bilangan Bulat
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenguranganPage;
