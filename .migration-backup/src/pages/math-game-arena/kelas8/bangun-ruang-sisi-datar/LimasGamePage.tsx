import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Limas adalah bangun ruang yang alasnya berbentuk segi-n dan sisi tegaknya berbentuk ...",
    options: ["Persegi panjang", "Trapesium", "Segitiga", "Jajargenjang"],
    correctIndex: 2,
  },
  {
    question: "Volume limas dengan luas alas 24 cm² dan tinggi 10 cm adalah ...",
    options: ["60 cm³", "70 cm³", "80 cm³", "90 cm³"],
    correctIndex: 2,
  },
  {
    question: "Rumus volume limas adalah ...",
    options: ["V = Luas Alas × Tinggi", "V = 1/2 × Luas Alas × Tinggi", "V = 1/3 × Luas Alas × Tinggi", "V = 2/3 × Luas Alas × Tinggi"],
    correctIndex: 2,
  },
  {
    question: "Limas segi empat memiliki berapa buah sisi?",
    options: ["3", "4", "5", "6"],
    correctIndex: 2,
  },
  {
    question: "Limas persegi dengan sisi alas 6 cm dan tinggi 4 cm. Volume limas adalah ...",
    options: ["42 cm³", "48 cm³", "72 cm³", "96 cm³"],
    correctIndex: 1,
  },
];

const LimasGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="LIMAS"
    backPath="/math-game-arena/kelas-8/bangun-ruang-sisi-datar"
    backLabel="Kembali ke Bangun Ruang Sisi Datar"
  />
);

export default LimasGamePage;
