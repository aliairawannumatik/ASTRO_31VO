import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Grafik fungsi f(x) = 2x adalah berupa ...",
    options: ["Kurva parabola", "Garis lurus melalui titik asal", "Garis horizontal", "Garis vertikal"],
    correctIndex: 1,
  },
  {
    question: "Titik yang dilalui grafik f(x) = x + 3 ketika x = 0 adalah ...",
    options: ["(0, 0)", "(0, 3)", "(3, 0)", "(1, 3)"],
    correctIndex: 1,
  },
  {
    question: "Jika f(x) = 2x - 4, titik potong grafik dengan sumbu X adalah ...",
    options: ["(0, -4)", "(2, 0)", "(4, 0)", "(-4, 0)"],
    correctIndex: 1,
  },
  {
    question: "Titik yang dilalui grafik f(x) = 3x ketika x = 2 adalah ...",
    options: ["(2, 5)", "(2, 6)", "(2, 7)", "(2, 8)"],
    correctIndex: 1,
  },
  {
    question: "Grafik fungsi f(x) = c (konstanta) berbentuk garis ...",
    options: ["Miring ke kanan", "Vertikal", "Horizontal", "Parabola"],
    correctIndex: 2,
  },
];

const GrafikFungsiGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="GRAFIK FUNGSI"
    backPath="/math-game-arena/kelas-8/relasi-dan-fungsi"
    backLabel="Kembali ke Relasi dan Fungsi"
  />
);

export default GrafikFungsiGamePage;
