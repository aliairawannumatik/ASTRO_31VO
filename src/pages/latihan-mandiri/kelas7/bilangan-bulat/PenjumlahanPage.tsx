import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const questions = [
  {
    number: 1,
    title: "Perubahan Suhu",
    content: `Pada suatu pagi, suhu di sebuah ruangan pendingin adalah 4°C. Berapa derajat suhu di ruangan tersebut jika mengalami perubahan berikut?
a. Suhu naik 7°C.
b. Suhu turun 12°C.`,
    type: "essay"
  },
  {
    number: 2,
    title: "Posisi Ketinggian/Kedalaman",
    content: `Pasangan bilangan berikut menunjukkan posisi ketinggian suatu tempat atau kedalaman penyelam dari permukaan air laut. Dari tiap-tiap pasangan bilangan berikut, manakah posisi yang lebih tinggi?
a. 15 m dan -25 m
b. -50 m dan -10 m`,
    type: "essay"
  },
  {
    number: 3,
    title: "Selisih Suhu",
    content: `Suhu sebuah ruangan biasa tercatat 25°C. Suhu di dalam lemari pembeku (freezer) 33°C lebih rendah dari suhu ruangan tersebut. Berapa suhu di dalam lemari pembeku saat ini?`,
    type: "essay"
  },
  {
    number: 4,
    title: "Perbandingan Suhu",
    content: `Tentukan, suhu manakah yang lebih tinggi dari pasangan suhu berikut?
a. 18°C dan 14°C
b. 5°C dan 0°C
c. 0°C dan -7°C
d. -3°C dan -1°C
e. -8°C dan 2°C
f. -4°C dan -9°C`,
    type: "essay"
  },
  {
    number: 5,
    title: "Menyisipkan Tanda Ketidaksamaan",
    content: `Sisipkan lambang > atau < sehingga menjadi kalimat matematika yang benar!
a. 52 ... -31
b. 74 ... -92
c. -41 ... 55
d. -95 ... 112
e. -18 ... -14
f. -35 ... -60`,
    type: "essay"
  },
  {
    number: 6,
    title: "Mengurutkan Bilangan Bulat",
    content: `Susunlah deretan bilangan berikut menurut urutan naik (dari yang terkecil ke yang terbesar), dan sisipkan lambang < sehingga menjadi kalimat yang benar!
a. 9, 21, 14
b. -7, 15, 0
c. 11, -14, 5
d. -20, -25, 18`,
    type: "essay"
  },
  {
    number: 7,
    title: "Penjumlahan dengan Garis Bilangan",
    content: `Pergunakan garis bilangan untuk menghitung hasil operasi penjumlahan berikut!
a. 4 + 6
b. 8 + (-3)
c. 6 + (-10)
d. -4 + 7
e. -8 + 5
f. -7 + (-2)`,
    type: "essay"
  },
  {
    number: 8,
    title: "Penjumlahan Bilangan Bulat",
    content: `Hitunglah hasil penjumlahan bilangan bulat berikut tanpa menggunakan alat bantu (kalkulator)!
a. 35 + (-15)
b. 12 + (-21)
c. 25 + (-36)
d. -9 + (-15)
e. -22 + (-8)
f. 56 + (-24)
g. 73 + (-85)
h. -58 + (-64)`,
    type: "essay"
  },
];

const PenjumlahanPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PENJUMLAHAN BILANGAN BULAT
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
                  {q.title && (
                    <h3 className="font-body text-sm font-semibold text-primary mb-2">{q.title}</h3>
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
            Kembali ke Bilangan Bulat
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenjumlahanPage;
