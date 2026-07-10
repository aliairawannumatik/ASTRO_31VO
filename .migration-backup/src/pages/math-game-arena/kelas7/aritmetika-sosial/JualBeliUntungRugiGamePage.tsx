import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Seorang pedagang buah membeli satu keranjang mangga dengan harga Rp250.000,00. Setelah dijual habis, pedagang tersebut menerima uang total sebesar Rp235.000,00. Bagaimana kondisi keuangan pedagang tersebut?",
    options: ["Untung Rp25.000", "Rugi Rp25.000", "Untung Rp15.000", "Rugi Rp15.000"],
    correctIndex: 3,
  },
  {
    question: "Riko membeli sebuah sepatu olahraga seharga Rp400.000,00. Jika Riko ingin menjual kembali dengan keuntungan 20%, berapakah harga jualnya?",
    options: ["Rp460.000", "Rp420.000", "Rp480.000", "Rp500.000"],
    correctIndex: 2,
  },
  {
    question: "Ibu menjual sebuah kue tart dengan harga Rp150.000,00 dan mendapat keuntungan 25%. Berapakah modal awal (harga beli) Ibu untuk membuat kue tersebut?",
    options: ["Rp120.000", "Rp112.500", "Rp125.000", "Rp100.000"],
    correctIndex: 0,
  },
  {
    question: "Pemilik toko membeli 1 pak pulpen isi 10 buah seharga Rp20.000, lalu dijual Rp2.500/buah. Berapakah persentase keuntungannya?",
    options: ["20%", "50%", "25%", "15%"],
    correctIndex: 2,
  },
  {
    question: "Seorang kolektor membeli mainan langka seharga Rp1.200.000,00 lalu menjualnya kembali dengan kerugian 15%. Berapakah harga jual mainan tersebut?",
    options: ["Rp1.185.000", "Rp1.000.000", "Rp1.020.000", "Rp980.000"],
    correctIndex: 2,
  },
];

const JualBeliUntungRugiGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="JUAL BELI, UNTUNG DAN RUGI"
    backPath="/math-game-arena/kelas-7/aritmetika-sosial"
    backLabel="Kembali ke Aritmetika Sosial"
  />
);

export default JualBeliUntungRugiGamePage;
