import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Tuliskan 3.500 dalam notasi ilmiah!",
    options: ["35 × 10²", "3,5 × 10³", "0,35 × 10⁴", "3,5 × 10²"],
    correctIndex: 1,
  },
  {
    question: "Berapakah nilai dari 2,4 × 10³?",
    options: ["240", "24.000", "2.400", "0,0024"],
    correctIndex: 2,
  },
  {
    question: "Tuliskan 0,0056 dalam notasi ilmiah!",
    options: ["5,6 × 10⁻³", "5,6 × 10⁻²", "56 × 10⁻⁴", "0,56 × 10⁻²"],
    correctIndex: 0,
  },
  {
    question: "Jarak bumi ke matahari sekitar 150.000.000 km. Dalam notasi ilmiah adalah ...",
    options: ["1,5 × 10⁷", "1,5 × 10⁸", "15 × 10⁷", "1,5 × 10⁹"],
    correctIndex: 1,
  },
  {
    question: "Nilai 4,2 × 10⁻² dalam desimal adalah ...",
    options: ["420", "42", "0,042", "0,0042"],
    correctIndex: 2,
  },
];

const NotasiIlmiahGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="NOTASI ILMIAH"
    backPath="/math-game-arena/kelas-9/bilangan-berpangkat"
    backLabel="Kembali ke Bilangan Berpangkat"
  />
);

export default NotasiIlmiahGamePage;
