import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Rumus keliling lingkaran dengan jari-jari r adalah ...",
    options: ["K = πr²", "K = 2πr", "K = πd²", "K = 2πr²"],
    correctIndex: 1,
  },
  {
    question: "Rumus luas lingkaran dengan jari-jari r adalah ...",
    options: ["L = 2πr", "L = πr", "L = πr²", "L = 2πr²"],
    correctIndex: 2,
  },
  {
    question: "Keliling lingkaran dengan jari-jari 7 cm (π = 22/7) adalah ...",
    options: ["22 cm", "44 cm", "154 cm", "22π cm"],
    correctIndex: 1,
  },
  {
    question: "Luas lingkaran dengan jari-jari 7 cm (π = 22/7) adalah ...",
    options: ["44 cm²", "154 cm²", "22 cm²", "308 cm²"],
    correctIndex: 1,
  },
  {
    question: "Diameter lingkaran = 14 cm. Keliling lingkaran (π = 22/7) adalah ...",
    options: ["22 cm", "44 cm", "88 cm", "154 cm"],
    correctIndex: 1,
  },
];

const KelilingLuasLingkaranGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="KELILING DAN LUAS LINGKARAN"
    backPath="/math-game-arena/kelas-8/lingkaran"
    backLabel="Kembali ke Lingkaran"
  />
);

export default KelilingLuasLingkaranGamePage;
