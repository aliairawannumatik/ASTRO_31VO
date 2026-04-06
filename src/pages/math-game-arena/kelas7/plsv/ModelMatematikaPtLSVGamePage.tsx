import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Nilai minimum suatu bilangan bulat agar ketika dikalikan 3 hasilnya lebih dari 15 adalah ...",
    options: ["5", "6", "7", "8"],
    correctIndex: 1,
  },
  {
    question: "Seorang anak memiliki uang Rp 50.000. Ia ingin membeli buku seharga Rp 8.000 per buah. Paling banyak berapa buku yang dapat ia beli?",
    options: ["4 buku", "5 buku", "6 buku", "7 buku"],
    correctIndex: 2,
  },
  {
    question: "Umur Ani lebih dari 3 kali umur adiknya. Jika umur adiknya x tahun dan umur Ani paling sedikit 18 tahun, pertidaksamaannya adalah ...",
    options: ["3x < 18", "3x > 18", "3x ≥ 18", "3x ≤ 18"],
    correctIndex: 2,
  },
  {
    question: "Suhu di dalam kulkas tidak boleh melebihi -5°C. Model matematika suhu (T) adalah ...",
    options: ["T > -5", "T < -5", "T ≤ -5", "T ≥ -5"],
    correctIndex: 2,
  },
  {
    question: "Nilai minimum bilangan bulat x agar 2x + 1 > 9 adalah ...",
    options: ["x = 4", "x = 5", "x = 6", "x = 7"],
    correctIndex: 1,
  },
];

const ModelMatematikaPtLSVGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="MODEL MATEMATIKA DAN PENERAPAN PtLSV"
    backPath="/math-game-arena/kelas-7/plsv-ptlsv"
    backLabel="Kembali ke PLSV"
  />
);

export default ModelMatematikaPtLSVGamePage;
