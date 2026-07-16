import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Rumus volume bola dengan jari-jari r adalah ...",
    options: ["V = 4πr²", "V = ⁴⁄₃πr³", "V = πr³", "V = ⅓πr³"],
    correctIndex: 1,
  },
  {
    question: "Rumus luas permukaan bola adalah ...",
    options: ["πr²", "2πr²", "4πr²", "3πr²"],
    correctIndex: 2,
  },
  {
    question: "Bola dengan jari-jari 7 cm. Luas permukaannya adalah ... (π = 22/7)",
    options: ["616 cm²", "308 cm²", "1.232 cm²", "154 cm²"],
    correctIndex: 0,
  },
  {
    question: "Bola dengan diameter 6 cm. Volumenya adalah ... (π = 3,14)",
    options: ["113,04 cm³", "904,32 cm³", "56,52 cm³", "75,36 cm³"],
    correctIndex: 0,
  },
  {
    question: "Jika jari-jari bola dua kali lipat, maka volumenya menjadi ... kali lipat.",
    options: ["2", "4", "6", "8"],
    correctIndex: 3,
  },
];

const BolaGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="BOLA"
    backPath="/math-game-arena/kelas-9/bangun-ruang-sisi-lengkung"
    backLabel="Kembali ke Bangun Ruang Sisi Lengkung"
  />
);

export default BolaGamePage;
