import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

const questions = [
  {
    number: 1,
    content: `a. Tulislah bilangan-bilangan kelipatan 6 dan kelipatan 8 yang kurang dari 60!
b. Tentukan kelipatan persekutuan dari 6 dan 8!
c. Berapakah KPK dari 6 dan 8?`,
    type: "essay"
  },
  {
    number: 2,
    content: `a. Tulislah bilangan-bilangan kelipatan 3, 6, dan 9 yang kurang dari 50!
b. Tentukan kelipatan persekutuan dari 3, 6, dan 9!
c. Berapakah KPK dari 3, 6, dan 9?`,
    type: "essay"
  },
  {
    number: 3,
    content: `a. Tulislah faktor-faktor dari 42 dan 56!
b. Tentukan faktor-faktor persekutuan dari 42 dan 56!
c. Berapakah FPB dari 42 dan 56?`,
    type: "essay"
  },
  {
    number: 4,
    content: `a. Tulislah faktor-faktor dari 40, 60, dan 100!
b. Tentukan faktor-faktor persekutuan dari 40, 60, dan 100!
c. Berapakah FPB dari 40, 60, dan 100?`,
    type: "essay"
  },
  {
    number: 5,
    content: `Tentukan KPK dari pasangan bilangan berikut dengan cara memfaktorkan (pohon faktor)!
a. 18 dan 45
b. 20 dan 50
c. 28, 42, dan 70`,
    type: "essay"
  },
  {
    number: 6,
    content: `Tentukan FPB dari pasangan bilangan berikut dengan cara memfaktorkan (pohon faktor)!
a. 48 dan 72
b. 90 dan 120
c. 36, 54, dan 90`,
    type: "essay"
  },
  {
    number: 7,
    content: `Sebuah toko lampu memiliki tiga jenis lampu hias. Lampu warna merah menyala setiap 20 menit, lampu kuning setiap 30 menit, dan lampu hijau setiap 40 menit. Jika pada pukul 19.00 ketiga lampu tersebut menyala bersamaan, pada pukul berapakah ketiga lampu akan menyala bersamaan lagi berikutnya?`,
    type: "essay"
  },
  {
    number: 8,
    content: `Roni berenang setiap 4 hari sekali. Dimas dan Edo berenang masing-masing setiap 8 hari dan 10 hari sekali. Jika pada tanggal 15 Januari mereka berenang bersama-sama, pada tanggal berapa mereka akan berenang bersama-sama lagi untuk kedua kalinya?`,
    type: "essay"
  },
  {
    number: 9,
    content: `Petugas keamanan A berjaga setiap 3 hari sekali, petugas B setiap 4 hari sekali, dan petugas C setiap 5 hari sekali. Jika tanggal 1 Mei mereka berjaga bersama, kapan mereka akan berjaga bersama lagi berikutnya?`,
    type: "essay"
  },
  {
    number: 10,
    content: `Tersedia 72 butir telur asin, 54 butir telur ayam, dan 90 butir telur bebek yang akan dimasukkan ke dalam beberapa wadah. Jika setiap wadah berisi jenis telur dengan jumlah yang sama rata, berapa wadah sebanyak-banyaknya yang dibutuhkan?`,
    type: "essay"
  },
  {
    number: 11,
    content: `Panitia bakti sosial menyediakan 120 buku tulis dan 80 pensil. Jika buku dan pensil tersebut akan dibagikan secara merata kepada anak-anak kurang mampu, berapa orang terbanyak yang dapat menerima paket bantuan tersebut?`,
    type: "essay"
  },
];

const KPKFPBPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          KPK DAN FPB
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

export default KPKFPBPage;
