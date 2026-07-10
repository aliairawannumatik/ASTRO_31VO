import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Pada segitiga siku-siku dengan sisi 3 cm, 4 cm, dan 5 cm, berapakah perbandingan sisi pendek terhadap sisi miring?",
    options: ["3/4", "3/5", "4/5", "4/3"],
    correctIndex: 1,
  },
  {
    question: "Segitiga siku-siku ABC, sudut siku-siku di C. Garis CD tegak lurus AB. Maka segitiga ACD sebangun dengan ...",
    options: ["Segitiga ABC", "Segitiga BCD", "Keduanya", "Tidak ada"],
    correctIndex: 0,
  },
  {
    question: "Pada segitiga siku-siku, jika kaki-kakinya 5 dan 12, berapakah sisi miringnya?",
    options: ["15", "17", "13", "11"],
    correctIndex: 2,
  },
  {
    question: "Tinggi suatu segitiga siku-siku ke sisi miring = 6 cm. Proyeksi kaki pertama ke sisi miring = 4 cm. Berapakah panjang kaki pertama?",
    options: ["√52", "2√13", "√40", "2√10"],
    correctIndex: 1,
  },
  {
    question: "Segitiga siku-siku dengan kaki 8 dan 15. Berapakah sisi miringnya?",
    options: ["17", "18", "16", "23"],
    correctIndex: 0,
  },
];

const RasioRusukGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="RASIO RUSUK SEGITIGA SIKU-SIKU"
    backPath="/math-game-arena/kelas-9/kesebangunan-kekongruenan"
    backLabel="Kembali ke Kesebangunan & Kekongruenan"
  />
);

export default RasioRusukGamePage;
