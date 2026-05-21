import FlappyRocketPage, { MQ } from "@/pages/math-game-arena/umum/FlappyRocketPage";

import { PEMBAGIAN_FLAPPY_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const questions: MQ[] = [
    { q: "10 ÷ 2 = ?", opts: ["12", "5", "-5", "-12"], ans: 1 },
    { q: "(-15) ÷ 5 = ?", opts: ["3", "-3", "10", "-10"], ans: 1 },
    { q: "(-24) ÷ (-6) = ?", opts: ["4", "-4", "18", "-18"], ans: 0 },
    { q: "0 ÷ 8 = ?", opts: ["8", "1", "0", "tak terdefinisi"], ans: 2 },
    { q: "16 ÷ (-4) = ?", opts: ["-4", "4", "-12", "12"], ans: 0 },
    { q: "(-12) ÷ 3 = ?", opts: ["4", "-4", "-9", "9"], ans: 1 },
    { q: "21 ÷ 7 = ?", opts: ["3", "14", "-3", "-14"], ans: 0 },
    { q: "(-9) ÷ (-1) = ?", opts: ["-9", "9", "0", "-1"], ans: 1 },
  ];

  const PembagianFlappyRocketGamePage = () => (
    <FlappyRocketPage
      questions={questions}
      topicLabel="PEMBAGIAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/pembagian"
      homePath="/menu"

      quizQuestions={PEMBAGIAN_FLAPPY_QUIZ}
    />
  );

  export default PembagianFlappyRocketGamePage;
  