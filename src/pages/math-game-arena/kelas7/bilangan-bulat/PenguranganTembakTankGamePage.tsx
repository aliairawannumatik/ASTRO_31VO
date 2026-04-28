import BattleTankPage, { MQ } from "@/pages/math-game-arena/umum/BattleTankPage";

  const questions: MQ[] = [
    { q: "10 - 3 = ...", opts: ["7", "13", "-7", "-13"], ans: 0 },
    { q: "4 - 9 = ...", opts: ["-5", "5", "-13", "13"], ans: 0 },
    { q: "(-2) - 6 = ...", opts: ["-8", "4", "-4", "8"], ans: 0 },
    { q: "(-5) - (-3) = ...", opts: ["-2", "8", "-8", "2"], ans: 0 },
    { q: "12 - (-4) = ...", opts: ["16", "-16", "8", "-8"], ans: 0 },
    { q: "0 - 8 = ...", opts: ["-8", "8", "0", "1"], ans: 0 },
    { q: "(-7) - 2 = ...", opts: ["-9", "5", "-5", "9"], ans: 0 },
    { q: "15 - 22 = ...", opts: ["-7", "7", "37", "-37"], ans: 0 },
    { q: "(-9) - (-12) = ...", opts: ["3", "-3", "21", "-21"], ans: 0 },
    { q: "Suhu 2°C turun 6°C → ...", opts: ["-4°C", "8°C", "4°C", "-8°C"], ans: 0 },
    { q: "Saldo Rp10.000 - Rp15.000 = ...", opts: ["-Rp5.000", "Rp5.000", "Rp25.000", "-Rp25.000"], ans: 0 },
    { q: "(-1) - (-1) = ...", opts: ["0", "-2", "2", "1"], ans: 0 },
  ];

  const PenguranganTembakTankGamePage = () => (
    <BattleTankPage
      questions={questions}
      topicLabel="PENGURANGAN BILANGAN BULAT · Tembak tank dengan jawaban benar!"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/pengurangan"
      homePath="/menu"
    />
  );

  export default PenguranganTembakTankGamePage;
  