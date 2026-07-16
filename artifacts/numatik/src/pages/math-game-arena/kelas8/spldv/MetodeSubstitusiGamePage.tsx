import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Pada metode substitusi, langkah pertama adalah ...",
    options: ["Menjumlahkan kedua persamaan", "Menyatakan salah satu variabel dari salah satu persamaan", "Mengalikan kedua persamaan", "Menggambar grafik"],
    correctIndex: 1,
  },
  {
    question: "Dari persamaan x + y = 5, jika y = 2, maka x = ...",
    options: ["2", "3", "5", "7"],
    correctIndex: 1,
  },
  {
    question: "Dari x = y + 3 dan x + y = 7, substitusikan x ke persamaan kedua: (y+3) + y = 7, maka y = ...",
    options: ["1", "2", "3", "4"],
    correctIndex: 1,
  },
  {
    question: "Dari x = 2y dan 3x - y = 10, substitusikan: 3(2y) - y = 10, maka y = ...",
    options: ["1", "2", "3", "4"],
    correctIndex: 1,
  },
  {
    question: "Jika x + y = 8 dan x - y = 2, dengan metode substitusi nilai x = ...",
    options: ["3", "4", "5", "6"],
    correctIndex: 2,
  },
];

const MetodeSubstitusiGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENYELESAIAN SPLDV DENGAN METODE SUBSTITUSI"
    backPath="/math-game-arena/kelas-8/spldv"
    backLabel="Kembali ke SPLDV"
  />
);

export default MetodeSubstitusiGamePage;
