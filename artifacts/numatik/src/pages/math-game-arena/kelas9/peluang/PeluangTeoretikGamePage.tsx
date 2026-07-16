import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Sebuah dadu dilempar sekali. Peluang muncul angka genap adalah ...",
    options: ["1/6", "1/3", "1/2", "2/3"],
    correctIndex: 2,
  },
  {
    question: "Peluang suatu kejadian yang mustahil terjadi adalah ...",
    options: ["1", "0", "0,5", "Tidak terdefinisi"],
    correctIndex: 1,
  },
  {
    question: "Peluang suatu kejadian yang pasti terjadi adalah ...",
    options: ["0", "0,5", "1", "2"],
    correctIndex: 2,
  },
  {
    question: "Dalam sekotak berisi 5 bola merah dan 3 bola biru. Peluang terambil bola merah adalah ...",
    options: ["3/8", "5/8", "5/3", "3/5"],
    correctIndex: 1,
  },
  {
    question: "Rumus peluang teoretik kejadian A adalah ...",
    options: [
      "P(A) = n(A) + n(S)",
      "P(A) = n(A) × n(S)",
      "P(A) = n(A) / n(S)",
      "P(A) = n(S) / n(A)",
    ],
    correctIndex: 2,
  },
];

const PeluangTeoretikGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PELUANG TEORETIK"
    backPath="/math-game-arena/kelas-9/peluang"
    backLabel="Kembali ke Peluang"
  />
);

export default PeluangTeoretikGamePage;
