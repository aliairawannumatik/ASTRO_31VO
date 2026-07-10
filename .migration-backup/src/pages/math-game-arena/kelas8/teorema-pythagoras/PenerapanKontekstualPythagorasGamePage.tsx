import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Seorang anak berjalan 8 m ke timur dan 6 m ke utara. Jarak lurus dari posisi awal ke akhir adalah ...",
    options: ["10 m", "12 m", "14 m", "16 m"],
    correctIndex: 0,
  },
  {
    question: "Sebuah layar TV berukuran 30 inci × 40 inci. Panjang diagonal layar tersebut adalah ...",
    options: ["40 inci", "50 inci", "60 inci", "70 inci"],
    correctIndex: 1,
  },
  {
    question: "Tangga 13 m disandarkan ke tembok. Kaki tangga berjarak 5 m dari tembok. Tinggi tembok yang dicapai tangga adalah ...",
    options: ["10 m", "12 m", "14 m", "15 m"],
    correctIndex: 1,
  },
  {
    question: "Lapangan persegi panjang 24 m × 10 m. Panjang diagonal lapangan adalah ...",
    options: ["24 m", "26 m", "28 m", "30 m"],
    correctIndex: 1,
  },
  {
    question: "Sebuah kapal berlayar 12 km ke utara lalu 9 km ke timur. Jarak kapal dari titik asal adalah ...",
    options: ["12 km", "15 km", "18 km", "21 km"],
    correctIndex: 1,
  },
];

const PenerapanKontekstualPythagorasGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENERAPAN TEOREMA PYTHAGORAS PADA MASALAH KONTEKSTUAL"
    backPath="/math-game-arena/kelas-8/teorema-pythagoras"
    backLabel="Kembali ke Teorema Pythagoras"
  />
);

export default PenerapanKontekstualPythagorasGamePage;
