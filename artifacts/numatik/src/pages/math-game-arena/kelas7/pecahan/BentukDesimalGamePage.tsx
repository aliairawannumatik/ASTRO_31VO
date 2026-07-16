import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Ubah 3/4 ke bentuk desimal!",
    options: ["0,34", "0,75", "0,25", "0,50"],
    correctIndex: 1,
  },
  {
    question: "Ubah 0,6 ke bentuk pecahan paling sederhana!",
    options: ["6/10", "3/5", "6/100", "3/4"],
    correctIndex: 1,
  },
  {
    question: "Urutan desimal dari terbesar ke terkecil: 0,25; 0,5; 0,125; 0,75",
    options: ["0,75; 0,5; 0,25; 0,125", "0,125; 0,25; 0,5; 0,75", "0,5; 0,75; 0,25; 0,125", "0,25; 0,5; 0,125; 0,75"],
    correctIndex: 0,
  },
  {
    question: "Berapakah nilai 2/5 dalam bentuk desimal?",
    options: ["0,25", "0,40", "0,45", "0,50"],
    correctIndex: 1,
  },
  {
    question: "Ubah 1,25 ke bentuk pecahan campuran!",
    options: ["1 1/2", "1 1/4", "1 2/5", "1 3/4"],
    correctIndex: 1,
  },
];

const BentukDesimalGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="BENTUK DESIMAL"
    backPath="/math-game-arena/kelas-7/bilangan-rasional"
    backLabel="Kembali ke Pecahan"
  />
);

export default BentukDesimalGamePage;
