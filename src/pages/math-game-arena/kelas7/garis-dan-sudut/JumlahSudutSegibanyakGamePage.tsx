import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Jumlah seluruh sudut pada segitiga adalah ...",
    options: ["90°", "180°", "270°", "360°"],
    correctIndex: 1,
  },
  {
    question: "Jumlah seluruh sudut pada segiempat adalah ...",
    options: ["180°", "270°", "360°", "450°"],
    correctIndex: 2,
  },
  {
    question: "Berapakah jumlah sudut dalam segilima (pentagon)?",
    options: ["360°", "450°", "540°", "720°"],
    correctIndex: 2,
  },
  {
    question: "Jumlah sudut dalam segi-n dapat dihitung dengan rumus ...",
    options: ["n × 90°", "(n - 1) × 180°", "(n - 2) × 180°", "(n + 2) × 180°"],
    correctIndex: 2,
  },
  {
    question: "Berapakah besar masing-masing sudut dalam segienam beraturan (hexagon)?",
    options: ["100°", "108°", "120°", "135°"],
    correctIndex: 2,
  },
];

const JumlahSudutSegibanyakGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="JUMLAH SUDUT PADA SEGI BANYAK"
    backPath="/math-game-arena/kelas-7/garis-dan-sudut"
    backLabel="Kembali ke Garis & Sudut"
  />
);

export default JumlahSudutSegibanyakGamePage;
