import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Dua segitiga dikatakan sebangun jika ...",
    options: [
      "Ketiga sisinya sama panjang",
      "Sudut-sudutnya bersesuaian sama besar",
      "Luasnya sama",
      "Kelilingnya sama",
    ],
    correctIndex: 1,
  },
  {
    question: "Segitiga ABC sebangun dengan segitiga PQR. Jika sudut A = sudut P dan sudut B = sudut Q, maka sudut C = ...",
    options: ["Sudut P", "Sudut Q", "Sudut R", "Tidak bisa ditentukan"],
    correctIndex: 2,
  },
  {
    question: "Dua segitiga siku-siku dengan satu sudut lancip yang sama besar adalah ...",
    options: ["Kongruen", "Sebangun", "Tidak berhubungan", "Sama luasnya"],
    correctIndex: 1,
  },
  {
    question: "Segitiga ABC dan DEF sebangun. AB = 6, BC = 8, DE = 9. Berapakah EF?",
    options: ["10", "11", "12", "6"],
    correctIndex: 2,
  },
  {
    question: "Sebuah pohon setinggi 4 m menghasilkan bayangan 6 m. Sebuah tiang menghasilkan bayangan 9 m. Berapakah tinggi tiang?",
    options: ["5 m", "6 m", "7 m", "8 m"],
    correctIndex: 1,
  },
];

const SegitigaSebangunGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="SEGITIGA – SEGITIGA YANG SEBANGUN"
    backPath="/math-game-arena/kelas-9/kesebangunan-kekongruenan"
    backLabel="Kembali ke Kesebangunan & Kekongruenan"
  />
);

export default SegitigaSebangunGamePage;
