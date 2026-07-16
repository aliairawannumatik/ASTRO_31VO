import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Pada segitiga siku-siku sama kaki (45°-45°-90°) dengan sisi tegak a, hipotenusanya adalah ...",
    options: ["a", "2a", "a√2", "a√3"],
    correctIndex: 2,
  },
  {
    question: "Pada segitiga 30°-60°-90° dengan sisi terpendek a, sisi terpanjang (hipotenusa) adalah ...",
    options: ["a√3", "2a", "a√2", "3a"],
    correctIndex: 1,
  },
  {
    question: "Pada segitiga 30°-60°-90° dengan sisi terpendek a, sisi sedang adalah ...",
    options: ["2a", "a√2", "a√3", "a/2"],
    correctIndex: 2,
  },
  {
    question: "Jika segitiga 45°-45°-90° memiliki hipotenusa 10√2, maka sisi tegaknya adalah ...",
    options: ["5", "10", "10√2", "20"],
    correctIndex: 1,
  },
  {
    question: "Pada segitiga 30°-60°-90° dengan hipotenusa 20, sisi terpendeknya adalah ...",
    options: ["5", "10", "15", "20"],
    correctIndex: 1,
  },
];

const SudutKhususGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PERBANDINGAN SISI SEGITIGA SIKU-SIKU SUDUT KHUSUS"
    backPath="/math-game-arena/kelas-8/teorema-pythagoras"
    backLabel="Kembali ke Teorema Pythagoras"
  />
);

export default SudutKhususGamePage;
