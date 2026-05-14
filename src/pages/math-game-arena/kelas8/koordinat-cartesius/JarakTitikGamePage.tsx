import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Jarak titik A(0, 0) ke titik B(3, 4) adalah ...",
    options: ["3", "4", "5", "7"],
    correctIndex: 2,
  },
  {
    question: "Jarak titik A(1, 2) ke titik B(4, 6) adalah ...",
    options: ["3", "4", "5", "7"],
    correctIndex: 2,
  },
  {
    question: "Jarak titik P(2, 3) ke sumbu X adalah ...",
    options: ["2", "3", "5", "√13"],
    correctIndex: 1,
  },
  {
    question: "Jarak titik Q(-3, 0) ke sumbu Y adalah ...",
    options: ["0", "3", "-3", "9"],
    correctIndex: 1,
  },
  {
    question: "Jarak titik A(0, 4) ke titik B(3, 0) adalah ...",
    options: ["4", "5", "7", "3"],
    correctIndex: 1,
  },
];

const JarakTitikGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="JARAK ANTAR DUA TITIK DAN JARAK TITIK KE GARIS"
    backPath="/math-game-arena/kelas-8/koordinat-cartesius"
    backLabel="Kembali ke Koordinat Kartesius"
  />
);

export default JarakTitikGamePage;
