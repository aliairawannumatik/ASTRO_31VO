import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Seorang penjual teh menjual setiap gelas seharga Rp3.000 dengan biaya awal Rp15.000. Model persamaan penghasilan y = 3000x - 15000. Keuntungan saat menjual 10 gelas adalah ...",
    options: ["Rp10.000", "Rp15.000", "Rp30.000", "Rp45.000"],
    correctIndex: 1,
  },
  {
    question: "Taksi mengenakan tarif awal Rp5.000 dan Rp2.000 per km. Persamaan biaya y = 2000x + 5000. Biaya untuk 3 km adalah ...",
    options: ["Rp6.000", "Rp10.000", "Rp11.000", "Rp15.000"],
    correctIndex: 2,
  },
  {
    question: "Dari persamaan y = 4x + 2, nilai y ketika x = 5 adalah ...",
    options: ["20", "22", "24", "26"],
    correctIndex: 1,
  },
  {
    question: "Suhu di puncak gunung turun 2°C setiap naik 100m. Jika suhu awal 20°C, suhu di 300m adalah ...",
    options: ["12°C", "14°C", "16°C", "18°C"],
    correctIndex: 1,
  },
  {
    question: "Sebuah lilin setinggi 20 cm terbakar habis dalam 4 jam. Tinggi lilin setelah 1 jam (dalam cm) adalah ...",
    options: ["12", "15", "16", "18"],
    correctIndex: 1,
  },
];

const AplikasiKontekstualPGLGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="APLIKASI PERSAMAAN GARIS PADA SOAL KONTEKSTUAL"
    backPath="/math-game-arena/kelas-8/persamaan-garis-lurus"
    backLabel="Kembali ke Persamaan Garis Lurus"
  />
);

export default AplikasiKontekstualPGLGamePage;
