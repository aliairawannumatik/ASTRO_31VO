import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Garis singgung persekutuan luar (GSPL) adalah garis yang menyinggung dua lingkaran dan kedua lingkaran berada di ...",
    options: ["Sisi yang sama dari garis", "Sisi yang berbeda dari garis", "Di atas garis", "Di bawah garis"],
    correctIndex: 0,
  },
  {
    question: "Rumus panjang GSPL dengan jarak antar pusat d, jari-jari R dan r (R > r) adalah ...",
    options: ["GSPL = √(d² - (R-r)²)", "GSPL = √(d² - (R+r)²)", "GSPL = √(d² + (R-r)²)", "GSPL = d - (R+r)"],
    correctIndex: 0,
  },
  {
    question: "Dua lingkaran berjari-jari 9 cm dan 4 cm dengan jarak antar pusat 13 cm. Panjang GSPL adalah ...",
    options: ["10 cm", "12 cm", "14 cm", "15 cm"],
    correctIndex: 1,
  },
  {
    question: "GSPL dapat dibuat jika dua lingkaran dalam keadaan ...",
    options: ["Bertemu dalam", "Berpisah atau bersinggungan luar", "Satu di dalam yang lain", "Konsentris"],
    correctIndex: 1,
  },
  {
    question: "Jika d = 10, R = 5, r = 2, panjang GSPL = ...",
    options: ["√91", "√91 ≈ 9,5", "√19", "√100"],
    correctIndex: 1,
  },
];

const GSPLGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="GARIS SINGGUNG PERSEKUTUAN LUAR (GSPL)"
    backPath="/math-game-arena/kelas-8/garis-singgung-lingkaran"
    backLabel="Kembali ke Garis Singgung Lingkaran"
  />
);

export default GSPLGamePage;
