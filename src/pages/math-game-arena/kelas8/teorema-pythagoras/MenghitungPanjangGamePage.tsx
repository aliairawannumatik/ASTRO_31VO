import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Sebuah segitiga siku-siku memiliki sisi a = 6 dan b = 8. Panjang hipotenusa c = ...",
    options: ["12", "14", "10", "16"],
    correctIndex: 2,
  },
  {
    question: "Hipotenusa = 13 dan salah satu sisi = 5. Panjang sisi lainnya adalah ...",
    options: ["10", "12", "14", "8"],
    correctIndex: 1,
  },
  {
    question: "Sebuah tangga panjang 10 m bersandar ke tembok setinggi 8 m. Jarak kaki tangga dari tembok adalah ...",
    options: ["4 m", "6 m", "8 m", "10 m"],
    correctIndex: 1,
  },
  {
    question: "Diagonal persegi dengan sisi 5 cm adalah ...",
    options: ["5√2 cm", "10 cm", "5 cm", "25 cm"],
    correctIndex: 0,
  },
  {
    question: "Sisi-sisi segitiga siku-siku adalah 9, 12, dan ... (hipotenusa).",
    options: ["13", "14", "15", "16"],
    correctIndex: 2,
  },
];

const MenghitungPanjangGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="MENGHITUNG PANJANG SEGITIGA SIKU-SIKU"
    backPath="/math-game-arena/kelas-8/teorema-pythagoras"
    backLabel="Kembali ke Teorema Pythagoras"
  />
);

export default MenghitungPanjangGamePage;
