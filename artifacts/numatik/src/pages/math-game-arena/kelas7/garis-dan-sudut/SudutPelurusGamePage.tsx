import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Dua sudut yang berpelurus berjumlah ...",
    options: ["90°", "180°", "270°", "360°"],
    correctIndex: 1,
  },
  {
    question: "Dua sudut yang berpenyiku berjumlah ...",
    options: ["45°", "90°", "180°", "360°"],
    correctIndex: 1,
  },
  {
    question: "Jika sebuah sudut besarnya 65°, maka sudut pelurusnya adalah ...",
    options: ["25°", "35°", "115°", "125°"],
    correctIndex: 2,
  },
  {
    question: "Jika sebuah sudut besarnya 35°, maka sudut penyikunya adalah ...",
    options: ["35°", "45°", "55°", "65°"],
    correctIndex: 2,
  },
  {
    question: "Dua sudut bertolak belakang selalu ...",
    options: ["Berjumlah 180°", "Berjumlah 90°", "Sama besar", "Berbeda besar"],
    correctIndex: 2,
  },
];

const SudutPelurusGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="SUDUT PELURUS, PENYIKU DAN BERTOLAK BELAKANG"
    backPath="/math-game-arena/kelas-7/garis-dan-sudut"
    backLabel="Kembali ke Garis & Sudut"
  />
);

export default SudutPelurusGamePage;
