import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Luas sebuah persegi panjang 60 cm². Panjangnya 4 cm lebih dari lebarnya. Lebar persegi panjang tersebut adalah ...",
    options: ["6 cm", "8 cm", "10 cm", "12 cm"],
    correctIndex: 0,
  },
  {
    question: "Jumlah dua bilangan bulat positif adalah 10 dan hasil kalinya 24. Bilangan-bilangan tersebut adalah ...",
    options: ["4 dan 6", "3 dan 7", "2 dan 8", "5 dan 5"],
    correctIndex: 0,
  },
  {
    question: "Tinggi suatu benda yang dilempar ke atas setelah t detik adalah h = 20t - 5t². Benda mencapai tanah saat t = ...",
    options: ["2 detik", "4 detik", "5 detik", "10 detik"],
    correctIndex: 1,
  },
  {
    question: "Sebuah taman berbentuk persegi. Jika sisinya diperpanjang 4 m, luasnya menjadi 100 m². Sisi awal taman adalah ...",
    options: ["6 m", "8 m", "10 m", "12 m"],
    correctIndex: 0,
  },
  {
    question: "Hasil kali dua bilangan berurutan adalah 72. Bilangan yang lebih kecil adalah ...",
    options: ["6", "7", "8", "9"],
    correctIndex: 2,
  },
];

const PenerapanGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENERAPAN PERSAMAAN KUADRAT"
    backPath="/math-game-arena/kelas-9/persamaan-kuadrat"
    backLabel="Kembali ke Persamaan Kuadrat"
  />
);

export default PenerapanGamePage;
