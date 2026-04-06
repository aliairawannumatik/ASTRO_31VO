import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Manakah yang merupakan himpunan?",
    options: ["Kumpulan orang-orang yang tinggi", "Himpunan bilangan prima kurang dari 10", "Sekumpulan bilangan besar", "Kelompok murid yang pintar"],
    correctIndex: 1,
  },
  {
    question: "Himpunan A = {1, 2, 3, 4, 5}. Manakah yang BUKAN anggota A?",
    options: ["1", "3", "5", "6"],
    correctIndex: 3,
  },
  {
    question: "Banyak anggota himpunan B = {a, b, c, d, e} dilambangkan dengan ...",
    options: ["n(B) = 4", "n(B) = 5", "n(B) = 6", "n(B) = 3"],
    correctIndex: 1,
  },
  {
    question: "Lambang '∈' pada matematika himpunan berarti ...",
    options: ["Tidak anggota dari", "Anggota dari", "Himpunan bagian", "Himpunan universal"],
    correctIndex: 1,
  },
  {
    question: "Himpunan C = {bilangan genap antara 1 dan 10}. Banyak anggota C adalah ...",
    options: ["3", "4", "5", "6"],
    correctIndex: 1,
  },
];

const PengertianKeanggotaanGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENGERTIAN DAN KEANGGOTAAN HIMPUNAN"
    backPath="/math-game-arena/kelas-7/himpunan"
    backLabel="Kembali ke Himpunan"
  />
);

export default PengertianKeanggotaanGamePage;
