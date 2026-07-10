import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Garis singgung persekutuan dalam (GSPD) adalah garis yang menyinggung dua lingkaran dan kedua lingkaran berada di ...",
    options: ["Sisi yang sama dari garis", "Sisi yang berbeda dari garis", "Di atas garis saja", "Di bawah garis saja"],
    correctIndex: 1,
  },
  {
    question: "Rumus panjang GSPD dengan jarak antar pusat d, jari-jari R dan r adalah ...",
    options: ["GSPD = √(d² - (R-r)²)", "GSPD = √(d² - (R+r)²)", "GSPD = √(d² + (R+r)²)", "GSPD = d + (R+r)"],
    correctIndex: 1,
  },
  {
    question: "Dua lingkaran berjari-jari 3 cm dan 4 cm berjarak antar pusat 15 cm. Panjang GSPD adalah ...",
    options: ["14 cm", "12 cm", "10 cm", "8 cm"],
    correctIndex: 0,
  },
  {
    question: "GSPD tidak dapat dibuat jika dua lingkaran ...",
    options: ["Berpisah", "Bersinggungan luar", "Berpotongan atau bertemu dalam", "Konsentris"],
    correctIndex: 2,
  },
  {
    question: "Perbedaan GSPL dan GSPD adalah posisi kedua lingkaran terhadap garis. GSPD memotong ...",
    options: ["Segmen penghubung dua pusat lingkaran", "Garis luar lingkaran", "Lingkaran di satu titik saja", "Tidak memotong apapun"],
    correctIndex: 0,
  },
];

const GSPDGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="GARIS SINGGUNG PERSEKUTUAN DALAM (GSPD)"
    backPath="/math-game-arena/kelas-8/garis-singgung-lingkaran"
    backLabel="Kembali ke Garis Singgung Lingkaran"
  />
);

export default GSPDGamePage;
