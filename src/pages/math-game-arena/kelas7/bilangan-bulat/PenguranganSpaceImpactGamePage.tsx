import SpaceImpactPage, { MQ } from "@/pages/math-game-arena/umum/SpaceImpactPage";

  const questions: MQ[] = [
    { q: "8 - 3", ans: 5 },
    { q: "5 - 9", ans: -4 },
    { q: "(-3) - 4", ans: -7 },
    { q: "(-7) - (-2)", ans: -5 },
    { q: "12 - 12", ans: 0 },
    { q: "6 - (-3)", ans: 9 },
    { q: "0 - 5", ans: -5 },
    { q: "(-8) - (-1)", ans: -7 },
    { q: "11 - 15", ans: -4 },
    { q: "(-4) - 6", ans: -10 },
    { q: "9 - (-2)", ans: 11 },
    { q: "7 - 10", ans: -3 },
  ];

  const PenguranganSpaceImpactGamePage = () => (
    <SpaceImpactPage
      questions={questions}
      topicLabel="PENGURANGAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/pengurangan"
      homePath="/menu"
    />
  );

  export default PenguranganSpaceImpactGamePage;
  