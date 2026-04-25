import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Urutan naik (dari yang terkecil ke yang terbesar) yang paling tepat dari bilangan -15, -30, 12 adalah ...",
    options: ["-15, -30, 12", "-30, 12, -15", "-30, -15, 12", "12, -15, -30"],
    correctIndex: 2,
  },
  {
    question: "Berapakah nilai dari hasil operasi 32 + (-45)?",
    options: ["-77", "77", "-13", "13"],
    correctIndex: 2,
  },
  {
    question: "Berapakah nilai dari hasil penjumlahan -18 + (-14)?",
    options: ["-4", "-32", "4", "32"],
    correctIndex: 1,
  },
  {
    question: "Pada suatu pagi, suhu di sebuah ruangan pendingin adalah -3°C. Berapa derajat suhu di ruangan tersebut jika mengalami kenaikan sebesar 8°C?",
    options: ["11°C", "-11°C", "5°C", "-5°C"],
    correctIndex: 2,
  },
  {
    question: "Suhu sebuah ruangan biasa tercatat 28°C. Suhu di dalam lemari pembeku (freezer) 35°C lebih rendah dari suhu ruangan tersebut. Berapa suhu di dalam lemari pembeku saat ini?",
    options: ["-63°C", "7°C", "-7°C", "63°C"],
    correctIndex: 2,
  },
];

const PesawatTembakMeteorPenjumlahanPage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="LKPD - PENJUMLAHAN BILANGAN BULAT"
    backPath="/lkpd/kelas-7/bilangan-bulat/penjumlahan"
    backLabel="Kembali ke LKPD Penjumlahan"
  />
);

export default PesawatTembakMeteorPenjumlahanPage;
