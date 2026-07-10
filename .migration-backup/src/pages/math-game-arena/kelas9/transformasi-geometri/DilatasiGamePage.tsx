import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Titik A(4, 6) didilatasi dengan faktor skala 2 terhadap titik asal. Bayangannya adalah ...",
    options: ["(6, 8)", "(8, 12)", "(2, 3)", "(8, 6)"],
    correctIndex: 1,
  },
  {
    question: "Faktor skala dilatasi k = 3 artinya bayangan bangun ...",
    options: [
      "Diperkecil 3 kali",
      "Diperbesar 3 kali",
      "Diputar 3°",
      "Digeser 3 satuan",
    ],
    correctIndex: 1,
  },
  {
    question: "Titik B(6, 9) didilatasi dengan faktor skala 1/3 terhadap titik asal. Bayangannya adalah ...",
    options: ["(3, 3)", "(18, 27)", "(2, 3)", "(9, 12)"],
    correctIndex: 2,
  },
  {
    question: "Jika faktor skala k = -1, maka dilatasi setara dengan ...",
    options: ["Translasi", "Rotasi 90°", "Pencerminan terhadap titik pusat", "Pembesaran 1 kali"],
    correctIndex: 2,
  },
  {
    question: "Segitiga dengan luas 12 cm² didilatasi dengan faktor skala 2. Luas bayangannya adalah ...",
    options: ["24 cm²", "6 cm²", "48 cm²", "36 cm²"],
    correctIndex: 2,
  },
];

const DilatasiGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="DILATASI (PERKALIAN/PERUBAHAN UKURAN)"
    backPath="/math-game-arena/kelas-9/transformasi-geometri"
    backLabel="Kembali ke Transformasi Geometri"
  />
);

export default DilatasiGamePage;
