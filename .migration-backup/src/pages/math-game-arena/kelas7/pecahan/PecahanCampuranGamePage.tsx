import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Ubah pecahan campuran 2 3/4 ke bentuk pecahan biasa!",
    options: ["9/4", "11/4", "8/4", "10/4"],
    correctIndex: 1,
  },
  {
    question: "Pecahan 17/5 diubah ke bentuk campuran menjadi ...",
    options: ["3 1/5", "3 2/5", "2 4/5", "4 1/5"],
    correctIndex: 1,
  },
  {
    question: "Berapakah nilai 45% dalam bentuk pecahan paling sederhana?",
    options: ["9/10", "9/20", "3/5", "4/5"],
    correctIndex: 1,
  },
  {
    question: "Pecahan campuran 3 2/5 dalam bentuk persen adalah ...",
    options: ["320%", "340%", "360%", "380%"],
    correctIndex: 1,
  },
  {
    question: "Manakah yang merupakan bentuk paling sederhana dari 12/16?",
    options: ["2/3", "3/4", "4/5", "6/8"],
    correctIndex: 1,
  },
];

const PecahanCampuranGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PECAHAN CAMPURAN DAN PERSEN"
    backPath="/math-game-arena/kelas-7/bilangan-rasional"
    backLabel="Kembali ke Pecahan"
  />
);

export default PecahanCampuranGamePage;
