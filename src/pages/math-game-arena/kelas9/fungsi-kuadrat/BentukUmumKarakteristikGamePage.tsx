import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Bentuk umum fungsi kuadrat adalah ...",
    options: ["f(x) = ax + b", "f(x) = ax² + bx + c", "f(x) = ax³ + bx + c", "f(x) = a/x + b"],
    correctIndex: 1,
  },
  {
    question: "Jika a > 0 pada fungsi kuadrat f(x) = ax² + bx + c, grafik berbentuk parabola ...",
    options: ["Terbuka ke bawah", "Terbuka ke atas", "Garis lurus", "Terbuka ke kanan"],
    correctIndex: 1,
  },
  {
    question: "Jika a < 0, grafik parabola ...",
    options: ["Terbuka ke atas", "Terbuka ke bawah", "Berbentuk garis", "Terbuka ke kiri"],
    correctIndex: 1,
  },
  {
    question: "Pada f(x) = 2x² - 3x + 1, nilai a adalah ...",
    options: ["-3", "1", "2", "-1"],
    correctIndex: 2,
  },
  {
    question: "Grafik fungsi kuadrat berbentuk ...",
    options: ["Garis lurus", "Hiperbola", "Parabola", "Lingkaran"],
    correctIndex: 2,
  },
];

const BentukUmumKarakteristikGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="BENTUK UMUM DAN KARAKTERISTIK GRAFIK"
    backPath="/math-game-arena/kelas-9/fungsi-kuadrat"
    backLabel="Kembali ke Fungsi Kuadrat"
  />
);

export default BentukUmumKarakteristikGamePage;
