import SnakeMathPage from "@/pages/math-game-arena/umum/SnakeMathPage";
  import type { GuruQuestion } from "@/hooks/useGuruQuiz";

  const QUESTIONS: GuruQuestion[] = [
    { question: "Hasil dari 10 ÷ 2 adalah ...", options: ["12", "5", "-5", "-12"], correctIdx: 1 },
    { question: "Hasil dari (−15) ÷ 5 adalah ...", options: ["3", "-3", "10", "-10"], correctIdx: 1 },
    { question: "Hasil dari (−24) ÷ (−6) adalah ...", options: ["4", "-4", "18", "-18"], correctIdx: 0 },
    { question: "Hasil dari 0 ÷ 8 adalah ...", options: ["8", "1", "0", "tak terdefinisi"], correctIdx: 2 },
    { question: "Hasil dari 9 ÷ 0 adalah ...", options: ["0", "9", "1", "tak terdefinisi"], correctIdx: 3 },
    { question: "Hasil dari (−12) ÷ 3 adalah ...", options: ["4", "-4", "-9", "9"], correctIdx: 1 },
    { question: "Hasil dari 21 ÷ 7 adalah ...", options: ["3", "14", "-3", "-14"], correctIdx: 0 },
    { question: "Hasil dari (−9) ÷ (−1) adalah ...", options: ["-9", "9", "0", "-1"], correctIdx: 1 },
    { question: "Hasil dari 18 ÷ (−3) adalah ...", options: ["6", "-6", "15", "-15"], correctIdx: 1 },
    { question: "Sifat: positif ÷ negatif = ...", options: ["positif", "negatif", "nol", "tidak tentu"], correctIdx: 1 },
    { question: "Sifat: negatif ÷ negatif = ...", options: ["positif", "negatif", "nol", "tidak tentu"], correctIdx: 0 },
    { question: "30 buah dibagi 6 anak. Setiap anak dapat ...", options: ["6", "5", "4", "3"], correctIdx: 1 },
  ];

  const PembagianSnakeMathGamePage = () => (
    <SnakeMathPage
      topicLabel="PEMBAGIAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/pembagian"
      homePath="/menu"
      quizQuestions={QUESTIONS}
      quizIntervalMs={25_000}
    />
  );

  export default PembagianSnakeMathGamePage;
  