import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Rumus volume kerucut dengan jari-jari r dan tinggi t adalah ...",
    options: ["V = πr²t", "V = ⅓πr²t", "V = ⅔πr³", "V = 2πrt"],
    correctIndex: 1,
  },
  {
    question: "Sebuah kerucut memiliki jari-jari 6 cm dan tinggi 8 cm. Berapa panjang garis pelukisnya?",
    options: ["10 cm", "14 cm", "100 cm", "5 cm"],
    correctIndex: 0,
  },
  {
    question: "Rumus luas selimut kerucut dengan jari-jari r dan garis pelukis s adalah ...",
    options: ["πr²", "2πr", "πrs", "πr(r+s)"],
    correctIndex: 2,
  },
  {
    question: "Kerucut dengan jari-jari 7 cm dan garis pelukis 25 cm. Luas selimutnya adalah ... (π = 22/7)",
    options: ["550 cm²", "275 cm²", "1.100 cm²", "175 cm²"],
    correctIndex: 0,
  },
  {
    question: "Kerucut dengan jari-jari 3 cm dan tinggi 4 cm. Volumenya adalah ... (π = 3,14)",
    options: ["37,68 cm³", "113,04 cm³", "12,56 cm³", "75,36 cm³"],
    correctIndex: 0,
  },
];

const KerucutGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="KERUCUT"
    backPath="/math-game-arena/kelas-9/bangun-ruang-sisi-lengkung"
    backLabel="Kembali ke Bangun Ruang Sisi Lengkung"
  />
);

export default KerucutGamePage;
