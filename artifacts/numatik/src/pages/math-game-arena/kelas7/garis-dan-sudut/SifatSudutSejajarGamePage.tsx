import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Sudut sehadap (corresponding angles) yang dibentuk dua garis sejajar dipotong garis lain bersifat ...",
    options: ["Saling pelurus", "Sama besar", "Berjumlah 180°", "Saling penyiku"],
    correctIndex: 1,
  },
  {
    question: "Sudut dalam berseberangan (alternate interior angles) yang dibentuk dua garis sejajar bersifat ...",
    options: ["Berjumlah 90°", "Berjumlah 180°", "Sama besar", "Berlipat ganda"],
    correctIndex: 2,
  },
  {
    question: "Sudut dalam sepihak (co-interior angles) yang dibentuk dua garis sejajar berjumlah ...",
    options: ["90°", "180°", "270°", "360°"],
    correctIndex: 1,
  },
  {
    question: "Jika garis a // garis b dan sudut sehadap pertama adalah 70°, maka sudut sehadap kedua adalah ...",
    options: ["110°", "70°", "20°", "140°"],
    correctIndex: 1,
  },
  {
    question: "Jika garis p // garis q dan sudut dalam sepihak satu sudutnya 65°, maka sudut yang lain adalah ...",
    options: ["65°", "90°", "115°", "125°"],
    correctIndex: 2,
  },
];

const SifatSudutSejajarGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="SIFAT SUDUT DUA GARIS SEJAJAR"
    backPath="/math-game-arena/kelas-7/garis-dan-sudut"
    backLabel="Kembali ke Garis & Sudut"
  />
);

export default SifatSudutSejajarGamePage;
