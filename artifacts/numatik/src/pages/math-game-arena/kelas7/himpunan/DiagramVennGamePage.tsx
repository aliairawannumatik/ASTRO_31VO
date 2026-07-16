import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Diagram Venn digunakan untuk ...",
    options: ["Menghitung luas himpunan", "Menyatakan hubungan antar himpunan secara visual", "Mencari anggota himpunan", "Menggambar himpunan kosong"],
    correctIndex: 1,
  },
  {
    question: "Jika A = {1,2,3,4} dan B = {3,4,5,6}, maka A ∩ B (irisan) adalah ...",
    options: ["{1,2,3,4,5,6}", "{3,4}", "{1,2}", "{5,6}"],
    correctIndex: 1,
  },
  {
    question: "Jika A = {1,2,3} dan B = {4,5,6}, maka A ∪ B (gabungan) adalah ...",
    options: ["{1,2,3}", "{4,5,6}", "{1,2,3,4,5,6}", "{}"],
    correctIndex: 2,
  },
  {
    question: "Komplemen himpunan A (A') adalah ...",
    options: ["Anggota A yang juga di B", "Anggota di S tetapi tidak di A", "Anggota A yang tidak di B", "Semua anggota A"],
    correctIndex: 1,
  },
  {
    question: "Jika S = {1,2,3,4,5,6} dan A = {2,4,6}, maka A' adalah ...",
    options: ["{1,3,5}", "{2,4,6}", "{1,2,3}", "{4,5,6}"],
    correctIndex: 0,
  },
];

const DiagramVennGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="DIAGRAM VENN"
    backPath="/math-game-arena/kelas-7/himpunan"
    backLabel="Kembali ke Himpunan"
  />
);

export default DiagramVennGamePage;
