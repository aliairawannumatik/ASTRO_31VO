import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Rumus panjang busur dengan sudut pusat α dan jari-jari r adalah ...",
    options: ["Busur = α/360 × 2πr", "Busur = α/180 × πr", "Busur = α × 2πr", "Busur = α/360 × πr²"],
    correctIndex: 0,
  },
  {
    question: "Rumus luas juring dengan sudut pusat α dan jari-jari r adalah ...",
    options: ["Juring = α/360 × 2πr", "Juring = α/360 × πr²", "Juring = α × πr²", "Juring = α/180 × πr²"],
    correctIndex: 1,
  },
  {
    question: "Panjang busur lingkaran dengan r = 7 cm dan sudut pusat 90° (π = 22/7) adalah ...",
    options: ["11 cm", "22 cm", "44 cm", "7 cm"],
    correctIndex: 0,
  },
  {
    question: "Luas juring dengan r = 7 cm dan sudut pusat 90° (π = 22/7) adalah ...",
    options: ["38,5 cm²", "77 cm²", "154 cm²", "19,25 cm²"],
    correctIndex: 0,
  },
  {
    question: "Jika sudut pusat juring = 60° dan r = 6 cm, luas juring (π ≈ 3,14) adalah ...",
    options: ["18,84 cm²", "37,68 cm²", "113,04 cm²", "6,28 cm²"],
    correctIndex: 0,
  },
];

const BusurJuringGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PANJANG BUSUR DAN LUAS JURING"
    backPath="/math-game-arena/kelas-8/lingkaran"
    backLabel="Kembali ke Lingkaran"
  />
);

export default BusurJuringGamePage;
