import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Hitunglah hasil dari perkalian bilangan berikut: 8 × (−7) = ...",
    options: ["56", "−15", "−56", "15"],
    correctIndex: 2,
  },
  {
    question: "Hitunglah hasil dari perkalian bilangan berikut: −5 × (−12) = ...",
    options: ["−17", "17", "−60", "60"],
    correctIndex: 3,
  },
  {
    question: "Hitunglah hasil dari operasi bilangan campuran berikut: −8 × (−20 + 12) = ...",
    options: ["64", "256", "−64", "−256"],
    correctIndex: 0,
  },
  {
    question: "Suhu ruangan pendingin mula-mula −10°C. Alat pendingin rusak dan suhu naik 2°C setiap 15 menit. Berapa suhu ruangan setelah 1 jam?",
    options: ["−2°C", "−18°C", "8°C", "2°C"],
    correctIndex: 0,
  },
  {
    question: "Olimpiade 50 soal: benar +5, salah −2, kosong −1. Peserta menjawab 38 soal benar dan 4 soal tidak dijawab. Berapakah total nilainya?",
    options: ["174", "170", "190", "186"],
    correctIndex: 1,
  },
];

const PerkalianGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PERKALIAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat"
    backLabel="Kembali ke Bilangan Bulat"
  />
);

export default PerkalianGamePage;
