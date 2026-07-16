import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Ibu Dina menerima honorarium sebesar Rp8.000.000. Jika dipotong PPh sebesar 5%, berapakah nominal potongan pajaknya?",
    options: ["Rp200.000", "Rp400.000", "Rp600.000", "Rp800.000"],
    correctIndex: 1,
  },
  {
    question: "Bagas memenangkan hadiah undian Rp20.000.000 dan dikenakan PPh Final 25%. Berapakah uang bersih yang akan diterima Bagas?",
    options: ["Rp5.000.000", "Rp10.000.000", "Rp15.000.000", "Rp19.500.000"],
    correctIndex: 2,
  },
  {
    question: "Seorang pekerja lepas menerima bayaran bersih Rp7.600.000 setelah dipotong PPh 5%. Berapakah bayaran kotor sebenarnya?",
    options: ["Rp7.220.000", "Rp7.980.000", "Rp8.000.000", "Rp8.400.000"],
    correctIndex: 2,
  },
  {
    question: "Gaji kotor Pak Budi Rp9.000.000/bulan, PTKP Rp5.000.000/bulan, PPh 5% dari PKP. Berapakah total gaji bersih Pak Budi dalam 1 tahun?",
    options: ["Rp103.200.000", "Rp105.600.000", "Rp106.800.000", "Rp108.000.000"],
    correctIndex: 1,
  },
  {
    question: "Paman Heri menerima gaji bersih Rp9.400.000. PPh 10% dari PKP dan PTKP Rp4.000.000. Berapakah gaji kotor Paman Heri?",
    options: ["Rp9.800.000", "Rp10.000.000", "Rp10.200.000", "Rp10.400.000"],
    correctIndex: 1,
  },
];

const PPhGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PAJAK PENGHASILAN (PPh)"
    backPath="/math-game-arena/kelas-7/aritmetika-sosial"
    backLabel="Kembali ke Aritmetika Sosial"
  />
);

export default PPhGamePage;
