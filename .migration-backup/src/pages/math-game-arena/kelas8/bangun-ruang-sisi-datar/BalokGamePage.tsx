import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Balok memiliki berapa pasang sisi yang kongruen?",
    options: ["2 pasang", "3 pasang", "4 pasang", "6 pasang"],
    correctIndex: 1,
  },
  {
    question: "Volume balok dengan panjang 5 cm, lebar 4 cm, dan tinggi 3 cm adalah ...",
    options: ["40 cm³", "48 cm³", "60 cm³", "120 cm³"],
    correctIndex: 2,
  },
  {
    question: "Luas permukaan balok dengan p = 6 cm, l = 4 cm, t = 3 cm adalah ...",
    options: ["72 cm²", "108 cm²", "120 cm²", "144 cm²"],
    correctIndex: 1,
  },
  {
    question: "Rumus volume balok adalah ...",
    options: ["V = p + l + t", "V = p × l × t", "V = 2(pl + pt + lt)", "V = p² × t"],
    correctIndex: 1,
  },
  {
    question: "Diagonal ruang balok dengan p = 3, l = 4, t = 12 adalah ...",
    options: ["11", "13", "15", "17"],
    correctIndex: 1,
  },
];

const BalokGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="BALOK"
    backPath="/math-game-arena/kelas-8/bangun-ruang-sisi-datar"
    backLabel="Kembali ke Bangun Ruang Sisi Datar"
  />
);

export default BalokGamePage;
