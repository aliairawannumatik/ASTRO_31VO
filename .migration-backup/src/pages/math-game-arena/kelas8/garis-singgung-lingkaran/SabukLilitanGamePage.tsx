import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Sabuk lilitan minimal menghubungkan dua lingkaran menggunakan ...",
    options: ["Hanya garis lurus", "GSPL dan busur-busur lingkaran", "Hanya busur lingkaran", "Tali busur"],
    correctIndex: 1,
  },
  {
    question: "Dua silinder dengan jari-jari sama r dililit sabuk. Panjang bagian lurus sabuk (jarak antar pusat = d) adalah ...",
    options: ["2d", "d", "2r", "πr"],
    correctIndex: 0,
  },
  {
    question: "Rumus panjang sabuk lilitan minimal untuk dua lingkaran sama besar dengan r = r dan jarak pusat = d adalah ...",
    options: ["2d + 2πr", "d + πr", "2d + πr", "2πr + d"],
    correctIndex: 0,
  },
  {
    question: "Konsep sabuk lilitan minimal digunakan dalam kehidupan sehari-hari pada ...",
    options: ["Pembuatan roda gigi", "Perhitungan luas tanah", "Pengukuran sudut", "Perhitungan volume"],
    correctIndex: 0,
  },
  {
    question: "Dua pipa dengan r = 7 cm berjarak 20 cm (antar pusat). Panjang sabuk lilitannya (π = 22/7) adalah ...",
    options: ["44 cm", "64 cm", "84 cm", "40 cm + 44 cm = 84 cm"],
    correctIndex: 2,
  },
];

const SabukLilitanGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="SABUK LILITAN MINIMAL (PENERAPAN)"
    backPath="/math-game-arena/kelas-8/garis-singgung-lingkaran"
    backLabel="Kembali ke Garis Singgung Lingkaran"
  />
);

export default SabukLilitanGamePage;
