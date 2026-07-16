import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Lingkaran yang berada di dalam persegi dengan sisi 14 cm memiliki jari-jari ...",
    options: ["5 cm", "7 cm", "14 cm", "28 cm"],
    correctIndex: 1,
  },
  {
    question: "Luas daerah persegi yang tidak tertutup lingkaran jika persegi bersisi 14 cm dan r = 7 cm (π = 22/7) adalah ...",
    options: ["42 cm²", "196 cm²", "154 cm²", "42 cm²"],
    correctIndex: 0,
  },
  {
    question: "Jika lingkaran berdiameter 10 cm dikaitkan dengan persegi panjang 10 × 10 cm, luas lingkaran (π ≈ 3,14) adalah ...",
    options: ["78,5 cm²", "31,4 cm²", "100 cm²", "50 cm²"],
    correctIndex: 0,
  },
  {
    question: "Segitiga sama sisi dengan panjang sisi s memiliki lingkaran luar. Jari-jari lingkaran luar adalah ...",
    options: ["s/3", "s√3/3", "s/√3", "s"],
    correctIndex: 1,
  },
  {
    question: "Kaitan antara keliling lingkaran dan keliling persegi dengan sisi sama panjang dengan diameter lingkaran: keliling lingkaran ...",
    options: ["Sama dengan keliling persegi", "Lebih kecil dari keliling persegi", "Lebih besar dari keliling persegi", "Dua kali keliling persegi"],
    correctIndex: 1,
  },
];

const KaitanBangunDatarGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="KAITAN LINGKARAN DENGAN BANGUN DATAR LAINNYA"
    backPath="/math-game-arena/kelas-8/lingkaran"
    backLabel="Kembali ke Lingkaran"
  />
);

export default KaitanBangunDatarGamePage;
