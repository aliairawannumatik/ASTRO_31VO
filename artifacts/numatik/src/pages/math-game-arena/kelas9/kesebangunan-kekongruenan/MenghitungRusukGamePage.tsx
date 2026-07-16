import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Dua persegi panjang sebangun. Yang pertama berukuran 4 cm × 6 cm, yang kedua panjangnya 12 cm. Berapakah lebarnya?",
    options: ["8 cm", "18 cm", "6 cm", "9 cm"],
    correctIndex: 0,
  },
  {
    question: "Foto asli berukuran 3 cm × 5 cm diperbesar sebangun hingga lebarnya 15 cm. Berapakah panjangnya?",
    options: ["9 cm", "25 cm", "10 cm", "20 cm"],
    correctIndex: 1,
  },
  {
    question: "Dua segitiga sebangun. Sisi segitiga pertama 6 cm, 8 cm, dan 10 cm. Sisi terpendek segitiga kedua 9 cm. Berapakah sisi terpanjangnya?",
    options: ["12 cm", "15 cm", "18 cm", "20 cm"],
    correctIndex: 1,
  },
  {
    question: "Peta dibuat dengan skala 1:500.000. Jika jarak di peta 3 cm, berapakah jarak sebenarnya?",
    options: ["1.500 km", "15 km", "150 km", "1,5 km"],
    correctIndex: 1,
  },
  {
    question: "Dua persegi sebangun. Sisi persegi pertama 5 cm dan sisi persegi kedua 10 cm. Perbandingan luasnya adalah ...",
    options: ["1:2", "1:4", "2:1", "4:1"],
    correctIndex: 1,
  },
];

const MenghitungRusukGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="MENGHITUNG PANJANG RUSUK BANGUN DATAR YANG SEBANGUN"
    backPath="/math-game-arena/kelas-9/kesebangunan-kekongruenan"
    backLabel="Kembali ke Kesebangunan & Kekongruenan"
  />
);

export default MenghitungRusukGamePage;
