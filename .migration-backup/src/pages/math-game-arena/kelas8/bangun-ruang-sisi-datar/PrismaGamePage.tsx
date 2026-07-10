import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Prisma adalah bangun ruang yang memiliki dua bidang alas yang ...",
    options: ["Berbeda bentuknya", "Kongruen dan sejajar", "Berbeda ukuran", "Saling tegak lurus"],
    correctIndex: 1,
  },
  {
    question: "Volume prisma segitiga dengan luas alas 20 cm² dan tinggi 8 cm adalah ...",
    options: ["140 cm³", "160 cm³", "180 cm³", "200 cm³"],
    correctIndex: 1,
  },
  {
    question: "Rumus volume prisma adalah ...",
    options: ["V = Luas Alas + Tinggi", "V = Luas Alas × Tinggi", "V = Keliling Alas × Tinggi", "V = (Luas Alas)²"],
    correctIndex: 1,
  },
  {
    question: "Prisma segitiga memiliki berapa buah sisi?",
    options: ["3", "4", "5", "6"],
    correctIndex: 2,
  },
  {
    question: "Luas permukaan prisma = 2 × luas alas + ...",
    options: ["Tinggi prisma", "Luas selimut", "Keliling alas", "Keliling alas × tinggi"],
    correctIndex: 3,
  },
];

const PrismaGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PRISMA"
    backPath="/math-game-arena/kelas-8/bangun-ruang-sisi-datar"
    backLabel="Kembali ke Bangun Ruang Sisi Datar"
  />
);

export default PrismaGamePage;
