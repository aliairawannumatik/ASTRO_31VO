import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Notasi fungsi f yang memetakan x ke 3x + 1 ditulis sebagai ...",
    options: ["f: x → 3x + 1", "f(3x + 1) = x", "f = 3x + 1", "x: f → 3x + 1"],
    correctIndex: 0,
  },
  {
    question: "Jika f(x) = 3x + 1, maka f(4) = ...",
    options: ["11", "12", "13", "14"],
    correctIndex: 2,
  },
  {
    question: "Jika f(x) = x² - 2, maka f(3) = ...",
    options: ["5", "7", "9", "11"],
    correctIndex: 1,
  },
  {
    question: "Jika f(x) = 2x - 5 dan f(a) = 9, maka nilai a adalah ...",
    options: ["5", "6", "7", "8"],
    correctIndex: 2,
  },
  {
    question: "Jika f(x) = 4x + 3, maka f(-2) = ...",
    options: ["-5", "-4", "-3", "11"],
    correctIndex: 0,
  },
];

const NotasiRumusGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="NOTASI DAN RUMUS FUNGSI"
    backPath="/math-game-arena/kelas-8/relasi-dan-fungsi"
    backLabel="Kembali ke Relasi dan Fungsi"
  />
);

export default NotasiRumusGamePage;
