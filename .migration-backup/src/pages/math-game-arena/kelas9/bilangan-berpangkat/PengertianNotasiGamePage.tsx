import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Berapakah nilai dari 2³?",
    options: ["6", "8", "9", "12"],
    correctIndex: 1,
  },
  {
    question: "Pada bilangan berpangkat 5⁴, bilangan 5 disebut ...",
    options: ["Pangkat", "Eksponen", "Basis/Pokok", "Koefisien"],
    correctIndex: 2,
  },
  {
    question: "Berapakah nilai dari 3⁴?",
    options: ["12", "64", "81", "27"],
    correctIndex: 2,
  },
  {
    question: "Manakah yang merupakan cara membaca 7²?",
    options: ["Tujuh pangkat dua", "Dua pangkat tujuh", "Tujuh kali dua", "Dua kali tujuh"],
    correctIndex: 0,
  },
  {
    question: "Berapakah nilai dari 10³?",
    options: ["30", "300", "1.000", "10.000"],
    correctIndex: 2,
  },
];

const PengertianNotasiGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENGERTIAN DAN NOTASI PANGKAT"
    backPath="/math-game-arena/kelas-9/bilangan-berpangkat"
    backLabel="Kembali ke Bilangan Berpangkat"
  />
);

export default PengertianNotasiGamePage;
