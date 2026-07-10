import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Dua bangun datar dikatakan sebangun jika ...",
    options: [
      "Sudut-sudutnya sama besar dan sisi-sisinya sama panjang",
      "Sudut-sudutnya sama besar dan sisi-sisi bersesuaian sebanding",
      "Luasnya sama",
      "Kelilingnya sama",
    ],
    correctIndex: 1,
  },
  {
    question: "Dua bangun datar dikatakan kongruen jika ...",
    options: [
      "Memiliki bentuk yang sama saja",
      "Memiliki ukuran yang sama saja",
      "Memiliki bentuk dan ukuran yang sama",
      "Memiliki luas yang sama",
    ],
    correctIndex: 2,
  },
  {
    question: "Manakah pernyataan yang BENAR tentang dua persegi panjang yang sebangun?",
    options: [
      "Luas kedua persegi panjang harus sama",
      "Perbandingan panjang dan lebar masing-masing harus sama",
      "Keliling kedua persegi panjang harus sama",
      "Semua persegi panjang pasti sebangun",
    ],
    correctIndex: 1,
  },
  {
    question: "Simbol yang digunakan untuk menyatakan dua bangun kongruen adalah ...",
    options: ["~", "≅", "=", "∼"],
    correctIndex: 1,
  },
  {
    question: "Semua lingkaran adalah ...",
    options: ["Kongruen", "Sebangun", "Tidak sebangun", "Berbentuk sama saja"],
    correctIndex: 1,
  },
];

const DefinisiGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="DEFINISI KESEBANGUNAN DAN KEKONGRUENAN"
    backPath="/math-game-arena/kelas-9/kesebangunan-kekongruenan"
    backLabel="Kembali ke Kesebangunan & Kekongruenan"
  />
);

export default DefinisiGamePage;
