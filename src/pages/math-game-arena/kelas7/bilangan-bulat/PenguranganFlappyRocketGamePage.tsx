import FlappyRocketPage, { MQ } from "@/pages/math-game-arena/umum/FlappyRocketPage";

import { PENGURANGAN_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const questions: MQ[] = [
    { q: "9 - 4 = ?", opts: ["13", "5", "-5", "-13"], ans: 1 },
    { q: "6 - 11 = ?", opts: ["5", "-5", "17", "-17"], ans: 1 },
    { q: "(-3) - 5 = ?", opts: ["2", "-2", "-8", "8"], ans: 2 },
    { q: "8 - (-2) = ?", opts: ["6", "10", "-10", "-6"], ans: 1 },
    { q: "(-4) - (-9) = ?", opts: ["-13", "13", "5", "-5"], ans: 2 },
    { q: "Suhu 3°C\nturun 7°C. Jadi?", opts: ["10°C", "-4°C", "4°C", "-10°C"], ans: 1 },
    { q: "Lift lt -1\nturun 4 lt = ?", opts: ["3", "-3", "5", "-5"], ans: 3 },
    { q: "0 - 6 = ?", opts: ["6", "-6", "0", "1"], ans: 1 },
  ];

  const PenguranganFlappyRocketGamePage = () => (
    <FlappyRocketPage
      questions={questions}
      topicLabel="PENGURANGAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/pengurangan"
      homePath="/menu"

      quizQuestions={PENGURANGAN_QUIZ}
    />
  );

  export default PenguranganFlappyRocketGamePage;
  