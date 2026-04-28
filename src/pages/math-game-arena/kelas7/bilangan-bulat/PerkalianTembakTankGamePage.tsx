import BattleTankPage, { MQ } from "@/pages/math-game-arena/umum/BattleTankPage";

  const questions: MQ[] = [
    { q: "4 × 5 = ...", opts: ["20", "9", "-20", "-9"], ans: 0 },
    { q: "(-3) × 4 = ...", opts: ["-12", "12", "-7", "7"], ans: 0 },
    { q: "(-6) × (-2) = ...", opts: ["12", "-12", "-8", "8"], ans: 0 },
    { q: "7 × (-3) = ...", opts: ["-21", "21", "-10", "10"], ans: 0 },
    { q: "9 × 0 = ...", opts: ["0", "9", "-9", "1"], ans: 0 },
    { q: "(-5) × 3 = ...", opts: ["-15", "15", "-8", "8"], ans: 0 },
    { q: "8 × 2 = ...", opts: ["16", "10", "-16", "-10"], ans: 0 },
    { q: "(-4) × (-4) = ...", opts: ["16", "-16", "0", "8"], ans: 0 },
    { q: "1 × (-7) = ...", opts: ["-7", "7", "0", "1"], ans: 0 },
    { q: "(-2) × 8 = ...", opts: ["-16", "16", "-10", "10"], ans: 0 },
    { q: "10 × (-1) = ...", opts: ["-10", "10", "9", "-9"], ans: 0 },
    { q: "(-3) × (-7) = ...", opts: ["21", "-21", "10", "-10"], ans: 0 },
  ];

  const PerkalianTembakTankGamePage = () => (
    <BattleTankPage
      questions={questions}
      topicLabel="PERKALIAN BILANGAN BULAT · Tembak tank dengan jawaban benar!"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/perkalian"
      homePath="/menu"
    />
  );

  export default PerkalianTembakTankGamePage;
  