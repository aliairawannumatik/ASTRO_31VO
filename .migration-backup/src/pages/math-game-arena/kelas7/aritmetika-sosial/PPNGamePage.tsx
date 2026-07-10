import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Sebuah kulkas dijual dengan harga Rp3.000.000. Jika pembeli dikenakan PPN sebesar 11%, berapakah nominal PPN yang harus dibayar?",
    options: ["Rp3.330.000", "Rp300.000", "Rp330.000", "Rp311.000"],
    correctIndex: 2,
  },
  {
    question: "Siska makan di restoran dengan total pesanan Rp150.000. Restoran memungut PPN 10%. Berapa uang yang harus dibayar Siska?",
    options: ["Rp135.000", "Rp150.000", "Rp160.000", "Rp165.000"],
    correctIndex: 3,
  },
  {
    question: "Budi membeli sepeda motor dan membayar total Rp16.650.000 termasuk PPN 11%. Berapakah harga sepeda motor sebelum PPN?",
    options: ["Rp16.000.000", "Rp14.500.000", "Rp15.500.000", "Rp15.000.000"],
    correctIndex: 3,
  },
  {
    question: "Siti membeli tas seharga Rp400.000. Di kasir ia membayar Rp448.000. Berapa persentase PPN yang dibebankan kepada Siti?",
    options: ["15%", "11%", "12%", "10%"],
    correctIndex: 2,
  },
  {
    question: "Sebuah kemeja harganya Rp300.000. Toko memberikan diskon 15%, namun setelah diskon dikenakan PPN 11%. Berapakah harga akhir yang harus dibayar?",
    options: ["Rp275.000", "Rp255.000", "Rp283.050", "Rp288.000"],
    correctIndex: 2,
  },
];

const PPNGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PAJAK PERTAMBAHAN NILAI (PPN)"
    backPath="/math-game-arena/kelas-7/aritmetika-sosial"
    backLabel="Kembali ke Aritmetika Sosial"
  />
);

export default PPNGamePage;
