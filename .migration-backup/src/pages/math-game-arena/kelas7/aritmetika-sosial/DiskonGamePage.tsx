import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Sebuah sepatu seharga Rp250.000 sedang didiskon sebesar 20%. Berapakah harga akhir yang harus dibayar oleh pembeli?",
    options: ["Rp230.000", "Rp300.000", "Rp200.000", "Rp50.000"],
    correctIndex: 2,
  },
  {
    question: "Rani akan membeli 3 tas (Rp80.000, disc 15%), 2 sendal (Rp50.000, disc 25%), dan 1 sepatu (Rp120.000, disc 20%). Berapakah uang yang harus dibayarkan?",
    options: ["Rp360.000", "Rp365.000", "Rp370.000", "Rp375.000"],
    correctIndex: 3,
  },
  {
    question: "Setelah mendapat diskon 20%, Budi membayar sebuah kemeja seharga Rp240.000. Berapa harga awal kemeja tersebut sebelum diberi diskon?",
    options: ["Rp260.000", "Rp300.000", "Rp288.000", "Rp320.000"],
    correctIndex: 1,
  },
  {
    question: "Sebuah toko koper memasang promo 'Diskon 50% + 20%'. Jika harga awal koper adalah Rp500.000, berapakah harga yang harus dibayar di kasir?",
    options: ["Rp150.000", "Rp350.000", "Rp200.000", "Rp250.000"],
    correctIndex: 2,
  },
  {
    question: "Sebuah sepeda yang awalnya berharga Rp1.000.000 dijual dengan harga Rp800.000. Berapa persentase diskon yang diberikan?",
    options: ["25%", "20%", "15%", "80%"],
    correctIndex: 1,
  },
];

const DiskonGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="DISKON"
    backPath="/math-game-arena/kelas-7/aritmetika-sosial"
    backLabel="Kembali ke Aritmetika Sosial"
  />
);

export default DiskonGamePage;
