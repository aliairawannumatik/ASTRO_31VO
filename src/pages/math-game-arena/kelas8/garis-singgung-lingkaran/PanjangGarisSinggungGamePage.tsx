import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Rumus panjang garis singgung dari titik P di luar lingkaran dengan jarak OP = d dan jari-jari r adalah ...",
    options: ["l = √(d + r)", "l = √(d² - r²)", "l = √(d² + r²)", "l = d - r"],
    correctIndex: 1,
  },
  {
    question: "Titik P berjarak 13 cm dari pusat lingkaran yang berjari-jari 5 cm. Panjang garis singgung dari P adalah ...",
    options: ["8 cm", "10 cm", "12 cm", "14 cm"],
    correctIndex: 2,
  },
  {
    question: "Titik A berjarak 10 cm dari pusat lingkaran berjari-jari 6 cm. Panjang garis singgung dari A adalah ...",
    options: ["4 cm", "6 cm", "8 cm", "10 cm"],
    correctIndex: 2,
  },
  {
    question: "Dua garis singgung dari titik yang sama di luar lingkaran memiliki panjang yang ...",
    options: ["Berbeda", "Sama", "Tergantung posisi", "Tidak bisa ditentukan"],
    correctIndex: 1,
  },
  {
    question: "Jika jarak titik P ke pusat = 17 cm dan r = 8 cm, panjang garis singgung adalah ...",
    options: ["9 cm", "13 cm", "15 cm", "25 cm"],
    correctIndex: 2,
  },
];

const PanjangGarisSinggungGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="MENGHITUNG PANJANG GARIS SINGGUNG DARI TITIK DI LUAR LINGKARAN"
    backPath="/math-game-arena/kelas-8/garis-singgung-lingkaran"
    backLabel="Kembali ke Garis Singgung Lingkaran"
  />
);

export default PanjangGarisSinggungGamePage;
